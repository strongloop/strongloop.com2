---
id: 27177
title: 'Working with LoopBack&#8217;s Object-Relational Mapping (ORM) System'
date: 2016-04-13T09:55:39+00:00
author: Raymond Camden
guid: https://strongloop.com/?p=27177
permalink: /strongblog/working-with-loopbacks-orm/
categories:
  - How-To
  - LoopBack
---
When we talk about LoopBack, we're usually talking about rapid API generation. But behind the REST APIs is a full object-relational mapping (ORM) system that enables you to do all the standard create, read, update, and delete (CRUD) operations in your Node.js code. If you're creating only an API, then this may not be terribly important to you. But if you are creating both an API as well as a &#8220;regular&#8221; web site, then being able to use the ORM features could be very handy. While this is documented well in the [&#8220;Working with data&#8221;](https://docs.strongloop.com/display/LB/Working+with+data) section of the docs, I wanted to create a simple demo so I could wrap my head around how it actually feels to work with the server-side functions. I discovered that it is—for the most part—pretty simple, but model relationships add a few wrinkles that you have to consider when working with data.

<!--more-->

You can find the complete source for this demo here: <https://github.com/cfjedimaster/StrongLoopDemos/tree/master/ormdemo>

This simple demo uses two models: Product and Part. While eventually I'll link the two, I began by creating them as atomic, not linked, models and worked on building a simple UI for handling the CRUD process. Here is the initial definition of Product:

```js
{
  "name": "Product",
  "plural": "Products",
  "base": "PersistedModel",
  "idInjection": true,
  "options": {
    "validateUpsert": true
  },
  "properties": {
    "name": {
      "type": "string"
    },
    "price": {
      "type": "number"
    }
  },
  "validations": [],
  "relations": {
    "parts": {
      "type": "hasMany",
      "model": "Part",
      "foreignKey": ""
    }
  },
  "acls": [],
  "methods": {}
}
```

And here is Part:

```js
{
  "name": "Part",
  "plural": "Parts",
  "base": "PersistedModel",
  "idInjection": true,
  "options": {
    "validateUpsert": true
  },
  "properties": {
    "name": {
      "type": "string"
    }
  },
  "validations": [],
  "relations": {},
  "acls": [],
  "methods": {}
}
```

I then began work on the application itself. I began by adding the `express-handlerbars` dependency to my application so I could use Handlebars on the server-side. I then added a new boot script, `routes.js`, so I could begin adding the various routes of my application. The home page would consist of two lists &#8211; all products and all parts. My code is slightly &#8220;callback-hellish&#8221; (is that a word?) but still readable:

```js
router.get('/', function(req,res) {

	server.models.Product.find({order:'name asc'}).then(function(products) {
		server.models.Part.find({order:'name asc'}).then(function(parts) {
			res.render('index',{products:products,parts:parts});
		});
	});

});
```

As you can see, to get everything, you can simply call the `find` method on your model. Sorting is also pretty simple: `{order:'name asc'}`. Nice and simple. In case you're curious, here is the view I used to list out both sets of data. Yes, I used tables and I'm proud of that.

{% raw %}
```js
<h1>Products</h1>

<table border="1">
	<thead>
		<tr>
			<th>Name</th>
			<th>Price</th>
			<th></th>
		</tr>
	</thead>
	<tbody>
	{
		<tr>
			<td><a href="/products/edit/{{id}}">{{name}}</a></td>
			<td>{{price}}</td>
			<td><a href="/products/delete/{{id}}">Delete</a></td>
		</tr>
	{{/each}}
	</tbody>
</table>

<p>
	<a href="/products/edit/0">Add New Product</a>
</p>

<h1>Parts</h1>

<table border="1">
	<thead>
		<tr>
			<th>Name</th>
			<th></th>
		</tr>
	</thead>
	<tbody>
	{
		<tr>
			<td><a href="/parts/edit/{{id}}">{{name}}</a></td>
			<td><a href="/parts/delete/{{id}}">Delete</a></td>
		</tr>
	{{/each}}
	</tbody>
</table>

<p>
	<a href="/parts/edit/0">Add New Part</a>
</p>
```
{% endraw %}

Here is a screen shot of the UI in action. As a warning, I spent approximately 30 seconds on the design.

<img class="aligncenter size-full wp-image-27180" src="{{site.url}}/blog-assets/2016/04/shot1.jpg" alt="shot1" width="444" height="380"  />

I won't bore you with the UI for edit. It is just as lovely as what you see here, but let's look at the code behind it. First, this is run when we initially load the view to edit a product.

```js
router.get('/products/edit/:id', function(req,res) {
	server.models.Product.findById(req.params.id).then(function(product) {
		if(!product && req.params.id != 0) return res.redirect('/');
		res.render('edit',{product:product});
	});
});
```

The important part here is the `findById` bit. Again, simple! Saving is also trivial:

```js
router.post('/products/save', function(req, res) {
	// One-to-one between form and model
	var product = req.body;
	server.models.Product.upsert(product).then(function() {
		res.redirect('/');
	});
});
```

The comment in the block there may not be terribly clear, but I made my form fields match my model, allowing me to quickly copy them over before I persist. Make note of the `upsert` method that handles both creating new items and recognizing an existing item. Again, simple! (Yes, I keep saying that, but I love it!)

Finally, the delete route:

```js
router.get('/parts/delete/:id', function(req,res) {
	server.models.Part.deleteById(req.params.id).then(function(part) {
		res.redirect('/');
	});
});

```

The important part is the `deleteById` method. In case it isn't obvious, I'm not locking down anything in this demo. That would definitely be something you would do in production. I won't show the code for Parts as it is exactly the same, except for a simpler edit form since parts only have a name property.

Ok, so far I haven't done anything really special. You've seen the methods to create/update (nicely merged into one, but you can do them separately of course), read (both one and all), and delete. It just works, which is what you expect from an ORM. Now it's time to make things a little bit more complex and add some relationships.

## Down the Rabbit Hole

Before I begin: a warning. I've been honest about being new to LoopBack and StrongLoop. I love it, but I'm still learning as I go. What I describe below may **not** be the best way of doing things and if I find out otherwise, I'll definitely come back and share. I've always found that by sharing what I've learned, even when it ends up being the wrong way, it is useful to others and I hope what follows is useful as well.

The LoopBack docs have an entire section on relationships ([&#8220;Creating model relations&#8221;](https://docs.strongloop.com/display/LB/Creating+model+relations)) and it is fairly clear on how things work, but I'd suggest reading it carefully. My mental model of my relationship was that my product would have many parts. I thought [HasMany](https://docs.strongloop.com/display/LB/HasMany+relations) made sense. But after running into a few issues, I realized that the proper relationship I needed was [HasAndBelongsToMany](https://docs.strongloop.com/display/LB/HasAndBelongsToMany+relations). Why? It isn't just that my product has a part, but my part also has a product. One part, let's say a Wheel, may be used in multiple products.

What sold me was when the docs had a picture of **exactly** (well, nearly exactly) what I was modeling:

<img class="aligncenter size-full wp-image-27187" src="{{site.url}}/blog-assets/2016/04/has-and-belongs-to-many.png" alt="has-and-belongs-to-many" width="595" height="185"  />

I set up my relationship via the CLI which was pretty easy to follow. The important part was defining it on both. In the end, this is how my model files looked. First, Product:

```js
{
  "name": "Product",
  "plural": "Products",
  "base": "PersistedModel",
  "idInjection": true,
  "options": {
    "validateUpsert": true
  },
  "properties": {
    "name": {
      "type": "string"
    },
    "price": {
      "type": "number"
    }
  },
  "validations": [],
  "relations": {
    "parts": {
      "type": "hasAndBelongsToMany",
      "model": "Part",
      "foreignKey": ""
    }
  },
  "acls": [],
  "methods": {}
}
```

And here is Part:

```js
{
  "name": "Part",
  "plural": "Parts",
  "base": "PersistedModel",
  "idInjection": true,
  "options": {
    "validateUpsert": true
  },
  "properties": {
    "name": {
      "type": "string"
    }
  },
  "validations": [],
  "relations": {
    "products": {
      "type": "hasAndBelongsToMany",
      "model": "Product",
      "foreignKey": ""
    }
  },
  "acls": [],
  "methods": {}
}
```

One thing I dig about LoopBack's JSON definition files is that once you've used the CLI a few times, you can get more comfortable with the syntax and simply copy and paste. Or use the CLI. I like having options.

Ok, so here is where things get interesting. First, when editing a product, we need a list of all parts as well as the current parts associated with a product. I again dove into (minor) callback hell and simply did a &#8220;get all parts&#8221; call followed by a &#8220;get a product&#8221; call. The interesting thing is that—by default—when you ask for an object that has related items, the API will _not_ return associated data unless you ask for it. Since the operation could be expensive, I can see the logic in that, and it takes all of two seconds to ask LoopBack to kindly return that stuff too. Here is the new edit route:

```js
router.get('/products/edit/:id', function(req,res) {
	//get all parts so we can use in the form
	server.models.Part.find({order:'name asc'}).then(function(parts) {

		server.models.Product.findById(req.params.id,{include:'parts'}).then(function(product) {
			if(!product && req.params.id != 0) return res.redirect('/');
			res.render('edit',{product:product, parts:parts});
		}).catch(function(err) {
			console.log('Error in edit route', err);
		});

	});
});
```

So far so good. But here is where Handlebars goes a bit nutso. I like Handlebars, but handling anything complex, even &#8220;given an array of crap, does X exist in it&#8221; means you have to resort to a helper function. Here is how that looks in the view:

{% raw %}
```js
<p>
<label for="parts">Parts:</label>
<select name="parts" id="parts" multiple>
	{
		<option value="{{id}}" {{ifSelected ../product id}}>{{name}}</option>
	{{/each}}
</select>
</p>
```
{% endraw %}

And here is how I added that helper:

```js
var hbs = exphbs.create({
	defaultLayout:'main',
	layoutsDir:__dirname+'/views/layouts',
	helpers:{
		ifSelected:function(product,partid) {
			if(!product) return '';
			var parts = product.parts();
			for(var i=0;i<parts.length;i++) {
				if(String(parts[i].id) === String(partid)) {
					return 'selected';				
				}
			}
			return '';
		}
	}
});
```

Saving is a slightly bit more complex. I'll paste the code below, and it's lengthy, but once I explain things hopefully it will make sense.

```js
router.post('/products/save', function(req, res) {
	//one to one btn form and model
	var product = req.body;
	if(product.id === '') delete product.id;
	//remove parts
	var selectedParts = [];
	if(product.parts) {
		//so req.body turns one into a string and two into an array
		if(typeof product.parts === 'string') {
			selectedParts[0] = product.parts;
		} else {
			selectedParts = product.parts;
		}
		delete product.parts;
	}
	console.log('selected parts is '+selectedParts);

	server.models.Product.upsert(product).then(function(product) {

		/*
		At this point, 'product' is a stored object, whether it was new or not
		But we don't have the parts cuz you can't upsert and ask for it back, so we'll get a new one
		*/
		server.models.Product.findById(product.id,{include:'parts'}).then(function(loadedProduct) {

			var parts = loadedProduct.parts();
			var mods = [];
			if(parts && parts.length) {
				console.log('old ones to remove');
				parts.forEach(function(oldPart) {
					if(selectedParts.indexOf(oldPart.id) === -1) {
						console.log('killing '+oldPart);		
						var p = new Promise(function(fulfill, reject) {
							loadedProduct.parts.remove(oldPart).then(function(err) {
								console.log('in the remove cb, err? ',err);
								fulfill();
							});
						});
						mods.push(p);					
					}
				});
			}

			if(selectedParts.length) {
				selectedParts.forEach(function(newPart) {
					console.log('adding newPart '+newPart);
					var p = new Promise(function(fulfill, reject) {
						server.models.Part.findById(newPart).then(function(part) {
							loadedProduct.parts.add(part).then(function() {
								fulfill();
							});
						});
					});
					mods.push(p);
				});
			}

			Promise.all(mods).then(function() {
				console.log('in theory, done with all the removals');
				console.log('testing loaded prod', loadedProduct.parts().length);
				res.redirect('/');
			});

		});

	}).catch(function(e) {
		console.log('Error in upsert', e);
	});

});
```

Let's tackle this bit by bit. As before, we can look at `req.body`, the form variables, as a version of our Product model. The selected parts come in a bit weird though. If you pick one, it is a string. If you pick multiple, it is an array. `selectedParts` represents the parts you want associated with this particular product.

Now comes the fun part. Persisting the product is easy: just call `upsert`. Then we have to fetch the product we just saved, include the parts, and if we have any, see if they do **not** exist in the new `selectedParts` array. If they don't, we remove them. Notice this is an async process.

Then we go through `selectedParts` and add in each one. In theory we may get some duplication here but as far as I know, LoopBack handles that. This too is async.

We can take both &#8220;sets&#8221; of async processes, pass them to `Promise.all`, and use that as a way of knowing when everything is done.

All in all a bit complex, but not terribly so. Deleting also requires some cleanup. Here is the route.

```js
router.get('/products/delete/:id', function(req,res) {
	/*
	Can't just use deleteById, because first we have to get our products and remove them.
	*/

	server.models.Product.findById(req.params.id,{include:'parts'}).then(function(product) {
		if(!product) return res.redirect('/');
		var parts = product.parts();
		var mods = [];
		if(parts && parts.length) {
			parts.forEach(function(oldPart) {
				var p = new Promise(function(fulfill, reject) {
					product.parts.remove(oldPart).then(function(err) {
						fulfill();
					});
				});
				mods.push(p);					
			});
		}

		Promise.all(mods).then(function() {
			server.models.Product.deleteById(req.params.id).then(function(err) {
				res.redirect('/');
			});
		});


	});		

});
```

As with editing, I need to fetch a full copy of the product, including parts, so I can then remove one by one. Once all those async processes are done, the &#8220;real&#8221; delete can then happen. Code for part deletion is similar. I have to fetch the part, remove all products, and then process the deletion.

So&#8230; all in all there is a level of complexity added when you do relationships, which matches near perfect with what I saw in Hibernate as well. There may be better ways of handling this, as I said, I'm learning, and if I find them, I'll definitely share.

Remember, you can find the full source code here: <https://github.com/cfjedimaster/StrongLoopDemos/tree/master/ormdemo>
