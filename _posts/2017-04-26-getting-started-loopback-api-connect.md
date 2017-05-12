---
id: 29277
title: Hello World, Getting started with LoopBack and API Connect
date: 2017-04-26T09:23:47+00:00
author: Dave Whiteley
guid: http://strongloop.com/?p=29277
permalink: /strongblog/hello-world-getting-started-loopback-api-connect/
categories: 
- API
- API Connect
- APIs
- docker
---

[Ted Neward](https://twitter.com/tedneward) recently posted about getting started with LoopBack and API Connect on IBM's 
[developerWorks blog](https://www.ibm.com/developerworks/library/wa-get-started-with-loopback-neward-1/index.html).  It is the first part of a series in which he plans to "introduce LoopBack, a server-side JavaScript framework that emphasizes building HTTP APIs." That's a goal we fully support!


[![Getting started with LoopBack and API Connect]({{site.url}}/blog-assets/2017/04/hello-world-300x228.png)]({{site.url}}/blog-assets/2017/04/hello-world-300x228.png)

Ted's blog covers a lot of ground:


<h3>The differences between StrongLoop, LoopBack and API Connect</h3>


As Ted explains, "As a newcomer to LoopBack, one of your first challenges will be figuring out what to call the technology you're using. LoopBack was a standalone entity owned by a company called StrongLoop (which was also the name of its paid service offering), until the company was acquired by IBM® in 2015. Since that time, the LoopBack team released a 3.0 version, and starting with this version it's consolidating the terms and names under the IBM banner with IBM API Connect™."


<h3>How to install and set up LoopBack</h3>


Ted says, "Like most JavaScript-based frameworks, LoopBack is accessible via npm and makes use of a globally installed command-line tool. The first step to getting started with LoopBack, thus, is to open a command-line terminal with Node.js on the PATH, and use npm to install it: 
npm install -g apiconnect."


<h3>Creating your first LoopBack API</h3>


"You can use apic to kick off the server process," Ted explains, "or you can let npm launch it. Go to the hello directory (the parent to the client, common, and server subdirectories), where the package.json file resides. There, you'll issue either the 
apic start or 
npm start command; either one will fire up the server to start listening for incoming requests."


<h3>LoopBack and API Connect</h3>


Finally, Ted runs through how you can move from LoopBack to use API Connect and its dashboard.

While we have given highlights above, the full post gives a mucvh more in-depth look at each of these topics. Get the low-down on all of this 
[here](https://www.ibm.com/developerworks/library/wa-get-started-with-loopback-neward-1/index.html).

 