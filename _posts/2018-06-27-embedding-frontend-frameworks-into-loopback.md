---
layout: post
title: Embedding Frontend Frameworks into LoopBack
date: 2018-06-27T00:00:00+00:00
author: Ivan Dovgan
permalink: /strongblog/embeddding-frontend-frameworks-into-loopback
categories:
  - How-To
  - LoopBack
---

When working with LoopBack, there are many choices for frontend frameworks, however only some of the popular frontend frameworks have associated [LoopBack client SDKs](https://loopback.io/doc/en/lb3/Client-SDKs.html). In many cases, it may make sense to de-couple the frontend application from LoopBack and serve it on a standalone HTTP server. This approach allows the frontend to scale separately from the LoopBack backend API. However, there are other scenarios, where embedding the frontend framework into the LoopBack framework may be advantageous, for example [Server Side Rendering](https://ssr.vuejs.org/) or simplifying your development workflows for smaller projects that do not need individual scaling. 

In this post, we will explore how to easily embed a frontend framework into LoopBack and setup proper development and production environments. This post will be embedding [Vue.js](https://vuejs.org/), but the overall strategy can be used with any other frontend framework.

**TLDR** There's pros and cons to embedding a frontend framework into LoopBack. This post shows you how to do it. If you just want a working example, look at my [loopback-vue-starter](https://github.com/ivandov/loopback-vue-starter).

## Initializing the LoopBack API Framework
To get started, we first need to construct the LoopBack base application. With the loopback CLI tools, this is extremely easy. Start by installing, or updating, your existing [`loopback-cli`](https://www.npmjs.com/package/loopback-cli)

```
npm install -g loopback-cli
```

Once `loopback-cli` is installed, we can use the `lb` command to scaffold our LoopBack application as required. In this case, we will be scaffolding an "empty" API server, but the same steps can be followed to create a LoopBack framework that already has authentication baked in.

```
lb
? What's the name of your application? loopback-vue-starter
? Enter name of the directory to contain the project: loopback-vue-starter
   create loopback-vue-starter/
     info change the working directory to loopback-vue-starter

? Which version of LoopBack would you like to use? 3.x (current)
? What kind of application do you have in mind? empty-server (An empty LoopBack API, without any configured models or datasources)
```

Once everything is installed, run the following commands and the LoopBack API Explorer is now online at [localhost:3000/explorer](http://localhost:3000/explorer/)

```
cd loopback-vue-starter 
node .
```

That's it for now, later we'll need to make a few changes for functionality with our frontend framework, Vue.js.

## Initializing the Vue.js Frontend Framework
The LoopBack framework gives us a `client` directory where we can our frontend framework. However, if using [`vue-cli`](https://cli.vuejs.org/) to create your project, this will setup its own directory structure. This will leave you with duplicate `node_modules` directories and `package.json` files describing your Vue project.

This section is a walkthrough on how to solve the redundant `node` project files.

First create a new Vue project using the [`vue-cli`](https://cli.vuejs.org/). 

```
npm install -g @vue/cli
vue create client
```

Using a project name of `client` will cause the `loopback-vue-starter/client` folder to be overwritten or merged with the new Vue UI's framework code. For the sake of this tutorial, I chose to Merge the folders. Afterwards, you can enable whatever features you think you'll need in your frontend. 

```
Vue CLI v3.0.0-rc.3
? Please pick a preset: Manually select features
? Check the features needed for your project:
 ◯ Babel
 ◯ TypeScript
 ◯ Progressive Web App (PWA) Support
❯◉ Router
 ◯ Vuex
 ◯ CSS Pre-processors
 ◯ Linter / Formatter
 ◯ Unit Testing
 ◯ E2E Testing
```

The [loopback-vue-starter](https://github.com/ivandov/loopback-vue-starter) on Github only used the Vue Router feature, but you can enable any that you find necessary.

Once the installation is complete, you can run the following commands to launch your Vue.js frontend at [localhost:8080](http://localhost:8080)

```
cd client
npm run serve
```

## Integrating the Vue.js frontend with the LoopBack API framework
If you made it this far, you now have the LoopBack API framework and the Vue.js frontend framework running as two separate processes. This section will guide you through integrating them and creating proper development and production environments.

The first thing we want to do is merge the `package.json` information from the Vue.js `client` folder back up to the main LoopBack project folder. At a minimum, you must copy the `dependencies` and `devDependencies` and insert them into the LoopBack project's `package.json`. You may also choose to move the `scripts` over to the main LoopBack `package.json`

```
"scripts": {
  "serve": "vue-cli-service serve",
  "build": "vue-cli-service build"
},
"dependencies": {
  "vue": "^2.5.16",
  "vue-router": "^3.0.1"
},
"devDependencies": {
  "@vue/cli-service": "^3.0.0-beta.15",
  "vue-template-compiler": "^2.5.16"
},
```

The packages seen here may be different depending on the features that were enabled through the Vue CLI, but the process is the same, just copy and append them to the LoopBack project's `package.json`.

When complete, you can do a little cleanup from the LoopBack project's main folder. 

```
cd client
rm -rf node_modules/ package.json package-lock.json
```

Then make sure to install the new dependencies that have been added to the LoopBack project's `package.json`.

```
cd ..
npm install
```

There's only two things left to do:
1. Update the LoopBack `server/boot/root.js` to disable the root route, and enable static file hosting. 
1. Modify the `scripts` in the LoopBack project's `package.json` to start both the LoopBack server and Vue.js framework.


The first item has been extensively documented by the LoopBack team and can be done using the [documentation](https://loopback.io/doc/en/lb3/Add-a-static-web-page.html).

The second item can be done in many different ways depending on your project's needs. In the [loopback-vue-starter](https://github.com/ivandov/loopback-vue-starter) the development mode starts LoopBack using [nodemon](https://www.npmjs.com/package/nodemon) and starts the Vue UI with hot-reload as parallel separate processes. For production mode, the [loopback-vue-starter](https://github.com/ivandov/loopback-vue-starter) runs a script to build the Vue.js application into a `client/dist` folder and the LoopBack server is setup to automatically serve static files from that directory.

## Wrapping Up
This guide has shown you how to embed the [Vue.js](https://vuejs.org/) frontend framework into the LoopBack application scaffolding from scratch. This same process can be followed for any frontend framework that is packaged through `npm` or gets packed into static files. This can be useful when using frameworks that are not supported through [LoopBack client SDKs](https://loopback.io/doc/en/lb3/Client-SDKs.html). 
