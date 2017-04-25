---
id: 23201
title: Announcing the Most Complete Process Manager for Node.js Clustering
date: 2015-02-09T08:00:21+00:00
author: Jimmy Guerrero
guid: http://strongloop.com/?p=23201
permalink: /strongblog/node-js-process-manager-cluster-load-balancer/
categories:
  - News
  - Node DevOps
---
StrongLoop is excited to announce the immediate availability of StrongLoop Process Manager, the industry’s best deployment and runtime management solution for Node clustering. StrongLoop’s Process Manager improves upon existing community cluster management efforts such as forever and pm2 by adding:

  * <span style="font-size: 18px;">A graphical interface via <a href="http://strongloop.com/node-js/arc/">StrongLoop Arc</a> </span>
  * <span style="font-size: 18px;">nginx load balancing integration </span>
  * <span style="font-size: 18px;">Remote management </span>
  * <span style="font-size: 18px;">Automated build and multi-host deploy </span>
  * <span style="font-size: 18px;">Integrated monitoring and profiling </span>

[<img class="aligncenter size-large wp-image-23290" src="https://strongloop.com/wp-content/uploads/2015/02/SingleApp_Multi_Server-1030x346.jpg" alt="SingleApp_Multi_Server" width="1030" height="346" srcset="https://strongloop.com/wp-content/uploads/2015/02/SingleApp_Multi_Server-1030x346.jpg 1030w, https://strongloop.com/wp-content/uploads/2015/02/SingleApp_Multi_Server-300x101.jpg 300w, https://strongloop.com/wp-content/uploads/2015/02/SingleApp_Multi_Server-1500x504.jpg 1500w, https://strongloop.com/wp-content/uploads/2015/02/SingleApp_Multi_Server-705x237.jpg 705w, https://strongloop.com/wp-content/uploads/2015/02/SingleApp_Multi_Server-450x151.jpg 450w" sizes="(max-width: 1030px) 100vw, 1030px" />](https://strongloop.com/wp-content/uploads/2015/02/SingleApp_Multi_Server.jpg)

<!--more-->

The new StrongLoop Process Manager inside of the StrongLoop Arc UI adds production scaling and reliability features required by companies deploying APIs and apps written in Node at scale in Linux or Windows environments. As you’d expect, StrongLoop Process Manager does what existing process managers like forever and PM2 do: keep Node processes running and help manage the multiple processes in a cluster. However, StrongLoop Process Manager goes beyond this basic functionality to provide enterprise-grade features, several of which are industry firsts, including:

  * <span style="font-size: 18px;">Multi-machine, multi-process application deployment and runtime control </span>
  * <span style="font-size: 18px;">Built-in ngnix load-balancing integration across multiple server deployments to deliver high performance, straight out-of-the-box </span>
  * <span style="font-size: 18px;">Monitoring, profiling and root cause analysis tools integrated into the same UI </span>
  * <span style="font-size: 18px;">Also, StrongLoop Arc can be installed either on-premise or in your cloud of choice &#8211; it’s not SaaS </span>

If you are in a DevOps team looking for a single UI that everyone can use to manage the complete API development lifecycle, StrongLoop Arc and it’s new process management capabilities are definitely worth [evaluating](http://strongloop.com/get-started/).

Here’s a breakdown of the features you’ll find available today in StrongLoop Arc’s Process Manager&#8230;

<h2 dir="ltr">
  <strong>Build and Deploy</strong>
</h2>

StrongLoop Arc delivers push button build functionality using Git or TAR archives along with the ability to deploy to one or multiple remote servers including automatic rebuilds plus clustering and load balancing at startup.

<h2 dir="ltr">
  <strong>Cluster Management</strong>
</h2>

You can now scale your Node clusters using StrongLoop’s Arc intuitive cluster management capabilities across any number of servers with features including: hot deploy, automatic and rolling restarts, support for Node v0.12’s round-robin load balancing plus the dynamic resizing of clusters. This free’s up development teams to focus on their app instead of spending time scripting cluster-related features.

<h2 dir="ltr">
  <strong>Load Balancing</strong>
</h2>

StrongLoop Arc’s process management capabilities are designed for high-scale and performance out-of-the-box, with support for NGINX load balancing across multiple servers.

<h2 dir="ltr">
  <strong>Runtime Management</strong>
</h2>

At runtime, StrongLoop Arc delivers management features like foreground or background daemonized processes, log aggregation across workers in a cluster, plus Syslog integration. This saves you the time and expense of having to build or integrate tools to get all your logs in single place for conducting detailed forensics when things go wrong.

<h2 dir="ltr">
  <strong>Profiling</strong>
</h2>

There’s no need to switch to a separate tool to profile the Node processes you are managing. StrongLoop Arc also features built-in remote CPU profiling, heap and memory snapshots from any host and any process.

<h2 dir="ltr">
  <strong>Monitoring and Root Cause Analysis</strong>
</h2>

No need to switch to yet another interface to get your monitoring done. StrongLoop Arc also delivers APM capabilities like the monitoring of core performance metrics including end-points like MongoDB, Oracle, MySQL and SQL Server plus visibility into Node specific metrics like event loops, including blocked ones.

<h2 dir="ltr">
  <strong>What’s next?</strong>
</h2>

[Get started](http://strongloop.com/get-started/) with StrongLoop Arc to check out Process Manager! It takes just a few minutes using npm.

<div id="design-apis-arc" class="post-shortcode" style="clear:both;">
  <h2>
    <a href="http://strongloop.com/node-js/arc/"><strong>Develop APIs Visually with StrongLoop Arc</strong></a>
  </h2>
  
  <p>
    StrongLoop Arc is a graphical UI for the <a href="http://strongloop.com/node-js/api-platform/">StrongLoop API Platform</a>, which includes LoopBack, that complements the <a href="http://docs.strongloop.com/pages/viewpage.action?pageId=3834790">slc command line tools</a> for developing APIs quickly and getting them connected to data. Arc also includes tools for building, profiling and monitoring Node apps. It takes just a few simple steps to <a href="http://strongloop.com/get-started/">get started</a>!
  </p>
  
  <img class="aligncenter size-large wp-image-21950" src="https://strongloop.com/wp-content/uploads/2014/12/Arc_Monitoring_Metrics-1030x593.jpg" alt="Arc_Monitoring_Metrics" width="1030" height="593" />
</div>