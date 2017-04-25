---
id: 27335
title: User-based Authentication with Loopback
date: 2016-05-17T07:56:17+00:00
author: Alex Muramoto
guid: https://strongloop.com/?p=27335
permalink: /strongblog/user-based-authentication-with-loopback/
categories:
  - How-To
  - LoopBack
---
Many who are familiar with LoopBack first discovered it as a way to build RESTful APIs, but LoopBack offers more than just the tools API developers need to build the API itself. LoopBack also also provides optional features that are focused on enriching your API offering, like push notifications and user management. Since a strong use case of APIs is providing user-based access control, let&#8217;s start there.

<!--more-->

## Why Use LoopBack for User Management?

Modern Web and mobile apps are largely driven by APIs, and for good reason. They&#8217;re awesome, yes, but also the client can&#8217;t be trusted to access resources directly. This may seem like common sense nowadays, but it always bears repeating. Having said that, even relatively &#8220;simple&#8221; apps commonly need to access many APIs for everything from images to maps to user profiles to you name it.

This is where a framework like LoopBack comes into play. Because it isn&#8217;t just about your APIs anymore. It&#8217;s about securely managing access to ALL the resources your apps need to consume. LoopBack provides token-based authentication with its user management feature, as well as fine-grain, role-based permissions with access control lists (ACLs). This means a LoopBack API can act as the unified access control layer for all your resources (not to mention providing a nice, _sane_ RESTful interface).

## The Built-in User Model

To get started, we need a user to manage.

Every LoopBack API has a built-in User model. What makes the User model special is that it is ready-made to enable user authentication and authorization with such excellent conveniences right out of the box as login/logout endpoints, password encryption, and token authentication.

### Customizing the User Model

Although the built-in User Model includes a lot of great functionality, it cannot be further customized directly with things like remote methods and ACLs, which are essential for making a LoopBack API production-grade. To do this, we need to create a new model that extends User. For more on how to do this, see Extending Built-in Models in the Loopback docs.

For this example, we won’t worry about that, since we aren’t going to be altering the base User model at all. Onward!

## Creating Users

To create a new user in LoopBack, all we need to do is send the user&#8217;s details in a `POST` to the `/api/users` endpoint of our API. By default, LoopBack only requires &#8217;email&#8217; and &#8216;password&#8217; properties.

```js
curl -X POST http://localhost:3000/api/users -d '{"email": "fakeyemail@fakeyfake.com", "password": "SuperFakePassword"}'

```

First, I&#8217;d like to note that every password strength tester I could find rated &#8216;SuperFakePassword&#8217; as strong or very strong, which I find very entertaining. Second, LoopBack uses [bcrypt](https://www.npmjs.com/package/bcrypt-nodejs) to encrypt the user&#8217;s password before it&#8217;s persisted to the datasource, so you get very strong encryption for free. Third, you&#8217;ve created a user without having to do anything other than stand up a LoopBack API and make a single HTTP request. Pretty easy, right?

> ### Tip: Removing Email Requirement
> 
> If you don&#8217;t want to require the email property, you can disable it by dropping this boot script into a file in `/server/boot/` of your project:
> 
> ```js
module.exports = function(app) {
  delete app.models.User.validations.email;
};

```

## Authentication and Authorization

Once you have your users created in LoopBack, you&#8217;re ready to start using token-based authentication to secure your API. The User model has login and logout [Remote Methods](https://strongloop.com/strongblog/remote-methods-in-loopback-creating-custom-endpoints/) out of the box, which means there are ready-made `/api/users/login` and `/api/users/logout` endpoints ready to go in your API.

### Login

To get a token for a user, all you have to do is send the user&#8217;s email and password or username and password in a `POST` to `/api/users/login`:

```js
curl -X POST http://localhost:3000/api/users/login -d '{"email": "fakeyemail@fakeyfake.com", "password": "SuperFakePassword"}'

```

LoopBack will return a token in the `id` property of the response, as well as the token&#8217;s time to live in seconds, the creation timestamp, and the ID of the user record the token was issued to:

```js
{
  "id": "GOkZRwgZ61q0XXVxvxlB8TS1D6lrG7Vb9V8YwRDfy3YGAN7TM7EnxWHqdbIZfheZ",
  "ttl": 1209600,
  "created": "2013-12-20T21:10:20.377Z",
  "userId": 1
}

```

### Authentication

Now all you have to do is send the token in the `Authorization` header of your requests:

```js
curl -X GET http://localhost:3000/api/someSecureStuff -H "Authorization: "

```

LoopBack will automatically check that the token is valid, and evaluate its access to resources against any ACLs you&#8217;ve defined in your LoopBack app.

### Logout

Once the user is ready to be logged out, send an HTTP request to the `/api/users/logout` endpoint. It should be noted that any HTTP method is supported for this operation, though `POST` would be the generally accepted practice for a logout request.

```js
curl -X POST http://localhost:3000/api/users/logout -H "Authorization: "

```

On success, this will return a response with a &#8216;204 No Content&#8217; status code.

## Customizing Authentication

So far, we&#8217;ve seen that LoopBack helps us get started with user-based authentication pretty quick, but what if we want to customize what happens when the user logs in or logs out? For example, we could log all login attempts to create an audit trail, or log errors that occur when the user tries to authenticate to help us debug potential future issues. Not a problem! Remember, login and logout are remote methods on the User model. This means they can be invoked by other endpoints. Let&#8217;s look at a quick example.

### Adding Express Routes

To start, the default `/api/users/login` and `/api/users/logout` endpoints are a little verbose. A more straight-forward pattern would be to shorten the path to `/login` and `/logout`. To do this, we take advantage of the fact that LoopBack is Express-based, by directly defining new express routes in a [boot script](https://docs.strongloop.com/display/APIC/Defining+boot+scripts).

Boot scripts are run when a LoopBack API is started. The instance of the underlying Express app is automatically passed in as an argument, which means we can easily define new routes:

```js
module.exports = function (app) {
	app.post('/login', function (req, res, next) {};
	app.post('/logout', function (req, res, next) {}
}

```

### Extending Login/Logout from the Built-in User Model

Next, we create an instance of the default User model and use it to access our login and logout remote methods. We can then inject a custom logic like we would in any other Express app. In this case, we are adding a custom `Log()` function, which would output to a separate data store in a real-world app, as well as custom response definitions:

```js
module.exports = function (app) {
	//get User model from the express app
	var UserModel = app.models.User;

	app.post('/login', function (req, res) {		
		
		//parse user credentials from request body
		const userCredentials = {
			"username": req.body.username,
			"password": req.body.password
		}

		UserModel.login(userCredentials, 'user', function (err, result) {			
			if (err) {
				//custom logger
				Log.error(err);
				res.status(401).json({"error": "login failed"});
				return;
			}

			Log.info({
				"username": userCredentials.username,
				"timestamp": new Date.getTime(),
				"action": "login"
			});
			
			//transform response to only return the token and ttl
			res.json({
				"token": result.id,
				"ttl": result.ttl
			});
		});
	});

	app.post('/logout', function (req, res, next) {
		const access_token = req.query.access_token;
		if (!access_token) {
			res.status(400).json({"error": "access token required"});
			return;
		}
		UserModel.logout(access_token, function (err) {
			if (err) {
				Log.error({
				 	"error": err,
					"timestamp": new Date.getTime()
				});
				res.status(404).json({"error": "logout failed"});
				return;
			}
			res.status(204);
		});		
	});
}

```

## What&#8217;s Next?

User management is just one half of the security picture when it comes to LoopBack APIs. Next we will need to define some roles and ACLs that LoopBack can use to determine whether the user is authorized to access the resources they are requesting. To learn more about that, check out the [LoopBack docs](https://docs.strongloop.com/display/APIC/Controlling+data+access), and for a complete example LoopBack project to go with this tutorial, you can snag it from [Github](https://github.com/amuramoto/simple_samples/tree/master/loopback-user-login/api).