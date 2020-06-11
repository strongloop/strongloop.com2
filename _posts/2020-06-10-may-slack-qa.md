---
layout: post
title: Community Q&A Monthly Digest - May 2020
date: 2020-06-11
author:
  - Diana Lau
permalink: /strongblog/2020-may-slack-qa/
categories:
  - LoopBack
  - Community
published: true
---

Since we made the [LoopBack Slack community](https://loopbackio.slack.com/) available, we are happy to see more and more users are joining. Let's see some of the questions and answers that we've highlighted below.

<!--more-->

--- 
**Question**: In the [Model documentation page](https://loopback.io/doc/en/lb4/Model.html#using-the-juggler-bridge), it says "To define a model for use with the juggler bridge, extend your classes from Entity". What's the juggler bridge?

**Answer**: the Juggler bridge is used to bridge the gap between `@loopback/repository` and `loopback-datasource-juggler`. The former is used by LoopBack 4 to help define Models, Repositories, etc. It also allows for cross-datasource relations, etc. as they are enforced at the application level instead of the database.

The latter is the ORM/ODM that builds the queries and interacts with the database. It's from LoopBack 3 and is probably the only major component that didn't get revamped to keep backwards-compatibility.

Hence, the Juggler bridge helps bridge the gaps between these Node.js packages.

`Entity` is, at it's core, a model that has an ID property. Looking at the source code for `Entity`, there's quite a bit of boilerplate code added.

---

**Question:** Is there a way to change the application port to string ? I am trying to deploy the application under Azure web app where the port is a string.

**Answer**: Use `port: +(process.env.BILLING_PORT || 3000),`. The `+` converts a string to number. For the pipe, you should use `path` property instead of `port`. See [https://github.com/strongloop/loopback-next/blob/master/packages/http-server/src/__tests__/integration/http-server.integration.ts#L272](https://github.com/strongloop/loopback-next/blob/master/packages/http-server/src/__tests__/integration/http-server.integration.ts#L272).

---

**Question:** I have a model with a field which is defined as “number”. Working with Postgres. How should I define it to have the field as a double and not an integer ?

**Answer:** You can specify the dataType field to define a certain type of that column. For type Double, for example,
```ts
@model()
export class Item extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
  })
  id?: number;
  @property({
    type: 'number',
    postgresql: {
      dataType: 'double precision',
    },
  })
  price?: number;
....
```
Then run npm run build, npm run migrate, the table should have columns:
```
price       |                | double precision
```

Besides the data type, LB4 also allows you to describe tables via the model definition and/or property definition. See [Data Mapping Properties](https://loopback.io/doc/en/lb4/Model.html#data-mapping-properties) for information.

---
**Question:** Is there client sdk for lb4 for api code generation? I tried with swagger codegen, but the generated code seems doesn't work.

**Answer:** You should try `lb4 openapi --client`. It generates strongly-typed LoopBack service proxies over openapi spec using TypeScript. We use it to generate SDKs in TS.

---

## Interested to Join our Slack Workspace?
Simply click [this invitation link](https://join.slack.com/t/loopbackio/shared_invite/zt-8lbow73r-SKAKz61Vdao~_rGf91pcsw) to join. You can also find more channel details here: https://github.com/strongloop/loopback-next/issues/5048.