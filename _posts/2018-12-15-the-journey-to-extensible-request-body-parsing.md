---
layout: post
title: The Journey to Extensible Request Body Parsing for LoopBack 4
date: 2018-12-15
author: Raymond Feng
permalink: /strongblog/the-journey-to-extensible-request-body-parsing/
categories:
  - Community
  - LoopBack
published: false
---

LoopBack 4 makes it easy for developers to implement business logic behind REST APIs as controller classes in TypeScript and expose them as HTTP endpoints by decorating such classes and their members including methods and parameters. The framework leverages OpenAPI specification compliant metadata to abstract away how to route incoming HTTP requests to corresponding controller methods and make sure the parameters are extracted, parsed, coerced, and validated for method invocations. You can find more details at [routing](https://loopback.io/doc/en/lb4/Routing-requests.html) and [parsing](https://loopback.io/doc/en/lb4/Parsing-requests.html).

<!--more-->

## Understand Request Body Parsing

LoopBack 4 provides the request parsing capability as an action of the sequence. The parsing action is responsible for processing the HTTP payload to prepare parameter values to invoke a controller method. The parameters are extracted from various parts of the HTTP request, such as path, query, headers, or body. Path, query, header parameters are usually for simple types while the body often contains business objects. Parsing request body is much more complex when it comes to allow content negotiations. There are two sides involved:

1. The API client sends an HTTP request with `Content-Type` header to indicate the media type of the request body. For example, the header can be `application/json`, `application/x-www-form-urlencoded`, `application/xml` or other ones. Respective HTTP payloads are shown below.

- json

  ```
  POST /echo-body HTTP/1.1
  ...
  Content-Type: application/json

  {"key": "value"}
  ```

- urlencoded

  ```
  POST /echo-body HTTP/1.1
  ...
  Content-Type: application/x-www-form-urlencoded

  key=value
  ```

- xml

  ```
  POST /echo-body HTTP/1.1
  ...
  Content-Type: application/x-www-form-urlencoded

  <key>value</key>
  ```

2. The controller method uses `@requestBody` decorator to describe the request body as a content of multiple media types with corresponding schemas. The following example illustrates that `echoBody` accepts three media types: `application/json`, `application/x-www-form-urlencoded`, or `application/xml`.

   ```ts
   class MyController {
     async echoBody(
       @requestBody({
         description: 'request object value',
         required: true,
         content: {
           'application/json': {
             schema: {type: 'object'},
           },
           'application/x-www-form-urlencoded': {
             schema: {type: 'object'},
           },
           'application/xml': {
             schema: {type: 'object'},
           },
         },
       })
       data: object,
     ): Promise<object> {
       return data;
     }
   }
   ```

The combination of media types sent by a client and accepted by a controller method creates many different possibilities. When LoopBack 4 was initially released, we only allowed `application/json`. As expected, our users immediately started to ask for other ones, such as `application/x-www-form-urlencoded` and `multipart/form-data`, so that they build APIs to support HTML form submission and file uploads.

## Add More Body Parsers

I took the [first stab](https://github.com/strongloop/loopback-next/pull/1838) to support `urlencoded` based on the [body](https://github.com/Raynos/body) module. We discovered the usage of `body` over [Express body parser middleware](https://github.com/expressjs/body-parser) was a technical debt as LoopBack 4 started without Express. As [we have embraced Express again](https://strongloop.com/strongblog/loopback4-improves-inbound-http-processing), it makes sense for us to switch to `body-parser` as it's much more aligned with Express and actively maintained.  

After switching to `body-parser`, I continued to add `text` and `raw` media types conditionally using `if...else` statements. The size and complexity of the code is growing and readability is deteriorating as we add more and more flavors of body parsing. It's time to refactor the code to make them clean again.

## Refactor Body Parsing

We first extracted the body related parsing code into its own class from `parser.ts`, which deals with both body parsing and http path/query/header parameters.

We then introduced a `BodyParser` interface to define the common methods to be fulfilled by individual body parsers for supported media types.

```ts
/**
 * Interface to be implemented by body parser extensions
 */
export interface BodyParser {
  /**
   * Name of the parser
   */
  name: string | symbol;
  /**
   * Indicate if the given media type is supported
   * @param mediaType Media type
   */
  supports(mediaType: string): boolean;
  /**
   * Parse the request body
   * @param request http request
   */
  parse(request: Request): Promise<RequestBody>;
}
```

[Built-in body parsers](https://github.com/strongloop/loopback-next/tree/master/packages/rest/src/body-parsers) are now implemented as separate classes in their own source files.

- index.ts (exporting body paring related artifacts)
- types.ts (common types)
- body-parser.ts (main body parsing class)

- body-parser.helpers.ts (common helper methods for built-in parsers)
- body-parser.json.ts (Express body-parser.json)
- body-parser.text.ts (Express body-parser.text)
- body-parser.urlencoded.ts (Express body-parser.urlencoded)
- body-parser.raw.ts (Express body-parser.raw)
- body-parser.stream.ts (A special parser to keep request as a stream)

The `RequestBodyParser` in `body-parser.ts` is the main entry point to handle request body parsing. It adopts a visitor pattern to pass control to registered body parsers if a given media type is supported.

Up to this point, we are happy again with the code base and the number of built-in body parsers that can handle majority of API needs. But it's still impossible to support a new media type without changing the `@loopback/rest` module. As a strong believer and advocate of extensibility, I was motivated to make body parsing extensible so that the parsing capability can be further extended seamlessly.

## Introduce the Extensibility

The case of body parsing extensibility is not uncommon and it's well fit into [the extension point/extension design pattern](https://wiki.eclipse.org/FAQ_What_are_extensions_and_extension_points%3F).

The `RequestBodyParser` is an `extension point` to provide body parsing functionality for LoopBack 4 REST APIs. It
receives a list of body parsers for various media types as `extensions`. Each body parser implements the `BodyParser` interface so that `RequestBodyParser` knows how to interact with them in a uniform way. Please note that `RequestBodyParser` does not have to know the registered body parsers ahead of time.

We utilize `@loopback/context` module to enable the extensibility and pluggability of body parsers as follows:

1. The `RequestBodyParser` accepts the list of body parsers via dependency injection.

   ```ts
   export class RequestBodyParser {
     readonly parsers: BodyParser[];

     constructor(
       @inject.tag(REQUEST_BODY_PARSER_TAG, {optional: true})
       parsers?: BodyParser[],
       @inject.context() private readonly ctx?: Context,
     ) {
       this.parsers = sortParsers(parsers || []);
       if (debug.enabled) {
         debug('Body parsers: ', this.parsers.map(p => p.name));
       }
     }
     // ...
   }
   ```

2. Each body parser is added a class to implement `BodyParser` interface.

   ```ts
   export class JsonBodyParser implements BodyParser {
     name = builtinParsers.json;
     private jsonParser: BodyParserMiddleware;

     constructor(
       @inject(RestBindings.REQUEST_BODY_PARSER_OPTIONS, {optional: true})
       options: RequestBodyParserOptions = {},
     ) {
       ...
     }

     supports(mediaType: string) {
       ...
     }

     async parse(request: Request): Promise<RequestBody> {
       ...
     }
   }
   ```

Optionally, the body parser can be injected with `RequestBodyParserOptions` to configure the extension itself.

3. Register a body parser by binding it to the context with `rest.RequestBodyParser` tag.

A body parser can be added at REST application or component level using APIs or bindings. For example:

   ```ts
   app.bodyParser(XmlBodyParser);
   ```

Or

   ```ts
   export class RestComponent implements Component {
     ...
     /**
     * Add built-in body parsers
     */
     bindings = [
       Binding.bind(RestBindings.REQUEST_BODY_PARSER)
         .toClass(RequestBodyParser)
         .inScope(BindingScope.SINGLETON),
       createBodyParserBinding(
         JsonBodyParser,
         RestBindings.REQUEST_BODY_PARSER_JSON,
       ),
       createBodyParserBinding(
         TextBodyParser,
         RestBindings.REQUEST_BODY_PARSER_TEXT,
       ),
       ...
     ];
     ...
   }
   ```

Please note that built-in body parsers shipped in `@loopback/rest` are also registered in the same way by `RestComponent`. They are invoked after other parsers by default.

## Customize Request Body Parsers

As we use `Context` to glue `RequestBodyParser` extension point with its extensions, it's easy to achieve the following tasks.

- Add a new body parser.
- Replace an existing body parser.
- Disable/remove an existing body parser.

See [Extending request body parsing](https://loopback.io/doc/en/lb4/Extending-request-body-parsing.html) for more details and examples.

In the [discussion](https://github.com/strongloop/loopback-next/issues/1873) of adding `multipart/form-data` media type, we realize that there is a need to give full control to controller methods, which might want to use a custom body parser or skip the body parsing. For example, a controller should be able to implement file upload using a npm module such as [`multer`](https://www.npmjs.com/package/multer) off the request stream. To allow such override, we introduced an `x-parser` extension to the OpenAPI spec for a given operation request body.

Check out [Parsing requests](https://loopback.io/doc/en/lb4/Parsing-requests.html#specify-custom-parser-by-controller-methods) and [File upload acceptance test](https://github.com/strongloop/loopback-next/tree/master/packages/rest/test/acceptance/file-upload) for more information.

## Summary

This blog is basically a recap of [Pull Request 1936](https://github.com/strongloop/loopback-next/pull/1936). We would like to share what we have learned to achieve full extensibility of request body parsing.

Moving forward, we are exploring the possibility to [generalize the extension point/extension pattern](https://github.com/strongloop/loopback-next/compare/extension-point) on top of `@loopback/context` and further simplify how to apply it to build other types of extensions. A near term task is to introduce [extensibility for response body serialization](https://github.com/strongloop/loopback-next/issues/436) so that we can write responses into HTTP based on the response spec and `Accept` header of API requests. Your feedback and contribution are welcome!

## Acknowledgement

I want to specially thank my co-worker [Miroslav Bajtoš](https://github.com/bajtos) for thoroughly reviewing the code and providing great feedbacks and suggestions to help shape the design and implementation. It has been a fantastic and constructive collaboration in the open. As always, we would like to invite all of you to chime in any time in the future!

## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Reporting issues](https://github.com/strongloop/loopback-next/issues).
- [Contributing](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md)
  code and documentation.
- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Joining](https://github.com/strongloop/loopback-next/issues/110) our user group.
