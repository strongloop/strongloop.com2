---
id: 23898
title: Getting Started with the Saucie CLI to Make Cross Browser Testing Easier
date: 2015-03-12T08:00:00+00:00
author: Igor Ribeiro Lima
guid: https://strongloop.com/?p=23898
permalink: /strongblog/getting-started-with-the-saucie-cli-to-make-cross-browser-testing-easier/
categories:
  - Community
  - How-To
---
_Editor: Check out this guest blog post by [Igor Ribeiro Lima](https://twitter.com/igorribeirolima) on how use the commandline to perform cross browser testing._

We all know that testing your JavaScript code is a good thing, but one of the hurdles to overcome is how to test the code on different browsers. With this challenge in mind I developed a CLI tool named <a href="https://www.npmjs.com/package/saucie" rel="noreferrer">saucie</a>. This CLI is a library hosted on <a href="https://www.npmjs.com/" rel="noreferrer">NPM</a> which allows you to integrate your frontend JavaScript tests with <a href="https://saucelabs.com/" rel="noreferrer">SauceLabs</a> platform. SauceLabs already has awesome cross browser testing, and saucie makes it easier to do that cross browser testing via a CLI.

<!--more-->

A great <a href="http://tobyho.com/2012/06/24/testem-interactive-js-test-runner/" rel="noreferrer">interactive JavaScript test runner</a>, the <a href="https://github.com/airportyh/testem" rel="noreferrer">testem</a> library, uses saucie on its <a href="https://github.com/airportyh/testem/tree/master/examples/saucelabs" rel="noreferrer">examples</a> and has the following <a href="http://jasmine.github.io/" rel="noreferrer">jasmine</a> sample tests:

## **hello.js**

<div class="highlight highlight-js">
  ```js
function hello(name){
    return “hello “ + (name || ‘world’);
}
```js
</div>

## **hello_spec.js**

<div class="highlight highlight-js">
  ```js
describe(‘hello’, <span class="pl-st">function</span>(){
    it(‘should say hello’, <span class="pl-st">function</span>(){
        expect(hello()).toBe(‘hello world’);
    });
    it(‘should say hello to person’, <span class="pl-st">function</span>(){
        expect(hello(‘Bob’)).toBe(‘hello Bob’);
    });
});
```js
</div>

To run these tests cross platform, you only need to execute a few commands, as described below:

**1.** First, <a href="https://saucelabs.com/signup/trial" rel="noreferrer">create your SauceLabs account</a>

**2.** Make sure Sauce credentials are set as <a href="http://en.wikipedia.org/wiki/Environment_variable" rel="noreferrer">environment variables</a>:

\`SAUCE_USERNAME\` &#8211; your SauceLabs username

\`SAUCE\_ACCESS\_KEY\` &#8211; your SauceLabs API/Access key

**3.** Now, follow the script below:

```js
npm install -g testem saucie
git clone git@github.com:airportyh/testem.git
cd testem/
git checkout tags/v0.7.1
cd examples/saucelabs/
```

Keep that first terminal open, then open a second terminal and use the script below:

```js
cd testem/examples/saucelabs/
testem --port 8080
```

Go back to the first terminal and type:

```js
saucie --browserNameSL="internet explorer" --versionSL="7.0" --platformSL="Windows XP"

saucie --browserNameSL="iphone" --versionSL="8.1" --platformSL="OS X 10.10" --deviceNameSL="iPad Simulator" --deviceOrientationSL="portrait"

saucie --browserNameSL="android" --versionSL="4.1" --platformSL="Linux" --deviceNameSL="Motorola Atrix HD Emulator" --deviceOrientationSL="portrait"
```

## **Some notes&#8230;**

  * <span style="font-size: 18px;">All platforms are listed <a href="https://saucelabs.com/platforms/" rel="noreferrer">here</a>. Want to know what the values for the `browserNameSL`, `versionSL` and `platformSL` params are? Check them <a href="https://docs.saucelabs.com/reference/platforms-configurator/#/" rel="noreferrer">here</a>.</span>
  * <span style="font-size: 18px;">If you’d like to use the default configuration, just type <code>testem ci --port 8080</code></span>
  * <span style="font-size: 18px;">type <code>saucie --help</code> to get a help.</span>
  * <span style="font-size: 18px;">`testem.yml` is a <a href="https://github.com/airportyh/testem#configuration-file" rel="noreferrer">configuration file</a> where specifies which JavaScript framework to use. In this case, we are using JasmineJS.</span>

## **Watch a demo**

Click on the screenshot below to watch a command line demo of Saucie in action!

[<img class="aligncenter size-full wp-image-23904" src="https://strongloop.com/wp-content/uploads/2015/03/Screen-Shot-2015-03-11-at-2.35.08-PM.png" alt="Screen Shot 2015-03-11 at 2.35.08 PM" width="748" height="639" srcset="https://strongloop.com/wp-content/uploads/2015/03/Screen-Shot-2015-03-11-at-2.35.08-PM.png 748w, https://strongloop.com/wp-content/uploads/2015/03/Screen-Shot-2015-03-11-at-2.35.08-PM-300x256.png 300w, https://strongloop.com/wp-content/uploads/2015/03/Screen-Shot-2015-03-11-at-2.35.08-PM-705x602.png 705w, https://strongloop.com/wp-content/uploads/2015/03/Screen-Shot-2015-03-11-at-2.35.08-PM-450x384.png 450w" sizes="(max-width: 748px) 100vw, 748px" />](http://showterm.io/bd7400428650f13e43eb6)

As you can see, with just a few commands we were able to test across cross browsers. Now, let’s go to SauceLabs and check the results, including the mobile ones such as iOS and Android:

<ul class="task-list">
  <li>
    <span style="font-size: 18px;"><a href="https://saucelabs.com/tests/06b62f4bba48469999d7212cf1b62818" rel="noreferrer">iOS test</a></span>
  </li>
  <li>
    <span style="font-size: 18px;"><a href="https://saucelabs.com/tests/945ebbe3b6044963a017cef5949d1cf6" rel="noreferrer">IE7 test</a></span>
  </li>
  <li>
    <span style="font-size: 18px;"><a href="https://saucelabs.com/jobs/11bd49cee6cf49d2a76d5b655f6ccb0f" rel="noreferrer">Android test</a></span>
  </li>
</ul>

Saucie will soon integrate other platforms like <a href="http://www.browserstack.com/" rel="noreferrer">BrowserStack</a>. The project also recently <a href="https://github.com/igorlima/sauce-js-tests-integration/pull/4" rel="noreferrer">got various improvements</a> from <a href="https://github.com/johanneswuerbach" rel="noreferrer">johanneswuerbach</a>. He made several changes <a href="https://github.com/johanneswuerbach/ember-cli-sauce/commit/27036f2c97454abb5a2065fb5a754e7c972ddad4" rel="noreferrer">to use Saucie</a> in <a href="https://github.com/johanneswuerbach/ember-cli-sauce" rel="noreferrer">ember-cli-sauce</a>, which is now used by <a href="https://github.com/tildeio/htmlbars" rel="noreferrer">htmlbars</a>, the rendering engine used by <a href="https://github.com/emberjs/ember.js" rel="noreferrer">emberjs</a>.

Feel free to file issue and send pull requests and let’s become Saucie even better. Thanks!