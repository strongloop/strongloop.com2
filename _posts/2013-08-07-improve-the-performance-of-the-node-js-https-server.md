---
id: 1339
title: How-to Improve Node.js HTTPS Server Performance
date: 2013-08-07T08:23:51+00:00
author: Miroslav Bajtoš
guid: http://blog.strongloop.com/?p=1339
permalink: /strongblog/improve-the-performance-of-the-node-js-https-server/
categories:
  - How-To
---
<p dir="ltr">
  In this installment of StrongLoop’s technical series, we will take a deep dive into the TLS protocol and look at Node.js configuration options that affect its performance.
</p>

<h2 dir="ltr">
  SSL, TLS, HTTPS
</h2>

<p dir="ltr">
  Let’s start with a quick recapitulation of protocols that allows you to secure your client-server connections.
</p>

  * SSL stands for Secure Sockets Layer. It was developed in mid-90ties by Netscape and was quickly superseded by TLS.
  * TLS stands for Transport Layer Security. It is a standard maintained by IETF and addresses many shortcomings and security vulnerabilities of the SSL protocol.
  * Both SSL and TLS operate at the level of TCP socket streams, they provide means for switching a plaintext stream into a fully encrypted channel.
  * HTTPS, or HTTP Secure, is a combination of HTTP protocol communicating over a SSL/TLS channel.

<h2 dir="ltr">
  TLS Session Reuse
</h2>

<p dir="ltr">
  Establishing a new secured channel requires two round-trips between the client and the server. To create shared secret keys used for encryption, both the client and the server has to perform some CPU-heavy cryptographic operations.
</p>

<p dir="ltr">
  Session reuse saves one round-trip and allows to skip the expensive setup of new crypto parameters by reusing the configuration used in a previous connection. It is one of the most important ways how to improve the performance of TLS-secured communication.
</p>

<p dir="ltr">
  Note: Do not confuse TLS sessions with sessions used in web applications. These two concepts are completely unrelated to each other.
</p>

<p dir="ltr">
  There are two ways how to reuse TLS sessions:
</p>

  * Session identifiers are a part of both SSL and TLS standards and should be supported by all implementations. The mechanism requires the server to keep a list of valid sessions, so that it can resume a session based on an identifier presented by a client. As we will see later, this requirement brings extra work for node.js servers.
  * Session tickets are a TLS protocol extension that solves the problem of sharing valid sessions among multiple servers in a distributed environment by encoding all required parameters in the session ticket itself. When a client presents the server with such a ticket, the server can restore the session without consulting any external session cache. The extension is not implemented by all TLS clients yet. Clients supporting session tickets are Google Chrome and Mozilla Firefox browsers, openssl and gnutls libraries. Internet Explorer and Safari browsers do not support this extension yet.

<p dir="ltr">
  Please consult <a href="http://vincent.bernat.im/en/blog/2011-ssl-session-reuse-rfc5077.html">this excellent article</a> for a more detailed explanation of the problem.
</p>

<h2 dir="ltr">
  Configuring Node.js Server for Session Reuse
</h2>

<p dir="ltr">
  Reusing sessions via session tickets works out-of-the box, the implementation is completely transparent for your node.js code and works flawlessly in a single-process scenario. When it comes to node&#8217;s native cluster, the bug <a href="https://github.com/joyent/node/issues/5871">#5871</a> prevents v0.10 cluster workers to accept tickets issued by their neighbours. Since the distribution of requests in v0.10 is not even (most requests end up on one or two workers), the impact of the issue shouldn’t be too large. The issue is fixed in v0.11.
</p>

<p dir="ltr">
  Reusing sessions via session identifiers requires that your application implements a session store and handles newSession and resumeSession events. The code below demonstrates a possible implementation for a single-process application. Note that <a href="http://nodejs.org/api/https.html">HTTPS server</a> is a subclass of <a href="http://nodejs.org/api/tls.html">TLS server</a>, thus you can use the same mechanism for setting up a HTTPS server.
</p>

```js
var tls = require('tls');

var tlsSessionStore = {};
// TODO - implement removal of expired sessions

var opts = { /* configure certificates, etc. */ };
var server = tls.createServer(opts, tlsConnectionHandler);

server.on('newSession', function(id, data) {
tlsSessionStore[id] = data;
});
server.on('resumeSession', function(id, cb) {
cb(null, tlsSessionStore[id] || null);
});

server.listen(4433);
```

<p dir="ltr">
  When you run a cluster of worker processes, you need to share the session store among all workers. The easiest solution is to use our <a href="https://npmjs.org/package/strong-cluster-tls-store">strong-cluster-tls-store</a> module, which uses node&#8217;s master-worker messaging under the hood and does not require any external services like Redis. Let&#8217;s look how to setup an Express application running in a cluster for HTTPS.
</p>

```js
var https = require('https');
var express = require('express');
var shareTlsSessions = require('strong-cluster-tls-store');

if (cluster.isMaster) {
// Setup your master and fork workers.
} else {
// Start the server and configure TLS sessions sharing

var app = express();
// configure the app

var httpsOpts = { /* configure certificates, etc. */ }
var server = https.createServer(httpsOpts, app);
shareTlsSessions(server);

server.listen(port);
// etc.
}
```

<p dir="ltr">
  Phew, that was easy, wasn&#8217;t it?
</p>

<p dir="ltr">
  A word of warning: the stable version of node (v0.10) contains a bug where the resumeSession event is raised even when the session is restored via session tickets (<a href="https://github.com/joyent/node/issues/5872">#5872</a>). This means that installing a session store will most likely slow down the process of resuming sessions via session tickets. Depending on how many of your clients do and do not support TLS session tickets extension, it might be better to not use the session store at all.
</p>

<p dir="ltr">
  You should monitor the performance of your application and find out yourself whether installing a TLS session store makes it run faster. Check out our product <a href="http://nodefly.com/">StrongOps</a> (formerly NodeFly) if you are looking for a great performance monitoring tool.
</p>

<h2 dir="ltr">
  Verifying that Sessions are Reused
</h2>

<p dir="ltr">
  Now that we have configured our server, let&#8217;s verify that the sessions are really reused. We will employ openssl&#8217;s command-line tool that comes as a part of Mac OS X and most of Linux distros too. The script assumes that the TLS or HTTPS server is up and listening on port 3000.
</p>

<p dir="ltr">
  Note: the openssl version shipped in Mac OS X is ancient and does not play well with the version used by node. You should upgrade your openssl before you perform the following test, e.g. by installing a recent version using homebrew.
</p>

<li dir="ltr">
  <p dir="ltr">
    Check the openssl version to make sure we have at least 1.0.
  </p>
  
  ```js
$ openssl version
OpenSSL 1.0.1e 11 Feb 2013
```
</li>

<li dir="ltr">
  <p dir="ltr">
    Open few connections reusing the same session via TLS. Terminate the test by pressing Ctrl+C.
  </p>
  
  ```js
$ openssl s_client  -reconnect -port 3000 2>&1 
| grep "^(New|Reused)"
New, TLSv1/SSLv3, Cipher is AES256-GCM-SHA384
Reused, TLSv1/SSLv3, Cipher is AES256-GCM-SHA384
Reused, TLSv1/SSLv3, Cipher is AES256-GCM-SHA384
Reused, TLSv1/SSLv3, Cipher is AES256-GCM-SHA384
Reused, TLSv1/SSLv3, Cipher is AES256-GCM-SHA384
Reused, TLSv1/SSLv3, Cipher is AES256-GCM-SHA384
^C
```
</li>

<li dir="ltr">
  <p dir="ltr">
    Repeat the same test but with TLS session tickets extension disabled.
  </p>
  
  ```js
$ openssl s_client  -reconnect -port 3000 2>&1 -no_ticket 
| grep "^(New|Reused)"
New, TLSv1/SSLv3, Cipher is AES256-GCM-SHA384
Reused, TLSv1/SSLv3, Cipher is AES256-GCM-SHA384
Reused, TLSv1/SSLv3, Cipher is AES256-GCM-SHA384
Reused, TLSv1/SSLv3, Cipher is AES256-GCM-SHA384
Reused, TLSv1/SSLv3, Cipher is AES256-GCM-SHA384
Reused, TLSv1/SSLv3, Cipher is AES256-GCM-SHA384
^C
```
</li>

## **What’s next?**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js <a href="http://loopback.io/">LoopBack framework</a>. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
</li>

&nbsp;