---
id: 11237
title: Template Systems in Node.js
date: 2013-12-10T09:00:44+00:00
author: Marc Harter
guid: http://strongloop.com/?p=11237
permalink: /strongblog/template-systems-in-node/
categories:
  - How-To
---
Regardless of your background in web development, you’ve likely used a <a href="http://en.wikipedia.org/wiki/Web_template_system" target="blank">web template system</a> (engine). The goal of a template system is to process templates (usually in combination with a set of input data) to form finalized web pages.

> template(data) => final HTML

Although some engines are designed specifically for HTML output, many can be used to generate any type of a text output.

Node has a <a href="https://npmjs.org/search?q=template" target="blank">rich ecosystem</a> of template systems available. Since it is server-side JavaScript, many of these engines are built to work both on the client and server. The benefit: template reuse in your web applications.

> All the template systems mentioned in this article work both client and server side.

In this article, rather than boring you with a module by module synopsis (hint: we’d be here for a while), we will zoom out and look at the types of systems that are available and why you might choose one style over another depending on your needs.

<!--more-->

## Types of Template Systems

Node’s web template systems can be divided into four general approaches. They are:

  1. Embedded JavaScript
  2. Custom Domain Specific Languages (DSLs)
  3. Logic-less
  4. Programmatic

## **Embedded JavaScript**

Like the style of PHP, JSP, or ERB templates? Prefer working with vanilla JavaScript? If so, take a look at embedded JavaScript. At the core, these engines allow JavaScript code to be evaluated within a template. The most notable is <a href="https://github.com/visionmedia/ejs" target="blank">EJS</a>, which looks a lot like PHP or JSP (except it uses JavaScript, of course):

```ejs
<% if (loggedIn) { %>
 <a href="/account"><%= firstName %> <%= lastName %></a>
<% } else { %>
 <a href="/login">Log In</a>
<% } %>

<ul>
  <% records.forEach(function (record, index) { %>
  <li>
    <%=index%>: <%= record.title %>
  </li>
    <% } %>
</ul>
```

In addition to embedded JavaScript, EJS templates include extras like partials and filters. One notable usage of EJS templates is the <a href="https://npmjs.org/" target="blank">npmjs site</a> (<a href="https://github.com/isaacs/npm-www" target="blank">GitHub</a>).

If you only need interpolation and evaluation in your templates (no extras like partials, filters, etc), check out the micro-templating provided in <a href="http://underscorejs.org/#template" target="blank">Underscore</a>/<a href="http://lodash.com/docs#template" target="blank">Lo-Dash</a>. There also are <a href="https://github.com/sstephenson/eco" target="blank">embedded CoffeeScript templates</a>.

## Custom Markup Languages

Writing vanilla JavaScript templates can get verbose and ugly with

`<% } %>`

code sitting all over the place. Here is where the world of custom <a href="http://en.wikipedia.org/wiki/Domain-specific_language" target="blank">DSL</a>s comes in. These languages vary widely on syntax. However, you’ll typically end up with cleaner templates and some extra goodies like mixins, filters, and inheritance. Let’s look at a couple examples.

<a href="http://olado.github.io/doT/" target="blank">doT</a> takes a minimalistic approach (it’s also built for speed):

{% raw %}
```ejs
{{? it.loggedIn }}
  <a href="/account">{{= it.firstName }} {{= it.lastName }}</a>
{{??}}
  <a href="/login">Log In</a>
{{?}}


<ul>
  {{~ it.records :record:index }}
  <li>
    {{= index}}: {{= record.title }}
  </li>
    {{~}}
</ul>
```
{% endraw %}

To contrast, here is Jade’s indentation-based style:

```js
if loggedIn
  a(href="/account") #{firstName} #{lastName}
else
  a(href="/login") Log In
ul
  each record in records
    li #{index}: #{record.title}
```

Many DSLs are implemented in multiple languages (e.g. Jade and <a href="https://github.com/creationix/haml-js" target="blank">Haml</a>). For instance, a PHP backend could share templates with Node backend. DSLs can be helpful for designers who work with templates because it doesn’t require them to learn a full-fledged language.

Some other notable libraries include <a href="http://paularmstrong.github.io/swig/" target="blank">Swig</a> and <a href="http://jlongster.github.io/nunjucks/" target="blank">Nunjucks</a>.

## **Logic-less**

Logic-less templates, a concept popularized by <a href="http://mustache.github.io/" target="blank">Mustache</a>, essentially prevent _any_ data massaging in the template itself. Although there are “logical” constructs provided (like if/then and iteration), any finessing of the data happens _outside_ the template. Why? The goal is to <a href="http://stackoverflow.com/questions/3896730/whats-the-advantage-of-logic-less-template-such-as-mustache" target="blank">separate concerns</a> by preventing business logic from creeping into your views.

Let’s take a peak at <a href="https://github.com/janl/mustache.js" target="blank">Mustache</a>:

{% raw %}
```mustache
{{#loggedIn}}
  <a href="/account">{{firstName}} {{lastName}}</a>
{{/loggedIn}}
{{^loggedIn}}
  <a href="/login">Log In</a>
{{/loggedIn}}

<ul>
  {{#records}}
  <li>
    {{title}}
  </li>
    {{/records}}
</ul>
```
{% endraw %}

Other popular template engines in this vein include <a href="http://handlebarsjs.com/" target="blank">Handlebars</a> and <a href="http://linkedin.github.io/dustjs/" target="blank">Dust</a>; both add helpers to the base Mustache syntax. The Mustache parser, in particular, has been implemented for a <a href="http://mustache.github.io/" target="blank">lot of languages</a>.

## **Programmatic templates**

The last style we will explore is programmatic. Unlike the previous styles, which add custom syntax to HTML, these modules augment plain HTML and/or build it from scratch with data. For example, <a href="https://github.com/substack/hyperglue" target="blank">hyperglue</a> processes plain HTML, like:

```html
<a></a>
<ul>
  <li>
  </li>
</ul>
```

Then, by writing the following JavaScript code (using CSS selector syntax), it returns a populated HTML fragment:

```js
var fragment = hyperglue(html, {
a: {
href: loggedIn ? "/account" : "/login",
_text: loggedIn ? firstName + ' ' + lastName : "Login"
},
'ul li': records.map(function (record, index) {
return { li: { _text: index + ': ' + record.title } }
})
})
console.log(fragment.innerHTML)
```

To expound more on this concept, check out <a href="http://substack.net/shared_rendering_in_node_and_the_browser" target="blank">@substack’s article</a>. Other programmatic examples include <a href="https://github.com/medikoo/domjs" target="blank">domjs</a> and <a href="https://github.com/flatiron/plates" target="blank">Plates</a>.

## **Wrapping up**

In this article, we looked at the types of template systems available for Node. In closing, here are some suggestions:

  1. If you are newer to Node template engines, start with something familiar to previous platforms you’ve used (in many cases this will be EJS). Then, branch out.
  2. Stuck in one style or one engine? Be brave, try another style. Learn its strengths and weaknesses.
  3. Need more help choosing a module for that next project? Garann Mean has setup a <a href="http://garann.github.io/template-chooser/" target="blank">great site</a> to help you.

Happy templating!

## **What’s next?**

  * Ready to build your next mobile app with a Node backend? We’ve made it easy to get started either locally or on your favorite cloud, with simple npm install. <a href="http://strongloop.com/get-started/" target="blank">Get Started >></a>
  * Want to read more articles like this? Check out [&#8220;Node.js support in Visual Studio? You bet your IDE&#8221;](http://strongloop.com/strongblog/node-js-support-in-visual-studio-you-bet-your-ide/), [&#8220;Using a Digital Ocean Droplet for On Demand Node.js Mobile Backend&#8221;](http://strongloop.com/strongblog/using-a-digital-ocean-droplet-for-on-demand-node-js-mobile-backend/), [&#8220;How-to: Heap Snapshots and Handling Node.js Memory Leaks&#8221;](http://strongloop.com/strongblog/how-to-heap-snapshots/) and [&#8220;Using Express.js for APIs&#8221;](http://strongloop.com/strongblog/using-express-js-for-apis-2/).
  * Do you want to keep up on the latest Node.js news and developments? Sign up for [&#8220;In the Loop&#8221;](http://strongloop.com/newsletter), StrongLoop&#8217;s newsletter.
