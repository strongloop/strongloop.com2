---
id: 26502
title: 3 Neat Tricks with npm run
date: 2016-01-13T12:00:31+00:00
author: Valeri Karpov
guid: https://strongloop.com/?p=26502
permalink: /strongblog/3-neat-tricks-with-npm-run/
categories:
  - How-To
---
Most Node.js developers use npm as a package manager. However, npm is also a powerful task runner that can serve as a replacement for gulp. The \`npm run\` command lets you define custom scripts in your `package.json`, so you can reduce complex node-related shell scripts into simple one-liners. In this article, you&#8217;ll learn about common `npm` run use cases, including using `npm run` to pipe ES6 browser code through Babel and Browserify.
  
<!--more-->

## **Setting Environment Variables and Flags**

Node.js has several handy configuration options you can set using environment variables and command line flags (like the old `--harmony` flag that you used to enable ES2015 features in 0.12.x). The `npm run` command, and `npm start` in particular, let you set any flags your application needs before running.

For instance, the `NODE_PATH` environment variable lets you add additional directories to the `require()` function&#8217;s module search path. In other words, suppose your project has a `lib` directory that contains your source code, and a `test` directory that contains your tests. Let&#8217;s say you have a test in `test/e2e/my_feature/my_feature.test.js` that wants to `require()` in a function that&#8217;s declared in `lib/server/my_feature/utils.js.` That&#8217;s going to involve a brittle `require('../../../lib/server/my_feature_utils');` command that&#8217;ll break every time your directory structure changes. However, if you run `env NODE_PATH=./ node test/e2e/my_feature/my_feature.test.js, require()` will know to look in the current directory, so you can instead use: `require('lib/server/my_feature/utils');`

Unfortunately, every environment variable and flag you need to set adds extra complexity to starting your application. Odds are, if you need to set 17 environment variables and flags to start your application, you&#8217;re going to forget one or two. Suppose your application relies on the `env NODE_PATH=./` trick as well as [ES2015 proxies](http://thecodebarbarian.com/2015/04/24/80-20-guide-to-ecmascript-6-proxies), which are hidden behind the `--harmony_proxies` flag as of this writing. You can define a `start` script in your package.json file as shown below.

```js
<code class="javascript">{
  "scripts": {
    "start": "env NODE_PATH=./ node --harmony_proxies index.js"
  }
}</code>
```

Now, if you run `npm start` (which is just short for `npm run start`), npm will run the `start` script for you and start your application with your special configuration options.

## **Command Line Shortcuts**

Let&#8217;s face it, [asking users to `npm install -g` (usually) sucks](http://thecodebarbarian.com/2015/02/27/npm-install--g). You may have heard that the upcoming gulp 4.0 release will be entirely incompatible with gulp 3.x. Since many people install gulp globally and there&#8217;s no way for `package.json` to enforce globally-installed packages, a lot of users are going to end up playing a guessing game as to which version of gulp they need.

It&#8217;s much better to list gulp as a `devDependency` in `package.json`, but then you have to run`./node_modules/.bin/gul`p watch rather than gulp watch, which is a pain. That&#8217;s where `npm run` comes in; it adds `./node_modules/.bin` to your `PATH`. In other words, if you list gulp 3.8 as a `devDependency`, you can access the `gulp` executable in your `package.json` scripts without asking your users to `npm install gulp -g`.

```js
<code class="javascript">{
  "scripts": {
    "watch": "gulp watch"
  }
}</code>
```

Now, `npm run watch` is a handy shortcut for `./node_modules/.bin/gulp` watch. You can do the same thing with mocha.

```js
<code class="javascript">{
  "scripts": {
    "test": "mocha -r nyan test/*.test.js"
  }
}</code>
```

Now `npm test` (which is the same as `npm run test`) is a handy shortcut for running all your mocha tests in your `test` directory using the nyan cat reporter.

The mocha executable also has some neat command line flags. For instance, the `--grep` (or `-g` for short) mocha flag lets you only run tests whose names match the given regular expression. In npm >= 2.14.0, you can use `--` to pass extra flags to mocha. For instance, the below commands are equivalent.

```js
<code class="javascript"># This command...
npm test -- -g "login.*fails"
# is the same thing as this one
./node_modules/.bin/mocha -r nyan test/*.test.js -g "login.*fails"</code>
```

## **An Alternative to Gulp**

Gulp is a powerful streaming build system that lets you parallelize compiling your files. It&#8217;s a great tool, but it can be overkill for some applications, especially if your team doesn&#8217;t have much experience with Node.js streams. The `npm run` command can serve as a less-performant replacement for gulp in many use cases. For instance, suppose you have some ES2015 code in `example.js` that you want to transpile with babel and then pipe into browserify for use in the browser.

```js
<code class="javascript">'use strict';

const co = require('co');

co(function*() {
  console.log('Hello, world!');
});</code>
```

If you wanted to use gulp to compile this, you&#8217;d probably use the `gulp-babel` and `gulp-browserify` npm modules, which wrap babel and browserify for gulp. However, babel and browserify have command line interfaces, so you can compile this file using Unix-style pipes. Note that the below example requires babel 5.x, it won&#8217;t work with babel 6.

```js
<code class="javascript">
./node_modules/.bin/browserify example.js | ./node_modules/.bin/babel > ./bin/example.js
</code>
```

Once again, the `./node_modules/.bin` part is annoying. Thankfully, if you define a compile script in `package.json`, you can just achieve the same result with `npm run` compile.

```js
<code class="javascript">{
  "scripts": {
    "compile": "browserify example.js | babel > ./bin/example.js"
  }
}</code>
```

## **Closing Thoughts**

The `npm run` command lets npm function as a versatile task runner in addition to a task manager. Good node.js applications leverage `npm start` and `npm test` to make it explicit how to run your application and how to test it. Also, `npm run` makes including executable npm modules (gulp, mocha, karma, etc.) as `devDependencies` more convenient. You can even leverage `npm run` and Unix streams to run your build processes without the help of a build system like gulp or grunt. Conceptually, `npm run` and the `scripts` section in `package.json` should define how to do the most common command-line tasks for your application, like starting the application, testing it, and running any transpilers.