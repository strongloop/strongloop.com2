---
layout: post
title: LoopBack 4 August 2019 Milestone Update
date: 2019-08-07
author: Janny Hou
permalink: /strongblog/august-2019-milestone/
categories:
  - Community
  - LoopBack
published: false
---

## Inclusion Resolver

From the [Inclusion of related models](https://github.com/strongloop/loopback-next/issues/1352) epic, we started to implement tasks related to the inclusion resolver. 

- We introduced the type `InclusionResolver` which users can use to fetch related models in [PR #3517](https://github.com/strongloop/loopback-next/pull/3517).
- We implemented `findByForeignKeys` and `includeRelatedModels` functions, which help build `resolvers` for relations and improve querying for the include filter. The `findByForeignKeys` method finds model instances that contain any of the provided foreign key values. You can see more details for `findByForeignKeys` in [PR #3473](https://github.com/strongloop/loopback-next/pull/3473). The `includeRelatedModels` function returns model instances that include related models that have a registered resolver. You can see more about this function in [PR #3517](https://github.com/strongloop/loopback-next/pull/3517).
- We improved `DefaultCrudRepository` to leverage `InclusionResolver` in [PR #3583](https://github.com/strongloop/loopback-next/pull/3583).
  - The `findById`, `find`, and `findOne` methods have been modified to to call `includeRelatedModels`.
  - `registerInclusionResolver` method has been added to register resolvers.
- Tests in repository package for relations have been refactored so that they can be tested against MySQL and MongoDB. This ensures our relations test suites work against real databases, along with the memory. Check [PR #3538](https://github.com/strongloop/loopback-next/pull/3538) for more details.

## Max Listeners

If multiple operations are executed by a connector before a connection is established with the database, these operation are queued up. If the number of queued operations exceeds [Node.js' default max listeners amount](https://nodejs.org/api/events.html#events_eventemitter_defaultmaxlisteners), it throws the following warning: `MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 connected listeners added. Use emitter.setMaxListeners() to increase limit`. We introduced a default value for the maximum number of emitters and now allow users to customize the number. In a LoopBack 3 application's `datasources.json`, you can change the number by setting the `maxOfflineRequests` property to your desired number. See [PR #1767](https://github.com/strongloop/loopback-datasource-juggler/pull/1767) and [PR #149](https://github.com/strongloop/loopback-connector/pull/149) for details.

## Authorization

This month the experimental version of `@loopback/authorization` is released by landing Raymond's [authorization feature PR](https://github.com/strongloop/loopback-next/pull/1205).

Before releasing the module, the authorization system is verified and tested by a [PoC PR](https://github.com/strongloop/loopback4-example-shopping/pull/231) in the shopping example. Developers can decorate their endpoints with `@authorize()`, and provide the authorization metadata like `scope`, `resource`, `voter` in the decorator. Then define or plugin their own authorizers which determine whether a user has access to the resource. This is similar to how the authentication strategies are provided in the authentication system.

`@loopback/authentication` and `@loopback/authorization` are combined in a way that the `authentication` module restores the user identity from a request, passes it as the current user to the `authorization` module which decides is the resource accessible by that user.

Since the two modules share the identity abstracts to describe the user(or application, device in the future), we extracted the user related binding keys and types into a separate module `@loopback/security`.

## Security

As mentioned in the previous section, the interface `UserProfile` and `AuthenticationBindings.CURRENT_USER` are moved into `@loopback/security`. This module contains the common types/interfaces for LoopBack 4 security including authentication and authorization.

In this package we defined interface `Principle` as the base type of all the identity models, like `UserProfile`, `Organization`, `Application`(the later two are still in build), it has a symbol field called `securityId`, which is used as the identity of a user/application/device.

## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Here's how you can join us and help the project:

- [Report issues](https://github.com/strongloop/loopback-next/issues).
- [Contribute](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md) code and documentation.
- [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Join](https://github.com/strongloop/loopback-next/issues/110) our user group.
