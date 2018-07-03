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

With groundwork for creating constrained `hasMany` repositories in place, the next
step was to streamline the user experience.

`@loopback/repository`'s `DefaultCrudRepository` is now equipped with
`_createHasManyRepositoryFactoryFor` method, which can be used inside your
repository's constructor to give your repository instance a primary-key-constraining
`hasMany` repository factory. In order to use this nitfy little method, just decorate
your source model with a `@hasMany()` decorator and pass in it the constructor of the
model on the receiving end of the `hasMany` relation. If you're interested in
how it all works, check out our PR on this work [here](https://github.com/strongloop/loopback-next/issues/1438).

A detailed documentation and tutorial on using `@hasMany`,
`_createHasManyRepositoryFactoryFor` and the proudced factory function along
with a blog post detailing our design choices is on the horizon, so please stay
tuned!

### HTTP Hardening

#### HTTP Endpoint Factory

A new package, `@loopback/http-server`, was created to decouple the HTTP/HTTPs server creation and management responsibilities from `@loopback/rest`. This package exports a class, `HttpServer`, which can be used idenpendently from LoopBack, to create HTTP or HTTPS servers based on its configuration object.

An earlier implementation of `HttpServer` incorrectly formatted Ipv6 host in its `url` property. This has been fixed in the latest version.

A new property, `listening` is added to `RestServer`. It's a boolen, which will be `true` if the server was started successfully and is listening for connections.

#### HTTPS support

Work is being done to add built-in support for HTTPS in LoopBack. This feature is likely to land in early July.

### CLI

June had a major focus on our CLI as it helps abstract complexity and simplifies the developer experience. It already helped scaffold your Applications and create Controllers, now it can do even more!

#### Generate DataSource

CLI has a new command, `lb4 datasource` that can create a [DataSource](http://loopback.io/doc/en/lb4/DataSources.html) for you. The command will ask you for the name, connector and connector specific question. Then it will install the connector from `npm` into the project, create a `datasource.json` file and an accompanying `datasource.ts` (for programatic overrides) file in `/src/datasources` folder.

Accordingly, `@loopback/boot` now supports discovering and binding DataSource files in your Application automatically.

#### Generate Index File for Artifacts

When the CLI generates artifacts such as Controllers / DataSources, we had always recommended adding a `index.ts` in the artifact folder and exporting the artifacts from that file. This made it easier to import the artifacts when using them for typing information with Dependency Injection / otherwise. Creating and maintaing the `index.ts` file was a manual process before but now all artifacts created using the CLI will create / update `index.ts` in the artifact folder, simplying the developer experience significantly!

#### Generate LoopBack Artifacts From OpenAPI Specs

LoopBack 4 already [adopts OpenAPI 3.0](https://strongloop.com/strongblog/upgrade-from-swagger-to-openapi-3/) to expose controllers as REST APIs. The support is further expanded with the newly introduced `lb4 openapi` command. We can now generate corresponding artifacts such as controllers and models from OpenAPI 2.0 and 3.0 specs. It's the step stone to offer an `API design first` approach. For more information, please check out [OpenAPI Generator](http://loopback.io/doc/en/lb4/OpenAPI-generator.html).

### Service Integration: Make Services Easy to Test

The initial support for accessing 3rd party REST/SOAP services from LoopBack4 application focused on implementation details of leveraging the existing capabilities provided by loopback-datasource-juggler and connectors. While the proposed solution was very easy to use when building applications, we had concerns about testability of such approach. In June, @bajtos did a series of improvements to make service integration easier to test.

The changes are based on few basic premises:

1.  When integrating with a 3rd-party service, we need to periodically verify that the assumptions made by our client are still valid: the request URLs and parameters are still supported, the service returns responses in the expected format. Ideally, these checks should be implemented as integration tests that don't require the entire application to be set up.

2.  Integration tests for service proxies should obtain proxy instances using the same APIs as application controllers do.

3.  When running the test suite, the non-functional aspects of service integration needs a different configuration compared to production use. For example, we may want to add an aggresive HTTP cache to speed up test duration and/or conserve rate limit restrictions.

Fortunately enough, the current implementation was found as flexible enough to support the requirements. All that was needed was to connect existing building blocks in a slightly different way: Instead of using `@serviceProxy()` decorator that's difficult to use from integration tests, we recommend to write a service Provider that can be injected to Controllers via `@inject` and used from integration tests directly. The documentation page [Calling other APIs
and web services](http://loopback.io/doc/en/lb4/Calling-other-APIs-and-web-services.html#make-service-proxies-easier-to-test) was updated with detailed implementation instructions and [Testing your application](http://loopback.io/doc/en/lb4/Testing-your-application.html#test-your-services-against-real-backends) received a new section _Test your services against real backends_ with a guide on integration testing.

To ensure the advices given in the new documentation content are sound and the new code snippets work as expected, we have put our recommendations in practice and updated the example Todo application and the accompanying tutorial to show integration with [US Census Geocoder](https://geocoding.geo.census.gov/geocoder/) web service. Todo items now provide data for location-based reminders now, including server-side conversion of addresses to GPS coordinates. Yay! Learn more in [Integrate with a geo-coding service](http://loopback.io/doc/en/lb4/todo-tutorial-geocoding-service.html) tutorial and check out the pull request [#1347](https://github.com/strongloop/loopback-next/pull/1347) to see full code changes including new integration and acceptance tests.

**Behind the Stage**

Adding a geocoding web service turned out to be surprisingly tricky! Historically, many open source projects (including us) were relying on Google Maps API, because of their rich dataset, great performance and a generous free tier. Starting from July 16, 2018, the pricing is going to [change](https://cloud.google.com/maps-platform/user-guide/pricing-changes/) in a way that makes it difficult to use Google Maps API in an open-source example project for free. While there are other alternatives available (including IBM's [Weather Company Data](https://console.bluemix.net/catalog/services/weather-company-data?cm_mc_uid=26165958112215259376291&cm_mc_sid_50200000=38303921530172949280) or OpenStreetMap's [Nominatim](https://wiki.openstreetmap.org/wiki/Nominatim)), none of them were as easy to use as we would like to.

US Census Geocoder was found as the best alternative, especially because it allows anonymous requests (no access token required). The catch: more often than not, the service takes many seconds to complete the request. Sometimes even 30 seconds is not enough! We run Todo example tests as part of loopback-next's main test suite (`npm test`), and with the newly added tests making about 3 calls to Geocoder API, the test suite would become unusably slow.

We have considered several different options and existing npm packages while searching for a solution, from [mockyeah](https://www.npmjs.com/package/mockyeah) to [node-http-proxy](https://github.com/nodejitsu/node-http-proxy) and [anyproxy](https://github.com/alibaba/anyproxy). At the end, we decided to bite the bullet and implement our own HTTP proxy that will aggressively cache responses and persist the cache in the filesystem. Say hello to [@loopback/http-caching-proxy](https://www.npmjs.com/package/@loopback/http-caching-proxy)!

### Validation and Coercion

#### Coerce Parameters

When parsing the parameter's values from the HTTP request, they are always in a string format, but users expect to have them in JavaScript data type defined in the corresponding OpenAPI parameter specification to invoke the controller method. Such type coercions are now handled in `@loopback/rest`.

Take an example of the endpoint defined below:

```ts
// in your controller file
class FooController {
  @get('/Foo')
  async find(@param.query.integer('count') count: number): Promsise<Foo> {
    return await fooRepo.find({ limit: count });
  }
}
```

Method `find` takes in a parameter called `count` from the query, its JavaScript run-time type should be a number, to be more specific, an integer. But by calling endpoint "/Foo?[count]=10", the value of `count` we get from the HTTP client is "10", not 10.

In this case, `@loopback/rest` does a type coercion from string to integer when it parses the parameter from the HTTP request. And some basic validations also happen along with the coercion. For instance, value as "10.10" will be rejected since it's a float instead of an integer.

The coercion and validation are applied to parameters from query, path and header, and you can check [OpenAPI primitive types](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#data-types) to find the proper `type` and `format` to describe your parameter's type in the OpenAPI Specification.

## Miscellaneous Improvements

Besides the big achievements in epics, we also continue improving our code base to be more robust and update the documentations to reflect the latest architecture. Below is a serials of miscellaneous improvements for `loopback-next`:

- [relation] Add more CRUD methods to relation "hasMany" [#1376](https://github.com/strongloop/loopback-next/issues/1376)
- [relation] Add tests for relation constrain util functions [#1379](https://github.com/strongloop/loopback-next/issues/1379)
- [refactor] Remove execute function out of Repository interface [#1355](https://github.com/strongloop/loopback-next/issues/1355)
- [epic] Create tasks for improving Todo tutorial [#1206](https://github.com/strongloop/loopback-next/issues/1206)
- [docs] The usage of shot Request/Response mocks [#760](https://github.com/strongloop/loopback-next/issues/760)
- [docs] Clean up "Best Practices with LoopBack 4" [#1094](https://github.com/strongloop/loopback-next/issues/1094)
- [docs] Move @loopback/repository's "Concepts" doc from Readme to loopback.io [#1137](https://github.com/strongloop/loopback-next/issues/1137)
- [CLI] Enable tsc watch in projects scaffolded by lb4 CLI tool [#1259](https://github.com/strongloop/loopback-next/issues/1259)
- [CLI] Remove the automatic "Controller" suffix from the controller command [#886](https://github.com/strongloop/loopback-next/issues/886)
- [blog] LoopBack 4 improves inbound HTTP Processing [link](https://strongloop.com/strongblog/loopback4-improves-inbound-http-processing)

## Call for Action

LoopBack's future success counts on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
- [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
- [Reporting issues](https://github.com/strongloop/loopback-next/issues)
- [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
- [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)
