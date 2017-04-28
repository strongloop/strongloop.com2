---
id: 16847
title: Announcing Support for Google, Facebook and GitHub Authentication in LoopBack
date: 2014-06-03T08:37:53+00:00
author: Raymond Feng
guid: http://strongloop.com/?p=16847
permalink: /strongblog/authenticate-loopback-google-facebook-github/
categories:
  - Community
  - LoopBack
---
## **Introduction**

These days most people have dozens of logins, and no one really wants to register for yet another website or app.  It’s easier to attract new users by allowing them to login with an existing account from a popular service such as Google or Facebook, for example.  Additionally, enterprise applications often need to work with existing authentication and identity systems such as LDAP, kerberos, and SAML.

We’re excited to announce that the [LoopBack API framework](http://loopback.io/) now supports:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Third-party login, to enable your LoopBack apps to allow login using existing accounts on Facebook, Google, Twitter, or Github.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Integration with enterprise security services so that users can login with them instead of username and password-based authentication.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Account linking to link an account authorized through one of the above services with a LoopBack application user record.  This enables you to manage and control your own user account records while still integrating with third-party services.</span>
</li>

What&#8217;s [LoopBack](http://loopback.io/)? It&#8217;s an open source API framework powered by Node.js for connecting devices and apps to enterprise data and services.

These new capabilities are provided through the [`loopback-passport`](https://github.com/strongloop/loopback-passport) module that integrates [LoopBack](http://loopback.io/) and [Passport](http://passportjs.org/), one of the leading modules for Node authentication middleware.

## **LoopBack authentication and authorization**

LoopBack already provides full-featured support for managing users and client applications. The LoopBack user and application models enable applications to easily:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Sign up a new user</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Log in using username/email and password</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Log out</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Verify a user registration by email</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Sign up a new client application</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Authenticate a client application by ID and keys</span>
</li>

Like other models, the user and application models can be backed by any of the databases supported by LoopBack connectors ([Oracle](http://docs.strongloop.com/display/LB/Oracle+connector), [MySQL](http://docs.strongloop.com/display/LB/MySQL+connector), [PostgreSQL](http://docs.strongloop.com/display/LB/PostgreSQL+connector), [MongoDB](http://docs.strongloop.com/display/LB/MongoDB+connector), [SQL Server](http://docs.strongloop.com/display/LB/SQL+Server+connector) and [others](http://docs.strongloop.com/display/LB/Data+sources+and+connectors)). Thus, a LoopBack application can easily serve APIs to clients on behalf of authenticated users.<!--more-->

## **The loopback-passport module**

The loopback-passport module has the following key components:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><code>UserIdentity</code> model &#8211; keeps track of third-party login profiles</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><code>UserCredential model</code> &#8211; stores credentials from a third-party provider to represent users’ permissions and authorizations.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><code>ApplicationCredential</code> model &#8211; stores credentials associated with a client application</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><code>PassportConfigurator</code> &#8211; bridge between LoopBack and Passport.</span>
</li>

## **UserIdentity model**

The `UserIdentity` model keeps track of third-party login profiles. Each user identity is uniquely identified by provider and externalId. The `UserIdentity` model comes with a &#8216;belongsTo&#8217; relation to the User model.
  
Properties of the `UserIdentity` model are:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><code>{String} provider</code>: The auth provider name, such as facebook, google, twitter, linkedin</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><code>{String} authScheme</code>: The auth scheme, such as oAuth, oAuth 2.0, OpenID, OpenID Connect</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><code>{String} externalId</code>: The provider specific user id</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><code>{Object} profile</code>: The user profile, see <a href="http://passportjs.org/guide/profile">http://passportjs.org/guide/profile</a> </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><span style="font-size: 18px;"><code>{Object} credentials</code></span></span> <ul>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;"><code>oAuth</code>: token, tokenSecret</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;"><code>oAuth 2.0</code>: accessToken, refreshToken</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;"><code>OpenID</code>: openId</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;"><code>OpenID Connect</code>: accessToken, refreshToken, profile</span>
    </li>
  </ul>
</li>

<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><code>{*} userId</code>: The LoopBack user id</span>
</li>
<li style="margin-left: 2em;">
  <code><code><span style="font-size: 18px;"><code>{Date} created</code>: The created date</span></code></code>
</li>
<li style="margin-left: 2em;">
  <code><code><code><code><span style="font-size: 18px;"><code>{Date} modified</code>: The last modified date</span></code></code></code></code>
</li>

<h2 dir="ltr">
  UserCredential model
</h2>

`UserCredential` has the same set of properties as `UserIdentity`. It&#8217;s used to store the credentials from a third party authentication/authorization provider to represent the permissions and authorizations of a user in the third-party system.

<h2 dir="ltr">
  ApplicationCredential model
</h2>

Interacting with third-party systems often requires client application level credentials. For example, you need oAuth 2.0 client ID and client secret to call Facebook APIs. Such credentials can be supplied from a configuration file to your server globally. But if your server accepts API requests from multiple client applications, each client application should have its own credentials. To support the multi-tenancy, this module provides the `ApplicationCredential` model to store credentials associated with a client application.
  
Properties of the `ApplicationCredential` model are:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><code>{String} provider</code>: The auth provider name, such as facebook, google, twitter, linkedin</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><code>{String} authScheme</code>: The auth scheme, such as oAuth, oAuth 2.0, OpenID, OpenID Connect</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><span style="font-size: 18px;"><code>{Object} credentials</code>: The provider specific credentials</span></span> <ul>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;"><code>openId</code>: {returnURL: String, realm: String}</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;"><code>oAuth2</code>: {clientID: String, clientSecret: String, callbackURL: String}</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;"><code>oAuth</code>: {consumerKey: String, consumerSecret: String, callbackURL: String}</span>
    </li>
  </ul>
</li>

<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><code>{Date} created</code>: The created date</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><code>{Date} modified</code>: The last modified date</span>
</li>

`ApplicationCredential` model comes with a &#8216;belongsTo&#8217; relation to the `Application` model.

<h2 dir="ltr">
  PassportConfigurator
</h2>

`PassportConfigurator` is the bridge between LoopBack and Passport. It provides the following functionality:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Sets up models with LoopBack</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Initializes passport</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Creates Passport strategies from provider configurations</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Sets up routes for authorization and callback</span>
</li>

&nbsp;

<h2 dir="ltr">
  Architectural diagram
</h2>

<img class="aligncenter" alt="" src="https://lh4.googleusercontent.com/uOkq9yzcT8PnT4dMgZua9qxFMwfqPt3nu_iD6G391TG2QZryaLGxqx4uFW74U7fRhTXgJZ4G-S5sG6GtnB_-_Jc15kUGjWClk1SywU5YiuVAOYMXqCrTyzTaxWPIBpAlZg" width="624px;" height="361px;" />

<h2 dir="ltr">
  Flows: Third-party login
</h2>

The following steps use Facebook oAuth 2.0 login as an example.

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">A visitor requests to log in using Facebook by clicking on a link or button backed by LoopBack to initiate oAuth 2.0 authorization.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">LoopBack redirects the browser to Facebook&#8217;s authorization endpoint so the user can log into Facebook and grant permissions to LoopBack</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Facebook redirects the browser to a callback URL hosted by LoopBack with the oAuth 2.0 authorization code</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">LoopBack makes a request to the Facebook token endpoint to get an access token using the authorization code</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">LoopBack uses the access token to retrieve the user&#8217;s Facebook profile</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">LoopBack searches the <code>UserIdentity</code> model by (provider, externalId) to see there is an existing LoopBack user for the given Facebook id</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">If yes, set the LoopBack user to the current context</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">If not, create a LoopBack user from the profile and create a corresponding record in <code>UserIdentity</code> to track the 3rd party login. Set the newly created user to the current context.</span>
</li>

<h2 dir="ltr">
  Flows: Third-party account linking flow
</h2>

The following steps use Facebook oAuth 2.0 login as an example.

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">The user log into LoopBack first directly or through third party login</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">The user clicks on a link or button by LoopBack to kick off oAuth 2.0 authorization code flow so that the user can grant permissions to LoopBack</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Perform the same steps 2-5 as third party login</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">LoopBack searches the <code>UserCredential</code> model by (provider, externalId) to see there is an existing LoopBack user for the given Facebook id</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Link the Facebook account to the current user by creating a record in the <code>UserCredential</code> model to store the Facebook credentials, such as access token</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Now the LoopBack user wants to get a list of pictures from the linked Facebook account(s). LoopBack can look up the Facebook credentials associated with the current user and use them to call Facebook APIs to retrieve the pictures.</span>
</li>

## **Use the module with a LoopBack application**

A demo application is built with this module to showcase how to use the APIs with a LoopBack application. The code is available at:
  
<https://github.com/strongloop-community/loopback-example-passport>

<h2 dir="ltr">
  Configure third-party providers
</h2>

The following example shows two providers: facebook-login for login with facebook and google-link for linking your Google accounts with the current LoopBack user.

```js
{
 "facebook-login": {
   "provider": "facebook",
   "module": "passport-facebook",
   "clientID": "{facebook-client-id-1}",
   "clientSecret": "{facebook-client-secret-1}",
   "callbackURL": "http://localhost:3000/auth/facebook/callback",
   "authPath": "/auth/facebook",
   "callbackPath": "/auth/facebook/callback",
   "successRedirect": "/auth/account",
   "scope": ["email"]
 },
 ...
 "google-link": {
   "provider": "google",
   "module": "passport-google-oauth",
   "strategy": "OAuth2Strategy",
   "clientID": "{google-client-id-2}",
   "clientSecret": "{google-client-secret-2}",
   "callbackURL": "http://localhost:3000/link/google/callback",
   "authPath": "/link/google",
   "callbackPath": "/link/google/callback",
   "successRedirect": "/link/account",
   "scope": ["email", "profile"],
   "link": true
 }
}
```

The authentication scheme or protocol for a given provider can be specified using the ‘authScheme’ property. The value can be ‘local’, ‘oAuth 2.0’, ‘oAuth’, or ‘OpenID’. For example, to use twitter oAuth 1.x, the provider can be configured as follows:

```js
"twitter-login": {

     "provider": "twitter",
     "authScheme": "oauth",
     "module": "passport-twitter",
     "callbackURL": "http://localhost:3000/auth/twitter/callback",
     "authPath": "/auth/twitter",
     "callbackPath": "/auth/twitter/callback",
     "successRedirect": "/auth/account",
     "consumerKey": "{twitter-consumer-key}",
     "consumerSecret": "{twitter-consumer-secret}"

 }
```

Please be aware that you&#8217;ll need to register with Facebook and Google to get your own client ID and client secret.

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Facebook: <a href="https://developers.facebook.com/apps">https://developers.facebook.com/apps</a></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Google: <a href="https://console.developers.google.com/project">https://console.developers.google.com/project</a></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Twitter: <a href="https://twitter.com/settings/applications">https://twitter.com/settings/applications</a></span>
</li>

<h2 dir="ltr">
  <strong>Add code snippets to app.js</strong>
</h2>

&nbsp;

```js
var loopback = require('loopback');
var path = require('path');
var app = module.exports = loopback();
// Create an instance of PassportConfigurator with the app instance
var PassportConfigurator = require('loopback-passport').PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);

app.boot(__dirname);
...
// Enable http session
app.use(loopback.session({ secret: 'keyboard cat' }));

// Load the provider configurations
var config = {};
try {
 config = require('./providers.json');
} catch(err) {
 console.error('Please configure your passport strategy in `providers.json`.');
 console.error('Copy `providers.json.template` to `providers.json` and replace the clientID/clientSecret values with your own.');
 process.exit(1);
}
// Initialize passport
passportConfigurator.init();

// Set up related models
passportConfigurator.setupModels({
 userModel: app.models.user,
 userIdentityModel: app.models.userIdentity,
 userCredentialModel: app.models.userCredential
});
// Configure passport strategies for third party auth providers
for(var s in config) {
 var c = config[s];
 c.session = c.session !== false;
 passportConfigurator.configureProvider(s, c);
}
```

## **What’s next?**

  * Install LoopBack with a [simple npm command](http://strongloop.com/get-started/)
  * Visit the [Loopback.io](http://www.loopback.io) project page for docs and tutorials
  * Learn more about [Passport](http://passportjs.org/guide)
  * Need performance monitoring, profiling and cluster capabilities for your Node apps? Check out [StrongOps](http://strongloop.com/node-js-performance/strongops/)!

&nbsp;