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

1. Create a new markdown file in `_posts`.  
By convention, the file name is of the form `yyyy-mm-dd-blog-url`, where `blog-url` is based on the title as described below.
1. Include the following front-matter:
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
    title: 'Cloud Posts'
    ---
```
Where:
- `<Category-Name>` matches the entry in `tags.yml`.
- `permalink` is `strongblog/tag_<tagname>.html` by convention, with spaces converted to underscores.
- `title` is the Category title; generally just "<tagname> Posts".

### How to add an author

To add a new blog author:
1. Add an entry to `_data/authors.yml`
1. Add a page to `/pages/authors`, with the following front-matter:
```
    ---
    layout: author
    author: '<Author Name>'
    permalink: /authors/<Author_Name>
    ---
```
Where the value of:
- `author` matches the entry in `authors.yml`.
- `permalink` is `/authors/<Author_Name>` by convention, with spaces in author name converted to underscores.
