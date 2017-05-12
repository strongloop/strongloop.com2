---
id: 29246
title: Cassandra Connector for LoopBack Has Arrived
date: 2017-04-27T08:37:47+00:00
author: Tetsuo Seto
guid: http://strongloop.com/?p=29246
permalink: /strongblog/cassandra-connector-has-arrived/
categories: 
- Apache Cassandra
- LoopBack
- strongloop
---

One of the most frequent requests from the LoopBack community is a LoopBack connector for the 
[Apache Cassandra](http://cassandra.apache.org/) database. Today, we’re happy to announce the release of loopback-connector-cassandra 1.0.0. The connector implements a majority of the create, read, update, and delete (CRUD) operations as the other LoopBack database connectors.


[![Cassandra Connector for LoopBack Has Arrived]({{site.url}}/blog-assets/2017/04/apache-cassandra.png)](http://cassandra.apache.org/)

In this blog, I’ll guide you through these key features:
- Support for special Cassandra data types
- Sorting
- Secondary indexes
- Partition key
Install the Cassandra connector  from 
[npm](https://www.npmjs.com/package/loopback-connector-cassandra).  We've provided extensive documentation for it on 
[loopback.io](http://loopback.io/doc/en/lb3/Cassandra-connector.html).
more

<h3>Supported Cassandra Types</h3>

Three custom Loopback data types, "Uuid", "TimeUuid", and "Tuple" are mapped directly to the corresponding Cassandra data types: 
UUID, 
TIMEUUID, and 
TUPLE.  For more information, see 
[LoopBack and Cassandra types](http://loopback.io/doc/en/lb3/Cassandra-connector.html#loopback-tofrom-cassandra-types) in the documentation.

<h3>Sorting</h3>

Cassandra supports a sorting scheme by defining sort keys as 
clustering keys.  Since data are sorted on-disk within each partition, there is no overhead at query time.  The connector maps the 
clustering key definition directly to LoopBack's 
custom option in defining tables.  Both ascending and descending order are supported.  Default is ascending sort.  For example, to get the last created record by 
findOne, create a table defining a clustering key in descending sort order.

For more information, see 
[Clustering keys and sorting](http://loopback.io/doc/en/lb3/Cassandra-connector.html#clustering-keys-and-sorting) in the documentation.

<h3>Secondary Indexes</h3>

Once an "index" is created for a column of a table, the column name can be used in 
where filter.  To create "index", you can simply add `index: true` to the column property in defining table schema. Also, keep in mind that adding a secondary index to the column that has many distinct values is costly.  Conversely, creating a secondary index on a very low cardinality column does not make a lot of sense.

For more information, see 
[Secondary Indexes](http://loopback.io/doc/en/lb3/Cassandra-connector.html#secondary-indexes) in the documentation.

<h3>Your Cassandra Topology and Keyspace (database) Definition</h3>

Proper set up of your Cassandra cluster is essential to the performance of your LoopBack applications that use Cassandra connector.  Best practices include:

- Start with 
[LOCAL_QUORUM](http://docs.datastax.com/en/archived/cassandra/2.0/cassandra/dml/dml_config_consistency_c.html#concept_ds_umf_5xx_zj__about-write-consistency) reads and writes.  This setting writes data on a quorum of replica nodes in the same data center as the coordinator node and avoids inter-data center latency.
- Avoid non-local 
[consistency levels](http://docs.datastax.com/en/cassandra/2.1/cassandra/dml/dml_config_consistency_c.html) in multi data center topology.
- [Replication factor](http://docs.datastax.com/en/cassandra/2.1/cassandra/architecture/architectureDataDistributeReplication_c.html) of 3 to retain three copies of the database.
 

<h3>Partition Keys and Cassandra Data Modeling</h3>

To get high performance out of your Cassandra cluster, it's essential to know how the Cassandra connector defines the partition key.

The Cassandra connector auto-generates a primary key of 
UUID data type if 
id is not specified. Unless there is a clear reason to use an auto-generated primary key, it is highly recommended to explicitly define 
. The primary key (simple or compound) is mapped directly to Cassandra's partition key. Knowing the partition key, you get a good idea where data is located and why you observe certain load patterns.

In LoopBack you create a simple primary key (resulting in a 
simple partition key) by declaring a property with 
id: true.  For example:
```js
customers = db.define('customers', {
  name: String,
  state: String,
  zipCode: Number,
  userId: {type: 'TimeUuid', id: true},
  });
```
This model results in the following CQL statement:

```js
CREATE TABLE customers (
   name TEXT,
   state TEXT,
   zipCode INT,
   userId TIMEUUID,
   PRIMARY KEY (userId)
);
```
If there are two or more fields with 
id: true, they compose 
compound partition key . A better way to define compound partition key is to use number notation such as 
id: 1, id:2, id:3 as shown in the following example.

The 
id property can be of type Boolean or Number (starting with a value of 1). Cassandra creates a compound partition key by combining the 
id properties of type Number in ascending order of value, followed by those of type Boolean. Cassandra resolves conflicts on a first-come first-served basis.
```js
customers = db.define('customers', {
  isSignedUp: {type: Boolean, id: 2},
  state: String,
  contactSalesRep: {type: String, id: true},
  zipCode: Number,
  userId: {type: Number, id: 1},
  });
```
This model results in the following CQL statement:

```js
CREATE TABLE customers (
   isSignedUp BOOLEAN,
   state TEXT,
   contactSalesRep TEXT,
   zipCode INT,
   userId INT,
   PRIMARY KEY ((userId, isSignedUp, contactSalesRep))
);
```
Questions and pull requests are welcome. Please let us know what you think!