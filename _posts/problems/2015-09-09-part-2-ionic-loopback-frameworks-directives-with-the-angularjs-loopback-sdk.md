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
<span style="font-weight: 400;">In the </span>[<span style="font-weight: 400;">first article in this series</span>](https://strongloop.com/strongblog/part-1-ionic-loopback-node-js-mobile/)<span style="font-weight: 400;">, you built out a simple REST API for tracking times using StrongLoop LoopBack. The REST API enabled you to login using Facebook OAuth and save times recorded by a stopwatch. In order to make this API useful, you&#8217;re going to build a mobile app.</span>

<span style="font-weight: 400;">Remember that the </span>[<span style="font-weight: 400;">Ionic framework</span>](http://ionicframework.com/) <span style="font-weight: 400;">is a tool for building hybrid mobile apps on top of </span>[<span style="font-weight: 400;">AngularJS</span>](https://angularjs.org/)<span style="font-weight: 400;">. In this article, you&#8217;ll use the </span>[<span style="font-weight: 400;">LoopBack AngularJS SDK</span>](https://docs.strongloop.com/display/public/LB/AngularJS+JavaScript+SDK) <span style="font-weight: 400;">to build AngularJS directives that will be used in your Ionic mobile app. The directives you&#8217;re going to build won&#8217;t depend on Ionic, so you&#8217;ll work on them in our browser. Let&#8217;s see how the LoopBack AngularJS SDK will make building these directives easy.</span>

<!--more-->

## **Generating services with the LoopBack AngularJS SDK**

**_TLDR;_** [_<span style="font-weight: 400;">See a diff for this step on GitHub</span>_](https://github.com/vkarpov15/stopwatch-server-example/commit/e8ffeba399d727a49b7223d1cdcb455ca97cdc71)

<span style="font-weight: 400;">Since LoopBack has a well-defined format for declaring models, the LoopBack AngularJS SDK can generate AngularJS services corresponding to your models. These services will provide a mechanism for your client-side JavaScript to communicate with your REST API.</span>

<span style="font-weight: 400;">Getting started with the LoopBack AngularJS SDK is easy. If you successfully ran `</span><span style="font-weight: 400;">npm install -g strongloop`</span><span style="font-weight: 400;">, you should already have the `</span><span style="font-weight: 400;">lb-ng`</span> <span style="font-weight: 400;">executable. The </span><span style="font-weight: 400;">lb-ng</span> <span style="font-weight: 400;">executable takes 2 parameters: the entry point to your LoopBack server and the file to write the generated JavaScript to. Running the below command from the </span>[<span style="font-weight: 400;">stopwatch server directory root</span>](https://github.com/vkarpov15/stopwatch-server-example) <span style="font-weight: 400;">will generate AngularJS services in the `</span><span style="font-weight: 400;">client/js/services.js`</span> <span style="font-weight: 400;">file.</span>

```js
$ lb-ng ./server/server.js ./client/js/services.js
Loading LoopBack app "./server/server.js"
Generating "lbServices" for the API endpoint "/api"
Warning: scope User.accessTokens targets class "AccessToken", which is not exposed
via remoting. The Angular code for this scope won't be generated.
Saving the generated services source to "./client/js/services.js"
```

<span style="font-weight: 400;">What do these services actually do? These services are wrappers around the </span>[<span style="font-weight: 400;">AngularJS `</span><span style="font-weight: 400;">$resource`</span> <span style="font-weight: 400;">service</span>](http://www.sitepoint.com/creating-crud-app-minutes-angulars-resource/)<span style="font-weight: 400;">. This means that you now have a `Time` service which enables you to create a new time and save it like you see in the below pseudo-code. All you need to do is make your AngularJS module depend on the `</span><span style="font-weight: 400;">lbServices`</span> <span style="font-weight: 400;">module. The LoopBack service takes care of translating your `</span><span style="font-weight: 400;">$save()`</span> <span style="font-weight: 400;">call into a `</span><span style="font-weight: 400;">POST` </span><span style="font-weight: 400;">request to your REST API.</span>

```js
var time = new Time({ time: 250 });
time.$save();
```

<span style="font-weight: 400;">Now that you have this JavaScript file, you need to make it accessible in the browser. Thankfully, serving this JavaScript file from your LoopBack server is trivial. You just need to add a static middleware to the &#8216;files&#8217; phase in your `</span><span style="font-weight: 400;">server/middleware.json`</span> <span style="font-weight: 400;">file. The below middleware will make it so that a browser can get your `</span><span style="font-weight: 400;">services.js`</span> <span style="font-weight: 400;">file from `</span><span style="font-weight: 400;">http://localhost:3000/js/services.js`</span><span style="font-weight: 400;">.</span>

```js
"files": {
    "loopback#static": {
      "params": "$!../client"
    }
  }
```

## **Setting up your first directive**

_<span style="font-weight: 400;">TLDR; </span>_[_<span style="font-weight: 400;">See a diff for this step on GitHub</span>_](https://github.com/vkarpov15/stopwatch-server-example/commit/f9b035c6d04037bf1b6930387e8ca5753f4a2e05)

<span style="font-weight: 400;">Now that you have AngularJS services that enable you to communicate with your REST API, let&#8217;s build a simple AngularJS directive that will enable the user to log in. AngularJS </span>_<span style="font-weight: 400;">directives</span>_ <span style="font-weight: 400;">are bundles of HTML and JavaScript that you can plug into your page. Directives are analogous to </span>[<span style="font-weight: 400;">web components</span>](http://webcomponents.org/) <span style="font-weight: 400;">or </span>[<span style="font-weight: 400;">ReactJS components</span>](http://react-components.com/)<span style="font-weight: 400;">. The first directive you&#8217;ll build is a user menu; if the user is not logged in, it will show a log-in button, otherwise it&#8217;ll show a welcome message.</span>

<span style="font-weight: 400;">First, you should create the entry point to your web app in the `</span><span style="font-weight: 400;">client/index.html`</span> <span style="font-weight: 400;">file. The HTML looks like this:</span>

```js
&lt;html ng-app="core"&gt;
  &lt;head&gt;
    &lt;script type="text/javascript"
            src="//code.angularjs.org/1.4.3/angular.js"&gt;
    &lt;/script&gt;
    &lt;script type="text/javascript"
            src="//code.angularjs.org/1.4.3/angular-resource.js"&gt;
    &lt;/script&gt;
    &lt;script type="text/javascript"
            src="js/services.js"&gt;
    &lt;/script&gt;
    &lt;script type="text/javascript"
            src="js/index.js"&gt;
    &lt;/script&gt;
  &lt;/head&gt;

  &lt;body&gt;
    &lt;user-menu&gt;&lt;/user-menu&gt;
  &lt;/body&gt;
&lt;/html&gt;
```

<span style="font-weight: 400;">If you&#8217;ve seen HTML before, this shouldn&#8217;t look too complicated. The above HTML includes 4 JavaScript files: the AngularJS core, the `ngResource` module that the LoopBack AngularJS module depends on, the `</span><span style="font-weight: 400;">services.js`</span> <span style="font-weight: 400;">file that the AngularJS SDK generated, and an `</span><span style="font-weight: 400;">index.js`</span> <span style="font-weight: 400;">file that you&#8217;ll learn about shortly. </span>[<span style="font-weight: 400;">The `ngApp` directive</span>](https://docs.angularjs.org/api/ng/directive/ngApp) <span style="font-weight: 400;">on the `<html>` tag says that the main AngularJS module for this page is called `core`.</span>

<span style="font-weight: 400;">Now what&#8217;s this `</span><span style="font-weight: 400;">user-menu`</span> <span style="font-weight: 400;">tag about? This is the user menu directive in action. Here&#8217;s how it&#8217;s implemented. Note that the `</span><span style="font-weight: 400;">factory()`</span> <span style="font-weight: 400;">and `</span><span style="font-weight: 400;">directive()`</span> <span style="font-weight: 400;">function calls below are chained to the `</span><span style="font-weight: 400;">angular.module()`</span> <span style="font-weight: 400;">function call.</span>

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

<span style="font-weight: 400;">The `</span><span style="font-weight: 400;">$user`</span> <span style="font-weight: 400;">service is a caching layer on top of the `</span><span style="font-weight: 400;">User`</span> <span style="font-weight: 400;">service, which comes from the LoopBack AngularJS SDK. The `</span><span style="font-weight: 400;">User`</span> <span style="font-weight: 400;">service provides a convenient interface to interact with the user REST API from </span>[<span style="font-weight: 400;">the REST API article</span>](https://strongloop.com/strongblog/part-1-ionic-loopback-node-js-mobile/)<span style="font-weight: 400;">. The `</span><span style="font-weight: 400;">User.findById()`</span> <span style="font-weight: 400;">function translates to a `</span><span style="font-weight: 400;">GET`</span> <span style="font-weight: 400;">request to `</span><span style="font-weight: 400;">/api/Users/me`</span><span style="font-weight: 400;">. Below is the console output from Chrome when you load the `index.html` page.</span>

<img class="aligncenter size-full wp-image-25976" src="https://strongloop.com/wp-content/uploads/2015/09/ng1.png" alt="ng1" width="871" height="947" srcset="https://strongloop.com/wp-content/uploads/2015/09/ng1.png 871w, https://strongloop.com/wp-content/uploads/2015/09/ng1-276x300.png 276w, https://strongloop.com/wp-content/uploads/2015/09/ng1-648x705.png 648w, https://strongloop.com/wp-content/uploads/2015/09/ng1-450x489.png 450w" sizes="(max-width: 871px) 100vw, 871px" />

<span style="font-weight: 400;">The `</span><span style="font-weight: 400;">userMenu`</span> <span style="font-weight: 400;">directive attaches the `</span><span style="font-weight: 400;">$user`</span> <span style="font-weight: 400;">service to the AngularJS scope, which enables the template defined in `</span><span style="font-weight: 400;">templates/user_menu.html`</span> <span style="font-weight: 400;">to access it. The `</span><span style="font-weight: 400;">userMenu`</span> <span style="font-weight: 400;">directive could use the `</span><span style="font-weight: 400;">User`</span> <span style="font-weight: 400;">service directly; however, it&#8217;s typically better to have a separate service to track which user is currently logged in. In particular, since </span>[<span style="font-weight: 400;">AngularJS services are lazily-instantiated singletons</span>](https://docs.angularjs.org/guide/services)<span style="font-weight: 400;">, multiple controllers can use the `</span><span style="font-weight: 400;">$user` </span><span style="font-weight: 400;">service without having to make extra `</span><span style="font-weight: 400;">GET /api/Users/me`</span> <span style="font-weight: 400;">HTTP requests. You can learn more about this paradigm and other related AngularJS best practices in </span>[<span style="font-weight: 400;">Professional AngularJS&#8217; architecture chapter</span>](http://www.amazon.com/Professional-AngularJS-Valeri-Karpov/dp/1118832078/)<span style="font-weight: 400;">.</span>

<span style="font-weight: 400;">Now, let&#8217;s take a look at the user-menu&#8217;s template, in `</span><span style="font-weight: 400;">templates/user_menu.html`</span><span style="font-weight: 400;">. The HTML looks like this:</span>

```js
&lt;div&gt;
  &lt;div class="user-data" ng-show="user.data"&gt;
    &lt;div&gt;
      Welcome, {{user.data.username}}
    &lt;/div&gt;
  &lt;/div&gt;
  &lt;div class="login" ng-show="!user.data"&gt;
    &lt;a href="/auth/facebook"&gt;
      &lt;img src="//i.stack.imgur.com/LKMP7.png"&gt;
    &lt;/a&gt;
  &lt;/div&gt;
&lt;/div&gt;
```

<span style="font-weight: 400;">This HTML defines two smaller components. The first shows a welcome message when the user is actually logged in. The second shows a Facebook login button if the user is not logged in.</span>

<span style="font-weight: 400;">That&#8217;s it for the user menu. Now you&#8217;re ready to build the real functionality for the stopwatch app: a timer directive, and a directive that shows a list of times.</span>

## **Building the Stopwatch directives**

**_TLDR;_** [_<span style="font-weight: 400;">See a diff for this step on GitHub</span>_](https://github.com/vkarpov15/stopwatch-server-example/commit/835a95eba98e99fb5c9a89b6d87249f7d91ae885)

<span style="font-weight: 400;">So far, you used the &#8216;User&#8217; service to build a simple login button. You can use a similar paradigm to build the actual stopwatch functionality using the &#8216;Time&#8217; service. The &#8216;Time&#8217; service corresponds to the &#8216;Time&#8217; API you built out in the </span>[<span style="font-weight: 400;">first article in this series</span>](https://strongloop.com/strongblog/part-1-ionic-loopback-node-js-mobile/)<span style="font-weight: 400;">. Using this service, you&#8217;ll build out two directives; an actual timer, and a list of times that have been recorded. First, let&#8217;s take a look at the timer directive.</span>

<span style="font-weight: 400;">The timer directive has a few subtle quirks. As you&#8217;ll learn in the final article in this series, it&#8217;s pretty easy to test this directive in a CI framework, but for now you&#8217;ll just eyeball it in the browser. The timer directive is organized as a state machine with the following states.</span>

<li style="font-weight: 400;">
  <span style="font-weight: 400;">The &#8216;INIT&#8217; state: the initial state.</span>
</li>
<li style="font-weight: 400;">
  <span style="font-weight: 400;">The &#8216;RUNNING&#8217; state: the timer is running.</span>
</li>
<li style="font-weight: 400;">
  <span style="font-weight: 400;">The &#8216;STOPPED&#8217; state: the timer is stopped, but the time hasn&#8217;t been saved</span>
</li>
<li style="font-weight: 400;">
  <span style="font-weight: 400;">The &#8216;SUCCESS&#8217; state: the time has been saved successfully.</span>
</li>

<span style="font-weight: 400;">Here&#8217;s how the states look visually. First, there&#8217;s the &#8216;INIT&#8217; state, where the user hasn&#8217;t done anything.</span>

<img class="aligncenter size-full wp-image-25977" src="https://strongloop.com/wp-content/uploads/2015/09/ng2.png" alt="ng2" width="596" height="352" srcset="https://strongloop.com/wp-content/uploads/2015/09/ng2.png 596w, https://strongloop.com/wp-content/uploads/2015/09/ng2-300x177.png 300w, https://strongloop.com/wp-content/uploads/2015/09/ng2-450x266.png 450w" sizes="(max-width: 596px) 100vw, 596px" />

<span style="font-weight: 400;">Next, when the user hits &#8216;start&#8217;, the directive enters the &#8216;RUNNING&#8217; state, and a &#8216;stop&#8217; button shows up.</span>

<img class="aligncenter size-full wp-image-25978" src="https://strongloop.com/wp-content/uploads/2015/09/ng3.png" alt="ng3" width="611" height="379" srcset="https://strongloop.com/wp-content/uploads/2015/09/ng3.png 611w, https://strongloop.com/wp-content/uploads/2015/09/ng3-300x186.png 300w, https://strongloop.com/wp-content/uploads/2015/09/ng3-450x279.png 450w" sizes="(max-width: 611px) 100vw, 611px" />

<span style="font-weight: 400;">When the user hits the &#8216;stop&#8217; button, the directive enters the &#8216;STOPPED&#8217; state. Now the user can either start the timer again, reset the timer, or enter in an optional label and save the timer.</span>

<img class="aligncenter size-full wp-image-25979" src="https://strongloop.com/wp-content/uploads/2015/09/ng4.png" alt="ng4" width="657" height="524" srcset="https://strongloop.com/wp-content/uploads/2015/09/ng4.png 657w, https://strongloop.com/wp-content/uploads/2015/09/ng4-300x239.png 300w, https://strongloop.com/wp-content/uploads/2015/09/ng4-450x359.png 450w" sizes="(max-width: 657px) 100vw, 657px" />

<span style="font-weight: 400;">If the user enters in a label and hits &#8216;save&#8217;, they then enter the &#8216;SUCCESS&#8217; state. In a real application you&#8217;d have to add a state to account for network errors, but you&#8217;re going to skip that step in the interest of keeping this tutorial simple.</span>

<img class="aligncenter size-full wp-image-25980" src="https://strongloop.com/wp-content/uploads/2015/09/ng5.png" alt="ng5" width="596" height="429" srcset="https://strongloop.com/wp-content/uploads/2015/09/ng5.png 596w, https://strongloop.com/wp-content/uploads/2015/09/ng5-300x216.png 300w, https://strongloop.com/wp-content/uploads/2015/09/ng5-450x324.png 450w" sizes="(max-width: 596px) 100vw, 596px" />

<span style="font-weight: 400;">Organizing your directive as a state machine is typically useful for directives like this timer directive, which have a lot of different bits of internal state. The states make it easy to configure your UI to display the correct elements. </span>[<span style="font-weight: 400;">You can find the directive JavaScript on GitHub</span>](https://github.com/vkarpov15/stopwatch-server-example/commit/835a95eba98e99fb5c9a89b6d87249f7d91ae885#diff-1)<span style="font-weight: 400;">.</span>

<span style="font-weight: 400;">Thankfully, this is the most complex JavaScript you&#8217;ll write in this article series. Once you implement this directive, you&#8217;ll be able to plug it into your Ionic framework mobile app as-is in the next article in this series.</span>

<span style="font-weight: 400;">There are 4 functions, `</span><span style="font-weight: 400;">startTimer()`</span><span style="font-weight: 400;">, `</span><span style="font-weight: 400;">stopTimer()`</span><span style="font-weight: 400;">, `</span><span style="font-weight: 400;">resetTimer()`</span><span style="font-weight: 400;">, and `</span><span style="font-weight: 400;">save()`</span><span style="font-weight: 400;">, which are exposed to the UI to enable state transitions. In particular, the `</span><span style="font-weight: 400;">save()`</span> <span style="font-weight: 400;">function uses the LoopBack `Time` model. The `Time.create()` function triggers a `</span><span style="font-weight: 400;">POST`</span> <span style="font-weight: 400;">request to `</span><span style="font-weight: 400;">/api/Times`</span> <span style="font-weight: 400;">to create a new time.</span>

<span style="font-weight: 400;">The `</span><span style="font-weight: 400;">save()`</span> <span style="font-weight: 400;">function also uses the `</span><span style="font-weight: 400;">onTimeSaved()`</span> <span style="font-weight: 400;">function; here&#8217;s a </span>[<span style="font-weight: 400;">brief overview of AngularJS `</span><span style="font-weight: 400;">&</span><span style="font-weight: 400;">` syntax</span>](https://thinkster.io/egghead/isolate-scope-am) <span style="font-weight: 400;">if you&#8217;re not familiar with it:</span>

[<span style="font-weight: 400;">Take a look at the template in </span><span style="font-weight: 400;">templates/timer.html</span> <span style="font-weight: 400;">on GitHub</span>](https://github.com/vkarpov15/stopwatch-server-example/commit/835a95eba98e99fb5c9a89b6d87249f7d91ae885#diff-3)<span style="font-weight: 400;">.</span>

<span style="font-weight: 400;">Now that you&#8217;ve implemented the actual timer directive, you need to implement one more directive to make this usable. You need a directive that lists all times you&#8217;ve saved. Here&#8217;s how the `</span><span style="font-weight: 400;">timeList`</span> <span style="font-weight: 400;">directive looks.</span>

<img class="aligncenter size-full wp-image-25981" src="https://strongloop.com/wp-content/uploads/2015/09/ng6.png" alt="ng6" width="593" height="525" srcset="https://strongloop.com/wp-content/uploads/2015/09/ng6.png 593w, https://strongloop.com/wp-content/uploads/2015/09/ng6-300x266.png 300w, https://strongloop.com/wp-content/uploads/2015/09/ng6-450x398.png 450w" sizes="(max-width: 593px) 100vw, 593px" />

[<span style="font-weight: 400;">Take a look at the </span><span style="font-weight: 400;">timeList </span><span style="font-weight: 400;">directive JavaScript on GitHub</span>](https://github.com/vkarpov15/stopwatch-server-example/commit/835a95eba98e99fb5c9a89b6d87249f7d91ae885#diff-1)<span style="font-weight: 400;">. It&#8217;s going to use both the `User` and `Time` services, because the correct way to get all times that belong to a user is `</span><span style="font-weight: 400;">User.times({ id: &#8216;me&#8217; });`</span><span style="font-weight: 400;">. The `</span><span style="font-weight: 400;">timeList` </span><span style="font-weight: 400;">directive will also enable you to delete a time from the server using the `</span><span style="font-weight: 400;">Time.deleteById()`</span> <span style="font-weight: 400;">function.</span>

<span style="font-weight: 400;">The `</span><span style="font-weight: 400;">timeList` </span><span style="font-weight: 400;">directive controller should be pretty straightforward. Most of the logic is related to the color codes, and that&#8217;s only to ensure that you get contrasting colors to use as backgrounds for your tag badges. Speaking of the tag badges, let&#8217;s take a look at the directive&#8217;s template HTML, `</span><span style="font-weight: 400;">templates/time_list.html`</span><span style="font-weight: 400;">.</span>

```js
&lt;div&gt;
  &lt;div class="time" ng-repeat="time in times"&gt;
    &lt;span class="time-delete" ng-click="delete(time)"&gt;
      X
    &lt;/span&gt;
    {{display(time.time)}}
    &lt;span ng-if="time.tag"
          class="time-tag"
          ng-style="{ 'background-color': tagToColor[time.tag] }"&gt;
      {{time.tag}}
    &lt;/span&gt;
  &lt;/div&gt;
&lt;/div&gt;
```

<span style="font-weight: 400;">The template includes 3 simple elements. The first is a delete button that calls the `</span><span style="font-weight: 400;">delete()`</span> <span style="font-weight: 400;">function. The second renders the time&#8217;s value in the app&#8217;s standard `</span><span style="font-weight: 400;">HH:mm:ss`</span> <span style="font-weight: 400;">format. The third displays the time&#8217;s tag, if it exists, using the correct color.</span>

<span style="font-weight: 400;">Now that you have the `</span><span style="font-weight: 400;">timer`</span> <span style="font-weight: 400;">and `</span><span style="font-weight: 400;">timeList`</span> <span style="font-weight: 400;">directives, how are you going to tie them together? The top-level HTML in `</span><span style="font-weight: 400;">index.html`</span> <span style="font-weight: 400;">is simple. There&#8217;s just one subtlety: the `NEW_TIME` event that the `</span><span style="font-weight: 400;">timeList` </span><span style="font-weight: 400;">directive listens for. Since the `</span><span style="font-weight: 400;">timeList`</span> <span style="font-weight: 400;">directive doesn&#8217;t know when the `</span><span style="font-weight: 400;">timer`</span> <span style="font-weight: 400;">directive has saved a new time, you need to make sure the `</span><span style="font-weight: 400;">timer`</span> <span style="font-weight: 400;">directive communicates with the `</span><span style="font-weight: 400;">timeList`</span> <span style="font-weight: 400;">directive. That&#8217;s what the `</span><span style="font-weight: 400;">onTimeSaved`</span> <span style="font-weight: 400;">property that you added to the `</span><span style="font-weight: 400;">timer`</span> <span style="font-weight: 400;">directive is for.</span>

```js
&lt;body&gt;
  &lt;user-menu&gt;&lt;/user-menu&gt;
  &lt;hr&gt;
  &lt;timer on-time-saved="$emit('NEW_TIME', time)"&gt;
  &lt;/timer&gt;
  &lt;hr&gt;
  &lt;time-list&gt;&lt;/time-list&gt;
&lt;/body&gt;

```

## **Moving on&#8230;**

<span style="font-weight: 400;">Congratulations, you&#8217;ve just used the LoopBack AngularJS SDK to build an AngularJS client on top of your REST API! In particular, the LoopBack AngularJS SDK provided you with services that enabled you to interact with your REST API in a clean and intuitive way, without touching any URLs. However, you might be concerned that you have yet to do any mobile app development in this series of articles about mobile app development. As you&#8217;ll see in the next article, the Ionic framework will allow you to put the stopwatch directives to work in a mobile app with no changes.</span>

&nbsp;