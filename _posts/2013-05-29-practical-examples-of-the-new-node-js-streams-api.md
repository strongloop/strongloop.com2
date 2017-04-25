---
id: 532
title: Practical Examples of the New Node.js Streams API
date: 2013-05-29T17:23:43+00:00
author: Marc Harter
guid: http://blog.strongloop.com/?p=532
permalink: /strongblog/practical-examples-of-the-new-node-js-streams-api/
categories:
  - Community
  - How-To
---

Node brought a simplicity and beauty to streaming.  Streams are now a powerful way to build modules and applications.  Yet the original streams API had some <a href="http://blog.strongloop.com/whats-new-in-node-v0-10/">problems</a>.  So in Node v0.10, we saw the streams API change in order to fix the prior problems, extend the APIs to encapsulate more common use cases, and be simpler and easier to use.

As I tried to make the adjustment to the new APIs, I found some documentation on it but not many practical examples.  This article explores some of the <a href="http://nodejs.org/api/stream.html">Node documentation</a> that may be confusing about the new APIs.  It will also apply the new APIs in practical terms to help you get started using these APIs in your programs.  Let’s dive in!

## **The “line by line” problem**

Good log data can be an invaluable resource to a company and developer team. However, sifting through that data can be time consuming and you can only get so far with shell commands.  Wouldn’t it be helpful to programmatically get statistics or locate patterns in your logs?  For many log formats, in order to do that, we need a way to get at our data line by line.

The beauty of Node streams is we don’t have to do this all in memory (log files can be huge) and we can process data as soon its been read.  Streams also will work from any I/O source (file system, network).

Using the new stream APIs, we can create a reusable I/O component that transforms our data into individual lines for further processing.

## **The Transform stream**
Node 0.10 provides a nifty stream class called <a href="http://nodejs.org/api/stream.html#stream_class_stream_transform">Transform</a> for transforming data intended to be used when the inputs and outputs are causally related.  In our problem, the input and output are actually the same data.  However, this data is transformed into separate lines for further processing down the road (such as collecting stats or searching).

Transforms sit in the middle of a pipeline and are both readable and writeable:

<img src="https://lh5.googleusercontent.com/3df7l6Ja5OqzwNA3INt0YUdnP2emb__5yFGCB8lL4zegVnE5qf9Xy-b8mA-C-rzIfEofM2TcdtQgg8svTxNM5Bkcv1wiX91IasWXDvw1u6s_7yvDgSREd4eo" alt="" width="640px;" height="180px;" />

To set up our transformation, we need to include the stream module and instantiate a new Transform stream:

```js
var stream = require('stream')
var liner = new stream.Transform( { objectMode: true } )
```

## **Switching on objectMode**

Whoa!  What is that ``{ objectMode: true }`` I threw in there?  Well, we want the destination of our transformation to be able to handle the data line by line.  objectMode allows a consumer to get at each value that is pushed from the stream.  Without objectMode, the stream defaults to pushing out chunks of data.  As the name suggests, objectMode is not just for string values, like in our problem, but for any object in JavaScript ({ &#8220;my&#8221;: [ &#8220;json&#8221;, &#8220;record&#8221; ]}).

## **The _transform method**

So that&#8217;s cool but we aren&#8217;t done yet.  Transform classes require that we implement a single method called `_transform` and optionally implement a method called `_flush`.  Our example will implement both, but let&#8217;s cover the `_transform` method first.

The `_transform` method is called every time our source has data for us.  Let&#8217;s look at the code and then talk about it:

```js
liner._transform = function (chunk, encoding, done) {
     var data = chunk.toString()
     if (this._lastLineData) data = this._lastLineData + data

     var lines = data.split('\n')
     this._lastLineData = lines.splice(lines.length-1,1)[0]

     lines.forEach(this.push.bind(this))
     done()
}
```

As data from a source stream arrives, `_transform` will be called.  Along with it comes a chunk of available data, the type of encoding that data has been provided in and a done function that signals that you are done with this chunk and ready for another.


In our case, we don&#8217;t care about the underlying encoding.  We just want the chunk to be a string value, so we will perform a `toString()` conversion.  Once we have our chunk as a string, we can split(&#8216;n&#8217;) to get an array of individual lines. Next, we push each line separately to whatever is consuming the transformation.


Note: The <a href="http://nodejs.org/api/stream.html#stream_readable_push_chunk">push</a> method is part of the Readable stream class (which Transform inherits from).  If you are familiar with Node 0.8, push is akin to emitting data events.

```js
stream.emit(‘data’, data) ➤ stream.push(data)
```

Lastly, we signal that we are finished with the chunk by calling done().  Since done is a callback, it allows us to also perform asynchronous actions in our `_transform` if desired.


What is the `_lastLineData` stuff all about? We don’t want a chunk of data to get cut off in the middle of a line.  In order to avoid that, we splice out the last line we find so it does not push to the consumer.  When a new chunk comes in we prepend the line data to the front and continue.  This way we can safeguard against half lines being pushed out.

## **The `_flush` method**

However, we still have a problem.  When the last call to `_transform` happens, we have a `_lastLineData` value sitting around that never got pushed.  Thankfully, the Transform class also provides a `_flush` method for this scenario.  After all the source data has been read and transformed, the `_flush` method will be called if it has been implemented.  The `_flush` method is a great place to push out any lingering data and clean up any existing state. Here is how it would look like in our case:

```js
liner._flush = function (done) {
     if (this._lastLineData) this.push(this._lastLineData)
     this._lastLineData = null
     done()
}
```

We push out the `_lastLineData` provided if we have some to the consumer and then cleanup our instance variable.  Finally, we call done() to signal that we are finished flushing.  This will also signal to the consumer that the stream has ended.  Remember, the `_flush` method is optional and may be unnecessary for some Transform streams.

## **The solution**

That wraps up our little liner module.  Let's look at it in full:

```js
var stream = require('stream')
var liner = new stream.Transform( { objectMode: true } )

liner._transform = function (chunk, encoding, done) {
     var data = chunk.toString()
     if (this._lastLineData) data = this._lastLineData + data

     var lines = data.split('\n')
     this._lastLineData = lines.splice(lines.length-1,1)[0]

     lines.forEach(this.push.bind(this))
     done()
}

liner._flush = function (done) {
     if (this._lastLineData) this.push(this._lastLineData)
     this._lastLineData = null
     done()
}

module.exports = liner
```

## **Testing our solution**

Groovy.  So how do we test this?

First, you need a data source.  Any file that uses lines to delineate records will do. The most universal file I can think of is an access log from Apache.  To pull this file data, we&#8217;ll use a Readable stream:

```js
var fs = require('fs')
var liner = require('./liner')
var source = fs.createReadStream('./access_log')
source.pipe(liner)
liner.on('readable', function () {
     var line
     while (null !== (line = liner.read())) {
          // do something with line
     }
})
```
  As data becomes readable from the transformation, we can access each line individually through objectMode.

## **Wrapping Up**

We are only scratching the surface when it comes to all that you can do with streams.  However, I hope you can take this little example further and come up with your own stuff.  If you’ve dismissed streams before in Node, take another look!  I think you’ll find the new stream API powerful and simple to use.

## **Appendix A: Backwards Compatibility**

Since the stream module was added in Node 0.10, running our liner example in

previous versions of Node will produce an error much like the following:

```js
var liner = new stream.Transform( { objectMode: true } )
TypeError: undefined is not a function
```

To get around this we can use the readable-stream module (npm install readable-stream). Despite its name, readable-stream has grown from a preview version of the new Stream classes before 0.10 into a drop-in shim for Node 0.8. Now, the top of our example should look a little more like this:

```js
var stream = require('stream')
// For Node 0.8 users
if (!stream.Transform) {
  stream = require('readable-stream')
}
```

## **[What’s next?](http://strongloop.com/get-started/)**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js <a href="http://strongloop.com/node-js/loopback/">LoopBack framework</a>. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
</li>
