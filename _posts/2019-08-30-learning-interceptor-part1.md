---
layout: post
title: Learning LoopBack4 Interceptors (Part 1) - Global Interceptors
date: 2019-08-30
author: Diana Lau
permalink: /strongblog/loopback4-interceptors-part1/
categories:
  - LoopBack
  - Community
published: false
---

Wonder what an interceptor is in LoopBack 4? 
> Interceptors are reusable functions to provide aspect-oriented logic around method invocations. 

Seems pretty useful, right? There are 3 levels of interceptors: global, class level and method level. In this article, we are going to look into what global interceptor is and how to use it. 

<!--more-->

You can insert additional logic before and after method invocation through [interceptors](https://loopback.io/doc/en/lb4/Interceptors.html). For global interceptors, they are applicable across the LoopBack application. There are many usages on interceptors.  

In this article, we'll use global interceptors for logging purposes. The scaffolded LoopBack 4 application comes with a default `/ping` endpoint. We're going to use this for illustration purposes. 

## Creating a Global Interceptor

After you've scaffolded the application, run `lb4 interceptor` command to create an interceptor. Since we are going to have one global interceptor, leave the `group name for the global interceptor` as an empty string which is the default value.

```
$ lb4 interceptor
? Interceptor name: logging
? Is it a global interceptor? Yes
? Global interceptors are sorted by the order of an array of group names bound to ContextBindings.GLOBAL_INTERCEPTOR_ORDERED_GROUPS. See https://loopback.io/doc/en/lb4/Interceptors.html#order-of-invocation-for-interceptors.

Group name for the global interceptor: ('')

create src/interceptors/logging.interceptor.ts
update src/interceptors/index.ts

Interceptor Logging was created in src/interceptors/
```

## Adding Logic to the Logging Interceptor

Let's take a look at the generated interceptor. 

Go to `src/interceptors/logging.interceptor.ts`. You'll see 2 comments in the try-catch block where you can add your logic: pre-invocation and post-invocation. We are going to simply print out the method name of the invocationContext before and after the method is being invoked.

```
try {
  // Add pre-invocation logic here
  // ----- ADDED THIS LINE ----
  console.log('log: before-' + invocationCtx.targetName);
  
  const result = await next();

  // Add post-invocation logic here
  // ----- ADDED THIS LINE -----
  console.log('log: after-' + invocationCtx.targetName);

  return result;
} catch (err) {
  // Add error handling logic here
  console.error(err);
  throw err;
}
```

## Global Interceptor in Action

That's it! The global interceptor is ready for action. 

Start the application with `npm start` command. Then go to the API Explorer: http://localhost:3000/explorer.

You'll now see the following printed to the console:

```
log: before-ExplorerController.prototype.index
log: after-ExplorerController.prototype.index
```

Next, call the `/ping` endpoint by clicking "Try it Out" > "Execute". You'll see two more lines got printed:

```
log: before-PingController.prototype.ping
log: after-PingController.prototype.ping
```

The interceptor method got called because it is at the global level. 

## Getting HttpRequest from InvocationContext

For more meaningful log messages, you might want to get more information about the HTTP request. To do that, add this import in the interceptor class:

```
import {RestBindings} from '@loopback/rest';
```

We're going to print out the endpoint being called. To do that, add the snippet below as the pre-invocation logic:

```
const httpReq = await invocationCtx.get(RestBindings.Http.REQUEST, {optional: true,});
if (httpReq) {
  console.log('Endpoint being called:', httpReq.path);
}
```

Restart the application, go to API Explorer and call the `/ping` endpoint again. You'll see the following printed to the console log:

```
log: before-ExplorerController.prototype.index
Endpoint being called: /explorer/
log: after-ExplorerController.prototype.index
log: before-PingController.prototype.ping
Endpoint being called: /ping
log: after-PingController.prototype.ping
```

## Other Resources

For other interceptor examples, check out: https://loopback.io/doc/en/lb4/Interceptors.html#example-interceptors

If you're looking for interceptors in a running application, see:
- Caching enabled via interceptors in Greeter application, https://github.com/strongloop/loopback-next/tree/master/examples/greeting-app
- Authorization added using interceptors in this tutorial, https://strongloop.com/strongblog/building-an-online-game-with-loopback-4-pt4/


## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Reporting issues](https://github.com/strongloop/loopback-next/issues).
- [Contributing](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md)
  code and documentation.
- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Joining](https://github.com/strongloop/loopback-next/issues/110) our user group.
