---
layout: post
title: Enriching LoopBack and its Community - You are Invited!
date: 2020-08-27
author:
  - Raymond Feng
  - Miroslav Bajtoš
  - Diana Lau
permalink: /strongblog/2020-community-contribution/
categories:
  - Community
  - LoopBack
published: true
---

Almost two years ago, [LoopBack 4 was released and announced](https://strongloop.com/strongblog/loopback-4-ga) at Node+JS Interactive event. Thanks to your support, we now have over 110k downloads per month on npmjs.com and over 3000 GitHub stars on the [loopback-next repo](https://github.com/strongloop/loopback-next). Recently, we created the [LoopBack Slack community](https://join.slack.com/t/loopbackio/shared_invite/zt-8lbow73r-SKAKz61Vdao~_rGf91pcsw) to provide a platform for the community and us helping each other. We are glad to see an increasing engagement in that front as well!

With the core of the framework maturing and contributions shifting to the LoopBack extensions, we think LoopBack has entered a new stage and it's time to revisit our approach to planning work, delivering features, fixing bugs, and improving documentation.

<!--more-->

## A Short History of LoopBack 4

As we started the rewrite of LoopBack from ground up back in early 2017 (see the [kick-off post](https://strongloop.com/strongblog/announcing-loopback-next/)), it quickly became clear the scope is huge and we must be very disciplined in planning and scoping features if we want to reach a meaningful release in a reasonable time. We were working in short iterations, burning through a backlog of tasks we identified as required for the initial release. Eventually we published the first [Developer Preview](https://strongloop.com/strongblog/loopback-4-developer-preview-release) in November 2017, followed by more preview releases, until we finally released [LoopBack 4 GA](https://strongloop.com/strongblog/loopback-4-ga) in October 2018. Keeping a tight control over backlog prioritization and milestone planning allowed us to achieve this great milestone.

Such a tight planning worked great while it was mostly the IBM core team working on the project. On the flip side, this process made it sometimes difficult to juggle our time between working on our roadmap vs helping community contributors; and often created the impression that the core team will eventually implement all missing features, given enough time, and community contributions are not really necessary. This was acceptable while the framework offered only a limited subset of features needed to build real applications, because there were only few early adopters to support and it was indeed the core team that was contributing most of the improvements.

As more and more users discover and try LoopBack, they may find feature gaps, identify bugs, or even come up great ideas. If the perception is that somebody else (the core team) will eventually implement those features, then there are little incentives for users to step up and join the project as contributors. As a result, the number of maintainers is not keeping up with the growing number of users, leading to ever-increasing load on existing maintainers and eventually maintainers burning out or leaving the project. (You can read more on this topic in [Healthy Open Source](https://medium.com/the-node-js-collection/healthy-open-source-967fa8be7951) and [Sustaining and growing LoopBack as a successful open source project](https://medium.com/loopback/sustaining-loopback-project-b67fd59673e4)).

Many of us has experienced this ourselves in the past, when LoopBack 3 got to the stage where the maintainers were overwhelmed with the amount of incoming issues and pull requests. We feel it's time to turn the ship around and make sure we don't repeat the same mistakes in LoopBack 4. As LoopBack 4 user base grows, it is essential to grow our contributor community joining forces to enhance the framework together.

## Encourage More Community Contributions

We have been always actively looking for new ways to attract more contributions from our community and grow contributors into maintainers.

To make it easy for our users to find easy-to-implement improvements to contribute, we are adding `good first issue` and `help wanted` labels on GitHub issues, and listing items we'd like to see progress in our roadmaps and milestones.

In addition, we recently made [an announcement](https://strongloop.com/strongblog/switching-to-dco/) about switching the contribution method to Developer Certificate of Origin (DCO) from Contributor License Agreement (CLA). We hope this will make the contribution process easier for you.

Going forward, we would like to focus more on enabling more of you to contribute by mentoring and coaching them to complete their PRs and providing technical guidance on their work if needed. We would also like to create more examples and starter code for experimental features, and invite the community to enhance those features collectively.

To further encourage community contributions, we are going to open our planning process too and start building the roadmap together with our community, based on what tasks individual contributors would like to work on.

## Inspire More Community Extensions

One of the strengths of LoopBack 4 is its extensibility. You can create extensions to extend the programming model and integration capability of the LoopBack 4 framework.

We created a number of extensions, for example, the recently published [TypeORM](https://github.com/strongloop/loopback-next/tree/master/extensions/typeorm) and [pooling service](https://github.com/strongloop/loopback-next/tree/master/extensions/pooling) extensions. These can be served as references to inspire you to build extensions to fit your needs. 

Moreover, we'll be working on [cleaning up the extension template and documentation](https://github.com/strongloop/loopback-next/issues/5336), so that the developer experience of building an extension is smoother.

At the same time, we're happy to see more extensions built by the community, see the [community extensions page](https://loopback.io/doc/en/lb4/Community-extensions.html). Let's build this list together by submitting a PR to include your extensions!

## Potential Work under Our Radar

We have been investigating a few areas that can further improve LoopBack 4 based on our visions, even more importantly community feedbacks. There are some ideas for inspiration.

Modernizing the juggler has been under our radar. We would like to position LoopBack as the composition layer that brings API/microservice stories together. It will include built-in capabilities such as REST API and Data/Service access as well as integration with other frameworks. We're planning to publish a blog to cover that. Stay tuned.

Below are areas that we've done some initial investigation/implementation and would like to invite you to join us to build a more complete story. It includes continuing to improve our documentation and building more education materials. Likewise, we'll be publishing blog posts to share our plans and visions in the following areas:

- [Multi-tenancy](https://github.com/strongloop/loopback-next/tree/master/examples/multi-tenancy)
- [Web socket](https://github.com/raymondfeng/loopback4-example-websocket)
- [Kafka integration](https://github.com/strongloop/loopback4-example-kafka)
- [GraphQL](https://github.com/strongloop/loopback-next/pull/5545)
- [gRPC](https://github.com/strongloop/loopback-next/pull/6134)


## Conclusion

Your contribution is important to make LoopBack a sustainable open source project. We hope our plans to adopt DCO, improve the extension development experience and focus on enabling contributors would make your contribution experience smoother and better. We are also planning on sharing our views on a few technologies. 

Here is what you can do:
- [Join LoopBack Slack community](https://join.slack.com/t/loopbackio/shared_invite/zt-8lbow73r-SKAKz61Vdao~_rGf91pcsw)
- [Look for first-contribution-friendly issues](https://github.com/strongloop/loopback-next/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
- Give us feedback and join our discussion in [our GitHub repo](https://github.com/strongloop/loopback-next)

Let's make LoopBack a better framework together!
