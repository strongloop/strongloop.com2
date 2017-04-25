---
id: 22492
title: 'Roll your own Node.js CI Server with Jenkins &#8211; Part 2'
date: 2015-01-12T07:46:37+00:00
author: Marc Harter
guid: http://strongloop.com/?p=22492
permalink: /strongblog/roll-your-own-node-js-ci-server-with-jenkins-part-2/
categories:
  - Community
  - How-To
---
In the first [article](http://strongloop.com/?p=22417), we focused on setting up Jenkins and configuring it to support Node projects. Please complete those steps if you haven’t already.

In this part, we will add an actual Node project to Jenkins with the following hotness:

  1. Code coverage analysis
  2. Test suite results
  3. Code style analysis
  4. Support for build badges
  5. Build hooks with GitHub

Finally we will round up by looking at open source tooling and [best practices for building and deploying node.js applications](http://strongloop.com/strongblog/node-js-deploy-production-best-practice/) in production.

Let’s look at setting up a new project in Jenkins.

<!--more-->

## Setting up a Node project

First, create a new Jenkins project by selecting “New Item” from the navigation sidebar **(1)**. Then, enter a name **(2)** for the project and choose “Build a free-style software project” **(3)**. Lastly, click “OK” **(4)** to configure it:

<p style="text-align: center">
  <a href="https://strongloop.com/wp-content/uploads/2015/01/Project1.png"><img class="aligncenter  wp-image-22438" src="https://strongloop.com/wp-content/uploads/2015/01/Project1.png" alt="" width="680" height="506" srcset="https://strongloop.com/wp-content/uploads/2015/01/Project1.png 1260w, https://strongloop.com/wp-content/uploads/2015/01/Project1-300x223.png 300w, https://strongloop.com/wp-content/uploads/2015/01/Project1-1030x765.png 1030w, https://strongloop.com/wp-content/uploads/2015/01/Project1-705x524.png 705w, https://strongloop.com/wp-content/uploads/2015/01/Project1-450x334.png 450w" sizes="(max-width: 680px) 100vw, 680px" /></a>
</p>

After submitting, the main project configuration page appears. We will frequent this page in the remainder of the tutorial.

### Configuring the repository

The first thing we will configure is our GitHub repository. We have a fictional setup for this tutorial called [jenkins-example](https://github.com/strongloop-community/jenkins-example). However, GitHub hooks won’t work unless you have administrative rights so _you will need to fork the repo_ to play along. Just replace any references to the StrongLoop repository with yours.

On the current _Project Configuration Page_ head to the “Source Code Management” section and select “Git” **(1)**. Then, enter your project repository URL **(2)** and select the credentials for GitHub **(3)** from the dropdown. The remaining defaults are good:

<p style="text-align: center">
  <a href="https://strongloop.com/wp-content/uploads/2015/01/Project2.png"><img class="aligncenter  wp-image-22439" src="https://strongloop.com/wp-content/uploads/2015/01/Project2.png" alt="" width="734" height="264" srcset="https://strongloop.com/wp-content/uploads/2015/01/Project2.png 1360w, https://strongloop.com/wp-content/uploads/2015/01/Project2-300x107.png 300w, https://strongloop.com/wp-content/uploads/2015/01/Project2-1030x369.png 1030w, https://strongloop.com/wp-content/uploads/2015/01/Project2-450x161.png 450w" sizes="(max-width: 734px) 100vw, 734px" /></a>
</p>

Under “Build Triggers” **(1)**, check “Build when a change is pushed to GitHub”. Then, click “Save” **(2)**:

<p style="text-align: center">
  <a href="https://strongloop.com/wp-content/uploads/2015/01/Project3.png"><img class="aligncenter  wp-image-22440" src="https://strongloop.com/wp-content/uploads/2015/01/Project3.png" alt="" width="682" height="338" srcset="https://strongloop.com/wp-content/uploads/2015/01/Project3.png 1264w, https://strongloop.com/wp-content/uploads/2015/01/Project3-300x148.png 300w, https://strongloop.com/wp-content/uploads/2015/01/Project3-1030x510.png 1030w, https://strongloop.com/wp-content/uploads/2015/01/Project3-450x222.png 450w" sizes="(max-width: 682px) 100vw, 682px" /></a>
</p>

Let’s expose `node` and `npm` as well so we can execute all our tests from the shell. To do this, scroll down to “Build Environment” and check “Provide Node & npm bin/ folder to PATH” **(1)**. Then, select the desired Node installation **(2) **and save **(3)**.

<p style="text-align: center">
  <a href="https://strongloop.com/wp-content/uploads/2015/01/Project3a.png"><img class="aligncenter  wp-image-22441" src="https://strongloop.com/wp-content/uploads/2015/01/Project3a.png" alt="" width="685" height="318" srcset="https://strongloop.com/wp-content/uploads/2015/01/Project3a.png 1268w, https://strongloop.com/wp-content/uploads/2015/01/Project3a-300x139.png 300w, https://strongloop.com/wp-content/uploads/2015/01/Project3a-1030x477.png 1030w, https://strongloop.com/wp-content/uploads/2015/01/Project3a-450x208.png 450w" sizes="(max-width: 685px) 100vw, 685px" /></a>
</p>

Now our project is configured to: pull from our GitHub repo, build whenever we push a new commit to `master`, and use Node.

Let’s try it out by clicking “Build Now” **(1)** on the _Main Project Page_ (you are staring at it). You will see a progress bar start rolling in the “Build History” section. This progress bar will eventually be based on the time your _last_ build took. If everything is peachy, you’ll see a blue orb **(2)** indicating a successful build:

<p style="text-align: center">
  <a href="https://strongloop.com/wp-content/uploads/2015/01/Project4.png"><img class="aligncenter  wp-image-22442" src="https://strongloop.com/wp-content/uploads/2015/01/Project4.png" alt="" width="682" height="509" srcset="https://strongloop.com/wp-content/uploads/2015/01/Project4.png 1264w, https://strongloop.com/wp-content/uploads/2015/01/Project4-300x223.png 300w, https://strongloop.com/wp-content/uploads/2015/01/Project4-1030x767.png 1030w, https://strongloop.com/wp-content/uploads/2015/01/Project4-450x335.png 450w" sizes="(max-width: 682px) 100vw, 682px" /></a>
</p>

Of course, the project isn’t too interesting at this point. We basically installed Node (if it hadn’t been already), checked out the lastest `master` and exited. Let’s start adding some useful reports.

## Adding test and code coverage reporting

We can make our build fail if the test runner reports a non-zero exit code, but we’d rather report the results of all the individual tests in order to pinpoint a problem. And while we are at it, let’s see where we are missing tests by adding code coverage as well!

We will use `istanbul` to generate coverage reports and have our test runner write out a [TAP](http://en.wikipedia.org/wiki/Test_Anything_Protocol) report. TAP output has great support among popular testing frameworks (i.e. `mocha` and `tape`). In our example, we will use `tape`:

```js
npm install tape istanbul --save-dev
```

> We won’t be writing any tests here but you can see the [jenkins-example](https://github.com/strongloop-community/jenkins-example) for a sample.

Then, let’s add an npm script that will generate test and coverage output. The script will formatted as such:

```js
istanbul cover [test command] &gt; test.tap && istanbul report clover
```

In our case, since `tape` outputs TAP by default, the [test command] will be:

```js
tape test/*-test.js
```

> If you are using `mocha`, it would look something like `_mocha -- -R tap \"test/*-test.js\"`

Pulling it all together, we use the following `ci-test` script in the jenkins-example repo:

```js
"scripts": {
    "ci-test": "istanbul cover tape \"test/*-test.js\" &gt; test.tap && istanbul report clover"
}
```

With this code on GitHub, switch over to Jenkins and visit the _Project Configuration Page_ again. This time we are going to add a build step by visiting the “Build” section, clicking the “Add Build Step” dropdown and selecting “Execute shell”:

<p style="text-align: center">
  <a href="https://strongloop.com/wp-content/uploads/2015/01/Project5.png"><img class="aligncenter  wp-image-22443" src="https://strongloop.com/wp-content/uploads/2015/01/Project5.png" alt="" width="452" height="175" srcset="https://strongloop.com/wp-content/uploads/2015/01/Project5.png 836w, https://strongloop.com/wp-content/uploads/2015/01/Project5-300x116.png 300w, https://strongloop.com/wp-content/uploads/2015/01/Project5-450x174.png 450w" sizes="(max-width: 452px) 100vw, 452px" /></a>
</p>

This will allow you to run arbitrary commands on the shell. Add the following commands in the text area that appears.

```js
npm install
npm run ci-test || :
```

Head down to the “Post-build actions” and add a “Publish TAP Results” **(1)** from the dropdown. Then, add the `test.tap` output we create from our `ci-test`script to the “Test results” input **(2)**:

<p style="text-align: center">
  <a href="https://strongloop.com/wp-content/uploads/2015/01/Project6.png"><img class="aligncenter  wp-image-22444" src="https://strongloop.com/wp-content/uploads/2015/01/Project6.png" alt="" width="744" height="302" srcset="https://strongloop.com/wp-content/uploads/2015/01/Project6.png 1378w, https://strongloop.com/wp-content/uploads/2015/01/Project6-300x121.png 300w, https://strongloop.com/wp-content/uploads/2015/01/Project6-1030x417.png 1030w, https://strongloop.com/wp-content/uploads/2015/01/Project6-450x182.png 450w" sizes="(max-width: 744px) 100vw, 744px" /></a>
</p>

Next, add the action “Publish Clover Coverage Report” **(1)** to the “Post-build actions” dropdown. Then, add “coverage” as the “Clover report directory” **(2) **as `istanbul` uses that folder for default:

<p style="text-align: center">
  <a href="https://strongloop.com/wp-content/uploads/2015/01/Project7.png"><img class="aligncenter  wp-image-22445" src="https://strongloop.com/wp-content/uploads/2015/01/Project7.png" alt="" width="685" height="406" srcset="https://strongloop.com/wp-content/uploads/2015/01/Project7.png 1268w, https://strongloop.com/wp-content/uploads/2015/01/Project7-300x177.png 300w, https://strongloop.com/wp-content/uploads/2015/01/Project7-1030x610.png 1030w, https://strongloop.com/wp-content/uploads/2015/01/Project7-450x266.png 450w" sizes="(max-width: 685px) 100vw, 685px" /></a>
</p>

Notice there are a lot of options to determine the health of the build. You may want to adjust those depending on the makeup of your project to be more “Stormy” when coverage isn’t met.

Now that coverage and test reports are integrated, let’s **save** our configuration and click “Run Build” again on the _Main Project Page_. After that builds, we can _refresh_ the Project page to start seeing results:

<p style="text-align: center">
  <a href="https://strongloop.com/wp-content/uploads/2015/01/Project8.png"><img class="aligncenter  wp-image-22446" src="https://strongloop.com/wp-content/uploads/2015/01/Project8.png" alt="" width="760" height="341" srcset="https://strongloop.com/wp-content/uploads/2015/01/Project8.png 1406w, https://strongloop.com/wp-content/uploads/2015/01/Project8-300x134.png 300w, https://strongloop.com/wp-content/uploads/2015/01/Project8-1030x462.png 1030w, https://strongloop.com/wp-content/uploads/2015/01/Project8-450x202.png 450w" sizes="(max-width: 760px) 100vw, 760px" /></a>
</p>

As you run more builds, the _Main Project Page_ graphs will also change. Let’s add code style reporting.

## Adding code style reporting

In addition to coverage and test reporting, we can also set up [checkstyle](http://checkstyle.sourceforge.net/) reporting. This format has good support among popular linting frameworks (i.e. `jshint` and `eslint`). In our example, we will use `eslint`:

```js
npm install eslint --save-dev
```

> We won’t be defining any style rules with `eslint` here, but you can see the [jenkins-example](https://github.com/strongloop-community/jenkins-example) for a sample ruleset.

In our case, the command to configure `eslint` for checkstyle output is:

```js
eslint -f checkstyle index.js
```

> If you are using `jshint`, it would be `jshint --reporter=checkstyle index.js`

Let’s add a `ci-lint` script next to our `ci-test` to run the linting and output it to _checkstyle-result.xml_:

```js
"scripts": {
    "ci-test": "istanbul cover tape \"test/*-test.js\" &gt; test.tap && istanbul report clover",
    "ci-lint": "eslint -f checkstyle index.js &gt; checkstyle-result.xml"
}
```

Now, let’s switch over to Jenkins and visit the _Project Configuration Page_ again for our _Test Project_. We’ll add `npm run ci-lint || :` to our shell execution:

<p style="text-align: center">
  <a href="https://strongloop.com/wp-content/uploads/2015/01/Project10.png"><img class="aligncenter  wp-image-22448" src="https://strongloop.com/wp-content/uploads/2015/01/Project10.png" alt="" width="545" height="167" srcset="https://strongloop.com/wp-content/uploads/2015/01/Project10.png 1008w, https://strongloop.com/wp-content/uploads/2015/01/Project10-300x92.png 300w, https://strongloop.com/wp-content/uploads/2015/01/Project10-450x138.png 450w" sizes="(max-width: 545px) 100vw, 545px" /></a>
</p>

Next, add another post-build action called “Publish Checkstyle analysis results” **(1)**. Since we are using the default output filename in `ci-lint`, we can click “Save” **(2)**:

<a style="text-align: center" href="https://strongloop.com/wp-content/uploads/2015/01/Project9.png"><img class="aligncenter  wp-image-22447" src="https://strongloop.com/wp-content/uploads/2015/01/Project9.png" alt="" width="680" height="355" srcset="https://strongloop.com/wp-content/uploads/2015/01/Project9.png 1260w, https://strongloop.com/wp-content/uploads/2015/01/Project9-300x156.png 300w, https://strongloop.com/wp-content/uploads/2015/01/Project9-1030x536.png 1030w, https://strongloop.com/wp-content/uploads/2015/01/Project9-450x234.png 450w" sizes="(max-width: 680px) 100vw, 680px" /></a>

Just like the Coverage plugin discussed above, there are many ways to configure the health of builds based on which warning or error thresholds are exceeded in the “Advanced” settings for this plugin. Adjust this as it makes sense for your project.

Now click “Run Build” again on the _Main Project Page_. After that builds, we can _refresh_ the Project page and we’ll see more results:

<p style="text-align: center">
  <a href="https://strongloop.com/wp-content/uploads/2015/01/Project11.png"><img class="aligncenter  wp-image-22449" src="https://strongloop.com/wp-content/uploads/2015/01/Project11.png" alt="" width="1123" height="778" srcset="https://strongloop.com/wp-content/uploads/2015/01/Project11.png 2080w, https://strongloop.com/wp-content/uploads/2015/01/Project11-300x207.png 300w, https://strongloop.com/wp-content/uploads/2015/01/Project11-1030x713.png 1030w, https://strongloop.com/wp-content/uploads/2015/01/Project11-1500x1038.png 1500w, https://strongloop.com/wp-content/uploads/2015/01/Project11-450x311.png 450w" sizes="(max-width: 1123px) 100vw, 1123px" /></a>
</p>

Pretty sweet, huh? Let’s bring it back to our GitHub project by adding a status badge.

## Embedding status badges on GitHub

Click the “Embeddable Build Status” icon in the project sidebar to reveal embeddable markup. Copy and paste the relevant format for your readme file. Make sure to copy the _unprotected_ markup so it can be accessed anonymously:

<p style="text-align: center">
  <a href="https://strongloop.com/wp-content/uploads/2015/01/Project12.png"><img class="aligncenter  wp-image-22450" src="https://strongloop.com/wp-content/uploads/2015/01/Project12.png" alt="" width="476" height="119" srcset="https://strongloop.com/wp-content/uploads/2015/01/Project12.png 882w, https://strongloop.com/wp-content/uploads/2015/01/Project12-300x74.png 300w, https://strongloop.com/wp-content/uploads/2015/01/Project12-450x112.png 450w" sizes="(max-width: 476px) 100vw, 476px" /></a>
</p>

Add that snippet to your readme for this result:

<p style="text-align: center">
  <a href="https://strongloop.com/wp-content/uploads/2015/01/Project13.png"><img class="aligncenter  wp-image-22451" src="https://strongloop.com/wp-content/uploads/2015/01/Project13.png" alt="" width="444" height="77" srcset="https://strongloop.com/wp-content/uploads/2015/01/Project13.png 822w, https://strongloop.com/wp-content/uploads/2015/01/Project13-300x52.png 300w, https://strongloop.com/wp-content/uploads/2015/01/Project13-450x78.png 450w" sizes="(max-width: 444px) 100vw, 444px" /></a>
</p>

## Where we do go from here?

Now you should have a running example of a repository fully integrated with Jenkins. Hoorah! Poke around to see the kinds of reports and data that can be drawn out of the tools. I hope this tutorial saved you valuable time.

I’ll leave you with more tips for Jenkins functionality that we didn’t cover in this tutorial:

  1. Want successful builds pushed right away to test environments? Or make manual production deployments with a click of a button? Check out the [Promoted Builds Plugin](https://wiki.jenkins-ci.org/display/JENKINS/Promoted+Builds+Plugin)
  2. Send an email to those who break the build by setting up a post build action on the _Project Configuration Page_.
  3. Run isolated build environments using Docker containers with the [Docker Plugin](https://wiki.jenkins-ci.org/display/JENKINS/Docker+Plugin).
  4. Handle pull requests with the [GitHub pull request builder plugin](https://wiki.jenkins-ci.org/display/JENKINS/GitHub+pull+request+builder+plugin).
  5. Mark the build status on GitHub commits by adding a “Set build status on GitHub commit” post-build action on the _Project Configuration Page_.
  6. And [so much more](https://wiki.jenkins-ci.org/display/JENKINS/Plugins).

Continual feedback is incredibly helpful for the health of any serious project. Let Jenkins take care of all the busy work of running tools and generating reports to give you time to focus on the fun stuff: the code itself. If you use Jenkins already, please share your helpful plugins/workflows in the comments!

## Additional open source innovations and deployment best practices

One of the struggles developers face when moving to Node.js is the lack of best practices for automated deployment of Node applications. The challenges are many-fold – packaging and dependency management, single step deploy, and start/re-start without bringing down the house!

There are tools out there, but they are often not composable, are incomplete, or we just don’t agree with how they do things. StrongLoop&#8217;s Node.js core team members have created modular tooling  to solve these problems like [`strong-build`](http://docs.strongloop.com/display/SLC/slc+build), to package your application for deployment, and [`strong-deploy`](http://docs.strongloop.com/display/SLC/slc+deploy) to push your application packages to [`strong-pm`](http://docs.strongloop.com/display/SLC/slc+pm), the process manager that will manage your deployed applications.

Check out the [production best practices ](http://strongloop.com/strongblog/node-js-deploy-production-best-practice/) blog by Sam Roberts.

[Push button build and deploy](http://docs.strongloop.com/display/ARC/Build+and+Deploy) have also been featured in [StrongLoop Arc](http://strongloop.com/node-js/arc/), the graphical UI for end to end lifecycle management of Node.js applications and APIs.

[<img class="aligncenter size-large wp-image-21570" src="https://strongloop.com/wp-content/uploads/2014/12/Build_Deploy-1030x528.jpg" alt="Build_Deploy" width="1030" height="528" srcset="https://strongloop.com/wp-content/uploads/2014/12/Build_Deploy-1030x528.jpg 1030w, https://strongloop.com/wp-content/uploads/2014/12/Build_Deploy-300x153.jpg 300w, https://strongloop.com/wp-content/uploads/2014/12/Build_Deploy-1500x769.jpg 1500w, https://strongloop.com/wp-content/uploads/2014/12/Build_Deploy-450x230.jpg 450w" sizes="(max-width: 1030px) 100vw, 1030px" />](https://strongloop.com/wp-content/uploads/2014/12/Build_Deploy.jpg)

Continual enhancements have been requested by the community and are being planned for more distributed and scaled deployments in Arc.