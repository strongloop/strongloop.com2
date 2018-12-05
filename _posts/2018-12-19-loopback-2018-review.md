---
title: LoopBack 2018 Year in Review
date: 2018-12-19
author: Dave Whiteley
permalink: /strongblog/loopback-2018-review/
categories:
  - Community
  - LoopBack
published: false
---

For the past twelve months the LoopBack team has been working hard on the future of [LoopBack](http://loopback.io/) and LoopBack 4. As 2018 wraps up, we're looking back at the various developments throughout the year. The year began as we revealed the community-chosen logo for LoopBack 4 and wrapped up with the latest version of our framework GA and ready for production! In between, there were a lot of interesting moments. Join us as we take a look back!

<img src="https://strongloop.com/blog-assets/2018/Loopback-2018-wrap-up.png" alt="LoopBack 2018 Year in Review" style="width: 250px; margin:auto;"/>

<!--more-->
## The LoopBack 4 Logo

As 2017 drew to a close, we asked the StrongLoop community for their help in selecting a logo for LoopBack 4. After reviewing five logo options and three color alternatives, over 200 folks determined the winning logo, shown below. 

<img src="https://strongloop.com/blog-assets/2018/01/loopback-4-logo-sample.png" alt="LoopBack 4 logo" style="width: 250px; margin:auto;"/>

Want to see the other options and read more about the process? We provided more details on a dedicated blog post, which you can read [here](https://strongloop.com/strongblog/thanks-loopback-4-logo/).

## The LoopBack 4 Website

With a new logo in place, we also updated the LoopBack website with a section dedicated to [LoopBack 4](http://v4.loopback.io/). While we previously announced the new LB 4 site on a milestone update, on June 11th Diana Lau provided a more in-depth look at its genesis. She explained, "Back when we started to develop LoopBack 4, the team knew that a new codebase should be accompanied by a new logo and branding dedicated to this new version. We put these ideas aside while we focused on delivering the code." 

You can read more about the evolution of the logo, website design decisions and more [here](https://strongloop.com/strongblog/lb4-website/).

## LoopBack 4 Features, Previews and GA Announcement

With updates about LoopBack 4's logo and dedicated site covered, let's review the many updates we provided about the framework itself. 

We provided a [second](https://strongloop.com/strongblog/loopback-4-developer-preview-2) and [third LoopBack 4 Developer Preview 3](https://strongloop.com/strongblog/loopback-4-developer-preview-3) to let the community take a look at what we were cooking with the updated framework. 

Early in the year Kevin Delisle announced that we added the new controller generation command to the lb4 CLI toolkit. Learn how you can can install with [npm i -g @loopback/cli](https://strongloop.com/strongblog/generate-controllers-loopback-4-cli/).

Kyu Shim explained another new feature in his post "Automatically Generate JSON Schema for your LoopBack 4 Models." Learn how to deal with models and metadata more effectively in LoopBack 4 [here](https://strongloop.com/strongblog/loopback-4-json-schema-generation/).

Raymond Feng demonstrated how to use LoopBack 4 to track down dependency injections in another post. Examples and and information about options can be found [here](https://strongloop.com/strongblog/loopback-4-track-down-dependency-injections/).

Later in the year, Raymond shared new ways for developers to build, zeroing in on the LoopBack 4 CLI. "As you have seen, LoopBack 4 CLI can help developers scaffold projects and provision artifacts in a few different ways." LoopBack 4's [Express Mode for CLI](https://strongloop.com/strongblog/loopback4-cli-express-mode) allows developers to scaffold projects and provision artifacts in multiple ways, with more details in the post.

Loopback developer Miroslav Bajtoš Miroslav Bajtoš continued his work on LoopBack 4, both under the hood and in spreading the word of upcoming enhancements. He also examined the dilemma that can surround example projects. Specifically, he looked at how useful learning resources can become a maintenance burden. He provides insight and options taken for LoopBack 4 in ["Moving LoopBack 4 Example Project to the Monorepo"](https://strongloop.com/strongblog/moving-examples-to-monorepo/).

In June, Miroslav outlined some HTTP changes in ["LoopBack 4 Improves Inbound HTTP Processing"](https://strongloop.com/strongblog/loopback4-improves-inbound-http-processing).

With the LoopBack team working hard to make LoopBack 4 cutting edge, we made difficult decisions to simpify and move forward. Biniam Admikew revealed one of these decisions at the end of February: LoopBack 4 was [dropping support for Node.js 6](https://strongloop.com/strongblog/loopback-4-dropping-node6). As he explained, "Node.js 6.x will be entering maintenance mode this April, and requires us to provide hacks and polyfills to maintain compatibility, which actively works against this goal".

Biniam also looked into LoopBack 4's powerful ability to link its models with Model Relations in his [LoopBack 4 Model Relations Preview](https://strongloop.com/strongblog/loopback4-model-relations) post. He also pointed people towards documentation about defining and adding a hasMany relation to LoopBack 4 applications and an example tutorial for hands-on practice.

Taranveer Virk introduced [@loopback/boot for LoopBack 4](https://strongloop.com/strongblog/introducing-boot-for-loopback-4/) in March. This LoopBack 4 package is a convention-based bootstrapper that reduces manual effort and automatically discovers artifacts and binds them to your Application’s Context. 

Taranveer told us about more LoopBack 4's CLI tool in August. As he explained, "it is now able to generate Model and DataSource artifacts using the lb4 model and lb4 datasource command respectively." Read about it in [Welcoming Model and Datasource Commands to LB4 CLI](https://strongloop.com/strongblog/welcoming-model-and-datasource-commands-to-lb4-cli/).

In August, we announced that LoopBack is joining the recently announced Module LTS initiative and explained long-term support terms with Node.js LTS versions. Simply put, with the new LTS policy in place:

"We stay committed to keep fixing all bugs for at least the first 6 months after a LoopBack major version enters Active LTS mode... When a LoopBack version enters Maintenance LTS mode, we are committed to keep fixing critical and security issues for as long as the related Node.js LTS version stays supported by the Node.js project. This will typically offer much longer support than the previous minimum of 6 months." Get the details [here](https://strongloop.com/strongblog/loopback-adopts-module-lts-policy).

Guest blogger and LoopBack contributor Mario Estrada shared information on the lb4 repository CLI option. "This option," he shared, "is very powerful and can accept multiple models, infer their ID property and generate a repository for each of them in one single command." read about it in ["Achieving Productivity with lb4 Repository Command"](https://strongloop.com/strongblog/productivity-with-lb4-repository/).

With all of these feature announcements and previews, we were very pleased to finally announced that LoopBack 4 GA was ready for Production Use. Approripately enough, we made that announcement at [Node+JS Interactive](https://strongloop.com/strongblog/node-js-interactive-2018-wrap-up/) in Vancouver. 

"We’ve come a long way since LoopBack 4 was announced in April 2017 and the November release of the first Developer Preview release," we explained in the [blog announcement](https://strongloop.com/strongblog/loopback-4-ga). "The open source framework continues to be a leading Node.js API creation platform that empowers developers to create APIs quickly on top of existing backend resources. The LoopBack team rewrote a brand new core from the ground up in TypeScript, providing even better extensibility and flexibility. This latest version is simpler to use and easier to extend. 

We followed up with some queries about LoopBack 4 that people asked us as the event. You can find the questions and answers [here](https://strongloop.com/strongblog/nodejs-interactive-2018-lb-questions/).

## More LoopBack How-To Content

While we were looking to the future as we built LoopBack 4, we continued to provide tutorials and "how to" content" for LoopBack as well.  

Miroslav Bajtoš provided valuable input for maintenance and updating a Loopback back-end. While [his post](https://strongloop.com/strongblog/advice-for-loopback-backend-maintenance/) provides specifics aimed at a single-person project powered by LoopBack 2.x, Miroslav's information provides insight for a larger audience as well.

Bradley Holt gave us the information needed to serve a progressive web app from LoopBack which you can check out [here](https://strongloop.com/strongblog/serving-a-progressive-web-app-from-loopback/).
 
Looking at the current improvements to Cloudant connector, Janny Hou discussed the support of LoopBack model indexes to optimize query performance. Learn more about index support for Cloudant Model in [this post](https://strongloop.com/strongblog/loopback-index-support-cloudant-model/).

Ivan Dovgan studied the pros and cons to embedding a frontend framework into LoopBack, providing tips on the best way to do so [here](https://strongloop.com/strongblog/embeddding-frontend-frameworks-into-loopback).

Curious about creating REST APIs? Diana Lau provided a three-part "LoopBack 4 GitHub Example Application" series. She  demonstrated how to build a basic LoopBack 4 application that [exposes REST APIs](https://strongloop.com/strongblog/loopback4-github-example-app-part1/); [calls out to GitHub APIs](https://strongloop.com/strongblog/loopback4-github-example-app-part2/) through octokat.js (a GitHub API client) to get the number of stargazers on a user-specified GitHub organization and repository; and [persists the data into a Cloudant database](https://strongloop.com/strongblog/loopback4-github-example-app-part3/). 

Hage Yaapa demonstrated how to [deploy LoopBack 4 applications to IBM Cloud](https://strongloop.com/strongblog/deploying-to-ibm-cloud/), via a tutorial to get you going.

The LoopBack team took notice of API Explorer for its ability to render a live documentation for the REST API provided by any LoopBack application. With the recent improvements in LoopBack 4's REST layer, the team was able to introduce a self-hosted version of that works fully offline. Leanr more [here](https://strongloop.com/strongblog/how-we-built-a-self-hosted-rest-api-explorer/).

"The LoopBack framework is a powerful and flexible tool that can be used in many different ways," explained Miroslav at the beginning of another one of his posts. With this in mind, he provided some [best practices for LoopBack 4](https://strongloop.com/strongblog/loopback-4-best-practices/) by pointing us to Best Practice guides.

Of course, even with these articles and guides, there are still times when you just need to do your search for how to do something with LoopBack through documentation. While this can be a daunting task, Taranveer Virk announced mid-year that LoopBack Doc Search is now powered by Watson. As he explained, "when you have over a 1000 pages of documentation, it becomes a necessity to be able to search the documentation effectively to find relevant content. With this in mind, we’ve recently changed to powering LoopBack documentation search with IBM Watson Discovery instead of Google Custom Search." Read [the full post](https://strongloop.com/strongblog/loopback-doc-search-powered-by-watson/)to learn more.  


## Playing Well with OpenAPI Spec

WIth IBM supporting the [OpenAPI Initiative](https://www.openapis.org/), it shouldn't surprise anyone that the LoopBack team uses the spec they offer. 

Janny Hou described how LoopBack 4 upgraded from Swagger to [OpenAPI Spec 3.0.0](https://strongloop.com/strongblog/upgrade-from-swagger-to-openapi-3/), based on community feedback. "LoopBack 4 users," she stated, "can now build their OpenAPI 3.0.0 endpoints with upgraded packages". Janny also looked at LoopBack 4, OpenAPI Spec, and fundamental validations for HTTP requests in [another post](https://strongloop.com/strongblog/fundamental-validations-for-http-requests/).

Raymond Feng demonstarted how to simply create REST APIs in Node.js from an OpenAPI Specification using LoopBack 4 in [this post](https://strongloop.com/strongblog/loopback4-openapi-cli/).

We look forward to continuing to see how we can work with OpenAPI Spec!

## Downloads, GitHub Activity and Looking Towards the Future

With all of this activity, we weren't surprised to see LoopBack downloads and GitHub status continue to grow. 

There were  approximately 1.5 millions downloads for LoopBack 2 and lb3 throughout 2018 - a 21% increase from 2017. We also saw a big increase for LoopBack 4 at 115,000 downlaods - 13 times more than last year. 

LoopBack passed the [12,000 star count]((https://github.com/strongloop/loopback)) near the end of November and sits at 12,077 stars as of publication time, while [LoopBack 4](https://github.com/strongloop/loopback-next) is at 1200+!

## What's Next? 
