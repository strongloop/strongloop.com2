---
id: 19261
title: 'Part One: Getting Started with Node.js for the .NET Developer'
date: 2014-08-20T08:25:27+00:00
author: Tomasz Janczuk
guid: http://strongloop.com/?p=19261
permalink: /strongblog/node-js-net-getting-started-part-one/
categories:
  - Community
  - How-To
---
If you are a .NET developer and want to start using or just explore Node.js, in this post I will provide you with initial guidance. I will make a practical comparison of .NET and Node.js, focusing on similarities and differences to provide you with a frame of reference for further learning. In <a href=" http://strongloop.com/strongblog/node-js-net-getting-started-part-two/" rel="noreferrer">Part 2</a> of this blog post we will introduce Node.js frameworks, tools, and coding practices.

## Overview##

Node.js is a server side programming framework based on JavaScript. It is <a href="https://github.com/joyent/node" rel="noreferrer">open source</a> and cross-platform (runs on Windows, MacOS, Linux, and Solaris). The project was started by Ryan Dahl in 2009 and has quickly grown in popularity. Just like .NET framework, Ruby on Rails, or Python, it provides rich enough ecosystem of functionality to support creating modern web applications. Unlike .NET Framework, Node.js focuses primarily on IO-bound workloads (e.g. web servers, orchestration engines) and is rarely used for CPU intensive applications (e.g. image processing, complex computation).
<!--more-->
Given that web programming is the primary scenario focus of Node.js, the  _Hello, world_ samples usually take the form of a simple HTTP server:

```js
var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-type': 'text/plain' });
    res.end('Hello, world!');
}).listen(8080);
```

Subsequent sections will focus on key aspects of Node.js to compare and contrast them with .NET framework.

## High level architecture##

One of the key differences between .NET/CLR and Node.js is in the underlying architecture. CLR is a multi-threaded runtime, while Node.js executes application code on a single thread within a process. Work scheduling in CLR focuses on assigning CPU time to threads, taking into account thread-blocking operations, and is abstracted away from the developer for the most part. In contrast, Node.js code execution is driven by a central, single-threaded event loop which executes non-blocking event handlers on that thread. Event handlers implemented by the application must be non-blocking. If they perform CPU blocking operation or computation, subsequent events will starve. For example, if you made a blocking API call within the message handler of the_Hello, world_ <a href="https://gist.github.com/tjanczuk/b849e7b0aa7775a72020#overview" rel="noreferrer">HTTP server above</a>, your web server application would be unresponsive to HTTP requests that arrived while the computation is taking place. Developers must be much more aware of work scheduling in a Node.js application than in a .NET application.

## Impact on APIs##

The most visible manifestation of this design difference is in the shape of the APIs .NET and Node.js offer. While .NET usually provides both blocking and asynchronous (non-blocking) API versions for long running IO operations, Node.js offers almost exclusively asynchronous APIs. For example, reading a file in .NET may be implemented in a blocking fashion with:

```js
var contents = File.ReadAllText("myfile.txt");
```

or in a non-blocking fashion using TPL and async\await (or more traditional async APIs in .NET):

```js
var contents = await File.OpenText("myfile.txt").ReadToEndAsync();
```

In contrast, Node.js only offers an asynchronous API for reading files:

```js
fs.readFile("myfile.txt", function (error, content) {
    // ... do something with content
});
```

The example above demonstrates a pattern asynchronous APIs in Node.js often follow: the `fs.readFile` API starts an asynchronous IO operation of reading a file, and invokes the callback function specified as the second parameter only when that operation completes. At that point the content of the file is already in memory and can be provided to the application without blocking.

(Note that there actually is a blocking version of the file reading API in Node; however, its use in practice is limited to narrow scenarios that do not require the process to remain responsive to other events).

## Impact on scalability##

The second important implication of the key architectural difference between .NET/CLR and Node.js is in how applications scale out.

When you write a .NET web application, you typically don&#8217;t have to do anything special about scalability until your application cannot be accommodated by a single server VM. CLR&#8217;s multi-threaded scheduler knows how to fully leverage multi-core CPUs of modern servers, allowing code in your application to execute in parallel on multiple cores of a single machine.

In contrast, Node.js is running application code on a single thread per process, and therefore cannot fully leverage multi-core CPUs using just one process. A Node.js developer faces the scalability problem much earlier than a .NET developer: as soon as the capacity of a _single CPU core_ is insufficient to handle the application logic. Fortunately Node.js makes it easy to scale out your application to multi-core CPUs using the built-in <a href="http://nodejs.org/api/cluster.html" rel="noreferrer">cluster</a> module, optionally with the added management features of <a href="https://github.com/strongloop/strong-cluster-control" rel="noreferrer">strong-cluster-control</a>. Using _cluster_, with a few extra lines of code you can spawn multiple child processes, each running the same application code. If your application has a network listener (e.g. an HTTP server), all spawned processes will be listening on the same network port, and the operating system kernel will load balance new connections across the spawned processes. That way, a Node.js application can fully leverage the CPU power of a multi-core, multi-CPU server. The _strong-cluster-control_ module by StrongLoop enhances _cluster_ with the ability to monitor child processes, throttle their restarts in case of frequent failures and control the cluster through an API or command line tool.

The fact that a Node.js developer must design for scalability much earlier than a .NET developer has another advantage. Designing for scalability early usually results in cleaner application architecture. Many of the mechanisms a developer would use to scale out to multi-core servers would be used verbatim to scale out to a multi-server web farm. For example, scaling out to multi-core servers often requires a mechanism to externalize application state, something a similar .NET application can simply accomplish with shared in-memory state (with complexity that usually manifests itself only later in the form of race conditions and deadlocks).

## Installation##

.NET Framework comes pre-installed on modern Windows operating systems. As long as the version of the framework matches your needs, your .NET application can immediately run on those systems.

In contrast, Node.js must be <a href="http://nodejs.org/" rel="noreferrer">explicitly installed</a>. Fortunately, Node.js has a much smaller and portable runtime than .NET Framework. The core Node.js runtime on Windows is a self-contained executable less than 7MB in size (as of Node.js version v0.10.28). Given that, it is not unreasonable to re-distribute the Node.js runtime along with your application, especially if you have a dependency on a particular version.

## Modules##

A .NET developer has access to functionality built into the .NET Framework itself as well as third party .NET components distributed as <a href="http://www.nuget.org/" rel="noreferrer">NuGet</a> packages. In Node.js, consistent units of functionality are packaged as<a href="http://nodejs.org/api/modules.html" rel="noreferrer">modules</a>, which are then imported into the application using the `require` function.

A rich set of Node.js modules is built into the Node.js runtime itself, and part of the single executable file representing the runtime (`node.exe` on Windows). The built-in modules range in functionality from file system operations, to process management, cryptography, clustering, to creating TCP, HTTP, and UDP clients and servers. In essence, one can already get a decent mileage out of the built-in modules. You can get an idea of the functional span of the built-in modules by looking at <a href="http://nodejs.org/api/" rel="noreferrer">Node.js API documentation</a>.

One of the key strengths of the Node.js ecosystem however is in the thriving open source community providing Node.js extensions. The central repository of these extensions is <a href="https://www.npmjs.org/" rel="noreferrer">npm</a>. As of this writing, there are over 70k modules on npm (compare this to over 20k NuGet packages for .NET Framework). The span of functionality offered by npm modules can only be characterized as _everything under the Sun_: you will find modules that allow communication with most SQL and NoSQL storage solutions, messaging systems, MVC and REST frameworks, templating engines, protocol implementations, etc. Although this is not a requirement, the de-facto pattern Node.js community follows is that a module published on npm also hosts its source code on GitHub.

npm modules are versioned using the <a href="http://semver.org/" rel="noreferrer">semver</a> versioning semantics. Following this semantics is important to allow the system to choose the correct version of a module during automatic module installation (see<a href="https://gist.github.com/tjanczuk/b849e7b0aa7775a72020#configuration" rel="noreferrer">configuration</a>).

Using npm modules in your Node.js application requires them to be installed, similarly to installing NuGet packages for a .NET application. Every Node.js distribution or build contains an npm package manager. This is a command line npm client application (written in Node.js itself) that allows you to search, install, manage, and publish npm modules.

Installing a Node.js module is simple. Let&#8217;s use the <a href="https://www.npmjs.org/package/ws" rel="noreferrer">ws</a> module to implement a simple WebSocket server in Node.js. You will also notice that the source code of the module along with its documentation are on GitHub at<a href="https://github.com/einaros/ws" rel="noreferrer">einaros/ws</a>, which is the pattern followed by vast majority of Node.js modules. First, install the module:

`npm install ws`

Notice that a `node_modules\ws` directory was created on disk. This is where the module code is stored and where the Node.js runtime will <a href="http://nodejs.org/api/modules.html" rel="noreferrer">load it from</a> when the application runs.

At this point you can import the `ws` module using the `require` function within your Node.js application and implement your WebSocket server using APIs it offers:

```js
var ws = require('ws');

var wss = new ws.Server({ port: 8080 });
wss.on('connection', function (connection) {
    connection.on('message', function (message) {
        connection.send(message.toUpperCase());
    });
    connection.send('Hello!');
});
```

Notice how the result of the `require` function is assigned to the `ws` variable. This mechanism allows you to create your own namespace for the APIs exposed by the `ws` module by making them available as functions and properties of an object whose name your application controls. This mechanism is similar to <a href="http://msdn.microsoft.com/en-us/library/sf0df423.aspx" rel="noreferrer">using alias directives</a> in .NET, except it is much more commonly used in Node.js applications and modules.

## Configuration##

All but the simplest Node.js applications and modules contain a configuration file called `package.json`. The primary purpose of this file is to specify the name of the package, its version, and to declare dependencies: other Node.js modules that a particular module requires to function correctly. These aspects of the _package.json_ are similar to the manifest embedded in .NET assemblies. Other roles this file plays include specifying custom post-installation steps, ways of running tests, or development time dependencies. The full <a href="https://www.npmjs.org/doc/json.html" rel="noreferrer">specification of the package.json file</a> explains the capabilities in detail.

```js
{
  "name": "myapp",
  "version": "0.1.0",
  "dependencies": {
    "express": "0.4.2",
    "mongodb": "> 1.2"
  }
}
```

The minimalist `package.json` file above specifies _myname_ as the application name, sets the version number to 0.1.0, and declares that the application depends on the _express_ and _mongodb_ npm modules. Module dependencies can require a very specific version of a module (e.g. 0.4.2) or provide a more relaxed version constraint (e.g. `> 1.2`). In general applications should be as specific as possible in declaring module versions. When comparing module versions, the <a href="http://semver.org/" rel="noreferrer">semver</a> semantics applies.

The _package.json_ file is read and interpreted not by the application itself, but by the npm client tool than manages npm modules. In particular, calling `npm install` in a directory that contains a _package.json_ file will ensure that all modules the component depends on are available in the environment; missing modules will be obtained from the npm repository. Running `npm install` is part of a typical workflow of deploying a Node.js application.

Unlike the .NET configuration file, _package.json_ usually does not specify any application settings. Node.js application settings are commonly passed to the application through environment variables. Some applications introduce their own, file-based mechanisms of specifying settings. Typically these files use JSON or YAML formats, which are easy to parse in JavaScript and easier to work with for a human than XML.

In [Part 2](http://strongloop.com/strongblog/node-js-net-getting-started-part-two/) of this blog I will explore frameworks, tools, hosting, and coding practices of Node.js.

## What’s next?##

- Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js LoopBack framework! We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>

