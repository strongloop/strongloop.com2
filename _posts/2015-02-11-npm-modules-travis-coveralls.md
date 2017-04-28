---
id: 23472
title: Building Better npm Modules with Travis and Coveralls
date: 2015-02-11T12:58:56+00:00
author: Valeri Karpov
guid: http://strongloop.com/?p=23472
permalink: /strongblog/npm-modules-travis-coveralls/
categories:
  - Community
  - Resources
---
Part of what makes Node.js so great is the wide variety of high-quality modules available on npm. But, way too many modules don&#8217;t take advantage of testing tools like [Travis](https://travis-ci.org/) and [Coveralls](https://coveralls.io/). Travis is a lightweight continuous integration tool that runs tests on every commit to your GitHub repo, even pull requests. Coveralls is a test coverage reporter that you can integrate with Travis. These tools improve your workflow, make reviewing pull requests easier, and make users more confident in your module&#8217;s quality. In this article, you&#8217;ll learn how to integrate these tools with [mocha](https://www.npmjs.com/package/mocha) and [istanbul](https://www.npmjs.com/package/istanbul) for a simple Node project.

This example will use a [JavaScript implementation](https://github.com/vkarpov15/fizzbuzz-coverage) of the well-known [&#8220;fizzbuzz&#8221; programming challenge](http://en.wikipedia.org/wiki/Fizz_buzz). Fizzbuzz is far from a [complex module](https://github.com/EnterpriseQualityCoding/FizzBuzzEnterpriseEdition), but it&#8217;s just complex enough to get real test coverage results. To walk through this example, [fork it on GitHub](https://github.com/vkarpov15/fizzbuzz-coverage). The actual code is below.

```js
module.exports = function(n) {
 if (typeof n !== 'number') {
   return null;
 }

 if (n % 3 === 0 && n % 5 === 0) {
   return 'fizzbuzz';
 }
 if (n % 3 === 0) {
   return 'fizz';
 }
 if (n % 5 === 0) {
   return 'buzz';
 }

 return '' + n;
};
```

<!--more-->

The module&#8217;s code is not particularly interesting. Testing it is a more subtle task. Most modern testing practices are based on the notion of [cyclomatic complexity](http://en.wikipedia.org/wiki/Cyclomatic_complexity). In other words, 100% test coverage means that your tests execute every possible code path. The fizzbuzz example above has 10 possible code paths (or &#8220;branches&#8221; in Coveralls parlance). Each if statement contributes 2 code paths, except the one with &&, which contributes 4. For instance, if you were to replace

```js
if (n % 3 === 0 && n % 5 === 0)
```

with

```js
if (n % 15 === 0)
```

there would only be 8 branches.

## **Setting up Mocha tests and producing coverage output**

The first step is to get test coverage output locally. There are several good test frameworks and coverage tools available on npm. But, my tools of choice are the [mocha](https://www.npmjs.com/package/mocha) test framework and [istanbul](https://www.npmjs.com/package/istanbul) for test coverage. You should be able to use any test framework you like in place of mocha in this tutorial, but I find mocha to be a sensible default. First, add mocha and istanbul to your `devDependencies` in `package.json`.

```js
"devDependencies": {
   "istanbul": "0.3.5",
   "mocha": "2.0.0"
 },
```

You should also add a test script to your `package.json`, so you can run your tests with the `npm test` command.

```js
"scripts": {
   "test": "./node_modules/mocha/bin/mocha ./test/a*"
 }
```

Now, here are some mocha tests for the fizzbuzz module. Mocha uses a BDD-style syntax, which means `describe()` and `it()` correspond roughly to &#8220;suites&#8221; and &#8220;tests&#8221; in more conventional testing frameworks like JUnit.

```js
var assert = require('assert');
var fizzbuzz = require('../');

describe('fizzbuzz', function() {
 it('returns null when passed a non-number', function() {
   assert.equal(fizzbuzz('abc'), null);
 });

 it('returns fizzbuzz when divisible by 15', function() {
   assert.equal(fizzbuzz(45), 'fizzbuzz');
 });

 it('returns fizz when divisible by 3 but not 5', function() {
   assert.equal(fizzbuzz(6), 'fizz');
 });

 it('returns buzz when divisble by 5 but not 3', function() {
   assert.equal(fizzbuzz(10), 'buzz');
 });

 it('returns input otherwise', function() {
   assert.equal(fizzbuzz(7), '7');
 });
});
```

Run these tests with npm test, and you should see a simple test report.

```js
~/Personal/fizzbuzz-coverage $ npm test

> fizzbuzz-coverage@0.0.0 test /Users/vkarpov/Personal/fizzbuzz-coverage
> ./node_modules/mocha/bin/mocha ./test/*

 fizzbuzz
    ✓ returns null when passed a non-number 
    ✓ returns fizzbuzz when divisible by 15 
    ✓ returns fizz when divisible by 3 but not 5 
    ✓ returns buzz when divisble by 5 but not 3 
    ✓ returns input otherwise 

  5 passing (7ms)
```

Now the question is, how do you get coverage output? That&#8217;s where istanbul comes in. Istanbul provides a simple executable that wraps your test command and produces [lcov output](http://ltp.sourceforge.net/coverage/lcov.php) by default. Add a `test-travis` script to your `package.json` scripts as shown below.

```js
"scripts": {
   "test": "./node_modules/mocha/bin/mocha ./test/*",
   "test-travis": "./node_modules/istanbul/lib/cli.js cover ./node_modules/mocha/bin/_mocha -- -R spec ./test/*"
 }
```

<p dir="ltr">
  The script may seem intimidating, but it’s simple once you look at it carefully. The <code>./node_modules/istanbul/lib/cli.js</code> executable is istanbul&#8217;s CLI wrapper. You can also <code>require()</code> istanbul in your Node scripts, but the executable is sufficient for this example. The istanbul CLI takes a <code>cover</code> option that tells it to produce coverage output.
</p>

<p dir="ltr">
  The rest of the <code>test-travis</code> script configures mocha. First, note that the above script uses the <code>_mocha</code> executable, whereas the <code>test</code> script used <code>./node_modules/mocha/bin/mocha</code>. This is a <a href="https://github.com/gotwarlost/istanbul/issues/44">common source of confusion when beginners try to set up istanbul and mocha</a>. The mocha executable forks off a separate executable, <code>_mocha</code>, to actually runs tests. If you were to run the mocha executable through istanbul, you would get no coverage output.
</p>

<p dir="ltr">
  The <code>--</code> means the <a href="http://unix.stackexchange.com/questions/11376/what-does-double-dash-mean-also-known-as-bare-double-dash">end of options passed to the istanbul executable</a>. Everything after <code>--</code> will actually be interpreted as an option to the <code>_mocha</code> executable.
</p>

<p dir="ltr">
  Now that you have the <code>test-travis</code> script, run it to see test coverage output.
</p>

```js
specter:fizzbuzz-coverage vkarpov$ npm run-script test-travis

> fizzbuzz-coverage@0.0.0 test-travis /Users/vkarpov/Personal/fizzbuzz-coverage
> ./node_modules/istanbul/lib/cli.js cover ./node_modules/mocha/bin/_mocha -- -R spec ./test/*

 fizzbuzz
   ✓ returns null when passed a non-number 
   ✓ returns fizzbuzz when divisible by 15 
   ✓ returns fizz when divisible by 3 but not 5 
   ✓ returns buzz when divisble by 5 but not 3 
   ✓ returns input otherwise 

 5 passing (6ms)

=============================================================================
Writing coverage object [/Users/vkarpov/Personal/fizzbuzz-coverage/coverage/coverage.json]
Writing coverage reports at [/Users/vkarpov/Personal/fizzbuzz-coverage/coverage]
=============================================================================

=============================== Coverage summary ===============================
Statements   : 100% ( 10/10 )
Branches     : 100% ( 10/10 )
Functions    : 100% ( 1/1 )
Lines        : 100% ( 10/10 )
================================================================================
```

Congratulations, you have 100% test coverage! Next up, you&#8217;re going to set up Travis to run this command automatically on every commit and pull request.

## **Running tests and generating coverage output with Travis**

<p dir="ltr">
  Travis is a tool that enables you to run a script on every GitHub commit. You can instrument Travis to run the <code>test-travis</code> script you saw above. Also, you can configure Travis to post the coverage output to Coveralls.
</p>

First, if you don&#8217;t have a Travis account yet, [sign up for one](https://travis-ci.org/). Next, add a new repository to Travis using the &#8220;Add New Repository&#8221; button.

<img class="aligncenter" src="https://lh4.googleusercontent.com/mY80xEfEFY3j0eTS_ZXhtingoBh1LWhhw2Vtm9TKfNB0msTDXmwIGOu-jKuUenKyUo425GCNZYtC-Gw45fHV70dpi8OpBxR7cReyf_-SKj4I-g_R66MNqsafC2Hav4h_VTs" alt="" width="624px;" height="408px;" />

Find the `fizzbuzz-coverage` repo and add it. Next, sign up for an [account on Coveralls](https://coveralls.io/). Click on the &#8220;Add Repos&#8221; button and add `fizzbuzz-coverage`.

<img class="aligncenter" src="https://lh4.googleusercontent.com/L07wmJwFJfWn9EmNs35j8ZovJS2i8ukal07dWa1sl0WiA8Od9cCQv5_CS-GDhoCRLT_eCeFwUC7XKzPF20dWSH9SyCGCLgUQl_4VwZPK01ncUztg7NhUUQIXaCoys_dfG-g" alt="" width="624px;" height="47px;" />

In order to use Travis, your GitHub repo should have a `.travis.yml` file. This file tells Travis how to run tests. For instance, below is the `.travis.yml` file for the `fizzbuzz-coverage` repo (minus one line that you&#8217;ll learn about later).

```js
language: node_js
node_js:
 - "0.11"
 - "0.10"
script: "npm run-script test-travis"
```

<p dir="ltr">
  This file should seem simple even if you&#8217;ve never worked with Travis before. This configuration tells Travis to run <code>npm run-script test-travis</code> on Node 0.10 and 0.11. When you specify <code>language: node_js</code>, Travis handles installing Node, cloning your repo, and running <code>npm install</code> for you.
</p>

Now, how do you send istanbul&#8217;s coverage output to Coveralls? Like just about everything these days, [there&#8217;s an npm module for that](https://www.npmjs.com/package/coveralls). The coveralls npm module contains an executable file `coveralls.js` that you can use to send coverage output to Coveralls. You just need to add coveralls to your `package.json`:

```js
"devDependencies": {
   "coveralls": "2.10.0",
   "istanbul": "0.3.5",
   "mocha": "2.0.0"
 },
```

and one line to your `.travis.yml` file.

```js
language: node_js
node_js:
 - "0.11"
 - "0.10"
script: "npm run-script test-travis"
# Send coverage data to Coveralls
after_script: "cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js"
```

That&#8217;s it! You should now have [automatic code coverage for every future commit in an elegant GUI](https://coveralls.io/builds/1849085).

## **Adding badges**

Now that you&#8217;ve wired your repo to run tests on Travis and send coverage data to Coveralls, you&#8217;re probably wondering how to get those sweet badges on your GitHub repo.

<img class="aligncenter" src="https://lh4.googleusercontent.com/iC4fpSVNGw8jLaoFVeC4n6Ox0kOQ1Edc6FeohYWY9hfn_lzXRdhsSDxnsAOthcVt0u0r2U5eAHVtpc4ePjjaR0KpSM-iRorB3Ou0Ud-oZCl41cJZpK61Gc5CcXXBZKxpOWw" alt="" width="418px;" height="61px;" />

Travis and Coveralls expose API endpoints that let you get these SVG (or PNG) representations of your repo&#8217;s status. To get the SVGs for `fizzbuzz-coverage`, you should wrap the following images in an `<img>` tag.

```js
https://api.travis-ci.org/vkarpov15/fizzbuzz-coverage.svg?branch=master
https://coveralls.io/repos/vkarpov15/fizzbuzz-coverage/badge.svg?branch=master
```

You can get the build status and coverage info for any branch by changing the branch query param. Below is the markdown code that generates the badges for the GitHub README.

```js
[![Build Status](https://travis-ci.org/vkarpov15/fizzbuzz-coverage.svg?branch=master)](https://travis-ci.org/vkarpov15/fizzbuzz-coverage)
[![Coverage Status](https://coveralls.io/repos/vkarpov15/fizzbuzz-coverage/badge.svg)](https://coveralls.io/r/vkarpov15/fizzbuzz-coverage)
```

## **Conclusion**

In this article, you saw how easy it can be to tie your npm modules into Travis and Coveralls. Continuous integration and code coverage used to only be feasible for the Googles of the world, but now even small npm modules can take advantage of these sophisticated dev practices. I look forward to seeing more npm authors take advantage of these excellent tools and get serious about test coverage.

<div id="design-apis-arc" class="post-shortcode" style="clear:both;">
  <h2>
    <a href="http://strongloop.com/node-js/arc/"><strong>Develop APIs Visually with StrongLoop Arc</strong></a>
  </h2>
  
  <p>
    StrongLoop Arc is a graphical UI for the <a href="http://strongloop.com/node-js/api-platform/">StrongLoop API Platform</a>, which includes LoopBack, that complements the <a href="http://docs.strongloop.com/pages/viewpage.action?pageId=3834790">slc command line tools</a> for developing APIs quickly and getting them connected to data. Arc also includes tools for building, profiling and monitoring Node apps. It takes just a few simple steps to <a href="http://strongloop.com/get-started/">get started</a>!
  </p>
  
  <img class="aligncenter size-large wp-image-21950" src="{{site.url}}/blog-assets/2014/12/Arc_Monitoring_Metrics-1030x593.jpg" alt="Arc_Monitoring_Metrics" width="1030" height="593" />
</div>