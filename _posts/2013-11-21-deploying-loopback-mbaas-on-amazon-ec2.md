---
id: 6659
title: Deploying LoopBack mBaaS on Amazon EC2
date: 2013-11-21T10:00:01+00:00
author: Matt Schmulen
guid: http://strongloop.com/?p=6659
permalink: /strongblog/deploying-loopback-mbaas-on-amazon-ec2/
categories:
  - How-To
  - LoopBack
---
## MBaaS experience without the lock-in or cost

StrongLoop distro has been supported on the Amazon Marketplace since the July 1.1 release; so it’s no surprise that the new StrongLoop Suite ([StrongNode](http://strongloop.com/strongloop-suite/strongnode/), [StrongOps](http://strongloop.com/strongloop-suite/strongops/) and [LoopBack](http://strongloop.com/strongloop-suite/loopback/)) is ready to be used out of the box on Amazon Marketplace.

The additions to the StrongLoop AMI means that you can use the StrongLoop Suite server image not only as a starting point for deploying your node Applications, but also gives mobile developers a ‘parse’ Mobile backend as a service without having to write Node.js code or manage your infrastructure. The LoopBack mobile API tier provided in the StrongLoop Suite makes it easy for you to create a private mobile backend using open source node technology.

Mobile developers can dynamically manage ‘mobile object’ schemas directly from the LoopBack SDK as they are building their mobile app.
  
<!--more-->


  
&nbsp;

## Standing up your Own Private Mobile Stack in 5 minutes on Amazon

The process to stand up your StrongLoop Suite application on EC2 is nearly identical to 1.1 StrongLoop outlined in this article: [Getting Started with the Amazon Web Services StrongLoop Node AMI](http://blog.strongloop.com/getting-started-with-the-amazon-web-services-stongloop-node-ami/).

I will give a brief walkthrough of how to instance your StrongLoop Suite Amazon EC2 AMI, and then I will get into how to use the new features, specifically the native mobile SDK.
  
&nbsp;

## Instantiating and configuring your StrongLoop Suite:

  1. Browse to the StrongLoop Node AMI on the Amazon Marketplace [https://aws.amazon.com/amis/strongloop
  
](https://aws.amazon.com/amis/strongloop) 
  2. Login to the AWS console with your Amazon credentials.
  3. Select the Launch AMI button

&nbsp;

[<img class="alignnone  wp-image-6685" alt="ami-install" src="{{site.url}}/blog-assets/2013/09/ami-install.png" width="558" height="363" />]({{site.url}}/blog-assets/2013/09/ami-install.png)

3. Select the Region and provisioning.

4. Verify the server is instantiated.

Once you SSH (login) to your newly created Amazon EC2 instance you can configure [strong-agent](https://npmjs.org/package/strong-agent) for the StrongOps Console.

&nbsp;

## Configuring StrongOps

Configuring StrongOps is now as simple as setting your Agent ID and application name in the first line of the app.js file. StrongLoop Suite applications come preconfigured with strong-agent so you only need to set the ID and application name.

```js
require('strong-agent').profile({ [USER_ID], [APPLICATION_NAME] });
```

You can find information about advance options such as blocking threshold in the [StrongOps documentation page](http://docs.strongloop.com/display/DOC/StrongOps).

&nbsp;

## Standing up your custom LoopBack Mobile backend

The easiest way to ‘walk’ through the developing apps using LoopBack is to download the simple guide application. This Native iOS application will walk you through the basics of Creating Reading Updating and Deleting mobile model objects from your mobile Application.

First clone the project from the github repository <http://github.com/strongloop-community/loopback-mobile-getting-started> and cd into the folder /loopback-mobile-getting-started to get started.

```js
$ git clone git@github.com:strongloop-community/loopback-mobile-getting-started.git
$ cd loopback-mobile-getting-started
```

A pre-configured LoopBack server is bundled in the repo so if you want to develop on your local machine you can simple run the loopback node app at /loopback-nodejs-server by running: $slc run app.js and then open your browser to <http://localhost:3000> showing a splash screen or open the API explorer at <http://localhost:3000/explorer/> .

&nbsp;

[<img class="alignnone  wp-image-6700" alt="Screen Shot -Explorer" src="{{site.url}}/blog-assets/2013/09/Screen-Shot-Explorer.png" width="820" height="501" />]({{site.url}}/blog-assets/2013/09/Screen-Shot-Explorer.png)

Since we want to build a custom mBaaS on Amazon EC2 we will just use the mobile iOS XCode project to build our iPhone client app and we will create a new LoopBack MBaaS instance on our newly created Amazon EC2 instance.

&nbsp;

## Creating a custom LoopBack mBaaS instance on EC2

First remote ssh to your newly created EC2 instance.

Using the LoopBack CLI, you can create and configure your LoopBack node server on your Amazon EC2 instance:

```js
$ slc lb project myLoopBackApp
$ cd myLoopBackApp
$ slc install
$ slc lb model product
$ slc lb model car
```

Then start the loopback server on your amazon instance with:

```js
$slc run app.js
```

&nbsp;

## <span style="font-size: 1.17em;">Integrate a Native iOS application with your custom LoopBack Amazon Mobile Backend instance</span>

Since you have the &#8216;loopback-mobile-getting-started&#8217; github repo on your local machine you can simply open the LoopBack iOS guide app located at /loopback-ios-app/loopback-ios-multi-model.xcodeproj with XCode.

Once the XCode Project is open you will need to modify your Adaptor endpoint to point to your Amazon EC2 Instance. Modify the:

<pre lang="”objc”" line="”1″">_adapter = [LBRESTAdapter adapterWithURL:[NSURL URLWithString:@"http://localhost:3000"]];'
```

in the AppDelegate.m.  Change the &#8216;localhost&#8217; address to point to your Amazon EC2 address.

Hit command R in XCode and walk through the walk the guide application instructions.

[<img class="alignnone  wp-image-6707" alt="app-ios-gettingstarted-welcome" src="{{site.url}}/blog-assets/2013/09/app-ios-gettingstarted-welcome.png" width="238" height="446" />]({{site.url}}/blog-assets/2013/09/app-ios-gettingstarted-welcome.png)[<img class="alignnone  wp-image-6704" alt="app-ios-gettingstarted-1" src="{{site.url}}/blog-assets/2013/09/app-ios-gettingstarted-1.png" width="238" height="446" />]({{site.url}}/blog-assets/2013/09/app-ios-gettingstarted-1.png)[<img class="alignnone  wp-image-6705" alt="app-ios-gettingstarted-2" src="{{site.url}}/blog-assets/2013/09/app-ios-gettingstarted-2.png" width="238" height="446" />]({{site.url}}/blog-assets/2013/09/app-ios-gettingstarted-2.png)[<img class="alignnone  wp-image-6706" alt="app-ios-gettingstarted-3" src="{{site.url}}/blog-assets/2013/09/app-ios-gettingstarted-3.png" width="238" height="446" />]({{site.url}}/blog-assets/2013/09/app-ios-gettingstarted-3.png)

&nbsp;

If you would like to find some more examples on how to integrate native iOS applications with LoopBack make sure and check out the <a href="http://github.com/strongloop-community/loopback-examples-ios" target="_blank">http://github.com/strongloop-community/loopback-examples-ios</a>, where you will find a UITableView, MapView and custom method call samples.

[<img class="alignnone  wp-image-6709" alt="Screen Shot -app-ios-mapview" src="{{site.url}}/blog-assets/2013/09/Screen-Shot-app-ios-mapview.png" width="238" height="446" />]({{site.url}}/blog-assets/2013/09/Screen-Shot-app-ios-mapview.png)

Now that you have your StrongLoop Suite (StrongNode, StrongOps and LoopBack) up and configured you can start building out your mobile client application. You can identify ‘hot spots’ and latency with StrongOps or <a href="http://blog.strongloop.com/monitoring-stress-testing-nodejs-apps/" target="_blank">look for stress inside your node.js server application code</a>. You can customize your services and data by extending the open source Node LoopBack API tier with custom code or NPM modules from the community.

If you are using Amazon&#8217;s Elastic Beanstalk, make sure and checkout the post on <a href="http://blog.strongloop.com/setting-up-and-monitoring-node-js-apps-on-elastic-beanstalk-with-strongops/" target="_blank">setting up and monitoring node.js apps on elastic beanstalk with StrongOps</a>.

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