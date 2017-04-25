---
id: 28347
title: Working with LoopBack Authentication and Authorization
date: 2016-12-15T08:00:43+00:00
author: Raymond Camden
guid: https://strongloop.com/?p=28347
permalink: /strongblog/working-with-loopback-authentication-and-authorization/
categories:
  - How-To
  - LoopBack
---
One of [LoopBack&#8217;s](http://loopback.io/) core features is the ability to lock down access to your APIs and define exactly _who_ can do _what_ with your data. LoopBack provides multiple tools to make this easy, but it&#8217;s helpful to see a real (although simple) application demonstrating the complete process of securing your APIs.

In this post I&#8217;ll demonstrate how to:

* Add support for users to your application.
  
* Add user registration and login/logout.
  
* Create rules for your API that follow common patterns, for example, only a logged in user can create content and only the owner of content can modify it.
  
<!--more-->

You can find the full source code for my application here: <https://github.com/cfjedimaster/StrongLoopDemos/tree/master/simpleauthdemo>.

The application is a simple, lightweight Twitter clone. The main page (well, only page) is a &#8220;wall&#8221; of posts from users:

<img class="aligncenter size-full wp-image-28349" src="https://strongloop.com/wp-content/uploads/2016/11/article1.png" alt="article1" width="600" height="515" srcset="https://strongloop.com/wp-content/uploads/2016/11/article1.png 600w, https://strongloop.com/wp-content/uploads/2016/11/article1-300x258.png 300w, https://strongloop.com/wp-content/uploads/2016/11/article1-450x386.png 450w" sizes="(max-width: 600px) 100vw, 600px" />

On top is a simple Login/Register link where user can register for the site:

<img class="aligncenter size-full wp-image-28350" src="https://strongloop.com/wp-content/uploads/2016/11/article2.png" alt="article2" width="600" height="384" srcset="https://strongloop.com/wp-content/uploads/2016/11/article2.png 600w, https://strongloop.com/wp-content/uploads/2016/11/article2-300x192.png 300w, https://strongloop.com/wp-content/uploads/2016/11/article2-450x288.png 450w" sizes="(max-width: 600px) 100vw, 600px" />

Once logged in, users can then write their own posts and delete their older posts. (I was originally going to support edits as well, but felt like that was overkill. The API, however, supports locking down edits to your own content.)

<img class="aligncenter size-full wp-image-28351" src="https://strongloop.com/wp-content/uploads/2016/11/article3.png" alt="article3" width="600" height="326" srcset="https://strongloop.com/wp-content/uploads/2016/11/article3.png 600w, https://strongloop.com/wp-content/uploads/2016/11/article3-300x163.png 300w, https://strongloop.com/wp-content/uploads/2016/11/article3-450x245.png 450w" sizes="(max-width: 600px) 100vw, 600px" />

And that&#8217;s it. If you&#8217;re curious about the design, I decided to give [Bootstrap 4](https://v4-alpha.getbootstrap.com/) a spin. Let&#8217;s now take a look at the application in-depth.

## Building the Server

One of the first things you need to do when working with users and LoopBack is to create your own model that extends the base User model. This is [detailed](http://loopback.io/doc/en/lb2/Managing-users.html) in the docs. You can simply make a new model and then manually edit the JSON file to point the base class to User. For example, here is appuser.json:

```js
{
  "name": "appuser",
  "base": "User",
  "idInjection": true,
  "options": {
    "validateUpsert": true
  },
  "properties": {},
  "validations": [],
  "relations": {},
  "acls": [],
  "methods": {}
}

```

LoopBack&#8217;s User model provides all the API calls you need. It supports creating a new user, handling login and logout, preventing multiple users with the same username, even email confirmation if you want. You can add your own properties of course, but for the demo I kept appuser pretty simple.

Next, you&#8217;ll likely want to hide User from LoopBack&#8217;s Explorer. Open up `server/model-config.json` and modify the User portion to see `public` to false:

```js
"User": {
    "dataSource": "db",
    "public": false
  },

```

So, in approximately two minutes, you&#8217;ve got a full user system for your front-end to use. As someone who worked in the web industry for over twenty years, the thought of never building a user system again is really, really freaking nice.

The next model we&#8217;ll define is &#8220;Post&#8221;. Posts are what I&#8217;m calling the items on the wall. They are pretty simple, consisting of:

  * A **created** property that we will set to the current time.
  * The **text** of the post.
  * An **owner** who created the post.

The first two properties are simple:

```js
"properties": {
    "created": {
      "type": "date",
      "required": false
    },
    "text": {
      "type": "string",
      "required": true
    }
  },

```

You&#8217;ll notice that **created** is not required. Why? We don&#8217;t want the front-end sending a time since it will be based on the user&#8217;s clock and timezone. Even if we converted the time to the server&#8217;s timezone, we don&#8217;t want to trust the time sent by the user since it isn&#8217;t something they should set. You&#8217;ll see in a bit how we set that value on the server.

We set the **owner** via a relation:

```js
"relations": {
    "creator": {
      "type": "belongsTo",
      "model": "appuser",
      "foreignKey": "ownerId"
    }
  },

```

Now here is where things get a bit interesting. LoopBack supports the idea of recognizing the owner of an object. You&#8217;ll see how we define that ACL (Access Control List) in a bit. But how does LoopBack _know_ who the owner is? As a human, we can easily guess as to what property it is, but computers need to have rules. Turns out LoopBack has rules as well, but they aren&#8217;t well documented yet. Those rules are:

  * If a property is a relation and points to a model that extends a User class.
  * If a property is a number type and is called &#8220;userId&#8221;.
  * If a property is a number type and is called &#8220;owner&#8221;.

And obviously, for all three, the values would need to point to the current authenticated user.  You&#8217;ll see how that works later on as well. Our use of rule #1 for the **Post** model will be sufficient for our purposes. There is an edge case you should be concerned about, however.

Imagine a **Cat** model that has a few properties, like **name**, **age**, and **gender**. Now imagine it has a relational property called **boss** that points to a **User** instance. Now imagine it has another relational property called **humanIPukeOn** that also points to a **User** instance. In that case, LoopBack will consider _both_ property values when determining if the **Cat** belongs to the current user. This is a reported bug, but it means if you have multiple properties pointing to a **User** object (or a model extending **User**, which is recommended), than you will not be able to correctly identify content belonging to the user.

Now that we know the properties of our **Post** model, let&#8217;s discuss the ACLs. ACLs (Access Control Lists) are how you define who can do what with your content. Out of the box, LoopBack allows anyone to do anything. That means an anonymous user can create, read, update, and delete content. This is great for testing, but not great for production. So let&#8217;s consider what our rules should be:

  1. The first and most important rule is to say _no one can do anything_. That seems a bit crazy, but it makes sense from a security perspective. Instead of telling LoopBack what users aren&#8217;t allowed to do, instead we simply block every single action possible. We then gradually open up access to particular features one by one. This ensures we don&#8217;t miss anything and provides a &#8220;secure by default&#8221; format for our API.
  2. Next, we say that _only logged in users are allowed to create new Post objects_.
  3. Then we say that _only the owner of Posts objects are allowed to edit and delete them_.
  4. Finally, we _allow anyone to read Post objects_. This is what an anonymous user will see when they hit the application.

You can use the command line to add these ACLs by using `slc loopback:acl`. The command line will prompt you for what you want to lock down. Here&#8217;s an example of locking down everything as we described in step 1.

<img class="aligncenter size-full wp-image-28401" src="https://strongloop.com/wp-content/uploads/2016/11/authposta.png" alt="authposta" width="964" height="185" srcset="https://strongloop.com/wp-content/uploads/2016/11/authposta.png 964w, https://strongloop.com/wp-content/uploads/2016/11/authposta-300x58.png 300w, https://strongloop.com/wp-content/uploads/2016/11/authposta-768x147.png 768w, https://strongloop.com/wp-content/uploads/2016/11/authposta-705x135.png 705w, https://strongloop.com/wp-content/uploads/2016/11/authposta-450x86.png 450w" sizes="(max-width: 964px) 100vw, 964px" />

The next result is simply a modification to your JSON file for your model. Here&#8217;s the complete list of ACLs defined for **Post**:

```js
"acls": [
    {
      "accessType": "*",
      "principalType": "ROLE",
      "principalId": "$everyone",
      "permission": "DENY"
    },
    {
      "accessType": "EXECUTE",
      "principalType": "ROLE",
      "principalId": "$authenticated",
      "permission": "ALLOW",
      "property": "create"
    },
    {
      "accessType": "EXECUTE",
      "principalType": "ROLE",
      "principalId": "$owner",
      "permission": "ALLOW",
      "property": [
        "updateAttributes",
        "deleteById"
      ]
    },
    {
      "accessType": "READ",
      "principalType": "ROLE",
      "principalId": "$everyone",
      "permission": "ALLOW"
    }

```

I&#8217;m going to assume that this is pretty readable as is. Remember, you don&#8217;t have to use the CLI if you don&#8217;t want to. You can always just edit the JSON file directly. Once you&#8217;ve done this, and restarted, you should do some quick testing in the Explorer. Begin by trying to read **Posts** &#8211; it should be allowed since the ACL says $everyone can do so. Then try to create a new post via `POST /posts`. You should get an error:

<img class="aligncenter wp-image-28402" src="https://strongloop.com/wp-content/uploads/2016/11/authpostb.png" alt="authpostb" width="446" height="289" srcset="https://strongloop.com/wp-content/uploads/2016/11/authpostb.png 523w, https://strongloop.com/wp-content/uploads/2016/11/authpostb-300x194.png 300w, https://strongloop.com/wp-content/uploads/2016/11/authpostb-450x292.png 450w" sizes="(max-width: 446px) 100vw, 446px" />

At this point, you can test registering and logging in, with the API Explorer. Our &#8220;real&#8221; app has this of course, but assume for now you haven&#8217;t built that yet. This can be done by testing the `POST /appusers` endpoint and sending in credentials of the form:

```js
{
"email":"foo@foo.org",
"password":"password"
}

```

Obviously you can tweak the email and password values to your liking. If it worked OK, you can then login by running `POST /apiusers/login`. Use the exact same credentials and note the result:

```js
{
  "id": "QuyuML6mC9suXqv4ujdJnrYHchqrP65fZU2UlKGrlBkEQnchLLIrO2AarqVAQ5vY",
  "ttl": 1209600,
  "created": "2016-11-21T15:38:41.862Z",
  "userId": 5
}

```

See that ID? That&#8217;s your access token that you can use to authenticate further calls. The Explorer makes this simple. At the very top of the screen, copy and paste the token and then hit the nice big green &#8220;Set Access Token&#8221; button. Now you can try adding a post again. This time it should work correctly.

In terms of security, the back end is done, but we&#8217;ve got a bit more work to do. We have two values for Posts that we do not want users sending in via the API. One is created, and one is the creator. We can easily do this with a remote hook in post.js. Here is how that looks:

```js
'use strict';

module.exports = function(Post) {

    Post.beforeRemote('create', function(ctx, instance, next) {
        console.log('before create');
        //override created
        ctx.args.data.created = new Date();
        //set creator to current user
        ctx.args.data.ownerId = ctx.req.accessToken.userId;

        next();
    });
};

```

As you can tell by the definition, this hook runs before a create operation. We default **created** to the current value and ownerId to the current user. Two things to note there. Why **ownerId** and not **creator**? **Creator** is the name of the relationship, but the actual foreign key was **ownerId**. Secondly, where did we get the **userId**? LoopBack places that automatically in the request scope under the accessToken object. It&#8217;s a convenience that helps us out here.

Now our server-side is complete!

## Building the Client

The client is—to be fair—not the prettiest thing. But it does demonstrate most of the features you would expect in a real application. We can register, login, create posts, and lists all the current posts. Instead of showing you all the code, let&#8217;s break down the important bits of those particular actions, beginning with the public view.

```js
function loadPosts() {

	var apiUrl = '/api/posts/?filter[include][creator]&filter[where][created][gte]='+encodeURIComponent(
		lastCheck.toISOString()) + '&filter[order]=created%20desc';

	$.get(apiUrl).then(function(res) {
		var html = '';
		res.forEach(function(p) {
			var btnText = '';
			if(p.creator.id === userid) {
				btnText = `&lt;button class="btn btn-danger deletePost" data-id="${p.id}"&gt;Delete&lt;/button&gt;`;
			}
			var card = `
&lt;div class="card post" data-postid="${p.id}" data-creatorid="${p.creator.id}"&gt;
  &lt;div class="card-block"&gt;
    &lt;h4 class="card-title"&gt;${p.creator.email} on ${niceDate(p.created)}&lt;/h4&gt;
    &lt;p class="card-text"&gt;${p.text}&lt;/p&gt;
	&lt;span class='btnArea'&gt;${btnText}&lt;/span&gt;
  &lt;/div&gt;
&lt;/div&gt;
			`;
			html += card;
			//console.dir(p);
		});
		$postsDiv.prepend(html);
		lastCheck = new Date();
		window.setTimeout(loadPosts, INTERVAL);

	});

}

```

loadPosts is called on startup and run in an interval defined by a global variable INTERVAL. LoopBack does support fancier ways of knowing when new data is created, but honestly, this was the simplest and fine for a simple proof of concept. We begin by making a GET request to `/api/posts`. Note the variables in use. First, we tell the API to include the related user. By default the API won&#8217;t to save space in the network call. Then we have a filter on created. We only want new posts on every API call. The variable `lastCheck` was defaulted to January 1, 2000, so on the first load it will get all the posts. Finally, we tell the API to order by the created value in descending order. Then it&#8217;s simply a matter of rendering. We loop over each post and output some basic HTML to render it. Also note the check to see if the post was created by the current user. You&#8217;ll see `userid` set later in the register/login routines. Let&#8217;s take a look at register now.

```js
function doRegister(e) {
	e.preventDefault();
	console.log('doRegister');
	var errors = '';
	if($email2.val() === '') errors += 'Email is required.&lt;br/&gt;';
	if($password2.val() === '') errors += 'Password is required.&lt;br/&gt;';
	if($password2c.val() != $password2.val()) errors += 'Confirmation password didn`t match.&lt;br/&gt;';
	if(errors != '') {
		$registerErrorBlock.html(`
		&lt;div class="alert alert-danger" role="alert"&gt;
		&lt;strong&gt;Please correct these errors:&lt;/strong&gt;&lt;br/&gt;${errors}
		&lt;/div&gt;`);
	} else {
		$registerErrorBlock.html('&lt;em&gt;Stand by - trying to register...');
		var user = { email:$email2.val(), password:$password2.val()};
		$.post('/api/appusers', user).then(function(res) {
			//success, now immediately followup with a login
			userid = res.id;
			$.post('/api/appusers/login', user).then(function(res) {
				console.log(res);
				token = res.id;
				$('#login').modal('hide');
				$loginLink.hide();
				$addPostBlock.show();
				$logoutLink.show();
				fixPosts();
			});
		}).catch(function(e) {
			console.log('catch block');
			var error = e.responseJSON.error.message;
			console.log(error);
			// for now, assume only error is dupe
			$registerErrorBlock.html(`
			&lt;div class="alert alert-danger" role="alert"&gt;
			&lt;strong&gt;Please correct these errors:&lt;/strong&gt;&lt;br/&gt;Sorry, but that email already exists.
			&lt;/div&gt;`);

		});
	}
}

```

While there&#8217;s a lot going on here, a vast majority of it is DOM checking and reporting of errors. That&#8217;s not really important. Instead, focus on the post operation. That&#8217;s used to do the initial registration. When done, that&#8217;s then followed up by a login call. We store both the userid and the token for later user. The login routine is similar, but much smaller since it doesn&#8217;t need to register as well. Now let&#8217;s look at creating posts.

```js
function doMessage(e) {
	e.preventDefault();
	var str = $addPostText.val();
	if(str === '') return;

	var msg = {text:str};
	$.ajax({
		type:'post',
		url:'/api/posts',
		headers:{
			'Authorization':token
		},
		data:msg
	}).then(function(res) {
		console.log(res);
		$addPostText.val('');
	}).catch(function(e) {
		console.log('error');
		console.log(e);
	});

}

```

We&#8217;ve had to switch from using jQuery&#8217;s convenience methods since we need to pass a header to LoopBack that includes the authorization value. Remember we store `token` on registering or logging in. (As an FYI, jQuery supports setting default headers for Ajax calls so we could have done that as well, but I wanted to show an example of passing the token in the Ajax call itself.) The delete call is similar:

```js
function deletePost(e) {
	e.preventDefault();
	console.log('deletePost');
	var parent = $(e.currentTarget).parent().parent().parent();
	var postid = parent.data("postid");
	console.log(postid);
	$.ajax({
		type:'delete',
		url:'/api/posts/'+postid,
		headers:{'Authorization':token}
	}).then(function(res) {
		parent.remove();
	});
}

```

And that&#8217;s really it. Most of the code is handling user interactions and reporting/rendering issues. The API calls are relatively simple since LoopBack is handling so much of the work for us. Hopefully this has been helpful.

You can find the complete source code here: <https://github.com/cfjedimaster/StrongLoopDemos/tree/master/simpleauthdemo>

Click here to try out [LoopBack](http://loopback.io/), our highly-extensible, open-source Node.js framework.