---
title: 'LoopBack Doc Search Powered by Watson'
layout: post
date: 2018-05-30T00:00:13+00:00
author: Taranveer Virk
permalink: /strongblog/loopback-doc-search-powered-by-watson/
categories:
  - LoopBack
  - Watson
  - Cloud
---

When you have over a 1000 pages of documentation, it becomes a necessity to be able to search the documentation effectively to find relevant content. With this in mind, we've recently changed to powering [LoopBack documentation](http://loopback.io/doc/) search with [IBM Watson Discovery](https://www.ibm.com/watson/services/discovery/) instead of Google Custom Search. Read on to learn more about the new search.

<!--more-->

Google Custom Search has a few issues -- namely ads in search results and lack of context around a search (for example, searching in LoopBack 3 docs will show results for all versions of LoopBack. We looked at several other options to see what might best suit our needs.  

## Alternatives Considered

### Lunr.js

[lunr.js](https://lunrjs.com/) is a great indexing library with support for multiple languages. It was explored as an alternative but the size of LoopBack documentation - over 1000 pages - was a concern. The pre-built index was over 9MB, compressed was still over 4MB. This alone was reason enough for us to pass on this option, but there were also concerns raised in the library's repository stating the site would become unresponsive on mobile devices if index size was over 1MB. 

### Elasticsearch

Another solution we considered was Elasticsearch, a full-text search engine. It's one of the most popular solutions to consider when trying to implement full-text search. While this would have been a great solution, it also would've required us to maintain the Elasticsearch server. We opted to not pursue this option because of the maintenance efforts - we would rather dedicate our resources to LoopBack Development and Support.

### Duck Duck Go Custom Search

Duck Duck Go is a privacy minded search engine alternative to Google that similarly also provides custom search. A quick test showed it would've still served ads and that it also lacked context aware search. As such, we dropped this as an alternative.

### Watson Discovery

[IBM Watson Discovery](https://www.ibm.com/watson/services/discovery/) allows search queries to be filtered based on some additional metadata (in our case LoopBack version). It also doesn't serve any ads. Watson Discovery met the criteria for our new search and since last week has been powering the [LoopBack Docs](http://loopback.io/doc/) search. Try it out for yourself! 

## Implementation

Implementing a new search presented some challenges such as keeping Watson up-to-date, making results context aware (on a static website), and creating a new search results page and a way to query the search results from Watson without credentials.

### Proxy Search Function

Watson Discovery doesn't provide readonly credentials and as such can't be called directly from the front end. Instead, it  requires the use of a proxy service. We implemented the proxy as a serverless function deployed on [IBM Cloud Functions](https://www.ibm.com/cloud/functions). This offers a simple solution that is easy to maintain, scale and use while hiding the Watson Discovery credentials. The proxy function code can be viewed in the new [strongloop/loopback.io-search](https://github.com/strongloop/loopback.io-search) repository.

### Context Aware Search

You can now search for a word from the home page and the search results will include results from all versions of LoopBack. But if you are in the documentation for a particular version of LoopBack, searching from that page will only show results relevant to that version (version context -- set as the sidebar value on each page as a hidden form input).

An example is searching for the word `controller`:

- From the [docs home page](http://loopback.io/doc/) it returns [250 results](http://loopback.io/search/?q=controller&offset=0)
- From the [LoopBack 4 home page](http://loopback.io/doc/en/lb4/index.html) it returns only [39 results](http://loopback.io/search/?q=controller&sidebar=lb4_sidebar&offset=0)

### Auto-Deploy

Whenever changes are merged to the `gh-pages` branch for [`loopback.io` repository](https://github.com/strongloop/loopback.io), Travis CI is used to upload the documentation to Watson Discovery into a new collection. Once the collection is ready for use, the older collection is deleted and the search proxy uses the only collection it has available (or the oldest collection if multiple exist). This automation allows the search to always be up-to-date and requires no maintenance effort from the team.

### Search Results Page

<img class="aligncenter" src="https://strongloop.com/blog-assets/2018/05/search-results.png" alt="New loopback.io search results page" style="width: 450px; margin:auto;"/>

The last part of implementing a new search was creating a new search results page as this was previously handled by the Google Custom Search. The new search results page shows 10 results with up to 3 matching sentence excerpts with the matching text bolded. The link for the result page is also shown. The new search results page also makes it possible to share search result page URLs with others. When displaying results, special care had to be taken to ensure results are escaped for any malicious code to prevent XSS attacks as the documentation is open source.

## Happy Searching

Try out the new search in the [docs](http://loopback.io/doc/) and [share your feedback](https://github.com/strongloop/loopback.io/issues/new) with the team for further improving it. 

## Call for Action

LoopBack's success counts on you! We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

* [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
* [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
* [Reporting issues](https://github.com/strongloop/loopback-next/issues)
* [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
* [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)
