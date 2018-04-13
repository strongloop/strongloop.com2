---
layout: post
title: Announcing LoopBack 4 Developer Preview 2
date: 2018-04-16T00:00:13+00:00
author: Diana Lau, Raymond Feng
permalink: /strongblog/loopback-4-developer-preview-2/
categories:
- Community
- LoopBack
---

Since the release of [Developer Preview #1][dp1]
in November 2017, the LoopBack team have been focusing on adding features for application developers to define and implement REST APIs with Controllers and Repositories. 
We also continue to improve the core modules of the framework, such as Decorator/Metadata and
Context/Dependency Injection. A lot of efforts are put into documentation and
developer productivity. We're pleased to announce that Developer Preview #2
of LoopBack 4 is available today!

## Highlights of Developer Preview 2

* [New LoopBack logo determined by our community](#new-loopback-logo-determined-by-our-community)
* [BootStrapper and booters for Repository and Controller](#repository-and-controller-bootstrapper)
* [OpenAPI v3 support for staying with the latest technologies](#openapi-v3-support)
* [Enhanced command-line interfaces for better developer experience](#enhanced-command-line-interfaces)
* [Decorator and metadata utilities](#dgiecorator-and-metadata-utilities)
* [Improved IoC container and Dependency Injection](#improved-ioc-container-and-dependency-injection)
* [Improved documentation](#improved-documentation)
* [Simplified and improved development process](#development-process)
* [Generation of JSON schema from models](#generation-of-json-schema-from-models)

Let's take a closer look at each highlight.

<!--more-->

### New LoopBack logo determined by our community

Based on the [feedback from the community][logo], we settled on the new logo
for LoopBack 4, representing the framework being rewritten from the ground-up
with better extensibility and flexibility. Big shout out to our design team!

<img src="http://loopback.io/images/branding/mark/blue/loopback.jpg" alt="LoopBack new logo" style="width: 100px; margin:auto;"/>

### Repository and Controller BootStrapper

In Developer Preview #1, application developers have to register artifacts such
as controllers and repositories by code. We have added [`@loopback/boot`][boot-git]
to automatically discover artifacts and bind them to your Application’s Context
by convention. In this release, we have implemented the `Repository` and
`Controller` booters. This reduces the amount of manual effort required to
bind artifacts for dependency injection at scale. Check out [this blog][boot-blog]
for more details.

### OpenAPI v3 support

[OpenAPI Specification][oas] provides a standard format to unify how an industry
defines and describes RESTful APIs. To keep up with the latest technologies,
[LoopBack 4 has upgraded the support for OpenAPI v3][swagger-to-oas3]. Now you
can use OpenAPI v3 based decorators to define how your controllers are mapped
to REST APIs.

### Enhanced command-line interfaces

You can now use `lb4 controller` to [generate controllers][controller-blog]
and `lb4 example` to download examples. For details, see the [CLI documentation][cli-doc].

### Decorator and metadata utilities

To leverage TypeScript decorators for metadata management and dependency
injection, we have introduced the [`@loopback/metadata`][metadata] package,
which contains utilities to help developers implement TypeScript decorators,
define/merge metadata, and inspect metadata.

### Improved IoC container and Dependency Injection

We have made significant improvements to the IoC container for better dependency
injection capabilities, such as:

1.  Context objects now have names
2.  Optional dependencies are allowed
3.  `@inject.context` for Context object injection
4.  Ability to track binding resolution and dependency injection tree to detect
    circular dependencies. See [this blog][di-blog] for more details
5.  More flexible `find` methods to match bindings within a context
6.  Strong-typed binding creation and resolution for type safety

### Improved documentation

In addition to our continued effort to improve LoopBack 4 documentation,
we've revamped the [Getting Started tutorial][todo] to include step-by-step
instructions in creating your first LoopBack 4 application. We also moved the
documentation source to the `loopback-next` github repository under `docs`. See
[this blog][docs-blog] for more details. API references for all LoopBak 4
packages are also generated into the `docs` as well. It is published to NPM as
`@loopback/docs`. The loopback.io site now serves documentation for LoopBack 4
from the npm module.

### Simplified and improved development process

We have made a few changes to keep us on top of the latest technology stack and
simplify our development process and infrastructure. It also improves developer
productivity.

Features includes:

* [Dropping Node 6 support][node6-blog]
* [Switching to 0.x.y versions from 4.0.0-alpha.X][0.x.y] to better indicate breaking changes
* [Refine the monorepo layout for better grouping](https://github.com/strongloop/loopback-next/pull/1231)

  * `packages`: core modules
  * `examples`: example apps
  * `docs`: documentation
  * `sandbox`: sandbox testing

* Refine the build scripts for performance and much better VSCode integration
  (error reporting, debugging, formatting)

### Generation of JSON schema from models

We also created a new module `@loopback/repository-json-schema` which leverages TypeScript's decorator metadata in building a standard representation of LoopBack 4 models as JSON schema and creating legacy juggler model definitions. Visit [this blog][json-schema-blog] for more detailed look and implications!

## What's next

Going forward, we'll be progressively providing richer functionalities to the framework,
such as [model relation](https://github.com/strongloop/loopback-next/issues/1032) and [type conversion](https://github.com/strongloop/loopback-next/issues/755). Stay tuned for our [plan][plan].
Please note that we may make adjustment along the way.

## Call for action

LoopBack’s future success counts on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

* [Report bugs or feature requests](https://github.com/strongloop/loopback-next/issues)
* [Contribute code/documentation](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md)
* [Join the team](https://github.com/strongloop/loopback-next/issues/110)

[dp1]: https://strongloop.com/strongblog/loopback-4-developer-preview-release
[logo]: https://strongloop.com/strongblog/thanks-loopback-4-logo/
[boot-git]: https://github.com/strongloop/loopback-next/tree/master/packages/boot
[boot-blog]: https://strongloop.com/strongblog/introducing-boot-for-loopback-4
[oas]: https://github.com/OAI/OpenAPI-Specification
[swagger-to-oas3]: https://strongloop.com/strongblog/upgrade-from-swagger-to-openapi-3/
[controller-blog]: https://strongloop.com/strongblog/generate-controllers-loopback-4-cli/
[cli-doc]: http://loopback.io/doc/en/lb4/Command-line-interface.html
[todo]: http://loopback.io/doc/en/lb4/todo-tutorial.html
[metadata]: https://github.com/strongloop/loopback-next/blob/master/packages/metadata
[di-blog]: https://strongloop.com/strongblog/loopback-4-track-down-dependency-injections/
[node6-blog]: https://strongloop.com/strongblog/loopback-4-dropping-node6
[docs-blog]: https://strongloop.com/strongblog/march-2018-milestone/
[0.x.y]: https://github.com/strongloop/loopback-next/issues/954
[json-schema-blog]: https://strongloop.com/strongblog/loopback-4-json-schema-generation
[plan]: https://github.com/strongloop/loopback-next/wiki/Upcoming-Releases
