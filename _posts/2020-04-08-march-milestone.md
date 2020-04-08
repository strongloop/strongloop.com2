---
layout: post
title: LoopBack 4 March 2020 Milestone Update
date: 2020-04-08
author: Agnes Lin
permalink: /strongblog/march-2020-milestone/
categories:
  - Community
  - LoopBack
published: true
---

The whole world has been through a lot in the past month. The LoopBack team hopes that everyone stays safe and gets through this together.

Let's check out the work we did in March:
- [Migration Guide](#migration-guide)
- [From Model to REST API](#from-model-to-rest-api)
- [More Usage Scenarios](#more-usage-scenarios)
- [Miscellaneous](#miscellaneous)
- [Documentation Enhancement](#documentation-enhancement)
- [Community Contribution](#community-contribution)

<!--more-->

## Migration Guide

As LoopBack 3 will go end of life at the end of 2020, we've been focusing on the migration guide for the past months. Here is the content we added in March to help LB3 users adopt LoopBack 4:

### Migrating Built-in Authentication

In LoopBack 3, the authentication system is a token-based one and has built-in models involved in the mechanism. In LB4, we built a more flexible authentication system that is compatible with different authentication strategies. Even though there are lots of differences, the newly created [access control migration example](https://github.com/strongloop/loopback-next/tree/master/examples/access-control-migration) explores how to migrate and build an equivalent LoopBack 3 authentication system in LoopBack 4 with detailed steps. The tutorial includes two main parts: 

1. How to migrate the LoopBack 3 User model's definition and its persistence and login endpoint.
2. How to secure endpoints using a token based authentication system and enable the authorize dialog in the API explorer like what we have in LoopBack 3.

The tutorial also uses the handy LB4 CLI to help LB3 users to get familiar with LB4 terms. Read the [migration-authentication](https://loopback.io/doc/en/lb4/migration-authentication.html) tutorial to learn about the details.

### Features Not Planned for LoopBack 4

Besides migrating artifacts from LB3, there are several features/components we no longer support anymore in LB4. They are listed in the page [LoopBack 3 features not planned in LoopBack 4](https://loopback.io/doc/en/lb4/migration-not-planned.html). We also provide workarounds for these features if users would like to continue using them in LB4. 

## From Model to REST API

The story [From Model to REST API with no custom repository/controller epic](https://github.com/strongloop/loopback-next/issues/2036) is almost done! In the past few months, we created the [`@loopback/rest-crud`](https://github.com/strongloop/loopback-next/tree/master/packages/rest-crud) package, as well as the the `ModelApiBooter` booter. And this month, we built the CLI command `lb4 rest-crud`. To glue these pieces together, we added an example and documentation to help you pick up this convenience tool. Details are listed below. We will have a blog post in the near future.

### CLI Command

In order to make it easier for users to use this feature, we've added a CLI command to simplify the process. If you have model classes and a valid(_persisted_) datasource, the following command will generate model endpoints for you:

```sh
lb4 rest-crud
```

### Example Application

We've added a new [`rest-crud` example](https://github.com/strongloop/loopback-next/tree/master/examples/rest-crud) which creates the [`Todo` example](https://github.com/strongloop/loopback-next/tree/master/examples/todo) without the need to define a repository or controller for the Todo model. By loading the `CrudRestComponent`, it demonstrates how to use the default CRUD REST repository and controller with a single model class , datasource, and configuration. The example can be downloaded by running:

```sh
lb4 example rest-crud
```

You can find more information on how to use the command in the [REST CRUD generator documentation](https://loopback.io/doc/en/lb4/Rest-Crud-generator.html).

### Documentation

Now that most of the epic is completed, we've added [documentation](https://loopback.io/doc/en/lb4/Creating-crud-rest-apis.html) explaining how to use the feature and the configuration options that come with it. Additionally, we also added [documentation](https://loopback.io/doc/en/lb4/Extending-Model-API-builder.html) on extending the [`@loopback/model-api-builder`](https://github.com/strongloop/loopback-next/tree/master/packages/model-api-builder) package to create your own custom model API builders; similar to [`@loopback/rest-crud`](https://github.com/strongloop/loopback-next/tree/master/packages/rest-crud)'s [`CrudRestApiBuilder`](https://loopback.io/doc/en/lb4/apidocs.rest-crud.crudrestapibuilder.html).

## More Usage Scenarios

We've been adding more examples to show what you can build with, and how you can configure a LoopBack 4 app. One of our favorite examples is the [Shopping App](https://github.com/strongloop/loopback4-example-shopping/). It shows how you can integrate LB4 APIs with a simple front-end design to build a site. Besides the [`rest-crud`](#example-application) example mentioned above, we added more examples to show various LoopBack 4 features.

### Validation Example

LB4 allows you to add validations at three different layers: REST, controller, and ORM. The newly added documentation [Validation](#Validation.md) explains these three different types of validations. We added a corresponding example [Validation Example](https://github.com/strongloop/loopback-next/tree/master/examples/validation-app) to our [Examples list](https://loopback.io/doc/en/lb4/Examples.html) demonstrating how to add and make use of different kinds of validations in a LoopBack 4 application.

### File Upload and Download Example

Uploading/downloading files is a common requirement for API applications. The documentation for [Upload and download files](https://loopback.io/doc/en/lb4/File-upload-download.html) shows the code snippets to create artifacts such as controllers and UI to achieve such a requirement. A fully-functional example is available at [File Transfer Example](https://github.com/strongloop/loopback-next/tree/master/examples/file-transfer).

## Documentation Enhancement

We made some changes in the layout design of the website. Hope you like the new look!

### Request Response Cycle

To help users have a better understanding of all the components involved in the request-response handling process, in the  [Request-Response cycle](https://loopback.io/doc/en/lb4/Request-response-cycle.html) document, we walk through the path taken by a request to see how it makes its way through the various parts of the framework to return a result. In the near future, we will also add documentation in the migration guide to explain the differences of the request-response cycle between LB3 and LB4. See the GH story [Migration Guide: Request-response cycle](https://github.com/strongloop/loopback-next/issues/4836) for more details.

### CHANGELOG Docs

We made the CHANGELOG easier to find on our site. It is available in the section [CHANGELOG](https://loopback.io/doc/en/lb4/changelog.index.html). We hope it helps developers to check out the changes of different packages for each release.

## Miscellaneous

### User Testimonials

We're glad to see a growing number of user testimonials. We refactored it in a new page. Check out the [what our users say](https://loopback.io/what-our-users-say.html) section. [Let us know](https://github.com/strongloop/loopback-next/issues/3047) if you would like to tell us about your LoopBack usage!

### IBM i Connector

The [IBM Db2 for i connector](https://github.com/strongloop/loopback-connector-ibmi) was added to the connector list. You can now conveniently create an IBM Db2 for i datasource using our CLI. See the [Db2 for i connector page](https://loopback.io/doc/en/lb4/DB2-for-i-connector.html) for more details.


### Newly Added Extensions

Here are the extensions we added to the framework:

The IBM API Connect OpenAPI enhancer [@loopback/apiconnect](https://github.com/strongloop/loopback-next/tree/master/extensions/apiconnect) extension was added to extend LoopBack with the ability to integrate with [IBM API Connect](https://www.ibm.com/cloud/api-connect).

An experimental extension [`@loopback/cron`](https://github.com/strongloop/loopback-next/tree/master/extensions/cron) was added. With it, LB4 apps can be integrated with [Cron](https://github.com/kelektiv/node-cron) to schedule jobs using `cron` based schedules.

### Extracting JWT Component

After creating the demo for JWT authentication in [loopback4-example-shopping](https://github.com/strongloop/loopback4-example-shopping) and applying a similar system in [loopback-example-access-control](https://github.com/strongloop/loopback-next/tree/master/examples/access-control-migration), we think it's time to extract the JWT authentication system into a separate component. This will benefit users who want to quickly mount a prototype token based authentication module to their application. As the first step, we extracted the JWT strategies, the token, and user services into a local module under [components/jwt-authentication](https://github.com/strongloop/loopback-next/tree/master/examples/access-control-migration/src/components/jwt-authentication). Next we will move it to a standalone extension package. Feel free to join the discussion in GH story [Extract the jwt authentication to an extension module](https://github.com/strongloop/loopback-next/issues/4903).

### Supporting Type Any

Model property of type `any` is now supported. The corresponding OpenAPI and JSON schema is `{}` or `true` (according to [the draft JSON schema standard](https://json-schema.org/draft/2019-09/json-schema-core.html#rfc.section.4.3.2)). If your model property allows arbitrary values, now you can define it as:

```ts
class MyModel extends Entity {
  // ...other code
  @property({
    // specify the type name here as 'any'
    type: 'any'
  })
  // use `any` as its TypeScript type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  anyProperty: any
}
```

### Bug fixes

- We fixed a bug in module `@loopback-ibmdb` where a put request `PUT /Model/{instanceId}` now operates correctly. The fix trickles down into any LoopBack connector with a dependency on `@loopback-ibmdb` like `@loopback-connector-db2` and `@loopback-connector-dashdb`, for example.

- We fixed a bug in connector `@loopback-connector-mssql` which was causing permission problems during installation on Windows. Some extra folders ended up in the package tgz file, and this was causing the problem. The fix went out for several LoopBack connectors: MSSQL, DB2, dashDB, Cloudant, MongoDb, MySQL, Oracle, PostgreSQL, and Redis KeyValue. 

## Community Contribution

Our community maintainers and users have been very helpful with building a better LoopBack 4, we really appreciate all the help! Here are the highlights this month:

### Enable Authentication Strategies to Contribute OASEnhancer
The community maintainer [`dougal83`](https://github.com/dougal83) improved the authentication strategies `AuthenticationStrategy` so that it can be bound with the OAS enhancer extension point via a binding key instead of a constant.

### Japanese Translation for LB4

The community user [`saotak`](https://github.com/saotak) added several LB4 pages in Japanese. See [the site](https://loopback.io/doc/ja/lb4/index.html). We need your help to have more translations for the LB4 documentations! The instructions can be found in the page [Translation](https://loopback.io/doc/en/contrib/translation.html).

## Call to Action

In 2020, we look forward to helping you and seeing you around! LoopBack's success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Here's how you can join us and help the project:

- [Report issues](https://github.com/strongloop/loopback-next/issues).
- [Contribute](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md) code and documentation.
- [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Join](https://github.com/strongloop/loopback-next/issues/110) our user group.
