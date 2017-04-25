---
id: 11906
title: Using StrongLoop to Overcome Challenges with Connecting Mobile Apps to Data
date: 2013-12-11T11:15:15+00:00
author: Al Tsang
guid: http://strongloop.com/?p=11906
permalink: /strongblog/data-challenges-mobile-enterprise-date/
categories:
  - LoopBack
  - Mobile
---
Developers are well aware of the challenges presented by the diversity of mobile devices; but the diversity of backend systems presents equal challenges. Not only are there many different kinds of back end systems and data stores, but application services and data may exist in the datacenter, in the cloud, or some combination of the two, as well as in disparate legacy systems.

Mobile developers need a platform that interacts well with the diversity of back-end data and services, so they can focus on the user experience, get to market quicker, and iterate continuously to meet rapidly changing requirements.

<!--more-->

**Node.js bridges the interoperability challenges of both front end and back end and clears a highly productive path for developers to build compelling mobile applications faster.**

&nbsp;

## The Problem {#ChallengesLeveragingExistingDataforMobile-TheProblem}

Developing for multiple form factors is already a challenge because of the number of platforms and differences between native device experience and web experience. With the rise of mobile development came the rise of front-end development frameworks like Appcelerator Titanium and Sencha Touch that promise “code once; run native apps on multiple platforms.&#8221; There are also open-source-based libraries such as PhoneGap and JQuery Mobile that use HTML and Javascript for cross-platform capability. These frameworks may also include a bridge to native device functions and UI components that attempt to mirror native widgets.

The first generation of mobile applications in the enterprise were developed either as a highly-constrained extension of an existing web application or a best effort at erecting a new platform stack to address the growing needs of an enterprise’s mobile strategy using technology previously leveraged for web application development.

In both cases, there are formidable challenges posed on the backend stemming from the sheer fact that the form factor, connectivity, data payloads, and overall user experience are inherently different between a web application compared to its ideal mobile counterpart.

Even with some of these challenges addressed by the front-end framework, there has been little done to surface existing enterprise data to mobile devices in a meaningful way. Doing so requires addressing:

  * Authentication, authorization, and accounting.
  * Multiple API endpoints or the lack thereof in key functional areas.
  * Different formats of existing data.
  * Volume and granularity differences in data.
  * Timing and latency differences of a consolidated response to the view.
  * Synchronization, conflict resolution, and eventual consistency&#8211;especially for offline use.

Authentication, Authorization, and Accounting (AAA)

Gaining access to back end systems requires some form of centralized authentication and authorization.  Single sign-on (SSO) and access management solutions like Netegrity SiteMinder have provided a unified set of manageable protocols. However, many systems still are the system of record for their own AAA.  To complicate matters, new companies are now adopting standards used for AAA originating from the web like OpenID and OAuth externally and even internally.  In short, you still need to deal with an assortment of AAA implementations both inside and outside of the corporate firewall.

## API Endpoints {#ChallengesLeveragingExistingDataforMobile-APIEndpoints}

In the not-so-distant past, legacy systems had their own proprietary APIs and associated SDKs. <a href="http://docs.strongloop.com/display/DOC/LoopBack+Definition+Language+guide?src=contextnavpagetreemode" rel="nofollow">Enterprise application integration</a> (EAI) solutions have only addressed the ability to connect backend systems together from a systems integration perspective. Many of these implementations were constructed for batch operations performed system to system. Where these solutions have fallen short and not done well unifying systems to a common client like web, much less mobile. XML and first-generation web services like SOAP provided a greater level of interoperability. The integrations allowed for more interoperability through standards for data, metadata, and operations.

With the realization that “less is more” and that more and more systems that needed to interoperate could follow the paradigm that built the largest integration of systems in the world—the Internet—web standards like REST became more dominant. If systems had to interact with each other over the web and already did, why couldn’t they do so within corporate IT networks as well?

## Different Data Formats {#ChallengesLeveragingExistingDataforMobile-DifferentDataFormats}

Enterprise data is physically stored in many forms. Rows and columns is the typical paradigm for users who interact with their data through spreadsheets and relational databases. With the advent of NoSQL solutions, JSON has become popular for storing data close to what a RESTful API would surface without mediation. The need to mediate data from its native format to something lightweight, understandable and interoperable has never been greater. The diversity of legacy systems and their native data formats necessitates the need to normalize master data into some common format that can be canonically referenced.

## Aggregation Levels and Filtration of Data {#ChallengesLeveragingExistingDataforMobile-AggregationLevelsandFiltrationofData}

Depending on the use case, the need for portions of data as well as unified views of several data entities is imperative. This is true of any client, but especially true in the context of mobile simply because of a limited form factor and even more limited screen real estate. There is also the added challenge of granularity. For example, may make more sense to show a summary list of order headers on the mobile device and allow the detail to be shown only when a particular order is selected. Depending on the backend service, the granularity of only calling headers versus the entire order may or may not exist. Interfacing with the backend may also mean that data aggregation across multiple data sources may need to be conducted on the fly before the final response is sent back to the mobile client.

## Differences in Latencies and Timing of Endpoints {#ChallengesLeveragingExistingDataforMobile-DifferencesinLatenciesandTimingofEndpoints}

Every back-end system is going to have unique characteristics for latency and response time. When aggregating across multiple data sources to compose a final payload of data back to the mobile client, the challenge of collecting dependent pieces of data from each of the endpoints will become more difficult. In mobile computing, there are also added timing and latency challenges posed by data synchronization, eventual data consistency, atomic operations, conflict resolution and others because of offline availability and limited connectivity and throughput.

## **Solution to Problem** {#ChallengesLeveragingExistingDataforMobile-SolutiontoProblem}

## Data Abstraction and Aggregation Tier {#ChallengesLeveragingExistingDataforMobile-DataAbstractionandAggregationTier}

The end goal that forces the developer to contend with all these challenges in the backend is to uniformly access data and services.  The developer would ideally not have to be aware of how and what these underlying services data are, nor would they need to if they can be abstracted back to a business object. In a nutshell, if there were a way to abstraction and normalize all data and services to objects that the developer is ultimately going to manipulate as part of their application that would achieve the end goal. We see this in practice all the time. Consider object relational mapping. To the OOP programmer, the object is what they care about, who the object was serialized, marshalled and databound to the object and its properties should be of little concern to them in the perfect world. This layer of abstraction would have to contend with the challenges listed above and be able to be configured in such a way where the use case allows.

## Smart Client Processing {#ChallengesLeveragingExistingDataforMobile-SmartClientProcessing}

Operations performed on the mobile client are held to a higher expectation of a fluid user experience. To achieve this, it is absolutely necessary to take advantage of client interaction where logic and operations can and should be done client side without the need to have the back end involved in either a real time or asynchronous manner.

Take for example the Comcast DVR Mobile app. TV Guide information is downloaded in batches based on timeframe and viewing frame of TV channels. The data is highly cached because TV program information does not change often once published. Scheduling a record operation is instantaneous because the operation is marked on the client and the request is forwarded to the backend for eventual acknowledgment. In the case of confirmation failure, retry logic is automatically employed by the client framework and in case of disaster a warning is eventually captured by the client within a reasonable timeframe. All of these provisions allow for a very fluid and responsive mobile client.

## LoopBack: an Intelligent Backend {#ChallengesLeveragingExistingDataforMobile-LoopBack:anIntelligentBackend}

The developer should address design patterns driven by mobile use cases with consideration for both the underlying framework of both front end and back end. The LoopBack developer on the client needs to be aware of asynchronous versus synchronous use cases, but ultimately orchestrated on the back end. We intend on building in data synchronization and asynchronous operations within the client frameworks to work in concert with the API services provided by LoopBack.  **LoopBack already has a rich data abstraction and aggregation tier provided by the Datasource Juggler and plug-in enterprise connectors that hide most of the described complexity in the form of a model.** To help bring greater visibility and standardization to this tier we&#8217;ve developed a domain specific language called the <a href="http://docs.strongloop.com/display/DOC/LoopBack+Definition+Language+guide?src=contextnavpagetreemode" rel="nofollow">LoopBack Definition Language (LDL)</a> &#8211; metadata about data in the form of simple readable JSON.  The LoopBack developer still needs to contend with the challenges described above but can do so within a framework and with tooling to help construct robust aggregated and well orchestrated API endpoints.

## **What’s next?**

  * Find out more about [LoopBack](http://strongloop.com/strongloop-suite/loopback/).
  * Get our [&#8220;Mobilizing Enterprise Data with LoopBack Models&#8221; whitepaper](http://strongloop.com/wp-content/uploads/2013/11/Mobilizing-Enterprise-Data-with-LoopBack-Models.pdf).
  * Ready to build your next mobile app with a Node backend? We’ve made it easy to get started either locally or on your favorite cloud, with simple npm install. <a href="http://strongloop.com/get-started/" target="_blank">Get Started >></a>