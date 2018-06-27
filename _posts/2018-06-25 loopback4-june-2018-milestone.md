---
layout: post
title: LoopBack 4 June 2018 Milestone Update
date: 2018-06-25T00:10:11+00:00
author: Janny Hou
permalink: /strongblog/june-2018-milestone/
categories:
  - Community
  - LoopBack
---

Based on the roadmap created from the spike stories, we have been able to make significant progresses for our 5 epics. Here are the highlights of the accomplishments in each area: We implemented the fundamental relation traversing by supporting relation decorators. A big refactor for @loopback/rest introduced a new package @loopback/http-server as the HTTP endpoint factory and improved the inbound HTTP processing by leveraging Express. Users now can create their datasources by `lb4 datasource` and `@loopback/boot` can automatically pick them up. Another new CLI we created is `lb4 openapi`, which generates models and controllers from a Swagger/OpenAPI file. We added a geoService in the Todo example to show users how to integrate a service, and a caching HTTP proxy is created to speed up the integration test. The coercion for endpoint parameters converts a string from HTTP request to the corresponding JavaScript run-time type.

A full list of finished stories and their story links can be found in issue [June milestone](https://github.com/strongloop/loopback-next/issues/1375).

<!--more-->

## June Milestone Goals

### Model Relations

#### Add relation decorators

cc @b-admike @shimks

### HTTP Hardening

#### HTTP endpoint factory

https://github.com/strongloop/loopback-next/issues/1331
cc @hacksparrow

#### Shot Request/Response mocks

https://github.com/strongloop/loopback-next/issues/760
cc @bajtos

### @loopback/boot Support for Declarative JSON/YAML

#### Generate datasource

https://github.com/strongloop/loopback-next/issues/1225
cc @virkt25

#### Generate index file for artifacts

https://github.com/strongloop/loopback-next/issues/1127
cc @virkt25

### CLI 

#### Generate LoopBack app from OpenAPI file

https://github.com/strongloop/loopback-next/pull/1399
cc @raymondfeng

### Service Integration

#### Make services easy to test

https://github.com/strongloop/loopback-next/issues/1311
cc @bajtos

### Validation and Coercion

#### Coerce parameters 

https://github.com/strongloop/loopback-next/issues/750
cc @jannyhou

## Blogs

### LoopBack 4 improves inbound HTTP Processing

https://strongloop.com/strongblog/loopback4-improves-inbound-http-processing
cc @bajtos

## Miscellaneous Improvements

Besides the big achievements in epics, we also continue improving our code base to be more robust and update the documentations to reflect the latest architecture. Below is a serials of miscellaneous improvements for `loopback-next`:

* [relation] Add more CRUD methods to relation "hasMany" [#1376](https://github.com/strongloop/loopback-next/issues/1376)
* [relation] Add tests for relation constrain util functions [#1379](https://github.com/strongloop/loopback-next/issues/1379)
* [refactor] Remove execute function out of Repository interface [#1355](https://github.com/strongloop/loopback-next/issues/1355)
* [epic] Create tasks for improving Todo tutorial [#1206](https://github.com/strongloop/loopback-next/issues/1206)
* [docs] Clean up "Best Practices with LoopBack 4" [#1094](https://github.com/strongloop/loopback-next/issues/1094)
* [docs] Move @loopback/repository's "Concepts" doc from Readme to loopback.io [#1137](https://github.com/strongloop/loopback-next/issues/1137)
* [CLI] Enable tsc watch in projects scaffolded by lb4 CLI tool [#1259](https://github.com/strongloop/loopback-next/issues/1259)
* [CLI] Remove the automatic "Controller" suffix from the controller command [#886](https://github.com/strongloop/loopback-next/issues/886)

## Call for Action

LoopBack's future success counts on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
- [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
- [Reporting issues](https://github.com/strongloop/loopback-next/issues)
- [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
- [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)
