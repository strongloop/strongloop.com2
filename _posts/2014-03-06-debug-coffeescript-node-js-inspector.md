---
id: 14667
title: Debugging CoffeeScript with the Node Inspector Debugger
date: 2014-03-06T07:50:42+00:00
author: Miroslav Bajtoš
guid: http://strongloop.com/?p=14667
permalink: /strongblog/debug-coffeescript-node-js-inspector/
categories:
  - Arc
  - Community
  - How-To
---
<p dir="ltr">
  For what it’s worth, since we announced the availability of <a href="http://strongloop.com/strongblog/whats-new-in-the-node-inspector-v0-7-debugger/">Node Inspector v0.7</a> last week, we got a few questions about whether or not you could use Node Inspector to debug <a href="http://coffeescript.org/">CoffeeScript</a>. The good news is, yes!
</p>

<p dir="ltr">
  Getting started is straight-forward, just make sure to <a href="http://coffeescript.org/#source-maps%20">generate source-maps</a> when compiling your CoffeeScript sources to JavaScript by adding &#8220;-m&#8221; option.
</p>

<p dir="ltr">
  For example:
</p>

<p dir="ltr">
  <code>coffee -c -m *.coffee&lt;br />
node-debug app.js</code>
</p>

<p dir="ltr">
  For <a href="http://gruntjs.com/">Grunt</a> users, the <a href="https://github.com/gruntjs/grunt-contrib-coffee">grunt-contrib-coffee</a> plugin has an option named &#8220;sourceMap&#8221;.
</p>

<p dir="ltr">
  Node Inspector supports source-maps out of the box, so no extra configuration is needed.
</p>

## **[Use StrongOps to Monitor Node Apps](http://strongloop.com/node-js-performance/strongops/)
  
** 

Ready to start monitoring event loops, manage Node clusters and chase down memory leaks? We’ve made it easy to get started with [StrongOps](http://strongloop.com/node-js-performance/strongops/) either locally or on your favorite cloud, with a [simple npm install](http://strongloop.com/get-started/).

<a href="http://strongloop.com/wp-content/uploads/2014/02/Screen-Shot-2014-02-03-at-3.25.40-AM.png" rel="lightbox"><img alt="Screen Shot 2014-02-03 at 3.25.40 AM" src="http://strongloop.com/wp-content/uploads/2014/02/Screen-Shot-2014-02-03-at-3.25.40-AM.png" width="1746" height="674" /></a>

## **[What’s next?](http://strongloop.com/get-started/)
  
** 

<li style="margin-left:2em;">
  <span style="font-size: 18px;">What’s in the upcoming Node v0.12 release? <a href="http://strongloop.com/strongblog/performance-node-js-v-0-12-whats-new/">Big performance optimizations</a>, read <a href="https://github.com/bnoordhuis">Ben Noordhuis’</a> blog to learn more.</li> 
  
  <li style="margin-left:2em;">
    <span style="font-size: 18px;">Watch <a href="https://github.com/piscisaureus">Bert Belder’s</a> comprehensive <a href="http://strongloop.com/developers/videos/#whats-new-in-nodejs-v012">video </a>presentation on all the new upcoming features in v0.12</li> 
    
    <li style="margin-left:2em;">
      <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</li> </ul>