---
layout: post
title: Community Q&A Monthly Digest - April 2020
date: 2020-04-17
author:
  - Diana Lau
permalink: /strongblog/2020-april-slack-qa/
categories:
  - LoopBack
  - Community
published: true
---

In the past, we've explored a few options on providing a forum for our users to help each other: [Google group](https://groups.google.com/forum/#!forum/loopbackjs), [Gitter](https://gitter.im/strongloop/loopback) and GitHub. We are pleased to announce that the LoopBack Slack workspace, http://loopbackio.slack.com/, is available for our users to join. Since Slack is quite commonly used, we thought it would be a good time for us to modernize our tooling for the LoopBack community helping out each other out. Also, the LoopBack core team uses Slack on a daily basis; it is helpful because it allows us to get notifications and communicate efficiently.

There have been lots of great questions and answers. We thought it would be helpful to curate some of the discussions here. Thanks again for submitting the questions and answers! 

<!--more-->

**Question: I am trying to find a working implementation for TimeStamp Mixin to have time stamp automatic fields in the database. In the older version of LoopBack, I was capable to create a BaseEntity and BaseRepository and to extend them but now it is not working anymore. If I extend in the same way the controllers are not working anymore. The current example in the docs is based on adding the mixin to the Controller which I like much less. Any suggestions? Thanks.**

**Answer:** For specifying the creation timestamp, you can use the `default` property for the `@property` decorator in your model. Something like:
```ts
  @property({
    type: 'date',
    default: () => new Date(),
  })
  createDate: string;
```
You can also use [Moment.js](https://momentjs.com/) to format the timestamp. 

Updating updatedAt field should be possible via 2 ways:
1. Via controller
    When a controller function is invoked, the current timestamp could be taken and then injected into the original request query before being passed into the repository function.
    You can also write your own base class (without the `@model` decorator) and then extend it where necessary.
2. Via datasource
    It is possible to add a new function to the datasource which can mutate the query object and then pass it on.

---
**Question: Kinda new to loopback, I want to learn more about decorators and how to custom loopback logic for more advanced usages, can you walk me through the process of creating custom decorators to create my own "hook" around a controller?**

**Answer:** A great starting point would be the [Extending LoopBack 4](https://loopback.io/doc/en/lb4/Extending-LoopBack-4.html) docs.

These concepts are the building blocks of LB4. They serve a specific purpose while following the OOP paradigm.
It may look like a lot, but these are essentially the different extension points in LoopBack 4 (hence why LB4 is extremely extensible).
Let's see if we can break it down:

**Decorators (in general)**
The decorators in LB4 are no different to the standard decorators in TypeScript. They add metadata to classes, methods. properties, or parameters. They don't actually add any functionality, only metadata.
Think of it like the file properties on your file system: It's not visible when interacting with the file normally, but those who want to access those properties will be able to via a standard interface.
There's more benefits to Decorators, but the above explanation is the watered-down gist of it.

**Sequence (in general)**
Sequences are a group of Actions. It simply indicates which actions should be used by the server to process the request.

**Sequence Actions (in general)**
Sequence Actions (or simply "Actions") are stateless, meaning that they only have the basic concept Elements.
Converting into Express.js terminology; Think of an Action as an middleware. And think of an Element as the contents that a middleware receives. They work differently, but the high-level idea is about the same.
They are unaware of other higher-level concepts such as Controllers, DataSource, Models, etc.

**Components (in general)**
When adding functionality to LB4, you'll usually need to add a combination of Providers, Booters, etc. This can tedious to manage. Hence, Components are registered once in the LB4 Application, which will then register the other stuff for you.
**@authenticate**
Adds authentication metadata.

**AuthenticationComponent**
A component to register the necessary artifacts.

**AuthenticationActionProvider**
This is a Sequence Action. Essentially, it adds an "authentication" step to the Sequence.

**AuthenticationStrategyProvider**
This is a standard interface that the @loopback/authentiation package understands. Hence, any authentication strategy that adopts this interface can be used in @loopback/authentication. Think of it like the standard interface for Passport.js uses to interface with many different authentication strategies

---
**Question: I have experience with other ActiveRecord implementations. If I was able to utilize TypeORM, this would be more straightforward. You mentioned TypeORM is coming soon as an option for LoopBack 4?**

**Answer:** You can track progress of a proof of concept here: https://github.com/strongloop/loopback-next/pull/4794
Loopback 4 has been designed to allow flexibility so you can for example use TypeORM if you prefer.

**Question: I am using mysql connector,  I have generated models using LB4 model, But when I migrate the models from loopback to database using `npm run migrate`. The foreign key constraints were missing in database. I have <many>.model.ts files. How to have foreign key in database with npm run migrate.**

**Answer:** AFAIK, you’ll need to add some settings in the `@model` decorator on the FK configuration so that npm run migrate can pick up.
I’ve tried that for postgresql using [this snippet](https://github.com/dhmlau/loopback4-coffeeshop/blob/master/src/models/review.model.ts#L4-L15).  Hope it works for you for mysql as well.

There is an GitHub issue tracking the work to add constraints in db migration: https://github.com/strongloop/loopback-next/issues/2332.

---
**Question: Can anyone point me in the right direction on how to do loggig in LB4?**

**Answer:** You have lots of options.  If you want to do it inside of the context of the loopback application, with IoC binding, you can create a singleton service provider that returns the log utility of your choice.  For example, with winston:
```ts
// services/logger.service.ts
import { bind, BindingScope, Provider } from '@loopback/core';
import * as winston from 'winston';
import * as Transport from 'winston-transport';
@bind({ scope: BindingScope.SINGLETON })
export class LogService implements Provider<winston.Logger> {
  logger: winston.Logger;
  constructor() {}
  value() {
    if (!this.logger) {
      const transports: Transport[] = [];
      transports.push(
        new winston.transports.File({
          handleExceptions: true,
          format:winston.format.json(),
          filename: '/path/t'
        }),
      );
      this.logger = winston.createLogger({
        transports,
        exitOnError: false,
      });
    }
    return this.logger;
  }
}
```

**application.ts**
```ts
// in constructor
this.bind('loggingKey').toProvider(Logger).inScope(BindingScope.SINGLETON);
```

**controller.ts (also applies for service.ts and others)**
```ts
export class HelloWorldController {
  @get('/hello-world')
  public async getHelloWorld(
    @inject('loggingKey') logger: winston.Logger
  ) {
    logger.info('logging to a file!');
    return 'Hello World';
  }
}
```

With binding and injection, you can do some pretty cool stuff, like this extension that gives you a `@log(LOG_LEVEL.INFO)` decorator that can be used to time a request:
https://github.com/strongloop/loopback-next/tree/master/examples/log-extension

There's also the old school nodejs way of just importing a file that exports a log utility, all set up in the global scope. I believe most tutorials for utilities like winston start with that :)

--- 
**Question: Are there any solution to see the errors of model in the response of the request?**

**Answer:** See https://loopback.io/doc/en/lb4/Sequence.html#handling-errors for reference.

--- 

## Interested to Join our Slack Workspace?
Simply click [this invitation link](https://join.slack.com/t/loopbackio/shared_invite/zt-8lbow73r-SKAKz61Vdao~_rGf91pcsw) to join. You can also find more channel details here: https://github.com/strongloop/loopback-next/issues/5048.
