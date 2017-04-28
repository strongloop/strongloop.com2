---
id: 14667
title: Debugging CoffeeScript with the Node Inspector Debugger
date: 2014-03-06T07:50:42+00:00
author: Miroslav Bajtoš
guid: http://strongloop.com/?p=14667
permalink: /strongblog/debug-coffeescript-node-js-inspector/
categories:
  - Community
  - How-To
---
<p dir="ltr">
  For what it’s worth, since we announced the availability of <a href="http://strongloop.com/strongblog/whats-new-in-the-node-inspector-v0-7-debugger/">Node Inspector v0.7</a> last week, we got a few questions about whether or not you could use Node Inspector to debug <a href="http://coffeescript.org/">CoffeeScript</a>. The good news is, yes!
</p>

<p dir="ltr">
  Getting started is straight-forward, just make sure to <a href="http://coffeescript.org/#source-maps%20">generate source-maps</a> when compiling your CoffeeScript sources to JavaScript by adding &#8220;-m&#8221; option.
</p>

For example:

```js
coffee -c -m *.coffee
node-debug app.js
```

For <a href="http://gruntjs.com/">Grunt</a> users, the <a href="https://github.com/gruntjs/grunt-contrib-coffee">grunt-contrib-coffee</a> plugin has an option named &#8220;sourceMap&#8221;.

<p dir="ltr">
  Node Inspector supports source-maps out of the box, so no extra configuration is needed.
</p>

## What’s next?

<ul>
<li>What’s in the upcoming Node v0.12 release? <a href="http://strongloop.com/strongblog/performance-node-js-v-0-12-whats-new/">Big performance optimizations</a>, read <a href="https://github.com/bnoordhuis">Ben Noordhuis’</a> blog to learn more.</li>
<li>Watch <a href="https://github.com/piscisaureus">Bert Belder’s</a> comprehensive <a href="http://strongloop.com/developers/videos/#whats-new-in-nodejs-v012">video </a>presentation on all the new upcoming features in v0.12</li>
</ul>
