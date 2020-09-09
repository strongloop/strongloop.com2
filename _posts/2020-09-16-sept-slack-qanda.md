---
layout: post
title: Community Q&A Monthly Digest - Sept 2020
date: 2020-09-16
author: Diana Lau
permalink: /strongblog/2020-sept-slack-qa/
categories:
- LoopBack
- Community
published: false
---

Welcome back to the September edition of the "Community Q&A Monthly Digest", in which we are curating some of the Q&A that we think it might be helpful to you. Thank you for posting your questions and helping your fellow LoopBack users. 

The [LoopBack Slack community](https://join.slack.com/t/loopbackio/shared_invite/zt-8lbow73r-SKAKz61Vdao~_rGf91pcsw) is a platform where LoopBack users are helping each other out. If you haven't joined already, sign up today!

Let's take a look at some of the questions and answers from the community.

<!--more-->

**Question:** Is it possible to use autogenerate timestamp property in a model?

**Answer:** To set the property to the current datetime upon Model Create:
```ts
@property({
type: 'date',
defaultFn: 'now',
})
timestamp?: string;
```

---

**Question:** Does LoopBack has any build-in cache? Or should we implement that to make response even faster?

**Answer:**
We currently don’t but there are some example implementations for your reference:
- [caching interceptor](https://github.com/strongloop/loopback-next/tree/master/packages/rest/src/__tests__/acceptance/caching-interceptor)
- [caching service](https://github.com/strongloop/loopback-next/blob/master/examples/greeting-app/src/caching-service.ts)

--- 

**Question:** I want to perfoming schema migration but order of tables is important beacause there are some relation and foreign key between them. How can I set migration table order?

**Answer:** Within `migrate.ts`, `app.migrateSchema` accepts a `model` array. So it can be updated as such:
```ts
await app.migrateSchema(Object.assign(<SchemaMigrationOptions>{
models: [/* Add model names here */]
}, existingSchema));
```
Like with any auto-migration, please do take a backup of the database before running the migration.

---

**Question:** Hello everyone, I wanted to implement an API like the trasfer-files example on the docs but with more endpoints with different storage directories. how is that possible?

**Answer:** Yes, you have different endpoints backed by different methods using `post /<url>` decoration as you see at [https://github.com/strongloop/loopback-next/blob/master/examples/file-transfer/src/controllers/file-upload.controller.ts#L28](https://github.com/strongloop/loopback-next/blob/master/examples/file-transfer/src/controllers/file-upload.controller.ts#L28). If you want to calculate the file path per request, you can instantiate a new upload service instance instead of using the injected one.

---

**Questions:** I work with LoopBack in a k8 cluster, when i try to implement JWT authentication, all users get the same token, and the data in that token is not equal to that user. Is there any way to fix it besides saving the token in a database? 

**Answer:** Typically JWT tokens are generated using a combination of a secret and some sort of UUID of the user. When they successfully authenticate, a token is generated and returned, then when you need to verify the token you decode it using the secret, giving you the UUID of the user. This means that you don’t actually have to save a token at all. Here’s how we are generating tokens for our users.

```ts
const userInfoForToken = {
id: userProfile.id,
name: userProfile.name,
roles: userProfile.roles,
};
// Generate a JSON Web Token
let token: string;
try {
token = await signAsync(userInfoForToken, this.jwtSecret, {
expiresIn: Number(this.jwtExpiresIn),
});
} catch (error) {
throw new HttpErrors.Unauthorized(`Error encoding token : ${error}`);
}
```
In this context, `signAsync` is a `promisify`’d version of `jsonwebtoken.sign()`.

--- 

**Question:** I want to use the LoopBack app cli-command programmatically. Is this possible?

**Answer:**
You can try to `require('@loopback/cli/lib/cli')`. See [https://github.com/strongloop/loopback-next/blob/master/packages/cli/lib/cli.js](https://github.com/strongloop/loopback-next/blob/master/packages/cli/lib/cli.js). `cli.js` has logic to create yeoman env and register generators.

---


## Enriching LoopBack and its Community - You are Invited!

As mentioned in our [recent blog post](https://strongloop.com/strongblog/2020-community-contribution/), your contribution is important to make LoopBack a sustainable open source project. 

Here is what you can do:
- [Join LoopBack Slack community](https://join.slack.com/t/loopbackio/shared_invite/zt-8lbow73r-SKAKz61Vdao~_rGf91pcsw)
- [Look for first-contribution-friendly issues](https://github.com/strongloop/loopback-next/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
- Give us feedback and join our discussion in [our GitHub repo](https://github.com/strongloop/loopback-next)

Let's make LoopBack a better framework together!