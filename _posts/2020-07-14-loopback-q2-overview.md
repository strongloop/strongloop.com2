---
layout: post
title: LoopBack 4 2020 Q2 Overview
date: 2020-07-14
author:
  - Agnes Lin
permalink: /strongblog/loopback-4-2020-q2-overview/
categories:
  - LoopBack
  - Community
published: true
---

Over the recent months, this global pandemic has affected our lives in different ways; we hope you all stay safe during these difficult times. The LoopBack team has adapted to new ways of working, including virtually and in new settings. Even though it could be challenging sometimes, we are glad that we were able to complete most of our Q2 plan. Thanks to all the support from the team and the community!

Here's a brief look at the Q2 summary:

- [Migration Guide](#migration-guide)
- [Enhancing Documentation](#enhancing-documentation)
- [Leveraging Authentication System](#leveraging-authentication-system)
- [APIC/LB4 Integration](#apic/lb4-integration)
- [Other Highlights](#other-highlights)
- [Building LoopBack Community](#building-loopBack-community)

<!--more-->

## Migration Guide

One of our main targets in Q2 was to finish the migration guide, and we did it! We accomplished all the items on the [migration plan](https://github.com/strongloop/loopback-next/issues/453). The [Migration guide](https://loopback.io/doc/en/lb4/migration-overview.html) can be found easily on the LB4 home page. We have instructions that helps you migrate various artifacts and also have docs to explain similarities and differences between LB3 and LB4. From request/response infrastructure to datasource setup, from model definitions to the authentication and authorization, we hope the guide is useful for you when migrating your LoopBack 3 applications to LoopBack 4.

## Enhancing Documentation

### New Documentation Structure

This quarter, one of our targets was to upgrade the documentation system. As we are adding more features and documentation to LoopBack 4, the abundant amount of sidebar entries was overwhelming and difficult to navigate with the old documentation system. We reorganized most of them into the following four parts:

- "Tutorials"
- "How-to guides"
- "Behind the scenes"
- "References guides"

For example, if you'd like to learn how you can secure your LoopBack 4 application, now you can find it easily under the "Tutorials" sections instead of searching through the whole path "Concept -> Authentication -> Authentication tutorial".

Moreover, we also started working on reorganizing most of our documentation to focus on framework-level APIs and de-emphasizing the lower-level building blocks to reduce the complexity. For example, we removed `@loopback/express` from framework-level documentation and replaced references to use `@loopback/rest instead`.

This is just the first step of our long journey of improving the documentation system. Please let us know if you have any feedback.

### Rewriting your favorite LB3 content to LoopBack 4

We've been using shared content for some topics in both LB3 and LB4, but this might be confusing if the user is not familiar with LB3. To reduce the gap between these two versions, we also rewrote some documentation from LB3 in LB4 style. For example, now you can check usage examples written in LB4 style for the Filters under the page [Working with data](https://loopback.io/doc/en/lb4/Working-with-data.html). What's more is that we also created tutorials for connecting to [MySQL](https://loopback.io/doc/en/lb4/Connecting-to-MySQL.html), [Oracle](https://loopback.io/doc/en/lb4/Connecting-to-Oracle.html), [PostgreSQL](https://loopback.io/doc/en/lb4/Connecting-to-PostgreSQL.html), and [MongoDB](https://loopback.io/doc/en/lb4/Connecting-to-MongoDB.html) databases. By following the steps in these tutorials, you'll find it easy to connect to databases with LB4 applications.

## Leveraging Authentication System

The authentication system has changed a lot since it was being used as an experimental feature. It is now more reliable and flexible. We improved it in the following aspects:

### Examples

We added two examples for different authentication strategies:

- [TODO example with JWT](https://github.com/strongloop/loopback-next/tree/master/examples/todo-jwt) demos enabling JWT authentication in the Todo application. This is a good example for beginners to follow the authentication system.

- [Passport Login example](https://github.com/strongloop/loopback-next/tree/master/examples/passport-login) shows how to use [Passport Strategies](http://www.passportjs.org/docs/) in LoopBack 4. If you are using the loopback-component-passport in LoopBack 3, this example can help you migrate your application to LoopBack 4.

### Documentation

We reorganized the authentication documentation to make it more easy to adopt. Instead of throwing all the details to users, now the [authentication docs](https://loopback.io/doc/en/lb4/Authentication-overview.html) starts with a simple high-level explanation, then it walks through users with several examples with different difficulties to show what the system is capable of and how they can be achieved.

Besides, as we mentioned above, we also added page [Migrating authentication and authorization](https://loopback.io/doc/en/lb4/migration-auth-overview.html) as part of the migration plan as well.

## APIC/LB4 Integration

[API Connect](https://developer.ibm.com/apiconnect/) is a complete, intuitive and scalable API platform provided by IBM.

In Q2, we completed the integration of LoopBack 4 with API Connect v10 which was released in June. When a LoopBack application is scaffolded through the APIC toolkit, the LoopBack-generated OpenAPIv3 spec comes with API Connect specific metadata added, thanks to the [LoopBack APIConnect extension](https://github.com/strongloop/loopback-next/tree/master/extensions/apiconnect). If you're interested, we've been preparing an article on how you can take the APIs created from LoopBack and import them into API Connect for API management. Stay tuned!

## Other Highlights

Here are some highlights of our work we would like to share!

### Supporting TypeORM

You might decide to use an alternative ORM/ODM in your LoopBack 4 application, and LoopBack 4 also has such flexibility as it no longer expects you to provide your data in its own custom Model format for routing purposes, which means you are free to alter your classes to suit these ORMs/ODMs.

[TypeORM](https://typeorm.io/#/) is an ORM that can run in NodeJS and others platforms and can be used with TypeScript and JavaScript, which fits LoopBack 4 well. We implemented initial support for TypeORM in LoopBack 4 in the `@loopback/typeorm` package. Please check the [README](https://github.com/strongloop/loopback-next/blob/master/packages/typeorm/README.md) file for the usage and limitations.

### Express Middleware

LoopBack 4 leverages Express behind the scenes for its REST server implementation. The new [Express Package](https://github.com/strongloop/loopback-next/tree/master/packages/express), has enabled injecting single and multiple express middleware functions as `Interceptor`s into `Controller` invocations and also as a middleware step in the application `Sequence`.

### Component Application Booter

Sometimes it might be the case that we want to break our complex application into multiple smaller LoopBack applications. The component application booter composes these sub applications into the main application. This is helpful for building a scalable micro-services application. See the page [Booting an Application](https://loopback.io/doc/en/lb4/Booting-an-Application.html).

### HasManyThrough Relation

With help from the community users, the experimental feature [`HasManyThrough` relation](https://github.com/strongloop/loopback-next/blob/master/packages/repository/src/relations/has-many/has-many-through.repository.ts) is added to LB4. Currently it only has some basic functionalities. The documentation and related CLI will be updated in the near future.

### Run Tests in Parallel

We upgraded `mocha` to the new version 8, and it enable parallel execution of Mocha tests. With the option, we can control the number of worker processes and make the testing process more efficient. Details can be found in [Running tests](https://loopback.io/doc/en/lb4/code-contrib-lb4.html#running-tests) section.

### Extensions

Extensions/Extension points is one of the main features of LB4 to make the application extensible. We added the following two extensions in Q2:

- JWT authentication: as the authentication system gets popular and more solid, we extracted the JWT authentication system into a separate extension package as an experimental feature, so that users can quickly mount a component to try out the feature. Check [`authentication-jwt`](https://github.com/strongloop/loopback-next/tree/master/extensions/authentication-jwt) for details.

- LoopBack APIConnect extension: the [LoopBack APIConnect extension](https://github.com/strongloop/loopback-next/tree/master/extensions/apiconnect) is ready for use. It provides `ApiConnectComponent` that adds an `OASEnhencer` extension to contribute `x-ibm-configuration` to the OpenAPI spec generated by LoopBack applications.

## Building LoopBack Community

We're happy to see more users/developers join our community. We appreciate all the help! We've opened a public [Slack](https://slack.com/) channel so that developers can ask questions, discuss issues, and share their knowledge to help each other easily.

We also had a several video-calls with LoopBack maintainers. It's nice to get to know each other, share the plans & visions and discuss topics by talking together. Let's continue building LoopBack a better framework together.

Wanna join us? Yes! You're invited :point_right: [Join LoopBack Channel on Slack](https://join.slack.com/t/loopbackio/shared_invite/zt-8lbow73r-SKAKz61Vdao~_rGf91pcsw).

## Previous Milestone Blogs

There are many more accomplishments that cannot be captured in this blog, make sure you check out our previously published monthly milestone blog posts in Q2 for more details:

- [April 2020](https://strongloop.com/strongblog/april-2020-milestone/)
- [May 2020](https://strongloop.com/strongblog/may-2020-milestone/)
- [June 2020](https://strongloop.com/strongblog/june-2020-milestone/)

## What's Next?

We have published a blog [LoopBack - 2020 Goals and Focus](https://strongloop.com/strongblog/2020-goals/) about our plans this year. Here is a summary of the [Q3 2020 roadmap](https://github.com/strongloop/loopback-next/blob/master/docs/ROADMAP.md#q3-2020-roadmap):

- finish migration guide for both general runtime and authentication & authorization
- continue with API Connect and LoopBack integration
- look into feature parity gaps that are highly requested by users

## Call to Action

In 2020, we look forward to helping you and seeing you around! LoopBack's success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Here's how you can join us and help the project:

- [Report issues](https://github.com/strongloop/loopback-next/issues).
- [Contribute](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md) code and documentation.
- [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Join](https://github.com/strongloop/loopback-next/issues/110) our user group.
