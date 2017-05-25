---
id: 13144
title: A Brief History of Mobile Backend-as-a-Service (mBaaS)
date: 2014-01-15T06:24:59+00:00
author: Ritchie Martori
guid: http://strongloop.com/?p=13144
permalink: /strongblog/a-brief-history-of-mobile-backend-as-a-service-mbaas/
categories:
  - Community
  - LoopBack
  - Mobile
---
<br>
<h2 dir="ltr">
  <strong>Background</strong>
</h2>

About two years ago, [Jeff Cross](https://twitter.com/jeffbcross) and I created an obscure open source project called [deployd](https://github.com/deployd/deployd). A framework for rapidly building REST APIs for HTML5 and mobile apps. We didn’t realize it at the time, but it was our tiny contribution to kickstarting the “[noBackend](http://nobackend.org/)” movement. Our goal was to empower front end developers to become full stack JavaScript developers by closing the gap between client-side and server-side development.

<p dir="ltr">
  In this post, we’ll go over how projects and services like deployd came to be, the issues they currently have and how they compare to LoopBack, a new open source project that attempts to solve these problems.
</p>

<h2 dir="ltr">
  <strong>MongoDB</strong>
</h2>

<p dir="ltr">
  Almost all “<a href="http://nobackend.org/">noBackend</a>” platforms depend heavily on MongoDB. Two features these platforms need are schemaless JSON storage and ad hoc or dynamic queries. This allows the backend to flex to the requirements and data provided by the client. Clients do not need to specify the data they want to store up front. They do not need to pre-define queries ahead of time or the relationships between tables. This gives the client and front end developer a lot of control.
</p>

<p dir="ltr">
  MongoDB is built specifically to provide these two features. It was <a href="http://www.kchodorow.com/blog/2010/08/23/history-of-mongodb/">originally designed to back a platform similar to Google app engine</a>.
</p>

<p dir="ltr">
  <em>“10gen launched as an open source platform-as-a-service play offering the MongoDB object database as well as an application server and file system”</em>
</p>

<p dir="ltr">
  &#8211; <a href="http://blogs.the451group.com/opensource/2009/02/18/10gen-babble-mongodb-and-open-source-longevity/">Matthew Aslett, 2009</a>
</p>

<p dir="ltr">
  MongoDB is essentially a database designed for a backend service platform. It shouldn’t be much of a surprise that pretty much every notable platform depends on it:
</p>
<br>
<h2 dir="ltr">
  <strong>Backend platforms using MongoDB</strong>
</h2>
<ul>
<li style="margin-left:2em;">
  <a style="font-size: 18px;" href="http://blog.parse.com/2013/03/07/techniques-for-warming-up-mongodb/">Parse</a>
</li>
<li style="margin-left:2em;">
  <a style="font-size: 18px;" href="http://support.stackmob.com/entries/23651576-do-you-use-MongoDB-">StackMob</a>
</li>
<li style="margin-left:2em;">
  <a style="font-size: 18px;" href="http://docs.deployd.com/docs/server/your-server.md">Deployd</a>
</li>
<li style="margin-left:2em;">
  <a style="font-size: 18px;" href="http://docs.meteor.com/#dataandsecurity">Meteor</a>
</li>
<li style="margin-left:2em;">
  <a style="font-size: 18px;" href="http://www.mongodb.org/about/production-deployments/">Firebase</a>
</li>
</ul>


<h2 dir="ltr">
</h2>

<h2 dir="ltr">
  <strong>What is wrong with MongoDB?</strong>
</h2>

<p dir="ltr">
  Combined, the platforms above have hundreds of thousands if not millions of applications depending on MongoDB. So what is the issue? The issue is not MongoDB, as some would probably argue. Its using the wrong tool for the job. Even though MongoDB was designed for these type of backend platforms, it was not designed to support any type of application. Some applications require a relational schema, transactions, referential integrity, ACID compliance, and other features not available in MongoDB or other databases.
</p>

<p dir="ltr">
  At StrongLoop we ran with this idea and created the open source project called <a href="http://strongloop.com/mobile-application-development/loopback/">LoopBack</a>. We made sure to not have any dependencies on MongoDB from the beginning. We wanted to provide the same features you expect from a backend platform, while also having the option to choose which database best suites your requirements.
</p>

<h2 dir="ltr">
  <strong>What makes LoopBack different?</strong>
</h2>

<p dir="ltr">
  It’s hard to build a noBackend platform that supports multiple databases. That’s most likely why most backend platforms only support MongoDB. LoopBack’s promise is that you can have all the benefits of a backend platform and also choose the database your application requires.
</p>

<p dir="ltr">
  LoopBack was designed from the beginning to be suitable for any production environment. It allows you to choose how and where to run it. Your own local dev box, a cloud provider like Amazon, your own data center, continuous integration servers, heroku, etc.
</p>

<h2 dir="ltr">
  <strong>Migrating to LoopBack</strong>
</h2>

<p dir="ltr">
  LoopBack supports a set of features that closely matches other backend platforms. Take a look at an example migrating from deployd to LoopBack. The same general process should apply to other platforms.
</p>

<h2 dir="ltr">
  <strong>Recap</strong>
</h2>

<p dir="ltr">
  LoopBack has several advantages over other backend platforms. Being tightly coupled to MongoDB means you don’t have options. This makes it really difficult to integrate with existing systems. Since LoopBack supports similar features, migrating from a legacy backend platform is painless.
</p>

<h2 dir="ltr">
  <strong>Next Steps</strong>
</h2>

<li style="margin-left:2em;">
  <a style="font-size: 18px;" href="http://strongloop.com/strongblog/npm-install-g-strong-cli-announcing-a-new-distribution-model/">Install the StrongLoop command line tool</a>
</li>
<li style="margin-left:2em;">
  <span style="font-size: 18px;">Check out some example LoopBack apps: </span><br /> <a style="font-size: 18px;" href="https://github.com/strongloop/loopback-example-access-control">Access Control</a> and <a style="font-size: 18px;" href="https://github.com/ritch/loopback-foodme">FoodMe</a>
</li>
<li style="margin-left:2em;">
  <a style="font-size: 18px;" href="http://docs.strongloop.com/display/DOC/LoopBack">Read the LoopBack docs</a>
</li>
<li style="margin-left:2em;">
  <a style="font-size: 18px;" href="http://docs.strongloop.com/display/DOC/Getting+started">Get started with LoopBack</a>
</li>
<li style="margin-left:2em;">
  <a style="font-size: 18px;" href="https://github.com/strongloop/loopback">Check out the Project on GitHub</a>
</li>