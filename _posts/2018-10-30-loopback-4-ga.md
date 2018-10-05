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

We've come a long way since the first Developer Preview release of LoopBack 4 was out last November. LoopBack 4 continues to be the Node.js API creation framework that empowers developers to create APIs quickly and interact with backend resources. With better extensibility and flexibility, this latest version is simpler to use and easier to extend. 

We are pleased to announce that LoopBack 4 has matured into GA (general availability) and the framework is ready for production use. Some of our users have already built LoopBack 4 applications and now you can do the same too.

In addition to our new version LoopBack 4, we would like to point your attention to our other recently announced project [oasgraph](http://v4.loopback.io/oasgraph.html) which makes it very easy to add GraphQL API to your application's REST API.

<!--more-->

In this release, we focus on the following epics:
- [Real-life eCommerce Application](#real-life-ecommerce-application)
- [REST API Creation with Controllers and Decorators](#rest-api-creation-with-controllers-and-decorators)
- [Data Integration Capabilities](#data-integration-capabilities)
- [Service Integration Capabilities](#service-integration-capabilities)

Let’s take a closer look at each epic!

### Real-life eCommerce Application
We have been using scenario-driven approach to help us identify gaps when creating a close-to-real-world application.  As a start, we have created the [todo example](https://loopback.io/doc/en/lb4/todo-tutorial.html) for basic database CRUD operations.  Then [todo-list example](https://loopback.io/doc/en/lb4/todo-list-tutorial.html) and the [SOAP calculator](https://loopback.io/doc/en/lb4/soap-calculator-tutorial.html) were added to demonstrate the model relation and service integration capabitility, respectively. 

We now have an [eCommerce store application](https://github.com/strongloop/loopback4-example-shopping) with the following components:
- **user profile**, where data is stored in a database
- **shopping cart**, where the data is stored in a distributed in-memory cache, e.g. Redis
- **product recommendation**, which fetches from a SOAP/REST service
- **order history**, which ties to the user profile and also stored in a database


### REST API Creation with Controllers and Decorators
You now can create REST APIs using bottom-up and top-down approach with greater visibility. 

At the HTTP layer, we offered validation and coercion for request body and parameters. It is also applicable to object parameters with a complex OpenAPI schema, as explained in our recent [blog post](https://strongloop.com/strongblog/fundamental-validations-for-http-requests/). Check out the [documentation](https://loopback.io/doc/en/lb4/Parsing-requests.html) for more details. 

We have done some initial high-level performance benchmarking using the [Todo application](https://loopback.io/doc/en/lb4/todo-tutorial.html) with in-memory storage against LoopBack 3 and LoopBack 4. In addition, the schema validation performance has been improved by caching the pre-compiled AJV validators.


FIXME: Raymond, need your help here.
    * controllers/openapi decorators
    * validation and coercion   ——optimize the validation and routing
    * routing
    * openapi spec/json schema generation -lb4 openapi
    * API explorer user experience
    * artifact generation: lb4 controller, lb4 openapi

### Data Integration Capabilities
With the data integration capabilities, you can now access databases and key value stores with strongly typed APIs. You can continue to use the existing database connectors for connecting with databases.  We also added `Repository` implementations for KeyValue API through `KVRepository`. See the [KeyValue store documentation](https://loopback.io/doc/en/lb4/Repositories.html) and the [Shopping Cart component of our eCommerce app](https://github.com/strongloop/loopback4-example-shopping) for more details and example.

We have implemented a few command-line interfaces, namely `lb4 model`, `lb4 repository` and `lb4 datasource` to simplify and accelerate artifact generation. In addition, we have introduced base [relation support](https://loopback.io/doc/en/lb4/Relations.html): `hasMany` and `belongsTo`.


### Service Integration Capabilities
We added basic support for integrating with 3rd party services, e.g. SOAP and REST services. We also have gRPC support with the help of the communitys. To build on top of this foundation, we've improved the developer experience by adding sugar API for registering services and automated registration via boot, and introduced [`lb4 service`](https://loopback.io/doc/en/lb4/Service-generator.html) command to create a Service class for a selected datasource.
FIXME: Raymond, need help on decorators.


## LTS Policy
Now that LoopBack 4 is the current version, LoopBack 3 becomes the active LTS release and LoopBack 2 as maintancence LTS release. Aligning with [Module LTS Policy](https://developer.ibm.com/node/2018/07/24/module-lts/), here is our LTS schedule: 


Framework | Status | Published | EOL 
-- | -- | -- | -- 
LoopBack 4 | Current | Oct 2018 | Apr 2021 _(minimum)_
Loopback 3 | Active LTS | Dec 2016 | Dec 2019 
Loopback 2 | Maintenance LTS | Jul 2014 | Apr 2019 

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
