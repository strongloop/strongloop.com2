---
id: 16612
title: 'Node.js Performance Tip of the Week: Event Loop Monitoring'
date: 2014-05-27T08:36:03+00:00
author: Shubhra Kar
guid: http://strongloop.com/?p=16612
permalink: /strongblog/node-js-performance-event-loop-monitoring/
categories:
  - Arc
  - How-To
  - Node DevOps
  - Performance Tip
---
_Please note that as of Aug 3, 2015, StrongOps has been EOL&#8217;d. Check out [StrongLoop Arc](https://strongloop.com/node-js/arc/) for the same capabilities and more._

In [last week’s performance tip](http://strongloop.com/strongblog/node-js-performance-scaling-proxies-clusters/), we discussed in detail how to scale Node.js applications using proxies and clustering. In this week&#8217;s post we&#8217;ll look at the basics of how an event loop works and how it can cause performance issues when it goes into blocking mode. We will also discuss some tools to triage blocked event loops.

<h2 dir="ltr">
  <strong>The almighty event loop</strong>
</h2>

The event loop gives Node the capability to handle highly concurrent requests while still running “single-threaded”.  The event loop delegates processing to the operating system via POSIX interface while still handling new request events and callbacks.

[<img class="aligncenter size-medium wp-image-28516" src="https://strongloop.com/wp-content/uploads/2014/05/threading_node-300x179.png" alt="threading_node" width="300" height="179" srcset="https://strongloop.com/wp-content/uploads/2014/05/threading_node-300x179.png 300w, https://strongloop.com/wp-content/uploads/2014/05/threading_node-768x459.png 768w, https://strongloop.com/wp-content/uploads/2014/05/threading_node-1030x615.png 1030w, https://strongloop.com/wp-content/uploads/2014/05/threading_node-1500x896.png 1500w, https://strongloop.com/wp-content/uploads/2014/05/threading_node-705x421.png 705w, https://strongloop.com/wp-content/uploads/2014/05/threading_node-450x269.png 450w, https://strongloop.com/wp-content/uploads/2014/05/threading_node.png 1600w" sizes="(max-width: 300px) 100vw, 300px" />](https://strongloop.com/wp-content/uploads/2014/05/threading_node.png)

You can read more about workings of the event loop in one of our [previous blogs](http://strongloop.com/strongblog/node-js-event-loop/). In layman terms, an event loop is like a mailman delivering messages (events) to every mailbox marked by specific routes (callbacks). This mailman is a single person running on only one code path at one time. While on a code route, he can get an additional event transmitted by the same callback function handling a previous request event. When this happens the postman can take a small diversion, delivering the new event (message) to its destination mailbox and then carrying on with the original route (callback) to deliver the event.<!--more-->

## **Blocking the event loop**

Blocking the event loop can have catastrophic effects on the Node application. Let&#8217;s look at an example of blocking by external events&#8230;

We&#8217;ll start by giving the postman a letter to deliver that requires a gate to be open. He gets there and the gate is closed, so he simply waits and tries repeatedly.

[<img class="aligncenter size-medium wp-image-28519" src="https://strongloop.com/wp-content/uploads/2014/05/mailman-300x217.png" alt="mailman" width="300" height="217" srcset="https://strongloop.com/wp-content/uploads/2014/05/mailman-300x217.png 300w, https://strongloop.com/wp-content/uploads/2014/05/mailman-768x556.png 768w, https://strongloop.com/wp-content/uploads/2014/05/mailman-1030x746.png 1030w, https://strongloop.com/wp-content/uploads/2014/05/mailman-705x511.png 705w, https://strongloop.com/wp-content/uploads/2014/05/mailman-450x326.png 450w, https://strongloop.com/wp-content/uploads/2014/05/mailman.png 1081w" sizes="(max-width: 300px) 100vw, 300px" />](https://strongloop.com/wp-content/uploads/2014/05/mailman.png)

Even if there is a letter on the stack that will ask someone to open the gate, it won’t work. The postman will never get to deliver the letter because he&#8217;s stuck waiting endlessly for the gate to open. This is because the event that opens the gate is external from the current event callback. If we emit the event from within a callback, we already know our postman will go and deliver that letter before carrying on. However, when events are emitted external to the currently executing piece of code, they will not be called until that piece of code has been fully evaluated to its conclusion.

## **An example**

Let&#8217;s borrow an example from a rather scathing post about Node by Ted Dziuba a few years back. _(Note: the URL to the original post was removed by the author a long time ago.)_

A function call is said to block when the current thread of execution’s flow waits until that function is finished before continuing. Typically, we think of I/O as “blocking&#8221;. For example, if you are calling socket.read(), the program will wait for that call to finish before continuing, as you need to do something with the return value.

Here’s a fun fact: every function call that does CPU work also blocks. This function, which calculates the n’th Fibonacci number, will block the current thread of execution because it’s using the CPU.

```js
function fibonacci(n) {
 if (n &lt; 2)
   return 1;
 else
   return fibonacci(n-2) + fibonacci(n-1);
}
```

Ted goes on to demonstrate how his Fibonacci server written in Node has abysmal performance. That’s great, but we don’t usually build fibonacci servers in Node. However, there are cases where Node does become CPU bound and blocking, albeit unintentionally:

```js
function requestHandler(req, res) {
  var body = req.rawBody; // Contains the POST body
  try {
     var json = JSON.parse(body);
     res.end(json.user.username);
  }
  catch(e) {
     res.end("FAIL");
  }
}
```

This example just takes the request’s body and parses it. So, it should work great until somebody POSTs a 15mb JSON file! Executing the JSON.parse() call on a 15mb JSON file took about 1.5 seconds. Stringyfying a JSON data structure of this size with JSON.stringify(json, null, 2) takes about 3 seconds.

You may be thinking, “Oh, 1.5 seconds, 3 seconds, that’s still pretty fast!” However, during this time the event loop is completely blocked and the Node process will not accept new connections or process ongoing requests. Even with smaller payloads at high concurrency, this clogging will still happen and affect performance.

## **Triaging event loop blocking**

With [StrongLoop Arc](https://strongloop.com/node-js/build-deploy-and-scale/), you are able to monitor concurrent connections, as well as the throughput of a Node applications. What&#8217;s StrongLoop Arc? It&#8217;s a performance monitoring and DevOps dashboard for Node apps. In the below examples we ran two cycles of load with a similar code pattern. We had 2 types of functions, one dependent on the other and the second one being CPU intensive or in a way blocking.

## **Concurrency and throughput**

**
  
[<img class="aligncenter size-large wp-image-28520" src="https://strongloop.com/wp-content/uploads/2014/05/concurrent-connections-1030x395.png" alt="concurrent connections" width="1030" height="395" srcset="https://strongloop.com/wp-content/uploads/2014/05/concurrent-connections-1030x395.png 1030w, https://strongloop.com/wp-content/uploads/2014/05/concurrent-connections-300x115.png 300w, https://strongloop.com/wp-content/uploads/2014/05/concurrent-connections-768x294.png 768w, https://strongloop.com/wp-content/uploads/2014/05/concurrent-connections-1500x575.png 1500w, https://strongloop.com/wp-content/uploads/2014/05/concurrent-connections-705x270.png 705w, https://strongloop.com/wp-content/uploads/2014/05/concurrent-connections-450x172.png 450w, https://strongloop.com/wp-content/uploads/2014/05/concurrent-connections.png 1600w" sizes="(max-width: 1030px) 100vw, 1030px" />](https://strongloop.com/wp-content/uploads/2014/05/concurrent-connections.png)** 

We can see the number of concurrent connections rises from about 2-3 in the first run to about “40” in the second run &#8211; note these are unprocessed requests sitting on the event loop gateway. We can see the throughput variance i.e. from around 100 TPS max to around 120 TPS max in the second run.

However, in the second run, we can see that growth of concurrent connections far outpaces the growth in throughput indicating that a processing bottleneck exists under the hood. In this graph, particularly the second run indicates that incoming requests are getting queued up on the frontend and increasing response times for requests that complete processing.

## **Event loop processing time**

[<img class="aligncenter size-large wp-image-28522" src="https://strongloop.com/wp-content/uploads/2014/05/event-loop-1030x398.png" alt="event loop" width="1030" height="398" srcset="https://strongloop.com/wp-content/uploads/2014/05/event-loop-1030x398.png 1030w, https://strongloop.com/wp-content/uploads/2014/05/event-loop-300x116.png 300w, https://strongloop.com/wp-content/uploads/2014/05/event-loop-768x297.png 768w, https://strongloop.com/wp-content/uploads/2014/05/event-loop-1500x579.png 1500w, https://strongloop.com/wp-content/uploads/2014/05/event-loop-705x272.png 705w, https://strongloop.com/wp-content/uploads/2014/05/event-loop-450x174.png 450w, https://strongloop.com/wp-content/uploads/2014/05/event-loop.png 1600w" sizes="(max-width: 1030px) 100vw, 1030px" />](https://strongloop.com/wp-content/uploads/2014/05/event-loop.png)
  
When we inspected the event loop metrics, we saw that average processing times had climbed up sharply in both those 2 load cycles. From about 40ms to 75ms and the slowest even loop ranged from 15 ms to 1.3 seconds. So, when the slowest event loop is blocked for 1.3 seconds, the server practically stops accepting any requests. We can see Socket connection failures on the frontend. Sometimes, these errors just may manifest as slow response times and not connection errors occurring, due to the timeout of waiting requests.

[<img class="aligncenter size-large wp-image-28523" src="https://strongloop.com/wp-content/uploads/2014/05/Screen-Shot-2014-05-27-at-5.38.38-AM-1030x524.png" alt="Screen Shot 2014-05-27 at 5.38.38 AM" width="1030" height="524" srcset="https://strongloop.com/wp-content/uploads/2014/05/Screen-Shot-2014-05-27-at-5.38.38-AM-1030x524.png 1030w, https://strongloop.com/wp-content/uploads/2014/05/Screen-Shot-2014-05-27-at-5.38.38-AM-300x153.png 300w, https://strongloop.com/wp-content/uploads/2014/05/Screen-Shot-2014-05-27-at-5.38.38-AM-768x391.png 768w, https://strongloop.com/wp-content/uploads/2014/05/Screen-Shot-2014-05-27-at-5.38.38-AM-1500x763.png 1500w, https://strongloop.com/wp-content/uploads/2014/05/Screen-Shot-2014-05-27-at-5.38.38-AM-705x359.png 705w, https://strongloop.com/wp-content/uploads/2014/05/Screen-Shot-2014-05-27-at-5.38.38-AM-450x229.png 450w, https://strongloop.com/wp-content/uploads/2014/05/Screen-Shot-2014-05-27-at-5.38.38-AM.png 1600w" sizes="(max-width: 1030px) 100vw, 1030px" />](https://strongloop.com/wp-content/uploads/2014/05/Screen-Shot-2014-05-27-at-5.38.38-AM.png)

&nbsp;

What we are able to see is e a distinct correlation between these two patterns. Our next step is to use the Arc CPU profiler to break down the CPU times spent by every function. Using the CPU profiler, which is an extension of the V8 profiler, we were able to isolate the CPU heavy functions, path and line of code execution during the test runs.

## **Using V8 profiling to view blocking functions**

[<img class="aligncenter size-large wp-image-28524" src="https://strongloop.com/wp-content/uploads/2014/05/Profile2_1-1030x653.png" alt="Profile2_1" width="1030" height="653" srcset="https://strongloop.com/wp-content/uploads/2014/05/Profile2_1-1030x653.png 1030w, https://strongloop.com/wp-content/uploads/2014/05/Profile2_1-300x190.png 300w, https://strongloop.com/wp-content/uploads/2014/05/Profile2_1-768x487.png 768w, https://strongloop.com/wp-content/uploads/2014/05/Profile2_1.png 1500w, https://strongloop.com/wp-content/uploads/2014/05/Profile2_1-705x447.png 705w, https://strongloop.com/wp-content/uploads/2014/05/Profile2_1-450x285.png 450w" sizes="(max-width: 1030px) 100vw, 1030px" />](https://strongloop.com/wp-content/uploads/2014/05/Profile2_1.png)

&nbsp;

&nbsp;

A possible solution here is if there are two dependent functions competing for same event loop; the second one being blocking or a long running process,  one approach could be move that function to a forked process. You can move the longer-running, synchronous task (in this case, the &#8220;for&#8221; loops) into its own module and use “[child_process.fork()](http://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options)” to execute it. Alternately, you should also look at [web-workers](https://www.npmjs.org/package/webworker-threads) or StrongLoop’s [cluster control](http://docs.strongloop.com/display/SLC/Control+an+application+cluster) for forking commands.

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