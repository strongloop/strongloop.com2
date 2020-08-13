---
layout: post
title: Community Q&A Monthly Digest - July 2020
date: 2020-08-13
author: Diana Lau
permalink: /strongblog/2020-jul-slack-qa/
categories:
  - LoopBack
  - Community
published: true
---

Welcome to the July edition of the "Community Q&A Monthly Digest", curating some of the Q&A that we think it might be helpful to you. Let's take a look.

<!--more-->

--- 
**Question**: Is there a built-in support in LB4 for database retries if the db responds with 429 for example? Or is it possible to overwrite a single method to implement this for all db operations similiar to how entityToData can be overwriten if data should be added to all create/update operations.

**Answer**: It's better to intercept execution errors inside the datasource, not at repository level. I created a small example to demonstrate the approach. In a real app, I would extract the code into a mixin that can be applied on any DataSource class.
https://gist.github.com/bajtos/2379d7c6df31e477aaa3a3f6ea87886c

--- 

**Question**: Is it possible to connect my API to a webhook, so that when an event is triggered, it notifies my API? What documentation could I read about doing this?

**Answer**: A webhook is just another HTTP request. Depending on the architecture of the lb4 app, this request can be done in a Service, an Interceptor, or a Controller, using either the built-in Node.js API or third-party HTTP request modules such as Axios.
Besides that, no special configuration is needed for web hooks. 

---

**Question**: How to implement `findOrCreate` instead `await exists` + `await create`?

**Answer**: You can extend `DefaultCrudRepository` with `findOrCreate` ’s implementation.
Then your repositories extend the custom one. Similar to how `AccountRepository` extends `MyDefaultCrudRepository` in the tutorial [https://loopback.io/doc/en/lb4/Repositories.html#define-repositories](https://loopback.io/doc/en/lb4/Repositories.html#define-repositories).

---

**Question**: I started using Loopback 4. How to redirect home screen of LB4 to angular 8 running on some other port?

**Answer**: It should be possible to replace the `.static` function in the app class with `.redirect`: [https://loopback.io/doc/en/lb4/apidocs.rest.restapplication.redirect.html](https://loopback.io/doc/en/lb4/apidocs.rest.restapplication.redirect.html).

---

**Question**: The compiler throws the error `error TS2322: Type 'string' is not assignable to type PredicateComparison<..>` when I tried some repository CRUD methods. Is it a bug or anything wrong with my setup?

**Answer**: It is a type issue. For [repository CRUD methods](https://loopback.io/doc/en/lb4/apidocs.repository.defaultcrudrepository.html#methods), they may take in `Filter` or `Where` type parameters. For those cases, you will need to specify the type of it, for example:

```ts
const userCount = await this.userRepository.count({tags: 'admin'} as Where<User>);
const vipUser = await this.userRepository.find({where:{tags: 'vip'}} as Filter<User>);
```

---

**Question**: We have a project which includes multi-tenancy based multi-database pattern (We have Common DB which stores Client Informations (Users, DB configs etc), and each clients has own database). How can I perform switching datasource dynamically with the multi-tenancy based project?

**Answer**: You can check out [the multi-tenancy example](https://github.com/strongloop/loopback-next/tree/master/examples/multi-tenancy) and [the GH issue](https://github.com/strongloop/loopback-next/issues/5056) that discusses about multi-tenancy and dynamic schema selection. You can create datasources at runtime. Meanwhile, if the number of dbs is limited, you can define them upfront and reuse them, see [Creating a datasource at runtime](https://loopback.io/doc/en/lb4/DataSources.html#creating-a-datasource-at-runtime). Then the tenant strategy can inject a repository talking to your common DB to load configs per logged in user.

---

## Interested to Join our Slack Workspace?
Simply click [this invitation link](https://join.slack.com/t/loopbackio/shared_invite/zt-8lbow73r-SKAKz61Vdao~_rGf91pcsw) to join. You can also find more channel details here: [https://github.com/strongloop/loopback-next/issues/5048](https://github.com/strongloop/loopback-next/issues/5048).
