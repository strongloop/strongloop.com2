---
id: 24507
title: Getting Started with Node.js LoopBack Connector for Couchbase
date: 2015-04-23T09:22:53+00:00
author: Nicholas Duffy
guid: https://strongloop.com/?p=24507
permalink: /strongblog/node-js-loopback-js-couchbase-connector/
categories:
  - Arc
  - Community
  - How-To
  - LoopBack
  - Uncategorized
---
## **Introduction**

[LoopBack](http://loopback.io/) is the leading open source, enterprise-ready Node.js framework for helping developers to create APIs integrated with legacy and next gen backends that at the same time enables mobile and micro services architectures.

LoopBack [models](http://docs.strongloop.com/display/public/LB/Defining+models) connect to backend systems like databases via data sources that provide create, read, update and delete (CRUD) functions through the LoopBack Juggler: a modern ORM/ODM. These data sources are backed by connectors that implement connection and data access logic using database drivers or other client APIs. In addition, there are connectors for REST and SOAP APIs, NoSQL, messaging middleware, storage services and more. For example, StrongLoop maintains connectors for:

  * [<span style="font-size: 18px;">MongoDB</span>](http://docs.strongloop.com/display/public/LB/MongoDB+connector)
  * [<span style="font-size: 18px;">MySQL</span>](http://docs.strongloop.com/display/public/LB/MySQL+connector)
  * [<span style="font-size: 18px;">Oracle</span>](http://docs.strongloop.com/display/public/LB/Oracle+connector)
  * [<span style="font-size: 18px;">PostgreSQL</span>](http://docs.strongloop.com/display/public/LB/PostgreSQL+connector)
  * [<span style="font-size: 18px;">SQL Server</span>](http://docs.strongloop.com/display/public/LB/SQL+Server+connector)
  * [<span style="font-size: 18px;">Redis</span>](http://docs.strongloop.com/display/public/LB/Redis+connector)
  * <span style="font-size: 18px;">Memory DB</span>
  * [<span style="font-size: 18px;">SOAP</span>](http://docs.strongloop.com/display/public/LB/SOAP+connector)
  * [<span style="font-size: 18px;">REST</span>](http://docs.strongloop.com/display/public/LB/REST+connector)
  * <span style="font-size: 18px;">Sharepoint</span>
  * <span style="font-size: 18px;">ATG</span>

You may have used one or more of these connectors, but did you know that in addition to these connectors maintained by StrongLoop, there are many community contributed connectors as well?

This tutorial is the first in a series of posts that will help you get started with some of the many user contributed NoSQL connectors for LoopBack. In this series we will cover usage of the connectors for:

  * [<span style="font-size: 18px;">Couchbase</span>](http://www.couchbase.com/)
  * [<span style="font-size: 18px;">Riak</span>](http://basho.com/riak/)
  * [<span style="font-size: 18px;">RethinkDB</span>](http://www.rethinkdb.com/)
  * [<span style="font-size: 18px;">ArangoDB</span>](https://www.arangodb.com/)

This tutorial will cover integrating LoopBack with Couchbase Server using the community contributed [loopback-connector-couchbase](https://github.com/guardly/loopback-connector-couchbase).

&nbsp;

<img class="aligncenter size-full wp-image-24545" src="https://strongloop.com/wp-content/uploads/2015/04/couchpluslb.png" alt="couchpluslb" width="608" height="195" srcset="https://strongloop.com/wp-content/uploads/2015/04/couchpluslb.png 608w, https://strongloop.com/wp-content/uploads/2015/04/couchpluslb-300x96.png 300w, https://strongloop.com/wp-content/uploads/2015/04/couchpluslb-450x144.png 450w" sizes="(max-width: 608px) 100vw, 608px" />

<!--more-->

# **Couchbase Server**

Couchbase describes their Couchbase Server product as _“a high-performance NoSQL distributed database with a flexible data model. It scales on commodity hardware to support large data sets with a high number of concurrent reads and writes while maintaining low latency and strong consistency.”_

Now that we know a little bit more about Couchbase Server, let’s get it installed and ready to power our LoopBack API.

## **Installing Couchbase**

Head over to the [Couchbase website](http://www.couchbase.com/nosql-databases/downloads) and download the version for your platform. Couchbase offers both community and enterprise editions of Couchbase Server. We’ll be using the community edition version 3.0.1 for this tutorial. We’ll also be developing on Mac OSX, but Couchbase also offers downloads for Windows and various flavors of Linux.

Installation on OSX is extremely simple. After you download the file, expand the archive and drag the Couchbase-Server.app to your Applications folder. Double-click the application to launch Couchbase.

<img class="aligncenter size-full wp-image-24509" src="https://strongloop.com/wp-content/uploads/2015/04/couchbase.png" alt="couchbase" width="975" height="203" srcset="https://strongloop.com/wp-content/uploads/2015/04/couchbase.png 975w, https://strongloop.com/wp-content/uploads/2015/04/couchbase-300x62.png 300w, https://strongloop.com/wp-content/uploads/2015/04/couchbase-705x147.png 705w, https://strongloop.com/wp-content/uploads/2015/04/couchbase-450x94.png 450w" sizes="(max-width: 975px) 100vw, 975px" />

That’s it! Couchbase Server is now running on your Mac. You’ll see the Couchbase Server icon in your tray.

## **Setting Up Couchbase**

We need to take a few steps in order to get Couchbase Server ready for use. Head to <http://127.0.0.1:8091/index.html> in your browser to begin the Couchbase Server setup. As this tutorial is more focused on connecting LoopBack to Couchbase Server, we’re going to gloss over some of the Couchbase installation steps, but you can [review](http://docs.couchbase.com/admin/admin/install-intro.html) the full Couchbase Server installation documentation for your platform if necessary.

There are 5 steps that you need to run through in the Couchbase admin to get your server up and running. We’re going to accept the defaults for everything, so just click Next on all 5 pages.

When you’re complete with the rest of the setup steps, you’ll be taken to the Couchbase Server administrator panel. Click on the Data Buckets so we can create our bucket for this tutorial.

Click &#8220;Create New Data Bucket&#8221; and enter the name as &#8220;loopback-example&#8221;. Leave all the settings at their defaults and click &#8220;Create&#8221;.

<img class="aligncenter size-full wp-image-24510" src="https://strongloop.com/wp-content/uploads/2015/04/couchbase2.png" alt="couchbase2" width="975" height="349" srcset="https://strongloop.com/wp-content/uploads/2015/04/couchbase2.png 975w, https://strongloop.com/wp-content/uploads/2015/04/couchbase2-300x107.png 300w, https://strongloop.com/wp-content/uploads/2015/04/couchbase2-705x252.png 705w, https://strongloop.com/wp-content/uploads/2015/04/couchbase2-450x161.png 450w" sizes="(max-width: 975px) 100vw, 975px" />

Now that we have our sample bucket, we need to take one more step in preparation for connecting to our Couchbase Server with LoopBack. We need to install the Couchbase N1QL engine.

## **Setting Up N1QL**

N1QL (pronounced “Nickel”) is a query language developed by Couchbase used for finding data in Couchbase Server. N1QL allows for allows for joins, filter expressions, aggregate expressions and many other features.

Head back to the [Couchbase website](http://www.couchbase.com/nosql-databases/downloads#PreRelease) again to download the N1QL file for your platform.

Note: At the time of this writing ([as of this commit](https://github.com/guardly/loopback-connector-couchbase/commit/513688378fda720ea0090f04465b4b4d68470da5)) loopback-connector-couchbase only works with N1QL Developer Preview 3. Even though Preview 4 is the most current version of N1QL, make sure you download Developer Preview 3.

After you’ve download the Developer Preview 3, expand the archive and cd into the directory.

If you’d like to run through the N1QL tutorial &#8211; highly recommended if this is your first time using Couchbase Server and N1QL &#8211; run the start_tutorial.sh script in your terminal and navigate to <http://localhost:8093/tutorial/>. The tutorial covers many of the different concepts of N1QL with a series of examples that you can run right in your browser.

```sh
&gt; $ ./start_tutorial.sh

In your web browser open http://localhost:8093/tutorial/

14:28:13.510175 Info line disabled false
14:28:13.510636 tuqtng started...
14:28:13.510642 version: v0.7.2
14:28:13.510644 site: dir:./data
```

Next we need to connect the N1QL engine to our Couchbase Server. If you followed along above, your Couchbase Server is running on port 8091.

```sh
&gt; $ ./cbq-engine -couchbase=http://127.0.0.1:8091/
```

Finally, per the loopback-connector-couchbase README, we are going to start the N1QL command lines tool and create a primary index on our loopback-example bucket that we created during the Couchbase setup phase. The N1QL engine will run on port 8093 by default.

```js
&gt; $ ./cbq -engine=http://127.0.0.1:8093
cbq&gt; create primary index on `loopback-sample`;
{
    "resultset": [
    ],
    "info": [
        {
            "caller": "http_response:160",
            "code": 100,
            "key": "total_rows",
            "message": "0"
        },
        {
            "caller": "http_response:162",
            "code": 101,
            "key": "total_elapsed_time",
            "message": "5.111718131s"
        }
    ]
}
```

You can exit out of the command lines tools with Ctrl-C after this is complete.

Now that we have Couchbase Server and N1QL fully installed, it’s time for the fun part! Let’s get LoopBack connected to Couchbase using loopback-connector-couchbase.

# **LoopBack**

## **Create the application**

We’re assuming you have Node.js and StrongLoop installed, however, if you don’t you can review the comprehensive getting started guide to get LoopBack installed.

Now, let’s create our application!

```sh
&gt; $ slc loopback

     _-----_
    |       |    .--------------------------.
    |--(o)--|    |  Let's create a LoopBack |
   `---------´   |       application!       |
    ( _´U`_ )    '--------------------------'
    /___A___\
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

? What's the name of your application? loopback-couchbase-example
? Enter name of the directory to contain the project: loopback-couchbase-example
```

Navigate to your newly created application directory and install &#8220;loopback-connector-couchbase&#8221; and &#8220;couchbase&#8221;.

```sh
&gt; $ cd loopback-couchbase-example
&gt; $ npm install --save couchbase loopback-connector-couchbase
```

**Note:** the &#8211;save option is recommended to update the package.json for downstream builds.

## **Create the backend datasource definition**

We can use the loopback datasource generator to create or update data sources.

```js
&gt; $ slc loopback:datasource
? Enter the data-source name: couchbase
? Select the connector for couchbase: 
  Neo4j (provided by community) 
  Kafka (provided by community) 
  SAP HANA (provided by community) 
❯ Couchbase (provided by community) 
  other 
  In-memory db (supported by StrongLoop) 
  Email (supported by StrongLoop) 
(Move up and down to reveal more choices)
```

Note that since this is a community contributed connector, StrongLoop does not have a generator for the datasource definition. What you will get after running `slc` `loopback:datasource` above is a skeleton definition that you will need to fully complete.

Now, edit the `datasources.json` file in the root of your application with the correct Couchbase connection information. Remember that the default ports are 8091 for our Couchbase Server and 8093 for the N1QL engine. Our database is named &#8220;loopback-example&#8221; and we also set some timeouts for connecting to the server and for server operations.

## **datasources.json**

```sh
{
  "db": {
    "name": "db",
    "connector": "memory"
  },
  "couchbase": {
    "host": "127.0.0.1",
    "port": 8091,
    "n1qlport": 8093,
    "connector": "couchbase",
    "database": "loopback-example",
    "connectionTimeout": 20000,
    "operationTimeout": 15000
  }
}
```

## **Create the models**

We’re going to be using some simple employee and company models in our example.

Models can be autogenerated using one of the following three options:

**1. Model generators &#8211; here is the example for the company model:**

```sh
&gt; $ slc loopback:model

? Enter the model name: company
? Select the data-source to attach company to: couchbase
? Select model's base class: PersistedModel
? Expose company via the REST API? Yes
? Custom plural form (used to build REST URL): 
Let's add some company properties now.

Enter an empty property name when done.
? Property name: company
   invoke   loopback:property
? Property type: string
? Required? Yes

Let's add another company property.
Enter an empty property name when done.
? Property name: address
   invoke   loopback:property
? Property type: string
? Required? Yes

Let's add another company property.
Enter an empty property name when done.
? Property name: city
   invoke   loopback:property
? Property type: string
? Required? Yes

Let's add another company property.
Enter an empty property name when done.
? Property name: state
   invoke   loopback:property
? Property type: string
? Required? Yes

Let's add another company property.
Enter an empty property name when done.
? Property name: postalCode
   invoke   loopback:property
? Property type: string
? Required? Yes

Let's add another company property.
Enter an empty property name when done.
? Property name: companyId
   invoke   loopback:property
? Property type: number
? Required? Yes
```

This will automatically generate a JSON representation of the company model.

## **company.json**

```js
{
  "name": "company",
  "plural": "companies",
  "properties": {
    "company": {
      "type": "string",
      "required": true
    },
    "address": {
      "type": "string",
      "required": true
    },
    "city": {
      "type": "string",
      "required": true
    },
    "state": {
      "type": "string",
      "required": true
    },
    "postalCode": {
      "type": "string",
      "required": true
    },
    "companyId": {
      "type": "number",
      "required": true,
      "id": true
    }
  },
  "validations": [],
  "relations": {
    "employee": {
      "type": "hasMany",
      "model": "employee",
      "foreignKey": "company"
    }
  },
  "acls": [],
  "methods": []
}
```

The company.js file will also be auto-generated with the JSON. This JavaScript file is used for extending the functionality, custom logic, model aggregation and more.

## **company.js**

```sh
module.exports = function(Company) {
};
```

**2. Using StrongLoop Arc**

[Arc](https://strongloop.com/node-js/arc/) is graphical UI for the StrongLoop API Platform that complements the slc command line tools for developing APIs quickly and getting them connected to data.

```sh
&gt; $ slc arc
```

Click on the &#8220;Composer&#8221; icon for visual composer to create the company model.

<img class="aligncenter size-full wp-image-24522" src="https://strongloop.com/wp-content/uploads/2015/04/arc.png" alt="arc" width="975" height="467" srcset="https://strongloop.com/wp-content/uploads/2015/04/arc.png 975w, https://strongloop.com/wp-content/uploads/2015/04/arc-300x144.png 300w, https://strongloop.com/wp-content/uploads/2015/04/arc-705x338.png 705w, https://strongloop.com/wp-content/uploads/2015/04/arc-450x216.png 450w" sizes="(max-width: 975px) 100vw, 975px" />

<img class="aligncenter size-full wp-image-24523" src="https://strongloop.com/wp-content/uploads/2015/04/arc2.png" alt="arc2" width="975" height="557" srcset="https://strongloop.com/wp-content/uploads/2015/04/arc2.png 975w, https://strongloop.com/wp-content/uploads/2015/04/arc2-300x171.png 300w, https://strongloop.com/wp-content/uploads/2015/04/arc2-705x403.png 705w, https://strongloop.com/wp-content/uploads/2015/04/arc2-450x257.png 450w" sizes="(max-width: 975px) 100vw, 975px" />

Enter the model definition in the properties section of the composer and click Save Model. It’s as simple as that!

**3. Just code it&#8230;models are simple JSON and JavaScript.**

Similarly create employee.json and employee.js files for the employee model.

## **employee.json**

```sh
{
  "name": "employee",
  "plural": "employees",
  "properties": {
    "firstName": {
      "type": "string",
      "required": true
    },
    "lastName": {
      "type": "string",
      "required": true
    },
    "companyId": {
      "type": "number",
      "required": true
    },
    "employeeNumber": {
      "type": "number",
      "required": true
    }
  },
  "validations": [],
  "relations": {
    "company": {
      "type": "belongsTo",
      "model": "company",
      "foreignKey": "company"
    }
  },
  "acls": [],
  "methods": []
}
```

##  **employee.js**

You’ll note that the models have relations to one another. A company has many employees and an employee belongs to a company.

```sh
module.exports = function(Employee) {
};
```

Relationships are generated using the loopback relationship generator.

```js
&gt; $ slc loopback:relation
? Select the model to create the relationship from: (Use arrow keys)
  RoleMapping 
  Scope 
  User 
❯ company 
  newModel 
  ACL 
  AccessToken 
(Move up and down to reveal more choices)

? Relation type: (Use arrow keys)
❯ has many 
  belongs to 
  has and belongs to many 
  has one 

? Choose a model to create a relationship with: 
  Scope 
  User 
  company 
❯ employee 
  newModel 
  (other) 
  ACL 
(Move up and down to reveal more choices)

? Enter the property name for the relation: employees
? Optionally enter a custom foreign key: company
? Require a through model? No

```

We’ll take a look at using this relationship a little bit later in the tutorial, but first let’s finish telling LoopBack about our Couchbase Server.

We want to tell LoopBack to expose our two new models via the REST API. After adding both the employee and company models to model-config.json in the application root, your file should look like this. Please note this can be auto updated by the loopback generators as well.

## **model-config.json**

```js
{
  "_meta": {
    "sources": [
      "loopback/common/models",
      "loopback/server/models",
      "../common/models",
      "./models"
    ]
  },
  "User": {
    "dataSource": "db"
  },
  "AccessToken": {
    "dataSource": "db",
    "public": false
  },
  "ACL": {
    "dataSource": "db",
    "public": false
  },
  "RoleMapping": {
    "dataSource": "db",
    "public": false
  },
  "Role": {
    "dataSource": "db",
    "public": false
  },
  "employee": {
    "dataSource": "couchbase",
    "public": true
  },
  "company": {
    "dataSource": "couchbase",
    "public": true
  }
}

```

Alright, now we’re ready to work with LoopBack and Couchbase.

To make life easy, Loopback uses Swagger API documentation out of box. It’s accessible on <http://localhost:3000/explorer> on the running application.

Try out all the great features in Swagger for CRUD, filtering, querying and more.

<img class="aligncenter size-full wp-image-24528" src="https://strongloop.com/wp-content/uploads/2015/04/swagger.png" alt="swagger" width="975" height="555" srcset="https://strongloop.com/wp-content/uploads/2015/04/swagger.png 975w, https://strongloop.com/wp-content/uploads/2015/04/swagger-300x171.png 300w, https://strongloop.com/wp-content/uploads/2015/04/swagger-705x401.png 705w, https://strongloop.com/wp-content/uploads/2015/04/swagger-450x256.png 450w" sizes="(max-width: 975px) 100vw, 975px" />

Now we’ll run through some steps to guide you through the testing of our new APIs.

##  **Create data**

First, we’ll simply use the LoopBack Explorer to enter a few records.

If you didn’t already start it above, start the N1QL engine. After you navigate to the directory where you downloaded and expanded the N1QL files, connect N1QL to your Couchbase instance.

```js
&gt; $ ./cbq-engine -couchbase=http://127.0.0.1:8091/
15:34:48.236542 Info line disabled false
15:34:48.237998 tuqtng started...
15:34:48.238007 version: v0.7.2
15:34:48.238009 site: http://127.0.0.1:8091/
```

**Tip:** You can also execute slc run with debugging arguments to see exactly what N1QL is sending to Couchbase Server. This is very helpful in development as you’ll receive valuable debug information from the connector. Here’s an example that you could receive when calling `GET /companies`.

```js
&gt; $ DEBUG=connector:couchbase slc run
  connector:couchbase couchbase connector initializeDataSource(): options:[{"dsconnector":"couchbase","host":"127.0.0.1","port":8091,"password":"","n1qlport":8093,"bucket":"loopback-example","env":"debugging","connectionTimeout":20000,"operationTimeout":15000,"connectUrl":"couchbase://127.0.0.1","n1qlUrl":"127.0.0.1:8093"}] +0ms
Browse your REST API at http://0.0.0.0:3000/explorer
Web server listening at: http://0.0.0.0:3000/
  connector:couchbase CouchbaseDB.prototype.all() : ["company",{}] +16s
  connector:couchbase CouchbaseDB.prototype.all()  final query is : SELECT * FROM `loopback-example` WHERE (`docType`='company') +7ms
  connector:couchbase cbquery()  : query is:  [{"str":"SELECT * FROM `loopback-example` WHERE (`docType`='company')"}] +21ms
  connector:couchbase cbquery()  : success![null,[]] +21ms
```

You probably noticed the (`` `docType`='company' ``) where clause in the query. It’s important to note that loopback-connector-couchbase automatically adds a docType field to documents when they are created. This docType field is equal to your LoopBack model name.

**Tip:** Be careful if you are using an already existent bucket in Couchbase with the connector. Your documents will not have the docType field that the connector is looking for. Queries will initially return empty sets as the connector cannot find any documents that meet criteria for the clause of ``WHERE (`docType`='modelName')``. You’ll need to get the docType property in all of your documents first in order to work with this connector.

Input a few companies into Explorer to get started. You can find some sample data ready for use on [Github](https://github.com/duffn/loopback-couchbase-example/tree/master/data). Navigate to <http://localhost:3000/explorer/#!/employees/create> in your browser to create a company.

When the creation is successful, you’ll receive a response like this:

```js
{
  "company": "Vulputate Corporation",
  "address": "Ap #235-1955 Ac Av.",
  "city": "Les Bulles",
  "state": "MN",
  "postalCode": "34267",
  "companyId": 1,
  "companyId": {
    "cas": {
      "0": 1980694528,
      "1": 2214407711
    },
    "id": "3a7c14c8-75e9-4d88-b97f-8c861302b419",
    "docType": "company"
  }
}

```

Take note of the docType and id fields. We already discussed the docType field, but you’ll see that loopback-connector-couchbase also created an id field. Currently the connector automatically generates a UUID for the id if you do not pass in an id. If you want to set the id yourself when creating a document, you can simply pass in an id field.

Input the other company via Explorer and do the same for the first 4 employees in the sample data set. We’ll create the last one using `curl` and then discuss querying and updating records.

Let’s enter our last sample employee using `curl` which is more representative of how you may actually use your API.

```js
&gt; $ curl -H "Content-Type: application/json" -X POST -d '{"firstName": "Mara","lastName": "Quinn","companyId": 2,"employeeNumber": 2}' http://localhost:3000/api/employees

{"firstName":"Mara","lastName":"Quinn","employeeNumber":2,"id":{"cas":{"0":907018240,"1":18671893},"id":"7ea27a11-ff2b-468e-a0bc-0a246d7afbe8","docType":"employee"},"companyId":2}%
```

## **Querying data**

Just like with the other LoopBack connectors, you can use loopback-connector-couchbase to query Couchbase Server documents via the REST API.

```js
&gt; $ curl http://localhost:3000/api/employees
                                                                                                                
[{"firstName":"Dolan","lastName":"Gordon","employeeNumber":2,"id":"1799c90c-a823-475a-88b0-bf4103d0e821","docType":"employee"},{"firstName":"Roanna","lastName":"Mills","employeeNumber":1,"id":"46b15678-adb8-4f18-9a02-48717d466627","docType":"employee"},{"firstName":"Kennan","lastName":"Ingram","employeeNumber":1,"id":"4ed58a06-cc94-421d-9a0b-94d511ff43a1","docType":"employee"},{"firstName":"Mara","lastName":"Quinn","employeeNumber":2,"id":"7ea27a11-ff2b-468e-a0bc-0a246d7afbe8","docType":"employee"},{"firstName":"Anthony","lastName":"Price","companyId":1,"employeeNumber":3,"id":"c0e764fe-0e6e-440a-bbf3-a71288f173dc","docType":"employee"}]%
```

Of course, you can use [filtering](http://docs.strongloop.com/display/public/LB/Where+filter) like the enterprise connectors.

```sh
&gt; $ curl -g http://localhost:3000/api/employees\?filter\[where\]\[lastName\]\=Gordon

[{"firstName":"Dolan","lastName":"Gordon","employeeNumber":2,"id":"1799c90c-a823-475a-88b0-bf4103d0e821","docType":"employee","company":"Vulputate Corporation"}]%
```

You can also [limit](http://docs.strongloop.com/display/public/LB/Limit+filter) and [order](http://docs.strongloop.com/display/public/LB/Order+filter) with Couchbase.

```sh
&gt; $ curl -g http://localhost:3000/api/employees\?filter\[limit\]\=2\&filter\[order\]\=lastName

[{"firstName":"Dolan","lastName":"Gordon","employeeNumber":2,"id":"1799c90c-a823-475a-88b0-bf4103d0e821","docType":"employee","company":"Vulputate Corporation"},{"firstName":"Kennan","lastName":"Ingram","employeeNumber":1,"id":"4ed58a06-cc94-421d-9a0b-94d511ff43a1","docType":"employee","company":"Vulputate Corporation"}]%
```

And since we setup our LoopBack model relations you can query to get a records relations as well.

```sh
&gt; $ curl http://localhost:3000/api/employees/c0e764fe-0e6e-440a-bbf3-a71288f173dc/company

{"company":"Vulputate Corporation","address":"Ap #235-1955 Ac Av.","city":"Les Bulles","state":"MN","postalCode":"34267","companyId":1,"docType":"company"}%
```

##  **Updating data**

Updating records in Couchbase Server with the connector is equally as easy. We’ll use the id of the record that we queried in the section above. To update a record, send a PUT request to the employee resource with the id and specify which portion of the document you want to update.

```sh
&gt; $ curl -H "Content-Type: application/json" -X PUT -d '{"employeeNumber":15}'  http://localhost:3000/api/employees/c0e764fe-0e6e-440a-bbf3-a71288f173dc

{"firstName":"Anthony","lastName":"Price","employeeNumber":15,"id":"c0e764fe-0e6e-440a-bbf3-a71288f173dc","docType":"employee","companyId":1}%
```

##  **The preserve key**

There is one setting you can apply to a property in your model when using the Couchbase connector. If you set the preserve property to true the connector will not update that property when a document is updated &#8211; even if you ask it to.

With our original model, we can update the `employeeNumber` property.

```sh
&gt; $ curl -H "Content-Type: application/json" -X PUT -d '{"employeeNumber":7}'  http://localhost:3000/api/employees/c0e764fe-0e6e-440a-bbf3-a71288f173dc

{"firstName":"Anthony","lastName":"Price","companyId":1,"employeeNumber":7,"id":"c0e764fe-0e6e-440a-bbf3-a71288f173dc","docType":"employee"}%
```

If we set the preserve key to true &#8211; which is false by default &#8211; on the `employeeNumber` property, the property will not change.

Change the `employee.js` model `employeeNumber` property.

```sh
"employeeNumber": {
  "type": "number",
  "required": true,
  "couchbase": {
    "preserve": true
  }
}
```

Now, try to update the `employeeNumber` of a record.

```js
&gt; $ curl -H "Content-Type: application/json" -X PUT -d '{"employeeNumber":15}'  http://localhost:3000/api/employees/c0e764fe-0e6e-440a-bbf3-a71288f173dc

{"firstName":"Anthony","lastName":"Price","companyId":1,"employeeNumber":15,"id":"c0e764fe-0e6e-440a-bbf3-a71288f173dc","docType":"employee"}%
```

Wait a second. That response makes it look like the record was updated with the new employee number! However, if you check the document you’ll see that the response was not quite true and the document was not actually updated.

```js
&gt; $ curl http://localhost:3000/api/employees/c0e764fe-0e6e-440a-bbf3-a71288f173dc   
                                                                        
{"firstName":"Anthony","lastName":"Price","companyId":1,"employeeNumber":7,"id":"c0e764fe-0e6e-440a-bbf3-a71288f173dc","docType":"employee"}%
```

## **Conclusion**

The community contributed loopback-connector-couchbase is an excellent addition to the LoopBack family, albeit with a few quirks. If you are careful to take note of things like the automatically generated UUIDs and the docType property, the connector can be very powerful and is certainly currently the best way to connect LoopBack and Couchbase Server.

&nbsp;

&nbsp;