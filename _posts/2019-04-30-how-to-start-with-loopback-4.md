---
layout: post
title: How to Start with LoopBack 4
date: 2019-04-30
author: Dave Whiteley
permalink: /strongblog/how-to-start-with-loopback-4/
categories:
  - LoopBack
  - How-To
published: false  
---

It's been a few months since we launched LoopBack 4, a completely redesigned iteration of the framework. Our community has been very supportive in regards to reporting issues, contributing code and documentation, and opening pull requests to help improve LB4. That said, some API developers are still looking for the most effective ways to get started with LoopBack 4. With that in mind, we decided to revisit the "[Get Started](https://loopback.io/doc/en/lb4/Getting-started.html#install-loopback-4-cli)" section of the LoopBack 4 homepage to walk people through beginning their journey.

<!--more-->

## Before You Get Started, Part One

You may be wondering if you want to utilize LoopBack 4. Perhaps you are already using LoopBack 2 or 3 and youaren't cretain you wantto change. Luckily, Diana Lau and Miroslav Bajtoš addressed this in their recent post, ["LoopBack 3 Receives Extended Long Term Support"](https://strongloop.com/strongblog/lb3-extended-lts/). We'll quote them below.

LoopBack 2. "If you’re a LoopBack 2 user, you should at least migrate your LoopBack 2 applications to LoopBack 3. The effort should be minimal and the process should be smooth. You can read more details in the [3.0 migration guide](https://loopback.io/doc/en/lb3/Migrating-to-3.0.html)." Note, howvere, that LB2 goes end of life (EOL) April, 2019.

LoopBack 3. "If you already have LoopBack 3 applications running in production, it is a good time for you to [review the difference between LoopBack 3 and LoopBack 4](html). Even with the extended end-of-life date for LoopBack 3, it is never too early to start migrating your LoopBack 3 application to LoopBack 4."

## Before You Get Started, Part Two

Let's assume you've considered the above and are ready to move to LB4. Or perhaps you are starting fresh, with no prior LoopBack experience or project. Before you install LoopBack 4, ensure that you have Node.js (version 8.9 or higher) installed on your machine. You can download it [here](https://nodejs.org/en/download/).

## Next: Install LoopBack 4 CLI

Now that you have installed Node.js, let's install LoopBack 4. We've made it fast and easy with the LoopBack 4 CLI. This command-line interface generates the basic code to scaffold a project or an extension. 

You can install the latest version of the LoopBack 4 CLI globally by running:

```
npm i -g @loopback/cli
```

Install Latest Version of LoopBack 4 CLI

npm i -g @loopback/cli

--
lb4 -v should show @loopback/cli version: 0.17.0 (or newer).

--


Create a new project

The CLI tool will scaffold the project, configure the TypeScript compiler, and install all the required dependencies. To create a new project, run the CLI as follows and answer the prompts.

lb4 app

Answer the prompts as follows:

? Project name: getting-started
? Project description: Getting started tutorial
? Project root directory: (getting-started)
? Application class name: StarterApplication
? Select features to enable in the project:
❯◉ Enable tslint: add a linter with pre-configured lint rules
 ◉ Enable prettier: install prettier to format code conforming to rules
 ◉ Enable mocha: install mocha to run tests
 ◉ Enable loopbackBuild: use @loopback/build helpers (e.g. lb-tslint)
 ◉ Enable vscode: add VSCode config files
 ◉ Enable docker: include Dockerfile and .dockerignore
 ◉ Enable repositories: include repository imports and RepositoryMixin
 ◉ Enable services: include service-proxy imports and ServiceMixin

Starting the project

The project comes with a “ping” route to test the project. Let’s try it out by running the project.

cd getting-started
npm start

In a browser, visit http://127.0.0.1:3000/ping.
Adding your own controller

Now that we have a basic project created, it’s time to add our own controller. Let’s add a simple “Hello World” controller as follows:

lb4 controller

    Note: If your application is still running, press CTRL+C to stop it before calling the command

    Answer the prompts as follows:

    ? Controller class name: hello
    ? What kind of controller would you like to generate? Empty Controller
      create src/controllers/hello.controller.ts
      update src/controllers/index.ts

    Controller hello was now created in src/controllers/

    Paste the following contents into the file /src/controllers/hello.controller.ts:

    import {get} from '@loopback/rest';

    export class HelloController {
      @get('/hello')
      hello(): string {
        return 'Hello world!';
      }
    }

    Start the application using npm start.

    Visit http://127.0.0.1:3000/hello to see Hello world!

Code sample

You can view the generated code for this example at: hello-world


---


## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Reporting issues](https://github.com/strongloop/loopback-next/issues).
- [Contributing](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md)
  code and documentation.
- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Joining](https://github.com/strongloop/loopback-next/issues/110) our user group.

