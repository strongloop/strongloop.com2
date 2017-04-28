---
id: 24195
title: How to Deploy Express Apps with StrongLoop Process Manager
date: 2015-04-06T18:15:36+00:00
author: Chandrika Gole
guid: https://strongloop.com/?p=24195
permalink: /strongblog/best-practices-express-js-process-manager/
categories:
  - Community
  - Express
  - How-To
  - Node DevOps
---
In this blog post I am going to show you how to deploy [Express.js](http://expressjs.com/) apps on a Digital Ocean cluster and manage the processes using [StrongLoop’s Process Manager](https://strongloop.com/strongblog/node-js-process-manager-production-docker/).

> _**What is StrongLoop Process Manager?**  It&#8217;s an enterprise-grade  production runtime process manager for Node.js. StrongLoop Process Manager is built to handle both the vertical and horizontal scaling of your Node applications with ease._

## 

<!--more-->

## **Configuring your Digital Ocean droplet**

  * Sign up [or login](https://www.digitalocean.com/) to [Digital Ocean](https://cloud.digitalocean.com/login) if you haven’t already
  * Create a droplet and \`ssh\` into your instance
  * Install the latest version of Node.js using your favorite package manager
  * Install the latest version of the StrongLoop Process Manager CLI tools with this command:

\`npm install -g strong-pm\`

  * Take a snapshot of your Droplet so you won’t have to reinstall these tools next time

## 

## **Start the remote strong-pm server**

Now start the \`pm\` server:

```js
[root@pm-server1~]# sl-pm -l 7777
sl-pm: StrongLoop PM v5.1.0 (API v6.1.0) on port <code>7777</code>
sl-pm: Base folder <code>/home/chandrika/.strong-pm</code>
sl-pm: Applications on port <code>3000 + service ID</code>
Browse your REST API at http://127.0.0.1:7777/explorer
```

This command starts StrongLoop Process Manager, which:

  * Restarts your application if it crashes, with zero-downtime
  * Sends application logs and errors to \`stdout\` and \`stderr\`
  * Makes sure your \`strong-pm\` daemon runs as the unprivileged \`strong-pm\` user
  * Adjusts file descriptor limits
  * Enables core dumps for the daemon if your system is configured for it

## **Now, setup a local development environment**

Install the StrongLoop CLI tools on your local development machine.

\`npm install -g strongloop\`

In your application directory run \`slc arc\`, opening it by default in a web browser window.

<img class="aligncenter size-full wp-image-24240" src="{{site.url}}/blog-assets/2015/04/express-2.png" alt="express-2" width="975" height="261"  />

## **Build & Deploy**

From the landing page of StrongLoop Arc, click on the Build & Deploy tab.

You can now deploy your Express application by building a \`tar\` file or using \`git\` if your application is on a \`git\` repository. Once the application is built successfully, deploy it to your \`pm\` server by entering the hostname, port and the number of processes.

&nbsp;

<img class="aligncenter size-full wp-image-24241" src="{{site.url}}/blog-assets/2015/04/express-3.png" alt="express-3" width="975" height="446"  />

&nbsp;

## **Manage your Processes**

Once your app is deployed successfully, switch to the “Process Manager” tab. Add the hostname and port of your \`pm\` server and click “Activate”. Your process IDs should now be listed in the PIDs column.

&nbsp;

<img class="aligncenter size-full wp-image-24242" src="{{site.url}}/blog-assets/2015/04/express-4.png" alt="express-4" width="975" height="332"  />

## **Multi-clustered application**

If you want to run your app on multiple servers, you can create Droplets from the Digital Ocean image you created earlier. Start the \`pm\` server and deploy your applications on each of your \`pm\` servers. After your applications are deployed, add them in the Process Manager GUI. You should now be able to check app status, resize, start, stop and restart cluster from the Process Manager page.

&nbsp;

<img class="aligncenter size-full wp-image-24243" src="{{site.url}}/blog-assets/2015/04/express-5.png" alt="express-5" width="975" height="388"  />

&nbsp;

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