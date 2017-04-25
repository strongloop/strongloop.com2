---
id: 27563
title: Type Hinting in JavaScript
date: 2016-06-28T13:37:18+00:00
author: Sequoia McDowell
guid: https://strongloop.com/?p=27563
permalink: /strongblog/type-hinting-in-javascript/
categories:
  - How-To
  - JavaScript Language
---
Most developers understand that JavaScript does not have a notion of _datatypes_: it&#8217;s often referred to as &#8220;dynamically typed&#8221;,  &#8220;weakly typed,&#8221; or even &#8220;untyped.&#8221;  The distinction is mostly academic, and the bottom line is when you declare a variable, you don&#8217;t specify its datatype.  For example, if you see this:

    var animals;

There&#8217;s no way to know whether `animals` is an array, a string, a function, or something else.  So how do you make sure that people use variables as they were intended?

The first and most obvious solution is to document all your types.   If your program fits in one or two files, you can just check the documentation to determine any given type. But when your application spans dozens or hundreds of files, or the number of developers working on it begins to climb, this solution can quickly lead to a huge mess. When you get to this point, it&#8217;s helpful to offload &#8220;checking that function signature&#8221; to your [IDE](https://en.wikipedia.org/wiki/Integrated_development_environment) or text editor.
  
<!--more-->

<img class="aligncenter" src="https://strongloop.com/wp-content/uploads/2016/06/typehint-example-1a.gif" alt="example of tooltips and type hinting in JavaScript using VisualStudio Code" />

<!-- For small projects, the overhead of documenting every function parameter, return value, and variable can be overkill. -->

If your IDE or editor doesn&#8217;t know that `animals` will eventually be an array, there&#8217;s no way for it to helpfully tell you that `animals` has the property `length` and the method `map`, among others. There&#8217;s no way for the IDE to know it&#8217;s an array&#8230; unless you tell it!  That&#8217;s where _code hinting_ comes in.

On projects of any size, code hinting reduces typos, makes coding easier, and reduces the need to check documentation. Programmers who use strongly-typed languages such as Java and IDEs such as Eclipse take automated code-assistance for granted. But what about JavaScript programmers?

This post will examine a couple ways to clue-in your IDE to the **types** of the variables, function parameters, and return values in your program so the IDE can clue _you_ in on how to use them. We&#8217;ll go over two ways to &#8220;tell&#8221; your IDE (and other developers) about types, and how to load type information for third-party libraries as well.

Before _writing_ type annotations, however, you need a tool that can _read_ them.

## Setting up The Environment {#setting-up-the-environment}

The first thing you need is a code editor that recognizes and supports the concept of types in JavaScript. You can either use a JavaScript-oriented IDE such as [Webstorm](https://www.jetbrains.com/webstorm/) or [VisualStudio Code](https://code.visualstudio.com/), or if you have a favorite text editor, see if it has a type-hinting plugin that supports JavaScript. For example, both [Sublime](http://sublimecodeintel.github.io/SublimeCodeIntel/) and [Atom](https://atom.io/packages/autocomplete-plus) have type-hinting plugins.

I recommend Visual Studio Code (VS Code), for the following reasons:

  * It has [built in](https://code.visualstudio.com/Docs/languages/javascript#_intellisense) code-hinting for JavaScript. No plugins needed.
  * It&#8217;s from Microsoft, which has ample experience creating IDEs.
  * Microsoft is also the creator of [Typescript](www.typescriptlang.org/), so it has excellent support for Typescript definitions, one of the tools we&#8217;ll use herein.
  * It&#8217;s [open source](https://github.com/Microsoft/vscode).
  * It&#8217;s free!

For these reasons, I&#8217;ll use VS Code in the remainder of this post.

With VS Code installed, let&#8217;s create a new project and get started!

## Built-in Types {#Built-in-Types}

To begin an example of, use `npm init` to start a new JavaScript project. At this point, you already get quite a bit from VS Code, which has both JavaScript language APIs ([Math](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math), [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String), etc.) and browser APIs ([DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model), [Console](//developer.mozilla.org/en-US/docs/Web/API/Console), [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest), etc.) built in.

Here&#8217;s an illustration of some of what you get out of the box:

<img class=" aligncenter" src="https://strongloop.com/wp-content/uploads/2016/06/typehint-built-in-stuff.gif" alt="demo of type hinting for String, Math, Console, and Document" />

Nice! But we&#8217;re more interested in Node.js annotations and sadly, VS Code does not ship with those. Type declarations for Node.js core APIs do exist, however, in the form of [Typescript declaration files](https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html). You just need a way to add them to your workspace so VS Code can find them: Enter [Typings](https://www.npmjs.com/package/typings).

## Typings {#Typings}

[Typings](https://www.npmjs.com/package/typings) is a &#8220;Typescript Definition Manager&#8221; that informs an IDE about the Typescript definitions (or &#8220;declarations&#8221;) for the JavaScript APIs you&#8217;re using. Later we&#8217;ll look at the format of Typescript declarations later; for now you need to inform the IDE about Node.js core APIs.

Install Typings:

```js
$ npm install --global typings
```

With Typings installed on your system, you can add the Node.js core API type definitions to your project. From the project root, enter this command:

```js
$ typings install dt~node --global --save
```

Let&#8217;s break that command down:

  1. Using the `typings install` command&#8230;
  2. Install the `node` package from `dt~`, the [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) repository, a huge collection of TypeScript definitions.
  3. Add the `--global` option to access to definitions for `process` and `modules` from throughout our project.
  4. Finally, the `--save` option causes `typings` save this type definition as a project dependency in `typings.json`, which you can check into your repo so others can install these same types. (`typings.json` is to `typings install` what `package.json` is to `npm install`.)

Now you have a new `typings/` directory containing the newly-downloaded definitions, as well as your `typings.json` file.

### One More Step&#8230; {#One-More-Step}

You now have these type definitions in your project, and VS Code loads all type definitions in your project automatically. However, it identifies the root of a JavaScript project by the presence of a `jsconfig.json` file, and we don&#8217;t have one yet. VS Code can usually guess if your project is JavaScript based, and when it does it will [display a little green lightbulb in the status bar](https://code.visualstudio.com/Docs/runtimes/nodejs#_adding-a-jsconfigjson-configuration-file), prompting you to create just such a `jsconfig.json` file. Click that button, save the file, start writing some Node, and&#8230;

<img class=" aligncenter" src="https://strongloop.com/wp-content/uploads/2016/06/typehint-node-core-apis.gif" alt="demo of looking up core node.js api properties & methods using external node.js typescript definition file" />

It works! You now get &#8220;Intellisense&#8221; code hints for all Node.js core APIs. Your project won&#8217;t just be using Node core APIs though, you&#8217;ll be pulling in some utility libraries, starting with [lodash](https://lodash.com/). `typings search lodash` reveals that there&#8217;s a lodash definition from the `npm` source as well as `global` and `dt`. You want the `npm` version since you&#8217;ll be consuming lodash as **module** included with `require('lodash')` and it will _not_ be globally available.

```js
$ typings install --save npm~lodash
lodash@4.0.0
└── (No dependencies)

$ npm install --save lodash
typehinting-demo@1.0.0 /Users/sequoia/projects/typehinting-demo
└── lodash@4.13.1
```

Now you can require lodash and get coding:

<img class=" aligncenter" src="https://strongloop.com/wp-content/uploads/2016/06/typehint-lodash.gif" alt="example demonstrating property and method lookup of a application dependency (lodash)" />

So far you&#8217;ve seen how to install and consume types for Node and third party libraries, but you&#8217;re going to want these annotations for your own code as well. You can achieve this by using JSDoc comments, writing your own Typescript Declaration files, or a combination of both.

## JSDoc Annotations {#JSDoc-Annotations}

[JSDoc](http://usejsdoc.org/) is a tool that allows you to describe the parameters and return types of functions in JavaScript, as well as variables and constants. The main advantages of using JSDoc comments are:

  1. They&#8217;re lightweight and easy to use (just add comments to your code).
  2. The comments are human-readable, so they can be useful even if you&#8217;re reading the code on github or in a simple text editor.
  3. The syntax is similar to [Javadoc](http://docs.oracle.com/javase/8/docs/technotes/tools/windows/javadoc.html) and fairly intuitive.

JSDoc supports [many annotations](http://usejsdoc.org/index.html#block-tags), but you can get a long way just by learning a few, namely `<a href="http://usejsdoc.org/tags-param.html">@param</a>` and `<a href="http://usejsdoc.org/tags-returns.html">@return</a>`. Let&#8217;s annotate this simple function, which checks whether one string contains another string:

```js
function contains(input, search){
  return RegExp(search).test(input);
}

contains('Everybody loves types. It is known.', 'known'); // =&gt; true
```

With a function like this, it&#8217;s easy to forget the order of arguments or their types. Annotations to the rescue!

```js
/**
 * Checks whether one string contains another string
 * 
 * <a class='bp-suggestions-mention' href='https://strongloop.com/members/param/' rel='nofollow'>@param</a> {string} input   - the string to test against
 * <a class='bp-suggestions-mention' href='https://strongloop.com/members/param/' rel='nofollow'>@param</a> {string} search  - the string to search for
 * 
 * @return {boolean}
 */
function contains(input, search){
  return RegExp(search).test(input);
}
```

Suppose that while writing this, you realize this function actually works with regular expressions as the `search` parameter as well as strings. Update that line to make clear that both types are supported:

```js
/** 
 * ...
 * <a class='bp-suggestions-mention' href='https://strongloop.com/members/param/' rel='nofollow'>@param</a> {string|RegExp} search  - the string or pattern to search for
 * ...
 */
```

You can even add examples and links to documentation to help the next programmer out:

```js
/**
 * Checks whether one string contains another string
 * 
 * @example
 * ```
 * contains("hello world", "world"); // true
 * ```
 * @example
 * ```
 * const exp = /l{2}/;
 * contains("hello world", exp);  // true
 * ```
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
 * 
 * <a class='bp-suggestions-mention' href='https://strongloop.com/members/param/' rel='nofollow'>@param</a> {string} input          - the string to test against
 * <a class='bp-suggestions-mention' href='https://strongloop.com/members/param/' rel='nofollow'>@param</a> {string|RegExp} search  - the string or pattern to search for
 * 
 * @return {boolean}
 */
```

&#8230;and away we go!

<img class=" aligncenter" src="https://strongloop.com/wp-content/uploads/2016/06/typehint-jsdoc.gif" alt="example of hinting function parameters & types based on JSDoc comments" />

JSDoc works great and you&#8217;ve only scratched the surface of what it can do, but for more complex tasks or cases where you&#8217;re documenting a data structure that exists for example in a configuration file, TypeScript declaration files are often a better choice.

## Typescript Declarations {#Typescript-Declarations}

A TypeScript declaration file uses the extension `.d.ts` and describes the shape of an API, but _does not contain the actual API implementation_. In this way, they are very similar to the Java or PHP concept of an **interface**. If you were writing Typescript, you would declare the types of function parameters and so on right in the code, but JavaScript&#8217;s lack of types makes this impossible. The solution: declare the types in an JavaScript library in a Typescript (definition) file that can be installed _alongside_ the JavaScript library. This is the reason you installed the Lodash type definitions separately from Lodash.

This post won&#8217;t cover setting up external type definitions for an API you wnat to publish and registering them on the `typings` repository, but you can read about it in the [Typings documentation](https://github.com/typings/typings/blob/master/docs/examples.md). For now, let&#8217;s consider the case of a complex configuration file.

Imagine you have an application that creates a map and allows users to add features to the map. You&#8217;ll be deploying these editable maps to different client sites, so you want be able to configure the types of features users can add and the coordinates to on which to center the map for each site.

The `config.json` looks like this:

```js
{
  "siteName": "Strongloop",
  "introText":  {
    "title": "&lt;h1&gt; Yo &lt;/h1&gt;",
    "body": "&lt;strong&gt;Welcome to StrongLoop!&lt;/strong&gt;"
  },
  "mapbox": {
    "styleUrl": "mapbox://styles/test/ciolxdklf80000atmd1raqh0rs",
    "accessToken": "pk.10Ijoic2slkdklKLSDKJ083246ImEiOi9823426In0.pWHSxiy24bkSm1V2z-SAkA"
  },
  "coords": [73.153,142.621],
  "types": [
    {
      "name": "walk",
      "type": "path",
      "lineColor": "#F900FC",
      "icon": "test-icon-32.png"
    },
    {
      "name": "live",
      "type": "point",
      "question": "Where do you live?",
      "icon": "placeLive.png"
    }
    ...
```

You don&#8217;t want to have to read this complex JSON file each time you want to find the name of a key or remember the type of a property. Furthermore, it&#8217;s not possible to document this structure in the file itself because JSON does not allow comments.[*](#note-on-documenting-json){#documenting-json} Let&#8217;s create a Typescript declaration called `config.d.ts` to describe this configuration object, and put it in a directory in the project called `types/`.

```js
declare namespace Demo{
  export interface MapConfig {
      /** Used as key to ID map in db  */
      siteName: string;
      mapbox: {
        /** @see https://www.mapbox.com/studio/ to create style */
        styleUrl: string;
        /** @see https://www.mapbox.com/mapbox.js/api/v2.4.0/api-access-tokens/ */
        accessToken: string;
      };
      /** @see https://www.mapbox.com/mapbox.js/api/v2.4.0/l-latlng/ */
      coords: Array&lt;number&gt;;
      types : Array&lt;MapConfigFeature&gt;;
  }

 interface MapConfigFeature {
    type : 'path' | 'point' | 'polygon';
    /** hex color */
    lineColor?: string;
    name : string;
    /** Name of icon.png file */
    icon: string;
  }  
}
```

You can read more [in the Typescript docs](https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html) about what all is going on here, but in short, this file:

  1. Declares the `Demo` namespace, so you don&#8217;t collide with some other `MapConfig` interface.
  2. Declares two interfaces, essentially schemas describing the structure and purpose of the JSON.
  3. Defines the `types` property of the first interface as an array whose members are `MapConfigFeature`s.
  4. Exports `MapConfig` so you can reference it from outside the file.

VS Code will load the file automatically because it&#8217;s in the project, and you&#8217;ll use the `@type` annotation to mark the `conf` object as a `MapConfig` when it&#8217;s loaded from disk:

```js
/** @type {Demo.MapConfig} */
const conf = require('./config.js');
```

Now you can access properties of the configuration object and get the same code-completion, type information, and documentation hints! Note how in the following GIF, VS Code identifies not only that `conf.types` is an array, but when you call an `.filter` on it, knows that each element in the array is a `MapConfigFeature` type object:

<img class=" aligncenter" src="https://strongloop.com/wp-content/uploads/2016/06/typehint-mapconfig.gif" alt="example demonstrating looking up properties on an object based on a local Typescript Definition" />

I&#8217;ve been enjoying the benefits of JSDoc, Typescript Declarations, and the `typings` repository in my work. Hopefully this article will help you get started up and running with type hinting in JavaScript. If you have any questions or corrections, or if this post was useful to you, please [let me know](https://twitter.com/_sequoia)!

* <em id="note-on-documenting-json">There is actually <a href="http://json-schema.org/">a way to document the properties of JSON files</a>, and I hope to write about it in the future! <a href="#documenting-json">↩</a></em>