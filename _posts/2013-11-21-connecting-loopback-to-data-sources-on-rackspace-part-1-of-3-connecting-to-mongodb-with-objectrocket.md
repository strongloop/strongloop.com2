---
id: 9960
title: 'Connecting LoopBack to Data sources on Rackspace, Part 1 of 3: Connecting to MongoDB with ObjectRocket'
date: 2013-11-21T01:25:37+00:00
author: Matt Schmulen
guid: http://strongloop.com/?p=9960
permalink: /strongblog/connecting-loopback-to-data-sources-on-rackspace-part-1-of-3-connecting-to-mongodb-with-objectrocket/
categories:
  - How-To
  - LoopBack
---
&nbsp;

## <span style="font-size: 1.5em;">MongoDB and LoopBack Node on Rackspace</span>

<p style="text-align: center;">
  <a href="https://strongloop.com/wp-content/uploads/2013/11/ObjectRocketHiRez-3.png"><img class="aligncenter  wp-image-10504" alt="ObjectRocketHiRez (3)" src="https://strongloop.com/wp-content/uploads/2013/11/ObjectRocketHiRez-3.png" width="550" height="284" /></a>
</p>

Data brings mobile applications to life and [MongoDB](http://www.mongodb.org/) is often a preferred choice for mobile first data. MongoDB&#8217;s powerful document-oriented database combined with [Rackspace&#8217;s MongoDB as a service platform ObjectRocket](http://www.objectrocket.com/) makes it easy to give your mobile stack a fast and reliable persistent data store in a matter of minutes.

### <a href="https://github.com/mschmulen/connecting-nodejs-apps-to-data-on-rackspace#standing-up-your-rackspace-node-server" name="standing-up-your-rackspace-node-server"></a>Standing up your Rackspace Node server

If you already have a LoopBack server running you can skip this section and go to configuring ObjectRocket.

<!--more-->



Standing up a rackspace server with StrongLoop Node and Loopback is easy with Rackspace deployments. You can find a full walk through on the [deploying LoopBack on Rackspace](http://strongloop.com/strongblog/deploying-loopback-mbaas-on-rackspace/) blog post.

Once you have your StrongLoop server running you can start binding your API to a data store. StrongLoop has supported LoopBack connectors for:

  * <span style="font-size: medium;"><a href="http://docs.strongloop.com/loopback-connector-mongodb/">Connecting LoopBack to MongoDB</a></span>
  * <span style="font-size: medium;"><a href="http://docs.strongloop.com/loopback-connector-oracle/">Connecting LoopBack to OracleDB</a></span>
  * <span style="font-size: medium;"><a href="http://docs.strongloop.com/loopback-connector-mysql/">Connecting LoopBack to MySQL</a></span>

For this sample we are going to bind our LoopBack Mobile API tier to the ObjectRocket MongoDB hosted service.

ObjectRocket is the highly available, horizontally scalable, and consistently fast MongoDB service.

MongoDB as a service with ObjectRocket make it fast and simple to provision your MongoDB instance, build on a fast and reliable data platform and automate MongoDB administration. Giving you an industrial-strength MongoDB platform that delivers performance and scalability for complex mobile data.

### <a href="https://github.com/mschmulen/connecting-nodejs-apps-to-data-on-rackspace#configuring-objectrocket-mongodb-as-a-service" name="configuring-objectrocket-mongodb-as-a-service"></a>Configuring ObjectRocket MongoDB as a service

&nbsp;

Get up and running on the ObjectRocket in 4 steps. Check out their getting [started guide](http://docs.objectrocket.com/getting_started) for more detailed information.

  1. <span style="font-size: medium;">Create an ObjectRocket account at <a href="http://www.objectrocket.com/">objectRocket.com</a><a href="https://raw.github.com/mschmulen/connecting-nodejs-apps-to-data-on-rackspace/master/screenshots/signup.png" target="_blank"><img alt=" create instance " src="https://raw.github.com/mschmulen/connecting-nodejs-apps-to-data-on-rackspace/master/screenshots/signup.png" /></a></span>
  2. <span style="font-size: medium;">Create a instance<a href="https://raw.github.com/mschmulen/connecting-nodejs-apps-to-data-on-rackspace/master/screenshots/createinstance.png" target="_blank"><img alt=" create instance " src="https://raw.github.com/mschmulen/connecting-nodejs-apps-to-data-on-rackspace/master/screenshots/createinstance.png" /></a></span>
  3. <span style="font-size: medium;">Create a database<a href="https://raw.github.com/mschmulen/connecting-nodejs-apps-to-data-on-rackspace/master/screenshots/adddatabase.png" target="_blank"><img alt="image" src="https://raw.github.com/mschmulen/connecting-nodejs-apps-to-data-on-rackspace/master/screenshots/adddatabase.png" /></a></span>
  4. <span style="font-size: medium;">Add a ACL<a href="https://raw.github.com/mschmulen/connecting-nodejs-apps-to-data-on-rackspace/master/screenshots/addacl.png" target="_blank"><img alt=" create instance " src="https://raw.github.com/mschmulen/connecting-nodejs-apps-to-data-on-rackspace/master/screenshots/addacl.png" /></a><a href="https://raw.github.com/mschmulen/connecting-nodejs-apps-to-data-on-rackspace/master/screenshots/addacl2.png" target="_blank"><img alt="image" src="https://raw.github.com/mschmulen/connecting-nodejs-apps-to-data-on-rackspace/master/screenshots/addacl2.png" /></a></span>

ObjectRocket supports both the [native MongoDB drivers](http://docs.objectrocket.com/native) as well as an [API](http://docs.objectrocket.com/api) so we can configure LoopBack to access the service via [LoopBacks MongoDB connector](http://docs.strongloop.com/loopback-connector-mongodb/).

#### <a href="https://github.com/mschmulen/connecting-nodejs-apps-to-data-on-rackspace#create-your-loopback-api-server" name="create-your-loopback-api-server"></a>Create your LoopBack API server

Out of the box LoopBack is configured to run with an &#8216;in-memory&#8217; data store. If you launched your LoopBack instance from the Rackspace &#8216;Deployments&#8217; panel then LoopBack has 3 starter models predefined : &#8216;Products&#8217;, &#8216;Customers&#8217; and &#8216;Locations&#8217;. You can also create a LoopBack application from scratch with the [slc](http://docs.strongloop.com/strongnode/#strongloop-control-slc) commands below. These commands work regardless of a cloud, on-premises or developer machine instantiation.

Creating a LoopBack Node server with the following slc command line :

```js
slc lb project loopback-node-server
cd loopback-node-server
slc install

slc lb model product
slc lb model customer
slc lb model location
```

### <a href="https://github.com/mschmulen/connecting-nodejs-apps-to-data-on-rackspace#connecting-loopback-to-mongodb" name="connecting-loopback-to-mongodb"></a>Connecting LoopBack to MongoDB

Configuring LoopBack to leverage MongoDB as the primary data store in 3 easy steps.

  1. Add the MongoDB connector to your loopback app

```js
slc install loopback-connector-mongodb --save
```

  1. From within your LoopBack project `~/loopback-node-server` Configure the data source to connect to MongoDB by modifying the `~/loopback-node-server/modules/db/index.js` file.

Update index.js to use the MongoDB datastore configuration defined in you ObjectRocket instance configuration.

```js
var loopback = require('loopback');

//module.exports = loopback.createDataSource({
//  connector: loopback.Memory
//});

module.exports = loopback.createDataSource({
  connector: require('loopback-connector-mongodb'),
  host: 'iad-c11-0.objectrocket.com',
  port: 48018,
  database: 'myDatabaseName',
  username: 'myDatabaseUser',
  password: 'myPassword'
});
```

  1. Restart/run your application.

```js
slc run app.js
```

### <a href="https://github.com/mschmulen/connecting-nodejs-apps-to-data-on-rackspace#verify-your-connection" name="verify-your-connection"></a>Verify your connection

Verifying your connection is simple with Loopback. Open a web browser to the loopback explorer page<http://localhost:3000/explorer> and create a new instance of the &#8216;product&#8217; type by selecting the &#8216;POST&#8217; operation under &#8216;Products&#8217;.

<a href="https://raw.github.com/mschmulen/connecting-nodejs-apps-to-data-on-rackspace/master/screenshots/loopback-post-new-products.png" target="_blank"><img alt="image" src="https://raw.github.com/mschmulen/connecting-nodejs-apps-to-data-on-rackspace/master/screenshots/loopback-post-new-products.png" /></a>

{&#8220;name&#8221;: &#8220;myProduct&#8221; , &#8220;price&#8221;:22.22 , &#8220;inventory&#8221;: 33}

Then click the &#8220;Try it out!&#8221; button.

You should see the resulting update in the &#8216;Url&#8217;, &#8216;Body&#8217;, &#8216;Response&#8217; and &#8216;Response Header&#8217; fields:

```js
Request URL
    http://localhost:3000/products

Response Body

{
  "id": "528552f99bb9f75c45460c09",
  "name": "myProduct",
  "price": 22.22,
  "inventory": 33
}

Response Code
    200

Response Headers
    Access-Control-Allow-Origin: *
    Date: Thu, 14 Nov 2013 22:47:21 GMT
    Connection: keep-alive
    X-Powered-By: Express
    Content-Length: 98
    Content-Type: application/json; charset=utf-8
```

You can verify the data was persisted in the MonogDB Data store by restarting your server and then calling the products endpoint to return all instances of the &#8216;product type&#8217;

<http://localhost:3000/products>

You will then see the resulting response return your previously posted data from your ObjectRocket MongoDB data store.

```js
[
    {
        "id": "528552f99bb9f75c45460c09",
        "name": "myProduct",
        "price": 22.22,
        "inventory": 33,
        "_id": "528552f99bb9f75c45460c09"
    }
]
```

### <a href="https://github.com/mschmulen/connecting-nodejs-apps-to-data-on-rackspace#mobilize-your-data" name="mobilize-your-data"></a>Mobilize your data

Now that you have a reliable and fast back end data store with a mobile API framework you can integrate your Native Mobile application with the [Loopback iO](http://strongloop.com/mobile/ios/)S or [Android SDK](http://strongloop.com/mobile/ios/). Make sure and check out our other posts on bringing your iOS and Android app to life with the data it needs.

MongoDB is a great choice for mobile first data that is generated and consumed by the mobile client. If you need to integrate legacy data from existing data stores sign up for the StrongLoop newsletter for future posts on integrating Oracle and MySQL data into your LoopBack mobile backend.

&nbsp;

## **[What’s next?](http://strongloop.com/get-started/)**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What’s in the upcoming Node v0.12 release? <a href="http://strongloop.com/node-js/whats-new-in-node-js-v0-12/">Six new features, plus new and breaking APIs</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js <a href="http://strongloop.com/node-js/loopback/">LoopBack framework</a>. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Need <a href="http://strongloop.com/node-js-support/expertise/">training and certification</a> for Node? Learn more about both the private and open options StrongLoop offers.</span>
</li>
