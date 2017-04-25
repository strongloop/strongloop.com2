---
layout: post
id: 375
title: How to Test an API with Node.js
date: 2013-05-01T09:40:15+00:00
author: Jed Wood
guid: http://blog.strongloop.com/?p=375
permalink: /strongblog/how-to-test-an-api-with-node-js/
categories:
  - How-To
---
_**Editor&#8217;s note:** This blog post from May 2013 has been updated with current information._

Testing an API with Node.js is dead simple. You can quickly write tests for any API, regardless of its language.

_[Note: You can get all the [code examples](https://github.com/jedwood/api-testing-with-node) used in this post from GitHub.]_

## **Hackers Don&#8217;t Test**

I don&#8217;t like writing tests. Just ask any of my coding teammates. I spent too many years slapping together quick protoypes that were just for proof of concept and didn&#8217;t need to be maintained. I think of testing like financial accounting; I know it&#8217;s vital to keep operations running smoothly, but I much prefer if somebody else handles it.

I&#8217;m getting better though, and it&#8217;s paying off. You&#8217;ve probably already read about the reasons you should write tests. If you&#8217;re still not convinced, consider this: it&#8217;s quickly becoming table stakes for most modern web development projects, much like knowing how to use [Github](http://github.com/). If you want to contribute to open source projects, or make it past your first interview, you&#8217;ve gotta write tests.

## <a href="https://github.com/jedwood/api-testing-with-node#unit-integration-functional-and-acceptance" name="unit-integration-functional-and-acceptance"></a>**Unit, Integration, Functional, and Acceptance**

I&#8217;m going to skip the [philosophy](http://www.agitar.com/downloads/TheWayOfTestivus.pdf) and finer points. Read this answer for a great explanation of the [different types of tests](http://stackoverflow.com/a/4904533/62525). On the most granular level we have unit tests. On the other end of the spectrum were have browser-testing tools like [PhantomJS](http://phantomjs.org/) or SaaS options like [BrowserStack](http://browserstack.com/) and [Browserling](http://browserling.com/). We&#8217;re going to be closer to that high level testing, but since this is purely an API, we don&#8217;t need a browser-level tool.

## <a href="https://github.com/jedwood/api-testing-with-node#our-example-api" name="our-example-api"></a>**Our Example API**

Let&#8217;s take a look at our example API, which is a protected pretend blog. In order to show off some of the testing options, this API:

  * requires Basic Auth
  * requires an API key be passed in as a custom header
  * always returns JSON
  * sends proper status codes with errors

## <a href="https://github.com/jedwood/api-testing-with-node#mocha-chai-and-supertest" name="mocha-chai-and-supertest"></a>**Mocha, Chai, and SuperTest**

If you&#8217;ve spent 30 minutes tinkering with Node.js, there&#8217;s a really good chance you&#8217;ve seen the work of [TJ Holowaychuck](https://github.com/visionmedia) and his army of ferrets. His [Mocha testing framework](http://visionmedia.github.com/mocha/) is popular and we&#8217;ll be using it as a base. Fewer people have seen his [SuperTest](https://github.com/visionmedia/supertest) library, which adds some really nice shortcuts specifically for testing HTTP calls. Finally, we&#8217;re including [Chai](http://chaijs.com/) just to round out the syntax goodness.

    var should = require('chai').should(),
        supertest = require('supertest'),
        api = supertest('http://localhost:5000');


Remember, we&#8217;re passing in the base URL of our API. As a sidenote, if you&#8217;re writing your API in [Express](http://expressjs.com/), you can use SuperTest to hook write into your application without actually running it as a server.

## <a href="https://github.com/jedwood/api-testing-with-node#test-already" name="test-already"></a>**Test Already!**

Install Mocha (`npm install -g mocha`) and check out the [getting started section](http://visionmedia.github.com/mocha/#getting-started). To summarize, you can group little tests (assertions) within `it()` functions, and then group those into higher-level groups within `describe` functions. How many things you test in each `it` and how you group those into `describe` blocks is mostly a matter of style and preference. You&#8217;ll also evenutally end up using the `before` and `beforeEach` features, but our sample test doesn&#8217;t need them.

Let&#8217;s start with authentication. We want to make sure this API returns proper errors if somebody doesn&#8217;t get past our two authentication checks:

[See the gist](https://gist.github.com/jedwood/5311084)

Don&#8217;t let the syntax on lines 3 and 10 throw you; we&#8217;re just giving the tests names that will make sense to us when we view our reports. You can put pretty much anything in there. In both tests (the `it` calls), we make a `get` call to `/blog`.

In our first test, we use `set` to add our custom header with a correct value, but then we set put some bad credentials in `auth` (which creates the BasicAuth header). We&#8217;re expecting a proper `401` status.

In our second test, we set the correct BasicAuth credentials but intentionally omit the `x-api-key`. We&#8217;re again expecting a `401` status.

## <a href="https://github.com/jedwood/api-testing-with-node#run-nyan-run" name="run-nyan-run"></a>**Run Nyan Run!**

We&#8217;re almost ready to run these tests. Let&#8217;s follow TJ&#8217;s advice:

> Be kind and don&#8217;t make developers hunt around in your docs to figure out how to run the tests, add a `make test` target to your `Makefile.`

So here&#8217;s what that looks like:

    TESTS = test/*.js
    test:
      mocha --timeout 5000 --reporter nyan $(TESTS)

    .PHONY: test


The two flags in there are increasing the default timeout of 2000ms and telling Mocha to use the excellent [nyan reporter](https://vimeo.com/44180900).

Finally, we jump over to our terminal and run `make test`. Here&#8217;s what we get:

<a href="https://github.com/jedwood/api-testing-with-node/blob/master/img/nyan-fail.png" target="_blank"><img src="https://github.com/jedwood/api-testing-with-node/raw/master/img/nyan-fail.png" alt="Nyan cat showing failing test" /></a>

Uh oh. Looks like the API is returning a message that looks like an error, but the status is `200`. Let&#8217;s fix that in the API code by changing this:

`res.send({error: "Bad or missing app identification header"});`

to this:

`res.status(401).send({error: "Bad or missing app identification header"});`

## <a href="https://github.com/jedwood/api-testing-with-node#expect-more" name="expect-more"></a>**Expect More**

Like all good developers, I&#8217;m going to be confident that I&#8217;ve fixed it and move on before re-running the report. Let&#8217;s add another test:

[See the gist](https://gist.github.com/jedwood/5311429)

This one has an &#8220;end&#8221; callback because we&#8217;re going to be inspecting the actual results of the response body. We send correct authentication and then check four aspects of the result:

  * line 7 checks for 200 status
  * line 8 makes sure the format is JSON
  * line 11 is a chain that checks for a `posts` property, and also makes sure it&#8217;s an `array`.

It&#8217;s Chai that&#8217;s giving us that handy way of checking things.

Run the tests again&#8230;wait 46ms&#8230;and&#8230;

<a href="https://github.com/jedwood/api-testing-with-node/blob/master/img/nyan-win.png" target="_blank"><img src="https://github.com/jedwood/api-testing-with-node/raw/master/img/nyan-win.png" alt="Nyan cat showing all tests passing" /></a>

Happy Nyan!

## <a href="https://github.com/jedwood/api-testing-with-node#hackers-dont-mock" name="hackers-dont-mock"></a>**Hackers Don&#8217;t Mock**

Another common component of testing is the notion of using “mock” objects and/or a sandboxed testing database. What I like about the setup we’ve covered here is that it doesn’t care. We can run our target server in production or dev or testing mode depending on our purpose and risk aversion without changing our tests. Finer-grained unit testing and mock objects certainly have their place, but a lot can go wrong in between those small abstracted pieces and your full production environment. High-level acceptance tests like the ones we’ve built here can broadly cover the end user touchpoints. If an error crops up, you’ll know where to start digging. While it’s not necessary to get into the weeds with unit testing, there’s still significant value in prototyping your entire API&#8230; if you’re using the right tools.

## **Get Dirty in the Sandbox**

Even though the acceptance testing we’re using above can be safely deployed into prod, dev, or test to reveal high-level errors, building a prototype of your API in a sandbox may help avoid any surprises once your API is in the wild. [LoopBack](http://loopback.io) makes building and modeling APIs so easy that there’s no reason to cut corners. When your REST API is ready for prime time, use [IBM API Connect](https://console.ng.bluemix.net/docs/services/apiconnect/index.html?pos=2) to easily convert your mockup into an enterprise-ready REST API.
