---
layout: post
title: LoopBack 4 improves inbound HTTP processing
date: 2018-06-18T9:40:15+00:00
author: Miroslav Bajtoš
permalink: /strongblog/loopback4-improves-inbound-http-processing
categories:
  - Community
  - LoopBack
---

We started LoopBack 4 with the desire to improve all aspects of application development. One of the pain points in LoopBack 3.x was composition of Express middleware handlers, which we decided to address by rolling out a different design based on Sequence of actions. As time progressed, we realized we would have to end up ‘reinventing the wheel’ and provide our own Sequence-friendly version for many frequently used middleware like CORS. Instead, we decided to step back and keep using the vast ecosystem of existing Express middleware that is battle-testeds by years of production use.

<!--more-->

While discussing the new direction, we thought it would be great to support multiple different HTTP frameworks like Express and Koa and implement a thin integration layer to allow mounting of LoopBack 4 REST router. [Raymond](/authors/Raymond_Feng/) researched this approach in a spike pull request [#1082](https://github.com/strongloop/loopback-next/pull/1082). Later on, [Yaapa](/authors/Hage_Yaapa/) looked into practical implications of the proposed approach and discovered that Express and Koa are fundamentally incompatible at such level that it's impossible to write a a single middleware/route function that would work with both frameworks. That left us with a difficult decision to make: going forward, should we pick Express or Koa as the framework of choice for LoopBack 4? While we like Koa's design a lot, we see even more value in the wider adoption and maturity of Express framework and middleware. Ultimately we decided to use Express under the hood but bring some parts of Koa design into LoopBack too.

## Request Context as an object

Traditionally in Express (and Connect), functions implementing request handling logic have the following signature:

```js
function (req, res, next);
```

While it's amazing how powerful this simple signature is, it comes with major flaws too:

1. Because the list of arguments is given, it's difficult to pass additional data between different handlers. The convention is to attach custom properties to the Request object, e.g. body-parsing middleware sets `req.body` property. This approach is difficult to describe in TypeScript and the ever-changing shape of the Request object has negative impact on (micro)performance.

2. Flow control is difficult to map to Promises and async/await. Execution of a middleware handler has three possible outcomes:

    i. The request was handled and the remaining items in the middleware chain are skipped. Implementation wise, middleware did not call `next()`.

    ii. The middleware modified the request/response objects, or a route did not match the requested path, and the next handler in the middleware chain should be executed. Implementation wise, middleware called `next()` with no arguments.

    iii. There was an error and request handling should be aborted. Implementation wise, middleware called `next()` with a single argument - the error.

It is difficult to run a piece of code after the request was handled or transform the response before it's being sent. For example, to print a log line containing information about the request including timing information, one has to register the logging middleware early in the middleware chain so that it can register event observers and/or monkey-patch request/response objects before any actual work is done - this is counter-intuitive since the log line is printed at the end of request handling.

Koa addresses these flaws by introducing an extensible [Context](https://koajs.com/#context) object that contains not only the request and response, but also additional properties and helper methods. Since in LoopBack 4 we have already had a per-request context object used to resolve dependencies, it made sense to extend this context object to also act as a context for low-level HTTP code.

In pull request [#1316](https://github.com/strongloop/loopback-next/pull/1316), I have introduced two context types:

1. `HandlerContext` is an interface describing objects required to handle an incoming HTTP request. There are two properties for starter: `context.request` and `context.response`. Low-level entities like Sequence actions should be using this interface to allow easy interoperability with potentially any HTTP framework and more importantly, to keep the code easy to test.
2. `RequestContext` is a class extending our IoC `Context` and implementing `HandlerContext` interface. This object is used when invoking the sequence handler. By combining both IoC and HTTP contexts into a single object, there will be (hopefully) less confusion among LB4 users about what shape a "context" object has in different places.

Having a single context object allowed me to simplify many places around the Sequence. For example, in the `app.handler()` function, we no longer need to distinguish between a handler context containing request/response and an IoC context previously available via `sequence.ctx` - there is a single context argument providing access to both now.

Before this change, a sequence class was accepting IoC Context as a constructor argument and a pair of request/response objects in the `handle()` method:

```ts
class MySequence implements SequenceHandler {
  constructor(
    @inject(RestBindings.Http.CONTEXT) public ctx: Context,
    // inject sequence actions
  ){}

  async handle(req: ParsedRequest, res: ServerResponse): Promise<void> {
    // handle the request
  }
}
```

Now with the single RequestContext object:

```ts
class MySequence implements SequenceHandler {
  constructor(
    // inject sequence actions
  ){}

  async handle(context: RequestContext): Promise<void> {
    // handle the request
  }
}
```

The built-in sequence action "reject" is another place we could simplify. Before, reject had three arguments - response, request, error; never mind the unusual order where response is before request. The new API expects only two arguments:

```ts
function reject(handlerContext: HandlerContext, err: Error): void;
```

Implementors can leverage [ES6 destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) to get the same local arguments as before:

```ts
function reject({response, request}: HandlerContext, err: Error): void;
```

## Express Request & Response everywhere

In the next step (see pull request [#1326](https://github.com/strongloop/loopback-next/pull/1326)), I switched our code from `ServerRequest` and `ServerResponse` types provided by Node.js core module [http](https://nodejs.org/api/http.html) to Express-flavored variants and integrated Express into RestServer's request handler. This change allowed further simplifications in many places (the patch added 352 and removed 378 lines), which further validated our decision to leverage Express.

The first and pretty obvious change was removal of our custom `ParsedRequest` class, which was adding useful URL-related properties like `req.path` and `req.query`. In the past, we had to carefully distinguish which places can access ParsedRequest and where only the core ServerRequest is available. Now we can use the same Express Request everywhere.

Our reference implementation of an authentication extension was the second place that became possible to greatly simplify. Because we leverage Passport to provide actual authentication strategies, our extension had to bridge between LoopBack's `ParsedRequest` and the Express Request type expected by Passport. That's no longer the case and the authentication extension simply forwards the request received from LoopBack now.

Last but not least, I cleaned up the code handling CORS in LoopBack 4 applications. Originally, we employed a hack to use Express middleware inside a non-express LoopBack4 request handler:

```ts
cors(corsOptions)(request, response, () => {});
if (request.method === 'OPTIONS') {
  return Promise.resolve();
}
```

With an Express app running under the hood of our RestServer, we can mount the CORS middleware as it was intended to (see pull request [#1338](https://github.com/strongloop/loopback-next/pull/1338)):

```ts
this._expressApp.use(cors(corsOptions));
```

Not all was a bed of roses though. The request and response objects provided by Express are more difficult to stub when compared to core ServerRequest and ServerResponse objects. I'll spare the readers from details on how the sausages are made, it's sufficient to say that [@loopback/testlab](https://www.npmjs.com/package/@loopback/testlab) was updated to provide a factory function `stubExpressContext()` to create Express-flavored request/response stubs too. See module's [documentation](https://www.npmjs.com/package/@loopback/testlab#shot) to learn more.

## A factory for HTTP(S) endpoints

The last change identified in the original spike was refactoring of the code setting up the HTTP server. We have had the following goals in mind:
- Allow different HTTP-based transports to share the same code and configuration options.
- Make it easy to add HTTPS support in the (near) future, use the same API to create both HTTP and HTTPS endpoints depending on the configuration.
- Manage the lifecycle of http endpoints (start/stop API).
- Expose bound addresses. Typically in tests, the server is configured with port 0 to let the operating system to provide an available port. After the server started, tests need to get the URL where the server is listening at, using the updated port number.

The pull request [#1369](https://github.com/strongloop/loopback-next/pull/1369) added a new package [@loopback/http-server](https://www.npmjs.com/package/@loopback/http-server) which exposes convenience API for creating new instances of HTTP servers.

```ts
const httpServer = new HttpServer(
  (req, res) => { res.end('Hello world'); },
  {port: 3000, host: '127.0.01'},
);
```

We expect the initial implementation to evolve over time and get support for additional features, from HTTPS to WebSockets and HTTP/2. Contributions are welcome!

See [Robust processing capabilities](https://github.com/strongloop/loopback-next/issues/1038) for even more improvements of our HTTP stack we are thinking about .

## Call for Action

LoopBack's future success counts on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
- [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
- [Reporting issues](https://github.com/strongloop/loopback-next/issues)
- [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
- [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)
