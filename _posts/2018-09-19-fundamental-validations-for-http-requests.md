---
layout: post
title: Fundamental Validations for HTTP Requests with LoopBack 4 and OpenAPI Spec
date: 2018-09-19
author: Janny Hou
permalink: /strongblog/fundamental-validations-for-http-requests/
categories:
  - How-To
  - LoopBack
  - OpenAPI Spec
---

A Controller usually expects to get valid data from the HTTP request so it can focus on executing the business logic. However, there is never a guarantee that the client side sends valid data. For example, endpoint `GET Users/find` expects to get a number from the request query's property `limit`, but the request is sent as `GET Users/find?limit="astring"`, of which `limit` is a string instead of a number. In this case, people would like to see the invalid data being caught before it gets passed into the Controller function. 

Now in [Loopback 4](http://v4.loopback.io/), such validations are automatically handled by the framework, and a machine-readable error object is generated for each request to help people localize the invalid fields along with their details.

<!--more-->

In this example, we are working with LoopBack 4 and the [OpenAPI Specification](https://www.openapis.org/). As the first step of building a powerful HTTP request validation system, we have added fundamental validations for the raw data parsed from requests. The validations are embedded as part of the default sequence of the REST server, and are performed according to the endpoint's OpenAPI (OAI) operation specification. The data will be validated before the corresponding controller method gets invoked to make sure the method is executed with valid inputs.

The following code snippet defines an endpoint `PUT /todos/{id}` by decorating it with the [REST decorators](https://loopback.io/doc/en/lb4/Decorators.html#route-decorators). This blog will use it as a typical example to explain what validations are performed to the incoming request.

```ts
class TodoController {
  constructor(@repository(TodoRepository) protected todoRepo: TodoRepository) {}

  @put('/todos/{id}')
  async replaceTodo(
    @param.path.number('id') id: number,
    @requestBody() todo: Todo,
  ): Promise<boolean> {
    return await this.todoRepo.replaceById(id, todo);
  }
}
```

## Parameters Validation

OAI 3.0.x describes the data from a request's header, query and path in an operation specification's `parameters` property. In a Controller method, such an argument is typically decorated by `@param()`.

The validation guarantees that the data parsed from request is valid in the type described by the parameter specification. For example, the first argument in the function `replaceTodo()` is decorated with `@param.path.number('id')`. It means the raw data of `id` is parsed from the request's path and it should be a valid number. Invalid data like `astring` or `true` would be rejected.

The validation rule varies based on the parameter's [OAI primitive type](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#data-types), which is inferred from the decorator `@param.<http_source>.<OAI_primitive_type>`. `@param.path.number()` is one of the shortcuts for `@param()`, other shortcuts with different combinations of HTTP source and OAI types could be found in the [API Docs](https://apidocs.strongloop.com/@loopback%2fdocs/openapi-v3.html#param).

*Please note that the validation against parameters checks the primitive types only, it doesn't apply JSON-schema based validation for non-body arguments.*

A more detailed documentation for the parameter validations can be found in the [Parameters section](https://loopback.io/doc/en/lb4/Parsing-requests.html#parameters) on the Parsing Requests page.

## Request Body Validation

A request body is usually a nested object and is described by an OAI schema. We leverage [`AJV`](https://github.com/epoberezkin/ajv) module to validate the data with a JSON schema generated from the OAI schema specification.

As you could see, the second argument in the example method is decorated by `@requestBody()`, which generates the OAI request body specification from its type metadata. The schema specification inside it is inferred from its type `Todo`. The type is exported from a `Todo` model.

To collect the OAI schema information from a model, the model class has to be defined with `@model()` with its properties defined with `@property()`, like the code below:

```ts
@model()
export class Todo extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
  })
  desc?: string;

  constructor(data?: Partial<Todo>) {
    super(data);
  }
}
```

With the `Todo` model defined above, a valid todo instance could have 3 properties: 
 
  - `id` with type `number`
  - `title` with type `string`
  - `desc` with type `string`

And the property `title` is required.

The corresponding OAI schema which will be used to validate the request body data would be:

```ts
{
  type: 'object',
  properties: {
    id: {type: 'number'},
    title: {type: 'string'},
    desc: {type: 'string'},
  },
  required: ['title'],
}
```

If an incoming request has a body missing `title`(e.g. `{id: 1}`), or containing data in the wrong type (e.g. `{id: '1', title: 'invalid todo'}`), it would be rejected due to the failed validation.

To learn various ways of applying `@requestBody()` and the tips for defining the model, please read the [Request Body section](https://loopback.io/doc/en/lb4/Parsing-requests.html#request-body) on the Parsing Request page.

## Localizing Request Body Validation Error

The validation errors are returned in batch mode. The details of the errors could be found in property `details` of the returned `error`. You can use `error.details` to localize the invalid fields.

For example, if the received request body data is 

```ts
{
  id: '1',
  desc: 'an invalid instance missing title and with wrong id type'
}
```

The returned `error.details` would be: 

```ts
[
  {
    path: '.id',
    code: 'type',
    message: 'should be number',
    info: {type: 'number'},
  },
  {
    path: '',
    code: 'required',
    message: "should have required property 'title'",
    info: {missingProperty: 'title'},
  },
]
```

Please check the [Localizing Errors section](https://loopback.io/doc/en/lb4/Parsing-requests.html#localizing-errors) on the Parsing Requests page to have a comprehensive understanding of each field in the `error.details` entry.

## Define endpoint With Operation Specification

If you're using API first development approach, you can also provide the operation specification in decorator [`api()`](https://loopback.io/doc/en/lb4/Decorators.html#api-decorator) or by calling [`app.route()`](https://loopback.io/doc/en/lb4/Routes.html#creating-rest-routes), this requires you to provide a completed request body specification.

## Coming Features

The LoopBack team will be adding more features to improve the robustness of the validation system. For the parameters in type object, we will support serialization/deserialization of them in [issue#100](https://github.com/strongloop/loopback-next/issues/100). And a content type based validation for the request body will be implemented in [issue#1494](https://github.com/strongloop/loopback-next/issues/1494).

## Call for Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
- [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
- [Reporting issues](https://github.com/strongloop/loopback-next/issues)
- [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
- [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)
