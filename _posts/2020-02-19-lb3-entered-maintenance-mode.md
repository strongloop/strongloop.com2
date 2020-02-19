---
layout: post
title: LoopBack 3 has entered Maintenance LTS
date: 2020-02-19
author: Miroslav Bajtoš
permalink: /strongblog/lb3-entered-maintenance-mode
categories:
  - LoopBack
published: true
---

Almost a year ago, we announced [Extended Long Term Support for LoopBack 3](https://strongloop.com/strongblog/lb3-extended-lts/), extending Active LTS to the end of November 2019. As the saying goes, all good things must come to an end, and so LoopBack version 3 has entered Maintenance LTS in December 2019.

<!--more-->

What does this change means for LoopBack 3 users? Quoting from our [Long Term Support policy](https://loopback.io/doc/en/contrib/Long-term-support.html):

> Once a release moves into Maintenance LTS mode, only critical bugs, critical security fixes, and documentation updates will be permitted.
>
> Specifically, adding support for new major Node.js versions is not permitted.

Let's quickly clarify that Node.js 12 is the latest major Node.js version supported by LoopBack 3.

Now back to the first rule, which limits the allowed updates to critical problems only. This rule has two goals:

- Maximize the stability of LTS versions by reducing possibilities of changes that may introduce undesired bugs or unintended breaking changes.
- Minimize our effort spent on maintaining old versions, so that we can invest more into the current version (LoopBack 4 and beyond).

There is a catch though: because LoopBack 4 is fundamentally incompatible with LoopBack 3, there are bugs that exists in LoopBack 3 only. The usual approach, where bugs are fixed in the Current version and back-ported to LTS versions, cannot be applied. As a result, we are tracking several community-contributed pull requests fixing issues specific to LoopBack 3.

We feel it would be counter-productive to reject those in-progress pull requests now, after several rounds of reviews and adjustments, just because LoopBack 3 transitioned from Active to Maintenance LTS. We don't want to throw away effort invested by developers contributing those fixes and thus we decided an exceptional situation deserves an exception to be made.

**Until June 2020, we will keep reviewing pull requests fixing non-critical bugs in LoopBack 3 and if we evaluate the risk of breaking something else as low, then we will accept the fix.**

At the end of June, we will evaluate the impact of this new rule and decide if we want to extend its duration further.

## Affected packages

The following packages are considered as part of LoopBack 3 and are moving to
Maintenance LTS:

- [generator-loopback](https://www.npmjs.com/package/generator-loopback)
- [grunt-loopback-sdk-angular](https://www.npmjs.com/package/grunt-loopback-sdk-angular)
- [gulp-loopback-sdk-angular](https://www.npmjs.com/package/gulp-loopback-sdk-angular)
- [loopback](https://www.npmjs.com/package/loopback)
- [loopback-boot](https://www.npmjs.com/package/loopback-boot)
- [loopback-cli](https://www.npmjs.com/package/loopback-cli)
- [loopback-component-explorer](https://www.npmjs.com/package/loopback-component-explorer)
- [loopback-component-passport](https://www.npmjs.com/package/loopback-component-passport)
- [loopback-component-push](https://www.npmjs.com/package/loopback-component-push)
- [loopback-component-storage](https://www.npmjs.com/package/loopback-component-storage)
- [loopback-context](https://www.npmjs.com/package/loopback-context)
- [loopback-datasource-juggler](https://www.npmjs.com/package/loopback-datasource-juggler) (version 3.x)
- [loopback-filters](https://www.npmjs.com/package/loopback-filters)
- [loopback-phase](https://www.npmjs.com/package/loopback-phase)
- [loopback-sandbox](https://www.npmjs.com/package/loopback-sandbox)
- [loopback-sdk-angular](https://www.npmjs.com/package/loopback-sdk-angular)
- [loopback-sdk-angular-cli](https://www.npmjs.com/package/loopback-sdk-angular-cli)
- [loopback-soap](https://www.npmjs.com/package/loopback-soap)
- [loopback-swagger](https://www.npmjs.com/package/loopback-swagger)
- [loopback-workspace](https://www.npmjs.com/package/loopback-workspace)
- [strong-remoting](https://www.npmjs.com/package/strong-remoting)

Please note that connectors are compatible with both LoopBack version 3 and version 4, therefore they are staying actively developed.

## Call to Action

We urge all LoopBack 3 users to migrate their applications to LoopBack 4 as soon as possible. We are providing [Migration guide](https://loopback.io/doc/en/lb4/migration-overview.html) and automated tooling to help with the transition.

If you are building a new project, then we strongly recommend to use LoopBack 4 from the beginning.

LoopBack's success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Here's how you can join us and help the project:

- [Report issues](https://github.com/strongloop/loopback-next/issues).
- [Contribute](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md) code and documentation.
- [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Join](https://github.com/strongloop/loopback-next/issues/110) our user group.
