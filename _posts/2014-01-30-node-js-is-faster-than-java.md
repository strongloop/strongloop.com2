---
id: 13736
title: What Makes Node.js Faster Than Java?
date: 2014-01-30T17:24:31+00:00
author: Issac Roth
guid: http://strongloop.com/?p=13736
permalink: /strongblog/node-js-is-faster-than-java/
categories:
  - Community
---
Every few weeks someone posts a Java vs Node benchmark, like [PayPal’s](https://www.paypal-engineering.com/2013/11/22/node-js-at-paypal/) or [Joey Whelan’s](http://joeywhelan.blogspot.com/2014/01/node-vs-java-web-service-performance.html). As one of [maintainers of Node](http://strongloop.com/developers/node-js-infographic/) core and contributors to many npm modules, StrongLoop is happy to see Node winning lately. Everyone knows benchmarks are a specific measurement and don’t account for all cases. Sometimes Java is faster. Sometimes Node is. Certainly what and how you measure matters a lot.

## **High concurrency matters**

But there’s one thing we can all agree on: At high levels of concurrency (thousands of connections) your server needs to go to asynchronous non-blocking. I would have finished that sentence with IO, but the issue is that if any part of your server code blocks you’re going to need a thread. And at these levels of concurrency, you can’t go creating threads for every connection. So the whole codepath needs to be non-blocking and async, not just the IO layer. This is where Node excels.

[<img class="aligncenter size-full wp-image-13765" alt="threading_node" src="https://strongloop.com/wp-content/uploads/2014/01/threading_node.png" width="2188" height="1308" />](https://strongloop.com/wp-content/uploads/2014/01/threading_node.png) [<img class="aligncenter size-full wp-image-13766" alt="threading_java" src="https://strongloop.com/wp-content/uploads/2014/01/threading_java.png" width="2228" height="1346" />](https://strongloop.com/wp-content/uploads/2014/01/threading_java.png)

&nbsp;

While Java or Node or something else may win a benchmark, no server has the non-blocking ecosystem of Node.js today. Over 50k modules all written in the async style, ready to use. Countless code examples strewn about the web. Lessons and tutorials all using the async style. [Debuggers, monitors, loggers, cluster managers,](http://strongloop.com/node-js-performance/strongops/) test frameworks and more all expecting your code to be non-blocking async.

Until Java or another language ecosystem gets to this level of support for the async pattern (a level we got to in Node because of async JavaScript in the browser), it won’t matter whether raw NIO performance is better than Node or any other benchmark result: Projects that need big concurrency will choose Node (and put up with its warts) because it’s the best way to get their project done.

## **Big companies, committed vendors and engaged community**

We’re going to help keep [maturing Node](http://strongloop.com/strongblog/performance-node-js-v-0-12-whats-new/) and the ecosystem of [tools](http://strongloop.com/node-js-performance/strongops/) and [libraries](http://strongloop.com/mobile-application-development/loopback/) as well. Others are doing the same, from big users like LinkedIn, Yahoo & Groupon to vendors like Microsoft, MuleSoft and Appcelerator and individual developers contributing thousands of useful modules every year. Node will keep getting better, we’ll help bandage over some of those warts or remove them altogether, and the era of async shall take us to the promised land of millions of connected devices.

## **Use StrongOps to Monitor Node Apps**

Ready to start monitoring event loops, manage Node clusters and chase down memory leaks? We’ve made it easy to get started with [StrongOps](http://strongloop.com/node-js-performance/strongops/) either locally or on your favorite cloud, with a [simple npm install](http://strongloop.com/get-started/).

[<img alt="Screen Shot 2014-02-03 at 3.25.40 AM" src="https://strongloop.com/wp-content/uploads/2014/02/Screen-Shot-2014-02-03-at-3.25.40-AM.png" width="1746" height="674" />](https://strongloop.com/wp-content/uploads/2014/02/Screen-Shot-2014-02-03-at-3.25.40-AM.png)

## [**Get trained in Node.js and API development**](http://strongloop.com/node-js/training/)**
  
** 

<p dir="ltr">
  Looking for Node.js and API development training? StrongLoop instructors are coming to a city near you:
</p>

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Nov 6-7: <a href="http://strongloop.com/node-js/training-denver-2014/">Denver, CO</a> at Galvanize Campus</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Nov 13-14: <a href="http://strongloop.com/node-js/training-herndon-2014/">Herndon, VA</a> at Vizuri</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Dec 3-4: <a href="http://strongloop.com/node-js/training-framingham-2014/">Framingham, MA</a> at Applause</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Dec 11-12: <a href="http://strongloop.com/node-js/training-minneapolis-2014/">Minneapolis, MN</a> at BestBuy</span>
</li>

Check out our complete [Node.js and API development training, conference and Meetup calendar](http://strongloop.com/developers/events/) to see where you can come meet with StrongLoop engineers.

## **What’s next?**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What&#8217;s in the upcoming Node v0.12 version? <span style="text-decoration: underline;"><a href="http://strongloop.com/strongblog/performance-node-js-v-0-12-whats-new/">Big performance optimizations</a>,</span> read the blog to learn more.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Watch Bert Belder’s comprehensive <a href="http://strongloop.com/developers/videos/#whats-new-in-nodejs-v012">video </a>presentation on all the new upcoming features in v0.12</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? We’ve made it easy to get started either locally or on your favorite cloud, with a simple npm install. <a href="http://strongloop.com/get-started/">Get Started >></a></span>
</li>

<div>
</div>