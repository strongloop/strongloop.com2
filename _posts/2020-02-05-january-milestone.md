---
layout: post
title: LoopBack 4 January 2020 Milestone Update
date: 2020-02-05
author: Dominique Emond
permalink: /strongblog/january-2020-milestone/
categories:
  - Community
  - LoopBack
published: true
---

It's a [Leap Year](https://en.wikipedia.org/wiki/Leap_year) this year, and we continue to make leaps in LoopBack 4.

With New Year's resolutions in mind, we quickly got started on several items.

Check out the sections below for the progress we made in each area:

- [LoopBack 4 Shopping Example Front-end](#loopback-4-shopping-example-front-end)
- [Migration Guide](#migration-guide)
- [Improved Developer Experience](#improved-developer-experience)
- [Improved Performance Of Context](#improved-performance-of-context)
- [APIC / LoopBack Integration](#apic-/-loopback-integration)
- [Community Contributions](#community-contributions)
- [Miscellaneous](#miscellaneous)

<!--more-->

## LoopBack 4 Shopping Example Front-end

The LoopBack 4 example app now has a website - Shoppy.

![](../images/shoppy.png)

Check out https://github.com/strongloop/loopback4-example-shopping/ and start the app; Shoppy is available at http://localhost:3000/shoppy.html.

This website serves as an example for integrating LoopBack 4 APIs to a front-end and as a basis for you to experiment with various LoopBack 4 features.

The authorization portion has also been revamped to make it easier to follow.

## Migration Guide

### Migrating Boot Scripts

In LoopBack 3, predefined boot scripts are organized in the `/server/boot` directory, and are executed right before the server starts to perform some custom application initialization. The same functionality can also be achieved in LoopBack 4 application by adding observers.
Having the observers created, you can access the application and artifacts like models, datasources by dependency injection or retrieving from the context. Moreover, specifying the order of observers is also supported. For the 2 pre-defined LoopBack 3 boot scripts (`/server/boot/root.js` and `/server/boot/authentication.js`), please do not create corresponding observers for them. In LoopBack 4, the router is automatically registered in the rest server and the authentication system is enabled by applying the authentication component. See [Migrating boot scripts](https://loopback.io/doc/en/lb4/migration-boot-scripts.html) for more details.

### Migrating Remoting Hooks

In LoopBack 3, a remote hook enables you to execute a function before or after a remote method is called by a client. There are three kinds of hooks: global, model, and method. LoopBack 4 provides the interceptors feature to enable application developers to implement similar functionality.
See [Migrating remoting hooks](https://loopback.io/doc/en/lb4/migration-models-remoting-hooks.html) for more details.

### Migrating Custom Model Methods

 In LoopBack 3, developers could customize model methods in various ways:

 - configure which endpoints are public
 - customize the model method, but not the endpoint
 - add a new model method and a new endpoint

 The first could be done by modifying some settings in `server/model-config.json` or calling the `disableRemoteMethodByName( methodName )` on the model. The second was accomplished by overriding a default model method inside the model script file. The third was accomplished by adding a new model method and a new remote method definition inside the model script file.

 In LoopBack 4,
  - data-access APIs (model methods) are implemented by repositories that are decoupled from models.
  - REST APIs (remote methods) are implemented by controllers that are decoupled from models.

Migrating the LoopBack 3 model method customizations to LoopBack 4 is very straightforward.
See [Migrating custom model methods](https://loopback.io/doc/en/lb4/migration-models-methods.html) for more details.

### Spike for Authentication & Authorization Migration Guide

A spike was completed which outlined the remaining tasks required for authentication and authorization migration details between LB3 and LB4.
Please see [PR #4440](https://github.com/strongloop/loopback-next/pull/4440) for details.

## Improved Developer Experience

### CLI Improvements

The Command Line Interface (CLI) is one of the most convenient tools of LoopBack. With a few commands and basic information, it allows you to create a LoopBack application in a short time. We made some improvements in the following CLI commands to make them more intuitive and flexible (especially the `relation` one):

#### `lb4 relation`

Alright, we admit that our `lb4 relation` command wasn't entirely user-friendly -- it generated partial code even when you forced it to stop; it didn't handle customized names even when it looked like it would; it didn't support the `HasOne` relation. We improved on some of these issues. As you can see in the newly updated [Relation Generator](https://loopback.io/doc/en/lb4/Relation-generator.html) page, it now takes customized foreign keys and relation names with more descriptive prompt messages. Need an example? We updated the [TodoList Example](https://loopback.io/doc/en/lb4/todo-list-tutorial-relations.html) with the latest CLI capabilities.

Even though the CLI is a handy tool and has a lot of functionality, it still has limitations. For instance, users can customize foreign key names, relation names, source key names, and even the database column names in relations. The newly released CLI changes currently supports some of these, but not all of them. For the latest details on defining relations, you can always check the [Relations](https://loopback.io/doc/en/lb4/Relations.html) page.

As for defining a `HasOne` relation through the CLI, one of our community users [`@Lokesh1197`](https://github.com/lokesh1197) has provided this new capability via [PR #4171](https://github.com/strongloop/loopback-next/pull/4171). See [hasOne Relation](https://loopback.io/doc/en/lb4/hasOne-relation.html) and [Relation generator](https://loopback.io/doc/en/lb4/Relation-generator.html) for updated documentation.

#### `lb4 openapi`

LoopBack 4 uses `index.ts` files to export different kinds of artifacts. The `lb4 openapi` command wasn't generating/updating this file. We noticed this recently and fixed it immediately. Phew! Don't forgot to install the latest `@loopback/cli` to get the patch!

### Warning for strict model usage

If you are/used to be an LB3 user, you're probably familiar with the `strict` mode. It allows you to create models that permit both well-defined and also arbitrary extra properties. LB4 has this nice feature as well. However, it is applicable to **NoSQL** databases only. If you applied this setting to SQL databases, it would get silently discarded and this made it difficult for developers to troubleshoot unexpected behavior.

Now, users will receive a warning when they try to set a model to `{strict: false}` mode while they are using a SQL datasource in an LB4 application. We updated the [Supported Entries of Settings](https://loopback.io/doc/en/lb4/Model.html#supported-entries-of-settings) table of the `Model` page to clarify this potential issue.

## Improved Performance Of Context

We addressed some context-related performance degredation bugs that recently came in. It turns out that matching all bindings by a filter function can be expensive. [PR #4377](https://github.com/strongloop/loopback-next/pull/4377) addresses these bugs and improves performance for one of the primary usages of the context - find bindings by tags.

Performance was improved by:

- making a binding to be an EventEmitter (emitting events when binding scope/tags/value are changed)
- setting up event listeners in the context to react to binding events to maintain an index of bindings by tag
- optimizing Context.findByTag to leverage binding index if possible
- changing interceptor to find matching global interceptors by tag
- simple benchmark testing shows over 15% gain for hello-world

## APIC / LoopBack Integration

We started to investigate the steps required, if needed, on importing OpenAPI specs generated from a LoopBack 4 application into IBM API Connect v2018. There are additional extended configurations and APIC product files that are needed in order to import the API successfully. As the next step, we will be testing all endpoints of our example shopping application with API Connect, and documenting the steps. For details on the spike, see https://github.com/strongloop/loopback-next/issues/4115.

## Community Contributions

- [`@Lokesh1197`](https://github.com/lokesh1197) updated our relation CLI with the ability to define a `HasOne` relation via [PR #4171](https://github.com/strongloop/loopback-next/pull/4171). See [hasOne Relation](https://loopback.io/doc/en/lb4/hasOne-relation.html) and [Relation generator](https://loopback.io/doc/en/lb4/Relation-generator.html) for updated documentation.
- [`@achrinza`](https://github.com/achrinza) has made several small improvements/clarifications in our documentation.
- [`@dougal83`](https://github.com/dougal83) added the title property to filter schemas (filter, where, scope) in preparation for openapi schema consolidation. See [PR#4355](https://github.com/strongloop/loopback-next/pull/4355) for more details.

A big 'Thank you!' to all our contributors! :)

## Miscellaneous

- We improved the Transaction interface in loopback-connector by adding an `isActive()` method. This allows you to determine if the connection object on the transaction is present or not. Suppose you have a transaction instance called `tx`, you can call `tx.isActive()` to check the activeness of its connection without throwing an error (if an error happens). See [PR #4474](https://github.com/strongloop/loopback-next/pull/4474) and [PR #4537](https://github.com/strongloop/loopback-next/pull/4537), and [Using database transactions](https://loopback.io/doc/en/lb4/Using-database-transactions.html) for details.
- Updated Todo and TodoList Tutorials. The Todo and TodoList tutorials and examples are a great place to start learning about LoopBack 4. As our CLI prompts and generated artifacts have changed and improved over time, we recently started noticing that our documentation and code snippets were slightly out-of-date, and there was a bug as well. We decided it was time to update these fun tutorials and examples. [PR #4412](https://github.com/strongloop/loopback-next/pull/4412) addressed these issues. Please see [Todo tutorial](https://loopback.io/doc/en/lb4/todo-tutorial.html),[TodoList tutorial](https://loopback.io/doc/en/lb4/todo-list-tutorial.html), [Todo Example](https://github.com/strongloop/loopback-next/tree/master/examples/todo), and [TodoList Example](https://github.com/strongloop/loopback-next/tree/master/examples/todo-list) for the latest and greatest.
- Fixed problem where CLI commands generate artifacts with lint problems. See [PR #4431](https://github.com/strongloop/loopback-next/pull/4431) for details.
- Improved `@loopback/authorization`'s README.md document to include detailed steps of implementing a basic RBAC system. See [PR #4205](https://github.com/strongloop/loopback-next/pull/4405) for details.
- Updated `strong-docs`'s dependencies to use the latest TypeScript 3.7. See [PR #128](https://github.com/strongloop/strong-docs/pull/128) for details.
- Added alias support for header language 'zh-cn' and 'zh-tw' in `strong-globalize`. See [PR #151](https://github.com/strongloop/strong-globalize/pull/151) and [PR #153](https://github.com/strongloop/strong-globalize/pull/153) for details.
- Fixed problem with complex objects for query params in api explorer. See [PR#4347](https://github.com/strongloop/loopback-next/pull/4347) for details.

## What's Next?

If you're interested in what we're working on next, you can check out the [February Milestone](https://github.com/strongloop/loopback-next/issues/4543).

## Call to Action

In 2020, we look forward to helping you and seeing you around! LoopBack's success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Here's how you can join us and help the project:

- [Report issues](https://github.com/strongloop/loopback-next/issues).
- [Contribute](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md) code and documentation.
- [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Join](https://github.com/strongloop/loopback-next/issues/110) our user group.
