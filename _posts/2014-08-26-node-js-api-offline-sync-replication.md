---
id: 19559
title: 'Node.js API Tip: Offline Sync and Replication'
date: 2014-08-26T08:44:53+00:00
author: Shubhra Kar
guid: http://strongloop.com/?p=19559
permalink: /strongblog/node-js-api-offline-sync-replication/
categories:
  - API Tip
  - How-To
  - LoopBack
  - Mobile
---
Mobile technologies have radically changed our personal lives and are now doing the same in the workplace—perhaps not as rapidly as many of us would like!
  
<img class="aligncenter size-full wp-image-19562" src="https://strongloop.com/wp-content/uploads/2014/08/lead2.jpg" alt="lead2" width="650" height="330" srcset="https://strongloop.com/wp-content/uploads/2014/08/lead2.jpg 650w, https://strongloop.com/wp-content/uploads/2014/08/lead2-300x152.jpg 300w, https://strongloop.com/wp-content/uploads/2014/08/lead2-450x228.jpg 450w" sizes="(max-width: 650px) 100vw, 650px" />
  
Not every office looks like this, although at times we might feel this way. Many of us now have two or sometimes even three personal and company devices we wish were always in sync with realtime updates to email, schedules, storage, and even transactions. However, this is far from reality. Data replication and offline sync are not seamless across multi-vendor devices or disparate backends.

## **How does this affect the enterprise ?**

The ability to work offline has emerged as a requirement for almost all data-driven enterprise mobile applications. This is especially true with relaxed BYOD policies plus enterprise field and sales enablement apps growing.
  
<img class="aligncenter size-full wp-image-19564" src="https://strongloop.com/wp-content/uploads/2014/08/wilson-5w.png" alt="wilson 5w" width="426" height="640" srcset="https://strongloop.com/wp-content/uploads/2014/08/wilson-5w.png 426w, https://strongloop.com/wp-content/uploads/2014/08/wilson-5w-199x300.png 199w" sizes="(max-width: 426px) 100vw, 426px" />
  
However, a wireless app is only as good as the network. When disconnected from the network, a client app should have the capability to save the state of the transaction locally and synchronize with the server when it reconnects.

Until now, developers first had to figure out how to store a subset of the application’s data locally. Second, they had to implement a mechanism to keep the data synchronized on both the client and server.

Existing sync and replication techniques are limited to proprietary data sources, and are heavy and inflexible. Most synching is native in the implementation stack and also platform/device specific. Fine-grained controls on the behavior for common use cases like change detection and conflict resolution are also lacking.

<!--more-->

## **Introducing Loopback**

[LoopBack](http://strongloop.com/node-js/loopback/)  is an open source Node.js API framework from StrongLoop that provides out of box offline synchronization using isomorphic JavaScript. For data replication it uses model-based data persistence.

This functionality is available for client side [Angularjs](http://docs.strongloop.com/display/LB/AngularJS+JavaScript+SDK) and [JavaScript](http://docs.strongloop.com/display/LB/AngularJS+JavaScript+SDK) web or mobile apps. It also supports backend data sources like [Oracle](http://docs.strongloop.com/display/LB/Oracle+connector), [SQL Server](http://docs.strongloop.com/display/LB/SQL+Server+connector), [MongoDB](http://docs.strongloop.com/display/LB/MongoDB+connector), [PostgreSQL](http://docs.strongloop.com/display/LB/PostgreSQL+connector), [MySQL](http://docs.strongloop.com/display/LB/MySQL+connector) and any [LoopBack connector](http://docs.strongloop.com/display/LB/Data+sources+and+connectors) that supports create, read, update and delete (CRUD) operations.

## Isomorphic JavaScript and model-based replication

The Loopback API framework is designed around the idea of [model-driven API development](http://strongloop.com/strongblog/node-js-api-tip-model-driven-development/). In a the server-side Node application, logical objects like tables from relational databases or collections from NoSQL datasources like MongoDB or even existing SOAP or REST APIs are discovered and persisted as models. Each model can be aggregated, mashed up and customized with business logic during the modeling exercise. A model&#8217;s structure and schema validation are defined in JavaScript and are independent of the connected backend structure.
  
<img class="aligncenter size-full wp-image-19565" src="https://strongloop.com/wp-content/uploads/2014/08/replication.png" alt="replication" width="562" height="314" srcset="https://strongloop.com/wp-content/uploads/2014/08/replication.png 562w, https://strongloop.com/wp-content/uploads/2014/08/replication-300x167.png 300w, https://strongloop.com/wp-content/uploads/2014/08/replication-450x251.png 450w" sizes="(max-width: 562px) 100vw, 562px" />
  
When switching between datasources, these models and references remain unaffected. This permits the seamless replication of data between say a MongoDB instance, and an Oracle database or between two relational data stores like SQL Server and PostgreSQL. Because Loopback can run in your datacenter or on the cloud, it allows data replication to happen across production environments.

These server side models are exposed to the client as JavaScript or natively in iOS and Android using [SDKs](http://docs.strongloop.com/display/LB/Client+SDKs). The state of these models is synchronous, thereby allowing CRUD operations to occur with built-in conflict resolution capabilities.
  
<img class="aligncenter size-full wp-image-16542" src="https://strongloop.com/wp-content/uploads/2014/05/sync21.png" alt="sync2" width="1500" height="677" />

Because LoopBack is leveraging isomorphic JavaScript, it can take this remoting capability much further. You can even persist the backend data models into the HTML5 local storage of the browser.

When the client app goes offline, these stored models are still available in the browser. When the device reconnects, any changes to these models or data stored within it is synched to the model on the backend or vice versa. Multiple app instances on the client or multiple clients may be updating the same shared data model. Hence, to avoid data corruption, special asynchronous conflict resolution is built into the server side.

## Why replication?

Replication allows you to easily sync data across various databases using Node or the browser. This functionality moves data between clients and servers, plus lets you focus on what makes your app useful. Below are some use cases that I find particularly interesting:

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

## A simple replication example

Below is example that describes a simple todo list application.

As a busy person on the go, I should be able to read and write to my todo list. I need access  to my todo list on my phone while I walk to the office. While at work, on my laptop, I should be able to view the tasks I’ve entered on my phone and vice-versa.

This app represents the typical “sync” problem. You have data on several client devices that must be kept in-sync. Below is a basic example of LoopBack in the browser that replicates a todo list to and from a LoopBack server.
  
<img class="aligncenter size-full wp-image-19567" src="https://strongloop.com/wp-content/uploads/2014/08/Todo_Blank.png" alt="Todo_Blank" width="1158" height="950" srcset="https://strongloop.com/wp-content/uploads/2014/08/Todo_Blank.png 1158w, https://strongloop.com/wp-content/uploads/2014/08/Todo_Blank-300x246.png 300w, https://strongloop.com/wp-content/uploads/2014/08/Todo_Blank-1030x844.png 1030w, https://strongloop.com/wp-content/uploads/2014/08/Todo_Blank-450x369.png 450w" sizes="(max-width: 1158px) 100vw, 1158px" />

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

Below is the server side of the basic todo application. It attaches the server’s `Todo` model to both MongoDB and the LoopBack REST API. You could swap MongoDB out for MySQL, Postgres, Oracle, or any other database that LoopBack supports. To learn more about how to work with models in LoopBack, check out the [documentation](http://docs.strongloop.com/display/LB/Working+with+models).

[<img class="aligncenter size-full wp-image-19568" src="https://strongloop.com/wp-content/uploads/2014/08/Todo_Server_Blank.png" alt="Todo_Server_Blank" width="1600" height="1130" srcset="https://strongloop.com/wp-content/uploads/2014/08/Todo_Server_Blank.png 1600w, https://strongloop.com/wp-content/uploads/2014/08/Todo_Server_Blank-300x211.png 300w, https://strongloop.com/wp-content/uploads/2014/08/Todo_Server_Blank-1030x727.png 1030w, https://strongloop.com/wp-content/uploads/2014/08/Todo_Server_Blank-1500x1059.png 1500w, https://strongloop.com/wp-content/uploads/2014/08/Todo_Server_Blank-260x185.png 260w, https://strongloop.com/wp-content/uploads/2014/08/Todo_Server_Blank-450x317.png 450w" sizes="(max-width: 1600px) 100vw, 1600px" />](https://strongloop.com/wp-content/uploads/2014/08/Todo_Server_Blank.png)

```js
// --- server.js ---
// create the server app
var server = loopback();

// create a mongodb datasource
var db = loopback.createDataSource({
url: 'mongodb://localhost:27015',
connector 'mongodb'
})

// setup the Todo model
var Todo = require('./todo');
Todo.attachTo(db);
server.model(Todo);

// use the strong-remoting rest adapter
server.use(loopback.rest());

// start the server
server.listen(3000);
```

## ** Add some todos and watch them autosync**

next we will add a couple of todos in our client app. Here we are connected on the network, hence the changes should be reflected in realtime on the server side models and persisted into MongoDB.
  
<img class="aligncenter size-full wp-image-19569" src="https://strongloop.com/wp-content/uploads/2014/08/Todo_Sync.png" alt="Todo_Sync" width="1166" height="1176" srcset="https://strongloop.com/wp-content/uploads/2014/08/Todo_Sync.png 1166w, https://strongloop.com/wp-content/uploads/2014/08/Todo_Sync-80x80.png 80w, https://strongloop.com/wp-content/uploads/2014/08/Todo_Sync-297x300.png 297w, https://strongloop.com/wp-content/uploads/2014/08/Todo_Sync-1021x1030.png 1021w, https://strongloop.com/wp-content/uploads/2014/08/Todo_Sync-36x36.png 36w, https://strongloop.com/wp-content/uploads/2014/08/Todo_Sync-120x120.png 120w, https://strongloop.com/wp-content/uploads/2014/08/Todo_Sync-450x453.png 450w" sizes="(max-width: 1166px) 100vw, 1166px" />
  
Now, lets add two todos &#8211; “eat food” and “drink water” on the Angularjs client app running on my smartphone. When I query the REST API on the server side with Loopback explorer, I can see that the “Get” request for todos returns me the same two items we already entered. You can notice here that our debug statement provides the network status `connected:true`.

<img class="aligncenter size-full wp-image-19570" src="https://strongloop.com/wp-content/uploads/2014/08/Todo_Server_Sync.png" alt="Todo_Server_Sync" width="1482" height="1390" srcset="https://strongloop.com/wp-content/uploads/2014/08/Todo_Server_Sync.png 1482w, https://strongloop.com/wp-content/uploads/2014/08/Todo_Server_Sync-300x281.png 300w, https://strongloop.com/wp-content/uploads/2014/08/Todo_Server_Sync-1030x966.png 1030w, https://strongloop.com/wp-content/uploads/2014/08/Todo_Server_Sync-450x422.png 450w" sizes="(max-width: 1482px) 100vw, 1482px" />
  
What happened under the hood was that the data we applied to the models on the frontend app was synchronously remoted to the same model definition we had on the backend. The LoopBack Node application then persisted this data on the MongoDB backend that it is connected to. When we query MongoDB with an auto-generated REST API endpoint (“GET”) that Loopback provides, we are able to fetch the same dataset.

## **Now for some fun!**

<img class="aligncenter size-full wp-image-19571" src="https://strongloop.com/wp-content/uploads/2014/08/no-signal-reception.png" alt="no-signal-reception" width="544" height="309" srcset="https://strongloop.com/wp-content/uploads/2014/08/no-signal-reception.png 544w, https://strongloop.com/wp-content/uploads/2014/08/no-signal-reception-300x170.png 300w, https://strongloop.com/wp-content/uploads/2014/08/no-signal-reception-450x255.png 450w" sizes="(max-width: 544px) 100vw, 544px" />
  
Let’s saw while taking the walk to the office, we are day-dreaming and wander off into a forest. In a brilliant state of mind, we are not aware of that we have lost network connectivity and we keep punching in todos items.
  
<img class="aligncenter size-full wp-image-19572" src="https://strongloop.com/wp-content/uploads/2014/08/Todo_disconnected.png" alt="Todo_disconnected" width="910" height="1080" srcset="https://strongloop.com/wp-content/uploads/2014/08/Todo_disconnected.png 910w, https://strongloop.com/wp-content/uploads/2014/08/Todo_disconnected-252x300.png 252w, https://strongloop.com/wp-content/uploads/2014/08/Todo_disconnected-867x1030.png 867w, https://strongloop.com/wp-content/uploads/2014/08/Todo_disconnected-450x534.png 450w" sizes="(max-width: 910px) 100vw, 910px" />
  
You&#8217;ll notice that our debug statement provides the network status “connected:false” . Obviously, the server persistence does not happen at this time. Let’s check to make sure:
  
<img class="aligncenter size-full wp-image-19573" src="https://strongloop.com/wp-content/uploads/2014/08/Todo_Server_Sync-1-1030x966.png" alt="Todo_Server_Sync (1)" width="1030" height="966" srcset="https://strongloop.com/wp-content/uploads/2014/08/Todo_Server_Sync-1-1030x966.png 1030w, https://strongloop.com/wp-content/uploads/2014/08/Todo_Server_Sync-1-300x281.png 300w, https://strongloop.com/wp-content/uploads/2014/08/Todo_Server_Sync-1-450x422.png 450w, https://strongloop.com/wp-content/uploads/2014/08/Todo_Server_Sync-1.png 1482w" sizes="(max-width: 1030px) 100vw, 1030px" />

## **Let&#8217;s get online**

Finally, we come to our senses and realize that we are miles away from our office. So, let&#8217;s head back and come to a street where network reception is strong. Let’s check the server one more time now.
  
<img class="aligncenter size-full wp-image-19574" src="https://strongloop.com/wp-content/uploads/2014/08/Server_Resync.png" alt="Server_Resync" width="1464" height="1402" srcset="https://strongloop.com/wp-content/uploads/2014/08/Server_Resync.png 1464w, https://strongloop.com/wp-content/uploads/2014/08/Server_Resync-300x287.png 300w, https://strongloop.com/wp-content/uploads/2014/08/Server_Resync-1030x986.png 1030w, https://strongloop.com/wp-content/uploads/2014/08/Server_Resync-450x430.png 450w" sizes="(max-width: 1464px) 100vw, 1464px" />
  
We can see that the two new todos that we entered while offline have been synced to the server automatically. Other use cases like server-server replication, conflict management, etc, can all be executed using the same example app.

## Try it yourself

This [full-stack example](https://github.com/strongloop/loopback-example-full-stack) illustrates the basic approach for offline sync using LoopBack on both the server and in the browser. Stay tuned for more detailed examples of some of the use cases above. Get started today by checking out the [replication docs](http://docs.strongloop.com/display/LB/Synchronization).