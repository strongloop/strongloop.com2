---
id: 27856
title: 'Let&#8217;s Code It: The `debug` Module'
date: 2016-09-15T07:30:41+00:00
author: Sequoia McDowell
guid: https://strongloop.com/?p=27856
permalink: /strongblog/lets-code-it-the-debug-module/
categories:
  - How-To
  - Performance Tip
---
I did some fun stuff with the `debug` module recently for a web map project. I needed to understand the interactions between events in [Leaflet.js](http://leafletjs.com/) to figure out what events to attach to&#8230; but that&#8217;s the next post. Before I get to that, I want to go over the `debug` module itself.<!--more-->

## A trip down memory lane&#8230; 

`console.log`: the JavaScript programmer&#8217;s oldest[*](#window-dot-alert) friend. `console.log` was probably one of the first things you used to debug JavaScript, and while there are [plenty](https://code.visualstudio.com/docs/runtimes/nodejs#_debugging-your-express-application) of [more powerful tools](https://developer.mozilla.org/en-US/docs/Tools/Debugger), `console.log` is still useful to say &#8220;event fired&#8221;, &#8220;sending the following query to the database&#8230;&#8221;, etc..

So we write statements like ``console.log(`click fired on ${event.target}`)``. But then we&#8217;re not working on that part of the application anymore and those log statements just make noise, so we delete them. But then we _are_ working on that bit again later, so we put them back&#8211; and this time when we&#8217;re finished, we just comment them out, instead of moving them. Before we know it our code looks like this:

```js
fs.readFile(usersJson, 'utf-8', function (err, contents){
  // console.log('reading', usersJson);
  if(err){ throw err; }
  var users = JSON.parse(contents);
  // console.log('User ids & names :');
  // console.log(users.map(user => [user.id, user.name]));
  users.forEach(function(user){
    db.accounts.findOne({id: user.id}, function(err, address){
      if(err){ throw err; }
      var filename = 'address' + address.id + '.json';
      // console.log(JSON.parse('address'));
      // console.log(`writing address file: ${filename}`)
      fs.writeFile(filename, 'utf-8', address, function(err){
        if(err){ throw err; }
        // console.log(filename + ' written successfully!');
      });
    });
  });
});
```

## &#8220;There&#8217;s got to be a better way!&#8221;

What if, instead of commenting out or deleting our useful log statements when we&#8217;re not using them, we could turn them on when we need them and off when we don&#8217;t? This is a pretty simple fix:

```js
function log(...items){   //console.log can take multiple arguments!
  if(typeof DEBUG !== 'undefined' && DEBUG === true){
    console.log(...items)
  }
}
```

_NB: Using ES6 features [rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters) and [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) in this function_

Now we can replace our `console.log()` statements with `log()`, and by setting `DEBUG=true `or `DEBUG=false` in our code, we can turn logging on or off as needed! Hooray! Well, actually, there are still a couple problems&#8230;

## Problem 1: Hardcoding 

In our current system, `DEBUG` must be hardcoded, which is bad because

  1. We have to edit the codebase to enable or disable it.
  2. We can accidentally check it in to our code repository as &#8220;enabled.&#8221;

We can fix that by setting `DEBUG` to true or false somewhere outside our script, and reading it in. In Node it would make sense to use an [environment variable](https://nodejs.org/api/process.html#process_process_env):

```js
const DEBUG = process.env.DEBUG; // read from environment

function log(...items){
// ...
```

Now we can `export DEBUG=true` on our dev machine to turn it on all the time. Alternately, we can turn it on by [setting an environment variable](http://manpages.ubuntu.com/manpages/precise/en/man1/bash.1.html#contenttoc22) just for one process when we launch it (shell command below):

```sh
$ DEBUG=true node my-cool-script.js
```

If we want to use our debugger in the browser, we don&#8217;t have `process.env`, but we _do_ have [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage):

```js
var localEnv; //where do we read DEBUG from?

if(process && process.env){                //node
  localEnv = process.env;
}else if(window && window.localStorage) {  //browser
  localEnv = window.localStorage;
}

const DEBUG = localEnv.DEBUG;

function log(...items){
  // ...
```

Now we can set `DEBUG` in local storage using our browser console&#8230;

```js
> window.localStorage.DEBUG = true;
```

&#8230;reload the page, and debugging is enabled! Set `window.localStorage.DEBUG` to false and reload and it&#8217;s disabled again.

## Problem 2: All or Nothing 

With our current setup, we can only chose &#8220;all log statements on&#8221; or &#8220;all log statements off.&#8221; This is OK, but if we have a big application with distinct parts, and we&#8217;re having a database problem, it would be nice to just turn on database-related debug statements, but not others. If we only have one debugger and one debug on/off switch (`DEBUG`), this isn&#8217;t possible, so we need:

  1. Multiple debug functions
  2. Multiple on/off switches

Let&#8217;s tackle the second problem first. Instead of a Boolean, let&#8217;s make debug an array of keys, each representing a debugger we want turned on:

```js
DEBUG = ['database'];        // just enable database debugger
DEBUG = ['database', 'http'];// enable database & http debuggers
DEBUG = undefined;           // don't enable any debuggers
```

We can&#8217;t set arrays as environment variables, but we can set it to a string&#8230;

```sh
$ DEBUG=database,http node my-cool-script.js
```

&#8230;and it&#8217;s easy to build an array from a string&#8230;

```js
// process.env.DEBUG = 'database,http'
DEBUG = localEnv.DEBUG.split(',');

DEBUG === ['database', 'http'] // => true
```

Now we have an array of keys for debuggers we want enabled. The simplest way to allow us to enable just http or just database debugging would be to add an argument to the `log` function, specifying which &#8220;key&#8221; each debug statement should be associated with:

```js
function log(key, ...items){
  if(typeof DEBUG !== 'undefined' && DEBUG.includes(key)){ 
    console.log(...items)
  }
}

log('database','results recieved');             // using database key
log('http','route not found', request.url);     // using http key
```

_NB: [`Array.prototype.includes`](http://kangax.github.io/compat-table/es2016plus/#test-Array.prototype.includes_Array.prototype.includes) only exists in newer environments._

Now we can enable enable and disable `http` and `database` debug logging separately! Passing a key _each time_ is a bit tedious however, so let&#8217;s revisit the proposed solution above, &#8220;multiple debug functions.&#8221; To create a `logHttp` function, we basically need a pass-through that takes a message and adds the `http` &#8220;key&#8221; before sending it to log:

```js
function logHttp(...items){
  log('http', ...items);
}

logHttp('foo'); // --> log('http', 'foo');
```

Using [higher-order functions](https://strongloop.com/strongblog/higher-order-functions-in-es6easy-as-a-b-c/) (in this case a function that returns a function), we can make a &#8220;factory&#8221; to produce debugger functions bound to a certain key:

```js
function makeLogger(fixedKey){
  return function(...items){
    log(fixedKey, ...items)
  }
}
```

Now we can easily create new &#8220;namespaced&#8221; `log` functions and call them separately:

```js
const http = makeLogger('http');
const dbDebug = makeLogger('database');

dbDebug('connection established');     // runs if "database" is enabled
dbDebug('Results recieved');           // runs if "database" is enabled

http(`Request took ${requestTime}ms`); // runs if "http" is enabled
```

## That&#8217;s it! 

That gets us just about all the way to the [`debug` module](https://github.com/visionmedia/debug)! It has a couple more features than what we created here, but this covers the main bits. I use the `debug` module in basically all projects and typically start using it from day one: if you _never_ put `console.log` statements in your code you have nothing to &#8220;clean up,&#8221; and those debug log statements you make during active development can be useful later, so why not keep them?

Next steps: Check out the the [`debug` module](https://github.com/visionmedia/debug). In the next post I&#8217;ll go over some advanced usage. Thanks for reading, and as always, [let me know](https://twitter.com/_sequoia) if you have any questions or feedback!

* <em id="window-dot-alert"><a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/alert">second oldest</a> 😉 <a href="#intro">↩</a></em>