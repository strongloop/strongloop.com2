---
id: 1094
title: Deploy a Private npm Registry Without CouchDB or Redis
date: 2013-07-23T09:30:05+00:00
author: Matt Schmulen
guid: http://blog.strongloop.com/?p=1094
permalink: /strongblog/deploy-a-private-npm-registry-without-couchdb-or-redis/
categories:
  - How-To
  - Product
---
npm is one of the most important and powerful features of Node.js. It allows you to share features and code as modules with other developers in the Node community. However, often teams want to pull Node modules from a local or private npm registry instead of from the global npmjs.org registry. There are several reasons for using a local private npm registry:

  * Make it easy to share and use private modules within your team, without registering or distributing to the global [npmjs.org](https://npmjs.org/).
  * Provide governance around public npm module versions to insure stability.
  * Insure security by limiting access to modules that have not been audited for security compliance.
  * Organizations or companies that want to install their own npm-local server behind a firewall.

[node-reggie](https://github.com/mbrevoort/node-reggie) is an experimental lightweight alternative to a full-blown npm registry. A team can stand it up in a few minutes, without having to install and manage a CouchDB datastore. Last weeks [Miroslav Bajtoš](https://github.com/bajtos) update to [Mike Brevoort](https://github.com/mbrevoort)&#8216;s [node-reggie](https://github.com/mbrevoort/node-reggie) adds extended support for the npm protocol. node-reggie currently supports:

  * Registering/uploading packages generated by n
  * Installing packages through a tarball npm dependency convention
  * Supports basic semver wildcards (1.1.x) and ranges
  * A few basic routes to see what&#8217;s registered
  * Flat file storage that&#8217;s simple to back-up and restore
  * [NEW] subset of npm registry protocol (allowing npm to talk to node-reggie)

## Use reggie to stand up a private local npm registry

Install reggie to your local global npm cache `$npm install -g reggie `and start the reggie server

`$reggie-server -d ~/.reggie`

## Publishing packages to your private npm registry

`$cd  /myPackagedModule` `$reggie -u http://127.0.0.1:8080 publish`

## Using packages from your private npm registry

From an npm install:

`npm install http://127.0.0.1:8080/package/myPackageModule/1.0.0`

or from within your json file:

`dependencies:`

```{``"myPackageModule":"http://127.0.0.1:8080/package/myPackageModule/1.0.0"``}`

you can also use wild-card &#8216;x&#8217; or &#8216;latest&#8217; versioning tags:

`http:///package/foo/x` `http:///package/foo/latest`

Using a private or on-premise npm is an important feature for teams who want to insure quality, security, and rapid delivery when building Node apps. Some additional features to check out

  * [Start-up Options](https://github.com/mbrevoort/node-reggie#start-up-options) for configuring repository directories, ports and &#8216;npm&#8217; url
  * [Routing](https://github.com/mbrevoort/node-reggie#other-routes) configurations
  * support [URL version](https://github.com/mbrevoort/node-reggie#ranges) conventions

Make sure to keep up to date with the latest [strongloop distro](http://strongloop.com/products#downloads) for updates on support npm packages that improve your Node.js development, delivery and deployment.

## **[What’s next?](http://strongloop.com/get-started/)**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js <a href="http://loopback.io/">LoopBack framework</a>. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
</li>

&nbsp;