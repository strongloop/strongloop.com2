---
id: 8003
title: 'Recipes for LoopBack Models, part 2 of 5: Models with Schema Definitions'
date: 2013-10-09T14:45:25+00:00
author: Raymond Feng
guid: http://strongloop.com/?p=8003
permalink: /strongblog/recipes-for-loopback-models-part-2-of-5-models-with-schema-definitions/
categories:
  - How-To
  - LoopBack
---
<p dir="ltr">
  <a title="Recipes for LoopBack Models, Part 1 of 5: Open Models" href="http://strongloop.com/strongblog/recipes-for-loopback-models-part-1-of-5-open-models/" target="_blank">Last time</a>, we looked at how you can mobilize data through LoopBack with open models, which works well for free-form style data.  This time around, we are looking at models with schema definitions.
</p>

> <p dir="ltr">
>   <em>I want to build a mobile application that will interact with some backend data. I would love to see a working REST API and mobile SDK before I implement the server side logic.</em>
> </p>

<p dir="ltr">
  In this case, we&#8217;ll define a model first and use an in-memory data source to mock up the data access. You&#8217;ll get a fully-fledged REST API without writing a lot of server side code.
</p>

  ```js
var loopback = require('loopback');

var ds = loopback.createDataSource('memory');

var Customer = ds.createModel('customer', {
    id: {type: Number, id: true},
    name: String,
    emails: [String],
    age: Number},
    {strict: true});
```

<p dir="ltr">
  The snippet above creates a &#8216;Customer&#8217; model with a numeric id, a string name, an array of string emails, and a numeric age. Please also note we set the &#8216;strict&#8217; option to be true for the settings object so that LoopBack will enforce the schema and ignore unknown ones.
</p>

<p dir="ltr">
  For more information about the syntax and apis to define a data model, check out:
</p>

<p dir="ltr">
  <a href="http://docs.strongloop.com/loopback-datasource-juggler/#loopback-definition-language-guide">http://docs.strongloop.com/loopback-datasource-juggler/#loopback-definition-language-guide</a>
</p>

<p dir="ltr">
  You can now test the CRUD operations on the server side. The following code creates two customers, finds a customer by ID, and then finds customers by name to return up to three customer records.
</p>

  ```js
// Create two instances
Customer.create({
    name: 'John1',
    emails: ['john@x.com', 'jhon@y.com'],
    age: 30
    }, function (err, customer1) {
        console.log('Customer 1: ', customer1.toObject());
        Customer.create({
            name: 'John2',
            emails: ['john@x.com', 'jhon@y.com'],
            age: 30
        }, function (err, customer2) {
            console.log('Customer 2: ', customer2.toObject());
            Customer.findById(customer2.id, function(err, customer3) {
                console.log(customer3.toObject());
            });
            Customer.find({where: {name: 'John1'}, limit: 3}, function(err, customers) {
                customers.forEach(function(c) {
                console.log(c.toObject());
            });
        });
    });
});
```

<p dir="ltr">
  To expose the model as a REST API, use the following:
</p>

  ```js
var app = loopback();
app.model(Customer);
app.use(loopback.rest());
app.listen(3000, function() {
    console.log('The form application is ready at http://127.0.0.1:3000');
});
```

<p dir="ltr">
  Until now the data access has been backed by an in-memory store. To make your data persistent, simply replace it with a MongoDB database by changing the data source configuration:
</p>

  ```js
var ds = loopback.createDataSource('mongodb', {
    "host": "demo.strongloop.com",
    "database": "demo",
    "username": "demo", 
    "password": "L00pBack",
    "port": 27017
});
```

<p dir="ltr">
  For more information about data sources and connectors, please check out:
</p>

<p dir="ltr">
  <a href="http://wiki.strongloop.com/display/DOC/LoopBack+data+sources+and+connectors">http://docs.strongloop.com/loopback-datasource-juggler/#loopback-datasource-and-connector-guide</a>
</p>

<p dir="ltr">
  When defining a model, it may be troublesome to define all the properties from scratch. Fortunately, LoopBack can discover a model definition from existing systems such as relational databases or JSON documents, as we&#8217;ll show in part 3 next week.
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