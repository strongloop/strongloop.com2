---
title: LoopBack 2018 Year in Review
date: 2018-12-19T01:00:13+00:00
author: Dave Whiteley
permalink: /strongblog/loopback-2018-review/
categories:
  - Community
  - LoopBack
published: false
---

The past twelve months have been huge for the LoopBack team. As 2018 wraps up, we want to take a look at the various developments throughout the year for StrongLoop and [LoopBack](http://loopback.io/). The year began as we revealed the community-chosen logo for LoopBack 4 and wrapped up with the latest version of our framework GA and ready for production! In between, there were a lot of interesting moments. Join us as we take a look back!

<img src="https://strongloop.com/blog-assets/2018/Loopback-2018-wrap-up.png" alt="LoopBack 2018 Year in Review" style="width: 250px; margin:auto;"/>

<!--more-->
## The LoopBack 4 Logo

As 2017 was drawing to a close, we asked the StrongLoop community for their help in selecting a logo for LoopBack 4. After reviewing five logo options and three color alternatives, over 200 folks determined the winning logo. 

<img src="https://strongloop.com/blog-assets/2018/01/loopback-4-logo-sample.png" alt="LoopBack 4 logo" style="width: 250px; margin:auto;"/>

We provided more details on a dedicated blog post, which you can read [here](https://strongloop.com/strongblog/thanks-loopback-4-logo/).

## The LoopBack 4 Website

While we had previously announced the new LB 4 site on a milestone update, on June 11th Diana Lau provided a look at the site's genesis. She explained, "Back when we started to develop LoopBack 4, the team knew that a new codebase should be accompanied by a new logo and branding dedicated to this new version. We put these ideas aside while we focused on delivering the code." 

You can read more about the evolution of the logo, website design decisions and more [here](https://strongloop.com/strongblog/lb4-website/).

## LoopBack 4

We've provided some information on the LoopBack 4's logo and dedicated site, now let's review the many posts and updates we provided about the framework itself. While we provided a [second](https://strongloop.com/strongblog/loopback-4-developer-preview-2) and [third LoopBack 4 Developer Preview 3](https://strongloop.com/strongblog/loopback-4-developer-preview-3) to let the community take a look at what we were cooking, we'll run through our LoopBack updates in rough chronological order.

Early in the year Kevin Delisle announced that we added the new controller generation command to the lb4 CLI toolkit. Learn how you can can install with [npm i -g @loopback/cli](https://strongloop.com/strongblog/generate-controllers-loopback-4-cli/).

Kyu Shim explained another new feature in his post "Automatically Generate JSON Schema for your LoopBack 4 Models." if you want to learn how to more effetcively deal with models and metadata in LoopBack 4, click [here](https://strongloop.com/strongblog/loopback-4-json-schema-generation/).

Speaking of new features, and so much of LoopBack 4 deals with new features, Raymond Feng demonstrates how you can use LoopBack 4 to track down dependency injections. Get examples and learn more about the options [here](https://strongloop.com/strongblog/loopback-4-track-down-dependency-injections/).

Loopback developer Miroslav Bajtoš looked at the dilemma that can surround example projects, useful learning resources that can become a maintenance burden. He provides insight and options in ["Moving LoopBack 4 Example Project to the Monorepo
https://strongloop.com/strongblog/moving-examples-to-monorepo/"](https://strongloop.com/strongblog/moving-examples-to-monorepo/).

With so much of the creation of LoopBack 4 revolving around a goal to be cutting edge, we had to make some tough choices to simpify and move forward. Biniam Admikew revealed one of these decisions at the end of February - LoopBack 4 was [dropping support for Node.js 6](https://strongloop.com/strongblog/loopback-4-dropping-node6). As he explained, "Node.js 6.x will be entering maintenance mode this April, and requires us to provide hacks and polyfills to maintain compatibility, which actively works against this goal".

Taranveer Virk introduced [@loopback/boot for LoopBack 4](https://strongloop.com/strongblog/introducing-boot-for-loopback-4/) in March. This LoopBack 4 package is a convention-based bootstrapper that reduces manual effort and automatically discovers artifacts and binds them to your Application’s Context. 

Curious about creating REST APIs? Diana Lau provided a three-part "LoopBack 4 GitHub Example Application" series. She  demonstrated how to build a basic LoopBack 4 application that [exposes REST APIs](https://strongloop.com/strongblog/loopback4-github-example-app-part1/); [calls out to GitHub APIs](https://strongloop.com/strongblog/loopback4-github-example-app-part2/) through octokat.js (a GitHub API client) to get the number of stargazers on a user-specified GitHub organization and repository; and [persists the data into a Cloudant database](https://strongloop.com/strongblog/loopback4-github-example-app-part3/). 

Miroslav Bajtoš continued his work on LoopBack 4, both under the hood and in spreading the word of upcoming enhancements. In June, he outlined some HTTP changes in ["LoopBack 4 Improves Inbound HTTP Processing"](https://strongloop.com/strongblog/loopback4-improves-inbound-http-processing) .

Biniam Admikew looked into LoopBack 4's powerful ability to link its models with Model Relations in his [LoopBack 4 Model Relations Preview](https://strongloop.com/strongblog/loopback4-model-relations) post. He also pointed people towards documentation about defining and adding a hasMany relation to LoopBack 4 applications and an example tutorial for hands-on practice.

In July, Raymond Feng shared new ways for developers to build, zeroing in on the LoopBack 4 CLI. "As you have seen, LoopBack 4 CLI can help developers scaffold projects and provision artifacts in a few different ways." LoopBack 4's [Express Mode for CLI](https://strongloop.com/strongblog/loopback4-cli-express-mode) allows developers to scaffold projects and provision artifacts in multiple ways, with more details in the post.

Taranveer Virk told us about more LoopBack 4's CLI tool in August. As he explained, "it is now able to generate Model and DataSource artifacts using the lb4 model and lb4 datasource command respectively." Read about it in [Welcoming Model and Datasource Commands to LB4 CLI](https://strongloop.com/strongblog/welcoming-model-and-datasource-commands-to-lb4-cli/).

Guest blogger and LoopBack contributor Mario Estrada shared information on the lb4 repository CLI option. "This option," he shared, "is very powerful and can accept multiple models, infer their ID property and generate a repository for each of them in one single command." read about it in ["Achieving Productivity with lb4 Repository Command"](https://strongloop.com/strongblog/productivity-with-lb4-repository/).


Best Practices for LoopBack 4 https://strongloop.com/strongblog/loopback-4-best-practices/

by Miroslav Bajtoš The LoopBack framework is a powerful and flexible tool that can be used in many different ways. Some of these ways lead to better results while others can create headaches later in the project lifecycle. To make it easy for LoopBack users to do the right thing in their projects, we have created Best Practice guides.

We announced that LoopBack 4 GA is Now Ready for Production Use at Node+JS Interactive in Vancouver in October.

by Diana Lau , Raymond Feng , Miroslav Bajtoš gave details We’ve come a long way since LoopBack 4 was announced in April 2017 and the November release of the first Developer Preview release. The open source framework continues to be a leading Node.js API creation platform that empowers developers to create APIs quickly on top of existing backend resources. The LoopBack team rewrote a brand new core from the ground up in TypeScript, providing even better extensibility and flexibility. This latest version is simpler to use and easier to extend. https://strongloop.com/strongblog/loopback-4-ga

We followed up with some quesries baout LB 4 asked at the event: https://strongloop.com/strongblog/nodejs-interactive-2018-lb-questions/

Deploying LoopBack 4 applications to IBM Cloud by Hage Yaapa https://strongloop.com/strongblog/deploying-to-ibm-cloud/


## More LoopBack Improvements and How-To Content

While we were looking to the future as we built LoopBack 4, we were still watching out for existing versions of LoopBack. 

Miroslav Bajtoš provided valuable input for maintenance and updating a Loopback back-end. While [his post](https://strongloop.com/strongblog/advice-for-loopback-backend-maintenance/) provides specifics aimed at a single-person project powered by LoopBack 2.x, Miroslav's information provides insight for a larger audience as well.

- Serving a Progressive Web App from LoopBack https://strongloop.com/strongblog/serving-a-progressive-web-app-from-loopback/
by Bradley Holt 

- LoopBack Doc Search Powered by Watson by Taranveer Virk 

When you have over a 1000 pages of documentation, it becomes a necessity to be able to search the documentation effectively to find relevant content. With this in mind, we’ve recently changed to powering LoopBack documentation search with IBM Watson Discovery instead of Google Custom Search. Read on to learn more about the new search.  https://strongloop.com/strongblog/loopback-doc-search-powered-by-watson/

- LoopBack Offers Index Support for Cloudant Model by Janny Hou 
https://strongloop.com/strongblog/loopback-index-support-cloudant-model/

Cloudant connector hit its 2.x major release with several improvements. The most significant change is the support of LoopBack model indexes to optimize query performance.

In loopback-connector-cloudant@1.x, all properties are treated indexable. It could cause a slow response time when called with larger data set. In version 2.x we allow users to specify indexable properties and multiple properties in a composed index. The connector then creates proper indexes based on the model definition.

- Embedding Frontend Frameworks into LoopBack

by Ivan Dovgan  There are pros and cons to embedding a frontend framework into LoopBack. This post shows you how to do it. If you just want a working example, look at my loopback-vue-starter.
https://strongloop.com/strongblog/embeddding-frontend-frameworks-into-loopback

- in August LoopBack is joining the recently announced Module LTS initiative and aligns the long-term support terms with Node.js LTS versions.

With the new LTS policy in place:

    We stay committed to keep fixing all bugs for at least the first 6 months after a LoopBack major version enters Active LTS mode. (No changes here.)

    When a LoopBack version enters Maintenance LTS mode, we are committed to keep fixing critical and security issues for as long as the related Node.js LTS version stays supported by the Node.js project. This will typically offer much longer support than the previous minimum of 6 months.

https://strongloop.com/strongblog/loopback-adopts-module-lts-policy



## Playing Well with OpenAPI Spec

WIth IBM supporting the [OpenAPI Initiative](https://www.openapis.org/), it shouldn't surprise anyone that the LoopBack team uses the spec they offer. 

Janny Hou described how LoopBack 4 upgraded from Swagger to [OpenAPI Spec 3.0.0](https://strongloop.com/strongblog/upgrade-from-swagger-to-openapi-3/), based on community feedback. "LoopBack 4 users," she stated, "can now build their OpenAPI 3.0.0 endpoints with upgraded packages". Janny also looked at LoopBack 4, OpenAPI Spec, and fundamental validations for HTTP requests in [another post](https://strongloop.com/strongblog/fundamental-validations-for-http-requests/).

Raymond Feng demonstarted how to simply create REST APIs in Node.js from an OpenAPI Specification using LoopBack 4 in [this post](https://strongloop.com/strongblog/loopback4-openapi-cli/).

We look forward to continuing to see how we can work with OpenAPI Spec!

## LoopBack at Events

Throughout 2017 our Evangelist team continued to share their knowledge of LoopBack. We sponsored 33 events (meet-ups, conferences, workshops, and hackathons), sharing LoopBack content at 28 of them. We appeared at 5 events we did not sponsor, and held 3 webinars. Throughout each of these events, we were and are amazed at the enthusiasm LoopBack users share, and the intriguing questions and scenarios they can come up with. It’s this enthusiasm that has also helped shaped LoopBack’s growth and future.  

## GitHub Activity and Looking Towards the Future

With all of this activity, LoopBack's GitHub status continued to grow. LoopBack is currently at [11,877](https://github.com/strongloop/loopback) stars as of publication time, while [LoopBack 4](https://github.com/strongloop/loopback-next) is at 1058!


## What's Next? 
