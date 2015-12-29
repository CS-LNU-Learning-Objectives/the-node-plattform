# The Node Plattform

## Javascript Everywhere
For most developer javascript always been a client script language just for the web browser. In the beginning javascript was just about giving your web page visitors some interaction even though most interactive designers did preferred Flash.

But flash is dead and javascript has evolved a lot in the last couple of years. When AJAX came javascript went from  being just a simple toy script language to be something developers using to write real and significant applications. The browers javascript engines is getting faster and more optimized by the day and when since node.js hit the community you don´t need to use PHP, Java or C# to write a backend for your web application. Now you can use javascript everywhere. Where JAVA failed javascript (and other web technologies) has succeded..."write once, run everywhere". Where XML failed, JSON has succeded.

The node community is also a fast evolving technology, just what the web community need when the web plattform and its application faster getting more complex and demands the use of new technology, take real-time application for example, a perfect match for the node plattform and its non-blocking programming model.

## The History
Node is using V8, the virtual machine for Google Chrome (written in C++). It was invented in 2009 by Ryan Dahl and a couple of developers working at the joyent company. The project was demonstrated at the inaugural European JSConf on November 8, 2009. [Be sure to watch the presentation!](https://www.youtube.com/watch?v=ztspvPYybIY).

Node.js operates on a single thread, using non-blocking calls, allowing it to support a lot of concurrent connections. The design of sharing a single thread between all the requests is intended for building highly concurrent applications. All non-blocking calls must provide a callback and if you are familiar of AJAX programming you should know how to do this.

## The Philosophy
Every plattform has its own philosophy, principles that the community has accepted or an ideology of doing things that influence the evolution of the plattform. In node.js this principles comes from the creator, Ryan Dahl and all the developers that have helped to build the plattform. Some of the principles are inherited from javascript and some are taken from the UNIX philosophy. You don´t always have to follow this "rules" but its wise to know about these and important to understand when you design your node programs.

#### Small core
The node.js core is build on the principle of having the smallest set of functionality and leave the rest of the functions to the "userland", the ecosystem of independent modules provided by the node plattform developers. Instead of relying on a big and slow envolving core the features are often developed around the tight and stable core by open source developers. The core is hold to a bare minimum.

#### Small modules
The node ecosystem uses the concept of modules or packages. That is small package of code built to handle a small part of functionality. This principle has its roots in the Unix philosophy that proclaim "Small is beautiful" and "Make each program do one thing well". This also empowers developers to use many smaller modules and reuse these into a bigger program. We can also call this "Don´t Repeat Yourself" (DRY) - a common and wide used rule in programming.

#### Small interface
The node community also encourage their modules to expose only a minimal set of functionality, often called a modules public API. This makes the module easy to understand and use and hides the complexity behind its functions. A module may only just expose a single function or constructor and let more complex features be exposed as properties of the exported function. This is often called the module pattern. This is to show the user of the module a single simple entry point. Another characteristic of many node.js modules is that they are build to use not to extend by locking down the internals. This could be inflexible but has the advantage of reducing the use cases and focus to do its thing in a good way and provide simplicity.

#### Simplicity and pragmatism
Designing a simple, not a perfect, general and feature-full software is a good rule of thumb. It takes less time to implement, allows faster shipping. It´s probably also easier to adept, maintain and understand. It's also common to see simple solutions i contrast to more classical object-oriented solutions with the arguments that a smaller more simplified solutions often is more simple to change and maintain when the software is going to change (which it certainly will do). "Keep it simple stupid" - KISS.

## NPM, Node Package Manager
Most of the modern programming languages have some kind of a package manager. For javascript/Node that is npm, the node package manager. Npm is bundle with node and should be installed when you install node. Npm help you as an developer to build your applications around smaller modules/packages your or other developers have build. Remember, small core, many and small modules/packages.

A module (often called package) is a folder containing some javascript code and a meta file called package.json. The meta file describes the package and all of it´s dependencies (of other packages).

For more information about npm and how you can use it see the article TODO

## The non-blocking programming model

#### The event loop

## Asyncronous programming

#### Callback pattern

##### Callback hell

#### Async module

#### Promises

#### Generators

#### Event emitters
