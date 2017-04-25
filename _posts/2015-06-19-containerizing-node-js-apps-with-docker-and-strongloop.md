---
id: 25343
title: Containerizing Node.js Apps with Docker and StrongLoop
date: 2015-06-19T08:00:49+00:00
author: Ryan Graham
guid: https://strongloop.com/?p=25343
permalink: /strongblog/containerizing-node-js-apps-with-docker-and-strongloop/
categories:
  - Community
  - How-To
  - Node DevOps
---
If you read our recent [blog on multi-app enhancements](https://strongloop.com/strongblog/deploying-multiple-node-js-apps-with-strong-pm-io/) to Strongloop Process Manager, you’ll know that we’ve been working on features useful for production deployment.  Here is the newest addition: the ability to deploy apps on Process Manager as containers, using Docker.

This post outlines challenges with Docker, especially when you are “Dockerizing” your Node applications, demonstrates some failed attempts at trimming it down, and shows how you can use StrongLoop Process Manager to containerize your Node apps with a drastically reduced footprint!
  
<img class="aligncenter size-full wp-image-25355" src="https://strongloop.com/wp-content/uploads/2015/06/slplusdocker.png" alt="slplusdocker" width="493" height="206" srcset="https://strongloop.com/wp-content/uploads/2015/06/slplusdocker.png 493w, https://strongloop.com/wp-content/uploads/2015/06/slplusdocker-300x125.png 300w, https://strongloop.com/wp-content/uploads/2015/06/slplusdocker-450x188.png 450w" sizes="(max-width: 493px) 100vw, 493px" />

## **Containerizing Apps The Hard Way**

Anyone who has heard of Docker has probably spent at least a few seconds at least thinking about containerizing their app. If you are like me, you probably scanned the docs and decided you didn&#8217;t have time to figure it out, and that was the end of it.

And then I went back a month later and got a little bit better idea of what this Docker thing is, but ran out of time again. And then I repeated the process a couple more times until I finally had an idea of what Docker is and how I could use it to streamline some of my app deployments.

So then I started “Dockerizing” my app. It isn&#8217;t too hard: there is an example of [Dockerizing a Node.js Web App](http://docs.docker.com/examples/nodejs_web_app/) on the Docker website that covers the basic steps.  Unfortunately, it uses an outdated version of Node and npm because it uses the RPMs provided by CentOS.  It turns a single-file node package into a ~550MB image. Disk is cheap, as they say, but anyone who has used Docker a while  knows that it really likes to fill up your hard drive.

## **Trimming it Down**

I&#8217;ve copied the index.js, package.json, and Dockerfile from that guide and put them in a directory, then ran docker build -t node-experiment:original. to get my baseline and then ran a Docker images node-experiment to get a list of the images in the node-experiment repo:

```js
REPOSITORY        TAG        IMAGE ID       CREATED              VIRTUAL SIZE
node-experiment   original   d62cec98eff3   About a minute ago   557.9 MB
```

OK, let&#8217;s trim this down a bit, and see if we can make it a little friendlier to distributing across a network, or over the Internet.

First we need to figure out what&#8217;s taking up all this space. Here are some of the larger items in the resulting image:

  * 66M /var/cache/yum
  * 95M /usr/lib/locale
  * 11M /usr/lib/gcc
  * 62M /usr/share/locale

And those are just the directories that are easy to clump together, but it&#8217;s a good start. We can do some experimenting and add the following lines to the Dockerfile from that tutorial:

```js
RUN rm -rf /var/cache/yum
RUN rm -rf /usr/lib/locale
RUN rm -rf /usr/lib/gcc
RUN rm -rf /usr/share/locale

```

Now we rebuild our image, \`docker build -t node-experiment:take-2 ..\` Notice that it doesn&#8217;t take as long the second time. That&#8217;s because it is able to re-use the layers from the previous build.

Now look at the image again, with Docker images \`node-experiment\`, and revel in our genius:

```js
REPOSITORY        TAG        IMAGE ID       CREATED          VIRTUAL SIZE
node-experiment   take-2     77afd260f0be   32 seconds ago   557.9 MB
```

Wait, wat!?

## **Docker Images are Like Ogres**

Remember how the second build went faster because it was re-using the layers from the previous build? Every line in the Dockerfile is creating one of those layers, including those rm -rf &#8230; lines we added. So those lines aren&#8217;t actually deleting anything, they&#8217;re adding another layer that applies a mask to &#8220;delete&#8221; the given files on the resulting multi-layer file system. If you&#8217;re thinking that actually uses more space than it saves, you&#8217;re right. If you&#8217;re thinking this sounds a lot like what happens when you commit a large file to Git and then later remove it, but your repo doesn&#8217;t shrink, you&#8217;re right again.

So what can we do about this? One approach is to make our layers really complex:

```js
FROM    centos:centos6

# Enable EPEL for Node.js
RUN     rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
# Bundle app source
COPY . /src
# Install Node.js and npm, install app dependencies, and remove extraneous files
RUN yum install -y npm \
 && cd /src; npm install \
 && rm -rf /var/cache/yum \
 && rm -rf /usr/lib/locale \
 && rm -rf /usr/lib/gcc \
 && rm -rf /usr/share/locale

EXPOSE  8080
CMD ["node", "/src/index.js"]
```

Notice we had to do some rearranging so that we copied the app over before installing Node. That means our speed-up from layer re-use is going to disappear since it will have to re-install Node every time. Mildly annoying, but if the image is significantly smaller, it might be worth the extra minute it takes to rebuild the image. Let&#8217;s give that a try and tag it as \`node-experiment:take-3\`.

```js
REPOSITORY        TAG        IMAGE ID       CREATED              VIRTUAL SIZE
node-experiment   take-3     530ac86d081b   About a minute ago   369.4 MB
```

Not bad! Let&#8217;s take it one step further and forget about optimizing for layer re-use at all and move all the RUN commands into a single layer and tag it as \`node-experiment:take-4\`.

```js
REPOSITORY        TAG       IMAGE ID      CREATED          VIRTUAL SIZE
node-experiment   take-4   214481a25b18   26 seconds ago   359 MB
```

So we&#8217;ve managed to hack about 200MB off the size of the image. But what’s left in our image?

  * Node
  * npm
  * Our app
  * Mangled installation of gcc
  * Broken locale data

Hm.. That doesn&#8217;t seem like a good thing to be putting into staging, let alone production!

## **A Better Way**

If you&#8217;re an avid Git user you might be wishing for a Docker rebase command right about now. Sadly, there is no such command. So what commands are there? Here&#8217;s some useful-looking lines from \`docker help\`:

```js
Commands:
    build     Build an image from a Dockerfile
    commit    Create a new image from a container's changes
    cp        Copy files/folders from a container's filesystem to the host path
    create    Create a new container
    diff      Inspect changes on a container's filesystem
    exec      Run a command in a running container
    export    Stream the contents of a container as a tar archive
    import    Create a new filesystem image from the contents of a tarball
    load      Load an image from a tar archive
    save      Save an image to a tar archive
    tag       Tag an image into a repository
```

It looks like with sufficient scripting we could build our image without even using a Dockerfile. I&#8217;ll leave it as an exercise for the reader to come up with a way of tying these commands together to produce an image. Instead I’ll describe the general approach I took with StrongLoop&#8217;s Process Manager:

  1. Create a build container with Node, npm, and a complete build toolchain.
  2. Install strong-supervisor (for clustering, control channel, metrics, etc.)
  3. Import your app and install its dependencies, including binary addons.
  4. Create a deployment container with no Node, npm, or build tools of any kind.
  5. Copy Node, strong-supervisor, and your app into the deployment container.
  6. Commit the deployment container as an image.

I used the strong-docker-build module to build the one-file app from above for comparison:

```js
REPOSITORY        TAG               IMAGE ID       CREATED              VIRTUAL SIZE
node-experiment   sl-docker-build   4bca9ae8ad28   About a minute ago   148.1 MB
```

Looks like success! Not only is it smaller, but it has an embedded process supervisor with automatic clustering and metrics reporting, and no extra weight from compilers for languages we don’t need.

## **How to Use It**

This is my favorite part. Now that you have some insight into the problem and how to deal with it the hard/wrong way, here&#8217;s how to solve it the _easy_ way using StrongLoop PM:

  1. Install Docker on your server (same as installing the Dockerized StrongLoop PM).
  2. Install StrongLoop PM (same as installing a production server):
  
    \`sudo sl-pm-install &#8211;driver docker\` (the new hotness).

Now, whenever you deploy an app to StrongLoop PM on this server, your app will be turned into a Docker image using the approach described above and then run in a Docker container.

If you&#8217;re on a Mac and you want to experiment with the new Docker driver, fear not! While the sl-pm-install command is Linux only, the \`sl-pm\` and \`slc pm\` commands also accept the \`&#8211;driver docker\` option, and it works right out of the box if you have a working [boot2docker installation](http://docs.docker.com/installation/mac/).

However you install it, you&#8217;ll notice the first startup takes a little longer than usual as it pulls down official [Debian](https://registry.hub.docker.com/u/library/debian/) and [Node](https://registry.hub.docker.com/u/library/node/) images from Docker Hub. You can speed this up by pulling them ahead of time yourself with this command:

```js
$ docker pull debian:jessie && docker pull node:0.10
```

## **Docker in Docker**

While it is possible to run Docker inside Docker, or connect to a Docker daemon from within a Docker container, this first release doesn&#8217;t support it. At the time of this writing, that means the \`&#8211;driver docker\` option is not compatible with running StrongLoop PM itself as a Docker container.

## **Whats Next**

We’ll continue to develop StrongLoop tools into a full-fledged orchestration and deployment solution for production.

&nbsp;