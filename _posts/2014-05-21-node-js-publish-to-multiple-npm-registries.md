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
<!--more-->
## **Keeping private modules private**

Some of your modules are open source, thus you want to publish them to the public npmjs.org registry at some point. Others are private and must be published to your private registry. The process should prevent you from publishing a private module to the public repository. A possible solution preventing such errors is to publish public modules to the private registry first and promote them to the public registry later.

## **Setting up a staging npm registry**

You want to set up a staging registry for pre-release versions of your modules, to allow other people to test them simply using npm install.  This becomes very useful when you are changing a set of dependent modules and want to ensure the correct pre-release versions of all dependencies. Later, when the pre-release version passes all tests, you want to promote it from the staging registry to the main one.

To implement such process with the current tools, one has to:

- Record a commit or tag ID for each pre-release version being published. 
- To promote a version, retrieve the appropriate commit/tag ID and check out the source code from the repository. - Once you’ve obtained the right version of the source, publish the package to a different registry using npm publish. Caveat: you must first configure the npm client to use the right registry URL, authentication credentials, and other related options.

## <strong>slc to the rescue</strong>##

Today we are happy to announce a new addition to our slc toolbox:

`$ slc registry promote`

Assuming you have already configured the source and the target registry using `slc registry add`, you can promote any package with a single command. For example:

`$ slc registry promote --from team --to staging my-module@1.2.3`

## <strong>Quick start</strong>##

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

## <strong>Documentation</strong>##

Learn more in the documentation: 

- <a href="http://docs.strongloop.com/display/NODE/Using+multiple+package+registries">Using multiple package registries</a> 
- <a href="http://docs.strongloop.com/display/SL/slc+registry">slc registry</a> command reference</span>

## What’s next?**
  
- Ready to develop APIs in Node.js and get them connected to your data? Check out the LoopBack framework? We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.<
