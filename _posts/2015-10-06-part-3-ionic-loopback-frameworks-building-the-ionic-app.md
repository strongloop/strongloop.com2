---
id: 26166
title: 'Part 3: Ionic &#038; LoopBack Frameworks &#8211; Building the Ionic App'
date: 2015-10-06T07:49:37+00:00
author: Valeri Karpov
guid: https://strongloop.com/?p=26166
permalink: /strongblog/part-3-ionic-loopback-frameworks-building-the-ionic-app/
categories:
  - How-To
  - LoopBack
  - Mobile
---
<span style="font-weight: 400;">In the first two articles in this series, you built a </span>[<span style="font-weight: 400;">REST API using StrongLoop LoopBack</span>](https://strongloop.com/strongblog/part-1-ionic-loopback-node-js-mobile/) <span style="font-weight: 400;">and several </span>[<span style="font-weight: 400;">AngularJS directives that use your API via the LoopBack AngularJS SDK</span>](https://strongloop.com/strongblog/part-2-ionic-loopback-frameworks-directives-with-the-angularjs-loopback-sdk/)<span style="font-weight: 400;">. With these two components, you&#8217;ve done most of the work of building a hybrid mobile app using the </span>[<span style="font-weight: 400;">Ionic framework</span>](http://ionicframework.com/)<span style="font-weight: 400;">. The Ionic framework is based on AngularJS, and, thanks to AngularJS&#8217; flexibility, you&#8217;ll be able to use the </span>\`timer\` <span style="font-weight: 400;"> and </span>\`timeList\` <span style="font-weight: 400;">directives in your mobile app without any changes.</span>

<span style="font-weight: 400;">Your Ionic mobile app will live in a </span>[<span style="font-weight: 400;">separate GitHub repo</span>](https://github.com/vkarpov15/stopwatch-example)<span style="font-weight: 400;">. Keeping your Ionic mobile app in the same repo as your API server is possible, but cumbersome. Using a separate repo, though, makes it necessary for you to package your directives in a way that makes them easy to install using </span>[<span style="font-weight: 400;">bower</span>](http://bower.io/)<span style="font-weight: 400;">. The first step in this article will be to compile your directive HTML into JavaScript, so you can include your directives and their corresponding HTML with a couple script tags.</span>

<!--more-->

## **Packaging Your Directives For Ionic**

_<span style="font-weight: 400;">TLDR; </span>_[_<span style="font-weight: 400;">See a diff for this step on GitHub</span>_](https://github.com/vkarpov15/stopwatch-server-example/commit/b7d742127308b8d550a1a58279466af40a6a4523)

<span style="font-weight: 400;">Recall that your directives from </span>[<span style="font-weight: 400;">the second article in this series</span>](https://strongloop.com/strongblog/part-2-ionic-loopback-frameworks-directives-with-the-angularjs-loopback-sdk/) <span style="font-weight: 400;">use AngularJS&#8217; `</span><span style="font-weight: 400;">templateUrl`</span> <span style="font-weight: 400;">property to load their HTML from the server. For instance,</span>

```js
directive('timer', function() {
  return {
    templateUrl: 'templates/timer.html'
    // ...
  };
});
```

<span style="font-weight: 400;">Loading templates from the server makes sense for desktop browser apps, but it&#8217;s a terrible choice for mobile. Luckily, our mobile app will be packaged up so the HTML file will be served locally. That said, it still has to do an Ajax call and read the file from device storage. In order to avoid making an HTTP request for a template, AngularJS developers usually leverage the </span>[<span style="font-weight: 400;">template cache</span>](https://docs.angularjs.org/api/ng/service/$templateCache)<span style="font-weight: 400;">. If you want to learn about the template cache in more detail, check out </span>[<span style="font-weight: 400;">Chapter 6 of </span>_<span style="font-weight: 400;">Professional AngularJS</span>_](http://www.amazon.com/Professional-AngularJS-Valeri-Karpov/dp/1118832078/)<span style="font-weight: 400;">. For the purposes of this article series, you only need to know that AngularJS won&#8217;t make an HTTP request for the template if you pre-populate the template cache. That is, if you set a value for `</span><span style="font-weight: 400;">templates/timer.html`</span> <span style="font-weight: 400;">in the cache as shown below, AngularJS will use the cached value.</span>

```js
$templateCache.put('templates/timer.html', '

<h1>
  This is my template!
</h1>');
```

<span style="font-weight: 400;">However, you wrote your directive templates in HTML. How are you going to translate them into JavaScript? As is usually the case with JavaScript, there&#8217;s an npm module for that: </span>[<span style="font-weight: 400;">gulp-html2js</span>](https://www.npmjs.com/package/gulp-html2js)<span style="font-weight: 400;">. This module takes a bunch of HTML files and generates a JavaScript file that calls `</span><span style="font-weight: 400;">$templateCache.put()`</span> <span style="font-weight: 400;">for each of the HTML files. To use this module, first you need to add gulp and a couple plugins to your `</span><span style="font-weight: 400;">package.json`</span><span style="font-weight: 400;">:</span>

```js
"devDependencies": {
  "jshint": "^2.5.6",
  "gulp": "3.8.11",
  "gulp-concat": "2.6.0",
  "gulp-html2js": "0.2.0"
}
```

<span style="font-weight: 400;">Next, you&#8217;re going to write a `</span><span style="font-weight: 400;">gulpfile`</span> <span style="font-weight: 400;">that defines a &#8216;compile&#8217; task. This task is going to write 2 files, `</span><span style="font-weight: 400;">dist/all.js`</span> <span style="font-weight: 400;">and `</span><span style="font-weight: 400;">dist/templates.js`</span><span style="font-weight: 400;">. The `</span><span style="font-weight: 400;">dist/all.js`</span> <span style="font-weight: 400;">file contains all your JavaScript files concatenated into one. The `</span><span style="font-weight: 400;">dist/templates.js`</span> <span style="font-weight: 400;">file contains all your HTML files piped through gulp-html2js. By their powers combined, including these two files and adding a dependency on the &#8216;core&#8217; and &#8216;templates&#8217; modules is sufficient to use the directives you wrote in the second article in this series. Below is the code for the &#8216;html2js&#8217; task. You can find the </span>[<span style="font-weight: 400;">full gulpfile on GitHub</span>](https://github.com/vkarpov15/stopwatch-server-example/commit/b7d742127308b8d550a1a58279466af40a6a4523#diff-0)

```js
gulp.task('html2js', function() {
  gulp.src('./client/templates/*').
    pipe(html2js({
      // Note this replace option. By default, gulp-html2js
      // will do `$templateCache.put('client/templates/timer.html')`
      // This rename option lets you transform the first argument to `put()`.
      rename: function(name) {
        return name.replace(/^client\//, '');
      },
      outputModuleName: 'templates'
   })).
   pipe(concat('templates.js')).
   pipe(gulp.dest('./client/dist'));
});
```

## **Introducing Ionic**

_<span style="font-weight: 400;">TLDR; </span>_[_<span style="font-weight: 400;">See a diff for this step on GitHub</span>_](https://github.com/vkarpov15/stopwatch-example/commit/092f5e8ee398e8b1674c7d49ebae1362f1397284)

[<span style="font-weight: 400;">Getting started with Ionic</span>](http://ionicframework.com/getting-started/) <span style="font-weight: 400;">is pretty easy. First, you need to `</span><span style="font-weight: 400;">npm install -g cordova ionic`</span><span style="font-weight: 400;">. Once you&#8217;ve installed Ionic, you should be able to create a new Ionic app in the current directory using Ionic&#8217;s handy CLI. For instance, you can create a new app called &#8216;stopwatch-example&#8217; using the &#8216;tabs&#8217; app template using `</span><span style="font-weight: 400;">ionic start stopwatch-example tabs`</span><span style="font-weight: 400;">. You can also just do `</span><span style="font-weight: 400;">git checkout step-2`</span> <span style="font-weight: 400;">in the &#8216;stopwatch-example&#8217; GitHub repo to get the starter app.</span>

<span style="font-weight: 400;">Once you have the starter app, run `</span><span style="font-weight: 400;">ionic serve &#8211;lab`</span><span style="font-weight: 400;">. This will start Ionic&#8217;s powerful CLI and launch a browser that has a side-by-side view of how your app will look on iOS and on Android. The CLI should look like the below picture.</span>

[<img class="aligncenter wp-image-26168 size-full" src="{{site.url}}/blog-assets/2015/10/image04.png" alt="image04" width="573" height="370"  />]({{site.url}}/blog-assets/2015/10/image04.png)

<span style="font-weight: 400;">The browser should look like the below picture.</span>

[<img class="aligncenter size-full wp-image-26169" src="{{site.url}}/blog-assets/2015/10/image05.png" alt="image05" width="868" height="846"  />]({{site.url}}/blog-assets/2015/10/image05.png)

## **Including Your Directives in Ionic**

_<span style="font-weight: 400;">TLDR; </span>_[_<span style="font-weight: 400;">See a diff for this step on GitHub</span>_](https://github.com/vkarpov15/stopwatch-example/commit/9bfec6bc4bb5237ca9d5c4704041c641706c64b2)

<span style="font-weight: 400;">In this step, you&#8217;ll take the Ionic tabs starter app and make it display the `</span><span style="font-weight: 400;">timer`</span> <span style="font-weight: 400;">directive. This will give you a functioning stopwatch app, minus the ability to make HTTP requests to the server.</span>

<span style="font-weight: 400;">An easy way to include your directives and templates in your Ionic app is to use the </span>[<span style="font-weight: 400;">bower package manager</span>](http://bower.io/)<span style="font-weight: 400;">. Ionic already uses Bower, so you don&#8217;t need to install anything extra. Just add a bower dependency on your GitHub repo:</span>

```js
"dependencies": {
  "angular-resource": "1.4.3",
  "moment": "2.10.6",
  "directives": "https://raw.githubusercontent.com/vkarpov15/stopwatch-server-example/master/client/dist/all.js",
  "templates": "https://raw.githubusercontent.com/vkarpov15/stopwatch-server-example/master/client/dist/templates.js"
}
```

<span style="font-weight: 400;">Once you run `</span><span style="font-weight: 400;">bower install`</span><span style="font-weight: 400;">, bower will install ngResource and momentJS alongside your directives and templates. You can set the install path in your `</span><span style="font-weight: 400;">.bowerrc`</span> <span style="font-weight: 400;">file, so bower installs into a directory your Ionic app can access.</span>

```js
{
  "directory": "./www/js"
}
```

<span style="font-weight: 400;">The `</span><span style="font-weight: 400;">www`</span> <span style="font-weight: 400;">directory is the root directory for your Ionic app. You might have noticed that it has an `</span><span style="font-weight: 400;">index.html` </span><span style="font-weight: 400;">file &#8211; this is the root HTML file for your Ionic app. Now that you&#8217;ve installed your dependencies, add the below `</span><span style="font-weight: 400;">script`</span> <span style="font-weight: 400;">tags to `</span><span style="font-weight: 400;">index.html`</span> <span style="font-weight: 400;">to include `ngResource`, moment, and your stopwatch directives.</span>

```js
<script src="js/angular-resource/angular-resource.js"></script>
<script src="js/moment/moment.js"></script>
<script src="js/directives/index.js"></script>
<script src="js/templates/index.js"></script>
```

<span style="font-weight: 400;">Your Ionic app also has a main AngularJS module, defined in `</span><span style="font-weight: 400;">www/js/app.js`</span><span style="font-weight: 400;">. Add the &#8216;core&#8217; (from `</span><span style="font-weight: 400;">directives/index.js`</span><span style="font-weight: 400;">) and &#8216;templates&#8217; (from `</span><span style="font-weight: 400;">templates/index.js`</span><span style="font-weight: 400;">) modules to the </span><span style="font-weight: 400;">starter </span><span style="font-weight: 400;">module&#8217;s list of dependencies.</span>

```js
angular.module('starter',
  ['ionic', 'starter.controllers', 'starter.services', 'core', 'templates'])
```

<span style="font-weight: 400;">Now that you&#8217;ve properly included your AngularJS modules, you should be able to </span>[<span style="font-weight: 400;">include the `</span><span style="font-weight: 400;">timer` </span><span style="font-weight: 400;">directive in your app&#8217;s dashboard tab as shown in this GitHub diff</span>](https://github.com/vkarpov15/stopwatch-example/commit/9bfec6bc4bb5237ca9d5c4704041c641706c64b2#diff-5)<span style="font-weight: 400;">. You should then see your timer directive in your `</span><span style="font-weight: 400;">ionic serve &#8211;lab`</span> <span style="font-weight: 400;">window as shown below.</span>

[<img class="aligncenter size-full wp-image-26171" src="{{site.url}}/blog-assets/2015/10/image02.png" alt="image02" width="828" height="851"  />]({{site.url}}/blog-assets/2015/10/image02.png)

## **Tying It All Together**

_<span style="font-weight: 400;">TLDR; </span>_[_<span style="font-weight: 400;">See a diff for this step on GitHub</span>_](https://github.com/vkarpov15/stopwatch-example/commit/221f280761d3f61a5dc1d15e92731c5507632d29)

<span style="font-weight: 400;">You may have noticed that your timer directive from the previous example can&#8217;t actually save your times. There&#8217;s two reasons why you can&#8217;t save:</span>

<li style="font-weight: 400;">
  <span style="font-weight: 400;">The directive saves by making an HTTP request to `</span><span style="font-weight: 400;">/api/Times`</span><span style="font-weight: 400;"> rather than `</span><span style="font-weight: 400;">http://localhost:3000/api/Times`</span><span style="font-weight: 400;">, which is where your REST API is.</span>
</li>
<li style="font-weight: 400;">
  <span style="font-weight: 400;">You haven&#8217;t logged in with Facebook, and so you aren&#8217;t authorized.</span>
</li>

<span style="font-weight: 400;">Thankfully, fixing these two problems is simple. The first problem can be solved with an </span>[<span style="font-weight: 400;">AngularJS HTTP interceptor</span>](http://thecodebarbarian.com/2015/01/24/angularjs-interceptors)<span style="font-weight: 400;">. Interceptors enable you to transform </span>**every** <span style="font-weight: 400;">HTTP request your application makes. In particular, the below request interceptor converts every request to `</span><span style="font-weight: 400;">/api/Times`</span> <span style="font-weight: 400;">into a cross-origin request to `</span><span style="font-weight: 400;">http://localhost:3000/api/Times`</span><span style="font-weight: 400;">.</span>

```js
.config(function($httpProvider) {
  $httpProvider.interceptors.push(function() {
    return {
      request: function(req) {
        // Transform **all** $http calls so that requests that go to `/`
        // instead go to a different origin, in this case localhost:3000
        if (req.url.charAt(0) === '/') {
          req.url = 'http://localhost:3000' + req.url;
          // and make sure to send cookies too
          req.withCredentials = true;
        }
 
        return req;
      }
    };
  });
})
```

<span style="font-weight: 400;">The above interceptor also does one more important task. Notice the `</span>[<span style="font-weight: 400;">with Credentials`</span> <span style="font-weight: 400;">property</span>](https://docs.angularjs.org/api/ng/service/$http#usage)<span style="font-weight: 400;">? That tells AngularJS to send cookies on cross-origin requests. Because of browser security restrictions, AngularJS doesn&#8217;t send cookies on cross-origin requests by default.</span>

<span style="font-weight: 400;">The second problem can be solved with a </span>[<span style="font-weight: 400;">Cordova plugin called inappbrowser</span>](https://cordova.apache.org/docs/en/3.0.0/cordova_inappbrowser_inappbrowser.md.html)<span style="font-weight: 400;">. You won&#8217;t need this plugin in your `</span><span style="font-weight: 400;">ionic serve &#8211;lab`</span> <span style="font-weight: 400;">workflow, but Cordova by itself doesn&#8217;t have good support for popup windows. Adding this plugin requires </span>[<span style="font-weight: 400;">adding a line to your `</span><span style="font-weight: 400;">package.json</span>](https://github.com/vkarpov15/stopwatch-example/commit/221f280761d3f61a5dc1d15e92731c5507632d29#diff-0)\`<span style="font-weight: 400;">.</span>

<span style="font-weight: 400;">Now that you have the &#8216;inappbrowser&#8217; plugin, you get to deal with the most unpleasant part of working with Ionic: browser security restrictions in `</span><span style="font-weight: 400;">ionic serve &#8211;lab`</span><span style="font-weight: 400;">. Opening up an inappbrowser is as simple as calling </span>[<span style="font-weight: 400;">the `</span><span style="font-weight: 400;">window.open()`</span> <span style="font-weight: 400;">function in JavaScript</span>](https://developer.mozilla.org/en-US/docs/Web/API/Window/open)<span style="font-weight: 400;">. The cordova plugin even has </span>[<span style="font-weight: 400;">some handy events for tracking the state of the new window</span>](https://cordova.apache.org/docs/en/3.0.0/cordova_inappbrowser_inappbrowser.md.html#addEventListener)<span style="font-weight: 400;">.</span>

<span style="font-weight: 400;">However, `</span><span style="font-weight: 400;">window.open()`</span> <span style="font-weight: 400;">in regular browsers has numerous cumbersome security restrictions. Thankfully, this only affects the login flow in `</span><span style="font-weight: 400;">ionic serve &#8211;lab`</span><span style="font-weight: 400;">, so you can wait for the user to close the popup window before reloading. In a real app, you can register a listener to the &#8216;loadstop&#8217; event that the inappbrowser plugin broadcasts when the window&#8217;s URL changes. You can take a look at the `</span>[<span style="font-weight: 400;">$facebookLogin`</span> <span style="font-weight: 400;">service that encapsulates this logic here</span>](https://github.com/vkarpov15/stopwatch-example/blob/221f280761d3f61a5dc1d15e92731c5507632d29/www/js/services.js)<span style="font-weight: 400;">.</span>

<span style="font-weight: 400;">Once you&#8217;ve configured the HTTP interceptor and added Facebook login, your `</span><span style="font-weight: 400;">timer`</span> <span style="font-weight: 400;">and `</span><span style="font-weight: 400;">timeList` </span><span style="font-weight: 400;">directives should work as written. You can start your timer, save it, and then see your timer results in the &#8216;account&#8217; tab.</span>

[<img class="aligncenter size-full wp-image-26172" src="{{site.url}}/blog-assets/2015/10/image03.png" alt="image03" width="393" height="725"  />]({{site.url}}/blog-assets/2015/10/image03.png)

[<img class="aligncenter size-full wp-image-26173" src="{{site.url}}/blog-assets/2015/10/image01.png" alt="image01" width="390" height="719"  />]({{site.url}}/blog-assets/2015/10/image01.png)

[<img class="aligncenter size-full wp-image-26174" src="{{site.url}}/blog-assets/2015/10/image00.png" alt="image00" width="404" height="712"  />]({{site.url}}/blog-assets/2015/10/image00.png)

## **Moving On**

<span style="font-weight: 400;">Congratulations! You just took your AngularJS directives and packaged them into an Ionic framework app by adding a build step and making a couple configuration changes. With `</span><span style="font-weight: 400;">ionic serve &#8211;lab`</span><span style="font-weight: 400;">, you can work further on your mobile app without any bloated IDEs or SDKs. Note that you&#8217;ll still need the proper Android/iOS SDK to </span>[<span style="font-weight: 400;">compile your app for the app store using `</span><span style="font-weight: 400;">ionic build</span>](http://ionicframework.com/getting-started/)\`<span style="font-weight: 400;">. In the next article in this series, you&#8217;ll learn about another key advantage of hybrid mobile apps with Ionic: leveraging AngularJS&#8217; powerful testing modules to write integration tests for your app.</span>