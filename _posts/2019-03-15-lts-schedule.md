---
layout: post
title: LoopBack 3 Receives Extended Long Term Support
date: 2019-03-15
author:
  - Diana Lau
  - Miroslav Bajtoš
permalink: /strongblog/lb3-extended-lts/
categories:
- Community
- LoopBack
published: false
---

Back in October last year, we announced LoopBack 4 GA is ready for production use and updated the Long Term Support (LTS) schedule in our [LTS page](https://loopback.io/doc/en/contrib/Long-term-support.html). Due to popular requests, LoopBack 3 now receives an extended long term support with updated timeline as shown in the table below.

Version | Status | Published | Active LTS Start | Maintenance LTS Start | End-of-life 
-- | -- | -- | -- | -- | --
LoopBack 4 | Current | Oct 2018 | -- | -- | Apr 2021(minimum) 
LoopBack 3 | Active LTS | Dec 2016 | Oct 2018 | Dec 2019 (revised) | Dec 2020 (revised)
LoopBack 2 | Maintenance LTS | Jul 2014 | Dec 2016 | Oct 2018 | Apr 2019

<!--more-->

The extended period gives more time for our users to move to the new version which is a different programming model and language.  It also allows us to improve the migration experience and migration guide.

Below are a few questions that our users frequently asked about different versions of LoopBack. 

### If I'm starting a new project, what should I do?
If you're considering to use LoopBack as your next project, our recommendation is to first create a proof-of-concept application using LoopBack 4 (LB4). You may want to check if there are any features that your application requires but LB4 does not provide out of the box yet. Search [LB4 GitHub issues](https://github.com/strongloop/loopback-next/issues) to find any existing discussions around those missing features, there may be 3rd-party extensions or workaround available. If you run into a missing feature that's not discussed in our issue tracker yet, then please [open a new issue](https://github.com/strongloop/loopback-next/issues/new) to let us know! 

Hopefully, you will find a way how to implement all major requirements in your PoC application and thus can build your project on LB4. 

If some of your requirements cannot be feasibly implemented in LB4, then you have two options:
1. You can work with the LoopBack team and contribute the missing parts yourself. It will cost you time to implement framework features, but you will save time on migrating your project from LB3 to LB4 later on. 
2. Alternatively, if LB3 provides all what your project needs, then you can save upfront investment and build your project on LB3 now, preparing to pay the migration costs later in the future.

### If I'm a LoopBack 3 user, what should I do?
If you already have LoopBack 3 applications running in production, it is a good time for you to review the [difference between LoopBack 3 and LoopBack 4](https://loopback.io/doc/en/lb4/LoopBack-3.x.html). Even with the extended end-of-life date for LoopBack 3, it is never too early to start migrating your LoopBack 3 application to LoopBack 4. Please also note  the [feature parity gap we had identified](https://github.com/strongloop/loopback-next/issues/1920). Your feedback is always appreciated! 

We're actively working on improving the migration story, please check out [GitHub issue #1849](https://github.com/strongloop/loopback-next/issues/1849) for discussions and progress. [Miroslav](https://strongloop.com/authors/Miroslav_Bajto%C5%A1/) is currently investigating different approaches of having a compatibility layer between LoopBack 3 and LoopBack 4 artifacts. The first step is to allow developers to mount their LoopBack 3 applications in a new LoopBack 4 project, you can follow the progress of this work in [GitHub issue #2479](https://github.com/strongloop/loopback-next/issues/2479).

### If I'm a LoopBack 2 user, what should I do? 
If you're a LoopBack 2 user, you should at least migrate your LoopBack 2 applications to LoopBack 3. The effort should be minimal and the process should be smooth. You can read more details in the [3.0 migration guide](https://loopback.io/doc/en/lb3/Migrating-to-3.0.html). When LB2 goes end of life (EOL), you should not be using LB2 in production because there will be no security fixes.

## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Reporting issues](https://github.com/strongloop/loopback-next/issues).
- [Contributing](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md)
  code and documentation.
- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
