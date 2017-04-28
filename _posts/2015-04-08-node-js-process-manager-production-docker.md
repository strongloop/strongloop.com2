---
id: 24190
title: New StrongLoop Process Manager Features for Running Node.js in Production Including Docker Support
date: 2015-04-08T07:49:41+00:00
author: Al Tsang
guid: https://strongloop.com/?p=24190
permalink: /strongblog/node-js-process-manager-production-docker/
categories:
  - Community
  - Node DevOps
---
We are excited to announce the immediate availability of a new version of the [StrongLoop Process Manager](http://strong-pm.io) with enhanced remote and local run capabilities, Docker support, Nginx load balancing and enhanced security.

<img class="aligncenter  wp-image-24246" src="{{site.url}}/blog-assets/2015/04/docker.png" alt="docker" width="549" height="132"  />

<img class="aligncenter  wp-image-24255" src="{{site.url}}/blog-assets/2015/04/ijebjihe-1030x215.png" alt="ijebjihe" width="359" height="75"  />

&nbsp;

> _**What is StrongLoop Process Manager?**  It&#8217;s an enterprise-grade  production runtime process manager for Node.js. StrongLoop Process Manager is built to handle both the vertical and horizontal scaling of your Node applications with ease._

Key features include : Multi-host remote deployment , SSH/Auth support, Docker container and hub support, zero downtime with soft and hard starts, clustering and on-demand resizing, plus automatic Nginx load balancer configuration that can all be managed with a CLI or GUI.

## **Vertical Scaling &#8211; Maximizing Each Unit of Scale**

If you are a Node developer like me, you’ve already come to discover that applications start as a single process running on a core within their host. On a four-core host, you&#8217;re obviously not taking advantage of all the compute resources available by only utilizing one out of four cores. In this scenario, the StrongLoop Process Manager will automatically cluster your Node application creating a master process and worker processes with one worker per core, by default. This is what would be referred to as “vertically scaling” your app on a single host, as a unit of scale.

<img class="aligncenter size-large wp-image-24291" src="{{site.url}}/blog-assets/2015/04/vertical-scaling1-1030x260.png" alt="vertical scaling" width="1030" height="260"  />

<!--more-->

## **Horizontal Scaling &#8211; Multiplying Many Units of Scale**

Now that you&#8217;re utilizing all the computing resources on the machine, you are ready to scale out by replicating the same unit of scale multiple times, so that in effect have multiple units that act as one large distributed application. In other words, take the single StrongLoop Process Manager running on a host and spin up multiple hosts running a Process Manager and distribute the load among the many Process Managers.

<img class="aligncenter size-large wp-image-24333" src="{{site.url}}/blog-assets/2015/04/horizontal-scaling2-1030x731.png" alt="horizontal scaling2" width="1030" height="731"  />

## **Why StrongLoop Process Manager?**

Now that you&#8217;re able to run multiple hosts that make up the entirety of your application &#8211; you need a way to be able to act on those hosts as a whole, at the application level OR depending on the task, perform operations on a per host basis.

Here are some examples use cases:

  * As a DevOps engineer, you want to deploy the next version of your application. This affects all hosts running the application at a particular version.
  * As an operations person, you want to see if one of your hosts is acting up and has CPU utilization issues. In this case, you’ll want to be able to look at a single host and set of processes to do some triaging.

This is precisely where Process Manager really shines. It gives you the ability to do these things and makes it even easier with its visual interface in [StrongLoop Arc](https://strongloop.com/node-js/arc/).

Here&#8217;s a summary of what the StrongLoop Process manager can do for you:

  * **New!** &#8211; Control your application remotely through a newly improved and streamlined CLI &#8211;  \`slc\` or visually through StrongLoop Arc
  * **New!** &#8211; Run your application locally within StrongLoop Process Manager to quickly test your unit of scale
  * **New!** &#8211; Perform all operations securely through http+ssh and http + basic auth
  * **New!** &#8211; Install and run StrongLoop Process Manager as a Docker container
  * Remotely deploy your application
  * Stop, start and restart the application remotely with zero downtime if necessary
  * Automatically restart your application if it crashes
  * Automatically cluster your application to take advantage of all cores on your host
  * Vertically scale up or down the number of worker processes for your Node app running in cluster mode
  * Act as the API endpoint to: 
      * expose application metrics collected by strong-agent and expose through statsd interface
      * perform root causes analysis by remotely profiling all processes for both CPU and memory usage
  * Auto-integrate with [Nginx](http://nginx.com/) and dynamically configure itself as a load balancer to round-robin across hosts.

For more detailed information on how these features work, please refer to the [StrongLoop Documentation on Operating Node Applications](http://docs.strongloop.com/display/SLC/Operating+Node+applications).

## **Managing at Scale**

On any one given host you can use the \`slc\` command line tool to control your application through the StrongLoop Process Manager. For example:

<img class="aligncenter size-full wp-image-24213" src="{{site.url}}/blog-assets/2015/04/managing-at-scale.png" alt="managing-at-scale" width="975" height="490"  />

As mentioned, StrongLoop Arc ties together the Process Manager hosts to give you a unified console to operate a given application.

<img class="aligncenter size-large wp-image-24256" src="{{site.url}}/blog-assets/2015/04/Process_Mgr_Arc-1030x488.jpg" alt="Process_Mgr_Arc" width="1030" height="488"  />

## **Monolithic Distributed Apps**

If every StrongLoop Process Manager is running the exact same code, you have the benefit of a full redundancy of all functions running on every unit of scale. You would typically round-robin or use some other load balancing algorithm to distribute the request among the Process Managers based on things like overall CPU load of the host. The drawback to this is that when you make a change to the application you have to update all hosts.

<img class="aligncenter size-large wp-image-24334" src="{{site.url}}/blog-assets/2015/04/monolithic-distributed2-1030x455.png" alt="monolithic distributed2" width="1030" height="455"  />

## **Microservices Based Distributed Apps**

_What if you could intelligently divvy up the hosts based on a set of discrete functions?  _

_What if those hosts provided services or APIs that were fully self contained all the way from their logic to their persistent systems of record?  _

Imagine how quickly and easily you could iterate on your application with such a clean separation of concerns! If we step into our time-machine for a second, we’ll remember that this was the dream of service-oriented architecture [SOA](http://en.wikipedia.org/wiki/Service-oriented_architecture), which has largely remained unrealized. Why? Because you couldn&#8217;t decouple backends enough to be able to update services discretely. Node and frameworks like [LoopBack](http://loopback.io/) have made this much easier.  [LoopBack](http://loopback.io/) provides connectors to make it easy to connect to multiple backend stores at the same time. With its model-driven development and aggregation capabilities, it&#8217;s now possible to take a subset of hosts and have them act as a pool that performs a set of services divided by your application domain.  If those services need to be changed, you can update just that designated pool without affecting the rest of the application.

<img class="aligncenter size-large wp-image-24342" src="{{site.url}}/blog-assets/2015/04/microservices4-1030x468.png" alt="microservices4" width="1030" height="468"  />

## **What&#8217;s Next?**

**Watch the demo!** Check out my [short video](https://www.youtube.com/watch?v=OPQRfkaH_tE&t=3s) that gives you an overview of the StrongLoop Process Manager.

**Sign up for the webinar!** [“Best Practices for Deploying Node.js Applications in Production”](http://marketing.strongloop.com/acton/form/5334/0039:d-0002/0/index.htm) on April 16 with StrongLoop and Node core developer [Sam Roberts](https://github.com/sam-github).

In the coming weeks, look for more enhancements to the StrongLoop Process Manager and its runtime capabilities. But for now, here’s a few additional technical articles that dive into greater detail on how to make the most of this release:

  * [Best Practices for Deploying Node in Production](https://strongloop.com/strongblog/node-js-deploy-production-best-practice/)
  * [How to Test Node.js Deployments Locally Using StrongLoop Process Manager](https://strongloop.com/strongblog/test-node-js-deployments-locally-using-process-manager/)
  * [How to Run StrongLoop Process Manager in Production](https://strongloop.com/strongblog/node-js-process-manager-production/)
  * [How to Secure StrongLoop Process Manager with SSH](https://strongloop.com/strongblog/secure-node-js-process-manager-ssh/)
  * [Best Practices for Deploying Express Apps with StrongLoop Process Manager](https://strongloop.com/strongblog/best-practices-express-js-process-manager/)
  * [How to Create and Run StrongLoop Process Manager Docker Images](https://strongloop.com/strongblog/run-create-node-js-process-manager-docker-images/)

&nbsp;

&nbsp;