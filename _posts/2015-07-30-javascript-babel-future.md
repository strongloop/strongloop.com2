---
id: 25596
title: Making the most of JavaScript’s “future” today with Babel
date: 2015-07-30T09:00:19+00:00
author: Marc Harter
guid: https://strongloop.com/?p=25596
permalink: /strongblog/javascript-babel-future/
categories:
  - Community
  - How-To
  - JavaScript Language
---
<p class="graf--p">
  From CoffeeScript to ClojureScript to PureScript to CobolScript to <a class="markup--anchor markup--p-anchor" href="https://dogescript.com">DogeScript</a> (woof woof!), JavaScript is the write-once-run-anywhere target for many forms and styles of programming. Yet, its biggest compile-to-language today actually isn’t any of these adaptations; its JavaScript itself.
</p>

<p class="graf--p">
  Why?
</p>

<h2 class="graf--p" style="text-align: center;margin-bottom: 20px">
  <em><strong>Universality</strong></em>
</h2>

<p class="graf--p">
  If you are a client-side developer, it’s likely you’ve already enhanced older platforms with newer features. Take ES5 for example. Supporting IE8 was a pain, but <a class="markup--anchor markup--p-anchor" href="https://github.com/es-shims/es5-shim">es5-shim</a> made the JavaScript part a lot smoother.
</p>

<p class="graf--p">
  One of the things that attracted me to Node (circa 2009) was the ability to break away from browser support humdrum. It was blissful for a while, but Node is not exempt from legacy JavaScript compatibility issues anymore. Say you are a library author who is using generators in io.js but wants to support Node 0.10. Or you are sharing code between the client and server (like in a React application) and want to use classes or destructuring. The fact is, developers want to utilize new features without having to be concerned about legacy support. Legacy support isn’t a passion of mine, and I bet it isn’t one of yours.
</p>

<h2 class="graf--p" style="text-align: center;margin-bottom: 20px">
  <strong><em>JavaScript should be a write-once-run everywhere language</em></strong>
</h2>

<p class="graf--p">
  The JavaScript language is developing faster (ES7/2016 anyone?) than it ever has. Libraries are taking advantage of the new features, even though Node and Browser’s haven’t yet settled in to the new standards (take React’s <a class="markup--anchor markup--p-anchor" href="https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html">adoption of ES6 classes</a>, for example). I expect the trend to continue.
</p>

<p class="graf--p">
  The good news is that it is easy to start taking advantage of new language features now with <a class="markup--anchor markup--p-anchor" href="https://babeljs.io/">Babel</a> and have them work across legacy and current platforms. Babel has built in a source-map support for browsers and proper stack traces for Node, so it gets out of the way for you to focus on the ES6 code.
</p>

<p class="graf--p">
  <img class="aligncenter size-full wp-image-25666" src="{{site.url}}/blog-assets/2015/07/babel.png" alt="babel" width="400" height="400"  />
</p>

<blockquote class="graf--blockquote">
  <p>
    Babel isn’t the only <a class="markup--anchor markup--blockquote-anchor" href="https://en.wikipedia.org/wiki/Source-to-source_compiler">source-to-source</a> compiler for ES. <a class="markup--anchor markup--blockquote-anchor" href="https://github.com/google/traceur-compiler">Traceur</a> from Google is another example. For clarity, we will just focus on Babel here.
  </p>
</blockquote>

## **Practically speaking: Developing with ES6 and beyond** {.graf--h3}

<p class="graf--p">
  The remainder of this article will be a practical launching point if you haven’t used Babel before and perhaps fill in some gaps if you have. We will build a simple app to provide context. The final product is <a class="markup--anchor markup--p-anchor" href="https://github.com/strongloop-community/babel-example">located on GitHub</a>.
</p>

<p class="graf--p">
  Here is a starting structure.
</p>

```js
├── build
├── modules
│   ├── utils
│   │   ├── __tests__
│   │   │   └── sleep-test.js
│   │   └── sleep.js
│   └── index.js
├── .eslintrc
├── .babelrc
├── package.json
└── index.js
```

<ol class="postList">
  <li class="graf--li">
    The <code>build</code> folder contains the built assets for Node. This is used in production (or for published modules) and typically ignored in version control.
  </li>
  <li class="graf--li">
    The <code>modules</code> folder contains the application components themselves.
  </li>
  <li class="graf--li">
    The <code>.eslintrc</code> file is lint configuration.
  </li>
  <li class="graf--li">
    The <code>.babelrc</code> file is Babel configuration.
  </li>
  <li class="graf--li">
    The <code>package.json</code> contains scripts for running and building the project
  </li>
  <li class="graf--li">
    The <code>index.js</code> file sets up Babel hooks for development.
  </li>
</ol>

<p class="graf--p">
  Go ahead and create these files and directories. To create a <code>package.json</code> file quickly, just run <code>npm init -y</code>.
</p>

## **Installing dependencies** {.graf--h4}

<p class="graf--p">
  Now let’s get our dependencies installed and saved. Run the following to install our development dependencies:
</p>

```js
npm install babel babel-eslint eslint eslint-config-standard babel-tape-runner blue-tape -D
```

<ol class="postList">
  <li class="graf--li">
    <code>babel</code> is the main core babel project that allows us to set up our development environment
  </li>
  <li class="graf--li">
    <code>babel-eslint</code> is a parser for <code>eslint</code> that teaches the linter about experimental features that aren’t in ES6.
  </li>
  <li class="graf--li">
    <code>eslint</code> is a linting tool and <code>eslint-config-standard</code> is a set of configurations for <code>eslint</code> that we’ll write our code against which follows the <a class="markup--anchor markup--li-anchor" href="https://github.com/feross/standard">JS Standard</a> style.
  </li>
  <li class="graf--li">
    <code>babel-tape-runner</code> hooks in <code>babel</code> when running <a class="markup--anchor markup--li-anchor" href="https://github.com/substack/tape">tape</a> and <code>blue-tape</code> is an extension to <code>tape</code> that adds promise support (which will come in handy in a bit).
  </li>
</ol>

<p class="graf--p">
  Now that we have necessary dependencies to start our development, let’s install one more that will be used for production:
</p>

```js
npm install babel-runtime -S
```

<p class="graf--p">
  The <code>babel-runtime</code> package allows us to require only the features we need when distributing our application without polluting the global scope.
</p>

## **Configuring Babel** {.graf--h4}

<p class="graf--p">
  Let’s look at the <code>.babelrc</code> file next. Having a <code>.babelrc</code> file allows you to configure Babel in <em class="markup--em markup--p-em">one spot</em> in your project and it will work regardless how its run. Create a <code>.babelrc</code> file with the following content:
</p>

```js
{
  "stage": 0,
  "loose": "all"
}
```

<p class="graf--p">
  There are a number of <a class="markup--anchor markup--p-anchor" href="https://babeljs.io/docs/usage/options/">options</a> for configuration, but we will focus on two:
</p>

<ol class="postList">
  <li class="graf--li">
    The <code>stage</code> option defines what minimum proposal stage you want to support. By default, Babel provides the functionality found in the ES6 standard. However, Babel also includes support for language proposals for the next standard. This is pretty cool because it allows you to test drive features and give feedback to implementers as it goes through standardization. Specification proposals are subject to change in breaking ways or completely fizzle out all together. The higher the stage, the further along the specification is in the standardization process. You can view all of the proposals supported on the <a class="markup--anchor markup--li-anchor" href="https://babeljs.io/docs/usage/experimental/">Experimental</a> page. We will use the <code>async/await</code> proposal in our application.
  </li>
  <li class="graf--li">
    The <code>loose</code> option will generate cleaner and faster output as it won’t check ECMA specification fringe cases that are likely not to appear in your code. However, make sure you are aware of the <a class="markup--anchor markup--li-anchor" href="https://babeljs.io/docs/advanced/loose/">edge cases</a> before you use loose mode. This is handy for production performance as well.
  </li>
</ol>

## **Building our application** {.graf--h4}

<p class="graf--p">
  Now that we have Babel configured, let’s write some code! First, set up the root <code>index.js</code> file for development purposes with the following code:
</p>

```js
require('babel/register')
require('./modules')
```

<ol class="postList">
  <li class="graf--li">
    The <code>require(‘babel/register’)</code> line registers Babel, pulls in our <code>.babelrc</code> configuration and also includes a polyfill for ES6 extensions for native objects like <code>Number.isNaN</code> and <code>Object.assign</code>.
  </li>
  <li class="graf--li">
    Now that Babel is registered, <em class="markup--em markup--li-em">any</em> file we require after that will be transpiled on the fly. So, in our case, we require our application with <code>require('./modules')</code>.
  </li>
</ol>

<p class="graf--p">
  Next, let’s create an entirely lame app that makes use of ES6 and the experimental <code>async/await</code> proposal. Put the following code in <code>modules/index.js</code>:
</p>

```js
import { hostname } from 'os'
import sleep from './utils/sleep'

async function runApp () {
  console.log('time for bed', hostname())
  await sleep(200)
  console.log('&#x1f634;')
  await sleep(1000)
  console.log('&#x1f4a4;')
}

runApp()
```

<p class="graf--p">
  I told you it was lame. However, we are making use of the new <code>import</code> syntax to pull in the <code>hostname</code> function from the <code>os</code> module and include a <code>sleep</code> module (which we’ll write in a bit). We are also using the <a class="markup--anchor markup--p-anchor" href="https://github.com/tc39/ecmascript-asyncawait"><code>async/await</code> proposal</a> to write clean asynchronous code (currently at stage 1 in the standardization process).
</p>

<p class="graf--p">
  Let’s write our sleep module next. Add the following code to <code>modules/utils/sleep.js</code>:
</p>

```js
export default function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

<p class="graf--p">
  This little helper function turns <code>setTimeout</code> into a promise returning function that resolves when a timeout is completed. Since the <code>await</code> syntax we used above awaits promises, this allows us to write a succinct delay code.
</p>

<p class="graf--p">
  Let’s see if our application works! Run the following from the project root to test:
</p>

```js
node index.js
```

<p class="graf--p">
  You’re output should be similar to this:
</p>

```js
time for bed wavded.local
&#x1f634;
&#x1f4a4;
```

<p class="graf--p">
  Exciting right?! Don’t answer that.
</p>

<p class="graf--p">
  Now that we have an application to play with, let’s look at a few more tools you likely use in day-to-day development and how they translate when using Babel.
</p>

## **Testing Babel code** {.graf--h4}

<p class="graf--p">
  Let’s add a test for our <code>sleep</code> utility we developed in the last section. Inside <code>modules/utils/__tests__/sleep-test.js</code> let’s add the following:
</p>

```js
import test from 'blue-tape'
import sleep from '../sleep'

test('sleep', async function (t) {
  let start = Date.now()
  await sleep(20)
  let end = Date.now()
  t.ok(end - start >= 20, 'takes about 20 milliseconds')
})
```

<p class="graf--p">
  Notice how we are using <code>async/await</code> and ES6 syntax in our test suite just like in our application code. Let’s add the following script to our <code>package.json</code> file in order to run this:
</p>

```js
scripts: {
  "test": "babel-tape-runner \"modules/**/__tests__/*-test.js\""
}
```

<p class="graf--p">
  Now we can run:
</p>

```js
npm test
```

<p class="graf--p">
  And we will get the following output:
</p>

```js
TAP version 13
# sleep
ok 1 takes about 20 seconds

1..1
# tests 1
# pass 1

# ok
```

<p class="graf--p">
  Groovy. We can use Babel for tests as well as application code.
</p>

## **Linting Babel** {.graf--h4}

<p class="graf--p">
  Let’s turn to our <code>.eslintrc</code> file next and add the following:
</p>

```js
{
  "extends": "standard",
  "parser": "babel-eslint",
  "env": {
    "node": true,
    "es6": true
  },
  "emcaFeatures": {
    "modules": true
  }
}
```

<ol class="postList">
  <li class="graf--li">
    The <code>extends</code> line hooks up JS Standard rule definitions.
  </li>
  <li class="graf--li">
    The <code>parser</code> line tells <code>eslint</code> to use the <code>babel-eslint</code> for parsing instead of the default parser allowing us to parse experimental JavaScript features.
  </li>
  <li class="graf--li">
    The <code>env</code> lines let <code>eslint</code> know that we are using Node and ES6 features.
  </li>
  <li class="graf--li">
    By default the <code>es6</code> environment enables all ES6 features except modules, so we enable that as well in the <code>ecmaFeatures</code> block.
  </li>
</ol>

<p class="graf--p">
  Let’s add a script to our package.json file for linting.
</p>

```js
scripts: {
  "test": "babel-tape-runner \"modules/**/__tests__/*-test.js\"",
  "lint": "eslint modules index.js"
}
```

<p class="graf--p">
  And we then can run:
</p>

```js
npm run lint
```

<p class="graf--p">
  Which will give us no output currently as there aren’t any linting errors.
</p>

## **Running Babel in production** {.graf--h4}

<p class="graf--p">
  Our <code>index.js</code> is handy for running Babel in development as its all in-memory and we don’t need a manual compilation step. However, that isn’t ideal for production for a couple reasons:
</p>

<ol class="postList">
  <li class="graf--li">
    Start up times are slower as the code base needs to be compiled in-memory first. Time increases with larger code bases.
  </li>
  <li class="graf--li">
    Second is that “in-memory” bit. We will have extra memory overhead if we do it this way; it will vary depending on the project size and dependencies.
  </li>
</ol>

<p class="graf--p">
  We can add a build step for production that can be run before publishing to npm or as part of continuous integration. Let’s add a couple more scripts to our <code>package.json</code> file:
</p>

```js
scripts: {
  ...
  "clean": "rm -rf build || true",
  "build": "npm run clean && cp -rf modules build && babel --optional runtime -d build ./modules"
}
```

<ol class="postList">
  <li class="graf--li">
    The <code>clean</code> script just cleans out our previous build.
  </li>
  <li class="graf--li">
    The <code>build</code> script compiles the app. First, it cleans. Then, it copies any assets (including any .json files) to the build directory so they can be referenced properly. Finally, it runs the <code>babel</code> command to build all the JavaScript files in <code>modules</code> and puts the output in the <code>build</code> directory.
  </li>
</ol>

<p class="graf--p">
  We also include an additional configuration option for Babel called <code>runtime</code>. The <code>runtime</code> optional won’t pollute the global scope with language extensions like the polyfill that is used when called <code>require('babel/register')</code> above. This keeps your packages playing nice with others.
</p>

<p class="graf--p">
  Let’s try a build by running:
</p>

```js
npm run build
```

<p class="graf--p">
  You should get the following output refering the compiled files:
</p>

```js
modules/index.js -> build/index.js
modules/utils/__tests__/sleep-test.js -> build/utils/__tests__/sleep-test.js
modules/utils/sleep.js -> build/utils/sleep.js
```

<p class="graf--p">
  Now we can run our precompiled version with the following command:
</p>

```js
node build
```

<p class="graf--p">
  And we should get the same output as we did when we ran in development.
</p>

<p class="graf--p">
  Now that we’ve done a build, poke around at the files in the <code>build</code> directory and see how they compare with the originals.
</p>

## **Source maps in production** {.graf--h4}

<p class="graf--p">
  Although <code>loose</code> mode (which we enabled in the <em class="markup--em markup--p-em">Configuring Babel</em> section above) will generate cleaner and faster output, you may still want to use source maps in production. This allows you to get at the original line numbers in stack traces. To do this, change your <code>babel</code> command to:
</p>

```js
babel --source-maps inline --optional runtime -d build ./modules
```

<p class="graf--p">
  You will also need the <code>source-map-support</code> package in npm in order for proper stack traces to appear in your error messages.
</p>

```js
npm install source-map-support -S
```

<p class="graf--p">
  To enable, add the following at the top of <code>build/index.js</code>
</p>

```js
require('source-map-support')
```

## **Wrapping up** {.graf--h4}

<p class="graf--p">
  Babel allows you to write ES6 and beyond today and have it work across different versions of Node and also work across different browsers on the client side (see <a class="markup--anchor markup--p-anchor" href="http://www.2ality.com/2015/04/webpack-es6.html" rel="nofollow">http://www.2ality.com/2015/04/webpack-es6.html</a> for an example). The most exciting thing for me that has been a joy to work with is universal JavaScript applications that share most of their code and then I get to write it in ES6.
</p>

## **PS: Syntax and Babel** {.graf--h4}

<p class="graf--p">
  Let’s quickly talk about your text editor before we go shall we? Lots of the new constructs won’t be highlighted properly when you start using Babel. Thankfully, the community has rocked this one and you should definitely switch if you haven’t as a lot of these have good support for things like <a class="markup--anchor markup--p-anchor" href="https://facebook.github.io/react/docs/jsx-in-depth.html">JSX</a> and <a class="markup--anchor markup--p-anchor" href="http://flowtype.org">Flow</a>.
</p>

<ol class="postList">
  <li class="graf--li">
    <a class="markup--anchor markup--li-anchor" href="https://github.com/babel/babel-sublime">Sublime Text</a>
  </li>
  <li class="graf--li">
    <a class="markup--anchor markup--li-anchor" href="https://atom.io/packages/language-babel">Atom</a>
  </li>
  <li class="graf--li">
    <a class="markup--anchor markup--li-anchor" href="https://github.com/pangloss/vim-javascript">Vim</a>
  </li>
  <li class="graf--li">
    <a class="markup--anchor markup--li-anchor" href="https://github.com/mooz/js2-mode">Emacs</a>
  </li>
</ol>

####  {.graf--h4.graf--empty}