---
layout: post
title: Serving a Progressive Web App from LoopBack
date: 2018-03-30
author: Bradley Holt
permalink: /strongblog/serving-a-progressive-web-app-from-loopback/
categories:
  - How-To
  - LoopBack
---

With the emergence of Progressive Web Apps and browser APIs such as persistent storage, payments, geolocation, and push notifications, it is now possible to build almost fully-featured mobile apps on the web platform. LoopBack makes a great backend web and API server for a frontend Progressive Web App. This post demonstrates how you can serve a Progressive Web App from LoopBack that:

- ⚙️ Uses a [Service Worker](https://developers.google.com/web/ilt/pwa/introduction-to-service-worker) to enable the app to work whether or not the end user's device has an internet connection (this is what is referred to as an [Offline First](http://offlinefirst.org/) approach)
- 📱 Contains a [web app manifest](https://developers.google.com/web/fundamentals/web-app-manifest/) to control how the app is experienced by end users
- 🔐 Is served over [HTTPS](https://developers.google.com/web/fundamentals/security/encrypt-in-transit/why-https) for security
- 🚀 Is served over [HTTP/2](https://developers.google.com/web/fundamentals/performance/http2/) for performance
- 💯 Scores 100s in all categories within the [Lighthouse](https://developers.google.com/web/tools/lighthouse/) web app audit tool

<!--more-->

{% include tip.html content="[IBM API Connect](https://developer.ibm.com/apiconnect/) builds on the open source LoopBack framework and provides robust management and security options.
" %}

## Background and Motivation

### What is a Progressive Web App?

A Progressive Web App is a web app that gains more and more app-like capabilities the more often you use it. You browse to a Progressive Web App just like any other website. As you continue to use the web app, it gains additional native-app-like capabilities. For example, a Progressive Web App could be installed to your home screen or send you alerts and notifications. Progressive Web Apps combine the discoverability of web apps with the power of native mobile apps.

One important aspect of Progressive Web Apps is the concept of building your web app to be [Offline First](http://offlinefirst.org/). With an Offline First approach, you design your web app for the most resource-constrained environment first. This approach provides a consistent user experience whether the user’s device has no connectivity, limited connectivity, or great connectivity. One of the biggest benefits of Offline First Progressive Web Apps is that they can be very fast, as they provide zero-latency access to content and data stored directly on the device.

#### ⚙️ Service Workers

[Service Workers](https://developers.google.com/web/ilt/pwa/introduction-to-service-worker) are a key browser technology that enables Offline First Progressive Web Apps. Service Workers give web developers fine-grained control over caching of URL-addressable content and assets. A Service Worker intercepts requests under a certain scope, meaning under a certain URL path. Any network requests that go to a URL under scope will instead be routed through the Service Worker. This gives you the opportunity to intercept those requests, and instead of those requests going to the network, replying to the request with a response stored in a local cache. This is called a cache-first approach, where a local cache is preferred over the network.

#### 📱 Web App Manifest

A [web app manifest](https://developers.google.com/web/fundamentals/web-app-manifest/) enables web developers to control how a Progressive Web App is experienced by end users. Some of the common metadata attributes in a web app manifest include:

- A `name` for when the user is prompted to install the Progressive Web App
- A `short_name` for when the app is installed to the user's home screen
- A `description` of the purpose of the app
- The `lang`, or primary language of the web app manifest attributes
- The `start_url`, or starting URL that the app would prefer the user agent loads when launching the app
- A `display` setting which sets how the app should be presented within the context of the user's operating system (`fullscreen`, `standalone`, `minimal-ui`, or `browser`)
- A `theme_color`, or default theme color for the app's browsing context
- The `background_color`, or expected background color to use while the app is loading
- One or more `icons`, or iconic representations of the app

#### 🔐 HTTPS

Most browser features that support Progressive Web Apps [require that the app is served over HTTPS](https://developers.google.com/web/fundamentals/security/encrypt-in-transit/why-https). There are a number of reasons for this including:

- HTTPS ensures that the app is served from a trusted source that can be verified through the app's SSL/TLS certificate. This is especially important when the app requests access to device APIs such as geolocation.
- Content requests/responses, form submissions, and API requests/responses are encrypted, giving the end user better privacy and security.
- Information sent from the client to the server collected from device APIs is encrypted.

{% include tip.html content="[Does my site need HTTPS?](https://doesmysiteneedhttps.com/) is a website documenting a number of other reasons why you should serve your web app over HTTPS.
" %}

#### 🚀 HTTP/2

While not strictly required, [serving a Progressive Web App over HTTP/2](https://developers.google.com/web/fundamentals/performance/http2/) is considered a best practice as it provides a number of performance benefits. Web developers have come up with a number of hacks over the years for increasing performance of web apps such as inlining CSS/JavaScript, minification of assets, and image sprites. With HTTP/2 these hacks are no longer needed! HTTP/2 is the first new version of the HTTP protocol since 1997. Some of the improvements in HTTP/2 over HTTP/1.1:

- HTTP/2 is a binary protocol, which makes it faster. However, HTTP/2 maintains the same semantics as HTTP/1.1.
- HTTP/2 includes the ability to push content from the server to the client that was not requested by the client.
- HTTP/2 can multiplex requests and responses, as well as prioritize requests and perform header compression.

{% include note.html content="All major browsers only support HTTP/2 over HTTPS, effectively making HTTPS mandatory for HTTP/2.
" %}

### Finding Your Way with Lighthouse

{% include image.html file='lighthouse-logo.png' alt='Lighthouse logo' %}

If you want to make a web app that is a Progressive Web App then there are a number of requirements, recommendations, and best practices to follow. I've mentioned a few of these including using a Service Worker (required), having a web app manifest (required), serving over HTTPS (required), and serving over HTTP/2 (best practice).

{% include image.html file='lighthouse-audit-report-scoring-100s.png' alt='Lighthouse audit report showing scores of 100 in the categories of performance, Progressive Web App, accessibility, best practices, and SEO' caption='Lighthouse audit report for a Progressive Web App served from LoopBack with scores of 100 in the categories of performance, Progressive Web App, accessibility, best practices, and SEO.' %}

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) is an open source tool that can run an audit against your web app and give you guidance in a number of different categories. Lighthouse is available in Chrome DevTools to quickly perform an audit against any URL, from the command line so that you can run Lighthouse via shell scripts, or as a Node.js module so that you can integrate Lighthouse into your continuous integration process. This post demonstrates how you can serve a Progressive Web App from LoopBack that scores 100s in all Lighthouse categories (performance, Progressive Web App, accessibility, best practices, and SEO).

### LoopBack and Progressive Web Apps: BFFs

Progressive Web Apps are frontend web apps that can work independent of a network connection. Once the initial requests have been made for the web app, and all of its content, assets, and data have been cached or stored locally in the user's browser, then the frontend web app can work completely independent of the backend web server. However, this doesn't mean that a Progressive Web App never checks back in with the backend web server. There are a number of potential interactions between a frontend Progressive Web App and a backend web server after the initial requests and responses including:

- Getting new content and reference data from the backend web server when a connection is available
- Sync'ing data collected on the user's device with the backend web server when a connection is available
- Queuing up API requests to send to the backend web server when a connection is available

This is where LoopBack comes in. LoopBack combined with a Progressive Web App is an example of the [backend for frontend (BFF) pattern](https://youtu.be/iOFtTLPTbWc). Rather than have separate teams work on the backend and the frontend apps, with the BFF pattern the same team works on both the backend and the frontend together. Your team would still have both backend and frontend developers, but they would work closely together towards the same goals. Another aspect of the BFF pattern is that the backend and frontend codebases are written in the same language. By using LoopBack to serve a Progressive Web App this gives you a backend for frontend (BFF) architecture where:

- The backend and the frontend apps are both written in JavaScript
- The backend and the frontend apps share a single codebase (though for more complex apps it could make sense to separate the codebases)
- The backend and the frontend apps can share models and APIs (known as [isomorphic LoopBack](https://loopback.io/doc/en/lb3/LoopBack-in-the-client.html))

## Quick Start

The \"tutorial\" section includes detailed instructions for creating a Progressive Web App served from LoopBack. This "quick start" section provides instructions for getting a pre-built copy of this app up and running quickly.

Install Node.js if it is not already installed:

* [Download Node.js](https://nodejs.org/en/download/) or
* [Install Node.js via a package manager](https://nodejs.org/en/download/package-manager/)

TK: Create the `loopback-pwa` repository.

Clone or download the [`loopback-pwa`](https://github.com/ibm-watson-data-lab/loopback-pwa) repository from GitHub.

Change in to the `loopback-pwa` directory:

```bash
$ cd loopback-pwa
```

Install npm dependencies:

```bash
$ npm install
```

Make a `server/private` directory for the private key and the certificate:

```bash
$ mkdir server/private
```

Run the `generate-key` script to generate a new private key:

```bash
$ npm run generate-key
```

Run the `generate-cert` script to generate a new self-signed certificate:

```bash
$ npm run generate-cert
```

Alternatively, run the `generate-csr` script to generate a new certificate signing request to send to a certificate authority:

```bash
$ npm run generate-csr
```

Optionally, install the self-signed certificate (`server/private/localhost.cert.pem`) as trusted by your computer. The steps needed for this will vary by operating system. If you skip this step then your web browser will warn you that the certificate is not trusted and Lighthouse will fail your app on several audits.

{% include tip.html content="[Let's Encrypt](https://letsencrypt.org/) is a free certificate authority that you can use when you deploy your app to production. The [`letsencrypt-express`](https://www.npmjs.com/package/letsencrypt-express) package can be used to manage Let's Encrypt certificates within Express apps and should work equally well for LoopBack apps.
" %}

Run the LoopBack app:

```bash
$ node .
```

Go to [https://localhost:8443/](https://localhost:8443/) in Google Chrome. In Google Chrome open DevTools by selecting "View" → "Developer" → "Developer Tools". Select the "Audits" tab in Chrome DevTools. Hit the "Perform an audit…" button. Ensure that all of the audit categories are selected and hit the "Run audit" button.

{% include important.html content="If you do not install the self-signed certificate as trusted by your computer then Google Chrome will warn you that the certificate is not trusted and Lighthouse will fail your app on several audits.
" %}

The Lightouse audit results should be almost perfect scores in all categories at this point. However, under the Progressive Web App category Lighthouse will indicate that the app "Does not redirect HTTP traffic to HTTPS." Lighthouse may also indicate that the app "Does not provide fallback content when JavaScript is not available." This audit should pass, but fails as a result of the "Does not redirect HTTP traffic to HTTPS" audit failing.

The app does, in fact, redirect HTTP traffic to HTTPS. However, Lighthouse doesn't know to look for the HTTP version on the non-standard port 8080. To achieve a perfect score in Lighthouse, temporarily change the `httpPort` and `port` values in `server/config.json` to the standard values for HTTP and HTTPS respectively:

```js
"httpPort": 80,
"port": 443,
```

You will then need to start LoopBack using `sudo`, as ports below 1024 are privileged ports, entering your system password when prompted:

```bash
$ sudo node .
```

{% include warning.html content="Starting LoopBack using `sudo` is _not_ a recommended practice.
" %}

Go to [https://localhost/](https://localhost/) in Google Chrome (no port number is needed as port 443 is the standard port for HTTPS). In Google Chrome open DevTools and run a Lighthouse audit again with all categories selected.

The Lightouse audit results should be all perfect scores in all categories now! The previously-failing "Does not redirect HTTP traffic to HTTPS" and "Does not provide fallback content when JavaScript is not available" audits should now be passing.

Change the `httpPort` and `port` values in `server/config.json` back to their previous settings:

```js
"httpPort": 8080,
"port": 8443,
```

From now on when you start LoopBack do _not_ use `sudo`:

```bash
$ node .
```

## Tutorial

### Generating the LoopBack App

Install the [LoopBack command-line interface (CLI) tool](https://github.com/strongloop/loopback-cli) (if you don't already have it installed):

```bash
$ npm install -g loopback-cli
```

{% include note.html content="The `$` in the above instruction (and in all subsequent examples) indicates the start of a command prompt in a terminal. Do not type the leading `$` into your command prompt.
" %}

Run the LoopBack [application generator](https://loopback.io/doc/en/lb3/Application-generator):

```bash
$ lb
```

{% include note.html content="Alternative [command line tools](https://loopback.io/doc/en/lb3/Command-line-tools.html) to the LoopBack CLI (`lb`) include the IBM API Connect developer toolkit (`apic`) or the legacy StrongLoop tool (`slc`).
" %}

Use `loopback-pwa` as the name of your application:

```
? What's the name of your application? () loopback-pwa
```

Hit enter to use the default value of `loopback-pwa` as the name of the directory to contain the project:

```
? Enter name of the directory to contain the project: (loopback-pwa)
```

Select `3.x` as the version of LoopBack to use:

```
? Which version of LoopBack would you like to use? (Use arrow keys)
  2.x (long term support)
❯ 3.x (current)
```

Select `api-server` as the kind of application:

```
? What kind of application do you have in mind?
❯ api-server (A LoopBack API server with local User auth)
  empty-server (An empty LoopBack API, without any configured models or datasources)
  hello-world (A project containing a controller, including a single vanilla Message and a single remote method)
  notes (A project containing a basic working example, including a memory database)
```

Once it has completed its work, the LoopBack application generator will provide output similar to the following (truncated for succinctness):

```
I'm all done. Running npm install for you to install the required dependencies. If this fails, try running the command yourself.


Next steps:

  Change directory to your app
    $ cd loopback-pwa

  Create a model in your app
    $ lb model

  Run the app
    $ node .

The API Connect team at IBM happily continues to develop,
support and maintain LoopBack, which is at the core of
API Connect. When your APIs need robust management and
security options, please check out http://ibm.biz/tryAPIC
```

### Serving Static Files from LoopBack

Delete the file `server/boot/root.js`, which is the default root route handler.

In `server/middleware.json`, define static middleware to serve files in the `client` directory. Replace:

```js
"files": {},
```

With:

```js
"files": {
  "loopback#static": {
    "params": "$!../client"
  }
},
```

Delete the file `client/README.md`.

Create a `client/index.html` file with the following initial contents:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="description" content="A Progressive Web App served from LoopBack.">
    <title>LoopBack Progressive Web App</title>
  </head>
  <body>
    <h1>LoopBack Progressive Web App</h1>
    <p>A Progressive Web App served from LoopBack.</p>
  </body>
</html>
```


### Creating a Service Worker

Create a `client/sw.js` Service Worker file with the following contents:

```js
var cacheName = 'v1';

var filesToCache = [
  './',
  './index.html',
];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(cacheName)
    .then(function(cache) {
      return cache.addAll(filesToCache)
        .then(function() {
          self.skipWaiting();
        });
      }));
});

self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys()
    .then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName)
          return caches.delete(key);
      }));
  }));
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  e.respondWith(caches.match(e.request)
    .then(function(response) {
      return response || fetch(e.request)
        .then(function (resp) {
          return caches.open(cacheName)
            .then(function(cache){
              cache.put(e.request, resp.clone());
              return resp;
          })
        }).catch(function(event){
          console.log('Error in Service Worker fetch event!');
        })
      })
  );
});
```

Add the following JavaScript _within_ the `<head>` section of the `client/index.html` file:

```html
<script type="text/javascript">
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
    .then(function(reg) {
      console.log('Service Worker registration succeeded.');
    }).catch(function(error) {
      console.log('Service Worker registration failed with ' + error);
    });
  }
</script>
```

### Creating a Manifest File

Remove the default LoopBack favicon by deleting the following from `server/middleware.json`:

```js
  "initial:before": {
    "loopback#favicon": {}
  },
```

Create the following app icon files (I generated these from a `client/icons/icon.svg` file):

- `client/icons/icon-192x192.png`
- `client/icons/icon-512x512.png`

Create a `client/manifest.json` file with the following contents:

```js
{
  "name": "LoopBack Progressive Web App",
  "short_name": "LoopBack PWA",
  "description": "A Progressive Web App served from LoopBack.",
  "lang": "en-US",
  "start_url": "./",
  "display": "standalone",
  "theme_color": "#2d74da",
  "background_color" : "#e1ebf7",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

Add the following metadata _within_ the `<head>` section of the `client/index.html` file:

```html
<meta name="theme-color" content="#2d74da">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="manifest" href="/manifest.json">
<link rel="icon" type="image/png" sizes="192x192"  href="/icons/icon-192x192.png">
<link rel="icon" type="image/png" sizes="512x512"  href="/icons/icon-512x512.png">
```

Add the web app manifest (`manifest.json`) and the icons (`icons/icon-192x192.png`, `icons/icon-512x512.png`) to the list of files to cache within the `client/sw.js` Service Worker file:

```js
var filesToCache = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
];
```

### Configuring HTTPS and HTTP/2

#### Generating a Certificate

Create a `server/localhost.conf` OpenSSL certificate request template file with the following contents:

```
[ req ]

default_bits        = 2048
default_keyfile     = server/private/localhost.key.pem
distinguished_name  = subject
req_extensions      = req_ext
x509_extensions     = x509_ext
string_mask         = utf8only

[ subject ]

countryName                 = Country Name (2 letter code)
countryName_default         = US

stateOrProvinceName         = State or Province Name (full name)
stateOrProvinceName_default = New York

localityName                = Locality Name (eg, city)
localityName_default        = Armonk

organizationName            = Organization Name (eg, company)
organizationName_default    = IBM

commonName                  = Common Name (e.g. server FQDN or YOUR name)
commonName_default          = LoopBack PWA (localhost)

emailAddress                = Email Address
emailAddress_default        = bradley.holt@us.ibm.com

[ x509_ext ]

subjectKeyIdentifier   = hash
authorityKeyIdentifier = keyid,issuer

basicConstraints       = CA:FALSE
keyUsage               = digitalSignature, keyEncipherment
subjectAltName         = @alternate_names
nsComment              = "OpenSSL Generated Certificate"

[ req_ext ]

subjectKeyIdentifier = hash

basicConstraints     = CA:FALSE
keyUsage             = digitalSignature, keyEncipherment
subjectAltName       = @alternate_names
nsComment            = "OpenSSL Generated Certificate"

[ alternate_names ]

DNS.1       = localhost
DNS.2       = localhost.localdomain
DNS.3       = 127.0.0.1

# IPv4 localhost
IP.1        = 127.0.0.1

# IPv6 localhost
IP.2        = ::1
```

Add scripts to `package.json` for generating private keys, self-signed certificates, and certificate signing requests, as well as for printing certificates and certificate signing requests:

```js
"scripts": {
  "lint": "eslint .",
  "start": "node .",
  "posttest": "npm run lint && nsp check",
  "generate-key": "openssl genrsa -out server/private/localhost.key.pem 2048",
  "generate-cert": "openssl req -config server/localhost.conf -new -x509 -sha256 -nodes -key server/private/localhost.key.pem -days 365 -out server/private/localhost.cert.pem",
  "generate-csr": "openssl req -config server/localhost.conf -new -sha256 -nodes -key server/private/localhost.key.pem -days 365 -out server/private/localhost.req.pem",
  "print-cert": "openssl x509 -in server/private/localhost.cert.pem -text -noout",
  "print-csr": "openssl req -in server/private/localhost.req.pem -text -noout"
},
```

{% include note.html content="The `lint`, `start`, and `posttest` scripts should be there already and do not need to be modified. Add the `generate-key`, `generate-cert`, `generate-csr`, `print-cert`, and `print-csr` scripts.
" %}

Make a `server/private` directory for the private key and the certificate:

```bash
$ mkdir server/private
```

Run the `generate-key` script to generate a new private key:

```bash
$ npm run generate-key
```

Run the `generate-cert` script to generate a new self-signed certificate:

```bash
$ npm run generate-cert
```

Alternatively, run the `generate-csr` script to generate a new certificate signing request to send to a certificate authority:

```bash
$ npm run generate-csr
```

Optionally, install the self-signed certificate (`server/private/localhost.cert.pem`) as trusted by your computer. The steps needed for this will vary by operating system. If you skip this step then your web browser will warn you that the certificate is not trusted and Lighthouse will fail your app on several audits.

{% include tip.html content="[Let's Encrypt](https://letsencrypt.org/) is a free certificate authority that you can use when you deploy your app to production. The [`letsencrypt-express`](https://www.npmjs.com/package/letsencrypt-express) package can be used to manage Let's Encrypt certificates within Express apps and should work equally well for LoopBack apps.
" %}

#### Configuring LoopBack to Use HTTPS and HTTP/2

Create an SSL config `server/ssl-config.js` file with the following contents:

```js
var path = require('path');
var fs = require('fs');

exports.privateKey = fs.readFileSync(path.join(__dirname, './private/localhost.key.pem')).toString();
exports.certificate = fs.readFileSync(path.join(__dirname, './private/localhost.cert.pem')).toString();
```

Install the [`spdy`](https://github.com/spdy-http2/node-spdy) package which will enable the app to create an HTTP/2 server:

```bash
$ npm install spdy
```

{% include note.html content="The app could instead use the built-in `https` module. However, this would only enable HTTPS and _not_ HTTP/2 as well. Using HTTP/2 is a best practice for Progressive Web Apps.
" %}

In `server/config.json` change the `host` and the `port` values:

```js
"host": "localhost",
"port": 8443,
```

Update `server/server.js` accordingly to use the `spdy` module and enable HTTP/2 and HTTPS:

```js
'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var https = require('spdy');
var sslConfig = require('./ssl-config');

var app = module.exports = loopback();

app.start = function() {
  var httpsOptions = {
    key: sslConfig.privateKey,
    cert: sslConfig.certificate,
  };
  // start the HTTPS web server
  return https.createServer(httpsOptions, app).listen(app.get('port'), function() {
    var baseUrl = 'https://' + app.get('host') + ':' + app.get('port');
    app.emit('started HTTPS web server', baseUrl);
    console.log('LoopBack server listening @ %s%s', baseUrl, '/');
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
```

{% include tip.html content="Simply replace `require('spdy')` with `require('https')` in the preceding code snippet if you would prefer to just use HTTPS and not HTTP/2 as well (and also skip `npm install spdy`).
" %}


#### Redirecting HTTP Traffic to HTTPS

Add an `httpPort` option to `server/config.json`:

```js
"httpPort": 8080,
```

Create a `server/middleware/https-redirect/index.js` middleware with the following contents:

```js
/**
 * Middleware to redirect HTTP requests to HTTPS
 * @param {Object} options Options
 * @returns {Function} The express middleware handler
 */
module.exports = function(options) {
  return function httpsRedirect(req, res, next) {
    var app = req.app;
    if (!req.secure) {
      return res.redirect('https://' + app.get('host') + ':' + app.get('port') + req.url);
    }
    next();
  };
};
```

Update `server/server.js` accordingly to redirect HTTP traffic to HTTPS:

```js
'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var http = require('http');
var https = require('spdy');
var httpsRedirect = require('./middleware/https-redirect');
var sslConfig = require('./ssl-config');

var app = module.exports = loopback();

app.use(httpsRedirect());

app.start = function() {
  var httpsOptions = {
    key: sslConfig.privateKey,
    cert: sslConfig.certificate,
  };
  // start the HTTP web server so that we can redirect HTTP traffic to HTTPS
  http.createServer(app).listen(app.get('httpPort'), function() {
    var baseUrl = 'http://' + app.get('host') + ':' + app.get('httpPort');
    app.emit('started HTTP web server', baseUrl);
    console.log('LoopBack server listening @ %s%s', baseUrl, '/');
  });
  // start the HTTPS web server
  return https.createServer(httpsOptions, app).listen(app.get('port'), function() {
    var baseUrl = 'https://' + app.get('host') + ':' + app.get('port');
    app.emit('started HTTPS web server', baseUrl);
    console.log('LoopBack server listening @ %s%s', baseUrl, '/');
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
```

### Getting a Perfect Lighthouse Audit Result

Performing a Lighthouse audit at this point will fail some checks as Lighthouse is unable to test the HTTP to HTTPS redirect. To achieve a perfect score in Lighthouse, temporarily change the `httpPort` and `port` values in `server/config.json`:

```js
"httpPort": 80,
"port": 443,
```

Then start LoopBack using `sudo`:

```bash
$ sudo node .
```

{% include warning.html content="Starting LoopBack using `sudo` is _not_ a recommended practice.
" %}

Change the `httpPort` and `port` values in `server/config.json` back to their previous settings:

```js
"httpPort": 8080,
"port": 8443,
```

From now on when you start LoopBack do _not_ use `sudo`:

```bash
$ node .
```

## What’s next?

While this web app meets the technical requirements for being a Progressive Web App, it's not much of an app at this point. The next steps would be to flesh out the frontend app with your actual content and desired app capabilities. You could continue to write the frontend web app using plain JavaScript, or you may want to use a frontend framework such as React, Preact, Polymer, Ember.js, or Vue.js.

You will likely also want to add a local, Offline First database to your app. PouchDB is a JavaScript database that syncs and can run in a web browser, making it a great fit for Progressive Web Apps. Even better, PouchDB can sync its data with [Apache CouchDB](http://couchdb.apache.org/) or [IBM Cloudant](https://www.ibm.com/cloud/cloudant). Check out the [Shopping List](https://github.com/ibm-watson-data-lab/shopping-list) series of demo apps for examples of frontend Progressive Web Apps that use PouchDB. Reference implementations are available for [React](https://github.com/ibm-watson-data-lab/shopping-list-react-pouchdb), [Preact](https://github.com/ibm-watson-data-lab/shopping-list-preact-pouchdb), [Polymer](https://github.com/ibm-watson-data-lab/shopping-list-polymer-pouchdb), [Ember.js](https://github.com/ibm-watson-data-lab/shopping-list-emberjs-pouchdb), and [Vue.js](https://github.com/ibm-watson-data-lab/shopping-list-vuejs-pouchdb).

When you're ready to go into production, or you're ready to stand up a staging environment, you have a number of options for deploying your app to the IBM Cloud:

- Use the [Node.js runtime on IBM Cloud](https://console.bluemix.net/docs/runtimes/nodejs/index.html#nodejs_runtime)
- Use the [IBM Cloud Container Service](https://console.bluemix.net/docs/containers/container_index.html#container_index) to deploy the app in Docker containers that run in Kubernetes clusters
- Use [IBM API Connect](https://developer.ibm.com/apiconnect/)

I hope that after reading this post you're ready to build a Progressive Web App that is served from LoopBack and uses LoopBack as your backend for frontend (BFF). I'm looking forward to seeing what you build!
