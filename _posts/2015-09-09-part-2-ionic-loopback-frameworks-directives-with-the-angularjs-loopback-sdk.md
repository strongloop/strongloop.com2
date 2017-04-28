---
id: 25966
title: 'Part 2: Ionic &#038; LoopBack Frameworks – Directives with the AngularJS LoopBack SDK'
date: 2015-09-09T08:00:57+00:00
author: Valeri Karpov
guid: https://strongloop.com/?p=25966
permalink: /strongblog/part-2-ionic-loopback-frameworks-directives-with-the-angularjs-loopback-sdk/
categories:
  - Community
  - LoopBack
---
In the [first article in this series](https://strongloop.com/strongblog/part-1-ionic-loopback-node-js-mobile/), you built out a simple REST API for tracking times using StrongLoop LoopBack. The REST API enabled you to login using Facebook OAuth and save times recorded by a stopwatch. In order to make this API useful, you&#8217;re going to build a mobile app.

Remember that the [Ionic framework](http://ionicframework.com/) is a tool for building hybrid mobile apps on top of [AngularJS](https://angularjs.org/). In this article, you&#8217;ll use the [LoopBack AngularJS SDK](https://docs.strongloop.com/display/public/LB/AngularJS+JavaScript+SDK) to build AngularJS directives that will be used in your Ionic mobile app. The directives you&#8217;re going to build won&#8217;t depend on Ionic, so you&#8217;ll work on them in our browser. Let&#8217;s see how the LoopBack AngularJS SDK will make building these directives easy.

<!--more-->

## **Generating services with the LoopBack AngularJS SDK**

**TLDR;** [See a diff for this step on GitHub](https://github.com/vkarpov15/stopwatch-server-example/commit/e8ffeba399d727a49b7223d1cdcb455ca97cdc71)

Since LoopBack has a well-defined format for declaring models, the LoopBack AngularJS SDK can generate AngularJS services corresponding to your models. These services will provide a mechanism for your client-side JavaScript to communicate with your REST API.

Getting started with the LoopBack AngularJS SDK is easy. If you successfully ran `npm install -g strongloop`, you should already have the `lb-ng` executable. The lb-ng executable takes 2 parameters: the entry point to your LoopBack server and the file to write the generated JavaScript to. Running the below command from the [stopwatch server directory root](https://github.com/vkarpov15/stopwatch-server-example) will generate AngularJS services in the `client/js/services.js` file.


```js
$ lb-ng ./server/server.js ./client/js/services.js
Loading LoopBack app "./server/server.js"
Generating "lbServices" for the API endpoint "/api"
Warning: scope User.accessTokens targets class "AccessToken", which is not exposed
via remoting. The Angular code for this scope wont be generated.
Saving the generated services source to "./client/js/services.js"
```

What do these services actually do? These services are wrappers around the [AngularJS `$resource` service](http://www.sitepoint.com/creating-crud-app-minutes-angulars-resource/). This means that you now have a `Time` service which enables you to create a new time and save it like you see in the below pseudo-code. All you need to do is make your AngularJS module depend on the `lbServices` module. The LoopBack service takes care of translating your `$save()` call into a `POST` request to your REST API.

```js
var time = new Time({ time: 250 });
time.$save();
```

Now that you have this JavaScript file, you need to make it accessible in the browser. Thankfully, serving this JavaScript file from your LoopBack server is trivial. You just need to add a static middleware to the &#8216;files&#8217; phase in your `server/middleware.json` file. The below middleware will make it so that a browser can get your `services.js` file from `http://localhost:3000/js/services.js`.

```js
"files": {
    "loopback#static": {
      "params": "$!../client"
    }
  }
```

## **Setting up your first directive**

**TLDR;** [See a diff for this step on GitHub](https://github.com/vkarpov15/stopwatch-server-example/commit/f9b035c6d04037bf1b6930387e8ca5753f4a2e05)

Now that you have AngularJS services that enable you to communicate with your REST API, let&#8217;s build a simple AngularJS directive that will enable the user to log in. AngularJS _directives_ are bundles of HTML and JavaScript that you can plug into your page. Directives are analogous to [web components](http://webcomponents.org/) or [ReactJS components](http://react-components.com/). The first directive you&#8217;ll build is a user menu; if the user is not logged in, it will show a log-in button, otherwise it&#8217;ll show a welcome message.

First, you should create the entry point to your web app in the `client/index.html` file. The HTML looks like this:

```js
<html ng-app="core">
  <head>
    <script type="text/javascript"
            src="//code.angularjs.org/1.4.3/angular.js">
    </script>
    <script type="text/javascript"
            src="//code.angularjs.org/1.4.3/angular-resource.js">
    </script>
    <script type="text/javascript"
            src="js/services.js">
    </script>
    <script type="text/javascript"
            src="js/index.js">
    </script>
  </head>

  <body>
    <user-menu></user-menu>
  </body>
</html>
```

If you&#8217;ve seen HTML before, this shouldn&#8217;t look too complicated. The above HTML includes 4 JavaScript files: the AngularJS core, the `ngResource` module that the LoopBack AngularJS module depends on, the `services.js` file that the AngularJS SDK generated, and an `index.js` file that you&#8217;ll learn about shortly. [The `ngApp` directive](https://docs.angularjs.org/api/ng/directive/ngApp) on the `<html>` tag says that the main AngularJS module for this page is called `core`.

Now what&#8217;s this `user-menu` tag about? This is the user menu directive in action. Here&#8217;s how it&#8217;s implemented. Note that the `factory()` and `directive()` function calls below are chained to the `angular.module()` function call.

```js
// Create the 'core' module and make it depend on 'lbServices'
// 'lbServices' is the module that your 'services.js' file exports
angular.module('core', ['lbServices']).
  // The $user service represents the currently logged in user
  // and the `User` argument is defined in the lbServices module generated for you
  factory('$user', function(User) {
    var userService = {};

    // This function reloads the currently logged in user
    userService.load = function() {
      User.findById({ id: 'me' }, function(v) {
        userService.data = v;
      });
    };

    userService.load();

    return userService;
  }).
  // Declare the user menu directive
  directive('userMenu', function() {
    return {
      templateUrl: 'templates/user_menu.html',
      controller: function($scope, $user) {
        // Expose the $user service to the template HTML
        $scope.user = $user;
      }
    };
  });
```

The `$user` service is a caching layer on top of the `User` service, which comes from the LoopBack AngularJS SDK. The `User` service provides a convenient interface to interact with the user REST API from [the REST API article](https://strongloop.com/strongblog/part-1-ionic-loopback-node-js-mobile/). The `User.findById()` function translates to a `GET` request to `/api/Users/me`. Below is the console output from Chrome when you load the `index.html` page.

<img class="aligncenter size-full wp-image-25976" src="{{site.url}}/blog-assets/2015/09/ng1.png" alt="ng1" width="871" height="947"  />

The `userMenu` directive attaches the `$user` service to the AngularJS scope, which enables the template defined in `templates/user_menu.html` to access it. The `userMenu` directive could use the `User` service directly; however, it&#8217;s typically better to have a separate service to track which user is currently logged in. In particular, since [AngularJS services are lazily-instantiated singletons](https://docs.angularjs.org/guide/services), multiple controllers can use the `$user` service without having to make extra `GET /api/Users/me` HTTP requests. You can learn more about this paradigm and other related AngularJS best practices in [Professional AngularJS&#8217; architecture chapter](http://www.amazon.com/Professional-AngularJS-Valeri-Karpov/dp/1118832078/).

Now, let&#8217;s take a look at the user-menu&#8217;s template, in `templates/user_menu.html`. The HTML looks like this:

{% raw %}
```js
<div>
  <div class="user-data" ng-show="user.data">
    <div>
      Welcome, {{user.data.username}}
    </div>
  </div>
  <div class="login" ng-show="!user.data">
    <a href="/auth/facebook">
      <img src="//i.stack.imgur.com/LKMP7.png">
    </a>
  </div>
</div>
```
{% endraw %}

This HTML defines two smaller components. The first shows a welcome message when the user is actually logged in. The second shows a Facebook login button if the user is not logged in.

That&#8217;s it for the user menu. Now you&#8217;re ready to build the real functionality for the stopwatch app: a timer directive, and a directive that shows a list of times.

## **Building the Stopwatch directives**

**TLDR;** [See a diff for this step on GitHub](https://github.com/vkarpov15/stopwatch-server-example/commit/835a95eba98e99fb5c9a89b6d87249f7d91ae885)

So far, you used the &#8216;User&#8217; service to build a simple login button. You can use a similar paradigm to build the actual stopwatch functionality using the &#8216;Time&#8217; service. The &#8216;Time&#8217; service corresponds to the &#8216;Time&#8217; API you built out in the [first article in this series](https://strongloop.com/strongblog/part-1-ionic-loopback-node-js-mobile/). Using this service, you&#8217;ll build out two directives; an actual timer, and a list of times that have been recorded. First, let&#8217;s take a look at the timer directive.

The timer directive has a few subtle quirks. As you&#8217;ll learn in the final article in this series, it&#8217;s pretty easy to test this directive in a CI framework, but for now you&#8217;ll just eyeball it in the browser. The timer directive is organized as a state machine with the following states.

<li style="font-weight: 400;">
  The &#8216;INIT&#8217; state: the initial state.
</li>
<li style="font-weight: 400;">
  The &#8216;RUNNING&#8217; state: the timer is running.
</li>
<li style="font-weight: 400;">
  The &#8216;STOPPED&#8217; state: the timer is stopped, but the time hasn&#8217;t been saved
</li>
<li style="font-weight: 400;">
  The &#8216;SUCCESS&#8217; state: the time has been saved successfully.
</li>

Here&#8217;s how the states look visually. First, there&#8217;s the &#8216;INIT&#8217; state, where the user hasn&#8217;t done anything.

<img class="aligncenter size-full wp-image-25977" src="{{site.url}}/blog-assets/2015/09/ng2.png" alt="ng2" width="596" height="352"  />

Next, when the user hits &#8216;start&#8217;, the directive enters the &#8216;RUNNING&#8217; state, and a &#8216;stop&#8217; button shows up.

<img class="aligncenter size-full wp-image-25978" src="{{site.url}}/blog-assets/2015/09/ng3.png" alt="ng3" width="611" height="379"  />

When the user hits the &#8216;stop&#8217; button, the directive enters the &#8216;STOPPED&#8217; state. Now the user can either start the timer again, reset the timer, or enter in an optional label and save the timer.

<img class="aligncenter size-full wp-image-25979" src="{{site.url}}/blog-assets/2015/09/ng4.png" alt="ng4" width="657" height="524"  />

If the user enters in a label and hits &#8216;save&#8217;, they then enter the &#8216;SUCCESS&#8217; state. In a real application you&#8217;d have to add a state to account for network errors, but you&#8217;re going to skip that step in the interest of keeping this tutorial simple.

<img class="aligncenter size-full wp-image-25980" src="{{site.url}}/blog-assets/2015/09/ng5.png" alt="ng5" width="596" height="429"  />

Organizing your directive as a state machine is typically useful for directives like this timer directive, which have a lot of different bits of internal state. The states make it easy to configure your UI to display the correct elements. [You can find the directive JavaScript on GitHub](https://github.com/vkarpov15/stopwatch-server-example/commit/835a95eba98e99fb5c9a89b6d87249f7d91ae885#diff-1).

Thankfully, this is the most complex JavaScript you&#8217;ll write in this article series. Once you implement this directive, you&#8217;ll be able to plug it into your Ionic framework mobile app as-is in the next article in this series.

There are 4 functions, `startTimer()`, `stopTimer()`, `resetTimer()`, and `save()`, which are exposed to the UI to enable state transitions. In particular, the `save()` function uses the LoopBack `Time` model. The `Time.create()` function triggers a `POST` request to `/api/Times` to create a new time.

The `save()` function also uses the `onTimeSaved()` function; here&#8217;s a [brief overview of AngularJS `&` syntax](https://thinkster.io/egghead/isolate-scope-am) if you&#8217;re not familiar with it:

[Take a look at the template in templates/timer.html on GitHub](https://github.com/vkarpov15/stopwatch-server-example/commit/835a95eba98e99fb5c9a89b6d87249f7d91ae885#diff-3).

Now that you&#8217;ve implemented the actual timer directive, you need to implement one more directive to make this usable. You need a directive that lists all times you&#8217;ve saved. Here&#8217;s how the `timeList` directive looks.

<img class="aligncenter size-full wp-image-25981" src="{{site.url}}/blog-assets/2015/09/ng6.png" alt="ng6" width="593" height="525"  />

[Take a look at the timeList directive JavaScript on GitHub](https://github.com/vkarpov15/stopwatch-server-example/commit/835a95eba98e99fb5c9a89b6d87249f7d91ae885#diff-1). It&#8217;s going to use both the `User` and `Time` services, because the correct way to get all times that belong to a user is `User.times({ id: &#8216;me&#8217; });`. The `timeList` directive will also enable you to delete a time from the server using the `Time.deleteById()` function.

The `timeList` directive controller should be pretty straightforward. Most of the logic is related to the color codes, and that&#8217;s only to ensure that you get contrasting colors to use as backgrounds for your tag badges. Speaking of the tag badges, let&#8217;s take a look at the directive&#8217;s template HTML, `templates/time_list.html`.

{% raw %}
```js
<div>
  <div class="time" ng-repeat="time in times">
    <span class="time-delete" ng-click="delete(time)">
      X

    {{display(time.time)}}
    <span ng-if="time.tag"
          class="time-tag"
          ng-style="{ 'background-color': tagToColor[time.tag] }">
      {{time.tag}}

  </div>
</div>
```
{% endraw %}

The template includes 3 simple elements. The first is a delete button that calls the `delete()` function. The second renders the time&#8217;s value in the app&#8217;s standard `HH:mm:ss` format. The third displays the time&#8217;s tag, if it exists, using the correct color.

Now that you have the `timer` and `timeList` directives, how are you going to tie them together? The top-level HTML in `index.html` is simple. There&#8217;s just one subtlety: the `NEW_TIME` event that the `timeList` directive listens for. Since the `timeList` directive doesn&#8217;t know when the `timer` directive has saved a new time, you need to make sure the `timer` directive communicates with the `timeList` directive. That&#8217;s what the `onTimeSaved` property that you added to the `timer` directive is for.

```js
<body>
  <user-menu></user-menu>
  <hr>
  <timer on-time-saved="$emit('NEW_TIME', time)">
  </timer>
  <hr>
  <time-list></time-list>
</body>
```

## **Moving on&#8230;**

Congratulations, you&#8217;ve just used the LoopBack AngularJS SDK to build an AngularJS client on top of your REST API! In particular, the LoopBack AngularJS SDK provided you with services that enabled you to interact with your REST API in a clean and intuitive way, without touching any URLs. However, you might be concerned that you have yet to do any mobile app development in this series of articles about mobile app development. As you&#8217;ll see in the next article, the Ionic framework will allow you to put the stopwatch directives to work in a mobile app with no changes.

&nbsp;
