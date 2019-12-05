---
layout: post
title: LoopBack 4 November 2019 Milestone Update
date: 2019-12-05
author: Janny Hou
permalink: /strongblog/november-2019-milestone/
categories:
  - Community
  - LoopBack
published: false
---

The LoopBack team greeted November with the CASCONxEVOKE conference held in Toronto. CASCON is one of Canada's largest combined academic, research and developer conferences. As its speakers and attendees, we had a booth with posters to advocate LoopBack, and also delivered a workshop about developing extensible LoopBack applications. You can check this [blog](https://strongloop.com/strongblog/cascon-evoke-2019/) for more details. 

For Q4 achievements, we finished 3 epics this month: [Inclusion of related models](https://github.com/strongloop/loopback-next/issues/1352), [Deployment guide in a cloud native environment](https://github.com/strongloop/loopback-next/issues/1054) and [Support partitioned database in Cloudant connector](https://github.com/strongloop/loopback-connector-cloudant/issues/219), and significantly progressed in the Migration, Authentication & Authorization epics.

Keep reading to learn about the recently added features!

<!--more-->

## Inclusion of Related Models

### Running Repository Tests for Cloudant

To ensure our relations test suites work against real databases, we've been adding different kinds of databases to our test environment. This month we added a new repository`@loopback/test-repository-cloudant` to run shared CRUD and relation tests on Cloudant. You can also set up docker instance easily with our setup script to test out your application. See [PR#3968](https://github.com/strongloop/loopback-next/pull/3968) for more details and try it out if you're interested.

### Verifying Relation Type in Metadata

Besides supporting inclusion in queries, now we also set constraints to CRUD operations with navigational properties to avoid unexpected errors. For example, if you try to create an instance of TodoList with all Todos it has through the hasMany relation such as:

```ts
todoListRepository.create(
  {
    id: 1,
    name: 'my list 1',
    todos:[
      {id: 1, description: 'todo 1', todoListId: 1},
      {id: 2, description: 'todo 1', todoListId: 2}, // incorrect foreign key
    ]
  }
)
```

Such requests might be problematic because they might contain incorrect primary key or foreign key. Therefore, with such concerns, request contains navigational properties will be rejected. [PR#4148](https://github.com/strongloop/loopback-next/pull/4148) implements the verification for CRUD methods. 

Additionally, in order to ensure that the correct metadata type is being using when it is resolved, we've added tests in [PR#4046](https://github.com/strongloop/loopback-next/pull/4046/) and simplified our test setup.

## Migration from LoopBack 3

We keep incrementally building the migration guide for LoopBack 3 users upgrading to LoopBack 4. In November, we added content for [migrating model relations](https://loopback.io/doc/en/lb4/migration-models-relations.html). We explained how to convert a relation defined in LoopBack 3 model JSON files into corresponding LoopBack 4 artifacts.

## Authentication and Authorization

### Adding Authorization Example and Tutorial

In `loopback4-example-shopping`, the `/users/{userId}/orders` endpoints are now secured by an authorization system. When a request comes in, the authentication module resolves the user profile and passes it to the authorization module. Then an interceptor retrieves the metadata from the decorated endpoint, and invokes registered authorizers to determine whether the user can perform the operation. We also have a documentation [PR](https://github.com/strongloop/loopback-next/pull/4185) in progress that explains the usage of authorization module.

### Refactoring Customer Credentials

In LoopBack 3.x, we are storing user's password together with user data in the same model (table), which opens a lot of security vulnerabilities to deal with. For example, when returning user data in HTTP response, the password property must be filtered out and when searching for users, the password must be excluded from the query.

Our example [Shopping App](https://github.com/strongloop/loopback4-example-shopping) used to store user credentials together with other profile information too. In November, we refactored the domain model of our example app and extracted the password property into a new model `UserCredentials`. Beside the immediate benefits in increased security, this new domain model makes it easier to implement additional features in the future. For example: 2-factor authentication, and the password validation rule forbiding repeated use of the same password.

## Context Improvement

### Inspect 

In [PR#4193](https://github.com/strongloop/loopback-next/pull/4193) we've improved the context/binding with an `inspect()` method for metadata dumping. `ctx.inspect()` can be now used to print out the context hierarchy in JSON. This is useful for troubleshooting and rendering in UI. An example snippet of calling the new function:

```ts
const ctx = new Context();
console.log(ctx.inspect());
```

### Choosing the Right Scope

When creating a binding, you can configure the `scope` as `SINGLETON` or `TRANSIENT`. To know more about how to make the right choice based on requests, see the new documentation in [Choosing the right scope](https://loopback.io/doc/en/lb4/Binding.html#choose-the-right-scope).

### @service Decorator

A new shortcut decorator `@service` was introduced to inject an instance of a given service from a binding that matches the service interface. You can inject a service as follows:

```ts
class MyController {
  constructor(@service(MyService) public myService: MyService) {}
}
```

More details of its usage and explanation could be found in [Service Decorator](https://loopback.io/doc/en/lb4/Decorators_service.html)

### Receive Information of Current Binding

[PR#4121](https://github.com/strongloop/loopback-next/pull/4121) allows a class or provider to receive its own binding information as follow:

```ts
export class HelloController {
  // If the `bindingKey` is not specified, 
  // the current binding from the resolution session is injected.
  @inject.binding() private myBinding: Binding<string>;
  @get('/hello')
  async greet() {
    return `Hello from ${this.myBinding.key}`;
  }
}
```

## Application Life Cycle

In [PR#4145](https://github.com/strongloop/loopback-next/pull/4145) we improved states and introduced graceful shutdown for LoopBack applications.

Now an application's states are classified as *stable* or *in process*. Operations can only be called at a stable state. Calling a different operation in an in-process state will throw an error. See [Application states](https://loopback.io/doc/en/lb4/Life-cycle.html#application-states) for details.

The shutdown of application is now controllable by specifying an array of signals in the configuration. For example:

```ts
const app = new Application({
  shutdown: {
    signals: ['SIGINT'],
  },
});
// Schedule some work such as a timer or database connection
await app.start();
```
When the application is running inside a terminal, it can respond to `Ctrl+C`, which sends `SIGINT` to the process. The application calls `stop` first before it exits with the captured signal. This gives you a better control when the LoopBack 4 application is running inside a managed container, such as a Kubernetes Pod. See [graceful-shutdown](https://loopback.io/doc/en/lb4/Life-cycle.html#graceful-shutdown) for more details.

## Partitioned Database in Cloudant

We've finished the [Partitioned Database Epic](https://github.com/strongloop/loopback-connector-cloudant/issues/219) in `loopback-connector-cloudant` by supporting partitioned index, find, and property definition.

### Creating Partitioned Index

To create partitioned indexes as the secondary optimization for Cloudant query, you can add index entry in your model configuration with `{partitioned: true}` like:

```js
Product = db.define('Product', {
  name: {type: String},
  }, {
    forceId: false,
    indexes: {
      // create a partitioned index for frequently queried
      // fields like `name`
      'product_name_index': {
        partitioned: true,
        keys: {
            name: 1
        },
      },
    }
  });
```

You can learn more about its signature and usage in [Adding Partitioned Index](https://github.com/strongloop/loopback-connector-cloudant/blob/master/doc/partitioned-db.md#adding-partitioned-index)

### Partitioned Find

When the partition key is discovered in the query's options or filter, `Model.find()` will invoke the underlying partitioned find to optimize the query. Here are two examples:

Specifying the partition key in the `options`: `Product.find({where: {name: 'food'}}, {partitionKey: 'toronto'});`

Or defining a model property as the partition key field. So that the find method could infer the partition key from the query filter:

```js
// Define `city` as the partition key field in model `Product`
Product = db.define('Product', {
  id: {type: String, id: true},
  name: String,
  // partition key field
  city: {type: String, isPartitionKey: true},
});

// `Product.find()` will infer the partition key `toronto`
// from the filter
Product.find({
  where: {
    city: 'toronto',
    name: 'food'
  }
});
```

You can learn more about the partitioned query in [Performing Partitioned Find](https://github.com/strongloop/loopback-connector-cloudant/blob/master/doc/partitioned-db.md#defining-partitioned-property-and-performing-partitioned-find)

## Build Improvements

We upgraded the version of TypeScript to 3.7.2. An application created by the new CLI module `^@loopback/cli@1.26.0` is able to use the latest TypeScript features such as [optional chaining](https://github.com/strongloop/loopback-next/pull/4212) and [nullish coalescing](https://github.com/strongloop/loopback-next/pull/4213). A list of new features can be found in [TypeScript's release blog](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html).

Now, in the new generated application, the json configuration files are renamed from `*.datasource.json` to `*.datasource.config.json` to avoid generating declarations. Explanations see [TypeScript issue#34761](https://github.com/microsoft/TypeScript/issues/34761).

## Bug Fixes

- `lb4 discover` should generate correct type for property definition. Fixed by [PR#4143](https://github.com/strongloop/loopback-next/pull/4143).

- `@param.path.<primitive_type>` generated with `lb4 relation` considers Wrapper datatypes. Also fixed by [PR#4143](https://github.com/strongloop/loopback-next/pull/4143).

## Documentation Improvements

- We have added the [OpenAPI](https://loopback.io/doc/en/lb3/OpenAPI-connector.html) and [gRPC](https://loopback.io/doc/en/lb3/gRPC-connector.html) connectors to be a part of our available connectors in [PR#558](https://github.com/strongloop/loopback-workspace/pull/558) and [PR#906](https://github.com/strongloop/loopback.io/pull/906). Now, when a user calls `lb4 datasource`, they will have OpenAPI and gRPC as options for the connector.

- We've added a series of tutorials to illustrate how LoopBack can be used as an enabler to build large-scale Node.js applications. If you want to have a deeper understanding of LoopBack and/or to build an application with great flexibility and extensibility, don't miss [this tutorial series](https://loopback.io/doc/en/lb4/core-tutorial.html)!

- Regarding the security vulnerabilities in `swagger-ui`, one of the dependencies in `loopback-component-explorer`, we added a note in the [README file]( https://github.com/strongloop/loopback-component-explorer#a-note-on-swagger-ui-vulnerabilities) to explain why the LoopBack module is not affected by them.  

- We've added "Boot" and "Advanced Topics" to the core tutorial in [Advanced Recipes](https://loopback.io/doc/en/lb4/core-tutorial-part10.html) and [Discover and load artifacts by convention](https://loopback.io/doc/en/lb4/core-tutorial-part9.html).

- We've updated the steps of [creating model relations](https://loopback.io/doc/en/lb4/todo-list-tutorial-relations.html) to use `lb4 relation` command in the TodoList tutorial.

## Miscellaneous

- The `lb4 update` command runs against a LoopBack 4 project and checks dependencies against the installed `@loopback/cli`, by answering yes. This also updates the dependencies in `package.json`. Details can be found on page [Update generator](https://loopback.io/doc/en/lb4/Update-generator.html).

- In [spike story#3770](https://github.com/strongloop/loopback-next/issues/3770) we came up with a plan to support querying with nested filter in the API Explorer by re-designing the `@param.query.object()` decorator. The follow-up implementation story is tracked in [#2208](https://github.com/strongloop/loopback-next/issues/2208).

- We fixed a bug in `loopback-datasource-juggler` where `applyDefaultOnWrites` was not being applied in nested objects and arrays. You can find the details in [PR#1797](https://github.com/strongloop/loopback-datasource-juggler/pull/1797).

- For the model definition created by running `lb4 openapi`, we fixed the JavaScript type mapping of `date` from `Date` to `string`. Details see [PR#142](https://github.com/strongloop/loopback-next/pull/4142).

- A flag `useDefaultIdType` was introduced in `loopback-datasource-juggler` to preserve the user provided id(primary key) property against the one generated by connectors. Details see [PR#1783](https://github.com/strongloop/loopback-datasource-juggler/pull/1783).

- We now reject the the promise properly for `create` and `replaceById` when model initialization has errors. Details see [PR#1790](https://github.com/strongloop/loopback-datasource-juggler/pull/1790).

## What's Next?

If you're interested in what we're working on next, you can check out the [December Milestone](https://github.com/strongloop/loopback-next/issues/4236).

## Call to Action

LoopBack's success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Here's how you can join us and help the project:

- [Report issues](https://github.com/strongloop/loopback-next/issues).
- [Contribute](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md) code and documentation.
- [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Join](https://github.com/strongloop/loopback-next/issues/110) our user group.
