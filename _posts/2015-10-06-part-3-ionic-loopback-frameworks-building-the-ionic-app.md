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
In the first two articles in this series, you built a [REST API using StrongLoop LoopBack](https://strongloop.com/strongblog/part-1-ionic-loopback-node-js-mobile/) and several [AngularJS directives that use your API via the LoopBack AngularJS SDK](https://strongloop.com/strongblog/part-2-ionic-loopback-frameworks-directives-with-the-angularjs-loopback-sdk/). With these two components, you&#8217;ve done most of the work of building a hybrid mobile app using the [Ionic framework](http://ionicframework.com/). The Ionic framework is based on AngularJS, and, thanks to AngularJS&#8217; flexibility, you&#8217;ll be able to use the \`timer\`  and \`timeList\` directives in your mobile app without any changes.

Your Ionic mobile app will live in a [separate GitHub repo](https://github.com/vkarpov15/stopwatch-example). Keeping your Ionic mobile app in the same repo as your API server is possible, but cumbersome. Using a separate repo, though, makes it necessary for you to package your directives in a way that makes them easy to install using [bower](http://bower.io/). The first step in this article will be to compile your directive HTML into JavaScript, so you can include your directives and their corresponding HTML with a couple script tags.

<!--more-->

## **Packaging Your Directives For Ionic**

_TLDR; _[_See a diff for this step on GitHub_](https://github.com/vkarpov15/stopwatch-server-example/commit/b7d742127308b8d550a1a58279466af40a6a4523)

Recall that your directives from [the second article in this series](https://strongloop.com/strongblog/part-2-ionic-loopback-frameworks-directives-with-the-angularjs-loopback-sdk/) use AngularJS&#8217; templateUrl property to load their HTML from the server. For instance,

```js
directive('timer', function() {
  return {
    templateUrl: 'templates/timer.html'
    // ...
  };
});
```

Loading templates from the server makes sense for desktop browser apps, but it&#8217;s a terrible choice for mobile. Luckily, our mobile app will be packaged up so the HTML file will be served locally. That said, it still has to do an Ajax call and read the file from device storage. In order to avoid making an HTTP request for a template, AngularJS developers usually leverage the [template cache](https://docs.angularjs.org/api/ng/service/$templateCache). If you want to learn about the template cache in more detail, check out [Chapter 6 of _Professional AngularJS_](http://www.amazon.com/Professional-AngularJS-Valeri-Karpov/dp/1118832078/). For the purposes of this article series, you only need to know that AngularJS won&#8217;t make an HTTP request for the template if you pre-populate the template cache. That is, if you set a value for `templates/timer.html` in the cache as shown below, AngularJS will use the cached value.

```js
$templateCache.put('templates/timer.html', '
<h1>
  This is my template!
</h1>');
```

However, you wrote your directive templates in HTML. How are you going to translate them into JavaScript? As is usually the case with JavaScript, there&#8217;s an npm module for that: [gulp-html2js](https://www.npmjs.com/package/gulp-html2js). This module takes a bunch of HTML files and generates a JavaScript file that calls `$templateCache.put()` for each of the HTML files. To use this module, first you need to add gulp and a couple plugins to your `package.json`:

```js
"devDependencies": {
  "jshint": "^2.5.6",
  "gulp": "3.8.11",
  "gulp-concat": "2.6.0",
  "gulp-html2js": "0.2.0"
}
```

Next, you&#8217;re going to write a `gulpfile` that defines a &#8216;compile&#8217; task. This task is going to write 2 files, `dist/all.js` and `dist/templates.js` . The `dist/all.js` file contains all your JavaScript files concatenated into one. The `dist/templates.js`file contains all your HTML files piped through gulp-html2js. By their powers combined, including these two files and adding a dependency on the &#8216;core&#8217; and &#8216;templates&#8217; modules is sufficient to use the directives you wrote in the second article in this series. Below is the code for the &#8216;html2js&#8217; task. You can find the [full gulpfile on GitHub](https://github.com/vkarpov15/stopwatch-server-example/commit/b7d742127308b8d550a1a58279466af40a6a4523#diff-0)

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

_TLDR; _[_See a diff for this step on GitHub_](https://github.com/vkarpov15/stopwatch-example/commit/092f5e8ee398e8b1674c7d49ebae1362f1397284)

[Getting started with Ionic](http://ionicframework.com/getting-started/) is pretty easy. First, you need to `npm install -g cordova ionic`. Once you&#8217;ve installed Ionic, you should be able to create a new Ionic app in the current directory using Ionic&#8217;s handy CLI. For instance, you can create a new app called &#8216;stopwatch-example&#8217; using the &#8216;tabs&#8217; app template using `ionic start stopwatch-example tabs`. You can also just do `git checkout step-2` in the &#8216;stopwatch-example&#8217; GitHub repo to get the starter app.

Once you have the starter app, run `ionic serve --lab`. This will start Ionic&#8217;s powerful CLI and launch a browser that has a side-by-side view of how your app will look on iOS and on Android. The CLI should look like the below picture.

[<img class="aligncenter wp-image-26168 size-full" src="{{site.url}}/blog-assets/2015/10/image04.png" alt="image04" width="573" height="370"  />]({{site.url}}/blog-assets/2015/10/image04.png)

The browser should look like the below picture.

[<img class="aligncenter size-full wp-image-26169" src="{{site.url}}/blog-assets/2015/10/image05.png" alt="image05" width="868" height="846"  />]({{site.url}}/blog-assets/2015/10/image05.png)

## **Including Your Directives in Ionic**

_TLDR; _[_See a diff for this step on GitHub_](https://github.com/vkarpov15/stopwatch-example/commit/9bfec6bc4bb5237ca9d5c4704041c641706c64b2)

In this step, you&#8217;ll take the Ionic tabs starter app and make it display the `timer` directive. This will give you a functioning stopwatch app, minus the ability to make HTTP requests to the server.

An easy way to include your directives and templates in your Ionic app is to use the [bower package manager](http://bower.io/). Ionic already uses Bower, so you don&#8217;t need to install anything extra. Just add a bower dependency on your GitHub repo:

```js
"dependencies": {
  "angular-resource": "1.4.3",
  "moment": "2.10.6",
  "directives": "https://raw.githubusercontent.com/vkarpov15/stopwatch-server-example/master/client/dist/all.js",
  "templates": "https://raw.githubusercontent.com/vkarpov15/stopwatch-server-example/master/client/dist/templates.js"
}
```

Once you run `bower install`, bower will install ngResource and momentJS alongside your directives and templates. You can set the install path in your `.bowerrc` file, so bower installs into a directory your Ionic app can access.

```js
{
  "directory": "./www/js"
}
```

The `www` directory is the root directory for your Ionic app. You might have noticed that it has an `index.html` file &#8211; this is the root HTML file for your Ionic app. Now that you&#8217;ve installed your dependencies, add the below `script` tags to `index.html` to include `ngResource`, moment, and your stopwatch directives.

```js
<script src="js/angular-resource/angular-resource.js"></script>
<script src="js/moment/moment.js"></script>
<script src="js/directives/index.js"></script>
<script src="js/templates/index.js"></script>
```

Your Ionic app also has a main AngularJS module, defined in `www/js/app.js`. Add the &#8216;core&#8217; (from `directives/index.js`) and &#8216;templates&#8217; (from `templates/index.js`) modules to the starter module&#8217;s list of dependencies.

```js
angular.module('starter',
  ['ionic', 'starter.controllers', 'starter.services', 'core', 'templates'])
```

Now that you&#8217;ve properly included your AngularJS modules, you should be able to [include the `timer` directive in your app&#8217;s dashboard tab as shown in this GitHub diff](https://github.com/vkarpov15/stopwatch-example/commit/9bfec6bc4bb5237ca9d5c4704041c641706c64b2#diff-5). You should then see your timer directive in your `ionic serve --lab` window as shown below.

[<img class="aligncenter size-full wp-image-26171" src="{{site.url}}/blog-assets/2015/10/image02.png" alt="image02" width="828" height="851"  />]({{site.url}}/blog-assets/2015/10/image02.png)

## **Tying It All Together**

_TLDR; _[_See a diff for this step on GitHub_](https://github.com/vkarpov15/stopwatch-example/commit/221f280761d3f61a5dc1d15e92731c5507632d29)

You may have noticed that your timer directive from the previous example can&#8217;t actually save your times. There&#8217;s two reasons why you can&#8217;t save:

<li >
  The directive saves by making an HTTP request to `/api/Times` rather than `http://localhost:3000/api/Times`, which is where your REST API is.
</li>
<li >
  You haven&#8217;t logged in with Facebook, and so you aren&#8217;t authorized.
</li>

Thankfully, fixing these two problems is simple. The first problem can be solved with an [AngularJS HTTP interceptor](http://thecodebarbarian.com/2015/01/24/angularjs-interceptors). Interceptors enable you to transform **every** HTTP request your application makes. In particular, the below request interceptor converts every request to `/api/Times` into a cross-origin request to `http://localhost:3000/api/Times`.

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

The above interceptor also does one more important task. Notice the `[with Credentials` property](https://docs.angularjs.org/api/ng/service/$http#usage)? That tells AngularJS to send cookies on cross-origin requests. Because of browser security restrictions, AngularJS doesn&#8217;t send cookies on cross-origin requests by default.

The second problem can be solved with a [Cordova plugin called inappbrowser](https://cordova.apache.org/docs/en/3.0.0/cordova_inappbrowser_inappbrowser.md.html). You won&#8217;t need this plugin in your `ionic serve --lab` workflow, but Cordova by itself doesn&#8217;t have good support for popup windows. Adding this plugin requires [adding a line to your package.json](https://github.com/vkarpov15/stopwatch-example/commit/221f280761d3f61a5dc1d15e92731c5507632d29#diff-0) .

Now that you have the &#8216;inappbrowser&#8217; plugin, you get to deal with the most unpleasant part of working with Ionic: browser security restrictions in `ionic serve --lab`. Opening up an inappbrowser is as simple as calling the `window.open()` [function in JavaScript](https://developer.mozilla.org/en-US/docs/Web/API/Window/open). The cordova plugin even has [some handy events for tracking the state of the new window](https://cordova.apache.org/docs/en/3.0.0/cordova_inappbrowser_inappbrowser.md.html#addEventListener).

However, `window.open()` in regular browsers has numerous cumbersome security restrictions. Thankfully, this only affects the login flow in `ionic serve --lab`, so you can wait for the user to close the popup window before reloading. In a real app, you can register a listener to the &#8216;loadstop&#8217; event that the inappbrowser plugin broadcasts when the window&#8217;s URL changes. You can take a look at the [ `$facebookLogin` service that encapsulates this logic here](https://github.com/vkarpov15/stopwatch-example/blob/221f280761d3f61a5dc1d15e92731c5507632d29/www/js/services.js).

Once you&#8217;ve configured the HTTP interceptor and added Facebook login, your `timer` and `timeList` directives should work as written. You can start your timer, save it, and then see your timer results in the &#8216;account&#8217; tab.

[<img class="aligncenter size-full wp-image-26172" src="{{site.url}}/blog-assets/2015/10/image03.png" alt="image03" width="393" height="725"  />]({{site.url}}/blog-assets/2015/10/image03.png)

[<img class="aligncenter size-full wp-image-26173" src="{{site.url}}/blog-assets/2015/10/image01.png" alt="image01" width="390" height="719"  />]({{site.url}}/blog-assets/2015/10/image01.png)

[<img class="aligncenter size-full wp-image-26174" src="{{site.url}}/blog-assets/2015/10/image00.png" alt="image00" width="404" height="712"  />]({{site.url}}/blog-assets/2015/10/image00.png)

## **Moving On**

Congratulations! You just took your AngularJS directives and packaged them into an Ionic framework app by adding a build step and making a couple configuration changes. With `ionic serve lab`, you can work further on your mobile app without any bloated IDEs or SDKs. Note that you&#8217;ll still need the proper Android/iOS SDK to [compile your app for the app store using ionic build](http://ionicframework.com/getting-started/). In the next article in this series, you&#8217;ll learn about another key advantage of hybrid mobile apps with Ionic: leveraging AngularJS&#8217; powerful testing modules to write integration tests for your app.