---
id: 19777
title: Best Practices for Deploying Node.js in Production
date: 2014-09-04T07:35:33+00:00
author: Sam Roberts
guid: http://strongloop.com/?p=19777
permalink: /strongblog/node-js-deploy-production-best-practice/
categories:
  - How-To
  - Node DevOps
---
One of the struggles developers face when moving to Node.js is the lack of best practices for automated deployment of Node applications. The challenges are many-fold &#8211; packaging and dependency management, single step deploy, and start/re-start without bringing down the house!

While best practices for Node application deployment are starting to develop, tool support for these practices are still poor, and get worse the further you get from developer workstations. StrongLoop’s customers regularly ask for recommendations on how they should deploy, and until now we haven’t had good answers for them when it comes to tool supported workflows.

There are tools out there, but they are often not composable, are incomplete, or we just don’t agree with how they do things. In this blog, I will talk about what problems these tools solve, why some existing solutions do not work well, and the modular tooling StrongLoop is creating to solve these problems. In particular, we’ve released [`strong-build`](http://docs.strongloop.com/display/NODE/slc+build), to package your application for deployment, and [`strong-deploy`](http://docs.strongloop.com/display/NODE/slc+deploy) to push your application packages to [`strong-pm`](http://strong-pm.io/), the process manager that will manage your deployed applications.
<!--more-->
All wrapped within [`slc`](http://docs.strongloop.com/display/NODE/Command-line+reference), the one ring to rule them – a command-line controller from StrongLoop.

## Build your dependencies into your deployable packages##

Why, the package.json already describes all an app’s dependencies, right? Yes, but while it is perfect for use on development branches, it should not be used at deploy time.

If you don’t shrinkwrap, each run of npm install during deployment may fetch different versions of the dependencies. You can shrinkwrap, but even when shrinkwrapped, npm install fetches those dependencies live at deploy time. If your npm server, or npmjs.org is down, you won’t be able to deploy. This is not acceptable.

You can bundle your dependencies, but keeping the bundle specifications up-to-date in the package.json is manual, and when it goes wrong, you won’t notice. Until npmjs.org is down… then you won’t be able to deploy. So, you need to automate the bundling. You can write your own tools for the above, its not complex, and you can even find some existing tooling like [bundle-deps](https://github.com/carlos8f/bundle-deps), except it doesn’t support optional dependencies, or you can use `slc build`.

Bundling of Node dependencies is only part of the story for many Node applications. While Javascript doesn’t require compilation, many applications still require building. Front-end dependencies may need to be fetched (using bower, perhaps), which is also a process that should not happen at deploy time. Javascript might need minimization, other assets may need fetching or generation. And all this build output needs to be part of the deployable package. This is not as trivial as you might expect, because npm doesn’t know what it should include in a package. It usually uses the `.gitignore` to **avoid** putting ephemeral files into the package… so you’ll need to maintain or generate an .npmignore file. `slc build` can help with this, too.

And finally, while using an npm package as your deployable artifact works well for some work-flows, particularly when the package is archived in something like Artifactory that prefers a single-file package, many workflows prefer `git` for archiving builds. Using git may even be required, if you are deploying to a platform such as [Heroku](http://docs.strongloop.com/display/SL/Heroku) or [OpenShift](http://strongloop.com/strongblog/node-js-rest-api-openshift-redhat/).

The idea of committing dependencies has triggered fierce debate, mostly focussed around the pros (using a tool with excellent support for archiving versions, roll-back, etc.) and the cons (the churn in your repository, the explosion of commit size, the inflexibility, etc.). The debate is unfortunate, because it tends to assume that you have to choose to commit, or to not commit your dependencies, and many people on the pro camp seem to suggest committing your dependencies to your development branch. This is completely unnecessary. \`slc build\` will commit your dependencies and source onto a deploy branch, not your development or production branches. It will do this for both npm installed dependencies, and the products of custom build tools such as bower, grunt, or gulp), and it will **not** commit compiled Node binaries from add-ons (unless requested).

Give it a try, it supports a number of useful options for customization, but the basic usage should support most workflows:

```sh
npm install -g strongloop
cd to/your/app
git clean -x -d # or the equivalent if not using git, always do builds in clean directories!
slc build
git log --stat --decorate deploy # to see what was committed to deploy
# or
tar -tf ../appname-appversion.tgz # to see what was packed, if app is not using git
```

## Be able to push deploys##

You want to push deploys when you decide your new app version is deployable, or perhaps have it automatically pushed to staging by your CI tools.

You should only push apps that have been pre-built to deployment, and staging, but alpha servers can have unbuilt apps pushed, for continuous testing against the latest matching dependencies.

And you want to push either git branches, or npm packages, as appropriate for your workflow.

`slc deploy` does all of the above, pushing your app to the strongloop process manager. If using git, it can also push to 3rdparty platforms, though in this case its just a thin wrapper around \`git push remote deploy:master\`.

## Deploy and run your app inside a supervisor/manager##

When running an app in deployment (as opposed to development), there are a number of features you want: restart on failure, logging, start/stop/restart (hard and soft), deploying new application versions with zero-downtime upgrade, clustering, profiling and performance monitoring, etc. You can build all those features into your app, including a way to disable them during development, since they often make development more difficult. And you can do it again and again, for every app you build… or you can use a supervisor/manager.

Node supervisors come in lots of flavors, its easy to find a dozen on npmjs.org, and some are small enough to just paste into a blog post. They have a tendency to become a kitchen-sink of features, and sometimes even to force applications to be written in such a way that they can only run inside a specific supervisor.

Our solution to this challenge focuses on modularity, and utility. The core features are implemented as much as possible in standalone modules (strong-cluster-control is our cluster utility module, strong-agent is our profiling and monitoring module, `strong-supervisor` supervises a single application, etc.).

Those features are used to build the StrongLoop process mananger, which can be used to start an app on your workstation with a simple \`[slc start](http://strong-pm.io/getting-started)\`. Once started, you can interact with your app through either a CLI (\`slc ctl\`) or UI (\`slc arc\`), profile it, try out the Strongloop features, etc.

When it comes to deploying, though, you need more. You need a manager that runs under the control of your system process manager, that receives applications deployed to it (with `slc deploy`), and that runs them under supervision. This is what our process-manager does. Both npm packages and git branches can be deployed to it, and beside exposing all the capabilities of a supervised app (run-time heap snapshot and cpu profile generation, object tracking, worker status and upgrade, etc.), it also supports different application configurations, hard/soft stop and restart, restarting the application on machine boot, etc.

Installing the process manager as a service is tedious, so the process manager also comes with an installer that will do this for you, creating a specific user to run the manager as, setting up its run directories, etc. While the manager should run under any reasonable process manager, the automated install currently supports systemd, and upstart 1.4 or 0.6 at the moment (this covers most of the major Linux distributions, RHEL, Ubuntu, etc., check out [the docs](http://strong-pm.io/prod/) for more information).

To install from npmjs.org:

`$ npm install -g strong-pm; sudo sl-pm-install`

Or if you prefer docker, you can install from Docker Hub:

`$ curl -s0 http://strong-pm.io/docker.sh | sudo /bin/sh`

Give it a try! You don’t have to install it, it can be run manually on your development machine, following on from the previous example:

    # ... in the terminal you did the `slc build` in
    slc start
    slc ctl status # see status of the current app
    slc ctl heap-snapshot 1 # get heap snapshot of worker 1
    slc arc # graphical UI alternative to the CLI
    # The app was already started, but you can try out a deploy:
    slc deploy # if using git
    # or
    slc deploy http:// ../appname-appversion.tgz # if using npm packages

## Use composable tools##

Note that all the tools described here (`slc build, slc deploy, slc pm/slc pm-install`) can be composed in multiple ways. You don’t **have** to use all our tooling for the entire workflow, but they do compose well. For example, if you are deploying to Heroku or OpenShift, you should use `slc build`, and perhaps `strong-deploy`’s `git push` capability, but you wouldn’t need the process manager. Similarly, if you already have a build process that commits your build products into git or creates a deployable package with the dependencies built into it, you don’t have to replace it with `slc build`, you can still use `slc deploy` and the process manager.

For more information check out the [strong-pm project page](http://strong-pm.io/).

## What’s Next?##

**Watch the demo!** Check out this [short video](https://www.youtube.com/watch?v=OPQRfkaH_tE&t=3s){.mfp-iframe.lightbox-added} that gives you an overview of the StrongLoop Process Manager.
