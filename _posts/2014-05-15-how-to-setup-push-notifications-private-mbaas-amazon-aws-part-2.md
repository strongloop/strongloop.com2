---
id: 16237
title: 'Part 2: Enable Push Notifications With a Private mBaaS Hosted on Amazon &#8211; Android Client'
date: 2014-05-15T09:14:20+00:00
author: Chandrika Gole
guid: http://strongloop.com/?p=16237
permalink: /strongblog/how-to-setup-push-notifications-private-mbaas-amazon-aws-part-2/
categories:
  - Community
  - How-To
  - LoopBack
  - Mobile
---
This is the second of a four-part tutorial on setting up a mobile backend as a service on Amazon and setting up iOS and Android client applications to enable push notification. If you want to setup Push Notifications for an iOS app refer to [Part 3](http://strongloop.com/?p=16244 "Part 3").

If you have done so already, please go to [Part One](http://strongloop.com/strongblog/how-to-setup-push-notifications-private-mbaas-amazon-aws-part-1/ "Part 1") to setup your backend LoopBack application server on Amazon.

## **Overview**

This article provides information on creating Android apps that can get push notifications from a LoopBack application.

To enable an Android app to receive LoopBack push notifications:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Setup your android client app to use Google Play Services.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">On app startup, register with GCM servers to obtain a device registration ID (device token) and register the device with the LoopBack server application.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Configure your LoopBack application to receive incoming messages from GCM.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Process the notifications received.<!--more--></span>
</li>

## **Prerequisites**

Before you start developing your application make sure you&#8217;ve performed all the prerequisite steps outlined in this section.

<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><strong><a href="http://strongloop.com/mobile/android/">Download the LoopBack Android SDK</a></strong></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><strong><a href="http://developer.android.com/sdk/index.html">Install Eclipse development tools (ADT)</a></strong></span>
</li>

## 

## **Configure Android Development Tools**

Now configure Eclipse ADT as follows:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Open Eclipse from the downloaded ADT bundle.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">In ADT, choose: Window > Android SDK Manager<br /> </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><span style="font-size: 18px;">Install the following if they are not already installed:</span></span> <ul>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;"><span style="font-size: 18px;">Tools</span></span> <ul>
        <li style="margin-left: 2em;">
          <span style="font-size: 18px;">Android SDK Platform-tools 18 or newer</span>
        </li>
        <li style="margin-left: 2em;">
          <span style="font-size: 18px;">Android SDK Build-tools 18 or newer</span>
        </li>
      </ul>
    </li>
  </ul>
  
  <ul>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;"><span style="font-size: 18px;">Android 4.3 (API 18)</span></span> <ul>
        <li style="margin-left: 2em;">
          <span style="font-size: 18px;">SDK Platform</span>
        </li>
        <li style="margin-left: 2em;">
          <span style="font-size: 18px;">Google APIs</span>
        </li>
      </ul>
    </li>
    
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;"><span style="font-size: 18px;">Extras</span></span> <ul>
        <li style="margin-left: 2em;">
          <span style="font-size: 18px;">Google Play Services</span>
        </li>
        <li style="margin-left: 2em;">
          <span style="font-size: 18px;">Intel x86 Emulator Accelerator (HAXM)</span>
        </li>
      </ul>
    </li>
  </ul>
  
  <p>
    <img title="StrongLoop > Push notifications for Android apps > Screen Shot 2014-02-05 at 3.42.00 PM.png" alt="" src="http://docs.strongloop.com/download/attachments/1542953/Screen%20Shot%202014-02-05%20at%203.42.00%20PM.png?version=1&modificationDate=1391643769000&api=v2" data-image-src="/download/attachments/1542953/Screen%20Shot%202014-02-05%20at%203.42.00%20PM.png?version=1&modificationDate=1391643769000&api=v2" data-linked-resource-id="1769892" data-linked-resource-type="attachment" data-linked-resource-default-alias="Screen Shot 2014-02-05 at 3.42.00 PM.png" data-base-url="http://docs.strongloop.com" data-linked-resource-container-id="1542953" data-location="StrongLoop > Push notifications for Android apps > Screen Shot 2014-02-05 at 3.42.00 PM.png" /></li> 
    
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">Before you start, make sure you have set up at least one Android virtual device: Choose  <strong>Window > Android Virtual Device Manager</strong> .</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">Configure the target virtual device as shown in the screenshot below.  See  <a href="http://developer.android.com/tools/help/avd-manager.html" rel="nofollow">AVD Manager</a>  for more information.</span>
    </li></ol> 
    
    <p>
      <img title="StrongLoop > Push notifications for Android apps > Screen Shot 2014-02-05 at 3.43.32 PM.png" alt="" src="http://docs.strongloop.com/download/attachments/1542953/Screen%20Shot%202014-02-05%20at%203.43.32%20PM.png?version=1&modificationDate=1391643853000&api=v2" data-image-src="/download/attachments/1542953/Screen%20Shot%202014-02-05%20at%203.43.32%20PM.png?version=1&modificationDate=1391643853000&api=v2" data-linked-resource-id="1769893" data-linked-resource-type="attachment" data-linked-resource-default-alias="Screen Shot 2014-02-05 at 3.43.32 PM.png" data-base-url="http://docs.strongloop.com" data-linked-resource-container-id="1542953" data-location="StrongLoop > Push notifications for Android apps > Screen Shot 2014-02-05 at 3.43.32 PM.png" />
    </p>
    
    <table data-macro-name="note" data-macro-body-type="RICH_TEXT">
      <tr>
        <td>
          If you are using the virtual device suggested above, you must also install the ARM EABI v7a System Image SDK.
        </td>
      </tr>
    </table>
    
    <h2>
      <strong>Get your Google Cloud Messaging credentials</strong>
    </h2>
    
    <p>
      To send push notifications to your Android app, you need to setup a Google API project and enable the Google Cloud Messaging (GCM) service.
    </p>
    
    <ul>
      <li style="margin-left: 2em;">
        <span style="font-size: 18px;"><a href="http://developer.android.com/google/gcm/gs.html#create-proj">Open the Android Developer&#8217;s Guide</a></span>
      </li>
    </ul>
    
    <p>
      Follow the instructions to get your GCM credentials:
    </p>
    
    <ol>
      <li style="margin-left: 2em;">
        <span style="font-size: 18px;">Follow steps to create a Google API project and enable the GCM service.</span>
      </li>
      <li style="margin-left: 2em;">
        <span style="font-size: 18px;"><span style="font-size: 18px;">Create an Android API key</span></span> <ul>
          <li style="margin-left: 2em;">
            <span style="font-size: 18px;">In the sidebar on the left, select <strong>APIs & auth > Credentials</strong>.</span>
          </li>
          <li style="margin-left: 2em;">
            <span style="font-size: 18px;">Click &#8220;Create new key&#8221;<br /> </span>
          </li>
          <li style="margin-left: 2em;">
            <span style="font-size: 18px;">Select &#8220;Android key&#8221;<br /> </span>
          </li>
          <li style="margin-left: 2em;">
            <span style="font-size: 18px;">Enter the SHA-1 fingerprint followed by the package name, for example:<br /> <a href="45:B5:E4:6F:36:AD:0A:98:94:B4:02:66:2B:12:17:F2:56:26:A0:E0;com.example"><code>45:B5:E4:6F:36:AD:0A:98:94:B4:02:66:2B:12:17:F2:56:26:A0:E0;com.example</code></a><br /> <strong>NOTE:</strong> Leave the package name as &#8220;com.example&#8221; for the time being.</span>
          </li>
        </ul>
      </li>
      
      <li style="margin-left: 2em;">
        <span style="font-size: 18px;"><span style="font-size: 18px;">You also have to create a new server API key that will be used by the LoopBack server:</span></span> <ul>
          <li style="margin-left: 2em;">
            <span style="font-size: 18px;">Click &#8220;Create new key&#8221;<br /> </span>
          </li>
          <li style="margin-left: 2em;">
            <span style="font-size: 18px;">Select &#8220;Server key&#8221;<br /> </span>
          </li>
          <li style="margin-left: 2em;">
            <span style="font-size: 18px;">Leave the list of allowed IP addresses empty for now.</span>
          </li>
          <li style="margin-left: 2em;">
            <span style="font-size: 18px;">Click &#8220;Create&#8221;<br /> </span>
          </li>
          <li style="margin-left: 2em;">
            <span style="font-size: 18px;">Copy down the API key.  Later you will use this when you configure the LoopBack server application.</span>
          </li>
        </ul>
      </li>
    </ol>
    
    <h2>
      <strong>Configure GCM push settings in your server application</strong>
    </h2>
    
    <p>
      Add the following key and value to the push settings of your application in the config.js file:
    </p>
    
    ```js
{
  gcm: {
    serverApiKey: "server-api-key"
  }
}
```js
    
    <p>
      Replace <code>server-api-key</code> with the API key you obtained in the section Get your Google Cloud Messaging credentials.
    </p>
    
    <table data-macro-name="info" data-macro-body-type="RICH_TEXT">
      <tr>
        <td>
          <strong>NOTE</strong>: If you want to try a sample client application follow steps in &#8220;Install and run LoopBack Push Notification app&#8221; OR if you want to enable push notifications for your own android application using the LoopBack SDK follow steps in &#8220;Prepare your own Android project&#8221;.
        </td>
      </tr>
    </table>
    
    <h2>
      <strong><span style="font-size: 1.5em;">Install and run LoopBack Push Notification app</span></strong>
    </h2>
    
    <p>
      If you want to use the sample Android client app, download the  <a href="https://github.com/strongloop/loopback-push-notification/tree/master/example/android">Push Notification Example Android app</a> .  Then follow these steps to run the app:
    </p>
    
    <ol>
      <ol>
        <li style="margin-left: 2em;">
          <span style="font-size: 18px;">Open ADT Eclipse.</span>
        </li>
        <li style="margin-left: 2em;">
          <span style="font-size: 18px;"><span style="font-size: 18px;">Import the push notification application to your workspace:</span></span> <ul>
            <li>
              <span style="font-size: 18px;">Choose &#8220;File > Import&#8221;</span>
            </li>
            <li>
              <span style="font-size: 18px;">Choose &#8220;Android > Existing Android Code into Workspace&#8221;</span>
            </li>
            <li>
              <span style="font-size: 18px;">Click &#8220;Next&#8221;</span>
            </li>
            <li>
              <span style="font-size: 18px;">Browse to the example Android app you just downloaded.</span>
            </li>
            <li>
              <span style="font-size: 18px;">Click &#8220;Finish&#8221;.</span>
            </li>
          </ul>
        </li>
      </ol>
    </ol>
    
    <table data-macro-name="note" data-macro-body-type="RICH_TEXT">
      <tr>
        <td>
          <strong>NOTE</strong>: ADT does not take long to import the guide app. Don&#8217;t be misguided by the progress bar at the bottom of the IDE window: it indicates memory use, not loading status.
        </td>
      </tr>
    </table>
    
    <ol>
      <li style="margin-left: 2em;">
        <span style="font-size: 18px;"><span style="font-size: 18px;">Import Google Play Services library project into your workspace. The project is located inside the directory where you have installed the Android SDK.</span></span> <ul>
          <li style="margin-left: 2em;">
            <span style="font-size: 18px;">Choose &#8220;File > Import&#8221;<br /> </span>
          </li>
          <li style="margin-left: 2em;">
            <span style="font-size: 18px;">Choose &#8220;Android > Existing Android Code into Workspace&#8221;<br /> </span>
          </li>
          <li style="margin-left: 2em;">
            <span style="font-size: 18px;">Click &#8220;Next&#8221;<br /> </span>
          </li>
          <li>
            <span style="font-size: 18px;">Browse to the <code><android-sdk>/extras/google/google_play_services/libproject/google-play-services_lib</code> directory.</span>
          </li>
          <li style="margin-left: 2em;">
            <span style="font-size: 18px;">Check &#8220;Copy projects into workspace&#8221;</span>
          </li>
          <li style="margin-left: 2em;">
            <span style="font-size: 18px;">Click &#8220;Finish&#8221;<br /> </span>
          </li>
        </ul>
        
        <p>
          See <a href="http://developer.android.com/google/play-services/setup.html" rel="nofollow">Google Play Services SDK</a> for more details.</li> 
          
          <li style="margin-left: 2em;">
            <span style="font-size: 18px;"><span style="font-size: 18px;">Add the imported google-play-services_lib as an Android build dependency of the push notification application.</span></span> <ul>
              <li style="margin-left: 2em;">
                <span style="font-size: 18px;">In the Package Explorer frame in Eclipse, select the  push notification application.</span>
              </li>
              <li style="margin-left: 2em;">
                <span style="font-size: 18px;">Choose &#8220;File > Properties&#8221;<br /> </span>
              </li>
              <li style="margin-left: 2em;">
                <span style="font-size: 18px;">Select &#8220;Android&#8221;<br /> </span>
              </li>
              <li style="margin-left: 2em;">
                <span style="font-size: 18px;">In the Library frame, click on &#8220;Add&#8230;&#8221; and select <code>google-play-services_lib</code>.</span>
              </li>
              <li style="margin-left: 2em;">
                <span style="font-size: 18px;">Also under Project Build Target, set the target as Google APIs.<code><br />
</code><br /> <img title="StrongLoop > Push notifications for Android apps > Screen Shot 2014-02-05 at 3.34.36 PM.png" alt="" src="http://docs.strongloop.com/download/attachments/1542953/Screen%20Shot%202014-02-05%20at%203.34.36%20PM.png?version=1&modificationDate=1391643314000&api=v2" data-image-src="/download/attachments/1542953/Screen%20Shot%202014-02-05%20at%203.34.36%20PM.png?version=1&modificationDate=1391643314000&api=v2" data-linked-resource-id="1769891" data-linked-resource-type="attachment" data-linked-resource-default-alias="Screen Shot 2014-02-05 at 3.34.36 PM.png" data-base-url="http://docs.strongloop.com" data-linked-resource-container-id="1542953" data-location="StrongLoop > Push notifications for Android apps > Screen Shot 2014-02-05 at 3.34.36 PM.png" /></span>
              </li>
            </ul>
          </li>
          
          <li style="margin-left: 2em;">
            <span style="font-size: 18px;"><span style="font-size: 18px;">Edit <code>src/com/google/android/gcm/demo/app/DemoActivity.java</code>.</span></span> <ul>
              <li style="margin-left: 2em;">
                <span style="font-size: 18px;">Set SENDER_ID to the project number from the Google Developers Console you created earlier in Get your Google Cloud Messaging credentials.</span>
              </li>
            </ul>
          </li>
          
          <li style="margin-left: 2em;">
            <span style="font-size: 18px;"><span style="font-size: 18px;">Go back to the <a href="https://cloud.google.com/console/project">https://cloud.google.com/console/project</a> and edit the Android Key to reflect your unique application ID. Set the value of &#8220;Android applications&#8221; to something like this:<br /> </span></span>&nbsp;</p> <table>
              <tr>
                <th>
                  Android applications
                </th>
                
                <td>
                  XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:X&nbsp;</p> 
                  
                  <p>
                    LOOPBACK_APP_ID
                  </p>
                  
                  <p>
                    X:XX:XX:XX:XX:XX:XX:XX:XX:XX;com.google.android.gcm.demo.app.DemoApplication</td> </tr> </tbody> </table> 
                    
                    <p>
                      &nbsp;</li> 
                      
                      <li style="margin-left: 2em;">
                        <span style="font-size: 18px;">Set the appName in the server application&#8217;s <code>config.js</code> to &#8220;com.google.android.gcm.demo.app.DemoActivity&#8221;.</span>
                      </li>
                      <li style="margin-left: 2em;">
                        <span style="font-size: 18px;"><span style="font-size: 18px;">Edit src/com/google/android/gcm/demo/app/DemoApplication.java</span></span> <ul>
                          <li style="margin-left: 2em;">
                            <span style="font-size: 18px;"><span style="font-size: 18px;">Set adaptor to our server ip. In my case it is:</span></span> ```js
adapter = new RestAdapter(
                    getApplicationContext(),
                    "http://ec2-54-184-36-164.us-west-2.compute.amazonaws.com:3000/api/");
        }
```js
                          </li>
                        </ul>
                      </li>
                      
                      <li style="margin-left: 2em;">
                        <span style="font-size: 18px;">Click the green &#8220;Run&#8221; button in the toolbar to run the application. Run it as an Android application. You will be prompted to select the target on which to run the application. Select the AVD you created earlier.</span>
                      </li></ol> 
                      
                      <table data-macro-name="note" data-macro-body-type="RICH_TEXT">
                        <tr>
                          <td>
                            It may take several minutes to launch your application and the Android virtual device the first time.
                          </td>
                        </tr>
                      </table>
                      
                      <table data-macro-name="warning" data-macro-body-type="RICH_TEXT">
                        <tr>
                          <td>
                            Due to a <a href="https://code.google.com/p/android/issues/detail?id=61675">known issue with Google Play Services</a>, you must download and import an older version of Google Play services.&nbsp;</p> 
                            
                            <ol>
                              <li style="margin-left: 2em;">
                                <span style="font-size: 18px;">Download <a href="https://dl-ssl.google.com/android/repository/google_play_services_3225130_r10.zip">https://dl-ssl.google.com/android/repository/google_play_services_3225130_r10.zip</a></span>
                              </li>
                              <li style="margin-left: 2em;">
                                <span style="font-size: 18px;">Extract the zip file.</span>
                              </li>
                              <li style="margin-left: 2em;">
                                <span style="font-size: 18px;">In Eclipse ADT, right-click on your project and choose <strong>Import</strong>&#8230;</span>
                              </li>
                              <li style="margin-left: 2em;">
                                <span style="font-size: 18px;">Choose <strong>Existing Android Code into Workspace</strong> then click Next.</span>
                              </li>
                              <li style="margin-left: 2em;">
                                <span style="font-size: 18px;">Click <strong>Browse</strong>&#8230;</span>
                              </li>
                              <li style="margin-left: 2em;">
                                <span style="font-size: 18px;">Browse to the <code>google-play-services/libproject/google-play-services_lib/</code> directory created when you extracted the zip file and select it in the dialog box.</span>
                              </li>
                              <li style="margin-left: 2em;">
                                <span style="font-size: 18px;">Click <strong>Finish</strong>.</span>
                              </li>
                            </ol>
                            
                            <p>
                              You must also update <code>AndroidManifest.xml</code> as follows:
                            </p>
                            
                            <ol>
                              <li style="margin-left: 2em;">
                                <span style="font-size: 18px;">In Eclipse ADT, browse to DemoActivity/AndroidManifest.xml.</span>
                              </li>
                              <li style="margin-left: 2em;">
                                <span style="font-size: 18px;">Change the line<br /> <code><meta-data <a>android:name="com.google.android.gms.version</a>" <a>android:value="@integer/google_play_services_version"/</a>></code><br /> to<br /> <code><meta-data <a>android:name="com.google.android.gms.version</a>" <a>android:value="4030500”/</a>></code></span>
                              </li>
                              <li style="margin-left: 2em;">
                                <span style="font-size: 18px;">Save the file.</span>
                              </li>
                            </ol>
                          </td>
                        </tr>
                      </table>
                      
                      <h2>
                        <strong>Prepare your own Android project</strong>
                      </h2>
                      
                      <p>
                        Follow the instructions in <a href="http://docs.strongloop.com/display/DOC/Android+SDK#AndroidSDK-Creatingandworkingwithyourownapp">Android SDK documentation</a> to add LoopBack Android SDK to your Android project.
                      </p>
                      
                      <p>
                        Follow the instructions in Google&#8217;s <a href="http://developer.android.com/google/gcm/client.html">Implementing GCM Client guide</a> for setting up Google Play Services in your project.
                      </p>
                      
                      <table data-macro-name="note" data-macro-body-type="RICH_TEXT">
                        <tr>
                          <td>
                            To use push notifications, you must install a compatible version of the Google APIs platform.  To test your app on the emulator, expand the directory for Android 4.2.2 (API 17) or a higher version, select <strong>Google APIs</strong>, and install it. Then create a new AVD with Google APIs as the platform target.  You must install the package from the SDK manager.  For more information, see <a href="http://developer.android.com/google/play-services/setup.html">Set Up Google Play Services</a>.
                          </td>
                        </tr>
                      </table>
                      
                      <h2>
                        <strong>Check for Google Play Services APK</strong>
                      </h2>
                      
                      <p>
                        Applications that rely on the Google Play Services SDK should always check the device for a compatible Google Play services APK before using Google Cloud Messaging.
                      </p>
                      
                      <p>
                        For example, the following code checks the device for Google Play Services APK by calling  <code>checkPlayServices()</code> if  this method returns true, it proceeds with GCM registration.  The <code>checkPlayServices()</code> method checks whether the device has the Google Play Services APK. If  it doesn&#8217;t, it displays a dialog that allows users to download the APK from the Google Play Store or enables it in the device&#8217;s system settings.
                      </p>
                      
                      <table data-macro-name="code" data-macro-parameters="language=java|linenumbers=true" data-macro-body-type="PLAIN_TEXT">
                        <tr>
                          <td>
                            ```js
@Override
public void onCreate(final Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.main);

    if (checkPlayServices()) {
        updateRegistration();
    } else {
        Log.i(TAG, "No valid Google Play Services APK found.");
    }
}
private boolean checkPlayServices() {
    int resultCode = GooglePlayServicesUtil.isGooglePlayServicesAvailable(this);
    if (resultCode != ConnectionResult.SUCCESS) {
        if (GooglePlayServicesUtil.isUserRecoverableError(resultCode)) {
            GooglePlayServicesUtil.getErrorDialog(resultCode, this,
                    PLAY_SERVICES_RESOLUTION_REQUEST).show();
        } else {
            Log.i(TAG, "This device is not supported.");
            finish();
        }
        return false;
    }
    return true;
}
```js
                          </td>
                        </tr>
                      </table>
                      
                      <h2>
                        <strong>Create LocalInstallation</strong>
                      </h2>
                      
                      <p>
                        Once you have ensured the device provides Google Play Services, the app can register with GCM and LoopBack (for example, by calling a method such as <code>updateRegistration()</code> as shown below). Rather than register with GCM every time the app starts, simply store and retrieve the registration ID (device token).  The <code>LocalInstallation</code> class in the LoopBack SDK handles these details for you.
                      </p>
                      
                      <p>
                        The example <code>updateRegistration()</code> method does the following:
                      </p>
                      
                      <ul>
                        <li style="margin-left: 2em;">
                          <span style="font-size: 18px;">Lines 3 &#8211; 4: get a reference to the shared <code>RestAdapter</code> instance.</span>
                        </li>
                        <li style="margin-left: 2em;">
                          <span style="font-size: 18px;">Line 5: Create an instance of <code>LocalInstallation</code>.</span>
                        </li>
                        <li style="margin-left: 2em;">
                          <span style="font-size: 18px;">Line 13: Subscribe to topics.</span>
                        </li>
                        <li style="margin-left: 2em;">
                          <span style="font-size: 18px;">Lines 15-19: Check if there is a valid GCM registration ID.  If so, then save the installation to the server; if not, get one from GCM and then save the installation.</span>
                        </li>
                      </ul>
                      
                      <table data-macro-name="code" data-macro-parameters="language=java|linenumbers=true" data-macro-body-type="PLAIN_TEXT">
                        <tr>
                          <td>
                            ```js
private void updateRegistration() {

    final DemoApplication app = (DemoApplication) getApplication();
    final RestAdapter adapter = app.getLoopBackAdapter();
    final LocalInstallation installation = new LocalInstallation(context, adapter);

    // Substitute the real ID of the LoopBack application as created by the server
    installation.setAppId("loopback-app-id");

    // Substitute a real ID of the user logged in to the application
    installation.setUserId("loopback-android");

    installation.setSubscriptions(new String[] { "all" });

    if (installation.getDeviceToken() != null) {
        saveInstallation(installation);
    } else {
        registerInBackground(installation);
    }
}
```js
                          </td>
                        </tr>
                      </table>
                      
                      <h2>
                        <strong>Register with GCM if needed</strong>
                      </h2>
                      
                      <p>
                        In the following code, the application obtains a new registration ID from GCM. Because the <code>register()</code> method is blocking, you must call it on a background thread.
                      </p>
                      
                      <table data-macro-name="code" data-macro-parameters="language=java|linenumbers=true" data-macro-body-type="PLAIN_TEXT">
                        <tr>
                          <td>
                            ```js
private void registerInBackground(final LocalInstallation installation) {
    new AsyncTask<Void, Void, Exception>() {
        @Override
        protected Exception doInBackground(final Void... params) {
            try {
                GoogleCloudMessaging gcm = GoogleCloudMessaging.getInstance(this);
                // substitute 12345 with the real Google API Project number 
				final String regid = gcm.register("12345");
                installation.setDeviceToken(regid);
                return null;
            } catch (final IOException ex) {
                return ex;
                // If there is an error, don't just keep trying to
                // register.
                // Require the user to click a button again, or perform
                // exponential back-off.
            }
        }
        @Override
        protected void onPostExecute(final Exception error) {
            if (err != null) {
                Log.e(TAG, "GCM Registration failed.", error);
            } else {
                saveInstallation(installation);
            }
        }
    }.execute(null, null, null);
}
```js
                          </td>
                        </tr>
                      </table>
                      
                      <h2>
                        <strong>Register with LoopBack server</strong>
                      </h2>
                      
                      <p>
                        Once you have all Installation properties set, you can register with the LoopBack server. The first run of the application should create a new Installation record, subsequent runs should update this existing record. The LoopBack Android SDK handles the details.  Your code just needs to call <code>save()</code>.
                      </p>
                      
                      <table data-macro-name="code" data-macro-parameters="language=java|linenumbers=true" data-macro-body-type="PLAIN_TEXT">
                        <tr>
                          <td>
                            ```js
void saveInstallation(final LocalInstallation installation) {
    installation.save(new Model.Callback() {
        @Override
        public void onSuccess() {
            // Installation was saved.
            // You can access the id assigned by the server via
            //   installation.getId();
        }
        @Override
        public void onError(final Throwable t) {
            Log.e(TAG, "Cannot save Installation", t);
        }
    });
}
```js
                          </td>
                        </tr>
                      </table>
                      
                      <h2>
                        <strong>Handle received notifications</strong>
                      </h2>
                      
                      <p>
                        Android apps handle incoming notifications in the standard way; LoopBack does not require any special changes. For more information, see the section &#8220;Receive a message&#8221; of Google&#8217;s <a href="http://developer.android.com/google/gcm/client.html">Implementing GCM Client guide</a>.
                      </p>
                      
                      <h2>
                        <strong>Troubleshooting</strong>
                      </h2>
                      
                      <p>
                        When running your app in the Eclipse device emulator, you may encounter the following error:
                      </p>
                      
                      <p>
                        <code>Google Play services, which some of your applications rely on, is not supported by your device. Please contact the manufacturer for assistance.</code>
                      </p>
                      
                      <p>
                        To resolve this, install a compatible version of the Google APIs platform.
                      </p>
                      
                      <h2>
                        <strong>Next Steps</strong>
                      </h2>
                      
                      <ul>
                        <li style="margin-left: 2em;">
                          <span style="font-size: 18px;">To setup and create an iOS app to receive push notifications go to <a title="Part three" href="http://strongloop.com/strongblog/how-to-setup-push-notifications-private-mbaas-amazon-aws-part-3/">Part Three</a></span>
                        </li>
                        <li style="margin-left: 2em;">
                          <span style="font-size: 18px;">To use LoopBack&#8217;s swagger REST api and send/receive push notifications on your Android and iOS devices go to <a title="Part four" href="http://strongloop.com/strongblog/how-to-setup-push-notifications-privat-mbaas-on-amazon-aws-part-4/">Part Four</a></span>
                        </li>
                      </ul>