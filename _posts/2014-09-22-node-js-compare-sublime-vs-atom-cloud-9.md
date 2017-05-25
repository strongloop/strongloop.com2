---
id: 20226
title: 'Node.js Editor Comparison: Sublime vs Atom vs Cloud 9'
date: 2014-09-22T13:13:52+00:00
author: Alex Gorbatchev
guid: http://strongloop.com/?p=20226
permalink: /strongblog/node-js-compare-sublime-vs-atom-cloud-9/
categories:
  - Community
  - How-To
---
<img src="http://npmawesome.com/wp-content/uploads/2014/09/intro.jpg" alt="intro" width="100%" />

TL;DR Sublime is awesome, Atom has potential and Cloud 9 is downright impressive.

## History

Picking the right editor has always been kind of a big deal for me. I&#8217;ve had a pleasure of watching editors evolve and grow over the past few years and have developed a great appreciation for the current state of affairs. I spend hours perfecting my shortcuts, configurations, and plugins—perhaps way too much time actually.

Over the years I&#8217;ve used everything from Notepad++ and Vim to Delphi and TextMate. The latter has been the biggest and most rewarding to learn and use. Every new editor that I encounter these days I evaluate based on Vim key support first, everything else second.

In this post I&#8217;m going to take a quick look at three editors: Sublime Text, Atom, and Cloud 9 IDE. Lets get going!

<!--more-->

## Sublime

<img class="screenshot" src="http://npmawesome.com/wp-content/uploads/2014/09/sublime-overview.png" alt="" width="100%" />

[Sublime Text](http://www.sublimetext.com/) is one of the most popular editors today and is a very strong contender for power Vim users to check out. It is commercial closed-source native application available for OSX, Windows, and Linux. A license will run you $70 per user for unlimited installations and usages. It is extensible via Python plugins of which [there are plenty](https://sublime.wbond.net/) these days to satisfy all your editing habits.

## Atom

<img class="screenshot" src="http://npmawesome.com/wp-content/uploads/2014/09/atom-overview.png" alt="" width="100%" />

[Atom](https://atom.io/) is the new kid on the block and is being spearheaded by GitHub. It appeared out of the blue in early 2013 and at first was a partially closed source application with the core being closed and all the little bits were opened. The future of that strategy was pretty unclear and soon enough the whole thing became open sourced.

Atom in my opinion is an attempt to rebuild Sublime and so essentially it is a feature for feature clone. Unlike Sublime however, Atom is a web application wrapped in a desktop shell and runs inside a WebKit instance. In this lies its power and weakness.

Atom currently is free and open source, written primarily in CoffeeScript and also has a [pretty vibrant plugin community](https://atom.io/packages).

## Cloud 9 IDE

<img class="screenshot" src="http://npmawesome.com/wp-content/uploads/2014/09/cloud9-overview.png" alt="" width="100%" />

[Cloud 9 IDE](http://c9.io) is a different beast all together. It runs straight out of the browser and is a bag full of mixed emotions. It shines in some places, completely blows your mind in other places and is pretty lackluster to the point of frustration elsewhere.

The use case for Cloud 9 IDE is pretty interesting. If you have a $200 ChromeBook and an internet connection, guess what, you could be easily developing pretty heavy weight web applications, running database and web servers, have full linux console and so on. You don&#8217;t need to install anything locally at all, everything runs in the cloud.

Cloud 9 IDE is a hosted service and it&#8217;s free for open source projects. If you want to have more than one private projects it&#8217;s just $20 per month. Cloud 9 IDE is open source as well.

## Showdown

Sublime is my editor of choice that I use fulltime. I&#8217;ve spent a week using both Atom and Cloud 9 IDE to get a sense for what they are capable of. I have used Atom and Sublime on a pretty big repository nearing almost 8GB in size. Cloud 9 IDE was used to edit my open source projects hosted on GitHub. I&#8217;ve used all three editors on a MacBook Pro retina with 16GB of RAM.

To make this a little bit more structured, lets break it down into the following categories:

  1. Installation
  2. Look And Feel
  3. Interface Responsiveness
  4. Search Performance
  5. Features
  6. Plugins
  7. Summary

## Installation

Installing Sublime and Atom on OSX is a matter of downloading a package and running the app from it. You could be using the app in seconds. Both can also be installed on Windows and Linux.

Hosted Cloud 9 IDE requires a bit more time to get going. You can sign in into the app using your GitHub, BitBucket or a local account. Once you are in the dashboard, you can clone existing project, upload your files or create a new one using any available template.

## Look And Feel

I think it&#8217;s extremely important that the application I stare at 10-12 hours a day doesn&#8217;t hurt my eyes. Developers of all three editors clearly agree with me as they have put in a great deal of effort into the look and feel. All three feel polished and cared for and are a pleasure to use. Little details like icons, and subtle animations leave a pleasant feel without getting in the way.

## Interface Responsiveness

No matter how you shake it, Sublime is the only native application of the bunch and it&#8217;s the fastest. Of course, there are limits to how performant even Sublime can be. The main GIT repo that I work in on a daily basis is almost 8GB with thousands upon thousands of files. You can definitely see the limits of Sublime&#8217;s file finder here as it struggles and barely keeps up. But even with that repo, the application is fast to start and is pretty responsive when editing.

Atom has recently started using React.js for its rendering engine and is at the point where it feels almost like a native application. It&#8217;s still not as responsive as Sublime. The large repository I mentioned earlier can slow Atom down pretty significantly. Of course, I realize that not everyone is working with 8GB worth of project files and this might be more of an edge case.

## Search Performance

This is a huge deal for me. Because I work with scripting languages, being able to quickly find what I need is paramount and Sublime stands in its own category here, with no competition. One word comes in mind to explain its search performance:

<img class="aligncenter" src="http://npmawesome.com/wp-content/uploads/2014/09/magic.gif" alt="" width="237" height="196" />

Atom search speed isn&#8217;t all that great. Even on a small project it can be noticeable with large projects taking being painfully slow. Same can really be said for Cloud 9.

How search results are presented can make a huge impact on usability and Sublime shines here with grouping matches that are close together and providing enough context of where the matches are.

<img class="screenshot" src="http://npmawesome.com/wp-content/uploads/2014/09/sublime-search.png" alt="" width="100%" />

Cloud 9 IDE search results are pretty similar to Sublime. My only complaint is that they matches are a bit difficult to see with the default color theme.

<img class="screenshot" src="http://npmawesome.com/wp-content/uploads/2014/09/cloud9-search.png" alt="" width="100%" />

Atom highlights matches in a very clear way, but there is absolutely no context nor grouping of search results. Each match is shown as a separate item and it just looks like a wall of text without much context. I hope this changes in the near future.

<img class="screenshot" src="http://npmawesome.com/wp-content/uploads/2014/09/atom-search.png" alt="" width="100%" />

## Features

Both Sublime and Atom rely on very exhaustive list of plugins for the majority of their power features. Personally, whenever I try out a new editor, the first two things I test are the VIM keys and multi-cursor support. In particular, how the two work together. Being able to select a bunch of things and edit them at the same time is a truly great time saver. When you throw in VIM key navigation on top of that, it becomes unstoppable.

<img class="aligncenter" style="max-width: 100%;" src="http://npmawesome.com/wp-content/uploads/2014/09/sublime02.gif" alt="" />

All three editors support this in one way or another, but none do it as natural and intuitive as Sublime. Only Sublime allows you to freely use VIM navigation and selection keys with multiple cursors. The moment I tried navigating or selecting with VIM keys while having multiple cursors in Atom and Cloud 9 IDE, both would give up and remove all the extra cursors, falling back to regular one cursor mode and essentially rendering this feature useless to me.

Atom&#8217;s VIM keys feel pretty lacking at the moment with basics either not functioning at all or performing in an unexpected way, which is worse in my opinion.

All three editors implement quick command access which I find indispensable. This is the best way to access all the available commands with just a few quick key strokes.

<img class="screenshot" src="http://npmawesome.com/wp-content/uploads/2014/09/sublime-commands.png" alt="sublime-commands" width="100%" />

Cloud 9 IDE doesn&#8217;t appear to have any support for third party plugins but its current set of features is pretty remarkable and deserve their own section!

## Terminal Access

Each project comes with full shell access to a server which has a fully configured environment ready to be used with goodies like Node.js, Ruby, MongoDB, Apache, PHP and so on. WordPress template is one of the starter kits and so I was able to install and configure a development instance for npmawesome.com in a matter of minutes. The fact that it was running from my &#8220;editor&#8221; is pretty astonishing.

<img class="screenshot" src="http://npmawesome.com/wp-content/uploads/2014/09/cloud9-terminal.png" alt="" width="100%" />

## Collaborative Editing

Share and edit files with others in real time. There have been some attempts at making collaborative editing work in Sublime and VIM, but I was never able to get that going successfully. Cloud 9 IDE has support for this baked in.

<img class="screenshot" src="http://npmawesome.com/wp-content/uploads/2014/09/cloud9-collab.gif" alt="" width="100%" />

## Debugger

The built in debugger for Node.js works as you would expect, with break points, variable inspection, and so on.

<img class="screenshot" src="http://npmawesome.com/wp-content/uploads/2014/09/cloud9-debugging.png" alt="" width="100%" />

## Image Editor

Finally, there&#8217;s a built in image editor.

<img class="screenshot" src="http://npmawesome.com/wp-content/uploads/2014/09/cloud9-image-editor.png" alt="" width="100%" />

In terms of features that come out of the box, Cloud 9 IDE easily takes the cake here. I&#8217;m very impressed, and even more so by the fact that all you need is a browser to access all those amazing features. This means you can run it practically on anything with a modern browser, a $200 chromebook for example:

<img class="screenshot" src="http://npmawesome.com/wp-content/uploads/2014/09/cloud9-chromebook.jpg" alt="" width="100%" />

## Summary

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Sublime is my personal preference. It&#8217;s blazingly fast, relatively cheap and I can customize it to match my needs via limitless selection of plugins.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Atom is a free alternative to Sublime that comes pretty close to feature parity, but you pay the performance penalty here. If you aren&#8217;t working on giant multi-GB repositories, you will be just fine in most cases.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Cloud 9 IDE allows you take your web development terminal anywhere where there is internet and a decent browser. If you and a buddy working on a project together, I recommend looking at Cloud 9 IDE for its amazing collaborative features.</span>
</li>

## What&#8217;s next?

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js <a href="http://loopback.io/">LoopBack framework</a>. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
</li>

&nbsp;