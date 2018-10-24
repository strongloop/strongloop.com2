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

<img src="https://strongloop.com/blog-assets/2018/Loopback-2018-wrap-up.png" alt="LoopBack 2018 Year in Review"/>

<!--more-->
## The LoopBack 4 Logo

As 2017 was drawing to a close, we asked the StrongLoop community for their help in selecting a logo for LoopBack 4. After reviewing five logo options and three color alternatives, over 200 folks determined the winning logo. 

<img src="https://strongloop.com/blog-assets/2018/01/loopback-4-logo-sample.png" alt="LoopBack 4 logo"/>

We provided more details on a dedicated blog post, which you can read [here](https://strongloop.com/strongblog/thanks-loopback-4-logo/).

## The LoopBack 4 Website

While we had previously announced the new LB 4 site on a milestone update, on June 11th Diana Lau provided a look at the site's genesis. She explained, "Back when we started to develop LoopBack 4, the team knew that a new codebase should be accompanied by a new logo and branding dedicated to this new version. We put these ideas aside while we focused on delivering the code." You can read more about the evolution of the logo, website design decisions and more [here](https://strongloop.com/strongblog/lb4-website/).

## LoopBack 4

We've provided some information on the LoopBack 4's logo and dedicated site, now let's review the many posts and updates we provided about the framework itself. For simplicity, we're running through in rough chronological order.

Early in the year Kevin Delisle announced that we added the new controller generation command to the lb4 CLI toolkit. Learn how you can can install with [npm i -g @loopback/cli](https://strongloop.com/strongblog/generate-controllers-loopback-4-cli/).

Kyu Shim explained another new feature in his post "Automatically Generate JSON Schema for your LoopBack 4 Models." if you want to leanr how to more effetcively deal with models and metadata in LoopBack 4, click [here](https://strongloop.com/strongblog/loopback-4-json-schema-generation/).

Speaking of new features, and so much of LoopBack 4 deals with new features, Raymond Feng demonstrates how you can use LoopBack 4 to track down dependency injections. Get examples and learn more about the options [here](https://strongloop.com/strongblog/loopback-4-track-down-dependency-injections/).

Miroslav Bajtoš looked at the dilemma that can surround example projects, useful learning resources that can become a maintenance burden. He provides insight and options in ["Moving LoopBack 4 Example Project to the Monorepo
https://strongloop.com/strongblog/moving-examples-to-monorepo/"](https://strongloop.com/strongblog/moving-examples-to-monorepo/).

With so much of the creation of LoopBack 4 revolving around a goal to be cutting edge, we had to make some tough choices to simpify and move forward. Biniam Admikew revealed one of these decisions at the end of February - LoopBack 4 was [dropping support for Node.js 6](https://strongloop.com/strongblog/loopback-4-dropping-node6). As he explained, "Node.js 6.x will be entering maintenance mode this April, and requires us to provide hacks and polyfills to maintain compatibility, which actively works against this goal".

Taranveer Virk introduced [@loopback/boot for LoopBack 4](https://strongloop.com/strongblog/introducing-boot-for-loopback-4/) in March. This LoopBack 4 package is a convention-based bootstrapper that reduces manual effort and automatically discovers artifacts and binds them to your Application’s Context. 

Curious about creating REST APIs? Diana Lau provided a three-part "LoopBack 4 GitHub Example Application" series. She  demonstrated how to build a basic LoopBack 4 application that [exposes REST APIs](https://strongloop.com/strongblog/loopback4-github-example-app-part1/); [calls out to GitHub APIs](https://strongloop.com/strongblog/loopback4-github-example-app-part2/) through octokat.js (a GitHub API client) to get the number of stargazers on a user-specified GitHub organization and repository; and [persists the data into a Cloudant database](https://strongloop.com/strongblog/loopback4-github-example-app-part3/). 


ncing LoopBack 4 Developer Preview 3 https://strongloop.com/strongblog/loopback-4-developer-preview-3




LoopBack 4 Model Relations Preview https://strongloop.com/strongblog/loopback4-model-relations

LoopBack 4 now has the infrastructure in place to understand relations between models and supports the hasMany relationship


---


Welcoming Model and Datasource Commands  to LB4 CLI  https://strongloop.com/strongblog/welcoming-model-and-datasource-commands-to-lb4-cli/
 
by Taranveer Virk This CLI tool is now able to generate Model and DataSource artifacts using the lb4 model and lb4 datasource command respectively.

---


LoopBack 4 Introduces Express Mode for CLI - As you have seen, LoopBack 4 CLI can help developers scaffold projects and provision artifacts in a few different ways.

https://strongloop.com/strongblog/loopback4-cli-express-mode

LoopBack 4 Improves Inbound HTTP Processing https://strongloop.com/strongblog/loopback4-improves-inbound-http-processing

Achieving Productivity with lb4 Repository Command
https://strongloop.com/strongblog/productivity-with-lb4-repository/

Mario Estrada To support this flow completely and start achieving productivity, we welcome the recently addition to the CLI options, lb4 repository. This option is very powerful and can accept multiple models, infer their ID property and generate a repository for each of them in one single command.


## Playing Well with OpenAPI Spec


Janny Hou 
LoopBack 4 Upgrades from Swagger to OpenAPI 3.0.0  https://strongloop.com/strongblog/upgrade-from-swagger-to-openapi-3/

Given the community feedback we have received in the last few months, we decided to adopt the OpenAPI 3.0.0 specification to describe the exposed RESTful APIs of a LoopBack application. LoopBack 4 users can now build their OpenAPI 3.0.0 endpoints with upgraded packages.

Turning OpenAPI Specifications into Action with LoopBack 4 https://strongloop.com/strongblog/loopback4-openapi-cli/

by Raymond Feng we’ll illustrate how easy it is to create REST APIs in Node.js from an OpenAPI specification using LoopBack 4. Let’s start the journey by first creating an empty LoopBack 4 application.

Fundamental Validations for HTTP Requests with LoopBack 4 and OpenAPI Spec https://strongloop.com/strongblog/fundamental-validations-for-http-requests/ by Janny Hou 


## More LoopBack Improvements and How-To Content

While we were looking to the future as we built LoopBack 4, we were still watching out for existing versions of LoopBack. 

Loopback developer Miroslav Bajtoš provided valuable input for maintenance and updating a Loopback back-end. While [his post](https://strongloop.com/strongblog/advice-for-loopback-backend-maintenance/) provides specifics aimed at a single-person project powered by LoopBack 2.x, Miroslav's information provides insight for a larger audience as well.

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

-

## LoopBack at Events

Throughout 2017 our Evangelist team continued to share their knowledge of LoopBack. We sponsored 33 events (meet-ups, conferences, workshops, and hackathons), sharing LoopBack content at 28 of them. We appeared at 5 events we did not sponsor, and held 3 webinars. Throughout each of these events, we were and are amazed at the enthusiasm LoopBack users share, and the intriguing questions and scenarios they can come up with. It’s this enthusiasm that has also helped shaped LoopBack’s growth and future.  

## A GitHub Milestone and Towards the Future

With all of this activity, a GitHub achievement almost went by unnoticed! [LoopBack hit 10k+](https://github.com/strongloop/loopback) stars in November. We are humbled by the support of our community, and invite you to "star" [strongloop/loopback-next](https://github.com/strongloop/loopback-next) as well!

With LoopBack 4 just about ready for prime time, we are looking forward to seeing how the community uses it and helps it grow.

## What about StrongLoop? 

Of course, the StrongLoop site had a big year too! In May, we announced changes to the focus of the [StrongLoop site](https://strongloop.com/strongblog/strongLoop-evolves-to-promote-open-source-solutions-for-the-api-developer-community). We summarized the change by looking at our old focus and outlining our new one:

"(We've made) the transition from showcasing our services to promoting community. While we proudly supported community since we launched, our previous site highlighted options from StrongLoop and IBM to help you build with node.js and power the API economy. Moving forward, this site embraces our role within the Open Source community that creates APIs and supporting the growth of that community."

With this new approach, we continue to bring Node.js updates - which is important to us since we are part of the [Node Foundation](https://foundation.nodejs.org/)). We are also highlighting three open source options for building APIs:  

* [LoopBack](http://loopback.io/)
* [API Microgateway](https://github.com/strongloop/microgateway)
* [Open API Initiative](https://www.openapis.org/)

## What's Next? 

