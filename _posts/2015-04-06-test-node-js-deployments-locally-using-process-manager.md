---
id: 24202
title: How to Test Node.js Deployments Locally Using StrongLoop Process Manager
date: 2015-04-06T18:18:57+00:00
author: Sam Roberts
guid: https://strongloop.com/?p=24202
permalink: /strongblog/test-node-js-deployments-locally-using-process-manager/
categories:
  - Community
  - How-To
  - Node DevOps
---
Deployment is almost by definition, remote. You don’t “deploy” on your workstation. And while you can \`ssh\` into your production systems, and manually setup and run applications, that is a pretty low tech way of deploying. It might work with one host, but as you scale out to multiple production hosts, it will feel increasingly tedious, and worse, its not reproducible.

Despite that, there are good reasons for running deployment tools on a workstation:

  * testing that the tools work
  * exploring their capabilities
  * reproducing problems seen in production in a safe-to-modify environment
  * etc.

In this blog I am going to show you how to quickly test your Node.js deployments locally using the new StrongLoop Process Manager.

> _**What is StrongLoop Process Manager?**  It&#8217;s an enterprise-grade  production runtime process manager for Node.js. StrongLoop Process Manager is built to handle both the vertical and horizontal scaling of your Node applications with ease._

It’s possible to install [strong-pm](http://strong-pm.io/) onto your system or to just run it from the command line and deploy an app to it. For example: \`slc pm & slc build; slc deploy\`, but that’s a bit clunky.

There is now a quick-start command for running an app in the StrongLoop Process Manager, \`slc start\`.

You can start an app simply:
  
<!--more-->

```js
$ cd my-app
$ slc start
App `.` started under local process manager.
  View the status:  slc ctl status
  View the logs:    slc ctl log-dump
  More options:     slc ctl -h
$ slc ctl status
manager:
  pid:                5435
  port:               8701
  base:               /home/sam/.strong-pm
current:
  status:             started
  pid:                5449
  link:               /home/sam/w/sn/express-example-app
  current:            express-example-app
  branch:             local-directory
  worker count:       4
    [1]:              cluster id 1, pid 5471
    [2]:              cluster id 2, pid 5481
    [3]:              cluster id 3, pid 5487
    [4]:              cluster id 4, pid 5493
```

&nbsp;

Note that this is different from a normal deploy: deployment is the pushing of a pre-built application package to a remote host, \`slc start\` will start a local process manager for your user (in the background), and run your application in-place, from the directory it is on disk. This means you can live-update it. Note that while templates for example, might be loaded from disk on every request in \`dev\` mode, you probably have to restart your workers for code updates to take effect:

\`$ slc ctl restart\`

You can also interact with your running application using the StrongLoop Arc graphical interface:

\`$ slc arc\`

You could also profile the local application, for example, by going to the Profile tab in StrongLoop Arc, selecting \`localhost\` as the \`Hostname\`, and \`8701\` as the \`port\`.

<img class="aligncenter size-large wp-image-24301" src="{{site.url}}/blog-assets/2015/04/Select_PID_To_Profile-1030x488.jpg" alt="Select_PID_To_Profile" width="1030" height="488"  />

<img class="aligncenter size-large wp-image-24302" src="{{site.url}}/blog-assets/2015/04/Profile_Output-1030x487.jpg" alt="Profile_Output" width="1030" height="487"  />

Enjoy exploring your app running locally “as if” it was in production, and check out <http://strong-pm.io/REMOTE> for how to manage and deploy your applications in production.

## **What’s Next?**

**Watch the demo!** Check out this [short video](https://www.youtube.com/watch?v=OPQRfkaH_tE&t=3s){.mfp-iframe.lightbox-added} that gives you an overview of the StrongLoop Process Manager.

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