---
layout: post
title: Announcing LoopBack 4 Developer Preview 3
date: 2018-07-20T00:00:01+00:00
author: 
  - Diana Lau
  - Raymond Feng
  - Miroslav Bajtos
permalink: /strongblog/loopback-4-developer-preview-3
categories:
  - Community
  - LoopBack
---

Whether you have been creating Node.js application using LoopBack 4 or wondering when it's a good time to start building something serious, LoopBack 4 Developer Preview 3 is the release that you don't want to miss!

With Developer Preview 3, you can now create a LoopBack application that can persist Models to a database using LoopBack 3 connectors or call out to other REST and legacy SOAP web services. There are new CLI commands to help you create artifacts along the way.

Since the previous release of [LoopBack 4 Developer Preview 2][dp2-announcement], we have been focused on filling the gaps so that you can start creating production ready LoopBack 4 applications. To enable that, there are 5 major epics in this release:

- [Improved artifact generation](#improved-artifact-generation)
- [Integration with REST / SOAP services](#integration-with-rest-soap-services)
- [Model relations preview](#model-relations-preview)
- [Validation and type conversion](#validation-and-type-conversion)
- [Robust HTTP processing capabilities](#robust-http-processing-capabilities)

Let's take a closer look at each epic!

<!--more-->

## Improved Artifact Generation

User experience has been a focus for LoopBack 4. In this release, we have added a variety of new [CLI commands][cli].

### Streamlined creation of datasources and models

We reduced the amount of boilerplate that application developers need to write by introducing two new CLI commands:

- `lb4 datasource` for creating a datasource and
- `lb4 model` for creating a model.

Together with the existing `lb4 controller` command for creating a REST Controller, LoopBack's CLI tooling covers the most of the path from zero to a CRUD API exposing a database table to REST clients.

### Quickstart from OpenAPI spec

The new CLI command `lb4 openapi` makes it easy to jump from an OpenAPI document describing the intended API to a skeleton of a server application implementing that API.

Please note this command is intended as a one-time step to speed up the initial development, we don't update the generated code to match changes made to the OpenAPI document after the initial code generation was run.

### Express (non-interactive) mode

Along with the new commands, we've introduced support for an express mode that allows you to provide answers via JSON and use default values for remaining optional prompts. For more information, see [this blog post](https://strongloop.com/strongblog/loopback4-cli-express-mode). This new express mode makes it easier to leverage `lb4` CLI in external tools that use different means to gather user input, for example an HTML-based GUI.

## Integration with REST /SOAP Services

A typical API implementation often needs to interact with REST APIs, SOAP Web Services, gRPC microservices, or other forms of APIs.

To facilitate calling other APIs or web services, we introduced `@loopback/service-proxy` module to provide a common set of interfaces for interacting with backend services.

This new module allows you to leverage the existing connectors, such as [loopback-connector-soap][loopback-connector-soap] and [loopback-connector-rest][loopback-connector-rest], while keeping your application code following the Service and Dependency Injection design patterns we introduced in LoopBack 4.

For details, check out [Calling other APIs and Web Services documentation page](http://loopback.io/doc/en/lb4/Calling-other-APIs-and-web-services.html).

## Model Relations Preview

In real-world applications, it is common to have models related to each other. For example, a `Customer` model usually has many associated `Order` instances. We created the infrastructure to support model relations in this release and added support for the first relation, `hasMany`. For more details, see [the relation documentation page][relation-docs] and try out the [example][relation-example].

## Validation and Type Conversion

Implementing robust validation by hand is repetitive and time consuming. Fortunately, OpenAPI allows developers to declaratively describe constraints imposed on API inputs. Knowledge of these constraints is important for developers consuming the API from client applications, but it also allows the server application to implement an automatic validation to enforce conformance with the specified API.

In this release, we made several improvements to LoopBack's REST layer:

- For parameter values coming from headers, query and path, LoopBack coerces the values to the appropriate primitive types as requested by the OpenAPI parameter specification. For example, a numeric `id` parameter provided in the URL path as a string is converted to the JavaScript type `number` before it's passed down to controller methods.

- As part of the coercion algorithm, we perform a minimal validation to ensure the input is a valid value for the target type. For example, a numeric parameter `id` rejects requests where the `id` value is a string like `me@example.com`.

- Request bodies are fully validated against the schema provided by the developer. Internally, we are using [AJV][ajv] to perform the validation.

Check out the [documentation][validation-docs] for more details.

## Robust HTTP Processing Capabilities

We have discussed in [this blog post](https://strongloop.com/strongblog/loopback4-improves-inbound-http-processing) that we are using Express under the hood for HTTP processing capabilities but bring some parts of Koa design into LoopBack. We have:

1.  Added context types `HandlerContext` and `RequestContext` to act as a context for low-level HTTP code
2.  Integrated Express into RestServer’s request handler
3.  Introduced a factory for HTTP and HTTPS endpoints for setting up HTTP server

These changes allows application developers to quickly switch from serving HTTP to HTTPS just by changing application's configuration.

## What's Next?

Moving towards the GA release, we are planning to build a [fictitious e-commerce store][estore] to validate that we cover the common usage scenarios of real-world LoopBack-based applications. We'll keep you posted on new features added to the framework in our monthly milestone blog posts.

## Call for Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Reporting issues/Sharing feedback](https://github.com/strongloop/loopback-next/issues)
- [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
- [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
- [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
- [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)

[dp2-announcement]: https://strongloop.com/strongblog/loopback-4-developer-preview-2/
[dp3-scope]: https://github.com/strongloop/loopback-next/issues/1330
[http-hardening]: https://github.com/strongloop/loopback-next/issues/1038
[service-integration]: https://github.com/strongloop/loopback-next/issues/1036
[model-relation]: https://github.com/strongloop/loopback-next/issues/1032
[conversion]: https://github.com/strongloop/loopback-next/issues/755
[calling-other-apis]: http://loopback.io/doc/en/lb4/Calling-other-APIs-and-web-services.html
[ajv]: https://www.npmjs.com/package/ajv
[cli]: https://loopback.io/doc/en/lb4/Command-line-interface.html
[relation-docs]: https://loopback.io/doc/en/lb4/Relations.html
[relation-example]: https://loopback.io/doc/en/lb4/todo-list-tutorial.html
[loopback-connector-soap]: https://www.npmjs.com/package/loopback-connector-soap
[loopback-connector-rest]: https://www.npmjs.com/package/loopback-connector-rest
[estore]: https://github.com/strongloop/loopback-next/issues/1476
[validation-docs]: https://loopback.io/doc/en/lb4/Parsing-requests.html
