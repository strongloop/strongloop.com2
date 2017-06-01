---
id: 29183
layout: post
title: Integrating LoopBack with ElasticSearch
date: 2017-06-01
author: Raymond Camden
permalink: /strongblog/integrating-loopback-with-elasticsearch/
categories:
  - How-To
  - LoopBack
  - Community
  - Developers
  - ElasticSearch
  - IBM
---
I have a confession to make. I'm probably the last person to hear about, and look into, [ElasticSearch](https://www.elastic.co). Back when I was primarily a ColdFusion developer, I was a big fan of the full-text search engine Verity and how well it worked with my apps. When Verify was phased out and replaced with Lucene, I played with it too and enjoyed it. But since switching to Node, I really haven't thought about the space much.	
			
My coworker, [Erin McKean](https://twitter.com/emckean), introduced me to ElasticSearch (which is also based on Lucene), and I was fascinated. As a whole, Elastic.co has multiple products of which search is only one small bit, but in terms of supporting full text search, ElasticSearch really, <i>really</i> kicks butt! I spent some time going over its [Getting Started](https://www.elastic.co/guide/en/elasticsearch/reference/current/getting-started.html) guide last week, and while ElasticSearch can be a bit overwhelming at times, it is definitely easy to use once you get into it. A quick tip: all of your interactions with ElasticSearch are done via REST APIs. While the docs use curl a lot, I recommend using a tool like [Postman](https://www.getpostman.com) to make working with the calls a bit easier.		
<!--more-->			
For folks who have no idea what I'm talking about when I say "full-text search engine", think of a server that is built for search. Yes, you can search with SQL (and NoSQL), but a full text search engine is typically better suited for doing deeper text analysis on content and helping return better searches. For example, it can recognize that if I search for 'cat', and 'cat' is mentioned many times in one particular document, as well as mentioned towards the <i>beginning</i> of a document, it is probably more important than a document where 'cat' appears only once.		
			
A search-optimized tool like ElasticSearch also recognizes that 'awesome' is the plural of† 'cat', and that it should be matched as well. (Note: 'awesome' may not be the plural of 'cat', but it should be.)			
			
Let's say you've got a site (for example, a LoopBack-powered site) and you want to make use of ElasticSearch. One way is to actually point LoopBack directly to the ElasticSearch instance. My coworker Erin has an example of that here: 

[https://github.com/emckean/jeopardy-api](https://github.com/emckean/jeopardy-api)		
			
Another way of doing it, and the way that more closely matches how I used full-text search engines in the past, is to set up your back end code to copy your data to the search engine. Basically, any time you add, edit, or delete data, you update the copy in the search engine. That sounds like a lot of work, and possibly a lot of duplication, but depending on the size of your data it could actually be trivial. Also, the data stored in the search engine need not be a complete copy. You may only need search support for particular properties of your data. For truly large sets of data, or sites where the data is updated quite often, keeping the index (think the collection of your text) could be done in a background process run on a schedule.			
			
Luckily, LoopBack makes it pretty easy. [Operation hooks](http://loopback.io/doc/en/lb3/Operation-hooks.html) let you listen for data changes to LoopBack data at the ORM level, or basically, whenever data is created, read, updated, or deleted. LoopBack also supports [remote hooks](http://loopback.io/doc/en/lb3/Remote-hooks.html), but they wouldn't handle our data being updated by non-API sources, such as data updated through a simple web-based Admin interface.			
			
Since we don't have to worry about the read operation, all we care about is create, update, and delete actions. I created a new LoopBack application and started with a Cat model. Because - I'm Ray - and that's what I do. My Cat model has these properties:			
<ul>			
 	<li>name (string)</li>		
 	<li>age (number)</li>		
 	<li>gender (string)</li>		
 	<li>breed (string)</li>		
 	<li>bio (string)</li>		
</ul>			
I knew I was going to need to add operation hooks to cat.js and that I'd need to integrate with ElasticSearch. ElasticSearch provides an <em>incredibly</em> easy-to-use npm package, elasticsearch, which I added to my project and then added to my model file:		

```js
var elasticsearch = require('elasticsearch');		
```			

Next, I configured my credentials for my ElasticSearch instance. You can add [ElasticSearch for Bluemix](https://console.ng.bluemix.net/catalog/services/compose-for-elasticsearch) to your space as a quick way of testing. There is no free tier for this service in Bluemix, though you can also just run ElasticSearch locally too.			

```js
let client = new elasticsearch.Client({			
	host:'https://bluemix-sandbox-dal-9-portal.4.dblayer.com:25130',		
	httpAuth:'admin:EXWSGQIMZGKOSRPL'		
});			
```		

Next, I added logic to listen for new, and updated, cats. Luckily, LoopBack makes this easy by letting me listen for one event: "after save". Here is the method I added to my cat.js file:	

```js
Cat.observe('after save', function(ctx, next) {			
	console.log('after save being run');		
	console.log(ctx.instance);		
			
	/*		
	this may be overkill, but i remove ID from the body		
	*/		
	let myId = ctx.instance.id;		
	delete ctx.instance.id;		
			
	client.create({		
		index:'cat',
		type:'cat',
		body:ctx.instance,	
		id:myId	
	}).then(function(resp) {		
		"console.log('ok from es', resp);
		next();	
	}, function(err) {		
		throw new Error(err);	
	});		
});			
```			

So what's going on here? First, I grab the ID of the data I'm working with. This is part of the API call for working with ElasticSearch so I wanted a copy of the value from the object itself. As I say in the comments, I remove it from the actual instance so I'm not sending it twice. That's probably not required, but I felt icky not doing so.			
			
I use <code>client.create</code> to send my data. Note that this works just fine for both new and existing data. Index, as I said before, is kind of like a high level group for my data. You can think of it like the database. Type refers to the type of data I'm sending. So if I was working with a pet store, my index could be 'pets' and my type could be 'cat'. I've named them both 'cat' here which may be slightly confusing - I apologize in advance for that.		
			
The next operation hook I needed supported delete. As you can guess, this is pretty simple too.			

```js
Cat.observe('before delete', function(ctx, next) {"		
	console.log('before delete being run');		
	console.log(ctx.where);		
	client.delete({		
		index:'cat',
		type:'cat',	
		id:ctx.where.id	
	}).then(function(resp) {		
		next();	
	}, function(err) {		
		throw new Error(err);	
	});		
			
});			
```			

It took me longer to find out where the ID value was then to write the integration into ElasticSearch.			
			
And literally - that's it. Now when I add, edit, or delete cats, I get corresponding records in ElasticSearch as well. As I said above, I'm copying the entire data object over and that may be too much. I certainly could have modified the data to be more appropriate for my search needs. And hey - speaking of search - how do I add that?			
			
I used another feature of LoopBack called [Remote Methods](http://loopback.io/doc/en/lb3/Remote-methods.html"). This allows you to define random, new methods for your API. You begin by defining the API and how it's called:			

```js
Cat.remoteMethod('search', {			
	accepts: {arg: 'text', type: 'string'},		
	returns: {arg: 'results', type: 'array'},		
	http:{		
		verb:'get'	
	}		
});			
```		

In this case, I've named my method search, defined it as callable via GET, and said it returns an array called results. Now I define the actual logic.			

```js
Cat.search = function(text, cb) {"			
	console.log('passed '+text);		
	"client.search({index:'cat', type:'cat', q:text}).then(function(resp) {"		
		console.log(resp.hits);	
		let results = [];	
		resp.hits.hits.forEach(function(h) {	
			results.push(h._source);
		});	
		"cb(null, results);"	
	"}, function(err) {"		
		throw new Error(err);	
	});		
}			
```		

ElasticSearch supports <em>very</em> complex search queries. I mean, you think your search queries are complex, they've got nothing on ElasticSearch. I'm telling ya - greatest - search - API - ever. That being said, I love that the Node API says: "Hey, if you just want to keep it simple, just pass me a string to the Q parameter." And that's exactly what I did here.			
			
For the result, you get more than just the data, but also a lot of metadata back. I decided to simply return the raw data and nothing more. One part in particular you might find interesting is that the API returns a score that tells you how well the term matched the data. You could do filtering on that (both in your initial call and on the client side) or just report the score back to the user. Again, I'm not in my case, but you certainly could.		
			
Also, because I store the complete data record, I can return them as is. If I were only storing part of the cat, I'd use LoopBack's APIs to fetch the 'real' cat record based on the ID and then return it. Or not! I could certainly return just the cat's name and ID, and let the client decide if they want to fetch the rest of the record. Again, you've got options.			
			
Once this remote method is defined, I can then test it directly in the LoopBack explorer:			
			
<img class="aligncenter size-full wp-image-29185" src="{{site.url}}/blog-assets/2017/04/elviscat.png" alt="elviscat" width="650" height="667" />			
			
Simple, right? Again, ElasticSearch has some <em>incredibly</em> powerful aspects and I've barely touched on them, but the integration with LoopBack was rather trivial. You can see the complete source code for this project here: 

[https://github.com/StrongLoop-Evangelists/esandlb](https://github.com/StrongLoop-Evangelists/esandlb)
