---
id: 26048
title: The Foundations of Universal (or Isomorphic) JavaScript
date: 2015-09-11T08:03:11+00:00
author: Marc Harter
guid: https://strongloop.com/?p=26048
permalink: /strongblog/the-foundations-of-universal-or-isomorphic-javascript/
categories:
  - JavaScript Language
---
In the [last tutorial](https://strongloop.com/strongblog/javascript-babel-future/), we wrote a Node program using Babel. This allowed us to use ES6 features now and experiment with new language proposals in a backwards-compatible way. We looked at testing, linting, and running programs in production.

Now let’s turn our attention to programs that share code between the server and client. These are most popularly called _isomorphic_ or _universal_ JavaScript applications. Since Babel compiles down to ES5 JavaScript, it allows us to write modern JavaScript (ES6 and beyond) and have it work the same across the majority of platforms[[1]](1 "see footnote"){#fnref:1.footnote} in use today.

<!--more-->

There are [_many_ isomorphic examples](https://github.com/search?l=JavaScript&q=isomorphic&type=Repositories&utf8=%E2%9C%93) in the wild but it can be hard to wrap your head around all the ideas present in them. This article aims to explain the core foundations of isomorphism:

  1. A common JavaScript for client/server
  2. A common module system
  3. 3rd-party modules that can function on both client and server

## **A common JavaScript** {#acommonjavascript}

As we discussed prior, Babel solves our first problem well in a modern JavaScript fashion. So we will forgo more discourse on that point. Yet, Babel itself isn’t required for this step; you just need a subset of JavaScript that can work across all the platforms you want to support. ES5 is likely a safe bet in that regard. If you need older JavaScript support (IE8), you may want to consider using [a shim](https://github.com/es-shims/es5-shim) or limiting yourself to ES3.

## **A common module system** {#acommonmodulesystem}

Node has a nice established module system. Browsers… well not so much. If we want to share code that uses `require('lodash')` (the common way to use modules in Node) with the browser, we have to teach the browser some tricks. This is where [webpack](https://webpack.github.io/) enters in.

Webpack makes client-side development more “Node-like” with the same module system[[2]](2 "see footnote"){#fnref:2.footnote} semantics. This is important because if we are to share code, we want a `require` (or ES6 `import`) statement to resolve the same way. It also exposes Node globals (properties and methods on Node’s `global` object) as well to keep things familiar (like `process` and `Buffer`).

But client-side development isn’t just JavaScript. It’s CSS; it’s images; it’s HTML; it’s a lot of things. Webpack understands those dependencies too and let’s you `require` them using _loaders_. We’ll come back to that in a bit.

## **3rd-party isomorphic modules** {#3rd-partyisomorphicmodules}

Not all modules are created the same. Some work only within a Node environment, others work only in the browser. But there are a growing number that can work on both sides. When sharing, use modules that work on both sides.

As an example, Node has a built-in HTTP client as do browsers with Ajax. [Superagent](http://visionmedia.github.io/superagent), an isomorphic HTTP client, provides a common API for client and server, tapping into built-in facilities behind the scenes. Here is a list of some popular isomorphic modules:

  1. Utility libraries like [lodash](http://lodash.com/) and [Ramda](http://ramdajs.com/)
  2. User interface/markup libraries like [React](http://reactjs.com/)[[3]](3 "see footnote"){#fnref:3.footnote}
  3. Ajax/HTTP clients like [Superagent](http://visionmedia.github.io/superagent) and [Mach](https://github.com/mjackson/mach)
  4. Routing libraries like [React Router](https://github.com/rackt/react-router) or [Director](https://github.com/flatiron/director)
  5. Testing libraries like [tape](https://github.com/substack/tape) and [Mocha](https://mochajs.org/).

## **Let’s build something: How’s your reaction time?** {#letsbuildsomething:howsyourreactiontime}

Let’s build a program that incorporates those core foundations as well as have some fun testing your reaction time via the [Stroop effect](https://en.wikipedia.org/wiki/Stroop_effect). If you are unfamiliar, here is a little synopsis from Wikipedia:

> > When the name of a color (e.g., “blue”, “green”, or “red”) is printed in a color not denoted by the name (e.g., the word “red” printed in blue ink instead of red ink), naming the color of the word takes longer and is more prone to errors than when the color of the ink matches the name of the color.

Our program will generate a color test. A player then must:

  1. Name the _written_ color as soon as possible.
  2. Generate a new test by either refreshing the page (a server-side action) or clicking the color (a client-side action).
  3. Repeat these steps till you’ve gone mad, or share with a friend.

A sample test looks like:<figure>

[<img class="aligncenter size-full wp-image-26052" src="https://strongloop.com/wp-content/uploads/2015/09/screenshot.png" alt="screenshot" width="1930" height="766" srcset="https://strongloop.com/wp-content/uploads/2015/09/screenshot.png 1930w, https://strongloop.com/wp-content/uploads/2015/09/screenshot-300x119.png 300w, https://strongloop.com/wp-content/uploads/2015/09/screenshot-1030x409.png 1030w, https://strongloop.com/wp-content/uploads/2015/09/screenshot-1500x595.png 1500w, https://strongloop.com/wp-content/uploads/2015/09/screenshot-705x280.png 705w, https://strongloop.com/wp-content/uploads/2015/09/screenshot-450x179.png 450w" sizes="(max-width: 1930px) 100vw, 1930px" />](https://strongloop.com/wp-content/uploads/2015/09/screenshot.png)</p> <figcaption>Stroop effect test</figcaption> </figure> 

Feeling a little insane yet? Let’s put this app together.

## **Our application structure and dependencies** {#ourapplicationstructureanddependencies}

Our application will have the following structure:

```js
.
├── modules
│   ├── client        // Client-side modules
│   ├── server        // Server-side modules
│   └── shared        // Shared modules
├── .babelrc          // Babel configuration
├── index.js
├── package.json
└── webpack.config.js // Webpack configuration

```

<span style="font-family: Georgia, 'Times New Roman', 'Bitstream Charter', Times, serif; font-size: 16px; background-color: #ffffff;">To kick things off, get a starter </span><em style="font-family: Georgia, 'Times New Roman', 'Bitstream Charter', Times, serif; font-size: 16px;">package.json</em><span style="font-family: Georgia, 'Times New Roman', 'Bitstream Charter', Times, serif; font-size: 16px; background-color: #ffffff;"> file created by running </span><code style="font-size: 16px;">npm init -y</code><span style="font-family: Georgia, 'Times New Roman', 'Bitstream Charter', Times, serif; font-size: 16px; background-color: #ffffff;"> in the project directory. Then, install the development dependencies we will use by running:</span>

```js
npm install babel webpack webpack-dev-server babel-loader concurrently –save-dev
```

  * `babel` includes what we need to run node and Babel together in development
  * `webpack` is our client-side build system
  * `webpack-dev-server` serves and watches our client-side build in development
  * `babel-loader` teaches webpack how to load client-side JavaScript files using Babel
  * `concurrently` allows us to execute multiple programs concurrently

We will also need a couple application dependencies. Install them by running:

```js
npm install babel-runtime react –save
```

  * `React` is for rendering and managing events in our Stroop component
  * `babel-runtime` will only include those modules we need when working with Babel. This is a plus for production. On the server, we will load less data in memory; on the client, we will have a smaller payload.

## **Configuring Babel for client and server development** {#configuringbabelforclientandserverdevelopment}

Let’s get our Babel configuration set up next. Here, both server and client side share a single _.babelrc_ configuration file. Create that file with following content:

```js
{
 "stage": 0,
 "optional": ["runtime"]
}
```

  * `"stage": 0` indicates that, in addition to ES6, we will make use of any new language proposals
  * `"optional": ["runtime"]` indicates that we want to use the babel-runtime

Now add an `index.js` file in the project root to bootstrap Babel for our server-side code:

```js
require('babel/register-without-polyfill')
require('./modules/server')
```

&nbsp;

  * The `babel/register-without-polyfill` will load Babel without all the polyfills since we are using `babel-runtime` to detect.
  * Require the main `./modules/server` after registering.

We will skip client-side integration with Babel for now and come back to it later.

## **Writing the shared code** {#writingthesharedcode}

Since we are focusing on shared code, let’s start with that first. We will be using the isomorphic React library to do our rendering on both the client and the server side as well as making a shared utility to generate a random color/label pair.

Create a file called _stroop.js_ and put the following contents inside:

```js
import React, { Component, PropTypes } from 'react'
import getRandomColorName from './getRandomColorName'

class Stroop extends Component {
  static propTypes = {
    color: PropTypes.string,
    name: PropTypes.string
  }

  constructor (props) {
    super(props)
    const { name = 'red', color = 'black' } = props
    this.state = { name, color }
  }

  changeColor () {
    this.setState({
      color: getRandomColorName(),
      name: getRandomColorName()
    })
  }

  render () {
    const style = {
      color: this.state.color,
      textAlign: 'center',
      fontSize: 300,
      cursor: 'pointer'
    }

    return (  
      &lt;h1 style={style} onClick={::this.changeColor}&gt;
        {this.state.name}
      &lt;/h1&gt;  
    )
  }
}

export default Stroop
```

If you haven’t worked with React, it may be baffling to see `<h1>` tags showing up in your JavaScript! Those are [JSX tags](https://facebook.github.io/react/docs/jsx-in-depth.html), supported by Babel out of the box. We also make use of the [bind proposal](https://github.com/zenparsing/es-function-bind) (`::`) and [class properties proposal](https://gist.github.com/jeffmo/054df782c05639da2adb). This component outputs our main Stroop UI attaching events.

In addition to React, we also import a small utility called _getRandomColorName.js_ which as you probably can guess returns a random color name we can use in our application. Add that file to the shared directory with the following contents:

```js
const names = Object.freeze([
  'yellow',
  'red',
  'blue',
  'green',
  'orange',
  'violet'
])

/**
 * Get a random color name
 */
export default function getRandomColorName () {
  const idx = Math.ceil(Math.random() * names.length) - 1
  return names[idx]
}
```

That’s it for shared code. Let’s turn our attention to the server.

## **Writing the server** {#writingtheserver}

Now we have a shared component and the necessary utilities it needs to run, we need a web server to host our content. Under the _modules/server_ folder let’s add a _index.js_ file to serve as the entry point to our server-side code.

```js
import { createServer } from 'http'
import React from 'react'
import Stroop from '../shared/stroop'
import getRandomColorName from '../shared/getRandomColorName'

const server = createServer()

server.on('request', (req, res) =&gt; {
  const data = {
    color: getRandomColorName(),
    name: getRandomColorName()
  }

  const stroop = React.renderToString(&lt;Stroop {…data} /&gt;)
  const serverData = window.SERVER_DATA = ${JSON.stringify(data)}

  const html = React.renderToStaticMarkup(
    &lt;html&gt;
      &lt;head&gt;
        &lt;script dangerouslySetInnerHTML={{__html: serverData}} /&gt;
        &lt;script src='http://localhost:3001/bundle.js'&gt;&lt;/script&gt;
      &lt;/head&gt;
      &lt;body&gt;
        &lt;div id='app' dangerouslySetInnerHTML={{__html: stroop}} /&gt;
      &lt;/body&gt;
    &lt;/html&gt;
  )

  res.setHeader('Content-Type', 'text/html; charset=UTF–8')
  res.end('&lt;!doctype html&gt;' + html)
})

server.listen(3000)
```

  * Import the shared `Stroop` component to render and the `getRandomColorName` function to generate a new color pair on each request.
  * Use React’s `renderToString` method to give us HTML markup we can pass to the client. `renderToString` includes tracking information that React uses on the client.
  * Use the `renderToStaticMarkup` method to insert our component into a larger page content. The `renderToStaticMarkup` renders just markup without any React tracking information.
  * Set the proper content type and encoding.

The `renderToString` method, `serverData` variable and the `<script>` tags pass the necessary data to the client in order to render its side. We also include a `<script>` to a `bundle.js` file. This is our webpack development server we will talk about momentarily.

We now have a working application (on the server-side)! Try it out by running `node index.js` in the project root and visiting [http://localhost:3000](http://localhost:3000/) in your favorite browser. Whenever you refresh the browser, you will get a new test. Groovy!

## **Setting up webpack** {#settingupwebpack}

One of the things webpack helps solve our ‘having a common module system’ problem for client-side code. It also gives us tools to bundle our client-side JavaScript code and add source maps. In fact, you can bundle a lot more than just JavaScript with webpack: styles, images, other text formats to name a few. Webpack calls these _loaders_. For our project, we just need the `babel-loader` installed earlier.

By default, webpack will look for a configuration file called `webpack.config.js`. Go ahead and add that file the following contents:

```js
'use strict'
const publicPath = 'http://localhost:3001/'

module.exports = {
  devtool: 'source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:3001',
    './modules/client'
  ],
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js',
    publicPath: publicPath
  },
  module: {
    loaders: [{
      test: /.js$/,
      loaders: ['babel'],
      exclude: /node_modules/
    }]
  },
  devServer: {
    contentBase: 'http://localhost:3001',
    publicPath: publicPath,
    port: 3001,
    headers: { 'Access-Control-Allow-Origin': '*' }
  }
}
```

  1. `devtool` specifies what development tool to use when bundling, if any. Here we use `source-map` to generate full source maps with our JavaScript. With source maps we can debug our code as we wrote it, instead of the compiled version.
  2. `output` specifies where to place the bundle (`path`), what to call it (`filename`) and where to host it when using a development server (`publicPath`).
  3. `module` teaches webpack how to `require` (or `import`) different types of files. Here we specify that we want any `.js` files to use the `babel` loader. We exclude anything within `node_modules` as those shouldn’t need Babel.
  4. `devServer` defines options for the webpack-dev-server. We host our webpack server on a different port than our HTTP server in so we can run both in tandem. For this reason, we enable CORS.[[4]](4 "see footnote"){#fnref:4.footnote}

This is just a fraction of all you can do with webpack, I would encourage reading [Pete Hunt’s webpack-howto](https://github.com/petehunt/webpack-howto) to further your understanding.

## **Writing the client** {#writingtheclient}

Our client-side code will look similar to the server-side. Add an _index.js_ file inside the _client_ folder with the following contents:

```js
import React from 'react'
import Stroop from '../shared/stroop'

document.addEventListener('DOMContentLoaded', _ =&gt; {
  const app = document.getElementById('app')
  React.render(&lt;Stroop {…window.SERVER_DATA} /&gt;, app)
})
```

That’s it for client code. We include our `Stroop` component and when the DOM has loaded we grab the container div for our component (which we gave an id of `app` on the server-side) then we render the `Stroop`component passing the same data that we used to render the component on the server side. React is smart enough to know we are operating against the same markup and will only attach event listeners so we can click on the color test to generate a new one.

## **Putting it all together** {#puttingitalltogether}

We are almost set. Can you hardly stand it?! We just need a little npm script to tie it together. Edit the `package.json` file, and add the following `start` script to the scripts section:

```js
…
"scripts": {
 "start": "concurrent –kill-others \"webpack-dev-server\" \"node index.js\"",
},
…
```

  * `conncurrent` starts both our node and webpack servers together and `--kill-others` shuts down both if either exits.
  * `webpack-dev-server` bundles and watches our client-side code using the _webpack.config.js_ settings and hosts them on port 3001.
  * `node index.js` starts our server and hosts the app on port 3000.

To run our app. We just execute:

```js
npm start
```

Now you can refresh (server) the page to generate a new test or click (client) on the color. Happy Strooping!

## **Wrapping up** {#wrappingup}

In this article, we discussed what it takes to build an isomorphic web application and went through a simple example covering the foundations. Yet, I left one important piece out that I leave for you to implement: bundling this application for production.

Here are some steps:

  1. Set up a `build-server` npm script to bundle the server-side code. Hint: look at the [prior article](https://strongloop.com/strongblog/javascript-babel-future/).
  2. Set up a `build-client` npm script that runs `NODE_ENV=production webpack`. This will output a bundled client-side JavaScript file and source map in the _public_ directory for distribution. The `NODE_ENV=production`part helps eliminate extra debugging code for React but is becoming more common practice for other libraries.
  3. Modify _modules/server/index.js_ to behave differently when `NODE_ENV=production`. 
      1. First, serve the _public/bundle.js_ file when requested. Hint: `req.url` and `fs.createReadStream`.
      2. Second, render static markup that uses the _public/bundle.js_ file as the script source instead of the webpack-dev-server `localhost:3001` one.

Ultimately after running your build scripts, you should be able to run `NODE_ENV=production node build` and see your working production app and still run `npm start` and see the development version. Good luck!

<div class="footnotes">
  <hr />
  
  <ol>
    <li id="fn:1">
      There are some <a href="https://babeljs.io/docs/advanced/caveats/">browser caveats</a>. For ES3 environments, also include the <a href="https://github.com/es-shims/es5-shim">es5-shim</a>.  <a class="reversefootnote" title="return to article" href="1"> ↩</a>
    </li>
    <li id="fn:2">
      Browserify is another good alternative to Webpack.  <a class="reversefootnote" title="return to article" href="2"> ↩</a>
    </li>
    <li id="fn:3">
      If you are developing in React, you are in luck as isomorphism is an important part of many modules.  <a class="reversefootnote" title="return to article" href="3"> ↩</a>
    </li>
    <li id="fn:4">
      This setup becomes immensely helpful when using hot reloading with webpack. <a class="reversefootnote" title="return to article" href="4"> ↩</a>
    </li>
  </ol>
  
  <p>
    &nbsp;
  </p>
</div>