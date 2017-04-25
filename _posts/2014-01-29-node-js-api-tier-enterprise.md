---
id: 13553
title: Why the Enterprise needs an API Tier built in Node.js
date: 2014-01-29T16:48:48+00:00
author: Al Tsang
guid: http://strongloop.com/?p=13553
permalink: /strongblog/node-js-api-tier-enterprise/
categories:
  - LoopBack
  - Mobile
---
## **Background** {#What'sanAPITierandWhyDoEnterprisesNeedOne?-Background}

Many enterprises started as small companies that adopted business process automation systems to help scale their operations.  Back in the 1980s and &#8217;90s, such systems were typically custom-built, since little &#8220;off the shelf&#8221; enterprise software was available.  Back then, even a big name like Oracle was known only for its database, a key component in these custom systems.  As enterprise software vendors emerged and expanded their offerings, enterprises started to adopt solutions like ERP from vendors like SAP.

In the &#8220;Y2K crisis&#8221; of the late 1990s, many enterprises scrambled to ensure their legacy systems—which were often decades old—could handle dates in the new millennium.  The lesson learned is that legacy enterprise systems can have a very long shelf life, often much longer than anticipated when they were adopted.  Why?  It&#8217;s often too costly replace a system entirely, can be risky to introduce a new mission-critical system, and difficult to justify the substantial investment to all stakeholders.

In the end, most enterprises do eventually replace and augment their legacy systems, but they do so in a slow, piecemeal, evolutionary process.  Typically, they bring new systems online to run side-by-side with legacy systems; thus, there is an ongoing need for integration, which has become an entire sub-industry itself.

Throughout the last three decades, software engineering as a discipline has evolved as well, as illustrated in the table below.

[<img class="aligncenter size-full wp-image-13555" alt="Screen Shot 2014-01-29 at 8.23.21 AM" src="https://strongloop.com/wp-content/uploads/2014/01/Screen-Shot-2014-01-29-at-8.23.21-AM.png" width="716" height="221" />](https://strongloop.com/wp-content/uploads/2014/01/Screen-Shot-2014-01-29-at-8.23.21-AM.png)

Today the average enterprise hosts a highly fragmented and diverse set of systems that are somewhat integrated, with both technology and process to support the business.  As technology evolves, enterprises&#8217; customers demand greater functionality, ease of use, and availability in their everyday lives. This is especially true of mobile technology now.

<!--more-->

## **Introducing the API Tier** {#What'sanAPITierandWhyDoEnterprisesNeedOne?-IntroducingtheAPITier}

Enterprises need an API tier to meet the demands imposed by mobile technology.

An API tier is technology &#8220;super glue&#8221; that ties together endpoints of disparate enterprise systems, then exposing a uniform API to all clients.  The clients include web browsers, mobile smartphones, tablets, and wearables.  Each has its own set of capabilities and limitations and therefore unique user experiences.  An API tier works on top of existing data and services to leverage existing systems in the context of mobile and next-generation clients.  It acts as a natural bridge between front end and back end, providing for increased efficiency as well as rapid iteration to meet changing requirements.

Here at StrongLoop we believe that full-stack JavaScript is the ideal solution for an API tier.  Along with the maturation of HTML5 and CSS3, JavaScript on the front end provides a practical and attainable means to develop cross-platform hybrid mobile applications for multiple devices.  Node.js on the back end provides a monoglot way to share components between back end and front end within the MVC paradigm.  Ultimately, business logic and application functionality can also be leveraged between back end and front end.

## **The API Tier in Depth** {#What'sanAPITierandWhyDoEnterprisesNeedOne?-TheAPITierinDepth}

In the whitepaper, &#8220;<a href="http://www.forrester.com/Mobile+Needs+A+FourTier+Engagement+Platform/fulltext/-/E-RES100161" rel="nofollow">Mobile Needs a Four Tier Engagement Platform</a>&#8220;, Michael Facemire, et. al., from Forrester Research describe the need for a new &#8220;engagement platform&#8221; for mobile.  They observe that the current architecture of three-tier web applications can&#8217;t handle the emerging challenges of the mobile application world.

The challenges include:

  * Users&#8217; expectation of a rich experience that takes advantage of mobile device capabilities.
  * Unpredictability of last-mile delivery of data and content, plus the requirement to operate offline.
  * Propagation of existing data and services within the firewall of the enterprise and seamless integration with cloud services beyond the firewall.
  * Need for the right granularity of content and data delivered to mobile device.

From a developer perspective, these challenges are compounded by architectural constraints left behind by the legacy of web architectures, including:

  * Hard coupling of application logic within data and presentation layer.
  * Monolithic payloads (for example, large server-side rendered web pages) that cannot be easily dissected to dynamically meet mobile use.
  * No easy means to dynamically provision backend services to meet highly-variable demand, especially rapid scaling.

Facemire, et. al., propose to address these challenges with a new four-tier architecture, illustrated below:

[<img class="aligncenter size-full wp-image-13554" alt="2014-01-23_1604" src="https://strongloop.com/wp-content/uploads/2014/01/2014-01-23_1604.png" width="904" height="566" />](https://strongloop.com/wp-content/uploads/2014/01/2014-01-23_1604.png)

## **Separating Technology from Business Domain** {#What'sanAPITierandWhyDoEnterprisesNeedOne?-SeparatingTechnologyfromBusinessDomain}

StrongLoop engineered LoopBack to follow the four-tier paradigm depicted above.  At the heart of LoopBack is an API server.  The API server is &#8220;model&#8221; driven middleware that automatically creates a REST API based on services and data that you connect to using our framework.  On top of the API server is a set of pre-built models and services.  This separation cleanly decouples the technology from the business domain.  As a company focused on mobile, StrongLoop built a mobile domain on top of LoopBack with mobile models like User, Device, and App, and pre-built mobile services like user registration, push notifications, files, and so on.  If another domain is required, the architecture and tooling for LoopBack makes it easy to create a set of new models and services, for example gaming or a vertical domain like healthcare.

## **Client Tier** {#What'sanAPITierandWhyDoEnterprisesNeedOne?-ClientTier}

For mobile, the client tier is all about the user experience.  StrongLoop&#8217;s answer for this tier is BACN (Bootstrap, Angular, Cordova, and Node), a best-of-breed fusion of frameworks for hybrid mobile apps that blurs the lines between native and mobile web apps.  For more on BACN see previous blog posts <a href="http://strongloop.com/strongblog/bacn-mobile-application-development-angularjs-nodejs-cordova-bootstra/" rel="nofollow">BACN</a> and <a href="http://strongloop.com/strongblog/bacn-scrabble-alternatives-to-bootstrap-angular-cordova-and-node/" rel="nofollow">BACN Scrabble</a>.  BACN&#8217;s goal is to provide a rich engaging experience on any device by leveraging existing web developers&#8217; skills (i.e. JavaScript).  The various permutations of BACN can easily meet the challenges of the next generation of mobile apps including wearables and the &#8220;Internet of things&#8221; due to ongoing improvements in JavaScript, HTML5/CSS, and native device bridges provided by packages such as Cordova and PhoneGap.

## **Delivery Tier** {#What'sanAPITierandWhyDoEnterprisesNeedOne?-DeliveryTier}

The delivery tier is about shortening the distance from source of content to device. Much of the content displayed on mobile devices are static assets that can be cached on the device once the user updates the app to the newest version.  This helps with use cases like mobile advertising, in-app purchases from a fixed catalog of virtual goods, related items for ecommerce, etc.

This layer also provides the first opportunity to collect analytics by providing hooks into a quality of service (QoS) gateway through basic beaconization or instrumentation.  This instrumentation can provide insight into end user behavior as well as the first layer of mobile app performance.

StrongLoop has an API gateway/proxy in the works that provides reverse-proxying for AAA (authentication, authorization and auditing) plus caching and content packaging and delivery.  Think Squid or Varnish but optimized for mobile delivery.  For the actual construction of the content or data payload itself, LoopBack at its heart is an API server that surfaces a well-published REST API that is a universal integration point for all devices in the client tier.

## **Aggregation Tier** {#What'sanAPITierandWhyDoEnterprisesNeedOne?-AggregationTier}

Because enterprises have collected a myriad of systems working in concert to perform business operations, getting the necessary data and functions requires normalization to some common denominator.  Think about how challenging it would be if some of the data needed by the mobile client was through a SOAP service and the rest was through a REST service hosted by an entirely different system.

The LoopBack framework normalizes data from disparate systems to a common data payload easily understandable to mobile developers: the model.  The developer can further define the model easily using a domain specific language called LDL (LoopBack Definition Language).  This normalization and aggregation layer is called the _DataSource Juggler_, which can be thought of as a &#8220;modern&#8221; object-to-data mapper (ODM).

## **Services Tier** {#What'sanAPITierandWhyDoEnterprisesNeedOne?-ServicesTier}

The services tier is where legacy begins.  As referenced above, it&#8217;s the myriad of systems that enterprises have within the firewall AND third-party services in the cloud.  Each of these services has a different interface with its own specifications for how to access functionality and data.  StrongLoop&#8217;s advocacy is to fully leverage this tier as-is.  Glue, don&#8217;t replace.  Our solution is to use a full-stack JavaScript solution to glue or fuse these components in the services tier and surface them to the mobile client as quickly and easily as possible.  Because of its technical advantages, Node.js on the back end acts as an API or services &#8220;shock absorber&#8221; to handle the deluge of requests and inter-operations from the increase of clients and a higher level of engagement in the mobile era.

## **Conclusion** {#What'sanAPITierandWhyDoEnterprisesNeedOne?-Conclusion}

The new engagement model brought about by mobile has made more demands on existing tiers that comprise the API tier as well as re-shaped them so that the user experience can be delivered more efficiently to the end user.  The four tier architecture presented builds in a layer of abstraction as well as aggregation to construct the most efficient payload of data to be transferred across each tier and finally up to the mobile client.  The StrongLoop LoopBack API framework builds in these pieces seamlessly centered around data objects called models that are directly consumed and manipulated at each of these tiers.  The API framework is cleanly separated from its business domain application so that models and pre-built services can be plugged in to address a vertical or industry such as gaming, healthcare, etc.

## **What’s next?**

  * Ready to build your next mobile app with an open source Node API Tier? We’ve made it easy to get started either locally or on your favorite cloud, with a simple npm install. [Get Started >>](http://strongloop.com/get-started/)
  * Do you want to keep up on the latest Node, Mobile and StrongLoop new? Sign up for our newsletter, [“In the Loop”](http://strongloop.com/newsletter) or follow us on [Twitter](https://twitter.com/StrongLoop).