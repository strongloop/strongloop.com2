---
id: 27959
title: Using LoopBack to Build APIs For APIs
date: 2016-10-05T08:00:45+00:00
author: Raymond Camden
guid: https://strongloop.com/?p=27959
permalink: /strongblog/using-loopback-to-build-apis-for-apis/
categories:
  - API Tip
  - How-To
  - LoopBack
---
&#8220;Building APIs for APIs&#8221; sounds a bit like infinite recursion, but actually I&#8217;m talking about one of the cooler aspects of LoopBack: the ability to define a server API that maps to another server. Essentially your API acts as a proxy for another API. There are a lot of reasons you may want to do this, including:

  * Supplementing the set of APIs you already provide. Perhaps you&#8217;re a sports company that can provide APIs for every sport but golf. If you can find a third-party provider for golf data, you can then add it to your own library and offer a more complete solution to your users.
  * Modifying API results to fit your needs.  Maybe you want to use an API that is a bit inflexible in the data it returns. By creating your own proxy, you can modify the result sets to return only what you need.
  * To improve performance you can add your own caching layer.
  * Perhaps you want to use an API in your mobile app but don&#8217;t want to embed sensitive information, like an API key, in your source code. You can use your own server, and this LoopBack feature, to keep the key hidden in your Node.js code.

<!--more-->

The feature we&#8217;re discussing is provided by the LoopBack &#8220;REST Connector.&#8221; When you first begin learning LoopBack, you use a connector that stores data in memory. This is great for testing and quick prototyping. You then switch to a persisted connector, like the MongoDB one perhaps, but in general, you&#8217;re still doing the same thing. Your models have basic CRUD with the connector in the back to handle persistence.

The REST connector is different. Instead of handling persistence, it handles the connection to the remote API. Let&#8217;s take a look at a basic example of the connector in action.

Begin with an existing LoopBack application (or create a new one!), and then install the REST connector:

`npm install --save loopback-connector-rest`

As a reminder, a standard LoopBack app includes _only_ the in-memory connector, which makes sense if you think about it. There&#8217;s no need to include code for Oracle if you are using MySQL.

Next, create a new datasource:

`slc loopback:datasource`

For the name, let&#8217;s call it `swapi`. Our demo is going to make use of the excellent Star Wars API which provides information about everything related to the best thing ever (after cats.)

When prompted to select the connector, scroll down to the REST connector:

<img class="aligncenter size-full wp-image-27962" src="https://strongloop.com/wp-content/uploads/2016/09/sbblog-1.jpg" alt="sbblog" width="600" height="276" srcset="https://strongloop.com/wp-content/uploads/2016/09/sbblog-1.jpg 600w, https://strongloop.com/wp-content/uploads/2016/09/sbblog-1-300x138.jpg 300w, https://strongloop.com/wp-content/uploads/2016/09/sbblog-1-450x207.jpg 450w" sizes="(max-width: 600px) 100vw, 600px" />

Next it will prompt you for the base URL for the API. Here is where things can get tricky. The Star Wars API supports a number of different end points for movies, ships, characters, and more. You&#8217;ll want to specify one particular end point. Why?

Unlike the persistence-based datasources, the REST connector is meant to work with one model, not many. In other words, I may set up one MongoDB database for my application and one datasource for it in my LoopBack application. I&#8217;ll then add many different models all using that one Mongo-based connector.

For the REST connector, we need to point to one API and match it up with one particular model. For this demo then we&#8217;ll focus on spaceship data because spaceships are awesome.

According to the Star Wars API documentation, we can get a list of spaceships using this URL: `http://swapi.co/api/spaceships`. So let&#8217;s use that for the connector URL value. For the rest of the prompts, just accept the defaults.

<img class="aligncenter size-full wp-image-27964" src="https://strongloop.com/wp-content/uploads/2016/09/swblog2.jpg" alt="swblog2" width="600" height="157" srcset="https://strongloop.com/wp-content/uploads/2016/09/swblog2.jpg 600w, https://strongloop.com/wp-content/uploads/2016/09/swblog2-300x79.jpg 300w, https://strongloop.com/wp-content/uploads/2016/09/swblog2-450x118.jpg 450w" sizes="(max-width: 600px) 100vw, 600px" />

At this point, your `datasources.json` file should look something like this:

```js
{
  "db": {
    "name": "db",
    "connector": "memory"
  },
  "swapi": {
    "name": "swapi",
    "baseURL": "http://swapi.co/api/starships",
    "crud": false,
    "connector": "rest"
  }
}

```

To work with the remote API, we have to define a set of operations that will be exposed to our local model. You can define as many operations as you need, but most likely you will only need one. An operation consists of a template and a set of functions. The template is like a &#8216;meta&#8217; description for the remote URL. It allows for tokens so that it can be dynamically updated based on how you call the API. The functions aspect is where you define your own names for accessing the remote API. This all sounds a bit overwhelming, but let&#8217;s look at a complete example.

```js
{
  "db": {
    "name": "db",
    "connector": "memory"
  },
  "swapi": {
    "name": "swapi",
    "baseURL": "http://swapi.co/api/starships",
    "crud": false,
    "connector": "rest",
    "operations": [
      {
        "functions": {
          "getships": []
        },
        "template": {
          "method": "GET",
          "url": "http://swapi.co/api/starships/",
          "headers": {
            "accepts": "application/json",
            "content-type": "application/json"
          },
          "responsePath": "$.results.*"
        }
      }
    ]
  }
}

```

The template aspect defines a lot of different parts of how we&#8217;ll call the API. It supports a method and headers, which should look familiar to folks. It obviously needs a URL, and finally, we can define a responsePath to &#8216;parse&#8217; the result. `responsePath` is using [JSONPath](https://github.com/s3u/JSONPath) as a way to fetch a portion of a JSON response. In functions, we&#8217;ve defined a name for how we want to &#8220;address&#8221; the URL in the template. The empty array is where we define arguments to pass to the API. For now we&#8217;re not going to pass any arguments at all, so it is empty. There&#8217;s a lot we&#8217;re leaving out here, but for now, let&#8217;s move on.

To expose our remote API as a local API, we need to add a model. Since we&#8217;re working with the starship aspect of the Star Wars API, let&#8217;s create a new model called spaceship. When asked what connector to use, select `swapi`.

<img class="aligncenter size-full wp-image-27965" src="https://strongloop.com/wp-content/uploads/2016/09/swblog3.jpg" alt="swblog3" width="426" height="136" srcset="https://strongloop.com/wp-content/uploads/2016/09/swblog3.jpg 426w, https://strongloop.com/wp-content/uploads/2016/09/swblog3-300x96.jpg 300w" sizes="(max-width: 426px) 100vw, 426px" />

Then be sure to use Model as the base class, _not_ PersistedModel.

<img class="aligncenter size-full wp-image-27966" src="https://strongloop.com/wp-content/uploads/2016/09/swblog4.jpg" alt="swblog4" width="517" height="246" srcset="https://strongloop.com/wp-content/uploads/2016/09/swblog4.jpg 517w, https://strongloop.com/wp-content/uploads/2016/09/swblog4-300x143.jpg 300w, https://strongloop.com/wp-content/uploads/2016/09/swblog4-450x214.jpg 450w" sizes="(max-width: 517px) 100vw, 517px" />

Take the rest of the defaults and don&#8217;t create any properties.

Now fire up your LoopBack server (or restart it if was already running) and then open your API Explorer, you&#8217;ll see the new model:

<img class="aligncenter size-full wp-image-27968" src="https://strongloop.com/wp-content/uploads/2016/09/swblog5.jpg" alt="swblog5" width="600" height="199" srcset="https://strongloop.com/wp-content/uploads/2016/09/swblog5.jpg 600w, https://strongloop.com/wp-content/uploads/2016/09/swblog5-300x100.jpg 300w, https://strongloop.com/wp-content/uploads/2016/09/swblog5-450x149.jpg 450w" sizes="(max-width: 600px) 100vw, 600px" />

Woot! We&#8217;ve added an API that proxies to another API and our users are none the wiser. If you test it, you&#8217;ll see the results:

<img class="aligncenter size-full wp-image-27970" src="https://strongloop.com/wp-content/uploads/2016/09/swblog6.jpg" alt="swblog6" width="600" height="583" srcset="https://strongloop.com/wp-content/uploads/2016/09/swblog6.jpg 600w, https://strongloop.com/wp-content/uploads/2016/09/swblog6-300x292.jpg 300w, https://strongloop.com/wp-content/uploads/2016/09/swblog6-36x36.jpg 36w, https://strongloop.com/wp-content/uploads/2016/09/swblog6-450x437.jpg 450w" sizes="(max-width: 600px) 100vw, 600px" />

Notice there is an array of ships. That isn&#8217;t exactly what the remote API returns. You can see for yourself by going here: `http://swapi.co/api/starships/`

But remember our `resultPath` argument? That was used to &#8220;trim down&#8221; and focus on the result we wanted.

Sweet! But let&#8217;s kick it up a notch. The Star Wars API returns data that we don&#8217;t want to expose to our end users. If we open up `starship.js`, we can modify the result by using the `afterRemote` method. Here&#8217;s an example of it in action:

```js
'use strict';

module.exports = function(Spaceship) {

	Spaceship.afterRemote('getships', function(ctx, ship, next) {
		var ships = ctx.result;
		ships.map(function(ship) {
			delete ship.films;
			delete ship.created;
			delete ship.edited;
			return ship;	
		});
		ctx.result = ships;
		next();
	});
};

```

We&#8217;ve removed three keys from the ship data: film, created, and edited. This was obviously somewhat arbitrary, but you get the idea. If you restart the server and rerun your API test, you&#8217;ll see now that the results are slimmer. Along with removing keys, we could even rename them and add our own. Again, we&#8217;ve got complete control over the result.

Now let&#8217;s go a step further: Since a new Star Wars film is pretty rare (or it was, now it&#8217;s going to be once a year!), we can add our own caching layer. Here&#8217;s an example with simple RAM-based caching:

```js
'use strict';

module.exports = function(Spaceship) {

	var cache = {};

	Spaceship.beforeRemote('getships', function(ctx, ship, next) {
		if(cache.ships) {
			ctx.res.send(cache.ships);
		} else {
			next();
		}
	});

	Spaceship.afterRemote('getships', function(ctx, ship, next) {
		var ships = ctx.result;
		ships.map(function(ship) {
			delete ship.films;
			delete ship.created;
			delete ship.edited;
			return ship;	
		});
		ctx.result = ships;
		cache.ships = ships;
		next();
	});
};

```

All I did was add an object, `cache`, and store in it the result from the remote API. Then the new `beforeRemote` function checks if the cache exists, and if it does, return it instead of calling out to the API. I could also store the time I created the cache if I wanted to programmatically expire it.

All in all a pretty powerful feature. There&#8217;s a lot more to it and I encourage you to check out the full documentation for examples: [REST Connector](https://docs.strongloop.com/display/public/LB/REST+connector)