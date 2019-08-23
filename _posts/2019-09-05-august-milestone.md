---
layout: post
title: LoopBack 4 August 2019 Milestone Update
date: 2019-08-07
author: Janny Hou
permalink: /strongblog/august-2019-milestone/
categories:
  - Community
  - LoopBack
published: false
---

<!-- This is the template for august milestone, feel free to add your achievement when finish a task, thank you! -->

## Max Listeners

If multiple operations are executed by a connector before a connection is established with the database, these operation are queued up. If the number of queued operations exceeds [Node.js' default max listeners amount](https://nodejs.org/api/events.html#events_eventemitter_defaultmaxlisteners), it throws the following warning: `MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 connected listeners added. Use emitter.setMaxListeners() to increase limit`. We introduced a default value for the maximum number of emitters and now allow users to customize the number. In a LoopBack 3 application's `datasources.json`, you can change the number by setting the `maxOfflineRequests` property to your desired number. See [PR #1767](https://github.com/strongloop/loopback-datasource-juggler/pull/1767) and [PR #149](https://github.com/strongloop/loopback-connector/pull/149) for details.

## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Here's how you can join us and help the project:

- [Report issues](https://github.com/strongloop/loopback-next/issues).
- [Contribute](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md) code and documentation.
- [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Join](https://github.com/strongloop/loopback-next/issues/110) our user group.
