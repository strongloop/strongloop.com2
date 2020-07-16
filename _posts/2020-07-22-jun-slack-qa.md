---
layout: post
title: Community Q&A Monthly Digest - Jun 2020
date: 2020-07-16
author:
  - Diana Lau
permalink: /strongblog/2020-Jun-slack-qa/
categories:
  - LoopBack
  - Community
published: true
---

Welcome back to the "Community Q&A Monthly Digest", in which we highlight some of the questions and answers in [our LoopBack Slack community](https://join.slack.com/t/loopbackio/shared_invite/zt-8lbow73r-SKAKz61Vdao~_rGf91pcsw) here.

<!--more-->

**Question:** Has anyone implemented Casbin on a brand new project? or is there a good tutorial for lb4? I need to have some rbac / roles system in an app.. or what would you suggest to achieve that?

**Answer:** We have an access control example uses casbin, see the [access-control-migration example](https://github.com/strongloop/loopback-next/tree/master/examples/access-control-migration) and [its tutorial](https://loopback.io/doc/en/lb4/migration-auth-access-control-example.html). The logic on casbin side is only a prototype, the example mainly shows the integration between casbin and LoopBack authorization system.

---

**Question:** I am new to LoopBack and so far I really like what it has to offer. I was wondering if anyone knows of a good online course to learn LoopBack. I have worked through the basic tutorials found in the documentation, but I find it easier to listen and follow along to videos. 

**Answer:** Recently one of our community member posts a [YouTube tutorial for LoopBack 4 beginners](https://www.youtube.com/watch?v=cgBCRY169qg). There is another series of educational videos on [a LoopBack introduction](https://www.youtube.com/watch?v=pDGWb-q65qM) and [installation](https://www.youtube.com/watch?v=1U9ZCDlBtjc). 

From our side, there are a few recent videos on our [StrongLoop YouTube channel](https://www.youtube.com/channel/UCR8LLOxVNwSEWLMqoZzQNXw/videos) and we're trying to add more. Hope it helps.

---

**Question:** I am trying to disable the openapi.json from showing in my loopback 4 application and its not working. I was able to disable the explorer. Any ideas?

**Answer:** You can use `openApiSpec: {disabled: true}` in `index.ts`. i.e. 

```ts
const config = {
    rest: {
      //..
      openApiSpec: {
        disabled: true
        //..
      },
    },
  };
```
---

**Question:** Does Loopback 4 support extracting cookies from the header? Currently I had to integrate Express server to achieve this. 

**Answer:** You can use express middleware like [http://expressjs.com/en/resources/middleware/cookie-parser.html](http://expressjs.com/en/resources/middleware/cookie-parser.html) see how to use middleware in [https://loopback.io/doc/en/lb4/Express-middleware.html](https://loopback.io/doc/en/lb4/Express-middleware.html).

---

**Question:** Is there a quick way to generate timestamp? Like at the model level `generated:true`?

**Answer:** I recommend to use defaultFn set to one of the following string values:
- "guid": generate a new globally unique identifier (GUID) using the computer MAC address and current time (UUID version 1).
- "uuid": generate a new universally unique identifier (UUID) using the computer MAC address and current time (UUID version 1).
- "uuidv4": generate a new universally unique identifier using the UUID version 4 algorithm.
- "now": use the current date and time as returned by new Date()

See also [https://github.com/strongloop/loopback/issues/292](https://github.com/strongloop/loopback/issues/292) and [https://loopback.io/doc/en/lb4/Model.html#property-decorator](https://loopback.io/doc/en/lb4/Model.html#property-decorator).

It would be great to capture these options in our TypeScript definitions, see [https://github.com/strongloop/loopback-next/blob/ae6427322451c914ae54f44dbb656981e7fbbb81/packages/repository/src/model.ts#L34-L42](https://github.com/strongloop/loopback-next/blob/ae6427322451c914ae54f44dbb656981e7fbbb81/packages/repository/src/model.ts#L34-L42).

---

**Question:** Can I use MongoDB update operators in LoopBack apps? How can I enable it?

**Answer:** Yes, except comparison and logical operators, the mongo connector also supports MongoDB update operators such as `max`, `rename`, etc. You will need to set the flag `allowExtendedOperators` to `true` in the datasource configuration. You can find details and examples at [MongoDB connector - update operators](https://loopback.io/doc/en/lb4/MongoDB-connector.html#update-operators).

---


## Interested to Join our Slack Workspace?
Simply click [this invitation link](https://join.slack.com/t/loopbackio/shared_invite/zt-8lbow73r-SKAKz61Vdao~_rGf91pcsw) to join. You can also find more channel details here: [https://github.com/strongloop/loopback-next/issues/5048](https://github.com/strongloop/loopback-next/issues/5048).