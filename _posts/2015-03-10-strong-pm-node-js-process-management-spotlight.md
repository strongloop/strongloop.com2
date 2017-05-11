---
id: 23817
title: 'StrongLoop npm Module Spotlight &#8211; Node.js Build, Deploy &#038; Process Management'
date: 2015-03-10T08:00:50+00:00
author: Alex Gorbatchev
guid: https://strongloop.com/?p=23817
permalink: /strongblog/strong-pm-node-js-process-management-spotlight/
categories:
  - Community
  - How-To
  - Node DevOps
---
I want to take a moment and talk a little bit about deploying your Node.js application. This subject in general is pretty well defined but there aren’t that many tools out there written for Node. I’ve seen Node.js applications deployed by Capistrano, and yes, it does work but as a JavaScript developer that just doesn’t sit well with me and I would prefer something closer to home, something that lives and breathes my infrastructure, something that’s written in the language I’m very well familiar with and when things go wrong I can actually comprehend the error messages without extensive research.

<img class="aligncenter size-full wp-image-23820" src="{{site.url}}/blog-assets/2015/03/indiana-jones-sand-bag.gif" alt="indiana-jones-sand-bag" width="480" height="253" />

## **Introducing strong-pm**

Enter [strong-pm](https://github.com/strongloop/strong-pm)! But first&#8230; How does a typical Node.js application generally get deployed? The source is delivered via \`git push\` or \`git pull\` to one or more servers. Each server then kicks off a full build and \`npm install\`. Each server then proceeds to download and build all of the required NPM dependencies. This process is generally pretty time consuming, not to mention that it costs the nice people at NPM Inc. a good deal of money. 🙂

StrongLoop has developed a pretty cool solution consisting of three separate modules, each one doing its own thing to give you a smooth build/deploy/run workflow out of the box.

  * <a href="https://github.com/strongloop/strong-build">strong-build</a> &#8211; creates a build artifact for your project (GIT repo or otherwise).
  * <a href="https://github.com/strongloop/strong-deploy">strong-deploy</a> &#8211; sends the build artifact prepared by strong-build to a running instance of strong-pm.
  * <a href="https://github.com/strongloop/strong-pm">strong-pm</a> &#8211; receives the build artifact and runs it locally guaranteeing uptime.

Let’s look at each one in some detail to get a better understanding of the work involved at each step. For full technical documentation please visit the GitHub pages linked to above.

<!--more-->

## **strong-build**

strong-build is the first of two steps on the path to making your deployment life easier. Here’s what it does:

  * Installs dependencies, runs custom build steps, and prunes development dependencies, all without affecting your existing source tree.
  * Modifies the npm `package.json` and `.npmignore` configuration files so that dependencies will be packed.
  * Creates an npm package of the build or commits the build onto a GIT `deploy` branch (based on the chosen settings).

Of course all options here (as well as other modules) are fully configurable. Each step can be executed via an individual command and running strong-build kicks them all off in sequence: \`install\`, \`bundle\`, \`pack\` and \`commit\`. In the end you will either have a GIT \`deploy\` branch or a TAR file ready to be sent over to the target machine.

One very important thing to keep in mind is that if your app uses any native modules (and it probably does), you don&#8217;t want to compile them during the build unless the machine that you run the build on matches the server in terms of the operating system and libraries. By default [strong-build](https://github.com/strongloop/strong-build) doesn&#8217;t run NPM scripts and therefore no compilation occurs. This means that you can package and build your project on your laptop and safely deploy to production assuming all required libraries are installed on the server. Of course you can change that with the `--scripts` which will tell [strong-build](https://github.com/strongloop/strong-build) to run NPM scripts.

## **strong-deploy**

After you’ve run strong-build and have a build artifact ready, the strong-deploy module does the job of sending the build over to the already running instance of strong-pm. strong-deploy expects a target location and will send it over HTTP or SSH.

## **strong-pm**

The heart of the whole system is the strong-pm module. It’s meant to be running as a service for which it’s happy to generate OS appropriate system files. After strong-deploy finishes pushing the new build artifact, strong-pm prepares it using the \`prepare\` command and then starts the application via the \`run\` command.

When restarting an already running application, strong-pm will try to gracefully shut it down and start a new one. By default clustering is based on the number of available CPU cores.

## **Summary**

On the server:

Install strong-pm as a system service using the bundled `sl-pm-install` command (see `sl-pm-install &#8211;help` for available options).

Start the service.

On the build machine:

- Run strong-build to generate a build artifact.
- Run strong-deploy to send the artifact over to the running strong-pm instance.
