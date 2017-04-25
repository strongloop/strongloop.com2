---
id: 6638
title: Using Express.js for APIs
date: 2013-09-04T09:31:14+00:00
author: Jed Wood
guid: http://blog.strongloop.com/?p=1410
permalink: /strongblog/using-express-js-for-apis/
categories:
  - API Tip
  - Express
  - How-To
---
_A few tips and libraries for creating and documenting RESTful APIs with Express.js. See a [simple example app](https://github.com/jedwood/express-for-APIs) that incorporates some of these ideas._

Two things really got me sucked into Express when I first started using it: [Jade](http://jade-lang.com/) and [Stylus](http://learnboost.github.io/stylus/). I can barely tolerate writing HTML and CSS any other way.

These days I spend more time using Express for APIs that send nothing but JSON. In this post I&#8217;ll cover a few libraries and reminders to help keep your code organized and your API friendly for developers.

#### Mongoose

I&#8217;m assuming an API backed by MongoDB, and that we&#8217;re using [Mongoose](http://mongoosejs.com/). Covering the basics of Mongoose is beyond the scope of this article, but I want to highlight a few lesser-known bits.

##### express-mongoose

I&#8217;m generally not a flow control library guy. I guess I&#8217;ve just gotten used to callbacks. That said, it&#8217;s worth considering [express-mongoose](https://github.com/LearnBoost/express-mongoose) as a nice way of cleaning things up. It allows you to pass a Mongoose Query or Promise object to res.send instead of writing out the full callback. That means a method that requires two separate Mongoose calls can be condensed to this:

`app.get('/pets', function(req, res) {<br />
res.send({cats: Cat.find(), dogs: Dog.find()});<br />
});<br />
` 

The fact that it supports Promises is important to keep in mind, because it means you can create some fairly complex async stuff in your Mongoose models, and as long as it returns a Promise you keep the top layer routing/sending code really tidy.

###### Mongoose Transforms

I often find myself wanting to hide certain properties before they get sent across the wire. Mongoose has a great mechanism for doing this at the model level via toObject and toJson Transforms. Here&#8217;s an example [from the docs](http://mongoosejs.com/docs/api.html#document_Document-toObject):

`schema.options.toObject.transform = function (doc, ret, options) {<br />
return { movie: ret.name }<br />
}`

// without the transformation in the schema
  
`doc.toObject(); // { _id: 'anId', name: 'Wreck-it Ralph' }`

// with the transformation
  
`doc.toObject(); // { movie: 'Wreck-it Ralph' }`

This is yet another way to avoid repetition at the route/controller levels of your app.

#### Routing

##### express-resource-new

It can be tedious writing out the same GET, POST, PUT, DELETE actions for all of your resources, and tedious can turn to messy when you start including authentication and other middleware. TJ Holowaychuk, the creator of Express, also wrote a little library called [express-resource](https://github.com/visionmedia/express-resource) that simplifies some of that. However, I prefer [express-resource-new](https://github.com/tpeden/express-resource-new). It provides a slightly more Rails-like controller setup by adding &#8220;before&#8221; middleware and nicer nested resource syntax. Note that the version on npm is not the latest, so you&#8217;ll need to run this command to install via npm:

`npm install git://github.com/tpeden/express-resource-new.git#175c2ad84cc6d3ac2b509d720b9ce583d7e8afb3`

##### XHR-friendly

If your API is really strict, it would look only at the type of call being made; a POST is a POST, a DELETE is a DELETE. That poses a problem for some browsers and front-end libraries that only use GET and POST. A standard convention for solving that is to have your server look for a _method parameter on the incoming data, and use that value. If you&#8217;ve ever copied and pasted a basic Express example, you&#8217;re probably already using this:

`app.use(express.methodOverride());`

If for some reason you want your API to stay strict, just remove that line. Note that Express has a handy little [req.xhr](http://expressjs.com/api.html#req.xhr) helper that should be able to determine whether a call was made with XMLHttpRequest.

##### Status codes

By default Express will automatically set the codes for most common success and error cases, but sometimes it&#8217;s worth being explicit about the codes you return. You can do that using two different formats:

`res.status(500).send({error:"End of line."});`

or

`res.send(500, {error:"End of line."});`

There are plenty of long (boring) debates on the web about the finer points of when to use obscure HTTP status codes. Here are the simple conventions I usually follow:

`201` upon a successful POST/CREATE operation (people often mistakenly just use 200 for this)

`400` if the user makes a request that&#8217;s not valid, such as not including a parameter in the required format

`401` if the user requests a resource without being authorized

`404` if the user requests a resource that doesn&#8217;t exist

`500` if something goes wrong on the server that is not the user&#8217;s fault

##### Content negotiation

The &#8220;proper&#8221; way to determine whether your API should send HTML, JSON, or XML is by inspecting the Accept header and branching accordingly. Express has some nice helpers for this, including [req.accepts](http://expressjs.com/api.html#req.accepts) and [res.format](http://expressjs.com/api.html#res.format). If you use express-resource-new then by default you&#8217;ll also be providing a &#8220;dot suffix&#8221; alternative for your users, e.g. `/people.html` and `/people.json`.

Be sure that you&#8217;re explicit about the format you&#8217;re returning if you need to be. Recent version of iOS can be particularly strict about this. If it&#8217;s expecting JSON and you fire of a res.status(200) then the user is going to get a OK without the proper JSON header. To fix that, you can use res.type(&#8216;json&#8217;).

#### Documenting your API

If you&#8217;ve gone to the trouble of creating a great API, you&#8217;re silly not to give it proper developer-friendly documentation. My personal favorite is [I/O Docs by Mashery](https://github.com/mashery/iodocs). You can document several APIs with one setup. Everything is configured with simple JSON config files. They recently upgraded it to be compatible with Express 3. I&#8217;d recommend hosting it as a separate app on a separate subdomain, but for simple non-critical apps you can just tuck it all under a route of the main app.

You should also check out [Swagger](https://github.com/wordnik/swagger-node-express), or if you prefer to have somebody else host your docs in their cloud, check out [Apiary](http://apiary.io/) and [Mashape](https://www.mashape.com/).

#### Testing your API

There&#8217;s a [whole separate post](http://blog.strongloop.com/how-to-test-an-api-with-node-js/) dedicated to this one.

#### Beyond Express

Node.js is a great for APIs; it&#8217;s easy to make calls to other external services and it can handle a lot of connections with low overhead. Of course Express is not your only option for creating an API in Node, nor necessarily your best. In a future post we&#8217;ll be taking a look at [Hapi.js](http://hapijs.com/), which proudly carries the &#8220;configuration over convention&#8221; banner.

## **[What’s next?](http://strongloop.com/get-started/)**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What’s in the upcoming Node v0.12 release? <a href="http://strongloop.com/node-js/whats-new-in-node-js-v0-12/">Six new features, plus new and breaking APIs</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js <a href="http://strongloop.com/node-js/loopback/">LoopBack framework</a>. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Need <a href="http://strongloop.com/node-js-support/expertise/"]]>training and certification</a> for Node? Learn more about both the private and open options StrongLoop offers.</span>
</li>