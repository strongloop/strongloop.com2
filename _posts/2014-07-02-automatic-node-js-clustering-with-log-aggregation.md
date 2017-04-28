---
id: 17417
title: Automatic Node.js Clustering with Log Aggregation
date: 2014-07-02T08:29:51+00:00
author: Ryan Graham
guid: http://strongloop.com/?p=17417
permalink: /strongblog/automatic-node-js-clustering-with-log-aggregation/
categories:
  - Community
  - How-To
  - Product
  - Resources
---
As if [`slc run --cluster cpu`](http://docs.strongloop.com/display/SLC/slc+run) wasn’t awesome enough for automagically scaling your app in a multi-process cluster, it now aggregates your worker logs for you when clustering!

In this post I’ll talk about the new logging features in [strong-supervisor](https://www.npmjs.org/package/strong-supervisor) v0.2.3 (the module behind [`slc run`](http://docs.strongloop.com/display/SLC/slc+run)). `slc run` is the runtime management utility StrongLoop provides on top of the Node executable.

I’ll start by explaining why it works the way it does and then walk through a short example starting from simple dev-time logging through to mature production logging to a remote log aggregator, all without modifying the original code or using any log frameworks. To get started just run `slc update` to get the latest version.

<!--more-->

## **How should logging be done?**

As someone with a few strong opinions on logging, I took the first pass on improving how we do it. I did so based on some core philosophies around how logging should be done, which are heavily inspired by the [12 Factor App](http://12factor.net/) school of thought.

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Logs are line-oriented <a href="http://adam.herokuapp.com/past/2011/4/1/logs_are_streams_not_files/">event streams</a></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><span style="font-size: 18px;">Log processing is orthogonal to your application logic <em>&#8211; filter your logs at destination (eg. grep), not source (eg. log levels)</em></span></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><span style="font-size: 18px;">The application should give application level context only <em>&#8211; host level details can be added later without application overhead.</em><br /> </span></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><span style="font-size: 18px;">Log storage is orthogonal to your application logic <em>&#8211; log rotation is not an application responsibility & log delivery to remote services is not an application responsibility.</em></span></span>
</li>

Since log storage and transmission are off the table, there’s only one place the application can send these log events to: [`process.stdout`](http://nodejs.org/api/process.html#process_process_stdout).

Based on these tenets, the list of functionality required of a logging framework is pretty short:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Write to stdout</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Writes log events as a single line</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Includes details that are only known inside the application</span>
</li>

That’s a really short list. What is more important is the list of common logger and log framework features that aren’t on that list, and in my not so humble opinion, should not be done in-process:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Timestamps</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Process ID tagging</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Hostname tagging</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">multiple/configurable log transports</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Log file rotation</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Email notifications</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Runtime tunable log levels</span>
</li>

These can all be done outside of your application! If you care about performance (and you do, otherwise you wouldn’t be using clustering), why would you want to add overhead to every single \`logger.info()\` call? With such overhead, you may be inclined to log less for fear of slowing down your app!

So what log framework does what we need without all that bloat? The one that is built into Node: [console.log](http://nodejs.org/api/console.html).

Right about now you’re probably thinking either I’m trolling you or I have absolutely no idea what I’m talking about. Here are some likely objections:

_&#8220;I want to be able to turn up the logging level when something is going wrong, or turn it down for low overhead.&#8221;_

If your logger isn’t doing anything unusual, then the overhead should be minimal, even if logging lots of messages. Assuming production logging here, not development logging to trace every code path.

_&#8220;The disk gets filled up and I need something that rotates logs.&#8221;_

Log rotation is the responsibility of the system that writes the logs. Pass that job on to a more appropriate layer.

_&#8220;How do I perform all those functions listed above without a logging framework like Winston?&#8221;_

Transfer the functionality to an out-of-process tool, which doesn&#8217;t interfere with your app’s event loop.

_&#8220;I need log rotation, but something like logrotate, doesn’t work on Mac or Windows.&#8221;_

In development you almost certainly want to log to stdout. If running your application in production on Mac or Windows, you can use the technique outlined below.

_&#8220;I’m not a sysadmin, I don’t know /want-to-know how to configure logrotate, I’d like to just use javascript stuff I feel comfortable with.&#8221;_

If you aren’t a sysadmin then don&#8217;t play it by configuring all that logger behavior in your app. Write your code for development and let your tools take care of making that style of logging work in production.

Now, let&#8217;s see what actually happens&#8230;

## **Log Levels**

&nbsp;

[<img class="alignnone size-medium wp-image-17435" src="{{site.url}}/blog-assets/2014/07/infowarnerror-300x96.png" alt="infowarnerror" width="300" height="96"  />]({{site.url}}/blog-assets/2014/07/infowarnerror.png)

Now, let’s see how this all actually happens&#8230;

First, I want to consistently tag events with some sort of log level/type so that I can easily filter logs when viewing them (not to control what gets logged!). For this I typically write a little code. I’ve also published this little micro-module as [strong-logger](https://www.npmjs.org/package/strong-logger) if you are interested:

```js
// logger.js
var util = require('util');
var levels = [
  'DEBUG', 'INFO', 'WARN', 'ERROR'
];
levels.forEach(function(level) {
  module.exports[level.toLowerCase()] = function() {
    console.log('%s %s', level, util.format.apply(util, arguments));
  };
});
```

All I’ve done is create four logging functions named after log levels that simply prefix my message with the log level in ALL CAPS. Otherwise it is a straight pass through to console.log.

In my application code it looks like this:

```js
// index.js
var logger = require('./logger');
logger.debug('ARGV: %j', process.argv);
logger.info('application started');
logger.warn('about to do something horrible!');
logger.error(new Error('Something horrible!'));
```

When I run this code I get messages on my console that look like this:

```js
DEBUG ARGV: ["node","/Users/ryan/work/strong-supervisor/test/logger-app"]
INFO application started
WARN about to do something horrible!
ERROR [Error: Something horrible!]
```

Pretty straight forward so far, but these log messages would be pretty useless if I saw them in my production server’s log files. I could enhance them, but then I’d have to deal with ugly logs during development. If I don’t want overly verbose log messages in development I’d have to add logic to my logger code to make it run differently in DEV than in PROD. Instead, I like to let my tools take care of that for me. When I run my little app with `sl-run with --cluster 1`, it comes out looking something like this (supervisor events omitted for brevity):

<div dir="ltr">
  ```js
2014-06-20T15:26:37.907Z pid:89028 worker:1 DEBUG ARGV: ["/usr/local/bin/node","."]
2014-06-20T15:26:37.908Z pid:89028 worker:1 INFO application started
2014-06-20T15:26:37.908Z pid:89028 worker:1 WARN about to do something horrible!
2014-06-20T15:26:37.908Z pid:89028 worker:1 ERROR [Error: Something horrible!]
```js
  
  <p>
    Those look more like what I’d expect to find in a production log. They’ve got my log messages, the process and worker IDs of the source, and sub-second timestamps. The best part is the timestamping and tagging were done in a way that doesn’t block my app’s event loop.
  </p>
  
  <h2>
    <strong>Log Persistence</strong>
  </h2>
  
  <p>
    <img class="alignnone size-medium wp-image-17443" src="{{site.url}}/blog-assets/2014/07/log_storage2-300x300.jpg" alt="log_storage2" width="300" height="300"  /><br /> Now where to put these log messages? Since log persistence is the responsibility of the runtime and not the application, it sounds like a job for a process supervisor (the process that spawns the application on boot up and keeps it running). If you’re using a modern init replacement (Upstart, systemd, launchctl, smf, etc.) then you should let that system take care of log persistence by configuring it to write your process’s stdout to file and handle log rotation for you and call it a day.
  </p>
  
  <p>
    If you’re using a simple shell script based init, or startup method that doesn’t handle log persistence for you, you’ll want to use the <code>--log</code> option to specify your log file.
  </p>
  
  <p>
    Previously, the <code>--log</code> option let you specify the name of a file to write to when running <a href="http://docs.strongloop.com/display/SL/slc+run">&#8216;slc run&#8217;</a> in detached mode. It now supports per-process log files by way of <code>%p </code>and <code>%w</code> for simple process ID and worker ID substitutions. That means you can use:
  </p>
  
  <p>
    <code>sl-run --log my-app.%w.log </code>
  </p>
  
  <p>
    and each process will be logged to a separate file:
  </p>
  
  <p>
    <code>my-app.supervisor.log</code>, <code>my-app.1.log</code>, <code>my-app.2.log</code>, and so on.
  </p>
  
  <p>
    It would be really handy to have access to these substitutions when piping to a command, like:
  </p>
  
  <p>
    <code>sl-run . | some-cmd --wish-I-had-a-pid-here </code>
  </p>
  
  <p>
    so I took some <a href="http://perldoc.perl.org/perlipc.html#Using-open()-for-IPC">inspiration from Perl</a> and added support for a <code>|</code> prefix directly in the CLI option to allow a commands to be specified instead of just filenames. When this mode is used, another process is spawned (shared or per-worker, depending on whether substitutions are used) and the log output is piped into that process’s stdin.
  </p>
  
  <p>
    You could use this mode to pipe worker logs through <a href="http://man7.org/linux/man-pages/man1/logger.1.html">logger(1)</a> and into syslog:
  </p>
  
  <p>
    <code>sl-run --cluster 1 --log ‘| logger -t myApp[%p]:%w'</code>
  </p>
  
  <p>
    Syslog is a pretty obvious destination so there’s a &#8211;syslog option that can be used in place of <code>--log</code> that logs directly to syslog without relying on the logger command.
  </p>
  
  <p>
    You can also toggle timestamping if you choose to handle it in-app or in your transporter with the <code>--no-timestamp-supervisor</code> and <code>--no-timestamp-workers</code> options. Check out the <a href="http://docs.strongloop.com/display/SOPS/Application+logging">application logging docs</a> for the full details on these and other options.
  </p>
  
  <h2>
    <strong>Log Rotation</strong>
  </h2>
  
  <p>
    Ok, so we’ve got the logs on disk using one of the methods above. What about that pesky problem of the disk filling up? The <a href="https://www.npmjs.org/package/strong-supervisor">supervisor behind “slc run”</a> doesn’t do log rotation itself, but it is a good citizen and will re-open it’s log files when it receives SIGUSR2 so you can use logrotate. If we run our app with something like:
  </p>
  
  <p>
    <code>sl-run --log /var/log/my-app.log --pid /var/run/my-app.pid</code>
  </p>
  
  <p>
    we can use a logrotate config file that looks something like this:
  </p>
  
  ```js
# logrotate.conf
/var/log/my-app.log {
  daily
  compress
  postrotate
    kill -SIGUSR2 `cat /var/run/my-app.pid` > /dev/null
  endscript
}
```js
  
  <h2>
    <strong>Log Filtering</strong>
  </h2>
  
  <p>
    Now our logs are persisted to disk and no longer going to fill up all available space. Storing logs on disk gives us a lot of options for processing and further aggregating. There are on-prem solutions like <a href="http://logstash.net/">logstash</a>, <a href="http://www.fluentd.org/">fluentd</a>, <a href="http://graylog2.org/">graylog2</a>, and many others including good old fashioned tail & grep. If you’re looking for something hosted, there are lots of great options available including <a href="http://www.splunk.com/">Splunk</a>, <a href="https://www.loggly.com/">Loggly</a>, <a href="https://papertrailapp.com/">Papertrail</a>, and more. All of these have excellent support for log files.
  </p>
  
  <p>
    I’ll continue my example from earlier and use logstash to send my log messages to ElasticSearch for indexing and viewing with Kibana. Here’s a working logstash config file:
  </p>
  
  ```js
# logstash.conf
input {
  file {
    path => ["/var/log/my-app.log"]
  }
}
filter {
  grok {
    match => [
      # Timestamped
      "message", "%{TIMESTAMP_ISO8601:extracted_timestamp} pid:%{INT:pid} worker:%{WORD:worker} %{LOGLEVEL:level} %{GREEDYDATA:message}",
      # Timestamped but no log level
      "message", "%{TIMESTAMP_ISO8601:extracted_timestamp} pid:%{INT:pid} worker:%{WORD:worker} %{GREEDYDATA:message}",
      # Fallback match lines without timestamps if they’re turned off
      "message", "pid:%{INT:pid} worker:%{WORD:worker} %{LOGLEVEL:level} %{GREEDYDATA:message}",
      "message", "pid:%{INT:pid} worker:%{WORD:worker} %{GREEDYDATA:message}"
    ]
    overwrite => [ "message" ]
  }
  date {
    # If a timestamp was extracted, use it for the event's timestamp
    match => [ "extracted_timestamp", "ISO8601" ]
    remove_field => [ "extracted_timestamp" ]
  }
  if ! [level] {
    mutate { add_field => { level => "INFO" } }
  }
  mutate { add_tag => [ "%{level}" ] }
}
output {
  elasticsearch {
    host => "localhost"
    protocol => "http"
  }
}
```js
  
  <p>
    When I run that in one terminal and run my app in another terminal, telling strong-supervisor to log to <code>/var/log/my-app.log</code>, the events are picked up by logstash and sent to ElasticSearch where they show up looking like this:
  </p>
  
  ```js
{"message":"ARGV: ["/usr/local/bin/node","."]","@version":"1","<a class='bp-suggestions-mention' href='https://strongloop.com/members/timestamp/' rel='nofollow'>@timestamp</a>":"2014-06-20T16:13:29.117Z","host":"Ryans-StrongMac.local","path":"/var/log/strong-supervisor/logger-app.log","pid":"89371","worker":"1","level":"DEBUG","tags":["DEBUG"]}
{"message":"application started","@version":"1","<a class='bp-suggestions-mention' href='https://strongloop.com/members/timestamp/' rel='nofollow'>@timestamp</a>":"2014-06-20T16:13:29.118Z","host":"Ryans-StrongMac.local","path":"/var/log/strong-supervisor/logger-app.log","pid":"89371","worker":"1","level":"INFO","tags":["INFO"]}
{"message":"about to do something horrible!","@version":"1","<a class='bp-suggestions-mention' href='https://strongloop.com/members/timestamp/' rel='nofollow'>@timestamp</a>":"2014-06-20T16:13:29.118Z","host":"Ryans-StrongMac.local","path":"/var/log/strong-supervisor/logger-app.log","pid":"89371","worker":"1","level":"WARN","tags":["WARN"]}
{"message":"[Error: Something horrible!]","@version":"1","<a class='bp-suggestions-mention' href='https://strongloop.com/members/timestamp/' rel='nofollow'>@timestamp</a>":"2014-06-20T16:13:29.118Z","host":"Ryans-StrongMac.local","path":"/var/log/strong-supervisor/logger-app.log","pid":"89371","worker":"1","level":"ERROR","tags":["ERROR"]}
```js
  
  <h2>
    <strong>Recap</strong>
  </h2>
  
  <ul>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">Our app uses a simple wrapper around console.log to add levels</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">We kept our log messages to single lines</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">We don’t have dynamic log levels, but we can filter our logs by log level</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">We don’t log app runtime context, but we still have PID and timestamps in our logs</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">Our app doesn’t worry about log files, but we still log to files</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">Our app doesn’t worry about log rotation, but we still have log rotation</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">Our app doesn’t worry about remote logging, but we still logged to a remote log service</span>
    </li>
  </ul>
  
  <p>
    What do you think? Leave a <a href="https://news.ycombinator.com/item?id=7978125">comment</a> and let me know. All of the source code and example output in this blog post can be found in this <a href="https://gist.github.com/rmg/f9163cf6b7a6fe21a079">Log Aggregation gist</a> and the <a href="https://www.npmjs.org/package/strong-logger">strong-logger npm module</a>.
  </p>
  
  <h2>
    <strong><a href="http://strongloop.com/node-js-performance/strongops/">Use StrongOps to Monitor Node Apps</a></strong>
  </h2>
  
  <p>
    Ready to start monitoring event loops, manage Node clusters and chase down memory leaks? We’ve made it easy to get started with <a href="http://strongloop.com/node-js-performance/strongops/">StrongOps</a> either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.
  </p>
  
  <p>
    <img src="http://strongloop.com/wp-content/uploads/2014/02/1746x674xScreen-Shot-2014-02-03-at-3.25.40-AM.png.pagespeed.ic.z6EZzoEvwk.png" alt="Screen Shot 2014-02-03 at 3.25.40 AM" width="1746" height="674" />
  </p>
  
  <h2>
    <strong><a href="http://strongloop.com/get-started/">What’s next?</a></strong>
  </h2>
  
  <ul>
    <li>
      What’s in the upcoming Node v0.12 release? <a href="http://strongloop.com/strongblog/performance-node-js-v-0-12-whats-new/">Big performance optimizations</a>, read <a href="https://github.com/bnoordhuis">Ben Noordhuis’</a> blog to learn more.
    </li>
    <li>
      Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js <a href="http://strongloop.com/mobile-application-development/loopback/">LoopBack framework</a>. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.
    </li>
    <li>
      Need <a href="http://strongloop.com/node-js-support/expertise/">training and certification</a> for Node? Learn more about both the private and open options StrongLoop offers.
    </li>
  </ul>
</div>