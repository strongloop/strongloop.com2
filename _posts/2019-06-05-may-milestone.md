---
layout: post
title: LoopBack 4 May 2019 Milestone Update
date: 2019-06-05
author: Biniam Admikew
permalink: /strongblog/may-2019-milestone/
categories:
  - Community
  - LoopBack
published: false
---

As the weather starts to warm up for the summer season, the LoopBack team has turned up the heat on the milestone tasks we planned for the month of May and more. We worked on areas such as:

* Improving our documentation pages and API documentation.
* Giving users unified website experience on `loopback.io`.
* Making CI green across connector repositories and being able to test juggler 3.x and 4.x with connectors.
* Implementation of Interceptors in the LoopBack framework.
* Authentication extension point, refactoring authentication action, and using the new features in shopping example repository.
* Inclusion of related models in model relations.
* Testing out ways to roll out experimental features.

These are just the tip of the iceberg. Read on to find out more on what the LoopBack team accomplished this month.

<!--more-->

## Method Interceptor Support

Interceptors are reusable functions to provide aspect-oriented logic around method invocations. There are many use cases for interceptors, such as:

- Add extra logic before / after method invocation. For example, logging or measuring method invocations.
- Validate/transform arguments.
- Validate/transform return values.
- Catch/transform errors. For example, normalize error objects.
- Override the method invocation. For example, return from cache.

See [PR#2687](https://github.com/strongloop/loopback-next/pull/2687) for more details.

## Binding Configuration

To allow bound items in the context to be configured, we introduced some conventions and corresponding APIs to make it simple and consistent in [PR#2259](https://github.com/strongloop/loopback-next/pull/2259).

We treat configurations for bound items in the context as dependencies, which can be resolved and injected in the same way of other forms of dependencies. For example, the `RestServer` can be configured with `RestServerConfig`.

## New Mounted LoopBack 3 Application in LoopBack 4 Example

We introduced a [new example](https://github.com/strongloop/loopback-next/tree/master/examples/lb3-application) that illustrates mounting an existing LoopBack 3 application in a LoopBack 4 project. We took the [`CoffeeShop` application](https://github.com/strongloop/loopback-getting-started) from loopback-getting-started and mounted it in a new LoopBack 4 project. The endpoints, including the OpenAPI spec, have also been mounted in the project. You can check out the example by running `lb4 example lb3-application`.

## Model Definitions Reference in Operation Spec

Controller methods can now reference model definitions through OpenAPI spec. This replaces the need to use `x-ts-type` extension to reference model schema. In addition, if an operation defines the model, another operation can reference that model without defining it.

For example, in the following code snippet, since the `Todo` model definition is provided by `@get('/todos')`, `@get('/todos/{id')` can now also reference it without defining it.
 
```ts
class MyController {
  @get('/todos', {
    responses: {
      '200': {
        description: 'Array of Category model instances',
        content: {
          'application/json': {
            schema: {
              $ref: '#/definitions/Todo',
              definitions: {
                Todo: {
                  title: 'Todo',
                  properties: {
                    title: {type: 'string'},
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  async find(): Promise<object[]> {
      /* … */
  }

  @get('/todos/{id}', {
    responses: {
      '200': {
        description: 'Todo model instance',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Todo',
              },
            },
          },
        },
      },
    },
  })
  async findById(): Promise<object> {
    /* … */
  }
}
```

To make model references even easier to use, we have also introduced a new helper `getModelSchemaRef` which builds a `$ref` entry with accompanied schema in `definitions` from the given model instance. See [PR#2971](https://github.com/strongloop/loopback-next/pull/2971).

```ts
class MyController {
  @get('/todos', {
    responses: {
      '200': {
        description: 'Array of Category model instances',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Todo),
          },
        },
      },
    },
  })
  async find(): Promise<object[]> {
      /* … */
  }

  @get('/todos/{id}', {
    responses: {
      '200': {
        description: 'Todo model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Todo),
          },
        },
      },
    },
  })
  async findById(): Promise<object> {
    /* … */
  }
}
```

In the near future, we would like to leverage this new mechanism to emit different model schema for different API endpoints:

- Response schema of `find` and `findById` endpoints should include navigational properties for related models.
- Response schema of `create` endpoint should exclude `id` and any other database-generated properties (e.g. `_rev` in CouchDB/Cloudant).
- Response schema of `updateById` and `updateAll` endpoints should mark all model properties as optional.

## Better formatting of model settings object in scaffolded files

[PR#2843](https://github.com/strongloop/loopback-next/pull/2843) improved the way how our CLI tool serialized model settings to TypeScript code.

Before this change, model settings object was converted to JSON, which produced non-idiomatic TypeScript code. For example:

```ts
@model({ settings: {"mongodb": {"collection": "clients"}}})
export class MyModel extends Entity {
  // ...
}
```

Now we convert the object into TypeScript object definition. See below for an example:

```ts
@model({
  settings: {
    mongodb: {collection: 'clients'},
  }
})
export class MyModel extends Entity {
  // ...
}
```

## dataType: 'ObjectID' for MongoDB Connector

You can set a model property's `mongodb` property definition `dataType` to "ObjectID" to enforce ObjectID coercion irrespective of the `strictObjectIDCoercion` setting.

In the following example, the `id` and `xid` will be coerced to `ObjectID` even if `strictObjectIDCoercion` is set to true.

```js
const User = ds.createModel(
  'user',
  {
    id: {type: String, id: true, mongodb: {dataType: 'ObjectID'}},
    xid: {type: String, mongodb: {dataType: 'ObjectID'}}
  },
  {strictObjectIDCoercion: true}
);
```
For more details, see [PR#517](https://github.com/strongloop/loopback-connector-mongodb/pull/517).

## Authentication

This month we implemented [a PoC PR](https://github.com/strongloop/loopback-next/pull/2822) to illustrate plugging in the passport strategy in the new published `@loopback/autthentication` module. The PR proves the new authentication action is able to verify a request with both passport based and non passport based strategy. Therefore we just deprecated the old passport adapter in story [2467](https://github.com/strongloop/loopback-next/issues/2467), and focus on the new adapter creation in story [2311](https://github.com/strongloop/loopback-next/issues/2311). 

The initial proposal for the new adapter is wrapping each configured strategy instance so that it fits the `AuthenticationStrategy` interface. Raymond suggested exploring another approach which applies a wrapper to the `passport` module itself. And since the team is discussing the work flow of incrementally adding a new feature, Miroslav suggested moving the new passport adapter to a standalone experimental module along with the comparison between two proposals. Eventually the adapter will be a component that can be plugged into `@loopback/authentication`.

## Experimental feature development

To achieve a balance between the high code quality and the development speed, we decided to introduce experimental features.

At first we tried keeping the lab packages in a mirror repository `loopback-labs` for the purpose of isolation, then graduate the features into `loopback-next` when they are production ready. While during the spike, we realized that a better way to isolate each feature is creating and releasing each feature from its own branch, so that features are independent from each other and have their own life cycle. The releasing process is also simpler since it only targets on one package. Having that been said, and considering the synchronization effort between two repositories, we decided to keep lab packages stay in `loopback-next`.

The work flow of adding an experimental package is documented in https://github.com/strongloop/loopback-next/blob/labs/base/LABS.md. It explains how to create your experimental feature branch, incrementally improve the code and graduate the package.

## Documentation

We took some time to rework outdated sections of our documentation pages in May. First of all, we updated docs on how to [create stub services](https://loopback.io/doc/en/lb4/Testing-your-application.html#create-a-stub-service) for controller unit tests. At the same time, we updated the status of auto-generated smoke test section and top-down application building. See [PR#2879](https://github.com/strongloop/loopback-next/pull/2879) for more details. Moreover, our [hasOne relation](https://loopback.io/doc/en/lb4/hasOne-relation.html) page also had some typos and errors and we were able to address them in [PR#2959](https://github.com/strongloop/loopback-next/pull/2959).

In [PR#2944](https://github.com/strongloop/loopback-next/pull/2994), we revamped the [Sequences](https://loopback.io/doc/en/lb4/Sequence.html) documentation page with information on what happens behind the scenes for some of the sequence actions like `invoke` and `send`. We also added details on how to retrieve query string parameters.

We added a new [Components](https://loopback.io/doc/en/lb4/Components.html) page to explain the shape and concept of components for extensibility as well as how they contribute artifacts to a LoopBack 4 application. For more details, check
out [PR#2702](https://github.com/strongloop/loopback-next/pull/2702) and [PR#2361](https://github.com/strongloop/loopback-next/pull/2361).

In [PR#2834](https://github.com/strongloop/loopback-next/pull/2834), we introduced [`@loopback/tsdocs`](https://github.com/strongloop/loopback-next/tree/master/packages/tsdocs) package which provides API Docs for the rest of the LB4 packages in our `loopback-next` monorepo using Microsoft's `api-extractor` and `api-documenter` tools. It also integrates the generated API Docs for consumption in `loopback.io`. You can see them live [here](https://loopback.io/doc/en/lb4/apidocs.index.html).

## Examples for new LoopBack 4 artifacts/concepts

We added a new [greeting-app](https://github.com/strongloop/loopback-next/tree/master/examples/greeting-app) that shows how to compose an application from component and controllers, interceptors, and observers. The application is built on top of [example-greeter-extension](https://github.com/strongloop/loopback-next/tree/master/examples/greeter-extension) and can greet users in different languages. It has a caching interceptor to handle multiple requests for the same payload (name and language) within a specific time. See [PR#2941](https://github.com/strongloop/loopback-next/pull/2941) for more details.

On the same note, we added [standalone examples](https://github.com/strongloop/loopback-next/tree/master/examples/context) for `@loopback/context` showing how to use the module as an Inversion of Control (IoC) and Dependency Injection (DI) container. We covered a wide array of usages for the utilities provided by the module such as context chaining, binding types, and customizing injection decorators/resolvers.

## Unified Web Site Experience on loopback.io

We have created the dedicated [web site for LoopBack 4](v4.loopback.io) last year. Now that LoopBack 4 becomes the active release, we are moving the LoopBack 4 pages back to loopback.io web site.

In the meantime, we're actively attempting to rebuild the “Who’s using LoopBack” section to showcase our users and the use cases. If you would like to be a part of it, please sign up [here](https://github.com/strongloop/loopback-next/issues/3047)! 

## Other changes

- [PR#2856](https://github.com/strongloop/loopback-next/pull/2856) fixed REST API Explorer to correctly handle both `basePath` configuration specified at LoopBack application/server level and `mountPath` provided by Express when the LB app is mounted on an Express application.

- [PR#2823](https://github.com/strongloop/loopback-next/pull/2823) improved the OpenAPI spec emitted for LoopBack 3 models when the entire LB3 application is mounted in LB4 project. In particular, the schema for request bodies of "create" requests now excludes `id` (primary key) properties when the model is configured with `forceId: true` (which is the default).

- Keeping dependencies up-to-date is time consuming, especially in monorepos. Originally, we were used [GreenKeeper](https://greenkeeper.io) to automate the task. Unfortunately, GreenKeeper does not support the combination of lerna
  monorepos with package-locks enabled (see [greenkeeper#1080](https://github.com/greenkeeperio/greenkeeper/issues/1080)).

In May, we migrated our [Shopping example app](https://github.com/strongloop/loopback4-example-shopping) to [RenovateBot](https://renovatebot.com). The experience was great so far, we are now migrating the main [loopback-next](https://github.com/strongloop/loopback-next) monorepo too.

- [PR#3013](https://github.com/strongloop/loopback-next/pull/3013) removed implicit dependency of `@loopback/testlab` on `@types/mocha`. This dependency was preventing LoopBack projects to use Jest test framework instead of Mocha. Now that the fix was landed and published to npm registry, `@loopback/testlab` should work with any test framework that provides `it` and `it.skip` APIs.

- [PR#2996](https://github.com/strongloop/loopback-next/pull/2996) makes sure we stay current with TypeScript and upgrades our project to use version `3.5.1`.

## LoopBack 3

Node.js 6 went end-of-life at the end of April. We are incrementally removing it from our CI build configurations and updating our `package.json` files to bump up the minimum supported version to Node.js 8.

When we introduced version 4 of loopback-datasource-juggler back in 2018, we did not update connector repositories to run tests against this new juggler version too. As a result, we were encountering failed builds when back-porting pull requests from juggler 4.x to 3.x. We looked into different ways how to address this problem and decided to go with a solution where a single connector run shared tests from multiple loopback-datasource-juggler versions. Some of the connectors have been already updated, we will be updating the rest in the next months.

Additional changes:

- `generator-loopback`: The version of the Node.js engine is updated to >= 8 because Node.js 6 entered EOF in April 2019.
- `generator-loopback`: We fixed two regression bugs to honour the name argument of command `lb swagger` and `lb boot-script`.
- `loopback-passport-component`: We landed a community PR to support user ldap profile configuration with group search for Microsoft active directory, you can check the details in PR [#267](https://github.com/strongloop/loopback-component-passport/pull/272).
- `loopback-connector-cloudant`: The CI failures are fixed after upgrading the dependency version to `loopback-connector-couchdb2@1.4.0`.

## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Reporting issues](https://github.com/strongloop/loopback-next/issues).
- [Contributing](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md)
  code and documentation.
- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Joining](https://github.com/strongloop/loopback-next/issues/110) our user group.
