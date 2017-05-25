---
id: 8011
title: 'Recipes for LoopBack Models, part 3 of 5: Model Discovery with Relational Databases'
date: 2013-10-17T15:49:44+00:00
author: Raymond Feng
guid: http://strongloop.com/?p=8011
permalink: /strongblog/recipes-for-loopback-models-part-3-of-5-model-discovery-with-relational-databases/
categories:
  - How-To
  - LoopBack
---
<p dir="ltr">
  In the <a href="http://strongloop.com/strongblog/recipes-for-loopback-models-part-2-of-5-models-with-schema-definitions/">prior part</a> of this 5-part series, we looked at schema definitions and defined a model using an in-memory source to mock up the data access. This time around, we are looking at model discovery with existing  relational databases or JSON documents.
</p>

> <p dir="ltr">
>   <em>I have data in an Oracle database. Can LoopBack figure out the models and expose them as APIs to my mobile applications?</em>
> </p>

<p dir="ltr">
  LoopBack makes it surprisingly simple to create models from existing data, as illustrated below for an Oracle database. First, the code sets up the Oracle data source. Then the call to discoverAndBuildModels() creates models from the database tables. Calling it with associations: true makes the discovery follow primary/foreign key relations.
</p>

  ```js
var loopback = require('loopback');
var ds = loopback.createDataSource('oracle', {
  "host": "demo.strongloop.com",
  "port": 1521,
  "database": "XE",
  "username": "demo",
  "password": "L00pBack"
});

// Discover and build models from INVENTORY table
ds.discoverAndBuildModels('INVENTORY', {visited: {}, associations: true},
function (err, models) {
  // Now we have a list of models keyed by the model name
  // Find the first record from the inventory
  models.Inventory.findOne({}, function (err, inv) {
    if(err) {
      console.error(err);
      return;
    }
    console.log("\nInventory: ", inv);
    // Navigate to the product model
    inv.product(function (err, prod) {
      console.log("\nProduct: ", prod);
      console.log("\n ------------- ");
    });
  });
});
```

<p dir="ltr">
  For more information, please check out:
</p>

<p dir="ltr">
  <a href="http://wiki.strongloop.com/display/DOC/LoopBack+data+sources+and+connectors#LoopBackdatasourcesandconnectors-Discoveringmodeldefinitionsfromadatasource">http://wiki.strongloop.com/display/DOC/LoopBack+data+sources+and+connectors#LoopBackdatasourcesandconnectors-Discoveringmodeldefinitionsfromadatasource</a>
</p>

<p dir="ltr">
  Discovery from relational databases is a quick way to consume existing data with well-defined schemas. However, some data stores don&#8217;t have schemas; for example, MongoDB or REST services. LoopBack has another option here. Find out more next time, when we will take a look at models by instance introspection in part 4 of this series.
</p>

## **[What’s next?](http://strongloop.com/get-started/)**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What’s in the upcoming Node v0.12 release? <a href="http://strongloop.com/node-js/whats-new-in-node-js-v0-12/">Six new features, plus new and breaking APIs</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js <a href="http://loopback.io/">LoopBack framework</a>. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Need <a href="http://strongloop.com/node-js-support/expertise/">training and certification</a> for Node? Learn more about both the private and open options StrongLoop offers.</span>
</li>