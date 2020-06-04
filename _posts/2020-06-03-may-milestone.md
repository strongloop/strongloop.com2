---
layout: post
title: LoopBack 4 May 2020 Milestone Update
date: 2020-06-04
author: Janny Hou
permalink: /strongblog/may-2020-milestone/
categories:
  - Community
  - LoopBack
published: true
---

The completion of the migration epic would be the biggest news in May. Now LoopBack 3 users can find the migration guide [here](https://loopback.io/doc/en/lb4/migration-overview.html). Meanwhile, we have feature contributions and bug fixes happened across all the functional areas. 

There are more than 20 community PRs merged in May and we really appreciate every community member's help. We set up community calls every four weeks to keep in touch with our maintainers. See the latest schedule and recording in [this story](https://github.com/strongloop/loopback-governance/issues/4).

Keep reading to learn about what happened in May.

<!--more-->

## Migration Epic

### Migrating components

The migration guide for components, which is a powerful way to contribute any artifacts, is the last but most widely covered story in the migration epic. To make the migration guide easier to navigate, we split component-related instructions into several sub-sections as "project layout", "models, entities and repositories", "current context", "model mixins", "REST API endpoints". You can check the documentation [migration-extensions-overview](https://loopback.io/doc/en/lb4/migration-extensions-overview.html) and its sub-pages to learn the details.

### Migrating LoopBack 3 tests to LoopBack 4

When a LoopBack 3 application is mounted in a LoopBack 4 project, its endpoints are exposed through the LoopBack 4's REST server. To reuse the existing LoopBack 3 tests, you can easily migrate them by following the instructions in [example `lb3-application`](https://github.com/strongloop/loopback-next/tree/master/examples/lb3-application#running-lb3-tests-from-lb4). It covers how to set up clients to test requests and how to test runtime functions.

## Features

### Preserving prototype for toObject

LoopBack CRUD operations invoke `toObject` function internally to return a model instance. `toObject` converts a value to a plain object as DTO (Data transfer object). It returned a JSON representation before, which doesn't preserve the prototype of complicated types like `Date`, `ObjectId` but returned the value as a string instead. Now such values' prototypes are kept, for example:

```ts
const DATE = new Date('2020-05-01');
const created = await repo.create({
  createdAt: DATE,
});
// The returned model instance has `createdAt` as type Date
expect(created.toObject()).to.deepEqual({
  id: 1,
  createdAt: DATE,
});
```

### Express Middleware

LookBack 4 leverages Express behind the scenes for its REST server implementation. We decided to not use Express middleware as-is but now we support integrating the middleware in different ways. You can invoke it explicitly in the sequence, or register it to be executed by `InvokeMiddleware` action, or use it as controller interceptors.

Page [Express middlware](https://loopback.io/doc/en/lb4/Express-middleware.html) explains all the scenarios and usages. And page [Middleware](https://loopback.io/doc/en/lb4/Middleware.html) provides the general knowledge of LoopBack 4 middleware.

### Context Improvements

- Function `createBindingFromClass` allow bindings to be created from dynamic value provider classes, for example: 
  ```ts
  @bind({tags: {greeting: 'c'}})
  class DynamicGreetingProvider {
    static value(@inject('currentUser') user: string) {
      return `Hello, ${this.user}`;
    }
  }
  // toDynamicValue() is used internally
  // A tag `{type: 'dynamicValueProvider'}` is added
  const binding = createBindingFromClass(GreetingProvider);
  ctx.add(binding);
  ```

- A provider class can use dependency injection to receive resolution-related
metadata such as context and binding. But the overhead to wrap a factory
function is not desired for some use cases. [PR#5370](https://github.com/strongloop/loopback-next/pull/5370) introduces a lightweight alternative using toDynamicValue as follows:

  ```ts
  import {ValueFactory} from '@loopback/context';
  // The factory function now have access extra metadata about the resolution
  const factory: ValueFactory<string> = resolutionCtx => {
    return `Hello, ${resolutionCtx.context.name}#${
      resolutionCtx.binding.key
    } ${resolutionCtx.options.session?.getBindingPath()}`;
  };
  const b = ctx.bind('msg').toDynamicValue(factory);
  ```
  A benchmark is added to measure the performance of
  different styles of context bindings in package [@loopback/benchmark](https://github.com/strongloop/loopback-next/tree/master/benchmark). You can run `npm run -s benchmark:context` to see the result.

- [PR#5378](https://github.com/strongloop/loopback-next/pull/5378) introduced a model booter to automatically bind model classes to the application during boot. You can retrieve and inject model constructors using key `models.<model_name>`. For example:

  ```ts
  @model()
  class MyModel extends Model {}

  class MyModelComponent {
    models = [MyModel];
  }
  // you can get MyModel by `models.MyModel`
  const modelCtor = myApp.getSync<typeof MyModel>('models.MyModel');
  ```

### Build Improvements

- We upgraded the dependency to TypeScript@3.9.2. Code adjustments including `null` check and type intersection were made to be compatible with the new version. You can check [PR#5041](https://github.com/strongloop/loopback-next/pull/5041/commits) for more details.

- Replace eslint rule `no-invalid-this` with TypeScript-aware one: In code accessing `this` variable, eslint-ignore comment for `no-invalid-this` will no longer work. You can either
change those comments to disable `@typescript-eslint/no-invalid-this`,  or better tell TypeScript what is the type of `this` in your function.

  A TypeScript example:

  ```ts
  import {Suite} from 'mocha';
  describe('my mocha suite', function(this: Suite) {
    this.timeout(1000);
    it('is slow', function(this: Mocha.Context) {
      this.timeout(2000);
    });
  })
  ```

  A JavaScript example:

  ```js
  describe('my mocha suite', /** @this {Mocha.Suite} */ function() {
    this.timeout(1000);
    it('is slow', /** @this {Mocha.Context} */ function() {
      this.timeout(2000);
    });
  })
  ```

- Remove hand-written index files: We removed the root level dummy index files and changed the entry point of project to be the index file inside `src` folder. An example of the latest layout of a package can be found in the [Todo application](https://github.com/strongloop/loopback-next/tree/master/examples/todo).

### Application Booter

- You can register a booter to boot a sub-application as:

  ```ts
  class MainAppWithSubAppBooter extends BootMixin(Application) {
    constructor() {
      super();
      this.projectRoot = __dirname;
      // boot a sub-application `app`, its bindings will be added as well
      this.applicationBooter(app);
    }
  }
  ```

## Documentation and Blog

### What LoopBack can offer on top of Express

LoopBack is a framework built on top of Express. It comes packed with tools, features, and capabilities that enables rapid API and micro-services development and easy maintenance. Last month we published a blog summarizing the points that make LoopBack a compelling choice for Express developers when it comes to API development. You can read [this blog](https://strongloop.com/strongblog/express-to-loopback/) to see how LoopBack can bring Express to the next level.

### Managing LoopBack APIs with IBM APIConnect

LoopBack 4 application can integrate with API Connect framework. We've prepared an article on how you can take the APIs created from LoopBack and import them into API Connect for API management. Stay tuned for the published article.

<!-- Add more stuff when https://github.com/strongloop/strongloop.com/pull/262 finishes -->

### Setting Debug String

Documentation [setting debug string](https://loopback.io/doc/en/lb4/Setting-debug-strings.html) explains the usage of running a LoopBack 4 application with debug string turned on. You can check the documentation above to learn the debug string pattern and the format in each package.

### Strong Error Handler

As a dependency of [`@loopback/rest`](https://github.com/strongloop/loopback-next/tree/master/packages/rest), package `strong-error-handler` is an error handler for use in both development (debug) and production environments. You can use it to customize the error rejection in the LoopBack 4 sequence. For its detailed usage, please read the documentation [using string error handler](https://loopback.io/doc/en/lb4/Using-strong-error-handler.html).

### Postgresql Connector

We've been sharing the connector documentation with LB3, which might be confusing, especially for new LB4 users. We updated the PostgreSQL connector page and also the tutorial. By walking you through the steps of creating a LB4 application and connecting to the PostgreSQL database, we hope the new tutorial helps new users to pick up LoopBack 4 better.

You can read page [connecting to PostgreSQL](https://loopback.io/doc/en/lb4/Connecting-to-PostgreSQL.html) to follow the tutorial.

## Youtube Videos

For creating tutorials, we have more materials than documentations. Last month, one of our core maintainers [Miroslav](https://github.com/bajtos) published two video tutorials on [our StrongLoop YouTube channel](https://www.youtube.com/channel/UCR8LLOxVNwSEWLMqoZzQNXw):

- How to reuse LoopBack repository code: [Click to watch the video](https://www.youtube.com/watch?v=s2yDaKiNYCg)
- Migrate LoopBack 4 datasource config to TypeScript: [Click to watch the video](https://www.youtube.com/watch?v=S3BKXh7wDYE)

## Authentication

There are several documentation and user experience improvements happened this month to make the authentication system more automatic and easy to use:

- Added example [`@loopback/todo-jwt`](https://github.com/strongloop/loopback-next/tree/master/examples/todo-jwt) to demo enabling JWT authentication in the Todo application. Its corresponding tutorial [JWT authentication tutorial](https://loopback.io/doc/en/lb4/Authentication-Tutorial.html) is coming soon.

- Added security specification enhancer in [@loopback/authentication-jwt](https://github.com/strongloop/loopback-next/tree/master/extensions/authentication-jwt) to automatically bind the JWT scheme and global security specification to application. You don't need to manually add them in the application constructor anymore. The updated usage is documented in the [README.md](https://github.com/strongloop/loopback-next/tree/master/extensions/authentication-jwt#usage) file.

## June Milestones

This month, we would like to work on the remaining items for the migration guide epic, documentation improvement and more. For more details, take a look at our [June milestone list on GitHub](https://github.com/strongloop/loopback-next/issues/5607).

## Call to Action

In 2020, we look forward to helping you and seeing you around! LoopBack's success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Here's how you can join us and help the project:

- [Report issues](https://github.com/strongloop/loopback-next/issues).
- [Contribute](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md) code and documentation.
- [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Join](https://github.com/strongloop/loopback-next/issues/110) our user group.
