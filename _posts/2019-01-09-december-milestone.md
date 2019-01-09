---
layout: post
title: LoopBack 4 December 2018 Milestone Update
date: 2019-01-09
author: Janny Hou
permalink: /strongblog/december-2018-milestone/
categories:
  - Community
  - LoopBack
published: false
---

Happy New Year! We hope everyone had a wonderful holiday and warmly welcomed 2019. This past December was a short month due to the vacation days, but we were still able to complete several fixes and take off in our next focused epics like authentication and building a JavaScript LoopBack 4 application. You can read more about our progress below.

<!--more-->
<img src="https://strongloop.com/blog-assets/2019/01/LoopBack-4-December-2018-Milestone-Update.png" alt="LoopBack 4 December 2018 Milestone Update" style="width: 450px"/>

## Community Contribution

In December we received several document updates and code refactor PRs to improve our code base and user experience. Our LoopBack team appreciates all the contributions that community members have made through the past year. We look forward to continually improving LoopBack 4 with you in the new year! Thank you for participating in the new era of LoopBack.

## Authentication and Authorization

For the first refactoring task of the authentication component, we started by implementing a JWT strategy in the shopping example. We did this to discover the common abstractions among different authentication strategies, and to explore ways of defining the default LoopBack 4 User model integrated with authorization methods like login and logout.

During the implementation, we found some twisted concepts that could confuse people in terms of how each layer's metadata are injected and the mechanism of how the authentication component works. We created a diagram depicting the dependency relations and functionality of each concept to guide community contributors. You can find it in this [comment](https://github.com/strongloop/loopback-next/issues/1997#issuecomment-450998083).

We were able to write a PoC PR with the following elements:

* A JWT strategy that verifies a request's permission by the authentication metadata from its header
* A custom strategy resolver which returns the JWT strategy
* An AccessToken model that has a one-to-many relation to the User model
* A sign in endpoint in the User controller that finds a user and creates the JWT access token

The PR is still in progress. We will summarize the required elements and the steps to create them in the document when it's done. Our next focus would be extracting the pieces in the PoC PR into proper modules, including our existing `@loopback/authentication` package or a new created extension package. You can check story [#1997](https://github.com/strongloop/loopback-next/issues/1997) to track the discussions.

## Relation Epic

### Support hasOne relation

With the `hasMany` relation feature in place and with a lot of request from our community, it made logical sense to implement `hasOne` relation next. The first iteration [1879](https://github.com/strongloop/loopback-next/pull/1879) involved an acceptance test to drive the feature with tests for `create` and `get` or `find` methods. However, it was using a race-condition prone approach in order to guarantee that a single related model instance was created for a source instance. The code called the `find()` and `create()` methods on the target repository which can lead to multiple target instances based on the asynchronous nature of those methods (see [this comment](https://github.com/strongloop/loopback-next/pull/1879#discussion_r227363386) for a clear example). 

In order to address this issue, [Miroslav](https://github.com/bajtos) proposed using the target model's Primary Key as the Foreign Key from the source model and let the underlying database enforce uniqueness. With it came `belongsToUniquely()` decorator which is used as part of the target model definition to mark a property as a non-generated `id` field for use with `hasOne` relation. After making sure it works with in-memory and MySQL databases, we concluded that it was universal enough and made sense to delegate uniqueness enforcement at the database level and landed the PR. 

However, [Raymond](https://github.com/raymondfeng) pointed out that this approach does not indeed enforce uniqueness across all supported connectors. Instead, he proposed to mark the foreign key as a unique index. While [Biniam](https://github.com/b-admike) started the implementation in [2126](https://github.com/strongloop/loopback-next/pull/2126), he discovered that some connectors like `in-memory` and `cloudant` do not have support for `unique indexes`. Raymond, Miroslav, and Biniam discussed HasOne's unique constraint for the foreign key and discovered a new way of looking at relations and constraints:

* Weak relations, where the developer primarily wants to navigate related models (think of GraphQL) and referential integrity is either not important or already enforced by the (SQL) database.
 
* Strong relations, where the referential integrity is guaranteed by the framework together with the database.
 
Given this and the fact that we don't have a concrete way to enforce referential integrity in LoopBack from the approaches taken thus far, [#2126](https://github.com/strongloop/loopback-next/pull/2126) was put on hold and [2147](https://github.com/strongloop/loopback-next/pull/2147) aimed to remove the implementation which used target model's PK as the FK for a `hasOne` relation. The onus is now on users to make sure that referential integrity is enforced by the database they're using by defining a unique index as shown in our [docs](https://loopback.io/doc/en/lb4/hasOne-relation.html#setting-up-your-database-for-hasone-relation---mysql). For more discussion, see [2127](https://github.com/strongloop/loopback-next/issues/2127) and [1718](https://github.com/strongloop/loopback-next/issues/1718).

### Inclusion Spike

To explore a good approach for doing the inclusion traverse, we did a spike that implemented an inclusion handler as a function to fetch the included items. When a one to many relation is established, the repository of the source model registers the inclusion handler, which takes in the target model's repository getter, applies constraints and invoke the target repository's `find` method with the inclusion filter.

This works well for `hasMany` relation but exposes more high level design problems when implementing the `belongsTo` inclusion handler. The [circular dependency restriction](https://github.com/strongloop/loopback-next/issues/1799) results in two models could not define each other as a property in the model class. Therefore the `belongsTo` relation only has a foreignKey id property but not a relation property in the source model, and as a consequence, the source model couldn't really describe the data included from its parent.

Here is a summary of the things we could re-design and improve:

* The Filter interface is not designed to describe related entities
* The relation(inclusion) property shouldn't be part of the model class
* We need a new design to resolve and describe the inclusion property

The discussion is tracked in [story 2152](https://github.com/strongloop/loopback-next/issues/2152).

## Documents

### Contribution Guide

To make users more easier to contribute the code, we cleaned up the [Reporting issues](https://loopback.io/doc/en/contrib/Reporting-issues.html) page with a more detailed guide of reporting in appropriate channels, and updated the instructions of filing Loopback 2/3 and Loopback 4 bugs separately.

### API Documents

We fixed the `AuthenticationBindings` and `StrategyAdapter`'s API document in the authentication module.

## Extensible Request Body Parsing Blog

The API client sends an HTTP request with `Content-Type` header to indicate the media type of the request body. Now we added 6 built-in body parsers for different content types and also allow users to register custom body parser as extensions by implementing the `BodyParser` interface and bind it to the application.

To know more about the details, you can read the blog [The journey to extensible request body parsing](https://strongloop.com/strongblog/the-journey-to-extensible-request-body-parsing)

## Write Loopback 4 App in JavaScript

We are working on a JavaScript abstraction for LoopBack 4. Using this, JavaScript developers will be able to develop LoopBack 4 applications without having to use TypeScript. You can preview an app using the progress we have made so far at https://github.com/strongloop/loopback4-example-javascript.

The next step is to further optimize the abstraction and make it as seamless as possible.

## OpenAPI Specifications

### Base Path

We enabled adding the base path of the REST server by calling the app method `app.basePath('/abasepath')` or server method `server.basePath('/abasepath')`. The base path can be provided in the configuration too:

```ts
 const app = new RestApplication({
   rest: {
     basePath: '/api',
   },
 });
 ```

### Models for Anonymous Schema

Previously when creating LoopBack 4 artifacts by `lb4 openapi`, the controller class used inline TypeScript type literals to describe the object/array parameters for anonymous schemas. Therefore we introduced a flag called `--promote-anonymous-schemas` to generate separate model classes/types for them. A good use case for turning on the flag would be generating models for the anonymous objects that describe a POST/PATCH operation's responses. For a more detailed usage of the flag and the conventions of the created LoopBack 4 model, please check [the documentation of OpenAPI generator](https://loopback.io/doc/en/lb4/OpenAPI-generator.html)

## Context Improvement

To avoid duplicating the binding configuration every time the users are applying the same attributes such as tags and scope, we allow applying a template function to a binding in the following way:

```ts

export const serverTemplate = (binding: Binding) =>
  binding.inScope(BindingScope.SINGLETON).tag('server');

const serverBinding = new Binding<RestServer>('servers.RestServer1');
serverBinding.apply(serverTemplate);
```

We also polished the binding related documentation and extracted them into a standalone page [Binding](https://loopback.io/doc/en/lb4/Binding.html)

## Tslint Configurations

The built-in `no-unused-variable` rule raised many issues like conflicts with other rules and it's also been deprecated. As a solution, we are replacing it with another configuration property `no-unused`. This causes a possible breaking change and therefore a new standalone package `@loopback/tslint-config` is created to separate the major version bump for changing the tslint configurations from `@loopback/build`. You can check [PR#2159](https://github.com/strongloop/loopback-next/pull/2159) for details.

## LoopBack 3 Support

Since LB2 will reach its end of line by April 2019, we're searching through the modules in the StrongLoop organization and updating LoopBack dependencies from version to 2 to version 3. We updated `loopback-workspace` from a LoopBack 2 application to LoopBack 3 application without changing any behaviours of its APIs. As part of the update, the `WorkspaceEntity` and `Definition` models were removed from the model configuration file, as they are not meant to be accessed directly and they are not attached to a datasource. Finally, the application has been updated to use Node 6+ and the application's dependencies have also been updated to their latest versions.

You can find out more in our [LTS schedule](https://loopback.io/doc/en/contrib/Long-term-support.html).

## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Reporting issues](https://github.com/strongloop/loopback-next/issues).
- [Contributing](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md)
  code and documentation.
- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Joining](https://github.com/strongloop/loopback-next/issues/110) our user group.
