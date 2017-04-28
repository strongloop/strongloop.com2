---
id: 1420
title: How to Compose Node.js Promises with Q
date: 2013-08-14T12:19:53+00:00
author: Marc Harter
guid: http://blog.strongloop.com/?p=1420
permalink: /strongblog/how-to-compose-node-js-promises-with-q/
categories:
  - How-To
---
In the [last article on promises](http://blog.strongloop.com/promises-in-node-js-with-q-an-alternative-to-callbacks/), we focused on the [Promises/A+](http://promises-aplus.github.io/promises-spec/) specification and [Q](https://github.com/kriskowal/q) implementation of promises. We learned the benefits of using promises over raw callbacks. Now, we&#8217;re going to take it up a notch and focus on promise composition, which we&#8217;ll define as _functional programming and asynchronous control flow using promises_.

## **More about chaining** 

The `then` method allows us to chain promises (see 3.2.6 in [Promises/A+](http://promises-aplus.github.io/promises-spec/) spec). The value returned from a chain of promises is itself a promise. This returned promise will be resolved to the value returned from the last `onFulfilled` or `onRejected` handlers in the chain. Let&#8217;s look at some examples:

```js
var chainPromise = first().then(second).then(third).then(fourth)
chainPromise.then(console.log, console.error)
```

Here, `chainPromise` could either be:

  1. Fulfilled with the return value of `fourth` since it was the last `onFulfilled` handler in the chain _or_
  2. Rejected at any point of the chain since there are no `onRejected` handlers

The same is true for nesting; this code will produce the same behavior as the above example:

```js
var nestedPromise = first().then(function (val1) {
  return second(val1).then(function (val2) {
    return third(val2).then(function (val3) {
      return fourth(val3)
    }
  })
})
nestedPromise.then(console.log, console.error)
```

Armed with this knowledge, we can create a recursive chain that calls a function forever until an error occurs (like [async.forever](https://github.com/caolan/async#foreverfn-callback)):

```js
function forever (fn) {
  return fn().then(function () {
    return forever(fn)  // re-execute if successful
  })
}
// console.error only ever called if an error occurs
forever(doThis).then(undefined, console.error)
```

> **Won&#8217;t this blow the stack?** Unfortunately, JavaScript does not have proper tail call support [yet](http://bbenvie.com/articles/2013-01-06/JavaScript-ES6-Has-Tail-Call-Optimization). However, it won&#8217;t affect this recursive call because Promises/A+ requires the `onFulfilled` and `onRejected` handlers to be called on a future turn in the event loop after the stack unwinds (3.2.4 in Promises/A+).

## **Starting chains and grouping promises** 

In addition to the functional programming concepts we enjoy in synchronous programming, promise libraries like Q provide tools to aid in composition. We&#8217;ll focus on two of them: `Q()` and `all`.

`Q(value)` helps us start promise chains. If no `value` is provided, a promise is returned fulfilled to `undefined`. We&#8217;ll call this an &#8220;empty&#8221; promise. If a `value` is provided, a promise is returned fulfilled to that value:

```js
<code class="js">Q('monkeys').then(console.log) // will log 'monkeys'
</code>
```

> `Q()` also converts promises from other libraries, but we won&#8217;t be using that here.

The second tool is `all` which has static (`Q.all`) and instance (`promise.all`) methods. `all` takes an array of promises and returns a new promise, which we&#8217;ll call a &#8220;group&#8221; promise. The group promise will either be resolved when _all_ the promises have been fulfilled or rejected when _any_ have been rejected.

`all` is helpful for grouping the fulfillment values from multiple promises, regardless if the execution is done in series or parallel.

The static (`Q.all`) method looks like this:

```js
var groupPromise = Q.all([ doThis(), doThat() ])
groupPromise.then(function (results) { }, console.error)
```

`all` maintains the ordering of the results array, so the result of `doThis()` would be index `` and so on. If either `doThis()` or `doThat()` had an error, `groupPromise` would be rejected and we&#8217;d log it with `console.error`.

The instance (`promise.all`) method is typically used in chains and looks like this:

```js
Q()
  .then(function () {
    return [ doThis(), doThat() ] // return a list
  })
  .all()
  .then(function (results) { }, console.error)
```

Note that `promise.all` has the same function signature as `then`, so we could have just said:

```js
.all(function (results) { }, console.error)
```

## **Working with collections** 

Let&#8217;s look at iterating through collections of data that require asynchronous action per element. First, let&#8217;s mimic [async.map](https://github.com/caolan/async#map) using promises:

```js
function map (arr, iterator) {
  // execute the func for each element in the array and collect the results
  var promises = arr.map(function (el) { return iterator(el) })
  return Q.all(promises) // return the group promise
}
```

We could then utilize this function as such:

```js
// turn fs.stat into a promise-returning function
var fs_stat = Q.denodify(fs.stat)
map(['list', 'of', 'files'], fs_stat).then(console.log, console.error)
```

The beauty of this approach is that _any_ function will work, not just promise-returning ones. For example, let&#8217;s say we wanted to `stat` only the files we do not already have in our cache:

```js
var cache = Object.create(null) // create empty object
function statCache (file) {
   // return the cached value if exists
  if (cache[file]) return cache[file]

  // generate a promise for the stat call
  var promise = fs_stat(file)
  // if that promise is fulfilled, cache it!
  promise.then(function (stat) { cache[file] = stat })

  return promise // return the promise
}
map(['list', 'of', 'files'], statCache).then(console.log, console.error)
```

Here, `statCache` returns a value or a promise. Regardless of what&#8217;s returned, we can group it and provide the results with `all`. Sweet!

> How can this work? The `all` method also takes in values as arguments which internally it tranforms into a promises fulfilled to those values.

However, there is a problem with our `map` function. What if an exception is thrown in `statCache`? Right now, the exception wouldn&#8217;t be caught since it isn&#8217;t in a promise chain. Here is where `Q()` comes in:

```js
function map (arr, func) {
  return Q().then(function () {
    // inside a `then`, exceptions will be handled in next onRejected
    return arr.map(function (el) { return func(el) })
  }).all() // return group promise
}
```

So we talked about iterating through a collection with promises in parallel, but what about iterations in series (like [async.mapSeries](https://github.com/caolan/async#mapseriesarr-iterator-callback))? Here is one approach (thanks [@domenic](https://twitter.com/domenic)):

```js
function mapSeries (arr, iterator) {
  // create a empty promise to start our series (so we can use `then`)
  var currentPromise = Q()
  var promises = arr.map(function (el) {
    return currentPromise = currentPromise.then(function () {
      // execute the next function after the previous has resolved successfully
      return iterator(el)
    })
  })
  // group the results and return the group promise
  return Q.all(promises)
}
```

In the above example, we used `all` to group operations done in series and `Q()` to start our promise chain. Each time through `arr.map`, we built a larger chain and returned a promise for that point in the chain until we reached the end of the array. If we unraveled this code, it would look something like this:

```js
var promises = []
var series1 = Q().then(first)
promises.push(series1)
var series2 = series1.then(second)
promises.push(series2)
var series3 = series2.then(third)
promises.push(series3)
// ... etc
Q.all(promises)
```

When structured this way, we maintain the order (seconds won&#8217;t be called until firsts are done) and gain grouping (the last
  
promise fulfillment value in each chain is grouped).

## **Going further with promises** 

For more examples of chaining and grouping promises, this [gist](https://gist.github.com/wavded/6116786) implements most of the [async](https://github.com/caolan/async) API. However, your best grasp of these concepts will come by playing around with them. Here are some ideas:

  1. Try implementing `map` or `mapSeries` another way
  2. Implement the [async](https://github.com/caolan/async) API using another promise library
  3. Write a network server (web or otherwise) using promises &#8212; for inspiration, check out [mach](https://github.com/machjs/mach)

And from the previous article:

  1. Wrap some basic Node workflows converting callbacks into promises
  2. Rewrite one of the [async](https://github.com/caolan/async) methods into one that uses promises
  3. Write something recursively using promises (a directory tree might be a good start)
  4. Write a passing [Promise A+ implementation](https://github.com/promises-aplus/promises-tests). Here is my [crude one](https://gist.github.com/wavded/5692344).

## **[Use StrongOps to Monitor Node Apps](http://strongloop.com/node-js-performance/strongops/)
  
** 

Ready to start monitoring event loops, manage Node clusters and chase down memory leaks? We’ve made it easy to get started with [StrongOps](http://strongloop.com/node-js-performance/strongops/) either locally or on your favorite cloud, with a [simple npm install](http://strongloop.com/get-started/).

<a href="http://strongloop.com/wp-content/uploads/2014/02/Screen-Shot-2014-02-03-at-3.25.40-AM.png" rel="lightbox"><img src="http://strongloop.com/wp-content/uploads/2014/02/Screen-Shot-2014-02-03-at-3.25.40-AM.png" alt="Screen Shot 2014-02-03 at 3.25.40 AM" width="1746" height="674" /></a>

## **What’s next?**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js <a href="http://strongloop.com/node-js/loopback/">LoopBack framework</a>. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
</li>

&nbsp;