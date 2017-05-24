---
id: 15897
title: 'Generators in Node.js: Common Misconceptions and Three Good Use Cases'
date: 2014-05-06T08:16:53+00:00
author: Marc Harter
guid: http://strongloop.com/?p=15897
permalink: /strongblog/how-to-generators-node-js-yield-use-cases/
categories:
  - Community
  - How-To
---
Generators have been <a href="https://github.com/visionmedia/co" target="_blank">all</a> <a href="https://github.com/koajs/koa" target="_blank">the</a> <a href="https://github.com/cujojs/when/blob/master/docs/api.md#es6-generators" target="_blank">rage</a> <a href="http://facebook.github.io/regenerator/" target="_blank">lately</a>. Many Node developers (including myself!) are excited and intrigued about writing their asynchronous code like this:

```js
var a = yield doAsyncFn()
var b = yield doAyncFnThatDependsOnA(a)
console.log(b)
```

However, this is just _one_ use case (although a clever one) of using generators.

In this article, we will explore the strengths of using generators. There is a <a href="https://github.com/strongloop/example-generators" target="_blank">GitHub repository</a> with the code samples we will go through that you can check out. You will also need Node 0.11.x (w/ the `--harmony` flag) or greater to run these examples. I personally use <a href="https://github.com/creationix/nvm" target="_blank">nvm</a> for this.<!--more-->

## **What is a generator?**

Generators are function executions that can be suspended and resumed at a later point; a lightweight <a href="http://en.wikipedia.org/wiki/Coroutine" target="_blank">coroutine</a>. This behavior happens using special generator functions (noted by **function*** syntax) and a couple of new keywords (**yield** and **yield*)** which are only used in the context of a generator:

```js
function* generatorFn () {
  console.log('look ma I was suspended')
}
var generator = generatorFn() // [1]
setTimeout(function () {
  generator.next() // [2]
}, 2000)
```

  1. A generator _starts_ in a suspended state. No console output.
  2. By invoking **next()** on the generator, it will execute up _until_ it hits the next **yield** keyword or returns. Now we have console output.

Generators also have a built-in communication channel with **yield**:

```js
function* channel () {
  var name = yield 'hello, what is your name?' // [1]
  return 'well hi there ' + name
}
var gen = channel()
console.log(gen.next().value) // hello, what is your name? [2]
console.log(gen.next('billy')) // well hi there billy [3]
```

  1. The **yield** keyword must always yield _some_ value (even if its **null**). When execution resumes, it can optionally _receive_ a value with the use of **gen.next(value)**.
  2. The object returned from **gen.next()** includes a **value** and a **done** property. The **value** property is the currently yielded (or returned) value from the generator. The **done** property is a Boolean indicating whether or not the generator has run to completion.
  3. We can send a value into the generator using **gen.next(value)**. The value is then assigned to **name**, in this example, as the generator resumes.

In addition to communicating values, you can also throw exceptions into generators with **gen.throw(new Error(‘oh no’))**.

Generators may be used for iteration via the shiny new **for of** loop:

```js
function* iter () {
 for (var i = 0; i < 10; i++) yield i
}
for (var val of iter()) {
 console.log(val) // outputs 0 — 9
}
```

> **What is yield* all about?** The yield* keyword enables a generator function to yield to another generator function. This essentially gives control over to the other generator function until it has exhausted all of its yields and then it returns control to the originating generator. It should not be thought of as a way to do recursion with generators <a href="https://twitter.com/wavded/status/459089012209090560" target="_blank">as I learned</a>.

## **A common misconception**

Now that I can suspend functions, I can run all this stuff in parallel right? No. __JavaScript is _still_ single-threaded, but now we have the ability to say STOP in the middle of a function.

[<img class="aligncenter size-full wp-image-15899" alt="876" src="{{site.url}}/blog-assets/2014/04/876.jpg" width="512" height="288" />]({{site.url}}/blog-assets/2014/04/876.jpg)

If you are looking to bolster raw performance, generators may not be your ticket. Here’s a sample CPU intensive task, calculating a Fibonacci sequence number:

```js
function fib (n) {
  var current = 0, next = 1, swap
  for (var i = 0; i < n; i++) {
    swap = current, current = next
    next = swap + next
  }
  return current
}
```

Now, we write a similar function using generators:

```js
function* fibGen (n) {
  var current = 0, next = 1, swap
  for (var i = 0; i < n; i++) {
    swap = current, current = next
    next = swap + next
    yield current
  }
}
```

The functions are almost identical, the first returns the final result, the second yields each result up until the final result.

If we were to benchmark these two using Benchmark.js:

```js
var suite = new (require(‘benchmark’)).Suite
suite
 .add(‘regular’, function () {
   fib(20)
 })
 .add(‘generator’, function () {
   for (var n of fibGen(20));
 })
 .on(‘complete’, function () {
   console.log(‘results:’)
   this.forEach(function (result) {
     console.log(result.name, result.count)
   })
 })
 .run()
```

The results are pretty plain to see (higher is better). Generators aren’t doing anything magical for us here and there is a performance overhead:

```js
results:
regular 1263899
generator 37541
```

Of course this is a trivial example, and performance will likely get better. You may find performance benefits using some of the upcoming examples, but generators are still not a magic bullet. You don’t divvy work up, you simply suspend it. Performance tends to be <a href="https://github.com/koajs/koa/blob/master/docs/faq.md#do-generators-decrease-performance" target="_blank">slightly slower</a> using generators for asynchronous tasks, but they come with substantial benefits as we’ll see in a moment.

## **Where generators shine**

Generators enable functionality that was either not possible before in JavaScript or was complicated. I find these cases the most compelling.

### **Lazy evaluation**

Lazy evaluation is already possible with JavaScript using <a href="https://gist.github.com/kana/5344530" target="_blank">closure tricks and the like</a>, but its greatly simplified now with **yield.** By suspending execution and resuming at will, we are able to pull values _only_ when we need to. For instance, our above **fibGen** function was not fast per say but _it was lazy._ We pull new values whenever we ask for them.

```js
var fibIter = fibGen(20)
var next = fibIter.next()
console.log(next.value)

setTimeout(function () {
 var next = fibIter.next()
 console.log(next.value)
},2000)
```

Of course, if we want one after another, using a **for of** loop is more convenient and is still lazily evaluated:

```js
for (var n of fibGen(20) {
  console.log(n)
}
```

### **Infinite sequences**

Since we can be lazy, it is possible to pull some Haskell tricks, like infinite sequences. Here is a Fibonacci generator that is able to yield an infinite amount of sequence numbers:

```js
function* fibGen () {
  var current = 0, next = 1, swap
  while (true) {
    swap = current, current = next
    next = swap + next
    yield current
  }
}
```

Now we evaluate a Fibonacci stream lazily, asking it to return the first Fibonacci number after 5000:

```js
for (var num of fibGen()) {
 if (num > 5000) break
}
console.log(num) // 6765
```

That’s pretty cool.

### **Asynchronous control flow**

Using generators for asynchronous control flow was first introduced by task.js (which no longer appears to exist) and popularized by frameworks like <a href="https://github.com/visionmedia/co" target="_blank">co</a> and <a href="https://github.com/petkaantonov/bluebird" target="_blank">various</a> <a href="https://github.com/cujojs/when" target="_blank">promise</a> <a href="https://github.com/kriskowal/q" target="_blank">libraries</a>. But how to does it actually work?

In Node land, everything is set up to work with callbacks. It is our lowest-level asynchronous abstraction. However, callbacks don’t work well with generators but **yield** will. If we invert how we have been using generators and use the built-in communications channel, we can write synchronous looking asynchronous code!

```js
run(function* () {
  console.log("Starting")
  var file = yield readFile("./async.js") // [1]
  console.log(file.toString())
})
```

  1. Wait for the result of async.js to come back before continuing.

How do we do this? First, we need to convert asynchronous Node-style callback functions into <a href="http://en.wikipedia.org/wiki/Thunk" target="_blank">thunks,</a> a subroutine value we can reference until its ready to be executed:

```js
function thunkify (nodefn) { // [1]
  return function () { // [2]
    var args = Array.prototype.slice.call(arguments)
    return function (cb) { // [3]
      args.push(cb)
      nodefn.apply(this, args)
    }
  }
}
```

  1. Take an existing Node callback style function as input.
  2. Return a function that converts Node-style into a thunk-style.
  3. Enable the asynchronous function to be execute independently from its initial setup by delaying the execution until its returned function is called.

If you are having trouble wrapping your head around this function, this is how it works if you were to break out the pieces:

```js
var fs = require('fs')
var readFile = thunkify(fs.readFile) // [1]
var readAsyncJs = readFile('./async.js') // [2]
readAsyncJs(function (er, buf) { ... }) // [3]
```

  1. Turn **fs.readFile** into a thunk-style function.
  2. Setup **readFile** to read async.js using the same **fs.readFile** API without passing the callback argument. No asynchronous operation is performed yet.
  3. Perform the asynchronous operation and callback.

Now, let’s write a **run** function, which takes a generator function and handles any yielded thunks:

```js
function run (genFn) {
  var gen = genFn() // [1]
  next() // [2]

  function next (er, value) { // [3]
    if (er) return gen.throw(er)
    var continuable = gen.next(value)

    if (continuable.done) return // [4]
    var cbFn = continuable.value // [5]
    cbFn(next)
  }
}
```

  1. Immediately invoke the generator function. This returns a generator in a suspended state.
  2. Then, invoke the **next** function. We call it right away to tell the generator to resume execution (since **next** triggers **gen.next()**).
  3. Notice how **next** looks just like the Node callback signature (er, value). Every time a thunk completes its asynchronous operation we will call this function.
  4. If there was an error from the asynchronous operation, throw the error back into the generator to be handled there.
  5. If successful, send the value back to the generator. This value gets returned from the **yield** call.
  6. If we have no more left to do in our generator, then stop by returning early.
  7. If we have more to do, take the value of the _next_ yield and execute it using our **next** as the callback.

Now we can run our code and handle errors in a synchronous fashion!

```js
var fs = require('fs')
var readFile = thunkify(fs.readFile)

run(function* () {
  try {
    var file = yield readFile('./async.js')
    console.log(file)
  }
  catch (er) {
    console.error(er)
  }
})
```

## **Summary**

Generators are fun to play around with and I’m excited to see what other use cases we find for them. I would encourage you to play around with the <a href="https://github.com/strongloop/example-generators" target="_blank">GitHub repo</a>. If there are other compelling use cases I didn’t mention, please let me know in the comments!

## **Use StrongOps to Monitor Node Apps

**

Ready to start monitoring event loops, manage Node clusters and chase down memory leaks? We’ve made it easy to get started with [StrongOps](http://strongloop.com/node-js-performance/strongops/) either locally or on your favorite cloud, with a [simple npm install](http://strongloop.com/get-started/).

<img alt="Screen Shot 2014-02-03 at 3.25.40 AM" src="{{site.url}}/blog-assets/2014/02/Screen-Shot-2014-02-03-at-3.25.40-AM.png" width="1746" height="674" />

## **What’s next?**

<li style="margin-left: 2em">
  <span style="font-size: 18px">What’s in the upcoming Node v0.12 release? <a href="http://strongloop.com/strongblog/performance-node-js-v-0-12-whats-new/">Big performance optimizations</a>, read <a href="https://github.com/bnoordhuis">Ben Noordhuis’</a> blog to learn more.</span>
</li>
<li style="margin-left: 2em">
  <span style="font-size: 18px">Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js <a href="http://strongloop.com/mobile-application-development/loopback/">LoopBack framework</a>. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
</li>
<li style="margin-left: 2em">
  <span style="font-size: 18px">Need <a href="http://strongloop.com/node-js-support/expertise/">training and certification</a> for Node? Learn more about both the private and open options StrongLoop offers.</span>
</li>
