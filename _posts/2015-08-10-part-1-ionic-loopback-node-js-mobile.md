---
id: 25757
title: 'Part 1: Ionic &#038; LoopBack Frameworks &#8211; Building a REST API'
date: 2015-08-10T07:01:02+00:00
author: Valeri Karpov
guid: https://strongloop.com/?p=25757
permalink: /strongblog/part-1-ionic-loopback-node-js-mobile/
categories:
  - Community
  - How-To
  - JavaScript Language
  - LoopBack
  - Mobile
---
I have a confession: I hate native mobile development. Most of the reason why I started working with NodeJS was my struggles with managing mobile app development for a small startup in 2012. Back then, native mobile development struggled with painfully slow feedback &#8211; to see the results of your work in action, you need to start a server, re-compile, wait for the app to load, and click around in a simulator.

Code sharing was also a lost cause. In my experience, it&#8217;s hard to get code right once. When your server is in Ruby, your iOS app is in Objective-C, your Android app is in Java, and your web client is in JavaScript, you end up maintaining 4 separate implementations of the same code in 4 different languages. Even worse, each implementation is bound to have its own bugs, quirks, and performance issues.

Now, with StrongLoop [LoopBack](http://loopback.io/) and the [Ionic framework](http://ionicframework.com/), you can quickly build out a server and a corresponding mobile app using only JavaScript. LoopBack enables you to quickly build up a REST API from your command line. Ionic enables you to build &#8220;hybrid&#8221; mobile apps, that is, mobile apps that work by launching a browser and executing JavaScript.

In this series of articles, you&#8217;ll see how you can build a server using LoopBack. Then you&#8217;ll use LoopBack&#8217;s AngularJS SDK to create AngularJS components which you will use to create an Ionic framework hybrid mobile app. There will be 4 articles in this series:

  1. Building a LoopBack REST API
  2. Building AngularJS Directives with the LoopBack AngularJS SDK
  3. Using AngularJS Directives in Ionic Framework Mobile Apps
  4. Testing Your Mobile App in Travis

You&#8217;ll be building a simple stopwatch application. Users of the app will be able to log in with Facebook, track times, and save their times to the server. Let&#8217;s get started!

## **Getting Started with LoopBack**

StrongLoop LoopBack is a tool for rapidly generating NodeJS REST API&#8217;s. LoopBack also has a powerful AngularJS SDK that enables you to generate AngularJS clients for your REST API&#8217;s. Since the Ionic framework is based on AngularJS, the LoopBack AngularJS SDK makes building a mobile app even easier. You&#8217;ll learn more about the AngularJS SDK in the next article. In this article, you&#8217;ll use LoopBack to create a REST API with Facebook login. You can find the [complete stopwatch server on GitHub](https://github.com/vkarpov15/stopwatch-server-example)

The first step is to install the \`strongloop\` npm module using \`npm install strongloop -g\`. The \`strongloop\` module gives you the \`slc\` executable. Run \`slc loopback\` to start a new application &#8211; you should see the below output in your terminal. Call your application \`stopwatch-server-example\`.

```js
$ ./node_modules/strongloop/bin/slc loopback

     _-----_
    |       |    .--------------------------.
    |--(o)--|    |  Let's create a LoopBack |
   `---------´   |       application!       |
    ( _´U`_ )    '--------------------------'
    /___A___\
     |  ~  |
   __'.___.'__

? What's the name of your application? stopwatch-server-example
```

LoopBack will create a directory called \`stopwatch-server-example\`. The [stopwatch-server-example directory&#8217;s code will look like this](https://github.com/vkarpov15/stopwatch-server-example/commit/23010aedf9eb9093b5a7357bd01dccc1b551470b) once LoopBack is done.

<!--more-->

## **Setting Up Facebook Login**

_TLDR;_ [_See a diff for this step on GitHub_](https://github.com/vkarpov15/stopwatch-server-example/commit/ecdc101dc58aaadc88b59e8decd0beaa7e347697)

Adding Facebook login to your LoopBack server is easy. LoopBack is great for reducing the amount of wiring code you need to write; most of the code you&#8217;ll write in this section will be either on the command line or in JSON configurations rather than actual JavaScript. There&#8217;s nothing stopping you from writing a plain-old Express REST API on top of LoopBack&#8217;s scaffolding. However, effective LoopBack developers rely on the command line interface to do most of the work.

First, you&#8217;re going to need to add 2 npm modules to the \`stopwatch-server-example\` directory&#8217;s \`package.json\` file:

  * \`npm install loopback-component-passport &#8211;save\`
  * \`npm install passport-facebook &#8211;save\`

Once you have these 2 modules, you&#8217;re going to write a little code to wire them together in your server. First, open up your \`server/model-config.json\` file. This is where LoopBack stores high-level metadata about your data models. In order to integrate Facebook login with LoopBack, you&#8217;re going to need to pull in the \`loopback-component-passport\` module&#8217;s \`[UserIdentity](http://docs.strongloop.com/pages/releaseview.action?pageId=3836277#Third-partylogin%28Passport%29-UserIdentitymodel)\` and \`[UserCredential](http://docs.strongloop.com/pages/releaseview.action?pageId=3836277#Third-partylogin%28Passport%29-UserCredentialmodel)\` models. You won&#8217;t have to interact with these models directly, but LoopBack needs to be aware of them.

To add these models, first you should add \`./node_modules/loopback-component-passport/lib/models\` to the sources list inside \`model-config.json\`. This tells LoopBack where to find these models. You also need to add \`[UserCredential\` and \`UserIdentity\` to the top-level object](https://github.com/vkarpov15/stopwatch-server-example/commit/ecdc101dc58aaadc88b59e8decd0beaa7e347697#diff-3) (alongside “User”, “Role”, etc):

```js
"UserCredential": {
  "dataSource": "db",
  "public": true
},
"UserIdentity": {
  "dataSource": "db",
  "public": true
}
```

Once that&#8217;s done, you&#8217;re going to have to configure your server to allow Facebook login. You should [add a boot script to LoopBack&#8217;s \`server/boot\` directory that configures LoopBack&#8217;s \`PassportConfigurator](https://github.com/vkarpov15/stopwatch-server-example/commit/ecdc101dc58aaadc88b59e8decd0beaa7e347697#diff-2)\`. [Boot scripts](http://docs.strongloop.com/display/public/LB/Defining+boot+scripts;jsessionid=68BB30C5B41D43772DC77CED25005089) are a powerful mechanism for configuring your LoopBack server. A boot script enables you to add operations to your server startup process without adding extra bloat to your \`server/server.js\` file.

```js
// Make sure to also put this in `server/server.js`
var PassportConfigurator =
  require('loopback-component-passport').PassportConfigurator;

// Include this in your 'facebook-oauth.js' boot script in `server/boot`.
var passportConfigurator = new PassportConfigurator(app);

passportConfigurator.init();
passportConfigurator.setupModels({
  userModel: app.models.User,
  userIdentityModel: app.models.UserIdentity,
  userCredentialModel: app.models.UserCredential
});
passportConfigurator.configureProvider('facebook-login',
  require('../providers.json')['facebook-login']);
```

Notice the \`providers.json\` file that \`require()\` loads above. That file contains JSON configuration parameters for Facebook login, including your client id and secret. In the interest of avoiding Facebook&#8217;s inane labyrinth of OAuth configurations, a functioning \`providers.json\` is included in the above commit and shown below.

```js
{
  "facebook-login": {
    "provider": "facebook",
    "module": "passport-facebook",
    "clientID": "919651901409502",
    "clientSecret": "5ca481b467aa7f80c24702f093e64417",
    "callbackURL": "http://localhost:3000/auth/facebook/callback",
    "authPath": "/auth/facebook",
    "callbackPath": "/auth/facebook/callback",
    "successRedirect": "/api/Users/me",
    "scope": ["public_profile"]
  }
}


Note: that clientID and clientSecret are for a very weak little Facebook application that you can use for your examples. However, you’ll want to create your own Facebook application with its own ID for “real” apps.
```

That&#8217;s all you need to set up Facebook login! Now, if you start the server with \`node .\` and go to \`http://localhost:3000/auth/facebook\`, LoopBack will redirect users back to the \`/api/Users/me route\`. Notice, however, that this route is currently not implemented. While you can log in, there&#8217;s no way to get data about the currently logged in user. That&#8217;s what you&#8217;ll implement in the next section.

## **Getting the Currently Logged In User**

_TLDR;_ [_See a diff for this step on GitHub_](https://github.com/vkarpov15/stopwatch-server-example/commit/78d16c1fd1d10437c8eff6e9fcdd94f01a855bd8)

The ability to send the user to Facebook to log in is just the first step &#8211; logging in isn&#8217;t very useful if you can&#8217;t track the currently logged in user. To actually track the currently logged in user, you&#8217;re going to have to add a session store and a cookie parser.

  * \`npm install express-session &#8211;save\`
  * \`npm install cookie-parser &#8211;save\`

Once you have installed the session middleware and cookie parser middleware, you&#8217;ll need to plug them into your REST API. Specifically, you&#8217;ll need to plug in 3 middleware modules:

  * A middleware that parses cookies.
  * A middleware that uses cookies to track the currently logged in user via sessions.
  * A middleware that converts the \`/me\` part of the \`/api/Users/me\` into a reference to the currently logged in user.

To add these middleware, add the below code to your \`server/middleware.json\` file within the appropriate phases. Note that you can add multiple pieces of middleware per phase!

```js
"session:before": {
  "cookie-parser": { "params": "test secret" }
},
"session": {
  "express-session": {
    "params": {
      "secret": "other test secret",
      "saveUninitialized": true,
      "resave": true
    }
  }
}
```

You will also need to add the below code to your \`server/boot/authentication.js\` boot script (within the exported function).

```js
server.middleware('auth', loopback.token({
  model: server.models.accessToken,
  currentUserLiteral: 'me'
}));
```

The first two middleware modules are standard boilerplate that you may have seen if you&#8217;ve used [Express](https://www.npmjs.com/package/express) before. In fact, what you&#8217;re doing with the \`middleware.json\` file is wiring up the the \`cookie-parser\` and \`express-session\` npm packages, respectively, to your LoopBack server.

Once you set up the first two middleware modules and log in using Facebook, you should be able to visit \`http://localhost:3000/api/Users/1\` and see what information LoopBack has stored about you. For instance, below is the output when I log in.

```js
{"username":"facebook-login.383798881820166","email":"383798881820166@loopback.facebook.com","id":1}
```

However, getting this data depends on you knowing what your user ID is. You&#8217;ll notice that your Facebook login is configured to redirect the user to \`http://localhost:3000/api/Users/me\` when they&#8217;ve successfully logged in. The third middleware, the &#8216;auth&#8217; middleware, transforms \`/me\` into the ID for the currently logged in user. This makes it easier to set up an Ionic framework app on top of your REST API. Since you can leverage browser cookies in your hybrid mobile app, your app code doesn&#8217;t need to track any sort of authentication token. LoopBack enables you to specify the token in your \`Authorization\` header, but, for the purposes of this tutorial, you&#8217;ll use cookies in order to minimize the amount of code you need to write.

## **Setting Up a Times Model**

_TLDR;_ [_See a diff for this step on GitHub_](https://github.com/vkarpov15/stopwatch-server-example/commit/dd684b09b592a84f843bc61551b6962f6115448e)
  
Once you have authentication set up, now you need to create a new model that will store the user&#8217;s recorded times. The times will contain the recorded time in milliseconds and an optional tag. For instance, if your user is using the app to track their 200 meter and 400 meter sprint times, they could tag once set of times with &#8220;200m&#8221; and the other with &#8220;400m&#8221; to see their progress in each sprint over time.

To create a new model, use the \`slc loopback:model\` command. Let&#8217;s call this model &#8216;Time&#8217;. You can use any of the databases LoopBack supports, but, in the interest of keeping this tutorial lightweight, you&#8217;re just going to use the in-memory database.

```js
$ slc loopback:model
? Enter the model name: Time
? Select the data-source to attach Time to: db (memory)
? Select model's base class: PersistedModel
? Expose Time via the REST API? Yes
? Custom plural form (used to build REST URL): Times
Let's add some Time properties now.

Enter an empty property name when done.
? Property name: time
   invoke   loopback:property
? Property type: number
? Required? Yes

Let's add another Time property.
Enter an empty property name when done.
? Property name: tag
   invoke   loopback:property
? Property type: string
? Required? No

Let's add another Time property.
Enter an empty property name when done.
? Property name:
```

Once you have run this command and filled out the prompts as shown above, you should now have a \`common/models/time.json\` file that looks like what you see below.

```js
{
  "name": "Time",
  "plural": "Times",
  "base": "PersistedModel",
  "idInjection": true,
  "options": {
    "validateUpsert": true
  },
  "properties": {
    "time": {
      "type": "number",
      "required": true
    },
    "tag": {
      "type": "string"
    }
  },
  "validations": [],
  "relations": {},
  "acls": [],
  "method
```

You now have a &#8216;Time&#8217; model with 2 properties: a required \`time\` number, and an optional tag string. However, this model doesn&#8217;t take into account one important detail: the relationship between users and times. Specifically, you have a one-to-many relationship between users and times. LoopBack has a neat [command line interface for creating relations between models](http://docs.strongloop.com/display/public/LB/Tutorial%3A+model+relations#Tutorial:modelrelations-Createmodelrelation). But since &#8216;User&#8217; is a built-in model that lives in your \`node_modules\` directory, it isn&#8217;t tracked by source control. You can declare the relation in your \`server/server.js\` file.

```js
var User = app.models.User;
User.hasMany(app.models.Time, { as: 'times', foreignKey: 'userId' });
```

Now &#8216;Times&#8217; has a &#8216;userId&#8217; field that tracks which user this time belongs to. So now, when you log in, you should be able to go to \`http://localhost:3000/api/Users/me/times\` and get an HTTP 401 unauthorized. Believe it or not, this error is a good thing: this means that you have created the relation correctly. Now you just need to set up permissions.

First, you should create permissions for the &#8216;Time&#8217; model. Users should only be able to access times that belong to them, and authenticated users should be able to create new times. LoopBack has the \`slc loopback:acl\` command for creating permissions. You can use this command 3 times to create 3 access control rules for the &#8216;Time&#8217; model.

```js
$ slc loopback:acl
? Select the model to apply the ACL entry to: Time
? Select the ACL scope: All methods and properties
? Select the access type: All (match all types)
? Select the role: All users
? Select the permission to apply: Explicitly deny access
$ slc loopback:acl
? Select the model to apply the ACL entry to: Time
? Select the ACL scope: All methods and properties
? Select the access type: All (match all types)
? Select the role: The user owning the object
? Select the permission to apply: Explicitly grant access
$ slc loopback:acl
? Select the model to apply the ACL entry to: Time
? Select the ACL scope: A single method
? Enter the method name: create
? Select the role: Any authenticated user
? Select the permission to apply: Explicitly grant access
```

The above process defines 3 access control rules for the &#8216;Time&#8217; model.

  1. By default, access to all operations on the &#8216;Time&#8217; model is denied.
  2. A user can do whatever they want to a &#8216;Time&#8217; instance that they own.
  3. An authenticated user can create a new &#8216;Time&#8217; instance.

Take a look at \`common/models/time.json\`, you should see the following:

```js
"acls": [
  {
    "accessType": "*",
    "principalType": "ROLE",
    "principalId": "$everyone",
    "permission": "DENY"
  },
  {
    "accessType": "*",
    "principalType": "ROLE",
    "principalId": "$owner",
    "permission": "ALLOW"
  },
  {
    "accessType": "EXECUTE",
    "principalType": "ROLE",
    "principalId": "$authenticated",
    "permission": "ALLOW",
    "property": "create"
  }
]
```

Even after you do this, you&#8217;re still going to get an HTTP 401 when you go to \`http://localhost:3000/api/Users/me/times\`. In order to make this work, you&#8217;re going to have to add an ACL to the User model as well. The \`[\_\_get\_\_times\` function is the function the User model uses to get related times](http://docs.strongloop.com/display/public/LB/Accessing+related+models). Once again, since the &#8216;User&#8217; model isn&#8217;t tracked by git, the easiest place to make this change is in [a boot script called \`server/boot/user-permissions.js](https://github.com/vkarpov15/stopwatch-server-example/commit/27148a641c1af3b1c83ad65c456c881340325312#diff-2)\`.

```js
module.exports = function(app) {
  var User = app.models.User;
  var ACL = app.models.ACL;
  User.hasMany(app.models.Time, { as: 'times', foreignKey: 'userId' });
  ACL.create({
    accessType: ACL.ALL,
    permission: ACL.ALLOW,
    principalType: ACL.ROLE,
    principalId: '$owner',
    model: 'User',
    property: '__get__times'
  });
};

```

Now you should be able to access \`http://localhost:3000/api/Users/me/times\` after logging in. There&#8217;s just one tiny permission issue left. Remember that you enabled any authenticated user to create a new time. The problem is that you didn&#8217;t put any restriction on the \`userId\` field, so any user can create times for any other user! Naturally, you want to disallow this. However, this is a 3-liner using [LoopBack remote hooks](http://docs.strongloop.com/display/public/LB/Remote+hooks). The easiest place to make this change is in [the \`common/models/Time.js\` file](https://github.com/vkarpov15/stopwatch-server-example/commit/27148a641c1af3b1c83ad65c456c881340325312#diff-0), which is where &#8216;Time&#8217; model configuration belongs.

```js
app.models.Time.beforeRemote('create', function(ctx, modelInstance, next) {
  ctx.args.data.userId = ctx.req.accessToken.userId;
  next();
});
```

## **Moving On**

Congratulations, you just built a full REST API with permissions and OAuth integration with 3 simple steps. Once you get familiar with LoopBack, you can generate REST APIs with minimal work. However, this is just the tip of the iceberg with LoopBack. In the next article, you&#8217;ll use the LoopBack AngularJS SDK to build AngularJS directives that will form the basis of your mobile app.

&nbsp;