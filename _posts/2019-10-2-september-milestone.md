---
layout: post
title: LoopBack 4 September 2019 Milestone Update
date: 2019-10-02
author: Agnes Lin
permalink: /strongblog/september-2019-milestone/
categories:
  - Community
  - LoopBack
published: false
---

All the leaves are red and the flowers are fading away. In this season of fruitfulness, the LoopBack team accomplished the planned September milestone goals. Besides delivering code-related contributions, we also would like to address more issues from the GitHub community. The growing number of users comes with a growing number of issues! I believe that with the effort from our team and the contribution from the community, we are crafting LoopBack to a better framework.

Here are our main focuses from September:

- Enhancement of Authentication/Authorization
- Declarative Building of REST APIs
- Importing of LB3 Model JSON File To LB4 Model Class
- Inclusion Resolver in Relations

See the [September milestone](https://github.com/strongloop/loopback-next/issues/3653) for an overview of what we have worked on, and read on for more details.

<!--more-->

## Enhancing Authentication and Authorization

### Improving `@authenticate` and `@authorize` Decorators

In [PR #3691](https://github.com/strongloop/loopback-next/pull/3691), we implemented the default metadata for authentication. It allows us to have a default authentication enforcement for methods. We also improved the `@authenticate` decorator to configure a default authentication for all methods within a class. Now we can apply our default authentication metadata without adding the decorator `@authenticate` to every route.

Moreover, methods that don't require authentication can be skipped by adding `@authenticate.skip`. Similarly, authorization can be skipped with `@authorize.skip` annotation. Check [PR #3762](https://github.com/strongloop/loopback-next/pull/3762) for more details.

### Spike for Authentication in API Explorer

In [spike #267](https://github.com/strongloop/loopback4-example-shopping/pull/267) we tried enabling the authorization header setting from the API Explorer. Without this feature, users will have to test their endpoints outside the API Explorer to specify the header fields.

The `swagger-ui` module has its built-in "Authorize" component. It shows up in the API Explorer automatically when `components.securities` is added in the application's OpenAPI specification. In the spike PR, [a series of screenshots](https://github.com/strongloop/loopback4-example-shopping/blob/9e0bd5f63ee221a740f68a7af3019d6c8c1df972/README.md#authentication) demos how to interact with the "Authorize" dialog to set the authentication headers. You can either specify global security policies to be applied to all the APIs, or configure the policy per endpoint.

When merging the security schemas into the OpenAPI specification, we also realized the importance to make contributing partial OpenAPI specifications from extensions more flexible. As the next steps, we will document and explain the steps of enabling the "Authorize" component in the API Explorer, and also improve inferring security schemas from the authentication strategies.

### Spike for A More Flexible `UserProfile` Interface in `@loopback/authentication`

Interface `UserProfile` describes a minimum set of properties that represents an identity of a user. It is also a contract shared between the authentication and authorization modules. To make up the difference between a custom `User` model and `UserProfile`, we introduced a `UserService` interface with a converter function as a choice for users who want to organize the utilities for the `User` model into a service class.

In this spike, we worked on a more general solution that unifies the behavior across all modules. We picked the `@loopback/authentication-passport` to start the spike because that compared with custom authentication strategies, users have less control over the returned user when applying the passport adapter. The solution is, we define an interface `UserProfileFactory` which takes in an instance of the custom user and returns a user profile. And a corresponding key will also be created in `@loopback/authentication` for the sake of injection.
In the meantime, we also discovered that some user profile related refactor in `@loopback/authorization` is needed. You can find more details in the [PoC PR](https://github.com/strongloop/loopback-next/pull/3771)

Two follow-up stories are created: [Add user profile factory](https://github.com/strongloop/loopback-next/issues/3846) and [Refactor the authorization component](https://github.com/strongloop/loopback-next/issues/3845)

## Declarative Building of REST APIs

In LoopBack 3, it was very easy to get a fully-featured CRUD REST API with very little code: a model definition describing model properties + a model configuration specifying which datasource to use.

In September, we did some research into how to provide the same simplicity to LB4 users too and outlined the following implementation design:

1. A new package `@loopback/model-api-builder` will define the contract for plugins (extensions) contributing repository & controller builders.

2. A new booter `ModelApiBooter` will load all model-config files from `/model-endpoints/{model-name}.{api-flavour}-config.js`, find model API builder using Extension/ExtensionPoint pattern and delegate the remaining work to the plugin.

3. An official model-api-builder plugin that will build CRUD REST APIs using `DefaultCrudRepository` implementation. The plugin will be implemented inside the recently introduced package `@loopback/rest-crud`.

The proposed design will enable the following opportunities to extend and customize the default behavior of API endpoints:

- App developers will be able to create & bind a custom repository class, this will allow them, for example, to implement functionality similar to LB3 Operation Hooks.

- App developers will be able to implement their own api-builder plugins and replace the repository & controller builders provided by LB4 with their own logic.

- The model configuration schema will be extensible; individual plugins will be able to define additional model-endpoints options to further tweak the behavior of API endpoints.

You can find more details in the spike [PR #3617](https://github.com/strongloop/loopback-next/pull/3617) and track the implementation progress in [Epic #2036](https://github.com/strongloop/loopback-next/issues/2036).

## Importing LoopBack 3 Models

To further simplify the migration from LoopBack 3 to LoopBack 4, we implemented a new CLI command to import model definitions from LoopBack 3 applications. See [PR #3688](https://github.com/strongloop/loopback-next/pull/3688), [Importing models from LoopBack 3 projects](https://loopback.io//doc/en/lb4/Importing-LB3-models.html) in our documentations and stay tuned for an upcoming blog post announcement!

## Implementing Inclusion Resolvers for Relations

Last month, we introduced the concept of the `inclusion resolver` in relations, which helps to query data through an `include` filter. An inclusion resolver is a function that can fetch target models for a given list of source model instances.

Here is an example of the `HasMany` relation: querying customers' orders. A `Customer` has many `Order`s:

```ts
customerRepository.find({ include: [{ relation: "orders" }] });
```

will return all customer instances alone with their related orders:

```ts
[
  {
    customerName: "Thor",
    id: 1,
    orders: [
      { desc: "Mjolnir", customerId: 1 },
      { desc: "Rocket Raccoon", customerId: 1 }
    ]
  },
  {
    customerName: "Captain",
    id: 2,
    orders: [{ desc: "Shield", customerId: 2 }]
  }
];
```

We accomplished finishing the implementation of `inclusion resolver` for `HasMany`, `BelongsTo`, and `HasOne` relations. The `inclusionResolver` property is now available for these three relations.

For more details on how to use the resolvers, please check the LoopBack 4 [Relation](https://loopback.io/doc/en/lb4/Relations.html) page or try out the `todo-list` example (by using `lb4 example todo-list`).

For implementation details, please check pull requests of inclusion resolver tasks and its helpers:

- `HasMany` inclusion resolver implementation [PR #3595](https://github.com/strongloop/loopback-next/pull/3595)
- `BelongsTo` inclusion resolver implementation [PR #3721](https://github.com/strongloop/loopback-next/pull/3721)
- `HasOne` inclusion resolver implementation [PR #3764](https://github.com/strongloop/loopback-next/pull/3764)
- Update `todo-list` example to use inclusion resolver [PR #3450](https://github.com/strongloop/loopback-next/issues/3450)
- Add `keyFrom` to resolved relation metadata [PR #3726](https://github.com/strongloop/loopback-next/pull/3726)
- Implement helpers for inclusion resolver [PR #3727](https://github.com/strongloop/loopback-next/pull/3727)

## Other Changes

### Allowing Recursive Model

[PR #3674](https://github.com/strongloop/loopback-next/pull/3674) and [PR #3722](https://github.com/strongloop/loopback-next/pull/3722) allow us to define recursive models. For example:

```ts
@model()
class ReportState extends Model {
  @property.array(ReportState, {})
  states: ReportState[];

  @property({
    type: "string"
  })
  benchmarkId?: string;

  constructor(data?: Partial<ReportState>) {
    super(data);
  }
}
```

where the JsonSchema of the `ReportState` model is

```ts
{
  states: {
    type: 'array',
    items: {$ref: '#/definitions/ReportState'},
  },
  benchmarkId: {type: 'string'},
}
```

### CI Failures Fixing

The CI failures in the [Oracle connector](https://github.com/strongloop/loopback-connector-oracle) have been fixed. In a related note, [a new issue](https://github.com/strongloop/loopback-connector-oracle/issues/190) has been opened to make the local tests (`npm test`) pass.

### Database Migration

Previously, `npm run migrate` would exclude LoopBack 3 models mounted in a LoopBack 4 app. Now it successfully migrates LoopBack 3 models as well. Check [PR #3779](https://github.com/strongloop/loopback-next/pull/3779) for more details.

## New Features On The Way

### Deploying the Shopping Application as a Kubernetes Cluster

Through the work in progress [PR #268](https://github.com/strongloop/loopback4-example-shopping/pull/268), by decomposing shopping example into multiple microservices and packaging them as docker images, we will be able to deploy a composite application. In addition, this feature would also show the posibility of communicating between microservices using REST and/or gRPC in such LB4 applications.

### Adding Metrics Integration with `Prometheus`

In another work in progress [PR #3339](https://github.com/strongloop/loopback-next/pull/3339), we are working on an experimental functionality. The new `@loopback/extension-metrics` package would allow users to report metrics of Node.js, LoopBack framework, and their application to `Prometheus`. This feature will be shown as an example in the new package `@loopback/example-metrics-prometheus`.

## Community Contribution

We have many community users contributing to LoopBack. In September, 14% of the merged PRs was coming from community contribution! From refactoring functionality to enhancing documentation, we really appreciate all these contributions. Here are some highlights of community contributions from this month:

### Allowing `rest-explorer` to Use a Relative URL for the OpenAPI Specification

The community user [@mgabeler-lee-6rs](https://github.com/mgabeler-lee-6rs) implemented a new feature that allows API Explorer to self-host the OpenAPI spec document and thus use a relative path in `swagger-ui` configuration. Before this change, the LoopBack configured UI component with an absolute path that did not work well when the application was running behind a reverse proxy link `nginx`. The API Explorer now works more reliably. Check [PR #3133](https://github.com/strongloop/loopback-next/pull/3133) for more implementation details and discussions over the feature.

### Updating OpenAPI Schemas for Azure Validation

In [PR #3504](https://github.com/strongloop/loopback-next/pull/3504) from community user [@ericzon](https://github.com/ericzon), they changed the formatting of the OpenAPI Schema, which allows it to now pass Azure API Manager validation. We can now deploy an API as "App Service" and connect it with the API Manager as OpenAPI. It enables LB4 to work out-of-the-box on Microsoft Azure.

### Contributions from Community User [@derdeka](https://github.com/derdeka)

[@derdeka](https://github.com/derdeka) is one of our most active users and contributors. [@derdeka](https://github.com/derdeka) shared their ideas and suggestions in many pull requests with us, especially in the `Authentication` area. Here are some of their contributions:

- [@derdeka](https://github.com/derdeka)'s [PR #3649](https://github.com/strongloop/loopback-next/pull/3649) allowed the `AuthenticationStrategyProvider` class to be extended.
- In [PR #3623](https://github.com/strongloop/loopback-next/pull/3623), [@derdeka](https://github.com/derdeka) improved the booter for importing a LB3 app to LB4. With the change, it processes the generated OpenAPI specifications correctly when mouting a LB3 app to LB4.

If you would like to contribute to LoopBack, please check the [Call to Action](#Call-to-Action) section below!

## Looking for User References

As a LoopBack user, do you want your company to be highlighted on our [web site](https://loopback.io/)? If your answer is yes, see the details in this [GitHub issue](https://github.com/strongloop/loopback-next/issues/3047).

## What's Next?

If you're interested in what we're working on next, you can check out the [October milestone](https://github.com/strongloop/loopback-next/issues/3801).

## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Here's how you can join us and help the project:

- [Report issues](https://github.com/strongloop/loopback-next/issues).
- [Contribute](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md) code and documentation.
- [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Join](https://github.com/strongloop/loopback-next/issues/110) our user group.
