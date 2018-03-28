---
layout: post
title: LB4 Test Blog
date: 1018-03-28T00:00:13+00:00
author: Dave Whiteley
permalink: /strongblog/lb4-github-example-app-part-1/
categories:
  - How-To
  - LoopBack
---

In this series, we will work through creating a basic LoopBack 4 application that exposes REST APIs; calls out to GitHub APIs through [octokat.js](https://github.com/philschatz/octokat.js) (a GitHub API client) to get the number of stargazers on a user-specified GitHub organization and repository; and persists the data into a Cloudant database.

<img src="https://strongloop.com/blog-assets/2018/04/github-app-overview.png" alt="Overview of the LoopBack GitHub app" style="width: 500px; margin:auto;"/>

<!--more-->
The series is organized as follows:

Part 1: Scaffolding a LoopBack 4 application and creating REST API

Part 2: Adding logic to a controller to talk to GitHub API

Part 3: Persisting data to Cloudant database using `DataSource` and `Repository`

## Before You Begin

Make sure you have [Node.js](https://nodejs.org/en/download/) v8 or higher installed. Since we will be using the LoopBack 4 [CLI](http://loopback.io/doc/en/lb4/Command-line-interface.html) to get started, install `@loopback/cli` as well. 

Run the following command: 
```
npm i -g @loopback/cli
```

## Let's Get Started

### Step 1: Scaffolding a LB4 Application



Follow the next steps above and try out the `http://127.0.0.1:3000/ping` endpoint, you'll get something like:
```
{  
   "greeting":"Hello from LoopBack",
   "date":"2018-03-19T17:22:16.159Z",
   "url":"/ping",
   "headers":{  
      "host":"localhost:3000",
      "connection":"keep-alive",
      "user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36",
      "upgrade-insecure-requests":"1",
      "accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      "accept-encoding":"gzip, deflate, br",
      "accept-language":"en-US,en;q=0.8"
   }
}
```
