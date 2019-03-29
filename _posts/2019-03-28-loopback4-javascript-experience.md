---
layout: post
title: Experimenting with Plain JavaScript Programming in LoopBack 4
date: 2019-03-28
author: Hage Yaapa
permalink: /strongblog/loopback4-javascript-experience/
categories:
  - LoopBack
  - JavaScript Language
published: true
---

LoopBack is a popular open source Node.js framework. Its latest version (4) is written in TypeScript, while the older version were written in JavaScript. We chose to write LoopBack 4 to make it [more extensible, scalable, and sustainable](https://loopback.io/doc/en/lb4/FAQ.html#why-typescript). TypeScript features made it easy for us to build dependency injection in the framework and leverage it for controllers, models, and other constructs using TypeScript decorators.

We believe that TypeScript is the right move and it will help you and us in the long run. However, some developers are constrained to use plain JavaScript at the moment for various reasons. We didn't want to leave our JavaScript users behind and decided to explore the possibilities of creating a JavaScript interface to LoopBack 4. This blog post is about what we did in that regard and what we will be doing next.

<!--more-->

We worked on a spike to enable [LoopBack 4 development using JavaScript](https://github.com/strongloop/loopback-next/issues/1978). You can take a look at a [proof of concept](https://github.com/strongloop/loopback4-example-javascript/tree/class-factory/server) LoopBack 4 app which uses the JavaScript API we have experimented with.

## Our Findings

A typical LoopBack 4 app is composed of several elements: 

- A controller to define the endpoints.
- A sequence to customize and contain the request-response process.
- Models for defining the data.
- A datasource to connect to database.
- A repository to link the model to the datasource.
- The application class which brings all of these together.

The application also supports the ability to create custom routes to define non-REST enpoints.

The proof of concept listed above demonstrates how writing LoopBack 4 applications in JavaScript would enable all the above features.

**What was Achieved**

1. Ability to create [application class](https://github.com/strongloop/loopback4-example-javascript/blob/class-factory/server/application.js) in JavaScript.

2. Ability to create [route](https://github.com/strongloop/loopback4-example-javascript/blob/class-factory/server/application.js#L15) in JavaScript.

3. Ability to create [custom sequence](https://github.com/strongloop/loopback4-example-javascript/blob/class-factory/server/sequence.js) in JavaScript.

4. Ability to create [CRUD controller](https://github.com/strongloop/loopback4-example-javascript/blob/class-factory/server/controllers/color.controller.js) in JavaScript.

5. Ability to create [custom controller](https://github.com/strongloop/loopback4-example-javascript/blob/class-factory/server/controllers/ping.controller.js) in JavaScript.

6. Ability to create [datasource](https://github.com/strongloop/loopback4-example-javascript/blob/class-factory/server/datasources/memory.datasource.js) in JavaScript.

7. Ability to create [model](https://github.com/strongloop/loopback4-example-javascript/blob/class-factory/server/models/color.model.js) in JavaScript.

8. Ability to create [repository](https://github.com/strongloop/loopback4-example-javascript/blob/class-factory/server/repositories/color.repository.js) in JavaScript.

Although it allows the creation of some simple apps, it is pretty limited and inflexible in what it can do.

**Limitations**

1. The class factory pattern is not idiomatic ES6. Ideally, we should be able to use classes like in TypeScript. Making this possible is not easy, since we have to come up with a good interface and developer experience for dependency injection. This will be possible when [decorators for ES6 classes](https://github.com/tc39/proposal-decorators) becomes a JavaScript feature.

2. Routes are limited to simple responses and has no access to the LoopBack request object, which contains a lot of additional information.

3. Controller methods are hard-coded in the helper library and leave no room for customization.

4. Models are defined using a JSON files, instead of JavaScript classes.

The TypeScript LoopBack 4 API has a very neat and intuitve developer experience when it comes to customization and extension because of the in-built dependecny injection capability. Replicating this capability in JavaScript is the biggest hurdle in creating the JavaScript API for LoopBack 4.

We realized that creating a parallel LoopBack 4 JavaScript framework would be lot of work in terms of development and maintenace. A better approach to providing a JavaScript API for LoopBack 4 would be to identify most practical use cases and then try to come up with appropriate solutions.

## Next Steps

To help decide our approach to creating the usecase-specific JavaScript LoopBack 4 API, instead of porting the whole framework to JavaScript, we identified [several personas](https://github.com/strongloop/loopback-next/issues/2567) and went through each of them and considered their use cases.

The personas we identified are:

1. Large scale application developer. Since large scale application are best developed with TypeScript, we concluded that this persona should be using the TypeScript version of LoopBack 4.

2. Extension developer. This persona wants to extend the capabilities of LoopBack 4 by writing custom extensions. Being technical enough, this persona should also be comfortable using TypeScript.

3. API developer. This persona is understands the importance of OpenAPI support and the ORM capabilities provided by LoopBack 4, has only a few endpoints to expose, and prefers a simpler JavaScript API to interact with, instead of having to create controllers and classes.

4. Plain Express developer. This persona primarily uses Express for application development, and is interested in using the features provided by LoopBack 4, using JavaScript.

We combined personas 3 and 4 to a single one - a developer who likes the simplicity of JavaScript and wants to use LoopBack 4 APIs in Express-style routes.

So instead of porting the TypeScript LoopBack 4 to JavaScript, we have decided to cater to this specific usecase. Developers will be able to setup and customize their routes using [OpenAPI specifications](https://swagger.io/specification/) and will have access to the LoopBack 4 request object. Apart from providing access to other metadata added by LoopBack 4, such as authentication details, this object is the link to the LoopBack 4 internals. Via this object, developers can access  repositories, datasources, models, and context.

We have started work on porting the [Todo example](https://github.com/strongloop/loopback-next/issues/2501) to JavaScript. This port will show how to create LoopBack 4 [routes](https://github.com/strongloop/loopback-next/issues/2474) and [datasources](https://github.com/strongloop/loopback-next/issues/2557) in JavaScript.

We would like to hear from you what you think of JavaScript experience in LoopBack 4. Is it required? What are your expectations?

## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Reporting issues](https://github.com/strongloop/loopback-next/issues).
- [Contributing](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md)
  code and documentation.
- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Joining](https://github.com/strongloop/loopback-next/issues/110) our user group.

