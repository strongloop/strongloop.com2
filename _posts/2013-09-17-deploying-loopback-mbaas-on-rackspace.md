---
id: 6714
title: Deploying LoopBack mBaaS on Rackspace
date: 2013-09-17T08:01:49+00:00
author: Matt Schmulen
guid: http://strongloop.com/?p=6714
permalink: /strongblog/deploying-loopback-mbaas-on-rackspace/
categories:
  - Cloud
  - LoopBack
---
## **<span style="color: black;">Fanatical Support Meets Strong Node </span>**

Fanatical Support has made Rackspace the [leader](http://www.rackspace.com/information/aboutus/gartner/) in enterprise hosting. The [Fanatical](http://www.rackspace.com/whyrackspace/support/) Support mantra, support for open source products, and strong SLA has made them the preferred vendor for IT ops in companies large and small. StrongLoop is excited to be one of the first available Node providers for their new [Deployments service](http://www.rackspace.com/blog/automate-your-deployments-quickly-easily-launch-your-app-in-the-rackspace-cloud/), which allows you to create and configure your multi machine Node topology in minutes.  StrongLoop Suite integration in the Control Panel means you’re 3 clicks from Strong Node, Strong-Ops, and LoopBack.

<h2 dir="ltr">
  Push button, receive server
</h2>

<p dir="ltr">
  The easiest way for Rackspace customers to start using Node is via the Rackspace Control Panel. Log into your console at <a href="https://mycloud.rackspace.com/a/rsstrongloop/#deployments">https://mycloud.rackspace.com</a> and select “Deployments” view on the right of the control panel.  The <a href="http://www.rackspace.com/blog/automate-your-deployments-quickly-easily-launch-your-app-in-the-rackspace-cloud/">Rackspace Deployment Service</a> is a new offering that makes it easy to automate the launching of your app in the Rackspace cloud. It works great with the StrongLoop Suite by automating an application and resource deployment in a best practice configuration.
</p>

<p dir="ltr">
  To Startup a Rackspace hosted StrongLoop Application, login into your myCloud.rackspace.com control panel and select  &#8216;Deployments&#8217; on the right side of the Servers bar.
</p>

<p dir="ltr">
  <a href="{{site.url}}/blog-assets/2013/09/Rackspace-create-deployment1.png"><img class="alignnone size-full wp-image-7490" alt="Rackspace-create-deployment" src="{{site.url}}/blog-assets/2013/09/Rackspace-create-deployment1.png" width="605" height="441" /></a>
</p>

<p dir="ltr">
  From the Rackspace &#8220;Create Deployment&#8221; panel insert your deployments name and select your region. Click the “StrongLoop LoopBack” Blueprint.
</p>

<p dir="ltr">
  <a href="{{site.url}}/blog-assets/2013/09/Rackspace-create-options1.png"><img class="alignnone size-full wp-image-7491" alt="Rackspace-create-options" src="{{site.url}}/blog-assets/2013/09/Rackspace-create-options1.png" width="683" height="522" /></a>
</p>

Then configure your StrongLoop server deployment options: Site Address, Admin settings and application name.[<img class="alignnone size-full wp-image-7311" alt="ConfigurationOptions" src="{{site.url}}/blog-assets/2013/09/ConfigurationOptions1.png" width="683" height="522" />]({{site.url}}/blog-assets/2013/09/ConfigurationOptions1.png)

Select your Deployment machine options.

[<img class="alignnone size-full wp-image-7489" alt="Infrastructure-Details" src="{{site.url}}/blog-assets/2013/09/Infrastructure-Details1.png" width="629" height="494" />]({{site.url}}/blog-assets/2013/09/Infrastructure-Details1.png)

Click the “Create Deployment” button to provision your server.

<p dir="ltr">
  Fortunately the StrongLoop install pack is very lightweight so your newly configured StrongLoop Node server will be ready in a few minutes.  When you see the Server Status &#8220;go Green” you know your server is up and waiting for you.
</p>

 <img alt="" src="https://lh4.googleusercontent.com/3l74d9lvGcibf-w10G6ghUpEX0GDEGK8JxgyCZPEongQuHx7o7EIMEYqyasXfNa52DCdid9LeZnKT9h1WBuueadygWrdLuZVw6RtmfjOVTkGnE09oUEYHo8l" width="191px;" height="44px;" />

<h2 dir="ltr">
  Start Server, receive Open Node MBaaS
</h2>

<p dir="ltr">
  Now that you&#8217;re newly created StrongLoop server is up.  Lets take a look at what you get.
</p>

<img alt="" src="https://lh3.googleusercontent.com/gRsu7SWtDEjBuGTTrldjzEuz7aOvagpSOG5J8M14gjQOnHDmn1MZ3aaS37zdhkCsXm3MFiXddw4KaFrJMftndsrOqlFx9t3s6Q4EWn3QiVWtcSd4mucY3ebTRg" width="595px;" height="177px;" />

<p dir="ltr">
  The StrongLoop Suite has three main components:  StrongNode, StrongOps and &#8211; most important for this posting &#8211; LoopBack.  LoopBack is an open source Mobile API tier.  The rest of this post will show you how to configure your loopback server and connect it to a Native iOS mobile application.
</p>

<p dir="ltr">
  First take note of the public IP address that is presented to you once your server is activated.
</p>

<p dir="ltr">
  <img alt="" src="https://lh6.googleusercontent.com/Bfo8UkN9ORGCTdjRCoHK6DKuV2HwStMINsYngcY66Cb2J94KpNRJAABfLlxkccFXul4c2HOXuEb9MG9Yyb2d-FUHqeAWUcVhfk3NH1j6x-hru7zwmPwcB9Yg" width="756px;" height="205px;" />
</p>

<p dir="ltr">
  We will use this IP address to configure the native mobile adapter allowing the iOS LoopBack SDK to connect to your mobile backend.  Let&#8217;s download the iOS example apps from the <a href="https://github.com/strongloop-community/loopback-examples-ios">https://github.com/strongloop-community/loopback-examples-ios</a> Github repo.  The LoopBack examples Repo has sample code to show you how to connect your mobile application to the LoopBack server using the native LoopBack SDK.  You can find additional documentation about LoopBack and the iOS SDK at the StrongLoop docs site <a href="http://docs.strongloop.com">docs.strongloop.com</a> .  This article will show you how to connect to the UITableView example, however configuring the MapView and custom remote method sample can easily be configured.
</p>

<p dir="ltr">
  <a href="http://strongloop.com/wp-content/uploads/2013/09/iphone-examples-3.png"><img class="alignnone  wp-image-6786" alt="iphone-examples-3" src="http://strongloop.com/wp-content/uploads/2013/09/iphone-examples-3.png" width="532" height="312" /></a>
</p>

<p dir="ltr">
  Once you have the repository cloned to your iOS development machine.
</p>

<p dir="ltr">
  $git clone git@github.com:strongloop-community/loopback-examples-ios.git
</p>

<p dir="ltr">
  Open the tableview-example.xcodeproj located at &#8216;loopback-examples-ios/ios-tableview-simple-example/tableview-example.xcodeproj&#8217;
</p>

<p dir="ltr">
  The loopback-examples-ios applications has a LoopBack mobile server bundled with the repo &#8216;/loopback-examples-ios/loopback-nodejs-server&#8217; that can be run on the developers host machine by calling &#8216;slc run app.js&#8217; from within the server folder.  However, for this demo we will be leveraging our newly-provisioned LoopBack instance on the RackSpace cloud infrastructure.
</p>

<p dir="ltr">
  Verify the Loopback server is running on the rackspace installation and the &#8216;products&#8217; endpoint is available.  Open a web browser and point it to the LoopBack API explorer that come pre-configured with your LoopBack instance <a href="http://localhost:3000/explorer/">http://HOST-IP-ADDRESS:3000/explorer/</a>.
</p>

<p dir="ltr">
  <a href="{{site.url}}/blog-assets/2013/09/LoopBack-Explorer-Products-Post.png"><img class="alignnone size-full wp-image-7313" alt="LoopBack-Explorer-Products-Post" src="{{site.url}}/blog-assets/2013/09/LoopBack-Explorer-Products-Post.png" width="796" height="529" /></a>
</p>

<p dir="ltr">
  Now that you have your StrongLoop Suite (Strong-Node, Strong-Ops and LoopBack) up and configured in your Rackspace environment, you can simply configure the native iOS application to point to the mobile API.
</p>

<p dir="ltr">
  From within XCode project open the AppDelegate.m file and configure the adapter URL to &#8220;http://RACKSPACE_IP_ADDRESS&#8221;.
</p>

<p dir="ltr">
  <a href="{{site.url}}/blog-assets/2013/09/iOS-ConfigureAdapter.png"><img class="alignnone size-full wp-image-7315" alt="iOS-ConfigureAdapter" src="{{site.url}}/blog-assets/2013/09/iOS-ConfigureAdapter.png" width="762" height="475" /></a>
</p>

<p dir="ltr">
  Run the Application in the XCode iOS simulator with by Pressing the Run button in the top left or using the hotkey combination (?+R) . From the simulator Click the &#8216;Inject Data&#8217; button in the top left to insert 3 &#8216;product&#8217; model instances into the LoopBack server.  Naturally you will see the Records appear on the mobile device, but you can also verify the server content by opening the API Explorer <a href="http://localhost:3000/explorer/#!/products/products_find_get_4 ">http://localhost:3000/explorer/#!/products/products_find_get_4 </a> to the Get Request and pressing the &#8216;Try it out&#8217; button.
</p>

[<img class="alignnone size-full wp-image-6789" alt="Screen Shot 2013-09-17 at 7.51.47 AM" src="http://strongloop.com/wp-content/uploads/2013/09/Screen-Shot-2013-09-17-at-7.51.47-AM.png" width="752" height="565" />](http://strongloop.com/wp-content/uploads/2013/09/Screen-Shot-2013-09-17-at-7.51.47-AM.png)

Additionally, you can add data to the backend from the API Explorer as well from the &#8216;POST&#8217; button by inserting the model JSON data { &#8220;name&#8221;: &#8220;Matts Product&#8221;, &#8220;inventory&#8221; : 22 }  in the &#8216;Value&#8217; field. Pressing Refresh on the mobile client will sync the tableView.

Notice the model definition is dynamic, allowing the mobile developer to dynamically add parameters to the &#8216;product&#8217; mobile model type; allowing the mobile developer to quickly extend and configure the Mobile Object to fit the applications need.  LoopBack also supports static schema configuration for situations where the model data may be directly bound to a traditional static data stores such as Oracle or MySql.

Take some time and explore the mobile application as well as the LoopBack Node server. You can find more detailed information on how LoopBack handles both static and dynamic model types at [http://docs.strongloop.com/loopback/#sanitizing-and-validating-models](http://docs.strongloop.com/loopback/#sanitizing-and-validating-models "http://docs.strongloop.com/loopback/#sanitizing-and-validating-models") ,and make and try give the integration a run on [Rackspace](http://Rackspace.com)

&nbsp;

<h2 dir="ltr">
  <img style="font-size: 13px;" alt="" src="https://lh6.googleusercontent.com/I0jBONX90Iu32pljk6JiepnFgUutkUqkie3KywlS9O2x4QUD9QTMaCXk1KrDWHZSnBW3WzwVSCt6N2zG85yWRJzUqrXxqTQhePXXIXJQk0KTqiSB8n8jPaXp" width="235px;" height="235px;" />
</h2>

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