---
id: 27235
title: 'Applying Custom Logic in Phases: Using Remote Hooks in LoopBack'
date: 2016-04-19T07:53:33+00:00
author: Alex Muramoto
guid: https://strongloop.com/?p=27235
permalink: /strongblog/applying-custom-logic-in-phases-using-remote-hooks-in-loopback/
categories:
  - How-To
  - LoopBack
---
Recently, we looked at [how to use remote methods](https://strongloop.com/strongblog/remote-methods-in-loopback-creating-custom-endpoints/) to expose custom logic as REST API endpoints in [Loopback](http://loopback.io). That was pretty cool, but it just isn&#8217;t enough if we want to build a full-blown, production API. Even in a relatively simple case like exposing an inventory, if we threw a new endpoint at everything we&#8217;d very quickly end up with a poorly designed (not to mention ugly) API.

Luckily, Loopback provides a number of fine-grained ways to inject custom application logic into every level of our APIs. Let&#8217;s take a look at one of these options: [remote hooks](https://docs.strongloop.com/display/public/LB/Remote+hooks).

<!--more-->

## What&#8217;s a Remote Hook?

As we saw previously where we created an inventory of awesome dogs (code available on [GitHub](https://github.com/amuramoto/simple_samples/tree/master/loopback-remote-method)), remote methods enable you to define application logic that you can call using custom or built-in Loopback [models](https://docs.strongloop.com/display/APIC/Creating+models). This is perhaps most useful to define a custom endpoint for an API. In the previous example, we added a `/dogs/:id/location` endpoint to `GET` the location of any dog in inventory.

_Remote hooks_ enable you to take this customization a step further. In short, remote hooks are functions attached to every Loopback model where you can inject application logic at three different points when a remote method is called:

  * `PersistedModel.beforeRemote()`: Invoked before the remote method is executed.
  * `PersistedModel.afterRemote()`: Invoked after the remote method is executed.
  * `PersistedModel.afterRemoteError()`: Invoked after the remote method throws an `Error` object. Also called if `beforeRemote()` or `afterRemote()` pass an `Error` object to `next()`.

### Aren&#8217;t Remote Hooks Redundant?

If I&#8217;m already able to add whatever code I want when I define a remote method, why would I want to add complexity with remote hooks? Glad you asked.

The first answer is that it’s good to apply logic to API endpoints in phases. By doing this we can cleanly maintain and manage the code that defines what happens before, during, and after our API handles specific requests.

The second answer is that not all remote methods are custom. Loopback has a bunch of built-in remote methods, including ones for every CRUD (create, read, update, and delete) operation. Just to make things clearer, here&#8217;s a quick rundown of the basic HTTP CRUD verbs mapped to the built-in remote methods they use under the covers (full docs on these is available in the [Loopback API docs](http://apidocs.strongloop.com/loopback/#persistedmodel)):

  * GET: `PersistedModel.find()`, `PersistedModel.findOne()`, `PersistedModel.findById()`
  * POST: `PersistedModel.create()`
  * PUT: `PersistedModel.updateAll()`, `PersistedModel.upsert()\`
  * DELETE: `PersistedModel.destroyAll()`, `PersistedModel.destroyById()`

So, as much as I would like to say Loopback uses magic to query your SQL and NoSQL databases, it is sadly not so. And the thing is, you shouldn&#8217;t alter these functions. Bad Things might happen because they&#8217;re used extensively within Loopback. Instead, add that customization you&#8217;ve been craving with remote hooks!

## Dogs Are Awesome: A Remote Hooks Example

Let&#8217;s look at a simple example that extends our dogs API, where we exposed CRUD operations on a `Dog` model to persist records of every (very humanely treated) dog in our inventory to the default in-memory data source. To create a record, a user would `POST` something like this to the API:

```js
{
	"ownerID": "95008",
	"name": "Allie",
	"breed": "Corgi",
	"birthdate": "12-30-2011"
}

```

Pretty simple, but already we have a problem, and it&#8217;s that &#8216;birthdate&#8217; property. Time for a remote hook.

### Normalizing Data in `beforeRemote()`

We want to let the user enter their dog&#8217;s birthdate in various formats, but before adding it to the database, we want to normalize it to a standard, easy-to-manipulate format like a UNIX timestamp. Perfect time to take advantage of the `beforeRemote()` remote hook by adding the following to `/common/models/Dog.js`:

```js
Dog.beforeRemote ('create', function (context, modelInstance, next) {
  let birthdate = new Date(context.req.body.birthdate).getTime();    
  if (isNaN(birthdate)) {
    next(new Error(birthdate));
  }
  context.req.body.birthdate = birthdate;
  next();
});

```

In this code, we&#8217;re injecting our custom logic before any call to the `create()` remote method. That is, before the payload of any `POST` request is actually saved to the data source. In our logic, we are converting the &#8216;birthdate&#8217; string to a UNIX timestamp, replacing the string with our timestamp, then calling `next()` to continue.

### Using `context` and `next()`

There are a couple unfamiliar things worth stopping to mention here: `context` and `next()`.

  * The <a href="https://docs.strongloop.com/display/public/LB/Remote+hooks#Remotehooks-Contextobject">context</a> object is passed by Loopback into every remote hook. In the case of `beforeRemote()` it contains the API request object (`context.req`), and in the case of `afterRemote()` and `afterRemoteError()` it contains the response object that will be returned by the API (`context.result`).
  * The `next()` function is called when we are ready to proceed to the next phase of the remote method, in this case executing the `create()` remote method. Express users will recognize this as telling our Express-based API to continue to the next function in the [middleware](http://expressjs.com/en/guide/using-middleware.html) chain.

### Error Handling in `afterRemoteError()`

If the user sends an invalid date string in their request body, `new Date(context.req.body.birthdate).getTime()` will evaluate to `NaN`. In this case, we will want to return an error to the user. To do this, we pass an `Error` object to `next()`. Doing this automatically bypasses execution of our remote method, and proceeds to execute `afterRemoteError()`. This is optional. If we don&#8217;t define `afterRemoteError()`, Loopback simply returns the error in the API response:

```js
{
  "error": {
    "name": "Error",
    "status": 500,
    "message": "NaN",
    "stack": "Error: NaN    
      at /Users/.../loopback-remote-hooks/common/models/dog.js:20:12
      at Function. (/Users.../loopback-remote-hooks/node_modules/loopback/lib/model.js:19"
  }
}

```

That&#8217;s a pretty unhelpful error message. Plus, we probably don&#8217;t want to include the full stack trace in the response. Let&#8217;s change those properties in `afterRemoteError()` by manipulating `context.error`:

```js
Dog.afterRemoteError ('create', function (context, next) {    
  context.error.message = 'Invalid birthdate format';
  delete context.error.stack;
  next();
});  

```

Note that this is a simple example. In a real-world API we would want to have better conditional logic to handle different errors that might occur, but our dogs are so awesome we don&#8217;t need to worry about stuff like that right now. All we need to do is change the `message` property to something more informative, and delete the `stack` property to give us a clean error message that will be useful to the consumer of our API:

```js
{
  "error": {
    "name": "Error",
    "status": 500,
    "message": "Invalid birthdate format"
  }
}

```

### Sending a Confirmation Email in `afterRemote()`

Alright, now we&#8217;ve got a really nice API endpoint. Time to call it a day, push our commit, and get out of here, right? Not so fast! There&#8217;s a lot of additional value we can add for the user beyond a simple request and response. For example, let&#8217;s send a confirmation email to a dog&#8217;s owner when their dog is successfully registered with our service. For this, we look to `afterRemote()`, which executes once the remote method is successful.

Let&#8217;s start by assuming our Loopback app has an additional `Owner` model, where each instance looks like this:

```js
{
  "ownerID": "4056",
  "email": "bestdogowner@reallynotreally.com"
}

```

If we require the user to include an `ownerID` property in their `POST` request, we can look up the owner&#8217;s email address in `afterRemote()`, by calling the remote method on the `Owner` model:

```js
Dog.afterRemote ('create', function (context, modelInstance, next) {    
  let ownerId = context.result.ownerId;
  Dog.app.models.Owner.findOne({where: {id: ownerId}}, function(err, owner) {       
    let ownerId = context.result.ownerId;
    next();
  });
}); 

```

To actually send the confirmation email, we then create a function that uses Loopback&#8217;s built-in email connecter (for information on implementing and configuring the email connector, take a look at the [Loopback docs](https://docs.strongloop.com/display/APIC/Email+connector)):

```js
Dog.sendEmailConfirmation = function(ownerEmail) { 
  Dog.app.models.Email.send({
    to: ownerEmail,
    from: 'confirmation@dogsarethebest.com',
    subject: 'So Success! Much Dog!',      
    html: 'OMG. Your dog is awesome. OMG.'
  }, function(err, mail) {
    console.log('confirmation email sent');         
  });
}

```

And then call this function in `afterRemote()` to send a confirmation email whenever a new dog record is created:

```js
Dog.afterRemote ('create', function (context, modelInstance, next) {    
  let ownerId = context.result.ownerId;
  Dog.app.models.Owner.findOne({where: {id: ownerId}}, function(err, owner) { 
    Dog.sendEmailConfirmation(owner.email);
    next();
  });
});

```

This is, of course, a very simple implementation of what&#8217;s offered by remote hooks, but already it&#8217;s pretty easy to see the value that they bring in managing the lifecycle of our API requests. Taken in conjunction with other customization options like [operation hooks](https://docs.strongloop.com/display/public/LB/Operation+hooks) and [connector hooks](https://docs.strongloop.com/display/public/LB/Connector+hooks), the granularity of customization available in Loopback is one of its strongest features for everything from rapid prototyping to full-scale production development.

Want to see all the code for this example API? You can grab it from [Github](https://github.com/amuramoto/simple_samples/tree/master/loopback-remote-hooks).