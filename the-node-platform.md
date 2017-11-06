# The Node Platform

## Javascript Everywhere
For most developers JavaScript has always been a client script language for the web browser. In the beginning JavaScript was just a tool for code snippets that provided some kind of interaction on web pages, even though most interactive designers did prefer Flash for this task.

But [flash is announced to soon be "dead"](http://thenextweb.com/apps/2015/09/01/adobe-flash-just-took-another-step-towards-death-thanks-to-google/) and JavaScript has evolved a lot in the last couple of years. When AJAX came along JavaScript went from  being just a simple "toy script language" to be something developers could use to write real and significant web applications. The JavaScript engines of the browsers are getting faster and more optimized by the day, and since Node.js entered the community you don't need to use PHP, Java or C# to write a backend with good performance for your web application. Now you can use JavaScript everywhere: front-end, as data format (JSON), and back-end. Where JAVA failed JavaScript seems to has succeeded... "write once, run everywhere". Where XML failed, JSON seems to have succeeded. Some groups of developers have problem with the freedom and lack of OOP concepts in JavaScript and languages that are compiled into JavaScript start to gain popularity ([TypeScript](https://www.typescriptlang.org/), [Dart](https://www.dartlang.org/), etc.). Maybe we should not only see JavaScript as a language but also as a platform.

That thing we call the Node.js platform is also a fast evolving technology. It is important for the web community when the web platform and its applications are getting more complex and demand the use of new technology. Web-based realtime applications, for example, are a perfect match for the Node platform and its non-blocking programming model.

## The History
First time we heard about Node.js and JavaScript on the server was when Ryan Dahl presented it at the European JSConf on November 8, 2009. Be sure to watch [the original presentation!](https://www.youtube.com/watch?v=ztspvPYybIY) Ryan was interested in creating server push applications after looking at different solutions on how to make progress bars for uploading a file through a web browser. He was also interested in non-blocking programming techniques so he started to write his own project. After testing a couple of different languages for the project he realized that JavaScript was a perfect match with its non-blocking programing model. At this time the Danish department of Google developed and released their JavaScript engine V8, which Ryan used in Node. We can see V8 as a virtual machine, written in C++, that Node.js is built upon. Ryan started working at the [joyent company](https://en.wikipedia.org/wiki/Joyent) where he had the time to developed the Node.js application further. You can look at [a presentation](https://www.youtube.com/watch?v=SAc0vQCC6UQ) where Ryan describes the creation of Node.js and why he chose the architecture he did.

Node.js operates on a single thread, using non-blocking calls, allowing it to support a lot of concurrent connections. The design of sharing a single thread between all the requests is intended for building highly-concurrent applications. When developing on the Node platform you should be familiar to asynchronous programming models. If, for example, you have done some AJAX programming in the browser, you probably already are.

## The Philosophy
Every platform has its own philosophy; principles that the community has accepted or an ideology of doing things that influences the evolution of the platform. In Node.js these principles come from the creator, Ryan Dahl, and all the developers that have helped to build the platform (it is an open source project). Some of the principles are inherited from JavaScript and some are taken from the UNIX philosophy. You don't always have to follow these "rules", but it's wise to know about them and it's important to understand them when you design your Node applications or look at others.

#### Small core
The Node.js core is built on the principle of having the smallest set of functionality and leaving the rest to the "userland", the ecosystem of independent modules provided by the Node.js developers. Instead of relying on a big and slowly evolving core, the features are often developed around a tight and stable core by open source developers. The core is hold to a bare minimum.

#### Small modules
The Node.js ecosystem uses the concept of *modules*, often called *packages*. A module is a chunk of code built to handle a small part of functionality. This principle has its roots in fundamental design principles and especially the Unix philosophy that proclaims "Small is beautiful" and "Make each program do one thing well". This also empowers developers to use many smaller modules and to reuse these into a bigger program.

#### Small interface
The Node.js community also encourages their modules to expose only a minimal set of functionality, often called the module's public API. This makes the module easy to understand and use and hides the complexity behind its functions. A module may only just expose a single function or constructor and let more complex features be exposed as properties of the exported function. This is to show the user of the module a single and simple entry point. Another characteristic of many Node.js modules is that they are built to use as you want and not to extend by locking down the internals. This could be inflexible but has the advantage of reducing the use cases, focusing on doing its only thing in a good way, and providing simplicity.

#### Simplicity and pragmatism
Designing a **simple**, general and feature-full software is a good rule of thumb. It takes less time to implement and allows faster shipping, which is important in modern web development projects. It's probably also easier to adapt, maintain and understand. It's also common to see simple solutions in contrast to more classical object-oriented solutions with the arguments that a smaller, more simplified solution often is easier to change and maintain when the requirements of the software are going to change (which they certainly will). "Keep it simple stupid" - KISS.

## How Node.js works
Node has many characteristics: non-blocking, asynchronous, event-driven, and single threaded. As a developer this is important to know because it is easy to make mistakes if we think in a blocking, multi-threaded way, which is a more common model in web platforms such as PHP and Ruby on Rails. It's also important when the code is running on a server with many users and many requests, and not in a browser with only one user.

But what does all these words mean and why does Node choose them?

### Non-blocking I/O
I/O stands for Input/Output. In this case we can think of it as reading or writing data. That can be to memory, disk or network. This is often a very time-consuming operation in an application. Of course it will be a slow operation on a web server if we use a synchronous model and always have to wait for the read/write operations to be done. This will block our code. Node gets away with this by doing most I/O tasks using non-blocking techniques. Rather than waiting line-by-line for an operation to finish, you create a *callback* function that will be invoked when the operation eventually succeeds or fails. Since you are familiar with JavaScript programming, you recognize this model with callbacks, event queue and event loop. If you need to refresh your knowledge about this, watch this talk from [Philip Roberts called "What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ). The talk is about the V8 engine in a browser, but it is similar to Node.js; just change the Web APIs in the browser to I/O operations handled by the OS.

### Single-threaded vs. Multi-threaded
Classical web servers like Apache or IIS spawn a new thread for every request that comes in. A thread can be seen as an own process in the operating system. This means that, in theory, we can have many threads running at the same time doing parallel jobs. There will be problems when different threads are trying to work with the same shared resources, such as the filesystem or a database, so threads have to lock these resources up during their work, while other threads get blocked and just have to wait to do their operations. Programming with threads can be very tricky and mostly you don't want to think about that as a modern web developer. Additionally, every new thread spawned by multi-threaded servers on each request costs memory, and at some point the whole memory will be used.


Node.js uses a single-threaded model. This may sound a bit backwards but this can optimize things. As you probably know, JavaScript has an asynchronous nature with an event queue where instead of blocking your code with I/O-operations you register callbacks to be called whenever the operation is ready, leaving time for other code to be executed in between. This frees up the ability to handle many requests, which is one of the pros of using Node.js as a web server. The images below try to illustrate these cases:

![Multithreaded](./slides/images/multithreaded.png)

*Fig. 1: Multi-threaded server*

In the picture above we see a (very simplified!) image of the blocking nature in a multi-threaded server. We see three requests coming in to the server (the box named S). Each request spawns a thread and each thread tries to do different types of I/O operations, meaning that they sometimes have to wait for each other and then block the thread's code. Since every request gets an own thread we can't handle too many connections at the same time (depends on how powerful the server hardware is).

![singlethreaded](./slides/images/singlethreaded.png)

*Fig. 2: Single-threaded server*

In the second picture we see the Node.js way. This should be familiar to you if you have done some JavaScript coding before. Node.js has only one thread that registers every I/O operation as events in the event queue. The event loop goes through this and decides if the event's callback should invoke or if it should put the operation to be handled by Node.js internal. If an I/O is registered the event loop delegates the work to an async thread pool which is handled by *libuv*, a C library that handles these operations in the operating system. When the operation is done the event loop makes the registered callback invoke. Libuv is a library that Node.js uses under the hood. As a web developer writing Node applications you use the JavaScript API provided by Node.js. See the below image for another view of the Node.js architecture:

![Node.js](./slides/images/Nodejs_system.png)

*Fig. 3: This image was taken from: https://twitter.com/BusyRich/status/494959181871316992*


If you want to get a real deep understanding of the Node.js architecture please read [this paper](http://mcgill-csus.github.io/student_projects/Submission2.pdf).

The big advantage of the Node.js model is, as mentioned before, that it can handle more requests than traditional multi-threaded servers. It's also very suitable for asynchronous realtime applications. The main draw back is that Node.js isn't suited for complex calculating operations like more synchronous complex algorithms. These will block the single thread and block the whole application. This is not a good thing when we have a server application that is listening for requests! In that way Node.js isn't a silver bullet and not a replacement for traditional web platforms. But as long as you are aware of this it's a very likable platform to work with. If you need to do more complex stuff there are ways of creating [new Node processes](https://Nodejs.org/api/child_process.html) to handle this. Just remember to try to do as much as you can asynchronously to free up the main thread. Always return as fast as possible from the functions you code.


## Node.js vs io.js and the future
There has been some different paths on the evolution of Node.js. At one time a couple of developers forked the original code base of [Node.js on GitHub](https://github.com/Nodejs/Node) and started their own project, which they called [io.js](http://iojs.org). The developers got tired of Joyent's (the maintainer of Node.js) development cycles and wanted to get things done faster. They released io.js version 1.0 while Node.js was on version 0.12-someting. These different paths continued for a while until 2015-09-14 when the Node.js Foundation announced that the two groups had joined together in the same code base again, starting with the Node.js 4.0.0 version.

Today many big actors in the software area (like Microsoft, Yahoo, IBM, and Intel) are supporting the development of the Node.js platform in the [Node.js Foundation](https://Nodejs.org/en/foundation/). They also have the so-called [Long-Term Support](https://github.com/Nodejs/LTS/).

## References
* [Ryan Dahl's original presentation of Node.js](https://www.youtube.com/watch?v=ztspvPYybIY)
* [Ryan describes the creation of Node.js](https://www.youtube.com/watch?v=SAc0vQCC6UQ)
* [Philip Roberts: What the heck is the event loop anyway? @ JSConf EU 2014](https://www.youtube.com/watch?v=8aGhZQkoFbQ)
