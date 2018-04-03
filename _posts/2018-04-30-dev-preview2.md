---
layout: post
title: Announcing LoopBack 4 Developer Preview 2
date: 2018-04-30T00:00:13+00:00
author: Diana Lau, Raymond Feng
permalink: /strongblog/loopback-4-developer-preview-2/
categories:
- Community
- LoopBack
---

In the previous release of [Developer Preview #1](https://strongloop.com/strongblog/loopback-4-developer-preview-release), 
we made LoopBack 4 extensible so that our community users and ourselves can build 
extensions for adding features to LoopBack. 

Since then, we have been focusing on enabling application developers to write 
LoopBack applications with the capability to connect to the backend databases.
With the newly added features, improved developer experience and documentation, 
we're pleased to announce today that Developer Preview #2 is available!  


[LB4 logo when it's available]
<!--<img src="https://strongloop.com/blog-assets/2018/03/boot-process.png" alt="@loopback/boot Bootstrapping process" style="width: 500px; margin:auto;"/>-->

<!--more-->

## Highlights of Developer Preview 2
### New LoopBack logo
Based on the [feedback from the community](https://strongloop.com/strongblog/thanks-loopback-4-logo/), 
we decided on the new logo for LoopBack 4, representing the framework being rewritten from the ground-up with better extensibility and flexibility.  Big shout out to our design team!

### Repository and Controller bootstrapper
[Introducing `@loopback/boot`](https://strongloop.com/strongblog/introducing-boot-for-loopback-4/) 
which includes convention-based bootstrapper that automatically discovers artifacts and binds them to your Application’s Context. In this release, we have implemented the `Repository` and 
`Controller` bootstrapper.  This reduces the amount of manual effort required to bind artifacts for dependency injection at scale.

### OpenAPI v3 support
[OpenAPI Specification](https://swagger.io/specification/) provides a standard format to unify how an industry defines and describes RESTful APIs.  To keep up with the latest
technologies, [LoopBack 4 has added the support for OpenAPI v3](https://github.com/strongloop/loopback-next/tree/master/packages/openapi-v3).

### Enhanced command-line interfaces
You can now use `lb4 controller` to [generate controllers](https://strongloop.com/strongblog/generate-controllers-loopback-4-cli/)
and `lb4 example` to download examples. For details, see the [CLI documentation](http://loopback.io/doc/en/lb4/Command-line-interface.html). 

### Documentation
In addition to our continued effort to improve LoopBack 4 documentation, 
we've revamped the [Getting Started tutorial](url) to include step-by-step 
instructions in creating your first LoopBack 4 application.  

### Development process
We have made a few changes to keep us on top of the latest technology stack and 
simplify our development process and infrastructure.  It includes:
- [Drop Node 6 support](https://strongloop.com/strongblog/loopback-4-dropping-node6)
- [Move LoopBack 4 documentation to loopback-next monorepo](march-milestone-url) 
- [Switch to 0.x.y versions from 4.0.0-alpha.X](https://github.com/strongloop/loopback-next/issues/954) to better indicate breaking changes

### Many more enhancements [WIP]
- [Able to generate JSON schema from models](https://strongloop.com/strongblog/loopback-4-json-schema-generation/)

[the list below coming from Raymond's message on slack. not sure about the details]
- Many improvements in the context, such as find, inject.context, session tracking and circular dep detection
- optional dep
- source-map

## What's next
Going forward, we'll be progressively providing richer functionalities to the framework,
such as relation and type conversion.  Stay tuned for our [plan](https://github.com/strongloop/loopback-next/wiki/Upcoming-Releases).
Please note that we may make adjustment along the way.  

## Call for action
LoopBack’s future success counts on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:
- [Report bugs or feature requests](https://github.com/strongloop/loopback-next/issues)
- [Contribute code/documentation](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md)