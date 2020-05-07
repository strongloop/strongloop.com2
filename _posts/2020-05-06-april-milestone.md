---
layout: post
title: LoopBack 4 April 2020 Milestone Update
date: 2020-05-06
author: Deepak Rajamohan
permalink: /strongblog/april-2020-milestone/
categories:
  - Community
  - LoopBack
published: true
---

In April, we focused mostly on completing migration activities, like the migration guide and other related
tasks like running existing tests in a LoopBack 3 application after composing it within a LoopBack 4 application. But, that didn't stop us from exploring and adding some cool features.

We now have a new [Express](https://github.com/strongloop/loopback-next/tree/master/packages/express) package, which enables modeling Express middleware functions as an interceptor chain. Also it is possible now to break a complex application into much smaller components and wire them in a main application. You can find more details on thsese below in [`Exploring new territories`](#exploring-new-territories).

Also our community has published many [LoopBack 4 extensions in NPM](https://www.npmjs.com/search?q=keywords:loopback-extension). Many of these extensions are addressing a variety of usecases like pub-sub messaging, mqtt, graphql, rate-limiting, authentication, logging, AWS cloud integration, etc. The extensibility of LoopBack in real time use cases are even surprising us and the possibilities seems to be endless.

- [Migration Guide](#migration-guide)
- [Exploring new territories](#exploring-new-territories)
- [APIConnect Extension](#apiconnect-extension)
- [Miscellaneous](#miscellaneous)
- [Documentation](#documentation)
- [Community Contributions](#community-contributions)

<!--more-->

## Migration Guide

We have made very good progress with migration guides and LoopBack 3 users should have a solid ground now to explore and migrate to LoopBack 4. The well used LoopBack 3 components are all covered with migrations examples and tutorials. There are certain components which are having fewer downloads per day, that are not covered yet. But we are pursuing steadily to address all migration questions.

### Differences in Request-Response Cycle

We have created a document describing the differences between the [request-response cycle](https://loopback.io/doc/en/lb4/LB3-vs-LB4-request-response-cycle.html) in LoopBack 3 and LoopBack 4. Those of you coming from LoopBack 3 will have a better understanding about how the request-response cycle works in LoopBack 4 compared to LoopBack 3.

The [LoopBack 4 request-response cycle documentation](https://loopback.io/doc/doc/en/lb4/Request-response-cycle.html) contains the details in more depth for LoopBack 4.

### Example to use Passport Strategies for Authentication in LoopBack 4

A new [Passport Login example](https://github.com/strongloop/loopback-next/tree/master/examples/passport-login) is now available. It shows how to use [Passport Strategies](http://www.passportjs.org/docs/) in LoopBack 4 as an independent authentication step in the application `Sequence` as well as standard express middleware. If you are using the loopback-component-passport in LoopBack 3, this example can help you migrate your application to LoopBack 4.

### Booting Migration Guide

Because of the architectural differences, the booting process is very different in LoopBack 3 and LoopBack 4. [This document](https://loopback.io/doc/en/lb4/LB3-vs-LB4-booting.html) describes the differences and lists the various artifacts that take part in the booting process in LoopBack 4.

### Custom Validation

The [data coercion and validation](https://loopback.io/doc/en/lb4/LB3-vs-LB4-request-response-cycle.html#data-coercion-and-validation) and [access to data before writing to the databases](https://loopback.io/doc/en/lb4/LB3-vs-LB4-request-response-cycle.html#access-to-data-before-writing-to-the-databases) sections of the [LB3 to LB4 request-response migration guide](https://loopback.io/doc/en/lb4/LB3-vs-LB4-request-response-cycle.html) deals with the topic of access and application of custom validation to data in Loopback 4.

### Differences between LB3 and LB 4 CLI Commands

The command line interfaces of LoopBack 3 and LoopBack 4 have some similarities, but also some differences. We have outlined these similarities and differences in [Migrating CLI usage patterns](https://loopback.io/doc/en/lb4/migration-cli.html).

## Exploring New Territories

### The NEW Express Package and Enabling Express Middleware as Interceptors

The new [Express Package](https://github.com/strongloop/loopback-next/tree/master/packages/express), has enabled injecting single and multiple express middleware functions as `interceptors` into `Controller` invocations and also as a middleware step in the application `Sequence` as follows:

The default sequence now has a Middleware step. It creates an invocation chain to call registered middleware handlers with the extension pattern. The sequence can be customized to have more than one Middleware step. Express middleware can also be wrapped as LB4 interceptors, which can in turn be added to global/class/method level. Move built-in cors and openapi endpoints as express middleware functions.

You can check the [express middleware page in loopback docs](https://loopback.io/doc/en/lb4/Express-middleware.html).

### Spike - Migrating OAuth2 Component

In story [#3959](https://github.com/strongloop/loopback-next/issues/3959) we explored the possibility and evaluated the required effort to migrate module [`loopback-component-oauth2`](https://github.com/strongloop/loopback-component-oauth2). Considering that LoopBack 4 currently focuses on the integration with third party OAuth 2.0 providers, and the module is complicated, we decide to defer the migration guide and demo a simplified server with OAuth 2.0 enabled on it.

You can find details about the mock server on page [migration-auth-oauth2](https://loopback.io/doc/en/lb4/migration-auth-oauth2.html).

### Running LoopBack 3 Tests when Mounted on a LoopBack 4 project

With users being able to [mount their LoopBack 3 tests on a LoopBack 4 project](https://loopback.io/doc/en/lb4/migration-mounting-lb3app.html), we explored how they can also migrate their LB3 tests onto the LB4 project. Documentation is [coming](https://github.com/strongloop/loopback-next/issues/5298), but if you want to see how an example of how to do it now, see the [spike](https://github.com/strongloop/loopback-next/pull/5251). The spike demonstrates running LB3 tests in the [`lb3-application` example](https://github.com/strongloop/loopback-next/tree/master/examples/lb3-application).

### Simplify your Complex Applications - Booting Component Applications

Users can now break down a complex application into much smaller components and wire them all together in a main application, with a new feature to [Boot up Component Applications](https://github.com/strongloop/loopback-next/pull/5304).

## APIConnect Extension

The [LoopBack APIConnect extension](https://github.com/strongloop/loopback-next/tree/master/extensions/apiconnect) is now tested by [publishing shopping app APIs, enhanced with the extension, on a IBM DataPower Gateway](https://github.com/strongloop/loopback-next/issues/4498).

We took the shopping example for a close-to-real-life scenario. This would help IBM APIConnect customers to develop their applications with LoopBack and manage them with IBM APIConnect.

Once LoopBack developers have their REST APIs created they could use the [LoopBack APIConnect extension](https://github.com/strongloop/loopback-next/tree/master/extensions/apiconnect) to enhance their OpenAPI spec with `x-ibm-` OpenAPI metadata. For the shopping example, we followed the [steps in the example repository](https://github.com/strongloop/loopback4-example-shopping/blob/master/kubernetes/docs/deploy-to-ibmcloud.md) to deploy to IBM Cloud and then imported the OpenAPI specification to APIConnect with [steps explained in the IBM developer portal](https://developer.ibm.com/apiconnect/2019/10/30/manage-and-enforce-openapi-v3-oai-v3/).

## Miscellaneous

### Extracting JWT Authentication to an Extension Module

After creating the demo for JWT authentication in [`loopback4-shopping-example`](https://github.com/strongloop/loopback4-example-shopping), and applied a similar auth system in [`access-control-migration`](https://github.com/strongloop/loopback-next/tree/master/examples/access-control-migration), we think it's time to extract the JWT authentication system into a separate extension package, so that people can quickly mount a component to try out the feature. 

Last month, we created the extension as [authentication-jwt](https://github.com/strongloop/loopback-next/tree/master/extensions/authentication-jwt), and its usage is well documented in the [README.md file](https://github.com/strongloop/loopback-next/tree/master/extensions/authentication-jwt).

### Strong-Soap Features and Support

Strong-Soap now supports validation of [anonymous simple types](https://github.com/strongloop/strong-soap/pull/275) and [RPC suffixes](https://github.com/strongloop/strong-soap/pull/271).

### Customizing Explorer Theme

As many community users show the interests in changing the look of explorer, we introduced a configuration property called `swaggerThemeFile` to specify user provided .css themes. For example:

```ts
// Inside application constructor
// customize the swagger-ui
this.configure(RestExplorerBindings.COMPONENT).to({
  swaggerThemeFile: '/theme-newspaper.css',
});
```

You can check the complete guide in section [customizing Swagger UI theme](https://github.com/strongloop/loopback-next/blob/956a6aa574995c6cdd5066f6af7b92a93382eefc/packages/rest-explorer/README.md#customizing-swagger-ui-theme).

### Move Datasource Configurations from .json to .ts File

To align with existing typescript files and dynamic configuration of datasources, we have [switched datasource configurations to .ts files](https://github.com/strongloop/loopback-next/pull/5000) from LoopBack 3 style json files. Please watch the [video tutorial](https://www.youtube.com/watch?v=S3BKXh7wDYE&feature=youtu.be) from Miroslav on migrating `Migrate LoopBack 4 datasource config to TypeScript`.

### Build with TS Project-References

LoopBack monorepo was configured in a hacky way to allow TypeScript to build individual packages. We have made [changes to leverage TypeScript's Project-References](https://github.com/strongloop/loopback-next/pull/5155). Project references are a new feature in TypeScript 3.0 that allow to structure TypeScript projects into smaller pieces.

### Other Build Features

Changes done to make [default compilation target as ES2018](https://github.com/strongloop/loopback-next/pull/5205) and enable all ES2020 features for `lib` configuration.

### Complex OpenAPI Validations

A list of AJV features have been added in the past few months including [AJV keywords](https://github.com/strongloop/loopback-next/pull/3539), [AJV extensibility](https://github.com/strongloop/loopback-next/pull/4979), [AJV service provider](https://github.com/strongloop/loopback-next/pull/4808) and [asynchronous validations](https://github.com/strongloop/loopback-next/pull/4762).

## Documentation

### Working with Data

In LoopBack 4, models describe the shape of data, repositories provide behavior like CRUD operations, and controllers define routes. It's easy to manipulate and query data with LB4. However, for a long time LoopBack 4 documentation was missing the _Woring with Data_ section and users were referencing the old docs in LoopBack 3. Even though LB3 has almost the same querying rules as LB4, the different styles between LB4 and LB3 sometimes are still causing confusion.

Gladly, we added that section with different filters under the page [Usage Scenarios - Working with Data](https://loopback.io/doc/en/lb4/Working-with-data.html). For each filter, we introduced the basic usage with Node.js and REST APIs and also show examples of using both APIs. For instance, we have an example of showing how the `limit` filter works with Node.js API and also the corresponding example of using REST. 

```
Node.js API:

await orderRepository.find({limit: 5});

REST:

/orders?filter[limit]=5
```

### Calling APIs with OpenAPI Specification

If you want to connect to a REST service with an OpenAPI description, the [OpenAPI connector](https://github.com/strongloop/loopback-connector-openapi) would be what you need. We updated the documentation in the [Calling other APIs and web services
](https://loopback.io/doc/en/lb4/Calling-other-APIs-and-web-services.html) to include this usage. Besides, we added more configuration details in the [OpenAPI connector docs page](https://loopback.io/doc/en/lb4/OpenAPI-connector.html).

## Community Contributions

### Added tsdocs for LoopBack Packages

Autogenerated API docs had descriptions empty for all packages which now fixed by [adding ts docs to all packages](https://github.com/strongloop/loopback-next/pull/4711). Please take a look at the [API docs](https://loopback.io/doc/en/lb4/apidocs.index.html) to see the difference.

### Consolidate Openapi Schema using a New Spec Enhancer

LoopBack users will be able to automatically extract schemas used in multiple places into `#/components/schemas` and replace the references with a `$ref`, with a [new OAS enhancer](https://github.com/strongloop/loopback-next/pull/4365).

## May Milestones

This month, we would like to work on the remaining items for the migration guide epic, documentation improvement and more. For more detials, take a look at our [May milestone list on GitHub](https://github.com/strongloop/loopback-next/issues/5301).

## Call to Action

In 2020, we look forward to helping you and seeing you around! LoopBack's success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Here's how you can join us and help the project:

- [Report issues](https://github.com/strongloop/loopback-next/issues).
- [Contribute](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md) code and documentation.
- [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Join](https://github.com/strongloop/loopback-next/issues/110) our user group.
