---
id: 29189
title: Announcing LoopBack.next, the Next Step to Make LoopBack Effortlessly Extensible
date: 2017-04-13T08:37:15+00:00
author: Ritchie Martori
guid: http://strongloop.com/?p=29189
permalink: /strongblog/announcing-loopback-next/
categories:
- Community
- LoopBack
---

## History

In 2013, we started LoopBack as a
mobile-backend-as-a-service, evolving out of earlier efforts such as
[Deployd](http://deployd.com/) and
[JugglingDB](https://github.com/1602/jugglingdb). Users quickly told us that what they needed wasn't a backend-as-a-service itself, but a framework to build their own MBaaS. We built LoopBack on top of the popular
[Express](http://expressjs.com/) library and based it on open standards to ensure compatibility. We developed it in the open to ensure we could address users' problems and needs.

{% include image.html file="2017/04/powered-by-LB-med.png" %}

## What's Next?

The core LoopBack team has talked to thousands of people about LoopBack over the past three and a half years. These discussions have molded our thinking about what users need and how to proceed.
more

LoopBack's active user base means that the core team gets many feature requests. LoopBack users have asked for support for features such as
[ES6 classes](https://github.com/strongloop/loopback/issues/2083),
[TypeScript](https://github.com/strongloop/loopback/issues/1692), and
[GraphQL](https://github.com/strongloop/loopback/issues/1841) and many others.

The core code has reached a point in complexity that makes hard or impossible to add such features. This complexity also makes it difficult to add new contributors to the project. The next version addresses these problems by starting from a new small, powerful, fast, and flexible core.

This new core will allow us to greatly improve the LoopBack developer experience. On top of the core, we're working on adding better tooling, new integrations with OpenAPI (Swagger), and making significant performance improvements to routing.

The basic goal of LoopBack remains the same: to make it easy to build apps that use new or existing data. With LoopBack.next, our goal is to take the solid foundation of LoopBack and make it effortlessly extensible. We're referring to this release as "LoopBack.next" (even though it likely will be LoopBack version 4) to emphasize the fact that it will be a major advance from previous releases, while retaining the same overall goal.

## What's Changing?

We plan on adding some important new features:

* 100% promise-based APIs and
async and
await as first-class keywords.

* Ability to use either JavaScript or TypeScript.

* Better extensibility, ability to override any aspect of the framework (for example, no more built-in User model pain, easily replace parts of ACL with your own).

* Define APIs / remote methods with OpenAPI (Swagger).

* Organize business and other logic into controllers with their own opinionated API or generate an PersistedModel style API.

* Better routing performance (new Trie-based router).

* Plus other user-driven features.
[Propose your ideas on GitHub](https://github.com/strongloop/loopback-next/issues).

## What's The Same?

We are committed to providing the same features and user experience as in previous versions of LoopBack. We know that migrating major versions can suck, and we will work to make upgrading to LoopBack.next as easy as possible.

You'll still be able to:

* Automatically generate APIs based on a model.

* Use the DataSource Juggler and connectors from 3.x.

* Use the same query syntax.

## Get Involved

We've been lucky that the users of LoopBack have created an active ecosystem around the framework. With LoopBack.next, there will be even more ways for users to extend, expand, and augment LoopBack functionality. Although there's a long way to go before the first release of LoopBack.next, the time to get involved is now.

As Jennifer Pahlka (of
[Code for America](https://www.codeforamerica.org/)) likes to say, "Decisions are made by those who show up." Want to help decide what happens in LoopBack.next? All you have to do is show up. Take a look at where we are at now with the project in the
[loopback-next repo](http://github.com/strongloop/loopback-next) and follow the project on GitHub to get updates on changes. Create issues to start conversations about what you care about.

Want to get involved but not sure where to start? Try one of these:

* [Read the FAQ](https://github.com/strongloop/loopback-next/wiki/FAQ)

* [Take a look at the LoopBack.next Overview](https://github.com/strongloop/loopback-next/wiki/Overview)

* [Join the LoopBack.next contributors list](https://github.com/strongloop/loopback-next/issues/110)

* [Chime in on the Controllers MegaThread](https://github.com/strongloop/loopback-next/issues/111)

* [Read more about upcoming releases](https://github.com/strongloop/loopback-next/wiki/Roadmap)
