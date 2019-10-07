---
layout: post
title: LoopBack 4 2019 Q3 Overview
date: 2019-10-16
author:
  - Diana Lau
  - Agnes Lin
permalink: /strongblog/loopback-4-2019-q3-overview/
categories:
  - LoopBack
  - Community
published: false
---

For the past few months, the LoopBack team has been busy improving the framework. Aside from implementation, we also did some investigation to plan out road map for the incoming new features. Here are our main focuses in last quarter:

- [Authentication](#authentication): released `@loopback/authentication@3.x` version.
- [Authorization](#authorization): experimental feature which provides basic support for authorization.
- [Inclusion of Related Models](#inclusion_of_related_models): query data over relations with `inclusionResolver`.
- [Creating REST API from Model Classes](#creating_rest_api_from_model_classes): the proposed design to allow users create REST API with less code.
- [Importing LoopBack 3 Models](#importing_loopBack_3_models): migrate your LB3 applications to LB4 with command `lb4 import-lb3-models`.

We have a monthly blog reviewing what we've done in each milestone. To stay tuned, don't forget to follow us on Twitter [@StrongLoop](https://twitter.com/@StrongLoop).

Let's take a closer look at each of the epic.

<!--more-->

## Authentication

We have recently released `@loopback/authentication` 3.0. We refactored some common types/interfaces in both authentication and authorization packages and moved them to the new `@loopback/security` package. This helps combine the operations over these two packages. We also improved the `@authenticate` decorator so that users can apply the default authentication metadata without adding the decorator `@authenticate` to every route. Also, methods that don't require authentication can be skipped by adding `@authenticate.skip`.

Apart from enhancing codebase, we also updated the related documentation and examples. Developers can easily follow tutorials and examples to try out setting up their own authentication systems.

Moreover, we did some researches into potential solutions for the new features. In [spike #267](https://github.com/strongloop/loopback4-example-shopping/pull/267) we were exploring a way to enable the authorization header setting from the API Explorer. And in [spike #3771](https://github.com/strongloop/loopback-next/pull/3771), we tried to find a solution to make `UserProfile` interface more flexible so that users have more controls over authentication. Check the links for discussions and proposal details.

## Authorization

We released an experimental version of [`@loopback/authorization`](https://loopback.io/doc/en/lb4/Loopback-component-authorization.html). The authorization system now allows developers to decorate their endpoints with `@authorize()`. By plugging in their own authorizers, it is able to determine whether a user has access to the resource.

Besides the basic functionalities, we also made `@authorize()` more flexible: users now can define their own voters/authorizers, apply `@authorize` at the class level, and use the new `@authorize.skip` annotation. All these improvements allow developers to have more control to shape the authorization system.

## Inclusion of Related Models

We have made good progress in this epic this quarter. We completed and released the implementation of `inclusionResolver` of relations. It allows LoopBack 4 users to query data over relations more easily. The `todo-list` tutorial is also updated with the usage of `inclusionResolver`. Check LB4 site [Relations](https://loopback.io/doc/en/lb4/Relations.html) and the [`todo-list` tutorial](https://loopback.io/doc/en/lb4/todo-list-tutorial.html) to get started. We will make this feature easier to use by adding it to CLI command. Stay tuned for more details!

## Creating REST API from Model Classes

In LoopBack 3, it was very easy to get a fully-featured CRUD REST API with very little code. We would like to provide the same simplicity to you that you can create REST APIs from models directly without the need of creating Repository or Controller classes. As we found out and discussed in [spike #3617](https://github.com/strongloop/loopback-next/pull/3617), we will introduce a new package `@loopback/model-api-builder`, a new booter `ModelApiBooter`, and a plugged-in model-api-builder that builds CRUD REST APIs. The proposed design will enable users to create REST APIs without customizing repository/controller classes. Check [Epic #2036](https://github.com/strongloop/loopback-next/issues/2036) for details of related stories.

## Importing LoopBack 3 models

We accomplished the implementation for the CLI command to import model definitions from LoopBack 3 applications. If you have existing LoopBack 3 applications, it's a good time to type in command `lb4 import-lb3-models` to migrate them to LoopBack 4! See [PR #3688](https://github.com/strongloop/loopback-next/pull/3688) for implementation details, [Importing models from LoopBack 3 projects](https://loopback.io//doc/en/lb4/Importing-LB3-models.html) documentations, and also the [blog post](https://strongloop.com/strongblog/import-loopback-3-models-to-loopback-4).

## Exciting News

In August, we got the news from [APIWorld](https://apiworld.co/) that LoopBack has won the "Best In API Middleware" award. We have shared this news in [this blog post](https://strongloop.com/strongblog/loopback-2019-api-award-api-middleware/). Our architect and co-creator of LoopBack, [Raymond Feng](https://strongloop.com/authors/Raymond_Feng/), will be attending the awards ceremony on October 8 at APIWorld. If you happen to be at the conference, don't miss out.

To moving towards the cloud native direction, LoopBack 4 has been added to be one of the [Appsody application stacks](https://appsody.dev/). It is also being offered as part of the [IBM Cloud Pak for Applications](https://www.ibm.com/cloud/cloud-pak-for-applications). With the health check extension being added to LoopBack 4, we are planning to add more capabilities to provide the non-functional requirements for the cloud native deployment. Stay tuned!

## What's Next?

For the next 3 months, we'd like to focus on the following:

- Continue with the Q3 stories. e.g. [Authentication](https://github.com/strongloop/loopback-next/issues/3242), [Authorization](https://github.com/strongloop/loopback-next/issues/538), [Inclusion of related models](https://github.com/strongloop/loopback-next/issues/1352).
- Start working on the migration guide spikes: [Migration Guide: general runtime](https://github.com/strongloop/loopback-next/issues/1849) and [Migration Guide: Authentication and Authorization](https://github.com/strongloop/loopback-next/issues/3719).
- Continue to enhance our cloud native story: [Production Deployment with IBM Cloud](https://github.com/strongloop/loopback-next/issues/1054).
- CASCON x Evoke: LoopBack team will be organizing an [Exhibition](https://pheedloop.com/cascon/site/sessions/?id=DugCzZ) and a [Workshop](https://pheedloop.com/cascon/site/sessions/?id=OhNsKW) on Nov 4th and Nov 5th.

Check [Q4 roadmap](https://github.com/strongloop/loopback-next/blob/master/docs/ROADMAP.md) for more details.

## Previous Milestone Blogs

There are too many features added and bug fixes that cannot be captured here. Check out our previously published monthly milestone blog posts in Q2 for more details:

- [July 2019](https://strongloop.com/strongblog/july-2019-milestone/)
- [August 2019](https://strongloop.com/strongblog/august-2019-milestone/)
- [September 2019](https://strongloop.com/strongblog/september-2019-milestone/)

## Call for Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Reporting issues](https://github.com/strongloop/loopback-next/issues).
- [Contributing](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md)
  code and documentation.
- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
