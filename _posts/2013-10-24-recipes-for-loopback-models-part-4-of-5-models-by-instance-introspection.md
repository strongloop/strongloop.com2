---
id: 8013
title: 'Recipes for LoopBack Models, part 4 of 5: Models by Instance Introspection'
date: 2013-10-24T11:00:52+00:00
author: Raymond Feng
guid: http://strongloop.com/?p=8013
permalink: /strongblog/recipes-for-loopback-models-part-4-of-5-models-by-instance-introspection/
categories:
  - How-To
  - LoopBack
---
[Last time](http://strongloop.com/strongblog/recipes-for-loopback-models-part-3-of-5-model-discovery-with-relational-databases/), we looked at using LoopBack with relational databases, allowing you to consume existing data. This time around, we are looking at your options when the data does not have a schema.

> <p dir="ltr">
>   <em>I have JSON documents from REST services and NoSQL databases. Can LoopBack get my models from them?<br /> </em>
> </p>

<p dir="ltr">
  Yes, certainly! Here is an example:
</p>

<p dir="ltr">
   
</p>

```js
 var ds = require('../data-sources/db.js')('memory');

// Instance JSON document
var user = {
name: 'Joe',
age: 30,
birthday: new Date(),
vip: true,
address: {
street: '1 Main St',
city: 'San Jose',
state: 'CA',
zipcode: '95131',
country: 'US'
},
friends: ['John', 'Mary'],
emails: [
{label: 'work', id: 'x@sample.com'},
{label: 'home', id: 'x@home.com'}
],
tags: []
};

// Create a model from the user instance
var User = ds.buildModelFromInstance('User', user, {idInjection: true});

// Use the model for CRUD
var obj = new User(user);

console.log(obj.toObject());

User.create(user, function (err, u1) {
console.log('Created: ', u1.toObject());
User.findById(u1.id, function (err, u2) {
console.log('Found: ', u2.toObject());
});
});
```

<p dir="ltr">
  Now we understand that we can define the models from scratch, or discover them from relational databases or JSON documents. How can we make sure that the database models are in sync with LoopBack if some of the database models don&#8217;t exist or are different? LoopBack has APIs to facilitate the synchronization. We will demonstrate how next time, in the final part of this series.
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