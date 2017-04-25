---
id: 20817
title: Bypassing Express View Rendering for Speed and Modularity
date: 2014-11-04T18:48:22+00:00
author: Patrick Steele-Idem
guid: http://strongloop.com/?p=20817
permalink: /strongblog/bypassing-express-view-rendering-for-speed-and-modularity/
categories:
  - Community
  - Express
  - How-To
---
One of the widely used features of the <a href="http://expressjs.com/" rel="noreferrer">Express</a> web framework for Node.js is its view rendering engine. The Express view rendering engine allows page controllers to provide a view name and a view model object to Express that then results in some bytes being written to the HTTP response stream. Based on experience supporting the development of the Node.js stack at eBay, we have found drawbacks with this approach and decided to not use it completely. As a result, we have seen many benefits such as faster page loads, improved modularity and better developer productivity. This post will explain why you may not want to use the Express view rendering engine and I will also highlight a recommended alternative.

[<img class="aligncenter size-full wp-image-20833" src="https://strongloop.com/wp-content/uploads/2014/11/Screen-Shot-2014-11-05-at-8.28.40-AM.png" alt="expressjs" width="803" height="220" srcset="https://strongloop.com/wp-content/uploads/2014/11/Screen-Shot-2014-11-05-at-8.28.40-AM.png 803w, https://strongloop.com/wp-content/uploads/2014/11/Screen-Shot-2014-11-05-at-8.28.40-AM-300x82.png 300w, https://strongloop.com/wp-content/uploads/2014/11/Screen-Shot-2014-11-05-at-8.28.40-AM-705x193.png 705w, https://strongloop.com/wp-content/uploads/2014/11/Screen-Shot-2014-11-05-at-8.28.40-AM-450x123.png 450w" sizes="(max-width: 803px) 100vw, 803px" />](https://strongloop.com/wp-content/uploads/2014/11/Screen-Shot-2014-11-05-at-8.28.40-AM.png)

<!--more-->

## <a href="https://gist.github.com/patrick-steele-idem/37c1fd35a7a23336a52e#the-express-view-rendering-engine" rel="noreferrer" name="user-content-the-express-view-rendering-engine"></a>**The Express View Rendering Engine**

Before explaining the drawbacks of the Express view rendering engine, let’s take a quick look at how to utilize this feature. The first thing you must do is configure your Express app using code similar to the following:

<div>
  ```js
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
```js
</div>

The first lines tell Express to search for all templates within a single “views” directory. The second line enables the “jade” view engine for loading Jade templates found in the views directory.

Once configured, you can render a view from your page controller using the `res.render(viewName, viewModel)` method as shown in the following code:

<div>
  ```js
app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!'});
})
```js
</div>

Internally, Express resolves the view name to a template file path, renders the template using the associated template engine, writes the resulting output to the response and then finally ends the response.

## <a href="https://gist.github.com/patrick-steele-idem/37c1fd35a7a23336a52e#the-bad" rel="noreferrer" name="user-content-the-bad"></a>**The Bad**

This approach might seem simple enough so you might be wondering what could possibly be wrong. There’s actually quite a few problems with this approach that impact web application performance and maintainability and we will break those problems down in the next few sections.

## <a href="https://gist.github.com/patrick-steele-idem/37c1fd35a7a23336a52e#breaks-modularity" rel="noreferrer" name="user-content-breaks-modularity"></a>_Breaks Modularity_

By being forced to configure a single “views” directory, you are essentially creating a dumping ground for all templates. Instead of putting templates next to the page controllers or UI components that use those templates, those templates are forced to be placed under a separate top-level directory. A typical Express-based project will have a directory structure similar to the following:

  * **routes/** 
      * home.js
      * login.js
      * &#8230;
  * **views/** 
      * home.jade
      * login.jade
      * &#8230;

With the Express-recommended directory structure you are forced to fork resources _by type_ versus_by feature_. As a result, closely related files will be split into completely separate directory trees instead of residing in the same directory. We will show a much more sane and modular directory structure at the end of this article.

## <a href="https://gist.github.com/patrick-steele-idem/37c1fd35a7a23336a52e#tightly-coupled-with-express" rel="noreferrer" name="user-content-tightly-coupled-with-express"></a>_Tightly Coupled With Express_

When using the Express view rendering engine you are using a feature that is tightly coupled with Express. What if you want to render a template on the client? How are template partials resolved? What if you want to switch to a different web framework or use no framework at all? The fact of the matter is, Express introduces a new way of resolving and rendering templates that only works on the server and that only works with Express. When building isomorphic web applications we are looking for a more consistent way to render templates on both the server and the client.

## <a href="https://gist.github.com/patrick-steele-idem/37c1fd35a7a23336a52e#no-streaming" rel="noreferrer" name="user-content-no-streaming"></a>_No Streaming_

The Express view rendering engine does not support streaming. This is bad for both server-side performance and client-side performance. On the server, when rendering an HTML page template, the entire HTML output is kept in memory as a potentially large string. Not until the entire HTML output is constructed is the first byte then written to the HTTP response. Internally, this is because all view engines must be implemented using a callback. Not until the entire HTML is rendered can the callback then be invoked. By not streaming out HTML, we are wasting server-side memory and we are increasing the time-to-first-byte for the client.

The benefits of streaming out the response include sending out the `<head>` section of the page sooner, thus giving the client a head start on downloading the page CSS. To see the benefits of streaming you would need to use a templating language that supports streaming. In addition, templating languages that support asynchronous rendering (such as <a href="https://github.com/raptorjs/marko" rel="noreferrer">Marko</a>, <a href="https://github.com/linkedin/dustjs" rel="noreferrer">Dust</a> or <a href="https://github.com/mozilla/nunjucks" rel="noreferrer">Nunjucks</a>) can begin streaming out the response even before before view model for the page is fully constructed which provides even more performance gains.

## <a href="https://gist.github.com/patrick-steele-idem/37c1fd35a7a23336a52e#centralized-configuration" rel="noreferrer" name="user-content-centralized-configuration"></a>_Centralized Configuration_

Not all configuration is bad, but unnecessary configuration is bad. Also, a centralized configuration can introduce friction if different parts of the application need to be configured differently. For example, what if there needs to be <a href="https://github.com/strongloop/express/pull/1186" rel="noreferrer">multiple view directories</a>? Express sub-apps help to some degree, but it is best to avoid a solution that requires extra configuration.

## <a href="https://gist.github.com/patrick-steele-idem/37c1fd35a7a23336a52e#the-solution" rel="noreferrer" name="user-content-the-solution"></a>**The Solution**

While Express describes itself as a framework, it is actually quite easy to bypass the Express view rendering engine. This allows developers to create applications that are more flexible, easier to understand and better performing. An important thing to know when using Express is that the `res`object is actually a writable HTTP response stream (although it is heavily monkey-patched by Express). Therefore, you can write directly to the response if you choose:

<div>
  ```js
app.get('/', function (req, res) {
    res.write('Hello Frank');
    res.end();
});
```js
</div>

If you want to render a Jade template to the HTTP response you could do the following:

<div>
  ```js
var templatePath = require.resolve('./template.jade');
var templateFn = require('jade').compileFile(templatePath);

app.get('/', function (req, res) {
    res.write(templateFn({name: 'Frank'});
    res.end();
});
```js
</div>

That solution is a little more verbose than just using `res.render()`, but it is very straightforward and provides extra flexibility.

_NOTE:_ You will notice that we are using <a href="http://nodejs.org/api/globals.html#globals_require_resolve" rel="noreferrer"><code>require.resolve</code></a> to get the absolute path for a template in the same directory as our page controller module.

If your templating engine supports writing to a stream then the code is even simpler. For example, the <a href="https://github.com/raptorjs/marko" rel="noreferrer">Marko</a> templating engine supports writing to a stream as shown in the following code:

<div>
  ```js
var templatePath = require.resolve('./template.marko');
var template = require('marko').load(templatePath);

app.get('/', function (req, res) {
    template.render({name: 'Frank'}, res);
});
```js
</div>

## <a href="https://gist.github.com/patrick-steele-idem/37c1fd35a7a23336a52e#view-resolver" rel="noreferrer" name="user-content-view-resolver"></a>_View Resolver_

If you feel that your application would benefit from a view resolver (maybe you want to use a different template for A/B testing or have the template vary by the user&#8217;s locale) then there is a clean solution for that as well. The following hypothetical code illustrates how a view resolver could be used independent of Express to resolve a view template given a name and some context (in this case, the request and the current directory):

<div>
  ```js
var myViewResolver = require('my-view-resolver');

app.get('/', function (req, res) {
    var template = myViewResolver.resolve('hello', req, __dirname);
    template.render({name: 'Frank'}, res);
});
```js
</div>

Using an explicit view resolver makes code easier to understand and also provides greater flexibility.

## <a href="https://gist.github.com/patrick-steele-idem/37c1fd35a7a23336a52e#project-structure" rel="noreferrer" name="user-content-project-structure"></a>_Project Structure_

Now that you have broken out of having a single &#8220;views&#8221; directory, let&#8217;s take a look at the new project structure that we can support:

  * **pages/** 
      * **home/** 
          * index.js
          * style.css
          * template.marko
      * **login/** 
          * index.js
          * style.css
          * template.marko

Our new directory structure allows closely related files to be in the same directory—a win for modularity!

## <a href="https://gist.github.com/patrick-steele-idem/37c1fd35a7a23336a52e#summary" rel="noreferrer" name="user-content-summary"></a>**Summary**

Even though Express is a minimalist framework, there is still nothing wrong with not using all of its features. Sometimes things are better left handled by separate modules. The Node.js mantra is “create modules that do one thing and one thing well&#8221; and I would argue that Express could benefit from splitting out certain features such as view rendering and routing. We have already seen much of the core middleware separated out to separate middleware with the introduction of Express 4.x, but I would argue that maybe we shouldn&#8217;t stop there. Maybe we didn&#8217;t need a framework after all. Maybe we just needed a collection of modules that play nice together. But I digress&#8230;

Hopefully it is clear that there are great benefits to bypassing the Express view rendering. If you are interested in taking a look at a sample application before making the leap, please check out the source code for the <a href="https://github.com/patrick-steele-idem/express-view-streaming" rel="noreferrer">sample app</a>. For a more involved sample app, please take a look at the <a href="https://github.com/raptorjs/raptor-samples/tree/master/weather" rel="noreferrer">sample weather app</a>.