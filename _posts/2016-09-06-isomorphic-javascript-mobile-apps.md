---
id: 27941
title: Isomorphic JavaScript Mobile Apps
date: 2016-09-06T10:45:16+00:00
author: Joe Sepi
guid: https://strongloop.com/?p=27941
permalink: /strongblog/isomorphic-javascript-mobile-apps/
categories:
  - JavaScript Language
  - LoopBack
  - Mobile
  - Node core
---

**Note:** This blog post is also available at [IBM DeveloperWorks](https://developer.ibm.com/node/2016/09/06/isomorphic-javascript-mobile-apps/).  

The method of delivering content to a browser has continued to evolve over the years. In the early days, every page was a full payload. If you clicked a link, you got a new page. If you hit the back button, you were delivered a new full page.

With the advent of AJAX (Asynchronous JavaScript and XML), web pages started to become more interactive without full page loads. Form submissions are the perfect example: a user fills out a form, hits the submit button, a spinner shows that something is happening, and finally the page displays a success/fail message. Previously, a user would click **Submit** on the form, that would perform an HTTP POST of the form data to the server, which would return a new page showing success or fail. This new AJAX method felt slicker and more “app-like”. This was only the beginning&#8230;

<!--more-->

It didn’t take long for “web apps” to emerge that took the AJAX approach to the next level where every aspect of the app was “ajax-ified.”  These web apps became known as Single Page Applications (SPAs).

Apps like Gmail and Google Maps felt like desktop applications in the browser. This was a great user experience: once the web application loaded, it was fully interactive without loading another page in the browser. And there’s the rub&#8230;

The biggest problem with SPAs is that they typically need to download and parse all the JavaScript and assets before showing the user anything beyond a loading screen. It is also not uncommon to load/parse your JavaScript and then need to make additional requests to the server for more data to populate your application. In some cases, it may be “acceptable” for users to sit through a loading screen; Gmail is a good example. SPAs have become pervasive, conditioning users to not become disgruntled when they have to wait through a loading screen sits before seeing their content. But for sites like Amazon or Twitter, this wait time is unacceptable. Studies have shown that milliseconds matter during page load where the longer a user waits, the more often users will abort. Consequently, for sites that are generating revenue, the higher the bounce rate (the rate that users leave before the page loads), the less money the site will bring in.

Another issue with SPAs was search-engine optimization (SEO), because search engine bots have trouble parsing JavaScript to determine the page content and how it should be weighted in search results. Although Google has gotten better at dealing with this issue over the years, it is still a concern. Together, these issues led many sites to abandon the SPA approach.

The next phase in content delivery became a hybrid approach. The initial page load was fully formed HTML that the browser could receive and display. The page loaded faster and was functional upon being presented to the user. “But what about all that AJAXy web app goodness,” you ask? Well, part two of this hybrid process is to backfill the interactivity that we have grown used to and expect. The page is loaded and functional, then all of the AJAX interactions are added to enhance the experience for the user. This gave us the best of both worlds and that&#8217;s how many sites and web apps work today.

As Node.js has become the go-to choice for the backend for web applications, this hybrid approach becomes highly favorable and easier to implement. If you are not using JavaScript on the server, you can still achieve this hybrid approach. For example, Mustache HTML templates work both for PHP as well as JavaScript, but you’ll find issues along the way and it can be tricky to implement and maintain. However, if you have JavaScript on the server, you then have a number of choices of template systems that you can seamlessly share between the client and the server. You are also able to share business logic written in JavaScript both on the server and the client. It starts to look like we have a holy grail: JavaScript everywhere!

These days, a number of frameworks support isomorphic JavaScript (aka &#8220;universal JavaScript&#8221;), such as: [LoopBack](http://loopback.io/), [Meteor](https://www.meteor.com/), [Rendr](http://rendrjs.github.io/), and [Derby](http://derbyjs.com/). You can also use view frameworks such as [React](https://facebook.github.io/react/) on both the server and client. And tooling like [Browserify](http://browserify.org/) makes JavaScript written for the server usable in the browser.

Isomorphic Javascript has a number of benefits:

  * **SEO**: Pages are searchable when they first load.
  * **Perceived performance**: page loads fast and interactivity is available immediately.
  * **Actual performance**: initial page load is typically lighter; additional requests are only made to enhance the experience.
  * **Accessibility**: serving a fully-formed HTML page initially better meets accessibility needs; can be run without JavaScript.
  * **Better developer experience**: single language codebase with better maintainability and less context switching; shared code; shared tooling.

All of this adds up to being the best of all worlds.

Despite all these advantages, Node.js isn’t the best solution for all needs. Tasks that require intensive computation are better suited for other languages. But the Node.js platform handles most typical web applications nicely.
