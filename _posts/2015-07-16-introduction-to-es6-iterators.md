---
id: 25502
title: An Introduction to JavaScript ES6 Iterators
date: 2015-07-16T07:25:16+00:00
author: Alex Gorbatchev
guid: https://strongloop.com/?p=25502
permalink: /strongblog/introduction-to-es6-iterators/
categories:
  - How-To
  - JavaScript Language
---
EcmaScript 2015 (formerly known as ES6) introduces a brand new concept of iterators which allows us to define sequences (limited and otherwise) at the language level.

Let us break it down a bit. We are all very well familiar with the basic `for` loop and most of us know its less popular cousin `for-in`. The latter could be used to help us explain the basics of iterators.

```js
for (var key in table) {
  console.log(key + ' = ' + table[key]);
}
```

There are multiple problems with `for-in`, but one of the biggest is that it gives no guarantee of order. We will solve this with iterators below.

## **for-of**

`for-of` is the the new language syntax that ES6 introduces to work with iterators.

```js
for (var key of table) {
  console.log(key + ' = ' + table[key]);
}
```

What we want to see here is an implementation that guarantees the order of keys. In order for an object to be iterable, it needs to implement the **iterable protocol**, meaning that the object (or one of the objects up its prototype chain) must have a property with a `Symbol.iterator` key. That is what `for-of` uses, and in this specific example it would be `table[Symbol.iterator]`.

`Symbol.iterator` is another ES6 addition that we will discuss in depth in another article. For now, think of this as a way to define special keys that will never conflict with regular object keys.

The `table[Symbol.iterator]` object member needs to be a function conforming to the **iterator protocol**, meaning that it needs to return an object like: `{ next: function () {} }`

```js
table[Symbol.iterator] = function () {
   return {
    next: function () {}
  }
}
```

Each time the `next` function is called by the `for-of` loop it needs to return an object that looks like `{value: …, done: [true/false]}`. The full implementation of our sorted key iterator looks like this:

```js
table[Symbol.iterator] = function () {
  var keys = Object.keys(this).sort();
  var index = 0;
  
  return {
    next: function () {
      return {
        value: keys[index], done: index++ >= keys.length
      };
    }
  }
}
```

## **Laziness**

Iterators allow us to delay execution until the first call to `next`. In our example above the moment the iterator is called, we immediately perform the work of getting and sorting the keys. What if `next` is never actually called? That’s going to be a wasted effort. Let’s optimize it:

```js
table[Symbol.iterator] = function () {
  var _this = this;
  var keys = null;
  var index = 0;
  
  return {
    next: function () {
      if (keys === null) {
        keys = Object.keys(_this).sort();
      }
      
      return {
        value: keys[index], done: index++ >= keys.length
      };
    }
  }
}
```

## **Difference between `for-of` and `for-in`**

It’s important to understand the difference between `for-of` and `for-in`. Here’s a simple but very self explanatory example:

```js
var list = [3, 5, 7];
list.foo = 'bar';

for (var key in list) {
  console.log(key); // 0, 1, 2, foo
}

for (var value of list) {
  console.log(value); // 3, 5, 7
}
```

As you can see, the `for-of` loop only prints the list values, omitting all other properties. This is the result of array iterator returning only expected items.

## **Built-in iterables**

[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String), [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) and [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) are all built-in iterables, because the prototype objects of them all have a `Symbol.iterator` method.

```js
var string = "hello";

for (var chr of string) {
  console.log(chr); // h, e, l, l, o
}
```

## **Spread construct**

The spread operator also accepts an iterable, you can do some neat tricks with that:

```js
var hello = 'world';
var [first, second, ...rest] = [...hello];
console.log(first, second, rest); // w o ["r","l","d"]
```

## **Infinite iterator**

Implementing an infinite iterator is as simple as never returning `done: true`. Of course, care must be taken to avoid an infinite loop.

```js
var ids = {
  *[Symbol.iterator]: function () {
    var index = 0;
    
    return {
      next: function () {
        return { value: 'id-' + index++, done: false };
      }
    };
  }
};

var counter = 0;

for (var value of ids) {
  console.log(value);
  
  if (counter++ > 1000) { // let's make sure we get out!
    break;
  }
}
```

## **Generators**

If you haven’t familiarized yourself with ES6 generators yet, do checkout the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*). In a couple of words, generators are functions which can be exited and later re-entered and are the most talked about ES6 feature. Their context (variable bindings) will be saved across re-entrances. Generators are both iterators and iterable at the same time. Lets take a look at a simple example:

```js
function* list(value) {
  for (var item of value) {
    yield item;
  }
}

for (var value of list([1, 2, 3])) {
  console.log(value);
}

var iterator = list([1, 2, 3]);

console.log(typeof iterator.next); // function
console.log(typeof iterator[Symbol.iterator]); // function

console.log(iterator.next().value); // 1

for (var value of iterator) {
  console.log(value); // 2, 3
}
```

With that in mind, we can rewrite our original ordered table keys iterator using generators like so:

```js
table[Symbol.iterator] = function* () {
  var keys = Object.keys(this).sort();
  
  for (var item of keys) {
    yield item;
  }
}
```

## **Bottom Line**

Iterators bring a whole new dimension to loops, generators and value series. You can pass them around, define how a class describes a list of values, create lazy or infinite lists and so on.

## **ES6 Today**

How can you take advantage of ES6 features today? Using transpilers in the last couple of years has become the norm. People and large companies no longer shy away. [Babel](https://babeljs.io/) is an ES6 to ES5 transpiler that supports all of the ES6 features.

If you are using something like [Browserify](http://browserify.org/) in your JavaScript build pipeline, adding [Babel](https://babeljs.io/) transpilation [takes only a couple of minutes](https://babeljs.io/docs/using-babel/#browserify). There is, of course, support for pretty much every common Node.js build system like Gulp, Grunt and many others.

## **What About The Browsers?**

The majority of [browsers are catching up](https://kangax.github.io/compat-table/es6/) on implementing new features but not one has full support. Does that mean you have to wait? It depends. It’s a good idea to begin using the language features that will be universally available in 1-2 years so that you are comfortable with them when the time comes. On the other hand, if you feel the need for 100% control over the source code, you should stick with ES5 for now.

&nbsp;