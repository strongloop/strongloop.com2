---
id: 20399
title: 'Node.js API Tip: GeoLocation'
date: 2014-10-03T08:10:13+00:00
author: Shubhra Kar
guid: http://strongloop.com/?p=20399
permalink: /strongblog/node-js-api-geolocation/
categories:
  - API Tip
  - LoopBack
  - Mobile
---
In the rapidly evolving data analytics space that is driving renewed IT and marketing spend, one of the key metrics is end user tracking is&#8230;

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Who are you (Identity)?</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What are you entitled to (Access)?</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">How are you (Wellness)?</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Which things draw/drive your attention (Behavior Patterns)</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">“Where are you?” (Location)</span>
</li>

Every location based app out there wants your mobile phone or wearable to tell it where you are. This is achieved with a small bit of technology called “geolocation.&#8221; &#8220;Where are you?” &#8211;  is what we&#8217;ll focus on in this blog post.

## **How does geolocation work?**

In general, mobile apps with geolocation capabilities do two things:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">They report your location to other users</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">They associate real-world locations to things like events, points of interests (ATMs, stores, restaurants, etc) to your location.</span>
</li>

There are two mechanisms currently used to determine geolocation. One is based on radio frequency location and second on IP/Mac address type information.

Geolocation for mobile and GPS traditionally use [radio frequency (RF) location](http://en.wikipedia.org/wiki/Radio_navigation) methods, for example Time Difference Of Arrival ([TDOA](http://en.wikipedia.org/wiki/TDOA)) for precision. TDOA systems often utilize mapping displays or other [geographic information systems](http://en.wikipedia.org/wiki/Geographic_information_system).

<img class="aligncenter size-full wp-image-20400" src="https://strongloop.com/wp-content/uploads/2014/10/firedepartment-screen1.jpg" alt="firedepartment-screen1" width="394" height="548" srcset="https://strongloop.com/wp-content/uploads/2014/10/firedepartment-screen1.jpg 394w, https://strongloop.com/wp-content/uploads/2014/10/firedepartment-screen1-215x300.jpg 215w" sizes="(max-width: 394px) 100vw, 394px" />

Smartphones have a richer geolocation experience than desktops because of the real-time feedback services to the location. Usually they have an embedded GPS chip which uses satellite data to calculate your exact position, which services such as Google Maps can then map. When a GPS signal is unavailable, geolocation apps can use information from cell towers to triangulate your approximate position. Some hybrid techniques have evolved recently like Assisted GPS ([A-GPS](http://en.wikipedia.org/wiki/Assisted_GPS)) for higher accuracy.

<!--more-->

Internet and computer geolocation can be performed by associating a geog[r](http://www.techhive.com/article/192803/geolo.html#)aphic location with the Internet Protocol (IP) address, MAC address, RFID, embedded hardware article/software number.

<img class="aligncenter size-full wp-image-20401" src="https://strongloop.com/wp-content/uploads/2014/10/StrongLoop_Pic.jpg" alt="StrongLoop_Pic" width="1076" height="772" srcset="https://strongloop.com/wp-content/uploads/2014/10/StrongLoop_Pic.jpg 1076w, https://strongloop.com/wp-content/uploads/2014/10/StrongLoop_Pic-300x215.jpg 300w, https://strongloop.com/wp-content/uploads/2014/10/StrongLoop_Pic-1030x738.jpg 1030w, https://strongloop.com/wp-content/uploads/2014/10/StrongLoop_Pic-450x322.jpg 450w" sizes="(max-width: 1076px) 100vw, 1076px" />

Geolocation usually works by automatically looking up an IP address on a WHOIS service and retrieving the registrant&#8217;s physical address.

IP address location data can include information such as country, region, city, postal/zip code, latitude, longitude and timezone.

In this post we won&#8217;t cover native (iPhone, Android) navigator capabilities, instead we&#8217;ll focus on a more generic solution for JavaScript developers.

<h2 dir="ltr">
  How can I get started as a JavaScript developer ?
</h2>

Most modern browsers like Firefox, Internet Explorer, Safari, Chrome, and Opera have geolocation API support. Chrome even has support for the [World Geodetic System (WGS 84)](http://en.wikipedia.org/wiki/WGS84) navigation system, which is the reference coordinate system for GPS.

These geolocation APIs center around a new property on the global navigator object: `navigator.geolocation`. The API is designed to enable both &#8220;one-shot&#8221; position requests and repeated position updates, as well as the ability to explicitly query the cached positions. Location information is represented by latitude and longitude coordinates.

The simplest use of the geolocation API looks like this:

```js
function showMap(position) {
// Show a map centered at (position.coords.latitude, position.coords.longitude).
}

// Snapshot position request.
navigator.geolocation.getCurrentPosition(showMap);
```

As you&#8217;d expect, privacy is a first class citizen for the geolocation API. What this means is that geolocation support is “opt-in” by default. The browser will never force you to reveal your current physical location to a remote server without explicit permission. The user experience may differ slightly from browser to browser, but everyone has seen pop-up messages like this:

<img class="aligncenter size-full wp-image-20402" src="https://strongloop.com/wp-content/uploads/2014/10/image006.jpg" alt="image006" width="435" height="167" srcset="https://strongloop.com/wp-content/uploads/2014/10/image006.jpg 435w, https://strongloop.com/wp-content/uploads/2014/10/image006-300x115.jpg 300w" sizes="(max-width: 435px) 100vw, 435px" />

Calling the `getCurrentPosition()` function of the geolocation API will cause the browser to pop up an “infobar” at the top of the browser window providing the website name that is seeking to know your location. Thus letting you choose (opt-in) to share your location or deny sharing and allowing the browser to save your opt-in choice (share/don’t share).

A similar workflow is seen for mobile apps as well, but in this case the requester is the WiFi radio locator instead of the browser. Device notifications are similarly specific to platform and use mobile backend services like [APN](http://docs.strongloop.com/display/LB/Push+notifications+for+iOS+apps#PushnotificationsforiOSapps-ConfigureAPNpushsettingsinyourserverapplication) for iOS as an example

<img class="aligncenter size-full wp-image-20403" src="https://strongloop.com/wp-content/uploads/2014/10/1-pop-up.png" alt="1-pop-up" width="320" height="480" srcset="https://strongloop.com/wp-content/uploads/2014/10/1-pop-up.png 320w, https://strongloop.com/wp-content/uploads/2014/10/1-pop-up-200x300.png 200w" sizes="(max-width: 320px) 100vw, 320px" />

Codewise, we just invoked a single function call which takes a callback function (which is called show_map). The call to `getCurrentPosition()` returns immediately, but without access to the user’s location. Access to the location/position data is in the callback function. The callback function looks like this:

```js
function show_map(position) {
 var latitude = position.coords.latitude;
 var longitude = position.coords.longitude;
 // let's show a map or do something interesting!
}
```

You can find comprehensive examples of recursive location/position updates, error handling, caching and more on [W3C spec for Geolocation API](http://dev.w3.org/geo/api/spec-source.html).

## **Can I get geolocation served as an API or a backend service  ?**

Increasingly mobile and app services are being rendered through universal backends providing device/platform/form factor independence on the client side. These backends are referred to as BaaS (Backend-as-a-Service) or mBaaS (mobile Backend-as-a-Service) in the case of mobile specific services that are exposed. Node.js has become technology of choice to build extremely fast, scalable and lightweight mBaaS primarily due to REST based data transfer, a huge ecosystem of data connectors and integration with frontend JavaScript stacks like Angular and Backbone. Also working in Node.js favor is its ability to interoperate using JSON models with NoSQL databases like MongoDB.

[LoopBack](http://loopback.io/) is the leading open source Node.js framework built on top of [express.js](http://expressjs.com/) middleware that can help you build your own mBaaS using [model-driven API development](http://strongloop.com/strongblog/node-js-api-tip-model-driven-development/). In addition to built in capabilities like ORM, object discovery, offline sync, replication and multi-channel (iOS, Android, Angular, HTML5) SDKs; geolocation and push notifications are available out of box. Loopback uses isomorphic JavaScript, essentially RPC/remoting capabilities and [browersify](http://browserify.org/) support to share definition and state of server side JavaScript/JSON data models written in Node.js with frontend JavaScript stacks.

## Let’s build geolocation as a service!

First, install the StrongLoop package

```sh
$ npm install -g strongloop
```

We will now get an example LoopBack app with pre-wired location and push notification services

```sh
$ slc loopback:example
```

We are then prompted by the LoopBack generator for a project structure. I am choosing the project name as _Rental\_Car\_App_

```sh
[?] Enter a directory name where to create the project: Rental_Car_App
```

The generator will pull down the required npm modules for scaffolding, data connection, API documentation and testing. Now we can simply change directory to the project

```sh
$ cd Rental_Car_App/
```

And boot up the API application using:

```sh
$ slc run
supervisor running without clustering (unsupervised)
Using the memory connector.
To specify another connector:
 `DB=oracle node .` or `DB=oracle slc run .`
 `DB=mongodb node .` or `DB=mongodb slc run .`
 `DB=mysql node .` or `DB=mysql slc run .`
Started the import of sample data.
Browse your REST API at http://localhost:3000/explorer
Web server listening at: http://localhost:3000/
```

For more advanced runtime commands like running daemonized, in-cluster mode, with log aggregation, with monitoring et all, please checkout the StrongLoop [Controller](http://strongloop.com/node-js/controller/) and [Perfromance Monitoring](http://strongloop.com/node-js/monitoring/) pages.

By default the Loopback API Server instance connects to an in-memory object store. You have options of connecting to relational datasources (Oracle, MySQL, PostgreSQL or SQL Server), NoSQL databases like MongoDB, services like REST and SOAP, or proprietary backends like Sharepoint, SAP, or ATG.

Opening a browser and running the URL <http://localhost:3000/explorer>, we instantaneously get our APIs running in [Swagger 2.0](http://strongloop.com/strongblog/enterprise-api-swagger-2-0-loopback/) interface with RPC/remoting built-in from the browser to the Node.js server.

<img class="aligncenter size-full wp-image-20404" src="https://strongloop.com/wp-content/uploads/2014/10/Screen-Shot-2014-10-02-at-7.16.07-AM.png" alt="Screen Shot 2014-10-02 at 7.16.07 AM" width="1600" height="603" srcset="https://strongloop.com/wp-content/uploads/2014/10/Screen-Shot-2014-10-02-at-7.16.07-AM.png 1600w, https://strongloop.com/wp-content/uploads/2014/10/Screen-Shot-2014-10-02-at-7.16.07-AM-300x113.png 300w, https://strongloop.com/wp-content/uploads/2014/10/Screen-Shot-2014-10-02-at-7.16.07-AM-1030x388.png 1030w, https://strongloop.com/wp-content/uploads/2014/10/Screen-Shot-2014-10-02-at-7.16.07-AM-1500x565.png 1500w, https://strongloop.com/wp-content/uploads/2014/10/Screen-Shot-2014-10-02-at-7.16.07-AM-450x169.png 450w" sizes="(max-width: 1600px) 100vw, 1600px" />

Here we see that APIs have been auto-created for _Car Rental_ services, which help detect cars, inventory, locations for dealerships, etc along with automatic API end-points for every CRUD and custom operations.

<img class="aligncenter size-full wp-image-20405" src="https://strongloop.com/wp-content/uploads/2014/10/Screen-Shot-2014-10-02-at-7.21.40-AM.png" alt="Screen Shot 2014-10-02 at 7.21.40 AM" width="1480" height="1218" srcset="https://strongloop.com/wp-content/uploads/2014/10/Screen-Shot-2014-10-02-at-7.21.40-AM.png 1480w, https://strongloop.com/wp-content/uploads/2014/10/Screen-Shot-2014-10-02-at-7.21.40-AM-300x246.png 300w, https://strongloop.com/wp-content/uploads/2014/10/Screen-Shot-2014-10-02-at-7.21.40-AM-1030x847.png 1030w, https://strongloop.com/wp-content/uploads/2014/10/Screen-Shot-2014-10-02-at-7.21.40-AM-450x370.png 450w" sizes="(max-width: 1480px) 100vw, 1480px" />

Clicking on the _Location_ API, we can see all endpoints. Of particular interest are _“GET /Locations”_ and _“GET /Locations/nearby&#8221;_.

We can click on the _“Try it out !”_ button under both these API endpoints. _GET /Locations_ returns us a list of all the rental car center/dealership locations.

<img class="aligncenter size-full wp-image-20406" src="https://strongloop.com/wp-content/uploads/2014/10/Screen-Shot-2014-10-02-at-7.23.44-AM.png" alt="Screen Shot 2014-10-02 at 7.23.44 AM" width="1446" height="1318" srcset="https://strongloop.com/wp-content/uploads/2014/10/Screen-Shot-2014-10-02-at-7.23.44-AM.png 1446w, https://strongloop.com/wp-content/uploads/2014/10/Screen-Shot-2014-10-02-at-7.23.44-AM-300x273.png 300w, https://strongloop.com/wp-content/uploads/2014/10/Screen-Shot-2014-10-02-at-7.23.44-AM-1030x938.png 1030w, https://strongloop.com/wp-content/uploads/2014/10/Screen-Shot-2014-10-02-at-7.23.44-AM-450x410.png 450w" sizes="(max-width: 1446px) 100vw, 1446px" />

In each physical location adhering to  the location model schema, following attributes are found returned as JSON objects. See one of the records below:

```js
{
   "id": "100",
   "street": "1659 Airport Blvd",
   "city": "San Jose",
   "name": "Dollar Rent A Car",
   "geo": {
     "lat": 37.365759,
     "lng": -121.9233569
   },
   "state": "CA",
   "country": "US",
   "phone": "(866) 434-2226"
 },
```

For more on modeling from scratch, visit <http://docs.strongloop.com/display/LB/Getting+started+with+LoopBack>

We can see that the geolocation is being calculated by the server and would be great we query nearby rental car centers based on a particular geolocation.

<img class="aligncenter size-full wp-image-20407" src="https://strongloop.com/wp-content/uploads/2014/10/Screen-Shot-2014-10-02-at-7.36.18-AM.png" alt="Screen Shot 2014-10-02 at 7.36.18 AM" width="1446" height="1276" srcset="https://strongloop.com/wp-content/uploads/2014/10/Screen-Shot-2014-10-02-at-7.36.18-AM.png 1446w, https://strongloop.com/wp-content/uploads/2014/10/Screen-Shot-2014-10-02-at-7.36.18-AM-300x264.png 300w, https://strongloop.com/wp-content/uploads/2014/10/Screen-Shot-2014-10-02-at-7.36.18-AM-1030x908.png 1030w, https://strongloop.com/wp-content/uploads/2014/10/Screen-Shot-2014-10-02-at-7.36.18-AM-450x397.png 450w" sizes="(max-width: 1446px) 100vw, 1446px" />

Here I am passing a geolocation as a query in terms of latitude and longitude and a Distance To query parameter, which is “5 miles” from that geopoint. In the result set, I get back a list of all rental car centers in a 5 mile radius from the specified lat/long.

WOW ! that was slick, but how much code do I need to write ?

Not much. Once location is embedded in a model, Loopback framework takes care of all the compute, filter, pagination,  middleware wiring and rendering. Here is the code snippet that makes geopoint work for finding coffee shops near a physical location (lat/long pair).

```sh
var here = new GeoPoint({lat: 10.32424, lng: 5.84978});
CoffeeShop.find( {where: {location: {near: here}}, limit:3}, function(err, nearbyShops) {
console.info(nearbyShops); // [CoffeeShop, ...]
});
```

<h4 dir="ltr">
  geoPoint.distanceBetween(pointA, pointB, options)
</h4>

Determine the spherical distance between two GeoPoints.

<h4 dir="ltr">
  geoPoint.distanceTo(point, options)
</h4>

Determine the spherical distance to the given point. Example:

```js
var here = new GeoPoint({lat: 10, lng: 10});
var there = new GeoPoint({lat: 5, lng: 5});
GeoPoint.distanceBetween(here, there, {type: 'miles'}) // 438
```

<h4 dir="ltr">
  geoPoint.toString()
</h4>

Simple serialization.

For more details please check out <http://docs.strongloop.com/display/LB/GeoPoint+class>.

These APIs now can be surfaced into a mobile or JavaScript app using out of box client SDKs or direct remoting calls. Below is an example of the _Rental Car_ app using these backend APIs.

<img class="aligncenter size-full wp-image-20411" src="https://strongloop.com/wp-content/uploads/2014/10/Screen-Shot-2014-10-03-at-8.17.20-AM.png" alt="Screen Shot 2014-10-03 at 8.17.20 AM" width="523" height="333" srcset="https://strongloop.com/wp-content/uploads/2014/10/Screen-Shot-2014-10-03-at-8.17.20-AM.png 523w, https://strongloop.com/wp-content/uploads/2014/10/Screen-Shot-2014-10-03-at-8.17.20-AM-300x191.png 300w, https://strongloop.com/wp-content/uploads/2014/10/Screen-Shot-2014-10-03-at-8.17.20-AM-450x286.png 450w" sizes="(max-width: 523px) 100vw, 523px" />