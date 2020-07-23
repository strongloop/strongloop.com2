---
layout: post
title: LoopBack 4 July 2020 Milestone Update
date: 2020-08-05
author: Agnes Lin
permalink: /strongblog/july-2020-milestone/
categories:
  - Community
  - LoopBack
published: true
---

We can't believe that it is already August! Let's check out the work we did in July:

- [HasManyThrough Relation](#hasmanythrough-relation)
- [Documentation Enhancements](#documentation-enhancements)
- [Reorganize Code and Docs Along Abstraction Levels](#reorganize-code-and-docs-along-abstraction-levels)
- [Bug Fixes](#bug-fixes)
- [Community Contribution](#community-contribution)

<!--more-->

## HasManyThrough Relation

A `HasManyThrough` relation sets up a many-to-many connection through another model. A real-world example is a doctor has many patients through appointments. The relation can be defined with `@hasMany` decorator as:

```ts
  //...
  @hasMany(() => Patient, {through: {model: () => Appointment}})
  patients: Patient[];
```

We finished most of implementation in June, and we added `HasManyThrough` to the relation CLI and also related documentation so that users could learn it better. Please make sure you have `@loopback/repository` with version 2.10.0 or higher installed.

### Documentation

The [`hasManyThrough` Relation](https://loopback.io/doc/en/lb4/HasManyThrough-relation.html) page is being added under [Relations](https://loopback.io/doc/en/lb4/Relations.html) page. We introduced the use cases, definitions, and examples of how you can customize the relation to meet your requirements. Nevertheless, as mentioned in the docs, because it is an experimental feature, there are some missing functionalities such as [`inclusionResolver`](https://github.com/strongloop/loopback-next/issues/5946). Feel free to join discussions on GitHub or even contribute :D

### CLI Command

Command line interfaces (CLI) is a convenient tool to help you create artifacts quickly. We added `hasManyThrough` relation to `lb4 relation` command. With a few prompts, you can define a `hasManyThrough` relation easily:

```sh
$ lb4 relation
? Please select the relation type hasManyThrough
? Please select source model Doctor
? Please select target model Patient
? Please select through model Appointment
? Foreign key name that references the source model to define on the through model
 doctorId
? Foreign key name that references the target model to define on the through model
 patientId
? Source property name for the relation getter (will be the relation name)
 patients
```

Don't forget to install the latest `@loopback/cli` to try it out!

## Documentation Enhancements

One of our recent targets is to upgrade the documentation system. As you can see on the site, we reorganized most of the items in sidebar. In the overview page, the section [How is our documentation organized](https://loopback.io/doc/en/lb4/index.html#how-is-our-documentation-organized) introduces how you can find documentation in the four quadrants.

Besides improving the structure, here are some documentation enhancements we'd like to share:

### Apply JWT Authentication Component to Shopping Example

The [`@loopback/authentication-jwt`](https://github.com/strongloop/loopback-next/tree/master/extensions/authentication-jwt) component was created to make adding JWT authentication to your application earlier. We've applied it to the [shopping example](https://github.com/strongloop/loopback4-example-shopping). To find out more, see the [JWT authentication extension documentation page](https://loopback.io/doc/en/lb4/JWT-authentication-extension.html).

### How to Access Multiple Models in a Single Transaction

A _transaction_ is a sequence of data operations performed as a single logical
unit of work. LoopBack 4 has many relational database connectors support such logic requirements. We added a section [Accessing multiple models inside one transaction](https://loopback.io/doc/en/lb4/Using-database-transactions.html#accessing-multiple-models-inside-one-transaction) to show how it can be achieved.

### Custom AJV Validation

We realized that the current AJV Validation documentation is missing a crucial information piece on how to enable custom validation and error messages. Please check out the section [Custom validation rules and error messages](https://loopback.io/doc/en/lb4/Model.html#custom-validation-rules-and-error-messages) and [Validation example](https://github.com/strongloop/loopback-next/tree/master/examples/validation-app) for details.

## Reorganize Code and Docs Along Abstraction Levels

As LoopBack 4 is growing larger, we decide to hide some low-level tools from users so that the framework looks neat and friendly. In July, we hid module [`@loopback/openapi-v3`](https://github.com/strongloop/loopback-next/tree/master/packages/openapi-v3) as it can be loaded from [`@loopback/rest`](https://github.com/strongloop/loopback-next/tree/master/packages/rest).

We removed `@loopback/openapi-v3` from dependencies and also our CLI template dependencies. If you check the page [Extending OpenAPI Specification](https://loopback.io/doc/en/lb4/Extending-OpenAPI-specification.html) or other related pages, you will notice it is now hidden and replaced by `@loopback/rest`.

## Execute Raw NoSQL Queries

If you have a SQL database as back-end service, you can execute raw queries using the `execute` method that we have in `Repository`, and it works great. Unfortunately, `execute` does not work for NoSQL connectors such as MongoDB as they require more than just a `command` string and `args` array.

In July, we started working on how we can improve LB4 API and MongoDB connector API to make it easy to execute raw MongoDB commands. We added a `DataSource.execute` method to the Juggler, and leveraged it to support different `execute` styles. We also added support for non-SQL variants of `Repository.execute()` in the `loopback/repository` module. More works will be done in August. You can check the progress in story [Execute raw NoSQL queries](https://github.com/strongloop/loopback-next/issues/3342) on GitHub if you're interested.

## Bug Fixes

There was a story that a boy woke up in one morning and found himself transformed into a gigantic bug. We don't want that to happen, so we fixed a few bugs in July:

### Unable to Perform Nested Filters

As we added the support for coercing query object with schema last month, it exposed a bug that the nested scope filters don't have the correct constraints. It is being fixed and released in `@loopback/rest@5.2.1`. Now you can include nested navigational properties using filter like:

```ts
{
  include: [
    {
      relation: "orders",
      scope: {
        // nested relation
        include: [
          {
            relation: "someOtherRelation",
          },
  ...
}
```

### Query with Dollar Signs in MongoDB Connector

If you're using MongoDB, you would be used to have dollar signs ($) in your queries. However, the dollar signs are not needed in LB4 general queries, and that's why [loopback-mongodb-connector](https://github.com/strongloop/loopback-connector-mongodb) users get confused usually. To improve the user experience, we made some changes in the connector [loopback-mongodb-connector](https://github.com/strongloop/loopback-connector-mongodb), so that the connector users won't get errors even if the queries contain extra dollar signs. The change is released in `@loopback-connector-mongodb@5.3.0`

## Community Contribution

### New Community Maintainers

We are glad to have [@nabdelgadir](https://github.com/nabdelgadir) and [@madaky](https://github.com/madaky) to be one of our community maintainers. We appreciate your great work you've done and welcome to the team.

### Highlights

- As LoopBack 4 is designed to be more scalable and extensible, there are numbers of extensions created by the open source community. You may find some interesting and helpful extensions under the [Community extensions](https://loopback.io/doc/en/lb4/Community-extensions.html) page. We are also considering adding example usages of LB4 from the community. Please let us know if you got any great extensions or examples you would like to share with us!
- The community user [@zyqVizzzzz](https://github.com/zyqVizzzzz) translated several tutorials for LB4 in Chinese. They can be found in the page [教程（Tutorials）](https://loopback.io/doc/zh/lb4/Tutorials). We really appreciate it! If you're interested in translating LB4 documentation, the instructions can be found in the page [Translation](https://loopback.io/doc/en/contrib/translation.html).

In order to make your contribution process simpler, we will be gradually changing the contribution method from Contribution License Agreement (CLA) to Developer Certificate of Origin (DCO). Take a look at [this blog](https://strongloop.com/strongblog/switching-to-dco/) to find out what the changes are and what it means to you.

## What's Next?

If you're interested in what we're working on next, you can check out the [August Milestone](https://github.com/strongloop/loopback-next/pull/6028).

## Call to Action

In 2020, we look forward to helping you and seeing you around! LoopBack's success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Here's how you can join us and help the project:

- [Report issues](https://github.com/strongloop/loopback-next/issues).
- [Contribute](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md) code and documentation.
- [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Join](https://github.com/strongloop/loopback-next/issues/110) our user group.
