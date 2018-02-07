---
title: Automatically Generate JSON Schema for your LoopBack 4 Models
date: 2018-2-7T01:00:13+00:00
author: Kyu Shim
permalink: /strongblog/loopback-4-json-schema-generation/
categories:
  - Community
  - LoopBack
---

I've recently been working on an exciting new feature for LoopBack4 which would allow for the readily available generation of JSON Schema for your LoopBack4 models. I'll dive right into it.

## Models and metadata in LoopBack 4

Currently with LoopBack 4, a model is a way to represent data, such as `Customer`and `Order`, handled by the framework and is implemented as TypeScript classes. One useful feature of TypeScript is its experimental decorators which are able to infer property types of a class at compile-time and store them as metadata. 
<!--more-->
We are putting this feature to use with `@model` and `@property` decorators from `@loopback/repository` package to make their decorated classes' metadata available. This design choice allows us to create model definitions used by LoopBack 3's legacy juggler just out of TypeScript classes.

Here is a diagram of how it all works:

<img src="https://strongloop.com/blog-assets/2018/02/retainment-of-types-through-metadata.jpg" alt="Retainment of Types through Metadata" style="width: 500px"/>

When the compiler converts TypeScript code into JavaScript, the type information in our LoopBack models is lost, meaning their type-safe representation cannot be built for purposes like validation; this is where the decorators come in. When the compiler is run with experimental decorator feature enabled, the types of the decorated properties are stored as metadata in `design:type` key in the form of class constructors (or wrappers for primitives), which are accessible through the `reflect-metadata` module. Then at run-time when the decorators are run, the "metadata" is fetched and our conversion logic converts it into a LoopBack model definition and stores it as a static property of the model itself.

Taking advantage of the property type metadata available to us through these decorators, we've created the `@loopback/repository-json-schema` module so that we can use the same metadata as a base to build a JSON Schema representation of the model.

## Implication of a JSON Schema module

A great feature LoopBack3 had was the painless conversion of LoopBack models into OpenAPI spec through [`loopback-swagger`](https://github.com/strongloop/loopback-swagger) module. Internally, this module was used by the API explorer for LoopBack 3
applications, offering what was essentially a summary of the application's working pieces.

Similarly, `@loopback/repository-json-schema` offers standardized representation of LoopBack4 models in the form of JSON Schemas. This means a LoopBack 4 model is free to be manipulated outside of the framework and is made to be compatible with a wide range of tools that use JSON Schemas as their standard.

## Using `@loopback/repository-json-schema`

Install the module in your LoopBack 4 project:
```
npm i --save @loopback/repository-json-schema @loopback/repository
```

Write your LoopBack model using `@model` and `@property` decorators:
```ts
import {model, property} from '@loopback/repository';

@model()
class MyModel {
  @property() foo: string;
  @property() bar: number;
}
```

Next, use the `getJsonSchema` function from `@loopback/repository-json-schema` to build and get your model's JSON Schema:

```ts
import {MyModel} from '../models/my-model.model.ts';
import {getJsonSchema} from '@loopback/repository-json-schema';

export const myModelJson = getJsonSchema(MyModel);
```

Here is the object `myModelJSON` is holding:
```json
{
  "title": "MyModel",
  "properties": {
    "foo": {
      "type": "string"
    },
    "bar": {
      "type": "number"
    }
  }
}
```

And there you have it! A JSON Schema of your model you can use for anything your heart desires!

For more information on model decorating specifics to get the correct JSON Schema, visit (http://loopback.io/doc/en/lb4/Schemas.html).

## Integration with `@loopback/rest`

This feature has also been integrated into our `@loopback/rest` package to be able to automatically provide a full OpenAPI schema (after conversion from JSON Schema) for the decorated models that's been used in the registered controllers. Here's how it works:

```ts
class MyController {
  @post('/path')
  create(
    @param.body('model') // type inference done here
    model: MyModel
  ) {}
}
```

When an application using our `RestServer` is run, a routing table is built for routes defined in the controllers registered with the application. As these routes get registered, the `@param` decorator infers the type definition of the parameter of the route and notices that it's a LoopBack model. A JSON Schema is then generated and cached for the model and then converted into OpenAPI spec definition. The completed schema is made available at `/openapi.json` endpoint when the application is running.

## Top-level metadata and limitations

As of moment at the time the blog is written, TypeScript's pseudo-reflection system only emits primitive and custom type information, meaning information about things like union types and optional properties are lost after compilation. In order to preserve this lost information, it has to be explicitly passed into the decorator to be preserved.

This is why decorators like `@property.array` exist; the decorator takes in the type populating the array it's decorating
since that type information would be lost after its compilation into JavaScript's definition of array.

```ts
@model()
class ArrayModel {
  @property.array(String) // explicitly passing in type information
  arr: string[]; // only infers that 'arr' is an array
}
```

There's more support coming for making it easy to add in top-level metadata to JSON schema, so please stay tuned for more updates!

## Call for action

LoopBack's future success counts on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

* [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
* [Reporting issues](https://github.com/strongloop/loopback-next/issues)
* [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
* [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)
