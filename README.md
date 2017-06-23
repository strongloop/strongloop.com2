<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  

- [Running and viewing site locally](#running-and-viewing-site-locally)
  - [Setup](#setup)
  - [Preview site locally](#preview-site-locally)
  - [References](#references)
- [Overview of the site](#overview-of-the-site)
- [Updating the site](#updating-the-site)
  - [How to add a new page](#how-to-add-a-new-page)
  - [How to add a blog post](#how-to-add-a-blog-post)
  - [How to redirect a blog post](#how-to-redirect-a-blog-post)
  - [How to hide a blog post](#how-to-hide-a-blog-post)
  - [How to feature a blog post](#how-to-feature-a-blog-post)
  - [How to add a blog category](#how-to-add-a-blog-category)
  - [How to add an event](#how-to-add-an-event)
  - [How to add an author page](#how-to-add-an-author-page)
  - [How to add your bio to your author page](#how-to-add-your-bio-to-your-author-page)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# strongloop.com

StrongLoop community website.

## Running and viewing site locally

###  Setup

1. Install [Ruby and Bundler](https://help.github.com/articles/setting-up-your-pages-site-locally-with-jekyll/) if you don't have them already.

2. Clone this repo (you might use the SSH URL instead of HTTPS).:
```
git clone https://github.com/strongloop/loopback.io.git
```
3. `cd` to the repository directory and run the following command:
```
$ cd strongloop.com
$ bundle install
```

Bundler will look in the Gemfile for which gems to install. The `github-pages` gem includes the same version of Jekyll and other dependencies as used by GitHub Pages, so that your local setup mirrors GitHub Pages as closely as possible.

### Preview site locally

To preview the website locally, run Jekyll using the following command:

```
$ jekyll serve
```

Then, load [http://localhost:4001/](http://localhost:4001/) on your browser.

If you're going to make incremental changes to the site, use the `-i` flag.
This rebuilds only the pages that you changed, which is a lot quicker.

```
$ jekyll serve -i
```

To start with a clean site build, use this command:

```
$ jekyll clean
```

### References

- [Jekyll documentation](http://jekyllrb.com/docs/home/)
- [Liquid template language](http://shopify.github.io/liquid/)
- [More Liquid documentation](https://help.shopify.com/themes/liquid)

*NOTE:* Having issues running Jekyll locally? You can use Docker instead of installing Ruby, Gems, Jekyll, etc.

- [https://github.com/jekyll/docker/wiki/Usage:-Running](jekyll/docker)

## Overview of the site

The site is based on https://github.com/strongloop/loopback.io, published as http://loopback.io.
We made numerous changes and simplifications for this site, but the repo may still have some vestigial
code from loopback.io

The site follows the standard Jekyll layout.  Specifically:
- `_data` directory contains site data in YAML format.  
  - `authors.yml` contains list of all blog authors who have an author page.
  - `nav.yml` contains pages listed in the top menu nav bar.
  - `tags.yml` contains blog categories.
- `_includes` directory contains files included in other files.
- `_layouts` directory contains various layouts.  Most important are:
  - `author.html` - Layout for author pages in `/pages/authors`.
  - `category-list.html` - Layout for blog category pages in `/pages/categories`
  - `default.html` - Used as base layout for all other layouts.
  - `page.html` - Used for site pages.
  - `post.html` - Used for blog posts.
  - `redirected.html` - Used for blog posts that were moved elsewhere (e.g. DeveloperWorks).
- `_posts` - Contains blog posts.
- `_eventer` - Contains events for the event table.
- `blog-assets` - Contains images, videos, and other files exported from WordPress site.
- `css` and `fonts` - Stylesheets and fonts.
- `images` - Contains image files used in pages.
- `js` - Client JavaScript.
- `newsletter-archive` - Contains PDFs of some old newsletters.
- `pages` - Contains site pages (not blog posts). Sub-directories for `authors`, `categories`, and `projects`

## Updating the site

### How to add a new page

1. Create new HTML file in `pages`.  
1. Include the following front-matter:
    ```
    ---
    title: About StrongLoop
    layout: page
    permalink: /about
    ---
    ```
1. Use the same structure as other pages, with the desired content.
1. Add an entry to `_data/nav.yml` with the title and url of the page.  The `url` value in `nav.yml` _must_ match the `permalink ` value in the page front-matter.

### How to add a blog post

1. Blog post submissions should follow this github collaborative flow, which is essentially "submit via fork / clone / push / pull request. No branches."
https://guides.github.com/activities/forking/

2. Create a new markdown file in `_posts`.  
By convention, the file name is of the form `yyyy-mm-dd-blog-url`, where `blog-url` is based on the title as described below.
3. Include the following front-matter:
    ```
    ---
    layout: post
    title: <Title Here>
    date: 2013-05-01T09:40:15+00:00
    author: <Author Name>
    permalink: /strongblog/<blog-url>
    categories:
      - <category1>
      - <category2>
      - ...
    ---
    ```
Where:
- `<Title Here>` is the title of the blog post.
- `<Author Name>` is the name of the author (matching an entry in `authors.yml` for a working link to the author page).
- `<blog-url>` is a unique string that defines the URL of the post.  By convention, it's the title of the post converted to lower-case, with spaces converted to dashes (`-`).  For example, for title `My Fantastic Blog Post`, it would be `my-fantastic-blog-post`.
- `categories` is one or more categories that are in `categories.yml`.

Simply adding the post will make it appear in the list on the front page, and in the appropriate category and author pages.

### How to redirect a blog post

For blog posts that were moved to other sites (DeveloperWorks), you can easily redirect the URL so any external links to the old post will be redirected to the new location.
Edit the post as follows:

- Change the post to have `layout: redirected`
- Add a new front-matter property `redirect_to` that specifies the post's new URL.  
- Replace the content of the post with the following (optional, but clarifies the redirect in the blog excerpt):
```
This blog post has been moved to IBM DeveloperWorks....
<!--more-->
```

For example:

```
layout: redirected
redirect_to: https://developer.ibm.com/open/2016/10/11/new-life-for-loopback-docs/
---
This blog post has been moved to IBM DeveloperWorks....
<!--more-->
```

You can see this in action if you go to https://strongloop.github.io/strongloop.com/strongblog/new-life-for-loopback-docs/.

### How to add a blog category

To add a new blog category:
1. Add an entry to `_data/tags.yml`
1. Add a page to `/pages/categories`, with the following front-matter:
```
    ---
    layout: category-list
    tagName: <Category-Name>
    search: exclude
    permalink: strongblog/tag_<Category>.html
    ---
```
Where:
- `<Category-Name>` matches the entry in `tags.yml`.
- `permalink` is `strongblog/tag_<tagname>.html` by convention, with spaces converted to underscores.

### How to hide a blog post

Posts will be hidden if they are set to be published in the future under their `date: ` setting in the post's front matter.

They can also be hidden by adding `visible: 0` to the post front matter. 

### How to feature a blog post

You can feature a post on the homepage by adding `featured: true` to the post front matter. Only one post can be featured at a time. The most recent pinned post will be shown.

### How to add an event

Events are shown in a table, which is in `pages/events_table.html`.

1.Create a new markdown file in `_eventer`.  
By convention, the file name is of the form `yyyy-mm-dd-event-name` where the date is based on the start date of the event.

2. Include the following front-matter:
    ```
    ---
    layout: redirected
    date: 2013-05-01
    event-range: <Event Dates>
    title: <Title Here>
    redirect_to: <Event URL>
    permalink: /event/<Event-Title>
    event-link: <Event URL>
    location: Hyderabad, India
    role: Speaking & sponsor
    ---
    ```
Where:
- `<Event Dates>` is the time range in which the event is taking place e.g. 17-23 Aug or 1st September.
- `<Title Here>` is the title of the event.
- `<Event URL>` is the external url of the event.
- `<Event-Title>` is the URL safe version of the title.

This provides all the information that will appear in the table. Underneath the front matter you should include the Event Title again as content.

The event will automatically appear in the table if it is in the future.

### How to add an author page

To add a new blog author:
1. Add an entry to `_data/authors.yml`
1. Add a page to `/pages/authors`, with the following front-matter:
```
    ---
    layout: author
    author: '<Author Name>'
    gitbhub_id: <your_github_id>
    permalink: /authors/<Author_Name>
    ---
```
Where the value of:
- `author` matches the entry in `authors.yml`.
- `permalink` is `/authors/<Author_Name>` by convention, with spaces in author name converted to underscores.
- `github_id` is the author's GitHub ID (optional).  If provided, the author's GitHub avatar will be displayed.

The content of this page should be the author's biography information.  In addition to any content, the author page lists all blogs by that author.

### How to add your bio to your author page

Once you have an author page as described above, you should add some biographical information about yourself.
Simply edit your author page in `/pages/authors`, and add any markdown you wish.  

If you don't want to upload and include your own picture, just add your GitHub ID as the value of the `github_id` property in the front-matter. Then your GitHub avatar will automatically be displayed on your author page.  This is entirely optional, though.
