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

- Setup your android client app to use Google Play Services.
- On app startup, register with GCM servers to obtain a device registration ID (device token) and register the device with the LoopBack server application.
- Configure your LoopBack application to receive incoming messages from GCM.
- Process the notifications received.<!--more-->

## **Prerequisites**

Before you start developing your application make sure you&#8217;ve performed all the prerequisite steps outlined in this section.

- <strong><a href="http://strongloop.com/mobile/android/">Download the LoopBack Android SDK</a></strong>
- <strong><a href="http://developer.android.com/sdk/index.html">Install Eclipse development tools (ADT)</a></strong>

## **Configure Android Development Tools**

Now configure Eclipse ADT as follows:

1. Open Eclipse from the downloaded ADT bundle.
2. In ADT, choose: Window > Android SDK Manager
3. Install the following if they are not already installed:

**Tools**
- Android SDK Platform-tools 18 or newer
- Android SDK Build-tools 18 or newer</span>
    
**Android 4.3 (API 18)**
- SDK Platform
- Google APIs

**Extras**
- Google Play Services
- Intel x86 Emulator Accelerator (HAXM)

<img title="StrongLoop > Push notifications for Android apps > Screen Shot 2014-02-05 at 3.42.00 PM.png" alt="" src="http://docs.strongloop.com/download/attachments/1542953/Screen%20Shot%202014-02-05%20at%203.42.00%20PM.png?version=1&modificationDate=1391643769000&api=v2" data-image-src="/download/attachments/1542953/Screen%20Shot%202014-02-05%20at%203.42.00%20PM.png?version=1&modificationDate=1391643769000&api=v2" data-linked-resource-id="1769892" data-linked-resource-type="attachment" data-linked-resource-default-alias="Screen Shot 2014-02-05 at 3.42.00 PM.png" data-base-url="http://docs.strongloop.com" data-linked-resource-container-id="1542953" data-location="StrongLoop > Push notifications for Android apps > Screen Shot 2014-02-05 at 3.42.00 PM.png" />
    
Before you start, make sure you have set up at least one Android virtual device: Choose <strong>Window > Android Virtual Device Manager</strong>.

Configure the target virtual device as shown in the screenshot below. See <a href="http://developer.android.com/tools/help/avd-manager.html" rel="nofollow">AVD Manager</a> for more information.

<img title="StrongLoop > Push notifications for Android apps > Screen Shot 2014-02-05 at 3.43.32 PM.png" alt="" src="http://docs.strongloop.com/download/attachments/1542953/Screen%20Shot%202014-02-05%20at%203.43.32%20PM.png?version=1&modificationDate=1391643853000&api=v2" data-image-src="/download/attachments/1542953/Screen%20Shot%202014-02-05%20at%203.43.32%20PM.png?version=1&modificationDate=1391643853000&api=v2" data-linked-resource-id="1769893" data-linked-resource-type="attachment" data-linked-resource-default-alias="Screen Shot 2014-02-05 at 3.43.32 PM.png" data-base-url="http://docs.strongloop.com" data-linked-resource-container-id="1542953" data-location="StrongLoop > Push notifications for Android apps > Screen Shot 2014-02-05 at 3.43.32 PM.png" />

<table>
      <tr>
        <td>
          <strong>NOTE</strong>: If you are using the virtual device suggested above, you must also install the ARM EABI v7a System Image SDK.
        </td>
      </tr>
</table>

## Get your Google Cloud Messaging credentials##
   
To send push notifications to your Android app, you need to setup a Google API project and enable the Google Cloud Messaging (GCM) service.
 
- <a href="http://developer.android.com/google/gcm/gs.html#create-proj">Open the Android Developer&#8217;s Guide</a>

Follow the instructions to get your GCM credentials:

1. Follow steps to create a Google API project and enable the GCM service.

2. Create an Android API key.
- In the sidebar on the left, select <strong>APIs & auth > Credentials</strong>.
- Click &#8220;Create new key&#8221;
- Select &#8220;Android key&#8221;
- Enter the SHA-1 fingerprint followed by the package name, for example:<br /> <a href="45:B5:E4:6F:36:AD:0A:98:94:B4:02:66:2B:12:17:F2:56:26:A0:E0;com.example"><code>45:B5:E4:6F:36:AD:0A:98:94:B4:02:66:2B:12:17:F2:56:26:A0:E0;com.example</code></a><br /> <strong>NOTE:</strong> Leave the package name as &#8220;com.example&#8221; for the time being.

3. You also have to create a new server API key that will be used by the LoopBack server:
- Click &#8220;Create new key&#8221;
- Select &#8220;Server key&#8221;
- Leave the list of allowed IP addresses empty for now.
- Click &#8220;Create&#8221;
- Copy down the API key.  Later you will use this when you configure the LoopBack server application.

## Configure GCM push settings in your server application##

Add the following key and value to the push settings of your application in the config.js file:

```js
{
  gcm: {
    serverApiKey: "server-api-key"
  }
}
```

Replace <code>server-api-key</code> with the API key you obtained in the section Get your Google Cloud Messaging credentials.
    
<table data-macro-name="info" data-macro-body-type="RICH_TEXT">
      <tr>
        <td>
          <strong>NOTE</strong>: If you want to try a sample client application follow steps in &#8220;Install and run LoopBack Push Notification app&#8221; OR if you want to enable push notifications for your own android application using the LoopBack SDK follow steps in &#8220;Prepare your own Android project&#8221;.
        </td>
      </tr>
    </table>
    
## Install and run LoopBack Push Notification app##
    
If you want to use the sample Android client app, download the  <a href="https://github.com/strongloop/loopback-push-notification/tree/master/example/android">Push Notification Example Android app</a>. Then follow these steps to run the app:
  
a. Open ADT Eclipse.</span>
b. Import the push notification application to your workspace:
- Choose &#8220;File > Import&#8221;
- Choose &#8220;Android > Existing Android Code into Workspace&#8221;
- Click &#8220;Next&#8221;
- Browse to the example Android app you just downloaded.
- Click &#8220;Finish&#8221;.
    
<table data-macro-name="note" data-macro-body-type="RICH_TEXT">
      <tr>
        <td>
          <strong>NOTE</strong>: ADT does not take long to import the guide app. Don&#8217;t be misguided by the progress bar at the bottom of the IDE window: it indicates memory use, not loading status.
        </td>
      </tr>
    </table>
    
1. Import Google Play Services library project into your workspace. The project is located inside the directory where you have installed the Android SDK.

- Choose &#8220;File > Import&#8221;
- Choose &#8220;Android > Existing Android Code into Workspace&#8221;
- Click &#8220;Next&#8221;
- Browse to the `<android-sdk>/extras/google/google_play_services/libproject/google-play-services_lib` directory.
- Check &#8220;Copy projects into workspace&#8221;
- Click &#8220;Finish&#8221;

See <a href="http://developer.android.com/google/play-services/setup.html" rel="nofollow">Google Play Services SDK</a> for more details.

- Add the imported google-play-services_lib as an Android build dependency of the push notification application.
- In the Package Explorer frame in Eclipse, select the  push notification application.
-- Choose &#8220;File > Properties&#8221;
-- Select &#8220;Android&#8221;
-- In the Library frame, click on &#8220;Add&#8230;&#8221; and select `google-play-services_lib`.
-- Also under Project Build Target, set the target as Google APIs.

<img title="StrongLoop > Push notifications for Android apps > Screen Shot 2014-02-05 at 3.34.36 PM.png" alt="" src="http://docs.strongloop.com/download/attachments/1542953/Screen%20Shot%202014-02-05%20at%203.34.36%20PM.png?version=1&modificationDate=1391643314000&api=v2" data-image-src="/download/attachments/1542953/Screen%20Shot%202014-02-05%20at%203.34.36%20PM.png?version=1&modificationDate=1391643314000&api=v2" data-linked-resource-id="1769891" data-linked-resource-type="attachment" data-linked-resource-default-alias="Screen Shot 2014-02-05 at 3.34.36 PM.png" data-base-url="http://docs.strongloop.com" data-linked-resource-container-id="1542953" data-location="StrongLoop > Push notifications for Android apps > Screen Shot 2014-02-05 at 3.34.36 PM.png" />
          
- Edit `src/com/google/android/gcm/demo/app/DemoActivity.java`.
- Set SENDER_ID to the project number from the Google Developers Console you created earlier in Get your Google Cloud Messaging credentials.
- Go back to the <a href="https://cloud.google.com/console/project">https://cloud.google.com/console/project</a> and edit the Android Key to reflect your unique application ID. Set the value of &#8220;Android applications&#8221; to something like this:

Android applications

XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:X&nbsp; 
LOOPBACK_APP_ID

X:XX:XX:XX:XX:XX:XX:XX:XX:XX;com.google.android.gcm.demo.app.DemoApplication

- Set the appName in the server application&#8217;s `config.js` to &#8220;com.google.android.gcm.demo.app.DemoActivity&#8221;.
- Edit src/com/google/android/gcm/demo/app/DemoApplication.java
- Set adaptor to our server ip. In my case it is:

```js
adapter = new RestAdapter(
                    getApplicationContext(),
                    "http://ec2-54-184-36-164.us-west-2.compute.amazonaws.com:3000/api/");
        }
```

Click the green &#8220;Run&#8221; button in the toolbar to run the application. Run it as an Android application. You will be prompted to select the target on which to run the application. Select the AVD you created earlier.

<table>
                        <tr>
                          <td>
                            It may take several minutes to launch your application and the Android virtual device the first time.
                          </td>
                        </tr>
</table>
                      
Due to a <a href="https://code.google.com/p/android/issues/detail?id=61675">known issue with Google Play Services</a>, you must download and import an older version of Google Play services.&nbsp;

- Download <a href="https://dl-ssl.google.com/android/repository/google_play_services_3225130_r10.zip">https://dl-ssl.google.com/android/repository/google_play_services_3225130_r10.zip</a>
- Extract the zip file.
- In Eclipse ADT, right-click on your project and choose <strong>Import</strong>&#8230;
- Choose <strong>Existing Android Code into Workspace</strong> then click Next.
- Click <strong>Browse</strong>&#8230;
- Browse to the `google-play-services/libproject/google-play-services_lib/` directory created when you extracted the zip file and select it in the dialog box.
- Click <strong>Finish</strong>.

You must also update `AndroidManifest.xml` as follows:
                 
1. In Eclipse ADT, browse to DemoActivity/AndroidManifest.xml.
2. Change the line:

`<meta-data <a>android:name="com.google.android.gms.version</a>" <a>android:value="@integer/google_play_services_version"/</a>>`

to:

`<meta-data <a>android:name="com.google.android.gms.version</a>" <a>android:value="4030500”/</a>>`

3. Save the file.

## Prepare your own Android project##

Follow the instructions in <a href="http://docs.strongloop.com/display/DOC/Android+SDK#AndroidSDK-Creatingandworkingwithyourownapp">Android SDK documentation</a> to add LoopBack Android SDK to your Android project.

Follow the instructions in Google&#8217;s <a href="http://developer.android.com/google/gcm/client.html">Implementing GCM Client guide</a> for setting up Google Play Services in your project.

To use push notifications, you must install a compatible version of the Google APIs platform.  To test your app on the emulator, expand the directory for Android 4.2.2 (API 17) or a higher version, select <strong>Google APIs</strong>, and install it. Then create a new AVD with Google APIs as the platform target.  You must install the package from the SDK manager.  For more information, see <a href="http://developer.android.com/google/play-services/setup.html">Set Up Google Play Services</a>.

## Check for Google Play Services APK##

Applications that rely on the Google Play Services SDK should always check the device for a compatible Google Play services APK before using Google Cloud Messaging.

For example, the following code checks the device for Google Play Services APK by calling `checkPlayServices()` if  this method returns true, it proceeds with GCM registration. The `checkPlayServices()` method checks whether the device has the Google Play Services APK. If it doesn&#8217;t, it displays a dialog that allows users to download the APK from the Google Play Store or enables it in the device&#8217;s system settings.

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
```

## Create LocalInstallation##

Once you have ensured the device provides Google Play Services, the app can register with GCM and LoopBack (for example, by calling a method such as `updateRegistration()` as shown below). Rather than register with GCM every time the app starts, simply store and retrieve the registration ID (device token).  The `LocalInstallation` class in the LoopBack SDK handles these details for you.
                    
The example `updateRegistration()` method does the following:

- Lines 3 &#8211; 4: get a reference to the shared `RestAdapter` instance.
- Line 5: Create an instance of `LocalInstallation`.
- Line 13: Subscribe to topics.
- Lines 15-19: Check if there is a valid GCM registration ID.  If so, then save the installation to the server; if not, get one from GCM and then save the installation.

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
```

## Register with GCM if needed##

In the following code, the application obtains a new registration ID from GCM. Because the `register()` method is blocking, you must call it on a background thread.
 
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
```

## Register with LoopBack server##

Once you have all Installation properties set, you can register with the LoopBack server. The first run of the application should create a new Installation record, subsequent runs should update this existing record. The LoopBack Android SDK handles the details. Your code just needs to `call1save()`.

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
```
            
## Handle received notifications##

Android apps handle incoming notifications in the standard way; LoopBack does not require any special changes. For more information, see the section &#8220;Receive a message&#8221; of Google&#8217;s <a href="http://developer.android.com/google/gcm/client.html">Implementing GCM Client guide</a>.
                                          
## Troubleshooting##

When running your app in the Eclipse device emulator, you may encounter the following error:

<code>Google Play services, which some of your applications rely on, is not supported by your device. Please contact the manufacturer for assistance.</code>

To resolve this, install a compatible version of the Google APIs platform.

## Next Steps##

- To setup and create an iOS app to receive push notifications go to <a title="Part three" href="http://strongloop.com/strongblog/how-to-setup-push-notifications-private-mbaas-amazon-aws-part-3/">Part Three</a>
- To use LoopBack&#8217;s swagger REST api and send/receive push notifications on your Android and iOS devices go to <a title="Part four" href="http://strongloop.com/strongblog/how-to-setup-push-notifications-privat-mbaas-on-amazon-aws-part-4/">Part Four</a>
