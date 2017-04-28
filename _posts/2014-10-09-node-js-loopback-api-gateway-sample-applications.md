---
id: 20519
title: Getting Started with the LoopBack API Gateway Sample Application
date: 2014-10-09T08:10:31+00:00
author: Raymond Feng
guid: http://strongloop.com/?p=20519
permalink: /strongblog/node-js-loopback-api-gateway-sample-applications/
categories:
  - Community
  - How-To
  - LoopBack
---
_Note: Since the publication of this blog, the StrongLoop API Gateway was relaunched on August 5, 2015. Read **[this announcement blog](https://strongloop.com/strongblog/api-gateway-node-js/)** to learn more about the latest version._

In case you missed it, today we [announced](http://strongloop.com/strongblog/open-source-node-js-api-gateway/) the availability of the open source LoopBack API Gateway. The LoopBack API Gateway is open source and is the “minimum viable product” (MVP) that covers key use cases piloted with our co-development partners. In this blog we&#8217;ll show you how to get started with a sample application to test out the features of the gateway.

> _What&#8217;s LoopBack? It&#8217;s an open source Node.js framework for developing, managing and scaling APIs. [Learn more&#8230;](http://loopback.io/)_

## **What is an API gateway?**

An API gateway is a component within systems architecture to externalize, secure and manage APIs. The API gateway sits as an intermediary between the many consumers of APIs &#8211; API clients and the many producers of the APIs on the backend &#8211; API servers.

## **The basic features**

`loopback-gateway` is an example application to demonstrate how to build an API gateway using LoopBack. In this tutorial, we&#8217;ll build a simplified version of API gateway using LoopBack. The gateway supports basic features listed below:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">HTTPS: make sure all communication will be done with https</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">oAuth 2.0 based authentication & authorization: authenticate client applications and authorize them to access protected endpoints with approval from resource owners</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Rate limiting: controls how many requests can be made within a given time period for identified api consumers</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Reverse proxy: forward the requests to the server that hosts the api endpoint</span>
</li>

The test scenario consists of three components:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">A client application that invokes REST APIs</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">A loopback application (api gateway) that bridges the client application and the backend api</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">A loopback application (api server) serving the REST APIs</span>
</li>

The architecture is illustrated in the diagram below.

<!--more-->

<img class="aligncenter size-full wp-image-20524" src="{{site.url}}/blog-assets/2014/10/loopback-api-gateway.png" alt="loopback-api-gateway" width="910" height="507"  />

## **Build the gateway application**

The application is initially scaffolded using `slc loopback` command. We customize server/server.js to add specific features for the gateway.

## **Configure and ensure HTTPS** 

[oAuth 2.0](http://tools.ietf.org/html/rfc6749#section-10.9) states that the authorization server MUST require the use of TLS with server authentication for any request sent to the authorization and token endpoints. There are two steps involved here:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Create the https server for the application. See <a href="https://github.com/strongloop/loopback-example-ssl">https://github.com/strongloop/loopback-example-ssl</a> for more details.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Redirect incoming http requests to the https urls</span>
</li>

```js
var httpsRedirect = require('./middleware/https-redirect');
...
// Redirect http requests to https
var httpsPort = app.get('https-port');
app.use(httpsRedirect({httpsPort: httpsPort}));
```

## **Configure oAuth 2.0**

The oAuth 2.0 integration is done using `loopback-component-oauth2`.
  
In our case, we configure the API gateway as both an authorization server and resource server.

## **Set up authorization server**

The oAuth authorization server exposes the authorization endpoint to allow resource owners (users) to grant permissions to authenticated client applications. It also creates the token endpoint to issue access tokens to client applications with valid grants.

```js
var oauth2 = require('loopback-component-oauth2').oAuth2Provider(
  app, {
    dataSource: app.dataSources.db, // Data source for oAuth2 metadata persistence
    loginPage: '/login', // The login page url
    loginPath: '/login' // The login processing url
  });
```

## **Set up resource server**

To protect endpoints with oAuth 2.0, we set up middleware that checks incoming requests for an access token and validate it with the information persisted on the server when the token is issued.

```js
oauth2.authenticate(['/protected', '/api', '/me'], {session: false, scope: 'demo'});
```

## **Rate Limiting**

Rate limiting controls how many API calls can be made from client applications within a certain period of time.

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">keys: identify who is making the api call. The keys can be the client application id, the user id, the client ip address, or a combination of more than one identities.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">limit: the maximum number of requests</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">interval: the interval for the limit</span>
</li>

The sample uses a [token bucket](http://en.wikipedia.org/wiki/Token_bucket) based algorithm to enforce the rate limits based on authenticated client application ids.

```js
var rateLimiting = require('./middleware/rate-limiting');
app.use(rateLimiting({limit: 100, interval: 60000}));
```

## **Proxy**

The proxy middleware allows incoming requests to be forwarded/dispatched to other servers. In this tutorial, we&#8217;ll route /api/ to http://localhost:3002/api/. The implementation is based on [node-http-proxy](https://github.com/nodejitsu/node-http-proxy).

```js
var proxy = require('./middleware/proxy');
var proxyOptions = require('./middleware/proxy/config.json');
app.use(proxy(proxyOptions));

{
  "rules": [
    "^/api/(.*)$ http://localhost:3002/api/$1 [P]"
  ]
}
```

## **Sign up client applications and users**

oAuth 2.0 requires client applications to be registered. In this tutorial, we can simply create a new instance with the LoopBack built-in application model. The client id is 123 and the client secret is `secret`. The resource owner is basically a user. We create a user named `bob` with password `secret` for testing.

```js
function signupTestUserAndApp() {
// Create a dummy user and client app
  app.models.User.create({username: 'bob',
    password: 'secret',
    email: 'foo@bar.com'}, function(err, user) {

    if (!err) {
      console.log('User registered: username=%s password=%s',
        user.username, 'secret');
    }

    // Hack to set the app id to a fixed value so that we don't have to change
    // the client settings
    app.models.Application.beforeSave = function(next) {
      this.id = 123;
      this.restApiKey = 'secret';
      next();
    };
    app.models.Application.register(
      user.id,
      'demo-app',
      {
        publicKey: sslCert.certificate
      },
      function(err, demo) {
        if (err) {
          console.error(err);
        } else {
          console.log('Client application registered: id=%s key=%s',
            demo.id, demo.restApiKey);
        }
      }
    );

  });
}
```

## **Run the demo**

There are a few steps to run the demo application.

## **Create the api server**

```js
$ slc loopback demo-api-server
$ cd demo-api-server
$ slc loopback:model note
[?] Enter the model name: note
[?] Select the data-source to attach note to: db (memory)
[?] Expose note via the REST API? Yes
[?] Custom plural form (used to build REST URL): 
Let's add some note properties now.

Enter an empty property name when done.
[?] Property name: title
   invoke   loopback:property
[?] Property type: string
[?] Required? No

Let's add another note property.
Enter an empty property name when done.
[?] Property name: content
   invoke   loopback:property
[?] Property type: string
[?] Required? No
```

## Run the API server

```js
PORT=3002 node .
```

Open a browser and point to http://localhost:3002/explorer. Locate the &#8216;POST notes&#8217; section and add a few notes.

## **Run the gateway**

```js
node .
```

## **Test out https**

Open a browser and point to http://localhost:3000. You will see the browser to be redirected to https://localhost:3001. Please note your browser might complain about the SSL certificate as it is self-signed. It&#8217;s safe to ignore the warning and proceed.

## **Test out oAuth 2.0 and proxy**

The home page below shows multiple options to try out the oAuth 2.0 grant types. Let&#8217;s start with the [explicit flow](http://tools.ietf.org/html/rfc6749#section-4.2).

<img class="aligncenter size-full wp-image-20536" src="{{site.url}}/blog-assets/2014/10/home.png" alt="home" width="486" height="244"  />
  
Now you need to log in as the resource owner.

<img class="aligncenter size-full wp-image-20537" src="{{site.url}}/blog-assets/2014/10/login.png" alt="login" width="231" height="178" />
  
The following dialog requests permission from the resource owner (user) to approve the access by the client application.

<img class="aligncenter size-full wp-image-20538" src="{{site.url}}/blog-assets/2014/10/decision.png" alt="decision" width="491" height="292"  />
  
Click &#8220;Allow&#8221;. The browser will be redirected to the callback page.

<img class="aligncenter size-full wp-image-20539" src="{{site.url}}/blog-assets/2014/10/callback.png" alt="callback" width="1030" height="263"  />
  
The callback page builds the links with the access token. Click on &#8216;Calling /api/notes&#8217;.

<img class="aligncenter size-full wp-image-20540" src="{{site.url}}/blog-assets/2014/10/notes.png" alt="notes" width="747" height="262"  />

## **Test out rate limiting**

To test rate limiting, please run the following script which sends 150 requests to the server. The script prints out the rate limit and remaining.

```js
node server/scripts/rate-limiting-client.js
```

Test out JWT
  
We support JSON Web Token (JWT) as client authentication and authorization grant for oAuth 2.0. See <https://tools.ietf.org/html/draft-ietf-oauth-jwt-bearer-10> for more details.
  
The first command requests an access token with a JWT token signed by the private key.

```js
node server/scripts/jwt-client-auth.js
```

The second command requests an access token using a JWT token as the assertion type.

```js
node server/scripts/jwt-client-auth.js <authorization code>
```

##  **Summary** 

The open source LoopBack gateway provides key functionality that enables you to manually piece together middleware and specify your business rules through plain JavaScript hooks. The LoopBack API gateway serves as a reference implementation and will be limited to its current functionality. It currently fulfills the MVP use cases without components and policies.

We expect that complex enterprises need to manage API endpoints at runtime, using the dynamic controls and additional functionality of components and policies provided by the StrongLoop API Gateway. It will provide the commercial-grade features and performance required for top-tier enterprise API management.

## [**What’s next?**](http://strongloop.com/get-started/)

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js <a href="http://strongloop.com/node-js/loopback/">LoopBack framework</a>. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
</li>

&nbsp;