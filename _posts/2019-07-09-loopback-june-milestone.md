---
layout: post
title: LoopBack 4 June 2019 Milestone Update
date: 2019-07-09
author: Nora Abdelgadir
permalink: /strongblog/loopback-june-2019-milestone/
categories:
  - Community
  - LoopBack
published: true
---

As the temperature gets warmer the LoopBack team is spending this summer releasing hot deliverables. In June we focused on various enhancements such as releasing version 2.0.0 of `@loopback/build`, replacing `strong-docs`, and improving `@loopback/testlab`. We also focused on authentication, inclusion of related models, and other improvements. You can see the [June milestone](https://github.com/strongloop/loopback-next/issues/3035) for an overview of what we have worked on, and read on for more details.

<!--more-->

## Version 2.0.0 of `@loopback/build`

In the past months, we have significantly evolved our build tooling. The last major change was the switch from `tslint` to `eslint` for linting. We decided it's time to clean up the code, remove unused parts and release a new major version.

The release introduced the following breaking changes:

- `lb-apidocs` helper is no longer available.
- `lb-tslint` helper is no longer available.
- `lb-tsc` is no longer choosing `outDir` for you, you have to specify it explicitly.
- It is no longer possible to the specify compilation target via a non-option argument like `lb-tsc es2017`.

See the [release notes](https://github.com/strongloop/loopback-next/blob/master/packages/build/CHANGELOG.md#200-2019-06-17) for more details and instructions on migrating your existing projects.

As part of these changes, we removed vulnerable dependencies and thus `npm install` in newly scaffolded projects reports zero vulnerabilities 🎉.

## Replacing `strong-docs` with `tsdocs`

In [PR#3055](https://github.com/strongloop/loopback-next/pull/3055), we replaced `strong-docs` with `@loopback/tsdocs`. We use `@loopback/tsdocs` to generate markdown files on our website. With this change, we changed the home for our API docs; you can visit the [new home](https://loopback.io/doc/en/lb4/apidocs.index.html) on our website to see the docs. 

This change was a breaking change: as mentioned before, `lb-apidocs` is no longer available for use, as it was removed as part of this PR. For alternate solutions, you can use Microsoft's [api-extractor](https://www.npmjs.com/package/@microsoft/api-extractor) and [api-documenter](https://www.npmjs.com/package/@microsoft/api-documenter).

On the brighter side, by removing `strong-docs` we also removed dependencies on 3rd party modules that have known security vulnerabilities but are no longer maintained.

## Jest and `@loopback/testlab`

We improved our testing helpers to support Jest testing framework.

- [PR#3013](https://github.com/strongloop/loopback-next/pull/3013) fixed typings for `itSkippedOnTravis` to remove an implicit dependency on Mocha typings, which was causing conflicts when using our testlab from Jest.

- [PR#3040](https://github.com/strongloop/loopback-next/pull/3040) introduced a more generic helper `skipOnTravis` which supports any BDD verbs like `describe` and `it`.

    ```ts
    skipOnTravis(it, 'does something', async () => {
      // the test code
    });
    ```

- [PR#3138](https://github.com/strongloop/loopback-next/pull/3138) added even more generic helper `skipIf` that allows you to skip a test case or a test suite on arbitrary condition.

    ```ts
    skipIf(someCondition, it, 'does something', async () => {
      // the test code
    });
    ```

We are also looking into ways to migrate our test suite from Mocha to Jest. Stay tuned for updates!

## Authentication 

In [PR#120](https://github.com/strongloop/loopback4-example-shopping/pull/120), the [shopping cart application](https://github.com/strongloop/loopback4-example-shopping) was updated to utilize the latest authentication package `@loopback/authentication2.x`. You can read more about our latest authentication package in our blog [What's New in LoopBack 4 Authentication 2.0](https://strongloop.com/strongblog/loopback-4-authentication-updates/).

In [PR#2977](https://github.com/strongloop/loopback-next/pull/2977), we introduced some new documentation to the authentication package we've been updating these past few months. See [Authentication](https://loopback.io/doc/en/lb4/Loopback-component-authentication.html) for details.

In [PR#3046](https://github.com/strongloop/loopback-next/pull/3046), a new authentication tutorial on [How to secure your LoopBack 4 application with JWT authentication](https://loopback.io/doc/en/lb4/Authentication-Tutorial.html) was added.

We released the new adapter for passport-based strategies as [`@loopback/authentication-passport`](https://www.npmjs.com/package/@loopback/authentication-passport); now you can follow the guide in [Use Passport-based Strategies](https://loopback.io/doc/en/lb4/Loopback-component-authentication.html) to learn how to create and register a passport strategy and plug it into the authentication system.

## Inclusion of Related Models

### `getJsonSchema` Enhancement

A community user, [@samarpanB](https://github.com/samarpanB), has contributed [PR#2975](https://github.com/strongloop/loopback-next/pull/2975) adding a new option `includeRelations` to the helper `getJsonSchema`. When the option is enabled, the helper adds navigational properties for inclusion of related models in the emitted model schema.

### Navigation Properties Added to TodoList Example

As part of our [Inclusion of Related Models Epic](https://github.com/strongloop/loopback-next/issues/1352), we updated our [TodoList example](https://github.com/strongloop/loopback-next/tree/master/examples/todo-list) to also include navigational properties. After the work done in [PR#3171](https://github.com/strongloop/loopback-next/pull/3171), now when getting a `Todo` with an inclusion filter, its included `TodoList` will be a part of the response and vice versa.

When you call `GET todos/2`, you get the following response:

```json
{
  "id": 1,
  "title": "Take over the galaxy",
  "desc": "MWAHAHAHAHAHAHAHAHAHAHAHAHAMWAHAHAHAHAHAHAHAHAHAHAHAHA",
  "todoListId": 1
}
```

And now when you call `GET todos/2` with the filter `{include: [{relation: 'todo-lists'}]}`, you get the following response:

```json
{
  "id": 1,
  "title": "Take over the galaxy",
  "desc": "MWAHAHAHAHAHAHAHAHAHAHAHAHAMWAHAHAHAHAHAHAHAHAHAHAHAHA",
  "todoListId": 1,
  "todoList": {
    "id": 1,
    "title": "Sith lord's check list"
  }
}
```

You can check out the new full example by calling `lb4 example todo-list`.

## Partial Updates via `PATCH`

In [PR#3199](https://github.com/strongloop/loopback-next/pull/3199), we enabled added a `partial` option for `JsonSchemaOptions`. This addition allowed us to emit schema where all the model properties are optional. By doing this, this lets us to now do `PATCH` requests without having to include all required properties in the request body.

For example, before when trying to update a `Todo` from our [`Todo` example](https://github.com/strongloop/loopback-next/tree/master/examples/todo), you'd have to include the `title` property in the request body:

`PATCH todos/1`

```json
{
   "title": "Take over the galaxy", 
   "desc": "get the resources ready" 
}
```

But now even though `title` is still required, it is optional when doing a `PATCH` request. So now the following is a valid request body to pass to the following request:

`PATCH todos/1`

```json
{
   "desc": "get the resources ready" 
}
```

All newly created projects generated through the CLI will allow partial updates through `PATCH`.

## New GitHub Issue Templates

In [PR#3202](https://github.com/strongloop/loopback-next/pull/3202), we updated the GitHub issues template, so that when you open a new issue, you're taken to [a page](https://github.com/strongloop/loopback-next/issues/new/choose) (see image below) where you can choose the type of issue to open. The options we offer are: bug report, feature request, question, and security vulnerability. With these new more specific templates, it will be easier for the team to go through and understand new issues. 

![Issue template](/blog-assets/2019/07/issue-template.png)

## CLI Improvement

In [PR#2989](https://github.com/strongloop/loopback-next/pull/2989), we made some improvements to the CLI:

- Changed/unified the naming convention to eliminate bugs causing by the input. See the [naming conventions](https://loopback.io/doc/en/lb4/Command-line-interface.html#naming-convention) we follow in LoopBack 4.
- Added a prompt message to warn/notify users the change to their inputs and file names in advance. For example:
    ```
    $ lb4 controller
    ? Controller class name: todo
    $ Controller Todo will be created in src/controllers/todo.controller.ts
    ```

We also made some fixes to our `lb4 discover` command: 

- In [PR#3127](https://github.com/strongloop/loopback-next/pull/3127), we fixed a bug so that the prompt exits properly when using the command.
- In [PR#3015](https://github.com/strongloop/loopback-next/pull/3015/), community member [@samarpanB](https://github.com/samarpanB) contributed a fix that would properly stringify `modelSettings` that go into the `@model` decorator.
- In [PR#3115](https://github.com/strongloop/loopback-next/pull/3115), community member [@marvinirwin](https://github.com/marvinirwin) contributed a fix that makes the `schema` field in `modelSettings` use the owner of the schema.

## New Team Member

We have a new addition to our LoopBack team: Agnes ([@agnes512 on GitHub](https://github.com/agnes512)) has joined the team as our intern for the next year. She has already contributed improvements to our documentation, our [`cloudant` connector](https://github.com/strongloop/loopback-connector-cloudant/), our CLI, and other more. We're happy to have her on our team and look forward to see what she accomplishes in the future.

## Other Changes

- We introduced a shared test suite that allows us to test any Repository implementation against any supported connector, e.g. `DefaultCrudRepository` against `loopback-connector-mongodb`. This suite will help us to catch database-specific problems that went undiscovered so far. See [PR#3097](https://github.com/strongloop/loopback-next/pull/3079).
- We reworked the `cloudant` connector test setup so that both juggler versions 3.x and 4.x are triggered. So far connectors `mongodb`, `postgresql`, `kv-redis`, `cloudant` run the shared tests. See [PR#206](https://github.com/strongloop/loopback-connector-cloudant/pull/206).
- We honoured the arguments for another two LoopBack 3 CLI commands: `lb remote-method` and `lb middleware`. See [PR#410](https://github.com/strongloop/generator-loopback/pull/410).
- We deprecated the `@loopback/openapi-v3-types` package. See [PR#3220](https://github.com/strongloop/loopback-next/pull/3220).
- We improved the documentation for our [shopping cart application](https://github.com/strongloop/loopback4-example-shopping). See [PR#183](https://github.com/strongloop/loopback4-example-shopping/pull/183).

We have finished the migration from GreenKeeper to RenovateBot and added documentation for LoopBack developers describing how to work with RenovateBot's pull requests. Learn more in the new section [Renovate bot](https://loopback.io/doc/en/contrib/code-contrib-lb4.html#renovate-bot) in our documentation for developers.

We have upgraded our eslint-related infrastructure to eslint version 6 and added few more rules to the default eslint config to catch even more programming errors:

- [no-floating-promise](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-floating-promises.md) to detect & reject usage of Promise-like values in statements without handling their errors appropriately. We used to have this rule enabled in our old tslint-based setup but had to switch it temporarily off because it was not available in typescript-eslint until recently.
- [no-prototype-builtins](https://eslint.org/docs/rules/no-prototype-builtins) to detect code that can introduce Prototype Poisoning vulnerability. This rule was promoted to recommended rules in eslint version 6.
- [require-atomic-updates](https://eslint.org/docs/rules/require-atomic-updates) to report assignments to variables or properties where a race condition may be introduced. This rule was promoted to recommended rules in eslint version 6.

## Looking for User References

As you might be aware, the [loopback.io](https://loopback.io/) website has a brand new look. We'd like to rebuild the "Who's using LoopBack" section and showcase our users and their use cases. If you would like to be a part of it, see the details in this [GitHub issue](https://github.com/strongloop/loopback-next/issues/3047).

## What's Next?

If you're interested in what we're working on next, you can check out the [July milestone](https://github.com/strongloop/loopback-next/issues/3241).

## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Reporting issues](https://github.com/strongloop/loopback-next/issues).
- [Contributing](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md) code and documentation.
- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Joining](https://github.com/strongloop/loopback-next/issues/110) our user group.
