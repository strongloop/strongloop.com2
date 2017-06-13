---
id: 8015
title: 'Recipes for LoopBack Models, part 5 of 5: Model Synchronization with Relational Databases'
date: 2013-10-31T09:30:55+00:00
author: Raymond Feng
guid: http://strongloop.com/?p=8015
permalink: /strongblog/recipes-for-loopback-models-part-5-of-5-model-synchronization-with-relational-databases/
categories:
  - How-To
  - LoopBack
---
[Last time](http://strongloop.com/strongblog/recipes-for-loopback-models-part-4-of-5-models-by-instance-introspection/), we looked at using LoopBack while defining models from scratch. In the last part of this 5-part series, we demonstrate how to synchronize your data.

> <p dir="ltr">
>   Now I have defined a LoopBack model, can LoopBack create or update the database schemas for me?
> </p>

<p dir="ltr">
  LoopBack provides two ways to synchronize model definitions with table schemas:
</p>

- Auto-migrate: Automatically create or re-create the table schemas based on the model definitions. WARNING: An existing table will be dropped if its name matches the model name.
- Auto-update: Automatically alter the table schemas based on the model definitions.


<h3 dir="ltr">
  Auto-migration
</h3>

<p dir="ltr">
  Let&#8217;s start with auto-migration of model definition. Here&#8217;s an example:
</p>

```js
var schema_v1 =
{
  "name": "CustomerTest",
  "options": {
    "idInjection": false,
    "oracle": {
      "schema": "LOOPBACK",
      "table": "CUSTOMER_TEST"
    }
  },
  "properties": {
    "id": {
      "type": "String",
      "length": 20,
      "id": 1
    },
    "name": {
      "type": "String",
      "required": false,
      "length": 40
    },
    "email": {
      "type": "String",
      "required": false,
      "length": 40
    },
    "age": {
      "type": "Number",
      "required": false
    }
  }
};
```

<p dir="ltr">
  Assuming the model doesn&#8217;t have a corresponding table in the Oracle database, you can create the corresponding schema objects to reflect the model definition:
</p>

```js
var ds = require('../data-sources/db')('oracle');
var Customer = require('../models/customer');
ds.createModel(schema_v1.name, schema_v1.properties, schema_v1.options);

ds.automigrate(function () {
  ds.discoverModelProperties('CUSTOMER_TEST', function (err, props) {
    console.log(props);
  });
});
```

<p dir="ltr">
  This creates the following objects in the Oracle database:
</p>

- A table CUSTOMER_TEST.
- A sequence CUSTOMER_TEST_ID_SEQUENCE for keeping sequential IDs.
- A trigger CUSTOMER_ID_TRIGGER that sets values for the primary key.

<p dir="ltr">
  Now we decide to make some changes to the model. Here is the second version:
</p>

```js
var schema_v2 =
{
  "name": "CustomerTest",
  "options": {
    "idInjection": false,
    "oracle": {
      "schema": "LOOPBACK",
      "table": "CUSTOMER_TEST"
    }
  },
  "properties": {
    "id": {
      "type": "String",
      "length": 20,
      "id": 1
    },
    "email": {
      "type": "String",
      "required": false,
      "length": 60,
      "oracle": {
        "columnName": "EMAIL",
        "dataType": "VARCHAR",
        "dataLength": 60,
        "nullable": "Y"
      }
    },
    "firstName": {
      "type": "String",
      "required": false,
      "length": 40
    },
    "lastName": {
      "type": "String",
      "required": false,
      "length": 40
    }
  }
}
```

<h3 dir="ltr">
  Auto-update
</h3>

<p dir="ltr">
  If we run auto-migrate again, the table will be dropped and data will be lost. To avoid this problem use auto-update, as illustrated here:
</p>

```js
ds.createModel(schema_v2.name, schema_v2.properties, schema_v2.options);
ds.autoupdate(schema_v2.name, function (err, result) {
  ds.discoverModelProperties('CUSTOMER_TEST', function (err, props) {
    console.log(props);
  });
});
```

<p dir="ltr">
  Instead of dropping tables and recreating them, autoupdate calculates the difference between the LoopBack model and the database table definition and alters the table accordingly. This way, the column data will be kept as long as the property is not deleted from the model.
</p>

<h2 dir="ltr">
  Summary
</h2>

<p dir="ltr">
  This series has walked through a few different use cases and how LoopBack handles each. Take a look at the table below for a round-up of what was covered.
</p>

<div dir="ltr">
  <table id="tablepress-6" class="tablepress tablepress-id-6 tablepress-responsive-phone">
    <tr class="row-1 odd">
      <th class="column-1">
        Recipe
      </th>
      
      <th class="column-2">
        Use Case
      </th>
      
      <th class="column-3">
        Model Strict Mode
      </th>
      
      <th class="column-4">
        Database
      </th>
    </tr>
    
    <tr class="row-2 even">
      <td class="column-1">
        Open Model
      </td>
      
      <td class="column-2">
        Taking care of free-form data
      </td>
      
      <td class="column-3">
        false
      </td>
      
      <td class="column-4">
        NoSQL
      </td>
    </tr>
    
    <tr class="row-3 odd">
      <td class="column-1">
        Plain Model
      </td>
      
      <td class="column-2">
        Defining a model to represent data
      </td>
      
      <td class="column-3">
        true or false
      </td>
      
      <td class="column-4">
        NoSQL or RDB
      </td>
    </tr>
    
    <tr class="row-4 even">
      <td class="column-1">
        Model from discovery
      </td>
      
      <td class="column-2">
        Consuming existing data from RDB
      </td>
      
      <td class="column-3">
        true
      </td>
      
      <td class="column-4">
        RDB
      </td>
    </tr>
    
    <tr class="row-5 odd">
      <td class="column-1">
        Model from introspection
      </td>
      
      <td class="column-2">
        Consuming JSON data from NoSQL/REST
      </td>
      
      <td class="column-3">
        false
      </td>
      
      <td class="column-4">
        NoSQL
      </td>
    </tr>
    
    <tr class="row-6 even">
      <td class="column-1">
        Model synchronization
      </td>
      
      <td class="column-2">
        Making sure models are in sync
      </td>
      
      <td class="column-3">
        true
      </td>
      
      <td class="column-4">
        RDB
      </td>
    </tr>
  </table>
  
  <!-- #tablepress-6 from cache -->
</div>

<h2 dir="ltr">
  References
</h2>

<li dir="ltr">
    <a href="https://github.com/strongloop/loopback-recipes">https://github.com/strongloop/loopback-sample-recipes</a>
</li>

<li dir="ltr">
    <a href="http://wiki.strongloop.com/display/DOC/LoopBack">http://wiki.strongloop.com/display/DOC/LoopBack</a>
</li>

<li dir="ltr">
    <a href="http://wiki.strongloop.com/display/DOC/Oracle+connector">http://wiki.strongloop.com/display/DOC/Oracle+connector</a>
</li>

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