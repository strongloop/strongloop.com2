---
id: 24852
title: 'How to Implement Node + React Isomorphic JavaScript &amp; Why it Matters'
date: 2015-06-10T08:00:43+00:00
author: davidwells
guid: https://strongloop.com/?p=24852
permalink: /strongblog/node-js-react-isomorphic-javascript-why-it-matters/
categories:
  - Community
  - JavaScript Language
---
## <img class=" size-full wp-image-24869 alignright" src="https://strongloop.com/wp-content/uploads/2015/05/isomorphic-flow.jpg" alt="isomorphic-flow" width="386" height="289" srcset="https://strongloop.com/wp-content/uploads/2015/05/isomorphic-flow.jpg 386w, https://strongloop.com/wp-content/uploads/2015/05/isomorphic-flow-300x225.jpg 300w" sizes="(max-width: 386px) 100vw, 386px" />**What is Isomorphic JavaScript?**

TL;DR: JavaScript rendered on the server AND the client.

In a nutshell, you are rendering your application markup on the server & piping it down as the complete html to the browser.

_(Sidenote: Isomorphism is also a mathematical term that means something different, but whatever. This is about JS)_

## **Why is it useful?**

Isomorphic JavaScript is useful for a number of reasons, lets run through the major ones.

## **1. Faster Perceived Load Times + Better Global UX**

With the proliferation of more and more of the web being driven by JavaScript, The speed of the browser DOM is becoming increasingly noticeable.

Lots of sites being driven by popular JavaScript frameworks like Ember, Backbone, or Angular can take a while to render into the DOM. This forces the user to wait for the app to bootstrap itself before they can start viewing & &#8216;using&#8217; the app.

Making users wait for an app to bootstrap is a **sub-par** user experience. It is easily avoidable by implementing server-side rendering.

When you render your applications markup on the server, the page loads immediately to the user and they can start doing whatever they what without any wait.

## **Better Global UX**

These faster &#8216;perceived&#8217; load times are especially important in places with high internet latency.

Downloading a large JS app can take a ton on time if your bandwidth is limited.

Don&#8217;t believe me?  See for yourself: Use the [Network Link Conditioner](http://nshipster.com/network-link-conditioner/) to simulate slower load times on your local machine and clear your browser cache.

## **2. Search Engine Indexability**

One of the primary reasons for doing &#8216;isomorphic&#8217; javascript is for better visible for search engines.

If your application is public facing (ie not behind a login), having you application data indexed is critical for growing organic traffic to your application.

While google notes that they [do javascript rendering](http://googlewebmastercentral.blogspot.com/2014/05/understanding-web-pages-better.html) as of May 23rd 2014, they state &#8220;It&#8217;s always a good idea to have your site degrade gracefully.&#8221; IE rendering on the server, so if the client does not have javascript enabled, the person can still see the site.

A live example of Google&#8217;s Javascript rendering/indexing can be seen on [Bustle.com](http://www.bustle.com/), which is actually missing a chunk of the page in [google&#8217;s cache](http://webcache.googleusercontent.com/search?q=cache:WVG44hauezwJ:www.bustle.com/+&cd=1&hl=en&ct=clnk&gl=us)

In my opinion, I think it&#8217;s best to not leave the indexation of your application to chance. Setup server side rendering and you can be sure that the markup is going to be crawled correctly.

## **3. Free Progressive Enhancements**

Let&#8217;s say you have a form in your react application that binds some events to it&#8217;s submission process. What happens if the person has javascript disabled in their browser? You app won&#8217;t work.

While this is a pretty extreme edge case, it can happen. This person will see a blank screen and have a sad face.

If you rendered that markup on the server, the visitor would still see the styled markup with the form intact. That form should have the normal \`action\` parameter to POST it&#8217;s results to the same endpoint your react application is pointing to.

A great live example of the &#8216;free progressive enhancements&#8217; can be seen on the [react router mega demo](http://react-router-mega-demo.herokuapp.com/). If you turn off your browser&#8217;s javascript, the directory still functions normally.

You can see the [code for the react router mega demo here](https://github.com/rackt/react-router-mega-demo). It&#8217;s a fantastic example of isomorphic serverside rendering by Ryan Florence.

## **4. Easier Code Maintenance**

When implementing an isomorphic solution, We use the same code base*

This makes code debt and code maintenance less of a headache.

*While the code base on client/server are the same, the implementation is slightly different on server vs client. Let&#8217;s walk through that below.

## **How to Implement Serverside Rendering with Node (Express) + React**

We are going to create a simple isomorphic node application using React.

You can grab the completed code here: <https://github.com/DavidWells/isomorphic-react-example>

The example is using the [griddle react component](http://griddlegriddle.github.io/Griddle/) to demonstrate an example where you would indeed want search engines to index your content.

## **Server Side Implementation Flow with React + Express**

  1. Require Component + React in your routes file
  2. Wrap your component in React.createFactory
  3. In your routes, React.renderToString your component. This will generate the initial html seen in the client
  4. Include in template as variable. You can use any templating engine you like
  5. Output in your template file as html

```js
// (1) Require Component + React
var Griddle = require('griddle-react'); // Your react app

// (2) React.createFactory
var App = React.createFactory(Griddle);

// (3) React.renderToString
var reactHtml = React.renderToString(App({})); // make html to send to client

// (4) Include in template as variable
res.render('index.ejs', {reactOutput: reactHtml}); // give template html

// (5) Output in template (index.ejs)
&lt;div id="react-main-mount"&gt; &lt;%- reactOutput %&gt; &lt;/div&gt;
```

## **Express.js Example**

Inside /app/routes/core-routes.js you can see the working example.

When we hit the home route \`/\` express grabs our ReactApp, initializes the createFactory function, then renders the react component into HTML to pipe down to the browser.

```js
/* /app/routes/core-routes.js */
var React = require('react'),
ReactApp = React.createFactory(require('../components/ReactApp'));

module.exports = function(app) {

  app.get('/', function(req, res){

    // React.renderToString takes your component and generates the markup
    var reactHtml = React.renderToString(ReactApp({}));

    // Output html rendered by react into .ejs file. Can be any template
    res.render('index.ejs', {reactOutput: reactHtml});
  });

};
```

Then inside /views/index.ejs you can see that \`reactHTML\` is then output into the express template. In this instance we are using .ejs for our templating engine, but you can use whatever templating engine you wish ( jade, handlebars, etc )

```js
&lt;!-- /views/index.ejs --&gt;
&lt;!doctype html&gt;
&lt;html&gt;
  &lt;body&gt;
    &lt;div id="react-main-mount"&gt;
      &lt;%- reactOutput %&gt;
    &lt;/div&gt;
  &lt;!-- this script bootstraps the app once the JS is downloaded --&gt;
  &lt;script src="/main.js"&gt;&lt;/script&gt;
  &lt;/body&gt;
&lt;/html&gt;&lt;/p&gt;
```

## **Client Side Implementation Flow**

Everything on the client side should look pretty much the same. You are including your script tag with your bundled application on the page. When the page loads, the app attaches event handles to the existing markup.

The below script is from the /main.js bundle and bootstraps once the page loads.

```js
/* /app/main.js */
var React = require('react');
var ReactApp = require('./components/ReactApp');

var mountNode = document.getElementById("react-main-mount");

React.render(new ReactApp({}), mountNode);
```

If this script doesn&#8217;t load or the person has javascript disabled, they will still see the table output but will be unable to trigger any of the event handlers.

## **Its Easy!**

Implementing &#8216;isomorphism&#8217; is easy with Node and React, so do it today! No excuses.

## **Some Considerations**

While isomorphism is pretty nifty and the cool way to do things, it&#8217;s not always possible to render **everything** from the server.

For example, let&#8217;s say you have a huge chunk on data that needs to get piped down to generate the HTML of your app. This would be a case where you would want to limit that initial query on the server, render just enough so there is no flash of nothingness to the user, and fetch the remaining data once the client loads via an ajax call.

You need to pick and choose your battles if you have a huge huge chunk of data to pipe down. The other workaround for this is implementing pagination for search engines to crawl.

You can pass in data from the server into your React components before the HTML is rendered like so:

```js
/* /app/routes/core-routes.js */
var React = require('react'),
ReactApp = React.createFactory(require('../components/ReactApp'));

module.exports = function(app) {

  app.get('/', function(req, res){
    
    var data = // Do DB query or whatever here

    // React.renderToString with data from DB call
    var reactHtml = React.renderToString(ReactApp({myServerData: data}));

    // Output html and data from DB call to rehydrate app
    res.render('index.ejs', {reactOutput: reactHtml, myServerData: data});
  });

};
```

## **Other handy isomorphic examples:**

  * [Percolatestudio.com](https://github.com/percolatestudio/percolatestudio.com) &#8211; static site example
  * [React router mega demo](http://react-router-mega-demo.herokuapp.com/) &#8211; isomorphism with react router
  * [React Start Kit](http://www.reactstarterkit.com/) &#8211; great build kit using ES6 + babel
  * [a bunch of other examples!](http://react.rocks/tag/Isomorphic)

&nbsp;