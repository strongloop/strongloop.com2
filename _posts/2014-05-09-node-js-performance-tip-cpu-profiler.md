---
id: 16111
title: 'Node.js Performance Tip of the Week: CPU Profiling'
date: 2014-05-09T08:25:51+00:00
author: Shubhra Kar
guid: http://strongloop.com/?p=16111
permalink: /strongblog/node-js-performance-tip-cpu-profiler/
categories:
  - Arc
  - Community
  - How-To
  - Performance Tip
---
_Please note that as of Aug 3, 2015, StrongOps has been EOL&#8217;d. Check out [StrongLoop Arc](https://strongloop.com/node-js/arc/) for the same capabilities and more._

In [last week’s performance tip](http://strongloop.com/strongblog/node-js-performance-tip-of-the-week-memory-leak-diagnosis/), we discussed in detail how to diagnose memory leak problems with Node.js applications. In this go around we look at CPU profiling and how a good diagnosis can lead us to find the performance hotspots.

Node applications are designed to maximize throughput and efficiency, using non-blocking I/O and asynchronous [events](http://en.wikipedia.org/wiki/Event-driven_architecture). Node apps essentially run [single-threaded](http://en.wikipedia.org/wiki/Single_threading), even though file and network events could leverage multiple threads. This architecture thereby binds the performance of each application instance/process to one logical CPU core that the thread is attached to. So, in case of a CPU running hot, throwing additional cores into the mix and using clustering, may enable you to scale horizontally. However, it does not resolve the fundamental bottleneck. Profiling the CPU under load is the go to diagnosis technique in this scenario.

In this blog we&#8217;ll show you how to use [StrongLoop Arc](https://strongloop.com/node-js/build-deploy-and-scale/) to perform CPU profiling on your apps. What&#8217;s Arc? It&#8217;s a performance monitoring and DevOps console specifically for Node.<!--more-->

## **The V8 internal profiler**

Google&#8217;s V8 has built-in [sample based profiling](https://developers.google.com/v8/profiler_example). Profiling is turned off by default, but can be enabled via the `--prof` command line option. The sampler records stacks of both JavaScript and C/C++ code mostly piped into a log file. The Linux tick processor script that ships with V8 can be used to analyze the sample to determine if the CPU time is being consumed at the OS level libraries or within the application itself. Limited sequencing is also provided.

## **Client-side CPU profiling**

The internal profiler is also available as part of the [Chrome Dev Tools](https://developers.google.com/chrome-developer-tools/) and lets you collect and analyze the CPU profile of an application within the JavaScript console. However, this is only good for client side analysis.

<img class="aligncenter" src="https://lh6.googleusercontent.com/21lYPOELdamoLaljVTm-Z1LSVirmkXWi0jbg446TRWwnsBCsqfvVP5Kx2Buxp2Yxwr7DSjq8v3hxVgHDOC9o5WkGkNyVVg4YYyUKwvmdsfO--uC1qSNBFIOG5XKVZsHQ8Q" alt="Screen Shot 2014-05-09 at 5.54.37 AM.png" width="624px;" height="199px;" />

## **Server-side CPU profiling**

The V8 profiler has been extended by StrongLoop to provide deep diagnostics and visual snapshotting across any application process in both clustered and non-clustered mode at any point of time. Take for example a Node app which is running as a single master, two worker process cluster. Let’s startup the application, put some load on it and run the profiler.

## **Startup the cluster**

Here we are using the [`slc run`](http://docs.strongloop.com/display/SLC/Control+an+application+cluster) command with clustering option and specifying the number of CPU cores to be attached.

<img class="aligncenter" src="https://lh6.googleusercontent.com/6sboThICr0NYrVtncw7O30YgfUZ_EgP0yZqZKRpS0W-H-3CUamX6mtG9S8LaXl-kc8VhzZwYxd3LKNYT6QLCEqoLEdEANSZzBapDgVMiADHwNAG580qtl8_326sPd_RVhw" alt="Screen Shot 2014-05-09 at 6.36.19 AM.png" width="624px;" height="384px;" />

## **Get loaded!**

Here we are using a [Jmeter](http://jmeter.apache.org/) script to simulate 100 simultaneous users on the clustered app. We&#8217;ll go with an ideal case, where each application instance/CPU core is handling a 50 users workload.

<img class="aligncenter" src="https://lh3.googleusercontent.com/9vWB0wqx3_w9zKX2GHSv5jRZFpEjTP8eAp21RfY3jsc7nEIYlxO22IK0OCk2BTMDJNf9rbwQwsYyt76xQoqSTmy8r_q0Arc_6OC7Xk1VAh3AYRwDMZvofpbgOaFRhnccuw" alt="Screen Shot 2014-05-09 at 6.42.07 AM.png" width="624px;" height="388px;" />

## **Profiling the master**

<img class="aligncenter" src="https://lh3.googleusercontent.com/fUs9BM8D05papzWQ2XbhkCOrAf8H9Cibr0gmiyOOI8-MBRSz8JyEw-wvMkhfQYXAMsAUCg5en1Uz7lL383j9tYssvjVTIxDFcdTqomjF77N-9Vg1lAPiVFujVKTXdYiFjw" alt="Screen Shot 2014-05-09 at 6.53.21 AM.png" width="384px;" height="371px;" />

As expected, we can see that the master process is spending most of the CPU time in idle state, with root process consuming less than 1 millisecond of CPU profile time.

## **Profiling the first worker**

<img class="aligncenter" src="https://lh3.googleusercontent.com/LyAE4hgitdBCCZpnRnxs-sk9RKelw7pguaNgxlKmumwXkXLdWZRxuDkMxSXu8HZ1ccAY7gNlwGa7e398fRDtKLQnyXJEIEVhvMWmmn1JDIA0wVs7Zho5q2ny65LydyOLFg" alt="Profile1_1.png" width="624px;" height="424px;" />

The first worker process/CPU core shows about 30% utilization during the profiling period. Hovering over the concentric CPU cycle rings show us that there are 3 main segments of code which can be potential hotspots. The first segment covered here shows the times spent in the connect module of [express](http://expressjs.com/) framework. The plot is provided as a dependency tree. Here we are highlighting the time spent on `multipart.js` class constructor (line 92) which is 551.68 ms as compared to the entire call tree of 22, 926.61 ms or around 0.025% of the stack

<img class="aligncenter" src="https://lh6.googleusercontent.com/C0OvsGPzyBjTpqBFoaO6BAbWeSp3UXQtZqtbAypukToUDUHV2g0yPK5smFNkdn6BhQ0MsnE8ACPZ_3lHy2XXDmbP6yeckIGVN-3VWo26rtDQuWdRDY59Y0VEZMh2on_aKA" alt="Profile1_2.png" width="624px;" height="347px;" />

The second segment covered here shows the times spent in the MySQL calls. The call stack would initially start with driver calls and eventually end with queries. Here we are highlighting the time spent in `Query.js class EofPacket()` function (line 109) which is 922.70 ms as compared to the entire call tree of 9017.29 ms or around 10% of that stack.
  
<img class="aligncenter" src="https://lh5.googleusercontent.com/ulNbmeVuLZOIpGTeFQvgYrQ2YVUoSpvrrye0dMpezOwYHWkWJIEPO4PrURPmEXj1gCf25l2j7DU2ToyQR2_9Uh4UmKpTHf49oBErFlQU6UbaWcGV3RIlWJ2MstH8CaXeZg" alt="Profile1_3.png" width="624px;" height="353px;" />
  
The third segment covered here shows the times spent in the `loadtest` calls. This seems to be the top CPU hotspot of the application. Here we are highlighting the time spent in `dataoperations.js` class, function `aboutToSendResponse()` (line 111) which is almost 99% of the call stack and seemingly looks like a wait sequence.  Let us see if we see a similar behavior on the other CPU core attached to this application as the second process.

## **Profiling the second worker**

<img class="aligncenter" src="https://lh3.googleusercontent.com/6BSRPfLPp4fQEPfSPuIBWFJfHY_tc45-rWIV-BUKPTKBjF6hmvQ2hUtU_PqdO-22gx4zYTW1No0UkKpGunJohO52gJlXxWOSZDOSb44p64bJaKE0Vep9V1yAKiPtOAdXnA" alt="Profile2_1.png" width="624px;" height="396px;" />
  
The second worker process/CPU core shows about 70% overall utilization during the profiling period. Hovering over the concentric CPU cycle rings show us that there are 8-10 main segments of code which can be potential hotspots.

One segment covered here shows the times spent in the memcache modules. The plot is provided as a dependency tree. Here we are highlighting the time spent on `jackpot/index.js class, allocate()` function (line 142)&#8230;and we could go on to find the other code segments. However, it strikes us that we should be looking at long call chains, not just ones with a single child. This could be of relevance as some functions could be singleton pattern and don’t have too much scope of optimization. Long call chains could be refactored for optimization.

So, collapsing the call chains with single children, we are now able to pinpoint major code segments. Highlighted here is the `http.js` file, which has a function `socket.ondata()` on line # 1964, which is our top consumer!
  
<img class="aligncenter" src="https://lh3.googleusercontent.com/QiKzm4IqVzW1VzCGC5leL5_kZ4_UQsinUcSPWT8r5sia0gibZduyDeTky7MuTc0lL3jlvMaMxmhRcP4fja5koXM0BiTEHpjlDDaYD_oq9D5kMkH7wCNtnWIUwqzjQvwgIA" alt="Profile2_2.png" width="624px;" height="509px;" />

<div id="design-apis-arc" class="post-shortcode" style="clear:both;">
  <h2>
    <a href="http://strongloop.com/node-js/arc/"><strong>Develop APIs Visually with StrongLoop Arc</strong></a>
  </h2>
  
  <p>
    StrongLoop Arc is a graphical UI for the <a href="http://strongloop.com/node-js/api-platform/">StrongLoop API Platform</a>, which includes LoopBack, that complements the <a href="http://docs.strongloop.com/pages/viewpage.action?pageId=3834790">slc command line tools</a> for developing APIs quickly and getting them connected to data. Arc also includes tools for building, profiling and monitoring Node apps. It takes just a few simple steps to <a href="http://strongloop.com/get-started/">get started</a>!
  </p>
  
  <img class="aligncenter size-large wp-image-21950" src="https://strongloop.com/wp-content/uploads/2014/12/Arc_Monitoring_Metrics-1030x593.jpg" alt="Arc_Monitoring_Metrics" width="1030" height="593" />
</div>

## **What’s next?**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What’s in the upcoming Node v0.12 release? <a href="http://strongloop.com/strongblog/performance-node-js-v-0-12-whats-new/">Big performance optimizations</a>! Read <a href="https://github.com/bnoordhuis">Ben Noordhuis’</a> blog to learn more.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Watch <a href="https://github.com/piscisaureus">Bert Belder’s</a> comprehensive <a href="http://strongloop.com/developers/videos/#whats-new-in-nodejs-v012">video </a>presentation on all the new upcoming features in v0.12</span>
</li>