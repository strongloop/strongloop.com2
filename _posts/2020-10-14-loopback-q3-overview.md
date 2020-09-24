---
layout: post
title: LoopBack 4 2020 Q3 Overview
date: 2020-10-21
author: Diana Lau
permalink: /strongblog/loopback-4-2020-q3-overview/
categories:
- LoopBack
- Community
published: true
---

Fall is the season of the harvest. We're glad to see the good progress that we've made in the past 3 months, together with the contributions from the community. In September, there is record high percentage (25.6%) of the merged PRs which are coming from the community. Thank you all!

If you haven't heard of [Hacktoberfest](https://hacktoberfest.digitalocean.com/) happening this month, check out the details in our [previous blog on Hacktoberfest](https://strongloop.com/strongblog/2020-hacktoberfest/). There's still time to join. For those who participated, we appreciated your contributions. 

Let's take a look some of the highlights in the last quarter by you and the LoopBack team.

<!--more-->

## Integrate with TypeORM, TypeGraphQL and MessagePack

One of our strategies to add value to LoopBack is to leverage third-party libraries and integrate with them. We created the following extensions:

- [`@loopback/typeorm`](https://www.npmjs.com/package/@loopback/typeorm): enables [TypeORM](https://typeorm.io/) support in LoopBack
- [`@loopback/graphql`](https://www.npmjs.com/package/@loopback/graphql): integrates with [TypeGraphQL](https://typegraphql.com/) for creating GraphQL API https://loopback.io/doc/en/lb4/GraphQL.html
- [`@loopback/rest-msgpack`](https://www.npmjs.com/package/@loopback/rest-msgpack): adds support to allow receive [MessagePack](https://msgpack.org/index.html) requests and transparently convert it to a regular JavaScript object. It provides a BodyParser implementation and a component to register it. 


## Reorganize and Enhance Documentation

To better organize our content and easier for navigation/discovery, we reorganized our content based on [four quadrants](https://documentation.divio.com): tutorials, how-to guides, concepts and reference guides. To find out more how our documentation is organized, see [this documentation page](https://loopback.io/doc/en/lb4/#how-is-our-documentation-organized).

Besides the ongoing [refactoring work](https://github.com/strongloop/loopback-next/issues/5783), we enriched the content and clarified on some of the topics that are frequently asked by you. For example, we:
- [cleaned up the documentation about LoopBack extension](https://loopback.io/doc/en/lb4/Extending-LoopBack-4.html) so that your extension creation experience would be easier and smoother. We'll continue to make some more improvement in this area as well. 
- enhanced the content for [authentication](https://loopback.io/doc/en/lb4/Authentication-overview.html) and [authorization](https://loopback.io/doc/en/lb4/Authorization-overview.html) to include basic concepts, usage and examples. 
- added a section on [accessing multiple models inside a transaction](https://loopback.io/doc/en/lb4/Using-database-transactions.html#accessing-multiple-models-inside-one-transaction)

## Other Key Feature Highlights

There were many features, fixes and enhancements in the past few months, and here are some highlights:
- completed the [HasManyThrough relation](https://loopback.io/doc/en/lb4/HasManyThrough-relation.html)
- [improved REST experience](https://strongloop.com/strongblog/august-2020-milestone/#improving-rest-experience) by adding a [middleware based sequence](https://loopback.io/doc/en/lb4/REST-middleware-sequence.html)
- added [support for applying multiple authentication strategies to one endpoint](https://loopback.io/doc/en/lb4/Authentication-component-decorator.html)
- implemented the [refresh token service](https://github.com/strongloop/loopback-next/tree/master/extensions/authentication-jwt#endpoints-with-refresh-token) in the `@loopback/authentication-jwt` extension
- added the [support of OpenAPI parameter AJV validation](https://github.com/strongloop/loopback-next/pull/6285) on simple types and [AJV formats for OpenAPI spec data type formats](https://github.com/strongloop/loopback-next/pull/6262).

## Encourage Community Contributions

In a [recent blog post](https://strongloop.com/strongblog/2020-community-contribution/), we shared our views on encouraging more community contributions to match with our growing user community. The [switch to Developer Certificate of Origin (DCO)](https://loopback.io/doc/en/contrib/code-contrib.html#developer-certificate-of-origin-dco) as the contribution method is a change we made to make your contribution process easier. We also created a [community extension documentation page](https://loopback.io/doc/en/lb4/Community-extensions.html) to showcase LoopBack extensions built by the community. 

In addition, we are pleased to have [@nabdelgadir](https://github.com/nabdelgadir) and [@madaky](https://github.com/madaky) to be one of our community maintainers. We appreciate the great work you’ve done and welcome to the team.

## Previous Milestone Blogs

There are many more accomplishments that cannot be captured in this blog, make sure you check out our previously published monthly milestone blog posts in Q3 for more details:
- [July summary](https://strongloop.com/strongblog/july-2020-milestone)
- [August summary](https://strongloop.com/strongblog/august-2020-milestone)
- [Sept summary](https://strongloop.com/strongblog/september-2020-milestone/)

## Enriching LoopBack and its Community - You are Invited!

Your contribution is important to make LoopBack a sustainable open source project. 

Here is what you can do:
- [Join LoopBack Slack community](https://join.slack.com/t/loopbackio/shared_invite/zt-8lbow73r-SKAKz61Vdao~_rGf91pcsw)
- [Look for first-contribution-friendly issues](https://github.com/strongloop/loopback-next/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
- Give us feedback and join our discussion in [our GitHub repo](https://github.com/strongloop/loopback-next)
- Limited time only: [Join the Hacktoberfest](https://strongloop.com/strongblog/2020-hacktoberfest/) in the month of October

Let's make LoopBack a better framework together!