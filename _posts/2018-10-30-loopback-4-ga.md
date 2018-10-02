---
layout: post
title: LoopBack 4 GA is now available!
date: 2018-10-30T00:00:01+00:00
author: 
  - Diana Lau
  - Raymond Feng
  - Miroslav Bajtos
permalink: /strongblog/loopback-4-ga
categories:
  - Community
  - LoopBack
---

We've come a long way since the first Developer Preview release of LoopBack 4 was out last November. We are pleased to announce the GA release of LoopBack is now available! As some of our users have done it already, you can now build a LoopBack 4 application that is ready for production. Users can now also [expose GraphQL APIs](http://v4.loopback.io/oasgraph.html) as well as REST APIs in the same LoopBack application.

In this release, We focus on the following epics:
- Model Relations
- Integration with REST / SOAP services
- Validation and Coercion
- Deployment to IBM Cloud
- Performance Benchmarking and Enhancement
- KeyValue Repository

Let’s take a closer look at each epic!

<!--more-->

### Real-life eCommerce Application
In this release, we have created an [eCommerce application](https://github.com/strongloop/loopback4-example-shopping) to help us identify gaps when creating a real-world application. So far, the eCommerce store application contains the following components:
- **user profile**, where data is stored in a database
- **shopping cart**, where the data is stored in a distributed in-memory cache, e.g. Redis
- **product recommendation**, which fetches from a SOAP/REST service connected to AI
- **order history**, which ties to the user profile and also stored in a database

### Model Relations
To add on the existing relation `hasMany`, we have added `belongsTo` in this release. Using the eCommerce application as the example, a `User` can have many `Orders`, whereas an `Order` belongs to a `User`. For more details, see [relation docs](fixme).

### Integration with REST / SOAP services
Previously, we added basic support for integrating with 3rd party services, e.g. SOAP and REST services. In this release, we've built on top of this foundation to improve developer experience. It includes adding sugar API for registering services and automated registration via boot. We also introduced [`lb4 service`](https://loopback.io/doc/en/lb4/Service-generator.html) command to create a Service class for a selected datasource.

### Validation and Coercion
At the HTTP layer, we offered validation and coercion for request body and parameters. It is also applicable to object parameters with a complete OpenAPI schema, as explained in our recent [blog post](https://strongloop.com/strongblog/fundamental-validations-for-http-requests/).

Check out the [documentation](https://loopback.io/doc/en/lb4/Parsing-requests.html) for more details. 

### Deployment to IBM Cloud
As many real-world applications are running on the cloud, we have also added a deployment guide to show you how to [deploy a LoopBack application to IBM Cloud](https://loopback.io/doc/en/lb4/Deploying-to-IBM-Cloud.html).

### Performance Benchmarking and Enhancement
We have done some initial high-level performance benchmarking using the [Todo application](https://loopback.io/doc/en/lb4/todo-tutorial.html) with in-memory storage against LoopBack 3 and LoopBack 4. In addition, the schema validation performance has been improved by caching the pre-compiled AJV validators.

### KeyValue Repository
Key-value store is another common data storage paradigm. Therefore, in this release, we add `Repository` implementations for KeyValue API through `KVRepository`. See the [KeyValue store documentation](https://loopback.io/doc/en/lb4/Repositories.html) and the [Shopping Cart component of our eCommerce app](https://github.com/strongloop/loopback4-example-shopping) for more details and example. 


## LTS Policy
Now that LoopBack 4 is the current version, LoopBack 3 becomes the active LTS release and LoopBack 2 as maintancence LTS release. Aligning with [Module LTS Policy](https://developer.ibm.com/node/2018/07/24/module-lts/), here is our LTS schedule: 


Framework | Status | Published | EOL 
-- | -- | -- | -- 
LoopBack 4 | Current | Oct 2018 | Apr 2021<br/>_(minimum)_
Loopback 3 | Active LTS | Dec 2016 | Dec 2019 
Loopback 2 | Maintenance LTS | Jul 2014 | Apr 2019 

Check out our [LTS policy](https://loopback.io/doc/en/contrib/Long-term-support.html).


## What's Next?

Going forward, we'll maintain our keen focus on helping our early adopters to use the framework and to encourage contributions from the community. If you find anything we need to enhance or fix, don't shy away from letting us know through [opening GitHub issues](https://github.com/strongloop/loopback-next/issues). Better yet, submit a pull request and we will help when necessary. 

In addition, we will continue to use the scenario-driven approach to drive the requirements through the [e-commerce LoopBack application](https://github.com/strongloop/loopback4-example-shopping). Stay tuned for our progress in our monthly milestone blog posts.

## Call for Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
- [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
- [Reporting issues](https://github.com/strongloop/loopback-next/issues)
- [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
- [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)
