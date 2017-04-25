---
id: 15782
title: 'Node.js Performance Tip of the Week: Heap Profiling'
date: 2014-04-25T08:24:56+00:00
author: Qihan Zhang
guid: http://strongloop.com/?p=15782
permalink: /strongblog/node-js-performance-heap-profiling-tip/
categories:
  - Arc
  - Community
  - How-To
  - Performance Tip
---
_Please note that as of Aug 3, 2015, StrongOps has been EOL&#8217;d. Check out [StrongLoop Arc](https://strongloop.com/node-js/arc/) for the same capabilities and more._

Node provides us with great power, but with great power comes great responsibility. This is especially true for the large, distributed applications that are known to benefit the most from Node. The ability to translate JavaScript into native machine language instead of interpreting it as bytecode, combined with asynchronous programming allowing non-blocking IO, is the core of what makes Node so fast and powerful.

Node runs it’s applications on [Google’s V8 JavaScript engine](https://code.google.com/p/v8/), which uses a [heap structure](http://en.wikipedia.org/wiki/Heap_(data_structure)) similar to JVM and most other languages. And like most other languages there exists many common pitfalls that can lead to poor performance brought on by memory leaks. Thus, managing the heap is vital to maintaining optimal performance and efficiency for your applications.<!--more-->

## **Just throw memory at the problem, right?**

Some would argue that just restarting the application or throwing more RAM at it is all that is needed and memory leaks aren’t fatal in Node. However, as leaks grow, V8 becomes increasingly aggressive about garbage collection. This is manifested as high frequency and longer time spent in GC, slowing your app down. So in Node, memory leaks hurt performance.

Leaks can often be masked assasins. Leaky code can hang on to references to limited resources. You may run out of file descriptors or you may suddenly be unable to open new database connections. So it may look like your backends are failing the application, but it’s really a container issue.

In this week’s highlight, we cover [StrongLoop Arc](https://strongloop.com/node-js/build-deploy-and-scale/) heap profiling. One of the many metrics monitored by Arc is the heap size and usage of your Node applications over time. This allows you to dig deep into the V8 heap and help you pinpoint the root cause of any memory leaks. What&#8217;s StrongLoop Arc? It&#8217;s a DevOps and performance monitoring dashboard for Node apps. Here&#8217;s a one minute intro video to learn more!

<div class='avia-iframe-wrap'>
</div>

## **Heap Size**

When running Node applications in production, heap usage, heap growth and frequency of garbage collection are key parameters which should be tuned for optimal memory processing.

The Heap Size graph of Arc monitors three key metrics of memory performance over time:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Heap: Current heap size (MB)</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">RSS: Resident set size (MB)</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">V8 Full GC: Heap size sampled immediately after a full garbage collection (MB)</span>
</li>

<img src="https://lh4.googleusercontent.com/cf3kYEQvmOxWb-DhIs9CR7jwdKPd0VTP9Sg2CP-efGw1E8a2SGTuWwp-wyr2st061AVZpOkIpygt2EpJCXSRfgcYyn7QD2oS3fbmkOX4d2kJTfVoEmMndXkN1ZBzPy3WYA" alt="" width="624px;" height="251px;" />

These metrics on historical timescales (1/3/6/12/24 hrs) help detect patterns like slow or abrupt memory leaks in the system. Such leaks will cause the application to crash and report out of memory conditions. Heap growth under load is normal in Node and the heap itself tries to resize based on consumption. However the heap currently in use needs to be within acceptable ranges. The V8 GC size reflects the baseline of memory usage over multiple GC cycles where clean up of out of scope elements in the heap takes place. V8 Full GC consumption is expected to stay in a saw-tooth pattern as net usage.

To use it, [login](https://strongops.strongloop.com) to your dashboard and select the &#8220;Memory&#8221; check box on the metric selection menu on the left panel of the dashboard.

<h2 dir="ltr">
  <strong>Heap profiler</strong>
</h2>

Once we suspect a memory leak in Node application based on heap size monitoring, best practice methodology is to deep-profile the application at an object level for diagnosing non-optimal memory patterns. Arc provides heap profiler that enables you to monitor the counts and memory use of all instances of a constructor type, for example among others:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Timer</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Array</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">String</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Object</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Timeout</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Arguments</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Number</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Buffer</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">SlowBuffer</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Sockets</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Requests</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">URL</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">State (Writable and Readable)</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Code</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Queues</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Query</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Messages</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Native</span>
</li>

**
  
** 

## **Normal (Non-Leaky) memory profile**

<img src="https://lh4.googleusercontent.com/PU3gbmaijXlMhb6tZ0iCFG9jV_JOOHRnfpnK2WHkYD22t82fenOZChbT2g_HhJYy7wczHzM2OykgJKsFvP_bBgF6rb8-b1qspGTD5svqYrZed5Zu_HMJWVHJ2HUgRY5uBQ" alt="" width="624px;" height="428px;" />

Allocated memory and actual memory usage by that object types help isolate potential leaking constructs. More often than not, memory leaks are found in collection objects like arrays or hashmaps. However, it is not uncommon for leaks to occur in String or even native objects.

Instance counts are expected to stay in a range or band which matches the net of incoming request workload / concurrency vs. response served. As responses are served and objects exit scope, their instance counts too should drop along with freeing used memory back into the heap after garbage collection.

## **Leaky Memory Profile**

<img src="https://lh6.googleusercontent.com/2jxg21qbVHQxwn13wZLProT1-DSn8mEIeP1n2lx95oXgke5IA5emqPpVHbNuNQ5fVdegUGZOcU0At7HQ1z9fRWo5sLadzkA2TQyOArxks7It9uj8FbE9jAF65dn9C4S9Eg" alt="leaky.png" width="624px;" height="429px;" />

In case of un-natural instance count growth, retainers should be inspected. Retainer inspection can be done by taking memory snapshots or [heapdumps](http://docs.strongloop.com/display/SLC/Diagnose+memory+leaks) and analyzing them using Chrome-Dev tools. We will dive into Node heapdump in [next week&#8217;s Memory Leak Analysis blog](http://strongloop.com/strongblog/node-js-performance-tip-of-the-week-memory-leak-diagnosis/).

<div id="design-apis-arc" class="post-shortcode" style="clear:both;">
  <h2>
    <a href="http://strongloop.com/node-js/arc/"><strong>Develop APIs Visually with StrongLoop Arc</strong></a>
  </h2>
  
  <p>
    StrongLoop Arc is a graphical UI for the <a href="http://strongloop.com/node-js/api-platform/">StrongLoop API Platform</a>, which includes LoopBack, that complements the <a href="http://docs.strongloop.com/pages/viewpage.action?pageId=3834790">slc command line tools</a> for developing APIs quickly and getting them connected to data. Arc also includes tools for building, profiling and monitoring Node apps. It takes just a few simple steps to <a href="http://strongloop.com/get-started/">get started</a>!
  </p>
  
  <img class="aligncenter size-large wp-image-21950" src="https://strongloop.com/wp-content/uploads/2014/12/Arc_Monitoring_Metrics-1030x593.jpg" alt="Arc_Monitoring_Metrics" width="1030" height="593" />
</div>

<h2 dir="ltr">
  <strong>What’s next?</strong>
</h2>

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Get the technical whitepaper <a href="http://strongloop.com/promotions/infoq/">“Getting Started with DevOps for Node.js”</a></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What’s in the upcoming Node v0.12 release? <a href="http://strongloop.com/strongblog/performance-node-js-v-0-12-whats-new/">Big performance optimizations</a>, read <a href="https://github.com/bnoordhuis">Ben Noordhuis’</a> blog to learn more.</span>
</li>