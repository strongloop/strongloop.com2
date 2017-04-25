---
id: 24139
title: How-to Cluster Node.js in Production with strong-cluster-control
date: 2015-04-22T07:45:56+00:00
author: Alex Gorbatchev
guid: https://strongloop.com/?p=24139
permalink: /strongblog/production-node-js-strong-cluster-control/
categories:
  - Community
---
## **Introduction**

<img src="https://strongloop.com/wp-content/uploads/2015/03/strong-cluster-control.gif" alt="" width="100%" />

“A single instance of Node runs in a single thread”. That’s how the [official documentation](https://nodejs.org/api/cluster.html) opens up. What this really means is that any given Node.js process can only take advantage of one CPU core on your server. If you have a processor with 6 cores, only one will really be doing all the work.

When you are writing a web application that is expected to get good traffic, it’s important to take full advantage of your hardware. There are two slightly different, yet pretty similar ways to do that:

  1. <span style="font-size: 18px;">Start as many Node processes on different ports as there are CPU cores and put a load balancer in front of them.</span>
  2. <span style="font-size: 18px;">Start a Node cluster with as many workers as there are CPU cores and let Node to take care of the load balancing.</span>

There are pros and cons to each. You get a lot more control with a dedicated load balancer, however configuring and managing it might get pretty complicated. If that’s not something you want to deal with right away you can sacrifice some control and let Node apply the basic [round-robin](http://en.wikipedia.org/wiki/Round-robin_scheduling) strategy to distribute the load across your workers.

It’s a very good idea to start thinking about clustering right away, even if you don’t do it. This approach forces you to design your application without a shared in-process state. If not done properly, this can cause incredible pain when the time finally comes to begin clustering and then scale to multiple servers.

This all might sound a little convoluted, but it all comes down to starting a “master” process which then spins up a specified number of “workers”, typically one per CPU core. Each one is a completely isolated Node process with it’s own memory and state.

<!--more-->

## **Node.js Clustering**

[Node APIs](https://nodejs.org/api/cluster.html) gives you bare bones, fully manual clustering functionality. You are responsible for initial boot up of all the workers and then restarting them if (or more likely when) they crash.

```js
var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  for (var i = 0; i &lt; numCPUs; i++) {
    cluster.fork(); // create a worker
  }

  cluster.on('exit', function(worker, code, signal) {
    // Do something when a worker crashes, typically
    // log the crash and start a new worker. 
  });
} else {
  // Workers can share any TCP connection.
  // In this case its a HTTP server.
  http.createServer(function(req, res) {
    res.writeHead(200);
    res.end("hello world\n");
  }).listen(8000);
}

```

This bare example was taken straight from the documentation and might seem like a good approach at first but comes with a few caveats:

  * If something goes wrong and workers keep crashing during startup, you now essentially have an infinite loop of crashing workers and the process of crashing and restarting will most likely take all of the available CPU cycles on the server. This is something you absolutely want to watch out for.
  * There’s no default communication channel between the workers, you have to roll your own. Using file descriptors to manage the routing across workers is not a simple and clean task and often the biggest challenge
  * There’s no way to gracefully shutdown or restart the whole cluster, again you have to roll your own.

## 

## **StrongLoop Clustering**

To address these issues StrongLoop developed [strong-cluster-control](https://github.com/strongloop/strong-cluster-control), which wraps native Node.js APIs to give you extended cluster functionality:

  * <span style="font-size: 18px;">Throttles worker restart rate if they are exiting abnormally.</span>
  * <span style="font-size: 18px;">Soft shutdown as well as hard termination of workers.</span>
  * <span style="font-size: 18px;">Provides a common in-memory storage for workers (via <a href="https://github.com/strongloop/strong-store-cluster">strong-store-cluster</a>).</span>

```js
var cluster = require('cluster');
var control = require('strong-cluster-control');

// global setup here...

control.start({
  size: control.CPUS,
  shutdownTimeout: 5000,
  terminateTimeout: 5000,
  throttleDelay: 5000
}).on('error', function(er) {
  // don’t need to manually restart the workers
});

if (cluster.isWorker) {
  // do work here...
}
```

[strong-cluster-control](https://github.com/strongloop/strong-cluster-control) is accompanied by a few other modules that you can install.

## **strong-store-cluster**

[strong-store-cluster](https://github.com/strongloop/strong-store-cluster) is a basic key/value store that is shared between all workers. The most useful feature is ability to acquire exclusive key locks by workers.

[strong-store-cluster](https://github.com/strongloop/strong-store-cluster) works by placing all data in a master process object where the key is the property name and the data is the value of the property. When you require the [strong-store-cluster](https://github.com/strongloop/strong-store-cluster) module, the master process gets a different implementation of the interface than the worker. The master process API refers to the object storing the key/value pairs while the worker API uses `process.send()` to asynchronously request the key/value pair from the master process.

The API for the worker and the master is the same.

```js
// require the collection, and give it a name
var collection = require('strong-store-cluster').collection('test');
var key = 'ThisIsMyKey';
 
// don't let keys expire, ever - values are seconds to expire keys
collection.configure({ expireKeys: 0 });
 
// set a key in the current collect to the object
collection.set(key, { a: 0, b: 'Hiya', c: { d: 99 } }, function(err) {
  // now get the object we just set
  collection.acquire(key, function(err, keylock, value) {
    // Do something with the value…

    // Release the lock.
    keylock.release();
  });
});

```

## **strong-cluster-connect-store**

[strong-cluster-connect-store](https://github.com/strongloop/strong-cluster-connect-store) is an implementation of [connect](https://github.com/senchalabs/connect) session store and provides an easy way for using sessions in [connect](https://github.com/senchalabs/connect)/[express](https://github.com/strongloop/express) based applications running in a Node cluster. For example:

```js
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');

// Does not install own `express` modules
var ClusterStore = require('strong-cluster-connect-store')(session);
 
var app = express();

app
  .use(cookieParser())
  .use(session({ store: new ClusterStore(), secret: 'keyboard cat' }));
```

## **Clustering still needs a supervisor**

Using clustering as an application dependency sounds cool, but can be limiting. A supervisor is needed to meet the needs of systemd/upstart support, deploy tooling, run-time control, remote access and lifecycle management capabilities.

There are two basic approaches to run-time supervision:

**runner based:** [strong-pm](http://strong-pm.io), pm2, forever, nodemon, cluster-service
  
**api based:** ebay/cluster2, cluster-master, strong-cluster-control, node-cluster-app, godaddy/cluster-service

If one has the API, a runner can be constructed, however the opposite is not necessarily true. You may begin by writing a supervisor function super.js like

```js
require('strong-store-cluster');

if (cluster.isWorker){
require._load(process.argv[2]);
//This is total pseudo code
}

```

Advice: Don&#8217;t reinvent the wheel, there are numerous open source node supervisors which have taken years to mature.

At a high level, supervisors essentially implement the following:

  * <span style="font-size: 18px;"><strong>wrapper:</strong> encapsulate the cluster API and expose them as runtime controls</span>
  * <span style="font-size: 18px;"><strong>start:</strong> single, clustered, daemonized, exit on error</span>
  * <span style="font-size: 18px;"><strong>shutdown:</strong> graceful stop after closing connections</span>
  * <span style="font-size: 18px;"><strong>stop:</strong> not so graceful&#8230;</span>
  * <span style="font-size: 18px;"><strong>restart:</strong> on exit, throttled,rolling, on file change, maintenance</span>
  * <span style="font-size: 18px;"><strong>groups of apps:</strong> group settings on same app across multiple hosts</span>
  * **<span style="font-size: 18px;">initd/upstart/etc. integration</span>**
  * <span style="font-size: 18px;"><strong>state management:</strong> save PIDs, write to disk, log node APIs/stdio, log rotation, boot scripts, debug</span>
  * <span style="font-size: 18px;"><strong>configuration:</strong> env vars, .json/rc files, etc</span>
  * <span style="font-size: 18px;"><strong>control interfaces:</strong> cli, remote cli w/TCP and auth, signal support, remote API (json on tcp/http), repl based execution</span>
  * <span style="font-size: 18px;"><strong>status:</strong> cpu, mem, connections, idle connections, volume, leaks of resources, app status, metrics, load balancing</span>
  * **<span style="font-size: 18px;">intra-worker message passing</span>**

If you are running in production, you should definitely checkout [StrongLoop Process Manager](https://strongloop.com/strongblog/node-js-process-manager-production-docker/), which encapsulates the functionality of clustering, nginx load balancing, supervisor as well as devops functions of build, deploy, monitor and scale on remote servers and Docker containers.

&nbsp;

&nbsp;