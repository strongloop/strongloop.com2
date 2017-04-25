---
id: 28616
title: Context Propagation in LoopBack
date: 2017-02-02T08:00:20+00:00
author: Miroslav Bajtoš
guid: https://strongloop.com/?p=28616
permalink: /strongblog/context-propagation-in-loopback/
categories:
  - LoopBack
---
[LoopBack](http://loopback.io/) developers often need to propagate information (aka &#8220;context&#8221;) from the HTTP layer all the way down to data source connectors. We hear this regularly in the LoopBack discussion forums and GitHub issues.

Consider the following examples:

  * When querying a database for a list of &#8220;todo&#8221; items, return only the items owned by the currently logged-in user.
  * When making a REST or SOAP request to a backend service, include a transaction/correlation ID from the incoming HTTP request headers in the outgoing HTTP request headers, so that these two requests can be linked together by logging and tracing tools.
  * When formatting an error message, translate it to the language understood by the user, as indicated by the HTTP request header &#8220;Accept-Language&#8221;.

These examples share a common pattern: the app needs to access information in the layer handling incoming HTTP requests, but it is not included in the arguments (parameters) of remote method APIs.

<!--more-->

**Background**

In traditional synchronous languages/frameworks like J2EE, ASP.NET or Ruby on Rails, one can use [thread-local storage](https://en.wikipedia.org/wiki/Thread-local_storage) to save a value at the beginning of request handling and later retrieve it deep inside business logic.  This works because each request has its own thread dedicated to serving it.

[<img class="aligncenter size-full wp-image-28675" src="https://strongloop.com/wp-content/uploads/2017/02/Request-1-2.jpeg" alt="Request 1 & 2" width="550" height="500" srcset="https://strongloop.com/wp-content/uploads/2017/02/Request-1-2.jpeg 550w, https://strongloop.com/wp-content/uploads/2017/02/Request-1-2-300x273.jpeg 300w, https://strongloop.com/wp-content/uploads/2017/02/Request-1-2-450x409.jpeg 450w" sizes="(max-width: 550px) 100vw, 550px" />](https://strongloop.com/wp-content/uploads/2017/02/Request-1-2.jpeg)_In this example, REQUEST1 uses Thread-Local Storage to set transaction id (TID) to value 1. Later, code in another module can retrieve TID and get the value 1 back again. Similarly for REQUEST2 which sets TID to value 2._

The situation is different in Node.js and similar async frameworks: a single thread is handling many requests at the same time, interleaving execution of bits of code for each request.

[<img class="aligncenter size-full wp-image-28677" src="https://strongloop.com/wp-content/uploads/2017/02/Single-thread-request.png" alt="Single thread request" width="550" height="307" srcset="https://strongloop.com/wp-content/uploads/2017/02/Single-thread-request.png 550w, https://strongloop.com/wp-content/uploads/2017/02/Single-thread-request-300x167.png 300w, https://strongloop.com/wp-content/uploads/2017/02/Single-thread-request-450x251.png 450w" sizes="(max-width: 550px) 100vw, 550px" />](https://strongloop.com/wp-content/uploads/2017/02/Single-thread-request.png)_When the code handling requests are interleaved, the code storing TID is called in the same thread for both requests. How to know which value to return later, when the code asks for the stored TID?_

When we were looking for alternatives for thread-local storage back in 2014, the concept of [continuation-local storage](https://datahero.com/blog/2014/05/22/node-js-preserving-data-across-async-callbacks/) (CLS) looked like a perfect fit: an API similar to that of thread-local storage, that works out of the box in all Node.js applications. (Or does it? Read more to find out!) So we went ahead and implemented loopback.getCurrentContext() API using [continuation-local-storage](https://www.npmjs.com/package/continuation-local-storage) module (see [loopback#337](https://github.com/strongloop/loopback/pull/337)).

Even before the pull request landed, the first problems started to pop up: the MongoDB connector did not work well with CLS and required some extra in LoopBack core to make it work again (see the initial [comment](https://github.com/strongloop/loopback/pull/337#issuecomment-61680577) and the [fix](https://github.com/strongloop/loopback/commit/989abf6822680e65665ee331e47457066536da2a)). As more people started to use this new feature, more context-propagation bugs started to appear.

As we investigated these issues, we eventually came to the conclusion that Node.js does not provide necessary APIs for a reliable implementation of CLS, and therefore any solution based on current incomplete APIs will require cooperation from all modules to make CLS work correctly in all situations. Because that&#8217;s not happening, applications cannot rely on CLS to work correctly. What&#8217;s worse, there is no way how to tell in advance whether your application is susceptible to loosing current context (or even worse, seeing the context of another request as the current one). For a  great write-up of CLS problems see [node-continuation-local-storage issue #59](https://github.com/othiym23/node-continuation-local-storage/issues/59).

Once we accepted this fact and let go of the wish to have a solution as elegant as CLS (see [loopback#1676](https://github.com/strongloop/loopback/issues/1676)), it was time to look for alternative ways of propagating extra context. Ritchie Martori ([@ritch](https://github.com/ritch)) proposed a reasonable workaround in [loopback#1495](https://github.com/strongloop/loopback/issues/1495) based on using an extra &#8220;options&#8221; argument. Since most built-in methods like &#8220;PersistedModel.create()&#8221; or &#8220;PersistedModel.find()&#8221; already have this argument, we decided to pursue this direction.

**The solution**

The current solution for context propagation has the following parts:

  1. Any additional context is passed in the &#8220;options&#8221; argument. Built-in methods already accept this argument, and custom user methods must be modified to accept it too.
  2. Whenever a method invokes another method, the &#8220;options&#8221; argument must be passed down the invocation chain.
  3. To seed the &#8220;options&#8221; argument when a method is invoked via a REST call, the &#8220;options&#8221; argument must be annotated in remoting metadata with the &#8220;http&#8221; property set to the special string value &#8220;optionsFromRequest&#8221;. Under the hood, Model.remoteMethod converts this special string value to a function that will be called by strong-remoting for each incoming request to build the value for this parameter.

This way, the context is explicitly propagated through function calls, irrespective of sync/async flow. Because the initial value of the &#8220;options&#8221; argument is built by a server-side function, the client REST API remains unchanged. Sensitive context data like &#8220;currently logged-in user&#8221; remain safe from client-side manipulations.

Here is an example of a custom remote method propagating context via &#8220;options&#8221; argument:

```js
// common/models/my-model.js
module.exports = function(MyModel) {
  MyModel.log = function(messageId, options) {
    const Message = this.app.models.Message;
    return Message.findById(messageId, options) // IMPORTANT: forward the options arg
      .then(msg =&gt; {
        // NOTE: code similar to this can be placed into Operation hooks too as long as options are forwarded above
        const userId = options && options.accessToken && options.accessToken.userId;
        const user = userId ? 'user#' + userId : '&lt;anonymous&gt;';
        console.log('(%s) %s', user, msg.text));
      });
  };

// common/models/my-model.json
{
  "name": "MyModel",
  // ...
  "methods": {
    "log": {
      "accepts": [
        {"arg": "messageId", "type": "number", "required": true},
        {"arg": "options", "type": "object", "http": "optionsFromRequest"}
      ],
      "http": {"verb": "POST", "path": "/log/:messageId"}
    }
  }
}
```

Please refer to the [documentation](http://loopback.io/doc/en/lb3/Using-current-context.html) to learn how to access the context from [Operations hooks](https://loopback.io/doc/en/lb3/Operation-hooks.html) and customize the value of &#8220;options&#8221; argument provided by the remoting layer.

**The future of loopback-context**

Even though we decided to remove all CLS-based context APIs from LoopBack core, we still wanted to allow existing users to keep using getCurrentContext() API if it worked well for their app, thus we moved all code to a new project [loopback-context](https://github.com/strongloop/loopback-context). Soon after that move was done, a LoopBack user opened a pull request [loopback-context#2](https://github.com/strongloop/loopback-context/pull/2) to upgrade the module to use a different implementation of CLS based on a newer Node.js API. This work was eventually landed via [loopback-context#11](https://github.com/strongloop/loopback-context/pull/11) and released as loopback-context@3.0.0.

While the new Node.js API (AsyncWrap via [async-hook](https://www.npmjs.com/package/async-hook)) promises to work more reliably than the old one ([async-listener](https://www.npmjs.com/package/async-listener)), the AsyncWrap API is still a work in progress that&#8217;s far from being complete. Most importantly, there is no official and standard way for modules to tell AsyncWrap/CLS when and how to correctly restore the continuation context. As a result, any module that implements a custom task queue or a connection pool is prone to break context storage. See loopback-context&#8217;s [issue tracker](https://github.com/strongloop/loopback-context/issues) for the list of known problems.

We are keeping an eye on the development in Node.js land and when the AsyncWrap API becomes stable and widely supported by user-land modules, we will be happy to bring loopback-context back as an official solution for context propagation again.
