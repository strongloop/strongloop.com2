---
id: 26962
title: Examples of Validations for LoopBack Models
date: 2016-03-29T08:15:20+00:00
author: Raymond Camden
guid: https://strongloop.com/?p=26962
permalink: /strongblog/examples-of-validations-for-loopback-models/
categories:
  - How-To
  - LoopBack
---
When working with LoopBack models, you can validate data before it gets persisted into your datastore multiple different ways. The [documentation](https://docs.strongloop.com/display/public/LB/Validating+model+data) describes the various methods, but I wanted to play with it a bit and demonstrate a few examples.

To begin, let&#8217;s consider an example in which you&#8217;ve defined a model property with a particular type and you do not pass in the correct value. I&#8217;ve got a `Cat` model that includes a name (string), age (number), and color (string). None of these values are required (and this is important). What happens if I try to post a string value for age?

<!--more-->

Here is the JSON I used:

```js
{
  "name": "Test",
  "age": "Bad",
  "color": "blue",
  "id": 0
}

```

And here is the response:

<img class="aligncenter size-full wp-image-26966" src="https://strongloop.com/wp-content/uploads/2016/03/shot11.png" alt="shot1" width="140" height="181" srcset="https://strongloop.com/wp-content/uploads/2016/03/shot11.png 420w, https://strongloop.com/wp-content/uploads/2016/03/shot11-232x300.png 232w" sizes="(max-width: 140px) 100vw, 140px" />

Notice that no error was thrown, but the invalid value was nulled out. This only happens because age is not required, so LoopBack simply throws out the incorrect value. You can address this by simply making age required. Then when you post the same value, you get the proper response:

<img class="aligncenter size-full wp-image-26965" src="https://strongloop.com/wp-content/uploads/2016/03/shot2.png" alt="shot2" width="750" height="368" srcset="https://strongloop.com/wp-content/uploads/2016/03/shot2.png 750w, https://strongloop.com/wp-content/uploads/2016/03/shot2-300x147.png 300w, https://strongloop.com/wp-content/uploads/2016/03/shot2-705x346.png 705w, https://strongloop.com/wp-content/uploads/2016/03/shot2-450x221.png 450w" sizes="(max-width: 750px) 100vw, 750px" />

Woot! OK, but that&#8217;s pretty simple. What about things such as validating that age is numeric, a whole number, and &#8220;reasonable&#8221; (for a cat, say below 25)? Turns out there are different ways of handling validation. Obviously you can write completely custom code, so yes, what I just described is completely doable. But LoopBack includes some validation &#8220;shortcuts&#8221; out of the box, so the great news is that you can skip writing validation functions in many cases. The [docs](https://docs.strongloop.com/display/public/LB/Validating+model+data) cover this in depth, but at a high level,in one line you can add validation methods to require:

  * A property to _not_ exist. (Which seems odd, but you may have conditional logic where if some condition is true, a property must not exist.)
  * The presence of a property.
  * A value not be in a particular set. So you could say that a name can&#8217;t be Ray or Bob.
  * A value to be in a particular set. So a name must be Ray or Bob.
  * Match a regular expression.
  * Length to be at least so many characters, or at most so many characters, or exactly one length.
  * A number to be an integer (as in the age example provided above).
  * A value to be unique. This one only works in a few supported datastores, but keep in mind that you can always write your own logic to handle cases where it isn&#8217;t supported.

So what does it look like to include these rules?All of the validation examples I mentioned above can be included with one line of code. Here is how you would require a name to be one of two values:

```js
module.exports = function(Person) {
	Person.validatesInclusionOf('name', {'in':['Ray','Jeanne']});	
};

```

That&#8217;s it. But let&#8217;s kick it up a notch. You can write completely custom validation using one of two functions: \`validate\` or \`validateAsync\`. As their names imply, the first is for synchronous validation logic and the other is asynchronous. Here&#8217;s a simple example that uses a timeout and returns a pass/fail at a later time:

```js
function myCustom(err, done) {
	var name = this.name;
	setTimeout(function() {
		if(name === 'Ray') {
			err();
		}
		done();			
	}, 1000);	
}
	
Person.validateAsync('name', myCustom, {message:'Dont like'});

```

This example calls the \`myCustom\` function to validate a name asynchronously. (I could have &#8220;inlined&#8221; the function too, but maybe other properties will use the same logic.) Your custom function is passed two objects, \`err\` and \`done\`. At first, I thought I should call \`err\` and exit, but that&#8217;s not the case. An error condition is more like a flag. Note how I don&#8217;t return, or abort, or anything in my error condition. All I do is call \`err\` itself, and then continue on.

Now when I try to create a person, it will take a second, and if the name is \`Ray\`, I get an error. Notice the error message defined is probably not the nicest I could write.

Obviously this is a rather trivial example, but it demonstrates how powerful LoopBack is in terms of customization. While LoopBack lets you create a simple API in minutes, &#8220;real&#8221; applications will have unique business needs. What I appreciate about LoopBack is the incredible level of customization at all points of the API process. No matter your particular needs, LoopBack will provide a way to support them.