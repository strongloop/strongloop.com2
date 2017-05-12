---
id: 26765
title: Write Your Own Co Using ES2015 Generators
date: 2016-02-01T14:01:33+00:00
author: Valeri Karpov
guid: https://strongloop.com/?p=26765
permalink: /strongblog/write-your-own-co-using-es2015-generators/
categories:
  - ES2015 ES6
  - How-To
  - JavaScript Language
---
ES2015 is now officially the new JavaScript language standard, and it is packed with sweet new features. One feature that I&#8217;m particularly excited about is [​generators​](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*). At a high level, generators are functions that can pause and then pick up where they left off later. Generators enable you to break up CPU­-intensive calculations like computing the millionth Fibonacci number so you don&#8217;t block the event loop and write ​[web servers using middleware that can post-­process your HTTP response](https://www.npmjs.com/package/koa)​. The most exciting application of generators, though, is asynchronous coroutines, better known as callback-­free asynchronous code. In this article, you&#8217;ll learn about how to write your own ​co​, a library for asynchronous coroutines using generators.

<!--more-->

### **A Brief Overview of Co**

In this article, I&#8217;ll assume that you&#8217;ve seen generators in action before. If you&#8217;re looking for a more comprehensive guide, I released an ​[ebook about generators](http://es2015generators.com/)​ that explores generators in more detail and shows you how to write your own simple implementations of co, koa, and regenerator. Here&#8217;s how you would use co and [​superagent​](https://www.npmjs.com/package/superagent) to load the HTML for Google&#8217;s home page.

```js
const​ co = ​require​(​'co'​);
const​ superagent = ​require​(​'superagent'​);
co(​function​*() {
  ​let​ html;
  ​try​ {
    html = (​yield​ superagent.get(​'http://google.com'​)).text;
  } ​catch​(err) {
    ​// Catch any HTTP errors
  }
  ​console​.log(html);
});
```

However, `superagent.get()` is an asynchronous request. In ES5, you would write the below code to print the HTML for Google&#8217;s home page.

```js
superagent.get(​'http://google.com'​, ​function​(error, res) {
​console​.log(res.text);
});
```

In ES2015, you can use a library like co to automatically handle asynchronous requests for you, as long as you pass it a generator function. You can even use try/catch to handle asynchronous errors! Before you learn how co works, first you need to understand the difference between generators and generator functions.

### **Generators and Generator Functions**

To create a ​generator function​, you use `function*`:

```js
const​ generatorFunction = ​function​*() {
  ​const​ html = (​yield​ superagent.get(​'http://google.com'​)).text;
  ​console​.log(html);
};
```

When you call a generator function, the return value is a generator object, or generator​ for short. A generator has two functions, `next()` and `throw()`, that are used to control the generator&#8217;s execution. To see how these functions work, let&#8217;s take a look at how the generator from `generatorFunction()` above works.

```js
const​ generatorFunction = ​function​*() {
  ​const​ html = (​yield​ superagent.get(​'http://google.com'​)).text;
  ​console​.log(html);
};
const​ generator = generatorFunction();
// Prints an object: `{ value: <Superagent Request>, done: false }`
console​.log(generator.next());
// Throws an error:
// `TypeError: Cannot read property 'text' of undefined`
console​.log(generator.next());
```

The `next()` function executes the generator up to the next `yield` or `return\` statement. It returns an object with 2 properties: the value that was yielded or returned, and whether the generator is exhausted. The most exciting part of the `next()` function is that it can take a parameter, and that parameter becomes the return value for the `yield` statement in the generator function.

```js
const​ generator = generatorFunction();
// Prints an object: `{ value: <Superagent Request>, done: false }`
console​.log(generator.next({ text: ​'test'​ }));
// Will print out 'test', because
// `yield superagent.get('http://google.com')` becomes
// `{ text: 'test' }` from the above `next()` call
generator.next();
```

The `throw()` function triggers an error in the generator function that you can \`try\`/\`catch\`. For instance:

```js
const​ generatorFunction = ​function​*() {
  ​try​ {
    ​yield​ next;
  } ​catch​(err) {
    ​console​.log(​'Caught'​, err);
  }
};
const​ generator = generatorFunction();
// Prints out 'Caught Error: Oops!'
generator.throw(​new​ ​Error​(​'Oops!'​));
```

Together, `next()` and `throw()` provide everything you need to write your own take on co.

### **Writing Your Own Co**

The general idea of how co works is simple.

  1. Assume that you&#8217;re given a generator function that yields [​promises​](https://strongloop.com/strongblog/node-js-callback-hell-promises-generators/), execute the generator function to get a generator
  2. For every promise, wait until it resolves or errors. Call `next()` with the resolved value if the promise resolves.
  3. If the promise errors, call `throw()` with the associated error.

It&#8217;s important to note that you can call `next()` asynchronously. You can call \`generator.next()` or​ \`generator.throw()` in a `setTimeout()`, or even in the \`onFulfilled` handler of a promise. With that in mind, here&#8217;s a simplified implementation of co:

```js
const​ co = ​function​(generatorFunction) {
  ​// Point 1: create a generator
  ​const​ generator = generatorFunction();
  ​// Start executing the generator
  next();
  ​// Call next() or throw() on the generator as necessary
  ​function​ ​next​(error, v) {
    ​// Points 2 and 3: if error, call `throw()` with error,
    ​// otherwise call `next()` with resolved value,
    ​const​ res = error ? generator.throw(error) : generator.next(v);
    ​if​ (res.done) {
      ​return​;
    }
    ​// Point 1: assume the yielded value is a promise
    res.value.then((v) => next(null, v), (error) => next(error));
  }
};
co(​function​*() {
  ​const​ html = (​yield​ superagent.get(​'http://google.com'​)).text;
  ​// Print google homepage HTML
  ​console​.log(html);
});
```

### **Moving On**

The above implementation is just a sketch of co. The real module has numerous powerful features, like sophisticated exception handling, the ability to yield non-­promises, and the ability to execute two async operations in parallel. Check out ​[co on GitHub​](https://github.com/tj/co) for documentation and the real implementation. If you&#8217;re interested in learning more about generators, taking a deeper dive into how co is implemented, or learning about how [​koa​](https://www.npmjs.com/package/koa) (the co-­based take on [​express​](https://www.npmjs.com/package/express)) is implemented, check out ​The [80/20 Guide to ES2015 Generators](http://es2015generators.com/)​.
