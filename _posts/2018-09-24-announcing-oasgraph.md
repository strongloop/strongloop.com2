---
title: Announcing OASGraph - a GraphQL Wrapper for REST APIs
date: 2018-09-24
author:
  - Alan Cha
  - Jim A. Laredo
  - Erik Wittern
permalink: /strongblog/announcing-oasgraph/
categories:
  - OpenAPI Spec
  - GraphQL
  - OASGraph
---

IBM Research and the LoopBack team are happy to announce the release of _OASGraph_ ([_git_](https://github.com/strongloop/oasgraph),[_npm library_](https://www.npmjs.com/package/oasgraph), [_npm CLI_](https://www.npmjs.com/package/oasgraph-cli)) to the Open Source community. OASGraph is a software package that is written in TypeScript. It creates a fully functional GraphQL wrapper for existing REST(-like) APIs, described by an [Open API Specification (OAS)](https://github.com/OAI/OpenAPI-Specification) or [Swagger](https://swagger.io/).

<!--more-->

Interest in GraphQL has skyrocketed in the last few years. Just in the last year alone, the number of downloads from npm of the core GraphQL library, [GraphQL.js](https://www.npmjs.com/package/graphql), has gone up more than 300% to more than 700,000 times per week.  

At IBM, we have been supporting our customers' journeys into the API Economy through offerings like [API Connect](https://www.ibm.com/cloud/api-connect) and frameworks like [LoopBack](https://loopback.io/). One challenge of doing so is keeping abreast of new API designs that help our community members as well as their clients to build better, more efficient applications. We see GraphQL as one such tool, as it provides a more data-centric approach to building APIs with a great developer experience, facilitating for example the retrieval of multiple interrelated resources in a single "query".

At the same time, many enterprises and the community at large have invested in REST APIs and have a portfolio of APIs, which manage and provide access to many resources stored in variety of services, old and new alike. We believe that REST APIs will continue to coexist with GraphQL APIs, and in many cases act as backend to new GraphQL APIs. To that effect we created OASGraph. With only a REST API Specification, be it in OAS or Swagger format, a GraphQL schema is automatically derived. It maintains a mapping to the REST API request and response models, and creates "resolvers" that know how to assemble and invoke the actual REST APIs and later populate the GraphQL responses.

Although other libraries to wrap REST APIs with GraphQL exist, we are confident that we have advanced the field: OASGraph supports various authentication mechanisms, sanitizes and de-sanitizes data to fulfill GraphQL requirements, and can create deeply nested GraphQL interfaces relying on [links](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#linkObject) as defined in the latest OpenAPI Specification 3. OASGraph is able to perform successfully against every well formed OAS we have tried, as long as the enumeration types don't use GraphQL reserved words. Using the [API Gurus directory](https://apis.guru/openapi-directory), working with a body of 959 APIs, we found 260 well formed OAS which were all successfully processed. OASGraph can also wrap an additional 670 APIs by disregarding those endpoints that were not fully defined in the OAS, as they were missing response fields, had multiple responses, or invalid schema types. In these cases, where the created GraphQL wrapper cannot be 100% complete, OASGraph creates a "report", informing developers on performed workarounds and made assumptions. For the remaining few APIs, whose OAS is either ill-formatted, missing a reference document, or had hard conflicts with the GraphQL reserved words, OASGraph once again informs the developer, allowing him/her to address those issues by revising the OAS.

We are excited to release this technology to Open Source and look forward to hearing about its use. We welcome the reporting of any issues and contributions to the code base, of course. To learn more, follow a tutorial, or see a video demonstration of OASGraph visit us at [http://v4.loopback.io/oasgraph.html](http://v4.loopback.io/oasgraph.html).

## What's Next?

- Check out key technologies for Open Source API development on our [homepage](https://strongloop.com/projects/).
