---
id: 6640
title: 'Building an in house Enterprise App Store with Titanium and StrongLoop Node.js &#8211; Part 2 of 3'
date: 2013-09-12T11:04:05+00:00
author: Matt Schmulen
guid: http://blog.strongloop.com/?p=815
permalink: /strongblog/building-an-in-house-enterprise-app-store-with-titanium-and-strongloop-node-js-part-2-of-3/
categories:
  - How-To
---
# <a style="font-size: 13px;" href="http://strongloop.com/wp-content/uploads/2013/06/appstoreThreeScreens.png"><img class="size-full wp-image-785 alignnone" alt="appstoreThreeScreens" src="http://strongloop.com/wp-content/uploads/2013/06/appstoreThreeScreens.png" width="254" height="149" /></a>

<p dir="ltr">
  In the last <a title="blog post" href="http://blog.strongloop.com/part-1-use-node-js-and-titanium-to-build-an-on-premise-enterprise-app-store/">blog post</a> we created a Simple Appcelerator Titanium iOS app that retrieved a list of public iTunes Mobile Applications that employees could easily install from their mobile application.
</p>

<p dir="ltr">
  In part two of our three part series we will extend our Titanium application to Support Android and package our CommonJS ‘StrongLoop.js’ data access later as a Titanium Module. This will make it easier to reuse Node.js services across other Appcelerator Titanium Apps. We will also add an additional ‘internal’ tab to our app to signify applications that are private to only company employees and hosted ‘behind the firewall’ on our corporates our on-premises servers.
</p>

<p dir="ltr">
  Because<a href="http://blog.strongloop.com/announcing-strongloop-node-1-1-advanced-debugging-clustering-monitoring-and-private-npm-registries/"> StrongLoop released 1.1 </a>since our last update, I&#8217;ve updated the node server to take full advantage of the new <a href="http://blog.strongloop.com/announcing-a-new-and-improved-node-js-debugger/">node-inspector debugger</a> integration that is now supported in the StrongLoop CLI. This allows you to debug your application with a single command ($snode debug app.js ) from within the node server folder.
</p>

<img class="alignleft size-full wp-image-1352" alt="debugging" src="http://strongloop.com/wp-content/uploads/2013/08/debugging.png" width="2546" height="1456" />

<p dir="ltr">
  Finally, there has been some housekeeping maintenance.  The github project is now located under our strongloop-community repo while the mobile application and the server have been consolidated into a single repo. These changes mean it is easier to get started! Just git clone the strongloop-community/titanium-appstore-sample open and run the Titanium project ‘sampleAppStoreTitanium’. Then ‘slnode run app.js’ from within the appstore-nodejs-server folder to run your node server.
</p>

## **<span style="color: black;">Getting Started </span>**

<p dir="ltr">
  You can pick up where we left off or simply download the new project at github.com/strongloop-community/titanium-appstore-sample and run it. If you have the <a href="https://github.com/appcelerator/titanium">Titanium node CLI</a> installed and configured you can use the following commands:
</p>

 `$git clone git@github.com:strongloop-community/strongloop-titanium-appstore.git`

`$cd /strongloop-titanium-appstore/appstore-nodejs-server; slnode run app.js`

 `$cd  /strongloop-titanium-appstore/sampleAppStoreTitanium; titanium build -platform android<br />
` 

If you&#8217;re just getting started, make sure to download and install the [StrongLoop Node.js distro](http://strongloop.com/products) and [Appcelerator’s Titanium Studio](http://appcelerator.com) and the required iOS and Android SDKs.

## **<span style="color: black;">Adding Android Support to our App </span>**

Adding Android support for your titanium app is simple! Just open your tiapp.xml and make sure the Android box is checked.

<img class="wp-image-1351 alignnone" style="color: #333333; font-style: normal; line-height: 24px; border-color: #bbbbbb; background-color: #eeeeee;" alt="Titanium-enable-android" src="http://strongloop.com/wp-content/uploads/2013/08/Titanium-enable-android.png" width="208" height="139" />

We will have to make a few changes to the [WindowAppDetail.js](https://github.com/strongloop-community/strongloop-titanium-appstore/blob/master/sampleAppStoreTitanium/Resources/ui/handheld/WindowAppDetail.js) file to support platform differences when opening an App. iOS uses the url schema, while Android leverages intents. Simply add a branch conditional inside the [WindowAppDetail.js](https://github.com/strongloop-community/strongloop-titanium-appstore/blob/master/sampleAppStoreTitanium/Resources/ui/handheld/WindowAppDetail.js) file to perform the platform specific action for iOS and Android.

## Adding internal enterprise apps to our catalog

<p dir="ltr">
  We also need to add an additional tab to show Internal Enterprise Applications that are installed from the Application Catalog hosted on our Node.js server. These applications do not need to be submitted to the consumer facing Apple iTunes or the Android Market. This critical feature adds an additional layer of security to your applications, allowing you to control who gets access to your companies mobile applications.
</p>

<p dir="ltr">
  The internal app tab defined in WindowAppListingInternalApps.js is very similar to the WindowAppListingPublicApps.js tab. The only difference is that we specify a different endpoint for our REST-ful model endpoints.
</p>

 `self.refreshData = function() {<br />
Ti.API.info(" self.refreshData ");<br />
var StrongLoop = require('StrongLoop');<br />
StrongLoop.getData("privateApps", function(data) {<br />
self.updateTableView(data);<br />
}, function() {<br />
Ti.API.info(" error");<br />
);<br />
<span style="font-family: Monaco, Consolas, 'Andale Mono', 'DejaVu Sans Mono', monospace; font-size: 13px; font-style: normal; line-height: normal;">}//end refreshData</span>` 

Now that the client is updated for Android you can build and run the android and iPhone client. However, you are not going to get Internal App listing until you update the app listing on the StrongLoop node.js server.

## **<span style="color: black;">Adding another service to your Node.js server for internal applications</span>**

<p dir="ltr">
  Since our Node.js server app takes advantage of express.js and routing we can simply add another <a href="https://github.com/strongloop-community/strongloop-titanium-appstore/blob/master/appstore-nodejs-server/routes/index.js#L24">route to the index.js</a> file that publishes a private apps route
</p>

`app.get('/json/privateApps/:id', dataStorePrivateApps.findById); app.get('/json/privateApps', dataStorePrivateApps.findAll);<br />
` 

our new [privateapps.js](https://github.com/strongloop-community/strongloop-titanium-appstore/blob/master/appstore-nodejs-server/routes/privateapps.js) is almost identical to our publicapps.js route except the mobile app content (iPA, .appk , icon files ) references files that are hosted on local server, in this case they are in our public folder under ‘public/internalApps/’ . This allows us to avoid publishing to the consumer facing appstore and keep sensitive internal enterprise apps behind our firewall and within our corporate IT policy. Its important to note that you must have an Apple Enterprise account to publish iPhone and iPad apps in this way. You must also generate a .plist to help the iOS device find the correct installation bath to iPhone executables, icons, and update versions.

<p dir="ltr">
  Android has no such restrictions so simply the .apk file and any support resources such as image icon files are enough for us to install internal enterprise Android app. Just remember to tell your user to allow ‘unsigned’ .apk files if your not key signing your android .apk files. Bundled into this demo are some sample .apk and iOS apps for placeholder until you stock your own shelves with your own app catalog.
</p>

<p dir="ltr">
  The source code for both the mobile application and the node.js server app is available on Github here<a href="https://github.com/strongloop-community/strongloop-titanium-appstore"> https://github.com/strongloop-community/strongloop-titanium-appstore</a>.
</p>

<p dir="ltr">
  Supporting both Android and iOS applications is critical in a BYOD world; and a strategy to distribute these applications enables employees to make the most of their mobile device.  Currently the sample application makes it easy for employees to download apps, the current setup is not very maintainable.  Adding applications to the system by modifying the applications javascript file is difficult to maintain and fragile to migrate.  To make the system usable we need to add a Data store such as MongoDB to keep track of our applications and make it easy to extend our Node application features.
</p>

In the next post, we will add a Mobile API middle tier framework that makes it easy to leverage a MongoDB datastore. This will replace our static JSON content with a system that is more maintainable, robust and extendable.

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