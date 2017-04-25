---
id: 24602
title: Getting Started with the RethinkDB Connector for the LoopBack Node.js Framework
date: 2015-04-30T08:20:18+00:00
author: Nicholas Duffy
guid: https://strongloop.com/?p=24602
permalink: /strongblog/rethinkdb-connector-loopback-node-js-framework/
categories:
  - Community
  - How-To
---
This tutorial is the second in a series of posts that will help you get started with some of the many user contributed NoSQL connectors for Node.js [LoopBack](http://loopback.io/) framework. In this series we will cover usage of the connectors for:

  * <span style="font-size: 18px;"><a href="https://strongloop.com/strongblog/node-js-loopback-js-couchbase-connector/">Couchbase</a></span>
  * <span style="font-size: 18px;"><a href="http://www.rethinkdb.com/">RethinkDB</a></span>
  * <span style="font-size: 18px;"><a href="http://basho.com/riak/">Riak</a></span>
  * <span style="font-size: 18px;"><a href="https://www.arangodb.com/">ArangoDB</a></span>

[Last week ](https://strongloop.com/strongblog/node-js-loopback-js-couchbase-connector/)we covered Couchbase Server using the community contributed [loopback-connector-couchbase](https://github.com/guardly/loopback-connector-couchbase). In this post, we’ll review connecting RethinkDB and LoopBack using another community contributed connector: [loopback-connector-rethinkdb](https://github.com/fuwaneko/loopback-connector-rethinkdb).

[<img class="aligncenter size-large wp-image-24644" src="https://strongloop.com/wp-content/uploads/2015/04/rtplussl-1030x153.png" alt="rtplussl" width="1030" height="153" srcset="https://strongloop.com/wp-content/uploads/2015/04/rtplussl-1030x153.png 1030w, https://strongloop.com/wp-content/uploads/2015/04/rtplussl-300x45.png 300w, https://strongloop.com/wp-content/uploads/2015/04/rtplussl-705x105.png 705w, https://strongloop.com/wp-content/uploads/2015/04/rtplussl-450x67.png 450w, https://strongloop.com/wp-content/uploads/2015/04/rtplussl.png 1305w" sizes="(max-width: 1030px) 100vw, 1030px" />](https://strongloop.com/wp-content/uploads/2015/04/rtplussl.png)

## **RethinkDB**

RethinkDB is described as _“the first open-source, scalable JSON database built from the ground up for the real-time web. It inverts the traditional database architecture by exposing an exciting new access model – instead of polling for changes, the developer can tell RethinkDB to continuously push updated query results to applications in real-time. RethinkDB’s real-time push architecture dramatically reduces the time and effort necessary to build scalable real-time apps.”_

We’ll primarily focus on connecting RethinkDB to LoopBack in this getting started tutorial, but we’ll include a little bonus content at the end to discuss how to use the RethinkDB real-time features with LoopBack.

## **Installing RethinkDB**

RethinkDB offers packages for numerous flavors of Linux as well as OSX, all of which you can find on the [main download page](http://www.rethinkdb.com/docs/install/).

There are official packages for:

  * <span style="font-size: 18px;">Ubuntu</span>
  * <span style="font-size: 18px;">OSX</span>
  * <span style="font-size: 18px;">CentOS</span>
  * <span style="font-size: 18px;">Debian</span>

Additionally, there are community contributed packages for:

  * <span style="font-size: 18px;">Arch Linux</span>
  * <span style="font-size: 18px;">openSUSE</span>
  * <span style="font-size: 18px;">Fedora</span>
  * <span style="font-size: 18px;">Linux Mint</span>
  * <span style="font-size: 18px;">Raspbian</span>

We’ll be developing on OSX, so navigate to the OSX download page. In addition to building from source, we can also install RethinkDB using the official installer or by using Homebrew. We’re going to use the installer to get RethinkDB up and running for the purposes of our tutorial. Simply download the disk image and run on the rethinkdb-2.0.1.pkg file.

<img class="aligncenter size-full wp-image-24646" src="https://strongloop.com/wp-content/uploads/2015/04/RethinkDB2.0.1-installer.png" alt="RethinkDB2.0.1-installer" width="851" height="532" srcset="https://strongloop.com/wp-content/uploads/2015/04/RethinkDB2.0.1-installer.png 851w, https://strongloop.com/wp-content/uploads/2015/04/RethinkDB2.0.1-installer-300x188.png 300w, https://strongloop.com/wp-content/uploads/2015/04/RethinkDB2.0.1-installer-705x441.png 705w, https://strongloop.com/wp-content/uploads/2015/04/RethinkDB2.0.1-installer-450x281.png 450w" sizes="(max-width: 851px) 100vw, 851px" />

The installer will guide you through the remaining steps in order to get RethinkDB installed.

To start the RethinkDB server, run the rethinkdb command in your terminal.

```sh
&gt; $ rethinkdb
Recursively removing directory /Users/nickduffy/rethinkdb_data/tmp
Initializing directory /Users/nickduffy/rethinkdb_data
Running rethinkdb 2.0.1 (CLANG 4.2 (clang-425.0.28))...
Running on Darwin 14.3.0 x86_64
Loading data from directory /Users/nickduffy/rethinkdb_data
Listening for intracluster connections on port 29015
Listening for client driver connections on port 28015
Listening for administrative HTTP connections on port 8080
Listening on addresses: 127.0.0.1, ::1
To fully expose RethinkDB on the network, bind to all addresses by running rethinkdb with the `--bind all` command line option.
Server ready, "duffn_6eo" 1406d4a8-1a6d-48b3-8f9a-ebe47ded9c3d
```

## **Creating test data**

We’ll need some data in RethinkDB to test our application. I’ve included some sample JSON and a short script that we’ll use to populate our database. RethinkDB creates a test database automatically during installation which we&#8217;ll use. You can find the script and sample data in the [data directory](https://github.com/duffn/loopback-rethinkdb-example/tree/master/data) in the Github repository. Run the `sampledata.js` file to create some sample documents. This will create a customer table and insert a few documents that we’ll use for testing.

```sh
&gt; $ node data/sampledata.js
{
  "config_changes": [
    {
      "new_val": {
        "db": "test",
        "durability": "hard",
        "id": "0555c3e8-824f-41c7-9635-e52e7d515857",
        "name": "customers",
        "primary_key": "id",
        "shards": [
          {
            "primary_replica": "duffn_6eo",
            "replicas": [
              "duffn_6eo"
            ]
          }
        ],
        "write_acks": "majority"
      },
      "old_val": null
    }
  ],
  "tables_created": 1
}
{
  "deleted": 0,
  "errors": 0,
  "inserted": 6,
  "replaced": 0,
  "skipped": 0,
  "unchanged": 0
}
```

## **LoopBack &#8211; Creating the application**

Now, we’ll create our application using the [`slc loopback application generator`.](http://docs.strongloop.com/display/public/LB/Application+generator) The `slc` command line tool, which is [Yeoman](http://yeoman.io/) under the hood, can scaffold a full LoopBack application structure for us in just a few simple steps. Run `slc loopback` in your terminal.

```js
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

? What's the name of your application? loopback-rethinkdb-example
? Enter name of the directory to contain the project: loopback-rethinkdb-example
   create loopback-rethinkdb-example/
     info change the working directory to loopback-rethinkdb-example
```

Now that we have our skeleton and all we need to run a basic LoopBack application, let’s install loopback-connector-rethinkdb from the npm registry.

```js
&gt; $ cd loopback-rethinkdb-example
&gt; $ npm install --save loopback-connector-rethinkdb
```

## **Creating the backend datasource definition**

Alright, now that we have the RethinkDB server and loopback-rethinkdb-connector installed, let’s setup our RethinkDB datasource. We’ll start by again using the extremely useful slc from the command line. This time we’ll tell slc that we want to create a new datasource.

```js
&gt; $ slc loopback:datasource
? Enter the data-source name: rethinkdb
? Select the connector for rethinkdb:
  Kafka (provided by community)
  SAP HANA (provided by community)
  Couchbase (provided by community)
❯ other
  In-memory db (supported by StrongLoop)
  Email (supported by StrongLoop)
  MySQL (supported by StrongLoop)
(Move up and down to reveal more choices)
? Enter the connector name without the loopback-connector- prefix: rethinkdb
```

While slc does recognize some community contributed connectors, it does not know the RethinkDB connector, so we’ll just select other and tell slc the name of the connector. Also note that since this is a community contributed connector, StrongLoop does not have a generator for the datasource definition. What’ll you’ll get automatically generated for you is a datasource skeleton.

```js
"rethinkdb": {
  "name": "rethinkdb",
  "connector": "rethinkdb"
}
```

We’ll need to fill in the remaining information to connect to RethinkDB.

**Note:** This connector is a bit different from others as you are required to pass in connection information in the form of a URL that the [Node.js url module](https://nodejs.org/api/url.html) can parse. So, instead of defining the connection in the form of an object, we need to create a connection string in the form of `http://username:password@host:port/database`. Since we’re not using authentication, we can ignore the username and password.

```sh
{
  "db": {
    "name": "db",
    "connector": "memory"
  },
  "rethinkdb": {
    "name": "rethinkdb",
    "connector": "rethinkdb",
    "url": "http://localhost:28015/test"
  }
}
```

## **Creating the models**

Now we’re ready to create the LoopBack models that represent the sample data we added to RethinkDB. There are three main ways in which you can create LoopBack models, all of which were reviewed in my previous post on Couchbase Server. Since we’ve already used the command line, let’s switch it up this time and use slc arc.

StrongLoop Arc is a graphical UI for the StrongLoop API Platform that complements the slc command line tools for developing APIs quickly and getting them connected to data. Arc also includes tools for building, profiling and monitoring Node apps.

Start Arc by running slc arc from the command line.

```js
&gt; $ slc arc                                                                                                                                           
Loading workspace /Users/nickduffy/Dropbox/Development/node/loopback-rethinkdb-example
Embedded Process Manager [(none)]:  starting
StrongLoop Arc is running here: http://localhost:55988/#/
```

Your browser will automatically open to http://localhost:55988/#/. Click on Composer to launch the LoopBack model composer.

<img class="aligncenter size-full wp-image-24616" src="https://strongloop.com/wp-content/uploads/2015/04/arc1.png" alt="arc" width="975" height="565" srcset="https://strongloop.com/wp-content/uploads/2015/04/arc1.png 975w, https://strongloop.com/wp-content/uploads/2015/04/arc1-300x174.png 300w, https://strongloop.com/wp-content/uploads/2015/04/arc1-705x409.png 705w, https://strongloop.com/wp-content/uploads/2015/04/arc1-450x261.png 450w" sizes="(max-width: 975px) 100vw, 975px" />
  
Click on &#8220;Add New Model&#8221; in the menu on the left, enter &#8220;customer&#8221; as the model name, &#8220;customers&#8221; as the plural name and select &#8220;rethinkdb&#8221; as the datasource.

<img class="aligncenter size-full wp-image-24618" src="https://strongloop.com/wp-content/uploads/2015/04/arc21.png" alt="arc2" width="975" height="265" srcset="https://strongloop.com/wp-content/uploads/2015/04/arc21.png 975w, https://strongloop.com/wp-content/uploads/2015/04/arc21-300x82.png 300w, https://strongloop.com/wp-content/uploads/2015/04/arc21-705x192.png 705w, https://strongloop.com/wp-content/uploads/2015/04/arc21-450x122.png 450w" sizes="(max-width: 975px) 100vw, 975px" />
  
Next, we need to enter the properties for our `customer` model. Fill in the names and types for each property as shown below.

<img class="aligncenter size-full wp-image-24617" src="https://strongloop.com/wp-content/uploads/2015/04/arc3.png" alt="arc3" width="975" height="480" srcset="https://strongloop.com/wp-content/uploads/2015/04/arc3.png 975w, https://strongloop.com/wp-content/uploads/2015/04/arc3-300x148.png 300w, https://strongloop.com/wp-content/uploads/2015/04/arc3-705x347.png 705w, https://strongloop.com/wp-content/uploads/2015/04/arc3-450x222.png 450w" sizes="(max-width: 975px) 100vw, 975px" />
  
Click &#8220;Save Model&#8221; and go check out the `common/models` directory inside our project. Arc has automatically created the files necessary to represent our customer model using the properties we entered in the GUI. Simple!

Start the LoopBack application with `slc start` (slc to the rescue yet again) and navigate to http://localhost:3000/explorer in order to use the built in Swagger API explorer to view our customer model.

```js
&gt; $ slc start                                                                                                                                         
App `.` started under local process manager.
  View the status:  slc ctl status
  View the logs:    slc ctl log-dump
  More options:     slc ctl -h

```

<img class="aligncenter size-full wp-image-24615" src="https://strongloop.com/wp-content/uploads/2015/04/arc4.png" alt="arc4" width="975" height="567" srcset="https://strongloop.com/wp-content/uploads/2015/04/arc4.png 975w, https://strongloop.com/wp-content/uploads/2015/04/arc4-300x174.png 300w, https://strongloop.com/wp-content/uploads/2015/04/arc4-705x410.png 705w, https://strongloop.com/wp-content/uploads/2015/04/arc4-450x262.png 450w" sizes="(max-width: 975px) 100vw, 975px" />
  
Click &#8220;Try it out!&#8221; under `GET /customers` to see our sample data.

## <img class="aligncenter size-full wp-image-24614" src="https://strongloop.com/wp-content/uploads/2015/04/arc5.png" alt="arc5" width="975" height="638" srcset="https://strongloop.com/wp-content/uploads/2015/04/arc5.png 975w, https://strongloop.com/wp-content/uploads/2015/04/arc5-300x196.png 300w, https://strongloop.com/wp-content/uploads/2015/04/arc5-705x461.png 705w, https://strongloop.com/wp-content/uploads/2015/04/arc5-450x294.png 450w" sizes="(max-width: 975px) 100vw, 975px" />
  
**Querying data**

We’ve seen that we can view our customer model via the Swagger explorer. Now, let’s take a look at some of the more advanced features of API interaction using `loopback-connector-rethinkdb`.

We can get a single document by calling `GET /customers/{id}`.

```js
&gt; $ curl http://localhost:3000/api/customers/21424c5b-061e-46fc-aeaf-e91fd84283d3
{"id":"21424c5b-061e-46fc-aeaf-e91fd84283d3","isActive":true,"balance":1901.2,"picture":"http://placehold.it/32x32","age":22,"eyeColor":"blue","name":"Bond Christian","gender":"male"}%
```

In addition to equivalence, the connector supports the where [filter](http://docs.strongloop.com/display/public/LB/Where+filter) types between, gt, gte, lt, lte, inq, nin, neq, like and nlike. We’ll cover a few examples here, but you can see many more in the [LoopBack documentation](http://docs.strongloop.com/display/public/LB/Where+filter#Wherefilter-Examples.1).

Find documents where the balance is [greater than](http://docs.strongloop.com/display/public/LB/Where+filter#Wherefilter-gtandlt) 2000.

```sh
&gt; $ curl -g http://localhost:3000/api/customers\?filter\[where\]\[balance\]\[gt\]\=2000                   
[{"id":"5af02b7b-f024-4469-84b5-5d6cbf30734a","isActive":false,"balance":2989.31,"picture":"http://placehold.it/32x32","age":37,"eyeColor":"blue","name":"Carmella Dorsey","gender":"female"},{"id":"73dffc3e-a8dd-46de-8742-70acad40399e","isActive":true,"balance":3499.83,"picture":"http://placehold.it/32x32","age":21,"eyeColor":"green","name":"Griffin Hudson","gender":"male"},{"id":"d1fa7490-058c-4fd8-a7ae-1df945abd88e","isActive":true,"balance":2577.28,"picture":"http://placehold.it/32x32","age":31,"eyeColor":"brown","name":"Schneider King","gender":"male"}]%
```

Use [like](http://docs.strongloop.com/display/public/LB/Where+filter#Wherefilter-likeandnlike) to find documents that match a certain expression.

```js
&gt; $ curl -g http://localhost:3000/api/customers\?filter\[where\]\[name\]\[like\]\=Curry
[{"id":"7843ae04-b52a-49bc-9620-ac74553d5627","isActive":true,"balance":1317.63,"picture":"http://placehold.it/32x32","age":40,"eyeColor":"green","name":"Curry Downs","gender":"male"}]%
```

In addition to using the format above, you can also use [stringified JSON](http://docs.strongloop.com/display/public/LB/Querying+data#Queryingdata-Using%22stringified%22JSONinRESTqueries) with the REST API to create your filters. Here’s an example with the [inq](http://docs.strongloop.com/display/public/LB/Where+filter#Wherefilter-inq) operator.

```js
http://localhost:3000/api/customers?filter={"where":{"eyeColor":{"inq":["green","brown"]}}}

&gt; $ curl -g http://localhost:3000/api/customers\?filter\=\{\"where\":\{\"eyeColor\":\{\"inq\":\[\"green\",\"brown\"\]\}\}\}
[{"id":"73dffc3e-a8dd-46de-8742-70acad40399e","isActive":true,"balance":3499.83,"picture":"http://placehold.it/32x32","age":21,"eyeColor":"green","name":"Griffin Hudson","gender":"male"},{"id":"7843ae04-b52a-49bc-9620-ac74553d5627","isActive":true,"balance":1317.63,"picture":"http://placehold.it/32x32","age":40,"eyeColor":"green","name":"Curry Downs","gender":"male"},{"id":"d1fa7490-058c-4fd8-a7ae-1df945abd88e","isActive":true,"balance":2577.28,"picture":"http://placehold.it/32x32","age":31,"eyeColor":"brown","name":"Schneider King","gender":"male"}]%
```

Of course, the connector also supports other filter operations like [order](http://docs.strongloop.com/display/public/LB/Order+filter), [limit](http://docs.strongloop.com/display/public/LB/Limit+filter), and [fields](http://docs.strongloop.com/display/public/LB/Fields+filter).

```sh
&gt; $ curl -g http://localhost:3000/api/customers\?filter\[fields\]\[name\]\=true\&filter\[order\]\=name\&filter\[limit\]\=1
[{"name":"Bond Christian"}]%
```

##  **Creating data**

When we initially created our application, LoopBack also generated a POST endpoint for our customer resource so that we can easily create new customer documents.

Note: We provided values for the document id when we loaded our initial sample data, but if you do not pass in an id field when creating a document, RethinkDB will automatically generate one for you.

```sh
&gt; $ curl -H "Content-Type: application/json" -X POST -d '{"name": "Nick Duffy"}' http://localhost:3000/api/customers
{"id":"7621a551-4514-43e6-8afa-2af93e27eaed","name":"Nick Duffy"}%
```

##  **Updating data**

Updating a document is as easy as creating or querying &#8211; simply send a `PUT` request to the individual customer resource using the document `id`.

```js
&gt; $ curl -H "Content-Type: application/json" -X PUT -d '{"name": "Nicholas Duffy"}'  http://localhost:3000/api/customers/7621a551-4514-43e6-8afa-2af93e27eaed
{"id":"7621a551-4514-43e6-8afa-2af93e27eaed","name":"Nicholas Duffy"}%
```

## **RethinkDB real-time and LoopBack**

Now that we’ve covered the basics of creating a LoopBack API application and connecting it with RethinkDB, let’s look at how we could possibly use the RethinkDB real-time features with LoopBack.

[Changefeeds](http://www.rethinkdb.com/docs/changefeeds/javascript/) lie at the heart of RethinkDB’s real-time functionality. They allow clients to subscribe to changes on a table, document or even a specific query. Our example will cover how we can subscribe to changes on a table and get notifications in real-time when a document is created or updated using the LoopBack REST API.

First, we’ll create a simple script that will listen to changes on our customer table and output notifications to the console. The portion of the script that listens for changes is one line of code. That’s how simple it is to implement real-time functionality in RethinkDB. You can review the script in this tutorial’s [Github repository](https://github.com/duffn/loopback-rethinkdb-example/blob/master/server/rethink-changes.js).

Make sure RethinkDB and the LoopBack application are started and run this in one terminal window to start the script and listen for changes on the customer table.

```js
&gt; $ node server/rethink-changes.js
```

Next, open up another terminal window and insert a document into the customer table using our REST API.

```js
&gt; $ curl -H "Content-Type: application/json" -X POST -d '{"name": "James Jones", "balance": -104.72}' http://localhost:3000/api/customers
{"id":"925317d0-808d-4701-8cfe-2ea9149c6e6a","balance":-104.72,"name":"James Jones"}%
```

You’ll see that in the terminal where we started the rethink-changes.js script that RethinkDB immediately recognized that we added a new document and sent a notification to the console. Real-time notifications with one line of code!

You’ll also see that RethinkDB returned and old_val object which is null. That is because this is a brand new document so there is no “old value” to reference.

```js
{ new_val:
   { balance: -104.72,
     id: '925317d0-808d-4701-8cfe-2ea9149c6e6a',
     name: 'James Jones' },
  old_val: null }
```

Let’s update our document and see what kind of notification we get now.

```js
&gt; $ curl -H "Content-Type: application/json" -X PUT -d '{"balance": 8027.62}'  http://localhost:3000/api/customers/925317d0-808d-4701-8cfe-2ea9149c6e6a
{"id":"925317d0-808d-4701-8cfe-2ea9149c6e6a","balance":8027.62,"name":"James Jones"}%
```

Now we get a notification from RethinkDB that includes both the old values and new values of the document that we updated.

```sh
{ new_val:
   { balance: 8027.62,
     id: '925317d0-808d-4701-8cfe-2ea9149c6e6a',
     name: 'James Jones' },
  old_val:
   { balance: -104.72,
     id: '925317d0-808d-4701-8cfe-2ea9149c6e6a',
     name: 'James Jones' } }
```

Incredible! Is your head spinning with ideas on how you can use LoopBack along with RethinkDB’s real-time functionality to create awesome applications? I know mine is!

## **Conclusion**

Even though the documentation for loopback-connector-rethinkdb is missing, the connector is solid and this article will give you a headstart to using LoopBack with RethinkDB. If you stop here and and only use this connector with LoopBack and RethinkDB for your REST API, you’ve already created an amazingly simple, yet powerful application.

If you want to take the next step and create applications using LoopBack along with RethinkDB’s real-time functionality, I hope this article has you excited to dive in and imagine your own applications that can be created using these two amazing technologies!

You can find the code for this article on [Github](https://github.com/duffn/loopback-rethinkdb-example).

## **What&#8217;s next? More real-time goodness**

If you are working on a Node project which needs real-time communication with other Node and/or Angular apps, devices and sensors, [checkout](https://strongloop.com/strongblog/introducing-strongloops-unopinionated-pubsub/) StrongLoop&#8217;s new unopinionated Node.js pub-sub for mobile, IoT and the browser!

&nbsp;