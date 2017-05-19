---
id: 1036
title: Monitoring and Stress Testing Node.js Apps
date: 2013-07-10T16:01:02+00:00
author: Jed Wood
guid: http://blog.strongloop.com/?p=1036
permalink: /strongblog/monitoring-stress-testing-nodejs-apps/
categories:
  - Community
  - How-To
---
_Editor&#8217;s Note: The NodeFly app is tested below. Note that StrongLoop has integrated and expanded this monitoring application as StrongAgent. Read all about it in our _[Getting Started](http://strongloop.com/get-started/)_ _page for the most current instructions.__

In our previous post we looked at [deployment and configuration of several different Node.js PaaS providers](http://blog.strongloop.com/a-comparison-of-node-js-paas-hosting-providers/ "Comparison of PaaS Node.js "). Here&#8217;s the summary table:

  


<table id="tablepress-5" class="tablepress tablepress-id-5 tablepress-responsive-phone">
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
      ok
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
      great
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
      good
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
      good
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
      good
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
      good
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
      great
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
      not so good
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
      coming soon
    </td>
  </tr>
</table>

<!-- #tablepress-5 from cache --> In this post we&#8217;ll explore 

[NodeFly](http://nodefly.com) for reporting the performance of Node apps, and a few simple tools for stress testing.

So you&#8217;re sending your first real Node.js app into production. Nervous? You should be. Not because Node isn&#8217;t ready, but because you haven&#8217;t yet established a history of gotchas and lessons learned. Are there uncaught exceptions? Did you unknowingly write a blocking function somewhere that will only come back to bite you when your app hits the front page of Hacker News?

## NodeFly Setup

![NodeFly Logo]({{site.url}}/blog-assets/2013/09/hexamajig.png)

[Signing up](http://www.nodefly.com) for an account is really simple. After that, we just install via npm:

`npm install nodefly@stable`

and then add a block like this to our app code before any other `require` statements:

    require('nodefly').profile(
      'abc123',
      [APPLICATION_NAME]
    );
    

And when they say &#8220;This must be the first require before you load any modules. Otherwise you will not see data reported&#8221; they mean it. I started by first loading [nconf](https://github.com/flatiron/nconf) so that I could use a familiar way of putting the NodeFly config info in and external file. Sure enough, no data reported.

Also note that the second parameter of that `profile` method is in fact an Array. I got stuck on that during my first attempt. It allows you to also include a hostname and a process number, e.g.

    require('nodefly').profile(
      'abc123',
      ['Jed's App', 'local dev', 2]
    );
    

On the how-to page, NodeFly includes customized setup snippets for Nodejitsu, Heroku, and AppFog.

## Sample App

So let&#8217;s start with a simple app that runs the fibonacci sequence for a variable number of iterations.

    app.get('/block/:n', function(req, res){
      var blockres = fibonacci(parseInt(req.param('n'), 10));
      res.send("done: " + blockres);
    });
    
    function fibonacci(n) {
      if (n < 2)
        return 1;
      else
        return fibonacci(n-2) + fibonacci(n-1);
    }
    

## Simple Stress Testing

There is of course no reason why you need to use tools written in Node to test Node apps. Nevertheless, here are a couple simple ones I found by digging through [npm](https://npmjs.org/package/npm-search)

### node-http-perf

[zanchin/node-http-perf](https://github.com/zanchin/node-http-perf) is a tool with a familiar CLI:

`nperf -c 5 -n 10 http://example.com/`

That will send a total of 10 requests to example.com, 5 at a time.

### node-ab

[doubaokun/node-ab](https://github.com/doubaokun/node-ab) has an even simpler command:

`nab example.com`

While running, it increases the number of requests by 100 more per second until less than 99% of requests are returned.

### Bees with Machine Guns

Mike Pennisi of [bocoup](http://weblog.bocoup.com/node-stress-test-procedure/) has a great three-part write up of his experience [stress-testing a realtime Node.js app](http://weblog.bocoup.com/node-stress-test-procedure/). His focus was primarily on testing [socket.io](http://socket.io) performance. In the process, he created [a fork of Bees with Machine Guns](https://github.com/jugglinmike/beeswithmachineguns) that&#8217;s worth checking out if you&#8217;re looking to do some serious distributed stress testing.

* * *

# How the PaaS Providers Stack Up

With our sample app deployed on many different Node PaaS hosts, now we can run some of these simple tests and take a look at our NodeFly dashboard to get some insights on performance. I&#8217;ll be running \`nab\` to get a basic sense of how a traffic spike is handled. We&#8217;ll follow that with a single request to \`/block/42\` to see how the CPU holds up.

_Please take these results with a grain of salt&#8211; this is not a real-world app. Also note that we&#8217;re only testing the entry level setup. It&#8217;s very likely that scaling each service up a notch would dramatically alter the results!_

To set a baseline, here are the results from an AWS &#8220;micro&#8221; instance with a fresh installation of Node 0.10.12:

#### EC2 Micro

    nab http://ec2-23-22-0-60.compute-1.amazonaws.com/block/1
    REQ NUM: 300 RTN NUM: 284 QPS: 47 BODY TRAF: 331B per second
    
    time to curl /block/42: 8.40s
    

#### Nodejitsu

    nab http://jedwood.nodejitsu.com/block/1
    REQ NUM: 300 RTN NUM: 261 QPS: 43 BODY TRAF: 299B per second
    
    time to curl /block/42: <b>17.16s</b>
    

#### Heroku

    nab http://jedwoodtest.herokuapp.com/block/1
    REQ NUM: 600 RTN NUM: 583 QPS: 64 BODY TRAF: 453B per second
    
    time to curl /block/42: <b>5.62s</b>
    

#### Modulus.io

    nab http://jedwood-7762.onmodulus.net/block/1
    REQ NUM: 300 RTN NUM: 289 QPS: 48 BODY TRAF: 336B per second
    
    time to curl /block/42: <b>11.10s</b>
    

#### AppFog

    nab http://jedwood.aws.af.cm/block/1
    REQ NUM: 300 RTN NUM: 259 QPS: 43 BODY TRAF: 6KB per second
    
    time to curl /block/42: <b>5.59s</b>
    

#### Windows Azure

    nab http://jedwood.azurewebsites.net/block/1
    REQ NUM: 500 RTN NUM: 401 QPS: 66 BODY TRAF: 467B per second
    
    time to curl /block/42: <b>9.74s</b>
    

#### dotCloud

    nab http://jedwood-jedwood.dotcloud.com/block/1
    REQ NUM: 300 RTN NUM: 286 QPS: 47 BODY TRAF: 329B per second
    
    time to curl /block/42: <b>9.93s</b>
    

#### EngineYard

    nab http://204.236.233.168/block/1
    REQ NUM: 600 RTN NUM: 513 QPS: 85 BODY TRAF: 598B per second
    
    time to curl /block/42: <b>7.32</b>
    

#### OpenShift.com

    nab http://test-jedwood.rhcloud.com/block/1
    REQ NUM: 500 RTN NUM: 409 QPS: 68 BODY TRAF: 476B per second
    
    time to curl /block/42: <b>52.70s</b>
    

We asked the OpenShift team what was behind the slow curl response, and here&#8217;s what they said:

> &#8220;One reason is that our node.js cartridge is still using 0.6.20. I tested versions 0.8.9 and later and verified that they are about 30% faster, so the <a>nodejs-custom-version quickstart</a> [&#8230;] would make a big difference for you. The other thing is that we currently have tight controls about the share of the CPU that we give to each gear. Calling a function that wants to occupy the CPU for several seconds for a single request simply demonstrates that we are limiting your app&#8217;s CPU usage so that it doesn&#8217;t harm the performance of other colocated apps. We are still discussing safe ways to allow for occasional CPU spikes like this.&#8221;

## **[What’s next?](http://strongloop.com/get-started/)**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js <a href="http://loopback.io/">LoopBack framework</a>. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
</li>