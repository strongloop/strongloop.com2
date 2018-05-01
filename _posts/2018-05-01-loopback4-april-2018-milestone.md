---
layout: post
title: LoopBack 4 April 2018 Milestone Update
date: 2018-05-01T15:10:11+00:00
author: Biniam Admikew
permalink: /strongblog/april-2018-milestone/
categories:
  - Community
  - LoopBack
---

In April, our team was focused on delivering "Developer Preview 2", which we've
done so
[successfully](https://strongloop.com/strongblog/loopback-4-developer-preview-2/),
and conducting spikes which help us shape features in LoopBack 4 and create backlog tasks
for our next release. Getting Developer Preview 2 out the door took
up our first half of the month. For the second half of April, we took up a
number of stretch goals which mainly comprised of spikes, but also had time to
work on PRs which improved our build, tests, development processes, and docs.
Check out [May
Milestone](https://github.com/strongloop/loopback-next/issues/1172) if you'd like to know what's on the horizon for May.


If you'd like to know details of our accomplishments in April, continue reading
below.

<!--more-->

## Milestone Goals

### Developer Preview 2 (DP2)

#### Tech Debt

As part of our DP2 release, we worked on adding test infrastructure and unit
tests to our recent `openapi-v3-types` package. This allows us to make sure
our type guard functions worked as intended and so that future changes to the
package won't change the behaviour unintentionally. Check out the
[PR](https://github.com/strongloop/loopback-next/pull/1241) for more details.

#### Developer Experience

One of the main factors that drives our design for LoopBack 4 is user/developer
experience. One of the tasks for DP2 was to make RepositoryMixin easier to use
by providing a _getter_ function for Repository instances registered to the
application. See what has changed with an example code snippet below:

```ts
import {RepositoryMixin} from '@loopback/repository';
import {Application} from '@loopback/core';
import {myRepository} from 'src/repositories';

class AppWithRepoMixin extends RepositoryMixin(Application) {}

const myApplication = new AppWithRepoMixin();
myApplication.bind('repositories.myRepository').toClass(myRepository);
```

_before:_
```ts
// somewhere else, for e.g., in test/acceptance/myapplication.test.ts
givenMyRepository() {
const repoInstance = await myApplication.get('repositories.myRepository');
}
```
_after:_
```ts
givenMyRepository() {
import {myRepository} from '../../src/repositories';
const repoInstance = await myApplication.getRepository(myRepository);
}
```

#### Overloaded repository decorator function

Another loosely related feature we worked on was to let users pass in Repository
class constructors to the `@repository` decorator on top of using the Repository
name. This allows for changes to be made easily after refactoring repositories
in your application. See our docs on
[configuring](http://loopback.io/doc/en/lb4/Repositories.html#controller-configuration)
controllers with repositories on how this can be achieved now. 

#### File Naming Convention

One of the challenges of a growing codebase is having a standard to follow for
file names. We had decided to adopt Angular's file naming convention, so in
April, we went through our monorepo and other related LoopBack 4 repositores to
enforce this naming convention. This makes the development process for us and
our community contributors smoother. Check out our
[docs](https://github.com/strongloop/loopback-next/blob/master/docs/site/DEVELOPING.md#file-naming-convention)
to learn more about our file naming convention.

### Juggler Relations Spike

In April, we continued to look at a new way of defining relations among models
in LoopBack 4 in the spike that started in March. There's still a lot of
conversation around it, but it is shaping up to show how we intend to define and
configure relations in LoopBack 4, starting with the `hasMany` relation. The
spike took longer than expected because we are also trying to lay down the
ground work neccessary to easily add other relation types. You can track the
progress and discussion in its
[PR](https://github.com/strongloop/loopback-next/pull/1194) and
[Issue](https://github.com/strongloop/loopback-next/issues/995). Stay tuned for
a blog post about the findings and further work on concrete implementation for
our supported relations in LoopBack.

## Stretch Goals

On top of our main planned items in April, we focused on spikes which help us
investigate implementation for features we've prioritized for future releases.
Read on to find out what we've been up to and to see what lies ahead.

### Weakly typed services

This spike aimed to figure out how we could integrate service oriented
backends like REST APIs and SOAP Web Services with LoopBack 4 controllers. We
had a PoC which explored creating common interfaces around our service oriented
connectors such as `loopback-connector-rest` and `loopback-connector-soap` and
expose their DataAccessObject (DAO) methods to controller methods via a
`@serviceProxy` decorator which can be used with constructor parameters or properties
to inject a service proxy for the associated service. The PoC for the spike has
given life to a new package
[`@loopback/service-proxy`](https://github.com/strongloop/loopback-next/tree/master/packages/service-proxy).
Check it out and stay tuned for more work on this area. You can find out about
the tasks that have come out of it from the
[issue](https://github.com/strongloop/loopback-next/issues/1069) for it.


### Using Express vs Koa for HTTP Processing

Based on a [spike](https://github.com/strongloop/loopback-next/issues/1071) done
to rework our `@loopback/rest` package internals to support pluggable HTTP
transports like Express and Koa and more, we needed to figure out which
framework we should choose to use with LoopBack 4. Thus, we worked on a spike
which explores the integration between those frameworks and LoopBack 4 as well
as the benefits and drawbacks of using one over the other. After some
investigation, we decided to pursue using Express as our low level HTTP
transport provider for the time being. One of the main reasons for that is the
fact that Express has more maturity, adoption, and a rich middleware ecosystem.
It'd also offer us flexibility to work with Express-compatible frameworks like
fastify. You can find out more information and discussion around this topic in
its [issue](https://github.com/strongloop/loopback-next/issues/1255). Stay tuned
for work around integration with Express and use of its capabilities like
compression and static file serving in LoopBack 4!

### Declarative JSON/YAML support in @loopback/boot

JSON files make it easy to configure models, datasources, etc. manually or using
tools such as the LoopBack CLI. This spike explored creating a Class in memory
from a JSON file as well as generating a Base Class based on the JSON file. The
spike is still under way to test some complete end-to-end user flows so the team
can pick the best way forward. Stay tuned for more details on this task in May. 

### Validation and type conversion

With the current implementation of routing in `@loopback/rest`, no work is done to
coerce string inputs from HTTP requests into their correct JavaScript type
representation. From the work of [validation/coercion
spike](https://github.com/strongloop/loopback-next/issues/1057), which explored
ideas to address this elegantly, we've decided on building a type conversion
system for LoopBack; this will allow us to reuse or leverage the same logic used
to convert between the HTTP layer and the JavaScript layer in other layers such
as databases.

We've also decided on having simple data validation done with
[AJV](https://github.com/epoberezkin/ajv) via constraints given in an OpenAPI
Schema Object. Asynchronous validation at the database level is also planned to
be supported through the usage of decorators.


## Community Contributions

As an open source project, LoopBack depends on its community members to thrive
and flourish. We're greatful to have an awesome community where members help us
and themselves by answering questions and opening pull requests. In the month of
April, we've seen some great community participation for LoopBack 4. We'd like
to say thank you for all our contributers who have taken an interest in the
project and the time to fix issues or raise concerns. Shout outs to
[@AliMirlou](https://github.com/AliMirlou), [@cajoy](https://github.com/cajoy),
[@cblazo](https://github.com/cblazo),
[@joeytwiddle](https://github.com/joeytwiddle),
[@jwooning](https://github.com/jwooning),
[@thinusn](https://github.com/thinusn), and
[@Vandivier](https://github.com/Vandivier) for your contributions to LoopBack 4
in April! If you'd like to get involved, check out our [Call for
Action](#call-for-action) section below.


## Miscellaneous Improvements

On top of our planned goals and stretch goals, we've managed to land numerous
PRs which have, among other things, made us compatible with Node.js v10,
improved our developer experience, and slimmed down our dependencies. Check out the list below for more details:

  * [CLI] Move away from using master to clone examples via `lb4 example`
    [#1120](https://github.com/strongloop/loopback-next/issues/1120)
  * [Docs] Local Site Scaffolding
    [#1232](https://github.com/strongloop/loopback-next/issues/1232)
      - This enabled testing `@loopback/docs` in LB4 as well. 
  * feat: upgrade to openapi3-ts@0.11.0
    [#1265](https://github.com/strongloop/loopback-next/pull/1265)
  * chore: add a sandbox location to enable testing w/ source code
    [#1252](https://github.com/strongloop/loopback-next/pull/1252)
  * Introduce strongly-typed metadata key
    [#1240](https://github.com/strongloop/loopback-next/pull/1240)
  * refactor: move example packages to examples folder
    [#1231](https://github.com/strongloop/loopback-next/pull/1231)
  * [RFC] refactor(docs): move apidocs to `/docs`
    [#1207](https://github.com/strongloop/loopback-next/pull/1207)
  * feat(testlab): update sourceMappingURL when copying a JS file
    [#951](https://github.com/strongloop/loopback-next/pull/951)
  * chore: make the code compatible with node 10.0.0
    [#1281](https://github.com/strongloop/loopback-next/pull/1281)
  * lb3 feat(loopback-datasource-juggler): add omit default embedded item flag
    for embedsMany relation
    [#2882](https://github.com/strongloop/loopback/issues/2882)
  * Replace type definition being imported by `repository-json-schema`
    [#1132](https://github.com/strongloop/loopback-next/issues/1132) 

## Call for Action

LoopBack's future success counts on you. We appreciate your continuous support
and engagement to make LoopBack even better and meaningful for your API creation
experience. Please join us and help the project by:

* [Opening a pull request on one of our "good first
  issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
* [Casting your vote for
  extensions](https://github.com/strongloop/loopback-next/issues/512)
* [Reporting issues](https://github.com/strongloop/loopback-next/issues)
* [Building more
  extensions](https://github.com/strongloop/loopback-next/issues/647)
* [Helping each other in the
  community](https://groups.google.com/forum/#!forum/loopbackjs)
