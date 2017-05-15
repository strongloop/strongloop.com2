---
title: Announcing the LoopBack CLI
date: 2017-01-17T13:53:26+00:00
author: Chanda Dharap
permalink: /strongblog/announcing-the-loopback-cli/
categories:
- LoopBack
- Community
---
Three years ago we released `slc`, a veritable swiss-army knife for building and managing Node applications. The `slc` command-line interface (CLI) also included commands for scaffolding  and modifying [LoopBack](http://loopback.io/) apps.

Over the last year, as part of the Strongloop-IBM journey, we’ve integrated the API creation aspects of LoopBack with the API management aspects of IBM’s existing solutions. With that, we’ve made progress on extending the Loopback roadmap.  As part of this path, we’ve now given LoopBack its very own CLI.

<!--more-->

We’ve shortened the namespace, but essentially `loopback-cli` delegates to the `generator-loopback` Yeoman generator as `slc` did.

Because the \`loopback-cli\` module is purely a development tool and doesn&#8217;t include any runtime tooling, you can install it without [installing native compiler tools](http://loopback.io/doc/en/lb2/Installing-compiler-tools.html), which makes it a snap to install.

Install it with this command :

<pre class="lang:default decode:true">$ npm install –g loopback-cli</pre>

Then enter \`lb -l\` to list all available commands:

<pre class="lang:default decode:true">lb acl  
lb app   
lb boot-script   
lb datasource   
lb export-api-def   
lb middleware   
lb model   
lb property   
lb relation   
lb remote-method   
lb swagger
</pre>

As you would expect, \`lb -h\` gives you command help.

To scaffold a new LoopBack application and install LoopBack as a dependency, simply use the `lb` (or `lb app`) command. This command is the equivalent of `slc loopback.`

For a summary of all the commands, see [Command-line tools](http://loopback.io/doc/en/lb3/Command-line-tools.html) in the LoopBack documentation.

Additionally, over the last year we’ve made some effort at collecting LoopBack metrics; for example:

  * We get an average of 50-60 incoming issues in each two-week sprint, including bugs feature requests, pull requests for fixes, and questions.
  * On average we fix, triage, close, or request more information for around 20 issues each sprint.
  * Recently we&#8217;ve started looking through old issues and begun closing out those that are &#8220;stale&#8221; and triaging others to determine if they will make it on the near-term roadmap.

LoopBack continues to grow actively, and the API Connect team at IBM is dedicated to develop, support and maintain the open source framework. API Connect will support the deployment functionality of `slc`, and `loopback-cli` itself will continue to support all Loopback functionality – current and new.

As always, LoopBack is open source and we welcome your contributions.
