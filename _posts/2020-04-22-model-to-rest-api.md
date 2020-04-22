---
layout: post
title: Build REST APIs for CRUD operations from a model without coding
date: 2020-04-22 
author: Nora Abdelgadir
permalink: /strongblog/model-to-rest-api-feature/
categories:
  - Community
  - LoopBack
published: true
---

As LoopBack 3 is expected to reach its EOL by the end of this year, we have been working hard to achieve feature parity between LoopBack 3 and LoopBack 4. One feature of LoopBack 3 that we did not have in LoopBack 4 yet was the ability to go directly from only a model definition and model configuration to fully-featured CRUD REST API. Unlike LoopBack 3, LoopBack 4 relied on intermediate repository and controller classes in order to go from a model defintion class to use REST API. One thing that LoopBack 4 strives to do is make common tasks as easy as possible, while allowing advanced composition with loosely-coupled artifacts. So, after completing tasks from the related [epic](https://github.com/strongloop/loopback-next/issues/2036), we are now proud to announce that LoopBack 4 now offers support for going from a model definition to REST API with no custom repository or controller classes. 

<!--more-->

In LoopBack 4, the [model definition](https://loopback.io/doc/en/lb4/Model.html) provides the schema and the [datasource](https://loopback.io/doc/en/lb4/DataSources.html) configures how to access the database. Starting with these two artifacts, the user can directly expose REST API by using the following CLI command:

```sh
lb4 rest-crud
```

For example, if you have a model `Product` and datasource `db`, you can use the command as follows:

```sh
lb4 rest-crud --model Product --datasource db
```

The command can also take in multiple models at the same time. You can find more information on how to use the command in the [REST CRUD generator documentation](https://loopback.io/doc/en/lb4/Rest-Crud-generator.html).

What the command does is the following:

1) Creates a configuration file describing properties of the REST API:

    `/src/model-endpoints/product.rest-config.ts`

    ```ts
    import {ModelCrudRestApiConfig} from '@loopback/rest-crud';
    import {Product} from '../models';

    module.exports = <ModelCrudRestApiConfig>{
        model: Product, // name of the model
        pattern: 'CrudRest', // make sure to use this pattern
        dataSource: 'db', // name of the datasource
        basePath: '/products',
    };
    ```

2) Adds `CrudRestComponent` from `@loopback/rest-crud` to the application:

    `src/application.ts`

    ```ts
    import {CrudRestComponent} from '@loopback/rest-crud';
    ```

    ```ts
    this.component(CrudRestComponent);
    ```

Documentation for this feature can be found in [Creating CRUD REST APIs from a model](https://loopback.io/doc/en/lb4/Creating-crud-rest-apis.html). 

## Implementation

We implemented [`@loopback/rest-crud`](https://github.com/strongloop/loopback-next/tree/master/packages/rest-crud) based on the [`@loopback/model-api-builder`](https://github.com/strongloop/loopback-next/tree/master/packages/model-api-builder) package. This model API builder is what builds CRUD REST API from the model definition and datasource.

## Example Application

To demonstrate this functionality with an example, we added a new example based on the [`Todo` example](https://github.com/strongloop/loopback-next/tree/master/examples/todo). [`@loopback/example-rest-crud`](https://github.com/strongloop/loopback-next/tree/master/examples/rest-crud) mimics the behavior of the `Todo` example, but does not include any custom repository or controller classes like the `Todo` example. To download this example, use the following command:

```sh
lb4 example rest-crud
```

## Future Work

While the main epic is now complete, there are additional out of scope tasks that are part of future work. If you would like to contribute, please see the following issues:

- [From relation definition to REST API with auto-generated repository/controller classes](https://github.com/strongloop/loopback-next/issues/2483)
- [KeyValueRestController extension](https://github.com/strongloop/loopback-next/issues/2737)
- [Expose custom remote methods](https://github.com/strongloop/loopback-next/issues/2482)

The LoopBack team appreciates all your contributions!

## Call to Action

In 2020, we look forward to helping you and seeing you around! LoopBack's success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Here's how you can join us and help the project:

- [Report issues](https://github.com/strongloop/loopback-next/issues).
- [Contribute](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md) code and documentation.
- [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Join](https://github.com/strongloop/loopback-next/issues/110) our user group.
