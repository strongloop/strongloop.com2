---
layout: post
title: LoopBack 4 Model Relations Preview
date: 2018-07-25T00:20:02+00:00
author: Biniam Admikew
permalink: /strongblog/loopback4-model-relations
categories:
  - Community
  - LoopBack
  - News
---

One of LoopBack's powerful features is the ability to link its models with [Model Relations]. The logic for related CRUD methods exposed by configuring relations in LoopBack 3 is implemented individually in `loopback-datasource-juggler`'s [relation-definition] source file. When thinking about relations in LoopBack 4, we decided to take a step back and explore ways we could simplify our relation implementation anew. Thus, I worked on a [spike] which aimed to utilize the concept of Repositories and constraint enforcement and flesh out what would be needed to implement the [hasMany] relation. With [Raymond] and [Miroslav]'s guidance and feedback, we were able to agree on the direction of relations in LoopBack 4 as follows:

- Relations are defined between models via relational properties on the source model. The relation metadata from the relational property is used to construct a constrained target repository instance. The property will return plain data   objects of the related model instances.

- The relational access is configured/resolved between repositories. For example, a `CustomerRepository` and an `OrderRepository` are needed to perform CRUD operations for a given customer and his/her orders. The source repository will have a navigational property which exposes the relation methods.

- Repository interfaces for relations define the available CRUD methods based on the relation type. Default relation repository classes implement those interfaces and enforce constraints on them using utility functions.

While I was working on the spike, [Miroslav] identified and fixed a limitation in our legacy juggler bridge which creates a new persisted model on a datasource every time we create a new instance of `DefaultCrudRepository` in [pull request 1302]. This is the key to ensure that the changes made to a constrained target repository created by relations are reflected in the non-relational target repository.

## Initial `hasMany` Implementation

In [pull request 1342], I worked on the first iteration of the relations spike which sought to add the following components using an acceptance test for a `hasMany` relation between a customer and order model:

- `constrainedRepositoryFactory` to create relational repository instances based on specified constraint and relation metadata.

- `HasManyEntityCrudRepository` interface which specifies the shape of the public APIs exposed by the HasMany relation.

- `DefaultHasManyEntityCrudRepository` class which implements those APIs by calling utility functions on a target repository instance to constrain its CRUD methods.

- `constrainDataObject, constrainDataObjects, constrainFilter, constrainWhere` utility functions which apply constraints on a data object, an array of data objects, filter, or where object.

Afterwards, in [pull request 1383], [Kyu] and I worked on adding more unit and integration test coverage for the components above. 

## Additional CRUD Methods for hasMany Relation

Meanwhile, [Janny] worked on making the available CRUD API set for `hasMany` relations complete in [pull request 1403]. The initial proposed list of CRUD APIs needed to be improved and she worked with [Miroslav] to simplify the relation API design.
She reworked `find` method, and added `delete` and `patch` methods which are applicable to one or more instances of the target model. Check out the [API Docs] for more information on those methods.

## hasMany Relation Decorator Inference

The initially involved implementation of `hasMany` relation expected users to explicitly declare the relation metadata and manually create the navigational property on a source repository by calling `constrainedRepositoryFactory`. [Kyu] and I went on to make UX simpler for users in terms of adding a `hasMany` relation to a LoopBack 4 application in [pull request 1438] with lots of great feedback from the team by:

- implementing `@hasMany` decorator which takes the target model class and infers the relation metadata and return type of the property it decorates as an array of the target model instances.
- storing relation metadata on the declaring model definition.
- modifying the function returned by `hasManyRepositoryFactory` function to only take in value of the PK/FK constraint instead of a key value pair for the PK (`{id: 5}` becomes just `5`}).
- creating a protected function `_createHasManyRepositoryFactory` in `DefaultCrudRepository` which calls `hasManyRepositoryFactory` using the metadata stored by `@hasMany` decorator on the source model definition and
  returns a constrained version of the target repository.

To visualize how the hasMany relation is set up, the following diagram illustrates a "customer has many
orders" scenario with two models Customer and Order. Note that the controllers
which expose the REST APIs are not shown.

<img class="aligncenter" src="https://strongloop.com/blog-assets/2018/07/hasMany-relation-overview.png" alt="hasMany Relation Overview" style="width: 450px; margin:auto;"/>

Check out our recent [Documentation] on how you can define and add a `hasMany`
relation to your LoopBack 4 application! If you would like to have a hands-on
experience doing it, check out our [example tutorial] which will take you
through the process step-by-step.

- [Model Relations](https://loopback.io/doc/en/lb3/Creating-model-relations.html)
- [relation-definition](https://github.com/strongloop/loopback-datasource-juggler/blob/master/lib/relation-definition.js)
- [spike](https://github.com/strongloop/loopback-next/issues/995)
- [hasMany](https://loopback.io/doc/en/lb3/HasMany-relations.html)
- [Raymond](https://github.com/raymondfeng)
- [Miroslav](https://github.com/bajtos)
- [pull request 1302](https://github.com/strongloop/loopback-next/pull/1302)
- [pull request 1342](https://github.com/strongloop/loopback-next/pull/1342)
- [pull request 1383](https://github.com/strongloop/loopback-next/pull/1383)
- [pull request 1438](https://github.com/strongloop/loopback-next/pull/1438)
- [Kyu](https://github.com/shimks)
- [Janny](https://github.com/jannyHou)
- [pull request 1403](https://github.com/strongloop/loopback-next/pull/1403)
- [API Docs](https://apidocs.strongloop.com/@loopback%2fdocs/repository.html#HasManyRepository)
- [Documentation](https://loopback.io/doc/en/lb4/Relations.html)
- [example tutorial](https://loopback.io/doc/en/lb4/todo-list-tutorial.html)

## Call for Action

LoopBack's future success counts on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
- [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
- [Reporting issues](https://github.com/strongloop/loopback-next/issues)
- [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
- [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)
