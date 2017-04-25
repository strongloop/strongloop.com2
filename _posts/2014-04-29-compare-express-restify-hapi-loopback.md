---
id: 15660
title: Comparing Express, Restify, hapi and LoopBack for building RESTful APIs
date: 2014-04-29T07:49:58+00:00
author: Alex Gorbatchev
guid: http://strongloop.com/?p=15660
permalink: /strongblog/compare-express-restify-hapi-loopback/
categories:
  - Community
  - How-To
  - LoopBack
---
_**Editor’s Note:** This post was originally published in April, 2014. We have refreshed this popular blog post._

If you are writing a Node.js application, chances are you going to have some kind of API endpoints to be consumed by your front end or expose data for others to take in. This is where [RESTful APIs](http://en.wikipedia.org/wiki/Representational_state_transfer) come in. With so many tools and approaches to choose from, you have a dilemma: What’s the right approach for your project?

<img class="size-full wp-image-15661 aligncenter" src="https://strongloop.com/wp-content/uploads/2014/04/giphy.gif" alt="lost" width="477" height="252" />

Thanks to the incredibly active Node.js community, the amount of results for a [`rest` search on NPM](https://www.npmjs.org/search?q=rest) is pretty overwhelming. Everyone has their own implementation and approach, but few seem to agree on a common way to go about implementing RESTful APIs in Node.js.

<!--more-->

## **RESTful APIs with Express** {#restful-apis-with-express}

The most common approach is to just roll your own end points with [Express](http://expressjs.com). This practice allows you to get started quickly, but it becomes burdensome in the long run. Lets look at pros and cons:

### **Example** {#example}

Here&#8217;s what a typical end point might look like in [Express](http://expressjs.com) using the latest 4.x `Router` feature:

```js
var express = require('express');
var Item = require('models').Item;
var app = express();
var itemRoute = express.Router();

itemRoute.param('itemId', function(req, res, next, id) {
  Item.findById(req.params.itemId, function(err, item) {
    req.item = item;
    next();
  });
});

// Create new Items
itemRoute.post('/', function(req, res, next) {
  var item = new Item(req.body);
  item.save(function(err, item) {
    res.json(item);
  });
});

itemRoute.route('/:itemId')
  // Get Item by Id
  .get(function(req, res, next) {
    res.json(req.item);
  })
  // Update an Item with a given Id
  .put(function(req, res, next) {
    req.item.set(req.body);
    req.item.save(function(err, item) {
      res.json(item);
    });
  })
  // Delete and Item by Id
  .delete(function(req, res, next) {
    req.item.remove(function(err) {
      res.json({});
    });
  });

app.use('/api/items', itemRoute);
app.listen(8080);
```

### **Pros** {#pros}

  1. Little learning curve, [Express](http://expressjs.com) is nearly a standard for Node.js web applications.
  2. Fully customizable.

### **Cons** {#cons}

  1. All endpoints need to be created manually; you end up doing a lot of the same code (or worse, start rolling your own libraries after a while).
  2. Every endpoint needs to be tested (or at the very least I recommend that you hit the endpoints with HTTP consumer to make sure they are actually there and don&#8217;t throw 500s).
  3. Refactoring becomes painful because everything needs to be updated everywhere.
  4. Doesn&#8217;t come with anything &#8220;standard&#8221;, have to figure out your own approach.

[Express](http://expressjs.com) is a great starting point, but eventually you will feel the pain of &#8220;roll your own&#8221; approach.

## **RESTful APIs with Restify** {#restful-apis-with-restify}

[Restify](http://mcavage.me/node-restify) is a relatively old player in the Node.js API field, very stable and being actively developed. It is purpose-built to enable you to build correct REST web services and intentionally borrows heavily from [Express](http://expressjs.com).

### **Example** {#example_1}

Because [Restify](http://mcavage.me/node-restify) borrows from [Express](http://expressjs.com), the syntax is nearly identical:

```js
var restify = require('restify');
var Item = require('models').Item;
var app = restify.createServer()

app.use(function(req, res, next) {
  if (req.params.itemId) {
    Item.findById(req.params.itemId, function(err, item) {
      req.item = item;
      next();
    });
  }
  else {
    next();
  }
});

app.get('/api/items/:itemId', function(req, res, next) {
  res.send(200, req.item);
});

app.put('/api/items/:itemId', function(req, res, next) {
  req.item.set(req.body);
  req.item.save(function(err, item) {
    res.send(204, item);
  });
});

app.post('/api/items', function(req, res, next) {
  var item = new Item(req.body);
  item.save(function(err, item) {
    res.send(201, item);
  });
});

app.delete('/api/items/:itemId', function(req, res, next) {
  req.item.remove(function(err) {
    res.send(204, {});
  });
});

app.listen(8080);
```

### **Pros** {#pros_1}

  * Automatic DTrace support for all your handlers (if you&#8217;re running on a platform that supports DTrace).
  * Doesn&#8217;t have unnecessary functionality like templating and rendering.
  * Built in throttling.
  * Built in [SPDY](http://en.wikipedia.org/wiki/SPDY) support.

### **Cons** {#cons_1}

The cons are all the same with [Restify](http://mcavage.me/node-restify) as they are with [Express;](http://expressjs.com) lots of manual labor.

## **RESTful APIs with hapi** {#restful-apis-with-hapi}

[hapi](http://hapijs.com/) is a lesser-known Node.js framework that is getting momentum thanks to full-time support of the Walmart Labs team. It takes a somewhat different approach from [Express](http://expressjs.com) and [Restify](http://mcavage.me/node-restify) by providing significantly more functionality out of the box for building web servers.

### **Example** {#example_2}

Here&#8217;s the same example re-written using [hapi](http://hapijs.com/):

```js
var Hapi = require('hapi');
var Item = require('models').Item;
var server = Hapi.createServer('0.0.0.0', 8080);

server.ext('onPreHandler', function(req, next) {
  if (req.params.itemId) {
    Item.findById(req.params.itemId, function(err, item) {
      req.item = item;
      next();
    });
  }
  else {
    next();
  }
});

server.route([
  {
    path: '/api/items/{itemId}',
    method: 'GET',
    config: {
      handler: function(req, reply) {
        reply(req.item);
      }
    }
  },
  {
    path: '/api/items/{itemId}',
    method: 'PUT',
    config: {
      handler: function(req, reply) {
        req.item.set(req.body);
        req.item.save(function(err, item) {
          reply(item).code(204);
        });
      }
    }
  },
  {
    path: '/api/items',
    method: 'POST',
    config: {
      handler: function(req, reply) {
        var item = new Item(req.body);
        item.save(function(err, item) {
          reply(item).code(201);
        });
      }
    }
  },
  {
    path: '/api/items/{itemId}',
    method: 'DELETE',
    config: {
      handler: function(req, reply) {
        req.item.remove(function(err) {
          reply({}).code(204);
        });
      }
    }
  }
]);

server.start();
```

### **Pros** {#pros_2}

  1. Granular control over request handling.
  2. Detailed API [reference](http://hapijs.com/api) with support for documentation generation.

### **Cons** {#cons_2}

As with [Express](http://expressjs.com) and [Restify](http://mcavage.me/node-restify), [hapi](http://hapijs.com/) gives you great construction blocks, but you are left to your own devices figuring out how to use them.

## **What else is there?** {#what-else-is-there}

[Express](http://expressjs.com), [Restify](http://mcavage.me/node-restify) and [hapi](http://hapijs.com/) are all great starting points, but in the long run it might not be the right choice if you plan on investing heavily into APIs.

## **LoopBack** {#loopback}

[LoopBack](http://strongloop.com/mobile-application-development/loopback/) is a fully featured Node.js backend framework to connect your applications to data via APIs. It adopts the [convention over configuration](http://en.wikipedia.org/wiki/Convention_over_configuration) mantra popularized by Ruby on Rails.

### **Example** {#example_3}

```js
var loopback = require('loopback');
var app = module.exports = loopback();

var Item = loopback.createModel(
  'Item',
  {
    description: 'string',
    completed: 'boolean'
  }
);

app.model(Item);
app.use('/api', loopback.rest());
app.listen(8080);
```

There&#8217;s a lot of &#8220;magic&#8221; happening in the background. But with just 12 lines of code you now have the following end points:

```js
POST /Items
GET /Items
PUT /Items
PUT /Items/{id}
HEAD /Items/{id}
GET /Items/{id}
DELETE /Items/{id}
GET /Items/{id}/exists
GET /Items/count
GET /Items/findOne
POST /Items/update
```

<img class="size-full wp-image-15662 aligncenter" src="https://strongloop.com/wp-content/uploads/2014/04/mind-blowing_1454.gif" alt="mind blown" width="378" height="203" />

To start exploring your own APIs right away, there&#8217;s a bundled `explorer` module that you can attach to your application. Just include these lines before \`app.listen(8080);\`&#8230;

```js
app.start = function() {
// start the web server
return app.listen(function() {
app.emit('started');
var baseUrl = app.get('url').replace(/\/$/, '');
console.log('Web server listening at: %s', baseUrl);
if (app.get('loopback-component-explorer')) {
var explorerPath = app.get('loopback-component-explorer').mountPath;
console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
}
});
};

```

Now when you open `http://localhost:8080/explorer,` you get this:

[<img class="aligncenter wp-image-24004 size-full" src="https://strongloop.com/wp-content/uploads/2014/04/StrongLoop-API-Explorer.png" alt="" width="681" height="574" srcset="https://strongloop.com/wp-content/uploads/2014/04/StrongLoop-API-Explorer.png 681w, https://strongloop.com/wp-content/uploads/2014/04/StrongLoop-API-Explorer-300x253.png 300w, https://strongloop.com/wp-content/uploads/2014/04/StrongLoop-API-Explorer-450x379.png 450w" sizes="(max-width: 681px) 100vw, 681px" />](https://strongloop.com/wp-content/uploads/2014/04/StrongLoop-API-Explorer.png)

Seriously cool stuff!

### **Pros** {#pros_3}

  * Very quick RESTful API development.
  * Convention over configuration.
  * Built-in models ready to use.
  * RPC support.
  * Fully configurable when needed.
  * Extensive documentation.
  * Full-time team working on the project.
  * Online support support.

### **Cons** {#cons_3}

  * Learning curve can be pretty steep because there are so many moving parts.

## **RPC** {#rpc}

The [LoopBack](http://strongloop.com/mobile-application-development/loopback/) example above is so tiny, I feel bad about it. How about we extend it with a quick RPC endpoint to balance things out?

```js
var loopback = require('loopback');
var explorer = require('loopback-explorer');
var remoting = require('strong-remoting');
var app = module.exports = loopback();
var rpc = remoting.create();

var Item = loopback.createModel(
  'Item',
  {
    description: 'string',
    completed: 'boolean'
  }
);

function echo(ping, callback) {
  callback(null, ping);
}

echo.shared = true;
echo.accepts = {arg: 'ping', type: 'string'};
echo.returns = {arg: 'echo', type: 'string'};

rpc.exports.system = {
  echo: echo
};

app.model(Item);
app.use('/api', loopback.rest());
app.use('/explorer', explorer(app, {basePath: '/api'}));
app.use('/rpc', rpc.handler('rest'));
app.listen(8080);
```

And now you can do this:

```js
$ curl "http://localhost:8080/rpc/system/echo?ping=hello"
{
  "echo": "hello"
}
```

<img class="size-full wp-image-15663 aligncenter" src="https://strongloop.com/wp-content/uploads/2014/04/thumbs_up_nph.gif" alt="thumbs up" width="312" height="176" />

## [**Develop APIs visually with IBM API Connect**](http://strongloop.com/node-js/arc/)

Once your API is ready for prime time, you can easily import your StrongLoop projects into API Connect to build an API that’s ready for the rigors of enterprise-level service. API Connect combines IBM API Management and StrongLoop into a unified API creation tool. It takes just a few simple steps to [get started](https://console.ng.bluemix.net/docs/services/apiconnect/index.html)<u>!</u>
