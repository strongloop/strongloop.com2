---
id: 24812
title: Getting Started with the Node.js LoopBack Connector for ArangoDB
date: 2015-05-12T08:00:50+00:00
author: Nicholas Duffy
guid: https://strongloop.com/?p=24812
permalink: /strongblog/getting-started-with-node-js-loopback-connector-for-arangodb/
categories:
  - Community
  - LoopBack
---
This tutorial is the third in a series of posts that will help you get started with some of the many user contributed NoSQL connectors for [LoopBack](http://loopback.io/). In this series we will cover usage of the connectors for:

  * [Couchbase](https://strongloop.com/strongblog/node-js-loopback-js-couchbase-connector/)
  * [Riak](http://basho.com/riak/)
  * [RethinkDB](https://strongloop.com/strongblog/rethinkdb-connector-loopback-node-js-framework/)
  * [ArangoDB](https://www.arangodb.com/)

We’ve already covered [Couchbase Server](https://strongloop.com/strongblog/node-js-loopback-js-couchbase-connector/) using [loopback-connector-couchbase](https://github.com/guardly/loopback-connector-couchbase) and [RethinkDB](https://strongloop.com/strongblog/rethinkdb-connector-loopback-node-js-framework/) with [loopback-connector-rethinkdb](https://github.com/fuwaneko/loopback-connector-rethinkdb). Today, we’ll be discussing connecting LoopBack and [ArangoDB](https://www.arangodb.com/) using another community contributed connector &#8211; [loopback-connector-arango](https://github.com/duffn/loopback-connector-arango).

<img class="aligncenter size-full wp-image-24850" src="{{site.url}}/blog-assets/2015/05/arangodb.png" alt="arangodb" width="578" height="174"  />

## **ArangoDB**

ArangoDB is described as

> “A distributed free and open-source database with a flexible data model for documents, graphs, and key-values. Build high performance applications using a convenient SQL-like query language or JavaScript extensions.”

ArangoDB is a multi-model mostly-memory database with a flexible data model for documents and graphs. It is designed as a “general purpose database”, offering all the features you typically need for modern web applications.

## **Installing ArangoDB**

Navigate to the [ArangoDB download page](https://www.arangodb.com/download/) to download ArangoDB for your operating system. As you can see, ArangoDB supports numerous platforms.

<img class="aligncenter size-full wp-image-24813" src="{{site.url}}/blog-assets/2015/05/adb-download.png" alt="adb-download" width="975" height="492"  />

Once again, we’ll be developing on Mac OSX. You can install ArangoDB via a command-line app, Homebrew or even the Apple AppStore. ArangoDB [recommends](https://docs.arangodb.com/Installing/MacOSX.html) Homebrew so we’ll follow their recommendation.

**Tip:** Are you an OSX user but haven’t used Homebrew before? Start immediately! [Homebrew](http://brew.sh/) is billed as the “missing package manager” for OSX and you need to install it right now. Think apt-get or yum for OSX.

```sh
> $ brew install arangodb

==> Downloading https://homebrew.bintray.com/bottles/arangodb-2.4.4.yosemite.bottle.tar.gz
######################################################################## 100.0%
==> Pouring arangodb-2.4.4.yosemite.bottle.tar.gz
==> Caveats
To have launchd start arangodb at login:
    ln -sfv /usr/local/opt/arangodb/*.plist ~/Library/LaunchAgents
Then to load arangodb now:
    launchctl load ~/Library/LaunchAgents/homebrew.mxcl.arangodb.plist
Or, if you don't want/need launchctl, you can just run:
    /usr/local/opt/arangodb/sbin/arangod --log.file -
==> /usr/local/Cellar/arangodb/2.4.4/sbin/arangod --upgrade --log.file -
==> Summary
&#x1f37a;  /usr/local/Cellar/arangodb/2.4.4: 2477 files, 175M 
 Yeah, that was it - <code>brew install arangodb</code> and ArangoDB is now installed on your system.
```

**Note:** If you are looking for cloud hosting with ArangoDB, you also have the very convenient option of deploying on [AWS](https://aws.amazon.com/marketplace/pp/B00RNJ092K/) or [Azure](https://vmdepot.msopentech.com/List/Index?sort=Featured&search=ArangoDB) as ArangoDB is available in both marketplaces.

## **Creating the test database**

Now that we have ArangoDB installed, let’s run it! If you followed along above and installed using Homebrew, run this command in the terminal to start ArangoDB.

```js
> $ /usr/local/opt/arangodb/sbin/arangod --log.file -
```

Let’s create a database in ArangoDB that we’ll use for the remainder of the tutorial. Did you know that when we started ArangoDB, we also started a full featured, built-in web interface that we can use for database and collection administration, statistics, ad-hoc queries and more? We’re only going to use it to create our database, but you can review the [ArangoDB documentation](https://docs.arangodb.com/WebInterface/index.html) to see all the features of the web interface.

Navigate to <http://localhost:8529/>, click on the &#8220;DB&#8221; drop down on the top menu and select &#8220;Manage DBs&#8221;. On this screen, we’ll be able to add a new database.

<img class="aligncenter size-full wp-image-24817" src="{{site.url}}/blog-assets/2015/05/add-db.png" alt="add-db" width="975" height="150"  />

Click &#8220;Add Database&#8221; and let’s name our new database &#8220;loopback-example&#8221;. Click create and that’s it. We have a new database in ArangoDB. We’ll fill a collection with some test data shortly, but first let’s create our LoopBack application.

## **LoopBack &#8211; Creating the application**

Like last time, we’ll again create our LoopBack application using the [slc loopback application generator](http://docs.strongloop.com/display/public/LB/Application+generator). The slc command line tool, which is [Yeoman](http://yeoman.io/) under the hood, can scaffold a full LoopBack application structure for us in just a few simple steps. Run `slc loopback` in your terminal.

```js
> $ slc loopback

     _-----_
    |       |    .--------------------------.
    |--(o)--|    |  Let's create a LoopBack |
   `---------´   |       application!       |
    ( _´U`_ )    '--------------------------'
    /___A___\
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

? What's the name of your application? loopback-arangodb-example
? Enter name of the directory to contain the project: loopback-arangodb-example
```

`slc` makes it very simple for us to create a full LoopBack application structure in just a few steps. Now, cd into the application directory and install the ArangoDB connector.

> **Note:** The [Github repository](https://github.com/nvdnkpr/loopback-connector-arango) and the [NPM registry](https://www.npmjs.com/package/loopback-connector-arango) for the original version of connector are out of sync. The Github repository holds a old version (0.0.3) of the connector while NPM has the most up-to-date (0.1.0) version. There have been some changes in LoopBack since this connector was last updated, so I’ve forked the code from NPM and made a few changes to get it working again with LoopBack. Credit for the original loopback-connector-arango goes to [nvdnkpr](https://github.com/nvdnkpr).
>
> &nbsp;

```js
> $ npm install --save duffn/loopback-connector-arango

loopback-connector-arango@0.1.0 node_modules/loopback-connector-arango
├── async@0.9.0
├── loopback-connector@1.2.1
├── debug@1.0.4 (ms@0.6.2)
└── arangojs@1.0.0 (base64@0.1.0, urlparser@0.3.9, micropromise@0.3.7)
```

## **Creating the backend datasource definition**

Alright, now that we have ArangoDB and the community connector installed, let’s setup the datasource that will allow us to connect ArangoDB and LoopBack. We’ll use slc again, but this time we’ll tell slc that we want to create a new datasource.

```js
> $ slc loopback:datasource

? Enter the data-source name: arangodb
? Select the connector for arangodb:
  Kafka (provided by community)
  SAP HANA (provided by community)
  Couchbase (provided by community)
❯ other
  In-memory db (supported by StrongLoop)
  Email (supported by StrongLoop)
  MySQL (supported by StrongLoop)
(Move up and down to reveal more choices)
? Enter the connector name without the loopback-connector- prefix: arango
```

While `slc` does recognize a few community contributed connectors, it does not know the ArangoDB connector, so we’ll just select &#8220;other&#8221; and tell `slc` the name of the connector.

**Note:** Don’t forget that the name of the connector is loopback-connector-arango and not loopback-connector-arangodb.

Despite not being aware of the ArangoDB connector, the datasource generator will still give us a head start by creating a skeleton of the ArangoDB datasource. Fill in the rest of the arangodb section in `server/datasources.json`.

```js
"arangodb": {
  "name": "arangodb",
  "connector": "arango",
  "hostname": "127.0.0.1",
  "port": 8529,
  "database": "loopback-example"
}
```

**Note:** Some connectors use host for the server and some use hostname. Note that this connector uses hostname.

Our datasource is ready to go, so now we can create some models that will represent the data that we’ll store in ArangoDB.

## **Creating the models**

We’re going to use slc again, but this time we’re going to use it to start Arc.

[Arc](https://strongloop.com/node-js/arc/) is a graphical UI for the StrongLoop API Platform that complements the slc command line tools for developing APIs quickly and getting them connected to data. Arc also includes tools for building, profiling and monitoring Node apps.

We’re going to start with building our application using Arc and we’ll touch on monitoring our app a little bit later.

```js
> $ slc arc
```

This single command will start Arc and take you to the Arc starting page.

<img class="aligncenter size-full wp-image-24826" src="{{site.url}}/blog-assets/2015/05/strongloop-arc.png" alt="strongloop-arc" width="975" height="484"  />

Click on &#8220;Composer&#8221;. This will take us to the Arc Composer where we can see the arangodb datasource we already created under the datasource menu.

Click on &#8220;Add New Model&#8221; under the model menu.

<img class="aligncenter size-full wp-image-24827" src="{{site.url}}/blog-assets/2015/05/sl-arc-2.png" alt="sl-arc-2" width="421" height="532"  />

Enter the &#8220;Name&#8221; as &#8220;business&#8221;, the &#8220;Plural&#8221; as &#8220;businesses&#8221; and select &#8220;arangodb&#8221; as the &#8220;datasource&#8221;.

Next, enter the properties for our model as shown below, then click &#8220;Save Model&#8221;.

<img class="aligncenter size-full wp-image-24829" src="{{site.url}}/blog-assets/2015/05/properties.png" alt="properties" width="975" height="438"  />

You just created a JSON model representation of our data in ArangoDB and exposed it via the LoopBack REST API without writing a line of code! That’s amazing. Check out the model in common/models in the application directory.

We have our model in LoopBack and now we’re ready to create the collection that will hold our data and populate it with some sample documents.

## **Creating test data part 2**

One neat feature of loopback-connector-arango is that it implements LoopBack’s auto-migrate functionality. [Auto-migration](http://docs.strongloop.com/display/public/LB/Creating+a+database+schema+from+models#Creatingadatabaseschemafrommodels-Auto-migrate) can create a database schema based on our application&#8217;s models. With relational databases this means that auto-migrate will create a table for a model and columns for each model property.Since we’re using a NoSQL database here, auto-migrate will only create an ArangoDB collection for us, but it is still a nice feature to have included in a community contributed connector.

**Note:** Auto-migrate will drop an existing table if it’s name matches a model name! Do not use auto-migrate with an existing table/collection.

I’ve provided a [simple script](https://github.com/duffn/loopback-arangodb-example/blob/master/data/sampledata-migrate.js) that will run automigrate on our ArangoDB datasource and create the business collection.

```js
> $ node data/sampledata-migrate.js
```

You can head to http://localhost:8529/\_db/loopback-example/\_admin/aardvark/standalone.html#collections to see that our business collection has been created.

Now we can populate our business collection with some sample documents. I’ve provided [another script](https://github.com/duffn/loopback-arangodb-example/blob/master/data/sampledata-load.js) to create sample data.

```js
> $ node data/sampledata-migrate.js
```

The cool thing to note about this script is that since we already created our datasource and model, we don’t have to go through the hassle again of using a different Node.js module to connect to ArangoDB, pass it the proper connection information, figure out how to use the module and insert documents. By defining our connection information and models for LoopBack, all we need to do is call &#8220;create&#8221; on our business model to insert documents. Inserting documents in bulk into ArangoDB can simply look like this!

```js
business.create(sampleData, function(err, models) { …
```

## **Querying data**

We’re ready to query our API! Let’s start by using LoopBack’s built-in Swagger API explorer. Start your application using `slc start` and go to http://localhost:3000/explorer.

```js
> $ slc start

App `.` started under local process manager.
  View the status:  slc ctl status
  View the logs:    slc ctl log-dump
  More options:     slc ctl -h
```

Expand the `GET /companies` section and click on &#8220;Try it out!&#8221; to view the documents in our collection.

<img class="aligncenter size-full wp-image-24835" src="{{site.url}}/blog-assets/2015/05/api-explorer.png" alt="api-explorer" width="975" height="707"  />

You’ll see that even though we didn’t provide an id or revision, ArangoDB automatically created those for us.

We can get individual documents by using the id that the connector created for us.

```js
> $ curl http://127.0.0.1:3000/api/businesses/12388685741

{"id":"12388685741","isActive":true,"company":"DEEPENDS","email":"chambershogan@deepends.com","address":"643 Minna Street, Lydia, Minnesota, 4426","latitude":-20.366389,"longitude":129.676139,"_rev":"12388685741"}%
```

**Note:** ArangoDB’s id property is actually a database wide id that looks like `collectionname/123456`. Well, that id with a “/” is not very friendly to URLs like our REST API uses, so the connector implements two methods, `fromDB` and `toDB`, that manipulate the id to add or remove the collection name as necessary. So, when we call one of our endpoints with an id, we only need to pass the &#8220;123456&#8221; and not the `collectionname/123456`.

The connector supports numerous [where filters](http://docs.strongloop.com/display/public/LB/Where+filter) as well such as `equivalence`&#8230;

```js
> $ curl -g http://127.0.0.1:3000/api/businesses\?filter\[where\]\[company\]\=DEEPENDS  

[{"id":"12388685741","isActive":true,"company":"DEEPENDS","email":"chambershogan@deepends.com","address":"643 Minna Street, Lydia, Minnesota, 4426","latitude":-20.366389,"longitude":129.676139,"_rev":"12388685741"}]%
```

&#8230;and [greater than](http://docs.strongloop.com/display/public/LB/Where+filter#Wherefilter-gtandlt).

```js
> $ curl -g http://localhost:3000/api/businesses\?filter\[where\]\[latitude\]\[gt\]\=80

[{"id":"7531283959","isActive":false,"company":"OCTOCORE","email":"chambershogan@octocore.com","address":"376 Fayette Street, Williamson, Marshall Islands, 5746","latitude":88.83977,"longitude":101.820201,"_rev":"7531283959"}]%

```

We can also use other filters with the connector such as [limi](http://docs.strongloop.com/display/public/LB/Limit+filter)t&#8230;

```js
> $ curl -g http://localhost:3000/api/businesses\?filter\[limit\]\=1   

[{"id":"12388685741","isActive":true,"company":"DEEPENDS","email":"chambershogan@deepends.com","address":"643 Minna Street, Lydia, Minnesota, 4426","latitude":-20.366389,"longitude":129.676139,"_rev":"12388685741"}]%
```

&#8230;and [order](http://docs.strongloop.com/display/public/LB/Order+filter).

```js
> $ curl -g http://127.0.0.1:3000/api/businesses\?filter\[order\]\=company\&\[filter\]\[limit\]\=2

[{"id":"12388685741","isActive":true,"company":"DEEPENDS","email":"chambershogan@deepends.com","address":"643 Minna Street, Lydia, Minnesota, 4426","latitude":-20.366389,"longitude":129.676139,"_rev":"12388685741"},{"id":"12648863661","isActive":true,"company":"DUFFCON","_rev":"12669441965"}]%
```

## **Creating and updating data**

Creating a document is as simple as sending a POST request to the business endpoint.

```js
> $ curl -H "Content-Type: application/json" -X POST -d '{"company": "DUFFCON"}' http://localhost:3000/api/businesses   

{"id":"12648863661","company":"DUFFCON"}%
```

If we need to update the document, a call to `PUT /business/id` will take care of that.

```js
> $ curl -H "Content-Type: application/json" -X PUT -d '{"isActive": true}' http://localhost:3000/api/businesses/12648863661    

{"id":"12648863661","isActive":true,"company":"DUFFCON","_rev":"12648863661"}%
```

LoopBack automatically created all of these endpoints for us when we told it to expose our business model via the REST API!

## **Arc Profiler**

Now that we’ve taken a look at the LoopBack ArangoDB connector, let’s take a quick side tour through the Arc Heap Profiler. Remember above that we used Arc Composer to create our models for the tutorial. Well, there’s much more to Arc than just Composer!

First, start Arc with `slc arc`, select &#8220;Profile&#8221; from the main menu and then click &#8220;Load&#8221; on the profile page.

<img class="aligncenter size-full wp-image-24845" src="{{site.url}}/blog-assets/2015/05/arc-profiler.png" alt="arc-profiler" width="975" height="423"  />

Select &#8220;Heap Snapshot&#8221; and then click &#8220;Take Snapshot&#8221;. Wait a few seconds for the snapshot to build.

<img class="aligncenter size-full wp-image-24846" src="{{site.url}}/blog-assets/2015/05/profiler-2.png" alt="profiler-2" width="975" height="407"  />

Select the snapshot created from the left-hand menu and type &#8220;ArangoDB&#8221; into the class filter box. Expand the ArangoDB class, datasource and models and you’ll see our business model.

Diving too much further into Arc Profiler is beyond the scope of this tutorial, but you can read more about it right on the StrongLoop blog at Using [StrongLoop Arc to Profile Memory Leaks in SailsJS](https://strongloop.com/strongblog/node-js-strongloop-arc-sailsjs-to-profile-memory-leaks/). Wait, what? Sails? That’s right! One of the excellent things about Arc is that it works with any Node.js application.

## **Conclusion**

It is amazingly simple to get ArangoDB and LoopBack up and running on your machine. After installing ArangoDB and LoopBack, it only takes a few steps to get the two connected and only a few more to create models of your data and expose them via LoopBack’s REST API. Together they can form a very dynamic duo.

When you’re ready to take the next step, add Arc Profiler into the mix and you have a true powerhouse!

You can find the code for this example on [Github](https://github.com/duffn/loopback-arangodb-example).

&nbsp;
