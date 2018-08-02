---
layout: post
title: LoopBack Adopts Module LTS Policy
date: 2018-08-02T00:00:02+00:00
author: Miroslav Bajtoš
permalink: /strongblog/loopback-adopts-module-lts-policy
categories:
  - Community
  - LoopBack
---

TL:DR; LoopBack is joining the recently announced [Module LTS initiative](https://developer.ibm.com/node/2018/07/24/module-lts/) and aligns the long-term support terms with Node.js LTS versions.

<!--more-->

## Introduction

In 2016, we released a new major version of LoopBack 3.0 and defined an LTS policy to cover our existing LoopBack 2.x users. We based our policy on Node.js' LTS policy that was in effect at that time, aiming to provide enough stability for our users. We also wanted to keep the cost of maintaining multiple versions affordable, since we had a few:

> - A _Current_ version where most of the development occurs.
> - A _Long-term support (LTS)_ version that does not add new features but gets bug fixes.
> - One (or more) _maintenance_ versions that receive only critical bug fixes.
>
> A major LoopBack version enters LTS when the next major version is released and stays in LTS mode for at least six months.
>
> When a new major version is released, the oldest LTS version enters maintenance mode, where it will stay for another six months at minimum.

As more and more enterprise users choose Node.js for their project, the expectations are shifting towards making the supported term longer. In response to those changes and in tandem with other IBM-maintained Node.js modules, we are joining the recently announced [Module LTS initiative](https://developer.ibm.com/node/2018/07/24/module-lts/).

> Long Term Support (LTS) for Node.js modules aims to provide the longevity and stability of modules that is crucial for many businesses when adopting Node.js in an enterprise, cloud-native setting.
>
> When a version of Node.js enters LTS, whichever the latest major version (X.y.z) of a module is at that time, will be supported for the lifetime of that version of Node, and will receive at least security and critical fixes.

## What is Changing

We have renamed "LTS" and "Maintenance" versions to "Active LTS" and "Maintenance LTS" to better express what kind of support level to expect and to avoid confusion about what "LTS" actually means in different policies (LoopBack, Node.js core, Module LTS).

Previously, we were committed to support each major version for at least 6 months in Active LTS mode and another 6 months in Maintenance LTS mode. With the new LTS policy in place:

- We stay committed to keep fixing all bugs for at least the first 6 months after a LoopBack major version enters Active LTS mode. (No changes here.)

- When a LoopBack version enters Maintenance LTS mode, we are committed to keep fixing critical and security issues for as long as the related Node.js LTS version stays supported by the Node.js project. This will typically offer much longer support than the previous minimum of 6 months.

You can find the full version of our LTS policy in our documentation here: [https://loopback.io/doc/en/contrib/Long-term-support.html](https://loopback.io/doc/en/contrib/Long-term-support.html)

In practical terms, when LoopBack 4 GA _(General Availability)_ is released (presumably in October 2018):

 - LoopBack 3.x enters Active LTS mode for at least 6 months.
 - LoopBack 2.x enters Maintenance LTS mode until April 2019 when it reaches end of life together with Node.js 6.x.

When LoopBack 5 GA is released further in the future:

 - LoopBack 4.x enters Active LTS mode.
 - LoopBack 3.x enters Maintenance LTS mode until December 2019 when it reaches end of life together with Node.js 8.x.

## What's Next?

Check out upcoming Node.js, API Development, and Integration [events](https://strongloop.com/events/) with the StrongLoop and IBM team.

## Call for Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
- [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
- [Reporting issues](https://github.com/strongloop/loopback-next/issues)
- [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
- [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)
