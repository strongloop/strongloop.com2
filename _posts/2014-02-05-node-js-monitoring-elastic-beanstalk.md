---
id: 13582
title: Installing Node.js Monitoring and an API Server on Elastic Beanstalk
date: 2014-02-05T08:24:08+00:00
author: Jimmy Guerrero
guid: http://strongloop.com/?p=13582
permalink: /strongblog/node-js-monitoring-elastic-beanstalk/
categories:
  - Arc
  - Cloud
  - How-To
  - LoopBack
---
In this quick write up we are going to show you how to get [LoopBack](http://strongloop.com/mobile-application-development/loopback/)<span style="text-decoration: underline;">,</span> an open source API server and [StrongOps,](http://strongloop.com/node-js-performance/strongops/) a Node performance monitoring and cluster manager, up and running on Amazon&#8217;s [Elastic Beanstalk](http://aws.amazon.com/elasticbeanstalk/).

## **What is Elastic Beanstalk?**

With AWS Elastic Beanstalk, you can quickly deploy and manage applications in the AWS cloud without worrying about the infrastructure that runs those applications. AWS Elastic Beanstalk reduces management complexity without restricting choice or control. You simply upload your application, and AWS Elastic Beanstalk automatically handles the details of capacity provisioning, load balancing, scaling, and application health monitoring.

If you are new to Amazon Web Services, you can sign up [here](https://portal.aws.amazon.com/gp/aws/developer/registration/index.html) and check out their free tier.

Ok, let&#8217;s get started&#8230;
  
<!--more-->

## **Install StrongLoop locally**

Install the LoopBack API tier and sample application plus the StrongOps performance monitoring dashboard locally, by following these instructions.

_Note: These instructions assume you already have Node installed and aren’t running a previous version of StrongLoop. Platform specific instructions on how to install Node, individual StrongLoop components, plus how to upgrade can be found [here](http://docs.strongloop.com/display/DOC/Getting+started#Gettingstarted-Uninstallpreviousversion)._

**1. Install the StrongLoop Command Line Interface (cli)**

`$ npm install -g strong-cli`

_If you get permission errors, re-run commands with sudo_

**2. Verify your installation**

`$ slc version`

**3. Install the sample LoopBack application**

`$ slc example`

`$ cd sls-sample-app`

**4. Install and setup the StrongOps agent**

`$ slc strongops --register`

**5. Provide your full name, email and password when prompted**

**6. Create a StrongLoop account to access your StrongOps dashboard**

Go to <https://strongloop.com/register/>

_Use the same “email” and “password” you provided in Step #5._

**7. Populate the StrongOps dashboard with data by running the LoopBack sample app.**

`$ slc run .`

**8. You can now browse the LoopBack sample app at the URL below**

<a href="http://localhost:3000/" rel="nofollow">http://localhost:3000</a>

[<img class="aligncenter size-full wp-image-12724" alt="Screen Shot 2014-01-08 at 10.46.56 AM" src="https://strongloop.com/wp-content/uploads/2014/01/Screen-Shot-2014-01-08-at-10.46.56-AM.png" width="1103" height="916" />](https://strongloop.com/wp-content/uploads/2014/01/Screen-Shot-2014-01-08-at-10.46.56-AM.png)

**9. Start up a load generator to make the data that populates the StrongOps dashboard more interesting by opening up a new shell and executing:**

`$ cd sls-sample-app`

```$ slc run bin/create-load.js`

**10. Your dashboard is now ready**

<http://strongloop.com/ops/dashboard>

You will not see any data until your application has been running for a few minutes, so please be patient!

[<img class="aligncenter size-full wp-image-12156" alt="strongops-2" src="https://strongloop.com/wp-content/uploads/2013/12/strongops-2.png" width="1394" height="879" />](https://strongloop.com/wp-content/uploads/2013/12/strongops-2.png)

## **Zip up your application files**

Compress your application files into a zip file, in this case the application is the LoopBack sample app called, &#8220;sls-sample-app&#8221;.

## **Add the sample application to Elastic Beanstalk**

Head on over to the <a href="https://console.aws.amazon.com/elasticbeanstalk" rel="nofollow">Elastic Beanstalk Management Console</a> and preform these actions:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><strong style="font-size: 18px;">Actions > Launch New Environment</strong><span style="font-size: 18px;">.  If it&#8217;s your first application, click </span><strong style="font-size: 18px;">Create New Application</strong><span style="font-size: 18px;">.</span></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Enter a name for your application.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">For </span><strong style="font-size: 18px;">Environment tier</strong><span style="font-size: 18px;"> choose </span><strong style="font-size: 18px;">Web Server</strong><span style="font-size: 18px;">.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">For </span><strong style="font-size: 18px;">Predefined configuration</strong><span style="font-size: 18px;"> choose </span><strong style="font-size: 18px;">Node.js</strong><span style="font-size: 18px;">.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">For</span><strong style="font-size: 18px;"> Environment type</strong><span style="font-size: 18px;"> choose </span><strong style="font-size: 18px;">single instance</strong><span style="font-size: 18px;"> and click </span><strong style="font-size: 18px;">Continue</strong><span style="font-size: 18px;">.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Under </span><strong style="font-size: 18px;">Application Version</strong><span style="font-size: 18px;">, Choose </span><strong style="font-size: 18px;">Upload your own</strong><span style="font-size: 18px;">, click </span><strong style="font-size: 18px;">Choose File</strong><span style="font-size: 18px;">, then select the zip file you created in Step 3.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Enter a name, URL and description for your environment and click </span><strong style="font-size: 18px;">Continue</strong><span style="font-size: 18px;">.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Select </span><strong style="font-size: 18px;">Additional Resources</strong><span style="font-size: 18px;"> if you need them then click </span><strong style="font-size: 18px;">Continue</strong><span style="font-size: 18px;">.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Under </span><strong style="font-size: 18px;">Configuration details</strong><span style="font-size: 18px;">, select </span><strong style="font-size: 18px;">instance type</strong><span style="font-size: 18px;"> as </span><strong style="font-size: 18px;">micro</strong><span style="font-size: 18px;">. If you need SSH access to your virtual machine, select a key pair or create one. Enter all the other information such as email address you require then click </span><strong style="font-size: 18px;">Continue</strong><span style="font-size: 18px;">.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Review all the information then click </span><strong style="font-size: 18px;">Create</strong><span style="font-size: 18px;">.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">This will start your LoopBack application. You can access your app by clicking on the link <em><environment_name>.elasticbeanstalk.com/explorer</em> shown in the title of the managment console.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">If you enabled StrongOps monitoring, you can then view application metrics in the </span><a style="font-size: 18px;" href="http://strongloop.com/ops/dashboard" rel="nofollow">StrongOps dashboard</a><span style="font-size: 18px;"> once you&#8217;re logged in.</span>
</li>

[<img class="aligncenter size-full wp-image-13710" alt="00000053" src="https://strongloop.com/wp-content/uploads/2014/01/00000053.png" width="921" height="856" />](https://strongloop.com/wp-content/uploads/2014/01/00000053.png)

Note: We recommend using Node 0.10.22. To change the version of node in your environment, click on **Configuration > Software Configuration** and edit the Node version to 0.10.22.

## **What’s next?**

<li style="margin-left: 2em;">
  <span style="font-size: 17.77777862548828px;">Get the <a href="http://marketing.strongloop.com/acton/attachment/5334/u-0094/0/-/-/-/-/">technical paper</a> on how to &#8220;mobilize&#8221; data with models in LoopBack.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Check out this <a href="http://strongloop.com/developers/videos/#nodejs-performance-monitoring-with-the-strongops-2-preview">short video</a> on how the new features in StrongOps 2.0 including: memory and heap profiling, error detection and cluster management work.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Do you want to keep up on the latest Node, Mobile and StrongLoop news? Sign up for our newsletter, <a href="http://strongloop.com/newsletter">“In the Loop”</a> or follow us on <a href="https://twitter.com/StrongLoop">Twitter</a>.</span>
</li>