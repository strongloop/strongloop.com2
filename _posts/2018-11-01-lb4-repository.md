---
layout: post
title: Productivity with LB4 Repository
date: 2018-11-01
author: Mario Estrada
permalink: /strongblog/productivity-with-lb4-repository/
categories:
  - LoopBack
  - Community
---

One of the framework features that attracts application developers is **productivity**. In **_Loopback_ 4** the command line interface plays an important role to achieve it. If you are building a _Loopback 4_ application that interacts with a database and exposes **CRUD** operations, your flow might be as follows:

- Create an Application
- Add a Datasource
- Add a Model
- Add a **Repository**
  - Needs a Datasource and a Model
- And finally add a Controller
  - Needs a Model and a Repository

<!--more-->

Usually, after defining your `datasource(s)` you start defining your `model(s)` based on your design and then create the repositories that will serve as the _glue_ between `datasources` and `models` to finally create the `controllers` that will be interacting with client applications, executing business logic and invoking repository methods.

To support this flow completely and start achieving productivity, we welcome the recently addition to the **CLI** options, `lb4 repository`. This option is very powerful and can accept multiple models, infer their `ID` property and generate a repository for each of them in one _single command_.

The team is working very hard in the underlying code to support these options and make the framework more _stable_ on each release, knowing in advance that reliability is **also** a priority for any real world project.

> **NOTE**: We usually create the models first and then we move toward the rest of the components such as repositories, thus, having the option to accept multiple models can really save us a lot of time.

## Command Line Arguments

For now, let's assume we already have a **Datasource** named `ds` which is coming from the property `name` located in the `src/datasources/ds.datasource.json` and a **Model** named `MyModel` declared in the `src/repositories/my-model.repository.ts` file.

We can create a repository with the following command line:

```sh
lb4 repository --datasource ds --model myModel
```

> **Note:** The final repository name match automatically the associated model, however you can also specify a custom name with `lb4 repository myRepoName`.

The file `my-model.repository.ts` will be created in `src/repositories` and its content is listed below.

```ts
import { DefaultCrudRepository, juggler } from "@loopback/repository";
import { MyModel } from "../models";
import { DsDataSource } from "../datasources";
import { inject } from "@loopback/core";

export class MyModelRepository extends DefaultCrudRepository<
  MyModel,
  typeof MyModel.prototype.id
> {
  constructor(@inject("datasources.ds") dataSource: DsDataSource) {
    super(MyModel, dataSource);
  }
}
```

> **NOTE:** As you can see in the listing above, `lb4 repository` extends automatically either `DefaultCrudRepository` or `DefaultKeyValueRepository` depending upon the datasource selected.

You will notice that one of the `lb4 repository` features is the ability to infer the **ID** _property_ from the model file in `src/models`. In the listing above, you see that this property name is `id` but can be any name, it is really up to your database design.

In case `lb4 repository` could not infer the **ID** _property_ name, it will prompt you for it.

```sh
? **Please enter the name of the ID property for MyModel:** (id)
```

By default it suggests the `id` property name but you can type any name that reflects your design strategy.

You also have the option to specify the `ID`property name from the command line with the `--id` as follows.

```sh
lb4 repository myrepo --datasource ds --model myModel --id mykey
```

## Interactive Prompts

If you specify an invalid **Datasource** or **Model** or simply you don't specify any from the command line, **CLI** will prompt and guide you through interactive prompts. Let's run the following command:

```sh
lb4 repository
```

**CLI** will read the `src/models` and `src/datasources` directories, and then will present you the option to select the Datasource and then the model(s) that you want a repository to be generated for.

### Select a DataSource

```sh
? **Please select the datasource** (Use arrow keys)
> DsDatasource
```

>**Note:**  As you can see, in the interactive prompt above, the full data source class name is showed in the list.

### Select Model(s)

Next it will prompt you for the model(s). Here you are able to select more than one model using the `space bar` and the `arrow keys` to move up and down.

```sh
? **Select the model(s) you want to generate a repository**
◯ Product
◯ Item
❯◯ MyModel
❯◯ Customer
```

Notice that models `MyModel` and `Customer` were selected above. **CLI** will create two repositories with a set of final messages as follows:

```sh
create src/repositories/customer.repository.ts
create src/repositories/my-model.repository.ts
update src/repositories/index.ts
update src/repositories/index.ts

Repositories Customer,MyModel were created in src/repositories/
```

I hope you find in `lb4 repository` and the rest of the **CLI** options a useful tool to achieve **productivity** in your next project.

## Call for Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
- [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
- [Reporting issues](https://github.com/strongloop/loopback-next/issues)
- [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
- [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)


