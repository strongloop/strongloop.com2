---
id: 19604
title: Getting Started with Node.js for the PHP Developer
date: 2014-08-27T07:32:52+00:00
author: Grant Shipley
guid: http://strongloop.com/?p=19604
permalink: /strongblog/node-js-php-get-started/
categories:
  - Community
  - How-To
---
You&#8217;re a PHP developer.  I get it.  So am I.  My journey to PHP didn&#8217;t take the normal road that most PHP developers travel in their quest for the perfect programming language.  I initially started as Java Developer and spent roughly 10 years living in that land.  I was one of those die hard Java developers that when PHP would get introduced into a conversation, I would start spouting off things like enterprise, scalability and other nonsense.

I started working on an open source project that needed a social web front-end about 5 years ago and the team needed to choose a programming language for the site.  I explored Java and most other languages but settled on PHP  for a number of reasons.  It was tough to swallow my pride and start coding in PHP but what happened during that project was nothing short of a miracle.  I fell in love with the language and began using it for as many projects that I could find while leaving my Java roots in the dust.  PHP has served me well over the last 5 years but I was still searching for that holy grail of a programming language that is fast to develop in, has enterprise backing, is performant and scalable while also providing a strong community of developers.  I believe that Node.js satisfies all of my requirements while still being a fast growing and evolving language.

The first thing you need to understand is that Node.js is not just for the hipster developers or early adopters.  It is in use by some of the most highly trafficked website on the Internet today and is continuing to win over developers hearts and mind.  It is truly at a point where you can trust it for even the most complicated of systems.

## **Node.js is JavaScript**

If you are thinking you need to learn a whole new language to be productive with Node.js, you are probably wrong.  Most developers are already familiar with JavaScript and that is the language and semantics that you will be working with when coding in Node.js.  In fact, a recent [article published by Red Monk](http://redmonk.com/sogrady/2014/01/22/language-rankings-1-14/) that tries to make sense of github projects to determine the most popular languages has JavaScript as the King.  The top three languages are as follows:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">JavaScript</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Java</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">PHP</span>
</li>

Given the popularity of JavaScript and its widespread adoption across our industry, if you are not already familiar with it, it&#8217;s probably time to buckle down and start learning it.

## **If Node.js just uses JavaScript, what exactly is it?**

In a nutshell, Node.js is a platform for server side activities.  It uses the Javascript programming language and has a plethora of libraries available as npm modules.  You can think of these npm modules as library dependencies that may be satisfied with Composer if you are coming from PHP land.  In fact, the default dependencies management system for PHP (Composer) was [inspired by Node.js](https://getcomposer.org/doc/00-intro.md) according the official site.  Chances are, if you need a bit of functionality and don’t fancy writing all of the code yourself, there is an npm module available that already provides the features you are looking for.

Node applications are normally implemented when you need to maximize efficiency by utilizing non-blocking I/O and asynchronous events.  One gotcha for PHP Developers to know is that Node.js applications run in a single thread. However, backend Node.js code uses multiple threads for operations such as network and file access.  Given this, Node is perfect for applications where a near real-time experience is desired.

## **Getting started with a sample project**

For the remainder of this blog post, I am going to show you how to get up to speed with Node.js coming from a PHP background.  The sample application that we are going to write is a simple backend service that will provide the location of every Walmart store.  I chose Walmart for this example because quite simply, it is the holy grail of all department stores.  If Walmart doesn’t have it, you don’t need it.

By the end of this blog post, you will see how quick and easy it is to create a REST based API using Node.js that is powered by the popular MongoDB database.  I chose this REST based example because creating a backend API has quickly became a common use case in most modern applications.

I had originally planned to create the same application in both PHP and Node.js to help ease the transition for you but in order to cover all of the different frameworks and ways of creating REST based services in PHP, it would warrant an entire book and simply can’t be covered in a single blog post.  I then thought about just using the Laravel framework as it is continuing to grow in popularity. However,  I would still only reach a quarter of the PHP developers.  Personally, my favorite framework is CodeIgniter but it is quickly losing ground and now only represents less than 8% of the PHP developer population.  [Sitepoint](http://www.sitepoint.com/best-php-frameworks-2014/) recently published an article discussing this very thing and provides the following chart depicting the frameworks that show the most promise for 2014.

<img class="aligncenter size-full wp-image-19607" src="https://strongloop.com/wp-content/uploads/2014/08/slnodePHP1.png" alt="slnodePHP1" width="1024" height="853" srcset="https://strongloop.com/wp-content/uploads/2014/08/slnodePHP1.png 1024w, https://strongloop.com/wp-content/uploads/2014/08/slnodePHP1-300x250.png 300w, https://strongloop.com/wp-content/uploads/2014/08/slnodePHP1-705x587.png 705w, https://strongloop.com/wp-content/uploads/2014/08/slnodePHP1-450x375.png 450w" sizes="(max-width: 1024px) 100vw, 1024px" />

Given the vast differences in how to configure database connections and create REST services for each framework, I will assume that you know how to do this for your framework in PHP and instead will focus just on the Node.js code.

## **Creating our Node.js application**

For the rest of this post, we are going to create the Walmart locator application using the [LoopBack API framework](http://loopback.io/) from StrongLoop. As an added bonus, I will walk you through installing Node.js on OSX.  So grab your cup of coffee, sit back, relax, and let’s get to work.

<!--more-->

## **Step 1: Installing Node.js**

The easiest way to install Node.js is via one of the available binary packages that is available for most operating systems. Point your browser to the following URL and download the correct one for your operating system:

<http://nodejs.org/download/>

Once this page loads, you should see the following:

<img class="aligncenter size-full wp-image-19608" src="https://strongloop.com/wp-content/uploads/2014/08/slphpnodeinstall1.png" alt="slphpnodeinstall1" width="951" height="971" srcset="https://strongloop.com/wp-content/uploads/2014/08/slphpnodeinstall1.png 951w, https://strongloop.com/wp-content/uploads/2014/08/slphpnodeinstall1-293x300.png 293w, https://strongloop.com/wp-content/uploads/2014/08/slphpnodeinstall1-36x36.png 36w, https://strongloop.com/wp-content/uploads/2014/08/slphpnodeinstall1-450x459.png 450w" sizes="(max-width: 951px) 100vw, 951px" />

If you are using Mac OSX, click on the universal .pkg file. This will save the installation program to your local computer. Once the file has been downloaded, start the installation program by double clicking on the .pkg file that has been downloaded and you will be presented the installation dialog:

<img class="aligncenter size-full wp-image-19609" src="https://strongloop.com/wp-content/uploads/2014/08/0nodejsInstall2.png" alt="0nodejsInstall2" width="619" height="437" srcset="https://strongloop.com/wp-content/uploads/2014/08/0nodejsInstall2.png 619w, https://strongloop.com/wp-content/uploads/2014/08/0nodejsInstall2-300x211.png 300w, https://strongloop.com/wp-content/uploads/2014/08/0nodejsInstall2-260x185.png 260w, https://strongloop.com/wp-content/uploads/2014/08/0nodejsInstall2-450x317.png 450w" sizes="(max-width: 619px) 100vw, 619px" />

Complete the installation process by using all of the defaults and finally click on the close button to exit the program once the installation has been successful. Pretty easy, huh?

## **Step 2: Installing LoopBack with NPM**

Now that we have Node.js installed on our local system, we want to install the LoopBack packages that is provided by StrongLoop. LoopBack is an open source API framework that provides functionality that will make your life easier as you begin to learn how to write and deploy software written in Node.js.

In order to install LoopBack, we will be using the npm command that is part of the core Node.js distribution. NPM is the official package manager for installing libraries or modules that your applications depend on. Given that this post is written for PHP developers, an easy way to think of NPM modules is to relate it to Composer. Using the Composer dependencies system, developers are able to specify dependencies in their composer.json file. Once the packages have been defined in the composer.json file, a PHP developer simply needs to issue the install command which which should be similar to the following:

`$ php composer.phar install`

NPM modules works the same way and uses the package.json file to allow you to specify dependencies for a particular application. You can also install dependencies from the command line to make them available on your local system. Don’t worry if you don’t understand this just yet as we will cover the package.json file in more detail in a later step.

In order to install LoopBack, we can issue a single command that will download and install all of the dependencies we need for the package. Open up your terminal window and issue the following command:

```
$ npm install -g strongloop
```

Note: You may have to use sudo depending on your installation

What just happened? We told npm that we want to install the strongloop package while also providing the `-g` option. The `-g` option makes the package available as a global package for anyone on the system to use and is available to all applications. Once you run the above command, NPM will download the package as well as any dependencies that is required. Depending on the speed of your system, this may take a few minutes to complete.

## **Step 3: Creating our application**

Creating an application using the LoopBack API is very easy and straight-forward. Simply open up your terminal window and issue the following command to create a new application called `locatewalmart`.

```sh
$ slc loopback

     _-----_
    |       |    .--------------------------.
    |--(o)--|    |  Let's create a LoopBack |
   `---------´   |       application!       |
    ( _´U`_ )    '--------------------------'
    /___A___\    
     |  ~  |     
   __'.___.'__   
 ´   `  |° ´ Y `

[?] Enter a directory name where to create the project: locatewalmart
   create locatewalmart/
     info change the working directory to locatewalmart
```
The `slc` utility will now create a new LoopBack based project called `locatewalmart` and configure the project. When we get prompted for the application name, we can keep the default.

`[?] What's the name of your application? locatewalmart`

After running the above command, a new directory for your project will be created for your application. Change to the application directory with the cd command:

`$ cd locatewalmart`

Now that we have our application created, we want to add support for MongoDB as a datasource for loopback.

## **Step 4: Defining our DataSource**

In order to communicate with MongoDB, we need add a datasource to our application. We do that by running:

```sh
$ slc loopback:datasource mymongo
[?] Enter the data-source name: mymongo
[?] Select the connector for mymongo:
PostgreSQL (supported by StrongLoop)
Oracle (supported by StrongLoop)
Microsoft SQL (supported by StrongLoop)
❯ MongoDB (supported by StrongLoop)
SOAP webservices (supported by StrongLoop)
REST services (supported by StrongLoop)
Neo4j (provided by community)
(Move up and down to reveal more choices)
```
## **Step 5: Pointing to the real datasource**

In order to communicate with MongoDB, we need to point the datasource to the actual MongoDB instance. LoopBack defines all datasource configuration in the `datasource.json` file that is located in your applications `root/server` directory. Open this file and add a datasource for MongoDB as shown in the following code:

```{
  "db": {
    "name": "db",
    "connector": "memory"
  },
  "mymongo": {
    "name": "mymongo",
    "connector": "mongodb"
    "url": "mongodb://localhost:27017/locatewalmart"

  }
}
```
**Note:** Be sure to provide the correct connection URL for your MongoDB database. For this example, I have a database created locally called locatewalmart that I want to use for my datasource.

Now that we have our database defined, there are a couple of extra things we need to do. First of all we need to specify that our applications depends on the `loopback-connector-mongodb` package. To specify a dependency, you modify the package.json file which is similar to editing the `composer.json` file in PHP. Open up the `package.json` file that is located in the root directory of your application and add the `loopback-connector-mongodb` to the dependency section. After that you can run npm install.

Alternately you can just run:

`$ npm install loopback-connector-mongodb --save`

This will auto update the `package.json`. The section should look like the following:

```"dependencies": {
    "compression": "^1.0.3",
    "errorhandler": "^1.1.1",
    "loopback": "^2.0.0",
    "loopback-boot": "^2.0.0",
    "loopback-connector-mongodb": "^1.4.1",
    "loopback-datasource-juggler": "^2.0.0",
    "serve-favicon": "^2.0.1"
  }
```
&nbsp;

## **Step 6: Importing data into MongoDB**

Now that we have our datasource configured, we need to load the data set into our MongoDB database.

The first thing we want to do is download a JSON file that has all the data that we want to return. You can grab this at the following URL:

<https://dl.dropboxusercontent.com/u/72466829/walmart.json>

Once you have the data set downloaded, simply import it into your database using the mongoimport command as shown below:

```sh
$ mongoimport --jsonArray -d locatewalmart -c store --type json --file walmart.json -h yourMongoHost --port yourMongoPort -u yourMongoUsername -p yourMongoPassword
```
You should see the following results:

```sh
connected to: 127.0.0.1
2014-08-17T13:07:26.301-0400 check 9 3176
2014-08-17T13:07:26.305-0400 imported 3176 objects
```
## **Step 7: Creating our Store model**

A model can be thought of in the same terms as you think about models in PHP land if you are using a MVC framework. It is a representation of an Object which in this case is a Walmart store. LoopBack provides a convenient way to create model objects by using the command line. Open up your terminal window, go to the project folder and issue the following command:

```sh
$ slc loopback:model
```
This will begin an interactive session where you can define your model. The first thing that you will be asked is the datasource you want to associate the model with. We will select the mymongo datasource that we just created before. Next it will ask for the plural name for the model. Let’s use the default (stores) and press enter.

```sh
[?] Enter the model name: store
[?] Select the data-source to attach store to:
db (memory)
❯ mymongo (mongodb)
[?] Expose store via the REST API? Yes
[?] Custom plural form (used to build REST URL):
```
Once you hit the enter key, you will be prompted to specify the properties of store model. You can think of this as var(s) that you define on a class in PHP.

```sh
Enter an empty property name when done.
[?] Property name:
```
The properties we want to add is the type of store, the open date, the latitude and the longitude.

```sh
[?] Property name: opendate
   invoke   loopback:property
```
Once you hit enter, you will be asked to provide the data type for each property specified. The first item will be opendate and we want to select that it is of type date. Select date and press the enter key.

```sh
[?] Property type:
  string
  number
  boolean
  object
  array
❯ date
  buffer
  geopoint
  (other)
```
Then you will be asked if you want this property as a required one for schema validation. We will enter yes

```sh
[?] Required? (y/N) : y
```
You will then be asked for the data type for each remaining properties. Provide the following answers:

```sh
[?] Property name: type_store
   invoke   loopback:property
[?] Property type: (Use arrow keys)
❯ string
  number
  boolean
  object
  array
  date
  buffer
  geopoint
  (other)
[?] Required? (y/N) : y

Let's add another store property.
Enter an empty property name when done.

[?] Property name: latitude
   invoke   loopback:property
[?] Property type: (Use arrow keys)
❯ string
  number
  boolean
  object
  array
  date
  buffer
  geopoint
  (other)
[?] Required? (y/N) : y

Let's add another store property.
Enter an empty property name when done.
[?] Property name: longitude
   invoke   loopback:property
[?] Property type: (Use arrow keys)
❯ string
  number
  boolean
  object
  array
  date
  buffer
  geopoint
  (other)
[?] Required? (y/N) : y
```
Type in yes and hit the enter key.

Congratulations! you have just created your first model object using LoopBack in conjunction with Node.js. To see what was actually created under the covers, open up the `store.json` file that is located in the `root/common/models` directory of your application directory. Find the stores entry that will look like the following:

```{
  "name": "store",
  "base": "PersistedModel",
  "properties": {
    "opendate": {
      "type": "date",
      "required": true
    },
    "type_store": {
      "type": "string",
      "required": true
    },
    "latitude": {
      "type": "string",
      "required": true
    },
    "longitude": {
      "type": "string",
      "required": true
    }
  },
  "validations": [],
  "relations": {},
  "acls": [],
  "methods": []
}
```
As you can see, we have a model created and the properties we defined are assigned to the store model. The public field specifies that we want to expose this model to the world via a REST web service.

The mapping of the model to the datasource is defined in the model-config.json under the app root/server folder. The datasource field specifies the datasource that this model will use for CRUD operations.

```{
  "name": "store",
  "base": "PersistedModel",
  "properties": {
    "opendate": {
      "type": "date",
      "required": true
    },
    "type_store": {
      "type": "string",
      "required": true
    },
    "latitude": {
      "type": "string",
      "required": true
    },
    "longitude": {
      "type": "string",
      "required": true
    }
  },
  "validations": [],
  "relations": {},
  "acls": [],
  "methods": []
}
```
As you can see, we have a model created and the properties we defined are assigned to the store model. The public field specifies that we want to expose this model to the world via a REST web service.

The mapping of the model to the datasource is defined in the `model-config.json` under the app root/server folder. The datasource field specifies the datasource that this model will use for CRUD operations.

```js
"store": {
    "dataSource": "mymongo",
    "public": true
  }
```
## **Step 8: Test out the REST based API**

Guess what?  You have just created your first REST based web service using Node.js. That wasn’t so bad was it?  Let’s check it out by pointing our browser to the application that we just created. You can do this by going to the following URL:

<http://0.0.0.0:3000/api/stores/>

You will be presented with a JSON representation of all of the Walmart stores that we imported into the database as shown in the following image:

<img class="aligncenter size-full wp-image-19619" src="https://strongloop.com/wp-content/uploads/2014/08/slnodephpapi1.png" alt="slnodephpapi1" width="951" height="971" srcset="https://strongloop.com/wp-content/uploads/2014/08/slnodephpapi1.png 951w, https://strongloop.com/wp-content/uploads/2014/08/slnodephpapi1-293x300.png 293w, https://strongloop.com/wp-content/uploads/2014/08/slnodephpapi1-36x36.png 36w, https://strongloop.com/wp-content/uploads/2014/08/slnodephpapi1-450x459.png 450w" sizes="(max-width: 951px) 100vw, 951px" />

## **Using the StrongLoop Explorer**

Well, that’s great.  We have a REST endpoint that will return all of the Walmart stores in the database but things seem to still be lacking a bit as we don’t have a management interface to work with the data or to verify that all of the CRUD operations are working.  Fortunately, StrongLoop provides a convenient browser that will let you explore all of the endpoints that your application has.  To test this out, open up your browser and go to the following URL:

<http://0.0.0.0:3000/explorer/>

Once the Explorer page has loaded, expand the `stores` API to see all of the available operations that are permitted on the model object.  This is shown in the following image:

<img class="aligncenter size-large wp-image-19620" src="https://strongloop.com/wp-content/uploads/2014/08/Screen-Shot-2014-08-18-at-8.26.26-PM-1030x627.png" alt="Screen Shot 2014-08-18 at 8.26.26 PM" width="1030" height="627" srcset="https://strongloop.com/wp-content/uploads/2014/08/Screen-Shot-2014-08-18-at-8.26.26-PM-1030x627.png 1030w, https://strongloop.com/wp-content/uploads/2014/08/Screen-Shot-2014-08-18-at-8.26.26-PM-300x182.png 300w, https://strongloop.com/wp-content/uploads/2014/08/Screen-Shot-2014-08-18-at-8.26.26-PM-1500x913.png 1500w, https://strongloop.com/wp-content/uploads/2014/08/Screen-Shot-2014-08-18-at-8.26.26-PM-450x273.png 450w, https://strongloop.com/wp-content/uploads/2014/08/Screen-Shot-2014-08-18-at-8.26.26-PM.png 1600w" sizes="(max-width: 1030px) 100vw, 1030px" />

As an example of what you can do with the Explorer, expand the `/stores/findOne` API and click on the `Try it out!` link which will query the database and return one record as shown in the following image:

<img class="aligncenter size-large wp-image-19621" src="https://strongloop.com/wp-content/uploads/2014/08/slnodephpexplorer2-815x1030.png" alt="slnodephpexplorer2" width="815" height="1030" srcset="https://strongloop.com/wp-content/uploads/2014/08/slnodephpexplorer2-815x1030.png 815w, https://strongloop.com/wp-content/uploads/2014/08/slnodephpexplorer2-237x300.png 237w, https://strongloop.com/wp-content/uploads/2014/08/slnodephpexplorer2-450x568.png 450w, https://strongloop.com/wp-content/uploads/2014/08/slnodephpexplorer2.png 865w" sizes="(max-width: 815px) 100vw, 815px" />

## **Taking things a bit further by adding a map representation**

Awesome, we have a created a REST based endpoint that will return a list of all of the Walmart stores in our database. To further illustrate the speed with which one can develop full applications with StrongLoop, let’s build a responsive front end that contains a map with pins for every Walmart store.

## **Step 1: Create the public directory**

By default, as specified in the app.js file of the project, any files in the public directory located in the applications root directory will be served to the requestor. However, this directory may not exist by default so we need to create it. Open up your terminal and change to the root directory of your application and issue the following command:

```sh
$ mkdir public
```
## **Step 2: Create the responsive map**

The next thing we need to do is create a nice representation of the data. Since we have the latitude and longitude of every store, it would be great to express this content with a map that the user can drag around, zoom in and out of, etc. This tasks is actually much easier than you might expect if we take advantage of some existing libraries. At the end of creating this responsive view, the result will look like the following:

<img class="aligncenter size-large wp-image-19625" src="https://strongloop.com/wp-content/uploads/2014/08/slnodephpmap1-1030x883.png" alt="slnodephpmap1" width="1030" height="883" srcset="https://strongloop.com/wp-content/uploads/2014/08/slnodephpmap1-1030x883.png 1030w, https://strongloop.com/wp-content/uploads/2014/08/slnodephpmap1-300x257.png 300w, https://strongloop.com/wp-content/uploads/2014/08/slnodephpmap1-450x385.png 450w, https://strongloop.com/wp-content/uploads/2014/08/slnodephpmap1.png 1278w" sizes="(max-width: 1030px) 100vw, 1030px" />

Furthermore, the user will be able to zoom in to a very detailed level of the map to view the closest Walmart as shown in the following image:

<img class="aligncenter size-large wp-image-19626" src="https://strongloop.com/wp-content/uploads/2014/08/slnodephpmap2-1030x848.png" alt="slnodephpmap2" width="1030" height="848" srcset="https://strongloop.com/wp-content/uploads/2014/08/slnodephpmap2-1030x848.png 1030w, https://strongloop.com/wp-content/uploads/2014/08/slnodephpmap2-300x247.png 300w, https://strongloop.com/wp-content/uploads/2014/08/slnodephpmap2-450x370.png 450w, https://strongloop.com/wp-content/uploads/2014/08/slnodephpmap2.png 1276w" sizes="(max-width: 1030px) 100vw, 1030px" />

The code for the web view of the application takes advantage of the longitude and latitude properties that we defined on our model object and imported into the database.  We will also use the popular [Leaflet](http://leafletjs.com/) library for creating the map and placing the pins, or markers, on the map.

To create this map, create a new file in the public directory named `locatewalmart.html` and add the following JavaScript code:

```&lt;!doctype html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
  &lt;title&gt;Walmart Stores&lt;/title&gt;
  	&lt;link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.5.1/leaflet.css" /&gt;
	&lt;!--[if lte IE 8]&gt;
    	&lt;link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.5.1/leaflet.ie.css" /&gt;
	&lt;![endif]--&gt;
	&lt;script src="https://code.jquery.com/jquery-2.0.0.min.js"&gt;&lt;/script&gt;
	&lt;link href='http://fonts.googleapis.com/css?family=oswald' rel='stylesheet' type='text/css'&gt;
	&lt;meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" /&gt;	&lt;style type="text/css"&gt;
		body {
    		padding: 0;
		    margin: 0;
		}
		html, body, #map {
		    height: 100%;
		    font-family: 'oswald';
		}
		.leaflet-container .leaflet-control-zoom {
		    margin-left: 13px;
		    margin-top: 70px;
		}
		#map { z-index: 1;}
		#title { z-index: 2; position: absolute; left: 10px; }
	&lt;/style&gt;

&lt;/head&gt;
&lt;body&gt;
	&lt;h1 id="title"&gt;Walmart Stores&lt;/h1&gt;
	&lt;div id="map"&gt;&lt;/div&gt;
	&lt;script src="http://cdn.leafletjs.com/leaflet-0.5.1/leaflet.js"&gt;&lt;/script&gt;
	&lt;script&gt;
		center = new L.LatLng(39.83, -98.58);
		zoom = 5;
		var map = L.map('map').setView(center, zoom);
		var markerLayerGroup = L.layerGroup().addTo(map);
		L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Map data &copy; &lt;a href="http://openstreetmap.org"&gt;OpenStreetMap&lt;/a&gt; contributors, &lt;a href="http://creativecommons.org/licenses/by-sa/2.0/"&gt;CC-BY-SA&lt;/a&gt;'
		}).addTo(map);
		function getPins(e){
			url = "http://0.0.0.0:3000/api/stores";
			$.get(url, pinTheMap, "json")
		}
		function pinTheMap(data){
			//clear the current pins
			map.removeLayer(markerLayerGroup);
			//add the new pins
			var markerArray = [];
			var lastNumber = 0;
			for (var i = 0; i &lt; data.length; i++){
				store = data[i];
				if(store.latitude.length &gt; 0 && store.longitude.length&gt;0) {
					markerArray.push(L.marker([store.latitude, store.longitude]));
				}		
			}
			markerLayerGroup = L.layerGroup(markerArray).addTo(map);
		}
		map.whenReady(getPins)
	&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;
```
<p dir="ltr">
  As you can see, the code is just standard HTML and JavaScript.  The interesting part is the getPins(e) function where we make a REST call to the API that we created previously in this blog post.  We then iterate over each store and create a pin given the latitude and longitude of each store.  Pretty nifty, huh?
</p>

<h2 dir="ltr">
  <strong>Conclusion</strong>
</h2>

<p dir="ltr">
  In this blog post I showed you how to create a REST based web service that returns a list of Walmart stores in the United States.  After we created the web service using Loopback, we added a front end representation of the data.  With very little work, we were able to develop a fully functioning application much faster than one might be able to with their current language of choice.  We also discussed some of the similarities between Node.js and PHP.  While I still consider PHP to be a great language, I have personally found that Node.js makes a great next language to learn given the rich ecosystem of libraries and speed with which I am able to create applications.
</p>

<p dir="ltr">
  I have included a quick table that you can reference when comparing Node.js with PHP.
</p>

<div dir="ltr">
  <table>
    <colgroup> <col width="*" /> <col width="*" /> <col width="*" /></colgroup> <tr>
      <td>
        <p dir="ltr">
          Feature
        </p>
      </td>

      <td>
        <p dir="ltr">
          PHP
        </p>
      </td>

      <td>
        <p dir="ltr">
          Node.js
        </p>
      </td>
    </tr>

    <tr>
      <td>
        <p dir="ltr">
          Great IDE
        </p>
      </td>

      <td>
        <p dir="ltr">
          Yes, multiple choice with IntelliJ, Zend Studio, Netbeans, etc
        </p>
      </td>

      <td>
        <p dir="ltr">
          Yes, multiple choices including Eclipse, Visual Studio, Codenvy, etc
        </p>
      </td>
    </tr>

    <tr>
      <td>
        <p dir="ltr">
          Dependency Management
        </p>
      </td>

      <td>
        <p dir="ltr">
          Composer, PEAR
        </p>
      </td>

      <td>
        <p dir="ltr">
          NPM
        </p>
      </td>
    </tr>

    <tr>
      <td>
        <p dir="ltr">
          Enterprise Ready
        </p>
      </td>

      <td>
        <p dir="ltr">
          Yes
        </p>
      </td>

      <td>
        <p dir="ltr">
          Yes
        </p>
      </td>
    </tr>

    <tr>
      <td>
        <p dir="ltr">
          Large ecosystem of libraries
        </p>
      </td>

      <td>
        <p dir="ltr">
          Yes, but sometimes hard to find
        </p>
      </td>

      <td>
        <p dir="ltr">
          Yes
        </p>
      </td>
    </tr>

    <tr>
      <td>
        <p dir="ltr">
          Common Frameworks
        </p>
      </td>

      <td>
        <p dir="ltr">
          CodeIgniter, CakePHP, Laravel, etc
        </p>
      </td>

      <td>
        <p dir="ltr">
          Express, Meteor, etc
        </p>
      </td>
    </tr>

    <tr>
      <td>
        <p dir="ltr">
          Database support
        </p>
      </td>

      <td>
        <p dir="ltr">
          Yes
        </p>
      </td>

      <td>
        <p dir="ltr">
          Yes
        </p>
      </td>
    </tr>

    <tr>
      <td>
        <p dir="ltr">
          Non-blocking IO
        </p>
      </td>

      <td>
        <p dir="ltr">
          No
        </p>
      </td>

      <td>
        <p dir="ltr">
          Yes
        </p>
      </td>
    </tr>

    <tr>
      <td>
        <p dir="ltr">
          Testing frameworks
        </p>
      </td>

      <td>
        <p dir="ltr">
          Yes
        </p>
      </td>

      <td>
        <p dir="ltr">
          Yes
        </p>
      </td>
    </tr>

    <tr>
      <td>
        <p dir="ltr">
          Real-time applications
        </p>
      </td>

      <td>
        <p dir="ltr">
          Yes, with additional processes such as Apache WebSocket etc.
        </p>
      </td>

      <td>
        <p dir="ltr">
          Yes
        </p>
      </td>
    </tr>

    <tr>
      <td>
        <p dir="ltr">
          Built in web server
        </p>
      </td>

      <td>
        <p dir="ltr">
          No, most people use in conjunction with Apache
        </p>
      </td>

      <td>
        <p dir="ltr">
          Yes
        </p>
      </td>
    </tr>
  </table>
</div>

&nbsp;

## **[What’s next?](http://strongloop.com/get-started/)**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What’s new in the latest Node v0.12 release? <a href="http://strongloop.com/node-js/whats-new-in-node-js-v0-12/">Big performance optimizations</a>, read <a href="https://github.com/bnoordhuis">Ben Noordhuis’</a> blog to learn more.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js <a href="http://strongloop.com/node-js/loopback/">LoopBack framework</a>. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Need <a href="http://strongloop.com/node-js-support/expertise/">training and certification</a> for Node? Learn more about both the private and public options StrongLoop offers.</span>
</li>

&nbsp;

&nbsp;
