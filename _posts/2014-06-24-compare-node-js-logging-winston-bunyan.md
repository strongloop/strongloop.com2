---
id: 16596
title: Comparing Winston and Bunyan Node.js Logging
date: 2014-06-24T08:10:18+00:00
author: Alex Gorbatchev
guid: http://strongloop.com/?p=16596
permalink: /strongblog/compare-node-js-logging-winston-bunyan/
categories:
  - Community
  - How-To
  - Resources
---

<img class="alignnone size-full wp-image-16597" alt="" src="{{site.url}}/blog-assets//2014/05/arnold.jpg" width="50%"  />

Lets talk about logging, shall we? Arnold over here carrying a giant log feels like an appropriate intro to this article in which we are going to talk about popular Node.js logging frameworks.

If you are writing any kind of long living application, detailed logging is paramount to spotting problems and debugging. Without logs you would have few ways of telling how is your application behaving, are there errors, what&#8217;s the performance like, is it doing anything at all or is it just falling over every other request when you aren&#8217;t looking at it.

<!--more-->

## Requirements

Lets identify a few requirements which we can use to pit the frameworks against each other. Some of these requirements are pretty trivial, others are not so much.

  1. Time stamp each log line. This one is pretty self explanatory &#8211; you should be able to tell when each log entry occured.
  2. Logging format should be easily digestible by humans as well as machines.
  3. Allows for multiple configurable destination streams. For example, you might be writing trace logs to one file but when an error is encountered, write to the same file, then into error file and send an email at the same time.

Based on these requirements (and popularity) there are two logging frameworks for Node.js worth checking out, in particular:

  * [Bunyan](https://github.com/trentm/node-bunyan) by [Trent Mick](https://github.com/trentm).
  * [Winston](https://github.com/flatiron/winston) is part of the [Flatiron](http://flatironjs.org/) framework and sponsored by [nodejitstu](http://nodejitsu.com).

## console

Before we get to [Bunyan](https://github.com/trentm/node-bunyan) and [Winston](https://github.com/flatiron/winston), lets look at our old friend `console`. The most rudimentary type of logging you could do is using `console.log` and `console.error` methods. This is better than nothing but hardly the best solution. Console writes to STDOUT and STDERR respectively. There&#8217;s a very interesting [caveat](http://nodejs.org/api/stdio.html) to know when it comes to `console` methods in Node.js.

> The console functions are synchronous when the destination is a terminal or a file (to avoid lost messages in case of premature exit) and asynchronous when it&#8217;s a pipe (to avoid blocking for long periods of time).
>
> That is, in the following example, stdout is non-blocking while stderr is blocking:
>
>     $ node script.js 2> error.log | tee info.log

This is basically a &#8220;roll your own&#8221; logging approach. It is fully manual, you have to come up with your own format and basically manage everything yourself. This is time consuming, prone to errors and you probably want to focus on your application features instead. Considering that there are open source logging libraries out there which are actively maintained, this is not worth the effort if you are trying to focus on delivering features.

## Winston

<img class="alignnone size-full wp-image-16598" alt="lenny-henry" src="{{site.url}}/blog-assets//2014/05/lenny-henry.jpg" width="640" height="360" />

One of the most popular Node.js logging frameworks is [Winston](https://github.com/flatiron/winston). It&#8217;s designed to be a simple and universal logging library with support for multiple transports (a transport in [Winston](https://github.com/flatiron/winston)&#8216;s world is essentially a storage device, eg where your logs end up being stored). Each instance of a [Winston](https://github.com/flatiron/winston) logger can have multiple transports configured at different logging levels.

### **Installation**

    npm install winston

### **Usage**

The most basic [Winston](https://github.com/flatiron/winston) usage consists of calling the default instance that is exported from the `winston` module.

    var winston = require('winston');

    winston.log('info', 'Hello distributed log files!');
    winston.info('Hello again distributed logs');

The above is the same as:

    var winston = require('winston');
    var logger = new winston.Logger();

    logger.log('info', 'Hello distributed log files!');
    logger.info('Hello again distributed logs');

Both examples will produce the following output:

    info: Hello distributed log files!
    info: Hello again distributed logs

## Formatting

Personally I&#8217;m a little bit puzzled by the lack of details in the default formatter. There&#8217;s no time stamp, machine name or process ID and the output format is mildly suitable for machine parsing. Having said that you can get all the information out yourself with just a little of extra work.

    winston.info('Hello world!', {timestamp: Date.now(), pid: process.pid});

Produces the following output, which is more informative, but still not very much suitable for machine parsing.

    info: Hello world! timestamp=1402286804314, pid=80481

Finally, the `log` method provides the same string interpolation methods as `util.format`, for example:

    winston.log('info', 'test message %d', 123);

### Transporters

[Winston](https://github.com/flatiron/winston) could be configured via constructor options or exposed method which are very thoroughly documented on the [GitHub page](https://github.com/flatiron/winston). Most of the configuration typically revolves around various transports. Out of the box [Winston](https://github.com/flatiron/winston) comes with console and file based transports and if you have a look on [npmjs.org](https://www.npmjs.org/search?q=winston) you will see that there are community modules for pretty much everything imaginable ranging from MongoDB to commercial third party platforms.

One of the more notable transporters in my opinion is [winston-irc](https://github.com/nathan7/winston-irc) by [Nathan Zadoks](https://github.com/nathan7) which you can use to log errors to your team&#8217;s IRC channel. I can see this coming in very handy.

    winston.add(require('winston-irc'), {
      host: 'irc.somewhere.net',
      nick: 'logger',
      pass: 'hunter2',
      channels: {
        '#logs': true,
        'sysadmin': ['warn', 'error']
      }
    });

### Multiple Loggers

Once your application starts to grow, chances are you will want to have multiple loggers with different configurations where each logger is responsible for a different feature area (or category). [Winston](https://github.com/flatiron/winston) supports that in two ways: through `winston.loggers` and instances of `winston.Container`. In fact, `winston.loggers` is just a predefined instance of `winston.Container`:

    winston.loggers.add('category1', {console: { ... }, file: { ... }});
    winston.loggers.add('category2', {irc: { ... }, file: { ... }});

Now that your loggers are configured you can require [Winston](https://github.com/flatiron/winston) in any file in your application and access these pre-configured loggers:

    var category1 = winston.loggers.get('category1');
    category1.info('logging from your IoC container-based logger');

### More

This is most basic [Winston](https://github.com/flatiron/winston) usage, but there are quite a few other features, most notably:

  * [Profiling](https://github.com/flatiron/winston#profiling)
  * [String interpolation](https://github.com/flatiron/winston#string-interpolation)
  * [Querying](https://github.com/flatiron/winston#querying-logs) and [streaming](https://github.com/flatiron/winston#streaming-logs)
  * [Handling exeptions](https://github.com/flatiron/winston#exceptions)

## Bunyan

<img class="alignnone size-full wp-image-16599" alt="paul_bunyan_by_brendancorris-d3are2a" src="{{site.url}}/blog-assets/2014/05/paul_bunyan_by_brendancorris-d3are2a.jpg" width="1000" height="564" />

<sub><sup><a href="http://brendancorris.deviantart.com/art/Paul-Bunyan-199472626">Illustration by Brendan Corris</a></sup></sub>

[Bunyan](https://github.com/trentm/node-bunyan) by [Trent Mick](https://github.com/trentm) is another logging framework that I think should be considered. [Bunyan](https://github.com/trentm/node-bunyan) takes a slightly different approach to logging than [Winston](https://github.com/flatiron/winston) making its mission to provide structured, machine readable logs as first class citizens. As a result, a log record from [Bunyan](https://github.com/trentm/node-bunyan) is one line of `JSON.stringify` output with some common names for the requisite and common fields for a log record.

### Installation 

    npm install bunyan

### Usage

    var bunyan = require('bunyan');
    var log = bunyan.createLogger({name: 'myapp'});
    log.info('hi');
    log.warn({lang: 'fr'}, 'au revoir');

Which will produce the following output:

    {"name":"myapp","hostname":"pwony-2","pid":12616,"level":30,"msg":"hi","time":"2014-05-26T17:58:32.835Z","v":0}
    {"name":"myapp","hostname":"pwony-2","pid":12616,"level":40,"lang":"fr","msg":"au revoir","time":"2014-05-26T17:58:32.837Z","v":0}

As you can see, out of the box [Bunyan](https://github.com/trentm/node-bunyan) is not very human friendly, however most modern logging systems understand JSON format natively, which means there&#8217;s little to do here to feed the logs elsewhere for storage and processing. By default, there&#8217;s quite a bit of meta data included with each message, such as time stamp, process ID, host name and application name.

Of course, us humans, don&#8217;t find this very digestible and to address that there&#8217;s a `bunyan` CLI tool to which takes in JSON via STDIN. Here&#8217;s the same example piped through `bunyan`:

    node example.js | bunyan

Produces the following output:

    [2014-05-26T18:03:40.820Z]  INFO: myapp/13372 on pwony-2: hi
    [2014-05-26T18:03:40.824Z]  WARN: myapp/13372 on pwony-2: au revoir (lang=fr)

The main benefit here is that you don&#8217;t need to reconfigure anything for development environment, all you have to do is pipe to `bunyan`. Checkout the [GitHub page](https://github.com/trentm/node-bunyan#cli-usage) for more documentation on the CLI tool.

### JSON

One of the key differences between [Bunyan](https://github.com/trentm/node-bunyan) and [Winston](https://github.com/flatiron/winston) is that [Bunyan](https://github.com/trentm/node-bunyan) works really well when you want to log complex contexts and objects. Lets look at this line and its output from the example above:

    log.warn({lang: 'fr'}, 'au revoir');
    {"name":"myapp","hostname":"pwony-2","pid":12616,"level":40,"lang":"fr","msg":"au revoir","time":"2014-05-26T17:58:32.837Z","v":0}

You can see that `{lang: 'fr'}` got merged with the main log object and `au revoir` became `msg`. Now picture something like this:

    log.info(user, 'registered');
    log.info({user: user}, 'registered');

Which produces:

    {"name":"myapp","hostname":"pwony-2","pid":14837,"level":30,"username":"alex","email":"...@gmail.com","msg":"registered","time":"2014-05-26T18:27:43.530Z","v":0}
    {"name":"myapp","hostname":"pwony-2","pid":14912,"level":30,"user":{"username":"alex","email":"...@gmail.com"},"msg":"registered","time":"2014-05-26T18:28:19.874Z","v":0}

Or when piped through `bunyan`:

    [2014-05-26T18:28:42.455Z]  INFO: myapp/14943 on pwony-2: registered (username=alex, email=...@gmail.com)
    [2014-05-26T18:28:42.457Z]  INFO: myapp/14943 on pwony-2: registered
        user: {
          "username": "alex",
          "email": "...@gmail.com"
        }

The beauty of this approach will become clear when you we look at child loggers.

### Child Loggers

[Bunyan](https://github.com/trentm/node-bunyan) has a concept of child loggers, which allows to specialize a logger for a sub-component of your application, i.e. to create a new logger with additional bound fields that will be included in its log records. A child logger is created with `log.child(...)`. This comes in incredibly handy if you want to have scoped loggers for different components in your system, requests, or just plain function calls. Lets look at some code.

Imagine you want to carry request ID through out all log lines for a given request so that you can tie them all together.

    var bunyan = require('bunyan');
    var log = bunyan.createLogger({name: 'myapp'});

    app.use(function(req, res, next) {
      req.log = log.child({reqId: uuid()});
      next();
    });

    app.get('/', function(req, res) {
      req.log.info({user: ...});
    });

The `req.log` logger will always keep its context passed to the `log.child()` function and merge it with all subsequent calls, so the output would look something like this:

    {"name":"myapp","hostname":"pwony-2","pid":14837,"level":30,"reqId":"XXXX-XX-XXXX","user":"...@gmail.com","time":"2014-05-26T18:27:43.530Z","v":0}

### Serializers

Two problems arise when [Bunyan](https://github.com/trentm/node-bunyan) tries to stringify entire objects:

  1. Circular references. [Winston](https://github.com/flatiron/winston) is a little bit smarter here and detects circular references when they occur (however the result output `$ref=$` isn&#8217;t very useful).
  2. Unwanted noise. It feels to me that because objects are first class in [Bunyan] it&#8217;s much easier to get into a habit of just dumping everything into the log.

To help deal with both, [Bunyan](https://github.com/trentm/node-bunyan) has a concept of [serializer](https://github.com/trentm/node-bunyan#serializers) that are basically transformation functions which let you scope down commonly passed objects to just the fields that you are interested in:

    function reqSerializer(req) {
      return {
        method: req.method,
        url: req.url,
        headers: req.headers
      }
    }

    var log = bunyan.createLogger({name: 'myapp', serializers: {req: reqSerializer}});
    log.info({req: req});

Now trying to log `req` object would just include the three fields that we are interested in.

### Streams

[Streams](https://github.com/trentm/node-bunyan#streams) in [Bunyan](https://github.com/trentm/node-bunyan) are the same thing as transporters in [Winston](https://github.com/flatiron/winston) &#8211; it&#8217;s a way to send your logs elsewhere for display and storage purposes. [Bunyan](https://github.com/trentm/node-bunyan) uses a [Writable Stream](http://nodejs.org/docs/latest/api/all.html#writable_Stream) interface with some additional attributes. A [Bunyan](https://github.com/trentm/node-bunyan) logger instance has one or more streams and are specified with the `streams` option:

    var log = bunyan.createLogger({
      name: "foo",
      streams: [
        {
          stream: process.stderr,
          level: "debug"
        },
        ...
      ]
    });

### More

Here are a few more notable things to explore in [Bunyan](https://github.com/trentm/node-bunyan):

  * [Runtime log snooping via Dtrace support](https://github.com/trentm/node-bunyan#dtrace-support)
  * [Log record fields](https://github.com/trentm/node-bunyan#log-record-fields)

## Which to choose?

[Winston](https://github.com/flatiron/winston) and [Bunyan](https://github.com/trentm/node-bunyan) are both very mature and established logging frameworks and are very much on par in terms of features. [Winston](https://github.com/flatiron/winston) has a lot of community support with various logging modules. [Bunyan](https://github.com/trentm/node-bunyan) makes it easy out of the box to parse logs but leaves consumption up the user (generally syslog drain works pretty well here). I feel it all comes down to preference and how easy it is to integrate with your stack.

## **What’s next?**

  * What’s coming to the next Node release? [Read about eight exciting new Node v0.12 features](http://strongloop.com/node-js/whats-new-in-node-js-v0-12/) and how to make the most of them, from the authors themselves.[](http://strongloop.com/strongblog/performance-node-js-v-0-12-whats-new/)
  * Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js [LoopBack API framework](http://strongloop.com/mobile-application-development/loopback/). We’ve made it easy to get started either locally or on your favorite cloud, with a [simple npm install](http://strongloop.com/get-started/).
  * Need [training and certification](http://strongloop.com/node-js-support/expertise/) for Node? Learn more about both the private and open options StrongLoop offers.
