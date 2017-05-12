---
id: 27147
title: Introduction to LoopBack Presentation
date: 2016-03-31T15:36:54+00:00
author: Raymond Camden
guid: https://strongloop.com/?p=27147
permalink: /strongblog/introduction-to-loopback-presentation/
categories:
  - How-To
  - LoopBack
---
On March 31, I gave a presentation on LoopBack and StrongLoop. I’ve embedded the recording here:

<!--more-->

<iframe width="560" height="315" src="https://www.youtube.com/embed/3YxZbSPIUAo" frameborder="0" allowfullscreen></iframe>

I’m not including a link to the slides/demos because they were extremely simple, and you can see the slides in the presentation itself, but obviously if you _want_ it, just ask. During the presentation, there were a few questions that came up that I wanted to address in the blog post.

### What are the minimum requirements to install LoopBack/StrongLoop?

I’d check the [Installing StrongLoop](https://docs.strongloop.com/display/SL/Installing+StrongLoop) documentation for that. Also the specific doc for [Windows](https://docs.strongloop.com/display/SL/Installing+on+Windows) and [OSX](https://docs.strongloop.com/display/SL/Installing+on+MacOS).

In terms of the supported version of Node, both docs say this: “For best results, use the latest LTS (long-term support) release of Node.js.”

### How do you upgrade from earlier versions of LoopBack?

Check the docs: [Updating to the latest version](https://docs.strongloop.com/display/SL/Updating+to+the+latest+version)

### Debugging &#8211; basically &#8211; how?

See my blog entry here: [A quick look at debugging Node.js with StrongLoop and Visual Studio Code](http://www.raymondcamden.com/2015/10/28/a-quick-look-at-debugging-node-js-with-strongloop-and-visual-studio-code/)

### Relationships &#8211; basically &#8211; how?

Start with the docs here: [Creating model relations](https://docs.strongloop.com/display/LB/Creating+model+relations). As I mentioned in the presentation, I’m working on a blog post about the topic, but you can find some sample code for it here: <https://github.com/cfjedimaster/StrongLoopDemos/tree/master/ormdemo>

### Updates for Angular 2

I was asked if the [AngularJS SDK](https://docs.strongloop.com/display/LB/AngularJS+JavaScript+SDK) would be updated for Angular 2. Right now &#8211; there are no official plans for an update. As I said multiple times in the presentation, you can absolutely use Angular 2, Ionic, jQuery Mobile, Vanilla JS, etc, with LoopBack with no problem at all. This SDK is just an _optional_ utility for working with LoopBack and Angular.

**Note:** Originally published [here](http://www.raymondcamden.com/2016/03/31/introduction-to-loopback-presentation/).  If you enjoyed the presentation, feel free to visit the link and let me know what you think in the comments section.
