---
layout: post
title: Best Practices for LoopBack 4
date: 2018-11-21
author: Miroslav Bajtoš
permalink: /strongblog/loopback-4-best-practices/
categories:
  - Community
  - LoopBack
---

The LoopBack framework is a powerful and flexible tool that can be used in many different ways. Some of these ways lead to better results while others can create headaches later in the project lifecycle. To make it easy for LoopBack users to do the right thing in their projects, we have created Best Practice guides.

<!--more-->
<p align="center"> 
<img src="https://strongloop.com/blog-assets/2018/11/LoopBack-4-Guidelines.png" alt="LoopBack 4 Guidelines" style="width: 300px"/>
</p>
For example, LoopBack users frequently raise the topic of automated testing. Unfortunately, testing was not considered in the design of pre-v4 versions. As a result, writing tests was cumbersome. The lack of official guidance and documentation did not help either.

When we started working on LoopBack 4, one of our design priorities was enabling application developers to follow industry best practices, from test-driven development to user-centric/design-first approach to building APIs. As part of this effort, we wrote several documents to educate LoopBack developers about our recommended best practices.

At the moment, we offer two guides: 

- [Best Practices](https://loopback.io/doc/en/lb4/Best-practices.html) aiming at application developers. 
- [Extending LoopBack](https://loopback.io/doc/en/lb4/Extending-LoopBack-4.html) aiming at extension developers.

## Best Practices for Applications

When it comes to automated testing, we think it is important to understand the high level picture first. Why are tests important, what should be tested, and how can we write a robust test suite that's easy to maintain? Our opinions on these queries are summarized in the chapter called [Defining your testing strategy](https://loopback.io/doc/en/lb4/Defining-your-testing-strategy.html).

Once we understand the testing strategy, it's time to figure out implementation details. The chapter called [Testing your application](https://loopback.io/doc/en/lb4/Testing-your-application.html) contains a ton of hands-on advice on a wide range of test-related topics, from project setup and data handling to code examples showing unit, integration and acceptance tests for various application artifacts like controllers and repositories.

Last but not least, we offer a guide on building applications using the code-first approach. With this approach, we start with an implementation (a domain model) and expose it via REST APIs by applying TypeScript decorators. Learn more in [Defining the API using code-first approach](https://loopback.io/doc/en/lb4/Defining-the-API-using-code-first-approach.html).

In the early alpha versions of the framework, we used to have a guide on building application design-first. The design-first approach starts with an API design phase, with the intention to find such API that will work great for API consumers and won't be unnecessarily constrained by implementation details. The actual implementation starts only after the API has been designed and described in an OpenAPI specification document. Unfortunately, we were not able to make this approach as easy to use as we'd like, so we do not offer a guide yet. You can check out an old (and outdated) page [Thinking in LoopBack](https://github.com/strongloop/loopback.io/blob/d4ad2ca05f80f53cc70b3666f09aa729214ccc13/pages/en/lb4/Thinking-in-LoopBack.md) for a glimse of our vision. For now, though, you can use [lb4 openapi](https://loopback.io/doc/en/lb4/OpenAPI-generator.html) to create initial scaffolding of controllers and models from an OpenAPI spec document. Note this CLI command is not able to update the implementation from changes made to the spec later as the project evolves.

Does the design-first approach resonate with you and would you like to build your application this way? We would love to hear from you! Just leave a comment in [GitHub issue #1882](https://github.com/strongloop/loopback-next/issues/1882).

## Bests Practices for Extensions

Extensibility is a core principle driving LoopBack 4 design. Our guide for extension developers covers the following topics at the moment:

- [How to start a new component](https://loopback.io/doc/en/lb4/Creating-components.html)
- [How to create a decorator](https://loopback.io/doc/en/lb4/Creating-decorators.html)
- [How to implement a custom Server](https://loopback.io/doc/en/lb4/Creating-servers.html)
- [How to test your extension](https://loopback.io/doc/en/lb4/Testing-your-extension.html)

## What's Next?

The Best Practice guides are living documents that will evolve together with the framework as the needs of our users grow.

Is there any topic you would like to see covered? Please check the existing [Docs issues](https://github.com/strongloop/loopback-next/issues?q=is%3Aissue+is%3Aopen+label%3ADocs) first and if there is no existing issue covering your topic, then open a new one to let us know.

## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
- [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
- [Reporting issues](https://github.com/strongloop/loopback-next/issues)
- [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
- [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)
