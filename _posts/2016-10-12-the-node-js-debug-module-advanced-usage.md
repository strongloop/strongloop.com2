---
id: 28095
title: 'The Node.js Debug Module: Advanced Usage'
date: 2016-10-12T08:05:36+00:00
author: Sequoia McDowell
guid: https://strongloop.com/?p=28095
permalink: /strongblog/the-node-js-debug-module-advanced-usage/
categories:
  - How-To
  - Performance Tip
layout: redirected
redirect_to: https://developer.ibm.com/node/2016/10/12/the-node-js-debug-module-advanced-usage/
---
This blog post has been moved to IBM DeveloperWorks....  
---
In [a previous post](https://strongloop.com/strongblog/lets-code-it-the-debug-module/), I explained the [`debug`](https://www.npmjs.com/package/debug) module and how to use it for basic debugging.  I recently used it to help me understand complex interactions between events in [Leaflet](http://leafletjs.com/) and [Leaflet.Editable](https://github.com/Leaflet/Leaflet.Editable). Before going over that, however, I&#8217;m going to lay the groundwork with a couple organizational tips that makes `debug` easier to use. This post assumes you have either used [`debug`](https://www.npmjs.com/package/debug) or read the [previous post](https://strongloop.com/strongblog/lets-code-it-the-debug-module/)&#8230;.<!--more-->

## Namespacing debug functions 

The `debug` module has a great namespace feature that allows you to enable or disable debug functions in groups. It is very simple&#8211;you separate namespaces by colons, like this:

```js
debug('app:meta')('config loaded')
debug('app:database')('querying db...');
debug('app:database')('got results!', results);
```

Enable debug functions in Node by passing the process name via the `DEBUG` environment variable. The following would enable the `database` debug function but not `meta`:

```js
$ DEBUG='app:database' node app.js
```

To enable both, list both names, separated by commas:

```js
$ DEBUG='app:database,app:meta' node app.js
```

Alternately, use the asterisk wildcard character (`*`) to enable any debugger in that namespace. For example, the following enables any debug function whose name starts with &#8220;`app:"`:

```js
$ DEBUG='app:*' node app.js
```

You can get as granular as you want with debug namespaces&#8230;

```js
debug('myapp:thirdparty:identica:auth')('success!');
debug('myapp:thirdparty:twitter:auth')('success!');
```

&#8230;but don&#8217;t overdo it. Personally, I try not to go deeper than two or sometimes three levels.

### More namespace tricks 

The asterisk wildcard &#8220;`*"`matches a namespace at any level when enabling a debug function. Given the two debug functions above above, you can enable both by running your program with this command:

```js
$ DEBUG='myapp:thirdparty:*:auth' node app.js
```

The &#8220;`*"` here matches `identica`, `twitter`, or any other string.

It&#8217;s often useful to enable all debug functions in a namespace with the exception of one or two. Let&#8217;s assume there are separate debug functions for each HTTP status code the app uses (a weird use of `debug`, but why not!):

```js
const OK = debug('HTTP:200');
const MOVED = debug('HTTP:301');
const FOUND = debug('HTTP:302');
const UNAUTHORIZED = debug('HTTP:403');
const NOTFOUND = debug('HTTP:404');
// etc.
```

You can turn them all on with `HTTP:*`, but it turns out that `200` comes up way too frequently so you want to turn it off. Use the &#8220;`-`&#8221; (dash or minus sign character) prefix operator to explicitly disable a single debugger. For example, this command enables all debuggers in the &#8220;HTTP&#8221; namespace then disables just `HTTP:200`:

```js
$ DEBUG='HTTP:*,-HTTP:200' node app.js
```

## Externalizing debug functions 

`debug()` is factory function, and thus it returns another function, that you can call to write to the console (more specifically, `STDERR` in Node.js):

```js
debug('abc');        // creates function, doesn't write anything 
debug('foo')('bar'); // writes `foo: bar` (assuming that debugger is enabled)
```

To use this debugger, assign the function to a variable:

```js
var fooLogger = debug('foo');

fooLogger('bar');                    // writes `foo: bar`
fooLogger('opening pod bay door...') // writes `foo: opening pod bay door...`
```

While it&#8217;s easy to create one-off debug functions as needed as in the first example, it&#8217;s important to remember that the `debug` module does not write anything _unless that particular debugger is enabled_. If your fellow developer does not know you created a debugger with the name `foo`, she cannot know to turn it on! Furthermore, she may create a debugger with the name `foo` as well, not knowing you&#8217;re already using that name. For this reason (read: **discoverability**), I recommend grouping all such debug logging functions in one file and exporting them from there:

```js
// lib/debuggers.js
const debug = require('debug');

const init = debug('app:init');
const menu = debug('app:menu');
const db = debug('app:database');
const http = debug('app:http')

module.exports = {
  init, menu, db, http
};
```

_Note: The code above uses [ES2015 object property shorthand](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#New_notations_in_ECMAScript_2015)._

This way you can **discover all available debuggers** and **reuse debuggers across files**. For example, if you access the database in `customer.js` and want to log the query, simply import that debugger and use it there:

```js
// models/customer.js
const debugDB = require('../lib/debuggers').db;
// ...

debugDB(`looking up user by ID: ${userid}`);
db.Customer.findById(userid)
  .tap(result => debugDB('customer lookup result', result))
  .then(processCustomer)
//.then(...)

```

_Note: The code above uses the [Bluebird promises library](http://bluebirdjs.com/docs/api/tap.html)&#8216;s `tap` function._

You can then use the same debugger in another file, perhaps with other debuggers as well:

```js
// config.js
debugDB = require('../lib/debuggers').db;
debugInit = require('../lib/debuggers').init;
// ...

debugInit('configuring application...');

if(process.env !== 'DEV'){
  debugInit('env not DEV, loading configs from DB');
  debugDB('reading site config from database');
  db.Config.find()
    .tap(debugDB)
    .then(config){
      configureApp(config);
    }
}else{
  debugInit('local environment: reading config from file');
  // ...
}
```

Then when you&#8217;re confused why the app fails on startup on our local machine, you can enable`app:init` (or `app:*`) and see the following in the console&#8230;

```js
app:init env not DEV, loading configs from DB +1ms
```

&#8230;and quickly discover that a missing environment variable is causing the issue.

## Debugging All (known) Events on an Event Emitter 

### Background 

My goal was to run my `newFeatureAdded` function whenever a user created a new &#8220;feature&#8221; on the map. This example is browser-based, but the approach works just as well with [Node.js EventEmiters](https://nodejs.org/dist/latest-v6.x/docs/api/events.html).

When I started, I attached my `newFeatureAdded` function to `editable:created`:

```js
map.on('editable:created', function(e){
  newFeatureAdded(e.layer);
});
```

But it wasn&#8217;t firing when I expected, so I added a debug function call to see what was going on:

```js
map.on('editable:created', function(e){
  eventDebug('editable:created', e.layer);
  newFeatureAdded(e.layer);
});
```

This revealed that the event was fired when the user clicked &#8220;create new feature&#8221;, _not_ when they placed the feature on the map. I fixed the issue, but I found myself adding debug function calls all over the place, with almost every event handler function:

```js
map.on('editable:drawing:commit', function(e){
  eventDebug('FIRED: editable:drawing:commit');
  handleDrawingCommit(e);
});

map.on('click', function(e){
  eventDebug('FIRED: click');
  disableAllEdits();
});

map.on('editable:vertex:clicked', function(e){
  eventDebug('FIRED: editable:vertex:clicked');
  handleVertexClick(e);
});
```

This is starting to look redundant, and doubly bad as it&#8217;s forcing me to wrap the handler calls in extra anonymous functions rather than delegate to them directly, for example `map.on('click', disableEdits)`. Furthermore, not knowing the event system well, I want to _discover_ other events that fire at times that might be useful.

### Another Approach&#8230; 

To build my UI, I needed to understand the interactions between [Leaflet&#8217;s 35 events](http://leafletjs.com/reference.html#map-events) and [Leaflet.Editable&#8217;s 18 events](https://github.com/Leaflet/Leaflet.Editable/tree/leaflet0.7#events), that overlap, trigger one another, and have somewhat ambiguous names (`layeradd`, `dragend`, `editable:drawing:dragend`, `editable:drawing:end`, `editable:drawing:commit`, `editable:created`, and so on.)

I could pore over the docs and source code to find the exact event for each eventuality&#8230; or I could attach debug loggers to _all_ events and see what happens!

The approach is:

  1. Create an array of all known events.
  2. Create a debug function for each event.
  3. Attach that function to the target event emitter using `.on`.

```js
// 1. Create list of events
const leafletEditableEvents = [
  'editable:created',
  'editable:enable',
  'editable:drawing:start',
  'editable:drawing:end',
  'editable:vertex:contextmenu',
// ...
];

const leafletEvents = [
  'click',
  'dblclick',
  'mousedown',
  'dragend',
  'layeradd',
  'layerremove',
// ...
];
```

To use the event debugging tool on any event emitter, I&#8217;ll make a function that takes the `target` object and `events` array as arguments:

```js
function debugEvents(target, events){
  events
    // 2. Create debug function for each
    // (but keep the function name as well! we'll need it below)
    // return both as { name, debugger }
    .map(eventName => { return { name: eventName, debugger: debug(eventName) }; })
    // 3. Attach that function to the target
    .map(event => target.on(event.name, event.debugger));
}

debugEvents(mapObject, leafletEditableEvents);
debugEvents(mapObject, leafletEvents);
```

Assuming I [set `localStorage.debug='*'` in the browser console](https://www.npmjs.com/package/debug#browser-support), I will now see a debug statement in the console when _any_ of the Leaflet.Editable events fire on the map object!

<img class="aligncenter" src="{{site.url}}/blog-assets/2016/09/debug_all_events.png" alt="debugger output in console" />

Note that the data that `.on()` passes to an event handler target is also passed to the debug functions.

In this case it&#8217;s the event object created by Leaflet, shown above in the console as `▶ Object`.

`mousemove` etc. are not in any namespace above, and it&#8217;s best to always namespace debug functions so they don&#8217;t collide, to add context, and to allow enabling/disabling by namespace. Let&#8217;s improve our `debugEvents` function to use a namespace:

```js
function debugEvents(target, events, namespace){
  events
    .map(eventName => { return {
      name: eventName,
      debugger: debug(`${namespace}:${eventName}`)
    } } )
    .map(event => target.on(event.name, event.debugger));
}

//editable events already prefixed with "editable", so "events:editable:..."
debugEvents(mapObject, leafletEditableEvents, 'event');
//map events not prefixed so we'll add `map`, so they're "events:map:..."
debugEvents(mapObject, leafletEvents, 'event:map');
```

You can enable all event debuggers in the console, or just editable events, or just core map events, thus:

```js
> localStorage.debug = 'event:*'
> localStorage.debug = 'event:editable:*'
> localStorage.debug = 'event:map:*
```

Conveniently, the [Leaflet.Editable events](https://github.com/Leaflet/Leaflet.Editable/tree/leaflet0.7#events) are all already &#8220;namespaced&#8221; and colon-separated, just like our debug namespaces!

```js
> localStorage.debug = 'event:editable:*' //enable all editable
> localStorage.debug = 'event:editable:drawing:*'  //just editable:drawing events
```

### Fine-tuning the output

Let&#8217;s enable all event debuggers and see what some interactions look like&#8230;

<img class="aligncenter" src="{{site.url}}/blog-assets/2016/09/debug_events_1.gif" alt="gif of debugger output with rapidly flowing debug statments during user interaction with map. Lots and lots of &quot;event:map:mousemove&quot; events." />

Looks nice, but the `mousemove` events are coming so fast they push everything else out of the console&#8211;they are basically noise. Some trial and error taught me it that `drag` events are equally noisy and I don&#8217;t need to know the core map events most of the time, just the `editable` events.

So I can reduce logging to just what I need, enabling only `editable:`events and ignoring _all_ &#8220;drag&#8221; and &#8220;mousemove&#8221; events:

```js
> localStorage.debug = 'event:editable:*,-event:*:drag,-event:*:mousemove’
```

<img class="aligncenter" src="{{site.url}}/blog-assets/2016/09/debug_events_2.gif" alt="gif of debugger output with a smaller number of events. Console screen does not overflow" />

Looks good!

## Conclusion 

While `debug` is a very small module and easy to get started with, you can tune it in very granular ways and this makes it a powerful development tool. By attaching debug statements to all events, _outside_ of our application code, you can trace the path of an event system and better understand how events interact, without adding any debug statements into your application code. If you&#8217;ve found another novel use of this library or have any questions about my post, [let me know](http://sequoia.makes.software/contact/). Happy logging!

_Note: I use the term &#8220;debugger function&#8221; and &#8220;debug logging&#8221; rather than &#8220;debugger&#8221; and &#8220;debugging&#8221; in this post advisedly. A &#8220;debugger&#8221; typically refers to a tool that can be used to pause execution and alter the code at runtime, for example the [VSCode debugger](https://code.visualstudio.com/docs/editor/debugging). What we&#8217;re doing here is &#8220;logging.&#8221;_
