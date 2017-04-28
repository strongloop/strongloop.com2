---
id: 16478
title: 'New in the LoopBack Android SDK 1.3 &#8211; User Auth and Storage Service'
date: 2014-05-20T08:39:22+00:00
author: Miroslav Bajtoš
guid: http://strongloop.com/?p=16478
permalink: /strongblog/nodejs-loopback-android-sdk-1-3/
categories:
  - Community
  - How-To
  - LoopBack
  - Mobile
  - News
---
StrongLoop is excited to announce a new version of the LoopBack Android SDK 1.3. The release adds two new features: user authentication and storage service client.

What’s [LoopBack](http://loopback.io)? It’s an open-source API server for Node.js applications. It enables mobile apps to connect to enterprise data through models that use pluggable [data sources and connectors](http://docs.strongloop.com/display/LB/Data+sources+and+connectors). Connectors provide connectivity to backend systems such as databases. Models are in turn exposed to mobile devices through REST APIs and client SDKs.

## **User authentication** 

User authentication and authorization are important for many applications.  The LoopBack Android SDK provides classes that make it easy to connect an Android client app to a server application using LoopBack&#8217;s authentication and authorization model: <a href="http://apidocs.strongloop.com/loopback-android/api/index.html?com/strongloop/android/loopback/User.html" rel="nofollow">User</a>, that represents on the client a user instance on the server, and <a href="http://apidocs.strongloop.com/loopback-android/api/index.html?com/strongloop/android/loopback/UserRepository.html" rel="nofollow">UserRepository</a>.

To get started:<!--more-->

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Enable authentication in your loopback server as described in the <a href="http://docs.strongloop.com/display/LB/Access+control+tutorial">Access control tutorial</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Create an instance of <code>UserRepository<User></code>: </span>
</li>

```js
RestAdapter restAdapter = // get the global adapter object

UserRepository<User> userRepo =
    restAdapter.createRepository(UserRepository<User>.class);
```

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">At application startup, find the currently logged-in user. When no user is logged in and your application requires an authenticated user, instead present the login screen Activity.</span>
</li>

```js
userRepo.findCurrentUser(new ObjectCallback<User>() {

 @Override public void onSuccess(User user) {
        if (user != null) {
            // logged in
        } else {
            // anonymous user
        }
    }
});
```

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Call the following method to log in a user:</span>
</li>

```js
userRepo.loginUser("user@example.com", "password",

 new UserRepository<User>.LoginCallback() {
        @Override public void onSuccess(AccessToken token, User user) {
            // user was logged in
        }
        @Override public void onError(Throwable t) {
            // login failed
        }
    }
);
```

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Use <code>getCachedCurrentUser()</code> in your <code>Activity</code> classes to get the data for the current user.</span>
</li>

```js
User currentUser = userRepo.getCachedCurrentUser();

if (currentUser != null) {
 // logged in
} else {
 // anonymous user
}
```

Refer to the LoopBack Android SDK <a href="http://docs.strongloop.com/display/LB/Android+SDK#AndroidSDK-Usersandauthentication" rel="nofollow">documentation</a> for more information.

## **Working with files** 

SDK version 1.3 adds support for working with files using the <a href="http://docs.strongloop.com/display/LB/Storage+service" rel="nofollow">LoopBack storage service</a>.  The storage service makes it easy to upload and download files to cloud storage providers and the server local file system. It supports the following providers:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Amazon</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Rackspace</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Openstack</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Azure</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Server file system</span>
</li>

Let&#8217;s illustrate the client API on a hypothetical application for submitting insurance claims. To submit a claim, one has to attach documents proving the validity of the claim, such as pictures of the damaged property.

## **Solution design** 

The LoopBack server will track claims using a `Claim` model. Supporting documents will be stored in a storage service.  There will be one container for every claim record.

The Android application will enable user to view documents attached to a claim and to attach more documents.

Refer to the blog post <a href="http://strongloop.com/strongblog/managing-nodejs-loopback-storage-service-provider/" rel="nofollow">Managing Objects in LoopBack with the Storage Provider of Your Choice</a> for instructions on how to setup storage service in your LoopBack application.

## **Creating a new claim** 

To avoid extra checks further down the line, the app will create the container when the user enters a new claim in the system as shown below:

```js
ContainerRepository containerRepo = adapter.createRepository(ContainerRepository.class);

containerRepo.create(claim.getId().toString(), new ObjectCallback<Container>() {
    @Override
    public void onSuccess(Container container) {
        // container was created, save it
        activity.setContainer(container);
        // and continue to the next activity
    }

    @Override
    public void onError(Throwable error) {
       // request failed, report an error
    }
});
```

&nbsp;

<div>
  <h2 id="What'snewinLoopBackAndroidSDK1.3-Displayingdocuments">
    <strong>Displaying  documents</strong>
  </h2>
  
  <p>
    To display a list of documents that are already uploaded, we need to fetch all files in the container associated with the current claim as follows:
  </p>
</div>

```js
activity.getContainer().getAllFiles(new ListCallback<File>() {

    @Override
    public void onSuccess(List<File> remoteFiles) {
        // populate the UI with documents
    }

    @Override
    public void onError(Throwable error) {
        // request failed, report an error
    }
}
```

To display the document, the app downloads its content and builds a `Bitmap` object that it can display on the Android device:

```js
void displayDocument(File remoteFile) {

    file.download(new File.DownloadCallback() {
        @Override   
        public void onSuccess(byte[] content, String contentType) {
            Bitmap image = BitmapFactory.decodeByteArray(content, 0, content.length);
            // display the image in the GUI
        }

        @Override
        public void onError(Throwable error) {
            // download failed, report an error
        }
    });
}
```

<div>
  <h2 id="What'snewinLoopBackAndroidSDK1.3-Attachinganewdocument">
    <strong>Attaching a new document</strong>
  </h2>
</div>

To keep this example simple, we will skip details on how to take pictures in Android (for information on this, see the <a href="http://developer.android.com/reference/android/hardware/Camera.html" rel="nofollow">Android Camera docs</a>). Once the picture is taken, the app uploads it to the storage service and updates the list of all documents:

```js
camera.takePicture(

    null, /* shutter callback */
    null, /* raw callback */
    null, /* postview callback */
    new Camera.PictureCallback() {
        /* jpeg callback */

        @Override
        void onPictureTaken(byte[] data, Camera camera) {
            // A real app would probably ask the user to provide a file name
            String fileName = UUID.randomUUID().toString() + ".jpg";

            activity.getContainer().upload(fileName, data, "image/jpeg",
                new ObjectCallback<File>() {
                    @Override
                    public void onSuccess(File remoteFile) {
                        // Update GUI - add remoteFile to the list of documents
                    }

                    @Override
                    public void onError(Throwable error) {
                        // upload failed
                    }
                }
            );
        }
    }
);
```

<div>
  <p>
    You can find more information in the LoopBack Android SDK <a href="http://docs.strongloop.com/display/DOC/Android+SDK#AndroidSDK-UsingtheLoopBackstorageservice" rel="nofollow">documentation</a>.
  </p>
</div>

## **What&#8217;s Next?** 

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Download the SDK bundle for Eclipse: <a href="http://81b70ddedaf4b27b1592-b5e75689411476c98957e7dab0242f50.r56.cf2.rackcdn.com/loopback-android-1.3.0-eclipse-bundle.zip" rel="nofollow">loopback-android-1.3.0-eclipse-bundle.zip</a></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">See the <a href="http://docs.strongloop.com/display/LB/Android+SDK" rel="nofollow">Android SDK documentation</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Install LoopBack with a <a href="http://strongloop.com/get-started/">simple npm command</a></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What’s in the upcoming Node v0.12 version? <a href="http://strongloop.com/strongblog/performance-node-js-v-0-12-whats-new/">Big performance optimizations</a>, read the blog by Ben Noordhuis to learn more.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Need performance monitoring, profiling and cluster capabilities for your Node apps? Check out <a href="http://strongloop.com/node-js-performance/strongops/">StrongOps</a>!</span>
</li>

&nbsp;