---
layout: post
title: LoopBack 4 2019 Q1 Overview
date: 2019-04-11
author: Diana Lau
permalink: /strongblog/loopback-4-2019-q1-overview/
categories:
  - LoopBack
  - Community
published: true
---

When the LoopBack team released [LoopBack 4 GA version](https://strongloop.com/strongblog/loopback-4-ga) last October, they didn't stop to rest on their laurels. The team has been busy enhancing the framework, closing feature parity gaps, and helping community onboard with LoopBack 4.

Since GA, we have been focusing on implementing/enhancing the following major areas:

- [Authentication](#authentication)
- [Model relations](#model-relations)
- [Migration](#migration)
- [Extensibility](#extensibility)

<!--more-->
Many thanks to your support and contributions! We are seeing more than double in our monthly download numbers in [npmjs.com](https://www.npmjs.com/) since GA. We are also seeing an increase in activities from the community, in terms of answering others' questions and submitting pull requests. For the last 3 months, more than 15% of the merged pull requests are coming from the community. Want to help but new to open source contribution? Don't worry, this [step by step guide](https://loopback.io/doc/en/lb4/submitting_a_pr.html) will guide you through the contribution process.

Let's take a closer look at each epic.

### Authentication

As part of the scenario-driven approach, we have added a reference implementation using JWT authentication in the [shopping example](https://github.com/strongloop/loopback4-example-shopping). We have also worked on a more [detailed design](https://github.com/strongloop/loopback-next/tree/master/packages/authentication/docs) and started the implementation to enable extension points for plugging in different authentication strategies.

### Model Relations

Besides `hasMany` and `belongsTo`, we have added one more relation type: [`hasOne`](https://loopback.io/doc/en/lb4/hasOne-relation.html). We received lots of interests around other relation types, such as `hasManyThrough`. Some of you are implementing the command line interface for creating model relations (`lb4 relation`). It's on the way!

Inclusion of related model when querying data is a popular feature that is not available in LoopBack 4 yet. The initial research was concluded with a need to better investigate how to represent navigational properties used to include data of related models. We have explored multiple alternatives and came up with a solution that not only nicely addresses both TypeScript types and OpenAPI schema, but is also flexible enough to support other use cases like partial updates and exclusion of auto-generated properties when creating new model instances. You can learn more in our [March milestone blog post](https://strongloop.com/strongblog/march-2019-milestone/).

### Migration

Earlier this year, we have made the announcement to extend the long term support for LoopBack 3. If you're using an older LoopBack version, don't miss [the announcement blog post](https://strongloop.com/strongblog/lb3-extended-lts/).

Meanwhile, we did a lot of investigation to improve the developer experience for migrating LoopBack 3 applications to LoopBack 4. One of the goals is to allow you to migrate your application incrementally. We have investigated on how to [mount Express router with OpenAPI spec](https://github.com/strongloop/loopback-next/issues/2389) and completed a spike for [mounting an LoopBack 3 app and include its REST API in OpenAPI spec](https://github.com/strongloop/loopback-next/issues/2318).

In the coming weeks and months, we are going to implement stories identified by the spike and grouped in the epic [Mount LB3 app in LB4](https://github.com/strongloop/loopback-next/issues/2479). Stay tuned!

### Extensibility

One of our goals for LoopBack 4 is to build a minimal core while enabling everything else to be implemented via extensions. We continued to enhance the extensibility of the framework. We have introduced `context.view` and related events and added a `greeter-extension` [example](https://github.com/strongloop/loopback-next/tree/master/examples/greeter-extension). Lifecycle support and binding configuration/injection are coming soon.

### User Adoption

As LoopBack is a Node.js framework, we've looked at the common use cases for Node.js developers to think of ways to make your adoption to LoopBack easier. Receiving feedback from various sources, we have:

- Investigated the possibility to use JavaScript when developing LoopBack 4 applications. Check out our recent [blog post](https://strongloop.com/strongblog/loopback4-javascript-experience/) for details.

- Added [an example](https://github.com/strongloop/loopback-next/tree/master/examples/express-composition) on how to mount Express middleware to a LoopBack application.

### Experimental

On top of the features mentioned in the above stories, we are always looking to use and/or integrate with popular technologies. Here is a list of experimental features we're working on:

- [Kafka](https://github.com/strongloop/loopback4-example-kafka)
- [Socket.io](https://github.com/strongloop/loopback-next/pull/2648)
- [Native support of GraphQL](https://github.com/strongloop/loopback-next/pull/2670)
- [OpenAPI connector](https://github.com/strongloop/loopback-connector-openapi/pull/2)
- [gRPC extension](https://github.com/strongloop/loopback4-extension-grpc)
- [Support for method interceptors](https://github.com/strongloop/loopback-next/pull/2687)

While we want to make sure high quality of code goes into our codebase which may take multiple iterations, we're looking for ways to release experimental features so that our users can take a peek earlier and give early feedback. We are looking for your feedback on how we can roll out the experimental features in GitHub [issue #2676](https://github.com/strongloop/loopback-next/issues/2676).

## What's Next?

Going forward, we will continue to improve the migration experience, close feature parity gaps and bring compelling features to you. Please see the [Q2 roadmap](https://github.com/strongloop/loopback-next/issues/2692) for our plan.

## Previous Milestone Blogs

If you have been following our blog, you probably notice that we have monthly milestone blogs to update our users on the progress that we're making. Here are the previous monthly milestone blogs if you want more details:

- [October 2018](https://strongloop.com/strongblog/loopback-4-october-2018-milestone/)
- [November 2018](https://strongloop.com/strongblog/november-2018-milestone/)
- [December 2018](https://strongloop.com/strongblog/december-2018-milestone/)
- [January 2019](https://strongloop.com/strongblog/january-2019-milestone/)
- [February 2019](https://strongloop.com/strongblog/february-2019-milestone/)
- [March 2019](https://strongloop.com/strongblog/march-2019-milestone/)

## Call for Actions

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Reporting issues](https://github.com/strongloop/loopback-next/issues).
- [Contributing](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md)
  code and documentation.
- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
