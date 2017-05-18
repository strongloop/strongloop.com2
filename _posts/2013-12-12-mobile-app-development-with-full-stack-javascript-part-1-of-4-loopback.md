---
id: 10625
title: Mobile App Development with Full-Stack Javascript (part 1 of 4)
date: 2013-12-12T10:30:18+00:00
author: Shubhra Kar
guid: http://strongloop.com/?p=10625
permalink: /strongblog/mobile-app-development-with-full-stack-javascript-part-1-of-4-loopback/
categories:
  - LoopBack
  - Product
---
In this four part blog series, we talk about mobile application development using JavaScript on both front end and backend as a true platform. Although this concept of full-stack JavaScript is not new, there are limited reference implementations or products that actually exist to develop mobile apps using full-stack JavaScript. In part one of this series, we start with mobile back end developed in Node.js which is a platform for running Javascript on the server. In the next parts, we will talk about the front end, tools for building, deployment, automation, monitoring and optimization.

<!--more-->

Recently there has been a lot of adoption for Node.js as a mobile backend acting as glue between front end applications (being built in native, hybrid or mobile web technologies) and the back end data sources. Here we discuss the characteristics of mobile back ends and the benefits of using JavaScript for building them.

[<img class="alignnone size-full wp-image-12030" alt="node_middleware" src="{{site.url}}/blog-assets/2013/12/Screen-Shot-2013-12-12-at-5.40.40-AM.png" width="2260" height="1092" />]({{site.url}}/blog-assets/2013/12/Screen-Shot-2013-12-12-at-5.40.40-AM.png)

## **Mobile apps aren&#8217;t useful without existing data**

In order for mobile applications to be useful as sales channels for the enterprise, access to existing corporate data is key. Without access to this back end data, mobile applications cannot cross the threshold of being relevant for an enterprise’s line of business. Today mobile backends are being either provided as a hosted service also called mBaaS (mobile Backend-as-a-Service) or being built in-house by developers.

The majority of mBaaS providers assume that you’re building your mobile app from scratch and that no legacy data exists. This means that private application’s data ends up getting locked up in the provider’s cloud. The truth is that enterprise mobile applications are being developed mostly as an extension to an existing platform rather than a brand new one. These applications might be used by employees, sales personnel, field operations (B2E) or as a new consumer sales channel (B2C). By their function, these mobile apps need access to the same enterprise data sets that traditional web apps have been using for years.

Existing data sources typically reside inside the datacenter and increasingly in a private cloud. Existing distributed systems like ERP, enterprise databases like Oracle, et cetera on contain business critical data that traditionally has only been available to legacy or web apps. To help simplify data access from mobile devices to these distributed platforms, StrongLoop [announced LoopBack](http://strongloop.com/strongblog/announcing-loopback-an-open-source-mobile-backend-as-a-service-based-on-node-js/) earlier this year. [LoopBack](http://strongloop.com/strongloop-suite/loopback/) is an open-source mobile API tier, built on top of Node.js. The diagram below shows LoopBack and how it interacts with various services and data sources.

[<img class="alignnone size-full wp-image-11102" alt="loopback_solution" src="{{site.url}}/blog-assets/2013/12/loopback_solution.jpg" width="1280" height="720" />]({{site.url}}/blog-assets/2013/12/loopback_solution.jpg)

## **LoopBack addresses the shortcomings of existing mobile backend services:**

  * Most are available only on public clouds with limited enterprise access.
  * A higher cost due to “hosted service”. Usually priced by number of APIs or users, which is expensive to scale.
  * Mobile apps need access to new data and existing data behind the firewall.
  * Most mobile back ends are built using proprietary stacks with built-in lock-in.
  * Some mobile back ends are built with Java or Ruby, where Node is the [superior choice for mobile backends](https://speakerdeck.com/tau_zero/building-a-mobile-backend-api-with-node-dot-js-better-than-expected).

In contrast, Loopback can be run on-premises or in the cloud with enterprise connectors for Oracle, MySQL, MongoDB, In-memory datastore and REST services. LoopBack’s roadmap includes connectors for Postgres, SQLServer, SOAP, ATG Dynamo, SAP, Salesforce.com and Oracle Apps among others. LoopBack allows remote-able functions, that support dynamically saving data and invoking server-side functionality from mobile clients. Hence users can perform CRUD functions on the database directly from their devices. LoopBack provides data discovery and modelling to aggregate or mashup data objects from multiple data stores. Then it’s API engine generates JSON REST API for the modelled objects. Finally LoopBack provides SDKs for [Android](http://strongloop.com/strongblog/announcing-loopback-android-sdk/) and [iOS](http://docs.strongloop.com/display/DOC/iOS+SDK) to make it easy to consume these REST API from the client application.

## **A mobile backend should do more than just surface APIs**

Just like Loopback, any mobile backend needs to satisfy following the criteria of enterprise use cases to be successful:

  * Access to legacy, current generation and evolving data sources.
  * Advanced modelling to slice & dice or aggregate data objects to fetch complex queries from backends with No SQL.
  * Easy generation of REST API services for direct/remote data access from mobile apps.
  * Easy generation of REST API services for consumption by application logic.
  * Mobile application management services like push notification, geolocation, file, etc.
  * API Security management.
  * API infrastructure management.
  * Tooling and Automation.

The above listed functions and automation hugely reduce complexity, increase speed of development and reduce Go To Market time for a mobile app. In the diagram below we expand on the essential functions that Loopback delivers. [<img class="alignnone size-full wp-image-11253" alt="mbaas_marqee" src="{{site.url}}/blog-assets/2013/12/mbaas_marqee.png" width="2212" height="956" />]({{site.url}}/blog-assets/2013/12/mbaas_marqee.png) When StrongLoop started to design an open-source mobile backend for the enterprise, time to accrue ROI from the product was primary success criteria. Loopback was designed specifically to address the use cases listed above. We ensured that the automation was present to help standup rich backend services in a matter of minutes vs days and months traditionally associated with these projects. [<img class="alignnone size-full wp-image-11098" alt="Loopback-slide-4c" src="{{site.url}}/blog-assets/2013/12/Loopback-slide-4c.jpg" width="1280" height="720" />]({{site.url}}/blog-assets/2013/12/Loopback-slide-4c.jpg) The below example code snippets show, how easy it is to connect to an existing data store and dynamically create models and RESTful API endpoints for accessing the data objects.

## Create a project and a product

[<img class="alignnone size-full wp-image-12040" alt="code1" src="{{site.url}}/blog-assets/2013/12/cod1.png" width="400" height="60" />]({{site.url}}/blog-assets/2013/12/cod1.png)

## Model the product

[<img class="alignnone size-full wp-image-12041" alt="code2" src="{{site.url}}/blog-assets/2013/12/code2.png" width="400" height="540" />]({{site.url}}/blog-assets/2013/12/code2.png)

## Create a data source

[<img class="alignnone size-full wp-image-12043" alt="code4" src="{{site.url}}/blog-assets/2013/12/code4.png" width="400" height="260" />]({{site.url}}/blog-assets/2013/12/code4.png)

## Generate REST APIs automatically

[<img class="alignnone size-full wp-image-12039" alt="explorer-endpoint" src="{{site.url}}/blog-assets/2013/12/explorer-endpoint.png" width="1065" height="525" />]({{site.url}}/blog-assets/2013/12/explorer-endpoint.png)

## Push notification to iOS device

[<img class="alignnone size-full wp-image-12044" alt="code5" src="{{site.url}}/blog-assets/2013/12/code5.png" width="400" height="50" />]({{site.url}}/blog-assets/2013/12/code5.png)

## **Node.js is the platform of choice for mobile backend**

User experience on mobile devices is key to customer stickiness. In the early days of the web, response times of 2-3 seconds were acceptable when users submitted a form and patiently waited for the response page to load. Smart web designers often cached content on CDNs and client-side to render static elements faster and render visualization preemptively to logic. On mobile, CDN technology and caching is not mature. Users access app components and expect instantaneous data. To achieve this, small snippets of data are fetched based on user events usually using API calls. These snippets must have a very light payload and must render content in milliseconds. Following are key design criteria for mobile backends.

  * Low latency.
  * High concurrency.
  * Streaming data.
  * Evented models rather than request/response model.
  * Caching and sync.
  * Seamless technology integration.

Top use cases where Node.js has been very popular are JSON API and single page apps. Both of these enable mobile/mobile-web applications to gain parity and sometimes a competitive advantage over legacy web applications. Node supports the workloads of a mobile backend: small and frequent structured data exchanges. Hence, it is ideal candidate for I/O bound applications that involve exchanges of information rather than computational processes, which are CPU bound.

## **Node advantages**

Node.js is a scalable, event-driven I/O environment built on top of Google Chrome’s JavaScript runtime, a server-side implementation of JavaScript. Google V8 compiles JavaScript into native machine code prior to execution, resulting in extremely fast runtime performance—something not typically associated with JavaScript. As such, Node enables you to rapidly build network apps that are lightning fast and highly concurrent. Because it uses JavaScript, frontend developers can work in the same language as backend developers. This concept is referred to as JavaScript Everywhere and reduces time spent in mastering varied development concepts. Furthermore, the most used data exchange format, JSON, can be natively parsed by both ends. Processing overhead can be reduced through simplification of serialization. Additionally Node&#8217;s lightweight runtime enables rapid development and deployment. As a result, Node is a powerful solution for agile development. Node differs from most web-app runtimes in the manner that it handles concurrency. Instead of using threading to accomplish concurrency, Node relies on an event-driven loop running in a single process. Node promotes an asynchronous (non-blocking) model, while technologies such as Java support a synchronous (blocking) model. [<img class="alignnone size-full wp-image-11082" alt="threading_java" src="{{site.url}}/blog-assets/2013/12/threading_java.png" width="800" height="444" />]({{site.url}}/blog-assets/2013/12/threading_java.png) [<img class="alignnone size-full wp-image-11081" alt="threading_node" src="{{site.url}}/blog-assets/2013/12/threading_node.png" width="800" height="444" />]({{site.url}}/blog-assets/2013/12/threading_node.png) Java suffers additional overhead in context switching between threads. More threads means more time spent switching contexts and less time doing work on incoming requests making scalability of Java applications more expensive. Node supports asynchronous I/O, based on events such as the completion of a file read operation or a database query. These events are handled with callback functions, which enable the application to proceed while I/O is being performed. The event loop handles these events. Below is an infographic from an IBM benchmarking exercise for API endpoints for Node.js vs traditional java in terms of scalability as user concurrency grows. [<img class="alignnone size-full wp-image-11100" alt="perf" src="{{site.url}}/blog-assets/2013/12/perf.png" width="1280" height="720" />]({{site.url}}/blog-assets/2013/12/perf.png)

## **Wrapping up**

We hope this blog provided insights into mobile back ends and general back end development using Node.js. We also covered why Node has become the platform of choice and hugely popular as a glue for mobile to the backend. In the part 2, we will talk about the front end development using technologies like Angular.js, Bootstrap.js, Cordova/PhoneGap, Backbone.js, etc and how they can be integrated seamlessly with a node back end.

## **What’s next?**

  * Find out more about [LoopBack](http://loopback.io/).
