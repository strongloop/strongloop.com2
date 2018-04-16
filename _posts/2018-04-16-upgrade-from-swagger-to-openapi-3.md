---
layout: post
title: Upgrade from Swagger to OpenAPI 3.0.0
date: 2018-04-16T00:00:13+00:00
author: Janny Hou
permalink: /strongblog/upgrade-from-swagger-to-openapi-3/
categories:
  - Community
  - LoopBack
---

The [Swagger/OpenAPI specification](https://swagger.io/specification/) has become the de facto standard of defining and describing machine-readable RESTful APIs over the past few years and announced its major release of version 3.0.0 in 2017.
The new version also changes the official name from "Swagger" to "OpenAPI". As a framework for building microservices, LoopBack keeps improving its user experience of creating RESTful APIs and always upgrades the tooling to stay with the latest industry standards. Given the community feedback we have received in the last few months, we decided to adopt the OpenAPI 3.0.0 specification to describe the exposed RESTful APIs of a LoopBack application. LoopBack 4 users can now build their OpenAPI 3.0.0 endpoints with upgraded packages.

<!--more-->

## LoopBack Artifacts and OpenAPI Specifications

Before introducing the upgrade, here is some background information of how we use OpenAPI in LoopBack 4.

Leveraging TypeScript decorators, we generate a complete OpenAPI specification Object from the metadata of various artifacts like "Model", "Controller", "Rest Server", etc. The following diagram shows the concept mapping between the OpenAPI specifications(green) and the LoopBack artifacts(blue). Each artifact's corresponding packages are also specified in the rectangle.

<img src="https://strongloop.com/blog-assets/2018/03/map-lb-artifacts-to-oai-spec.png" alt="Map LoopBack Artifacts to OpenAPI Specifications" style="width: 800px"/>

## Preparation for the Upgrade

Package [`@loopback/rest`](https://github.com/strongloop/loopback-next/tree/master/packages/rest) uses OpenAPI path specification as its routing reference, and contains the decorators that generate path specification from controller method metadata. To reduce the number of changes to the `rest` package, and to decouple the OpenAPI specification version from the rest package, we moved the controller decorators into a separate package: `openapi-v2`, after updating to OpenAPI 3.0.0, named as `openapi-v3`. This new module uses the metadata from LoopBack artifacts like models and controllers in an application to generate the OpenAPI v3 specification used to describe the API.

The `openapi-v3` package exports the following decorators for use within your controllers:

* operation decorators for method. e.g. `@operation`, `@get`
* argument decorators for method argument. e.g. `@param`, `@requestBody`
* class level decorator: `@api`

For ease of use and convenience, these decorators are re-exported in `@loopback/rest`, so users can import them from either package.

## New Packages

In favor of the new OpenAPI 3.0.0 specification, two Swagger 2.0 packages have been replaced:

- `openapi-v2` is replaced by `openapi-v3`
- `openapi-spec` is replace by `openapi-v3-types`

Now, you can import new decorators from `openapi-v3` or `rest` package:

```ts
import {post, param, requestBody} from 'rest';
// or import {post, param, requestBody} from 'openapi-v3';
import {User} from '../models/user.model.ts';

class MyController {
  @post('/Users/{id}')
  async create(
    @param.path.string('id') id: string,
    @requestBody() user: User
  ) {
    // code to create a new user
  }
}
```

You can also import types/interfaces from `openapi-v3-types` to define OpenAPI 3.0.0 specification objects.

For example:

```ts
import {SchemaObject} from 'openapi-v3-types';

const PetSchema:SchemaObject = {
  type: object,
  properties: {
    catagory: {type: string},
    store: {type: string}
  }
}
```

## Breaking Changes

OpenAPI 3.0.0 describes the client request and server response in a more versatile way. It organizes modular and reusable resources by components. This introduces breaking changes for LoopBack parameter/requestBody decorators and require users to adjust the way they organize resources when building APIs with existing specification fragments.

Next let's go through the breaking changes and corresponding migration details in our new release made for OpenAPI upgrade.

*It's not necessary for LoopBack 4 users to know the format of the OpenAPI specification.*
*However, if you are interested in learning more about the OpenAPI specification, here's [an awesome article](https://blog.readme.io/an-example-filled-guide-to-swagger-3-2/) that shows the difference between the 2.0 and 3.0 versions of OpenAPI.*

### Controller Argument Decorators

#### Adds New Decorator `@requestBody`

OpenAPI 3.0.0 changed the way you specify body objects for endpoints in your API, moving the `body` field from the `parameters` collection into its own section called `requestBody`. Additionally, `formData` is also a part of the `requestBody` section.

[The article in reference](https://blog.readme.io/an-example-filled-guide-to-swagger-3-2/) has a section "Request Format" that illustrates the difference above. 

A path specification may only have **one** request body. This means that you cannot use the `@requestBody` decorator more than once for a given function in a controller.

```ts
// NOT ALLOWED: Invalid Usage
async createUsers(@requestBody() user: User, @requestBody() anotherUser: User) {
  // snip
}
```

This change breaks the functionality of `@param` in `openapi-v2` and we introduce a new decorator `@requestBody` to reflect the new request structure.

In `openapi-v3`, `@requestBody` replaces the old swagger decorators `@param.body` and `@param.formData`. For example:

```ts
// Using openapi-v2 decorator
class MyController {
  @post('/Foo')
  async foo(@param.body('foo', FooSchema) foo: Foo) {}
}
```

should be changed to:

```ts
// Using openapi-v3 decorator
class MyController {
  @post('/Foo')
  async foo(@requestBody() foo: Foo) {}
}
```

To simplify the usage of `@requestBody`, we expect any parameters being decorated will be classes that have been decorated with the `@model` and `@property` decorators. 

The metadata generated by `@model` and `@property` is used by `@requestBody` to generate the OpenAPI schema definition for the class and set the default content type.

Please read the [decorator documentation](http://loopback.io/doc/en/lb4/Decorators.html#requestbody-decorator) to know more about applying `@requestBody` to an argument. It illustrates the basic usage and different ways to customize the generated specification.

#### Deprecates Method Level `@param`

We are also deprecating the `@param` decorator **at the method level** to avoid issues with determining the correct order in which to inject arguments into the method call at request time. The `@param` decorator must now be used at parameter level.

```ts
// openapi-v2
class MyController {
  @get('/Foo')
  @param.query.string('id')
  async foo(id: string) {}
}
```

should be replaced by:

```ts
// openapi-v3
class MyController {
  @get('/Foo')
  async foo(@param.query.string('id')id: string) {}
}
```

#### More Shortcuts for `@param`

Unlike Swagger 2.0, which uses `{type: '<a_primitive_type>'}` to describe primitive types and `{schema: ...schemaSpecs}` for complicated types, OpenAPI 3.0.0 uses `{schema: ...schemaSpecs}` to describe all of the types.

According to the [mapping between primitive data type common name and `schema`](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#dataTypes), more `@param` shortcuts are created.

For instance, to get a `string` type parameter from query, you can decorate the controller argument as:

```ts
async findByName(@param.query.string('name')name: string) {
  // call method to find instances by name
}
```

You can find a list of the shortcuts in [API documentation](http://apidocs.loopback.io/@loopback%2fopenapi-v3/)

### Builds Api with Existing Specification

When creating the API by providing an existing path/parameter/requestBody specification to a controller decorator, make sure it follows the OpenAPI 3.0.0 standard.

#### Response Specification

In OpenAPI 3.0.0 the response specification supports multiple content types:

```ts
// v2 response object
{
  '200': {
    description: 'a response',
    schema: {...schemaSpec}
  }
}
```

should be updated to

```ts
// v3 response object
{
  '200': {
    content: {
      '*/*': {
        description: 'a response',
        schema: {...schemaSpec}
      }
    }
  }
}
```

#### Schema Specification

We recommend people use `@model` and `@property` to describe a LoopBack model, and leverage function `jsonToSchemaObject` to generate corresponding OpenAPI schema. You can find how it works in blog [Automatically Generate JSON Schema for your LoopBack 4 Models](https://strongloop.com/strongblog/loopback-4-json-schema-generation/) But in case user provides the specification, `definitions` in Swagger 2.0 are organized under `components.schemas` in OpenAPI 3.0.0.

So please upgrade them from:

```ts
// v2 swagger spec
{
  definitions: {
    Pet: {...PetSpec}
  }
}
```

to:

```ts
// v3 swagger spec
{
  components: {
    schemas: {
      Pet: {...PetSpec}
    }
  }
}
```

#### Parameter and RequestBody Specification

If you write your own parameter/requestBody specification, please see reference [parameter object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#parameterObject) and [requestBody object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#requestBodyObject)

### Other Breaking Changes

* `validateApispec` exported by `testlab` now validates OpenAPI 3.0.0 specification.
* Get the generated OpenAPI 3.0.0 specification for your app by visiting:

http://localhost:3000/openapi.json
or the YAML flavor:
http://localhost:3000/openapi.yaml

## Improvements in the Future

- [Create more shortcuts for `@requestBody`](https://github.com/strongloop/loopback-next/issues/1064)
- [Generate response specification from controller metadata](https://github.com/strongloop/loopback-next/issues/1086)
- [Support parameter location `cookie`](https://github.com/strongloop/loopback-next/issues/997)
- [Support app level `basePath`](https://github.com/strongloop/loopback-next/issues/914)

## Additional Resources

* Compare Swagger 2.0 and OpenAPI 3.0.0:
https://blog.readme.io/an-example-filled-guide-to-swagger-3-2/

* Discussion regarding deprecating method level `@param`:
https://github.com/strongloop/loopback-next/pull/940

* OpenAPI 3 specifications official documentation:
https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md

## Call for Action

LoopBack's future success counts on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

* [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
* [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
* [Reporting issues](https://github.com/strongloop/loopback-next/issues)
* [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
* [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)
