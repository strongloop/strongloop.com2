---
id: 29366
title: Refactoring LoopBack SQL Connectors
date: 2017-05-09T07:13:21+00:00
author: Dave Whiteley
guid: http://strongloop.com/?p=29366
permalink: /strongblog/refactoring-loopback-sql-connectors/
categories: 
- API
- code refactoring
- database
- datasource
- developers
- discovery
- ibm
- LoopBack
- loopback-connector
- migration
- nodejs
- sql
- SQL connectors
- strongloop
---

**Note:**
 Loay Gewily (Twitter: 
[@loaygl](https://twitter.com/loaygl), github: 
[@loay](https://github.com/loay)) and Janny Hou (Twitter: 
[@HouJanny](https://twitter.com/HouJanny), github: 
[@jannyHou](https://github.com/JannyHou)) wrote this article.

We've now been developing LoopBack for over three and a half years. Like any software built at a startup's pace, it can benefit from some much needed refactoring! This blog outlines the changes to Model Discovery and Migration. It is worth highlighting that just recently we refactored many LoopBack datasource connectors. This includes SQL connectors such as MySQL, PostgresSQL, MsSQL, and Oracle. The common functions were extracted from the individual connectors to the base connector ([loopback-connector](https://github.com/strongloop/loopback-connector)). The developer can still override the connectors with customized logic and /or features if required.

<p style="text-align: center;"><img class="aligncenter size-medium wp-image-19068" alt="Refactoring LoopBack SQL Connectors" src="{{site.url}}/blog-assets/2017/04/powered-by-LB-med.png" width="300" height="300" style="display:inline-block;"/></p>

What has been changed, and how will it affect the LoopBack community? Needless to say, because of this refactoring, it will be easier to fix a bug and/or add a feature will be much simpler to be done in one place instead of 6 or 7 other connectors. The major changes that will affect the LoopBack developers are 
[documented here](https://github.com/strongloop/loopback-connector/issues/15). This document lists all the main and sub-functions that have been affected, either by being refactored, moved, deleted or got the method name changed. Furthermore, a major release (4.0.0) has been published for loopback-connector.

<h2>Discovery</h2>

For those of you that didn't already know, LoopBack provides a 
[Discovery](https://loopback.io/doc/en/lb3/Discovering-models-from-relational-databases.html) feature which allows you to create models from your existing relational (SQL) datasources. For 
[Model Discovery](http://loopback.io/doc/en/lb3/Discovering-models-from-relational-databases.html), we not only extracted common logic into the base connector for functions that already existed, but also created new prototype functions to expand support for features once specific to some connector implementations. Discovery functions have similar logic amongst all the connectors, where we may have tweaked a certain function a little bit in the base connector, so the logic would be commonly inherited and supported by all connectors. Child connectors may still preserve their logic implementation overrides.

Additionally, some function names have been modified to be consistent with the naming of all the sub-functions used inside the discovery main functions before implementing the refactoring. The pattern followed for naming the query functions is renaming `query` to `build + Query. For example, `**queryPrimaryKeys**` becomes `**buildQueryPrimaryKeys**`. The altered functions are listed in 
[this document](https://github.com/strongloop/loopback-connector/issues/15).



If the function already existed in the base-connector, we had to ensure that it did not conflict with the one defined in the child connector, following the proper override pattern. The following example shows a comparison of how the function is defined in the base connector as well as in the MySQL connector. Some functions heave no meaningful implementations in the base connector, so the connectors have to override them.

```js
// function in `loopback-connector`
SQLConnector.prototype.buildQueryPrimaryKeys = function(schema, table) {
   throw new Error(g.f('{{buildQueryPrimaryKeys}} must be implemented by the connector'));
 };
//function in `loopback-connector-mysql`
MySQL.prototype.buildQueryPrimaryKeys = function(schema, table) {
 ...
};
```

<h2>Migration</h2>

LoopBack 
[auto-migration](https://loopback.io/doc/en/lb3/Creating-a-database-schema-from-models.html) provides the ability to drop existing schema objects from the datasource, if they exist, and re-create them based on model definitions. The logic in migration functions is more complicated and hard to unify across different connectors. So we only extract those sharable util methods and still leave heavy function like 'alterTable' in each connector, for the purpose of more flexible modification. Please refer to 
[this document](https://github.com/strongloop/loopback-connector/issues/15) for more details about the refactored migration functions and which connector is affected.

In the meantime, we updated and improved our end-to-end and system integration tests to better validate the new discovery and migration behaviour on each of the affected SQL connectors and their corresponding databases.

<h3>What's Next?</h3>

<p>We intend to do more refactoring within the HTTP connectors to gain the same benefits that we gained with the refactoring of the SQL connectors.</p>

If you haven't tried out LoopBack yet, get started 
[here](http://loopback.io/getting-started/).