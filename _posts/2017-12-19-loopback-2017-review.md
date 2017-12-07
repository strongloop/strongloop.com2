---
title: LoopBack 2017 Year in Review
date: 2017-12-19T08:00:13+00:00
author: Dave Whiteley
permalink: /strongblog/loopback-2017-review/
categories:
  - Community
  - LoopBack

---

With 2017 drawing to a close, we’re reflecting on the way LoopBack has continued to evolve in the past twelve months. The year started big with the introduction of the LoopBack CLI and ended with the LoopBack 4 developer preview release and a request for feedback on possibilities for a new LoopBack logo. We thought we’d take a look at how things shaped up for LoopBack in 2017.
 
## Continuing to Add to LoopBack

In the early days of StrongLoop, the team released slc, described as “a veritable swiss-army knife for building and managing Node applications.” After becoming part of IBM, the StrongLoop team integrated LoopBack’s API creation tooling with IBM’s existing API management options. With the two combined, [LoopBack was given its own CLI](https://strongloop.com/strongblog/announcing-the-loopback-cli/) in January.

January also saw the release of a new open-source LoopBack module called [strong-soap](https://strongloop.com/strongblog/strong-soap-loopback-module/) to go along with the then-current LoopBack 3.0 release. Created by Rashmi Hunt, the module provides a comprehensive SOAP client for invoking web services as well as a mock-up SOAP server capability to create and test your web service. 

## Introducing LoopBack.next

In April, Ritchie Martori announced [LoopBack.next](https://strongloop.com/strongblog/announcing-loopback-next/), the previous name of LoopBack 4. Recognizing that LoopBack’s core code made it difficult to add certain features and tough to gain new contributors, the LoopBack team had one goal: a new and flexible core that would be small, powerful, and fast. As Martori described it:

“This new core will allow us to greatly improve the LoopBack developer experience. On top of the core, we’re working on adding better tooling, new integrations with OpenAPI (Swagger), and making significant performance improvements to routing.
The basic goal of LoopBack remains the same: to make it easy to build apps that use new or existing data. With LoopBack.next, our goal is to take the solid foundation of LoopBack and make it effortlessly extensible.” 

## More LoopBack Improvements and How-To Content

Even with the next version of LoopBack now a focus for the StrongLoop team, spring and summer still saw improvements for the existing version of LoopBack. 

*	Tetsuo Seto let everyone know about [LoopBack’s new Cassandra Connector](https://strongloop.com/strongblog/cassandra-connector-has-arrived/) in April, fulfilling one of the requests we heard most from the LoopBack community. He also followed up with an explanation of how to use corresponding source code blocks to help make your LoopBack app interact with [Cassandra Materialized Views](https://strongloop.com/strongblog/cassandra-materialized-view/).

*	In May Rashmi Hunt introduced a new LoopBack feature – the ability to [generate remote methods and REST APIs for SOAP web services](https://strongloop.com/strongblog/building-enterprise-apis-for-soap-web-services-using-loopback). As Rashmi described, this allows you to create REST APIs that invoke web services easily, even if you haven’t mastered the web service.

* Also in May, Loay Gewily and Janny Hou shared details about [refactoring LoopBack SQL Connectors](https://strongloop.com/strongblog/refactoring-loopback-sql-connectors/) and the changes to Model Discovery and Migration. 

We also saw some informative “how to” posts demonstrating how to accomplish various functions during this time:

*	Nagarjuna Surabathina wrote about creating a [multi-tenant Connector Microservice](https://strongloop.com/strongblog/creating-a-multi-tenant-connector-microservice-using-loopback/) using LoopBack. 

* Nagarjuna joined forces with Subramanian Krishnan for a post about how to use [OpenWhisk for LoopBack As A Service](https://strongloop.com/strongblog/loopback-as-a-service-using-openwhisk/)
and [LoopBack as an Event Publisher](https://strongloop.com/strongblog/loopback-as-an-event-publisher/).

*	Sequioa McDowell announcing his Open Source [LoopBack JSONSchemas VS Code Extension](https://strongloop.com/strongblog/announcing-loopback-jsonschemas-vs-code-extension/), a tool that pushes the documentation to you while you code so you can avoid typos, find configuration errors early, and discover features or options you may not have known about.

*	Raymond Camden explained how to [integrate LoopBack with ElasticSearch](https://strongloop.com/strongblog/integrating-loopback-with-elasticsearch/).

*	David Okun told us how he used LoopBack to build the Open Source Game [Xtra Points](https://strongloop.com/strongblog/loopback-open-source-xtra-points/), how to use LoopBack with [Facebook’s Graph API for user authentication](https://strongloop.com/strongblog/loopback-facebook-api-user-authentication/), and how to generate a [client SDK for LoopBack with the Bluemix cloud CLI](https://strongloop.com/strongblog/generate-client-sdk-loopback-bluemix-cli).

*	Sakib Hasan showed how you can [Dockerize LoopBack Connectors](https://strongloop.com/strongblog/dockerize-lb-connectors/) for a simple way to set up and tear down a database service on request.

*	Joe Sepi used LoopBack to build a band app in his multi-part series that began [here](https://strongloop.com/strongblog/lets-build-a-band-app-loopback-pt1/).

* Raymond Camden provided a quick demonstration on how a [Vue.js application could be built](https://strongloop.com/strongblog/vuejs-and-loopback/) with LoopBack as the back end. 

## LoopBack.next becomes LoopBack 4, Evolution Continues

With Fall arriving, the focus on the new version of LoopBack began anew. LoopBack.next was called LoopBack 4, and on October 19th Diana Lau invited [contributors on LoopBack extensions](https://strongloop.com/strongblog/calling-contributors-loopback-extensions/) to help promote extensibility and grow the ecosystem.

The first LoopBack 4 workshop was held at CasCon in November. Titled “API Economy Made Easy with LoopBack 4”, the tutorial is [available on GitHub](https://github.com/torontoCascon/cascon-2017) if you missed it.

Raymond Feng announced the [LoopBack 4 Developer Preview Release](https://strongloop.com/strongblog/loopback-4-developer-preview-release) on Nov 28. Aimed at Extension Developers as well as API application developers, the preview offered:

* A brand new LoopBack core written in TypeScript with great extensibility and flexibility. 
* An OpenAPI spec driven REST API creation experience. 
* Experimental support for persistence. 
* Basic authentication support. 
* Documentation. 

On November 30 LoopBack 4 Extensions was brought up again, with Taranveer Virk explaining that [LoopBack 4 extensibility](https://strongloop.com/strongblog/writing-loopback-4-extensions/) makes writing extensions simpler than ever and demonstrating by writing an example log extension.

With LoopBack 4 imminent, we reached out to the community for input on options for a [new LoopBack logo and color palette](https://strongloop.com/strongblog/new-loopBack-logo/). You can still provide feedback! 

## LoopBack Events

Throughout 2017 our Evangelist team continued to share their knowledge of LoopBack. There were webinars, tutorials and walk-throughs at conferences, and more hands-on discussions at meetups. Throughout each of these, we were and are amazed at the enthusiasm LoopBack users share, and the intriguing questions and scenarios they can come up with. It’s this enthusiasm that has also helped shaped LoopBack’s growth and future.   

## A GitHub Milestone and Towards the Future

With all of this activity, a GitHub achievement almost went by unnoticed. [LoopBack hit 10k](https://github.com/strongloop/loopback) stars in November.

With LoopBack 4 just about ready for prime time, we are looking forward to seeing how the community uses it and helps it grow.






