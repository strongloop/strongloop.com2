---
layout: post
title: Migrate from LoopBack 3 to LoopBack 4
date: 2019-06-12
author: Nora Abdelgadir
permalink: /strongblog/migrate-from-loopback-3-to-loopback-4/
categories:
  - Community
  - LoopBack
published: true
---

Following the announcement of LoopBack 4 GA in October, LoopBack 3 entered Active Long Term Support (LTS). In March, we  announced that [LoopBack 3 will receive extended LTS](https://strongloop.com/strongblog/lb3-extended-lts/) until December 2019. We made this choice to provide LoopBack 3 users more time to move to LoopBack 4 and for us to improve the migration experience. In order to incrementally migrate from LoopBack 3 to LoopBack 4, we have since introduced a way to mount your LoopBack 3 applications in a LoopBack 4 project.

<!--more-->

[Miroslav](https://strongloop.com/authors/Miroslav_Bajto%C5%A1/) investigated different approaches for migration which you can see in the [Migration epic](https://github.com/strongloop/loopback-next/issues/1849). He settled on mounting the LoopBack 3 application in a LoopBack 4 project as part of incremental migration (see the [PoC](https://github.com/strongloop/loopback-next/pull/2318) here). In this approach, the entire LoopBack 3 application is mounted, including its runtime dependencies. The LoopBack 3 Swagger spec is also converted to LoopBack 4 OpenAPI v3 and a unified spec is created.

If you are a current LoopBack 3 user who wants to migrate to LoopBack 4, learn all the steps needed to mount your application in this [Migrating from LoopBack 3](https://loopback.io/doc/en/lb4/Migrating-from-LoopBack-3.html) doc.

## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Reporting issues](https://github.com/strongloop/loopback-next/issues).
- [Contributing](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md)
  code and documentation.
- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Joining](https://github.com/strongloop/loopback-next/issues/110) our user group.
