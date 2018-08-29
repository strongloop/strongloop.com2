---
layout: post
title: LoopBack 4 August 2018 Milestone Update
date: 2018-08-29
author: Taranveer Virk
permalink: /strongblog/august-2018-milestone/
categories:
  - Community
  - LoopBack
---

As August, the last full month of summer, comes to an end so does our [August milestone](https://github.com/strongloop/loopback-next/issues/1581). This was a busy month in which the general focus was on addressing feedback from early adopters of LoopBack 4 and features considered essential for General Availability (GA) later this year. There were also two security advisories (with fixes) issued for LoopBack 2/3 in August. Lastly, end of August means back to school - meaning we need to bid farewell to LoopBack maintainer [Kyu Shim (@shimks on GitHub)](https://github.com/shimks). It's not all farewells, though - we're happy to welcome [Mario Estrada (@marioestradarosa on GitHub)](https://github.com/marioestradarosa) as a LoopBack 4 maintainer.

Continue reading to learn more about our accomplishments and the growing community of LoopBack 4.

<!--more-->

## August Milestone Goals

### Relations

`belongsTo` relation is (almost) here! This new relation exposed a fundamental issue with our new relation engine (and circular dependencies between related models using multiple relations). Because of this challenge this work might not finish within August but should be done no later than the first week of September. Once completed, you'll be able to use the relation as follows:

```ts
// The Model
@model()
class Order extends Entity {
    @property({id: true})
    id: number;
    @belongsTo(() => Customer) // A resolver function is needed to overcome the circular dependency
    customerId: number;
}

// The Relation Repository
export class OrderRepository extends DefaultCrudRepository<
  Order,
  typeof Order.prototype.id
> {
  public customer: BelongsToFactory<Customer, typeof Order.prototype.id>;
  constructor(
    @inject('datasources.db') protected db: juggler.DataSource,
    @repository.getter('repositories.CustomerRepository')
    customerRepositoryGetter: Getter<CustomerRepository>,
  ) {
    super(Order, db);
    this.customer = this._createBelongsToRepositoryFactoryFor(
      'customerId',
      customerRepositoryGetter,
    );
  }
}
```

Stay tuned for a blog post dedicated to this new relation once the feature has landed. Track progress in [PR #1618](https://github.com/strongloop/loopback-next/pull/1618).

### Getting Ready for Production

As the team is working towards making LoopBack 4 ready production use, it's important we test out the framework in a production scenario. A number of initiatives in August are helping ensure we're production ready. 

- We're testing the framework by creating [an e-commerce store](https://github.com/strongloop/loopback-next/issues/1476). In August, we setup this new example repository [(loopback4-example-shopping)](https://github.com/strongloop/loopback4-example-shopping) and added the first component (a user profile componment). This led to a [variety of tweaks](https://github.com/strongloop/loopback-next/pull/1622) and follow up issues to improve the framework.

- We tried deploying our `@loopback/example-todo` example app to [IBM Cloud](https://www.ibm.com/cloud/) to see how much effort it would take. It didn't require a whole lot of effort! You can see the changes necessary to deploy to IBM Cloud [here](https://github.com/strongloop/loopback-next/pull/1574). A full deployment guide will be availble shortly in our documentation.

- In production, performance matters. LoopBack 4 now has a new [`@loopback/benchmarks`](https://github.com/strongloop/loopback-next/tree/master/benchmark) package that we use to benchmark the framework. This package has already helped to identify [an issue](https://github.com/strongloop/loopback-next/issues/1590) causing `POST` requests to be 10x slower than `GET` requests. This is something that will be fixed before GA.

- Full [OpenAPI 3.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md) compliance. LoopBack 4 is powered by OpenAPI but a few missing elements meant we weren't fully compliant with the spec. As per the spec, all path parameters are now required, more options are being added to control the `servers` URL and a `@responses` decorator is in the works (may extend into September) to set the response metadata.

- The new LoopBack 4 [website](http://v4.loopback.io/) has received a new addition to it in the form of the [Getting Started](http://v4.loopback.io/getting-started.html) page. Stay tuned for more pages to come in the refreshed LoopBack 4 style.

### ServiceMixin and Booter

LoopBack 4 now offers a ServiceMixin in the [`@loopback/service-proxy`](https://github.com/strongloop/loopback-next/tree/master/packages/service-proxy) package which allows easier registration of services and will soon allow for automatic discovery and regsitration of services via a new Booter. For new applications, the CLI now offers a choice to add `ServiceMixin` automatically to your Application.

### Bug Fixes

LoopBack 4 adoption has been growing amongst our community users and they've been helping us improve the framework by reporting bugs. This month we fixed 6 community reported LoopBack 4 bugs. You can learn about them in the [August milestone](https://github.com/strongloop/loopback-next/issues/1581). **Thank you to all the early adopters for helping us improve the framework!**

### TypeScript and Lerna 3.x

Both TypeScript and Lerna released major new versions (coincidentally both are now 3.x). LoopBack 4 has swiftly moved on to adopt the latest versions so we can take advantage of the latest features. My personal favorite feature is that TypeScript no longer requires [unnecessary imports for Mixins](https://github.com/strongloop/loopback-next/pull/1641).

```
// With TypeScript 2.x
// Binding and Booter imports are required to infer types for BootMixin	
import {BootMixin, Booter, Binding} from '@loopback/boot';

// With TypeScript 3.x
import {BootMixin} from `@loopback/boot`;
```

### KeyValue Repository

A common use case in modern production applications is to rely on a key-value store such as Redis. LoopBack 4 now has a [KeyValue Repository](https://github.com/strongloop/loopback-next/blob/master/packages/repository/src/repositories/kv.repository.ts) implementation that works with LoopBack 3.x connectors such as [`loopback-connector-kv-redis`](https://github.com/strongloop/loopback-connector-kv-redis) and [`loopback-connector-kv-extreme-scale`](https://github.com/strongloop/loopback-connector-kv-extreme-scale). You can see an example of KVRepository in action in [`loopback4-example-shopping PR#4`](https://github.com/strongloop/loopback4-example-shopping/pull/4).

### LoopBack 3

While LoopBack 4 might be the team's focus for the most part, we're still committed to supporting LoopBack 3. In August there were a number of efforts around LoopBack 3. 

- Migrate [`loopback-generator`](https://github.com/strongloop/generator-loopback/issues/355) from Yeoman version 0.24 to 3.x. That's right, 3 major versions! This has been a ginormous effort but will allow for better maintainability once LoopBack 3 enters LTS (when LoopBack 4 is released).

- We've fixed our DB2 and DashDB test instances so we can validate changes before they are merged.

- The following connectors are now offered under the more permissive MIT license:

  - [loopback-connector-mssql](https://github.com/strongloop/loopback-connector-mssql)
  - [loopback-connector-oracle](https://github.com/strongloop/loopback-connector-oracle)
  - [loopback-connector-soap](https://github.com/strongloop/loopback-connector-soap)

#### Module LTS Policy

LoopBack has now adopted the [CloudNativeJS](https://www.cloudnativejs.io/) Module LTS policy. In case you missed it, you can read about it in our earlier blog post [**LoopBack Adopts Module LTS Policy**](https://strongloop.com/strongblog/loopback-adopts-module-lts-policy)

#### Security Fixes

LoopBack takes security related matters very seriously. In August, we addressed 2 security issues that were brought to our attention and the following advisories were issued:

- AccessToken API (if exposed) allows anyone to create a Token _[LoopBack 2](https://loopback.io/doc/en/lb2/Security-advisory-08-08-2018.html), [LoopBack 3](https://loopback.io/doc/en/lb3/Security-advisory-08-08-2018.html)_
- `loopback-connector-mongodb` allows NoSQL Injections _[LoopBack 2](https://loopback.io/doc/en/lb2/Security-advisory-08-15-2018.html) [LoopBack 3](https://loopback.io/doc/en/lb3/Security-advisory-08-15-2018.html)_

Ensure you are using the latest available versions so you are protected from these vulnerabilities!

### NodeSummit Updates

In the July milestone While the recordings from NodeSummit 2018 aren't yet available, you can read about my experience of attending and presenting at NodeSummit for the first time ever [here](https://strongloop.com/strongblog/my-firsts-at-nodesummit-2018/).

## Farewell Kyu

Time flies, it seems as if it was only yesterday that [Kyu Shim (@shimks on GitHub)](https://github.com/shimks) joined the LoopBack team as our newest intern (but it was in fact in September 2017). Now with September right around the corner, it's time for him to head back to university but not before he's made his mark on the project with over 800 contributions to the project over the past year. The entire team wishes you the very best for the rest of your studies, future career and life in general.

_P.S. Stay tuned to learn about the new intern joining the LoopBack team in September._

## Welcoming Mario Estrada as a Contributor

[Mario Estrada (@marioestradarosa on GitHub)](https://github.com/marioestradarosa) is the newest non-IBM contributor to join LoopBack 4. As the project picks up steam, Mario became an early adopter of the project, provided us feedback and shared his experience with the framework. Then he created [`@loopback/example-soap-calculator`](https://github.com/strongloop/loopback-next/tree/master/examples/soap-calculator), an example app (with a complete step by step tutorial) showing how to integrate a SOAP Service with LoopBack 4. Along the way he's also made contributions in the forms of bug fixes, suggestions, issues, reviews, and more. We're thrilled with your enthusiasm for the project and the positive impact you've had and will continue to have on the project.

## September Milestone

It's a work in progress but you can see our September commitments and priorities [here](https://github.com/strongloop/loopback-next/issues/1653).

## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
- [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
- [Reporting issues](https://github.com/strongloop/loopback-next/issues)
- [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
- [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)
