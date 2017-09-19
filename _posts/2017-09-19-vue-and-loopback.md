---
layout: post 
title: Building a Vue.js Application with LoopBack - an Example
date: 2017-09-19T01:40:15+00:00
author: Raymond Camden
permalink: /strongblog/vuejs-and-loopback
categories:
  - LoopBack
  - How-To
---

I recently had a conversation with a follower on [Twitter](https://twitter.com/raymondcamden) about how [Vue.js](https://vuejs.org/) and [LoopBack](http://loopback.io/) could work together. Because of how LoopBack works, this is almost a non-issue. By creating a simple REST-based API, there's nothing "special" about using Vue.js with LoopBack, just as there wouldn't be anything special if you used [React](https://facebook.github.io/react/) or [Angular](https://angularjs.org/). That being said, I still thought it would be nice to give a quick demonstration on how a Vue.js application could be built with LoopBack as the back end.

I'm going to assume some basic understanding of Vue.js, but if you've never seen it, then I definitely recommend reading its [guide](https://vuejs.org/v2/guide/) for an introduction. One of the things Vue.js does well is work with sites where you don't have a full "application" in play. What do I mean by that? Frameworks like Angular are built around the idea of creating an application - where the entire site, or functionality, is handled by framework. While Vue.js can certainly do that as well, it doesn't require this. So imagine an existing HTML page that you need to add interactivity to. In the past, you may have added in jQuery and began coding away. While this works, you may get to a point where managing DOM state and generating dynamic content becomes messy. You still don't need a "full" application built with Angular, but you'd like something that helps you out a bit more than just jQuery by itself. 
<!--more-->
Vue.js, in this author's not so humble opinion, really serves well as the "middle spot" between "just a few lines of JavaScript" and "wow this escalated quickly." 

<img src="/blog-assets/2017/09/escalated.png" alt="It happens..." />

### Building the Back End 

So with that out of the way, let's quickly build a LoopBack server using the CLI. At your command prompt, enter `lb app` to scaffold a new application. Any name is fine, but be sure to use `3.x` for the version and `api-server` for the application type. (Conversely, you could also just download the repository from https://github.com/StrongLoop-Evangelists/lbandvue and use that to start off with.)

Next, you'll want to build a model called `cat`. Remember that this can be done via the cli with `lb model`. The model should have 4 properties:

* name, a string, that is required
* age, a number, that is required
* breed, a string, that is required
* gender, a string, that is required

You can use the in-memory datasource for this sample, but you may want to add the `file` option to the datasource so your changes are persisted while you test. If you use the version of the app from GitHub, this is already done.

Once done, now it's time for another change. The client-side version of this demo could be hosted anywhere, but to keep things simple, we're going to store the client-side code on the same server as the API. A LoopBack application comes with an empty client folder so we're halfway there. To use it for static assets, you can follow a tip I wrote about on my blog last year ([Quick LoopBack Tip - Using the Client Folder for your Static Directory](https://www.raymondcamden.com/2016/11/08/quick-loopback-tip-using-the-client-folder-for-your-static-directory/)). Basically, find your `server/middleware.json` file, look for the `files` block, and edit it to look like so:

```json
"files": {
    "loopback#static": {
      "params": "$!../client"
    }
}
```

The last change is to remove the default home page (or `/` route) so that the client-side application can be loaded without having to specify a file name. In `server/root.js`, find the line that sets up that route and comment it out. It should look like so when done:

```js
//router.get('/', server.loopback.status());
```

The net result is two-fold. After starting the server, you can hit your APIs for the Cat model at http://localhost:3000/api/cat and view the client-side demo at http://localhost:3000.

### Building the Front End

Before we get into the code, let's actually take a look at how the application works. The idea is to have an (incredibly) simple "CRUD" (Create/Read/Update/Delete) page for the content with LoopBack providing the APIs and handling persistence. On top of the page is a simple table of data followed by a form at the bottom:

<img src="/blog-assets/2017/09/lbvue1.png" alt="Screen shot" />

The form at the bottom is used both for creating new cats as well at editing. Clicking the cats name will load their defaults into the form while clicking delete will send the cat into an unknown oblivion on the edge of space. (Or it will just delete it. You decide.)

Let's begin by looking at the HTML. As you can imagine, there isn't much there.

```html
{% raw %}
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width">
    <link rel="stylesheet" href="css/app.css">
    <style>
    [v-cloak] {
      display: none;
    }
    </style>
  </head>
  <body>

  <div id="catApp" v-cloak>

  <h1>Cats</h1>
  <table>
    <thead>
      <tr>
      <th>Name</th>
      <th>Age</th>
      <th>Gender</th>
      <th>Breed</th>
      <td>&nbsp;</td>
      </tr>
    </thead>
   <tbody>
      <tr v-for=“cat in cats”>
      <td @click=“editCat(cat)” class=“catItem” title=“Click to Edit”>{{cat.name}}</td>
      <td>`{{cat.age}}`</td>
      <td>`{{cat.gender}}`</td>
      <td>`{{cat.breed}}`</td>
      <td @click=“deleteCat(cat)” class=“deleteCat” title=“Click to Delete”>Delete</td>
      </tr>
    </tbody>
  </table>

  <form @submit.prevent="storeCat">
    <p>
    <label for="name">Name</label>
    <input type="text" id="name" v-model="cat.name">
    </p>
    <p>
    <label for="age">Age</label>
    <input type="number" id="age" v-model="cat.age">
    </p>
    <p>
    <label for="breed">Breed</label>
    <input type="text" id="breed" v-model="cat.breed">
    </p>
    <p>
    <label for="gender">Gender</label>
    <input type="text" id="gender" v-model="cat.gender">
    </p>
    <input type="reset" value="Clear" @click="reset">
    <input type="submit" value="Save Cat 🐱">
  </form>

  </div>

  <script src="https://unpkg.com/vue"></script>
  <script src="js/app.js"></script>
</body>
</html>
{% endraw %}
```
For those new to Vue.js - the important parts can be found in the table on top. Note the use of `v-for` as a simple looping mechanism. Inside each row the use of brackets
 ({ %raw% }{{cat.name}}{% endraw %}) is used to represent variables that will be replaced with real data. The `@click` directives are basically simple event handlers.

The form at the bottom is a bit different. By using `v-model` I'm basically creating a connection between the form data and data in the JavaScript code you'll see in a moment. Finally, the use of `@submit.prevent` does two things - first it simply assigns a submit handler for the form and secondly it automatically prevents the default behavior of a form submit. (Which is what I want since I'm going to handle the form data myself.)

Now let's take a look at the code.

```js
const API = 'http://localhost:3000/api/cats/';

let catApp = new Vue({
	el:'#catApp',
	data:{
		cats:[],
		cat:{
			id:'',
			name:'',
			age:'',
			gender:'',
			breed:''
		}
	},
	created:function() {
		this.getCats();
	},
	methods:{
		getCats:function() {
			fetch(API)
			.then(res => res.json())
			.then(res => this.cats = res);	
		},
		storeCat:function() {
			let method;
			console.log('storeCat', this.cat);
			// Handle new vs old
			if(this.cat.id === '') {
				delete this.cat.id;
				method = 'POST';
			} else {
				method = 'PUT';
			}
			fetch(API, {
				headers:{
					'Content-Type':'application/json'
				},
				method:method,
				body:JSON.stringify(this.cat)
			})
			.then(res => res.json())
			.then(res => {
				this.getCats();
				this.reset();
			});
		},
		deleteCat:function(c) {
			fetch(API + c.id, {
				headers:{
					'Content-Type':'application/json'
				},
				method:'DELETE'
			})
			.then(res => res.json())
			.then(res => {
				this.getCats();
			});

			// call reset cuz the cat could be 'active'
			this.reset();
		},
		editCat:function(c) {
			/*
			This line was bad as it made a reference, and as you typed, it updated
			the list. A user may think they don't need to click save.
			this.cat = c;
			*/
			this.cat.id = c.id;
			this.cat.name = c.name;
			this.cat.age = c.age;
			this.cat.breed = c.breed;
			this.cat.gender = c.gender;
		},
		reset:function() {
			this.cat.id = '';
			this.cat.name = '';
			this.cat.age = '';
			this.cat.breed = '';
			this.cat.gender = '';
		}
	}
});
```

There's a few things going on here so let's break it down bit by bit. The very first line is simply the REST endpoint setup by LoopBack. If I moved the code to production, I'd change the URL to match the new location.

The next important bit is the `data` block. The `cats` array keeps track of existing data and `cat` is used to represent a new cat object.

The `created` code is run by Vue.js automatically on startup and in this case simply fires off the call to load cats.

The next block, `methods`, represents all the various things the application has to handle. So for example, `getCats` handles loading the cats by hitting the LoopBack end point with a simple Get request. That's about as simple as it can get - hit the API, convert to JSON, and set the result to the local array.

`storeCat` is used to create, or update, a cat instance. If it sees that the `id` value is blank, it deletes it and sets the HTTP method to POST which will be used for a new cat. LoopBack doesn't like a blank ID value as it thinks you're trying to set the ID manually. Outside of that, it's just another FETCH call, but do note the use of `JSON.stringify` for the data. 

`deleteCat` performs deletes, and again, it's a simple matter of using the right method. Do note though that instead of hitting the API URL as is, the ID of the cat is appended.

`editCat` handles setting up the form based on the selected cat. As you can see in the comments, using `this.cat=c` "worked", but it was a copy by reference, not by value. What that meant is if you clicked to edit a cat named Ray and typed "mond" at the end, you would see your changes reflected immediately. This may make you think that you didn't need to save your data, but you weren't updating the server copy, just the local copy in Vue. So this is more manual, but a bit safer.

Finally, the `reset` method simply nukes any data in the form. This is used after saving a new, or existing cat.

### So What?

As I said in the beginning, using LoopBack with Vue.js is really a non-story. That's what you want in an API - something that is easy to setup and doesn't get in the way. While obviously a simple proof of concept, the entire code base took about an hour to do with 5 minutes of that being LoopBack. (Which is not to say the Vue.js portion was that much harder, I'm still new to Vue.js!) 

### What's next?

Interested in trying LoopBack for your own RESTful API needs? Check out [this](https://developer.ibm.com/apiconnect/2017/03/09/loopback-in-5-minutes/) blog post to get started in just 5 minutes!
