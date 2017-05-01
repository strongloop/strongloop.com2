---
id: 26290
title: 'Best Practices for Express in Production &#8211; Part One: Security'
date: 2015-11-12T05:22:12+00:00
author: Hage Yaapa and C. Rand McKinney
guid: https://strongloop.com/?p=26290
permalink: /strongblog/best-practices-for-express-in-production-part-one-security/
categories:
  - Express
  - How-To
  - Node DevOps
---

This is a two-part blog series about some best practices for running Express applications in production. This first part focuses on security, and the second on performance and reliability.  It assumes you are already familiar with the basics of Node.js and web development practices and covers topics and concepts especially relevant to the production environment.

<!--more-->

## Overview

<img class="alignright wp-image-15007" src="{{site.url}}/blog-assets/2014/04/api_security.png" alt="api_security" style="width:100px;" />

The term “_production_” refers to the stage in the software lifecycle when an application or API is generally available to its end-users or consumers. In contrast, in _development_, you’re still actively writing and testing code, and the application is not open to external access. The corresponding system environments are known as _production_ and _development environments_, respectively.

Development and production environments are often set up very differently and have vastly different requirements. Something that’s fine in development may not be acceptable in production. For example, in a development environment verbose logging of errors may be needed for debugging, while the same behavior can become a security concern in a production environment.  And in development, you don’t need to worry about scalability, reliability, and performance, while those concerns become critical in production.

This blog presents some security best practices for Express applications deployed to production.

<!--more-->

## Don’t use deprecated or vulnerable versions of Express

Express 2.x and 3.x are no longer maintained. Security and performance issues in these versions won’t be fixed. Do not use them!  If you haven’t moved to version 4, follow the [handy migration guide](http://expressjs.com/guide/migrating-4.html) to upgrade your app to version 4.

Also ensure you are not using any of the vulnerable Express versions listed on the [Security updates page](http://expressjs.com/advanced/security-updates.html). If you are, update to one of the stable releases, preferably the latest.

## Use TLS

If your app deals with or transmits sensitive data, use [Transport Layer Security](https://en.wikipedia.org/wiki/Transport_Layer_Security) (TLS) to secure the connection and the data. This technology encrypts data _before_ it is sent from the client to the server, thus preventing some common (and easy) hacks. Although Ajax and POST requests might not be visibly obvious and seem “hidden” in browsers, their network traffic is vulnerable to [packet sniffing](https://en.wikipedia.org/wiki/Packet_analyzer) and [man-in-the-middle attacks](https://en.wikipedia.org/wiki/Man-in-the-middle_attack).

You may be familiar with Secure Socket Layer (SSL) encryption. [TLS is simply the next progression of SSL](https://msdn.microsoft.com/en-us/library/windows/desktop/aa380515(v=vs.85).aspx). In other words, if you were using SSL before, consider upgrading to TLS.  In general, we recommend Nginx to handle TLS.  For a good reference on how to configure TLS on Nginx (and other servers), see [Recommended Server Configurations (Mozilla Wiki)](https://wiki.mozilla.org/Security/Server_Side_TLS#Recommended_Server_Configurations).

Also, a handy tool to get a TLS certificate is [Let&#8217;s Encrypt](https://letsencrypt.org/about/), a free, automated, and open certificate authority (CA) provided by the [Internet Security Research Group (ISRG)](https://letsencrypt.org/isrg/).

## Use Helmet

[Helmet](https://www.npmjs.com/package/helmet) can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.

[<img class="aligncenter size-full wp-image-26309" src="{{site.url}}/blog-assets/2015/11/helmet.png" alt="helmet" width="471" height="132"  />]({{site.url}}/blog-assets/2015/11/helmet.png)

Helmet is actually just a collection of nine smaller middleware functions that set security-related HTTP headers:

  * [csp](https://github.com/helmetjs/csp) sets the `Content-Security-Policy` header to help prevent cross-site scripting attacks and other cross-site injections.
  * [hidePoweredBy](https://github.com/helmetjs/hide-powered-by) removes the `X-Powered-By header`.
  * [hpkp](https://github.com/helmetjs/hpkp) Adds [Public Key Pinning](https://developer.mozilla.org/en-US/docs/Web/Security/Public_Key_Pinning) headers to prevent man-in-the-middle attacks with forged certificates.
  * [hsts](https://github.com/helmetjs/hsts) sets `Strict-Transport-Security` header that enforces secure (HTTP over SSL/TLS) connections to the server.
  * [ieNoOpen](https://github.com/helmetjs/ienoopen) sets `X-Download-Options` for IE8+.
  * [noCache](https://github.com/helmetjs/nocache) sets `Cache-Control` and `Pragma` headers to disable client-side caching.
  * [noSniff](https://github.com/helmetjs/dont-sniff-mimetype) sets `X-Content-Type-Options` to prevent browsers from MIME-sniffing a response away from the declared content-type.
  * [frameguard](https://github.com/helmetjs/frameguard) sets the `X-Frame-Options` header to provide [clickjacking](https://www.owasp.org/index.php/Clickjacking) protection.
  * [xssFilter](https://github.com/helmetjs/x-xss-protection) sets `X-XSS-Protection` to enable the Cross-site scripting (XSS) filter in most recent web browsers.

Install Helmet like any other module:

```js
$ npm install --save helmet
```

Then use it as normal middleware:

```js
...
var helmet = require('helmet');
app.use(helmet());
...
```

### At a minimum, disable X-Powered-By header

If you don’t want to use Helmet, then at least disable the `X-Powered-By header`.  Attackers can use this header (that is enabled by default) to detect apps running Express and then launch specifically-targeted attacks.

So, best practice is to to turn off the header with the `app.disable()` method:

```js
app.disable('x-powered-by');
```

If you use Helmet, then it takes care of this for you.

## Use cookies securely

To ensure cookies don’t open your app to exploits, don’t use the default session cookie name and set cookie security options appropriately.

There are two main middleware cookie session modules:

  * [express-session](https://www.npmjs.com/package/express-session) that replaces `express.session` middleware built-in to Express 3.x.
  * [cookie-session](https://www.npmjs.com/package/cookie-session) that replaces `express.cookieSession` middleware built-in to Express 3.x.

The main difference between these two modules is how they save cookie session data.  The [express-session](https://www.npmjs.com/package/express-session) middleware stores session data on the server; it saves only the session ID in the cookie itself, not session data.  By default, it uses in-memory storage and is not designed for a production environment.  In production, you’ll need to set up a scalable session-store; see the list of [compatible session stores](https://github.com/expressjs/session#compatible-session-stores).

In contrast, [cookie-session](https://www.npmjs.com/package/cookie-session) middleware implements cookie-backed storage: it serializes the entire session to the cookie, rather than just a session key.  Only use it when session data is relatively small and easily encoded as primitive values (rather than objects).  Although browsers are supposed to support at least 4096 bytes per cookie, to ensure you don’t exceed the limit, don&#8217;t exceed a size of 4093 bytes per domain.  Also, be aware that the cookie data will be visible to the client, so if there is any reason to keep it secure or obscure, then express-session may be a better choice.

### Don’t use default session cookie name

Using the default session cookie name can open your app to attacks.  The security issue posed is similar to `X-Powered-By`: a potential attacker can use it to fingerprint the server and target attacks accordingly.

To avoid this, use generic cookie names; for example using [express-session](https://www.npmjs.com/package/express-session) middleware:

```js
var session = require('express-session');
app.set('trust proxy', 1) // trust first proxy
app.use( session({
  secret : 's3Cur3',
  name : 'sessionId',
  })
);
```

### Set cookie security options

Set the following cookie options to enhance security:

  * `secure` &#8211; Ensures the browser only sends the cookie over HTTPS.
  * `httpOnly` &#8211; Ensures the cookie is sent only over HTTP(S), not client JavaScript, helping to protect against cross-site scripting attacks.
  * `domain` &#8211; indicates the domain of the cookie; use it to compare against the domain of the server in which the URL is being requested. If they match, then check the path attribute next.
  * `path` &#8211; indicates the path of the cookie; use it to compare against the request path. If this and domain match, then send the cookie in the request.
  * `expires` &#8211; use to set expiration date for persistent cookies.

Here is an example using [cookie-session](https://www.npmjs.com/package/cookie-session) middleware:

```js
var session = require('cookie-session');
var express = require('express');
var app = express();
var expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour
app.use(session({
  name: 'session',
  keys: ['key1', 'key2'],
  cookie: { secure: true,
          httpOnly: true,
          domain: 'example.com',
          path: 'foo/bar',
          expires: expiryDate
          }
  })
);
```

## Ensure your dependencies are secure

Using npm to manage your application’s dependencies is powerful and convenient.  But the packages that you use may contain critical security vulnerabilities that could also affect your application.  The security of your app is only as strong as the “weakest link” in your dependencies.

<img class="alignright size-full wp-image-26310" src="{{site.url}}/blog-assets/2015/11/nsp.png" alt="nsp" width="241" height="63" />Fortunately, there are two helpful tools you can use to ensure security of the third-party packages you use: [nsp](https://www.npmjs.com/package/nsp) and [requireSafe](https://requiresafe.com/).  These two tools do largely the same thing, so using both might be overkill, but “better safe than sorry” are words to live by when it comes to security.

[nsp](https://www.npmjs.com/package/nsp) is a command-line tool that checks the [Node Security Project](https://nodesecurity.io/) vulnerability database to determine if your application uses packages with known vulnerabilities.  Install it as follows:

```js
$ npm i nsp -g
```

Then use this command to submit your app&#8217;s `npm-shrinkwrap.json` and`package.json` files for validation to [nodesecurity.io](https://nodesecurity.io/):

```js
$ cd your-app
$ nsp check
```

You can also use [requireSafe](https://requiresafe.com/) to audit your Node modules:

```js
$ npm install -g requiresafe
$ cd your-app
$ requiresafe check
```

## Additional considerations

Here are some further recommendations from the excellent [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/).  Refer to that blog post for all the details on these recommendations:

  * Implement rate-limiting to prevent brute-force attacks against authentication.  One way to do this is to use [StrongLoop API Gateway](https://strongloop.com/node-js/api-gateway/) to enforce a rate-limiting policy.  Alternatively, you can use middleware such as [express-limiter](https://www.npmjs.com/package/express-limiter), but doing so will require you to modify your code somewhat.
  * Use [csurf](https://www.npmjs.com/package/csurf) middleware to protect against cross-site request forgery (CSRF).
  * Always filter and sanitize user input to protect against cross-site scripting (XSS) and command injection attacks.
  * Defend against SQL injection attacks by using parameterized queries or prepared statements.
<li style="font-weight: 400;">
  Use the open-source <a href="http://sqlmap.org/">sqlmap</a> tool to detect SQL injection vulnerabilities in your app.
</li>
  * Use the [nmap](https://nmap.org/) and [sslyze](https://github.com/nabla-c0d3/sslyze) tools to test the configuration of your SSL ciphers, keys, and renegotiation as well as the validity of your certificate.
  * Use [safe-regex](https://www.npmjs.com/package/safe-regex) to ensure your regular expressions are not susceptible to [regular expression denial of service](https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS) attacks.

## Avoid other known vulnerabilities

Keep an eye out for [Node Security Project advisories](https://nodesecurity.io/advisories) that may affect Express or other modules that your app uses.  In general, the Node Security Project is an excellent resource for knowledge and tools about Node security.

Finally, Express apps—like any other web apps—can be vulnerable to a variety of web-based attacks. Familiarize yourself with known [web vulnerabilities](https://www.owasp.org/index.php/Top_10_2013-Top_10) and take precautions to avoid them.
