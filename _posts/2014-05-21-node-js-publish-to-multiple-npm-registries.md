---
id: 16494
title: 'Node.js How-to: Publishing to Multiple npm Registries'
date: 2014-05-21T07:47:03+00:00
author: Miroslav Bajtoš
guid: http://strongloop.com/?p=16494
permalink: /strongblog/node-js-publish-to-multiple-npm-registries/
categories:
  - Community
  - How-To
---
As we mentioned in the previous post, [&#8220;Easy Switching Between Public and Private npm Registries&#8221;](http://strongloop.com/strongblog/switch-between-configure-public-and-private-npm-registry/), the topic of running a private registry server is quite broad. Once you’re running  your private registry server and know how to switch between different registries when installing packages, it’s time to look at the process of package publishing.

Consider the following two scenarios&#8230;

## **Keeping private modules private**

Some of your modules are open source, thus you want to publish them to the public npmjs.org registry at some point. Others are private and must be published to your private registry. The process should prevent you from publishing a private module to the public repository. A possible solution preventing such errors is to publish public modules to the private registry first and promote them to the public registry later.

## **Setting up a staging npm registry**

You want to set up a staging registry for pre-release versions of your modules, to allow other people to test them simply using npm install.  This becomes very useful when you are changing a set of dependent modules and want to ensure the correct pre-release versions of all dependencies. Later, when the pre-release version passes all tests, you want to promote it from the staging registry to the main one.

To implement such process with the current tools, one has to:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Record a commit or tag ID for each pre-release version being published. </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">To promote a version, retrieve the appropriate commit/tag ID and check out the source code from the repository. </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Once you’ve obtained the right version of the source, publish the package to a different registry using npm publish. Caveat: you must first configure the npm client to use the right registry URL, authentication credentials, and other related options.<!--more--></span>
</li>

<h2 dir="ltr">
  <strong>slc to the rescue</strong>
</h2>

Today we are happy to announce a new addition to our slc toolbox:

`$ slc registry promote`

Assuming you have already configured the source and the target registry using `slc registry add`, you can promote any package with a single command. For example:

`$ slc registry promote --from team --to staging my-module@1.2.3`

<h2 dir="ltr">
  <strong>Quick start</strong>
</h2>

1. Update your slc tool

`$ slc update`

or install it from the public npmjs.org registry

`$ npm install -g strong-cli`

2. Add a new configuration for your private registry

`$ slc registry add private`

3. Switch your npm client to use the private registry

`$ slc registry use private`

The steps 1–3 are the initial setup.  You have do them only once.

4. Publish a package to the private registry

`$ npm publish`

5. Promote a package version to the public registry

`$ slc registry promote --from private --to default my-package@2.0.3`

<h2 dir="ltr">
  <strong>Documentation</strong>
</h2>

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Learn more in the documentation: <a href="http://docs.strongloop.com/display/NODE/Using+multiple+package+registries">Using multiple package registries</a> and <a href="http://docs.strongloop.com/display/SL/slc+registry">slc registry</a> command reference.</span>
</li>

## **[Use StrongOps to Monitor Node Apps](http://strongloop.com/node-js-performance/strongops/)
  
** 

Ready to start monitoring event loops, manage Node clusters and chase down memory leaks? We’ve made it easy to get started with [StrongOps](http://strongloop.com/node-js-performance/strongops/) either locally or on your favorite cloud, with a [simple npm install](http://strongloop.com/get-started/).

<img alt="Screen Shot 2014-02-03 at 3.25.40 AM" src={{site.url}}/blog-assets/uploads/2014/02/Screen-Shot-2014-02-03-at-3.25.40-AM.png" width="1746" height="674" />

## **[What’s next?](http://strongloop.com/get-started/)
  
** 

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What’s in the upcoming Node v0.12 release? <a href="http://strongloop.com/strongblog/performance-node-js-v-0-12-whats-new/">Big performance optimizations</a>, read <a href="https://github.com/bnoordhuis">Ben Noordhuis’</a> blog to learn more.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js <a href="http://strongloop.com/mobile-application-development/loopback/">LoopBack framework</a>. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Need <a href="http://strongloop.com/node-js-support/expertise/">training and certification</a> for Node? Learn more about both the private and open options StrongLoop offers.</span>
</li>