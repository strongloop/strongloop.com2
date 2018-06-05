---
layout: post
title: LoopBack 4 May 2018 Milestone Update
date: 2018-06-05T00:10:11+00:00
author: Kyu Shim
permalink: /strongblog/may-2018-milestone/
categories:
  - Community
  - LoopBack
---

The sun's out and we're breaking all the guns out for "Developer Preview 3" (DP3)! In May various spikes that started as stretch goals from [our previous milestone](https://strongloop.com/strongblog/april-2018-milestone/) continued and were put into effect. You can check out the follow up issues from these spikes in our [June Milestone](https://github.com/strongloop/loopback-next/issues/1375).

Read on to get our insights on what's been accomplished in our [May milestone](https://github.com/strongloop/loopback-next/issues/1172).

<!--more-->

## May Milestone Goals

### Model Relations

As part of the Model Relations spike in March/April, we curated a list of backlog items, but also wanted to incrementally build the `hasMany` relation feature into LoopBack 4. As such, we worked on the first leg of the implementation using an acceptance test to drive the development.

The implementation introduces the following components:

- `hasManyRepositoryFactory` to create constrained repository instances based on specified constraint (source model ID), relation metadata, and target repository.
- `HasManyEntityCrudRepository` interface which specifies the shape of the public APIs exposed by the `HasMany` relation.
- `DefaultHasManyEntityCrudRepository` class which implements those APIs by calling utility functions on a target repository instance to constrain its CRUD methods.
- `constrain*` utility functions which apply constraints on a data object, filter, or where object and modification of `WhereBuilder` and `FilterBuilder` classes to include an `impose` function to merge constrain objects with their own where and filter objects.
- The first [acceptance test](https://github.com/strongloop/loopback-next/blob/master/packages/repository/test/acceptance/has-many.relation.acceptance.ts) that shows how to create an order for a customer with a "customer has many orders" relation.

Check out the GitHub issue [#1032](https://github.com/strongloop/loopback-next/issues/1032) for more details on the work for model relations in June.

### HTTP Hardening

We started LoopBack 4 with the desire to improve all aspects of application development. One of the pain points in LoopBack 3.x was composition of Express middleware handlers, which we decided to address by rolling out a different design based on [Sequence](http://loopback.io/doc/en/lb4/Sequence.html) of actions. As time progressed, we realized we would have to end up 'reinventing the wheel' with frequently used middleware like CORS with our own Sequence-friendly version. Instead, we decided to step back and keep using the vast ecosystem of existing Express middleware.

Once we decided to use Express as our low-level HTTP framework, many options to simplify our code opened up.

In this milestone, we made the following changes (primarily in the REST layer):

Internally, we upgraded from Node.js core ServerRequest/ServerResponse objects to Express.js Request/Response objects. This simplifies integration with Express middleware and relieves us from the responsibility of parsing URL into path, query string, etc. See issue [#1326](https://github.com/strongloop/loopback-next/pull/1326). As a result, we can mount CORS middleware properly with no need to invoke its handler function directly as we were doing before. See issue [#1338](https://github.com/strongloop/loopback-next/pull/1338).

We find Express handler signature `(request, response, next)` as rather limiting, because any additional context must be stored in request properties. We like Koa's design better, where a single context object is passed around, since we already have a per-request context object used for dependency injection. In [#1316](https://github.com/strongloop/loopback-next/pull/1316), we reworked the internal routing as well as the public API of sequence actions to use a `{request,response}` context object instead of a pair of `(request, response)` arguments.

Some of these changes are not backwards compatible. Application and extensions must be updated if they use any of the following:

- Custom sequence classes
- Custom sequence handlers registered via app.handler
- Custom implementations of the built-in sequence action `Reject`

HTTP hardening work will continue in June, see the GitHub issue [#1038](https://github.com/strongloop/loopback-next/issues/1038) for more details.

### Service Integration with SOAP/REST

#### Using a Web Service's API with `@serviceProxy`

Our work on web services' integration with DataSource and LoopBack 4 has finally culminated into the package `@loopback/service-proxy`. The package provides `@serviceProxy` decorator, which configures and injects a web service's API into a controller by utilizing the connector defined in the context-bound DataSource (an example being [loopback-connector-rest](https://github.com/strongloop/loopback-connector-rest)). This now allows users to easily define a web service's operations in Data Access Object pattern with all the type safety TypeScript offers. Visit [http://loopback.io/doc/en/lb4/Calling-other-APIs-and-web-services.html](http://loopback.io/doc/en/lb4/Calling-other-APIs-and-web-services.html) for more information on the package and its usage.

There is still more work to be done to really polish up package though. You can find an enhanced user story [here](https://github.com/strongloop/loopback-next/issues/1311) that explains how to use the package as well as QOL adjustment of allowing a service to be easily exposed without having to be bound by an app. We also plan to add in a CLI scaffolding command to easily configure the web service for use; the progress can be checked [here](https://github.com/strongloop/loopback-next/issues/1312).

#### Adding TypeScript Declaration Files to loopback-datasource-juggler

Part of the above story involved migrating existing TypeScript definition files for the juggler in `@loopback/repository` to its package. This allows us to ensure type safety while avoiding unnecessary dependency for `@loopback/service-proxy` and any future packages that may leverage the juggler.

#### Promisification of Juggler DAO Methods

As part of integration with REST, SOAP and other services in LoopBack 4, we've added promise supports for the following LoopBack 3 connectors:

- [loopback-connector-soap](https://github.com/strongloop/loopback-connector-soap)
- [loopback-connector-grpc](https://github.com/strongloop/loopback-connector-grpc)

With this feature introduced, you're now able to use LoopBack 4's advocated convention of using ES7's [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) flavor of asynchronous programming for your desired REST/SOAP/gRPC services.

### LoopBack Docs Search is Now Powered by IBM Watson

LoopBack Documentation search was made smarter this past month by making the switch to [IBM Watson Discovery](https://www.ibm.com/cloud/watson-discovery). The new search is now context aware, meaning if you search for a keyword from the docs of a particular LoopBack version then you will only get results from the docs of that particular LoopBack version only. You can learn more about the alternatives and the implementation of search in this previous blog post: [LoopBack Doc Search Powered by Watson](https://strongloop.com/strongblog/loopback-doc-search-powered-by-watson/)

### @loopback/boot Support for Declarative JSON/YAML

One of the key features for LoopBack has always been the ability to configure Models, DataSources, etc. via JSON. This worked great but since LoopBack 4 supports TypeScript, it becomes a necessity to have Classes available for typing information. This spike was used to investigate different approaches for JSON support while also having classes for type metadata and safety.

The solution holistically looked at the entire developer experience. The final solution will be using `@loopback/cli` to not only generate the JSON but also a `artifact.ts` file that builds the class based on the JSON config. The JSON file can then be updated by the user or by CLI tooling and if a user wants they can also modify the artifacts via code in the generated TypeScript Class. For some complex Artifacts such as Models, there will be a base class that can be regenerated when the underlying JSON is modified and this can be done as part of the npm `build` script. Having TypeScript classes also allows us to keep the `Booter` simple and light-weight by just focusing on populating the Application Context instead of generating code dynamically / classes in memory (leading to a lack of typing information).

DataSource will be the first artifact to gain support for Declarative support and `@loopback/boot` support. You can track progress of this feature in [this PR](https://github.com/strongloop/loopback-next/pull/1385) expected to land in June. The work for remaining artifacts will be tracked in [this EPIC](https://github.com/strongloop/loopback-next/issues/565).

### New Website Dedicated for LoopBack 4

To reflect LoopBack 4's usage of shiny new technology and the rebuilding of features from the ground up, we've created a homepage for LoopBack 4 highlighting its strengths and features. The homepage is now available at [http://v4.loopback.io/](http://v4.loopback.io/) and is ready to introduce Node.js users to our awesome framework.

### Prompt for HTTP Path Name for REST Controller Generation

[LoopBack 4 CLI](https://loopback.io/doc/en/lb4/Controller-generator.html#rest-controller-with-crud-methods) tooling for creating controllers with REST CRUD methods configured now prompts for the HTTP path name of where your endpoints will live. The prompt defaults to the plural form of the name of the model that's been selected to build the CRUD methods as follows:

```shell
$ lb4 controller
? Controller class name: Account
? What kind of controller would you like to generate? REST Controller with CRUD functions
? What is the name of the model to use with this CRUD repository? Account
? What is the name of your CRUD repository? AccountRepository
? What is the type of your ID? number
? What is the base HTTP path name of the CRUD operations? (/accounts)
```

Here's an example of what a CRUD method would look like in the generated controller with the following input:

```shell
? What is the base HTTP path name of the CRUD operations? /my-custom-rest-path
```

```ts
// the POST request in src/controllers/account.controller.ts
@post('/my-custom-rest-path')
async create(@requestBody() obj: Account): Promise<Account> {
  return await this.accountRepository.create(obj);
}
```

## Miscellaneous Improvements

On top of the big features in our milestone, various PRs that involve cleanups, quality of life features, and beefening of our test suites have landed. Below is the list of these issues with links to more details.

- [CLI] Show list of all available commands in help [#934](https://github.com/strongloop/loopback-next/issues/934)
- (docs): Update or get rid of reserved-binding-keys.md [#956](https://github.com/strongloop/loopback-next/issues/956)
- docs: mention VSCode in the CONTRIBUTING guide [#1317](https://github.com/strongloop/loopback-next/pull/1317)
- Add shortcut tests for @param [#1052](https://github.com/strongloop/loopback-next/issues/1052)
- [APIDocs] Missing content from RepositoryMixin [#1171](https://github.com/strongloop/loopback-next/issues/1171)
- Add in tests for JSON Schemas being produced [#971](https://github.com/strongloop/loopback-next/issues/971)
- chore: rewrite the code in TypeScript and manage by lerna [strong-globalize/#132](https://github.com/strongloop/strong-globalize/pull/132)
- refactor: rewrite the project using TypeScript [strong-docs/#114](https://github.com/strongloop/strong-docs/pull/114)

## Call for Action

LoopBack's future success counts on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
- [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
- [Reporting issues](https://github.com/strongloop/loopback-next/issues)
- [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
- [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)
