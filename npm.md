# NPM - The package manager for Node.js
Most modern programming languages have some kind of package manager as a way to share and reuse code. For JavaScript/Node that is NPM, a package manager for Node modules. NPM is bundled with Node and should already be installed when you install Node.js. NPM is the tool that helps us to install, organize and use Node packages. They could be modules developed by you or by other developers that are available through the [NPM web site (https://www.npmjs.com/)](https://www.npmjs.com/). This can be used as a global service where developers contribute with modules that you can use in your applications. Remember: small core, many and small modules/packages.

This text will focus on the use of NPM when you develop new Node applications, and not how you publish your own modules. This is not a complete guide so be prepared to seek more information in the NPM-documentation.

## Understand the NPM cli
When you got Node.js installed you also got the NPM program which lets you write NPM commands. Open up your terminal window and write:

```
npm -v
```
This will output the version of NPM that is installed on your system. The NPM program have lots of commands we need to know about to be effective in our work.

### Install NPM modules
The most common task is to install a package to use in your program. A very common module is [lodash (https://www.npmjs.com/package/lodash)](https://www.npmjs.com/package/lodash) which is a utility library for javascript. Let's say we want to use that package in our program. Be sure that you are in your project folder in your terminal program. Then write:

```
npm install lodash
```
That means that you are going to install the *lodash* package in your project folder. You may see that a new folder is created, `node_modules`. This is the folder where Node will look for installed modules when you try to require/use them in your own code. If you look in that folder you will find the module and all its code installed in the `lodash` folder.

We have installed the module locally, that is, installed it in our project folder. This is the most common way to work with modules in your applications.

Sometimes a module could be installed globally, so we can use it from anywhere in our system. If we want to install the module globally you add the `-g` flag when installing:
```
npm install <name_of_the_module> -g
```
The NPM program will then install the module in its global folder, which depends on the operating system you're using and in what folder Node is installed. More info about this at [https://docs.npmjs.com/files/folders](https://docs.npmjs.com/files/folders).

## The package.json file
Every Node project should have a `package.json` file (at least) in its root folder. This is a meta file that describes your project. Things like author, version, and repository URL are written in this file. The `package.json` also describes what dependencies your project has, that is, what other NPM packages it depends on.

Let's say you push your project to a GitHub repository for others to download and run. Should you also push up all the modules you are using? It could be hundreds of folders with code. You should probably put the `node_modules` folder in your `.gitignore` file to avoid that, and let the users install the modules by themselves by reading in the `package.json` file which modules your project needs. By running the command:
```
npm install
```
Node will look for the `package.json` file and figure out which modules it will need to install.

So when you install a module in your project with `npm install <name_of_the_module>` you should also add the module name to your `package.json`. You can do this by using the flag `--save` or `--save-dev`, where `--save-dev` is for packages we're just using when developing but not in production. That could be packages for testing, hinting, code coverage and things like that. [Since version > 5.0 of npm the `--save` flag will be added by default](http://blog.npmjs.org/post/161081169345/v500). An example of this could be:
```
npm install lodash --save
```
and
```
npm install mocha --save-dev
```

If you run these two commands your `package.json` file will look something like this:

```
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "This is a test ",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "test",
    "removeme"
  ],
  "author": "John Häggerud",
  "license": "ISC",
  "dependencies": {
    "lodash": "^3.10.1"
  },
  "devDependencies": {
    "mocha": "^2.3.4"
  }
}
```
As you see this is pure JSON and you can probably figure out most of the stuff. You can also see that we have two keys `devDependencies` and `dependencies` where the installed packages are listed. Also observe that each package is followed by the version number that should be used.

As you can see it also specifies which version (or major/minor version) to install when running `npm install` with this package file.
There are many ways of specifying versions in the `package.json`. For more information see [https://docs.npmjs.com/files/package.json#dependencies](https://docs.npmjs.com/files/package.json#dependencies).

If no sign is provided it will always install just that version. There are different opinions on how to do this. The default way is using the `^`-character in front of the version number to allow bug fixes and backward compatibility, but some people advise to just use the specified version number (without any character in front) to avoid version problems when going to production. The version system used by Node modules is built on the [Semantic Versioning guidelines.](http://semver.org/)

## package-lock.json
As you may wonder, this could lead to problems, especially when handling modules in a production environment.
By default, `npm install` recursively installs all the dependencies that the modules specified in your `package.json` have, using the above described *semver* patterns. When shipping code we don't want some modules to be of different versions than the ones used when building the software.
We want to guarantee that a developer of a module in our dependency chain won't be able to make an update that potentially can break our build. If we only put our trust in `package.json` this could happen.

Therefore `npm` also creates the `package-lock.json` file. This file holds the complete representation of the dependency tree of your project, so that other developers (or build scripts) will install the exact same versions you did. For more information please read: [https://docs.npmjs.com/files/package-locks](https://docs.npmjs.com/files/package-locks).

## NPM Shrinkwrap
To fix this problem we can use the `npm shrinkwrap` command. For more information [consult the documentation](https://docs.npmjs.com/cli/shrinkwrap).


## NPM as a build tool
Most front-end developers know about build tools such as [Grunt](http://gruntjs.com/) or [Gulp](http://gulpjs.com/), but you can also use npm for this.
This is out of the scope of this text but if you are interested in this you should check out [Kate Hudson's talk from nordic.js 2015](https://www.youtube.com/watch?v=0RYETb9YVrk)

## NPM's weakness
In early 2016 the NPM community suffered a lot when the user *Azer Koçulu* removed more than 250 packages from NPM. Among the removed packages was *left-pad*, which was used by many open source projects, resulting in broken build processes all over (see [How one developer just broke Node, Babel and thousands of projects in 11 lines of JavaScript](http://www.theregister.co.uk/2016/03/23/npm_left_pad_chaos/)). These kinds of problems are now fixed, and a developer can't remove code published in the NPM community anymore.

## Further reading
* https://docs.npmjs.com/
* [Kate Hudson's talk from nordic.js 2015](https://www.youtube.com/watch?v=0RYETb9YVrk)
