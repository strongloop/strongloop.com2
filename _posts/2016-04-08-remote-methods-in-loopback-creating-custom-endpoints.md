---
id: 27163
title: 'Remote Methods in Loopback: Creating Custom Endpoints'
date: 2016-04-08T08:00:09+00:00
author: Alex Muramoto
guid: https://strongloop.com/?p=27163
permalink: /strongblog/remote-methods-in-loopback-creating-custom-endpoints/
categories:
  - How-To
  - LoopBack
---
One of the nicest features of Loopback is the ability to quickly expose existing [datasources (MySQL, MongoDB, Cloudant, etc.)](https://docs.strongloop.com/display/public/LB/Connecting+models+to+data+sources) as REST APIs with standard CRUD (create, retrieve, update and delete) support. But let’s be honest, that’s not really going to cut it. We need to do more than expose data. We need to extend these basic endpoints to expose additional functionality and application logic, while keeping the design of our API as clean as possible.

This is one area where the flexibility of Loopback really shines. Enter [remote methods](https://docs.strongloop.com/display/public/LB/Remote+methods).

<!--more-->

## What&#8217;s a Remote Method?

In short, remote methods add custom endpoints to existing models in your Loopback API. Let’s take a look at an example.

Suppose we have an inventory system that uses a NoSQL database to keep track of all the dogs we have in-stock (don&#8217;t worry, they&#8217;re treated very humanely while in storage). In this case, our API is going to have a `/dogs` endpoint that exposes a `Dog` model that looks something like this:

```js
{
  "id": 2
  "name": "Allie",
  "breed": "corgi",
  "location": {
    "aisle": 4, 
    "shelf": 2
  }
}

```

But what if we want to, say, have an endpoint that allows us to just get the location of a specific dog? Sure, we could set up our API to let us request this with a query:

```js
/dogs/:id?fields=location
```

But this is ugly and not a very straightforward design. We&#8217;d also have to add logic to check for this query on every request to `/dogs`. Not awesome. What would be preferable is something like:

```js
/dogs/:id/location
```

In doing this, we take advantage of the path structure of the URI to route our request, and create a clean endpoint that allows CRUD operations on just a dog&#8217;s location data. Luckily, this is very easy to set up in Loopback by registering a remote method.

## Registering a Remote Method

To start, we register a remote method with Loopback by attaching it to an existing model. In the case of our dog inventory, we have two files in `/common/models` that define our `Dog` model:

  * Dog.json
  * Dog.js

To register our remote method, we call the `remoteMethod` function in `Dog.js`. This function is available on all models extended from [`PersistedModel`](https://docs.strongloop.com/display/LB/PersistedModel+REST+API).

```js
module.exports = function(Dog){
    Dog.remoteMethod('location', {});
};

```

The first argument is the name of the Remote Method. This is also the endpoint Loopback will add by default to the model&#8217;s API. For example, the code above would automatically create the endpoint `/dogs/location`. We&#8217;ll fix that shortly.

The second argument is an object that contains settings for the remote method.

## Configuring a Remote Method

For our new dog location endpoint, we want to do a few things:

  1. Parse the dog&#8217;s `id` from the request URI.
  2. Enforce that the `id` is a number.
  3. Create a custom path that includes the `id`, i.e. `/:id/location`.
  4. Only allow `GET` requests on the new endpoint.
  5. Set that the endpoint returns an object with the dog&#8217;s location.

This is where the \`config\` object comes in. This object can include three optional properties:

  * \`accepts\`: the arguments accepted from the API request.
  * \`returns\`: what the API response returns.
  * \`http\`: a custom path, and what HTTP verbs are supported.

For our example, the \`config\` object will look like this:

```js
module.exports = function(Dog){
    Dog.remoteMethod(
    	'location', 
    	{
    	accepts: {arg: 'id', type: 'number', required: true},
        http: {path: '/:id/location', verb: 'get'},
        returns: {arg: 'location', type: 'Object'}
    	});
};				

```

Notice that we are able to do a lot of stuff here, like set the type of our accepted parameters and returned response, as well as include our accepted `id` parameter in our custom path. As a result, our API is now able to accept `GET` requests to the `/dogs/:id/location` endpoint, and will return a `location` object in the body of the response.

So now that we have the API in place, we need to add the application logic that will query our data source for a single instance of the `Dog` model with the matching `id`.

## Adding Application Logic

To add application logic to our custom endpoint, we attach a function with the same name as our remote method to the model:

```js
Dog.location = function(id, cb) {
    ...
}

```

This function contains the application logic that will handle the request, and has the following arguments:

  * Any request parameters registered in the `accepts` property of the config object in the order they were registered.
  * A callback function that specifies the response.

Next, we query our datasource using the built-in [`findOne()`](https://apidocs.strongloop.com/loopback/#persistedmodel-findone) function that is available on all instances of `PersistedModel`, and return the location of the dog:

```js
Dog.location = function(id, cb) {
  
  //query the database for a single matching dog
  Dog.findOne({where: {id: id}}, function(err, dog) { 
    
    //return only the location property of the dog
    cb(null, dog.location);
  });    
}

```

Here, we invoke the callback of our remote method in the callback of the query to ensure the query completes before a response is sent. Also, because we registered a `location` argument of type object in the `returns` property of our remote method config, Loopback automatically includes `dog.location` as a key-value pair for us in the API response.

The result is a response body that looks like this:

```js
{
  location: {"aisle": 4, "shelf": 2}
}

```

That&#8217;s all there is to it!

This is just a simple example to get you started, but already you can see how easy Loopback makes it to inject custom endpoints and custom application logic into your API. Combine this with Loopback&#8217;s built-in datasource functionality, as well as other features like [remote hooks](https://docs.strongloop.com/display/public/LB/Remote+hooks) and [operation hooks](https://docs.strongloop.com/display/public/LB/Operation+hooks), and there&#8217;s really no API you can&#8217;t easily build with Loopback, whether you need to expose simple data or complex services.