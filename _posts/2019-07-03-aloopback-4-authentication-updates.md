---
layout: post
title: What's New in LoopBack 4 Authentication 2.0
date: 2019-07-03
author: Dominique Emond
permalink: /strongblog/loopback-4-authentication-updates/
categories:
  - Community
  - LoopBack
published: true
---

We've refactored the authentication component to be more extensible and easier to use.

Now you can secure your endpoints with both [passport-based](http://www.passportjs.org/)  and `LoopBack native` authentication strategies that implement the interface [AuthenticationStrategy](https://loopback.io/doc/en/lb4/apidocs.authentication.authenticationstrategy.html).

The new design greatly simplifies the effort of application developers and extension developers since they now only need to focus on binding strategies to the application without having to understand/modify the strategy resolver or the action provider.

<!--more-->

The core of the authentication component is available in [@loopback/authentication](https://www.npmjs.com/package/@loopback/authentication) version `2.x`, and the passport-based capabilities are now available in [@loopback/authentication-passport](https://www.npmjs.com/package/@loopback/authentication-passport).

Here is a **high level** overview of the authentication component.

![authentication_overview_highlevel](https://loopback.io/pages/en/lb4/imgs/authentication_overview_highlevel.png)

- A decorator to express an authentication requirement on controller methods
- A provider to access method-level authentication metadata
- An action in the REST sequence to enforce authentication
- An extension point to discover all authentication strategies and handle the delegation

Detailed documentation about the design and usage of `@loopback/authentication@2.x` can be found [here](https://loopback.io/doc/en/lb4/Loopback-component-authentication.html).

As an **application developer**, you only need 3 steps to secure your endpoints:

- Decorate the endpoints of a controller with the `@authenticate(strategyName, options?)` decorator
- Insert the authentication action in a custom sequence 
- Register the authentication strategy

As an **extension developer**, you can **contribute** a `LoopBack native` authentication strategy by following the steps in [Creating a Custom Authentication Strategy](https://loopback.io/doc/en/lb4/Loopback-component-authentication.html#creating-a-custom-authentication-strategy), or a `passport-based` authentication strategy by following the steps in [Wrapping a Passport-based Strategy with the Passport Strategy Adapter](https://www.npmjs.com/package/@loopback/authentication-passport).

A tutorial and reference implementation on how to add JWT authentication to a LoopBack 4 application using `@loopback/authentication@2.x` can be found [here](https://loopback.io/doc/en/lb4/Authentication-Tutorial.html). It involves an updated version of the [example shopping cart application](https://github.com/strongloop/loopback4-example-shopping).

## Looking for User References

As you might be aware, our [loopback.io](https://loopback.io/) web site has a brand new look. We're rebuilding the `"Who's using LoopBack"` section to showcase our users and the use cases. If you would like to be a part of it, see the details in [this GitHub issue](https://github.com/strongloop/loopback-next/issues/3047).

## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Reporting issues](https://github.com/strongloop/loopback-next/issues).
- [Contributing](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md) code and documentation.
- Opening a pull request on one of our ["good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- Joining our [user group](https://github.com/strongloop/loopback-next/issues/110).
