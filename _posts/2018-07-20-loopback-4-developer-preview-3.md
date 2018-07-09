---
layout: post
title: Announcing LoopBack 4 Developer Preview 3
date: 2018-06-27T00:00:00+00:01
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

Let's take a closer look at each epic!

<!--more-->

## Robust HTTP Processing Capabilities

- decided to use Express as our low level HTTP transport provider because of Express' maturity and richer middleware ecosystem.
- a new package `@loopback/http-server` was created to decouple the HTTP/HTTPs server creation and management responsibilities from @loopback/rest
- rework internals to use Express request/response types

## Integration with REST /SOAP Services

- calling other Web services (REST, SOAP, etc) with `@serviceProxy` decorator
- users can continue to leverage the existing connectors such as loopback-connector-soap and loopback-connector-grpc
- for details, check out [Calling other APIs and Web Services documentation page](http://loopback.io/doc/en/lb4/Calling-other-APIs-and-web-services.html).

## Model Relations Preview

- created the infrastructure (decorators and dependency injection??) to support model relations
- added support of `hasMany` relation

## Validation and Type conversion

- coerce primitives in query and path parameter as well as the headers
- minimal validation on the input parameters using AJV

## Usability Enhancements

- CLI to create data source, model, etc
- CLI to create from openapi spec
- --help
- express vs custom mode

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
[april-milestone]: https://strongloop.com/strongblog/april-2018-milestone/
[may-milestone]: https://strongloop.com/strongblog/may-2018-milestone/
[june-milestone]: https://strongloop.com/strongblog/june-2018-milestone/
