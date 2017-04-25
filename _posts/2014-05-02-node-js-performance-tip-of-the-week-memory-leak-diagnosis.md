---
id: 15969
title: 'Node.js Performance Tip of the Week: Memory Leak Diagnosis'
date: 2014-05-02T08:47:12+00:00
author: Shubhra Kar
guid: http://strongloop.com/?p=15969
permalink: /strongblog/node-js-performance-tip-of-the-week-memory-leak-diagnosis/
categories:
  - Arc
  - How-To
  - Performance Tip
---
_Please note that as of Aug 3, 2015, StrongOps has been EOL&#8217;d. Check out [StrongLoop Arc](https://strongloop.com/node-js/arc/) for the same capabilities and more._

In [last week&#8217;s performance tip](http://strongloop.com/strongblog/node-js-performance-heap-profiling-tip/), we discussed in detail how to leverage Google V8&#8217;s heap profiler to diagnose problems with Node applications. In this go around we look at different leak patterns and how a good diagnosis can lead us to find the root cause of a potentially troublesome production problem.

## **Identifying patterns**

Rapid memory leaks are easy to identify and often the cause of many memory issues. Node by itself is very sensitive to errors and exceptions and will crash due to out of memory exceptions. Slow leaks are the most difficult to find and often require profiling over long periods of time to properly identify.

## **Slow memory leak pattern**

<img class="aligncenter" src="https://lh3.googleusercontent.com/CyPhU3XAGt91NfNx59MHAlCnwM4AQDWt64on7WHOKEoGhWECS7cDDwJKZjkyl6SfZztxXWnrmYOAIiVrHumqWR_IRrmNANXk8zBxnp0IoaqZ-8TcgqUQcK0KvSCj_jaEUw" alt="slow_profile.png" width="628x;" height="430px;" />

## **Rapid memory leak pattern** 

<img class="aligncenter" src="https://lh5.googleusercontent.com/teoD7rMfTs74bNfLdMwf2WxUGkWBhjGKs_lM2tOY-qTj-l7lNtqDnmsY6HIDzRs2ogMlrrhl0kLLWvN4mBG1x_KHh5g6LIhmYwAjHty4Z_8jZGBGAQtH4Q4oHR9LO1Qs6A" alt="fast_profile.png" width="650px;" height="446px;" />

Profiling by itself provides isolation up to type and count of objects in the heap and in retainers. We provide that in [StrongLoop Arc](https://strongloop.com/node-js/build-deploy-and-scale/); however to get down to the line of code, you need deeper inspection.<!--more-->

## **Client Side Heapdumps : Chrome Dev Tools**

[Chrome Dev Tools](https://developers.google.com/chrome-developer-tools/) provide the ability to collect heap snapshots on the client side using the JavaScript console built into the browser. Analysis of the heap can be done within this same console. This analysis is often useful in development or unit testing cycles when trying to optimize code.

<img class="aligncenter" src="https://lh6.googleusercontent.com/Yw7w1EzZN2RaoQpA836Z8GcroABMEk9cczA_AHqfxX_2wUwPz_uGC19yalSSbseYYa4q9B-m0aKRS1GE4dGtdJ05pkyDfvR9VwJCkvRUlqWRoPUlQdhCFPrInz-r5cuUcQ" alt="ChromeDevTools.png" width="577px;" height="199px;" />

## **Server Side Heap Snapshots: Triggered, Timed, Thresholded**

Server side heap snapshots are needed during analysis in higher environments like performance testing, UAT or production. These snapshots can be collected using the Node heapdump module written by StrongLoop founder, [Ben Noordhuis](https://github.com/bnoordhuis/node-heapdump).

`npm install heapdump`

This module helps gather server side heap dumps under production load using 3 techniques &#8211; User issued SIG commands, Timer based programmatic and Memory Threshold based programmatic. More details available on this [Node Heap Snapshots](http://strongloop.com/strongblog/how-to-heap-snapshots/) blog.

<h2 dir="ltr">
  <strong>Analysis</strong>
</h2>

<p dir="ltr">
  Let’s conduct a mock exercise by forcing a memory leak. Include the heapdump module into a leaky class called ChocolateClass that simply adds 100 units of objects every second into an array &#8211; sugar.
</p>

<img class="aligncenter" src="https://lh4.googleusercontent.com/VO0G8ES968zL8SGESaMZerbGbRdVejfLTn_tVuvANEEoWenrkPQNFCHBnCYeiRSz0kquxh4sEv-HPzHYDcJhemLkeIKCQpAjrRBF8WISLyRJCpnUXSn-DVcGajQKgFsxLQ" alt="LeakyChocolateClass.png" width="624px;" height="248px;" />

Running this application and taking heap-snapshots using the Kill -USR2 <pid> commands gives us two heapdumps to inspect side by side.

<img class="aligncenter" src="https://lh5.googleusercontent.com/BDfAn8rsCeGrKuH7KMvo5Pbo0D5BUVCwk1LdcZcjGTaLVU0MbxBUkSgJNB0nR8Fk6MYklPyqnpivtaLVgPzAh_4J1gVYR6nJ4V6S4kY7rY3Ajk-hlQKyNNCQjsbsb2r1UQ" alt="Snapshotting.png" width="510px;" height="82px;" />

Now we can load these into Chrome Dev Tools for visual inspection.

<img class="aligncenter" src="https://lh4.googleusercontent.com/aR9FDDZdwFf0kpkHTNMGez4pez0ozPNOQ5h7YhKHViMlnms7-ILuawUcWAHn68qk8x_WzIbCfEF9Nke_O7O2AbdPuNLXdQB6QEN7sO3-rESeHm59fMdKEuPPONzgap3QGA" alt="Inspect_1.png" width="624px;" height="401px;" />

We sorted the first heap snapshot by object count and found that the ChocolateClass was the top memory utilizer with 37% of the objects in heap. But this is not enough evidence to conclusively prove anything. We can see some retainers at higher levels for other types of objects too.

Inspecting the second heap snapshot taken on the server after a delay of 1 minute from the first one, confirmed our suspicions. We can see that the ChocolateClass has suddenly bloated in heap consumption to about 77% of the heap size. The shallow and retainer sizes of this class is now close to 30% of overall.

<img class="aligncenter" src="https://lh5.googleusercontent.com/A085vHkbqTP-r0eSlypYXs4Fyg1sl796gF5UzPDyHA1jG3o3DxzwL8VwzVRGmMxYokutC55oAXPjixMdEBmNEAyPNE-U3qpDwaHBBRRq3ZET4wIl5HGuH-N0pwZPS--A4Q" alt="Inspect_2.png" width="624px;" height="380px;" />

Drilling down into the ChocolateClass, we see it’s the sugar array which is causing all this bloating. We can even inspect the call path, the data elements and attributes and all the objects in depth. Retaining paths are actually any paths that link objects with GC roots. Path inspection is critical here.

<img class="aligncenter" src="https://lh5.googleusercontent.com/tO24V6TnNJsdOcpT0ITlQW5oOmw3SdSTPuybEGC1g54KGcGOcc9clhgPyasZi0VEA56RmNWbADJ4yAFHjP7PldGOwnSHLsAPl4QYmkChnt-g8fWHYq-D7WZec8ec_i1kzQ" alt="Inspect3.png" width="624px;" height="328px;" />

Interestingly, we can see that there are nearly 47K sugar units in the array and the array is not being garbage collected properly.

<img class="aligncenter" src="https://lh4.googleusercontent.com/3dHG2DYTzWGz69cCmYJWks4XOXb3gXRPS7RjNwsQtul2hH_Td_RuRSxGz4OObqALQu9VuNpAxIWQv__mrjo4A-Gsl4tT8tbkne0UPXvTwMfO3LyfOQOQx9T1A1UgDy5hCg" alt="Inspect4.png" width="624px;" height="192px;" />

<h2 dir="ltr">
  <strong>Understanding some basic memory constructs in Node.js</strong>
</h2>

We are including the following key pointers around [memory analysis 101](https://developers.google.com/chrome-developer-tools/docs/memory-analysis-101) from Chrome Dev Tools documentation. We highly recommend understanding these constructs for successful memory analysis. In it they cover Object Sizes, Retaining Paths, Dominators and V8 specifics like JavaScript Object Representation and Object Groups.

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