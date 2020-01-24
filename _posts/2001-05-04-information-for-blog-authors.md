---
layout: post
title: Guidelines and Information for Blog Authors
date: 2001-05-04
author: C. Rand McKinney
permalink: /strongblog/information-for-blog-authors/
categories:
  - How-To
---
This site now supports blogs authored in markdown format! This is a sample blog post that explains and demonstrates guidelines, formatting and best practices for blog authors.

Blog post submissions should follow this github collaborative flow, which is essentially "submit via fork / clone / push / pull request. No branches."
https://guides.github.com/activities/forking/

To see how various parts of this post were created, [view the markdown source](https://github.com/strongloop/strongloop.com/blob/master/_posts/2001-05-04-information-for-blog-authors.md) for this post.

<!--more-->

## File name

All blog posts go in the `_posts` directory in the GitHub repository.

Jekyll requires blog post file names to have the following format:

```
YEAR-MONTH-DAY-title.md
```

Where `YEAR` is a four-digit number, `MONTH` and `DAY` are both two-digit numbers,
and `title` is the post title, in lowercase, with spaces converted to dashes.
For example, this post's file name is `2001-05-04-information-for-blog-authors.md`.

If a post's date is in the future, it won't show up in the list of latest blogs on
the main blog page nor in the blog archive page of all blog posts.

{% include note.html content="This post has a fictitious (old) date so it
doesn't show up on the front page or strongblog page and appears last in lists by
category and author.
" %}

## Front-matter

Every post **must** begin with a block of YAML delimited by lines containing only triple-dashes (`---`).
For example, here's the front-matter for this post:

```
---
layout: post
title: Information for Blog Authors
date: 2001-05-04
author: C. Rand McKinney
permalink: /strongblog/information-for-blog-authors/
categories:
  - How-To
published: false  
---
```

The properties are:
- `layout`: Must be `post`.
- `title`: Title of the post, which can include any character except a colon (:).  To put a colon in your title, use the HTML entity `&#58;`. Note that titles and headers should be primarily upper case as per [this style guide](https://www.bkacontent.com/how-to-correctly-use-apa-style-title-case/). Please follow MLA Style for capitalization: Capitalize Major Words and Those With Four or More Letters. The title should NOT be in quotation marks.
- `date`: Publication date of your post in `yyyy-mm-dd` format. NOTE Please mark date as several days / weeks ahead - Dave Whiteley will finalize publication date. Ex. 2018-08-02T00:00:02+00:00
- `author`: Your name.  If this matches an entry in `_data/authors.yml` the post byline will automatically link to your author page if you have one.  See [README - How to add an author page](https://github.com/strongloop/strongloop.com/blob/master/README.md#how-to-add-an-author-page) for more information.
- Note that multiple authors must be formatted like this, with each author marked on a new line:
    ```
    author: 
    - David Okun
    - Manny Guerrero
    ```
- `permalink`: The URL path where the post will be published on `strongloop.com`.  Must  be `/strongblog/<title>/` where `title` is the title portion of the filename (see above).
- `categories`: An array of one or more categories.  Allowed categories are defined by [_data/tags.yml](https://github.com/strongloop/strongloop.com/blob/master/_data/tags.yml). If you do not use the defined categories, this information will not be accepted or populated in the post.
  - 'API Connect'
  - 'API Microgateway'
  - 'API Tip'
  - 'Case Studies'
  - Cloud
  - Community
  - 'ES2015 ES6'
  - Events
  - Express
  - GraphQL
  - How-To
  - 'JavaScript Language'
  - LoopBack
  - Mobile
  - News
  - 'Node core'
  - 'Node DevOps'
  - Product
  - Resources
published: false: will ensure the post doesn't go live until fully edited and approved  

## Excerpt

All blog posts should have an excerpt so that the blog page prsents our content effectively. You generally create an "excerpt" from the first few paragraphs of text in your blog.  It works best if these paragraphs provide summary or abstract of the post. Pages that display blogs with excerpts such as the [Home page]({{site.url}}), [Author pages]({{site.url}}/blog-authors), and [Category pages]({{site.url}}/blog-archives) display this excerpt.

Everything in the post before this HTML comment is in the excerpt:

```
<!--more-->
```

## Headings

Note that titles and headers should be primarily upper case as per [this style guide](https://www.bkacontent.com/how-to-correctly-use-apa-style-title-case/). Please follow MLA Style for capitalization: Capitalize Major Words and Those With Four or More Letters.

You can use standard markdown headings as follows:
- Top-level headings should be a Head2: Use markdown `##`. It's not a Head1 because that's used for the blog/page title.
- Second-level headings are Head3:  Use markdown `###`.
- Third-level headings are Head4:  Use markdown `####`.

Avoid using lower-level headings.  If you think you need them, it's usually better to reorganize your content instead.  Don't skip heading levels.  In other words, don't put a Head4 directly beneath a Head2.

{% include warning.html content = "You **must** have a space between the hash-mark characters `#` and the heading text.  Otherwise, the Jekyll markdown parser won't recognize it as a heading!
" %}

Here's what the headings look like.

## Head2 (##)

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

### Head3 (###)

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

#### Head4 (####)

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Code samples

To get code blocks with syntax highlighting, use triple back-ticks, followed by an optional language identifier ("js" for JavaScript or JSON, "yaml" for YAML, and so on).  For example

<div class="language-js highlighter-rouge"><pre class="highlight">
```js
// ... JavaScript code ...
```
</pre></div>

For example:

```js
var env = JSON.parse(process.env.VCAP_SERVICES);

module.exports = {
  db:{
    connector:'cloudant',
    url:env['cloudantNoSQLDB'][0].credentials.url,
    database:'data'
  }
}
```

Surround inline code snippets or file paths with single back-ticks.  For example:

The `customer` object represents your customer model.  The model definition file is in `/common/models/customer.json`.

## Links

Use standard markdown syntax for links:

```
[text](url)
```

If you're linking to another blog or page on strongloop.com, make the link relative.  Absolute links automatically get a glyph that indicates the site is external, and if you use an absolute URL the link will display the glyph even though the link is local.

Example of external link: Check [Google](http://google.com).

Example of local link: See [StrongLoop Projects](/projects/).

## Images

Upload blog images (and other media files such as audio and video files) in the appropriate `/blog-assets` directory. You will see sub-folders for year and month.

Include images in a post by linking directly to the blog assets file:

For example:

<img src="https://strongloop.com/blog-assets/2017/loopback-2017.png" alt="LoopBack 2017 Year in Review"/>

Reduce image file size.

Keep image formatting simple. Upload files to correct orientation and set width and height by pixels.

# What's Next, or Call to Action

All posts should end with a section indicating "What's next?" or a "Call to Action" You can find examples [here](https://strongloop.com/strongblog/calling-contributors-loopback-extensions/) anmd [here](https://strongloop.com/strongblog/moving-examples-to-monorepo/).

## Alerts

Alerts are custom _Jekyll includes_ that provide templates to highlight information.

```
{%raw%}{% include note.html content="This is my note. I can include **markdown formatted** text, including [links](http://ibm.com).
" %}{% endraw%}
```

Here's the result:

{% include note.html content="This is my note. I can include **markdown formatted** text, including [links](http://ibm.com).
" %}

The `content` property contains the content for the alert.

{% include important.html content="Due to quirks of the Jekyll markdown parser, you must put the terminating <code>&quot; &percnt; &rbrace;</code> **on a separate line**.  
If you don't, your alert will consume the remainder of the document!
" %}

There are four types of alerts:

* **Note**: `note.html`
* **Tip**: `tip.html`
* **Warning**: `warning.html`
* **Important**: `important.html`

They function the same except they have a different color, icon, and alert word.  Here are samples of each alert:

{% include note.html content="This is my note.
" %}

{% include tip.html content="This is my tip.
" %}

{% include warning.html content="This is my warning.
" %}

{% include important.html content="This is my important info.
" %}

## Writing guidelines

Please use [active voice](https://writing.wisc.edu/Handbook/CCS_activevoice.html) rather than passive voice.

Unless creating a new paragraph, please use soft wrap rather than hard line breaks.

There should only be one space between sentences, not two.

Please keep formatting simple! It makes it easier to troubleshoot if something goes wrong.

## Publication

A blog is ready to be sent for publication when all content has been reviewed, edited and approved by manager or subject matter expert (eg, Raymond Feng or Diana Lau for LoopBack). 

To update: When ready to be published, a PR *and* a separate email should be sent to (new owner). Please do *not* rely on Slack to communicate a blog is ready.

Even if approved and PR is sent, expect up to a 24 business hour turnaround time for publication.

Blog posts are generally posted on Wednesday. If there is an important reason to make an exception please advise.

