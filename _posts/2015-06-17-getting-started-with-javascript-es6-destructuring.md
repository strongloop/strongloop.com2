---
id: 25233
title: Getting Started with JavaScript ES6 Destructuring
date: 2015-06-17T08:00:24+00:00
author: Alex Gorbatchev
guid: https://strongloop.com/?p=25233
permalink: /strongblog/getting-started-with-javascript-es6-destructuring/
categories:
  - Community
  - How-To
  - JavaScript Language
---
<img src="{{site.url}}/blog-assets/2015/06/es6-destructuring.jpg" alt="" width="100%" />

Lets take a closer look at the new syntax that ES6 brings to help with more explicit variable and argument declaration and assignment. The current state of affairs is pretty straight forward: on the left hand side you have a variable name, on the right you have an expression which, among other things, can be an array: `[ ]` or an object literal: `{ }`. Destructuring assignment allows us to have an expression like variable declaration on the left hand side describing which values to extract from the right hand side. Sounds a bit confusing? Lets look at the specific examples.

## **Array Destructuring**

Lets say we have a `value` variable which is `[1, 2, 3, 4, 5]` and we want to declare variables that contain first three elements. Traditionally each variable would be declared and assigned separately like so:

```js
<code class="javascript">var value = [1, 2, 3, 4, 5];
var el1 = value[0];
var el2 = value[1];
var el3 = value[2];</code>
```

Having these variables, our original `value` might now be represented as `[el1, el2, el3, 4, 5]` and, since we don’t care at the moment about last two values, as something like `[el1, el2, el3]`. ES6 allows us to use this expression now on the left hand side to achieve the same declaration as above:

```js
<code class="javascript">var value = [1, 2, 3, 4, 5];
var [el1, el2, el3] = value;</code>
```

The right hand side doesn’t have to be a variable, we can omit `value` declaration all together:

```js
<code class="javascript">var [el1, el2, el3] = [1, 2, 3, 4, 5];</code>
```

The left hand side doesn’t have to a declaration either, you can use already declared variables:

```js
<code class="javascript">var el1, el2, el3;
[el1, el2, el3] = [1, 2, 3, 4, 5];</code>
```

This brings us to a neat little trick that was previously impossible in JavaScript with just two variables &#8211; swapping values.

```js
<code class="javascript">[el1, el2] = [el2, el1];</code>
```

Destructuring assignment can also be nested:

```js
<code class="javascript">var value = [1, 2, [3, 4, 5]];
var [el1, el2, [el3, el4]] = value;</code>
```

Returning tuples from functions in ES6 becomes more of a first class citizen and feels pretty natural:

```js
<code class="javascript">function tuple() {
  return [1, 2];
}

var [first, second] = tuple();</code>
```

You can also ignore certain elements in the array by simply omitting variables where appropriate:

```js
<code class="javascript">var value = [1, 2, 3, 4, 5];
var [el1, , el3, , el5] = value;</code>
```

This makes it really neat for example to pull values out of regular expression matches:

```js
<code class="javascript">var [, firstName, lastName] = "John Doe".match(/^(\w+) (\w+)$/);</code>
```

Taking it one step further, you can also specify default values:

```js
<code class="javascript">var [firstName = "John", lastName = "Doe"] = [];</code>
```

Note that this only works for `undefined` values. In the following example `firstName` and `lastName` will be `null`.

```js
<code class="javascript">var [firstName = "John", lastName = "Doe"] = [null, null];</code>
```

Spread operator is where things get really interesting. Spreads, otherwise knows as the “rest” pattern allow you to grab “remaining values” from the array. In the example below `tail` receives all remaining array elements which is `[4, 5]`.

```js
<code class="javascript">var value = [1, 2, 3, 4, 5];
var [el1, el2, el3, ...tail] = value;</code>
```

Unfortunately implementation of splats in ES6 is somewhat primitive and only allows you to get the remaining elements. The following patterns, while being very useful, are not possible in ES6:

```js
<code class="javascript">var value = [1, 2, 3, 4, 5];
var [...rest, lastElement] = value;
var [firstElement, ...rest, lastElement] = value;</code>
```

## **Object Destructuring**

Now that you have a pretty clear understanding of how array destructuring works, lets look at object destructuring. It works pretty much the same way, just for objects:

```js
<code class="javascript">var person = {firstName: "John", lastName: "Doe"};
var {firstName, lastName} = person;</code>
```

ES6 allows you to pull object properties using variable identifiers that differ from the property name they refer to. In the example below, variable `name` will be declared with `person.firstName` value.

```js
<code class="javascript">var person = {firstName: "John", lastName: "Doe"};
var {firstName: name, lastName} = person;</code>
```

What if you have a more complex, deeply nested, object? Not a problem!

```js
<code class="javascript">var person = {name: {firstName: "John", lastName: "Doe"}};
var {name: {firstName, lastName}} = person;</code>
```

You can throw in some array destructuring here as well:

```js
<code class="javascript">var person = {dateOfBirth: [1, 1, 1980]};
var {dateOfBirth: [day, month, year]} = person;</code>
```

And the other way around:

```js
<code class="javascript">var person = [{dateOfBirth: [1, 1, 1980]}];
var [{dateOfBirth}] = person;</code>
```

Just like when dealing with arrays you can also specify default values.

```js
<code class="javascript">var {firstName = "John", lastName: userLastName = "Doe"} = {};</code>
```

This also only works for `undefined` values. In the following example `firstName` and `lastName` will be `null`.

```js
<code class="javascript">var {firstName = "John", lastName = "Doe"} = {firstName: null, lastName: null};</code>
```

## **Destructuring Function Arguments**

Function arguments in ES6 could also be declared in a destructuring way. This comes in super useful for the ever prolific `options` argument. You can use array and object destructuring together.

```js
<code class="javascript">function findUser(userId, options) {
  if (options.includeProfile) ...
  if (options.includeHistory) ...
}</code>
```

Same looks and feels much better in ES6:

```js
<code class="javascript">function findUser(userId, {includeProfile, includeHistory}) {
  if (includeProfile) ...
  if (includeHistory) ...
}</code>
```

## **Bottom Line**

ES6 destructuring brings in much needed syntax modernizations to JavaScript. It improves readability and reduces amount of code necessary to for expressive declarations.

## **ES6 Today**

How can you take advantage of ES6 features today? Using transpilers in the last couple of years has become the norm. People and large companies no longer shy away. [Babel](https://babeljs.io/) is an ES6 to ES5 transpiler that supports all of the ES6 features.

If you are using something like [Browserify](http://browserify.org/) in your JavaScript build pipeline, adding [Babel](https://babeljs.io/) transpilation \[takes only a couple of minutes\](https://babeljs.io/docs/using-babel/#browserify). There is, of course, support for pretty much every common Node.js build system like Gulp, Grunt and many others.

## **What About The Browsers?**

The majority of [browsers are catching up](https://kangax.github.io/compat-table/es6/) on implementing new features but not one has full support. Does that mean you have to wait? It depends. It’s a good idea to begin using the language features that will be universally available in 1-2 years so that you are comfortable with them when the time comes. On the other hand, if you feel the need for 100% control over the source code, you should stick with ES5 for now.

&nbsp;