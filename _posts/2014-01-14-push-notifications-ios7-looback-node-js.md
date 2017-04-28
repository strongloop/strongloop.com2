---
id: 13024
title: Getting Started with iOS Push Notifications in LoopBack
date: 2014-01-14T08:21:11+00:00
author: Raymond Feng
guid: http://strongloop.com/?p=13024
permalink: /strongblog/push-notifications-ios7-looback-node-js/
categories:
  - How-To
  - LoopBack
  - Mobile
---
We are pleased to announce that you can now send push notifications to mobile devices (iOS and Android) using [LoopBack](http://strongloop.com/mobile-application-development/loopback/) with the release of the [loopback-push-notifications](https://github.com/strongloop/loopback-push-notification) module. What&#8217;s LoopBack? It&#8217;s an open source mobile backend, powered by Node.js, perfect for building API servers.

In this blog, we’ll walk you through a round trip of push notifications between a LoopBack Node.js server and a demo iOS application. (If you are looking for how to get [push notifications working in Android, check out this blog.](http://strongloop.com/strongblog/android-push-notifications-loopback-node-js/)) The server side is an instance of LoopBack with a simple web page to list device registration records and send out push notifications to selected devices. The client side is an iOS application that uses the LoopBack iOS SDK to register itself with the server and respond to push notifications. You can get the demo applications on Github from these links:

<li dir="ltr">
  <a href="https://github.com/strongloop/loopback-push-notification/tree/master/example/server">https://github.com/strongloop/loopback-push-notification/tree/master/example/server</a>
</li>
<li dir="ltr">
  <a href="https://github.com/strongloop/loopback-push-notification/tree/master/example/ios">https://github.com/strongloop/loopback-push-notification/tree/master/example/ios</a>
</li>

&nbsp;

<h2 dir="ltr">
  <strong>Example: the marketing dept wants to &#8220;push&#8221; a promotion</strong>
</h2>

To illustrate the end to end flow, let’s start with a simple scenario to understand what components and steps are involved. Let’s suppose the marketing department needs to send a promotion to all users on the company’s iPhone application in the United States. What APIs are needed on the server side?

<li dir="ltr">
  Create the promotion message.
</li>
<li dir="ltr">
  Find all users whose address is in the United States.
</li>
<li dir="ltr">
  Find the iOS device tokens associated with the users found from step 2.
</li>
<li dir="ltr">
  Send out notifications for each matching iOS device through Apple’s APNS.
</li>

LoopBack’s push notification service provides the facilities for the server-side to produce and send notifications to mobile devices. The models involved are:

<li dir="ltr">
  <strong>Notification model:</strong> it encapsulates a notification object, including the application message and other mobile platform properties, such as expiry, badge, and sound.
</li>
<li dir="ltr">
  <strong>User model:</strong> it manages the mobile users. We can query the user model to decide what users are the target of a given push notification.
</li>
<li dir="ltr">
  <strong>Installation model:</strong> it manages installations of client application on mobile devices. This way, we can find out what devices are being used by applications and users. Other properties such as time zone and subscriptions also help the server side to decide if and when the notification should be sent.
</li>
<li dir="ltr">
  <strong>Push providers:</strong> they are responsible to interact with the cloud services to send out notifications. For example, there is a provider that connects to Apple’s push notification service (APNS) for iOS devices.
</li>

Now that we understand that the server side can identify devices of interest and push notifications to these devices, what about the client applications? How do we enable an iOS application to support push notifications?

<li dir="ltr">
  Provision an application with Apple and configure it to enable push notifications.
</li>
<li dir="ltr">
  Provide a hook to receive the device token when the application launches and register it with the LoopBack server using the LBInstallation class.
</li>
<li dir="ltr">
  Provide code to receive notifications, under three different mode for the mobile application: foreground, background, or offline.
</li>
<li dir="ltr">
  Process notifications.
</li>

Later in this blog, we’ll show you the necessary code to make your application capable of receiving notifications.

<h2 dir="ltr">
  <strong>The demo server application</strong>
</h2>

**Set up the push notification model**
  
The demo server is just a regular LoopBack instance. To support push notifications, we need to create a push model with a database based data source using the fooling code example. The database is used to load/store the corresponding application/user/installation models.

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

&nbsp;

**Sign up an client application with push settings**
  
To support push notifications, the mobile application needs to be registered with LoopBack so that we can have an identity for the application and corresponding settings for APNS.

First, we need to load the certificate and key files into strings.

```js
var fs = require('fs');
var path = require('path');

// You may want to use your own credentials here
exports.apnsCertData = readCredentialsFile('apns_cert_dev.pem');
exports.apnsKeyData =readCredentialsFile('apns_key_dev.pem'); 

//--- Helper functions ---
function readCredentialsFile(name) {
 return fs.readFileSync(
   path.resolve(__dirname, 'credentials', name),
   'UTF-8'
 );
}

The Application model has APIs for the sign-up.

 Application.register('strongloop',

   config.appName,
   {
     description: 'LoopBack Push Notification Demo Application',
     pushSettings: {
       apns: {
           certData: config.apnsCertData,
           keyData: config.apnsKeyData,
         pushOptions: {
         },
         feedbackOptions: {
           batchFeedback: true,
           interval: 300
         }
       },
       gcm: {
         serverApiKey: config.gcmServerApiKey
       }
     }
   },
   function(err, app) {
     if (err) return cb(err);
     return cb(null, app);
   }
 );
```

<p dir="ltr">
  <strong>Configure the database</strong>
</p>

By default, the demo application uses an in-memory database to store applications and installations. You can customize it by setting MONGODB environment variable to a URL that points to your MongoDB, for example:

`mongodb://127.0.0.1/demo.`

<p dir="ltr">
  <p dir="ltr">
    <strong>Start the demo application</strong>
  </p>
  
  <p>
    <code>$ node app</code>
  </p>
  
  <p>
    <code><a href="http://localhost:3010">http://localhost:3010</a></code>
  </p>
  
  <p dir="ltr">
    <p dir="ltr">
      <strong>Send notifications</strong>
    </p>
    
    <p>
      For the purpose of demonstration, we create a custom endpoint for the AngularJS client to send out a dummy notification for the selected device:
    </p>
    
    ```js
// Add our custom routes
var badge = 1;
app.post('/notify/:id', function (req, res, next) {
 var note = new Notification({
   expirationInterval: 3600, // Expires 1 hour from now.
   badge: badge++,
   sound: 'ping.aiff',
   alert: '\uD83D\uDCE7 \u2709 ' + 'Hello',
   messageFrom: 'Ray'
 });
 PushModel.notifyById(req.params.id, note, function(err) {
   console.log('pushing notification to %j', req.params.id);
 });
 res.send(200, 'OK');
});
```js
    
    <p>
      LoopBack provides two Node.js methods to select devices and send notifications to them.
    </p>
    
    <ul>
      <li dir="ltr">
        notifyById: Select a device by registratrion id and send a notification to it
      </li>
      <li dir="ltr">
        notifyByQuery: Select a list of devices by the query (same as the where property for Installation.find()) and send a notification to all of them.
      </li>
    </ul>
    
    <p>
      &nbsp;
    </p>
    
    <h2 dir="ltr">
      <strong>Prepare your iOS application</strong>
    </h2>
    
    <p dir="ltr">
      <strong>Add LoopBack iOS SDK as a framework</strong>
    </p>
    
    <p>
      Open your xcode project, select targets, under build phases, unfold &#8216;Link Binary with Libraries&#8217;, and click on &#8216;+&#8217; to add LoopBack framework.
    </p>
    
    <p>
      <img class="aligncenter" alt="" src="https://lh3.googleusercontent.com/XamcGhw0Cw9oIijJUbhErJ3DtiM95D9kwHYoFU9kw8nvwYtyDOYK8zfaQInjKIJwUpSn9wvTsmuozL4zXlecejzyzUTLrdVFo-hMD4IsVIfOGpK-7W3JQylLPw" width="624px;" height="243px;" />
    </p>
    
    <p>
      LoopBack iOS SDK provides the LBInstallation and LBPushNotification classes to simplify the push notification programming for iOS applications.
    </p>
    
    <ul>
      <li>
        <a style="font-size: 13px; line-height: 19px;" href="http://apidocs.strongloop.com/loopback-ios/api/interface_l_b_installation.html">http://apidocs.strongloop.com/loopback-ios/api/interface_l_b_installation.html</a>
      </li>
      <li>
        <a style="font-size: 13px; line-height: 19px;" href="http://apidocs.strongloop.com/loopback-ios/api/interface_l_b_push_notification.html">http://apidocs.strongloop.com/loopback-ios/api/interface_l_b_push_notification.html</a>
      </li>
    </ul>
    
    <p>
      LBInstallation allows the iOS application to register mobile devices with LoopBack. LBPushNotification provides a set of helper methods to handle common tasks for push notifications.
    </p>
    
    <p dir="ltr">
      <strong>Respond to application launch</strong>
    </p>
    
    <p>
      When the iOS application is launched, it should initialize an instance of LBRESTAdapter for the SDK to communicate with the LoopBack server. If the application is launched by an offline notification, we can get the message and process it.
    </p>
    
    ```js
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
   self.settings = [self loadSettings];

   // Instantiate the shared LBRESTAdapter. In most circumstances, you'll do this only once; putting that reference in a
   // singleton is recommended for the sake of simplicity. However, some applications will need to talk to more than one
   // server - create as many Adapters as you need.
   self.adapter = [LBRESTAdapter adapterWithURL:[NSURL URLWithString:self.settings[@"RootPath"]]];

   // Reference to Push notifs List VC

   self.pnListVC = (NotificationListVC *)[[(UINavigationController *)self.window.rootViewController viewControllers]
                                          objectAtIndex:0];

   LBPushNotification* notification = [LBPushNotification application:application
                                        didFinishLaunchingWithOptions:launchOptions];

   // Handle APN on Terminated state, app launched because of APN
   if (notification) {
       NSLog(@"Payload from notification: %@", notification.userInfo);
       [self.pnListVC addPushNotification:notification];
   }

   return YES;
}
```js
    
    <h3 dir="ltr">
    </h3>
    
    <p dir="ltr">
      <strong>Respond to device tokens</strong>
    </p>
    
    <p>
      An instance of the iOS application should receive a device token. The application needs to register the device token with other information such as appId, userId, timeZone, or subscriptions with the backend so that push notifications can be initiated from LoopBack by querying the installation model. The iOS application receives the device token from the <em>application:didRegisterForRemoteNotificationsWithDeviceToken</em> method.
    </p>
    
    ```js
__unsafe_unretained typeof(self) weakSelf = self;

   // Register the device token with the LoopBack push notification service

   [LBPushNotification application:application

didRegisterForRemoteNotificationsWithDeviceToken:deviceToken

                           adapter:self.adapter

                            userId:@"anonymous"

                     subscriptions:@[@"all"]

                           success:^(id model) {

                               LBInstallation *device = (LBInstallation *)model;

                               weakSelf.registrationId = device._id;

                           }

                           failure:^(NSError *err) {

                               NSLog(@"Failed to register device, error: %@", err);

                           }

    ];

   ...

}
```js
    
    <p>
      &nbsp;
    </p>
    
    <p>
      If your app fails to register for push notifications, the following method will be invoked:
    </p>
    
    ```js
- (void)application:(UIApplication*)application didFailToRegisterForRemoteNotificationsWithError:(NSError*)error {

   // Handle errors if it fails to receive the device token
       [LBPushNotification application:application didFailToRegisterForRemoteNotificationsWithError:error];
}
```js
    
    <p dir="ltr">
      <p dir="ltr">
        <strong>Respond to received notifications</strong>
      </p>
      
      <p>
        If your app is already running when the notification is received, the notification message is made available in the <em>application:didReceiveRemoteNotification:</em> method through the userInfo parameter.
      </p>
      
      ```js
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {

   // Receive push notifications
   LBPushNotification* notification = [LBPushNotification application:application
                                         didReceiveRemoteNotification:userInfo];
   [self.pnListVC addPushNotification:notification];

}
```js
      
      <p>
        &nbsp;
      </p>
      
      <p>
        Now we know how to enable the iOS application to interact with LoopBack push notification services. Let’s review the architecture behind.
      </p>
      
      <h2 dir="ltr">
        <strong>Architecture</strong>
      </h2>
      
      <p>
        <img class="aligncenter" alt="" src="https://lh4.googleusercontent.com/6TqMqJL353c3_omDxS0xredCihU3j_bzhANHLbpyosJkS4tD9BbDYV7kQHIrzEGY3UDCiWztg2HIoz912BHizp7UxuWMEsFOOVyhpWpeC5415Aph00ql7CzCCg" width="386px;" height="368px;" />
      </p>
      
      <h2 dir="ltr">
        <strong>Key Components</strong>
      </h2>
      
      <ul>
        <li dir="ltr">
          Device model and APIs to manage devices with applications and users
        </li>
        <li dir="ltr">
          Application model to provide push settings for device types such as ios and android
        </li>
        <li dir="ltr">
          Notification model to capture notification messages and persist scheduled notifications
        </li>
        <li dir="ltr">
          Optional Job to take scheduled notification requests
        </li>
        <li dir="ltr">
          Push connector that interact with device registration records and push providers such as APNS, GCM, and MPNS.
        </li>
        <li dir="ltr">
          Push model to provide high level APIs for device-independent push notifications
        </li>
      </ul>
      
      <p>
        &nbsp;
      </p>
      
      <h2>
        <strong>What’s Next?</strong>
      </h2>
      
      <ul>
        <li>
          Learn more about <a href="http://strongloop.com/mobile-application-development/loopback/">LoopBack</a>, the open-source mobile backend built with Node
        </li>
        <li>
          Get our <a href="http://strongloop.com/wp-content/uploads/2013/11/Mobilizing-Enterprise-Data-with-LoopBack-Models.pdf">“Mobilizing Enterprise Data with LoopBack Models” whitepaper</a>.
        </li>
        <li>
          Ready to build your next mobile app with a Node backend? We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.
        </li>
      </ul>
      
      <p>
        &nbsp;
      </p>
      
      <h2 dir="ltr">
        <strong>Further Reading</strong>
      </h2>
      
      <ul>
        <li dir="ltr">
          <a href="https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html">Apple Push Service</a>
        </li>
        <li dir="ltr">
          <a href="http://developer.android.com/google/gcm/index.html">Google Cloud Messaging for Android</a>
        </li>
        <li dir="ltr">
          <a href="https://github.com/argon/node-apn">Apple Push Notifications </a>
        </li>
        <li dir="ltr">
          <a href="https://github.com/logicalparadox/apnagent-ios">APN Agent </a>
        </li>
        <li dir="ltr">
          <a href="https://blog.engineyard.com/2013/developing-ios-push-notifications-nodejs">iOS Push Notifications in Node</a>
        </li>
      </ul>