---
layout: post
title: LoopBack 4 September 2018 Milestone Update
date: 2018-10-02
author: Janny Hou
permalink: /strongblog/september-2018-milestone/
categories:
  - Community
  - LoopBack
---

General Availability (GA) is approaching! During the last full month before [LoopBack 4](http://v4.loopback.io/) GA release, the team focused on finishing the remaining GA stories and fixing known issues discovered internally and from the community to improve the framework's stability and extensibility. It's also a time to prepare and plan for our post-GA era. Read more to know the progress of each functional area.

<!--more-->

## Accomplishments

### CLI

#### Repository and Service Generator

First I would like to say many thanks to our community contributor [Mario Estrada](https://github.com/marioestradarosa), who implemented the repository generator (and the service generator too)! By running `lb4 repository`, you can create a repository that encapsulates a model and a datasource being selected by answering prompts or being provided in the CLI options(the generator validates the existence for you). We support two repository types: `KV` and `CRUD`. The repository type is inferred from the selected datasource and id property name is inferred from from the selected model. Check documentation [Repository Generator](https://loopback.io/doc/en/lb4/Repository-generator.html) to learn more details about it.

Mario also added the generator for creating services(REST/GRPC/SOAP) with existing datasources. A service supports a config file. You can read documentation [Service Generator](https://loopback.io/doc/en/lb4/Service-generator.html) to know more about the prompts and various ways to provide the config file.

#### Update Notifier

A community module `update-notifier` is added to remind users of newer CLI versions. You will see the warning if using an old version of `@loopback/cli`.

### IBM Cloud

We've added a deployment guide to our documentation to show how to deploy a LoopBack 4 application to IBM Cloud. The steps include scaffolding the app by cli, configuring local setup, enabling retrieving credentials from cloud environment, testing on local and deploying the app. You can check [Deploying to IBM Cloud](https://loopback.io/doc/en/lb4/Deploying-to-IBM-Cloud.html) for the details.

### Validation and Coercion

After supporting the coercion/validation for request body and primitive type parameters, we are now also able to coerce/validate the object parameter described with a complex OpenAPI schema.

We allow an API defined in controller to accept parameters of complex types as objects and have the runtime to convert string inputs to such complex types. A new decorator `@param.query.object()` is introduced to describe a parameter as an object and optionally provide the schema for the accepted values. You can check the [API documentation](https://github.com/strongloop/loopback-next/blob/master/packages/openapi-v3/src/decorators/parameter.decorator.ts#L208-L215) for the decorator's usage.

There are two flavours to send the parameter from a request:

- "deepObject" encoding as described by OpenAPI Spec v3:

  ```
  GET /api/products?filter[where][name]=Pen&filter[limit]=10
  ```

- JSON-based encoding for compatibility with LoopBack 3.x:

  ```
  GET /api/products?filter={"where":{"name":"Pen"},"limit":10}
  ```

Leveraging this decorator, we also updated default CRUD operations to describe `filter` parameters with model schemas. You can find the new version of CRUD endpoints in [the documentation of controller generator](https://loopback.io/doc/en/lb4/Controller-generator.html#rest-controller-with-crud-methods)

### E-Commerce Example

Our e-commerce application is taking shape. We've added `Order` component and `ShoppingCart` controller in this month to increase the complexity of application. New component `Order` encapsulates an `Order` model and a mongodb datasource. A `hasMany` relation is created between `User` and `Order`. We do caught and fixed some potential issues and gaps when enriching the application, like the mongodb id coercion bug on the related model and the customization of HTTP response. When adding the `addItem` operation in `ShoppingCart` controller, we also fixed the potential race condition between calling `WATCH` and `EXEC` by introducing a retry operation until the item get added successfully.

### OpenAPI Specification

#### Response Specification

To generate complete OpenAPI path specifications, we added the responses specification for default CRUD methods. At first we introduced a `@response` decorator to do that, but considering the multiple-content structure within the response specification, it's redundant to introduce a new decorator when operation decorators like `post` allows providing the same thing. We just need to add generating the schema specification from the specified model class. Limited by the type check of the content specification team decided to extend it by introducing a `x-ts-type` property that can be used to specify the schema of a response object.

An example would be:

```ts
  @post('/todo-lists/{id}/todos', {
    responses: {
      '200': {
        description: 'TodoList.Todo model instance',
        content: {'application/json': {'x-ts-type': Todo}},
      },
    },
  })
  async create(
    @param.path.number('id') id: number,
    @requestBody() todo: Todo,
  ): Promise<Todo> {
    return await this.todoListRepo.todos(id).create(todo);
}
```

#### Resolve Type Date

We've added the support for built-in LoopBack type `Date`, now you can define a `Date` type property in a model without adding the OpenAPI schema manually. The corresponding OpenAPI schema of type `Date` is: 

```
{
  type: 'string',
  format: 'date-time',
}
```

### Explorer

#### Redirection

We fixed the explorer redirection problem when app is behind a proxy, now it skips setting the port when host is set and the port is the default for http and https. The explorer of the IBM Cloud app now redirects to the [correct url]( https://loopback.io/api-explorer/?url=https://lb4app.eu-gb.bluemix.net/openapi.json)

#### New Explorer Server

We switched from swagger UI to our LoopBack server that hosts the API explore: [http://explorer.loopback.io](http://explorer.loopback.io), which also has a fresh UI design. Take the app running locally as an example, now you can open the explorer on the url [http://localhost:3000/explorer](http://localhost:3000/explore), same as LoopBack 3.

Also several options are allowed for a more flexible configuration of the explorer. Check [configure the api explorer](https://loopback.io/doc/en/lb4/Server.html#configure-the-api-explorer) and [customize how openapi spec is served](https://loopback.io/doc/en/lb4/Server.html#customize-how-openapi-spec-is-served) to learn more.


### Relation

When adding the `belongsTo` relation, we were blocked by a circular type reference issue. It happens when you define bidirectional relations, which is the most common case. For example, `Customer` has many `Order`, and `Order` belongsTo `Customer`. Or a model has a relation to itself. A type provider that defers the type resolution is introduced to solve the problem. 

The original PR tries to address the type resolution and implement the `belongsTo` decorator together, which is a huge amount of work. Therefore we break it down into smaller chunks. The first step is adding the type provider(merged). Now a relation is declared like `@hasMany(() => Order)`. Next we will rework `hasMany` to accept type provider only and build the `belongsTo` decorator/repository. The plan is described in [PR#1618](https://github.com/strongloop/loopback-next/pull/1618#issuecomment-424432746)

### REST

#### CRUD operations

Repository methods `*ById` now throw an `EntityNotFound` error when there is no entity with the provided id found. The REST layer set status code accordingly for client side to exam: 
method `findById` throws a 404 code and the rest ones (`replaceById`, `updateById`, `deleteById`) return a 204 when body is undefined.

#### Write HTTP Response

Previously the returned HTTP response was serialized on the REST layer, which is not flexible enough for users to customize properties like status code, body and content type. Now we allow bypassing http response writing and custom response properties in the controller functions. You can override the default behaviour like returning 201 instead of 200 for POST methods, or like changing the content type from `text/plain` to `html`.

### TestLab

We discovered gaps of utility functions when writing more tests for the e-commerce LoopBack 4 app, therefore added more in `@loopback/testlab` to simplify writing tests:

- `createRestAppClient()`: return the Client for a given REST app
- `toJSON()`: converts a model instance into a data object as returned by REST API

### Build

TypeScript announced its 3.1 release in September and we upgraded `@loopback/build` to adopt it right after to leverage new features like array mapping and properties on function declarations. You can check [the release blog](https://blogs.msdn.microsoft.com/typescript/2018/09/13/announcing-typescript-3-1-rc/) to know more.

### LoopBack 3

For LoopBack 3, our focus this month was on the mongodb and soap connectors. For soap connector, the url of example `.wsdl` file is updated to fix the tests failing due to non-existent SOAP endpoints. For mongodb connector, we fixed the dependency installation issue caused by node version incompatibility and also enabled the `strictObjectIDCoercion` flag for CRUD methods.

## Team Changes

Our new intern [Nora](https://github.com/nabdelgadir) joined LoopBack team this month. She has made good progress on getting familiar with LoopBack 4 and contributing the code. In the meantime, we are very sad to say goodbye to [Taranveer](https://github.com/virkt25). He has significant contributions on different aspects, thanks for all his ideas and effort on the framework's born. It has been an amazing experience to work with Taranveer. Wish him all the best!

## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
- [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
- [Reporting issues](https://github.com/strongloop/loopback-next/issues)
- [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
- [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)
