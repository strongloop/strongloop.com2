---
layout: post
title: How We Built a Self-hosted REST API Explorer in LoopBack 4
date: 2018-11-22T00:00:00+00:00
author: Miroslav Bajtoš
permalink: /strongblog/how-we-built-a-self-hosted-rest-api-explorer
categories:
  - LoopBack
  - OpenAPI Spec
published: false
---

The LoopBack team has always believed it's important to provide great user experience not only to REST API creators, but also to developers consuming those APIs.  API Explorer is one of tools making a big difference, as it can render a live documentation for the REST API provided by any LoopBack application and even provides UI controls for executing individual endpoints straight from the docs.

LoopBack 4.0 GA was initially relying on an instance hosted externally at [explorer.loopback.io](https://explorer.loopback.io/). With the recent improvements in our REST layer, we were able to introduce a self-hosted version that works fully offline.

<!-- more -->

Under the hood, our API Explorer is leveraging the open-source component [swagger-ui](https://swagger.io/tools/swagger-ui/), which is an HTML5 single-page application (SPA) that accepts a link to a Swagger or OpenAPI Spec document and does all the heavy lifting.

Originally, LoopBack 4 was focused on API creation experience and did not provide features for serving website assets. For the last few weeks, we were looking into ways how to add support for single-page applications. With the new building blocks in place, we implemented a self-hosted API Explorer as a new extension called [`@loopback/rest-explorer`](https://www.npmjs.com/package/@loopback/rest-explorer)

## Using Self-hosted REST API Explorer

New applications scaffolded by our CLI tool [`lb4`](https://www.npmjs.com/package/@loopback/cli) come with the self-hosted API Explorer preconfigured. To view the API Explorer:

1. Start your application

    ```
    $ npm start
    ```

2. Open the the same old address in your browser:

    ```text
    http://localhost:3000/explorer
    ```

Existing projects are easy to upgrade too, follow the steps below to use the new extension.

1. Install the package from npm

    ```shell
    $ npm install --save @loopback/rest-explorer
    ```

2. Import the component class in your application source code file (typically `src/application.ts`):

    ```ts
    import {RestExplorerComponent} from '@loopback/rest-explorer';
    ```

3. Mount the component in your Application constructor function:

    ```ts
    class MyApplication extends /*...*/ {
      constructor(options: ApplicationConfig = {}) {
        super(options);

        // ...

        this.component(RestExplorerComponent);
      }
    }
    ```

## The Road to a Self-hosted Version

We started to experiment with different implementation of a self-hosted API Explorer back in September. The first attempt proposed in [PR#1644](https://github.com/strongloop/loopback-next/pull/1664) was based on the idea of allowing arbitrary Express middleware to be mounted on a RestServer/RestApplication and then implementing the API Explorer as a new middleware handler.

Middleware registration is a complex problem and we didn't want to rush its implementation just to enable a self-hosted explorer. Eventually, we settled on a different solution based on two building blocks that are useful outside of API Explorer context too.

1. LoopBack applications can expose static assets. This allows the API Explorer component to serve assets like CSS & client-side JavaScript files, images, etc.

2. A controller can take full control of response writing. The API Explorer component uses this feature to render the main swagger-ui HTML file with a custom URL pointing to the appropriate OpenAPI spec document.

Besides those fundamental building blocks, we have also discovered two more feature requirements along the way:

1. Hide endpoints from documentation (OpenAPI Spec).
2. Disable the built-in redirect to the externally hosted explorer.

Let's take a closer look at these new features now.

### Serving Static Assets

At high level, serving static assets is easy: just mount [serve-static](https://www.npmjs.com/package/serve-static) middleware on the Express application we are using under the hood.

As usual, the devil is in the details. In LoopBack 4, we use the concept of a [Sequence of Actions](https://loopback.io/doc/en/lb4/Sequence.html) to define the request-processing flow. A sequence is responsible for all aspects of request handling, from looking up a route matching the requested verb and method to handling errors like `404 Not Found`. At the same time, it does not provide extension points for plugging arbitrary Express middleware.

The initial implementation in [PR#1611](https://github.com/strongloop/loopback-next/pull/1611) worked around this limitation by mounting the static asset handler _before_ the Sequence-based handler. Unfortunately, this has a negative effect on the performance: every incoming GET request is going to hit the file system first, to check if there is a static asset matching the requested path. Error handling is another issue - errors reported by static asset handler are skipping the Sequence and its [reject action](https://loopback.io/doc/en/lb4/Sequence.html#handling-errors). As a result, errors triggered by static assets are handled differently from errors originating in the API implementation.

[PR#1848](https://github.com/strongloop/loopback-next/pull/1848) reworked the internal implementation of static assets handler using a special catch-all route compatible with our Sequence.

- The route matches any URL that did not match any API endpoint; i.e. the sequence action `findRoute` returns this catch-all route if no API endpoint matched the requested URL.

- The route executes the express Router where static assets were mounted; i.e.  the sequence action `invoke` runs express routing to handle static assets.

- When no static asset matched the requested URL, then the route throws `HttpError.NotFound`, i.e. the sequence action `invoke` throws the 404 error

Both problems of the initial implementation were solved ✅

### Serving a Dynamic HTML File

The second missing piece is how to serve the single-page application's main HTML file in such way that the correct OpenAPI Spec URL is provided to swagger-ui.

As a short-term workaround, we decided to allow controller methods to return `undefined` or the actual Express `response` object to indicate that the response has been already handled, see [PR#1760](https://github.com/strongloop/loopback-next/pull/1760).

This workaround is far from ideal though. So far, the framework was offering pretty strong guarantees to LoopBack users: every HTTP response was produced either by `send` or `reject`. An application or an extension could intercept or modify _all_ responses by registering custom `send` & `reject` actions, and be assured that such solution is covering all cases.

Now that controller methods are allowed to take over response serialization, such guarantee can be no longer offered and users have to rely on other mechanism to intercept or modify responses (typically by observing or replacing WritableStream bits in the Express `response` object).

Based on that, we decided to keep this new feature undocumented to prevent wider adoption.  For longer term, we would like to implement a contract allowing Controller methods to return a result describing all aspects of the HTTP response to be generated, e.g. status code and headers.  See [issue #436](https://github.com/strongloop/loopback-next/issues/436).


### Hiding Endpoints from the API Spec

Using a controller method to serve a templated HTML page has one more problem: the code generating OpenAPI Spec document will include this internal controller in the generated spec.

To allow the explorer extension to hide this internal endpoint, [PR#1896](https://github.com/strongloop/loopback-next/pull/1896) introduced a new OpenAPI extension that's available to all LoopBack 4 applications: `x-visibility: undocumented`.

### Disabling the Built-in Redirect

Once an application has switched to use the self-hosted API Explorer, it no longer needs the "old" solution based on a redirect to the externally hosted version. We need to disable this redirect before we can register a controller method to serve the `/explorer` endpoint, because built-in redirects take precedence over routes contributed by applications and extensions.

[PR#2016](https://github.com/strongloop/loopback-next/pull/2016) is adding a new application-level config option to disable the built-in redirect:

```ts
{
  rest: {
    apiExplorer: {
      disabled: true
    }
  }
}
```

## Implementing a Self-hosted REST API Explorer

Now that all building blocks were added, the actual implementation of the Explorer extension became very easy. The core consists of approximately 80 lines of code in two files:

- [packages/rest-explorer/src/rest-explorer.component.ts](https://github.com/strongloop/loopback-next/blob/e0fe37d086e4fbb1cf8df23731e7b7637dd550c1/packages/rest-explorer/src/rest-explorer.component.ts)
- [packages/rest-explorer/src/rest-explorer.controller.ts](https://github.com/strongloop/loopback-next/blob/e0fe37d086e4fbb1cf8df23731e7b7637dd550c1/packages/rest-explorer/src/rest-explorer.controller.ts)

Check out [PR#2014](https://github.com/strongloop/loopback-next/pull/2014) to see the full patch.

## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Reporting issues](https://github.com/strongloop/loopback-next/issues).
- [Contributing](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md)
  code and documentation.
- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Joining](https://github.com/strongloop/loopback-next/issues/110) our user group.
