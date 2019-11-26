---
layout: post
title: LoopBack 4 2019 Q4 Overview
date: 2020-01-22
author:
  - Diana Lau
  - Agnes Lin
permalink: /strongblog/loopback4-2019-q4-overview/
categories:
  - LoopBack
  - Community
published: true
---

Happy New Year! The number of LoopBack 4 downloads in 2019 increased more than double than that in 2018. Thank you for your continuous support in using and contributing to LoopBack. We cannot do this alone and we really appreciate all the contributions from the community. In December, we were happy to have 3 community members join us as maintainers: [@derdeka](https://github.com/derdeka), [dougal83](https://github.com/dougal83) and [achrinza](https://github.com/achrinza)!

As year 2020 commences, let us summarize our development activities in the last quarter of 2019.

- [Migration Guide](#migration-guide): created the outline for general runtime migration and added details on migrating Express middleware and model relations.
- [Going cloud native](#going-cloud-native): added extensions for observability and deployment documentation
- [Authentication and authorization](#authentication-and-authorization): enhanced the documentation and enabled token based authentication in API Explorer
- [Inclusion of Related Models](#inclusion-of-related-models): completed MVP and ability to allow custom scope.
- [Partition Key with Cloudant and CouchDB](#partition-key-with-cloudant-and-couchdb): added support for partitioned database
- [Creating REST API from Model Classes](#creating-rest-api-from-model-classes): added the ability to generate controller from Model and Repository classes

<!--more-->

## Migration Guide

Enriching the [Migration Guide from LB3](https://github.com/strongloop/loopback-next/issues/453) story is our focus of this quarter and will continue to be the focus. Adding on top of the comparison between the concepts in LoopBack 3 and that in LoopBack 4, we created the skeleton on the areas that need more explanation in the migration. You can find it on our site: [Migration Guide](https://loopback.io/doc/en/lb4/migration-overview.html)

In Q4, we added pages for migrating: [Model](https://loopback.io/doc/en/lb4/migration-models-core.html), [Datasource](https://loopback.io/doc/en/lb4/migration-datasources.html), [Model Relation](https://loopback.io/doc/en/lb4/migration-models-relations.html), [Express Middleware](https://loopback.io/doc/en/lb4/migration-express-middleware.html), etc. If there are other topics you'd like to see in the migration guide, please let us know on [GitHub](https://github.com/strongloop/loopback-next/issues/453).

## Going Cloud Native

In the past few months, we made significant amount of enhancement in the cloud native area. Not only we added the extensions for logging, health check, tracing and metrics, we also created the deployment to Kubernetes tutorial in our shopping example application. For details, take a look at the [blog post](https://strongloop.com/strongblog/going-cloud-native-with-loopback-4/) from [Raymond](https://strongloop.com/authors/Raymond_Feng/).

Besides, the Node.js LoopBack stack provides a powerful solution to build microservices in TypeScript with LoopBack. Appsody is an open source project that makes creating cloud native applications simple. It has many cool features which are pre-configured with cloud native capabilities for Kubernetes and Knative deployments. In our detailed [Appsody with LoopBack Tutorial](https://loopback.io/doc/en/lb4/Appsody-LoopBack.html) on developing and deploying LoopBack applications, we would like to show you the possibility and potential of how these kinds of tools can work well with LoopBack of building microservices.

## Authentication and Authorization

We added the support for authentication and authorization in LoopBack 4. Check out the [Authentication page](https://loopback.io/doc/en/lb4/Loopback-component-authentication.html) and the [Authorization page](https://loopback.io/doc/en/lb4/Loopback-component-authorization.html) for the latest features. Want to try out a real-world example? We updated the [shopping example application](https://github.com/strongloop/loopback4-example-shopping) to use the authentication and authorization systems to help you get familiar with it.

Also, we made some progress on the story _allow users to have token-based authentication in API Explorer_ in Q4. Starting with [a spike](https://github.com/strongloop/loopback-next/issues/2027) as the blueprint, we now added an extension point for the OpenAPI enhancers as the first brick in the wall. Check out the ["Extending OpenAPI Specification"](https://loopback.io/doc/en/lb4/Extending-OpenAPI-specification.html) page for details. As always, we'd love to get any help from you. Here are some follow-up stories if you're interested in contributing:

- [Add OpenAPI enhancer service in @loopback/rest](https://github.com/strongloop/loopback-next/issues/4380)
- [Ordering the enhancers by group name for OpenAPI spec enhancer service ](https://github.com/strongloop/loopback-next/issues/4385)
- [Add bearer auth scheme as the default security scheme](https://github.com/strongloop/loopback-next/issues/4386)

## Inclusion of Related Models

We finished the Inclusion of Related Models [MVP](https://github.com/strongloop/loopback-next/issues/1352) in Q4! This addition not only simplifies querying data and reduces database calls in LoopBack 4, but it closes one feature gap between LoopBack 3 and LoopBack 4 as well.

In the past few months, we released a bunch of features such as [custom scope for inclusion](https://loopback.io/doc/en/lb4/HasMany-relation.html#query-multiple-relations), and we [added inclusion resolvers to lb4 relation CLI](https://github.com/strongloop/loopback-next/issues/3451), etc. We enhanced the [documentation](https://loopback.io/doc/en/lb4/HasMany-relation.html#querying-related-models) with examples and usages along with [a blog post](https://strongloop.com/strongblog/inclusion-of-related-models/) to show how you can query data over different relations easily. Still, there are some limitations and unfinished tasks. Check [Post MVP](https://github.com/strongloop/loopback-next/issues/3585) if you'd like to contribute.

## Partition Key with Cloudant and CouchDB

Speaking of better performance and manageability of databases, the database that supports partitioning is one of the ideal choices. Are you considering to use databases that have the feature such as Cloudant and CouchDB with LoopBack? We now support such features in the corresponding connectors. It not only makes the query less computationally, but also reduces cost for LoopBack users using the Cloudant service on IBM Cloud. We have prepared a tutorial and documentation to help you get started! See the details and examples on the usage in [Partition Databases](https://github.com/strongloop/loopback-connector-cloudant/blob/master/doc/partitioned-db.md).

## Creating REST API from Model

As LoopBack 4 provides more scalability and extensibility, we ask users to create artifacts such as Model, Datasource, Repository, and Controller to start building their applications. Compared to LoopBack 3, it adds complexity and extra steps to create APIs. This story aims to improve the developer experience for those who may not need that extra flexibility.

You might wonder how simple it would be. In the [spike](https://github.com/strongloop/loopback-next/pull/4235), if you already have the database (we use MySQL in the spike) and tables set up, you can create basic CRUD APIs just through the API Explorer. For example, all you need to do is to make a POST request with a valid MySQL connection string and a list of existing tables,

```ts
{
  "connectionString": "mysql://root@localhost/test",
  "tableNames": [
    "Coffeeshop"
  ]
}
```

then the new endpoints will be created for you.

Implementations are on the way! Feel free to try out the spike and join the discussion on GitHub :D

## What's Next?

If you have been following us, you probably realize that we now start our planning of the milestones and roadmaps with a pull request. We think it is useful to our users to get to know our plans and possibly provide inputs in our planning stage. See our [2020 Goals and Focus](https://github.com/strongloop/loopback-next/blob/master/docs/ROADMAP.md#2020-goals-and-focus) and [Q1 roadmap](https://github.com/strongloop/loopback-next/blob/master/docs/ROADMAP.md#q1-2020-roadmap). There is also the [Janurary milestone](https://github.com/strongloop/loopback-next/issues/4376).

## Previous Milestone Blogs

Check out our previously published monthly milestone blog posts in Q4 for more details:

- [October milestone blog](https://strongloop.com/strongblog/october-2019-milestone/)
- [November milestone blog](https://strongloop.com/strongblog/november-2019-milestone/)
- [December milestone blog](https://strongloop.com/strongblog/december-2019-milestone/)

If you want to see a 2019 summary, don't forget to check out [this blog](https://strongloop.com/strongblog/loopback-2019-review/)!

## Call for Action

LoopBack's success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Reporting issues](https://github.com/strongloop/loopback-next/issues).
- [Contributing](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md)
  code and documentation.
- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
