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

<div>
  <h2>
    <strong>Overview</strong>
  </h2>
  
  <p>
    This article provides information on creating iOS apps that can get push notifications from a LoopBack application.  See <a href="http://docs.strongloop.com/display/DOC/Creating+push+notifications" data-linked-resource-id="1542951" data-linked-resource-type="page" data-linked-resource-default-alias="Creating push notifications" data-base-url="http://docs.strongloop.com">Creating push notifications</a> for information on creating the corresponding LoopBack server application.
  </p>
  
  <p>
    The basic steps to set up push notifications for iOS clients are:
  </p>
  
  <ol>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">Provision an application with Apple and configure it to enable push notifications.</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">Provide a hook to receive the device token when the application launches and register it with the LoopBack server using the <code>LBInstallation</code> class.</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">Provide code to receive notifications, under three different application modes: foreground, background, and offline.</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">Process notifications.</span>
    </li>
  </ol>
  
  <p>
    For general information on the Apple push notifications, see <a href="https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Introduction.html">Apple iOS Local and Push Notification Programming Guide</a>.  For additional useful information, see <a href="https://blog.engineyard.com/2013/developing-ios-push-notifications-nodejs">Delivering iOS Push Notifications with Node.js</a>.<!--more-->
  </p>
  
  <h2>
    <strong>Prerequisites</strong>
  </h2>
  
  <p>
    Before you start developing your application make sure you&#8217;ve performed all the prerequisite steps outlined in this section.
  </p>
  
  <ul>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;"><a href="http://docs.strongloop.com/display/DOC/Client+SDKs">Download the LoopBack iOS SDK</a></span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;"><strong></strong><a href="https://developer.apple.com/xcode/downloads/">Install Xcode</a></span>
    </li>
  </ul>
  
  <h2>
  </h2>
  
  <h2>
    <strong>Configure APN push settings in your server application</strong>
  </h2>
  
  <p>
    If you have not already done so, <a href="https://identity.apple.com/pushcert/" rel="nofollow">create your APNS certificates</a> for iOS apps. After following the instructions, you will have APNS certificates on your system. Then edit <code>config.js</code> in your backend application and look for these lines:
  </p>
  
  <div>
    <table data-macro-name="code" data-macro-body-type="PLAIN_TEXT">
      <tr>
        <td>
          ```js
exports.apnsCertData = readCredentialsFile('apns_cert_dev.pem');
exports.apnsKeyData = readCredentialsFile('apns_key_dev.pem');
```js
        </td>
      </tr>
    </table>
    
    <p>
      Replace the file names with the names of the files containing your APNS certificates.  By default, <code>readCredentialsFile()</code> looks in the <code>/credentials</code> sub-directory for your APNS certificates. You can create a credentials directory and copy your pem files into that directory.
    </p>
  </div>
  
  <table data-macro-name="info" data-macro-body-type="RICH_TEXT">
    <tr>
      <td>
        <strong>NOTE</strong>: If you want to try a sample client application follow steps in &#8220;Install and run LoopBack Push Notification app&#8221; OR if you want to enable push notifications for your own android application using the LoopBack SDK follow steps in &#8220;Add LoopBack iOS SDK as a framework to your own iOS Project&#8221;
      </td>
    </tr>
  </table>
  
  <h2>
    <strong>Install and run LoopBack Push Notification app</strong>
  </h2>
  
  <p>
    If you want to use the sample iOS client app, download the  <a href="https://github.com/strongloop/loopback-push-notification/tree/master/example/ios">Push Notification Example iOS app</a> .  Then follow these steps to run the app
  </p>
  
  <ol>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">Open the <a title="apnagent.xcodeproj" href="https://github.com/strongloop/loopback-push-notification/tree/master/example/ios/apnagent.xcodeproj">apnagent.xcodeproj</a> in Xcode, select targets, under build phases unfold <strong>Link Binary with Libraries</strong>, and click on &#8216;+&#8217; to add LoopBack framework(LoopBack iOS sdk).<br /> <img class="aligncenter" title="StrongLoop > Creating push notifications > loopback-framework.png" alt="" src="http://docs.strongloop.com/download/attachments/1542951/loopback-framework.png?version=1&modificationDate=1391117720000&api=v2" width="500" data-image-src="/download/attachments/1542951/loopback-framework.png?version=1&modificationDate=1391117720000&api=v2" data-linked-resource-id="1769871" data-linked-resource-type="attachment" data-linked-resource-default-alias="loopback-framework.png" data-base-url="http://docs.strongloop.com" data-linked-resource-container-id="1542951" data-location="StrongLoop > Creating push notifications > loopback-framework.png" /></span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">Edit Settings.plist and update the RootPath to your instance ip. In my case it&#8217;s:  <a href="http://ec2-54-185-155-187.us-west-2.compute.amazonaws.com:3010/api">http://ec2-54-184-36-164.us-west-2.compute.amazonaws.com:3000/api</a></span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">Update the AppId with your own unique application id, when you register the app.</span>
    </li>
  </ol>
  
  <h2>
    <strong>Add LoopBack iOS SDK as a framework</strong>
  </h2>
  
  <p>
    Open your XCode project, select targets, under build phases unfold &#8220;Link Binary with Libraries&#8221;, and click on &#8220;+&#8221; to add LoopBack framework.
  </p>
  
  <p>
    <img class="aligncenter" title="StrongLoop > Creating push notifications > loopback-framework.png" alt="" src="http://docs.strongloop.com/download/attachments/1542951/loopback-framework.png?version=1&modificationDate=1391117720000&api=v2" width="500" data-image-src="/download/attachments/1542951/loopback-framework.png?version=1&modificationDate=1391117720000&api=v2" data-linked-resource-id="1769871" data-linked-resource-type="attachment" data-linked-resource-default-alias="loopback-framework.png" data-base-url="http://docs.strongloop.com" data-linked-resource-container-id="1542951" data-location="StrongLoop > Creating push notifications > loopback-framework.png" />
  </p>
  
  <p>
    The LoopBack iOS SDK provides two classes to simplify push notification programming:
  </p>
  
  <ul>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;"><a href="http://apidocs.strongloop.com/loopback-ios/api/interface_l_b_installation.html">LBInstallation</a> &#8211; enables the iOS application to register mobile devices with LoopBack.</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;"><a href="http://apidocs.strongloop.com/loopback-ios/api/interface_l_b_push_notification.html">LBPushNotification</a> &#8211; provides a set of helper methods to handle common tasks for push notifications.</span>
    </li>
  </ul>
  
  <h2>
  </h2>
  
  <h2>
    <strong>Initialize LBRESTAdapter</strong>
  </h2>
  
  <p>
    The following code instantiates the shared <code>LBRESTAdapter</code>. In most circumstances, you do this only once; putting the reference in a singleton is recommended for the sake of simplicity. However, some applications will need to talk to more than one server; in this case, create as many adapters as you need.
  </p>
  
  <table data-macro-name="code" data-macro-parameters="language=objc|linenumbers=true|theme=Eclipse" data-macro-body-type="PLAIN_TEXT">
    <tr>
      <td>
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
```js
      </td>
    </tr>
  </table>
  
  <h2>
    <strong>Register the device</strong>
  </h2>
  
  <table data-macro-name="code" data-macro-parameters="language=objc|linenumbers=true|theme=Eclipse" data-macro-body-type="PLAIN_TEXT">
    <tr>
      <td>
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
```js
      </td>
    </tr>
  </table>
  
  <h2>
    <strong>Handle received notifications</strong>
  </h2>
  
  <table data-macro-name="code" data-macro-parameters="language=objc|linenumbers=true|theme=Eclipse" data-macro-body-type="PLAIN_TEXT">
    <tr>
      <td>
        ```js
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
    // Receive push notifications
    LBPushNotification* notification = [LBPushNotification application:application
                                          didReceiveRemoteNotification:userInfo];
    [self.pnListVC addPushNotification:notification];
}
```js
        
        <p>
          &nbsp;</td> </tr> </tbody> </table> 
          
          <h2>
            <strong>Next Steps</strong>
          </h2>
          
          <ul>
            <li style="margin-left: 2em;">
              <span style="font-size: 18px;">To use LoopBack&#8217;s swagger REST API and send or receive push notifications on your Android and iOS devices go to <a title="Part four" href="http://strongloop.com/strongblog/how-to-setup-push-notifications-privat-mbaas-on-amazon-aws-part-4/">Part Four</a>.</span>
            </li>
            <li style="margin-left: 2em;">
              <span style="font-size: 18px;">To setup and create an Android app to receive push notifications go to <a title="Part two" href="http://strongloop.com/strongblog/how-to-setup-push-notifications-private-mbaas-amazon-aws-part/">Part Two</a>.</span>
            </li>
          </ul></div>