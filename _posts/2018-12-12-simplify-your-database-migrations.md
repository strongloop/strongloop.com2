---
layout: post
title: Simplify Your Database Migrations Using LoopBack 4
date: 2018-12-12
author: Miroslav Bajtoš
permalink: /strongblog/simplify-your-database-migrations
categories:
  - LoopBack
---

As applications evolve and developers add new features, the structure of the backing database evolves as well. In LoopBack 3, we provided JavaScript API for automatic migration of database schemas. Recently, we improved LoopBack 4 to leverage these APIs and provide an easy-to-use database migration tool available from the command-line.

For example, when the developer adds a new property to a model, they also need to define a new column in their SQL database schema. NoSQL databases like Cloudant and MongoDB don't require schema, but still require developers to define indices to speed up frequent queries.

<!--more-->

Projects scaffolded with a recent version of our CLI tool `lb4` come with a new package script that automates the database migration process.

```
$ npm run migrate
```

Under the hood, this script is a thin wrapper for a new Application API contributed by the RepositoryMixin: [app.migrateSchema()](http://apidocs.loopback.io/@loopback%2fdocs/repository.html#RepositoryMixinDoc.prototype.migrateSchema). The method `migrateSchema` iterates over all datasources registered with the application and ask the underlying connector to migrate database schema. You can learn more in our  [Database migrations](https://loopback.io/doc/en/lb4/Database-migrations.html) documentation, as well as the pull requests [#2059](https://github.com/strongloop/loopback-next/pull/2059) and [#2094](https://github.com/strongloop/loopback-next/pull/2094).

In the future, we want to implement a more robust migration framework that will empower the developers to fully control database commands executed during the migration. We would like to work on these improvements together with our community, so we encourage you to join the discussion in GitHub [issue #487](https://github.com/strongloop/loopback-next/issues/487)

## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Reporting issues](https://github.com/strongloop/loopback-next/issues).
- [Contributing](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md)
  code and documentation.
- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Joining](https://github.com/strongloop/loopback-next/issues/110) our user group.

