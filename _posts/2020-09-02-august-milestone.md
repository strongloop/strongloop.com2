---
layout: post
title: LoopBack 4 August 2020 Milestone Update
date: 2020-09-02
author: Janny Hou
permalink: /strongblog/august-2020-milestone/
categories:
  - Community
  - LoopBack
published: true
---

Our focus in August is the documentation restructure. The layout of several main sections are reorganized for easier navigation. Another significant improvement is about the request handling. More flexible approaches of adding LoopBack style middleware and express middleware are introduced in `@loopback/rest`.

We would like to appreciate [Agnes Lin](https://github.com/agnes512)'s great contributions during her internship. There has been so much fun and pleasure working with her! She will be continue helping us part time. Good luck with your school.

Keep reading to learn about the improved documentation and recently added features!

<!--more-->

## Documentation Enhancements

### Reorganizing the Concepts List

The fundamental concepts were listed in section "Behind the Scene" sorted by the publish date. To have a concise name and a more organized layout for users to search, we renamed the section to be "Concepts" and restructured the documentations into the following sub-sections:

- Crafting LoopBack 4
- Core
- REST APIs
- Data Access

You can visit the more organized contents in [https://loopback.io/doc/en/lb4/Concepts.html](https://loopback.io/doc/en/lb4/Concepts.html).

### Reorganizing How-to Guide List

The "How-to Guide" is also reorganized by topics. The existing tutorials are classified into the following sections for users to search quickly:

- Building REST APIs
- Creating Other Forms of APIS
- Accessing Databases
- Accessing Services
- Validating Data
- Securing Applications
- Deploying Applications
- Troubleshooting

You can visit the more organized contents in [https://loopback.io/doc/en/lb4/](https://loopback.io/doc/en/lb4/).

### Adding Property Types

We added documentation for LoopBack 4 types including the syntax of model property definition in page [https://loopback.io/doc/en/lb4/LoopBack-types.html](https://loopback.io/doc/en/lb4/LoopBack-types.html).

### Adding Application Layout

We added project layout for LoopBack 4 applications in page [https://loopback.io/doc/en/lb4/Loopback-application-layout.html](https://loopback.io/doc/en/lb4/Loopback-application-layout.html), users can find each file's meaning and responsibility in the application scaffolded by `lb4 app`.

### Cleaning up Extensions

We are seeing more users creating extensions and it's a good time to make the extension creation experience easier and smoother. Therefore the extension generator and related documentations are updated to align with the latest code base. You can check the latest material in:

- [Concept Component](https://loopback.io/doc/en/lb4/Component.html)
- [Creating Components](https://loopback.io/doc/en/lb4/Creating-components.html)

And run `lb4 extension` to create extensions with the new component template.

### Renaming Legacy Juggler

The term "legacy juggler bridge" might give the wrong impression to users that the `loopback-datasource-juggler` won't be supported or not working well because of the "legacy" word. So we removed the misleading word "legacy" across the documentations and CLI prompts.

`loopback-datasource-juggler` is still well maintained and we have a plan to modernize it. Feel free to join the discussion in [issue #5956](https://github.com/strongloop/loopback-next/issues/5956) if you are interested.

## Investigation

### Restructuring Connector Reference

The current connector contents are mixed with how-to guides, references and tutorials. The spike story [5961](https://github.com/strongloop/loopback-next/issues/5961) came up with a better plan to reorganize them into the four quadrants layout:

- Connector concepts, its role in the framework and its relations to other artifacts will go to section "Concepts/Datasources".
- Datasource level configurations and features like migration/discovery will go to section "How-to Guides/Configuring DataSource".
- All the other connector specific tutorials will go to section "Tutorials/Connect to back-end tutorial".

## Improving REST Experience

### REST Middleware

A big feature took place in `@loopback/rest` to support more flexible ways to add express middleware for handling requests. PR [#5366](https://github.com/strongloop/loopback-next/pull/5366) added a middleware based sequence and wrapped existing actions as middleware. The new usage is documented in the following pages:

- Concept [Middleware](https://loopback.io/doc/en/lb4/Middleware.html) in LoopBack 4.
- [Middleware-based Sequence for REST Server](https://loopback.io/doc/en/lb4/REST-middleware-sequence.html)

### Optimizing Middleware Based Sequence

PR [#6062](https://github.com/strongloop/loopback-next/pull/6062) optimized middleware based sequence and its middleware providers to be singletons:

- MiddlewareSequence is now a singleton and it caches a list of middleware.
- Built-in middleware providers are now singletons.
- Validating sorted middleware groups is supported. Error will be reported if a middleware is unreachable.

### Improving Serviceability of @loopback/rest

There are several improvements made for easier debugging and error tracing in `@loopback/rest` module:

- PR [#6159](https://github.com/strongloop/loopback-next/pull/6159) added more debug information for request parsing, routing, and method invocation. The debugging keywords are `loopback:rest:find-route`, `loopback:rest:invoke-method`, and `loopback:rest:parse-param`.

- The route description is improved in PR [#6188](https://github.com/strongloop/loopback-next/pull/6168) to include the verb and the path.

- PR [#6171](https://github.com/strongloop/loopback-next/pull/6171) added HTTP server options and status information in the debug string. The debugging keyword is `loopback:http-server`.

## Switching to DCO

To [make your contribution process simpler](https://strongloop.com/strongblog/switching-to-dco/), we have changed the contribution method from CLA to DCO for `loopback-next` and most of the connector repositories. Be sure to sign off your commits using the `-s` flag or adding `Signed-off-By: Name<Email>` in the commit message. For more details, see [https://loopback.io/doc/en/contrib/code-contrib.html](https://loopback.io/doc/en/contrib/code-contrib.html#developer-certificate-of-origin-dco).

## Miscellaneous

- PR [#6172](https://github.com/strongloop/loopback-next/pull/6172) makes sure the REST options are passed to http-server.

- PR [#6105](https://github.com/strongloop/loopback-next/pull/6105) Reworked the validation code to use exiting `RestHttpErrors.invalidData` error. This way the error object includes the parameter name in the error message & properties and has a machine-readable code property.

## Community Contributions

Thank you for the contribution coming from the community. Here are some of the contributions that we'd like highlight:

- Thanks to [Nico Flaig](https://github.com/nflaig)'s [contribution](https://github.com/strongloop/loopback-next/pull/5735)! Now `@loopback/authenticate` supports applying multiple authentication strategies to one endpoint. The new syntax of decorator is:
  ```ts
  @authenticate(
    strategyOne | strategyOneWithOptions, 
    strategyTwo | strategyTwoWithOptions
  )
  myFunction() {}
  ```
  The new syntax is well documented in page [Authentication Decorator](https://loopback.io/doc/en/lb4/Authentication-component-decorator.html).

- We appreciate [Madaky](https://github.com/madaky)'s feature PR [#5589](https://github.com/strongloop/loopback-next/pull/5589) which adds the token refresh service in extension `@loopback/authentication-jwt`. You can check the [new guide](https://github.com/strongloop/loopback-next/tree/master/extensions/authentication-jwt#endpoints-with-refresh-token) to try it.

- Many thanks to [Rifa Achrinza](https://github.com/achrinza)'s contribution in PR [6153](https://github.com/strongloop/loopback-next/pull/6153). The order filter now supports string value as the shortcut in addition to the existing array value. You can specify an order filter as `{order: 'name DESC'}`.

## Enriching LoopBack and its Community - You are Invited!

As mentioned in our [recent blog post](https://strongloop.com/strongblog/2020-community-contribution/), your contribution is important to make LoopBack a sustainable open source project. 

Here is what you can do:
- [Join LoopBack Slack community](https://join.slack.com/t/loopbackio/shared_invite/zt-8lbow73r-SKAKz61Vdao~_rGf91pcsw)
- [Look for first-contribution-friendly issues](https://github.com/strongloop/loopback-next/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
- Give us feedback and join our discussion in [our GitHub repo](https://github.com/strongloop/loopback-next)

Let's make LoopBack a better framework together!