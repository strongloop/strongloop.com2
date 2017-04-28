---
id: 16247
title: 'Part 4: Enable Push Notifications With a Private mBaaS Hosted on Amazon &#8211; Putting It All Together'
date: 2014-05-15T09:12:50+00:00
author: Chandrika Gole
guid: http://strongloop.com/?p=16247
permalink: /strongblog/how-to-setup-push-notifications-private-mbaas-on-amazon-aws-part-4/
categories:
  - Community
  - How-To
  - LoopBack
  - Mobile
---
This is the last section of a four-part tutorial on setting up a mobile backend as a service on Amazon and setting up iOS and Android client applications to enable push notifications. In this section we&#8217;ll explain how to run the backend LoopBack application, register the client applications & devices with LoopBack and send PUSH notifications.

If you haven&#8217;t done so already, please go to [Part One](http://strongloop.com/strongblog/how-to-setup-push-notifications-private-mbaas-amazon-aws-part-1/ "Part One") to setup your backend LoopBack application server on Amazon. To setup and create an Android app to receive push notifications go to [Part Two](http://strongloop.com/?p=16237 "Part Two"). To setup and create an iOS app to receive push notifications go to [Part Three](http://strongloop.com/strongblog/how-to-setup-push-notifications-private-mbaas-amazon-aws-part-3/ "Part Three").<!--more-->

## **Run the backend sever**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Make sure you have followed the steps in <a title="Part 1" href="http://strongloop.com/strongblog/how-to-setup-push-notifications-private-mbaas-amazon-aws-part-1/">Part One</a> to create your backend application and you have setup the credentials and api keys for your iOS and android applications.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><span style="font-size: 18px;">Run the application as node app.js. If the app runs successfully, you should see this:</span></span> ```js
[ec2-user@ip-10-252-201-3 push]$ node app.js
connect.multipart() will be removed in connect 3.0
visit https://github.com/senchalabs/connect/wiki/Connect-3.0 for alternatives
connect.limit() will be removed in connect 3.0
Browse your REST API at http://0.0.0.0:3000/explorer
LoopBack server listening @ http://0.0.0.0:3000/
Registering a new Application...
Application id: "loopback-push-notification-app"
```js
</li>

<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><span style="font-size: 18px;">You can access the swagger REST API explorer which comes with the LoopBack app at <code>http://<server_IP_address>:3000/explorer</code></span></span><a href="{{site.url}}/blog-assets/2014/05/Screen-Shot-2014-05-14-at-3.35.53-PM.png"><img class="alignnone  wp-image-16303" alt="Screen Shot 2014-05-14 at 3.35.53 PM" src="{{site.url}}/blog-assets/2014/05/Screen-Shot-2014-05-14-at-3.35.53-PM.png" width="796" height="290" /></a>
</li>

## **Receive Push Notifications for Android Client application**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Make sure you have created and setup your Android client application by following steps in <a title="Part Two" href="http://strongloop.com/strongblog/how-to-setup-push-notifications-private-mbaas-amazon-aws-part/">Part Two</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Set up the REST Adaptor in: <code>src/com/google/android/gcm/demo/app/DemoApplication.java</code> to your server&#8217;s IP address.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Click the green &#8220;Run&#8221; button in the toolbar to run the application. Run it as an Android application. You will be prompted to select the target on which to run the application. Select the AVD you created earlier in Part Two</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><span style="font-size: 18px;">Register your application with LoopBack:</span></span> <ul>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">Since you have set your <code>gcmServerApiKey</code> and <code>appName</code> in <code>config.js</code>, your application will be registered with LoopBack when you run the server.</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">You can verify this using this GET request: <code>/api/applications</code>.</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">You can registered any application using this POST request: <code>/api/applications</code>.</span>
    </li>
  </ul>
</li>

<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><span style="font-size: 18px;">Register your device:</span></span> <ul>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">If the AVD launches and the app gets installed successfully, the device will be registered with the backend and you should be able to verify the installation using GET request <code>/api/installations</code>.</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">You should also be able to see the GCM application on your android emulator. You will need the &#8220;id&#8221; from the to send the push notification to the device. You can also get the id from the <code>/api/installations</code><br /> <a href="{{site.url}}/blog-assets/2014/05/Screen-Shot-2014-05-13-at-4.34.49-PM.png"><img class="size-full wp-image-16299 aligncenter" alt="Screen Shot 2014-05-13 at 4.34.49 PM" src="{{site.url}}/blog-assets/2014/05/Screen-Shot-2014-05-13-at-4.34.49-PM.png" width="318" height="499" /></a><br /> </span>
    </li>
  </ul>
</li>

<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><span style="font-size: 18px;">To send a Push Notification:</span></span> ```js
curl -X POST http://ec2-54-184-36-164.us-west-2.compute.amazonaws.com:3000/notify/installation_id
OK
```js
</li>

<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><span style="font-size: 18px;">You should receive a notification on your emulator and it should look somewhat like this:<br /> </span></span><center>
    <a href="{{site.url}}/blog-assets/2014/05/Screen-Shot-2014-05-13-at-4.43.31-PM.png"><img class="alignnone size-full wp-image-16300" alt="Screen Shot 2014-05-13 at 4.43.31 PM" src="{{site.url}}/blog-assets/2014/05/Screen-Shot-2014-05-13-at-4.43.31-PM.png" width="319" height="493" /></a>
  </center>
</li>

&nbsp;

## **Receive Push Notifications for iOS Client application**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Make sure you have created and setup your Android client application by following steps in <a title="Part three" href="http://strongloop.com/strongblog/how-to-setup-push-notifications-private-mbaas-amazon-aws-part-3/">Part Three</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Make sure you have set the <code>RootPath</code> in <code>apnagent/Settings.plist</code> set to your server&#8217;s IP address.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Your registered device should be connected to your computer.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><span style="font-size: 18px;">Register your application with LoopBack:</span></span> <ul>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">Register your application using this POST request to <code>/api/applications</code>.</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">You can verify that the app is registered using this GET request to <code>/api/applications</code>.</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">You need the &#8220;id&#8221; from the response to identify the client application. In your client app, edit Settings.plist and set AppId to the ID from the previous step.</span>
    </li>
  </ul>
</li>

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Run your XCode application and remember to connect your registered device. Select your device while running the app.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><span style="font-size: 18px;">Register your device:</span></span> <ul>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">If the app runs successfully, the iOS device will be registered with the backend and you should be able to verify the installation using GET request <code>/api/installations</code>.</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">You should also be able to see the apnagent application on your phone. Click on Register Device and you should get an alert with the registration number.</span><img class="thumbnail aligncenter" style="max-width: 100%;" alt="" src="{{site.url}}/blog-assets/2014/05/xcode1.png" /><img class="aligncenter" title="StrongLoop > How to setup Push Notifications and an mBaaS on Amazon - Putting it all together > Screen Shot 2014-05-14 at 12.25.44 PM.png" alt="" src="http://docs.strongloop.com/download/attachments/2296052/Screen%20Shot%202014-05-14%20at%2012.25.44%20PM.png?version=1&modificationDate=1400095581000&api=v2" data-image-src="/download/attachments/2296052/Screen%20Shot%202014-05-14%20at%2012.25.44%20PM.png?version=1&modificationDate=1400095581000&api=v2" data-linked-resource-id="2261631" data-linked-resource-type="attachment" data-linked-resource-default-alias="Screen Shot 2014-05-14 at 12.25.44 PM.png" data-base-url="http://docs.strongloop.com" data-linked-resource-container-id="2296052" data-location="StrongLoop > How to setup Push Notifications and an mBaaS on Amazon - Putting it all together > Screen Shot 2014-05-14 at 12.25.44 PM.png" />
    </li>
  </ul>
  
  <p>
    &nbsp;</li> 
    
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;"><span style="font-size: 18px;">To send a Push Notification using REST API:</span></span> ```js
curl -X POST http://ec2-54-184-36-164.us-west-2.compute.amazonaws.com:3000/notify/device_registration_id
OK
```js
    </li>
    
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">You should receive a notification on your device and it should look somewhat like this:</span><img class="aligncenter" title="StrongLoop > How to setup Push Notifications and an mBaaS on Amazon - Putting it all together > Screen Shot 2014-05-14 at 12.24.20 PM.png" alt="" src="http://docs.strongloop.com/download/attachments/2296052/Screen%20Shot%202014-05-14%20at%2012.24.20%20PM.png?version=1&modificationDate=1400095596000&api=v2" data-image-src="/download/attachments/2296052/Screen%20Shot%202014-05-14%20at%2012.24.20%20PM.png?version=1&modificationDate=1400095596000&api=v2" data-linked-resource-id="2261632" data-linked-resource-type="attachment" data-linked-resource-default-alias="Screen Shot 2014-05-14 at 12.24.20 PM.png" data-base-url="http://docs.strongloop.com" data-linked-resource-container-id="2296052" data-location="StrongLoop > How to setup Push Notifications and an mBaaS on Amazon - Putting it all together > Screen Shot 2014-05-14 at 12.24.20 PM.png" />
    </li></ol> </ol> 
    
    <p>
      You can get the full example with the server and client applications on <a href="https://github.com/strongloop/loopback-push-notification/tree/master/example">GitHub</a>.
    </p>
    
    <h2>
      <strong>What’s next?</strong>
    </h2>
    
    <ul>
      <li style="margin-left: 2em;">
        <span style="font-size: 18px;">Install LoopBack with a <a href="http://strongloop.com/get-started/">simple npm command</a></span>
      </li>
      <li style="margin-left: 2em;">
        <span style="font-size: 18px;">What’s in the upcoming Node v0.12 version? <a href="http://strongloop.com/strongblog/performance-node-js-v-0-12-whats-new/">Big performance optimizations</a>, read the blog by Ben Noordhuis to learn more.</span>
      </li>
      <li style="margin-left: 2em;">
        <span style="font-size: 18px;">Need performance monitoring, profiling and cluster capabilities for your Node apps? Check out <a href="http://strongloop.com/node-js-performance/strongops/">StrongOps</a>!</span>
      </li>
    </ul>