### Event-driven programming
When Ryan Dahl started to develop Node.js he was looking for a way to write a non-blocking server. He tried many different languages, like C and Lua, but then he realized that the nature of JavaScript made it the perfect language to push his project forward. JavaScript has models for asynchronous programming, closures, and when Google (its Danish department) released their V8 engine at the same time, he went for JavaScript as the language for the Node platform.

If you read the text above you realize that Node's single-threaded nature requires some way to program for creating these callbacks that are needed. When you read about Node.js you will hear about this as *event-driven programming*. You should already be familiar with JavaScript and asynchronous programming. Many programmers have used languages like PHP and Java before and are used to a more synchronous approach, meaning the code executes row by row, from top to bottom.

```php
$homepage = file_get_contents('http://www.example.com/'); // this is blocking code
echo $homepage; // Write the data to the output
```

The example above is PHP code and waits for the first row to execute before the `echo` statement is executed. The `file_get_contents` function is reading a page from the network and it can take some time, meaning this thread is blocked. That's not a good thing if you are in a single-threaded environment, but ok if you're in a multi-threaded one.

In JavaScript we have many examples of asynchronous programming where the program does not stop and wait for the call to be ready.

```js
var req = new XMLHttpRequest();
req.addEventListener("load", function(){
    // function to run after we got the response from the server
    console.log(req.responseText);
});

req.open("GET", "data.json");
req.send();
console.log(req.responseText); // UNDEFINED!!!!
```

As you can see above, we add an event handler where we write the code we want to run when the event has happened (in this case the load event of the `XMLHttpRequest` object). It's important to understand that the last row in the example will print out `undefined` because that code will run before the `load` event has trigged and the data has arrived. You should all know about the JavaScript queue and how events are handled by the browser.

In Node.js we usually talk about the *event loop* which works in similar ways. One thing to remember about Node is that all code runs in one single thread. On other platforms there could be code running in multiple threads independent of each other. That means that many parallel processes (such as web requests to a web server) would fork a new thread and run its code in it. This has some pros, but if you have a lot of requests/processes many threads will be created and the server needs a lot of hardware resources. Since Node has a single thread with an event loop it does not spend time/resources waiting for things to finish. Instead, it's able to sequentially execute a number of tasks very rapidly. This is why Node is so fast and could maintain good performance on smaller hardware servers.

### How to do event-driven programming?
So we now know how Node works, but what kind of patterns do we use when we're programming on Node? Below follows some common patterns that you will run into when studying this.

#### Callback pattern
This is the simplest and maybe the most used pattern when looking at how Node modules are made. Since functions can be treated as variables in JavaScript we can use a function as an argument to another function. The nature of closures allows us to call that callback function when the stuff we're doing is ready. Let's see an example taken from the documentation of the `FileSystem` module in the Node core:

```js
var fs = require("fs");
fs.readFile('/etc/passwd', function (err, data) {
  if (err) {
    throw err;
  }
  console.log(data);
});
```

As you can see, the method `readFile` in the `FileSystem` object takes a path and a callback function. That callback function will be called when the file has been read or there has been something wrong. This callback function should always be the last argument.
Then look at how the error handling is managed. Check if it is an error and handle it as fast as possible. Also observe that the callback's provided function should always have the error as its first parameter. The error must always be of type `Error`.

Another example could be when you write a function yourself that wraps this code and that takes a callback. Say you write a module that's doing something that takes time, reading a file, saving to database, etc. If the user of this module should write code against it you should provide a way to tell when your operation is ready, supporting the callback pattern. *You don't want to write a module that blocks the thread!*

```js
function readData(path, callback) {
  // if path is not provided, call the callback function with an error
  if(!path) {
    // it's common to return as fast as possible so we don't need else statements
    // and don't get any more code running in this function (would be hard to find bugs)
    // only invoke a callback once!
    return callback(new Error("Must provide a path"));
  }

  fs.readFile(path, function (err, data) {
    if (err) {
      return callback(err);
    }
    // All is good! Notice that the first parameter is always reserved for errors
    // since we don't have any, just pass null and then the result
    var result = data.split(",");
    return callback(null, result);
  });
}
```

This function can be used with something like this:

```js
readData("\etc\temp.txt", function(err, result) {
    // handle err and data
});
```

Since we are using the callback pattern we know how to add a callback function with the right parameters!

##### Callback hell
The callback pattern should be pretty easy to grasp, but when you start writing more complex applications you will soon see a drawback with callbacks: the *callback hell*. Looking at the example below should lead you to that insight.

```js
asyncOne(function(err) {
     asyncTwo(function(err) {
       asyncThree(function(err) {
         [...]
       });
    });
});
```

This is from a case where three async functions are called one after the other in the order `asyncOne`, `asyncTwo`, `asyncThree`. Since we must wait for each turn our code is getting messy (and we don't have any error handling). You can probably see where this is leading! It's leading to callback hell! When your code starts to get large, watch out!

How could we implement a good error handling in this example? Start by renaming the parameters to differentiate them in different scopes? It's also a place for memory leaks. Of course we can refactor our code to be better, but let's move on to other solutions! However, it is important to know this pattern since many of the modules you will use are implemented this way.


#### Promises
These days JavaScript have other ways to deal with this problem. One common solution is to make *promises*. Promises will be a core feature in the ES2015 (ES6) specification and that means that promises are now supported in the Node platform without any extra modules. It's now a feature well worth learning! Check it out at: [https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise).

A promise is just as it sounds, something that promises to do something. When we call a function with support for this we get a promise back in a pending status. This means that we have a promise to hold on to and when the job is done we get notified. A promise can then be fulfilled or rejected depending on how the operation went.


Below you can see an example of a function supporting Promises.

```js
function doStuff(value) {
  return new Promise(function(resolve, reject) {
    // do stuff here... get err or result
    if(err) {
      // reject if it went wrong
      return reject(new Error("Something went wrong with value %s", value));
    }
    // resolve if success
    return resolve(result);
  });
}
```

And here is how to use the function above:

```js
doStuff(1).then(function(value) {
  console.log(value);
}).catch(err) {
  console.log(err.message);
}
```

The nice thing about promises is how you can chain async function calls and easily handle the errors:

```js
doStuff().then(function(value) {
  console.log(value);
  // returns a new promise
  return doNextStuff(value)
}).then(function(value) {
  console.log(value);
}).catch(function(err) {
  console.log(err.message);
});
```

As you can see above, as long as we return a `Promise` object we can chain those calls to be done in a serial order and handling the errors in the last `catch` statement in a more readable way than when we use callbacks.

#### Async & Await
Since Node version 8 we have a better (?) way to handle our asynchronous programming. A way that sometimes looks confusingly a lot like synchronous programming - *async and await*. This is a new way to write our asynchronous, non-blocking code and is built on promises (in some situations you probably still will use promises).

Here is a small example:

```js
const getData = async () => {
    let data = await getDataFromServer()
    return data
}
```
The function that takes care of the asynchronous call will have the keyword `async` before it. Inside the function we can then use the `await` keyword which means that the call will wait until the `getDataFromServer()` will resolve the promise. The `async` function will return a promise and the resolved value will be what you return from that function.

As you can see this gives you a cleaner syntax. It will also give you a better way to handle errors when combining asynchronous and synchronous calls (like `JSON.parse`). We can then use the try/catch syntax. There are even more cases when the async/await syntax will be a better option so be sure to learn how to use it. To learn more about it read this article:
https://hackernoon.com/6-reasons-why-JavaScripts-async-await-blows-promises-away-tutorial-c7ec10518dd9


#### EventEmitter
One other thing that we should also know when coding in Node.js is about *Event Emitters*. This is the ability to define our own custom events and fire those to all that have a listener bound to that event. If you think about the above techniques they could just be called once when a certain thing happens. What if there is some kind of event that happens more than one time? Or if we would have some way to have multiple observers that get notified when the event happens? In programming we often talk about implementing the [Observer pattern](https://en.wikipedia.org/wiki/Observer_pattern) as a solution to this. In Node.js we have the Observer pattern built into the core and it is available through the `EventEmitter` class. The `EventEmitter` allows us to register one or many functions to be called when a particular event type is fired.

Here is a example to show this taken from the book "Node.js Design Patterns" by Mario Casciaro ([http://www.nodejsdesignpatterns.com/](http://www.nodejsdesignpatterns.com/)):

```js
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');

function findPattern(files, regex) {
  var emitter = new EventEmitter();
  files.forEach(function(file) {
    fs.readFile(file, 'utf8', function(err, content) {
      if(err) {
        return emitter.emit('error', err);
      }
      emitter.emit('fileread', file);
      var match = null;
      if(match = content.match(regex)) {
        match.forEach(function(elem) {
          emitter.emit('found', file, elem);
        });
      }
    });
  });
  return emitter;
}
```

As you see we require the `EventEmitter` and call its constructor to use its functionality. In this example an array of files are read and searched for a regex pattern. If we find the pattern an event is emitted to all that are registered to listen to it, in this case the `found` event. The code also emits events with the names `error` (for error handling) and `fileread` for indicating that a certain file has been read. As you can see you have the ability to create your own events in your module.

If we look at how to implement this it could look like this:

```js
findPattern(
   ['fileA.txt', 'fileB.json'],
   /hello \w+/g
 )
 .on('fileread', function(file) {
   console.log(file + ' was read');
 })
 .on('found', function(file, match) {
   console.log('Matched "' + match + '" in file ' + file);
 })
 .on('error', function(err) {
   console.log('Error emitted: ' + err.message);
 });
```

You can use the method `on` (think of it as a replacement for `addEventListener`) and specify the event you want to handle. In this way we can have multiple modules listening to the same events and we can emit these events multiple times.
