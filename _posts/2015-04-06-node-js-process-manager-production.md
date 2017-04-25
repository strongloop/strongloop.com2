---
id: 24200
title: How to Run StrongLoop Process Manager In Production
date: 2015-04-06T18:21:07+00:00
author: Ryan Graham
guid: https://strongloop.com/?p=24200
permalink: /strongblog/node-js-process-manager-production/
categories:
  - Community
  - How-To
  - Node DevOps
---
If you’ve followed StrongLoop and our tooling, you’ll notice that we try to make things easy. That’s why \`npm install -g strongloop\` bundles so many of our tools into the slc command &#8211; to make it easier to build, deploy, monitor your apps in development and in production. But its a large bundle and a lot of those tools don’t really make sense on your server. In this blog post I’ll talk about a more server-friendly way of running the latest version of the [StrongLoop Process Manager](https://strongloop.com/strongblog/node-js-process-manager-production-docker/) without all the extras like Arc and Yeoman generators.

> _**What is StrongLoop Process Manager?**  It&#8217;s an enterprise-grade  production runtime process manager for Node.js. StrongLoop Process Manager is built to handle both the vertical and horizontal scaling of your Node applications with ease._

## 

## **Introducing strong-pm**

Behind most \`slc\` commands is a standalone module. Each module, like a tool in your toolbox, is focused on a single job or purpose. Like a tool, each command is simpler, making the training and reasoning around its function and purpose easier. Each module therefore has its own identity. For the \`slc pm\` command that module is [strong-pm](https://github.com/strongloop/strong-pm).

\`npm install -g strong-pm\`

Installing strong-pm gives you the \`sl-pm\` and \`sl-pm-install\` commands, which correspond to the \`slc pm\` and \`slc pm-install\` commands from the strongloop module.

## **Reboot!**

Servers crash. Power cords get unplugged. Cloud providers perform rolling reboots to apply critical patches. It’s bad enough when your app goes down because of that, but having your app not even restart with your server is even worse. This is where \`sl-pm-install\` comes in. If you’re using one of the mainstream Linux distributions and it’s a version that was released within the last few years, chances are high that it uses \`[Upstart](http://upstart.ubuntu.com/cookbook/)\` for its \`init\` process. If you’re on an even newer release, like something RHEL7 based, you’ve got \`[systemd](http://www.freedesktop.org/wiki/Software/systemd/)\`. Both are more than capable of starting your app on boot and restarting your app if it crashes. They also both take care of logging your app’s stdout and stderr to disk or elsewhere.

<!--more-->

## **Sane defaults**

The \`sl-pm-install\` command accepts a few options, but in the interest of convenience and promoting best practices, we made all of our recommended options the defaults. There are a few options where we can’t recommend a default.

  1. Which \`init\` implementation? The supported options are \`&#8211;systemd\`, \`&#8211;upstart 0.6\`, or \`&#8211;upstart 1.4\`. We chose \`&#8211;upstart 1.4\` as the default because of Ubuntu’s popularity and their 2 most recent LTS releases support it.
  2. HTTP Authentication. Obviously, we can’t tell you what to use as your username and password! You can set this with \`&#8211;http-auth user:pass\`. It’s not a perfect solution, but it’s a great addition to a multi-layered security policy.
  3. Where to send metrics to. This would be hard to guess, so the best we can do is make it work with Arc out of the box. If you want more you can use the \`&#8211;metrics\` flag, which takes the URL of an [external service](http://docs.strongloop.com/display/SLC/Integrating+with+third-party+consoles).

## **sudo sl-pm-install**

Without arguments, \`sl-pm-install\` is tuned for Ubuntu 12.04 or newer and will:

  * create a new strong-pm user
  * set that user’s \`HOME\` to \`/var/lib/strong-pm\`
  * install an Upstart 1.4+ compatible \`init\` script

That \`init\` script will:

  * run strong-pm on port 8701
  * make sure your strong-pm daemon runs as the unprivileged \`strong-pm\` user
  * take care of sending log output to \`/var/log/upstart/strong-pm.log\`
  * adjust file descriptor limits
  * enables core dumps for the daemon if your system is configure for it

If your server is based on an older version of Ubuntu or Debian, RHEL 5 or 6, or is one of the several other Linux distributions that ships with Upstart 0.6.x, then you’ll want to specify that.

## **sudo sl-pm-install &#8211;upstart 0.6**

Upstart 0.6 is [missing some features](http://upstart.ubuntu.com/cookbook/#stanzas-by-category), but by using some workarounds it manages to do almost everything that the Upstart 1.4 compatible version does. Most notably, the logs are sent to \`syslog\` and tagged as \`strong-pm\`, instead of going to a dedicated log file.

If your server is based on RHEL 7 or one of the few other distributions that come preconfigured with [systemd](http://www.freedesktop.org/wiki/Software/systemd/), you’ll want to tell the installer to generate a \`systemd\` service.

## **sudo sl-pm-install &#8211;systemd**

Once again, the end result is almost identical to the Upstart 1.4 compatible install, except for logging. This time your logs are sent to \`journald\`, the logging system that is part of \`systemd\`. By default the best way to access your \`journald\` logs is with the [journalctl](http://www.freedesktop.org/software/systemd/man/journalctl.html) command.

## **Remote Control**

Once your server is running (notice it was 2 steps?) you’re ready to build, deploy, and monitor. When deploying or configuring, make sure you remember to include your HTTP auth credentials in the URL if you set them, or better yet, try out the new \`http\` over \`ssh\` support.

Happy deploying!

## **What’s Next?**

**Watch the demo!** Check out this [short video](https://vimeo.com/123959182){.mfp-iframe.lightbox-added} that gives you an overview of the StrongLoop Process Manager.

**Sign up for the webinar!** [“Best Practices for Deploying Node.js Applications in Production”](http://marketing.strongloop.com/acton/form/5334/0039:d-0002/0/index.htm) on April 16 with StrongLoop and Node core developer [Sam Roberts](https://github.com/sam-github).

In the coming weeks, look for more enhancements to the StrongLoop Process Manager and its runtime capabilities. But for now, here’s a few additional technical articles that dive into greater detail on how to make the most of this release:

  * [Best Practices for Deploying Node in Production](https://strongloop.com/strongblog/node-js-deploy-production-best-practice/)
  * [How to Test Node.js Deployments Locally Using StrongLoop Process Manager](https://strongloop.com/strongblog/test-node-js-deployments-locally-using-process-manager/)
  * [How to Run StrongLoop Process Manager in Production](https://strongloop.com/strongblog/node-js-process-manager-production/)
  * [How to Secure StrongLoop Process Manager with SSH](https://strongloop.com/strongblog/secure-node-js-process-manager-ssh/)
  * [Best Practices for Deploying Express Apps with StrongLoop Process Manager](https://strongloop.com/strongblog/best-practices-express-js-process-manager/)
  * [How to Create and Run StrongLoop Process Manager Docker Images](https://strongloop.com/strongblog/run-create-node-js-process-manager-docker-images/)

&nbsp;

&nbsp;

&nbsp;