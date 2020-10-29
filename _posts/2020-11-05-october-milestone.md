---
layout: post
title: LoopBack 4 October 2020 Milestone Update
date: 2020-11-05
author: Janny Hou
permalink: /strongblog/october-2020-milestone/
categories:
  - Community
  - LoopBack
published: false
---

In October, we were excited to see an increasing number of community contributions as people joined the [Hacktoberfest](https://strongloop.com/strongblog/2020-hacktoberfest/) event. This month we had pretty balanced improvements in each area of the framework, including context, health check, OpenAPI specification and documentations. Keep reading to learn about the recently added features!

<!--more-->

We welcomed [@mrmodise](https://github.com/mrmodise) as the maintainer of [`loopback4-shopping-example`](https://github.com/strongloop/loopback4-example-shopping). And we'd like to thank everyone [@nflaig](https://github.com/nflaig), [@MattiaPrimavera](https://github.com/MattiaPrimavera), [@mdbetancourt](https://github.com/mdbetancourt), [@mrmodise](https://github.com/mrmodise), [@frbuceta](https://github.com/frbuceta), [@HrithikMittal](https://github.com/HrithikMittal), [@simlt](https://github.com/simlt), [@hectorleiva](https://github.com/hectorleiva), [@pktippa](https://github.com/pktippa), [@VergilSkye](https://github.com/VergilSkye), [@kerolloz](https://github.com/kerolloz), [@arondn2](https://github.com/arondn2), [@mayank-SFIN571](https://github.com/mayank-SFIN571) for your contributions in October!

Here are the highlighted improvements:

## Context

- A set of fine-grained scopes `APPLICATION`, `SERVER` and `REQUEST` has been introduced to allow better
scoping of binding resolutions. The limitation of the previous scopes is explained in section [choose the right scope](https://loopback.io/doc/en/lb4/Binding.html#choose-the-right-scope), and section [resolve a binding value by key and scope within a context hierarchy](https://loopback.io/doc/en/lb4/Binding.html#resolve-a-binding-value-by-key-and-scope-within-a-context-hierarchy) explains how different scopes determine the binding resolutions.

## REST

- Allowed array query parameter for a single value, like `{tags: 'hello'}` where parameter `tags` is a string array. See PR [#6542](https://github.com/strongloop/loopback-next/pull/6542).

- Supported property level configuration for hidden fields, like `@property({type: 'string', hidden: true}) password: string`. This is the shortcut for specifying the hidden properties in model settings. See PR [#6484](https://github.com/strongloop/loopback-next/pull/6484).

- `save()` method throwing error due to missing `idName` is fixed in PR [#6640](https://github.com/strongloop/loopback-next/pull/6640).

- `modifySpec()` turns to an async function to allow async spec updates. See PR [#6655](https://github.com/strongloop/loopback-next/pull/6655).

## Build

- A force clean rebuild was added to the pre-start script for the LoopBack 4 examples. You can run `npm start` after removing artifacts without manually cleaning the `/dist` files. See PR [#6588](https://github.com/strongloop/loopback-next/pull/6588).

- Turned on `exit` for mocha tests for the created LoopBack applications. See PR [#6475](https://github.com/strongloop/loopback-next/pull/6475).

## Extensions

- Module [@loopback/socketio](https://github.com/strongloop/loopback-next/tree/master/extensions/socketio) was added to use socket.io to expose controllers as WebSocket friendly endpoints.

- Enable/disable the metrics endpoints in explorer when mounting the metric and health extensions. See PR [#6646](https://github.com/strongloop/loopback-next/pull/6646) and PR [#6645](https://github.com/strongloop/loopback-next/pull/6645).

- Only add `MetricsObserver`, `MetricsPushObserver` and expose `/metrics` endpoints when they are enabled. See PR [#6644](https://github.com/strongloop/loopback-next/pull/6644).

- The health check for applications running in container now returns a more accurate HTTP status code based on the state. For example, checking `/health` for application in states 'STARTING', 'STOPPING' or 'STOPPED' returns 503. You can find more details in PR [#6648](https://github.com/strongloop/loopback-next/pull/6648).

## Documentation Restructure

- LoopBack 4 targets both API developers and extension developers, while the current website doesn't distinguish them clearly. This month we restructured the sidebar to classify the documentation into two parts: "Building LoopBack Applications" and "Extending LoopBack Framework". You can check [https://loopback.io/doc/en/lb4/Customizing-server-configuration.html](https://loopback.io/doc/en/lb4/Customizing-server-configuration.html) to view the new layout.

- The instructions for implementing HTTP redirects and mounting an Express router are extracted into a standalone page under "How-to guides". You can check [https://loopback.io/doc/en/lb4/Customizing-routes.html](https://loopback.io/doc/en/lb4/Customizing-routes.html) to view the content.

- Moved server recipes to how-to guides [Customizing-server-configuration](https://loopback.io/doc/en/lb4/Customizing-server-configuration.html). See PR [#6663](https://github.com/strongloop/loopback-next/pull/6663).

## Examples

Two examples were added last month:

- Example [webpack](https://github.com/strongloop/loopback-next/tree/master/examples/webpack) was added to demo LoopBack running inside the browser as client-side JavaScript application.

- Example [socketio](https://github.com/strongloop/loopback-next/tree/master/examples/socketio) gives a basic implementation of socketio with LoopBack 4.

You can also download the examples by using the `lb4 example` command.

## Enriching LoopBack and its Community - You are Invited!

As mentioned in our [recent blog post](https://strongloop.com/strongblog/2020-community-contribution/), your contribution is important to make LoopBack a sustainable open source project. 

Here is what you can do:
- [Join LoopBack Slack community](https://join.slack.com/t/loopbackio/shared_invite/zt-8lbow73r-SKAKz61Vdao~_rGf91pcsw)
- [Look for first-contribution-friendly issues](https://github.com/strongloop/loopback-next/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
- Give us feedback and join our discussion in [our GitHub repo](https://github.com/strongloop/loopback-next)

Let's make LoopBack a better framework together!
