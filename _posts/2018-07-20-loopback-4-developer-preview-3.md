---
layout: post
title: Announcing LoopBack 4 Developer Preview 3
date: 2018-07-20T00:00:00+00:01
author: Diana Lau
author: Raymond Feng
author: Miroslav Bajtos
permalink: /strongblog/loopback-4-developer-preview-3
categories:
  - Community
  - LoopBack
---

Whether you have been creating Node.js application using LoopBack 4 or wondering when is a good time to start building something serious, LoopBack 4 Developer Preview 3 is the release that you don't want to miss!

With Developer Preview 3, you can now create a LoopBack application that can persist Models to a database using LoopBack 3 connectors or call out to other REST and legacy SOAP web services. There are new CLI commands to help you create artifacts along the way.

Since the previous release of [LoopBack 4 Developer Preview 2][dp2-announcement], we have been focused on filling the gaps so that you can start creating production ready LoopBack 4 applications. To enable that, there are 5 major epics in this release:

- [Robust HTTP processing capabilities](#robust-http-processing-capabilities)
- [Integration with REST / SOAP services](#integration-with-rest-soap-services)
- [Model relations preview](#model-relations-preview)
- [Validation and type conversion](#validation-and-type-conversion)
- [Improved artifact generation](#improved-artifact-generation)

Let's take a closer look at each epic!

<!--more-->

## Robust HTTP Processing Capabilities

We have discussed in [this blog post](https://strongloop.com/strongblog/loopback4-improves-inbound-http-processing) that we are using Express under the hood for HTTP processing capabilities but bring some parts of Koa design into LoopBack. We have:

1.  Added context types `HandlerContext` and `RequestContext` to act as a context for low-level HTTP code
2.  Integrated Express into RestServer’s request handler
3.  Introduced a factory for HTTP(S) endpoints for setting up HTTP server

## Integration with REST /SOAP Services

With `@serviceProxy` decorator, users can continue to leverage the existing connectors, such as [loopback-connector-soap][loopback-connector-soap] and [loopback-connector-grpc][loopback-connector-grpc], to call other web services. For details, check out [Calling other APIs and Web Services documentation page](http://loopback.io/doc/en/lb4/Calling-other-APIs-and-web-services.html).

## Model Relations Preview

In real-world applications, it is common to have models related to each other. We created the infrastructure to support model relations in this release and added support for the first relation, `hasMany`. For more details, see [the relation documentation page][relation-docs] and try out the [example](link).

## Validation and Type Conversion

There is now support to coerce primitive types (convert string values to appropriate types) in headers, query and path parameters. There is also minimal validation on the input parameters and request bodies using [AJV][ajv]. Check out the [documentation](link) for more details.

## Improved Artifact Generation

User experience has been a focus for LoopBack 4. In this release, we have added a variety of new [CLI commands][cli]:

- `lb4 datasource` for creating a datasource
- `lb4 model` for creating a model
- `lb4 openapi` to generate corresponding artifacts from OpenAPI 2.0 and 3.0 specs.

Along with the new commands, we've introduced support for an express mode that allows you to accept default values for some prompts. For more information, see [this blog post](https://strongloop.com/strongblog/loopback4-openapi-cli/).

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
[loopback-connector-soap]: https://www.npmjs.com/package/loopback-connector-soap
[loopback-connector-grpc]: https://www.npmjs.com/package/loopback-connector-grpc
[estore]: https://github.com/strongloop/loopback-next/issues/1476
