---
id: 26385
title: An Introduction To JavaScript ES6 Modules
date: 2015-12-01T06:44:16+00:00
author: Alex Gorbatchev
guid: https://strongloop.com/?p=26385
permalink: /strongblog/an-introduction-to-javascript-es6-modules/
categories:
  - ES2015 ES6
  - JavaScript Language
---
ECMAScript 2015 (formerly known as ES6) introduces a completely new feature and concept to the front-end JavaScript world that strangely has been around for a very long time – modules. ES2015 formalizes what [CommonJS](http://www.commonjs.org/) (the basis for modules in Node.js) and [AMD](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) have tried to address in an attempt to take all the strengths and leave out the weaknesses:

  * Compact syntax
  * Asynchronous and configurable module loading

This article will focus on ES2015 module syntax and some of its gotchas. Module loading and packaging will be covered at another time.

<!--more-->

## Why Modules?

If this sounds like an obvious question, you can probably jump to the next section in the article. If you are still reading this, here’s your basic primer on why JavaScript needs modules.

The most common JavaScript platform today is a web browser which by design executes all of the code in a single global context. This makes it pretty challenging to write even small applications without having to deal with naming conflicts. In essence, it all comes down to code organization and not having to worry about clobbering existing variables each time you need to declare a new one.

Traditionally JavaScript applications were partitioned in files and concatenated during build time. When this has proven itself to be pretty cumbersome, we started wrapping each file in an [IIFE](http://stackoverflow.com/questions/8228281/what-is-the-function-construct-in-javascript): `(function() { ... })();`. This type of construct creates a local scope and so the idea of modules was conceived. This later manifested in [CommonJS](http://www.commonjs.org/) and [AMD](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) systems for loading code and introduced the notion of “modules” to JavaScript.

In other words, current “module” systems (ab)use existing language constructs to give it new features. ES2015 formalizes these concepts via proper language features and makes them official.

## Creating Modules

A JavaScript module is a file that exports something for other modules to consume. Note that we are only talking about ES6/2015 modules in a browser and will not be talking about how Node.js organizes its module system. A few things to keep in mind when creating ES2015 modules:

### Modules Have Their Own Scope

Unlike classical JavaScript, when using modules you don’t have to worry about polluting the global scope. In fact, the problem is quite the opposite – you have to import everything you need to use into every module. The later, however, is a much better idea because you can clearly see all of the dependencies used in each module.

### Naming Modules

The name of a module comes from either the file or the folder name and you can omit the `.js` extension in both cases. Here’s how this works:

  * If you have a file named `utils.js`, you can import it via the `./utils` relative path.
  * If you have a file named `./utils/index.js`, you refer to it via `./utils/index` or simply `./utils`. This allows you to have a bunch of files in a folder and import them as a single module.

## Exporting And Importing

Most modules export some functionality for other modules to import using the new ES2015 `export` and `import` keywords. A module can export and import one or more variables of any type, be that a `Function`, `Object`, `String`, `Number`, `Boolean` and so on.

### Default Exports

Every module can have one, and only one, default export that can be exported and imported without specifying variable name. For example:

```js
<code class="javascript">// hello-world.js
export default function() {}

// main.js
import helloWorld from './hello-world';
import anotherFunction from './hello-world';

helloWorld();
console.log(helloWorld === anotherFunction);</code>
```

The equivalent in [CommonJS](http://www.commonjs.org/) would be:

```js
<code class="javascript">// hello.js
module.exports = function() {}

// main.js
var helloWorld = require('./hello-world');
var anotherFunction = require('./hello-world');

helloWorld();
console.log(helloWorld === anotherFunction);</code>
```

Any JavaScript value can be exported from a module as the default:

```js
<code class="javascript">export default 3.14;
export default {foo: 'bar'};
export default 'hello world';</code>
```

### Named Exports

Alongside default exports live named exports. In this case you have to explicitly specify name of the variable you wish to export and use the same name to import it. A module can have any number of named exports of any type.

```js
<code class="javascript">const PI = 3.14;
const value = 42;
export function helloWorld() {}
export {PI, value};</code>
```

The equivalent in [CommonJS](http://www.commonjs.org/) would be:

```js
<code class="javascript">var PI = 3.14;
var value = 42;
module.exports.helloWorld = function() {}
module.exports.PI = PI;
module.exports.value = value;</code>
```

You can also change the export name without renaming the original variable, for example:

```js
<code class="javascript">const value = 42;
export {value as THE_ANSWER};</code>
```

The equivalent in [CommonJS](http://www.commonjs.org/) would be:

```js
<code class="javascript">var value = 42;
module.exports.THE_ANSWER = value;</code>
```

If you have name conflicts or simply want to import a variable under a different name than the original, you can use the `as` keyword like so:

```js
<code class="javascript">import {value as THE_ANSWER} from './module';</code>
```

The equivalent in [CommonJS](http://www.commonjs.org/) would be:

```js
<code class="javascript">var THE_ANSWER = require('./module'').value;</code>
```

### Import All The Things

An easy way to import all of the values from a module with a single command is to use the `*` notation. This groups all of the module’s exports under a single object variable with properties matching export names. Default exports are placed under the `default` property.

```js
<code class="javascript">// module.js
export default 3.14;
export const table = {foo: 'bar'};
export function hello() {};

// main.js
import * as module from './module';
console.log(module.default);
console.log(module.table);
console.log(module.hello());</code>
```

The equivalent in [CommonJS](http://www.commonjs.org/) would be:

```js
<code class="javascript">// module.js
module.exports.default = 3.14;
module.exports.table = {foo: 'bar'};
module.exports.hello = function () {};

// main.js
var module = require('./module');
console.log(module.default);
console.log(module.table);
console.log(module.hello());</code>
```

It’s worth mentioning the difference in how default exports are imported when using `import * as foo from` and `import foo from`. The later only imports the `default` export and `* as foo` imports everything the module exports as a single object.

### Export All The Things

A fairly common practice is to re-export a few select values (or even all of them) in one module from another. This is called re-exporting. Notice that you can re-export the same “name” multiple times with different values without an error being triggered. In that situation, the last exported value wins.

```js
<code class="javascript">// module.js
const PI = 3.14;
const value = 42;
export const table = {foo: 'bar'};
export function hello() {};

// main.js
export * from './module';
export {hello} from './module';
export {hello as foo} from './module';</code>
```

The equivalent in [CommonJS](http://www.commonjs.org/) would be:

```js
<code class="javascript">// module.js
module.exports.table = {foo: 'bar'};
module.exports.hello = function () {};

// main.js
module.exports = require('./module');
module.exports.hello = require('./module').hello;
module.exports.foo = require('./module').hello;</code>
```

## Gotchas

It’s important to understand that what is being imported into a module aren’t references or values, but bindings. You can think of it as “getters” to variables that live inside a module’s body. This results in some behaviour that might seem unexpected.

### Lack Of Errors

When importing variables from a module by name, if you make a typo or that variable is removed later on, no errors will be thrown during the import, instead the imported binding will be `undefined`.

```js
<code class="javascript">// module.js
export const value = 42;

// main.js
import {valu} from './module'; // no errors
console.log(valu); // undefined</code>
```

### Mutable Bindings

Imported bindings refer to variables inside a module’s body. This causes an interesting side-effect when you import “by value” variable such as `Number`, `Boolean`, or `String`. It’s possible that the value of that variable will be changed by an operation outside of the importing module. In other words, a “by value” variable can be mutated elsewhere. Here’s an example.

```js
<code class="javascript">// module.js
export let count = 0;

export function inc() { 
  count++;
}

// main.js
import {count, inc} from './module; // `count` is a `Number` variable

assert.equal(count, 0);
inc();
assert.equal(count, 1);</code>
```

In the example above the `count` variable is of the `Number` type, yet its value appears to change in the `main` module.

### Imported Variables Are Read-only

No matter what kind of declaration is being exported from a module, imported variables are always read-only. You can, however, change an imported object’s properties.

```js
<code class="javascript">// module.js
export let count = 0;
export const table = {foo: 'bar'};

// main.js
import {count, table} from './module;

table.foo = 'Bar'; // OK
count++; // read-only error</code>
```

### Testing Modules

Testing, or more specifically: stubbing and mocking variables exported by modules, unfortunately hasn’t been addressed by the new ES2015 module system. Just like with [CommonJS](http://www.commonjs.org/), exported variables can’t be reassigned. One way to deal with that is to export an object instead of individual variables.

```js
<code class="javascript">// module.js
export default {
  value: 42,
  print: () =&gt; console.log(this.value)
}

// module-test.js
import m from './module';
m.value = 10;
m.print(); // 10</code>
```

## Bottom Line

ES2015 modules standardize the way module loading and resolution should be done in modern JavaScript. The argument between whether to use [CommonJS](http://www.commonjs.org/) or [AMD](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) has finally been resolved.

We get compact module syntax and the static module definition could assist with future compiler optimizations and maybe even type checking. There’s no longer a need for the [UMD](https://github.com/umdjs/umd) boilerplate in publicly distributed libraries.

## ES6 Today

How can you take advantage of ES6 features today? Using transpilers in the last couple of years has become the norm. People and large companies no longer shy away. [Babel](https://babeljs.io/) is an ES6 to ES5 transpiler that supports all of the ES6 features.

If you are using something like [Browserify](http://browserify.org/) or [Webpack](http://webpack.github.io/) in your JavaScript build pipeline, adding [Babel](https://babeljs.io/) transpilation [takes only a couple of minutes](https://babeljs.io/docs/using-babel/). There is, of course, support for pretty much every common Node.js build system like Gulp, Grunt and many others.

## What About The Browsers?

The majority of [browsers are catching up](https://kangax.github.io/compat-table/es6/) on implementing new features but not one has full support. Does that mean you have to wait? It depends. It’s a good idea to begin using the language features that will be universally available in 1-2 years so that you are comfortable with them when the time comes. On the other hand, if you feel the need for 100% control over the source code, you should stick with ES5 for now.