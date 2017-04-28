---
id: 6712
title: Deploying LoopBack mBaaS on Cloud Foundry
date: 2013-09-17T00:42:10+00:00
author: Matt Schmulen
guid: http://strongloop.com/?p=6712
permalink: /strongblog/deploying-loopback-mbaas-on-cloud-foundry/
categories:
  - Cloud
  - LoopBack
---
## Getting Started with LoopBack on Cloud Foundry

[<img class="alignnone size-medium wp-image-19068" alt="cloud_foundry_logo" src="{{site.url}}/blog-assets/2013/09/cloud_foundry_logo-300x300.png" width="300" height="300" />]({{site.url}}/blog-assets/2013/09/cloud_foundry_logo.png)

<span style="font-size: 13px;">Most mobile developers want to focus on the front-end of their apps and not get caught up in having to figure out how to write a backend, connect it to data sources or worse how to manage and scale it. By deploying StrongLoop’s </span><a style="font-size: 13px;" href="http://strongloop.com/strongloop-suite/loopback/">LoopBack</a> <span style="font-size: 13px;">mobile backend-as-a-service (</span><a style="font-size: 13px;" href="http://en.wikipedia.org/wiki/Backend_as_a_service">mBaaS</a><span style="font-size: 13px;">) on </span><a style="font-size: 13px;" href="http://www.cloudfoundry.com/">Cloud Foundry</a> <span style="font-size: 13px;">it’s possible to take advantage of an open, private mBaaS on an open and scalable platform-as-a-service.</span>

<h2 dir="ltr">
  What is Cloud Foundry?
</h2>

<p dir="ltr">
  Unlike many cloud providers, Cloud Foundry is an open source PaaS, providing a choice of supported clouds, developer frameworks and application services. Cloud Foundry makes it faster and easier to build, test, deploy and scale mobile backends like StrongLoop’s LoopBack. It is an <a href="http://www.github.com/cloudfoundry">open source project</a> and is available through a variety of private cloud distributions and public cloud instances.
</p>

<h2 dir="ltr">
  Why run LoopBack on Cloud Foundry?
</h2>

<p dir="ltr">
  If you are a mobile developer looking to develop applications that need access to data that resides in the cloud and the datacenter, there’s quite a few advantages to running your own private mBaaS in the cloud:
</p>

<li dir="ltr">
  <p dir="ltr">
    LoopBack is open source and extensible at its core and with the over <a href="https://npmjs.org/">41,000</a> available NPM community modules, the possibilities are almost limitless
  </p>
</li>

<li dir="ltr">
  <p dir="ltr">
    LoopBack is built on Node.js, so if you know JavaScript you know LoopBack
  </p>
</li>

<li dir="ltr">
  <p dir="ltr">
    Out-of-the-box, LoopBack connects to enterprise datasources like Oracle and MongoDB
  </p>
</li>

<li dir="ltr">
  <p dir="ltr">
    LoopBack ships with an iOS SDK, so you won’t have to compromise on functionality or inherit a steep learning curve
  </p>
</li>

<li dir="ltr">
  <p dir="ltr">
    Cloud Foundry lets you focus on your app not machines or middleware
  </p>
</li>

<li dir="ltr">
  <p dir="ltr">
    Cloud Foundry manages the patching, load balancing and availability of your backend
  </p>
</li>

<li dir="ltr">
  <p dir="ltr">
    If your app needs it (and let’s hope it does!), Cloud Foundry auto-scales on demand to make sure whether you are servicing one or tens of thousands of users &#8211; everyone is guaranteed to have a stellar user experience
  </p>
</li>

## **<span style="color: black;">Configuring for Cloud Foundry and StrongLoop </span>**

<p dir="ltr">
  First step is to install and configure the CF tools on your dev machine:
</p>

<p dir="ltr">
  1. Register at <a href="http:///StrongLoop.Com">StrongLoop.com</a> and download the StrongNode distro for your development environment.
</p>

<p dir="ltr">
  <a href="{{site.url}}/blog-assets/2013/09/StrongLoop-Web-Downloads.png"><img class="alignnone size-full wp-image-7322" alt="StrongLoop-Web-Downloads" src="{{site.url}}/blog-assets/2013/09/StrongLoop-Web-Downloads.png" width="443" height="242" /></a>
</p>

<p dir="ltr">
  2. Install the Cloud Foundry CLI common referred to as cf ( *you need Ruby 1.9.3 , OSX comes with Ruby v1.8.7 installed out of the box a small <a href="https://gist.github.com/mschmulen/b600e38eeb8f06dc8ce2">gist</a> to help you with upgrade options for Mac)
</p>

`$gem install cf`

<p dir="ltr">
  3. configuring your target ( you will need cf target, I&#8217;m using pivotal  <a href="https://console.run.pivotal.io/register" rel="noreferrer">https://console.run.pivotal.io/register</a>  for this demo)
</p>

<p dir="ltr">
  $cf target api.run.pivotal.io cf login <email> <password>
</p>

<p dir="ltr">
  More information on <a href="http://docs.cloudfoundry.com/docs/using/deploying-apps/javascript/">Deploying Node.js Applications on CF</a>
</p>

## **<span style="color: black;">CF Push, For the Win</span>**

Build your LoopBack mBaaS on your local developer machine and push it to a Cloud Foundry PaaS

<p dir="ltr">
  1.Create and Prepare your StrongLoop LoopBack Node application on your local machine
</p>

 `$mkdir CloudFoundryApp<br />
$cd CloudFoundryApp<br />
$slc lb api-example<br />
$cd sls-sample-app<br />
$slc install`

<p dir="ltr">
  2. Verify your LoopBack Mobile API tier is up and running by hitting the API explorer page on your local machine at <a href="http://localhost:3000/explorer">http://localhost:3000/explorer</a>
</p>

<p dir="ltr">
  <a href="{{site.url}}/blog-assets/2013/09/LoopBack-Explorer-Products-Post.png"><img class="alignnone  wp-image-7313" alt="LoopBack-Explorer-Products-Post" src="{{site.url}}/blog-assets/2013/09/LoopBack-Explorer-Products-Post.png" width="478" height="317" /></a>
</p>

<p dir="ltr">
  3.Push your StrongLoop Application to the cloud
</p>

`$cf push my-new-app`

## **<span style="color: black;">Start Server, receive Open Node MBaaS</span>**

<p dir="ltr">
  Now that your newly created StrongLoop server is up, let&#8217;s take a look at what you get and connect your Cloud Foundry hosted MBaaS to a native Mobile iPhone app
</p>

Since you have the &#8216;loopback-mobile-getting-started&#8217; github repo on your local machine  you can simply open the loopback iOS guide app located at /loopback-ios-app/loopback-ios-multi-model.xcodeproj with XCode.

Once the XCode Project is open you will need to modify your Adaptor endpoint to point to your server.   Modify the &#8216;

_adapter = [LBRESTAdapter adapterWithURL:[NSURL URLWithString:@&#8221;http://localhost:3000&#8243;]];&#8217; in the AppDelegate.m.  Change the &#8216;localhost&#8217; address to point to your  ip address.

Hit command R in XCode and walk through the walk the guide application instructions.

[<img class="alignnone size-full wp-image-7326" alt="Sample-getting-started-ios-all" src="{{site.url}}/blog-assets/2013/09/Sample-getting-started-ios-all.png" width="501" height="238" />]({{site.url}}/blog-assets/2013/09/Sample-getting-started-ios-all.png)

&nbsp;

If you would like to find some more examples on how to integrate native iOS applications with LoopBack make sure and check out the <a href="http://github.com/strongloop-community/loopback-examples-ios" target="_blank">http://github.com/strongloop-community/loopback-examples-ios</a> , where you will find a UITableView, MapView and custom method call samples.

[<img class="alignnone size-full wp-image-7327" alt="sample-examples-ios-all" src="{{site.url}}/blog-assets/2013/09/sample-examples-ios-all.png" width="380" height="223" />]({{site.url}}/blog-assets/2013/09/sample-examples-ios-all.png)

If you are using a cross platform mobile tool such as Appcelerator Titanium ( javascript) or Xamarin ( c# )  make sure and check out our other examples at [github.com/strongloop-community](http://github.com/strongloop-community) .

Now that you have your StrongLoop Suite ( StrongNode, StrongOps and LoopBack ) up and configured you can start building out your mobile client application. You can identify ‘hot spots’ and latency with StrongOps or <a href="http://blog.strongloop.com/monitoring-stress-testing-nodejs-apps/" target="_blank">look for stress inside your node.js server application code</a>. You can customize your services and data by extending the open source Node LoopBack API tier with custom code or NPM modules from the community.

## **[What’s next?](http://strongloop.com/get-started/)**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What’s in the upcoming Node v0.12 release? <a href="http://strongloop.com/node-js/whats-new-in-node-js-v0-12/">Six new features, plus new and breaking APIs</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js <a href="http://strongloop.com/node-js/loopback/">LoopBack framework</a>. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Need <a href="http://strongloop.com/node-js-support/expertise/"]]>training and certification</a> for Node? Learn more about both the private and open options StrongLoop offers.</span>
</li>