---
layout: post
title: LoopBack 4 October 2018 Milestone Update
date: 2018-11-02
author: Biniam Admikew
permalink: /strongblog/october-2018-milestone/
categories:
  - Community
  - LoopBack
---

As the fall season was in full gear, the LoopBack team was busy wrapping up
items planned for our General Availability (GA) release and releasing LoopBack 4
v1.0.0 on Wednesday, October 10th! On top of that, the team was able to complete
a number of stretch goals for the month and focused on helping our users with
pressing bugs and feature requests. Read more to find out how it all unfolded.

<!--more-->

## Accomplishments

### LoopBack 4 GA

To wrap up our LoopBack 4 GA release, we had to finish all the remainder of the
priority 1 items planned which included:
- Implementation of belongsTo relation consisting of:
  - Breaking cyclic dependency in two-way relations
  - Introduction of type resolvers for property decorators
  - Refactoring of relation based source files
- REST layer improvements such as:
  - using pre-compiled AJV validators to boost performance on resource creation
requests
  - making sure `patch` and `put` requests return JSON responses like other
    verbs
- Adding CLI template to render a default home page when scaffolding new
  applications

Once those items were completed, the team went on to finish the checklist for
LoopBack 4 GA release which included updating the status of the framework in all
the `README` files in loopback-next monorepo and `loopback.io` docs, updating
LTS statuses, and releasing all packages at the new semver-major version of
`1.0.0`. You can read more about the GA release in our [announcement blog](https://strongloop.com/strongblog/loopback-4-ga), including our journey to
this major milestone.


#### Relations

After many months in progress, the implementation of "belongsTo" relation was finally finished. Before we could add "belongsTo" relation, preparatory work was needed.

Most importantly, we discovered a problem of cyclic references between models. When a Customer has many Order instances, and an Order belongs to a Customer, then a cyclic reference is created in the source code. For example, to create a Customer repository instance, we need an Order repository instance to allow us to access related orders. At the same time, to create the required Order repository instance, we need a Customer repository instance first, to access the customer each order belongs to.

To solve this problem, we reworked the way how relations are configured and replaced direct model reference (e.g. `@hasMany(Order)`) with a type resolver (e.g. `@hasMany(() => Order))`. Similarly, repositories are accepting a Getter for obtaining instances of relate repositories.

You can find more details about these changes in the following pull requests:
 - [Type resolver for property decorators](https://github.com/strongloop/loopback-next/pull/1751)
 - [Break cyclic dependencies in relations](https://github.com/strongloop/loopback-next/pull/1787)

With the foundation changes in place, adding "belongsTo" implementation became relatively straightforward. See the [pull request #1794](https://github.com/strongloop/loopback-next/pull/1794) for details.

With two relations in place, our codebase become a bit convoluted. Most of the relations-related code lived in two files `relation.decorator.ts` and `relation.factory.ts` that were huge in size and difficult to navigate around. Adding a new relation required updates of these two files, causing a high risk of merge conflicts.

To address this issue, we have refactored this part of our codebase as follows:
 - Two top-level files `relation.types.ts` and `relation.decorator.ts` define interfaces, types and functions shared by all relations.
 - There is one directory for each relation type, this directory contain all implementation bits.
 - Inside each per-relation directory, there are three relevant files (besides the index): a decorator, a repository and a repository/accessor factory.

The test files were not reorganized yet to avoid merge conflicts with the ongoing work on the [hasOne relation](https://github.com/strongloop/loopback-next/pull/1879), it's a task we would like to work on in the near future.

#### REST

In order to provide consistent and smooth user experience when sending requests
to your endpoints in LoopBack, we decided to convert the boolean response we
send back for `PATCH` and `PUT` requests to JSON response with the
value. On top of that, we updated paths like `PATCH /my-models` and `GET
/my-model/count` to give back JSON wrapped responses instead of number of
updated instances and count of instances, respectively. Check out [Pull Request #1170](https://github.com/strongloop/loopback-next/pull/1770) for more details.

Moreover, the much needed API for serving static assets was finally added to the
framework. The initial implementation had two major limitations:
 - Static assets could not be served from '/'
 - The static assets api overrode LoopBack's own underlying router. 

Both the issues were resolved in subsequent updates. For more details, see [PR#1848](https://github.com/strongloop/loopback-next/pull/1848).

A major performance improvement (close to 15x improvement in `POST` requests)
was made by caching schema validators in incoming requests as well in [PR#1829](https://github.com/strongloop/loopback-next/pull/1829).

#### IBM Cloud Deployment

LoopBack 4 is IBM Cloud capable now and a guide has been written and will be
published showing how to create a Cloudant-based LoopBack app locally and
deploying it to IBM Cloud using Cloud Foundry.

The team has planned to focus efforts on Kubernetes deployment in the future
which would provide much more advanced capabilities.

### Build infrastructure

We are actively investigating how to leverage Project References introduced by TypeScript 3.0 in LoopBack monorepository to speed up the build and enable watching mode for the TypeScript compiler.

The spike in [pull request #1636](https://github.com/strongloop/loopback-next/pull/1636) shown that it's not possible to have multiple compilation targets (`dist8` for Node.js 8.x, `dist10` for Node.js 10.x) while using Project References. Considering how few language features are added by Node.js 10.x, we decided to switch back to single compilation target (distribution directory).

- In [PR#1803](https://github.com/strongloop/loopback-next/pull/1636), we reworked our build and runtime loaders to always use a single compilation target `es2017` and a single output directory `dist`. With this change in place, we also simplified the build scripts defined in `package.json` and reworked package-level `index.js` files to always load code from `dist`. The project templates used by `lb4` were updated accordingly too.
- In [PR#1809](https://github.com/strongloop/loopback-next/pull/1809), we reworked few more places in our project templates to stop using `@loopback/dist-util` package.
- In [PR#1810](https://github.com/strongloop/loopback-next/pull/1810), we have deprecated `@loopback/dist-util` package and removed any remaining references to it in our code base.
- Finally, [PR#1823](https://github.com/strongloop/loopback-next/pull/1823) removed `@loopback/dist-util` from our monorepo.

If your project was created with a pre-1.0 version of our CLI tooling, then please upgrade it to follow the new project layout as scaffolded by the recent versions of our `lb4` CLI command.

### Stretch Goals

#### Home page for LB4 Apps

When users first run a LoopBack 4 application and go to its root `/` page, they
expect to see some sort of home page for it instead of a `404` not found.
Therefore, we decided it is neccessary to have a default home page which shows
basic information about the application, and links to resources that developers
might find handy such as LoopBack's API Explorer and the OpenAPI specification
of the app. This also arised as we developed the E-Commerice example application
and have some sort of front end as the home page for it. 

We used a controller which renders a self-contained HTML at the base
path of LoopBack 4 applications and added a template into our CLI package to
include it for newly scaffoled applications. Take a look at [PR
#1763](https://github.com/strongloop/loopback-next/pull/1763) to see how it was
done. We also modified our existing examples `todo`, `todo-list`, and
`soap-calculator` to include it in [PR #1814](https://github.com/strongloop/loopback-next/pull/1814).

### Community Support

During the month of October, we saw lots of user engagement with LoopBack 4 in
terms of incoming issues and pull requests. We'd like to thank our users and
maintainers for their continued interest and contributions! Our team has also
worked on performance improvements, refactoring, and neat features that had
pressing needs for our users. Here is a non-exhaustive list of some PRs in this
regard:

- Improving path validation and routing engine with trie
  [PR#1765(https://github.com/strongloop/loopback-next/pull/1765)
- Avoiding multiple array allocation in `FilterBuilder` in
  [PR#1865](https://github.com/strongloop/loopback-next/pull/1865)
- Adding type saftey for query filter and where objects for intelliSense support
  in [PR#1816](https://github.com/strongloop/loopback-next/pull/1816)
- Simplifying the code dealing with validation of relation definitions with
  `InvalidRelationError` class in
  [PR#1840](https://github.com/strongloop/loopback-next/pull/1840)
- Generating schemas for `x-ts-type` extension in
  [PR#1907](https://github.com/strongloop/loopback-next/pull/1907)
- Cleaning up our Todo tutorial in
  [PR#1846](https://github.com/strongloop/loopback-next/pull/1846)
- Fixing glob options in CLI module to support Windows paths in
  [PR#1958](https://github.com/strongloop/loopback-next/pull/1958)
- Not relying on transitive dependencies from Express in
  [PR#1918](https://github.com/strongloop/loopback-next/pull/1918)
- Failing fast in our CLI prompts for invalid values in
  [PR#1856](https://github.com/strongloop/loopback-next/pull/1856)

### LoopBack 3

We had continued focus on MongoDB connector in October for LoopBack 3. We added
support for `decimal128` type in
[PR#475](https://github.com/strongloop/loopback-connector-mongodb/pull/475)
which needed it to support `mongodb@3.4` or above. Meanwhile, we had two
community PRs, one adding support for insensitive indexes in
[PR#417](https://github.com/strongloop/loopback-connector-mongodb/pull/417), and
another changing the url parser used by the connector in
[PR#462](https://github.com/strongloop/loopback-connector-mongodb/pull/462),
that introduced breaking changes and also required the connector to drop support
for `mongodb@3.2` which was reached End of Life in September 2018. We made the
neccessary changes in our CI infrastructure to accomodate those changes and were
able to land all 3 PRs and release a minor and patch update versions for the
connector. We continue to work on the connector and will be releasing a major
release that includes those breaking changes shortly. Check
out
[Issue#476](https://github.com/strongloop/loopback-connector-mongodb/issues/476)
for more details.

We've also gone through certain LoopBack 3 packages to mark them as being in
Active LTS such as `loopback-boot`, `strong-remoting`, `loopback-workspace`,
`loopback-swagger`.

## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
- [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
- [Reporting issues](https://github.com/strongloop/loopback-next/issues)
- [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
- [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)
