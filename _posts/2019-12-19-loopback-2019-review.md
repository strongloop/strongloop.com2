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

Read on for a very thorough trip down 2019 memory lane!  

<!--more-->

### GitHub Activity and Downloads 

2019 began with LoopBack having just moved past the [12,000 star count](https://github.com/strongloop/loopback) and [LoopBack 4](https://github.com/strongloop/loopback-next) at more than 1260. A year later, the numbers are at ----- , an increase of !

- Download numbers on npmjs.com https://npm-stat.com/charts.html?package=@loopback/core

With all of this activity, we weren't surprised to see LoopBack downloads continue to grow. 

2018 
There were  approximately 1.5 millions downloads for LoopBack 2 and lb3 throughout 2018 - a 21% increase from 2017. We also saw a big increase for LoopBack 4 at 115,000 downlaods - 13 times more than last year. 


- update numbers on 2019 downloads 
- LoopBack 2 and lb3 
- LoopBack 4 

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

--

Experimenting with Plain JavaScript Programming in LoopBack 4 by Hage Yaapa  
https://strongloop.com/strongblog/loopback4-javascript-experience/
We believe that TypeScript is the right move and it will help you and us in the long run. However, some developers are constrained to use plain JavaScript at the moment for various reasons. We didn’t want to leave our JavaScript users behind and decided to explore the possibilities of creating a JavaScript interface to LoopBack 4. This blog post is about what we did in that regard and what we will be doing next.

--

What's New in LoopBack 4 Authentication 2.0 by Dominique Emond 
https://strongloop.com/strongblog/loopback-4-authentication-updates/
We’ve refactored the authentication component to be more extensible and easier to use.

Now you can secure your endpoints with both passport-based and LoopBack native authentication strategies that implement the interface AuthenticationStrategy.

The new design greatly simplifies the effort of application developers and extension developers since they now only need to focus on binding strategies to the application without having to understand/modify the strategy resolver or the action provider.

--

LoopBack 4 Offers Inclusion of Related Models by Agnes Lin 
LoopBack 4 now offers a new feature: inclusion of related models! This addition not only simplifies querying data in LoopBack 4, but since we have similar features in LoopBack 3 it also closes one feature gap between LoopBack 3 as well. 
https://strongloop.com/strongblog/inclusion-of-related-models/



### The LoopBack 4 Web Site Updates

The [LoopBack](https://loopback.io/) web site was changed from the LoopBack 3 look feel to the LB4 theme that was launched previously.

The team also refreshed the "Who's using LoopBack" section and added more testimonial from the users. If your company wants to be highlighted as the LoopBack user on our web site, please see [strongloop/loopback-next#3047](https://github.com/strongloop/loopback-next/issues/3047) for details.

---- Personally, I'd consider the docs updates are development accomplishments.

### Increased Transparency with Milestone Updates
<!--INPUT?-->

We would like to provide more visibility to you (our users) on what we have accomplished and our plans, so we started to create blog posts to keep everyone up-to-date. We always welcome feedback!

- milestone github issues to show our plan for the month (github ticket with "Monthly Milestone" label: https://github.com/strongloop/loopback-next/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+label%3A%22Monthly+Milestone%22+
    
- Monthly milestone and quarter summaries on what we have accomplished (strongloop.com/strongblog)
to go even further, we start our planning on milestone and quarterly roadmap in pull requests. Look for pull requests with "Monthly Milestone" and "Roadmap" labels.


--
Increased transparency to our users (I beleive Diana and I chatted about this?)
So that they have more ideas on what we’re doing.
- Monthly milestones to show what changes/enhancements we’ve added to the framework
- Milestone tickets - to show our plans for the month. https://github.com/strongloop/loopback-next/issues?q=is%3Aissue+is%3Aopen+milestone+label%3A%22Monthly+Milestone%22. (With “monthly milestone” label in GitHub
- Quarterly update
- Roadmap. Begin with a PR and visible in https://github.com/strongloop/loopback-next/blob/master/docs/ROADMAP.md

### Events and Community Outreach

While the LoopBack team is generally quite usy working on the framework, they also managed to join some events throughout the year!

- developerWeek in Feb - Raymond https://developerweek2019.sched.com/speaker/raymond_feng.1yyfcnn4

- Meetup in Toronto - https://strongloop.com/strongblog/watch-meetup-quickly-build-apis-with-loopback/
The Toronto Cloud Integration Meetup hosted an event in February with the overall topic "Quickly Build APIs with Existing Services and Data Using LoopBack!” Janny Hou explained what LoopBack is, what you can do with it, and the rationale behind the rewrite of the framework. Biniam Admikew demonstrated how how easy it is to expose REST API from your database with just a few steps. Jamil Spain provided an additional demo while also taking care of capturing the meetup on video. Check out the details and video [here](https://strongloop.com/strongblog/watch-meetup-quickly-build-apis-with-loopback/).


- LoopBack QuickLab - Code@THINK. https://www.ibm.com/events/think/code/, NodeConf.eu and will be at Node+JSInteractive.

- Meetup in California - Raymond’s talk https://strongloop.com/strongblog/hackerjs-meetup-may-8/

- TechConnect (internal IBM event at the Canada Lab in Markham) - May 2019


Raymond also presented at a meetup in Santa Clara in May. "Building APIs at Warp Speed with LoopBack "

As mentioned earlier, Raymond Feng attended the 2019 API Awards Ceremony during API World 2019, in October to accept the 2019 API Award for the “Best in API Middleware” category.  

In November, the LoopBack team attended CASCONxEVOKE. As one of Canada’s largest combined academic, research and developer conferences, it offered over 150 speakers to over 1,500 attendees. Diana Lau provided an overview of the LoopBack booth and a workshop. Learn more [here](https://strongloop.com/strongblog/cascon-evoke-2019/).
- CASCONxEVOKE  https://strongloop.com/strongblog/cascon-evoke-2019/ 
   - Workshop: https://pheedloop.com/cascon/site/sessions/?id=OhNsKW
    - CASCON Expo: https://pheedloop.com/cascon/site/sessions/?id=DugCzZ




### LoopBack 3 LTS Support

In March, the LoopBack team announced LoopBack 3 was receiving an extended long term support to provide more time for users to move to the new version which is a different programming model and language. The revised LTS start is December 2019 and the revised end of life is December 2020.

Check out the timeline and some frequently asked questions [here](https://strongloop.com/strongblog/lb3-extended-lts/).

### More LoopBack How-To Content

Diana Lau Learning LoopBack 4 Interceptors (Part 1) - Global Interceptors
Interceptors are reusable functions to provide aspect-oriented logic around method invocations. 
Seems pretty useful, right? There are 3 levels of interceptors: global, class level and method level. In this article, we are going to look into what a global interceptor is and how to use it.
https://strongloop.com/strongblog/loopback4-interceptors-part1/

Learning LoopBack 4 Interceptors (Part 2) - Method Level and Class Level Interceptors
we are going to build an application that validates the incoming request using class level and method level interceptors 
plus resources
https://strongloop.com/strongblog/loopback4-interceptors-part2/

Import LoopBack 3 Models into a LoopBack 4 Project by Miroslav Bajtoš announce a preview version of a tool automating migration of models from LoopBack 3 to LoopBack 4:
lb4 import-lb3-models
he demos it
https://strongloop.com/strongblog/import-loopback-3-models-to-loopback-4/

In "Migrating from LoopBack 3 to LoopBack 4", by Nora Abdelgadir shared a way to mount your LoopBack 3 applications in a LoopBack 4 project. You can read about it [here](https://strongloop.com/strongblog/migrate-from-loopback-3-to-loopback-4/).

Wenbo Sun provided a 7-part series called "Building an Online Game With LoopBack 4"
The main purpose of this series is to help you learn LoopBack 4 and how to use it to easily build your own API and web project. We’ll do so by creating a new project I’m working on: an online web text-based adventure game.
https://strongloop.com/strongblog/building-online-game-with-loopback-4-pt1/

### 2020 Vision

Migration: strongloop/loopback-next#1849

We have started the migration guide work this year and will continue to be the focus. We'd also like to add some tooling around migration to make the migration process from LB3 to LB4 easier. If you have existing LoopBack 3 application, take a look at our migration guide and gives us feedback!

work on feature parity that is needed for LB3 to LB4 migration

Developer experience to make our users' life easier

we would like to take some time in each milestone to address some of the pain points that users mentioned.

documentation: add docs that users usually ask questions, make sure the docs are up-to-date given the code base is changing fast.

Innovation around:
cloud native deployment
database integration
messaging/event driven style APIs

### Anything Else?

For a truly open and detailed runthrough of work on LoopBack, the best resource is the monthly milestone updates. The LoopBack team outlined their progress with these updates, often explaining hurdles or rationale for changes and tweaks. Check them out below:

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

### What's Next?

With all of this LoopBack news and updates, you can see 2019 was another busy year for the team. If you haven't already, we recommend you started with [LoopBack 4](https://loopback.io/getting-started.html)! 
