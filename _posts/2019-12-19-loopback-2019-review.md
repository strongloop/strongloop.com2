---
title: LoopBack 2019 Year in Review
date: 2019-12-19
author: Dave Whiteley
permalink: /strongblog/loopback-2019-review/
categories:
  - Community
  - LoopBack
published: false
---

As 2019 draws to a close, we're following our annual tradition of looking at the hard work that the [LoopBack](http://loopback.io/) team has achieved in the past year. As you might expect, working on LoopBack 4 was the main focus, with some events, updates and "how to" content adding flavour to the mix. That focus has resulted in a lot of improvements and features for the framework, as well as quality interaction with the LoopBack community. 

Grab yourself your seasonal beverage of choice, whether hot or cold, and read on for a down 2019 memory lane!  

<!--more-->

### TO UPDATE: GitHub Activity and Downloads 

2019 began with LoopBack having just moved past the 12,000 star count and wrapped up the year at more than [13k](https://github.com/strongloop/loopback). LoopBack 4 began the year at more than 1260 and pratcically doubled it by year's end at more than [2400](https://github.com/strongloop/loopback-next). Meanwhile, [npmjs.com](https://npm-stat.com/charts.html?package=@loopback/core) shows there were 441,619 downloads in the last year. We're excited to see all of this activity as LoopBack downloads continue to grow. 


2018: 141,948
2019: 432,860

2018 downloads =	425,016
@loopback/core	574,808

### LoopBack, Winner of 2019 API Award for API Middleware

Congratulations again to LoopBack for earning the 2019 API Award for the “[Best in API Middleware](https://strongloop.com/strongblog/loopback-2019-api-award-api-middleware/)” category. These awards were presented at the 2019 API Awards Ceremony during API World 2019, celebrating the technical innovation, adoption, and reception in the API & Microservices industries and use by a global developer community. Raymond Feng, co-creator and architect for LoopBack, presented the team to receive the award.

Well done, LoopBack team!

### LoopBack 4 Features and Previews

With the team focusing so much on enhancing and imporving LoopBack 4, there were a lot of updates. In terms of the features, here are the highlights:

- Authentication & Authorization
  - Basic support for authentication and authorization. The team released a new major version of @loopback/authentication, and a new @loopback/security layer.
  - [Authentication docs](https://loopback.io/doc/en/lb4/Loopback-component-authentication.html).
  - [Authorization docs](https://loopback.io/doc/en/lb4/Loopback-component-authorization.html).

- Model relations      
  - The team added [hasOne relation https](https://loopback.io/doc/en/lb4/hasOne-relation.html).
  - The tema completed the MVP for the "[inclusion of related models](https://strongloop.com/strongblog/inclusion-of-related-models/)" story. 

- Architectural improvements
  - [Interceptors](https://loopback.io/doc/en/lb4/Interceptors.html).
  - [lifecycle events](https://loopback.io/doc/en/lb4/Life-cycle.html).
  - Enhancement in extension/extension points.

- Going Cloud Native https://strongloop.com/strongblog/going-cloud-native-with-loopback-4/
  - Added to Appsody/Kabanero application stack.
  - Deployment guide to Kubernetes clusters.
  - Adding observability in microservices, e.g. added health/metrics/tracing features.

- Migration / Migration guide
  - [Migration guide](https://loopback.io/doc/en/lb4/migration-overview.html).
  - [Added tooling to import LB3 models](https://strongloop.com/strongblog/import-loopback-3-models-to-loopback-4/).

- Strengthen the core modules as a platform for building large-scale Node.js projects
  - Get the details in the [tutorial series](https://loopback.io/doc/en/lb4/core-tutorial.html).

- Enhancements in connectors
  - Support partitioned database in [cloudant connector](https://github.com/strongloop/loopback-connector-cloudant/blob/master/doc/partitioned-db.md).
  - Support decimal128 type in mongodb connector.

- Update Example Shopping app to showcase the features we’ve added

- Experimenting with Plain javascript programming in LoopBack 4: https://strongloop.com/strongblog/loopback4-javascript-experience/

- Improvement in documentation

- Enabled Node.js 12 support, Added latest TypeScript 3.7 support, switch to ESLint, etc.

Want a bit more detail on some updates? Check out "[Experimenting with Plain JavaScript Programming in LoopBack 4](https://strongloop.com/strongblog/loopback4-javascript-experience/)" by Hage Yaapa (which looks at functionality following a spike to enable LoopBack 4 development using JavaScript), "[What's New in LoopBack 4 Authentication 2.0](https://strongloop.com/strongblog/loopback-4-authentication-updates/) by Dominique Emond, and "[LoopBack 4 Offers Inclusion of Related Models](https://strongloop.com/strongblog/inclusion-of-related-models/)" by Agnes Lin. 

### The LoopBack 4 Web Site Updates

The [LoopBack](https://loopback.io/) web site was changed from the LoopBack 3 look feel to the LB4 theme that was launched previously.

The team also refreshed the "Who's using LoopBack" section and added more testimonial from the users. If your company wants to be highlighted as the LoopBack user on our web site, please see [strongloop/loopback-next#3047](https://github.com/strongloop/loopback-next/issues/3047) for details.

### Increased Transparency with Milestone Updates

We would like to provide more visibility to you (our users) on what we have accomplished and our plans, so we started to create blog posts to keep everyone up-to-date. We always welcome feedback!

- Milestone github issues to show our plan for the month (github ticket with ["Monthly Milestone" label](https://github.com/strongloop/loopback-next/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+label%3A%22Monthly+Milestone%22+).
    
- Monthly milestone and quarter summaries on what we have accomplished (you can see a summary of what we posted in 2019 further into this post).

- To go even further, we start our planning on milestone and a quarterly [roadmap](https://github.com/strongloop/loopback-next/blob/master/docs/ROADMAP.md) in pull requests. Look for pull requests with "Monthly Milestone" and "Roadmap" labels.

### Events and Community Outreach

The LoopBack team managed to join some events throughout the year!

DEVELOPERWEEK 2019 ran from February 20-24, and LoopBack architect [Raymond Feng](https://developerweek2019.sched.com/speaker/raymond_feng.1yyfcnn4) covered "Speed and Scale: Building APIs with Node.js, TypeScript and LoopBack."

The Toronto Cloud Integration Meetup group held a [Meetup in Toronto](https://strongloop.com/strongblog/watch-meetup-quickly-build-apis-with-loopback/) in February with the topic "Quickly Build APIs with Existing Services and Data Using LoopBack!” Janny Hou explained what LoopBack is, what you can do with it, and the rationale behind the rewrite of the framework. Biniam Admikew demonstrated how how easy it is to expose REST API from your database with just a few steps. Jamil Spain provided an additional demo while also taking care of capturing the meetup on video. Check out the details and video [here](https://strongloop.com/strongblog/watch-meetup-quickly-build-apis-with-loopback/).

- LoopBack QuickLab - Code@THINK. https://www.ibm.com/events/think/code/, NodeConf.eu and will be at Node+JSInteractive.

- [HackerJS Meetup](https://strongloop.com/strongblog/hackerjs-meetup-may-8/) in California. Raymond Feng shared his cotent from DEVELOPER WEEK 2019 with this meetup group.

- TechConnect (internal IBM event at the Canada Lab in Markham) - May 2019

Raymond also presented at a meetup in Santa Clara in May. "Building APIs at Warp Speed with LoopBack "

As mentioned earlier, Raymond Feng attended the 2019 API Awards Ceremony during API World 2019, in October to accept the 2019 API Award for the “Best in API Middleware” category.  

In November, the LoopBack team attended CASCONxEVOKE. As one of Canada’s largest combined academic, research and developer conferences, it offered over 150 speakers to over 1,500 attendees. Diana Lau provided an overview of the LoopBack booth and a workshop. Learn more [here](https://strongloop.com/strongblog/cascon-evoke-2019/).

### LoopBack 3 LTS Support

In March, the LoopBack team announced LoopBack 3 was receiving an extended long term support to provide more time for users to move to the new version which is a different programming model and language. The revised LTS start is December 2019 and the revised end of life is December 2020.

Check out the timeline and some frequently asked questions [here](https://strongloop.com/strongblog/lb3-extended-lts/).

### More LoopBack How-To Content

While much of their focus was on improving LoopBack 4, the team also shared insight into using the framework as well. Here's a look back!

Diana Lau shared a two part series about learning LoopBack 4 Interceptors. In the first part she looked at [Global Interceptors](https://strongloop.com/strongblog/loopback4-interceptors-part1/), what they are and how to use them. In Part 2 she looked at [Method Level and Class Level Interceptors](https://strongloop.com/strongblog/loopback4-interceptors-part2/),
building an application that validates the incoming request using class level and method level interceptors. 

Miroslav Bajtoš announced and demonstrated preview version of a tool automating migration of models from LoopBack 3 to LoopBack 4. Check it out [here](https://strongloop.com/strongblog/import-loopback-3-models-to-loopback-4/). In a simialr vein, Nora Abdelgadir shared a way to mount your LoopBack 3 applications in a LoopBack 4 project in ["Migrating from LoopBack 3 to LoopBack 4"](https://strongloop.com/strongblog/migrate-from-loopback-3-to-loopback-4/).

Wenbo Sun provided a 7-part series called "Building an Online Game With LoopBack 4". The aim of the series is to help you learn LoopBack 4 and how to use it to easily build your own API and web project. Wenbo did so by highlighting a new project he was working on: an online web text-based adventure game. Check teh series out [here](https://strongloop.com/strongblog/building-online-game-with-loopback-4-pt1/).

### Anything Else?

For more details about work on LoopBack, the best resource is the monthly milestone updates. The LoopBack team outlined their progress with these updates, often explaining hurdles or rationale for changes and tweaks. Check them out below:

- [January 2019 Milestone Update](https://strongloop.com/strongblog/january-2019-milestone/)
- [February 2019 Milestone Update](https://strongloop.com/strongblog/february-2019-milestone/)
- [March 2019 Milestone Update](https://strongloop.com/strongblog/march-2019-milestone/)
- [April 2019 Milestone Update](https://strongloop.com/strongblog/april-2019-milestone/)
- [May 2019 Milestone Update](https://strongloop.com/strongblog/may-2019-milestone/)
- [June 2019 Milestone Update](https://strongloop.com/strongblog/june-2019-milestone/)
- [July 2019 Milestone Update](https://strongloop.com/strongblog/july-2019-milestone/)
- [August 2019 Milestone Update](https://strongloop.com/strongblog/august-2019-milestone/)
- [September 2019 Milestone Update](https://strongloop.com/strongblog/september-2019-milestone/)
- [October 2019 Milestone Update](https://strongloop.com/strongblog/october-2019-milestone/)
- [November 2019 Milestone Update](https://strongloop.com/strongblog/november-2019-milestone/)
- December 2019 Milestone Update - coming soon!

You can also follow LoopBack's progress throughout the year in the [LoopBack 4 2019 Q1 Overview](https://strongloop.com/strongblog/loopback-4-2019-q1-overview/), [LoopBack 4 2019 Q2 Overview](https://strongloop.com/strongblog/loopback-4-2019-q2-overview/), and [LoopBack 4 2019 Q3 Overview](https://strongloop.com/strongblog/loopback-4-2019-q3-overview/).

### What's Next? 2020 Vision

[Migration guide work](https://github.com/strongloop/loopback-next/issues/1849) began this year and it will continue to be the focus. The goal is to add some tooling around migration to make the migration process from LB3 to LB4 easier. If you have an existing LoopBack 3 application, take a look at the migration guide and gives us feedback!

The LB team will also work on feature parity that is needed for LB3 to LB4 migration, and the developer experience to make users' lives easier. They would like to take some time in each milestone to address some of the pain points that users mentioned. The team is also looking at innovating cloud native deployment, database integration, as well as messaging/event driven style APIs.

Finally, look for improved documentation that address user questions, and more up-to-date docs that better reflect the quickly-changing code base.

Keep an eye out to see the developments in the new year!
