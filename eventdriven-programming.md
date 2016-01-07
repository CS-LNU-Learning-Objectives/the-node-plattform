### Event-driven programming
When Ryan Dahl started to developed node.js he was looking for a way to write a non-blocking server. He tried many different languages like C and Lua but it was when he realized how the nature of javascript would perfect as the language pushing his project forward. Javascript has models for asynchronous programming, have closures and when Google (the danish deparment) released their V8-engine at the same time he went for javascript as the language for the node platform.

If you read the text above you realize that nodes single-threaded natures calls for some way to program to create this callbacks that are needed. When you read about node you will here about this as event-driven programming. You should already be familiar with javascript and asynchronous programming. Many programmers have used languages like PHP and JAVA before and are used to a more synchronous approach, that meaning the code executes row by row, from top to bottom.

```
$homepage = file_get_contents('http://www.example.com/'); // this is blocking code
echo $homepage; // the data is here to write out
```
The example above is PHP code and waits for each row to execute before the echo statement is executed.

In javascript/node we have many examples of asynchronous programming where the program doesn´t stop and wait for the call to be ready.

```
var req = new XMLHttpRequest();
req.addEventListener("load", function(){
    // function to run when we got response from server
    console.log(req.responseText);
});

req.open("GET", "data.json");
req.send();
console.log(req.responseText); // UNDEFINED!!!!
```
As you can see above we add an event handler where we write the code we want to run when the event has happened (in this case the load event of the XMLHttpRequest object). Its important to understand that the last row in the example will print out undefined cause that code will run before the load-event has trigged and the data has arrived. You should all know about the javascript queue and how events are handled by the browser.

In node we use to talk about "the event loop" which works in similar ways. One thing to remember about node is that all code runs in one single thread. On other platforms there could be code running in multiple threads independent of each other. That means that many parallel processes (as web request to a web server) would fork a new thread and run its code in this. This has some pros but if you got a lot of requests/processes many threads will be created and the server needs a lot of hardware. Since node has a single thread with an event loop it doesn´t spend time/resources waiting for things to finished. Instead it is able to sequentially execute a number of tasks very rapidly. This is why Node is so fast and could maintain good performance on smaller hardware servers.

Of course there is a drawback with this! Running tasks that take lots of processing time (like complex synchronous algorithms) will block the one single thread and therefor block other tasks to run. This is way you always should think about your Node-code and don´t do slow synchronous stuff, like reading a file with synchronous methods. When you writing a web server application that requires a lot of computation don´t use Node! Use Node when you write an application that just shuffles data in some format.




### How to do event-driven programming?
So we now know how Node works but what kind of patterns do we use when we´re programming on Node. Below follows a common patterns that you will run into when studying this.

#### Callback pattern
This is the simplest and maybe most used pattern when looking at Node modules made. Since functions can be treated as a variable in javascript we can use a function as an argument to another function. The nature of closures allow us to call that callback function when the stuff we´re doing are ready. Lets see an example taken from the documentation of the FileSystem-module in the node core:

```
var fs = require("fs");
fs.readFile('/etc/passwd', function (err, data) {
  if (err) {
    throw err;
  }
  console.log(data);
});
```
As you see the method readFile in the FileSystem object takes a path and a callback function. That callback function will be called when the file has been read or there been something wrong. This callback function should always be the last argument.
Then look how the error handling is managed. If there is an error throw it as fast as possible then the code for handling the data. Also observe that the callbacks function provided always should have the error as first parameter. The error must always be of type Error.

Another example could be when you self write a function that takes a callback. Say you write a module thats doing something that takes time, reading a file, saving to database...If the user of this module should write code against it you should provide a way to tell when your operation is ready, supporting a non-blocking model. *You don´t want to write a module that blocks the thread!*

```
function readData(path, callback) {
  // if path not provided call the callback function with an error
  if(!path) {
    // it´s common to return as fast as possible so we don´t need else statements
    // and don't get any more code running in this function (will be hard bugs to find)
    // only invoke a callback once!
    return callback(new Error("Must provide a path"));
  }

  var result = mySlowThing();
  if(!result) {
    return callback(new Error("Something went wrong!"));
  }

  // All is good! Notice that first parameter always is reserved for errors
  // since we don´t have any just pass null and then the result
  return callback(null, result);
}

```

Using this function should be like:
```
readDate("\etc\temp.txt", function(err, result) {
    // handle err and data
});
```
Since we using the callback pattern we know how to add a callback function!

##### Callback hell
Well the callback pattern should be pretty easy to grasp but when you start writing more complex applications you will soon see a drawback with callbacks, the so called callback hell. Looking at the example below should lead you to that insight. Platform

```
asyncOne(function(err) {
     asyncTwo(function(err) {
       asyncThree(function(err) {
         [...]
       });
    });
});
```
This is from a case where three async functions is called after each other in the order asyncOne, asyncTwo, asyncThree. Since we must wait for each turn our code is getting cluttering (and we don´t have any error handling). You can probably see what this is leding! Its leading to callback hell! When your code start to get wide watch up!
How could we implement a good error handling in this example? Start renaming the parameters to different them in different scope? Its also a good ground for memory leaks. Of course we can refactor our code to be better but lets move on to other solutions!

#### Async module
Since the Node platform supports different modules outside the core we could of course use a module. One of the more popular are the async library which is build for async programming. The module could be found at: https://www.npmjs.com/package/async and you simple install it through npm:
```
npm install async --save
```
The module let you in a pretty easy way set up function that should be called parallel or in series and you could write your code more as if your where coding in a synchronous way.

You can found more examples of how to use the async module see the link above. Of course there are other module that do the same thing. Search the npm register for more.

#### Promises
The javascript echo system have other ways to deal with this problem. One common solution is promises. Promises will be a core feature in the ES2016 specification and that means that promises now is supported in the node platform without any extra modules, its now a language feature well worth learning! Check it out at: [https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise).

A promise is just as it sounds, something that promise to do something. In async programming this means promise to return when something is ready or fulfilled. When we call a function with support for this we get a promise back in a pending status. This means that we have a promise to hold on to and when the job is done. A promise can then be fulfilled or rejected depending on how the operation went. It is then in the settled status.


Below you can see a example of a function supporting Promises.
```
function doStuff(value) {
  return new Promise(function(resolve, reject) {
    // do stuff here...get err or result
    if(err) {
      // reject if it went wrong
      return reject(new Error("Something went wrong with value %s", value));
    }
    // resolve if success
    return resolve(result);
  });
}
```

And here is how to use this.
```
doStuff(1).then(function(value) {
  console.log(value);
}).catch(err) {
  console.log(err.message);
}
```

The nice thing about promises is how you can chain async function calls and easy handle the errors
```
doStuff(1).then(function(value) {
  console.log(value);
  // returns a new promise
  return doStuff(value)
}).then(function(value) {
  console.log(value);
}).catch(err) {
  console.log(err.message);
}
```
As you can see above as long as we return a Promise object we can chain those calls to be don in a serial order and handling the errors in the last catch statement in a more readable way then when we using callbacks.

#### Generators
Generators have the same purpose as promises and is supported at the node platform (>= 4.x). But the syntax is different and really trying to make the code look like if we done it synchronous (for the better?).

```
function* generatorFn () {
  console.log('I was suspended')
}
var generator = generatorFn()
setTimeout(function () {
  generator.next()
}, 2000)
```

The function above is a generator function and we can see that by the \*-character after the function word. This means that this function will by default be run in a suspended mode, no console.log will be outputted. But when we call next on that function it will run, in this case after two seconds.

```
function* channel () {
  var name = yield 'Hello, what is your name?';
  return 'Hello there ' + name;
}
var gen = channel()
console.log(gen.next().value) // Hello, what is your name?
console.log(gen.next('John')) // Hello there John
```

by using the keyword "yield" in our generator function we can stop the code and demand a call the next-function to continue run the code in the function.

To use generators in the promise example it will look like:

```
function doStuff(value) {
  return new Promise(function(resolve, reject) {
    // do stuff here...get err or result
    if(err) {
      // reject if it went wrong
      return reject(new Error("Something went wrong with value %s", value));
    }
    // resolve if success
    return resolve(result);
  });
}
```

So what have this to do with async programming you may ask. Well by combining promises and generators we can find a really simple code structure for handling async programing in node.js. In this example we´re using the library [co](https://github.com/tj/co) which is a so called "generator-based-control-flow library".

```
co(function*() {
  // the next *yield* will only run after the previous *yield* is done
  // like sync code
  var result1 = yield getData(); // returns a promise
  var result2 = yield getData2(result1); // returns a promise
  var result3 = yield getData3(result2); // returns a promise
  return result3;
}).then(function(result) {
  // single 'then' to handle the final return value
  console.log(result);
}, function(err) {
  console.log(err);
});
```
The code above is handling three async calls in a series. The code looks just like synchronous programming with the advantage of the underlying asynchronous programming model.

This is how it probably will look in coming versions of javascript where features as "async" and "await" will be available.


#### Event emitters
One thing that is special for the Node platform and not a core thing in javascript for the browser is Event Emitters. This is the ability to define own custom events and fire those to all that has a listener bind to that event. If you think about it with callbacks and promises we could just be called once when a certain thing happen. That is fine for stuff like reading a file or saving stuff to the database but what if we want to notify the user of our module more than once. We maybe write some kind of server and want to notify when a user connect. To do this we can create a custom event and trigger that for every one that listens. This important to know about when we start creating own independent modules.
