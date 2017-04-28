---
id: 25112
title: 'Use LoopBack&#8217;s Geolocation Feature to Build a Simple Node.js User Registration App'
date: 2015-06-03T08:00:36+00:00
author: Roberto Rojas
guid: https://strongloop.com/?p=25112
permalink: /strongblog/loopback-geolocation-node-js-user-registration-app/
categories:
  - How-To
  - LoopBack
---
If you&#8217;ve been looking for a framework to help you get your REST APIs up and running quickly, with a robust set of functionality and flexibility, then the LoopBack Framework is what you want. This framework helps developers create APIs that integrate with legacy systems, Cloud APIs, while enabling micro service architectures, mobile services, and much more. A lot of this functionality can be easily managed either with the [slc command line tools](http://docs.strongloop.com/pages/viewpage.action?pageId=3834790) or the visual tool called [StrongLoop Arc](https://strongloop.com/node-js/arc/).

In this post, I’ll show you how to build a simple self registration application using the Loopback framework with authentication and geolocation capabilities built-in. The application utilizes the following features of the LoopBack framework:

  * Authentication
  * Geolocation support
  * MongoDB connector
  * AngularJS SDK

The finished example application can be found on [GitHub](https://github.com/robertojrojas/self-registration-loopback).

## **Prerequisites**

  * [Node.js](http://nodejs.org) v0.12.2 or greater / [io.js](http://iojs.org) 1.8.1 or greater
  * [LoopBack](https://strongloop.com/get-started/): This one is easy! Just run `npm install -g strongloop`
  * [MongoDB](https://www.mongodb.org/) running locally
  * A basic understanding of [AngularJS](https://angularjs.org/)

##

## **The Self Registration API**

The REST API for this application provides user creation, user authentication, ability for the user to save preferences (i.e&#8230; street address), and backend Geolocation functionality to get the weather for the street address specified by the user.

I decided to create a model called \`Subscriber\`. For this, I take advantage of how easy the [LoopBack Model Generator](http://docs.strongloop.com/display/public/LB/Model+generator). This model will extend the built-in \`User\` model. Since the User model is based on the [PersistedModel](http://docs.strongloop.com/display/public/LB/PersistedModel+REST+API), our \`Subscriber\` model will be filled with all the REST CRUD goodies for free.

I added two properties to the \`Subscriber\` model:

  * **preferences:** This property is of type object, which means we can store embedded properties. We store the street, city, zipcode, and temperature properties.
  * **geo:** This property is of type geopoint. We store the latitude and longitude corresponding to the address stored in the preferences property.

##

## **Steps for Creating the Application**

Now, we’ll create our application using the \`slc loopback application generator\`.

```sh
> $ slc loopback

     _-----_
    |       |    .--------------------------.
    |--(o)--|    |  Let's create a LoopBack |
   `---------´   |   	application!   	|
    ( _´U`_ )    '--------------------------'
    /___A___\
 	 |  ~  |
   __'.___.'__
´   `  |° ´ Y `

?  What's the name of your application? self-registration-loopback
? Enter name of the directory to contain the project: loself-registration-loopback
create self-registration-loopback/info
change the working directory to self-registration-loopback

```

Install the following supporting Node modules:

```js
$ npm install --save loopback-connector-mongodb
$ npm install --save loopback-connector-rest
$ npm install --save function-rate-limit

```

These modules are used directly and indirectly within the code and/or the LoopBack Framework. The [loopback-connector-mongodb](https://github.com/strongloop/loopback-connector-mongodb) Data module is used internally by the LoopBack Framework to provide access to the MongoDB database. The [loopback-connector-rest](https://github.com/strongloop/loopback-connector-rest) Integration module is used internally by the LoopBack Framework to provide access to existing system that expose APIs through common enterprise and web interfaces. Further information on LoopBack connectors can be found in the [documentation](http://docs.strongloop.com/display/public/LB/LoopBack).

The [function-rate-limit](https://www.npmjs.com/package/function-rate-limit) module is used by the sample to code due to a limit of requests per second imposed by the Google Maps API. You’ll find the use of this module in the \`loopkupGeo\` function expression in the \`common/modules/Subscriber.js file\`.

## **Creating the Backend DataSource Definition**

Assuming the MongoDB server is [installed](http://docs.mongodb.org/getting-started/shell/installation/) and up and running, let&#8217;s configure the mongoDBDs datasource. We are going to use the previously installed [loopback-connector-mongodb](https://github.com/strongloop/loopback-connector-mongodb) connector. Once again using the extremely useful \`slc\` from the command line we’ll tell slc that we want to create a new datasource.

```sh
$ slc loopback:datasource
   ?  Enter the data-source name: mongoDBDs
   ? Select the connector for mongoDBDs:
     Kafka (provided by community)
     SAP HANA (provided by community)
     Couchbase (provided by community)
     other
     In-memory db (supported by StrongLoop)
     Email (supported by StrongLoop)
   ❯ MongoDB (supported by StrongLoop)
    (Move up and down to reveal more choices)

```

Edit the file \`server/datasource.json\` file to update the \`mongoDBDs\` entry to look like the snippet below. Of course, you’ll want to use whatever credentials you need for your actual MongoDB datasource!

```js
{
...
 "mongoDBDs": {
   "host": "localhost",
   "port": 27017,
   "database": "SelfRegistration",
   "username": "",
   "password": "",
   "name": "mongoDBDs",
   "connector": "mongodb"
 },

```

## **Creating the REST Connectors Definition**

It’s time to create our REST connector definitions. Let’s configure the Google GeoCode API Rest Connector:

```js
$ slc loopback:datasource geo
? Enter the data-source name: geo
? Select the connector for geo: REST services (supported by StrongLoop)

```

Edit the \`server/datasources.json\` file again and update the \`geo\` data source entry to look like this:

```js
"geo": {
 "name": "geo",
 "connector": "rest",
 "operations": [
   {
     "template": {
       "method": "GET",
       "url": "http://maps.googleapis.com/maps/api/geocode/{format=json}",
       "headers": {
         "accepts": "application/json",
         "content-type": "application/json"
       },
       "query": {
         "address": "{street},{city},{zipcode}",
         "sensor": "{sensor=false}"
       },
       "responsePath": "$.results[0].geometry.location"
     },
     "functions": {
       "geocode": [
         "street",
         "city",
         "zipcode"
       ]
     }
   }
 ]
},

```

Now we need to configure the OpenWeather API Rest Connector:

```sh
$ slc loopback:datasource openweathermap
? Enter the data-source name: openweathermap
? Select the connector for openweathermap: REST services (supported by StrongLoop)
```

Edit the \`server/datasources.json\` file once more and update the openweathermap datasource entry to look like this:

```js
"openweathermap": {
 "name": "openweathermap",
 "connector": "rest",
 "debug": true,
 "operations": [
   {
     "template": {
       "method": "GET",
       "url": "http://api.openweathermap.org/data/2.5/forecast/daily",
       "headers": {
         "accepts": "application/json",
         "content-type": "application/json"
       },
       "query": {
         "lat": "{lat}",
         "lon": "{lon}",
         "units": "{units}"
       },
       "responsePath": "$.list"
     },
     "functions": {
       "getweather": [
         "lat",
         "lon",
         "units"
       ]
     }
   }
 ]
}
```

## **Creating the Subscriber Model**

There are different way to create models. The easiest way is using the [module generator](http://docs.strongloop.com/display/public/LB/Using+the+model+generator) tool. This tool will prompt you for information about the type of module you want to create, persistence type, properties, among other things, and generate javascript and json files corresponding to your model. For further information about creating modules can be found in this [section](http://docs.strongloop.com/display/public/LB/Creating+models) of the documentation.

We need to create a Subscriber model with the following characteristics and properties:

  * The model will extend the built-in User model.
  * A property named ‘preferences’ of type ‘object’. We used the type object so we have the flexibility to add json attributes within this property.
  * A property named ‘geo’ of type geopoint. We use the geopoint to store latitude and longitude values.
  * Attach the model to the data-source ‘mongoDBDs’.
  * We do want to expose as a REST API.

The following steps show you how to the create the Subscriber model:

```js
- slc loopback:model Subscriber
? Enter the model name: Subscriber
? Select the data-source to attach Subscriber to: mongoDBDs (mongodb)
? Select model's base class: User
? Expose Subscriber via the REST API? Yes
? Custom plural form (used to build REST URL):
Let's add some Subscriber properties now.

Enter an empty property name when done.
? Property name: preferences
   invoke   loopback:property
? Property type: object
? Required? No

Let's add another Subscriber property.
Enter an empty property name when done.
? Property name: geo
   invoke   loopback:property
? Property type: geopoint
? Required? No
```

The tool generates the following files: subscriber.js and subscriber.json. These files can found in the /common/models directory. The subscriber.js javascript file is where all our logic will reside. The subcriber.json file contains information about the model name, properties, validation, relations, acl, etc…

## **Extending the API**

The LoopBack Framework provides the standard CRUD REST operations for the models. We need to extend the API to intercept the save calls for the Subscriber model as well as a remote method to get the weather data corresponding to the address stored in the preferences property.

When the Subscriber preferences are saved we intercept the street, city, and zipcode right before they&#8217;re saved and perform a lookup using the LoopBack REST connector to access the Google Geocode API. This API will provide us with the latitude and longitude for that address. The latitude and longitude will be stored in the ‘geo’ property.

To accomplish this we use a Remote Hook. A remote hook is simply a function that gets executed before or after a remote method or endpoint. We use the beforeRemote(), which runs before the operation we would like to hook on. For example:

The &#8216;prototype.updateAttributes&#8217; action gets called when the Subscriber object is saved. In our remote hook we perform the geo lookup before the object is saved.

```js
Subscriber.beforeRemote('prototype.updateAttributes', function(ctx, user, next) {
  // do whatever you need to, then call:
  next();
});
```

The _lookupGeo_ function will perform an http request using the Google&#8217;s Geocode API. We&#8217;re using the _&#8216;function-rate-limit&#8217;_ module here to overcome the 10 requests per second imposed by the API.

```js
var lookupGeo = require('function-rate-limit')(5, 1000, function() {
  ...
 });

 Subscriber.beforeRemote('prototype.updateAttributes', function(ctx, user, next) {
    ….
     lookupGeo(loc.street, loc.city, loc.zipcode,
       ….
   });
   ….
 });

```

Next, we added a Remote Method to &#8216;getWeather&#8217;. Basically, this remote method is used to extend the standard REST CRUD methods and the model&#8217;s behavior.

The Subscriber.getWeather function is used to extend the Subscriber&#8217;s REST API to add remote method that will allows to get the weather for the previously stored Geolocation.

```js
Subscriber.getWeather = function(subscriberId, cb){
   ….   
 };

 Subscriber.remoteMethod('getWeather', {
   accepts: [
     {arg: 'id', type: 'string', required: true}
   ],
   http: {path: '/:id/weather', verb: 'get'},
   returns: {arg: 'weather', type: 'object'}
 });

};
```

## **Security Changes for the API**

Since we only want to get the weather for the authenticated user, we need to add an ACL

for the remote method. An ACL is an access control list used by LoopBack to enforce restrictions to data provided by models. The ACL indicates what type of authority is needed to access CRUD operations or Remote methods of the models. For more information, see Controlling data access.

Once again the slc tool is used to create an ACL to the Subscriber.getWeather remote method. We use the following criteria for the ACL:

  * Subscriber model
  * Single method ACL scope
  * Applied to the method ‘getWeather’
  * The user owning the object
  * Explicit grant access

```js
slc loopback:acl
? Select the model to apply the ACL entry to: Subscriber
? Select the ACL scope: A single method
? Enter the method name: getWeather
? Select the role: The user owning the object
? Select the permission to apply: Explicitly grant access
```

Finally, we need to stop exposing the built-in \`User\` model. By default the \`User\` model will be created and expose thru the REST API. Since we don&#8217;t use this model from the client, we&#8217;ll just disable it by adding the property &#8220;public&#8221;: false to the model in the \`server/model-config.json\` file:

```js
"User": {
 "dataSource": "db",
 "public": false
},

```

##

## **Create the AngularJS Client**

Another cool feature of the LoopBack framework is the [AngularJS SDK](http://docs.strongloop.com/display/public/LB/AngularJS+JavaScript+SDK). It provides facilities to generate \`$resource\` services corresponding to the REST API we

generated from the models. The following steps would take care of generating the AngularJS services.

```sh
$ mkdir -p client/app/services

$ lb-ng server/server.js client/app/services/lb-services.js
Loading LoopBack app "self-registration-loopback/server/server.js"
Generating "lbServices" for the API endpoint "/api"
Warning: scope User.accessTokens targets class "AccessToken", which is not exposed
via remoting. The Angular code for this scope won't be generated.
Warning: scope Subscriber.accessTokens targets class "AccessToken", which is not exposed
via remoting. The Angular code for this scope won't be generated.
Saving the generated services source to "self-registration-loopback/client/app/services/lb-services.js"

```

The \`lb-ng\` tool generated the \`app/client/app/services/lb-services.js\`. This file contains the Angular services corresponding to \`Subscriber\` REST CRUD API, plus remote method \`getWeather\`. The service will be proxied by the \`selfRegistrationLoopBackApi\` service. The idea behind this service is to shield the rest of the application of the low level REST calls to the backend. There are two controllers \`HomeCtrl\` and \`PreferencesCtrl\`. These controllers communicate with the \`selfRegistrationLoopBackApi\` to perform all the required functions like \`Authentication\`,\` getWeather\`, \`savePreferences\`.

The typical flow for user would be:

  * First time the user would signup or login if an account already exists.
  * The user can change the preferences (\`Address\`) in the preferences page.
  * In the landing page, the code will determine if the needs to get the weather for the authenticated user.

The following diagram depicts the design/architecture of the sample application:

<img class="aligncenter size-full wp-image-25130" src="{{site.url}}/blog-assets/2015/06/lb1.png" alt="lb1" width="975" height="732"  />

That’s it! If you curious to see how the rest of the AngularJS side was built, take a look at the finished application here on [GitHub](https://github.com/robertojrojas/self-registration-loopback).

Here is a [video](https://www.youtube.com/watch?v=3p90HjfYMUw) demonstrating how the application works:

[<img class="aligncenter size-full wp-image-25131" src="{{site.url}}/blog-assets/2015/06/lb2.png" alt="lb2" width="700" height="522"  />](https://www.youtube.com/watch?v=3p90HjfYMUw)

## **Conclusion**

As you can see it&#8217;s quite easy to get an application up and running with the LoopBack Framework. The framework documentation is excellent, updated frequently, and the [Getting Started with LoopBack](http://docs.strongloop.com/display/public/LB/Getting+started+with+LoopBack) and [Getting Started II](http://docs.strongloop.com/display/public/LB/Getting+started+part+II) tutorials are great resources to learn about the built-in features.

You can find the code for this example on [Github](https://github.com/robertojrojas/self-registration-loopback).

&nbsp;

&nbsp;
