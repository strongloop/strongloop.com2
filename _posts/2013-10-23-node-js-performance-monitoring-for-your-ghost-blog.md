---
id: 8181
title: Node.js Performance Monitoring for your Ghost Blog
date: 2013-10-23T09:48:53+00:00
author: Matt Schmulen
guid: http://strongloop.com/?p=8181
permalink: /strongblog/node-js-performance-monitoring-for-your-ghost-blog/
categories:
  - How-To
---
Recently the [kickstarter funded](http://www.kickstarter.com/projects/johnonolan/ghost-just-a-blogging-platform) Node.js blogging platform Ghost [launched to the public](http://blog.ghost.org/public-launch/). I immediately picked a provider and stood up this Node.js powered Ghost blog.

Then I started to wonder how Ghost and Node.js would perform under load. How does the &#8220;stack&#8221; hold up if a post is picked up on Reddit or Hacker News. I stopped wondering and started monitoring the health (or stress) of  my <a title="digital ocean" href="http://digitalocean.com" target="_blank">Digital Ocean</a> Node.js Ghost configuration with StrongLoop&#8217;s [Strong-Ops](http://strongloop.com/strongloop-suite/strongops/). This posting is about step #2, integrating StrongLoop&#8217;s Strong-Ops Node Performance Monitoring into your new Node.js ghost instance.

(If you need some help with step #1 standing up your ghost server there is an [excellent guide on Digital Ocean](https://www.digitalocean.com/community/articles/how-to-use-the-digitalocean-ghost-application) that walks you through this.)

After you stand up your Ghost blog come back to this post and stop wondering and start monitoring.

## **<span style="color: black;">Installing and configuring strong-agent with Ghost</span>**

1. Install the strong-agent node package on your newly-instantiated Ghost droplet.

I did this from the virtual web terminal, but it works the same if you ssh into the server.

![Digital Ocean Console](http://mobileappstack.com/content/images/2013/Oct/digitalOceanConsole.png)

    cd /var/www/ghost  
    npm install 'strong-agent' --save  

2. Configure strong-agent with your StrongLoop API Key

Register with [StrongLoop.com](http://mobileappstack.com/configuring-strong-ops-node-performance-monitoring-for-your-ghost-blog/www.strongloop.com); and then get your API_KEY.

The Strong-Ops API_KEY can be a little tricky to find, so make sure and follow the next steps carefully. Once authenticated on StrongLoop.com go to your dashboard at [strongloop.com/ops](http://strongloop.com/ops). Then select the drop down under your name and click &#8216;Account&#8217;.

![](http://mobileappstack.com/content/images/2013/Oct/strongOpsAccountDropDown.png)

Your API key is at the bottom of the page.

![](http://mobileappstack.com/content/images/2013/Oct/StrongOpsAPIKEY.png)

    
    //add this to the top of index.js
    
    var APPLICATION_NAME = 'My Great App';  
    var API_KEY = '<your API key from the website>';  
    require('strong-agent').profile(API_KEY, APPLICATION_NAME);
    

3.  Snapshot and restart your droplet.

Since you will need to restart your server now is also a good time to take a snapshot your Digital Ocean server for later use.

## **<span style="color: black;">Node.js Performance Monitoring with Strong-Ops</span>**

[Strong-Ops](http://docs.strongloop.com/strongops/) has several performance metrics, but I am going to focus on the three that matter the most to me: [Memory](http://docs.strongloop.com/strongops/#heap-usage), [cycles](http://docs.strongloop.com/strongops/#cpu-usage), and [latency](http://docs.strongloop.com/strongops/#cross-tier-application-response-time). The first two because it gives me actionable information on my Ghost instance, and the second because it indicates the performance experience to my end user.

![](http://mobileappstack.com/content/images/2013/Oct/StrongOpsDashboard2.png)

## **[CPU usage](http://docs.strongloop.com/strongops/#cpu-usage)**

CPU usage (cycles) will help me answer if my machine stressed.

The resulting action would be to upgrade to a larger virtual machine.

Remember, Node.js applications are single threaded and will maximizes CPU core usage. So I can get a very clear picture of the stress of my system in this single chart. Like a server EKG, this chart will be my primary indicator for an under provisioned machine.

## **[Heap size and usage](http://docs.strongloop.com/strongops/#heap-usage)**

The memory heap profiler will tell me if my application stack robust. Is the combination of Ghost and Node.js efficient in its memory management, or is it possibly leaking memory?

Do I need to file a bug report on the [ghost bugs forum](https://en.ghost.org/forum/) or possibly upgrade my Node.js version?

The three memory profiles to watch are:

&#8211; Heap: Current heap size

&#8211; RSS: Resident set size

&#8211; V8 GC: Heap size sampled immediately after a full garbage collection

## **[Slow endpoints and databases](http://docs.strongloop.com/strongops/#cross-tier-application-response-time)**

The response time latency will gives me an indication of:

&#8211; How is the experience to my end users? are pages served quickly and consistently?

&#8211; Is my machine under-provisioned for my desired user experience and usage load.

The &#8216;http&#8217; line shows the average total time for any incoming HTTP request.

There are several other useful (some would say critical) metrics that Strong Ops helps you track and measure such as:

&#8211;[Application Tracing](http://docs.strongloop.com/strongops/#application-tracing)

&#8211;[Concurrency](http://docs.strongloop.com/strongops/#concurrency)

&#8211;[Message Latency](http://docs.strongloop.com/strongops/#messages)

## **<span style="color: black;">Current Status</span>**

&nbsp;

****
  
Now that I have my indicators and actions outlined, I can check in on my machine and evaluate as my posts are consumed and the ghost blogging platform is used.

## **<span style="color: black;">Future</span>**

Since it&#8217;s a fresh server and domain, none of my articles are &#8220;blowing up&#8221; on Reddit or Hacker News. &#8230; yet 🙂

I&#8217;ll report back next week as my stats grow and usage starts to put my Ghost stack through its paces.

## **[What’s next?](http://strongloop.com/get-started/)**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What’s in the upcoming Node v0.12 release? <a href="http://strongloop.com/node-js/whats-new-in-node-js-v0-12/">Six new features, plus new and breaking APIs</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js <a href="http://loopback.io/">LoopBack framework</a>. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Need <a href="http://strongloop.com/node-js-support/expertise/">training and certification</a> for Node? Learn more about both the private and open options StrongLoop offers.</span>
</li>