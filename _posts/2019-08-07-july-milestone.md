---
layout: post
title: LoopBack 4 July 2019 Milestone Update
date: 2019-08-07
author: Agnes Lin
permalink: /strongblog/july-2019-milestone/
categories:
  - Community
  - LoopBack
published: false
---

This July 20th was the 50th anniversary of The Moon Landing where we heard the famous quote, "That's one small step for man, one giant leap for mankind." This great, memorable event reminds me that every task the LoopBack team finishes will end up enhancing our project. From starting to build new features such as `inclusion`, to enriching the documentation, we believe that we are making LoopBack better by taking all these small steps!

We finished up 85 story points this month. See the [July milestone](https://github.com/strongloop/loopback-next/issues/3241) for an overview of what we have worked on, and read on for more details.

<!--more-->

## New Feature On The Way - Inclusion of Related Models

After many weeks in making, Miroslav finally finished the research on how to resolve included models when querying datasources and concluded the spike [issue #2634](https://github.com/strongloop/loopback-next/issues/2634).

The essence:
- We will introduce a concept of `InclusionResolver` functions. These functions implement the logic for fetching related models.
- Base repository classes (e.g. `DefaultCrudRepository`) will handle inclusions by calling resolvers registered for individual relations.
- Model-specific repositories (e.g. `TodoRepository` scaffolded in your project) will register inclusion resolvers for relations that are allowed to be traversed.
- LoopBack will provide built-in inclusion resolvers for each relation type we implement (`hasMany`, `belongsTo`, `hasOne` at the time of writing).

The [spike PR #3387](https://github.com/strongloop/loopback-next/pull/3387) shows a proof-of-concept implementation and includes high-level description of the proposed design in the [SPIKE document](https://github.com/strongloop/loopback-next/blob/spike/resolve-included-models/_SPIKE_.md), where you can find more details.

## Improvements of Developer Experience 

### Improvement of @loopback/cli

- The original CLI version is now stored in the ` .yo.rc.json` file. This allows users to check the version of CLI when upgrading their dependencies. See [PR #3338](https://github.com/strongloop/loopback-next/pull/3338) for details.
- We refactored the way how the property generator is invoked in the model generator. Now when generating a new model, the loop prompts for adding properties is more robust. See [PR #412](https://github.com/strongloop/generator-loopback/pull/412) for more information. 
- For the CLI `lb4 app` can now handle a hyphened path and will generate default names properly. See [PR #2092](https://github.com/strongloop/loopback-next/issues/2092) for more details.

### New Features in @loopback/context

#### `@config` Decorator

In [PR #3329](https://github.com/strongloop/loopback-next/pull/3329), we introduce new config metadata, which allows `@config.*` to be resolved from a binding other than the current one. For example, before we could inject `@config` this way:

```ts
export class MyRestServer {
  constructor(
    // injects `RestServerConfig.port` to the target
    @config('host')
    host: string,
  )
  //...
}
```

Now this kind of injection can be done this way:

```ts
export class MyRestServer {
  constructor(
    // Inject the `rest.host` from the application config
    @config({fromBinding: 'application', propertyPath: 'rest.host'})
    host: string,
  )
}
```

#### Parameter Injection

The module `Context` didn't use the invocation context to resolve parameter injection. This might limit some use cases such as `@inceptors` which couldn't rebind new values. With this implementation, users can use `options.skipParameterInjection` to resolve parameter injection.

### New Options for JSON Schema Generation

We enabled the `exclude` and `optional` options to `JsonSchemaOptions`.

#### Exclude

The `exclude` option takes in an array of model properties which you can exclude from your `requestBody`. For example, you can exclude the `id` property from the body of a `POST` request:

`POST /todos`

```ts
async create(
  @requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(Note, {exclude: ['id']}),
      },
    },
  })
  note: Omit<Note, 'id'>,
): Promise<Note> {
  // ...
}
```

Any new generated controllers scaffolded by `lb4 controller` will have the `id` property excluded by default. See [PR #3297](https://github.com/strongloop/loopback-next/pull/3297/) for details.

We also added support for excluding a custom primary key name (not the default `id`) in [PR #3347](https://github.com/strongloop/loopback-next/pull/3347).

#### Optional

The `optional` option takes in an array of model properties which you can mark optional in your `requestBody`. For example, you can mark the foreign key property from the body of a `POST` request as optional:

`POST /todo-lists/{id}/todos`

```ts
async create(
  @param.path.number('id') id: number,
  @requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(Todo, {
          exclude: ['id'],
          optional: ['todoListId'],
        }),
      },
    },
  })
  todo: Omit<Todo, 'id'>,
): Promise<Todo> {
  // ...
}
```

If this option is set and is not empty, it will override the `partial` option. See [PR #3309](https://github.com/strongloop/loopback-next/pull/3309) for details.

### Simplifying @requestBody

The current `@requestBody()` only takes in an entire request body (with very nested content object) or infers the schema from the parameter type. To simplify the signature so that users can describe the schema with concise configure options, we explored a new signature in a [spike story](https://github.com/strongloop/loopback-next/issues/2654): `@requestBody(spec, model, schemaOptions)`. Most of the discussions are tracked in [PR #3398](https://github.com/strongloop/loopback-next/pull/3398), opinions and feedback are welcomed before we start implementing the simplified decorator.

## Documentation Improvements

### More Detailed Content for `@model` and `@property` Decorators

As we always try to beef up the documentation for LB4, this month we improved docs of the decorators [`@model`](https://loopback.io/doc/en/lb4/Model.html#model-decorator) and [`@property`](https://loopback.io/doc/en/lb4/Model.html#property-decorator). Before we were simply using docs from LB3 site. However, since the implementation structures are different for LB3 and LB4, some parts of the docs are not precise or correct for LB4. We updated the documentation with more details and pointed out the differences between LB3 and LB4. We also added more links so that users can find more references and join the dicussion on GitHub with us. More details are in [PR #3354](https://github.com/strongloop/loopback-next/pull/3354).

### Supporting and Documenting Transactions

We also worked on bridging the gap between LoopBack 3 and 4 in terms of exposing transactions from repositories in [PR #3397](https://github.com/strongloop/loopback-next/pull/3397). We've introduced sugar API `beginTransaction()`
at the repository level, which delegates work to the data source that belongs to
it to start a transaction. 

With it, we've created `TransactionalRepository` interface that is meant to be used with connectors that support transactions and `DefaultTransactionalRepository` which can be used for CRUD repositories that support transactions. Once a transaction object is obtained from `beginTransaction()`, it can be passed into any CRUD calls made for the models attached to the backing datasource. The user can then either call `commit()` or `rollback()` actions for the transaction object to persist or revert the changes made. 

Note that only select SQL connectors support transactions to use this feature. For more information, check out the documentation [here](https://loopback.io/doc/en/lb4/Using-database-transactions.html).

### Connector Reference

[Connector reference](https://loopback.io/doc/en/lb3/Connectors-reference.html) pages that were missing in the LoopBack 4 docs have been added now. Check [issue #2598](https://github.com/strongloop/loopback-next/issues/2598) for more details.  

## Code Base Improvements

### Running Shared Tests in Connectors

This month we continued refactoring the tests for `mysql`, `mssql`, and `oracle` connectors in LoopBack 3 so that they can run the imported juggler tests in both 3.x and 4.x versions. Now our `mongodb`, `postgresql`, `kv-redis`, `cloudant`, `mysql`, `mssql`, and `oracle` connectors run shared tests. 
- For `mysql`, see [PR #390](https://github.com/strongloop/loopback-connector-mysql/pull/390).
- For `mssql`, see [PR #205](https://github.com/strongloop/loopback-connector-mssql/pull/205).
- For `oracle`, see [PR #180](https://github.com/strongloop/loopback-connector-oracle/pull/180).

### Fixing CI Failures

- For `dashdb` see [PR #81](https://github.com/strongloop/loopback-connector-dashdb/pull/81) and [PR #82](https://github.com/strongloop/loopback-connector-dashdb/pull/82)
- For `db2` see [PR #135](https://github.com/strongloop/loopback-connector-db2/pull/135)

## Other Changes

- We updated our templates and existing examples to leverage `getModelSchemaRef` in [PR #3402](https://github.com/strongloop/loopback-next/pull/3402).

- We updated our `oracle` connector to `oracledb` v4.0.0 in [PR #186](https://github.com/strongloop/loopback-connector-oracle/pull/186).

- We tested/enabled Node.js 12 for some of our connectors. 
  - For SQL connectors, see the PRs in [issue #3110](https://github.com/strongloop/loopback-next/issues/3110).
  - For NoSQL connectors, see the PRs in [issue #3111](https://github.com/strongloop/loopback-next/issues/3111).
  - For service connectors, see the PRs in [issue #3112](https://github.com/strongloop/loopback-next/issues/3112).

- We fixed an edge case where `replaceById` was not working for MongoDB database when the data came from the REST API layer. Check [issue #3431](https://github.com/strongloop/loopback-next/pull/3431) and [issue #1759](https://github.com/strongloop/loopback-datasource-juggler/pull/1759) for more details.

- We have removed the source code of `@loopback/openapi-v3-types` package from our monorepo. This package has been deprecated last month in favor of [`openapi3-ts`](https://www.npmjs.com/package/openapi3-ts) and
[`@loopback/openapi-v3`](https://www.npmjs.com/package/@loopback/openapi-v3). Check [PR #3385](https://github.com/strongloop/loopback-next/pull/3385) for more details.

- We fixed automigrate & autoupdate to wait until the datasource is connected to the database. This has addressed a bug in the npm script `migrate` (scaffolded by `lb4 app`), where errors thrown by the database migration were not caught correctly and thus the script did not indicate the failure via a non-zero exit code. Check [issue #1756](https://github.com/strongloop/loopback-datasource-juggler/pull/1756) for more details.

- We improved the type definition of `toJSON` helper from `@loopback/testlab` to better support union types like `MyModel | null` (e.g. as returned by Repository `findOne` method). Check [PR #3823](https://github.com/strongloop/loopback-next/pull/3283) for more details.

- We fixed REST API to better handle the case where a custom `basePath` is configured via `app.basePath()` API. As a result, the `server` entry in OpenAPI spec correctly includes the configured base path again now. Check [PR #3266](https://github.com/strongloop/loopback-next/pull/3266) for more details.

- A bug was fixed in the MongoDB connector, which caused the id from the input data object to be deleted. See [issue #3267](https://github.com/strongloop/loopback-next/issues/3267) for more details.

## Team changes

Our LoopBack core maintainer [Biniam](https://github.com/b-admike) will be leaving to the [API Connect](https://www.ibm.com/ca-en/marketplace/api-management) team. His hard work and dedication were an important part of our team. We appreciate the inspiration he gave us and all the contributions he's made. We believe that he will do an outstanding job in the next phase of his career! 

## Looking for User References

We have updated our [loopback.io](https://loopback.io/) website with our users and their testimonials. If you would like to be a part of it, see the details in this [GitHub issue](https://github.com/strongloop/loopback-next/issues/3047).

## What's Next?

If you're interested in what we're working on next, you can check out the [August milestone](https://github.com/strongloop/loopback-next/issues/3482).

## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Reporting issues](https://github.com/strongloop/loopback-next/issues).
- [Contributing](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md) code and documentation.
- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Joining](https://github.com/strongloop/loopback-next/issues/110) our user group.
