---
id: 16071
title: Getting Started with the PostgreSQL Connector for LoopBack
date: 2014-05-07T08:38:36+00:00
author: Raymond Feng
guid: http://strongloop.com/?p=16071
permalink: /strongblog/postgresql-node-js-apis-loopback-connector/
sidebar:







inline_featured_image:
  - "0"


categories:
  - Community
  - How-To
  - LoopBack
---
StrongLoop is pleased to announce the 1.0.0 release of the [LoopBack PostgreSQL Connector](https://github.com/strongloop/loopback-connector-postgresql), that enables LoopBack powered applications to access PostgreSQL databases. The PostgreSQL connector is a new member of the LoopBack connector family. It supports the same model APIs as other LoopBack database connectors for create, read, update, and delete (CRUD) operations, synchronization, and discovery.

<img class="aligncenter size-full wp-image-16084" alt="postgresql" src="{{site.url}}/blog-assets/2014/05/postgresql.jpeg" width="252" height="200" />

What&#8217;s [LoopBack](http://loopback.io/doc/index.html)? It&#8217;s an open-source API server for Node.js applications. It enables mobile apps to connect to enterprise data through models that use pluggable [data sources and connectors](https://apidocs.strongloop.com/loopback-datasource-juggler/). Connectors provide connectivity to backend systems such as databases. Models are in turn exposed to mobile devices through REST APIs and client SDKs.

<img class="aligncenter size-full wp-image-14996" alt="loopback_logo" src="{{site.url}}/blog-assets/2014/04/loopback_logo.png" width="1590" height="498"  />

This blog will explore this new PostgreSQL connector using a simple example.<!--more-->

## **Prerequisites**

First, make sure you have the StrongLoop command-line tool, slc, installed.

`$ npm install -g strong-cli`

<h2 dir="ltr">
  <strong>Get example application</strong>
</h2>

The LoopBack database example application is available at [https://github.com/strongloop-community/loopback-example-database](https://github.com/strongloop-community/loopback-mysql-example).  The project contains examples to demonstrate five LoopBack connectors:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><a href="https://github.com/strongloop/loopback-connector-postgresql">LoopBack PostgreSQL connector</a></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><a href="https://github.com/strongloop/loopback-connector-mongodb">LoopBack MongoDB connector</a> </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><a href="https://github.com/strongloop/loopback-connector-oracle">LoopBack Oracle connector</a> </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><a href="https://github.com/strongloop/loopback-connector-mysql">LoopBack MySQL connector</a> </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><a href="https://github.com/strongloop/loopback-connector-mssql">LoopBack Microsoft SQL Server (MSSQL) connector</a> </span>
</li>

You can switch between the databases by updating `datasources.json` and `models.json`. No code change is required. In the following steps, you’ll use PostgreSQL as the example.  By default, the application connects to a PostgreSQL server running on demo.strongloop.com.
  
`<br />
$ git clone git@github.com:strongloop-community/loopback-example-database.git<br />
$ cd loopback-example-database<br />
$ git checkout postgresql`

The last command ensures that you’re connecting to the PostgreSQL server instead of Oracle, MongoDB, or MySQL.

Now install dependencies:

`$ npm install`

<h2 dir="ltr">
  <strong>Run the example application</strong>
</h2>

Run the sample application as usual:

`$ node .`

Now load the API explorer in your browser at  <http://0.0.0.0:3000/explorer>.  You can check out the REST API that the application exposes.

Click on the GET endpoint labeled [Find all instances of the model matched by filter from the data source](http://0.0.0.0:3000/explorer/#!/accounts/account_find_get_4), then click &#8220;Try it out!&#8221;

You’ll see that there are two account records in the database, returned in JSON format.

<h2 dir="ltr">
  <strong>Create a new LoopBack application</strong>
</h2>

Now you’ll create a new application similar to the example using the slc command:
  
`<br />
$ slc lb project my-postgres-example<br />
$ cd my-postgres-example<br />
$ slc lb datasource accountDB --connector postgresql<br />
$ slc lb model account -i --data-source accountDB` 

Follow the prompts to create your model with the following properties:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">email: string &#8211; The email address for the account. </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">level: number &#8211; Your game level. </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">created: date &#8211; The date your account was created. </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">modified: date &#8211; The date your account was updated. </span>
</li>

The properties will be saved to models.json.

<h2 dir="ltr">
  <strong>Install dependencies</strong>
</h2>

Now add the `loopback-connector-postgresql` module and install the dependencies.

`$ npm install loopback-connector-postgresql --save`

**NOTE:** Don’t worry if you see errors like this:
  
`...<br />
/bin/sh: pg_config: command not found<br />
gyp: Call to 'pg_config --libdir' returned exit status 127.<br />
gyp ERR! configure error<br />
...`

The PostgreSQL connector looks for the native PostgreSQL client, but if it’s not installed, it falls back to a pure JavaScript solution so you can ignore these errors.

<h2 dir="ltr">
  <strong>Configure the data source</strong>
</h2>

The generated data source uses the memory connector by default.  To connect to PostgreSQL instead, edit `datasources.json` and look for the data source configuration for PostgreSQL:

```js
"accountDB": {
   "connector": "postgresql"
}
```

Replace the above lines with:

```js
  "accountDB": {
   "connector": "postgresql",
   "host": "demo.strongloop.com",
   "port": 5432,
   "database": "demo",
   "username": "demo",
   "password": "L00pBack"
 }
```

<p dir="ltr">
  This will connect the application to the PostgreSQL server running on demo.strongloop.com.
</p>

<h2 dir="ltr">
  <strong>Create the table and add test data</strong>
</h2>

Now you have an account model in LoopBack, do you need to run some SQL statements to create the corresponding table in the PostgreSQL database?

Sure, but LoopBack provides Node.js APIs to do so automatically. To make things easy, use some pre-written code in `loopback-example-database/create-test-data.js`.

Copy this file into your application directory. Then enter this command to run the script:

`$ node create-test-data`

Look at the code:

```js
  dataSource.automigrate('account', function (err) {
     accounts.forEach(function(act) {
       Account.create(act, function(err, result) {
         if(!err) {
           console.log('Record created:', result);
         }
       });
     });
   });
```

`dataSource.automigrate()` creates or re-creates the table in PostgreSQL based on the model definition for account. _Please note this function will drop the table if it exists and your data will be lost._  If you need to keep existing data, use `dataSource.autoupdate()` instead.

`Account.create()` inserts two sample records to the PostgreSQL table.

<h2 dir="ltr">
  <strong>Run the application</strong>
</h2>

`$ node .`
  
Now open your browser.  To view all accounts, go to <http://localhost:3000/api/accounts>. This is the JSON response:

```js
  [
     {
       "email": "foo@bar.com",
       "level": 10,
       "created": "2013-10-15T21:34:50.000Z",
       "modified": "2013-10-15T21:34:50.000Z",
       "id": 1
     },
     {
       "email": "bar@bar.com",
       "level": 20,
       "created": "2013-10-15T21:34:50.000Z",
       "modified": "2013-10-15T21:34:50.000Z",
       "id": 2
     }
   ]
```

To get an account by ID, go to <http://localhost:3000/api/accounts/1>.

```js
  {
     "email": "foo@bar.com",
     "level": 10,
     "created": "2013-10-15T21:34:50.000Z",
     "modified": "2013-10-15T21:34:50.000Z",
     "id": "1"
   }
```

You can explore all the REST APIs at: `http://0.0.0.0:3000/explorer/<code>`</code>

<h2 dir="ltr">
  <strong>Use the discovery to create model</strong>
</h2>

Now you have the account table in PostgreSQL, you can use the LoopBack discovery APIs to  create the LoopBack model from the database. Copy the script from `loopback-example-database/discover.js`.

Run the script:

`$ node discover`

First, you’ll see output as the script creates the `account` model in JSON format.

```js
  {
     "name": "Account",
     "options": {
       "idInjection": false,
       "postgresql": {
         "schema": "public",
         "table": "account"
       }
     },
     "properties": {
       "email": {
         "type": "String",
         "required": false,
         "length": 1073741824,
         "precision": null,
         "scale": null,
         "postgresql": {
           "columnName": "email",
           "dataType": "character varying",
           "dataLength": 1073741824,
           "dataPrecision": null,
           "dataScale": null,
           "nullable": "YES"
         }
       },
       ...,
       "id": {
         "type": "Number",
         "required": false,
         "length": null,
         "precision": 32,
         "scale": 0,
         "postgresql": {
           "columnName": "id",
           "dataType": "integer",
           "dataLength": null,
           "dataPrecision": 32,
           "dataScale": 0,
           "nullable": "NO"
         }
       }
     }
   }
```

Then it uses the model to find all accounts from PostgreSQL:

```js
[ { id: 1,
   email: 'foo@bar.com',
   level: 10,
   created: Tue Oct 15 2013 14:34:50 GMT-0700 (PDT),
   modified: Tue Oct 15 2013 14:34:50 GMT-0700 (PDT) },
 { id: 2,
   email: 'bar@bar.com',
   level: 20,
   created: Tue Oct 15 2013 14:34:50 GMT-0700 (PDT),
   modified: Tue Oct 15 2013 14:34:50 GMT-0700 (PDT) } ]
```

Examine the code in `discover.js` too: it&#8217;s surprisingly simple! The `dataSource.discoverSchema()` method returns the model definition based on the account table schema. `dataSource.discoverAndBuildModels()` goes one step further by making the model classes available to perform CRUD operations.

```js
  dataSource.discoverSchema('account', {schema: 'demo'}, function (err, schema) {
       console.log(JSON.stringify(schema, null, '  '));
   });

   dataSource.discoverAndBuildModels('account', {schema: 'demo'}, function (err, models) {
       models.Account.find(function (err, act) {
           if (err) {
               console.error(err);
           } else {
               console.log(act);
           }
       });
   });
```

As you have seen, the PostgreSQL connector for LoopBack enables applications to work with data in PostgreSQL databases. It can be new data generated by mobile devices that need to be persisted, or existing data that need to be shared between mobile clients and other backend applications. No matter where you start, LoopBack makes it easy to handle your data with PostgreSQL.

## **What’s next?**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Install LoopBack with a <a href="http://strongloop.com/get-started/">simple npm command</a></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What’s in the upcoming Node v0.12 version? <a href="http://strongloop.com/strongblog/performance-node-js-v-0-12-whats-new/">Big performance optimizations</a>, read the blog by Ben Noordhuis to learn more.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Need performance monitoring, profiling and cluster capabilities for your Node apps? Check out <a href="http://strongloop.com/node-js-performance/strongops/">StrongOps</a>!</span>
</li>