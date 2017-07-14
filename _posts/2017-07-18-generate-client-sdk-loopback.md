---
layout: post
title: Generating a Client SDK For LoopBack with the Bluemix CLI
date: 2017-07-18
author: 
- David Okun
permalink: /strongblog/generate-client-sdk-loopback
categories:
  - how-to
  - tutorial
  - code-generation

---

## Generating a Client SDK For LoopBack with the Bluemix CLI

If you're reading this post, it's entirely possible that you've been exposed to the goodness that is LoopBack. If not, I'd recommend checking [this] out to get a quick and easy start to generating RESTful APIs with LoopBack.

Having a RESTful API ready to go in such a short period of time is quite powerful, and it really takes a lot of time out of getting your backend up and running. But there's an important part of your application that LoopBack neglects - your frontend and your user interface.

***(extremely documentary voice)*** What if I told you that you could use a command line interface to generate (kind of a thing around here) a client SDK for any application you create in LoopBack?

Now that you've fallen out of your chair, get back in your seat and let's get cracking. You're going to love this.

### Setup

You'll need to have a few things installed first.

#### LoopBack

This should go without saying. Once you have Node.js and npm installed on your machine, go to your command line and type in `npm install -g loopback-cli`. This should give you all you need to start generating RESTful APIs for Node.js.

#### Bluemix CLI

Go to [this](https://console.bluemix.net/docs/cli/index.html#cli) website and install the appropriate CLI for your operating system. You don't *need* an account in Bluemix to use the CLI, but as an IBM employee I am legally mandated to inform you that signing up for a [Bluemix](https://console.ng.bluemix.net) account is a very good idea. If you do, you'll be able to manage your cloud applications with it, and you can find out more about that [here](https://clis.ng.bluemix.net/ui/home.html).

#### [Bluemix SDK Generation Plugin](https://console.bluemix.net/docs/cloudnative/sdk_cli.html#sdk-cli)

You have to have the Bluemix CLI installed first, but once you have it up and running, type `bx plugin install sdk-gen -r Bluemix` into your terminal, and let the plugin download and follow the resulting instructions. Your system should now be set up to do what it needs to do to generate a client SDK.

#### An API That Follows the OpenAPI Spec

All geerated LoopBack APIs adhere to the [OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification), which, for the purpose of this tutorial, means that you can represent the structure and capabilities of your API in a single .yml file. This also used to be called a "Swagger" file, but to be fair, you should feel pretty awesome being able to rep your API in a single file. For this tutorial, we'll use [this](https://github.com/StrongLoop-Evangelists/loopback-in-five) as an API to work with. You should be able to clone this git repo, and then run `npm install`.

If you've done all this, you should be ready to go.

### Exporting your API Definition

LoopBack has a super easy way to do this. First, navigate to the root directory of your API, and type in `lb export-api-def`. Don't be alarmed at the amount of text your terminal spits out - all your terminal has done is print out the generated specification file for your API. Since this file can be quite big, you can tell the top of the file by the first few lines if they look like this:

```
swagger: '2.0'
info:
  version: 1.0.0
  title: Loopback-in-five
basePath: /api
paths:
```

If you want to avoid the big copy and paste job, decide on a file name first (Let's go with AnimalAPIDefinition.yml) and type in `lb export-api-def --o AnimalAPIDefinition.yml`. The `--o` tag specifies where the output information should go to. For more information on working with Swagger documentation in LoopBack, read my friend [Raymond Camden's](https://twitter.com/raymondcamden) [post](https://strongloop.com/strongblog/generating-swagger-openapi-specification-from-your-loopback-application/) on it.

### Generating the SDK

Ok, brace yourself. Stay in the root directory of your API, and, if you've followed the previous steps to a T, type `bx sdk generate --js -f ./AnimalAPIDefinition.yml` into your terminal. Let the CLI do its thing, and when you're done, you should have a .zip file in your directory titled `AnimalAPIDefinition.zip`.

Before we dive into the contents of that folder, let's look at the command you just typed, and what some of your options are. The `bx sdk generate` command will always be the same regardless of your choices, but you likely noticed the `--js` flag right after. This means we will be generating a JavaScript SDK for the API. You aren't limited to JavaScript though! You can make a Swift (`--ios`), Java/Android (`--android`), or even a GoLang (`--go`) SDK for any API that follows the OpenAPI spec. I love writing web service code, but you know what I like even more than that? Having web service code written for me.

After that, you notice the `-f` flag. This indicates that you are generating an SDK based on a local spec file. You could instead choose to specify an app in your space with the `-a` flag. You can also use an API that is hosted somewhere with a URL, locally with `-l` or on the internet with `-r`. This means if you see an API somewhere in the wild, and you know the URL for it's OpenAPI Specification document, then congratulations - you got yourself an SDK to connect with it!

### What you made

The generated output is super clean. Each type of SDK has it's own way of being implemented, which I'll leave to you to figure out, but let's take a look at the contents of the .zip folder.

![](http://i.imgur.com/SOQa20q.png)

This basically creates a ready-made npm module for you. Here's what your package.json file looks like:

```
{
    "name": "loopback_in_five",
    "version": "1.0.0",
    "description": "ERROR_UNKNOWN",
    "license": "Unlicense",
    "main": "src/animalapidefinition/index.js",
    "scripts": {
        "test": "./node_modules/mocha/bin/mocha --recursive"
    },
    "dependencies": {
        "superagent": "3.5.2",
        "nconf": "~0.8.4"
    },
    "devDependencies": {
        "mocha": "~2.3.4",
        "sinon": "1.17.3",
        "expect.js": "~0.3.1"
    }
}
```

You even have a way to test it, built-in! Feel free to browse the source code, but what you'll want to check out is the documentation, which is chock full of really useful instructions on how to use your API. Start at the `README.md` file for a really nice table of contents, and a GitHub-ready install guide:

![](http://i.imgur.com/pHKUQh1.png)

Go through all the pages so you can see how to get the most out of your newest SDK. Last, but certainly not least, you want to open up your `AnimalAPIDefinitionConfig.json` file, and look at its contents:

```
{
    "loopback_in_fiveHost": "https://localhost/api"
}
```

Scant on details, but this is important. Whenever you make use of your API, you only have to list the host URL for your LoopBack API here, and your SDK will simply work with it. This even works if you are testing on your local machine!

### What Next?

Imagine being able to take this command and fit it into your Continuous Delivery  pipeline, and being able to walk up to the frontend devs on your team and say, "Don't worry, y'all, I got this." Imagine that, with every build, your team gets an updated SDK deployed into their workspace, and they never have to iterate web service code again. I believe in this world, and now you have the tools you need to make this happen! Make sure to follow me on Twitter [here](https://twitter.com/dokun24) to find out more neat tips and tricks.