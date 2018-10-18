---
id: 27848
title: 'Promises in Node.js &#8211; An Alternative to Callbacks'
date: 2016-08-24T08:00:20+00:00
author: Marc Harter
guid: https://strongloop.com/?p=27848
permalink: /strongblog/promises-in-node-js-an-alternative-to-callbacks/
categories:
  - How-To
---

**Note:** This blog post is also available at [IBM DeveloperWorks](https://developer.ibm.com/node/2016/08/24/promises-in-node-js-an-alternative-to-callbacks/).  

Promises are a compelling alternative to callbacks when dealing with asynchronous code. Unfortunately, promises can be confusing and perhaps you&#8217;ve written them off. However, significant work has been done to bring out the essential beauty of promises in a way that is interoperable and verifiable. The result is [Promises/A+](http://promises-aplus.github.io/promises-spec/), a specification that has made its way into ES6 JavaScript as well as multiple third-party libraries.

So what are promises and what do they offer Node developers?

<!--more-->

## Promises in the abstract

First we&#8217;ll talk about the _behavior_ of promises: What are they and how can they be useful? Then we&#8217;ll discuss how to create and use promises.

So what is a promise? Let&#8217;s look at a definition:

> A promise is an abstraction for asynchronous programming. It’s an object that proxies for the return value or the exception thrown by a function that has to do some asynchronous processing. &#8212; [Kris Kowal on JSJ](http://javascriptjabber.com/037-jsj-promises-with-domenic-denicola-and-kris-kowal/)

Callbacks are the simplest possible mechanism for asynchronous code in JavaScript. Unfortunately, raw callbacks sacrifice the control flow, exception handling, and function semantics familiar from synchronous code. Promises provide a way to get those things back.

The core component of a promise object is its `then` method. The `then` method is how we get the return value (known as the _fulfillment value_) or the exception thrown (known as the _rejection reason_) from an asynchronous operation. `then` takes two optional callbacks as arguments, which we&#8217;ll call `onFulfilled` and `onRejected`:

```js
var promise = doSomethingAync()
promise.then(onFulfilled, onRejected)
```

`onFulfilled` and `onRejected` are called when the promise is resolved (the asynchronous processing has completed). Only one will ever be triggered since only one resolution is possible.

## **Callbacks to promises**

Given this basic knowledge of promises, let&#8217;s take a look at a familiar asynchronous Node callback:

```js
readFile(function (err, data) {
  if (err) return console.error(err)
  console.log(data)
})
```

If our `readFile` function _returned a promise,_ we would write the same logic as:

```js
var promise = readFile()
promise.then(console.log, console.error)
```

At first glance, it looks like just the aesthetics changed. However, we now have access to a _value_ representing the asynchronous operation (the promise). We can pass the promise around and anyone with access to the promise can consume it using `then` _regardless if the asynchronous operation has completed or not_. We also have guarantees that the result of the asynchronous operation won&#8217;t change somehow, as the promise will only be resolved once (either fulfilled or rejected).

> It&#8217;s helpful to think of `then` not just as a function that takes two callbacks (`onFulfilled`  and `onRejected`), but as a function that _unwraps_ the promise to reveal what happened from the asynchronous operation. Anyone with access to the promise can use `then` to unwrap it. For more about this idea, read [Callbacks are imperative, promises are functional: Node’s biggest missed opportunity](http://blog.jcoglan.com/2013/03/30/callbacks-are-imperative-promises-are-functional-nodes-biggest-missed-opportunity/).

## **Chaining and nesting promises**

The `then` method itself _returns a promise_:

```js
var promise = readFile()
var promise2 = promise.then(readAnotherFile, console.error)
```

This promise represents the return value for its `onFulfilled` or `onRejected` handlers if specified. Since only one resolution is possible, the promise proxies whichever handler is called:

```js
var promise = readFile()
var promise2 = promise.then(function (data) {
  return readAnotherFile() // if readFile was successful, let's readAnotherFile
}, function (err) {
  console.error(err) // if readFile was unsuccessful, let's log it but still readAnotherFile
  return readAnotherFile()
})
promise2.then(console.log, console.error) // the result of readAnotherFile
```

Since `then` returns a promise, it means promises can be chained to avoid [callback hell](http://callbackhell.com/):

```js
readFile()
  .then(readAnotherFile)
  .then(doSomethingElse)
  .then(...)
```

Promises can be nested as well if keeping a closure alive is important:

```js
readFile()
  .then(function (data) {
    return readAnotherFile().then(function () {
      // do something with `data`
    })
  })
```

## **Promises and synchronous functions**

Promises model synchronous functions in a number of ways. One such way is using `return` for continuation instead of calling another function. The previous examples returned `readAnotherFile()` to signal what to do after `readFile()` was done.

If you return a promise, it will signal the next `then` when the asynchronous operation completes. You can also return any other value and the next `onFulfilled` will be passed the value as an argument:

```js
readFile()
  .then(function (buf) {
    return JSON.parse(buf.toString())
  })
  .then(function (data) {
    // do something with `data`
  })
```

## **Error handling in promises**

In addition to `return`, you also can use the `throw` keyword and `try/catch` semantics. This may be one of the most powerful features of promises. For example, consider the following synchronous code:

```js
try {
  doThis()
  doThat()
} catch (err) {
  console.error(err)
}
```

In this example, if `doThis()` or `doThat()` would `throw` an error, we would `catch` and log the error. Since `try/catch` blocks allow multiple operations to be grouped, we can avoid having to explicitly handle errors for each operation. We can do this same thing asynchronously with promises:

```js
doThisAsync()
  .then(doThatAsync)
  .then(undefined, console.error)
```

If `doThisAsync()` is unsuccessful, its promise will be rejected and the next `then` in the chain with an `onRejected` handler will be called. In our case, this is the `console.error` function. And just like `try/catch` blocks, `doThatAsync()` would never get called. This is a huge improvement over raw callbacks where you have to handle errors explicitly at each step.

However, it gets better! Any thrown exception, implicit or explicit, from the `then` callbacks is also handled in promises:

```js
doThisAsync()
  .then(function (data) {
    data.foo.baz = 'bar' // throws a ReferenceError as foo is not defined
  })
  .then(undefined, console.error)
```

Here the raised `ReferenceError` will be caught by the _next_ `onRejected` handler in the chain. Pretty neat! Of course, this works for explicit `throw` as well:

```js
doThisAsync()
  .then(function (data) {
    if (!data.baz) throw new Error('Expected baz to be there')
  })
  .catch(console.error) // catch(fn) is shorthand for .then(undefined, fn)

```

## **An important note with error handling**

As stated earlier, promises mimic `try/catch` semantics. In a `try/catch` block, it&#8217;s possible to mask an error by never explicitly handling it:

```js
try {
  throw new Error('never will know this happened')
} catch (e) {}
```

The same goes for promises:

```js
readFile()
  .then(function (data) {
    throw new Error('never will know this happened')
  })
```

To expose masked errors, a solution is to end the promise chain with a simple `.catch(onRejected) `clause:

```js
readFile()
  .then(function (data) {
    throw new Error('now I know this happened')
  })
  .catch(console.error)
```

Third-party libraries include options for exposing un-handled rejections.

## **Promises in the concrete**

So far, our examples have used promise-returning dummy methods to illustrate the `then` method from ES6 and [Promises/A+](http://promisesaplus.com/). Let&#8217;s turn now and look at more concrete examples.

## **Converting callbacks to promises**

You may be wondering how a promise is generated in the first place. The API for creating a promise isn&#8217;t specified in Promise/A+ because it&#8217;s not necessary for interoperability. However, ES6 did standardize a Promise constructor which we will come back to.  One of the most common cases for use promises is converting existing callback-based libraries.  Here, promise libraries like [Bluebird](http://bluebirdjs.com/) can provide convenient helpers.

For example, Node&#8217;s core asynchronous functions do not return promises; they take callbacks. However, we can easily make them return promises using Bluebird:

```js
var fs = Bluebird.promisifyAll(fs)
var promise = fs.readFileAsync('myfile.txt')
promise.then(console.log, console.error)
```

Bluebird provides a number of helper functions for adapting Node and other environments to be promise-aware. Check out the [API documentation](http://bluebirdjs.com/docs/api/promisification.html) for more details.

## **Creating raw promises**

You can manually create a promise using the Promise constructor. Let&#8217;s say we wanted to manually wrap `fs.readFile` to be promise-aware:

```js
function readFileAsync (file, encoding) {
  return new Promise(function (resolve, reject) {
    fs.readFile(file, encoding, function (err, data) {
      if (err) return reject(err) // rejects the promise with `err` as the reason
      resolve(data)               // fulfills the promise with `data` as the value
    })
  })
}
readFileAsync('myfile.txt').then(console.log, console.error)
```

## **Making APIs that support both callbacks and promises**

We have seen two ways to turn callback code into promise code. You can also make APIs that provide both a promise and callback interface. For example, let&#8217;s turn `fs.readFile` into an API that supports both callbacks and promises:

```js
function readFileAsync (file, encoding, cb) {
  if (cb) return fs.readFile(file, encoding, cb)

  return new Promise(function (resolve, reject) {
    fs.readFile(function (err, data) {
      if (err) return reject(err)
      resolve(data)
    })
  })
}
```

If a callback is provided, it will be called with the standard Node style `(err, result)` arguments.

```js
readFileAsync('myfile.txt', 'utf8', function (er, data) {
  // ...
})
```

## **Doing parallel operations with promises**

So far, we&#8217;ve only talked about sequential asynchronous operations. For parallel operations, ES6 provides the `Promise.all` method which takes in an array of promises and returns a new promise. The new promise is fulfilled after _all_ the operations have completed successfully. If _any_ of the operations fail, the new promise is rejected.

```js
var allPromise = Promise.all([ fs_readFile('file1.txt'), fs_readFile('file2.txt') ])
allPromise.then(console.log, console.error)
```

> It&#8217;s important to note again that promises mimic functions. A function only has one return value. When passing `Promise.all` two promises that complete successfully, `onFulfilled` will be called with only one argument (an array with both results). This may surprise you; however, consistency with synchronous counterparts is an important guarantee that promises provide.

## **Making promises even more concrete**

The best way to really understand promises is to use them. Here are some ideas to get you started:

  * Wrap some basic Node workflows, converting callbacks into promises.
  * Rewrite an [async](https://github.com/caolan/async) method into one that uses promises.
  * Write something recursively using promises (a directory tree would be a good start).
  * Write a passing [Promise A+ implementation](https://github.com/promises-aplus/promises-tests). Here is my [crude one](https://gist.github.com/wavded/5692344).

## Further Resources

  * [ES6 Promise Specification](http://www.ecma-international.org/ecma-262/6.0/#sec-promise-objects)
  * [NodeUp &#8211; fortysix &#8211; a promises by promisers show](http://nodeup.com/fortysix)
  * [Promises with Domenic Denicola and Kris Kowal](http://javascriptjabber.com/037-jsj-promises-with-domenic-denicola-and-kris-kowal/)
  * [Redemption from Callback Hell](http://www.youtube.com/watch?v=hf1T_AONQJU&list=PLm8l5qaFJjn_1KdNpp5LEhUCtugd9Kbsf&index=1)
  * [You&#8217;re Missing the Point of Promises](http://domenic.me/2012/10/14/youre-missing-the-point-of-promises/)
  * [Callbacks are imperative, promises are functional](http://blog.jcoglan.com/2013/03/30/callbacks-are-imperative-promises-are-functional-nodes-biggest-missed-opportunity/)
  * [List of Promise/A+ compatible implementations](https://github.com/promises-aplus/promises-spec/blob/master/implementations.md)
