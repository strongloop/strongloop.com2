---
id: 24577
title: 'Introducing StrongLoop&#8217;s Unopinionated Node.js Pub/Sub'
date: 2015-04-28T14:01:31+00:00
author: Ritchie Martori
guid: https://strongloop.com/?p=24577
permalink: /strongblog/introducing-strongloops-unopinionated-pubsub/
categories:
  - Community
  - How-To
  - LoopBack
---
_Unopinionated, Node.js powered Publish &#8211; Subscribe for mobile, IoT and the browser._

There are many ways to push data from a Node app to another app (written in Node, the browser, or other platforms and languages). Several frameworks have arisen around the vague term “realtime” to provide features along these lines. Strong-pubsub is a library of unopinionated modules that implement the basic [publish-subscribe](http://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) programming model without a strict dependency on any transport mechanism (websockets, HTTP, etc.) or protocol (eg. MQTT, STOMP, AMQP, Redis, etc.).

Instead of implementing a specific transport, [strong-pubsub](https://github.com/strongloop/strong-pubsub/) allows you to swap out an underlying adapter that implements a pubsub protocol (for example MQTT). It also allows you to swap out an underlying transport (TCP, TLS, WebSockets, or even [Primus](https://github.com/primus/primus)).

## **Why do I need this?**

There are many uses cases for pubsub generally, but below are some of those that drove the design of the strong-pubsub module. Keep in mind these use cases are at a fairly high level, but if they sound like something you’re working on then there is a great chance that you can use strong-pubsub!

For example, you might be developing a client-side application for browsers and want to be able to bind local Backbone / Angular / etc models (or objects) to data from a LoopBack API. When data in the API changes, the local (client-side) data should be updated immediately. This reduces perceived lag by the user, and could lead to fewer issues with multiple people updating the same information.

Alternatively, if you’re an IoT Node.js developer, you can send messages from my Node server or other Node processes to any clients. These could include other Node.js programs and clients written in other languages or platforms (arduino, c++, ios, android, etc) using any protocol (eg. MQTT).

Or perhaps you’re working on a Node.js server for a chat application and you need to be able to send messages to multiple users at once. Since the Node cluster consists of many servers, you might need to send a message from one server and have it delivered to all users connected to any of the other servers. Many enterprise developers need to integrate with existing pubsub infrastructures, including existing broker or authentication services.

<!--more-->

With a basic idea of what problem we are trying to solve out of the way let’s get into the actual module itself. The base module (strong-pubsub) exports a `Client` class.

The `Client` class provides a unified pubsub client in Node.js and the browser. It supports subscribing to topics. Clients can connect to brokers or proxies that support the `client.adapter`’s protocol. Here’s a basic example of creating a `Client` using the MQTT adapter:

```js
var Client = require('strong-pubsub');
var Adapter = require('strong-pubsub-mqtt');

// create a client with an options object
var client = new Client({
  host: 'localhost',
  port: 3456
}, Adapter);
```

Once you have a client, basic publishing of messages and subscribing to topics is easy! Here’s a simple subscription using the `Client` we created above. Note that we can handle connection/subscription issues in the one-time callback to the `subscribe()` method.

```js
client.subscribe('node-chat', function callback(err, topic, message, options){
  if (err) {
    // handle any subscription errors
  }
});

client.on('message', function(topic, msg) {
  console.log('Received new message!', msg);
  // add message to the user’s chat window
});
```

Any other client connected to the same broker (or bridge) can publish messages to all other connected clients:

```js
someOtherClient.publish('node-chat', 'Hello world! We <3 Node.js!');

```

And of course, unsubscribing is a simple method call (with an optional second argument of a callback function for error handling):

```js
client.unsubscribe('node-chat');
```

You can read more about the client API on the Github repository.

## **PubSub Flow**

This diagram illustrates how messages flow between clients, bridges, servers and brokers. The blue arrows represent a message published to a topic. The green arrow represents the message being sent to a subscriber. In the next section we’ll see how to actually create a bridge.

<img class="aligncenter size-large wp-image-24582" src="{{site.url}}/blog-assets/2015/04/pubsub-1030x698.png" alt="pubsub" width="1030" height="698"  />

## **Brokers and Bridges Make it All Unopinionated**

In order to distribute a message published to a topic, a client connects to a message broker. Client adapters allow pubsub clients to connect to various brokers. Clients can connect directly to brokers or indirectly using a bridge.

In some cases, clients should not connect directly to a message broker. The `Bridge` class allows clients to indirectly connect to a broker. The bridge supports hooks for injecting logic between the client and the broker. Hooks allow you to implement client authentication and client action (publish, subscribe) authorization using vanilla Node.js.

Bridges also allow clients to connect to brokers over a protocol that the broker may not natively support. For example, a client can connect to the proxy using one protocol (eg. MQTT) and the bridge will connect to the broker using another (eg. STOMP).

<img class="aligncenter size-full wp-image-24583" src="{{site.url}}/blog-assets/2015/04/pubsub2.png" alt="pubsub2" width="976" height="639"  />

Here’s a short example of setting up a simple bridge. This would forward messages between MQTT clients and a [Mosquitto](http://mosquitto.org/) server.

```js
var server = require('./my-existing-server');
var Adapter = require('strong-pubsub-mqtt');
var MqttConnection = require('strong-pubsub-connection-mqtt');

server.on('connection', function(conn) {
  var mqttConnection = new MqttConnection(conn);
  var client = new Client({host: 'my.mosquitto.org', port: 2222}, Adapter);

  var bridge = new Bridge(mqttConnection, client);
  bridge.connect();
});
```

## **Hooking in Authorization**

Hooks allow you to run arbitrary functions before an action is performed (eg. publish, subscribe). For example, this code shows how to add authorization before a client’s message is published to a broker. This approach can be used with other actions as well (eg. subscribe).

```js
// On the server...
// supported actions: connect, publish, and subscribe
bridge.before('publish', function(client, next) {
  var user = parseCredentials(client.credentials).user;
  canUserPublishToTopic(user, client.topic, function(err) {
    if(err) {
      // Not authorized, the action will be denied
      next(err); // Express-style error handling
    } else {
      next(); // the action will continue
    }
  });
});

// On the client...
client.publish('hello world');
```

## **Show Me the Code!**

The main library can be found on Github here: [strongloop/strong-pubsub](https://github.com/strongloop/strong-pubsub), but you might also be interested in the [proxy bridge module](https://github.com/strongloop/strong-pubsub-bridge),the [MQTT](https://github.com/strongloop/strong-pubsub-mqtt) or [redis](https://github.com/strongloop/strong-pubsub-redis) adapters, the [MQTT connection module](https://github.com/strongloop/strong-pubsub-connection-mqtt), or the [Primus transport layer](https://github.com/strongloop/strong-pubsub-primus). Give it a test run and let us know what you think! We’d love to incorporate more adapters and bridges.
  
The documentation for all these modules is available at <http://docs.strongloop.com/display/MSG/Pub-sub>. Currently, the documentation provides the same information as the READMEs, but it consolidates it, making it easier to view the docs of eight related repositories (including examples) and navigate among them.