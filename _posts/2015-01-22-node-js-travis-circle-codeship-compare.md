---
id: 22645
title: 'Continuous Integration in the Cloud: Comparing Travis, Circle and Codeship'
date: 2015-01-22T07:44:41+00:00
author: Alex Gorbatchev
guid: http://strongloop.com/?p=22645
permalink: /strongblog/node-js-travis-circle-codeship-compare/
categories:
  - Cloud
---
Continuous Integration (CI) is an essential part to any modern development process. Gone are the days of monolithic releases with massive changes, today it’s all about releasing fast and often. Most teams have come to rely on some sort of automated CI system. In this article we are going to talk about some of the benefits of CI and how it fits into small, medium and large projects followed by a quick overview of three different hosted CI services and how they apply to projects of various sizes.

## **Continuous Integration**

Wikipedia [defines](http://en.wikipedia.org/wiki/Continuous_integration) Continuous Integration as

> … the practice, in software engineering, of merging all developer working copies with a shared mainline several times a day.

Continuous Integration is very frequently accompanied by Continuous Delivery/Deployment (CD) and very often when people talk about CI they refer to both.

CI relies on two main principles:

  1. Changes are merged to main source branch as often reasonably possible. The tasks are explicitly split up in such a way so that to avoid creating gigantic change sets.
  2. Each change is fully tested. Automated testing is the cornerstone of CI. In a team environment, and even on a personal project, it’s nearly impossible to insure that latest changes don’t break existing code without tests. Every time a change set is merged to master, CI runs entire suite to guarantee nothing was impacted negatively.

## **Open Source Projects**

If you have an open source project, whenever it’s a tiny NPM module or a large application, if it’s publicly hosted on [GitHub](https://github.com) or [BitBucket](https://bitbucket.org) and has automated tests, you can take advantage of CI right away. You will immediately see some benefits:

  1. Each time you push new changes, CI will pull your latests code, build, configure and run your tests in a clean environment. This means that if you forgot to commit a required library for example and the tests pass locally, they will fail on CI letting you know about the omission.
  2. At a minimum you could show your users on the README page that you have a passing build. At best, if you have hooked up a [Code Coverage](http://en.wikipedia.org/wiki/Code_coverage) tool you could show how much of the code is exercised by the automated test.

The configuration for CI in such projects is generally boils down to installing dependencies and running the tests. Any self-respecting hosted CI provider can handle this type of projects and given that majority of open source libraries are maintained by a sole developer, the builds for such projects don’t need to be happening very often nor they are very complicated.

In an effort to support and give back to open source, some CI providers offer free plans for open source projects. So if you have been working on one and don’t yet have CI hooked up, I recommend doing that right after finishing the article. You might have seen these  ![build passing](https://img.shields.io/badge/build-passing-green.svg?style=flat)badges around [GitHub](https://github.com). After setting up your project with a CI provider, you can then add a badge to the `README` file via [shields.io](https://img.shields.io) to proudly show of your passing build.

<!--more-->

## **Small Team Projects**

 <img src="http://npmawesome.com/wp-content/uploads/2015/01/you-broke-the-build.png" alt="" height="250" align="right" hspace="20" />Working on a small team of 10-15 people making changes to the same repository most of the time isn’t much different when it comes to CI than a small solo project. You make your changes, test locally, then push to master and CI takes over. At this scale you are most likely doploying each succesful build because it’s easy and straight forward. What are the benefits of this?

  1. Master branch is tested continuously insuring nobody has committed bad code.
  2. Latest changes are delivered to the customer immediately after they pass all tests.

This is the point however when some difficulties start to surface with the most basic CI setup:

  1. Because there is usually just one CI server, not all changes are tested individually. There is simply not enough time to do so when 10-15 people are pushing to master all the time. The changes are batched up while CI is crunching the previous change set. This means that if one of the developers commits problematic code, is will block everyone else who merged since the last successful release. This is called _breaking the build_. It’s bad. Until the problem is fixed, nobody can release anything and if you are in a rush to push something out this can be a pain in the neck.
  2. As the number of tests beings to grow, running the whole suite locally on developer machines becomes too time consuming. I found the breaking point to be somewhere around 45 minutes to an hour. If a contributor can run the whole suite in this time frame, it’s generally considered acceptable to sit and stare at the console output for nearly an hour at a time.

This problem is generally not severe enough to invest time and money into solving and most small teams just take it as occupational hazard. In the last couple of years a number of hosted CI providers emerged that try to capture this market and address some of the pain points that these small teams are experiencing:

  1. Remove the hassle of having to run and maintain your own CI infrastructure.
  2. Tools that try to speed up test runs by splitting them up to run in parallel.
  3. Seamless push to productions platforms like [Heroku](https://www.heroku.com/), [Amazon EC2](http://aws.amazon.com/ec2/) and [Google App Engine](https://cloud.google.com/appengine/docs).

It has been my personal observation however that even at this early stage, some projects begin to outgrow the features provided by most hosted CI services. More complex projects with interdependencies are very hard if not impossible to properly configure on most hosted CI platforms.

## **Large Team Projects**

Projects that keep growing begin to experience build paralysis for longer and longer as broken builds become more frequent with growing number of people committing and complexity of the system rising. It becomes impossibly difficult to run full test suite locally in a reasonable amount of time, so developers just being to use CI to test their changes in a way that it wasn’t meant to. Soon enough, if nothing is done, release process comes to a grinding halt.

This is the point when it’s time to bring CI in-house. None of the hosted CI providers that I know of can accommodate large application and deployment complexity. The actual CI process itself begins to experience changes as well:

  1. It no longer becomes feasible to run everyone changes through a single CI pipeline. Instead, individual contributors can test their changes using on demand CI instances with dozens, sometimes hundreds of virtual instances crunching through thousands and thousands of tests at the same time.
  2. Having passed all tests against master, the change is queued up to be integrated into the pre-release branch together with changes from other developers.
  3. Release is no longer managed through simple `git push` and doesn’t happen every time master is updated. Instead, all changes that have been integrated into a pre-release get released through a set of carefully choreographed motions unique to each project.

## Hosted CI Providers

Lets briefly look and compare three of the more popular hosted CI providers. I’m going to focus on a few primary points:

  1. Whether the service offers free service for open source projects.
  2. Cost for commercial user.
  3. Ease of configuration.

I’m going to look at [Travis CI](https://travis-ci.org), [Circle CI](https://circleci.com) and [Codeship](https://codeship.com). Lets go!

## **Travis CI**

 <img src="http://npmawesome.com/wp-content/uploads/2015/01/travis-logo.png" alt="" width="80" align="right" />Even though all three companies were started in 2011, somehow I feel that [Travis CI](https://travis-ci.org) is the grand daddy of hosted CI. Maybe it was the spammy bot that would automatically submit pull requests on [GitHub](https://github.com) to add `.travis.yml` file to your project that embedded it permanently in my head? Don’t know, I just feel that it has become de-facto CI platform for open source projects and it’s still free and coupled very tightly with [GitHub](https://github.com).

It has a pretty streamlined interface and very flexible configuration options. It’s commercial offering is on the higher end priced at $129/m to start and the open source version can feel cluttered with projects that aren’t related to you.

### Elevator Pitch

> Travis CI provides a free hosted continuous integration platform for the open source community, integrating tightly with GitHub. More than 70,000 active projects have run 10,000,000 builds (November 2013) since its inception in early 2011.
> 
> Travis CI supports 12 different language platforms natively in different incarnations and offers testing on Linux, iOS and Mac environments. Since 2012, Travis CI also offers a hosted continuous platform for private repositories. The product opened to the general public in August 2013 with more than 500 customers, among them Engine Yard, Heroku, ModCloth, Walmart Labs and BitTorrent.

<img class="screenshot" src="http://npmawesome.com/wp-content/uploads/2015/01/travis-ci-00.png" alt="" width="100%" />

<img class="screenshot" src="http://npmawesome.com/wp-content/uploads/2015/01/travis-ci-01.png" alt="" width="100%" />

<img class="screenshot" src="http://npmawesome.com/wp-content/uploads/2015/01/travis-ci-02.png" alt="" width="100%" />

<img class="screenshot" src="http://npmawesome.com/wp-content/uploads/2015/01/travis-ci-03.png" alt="" width="100%" />

### Project Fit

[Travis CI](https://travis-ci.org) is awesome for open source, big and small. Looking around at [GitHub](https://github.com) most of the testing is done on Travis. There are some historical reasons here but at the same time Travis makes adding a new project a breeze and for the most part you can forget about it until you get a failed test email in your inbox.

<span style="text-decoration: line-through;">Unfortunately <a href="https://travis-ci.org">Travis CI</a> doesn’t offer a trial period for their commercial version so I wasn’t able to evaluate that. Assuming that commercial offering is not a whole lot different than the open source one, a small team of developers could successfully run a project on <a href="https://travis-ci.org">Travis CI</a></span>.

[Travis CI](https://travis-ci.org) offers a trial period for their commercial version. If you have used free Travis you will feel right at home with its commercial counterpart. It looks and functions nearly identical to the free one with a few minor exceptions which include ability to build private GitHub repositories. I’m going to assume (and please correct me in the comments if I’m wrong) that there are no way to setup <span style="text-decoration: line-through;">interproject dependencies</span> projects that depend upon each other.

[Travis CI](https://travis-ci.org) recently started offering [enterprise version](https://enterprise.travis-ci.com/). The page doesn’t offer any additional information beyond ability to use your own build environments and have the whole thing locally hosted, so it’s really hard to say how it would fit with the larger projects. [Travis CI](https://travis-ci.org) Enterprise is basically a copy of the hosted commercial offering, packaged up as Docker images that can be run in closed or restricted networks.

### Pros

  * Unlimited open source projects with full functionality.
  * Extensive project configuration via `.travis.yml` file.
  * [Has own headless browser support](http://docs.travis-ci.com/user/gui-and-headless-browsers/#Using-xvfb-to-Run-Tests-That-Require-GUI-(e.g.-a-Web-browser)) (albeit Firefox only).
  * Allows to cluster tests and [run them in parallel](http://docs.travis-ci.com/user/speeding-up-the-build/).
  * Multiple build environments and target platforms (i.e. Node 0.10, 0.8, 0.6, Linux, OSX and so on).
  * Lots of deployment options.
  * Seamless UI integration with [GitHub](https://github.com).
  * The free version is fully [open sourced](https://github.com/travis-ci/travis-ci).
  * Self-hosted [enterprise version](https://enterprise.travis-ci.com/).

### Cons

  * Commercial plans start at $129/m.
  * No [BitBucket](https://bitbucket.org) support.

## **Circle CI**

 <img src="http://npmawesome.com/wp-content/uploads/2015/01/circleci-logo.png" alt="" width="80" align="right" />[Circle CI](https://circleci.com) makes the big push on speeding up your test run by splitting up your tests and running them parallel.

I like it’s slick UI and ability to run tests in parallel. The lack of open source support might be a limiting factor in wider adoptation.

### Elevator Pitch

> Circle CI makes it incredibly easy for developers to set up Continuous Integration and Deployment in minutes, improving the productivity of companies like Stripe and Zencoder by 90%.
> 
> Developers connect their Github account, and we automatically set up their tests. Circle CI supports Ruby, Python, Node, Java, PHP, and more, and are connected to MySQL, Mongo, Postgres, Cassandra, Riak, etc. Tests are run on a managed platform tuned for speed, can test many code pushes concurrently, and we split large test suites to run them in a fraction of the time, all automatically. When tests complete, new code is deployed automatically, to ensure the developers’ code gets to their customers immediately.

<img class="screenshot" src="http://npmawesome.com/wp-content/uploads/2015/01/circle-ci-00.png" alt="" width="100%" />

<img class="screenshot" src="http://npmawesome.com/wp-content/uploads/2015/01/circle-ci-01.png" alt="" width="100%" />

<img class="screenshot" src="http://npmawesome.com/wp-content/uploads/2015/01/circle-ci-02.png" alt="" width="100%" />

<img class="screenshot" src="http://npmawesome.com/wp-content/uploads/2015/01/circle-ci-03.png" alt="" width="100%" />

### Project Fit

[Circle CI](https://circleci.com) doesn’t offer support for open source projects. You could probably use their one free build container to manage your own public projects but it’s not explicitly touted as that.

Small size projects is where [Circle CI](https://circleci.com) positions itself with a reasonably priced $50/m plan to get started. They can partition your test files and run them in parallel (assuming that your test runner can take a list of files as arguments).

There doesn’t appear to be any kind of features targeting larger projects like dependencies, release queues and so on.

### Pros

  * One build container free, without limits.
  * Commercial plans start at $50/m.
  * Can split up and run tests in parallel.
  * [Extensive project configuration](https://circleci.com/docs/configuration) via `circle.yml` file.
  * [Docker support](https://circleci.com/docs/docker).
  * Bonus points for [open sourcing](https://github.com/circleci/frontend) circleci.com UI.

### Cons

  * No open source support.
  * <span style="text-decoration: line-through;">No open source support</span>.
  * Non obvious open source support that is only mentioned in a [blog post](http://blog.circleci.com/a-step-into-open-source/) and buried inside experimental settings panel.
  * No [BitBucket](https://bitbucket.org) support.
  * Limited deployment options.
  * Didn’t see a way to encrypt secrets.

## **Codeship**

 <img src="http://npmawesome.com/wp-content/uploads/2015/01/codeship-logo.png" alt="" width="80" align="right" />[Codeship](https://codeship.com) has been marketing [pretty agressively](https://twitter.com/rikurouvila/status/540107973805473792) recently with some high quality shwag.

I really like their project centered UI and it’s the only one of the bunch that has [BitBucket](https://bitbucket.org) and they let you connect up to five private projects for free. I feel that at this time [Codeship](https://codeship.com)‘s configuration might be its limiting factor and can make it difficult to set up more complicated scenarios.

### Elevator Pitch

> Codeship helps to release software quickly, automatically and multiple times a day. It shortens the development cycles thus reducing the risk of bugs and increasing innovation. It helps small as well as big software companies developing a better product faster.
> 
> Continuous Integration and deployment as Software-as-a-Service. Don’t waste your time setting up your own Jenkins server.

<img class="screenshot" src="http://npmawesome.com/wp-content/uploads/2015/01/codeship-00.png" alt="" width="100%" />

<img class="screenshot" src="http://npmawesome.com/wp-content/uploads/2015/01/codeship-01a.png" alt="" width="100%" />

<img class="screenshot" src="http://npmawesome.com/wp-content/uploads/2015/01/codeship-02.png" alt="" width="100%" />

<img class="screenshot" src="http://npmawesome.com/wp-content/uploads/2015/01/codeship-03.png" alt="" width="100%" />

### Project Fit

[Codeship](https://codeship.com) <span style="text-decoration: line-through;">also doesn’t explicitly support open source projects by calling it out</span> explicitly supports open source projects and poses no limits on number of builds. They offer a free plan, but limit it to 100 builds per month. It could be enough for some and limiting for others.

Their paid offering at $49/m to start remove the limit on private projects and build however I feel their configuration dashboard to be pretty basic and some teams might find themselves limited by that.

There doesn’t appear to be any kind of features targeting larger projects like dependencies, release queues and so on.

### Pros

  * Free plan has 5 private projects up to 100 builds per month.
  * Unlimited open source projects with full functionality.
  * Commercial plans start at $49/m.
  * [BitBucket](https://bitbucket.org) and [GitHub](https://github.com) integration.

### Cons

  * <span style="text-decoration: line-through;">No open source projects</span>.
  * Pretty basic configuration options via shell variables and admin interface.
  * No encryption of secrets.

## **Conclusion**

A good way to help you get a better understanding of what each CI provider capable of is some hands on time with each system. I recommend creating a small test project and giving each a try.

## **What&#8217;s Next?**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><strong>Recommended read:</strong> Check out Marc Harter&#8217;s <a href="http://strongloop.com/strongblog/roll-your-own-node-js-ci-server-with-jenkins-part-1/">two part</a> series on rolling your own CI server with Jenkins.</span>
</li>

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js <a href="http://loopback.io/">LoopBack framework</a>. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
</li>