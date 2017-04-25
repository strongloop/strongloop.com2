---
id: 8356
title: Getting Started with the MySQL Connector for LoopBack
date: 2013-11-06T07:48:00+00:00
author: Raymond Feng
guid: http://strongloop.com/?p=8356
permalink: /strongblog/getting-started-with-the-mysql-connector-for-loopback/
categories:
  - LoopBack
  - Product
---
<p dir="ltr">
  We’re happy to announce the release of the LoopBack MySQL Connector that enables LoopBack applications to access MySQL databases.  It is being released as part of StrongLoop Suite 1.1, as a <a title="GitHub module loopback-connector-mysql" href="https://github.com/strongloop/loopback-connector-mysql">GitHub module</a>, and as an <a title="NPM module loopback-connector-mysql" href="https://npmjs.org/package/loopback-connector-mysql">NPM package</a> .
</p>

<p dir="ltr">
  StrongLoop Suite includes the <a href="http://docs.strongloop.com/loopback">LoopBack</a> open-source mobile backend framework that enables mobile apps to connect to enterprise data through models that use pluggable <a href="http://docs.strongloop.com/loopback-datasource-juggler/#loopback-datasource-and-connector-guide">data sources and connectors</a>. Connectors provide connectivity to backend systems such as databases. Models are in turn exposed to mobile devices through REST APIs and client SDKs.
</p>

<!--more-->

<p dir="ltr">
  Let’s start to explore this new module step by step. The code below is available at <a href="https://github.com/strongloop-community/loopback-mysql-example">https://github.com/strongloop-community/loopback-mysql-example</a>. You can browse the project as you go or check it out to your computer with this command:
</p>

```js
git clone git@github.com:strongloop-community/loopback-mysql-example.git
```

## 

## 

## **Prerequisites**

<p dir="ltr">
  First, make sure you have strong-cli tools installed.
</p>

```js
npm install -g strong-cli
```

<p dir="ltr">
  Next, you need a running MySQL server. In this article, you&#8217;ll connect to an instance running on demo.strongloop.com.
</p>

## **Create the LoopBack application**

<p dir="ltr">
  Now use the  slc command to  create a simple application from scratch:
</p>

```js
slc lb project loopback-mysql-example
cd loopback-mysql-example
slc lb model account -i
```

<p dir="ltr">
  Follow the prompts to create your model with the following properties:
</p>

<li dir="ltr">
  email: string &#8211; The email id for the account
</li>
<li dir="ltr">
  level: number &#8211; The game level you are in
</li>
<li dir="ltr">
  created: date &#8211; The date your account is created
</li>
<li dir="ltr">
  modified: date &#8211; The date your account is updated
</li>

<p dir="ltr">
  The properties will be saved to modules/account/properties.json.
</p>

## **Install dependencies**

<p dir="ltr">
  Next, add the loopback-connector-mysql module and install the dependencies:
</p>

```js
npm install loopback-connector-mysql --save
slc install
```

## 

## **Configure the data source**

<p dir="ltr">
  The generated data source uses the memory connector by default.  To connect to MySQL instead, you’re going to modify the data source configuration.  Enter these commands:
</p>

```js
cd modules/db
vi index.js
```

<p dir="ltr">
  In index.js replace this code:
</p>

<pre lang="javascript">module.exports = loopback.createDataSource({
  connector: loopback.Memory
});
```

<p dir="ltr">
  with the following code:
</p>

<pre lang="javascript">module.exports = loopback.createDataSource({
  connector: require('loopback-connector-mysql'),
  host: 'demo.strongloop.com',
  port: 3306,
  database: 'demo',
  username: 'demo',
  password: 'L00pBack'
});
```

## **Create the table and add test data**

<p dir="ltr">
  Now you have an account model in LoopBack, you need to run some SQL statements to create the corresponding table in MySQL database.  LoopBack provides a Node.js API to make this really easy.
</p>

<p dir="ltr">
  Look at the code in create-test-data.js:
</p>

<pre lang="javascript">dataSource.automigrate('account', function (err) {
  accounts.forEach(function(act) {
    Account.create(act, function(err, result) {
      if(!err) {
        console.log('Record created:', result);
      }
    });
  });
});
```

<p dir="ltr">
  The call to dataSource.automigrate() creates or recreates the table in MySQL based on the model definition for account. Note this function will drop the table if it exists and your data will be lost.  Use dataSource.autoupdate() instead if you need to keep existing data.
</p>

<p dir="ltr">
  The call to Account.create() inserts two sample records to the MySQL table.
</p>

<p dir="ltr">
  Now run this code by entering this command:
</p>

```js
node create-test-data
```

<p dir="ltr">
  You’ll see some messages about two records created.  As usual with Node, you’ll need to hit Ctrl-C to terminate the app after it displays these messages.
</p>

## **Run the application**

```js
node app
```

<p dir="ltr">
  Open your browser to <a href="http://localhost:3000/accounts">http://localhost:3000/accounts</a>.  You’ll see the JSON describing the two records that you just added to the accounts table:
</p>

<pre lang="json">  
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

<p dir="ltr">
  To get an account by id, go to <a href="http://localhost:3000/accounts/1">http://localhost:3000/accounts/1</a>.
</p>

<pre lang="json">  
{
  "email": "foo@bar.com",
  "level": 10,
  "created": "2013-10-15T21:34:50.000Z",
  "modified": "2013-10-15T21:34:50.000Z",
  "id": "1"
}
```

<p dir="ltr">
  You can explore the REST API that LoopBack created with the API Explorer at:
</p>

<p dir="ltr">
  <a href="http://127.0.0.1:3000/explorer">http://127.0.0.1:3000/explorer<br /> </a>
</p>

## **Try model discovery**

<p dir="ltr">
  Now you have the account table in MySQL, you can “discover” the LoopBack model from the database. Run the following example:
</p>

```js
node discover
```

<p dir="ltr">
  First, you&#8217;ll see the model definition for account in JSON format.
</p>

<pre lang="json">{
  "name": "Account",
  "options": {
    "idInjection": false,
    "mysql": {
      "schema": "demo",
      "table": "account"
    }
  },
  "properties": {
    "id": {
      "type": "Number",
      "required": false,
      "length": null,
      "precision": 10,
      "scale": 0,
      "id": 1,
      "mysql": {
        "columnName": "id",
        "dataType": "int",
        "dataLength": null,
        "dataPrecision": 10,
        "dataScale": 0,
        "nullable": "NO"
      }
    },
    "email": {
      "type": "String",
      "required": false,
      "length": 765,
      "precision": null,
      "scale": null,
      "mysql": {
        "columnName": "email",
        "dataType": "varchar",
        "dataLength": 765,
        "dataPrecision": null,
        "dataScale": null,
        "nullable": "YES"
      }
    },
    ...
  }
}
```

<p dir="ltr">
  Then we use the model to find all accounts from MySQL:
</p>

<pre lang="json">[ { id: 1,
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

<p dir="ltr">
  Now, examine the code in discover.js. It&#8217;s surprisingly simple! The dataSource.discoverSchema() method returns the model definition based on the account table schema.
</p>

<pre lang="javascript">dataSource.discoverSchema('account', {owner: 'demo'}, function (err, schema) {
  console.log(JSON.stringify(schema, null, '  '));
});
```

<p dir="ltr">
  The dataSource.discoverAndBuildModels() method goes one step further by making the model classes available to perform CRUD operations.
</p>

<pre lang="javascript">dataSource.discoverAndBuildModels('account', {}, function (err, models) {
  models.Account.find(function (err, act) {
    if (err) {
      console.error(err);
    } else {
      console.log(act);
    }
  });
});
```

As you have seen, the MySQL connector for LoopBack enables applications to work with data in MySQL databases. It can be new data generated by mobile devices that need to be persisted, or existing data that need to be shared between mobile clients and other backend applications. No matter where you start, LoopBack makes it easy to handle your data with MySQL. It’s great to have MySQL in the Loop!

## **[What’s next?](http://strongloop.com/get-started/)**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What’s in the upcoming Node v0.12 release? <a href="http://strongloop.com/node-js/whats-new-in-node-js-v0-12/">Six new features, plus new and breaking APIs</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js <a href="http://strongloop.com/node-js/loopback/">LoopBack framework</a>. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Need <a href="http://strongloop.com/node-js-support/expertise/"]]>training and certification</a> for Node? Learn more about both the private and open options StrongLoop offers.</span>
</li>