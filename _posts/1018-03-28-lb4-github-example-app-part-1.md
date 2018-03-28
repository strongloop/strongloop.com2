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

## DELETED Let's Get Started

## Step 2: Generating the Controller for Creating REST APIs

A [Controller](http://loopback.io/doc/en/lb4/Controllers.html) is where you implement the business logic. We are going to generate the controller for our REST endpoint `/repo/{org}/{repo}/stars`, which will get the number of stargazers for the user-specified GitHub organization and repository.  

Run the `lb4 controller` command as follows: 
```
$ lb4 controller
? Controller class name: GHRepo
? What kind of controller would you like to generate? Empty Controller
   create src/controllers/gh-repo.controller.ts
```
Note: the class name will be suffixed with `Controller`.

## Step 3: Create REST Endpoints in GHRepoController

Go to `GHRepoController` (in `controllers\gh-repo.controller.ts`) that was generated in the previous step, and add the following function that corresponds to the `GET /repo/{org}/{repo}/stars` endpoint:

```ts
@get('/repo/{org}/{repo}/stars') 
getRepoStargazers(
  @param.path.string('org') org: string,
  @param.path.string('repo') repo: string
): string {
  //Add some simple logic here for now to test out the API
  console.log('org/repo', org, repo);
  return '100';
}
```

You also need to add the import statement below:
```ts
import {get, param} from "@loopback/openapi-v3";
```
## Step 4: Testing the REST Endpoint

Before adding in more logic, let's test the endpoint we've just created. Run the command `npm start` to start the application.  

Go to a browser and type:
```
http://localhost:3000/swagger-ui
```
This will bring you to the API explorer where you can test your API. Try out the newly added REST API Under `GHRepoController`.

![Screen shot](../blog-assets/2018/04/screenshot-ghRepoController-apiExplorer.png)

The response body should be `100` regardless of the value of the input parameters.

Tip: If you want to look at the corresponding OpenAPI specification, type in the browser:
```
http://localhost:3000/openapi.json
```

## What's Next

In part 2, we will add more logic in `GHRepoController` to talk to GitHub APIs through `octokat.js`, a GitHub API client.

## Code Repository

The code for this GitHub example application can be found [here](https://github.com/dhmlau/loopback4-github-app). The `part1` branch has everything accomplished in this article.
```
git clone https://github.com/dhmlau/loopback4-github-app.git
git checkout part1
```
