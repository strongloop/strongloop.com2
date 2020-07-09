---
layout: post
title: LoopBack 4 June 2020 Milestone Update
date: 2020-07-08
author:
  - Hage Yaapa
  - Miroslav Bajtoš
permalink: /strongblog/june-2020-milestone/
categories:
  - Community
  - LoopBack
published: true
---

Documentation restructuring, TypeORM support, and HasManyThrough were the three main accomplishments in the month of June. Based on the community feedback, documentation improvement remains our number one priority in the coming month. Besides, while welcoming Nathan Chen join as a maintainer of the `strong-globalize` repo, we said farewell to Deepak. 

Here is what we did in the month June:

- [Documentation Improvements](#documentation-improvements)
- [HasManyThrough](#hasmanythrough)
- [TypeORM Support](#typeormsupport)
- [Miscellaneous](#miscellaneous)

<!--more-->

## Documentation Improvements

### New Documentation Structure

When writing documentation for new features, we were often struggling to find the right place to put the content and the right form to frame the information. Recently, we discovered a documentation system based on four different functions. It explains why we were struggling and provides a structure to guide us when writing new content.

> Documentation needs to include and be structured around its four different functions: tutorials, how-to guides, technical reference and explanation. Each of them requires a distinct mode of writing. People working with software need these four different kinds of documentation at different times, in different circumstances - so software usually needs them all, and they should all be integrated into your documentation.

In June, we explored how to apply this documentation system to our content and implemented first high-level changes in the way how our content is organized. Check out [loopback-next#5549](https://github.com/strongloop/loopback-next/issues/5549) to find more resources about our new documentation system.

In a series of incremental pull requests, we reworked our documentation structure as follows:

- Renamed "Usage scenarios" to "How-to guides" to make it clear what kind of content is there.
- Placed all explanation-related pages in "Behind the scenes" section and removed the section "Key concepts".
- Relocated all reference guides to be nested under "Reference guides". We moved pages like "Error handling" and "Reserved binding keys" to references guides to make them easier to find.
- Moved pages from "Using components" to "How-to guides".
- Added support for sidebar sections that are just grouping related pages together but don't have a page of their own. This allowed us to remove few section pages that were rather anemic: "Access databases", "Reference guides", "How-to guides".
- Reworked the "Server" page in "Behind the scenes" because there was a mix of different kinds of content in the page. We extracted some of the guides into new pages nested under "How-to guides".

The re-organized documentation is already live at [loopback.io](https://loopback.io/doc/en/lb4), take a look and let us know what do you think!

Now that the new structure is in place, we are going to gradually review and update existing documentation content to align it with the new system. You can find the list of relevant tasks in [loopback-next#5113](https://github.com/strongloop/loopback-next/issues/5113). As always, your help is welcome!

### Alignment Along Abstraction Levels

As we were incrementally adding new features to the framework and extracting building blocks into standalone packages, our documentation ended up describing concepts from different abstraction layers in the same place, mixing information for framework users with references to low-level building blocks. This resulted in a steep learning curve for new users, because there were so many concept and packages to learn about!

In June, we reorganized most of our documentation to focus on framework-level APIs and deemphasize lower-level building blocks. As a result, we updated our developer documentation to describe which packages are considered as building blocks, see [Organization of content](https://loopback.io/doc/en/lb4/code-contrib-lb4.html#organization-of-content). We also:

- [updated our packages and documentation pages to use `@loopback/core` instead of `@loopback/context`](https://github.com/strongloop/loopback-next/pull/5625)
- [removed `@loopback/metadata` from framework-level documentation and replaced references to use `@loopback/core` instead](https://github.com/strongloop/loopback-next/pull/5696)
- [removed `@loopback/express` from framework-level documentation and replaced references to use `@loopback/rest` instead](https://github.com/strongloop/loopback-next/pull/5693)

Now we need to update places referring to `@loopback/openapi-v3`, as discussed in [loopback-next5692](https://github.com/strongloop/loopback-next/issues/5692). Want to contribute those changes yourself? Submit a PR today!

### Refactoring of Authentication-related Documentation

We refactored the authentication documentation so that it is easier for beginners to follow. As the new entry page, the [authentication overview page](https://loopback.io/doc/en/lb4/Authentication-overview.html) describes a typical scenario for securing APIs and it also helps you understand what "authentication" means in LoopBack 4. Next you can follow a simple hands-on tutorial [secure your LoopBack 4 application with JWT authentication](https://loopback.io/doc/en/lb4/Authentication-tutorial.html) to start exploring this feature. Then you can gradually learn the authentication system's mechanism and how to implement your own authentication strategies.

### Adding LoopBack 4 Content to Connector Pages

As the continuation of improving connector documentation, after updating the PostgreSQL connector, we updated the connector page and added three more tutorials for [MySQL](https://loopback.io/doc/en/lb4/Connecting-to-MySQL.html), [Oracle](https://loopback.io/doc/en/lb4/Connecting-to-Oracle.html), and [MongoDB](https://loopback.io/doc/en/lb4/Connecting-to-MongoDB.html) connectors in June. By walking you through the steps of creating a LB4 application and connecting to a certain database, we hope new users find the tutorial helpful to adopt LoopBack 4 better. Besides the basic setup steps, we also added some sections to explain those questions that are being asked a lot from the community. Check out these documentations under [Database connectors](https://loopback.io/doc/en/lb4/Database-connectors.html).

## HasManyThrough

A `HasManyThrough` relation sets up a many-to-many connection through another model. At the moment, LB4 only supports three basic relations: `HasMany`, `BelongsTo`, and `HasOne`.

Thanks to the initial work by [`codejamninja`](https://github.com/codejamninja) and [`derdeka`](https://github.com/derdeka), we have a working prototype of the feature.

While functional, the [PR](https://github.com/strongloop/loopback-next/pull/2359) is pretty huge and some of the parts are up for discussion. As a result, we started to extract the core parts of the implementation into smaller PRs so that it's easier for review. In June, we had the basic operations working and tests are added. As the next step, we'll be adding documentation.

Stay tuned with the progress by going to [loopback-next #5835](https://github.com/strongloop/loopback-next/issues/5835).

## TypeORM Support

We have implemented initial support for TypeORM in LoopBack. All it takes to enable TypeORM is to compose your app with the `TypeOrmMixin` mixin.

```ts
import {BootMixin} from '@loopback/boot';
import {RestApplication} from '@loopback/rest';
import {TypeOrmMixin} from '@loopback/typeorm';
export class MyApplication extends BootMixin(TypeOrmMixin(RestApplication)) {
  ...
}
```

For details about using TypeORM with LoopBack, refer to the `@loopback/typeorm` [doc](https://github.com/strongloop/loopback-next/blob/master/packages/typeorm/README.md).

Complete support for TypeORM is a significant amount of work. While the initial work is done, we're looking for ways to improve the implementation in the following areas.

1. Complete TypeORM to OpenAPI data type conversion (currently only `number`,
   `string`, and `boolean` are supported)
2. Full JSON/OpenAPI schema for models, including variants like with/without id,
   with/without relations, partial, etc.
3. Json/OpenAPI schema to describe the supported filter format
4. Support for LoopBack-style filters
5. Custom repository classes (e.g. to implement bookRepo.findByTitle(title)).
6. Database migration

## Miscellaneous

We upgraded `mocha` to the new version 8. This version brings support for running tests in parallel (yay!), but also drops support for `--opts` argument and `test/mocha.opts` file. See [Mocha 8.0.0 release notes](https://github.com/mochajs/mocha/releases/tag/v8.0.0) for the full list of breaking changes and instructions on migrating existing projects. Our changes were introduced by [loopback-next#5750](https://github.com/strongloop/loopback-next/pull/5750) and [loopback-next#5710](https://github.com/strongloop/loopback-next/pull/5710); and published in `@loopback/build` version `6.0.0`.

[Miroslav](https://strongloop.com/authors/Miroslav_Bajtoš) benchmarked the performance of LoopBack and found an opportunity for a quick but significant improvement. By changing the algorithm used in `@loopback/context` to generate unique context instance names, we managed to improve the performance of our REST API layer by 45%! Learn more in the blog post [How We Improved LoopBack REST Performance by 45%](https://strongloop.com/strongblog/2020-improve-looopback-performance-uuid/).

A new method `exportOpenApiSpec()` was added to the `RestServer` for generating OpenAPI specs in JSON or YAML format. This method can be called from the project directory by running the `openapi-spec` script.

When a binding key is not bound,`ResolutionError` now captures more contextual information. Earlier it used to print a long stack trace and was not easy to find out where the failure happened.

The implementation of binding cache was [improved](https://github.com/strongloop/loopback-next/pull/5731) to prevent race conditions and better handle bindings in async conditions.

`CoreBindings.APPLICATION_INSTANCE` now has corresponding `@config()` decorator.

## July Milestones

In the month of July we will continue focusing on improving the documentation. You can see the whole list on the [July milestone issue](https://github.com/strongloop/loopback-next/issues/5837).

There is also ongoing work to have [native GraphQL support](https://github.com/strongloop/loopback-next/pull/5545) and a [new extension for pooling service](https://github.com/strongloop/loopback-next/pull/5681). Your feedback is welcome.

## Welcome and Goodbyes

We're pleased to welcome [Nathan Chen](https://github.com/codechennerator) as the maintainer of the [strong-globalize](https://github.com/strongloop/strong-globalize) repo. Thank you Nathan for all the good work you've done. On the other hand, it's sad to see [Deepak](https://strongloop.com/authors/Deepak_Rajamohan/) leaving the LoopBack team. We wish him best of luck in his new adventure.

## Call to Action

In 2020, we look forward to helping you and seeing you around! LoopBack's success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Here's how you can join us and help the project:

- [Report issues](https://github.com/strongloop/loopback-next/issues).
- [Contribute](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md) code and documentation.
- [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Join](https://github.com/strongloop/loopback-next/issues/110) our user group.
