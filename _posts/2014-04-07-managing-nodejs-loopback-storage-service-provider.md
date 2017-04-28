---
id: 15327
title: Managing Objects in LoopBack with the Storage Provider of Your Choice
date: 2014-04-07T15:37:49+00:00
author: Raymond Feng
guid: http://strongloop.com/?p=15327
permalink: /strongblog/managing-nodejs-loopback-storage-service-provider/
categories:
  - Community
  - How-To
  - LoopBack
---
## **Introduction**

Applications often need to store and use files such as images, videos, and PDFs. Nowadays, there are a lot of choices for cloud storage providers, each of which provides a different API. Meanwhile, web and mobile platforms provide different ways to upload and download files. The variety of storage providers and client APIs create complexity when developing applications that need to handle files.

The LoopBack storage service simplifies dealing with files by providing a unified REST API to enable web and mobile applications to upload, download, and manage binary contents using the  most popular storage providers: Amazon, Rackspace, Openstack, and Azure, as well as the local file system.

The architecture is illustrated below:

<!--more-->

[<img class="aligncenter size-full wp-image-15338" alt="loopback-nodejs-storage-service-provider" src="{{site.url}}/blog-assets/2014/04/loopback-nodejs-storage-service-provider.png" width="804" height="473" />]({{site.url}}/blog-assets/2014/04/loopback-nodejs-storage-service-provider.png)

&nbsp;

LoopBack abstracts the management of content with two models:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><strong>Container</strong> provides a simple way to group objects. Think about container as a directory, a folder, or a bucket. Container defines the namespace for objects and is uniquely identified by its name, typically within a user account.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><strong>File</strong> stores the data content of an object, such as a document or image. A file is always placed in one (and only one) container. Within a container, each file has a unique name. Files in different containers can have the same name.</span>
</li>

Note that a container cannot have child containers. The two-level hierarchy is chosen for simplicity and is the common pattern supported by most cloud storage providers.

<h2 dir="ltr">
  <strong>Storage service model APIs</strong>
</h2>

LoopBack provides simple APIs to manage containers and files.  The APIs are mixed into models that are attached to a data source configured with the loopback-storage-service connector; for example:

```js
var ds = loopback.createDataSource({
connector: require('loopback-storage-service'),
provider: 'filesystem',
root: path.join(__dirname, 'storage')
});
var Container = ds.createModel('container');
```

Now the container model will have the following methods:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">getContainers(cb): List all containers</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">createContainer(options, cb): Create a new container</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">destroyContainer(container, cb): Destroy an existing container</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">getContainer(container, cb): Look up a container by name</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">uploadStream(container, file, options, cb): Get the stream for uploading</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">downloadStream(container, file, options, cb): Get the stream for downloading</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">getFiles(container, download, cb): List all files within the given container</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">getFile(container, file, cb): Look up a file by name within the given container</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">removeFile(container, file, cb): Remove a file by name within the given container</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">upload(req, res, cb): Handle the file upload at the server side</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">download(container, file, res, cb): Handle the file download at the server side</span>
</li>

&nbsp;

<h2 dir="ltr">
  <strong>Configure the storage providers</strong>
</h2>

Each storage provider takes different settings; these details about each specific provider can be found below:

**<span style="font-size: 18px;">Local File System</span>**

```js
{ provider: 'filesystem',
root: '/tmp/storage' }
```

Please note the root folder needs to exist. Create it first.

**<span style="font-size: 18px;"><a href="http://aws.amazon.com/s3/">Amazon</a></span>**

```js
{ provider: 'amazon',
key: '...',
keyId: '...' }
```

**<span style="font-size: 18px;"><a href="http://www.rackspace.com/cloud/files/">Rackspace</a></span>**

```js
{ provider: 'rackspace',
username: '...',
apiKey: '...' }
```

**<span style="font-size: 18px;"><a href="http://www.openstack.org/software/openstack-storage/">OpenStack</a></span>**

```js
{ provider: 'openstack',
username: 'your-user-name',
password: 'your-password',
authUrl: 'https://your-identity-service' }
```

**<span style="font-size: 18px;"><a href="http://www.windowsazure.com/en-us/services/storage/">Azure</a></span>**

```js
{ provider: 'azure',
storageAccount: "test-storage-account", // Name of your storage account storageAccessKey: "test-storage-access-key" // Access key for storage account }
```

<h2 dir="ltr">
  <strong>REST APIs</strong>
</h2>

<div dir="ltr">
  <table>
    <colgroup> <col width="84" /> <col width="270" /> <col width="270" /></colgroup> <tr>
      <td>
        HTTP Method
      </td>

      <td>
        URI
      </td>

      <td>
        Description
      </td>
    </tr>

    <tr>
      <td>
        GET
      </td>

      <td>
        /api/containers
      </td>

      <td>
        List all containers
      </td>
    </tr>

    <tr>
      <td>
        GET
      </td>

      <td>
        /api/containers/:container
      </td>

      <td>
        Get information about specified container
      </td>
    </tr>

    <tr>
      <td>
        POST
      </td>

      <td>
        /api/containers
      </td>

      <td>
        Create a new container
      </td>
    </tr>

    <tr>
      <td>
        DELETE
      </td>

      <td>
        /api/containers/:container
      </td>

      <td>
        Delete specified container
      </td>
    </tr>

    <tr>
      <td>
        GET
      </td>

      <td>
        /api/containers/:container/files
      </td>

      <td>
        List all files within specified container
      </td>
    </tr>

    <tr>
      <td>
        GET
      </td>

      <td>
        /api/containers/:container/files/:file
      </td>

      <td>
        Get information for specified file within specified container
      </td>
    </tr>

    <tr>
      <td>
        DELETE
      </td>

      <td>
        /api/containers/:container/files/:file
      </td>

      <td>
        Delete a file within a given container by name
      </td>
    </tr>

    <tr>
      <td>
        POST
      </td>

      <td>
        /api/containers/:container/upload
      </td>

      <td>
        Upload one or more files into the specified container. The request body must use multipart/form-data which the file input type for HTML uses.
      </td>
    </tr>

    <tr>
      <td>
        GET
      </td>

      <td>
        /api/containers/:container/download/:file
      </td>

      <td>
        Download a file within specified container
      </td>
    </tr>
  </table>
</div>

&nbsp;

<h2 dir="ltr">
  <strong>Client SDKs</strong>
</h2>

<p dir="ltr">
  Coming soon! Native support for File objects in the LoopBack Android and client JavaScript SDKs.
</p>

<p dir="ltr">
  For a &#8220;sneak peek&#8221; of the HTML5/JavaScript implementation, see the <a title="W3C FileAPI spec" href="http://www.w3.org/TR/FileAPI/">W3C FileAPI spec</a>.
</p>

<h2 dir="ltr">
  <strong>Run the demo</strong>
</h2>

`$ git clone <a href="http://github.com/strongloop/loopback-storage-service.git">http://github.com/strongloop/loopback-storage-service.git</a><br />
$ cd loopback-storage-service<br />
$ npm install<br />
$ node example/app`

Now open your browser and point to <http://localhost:3000>.

The client side code was derived from this [example](http://nervgh.github.io/pages/angular-file-upload/examples/simple/).

## **What’s next?**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Install LoopBack with a <a href="http://strongloop.com/get-started/">simple npm command</a></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What’s in the upcoming Node v0.12 version? <a href="http://strongloop.com/strongblog/performance-node-js-v-0-12-whats-new/">Big performance optimizations</a>, read the blog by Ben Noordhuis to learn more.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Need performance monitoring, profiling and cluster capabilites for your Node apps? Check out <a href="http://strongloop.com/node-js-performance/strongops/">StrongOps</a>!</span>
</li>
