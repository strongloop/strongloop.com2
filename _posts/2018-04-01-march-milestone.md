---
layout: post
title: March 2018 Milestone Update
date: 2018-04-01T00:00:13+00:00
author: Taranveer Virk
permalink: /strongblog/march-2018-milestone/
categories:
  - Community
  - LoopBack
---

With spring in the air, we've been hard at work gearing up for a new major release
of LoopBack 4 dubbed the "Developer Preview 2". The team has been focusing on the items
needed for this release in the [March Milestone](https://github.com/strongloop/loopback-next/issues/937). You can also see
the [April Milestone](https://github.com/strongloop/loopback-next/issues/1044) to see the work we have planned for the month of April.
Read on to learn about the March Milestone's accomplishments and more.

<!--more-->

## OpenAPI 3.0 Support

In keeping up with the latest technologies and standards, LoopBack 4 has added support
for OpenAPI 3.0.0 via the new [@loopback/openapi-v3](https://github.com/strongloop/loopback-next/tree/master/packages/openapi-v3) package. This package includes decorators
to describe LoopBack artifacts such as Controllers using the latest specification. Along with this,
LoopBack 4 has deprecated support for Swagger 2.0 and the @loopback/openapi-v2 package.

## Documentation

A good framework comes with good documentation. During the month of March, documentation was
a major focus for the team. The docs were reorganized and updated to be in sync with the latest
features in LoopBack 4.

A spike also took place to determine the feasibility of moving LoopBack 4 documentation from
[loopback.io](http://loopback.io/) repository to the LoopBack 4 monorepo. Following the spike, the documentation was
moved to the monorepo, with the help of some scripts that allow the docs to show on loopback.io site.
This effort allows the documentation to be kept up to date with the code. The docs are also now
available as a `npm` package `@loopback/docs` which opens up the possibility for versioned
docs on loopback.io.

Now contributors of Loopback 4 can update the documentation along with the code in the same PR in the
[loopback-next](https://github.com/strongloop/loopback-next) repository. This simplifies the development
process for all contributors as documentation and code live under the same repository.

### Tutorial

For those looking to get started with LoopBack 4, we have completely revamped the LoopBack 4
Tutorial showing you how to create a Todo Application (with legacy juggler) support. This package was
formerly known was `example-getting-started`. The new tutorial has been broken down into multiple
pages with each one focusing on a key concept for LoopBack 4 development. You can check out the new tutorial [here](http://loopback.io/doc/en/lb4/todo-tutorial.html)

### APIDocs

There were a number of issues in [typedoc](https://github.com/TypeStrong/typedoc) and [strong-docs](https://github.com/strongloop/strong-docs) which left APIDocs to be incomplete for some of
the packages. These issues were addressed and as a result [APIDocs](http://apidocs.loopback.io/) are now more accurate than before as it includes missing sections and types.

## Injection Type Inference

Previously, it was not possible for the type of an item retrieved from `Context` to be inferred by TypeScript, providing
some safety and autocompletion support in editors such as Visual Studio Code. This has now been addressed as a `BindingKey` now
preserves type information and provides that to the compiler when an item is retrieved. These changes came in as a result of
[PR #1169](https://github.com/strongloop/loopback-next/pull/1169). Example of before and after can be seen below.

```ts
import { Context, BindingKey } from "@loopback/context";

class FooClass {
  hello() {
    console.log("hello");
  }
}

const ctx = new Context();
const key = BindingKey.create<FooClass>("my.binding.key");
ctx.bind(key).toClass(FooClass);

let foo = await ctx.get(key);

// Before #1169, foo is considered to be of type any
// No warning is shown that property 'world' doesn't exist on FooClass.
foo.world();

// After #1169, foo is known to be of type FooClass. The following compiler warning is shown in VSCode.
// [ts] Property 'world' does not exist on type 'FooClass'.
foo.world();
```

## Experiments

There are some exciting features in development that you can check out and provide feedback on below!

* [[RFC] feat: use express/koa/... as the http framework](https://github.com/strongloop/loopback-next/pull/1082)
* [[WIP - PoC] feat: add integration for service-oriented backends](https://github.com/strongloop/loopback-next/pull/1119)

There are some other experimental pull requests as well that can be seen with the [RFC] or [WIP] tag [here](https://github.com/strongloop/loopback-next/pulls).

## Juggler Relations

With LoopBack 4, we are talking a fresh new look at Model Relations. In March we have started a spike
to investigate approaches and answer some questions to allow the team to make a better decision for
future work that needs to be done. Unfortunately, due to the complexity and size of the task, this
task will not finish on time but you can track progress in this [PR](https://github.com/strongloop/loopback-next/pull/1194) and [Issue](https://github.com/strongloop/loopback-next/issues/995).

## Miscellaneous Improvements

* New projects generated using the LoopBack 4 CLI now feature the new Powered by LoopBack 4 Logo.
  <img src="/blog-assets/2018/04/powered-by-LB4.png" alt="Powered by LB4 Badge" style="width: 500px; margin:auto;"/>

* `LICENSE.md` is no longer generated for a new Application scaffolded using the CLI.
* We've simplified the issues template for LoopBack 4 and now accept questions in issues (but please use this as a last resort).

## Call for Action

LoopBack's future success counts on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

* [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
* [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
* [Reporting issues](https://github.com/strongloop/loopback-next/issues)
* [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
* [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)
