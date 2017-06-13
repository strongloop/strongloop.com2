---
id: 15911
title: Easy Switching Between Public and Private npm Registries
date: 2014-04-30T06:54:37+00:00
author: Miroslav Bajtoš
guid: http://strongloop.com/?p=15911
permalink: /strongblog/switch-between-configure-public-and-private-npm-registry/
categories:
  - How-To
  - Resources
---
As Node.js is [becoming a mainstream technology](http://www.nearform.com/nodecrunch/node-js-becoming-go-technology-enterprise) in the enterprise, more companies are asking for a private npm registry solution for their proprietary closed-source modules.

While there are several solutions emerging that offer a private npm registry server (either in the cloud or on premise), we at StrongLoop feel the private registry server is only one part of the story.

The second part is switching your npm client configuration between multiple registries.  Why would you want to use multiple registries? There are several reasons; for example:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Some of your modules are open source and thus published to the public npmjs.org registry and others are private and published to your private registry. </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">You have multiple private registries: for example a company-wide registry for stable versions of modules and multiple per-team registries with nightly builds of each module. </span>
</li>

Previously, many developers used the [npm config](https://www.npmjs.org/doc/cli/npm-config.html) command to switch between different registry servers:

`$ npm config set registry <a href="https://your.registry.url/">https://your.registry.url/</a>`

This solution has few drawbacks:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">It ignores the fact that there are multiple configuration options that differ between registry servers, e.g. username and password.  You must change these options too when switching to another registry. </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">You have to recall and re-type the correct registry URL every time you change your registry server. </span>
</li>

The module [npmrc](https://www.npmjs.org/package/npmrc) provides a better solution.  It maintains a set of npmrc files (one npmrc for every registry) and you switch between them using a single command. However it is still not perfect, as the general options like “browser” or “git” are not shared across different configurations as they should be.<!--more-->

<h2 dir="ltr">
  <strong>Introducing slc registry</strong>
</h2>

Today we are pleased to announce a new tool that makes registry switching as easy at it should be: “slc registry”. It comes as a part of “slc”, our Swiss-army knife for Node.js developers.

<h2 dir="ltr">
  <strong>slc registry quickstart</strong>
</h2>

1 . Update your slc tool

`$ slc update`

or install it from the public npmjs.org registry

`$ npm install -g strong-cli` 

&nbsp;

2 . Add a new configuration entry for your private registry

`$ slc registry add private <a href="http://your.registry.url/">http://your.registry.url/</a>`

You will be presented with a simple wizard where you can customize related configuration options:

`Adding a new configuration "private"` [?] Registry URL: (http://your.registry.url/)
[?] HTTP proxy:
[?] HTTPS proxy:
[?] Email: (miroslav@strongloop.com)
[?] Always authenticate? (Y/n)
[?] Check validity of server SSL certificates? (Y/n)

`Configuration "private" was created.`

``Run `slc registry use "private"` to let the npm client use this registry.`` 

3 . Switch your npm client to use the private registry:

`$ slc registry use private`

`Using the registry "private" (<a href="http://your.registry.url/">http://your.registry.url/</a>).`


4 . Switching back to the public npmjs.org registry is easy too:

`$ slc registry use default`

`Using the registry "default" (<a href="https://registry.npmjs.org/">https://registry.npmjs.org/</a>).`

## **What’s next?**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Need to connect data to devices with Node? Check out <a href="http://strongloop.com/mobile-application-development/loopback/">LoopBack </a>API Server. It&#8217;s a simple install via <a href="http://strongloop.com/get-started/">npm</a></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What’s in the upcoming Node v0.12 version? <a href="http://strongloop.com/strongblog/performance-node-js-v-0-12-whats-new/">Big performance optimizations</a>, read the blog by Ben Noordhuis to learn more.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Need performance monitoring, profiling and cluster capabilities for your Node apps? Check out <a href="http://strongloop.com/node-js-performance/strongops/">StrongOps</a>!</span>
</li>