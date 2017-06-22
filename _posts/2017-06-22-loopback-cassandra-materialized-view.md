---
layout: post
title: How To Use Materialized Views with LoopBack Cassandra Connector
date: 2017-06-22T05:55:00+00:00
author: Tetsuo Seto
permalink: /strongblog/cassandra-materialized-view/
categories: 
- Apache Cassandra
- LoopBack
- StrongLoop
---

In this blog, I’ll walk you through the steps and corresponding source code blocks to help make your LoopBack app interact with Cassandra Materialized Views.

[![How To Use Materialized Views with LoopBack Cassandra Connector](https://strongloop.com/blog-assets/2017/04/apache-cassandra.png)](http://cassandra.apache.org/)

Install the Cassandra connector from:

[npm](https://www.npmjs.com/package/loopback-connector-cassandra)
<!--more-->
We've provided extensive documentation for it on [loopback.io](http://loopback.io/doc/en/lb3/Cassandra-connector.html).

I'm going to use [`test/cass.custom.test.js`](https://github.com/strongloop/loopback-connector-cassandra/blob/v1.1.1/test/cass.custom.test.js) as an example of end-to-end work flow. The figure below is my attempt to visualize the work flow:

![Materialized View Access Work Flow](https://strongloop.com/blog-assets/2017/05/cassandra-materialized-views.png)

There are two top-level blocks in the figure:

(1) LoopBack app & Cassandra connector, which is the client, and;
(2) the Cassandra database back end.

Green background shows (1) LoopBack API calls down to the Cassandra driver. Blue background shows (2) CQL and Cassandra internal API calls over the Internet as well as the Cassandra system implemented in Java. As the color implies, the blue arrows show Cassandra-side data flow directions in the Cassandra back end. We are going to examine each step.

<h3>Step 1 : Create a LoopBack data source and attach the Cassandra connector instance to it</h3>

In this blog, we use `db` as the data source which is created in [`test/init.js`](https://github.com/strongloop/loopback-connector-cassandra/blob/v1.1.1/test/init.js). This step is not included in the figure.

```js
// Since the test code resides in the connector itself,
// require('../') below is the Cassandra connector instance
// config parameter specifies host, post, and keyspace name
// of the back end data base.
var db = new DataSource(require('../'), config);
```

<h3>Step 2 : Schema definition and model creation of the base table</h3>

As shown in the area of blue background, there is a base table and two views associated with the base table. In the example, the base table is called `allInfo`. The base table is an ordinary table, i.e., the table schema is defined and the model is created by `db.define` LoopBack operation and the schema is populated to the database back end by `db.automigrate` LoopBack operation.

```js
var allInfo, members, teams; // LoopBack models

allInfo = db.define('allInfo', {
  team: {type: String, id: 1},
  league: String,
  member: {type: String, id: 2},
  zipCode: Number,
  registered: Boolean,
});

db.automigrate(['allInfo'], function(err) {
  if (err) return done(err);
  members = createModelFromViewSchema('members'); // see Step 3
  teams = createModelFromViewSchema('teams'); // see Step 3
});
```

<h3>Step 3 : Create models for materialized views</h3>

Materialized views look exactly like tables to your LoopBack app. However, LoopBack doesn't provides `define` and `automigrate` for Materialized Views. Thus, we need to use `db.createModel` LoopBack operation and create a model for each materialized view. We will use the model to read data from the materialized view. As the arrows in the figure show, the app can only read from the materialized view.

In the example, we create two models corresponding to the two materialized views `members` and `teams` using `db.createModel`:

```js
var viewSchemas = {
  members: {
    member: String, // clustering key: 2
    team: {type: String, id: true},
    registered: Boolean, // clustering key: 1
    zipCode: Number,
    },
  teams: {
    league: {type: String, id: true},
    team: String, // clustering key: 1
    member: String, // unused but required because it's a primary key of the base table
    },
};

function createModelFromViewSchema(viewName) {
  var viewNames = Object.keys(viewSchemas);
  if (viewNames.indexOf(viewName) < 0) {
    return null;
  }
  db.createModel(viewName, viewSchemas[viewName]);
  var model = db.getModel(viewName);
  return model;
}
```
You may be wondering why there is no `Step 3` shown in the figure. That's because the model creation is a pure LoopBack operation and independent from the Cassandra back end.

<h3>Step 4 : Create materialized views using CQL execute</h3>

In the figure, `views / schema definition` block is in blue background because materialized view creation is not supported by LoopBack, which means two things:

1. We need to write CQL and execute the CQL with `db.connector.execute`.
2. The view schema used in the CQL here and the table schema used in the model creation in Step 3 must agree.

```js
db.connector.execute('CREATE MATERIALIZED VIEW members AS ' +
  'SELECT member, team, registered, "zipCode" FROM "allInfo" ' +
  'WHERE member IS NOT NULL AND team IS NOT NULL AND ' +
  '"zipCode" IS NOT NULL AND registered IS NOT NULL ' +
  'PRIMARY KEY (team, registered, member)', done);

db.connector.execute('CREATE MATERIALIZED VIEW teams AS ' +
  'SELECT team, league FROM "allInfo" ' +
  'WHERE league IS NOT NULL AND team IS NOT NULL AND member IS NOT NULL ' +
  'PRIMARY KEY (league, team, member)', done);
```
In the second `db.connector.execute` CQL, `member` field is not `SELECT`-ed, but shows up in the PRIMARY KEY definition. Cassandra does not warn nor error but brings in all the primary key fields of the base table by default to the view's PRIMARY KEY. 

<h3>Step 5 : Populate data to the base table</h3>

The base table `allInfo` is an ordinary table. You can write and read data to/from the base table.

```js
var membersData = [ // fields: registered, member, zipCode, team
  [true, 'John', 98001, 'Green'],
  [true, 'Kate', 98002, 'Red'],
  [false, 'Mary', 98003, 'Blue'],
  [true, 'Bob', 98004, 'Blue'],
  [false, 'Peter', 98005, 'Yellow'],
];
membersData.forEach(function(member) {
  allInfo.create({
    registered: member[0],
    member: member[1],
    zipCode: member[2],
    team: member[3],
  });
});

var teamsData = [ // fields: team, league, member
  ['Blue', 'North', ''],
  ['Green', 'North', ''],
  ['Red', 'South', ''],
  ['Yellow', 'South', ''],
];
teamsData.forEach(function(team) {
  allInfo.create({
    team: team[0],
    league: team[1],
    member: team[2],
  });
});
```

<h3>Step 6 : Read data from the materialized views</h3>

LoopBack `find` operations can be used to `read` data from the materialized view. Once created, the materialized views can be read like tables.

```js
// find rows from `members` where 'team` is `Blue`.
members.find({where: {team: 'Blue'}}, function(err, rows) {
  if (err) return done(err);
  // do stuff with rows here.
});

// find rows from `members` where 'registered` is `false`.
members.find({where: {registered: false}}, function(err, rows) {
  if (err) return done(err);
  // do stuff with rows here.
});

// find rows from `members` where `team` is 'Blue' and 'registered` is `true`.
members.find({where: {and: [{team: 'Blue'}, {registered: true}]}}, function(err, rows) {
  if (err) return done(err);
  // do stuff with rows here.
});

// find rows from `teams` where `league` is 'North', then return `league` and `team` fields.
teams.find({where: {league: 'North'}, fields: ['league', 'team']}, function(err, rows) {
  if (err) return done(err);
  // do stuff with rows here.
});

// find rows from `teams` where `team` is 'Green', then return all fields but `member`.
teams.find({where: {team: 'Green'}, fields: {member: false}}, function(err, rows) {
  if (err) return done(err);
  // do stuff with rows here.
});
```

<h3>Notes</h3>

The order of the steps is chosen for readability. When you design tables and materialized views, you might want to do the view schema design first in normalized form, then, design the base table.

Also, note that all primary key fields of the base table are used in primary key of each view by default (and you cannot change that) when `CREATE MATERIALIZED VIEW`. One additional non-primary-in-base-table field can be used in the view's primary key.

The example code used in this blog is available on [github.com](https://github.com/strongloop/loopback-connector-cassandra/blob/master/test/cass.custom.test.js).

[Questions and pull requests](https://github.com/strongloop/loopback-connector-cassandra/issues) are welcome. Please let us know what you think!

## What's next?

- Loopback can help you get an API up and running in 5 minutes! [Here’s how](https://developer.ibm.com/apiconnect/2017/03/09/loopback-in-5-minutes/).
- Read about planned changes to LoopBack [Here](https://strongloop.com/strongblog/announcing-loopback-next/).
