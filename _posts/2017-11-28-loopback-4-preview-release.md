---
layout: post
title: LoopBack 4 Developer Preview Release
date: 2017-11-28T01:40:15+00:00
author: Raymond Feng
permalink: /strongblog/loopback-4-developer-preview-release
categories:
  - LoopBack
  - Community
---

Back in April, we [kicked off](https://strongloop.com/strongblog/announcing-loopback-next/) LoopBack 4 as the next major advance of the popular Node.js based open source API framework. The team has been working on the new code base since then. Today I'm super excited to announce that the first Developer Preview release of LoopBack 4 is ready for you to test drive.

## What's new in the release?

1. A brand new LoopBack core written in [TypeScript](https://www.typescriptlang.org/) with great extensibility and flexibility.
  * Leveraging latest and greatest language features such as classes, optional typing, and decorators to boost development productivity and code quality.
  * Providing 100% Promise based APIs and full support of [Async/Await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) to simplify asynchronous programming.
  * Implementing an [Inversion of Control (IoC) container](http://loopback.io/doc/en/lb4/Context.html) and [Dependency Injection](http://loopback.io/doc/en/lb4/Dependency-injection.html) to manage artifacts and resolve dependencies.
  * Introducing components as the packaging model to bundle artifacts and extensions into modules for even better modularity and pluggability.
<!--more-->

2. An OpenAPI spec driven REST API creation experience.
  * [OpenAPI spec 2.0 and above](https://github.com/OAI/OpenAPI-Specification) for defining REST APIs.
  * [Controllers](http://loopback.io/doc/en/lb4/Controllers.html) for handling API requests/responses.
  * [Decorators](http://loopback.io/doc/en/lb4/Decorators.html) for REST endpoint mapping.
  * The REST capability is implemented in [its own module](https://github.com/strongloop/loopback-next/tree/master/packages/rest) as a component.

3. Experimental support for persistence.
  * [Repositories](http://loopback.io/doc/en/lb4/Repositories.html) as new interfaces for interacting with data stores.
  * A reference implementation using LoopBack 3.x juggler and connectors.
  * Divide the responsibility of LoopBack 3.x models into controllers, data models, repositories.  

4. Basic authentication support.
  * The [module](https://github.com/strongloop/loopback-next/tree/master/packages/authentication) serves as a role model to validate the extensibility story of LoopBack 4 and showcase how to build extensions as a component.
  * A `@authenticate` decorator for application developers to express authentication requirements.
  * An action to be invoked for REST API sequence to perform authentication.
  * A way to plug in different strategies.

5. Documentation.
  * The documentation for LoopBack 4 is available [here](http://loopback.io/doc/en/lb4/).
  * To get started, follow instructions at [here](http://loopback.io/doc/en/lb4/Getting-started.html).
  * To understand key concepts, check out [this](http://loopback.io/doc/en/lb4/Concepts.html).
  * To follow best practices, read [Thinking in LoopBack 4](http://loopback.io/doc/en/lb4/Thinking-in-LoopBack.html).

## Who is this for?

The Developer Preview release targets:

### Extension developers (those who are interested in contributing new features to LoopBack)

The release makes the new foundation available for extension developers to create new extensions for LoopBack 4. Here are a few steps to get you started.

1. Play with example extensions:
    * [A simple log extension](https://github.com/strongloop/loopback4-example-log-extension).
    * [@loopback/authentication](https://github.com/strongloop/loopback-next/tree/master/packages/authentication).

2. Check out [Extending LoopBack 4](http://loopback.io/doc/en/lb4/Extending-LoopBack-4.html) and [Crafting LoopBack 4](http://loopback.io/doc/en/lb4/Crafting-LoopBack-4.html).

3. Read the [wish list of extensions](https://github.com/strongloop/loopback-next/issues/512) to find inspiration.

4. Join the community efforts for some of the interesting extensions, such as:

* gRPC Extension
  * [Issue](https://github.com/strongloop/loopback-next/issues/675)
  * [Repository](https://github.com/strongloop/loopback4-extension-grpc)

* GraphQL extension
  * [Issue](https://github.com/strongloop/loopback-next/issues/656)
  * [Repository](https://github.com/strongloop/loopback4-extension-graphql) 

5. Create your own by scaffolding an extension project.

```
npm i -g @loopback/cli
lb4 extension <extension-name>
```

### API application developers (those who are interested in using LoopBack to create APIs).

The Developer Preview releases implements basic REST API creation capabilities with preliminary database persistence. To try out the new ways of building APIs, you can follow the steps below:

1. Play with sample applications.

* [A hello world application](https://github.com/strongloop/loopback4-example-hello-world).
* [An intermediate getting started application](https://github.com/strongloop/loopback4-example-getting-started).

2. Follow instructions at [Installation](http://loopback.io/doc/en/lb4/Installation.html) and [Getting Started](http://loopback.io/doc/en/lb4/Getting-started.html).

3. Understand the [key concepts](http://loopback.io/doc/en/lb4/Concepts.html) as building blocks for LoopBack 4 applications.

4. [Use Components](http://loopback.io/doc/en/lb4/Using-components.html).

5. Create your own by scaffolding an application project.

```
npm i -g @loopback/cli
lb4 app <app-name>
```

## What's different from LoopBack 3.x

If you are an existing user of LoopBack 3.x, you might wonder what's different between 3.x and 4. Some of the questions are answered by http://loopback.io/doc/en/lb4/LoopBack-3.x.html.

## What's next?

The Developer Preview release is just the first milestone of our LoopBack 4 journey. A tentative plan is outlined at [https://github.com/strongloop/loopback-next/wiki/Upcoming-Releases](https://github.com/strongloop/loopback-next/wiki/Upcoming-Releases). Please note that it is not an official commitment and subject to adjustment as we make progress with the community contributions and feedbacks.

## Call for action

LoopBack's future success counts on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

* [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
* [Reporting issues](https://github.com/strongloop/loopback-next/issues)
* [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
* [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)
