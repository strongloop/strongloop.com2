---
title: 'New Life for LoopBack Docs'
date: 2016-10-11T08:05:36+00:00
author: C. Rand McKinney
permalink: /strongblog/new-life-for-loopback-docs/
categories:
  - LoopBack
layout: redirected
published: true

---

There’s an old saying: “Give someone a fish, and they eat for a day; but teach them to fish, and they eat for a lifetime.” Metaphorically, that’s the value proposition of open-source development: it enables you to take control of your own destiny, to “fish for” (collaborate on) features and changes, instead of merely taking what’s handed to you. LoopBack has always been an open-source project; the bulk of the documentation, however, has not been. Now, I’m happy to announce that we’re making the LoopBack documentation open source. 

<!--more-->

We’re in the final stages of moving the LoopBack documentation from docs.strongloop.com – where it was hosted in a commercial wiki and wasn’t generally available for public editing – to [loopback.io/doc](https://loopback.io/doc/), where it will be [hosted in GitHub](https://github.com/strongloop/loopback.io/) and thus will be open for direct contributions. Anyone will be able to edit the documentation via pull requests, as they already can do with the software. Over the last few weeks, we’ve been working hard to migrate the documentation from the old site to the new one, which meant converting from HTML to markdown plus some Jekyll tags. We were greatly helped by the efforts of several members of the LoopBack community: [@marc-ed-raffalli](https://github.com/marc-ed-raffalli) wrote a Node script to perform the conversion and [@doublemarked](https://github.com/doublemarked) helped in various ways, including link checking. Several others have volunteered to help with translation. In general, we look forward to having the community more directly involved in helping with LoopBack’s documentation. Fishing season is open! Of course, we’ll continue to work on improving the documentation, especially with the release of LoopBack 3.0.

### New documentation site

Many of you may already be familiar with loopback.io as a micro-site that provides a quick overview of LoopBack. It will continue in this role, but now in addition at loopback.io/doc, it will also contain all the LoopBack documentation. Befitting its new open-source nature, the site also will become the primary place to view community contribution guidelines, coding standards, and so on. As well, there’s a place for folks to show off their LoopBack-related community projects. loopback.io site The new documentation site is built on the Jekyll / GitHub Pages platform, used by many open-source projects. To save time, we leveraged [Tom Johnson’s excellent documentation theme for Jekyll](https://github.com/tomjoht/documentation-theme-jekyll). This enabled us to easily provide several important features:

- Responsive display for a variety of devices (using Bootstrap).

- Search using Google custom site search (initial implementation). Although the Jekyll template didn’t use Google, it was easy to drop it in.

- Ability to generate PDFs. Users often request this.

- Easy-to-use navigation. The original sidebar navigation widget left some things to be desired, so [@Sequoia](https://github.com/Sequoia) reworked it using basic Bootstrap constructs.

- Google analytics, to track site usage patterns.

The documentation Jekyll theme also provides a number of features that are very useful for documentation: templates for things like “alerts”, article tagging, several different useful layouts, a button to “Edit this page” (in GitHub) on each page, and so on. We’re not yet using some of the features, but as we move forward with the project we may adopt (and adapt) them as needed. Available translations for LoopBack documentation In recognition that English is spoken by only a small fraction of the people in the world, enabling documentation in other languages is also a priority. It’s a sign of LoopBack’s popularity that we already had some documentation translated into several languages by members of the community. We’re working on migrating that content to the new site. More importantly, we’ve made it easy for people to contribute new translations, as there’s been quite a bit of interest in doing so.

### Consolidating docs from multiple repos

As you probably know, the LoopBack project encompasses many repositories, in addition to the core loopback repo; for example: loopback-datasource-juggler, loopback-boot, loopback-phase, many data source connector repos, and several component repos, not to mention many loopback-example-* repos. Each of these repos has its own README file, and we’d like to incorporate that documentation in the new doc site. This will enable each repo to have some documentation of its own as well as being part of the larger LoopBack documentation site. However, manually copying and pasting the READMEs would be time-consuming and could lead to them getting out of sync with the originals. Although there’s a Jekyll plug-in to display markdown files in other repos, GitHub Pages’ Jekyll implementation doesn’t allow it (for security reasons). So, to provide this capability we’re pioneering a process to grab READMEs from multiple repositories using the GitHub API and display them as part of the LoopBack doc site. We’re using a similar technique for Express documentation on [expressjs.com](http://expressjs.com/). Look for more details on this innovation in a future blog post.

### Contribute!

The new doc site represents a new step in the evolution of LoopBack. But it’s still very much a work-in-progress. We invite your contributions to improve LoopBack’s documentation. 
