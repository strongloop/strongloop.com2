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

The last month in summer started with an exiting news that [LoopBack won the "Best in API Middleware award"](https://strongloop.com/strongblog/loopback-2019-api-award-api-middleware/)🎉, which is a great recognition of our team's achievement and effort. A highlight of what's been done in August: The implementation of  `InclusionResolver` has made a significant progress in the Inclusion epic. A new epic to simplify building REST APIs is started with some pre-work and spike. We contributed a LoopBack stack for Kabanero/Appsody to enable cloud native development experience. The first version of `@loopback/authorization` was released for users to try.

You can read more to learn the new features in details.

<!--more-->

## Inclusion Resolver

To deliver [Inclusion of related models](https://github.com/strongloop/loopback-next/issues/1352) epic, we started to implement tasks related to the inclusion resolver. 

- We introduced the type `InclusionResolver` which users can use to fetch related models in [PR #3517](https://github.com/strongloop/loopback-next/pull/3517).
- We implemented `findByForeignKeys` and `includeRelatedModels` functions, which help build `resolvers` for relations and improve querying for the include filter. The `findByForeignKeys` method finds model instances that contain any of the provided foreign key values. You can see more details for `findByForeignKeys` in [PR #3473](https://github.com/strongloop/loopback-next/pull/3473). The `includeRelatedModels` function returns model instances that include related models that have a registered resolver. You can see more about this function in [PR #3517](https://github.com/strongloop/loopback-next/pull/3517).
- We improved `DefaultCrudRepository` to leverage `InclusionResolver` in [PR #3583](https://github.com/strongloop/loopback-next/pull/3583).
  - The `findById`, `find`, and `findOne` methods have been modified to to call `includeRelatedModels`.
  - `registerInclusionResolver` method has been added to register resolvers.
- Tests in repository package for relations have been refactored so that they can be tested against MySQL and MongoDB. This ensures our relations test suites work against real databases, along with the memory. Check [PR #3538](https://github.com/strongloop/loopback-next/pull/3538) for more details.

## Authorization

### Experimental release

This month the experimental version of [`@loopback/authorization`](https://github.com/strongloop/loopback-next/tree/master/packages/authorization) is released by landing Raymond's [authorization feature PR](https://github.com/strongloop/loopback-next/pull/1205).

The authorization system is verified and tested by a [PoC PR](https://github.com/strongloop/loopback4-example-shopping/pull/231) in the shopping example. Developers can decorate their endpoints with `@authorize()`, and provide the authorization metadata like `scope`, `resource`, `voter` in the decorator. Then define or plugin their own authorizers which determine whether a user has access to the resource. This is similar to how the authentication strategies are provided in the authentication system.

`@loopback/authentication` and `@loopback/authorization` are combined in a way that the `authentication` module establishes the user identity from a request, passes it as the current user to the `authorization` module which decides is the resource accessible by that user.

Since the two modules share the identity abstracts to describe the user(or application, device in the future), we extracted the user related binding keys and types into a separate module `@loopback/security`.

### Configure the Decision logic for Voters

After the initial release of `@loopback/authorization`, we received community feedback regarding more flexible decision logic for the voters/authorizers. Raymond introduced two options to configure the decision maker:

- `precedence`: Controls if Allow/Deny vote takes precedence and override other votes. If not set, default to `AuthorizationDecision.DENY`. Once a vote matches the `precedence`, it becomes the final decision. The rest of votes will be skipped.

- `defaultDecision`: Default decision if all authorizers vote for `ABSTAIN`. If not set, default to `AuthorizationDecision.DENY`.

For details of how the final decision is made, you can check the [Decision matrix](https://github.com/strongloop/loopback-next/blob/master/packages/authorization/README.md#decision-matrix).

## New Common Layer for Authorization and Authentication

As mentioned in the previous section, the interface `UserProfile` and `AuthenticationBindings.CURRENT_USER` are moved into a new module called [`@loopback/security`](https://github.com/strongloop/loopback-next/tree/master/packages/security). This module contains the common types/interfaces for LoopBack 4 security including authentication and authorization.

In this package we defined interface `Principle` as the base type of all the identity models, like `UserProfile`, `Organization`, `Application`(the later two are still in build), it has a symbol field called `securityId`, which is used as the identity of a user/application/device.

## From model definition to REST API with no custom classes

This month we started to work on the Epic that will simplify building REST APIs in LoopBack 4.

Quoting from https://github.com/strongloop/loopback-next/issues/2036:

> In LoopBack 3, it was very easy to get a fully-featured CRUD REST API with very little code: a model definition describing model properties + a model configuration specifying which datasource to use.
> 
> Let's provide the same simplicity to LB4 users too.
> 
> - User creates a model class and uses decorators to define model properties. (No change here.)
> - User declaratively defines what kind of data-access patterns to provide (CRUD, KeyValue, etc.) and what datasource to use under the hood.
> - `@loopback/boot` processes this configuration and registers appropriate repositories & controllers with the app.

The first step was to build a new component that will provide the default CRUD REST operations. The [PR#3582](https://github.com/strongloop/loopback-next/pull/3582) introduces a new package `@loopback/rest-crud` that can be already used today as an alternative solution to `lb4 controller`.

In the next step, we needed to research the best design for model configuration and booter implementation. The [PR#3617](https://github.com/strongloop/loopback-next/pull/3617) offers a proof-of-concept prototype demonstrating the proposed design. We are excited about the extensibility of the proposed approach, as it will make it very easy for 3rd-party developers (including application developers) to implement their own flavor of Repository and Controller classes to be used with the new Model API booter.

## LoopBack Stack for Appsody

[Appsody](https://appsody.dev/) is an open source project that makes creating cloud native applications simple. It provides application stacks for open source runtimes and frameworks, which are pre-configured with cloud native capabilities for Kubernetes and Knative deployments. 

This month, LoopBack has been added as one of the application stacks in Appsody to provide a powerful solution to build open APIs and Microservices in TypeScript. You can try its image in [stack Node.js-LoopBack](https://github.com/appsody/stacks/tree/master/incubator/nodejs-loopback)

## AJV Keywords Support

In [PR#3539](https://github.com/strongloop/loopback-next/pull/3539) we added validator [`ajv-keywords`](https://github.com/epoberezkin/ajv-keywords) to validate the incoming request data according to its corresponding OpenAPI schema. Now you can specify `ajvKeywords` as `true` or an array of AJV validation keywords in the validation options. See examples:

```ts
app = new RestApplication({rest: givenHttpServerConfig()});
app
  .bind(RestBindings.REQUEST_BODY_PARSER_OPTIONS)
  .to({validation: {ajvKeywords: true}});
```

or

```ts
app = new RestApplication({rest: givenHttpServerConfig()});
app
  .bind(RestBindings.REQUEST_BODY_PARSER_OPTIONS)
  .to({validation: {ajvKeywords: ['range']}});
```

## Max Listeners

If multiple operations are executed by a connector before a connection is established with the database, these operation are queued up. If the number of queued operations exceeds [Node.js' default max listeners amount](https://nodejs.org/api/events.html#events_eventemitter_defaultmaxlisteners), it throws the following warning: `MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 connected listeners added. Use emitter.setMaxListeners() to increase limit`. We introduced a default value for the maximum number of emitters and now allow users to customize the number. In a LoopBack 3 application's `datasources.json`, you can change the number by setting the `maxOfflineRequests` property to your desired number. See [PR #1767](https://github.com/strongloop/loopback-datasource-juggler/pull/1767) and [PR #149](https://github.com/strongloop/loopback-connector/pull/149) for details.

## Binding Improvement

In [PR#3618](https://github.com/strongloop/loopback-next/pull/3618) we added support for applying multiple `@bind()` decorators on the same class. Now you can decorator your class like:

```ts
@bind({scope: BindingScope.TRANSIENT})
@bind({tags: {name: 'my-controller'}})
export class MyController {
  // Your controller members
}
```

## Documentation Improvements

The architecture diagrams are added for concepts [Binding](https://loopback.io/doc/en/lb4/Binding.html), [Component](https://loopback.io/doc/en/lb4/Components.html), [Context](https://loopback.io/doc/en/lb4/Context.html), [IoC Container](https://loopback.io/doc/en/lb4/Context.html#why-is-it-important), and [Context Hierarchy](https://loopback.io/doc/en/lb4/Context.html#request-level-context-request).

We also reorganized the documentation so that it's easier for users to understand, including:

* Adding diagram on how each key concepts relate to each other.
* Reordering the sidebar items under the key concepts section.

## Farewell and Welcome

As the summer ends, [Nora](https://strongloop.com/authors/Nora_Abdelgadir/) has completed her 12-month internship in the LoopBack team. Thank you for her dedication and hard work! She has been making good progress in the [inclusion of related models story](https://github.com/strongloop/loopback-next/issues/1352) in this month! We wish her best wishes at school. While she has returned to school, Nora will still be maintaining LoopBack on a part-time basis.

On the other hand, we're excited to have [Deepak](https://github.com/deepakrkris) back to the team. Bringing his knowledge and experience in cloud and container related technologies, it would be a great addition to us. Welcome Deepak!

## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Here's how you can join us and help the project:

- [Report issues](https://github.com/strongloop/loopback-next/issues).
- [Contribute](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md) code and documentation.
- [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Join](https://github.com/strongloop/loopback-next/issues/110) our user group.
