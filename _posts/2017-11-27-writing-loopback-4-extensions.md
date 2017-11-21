---
title: Writing LoopBack 4 Extensions
date: 2017-11-27T02:00:13+00:00
author: Taranveer Virk
permalink: /strongblog/writing-loopback-4-extensions/
categories:
  - Community
  - LoopBack
  - How-To
---

The **Developer Preview #1** release is primarily targeted at extension developers. With this preview release, extension developers can start writing extensions for LoopBack 4. With LoopBack 4 being a complete rewrite from the ground up, extensibility was a key focus on the architecture. This better extensibility of the framework was achieved via [@loopback/context](https://github.com/strongloop/loopback-next/tree/master/packages/context) which implements an [Inversion of Control](http://loopback.io/doc/en/lb4/Context.html) container and [Dependency Injection](http://loopback.io/doc/en/lb4/Dependency-injection.html).

LoopBack 4 extensibility makes writing extensions simpler than ever before. In this blog post, we'll be going over writing an example log extension and seeing how easy it is to do so.

<!--more-->

## Log Extension Usage Scenario
Before we jump into writing an extension, let's talk about what we're going to build and why. A log extension provides a mechanism to debug a REST Application's [Controller](http://loopback.io/doc/en/lb4/Controllers.html) methods by logging the inputs and the output produced. Below are the requirements for the log extension:
- Log information to the `console`. *Note: A more complex version would store logs in a file / database.*
- Mark Controller methods to be logged and the level at or above which they should be logged using a [Decorator](http://loopback.io/doc/en/lb4/Decorators.html).
- Set an application wide log level by binding it to our given key. *Note: We'll provide a default as well as a Mixin to make it easier to specify the binding.*
- A sequence action [Provider](http://loopback.io/doc/en/lb4/Creating-components.html#providers) that can be added to a sequence (this is what does the actual logging).
- Support the following log levels, each higher than the previous: DEBUG < INFO < WARN < ERROR < OFF
- An optional timer that can be used to time a request.
- Package the extension in an easy to use [Component](http://loopback.io/doc/en/lb4/Using-components.html)

## Getting Started
Writing a LoopBcak 4 extension is easy as there is a CLI tool to help create an extension project scaffolding. Install the CLI by running `npm i -g @loopback/cli`. Create an extension project by running `lb4 extension` and answering the prompts.

This post covers the high-level thinking process for writing an extension. A more technical tutorial is available [here: loopback4-example-log-extension](https://github.com/strongloop/loopback4-example-log-extension).

### Keys
When writing an extension, you need a namespace for your keys! For this extension we'll be using `example.log.*`. See implementation [here: keys.ts](https://github.com/strongloop/loopback4-example-log-extension/blob/master/src/keys.ts).

### Decorator
We want extension users to be able to select the Controller method they want to log as well as the level at which it should be logged. This can be accomplished through a decorator in LoopBack 4. Users will be able to mark their Controller method with `@log()` decorator OR `@log(logLevel: number)`. If a user doesn't specify the `logLevel`, the default of `WARN` will be used. See implementation [here: log.decorator.ts](https://github.com/strongloop/loopback4-example-log-extension/blob/master/src/decorators/log.decorator.ts).

### Mixin
As part of our usage scenario, we want a user to be able to define the application-wide log level by binding a value to `example.log.level`. While it's simple enough to do this binding, a Mixin can enable a better user experience. A Mixin allows a user to set the application wide log level by passing it into `ApplicationOptions` or via a "sugar" method `app.logLevel(level: number)`. See implementation [here: log-level.mixin.ts](https://github.com/strongloop/loopback4-example-log-extension/blob/master/src/mixins/log-level.mixin.ts).

### Providers
Providers enable most of the magic for an extension. For log extension, a few different providers will be needed based on the above usage. 
- A Provider to set a default value for the application wide log level binding key as shown [here: log-level.provider.ts](https://github.com/strongloop/loopback4-example-log-extension/blob/master/src/providers/log-level.provider.ts).
- A Provider for a sequence action that does the actual logging for decorated Controller methods based on their log level. This action also allows the user to optionally start the timer (implemented below). Implementation shown [here: log-action.provider.ts](https://github.com/strongloop/loopback4-example-log-extension/blob/master/src/providers/log-action.provider.ts).
- A Provider for a timing function that can optionally be used to time the sequence for a response as shown [here: timer.provider.ts](https://github.com/strongloop/loopback4-example-log-extension/blob/master/src/providers/timer.provider.ts).

### Component
A component packages the extension so LoopBack 4 can automatically bind the providers to their respective keys. A user may override the key by binding a new value to it. Implementation shown [here: component.ts](https://github.com/strongloop/loopback4-example-log-extension/blob/master/src/component.ts).

**That's it!** Writing a complex extension can be easy with LoopBack 4 by breaking it across multiple extension artifacts as we did for the log extension above.

## Next Steps
Writing extensions for LoopBack 4 is easy! Help is available for you if you want to write your own extensions and you'll get recognized for it. Find all the details in our previous post [Calling for Contributors on LoopBack Extensions](https://strongloop.com/strongblog/calling-contributors-loopback-extensions/).

Some additional resources to get started with writing your own extension:
#### Documentation
- [Extending LoopBack 4](http://loopback.io/doc/en/lb4/Extending-LoopBack-4.html) documentation
- [LoopBack 4 Key Concepts](http://loopback.io/doc/en/lb4/Concepts.html)

#### Examples
- [loopback4-extension-starter](https://github.com/strongloop/loopback4-extension-starter) shows you working examples of various extension artifacts
- [@loopback/authenticate](https://github.com/strongloop/loopback-next/tree/master/packages/authentication) is a proof of concept authentication extension
- [@loopback/rest](https://github.com/strongloop/loopback-next/tree/master/packages/rest) is a `Server` extension which implements HTTP/REST

Looking forward to the awesome extensions that will be created for LoopBack 4!
