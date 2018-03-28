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

DW 1

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

Use `lb4` command and follow the prompts to create a new LB4 application. 

```
$ lb4
? Project name: loopback4-github-app
? Project description: LoopBack4 application that calls GitHub for data
? Project root directory: loopback-4-github-app
? Application class name: GitHubApplication
? Select project build settings:  Enable tslint, Enable prettier, Enable mocha, Enable loopbackBuild

<<some more output>>
 
Application loopback4-github-app is now created in loopback-4-github-app.

Next steps:

$ cd loopback-4-github-app
$ npm start
```

