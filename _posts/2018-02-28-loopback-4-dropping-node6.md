---
layout: post
title: Dropping Support for Node.js 6 in LoopBack 4
date: 2018-02-28T01:10:15+00:00
author: Biniam Admikew
permalink: /strongblog/loopback-4-dropping-node6
categories:
  - Community
  - LoopBack
---

Our goal with the next version of [LoopBack](https://strongloop.com/strongblog/announcing-loopback-next/) is to use cutting-edge features and tooling from the Node.js ecosystem. Node.js 6.x will be entering maintenance mode this April, and requires us to provide hacks and polyfills to maintain compatibility, which actively works against this goal. As a result, we are dropping Node.js 6.x support for LoopBack 4. We will continue to support Node.js 8.x, and will be adding support for Node.js 10.x shortly after it is released.

With Node.js 6.x out of the picture, we were able to further simplify our project infrastructure:

- We no longer need a polyfill for `util.promisify` as we can rely on the built-in implementation.
- Our build is simpler with a single compilation target i.e. ES2017. This improves the speed and resource usage of CI builds.
- The coverage data gathered by our tests are more accurate now, as there is only one JavaScript codebase to measure.
- We were able to increase our platform coverage in Travis CI instead of having two sets of builds for Node.js 6.x and Node.js 8.x.

Our [@loopback/build](https://github.com/strongloop/loopback-next/tree/master/packages/build) module, which contains a set of scripts to compile/lint/test TypeScript projects, continues to support ES2015 targets, so projects making use of it can
still choose to transpile to ES2015 and ES2017 targets. This allows us to maintain backward compatibility for modules using it outside of LoopBack 4.

## Call for Action

LoopBack's success counts on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

* [Open a pull request on one of our "good first
  issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
* [Casting your vote for
  extensions](https://github.com/strongloop/loopback-next/issues/512)
* [Reporting issues](https://github.com/strongloop/loopback-next/issues)
* [Building more
  extensions](https://github.com/strongloop/loopback-next/issues/647)
* [Helping each other in the
  community](https://groups.google.com/forum/#!forum/loopbackjs)

