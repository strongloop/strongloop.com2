---
id: 16244
title: 'Part 3: Enable Push Notifications With a Private mBaaS Hosted on Amazon &#8211; iOS Client'
date: 2014-05-15T09:13:30+00:00
author: Chandrika Gole
guid: http://strongloop.com/?p=16244
permalink: /strongblog/how-to-setup-push-notifications-private-mbaas-amazon-aws-part-3/
categories:
  - Community
  - How-To
  - LoopBack
  - Mobile
---
This is the third of a four-part tutorial on setting up a mobile backend as a service on Amazon and setting up iOS and Android client applications to enable push notification. If you want to setup Push Notifications for an iOS app refer to Part Three.

If you have not done so already, please go to [Part One](http://strongloop.com/strongblog/how-to-setup-push-notifications-private-mbaas-amazon-aws-part-1/ "Part 1") to setup your backend LoopBack application server on Amazon.

## Overview##

This article provides information on creating iOS apps that can get push notifications from a LoopBack application.  See <a href="http://docs.strongloop.com/display/DOC/Creating+push+notifications" data-linked-resource-id="1542951" data-linked-resource-type="page" data-linked-resource-default-alias="Creating push notifications" data-base-url="http://docs.strongloop.com">Creating push notifications</a> for information on creating the corresponding LoopBack server application.

The basic steps to set up push notifications for iOS clients are:
 
1. Provision an application with Apple and configure it to enable push notifications.
2. Provide a hook to receive the device token when the application launches and register it with the LoopBack server using the `LBInstallation` class.
3. Provide code to receive notifications, under three different application modes: foreground, background, and offline.
4. Process notifications.

For general information on the Apple push notifications, see <a href="https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Introduction.html">Apple iOS Local and Push Notification Programming Guide</a>.  For additional useful information, see <a href="https://blog.engineyard.com/2013/developing-ios-push-notifications-nodejs">Delivering iOS Push Notifications with Node.js</a>.<!--more-->
 
 ## Prerequisites##

Before you start developing your application make sure you&#8217;ve performed all the prerequisite steps outlined in this section.
  
- <a href="http://docs.strongloop.com/display/DOC/Client+SDKs">Download the LoopBack iOS SDK</a> 
- <a href="https://developer.apple.com/xcode/downloads/">Install Xcode</a> 
  
## Configure APN push settings in your server application##

If you have not already done so, <a href="https://identity.apple.com/pushcert/" rel="nofollow">create your APNS certificates</a> for iOS apps. After following the instructions, you will have APNS certificates on your system. Then edit <code>config.js</code> in your backend application and look for these lines:
 
```js
exports.apnsCertData = readCredentialsFile('apns_cert_dev.pem');
exports.apnsKeyData = readCredentialsFile('apns_key_dev.pem');
```

Replace the file names with the names of the files containing your APNS certificates.  By default, `readCredentialsFile()` looks in the `/credentials` sub-directory for your APNS certificates. You can create a credentials directory and copy your pem files into that directory.

<table>
    <tr>
      <td>
<strong>NOTE</strong>: If you want to try a sample client application follow steps in &#8220;Install and run LoopBack Push Notification app&#8221; OR if you want to enable push notifications for your own android application using the LoopBack SDK follow steps in &#8220;Add LoopBack iOS SDK as a framework to your own iOS Project&#8221;
      </td>
    </tr>
  </table>
  
## <strong>Install and run LoopBack Push Notification app</strong>##

If you want to use the sample iOS client app, download the <a href="https://github.com/strongloop/loopback-push-notification/tree/master/example/ios">Push Notification Example iOS app</a>. Then follow these steps to run the app:

1. Open the <a title="apnagent.xcodeproj" href="https://github.com/strongloop/loopback-push-notification/tree/master/example/ios/apnagent.xcodeproj">apnagent.xcodeproj</a> in Xcode, select targets, under build phases unfold <strong>Link Binary with Libraries</strong>, and click on &#8216;+&#8217; to add LoopBack framework(LoopBack iOS sdk).
<img class="aligncenter" title="StrongLoop > Creating push notifications > loopback-framework.png" alt="" src="http://docs.strongloop.com/download/attachments/1542951/loopback-framework.png?version=1&modificationDate=1391117720000&api=v2" width="500" data-image-src="/download/attachments/1542951/loopback-framework.png?version=1&modificationDate=1391117720000&api=v2" data-linked-resource-id="1769871" data-linked-resource-type="attachment" data-linked-resource-default-alias="loopback-framework.png" data-base-url="http://docs.strongloop.com" data-linked-resource-container-id="1542951" data-location="StrongLoop > Creating push notifications > loopback-framework.png" />

2. Edit Settings.plist and update the RootPath to your instance ip. In my case it&#8217;s: <a href="http://ec2-54-185-155-187.us-west-2.compute.amazonaws.com:3010/api">http://ec2-54-184-36-164.us-west-2.compute.amazonaws.com:3000/api</a>

3. Update the AppId with your own unique application id, when you register the app.

##<strong>Add LoopBack iOS SDK as a framework</strong>##

Open your XCode project, select targets, under build phases unfold &#8220;Link Binary with Libraries&#8221;, and click on &#8220;+&#8221; to add LoopBack framework.

<img class="aligncenter" title="StrongLoop > Creating push notifications > loopback-framework.png" alt="" src="http://docs.strongloop.com/download/attachments/1542951/loopback-framework.png?version=1&modificationDate=1391117720000&api=v2" width="500" data-image-src="/download/attachments/1542951/loopback-framework.png?version=1&modificationDate=1391117720000&api=v2" data-linked-resource-id="1769871" data-linked-resource-type="attachment" data-linked-resource-default-alias="loopback-framework.png" data-base-url="http://docs.strongloop.com" data-linked-resource-container-id="1542951" data-location="StrongLoop > Creating push notifications > loopback-framework.png" />

The LoopBack iOS SDK provides two classes to simplify push notification programming:

- <a href="http://apidocs.strongloop.com/loopback-ios/api/interface_l_b_installation.html">LBInstallation</a> &#8211; enables the iOS application to register mobile devices with LoopBack.
- <a href="http://apidocs.strongloop.com/loopback-ios/api/interface_l_b_push_notification.html">LBPushNotification</a> &#8211; provides a set of helper methods to handle common tasks for push notifications.

## <strong>Initialize LBRESTAdapter</strong>##

The following code instantiates the shared <code>LBRESTAdapter</code>. In most circumstances, you do this only once; putting the reference in a singleton is recommended for the sake of simplicity. However, some applications will need to talk to more than one server; in this case, create as many adapters as you need.

```js
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    self.settings = [self loadSettings];
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
```
  
## <strong>Register the device</strong>##
  
```js
- (void)application:(UIApplication*)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData*)deviceToken
{
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

- (void)application:(UIApplication*)application didFailToRegisterForRemoteNotificationsWithError:(NSError*)error {
    // Handle errors if it fails to receive the device token
        [LBPushNotification application:application didFailToRegisterForRemoteNotificationsWithError:error];
}
```

## <strong>Handle received notifications</strong>##

```js
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
    // Receive push notifications
    LBPushNotification* notification = [LBPushNotification application:application
                                          didReceiveRemoteNotification:userInfo];
    [self.pnListVC addPushNotification:notification];
}
```
 
## <strong>Next Steps</strong>##
       
- To use LoopBack&#8217;s swagger REST API and send or receive push notifications on your Android and iOS devices go to <a title="Part four" href="http://strongloop.com/strongblog/how-to-setup-push-notifications-privat-mbaas-on-amazon-aws-part-4/">Part Four</a>.
- To setup and create an Android app to receive push notifications go to <a title="Part two" href="http://strongloop.com/strongblog/how-to-setup-push-notifications-private-mbaas-amazon-aws-part/">Part Two</a>.
