---
title: LoopBack 2017 Year in Review
date: 2017-12-19T01:00:13+00:00
author: Dave Whiteley
permalink: /strongblog/loopback-2017-review/
categories:
  - Community
  - LoopBack

---

As 2017 draws to a close, we’re reflecting on the evolution of StrongLoop and [LoopBack](http://loopback.io/) in the past twelve months. It's been a big year for our open-source Node.js framework. It started with the introduction of the LoopBack CLI and ended with the LoopBack 4 developer preview release and a request for feedback on a new LoopBack logo - and there was a lot of activity in between! We invite you to join us as we take a look at how things progressed for LoopBack in 2017. There's a lot to take in, so we invite you to top up your beverage of choice before you begin!
 
## Continuing to Add to LoopBack

In the early days of StrongLoop, the team released slc to build and manage Node applications. Since joining IBM, the StrongLoop team integrated LoopBack’s API creation tooling with IBM’s existing API management options. With the two combined, [LoopBack was given its own CLI](https://strongloop.com/strongblog/announcing-the-loopback-cli/) in January.

January also saw the release of a new open-source LoopBack module called [strong-soap](https://strongloop.com/strongblog/strong-soap-loopback-module/) to go along with the LoopBack 3.0 release. Created by Rashmi Hunt, the module provides a comprehensive SOAP client for invoking web services as well as a mock-up SOAP server capability to create and test your web service. 

## Introducing LoopBack.next

In April, [Ritchie Martori](https://github.com/ritch) announced [LoopBack.next](https://strongloop.com/strongblog/announcing-loopback-next/). Recognizing that LoopBack’s core code made it difficult to add certain features and tough to gain new contributors, the LoopBack team had one goal with the next version of LoopBack: a new and highly-extensible core that would be small, powerful, and fast. Martori talked about LoopBack.next, saying:

“This new core will allow us to greatly improve the LoopBack developer experience. On top of the core, we’re working on adding better tooling, new integrations with OpenAPI (Swagger), and making significant performance improvements to routing.
The basic goal of LoopBack remains the same: to make it easy to build apps that use new or existing data. With LoopBack.next, our goal is to take the solid foundation of LoopBack and make it effortlessly extensible.” 

## More LoopBack Improvements and How-To Content

Even as the StrongLoop team focused on the next version of LoopBack, improvements for the existing version of LoopBack still emerged in spring and summer. 

*	[Tetsuo Seto](https://github.com/Setogit) let everyone know about [LoopBack’s new Cassandra Connector](https://strongloop.com/strongblog/cassandra-connector-has-arrived/) in April, delivering on requests from the LoopBack community. He followed up with an explanation of how to use corresponding source code blocks to help make your LoopBack app interact with [Cassandra Materialized Views](https://strongloop.com/strongblog/cassandra-materialized-view/).

*	In May [Rashmi Hunt](https://github.com/rashmihunt) introduced a new LoopBack feature: the ability to [generate remote methods and REST APIs for SOAP web services](https://strongloop.com/strongblog/building-enterprise-apis-for-soap-web-services-using-loopback). As Rashmi described, this allows creation of REST APIs that invoke web services easily, even if you haven’t mastered the web service.

* Also in May, [Loay Gewily](https://github.com/loay) and [Janny Hou](https://github.com/jannyHou) shared details about [refactoring LoopBack SQL Connectors](https://strongloop.com/strongblog/refactoring-loopback-sql-connectors/) and the changes to Model Discovery and Migration. 

We also shared many informative “how to” posts and tutorials during this time. These included:

*	[Nagarjuna Surabathina](https://github.com/Nagarjuna-S) demonstrated creating a [multi-tenant Connector Microservice](https://strongloop.com/strongblog/creating-a-multi-tenant-connector-microservice-using-loopback/) using LoopBack. 

* Nagarjuna joined forces with Subramanian Krishnan to write about using [OpenWhisk for LoopBack As A Service](https://strongloop.com/strongblog/loopback-as-a-service-using-openwhisk/)
and [LoopBack as an Event Publisher](https://strongloop.com/strongblog/loopback-as-an-event-publisher/).

*	Sequioa McDowell announced his Open Source [LoopBack JSONSchemas VS Code Extension](https://strongloop.com/strongblog/announcing-loopback-jsonschemas-vs-code-extension/), a tool that pushes the documentation to you while you code. The result? You can avoid typos, find configuration errors early, and learn baout useful features.

*	[Raymond Camden](https://github.com/cfjedimaster) explained how to [integrate LoopBack with ElasticSearch](https://strongloop.com/strongblog/integrating-loopback-with-elasticsearch/) as well as how to [build a Vue.js application with LoopBack](https://strongloop.com/strongblog/vuejs-and-loopback/) as the back end. 

*	[David Okun](https://github.com/dokun1) told us how he used LoopBack to build the Open Source Game [Xtra Points](https://strongloop.com/strongblog/loopback-open-source-xtra-points/), how to use LoopBack with [Facebook’s Graph API for user authentication](https://strongloop.com/strongblog/loopback-facebook-api-user-authentication/), and how to generate a [client SDK for LoopBack with the Bluemix cloud CLI](https://strongloop.com/strongblog/generate-client-sdk-loopback-bluemix-cli).

*	Sakib Hasan demonstrated how to [Dockerize LoopBack Connectors](https://strongloop.com/strongblog/dockerize-lb-connectors/) for a simple way to set up and tear down a database service on request.

*	[Joe Sepi](https://github.com/joesepi) used LoopBack to build a band app in his multi-part series that began [here](https://strongloop.com/strongblog/lets-build-a-band-app-loopback-pt1/).

## LoopBack.next becomes LoopBack 4, Evolution Continues

With Fall arriving, the focus on the new version of LoopBack began anew. LoopBack.next was now known as LoopBack 4, and on October 19th [Diana Lau](https://github.com/dhmlau) invited [contributors on LoopBack extensions](https://strongloop.com/strongblog/calling-contributors-loopback-extensions/) to help promote extensibility and grow the ecosystem.

The first LoopBack 4 workshop was held at [CASCON](cascon.ca) in November. Titled “API Economy Made Easy with LoopBack 4”, the tutorial is [available on GitHub](https://github.com/torontoCascon/cascon-2017) if you missed it.

[Raymond Feng](https://github.com/raymondfeng) announced the [LoopBack 4 Developer Preview Release](https://strongloop.com/strongblog/loopback-4-developer-preview-release) on Nov 28. Aimed at extension developers as well as API application developers, this preview offered:

* A brand new LoopBack core written in TypeScript with great extensibility and flexibility. 
* An OpenAPI spec driven REST API creation experience. 
* Experimental support for persistence. 
* Basic authentication support. 
* Documentation. 

On November 30, Taranveer Virk discussed LoopBack 4 Extensions again, explaining how [LoopBack 4 extensibility](https://strongloop.com/strongblog/writing-loopback-4-extensions/) makes writing extensions simpler than ever and showing how by writing an example log extension.

With LoopBack 4 imminent, we are considering a new look for LoopBack as well. We reached out to the community for input on options for a [new LoopBack logo and color palette](https://strongloop.com/strongblog/new-loopBack-logo/). The survey closed on December 18th and we will be provdiing updates in early 2018! 

## LoopBack at Events

Throughout 2017 our Evangelist team continued to share their knowledge of LoopBack. We sponsored 33 events (meet-ups, conferences, workshops, and hackathons), sharing LoopBack content at 28 of them. We appeared at 5 events we did not sponsor, and held 3 webinars. Throughout each of these events, we were and are amazed at the enthusiasm LoopBack users share, and the intriguing questions and scenarios they can come up with. It’s this enthusiasm that has also helped shaped LoopBack’s growth and future.  

## A GitHub Milestone and Towards the Future

With all of this activity, a GitHub achievement almost went by unnoticed! [LoopBack hit 10k+](https://github.com/strongloop/loopback) stars in November. We are humbled by the support of our community, and invite you to "star" [strongloop/loopback-next](https://github.com/strongloop/loopback-next) as well!

With LoopBack 4 just about ready for prime time, we are looking forward to seeing how the community uses it and helps it grow.

## What about StrongLoop? 

Of course, the StrongLoop site had a big year too! In May, we announced changes to the focus of the [StrongLoop site](https://strongloop.com/strongblog/strongLoop-evolves-to-promote-open-source-solutions-for-the-api-developer-community). We summarized the change by looking at our old focus and outlining our new one:

"(We've made) the transition from showcasing our services to promoting community. While we proudly supported community since we launched, our previous site highlighted options from StrongLoop and IBM to help you build with node.js and power the API economy. Moving forward, this site embraces our role within the Open Source community that creates APIs and supporting the growth of that community."

With this new approach, we continue to bring Node.js updates - which is important to us since we are part of the [Node Foundation](https://foundation.nodejs.org/)). We are also highlighting three open source options for building APIs:  

* [LoopBack](http://loopback.io/)
* [API Microgateway](https://github.com/strongloop/microgateway)
* [Open API Initiative](https://www.openapis.org/)

## What's Next? 

What we said then about the future still holds true today: 

"We are excited about our new focus on APIs and the Open Source developer communities that builds them. We will continue to post the same sort of LoopBack and Open Source-related content you’ve come to expect so that you you be part of the API economy."


