---
id: 16516
title: Open Source Replication and Offline Sync for Node.js and Devices
date: 2014-05-22T08:00:12+00:00
author: Ritchie Martori
guid: http://strongloop.com/?p=16516
permalink: /strongblog/node-js-replication-mobile-offline-sync-loopback/
categories:
  - Community
  - How-To
  - LoopBack
  - News
---
Today, StrongLoop is excited to announce support for replication and offline synchronization in our [LoopBack](http://strongloop.com/mobile-application-development/loopback/) API framework. What makes this unique is that it is completely open source and powered by Node.js. Loopback is an open source API framework written in Node.js used to connect mobile devices to enterprise datasources. This new functionality is available for [Oracle](http://docs.strongloop.com/display/LB/Oracle+connector), [SQL Server](http://docs.strongloop.com/display/LB/SQL+Server+connector), [MongoDB](http://docs.strongloop.com/display/LB/MongoDB+connector), [PostgreSQL](http://docs.strongloop.com/display/LB/PostgreSQL+connector), [MySQL](http://docs.strongloop.com/display/LB/MySQL+connector) and any [LoopBack connector](http://docs.strongloop.com/display/LB/Data+sources+and+connectors) which supports create, read, update and delete (CRUD) operations.

<h2 dir="ltr">
  <strong>Enterprise mobile apps require offline sync capabilities</strong>
</h2>

The ability to work offline has emerged as a requirement for almost all enterprise mobile applications that are data-driven. Up until now, developers first had to figure out how to locally store a subset of the application’s data. Second, they had to implement a mechanism that could keep the data synchronized on both the client and server. The previous generation of synchronization and replication technologies that tried to address these challenges were low level and inflexible, with little choice or variety in the data sources they supported. Fine grained controls on the behavior for common use cases like change detection and conflict resolution were also lacking.

<h2 dir="ltr">
  <strong>Replication and offline support in Loopback</strong>
</h2>

What this means for developers creating isomorphic JavaScript apps is, that for the first time they&#8217;ll be able to easily synchronize to and from various databases without requiring constant network connectivity. LoopBack’s replication also handles the complexity of moving data between mobile devices, mobile device to server and server to server. This means developers can focus on the the front end versus the mechanics of how to replicate data between disparate databases whether they be in cloud or in the datacenter.

<img class="aligncenter size-full wp-image-16542" alt="sync2" src="{{site.url}}/blog-assets/2014/05/sync21.png" width="1500" height="677" />

## **<!--more-->Why replication?**

Replication allows you to easily sync data in various databases from Node.js or the browser. This takes care of moving data between clients and servers and lets you focus on what makes your app useful. Below are some use cases that I find particularly interesting:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">In the browser, attach your model to a local storage database and sync with the server when you have connectivity. </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">In a turn based multiplayer game sync game objects (models) with an in memory database on the server and client. </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">In an enterprise application, sync your Oracle and Mongo databases, allowing you to use features from Mongo while using Oracle for persistence. </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Replicate data from a slower database into Redis for better read performance. </span>
</li>

Check out this video with Al Tsang &#8211; StrongLoop CTO, for a complete walk through of how isomorphic JavaScript and LoopBack&#8217;s replication, offline sync and conflict resolution work.

<p align="center">
</p>

## **A simple replicaton example**

Below is a user story that describes a simple todo list application.

As a busy person on the go, I should be able to read and write to my todo list. I need access  to my todo list on my phone while I walk to the office. While at work, on my laptop, I should be able to view the tasks I’ve entered on my phone and vice-versa.

This app represents the typical “sync” problem. You have data on several client devices that must be kept in-sync. Below is a basic example of LoopBack in the browser that replicates a todo list to and from a LoopBack server.

```js
// --- browser.js ---
// create the client browser app
var client = loopback();
var memory = loopback.createDataSource({
// a simple in-memory database
connector: loopback.Memory
});

// create a LoopBack server datasource
// allowing us to call methods on the loopback server
var remote = loopback.createDataSource({
url: 'http://localhost:3000/api',
connector: loopback.Remote
});

// use the same model on the server and the client
var RemoteTodo = require('./todo');

// create a local model to keep data on the device
var LocalTodo = RemoteTodo.extend('LocalTodo');

// attach the models to the correct data source
RemoteTodo.attachTo(remote);
LocalTodo.attachTo(memory);

// sync the data every 2 seconds
setInterval(function() {
LocalTodo.replicate(RemoteTodo);
RemoteTodo.replicate(LocalTodo);
}, 2000);
```

Below is the server side of the basic todo application. It attaches the server’s Todo model to both MongoDB and the LoopBack REST API. You could swap MongoDB out for MySQL, Postgres, Oracle, or any other database that LoopBack supports. To learn more about how to work with models in LoopBack, check out the [documentation](http://docs.strongloop.com/display/LB/Working+with+models).

```js
// --- server.js ---
// create the server app
var server = loopback();

// create a mongodb datasource
var db = loopback.createDataSource({
url: 'mongodb://localhost:27015',
connector 'mongodb'
});

// setup the Todo model
var Todo = require('./todo');
Todo.attachTo(db);
server.model(Todo);

// use the strong-remoting rest adapter
server.use(loopback.rest());

// start the server
server.listen(3000);
```

## **Example**

The [full-stack example](https://github.com/strongloop/loopback-example-full-stack) illustrates the basic approach for offline sync using LoopBack on both the server and in the browser.

## **Get Started**

Stay tuned for more detailed examples of some of the use cases above. Get started today by reading the [replication docs](http://docs.strongloop.com/display/LB/Synchronization). If you have questions or comments make sure to [hit up the mailing list](https://groups.google.com/d/forum/loopbackjs) or log your issues on [Github](https://github.com/strongloop/loopback/issues?milestone=1&state=open).

## **What’s next?**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Install LoopBack with a <a href="http://strongloop.com/get-started/">simple npm command</a></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What’s in the upcoming Node v0.12 version? <a href="http://strongloop.com/strongblog/performance-node-js-v-0-12-whats-new/">Big performance optimizations</a>, read the blog by Ben Noordhuis to learn more.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Need performance monitoring, profiling and cluster capabilities for your Node apps? Check out <a href="http://strongloop.com/node-js-performance/strongops/">StrongOps</a>!</span>
</li>