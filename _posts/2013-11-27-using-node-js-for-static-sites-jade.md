---
id: 10460
title: 'Using Node.js for Static Sites: Jade'
date: 2013-11-27T09:34:45+00:00
author: Jed Wood
guid: http://strongloop.com/?p=10460
permalink: /strongblog/using-node-js-for-static-sites-jade/
categories:
  - How-To
---
Node.js made its big splash in the web world with the promise of high scalability via asynchrony and the dream of using one scripting language for your web app from front to back. In the past year it found another avenue into the mainstream of the modern web. Developers who never touch Node for the backend are finding great uses for it in their front end workflow. <a title="Node Package Manager" href="http://npmjs.org" target="_blank">NPM</a> (Node&#8217;s packager manager) has become a popular way of distributing components via systems like <a href="http://bower.io/" target="_blank">Bower</a> and <a href="http://component.io/" target="_blank">Component</a>. <a href="http://gruntjs.com/" target="_blank">Grunt</a> is a micro platform that supports plugins to help you create and organize your distribution files.

<h2 dir="ltr">
  <strong>Static is the New Black</strong>
</h2>

This shift comes at a time when static sites are back en vogue. When WordPress was first released, I remember thinking how much more &#8220;efficient&#8221; it seemed to let PHP generate pages on the fly, as opposed to the seemingly-cumbersome process of re-generating HTML files with each change to your blog, the way MovableType did. Today, free or cheap platforms like GitHub Pages and Amazon S3+CloudFront provide a way of hosting static sites that handle huge amounts of traffic with no worries of database throughput, max connections, or backend scripting security flaws.

My favorite combination for creating static sites includes Jade & Stylus. In this post I&#8217;ll focus on Jade. I&#8217;ll cover the other pieces in a future article.

<h2 dir="ltr">
  <strong>Jade → HTML</strong>
</h2>

The first time I saw <a href="http://haml.info/" target="_blank">HAML</a> I rolled my eyes. _Senstive to indentation and whitespace_?! Jade is heavily inspired by HAML, but strips things down even further. I&#8217;ve been using it for a couple years now, and I just can&#8217;t stand to write HTML any other way. The terse syntax is great, but for static site generation I also make use of templates, includes, and iteration. Jade has some great documentation that includes examples, and you can check the Google Group or Stack Overflow if you get stuck.

<h2 dir="ltr">
  <strong>Jade Syntax</strong>
</h2>

Jade is like HTML without the HTML; no arrow brackets, no closing tags. id attributes become #, classes just need a ., and a div is assumed unless you specify a different element. So this:

```js
<div class="container">
  <ul id="my-list" class="bucket-list pull-right">
    <li>
      <a href="#">something</a>
    </li>
        
    
    <li>
      <a href="#">something</a>
    </li>
    
  </ul>
  
</div>

```

Becomes:

```js
.container
  ul#my-list.bucket-list.pull-right
    li
      a(href=“#) something
```

You can pass &#8220;dynamic&#8221; data into Jade. Putting a &#8220;-&#8221; at the beginning of a line tells Jade to evaluate it as Javascript only during compilation; it will not be rendered out in the HTML. Here&#8217;s a simple example:

```js
- var pageTitle = ‘Node.js for Static Sites’
html
  head
    title= pageTitle
```

Alteratively, you can use interpolation syntax to render a variable:

```js
- var pageTitle = 'Node.js for Static Sites'
html
  head
    title #{pageTitle}
```

<h2 dir="ltr">
  <strong>Iteration</strong>
</h2>

While Jade handles standard Javascript for loops, it also supports a nice shorthand:

```js
- var navElements = ['about', 'contact', 'support']
each el in navElements
  li
    a(href='#')= el
```

Note that for a few shorthand terms such as `each` and `if` you do not need to prepend the line with &#8220;-&#8220;. Jade can get away with this because there is currently not a &#8220;each&#8221; element in the HTML spec. 🙂

<h2 dir="ltr">
  <strong>Layouts</strong>
</h2>

Most of the pages in your site should extend a common layout template. By using the &#8220;block&#8221; keyword, we can create as many customizable chunks as we need. Blocks can have default content, and the page can either prepend, append, overwrite, or include as-is. This gives us four options and covers almost all your use cases.

For example you might have a &#8220;scripts&#8221; block in your main layout template that looks something like this:

```js
block scripts
  script(src='/js/jquery.js')
```

and in one page you need to use some page-specific javascript in addition to the site-wide js files:

```js
append scripts
  script.
    $(function(){ alert ‘hello jade’; })
```

<h2 dir="ltr">
  <strong>Includes</strong>
</h2>

If you want to include a chunk of Jade inline, it’s as easy as:

```js
include path/to/file
```

The contents of the included file will get injected in place of that line.

Let&#8217;s assume we have a navbar that we want to include in some, but not all, of the pages that extend our main layout. By passing in variables, you could change which nav item is highlighted, for example:

```js
- var activeNav = 'about'
include includes/nav.jade
```

where nav.jade is:

```js
each el in navElements
  - liClass = (el == activeNav) ? 'active' : ''
  li(class=liClass)
    a(href='#')= el
```

In line 2 we’re using the ternery operator to set a variable liClass to either &#8216;active&#8217; or an empty string. When Jade renders that variable into the class of the li, if it finds an empty string it will just drop the class attribute. So we end up with:

```js
<ul>
  <li class="active">
    <a href="#">about</a>
  </li>
      
  
  <li>
    <a href="#">contact</a>
  </li>
      
  
  <li>
    <a href="#">support</a>
  </li>
  
</ul>

```

<h2 dir="ltr">
  <strong>Yield</strong>
</h2>

Includes can themselves include other includes, but you might need to go beyond simple variables. You can conditionally inject &#8220;dynamic&#8221; chunks of HTML in the include. If the potential includes are just one or two different snippets, then you can still use the &#8220;includes including includes&#8221; method and just use a simple if/else switch. A more flexible option is to use the `yield` keyword. If I set up a file like this:

```js
include includes/footer.jade
  p here is some content
```

Then the &#8220;p here is some content&#8221; will do just what you expect; get nested inline with the include, below it. If instead we use a yield statement inside the include file, then anything that we nest under the include statement will get injected there. So using the example above, I could make that &#8220;p here is some content&#8221; show up in the middle of other elements in the footer by doing something like this in includes/footer.jade:

```js
.footer
  p this site is brought to you by StrongLoop
  yield
  p all rights reserved 2013
```

<h2 dir="ltr">
  <strong>Grunt the Jade</strong>
</h2>

In case you&#8217;re not already familiar, here&#8217;s a [great introduction to Grunt](http://strongloop.com/strongblog/use-grunt-js-and-the-power-of-javascript-to-automating-repetitive-tasks/). Once your main file is set up, you can add the Jade-specific bits:

```js
jade: {
  compile: {
    options: {
      pretty: true
    },
    files: [
      {expand: true, cwd: 'src/jade', src: '*.jade', dest: '<%=meta.endpoint%>/', ext: '.html'}
    ]
  }
},
```

If you want the HTML files to be generated automatically after every time you save a .jade file, we can finger our Grunt file’s &#8216;watch&#8217; section to include this:

```js
watch: {
  html: {
    files: '**/*.jade',
    tasks: ['jade'],
    options: {
      interrupt: true
    }
  },
```

Then just run &#8216;grunt watch&#8217; from your command line.

<h2 dir="ltr">
  <strong>Other Tips & Resources</strong>
</h2>

  * Try out Jade&#8217;s syntax with <a href="http://naltatis.github.io/jade-syntax-docs/" target="_blank">an interactive sandbox</a>
  * <a href="http://html2jade.aaron-powell.com/" target="_blank">Convert HTML to Jade</a>
  * Pass a variable from a child template to its parent layout by putting a &#8216;pageVars&#8217; block at the top of the layout, and add the content in your child/include.
  * <a href="https://coderwall.com/p/hlojkw" target="_blank">Compile Jade templates</a> into JS snippets that can be used for client-side rendering in a browser, as an alternative to something like Handlebars.
  * Render Jade objects into inline JS with: 
    ```js
script.
  var slides = !{JSON.stringify(ss)};
```

<h2 dir="ltr">
  <strong>Putting it all Together</strong>
</h2>

It can take some trial and error to get it all straight; templates, includes, blocks, and yields. Just as with HTML and Javascript, there are several ways to achieve any given desired output. Once you get the hang of it, you&#8217;ll find your own preferences and be comfortable refactoring when you realize what you&#8217;ve been including should be part of a layout.

## **[Use StrongOps to Monitor Node Apps](http://strongloop.com/node-js-performance/strongops/)
  
** 

Ready to start monitoring event loops, manage Node clusters and chase down memory leaks? We’ve made it easy to get started with [StrongOps](http://strongloop.com/node-js-performance/strongops/) either locally or on your favorite cloud, with a [simple npm install](http://strongloop.com/get-started/).

<a href="{{site.url}}/blog-assets/2014/02/Screen-Shot-2014-02-03-at-3.25.40-AM.png" rel="lightbox"><img alt="Screen Shot 2014-02-03 at 3.25.40 AM" src="{{site.url}}/blog-assets/2014/02/Screen-Shot-2014-02-03-at-3.25.40-AM.png" width="1746" height="674" /></a>

## **[What’s next?](http://strongloop.com/get-started/)
  
** 

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What’s in the upcoming Node v0.12 release? <a href="http://strongloop.com/strongblog/performance-node-js-v-0-12-whats-new/">Big performance optimizations</a>, read <a href="https://github.com/bnoordhuis">Ben Noordhuis’</a> blog to learn more.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Watch <a href="https://github.com/piscisaureus">Bert Belder’s</a> comprehensive <a href="http://strongloop.com/developers/videos/#whats-new-in-nodejs-v012">video </a>presentation on all the new upcoming features in v0.12</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
</li>