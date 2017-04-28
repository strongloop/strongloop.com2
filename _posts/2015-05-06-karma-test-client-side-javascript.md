---
id: 24666
title: How-to Test Client-Side JavaScript with Karma
date: 2015-05-06T08:27:35+00:00
author: Valeri Karpov
guid: https://strongloop.com/?p=24666
permalink: /strongblog/karma-test-client-side-javascript/
categories:
  - Community
  - How-To
---
I have often quipped that if I were stuck on a desert island with only one npm module, I&#8217;d choose [karma](https://www.npmjs.com/package/karma). The one place where you can&#8217;t avoid using JavaScript is in the browser. Even [Dart](http://en.wikipedia.org/wiki/Dart_%28programming_language%29) needs to be transpiled to JavaScript to work on browsers other than [Dartium](https://www.dartlang.org/tools/dartium/). And code that can&#8217;t be tested should not be written. Karma is a widely-adopted command-line tool for testing JavaScript code in real browsers. It has a [myriad of plugins](https://www.npmjs.com/search?q=karma) that enable you to write tests using virtually any testing framework (mocha, jasmine, ngScenario, etc.) and run them against a local browser or in Sauce Labs&#8217; [Selenium cloud](https://saucelabs.com/).

In this article, you&#8217;ll see how to use karma to test standalone JavaScript locally, to test DOM interactions locally, and to run tests on Sauce Labs. The code for all these examples is available on [my karma-demo GitHub repo](https://github.com/vkarpov15/karma-demo).

## **Your First Karma Test**

Like [gulp](https://www.npmjs.com/package/gulp) or [metalsmith](https://www.npmjs.com/package/metalsmith), karma is organized as a lightweight core surrounded by a loose confederation of plugins. Although you will interact with the karma core executable, you will typically need to install numerous plugins to do anything useful.

Suppose you have a trivial browser-side JavaScript file like below. This code is `lib/sample.js` in the [karma-demo GitHub repo](https://github.com/vkarpov15/karma-demo/blob/master/lib/sample.js).

```js
function theAnswer() {
  return 42;
}
```

Testing this in Node.js would be fairly simple. But, what if you wanted to test this in a real browser, like Chrome? Let&#8217;s say you have the [following test file](https://github.com/vkarpov15/karma-demo/blob/master/test/sample.test.js).

```js
describe('sample', function() {
  it('returns 42', function() {
    assert.equal(theAnswer(), 42);
  });
});
```

To run this test in Chrome, set up your `package.json` with karma and 3 plugins. As you might expect, `karma-mocha` is a karma plugin that enables you to use the [mocha test framework](https://www.npmjs.com/package/mocha), and `karma-chrome-launcher` enables karma to launch Chrome locally. The `karma-chai` package is a wrapper around the `chai` assertion framework, since neither mocha nor karma includes an [assertion framework](https://www.npmjs.com/package/chai) by default.

```js
{
  "devDependencies": {
    "karma": "0.12.31",
    "karma-chai": "0.1.0",
    "karma-chrome-launcher": "0.1.4",
    "karma-mocha": "0.1.10"
  }
}
```

Now that you have karma installed, you need a karma config file. You can run `./node_modules/karma/bin/karma init` to have karma initialize one for you, but the [karma config file you&#8217;re going to need](https://github.com/vkarpov15/karma-demo/blob/master/test/karma.mocha.conf.js) is shown below.

```js
module.exports = function(config) {
  config.set({
    // Use cwd as base path
    basePath: '',

    // Include mocha test framework and chai assertions
    frameworks: ['mocha', 'chai'],

    // Include the test and source files
    files: ['../lib/*.js', './sample.test.js'],

    // Use built-in 'progress' reporter
    reporters: ['progress'],

    // Boilerplate
    urlRoot : '/__karma__/',
    port: 8080,
    runnerPort: 9100,
    colors: true,
    logLevel: config.LOG_INFO,

    /* Karma can watch the file system for changes and
     * automatically re-run tests. Making karma do it
     * is more efficient than using gulp because karma
     * can re-use the same browser process. Set this to
     * true and `singleRun` to false to run tests
     * continuously */
    autoWatch: false,

    // Set the browser to run
    browsers: ['Chrome'],

    // See autoWatch
    singleRun: true,

    // Consider browser as dead if no response for 5 sec
    browserNoActivityTimeout: 5000
  });
};

```

One key feature of the above config file is that karma configs are NodeJS JavaScript, not just JSON or YAML. You can do file I/O, access environment variables, and `require()` npm modules in your karma configs.

Once you have this config file, you can run karma using the `./node_modules/karma/bin/karma start test/karma.mocha.conf.js` command. You should see a Chrome browser pop up and output similar to what you see below in the shell:

```js
$ ./node_modules/karma/bin/karma start ./test/karma.mocha.conf.js 
INFO [karma]: Karma v0.12.31 server started at http://localhost:8081/__karma__/
INFO [launcher]: Starting browser Chrome
Chrome 42.0.2311 (Mac OS X 10.10.3): Executed 1 of 1 SUCCESS (0.012 secs / 0.001 secs)
```

If you see the “SUCCESS” message, that means your test ran successfully.

## **Testing DOM Interactions with ngScenario**

Karma isn&#8217;t just useful for testing isolated JavaScript. With [ngScenario](https://code.angularjs.org/1.2.16/docs/guide/e2e-testing) and the [karma-ng-scenario plugin](https://www.npmjs.com/package/karma-ng-scenario) you can test DOM interactions against your local server in a real browser. In this particular example, you will test interactions with a trivial page. However, ngScenario, as the name implies, was developed by the AngularJS team to test AngularJS applications, so you can use karma to test single page apps too.

Suppose you want to test [the following page](https://github.com/vkarpov15/karma-demo/blob/master/lib/sample.html), which uses the `sample.js` file from the previous section to display the number &#8220;42&#8221; on the page.

```js
<html>
  <head>
    <script type="text/javascript" src="/sample.js"></script>
    <script type="text/javascript">
      function onLoad() {
        document.getElementById('content').innerHTML = theAnswer();
      }
    </script>
  </head>
  <body onload="onLoad()">
    <div id="content"></div>
  </body>
</html>
```

In order to serve this page and the `sample.js` file, you need an HTTP server. You can put together a simple one using [express](https://www.npmjs.com/package/express) as shown below.

```js
var express = require('express');
var app = express();

app.use(express.static('./lib'));

app.listen(3000);
console.log('Server listening on 3000');
```

Navigate to `http://localhost:3000/sample.html` and you should see the number &#8220;42&#8221;. Now, let&#8217;s set up karma to test this.

In order to use ngScenario with karma, you need to install the karma-ng-scenario plugin.

```js
{
  "dependencies": {
    "express": "4.12.3"
  },
  "devDependencies": {
    "karma": "0.12.31",
    "karma-chrome-launcher": "0.1.4",
    "karma-ng-scenario": "0.1.0"
  }
}
```

Once you have the karma-ng-scenario plugin, you will need to create a [slightly modified karma config file](https://github.com/vkarpov15/karma-demo/blob/f0094a17f7fbf5b6a3941bd6066030dfbd63ab89/test/karma.ng-scenario.conf.js). The `git diff` between this file and the previous section&#8217;s config file `karma.mocha.conf.js` is shown below.

```js
module.exports = function(config) {
   config.set({
     basePath: '',

-    frameworks: ['mocha', 'chai'],
+    frameworks: ['ng-scenario'],

-    files: ['../lib/*.js', './sample.test.js'],
+    files: ['./scenario.test.js'],

     reporters: ['progress'],

     urlRoot : '/__karma__/',

+    proxies : {
+      '/': 'http://localhost:3000'
+    },
+
     port: 8080,
     runnerPort: 9100,
     colors: true,

     logLevel: config.LOG_INFO,

-    autoWatch: false,
+    autoWatch: true,

     browsers: ['Chrome'],

-    singleRun: true,
+    singleRun: false,

-    // 5 sec
-    browserNoActivityTimeout: 5000
+    // 45 sec
+    browserNoActivityTimeout: 45000
   });
 };

```

That&#8217;s all you need! Now, start your web server with `node index.js` (your web server needs to be running for ngScenario to work) and run `./node_modules/karma/bin/karma` start to execute your tests.

```js
$ ./node_modules/karma/bin/karma start test/karma.ng-scenario.conf.js 
WARN [proxy]: proxy "http://localhost:3000" normalized to "http://localhost:3000/"
WARN [karma]: Port 8080 in use
INFO [karma]: Karma v0.12.31 server started at http://localhost:8081/__karma__/
INFO [launcher]: Starting browser Chrome
INFO [Chrome 42.0.2311 (Mac OS X 10.10.3)]: Connected on socket pyFsC9jnnhcbkTXT5y3t with id 7382597
Chrome 42.0.2311 (Mac OS X 10.10.3): Executed 1 of 1 SUCCESS (0 secs / 0.137 secChrome 42.0.2311 (Mac OS X 10.10.3): Executed 1 of 1 SUCCESS (0.152 secs / 0.137 secs)
```

The `karma.ng-scenario.conf.js` file is configured for karma to automatically re-run tests if any of the loaded files change. Suppose you changed the test file `scenario.test.js` to break:

```js
describe('sample.html', function() {
  it('displays 42', function() {
    browser().navigateTo('/sample.html');
    // This assertion will fail
    expect(element('#content').text()).toBe('43');
  });
});
```

Karma will automatically re-run tests and show you the following output.

```js
INFO [watcher]: Changed file "/Users/vkarpov/Workspace/karma-demo/test/scenario.test.js".
Chrome 42.0.2311 (Mac OS X 10.10.3) sample.html displays 42 FAILED
  expect element '#content' text toBe "43"
  /Users/vkarpov/Workspace/karma-demo/test/scenario.test.js:4:32: expected "43" but was "42"
Chrome 42.0.2311 (Mac OS X 10.10.3): Executed 1 of 1 (1 FAILED) (0 secs / 0.121 Chrome 42.0.2311 (Mac OS X 10.10.3): Executed 1 of 1 (1 FAILED) ERROR (0.136 secs / 0.121 secs)
```

Note the AngularJS team considers `ngScenario` to be deprecated in favor of [protractor](https://www.npmjs.com/package/protractor). However, I still think ngScenario and karma have a key niche to fill in terms of testing JavaScript DOM interactions against a local server as part of TDD workflow. If you&#8217;re interested in working with me to re-imagine how ngScenario should work, shoot me an email at val [at] karpov [dot] io.

## **To the Cloud!**

So far, you&#8217;ve only tested your code in Chrome. While testing in Chrome is better than not testing in the browser at all, it&#8217;s far from a complete testing paradigm. Thankfully, there&#8217;s [Sauce Labs](https://saucelabs.com/), a cloud Selenium service that you can think of as Amazon EC2 for browsers. You can tell Sauce to start Internet Explorer 6 running on Windows XP and give you full control over this browser for testing purposes. In order to get the tests in this section to work, you will have to sign up for an account with Sauce Labs to get an API key.

To integrate karma with Sauce, you&#8217;re going to need the karma-sauce-launcher plugin.

```js
{
  "dependencies": {
    "express": "4.12.3"
  },
  "devDependencies": {
    "karma": "0.12.31",
    "karma-chai": "0.1.0",
    "karma-chrome-launcher": "0.1.4",
    "karma-ng-scenario": "0.1.0",
    "karma-mocha": "0.1.10",
    "karma-sauce-launcher": "0.2.8"
  }
}

```

To run the ngScenario test from the previous section on IE9 and Safari 5 using Sauce, create [another karma config file](https://github.com/vkarpov15/karma-demo/blob/master/test/karma.sauce.conf.js). The `git diff` between this new file and the previous section&#8217;s config file is show below.

```js
module.exports = function(config) {
+  var customLaunchers = {
+    sl_safari: {
+      base: 'SauceLabs',
+      browserName: 'safari',
+      platform: 'OS X 10.6',
+      version: '5'
+    },
+    sl_ie_9: {
+      base: 'SauceLabs',
+      browserName: 'internet explorer',
+      platform: 'Windows 7',
+      version: '9'
+    }
+  };
+
   config.set({
     basePath: '',

     frameworks: ['ng-scenario'],

     files: ['./scenario.test.js'],

-    reporters: ['progress'],
+    reporters: ['saucelabs'],

     urlRoot : '/__karma__/',

     proxies : {
       '/': 'http://localhost:3000'
     },

     port: 8080,
     runnerPort: 9100,
     colors: true,

     logLevel: config.LOG_INFO,

-    autoWatch: true,
+    autoWatch: false,
+
+    // Use these custom launchers for starting browsers on Sauce
+    customLaunchers: customLaunchers,

-    browsers: ['Chrome'],
+    // start these browsers
+    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
+    browsers: Object.keys(customLaunchers),

-    singleRun: false,
+    singleRun: true,

     // 45 sec
-    browserNoActivityTimeout: 45000
+    browserNoActivityTimeout: 45000,
+
+    sauceLabs: {
+      testName: 'Web App E2E Tests'
+    },
   });
 };

```

This is all you need to do. Karma handles setting up an SSH tunnel for you, so the Sauce browser can make real requests to your local server.

```js
$ env SAUCE_USERNAME=<username here> env SAUCE_ACCESS_KEY=<API key here> ./node_modules/karma/bin/karma start test/karma.sauce.conf.js 
WARN [proxy]: proxy "http://localhost:3000" normalized to "http://localhost:3000/"
WARN [karma]: Port 8080 in use
INFO [karma]: Karma v0.12.31 server started at http://localhost:8081/__karma__/
INFO [launcher]: Starting browser safari 5 (OS X 10.6) on SauceLabs
INFO [launcher]: Starting browser internet explorer 9 (Windows 7) on SauceLabs
INFO [launcher.sauce]: internet explorer 9 (Windows 7) session at https://saucelabs.com/tests/d6d4c7a5eebe493d9e98bc3559106e54
INFO [launcher.sauce]: safari 5 (OS X 10.6) session at https://saucelabs.com/tests/49dc351d56664ecb92a854b37158c1a8
INFO [IE 9.0.0 (Windows 7)]: Connected on socket vGbX2IuqZHZEP6rj9Ltx with id 56376293
INFO [Safari 5.1.9 (Mac OS X 10.6.8)]: Connected on socket K7Nfu1zw5yhVOozy9Lty with id 49486594
TOTAL: 2 SUCCESS
INFO [launcher.sauce]: Shutting down Sauce Connect

```

Note the above example does not use autowatch. This is because, in my experience, end-to-end tests run on Sauce labs are too slow for the type of fast feedback I&#8217;d like from the &#8216;test on save&#8217; paradigm. These heavy end-to-end tests are best run through a CI framework like [Travis](http://thecodebarbarian.com/2015/02/13/travis_coveralls) or [Shippable](http://thecodebarbarian.com/2015/04/10/shippable-an-alternative-take-on-travis).

## **Conclusion**

Karma is a powerful and extensible tool for testing client-side JS, and very much deserves its spot on the npm home page. If there&#8217;s one npm module I can&#8217;t write JS without, it&#8217;s karma. Karma enables you to test standalone JavaScript or DOM integrations, locally or in the Sauce Labs cloud. With karma, you have no excuse for half-answers like &#8220;I think so&#8221; when your boss asks you if the site works in IE8.

Like this article? Chapter 9 of my upcoming book, [Professional AngularJS](http://www.amazon.com/Professional-AngularJS-Valeri-Karpov/dp/1118832078/), is a detailed guide to testing AngularJS applications. It includes more detail about using karma and ngScenario to test AngularJS applications, as well as protractor.