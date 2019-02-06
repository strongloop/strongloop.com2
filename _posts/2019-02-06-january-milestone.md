---
layout: post
title: LoopBack 4 January 2019 Milestone Update
date: 2019-02-06
author: Biniam Admikew
permalink: /strongblog/january-2019-milestone/
categories:
  - Community
  - LoopBack
---

We're one month into the new year! While the team had some time off extending into January, we still managed to work and spike on authentication, migration from LB3, user adoption, extensibility, and documentation. Read more to find out how it all unfolded.

<!--more-->

## Authentication Epic

Last month we implemented the strategy resolver, JWT strategy class and authentication action and created the diagram that depicts their dependency relations. Based on those efforts, in January we enriched the `loopback4-example-shopping` repository with a working JWT authentication system, and added two endpoints for model `User` to make use of it:

* `POST /Users/login` verify a user's credentials and return a valid JWT access token
* `GET /Users/me` display the logged in user of the application

The following picture describes how the authentication mechanism works:

<img src="https://strongloop.com/blog-assets/2019/01/auth-endpoints.png" alt="authentication endpoints in the example" style="width: 800px"/>

This month our discussion focused on dividing the responsibilities among controller, repository and services/utilities. 

The login related logic should be extracted into a service which could be shared among different clients, like REST, gRPC and WebSocket. Those logic include taking in credentials, verifying users, generating and decoding access token. The login service receives User's repository via DI. As the first implementation, we simply keep them as utils. They will be refactored into service in story [Refactor authentication util functions into a service](https://github.com/strongloop/loopback4-example-shopping/issues/40)

The controller function should extract credentials like email, username and password from the request. And calls the service to perform login. The service is injected via DI. 

We also discovered there are three extension points that are needed in order to make LoopBack's authentication system more flexible. We need extension points such as:

- plugin Passport based strategies leveraging the existing auth action in [`@loopback/authentication`](https://github.com/strongloop/loopback-next/blob/master/packages/authentication/src/providers/authentication.provider.ts).
- plugin non-passport based strategies like the JWT strategy created by us.
- a more flexible user profile type that allow people return custom properties.

PR https://github.com/strongloop/loopback-next/pull/2249 illustrates extension point/extension pattern is in progress. It provides a standard to make extension point that the 3 above stories could follow.

A more detailed tutorial will be created after finishing the story [Refactor authentication util functions into a service](https://github.com/strongloop/loopback4-example-shopping/issues/40).

## User Adoption

In order to cater to users developing LoopBack applications with JavaScript, [Yaapa](https://strongloop.com/authors/Hage_Yaapa/) conducted a spike on how to get a LoopBack 4 JavaScript application up and running in [#1978](https://github.com/strongloop/loopback-next/issues/1978).

You can checkout the [hack](https://github.com/strongloop/loopback4-example-javascript/tree/hack) branch of `loopback4-example-javascript` and preview the progress and the possible JavaScript API for LoopBack 4. It is a working example, feel free to experiment.

Also, in [PR #795](https://github.com/strongloop/loopback.io/pull/795), [Nora](https://github.com/nabdelgadir) improved the UX for users on `loopback.io` by setting up redirects for the current LoopBack 4 website and LoopBack 3 in Active LTS, akin to how Node.js has the split for the different version downloads in their main landing page.

## Extensibility

We continue to refine our extensibility story as we build more extensions.

- [2289](https://github.com/strongloop/loopback-next/pull/2289)
  - Introduced `BindingFilter` to match multiple bindings using a function.
  - Refactored code to use it for Context APIs such as `find` and `findByTag`.
  - Exposed `filterByKey` and `filterByTag` utility functions.

To make it easy to implement the extension point/extension pattern, we're building up new features for `@loopback/context`. There are number of PRs under review.

- [PR#2291](https://github.com/strongloop/loopback-next/pull/2291)
  - Add support for `context` to emit `bind` and `unbind` events
  - Allow observers to register with the context chain and respond to come and go of bindings of interest

- [PR#2122](https://github.com/strongloop/loopback-next/pull/2122) (depends on #2291)
  - Introduce `ContextView` to dynamically resolve values of matching bindings
  - Introduce `@inject.view` to support dependency injection of multiple bound values
  - Extend `@inject` and `@inject.getter` to support multiple bound values

- [PR#2249](https://github.com/strongloop/loopback-next/pull/2249)
  - Add an example package to illustrate how to implement extension point/extension pattern using LoopBack 4's IoC and DI container

- [PR#2259](https://github.com/strongloop/loopback-next/pull/2259)
  - Propose new APIs for `Context` to configure bindings
  - Add `@inject.config` to simplify injection of configuration

You are welcome to join our discussions in these pull requests. Please be aware that such PRs can be changed or abandoned during the review process.

## Documentation updates

We're always striving to have better documentation for our users. In [PR#2214](https://github.com/strongloop/loopback-next/pull/2214), [Nora](https://github.com/nabdelgadir) added much needed descriptions to our [relation decorators](https://loopback.io/doc/en/lb4/Decorators_repository.html#relation-decorators) page with clear examples on how they are applied. Moreover, [Dominique](https://github.com/emonddr) wrote an excellent guide on how to publish a LoopBack 4 application to Kubernetes on IBM Cloud in [PR#2160](https://github.com/strongloop/loopback-next/pull/2160). Check it out [here](https://loopback.io/doc/en/lb4/deploying_to_ibm_cloud_kubernetes.html).

## LoopBack v3 compatibility layer

In January, Miroslav implemented a proof of concept showing a compatibility layer that would allow application developers to take their model files (`.json` and `.js`) from an existing LB3 project and drop them mostly as-is to a LB4 application.

The idea is to simplify the migration path from LB3 to LB4 by allowing developers to update their existing applications from LB3 to LB4 runtime (and dependencies) without having to rework their source code to the new programming model yet.

With the proposed compatibility layer, LB3 models are "upgraded" to use:
 - `loopback-datasource-juggler` version 4.x (instead of 3.x)
 - `@loopback/rest` for REST APIs (instead of `strong-remoting`)
 - OpenAPI v3 (instead of Swagger a.k.a. OpenAPI v2)
 - `@loopback/rest-explorer` for API Explorer (instead of `loopback-component-explorer`)

The migrated models will run fully on LB4 runtime and thus enjoy longer LTS.

If you have an LB3 application and considering upgrading to LB4, then please join the discussion in [PR#2274](https://github.com/strongloop/loopback-next/pull/2274). Your feedback is very important to us!

While waiting for more feedback from our users, Miroslav reviewed early input and started to look into ways to mount an entire LB3 application inside an LB4 project. While such solution still depends on LB3 runtime that will eventually go out of support, it will provide almost 100% backwards compatibility and require very little code changes. Let us know if this option would be useful for your project and leave a comment in [PR#2318]strongloop/loopback-next#2318).

## Community Engagement Events

### Toronto LoopBack Meetup

The LoopBack team hosted a meetup in downtown Toronto on February 5th, 2019. We taught users all about LoopBack 4 and demonstrated the capabilities and integrations of the framework. We worked hard to prepare presentations and demos for the meetup during this month. If you are in the Toronto area and are interested in future meetups, check out the [Toronto Cloud Integration Meetup Group](https://www.meetup.com/Toronto-Cloud-Integration-Meetup/) and make sure to sign up!

February is an event-filled month. Besides the meetup in Toronto, there will be LoopBack coverage at [Code @ Think](https://www.ibm.com/events/think/code/) in Node.js Master Class and as one of the Quick Labs. [Raymond](https://strongloop.com/authors/Raymond_Feng/) will be presenting at DeveloperWeek on Feb 21 on the topic -- [Speed and Scale: Building APIs with Node.js, TypeScript and LoopBack](https://sched.co/JXDc). 

Twitter is a great way to stay in the loop with StrongLoop and LoopBack news. The best way to learn about events we are part of is generally https://strongloop.com/events/.

## Welcome New Core Maintainer

We'd like to introduce our new LoopBack development team member [Dominique](https://github.com/emonddr) at our Markham lab. Dominique brings lots of experience and knowledge from working in Message Broker and App Connect development team in the past. He has already given us a step-by-step tutorial on how to deploy a LoopBack 4 application to Kubernetes in IBM Cloud [here](https://loopback.io/doc/en/lb4/deploying_to_ibm_cloud_kubernetes.html). Welcome, Dominique!

## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Reporting issues](https://github.com/strongloop/loopback-next/issues).
- [Contributing](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md)
  code and documentation.
- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Joining](https://github.com/strongloop/loopback-next/issues/110) our user group.
