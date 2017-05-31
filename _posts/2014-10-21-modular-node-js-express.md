---
id: 20627
title: Writing Modular Node.js Projects for Express and Beyond
date: 2014-10-21T08:00:25+00:00
author: Marc Harter
guid: http://strongloop.com/?p=20627
permalink: /strongblog/modular-node-js-express/
categories:
  - Community
  - Express
  - How-To
---
I have worked with Express for over four years now and I cannot count how many different ways I have reorganized my code! Express bills itself as an _un_-opinionated framework. This is true. If you search for “express boilerplate” you will find a **lot** of different ways to organize your project.

In my experience, there isn’t “one best way” to structure a project. If you are looking for that, you probably won’t find it. That’s not to say there aren’t things that work better than others.

In this article, I propose a minimal and flexible pattern that I think works well for projects that are larger or have the potential for growth. The original ideas stem from earlier work done by [TJ Holowaychuk](https://www.youtube.com/watch?v=Nh5P_nZEvPA). As you read through the explanation and implementation, note the discussion really has little to do with Express directly and applies to any large Node project.

## Modularizing the code base

It’s hard to anticipate how a code base will grow and change. An application needs the flexibility to adapt and enough isolation between components to enable code reuse and lessen cognitive overhead.

A modular structure understands that you _won’t_ have complete isolation between the components. There will be overlap and that’s OK and sensible[[1]](#footnote1 "see footnote"). A modular structure then:

  1. Enables an application to be separated into smaller components.
  2. Permits components to have their own dependencies (and tests) that can be updated with minimum to no effects on other components.
  3. Allows project-wide dependencies that can be shared (or overwritten) by individual components.
  4. Makes requiring components first-class. In other words, does not use relative `require` statements.
  5. Empowers an application to grow (or shrink) without a lot of reshuffling.

The Node mantra of small npm modules is carried over then into small components.

<!--more-->

## The minimal modular structure

Here is a base structure that is as minimal and un-opinionated as I could make it:

    bin
    lib
    package.json
    index.js
    

Let’s break down the intent of each item:

  1. _bin_: anything that doesn’t fit nicely inside of an npm script (e.g. hooks, ci, etc)
  2. _lib_: the components of the application
  3. _package.json_: project-wide dependencies and npm scripts
  4. _index.js_: initializes the application

We will touch on each of these pieces as we continue.

## Adding components

A component is any aspect of a project that can stand alone. For example, one component could be dedicated to scheduling cron tasks, another to sending emails, and another to an export tool. In terms of data, you could have one component dedicated to all your models or a separate component for each model[[2]](#footnote2 "see footnote").

We then add our components to the _lib_ directory:

    lib
     |- app
       |- index.js
       |- package.json
     |- logger
     |- config
     |- models
    

Each of these components has an entry point (typically _index.js_) and may have its own `package.json` (`npm init -y`) if dependencies or local npm scripts are required.

In this example, my _app_ component needs Express, so I `npm install --save express` in that directory. In the _logger_ directory, I install my favorite logging module, configure it how I want and only expose what the other components will need. The `config` directory, in this case, contains environment-specific project configuration that most other components use. Of course, these are sample components I typically have, you may have a completely different set.

### Making components first-class

Components should be first-class in your application, meaning they are easily accessible anywhere. Therefore, you should never have to calculate relative paths to use them:

    var logger = require('../../../logger')
    

Herein lies a simple trick that works on UNIX and Windows. Add a symbolic link to the project’s `node_modules` folder[[3]](#footnote3 "see footnote"). In UNIX, this is:

    cd {project_root}/node_modules
    ln -s ../lib _
    

In Windows, it is:

    cd {project_root}/node_modules
    mklink /D _ ..\lib
    

In this example, I’m calling the link a minimal `_` (you can call it whatever). Now, I can require components like this anywhere in my project:

    var log = require('_/logger')
    

### Sharing dependencies

This structure also allows you to share dependencies whenever it makes sense. For example, say you use `lodash` in a lot of your components. Just `npm install --save lodash` at the project root and it will be available to all components.

Although you can mix and match whatever makes sense, I typically keep most if not all dependencies local to each component. This makes it easier and safer to update a component at a time. It also is easier to break out a module and publish it for reuse in more than one project.

Utility tools that are typically used project-wide, I keep in the project root. This includes tools like `nodemon` and `eslint`.

## Easy setup

The separation of components is nice, but it would be a pain to go into every component and `npm install` when, for instance, another developer is setting up the project. To streamline this, add a little `preinstall.js` script to the _bin_ directory. This script simply visits every component and runs `npm install`:

    var fs = require('fs')
    var resolve = require('path').resolve
    var join = require('path').join
    var cp = require('child_process')
    
    // get library path
    var lib = resolve(__dirname, '../lib/')
    
    fs.readdirSync(lib)
      .forEach(function (mod) {
        var modPath = join(lib, mod)
    
        // ensure path has package.json
        if (!fs.existsSync(join(modPath, 'package.json'))) return
    
        // install folder
        cp.spawn('npm', ['i'], { env: process.env, cwd: modPath, stdio: 'inherit' })
      })
    

Then, add it to your main `package.json` file in the `scripts` section:

    "scripts": {
        "preinstall": "node bin/preinstall",
        ...
    }
    

Now, when we run `npm install` in the project root, all the components’ dependencies also get installed[[4]](#footnote4 "see footnote").

## Tests

A modular structure allows you to put tests either in each component:

    lib
     |- app
      |- test
      |- package.json
      |- index.js
    

Or in the project root:

    lib
    test
     |- app
    

Depending how you have your test runner set up, one may make more sense than another. You can also do both. My preference as of late has been keeping tests local to components in order to develop components easier in isolation.

## A starting point

We haven’t talked about _index.js_ yet. This one is simple. It initializes the application. In this example, the _app_ component is the main entry point so _index.js_ is simply:

    var cfg = require('_/config')
    require('_/app').listen(cfg.port)
    

Sometimes, the main app setup isn’t just listening on a port – you may also want to schedule some cron tasks, log that the server has started, etc. You can do that all in _index.js_.

## A full picture

If you are itching to see a full running example, I have [an Express project up on GitHub](https://github.com/strongloop-community/express-example-modular) demonstrating this modular structure.

<li id="footnote1">
  However, <em>when</em> it makes sense, breaking components into their own published packages has the added benefit of reusing code between projects. <a class="reversefootnote" title="return to article" href="#footref1"> ↩</a>
</li>
<li id="footnote2">
  When working with ODM/ORM tools like Mongoose or Sequelize, I find having one <em>models</em> directory works nice. <a class="reversefootnote" title="return to article" href="#footref2"> ↩</a>
</li>
<li id="footnote3">
  Another technique for making components first class is setting the NODE_PATH environment variable to be the path of the <em>lib</em> directory. I find using symlinks preferable through as you never have to set the path when executing any file or starting your app and it allows you to have a component and an npm package with the same name. For example, I can have a customized <code>_/redis</code> module which depends on the <code>redis</code> npm package. <a class="reversefootnote" title="return to article" href="#footref3"> ↩</a>
</li>
<li id="footnote4">
  Setting up other scripts is trivial. For updating, just change <code>npm.commands.install</code> to <code>npm.commands.update</code>. Want to check if anything is outdated, just switch it to <code>npm.commands.outdated</code>. See <a href="https://www.npmjs.org/doc/api/npm.html">npm api</a> for more details. <a class="reversefootnote" title="return to article" href="#footref4"> ↩</a> 
   
## What’s next?

- Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js LoopBack framework. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
   
