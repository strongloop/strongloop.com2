---
layout: post
title: LoopBack 4 March 2019 Milestone Update
date: 2019-04-05
author: Janny Hou
permalink: /strongblog/march-2019-milestone/
categories:
  - Community
  - LoopBack
published: true
---

In March we have a pretty outstanding amount of code contribution: 63 PRs merged in total, and 10 out of them are from the community. Cheers! The team has been able to make good progress of the epics we are focusing on, like LB3 to LB4 migration, adding `@loopback/context` features, JavaScript experience, the authentication system, and describing model properties more flexible. Read more to see the details of our achievements in March.

<!--more-->

## Migration from LoopBack 3 to LoopBack 4

We started to incrementally work on the migration stories created from the PoC [PR](https://github.com/strongloop/loopback-next/pull/2318). This month we implemented the express router to allow LB4 app developers to add arbitrary set of Express routes and provide OpenAPI specifications. You could call `mountExpressRouter` on either app level or rest server level to mount external routes. For details please check the [router's documentation](https://loopback.io/doc/en/lb4/Routes.html#mounting-an-express-router).

## Extension pattern example

As a framework built on top of the IoC and DI, the [extension point](https://wiki.eclipse.org/FAQ_What_are_extensions_and_extension_points%3F) is commonly used in LoopBack 4 to declare contracts for extension contributors to plug-in components. The existing usages of extension point include the request body parser and the boot strapper. It is also needed for supporting multiple authentication strategies. You could check the [greeter extension point](https://github.com/strongloop/loopback-next/tree/master/examples/greeter-extension) to learn the best practice of registering an extension point along with its extensions. 

## Context improvement

The discussion and review of a series of context enhancement PRs keeps moving. This month we landed the PR that implemented the context view feature. A context view is created to track artifacts and is able to watch the come and go bindings. More details could be found in the [Context document](https://loopback.io/doc/en/lb4/Context.html#context-view)

## Relations

We solved the self relation issue and created corresponding test cases as the reference usage. You can check [this PR](https://github.com/strongloop/loopback-next/pull/2595) to learn how to create a `hasMany` and `belongsTo` relation to the same entity.

## Partial update

@bajtos Since you mentioned writing a summary in the comment https://github.com/strongloop/loopback-next/issues/2082#issuecomment-477604817, I leave this entry for you to fill in.

## Authentication and Authorization

Before writing the extension point for plugging in different authentication strategies, we decided to do some investigation of the popular authentication mechanisms and adopted the user scenario driven development. This is to make sure the abstractions for services are common enough. The design documents for our authentication system could be found [here](https://github.com/strongloop/loopback-next/blob/master/packages/authentication/docs/authentication-system.md). The document begins with illustrating a LoopBack 4 application that supports multiple authentication approaches and finally divides the responsibilities among different artifacts. The abstractions we created in March are two interfaces for the user service and the token service in `@loopback/authentication`.

## Inclusion

The initial inclusion spike left us a question: how to distinguish the navigational property from the normal model properties? This month we had a PoC to demonstrate describing the navigational model properties with a new interface along with how to generate the corresponding OpenAPI schema. You could check this [PR](https://github.com/strongloop/loopback-next/pull/2592) to see all the discussions. And the [follow-up stories](https://github.com/strongloop/loopback-next/issues/2152#issuecomment-475575548) are created as our next target.

## Blog

After a thorough exploration and discussion of writing the LoopBack 4 application in Javascript, this month we summarized our findings and achievements in blog [loopback4-javascript-experience](link_to_be_done). It talks about the LoopBack 4 artifacts that we are able to create in JavaScript and also the limitations. A plan of subsequent stories is included in the blog.

## Documents

We added the steps to call SOAP services by running `lb4 service`, see the [document for calling other APIs](https://loopback.io/doc/en/lb4/Calling-other-APIs-and-web-services.html). There have been several conference and meet-up events happened over the last year, a new section [Presentations] is added in the [resources page](https://v4.loopback.io/resources.html) to display the videos.

## LoopBack 3

Now we allow people to define a model property called `type` instead of having `type` as a preserved word.

## Other Updates

TBD

## Community Contributions

TBD

## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Reporting issues](https://github.com/strongloop/loopback-next/issues).
- [Contributing](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md)
  code and documentation.
- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Joining](https://github.com/strongloop/loopback-next/issues/110) our user group.
