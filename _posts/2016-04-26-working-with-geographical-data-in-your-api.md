---
id: 27254
title: Working with Geographical Data in your API
date: 2016-04-26T08:00:04+00:00
author: Raymond Camden
guid: https://strongloop.com/?p=27254
permalink: /strongblog/working-with-geographical-data-in-your-api/
categories:
  - API Tip
  - LoopBack
---
When building models with LoopBack, one of the more interesting features is the ability to define properties that represent locations. The &#8220;GeoPoint&#8221; type lets you add a location to your model that can be used in a variety of ways. Let&#8217;s look at some simple examples demonstrating how you can add this to your own APIs.

<!--more-->

First, let&#8217;s start with a simple model &#8211; the Cat.

```js
{
  "name": "Cat",
  "base": "PersistedModel",
  "idInjection": true,
  "options": {
    "validateUpsert": true
  },
  "properties": {
    "name": {
      "type": "string",
      "required": true
    },
    "location": {
      "type": "geopoint",
      "required": true
    }
  },
  "validations": [],
  "relations": {},
  "acls": [],
  "methods": {}
}

```

Our cat model is incredibly simple &#8211; one property represents the name and one the location. As you can see, the type is set to geopoint. How do we use it? If you open up the LoopBack Explorer and navigate to the /Cats POST operation, you&#8217;ll see the model definition:

<img class="aligncenter size-full wp-image-27257" src="{{site.url}}/blog-assets/2016/04/shot12.jpg" alt="shot1" width="800" height="525"  />

The expectation is an object containing lat and lng values, representing latitude and longitude. Once you have data, using it becomes pretty trivial. For our first demo, we&#8217;ll make use of the [Google Static Map API](https://developers.google.com/maps/documentation/static-maps/). This is the lesser well-known version of the Google Maps API that is useful when you just need to display a simple map without all the fancy JavaScript doodads. The Static Map API isn&#8217;t even really an API &#8211; it&#8217;s really just a particular way of forming a URL that will generate different types of maps.

So given that we have a few cats (trust me, I do), let&#8217;s build a demo to map them on the planet. First, the HTML:

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<meta name="description" content="">
		<meta name="viewport" content="width=device-width">
	</head>
	<body>
		<h1>Map Demo</h1>
		<img id="map"></img>
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
		<script src="js/map.js"></script>
	</body>
</html>

```

Nothing much here except for a H1 and an empty div. Let&#8217;s look at the JavaScript.

```js
$(document).ready(function() {
	$.get("/api/Cats", function(res) {
		console.log(res);
		//generate the map with the results
		var mapurl = 'https://maps.googleapis.com/maps/api/staticmap?';
		mapurl += '&size=700x700&markers=color:red'
		res.forEach(function(cat) {
			console.dir(cat.location);
			mapurl += '%7C'+cat.location.lat+','+cat.location.lng;
		});
		
		$('#map').attr('src',mapurl);
		console.log(mapurl);
	});
});

```

So literally all we do is ask for all the cats and then iterate over each to get each cat&#8217;s particular location and append it to a URL. As an aside, if our cat database grew too large, we may need to find a better way of dealing with it. (You could write a custom remote method to just return position data instead of the full object. See Alex&#8217;s excellent article on the topic here: [Remote Methods in Loopback: Creating Custom Endpoints](https://strongloop.com/strongblog/remote-methods-in-loopback-creating-custom-endpoints/).)

The result, with no real formatting or design work, is still pretty cool considering how little work we needed to do:

<img class="aligncenter size-full wp-image-27267" src="{{site.url}}/blog-assets/2016/04/shot3.jpg" alt="shot3" width="700" height="771"  />

Woot! Of course, you probably want to do a bit more with your geographical data than just map it. LoopBack provides out of the box for two types of operations you can do:

* Sorting results based on how far they are from an origin.
  
\* Filtering results to those within a certain radius. You can also flip that too to find items that are \*not* near you.

Let&#8217;s look at an example of how this works using both the REST API. (You can do the same filtering on the server-side as well.) In the JavaScript code above, you saw an example of returning all Cats. To sort them by how close they are to a particular longitude and latitude, you would use this form:

http://localhost:3000/api/Cats/?filter\[where\]\[location\][near]=30.22996,-92.05052

Technically that URL &#8220;feels&#8221; a bit misleading. Reading it you think, &#8220;Oh, I bet it will find close items and use some default filter for what defines &#8216;close'&#8221;, but actually, this simply returns everything sorted by how far an item is from the target. Here is my original data, unsorted.

```js
[
{"name":"paris cat","location":{"lat":48.87146,"lng":2.355},"id":1},
{"name":"san fran cat","location":{"lat":37.77493,"lng":-122.41942},"id":2},
{"name":"home cat","location":{"lat":30.22996,"lng":-92.05052},"id":3},
{"name":"dallas cat","location":{"lat":32.685,"lng":-96.73069},"id":4}
]

```

And here is the sorted version (note, &#8220;home cat&#8221; was created to be near me):

```js
[
{"name":"home cat","location":{"lat":30.22996,"lng":-92.05052},"id":3},
{"name":"dallas cat","location":{"lat":32.685,"lng":-96.73069},"id":4},
{"name":"san fran cat","location":{"lat":37.77493,"lng":-122.41942},"id":2},
{"name":"paris cat","location":{"lat":48.87146,"lng":2.355},"id":1}
]

```

Cool. So how do you filter?

http://localhost:3000/api/Cats?filter\[where\]\[location\]\[near]=30.22996,-92.05052&filter[where\]\[location\][maxDistance]=395

The second clause here is specifying a max distance of 395 miles. The result is as you would expect:

```js
[
{"name":"home cat","location":{"lat":30.22996,"lng":-92.05052},"id":3},
{"name":"dallas cat","location":{"lat":32.685,"lng":-96.73069},"id":4}
]

```

In case you&#8217;re curious, you can change the unit of measurement. The [Geopoint](http://apidocs.strongloop.com/loopback-datasource-juggler/#geopoint) docs list these as valid types:

* miles (default)
  
* radians
  
* kilometers
  
* meters
  
* miles
  
* feet
  
* degrees

Let&#8217;s build a new version of our client-side code that uses fancy HTML5 Geolocation (we can&#8217;t really call that fancy anymore) to figure out the user&#8217;s location and return Cats near them. As before, we&#8217;ll start with the HTML.

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<meta name="description" content="">
		<meta name="viewport" content="width=device-width">
	</head>
	<body>
		<h1>Cats near you?</h1>
		<div id="status">
			Attempting to find your location...
		</div>
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
		<script src="js/near.js"></script>
	</body>
</html>

```

And now the JavaScript:

```js
$(document).ready(function() {
	
	$status = $('#status');
	
	console.log('Begin trying to get position');
	navigator.geolocation.getCurrentPosition(function(pos) {

		$.get('/api/Cats/?filter[where][location][near]='+pos.coords.latitude+','+pos.coords.longitude+'&filter[where][location][maxDistance]=20', function(res) {
			
			if(res.length === 0) {
				$status.html('Sorry, but no cats are by you. I has a sad. Here, have this cat.<br/><img src=\'/img/sadcat.png\'>');
				return;
			}
			var result = 'I found these cats:<ul>';
			res.forEach(function(cat) {
				result += '<li>'+cat.name+'</li>';
			});
			result += '</ul>';
			$status.html(result);

		});

	}, function(err) {
		$status.html('I\'m sorry, but I was unable to get your location. Blame Apple.');
	});
});

```

The app begins by using the [geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation) to figure out where the user is. Once the location is determined, we can then use the API to fetch cats within 20 miles of the user. We then just take those results and write them out.

The incredibly beautiful output of this demo can be seen here:

<img class="aligncenter size-full wp-image-27269" src="{{site.url}}/blog-assets/2016/04/shot4.jpg" alt="shot4" width="464" height="286"  />

I hope you&#8217;ve found this interesting, and you can find the full source code here: <https://github.com/cfjedimaster/StrongLoopDemos/tree/master/geotest>