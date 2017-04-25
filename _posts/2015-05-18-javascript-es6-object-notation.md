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
<img class="alignnone size-full wp-image-24960" src="https://strongloop.com/wp-content/uploads/2015/05/nothing-to-declare.jpg" alt="nothing-to-declare" width="605" height="319" srcset="https://strongloop.com/wp-content/uploads/2015/05/nothing-to-declare.jpg 605w, https://strongloop.com/wp-content/uploads/2015/05/nothing-to-declare-300x158.jpg 300w, https://strongloop.com/wp-content/uploads/2015/05/nothing-to-declare-450x237.jpg 450w" sizes="(max-width: 605px) 100vw, 605px" />

Lets talk about object declaration in ES6. It has gotten quite an upgrade from its predecessor, ES5. ECMAScript 6 doesn’t bring any new features in this realm (we aren’t talking about the `class` keyword here), but it does have a good amount of new syntax to help us keep all the curly braces at bay.

In this article I’m going to outline all the new ES6 object declaration syntax.

## <a class="headeranchor-link" href="#function-shorthand" name="user-content-function-shorthand"></a>**Function Shorthand** {#function-shorthand}

How often have you declared a property function? I know it’s been too many times for me than I care to recall.

```js
<code class="javascript">var obj = {
  hello: function () {
    // ...
  }
};</code>
```

ES6 brings in new syntax to shorten this very common declaration pattern. Notice the lack of the `function` keyword in the example below! The good thing is that both examples are technically the same thing and could co-exist in ES6.

```js
<code class="javascript">var obj = {
  hello() {
    // ...
  }
};</code>
```

## <a class="headeranchor-link" href="#getters-and-setters" name="user-content-getters-and-setters"></a>**Getters and Setters** {#getters-and-setters}

Defining read only properties using `Object.createProperty()` was possible for a pretty long time in ES5. To me it always felt as an afterthought and maybe that’s the reason why you rarely see this feature being used today.

```js
<code class="javascript">var obj = Object.defineProperties({}, {
  hello: {
    get: function () {
      return 'hello';
    },
    configurable: true,
    enumerable: true
  }
});</code>
```

Typing this every time for a readonly property feels like a lot of hassle to me. ES6 introduces proper getter and setter syntax to make this a first class feature:

```js
<code class="javascript">var obj = {
  get hello() {
    return this._hello;
  }
};</code>
```

The difference here is pretty striking. Both examples are equivalent in functionality but ES6 is way more manageable and feels like it belongs. Any attempt to set the `hello` property value results in an exception:

```js
<code class="javascript">obj.hello = 'new value';
// Uncaught TypeError: Cannot set property hello of [object Object] which has only a getter
</code>
```

Defining a setter is just as easy using the `set` keyword:

```js
<code class="javascript">var obj = {
  set hello(value) {
    this._hello = value;
  }
};</code>
```

That translates to the following ES5:

```js
<code class="javascript">var obj = Object.defineProperties({}, {
  hello: {
    set: function (value) {
      this._hello = value;
    },
    configurable: true,
    enumerable: true
  }
});</code>
```

Unlike with the getter, trying to read the value from a set-only property doesn’t throw an error and returns `undefined`. I’m not sure how I feel about the difference in behaviour here, at the same time don’t think I’ve ever encountered a set-only property before. I think we can file this under “no big deal”.

## <a class="headeranchor-link" href="#computed-property-names" name="user-content-computed-property-names"></a>**Computed Property Names** {#computed-property-names}

Often you have to create an object with keys based on a variable. In that case traditional approach looks something like this:

```js
<code class="javascript">var param = 'size';
var config = {};

config[param] = 12;
config["mobile-" + param] = 4;</code>
```

Functional? Yes, and also incredibly annoying. In ES6 you can define computed property names during object declaration without having separate statements like so:

```js
<code class="javascript">const param = 'size';
const config = {
  [param]: 12,
  [`mobile-${param}`]: 4
};</code>
```

Here’s another example:

```js
<code class="javascript">var index = 0;
var obj = {
  [`key${index}`]: index++,
  [`key${index}`]: index++,
  [`key${index}`]: index++,
};

console.log(obj);
// {"key0":0,"key1":1,"key2":2}</code>
```

## <a class="headeranchor-link" href="#shorthand-assignment" name="user-content-shorthand-assignment"></a>**Shorthand Assignment** {#shorthand-assignment}

One of my personal favorite new syntax features is the shorthand assignment. Lets look at the example in ES5 first:

```js
<code class="javascript">...
module.exports = {
  readSync: readSync,
  readFile: readFile,
  readFileSync: readFileSync,
  writeFile: writeFile,
  writeFileSync: writeFileSync,
  appendFile: appendFile,
  appendFileSync: appendFileSync
};</code>
```

Sprinkle some ES6 magic and you have:

```js
<code class="javascript">// ...
module.exports = {
  readSync,
  readFile,
  readFileSync,
  writeFile,
  writeFileSync,
  appendFile,
  appendFileSync
};</code>
```

Basically, if the variable and property name is the same, you can omit the right side. Nothing stops you from mixing and matching either:

```js
<code class="javascript">// ...
module.exports = {
  appendFile,
  appendFileSync: function () {
    // ...
  }
};</code>
```

## <a class="headeranchor-link" href="#es6-today" name="user-content-es6-today"></a>**ES6 Today** {#es6-today}

How can you take advantage of ES6 features today? Using transpilers in the last couple of years has become the norm. People and large companies no longer shy away. [Babel](https://babeljs.io/) is an ES6 to ES5 transpiler that supports all of the ES6 features.

If you are using something like [Browserify](http://browserify.org/) in your JavaScript build pipeline, adding [Babel](https://babeljs.io/) transpilation [takes only a couple of minutes](https://babeljs.io/docs/using-babel/#browserify). There is, of course, support for pretty much every common Node.js build system like Gulp, Grunt and many others.

## <a class="headeranchor-link" href="#what-about-the-browsers" name="user-content-what-about-the-browsers"></a>**What About The Browsers?** {#what-about-the-browsers}

The majority of [browsers are catching up](https://kangax.github.io/compat-table/es6/) on implementing new features but not one has full support. Does that mean you have to wait? It depends. It’s a good idea to begin using the language features that will be universally available in 1-2 years so that you are comfortable with them when the time comes. On the other hand, if you feel the need for 100% control over the source code, you should stick with ES5 for now.

&nbsp;