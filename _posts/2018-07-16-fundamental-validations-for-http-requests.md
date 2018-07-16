---
layout: post
title: Fundamental Validations for HTTP Requests
date: 2018-07-03T00:10:11+00:00
author: Janny Hou
permalink: /strongblog/fundamental-validations-for-http-requests/
categories:
  - Community
  - LoopBack
---

LoopBack 4 is building a powerful validation system for the HTTP requests. As the first step, we have added fundamental validations for the raw data parsed from requests. They are embedded as part of the default sequence of the rest server, and are performed according to the endpoint's OpenAPI(short for OAI) operation specification. The data is validated before the corresponding controller method gets invoked to make sure the methods are executed with valid inputs.

<!--more-->

The following code snippet defines an endpoint `PUT /todos/{id}` by decorating it with the rest decorators. This blog will use it as a typical example to explain what validations are performed to the incoming request.

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

OAI 3.0.x describes the data from a request's header, query and path in an operation specification's `parameters` property. In a controller method, such an argument is typically decorated by the `@param()`.

The validation guarantees that the data parsed from request is valid in the type described by the parameter specification. For example, the first argument in the function `replaceTodo()` is decorated with `@param.path.number('id')`. It means the raw data of `id` is parsed from the request's path and it should be a valid number. Invalid data like `astring` or `true` would be rejected.

The validation rule varies based on the parameter's [OAI primitive type](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#data-types), which is inferred from the decorator `@param.<http_source>.<OAI_primitive_type>`. `@param.path.number()` is one of the shortcuts for `@param()`, other shortcuts with different combinations of HTTP source and OAI types could be found in the [API Docs](https://apidocs.strongloop.com/@loopback%2fdocs/openapi-v3.html#param).

A more detailed documentation for the parameter validations could be found in the [section "Parameters"]() on page "Parsing Requests".

## Request Body Validation

A request body's data is described in OAI operation specification's `requestBody` property. The corresponding argument in a controller method is typically defined by the `requestBody()` decorator. We use [`AJV`](https://github.com/epoberezkin/ajv) module to to validate the data with a JSON schema generated from the OAI schema specification.

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

For an incoming request with body missing `title`(e.g. `{id: 1}`), or having data in the wrong type (e.g. `{id: '1', title: 'invalid todo'}`) would be rejected.

To learn various ways of applying `@requestBody()` and the tips for defining the model, please read the [section "Request Body"](link_tbd) on page "Parsing Request".

The validation errors are returned in batch model. The complete information of them could be found in property `details` of the returned `error`. You can use `error.details` to localize the invalid fields.

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

Please check the [section "Localizing errors"]() on page "Parsing Requests" to have a comprehensive understanding of each field in the `error.details` entry.

## Define endpoint With Operation Specification

If you're using API first development approach, you can also provide the operation specification in decorator [`api()`](https://loopback.io/doc/en/lb4/Decorators.html#api-decorator) or by calling [`app.route`](https://loopback.io/doc/en/lb4/Routes.html#creating-rest-routes), this requires you to provide a completed request body specification.

## Coming Features

- Serialization/deserialization of the parameters, see [issue#100](https://github.com/strongloop/loopback-next/issues/100).
- Perform request body validation based on the content type of a request, see [issue#1494](https://github.com/strongloop/loopback-next/issues/1494).

## Call for Action

LoopBack's future success counts on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
- [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
- [Reporting issues](https://github.com/strongloop/loopback-next/issues)
- [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
- [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)