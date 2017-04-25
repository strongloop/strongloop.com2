---
id: 1051
title: 'Promises in Node.js with Q &#8211; An Alternative to Callbacks'
date: 2013-07-02T19:04:54+00:00
author: Marc Harter
guid: http://blog.strongloop.com/?p=1051
permalink: /strongblog/promises-in-node-js-with-q-an-alternative-to-callbacks/
categories:
  - Community
  - How-To
---
**Note:** The author has provided an updated version of this article, which you can read [here](https://strongloop.com/strongblog/promises-in-node-js-an-alternative-to-callbacks-revisited/).

Promises provide a compelling alternative to raw callbacks when dealing with asynchronous code. Unfortunately, promises can be confusing and perhaps you&#8217;ve written them off. However, significant work has been done to bring out the essential beauty of promises in a way that is interoperable and verifiable. The result is [Promises/A+](http://promises-aplus.github.io/promises-spec/), a specification that is making its way into promise libraries and even the [DOM](http://dom.spec.whatwg.org/#futures).

So what are promises all about and what do they offer when writing Node applications?

## <a href="https://gist.github.com/wavded/2a6c433598bb8a1746cf#promises-in-the-abstract" name="promises-in-the-abstract"></a>**Promises in the abstract**

Let&#8217;s talk about the _behavior_ of promises first to establish what they are and how they can be useful. In the second half of this article, we will discuss how to create promises and use them in your applications with Q.

So what is a promise? Let&#8217;s look at a definition:

> A promise is an abstraction for asynchronous programming. It’s an object that proxies for the return value or the exception thrown by a function that has to do some asynchronous processing. &#8212; [Kris Kowal on JSJ](http://javascriptjabber.com/037-jsj-promises-with-domenic-denicola-and-kris-kowal/)

Callbacks are the simplest mechanism we could have for asynchronous code in JavaScript. Unfortunately, raw callbacks sacrifice the control flow, exception handling and function semantics we are familiar with in synchronous code. Promises provide a way to get those things back.

The core component of a promise object is its `then` method. The `then` method is how we get the return value (known as the fulfillment value) or the exception thrown (known as the rejection reason) from an asynchronous operation. `then` takes two optional callbacks as arguments, which we&#8217;ll call `onFulfilled` and `onRejected`:

```js
var promise = doSomethingAync()
promise.then(onFulfilled, onRejected)
```
`onFulfilled` and `onRejected` are called when the promise is resolved (the asynchronous processing has completed). Only one will ever be triggered since only one resolution is possible.

## <a href="https://gist.github.com/wavded/2a6c433598bb8a1746cf#callbacks-to-promises" name="callbacks-to-promises"></a>**Callbacks to promises**

Given this basic knowledge of promises, let&#8217;s take a look at a familiar asynchronous Node callback:

```js
readFile(function (err, data) {
  if (err) return console.error(err)
  console.log(data)
})
```
If our `readFile` function _returned a promise_ we would write the same logic as:

```js
var promise = readFile()
promise.then(console.log, console.error)
```
At first glance, it looks like just the aesthetics changed. However, we now have access to a _value_ representing the asynchronous operation (the promise). We can pass the promise around and anyone with access to the promise can consume it using `then` _regardless if the asynchronous operation has completed or not_. We also have guarantees that the result of the asynchronous operation won&#8217;t change somehow, as the promise will only be resolved once (either fulfilled or rejected).

> It&#8217;s helpful to think of `then` not just as a function that takes two callbacks (`onFulfilled` and `onRejected`), but as a function that _unwraps_ the promise to reveal what happened from the asynchronous operation. Anyone with access to the promise can use `then` to unwrap it. Read more about this idea [here](http://blog.jcoglan.com/2013/03/30/callbacks-are-imperative-promises-are-functional-nodes-biggest-missed-opportunity/).

## <a href="https://gist.github.com/wavded/2a6c433598bb8a1746cf#chaining-and-nesting-promises" name="chaining-and-nesting-promises"></a>**Chaining and nesting promises**

The `then` method itself _returns a promise_:

```js
var promise = readFile()
var promise2 = promise.then(readAnotherFile, console.error)
```jsThis promise represents the return value for its `onFulfilled` or `onRejected` handlers if specified. Since only one resolution is possible, the promise proxies whichever handler is called:

```

var promise = readFile()
var promise2 = promise.then(function (data) {
  return readAnotherFile() // if readFile was successful, let's readAnotherFile
}, function (err) {
  console.error(err) // if readFile was unsuccessful, let's log it but still readAnotherFile
  return readAnotherFile()
})
promise2.then(console.log, console.error) // the result of readAnotherFile
```js
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

## <a href="https://gist.github.com/wavded/2a6c433598bb8a1746cf#promises-and-synchronous-functions" name="promises-and-synchronous-functions"></a>**Promises and synchronous functions**

Promises model synchronous functions in a number of ways. One such way is using `return` for continuation instead of calling another function. In the previous examples, `readAnotherFile()` was returned to signal what to do after `readFile` was done.

If you return a promise, it will signal the next `then` when the asynchronous operation completes. You can also return any other value and the next `onFulfilled` will be passed the value as an argument:
```

readFile()
  .then(function (buf) {
    return JSON.parse(buf.toString())
  })
  .then(function (data) {
    // do something with `data`
  })
```

## <a href="https://gist.github.com/wavded/2a6c433598bb8a1746cf#error-handling-in-promises" name="error-handling-in-promises"></a>**Error handling in promises**

In addition to `return`, you also can use the `throw` keyword and `try/catch` semantics. This may be one of the most powerful features of promises. To illustrate this, let&#8217;s say we had the following synchronous code:

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
  .then(null, console.error)
```

If `doThisAsync()` is unsuccessful, its promise will be rejected and the next `then` in the chain with an `onRejected` handler will be called. In our case, this is the `console.error` function. And just like `try/catch` blocks, `doThatAsync()` would never get called. This is a huge improvement over raw callbacks in which errors must be handled explicitly at each step.

However, it gets better! Any thrown exception, implicit or explicit, from the `then` callbacks is also handled in promises:

```js
doThisAsync()
  .then(function (data) {
    data.foo.baz = 'bar' // throws a ReferenceError as foo is not defined
  })
  .then(null, console.error)
```
Here the raised `ReferenceError` will be caught by the _next_ `onRejected` handler in the chain. Pretty neat! Of course this works for explicit `throw` as well:
```

doThisAsync()
  .then(function (data) {
    if (!data.baz) throw new Error('Expected baz to be there')
  })
  .then(null, console.error)
```

## <a href="https://gist.github.com/wavded/2a6c433598bb8a1746cf#an-important-note-with-error-handling" name="an-important-note-with-error-handling"></a>**An important note with error handling**

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
To expose masked errors, a solution is to end the promise chain with a simple `.then(null, onRejected)`clause:
```js
readFile()
  .then(function (data) {
    throw new Error('now I know this happened')
  })
  .then(null, console.error)
```
> Libraries include other options for exposing masked errors. For example, Q provides the [done](https://github.com/kriskowal/q#the-end) method to rethrow the error upstream.

## <a href="https://gist.github.com/wavded/2a6c433598bb8a1746cf#promises-in-the-concrete" name="promises-in-the-concrete"></a>**Promises in the concrete**

So far, our examples have used promise-returning dummy methods to illustrate the `then` method from [Promises/A+](http://promisesaplus.com/). Let&#8217;s turn now and look at more concrete examples.

## <a href="https://gist.github.com/wavded/2a6c433598bb8a1746cf#converting-callbacks-to-promises" name="converting-callbacks-to-promises"></a>**Converting callbacks to promises**

You may be wondering how a promise is generated in the first place. The API for creating a promise isn&#8217;t specified in Promise/A+ because its not necessary for interoperability. Therefore, promise libraries will likely vary in implementation. Our examples focus on the excellent [Q](https://github.com/kriskowal/q) library (`npm install q`).

Node core asynchronous functions do not return promises; they take callbacks. However, we can easily make them return promises using Q:

```js
var fs_readFile = Q.denodeify(fs.readFile)
var promise = fs_readFile('myfile.txt')
promise.then(console.log, console.error)> Q provides a number of helper functions for adapting Node and other environments to be promise aware. Check out the [readme](https://github.com/kriskowal/q) and [API documentation](https://github.com/kriskowal/q/wiki/API-Reference) for more details.
```

## <a href="https://gist.github.com/wavded/2a6c433598bb8a1746cf#creating-raw-promises" name="creating-raw-promises"></a>**Creating raw promises**

You can manually create a promise using `Q.defer`. Let&#8217;s say we wanted to manually wrap `fs.readFile` to be promise aware (this is basically what `Q.denodeify` does):

```js
function fs_readFile (file, encoding) {
  var deferred = Q.defer()
  fs.readFile(file, encoding, function (err, data) {
    if (err) deferred.reject(err) // rejects the promise with `er` as the reason
    else deferred.resolve(data) // fulfills the promise with `data` as the value
  })
  return deferred.promise // the promise is returned
}
fs_readFile('myfile.txt').then(console.log, console.error)
```

## <a href="https://gist.github.com/wavded/2a6c433598bb8a1746cf#making-apis-that-support-both-callbacks-and-promises" name="making-apis-that-support-both-callbacks-and-promises"></a>**Making APIs that support both callbacks and promises**

We have seen two ways to turn callback code into promise code. You can also make APIs that provide both a promise and callback interface. For example, let&#8217;s turn `fs.readFile` into an API that supports both callbacks and promises:
```js
function fs_readFile (file, encoding, callback) {
  var deferred = Q.defer()
  fs.readFile(function (err, data) {
    if (err) deferred.reject(err) // rejects the promise with `er` as the reason
    else deferred.resolve(data) // fulfills the promise with `data` as the value
  })
  return deferred.promise.nodeify(callback) // the promise is returned
}
```

If a callback is provided, it will be called with the standard Node style `(err, result)` arguments when the promise is rejected or resolved.
```js
fs_readFile('myfile.txt', 'utf8', function (er, data) {
  // ...
})
```

## <a href="https://gist.github.com/wavded/2a6c433598bb8a1746cf#doing-parallel-operations-with-promises" name="doing-parallel-operations-with-promises"></a>**Doing parallel operations with promises**

So far, we&#8217;ve only talked about sequential asynchronous operations. For parallel operations, Q provides the `Q.all` method which takes in an array of promises and returns a new promise. The new promise is fulfilled after _all_ the operations have completed successfully. If _any_ of the operations fail, the new promise is rejected.
```js
var allPromise = Q.all([ fs_readFile('file1.txt'), fs_readFile('file2.txt') ])
allPromise.then(console.log, console.error)
```
> It&#8217;s important to note again that promises mimic functions. A function only has one return value. When passing `Q.all` two promises that complete successfully, `onFulfilled` will be called with only one argument (an array with both results). This may surprise you; however, consistency with synchronous counterparts is an important guarantee that promises provide. If you want to spread results out into multiple arguments, [Q.spread](https://github.com/kriskowal/q#combination) can be used.

## <a href="https://gist.github.com/wavded/2a6c433598bb8a1746cf#making-promises-even-more-concrete" name="making-promises-even-more-concrete"></a>**Making promises even more concrete**

The best way to really understand promises is to use them. Here are some ideas to get you started:

  1. Wrap some basic Node workflows converting callbacks into promises
  2. Rewrite one of the [async](https://github.com/caolan/async) methods into one that uses promises
  3. Write something recursively using promises (a directory tree might be a good start)
  4. Write a passing [Promise A+ implementation](https://github.com/promises-aplus/promises-tests). Here is my [crude one](https://gist.github.com/wavded/5692344).

## <a href="https://gist.github.com/wavded/2a6c433598bb8a1746cf#further-resources" name="further-resources"></a>**Further resources**

  1. [NodeUp &#8211; fortysix &#8211; a promises by promisers show](http://nodeup.com/fortysix)
  2. [Promises with Domenic Denicola and Kris Kowal](http://javascriptjabber.com/037-jsj-promises-with-domenic-denicola-and-kris-kowal/)
  3. [Redemption from Callback Hell](http://www.youtube.com/watch?v=hf1T_AONQJU&list=PLm8l5qaFJjn_1KdNpp5LEhUCtugd9Kbsf&index=1)
  4. [You&#8217;re Missing the Point of Promises](http://domenic.me/2012/10/14/youre-missing-the-point-of-promises/)
  5. [Callbacks are imperative, promises are functional](http://blog.jcoglan.com/2013/03/30/callbacks-are-imperative-promises-are-functional-nodes-biggest-missed-opportunity/)
  6. [List of Promise/A+ compatible implementations](https://github.com/promises-aplus/promises-spec/blob/master/implementations.md)

Check out our complete [Meetup calendar](http://strongloop.com/developers/events/) to see where you can come meet with StrongLoop and IBM engineers.
