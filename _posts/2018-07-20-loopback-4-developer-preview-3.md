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

Whether you have been creating Node.js application using LoopBack 4 or wondering when is a good time to start building something serious, LoopBack 4 Developer Preview 3 is the release that you should not miss!

Since the previous release of [LoopBack 4 Developer Preview 2][dp2-announcement], we have been focusing on filling the gaps so that our users can start creating LoopBack 4 applications for production. To enable that, there are 5 major epics in this release:

- [Robust HTTP processing capabilities](#robust-http-processing-capabilities)
- [Integration with REST / SOAP services](#integration-with-rest-soap-services)
- [Model relations Preview](#model-relations-preview)
- [Validation and Type conversion](#validation-and-type-conversion)
- [Usability Enhancements](#usability-enhancements)

With Developer Preview 3, you can create a LoopBack application that connects to the backend resources, for example, connecting to a database or calling out to other REST and legacy SOAP web services. There are various command-line interfaces to help you create the artifacts along the way.

Let's take a closer look at each epic!

<!--more-->

## Robust HTTP Processing Capabilities

We have discussed in [this blog post](https://strongloop.com/strongblog/loopback4-improves-inbound-http-processing) that we are using Express under the hood for HTTP processing capabilities but bring some parts of Kao design into LoopBack. We have:

1.  Added context types `HandlerContext` and `RequestContext` to act as a context for low-level HTTP code
2.  Integrated Express into RestServer’s request handler
3.  Introduced a factory for HTTP(S) endpoints for setting up HTTP server

## Integration with REST /SOAP Services

With `@serviceProxy` decorator, users can continue to leverage the existing connectors, such as [loopback-connector-soap][loopback-connector-soap] and [loopback-connector-grpc][loopback-connector-grpc], to call other web services. For details, check out [Calling other APIs and Web Services documentation page](http://loopback.io/doc/en/lb4/Calling-other-APIs-and-web-services.html).

## Model Relations Preview

In real-world applications, it is common to have models related to each other. We created the infrastructure to support model relations in this release and added support of `hasMany` relation. For more details, see [the relation documentation page](link) and try out the [example](link).

## Validation and Type Conversion

We added the support to coerce primitive types in query and path parameters as well as the headers. There is also minimal validation on the input parameters and request bodies using [AJV][ajv]. Check out the [documentation](link) for more details.

## Usability Enhancements

User experience has been a focus for LoopBack 4. In this release, we have added the [command-line interface][cli] for creating data source and model, the `lb4 datasource` and `lb4 model` command, respectively. We now also have the `lb4 openapi` command to generate corresponding artifacts from OpenAPI 2.0 and 3.0 specs.

Besides, we introduced 2 flavors of command-line interfaces: express vs custom mode, tailored for different usage scenarios. For more information, see [this blog post](link).

## What's Next?

Moving towards the GA release, we are planning to build a [fictitious e-commerce store][estore] to validate that we cover the common usage scenarios of real-world LoopBack-based applications. We'll keep you posted on new features added to the framework in our monthly milestone blog posts.

## Call for Action

LoopBack's future success counts on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
- [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
- [Reporting issues](https://github.com/strongloop/loopback-next/issues)
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
[loopback-connector-soap]: https://www.npmjs.com/package/loopback-connector-soap
[loopback-connector-grpc]: https://www.npmjs.com/package/loopback-connector-grpc
[estore]: https://github.com/strongloop/loopback-next/issues/1476
[april-milestone]: https://strongloop.com/strongblog/april-2018-milestone/
[may-milestone]: https://strongloop.com/strongblog/may-2018-milestone/
[june-milestone]: https://strongloop.com/strongblog/june-2018-milestone/
