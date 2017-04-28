---
id: 15675
title: Getting Started with Node.js for the Rails Developer
date: 2014-08-07T07:38:11+00:00
author: Alex Gorbatchev
guid: http://strongloop.com/?p=15675
permalink: /strongblog/node-js-ruby-on-rails-getting-started/
categories:
  - Community
  - How-To
---
## **Introduction** 

In this article we are going to do a quick introduction to Node.js and [LoopBack](http://loopback.io/) for Ruby on Rails minded developers. What&#8217;s LoopBack? It&#8217;s an open source framework for easily developing APIs in Node and getting them connected to databases like MongoDB, MySQL, Oracle and SQL Server. We&#8217;ll cover installing Node, the [StrongLoop CLI](http://docs.strongloop.com/pages/viewpage.action?pageId=3834790), look at an example LoopBack application plus how to start out on your own. All the while drawing parallels between Node and Rails commands.

## **From Ruby to Node** 

You&#8217;ve likely heard in the past few months that some [big companies](http://strongloop.com/node-js/why-node/) are starting to deploy Node applications in production and at scale. Walmart is running their entire [mobile site](http://www.joyent.com/developers/videos/node-summit-walmart-save-money-use-node-js) on Node, which is currently the biggest Node application, traffic wise. eBay has been running a production Node [API service](http://www.ebaytechblog.com/2011/11/30/announcing-ql-io) since 2011. PayPal is [slowly rebuilding](https://www.paypal-engineering.com/2013/11/22/node-js-at-paypal/) their front-end in Node.

You are probably curious about Node and how to possibly make a transition from Ruby on Rails. There&#8217;s also something pretty damn cool about going through the whole day without constantly switching context between Ruby and JavaScript. The [MEAN](http://www.mean.io/) stack allows you to use JavaScript literally everywhere: server, database and client.

There aren&#8217;t that many frameworks that try to deliver Rails experience for Node. LoopBack by StrongLoop aims to be all encompassing solution, similar to Rails. Lets check it out, but first things first&#8230;

<!--more-->

## **Installing Node** 

There are many ways to install Node:

  1. Download [source or binaries](http://nodejs.org/download/) and install manually.
  2. `apt` or `brew` install.
  3. Using [Node Version Manager](https://github.com/creationix/nvm) (my preferred way).

Node has a version manager called [NVM](https://github.com/creationix/nvm) which is almost a feature for feature port of Ruby&#8217;s [RVM](https://rvm.io/) sans a cool web site. [NVM](https://github.com/creationix/nvm) is [RVM](https://rvm.io/) for Node.

[NVM](https://github.com/creationix/nvm) is a preferred way to get Node on your development machine for all the same reasons as [RVM](https://rvm.io/):

  1. Everything is kept neatly in your user home directory.
  2. You can easily have multiple versions at the same time.

In the interests of keep this article to the point, I&#8217;m going to refer you to the [NVM manual](https://github.com/creationix/nvm) for installation instructions (which are pretty much the same as [RVM](https://rvm.io/)).

## **Package Management In Node** 

Most of the concepts found in Ruby translate well to Node. Such is the case for package management and [NPM](https://www.npmjs.org/) is Node&#8217;s alternative to [GEM](https://rubygems.org/). [NPM](https://www.npmjs.org/) is [GEM](https://rubygems.org/) for Node. After you have setup Node and it&#8217;s in your system path, the `npm` command becomes available and you can have any of the 70k packages currently published installed with just one command:

    $ npm install [PACKAGE NAME]

One of the differentiating factors between [NPM](https://www.npmjs.org/) and [GEM](https://rubygems.org/) is that [NPM](https://www.npmjs.org/) installs all packages in the local `node_modules` folder by default, which means you don&#8217;t have to worry about handling multiple versions of the same package or accidental cross project pollution. [The modules folder](http://nodejs.org/api/modules.html) is a core Node concept that allows programs to load installed packages and I encourage your to [read and understand](http://nodejs.org/api/modules.html) the manual on this subject.

## **Package Manifest For Node** 

To help you manage project dependencies Node introduces `package.json` as a [core concept](http://nodejs.org/api/modules.html#modules_folders_as_modules). On the surface it works similar to `Gemfile` in Ruby and contains list modules that your project depends on. `package.json` is `Gemfile` for Node.

In reality, `package.json` is a [very powerful tool](https://www.npmjs.org/doc/json.html) that can be used to run hook script, publish author information, add custom settings and so on.

Because `package.json` is just a JSON file, any property that isn&#8217;t understood by Node or [NPM](https://www.npmjs.org/) is ignored and could be used for your own needs.

If you are in a folder with `package.json` and want to install all packages it lists, simply type:

    $ npm install

This is equivalent to `bundle install` in the Ruby world.

## **Installing StrongLoop API Server** 

Now that we have covered some basics, lets get started with LoopBack, the open source API framework powering StrongLoop API server.

    $ npm install -g strongloop

This will install the `slc` command into your global [NPM](https://www.npmjs.org/) folder, which, depending on the way you setup Node, would either be somewhere in `/usr/local` or in your home folder (another reason I prefer [NVM](https://github.com/creationix/nvm)). It also installs all the Loopback framework and Devops packages.

The `slc` tool is our gateway for all things StrongLoop. Think of it as `rails` command, just for Node. You&#8217;ll see why in a moment.

## **LoopBack Sample Application** 

    $ slc loopback:example
    $ [?] Enter a directory name where to create the project: SampleApp
    $ cd SampleApp
    $ slc run

This will generate and start an example app in the &#8220;Sample App&#8221; or any specified folder. It&#8217;s good to run and poke around it to get a sense for the new library because the sample app comes with batteries included:

  1. Example APIs to explore
  2. Sample data to play with
  3. Multiple data adapters (MongoDB, In-Memory, MySQL and OracleDB)
  4. API explorer with auto-generated API endpoint methods for  CRUD

Open up http://localhost:3000/explorer in a browser and

you should be seeing API explorer which comes in a pluggable, but completely separate [NPM](https://www.npmjs.org/) module called `loopback-explorer` ([github repository](https://github.com/strongloop/loopback-explorer)).

[<img class="aligncenter size-large wp-image-18998" alt="Loopback_explorer" src="{{site.url}}/blog-assets/2014/07/Loopback_explorer2-1030x395.png" width="1030" height="395"  />]({{site.url}}/blog-assets/2014/07/Loopback_explorer2.png)

[<img class="aligncenter size-large wp-image-18997" alt="Loopback_details" src="{{site.url}}/blog-assets/2014/07/Loopback_details1-1030x624.png" width="1030" height="624"  />]({{site.url}}/blog-assets/2014/07/Loopback_details1.png)

&nbsp;

&nbsp;

Check out [StrongLoop documentation](http://docs.strongloop.com/display/LB/LoopBack+example+app) for some additional details about the sample app.

## **New Project** 

Execute:

    $ slc loopback                                                            
    [?] Enter a directory name where to create the project: my-project
    [?] What's the name of your application? my-app 
    $ cd my-project 
    $ slc run

This will generate skeleton LoopBack application (hence `slc loopback`). This is equivalent to `rails new myapp`.

Lets look at what we have:

    $ find . -maxdepth 2
    .
    ./.editorconfig
    ./.jshintignore
    ./.jshintrc
    ./.npmignore
    ./client
    ./client/README.md
    ./node_modules
    ./node_modules/compression
    ./node_modules/errorhandler
    ./node_modules/loopback
    ./node_modules/loopback-boot
    ./node_modules/loopback-datasource-juggler
    ./node_modules/loopback-explorer
    ./node_modules/serve-favicon
    ./package.json
    ./server
    ./server/boot
    ./server/config.json
    ./server/datasources.json
    ./server/model-config.json
    ./server/server.js
    

`server.js` is our main file here where the whole application is set up. If you already have experience with [express.js](http://expressjs.com/) module, the file will look very familiar. There&#8217;s some LoopBack magic happens to help you get started faster following convention over configuration mantra that Rails users are accustomed to. There is a placeholder for a client Javascript application under /client

`datasources.json` stores the backend datasource settings while the `config.json` has the application host and port settings.

Models will be stored as .json files under `/common/models` and `model-config.json` retains the mapping of models to data-sources.

`node_modules` contains minimum dependencies you need to get your starter application to run.

## **Adding a Model** 

    $ slc loopback:model
    [?] Enter the model name: Person
    [?] Enter the data-source to attach Person to: db (memory)  // Hit enter to accept default
    [?] Expose Person via the REST API ? Yes
    [?] Custom plural form (used to build REST URL): People     //Hit enter to accept default 
    Lets add some Person properties now.
    Enter an empty property name when done.
    [?] Property name: Name                                    // Name the first property in the model
        invoke loopback:property
    [?] Property type: string                                  // Hit Enter to accept default type, string 
    [?] Required? No                                           // Hit Enter to accept default (not required)
    

This is a very simple interactive guide to define your model fields. After completing the prompts, a new model will be added to the `/common/models` models folder called `Person.json`

It&#8217;s worth noting that json files for models is just a default way to store models. In the `sample-app` generated earlier each model was defined manually with JavaScript for full control. Check out [model definition reference](http://docs.strongloop.com/display/DOC/Model+definition+reference) to get a sense for how models could be set up using LoopBack.

At this point you might be thinking that `slc loopback` command is similar to `rails generate` and it is, just not as elaborate at the moment.

## **Running Application** 

Previously we used `slc run` to start the sample application. However, your preferred way to start your application could simply be:

    $ node app.js

That&#8217;s really all to it, it&#8217;s that simple to get started. Check out [documentation](http://docs.strongloop.com/display/LB/Getting+Started+with+LoopBack) to get a details on how to expose the newly created model via the REST API and full details on working with [models](http://docs.strongloop.com/display/LB/Working+with+models) and [datasources](http://docs.strongloop.com/display/LB/Data+sources+and+connectors).

## What&#8217;s next?

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Check out two additional example apps written with Loopback : <a href="https://github.com/strongloop/loopback-example-access-control">Access Control</a> and <a href="https://github.com/ritch/loopback-foodme">FoodMe</a></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Don&#8217;t forget to check out the <a href="http://loopback.io/">LoopBack.io</a> project home page, <a href="http://docs.strongloop.com/display/LB/LoopBack+2.0">docs</a> and <a href="https://github.com/strongloop/loopback">GitHub</a> page.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Need <a href="http://strongloop.com/node-js-support/expertise/">training and certification</a> for Node? Learn more about both the private and open options StrongLoop offers.</span>
</li>