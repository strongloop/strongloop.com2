---
id: 24198
title: How to Secure StrongLoop Process Manager with SSH
date: 2015-04-06T18:16:55+00:00
author: Ryan Graham
guid: https://strongloop.com/?p=24198
permalink: /strongblog/secure-node-js-process-manager-ssh/
categories:
  - Community
  - How-To
  - Node DevOps
---
In case you missed it, we recently [announced a new version](https://strongloop.com/strongblog/node-js-process-manager-production-docker/) of the StrongLoop Process Manager.

> _**What is StrongLoop Process Manager?**  It&#8217;s an enterprise-grade  production runtime process manager for Node.js. StrongLoop Process Manager is built to handle both the vertical and horizontal scaling of your Node applications with ease._

In this latest release of the Process Manager we announced support for SSH. In this post I’ll cover some of the basics of SSH and how we have leveraged it to make your deployment process one less thing to worry about securing.

## **What is SSH?**

Some people think of ssh as a secure alternative to telnet, a way of getting shell access to a remote system, but it is really so much more. The SSH2 protocol provides a secure transport layer, authentication on top of that, and then support for multiple connection types on top of that. These primitives are what the standard \`ssh\`, \`scp\`, and \`sftp\` commands are built on. The \`ssh\` command itself is a bit of a security Swiss Army Knife similar in flexibility to \`netcat\`, but with built in support for strong encryption and authentication.

One of the less commonly used superpowers of \`ssh\` is as a secure tunnel. You could use this to implement something as complete as a full scale VPN or as simple as securing a single connection. Unlike HTTPS there’s no giant pay-to-play network of trust, so it’s trivial to create and use new key pairs. And because this is central to the protocol and CLI tools, key management is front and center instead of hidden behind several layers of dialog boxes designed to scare you.

## **Ok, so how do I use it?**

It hasn’t been documented, but it has always been possible to use \`ssh\` to secure the connection between your workstation and your server when you run \`slc deploy\`. It’s trivial, really:
  
\`ssh -L localhost:8701:127.0.0.1:8701 -T -N -f myuser@my-server
  
slc deploy\`
  
<!--more-->

Ok, so not 100% trivial. Certainly not easy to remember! And now that there’s an \`ssh\` process running in the background and squatting on my local port 8701, how do you kill it? And then there’s the fun of connecting to multiple servers and keeping track of which local port is the magical portal to which remote server?

One way to work around this is to write a shell script that remembers the \`pid\` of the backgrounded process and kills it after \`slc deploy\` finishes. And then you can add some argument parsing to make it work with multiple servers. And then you can make a gist of it and share it with your friends. And then you try it from Windows or some other computer that doesn’t have \`ssh\` installed.

## **Can it be easier?**

Enter the [ssh2](https://www.npmjs.com/package/ssh2) module. This is an amazing module by the talented Brian White ([mscdex](https://github.com/mscdex) on GitHub). It’s not a [wrapper around the ssh](https://www.npmjs.com/package/ssh-kit) command, and it’s not Node [bindings for libssh](https://www.npmjs.com/package/ssh). It’s a pure JavaScript implementation of the SSH2 protocol. That means you don’t need to have SSH or a compiler installed. Sounds like an excellent foundation for adding SSH support without complicated dependencies, if you ask me. So that’s what we did!

To keep the implementation simple and avoid breaking our existing support for HTTP authentication, we kept the interface minimal. In many cases you can get away with simply changing the protocol in your URL to \`http+ssh://\` like so:

## **Plain ol’ HTTP**

\`slc deploy http://my-server:8701/default\`

## **HTTP over SSH**

\`slc deploy http+ssh://my-server:8701/default\`

Obviously, we had to make some compromises to keep things this simple. For starters, you need to be using [key based authentication](https://help.github.com/articles/generating-ssh-keys/) because we don’t even provide a way for you to provide a password. And secondly, the example command above also requires you to be using an ssh-agent to make your keys available. If you aren’t ready to set up an agent or you aren’t on a platform that makes it easy, you can specify a key instead by setting an \`SSH\_KEY\` environment variable to the path to the private key. Because the auth portion of the URL is used for HTTP authentication you have to use the \`SSH\_USER\` environment variable to specify the username if your local username isn’t the right one. Here’s an example:

\`export SSH_USER=ubuntu
  
export SSH_KEY=~/.ssh/ec2.rsa
  
slc deploy http+ssh://ec2-host:8701/default\`

You can try this out yourself, all you need to do is \`npm install -g strongloop\`. And if you want to add \`http+ssh://\` support to your own tools, go ahead. It’s [open source](https://github.com/strongloop/strong-tunnel)!

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