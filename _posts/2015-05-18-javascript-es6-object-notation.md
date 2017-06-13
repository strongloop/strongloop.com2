---
id: 24958
title: Getting Started with JavaScript ES6 Object Notation
date: 2015-05-18T10:26:32+00:00
author: Alex Gorbatchev
guid: https://strongloop.com/?p=24958
permalink: /strongblog/javascript-es6-object-notation/
categories:
  - Community
---
<img class="alignnone size-full wp-image-24960" src="{{site.url}}/blog-assets/2015/05/nothing-to-declare.jpg" alt="nothing-to-declare" width="605" height="319"  />

Lets talk about object declaration in ES6. It has gotten quite an upgrade from its predecessor, ES5. ECMAScript 6 doesn’t bring any new features in this realm (we aren’t talking about the `class` keyword here), but it does have a good amount of new syntax to help us keep all the curly braces at bay.

In this article I’m going to outline all the new ES6 object declaration syntax.

## <a class="headeranchor-link" href="#function-shorthand" name="user-content-function-shorthand"></a>**Function Shorthand** 

How often have you declared a property function? I know it’s been too many times for me than I care to recall.

```js
var obj = {
  hello: function () {
    // ...
  }
};
```

ES6 brings in new syntax to shorten this very common declaration pattern. Notice the lack of the `function` keyword in the example below! The good thing is that both examples are technically the same thing and could co-exist in ES6.

```js
var obj = {
  hello() {
    // ...
  }
};
```

## <a class="headeranchor-link" href="#getters-and-setters" name="user-content-getters-and-setters"></a>**Getters and Setters** 

Defining read only properties using `Object.createProperty()` was possible for a pretty long time in ES5. To me it always felt as an afterthought and maybe that’s the reason why you rarely see this feature being used today.

```js
var obj = Object.defineProperties({}, {
  hello: {
    get: function () {
      return 'hello';
    },
    configurable: true,
    enumerable: true
  }
});
```

Typing this every time for a readonly property feels like a lot of hassle to me. ES6 introduces proper getter and setter syntax to make this a first class feature:

```js
var obj = {
  get hello() {
    return this._hello;
  }
};
```

The difference here is pretty striking. Both examples are equivalent in functionality but ES6 is way more manageable and feels like it belongs. Any attempt to set the `hello` property value results in an exception:

```js
obj.hello = 'new value';
// Uncaught TypeError: Cannot set property hello of [object Object] which has only a getter
```

Defining a setter is just as easy using the `set` keyword:

```js
var obj = {
  set hello(value) {
    this._hello = value;
  }
};
```

That translates to the following ES5:

```js
var obj = Object.defineProperties({}, {
  hello: {
    set: function (value) {
      this._hello = value;
    },
    configurable: true,
    enumerable: true
  }
});
```

Unlike with the getter, trying to read the value from a set-only property doesn’t throw an error and returns `undefined`. I’m not sure how I feel about the difference in behaviour here, at the same time don’t think I’ve ever encountered a set-only property before. I think we can file this under “no big deal”.

## <a class="headeranchor-link" href="#computed-property-names" name="user-content-computed-property-names"></a>**Computed Property Names** 

Often you have to create an object with keys based on a variable. In that case traditional approach looks something like this:

```js
var param = 'size';
var config = {};

config[param] = 12;
config["mobile-" + param] = 4;
```

Functional? Yes, and also incredibly annoying. In ES6 you can define computed property names during object declaration without having separate statements like so:

```js
const param = 'size';
const config = {
  [param]: 12,
  [`mobile-${param}`]: 4
};
```

Here’s another example:

```js
var index = 0;
var obj = {
  [`key${index}`]: index++,
  [`key${index}`]: index++,
  [`key${index}`]: index++,
};

console.log(obj);
// {"key0":0,"key1":1,"key2":2}
```

## <a class="headeranchor-link" href="#shorthand-assignment" name="user-content-shorthand-assignment"></a>**Shorthand Assignment** 

One of my personal favorite new syntax features is the shorthand assignment. Lets look at the example in ES5 first:

```js
...
module.exports = {
  readSync: readSync,
  readFile: readFile,
  readFileSync: readFileSync,
  writeFile: writeFile,
  writeFileSync: writeFileSync,
  appendFile: appendFile,
  appendFileSync: appendFileSync
};
```

Sprinkle some ES6 magic and you have:

```js
// ...
module.exports = {
  readSync,
  readFile,
  readFileSync,
  writeFile,
  writeFileSync,
  appendFile,
  appendFileSync
};
```

Basically, if the variable and property name is the same, you can omit the right side. Nothing stops you from mixing and matching either:

```js
// ...
module.exports = {
  appendFile,
  appendFileSync: function () {
    // ...
  }
};
```

## <a class="headeranchor-link" href="#es6-today" name="user-content-es6-today"></a>**ES6 Today** 

How can you take advantage of ES6 features today? Using transpilers in the last couple of years has become the norm. People and large companies no longer shy away. [Babel](https://babeljs.io/) is an ES6 to ES5 transpiler that supports all of the ES6 features.

If you are using something like [Browserify](http://browserify.org/) in your JavaScript build pipeline, adding [Babel](https://babeljs.io/) transpilation [takes only a couple of minutes](https://babeljs.io/docs/using-babel/#browserify). There is, of course, support for pretty much every common Node.js build system like Gulp, Grunt and many others.

## <a class="headeranchor-link" href="#what-about-the-browsers" name="user-content-what-about-the-browsers"></a>**What About The Browsers?** 

The majority of [browsers are catching up](https://kangax.github.io/compat-table/es6/) on implementing new features but not one has full support. Does that mean you have to wait? It depends. It’s a good idea to begin using the language features that will be universally available in 1-2 years so that you are comfortable with them when the time comes. On the other hand, if you feel the need for 100% control over the source code, you should stick with ES5 for now.

&nbsp;