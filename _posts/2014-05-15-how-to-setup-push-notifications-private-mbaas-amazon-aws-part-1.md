---
id: 16227
title: 'Part 1: Enable Push Notifications With a Private mBaaS Hosted on Amazon &#8211; Intro to LoopBack'
date: 2014-05-15T09:15:17+00:00
author: Chandrika Gole
guid: http://strongloop.com/?p=16227
permalink: /strongblog/how-to-setup-push-notifications-private-mbaas-amazon-aws-part-1/
categories:
  - How-To
  - LoopBack
---
This is part one of a four-part tutorial on setting up a mobile backend as a service on Amazon and iOS and Android client applications to enable push notification. To send push notifications, you&#8217;ll need to create a LoopBack server application, then configure your iOS and Android client apps accordingly.

What&#8217;s [LoopBack](http://docs.strongloop.com/loopback)? It&#8217;s an open-source API server for Node.js applications. It enables mobile apps to connect to enterprise data through models that use pluggable [data sources and connectors](http://docs.strongloop.com/loopback-datasource-juggler/#loopback-datasource-and-connector-guide). Connectors provide connectivity to backend systems such as databases. Models are in turn exposed to mobile devices through REST APIs and client SDKs.

<img class="aligncenter size-full wp-image-14996" alt="loopback_logo" src="{{site.url}}/blog-assets/2014/04/loopback_logo.png" width="1590" height="498"  />

- Part one shows how to use slc to create a backend service on Amazon to send push notifications to different iOS devices.
- <a title="Part two" href="https://strongloop.com/strongblog/how-to-setup-push-notifications-private-mbaas-amazon-aws-part-2/">Part Two</a> explains how to setup and create an Android app to receive push notifications.
- <a title="Part three" href="http://strongloop.com/strongblog/how-to-setup-push-notifications-private-mbaas-amazon-aws-part-3/">Part Three</a> explains how to setup and create an iOS app to receive push notifications.
- <a title="Part four" href="https://strongloop.com/strongblog/how-to-setup-push-notifications-private-mbaas-on-amazon-aws-part-4/">Part Four</a> explains how to use LoopBack&#8217;s swagger REST api and send/receive push notifications on your android and iOS devices.

You can use the StrongLoop AMI as a starting point for building a backend node application using the slc command line tools. Using this same app Mobile developers can dynamically manage ‘mobile object’ schemas directly from the LoopBack SDK as they are building their mobile app. The pre-built StrongLoop AMI makes it easy for Node developers who’ve chosen Amazon as their infrastructure provider to get up and running, fast.<!--more-->

## **Overview**

Push notifications enable server applications (known as _providers_ in push parlance) to send information to mobile apps even when the app isn’t in use.  The device displays the information using a &#8220;badge,&#8221; alert, or pop up message.  A push notification uses the service provided by the device&#8217;s operating system:

- <strong>iOS</strong> &#8211; Apple Push Notification service (APNS)
- <strong>Android</strong> &#8211; Google Cloud Messaging (GCM)

The following diagram illustrates how it works.

[<img class="alignnone size-full wp-image-16408" alt="Push notification service" src="{{site.url}}/blog-assets/2014/05/Push-notification-service1.png" width="941" height="214" />]({{site.url}}/blog-assets/2014/05/Push-notification-service1.png)

The components involved on the server are:

- Device model and APIs to manage devices with applications and users.
- Application model to provide push settings for device types such as iOS and Android.
- Notification model to capture notification messages and persist scheduled notifications.
- Optional job to take scheduled notification requests.
- Push connector that interacts with device registration records and push providers APNS for iOS apps and GCM for Android apps.
- Push model to provide high-level APIs for device-independent push notifications.

## **Prerequisites**

Before starting this tutorial:
- Be sure you have an <a href="http://aws.amazon.com/">Amazon AWS</a> account.-

For setting up Push Notifications for an iOS app &#8211;

- <strong><a href="http://docs.strongloop.com/display/DOC/Client+SDKs">Download the LoopBack iOS SDK</a></strong>
- <strong><a href="https://developer.apple.com/xcode/downloads/">Install Xcode</a></strong></span>
   
For setting up Push Notifications for an android app &#8211;</span></span> <ul>
 
- <strong><a href="http://strongloop.com/mobile/android/">Download the LoopBack Android SDK</a></strong>
- <strong><a href="http://developer.android.com/sdk/index.html">Install Eclipse development tools (ADT)</a></strong>

## **Set up mobile backend server on Amazon**

### Launch the instance

- Log in to your <a href="https://console.aws.amazon.com/">AWS Console</a> and select “EC2.”
- Browse images by selecting “AMIs” under the “Images” drop down.  Make sure the filtering shows “Public Images” , “All Images” and “All Platforms”.  From here you can simply search “StrongLoop&#8221; and select the latest version. Current &#8211; StrongLoop-slc v2.5.2 (node v0.10.26)

<img title="StrongLoop > How to setup Push Notifications and an mBaaS on Amazon - LoopBack mBaaS > EC2.png" alt="" src="http://docs.strongloop.com/download/attachments/2296037/EC2.png?version=1&modificationDate=1400094392000&api=v2" width="800" data-image-src="/download/attachments/2296037/EC2.png?version=1&modificationDate=1400094392000&api=v2" data-linked-resource-id="2261629" data-linked-resource-type="attachment" data-linked-resource-default-alias="EC2.png" data-base-url="http://docs.strongloop.com" data-linked-resource-container-id="2296037" data-location="StrongLoop > How to setup Push Notifications and an mBaaS on Amazon - LoopBack mBaaS > EC2.png" />

Launch a new instance from the console using this AMI. Once the instance is up and running, you can remote <strong>ssh</strong> into your newly created server instance using the same ec2-keypair and the machine instance ID.

```js
$ssh -i ec2-keypair ec2-user@ec2-54-222-22-59.us-west-1.compute.amazonaws.com
```
### Create the application

The slc command-line tool and MongoDB are pre-installed in the StrongLoop AMI. Run mongodb as ~/mongodb/bin/mongod &. You may need to use sudo.

1. Using the slc command line tool create a loopback application &#8211;
  
```js
slc lb project push
cd push
```
If your app is created successfully, at the tail end of console output, you should see something like this:
    
```js
Create a model in your app:
$ cd push
$ slc lb model product -i
Optional: To view your Project in the StrongOps dashboard
$ slc strongops
Run your Project:
$ slc run .
```

2. Add loopback-push-notification and loopback-connector-mongodb as dependencies in package.json: 

```js
"dependencies": {
    "loopback": "~1.7.0",
    "loopback-push-notification": "~1.2.0",
    "loopback-connector-mongodb": "~1.2.0"
  },
```

Install the dependencies:

```js
$ npm install
```

3. Add the MongoDB connection string in datasource.json: 

```js
"db": {
    "defaultForType": "db",
    "connector": "mongodb",
    "url": "mongodb://localhost/demo"
  },
```
    
<strong>NOTE</strong>:  To try out an example, you can replace the app.js file in your application with <a href="https://github.com/strongloop/loopback-push-notification/blob/master/example/server/app.js">this</a>. You will also need the <a href="https://github.com/strongloop/loopback-push-notification/blob/master/example/server/config.js">config.js</a> file to save your configurations. Alternatively, if you want to enable push notifications for your own application using the loopback-push-notification module, follow the steps below (5-8).

Create a push model: To send push notifications, you must create a push model.  The code below illustrates how to do this with a database as the data source. The database is used to load and store the corresponding application/user/installation models.

```js
var loopback = require('loopback');
var app = loopback();
var db = require('./data-sources/db');
// Load & configure loopback-push-notification
var PushModel = require('loopback-push-notification')(app, { dataSource: db });
var Application = PushModel.Application;
var Installation = PushModel.Installation;
var Notification = PushModel.Notification;
```

Register a mobile(client) application: The mobile application needs to register with LoopBack so it can have an identity for the application and corresponding settings for push services. Use the Application model&#8217;s <code>register()</code> function for sign-up.  For information on getting API keys, see:

- <a href="http://docs.strongloop.com/display/DOC/Push+notifications+for+Android+apps#PushnotificationsforAndroidapps-GetyourGoogleCloudMessagingcredentials" rel="nofollow">Get your Google Cloud Messaging credentials</a> for Android.
- <a href="http://docs.strongloop.com/display/DOC/Creating+push+notifications#Creatingpushnotifications-SetupiOSclients">Set up iOS clients</a> for iOS.

```js
Application.register('put your developer id here',
    'put your unique application name here',
    {
      description: 'LoopBack Push Notification Demo Application',
      pushSettings: {
        apns: {
          certData: readCredentialsFile('apns_cert_dev.pem'),
          keyData: readCredentialsFile('apns_key_dev.pem'),

          pushOptions: {
          },
          feedbackOptions: {
            batchFeedback: true,
            interval: 300
          }
        },
        gcm: {
          serverApiKey: 'your GCM server API Key'
        }
      }
    },
    function(err, app) {
      if (err) return cb(err);
      return cb(null, app);
    }
  );

function readCredentialsFile(name) {
 return fs.readFileSync(
   path.resolve(__dirname, 'credentials', name),
   'UTF-8'
 );
}
```

Register a mobile device: The mobile device also needs to register itself with the backend using the Installation model and APIs. To register a device from the server side, call the <code>Installation.create()</code> function, as shown in the following example:

```js
Installation.create({
    appId: 'MyLoopBackApp',
    userId: 'raymond',
    deviceToken: '756244503c9f95b49d7ff82120dc193ca1e3a7cb56f60c2ef2a19241e8f33305',
    deviceType: 'ios',
    created: new Date(),
    modified: new Date(),
    status: 'Active'
}, function (err, result) {
    console.log('Registration record is created: ', result);
});
```

Most likely, the mobile application registers the device with LoopBack using REST APIs or SDKs from the client side, for example:
  
```js
POST http://localhost:3010/api/installations
    {
        "appId": "MyLoopBackApp",
        "userId": "raymond",
        "deviceToken": "756244503c9f95b49d7ff82120dc193ca1e3a7cb56f60c2ef2a19241e8f33305",
        "deviceType": "ios"
    }
```

Send out the push notification. LoopBack provides two Node.js methods to select devices and send notifications to them:

- <code><a href="http://apidocs.strongloop.com/loopback-push-notification/#pushmanagernotifybyidinstallationid-notification-cb" rel="nofollow">notifyById()</a></code>: Select a device by registration ID and send a notification to it.
- <code><a href="http://apidocs.strongloop.com/loopback-push-notification/#pushmanagernotifybyqueryinstallationquery-notification-cb" rel="nofollow">notifyByQuery()</a></code>: Get a list of devices using a query (same as the <strong>where</strong> property for <code>Installation.find()</code>) and send a notification to all of them.

For example, the code below creates a custom endpoint to send out a dummy notification for the selected device:
  
```js
var badge = 1;app.post('/notify/:id', function (req, res, next) {
 var note = new Notification({
   expirationInterval: 3600, // Expires 1 hour from now.
   badge: badge++,
   sound: 'ping.aiff',
   alert: '\uD83D\uDCE7 \u2709 ' + 'Hello',
   messageFrom: 'Ray'
 });

 PushModel.notifyById(req.params.id, note, function(err) {
   if (err) {
     // let the default error handling middleware
     // report the error in an appropriate way
     return next(err);
   }
   console.log('pushing notification to %j', req.params.id);
   res.send(200, 'OK');
 });
});
```

To select a list of devices by query, use the <code>PushModel.notifyByQuery()</code>, for example:

```js
PushModel.notifyByQuery({userId: {inq: selectedUserIds}}, note, function(err) {
   console.log('pushing notification to %j', selectedUserIds);
 });
```

## **What&#8217;s Next**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">To setup and create an Android app to receive push notifications go to <a title="Part Two" href="https://strongloop.com/strongblog/how-to-setup-push-notifications-private-mbaas-amazon-aws-part-2/">Part Two</a></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">To setup and create an iOS app to receive push notifications go to <a title="Part Three" href="http://strongloop.com/strongblog/how-to-setup-push-notifications-private-mbaas-amazon-aws-part-3/">Part Three</a></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">To use LoopBack&#8217;s swagger REST api and send/receive push notifications on your android and iOS devices go to <a title="Part Four" href="https://strongloop.com/strongblog/how-to-setup-push-notifications-private-mbaas-on-amazon-aws-part-4/">Part Four</a></span>
</li>
