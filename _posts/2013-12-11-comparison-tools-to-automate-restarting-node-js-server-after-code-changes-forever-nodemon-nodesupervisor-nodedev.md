---
id: 11270
title: 'Comparison: Tools to Automate Restarting Node.js Server After Code Changes'
date: 2013-12-11T10:33:20+00:00
author: Qihan Zhang
guid: http://strongloop.com/?p=11270
permalink: /strongblog/comparison-tools-to-automate-restarting-node-js-server-after-code-changes-forever-nodemon-nodesupervisor-nodedev/
categories:
  - How-To
---
As a newbie Node.js developer coming from a Java and PHP background, I found the process of having to search for the correct node terminal and hitting

`[Ctrl-C] [Up-Arrow] [Enter]`

after every code change to be very archaic. Luckily there are many tools available that can automate this process for you, saving you valuable time and unnecessary pain. These seconds can really add up if you are constantly making a lot of little changes to your code. With all that time you’re saving, you can unglue yourself from your seat and go out for a walk or take an extra coffee break.

<center>
  <br /> <img alt="coffee" src="{{site.url}}/blog-assets/2013/12/coffee.jpg" width="350" height="263" />
</center>
  
<!--more-->

[
  
](https://github.com/nodejitsu/forever) 

## [**forever**](https://github.com/nodejitsu/forever)

forever is not only a great CLI tool for keeping your app running continuously in a production environment, but also has advanced features that support running multiple node processes as background services. In this case, it gives you the option of restarting the server on file changes by using the -w flag. By using this flag, we not are only automatically restarting the application when the code changes, but also when and if the application goes down.

## Installation:

```js
sudo npm install -g forever
```

**Use forever -w, instead of node to start your app:**

```js
$ forever -w app.js
```

[
  
](https://github.com/remy/nodemon) 

## [**nodemon**](https://github.com/remy/nodemon)

I found out about Remy Sharp’s nodemon while browsing StackOverflow and have been using it for developing Node.js apps ever since. It&#8217;s fast and very simple to use… and it also supports CoffeeScript:

## Installation:

&nbsp;

```js
sudo npm install -g nodemon
```

**Use nodemon, instead of node:**

```js
$ nodemon app.js
```

You can also specify a custom list of file extensions to watch for with the -e switch like so:

```js
$ nodemon -e ".coffee|.js|.ejs" app.js
```

&nbsp;

## **Alternatives**

[
  
](https://github.com/isaacs/node-supervisor) 

&nbsp;

## [**node-supervisor**](https://github.com/isaacs/node-supervisor)

Developed by Isaac Schlueter, the supervisor module is very similar in functionality and customizability to nodemon. However, I have seen complaints from the community that it eats up more CPU than it needs to and that it loses out on important functionality such as &#8211;debug and &#8211;harmony as it passes all arguments as arguments to the script itself rather than node. Also, unlike nodemon and forever, it will keep trying to restart the application when there is an error, which can overload your terminal with duplicate error statements.

&nbsp;

## Installation:

&nbsp;

```js
sudo npm install -g supervisor
```

Use supervisor, instead of node:

```js
$ supervisor app.js
```

Like nodemon, supervisor also allows you to specify your own list of files to watch with the -e switch like so, just without the dot:

```js
$ supervisor -e "js|ejs|node|coffee" app.js
```

[
  
](https://github.com/fgnass/node-dev) 

## [**node-dev**](https://github.com/fgnass/node-dev)

node-dev is great alternative to both nodemon and supervisor for developers who like to get growl (or libnotify) notifications on their desktop whenever the server restarts or when there is an error. It also supports CoffeeScript and LiveScript. To use the growl notifications you have to install Growl from http://growl.info/downloads.
  
It should be noted that node-dev should not be used in production — it’s not designed for hot code reloading, but for easier development.

&nbsp;

## Installation:

&nbsp;

```js
npm install -g node-dev
```

Use node-dev, instead of node:

```js
$ node-dev app.js
```

## **Comparison of tools**

I was most impressed with forever and nodemon after researching and trying out all of the various alternatives. Not only are they the most actively developed amongst the alternatives, the support from the users is overwhelming as seen by the number of GitHub stars (as of December 9, 2013):

forever: 3527
  
nodemon: 2331
  
node-supervisor: 1442
  
node-dev: 446

For those of you in a production environment and are already using forever to keep your processes alive, you can simply add the -w flag on your startup script instead of having to install another dependency.

For a development environment, using nodemon, supervisor, or node-dev are all great solutions to having to manually restart the server after every code change. I recommend trying out nodemon first and checking out the others if you are not satisfied with it’s performance. I was hooked after using it once: it&#8217;s fast, simple to use, and is greatly supported by the community.

**Update**: Many of you suggested that [pm2](https://github.com/Unitech/pm2) should also be included in this list. Although pm2 is a great tool, it no longer seems to support monitoring for file changes. It seems to have been supported in the past, [but was removed a few months ago.](https://github.com/Unitech/pm2/issues/213) Perhaps it will be introduced again in a future patch.

&nbsp;

## **What’s next?**

  * Do you want to keep up on the latest Node.js and Open Source news and developments? Sign up for [StrongLoop’s newsletter](http://strongloop.com/newsletter).
