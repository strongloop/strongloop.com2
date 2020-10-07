---
layout: post
title: LoopBack 4 September 2020 Milestone Update
date: 2020-10-07
author: Hage Yaapa
permalink: /strongblog/september-2020-milestone/
categories:
  - Community
  - LoopBack
---

We bring another month of new features, fixes, and improvements in documentation and developer experience in LoopBack. Make sure to update your compatible projects with `lb4 update` if you want to update the underlying libraries to their latest versions.

Also, as part of our long-term effort to encourage more community contributions, we are participating in this year’s [Hacktoberfest](https://hacktoberfest.digitalocean.com/). You can read more about the event and participation details at our [Hacktoberfest blogpost](https://strongloop.com/strongblog/2020-hacktoberfest/). 

<!--more-->

## Documentation Enhancements

There has been a continuous effort to improve our documentation. Below are some highlights for this month:

- A new documentation page, [Accessing HTTP request and response objects](https://loopback.io/doc/en/lb4/Accessing-http-request-response.html), was added explaining the various ways and places to access the request and response objects.
- We are working on a series of troubleshooting guides for LoopBack. This month we completed the [basic guide](https://loopback.io/doc/en/lb4/Troubleshooting.html) and [Debugging tests with Mocha](https://loopback.io/doc/en/lb4/Debugging-tests-with-mocha.html). [A few more areas](https://github.com/strongloop/loopback-next/issues/5701#issuecomment-700955686) that can be added to the guide.
- We added an [example app](https://github.com/strongloop/loopback-next/tree/master/examples/binding-resolution) demonstrating LoopBack 4's context binding resolution and dependency injection within a context hierarchy.

## New Experimental Features

- We have created a [GraphQL extension](https://github.com/strongloop/loopback-next/tree/master/extensions/graphql) that provides integration with GraphQL using [type-graphql](https://typegraphql.com/). Check out the [GraphQL example app](https://github.com/strongloop/loopback-next/tree/master/examples/graphql) for a sample app.
- We added support for parsing [MessagePack](https://msgpack.org/index.html) bodies. For usage, refer to the [documentation](https://github.com/strongloop/loopback-next/tree/master/bodyparsers/rest-msgpack).

## Investigation on Better Handling of ObjectID in MongoDB

We spent a good amount of time to improve the experience of using `ObjectID` with LoopBack. We have identified the direction we want to take and the tasks to work on. You can learn more about the spike in issue [3456](https://github.com/strongloop/loopback-next/issues/3456).


## Fixes and Improvements

- [added `.onStart()` and `.onStop()` methods of the `Application`](https://github.com/strongloop/loopback-next/pull/6230), so that they can be used to register observers as plain functions for the start and stop life-cycle events.
- [enhanced the `lb4 update` command](https://github.com/strongloop/loopback-next/pull/6398) to be runnable against any projects that use `@loopback/*` dependencies in `dependencies` or `devDependencies`, or `peerDependencies`; not just LoopBack 4 projects.
- [included the application build when running `migrate` and `openapi-spec` scripts](https://github.com/strongloop/loopback-next/pull/6390).
- added `@injectable`, so that `@injectable` can be used instead of `@bind`, which is in tune with other frameworks using Dependency Injection. `@bind` is not removed from the framework, so apps using `@bind` will not be affected.
- made the `keepAliveTimeout`, `headersTimeout`, `maxConnections`, `maxHeadersCount`, and `timeout` properties of the underlying [HTTP server](https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_class_http_server) instance [configurable by specifying them in the application config object](https://github.com/strongloop/loopback-next/pull/6267).
- [updated the generated application directory name during application scaffolding](https://github.com/strongloop/loopback-next/pull/6429) when application names involve numbers
- added [the ability to boot dynamic value provider classes and classes with `@inject`](https://github.com/strongloop/loopback-next/pull/6315).
- removed the `extension-` prefix from the affected extensions for their names to be consistent with other extension modules.
- [improved the overall experience of graphql configuration and subscriptions](https://github.com/strongloop/loopback-next/pull/6313) in LoopBack. 
- added the [support of OpenAPI parameter AJV validation](https://github.com/strongloop/loopback-next/pull/6285) on simple types and [AJV formats for OpenAPI spec data type formats](https://github.com/strongloop/loopback-next/pull/6262).
- [updated the REST middleware](https://github.com/strongloop/loopback-next/pull/6284) so that it can now cached by the use of singleton binding scope.
- added Twitter example in the [Passport login example app](https://github.com/strongloop/loopback-next/tree/master/examples/passport-login).

## Community Contributions

Shout out to [Rifa Achrinza](https://github.com/achrinza) for explaining the differences between weak and strong relations in PR [6404](https://github.com/strongloop/loopback-next/pull/6404), [MessagePack PR](https://github.com/strongloop/loopback-next/pull/6155), and his numerous other PRs.

Opening issues are community contributions too, so thanks to all those who help LoopBack become better by reporting bugs and usability issue. We try to address popular issues with higher priority, so continue to let us know the problems you face on [GitHub](https://github.com/strongloop/loopback-next/issues) or [Slack](https://join.slack.com/t/loopbackio/shared_invite/zt-8lbow73r-SKAKz61Vdao~_rGf91pcsw).

## Enriching LoopBack and its Community - You are Invited!

As mentioned in our [recent blog post](https://strongloop.com/strongblog/2020-community-contribution/), your contribution is important to make LoopBack a sustainable open source project. 

Here is what you can do:
- [Join LoopBack Slack community](https://join.slack.com/t/loopbackio/shared_invite/zt-8lbow73r-SKAKz61Vdao~_rGf91pcsw)
- [Look for first-contribution-friendly issues](https://github.com/strongloop/loopback-next/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
- Give us feedback and join our discussion in [our GitHub repo](https://github.com/strongloop/loopback-next)

Let's make LoopBack a better framework together!
