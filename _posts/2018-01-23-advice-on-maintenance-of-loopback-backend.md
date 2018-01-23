---
title: Answered in Open &#8211; Advice for Maintenance and Updating a Loopback Back-end
date: 2018-1-23T01:00:13+00:00
author: Miroslav Bajtoš
permalink: /strongblog/advice-for-loopback-backend-maintenance/
categories:
  - Community
  - LoopBack
  - How-To
---

Recently, I was approached by a LoopBack user running a single-person project powered by LoopBack 2.x, asking for an advice on how to maintain and upgrade his backend. While I could respond directly in an email, I strongly believe in [maximizing the value of my keystrokes](https://blog.codinghorror.com/maximizing-the-value-of-your-keystrokes/) and posting information potentially useful to the LoopBack community in a public place.

This user runs a website and a REST API powered by LoopBack as the back-end with an angular admin interface, and React as the web client with React Native as the app framework. The system was implemented in about 2 months back in 2016 and has run without particular issues for over a year now.

The implementation contains some suboptimal/hacky bits that were needed to get around the old issues of dynamic context access, a bug in the relations from UserRole, etc. As a result, the number of hooks has continued to pile up. The system is still relatively fast, but there are concerns about scalability issues as usage grows.

The project is staying on LoopBack 2.x LTS, because 3.x has not entered LTS mode yet. The developer is aware of our upcoming version 4, and thinks the rewrite is probably a good thing . At the same time he is worried that the majority of features he depends on won't be ready (either in core or provided by components) until [late in 2019](https://github.com/strongloop/loopback-next/wiki/Upcoming-Releases).

Now that we have set the context, let's look at the actual questions asked.

> What would you suggest for a company like mine with only me as the developer/owner with somewhat limited time? Should I consider upgrading to loopback 3 in the short term, or stick it out with our working loopback 2 backend and deal with scalability issues through extra horsepower in the meantime, planning on a wholesale rewrite of our backend to loopback 4 for mid 2019?

As the popular saying goes: If it ain't broke, don't fix it. Unless you can leverage a feature from 3.x to simplify your code, or perhaps get rid of a hacky workaround for a bug that was fixed in 3.x but not backported to 2.x, then I think the costs of upgrading from 2.x to 3.x outweigh the short-term benefits right now. Keep in mind: as long as 2.x is covered by our [Long Term Support](https://loopback.io/doc/en/contrib/Long-term-support.html) program, we are backporting all security fixes to the 2.x branch, so your application using LoopBack 2.x is as safe as with LoopBack 3.x.

For medium term, my advice is to build basic understanding and a rough estimate of the cost needed to upgrade to LoopBack 3.x. I would personally set aside some time to go through the steps described in our [Migration guide](https://loopback.io/doc/en/lb3/Migrating-to-3.0.html) and apply the relevant ones to your project, run the tests and see how far you got. You may find that there are only few easy tweaks needed, but it's also possible some of our breaking changes will require more effort as part of the upgrade. Many of the migration steps were intentionally implemented in such way that they can be applied individually while still running on LoopBack 2.x. This allows users to break the migration into multiple small incremental changes, spreading it over a longer period of time. As a result, you may be able to commit some of the changes made during your investigation into your production codebase.

When LoopBack 4 GA is released, LoopBack 2.x will move from LTS to maintenance mode (see our [LTS policy](https://loopback.io/doc/en/contrib/Long-term-support.html)), which means only critical bugs and security issues will be fixed. At this point you should start working on the migration to a newer version, either 3.x or 4.x. The learnings from the dry-run migration exercise will make it easier for you to decide what to do. If upgrading to 3.x is much easier than upgrading to 4.x, then it may be worth the extra costs to upgrade to LoopBack 3.x only, so that you remain covered by our LTS; and you can defer LoopBack 4 upgrade until the new LoopBack codebase becomes more stable and all features you are depending on are ported to the new framework version.

By the way, we are maintaining a [documentation page](http://loopback.io/doc/en/lb4/LoopBack-3.x.html) describing the differences between LoopBack 3.x and the upcoming 4.0 version. It may help you to better understand the scope of the future upgrade to LoopBack 4.0.

> We are using your angular SDK now for the admin back end, but you say you'll have a React SDK for V4? I'd love to hear more about plans for that.

Going forward, we prefer to avoid creating and maintaining any LoopBack-specific frontend SDKs ourselves. Ideally, we would like to work with existing Swagger/OpenAPI client generators (e.g. the official [Swagger Codegen](https://swagger.io/swagger-codegen/)) to make their output easy to use for LoopBack developers. For example, we would like to leverage additional endpoint metadata like "controller name" and "method name" to enable code generators to generate a structured client API (e.g. "Product.create") instead of the current flat list of endpoints (i.e. "Product\_create").

We would also like to implement a GraphQL component which will make it easy to consume LoopBack-powered APIs from many front-end frameworks including React via any GraphQL client, like Facebook's official [Relay client](https://facebook.github.io/relay/) or the community-driven [Apollo client](https://www.apollographql.com/client/). You can subscribe to [GitHub issue #656](https://github.com/strongloop/loopback-next/issues/656) for updates about the progress of the GraphQL work.

Having said that, if there is a strong demand for an SDK specific to a single frontend framework and there are volunteers willing to make such SDK happen, then we are happy to lend our expertise to help them along the way. [LoopBack SDK Builder for Angular2](https://github.com/mean-expert-official/loopback-sdk-builder) is a good example of such community-maintained SDK. If you would like to start or join such community effort for a React 4 SDK, then please leave a comment in [GitHub issue #509](https://github.com/strongloop/loopback-next/issues/509) and consider joining the list of our contributors via [GitHub issue #110](https://github.com/strongloop/loopback-next/issues/110).

> Also, right now I'm using slc and strong-pm to manage the backend server and push updates, since we're too small to afford IBM's platform (and we aren't an API as a service company, so the pricing structure based on API calls doesn't work at all). I hope there will continue to be an open source way to manage our own processes in the future.

As strong-pm's [documentation](https://docs.strongloop.com/display/SLC/Operating+Node+applications) mentions, StrongLoop Arc and slc are no longer under active development, and will soon be deprecated. I understand that IBM's offering may not fit your particular needs, in which case you may find [pm2](http://pm2.keymetrics.io/) or [forever](https://www.npmjs.com/package/forever) as reasonable alternatives for supervising and managing your Node.js processes in production. See StrongLoop's comparison page to better understand the pros and cons of each solution: [http://strong-pm.io/compare/](http://strong-pm.io/compare/)

On the other hand, speaking from my experience, many users are abandoning Node.js-specific process managers/supervisors these days and switching to Docker-powered alternatives like [Docker Swarm](https://docs.docker.com/engine/swarm/), [Istio](https://istio.io/) or [Kubernetes](https://kubernetes.io/). With Docker, each image instance runs a single Node.js process only, and the Docker orchestration tool is responsible for managing individual instances, thus replacing the functionality of Node.js-specific process managers.

For application monitoring, I recommend replacing StrongLoop's strong-agent with IBM's free alternative called [appmetrics](https://www.npmjs.com/package/appmetrics). If you decide to replace strong-pm with pm2, then you may have good results with [keymetrics](https://keymetrics.io/), as it is tightly integrated with pm2.

If you are using StrongLoop Arc to build and deploy new versions of your application, then you can always switch to the lower-level tools used by Arc under the hood: [strong-build](https://www.npmjs.com/package/strong-build) for bundling your application for publishing and [strong-deploy](https://www.npmjs.com/package/strong-deploy) for deploying the output of strong-build to strong-pm.

> P.S. There is one bug I've never been able to figure out... a "callback has already been called" error that I seem unable to trace in any way or recreate consistently. It seems to randomly occur once every minute or so in the logs on production only... Do you have any advice how to possibly trace it? It doesn't really hurt anything as far as I can tell, but it clutters up the log file.

In general, this happens when one function invocation calls the callback argument multiple times. For example, it can happen when you install multiple even listeners that eventually call the callback. Let's say you listen for both "close" and "error" events and both events are fired, therefore triggering the callback two times. Another common source of this situation is when you forget to return early from your function after calling a callback:

```js
function doSomething(options, cb) {
  if (options.skip) {
    cb(); // missing return
  }
  cb(null, 'some data');
}

doSomething({skip: true}, (err, data) => console.log('cb', err, data));
// prints:
// cb undefined undefined
// cb null some data
```

There are many ways how you can end up in "callback has already been called" situation, so it's hard for me to help you more without seeing the specific error message text. (I was not able to find "callback has already been called" anywhere in the source code of loopback and its dependencies.)

In general, it's best to ask this kind of question on [GitHub](https://github.com/strongloop/loopback/issues/new), [Gitter](https://gitter.im/strongloop/loopback) or [StackOverflow](https://stackoverflow.com/questions/tagged/loopbackjs), as these resources are better suited for troubleshooting.

## What's next?

If you haven't already checked out the [Developer Preview release](https://strongloop.com/strongblog/loopback-4-developer-preview-release), it is just the first milestone of our LoopBack 4 journey. A tentative plan is outlined at [https://github.com/strongloop/loopback-next/wiki/Upcoming-Releases](https://github.com/strongloop/loopback-next/wiki/Upcoming-Releases). Please note that it is not an official commitment and subject to adjustment as we make progress with the community contributions and feedbacks.

* [Cast your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
* [Report issues](https://github.com/strongloop/loopback-next/issues)
* [Build more extensions](https://github.com/strongloop/loopback-next/issues/647)
* [Help each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)
