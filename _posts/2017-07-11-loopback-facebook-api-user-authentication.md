---
layout: post
title: Using LoopBack with Facebook’s Graph API for User Authentication
date: 2017-07-11
author: David Okun & Manny Guerrero
permalink: /strongblog/loopback-facebook-api-user-authentication/
categories:
  - how-to
  - tutorial
  - user authentication 

---

## Using LoopBack with Facebook’s Graph API for User Authentication

When you use LoopBack to set up your API, you can integrate it with [Passport](https://passportjs.org) to enable your application for third party logins. But what if that just doesn't cut it for you? Do you need to roll something custom-made?

In this post, we'll show you how you can use the REST connector in LoopBack to connect with the Facebook Graph API, and how you can leverage that connection for user authentication in a server application primarily for mobile clients.

You may have heard that [The SilverLogic](http://tsl.io) have made the decision to use LoopBack as a key component of their new game, [XtraPoints](https://strongloop.com/strongblog/loopback-open-source-xtra-points/). You'll be using that application as context for this post.

## Setup

To get started, create a basic LoopBack application with the `lb` command. You'll need Node.js and npm to do this, and you'll have to have run `npm install -g loopback-cli` first.

## Creating An Extended User Object

After you do this, you're going to create a new model object that extends the built-in User class. Enter `lb model` into your terminal, and follow the steps so your choices look like so:

```
? Enter the model name: FBUser
? Select the data-source to attach FBUser to: db (memory)
? Select model's base class User
? Expose FBUser via the REST API? Yes
? Custom plural form (used to build REST URL):
? Common model or server only? common
```

Then, you'll start adding some properties to this object. Here's what your final choices will look like:

```
Enter an empty property name when done.
? Property name: fullName
   invoke   loopback:property
? Property type: string
? Required? Yes
? Default value[leave blank for none]:

Let's add another FBUser property.
Enter an empty property name when done.
? Property name: email
   invoke   loopback:property
? Property type: string
? Required? Yes
? Default value[leave blank for none]:

Let's add another FBUser property.
Enter an empty property name when done.
? Property name: facebookPicUrl
   invoke   loopback:property
? Property type: string
? Required? No
? Default value[leave blank for none]:
```

This is so that the properties you need are returned from the OAuth connection with Facebook, and your LoopBack server can properly handle them.

## Setting up your Facebook Application

Next, you're going to go to https://developer.facebook.com and create a new application. Make sure you take note of the App ID you create here:

![appIDPhoto](http://i.imgur.com/myB9wIR.png)

When you are asked to choose a platform for your application, select "Other":

![selectOther](http://i.imgur.com/eG35O8k.png)

You'll then have to go to the settings for your application to enter your redirect URI. Make sure you have one of these set beforehand. This is so that, when your application goes to Facebook (or any other third party OAuth login), it knows where to return to when it's done authenticating. You'll enter that here:

![redirectURIPhoto](http://i.imgur.com/iQeRFws.png)

You're done with Facebook now! Everything else can be done from the comfort of the LoopBack CLI now.

## Setting up your REST Connector

Go back to your command line and type in `lb datasource` to add another connector. For this, you'll be adding a connector to REST Services. Your options should look like this when you're done adding it:

```
? Enter the data-source name: Facebook
? Select the connector for Facebook: REST services (supported by StrongLoop)
Connector-specific configuration:
? Base URL for the REST service:
? Default options for the request:
? An array of operation templates:
? Use default CRUD mapping: No
? Install loopback-connector-rest@^2.0 Yes
```

If you're wondering why this looks pretty barren, don't fret. After npm finishes installing the REST Connector, find your `datasources.json` file inside your `server/` directory, and go to your new datasource. The file should look like so:

```
{
  "db": {
    "name": "db",
    "localStorage": "",
    "file": "",
    "connector": "memory"
  },
  "Facebook": {
    "name": "Facebook",
    "baseURL": "",
    "crud": false,
    "connector": "rest"
  }
}
```

## Configuring your Datasource with Operations

You're going to add a new key in your Facebook datasource for operations, like so:

```
"Facebook": {
    "name": "Facebook",
    "baseURL": "",
    "crud": false,
    "connector": "rest",
    "operations" : [
    
    ]
  }
```

You're then going to add three separate operations in this array, and we'll step through them one by one.

### Exchanging your OAuth Token

The first operation will be responsible for exchanging an OAuth token from the client into an access token. Add the following to your empty array:

```
{
  "template": {
    "method": "GET",
    "url": "https://graph.facebook.com/v2.9/oauth/access_token?client_id={appId}&redirect_uri={redirectUri}&client_secret={appSecret}&code={codeParameter}",
    "headers": {
      "accept": "application/json"
    }
  },
  "functions": {
    "accessToken": [
      "appId",
      "appSecret",
      "redirectUri",
      "codeParameter"
    ]
  }
}
```

Make sure that your parameter fields here in brackets are spelled correctly, as these will be passed in via a remote method later on.

### Getting the Current User

The next operation will be responsible for retrieving the currently logged in user, so that you can get their Facebook ID. Add the following after the previous operation, in the same array:

```
{
  "template": {
    "method": "GET",
    "url": "https://graph.facebook.com/v2.9/me?access_token={accessToken}",
    "headers": {
      "accept": "application/json"
    }
  },
  "functions": {
    "me": [
      "accessToken"
    ] 
  }
}
```

Once again, take note that your parameters are spelled correctly.

### Getting your User Information

Finally, your third operation will get you some basic information about the user, now that you've properly authenticated them. Add the following after the previous two operations, in the same array:

```
{
  "template": {
    "method": "GET",
    "url": "https://graph.facebook.com/v2.9/{userId}?access_token={accessToken}&fields=id,name,picture,first_name,last_name,email",
    "headers": {
      "accept": "application/json"
    }
  },
  "functions": {
    "me": [
      "userId",
      "accessToken"
    ] 
  }
}
```

After you add these three operations, your `datasources.json` file, in its entirety, should look like so (given your filled in app secrets and tokens):

```
{
  "db": {
    "name": "db",
    "localStorage": "",
    "file": "",
    "connector": "memory"
  },
  "Facebook": {
    "name": "Facebook",
    "baseURL": "",
    "crud": false,
    "connector": "rest",
    "operations": [
      {
        "template": {
          "method": "GET",
          "url": "https://graph.facebook.com/v2.9/oauth/access_token?client_id={appId}&redirect_uri={redirectUri}&client_secret={appSecret}&code={codeParameter}",
          "headers": {
            "accept": "application/json"
          }
        },
        "functions": {
          "accessToken": [
            "appId",
            "appSecret",
            "redirectUri",
            "codeParameter"
          ]
        }
      },
      {
        "template": {
          "method": "GET",
          "url": "https://graph.facebook.com/v2.9/me?access_token={accessToken}",
          "headers": {
            "accept": "application/json"
          }
        },
        "functions": {
          "me": [
            "accessToken"
          ] 
        }
      },
      {
        "template": {
          "method": "GET",
          "url": "https://graph.facebook.com/v2.9/{userId}?access_token={accessToken}&fields=id,name,picture,first_name,last_name,email",
          "headers": {
            "accept": "application/json"
          }
        },
        "functions": {
          "me": [
            "userId",
            "accessToken"
          ] 
        }
      }
    ]
  }
}
```

If you need to take a second to breathe, we won't blame you!

## Adding a Remote Method

The last thing you'll be doing is setting up a way for this user to login to Facebook. LoopBack has a way to easily extend any model object with custom logic via adding a *remote method*.

### Back to the Command Line

In your terminal, type `lb remote-method` and enter the following for each prompt:

```
? Select the model: FBUser
? Enter the remote method name: loginWithFacebook
? Is Static? Yes
? Description for method: Allows users to login with an OAuth2 token received from Facebook
```

Most of this is variable for your use case, but make sure you select the right user model, and that the remote method will be static. Continue on with the following answers:

```
Let's configure where to expose your new method in the public REST API.
You can provide multiple HTTP endpoints, enter an empty path when you are done.
? Enter the path of this endpoint: /login-facebook
? HTTP verb: post
```

You only need to provide one endpoint, and while it is up to you what to name it, this is an example that follows convention. Moving on:

```
Describe the input ("accepts") arguments of your remote method.
You can define multiple input arguments.
Enter an empty name when you've defined all input arguments.
? What is the name of this argument? oauth-token
? Select argument's type: string
? Is this argument required? Yes
? Please describe the argument: OAuth2 token received from Facebook when logging in. Retrieved from the callback URL.
? Where to get the value from? (auto)
```

Your only argument that gets passed in will be for the token itself. Make sure all of this is correct. Hit enter, and continue on to enter information about the arguments returned from the method:

```
Describe the output ("returns") arguments to the remote method's callback function.
You can define multiple output arguments.
Enter an empty name when you've defined all output arguments.
? What is the name of this argument? result
? Select argument's type: object
? Is this argument a full response body (root)? Yes
? Please describe the argument: instance of FBUser
```

This means that the entire response will be converted into a contextualized object for you to use in your remote method. Once you do that, you'll be able to assign the returned fields to your user object. After this, hit enter once more, and the terminal will show you a code representation of the method you've created.

### Now, Who Wants to Write Some Actual JavaScript?

You'll want to add the `Bluebird` module to your `package.json` file before proceeding, so your updated file for dependencies should look something like this, specifically noting the new dependency:

```
"dependencies": {
    "bluebird": "^3.5.0",
    "compression": "^1.0.3",
    "cors": "^2.5.2",
    "helmet": "^1.3.0",
    "loopback": "^3.0.0",
    "loopback-boot": "^2.6.5",
    "loopback-component-explorer": "^4.0.0",
    "loopback-connector-rest": "^2.1.0",
    "serve-favicon": "^2.0.1",
    "strong-error-handler": "^2.0.0"
  },
```

After you update this and run `npm install`, go to your `fb-user.js` file, which you should be able to find in your `common` folder at your root directory. At first, you can copy and paste what your terminal showed you, so that your file looks like this:

```
'use strict';
var Promise = require('bluebird');

module.exports = function(Fbuser) {
    /**
     * description
     * @param {string} oauthToken token
     * @param {Function(Error, object)} callback
     */

    FBUser.loginWithFacebook = function(oauthToken, callback) {
        var result;
        // TODO
        callback(null, result);
    };

};
```

That `//TODO` part is where you'll be adding a lot of code. Take note that we've imported `bluebird` at the top. Inside your method, start like so:

```
var appID = YOUR_APP_ID_GOES_HERE;
var appSecret = 'YOUR_APP_SECRET_GOES_HERE';
var redirectUrl = 'YOUR_APP_REDIRECT_URL_GOES_HERE';

var Facebook = FBUser.app.datasources.Facebook;

let accessToken;
```

The first three vars are identifiers specific to your application - make sure you get them from your own dev console. (NB: you may want to consider using environment variables for these so you don't put your code at a security risk.) 

The next var is simply getting a hold of the class you need to work with the correct datasource. Finally, you create a buffer for your access token when you receive it later.

Next, make use of the operation you wrote earlier to get an access token and exchange it for an OAuth token:

```
Facebook.accessToken(appId, appSecret, redirectUrl, oauthToken)
.then(function(response) {
  // retrieve access token from response
  accessToken = response['access_token'];
  // get current user
  return Facebook.me(accessToken);
})
```

All that command line work paid off, didn't it? Next, get the user ID for the logged in user, and get their info:

```
.then(function(response) {
  // get Facebook ID
  var facebookId = response['id'];
  // retrieve user info
  return Facebook.user(facebookId, accessToken);
})
```

Lastly, we're going to collect all the data we get from our last call, and return the requisite data via the callback we get at the end:

```
.then(function(response) {
  var fullName = response['first_name'] + ' ' + response['last_name'];
  var email = response['email'];
  var pictureDictionary = response['picture'];
  var pictureData = pictureDictionary['data'];
  var facebookPicUrl = pictureData['url'];
  callback(null, {'fullName': fullname,
                  'email': email,
                  'facebookPicUrl': facebookPicUrl});
})
.catch(function(error) {
  callback(error, null);
});
```

Whew! In the end, it all ties into the original model object you created, so you get the properties you need at the end. When you've done all of this by following these steps, your `fb-user.js` file should look more or less like this:

```
'use strict';
var Promise = require('bluebird');

module.exports = function(Fbuser) {
    /**
     * description
     * @param {string} oauthToken token
     * @param {Function(Error, object)} callback
     */

    FBUser.loginWithFacebook = function(oauthToken, callback) {
      var result;
      var appID = YOUR_APP_ID_GOES_HERE;
      var appSecret = 'YOUR_APP_SECRET_GOES_HERE';
      var redirectUrl = 'YOUR_APP_REDIRECT_URL_GOES_HERE';

      var Facebook = FBUser.app.datasources.Facebook;

      let accessToken;
      Facebook.accessToken(appId, appSecret, redirectUrl, oauthToken)
	   .then(function(response) {
		  // retrieve access token from response
   	     accessToken = response['access_token']; 
		  // get current user
		  return Facebook.me(accessToken);
		})
		.then(function(response) {
         // get Facebook ID
         var facebookId = response['id'];
         // retrieve user info
         return Facebook.user(facebookId, accessToken);
       })
       .then(function(response) {
         var fullName = response['first_name'] + ' ' + response['last_name'];
         var email = response['email'];
         var pictureDictionary = response['picture'];
         var pictureData = pictureDictionary['data'];
         var facebookPicUrl = pictureData['url'];
         callback(null, {'fullName': fullname,
                            'email': email,
                   'facebookPicUrl': facebookPicUrl});
       })
       .catch(function(error) {
         callback(error, null);
       });
    };
};
```

## You're Finished!!

Now, when you login to XtraPoints with Facebook, you know what's happening behind the scenes! If you want to try a demo of this, you can go clone [this](https://github.com/silverlogic/custom-facebook-auth) repository to try it out.

Interested in trying LoopBack for your own RESTful API needs? Check out [this](https://developer.ibm.com/apiconnect/2017/03/09/loopback-in-5-minutes/) blog post to get started in 5 minutes!
