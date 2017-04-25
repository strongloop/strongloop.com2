---
id: 12780
title: Install Node.js monitoring and a mobile backend on Nodejitsu
date: 2014-01-09T09:25:40+00:00
author: Jimmy Guerrero
guid: http://strongloop.com/?p=12780
permalink: /strongblog/install-node-js-monitoring-and-a-mobile-backend-on-nodejitsu/
categories:
  - Arc
  - Cloud
  - Community
  - How-To
  - LoopBack
---
In this quick write up we are going to show you how to get  [LoopBack](http://strongloop.com/mobile-application-development/loopback/) (open source mobile backend) and [StrongOps](http://strongloop.com/node-js-performance/strongops/) (Node performance monitoring and cluster manager) up and running on [Nodejitsu](https://www.nodejitsu.com/).

## **What is Nodejitsu?**

Nodejitsu is a simple and reliable hosting platform for Node.js apps. The platform has a few great things going for it:

  * If you are hosting an open source project, chances are Nodejitsu will [host it for free](http://opensource.nodejitsu.com/)
  * Support for [continuous deployment](https://www.nodejitsu.com/getting-started-with-github/)
  * WebSocket support
  * Built using Node.js, soup to nuts
  * Ability to [choose your infrastructure provider](https://www.nodejitsu.com/paas/datacenters/)
  * Uses npm for deployments &#8211; just like StrongLoop
  * No special tweaks required for your app to run. If it&#8217;s Node, you are good to go
  * Support for a [variety of datastores](https://www.nodejitsu.com/paas/addons/), including: CouchDB, Redis, MongoLab, and MongoHQ

If you want to watch a quick 2 minute video to see how StrongLoop is installed via npm, check this out:



<h2 dir="ltr">
</h2>

<h2 dir="ltr">
  <strong>Assumption: You already have Node running locally</strong>
</h2>

<p dir="ltr">
  If you don’t already have Node installed, you can download the latest version from <a href="http://nodejs.org/download/">nodejs.org</a> for your particular platform.
</p>

<p dir="ltr">
  <h2 dir="ltr">
  </h2>
  
  <h2 dir="ltr">
    <strong>Step 1:  Install the StrongLoop Command Line Interface (cli) locally</strong>
  </h2>
  
  <p>
    <code> $ npm install -g strong-cli&lt;br />
</code><br /> <em>Note: If you get permission errors, re-run commands with sudo</em>
  </p>
  
  <h2 dir="ltr">
    <strong>Step 2: Verify your installation</strong>
  </h2>
  
  <p>
    <code> $ slc version</code>
  </p>
  
  <h2 dir="ltr">
    <strong>Step 3: Install the sample LoopBack application</strong>
  </h2>
  
  <p>
    <code> $ slc example&lt;br />
$ cd sls-sample-app</code>
  </p>
  
  <h2 dir="ltr">
    <strong>Step 4: Install and setup the StrongOps agent</strong>
  </h2>
  
  <p>
    <code> $ slc strongops --register&lt;br />
</code>
  </p>
  
  <h2 dir="ltr">
    <strong>Step 5: Provide your full name, email and password when prompted.</strong>
  </h2>
  
  <p>
    &nbsp;
  </p>
  
  <h2 dir="ltr">
    <strong>Step 6: Create a StrongLoop account to access your StrongOps dashboard</strong>
  </h2>
  
  <p>
    Go to <a href="https://strongloop.com/register/">https://strongloop.com/register/</a>
  </p>
  
  <p>
    <em>Note: Use the “email” you provided in Step #5 as your “email” plus use the same ”password”.</em>
  </p>
  
  <h2 dir="ltr">
    <strong>Step 7: Your dashboard is ready here:</strong>
  </h2>
  
  <p>
    <a href="http://strongloop.com/ops/dashboard">http://strongloop.com/ops/dashboard</a>
  </p>
  
  <p>
    <em>Note: You will not see any data until your application has been running for a few minutes. So, please make sure to execute the next step.</em>
  </p>
  
  <p>
    &nbsp;
  </p>
  
  <p>
    <a href="https://strongloop.com/wp-content/uploads/2013/11/heap_memory1.png"><img class="aligncenter size-full wp-image-10945" alt="heap_memory" src="https://strongloop.com/wp-content/uploads/2013/11/heap_memory1.png" width="850" height="315" /></a>
  </p>
  
  <p>
    &nbsp;
  </p>
  
  <p>
    &nbsp;
  </p>
  
  <h2 dir="ltr">
    <strong>Step 8: Explore the sample application by running it and then visiting the URL below:</strong>
  </h2>
  
  <p>
    <code> $ slc run .&lt;br />
</code>
  </p>
  
  <p dir="ltr">
    To view the LoopBack sample application go to the browser and open up localhost (0.0.0.0), specifying port 3000 like so:
  </p>
  
  <p dir="ltr">
    <a href="http://localhost:3000">http://localhost:3000</a>
  </p>
  
  <p>
    Now, let&#8217;s stop the sample app and deploy it on Nodejitsu!
  </p>
  
  <p>
    &nbsp;
  </p>
  
  <p>
    <a href="https://strongloop.com/wp-content/uploads/2014/01/Screen-Shot-2014-01-08-at-10.49.19-AM.png"><img class="aligncenter size-full wp-image-12726" alt="LoopBack API Explorer" src="https://strongloop.com/wp-content/uploads/2014/01/Screen-Shot-2014-01-08-at-10.49.19-AM.png" width="1532" height="949" /></a>
  </p>
  
  <h2 dir="ltr">
  </h2>
  
  <h2 dir="ltr">
    <strong>Step 9: Sign up for Nodejistu</strong>
  </h2>
  
  <p>
    &nbsp;
  </p>
  
  <p dir="ltr">
    <a href="https://www.nodejitsu.com/signup/">https://www.nodejitsu.com/signup/</a>
  </p>
  
  <p>
    &nbsp;
  </p>
  
  <h2 dir="ltr">
    <strong>Step 10: Install the jitsu command line tool (CLI)</strong>
  </h2>
  
  <p>
    <code>$ [sudo] npm install jitsu -g</code>
  </p>
  
  <h2 dir="ltr">
    <strong>Step 11: Execute the user confirmation command and code you got in your sign up email.</strong>
  </h2>
  
  <p>
    &nbsp;
  </p>
  
  <p dir="ltr">
    It should look something like…
  </p>
  
  <p>
    <code>$ jitsu users confirm [user name] [a bunch of numbers and letters]</code>
  </p>
  
  <h2 dir="ltr">
    <strong>Step 12: Login</strong>
  </h2>
  
  <p>
    &nbsp;
  </p>
  
  <p dir="ltr">
    You’ll be prompted for your password to login.
  </p>
  
  <p>
    &nbsp;
  </p>
  
  <h2 dir="ltr">
    <strong>Step 13: Deploy the StrongLoop sample application to Nodejitsu</strong>
  </h2>
  
  <p>
    &nbsp;
  </p>
  
  <p dir="ltr">
    Inside of the sls-sample-app directory execute:
  </p>
  
  <p>
    <code>$ jitsu deploy</code>
  </p>
  
  <p dir="ltr">
    You’ll get prompted for a subdomain name, make it a good one!
  </p>
  
  <p>
    &nbsp;
  </p>
  
  <p dir="ltr">
    Next, you’ll get prompted for a Node engine. I picked what was offered, 0.10.x and confirmed the selection.
  </p>
  
  <p>
    &nbsp;
  </p>
  
  <p dir="ltr">
    At this point Nodejitsu will do a few checks, upload your app and then give you a URL and port assignment where you can view it.
  </p>
  
  <p dir="ltr">
    <p>
      <img alt="" src="https://lh4.googleusercontent.com/yV5m0SL5fu6QQEg68y7WHp3iBo3tAibTt9wNVBELAe_IYMRKdTK88RRlljmrSgYhmWQ65Gm1NurK2T5Nf4vaigcf0YcBLA2eSSpwdhlq-G_JAQqLxGlT1Q4C9Q" width="624px;" height="428px;" />
    </p>
    
    <p dir="ltr">
      <p dir="ltr">
        <p dir="ltr">
          You should note that locally, the LoopBack sample application if configured by default on port 3000, while Nodejitsu deploys the app by default on 80.
        </p>
        
        <p dir="ltr">
          You should also be able to go back to your StrongOps dashboard and view your app on Nodejitsu being monitored.
        </p>
        
        <p>
          <img alt="" src="https://lh5.googleusercontent.com/2WF56zmFb935mBlCWEwQkIDdAJ7bZaQmECI0KKS-p4xcqjzbdgP2tiDSk_-ZNkJ-AWvQIqvnsrnISHyN-YO4Z_XLvHlxRNre4gImc2q_cDDwNa7fQnaEyRpXvw" width="624px;" height="409px;" />
        </p>
        
        <p dir="ltr">
          <p dir="ltr">
            <p dir="ltr">
              If you run into any issues, normally an application restart gets things back in order. To do this, execute:
            </p>
            
            <p>
              &nbsp;
            </p>
            
            <p>
              <code>$ jitsu list</code>
            </p>
            
            <p dir="ltr">
              <p dir="ltr">
                &#8230;to see the status of your apps. Then restart the one you want by executing:
              </p>
              
              <p>
                &nbsp;
              </p>
              
              <p>
                <code>$ jitsu apps restart [name of app]</code>
              </p>
              
              <p>
                &nbsp;
              </p>
              
              <p>
                To stop your app, execute:
              </p>
              
              <p>
                &nbsp;
              </p>
              
              <p>
                <code>$ jitsu apps stop [name of app]</code>
              </p>
              
              <p>
                &nbsp;
              </p>
              
              <p>
                Redeploy an app (executed from with your apps folder) with:
              </p>
              
              <p>
                &nbsp;
              </p>
              
              <p>
                <code>$ jitsu apps deploy</code>
              </p>
              
              <p>
                &nbsp;
              </p>
              
              <p>
                And finally, if you&#8217;ve made total scrambled eggs of things, you can destry an app with:
              </p>
              
              <p>
                &nbsp;
              </p>
              
              <p>
                <code>$ jitsu apps destroy [name of app]</code>
              </p>
              
              <h2 dir="ltr">
              </h2>
              
              <h2 dir="ltr">
              </h2>
              
              <h2 dir="ltr">
                <strong>Questions?</strong>
              </h2>
              
              <p>
                You can get Nodejitsu specific questions answered <a href="https://www.nodejitsu.com/support/">here</a>. StrongLoop questions you can get answered in a variety of ways including StackOverflow and Google Groups. <a href="http://strongloop.com/developers/forums/">Here&#8217;s how to interact.</a>
              </p>
              
              <p>
                &nbsp;
              </p>