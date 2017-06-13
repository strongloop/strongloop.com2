---
id: 15566
title: Comparing Node.js Promises, Try/Catch, Angular Zone.js and yes, Zone
date: 2014-04-15T15:32:51+00:00
author: Alex Gorbatchev
guid: http://strongloop.com/?p=15566
permalink: /strongblog/comparing-node-js-promises-trycatch-zone-js-angular/
categories:
  - Community
  - How-To
---
<h2 dir="ltr">
  <strong>Handling errors in asynchronous flow</strong>
</h2>

<p dir="ltr">
  In a <a href="http://strongloop.com/strongblog/node-js-callback-hell-promises-generators/">previous article</a> we talked about managing async flow and escaping the <a href="http://callbackhell.com/">callback hell</a>.
</p>

<h2 dir="ltr">
  <strong>The problem</strong>
</h2>

<p dir="ltr">
  Handling errors in synchronous flow is pretty straightforward and easy. Handling errors in asynchronous flow in a <em>clean and easy to follow manner</em> &#8211; not so much.
</p>

<p dir="ltr">
  Lets look at the following code:
</p>

```js
  function updateDependencies(packageName, done) {
     findPackage(packageName, function(err, content) {
       if (err) {
         done(err);
       }
       else {
         try {
           package = JSON.parse(content);
         }
         catch (e) {
           return done(e);
         }

        findDependencies(package, function(err, dependencies)) {
           if (err) {
             done(err);
           }
           else {
             processDependencies(dependencies, function(err) {
               if (err) {
                 done(err);
               }
               else {
                 done(null, dependencies);
               }
             });
           }
         });
       }
     });
   }
```

<p dir="ltr">
  We are covering all possible failure cases here using combination of try/catch and callback error handling, but boy do we repeat ourselves over and over again. Lets try and rewrite this!
</p>

<p dir="ltr">
  <!--more-->
</p>

<h2 dir="ltr">
  <strong>Error handling using Try/Catch</strong>
</h2>

```js
 function updateDependencies(packageName, done) {
     try {
       findPackage(packageName, function(err, content) {
         if (err) throw err;

        findDependencies(JSON.parse(content), function(err, dependencies)) {
           if (err) throw err;

          processDependencies(dependencies, function(err) {
             if (err) throw err;

            done(null, dependencies);
           });
         });
       });
     } catch (e) {
       done(e);
     } 
   }
```

<p dir="ltr">
  Nice! That&#8217;s much better. However, if we run this now, no errors will be caught. What&#8217;s going on here?
</p>

<p dir="ltr">
  try/catch idiom works very well when you have fully synchronous code, but asynchronous operations render it useless.
</p>

<p dir="ltr">
  The outer try/catch block will never catch anything because findPackage is asynchronous. The function will begin its course while the outer stack runs through and gets to the last line without any errors.
</p>

<p dir="ltr">
  If an error occurs at some point in the future inside asynchronous findPackage &#8211; nothing will be caught.
</p>

<p dir="ltr">
  <a href="{{site.url}}/blog-assets/2014/04/not-useful.gif"><img class="aligncenter size-medium wp-image-27790" src="{{site.url}}/blog-assets/2014/04/not-useful-300x169.gif" alt="not useful" width="300" height="169" /></a>
</p>

<p dir="ltr">
  Not useful.
</p>

<h2 dir="ltr">
  <strong>Error handling using Promises</strong>
</h2>

<p dir="ltr">
  In the<a href="http://strongloop.com/strongblog/node-js-callback-hell-promises-generators/"> previous article</a> we&#8217;ve talked about managing asynchronous flow and escaping the<a href="http://callbackhell.com/"> callback hell</a> with promises. Lets put this promises to work here and rewrite this function.
</p>

<p dir="ltr">
  For the sake of moving forward quicker lets assume we are using<a href="https://github.com/petkaantonov/bluebird"> Bluebird</a> promises library and that all our APIs now return promises instead of taking callbacks:
</p>

```js
  function updateDependencies(packageName) {
     return findPackage(packageName)
       .then(JSON.parse)
       .then(findDependencies)
       .then(processDependencies)
       .then(res.send)
       ;
   }
```

<p dir="ltr">
  Oh wow, that is so much nicer! Right? Right!
</p>

<p dir="ltr">
  But Alex, &#8220;we&#8217;ve lost our error handling&#8221;, you might say. That&#8217;s right, we don&#8217;t need to do anything special here to propagate error because we return a promise and there&#8217;s built in support for error flow. Lets see how error handling might look like with promises:
</p>

```js
  button.addEventListener("click", function() {
     updateDependencies("packageName")
       .then(function(dependencies) {
         output.innerHTML = dependencies.join("\n");
       })
       .catch(function(err) {
         output.innerHTML = "There was an error";
       });
   });
```

<p dir="ltr">
  Very slick, I&#8217;m a fan!
</p>

<h2 dir="ltr">
  <strong>Error using Zones</strong>
</h2>

<p dir="ltr">
  Handling rejected promises works really well when we are in full control of the flow. But what happens if some third-party code throws an error during an asynchronous operation? Lets look at another example:
</p>

```js
function thirdPartyFunction() {
     function fakeXHR() {
       throw new Error("Invalid dependencies");
     }

    setTimeout(fakeXHR, 100);
   }

  function main() {
     button.on("click", function onClick() {
       thirdPartyFunction();
     });
   }

  main();
```

<p dir="ltr">
  In this case, we wouldn&#8217;t have a chance to catch and process the error. Generally, the only recourse here is using half baked window.onerror that doesn&#8217;t give you any stack information at all. At least you can log something, right? Not that there&#8217;s much to log:
</p>

```js
 Uncaught Error: Invalid dependencies
       fakeXHR
```

<p dir="ltr">
  Up until recently that was pretty much all we had. However, this january<a href="https://github.com/btford"> Brian Ford</a> of the<a href="http://angularjs.org/"> angular.js</a> fame has released<a href="https://github.com/btford/zone.js/"> Zone.js</a> which aims to help tackle this.
</p>

<p dir="ltr">
  Basically,<a href="https://github.com/btford/zone.js/"> Zone.js</a> overrides all asynchronous functions in the browser with custom implementations which allows it to keep track of the context. Dangerous? Yes! But as we say in Soviet Russia, &#8220;he who doesn&#8217;t risk never gets to drink champagne&#8221; (or in English &#8220;nothing ventured, nothing gained&#8221;).
</p>

<p dir="ltr">
  Anyways, lets look at how this works. Assuming you have included zones.js and long-stack-trace-zone.js as per the docs, we just change main() call to:
</p>

```js
  zone.fork(Zone.longStackTraceZone).run(main);
```

<p dir="ltr">
  Refresh, click the button, and now our stack looks like this:
</p>

```js
  Error: Invalid dependencies
       at fakeXHR (script.js:7:11)
       at Zone.run (zones.js:41:19)
       at zoneBoundFn (zones.js:27:19)
   --- Tue Mar 25 2014 21:20:32 GMT-0700 (PDT) - 106ms ago
   Error
       at Function.getStacktraceWithUncaughtError (long-stack-trace-zone.js:24:32)
       at Zone.longStackTraceZone.fork (long-stack-trace-zone.js:70:43)
       at Zone.bind (zones.js:25:21)
       at zone.(anonymous function) (zones.js:61:27)
       at marker (zones.js:66:25)
       at thirdPartyFunction (script.js:10:3)
       at HTMLButtonElement.onClick (script.js:15:5)
       at HTMLButtonElement.x.event.dispatch (jquery.js:5:10006)
       at HTMLButtonElement.y.handle (jquery.js:5:6789)
       at Zone.run (zones.js:41:19)
   --- Tue Mar 25 2014 21:20:32 GMT-0700 (PDT) - 1064ms ago
   Error
       at getStacktraceWithUncaughtError (long-stack-trace-zone.js:24:32)
       at Function.Zone.getStacktrace (long-stack-trace-zone.js:37:15)
       at Zone.longStackTraceZone.fork (long-stack-trace-zone.js:70:43)
       at Zone.bind (zones.js:25:21)
       at HTMLButtonElement.obj.addEventListener (zones.js:132:37)
       at Object.x.event.add (jquery.js:5:7262)
       at HTMLButtonElement. (jquery.js:5:14336)
       at Function.x.extend.each (jquery.js:4:4575)
       at x.fn.x.each (jquery.js:4:1626)
       at x.fn.extend.on (jquery.js:5:14312)
```

<p dir="ltr">
  What the what?? Cool! We can now see that the relevant code path started in our onClick method and went into thirdPartyFunction.
</p>

<p dir="ltr">
  The cool part is, since<a href="https://github.com/btford/zone.js/"> Zone.js</a> overrides browser methods, it doesn&#8217;t matter what libraries you use. It just works.
</p>

<h2 dir="ltr">
  <strong>Another async flow control project called Zone?</strong>
</h2>

<p dir="ltr">
  Yep, StrongLoop’s<a href="https://github.com/piscisaureus"> Bert Belder</a> has been working on a similar idea called “<a href="https://www.npmjs.org/package/zone">Zone</a>“ for a few months now. (Not to be confused with the Angular<a href="https://github.com/btford/zone.js/"> Zone.js</a> project we&#8217;ve just been discussing, which shares the same name and some technical characteristics. Yeah, it’s a little confusing, but we are actively working with<a href="https://github.com/btford"> Brian Ford</a> on how to potentially bring together these two projects for the mutual benefit of the JavaScript and Node communities. Stay tuned!)
</p>

<h2 dir="ltr">
  <strong>Why a Node specific Zone project?</strong>
</h2>

Currently, there are a couple of problems that make it really hard to deal with asynchronous control flow in Node that Zones looks to address. Specifically:

  * Stack traces are useless when an asynchronous function fails.
  * Asynchronous functions are hard to compose into more high-level APIs. Imagine implementing a simple asynchronous API like bar(arg1, arg2, cb) where cb is the error-first callback that the user of the API specifies. To implement this correctly you must take care: 
      * to always call the callback
      * don’t call the callback more than once
      * don’t synchronously throw and also call the callback
      * don’t call the callback synchronously
  * It is difficult to handle errors that are raised asynchronously. Typically node will crash. If the uses chooses to ignore the error, resources may leak. Zones should make it easy to handle errors and to avoid resource leaks.
  * Sometimes there is a need to associate user data to an asynchronous flow. There is currently no way to do this.

Want to learn more about Zones? Stay tuned for more information in the coming weeks. Follow us on [Twitter](https://twitter.com/StrongLoop) or subscribe to our [newsletter](http://strongloop.com/newsletter-registration/) to make sure you don’t miss the announcements.

<h2 dir="ltr">
  <strong>What’s Next?</strong>
</h2>

  * Watch <a href="https://web.archive.org/web/20150207114217/http://www.youtube.com/watch?v=3IqtmUscE_U" rel="lightbox">Brian’s presentation</a> from ngconf 2014, it’s pretty cool!
  * Add [Zone.js](https://web.archive.org/web/20150207114217/http://github.com/btford/zone.js/) to your application.
  * Profit!
  * Need performance monitoring, profiling and cluster capabilites for your Node apps? Check out [StrongOps](https://web.archive.org/web/20150207114217/http://strongloop.com/node-js-performance/strongops/)!

<img class="aligncenter" src="https://web.archive.org/web/20150207114217im_/http://lh3.googleusercontent.com/YEOX6zIZUkK1sOQso5H1xeFDnAho4ZlTEC6dJW_X-kAqRc6Y2n_o1cOViTRj0s1Mloq0IHToJqXugT8BFcxtHoZKeMU9Woe4lVXMvi6OCBnM5kAT1qGWFRNZS4F8j5ylrQ" alt="profit" width="498px;" height="210px;" />
