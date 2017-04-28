---
id: 22961
title: Announcing the Official Node.js Connector for the Oracle Database by Oracle
date: 2015-01-27T07:40:36+00:00
author: Christopher Jones
guid: http://strongloop.com/?p=22961
permalink: /strongblog/official-node-js-connector-oracle-database/
categories:
  - Community
  - LoopBack
---
Oracle has released a new Node.js driver for Oracle Database on [GitHub](https://github.com/oracle/node-oracledb)!

This is exciting for the Node community. The interest in Node applications that connect to the widely available Oracle Database is being recognized and rewarded with a driver that has been designed from the ground up for performance, scalability and usability.

Releasing source code on GitHub is itself big news for the Oracle Database development community. It is part of the shift to making content highly available to Oracle users and lets developers be more efficient at adopting technology and creating new generations of applications.

StrongLoop is one player with feet in both Node and Oracle communities. They have supported and given advice on the development of `node-oracledb`, even though it seemingly competes with their [own driver](https://github.com/strongloop/strong-oracle). What `node-oracledb` actually does is let StrongLoop focus their efforts in making products like the [LoopBack](http://loopback.io/) framework and the [StrongLoop Arc](http://strongloop.com/node-js/arc/) GUI and platform even more successful. The maintenance of the database access layer can now transition to Oracle, where their expertise is, freeing StrongLoop to add value above it.

<img class="aligncenter size-full wp-image-22968" alt="oracle2" src="{{site.url}}/blog-assets/2015/01/oracle2.jpg" width="590" height="414"  />

## **Technology**

Following the footsteps of all good open source projects, the `node-oracledb` driver is currently at an arbitrarily chosen, low &#8220;0.2&#8221; release number. But it has already been called &#8220;very stable and fast&#8221;. It also has a lot of features.  It currently supports:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">SQL and PL/SQL Execution</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Binding using JavaScript objects or arrays</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Query results as JavaScript objects or array</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Conversion between JavaScript and Oracle types</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Transaction Management</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Connection Pooling</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Statement Caching</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Client Result Caching</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">End-to-end tracing</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">High Availability Features:</span> <ul>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">Fast Application Notification (FAN)</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">Runtime Load Balancing (RLB)</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">Transparent Application Failover (TAF)</span>
    </li>
  </ul>
</li>

Database features such as the native JSON data type support introduced in Oracle Database 12.1.0.2 can be used directly with `node-oracledb`.

The `node-oracledb` driver itself uses Oracle&#8217;s C API for performance. This makes it a &#8220;thick client&#8221; driver requiring [Oracle&#8217;s client libraries](http://www.oracle.com/technetwork/topics/linuxx86-64soft-092277.html#ic_x64_inst). These are free and easy to install.  They allow `node-oracledb` to take advantage of the significant feature set, engineering, and testing invested in those libraries. Scalable and highly available applications can be built.

Many of `node-oracledb`&#8216;s features are immediately available to an application. For example, statement caching is enabled by default. The feature helps reduce unnecessary processing and network overhead of statement parsing when a statement is re-executed. Instead of requiring `node-oracledb` to have explicit parse and execute methods, by taking advantage of Oracle&#8217;s client library statement caching, the `node-oracledb` API is simplified.

Currently `node-oracledb` has just three classes, each with a small number of methods.

  * OracleDb
  * Pool
  * Connection

You can create connections from the top level `OracleDb object` but it is recommended to create a pool first. This is a Node-side pool of connections. There are advantage to applications in having a pool of connections readily available. There are also other advantages because the underlying implementation lets advanced Oracle high availability features be used only by pooled connections. These include [Fast Application Notification](http://docs.oracle.com/database/121/ADFNS/adfns_avail.htm#ADFNS538) and [Runtime Load Balancing for connections](http://docs.oracle.com/database/121/ADFNS/adfns_perf_scale.htm#ADFNS515).

## **Examples**

A basic query example is simple:

```js
var oracledb = require('oracledb');

oracledb.getConnection(
  {
    user          : "hr",
    password      : "welcome",
    connectString : "localhost/XE"
  },
  function(err, connection)
  {
    if (err) { console.error(err); return; }
    connection.execute(
      "SELECT department_id, department_name "
    + "FROM departments "
    + "WHERE department_id < 70 "
    + "ORDER BY department_id",
      function(err, result)
      {
        if (err) { console.error(err); return; }
        console.log(result.rows);
      });
  });
```

The output, with [Oracle&#8217;s HR schema](https://github.com/oracle/db-sample-schemas) is:

```js
$ node select.js
[ [ 10, 'Administration' ],
  [ 20, 'Marketing' ],
  [ 30, 'Purchasing' ],
  [ 40, 'Human Resources' ],
  [ 50, 'Shipping' ],
  [ 60, 'IT' ] ]
```

Database connection strings use standard Oracle syntax.  The example shown connects to the XE database service on the local host. Connection identifiers from an Oracle network `tnsnames.ora` file may also be used.

Query results can be fetched as objects by setting an output format property.  This format can be a little bit less efficient for the driver to generate, so it is not the default:

```js
connection.execute(
      "SELECT department_id, department_name "
    + "FROM departments "
    + "WHERE department_id < 70 "
    + "ORDER BY department_id",
      [], // A bind parameter (here empty) is required when setting properties
      {outFormat: oracledb.OBJECT},
      function(err, result)
      {
        if (err) { console.error(err); return; }
        console.log(result.rows);
      });
```

The output would be:

```js
$ node select.js
[ { DEPARTMENT_ID: 10, DEPARTMENT_NAME: 'Administration' },
  { DEPARTMENT_ID: 20, DEPARTMENT_NAME: 'Marketing' },
  { DEPARTMENT_ID: 30, DEPARTMENT_NAME: 'Purchasing' },
  { DEPARTMENT_ID: 40, DEPARTMENT_NAME: 'Human Resources' },
  { DEPARTMENT_ID: 50, DEPARTMENT_NAME: 'Shipping' },
  { DEPARTMENT_ID: 60, DEPARTMENT_NAME: 'IT' } ]
```

The driver allows binding by name or position. The next examples shows binding by position. The `connection.execute()` bind parameter is an array of values, each being mapped to a bind variable in the SQL statement.  Here there is just one value, 70, which is mapped to `:id`:

```js
connection.execute(
      "SELECT department_id, department_name "
    + "FROM departments "
    + "WHERE department_id < :id "
    + "ORDER BY department_id",
      [70],
      function(err, result)
      {
        if (err) { console.error(err); return; }
        console.log(result.rows);
      });
```

GitHub has more examples.

## **Installation**

Installation is currently via GitHub:

1. Install the small, free [Oracle Instant Client libraries](http://www.oracle.com/technetwork/database/features/instant-client/index-100365.html) or have a local database such as the free [Oracle XE Database](http://www.oracle.com/technetwork/database/database-technologies/express-edition/overview/index.html) release. On Linux you can simply install the Instant Client RPMs and run ldconfig to add the libraries to the run-time link path.

2. Clone the `node-oracledb` repository or download the ZIP file.

3. Run npm install

The repo&#8217;s [INSTALL file](https://github.com/oracle/node-oracledb/blob/master/INSTALL.md) has details and steps for several configurations.

## **Documentation**

The API documentation can be found [here](https://github.com/oracle/node-oracledb/blob/master/doc/api.md).

## **What&#8217;s next?**

  * Oracle is actively working to bring `node-oracledb` to a 1.0 release soon.  We are beginning to fill in basic feature support.  Things on the &#8220;todo&#8221; include LOBs, being on npmjs.com, and building on Windows.
  * Like every development team, we also have longer term plans and dreams.  However these will depend on the adoption of the driver and the direction users want it to go in.
  * We had a lot of interesting development discussions about the intricacies of how, for example, connection pooling and date handling should work. We are actively soliciting feedback on `node-oracledb` so we can make it work for you. Raise issues on GitHub or post feedback and questions at our [Oracle Technology Network forum](https://community.oracle.com/community/database/developer-tools/node_js/content).
  * Node-oracledb has an Apache 2.0 license. Contributions can be made by developers under the [Oracle Contributor Agreement](http://www.oracle.com/technetwork/community/oca-486395.html).
  * As we enhance `node-oracledb` you can follow updates at <https://blogs.oracle.com/opal> and <https://jsao.io/>

## **Useful Links**

  * [node-oracledb on GitHub](https://github.com/oracle/node-oracledb)
  * [Node.js Developer Center on Oracle Technology Network](http://www.oracle.com/technetwork/database/database-technologies/node_js/index.html)
  * [Node.js Discussion Forum on OTN](https://community.oracle.com/community/database/developer-tools/node_js/content)
  * [Blogs on scripting languages and Oracle](https://blogs.oracle.com/opal)
  * [Blog on JavaScript and Oracle](https://jsao.io/)
