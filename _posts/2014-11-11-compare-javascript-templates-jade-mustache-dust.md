---
id: 20789
title: 'Comparing JavaScript Templating Engines: Jade, Mustache, Dust and More'
date: 2014-11-11T16:43:02+00:00
author: Alex Gorbatchev
permalink: /strongblog/compare-javascript-templates-jade-mustache-dust/
categories:
  - Community
  - Express

---
**Note:** This post is also available on [Node.js @ IBM](https://developer.ibm.com/node/2014/11/11/compare-javascript-templates-jade-mustache-dust/)

<div style="width: 100%; max-height: 400px; background: url('{{site.url}}/blog-assets/2014/11/javascript-templates-2014.png') 50% 50% no-repeat; background-size: cover;">
  <img style="opacity: 0;" src="{{site.url}}/blog-assets/2014/11/javascript-templates-2014.png" alt="javascript-templates-2014" width="100%" />
</div>

Lets talk templates, specifically JavaScript powered templates. Even more specifically – template engines that work as well on the server side as they do on the client side. After all, this is the great promise and advantage that [isomorphic](http://isomorphic.net/) JavaScript brings to the table – ability to run the same code everywhere.

The big benefit of such approach when it comes to templates specifically is being able to render HTML on the server side, send it over the wire to a client and then have that client interact with the page and have it change using the same template bits and maybe even some shared logic. That can be a huge gain in terms of effort and reduces footprint of your application.

In this article I want to look at some of the most popular JavaScript templating engines. It’s not my intent to compare them or do some silly benchmarking. I don’t think subjectively evaluating a bunch of templating engines and picking the one I like best is helpful in any way. Most of the engines bring something unique to the table and my idea of DRY might not necessarily match yours.

Having said that, the template engines in this articles were selected based on a simple “GitHub score”. How was that determined you might ask? I’ve come up with a simple formula:

```js
stars + forks + commits + contributors * 10 = github_score
```

Finally, the last criteria for selection is project activity in general. I decided not to work that into the formula to keep things simple. There are a few engines that were excluded based on the lack of any activity over an extensive amount of time such as [Eco](https://github.com/sstephenson/eco) and [Haml.js](https://github.com/creationix/haml-js). These could be considered abandoned in my opinion. [EJS](https://github.com/tj/ejs) and [Mustache.js](https://github.com/janl/mustache.js) get a break here because they are fairly simple and there aren’t any new features in general.

With that in mind, I’m going to give a brief sample of what markup looks like for each engine, the minimum code necessary to render that markup to HTML followed by some pros and cons.

_Please note, everything in this article represents my personal opinion and might not match yours. The purpose here is to show you different templating languages, give you my personal take on each and let your decide for yourself._

# JavaScript Template Engines 2014

| Name                                               | Stars | Forks | Commits | Contributors | GitHub Score |
| -------------------------------------------------- | -----:| -----:| -------:| ------------:| ------------:|
| [Jade](https://github.com/jadejs/jade)             | 7,335 | 1,136 |   1,968 |          135 |      **118** |
| [Mustache.js](https://github.com/janl/mustache.js) | 6,985 | 1,464 |     514 |           55 |       **95** |
| [Dust.js](https://github.com/linkedin/dustjs)      | 1,571 |   293 |     697 |           28 |       **28** |
| [Nunjucks](https://github.com/mozilla/nunjucks)    | 1,565 |   115 |     525 |           40 |       **26** |
| [EJS](https://github.com/tj/ejs)                   | 1,796 |   289 |     221 |           24 |       **25** |

## Jade

<img src="{{site.url}}/blog-assets/2014/11/javascript-templates-jade.jpg" alt="jade" width="100%" />

```js
npm install jade
```

> [Jade](https://github.com/jadejs/jade) is a high performance template engine heavily influenced by [Haml](http://haml.info/) and implemented with JavaScript for Node.

```js
doctype html
html(lang="en")
  head
    title= pageTitle
    script(type='text/javascript').
      if (foo) bar(1 + 5)
  body
    h1 Jade - node template engine
    #container.col
      if youAreUsingJade
        p You are amazing
      else
        p Get on it!
      p.
        Jade is a terse and simple templating language with a
        strong focus on performance and powerful features.
```

```js
var jade = require('jade');
var template = jade.compile('string of jade', options);
var result = template(locals);
```

### Pros

  * No closing tags
  * White space significant indentation
  * Extensive layout inheritance
  * Macros support
  * Plain old school includes
  * Built in support for Markdown, CoffeeScript and others
  * Available implementations in [php](http://github.com/everzet/jade.php), [scala](http://scalate.fusesource.org/versions/snapshot/documentation/scaml-reference.html), [ruby](https://github.com/slim-template/slim), [python](https://github.com/SyrusAkbary/pyjade) and [java](https://github.com/neuland/jade4j).

### Cons

  * Not everyone likes significant white space
  * JavaScript inlining can get cumbersome for more than one line
  * Requires a small runtime to use precompiled templates on the client
  * Not suitable for non-HTML output
  * No streaming support
  * Somewhat high learning curve

### Tools

  * [grunt-jade](https://github.com/gruntjs/grunt-contrib-jade)
  * [gulp-jade](https://github.com/phated/gulp-jade)
  * [Jade for Atom](https://atom.io/packages/language-jade)
  * [Jade for Coda](https://github.com/aaronmccall/jade.mode)
  * [Jade for Emacs](https://github.com/brianc/jade-mode)
  * [Jade for Sublime](https://sublime.wbond.net/packages/Jade)
  * [Jade for TextMate](http://github.com/miksago/jade-tmbundle)
  * [Jade for Vim](https://github.com/digitaltoad/vim-jade)

### Summary

[Jade](https://github.com/jadejs/jade) takes [Haml](http://haml.info/) DRYness to the next level and gets rid of leading `%` character but otherwise it’s pretty much on par feature wise. [Jade](https://github.com/jadejs/jade) ended up at the top of the list based on the numbers. I liked that there’s no need to worry about closing tags and significant white space enforces clear coding convention between team members. [Jade](https://github.com/jadejs/jade) allows for full JavaScript expressions but makes that just awkward enough to discourage full blown logic in the views. It’s support for inlined Markdown and CoffeeScript is a nice addition. Ability to use Markdown for larger blocks of text makes formatting a pleasure.

## Mustache.js

<img src="{{site.url}}/blog-assets/2014/11/javascript-templates-mustache.jpg" alt="mustache" width="100%" />

```js
npm install mustache
```

> [Mustache.js](https://github.com/janl/mustache.js) is an implementation of the [Mustache](http://mustache.github.com/) template system in JavaScript.
>
> [Mustache](http://mustache.github.com/) is a logic-less template syntax. It can be used for HTML, config files, source code – anything. It works by expanding tags in a template using values provided in a hash or object.
>
> We call it “logic-less” because there are no if statements, else clauses, or for loops. Instead there are only tags. Some tags are replaced with a value, some nothing, and others a series of values.


```js
var mustache = require('mustache');
var template = mustache.compile('string of mustache');
var result = template(locals);
```

### Pros

  * Based on the popular [Mustache](http://mustache.github.com/) templating language
  * Operating on plain HTML, no significant white space
  * Clean, concise variable and loop controls syntax
  * Could be used for things other than HTML, eg config files, JSON
  * Small learning curve
  * Available implementations in [.NET](https://github.com/jdiamond/Nustache), [ActionScript](https://github.com/hyakugei/mustache.as), [Android](https://github.com/samskivert/jmustache), [ASP](https://github.com/nagaozen/asp-xtreme-evolution/blob/master/lib/axe/classes/Parsers/mustache.asp), [C#](https://github.com/jehugaleahsa/mustache-sharp). [C++](https://github.com/mrtazz/plustache), [Clojure](https://github.com/fhd/clostache), [CoffeeScript](https://github.com/pvande/Milk), [ColdFusion](https://github.com/pmcelhaney/Mustache.cfc), [D](https://github.com/repeatedly/mustache-d), [Dart](https://github.com/valotas/mustache4dart), [Delphi](https://github.com/synopse/dmustache), [Erlang](https://github.com/mojombo/mustache.erl), [Fantom](https://github.com/vspy/mustache), [Go](https://github.com/hoisie/mustache), [Haskell](https://github.com/lymar/hastache), [Haxe](https://github.com/TomahawX/Mustache.hx), [Io](https://github.com/mil/mustache.io), [Java](https://github.com/spullara/mustache.java), [JavaScript](https://github.com/janl/mustache.js), [Lua](https://github.com/Olivine-Labs/lustache), [node.js](https://github.com/raycmorgan/Mu), [Objective-C](https://github.com/groue/GRMustache), [ooc](https://github.com/joshthecoder/mustang), [Perl6](https://github.com/softmoth/p6-Template-Mustache), [Perl](https://github.com/pvande/Template-Mustache), [PHP](https://github.com/bobthecow/mustache.php), [Python](https://github.com/defunkt/pystache), [Racket](https://github.com/rcherrueau/rastache), [Ruby](http://github.com/defunkt/mustache), [Rust](https://github.com/rustache/rustache), [Scala](https://github.com/scalate/scalate) and [XQuery](https://github.com/dscape/mustache.xq).

### Cons

  * Cumbersom partials system requires to register all partials
  * Default global namespace for partials will require workaround to avoid collisions
  * No built-in layout system
  * Have to close your own tags (right?)
  * No streaming support

### Implementations

There are a few other [Mustache](http://mustache.github.com/) implementations that stand out and are worth noting:

  * [Handlebars.js](https://github.com/wycats/handlebars.js/) adds a couple of additional features to make writing templates easier and also changes a tiny detail of how partials work.
  * [Hogan.js](https://github.com/twitter/hogan.js) was written by the good folks at Twitter to meet three templating library requirements: good performance, standalone template objects, and a parser API.

### Tools

  * [grunt-mustache](https://github.com/phun-ky/grunt-mustache)
  * [gulp-mustache](https://github.com/rogeriopvl/gulp-mustache)
  * [Mustache for Atom](https://github.com/atom/language-mustache)
  * [Mustache for Coda](https://github.com/bobthecow/Mustache.mode)
  * [Mustache for Emacs](http://web-mode.org)
  * [Mustache for TextMate](https://gist.github.com/323624)
  * [Mustache for Vim](https://github.com/mustache/vim-mustache-handlebars)

### Summary

I don’t think it’s a valid statement to claim that language doesn’t have control structures just because the syntax looks a little different but does essentially the same thing. No sufficiently complex template can get away without using basic ifs & loops and making the loud statement of being “logic-less” is unnecessary and silly in my opinion. Having said that [Mustache](http://mustache.github.com/) is a very popular templating language which is evident from its many platform implementations. It has very little learning curve and can be used for things other than HTML.

## Dust.js

<img src="{{site.url}}/blog-assets/2014/11/javascript-templates-dust.jpg" alt="dust" width="100%" />

```js
npm install dustjs-linkedin
```

[Dust.js](https://github.com/linkedin/dustjs) is a heavily influenced by [Mustache](http://mustache.github.com/) template language. The [original Dust.js](http://akdubya.github.io/dustjs) repository has been pretty much abandoned but the LinkedIn fork that is listed here is alive and pretty active.

First, insert the base template as a partial.
Then populate the base template named blocks. Supply the desired bodyContent and pageFooter.


```js
var dust = require('dustjs-linkedin');
var compiled = dust.compile('string of dust', 'intro');
dust.render('intro', locals, function(err, result) { ... });
```

### Pros

  * Async & streaming support
  * Operating on plain HTML, no significant white space
  * Clean, concise variable and loop controls syntax
  * Could be used for things other than HTML, eg config files, JSON
  * Doesn’t pretend to be logic-less
  * Filters support

### Cons

  * Can’t automatically load partials
  * Default global namespace for partials will require workaround to avoid collisions
  * Have to close your own tags (right?)
  * Preloading and naming templates for rendering feels strange
  * Somewhat high learning curve, especially if you want to get into streaming

### Tools

  * [grunt-dust](https://github.com/vtsvang/grunt-dust)
  * [gulp-dust](https://github.com/sindresorhus/gulp-dust)
  * [Dust.js for Atom](https://atom.io/packages/language-dustjs)
  * [Dust.js for Sublime](https://sublime.wbond.net/packages/Dust.js)
  * [Dust.js for TextMate](https://github.com/jimmyhchan/Dustjs.tmbundle)
  * [Dust.js for Vim](https://github.com/jimmyhchan/dustjs.vim)

### Summary

The streaming support in [Dust.js](https://github.com/linkedin/dustjs) is unique. The [runnable](http://runnable.com/VFhUDXI1zuRccOxd/javascript-templating-engines-2014-for-node-js-jade-ejs-mustache-nunjucks-npmawesome-and-strongloop) example takes advantage of this to illustrate how HTML could be streamed to the user. You can stream response by itself and you can stream chunks. You can imagine a case where you render a list of promises resolving them as they are rendered and only resolving those that are rendered. Be sure to read the [original documentation](http://akdubya.github.io/dustjs/#guide) because the LinkedIn fork while having a great [guide](https://github.com/linkedin/dustjs/wiki/Dust-Tutorial) misses on some key points.

## Nunjucks

<img src="{{site.url}}/blog-assets/2014/11/javascript-templates-nunjucks.jpg" alt="nunjucks" width="100%" />

```js
npm install nunjucks
```

> Rich Powerful language with block inheritance, autoescaping, macros, asynchronous control, and more. Heavily inspired by [jinja2](http://jinja.pocoo.org/).


```js
var nunjucks = require('nunjucks');
var template = nunjucks.compile('string of nunjucks');
var result = template.render(locals);
```

### Pros

  * Async support
  * Extensive layout inheritance
  * Macros support
  * Plain old school includes
  * Filters support
  * White space control
  * Operating on plain HTML, no significant white space
  * Clean, concise variable and loop controls syntax
  * Could be used for things other than HTML, eg config files, JSON
  * Custom tags support

### Cons

  * Have to close your own tags (right?)
  * No streaming support
  * Somewhat high learning curve

### Tools

  * [gulp-nunjucks](https://github.com/sindresorhus/gulp-nunjucks)
  * [grunt-nunjucks](https://github.com/jlongster/grunt-nunjucks)
  * [Nunjucks for Atom](https://atom.io/packages/language-nunjucks)
  * [Nunjucks for Sublime](https://sublime.wbond.net/packages/Nunjucks%20Syntax)
  * [Nunjucks for TextMate](https://github.com/taliator/jinja2-nunjucks-tmbundleo)
  * [Nunjucks for Vim](https://github.com/Glench/Vim-Jinja2-Syntax)

### Summary

[Nunjucks](https://github.com/mozilla/nunjucks) has the weight of Mozilla behind it and a very extensive documentation. Unlike [Dust.js](https://github.com/linkedin/dustjs) where async support is baked in as a byproduct of the streaming, [Nunjucks](https://github.com/mozilla/nunjucks) has a full support for async filters and tags. Your filters could be making database queries and performing other async operations during rendering, which could be pretty powerful when done right.

> … custom filters and extensions can do stuff like fetch things from the database, and template rendering is “paused” until the callback is called.

## EJS

<img src="{{site.url}}/blog-assets/2014/11/javascript-templates-ejs.jpg" alt="ejs" width="100%" />

```js
npm install ejs
```

> Embedded JavaScript templates for node

```js
var ejs = require('ejs');
var result = ejs.render('string of ejs', locals);
```

### Pros

  * Operating on plain HTML, no significant white space8 Basically writing JavaScript, few restrictions here
  * Could be used for things other than HTML, eg config files, JSON
  * Filters support
  * No learning curve

### Cons

  * No async support
  * Very verbose, PHP-like syntax
  * Includes are loaded from local file system (not even sure how client side is handled in this case)

### Tools

  * [gulp-ejs-precompiler](https://github.com/christophehurpeau/gulp-ejs-precompiler)
  * [EJS for Atom](https://atom.io/packages/language-ejs)
  * [EJS for Sublime](https://sublime.wbond.net/packages/EJS)
  * [EJS for Vim](https://github.com/gregory-m/ejs-tmbundle)

### Summary

[EJS](https://github.com/tj/ejs) is probably the most old school way of writing templates. Takes me back to the days of PHP and JSP. It’s very verbose and having to close your functions and if statements with `<% } %>` type of blocks makes the code difficult to read and even more difficult to type. [EJS](https://github.com/tj/ejs) is hands down my least favorite templating language. It can however have its uses because in the [bare minimum implementation](http://ejohn.org/blog/javascript-micro-templating/) it’s just about 25 lines long.

# **One more thing…**

<img src="{{site.url}}/blog-assets/2014/11/javascript-templates-react.jpg" alt="react" width="100%" />

There’s one other project that I haven’t mentioned that I feel is worth noting – [React](https://github.com/facebook/react) by Facebook. I don’t feel it completely belongs on this list because it’s so much more than a templating engine. However, because it can actually be used as an [isomorphic](http://isomorphic.net/) rendering engine, it’s worth noting. It’s currently very actively developed and there’s a ton of buzz around it.

# **Summary**

| Name                                               | Stars | Forks | Commits | Contributors | GitHub Score |
| -------------------------------------------------- | -----:| -----:| -------:| ------------:| ------------:|
| [Jade](https://github.com/jadejs/jade)             | 7,335 | 1,136 |   1,968 |          135 |      **118** |
| [Mustache.js](https://github.com/janl/mustache.js) | 6,985 | 1,464 |     514 |           55 |       **95** |
| [Dust.js](https://github.com/linkedin/dustjs)      | 1,571 |   293 |     697 |           28 |       **28** |
| [Nunjucks](https://github.com/mozilla/nunjucks)    | 1,565 |   115 |     525 |           40 |       **26** |
| [EJS](https://github.com/tj/ejs)                   | 1,796 |   289 |     221 |           24 |       **25** |

So what do we have? Five different [isomorphic](http://isomorphic.net/) template engines written in JavaScript that take completely different approach to essentially doing the same thing – rendering HTML. From the most basic [EJS](https://github.com/tj/ejs), a very popular [Mustache.js](https://github.com/janl/mustache.js), LinkedIn backed [Dust.js](https://github.com/linkedin/dustjs), Mozilla produced [Nunjucks](https://github.com/mozilla/nunjucks) and a fully independent and most popular of the bunch – [Jade](https://github.com/jadejs/jade).

All of them have their own strengths and weaknesses, some of them could even be used together with others. [Dust.js](https://github.com/linkedin/dustjs) stands out of the crowd with its streaming support. [Jade](https://github.com/jadejs/jade) has significant white space and can seamlessly integrate with other markup engines like Markdown and CoffeeScript. [Nunjucks](https://github.com/mozilla/nunjucks) brings async filters and tags to the table and [Mustache.js](https://github.com/janl/mustache.js) is minimal and straight forward. [EJS](https://github.com/tj/ejs) is just… well, [EJS](https://github.com/tj/ejs) I guess – it’s a bare bones templating engine.

Finally, I’ve put together a [runnable](http://runnable.com/VFhUDXI1zuRccOxd/javascript-templating-engines-2014-for-node-js-jade-ejs-mustache-nunjucks-npmawesome-and-strongloop) example. Every engine listed is set to produce exactly the same output to give you and idea of where they differ. [Dust.js](https://github.com/linkedin/dustjs) is slowed down on purpose to illustrate it’s streaming capabilities. The source is also posted on [GitHub](https://github.com/npmawesome/example-template-engines-2014).

## What&#8217;s next?

- Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js LoopBack framework. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
