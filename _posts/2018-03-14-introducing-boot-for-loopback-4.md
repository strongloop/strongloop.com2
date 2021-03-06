---
layout: post
title: Introducing @loopback/boot for LoopBack 4
date: 2018-03-14T00:00:13+00:00
author: Taranveer Virk
permalink: /strongblog/introducing-boot-for-loopback-4/
categories:
  - Community
  - LoopBack
---

A [LoopBack 4](https://strongloop.com/strongblog/announcing-loopback-next/) Application is made up of many different artifacts such as controllers, repositories, models, datasources, and so on. LoopBack 4 uses [Dependency Injection](http://loopback.io/doc/en/lb4/Dependency-injection.html) to resolve dependencies on related models so your application can work as expected. To leverage Dependency Injection, we must bind these artifacts to the application context.

A large application can have tens or hundreds of such artifacts. It gets very tedious to bind artifacts that many times.

```ts
class MyApp extends RestApplication {
  constructor() {
    super();
    this.controller(UserController); // Ok
    this.controller(CartController); // Ok
    this.controller(AdminController); // Another one
    this.repository(UserRepository); // Yet another one, so tedious
    this.repository(ProductRepository); // Tedious, ... many more to go
  }
}
```

<!--more-->

Enter `@loopback/boot`, one of the newest LoopBack 4 packages. **Boot** is a convention-based bootstrapper that automatically discovers artifacts and binds them to your Application's Context. This reduces the amount of manual effort
required to bind artifacts for dependency injection at scale.

## New Projects

All new projects scaffolded using `@loopback/cli`'s `lb4 app` command are configured to use this package with the conventions implemented by the CLI and recommended by the team. Artifacts generated by `lb4` commands also follow these
conventions. The recommended conventions are to have artifacts in their own folder (plural of the type of artifact) and files within the artifact folder should have names ending with the artifact type as the suffix. Examples:

* `/controllers/login.controller.ts`
* `/models/user.model.ts`
* `/repositories/product.repository.ts`

Currently, only [Controller](http://loopback.io/doc/en/lb4/Controllers.html) and [Repository](http://loopback.io/doc/en/lb4/Repositories.html) type artifacts are booted. Other types of artifacts such as Models, DataSources, etc. will be added as we move towards release. You can also extend LoopBack 4 by [writing a custom Booter](http://loopback.io/doc/en/lb4/Booting-an-Application.html#custom-booters) and registering it with the Bootstrapper using `app.booters(MyCustomBooter)`.

## Existing Projects

If you already have an existing LoopBack 4 project, you can add support for `@loopback/boot` as follows:

1.  Install the package by running `npm i @loopback/boot`
2.  Add `BootMixin` to you Application. _NOTE: You need to import `Booter` and `Binding` types_
3.  Set the `projectRoot`. All artifacts are resolved relative to this path
4.  Set your project conventions in the Application property `bootOptions`
5.  Boot the Application by calling `boot()` before `start()`.

```ts
import { Application } from "@loopback/core";
import { BootMixin, Booter, Binding } from "@loopback/boot";

class MyApplication extends BootMixin(Application) {
  constructor() {
    super();
    this.projectRoot = __dirname;
    // Configure Boot Conventions for each Artifact
    this.bootOptions = {
      controllers: {
        dirs: ["controllers"],
        extensions: [".controller.js"],
        nested: true
      },
      repositories: {
        dirs: ["repositories"],
        extensions: [".repository.js"],
        nested: true
      }
    };
  }
}

async function main() {
  const myApp = new MyApplication();
  try {
    await myApp.boot();
    await myApp.start();
  } catch (err) {
    console.log(err);
  }
}
```

## Architecture

As with most things in LoopBack 4, this component was designed with extensibility in mind. `@loopback/boot` not only binds artifacts but lays the foundation for declarative, convention based support. Booting is a multiple-step process to collect metadata for artifacts, resolve cross references, and create representation as bindings in the context to build up your Application.

`@loopback/boot` has a Bootstrapper which acts as an extension point for extension developers. Extensions can provide leverage the boot process by writing a class implementing the [Booter](http://loopback.io/doc/en/lb4/Booting-an-Application.html#booters) interface and packaging it as part of their Component. When the Application boots, the bootstrapper allows Booters to participate in each step (known as a phase) of the boot process. After a phase is completed by all registered Booters, the next phase is called. There are currently three phases: configure, discover, load. More phases may be added in the future.

Extension developers can learn more about writing a custom booter [here](http://loopback.io/doc/en/lb4/Booting-an-Application.html#custom-booters). A custom booter may be registered by a Component or an Application using the `BootMixin` by calling `app.booter(MyCustomBooter)`. The diagram below provides a general outline of the boot process.

<img src="https://strongloop.com/blog-assets/2018/03/boot-process.png" alt="@loopback/boot Bootstrapping process" style="width: 500px; margin:auto;"/>

## Additional Resources

You can learn more about Boot by visiting the following resources:

* [LoopBack 4 Docs: Booting an Application](http://loopback.io/doc/en/lb4/Booting-an-Application.html)
* [@loopback/boot README](https://github.com/strongloop/loopback-next/blob/master/packages/boot/README.md)

## Call for Action

LoopBack's future success counts on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

* [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
* [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
* [Reporting issues](https://github.com/strongloop/loopback-next/issues)
* [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
* [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)
