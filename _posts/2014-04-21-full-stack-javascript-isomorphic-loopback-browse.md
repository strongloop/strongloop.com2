---
id: 15598
title: 'Full Stack JavaScript in Action with LoopBack&#8217;s Browser Support'
date: 2014-04-21T13:56:01+00:00
author: Ritchie Martori
guid: http://strongloop.com/?p=15598
permalink: /strongblog/full-stack-javascript-isomorphic-loopback-browse/
categories:
  - Community
  - How-To
  - LoopBack
---
<h2 dir="ltr">
  <strong>Browser Support</strong>
</h2>

[LoopBack](http://loopback.io) version 1.8.0 introduces browser support with two key features: The `loopback.Remote connector` and the [browserify](http://browserify.org/) distribution. These enable running a LoopBack client application in the browser that shares code with a LoopBack server application. This means you can adopt the same programming model on both client and server.

What&#8217;s LoopBack? It&#8217;s an open source API server powered by Node for connecting devices and apps to data and services.

[<img class="aligncenter size-full wp-image-14996" alt="loopback_logo" src="{{site.url}}/blog-assets/2014/04/loopback_logo.png" width="1590" height="498"  />]({{site.url}}/blog-assets/2014/04/loopback_logo.png)

<!--more-->

<h2 dir="ltr">
  <strong>A Brief Example</strong>
</h2>

We start with a very bare-bones LoopBack server.

**server.js**

```js
var loopback = require('loopback');
var server = module.exports = loopback();
var CartItem = require('./models').CartItem;
var memory = loopback.createDataSource({connector: loopback.Memory});

server.use(loopback.rest());
server.model(CartItem);
CartItem.attachTo(memory);

server.listen(3000);
```

Continuing with the example above, we’ll define our models in a separate file, so our server and client can require them. Notice there is a [remote method](http://docs.strongloop.com/display/DOC/Remote+methods+and+hooks), `CartItem.sum()`, and a standard prototype (instance) method, `cartItem.total()`.

**models.js**

```js
var loopback = require('loopback');

var CartItem = exports.CartItem = loopback.DataModel.extend('CartItem', {
  tax: {type: Number, default: 0.1},
  price: Number,
  item: String,
  qty: {type: Number, default: 0},
  cartId: Number
});

CartItem.sum = function(cartId, callback) {
  this.find({where: {cartId: cartId}}, function(err, items) {
    var total = items
      .map(function(item) {
        return item.total();
      })
      .reduce(function(cur, prev) {
        return prev + cur;
      }, 0);

    callback(null, total);
  });
}

loopback.remoteMethod(
  CartItem.sum,
  {
    accepts: {arg: 'cartId', type: 'number'},
    returns: {arg: 'total', type: 'number'}
  }
);

CartItem.prototype.total = function() {
  return this.price * this.qty * 1 + this.tax;
}
```

The following file is what is entirely new. This file would be the entry point for a [browserify](http://browserify.org/) bundle and would run in the browser.

**client.js (browser or Node.js)**

```js
var loopback = require('loopback');
var client = loopback();
var CartItem = require('./models').CartItem;
var remote = loopback.createDataSource({
  connector: loopback.Remote,
  url: 'http://localhost:3000'
});

client.model(CartItem);
CartItem.attachTo(remote);

// call the remote method
CartItem.sum(1, function(err, total) {
  console.log('result (calculated on the server):', err || total);
});

// call a built in remote method
CartItem.find(function(err, items) {
  console.log(items); // => [] of items in the server’s memory db
});
```

Take a look at [the example in Github](https://github.com/strongloop/loopback/tree/master/example/client-server).

<h2 dir="ltr">
  <strong>The remote connector</strong>
</h2>

The remote connector enables clients to discover and call remote methods defined on the server. It works both in the browser and in Node.js. In the example above, sum is defined as a remote method.

```js
loopback.remoteMethod(
  CartItem.sum,
  {
    accepts: {arg: 'cartId', type: 'number'},
    returns: {arg: 'total', type: 'number'}
  }
);
```

The remote connector used in the client uses the remoting metadata in the example above to create a shim method. The shim calls the sum method on the server over REST.

<h2 dir="ltr">
  <strong>Browserify</strong>
</h2>

Browserify lets you require modules in the browser by bundling up all of your dependencies. LoopBack is compatible with Browserify and can be required in your browserify app. Just create an entry script. We’ll use `client.js` from the example above. Creating a bundle file by running the command line tool:

`Ω browserify client.js -o bundle.js`

Browserify parses your JavaScript for `require()` calls to traverse the entire dependency graph of your project. Drop a single `<script>` tag into your html and you can run your LoopBack app in your browser.

<h2 dir="ltr">
  <strong>What’s next?</strong>
</h2>

**Local Storage**

The remote connector is just the beginning. We are working on a local storage data source that enables you to persist LoopBack models in local storage.

**Replication**

For mobile apps and offline-capable apps, simple CRUD APIs aren’t enough. We’re working on a [new replication API](https://github.com/strongloop/loopback/pull/153) that enables you to sync data between data sources.  Combined with a local storage data source, the replication API would make building offline apps very simple. The example below demonstrates the basic usage of the replication API. Calling `LocalTodo.replicate(ServerTodo)` will push all the data stored locally to the server.

```js
// create a todo in local storage

LocalTodo.create({title: 'pick up milk from the store'});

// once you have a connection, sync it with the server

LocalTodo.replicate(ServerTodo);
```

<strong style="font-size: 1.5em;">Recap</strong>

LoopBack is coming to the browser! If you have any suggestions, comments or ideas, be sure to post to the [mailing list](https://groups.google.com/forum/#!forum/loopbackjs) or [open an issue on github](https://github.com/strongloop/loopback/issues?state=open).

## **What’s next?**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Install LoopBack with a <a href="http://strongloop.com/get-started/">simple npm command</a></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What’s in the upcoming Node v0.12 version? <a href="http://strongloop.com/strongblog/performance-node-js-v-0-12-whats-new/">Big performance optimizations</a>, read the blog by Ben Noordhuis to learn more.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Need performance monitoring, profiling and cluster capabilites for your Node apps? Check out <a href="http://strongloop.com/node-js-performance/strongops/">StrongOps</a>!</span>
</li>

&nbsp;