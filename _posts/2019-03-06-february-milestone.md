---
layout: post
title: LoopBack 4 February 2019 Milestone Update
date: 2019-03-06
author: Nora Abdelgadir
permalink: /strongblog/february-2019-milestone/
categories:
  - Community
  - LoopBack
published: true
---

It feels like 2019 just started, but we are somehow already in March. February flew by, but while the month was short, the list of things the LoopBack team accomplished in the month was the opposite. In February, we tackled authentication and authorization, spikes on migration from LoopBack 3 to LoopBack 4, preparation for events, and others. You can see the [February milestone](https://github.com/strongloop/loopback-next/issues/2313) and see the [March milestone](https://github.com/strongloop/loopback-next/issues/2516) to see what we are working on next. Read more to see the details of our progress in February.

<!--more-->

## Authentication and Authorization

We refactored the JWT authentication strategy in `loopback4-example-shopping` to be more modular and leveraged functions from `jsonwebtoken` to perform a more robust password hashing and comparison. The token based utilities are refactored into a token service, so that it can be injected into the controller and strategy classes using Dependency Injection. The `bcrypt` password hasher service is created similarly.

Our next step is to write a guide for plugging in different authentication strategies and depicting the API flow of authenticating the endpoints. In the meantime, we will be adding more abstractions to shape the authentication system as the groundwork before opening the extension points for the authentication system. You could check the subsequent stories in [issue #1035](https://github.com/strongloop/loopback-next/issues/1035) and track our progress there.

## Migration from LoopBack 3 to LoopBack 4

LoopBack has a guide on [migrating](https://loopback.io/doc/en/lb3/Migrating-to-3.0.html) applications from LoopBack 2 to LoopBack 3, and it's only fitting that we include a guide on migrating applications from LoopBack 3 to LoopBack 4 as they reach feature parity. However, the latter's transition is more complicated than the former's transition. We have an [epic](https://github.com/strongloop/loopback-next/issues/1849), if you would like to see more details. 

This month, we did two spikes to work on this transition. We started with a proof of concept demonstrating how to take LoopBack 3 model definition files (e.g. `common/models/product.json` and `common/models/product.js`) and drop them without any modifications into a LoopBack 4 project. You can find the original idea in [issue #2224](https://github.com/strongloop/loopback-next/issues/2224) and the working code in [pull request #2274](https://github.com/strongloop/loopback-next/pull/2274).

Unfortunately, this approach turned out to be too expensive to implement and maintain, and we decided to abandon it.

Not all is lost, though! While discussing the proof of concept, we realized there is a simpler way how to build a bridge between LoopBack 3 and LoopBack 4: mount the entire LoopBack 3 application as a REST component of the LoopBack 4 project.

The [pull request #2318](https://github.com/strongloop/loopback-next/pull/2318) presents a proof of concept that we will use to drive the actual implementation tracked by [Epic #2479](https://github.com/strongloop/loopback-next/issues/2479).

We have also identified few new stories to bridge the gap preventing LoopBack 3 applications to be migrated to LoopBack 4, see the following [GitHub comment](https://github.com/strongloop/loopback-next/issues/1849#issuecomment-467471409).

## Generate Docker Files through the CLI

We added a new feature to the CLI: the [`--docker`](https://www.docker.com/) option when generating a LoopBack application. This option generates `Dockerfile`, `.dockerignore`, and two Docker scripts: `docker:build` and `docker:run`. See [Application generator](https://loopback.io/doc/en/lb4/Application-generator.html) to see how to generate an application with `--docker`. 

Following this feature, we added a [fix](https://github.com/strongloop/loopback-next/pull/2433) that forces the test host to be `HOST` environment variable or IPv4 interface, which makes it easier to run LoopBack 4 application tests inside a Docker container.

## Documentation on Submitting a Pull Request

We introduced a detailed list of steps to follow if you want to submit a pull request for LoopBack 4. This [guide](https://loopback.io/doc/en/lb4/submitting_a_pr.html) includes steps for [beginners](https://loopback.io/doc/en/lb4/submitting_a_pr.html#beginner-instructions) and for [experienced](https://loopback.io/doc/en/lb4/submitting_a_pr.html#expert-instructions) users. It took a lot of [discussion](https://github.com/strongloop/loopback-next/pull/2364) to finally nail a balanced read that was both concise and informative. You can now follow this handy resource if you would like to submit a PR to [`loopback-next`](https://github.com/strongloop/loopback-next).

## Tutorial on Mounting LoopBack REST API on an Express Application

We added a new tutorial demonstrating how to mount LoopBack 4's REST API on an Express application. Users can now mix both the Express and LoopBack 4 frameworks in order to best match their own use cases. In this tutorial, we mounted a `Note` application created by the LoopBack 4 CLI on top of a simple Express server and served a static file. You can follow the [tutorial](https://loopback.io/doc/en/lb4/express-with-lb4-rest-tutorial.html) or see the completed example by using the command `lb4 example express-composition`.

## New Layout for Test Files

In a series of incremental pull requests, we reworked our project layout, moved all test files from `test` to `src/__tests__` directory and updated TypeScript build configuration to place files directly to `dist` folder, instead of `dist/src` and `dist/test`. This change simplifies the build setup and unifies file references between TypeScript sources and JavaScript runtime. It allows us to further improve our project infrastructure, for example start using TypeScript [Project References](https://www.typescriptlang.org/docs/handbook/project-references.html).

LoopBack 4 projects scaffolded with recent versions of `lb4` tool will use the new layout too. 

Existing projects can be updated with a bit of manual work:

- Move your test files from `test` to `src/__tests__`.
- Edit script in `package.json` to use the new test location.
- Change `tsconfig.json`: set `rootDir` to `"src"`, remove `"index.ts"` and `"test"` entries from the `include` field.
- Fix any broken `import` statements.

The [pull request #2316](https://github.com/strongloop/loopback-next/pull/2316/files) shows how we updated our example applications; you can use it as a reference guide. 

## Other Updates

- You can now disable the OpenAPI spec endpoints (e.g. `/openapi.json`) which will also disable the `/explorer` endpoint by setting your rest's `openApiSpec.disabled` option to true. See [Customize How OpenAPI Spec is Served](https://loopback.io/doc/en/lb4/Server.html#customize-how-openapi-spec-is-served) for more `rest.openApiSpec` options. [PR #2470](https://github.com/strongloop/loopback-next/pull/2470).

- Another `rest` option introduced is `requestBodyParser`, so you can now [configure the request body parser](https://loopback.io/doc/en/lb4/Server.html#configure-the-request-body-parser-options). [PR #2432](https://github.com/strongloop/loopback-next/pull/2432).

- LoopBack cares a lot about your security. A security issue related to `JSON.parse()` was [discovered](https://github.com/hapijs/bourne#introduction) and this PR added a sanitizer for JSON. [PR #2348](https://github.com/strongloop/loopback-next/pull/2348).

- Now you can override the default [Express settings](https://loopback.io/doc/en/lb4/Server.html#express-settings) and also add your own. [PR #2423](https://github.com/strongloop/loopback-next/pull/2423).

- You can now use a custom repository base class in your LoopBack application. [PR #2235](https://github.com/strongloop/loopback-next/pull/2235).

## Events

This month, the team went to downtown Toronto for a [meetup](https://www.meetup.com/Toronto-Cloud-Integration-Meetup/events/257171001/). This included an overview of LoopBack 4, along with demonstrations of what LoopBack 4 can do. Check out the [blog post](https://strongloop.com/strongblog/watch-meetup-quickly-build-apis-with-loopback/) about it. There was also a [Quick Lab](https://developer.ibm.com/tutorials/create-rest-apis-minutes-with-loopback-4/) and [Master Class session](https://myibm.ibm.com/events/think/all-sessions/session/7764A) for LoopBack 4 in IBM's Code@Think in mid-February. And finally, [Raymond](https://strongloop.com/authors/Raymond_Feng/) presented at DeveloperWeek 2019 where he talked about [Building APIs with Node.js, TypeScript, and LoopBack](https://developerweek2019.sched.com/event/JXDc/pro-talk-speed-and-scale-building-apis-with-nodejs-typescript-and-loopback).

If you want to come to our future events, keep an eye out on the [Strongblog](https://strongloop.com/strongblog/) for announcements.

## Community Contributions

As the number of contributions from our community rises, we are spending an increasing part of our time on reviewing these pull requests and helping our volunteers to get their changes landed. In fact, every fifth pull request opened this month was contributed by you! Check out the [community-contribution label](https://github.com/strongloop/loopback-next/pulls?q=is%3Apr+is%3Aopen+label%3Acommunity-contribution) to see pull requests by the community.

We would like to take a moment to thank everyone who has submitted a pull request; the team really appreciates your contributions.

There are also other ways for getting involved beyond code contributions. Triaging issues and reviewing pull requests are examples of activities that would help us to accelerate the success of LoopBack as an open-source project. You can learn more about different contribution opportunities in [Contributing to LoopBack](https://loopback.io/doc/en/contrib/index.html).

## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Reporting issues](https://github.com/strongloop/loopback-next/issues).
- [Contributing](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md)
  code and documentation.
- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Joining](https://github.com/strongloop/loopback-next/issues/110) our user group.
