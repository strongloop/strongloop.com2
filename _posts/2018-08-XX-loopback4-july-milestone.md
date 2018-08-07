---
layout: post
title: LoopBack 4 July 2018 Milestone Update
date: 2018-08-T00:10:11+00:00
author: Kyu Shim
permalink: /strongblog/july-2018-milestone/
categories:
  - Community
  - LoopBack
---

As the temperature hits an all-time high across the world, our team at LoopBack is also hitting some high numbers with our progress on LoopBack 4! In the month of July, we were able to finish and release Developer Preview #3 for LoopBack 4 as well as do some maintenance work for our other LoopBack repositories.

As always, our plan and progress can be checked out in our [milestone issue](https://github.com/strongloop/loopback-next/issues/1477). Please read on if you are curious for some insider details on our latest big release as well as what else has been happening over the summer.

<!--more-->

## July Milestone Goals

### Developer Preview #3!!!

As of July 20th, LoopBack 4 has been released with Developer Preview #3, our latest feature-packed release for the framework. To quickly summarize it, the release's biggest features include an improved arsenal of CLI commands, integrated web service support, model relation, HTTP request coercion/validation, and expanded HTTP processing capabilities.

For a more thorough run down of what has been introduced by the release, check out our [DP3 blog post](https://strongloop.com/strongblog/loopback-4-developer-preview-3). As for what's been accomplished in just the month of July, read on to find out.

#### HTTPS Support

We were able to finish adding in out-of-the-box HTTPS configuration support for all LoopBack 4 REST applications! Instruction on configuring your application for HTTPS can be found in our docs on [Server](https://loopback.io/doc/en/lb4/Server.html#enable-https), and the discussion that took place to figure it all out can be found in this [PR](https://github.com/strongloop/loopback-next/pull/1488).

#### Documentation on Relations

The follow up documentation for using `@hasMany` relations feature along with integrated repository support has been added to loopback.io under [Relations](https://loopback.io/doc/en/lb4/HasMany-relation.html). [Biniam](https://github.com/b-admike) has also written a [blog post](https://strongloop.com/strongblog/loopback4-model-relations) on the decisions that went behind creating a relations system for LoopBack 4.

To illustrate the feature and its usage, we've also created a continuation of our tutorial on Todo application that uses the `hasMany` relation. You can check out the tutorial [here](https://loopback.io/doc/en/lb4/todo-list-tutorial.html). Alternatively if you already have our CLI tool installed (`npm i -g @loopback/cli`), run `lb4 example todo-list` to get the final application you would get from the tutorial.

#### HTTP Request Body Data Validation

Any requests that go through applications using `@loopback/rest` will now have its body and parameters validated according to the OpenAPI schema generated/specified from the desired route's parameter decorator. All you need to do to start using this feature is to update `@loopback/rest` to the latest; no changes are necessary to any of your existing code.

Please note that validation is based on the matching schema in your OpenAPI spec and will return status code 422 (Unprocessable Entity) if the request body fails validation with the schema.

We're working on ways to make validation configurable. If you would like to participate in its discussion or have any suggestions, we have an issue tracking the feature [here](https://github.com/strongloop/loopback-next/issues/1463).

#### CLI Commands

We have been able to add two more CLI features to make your development process lightning quick: model generation and options to skip prompts.

In short, you can quickly generate LB4 models by `lb4 model` command and bypass repetitive prompts through the `--config` options. For more details, check out our documentation [here](https://loopback.io/doc/en/lb4/Model-generator.html).

#### Miscellaneous Improvements

Here are a couple of other smaller items that were done in July:

- [CLI] Document how is the CLI generator discovering models and repositories in the project [#1085](https://github.com/strongloop/loopback-next/issues/1085)
- [http] @loopback/rest: HttpHandler integration test times out after 2 seconds randomly [#1407](https://github.com/strongloop/loopback-next/issues/1407)
- [http] Add an example showing how to configure HTTPS [#1537](https://github.com/strongloop/loopback-next/issues/1537)
- [Spike] Give bottom-up examples in Controllers.md, Routes.md, Repositories.md and Decorators.md [#1173](https://github.com/strongloop/loopback-next/issues/1173)
- [non-DP3] Fix test suite [generator-loopback#354](https://github.com/strongloop/generator-loopback/issues/354)

We've also added in translation for Czech, Polish, and Russian for our LoopBack 3.x repositories.

## Node Summit 2018

How can we call it a summer without going on a summer trip? [Miroslav](https://github.com/bajtos) and [Taranveer](https://github.com/virkt25) from our development team hopped on over to San Francisco to give talks and keep up with the latest developments in the Node community at NodeSummit 2018. Miroslav gave a talk on the marvelous async functions and Taranveer on all of the technologies and concepts we leverage for LoopBack 4.

Stay tuned in August because their talks will soon be uploaded on the NodeSummit website!

## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
- [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
- [Reporting issues](https://github.com/strongloop/loopback-next/issues)
- [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
- [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)
