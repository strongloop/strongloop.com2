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

Wonder what is interceptor in LoopBack 4? 
> Interceptors are reusable functions to provide aspect-oriented logic around method invocations. 

Seems pretty useful, right? There are 3 levels of interceptors: global, class level and method level. In this article, we are going to look into what global interceptor is and how to use it. 

<!--more-->

You can insert additional logic before and after method invocation through [interceptors](https://loopback.io/doc/en/lb4/Interceptors.html). 
By the name, global interceptors are applicable across the LoopBack application. One use case could be logging. To illustrate that, I'm going to scaffold a LoopBack 4 application which comes with the /ping endpoint and create a global interceptor.
$ lb4 app global-interceptor --yes
$ cd global-interceptor
$ lb4 interceptor
? Interceptor name: logging
? Is it a global interceptor? Yes
? Global interceptors are sorted by the order of an array of group names bound to ContextBindings.GLOBAL_INTERCEPTOR_ORDERED_GROUPS. See https://loopback.io/doc/en/lb4/Interceptors.html#order-of-invocation-for-interceptors.
Group name for the global interceptor: ('')
create src/interceptors/logging.interceptor.ts
update src/interceptors/index.ts
Interceptor Logging was created in src/interceptors/
Let's go to src/interceptors/logging.interceptor.ts and take a look at the intercept method. There are 2 comments in the try-catch block where you can add your logic: pre-invocation and post-invocation. 
As shown in the docs page, the pre- and post-invocation logic is simply to print out the method name of the invocationContext.  
try {
  // Add pre-invocation logic here
  // ----- ADDED THIS LINE ----
  console.log('log: before-' + invocationCtx.methodName);
  
  const result = await next();
  // Add post-invocation logic here
  // ----- ADDED THIS LINE -----
  console.log('log: after-' + invocationCtx.methodName);
  return result;
} catch (err) {
  // Add error handling logic here
  throw err;
}
That's it! 
Global Interceptor in Action
Let's see the global interceptor in action. Start the application:
$ npm start
Nothing happened yet. Then go to the API Explorer: http://localhost:3000/explorer
You'll see the following was printed to the console:
log: before-index
log: after-index
Go to the /ping endpoint, and click "Try it Out" > "Execute". You'll see two more lines got printed:
log: before-ping
log: after-ping
The interceptor method got called automatically because it is at the global level. 
Getting HttpRequest from InvocationContext
For the pre- or post-invocation logic, you might want to get more information about the HTTP request. To do that, add this import in the interceptor class:
import {RestBindings} from '@loopback/rest';
I'm going to print out the endpoint being called. Add the snippet below as the pre-invocation logic:
const httpReq = await invocationCtx.get(RestBindings.Http.REQUEST, {optional: true,});
if (httpReq) {
  console.log('Endpoint being called:', httpReq.path);
}
Restarting the application, go to API Explorer > /ping, I got the following output:
log: before-index
Endpoint being called: /explorer/
log: after-index
log: before-ping
Endpoint being called: /ping
log: after-ping
Other Examples?
See https://loopback.io/doc/en/lb4/Interceptors.html#example-interceptors
Resources
Interceptor docs page, https://loopback.io/doc/en/lb4/Interceptors.html
Caching enabled via interceptors in Greeter application, https://github.com/strongloop/loopback-next/tree/master/examples/greeting-app
Authorization added using interceptors in this tutorial, https://strongloop.com/strongblog/building-an-online-game-with-loopback-4-pt4/