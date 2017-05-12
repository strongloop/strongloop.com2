---
id: 27327
title: Working with Pagination and LoopBack
date: 2016-05-06T07:30:37+00:00
author: Raymond Camden
guid: https://strongloop.com/?p=27327
permalink: /strongblog/working-with-pagination-and-loopback/
categories:
  - How-To
  - LoopBack
---
I knew LoopBack supported pagination, but not exactly _how_ it did. So, I wanted to build a quick demo for my own learning and I thought it might be useful to share it with others. This will be a relatively simple blog post to demonstrate what I learned.

Pagination is simply the process of presenting a large set of data to the user one &#8220;page&#8221;, or one set, at a time. For example, if you have a few hundred records, it is a lot less intimidating to the user to show them just ten or so records first. For this demo, I created a simple model, Person. Person has two properties: name and picture. To create a large amount of data (so we can actually paginate), I used the excellent [Random User Generator](https://randomuser.me/) API to spit out about two thousand users. I did this one time of course, saved the result as a huge JSON file, and then created a quick script to import this into my LoopBack application. The net result was 5000 unique names and pictures in my datastore. Now for the fun part.

<!--more-->

If you simply run the GET method on the Person API, you&#8217;ll get the ginormous JSON packet back. This just confirms that &#8211; by default &#8211; the API does no filtering on size. As an example of how bad that could be, check out the size of the request in Firefox below:

<img class="aligncenter size-full wp-image-27328" src="{{site.url}}/blog-assets/2016/04/shot13.jpg" alt="shot1" width="750" height="464"  />

LoopBack provides two filters to help manage this and provide pagination. The first is limit. By appending filter[limit]=X to our URL, we can limit the result set to a sensible size.

<img class="aligncenter size-full wp-image-27329" src="{{site.url}}/blog-assets/2016/04/shot2.jpg" alt="shot2" width="750" height="464"  />

Woot! Much better. That&#8217;s displaying the first ten records. So how do you get the _next_ ten? One more filter &#8211; skip. By adding filter[skip]=X to the query, I can tell LoopBack to start returning results after the Xth row. Here&#8217;s an example of that:

<img class="aligncenter size-full wp-image-27330" src="{{site.url}}/blog-assets/2016/04/shot31.jpg" alt="shot3" width="750" height="464"  />

Woot! (Again!) But we&#8217;re not quite done yet. How do we know when to stop paging? If you tell LoopBack to skip past the end of the result set, you simply get back an empty array. In theory your front end could stop displaying &#8220;Next&#8221;-style UI at that result, but if you wanted to provide the user feedback on how many pages exist, you would be out of luck. Luckily, LoopBack comes to the rescue again. Every API will have a Count method out of the box, as demonstrated below.

<img class="aligncenter size-full wp-image-27331" src="{{site.url}}/blog-assets/2016/04/shot41.jpg" alt="shot4" width="750" height="497"  />

So by simply making an HTTP GET request to /api/people/count, you&#8217;ll get the response back in a simple JSON object: {&#8220;count&#8221;:5000}.

## **Making a Demo** 

Alright, so let&#8217;s put this together in an incredibly simple demo application. I began with a simple view:

```js
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<meta name="description" content="">
		<meta name="viewport" content="width=device-width">
	</head>
	<body>


		<div id="results"></div>
		<button id="goBackBtn" disabled>Go Back</button> -
		<button id="goForwardBtn" disabled>Go Forward</button> 

		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
		<script src="app.js"></script>

	</body>
</html>

```

I&#8217;ve got a blank div for my data and two buttons for navigation. Notice they are disabled by default. Now let&#8217;s look at the code.

```js
var $backBtn, $fwdBtn;
var $results;

var currentPos = 0;
var total;

var perPage = 10;

$(document).ready(function() {
	$backBtn = $("#goBackBtn");
	$fwdBtn = $("#goForwardBtn");
	$results = $("#results");
	
	//step one - how much crap do we have?
	$.get('http://localhost:3000/api/people/count', function(res) {
		total = res.count;
		console.log('count is '+total);
	},'json');

	fetchData();
	
	$backBtn.on('click', moveBack);
	$fwdBtn.on('click', moveForward);
			
});

function fetchData() {

	//first, disable both
	$backBtn.attr('disabled','disabled');
	$fwdBtn.attr('disabled','disabled');

	//hide results currently there
	$results.html('');
	
	//now fetch
	$.get('http://localhost:3000/api/people?filter[limit]='+perPage+'&filter[skip]='+currentPos, function(res) {
		renderData(res);
		
		if(currentPos > 0) $backBtn.removeAttr('disabled');
		if(currentPos + perPage < total) $fwdBtn.removeAttr('disabled');
	},'json');
			
}

//could(should) use a nice template lang
function renderData(p) {
	s = '';
	p.forEach(function(person) {
		s += '<div class="person"><img src="' + person.picture + '" width="48" height="48">'+person.name+'</div>';
	});
	$results.html(s);
}

function moveBack() {
	currentPos -= perPage;
	fetchData();	
}

function moveForward() {
	currentPos += perPage;
	fetchData();	
}

```

This file is a bit more complex, but still relatively simple. We do a quick call to figure out the count of our data. Then we simply run a function, fetchData, that handles fetching the current &#8220;page&#8221; of data. Once data is returned, we call another function to render it and then figure out which of our navigation buttons should be enabled. It&#8217;s not the prettiest demo, but here it is in action.



You can find this complete demo and LoopBack application up on my epic GitHub repo: <https://github.com/cfjedimaster/StrongLoopDemos/tree/master/superlongscroll>

## **One last thing** 

So as a quick FYI &#8211; what if you were worried about people trying to fetch all of your data? That could be a performance drain on your server. Luckily LoopBack provides a quick way to handle that. A few days ago, Alex [blogged about remote hooks](https://strongloop.com/strongblog/applying-custom-logic-in-phases-using-remote-hooks-in-loopback/). Remote hooks are a way to apply logic to the REST calls of your API. In our case, we can listen for calls to &#8220;find&#8221; data and look to see if a limit was applied. Here is the entirety of the logic.

```js
module.exports = function(Person) {

	Person.beforeRemote('find', function(ctx, instance, next) {
		if(!ctx.args.filter || !ctx.args.filter.limit) {
			console.log('forcing limit!');
			if(!ctx.args.filter) ctx.args.filter = {};
			ctx.args.filter.limit = 10;
		}
		next();
	});
};

```

That&#8217;s it! The number 10 was chosen arbitrarily &#8211; you can use whatever makes sense for you.

## **One more last thing** 

Ok, I lied, we aren&#8217;t quite done yet. I just discovered an interesting feature of LoopBack called [Scopes](https://docs.strongloop.com/display/public/LB/Model+definition+JSON+file#ModeldefinitionJSONfile-Scopes). Scopes allow you to define aliases for queries. So for example, I could actually make a scope for &#8216;page2&#8217; that implied a limit of 10 and a skip of 10 as well. You can also supply a \*default\* scope and correct the issue we mentioned above, setting a default limit. It would look like this in the model JSON file:

```js
"scope":{
    "limit":10
},

```

That&#8217;s simpler, so why would we ever use the other option? Well because this is more than just a default, it is a strict setting, so even if the user wanted more than 10, they can&#8217;t request it by appending filter[limit]=X. You may be fine with that, but just keep it in mind.