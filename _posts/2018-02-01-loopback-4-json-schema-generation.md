---
title: Automatically generating JSON Schema for your LoopBack4 models
date: 2018-2-1T01:00:13+00:00
author: Kyu Shim
permalink: /strongblog/loopback-4-json-schema-generation
categories:
  - Community
  - LoopBack
---

More and more features are being completed as the release of [LoopBack 4.0 MVP](https://github.com/strongloop/loopback-next) draws closer. One exiciting new feature I've worked on is the readily available generation of JSON Schema for your LoopBack4 models.

## Models and metadata in LoopBack4

Currently with LoopBack4, the concept of models are borrowed from LoopBack3 where models are used to represent data in backend systems.
In order to define these models for the legacy juggler with just TypeScript classes, `@model` and `@property` decorators from `@loopback/repository` package are used.
With TypeScript's experimental feature on decorators, we're able to infer property types of a class at compile-time and store them as metadata.
This metadata is accessed at run-time and a working model definition is automatically built from the metadata and stored as a property under the class constructor to be readily accessed.

With the property type metadata availble to us through these decorators, we've created `@loopback/repository-json-schema` module to use that same metadata as a base to build a JSON Schema representation of the model.

## Using `@loopback/repository-json-schema`

Install the module in your LoopBack4 project:
```
npm i --save @loopback/repository-json-schema
```

Install `@loopback/repository` (if you haven't done already):
```
npm i --save @loopback/repository
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

Next, use `getJsonSchema` function from `@loopback/repository-json-schema` to build and get your model's JSON Schema:
```ts
import {MyModel} from '../models/my-model.model.ts';
import {getJsonSchema} from '@loopback/repository-json-schema';

export const myModelJson = getJsonSchema(MyModel);
```

And there you have it! A JSON Schema of your model you can use for anything your heart desires!

For more information on model decorating specifics to get the correct JSON Schema, visit (http://loopback.io/doc/en/lb4/Schemas.html).

## Integration with `@loopback/rest`

This feature has also been integrated into our `@loopback/rest` package to be able to automatically provide a full OpenAPI schema (after conversion from JSON Schema) for the decorated models that's been used in the registered controllers.

## Top-level metadata and limitations

As of moment at the time the blog is written, TypeScript's pseudo-reflection system only emits primitive and custom type information, meaning information like union types and optional properties is lost after compilation.
In order to preserve this lost information, it has to be explicitly passed into the decorator to be preserved.

This is why decorators like `@property.array` exist; the decorator takes in the type populating the array it's decorating since that type information would be lost after its compilation into JavaScript's definition of array.

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



