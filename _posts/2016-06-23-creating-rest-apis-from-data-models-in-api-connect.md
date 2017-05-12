---
id: 27204
title: Creating REST APIs from Data Models in API Connect
date: 2016-06-23T06:00:22+00:00
author: Alex Muramoto
guid: https://strongloop.com/?p=27204
permalink: /strongblog/creating-rest-apis-from-data-models-in-api-connect/
categories:
  - API Connect
  - How-To
  - LoopBack
---
When it comes to building APIs, you&#8217;ve got a lot of options. Seriously, _A LOT_ of options. Just in the Node.js world alone, your choices include:<!--more-->

  * [LoopBack](http://loopback.io/)
  * [Hapi](http://hapijs.com/)
  * [Sails](http://sailsjs.org/)
  * [Express](http://expressjs.org/)
  * [Koa](http://koajs.com/)
  * [API Connect](https://developer.ibm.com/apiconnect/)
  * [Restify](http://restify.com/)
  * [Flatiron](http://flatironjs.org/)
  * [actionhero](http://www.actionherojs.com/)

And then, of course, you build your API from scratch. And let&#8217;s not even consider options outside of Node because this post would get unbearably long very fast (but why build an API with anything but Node?).

Of course, every developer has their own preferences, and building APIs is no exception. The point is: options are great and give you flexibility to choose what&#8217;s best for your individual needs. It&#8217;s with this in mind that API Connect was created to give you a variety of ways to build and iterate on all the facets of your APIs.

## What are Models

Under the covers, API Connect uses the open-source [LoopBack](http://loopback.io) framework to create Express-based APIs in Node.js. This makes it really easy for current LoopBack users to get started right away with API Connect.

But first, a quick primer: A LoopBack _model_ represents a resource that API Connect can use in many ways, including:

  * Exposing it via a set of REST endpoints.
  * Persisting it to a data source, such as in-memory or MySQL.
  * Manipulating it programmatically as a JavaScript object.

In the following example, we&#8217;ll look at a couple ways to create models in API Connect, and expose them as a set of REST endpoints. This will enable users to store and manipulate instances of those models in API Connect&#8217;s default in-memory data store.

## Getting Started

To get started with API Connect, you&#8217;ll need to do three things:

  1. Download the API Connect Developer Toolkit from npm:
```
$ npm install -g apiconnect
```

  2. [Create a free IBM Bluemix account](https://console.ng.bluemix.net/registration/?Target=https%3A%2F%2Fconsole.ng.bluemix.net%2Flogin). You&#8217;ll need this to access the API Connect editor.
  3. Create a starter API from the command line (this will look very familiar to LoopBack users):

```
$ apic loopback

     _-----_
    |       |    .--------------------------.
    |--(o)--|    |  Let's create a LoopBack |
   `---------´   |       application!       |
    ( _´U`_ )    '--------------------------'
    /___A___
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

[?] What's the name of your application? apic-getting-started
[?] Enter name of the directory to contain the project: apic-getting-started

[?] What kind of application do you have in mind?
  empty-server (An empty LoopBack API, without any configured models or datasources)
  hello-world (A project containing a controller, including a single vanilla Message and a single remote method)
❯ notes (A project containing a basic working example, including a memory database)
```

This will create a new API using Node.js that supports basic create, read, update, and delete (CRUD) operations for a `/notes` endpoint. It also configures an in-memory data source for handling data persistence.

### Run and Test It

Next, start the API locally so we can start building and testing:

```js
$ apic start
Service apic started on port 4001
```

We can now hit our API at `http://localhost:4001`. To check that everything is running fine, open it in your web browser. You should see a message like this:

```js
{"started":"2016-04-13T00:38:14.669Z","uptime":227.991}
```

Now we have everything we need to get going. Time to extend our API to make it more useful.

## Creating Models with the CLI

The first option for exposing new API endpoints is to define new data models with the API Connect Developer Toolkit CLI. This will be the most familiar to LoopBack users.

But notes are boring. Let&#8217;s add a new endpoint that gives us something cool. Time to create a `/cats` endpoint. To create the model, enter this command:

```js
$ apic create --type model
```

Next, enter the following. This will create our `Cat` data model, and expose it as a REST API with CRUD functionality.

```
? Enter the model name: cat
? Select the data-source to attach undefined to: db (memory)
? Select models base class PersistedModel
? Expose cat via the REST API? Yes
? Custom plural form (used to build REST URL):
? Common model or server only? common
```

Of course, our cats need names, so add that property when prompted:

```
? Property name: name
? Property type: string
? Required? Yes
? Default value[leave blank for none]:
```

But we have a problem. Cats are jerks and we didn&#8217;t like them anyway, so let&#8217;s make a better endpoint, using a different method.

## Model Editor

CLIs aren&#8217;t for everyone. So now we&#8217;ll look at how to add a data model to our API with the API Connect visual editor, called API Designer.

First, start the API Designer:

```js
$ cd apic-getting-started
$ apic edit
```

This will launch the API Designer in your default browser. You&#8217;ll need to log in to Bluemix at this point.

Next, open the model editor by clicking the &#8216;Models&#8217; button in the top nav.

[<img class="aligncenter wp-image-27519 size-full" src="{{site.url}}/blog-assets/2016/06/Screen-Shot-2016-06-03-at-3.26.24-PM.png" alt="Screen Shot 2016-06-03 at 3.26.24 PM" width="526" height="168"  />]({{site.url}}/blog-assets/2016/06/Screen-Shot-2016-06-03-at-3.26.24-PM.png)

You&#8217;ll see a list that contains the `note` model that came with the API, as well as the `cat` model we just created.

To start creating our awesome `dog` model, do the following:

  1. Click the **Add** button.
  2. In the popup, enter &#8220;dog&#8221; as the name of the new model.
  3. Click the **New** button. The model details will be shown.

Pretty much everything we need for our `dog` model is already defined by default.

  * **Base Model** is &#8220;Persisted Model&#8221;, which specifies that this model should be connected to a data source.
  * **Datasource** is the default &#8220;db&#8221; data source, which persists model instances to memory (just for development and testing).
  * The model is set to &#8220;Public&#8221;, which means it is exposes API endpoints for all the CRUD functions.

All we need to do now is make sure all our dogs are required to have names. To do this, click the **&#8220;+&#8221;** icon at the top of the **Properties** section, and enter the settings for a &#8220;name&#8221; property.

[<img class="aligncenter wp-image-27520 size-full" style="border: #CCCCCC 1px solid;" src="{{site.url}}/blog-assets/2016/06/Screen-Shot-2016-06-03-at-3.29.07-PM.png" alt="Screen Shot 2016-06-03 at 3.29.07 PM" width="739" height="541"  />]({{site.url}}/blog-assets/2016/06/Screen-Shot-2016-06-03-at-3.29.07-PM.png)

See? Way better than cats.

## Try it Out!

Now that we have a couple data models defined and exposed via our API, we can test it by sending HTTP requests to it. To start the API running locally, just click the **Play** button at the bottom of the API Connect API Designer.

[<img class="aligncenter wp-image-27521 size-full" style="border: #CCCCCC 1px solid;" src="{{site.url}}/blog-assets/2016/06/Screen-Shot-2016-06-03-at-3.43.30-PM.png" alt="Screen Shot 2016-06-03 at 3.43.30 PM" width="131" height="38" />]({{site.url}}/blog-assets/2016/06/Screen-Shot-2016-06-03-at-3.43.30-PM.png)

Once the API is running, the URL of your API will be displayed next to **Application**.

[<img class="aligncenter wp-image-27522 size-full" style="border: #CCCCCC 1px solid;" src="{{site.url}}/blog-assets/2016/06/Screen-Shot-2016-06-03-at-3.43.46-PM.png" alt="Screen Shot 2016-06-03 at 3.43.46 PM" width="680" height="35"  />]({{site.url}}/blog-assets/2016/06/Screen-Shot-2016-06-03-at-3.43.46-PM.png)

You can send HTTP requests to your API with your favorite client (I like cURL or [Postman](https://www.getpostman.com/)) with the base path `/api/<model_name>`.

For example, you could do the following to create a new dog:

```js
curl -X POST 'http://127.0.0.1:4001/api/dogs' --data name=NotACat
```

Which returns an object with an ID:

```js
{"name":"NotACat","id":1}
```

Get all of the current instances of `Dog` that have been persisted to the in-memory data source:

```js
curl -X GET 'http://127.0.0.1:4001/api/dogs'
```

Update the `Dog` by its ID:

```js
curl -X PUT 'http://127.0.0.1:4001/api/dogs/1' --data name=StillNotACat
```

And finally delete the dog by its ID:

```js
curl -X DELETE 'http://127.0.0.1:4001/api/dogs/1'
```

It&#8217;s pretty mean to delete a dog though. You should probably be ashamed of yourself.

And there you go. Hopefully this gives you an idea about how easy it is to build and iterate your APIs with API Connect!

&nbsp;
