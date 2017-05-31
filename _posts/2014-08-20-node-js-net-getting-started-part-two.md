---
id: 19290
title: 'Part Two: Getting Started with Node.js for the .NET Developer'
date: 2014-08-20T08:20:11+00:00
author: Tomasz Janczuk
guid: http://strongloop.com/?p=19290
permalink: /strongblog/node-js-net-getting-started-part-two/
categories:
  - Community
  - How-To
---
[Part 1 ](http://strongloop.com/strongblog/node-js-net-getting-started-part-one/)of this blog post provided an introduction to Node.js for .NET developers. In this second part I am going to discuss common Node.js frameworks, tools, hosting technologies, and coding practices.

## Frameworks##

The primary scenario for Node.js is web development. The Node.js runtime itself contains a full <a href="http://nodejs.org/api/http.html" rel="noreferrer">HTTP stack implementation</a>. There is a large number of npm modules that provide higher level web application capabilities on top of that HTTP stack: MVC frameworks, REST frameworks, authentication plugins, WebSocket implementations, etc. A good way to discover them and get the idea of the most popular ones is to <a href="https://www.npmjs.org/" rel="noreferrer">search the npm registry</a>.

One of the most popular MVC frameworks for Node.js is <a href="http://expressjs.com/" rel="noreferrer">express</a>. Express supports flexible request routing mechanism, contains an extensible processing pipeline with a variety of available middleware, and supports several view rendering engines. A substantial ecosystem of middleware modules compatible with _express_ exists on npm, from authentication (e.g. <a href="http://passportjs.org/" rel="noreferrer">passport</a>) to WebSockets (e.g. <a href="http://socket.io/" rel="noreferrer">socket.io</a>), and more. Express supports a variety of view rendering engines. Some of the popular ones are <a href="https://github.com/visionmedia/jade" rel="noreferrer">Jade</a> and <a href="https://github.com/visionmedia/ejs" rel="noreferrer">EJS</a>. If you have been using the ASP.NET templating syntax, you will likely find EJS very easy to transition to. This is how a simple Express application looks like:

<!--more-->

```js
var express = require('express');
var app = express();

app.get('/:name', function(req, res) {
  res.render('hello', { name: req.params.name, date: new Date() });
});

app.listen(3000);
```
The `hello.ejs` view rendered from the single route controller above would look like this:

```ejs
EJS scample
Hello, <%= name %>
The date is <%= date %>
```

If you are developing an HTTP API application and need a framework that is more data-centric than MVC-centric, Node also provides you with a wide selection of modules. One of the most popular ones is <a href="http://mcavage.me/node-restify/" rel="noreferrer">restify</a>. Similarly to express it supports an extensible middleware pipeline, but out of the box provides many of the features specifically targeting HTTP APIs: CORS, GZip, JSONP, as well as parsing of the body and key HTTP headers. While it does not support WebSockets itself, it composes well with other modules that do (like <a href="http://socket.io/" rel="noreferrer">socket.io</a>).

How do you choose between _express_ and _restify_ when coming from .NET? A rule of thumb is this: _express_ is to _restify_ what ASP.NET MVC is to ASP.NET Web API.

No discussion of Node.js frameworks would be complete without mention of WebSockets and real-time web, as this was originally one of the focus scenarios for Node.js. While many options exist to add real time communication capabilities to your Node.js web apps, the undisputed leader is <a href="http://socket.io/" rel="noreferrer">socket.io</a>. Socket.io provides an abstraction of real-time duplex communication between a web client and web server. it also provides several mechanisms that implement that abstraction: WebSockets, HTTP long polling, Flash sockets, iframe, and JSONP polling. Client and server can negotiate a mechanism to use and support graceful degradation.

The functional equivalent of _socket.io_ in .NET is <a href="http://signalr.net/" rel="noreferrer">ASP.NET SignalR</a>. In fact, the SignalR project in .NET was largely inspired by _socket.io_ and created as a .NET answer to it.

## Distributions##

As of this writing, the npm repository contains over 70k modules, with several modules addressing any given scenario. As the ecosystem evolves in a completely decentralized way, there is a lot of overlap between modules. Some modules are actively supported while others become deprecated and decay over time. This situation created a very low barrier to entry for developers willing to contribute to the ecosystem and was one of the primary factors behind fast and innovative growth of the platform.

However, from the perspective of Node.js users who want to build applications on top of the platform, there is certainly a need for driving a level of consistency and prescriptive guidance within the Node.js ecosystem. Current situation in many ways resembles the early days of Linux. Just as RedHat, Ubuntu, Fedora, or Susie provided consistency, predictability, and support for Linux, a similar need for _distributions_ of Node.js exists.

One attempt at providing a level of prescriptive guidance and consistency coupled with support are the_LoopBack_ and _StrongOps_ products from <a href="http://strongloop.com/" rel="noreferrer">StrongLoop</a>. Givent the continued rapid growth of the Node.js ecosystem, similar &#8220;distributions&#8221; of Node.js are sure to be created going forward.

<a href="https://github.com/strongloop/loopback" rel="noreferrer">LoopBack</a> provides a framework and tools for creating 3-tier web API applications. It builds on top of the _express _MVC framework, provides SDKs for major mobile platforms and HTML5, as well as bindings and ORM models for several SQL and NoSQL backend solutions. LoopBack comes with a command line tool supporting common development time activities, from scaffolding to running, scaling, and debugging a Node.js application on the developer machine. Particularly useful is the built-in debugging capability based on the <a href="https://github.com/node-inspector/node-inspector" rel="noreferrer">node-inspector</a> module. It allows debugging Node.js applications in a Chrome browser with a similar experience that Chrome offers for debugging client side JavaScript.

LoopBack is complemented by <a href="http://strongloop.com/node-js-performance/strongops/" rel="noreferrer">StrongOps</a> which provides tools to scale, monitor, manage, and diagnose a Node.js application once deployed. One can identify performance issues, scale out the application at runtime, and analyze memory consumption, among other things.

Creating _Node.js distributions_ out of the many Node.js modules is a natural next step in the evolution of the Node.js ecosystem.

## Hosting##

There are substantial differences in the structure of the HTTP stack of .NET and Node.js web applications. .NET web applications are using HTTP stack that builds on top of the kernel mode HTTP implementation provided by the operating system within the HTTP.SYS component. In contrast, Node.js applications listen directly on TCP ports, and Node.js runtime provides HTTP protocol implementation. This difference has important implications for how Node.js applications are hosted.

Generally speaking, Node.js applications are typically running as a stand-alone executable listening directly on TCP, unlike ASP.NET applications that are hosted in IIS. Functions related to process management, activation, and fault tolerance are provided by platform specific components outside of Node.js.

Running Node.js applications as standalone processes started manually is the common practice during application development. Combined with simple Node.js-based process management utilities like <a href="https://github.com/isaacs/node-supervisor" rel="noreferrer">supervisor</a> this model provides great flexibility for a developer: the application is automatically recycled when any of the source files changes. Combined with lack of compilation step in JavaScript, it results in a very agile development environment.

When running Node.js applications in production on Linux systems, one typically uses platform specific daemon technologies. For example, when hosting Node.js applications on Ubuntu, it is not uncommon to use <a href="http://upstart.ubuntu.com/" rel="noreferrer">Upstart</a> to provide activation, recycling, and process management.

When hosting production Node.js web applications on Windows, one has two options. First one is to create a Windows Service around the Node.js application. One of the tools that helps streamline this approach is <a href="http://nssm.cc/" rel="noreferrer">NSSM</a>. Another option is to host Node.js applications in IIS using <a href="https://github.com/tjanczuk/iisnode" rel="noreferrer">iisnode</a>. In the _iisnode_ model, Node.js applications are running within IIS in a similar way that FastCGI applications would, except the protocol _iisnode_ uses to communicate with Node.js processes is HTTP over named pipes as opposed to FastCGI. From the perspective of the Node.js application it provides full fidelity to establishing a stand alone TCP listener. You can <a href="https://github.com/tjanczuk/iisnode/wiki" rel="noreferrer">read more about the features provided by iisnode that differentiate it from self-hosting</a>. Before you decide on a specific way of hosting for your app on Windows, you should also understand the <a href="http://tomasz.janczuk.org/2012/06/performance-of-hosting-nodejs.html" rel="noreferrer">performance implications of using iisnode in various scenarios</a>. The _iisnode_ technology is used by Windows Azure Web Sites and several other hosting providers for hosting Node.js applications on Windows.

## Tooling##

While there are several good environments and tools for developing Node.js applications, generally speaking .NET developers used to the Visual Studio experience of developing .NET applications will need to lower their expectations.

The Node.js developer community at large tends to favor simple yet cross-platform tools. There are several text editors in use for Node.js development, with the most widely used being <a href="http://www.sublimetext.com/" rel="noreferrer">Sublime Text</a> and <a href="http://www.jetbrains.com/webstorm/" rel="noreferrer">WebStorm</a>. In its basic form Sublime provides simple directory-based project management and syntax highlighting for JavaScript. Several extensions exists that support more advanced features, but altogether the story falls way short of Visual Studio support for writing .NET apps. Developers using .NET development tools, in particular Resharper, may find WebStorm providing similar experiences.

The best visual debugger for Node.js is <a href="https://github.com/node-inspector/node-inspector" rel="noreferrer">node-inspector</a>. It allows Node.js applications to be debugged remotely from the browser, which has a cross-platform advantage over the somehow brittle remote debugging story in Visual Studio. However, _node-inspector_ is not integrated with the Node.js runtime, and setting it up requires certain effort on developer&#8217;s part. That is why the &#8220;printf&#8221; style of debugging still plays an important role in the developer&#8217;s toolset, especially for quick ad-hoc debugging tasks. Two environments that provide integrated node-inspector support are <a href="http://tomasz.janczuk.org/2013/07/debug-nodejs-applications-in-windows.html" rel="noreferrer">iisnode</a> and <a href="http://docs.strongloop.com/display/DOC/Debugging+with+Node+Inspector" rel="noreferrer">StrongOps</a>.

If you are using Windows for development of your Node.js applications, you should most definitely check out the excellent and free <a href="https://nodejstools.codeplex.com/" rel="noreferrer">Visual Studio Tools for Node.js</a>. This Visual Studio add-on raises the bar for Node.js tools by providing many of the features .NET developers are used to when using Visual Studio, for example integrated local and remote debugging (even for apps deployed to non-Windows platforms) and intellisense.

The last note here is about transpilation tools. Use of JavaScript on the server often generates extreme reactions (interestingly, many people like JavaScript for the exact same reasons others dislike it). A few attempts were made to address some of the perceived issues with JavaScript through transpilation of a different syntax to JavaScript. One tool from this space is <a href="http://coffeescript.org/" rel="noreferrer">CoffeeScript</a> which aspires to simplify the syntax and emphasize the &#8220;good parts&#8221; of JavaScript. Another is <a href="http://www.typescriptlang.org/" rel="noreferrer">TypeScript</a> which adds strong typing and type constraints to otherwise untyped JavaScript. The price one pays for the benefits of transpilation is an extra compilation step in the development and deployment workflow, which is a drawback compared to the simplicity of change-save-run workflow that Node.js developers are used to. Transpilation also implies the need to learn a new syntax. TypeScript offers a gentler learning slope than CoffeeScript in that respect by allowing gradual transition from a JavaScript-only code base: any valid JavaScript is also a valid TypeScript.

## Coding patterns and practices##

Node.js, being single-threaded, asynchronous, and based on loosely typed JavaScript, has distinctly different coding patterns, esthetics, and practices compared to strongly typed .NET.

Although both JavaScript and .NET combine elements of functional and object oriented programming, Node.js embraces functional programming to a much greater extent than .NET. In fact, in the entire Node.js runtime there is just a handful of classes which capture quintessential concepts of Node.js (e.g. <a href="http://nodejs.org/api/events.html" rel="noreferrer">EventEmitter</a> or <a href="http://nodejs.org/api/stream.html" rel="noreferrer">Stream</a>). Vast majority of APIs in Node.js is grouped into modules exposing functions. And since functions in JavaScript are values, composability in Node.js often relies on passing functions, frequently implemented as closures over other state, as parameters to other functions. The flagship example is the async pattern in Node.js where by convention an async API accepts a callback function as the last parameter, e.g.:

```js
function startAsyncOperationFoo(parameter1, parameter2, callback) {
    // start async operation, and when it completes, invoke the callback:
    var error = null;
    var result = { a: 12, b: 'foo' };
    callback(error, result);
}

var someState = 7;

startAsyncOperationFoo('abc', 'def', function (error, result) {
    if (error) throw error;
    someState += result.a;
})
```
The example above demonstrates the basic async calling convention in Node.js:

  * asynchronous functions accept their parameters followed by a callback function,
  * a callback function accepts an error as the first parameter and results of the async operation as subsequent parameters,
  * a callback function should check for the error and only attempt to process results if no error occurred,
  * a callback function is frequently implemented as a closure over some non-local state (e.g. `someState`above),
  * a callback function frequently starts another async operation.

A frequent side effect of a naive application of this pattern for more complex logic results in programs that tend to grow horizontally faster than vertically. Consider a case where we want to calculate the result of (5 + 7) * 4 / 3 given asynchronous functions _add_, _multiply_, and _divide_:

```js
add(5, 7, function (error, result) {
    if (error) throw error;
    multiply(result, 4, function (error, result) {
        if (error) throw error;
        divide(result, 3, function (error, result) {
            if (error) throw error;
            console.log(result);
        });
    });
});
```

The <a href="https://github.com/caolan/async" rel="noreferrer">async</a> module remedies this situation by helping developers &#8220;flatten&#8221; a number of popular asynchronous workflows into more concise JavaScript code. Using the _async_ module, the same computation would take this form:

```js
async.waterfall([
    function (callback) {
        add(5, 6, callback);
    },
    function (result, callback) {
        multiply(result, 4, callback);
    },
    function (result, callback) {
        divide(result, 3, callback);
    }
], function (error, result) {
    if (error) throw error;
    console.log(result);
});
```

Another approach to help developers organize asynchronous code is to use <a href="http://howtonode.org/promises" rel="noreferrer">promises</a> and most notably<a href="https://github.com/petkaantonov/bluebird" rel="noreferrer">Bluebird</a>. If you have been using the Task Programming Model in .NET, you will feel right at home with JavaScript promises.

The upcoming (as of this writing) release of Node.js 0.12 will support the new JavaScript language feature of_generators_, which introduce new language syntax and semantics similar to CLR&#8217;s `async/await` pattern in TPL. It allows writing asynchronous code in a synchronous fashion, withouth blocking the thread on which code executes. Read more about generators in this <a href="http://strongloop.com/strongblog/how-to-generators-node-js-yield-use-cases/" rel="noreferrer">blog post</a>.

Another extremely popular utility module used in Node.js development is <a href="http://underscorejs.org/" rel="noreferrer">underscore</a>. It provides some 80 functions that facilitate working with collections, arrays, objects, and functions. Conceptually it is similar to extension methods in .NET, except they have a distinctly functional programming twist.

## When Node.js is not enough##

There are applications for which Node.js is not a good fit and other technologies must be employed.

Given the single-threaded, event-based architecture of Node.js, its primary area of application and strength is in IO-bound workloads: programs that manage a large number of concurrent asynchronous IO operations. There is a large class of such applications:

  * most web applications which accept HTTP requests from clients, execute a transaction in a database, and return HTTP result to the client,
  * orchestration engines, which manage state transitions and initiate asynchronous actions of a long running state machine,
  * a variety of networking applications, which process asynchronous IO events without engaging inordinate amounts of CPU cycles; UDP and TCP servers, mail servers, proxy implementations, gateways, etc.

Node.js is not a good fit for CPU-bound workloads: programs that perform relatively little IO but instead engage in CPU heavy computations. Some examples include image processing, weather prediction, sorting, or any other kind of heavy algorithmic processing. There are two reasons Node.js is not a technology of choice for such applications:

  * performing long running CPU-bound operations in Node.js would stop processing of events by the single-threaded event loop,
  * since Node.js primarily targets asynchronous IO workloads, the vast majority of APIs in the Node.js ecosystem is asynchronous, and there are very few modules that address non-IO functionality.

CPU-bound bound tasks that are performed with ease in a .NET application require an extra effort in Node.js. First, a technology other than Node.js must be used to complete the CPU-bound part of the workload. Second, the application must either run that workload as a separate process, or require a complex, multi-threaded native extension to Node.js to be created. The most popular approach to this problem is to create a child process using the <a href="http://nodejs.org/api/child_process.html" rel="noreferrer">child_process</a> module of Node.js, and have the child process (likely based on a different technology) perform the CPU-bound computation and return results to Node.js via an IPC mechanism. For example, you can envision a web application in Node.js that accepts a JPEG file from the client, then creates a child process implemented in Java, C#, or Python that resizes the picture and returns the file name of the resized artifact via IPC back to Node.js, which in turn sends it back to the client as a HTTP response. It is worth noting that the child process functionality is getting a face lift in the upcoming release of Node.js v0.12, with the long awaited support for <a href="http://strongloop.com/strongblog/whats-new-in-node-js-v0-12-execsync-a-synchronous-api-for-child-processes/" rel="noreferrer">synchronous execution of child processes (execSync)</a>, which is useful in scripting scenarios utilizing Node.js.

A different approach to the problem of running CPU-bound logic in Node.js applications is to use the <a href="http://tjanczuk.github.io/edge" rel="noreferrer">edge.js</a>module. _Edge.js_ allows running C# code inside of a Node.js application by hosting CLR in the Node.js process and providing an interop model between Node.js and CLR. It works on Windows, MacOS, and Linux (using Mono on non-Windows platforms). Edge.js allows you to leverage .NET Framewok functionality in your Node.js application without paying the performance and complexity price of cross-process communication and child process management. Edge is also useful in leveraging pre-existing .NET components, which is a frequent situation in a non-greenfield application development.

## What’s next?##

- Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js LoopBack framework. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.
