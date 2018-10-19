---
layout: post
title: Announcing LoopBack 4 GA is Now Ready for Production Use!
date: 2018-10-10
author:
  - Diana Lau
  - Raymond Feng
  - Miroslav Bajtoš
permalink: /strongblog/loopback-4-ga
categories:
  - Community
  - LoopBack
---

We are excited to announce that LoopBack 4 is GA (general availability) and ready for production use. Some of our users have already built applications with LoopBack 4 and now you can do the same too.

We've come a long way since [LoopBack 4 was announced](https://strongloop.com/strongblog/announcing-loopback-next/) in April 2017 and the November release of the [first Developer Preview release](https://strongloop.com/strongblog/loopback-4-developer-preview-release). The open source framework continues to be a leading Node.js API creation platform that empowers developers to create APIs quickly on top of existing backend resources. The LoopBack team rewrote a brand new core  from the ground up in TypeScript, providing even better extensibility and flexibility. This latest version is simpler to use and easier to extend.

In addition to LoopBack 4, we would like to point you to another one of our recently announced projects: [OASGraph](http://v4.loopback.io/oasgraph.html). You can use this tool to expose GraphQL endpoints from your application's REST APIs without coding.

<!--more-->

## What's in the First GA Version of LoopBack 4

In the first GA version of LoopBack 4, we focus on the following core features:

- [Brand new core in TypeScript and ES2017](#brand-new-core-written-in-typescript-and-es2017)
- [Bottom-up and Top-down REST API Experience Driven by OpenAPI Spec](#bottom-up-and-top-down-rest-api-experience-driven-by-openapi-spec)
- [Data Integration Capabilities](#data-integration-capabilities)
- [Service Integration Capabilities](#service-integration-capabilities)

Let’s take a closer look!

### Brand New Core Written in TypeScript and ES2017

As articulated in [Crafting LoopBack 4](https://loopback.io/doc/en/lb4/Crafting-LoopBack-4.html), the team has put great efforts to build a brand new core. We used TypeScript and ES2017 as the foundation to further grow the ecosystem and scale the project. 

- Adopting TypeScript offers strongly-typed APIs for much better code maintainability and development productivity.
- Embracing 100% Promise-based APIs and async/await greatly simplifies asynchronous programming.
- Introducing an Inversion of Control (IoC) container and asynchronous Dependency Injection (DI) to manage artifacts and their dependencies.
- Leverage TypeScript decorators for metadata and dependency declarations.

Now we have a small but extensible core for LoopBack 4. Everything else is extensions, including both the packages we ship and others from the community. These core modules can be used as Node.js libraries independent of LoopBack to build your own frameworks/platforms.  

The improved architecture positions LoopBack 4 to scale up for larger code bases, more developers, better maintainability, as well as greater extensibility and composability.

### Bottom-up and Top-down REST API Experience Driven by OpenAPI Spec

With the bottom-up approach, you can simply create REST APIs as TypeScript classes and methods, and then decorate them with OpenAPI compatible metadata. Our [command-line interfaces](https://loopback.io/doc/en/lb4/Command-line-interface.html) `lb4 model` and `lb4 controller` help you to make this artifact generation process easy. For the top-down approach, we introduced the `lb4 openapi` command which generates LoopBack 4 controllers and models that expose APIs conforming to the OpenAPI specification. [This blog post](https://strongloop.com/strongblog/loopback4-openapi-cli/) covered more in details.

At the HTTP layer, we offered validation and coercion for request body and parameters. It is also applicable to object parameters with a complex OpenAPI schema, as explained in our recent [blog post](https://strongloop.com/strongblog/fundamental-validations-for-http-requests/). Check out the [documentation](https://loopback.io/doc/en/lb4/Parsing-requests.html) for more details.

We have done some high-level performance benchmarking using the [Todo application](https://loopback.io/doc/en/lb4/todo-tutorial.html) with in-memory storage against LoopBack 3 and LoopBack 4. In addition, the schema validation performance has been improved by caching the pre-compiled AJV validators.

### Data Integration Capabilities

With the data integration capabilities, you can now access databases and key value stores with strongly typed APIs. You can continue to use the existing database connectors for connecting with databases. We also added `Repository` implementations for KeyValue API through `KVRepository`. See the [KeyValue store documentation](https://loopback.io/doc/en/lb4/Repositories.html) and the [Shopping Cart component of our eCommerce app](https://github.com/strongloop/loopback4-example-shopping) for more details and example.

We have implemented a few command-line interfaces, namely `lb4 model`, `lb4 repository` and `lb4 datasource` to simplify and accelerate artifact generation. In addition, we have introduced base [relation support](https://loopback.io/doc/en/lb4/Relations.html): `hasMany` and `belongsTo`.

### Service Integration Capabilities

We added basic support for integrating with 3rd party services, e.g. SOAP and REST services. We also have gRPC support with the help of the community. To build on top of this foundation, we've improved the developer experience by adding sugar APIs for registering services and automated registration via boot, and introduced [`lb4 service`](https://loopback.io/doc/en/lb4/Service-generator.html) command to create a Service class for a selected datasource.

## More Details From Past Preview Releases

As we announce the GA status, we remind you of past posts providing great content for each of the Developer Preview releases. To see more details of LoopBack 4 features, please check out the following blogs.

- [Developer Preview 1](https://strongloop.com/strongblog/loopback-4-developer-preview-release)
- [Developer Preview 2](https://strongloop.com/strongblog/loopback-4-developer-preview-2/)
- [Developer Preview 3](https://strongloop.com/strongblog/loopback-4-developer-preview-3)

## Scenario-Driven Approach

We have been using scenario-driven approach to help us identify gaps when creating a close-to-real-world application. As a start, we have created the [todo example](https://loopback.io/doc/en/lb4/todo-tutorial.html) for basic database CRUD operations. Then [todo-list example](https://loopback.io/doc/en/lb4/todo-list-tutorial.html) and the [SOAP calculator](https://loopback.io/doc/en/lb4/soap-calculator-tutorial.html) were added to demonstrate the model relation and service integration capabitility, respectively.

We now have an [eCommerce store application](https://github.com/strongloop/loopback4-example-shopping) with the following components:

- **user profile**, where data is stored in a database
- **shopping cart**, where the data is stored in a distributed in-memory cache, e.g. Redis
- **product recommendation**, which fetches from a SOAP/REST service
- **order history**, which ties to the user profile and also stored in a database

## LTS Policy

Now that LoopBack 4 is the current version, LoopBack 3 becomes the active LTS release and LoopBack 2 as maintancence LTS release. Aligning with [Module LTS Policy](https://developer.ibm.com/node/2018/07/24/module-lts/), here is our LTS schedule:

| Framework  | Status          | Published | EOL                  |
| ---------- | --------------- | --------- | -------------------- |
| LoopBack 4 | Current         | Oct 2018  | Apr 2021 _(minimum)_ |
| Loopback 3 | Active LTS      | Dec 2016  | Dec 2019             |
| Loopback 2 | Maintenance LTS | Jul 2014  | Apr 2019             |

Check out our [LTS policy](https://loopback.io/doc/en/contrib/Long-term-support.html).

All LoopBack 3 related packages, from [strong-remoting](https://github.com/strongloop/strong-remoting) and [loopback-boot](https://github.com/strongloop/loopback-boot) to [loopback-sdk-angular](https://github.com/strongloop/loopback-sdk-angular) are entering Active LTS mode too, see [issue #1744](https://github.com/strongloop/loopback-next/issues/1744) for the full list of affected packages. Please note that there will be no Current release line for these legacy packages and therefore no new features will be added (or accepted).

The package [loopback-datasource-juggler](https://github.com/strongloop/loopback-datasource-juggler) is used by LoopBack 4 and has the following release lines going forward:

- A newly released version line 4.x is used by LoopBack 4.0 and considered as Current.
- 3.x (used by LoopBack 3) is moving to Active LTS.
- 2.x (used by LoopBack 2) is moving to Maintenance LTS.

LoopBack 4 is fully compatible with existing connectors for LoopBack 3, there are no immediate changes in the LTS version lines of connectors maintained by our team.

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
