---
id: 8518
title: Real-time Engines in Node.js
date: 2013-11-14T09:30:22+00:00
author: Marc Harter
guid: http://strongloop.com/?p=8518
permalink: /strongblog/real-time-engines-in-node-js/
categories:
  - How-To
---
[<img class="aligncenter size-full wp-image-8521" alt="1-UfF1rdF3tiQ7CXpj5DDXIA" src="{{site.url}}/blog-assets/2013/10/1-UfF1rdF3tiQ7CXpj5DDXIA.jpeg" width="1200" height="504" />]({{site.url}}/blog-assets/2013/10/1-UfF1rdF3tiQ7CXpj5DDXIA.jpeg)

Node arrived on the scene around the time the WebSocket protocol was drafted. Node’s fast, evented approach to server-side programming was a perfect pairing for WebSocket. Out of that marriage emerged the popular <a href="http://socket.io/" target="_blank">socket.io framework</a>: an instant favorite used heavily in the first <a href="http://nodeknockout.com/" target="_blank">Node Knockout</a> competition.

Now that WebSocket is <a href="http://tools.ietf.org/html/rfc6455" target="_blank">mature</a> and has support in <a href="http://caniuse.com/#search=websocket" target="_blank">all the modern desktop browsers</a> and most mobile platforms, the dust has settled a bit. Let’s take a look at what’s available in Node for WebSocket.<!--more-->

## **The WebSocket module ecosystem**<figure>

[<img class="aligncenter size-full wp-image-8520" alt="1-j4WMa8XcHIJr0FhnVCUjbA" src="{{site.url}}/blog-assets/2013/10/1-j4WMa8XcHIJr0FhnVCUjbA.png" width="900" height="400" />]({{site.url}}/blog-assets/2013/10/1-j4WMa8XcHIJr0FhnVCUjbA.png)
  
<figcaption>The layers of real-time engines</figcaption> </figure> 

WebSocket modules can be divided up into three categories. The first are _protocol implementations_ (drivers) which focus on high performance of and standards compliance to the WebSocket protocol. Like the http module, they provide a low-level implementation.

WebSocket _emulators_ build on the protocol implementations by adding fallback WebSocket-like functionality using transports like XHR long-polling or htmlfile. These modules exist as a compatibility layer to enable real-time for browsers or networks that do support WebSocket.

Lastly, there are _high-level_ modules which build on the emulation layer with conveniences such as broadcast messages, channels, rooms, and custom event emitters.

> The intention of this article is not to provide an exhaustive list of all modules existing in Node space as there are simply <a href="https://npmjs.org/search?q=websocket" target="_blank">too many to cover</a>. However, if there is one I missed that will add to the discussion, please make a comment!

## The WebSocket Protocol implementations

Drivers implement the core WebSocket functionality by providing both server and client interfaces. Typically, they are not used directly. However, if you know your environment has reliable WebSocket support (as there is no falling back), drivers provide a nice minimal surface to build on.

Here are some popular drivers:

## Module: ws

The <a href="https://github.com/einaros/ws" target="_blank">ws</a> module backs the popular socket.io framework. It boasts the fastest compliant implementation of WebSocket and includes a helpful wscat command line tool for debugging WebSocket servers. It requires compilation of native add-ons.

## Module: faye-websocket

The <a href="https://github.com/faye/faye-websocket-node" target="_blank">faye-websocket</a> module is a pure JavaScript implementation that backs the popular sockjs framework. In addition to a WebSocket driver, it also includes an <a href="http://www.w3.org/TR/eventsource/#the-eventsource-interface" target="_blank">EventSource</a> implementation for when you only need server-sent events. The WebSocket driver has been broken out into a separate <a href="https://github.com/faye/websocket-driver-node" target="_blank">module</a>, and provides a neat streaming API.

## Module: websocket

The <a href="https://github.com/faye/websocket-driver-node" target="_blank">websocket</a> module is another popular implementation that has existed for a while. It is fast and can be run without native module compilation (although not as efficiently).

## The WebSocket Emulation modules

Unfortunately, WebSocket does not work <a href="https://github.com/sockjs/sockjs-client#supported-transports-by-browser-html-served-from-http-or-https" target="_blank">everywhere</a>. Even browsers supporting WebSocket run into issues if the network isn’t conducive to WebSocket. Here is where emulation modules come into play. They employ different strategies to ensure the browser gets the best possible real-time transport available (which ultimately is WebSocket).

Here are some popular emulation modules:

## Module: sockjs

The <a href="https://github.com/sockjs/sockjs-node" target="_blank">sockjs</a> module is built on faye-websocket and is a mature WebSocket emulation layer that follows a _downgrade_ path. This means it will try the best protocol first and then fallback, if necessary, until it finds a working transport. It is used in conjunction with the client-side <a href="https://github.com/sockjs/sockjs-client" target="_blank">sockjs-client</a> module. It includes a number of faster streaming transports as well as polling. Implementations exist for a number of other, non-Node, platforms if interoperability is important.

## Module: engine.io

The <a href="https://github.com/LearnBoost/engine.io" target="_blank">engine.io</a> module is newer on the scene. It is built on ws by the guys behind socket.io. It follows an _upgrade_ path. This means it will try the most _reliable_ protocol first and then upgrade to the best available protocol. The <a href="https://github.com/LearnBoost/engine.io#goals" target="_blank">reasons</a> stem from failures in the downgrade path detailed in the readme. It is used in conjunction with the client-side <a href="https://github.com/LearnBoost/engine.io-client" target="_blank">engine-io-client</a> module.

## High-level API Sugar

If you need a high-functioning real-time engine without a ton of bells and whistles, sockjs or engine.io is the way to go. However, if your applications needs channels, rooms, broadcasting, or custom event emitters, there are options for that as well.

Since numerous modules fall under this category, we will only cover a few here:

## Module: socket.io

The <a href="https://github.com/learnboost/socket.io/tree/0.9" target="_blank">socket.io</a> module is the original wildly popular real-time engine. It includes features such as broadcasting, rooms, namespaces, and custom event emitters. It is “still” in development, but version 1.0 integrates with engine.io (the latest stable 0.9.x does not).

## Modules: websocket-multiplex and shoe

The <a href="https://github.com/sockjs/websocket-multiplex" target="_blank">websocket-multiplex</a> module builds on sockjs and provides channel support. The <a href="https://github.com/substack/shoe" target="_blank">shoe</a> module also builds on sockjs and provides a neat stream-based approach to WebSocket.

## Module: primus

The <a href="https://github.com/primus/primus" target="_blank">primus</a> module wraps around several real-time frameworks, such as engine.io and sockjs, to prevent vender lock-in. It includes a number of modules that add the functionality you need: channels (multiplexing), custom event emitters, rooms, etc.

## A fireside chat about real-time engines

Here’s a little advice from one who has “walked through the fire” of debugging real-time engines:

  1. <span style="font-size: medium;">Use only what you need and nothing more. In my experience, staying at the emulation layer with a library like sockjs or engine.io and building only what I need has proven easier to debug. I haven’t used primus personally, but I like the modular approach there. However, something feature-rich like socket.io enables faster prototyping of ideas.</span>
  2. <span style="font-size: medium;">The downgrade approach is slightly faster to set up, but <a href="https://github.com/sockjs/sockjs-client/issues/94?source=cc" target="_blank">has problems on some networks</a>; upgrade approach is slightly slower, but more reliable. Both approaches have their merits. I’m curious as to how that is playing out for others.</span>
  3. <span style="font-size: medium;">WebSocket running on port 80 can be the most troublesome for corporate firewalls as everybody likes to have their hands on that port! Try switching to 443 (SSL) or any other port to fix problems upgrading the protocol.</span>

## Keeping it real-time

In this article, we surveyed a number of WebSocket modules in Node. We started with implementations (drivers) which provide the core WebSocket protocol. Then we looked at emulation modules which wrap WebSocket and a number of fallback transports in a common API. Lastly, we looked at high-level sugar modules that extend the emulation layers with additional conveniences.

WebSocket has become a game-changer in web development by enabling games, frameworks, and applications that were not possible before. What will you build?

## **[What’s next?](http://strongloop.com/get-started/)**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What’s in the upcoming Node v0.12 release? <a href="http://strongloop.com/node-js/whats-new-in-node-js-v0-12/">Six new features, plus new and breaking APIs</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js <a href="http://strongloop.com/node-js/loopback/">LoopBack framework</a>. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Need <a href="http://strongloop.com/node-js-support/expertise/"]]>training and certification</a> for Node? Learn more about both the private and open options StrongLoop offers.</span>
</li>