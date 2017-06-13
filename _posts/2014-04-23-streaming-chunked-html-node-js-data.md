---
id: 15534
title: Using Streaming Chunked HTML to Get Node.js to Deliver More Data
date: 2014-04-23T07:33:10+00:00
author: Jed Wood
guid: http://strongloop.com/?p=15534
permalink: /strongblog/streaming-chunked-html-node-js-data/
categories:
  - Community
  - How-To
---
One of the main draws to Node.js is its ability to respond efficiently to a large number of requests, but users of your app don&#8217;t care how much you&#8217;re squeezing out of a single core. They want stuff to show up. Now.

## **BigPipe**

A few years ago, Facebook introduced a new technique it started using on its homepage called [BigPipe](https://www.facebook.com/notes/facebook-engineering/bigpipe-pipelining-web-pages-for-high-performance/389414033919). It combines the benefits of [making fewer HTTP calls](https://developers.google.com/speed/docs/best-practices/request) with being [quick to the first paint](https://developers.google.com/speed/articles/browser-paint-events). The benefits can be substantial, but BigPipe uses some unconventional approaches to dividing up CSS and markup that could be quite a departure from the common frameworks and architecture you’re probably using to build your apps. Unless you’ve achieved Facebook&#8217;s scale, the tradeoffs might not be worth it.

## **Half-measures with benefits**

You can still get a lot of mileage out of a few simple tweaks that won’t require many changes to your standard setup. When it comes to your users’ perception of speed, nothing causes more harm than a blank white page and a busy browser icon showing no progress. Sending the first part of the response before it&#8217;s finished can have a big impact on the perceived speed of your app.

The technique is pretty simple: we’ll be using a feature of HTTP 1.1 called [Chunked transfer encoding](http://en.wikipedia.org/wiki/Chunked_transfer_encoding). With a standard Express.js response, you normally use `res.send` or `res.render`. These handy shortcuts write best-guess headers and send of the response with a single command.<!--more-->

The downside is that it doesn’t send anything before that. You might be holding up the whole page while you wait for one little section that&#8217;s pulling from the Twitter API.

Instead, we’ll break things up and write a few more lines of code. Let&#8217;s start with the HTML `head`, our CSS and JS tags, and the opening tag of the `body` element:

```js
app.get('/test', function(req, res){
  res.write('<head>
  ');
    // res.write(... css and js tags)
    res.write('');
  });
```
  
  
<p>
  Express automatically sets the HTTP &#8216;Transfer-Encoding&#8217; header to &#8216;chunked.&#8217; It then sends the HTML that we&#8217;ve created here. Once the browser sees the JS and CSS tags in that <code>head</code> element, it can start downloading those assets while your app is finishing the body of its response.
</p>


<p>
  After we’ve fetched and rendered the necessary bits for the rest of our page (database calls, external APIs, and so forth), we write those out, and then close the <code>body</code> and HTML tags, and finish the response by using <code>res.end</code>.
</p>
  
  
```js
app.get('/test', function(req, res){
  res.write('<head>
  ');
    // res.write(... css and js tags)
    res.write('');
    // fetch data and write main body of page 
    // with more res.write('...') calls
    res.end('</html>');
  });
```
  
  
<h2>
  <strong>Streams</strong>
</h2>


<p>
  Another option is to use Node Streams and <code>pipe</code> to the response. This requires a readable stream. For example, using the ever popular <a href="https://github.com/mikeal/request">Request module</a>, you can <code>pipe</code> the incoming response from an external source straight to a <code>response</code> that your app sends to the browser, like this:
</p>
  
```js
app.get('/test', function(req, res){
  req.pipe(request('http://mysite.com/doodle.png')).pipe(resp);
});
```  
  
<h2>
  <strong>Beyond Express</strong>
</h2>


<p>
  I recently wrote an <a href="http://strongloop.com/strongblog/node-js-express-introduction-koa-js-zone/">intro to Koa</a>. Unlike the <code>res.*</code> syntax of Express, Koa generally uses <code>this.body = 'HTML HERE'</code>. There’s an example in the Koa repo that shows one way to <a href="https://github.com/koajs/examples/tree/master/stream-view">stream an HTML page</a>. If you’re not ready to live on the bleeding edge of node v0.11.x, take a look at <a href="https://github.com/then/then-jade">then-jade</a>; you’ll get some of the cool syntax of ES6 generators and the benefits of streaming chunks of HTML, all with the cozy v0.10.x environment and the <a href="http://strongloop.com/strongblog/using-node-js-for-static-sites-jade/">awesomeness of Jade</a>.
</p>


<h2>
  <strong>No chunks please</strong>
</h2>


<p>
  In modern browsers, the <a href="https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest">XHR object&#8217;s</a> <code>readyState</code> can have a value of <code>'LOADING'</code> (3). That allows them to handle the chunked encoding that we&#8217;re sending. However, if you&#8217;re still stuck supporting IE8 (or lower) you can use a clever addition of socket.io, nicely packaged up as <a href="https://www.npmjs.org/package/streamable">Streamable</a>. If that seems like too much of a hack, you can use Express’ content-negotiation syntax to send the response the &#8220;old fashioned&#8221; way when the request is via XHR:
</p>
  
```js
app.get('/test', function(req, res){
  if (req.xhr) {
    // fetch data, pass to template
    // response is sent in one command
    res.render(data);
  } else {
    res.write('<head>
  ');
      // res.write(... css and js tags)
      res.write('');
      // fetch data and write main body of page 
      // with more res.write('...') calls
      res.end('</html>');
  });
```
  
  
<p>
  To go the extra mile, you might try some client-side detection for support of <code>readyState === 3</code>, and pass an extra parameter in your XHR call to let the server know it can send a chunked response. But some browsers that support chunked encoding in XHR still won&#8217;t let you access the data that&#8217;s received until the request is finished, which eliminates the primary benefit.
</p>


<h2>
  <strong>Yak Shaving</strong>
</h2>


<p>
  There’s an obvious tradeoff here; we’re essentially stripping out the shortcuts and common lingo that Express gives us and reverting back to core Node response syntax and/or using obscure libraries. If your page is really simple and quick to render, the extra syntax might not be worth it.
</p>


<h2 dir="ltr">
  <strong>What’s next?</strong>
</h2>


<ul>
  <li style="margin-left: 2em;">
    <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? We’ve made it easy to get started with <a href="http://strongloop.com/mobile-application-development/loopback/">LoopBack</a> either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
  </li>
  
  
  <li style="margin-left: 2em;">
    <span style="font-size: 18px;">What’s in the upcoming Node v0.12 release? <a href="http://strongloop.com/strongblog/performance-node-js-v-0-12-whats-new/">Big performance optimizations</a>, read <a href="https://github.com/bnoordhuis">Ben Noordhuis’</a> blog to learn more.</span>
  </li>
  
  
  <li style="margin-left: 2em;">
    <span style="font-size: large;">Need cluster management, performance monitoring and DevOps for Node.js? Check out <a href="http://strongloop.com/node-js-performance/strongops/">StrongOps</a>!</span>
  </li>
  
</ul>