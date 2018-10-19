---
title: The OASGraph Journey
date: 2018-11-11
author:
  - Alan Cha
  - Jim A. Laredo
  - Erik Wittern
permalink: /strongblog/the-oasgraph-journey/
categories:
  - Community
  - OpenAPI Spec
  - GraphQL
---

[OASGraph](http://v4.loopback.io/oasgraph.html) ([_git_](https://github.com/strongloop/oasgraph), [_npm_](https://www.npmjs.com/package/oasgraph)) began as a simple idea. In response to the quickly growing popularity of [GraphQL](https://graphql.org/), we wondered: "How can we make GraphQL more accessible?" Now, that dream is a reality with the release of OASGraph, a tool that can wrap RESTful APIs defined with [Open API Specification (OAS)](https://github.com/OAI/OpenAPI-Specification) with GraphQL.

Perhaps you are an API provider who wants to dive into GraphQL without the overhead needed to develop a GraphQL interface from scratch. This tool is for people like you, and we wanted to make the process of creating a GraphQL API as easy as possible. To do so, we start with a preexisting RESTful API and its OAS. With OASGraph, we can get you started instantly. For each operation in the OAS, OASGraph will create a GraphQL object which will resolve on the original REST API. If the OAS contains [link objects](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#link-object), OASGraph will create additional fields that will enable the powerful nested queries that make GraphQL famous. Along with these features, OASGraph automatically sanitizes the API, provides outlets for authentication and OAuth, and supports custom request options.

We decided to work with LoopBack to help us open source OASGraph. [LoopBack](http://v4.loopback.io/), an easy-to-use CLI-based API-creation tool with OAS support, seemed like a match made in heaven. With this partnership, LoopBack users can seamlessly produce GraphQL interfaces for their APIs. However, please keep in mind that OASGraph is not limited to LoopBack APIs. OASGraph can create a GraphQL interface for any RESTful APIs with a valid OAS. To get the best results, add link objects in the OAS so OASGraph can identify relationships between different objects and support nested queries.

Please visit our [Github repository](https://github.com/strongloop/oasgraph) where you can find multiple tutorials ([quickstart guide](https://github.com/strongloop/oasgraph/blob/master/docs/tutorials/quickstart.md), [library tutorial](https://github.com/strongloop/oasgraph/blob/master/docs/tutorials/watson.md), [LoopBack tutorial](https://github.com/strongloop/oasgraph/blob/master/docs/tutorials/loopback_tutorial.md)) to get started. 

However, if you want to get started right away, just clone the repository, create and run the CLI tool, and go to http://localhost:3001/graphql, where you will find a server hosting your GraphQL interface. It's as easy as pie!

```
# Clone the repository
$ git clone git@github.com:strongloop/oasgraph.git

# Create the CLI tool
$ cd oasgraph
$ npm link

# Create a GraphQL server
$ oasgraph <OAS path file>
```

If you like what you see, incorporate the library function `createGraphQlSchema(oas)` directly into your projects. And now that we're open source, feel free to help us improve OASGraph!

## What's Next?

- Use [LoopBack 4](http://v4.loopback.io/) to build amazing APIs.
- Cast your vote for [LoopBack 4 extensions](https://github.com/strongloop/loopback-next/issues/512)
