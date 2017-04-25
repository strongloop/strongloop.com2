---
id: 13837
title: Managing Node.js Callback Hell with Promises, Generators and Other Approaches
date: 2014-02-03T19:39:40+00:00
author: Marc Harter
guid: http://strongloop.com/?p=13837
permalink: /strongblog/node-js-callback-hell-promises-generators/
categories:
  - Arc
  - Community
  - How-To
---
We know it most endearingly as “callback hell” or the “pyramid of doom”:

```js
doAsync1(function () {
  doAsync2(function () {
    doAsync3(function () {
      doAsync4(function () {
    })
  })
})
```

Callback hell is subjective, as heavily nested code can be perfectly fine sometimes. Asynchronous code is _hellish_ when it becomes overly complex to manage the flow. A good question to see how much “hell” you are in is: _how much refactoring pain would I endure if_ **_doAsync2_** _happened before_ **_doAsync1_**_?_ The goal isn’t about removing levels of indentation but rather writing modular (and testable!) code that is easy to reason about and resilient.

In this article, we will write a module using a number of tools and libraries to show how control flow can work. We’ll even look at an up and coming solution made possible by the _next_ version of Node.
  
<!--more-->

## **The problem**

Let’s say we want to write a module that finds the largest file within a directory.

```js
var findLargest = require('./findLargest')
findLargest('./path/to/dir', function (er, filename) {
  if (er) return console.error(er)
  console.log('largest file was:', filename)
})
```

Let’s break down the steps to accomplish this:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Read the files in the provided directory</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Get the <a href="http://nodejs.org/api/fs.html#fs_class_fs_stats" target="_blank">stats</a> on each file in the directory</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Determine which is largest (pick one if multiple have the same size)</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Callback with the name of the largest file</span>
</li>

If an error occurs at any point, callback with that error instead. We also should never call the callback more than once.

## **A nested approach**

The first approach is nested, not horribly, but the logic reads inward.

```js
var fs = require('fs')
var path = require('path')

module.exports = function (dir, cb) {
  fs.readdir(dir, function (er, files) { // [1]
    if (er) return cb(er)
    var counter = files.length
    var errored = false
    var stats = []

    files.forEach(function (file, index) {
      fs.stat(path.join(dir,file), function (er, stat) { // [2]
        if (errored) return
        if (er) {
          errored = true
          return cb(er)
        }
        stats[index] = stat // [3]

        if (--counter == 0) { // [4]
          var largest = stats
            .filter(function (stat) { return stat.isFile() }) // [5]
            .reduce(function (prev, next) { // [6]
              if (prev.size > next.size) return prev
              return next
            })
          cb(null, files[stats.indexOf(largest)]) // [7]
        }
      })
    })
  })
}
```

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Read all the files inside the directory</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Gets the stats on each file. This is done in parallel so we are using a <strong>counter</strong> to track when all the I/O has finished. We are also using a <strong>errored</strong> boolean to prevent the provided callback (<strong>cb)</strong> from being called more than once if an error occurs.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Collect the stats for each file. Notice we are setting up a parallel array here (files to stats).</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Check to see if all parallel operations have completed</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Only grab regular files (not links or directories, etc)</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Reduce the list to the largest file</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Pull the filename associated with the stat and callback</span>
</li>

This may be a perfectly fine approach to solving this problem. However, its tricky to manage the parallel operation and ensure we only callback once. We’ll look at managing that a little later, but lets first look at breaking this into smaller modular chunks first.

## **A modular approach**

Our nested approach can be broken out into three modular units:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Grabbing the files from a directory</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Grabbing the stats for those files</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Processing the stats and files to determine the largest</span>
</li>

Since the first task is essentially just **fs.readdir()**, we won’t write a function for that. However, let’s write a function that, given a set of paths, will return all the stats for those paths while maintaining the ordering:

```js
function getStats (paths, cb) {
  var counter = paths.length
  var errored = false
  var stats = []
  paths.forEach(function (path, index) {
    fs.stat(path, function (er, stat) {
      if (errored) return
      if (er) {
        errored = true
        return cb(er)
      }
      stats[index] = stat
      if (--counter == 0) cb(null, stats)
    })
  })
}
```

Now, we need a processing function that compares the stats and files and returns the largest filename:

```js
function getLargestFile (files, stats) {
  var largest = stats
    .filter(function (stat) { return stat.isFile() })
    .reduce(function (prev, next) {
      if (prev.size > next.size) return prev
      return next
    })
    return files[stats.indexOf(largest)]
}
```

Let’s tie the whole thing together:

```js
var fs = require('fs')
var path = require('path')

module.exports = function (dir, cb) {
  fs.readdir(dir, function (er, files) {
    if (er) return cb(er)
    var paths = files.map(function (file) { // [1]
      return path.join(dir,file)
    })

    getStats(paths, function (er, stats) {
      if (er) return cb(er)
      var largestFile = getLargestFile(files, stats)
      cb(null, largestFile)
    })
  })
}
```

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Generate a list of paths from the files and directory</span>
</li>

A modular approach makes reusing and testing methods easier. The main export is easier to reason about as well. However, we are still manually managing the parallel stat task. Let’s switch over to some control flow modules and see what we can do.

## **An async approach**

The <a href="https://github.com/caolan/async" target="_blank">async</a> module is widely popular and stays close to the Node core way of doing things. Let’s take a look at how we could write this using async:

```js
var fs = require('fs')
var async = require('async')
var path = require('path')

module.exports = function (dir, cb) {
  async.waterfall([ // [1]
    function (next) {
      fs.readdir(dir, next)
    },
    function (files, next) {
      var paths = 
       files.map(function (file) { return path.join(dir,file) })
      async.map(paths, fs.stat, function (er, stats) { // [2]
        next(er, files, stats)
      })
    },
    function (files, stats, next) {
      var largest = stats
        .filter(function (stat) { return stat.isFile() })
        .reduce(function (prev, next) {
        if (prev.size > next.size) return prev
          return next
        })
        next(null, files[stats.indexOf(largest)])
    }
  ], cb) // [3]
}
```

<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><a href="https://github.com/caolan/async#waterfalltasks-callback" target="_blank">async.waterfall</a> provides a series flow of execution where data from one operation can be passed to the next function in the series using the <strong>next</strong> callback.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><a href="https://github.com/caolan/async#maparr-iterator-callback" target="_blank">async.map</a> lets us run fs.stat over a set of paths in parallel and calls back with an array (with order maintained) of the results.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">The <strong>cb </strong>function will be called either after the last step has completed or if any error has occurred along the way. It will only be called once.</span>
</li>

The async module guarantees only one callback will be fired. It also propagates errors and manages parallelism for us.

## **A promises approach**

<a href="http://www.html5rocks.com/en/tutorials/es6/promises/" target="_blank">Promises</a> provide error handling and <a href="http://strongloop.com/strongblog/how-to-compose-node-js-promises-with-q/" target="_blank">functional programming perks</a>. How would we approach this problem using promises? For that, let’s utilize the <a href="https://github.com/kriskowal/q" target="_blank">Q</a> module (although other promise libraries could be employed):

```js
var fs = require('fs')
var path = require('path')
var Q = require('q')
var fs_readdir = Q.denodeify(fs.readdir) // [1]
var fs_stat = Q.denodeify(fs.stat)

module.exports = function (dir) {
  return fs_readdir(dir)
    .then(function (files) {
      var promises = files.map(function (file) {
        return fs_stat(path.join(dir,file))
      })
      return Q.all(promises).then(function (stats) { // [2]
        return [files, stats] // [3]
      })
    })
    .then(function (data) { // [4]
      var files = data[0]
      var stats = data[1]
      var largest = stats
        .filter(function (stat) { return stat.isFile() })
        .reduce(function (prev, next) {
        if (prev.size > next.size) return prev
          return next
        })
      return files[stats.indexOf(largest)]
    })
}
```

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Since Node core functionality isn’t promise-aware, we make it so.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><a href="https://github.com/kriskowal/q/wiki/API-Reference#promiseall" target="_blank">Q.all</a> will run all the stat calls in parallel and the result array order is maintained.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Since we want to pass files and stats to the next <strong>then</strong> function, it’s the last thing returned.</span>
</li>

Unlike the previous examples, any _exceptions_ thrown inside the promise chain (i.e. **then**) are caught and handled. The client API changes as well to be promise centric:

```js
var findLargest = require('./findLargest')
findLargest('./path/to/dir')
  .then(function (filename) {
    console.log('largest file was:', filename)
  })
  .catch(console.error)
```

> Although designed this way above, you don’t have to expose a promise interface. Many promise libraries have a way to expose a nodeback style as well. With Q, we could do this using the <a href="https://github.com/kriskowal/q/wiki/API-Reference#wiki-promisenodeifycallback" target="_blank"><strong>nodeify</strong></a> function.

The scope of promises is not developed here. I would recommend reading more about them <a href="http://strongloop.com/strongblog/promises-in-node-js-with-q-an-alternative-to-callbacks/" target="_blank">here</a>.

## **A generators approach**

As promised in at the beginning of the article, there is a new kid on the block that is available to play with in Node >=0.11.2: _generators!_

Generators are lightweight co-routines for JavaScript. They allow a function to be suspended and resumed via the **yield** keyword. Generator functions have a special syntax: **function* ()**. With this superpower, we can also suspend and resume _asynchronous operations_ using constructs such as promises or “thunks” leading to “synchronous-looking” asynchronous code.

> A “thunk” is a function that _returns a callback_ as opposed to calling it_._ The callback has the same signature as your typical nodeback function (i.e. error is the first argument). Read more <a href="https://github.com/visionmedia/co#thunks-vs-promises" target="_blank">here</a>.

Let’s look at one example that enables generators for asynchronous control flow: the <a href="https://github.com/visionmedia/co" target="_blank">co</a> module from TJ Holowaychuk. Here’s how to write our largest file program:

```js
var co = require('co')
var thunkify = require('thunkify')
var fs = require('fs')
var path = require('path')
var readdir = thunkify(fs.readdir) <strong>[1]</strong>
var stat = thunkify(fs.stat)

module.exports = co(function* (dir) { // [2]
  var files = yield readdir(dir) // [3]
  var stats = yield files.map(function (file) { // [4]
    return stat(path.join(dir,file))
  })
  var largest = stats
    .filter(function (stat) { return stat.isFile() })
    .reduce(function (prev, next) {
      if (prev.size > next.size) return prev
      return next
    })
  return files[stats.indexOf(largest)] // [5]
})
```

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Since Node core functionality isn’t “thunk”-aware, we make it so.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">co takes a generator function which can be suspended at anytime using the <strong>yield </strong>keyword</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">The generator function will suspend until <strong>readdir</strong> returns. The resulting value is assigned to the <strong>files</strong> variable.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">co can also handle arrays a set of parallel operations to perform. A result array with order maintained is assigned to <strong>stats</strong>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">The final result is returned.</span>
</li>

We can consume this generator function with the same callback API we specified at the beginning of this article. Co has some nice error handling as any errors (including exceptions raised) will be passed to the callback function. Generators also enable the use of try/catch blocks around yield statements which co takes advantage of:

```js
try {
  var files = yield readdir(dir)
} catch (er) {
  console.error('something happened whilst reading the directory')
}
```

Co has a lot of neat support for arrays, objects, nested generators, promises and more.

> There are other generator modules rising up as well. The Q module has a neat <a href="https://github.com/kriskowal/q/wiki/API-Reference#qasyncgeneratorfunction" target="_blank">Q.async</a> method that behaves similarly to co using generators.

## **Wrapping up**

In this article, we investigated a variety of different approaches to mitigating “callback hell”, that is, getting control over the flow of your application. I am personally most intrigued by the generator idea. I am curious how that will play out with new frameworks like <a href="https://github.com/koajs/koa" target="_blank">koa</a>.

Although we didn’t employ it while looking at the 3rd party modules, a modular approach can be applied to any flow libraries (async, promises, generators). Can you think of ways to make the examples more modular? Have a library or technique that has worked well for you? Share it in the comments!

> Want to check out and play with all the code samples used in this article as well as another generator example? There is a <a href="https://github.com/strongloop-community/handling-callback-hell" target="_blank">GitHub repo</a> set up for that!

## [**Get trained in Node.js and API development**](http://strongloop.com/node-js/training/)**
  
** 

<p dir="ltr">
  Looking for Node.js and API development training? StrongLoop instructors are coming to a city near you:
</p>

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Nov 6-7: <a href="http://strongloop.com/node-js/training-denver-2014/">Denver, CO</a> at Galvanize Campus</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Nov 13-14: <a href="http://strongloop.com/node-js/training-herndon-2014/">Herndon, VA</a> at Vizuri</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Dec 3-4: <a href="http://strongloop.com/node-js/training-framingham-2014/">Framingham, MA</a> at Applause</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Dec 11-12: <a href="http://strongloop.com/node-js/training-minneapolis-2014/">Minneapolis, MN</a> at BestBuy</span>
</li>

Check out our complete [Node.js and API development training, conference and Meetup calendar](http://strongloop.com/developers/events/) to see where you can come meet with StrongLoop engineers.

## **What’s next?**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What&#8217;s in the upcoming Node v0.12 release? <span style="text-decoration: underline;"><a href="http://strongloop.com/strongblog/performance-node-js-v-0-12-whats-new/">Big performance optimizations</a>,</span> read <a href="https://github.com/bnoordhuis">Ben Noordhuis&#8217;</a> blog to learn more.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Watch <a href="https://github.com/piscisaureus">Bert Belder’s</a> comprehensive <a href="http://strongloop.com/developers/videos/#whats-new-in-nodejs-v012">video </a>presentation on all the new upcoming features in v0.12</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.<a href="http://strongloop.com/get-started/"><br /> </a></span>
</li>

<div>
</div>