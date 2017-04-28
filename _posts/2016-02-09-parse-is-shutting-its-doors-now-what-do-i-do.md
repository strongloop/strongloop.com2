---
id: 26847
title: Parse is Shutting Its Doors. Now What Do I Do?
date: 2016-02-09T08:37:08+00:00
author: Dennis Ashby
guid: https://strongloop.com/?p=26847
permalink: /strongblog/parse-is-shutting-its-doors-now-what-do-i-do/
categories:
  - How-To
  - LoopBack
---
_&#8220;I have dreamed a dream&#8230; but now that dream is gone from me.&#8221;_

[<img class="aligncenter size-medium wp-image-26848" src="{{site.url}}/blog-assets/2016/02/Matrix-300x169.png" alt="Morpheus from The Matrix" width="400" height="225"  />]({{site.url}}/blog-assets/2016/02/Matrix.png)

I imagine this phrase from the movie [**The Matrix**](https://www.youtube.com/watch?v=s8VHpx98fFQ) was going through minds of the Parse community while reading that Parse would be shutting down operations on January 28, 2017 (Parse announced it in their blog post entitled: “[Moving On](http://blog.parse.com/announcements/moving-on/)”).
  
<!--more-->

If you are reading this blog, we know two things: (1) you have apps using Parse MBaaS and are impacted by the sunsetting announcement, and (2) you are looking for alternatives to hosting your Parse Server or a new MBaaS offering altogether. Well, you have come to the right place and IBM wants to be the first to welcome you. Today, IBM is focused on five emerging and disruptive trends &#8211; cloud, cognitive computing, mobile, social business and security. As a 100+ year, global technology company with tens of thousands of software developers/engineers and key contributions in many open technology projects, IBM firmly believes that open source is the foundation of innovative application development in the cloud. So, whether you are looking for a new cloud provider that can host, manage and develop new services for your Parse Server or a new MBaaS offering, IBM has cloud-native solutions to meet your needs and more.

For readers who are not familiar with Parse, it is (or was) a Mobile MBaaS provider that Facebook acquired in 2013. Parse enabled web and mobile app developers to connect their applications to back end cloud databases by creating API endpoints that implemented custom business logic to act on the data being stored or retrieved. In addition, it provided foundational features such as user management, push notifications, social networking integration, and other essentials for mobile apps.

As part of its shutdown, Parse has taken its “core” service and made it available as an Open Source framework called Parse Server. The Parse Server is a Node.JS application based upon the Express framework. It represents the portion of the Parse service that allowed customers to build and expose APIs, write business logic, and connect to a back end data store, namely: MongoDB.

Over the next 11 months, Parse customers will need to wrestle the following two decisions, as illustrated below:

&nbsp;

[<img class="aligncenter size-medium wp-image-26849" src="{{site.url}}/blog-assets/2016/02/Parse-options-300x123.png" alt="Parse Customer Options" width="400" height="164"  />]({{site.url}}/blog-assets/2016/02/Parse-options.png)

Fortunately for those customers, IBM can provide a solution regardless of the decision! Let’s examine both choices…

**<a style="color:#"FFFFFF">{&#8220;decision&#8221;: &#8220;Which Cloud Provider Will We Use? &#8220;}</a style>**

Choosing to keep your application intact and simply pick it up from the Parse Cloud and host it somewhere else is a very safe and reasonable first step. Why? It’s about business continuity – it ensures you can keep the app or website running.

Of course, there will need to be some modifications made to the Parse app to account for the usage of a new Push Service, Database and File Storage providers &#8211; but those are hopefully not very intrusive. They well, however, require some decent development chops using Node.JS.

In evaluating and choosing the right Cloud provider to host your Parse Server the following things should come to mind:

  1. Does the Cloud provider own their hardware or is it based upon other peoples services, such as Amazon?
  2. Does the Cloud provider have built in services like Push, Database and File Storage to complement the Parse Server?
  3. Does the Cloud provider have specific expertise in hosting Node.JS applications?
  4. Does the Cloud provider have the ability to provide expert consulting help get your application running in their Cloud and properly integrated with the new services?

In the case of IBM’s Cloud, named [Bluemix,](http://www.ibm.com/cloud-computing/bluemix/) the answer to the last three questions is YES. The IBM Cloud is the perfect place to run your Parse Server, and we have consulting services (via the recent StrongLoop acquisition) that have deep development skills in Node.JS to help you get your application back up and running quickly and effectively.

If you are planning to migrate an app, you need to begin work as soon as possible. For most apps, the migration process is non-trivial, and will require dedicated development time. But, you are in luck. Andy Trice, IBM MobileFirst Developer Advocate, has written a very detailed blog on the process of migrating an application from Parse.com to Bluemix. You can get started [here](https://developer.ibm.com/bluemix/2016/02/01/migrating-from-parse-to-bluemix/). He also points out some limitations of using the open source Parse Server at the end of the blog, which would be interesting for those developers looking for push notifications, social integrations, app analytics, security, and in-app purchase capabilities.

**<a style="color:#"FFFFFF">{&#8220;decision&#8221;: &#8220;What Are My Other Alternatives?&#8221;}</a style>**

The Parse Server is an Open Source framework created by Facebook to allow its customers to not be left empty handed on January 29, 2017. As the title of the blog post says, though, Facebook is “Moving On” to continue focusing on other endeavors like Instagram, What’s App, Oculus and whatever else they are cooking up internally.

This should put the following question front and center for anyone that is seriously considering the long-term usage of the Parse Server:

  1. Who will maintain the Parse Server code base going forward?
  2. Who will provide new innovations into the technology?
  3. As Node.JS and Express (which the Parse Server is based upon) continue to evolve and grow, who will make sure that the Parse Server continues to run reliably?
  4. If something does go wrong, whom will I ask for support when the back end of my app stops running?

If the answers to these questions have you considering options, let me suggest an alternative: the LoopBack API Server! The [LoopBack API Server](http://loopback.io) is an Open Source Node.JS framework based on Express and fully maintained and supported by IBM.

LoopBack is a framework that is specifically designed to allow developers to quickly create APIs that allow access to data from cloud databases and other REST or SOAP services.

The framework handles most of the heavy lifting like generating an interface for your web or mobile developers to view and test the APIs and providing out-of-the-box user management including social networking integration.

The major difference between continued application development on the LoopBack API Server versus the Parser Server is speed! LoopBack simply provides a faster, and supported, manner to develop APIs over the Parse Server. This is accomplished by embracing a “[convention over configuration](https://en.wikipedia.org/wiki/Convention_over_configuration)” approach. This means that LoopBack reduces the sheer amount of code a developer needs to write to accomplish any given task.  Less code to write means faster time to market for new features in your mobile app or website.

Supported and maintained by IBM, LoopBack is the corner stone for many startups and Fortune 500 companies alike. Companies from [XTV](http://www.xtv.net/) to [GoDaddy](https://www.godaddy.com/) have back end API services running based on the LoopBack API Server.

The next logical question is, “What does a migration from Parse Server to LoopBack look like”? Since your existing Parse Server application is running on Node.JS and Express, most of it should migrate to the LoopBack API Server easily with little disruption.

If you are interested in a deeper conversation about understanding the benefits of switching to the LoopBack API Server and an estimate of effort to assist with the migration, please drop us a line at <callback@us.ibm.com> and one of our Solutions Architects will help you plan the path forward!

In the meantime, if you want to check out the LoopBack API Server for yourself you can install it quickly by following our Getting Started guide:

<https://strongloop.com/get-started/>

Happy Coding!