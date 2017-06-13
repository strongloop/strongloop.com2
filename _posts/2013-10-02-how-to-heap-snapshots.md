---
id: 7781
title: 'How-to: Heap Snapshots and Handling Node.js Memory Leaks'
date: 2013-10-02T10:32:38+00:00
author: Marc Harter
guid: http://strongloop.com/?p=7781
permalink: /strongblog/how-to-heap-snapshots/
categories:
  - How-To
---
_In the beginning, there were memory leaks in JavaScript
  
… and we could not have cared less._

_Then there was Ajax
  
… and we started to care._

_Then there were these long-running Node processes on our production servers
  
… and we really cared a lot!_

Node memory leaks happen. Usually they occur in production where processes experience the weight of their purpose and a mandate for uptime. Thankfully, the core of Node is becoming more and more resilient to leaks. However, between our code and the modules we include, leaks still happen and it’s good to be prepared to handle them.

<div id="attachment_7785" style="width: 584px" class="wp-caption aligncenter">
  <a href="{{site.url}}/blog-assets/2013/10/0-N_FfMFoOMR9RRl4T.png"><img class="size-full wp-image-7785" alt="A runaway Node process" src="{{site.url}}/blog-assets/2013/10/0-N_FfMFoOMR9RRl4T.png" width="574" height="37" /></a>
  
  <p class="wp-caption-text">
    A runaway Node process
  </p>
</div>

Ben Noordhuis, a core contributor and member of the StrongLoop team, created the <a href="https://github.com/bnoordhuis/node-heapdump" target="_blank">heapdump</a> module to provide developers a simple mechanism for producing V8 heap snapshots. In this article, we will talk about:

  1. Instrumenting your app with heapdump
  2. Techniques for collecting snapshots
  3. Resources for snapshot analysis

> **<span style="color: gray;">These may not be the tools you are looking for. </span>**If you observed closely at the **top** output above, you may have noticed I cheated. My app has barely been running; however, it is taking up a lot of memory already. If you have an app where memory leaks can be duplicated, use tools like <a href="https://github.com/c4milo/node-webkit-agent" target="_blank">node-webkit-agent</a> or <a href="https://github.com/node-inspector/node-inspector" target="_blank">node-inspector</a> locally to help pinpoint the problem.

## Instrumenting your application

First, install heapdump using npm:

```js
npm install heapdump
```

Once installed, you need to load the heapdump module into your application:

```js
var heapdump = require('heapdump')
```

When you&#8217;ve done that, you can take snapshots in two different ways. The first way is to use the **<span style="color: gray;">writeSnapshot </span>**method:

```js
var heapdump = require('heapdump')
...
heapdump.writeSnapshot()
```

The second way is to send a **<span style="color: gray;">SIGUSR2</span>** signal to the process (UNIX only):

```js
kill -USR2 <pid>
```

Snapshots are written to your current working directory with a timestamp like _heapdump-179641052.37605.heapsnapshot_. There will also be xxxx_.log_ of the same name written containing stats about the heap when the snapshot was taken.

### <span style="color: gray;">Setting the current working directory</span>

It is important to make sure that your current working directory (CWD) is writable by the process. If it isn’t, no snapshots will be written. You can set the CWD manually in your application with:

```js
process.chdir('/path/to/writeable/dir')
```

### <span style="color: gray;">Loading snapshots into Chrome Dev Tools</span>

When you have taken a snapshot, load the xxxx_.heapsnapshot_ file into Chrome Dev Tools by heading to the **Profiles** tab, right-clicking the **Profiles** pane and selecting **Load**:

<div id="attachment_7783" style="width: 858px" class="wp-caption aligncenter">
  <a href="{{site.url}}/blog-assets/2013/10/0-9NFdFBViTQxhDbBu.png"><img class="size-full wp-image-7783" alt="Right-click Profiles pane in Dev Tools to load a snapshot from disk" src="{{site.url}}/blog-assets/2013/10/0-9NFdFBViTQxhDbBu.png" width="848" height="436" /></a>
  
  <p class="wp-caption-text">
    Right-click Profiles pane in Dev Tools to load a snapshot from disk
  </p>
</div>

Then, you are able to view the contents using the tools:

<div id="attachment_7784" style="width: 860px" class="wp-caption aligncenter">
  <a href="{{site.url}}/blog-assets/2013/10/0-GE1kMwJYjZnOpsjb.png"><img class="size-full wp-image-7784" alt="Heap snapshot tools in Dev Tools" src="{{site.url}}/blog-assets/2013/10/0-GE1kMwJYjZnOpsjb.png" width="850" height="457" /></a>
  
  <p class="wp-caption-text">
    Heap snapshot tools in Dev Tools
  </p>
</div>

## Strategies for taking snapshots

Unfortunately, not all memory leaks are created equal. Some are slow leaks that can take hours or even days to build. Some happen on under-utilized code paths. Some are constant. So when should you take a snapshot? The answer: it depends.

It’s good to have a baseline snapshot to compare memory usage. You may want to generate a snapshot after your application is up and running for a few minutes. If you are running a UNIX server, send a **<span style="color: gray;">SIGUSR2</span>** to the process to record the snapshot. As you notice the memory usage increase, repeat the process to gather more data for analysis later.

> Whenever you take a heap snapshot, V8 will perform a GC prior to taking the snapshot to give you an accurate picture of what is sticking around in your process. So don’t be surprised if you notice your memory usage drop after taking a snapshot.

You could also programmatically take snapshots on an interval that makes sense for the memory growth observed:

```js
var heapdump = require('heapdump')
...
setInterval(function () {
  heapdump.writeSnapshot()
}, 6000 * 30) <strong>(1)</strong>
```

  1. Write a snapshot to the current working directory every half hour.

> Taking a snapshot is not free. It will peg a CPU until the snapshot is written. The larger the heap, the longer it takes. On UNIX, snapshots are written in a forked process asynchronously (Windows will block).

You could also watch the memory usage growth programmatically and generate snapshots:

```js
var heapdump = require('heapdump')
var nextMBThreshold = 0 <strong>(1)</strong>
```

```js
setInterval(function () {
  var memMB = process.memoryUsage().rss / 1048576 <strong>(2)</strong>
  if (memMB > nextMBThreshold) { <strong>(3)</strong>
    heapdump.writeSnapshot()
    nextMBThreshold += 100
  }
}, 6000 * 2) <strong>(4)</strong>
```

  1. Next MB threshold to be breached
  2. Calculate RSS size in MB
  3. Whenever we breach the **nextMBThreshold**, write a snapshot and increment the threshold by 100 MB.
  4. Run this check every couple minutes

## **<span style="color: gray;">Analyzing snapshot data</span>**

Once you have collected two or more snapshots representing the change in memory, it is time to analyze the data. Copy the snapshots to your local machine, load the snapshots into Chrome Dev Tools and start analyzing!

If you haven’t worked with heap snapshot analysis in Dev Tools, here are some valuable links to get you started:

  1. <a href="https://developers.google.com/chrome-developer-tools/docs/memory-analysis-101" target="_blank">Memory Analysis 101</a>
  2. <a href="http://addyosmani.com/blog/taming-the-unicorn-easing-javascript-memory-profiling-in-devtools/" target="_blank">Taming The Unicorn: Easing JavaScript Memory Profiling In Chrome DevTools</a>

I find the **<span style="color: gray;">Comparison</span>** view helpful. Unfortunately, **<span style="color: gray;">Comparison</span>** hasn’t worked for imported snapshots. However, this bug has recently been fixed (see <a href="http://code.google.com/p/chromium/issues/detail?id=154084" target="_blank">bug</a> ticket)!

For more detail on the purpose for the Comparison view and the other views, see <a href="https://developers.google.com/chrome-developer-tools/docs/heap-profiling#views" target="_blank">the heap profiling documentation</a>.

## Making heap snapshots more concrete

If you are like me, I hardly care about taking heap snapshots until I _really_ need to. Do yourself a favor and practice using these tools before problems arise. Here is a simple process to practice:

  1. Instrument one of your apps with heapdump
  2. If in production, ensure snapshots are being written to the current working directory
  3. Practice taking snapshots with **<span style="color: gray;">SIGUSR2</span>** if you are on UNIX
  4. Load snapshots into Chrome and take a peak at what is currently stored in your application. Any surprises?

## Summary

Memory leaks can happen and thankfully we don’t have tackle them blindly. In this article, we focused on the heapdump module. We looked at the process of instrumenting our application, taking heap snapshots, loading them into Chrome Dev Tools. We then looked at strategies for getting useful data to analyze. Lastly, we covered some resources for analysis using Dev Tools.

## **[What’s next?](http://strongloop.com/get-started/)**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What’s in the upcoming Node v0.12 release? <a href="http://strongloop.com/node-js/whats-new-in-node-js-v0-12/">Six new features, plus new and breaking APIs</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js <a href="http://loopback.io/">LoopBack framework</a>. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
</li>