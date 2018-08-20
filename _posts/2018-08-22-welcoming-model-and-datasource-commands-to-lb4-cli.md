---
title: Welcoming Model and Datasource Commands to LB4 CLI
layout: post
date: 2018-08-22T00:00:13+00:00
author: Taranveer Virk
permalink: /strongblog/welcoming-model-and-datasource-commands-to-lb4-cli/
categories:
  - LoopBack
  - Community
---

[LoopBack 4](http://v4.loopback.io/) is the biggest change to the framework since it was first created. Along with it comes a brand new CLI tool `@loopback/cli`, which makes it easy for developers to scaffold applications and create artifacts such as controllers for LoopBack 4. This CLI tool is now able to generate [Model](https://loopback.io/doc/en/lb4/Model.html) and [DataSource](https://loopback.io/doc/en/lb4/DataSources.html) artifacts using the `lb4 model` and `lb4 datasource` command respectively. Continue reading to learn more about these commands.

<!--more-->

## lb4 Model

LoopBack 4 needs metadata associated with each Model property to power features such as validation and coercion when accessed through a Repository. This means that defining a Model class can get quite tedious. The new `lb4 model` command simplifies creating a story by asking simple prompts and generating code.

The new command must be run from within a LoopBack 4 Application as follows:

```sh
lb4 model [<name>]
```

You can supply the model name above as an argument or else the tool will prompt you for the Model name. 

Next, the CLI tool will prompt for Model properties, similar to LoopBack 3 CLI, until a blank property name is entered.

```sh
? Enter the property name:
? Property type: (Use arrow keys)
❯ string
  number
  boolean
  object
  array
  date
  buffer
  geopoint
  any
? Is ID field? (y/N)
? Required?: (y/N)
? Default value [leave blank for none]:

Let's add another property to Todo
Enter an empty property name when done
```

The tool will then generate the model class in `/src/models` directory and export it from `/src/mdoels/index.ts`. The generated Model class will have all the necessary metadata provided to the `@model` / `@property` decorators. 

Some notes about the `lb4 model`:

- Model classes will extend `Entity` as its base class by default _(other options to be added later)_
- `Is ID field?` is only asked until a property is set as the Model ID

## lb4 Datasource

DataSource provides LoopBack Repositories the information needed to connect to various databases. Depending on the type of database (connector) being used, different options / properties need to be passed to the DataSource class.

The new command will prompt you for the properties based on the connector and create both a JSON config file and a DataSource class. It can be used as follows:

```sh
lb4 datasource [<name>]
```

Just as with a model, you can supply the datasource name as an argument or have the tool prompt you for the DataSource name.

Next, the CLI tool will prompt you to select a [connector](https://loopback.io/doc/en/lb3/Connectors-reference.html).

```sh
? Select the connector for test: (Use arrow keys)
❯ In-memory db (supported by StrongLoop)
  In-memory key-value connector (supported by StrongLoop)
  IBM Object Storage (supported by StrongLoop)
  IBM DB2 (supported by StrongLoop)
  IBM DashDB (supported by StrongLoop)
  IBM MQ Light (supported by StrongLoop)
  IBM Cloudant DB (supported by StrongLoop)
  Couchdb 2.x (supported by StrongLoop)
  IBM DB2 for z/OS (supported by StrongLoop)
  IBM WebSphere eXtreme Scale key-value connector (supported by StrongLoop)
  Cassandra (supported by StrongLoop)
  Redis key-value connector (supported by StrongLoop)
  MongoDB (supported by StrongLoop)
  MySQL (supported by StrongLoop)
  PostgreSQL (supported by StrongLoop)
  Oracle (supported by StrongLoop)
  Microsoft SQL (supported by StrongLoop)
  REST services (supported by StrongLoop)
  SOAP webservices (supported by StrongLoop)
  Couchbase (provided by community)
  Neo4j (provided by community)
  Kafka (provided by community)
  SAP HANA (provided by community)
  Email (supported by StrongLoop)
  ElasticSearch (provided by community)
  z/OS Connect Enterprise Edition (supported by StrongLoop)
  other
```

And lastly, the tool will prompt you for connector specific settings. 

The tool will then create the DataSource class and an accompanying JSON config file containing the connector settings in `/src/datasources`. The generated DataSource class will also be exported from `/src/datasources/index.ts`. The tool will also install the connector package and `@loopback/repository` from `npm` if they aren't already installed in the project.

### DataSource Booting

`@loopback/boot` has also been updated to support booting `datasources`, meaning they are automatically discovered and bound to `@loopback/context` for use by your Application at runtime. To enable this, it is important that your Application use both the `BootMixin` and `RepositoryMixin`. DataSources generated using the CLI follow the default convention used by the Booter, but you can customize the boot convention like other booters.

You can add the mixins to your Application as follows:

```ts
// ... Original Imports above
import {BootMixin} from '@loopback/boot';
import {RepositoryMixin} from '@loopback/repository';

export MyApplication extends BootMixin(RepositoryMixin(Application)) {
    // implementation
}
```

And for reference the default BootOptions for DataSources is as follows:

```json
datasources: {
    dirs: ['datasources'],
    extensions: ['.datasource.js'],
    nested: true,
}
```

## Give it a Try

Try out the latest commands by installing the latest version of `@loopback/cli` using `npm i -g @loopback/cli` and share your experience with us via [GitHub Issues](https://github.com/strongloop/loopback-next/issues).

### Documentation

To learn more about the new commands more in-depth, check out our documentation:

* [Model CLI](https://loopback.io/doc/en/lb4/Model-generator.html)
* [DataSource CLI](https://loopback.io/doc/en/lb4/DataSource-generator.html)
* [@loopback/boot](https://loopback.io/doc/en/lb4/Booting-an-Application.html)
* [DataSource Booter](https://loopback.io/doc/en/lb4/Booting-an-Application.html#datasource-booter)

## Call for Action

LoopBack's success counts on you! We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

* [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
* [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
* [Reporting issues](https://github.com/strongloop/loopback-next/issues)
* [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
* [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)
