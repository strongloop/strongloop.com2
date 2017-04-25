---
id: 433
title: Strategies for Optimizing Mobile Bandwidth
date: 2013-05-09T00:58:44+00:00
author: Jed Wood
guid: http://blog.strongloop.com/?p=433
permalink: /strongblog/strategies-for-optimizing-mobile-bandwidth/
categories:
  - Mobile
---
<p style="padding-left: 30px;">
  <em>Exploring some techniques for lightening the cargo between server and mobile device</em>
</p>

## Internet like it&#8217;s 1999

June 28, 2007 was a good day to be a web developer. The promise of ubiquitous &#8220;high speed&#8221; internet was almost a reality, at least in many markets. [Charlie](http://www.youtube.com/watch?v=_OBlgSz8sSM) had just gone viral. Our attention shifted from uglifying compressed progressive jpegs to the possibilities of streaming HD video.

The next day, the first iPhone was released. That, as Apple simply put it, changed everything.

Today, 4G LTE can provide some impressive speeds. But if you&#8217;re like me, and every smartphone owner I know, and every commenter on the Internet, full-bar 4G heaven is not a permanent residence.

So you went with a native iOS app to get the most performance, and now a spotty 3G connection is your bottleneck. How can you speed things up a bit and make your app feel faster? Let&#8217;s look at some techniques for those low-bandwidth situations where every KB matters. These fall within three strategies: _make fewer network calls, make them smaller, and delay them_.

## <a href="https://github.com/jedwood/optimize-mobile-bandwidth/blob/master/README.md#benchmark-and-measure" name="benchmark-and-measure"></a>Benchmark and measure

Before we start, let&#8217;s make sure we can track our progress. When I really need to dissect HTTP I turn to [Charles](http://www.charlesproxy.com/). In addition to file sizes and duration, Charles shows you all the fine details of incoming and outgoing calls. You can save sessions, make tweaks to headers or variables, and replay them. It lets you map DNS and flush caches. It also has bandwidth throttling to help us simulate mobile network speeds.

<a href="https://github.com/jedwood/optimize-mobile-bandwidth/blob/master/img/charles-throttle.png" target="_blank"><img src="https://github.com/jedwood/optimize-mobile-bandwidth/raw/master/img/charles-throttle.png" alt="Charles bandwidth settings at 512 kbps" /></a>

We can also get much of this information from the built-in browser console. Here&#8217;s what it looks like in Chrome. Select the &#8220;Network&#8221; tab and refresh the page.

<a href="https://github.com/jedwood/optimize-mobile-bandwidth/blob/master/img/network-inspector.png" target="_blank"><img src="https://github.com/jedwood/optimize-mobile-bandwidth/raw/master/img/network-inspector.png" alt="Chrome Web Inspector showing network chart" /></a>

The &#8220;Size / Content&#8221; column will often show different values, sometimes drastically. The `size` value represents how many bytes were sent over the network for that request, whereas the `content` value is the actual size of the asset or chunk of HTML. Cookies and other headers can increase the `size` relative to the `content.` Compression can make the `content` appear much larger, because the value shown is after the content is decompressed. You might also see a value of &#8220;(from cache).&#8221; To reload the page with a cleared cache in Chrome, hit `Command+Shift+R` on a Mac, `Shift+F5` on Windows.

Rolling your mouse over the colored blobs in the `timeline` chart section will give you a breakdown of how much time was spent waiting for the content to start transfer, and how much time it took for it to transfer over the network once it started. Along the bottom you can filter out these results by resource type.

Finally, it can sometimes be helpful to trick a server into thinking you&#8217;re on a mobile browser, since they are sometimes configured to send different data and assets. Set the &#8220;User Agent Override&#8221;, which you can access by clicking the little cog icon on the bottom-right of the web inspector.

<a href="https://github.com/jedwood/optimize-mobile-bandwidth/blob/master/img/fake-user-agent.png" target="_blank"><img src="https://github.com/jedwood/optimize-mobile-bandwidth/raw/master/img/fake-user-agent.png" alt="Browser web inspector settings to fake iPhone" /></a>

Once you get some good benchmarks of your existing calls, it&#8217;s time to start optimizing!

### <a href="https://github.com/jedwood/optimize-mobile-bandwidth/blob/master/README.md#fly-by-of-the-basics" name="fly-by-of-the-basics"></a>Fly-by of the Basics

Google provides an [extensive guide](https://developers.google.com/speed/) on making the web faster. Combining minified JS and CSS files is common practice, as are carefully configured cache settings and the use of CDNs. You&#8217;ll save a lot of overhead using those techniques, so start there.

### <a href="https://github.com/jedwood/optimize-mobile-bandwidth/blob/master/README.md#compression" name="compression"></a>Compression

There are several issues to consider when compressing content, such as the time required to compress and uncompress. As with most things on the web, there is no &#8220;always right&#8221; answer. Since optimizing for bandwidth is our focus here, the answer is:_compress_.

A call to Twitter&#8217;s basic search API [sends back 15 tweets](https://search.twitter.com/search.json?q=javascript). Inspecting the details shows that the content is compressed by ~74%, using gzip. That can make a significant difference when you&#8217;re sending more data than is found in 15 little tweets.

Let&#8217;s route that call through a simple Node.js proxy using [request](https://github.com/mikeal/request):

    app.get('/', function(req, res) {
      request('http://search.twitter.com/search.json?q=javascript', function (error, response, body) {
        res.send(body);
      });
    });
    

Now the tweets come though uncompressed. Many of the npm packages and articles you&#8217;ll find about gzip in Node.js were written before [Zlib was added to the core](http://nodejs.org/api/zlib.html). Assuming you&#8217;re using a relatively recent version of Node and [Express](http://expressjs.com/), just put this at the top of your middleware declarations:

    app.use(express.compress());
    

Or you can be more selective and use it on a per route basis:

    app.get('/', express.compress(), function(req, res) { ...
    

That gets us back down under 3KB for the response body.

But what about the other direction? Compressing on the client before sending to the server is less common, but if you&#8217;re sending chunks of text you should definitely consider it. iPhone developers can use built-in libraries. Check out [TinyLine](http://www.tinyline.com/utils/index.html) if you&#8217;re building for Android. To handle the incoming response on your Node.js server you can use a [decompress module](https://npmjs.org/package/express-decompress). There are also several [Javascript-only libraries for compression](https://github.com/cscott/compressjs) that will work in both a mobile browser and in Node.js.

### <a href="https://github.com/jedwood/optimize-mobile-bandwidth/blob/master/README.md#partial-responses" name="partial-responses"></a>Partial Responses

Many APIs will include fields in the results like &#8220;details&#8221; which contain information you don&#8217;t need, at least not right away. The &#8220;partial response&#8221; was pioneered by Google and is now supported in many popular APIs. This allows you to specify only the fields you really want included, usually with a syntax like:

    ?fields=id,name
    

What if the API doesn&#8217;t support partial responses? That seems to be the case for the [The Rotten Tomatoes API](http://developer.rottentomatoes.com/iodocs), which is popular and well-documented. Each movie listing in the response includes a lenghty synopsis, cast details, related links, and a summary of reviews. Let&#8217;s pretend that our mobile app just wants a couple basic fields to display a list. One option is to strip out unwanted fields via a Node.js proxy. Another is to use the undervalued [YQL](http://developer.yahoo.com/yql/). We can write this kind of query:

    select title, posters.thumbnail, links.self 
    from rottentomatoes.search 
    where title='tron' and apikey='YOURKEYHERE'
    

And YQL will generate a custom endpoint. When we call that, YQL proxies the call and strips out all the properties we don&#8217;t need.

### <a href="https://github.com/jedwood/optimize-mobile-bandwidth/blob/master/README.md#aggregation" name="aggregation"></a>Aggregation

Partial responses are helpful when an API sends you too much data, but sometimes you have the opposite problem. Your app might need to make multiple API calls at once, such as for a dashboard with several different sections of data. For an API I recently wrote in Node.js, it made sense for the API to have individual `points` and `credit` methods, but we reduced the overhead of multiple calls by providing an additional `summary` aggregate call to send them both at once. Internally it looked something like this:

    var retObj = {points: null, credit: null};
    var done = function() {
        if (retObj.points !== null && retObj.credit !== null) res.send(retObj);
    };
    
    points(userId, function(err, p) {
        retObj.points = p;
        done();
    });
    
    credit(userId, function(err, c) {
        retObj.credit = c;
        done();
    });
    

That&#8217;s a pretty ugly but effective DIY way to make parallel calls. You could also use one of the (controversial) control-flow libraries like [IcedCoffeeScript](http://maxtaco.github.io/coffee-script/) or [Streamline](https://github.com/Sage/streamlinejs) if things get too messy. The [hapi framework](http://walmartlabs.github.io/hapi/) has a built-in way of elegantly aggregating methods that you can define by the parameters you send within a single call. YQL also has a `multi query` option, as well as some handy[sub-select features](http://developer.yahoo.com/yql/guide/joins.html).

### <a href="https://github.com/jedwood/optimize-mobile-bandwidth/blob/master/README.md#images" name="images"></a>Images

Most developers are already mindful of image size, and take advantage of [CSS sprites](https://github.com/richardbutler/node-spritesheet) where appropriate. For squeezing the most out of your image files, try [ImageOptim](http://imageoptim.com/) if you&#8217;re on a Mac, [PNGGauntlet](http://pnggauntlet.com/) for Windows, or [Smush.it](http://www.smushit.com/ysmush.it/) if you want a web-based services.

Not as many developers use [dataURIs](https://en.wikipedia.org/wiki/Data_URI_scheme). These base64 encoded versions of your images will be slightly larger than the files, but that extra size can mostly be gzipped away and you save the overhead of extra HTTP requests because the data for the image is included in the HTML or CSS. As a rule of thumb, if you&#8217;ve got several small images that aren&#8217;t stuffed into a sprite you might consider converting them to dataURIs. Here&#8217;s how you do that in Node.js:

    var base64_data = fs.readFileSync('sample.png').toString('base64');
    

Stuff that result into your HTML or CSS, which will end up something like:

    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==" alt="Red dot" />
    

### <a href="https://github.com/jedwood/optimize-mobile-bandwidth/blob/master/README.md#sneaky-background-calls" name="sneaky-background-calls"></a>Sneaky Background Calls

Some techniques require as much UX thinking as they do technical prowess. For example, if a user creates a new item in your app, you can display a confirmation immediately, and then process the server call in the background. If the call fails due to a poor or missing network connection, you can back up and allow the user to try again, or be even smarter by saving the data locally and pushing it up to the server when the device is back online. Instagram famously [took a brilliant approach](http://www.cultofmac.com/164285/the-clever-trick-instagram-uses-to-upload-photos-so-quickly/) by starting the upload of the photo long before the user clicks &#8220;done.&#8221; Take a look at all the calls your app needs to make, and work with your design team to find opportunities for clever background calls.

## <a href="https://github.com/jedwood/optimize-mobile-bandwidth/blob/master/README.md#what-about-premature-optimization" name="what-about-premature-optimization"></a>What About Premature Optimization?

As developers we remind ourselves and each other to avoid premature optimization. It&#8217;s a good principle, but many of the techniques listed here can and should be implemented early in your development process. Tools like [Grunt](http://gruntjs.com/) make it easy to minify and combine your files in the background as you go. Tweaking the compression settings is something you won&#8217;t need to do often, but it will pay off across your app for as long as it&#8217;s running. Giving some thought beforehand to aggregation and partial responses will result in snappier performance without writing much, if any, extra code.

If early beta versions of your app feel speedy, your users can focus their feedback on features rather than performance.