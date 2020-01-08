---
layout: post
title: LoopBack 4 December 2019 Milestone Update
date: 2020-01-08
author: Agnes Lin
permalink: /strongblog/december-2019-milestone/
categories:
  - Community
  - LoopBack
published: true
---
It's 2️⃣0️⃣2️⃣0️⃣!

Happy New Year! Is the snow dancing outside of your window or is the sunshine bringing warmth and glow to the grass around you? No matter where you are, the LoopBack team is thankful for you being with us through 2019! It means a lot to us that you choose LoopBack for your applications and projects.

We're also excited to have [Denny](https://github.com/derdeka), [Douglas](https://github.com/dougal83), and [Rifa](https://github.com/achrinza) as LoopBack maintainers! They've been actively helpful in our community. We appreciate all the contributions and great work. Welcome to the team!

Even though this past December was a short month due to the holidays, the list of the accomplished tasks is not short! Check out the sections below for the progress we made in each area:

- [From Model Definition to REST API](#from-model-definition-to-rest-api): build a LB4 app with just models!
- [Inclusion of Related Models](#inclusion-of-related-models): enable custom scope for inclusion.
- [Authentication](#authentication): new added user profile factory and StrategyAdapter.
- [@loopback/context Improvement](#allowing-interceptor-to-be-invoked-based-on-the-source): invoke interceptors based on their callers.
- [Application Life Cycle](#improving-application-life-cycle-states): application states and the shutdown hooks.
- [OpenAPI Enhancer Service](#openapi-enhancer-service): contribute OpenAPI spec pieces from extensions.
- [Improving Juggler and Connectors](#improving-juggler-and-connectors): new property settings.
- [New ESLint Rules](#new-eslint-rules): applied new `@typescript-eslint` rules.
- [Documentation Improvement](#documentation-improvement)

<!--more-->

## From Model Definition to REST API

Initially, LoopBack 4 required all artifacts (Model, Repository, and Controller classes) to be defined in TypeScript source files. Recently, we started to work on a declarative approach, where the Repository and Controller classes can be created dynamically at runtime (see [`@loopback/rest-crud`](https://github.com/strongloop/loopback-next/tree/master/packages/rest-crud) package).

### Discovering Models and Building REST APIs at Runtime

This month, we pushed this concept one step further and implemented a proof of concept showing how to dynamically build CRUD REST API for any SQL database table:

1. Discover model definition from a database, build `ModelDefinition` object from the discovered schema
2. Define a model class from a `ModelDefinition` object
3. Define a CRUD repository class for the given model
4. Define a CRUD REST API controller class for the given model & repository

The demo application can be found in the pull request [loopback-next #4235](https://github.com/strongloop/loopback-next/pull/4235).

To make this scenario possible, we needed to make few improvements:

- [loopback-datasource-juggler #1807](https://github.com/strongloop/loopback-datasource-juggler/pull/1807) fixes TypeScript typings in `loopback-datasource-juggler` to make DataSource APIs like `discoverSchema` easier to consume using `await` keyword.
- [loopback-next #4266](https://github.com/strongloop/loopback-next/pull/4266) adds a new API `defineModelClass` that builds a Model class constructor using the given base model (e.g. `Entity`) and the given `ModelDefinition`.

As part of the experiment, we have again encountered the limitation of our REST layer when controllers registered after startup are not picked up. This feature is discussed in [loopback-next #433](https://github.com/strongloop/loopback-next/issues/433). Feel free to chime in and perhaps contribute a pull request if this use case is important for your projects.

### Model API Builder Package

We introduced a new package `@loopback/model-api-builder` for building APIs from models. This package allows users to build repositories and controllers based on their models through their defined extensions. We also added `ModelApiBooter` that leverages Model API builders contributed via `ExtensionPoint`/`Extension` to implement the actual API building. See [README](https://github.com/strongloop/loopback-next/tree/master/packages/model-api-builder) file for details.

## Inclusion of Related Models

We managed to finish the Inclusion of Related Models [MVP](https://github.com/strongloop/loopback-next/issues/1352) in 2019! Check out the [Post MVP](https://github.com/strongloop/loopback-next/issues/3585) if you'd like to contribute.

### Enabling inclusion with custom scope

Traversing data through different relations is a common use case in real world. Take a nested relation as an example, a `Customer` might be interested in the `Shipment` status of their `Order`:

```ts
Customer: {
  name: 'where\'s my order at'
  orders: [
    {
      name: 'order 1',
      shipment: {
        shipment_id: 123
      }
    },
    {
      name: 'order 2',
      shipment: {
        shipment_id: 999
      }
    }
  ]
}
```

In [PR #4263](https://github.com/strongloop/loopback-next/pull/4263), we enabled such traversal by allowing users to customize the `scope` field for their query filter. The above example can be achieved by the following query:

```ts
customerRepo.find({
  include: [
    {
      relation: 'orders',
      scope: {
        include: [{relation: 'shipment'}],
      },
    },
  ],
});
```

More use cases and examples are added to the page [Query Multiple Relations](https://loopback.io/doc/en/lb4/HasMany-relation.html#query-multiple-relations).

### Handling navigational properties with CRUD operations

It's convenient to traverse related models with relations. However, when it comes to operations such as creation and updating, navigational properties might cause some unexpected problems. In [PR #4148](https://github.com/strongloop/loopback-next/pull/4148), we decided to reject CRUD operations that contain any navigational properties. For example, the request to create a `Customer` with its `Address` will be rejected:

```ts
customerRepo.create({
  name: 'customer',
  address: [
    {
      street: 'nav property',
      city: 'should not be included',
    },
  ],
});
```

## Authentication

### User Profile Factory Interface

We've added a _convenience_ function interface named [`UserProfileFactory<U>`](https://github.com/strongloop/loopback-next/blob/0630194539ba7971ca6c6579ebb9d986e6340a41/packages/authentication/src/types.ts#L34-L36) to `@loopback/authentication`. Implement this interface with your own custom user profile factory function to convert your specific user model into a [UserProfile](https://github.com/strongloop/loopback-next/blob/9e40e43bd1c9fe71155087341b0fc590ee9d67e3/packages/security/src/types.ts#L37-L42) model (used by both `@loopback/authentication` and `@loopback/authorization`).

### StrategyAdapter Improvements

The `StrategyAdapter` in `@loopback/authentication-passport` now takes in an additional argument `userProfileFactory` in its constructor. This argument is initialized with a default implementation of the `UserProfileFactory<U>` interface, mentioned above, and simply returns your specific user model as a user profile model. It is recommended that you implement your own user profile factory function to map a specific/minimal set of properties from your custom user model to the user profile model. Please see the [updated documentation](https://github.com/strongloop/loopback-next/tree/master/extensions/authentication-passport) for more details.

## Allowing Interceptor to Be Invoked Based on the Source

Some interceptors want to check the caller to decide if its logic should be applied. For example, an http access logger only cares about invocations from the rest layer to the first controller. In [PR #4168](https://github.com/strongloop/loopback-next/pull/4168), we added an option `source`, which can check the caller that invokes a method with interceptors. Check out the [Interceptors page](https://loopback.io/doc/en/lb4/Interceptors.html#source-for-an-invocation) for relative documentation and examples.

## Improving Application Life Cycle States

It’s often desirable for various types of artifacts to participate in the life cycles and perform related operations. In [PR #4145](https://github.com/strongloop/loopback-next/pull/4145), we improved the the check for application states and also add the shutdown hooks which allows graceful shutdown when the application is running inside a managed container such as Kubernetes Pods. Please check the related documentation and examples on the site [Life cycle events and observers](https://loopback.io/doc/en/lb4/Life-cycle.html#application-states) to help you understand more about the LoopBack 4 application life cycle.

## OpenAPI Enhancer Service

We've added a new extension point `OASEnhancerService` to allow the OpenAPI specification (short for OAS) contributions to a rest application. The feature originated from the need to add security schemes and policies to a LoopBack application's OAS. Now you can modify your application's OAS by creating and registering OAS enhancers.

A typical OAS enhancer implements interface `OASEnhancer` which has a string type `name` field and a function `modifySpec()`. For example, to modify the `info` field of an OAS, you can create an `InfoSpecEnhancer` as follows:

```ts
import {bind} from '@loopback/core';
import {
  mergeOpenAPISpec,
  asSpecEnhancer,
  OASEnhancer,
  OpenApiSpec,
} from '@loopback/openapi-v3';

@bind(asSpecEnhancer)
export class InfoSpecEnhancer implements OASEnhancer {
  // give your enhancer a proper name
  name = 'info';
  // the function to modify your OpenAPI specification and return a new one
  modifySpec(spec: OpenApiSpec): OpenApiSpec {
    const InfoPatchSpec = {
      info: {title: 'LoopBack Test Application', version: '1.0.1'},
    };
    const mergedSpec = mergeOpenAPISpec(spec, InfoPatchSpec);
    return mergedSpec;
  }
}
```

Then bind it to your application by `this.add(createBindingFromClass(InfoSpecEnhancer))`.

The OAS enhancer service organizes all the registered enhancers, and is able to apply one or all of them. You can check ["Extending OpenAPI specification"](https://loopback.io/doc/en/lb4/Extending-OpenAPI-specification.html) documentation to learn more about creating and registering OAS enhancers, adding OAS enhancer service and applying its enhancers.

We will allow users to have token-based authentication in API Explorer in the near future. Please check our future milestone blogs.

## Improving Juggler and Connectors

### Improving Performance - persistDefaultValues Model Property Setting

We have added a new model-property property `persistDefaultValues`, which prevents a property value that matches the default from being written to the database when it set to `false`.

This is particularly useful when you have a model with a lot of properties or sub-properties whose values may be the default value, and these models run into thousands or maybe millions. Setting `persistDefaultValues` to `false` can drastically reduce the write time and size of the database. This setting is applicable to LB4 and LB3. Check the document on our site: [Property](https://loopback.io/doc/en/lb3/Model-definition-JSON-file.html#general-property-properties).

### Allowing String Type Attribute to Be Auto-generated in PostgreSQL

[Auto-migration](https://loopback.io/doc/en/lb4/Database-migrations.html) is a convenient tool to help you create relational database schemas based on definitions of your models. Typically, auto-migration would use the database's _default type_ as the primary key type. For example, the default type of MySQL is integer, and the default type of MongoDB is string. We've added a field `useDefaultIdType` before that allows you to use other types than the default type when doing auto-migration. For example, for MySQL, the following setting allows you to have a string type primary key in tables:

```ts
@property({
  type: 'string',
  id: true,
  useDefaultIdType: false,
  // generated: true -> can not be set
})
id: string;
```

However, sometimes users want to have auto-generate primary key with non-default type. For instance, a common use case is having `uuid` as the primary key in MySQL or PostgreSQL. We enable the auto-generated `uuid` with auto-migration for PostgreSQL. In short, the following setting enables auto-generated `uuid`:

```ts
@property({
  id: true,
  type: 'string',
  generated: true,
  useDefaultIdType: false, // this is needed if this property is id
  postgresql: {
    dataType: 'uuid',
  },
})
id: String;
```

By default, when the user wants to auto-generate string type properties in PostgreSQL, we use `uuid` and the function `uuid_generate_v4()`. It is possible to use other extensions and functions. Please check on the site for more details: [PostgreSQL connector](https://loopback.io/doc/en/lb3/PostgreSQL-connector.html#discovery-and-auto-migration).

This feature will be added to MySQL in the near future.

## New ESLint Rules

We have enabled several new `@typescript-eslint` rules to detect more kinds of potential programming errors. These new rules will trigger a semver-major release of the package `@loopback/eslint-config`. Be prepared to handle new violations after upgrading.

List of new checks:

- [`return-await`](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/return-await.md)
- [`no-extra-non-null-assertion`](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-extra-non-null-assertion.md)
- [`prefer-nullish-coalescing`](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-nullish-coalescing.md)
- [`prefer-optional-chain`](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-optional-chain.md)

As part of this effort, we migrated our code base to use [nullish coalescing](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#nullish-coalescing) and [optional chaining](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining) operators.

## Documentation Improvements

### Appsody / LoopBack 4 Tutorial

[Appsody](https://appsody.dev/) is an open source project that makes creating cloud native applications simple. It provides application stacks for open source runtimes and frameworks, which are pre-configured with cloud native capabilities for Kubernetes and Knative deployments.

In August, LoopBack was added as one of the application stacks in Appsody to provide a powerful solution to build open APIs and Microservices in TypeScript. The name of the stack is [nodejs-loopback](https://github.com/appsody/stacks/tree/master/incubator/nodejs-loopback).

Please refer to our tutorial [Developing and Deploying LoopBack Applications with Appsody](https://loopback.io/doc/en/lb4/Appsody-LoopBack.html) for detailed instructions on how to use the Appsody CLI to:

- scaffold, run, stop, debug, and test a LoopBack 4 application locally
- build and deploy the application to Kubernetes on the IBM Cloud

### Migrating Middleware from LB3 to LB4

We enhanced the documentation and updated the tutorial of migrating LB3 application on a new LB4 app. By mounting the LB3 middleware with a base Express application, the middleware can be shared by both LB3 and LB4 apps. For example, you can use REST APIs in your LB3 app with a new LB4 application, which will be helpful if you are a LB3 user and ready to move to LoopBack 4. Check out [Migrating Express middleware](https://loopback.io/doc/en/lb4/migration-express-middleware.html) for the steps and examples.

### Migrating DataSources from LB3 to LB4

To improve the documentation for migration from LB3 to LB4, we also added steps for migrating LB3 datasources into a LB4 project. LB3 datasources are compatible with LB4, so the datasource configuration remains the same between both. See [Migrating Datasources](https://loopback.io/doc/en/lb4/migration-datasources.html) for steps on how to migrate your datasources.

### Customizing Source Key for Relations

Typically, the primary key is used as the source key in relations (i.e joining two tables). In LB4, we use `keyFrom` and `keyTo` to define the source key and foreign key respectively. If you would like to use a non-id property as your source key, setting `keyFrom` would allow you to do so. Check the [Relation Metadata](https://loopback.io/doc/en/lb4/HasMany-relation.html#relation-metadata) section for details.

### Other

- We've added some links and refactored the [Using Components](https://loopback.io/doc/en/lb4/Using-components.html) page to make the site better navigation.

- We've updated the [Authorization Component](https://loopback.io/doc/en/lb4/Loopback-component-authorization.html) page detailedly to match the latest code base.

## User Feedback Sessions

Interested in joining a user feedback session? We love to hear your input and how you are using LoopBack. If you'd like to take part or have suggestions, please join our discussion in the [GitHub issue](https://github.com/strongloop/loopback-next/issues/4264).

## What's Next?

If you're interested in what we're working on next, you can check out the [January Milestone](https://github.com/strongloop/loopback-next/pull/4376).

## Call to Action

In 2020, we look forward to helping you and seeing you around! LoopBack's success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Here's how you can join us and help the project:

- [Report issues](https://github.com/strongloop/loopback-next/issues).
- [Contribute](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md) code and documentation.
- [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Join](https://github.com/strongloop/loopback-next/issues/110) our user group.
