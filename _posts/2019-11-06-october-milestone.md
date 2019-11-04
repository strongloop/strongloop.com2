---
layout: post
title: LoopBack 4 October 2019 Milestone Update
date: 2019-11-06
author: Dominique Emond
permalink: /strongblog/october-2019-milestone/
categories:
  - Community
  - LoopBack
published: false
---

As the cold autumn winds and frost nipped at our heels, the LoopBack team kept warm with generous portions of hot tea and coffee and accomplished their planned October milestone goals.

We focused on the following areas:

- Inclusion of related models
- Adding Partitioned Database Support for Cloudant and CouchDB connector
- Spike on Migration Guide
- Improvements to Shopping Cart Example
- CASCON x Evoke 2019 Workshop Preparation
- Repository Tests for PostgreSQL
- Generating Controller/Repository from a Model
- Documentation Improvements
- Bug fixes / CI fixes

See the [October milestone](https://github.com/strongloop/loopback-next/issues/3801) for an overview of what we have worked on, and read on for more details.

Also, we were honored this month when [API World](https://apiworld.co/) awarded LoopBack with the `2019 Best of API Middleware Award`. Raymond Feng was there to [accept the award](https://twitter.com/cyberfeng/status/1181943111531909120) on behalf of the team. Yay, team!

<!--more-->

## Inclusion of Related Models

We've been working on inclusion resolvers for relations for the past several months. Besides the basic functionality, we also added a prompt for activating the inclusion resolver for the `lb4 relation` command in [PR #3856](https://github.com/strongloop/loopback-next/pull/3856). This allows users to easily set up the inclusion resolver through the CLI just like all others artifacts.

The `lb4 relation` command now [prompts to confirm](https://loopback.io/doc/en/lb4/Relation-generator.html#arguments) if an inclusion resolver should be registered for the given relation.

Also, we posted [a blog](https://strongloop.com/strongblog/inclusion-of-related-models/) to illustrate the idea and usage of the inclusion resolver. We have a full example from setting up the models and relations through CLI, to querying data with the inclusion resolver. Read the blog to try out the feature!

We've gotten feedback from the community since this feature was published. As a result, we've improved the documentation. Diagrams were added to each relation to make the concept more intuitive. We also added URLs as examples to query related models in case users want to process data at the controller level instead of the repository level. See [PR #4007](https://github.com/strongloop/loopback-next/pull/4007) for more details.

## Adding Partitioned Database Support for Cloudant and CouchDB connector

### Spike

Both Cloudant and CouchDB support partitioned databases which make querying less expensive - computationally in CouchDB, monetarily on Cloudant (on `IBM Cloud`).

A [spike](https://github.com/strongloop/loopback-connector-cloudant/issues/214) was performed to investigate the work required to support the partitioned database in Cloudant, and follow-up tasks were created. [Epic #219 - Add support for partitioned database](https://github.com/strongloop/loopback-connector-cloudant/issues/219) was created to track the implementation stories.

The feature will be supported in 3 stages. In the first stage, we will update the driver and enable creating the partitioned index; which are the pre-requisites for the partitioned search. The second stage includes supporting the query with partition key from the options data or the payload data; the latter one requires a model property defined as the partition key field. Stage 3 contains more improvements for the document creation in the partitioned database by supporting a composed ID.

### Updating Driver

To start [Epic #219](https://github.com/strongloop/loopback-connector-cloudant/issues/219), we updated the [cloudant driver](https://github.com/cloudant/nodejs-cloudant) and the [docker image](https://hub.docker.com/r/ibmcom/couchdb3) to the latest ones which support the partition feature.

## Spike on Migration Guide

A spike was performed on migrating from LoopBack 3 to LoopBack 4. As a result, we created the outline of a [migration guide](https://loopback.io/doc/en/lb4/migration-overview.html).

## Improvements to Shopping Cart Example

The [shopping cart application](https://github.com/strongloop/loopback4-example-shopping) has undergone a few improvements.

- We have added an out-of-the-box capability to set a JWT token via an `Authorize button/dialog` in the API Explorer. When interacting with the secured endpoint, the token is automatically sent in the `Authorization` header of the request. See [PR #301](https://github.com/strongloop/loopback4-example-shopping/pull/301) and [PR #3876](https://github.com/strongloop/loopback-next/pull/3876) for details. To find out how to enable this capability in your application, please see [Specifying the Security Settings in the OpenAPI Specification](https://loopback.io/doc/en/lb4/Authentication-Tutorial.html#specifying-the-security-settings-in-the-openapi-specification).

- The shopping cart application has been decomposed into multiple microservices, each of which is packaged as a docker image. It's possible to communicate between microservices using [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) and/or [gRPC](https://grpc.io/). A [helm chart](https://helm.sh/docs/developing_charts/) can now be used to deploy these microservices to a Kubernetes cluster on [Minikube](https://github.com/kubernetes/minikube) or [IBM Cloud](https://www.ibm.com/cloud). See [Deploy the Shopping Application as Cloud-native Microservices using Kubernetes](https://github.com/strongloop/loopback4-example-shopping/blob/master/kubernetes/README.md) for more details.

- The `shopping` service can now connect to the `recommender` service over gRPC as well as REST. See [PR #333](https://github.com/strongloop/loopback4-example-shopping/pull/333) for details.

- Extra logic was added to `*.datasources.ts` files to accept configuration from kubernetes environment variables. See [PR #338](https://github.com/strongloop/loopback4-example-shopping/pull/338) for details.


## CASCON x Evoke 2019 Workshop Preparation

The LoopBack 4 team is preparing material for a booth and workshop at [CASCON x Evoke 2019](http://www-01.ibm.com/ibm/cas/cascon/) in Toronto, Canada. Our booth is named [REST APIs with LoopBack 4 and OpenAPI 3](https://pheedloop.com/cascon/site/sessions/?id=DugCzZ) and will be open on November 4th, 2019 from 9am-6pm. Our workshop is named [Write scalable and extensible Node.js applications using LoopBack 4](https://pheedloop.com/cascon/site/sessions/?id=OhNsKW) and is taking place on November 5th, 2019 from 1pm-2:45pm. Come drop by to see us!

## Repository Tests for PostgreSQL

Previously, we ran repository tests against the memory, MySQL, and MongoDB databases. This month, we added PostgreSQL to the databases these tests are run against. You can see [PR #3853](https://github.com/strongloop/loopback-next/pull/3853) for details or take a look at the newly added [`repository-postgresql` package](https://github.com/strongloop/loopback-next/tree/master/acceptance/repository-postgresql).

## Generating Controller/Repository from a Model

Some progress was made on the [EPIC #2036 - From model definition to REST API with no custom repository/controller classes](https://github.com/strongloop/loopback-next/issues/2036). A controller can now be generated based on a model name. See [PR #3842](https://github.com/strongloop/loopback-next/pull/3842) for details. Also, a repository can now be generated based on a model name. See [PR #3867](https://github.com/strongloop/loopback-next/pull/3867) for details.

## Documentation Improvements

### New 'Inside a LoopBack Application' Section Added to Docs

We're always seeking to improve our documentation. We've added a new section [Inside a Loopback Application](https://loopback.io/doc/en/lb4/Inside-LoopBack-Application.html) to help LoopBack 4 application developers to establish a high level understanding of how LoopBack 4 is related to their application requirements.

### Customize Id and Foreign Key Names for Relations

After triaging some issues from the community, we realized that the documentation for customizing key names needs to be enhanced. We added explanations and examples to illustrate the default value of relations, how to customize key names, and how to use different names for models and database columns. You can find more details in [HasMany - Relation Metadata](https://loopback.io/doc/en/lb4/HasMany-relation.html#relation-metadata), [HasOne - Relation Metadata](https://loopback.io/doc/en/lb4/hasOne-relation.html#relation-metadata), and [Defining a belongsTo Relation](https://loopback.io/doc/en/lb4/BelongsTo-relation.html#defining-a-belongsto-relation).

## Bug Fixes / CI Fixes

- Fixed [Issue #4252 - Fix CI builds (Karma + PhantomJS)](https://github.com/strongloop/loopback/issues/4252) by reworking browser tests to run in Headless Chrome instead of PhantomJS, because the latter is no longer maintained. See [PR #4262](https://github.com/strongloop/loopback/pull/4262) for details.

- Fixed [Issue #3717 - PersistedModel's updateAll method crashes the server when invoked via the remote connector](https://github.com/strongloop/loopback/issues/3717) by properly handling anonymous object types when `PersistedModel.updateAll` is called. See [PR #472](https://github.com/strongloop/strong-remoting/pull/472) for details.

- Fixed [Issue #3878 - lifeCycleObserver is not working with express composition](https://github.com/strongloop/loopback-next/issues/3878). See [PR #3879](https://github.com/strongloop/loopback-next/pull/3879) and [PR #3891](https://github.com/strongloop/loopback-next/pull/3891) for details.

- Fixed [Issue #3706 - Unable to POST on endpoint with recursive model](https://github.com/strongloop/loopback-next/issues/3706). See [PR #3897](https://github.com/strongloop/loopback-next/pull/3897) for details.

- Fixed [Issue #3296 - Model discovery not working with Oracle connector & CDB instance](https://github.com/strongloop/loopback-next/issues/3296) by only calling back once the connection is released. See [PR #193](https://github.com/strongloop/loopback-connector-oracle/pull/193) for details.

## Looking for User References

As a LoopBack user, do you want your company highlighted on our [web site](https://loopback.io/)? If your answer is yes, see the details in this [GitHub issue](https://github.com/strongloop/loopback-next/issues/3047).

## What's Next?

If you're interested in what we're working on next, you can check out the [November Milestone](https://github.com/strongloop/loopback-next/issues/4029).

## Call to Action

LoopBack's success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Here's how you can join us and help the project:

- [Report issues](https://github.com/strongloop/loopback-next/issues).
- [Contribute](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md) code and documentation.
- [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Join](https://github.com/strongloop/loopback-next/issues/110) our user group.
