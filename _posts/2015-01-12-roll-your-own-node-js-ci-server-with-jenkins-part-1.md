---
id: 22417
title: 'Roll your own Node.js CI Server with Jenkins &#8211; Part 1'
date: 2015-01-12T08:00:06+00:00
author: Marc Harter
guid: http://strongloop.com/?p=22417
permalink: /strongblog/roll-your-own-node-js-ci-server-with-jenkins-part-1/
categories:
  - Community
  - How-To
---
Travis is cool. Coveralls is hip. But Jenkins has had this stuff for a while, and more. In addition to running your test suite and generating coverage reports, you can generate checkstyle reports (linting), deploy to staging and production, and utilize Docker containers. The price for all of this is free for your public _and_ private projects.

However, the hidden cost is your _time_. Figuring out how to get this to all to working is daunting when you first get started. Lucky for you, I’ve endured the pain to hopefully make this a fairly simple and straightfoward process.

This tutorial is broken up into two separate articles. The first covers the setup and configuration of Jenkins for Node projects. The [second](http://strongloop.com/?p=22492) explores running a Node project through Jenkins to generate all sorts of fun stuff. We will start from a fresh installation and work our way to a fully-functioning “jenkinized” Node project with:

  1. Code coverage analysis
  2. Test suite results
  3. Code style analysis
  4. Support for build badges
  5. Build hooks with GitHub

<p style="text-align: center;">
  <a href="{{site.url}}/blog-assets/2015/01/EndGoal.png"><img class=" wp-image-22420   aligncenter" alt="" src="{{site.url}}/blog-assets/2015/01/EndGoal.png" width="1555" height="972"  /></a>
</p>

I have made the following assumptions in order to focus this article and hopefully cover the majority of readers:

  1. You are using **GitHub** and **git**. You _can_ use other services but for brevity, I’m just going to focus on GitHub functionality.
  2. You are using a test runner that is able to output [**TAP**](http://testanything.org). Most popular runners (i.e. mocha, tape) already support this protocol.
  3. You are using a lint tool that is able to output [**Checkstyle**](http://checkstyle.sourceforge.net) reports (eslint and jshint both provide this).

Let’s get started!

<!--more-->

## Installation

Jenkins is a Java-based software that runs on multiple platforms. Follow the installation steps for your operating system at <http://jenkins-ci.org> or use [Docker](https://registry.hub.docker.com/_/jenkins/). I recommend installing a Long-Term Support Release (LTS) as plugins tend to be more stable.

<p style="text-align: center;">
  <a href="{{site.url}}/blog-assets/2015/01/LTS.png"><img class=" wp-image-22429   aligncenter" alt="" src="{{site.url}}/blog-assets/2015/01/LTS.png" width="359" height="174"  /></a>
</p>

After installation, you will see a happy screen like this:

<p style="text-align: center;">
  <a href="{{site.url}}/blog-assets/2015/01/Home.png"><img class=" wp-image-22428           aligncenter" alt="" src="{{site.url}}/blog-assets/2015/01/Home.png" width="684" height="508"  /></a>
</p>

Once you have installed Jenkins, it’s time to configure it. Let’s make Jenkins secure first.

## Security

It’s a good idea to lock Jenkins down, especially if you plan on exposing it publically (which we will do in this tutorial). Even private projects will need some endpoints public.

### Project-based matrix security

I find exposing Jenkins over HTTPS with _project-based matrix security_ settings works the best with plugins and allows the most flexibility. This will allow you to set up anonymous access for public projects and lock down private projects. It also allows you to expose certain aspects publically for private projects like build status badges and hooks for private GitHub repositories.

### Setting up a Jenkins user database

By default, Jenkins allows anyone to do anything in the system. Let’s change this. First, click “Manage Jenkins” **(1)** in the navigation sidebar and then click “Setup Security” **(2)**. If you don’t see that button, just click “Configure Global Security” **(2)** in the list:

<p style="text-align: center;">
  <a href="{{site.url}}/blog-assets/2015/01/Security1.png"><img class="aligncenter  wp-image-22452" alt="" src="{{site.url}}/blog-assets/2015/01/Security1.png" width="684" height="508"  /></a>
</p>

Once on the _Configure Global Security_ page, check “Enable security” **(1)**. Next, scroll to “Access Control” and select “Jenkins’ own user database” **(2)**. Then, click to “Save” **(3)** your settings:

<p style="text-align: center;">
  <a href="{{site.url}}/blog-assets/2015/01/Security2.png"><img class="aligncenter  wp-image-22453" alt="" src="{{site.url}}/blog-assets/2015/01/Security2.png" width="684" height="508"  /></a>
</p>

Now we can create accounts, so let’s set up an administrative account.

### Creating an administrator account

The following steps effectively lock down the Jenkins instance to allow only your admin user to create new users and to view/administer the instance. You can always add more administrators later if desired.

First, create a user by clicking “Sign up” **(1)** and filling out the form **(2)** and submitting **(3)**:

<p style="text-align: center;">
  <a href="{{site.url}}/blog-assets/2015/01/Security3.png"><img class="aligncenter  wp-image-22454" alt="" src="{{site.url}}/blog-assets/2015/01/Security3.png" width="684" height="508"  /></a>
</p>

Visit the _Global Security Page_ again (remember how to get there?!). Uncheck “Allow users to sign up”:

<p style="text-align: center;">
  <a href="{{site.url}}/blog-assets/2015/01/Security4.png"><img class="aligncenter  wp-image-22455" alt="" src="{{site.url}}/blog-assets/2015/01/Security4.png" width="474" height="92"  /></a>
</p>

Then, select “Project-based Matrix Authorization Strategy” **(1)** under “Authorization”. A table will appear with a spot to add users. Add your newly created username **(2)** and then check “Administrator” **(3)** under their permissions. Lastly, “Save” **(4)** your settings:

<p style="text-align: center;">
  <a href="{{site.url}}/blog-assets/2015/01/Security5.png"><img class="aligncenter  wp-image-22456" alt="" src="{{site.url}}/blog-assets/2015/01/Security5.png" width="684" height="508"  /></a>
</p>

Congrats! You’ve locked down your Jenkins instance. We’ll tweak these settings again later, but first, we’ll switch gears to explore installing plugins.

## Installing Plugins

Jenkins has numerous plugins that enable all kinds of nifty things. You will need a handful of plugins to complete remaining steps in this tutorial. We’ll install them now.

First, visit the plugin page by clicking “Manage Jenkins” **(1)** and then “Manage Plugins” **(2)**:

<p style="text-align: center;">
  <a href="{{site.url}}/blog-assets/2015/01/Plugins1.png"><img class="aligncenter  wp-image-22433" alt="" src="{{site.url}}/blog-assets/2015/01/Plugins1.png" width="684" height="508"  /></a>
</p>

Once you are on the _Manage Plugins_ page, visit the the “Available” tab:

<p style="text-align: center;">
  <a href="{{site.url}}/blog-assets/2015/01/Plugins2.png"><img class="aligncenter  wp-image-22434" alt="" src="{{site.url}}/blog-assets/2015/01/Plugins2.png" width="241" height="72"  /></a>
</p>

Then search for **(1)** and select **(2)** the following plugins:

  * GitHub Plugin
  * Clover Plugin
  * Checkstyle Plug-in
  * TAP Plugin
  * Embeddable Build Status Plugin
  * NodeJS Plugin

<p style="text-align: center;">
  <a href="{{site.url}}/blog-assets/2015/01/Plugins3.png"><img class="aligncenter  wp-image-22435" alt="" src="{{site.url}}/blog-assets/2015/01/Plugins3.png" width="684" height="508"  /></a>
</p>

After you’ll selected all the plugins, click “Install without restart”:

<p style="text-align: center;">
  <a href="{{site.url}}/blog-assets/2015/01/Plugins4.png"><img class="aligncenter  wp-image-22436" alt="" src="{{site.url}}/blog-assets/2015/01/Plugins4.png" width="407" height="45"  /></a>
</p>

You will notice a handful of plugins that you didn’t select will also be installed as they are dependencies. Once all plugins indicate “Success”, you’re done.

> If some plugins require a restart, you can kick that off by clicking the checkbox at the bottom and waiting for Jenkins to come back online.
> 
> <p style="text-align: center;">
>   <a href="{{site.url}}/blog-assets/2015/01/Plugins5.png"><img class="aligncenter  wp-image-22437" alt="" src="{{site.url}}/blog-assets/2015/01/Plugins5.png" width="574" height="33"  /></a>
> </p>

We have our plugins installed that we’ll need; let’s get configuring!

## Integrating with GitHub

The GitHub plugin will automatically setup the right hooks for you per project based on your GitHub repository through the GitHub API. Let’s configure this next and set up GitHub credentials for cloning repositories.

First, visit our now very familiar _Manage Jenkins_ page and select “Configure System”. Then, find the “Jenkins Location” and ensure that it has a public facing URL so GitHub can push events to it. Make sure to save if you make changes.

<p style="text-align: center;">
  <a href="{{site.url}}/blog-assets/2015/01/GitHub1.png"><img class="aligncenter  wp-image-22421" alt="" src="{{site.url}}/blog-assets/2015/01/GitHub1.png" width="593" height="101"  /></a>
</p>

Next, you will need to generate a token to use with the GitHub API. In order to set up the hooks, ensure the GitHub account has administrative rights to the repos.

In _another_ browser tab, go to GitHub and ensure you are logged in with the account you want to use. Then, visit the “Settings” **(1)** page, and select “Applications” **(2)** from the sidebar. Finally, click “Generate new token” **(3)**:

<p style="text-align: center;">
  <a href="{{site.url}}/blog-assets/2015/01/GitHub2.png"><img class="aligncenter  wp-image-22422" alt="" src="{{site.url}}/blog-assets/2015/01/GitHub2.png" width="1102" height="511"  /></a>
</p>

Next, set the relevant permissions to enable the hooks to work properly in Jenkins by giving the hook a name **(1)**, setting “repo”, “public\_repo” and “admin:repo\_hook” **(2)**, and then clicking “Generate” **(3)**:

<p style="text-align: center;">
  <a href="{{site.url}}/blog-assets/2015/01/GitHub3.png"><img class="aligncenter  wp-image-22423" alt="" src="{{site.url}}/blog-assets/2015/01/GitHub3.png" width="1102" height="511"  /></a>
</p>

Then copy the generated key:

<p style="text-align: center;">
  <a href="{{site.url}}/blog-assets/2015/01/GitHub4.png"><img class="aligncenter  wp-image-22424" alt="" src="{{site.url}}/blog-assets/2015/01/GitHub4.png" width="804" height="177"  /></a>
</p>

Now, flip back to your Jenkins _Configure System_ tab and visit the “GitHub Web Hook” section and select “Let Jenkins auto-manage hook URLs” **(1)**. Then, add your GitHub username and copied OAuth token to the “GitHub Credentials” section **(2)**. , click “Test Credential” **(3)** to make sure everything is working, you should see “Verified” if all is good to go. Lastly, click “Save” **(4)** to persist the changes.

<p style="text-align: center;">
  <a href="{{site.url}}/blog-assets/2015/01/GitHub5.png"><img class="aligncenter  wp-image-22425" alt="" src="{{site.url}}/blog-assets/2015/01/GitHub5.png" width="680" height="506"  /></a>
</p>

Now GitHub hooks will work. We need to add our credentials in one more spot to pull private repositories though. Head over to “Credentials” **(1)** in the navigation sidebar and select “Global credentials” **(2)** from the list:

<p style="text-align: center;">
  <a href="{{site.url}}/blog-assets/2015/01/GitHub6.png"><img class="aligncenter  wp-image-22426" alt="" src="{{site.url}}/blog-assets/2015/01/GitHub6.png" width="680" height="506"  /></a>
</p>

Next, click “Add credentials” **(1)** in the sidebar and fill out the form **(2)** using your same user and token you entered previously and submit **(3)**:

<p style="text-align: center;">
  <a href="{{site.url}}/blog-assets/2015/01/GitHub7.png"><img class="aligncenter  wp-image-22427" alt="" src="{{site.url}}/blog-assets/2015/01/GitHub7.png" width="680" height="506"  /></a>
</p>

GitHub is now ready to be utilized fully! Let’s get Node working next.

## Setting up Node

The NodeJS plugin allows you to run different projects against different versions of Node. It also handles the installations and writes Jenkins scripts in Node.

> To my knowledge this plugin only works on Linux. If you use another OS, install Node globally on the same server and make sure the `node` and `npm` executables are accessible to the `jenkins` user. Also, and perhaps more preferable in some cases, you can run a Docker container on Mac or Windows and use this plugin without issue.

First, visit the _Configure System_ page in _Manage Settings_ and select “Add NodeJS” from the “NodeJS” section:

<p style="text-align: center;">
  <a href="{{site.url}}/blog-assets/2015/01/Node1.png"><img class="aligncenter  wp-image-22430" alt="" src="{{site.url}}/blog-assets/2015/01/Node1.png" width="580" height="96"  /></a>
</p>

Then, let’s give this install a “Name” **(1)**, which will be a selectable option when setting up an individual project. We will call ours 0.10 to represent that latest 0.10.x version of Node. Next, check “Install automatically” **(2)**. A select will appear; choose “Install from nodejs.org” **(3)**:

<p style="text-align: center;">
  <a href="{{site.url}}/blog-assets/2015/01/Node2.png"><img class="aligncenter  wp-image-22431" alt="" src="{{site.url}}/blog-assets/2015/01/Node2.png" width="501" height="209"  /></a>
</p>

Now, select the most recent version of 0.10, which at the time of writing was 0.10.33 **(1)**. You may define optional global packages to install **(2)**. We’ll bundle our build dependencies locally in this tutorial so we won’t need this set. Finally, click “Save” **(3)**:

<p style="text-align: center;">
  <a href="{{site.url}}/blog-assets/2015/01/node3.png"><img class="aligncenter  wp-image-22432" alt="" src="{{site.url}}/blog-assets/2015/01/node3.png" width="680" height="506"  /></a>
</p>

Node is ready to be used now with your projects.

## Exposing build badges publically

This is our last step. Build badges are things to put in your Github _readme.md_ and elsewhere that indicate the state of the build:

[<img class="aligncenter size-full wp-image-22419" alt="" src="{{site.url}}/blog-assets/2015/01/BuildStatus.svg" />]({{site.url}}/blog-assets/2015/01/BuildStatus.svg)

To expose this ability, head back to the _Configure Global Security_ page in _Manage Settings_ and check “ViewStatus” for the “Anonymous” user in the “Job” section. Make sure to “Save” afterwards.

<p style="text-align: center;">
  <a href="{{site.url}}/blog-assets/2015/01/BuildStatus.png"><img class="aligncenter  wp-image-22418" alt="" src="{{site.url}}/blog-assets/2015/01/BuildStatus.png" width="985" height="124"  /></a>
</p>

From a security standpoint, an anonymous user will only be able to access that _icon_.

## Summary

This concludes part 1 of the Jenkins tutorial. We accomplished the following:

  1. Installed Jenkins
  2. Secured the Jenkins instance
  3. Installed some plugins we’ll need
  4. Set up GitHub to play nicely with Jenkins
  5. Set up Node to work with Jenkins
  6. Exposed build status icons

Now that we have all the necessary components to get a Node project up and running, we are ready to integrate a project! For that, let’s head over to [part 2](http://strongloop.com/?p=22492).