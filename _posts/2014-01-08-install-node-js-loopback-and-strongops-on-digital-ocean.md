---
id: 12692
title: Install Node.js, LoopBack and StrongOps on Digital Ocean
date: 2014-01-08T10:22:31+00:00
author: Jimmy Guerrero
guid: http://strongloop.com/?p=12692
permalink: /strongblog/install-node-js-loopback-and-strongops-on-digital-ocean/
categories:
  - Arc
  - Cloud
  - Community
  - How-To
  - LoopBack
---
In this quick write up we are going to show you how to get Node.js, [LoopBack](http://strongloop.com/mobile-application-development/loopback/) (open source mobile backend) and [StrongOps](http://strongloop.com/node-js-performance/strongops/) (Node performance monitoring) up and running on [Digital Ocean](https://www.digitalocean.com/).

## **What&#8217;s Digital Ocean?**

The tagline &#8220;Digital Ocean provides blazing fast SSD cloud servers at only $5/month&#8221; does not do cloud provider Digital Ocean justice.

In addition to the performance of the server instance (a droplet in Digital Ocean lingo), Digital Ocean has become a favorite of developers for the following reasons:

  *  <span style="font-size: medium;">low cost performance</span>
  *  <span style="font-size: medium;">Droplets standup fast, very fast ( 59 seconds fast )</span>
  *  <span style="font-size: medium;">Static external IP address for every droplet</span>
  *  <span style="font-size: medium;">Droplet&#8217;s disk, RAM, and IP address are all reserved while the droplet is off</span>
  *  <span style="font-size: medium;">Snapshot feature allows you to save the droplet after you have destroyed the instance.</span>
  *  <span style="font-size: medium;">Preserving costs and making for a fast standup of your configuration for developer Sandbox preserving costs)</span>
  *  <span style="font-size: medium;">You will be able to create a new droplet from the snapshot image anytime to bring it back online.</span>

For the purposes of these installation instructions we’ll be installing on a 512 MB RAM, Ubuntu 12.04 ”Droplet”. However, because all StrongLoop components are all installed via npm, if you already have Node installed you are good to go, regardless of the OS.

If you want to watch a quick video on how it all goes down in about 2 minutes, check out this video:



<h2 dir="ltr">
</h2>

<h2 dir="ltr">
  <strong>Step 1: <a href="https://www.digitalocean.com/">Sign up</a> for Digital Ocean if you haven’t already</strong>
</h2>

&nbsp;

<h2 dir="ltr">
  <strong>Step 2: Install the latest version of Node</strong>
</h2>

There’s a couple of different ways to install Node.js, but here’s one that is pretty straight-forward and will get you up and running quickly. Some alternatives are discussed [here.](https://www.digitalocean.com/community/articles/how-to-install-an-upstream-version-of-node-js-on-ubuntu-12-04)

Log into your Droplet and run:
  
`<br />
$ sudo apt-get update<br />
$ sudo apt-get install python-software-properties python g++ make<br />
$ sudo add-apt-repository ppa:chris-lea/node.js<br />
$ sudo apt-get update<br />
$ sudo apt-get install nodejs`

<h2 dir="ltr">
  <strong>Step 3: Check your version of Node</strong>
</h2>

 `$ node -v<br />
v0.10.24<br />
` 

<h2 dir="ltr">
  <strong>Step 4:  Install the StrongLoop Command Line Interface (cli)</strong>
</h2>

 `$ npm install -g strong-cli<br />
` 
  
_Note: If you get permission errors, re-run commands with sudo_

<h2 dir="ltr">
  <strong>Step 5: Verify your installation</strong>
</h2>

 `$ slc version`

<h2 dir="ltr">
  <strong>Step 6: Install the sample LoopBack application</strong>
</h2>

 `$ slc example<br />
$ cd sls-sample-app`

<h2 dir="ltr">
  <strong>Step 7: Install and setup the StrongOps agent</strong>
</h2>

 `$ slc strongops --register<br />
` 

<h2 dir="ltr">
  <strong>Step 8: Provide your full name, email and password when prompted.</strong>
</h2>

&nbsp;

<h2 dir="ltr">
  <strong>Step 9: Create a StrongLoop account to access your StrongOps dashboard</strong>
</h2>

Go to <https://strongloop.com/register/>

_Note: Use the “email” you provided in Step #5 as your “email” plus use the same ”password”._

<h2 dir="ltr">
  <strong>Step 10: Your dashboard is ready here:</strong>
</h2>

<http://strongloop.com/ops/dashboard>

_Note: You will not see any data until your application has been running for a few minutes. So, please make sure to execute the next step._

&nbsp;

[<img class="aligncenter size-full wp-image-10945" alt="heap_memory" src="https://strongloop.com/wp-content/uploads/2013/11/heap_memory1.png" width="850" height="315" />](https://strongloop.com/wp-content/uploads/2013/11/heap_memory1.png)

&nbsp;

&nbsp;

<h2 dir="ltr">
  <strong>Step 11: Explore the sample application by running it, starting a small load generator and then visiting the URL below:</strong>
</h2>

 `$ slc run .<br />
$ slc run bin/create-load.js`

To view the LoopBack sample application go to the external facing IP that Digital Ocean assigned to your Droplet plus specifying post 3000 like so:

http://[Your Droplet’s IP]:3000

[<img class="aligncenter size-full wp-image-12726" alt="LoopBack API Explorer" src="https://strongloop.com/wp-content/uploads/2014/01/Screen-Shot-2014-01-08-at-10.49.19-AM.png" width="1532" height="949" />](https://strongloop.com/wp-content/uploads/2014/01/Screen-Shot-2014-01-08-at-10.49.19-AM.png)

<h2 dir="ltr">
  <strong>Questions?</strong>
</h2>

You can get them answered by the development team in a variety of ways including StackOverflow and Google Groups. [Here&#8217;s how to interact.](http://strongloop.com/developers/forums/)