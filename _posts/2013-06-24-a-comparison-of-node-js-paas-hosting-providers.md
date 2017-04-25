---
id: 647
title: Comparing Node.js Support on PaaS Hosting Providers
date: 2013-06-24T23:47:09+00:00
author: Jed Wood
guid: http://blog.strongloop.com/?p=647
permalink: /strongblog/a-comparison-of-node-js-paas-hosting-providers/
categories:
  - Cloud
---
<!-- tr.odd td { background: #C0C0C0; } -->

_As of May 2013_

Node.js may still be young relative to its other language counterparts, but when it comes to hosting, there are a lot of options. In this post we&#8217;ll take a look at several &#8220;Platform as a Service&#8221; providers.

I&#8217;m not including &#8220;Infrastructure as a Service&#8221; options like [AWS](http://aws.amazon.com/) and [Joyent](http://joyent.com/), although the lines between PaaS and IaaS get a little blurry with some of these options.

In this round, I&#8217;m primarily looking at two aspects: _deploying_ and _configuring_ environment variables. I&#8217;ll also include some notes about getting started, some screenshots of dashboards, and other miscelaneous observations. In future posts we&#8217;ll run some basic performance testing and take a look at the ease of scaling.

## The Players

<table id="tablepress-4" class="tablepress tablepress-id-4 tablepress-responsive-phone">
  <tr class="row-1 odd">
    <th class="column-1">
      PROVIDER
    </th>
    
    <th class="column-2">
      DEPLOYMENT
    </th>
    
    <th class="column-3">
      ENV VARS
    </th>
    
    <th class="column-4">
      PERFORMANCE
    </th>
  </tr>
  
  <tr class="row-2 even">
    <td class="column-1">
      Nodejitsu
    </td>
    
    <td class="column-2">
      CLI
    </td>
    
    <td class="column-3">
      CLI or web interface
    </td>
    
    <td class="column-4">
      <a href="http://strongloop.com/strongblog/monitoring-stress-testing-nodejs-apps/">See here</a>
    </td>
  </tr>
  
  <tr class="row-3 odd">
    <td class="column-1">
      Heroku
    </td>
    
    <td class="column-2">
      git
    </td>
    
    <td class="column-3">
      CLI
    </td>
    
    <td class="column-4">
      <a href="http://strongloop.com/strongblog/monitoring-stress-testing-nodejs-apps/">See here</a>
    </td>
  </tr>
  
  <tr class="row-4 even">
    <td class="column-1">
      Modulus
    </td>
    
    <td class="column-2">
      CLI or web upload
    </td>
    
    <td class="column-3">
      CLI or web interface
    </td>
    
    <td class="column-4">
      <a href="http://strongloop.com/strongblog/monitoring-stress-testing-nodejs-apps/">See here</a>
    </td>
  </tr>
  
  <tr class="row-5 odd">
    <td class="column-1">
      AppFog
    </td>
    
    <td class="column-2">
      CLI
    </td>
    
    <td class="column-3">
      CLI or web interface
    </td>
    
    <td class="column-4">
      <a href="http://strongloop.com/strongblog/monitoring-stress-testing-nodejs-apps/">See here</a>
    </td>
  </tr>
  
  <tr class="row-6 even">
    <td class="column-1">
      Azure
    </td>
    
    <td class="column-2">
      CLI or git
    </td>
    
    <td class="column-3">
      CLI or web interface
    </td>
    
    <td class="column-4">
      <a href="http://strongloop.com/strongblog/monitoring-stress-testing-nodejs-apps/">See here</a>
    </td>
  </tr>
  
  <tr class="row-7 odd">
    <td class="column-1">
      dotCloud
    </td>
    
    <td class="column-2">
      CLI
    </td>
    
    <td class="column-3">
      CLI or .yml file
    </td>
    
    <td class="column-4">
      <a href="http://strongloop.com/strongblog/monitoring-stress-testing-nodejs-apps/">See here</a>
    </td>
  </tr>
  
  <tr class="row-8 even">
    <td class="column-1">
      Engine Yard
    </td>
    
    <td class="column-2">
      git
    </td>
    
    <td class="column-3">
      ey_config npm module
    </td>
    
    <td class="column-4">
      <a href="http://strongloop.com/strongblog/monitoring-stress-testing-nodejs-apps/">See here</a>
    </td>
  </tr>
  
  <tr class="row-9 odd">
    <td class="column-1">
      OpenShift
    </td>
    
    <td class="column-2">
      git
    </td>
    
    <td class="column-3">
      SSH and create file
    </td>
    
    <td class="column-4">
      <a href="http://strongloop.com/strongblog/monitoring-stress-testing-nodejs-apps/">See here</a>
    </td>
  </tr>
  
  <tr class="row-10 even">
    <td class="column-1">
      CloudFoundry
    </td>
    
    <td class="column-2">
      coming soon
    </td>
    
    <td class="column-3">
      coming soon
    </td>
    
    <td class="column-4">
      <a href="http://strongloop.com/strongblog/monitoring-stress-testing-nodejs-apps/">See here</a>
    </td>
  </tr>
</table>

## The Setup

I&#8217;m starting with a very simple [Express](http://expressjs.com/) app, and using [nconf](https://github.com/flatiron/nconf) to elegantly handle the varying ways that we&#8217;ll be specifying the port our app should listen on (sometimes required) and a dummy variable I&#8217;m calling `SECRET.` It will first look for arguments passed in to the `node` command, then environment variables, then it will try to load a `config.json` file one level up from the root, and finally fall back on some defaults we&#8217;ve defined right in the code. When I load the app, I&#8217;ll be able to tell if our variables are being correctly pulled from one of those external sources. If it&#8217;s not, the response I get back when I load the app will be `default secret`. I should also be able to see what port the app is listening on and the `NODE_ENV` it&#8217;s using if I can access the logs from the startup of the app.

Finally, I&#8217;m setting `"engines": { "node": "v0.10.x" ...` in the `package.json` file to see how each provider reacts.

_And now in no particular order&#8230;_

## Nodejitsu

<https://www.nodejitsu.com/>

One of the original players and still purely a Node.js solution, Nodejitsu became an official partner of Joyent&#8217;s back when Joyent [dropped their no.de service](http://joyent.com/no-de) (shame, it was such an awesome domain name). Nodejitsu no longer has a permanently free tier, but individual plans start at $9 a month and there&#8217;s a 30-day free trial.

#### <a href="https://github.com/jedwood/nodejs-hosting-providers#configuring-variables" name="configuring-variables"></a>Configuring variables

According to the docs it doesn&#8217;t matter what you set the listening port to, as long as it&#8217;s either 80 or greater than 1024.

Setting our `SECRET` to override the default was straightforward. You can use the CLI or web interface to list and set variables, much like several other providers on this list.

#### <a href="https://github.com/jedwood/nodejs-hosting-providers#deploying" name="deploying"></a>Deploying

Pushing your code to the Nodejitsu cloud is done via a custom command-line interface application (CLI), installed with npm. When you sign up you get dumped right into a github repository with instructions, but overall the setup process was pretty painless. You&#8217;re prompted to select a subdomain, which is then automatically added to the `package.json` file. In the couple of tests I ran, deploying was really quick. It auto-increments the `version` property in the package.json file with each deploy, which doesn&#8217;t bother me but might annoy some folks.

I ran into three small glitches. The first was with versioning. In the message that gets spit out upon deploying, I was shown:

`info: jitsu v0.12.10-2, node v0.10.4`

and yet, I was told that `0.10.x` was not a supported value. Only by bumping down to `0.8.x` was I able to find success.

Second, I tried to change the `name` property in `package.json` and it then wouldn&#8217;t let me deploy.

Third, my ENV variables got wiped out every time I re-deployed. Perhaps there&#8217;s a way to avoid that.

#### <a href="https://github.com/jedwood/nodejs-hosting-providers#misc-notes-and-dashboard" name="misc-notes-and-dashboard"></a>Misc Notes and Dashboard

I like that Nodejitsu is so Node.js centric. Any custom configuration is at least handled via the standard `package.json` file. You can even define custom predeploy and postdeploy hooks. My totally subjective response is that it felt very snappy to deploy and view logs.

<a href="https://github.com/jedwood/nodejs-hosting-providers/blob/master/img/nodejitsu-dashboard.png" target="_blank"><img src="https://github.com/jedwood/nodejs-hosting-providers/raw/master/img/nodejitsu-dashboard.png" alt="Nodejitsu dashboard" /></a>

## Heroku

<https://www.heroku.com/>

The 800 pound gorilla of the PaaS world, made insanely popular by their undying love from Ruby on Rails enthusiasts everywhere.

#### <a href="https://github.com/jedwood/nodejs-hosting-providers#configuring-variables-1" name="configuring-variables-1"></a>Configuring variables

Setting our `SECRET` to override the default was again using the CLI. No surprises there.

All apps run on port 5000, so you need to be listening for that.

Finally, you have to create a `Procfile` that has specifies `web: node server.js`. Not a big deal, but certainly a side effect of running on a PaaS that supports multiple languages.

#### <a href="https://github.com/jedwood/nodejs-hosting-providers#deploying-1" name="deploying-1"></a>Deploying

The Heroku &#8220;toolbelt&#8221; CLI is used to manage your account and applications, but deploying is done via git. You just add the endpoint they provide you as a `remote` in your git config. Because they&#8217;re not exclusively focused on Node.js, I was pleasantly surprised to find that they already supported v 0.10.6!

My first deployment seemed to succeed, but tracking down the errors I received lead me to discover that I first needed to specify how many resources I wanted devoted to this app:

`heroku ps:scale web=1`

After that, it was smooth sailing.

#### <a href="https://github.com/jedwood/nodejs-hosting-providers#misc-notes-and-dashboard-1" name="misc-notes-and-dashboard-1"></a>Misc Notes and Dashboard

I didn&#8217;t try Heroku for my own projects until about 3 months ago, partly because I have a modest level of comfort in setting up my own servers, and partly because I just figured they treated node.js as an afterthought. But if you can get over their lack of WebSocket support and some [misleading marketing and stats](http://techcrunch.com/2013/02/14/heroku-admits-to-performance-degradation-over-the-past-3-years-after-criticism-from-rap-genius/), it&#8217;s a pretty smooth experience.

They&#8217;ve also got a very polished and functional dashboard, with some handy features you won&#8217;t find elsewhere like pointing to an S3-hosted file for 404 pages, and the ability to transfer ownership of a project to a different user.

<a href="https://github.com/jedwood/nodejs-hosting-providers/blob/master/img/heroku-dashboard.png" target="_blank"><img src="https://github.com/jedwood/nodejs-hosting-providers/raw/master/img/heroku-dashboard.png" alt="Heroku dashboard" /></a>

## Modulus

[http://modulus.io](http://modulus.io/)

The .io extension should tip you off that this is a relatively new service. Focused just on Node.js, they have built-in support for MongoDB and local file storage.

#### <a href="https://github.com/jedwood/nodejs-hosting-providers#configuring-variables-2" name="configuring-variables-2"></a>Configuring variables

Variables can be set either via the web interface or the CLI. I got stuck trying to create the `SECRET`. After a bit of trial and error, I discovered that you can&#8217;t include spaces in the value! So `modulus secret` didn&#8217;t work. Weird.

The app needs to listen on port 8080, &#8220;but we recommend using the PORT environment variable (process.env.PORT).&#8221;

#### <a href="https://github.com/jedwood/nodejs-hosting-providers#deploying-2" name="deploying-2"></a>Deploying

Deploying can be done via CLI, but you can also zip your whole project and upload it via their web interface, which is&#8230; interesting. I didn&#8217;t have any problems deploying, but your entire project (except node_modules) gets bundled and uploaded every time, which makes it a much slower process than tools that use the &#8220;diff&#8221; capabilities of git or rsync.

As of writing, Modulus runs v 0.8.15 and ignores whatever you specify in package.json

#### <a href="https://github.com/jedwood/nodejs-hosting-providers#misc-notes-and-dashboard-2" name="misc-notes-and-dashboard-2"></a>Misc Notes and Dashboard

I&#8217;m cheering for these guys and hope they continue to improve. It&#8217;s nice having the option of built-in MongoDB, and I like the upfront pricing.

<a href="https://github.com/jedwood/nodejs-hosting-providers/blob/master/img/modulus-dashboard.png" target="_blank"><img src="https://github.com/jedwood/nodejs-hosting-providers/raw/master/img/modulus-dashboard.png" alt="Modulus dashboard" /></a>

## AppFog

[http://appfog.com](http://appfog.com/)

The PaaS formerly known as PHP Fog and recently acquired by [CenturyLink](http://blog.appfog.com/appfog-joins-centurylink/). You can specify which cloud you want to run in, from several AWS regions, HP, an even Azure.

#### <a href="https://github.com/jedwood/nodejs-hosting-providers#configuring-variables-3" name="configuring-variables-3"></a>Configuring variables

Variables can be set either via the web interface or the CLI. No problems setting our `SECRET` variable.

The docs said I needed to listen to `process.env.VCAP_APP_PORT` for the port, but I just tried it with the default and it worked. The logs showed that it was listening on 57277.

#### <a href="https://github.com/jedwood/nodejs-hosting-providers#deploying-3" name="deploying-3"></a>Deploying

Also via the CLI. And as of writing, AppFog runs v 0.8.14 and ignores whatever you specify in package.json

#### <a href="https://github.com/jedwood/nodejs-hosting-providers#misc-notes-and-dashboard-3" name="misc-notes-and-dashboard-3"></a>Misc Notes and Dashboard

The free plan seems pretty generous, giving you up to 8 instances across 2GB of RAM, split however you want. They also have options for built-in MongoDB.

<a href="https://github.com/jedwood/nodejs-hosting-providers/blob/master/img/appfog-dashboard.png" target="_blank"><img src="https://github.com/jedwood/nodejs-hosting-providers/raw/master/img/appfog-dashboard.png" alt="AppFog dashboard" /></a>

## Windows Azure

[http://windowsazure.com](http://windowsazure.com/)

Yep. Believe it.

#### <a href="https://github.com/jedwood/nodejs-hosting-providers#configuring-variables-4" name="configuring-variables-4"></a>Configuring variables

Variables can be set either via the web interface or the CLI. I experienced one weird bit behavior on the `SECRET` when I first set it up via the CLI; it was lowercased to `secret`. I had to use the web interface to correct it.

The app ran fine without making any changes to our configuration for ports, although the logs showed a pretty wacky value: `\.pipebea0dffc-de5b-47f4-8575-4d17c2175fd5`

#### <a href="https://github.com/jedwood/nodejs-hosting-providers#deploying-4" name="deploying-4"></a>Deploying

You might expect Microsoft to have all kinds of custom stuff here. While there are a few files that get dropped into your repo (name `azure_error` and `iisnode.yml`), the (optional) CLI is installed via npm and deployment is handled via git. Nice!

As of writing, Azure is running 0.8.2, and this value must be configured correctly in package.json.

#### <a href="https://github.com/jedwood/nodejs-hosting-providers#misc-notes-and-dashboard-4" name="misc-notes-and-dashboard-4"></a>Misc Notes and Dashboard

The account creation process was by far the most tedious of any listed here. It included SMS verification, a Windows Live account, and a separate git user account for deploying. But overall, the dashboard is pretty nice considering the huge scope of the Azure platform. They also support streaming log files. As far as I can tell, Heroku is the only other provider on this list to do so.

<a href="https://github.com/jedwood/nodejs-hosting-providers/blob/master/img/azure-dashboard.png" target="_blank"><img src="https://github.com/jedwood/nodejs-hosting-providers/raw/master/img/azure-dashboard.png" alt="Azure dashboard" /></a>

## dotCloud

[http://dotcloud.com](http://dotcloud.com/)

Support for multiple languages. Like Nodejitsu they recently dropped their free tier, so a credit card is required to get started.

#### <a href="https://github.com/jedwood/nodejs-hosting-providers#configuring-variables-5" name="configuring-variables-5"></a>Configuring variables

Variables via the CLI or a `dotcloud.yml` file.

The listening port needs to be set to 8080.

#### <a href="https://github.com/jedwood/nodejs-hosting-providers#deploying-5" name="deploying-5"></a>Deploying

dotClouds CLI is written in Python and uses rsync to minimize the amount of data you need to upload on each deploy. In order to deploy, you need both a `supervisord.conf` and `dotcloud.yml` files, which is a minor nuisance.

As of writing, dotCloud runs 0.6.20. Ouch.

#### <a href="https://github.com/jedwood/nodejs-hosting-providers#misc-notes-and-dashboard-5" name="misc-notes-and-dashboard-5"></a>Misc Notes and Dashboard

I got burned early on by dotcloud when they made some breaking changes with little warning. I guess that&#8217;s life in a beta world, but I haven&#8217;t been anxious to run back.

<a href="https://github.com/jedwood/nodejs-hosting-providers/blob/master/img/dotcloud-dashboard.png" target="_blank"><img src="https://github.com/jedwood/nodejs-hosting-providers/raw/master/img/dotcloud-dashboard.png" alt="dotCloud dashboard" /></a>

## Engine Yard

[http://engineyard.com](http://engineyard.com/)

Like Heroku, Engine Yard is known primary for it&#8217;s Ruby on Rails hosting. Unlike Heroku, you have more control over the setup and environment. It&#8217;s still a PaaS, but people with some direct server experience will appreciate being a little &#8220;closer to the metal.&#8221;

#### <a href="https://github.com/jedwood/nodejs-hosting-providers#configuring-variables-6" name="configuring-variables-6"></a>Configuring variables

Environment variable cas be set by using the `ey_config` npm module. Engine Yard also support SSH access to your machine, which means you could create a config.json and drop it in the right place.

The port should be `process.env.PORT` and nconf is already handling that for us.

#### <a href="https://github.com/jedwood/nodejs-hosting-providers#deploying-6" name="deploying-6"></a>Deploying

Handled via git.

It respects the node version value in `package.json` but only up to 0.8.11.

#### <a href="https://github.com/jedwood/nodejs-hosting-providers#misc-notes-and-dashboard-6" name="misc-notes-and-dashboard-6"></a>Misc Notes and Dashboard

When you create an application, you get to choose between nginx as the front-end proxy (which the recommend) or going straight to Node.js, the latter of which gives you option of WebSockets.

When my first deploy failed, a chat window popped up with option for me to put in my phone number.

<a href="https://github.com/jedwood/nodejs-hosting-providers/blob/master/img/engineyard-dashboard.png" target="_blank"><img src="https://github.com/jedwood/nodejs-hosting-providers/raw/master/img/engineyard-dashboard.png" alt="Engine Yard dashboard" /></a>

## OpenShift.com

[http://openshift.com](http://openshift.com/)

OpenShift is an open source project maintained primarily by Red Hat, and OpenShift.com is a hosted service for the platform (think WordPress.org vs WordPress.com).

#### <a href="https://github.com/jedwood/nodejs-hosting-providers#configuring-variables-7" name="configuring-variables-7"></a>Configuring variables

OpenShift.com supports SSH access to your machine, which means you could create a config.json and drop it in the right place. Otherwise, there are no special commands or predefined config files.

The port should be `process.env.OPENSHIFT_INTERNAL_PORT || 8080`.

#### <a href="https://github.com/jedwood/nodejs-hosting-providers#deploying-7" name="deploying-7"></a>Deploying

Handled via git, though their is a CLI for creating and managing projects if you&#8217;re not a fan of web-based GUIs. You&#8217;ll need to add your public SSH key to your account first, which was a step not included in the node.js sample quickstart.

It ignores the node version value in `package.json` and runs a rusty ol&#8217; v0.6.20 by default, but with [some extra steps](https://www.openshift.com/blogs/any-version-of-nodejs-you-want-in-the-cloud-openshift-does-it-paas-style) you can change that.

#### <a href="https://github.com/jedwood/nodejs-hosting-providers#misc-notes-and-dashboard-7" name="misc-notes-and-dashboard-7"></a>Misc Notes and Dashboard

I had some problems getting the sample app running at first, so I started over and let OpenShift populate the git repository for me with their sample files. There are a few extra things in there, many of which are tucked under the`.openshift` directory. These include deploy hooks and config files. The `README` they include does a good job of laying out the structure and explaining the purpose of each file.

But I still got stuck on the fact that I needed to listen on a specific IP address. That meant including this:

`var ipaddr = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";`

And then I added `ipaddr` in the `app.listen` section of my `server.js` like this:

`app.listen(app.get('port'), ipaddr, function(){...`

I&#8217;ve had an exchange with the OpenShift folks and they&#8217;re going to update their getting started guide to make this more clear.

<a href="https://github.com/jedwood/nodejs-hosting-providers/blob/master/img/openshift-dashboard.png" target="_blank"><img src="https://github.com/jedwood/nodejs-hosting-providers/raw/master/img/openshift-dashboard.png" alt="OpenShift dashboard" /></a>

## CloudFoundry

[http://cloudfoundry.com](http://cloudfoundry.com/)

At first look, CloudFoundry has a clear and friendly process for getting started. However, a few screens into the process I was presented with this message:
  
`*We are in a time of transition:*<br />
You are reading V2 documentation... Cloudfoundry.com will be upgraded to V2 in June 2013.`

So I&#8217;ll circle back to them in the next installment of this series.

## Until Next Time

Needless to say things are changing quickly in this space. Don&#8217;t put too much weight on any specific detail here without first checking for updates. For example, in the couple of days that it took me to type this up, Modulus sent out an email about upgrading their version of Node.js.

In future posts I&#8217;ll be walking through how we can monitor and test the performance of these platforms, and then take a shot at scaling them. In the meantime, let me know if I&#8217;ve missed your favorite Node.js PaaS.

&nbsp;

<div>
</div>

&nbsp;