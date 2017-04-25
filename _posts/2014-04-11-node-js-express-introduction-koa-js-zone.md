---
id: 15399
title: 'Beyond Node.js Express: An Intro to Koa.js and a Preview of Zones'
date: 2014-04-11T15:47:08+00:00
author: Jed Wood
guid: http://strongloop.com/?p=15399
permalink: /strongblog/node-js-express-introduction-koa-js-zone/
categories:
  - Community
  - How-To
  - LoopBack
---
In late 2013, the team behind Express.js announced a new framework called [Koa](http://koajs.com). It uses some features that require an unstable dev version of Node, but in this post I&#8217;ll show you how easy it is give it a try both locally and on Heroku.

[<img class="aligncenter size-full wp-image-15514" alt="koa.js" src="https://strongloop.com/wp-content/uploads/2014/04/Screen-Shot-2014-04-11-at-7.49.09-AM.png" width="469" height="248" />](https://strongloop.com/wp-content/uploads/2014/04/Screen-Shot-2014-04-11-at-7.49.09-AM.png)

## **Before We Start**

Whether you play it safe and use a [node version manager](https://github.com/visionmedia/n) or live on the edge and download it straight up, you&#8217;ll need to get a 0.11.X build of Node. As of writing that&#8217;s [v0.11.12](http://nodejs.org/dist/v0.11.12/). Then you&#8217;ll want to add these two bits to your package.json file (assuming your main entry point is server.js):

```js
"scripts": {
    "start": "node --harmony --harmony_generators server.js"
  },
  "engines": {
    "node": "^0.11.12"
  }
```

With this in place, you&#8217;re ready to run on Heroku— you don&#8217;t even need to add a Procfile. To run your app locally, use `npm start.`

## **Why Koa?**

Do a search and you&#8217;ll find that most of the focus is on Koa&#8217;s use of generators, a feature that&#8217;s a part of the upcoming ECMAScript 6 specification. However, there are two other key features; cascading middleware and sane error handling. Getting a superficial awareness of how Koa uses generators will help in understanding its other features.<!--more-->

## **yielding to ***

Koa is built on [co](https://github.com/visionmedia/co), which handles the delegation to generators and gives Koa its nice syntax. You can read about generators, co-routines, and the [differences between them](https://medium.com/code-adventures/174f1fe66127) if you&#8217;re curious.

If you&#8217;ve been living in Node and Express for a few years, you&#8217;ve either become used to the good ol&#8217; callback syntax:

```js
function(req, res) {
  db.getUser(function(err, u) {
    if (err) return res.status(404).send(err);
    res.send(u)
  });
}
```

or you&#8217;ve chosen one of the many [paths out of callback hell](http://strongloop.com/strongblog/node-js-callback-hell-promises-generators/).

With Koa, you can handle control flow like this:

```js
function *(next) {
  var user = yield db.getUser();
  this.body = user;
}
```

With the exception of the `*` and the `yield` keyword, this almost looks like a &#8220;normal&#8221; synchronous environment. Feels nice, eh? In this simple comparison it might not seem like a big difference, but if you&#8217;ve coded any real apps, you know how easy it is to get tangled in callbacks.

Let&#8217;s say your app needs to make two calls out to other APIs to gather data. We’ll write a simple `makeCall` function that uses the ever-popular [Request](https://github.com/mikeal/request) module to make HTTP calls. If we try to use the standard version of `request`, this wouldn&#8217;t work:

```js
var result = yield rekwest('http://google.com');
```

Instead we need to use [co-request](https://github.com/leukhin/co-request); a &#8220;co-friendly&#8221; version that wraps `request`. You can find `co-` versions for many popular modules.

Our example will make the two calls in series, one after the other:

```js
var rekwest = require('co-request’);

var makeCall = function*(url) {
  var result = yield rekwest(url);
  return res.body;
}

var goog = yield makeCall('http://google.com');
var yhoo = yield makeCall('http://yahoo.com');
this.body = {goog:goog, yhoo:yahoo};
```

To improve our response time, we should make these calls in parallel. `Co` (and Koa) have a really simple way to handle this; just yield an array or object, where each element of the array or property of the object is either a generator or a Promise. When `Co` encounters this, it triggers all the promises/generators at the same time, waits for the results to return, and keeps things in their correct order.

Here&#8217;s a modified version that yields to an array of 2 elements:

```js
var rekwest = require('co-request’);

var makeCall = function*(url) {
  var res = yield rekwest(url);
  return res.body;
}

var calls = ["http://google.com", "http://yahoo.com"];
this.body = yield calls.map(makeCall);
```

Here&#8217;s a similar version that uses an object with named properties instead of an array:

```js
var rekwest = require('co-request’);

var makeCall = function*(url) {
  var res = yield rekwest(url);
  return res.body;
}

var calls = {
  google: makeCall("http://google.com”),
  yahoo:  makeCall("http://yahoo.com")
}

console.log(calls);
 this.body = yield calls;
```

Again, we&#8217;re using `co-request` because `request` can&#8217;t directly be yielded to. However, it _can_ return a Promise. So if we don&#8217;t need to do any parsing in our `makeCall` function, and because `Co` (and Koa) handles an array or object of Promises in the same way it handles generators, we can do this:

```js
var rekwest = require('request’); //plain old request— not the co-request version

  var calls = {
     google: rekwest("http://google.com"),
     yahoo:  rekwest("http://yahoo.com")
   }

 this.body = yield calls;
```

You can imagine how short and sweet your web app route functions can become, even if they need to fetch data from a lot of different databases or APIs.

## **Cascading Middleware**

If you&#8217;re really into Promises or some fancy control flow library, you might not be impressed thus far. Maybe Koa&#8217;s middleware will change that. As explained on the Koa homepage, control &#8220;yields &#8216;downstream&#8217;, then control flows back &#8216;upstream&#8217;.&#8221; The simple example provided in the Koa docs is logging:

```js
app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});
```

The `start` variable holds a timestamp, the function then yields &#8216;downstream&#8217; to whatever is passed in as `next` and when that function (and any functions it yields to) has finished, control is returned back to this function to calculate and log elapsed time.

Have you ever tried building up an HTML response from disparate sources in an elegant way? In Express I always seem to make a mess of that, no matter how well organized my Jade template inheritance and includes are. In Koa, you can do things like:

```js
app.use(function *() {
  this.body = "...header stuff";
  yield saveResults();
  //could do some other yield here 
  this.body += "...footer stuff"
});

function saveResults*() {
  //save some results
  this.body += "Results Saved!";
  //could do some other yield here
}
```

Rather than the Express way of carefully building up your HTML string through a series of Promises and callbacks and then finally passing it to `res.send()`, Koa allows you to append onto `this.body`, and when your middleware stack has gone to the bottom and back up, it sends the response off to the client.

For more examples on ways to compose middleware, see the [Koa guide](https://github.com/koajs/koa/blob/master/docs/guide.md).

## **Sane Error Handling**

You might have noticed the lack of error handling in the example bits of code. That&#8217;s not actually an oversight. Whether you want a basic catch-all or granular control, Koa is your friend.

In the case of a quick-and-dirty catch-all, Koa has a great built-in fallback when it encounters errors. Consider this contrived example:

```js
app.use(function *() {
  this.body = "...header stuff";
  yield saveResults();
  this.body += "...footer stuff";
});

function *saveResults() {
  // OOPS PROBLEM!
  functionThatDoesntExist();
}
```

Koa catches our blatant error and properly returns a 500 status error to the client. Our app doesn’t crash. It doesn’t need a module like [forever](https://github.com/nodejitsu/forever) to restart it. You don’t need to wrap things in a domain. Of course if your app is in the real world, you’ll want to be more specific, like:

```js
app.use(function *() {
  this.body = "...header stuff";
  try {
    yield saveResults();
  } catch (err) {   
    this.throw(400, 'Results were too awesome')
  }
  //could do some other yield here
  this.body += "...footer stuff"
});
```

Yes, that&#8217;s a bona fide try/catch block. You can call `this.throw` with any message and status code, and Koa will pass it along to the client.

## **Batteries not included**

I’ve heard people refer to Express as a micro-framework. Koa has even less built in, but there’s already a nice set of koa and co modules available for routing, body parsing, basic authentication, static file serving, template rendering, and more. You’ll need to add a few more require statements than you did with Express, but just as with Node itself, Koa seems determined to keep the core really lean. For a simple app I built last week, I ended up using:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><a href="https://github.com/koajs/route">koa-static</a></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><a href="https://github.com/koajs/route">koa-route</a></span>
</li>

(for more robust routing, try [koa-router](https://github.com/alexmingoia/koa-router))

<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><a href="https://github.com/thomseddon/koa-body-parser">koa-body-parser</a></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><a href="https://github.com/visionmedia/co-views">co-views</a></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><a href="https://github.com/leukhin/co-request">co-request</a></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><a href="https://github.com/LearnBoost/monk">monk</a> (for simple MongoDB interactions)</span>
</li>

Although it will take some time for Koa and its underlying technologies to be stable and &#8220;production ready,&#8221; I have a feeling that Koa will catch on fast. Node&#8217;s async callback style is one of the biggest initial hurdles to adoption, and Koa is a pretty slick way to get around it.

## **Will StrongLoop make use of Koa?**

StrongLoop is excited at the potential that Koa presents as a next-generation, lightweight web app framework. The <a href="http://strongloop.com/mobile-application-development/loopback/" target="_blank">LoopBack API Server</a> currently utilizes [Express](http://expressjs.com/) for its web app functions like routing. _What&#8217;s LoopBack?_ It&#8217;s an open source API server powered by Node, for connecting devices and apps to data and services. In the future, LoopBack may migrate from Express to Koa for web app functions like server side rendering, routing and web middleware, if the community and our customers ask for it.

We should note that just as Koa takes advantage of ES6 generators for error handling and middleware flow control, StrongLoop&#8217;s [Bert Belder](https://github.com/piscisaureus) is working on a similar idea called &#8220;[Zones](http://strongloop.com/strongblog/announcing-zones-for-node-js/)&#8220;. (Not to be confused with the Angular [Zone.js](https://github.com/btford/zone.js/) project which shares the same name and some technical characteristics. Yeah, it&#8217;s a little confusing, but we are actively working with [Brian Ford](https://github.com/btford) on how to potentially bring together these two projects for the mutual benefit of the JavaScript and Node communities. Stay tuned!)

## **Why Zones?**

Currently, there are a couple of problems that make it really hard to deal with asynchronous control flow in Node that [Zones](https://github.com/strongloop/zone) looks to address. Specifically:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Stack traces are useless when an asynchronous function fails.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><span style="font-size: 18px;">Asynchronous functions are hard to compose into more high-level APIs. Imagine implementing a simple asynchronous API like bar(arg1, arg2, cb) where cb is the error-first callback that the user of the API specifies. To implement this correctly you must take care:</span></span> <ul>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">to always call the callback</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">don&#8217;t call the callback more than once</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">don&#8217;t synchronously throw and also call the callback</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">don&#8217;t call the callback synchronously</span>
    </li>
  </ul>
</li>

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">It is difficult to handle errors that are raised asynchronously. Typically node will crash. If the uses chooses to ignore the error, resources may leak. Zones should make it easy to handle errors and to avoid resource leaks.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Sometimes there is a need to associate user data to an asynchronous flow. There is currently no way to do this.</span>
</li>

Want to learn more about Zones? Read Bert&#8217;s [blog](http://strongloop.com/strongblog/announcing-zones-for-node-js/), get the [code](https://github.com/strongloop/zone) or watch the [video](http://strongloop.com/developers/videos/#Zones-Next-Generation-Async-Flow-Control-for-Node.js-with-Bert-Belder) presentation.

## **What’s next?**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Install LoopBack with a <a href="http://strongloop.com/get-started/">simple npm command</a></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What’s in the upcoming Node v0.12 version? <a href="http://strongloop.com/strongblog/performance-node-js-v-0-12-whats-new/">Big performance optimizations</a>, read the blog by Ben Noordhuis to learn more.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Need performance monitoring, profiling and cluster capabilites for your Node apps? Check out <a href="http://strongloop.com/node-js-performance/strongops/">StrongOps</a>!</span>
</li>