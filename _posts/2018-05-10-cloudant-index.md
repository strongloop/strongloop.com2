---
layout: post
title: Index Support for Cloudant model
date: 2018-05-10T00:00:13+00:00
author: Janny Hou
permalink: /strongblog/cloudant-index/
categories:
  - Community
  - LoopBack
---

Cloudant connector hit its 2.x major release with several improvements. The most significant change is the support of LoopBack model indexes.

loopback-connector-cloudant@1.x doesn't allow creating index for model properties. Without indexes, the Cloudant query engine used index `all_fields` for every model call with a filter to serve ad-hoc queries, which under the hood treated all properties as indexable and resulted in a slower response time when called with a large data set.

To optimize the query performance, we implemented a feature so that in the model definition file, people can mark indexable properties, or specify multiple properties in a composed index. The connector will then create proper indexes based on the model definition.

The indexes are created when you migrate or update your model by calling `automigrate` or `autoupdate`. Function `autoupdate` only compares your new indexes with the ones existing in database, and update the changed ones. While `automigrate` cleans up the existing model instances first, then executes `autoupdate`. Therefore be careful when you call `automigrate`. See details in documentation [automigrate vs autoupdate](https://github.com/strongloop/loopback-connector-cloudant#migration)

## Define your index

You may need to know the frequently made queries of your model, and have a basic understanding of the index system in Cloudant database to decide which properties are indexable and what indexes to create. The connector doesn't inject an index in a query if you don't specify it. And the Cloudant database has an algorithm that automatically fetches the proper index when a query doesn't have one. 

Here is how it choses the index:
> _find chooses which index to use for responding to a query, unless you specify an index at query time.
If there are two or more json type indexes on the same fields, the index with the smallest number of fields in the index is preferred. If there are still two or more candidate indexes, the index with the first alphabetical name is chosen.

For example, given two indexes available in the database:

```js
index1: {
  fields: ['name', 'city']
},
index2: {
  fields: ['name', 'city', 'category']
}
```

When queried with property `name` and `city` like `MyModel.find({where: {name: 'foo', city: 'bar'}})`, the auto picked index is `index1` since it's "the index with the smallest number of fields".

You can define your model indexes in two ways:

- Mark a single property as indexable
- Create composed index with multiple fields

### Index for a single property

You can set `index: true` in a property's configuration to mark it as indexable. And the created index only contains one field.

For example in a model `Pet`, mark the property `category` as indexable:

```js
// in file /commons/models/Pet.json 
{
  "name": "Pet",
  "base": "PersistedModel",
  "properties": {
    "name": {
      "type": "string"
    },
    "category": {
      "type": "string",
      "index": true
    }
  },
  ...
}
```

The created index will be used when you do a query with `category` filter:

```js
Pet.find(
  where: {
    category: 'dog'
  }
})
```

### Composed index for multiple properties

Or you can define a composed index with multiple fields by adding an entry in a model definition's `indexes` property. The syntax of a index definition is

```js
index_name: {
  keys: {
    field1: direction,
    field2: direction,
    ...
  }
}
```
You can find the details of the syntax in [loopback indexes](https://loopback.io/doc/en/lb3/Model-definition-JSON-file.html#indexes)

Here is an example of defining an index containing fields `name` and `category` in model `Pet`:

```js
// in file /commons/models/Pet.json 
{
  "name": "Pet",
  "base": "PersistedModel",
  "properties": {
    "name": {
      "type": "string"
    },
    "category": {
      "type": "string"
    }
  },
  "indexes": {
    "pet_name_and_category": {
      "keys": {
        // The direction code `-1` means DESC and `1` means ASC. 
        "name": -1,
        "category": -1
      },
    },
  },
  ...
}
```

Please note Cloudant doesn't allow a mixed direction for multiple fields in one index, given the example above, both properties are in DESC order. If people specify different directions in an index, we coerce them to be the same as the one for first key property.

For example:

```js
"indexes": {
  "pet_name_and_category": {
    "keys": {
      "name": 1,
      "category": -1
    },
  },
},
```

The created index will be in ASC since the direction code for property `name` is 1.

## Customize the model name property

When looking at the created index in the database, you may probably notice that every index has an extra field besides the ones you specified in the `model.json` file. It's because to organize unstructured data into collections, all the data contains a property that specifies the loopback model name. By default the property is called `loopback__model__name`, you can customize it in `model.json` file:

```js
{
  "name": "User",
  "base": "PersistedModel",
  ...
  "cloudant": {
    "modelIndex": "your_customized_lb_model_name",
    "database": "test"
  },
  ...
}
```

## Ad-hoc query

We suggest users create proper indexes for those properties frequently queried with, while sometimes you may still do ad-hoc queries with properties that are not included in any indexes. In this case, Cloudant automatically uses `all_fields` index to return the result.

## Call for Action

LoopBack’s future success counts on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

* [Report bugs or feature requests](https://github.com/strongloop/loopback-next/issues)
* [Contribute code/documentation](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md)
* [Join the team](https://github.com/strongloop/loopback-next/issues/110)

[dp1]: https://strongloop.com/strongblog/loopback-4-developer-preview-release
[logo]: https://strongloop.com/strongblog/thanks-loopback-4-logo/
[boot-git]: https://github.com/strongloop/loopback-next/tree/master/packages/boot
[boot-blog]: https://strongloop.com/strongblog/introducing-boot-for-loopback-4
[oas]: https://github.com/OAI/OpenAPI-Specification
[swagger-to-oas3]: https://strongloop.com/strongblog/upgrade-from-swagger-to-openapi-3/
[controller-blog]: https://strongloop.com/strongblog/generate-controllers-loopback-4-cli/
[cli-doc]: http://loopback.io/doc/en/lb4/Command-line-interface.html
[todo]: http://loopback.io/doc/en/lb4/todo-tutorial.html
[metadata]: https://github.com/strongloop/loopback-next/blob/master/packages/metadata
[di-blog]: https://strongloop.com/strongblog/loopback-4-track-down-dependency-injections/
[node6-blog]: https://strongloop.com/strongblog/loopback-4-dropping-node6
[docs-blog]: https://strongloop.com/strongblog/march-2018-milestone/
[0.x.y]: https://github.com/strongloop/loopback-next/issues/954
[json-schema-blog]: https://strongloop.com/strongblog/loopback-4-json-schema-generation
[plan]: https://github.com/strongloop/loopback-next/wiki/Upcoming-Releases

## Reference

- [Create index in loopback model](https://loopback.io/doc/en/lb3/Model-definition-JSON-file.html#indexes)
- [Cloudant query](https://console.bluemix.net/docs/services/Cloudant/api/cloudant_query.html#query)
- [automigrate vs autoupdate](https://github.com/strongloop/loopback-connector-cloudant#migration)