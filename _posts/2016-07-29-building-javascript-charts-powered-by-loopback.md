---
id: 27794
title: Building JavaScript Charts Powered by LoopBack
date: 2016-07-29T15:18:12+00:00
author: Raymond Camden
guid: https://strongloop.com/?p=27794
permalink: /strongblog/building-javascript-charts-powered-by-loopback/
categories:
  - How-To
  - JavaScript Language
  - LoopBack
---
When we discuss APIs and LoopBack, often we&#8217;re talking about _external_ consumers, but you can use LoopBack APIs on your own site as well. For example, one cool way to use a LoopBack REST-based API is to power client-side charting for your web site. In this post I&#8217;ll demonstrate a simple LoopBack API and how I built charts with it using Google&#8217;s [Chart](https://developers.google.com/chart/) service.

<!--more-->

First, let&#8217;s look at the data model that will power our API. A little-known but still legally relevant clause in the LoopBack usage agreement is that [all APIs must begin with something related to cats](https://strongloop.com/strongblog/creating-rest-apis-from-data-models-in-api-connect/).  With that in mind, I began with a **Cat** model that has the following properties:

  * name (string)
  * color (string)
  * gender (string)
  * age (number)
  * breed (string)

From that model LoopBack generated a complete REST API for all my Enterprise Cat API needs.

[<img class="aligncenter size-full wp-image-27796" src="https://strongloop.com/wp-content/uploads/2016/07/cat11.jpg" alt="cat1" width="750" height="546" srcset="https://strongloop.com/wp-content/uploads/2016/07/cat11.jpg 750w, https://strongloop.com/wp-content/uploads/2016/07/cat11-300x218.jpg 300w, https://strongloop.com/wp-content/uploads/2016/07/cat11-705x513.jpg 705w, https://strongloop.com/wp-content/uploads/2016/07/cat11-450x328.jpg 450w" sizes="(max-width: 750px) 100vw, 750px" />](https://strongloop.com/wp-content/uploads/2016/07/cat11.jpg)

Next I updated my datasource to persist data to the file system. The default LoopBack datasource is [in-memory](https://docs.strongloop.com/display/LB/Memory+connector), but I tweaked it to persist data to the file system. While not suitable for production, this is a great way to save test data when you restart your application. Just edit the **datasources.json** file and add a &#8220;file&#8221; key to the &#8220;db&#8221; block:

```js
{
  "db": {
    "name": "db",
    "connector": "memory",
    "file":"data.db"
  }
}

```

The JSON above specifies that LoopBack persists data to the **data.db** file. Again, you wouldn&#8217;t do this in production. Instead you would use a database system like MongoDB or MySQL.

Next I wanted to generate a lot of random cats.  To do this, I added a `/makecats` route to the **server.js** file. It randomizes the name, color, age, and other properties of my cat and creates model instances with the data. Here is the method:

```js
app.get('/makecats', function(req, res) {

   var getRandomInt = function(min, max) {
     return Math.floor(Math.random() * (max - min + 1)) + min;
   }

   function randomName() {
     var initialParts = ["Fluffy","Scruffy","King","Queen","Emperor","Lord","Hairy","Smelly","Most Exalted Knight","Crazy","Silly","Dumb","Brave","Sir","Fatty"];
     var lastParts = ["Sam","Smoe","Elvira","Jacob","Lynn","Fufflepants the III","Squarehead","Redshirt","Titan","Kitten Zombie","Dumpster Fire","Butterfly Wings","Unicorn Rider"];
     return initialParts[getRandomInt(0, initialParts.length-1)] + ' ' + lastParts[getRandomInt(0, lastParts.length-1)]
   };

   function randomColor() {
     var colors = ["Red","Blue","Green","Yellow","Rainbow","White","Black","Invisible"];
     return colors[getRandomInt(0, colors.length-1)];
   }

   function randomGender() {
     var genders = ["Male","Female"];
     return genders[getRandomInt(0, genders.length-1)];
   }

   function randomAge() {
     return getRandomInt(1, 15);
   }

   function randomBreed() {
     var breeds = ["American Shorthair","Abyssinian","American Curl","American Wirehair","Bengal","Chartreux","Devon Rex","Maine Coon","Manx","Persian","Siamese"];
     return breeds[getRandomInt(0, breeds.length-1)];
   }

   //make 25 cats
   for(var i=0;i&lt;25;i++) {
     var cat = {
       name:randomName(),
       color:randomColor(),
       gender:randomGender(),
       age:randomAge(),
       breed:randomBreed()
   }

     app.models.Cat.upsert(cat);
   } // for
 
   res.send('Making cats - stand back!');
});

```

I ran this a few times to generate a bit over 100 cats, and then hit my API to ensure it worked correctly:

[<img class="aligncenter size-full wp-image-27797" src="https://strongloop.com/wp-content/uploads/2016/07/cat2.jpg" alt="cat2" width="750" height="317" srcset="https://strongloop.com/wp-content/uploads/2016/07/cat2.jpg 750w, https://strongloop.com/wp-content/uploads/2016/07/cat2-300x127.jpg 300w, https://strongloop.com/wp-content/uploads/2016/07/cat2-705x298.jpg 705w, https://strongloop.com/wp-content/uploads/2016/07/cat2-450x190.jpg 450w" sizes="(max-width: 750px) 100vw, 750px" />](https://strongloop.com/wp-content/uploads/2016/07/cat2.jpg)

Note the **limit** filter I placed in the URL above to keep the result set a bit smaller. LoopBack supports [filtering, limiting, sorting](https://docs.strongloop.com/display/LB/Querying+data), and other useful data manipulations.

Now I&#8217;ve got an API and a large set of delicious furry sample data. Let&#8217;s talk charting. There are quite a few JavaScript-based charting solutions, some easier than others. For this post I&#8217;ll focus on Google&#8217;s [Chart](https://developers.google.com/chart/) API. It has lots of options and is easy to use with an API. But my choice here is somewhat arbitrary. You could use any other popular charting library if you prefer.

For the first test, I&#8217;ll build a pie chart that represents the breakdown of gender for the cat data. This is easy, since LoopBack provides a way to both filter data in the URL and get a count. For example, to get a count of male cats:

```js
http://localhost:3000/api/cats/count?where[gender]=Male

```

Now let&#8217;s build the app. The HTML part is going to be simple:  just a `<div>` to render the chart and `<script>` tags to include  the various JavaScript libraries I&#8217;m using. (Note &#8211; this code, and the other snippets, are not complete applications. You can download the attachment to get complete samples.)

```js
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;meta charset="utf-8"&gt;
  &lt;title&gt;Cats Chart&lt;/title&gt;
  &lt;meta name="description" content=""&gt;
  &lt;meta name="viewport" content="width=device-width"&gt;
  &lt;style&gt;
  div#chart_div {
    width:400px;
    height:400px;
  }
  &lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;div id="chart_div"&gt;&lt;/div&gt;

  &lt;script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"&gt;&lt;/script&gt;
  &lt;script type="text/javascript" src="https://code.jquery.com/jquery-3.1.0.min.js"&gt;&lt;/script&gt;
  &lt;script type="text/javascript" src="js/app.js"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;

```

Now look at the client-side JavaScript code in `app.js` :

```js
var male = 0;
var female = 0;

$(document).ready(function() {
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(loadData);
});

function loadData() {
  //get male vs female
  $.get('http://localhost:3000/api/cats/count?where[gender]=Male').then(function(result) {
    male = result.count;
      $.get('http://localhost:3000/api/cats/count?where[gender]=Female').then(function(result) {
        female = result.count;
        drawChart();
      });
    });
}

function drawChart() {
  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Gender');
  data.addColumn('number', 'Count');
  data.addRows([
    ['Male', male],
    ['Female', female]
  ]);

  // Set chart options
  var options = {
    'title':'Cats by Gender',
    'width':400,
    'height':400
  };

  // Instantiate and draw chart, passing in some options.
  var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}

```

There&#8217;s a bit more going on here, so let&#8217;s take it bit by bit. First, I load the Google Charts library and tell it what function to run when done. The `loadData` function handles fetching the male/female data. Remember these calls are asynchronous, so I have to chain one inside another, and that&#8217;s &#8220;kinda&#8221; bad (Google for &#8220;Callback Hell&#8221;), but for now it&#8217;s acceptable.

The real magic happens in `drawChart` where I set up the chart, tell it what data to use, and then render it. The result is a pretty little pie chart:

<img class="aligncenter size-full wp-image-27799" src="https://strongloop.com/wp-content/uploads/2016/07/cat3.jpg" alt="cat3" width="500" height="513" srcset="https://strongloop.com/wp-content/uploads/2016/07/cat3.jpg 500w, https://strongloop.com/wp-content/uploads/2016/07/cat3-292x300.jpg 292w, https://strongloop.com/wp-content/uploads/2016/07/cat3-36x36.jpg 36w, https://strongloop.com/wp-content/uploads/2016/07/cat3-450x462.jpg 450w" sizes="(max-width: 500px) 100vw, 500px" />

Remember, I&#8217;m using most of the defaults from Google but if I wanted to, I could customize this a lot more. Now let&#8217;s kick it up a notch. How about building a chart for cat breeds?

This brings up an interesting issue: While I&#8217;ve built this API just for myself and a cute little page of charts, how would I enable the public to search for cats by breed? Specifically, how do I share which breeds the site supports? While there are a couple of ways to solve this, I simply added a new remote method, `/breeds`, that returns the list of supported cat breeds.

Recall the code above where I generated a lot of cats using a hard-coded list. I&#8217;m going to do that again, but you could imagine a real system where this is driven by a query.

```js
module.exports = function(Cat) {

  Cat.breeds = function(cb) {
    //This would probably not be hard coded.
    var breeds = ["American Shorthair","Abyssinian","American Curl","American Wirehair","Bengal","Chartreux","Devon Rex","Maine Coon","Manx","Persian","Siamese"];
    cb(null,breeds);
  };

  Cat.remoteMethod('breeds', {
    http: {verb: 'get', path: '/breeds'},
    returns: {root: true, type: 'array'}
  });

};

```

Once added, I can then request it just like any other REST API:

<img class="aligncenter size-full wp-image-27801" src="https://strongloop.com/wp-content/uploads/2016/07/cat4.jpg" alt="cat4" width="750" height="317" srcset="https://strongloop.com/wp-content/uploads/2016/07/cat4.jpg 750w, https://strongloop.com/wp-content/uploads/2016/07/cat4-300x127.jpg 300w, https://strongloop.com/wp-content/uploads/2016/07/cat4-705x298.jpg 705w, https://strongloop.com/wp-content/uploads/2016/07/cat4-450x190.jpg 450w" sizes="(max-width: 750px) 100vw, 750px" />

Now I have a way to fetch breeds and I know how to filter and count, so I can just make one HTTP request for each breed. While I was okay with the &#8220;small&#8221; Callback Hell for gender, this would be way too deep to be manageable, so instead I&#8217;ll handle it using Deferred and Promises with jQuery. Here&#8217;s how I fetch the data and handle knowing when all the calls are done:

```js
$.get('http://localhost:3000/api/cats/breeds').then(function(result) {
  console.log('Breeds',result);
  breeds = result;
  var defs = [];
  breeds.forEach(function(b) {
    defs.push($.get('http://localhost:3000/api/cats/count?where[breed]='+b));
  });

  $.when.apply($, defs).then(function() {
    for(var i=0;i&lt;breeds.length;i++) {
      var count = arguments[i][0].count;
      breedCount[breeds[i]] = count;
    }
    console.log(breedCount);
    drawBreedChart();
  });

});

```

Essentially I created an array of jQuery Deferred objects and use `$.when` to recognize when every one of the async calls has finished. Once they have, I copy the result into the  `breedCount` object that contains all the chart data.   The definition of `drawBreedChart` is:

```js
function drawBreedChart() {

  console.log('drawBreedChart');

  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Breed');
  data.addColumn('number', 'Count');

  //convert our nice ob into an array
  var bData = [];
  breeds.forEach(function(b) {
    bData.push([b, breedCount[b]]);
  });
  data.addRows(bData);

  // Set chart options
  var options = {
    'title':'Cats by Breed',
    'width':500,
    'height':500
    };

  var chart = new google.visualization.PieChart(document.getElementById('breed_div'));
  chart.draw(data, options);

}

```

And the result:

<img class="aligncenter size-full wp-image-27802" src="https://strongloop.com/wp-content/uploads/2016/07/cat5.jpg" alt="cat5" width="500" height="509" srcset="https://strongloop.com/wp-content/uploads/2016/07/cat5.jpg 500w, https://strongloop.com/wp-content/uploads/2016/07/cat5-80x80.jpg 80w, https://strongloop.com/wp-content/uploads/2016/07/cat5-295x300.jpg 295w, https://strongloop.com/wp-content/uploads/2016/07/cat5-36x36.jpg 36w, https://strongloop.com/wp-content/uploads/2016/07/cat5-450x458.jpg 450w" sizes="(max-width: 500px) 100vw, 500px" />

And that&#8217;s it. You can, of course, go much deeper, and of course build different types of charts. You can even use WebSockets and update your charts in real-time. Let me know in the [LoopBack forum](https://groups.google.com/forum/#!forum/loopbackjs) if you&#8217;ve used charting with LoopBack.

[Download the Client-Side Code](https://strongloop.com/wp-content/uploads/2016/07/Archive.zip)