---
layout: post
title: LoopBack 4 April 2019 Milestone Update
date: 2019-05-01
author: Dominique Emond
permalink: /strongblog/april-2019-milestone/
categories:
  - Community
  - LoopBack
published: false
---

April was a very productive month for the team, we were focused on the following areas:

* Authentication
* Basic Life Cycle Support
* Strong referential integrity for relations
* Exposing LoopBack 3 applications in LoopBack 4 projects
* Adding more architectural patterns to support extensions
* Model discovery

Besides the items above, we landed several additional improvements. Keep reading to learn more details.

<!--more-->

## Spike on UNIQUE and FOREIGN KEY Constraints

Relations like HasMany, HasOne and BelongsTo depend on the underlying database to enforce integrity and referential constraints. At the moment, LoopBack assumes those constraints are either already defined (when working with existing database schema) or created manually by the user (when creating schema from LoopBack models). This manual step is very cumbersome. Secondly, the database migration provided by LoopBack does not provide any information about such step and thus it's easy for inexperienced users to unknowingly create database schema allowing race conditions and creating room for inconsistency in the stored data.

Ideally, we want developers to include any additional constraints in the definition of models and properties, and have our connectors translate these constraints to database-specific setup instruction as part of schema migration.

Historically, LoopBack did provide some level of support for indexes and foreign keys. Unfortunately, this was implemented at connector level and each connector provided a slightly different flavor.

To improve this situation, we started with some research on the current status of support in different connectors and proposed a new definition syntax that will become a new standard for LoopBack models.

For example, a HasOne relation needs to define a UNIQUE index and a FOREIGN KEY constraint for the property storing relational link. The proposed syntax makes this very easy to express directly in your TypeScript source code:

```ts
@model()
export class TodoListImage extends Entity {

  @belongsTo(
    () => TodoList,
    {},
    {
      unique: true,
      references: {
        model: () => TodoList,
        property: 'id',
        onUpdate: 'RESTRICT',
        onDelete: 'CASCADE',
      },
    },
  )
  todoListId?: number;
  
  // other properties, etc.
}
```

Please refer to [PR#2712](https://github.com/strongloop/loopback-next/pull/2712) to learn more about the proposed syntax and for a list of follow-up stories created to implement the proposed functionality.

## HasMany/BelongsTo/HasOne Relation Limitations for NoSQL Databases

These relations work best with relational databases that support foreign key and unique constraints and attempting to use them with NoSQL databases will lead to unexpected behaviour. Our model relation documentation has been updated to reflect these limitations. See [HasMany Relation](https://loopback.io/doc/en/lb4/HasMany-relation.html), [BelongsTo Relation](https://loopback.io/doc/en/lb4/BelongsTo-relation.html), and [HasOne Relation](https://loopback.io/doc/en/lb4/hasOne-relation.html).

## Model Discovery
   
Models can now be discovered from a supported datasource by running the `lb4 discover` command. See [Discovering models from relational databases](https://loopback.io/doc/en/lb4/Discovering-models.html). This new feature was contributed by the community.

## Basic Life Cycle Support

It's often desirable for various types of artifacts to participate in certain life cycles events and perform some related processing. Basic life cycle support introduces these capabilities:

- registration of life cycle observers and actions using context bindings
- an `lb4 observer` command to generate life cycle scripts
- Discover and boot life cycle scripts

See [Life cycle events and observers](https://loopback.io/doc/en/lb4/Life-cycle.html).

## Added @inject.binding and Improved @inject.setter

[PR#2657](https://github.com/strongloop/loopback-next/pull/2657) improves `@inject.setter` to allow binding creation policy. It also adds `@inject.binding` to resolve/configure a binding via dependency injection.

See [@inject.setter](https://loopback.io/doc/en/lb4/Decorators_inject.html#injectsetter) and [@inject.binding](https://loopback.io/doc/en/lb4/Decorators_inject.html#injectbinding).

## Decorator/Helper Functions for Extension Point/Extensions

[Extension Point/extension](https://wiki.eclipse.org/FAQ_What_are_extensions_and_extension_points%3F) is a very powerful design pattern that promotes loose coupling and offers great extensibility. There are many use cases in LoopBack 4 that fit into design pattern. For example:

- `@loopback/boot` uses `BootStrapper` that delegates to `Booters` to handle different types of artifacts
- `@loopback/rest` uses `RequestBodyParser` that finds the corresponding `BodyParsers` to parse request body encoded in different media types
- `@loopback/core` uses `LifeCycleObserver` to observe `start` and `stop` events of the application life cycles.

To add a feature to the framework and allow it to be extended, we divide the responsibility into two roles:

- Extension point: it represents a **common** functionality that the framework depends on and interacts with, such as, booting the application, parsing http request bodies, and handling life cycle events. Meanwhile, the extension point also defines contracts for its extensions to follow so that it can discover corresponding extensions and delegate control to them without having to hard code such dependencies.

- Extensions: they are implementations of **specific** logic for an extension point, such as, a booter for controllers, a body parser for xml, and a life cycle observer to load some data when the application is started. Extensions must conform to the contracts defined by the extension point.

See [Extension point and extensions](https://loopback.io/doc/en/lb4/Extension-point-and-extensions.html).

## Working with Express Middleware

We added a new section [Working with Express middleware](https://loopback.io/doc/en/lb4/Sequence.html#working-with-express-middleware) to describe the differences between LoopBack REST layer and Express middleware and explain how to map different kinds of Express middleware to LoopBack concepts and APIs.

## Build Tools

- To allow the TypeScript compiler to catch even more bugs for us, we have enabled the following additional checks: `noImplicitThis`, `alwaysStrict` and `strictFunctionTypes`, see [PR#2704](https://github.com/strongloop/loopback-next/pull/2704). This exercise discovered few problems in our current codebase, the non-trivial ones were fixed by standalone pull requests [PR#2733](https://github.com/strongloop/loopback-next/pull/2733), [PR#2711](https://github.com/strongloop/loopback-next/pull/2711) and [PR#2728](https://github.com/strongloop/loopback-next/pull/2728).

## Migration from LoopBack 3 to LoopBack 4

After we implemented [`mountExpressRouter`](https://loopback.io/doc/en/lb4/Routes.html#mounting-an-express-router), we continued on the [Migration epic](https://github.com/strongloop/loopback-next/issues/2479) and implemented a booter component for booting LoopBack 3 applications on a LoopBack 4 project. `Lb3AppBooterComponent` can be used to boot the LoopBack 3 application, convert its Swagger spec into OpenAPI version 3, and mount the LoopBack 3 application on the LoopBack 4 project. 

The component offers two modes to mount your LoopBack 3 application: the full application or only the REST router. By default, it will mount the full application, but you have the option to modify it to only the REST routes along with the base path the routes are mounted on top of. 

To see how to use the component, see [Boot and Mount a LoopBack 3 application](https://loopback.io/doc/en/lb4/Boot-and-Mount-a-LoopBack-3-application.html).

## Authentication

To support multiple authentication strategies in the revised [authentication system](https://github.com/strongloop/loopback-next/blob/master/packages/authentication/docs/authentication-system.md) in `@loopback/authentication` that we started last month, we introduced:

- an authentication strategy interface that contributed authentication strategies must implement
- an authentication strategy extension point to which contributed authentication strategies must register themselves as an extension
- documentation demonstrating how a contributed authentication strategy implements the authentication strategy interface and registers itself as an extension of the extension point, how a custom sequence is defined to introduce the authentication action, how the authentication action calls the authentication strategy provider to resolve a strategy by name, and how a controller method is decorated with the `@authenticate('strategy_name')` decorator to define an endpoint the requires authentication.

## Bug Fixes / Improvements

- We have relaxed the relation constraint checks to allow requests that include the constrained property as long as they provide the same property value as the one imposed by the constraint. See [PR#2754](https://github.com/strongloop/loopback-next/pull/2754).

- In the spike of the inclusion filter, we realized the importance of supporting cyclic references. 

  For example: 
  
  Model `CategoryWithRelations` has a property `products` containing an array of model `ProductWithRelations`. `ProductWithRelations` has a property `category` containing `CategoryWithRelations`.

  In April we have fixed generating the JSON schema for models with circular dependencies as the pre-work of the inclusion filter. Given the following model definitions:
  
  ```ts
    @model()
  class Category {
    @property.array(() => Product)
    products?: Product[];
  }

  @model()
  class Product {
    @property(() => Category)
    category?: Category;
  }
  ```
  
  Now you can call `getJsonSchema(Category)` and `getJsonSchema(Product)` to get the JSON schemas without running into an infinite reference error.

- OpenAPI code generation for naming and typing was improved. See [PR#2722](https://github.com/strongloop/loopback-next/pull/2722)

- Allow '-' to be used in in path template variable names. See [PR#2724](https://github.com/strongloop/loopback-next/pull/2724).

## Connector Bug Fixes/Improvements

- When using protocol mongodb+srv, the port must not be set in the connection url. See [PR#497](https://github.com/strongloop/loopback-connector-mongodb/pull/497) provided by the community.

- We now support the `fields` filter in the `loopback-connector-couchdb2`, you can retrieve the data in the Couchdb 2.0 database with specified fields. Check out the syntax of the filter in our [documentation](https://loopback.io/doc/en/lb3/Fields-filter.html).

- Add possibility to configure the foreign key constraint with 2 optional triggers for mysql : onUpdate and onDelete. See [PR#370](https://github.com/strongloop/loopback-connector-mysql/pull/370) provided by the community.

- We fixed our CI failing tests in Cloudant and MongoDB connectors to have green
builds on master. The Cloudant fixes required changes in [Juggler](https://github.com/strongloop/loopback-datasource-juggler/pull/1720) and [Cloudant](https://github.com/strongloop/loopback-connector-couchdb2/pull/59) for Cloudant/CouchDB connectors. See [PR#505](https://github.com/strongloop/loopback-connector-mongodb/pull/505) for the MongoDB fix. We aim to remove unneccessary MongoDB downstream builds in [Issue#509](https://github.com/strongloop/loopback-connector-mongodb/issues/509).

- In order to address coercion of deeply nested primitive datatypes (Number, Date etc.) as well as `Decimal128` MongoDB type, we've made some fixes in both Juggler and MongoDB connector. These changes address coercion of the nested properties on Create and Update operations. See [PR#501](https://github.com/strongloop/loopback-connector-mongodb/pull/501) and [PR#1702](https://github.com/strongloop/loopback-datasource-juggler/pull/1702) for the details. Unfortunately, a regression was introduced with Juggler [PR#1702](https://github.com/strongloop/loopback-datasource-juggler/pull/1702), and [PR#1726](https://github.com/strongloop/loopback-datasource-juggler/pull/1726) aims to fix it.

## Node.js 12

With Node.js 12.0.0 officially released (see [Introducing Node.js 12](https://medium.com/@nodejs/introducing-node-js-12-76c41a1b3f3f)), we are investigating effort required to support this new Node.js version.

LoopBack 4 has been already updated for Node.js 12.0.0, we had to tweak few places in `loopback-datasource-juggler` to make our test suite pass on the new runtime version - see [PR#1728](https://github.com/strongloop/loopback-datasource-juggler/pull/1728).

LoopBack 3 core packages `loopback` and `strong-remoting` work on Node.js 12.0.0 out of the box, `loopback-datasource-juggler` version 3 was fixed [PR#1729](https://github.com/strongloop/loopback-datasource-juggler/pull/1729).

In the next weeks and months, we are going to check our connectors and other LoopBack 3 packages like `loopback-cli`. If all goes well, then all LoopBack components and connectors will support Node.js 12 by the time it enters LTS mode in October this year.

## LoopBack 2.x reached end of life

After almost 5 years since the initial release, LoopBack version 2 has reached end of life and will not receive any new bug fixes. Specifically, no security vulnerabilities will be fixed in this version going forward. If you haven't done so yet, then you should migrate all projects running on LoopBack 2 to a newer framework version as soon as possible. See [LoopBack 3 Receives Extended Long Term Support](https://strongloop.com/strongblog/lb3-extended-lts/).

## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Reporting issues](https://github.com/strongloop/loopback-next/issues).
- [Contributing](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md)
  code and documentation.
- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Joining](https://github.com/strongloop/loopback-next/issues/110) our user group.