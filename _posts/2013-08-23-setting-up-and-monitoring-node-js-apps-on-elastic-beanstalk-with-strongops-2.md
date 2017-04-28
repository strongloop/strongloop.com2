---
id: 6639
title: Setting Up and Monitoring Node.js Apps on Elastic Beanstalk with StrongOps
date: 2013-08-23T09:39:36+00:00
author: Dave Whiteley
guid: http://blog.strongloop.com/?p=1516
permalink: /strongblog/setting-up-and-monitoring-node-js-apps-on-elastic-beanstalk-with-strongops-2/
categories:
  - Cloud
---
<p dir="ltr">
  There has been a lot of talk in the news lately about Amazon Web Services and AWS Elastic Beanstalk. The ability to use this deployment agent for Node.js means it is simple to get your Node.js product in the AWS Cloud. Since we like simplicity and we fully encourage you to monitor Node.js from the start, we wanted to test installing the StrongOps agent to monitor a Node.js product on Beanstalk. Luckily, StrongLoop&#8217;s Andrew Martens was on scene to walk us through.
</p>

To monitor your product, you first need to install it. And we found that setting up on Elastic Beanstalk was straightforward. You can do so through Git, or through the Eb command line interface.

Note that while we are covering some of the steps for set-up here, it is a general overview. Please refer to the AWS documentation for complete details.

The first thing you will want to do is sign up for AWS. Sign into AWS when you are done signing up, or if you have already created an account.

<p dir="ltr">
  <a href="http://aws.amazon.com/console/">http://aws.amazon.com/console/</a>
</p>

Go to the Security Credentials page:

<p dir="ltr">
  <a href="https://portal.aws.amazon.com/gp/aws/securityCredentials">https://portal.aws.amazon.com/gp/aws/securityCredentials</a>
</p>

<p dir="ltr">
  Create an Access Key (or maybe make a new one for managing your EB)
</p>

<p dir="ltr">
  You will be given your Access Key ID, which you will need during the install process. The Access key is available in the Security Credentials section on the left hand side of the screen.
</p>

<p dir="ltr">
  <a href="{{site.url}}/blog-assets/2013/08/eb-1.png"><img class="alignnone size-medium wp-image-19194" alt="eb 1" src="{{site.url}}/blog-assets/2013/08/eb-1-300x192.png" width="300" height="192" /></a>
</p>

<p dir="ltr">
  Download the dev tools and add them to your path. You will find them here:
</p>

<p dir="ltr">
  <a href="http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/GettingStarted.GetSetup-devtools.html">http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/GettingStarted.GetSetup-devtools.html</a>
</p>

We also liked the command line tool available here:

<p dir="ltr">
  <a href="http://aws.amazon.com/code/6752709412171743">http://aws.amazon.com/code/6752709412171743</a>
</p>

<p dir="ltr">
  Now unzip somewhere. We chose to do so here: ~/aws
</p>

<p dir="ltr">
  Create a new git repository:
</p>

```js
$ git init .
```

<p dir="ltr">
  Run the AWS dev tools in that directory:
</p>

```js
$ ~/aws/AWS-ElasticBeanstalk-CLI-2.3.1/AWSDevTools/Linux/AWSDevTools-RepositorySetup.sh
```

<p dir="ltr">
  Is everything going well? Good. Let’s keep going.
</p>

<p dir="ltr">
  Put some code together. We’re providing a simple example by installing Express. You can use that, or some other app. Ensure that it&#8217;s up-to-date and use best practices.
</p>

<p dir="ltr">
  Install &#8216;express&#8217; with npm and then run it.
</p>

```js
$ npm install -g express
$ express
```

<p dir="ltr">
  Now put the StrongOps header at the top of app.js:
</p>

```js
require('strong-agent').profile(
'use value from "How To" page',
"aws-test"
;
```

<p dir="ltr">
  Don&#8217;t forget to update your package.json, add the dependency:
</p>

<p dir="ltr">
  &#8220;strong-agent&#8221;: &#8220;latest&#8221;
</p>

<p dir="ltr">
  And then let npm pull down all of our dependencies:
</p>

```js
$ npm install
```

<p dir="ltr">
  This is a good time to test things locally just to make sure you didn&#8217;t screw up.  Open up <a href="http://localhost:3000/">http://localhost:3000/</a> in your browser.
</p>

<p dir="ltr">
  You can also then go and check out <a href="http://strongloop.com/#dashboard">the StrongOps console</a> to see if your new app is showing up. As you can see below, our Express app has a heartbeat.
</p>

<span style="font-size: 13px;"><a href="{{site.url}}/blog-assets/2013/08/eb-2.png"><img class="alignnone size-medium wp-image-19195" alt="eb 2" src="{{site.url}}/blog-assets/2013/08/eb-2-300x174.png" width="300" height="174" /></a></span>

<span style="font-size: 13px;">Now, add the next three lines to your .gitignore file to skip things we don&#8217;t need to store in git:</span>

```js
node_modules/
.gitignore
.elasticbeanstalk/
```

<p dir="ltr">
  You can also add the platform-specific eb path to your $PATH
</p>

```js
$ export PATH="$PATH:/Users/andrew/aws/AWS-ElasticBeanstalk-CLI-2.3.1/eb/macosx/python2.7"
```

Run eb:

```js
$ eb init
```

<p dir="ltr">
  Remember the AWS Access Key ID and Secret Access Key you got earlier? If you forget, just pop on back to:
</p>

<p dir="ltr">
  <a href="https://aws-portal.amazon.com/gp/aws/securityCredentials">https://aws-portal.amazon.com/gp/aws/securityCredentials</a>
</p>

<p dir="ltr">
  Enter your AWS Access Key ID.
</p>

<p dir="ltr">
  Enter your AWS Secret Access Key.
</p>

<p dir="ltr">
  Select an AWS Elastic Beanstalk service region (you will see a list of 8 available service regions).
</p>

<p dir="ltr">
  Enter an AWS Elastic Beanstalk application name (auto-generated value is &#8220;aws-test&#8221;).
</p>

<p dir="ltr">
  Enter an AWS Elastic Beanstalk environment name (auto-generated value is &#8220;aws-test-env&#8221;).
</p>

<p dir="ltr">
  Select a solution stack (you will see a list of 18 available solution stacks).
</p>

<p dir="ltr">
  Create an RDS DB Instance? [y/n]: n
</p>

<p dir="ltr">
  Updated AWS Credential file at &#8220;/Users/[username]/.elasticbeanstalk/aws_credential_file&#8221;.
</p>

```js
$ eb start
```

<p dir="ltr">
  This deploys the pretty default node.js app to EB.
</p>

<p dir="ltr">
  Let&#8217;s check out the console:
</p>

<p dir="ltr">
  <a href="https://console.aws.amazon.com/elasticbeanstalk/home">https://console.aws.amazon.com/elasticbeanstalk/home</a>
</p>

<p dir="ltr">
  There&#8217;s also a handy button to go and see the default EB app that&#8217;s been installed:
</p>

[<img class="alignnone size-medium wp-image-19196" alt="eb 3" src="{{site.url}}/blog-assets/2013/08/eb-3-300x165.png" width="300" height="165" />]({{site.url}}/blog-assets/2013/08/eb-3.png)

Let&#8217;s take a look at that:

[<img class="alignnone size-medium wp-image-19197" alt="eb 4" src="{{site.url}}/blog-assets/2013/08/eb-4-300x163.png" width="300" height="163" />]({{site.url}}/blog-assets/2013/08/eb-4.png)

<p dir="ltr">
  Now, let&#8217;s upload our own express app that we added StrongOps to:
</p>

```js
$ git add .
```

```js
$ git commit -m "Demo app"
[master (root-commit) f5ae4e6] Demo app
9 files changed, 141 insertions(+)
create mode 100644 .elasticbeanstalk/config
create mode 100644 .elasticbeanstalk/optionsettings.aws-test-env
create mode 100644 app.js
create mode 100644 package.json
create mode 100644 public/stylesheets/style.css
create mode 100644 routes/index.js
create mode 100644 routes/user.js
create mode 100644 views/index.jade
create mode 100644 views/layout.jade
```

```js
$ git aws.push
Counting objects: 16, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (14/14), done.
Writing objects: 100% (16/16), 2.42 KiB, done.
Total 16 (delta 0), reused 0 (delta 0)
remote:
To <a href="about:blank">https://</a>.….
* [new branch]   HEAD -> master
```

<p dir="ltr">
  Go back to the Eb console and monitor your application&#8217;s status there:
</p>

<p dir="ltr">
  <a href="https://console.aws.amazon.com/elasticbeanstalk/home?region=us-west-2">https://console.aws.amazon.com/elasticbeanstalk/home</a>
</p>

<p dir="ltr">
  It will take a few minutes to deploy and restart.
</p>

<p dir="ltr">
  Once it&#8217;s up, check out your application again via the &#8220;View Running Version&#8221; button.
</p>

[<img class="alignnone size-medium wp-image-19198" alt="eb 5" src="{{site.url}}/blog-assets/2013/08/eb-5-300x162.png" width="300" height="162" />]({{site.url}}/blog-assets/2013/08/eb-5.png)

<p dir="ltr">
  Hooray, it&#8217;s the default Express app!
</p>

<p dir="ltr">
  Now let&#8217;s go back to our StrongOps screen and see the data coming in from our application:
</p>

<p dir="ltr">
  <a href="{{site.url}}/blog-assets/2013/08/eb-final.png"><img class="alignnone size-medium wp-image-19199" alt="eb final" src="{{site.url}}/blog-assets/2013/08/eb-final-300x174.png" width="300" height="174" /></a>
</p>

<p dir="ltr">
  VICTORY! We’ve gotten our app &#8211; Express, in this case &#8211; on Elastic Beanstalk.  We&#8217;ve also installed the StrongOps agent and can now monitor Express&#8217;s performance. We have the visibility we want to monitor, profile and improve our app, and were able to get it online quite easily with Elastic Beanstalk.
</p>

## **[What’s next?](http://strongloop.com/get-started/)**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What’s in the upcoming Node v0.12 release? <a href="http://strongloop.com/node-js/whats-new-in-node-js-v0-12/">Six new features, plus new and breaking APIs</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js <a href="http://strongloop.com/node-js/loopback/">LoopBack framework</a>. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Need <a href="http://strongloop.com/node-js-support/expertise/"]]>training and certification</a> for Node? Learn more about both the private and open options StrongLoop offers.</span>
</li>