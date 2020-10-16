---
layout: post
title: Community Q&A Monthly Digest - Oct 2020
date: 2020-10-28
author: Diana Lau
permalink: /strongblog/2020-oct-slack-qa/
categories:
- LoopBack
- Community
published: true
---

It's been 6 months since we created the [Slack channel](https://join.slack.com/t/loopbackio/shared_invite/zt-8lbow73r-SKAKz61Vdao~_rGf91pcsw) for LoopBack community. Thanks to your support, over 500 members had joined and new members are joining almost everyday! Let's take a look at the October edition of the “Community Q&A Monthly Digest”, capturing some of the Q&A in this forum. 

<!--more-->

---

**Question:** How to get the raw request in LoopBack 4 in a function without changing the parsing for the entire app?

**Answer:** 
It's possible to get the raw request body with `x-parser`: [https://loopback.io/doc/en/lb4/Parsing-requests.html#extend-request-body-parsing](https://loopback.io/doc/en/lb4/Parsing-requests.html#extend-request-body-parsing). 
-- _Answered by @Rifa Achrinza_

--- 

**Question:** Is there any solution for tracking database migration, for example, migrations has been already run and possible rollback of migration? 

**Answer:**
I created a module which tracks migrations and executes scripts based on the db version compared to the app version, see [https://www.npmjs.com/package/loopback4-migration](https://www.npmjs.com/package/loopback4-migration). 
--_Answered by @nflaig_


Ideally, LoopBack generates the DDL for users to review, and then it’s up to the users to run it or not. It's a feature to be implemented, see [https://github.com/strongloop/loopback-next/issues/4757](https://github.com/strongloop/loopback-next/issues/4757).
--_Answered by @Diana Lau_


--- 

**Question:** I want to check whether a specified `categoryId` exists in a Mongo datasource, how can I do that? For example,

```json
{"categories" : [
    {
        "categoryId" : "e759c15e-3552-4557-aa6b-c1396674c7e6",
        "name" : "test"
    },
    {
        "categoryId" : "e759c15e-3552-4557-aa6b-c1396674c7e5",
        "name" : "test1"
    }
]}
```

I tried `await this.usersRepository.find({'categories.categoryId': 'e759c15e-3552-4557-aa6b-c1396674c7e5'});` but getting an error message below:
> { 'categories.categoryId': string; }' is not assignable to parameter of type 'Filter<Users>'. Object literal may only specify known properties, and ''categories.categoryId'' does not exist in type 'Filter<Users>'

**Answer:** 
The object you pass into `.find()` needs to be a `Filter` object. Make sure you `import { Filter } from '@loopback/repository';`, then you can: 
```ts
const existingCategoryFilter: Filter = {
  //...filter properties in here...
};
let existingCategories = await this.categoryRepository.find(existingCategoryFilter);
```
-- Answered by @Jackson Hyde

To add on what @Jackson Hyde has mentioned, due to limitations on TypeScript types, nested objects are not included in the typings. Hence, you'll also need to override TypeScript's check by adding `// @ts-ignore` just before the repository function.
-- Answered by @Rifa Achrinza

--- 

**Question:** I want to implement JWT refresh token in LoopBack 4. Can you suggest any good tutorial?

**Answer:** You can follow this [https://loopback.io/doc/en/lb4/JWT-authentication-extension.html](https://loopback.io/doc/en/lb4/JWT-authentication-extension.html). 
--_Answered by @Pratik Jaiswal_

--- 


**Question:** I used LoopBack CLI to create a "SHIPPING" model but it tries to do lowercase "Shipping" in the SQL with the quotes. An error occurred in the SQL statement because it is case sensitive with the quotes around it. How can I fix this? I'm on LoopBack 4 and using the `loopback-connector-ibmi`.

**Answer:**
Did u try to give the name in your model?
```ts
@model({name: 'member_membership'})
export class MemberMembership extends Entity {
    //...
}
```
So `member_membership` is the table in the database.
-- Answered by @Mohammed

The `name` property customizes the model name, which is default to the class name if not provided. The model name is then used as the default for table name unless you further customize it for specific databases.
-- Answered by @Raymond Feng


--- 
**Question:** I have a CORS issue with `passport-login` example when trying to establish connection with Google using Angular Frontend. I keep getting CORS error:
> Access to XMLHttpRequest at 'https://accounts.google.com/o/oauth2/v2/auth?...' (redirected from 'http://localhost:3000/api/auth/thirdparty/google') from origin 'http://localhost:4200' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource."

But the application is working fine with jade.

**Answer:**
In your login component you could do something like:
```ts
OAUTH2_LINK_GOOGLE = this.api_url+'/api/auth/thirdparty/google?redirect_uri=' + this.redir_url
  onGoogleSignIn() {
    window.location.href = this.OAUTH2_LINK_GOOGLE;
  }
```
Bind the Google link to the above in the HTML code.

-- Answered by @marg330

---


## Enriching LoopBack and its Community - You are Invited!

As mentioned in our [recent blog post](https://strongloop.com/strongblog/2020-community-contribution/), your contribution is important to make LoopBack a sustainable open source project. 

Here is what you can do:
- [Join LoopBack Slack community](https://join.slack.com/t/loopbackio/shared_invite/zt-8lbow73r-SKAKz61Vdao~_rGf91pcsw)
- [Look for first-contribution-friendly issues](https://github.com/strongloop/loopback-next/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
- Give us feedback and join our discussion in [our GitHub repo](https://github.com/strongloop/loopback-next)

Let's make LoopBack a better framework together!
