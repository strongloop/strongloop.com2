---
layout: post
title: Announcing StrongNode 1.0 GA – an Enterprise Ready Node.js Distribution 
date: 2013-05-22
author: Al Tsang
permalink: /strongblog/announcing-strongnode-GA/
categories:
  - Product
  - News
redirect_from:
  - /strongblog/announcing-strongloop-node-1-0-ga-an-enterprise-ready-node-js-distribution/
  - https://strongloop.com/strongblog/announcing-strongloop-node-1-0-ga-an-enterprise-ready-node-js-distribution/
---

**NOTE:** StrongNode is no longer available. We recommend [API Connect](https://developer.ibm.com/apiconnect/getting-started/) for building APIs.

Back in March we first announced the availability of StrongNode, our commercially supported distribution of Node.js based on v0.10. After three Beta releases, lots of feedback from the community and our customers, plus testing and more testing, we are pleased to announce the general availability of StrongNode 1.0.

## Why a commercially supported distribution of Node.js?

Our distribution gives you a path forward to get technical support and bug fix coverage before heading into production. For developers who are new to Node, our distribution gives you the perfect starting point. Navigating over [30,000 modules](https://web.archive.org/web/20140126163354/https://npmjs.org/) and the unique features of Node itself can require a lot of mental overhead and be an overwhelming experience. StrongNode comes with vetted modules, advanced features like message queue support, private npm repos, and a utility for scaffolding Node applications. It’s the easiest way to get started as a Node.js developer, or to upgrade your Node.js development experience.

We also offer subscription based support, priced accordingly, depending on where you are in your development cycle.

Bottom line: Starting your development on StrongNode ensures that by the time you go into production you’ll have a company and a feature set that stands behind you, ready to help you resolve any issues should you encounter any.

## What exactly is StrongNode?

StrongNode 1.0 is available for Windows, Linux and MacOS X. It comes packaged with Node.js v0.10.7, npm, the slc command-line utility and a set of supported npm modules, including:

- Express – web application framework
- Connect – rich middleware framework
- Passport – simple, unobtrusive authentication
- Mongoose – elegant mongodb object modeling
- Async – higher-order functions and common patterns for asynchronous code
- Q – a tool for making and composing asynchronous promises in JavaScript
- Request – a simplified HTTP request client
- Socket.IO – cross-browser WebSocket for realtime apps
- Engine.IO – transport layer for real time data exchange
- SL Task Emitter - perform an unknown number of async tasks recursively
- SL Config Loader – recursively load config files
- SL Module Loader - separate your app into modules loaded by config files
- SL MQ – MQ API with cluster integration, implemented over various message queues

## slc – The Swiss Army Knife for Node

slc is a command line tool that ships with StrongLoop Node for building and managing applications. Features include:

- Support for private npm repositories
- Rapid creation of boilerplate for modules
- Easy generation of web application templates
- Including code to connect to MongoDB backends
- Code for a RESTful API server
- Boilerplate for command-line applications
- A wrapper for all npm commands
- Ability to run Node scripts

You can view all the supported commands on the [StrongNode product page](http://strongloop.com/products/resources#?t=using-slnode).

## Support for Message Queues

StrongLoop has created a simple and lightweight message queue module that should cover the most common use cases involving a message queue.

By using the sl-mq API, developers can pass messages between Node processes on the same server without having to install or maintain a separate message queuing system. But, we didn’t stop there, the sl-mq API is also an abstract wrapper API for high-scale message queues, allowing developers to change message queue back-ends with a single line of code, or use the native message queue system for development but a more robust message queue in production. Today, we support RabbitMQ with support for additional message queues like ActiveMQ coming soon. Learn more about sl-mq [here](https://www.npmjs.org/package/sl-mq).
