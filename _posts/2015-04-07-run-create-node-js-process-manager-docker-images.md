---
id: 24192
title: How to Create and Run StrongLoop Process Manager Docker Images
date: 2015-04-07T06:00:07+00:00
author: Ryan Graham
guid: https://strongloop.com/?p=24192
permalink: /strongblog/run-create-node-js-process-manager-docker-images/
categories:
  - How-To
  - Node DevOps
---
In case you missed it, we recently [announced a new version](https://strongloop.com/strongblog/node-js-process-manager-production-docker/) of the StrongLoop Process Manager.

> _**What is StrongLoop Process Manager?**  It&#8217;s an enterprise-grade  production runtime process manager for Node.js. StrongLoop Process Manager is built to handle both the vertical and horizontal scaling of your Node applications with ease._

One of the coolest features of the new release is support for Docker.

<img class="aligncenter size-full wp-image-24246" src="{{site.url}}/blog-assets/2015/04/docker.png" alt="docker" width="975" height="234"  />

In this blog post I am going to show you how to install and use the offical StrongLoop Process Manager Docker image. Let’s get started shall we?

\`curl -s https://strong-pm.io/docker.sh | sudo sh\`

The created service will use port 8701 for the Process Manager API and port 3000 for your app.  If the server reboots, the Process Manager will automatically restart.

That’s it!

Well, that would not satisfy those of you that need to know how things work, would it? So in the rest of the blog I’ll explain how that bit of a script does its work, by showing you how to do it the hard way!

<!--more-->

## **Requirements**

Setting up a server can be daunting, and installing Node on a server isn&#8217;t always a walk in the park either. Fortunately, we&#8217;re talking about Docker here so we get to wave a wand and make all our problems go away! Well, not all our problems, but at least a few. Here&#8217;s what our server needs:

  * A host (physical or virtual) capable of running Docker.  I recommend something RHEL/Fedora-based because of the extra protection offered in the event that your Docker container is breached.
  * That&#8217;s it! You don&#8217;t even need to install Node on your server!

Here&#8217;s what your workstation needs:

  * Node (so you can \`npm install -g strongloop\`)

Since this article is about deployment rather than development I won&#8217;t be covering how to install Node in your dev environment.

## **Procedure**

Here&#8217;s the general recipe:

  * Install Docker
  * Install the strong-pm docker image
  * Deploy your app!

## **Installing Docker**

Many (many, many) articles have been written about how to install Docker. Personally, I found the official documentation to be the best. If you are in a rush and are running Ubuntu, Debian, Linux Mint, Fedora, AWS Linux, CentOS, or RHEL and the version you are running was released in the last year or so, there&#8217;s a handy one-line installer you can use:

\`curl -sSL https://get.docker.com/ | sudo sh\`

If you aren&#8217;t lucky enough to have that work for you, you&#8217;ll probably have to go read the docs.

Protip! I highly recommend following the instructions for sudo-less Docker.

## **Install The strongloop/strong-pm Docker image**

In short, what we need to do now is pull down the \`strong-pm\` Docker image, start it up, and then set up an \`init\` script to make sure it starts the next time your server reboots.

Conveniently, if Docker is told to run an image that hasn&#8217;t been pulled yet, it will pull it automatically. This means you can cover the first two steps with the following command:

\`docker run &#8211;detach &#8211;restart=no \
  
&#8211;publish 8701:8701 &#8211;publish 3000:3000 \
  
&#8211;name strong-pm-container \
  
strongloop/strong-pm\`

&nbsp;

Great! Now you&#8217;ve downloaded the \`strongloop/strong-pm\` Docker image, started a new container in the background (\`&#8211;detach)\` named it \`my-app-pm\`. Additionally, we&#8217;ve told it to publish container ports 8701 and 3000 and as host ports 8701 and 3000, respectively.

If you don&#8217;t care about your application coming back up after a server reboot and you just want to take it for a spin, you&#8217;re done with this part and you can go straight to the **“Deploying Your App”** section.

If you want to set up something a little closer to production, we&#8217;ve got one more step to do.

If you care about your app&#8217;s uptime then the bare-minimum you can do is make sure that it restarts if it crashes. The good news is you&#8217;re already running your app under a process manager that will restart your app for you. But what about a server reboot? No amount of JavaScript can save you from a power outage, so you&#8217;ve got to get some help from the host OS.

This is where \`Upstart\` and \`systemd\` come in. If you were lucky enough to have the one-liner from the **“Installing Docker”** section work for you, then there&#8217;s a good chance you&#8217;re running a system that comes with \`Upstart\`.

If you&#8217;ve already drank the ‘systemd’ Kool-Aid, then you can follow those instructions.

## **Upstart**

If you are in a rush you can probably get away with simply copying the following example into \`/etc/init/strong-pm-container.conf\`:
  
\`description &#8220;StrongLoop Process Manager Container&#8221;
  
author &#8220;StrongLoop <callback@strongloop.com>&#8221;
  
start on filesystem and started docker
  
stop on runlevel [!2345] respawn
  
exec /usr/bin/docker start -a strong-pm-container\`

## **systemd**

You&#8217;ll want to create a target like this one:
  
\`[Unit] Description=StrongLoop Process Manager Container
  
Author=StrongLoop <callback@strongloop.com>
  
After=docker.service [Service] Restart=always


  
ExecStart=$DOCKER start -a strong-pm-container
  
ExecStop=$DOCKER stop -t 2 strong-pm-container</p> [Install] WantedBy=default.target\`</p> 

Just like with the \`Upstart\` job, this one is so simple you can probably just copy/paste the above \`systemd\` example right into \`/etc/systemd/system/strong-pm-container.service\`.

## **Deploy Your App**

Alright, now that we&#8217;ve installed Docker and a containerized instance of the StrongLoop Process Manager, we&#8217;re ready to deploy our app. This one is easy:

\`slc deploy http://docker-host:8701/\`

Now that you know how to do it the hard way, you can always use the script we provided you right at the top. Happy Deploying!

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