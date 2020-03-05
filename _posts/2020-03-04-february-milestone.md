---
layout: post
title: LoopBack 4 February 2020 Milestone Update
date: 2020-03-05
author: Janny Hou
permalink: /strongblog/february-2020-milestone/
categories:
  - Community
  - LoopBack
published: true
---

The February in a leap year is quite special and we hope everyone has some memorable stories from that extra day! In the past month, LoopBack team continued to focus on the migration guide epic. In the meantime, we were able to contribute significant PRs across all the functional areas. We are really glad to see the increasing engagement from community members, we appreciate all your code reviews and contributions. Last but not least, we published new major releases for [`@loopback/*`](https://github.com/strongloop/loopback-next) modules as as we dropped Node.js 8 support and introduced a few other breaking changes.

Keep reading to learn about what happened in February!

<!--more-->

## Migration Guide

### Migrating Operation Hooks

While we work on a [spike for supporting operation hooks for models/repositories](https://github.com/strongloop/loopback-next/issues/1919), we are providing a temporary API for enabling operation hooks in LoopBack 4. It requires overriding the `DefaultCrudRepository`'s `definePersistedModel` method in the model's repository.

Here is an example of adding a `before save` operation hook to the `Product` model.

```ts
class ProductRepository extends DefaultCrudRepository<
  Product,
  typeof Product.prototype.id,
  ProductRelations
> {
  constructor(dataSource: juggler.DataSource) {
    super(Product, dataSource);
  }

  definePersistedModel(entityClass: typeof Product) {
    const modelClass = super.definePersistedModel(entityClass);
    modelClass.observe('before save', async ctx => {
      console.log(`going to save ${ctx.Model.modelName}`);
    });
    return modelClass;
  }
}
```
For more details visit [Migrating CRUD operation hooks](https://loopback.io/doc/en/lb4/migration-models-operation-hooks.html).

### Migrating LoopBack 3 Models with a Custom Base Class

The initial implementation of `lb4 import-lb3-models` was able to import only models inheriting from models that have a built-in counter-part in LoopBack 4: `Model`, `PersistedModel`, `KeyValueModel`. Now it also supports migrating models inheriting from all other models, including LoopBack 3 built-in models like `User`, or an application-specific model. The chain of base (parent) models will also be created in the LoopBack 4 application. For example, model `Customer` extends model `UserBase` which extends model `User`, and if you run `lb4 import-lb3-models`, you will see the following prompts:

```sh
$ lb4 import-lb3-models ~/src/loopback/next/packages/cli/test/fixtures/import-lb3-models/app-using-model-inheritance.js

WARNING: This command is experimental and not feature-complete yet.
Learn more at https://loopback.io/doc/en/lb4/Importing-LB3-models.html

? Select models to import: Customer
Model Customer will be created in src/models/customer.model.ts

Adding UserBase (base of Customer) to the list of imported models.
Model UserBase will be created in src/models/user-base.model.ts

Adding User (base of UserBase) to the list of imported models.
Model User will be created in src/models/user.model.ts

Import of model relations is not supported yet. Skipping the following relations: accessTokens
Ignoring the following unsupported settings: acls
   create src/models/customer.model.ts
   create src/models/user-base.model.ts
   create src/models/user.model.ts
   update src/models/index.ts
   update src/models/index.ts
   update src/models/index.ts

```

### Migrating Access Control Example

As the first story to explorer the authorization migration path, we started with migrating a [LoopBack 3 example application](https://github.com/strongloop/loopback-example-access-control) which implemented a RBAC (role based access control) system for demoing the LoopBack 3 authentication and authorization mechanism.

The migrated LoopBack 4 example is created in [examples/access-control-migration](https://github.com/strongloop/loopback-next/tree/master/examples/access-control-migration). It uses [casbin](https://github.com/casbin/casbin) as the third party library to implement the role mapping. The original models and endpoints are migrated to the LoopBack 4 models, repositories, and controllers. The JWT authentication system is applied again and the core logic of original role resolvers and model ACLs map to the LoopBack 4 authorization system's authorizers and metadata.

We created a very [detailed tutorial](https://loopback.io/doc/en/lb4/migration-auth-access-control-example.html) for the migration steps that you can follow to see how to secure the same endpoints in LoopBack 4.

### Migrating Model Mixins

We've added a section [Migrating model mixins](https://loopback.io/doc/en/lb4/migration-models-mixins.html) to the migration guide to detail how LoopBack 3 property and custom method/remote method mixins can be migrated to LoopBack 4 model/repository/controller mixin class factory functions.

### Migration of all model properties

We have confirmed that migration also passes down the connector metadata in the model properties with [additional tests](https://github.com/strongloop/loopback-next/issues/3810).

## Experimental Feature on Integration with Winston and Fluentd Logging

[`@loopback/extension-logging`](https://github.com/strongloop/loopback-next/blob/master/extensions/logging/README.md) contains a component that provides logging facilities based on [Winston](https://github.com/winstonjs/winston) and [Fluentd](https://github.com/fluent/fluent-logger-node). Here is an example of injecting and invoking a Winston logger:

```ts
import {inject} from '@loopback/context';
import {Logger, logInvocation} from '@loopback/extension-logging';
import {get, param} from '@loopback/rest';

class MyController {
  // Inject a winston logger
  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: Logger;

  // http access is logged by a global interceptor
  @get('/greet/{name}')
  // log the `greet` method invocations
  @logInvocation()
  greet(@param.path.string('name') name: string) {
    return `Hello, ${name}`;
  }

  @get('/hello/{name}')
  hello(@param.path.string('name') name: string) {
    // Use the winston logger explicitly
    this.logger.log('info', `greeting ${name}`);
    return `Hello, ${name}`;
  }
}
```
Its architecture diagram and basic usage are well documented in the package's [README.md](https://github.com/strongloop/loopback-next/blob/master/extensions/logging/README.md) file.

## Context and Binding

### Adding Inspection Flags

Context and binding inspection APIs were improved with more options and information to print out their injections. 

At binding level, there is one flag:
  - `includeInjections`: control if injections should be inspected.

An example usage is:

```ts
const myBinding = new Binding(key, true)
  .tag('model', {name: 'my-model'})
  .toClass(MyController);
// It converts a binding with value constructor to plain JSON object
const json = myBinding.inspect({includeInjections: true});
```

At context level, there are two flags:
  - `includeInjections`: control if binding injections should be inspected.
  - `includeParent`: control if parent context should be inspected.

And their corresponding example usages:

```ts
childCtx.inspect({includeInjections: true});
childCtx.inspect({includeParent: false})
```

More test cases can be found in PR https://github.com/strongloop/loopback-next/pull/4558

### Inspect Example

[@raymondfeng](https://strongloop.com/authors/Raymond_Feng/) has created [loopback4-example-inspect](https://github.com/raymondfeng/loopback4-example-inspect) to demonstrate the inspection of a LoopBack 4 application's context hierarchy. It provides visualization on the different contexts (request, server, application), their bindings, and dependency injections in class constructors. Information is exposed via 3 endpoints:

- inspect: Fetches a JSON document for the context hierarchy.
- graph: Renders the LoopBack application as a SVG diagram.
- graph-d3: Displays the graph using [d3-graphviz](https://github.com/magjac/d3-graphviz).

This example is turning into an extension `@loopback/context-explorer` in PR [#4666](https://github.com/strongloop/loopback-next/pull/4666). The core code is packed as a component.

### Dynamic Binding and Rebinding of Controllers

The hot-reloading of controllers after starting application is supported now. You can dynamically add/remove controllers after the application runs, and their endpoints will be mounted/removed accordingly. The OpenAPI specification that describes the exposed endpoints will also be updated. For example:

```ts
const app = new Application();
await app.start();
app.controller(MyController);
// MyController are available via REST API now
// You can also see the updated OpenAPI Specification from endpoint /openapi.json
```

## Allowing Different Naming Convention in `lb4 discover` CLI

The CLI now allows selection of two naming convention for `lb4 discover` command: camel case or all lower case. You can find the explanation of each prompt in the [Discovering models from relational databases](https://loopback.io/doc/en/lb4/Discovering-models.html) page. `discoverAndBuildModels` allows you to have different conventions to meet your requirements. Details can be found in page [Discover and define models at runtime](https://loopback.io/doc/en/lb3/Discovering-models-from-relational-databases.html#discover-and-define-models-at-runtime).

## CRUD REST API Builder

We added a new API builder that helps build a CRUD repository and controller class in [PR #4589](https://github.com/strongloop/loopback-next/pull/4589). `CrudRestApiBuilder` can be used with an `Entity` class to create a default repository and controller classes for the model class.
For example, if you have a `Product` model and a database `db`. In your `src/application.ts` file:

```ts
// add the following import
import {CrudRestComponent} from '@loopback/rest-crud';
export class TryApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    // other code
    // add the following line
    this.component(CrudRestComponent);
  }
}
```

Create a new file for the configuration, e.g. `src/model-endpoints/product.rest-config.ts` that defines the `model`, `pattern`, `dataSource`, and `basePath` properties:

```ts
import {ModelCrudRestApiConfig} from '@loopback/rest-crud';
import {Product} from '../models';
module.exports = <ModelCrudRestApiConfig>{
  model: Product,
  pattern: 'CrudRest', // make sure to use this pattern
  dataSource: 'db',
  basePath: '/products',
};
```

Now your Product model will have a default repository and default controller class defined without the need for a repository or controller class file.
For more information on the API builder, see [`@loopback/rest-crud`'s README](https://github.com/strongloop/loopback-next/blob/master/packages/rest-crud/README.md).

## REST Decorators

We simplified the `filter` and `where` usage for constraint, schema, and OpenAPI mapping with two shortcut decorators: `@param.filter` and `@param.where`. The example below shows how they replaced the tedious signatures:

```ts
class TodoController {
  async find(
    @param.filter(Todo)
    // replaces `@param.query.object('filter', getFilterSchemaFor(Todo))`
    filter?: Filter<Todo>,
  ): Promise<Todo[]> {
    return this.todoRepository.find(filter);
  }
  async findById(
    @param.path.number('id') id: number,
    // replaces `@param.query.object('filter', getFilterSchemaFor(Todo))`
    @param.filter(Todo, {exclude: 'where'}) filter?: FilterExcludingWhere<Todo>,
  ): Promise<Todo> {
    return this.todoRepository.findById(id, filter);
  }
  async count(@param.where(Todo) where?: Where<Todo>): Promise<Count> {
    // replaces @param.query.object('where', getWhereSchemaFor(Todo)) where?: Where<Todo>,
    return this.todoRepository.count(where);
  }
}
```

## API Explorer

We have now changed the OpenAPI specification generated by the decorator `@param.query.json` to support url-encoding. Please take a look at (https://github.com/strongloop/loopback-next/issues/2208). This means users can now test their APIs from API explorer with complex json query parameters (eg: `filter={include: {relation: "todoList"}}`). Previously users were able to test from API explorer with only simple key-values in exploded format (eg: `?filter[limit]=1` ), because the generated OpenAPI for json query parameters was always of `exploded deep-object` style. This could be a breaking change for some API clients. Please take a look at the breaking change log in commits from PR https://github.com/strongloop/loopback-next/pull/4347

## Tooling and Build

- `npm test` is passing on Windows: The problem was caused by `process.stdin.isTTY` behaves differently on the Windows platform, and was discovered by community member [@derdeka](https://github.com/derdeka). Great thanks to him and [@dougal83](https://github.com/dougal83) who had been working with [@bajtos](https://strongloop.com/authors/Miroslav_Bajto%C5%A1/) to investigate and eventually fix the issue! A series of PRs are involved: [#4643](https://github.com/strongloop/loopback-next/pull/4643), [#4605](https://github.com/strongloop/loopback-next/pull/4605), [#4652](https://github.com/strongloop/loopback-next/pull/4652), [#4657](https://github.com/strongloop/loopback-next/pull/4657)

- PR [#4707](https://github.com/strongloop/loopback-next/pull/4707) removed dist files from top-level tsconfig to speed up the eslint checks. The time for `npm run eslint` was reduced from about 4m10s down to 2m50s. More importantly, it enabled proper caching behavior, so that subsequent runs of `npm run eslint` are super quick, even after `npm run build` modified dist files.

- Dropped Node.js 8 support in PR [#4619](https://github.com/strongloop/loopback-next/pull/4619). Node.js v8.x is now end of life, so that we upgraded the supported version across all the LoopBack 4 packages to be 10 and above. This breaking change also resulted in a semver-major release for the monorepo. Many small breaking changes are coming as part of it.

- [`request`](https://www.npmjs.com/package/request) module is now officially deprecated, so we replaced it with a new HTTP client [`axios`](https://github.com/axios/axios). The entire story is tracked in [#2672](https://github.com/strongloop/loopback-next/issues/2672). We have updated the [http-caching-proxy](https://github.com/strongloop/loopback-next/pull/4637) and [benchmark](https://github.com/strongloop/loopback-next/pull/4628) packages to use axios.

## Miscellaneous

- We upgraded the dependency of TypeScript from 3.7 to 3.8 in PR [#4769](https://github.com/strongloop/loopback-next/pull/4769). You can find the new features of TypeScript 3.8 in [here](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html)

- Querying with filter `where`, `fields` and `order` is now supported in the API Explorer, the usage is well documented in the section [parameter decorator to support json objects](https://loopback.io/doc/en/lb4/Decorators_openapi.html#parameter-decorator-to-support-json-objects)

- We enabled running shared tests from both loopback-datasource-juggler@3 and loopback-datasource-juggler@4 in one more connector: `loopback-connector-db2`

- We fixed a bug in postgresql connector which occurred when few of the foreign keys in a parent table have null values (https://github.com/strongloop/loopback-next/issues/4332)

## Documentations and Blog Posts

After refactoring the shopping example, we updated the [README.md](https://github.com/strongloop/loopback4-example-shopping) file to document the new changes of application usage and the authorization system.

We published two blog posts this month about the management and plan for our project:

- LoopBack 3 has entered Maintenance LTS: https://strongloop.com/strongblog/lb3-entered-maintenance-mode/

- The 2020 Goals and Focus for LoopBack: https://strongloop.com/strongblog/2020-goals/

## Community Contribution

With more LoopBack users joined us as community maintainers, we're seeing more interactions and discussions! Also, we're glad to see that the increasing numbers of pull request from the community. We really appreciate all of these help! Here are the highlight of community PR of February:

### Adding Flag `disableDefaultSort` to Improve Database Query Performance

User [`Erikdegroot89`](https://github.com/Erikdegroot89) pointed out that the way LB4 sets default sorting for SQL query might drag down the querying time when the database has a massive amount of data. Using the new added flag `disableDefaultSort`, users can turn the default sorting off. See details in [PR #417](https://github.com/strongloop/loopback-connector-postgresql/pull/417). This PR also inspires us to leverage the option to all connectors. The issue is tracked in [GH issue](https://github.com/strongloop/loopback-connector/issues/169). Feel free to contribute or join the discussion.

### Deprecation Decorator

`@oas.deprecated` was created by user [mschnee](https://github.com/mschnee) to enrich our OpenAPI decorators. It can be applied to class and a class method. It will set
the `deprecated` boolean property of the Operation Object. When applied to a
class, it will mark all operation methods of that class as deprecated, unless a
method overloads with `@oas.deprecated(false)`. You can check out [its documentation](https://loopback.io/doc/en/lb4/Decorators_openapi.html#oasdeprecated) to learn more details.

## Call to Action

In 2020, we look forward to helping you and seeing you around! LoopBack's success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Here's how you can join us and help the project:

- [Report issues](https://github.com/strongloop/loopback-next/issues).
- [Contribute](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md) code and documentation.
- [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Join](https://github.com/strongloop/loopback-next/issues/110) our user group.
