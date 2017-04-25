---
id: 29036
title: 'Introducing API Microgateway: a Programmable Open Source Gateway for your APIs'
date: 2017-04-04T07:40:09+00:00
author: Raymond Camden
guid: https://strongloop.com/?p=29036
permalink: /strongblog/introducing-api-microgateway-programmable-open-source-gateway-apis/
inline_featured_image:
  - "0"
categories:
  - API Microgateway
format: gallery
---
As API developers, we&#8217;re tasked with not only building a good, feature-rich API, but also ensuring it can stand up to rigors of a production environment. Frameworks like [LoopBack](http://loopback.io) make developing APIs incredibly easy. On the flip side, products like [API Connect](http://www-03.ibm.com/software/products/en/api-connect) help move those APIs safely into production.

So when do you need an API management product like API Connect? For many reasons, but all of the reasons have one thing in common: you need a gateway. Gateways serve as a proxy between the internet and the microservice(s) running your API. Imagine for a moment you&#8217;ve built a simple API in LoopBack to return a list of cats. Great. But now you want to add a layer of authentication and rate limiting to that API. That means setting up a process to generate keys for API consumers as well as actually checking those keys on every call. For rate limiting, you&#8217;ll need a way to record how often a person has used your API and ensure they don&#8217;t go over their defined limits.

Most likely you don&#8217;t want to add all this code to your simple API. Great! This is where a gateway, available in API Connect, comes in handy. You get all the features I mentioned above (plus many more), nicely separated away from your microservice architecture.<!--more-->

So at this point you&#8217;re probably sold. Great! But what you may not know is that you don&#8217;t need to fork over any dollars to try it out. We recently announced the availability of the API Microgateway, previously packaged exclusively for use with API Connect, now open source and [available on GitHub](https://github.com/strongloop/microgateway). What&#8217;s cool about this version is that you can have your gateway and extend it as well with policies you define (and write) yourself.

Some examples of the kinds of things you can write are:

  * Rate limiting based on time of day or week. You could, for example, allow for a higher rate limit, or no rate limit, outside of normal business hours.
  * Adding machine-based translation to data within a micro-service response. This would allow for dynamic, on the fly translations of text content.
  * Or even better &#8211; look at other open-source solutions for rate limiting and simply roll them into API Gateway!

In this post, I&#8217;ll show you how to add the API Microgateway to your development and then walk you through the process of adding a custom policy.

## Part Zero

I&#8217;m going to assume you&#8217;ve got Git, Node and npm already, but you&#8217;ll also want to have the following things installed:

  * The LoopBack CLI can be installed with: `npm install -g loopback-cli`
  * The APIC CLI can be installed with `npm install -g apiconnect` You may be wondering about that last bit. The same command line tooling that is used with the commercial, non-open source version of APIC is also used with API Microgateway. Technically you don&#8217;t have to use the CLI, but it handles a \*lot\* of stuff for you that you probably don&#8217;t want to have to do by hand.

## Part One

Let&#8217;s begin by first creating a microservice using the awesomeness that is LoopBack. I&#8217;m going to assume some basic knowledge of LoopBack. If any of this doesn&#8217;t make sense, spend some time over at the [docs](http://loopback.io/doc/) to become a bit more acquainted. You can provision a new LoopBack app by using `lb app` at the command line. Select version 3 and the template that includes the Notes API and in-memory datasource.

<img class="aligncenter size-full wp-image-29048" src="https://strongloop.com/wp-content/uploads/2017/03/blogpost1-1.png" alt="blogpost1" width="650" height="245" srcset="https://strongloop.com/wp-content/uploads/2017/03/blogpost1-1.png 650w, https://strongloop.com/wp-content/uploads/2017/03/blogpost1-1-300x113.png 300w, https://strongloop.com/wp-content/uploads/2017/03/blogpost1-1-450x170.png 450w" sizes="(max-width: 650px) 100vw, 650px" />

Next, we&#8217;ll create a simple service by building a model. The model will involve the most important thing you can create an API for &#8211; cats. I named it &#8220;cat&#8221; and defined three properties:

  * name (string, not required, no default)
  * age (number, not required, no default)
  * SSN (string, not string, no default)

Yes, I realize cats don&#8217;t have social security numbers, but go along for now, it will all make sense soon. Before going any further, open your [favorite code editor](https://code.visualstudio.com/) and edit `server/datasources.json`. Add the `file` property:

```js
{
  "db": {
    "name": "db",
    "connector": "memory",
    "file":"data.db"
  }
}
```

This tells the in-memory datasource to persist data to a file. While this isn&#8217;t something you would use on a live server, when testing, this lets your temporary data persist over restarts.

Fire up the server, open the explorer, and use the `POST /cats` tester to create a few cats. You don&#8217;t need many, let&#8217;s say two. Here&#8217;s a quick example to get you started:

```js
{
  "name": "Sinatra",
  "age": 8,
  "ssn": "111-11-1111"
}
```

After you&#8217;ve made a few cats, then do a quick test of the `GET /cats` endpoint to ensure you&#8217;ve got data.

<img class="aligncenter size-full wp-image-29050" src="https://strongloop.com/wp-content/uploads/2017/03/blogpost2.png" alt="blogpost2" width="650" height="511" srcset="https://strongloop.com/wp-content/uploads/2017/03/blogpost2.png 650w, https://strongloop.com/wp-content/uploads/2017/03/blogpost2-300x236.png 300w, https://strongloop.com/wp-content/uploads/2017/03/blogpost2-450x354.png 450w" sizes="(max-width: 650px) 100vw, 650px" />

## Part Two

<img class="aligncenter size-full wp-image-29074" src="https://strongloop.com/wp-content/uploads/2017/03/1m8q3b.jpg" alt="1m8q3b" width="550" height="298"  />

Alright &#8211; now that we&#8217;ve got the basic API working via LoopBack, it&#8217;s time to start working with the API Connect tooling. From the command line, first run this command:

```
apic loopback:refresh
```

This is a one time command to prepare API Connect to work with the LoopBack application. Then type:

```
apic edit
```

This will fire up the visual designer. The first time you run this, you&#8217;ll be asked to login with Bluemix. This is free, and again, a one time requirement.

<img class="aligncenter size-full wp-image-29075" src="https://strongloop.com/wp-content/uploads/2017/03/apic1.png" alt="apic1" width="650" height="530"  />

After that, you&#8217;re dropped into the main API Designer:

<img class="aligncenter size-full wp-image-29076" src="https://strongloop.com/wp-content/uploads/2017/03/apic2.png" alt="apic2" width="650" height="571" />

So, there&#8217;s quite a bit you can do here, but our first focus will just be to ensure we can run APIs via the gateway.

At the very bottom of the page, you&#8217;ll see a &#8220;Play&#8221; arrow and a status, &#8220;Stopped&#8221;, next to it. Go ahead and click the play button to start the gateway. (You can also use `apic start` in your command prompt.)

The APIs tab (which should be your current tab) represents the APIs that API Connect recognized from the LoopBack application. Clicking on it loads details for every single API supported by our application. Click the &#8220;Assemble&#8221; tab to switch.

<img class="aligncenter size-full wp-image-29077" src="https://strongloop.com/wp-content/uploads/2017/03/apic3.png" alt="apic3" width="650" height="571"  />

What you have here is a visual tool to work with policies. A policy is simply a way to define how APIs are used. LoopBack, by default, is 100% open. Any API can be used at any time. API Connect allows for much more fine grained control over API access. You can do some pretty interesting stuff including modifying results, proxying to different APIs based on input, and so on. Right now the policy simply has an &#8220;invoke&#8221; item, which means, &#8220;run an API call&#8221;. Nice and simple. Click the test button (a right-facing arrow above and to the left of the invoke item). API Connect will now prompt you to run a particular API call. This is a rather large list, but scroll down until you see `get /cats`:

<img class="aligncenter size-full wp-image-29078" src="https://strongloop.com/wp-content/uploads/2017/03/apic4.png" alt="apic4" width="650" height="571"  />

There&#8217;s a lot of options you can tweak, but for now, just scroll down that left column and click that Invoke button at the bottom.

Most likely you will get this error:

<img class="aligncenter size-full wp-image-29079" src="https://strongloop.com/wp-content/uploads/2017/03/apic5.png" alt="apic5" width="650" height="570" />

By default, the local API Connect gateway uses a fake certificate and the browser complains about it. Open that link in a new tab and select the option to accept the certificate. (This will be different depending on which browser you are using.) This is not something that will happen in production and is simply an issue you have to go through when working locally. (It bugs me too.)

If you run the invoke operation again though, you should see this:

<img class="aligncenter size-full wp-image-29080" src="https://strongloop.com/wp-content/uploads/2017/03/apic6.png" alt="apic6" width="650" height="1012" />

Woot! Notice that the result header includes information about rate limits. This is a default rule set up by API Connect out of the box and yes, you can tweak that to fit your needs. All we&#8217;ve done here though is verify that we can run the local LoopBack API via the gateway. Now let&#8217;s have some fun.

While there are multiple policy &#8220;nodes&#8221; you can add to the policy here, let&#8217;s build one from scratch! (Note, all of the code for this blog entry may be found in the GitHub repository linked at the end.) The policy we will create will remove potential &#8220;sensitive&#8221; information from APIs. It will do this by looking for a simple name match for things that are probably private. So for example, &#8220;ssn&#8221; for &#8220;Social Security Number&#8221;.

Open your favorite editor and create a new directory called `policies`. Then create a subdirectory to store the new policy we will write, `removesenstive`.

You can build pretty powerful custom policies, but for now we&#8217;ll stick to the bare minimum. We need:

  * A package.json file. This does what you expect &#8211; define dependencies for your policy.
  * A policy.yaml file. This defines &#8220;meta data&#8221; about your policy and helps API Connect render it in the editor.
  * An index.js file to define our custom logic. To be clear, your policy can have as many files as you see fit, but for our simple demo one file will suffice.

First, I&#8217;ll share the package.json file. It&#8217;s not really doing anything too interesting:

```js
{
  "name": "removesensitive",
  "version": "1.0.0",
  "main": "index.js",
  "keywords": [
    "policy",
    "api",
    "apiconnect",
    "sample"
  ],
  "author": "Raymond Camden",
  "license": "ISC"
}
```

Next, the YAML file. As I mentioned above, this is mostly metadata for the policy. It can also be used to define arguments for your policy. This lets you add a policy to your API and actually change how it operates on a case-by-base basis. For our policy, we have no arguments.

```js
policy: 1.0.0

info:
  title: Remove Sensitive Info
  name: removesensitive
  version: 1.0.0
  description: Removes possibly sensitive info
  contact:
    name: Raymond Camden
    url: https://www.raymondcamden.com
    email: rcamden@us.ibm.com

gateways:
 - micro-gateway

properties:
...
```

And finally, the actual logic of the policy:

```js
'use strict';

let BAD_KEYS = ['ssn','birthday','salary'];

module.exports = function (config) {

  return function (props, context, flow) {

    // this function is run once per transaction assuming
    // the policy is executed as part of an Assembly

    context.message.body.forEach( (ob) =&gt; {
        //loop over BAD_KEYS and delete
        BAD_KEYS.forEach( (key) =&gt; {
            delete ob[key];
        });
    });

    flow.proceed();
  }
}
```

So given that you&#8217;ve probably never seen this before, you can probably take a good guess as to what&#8217;s going on. The variable, BAD_KEYS, is simply a hard coded list. The main function is where the action takes place. `props` represents arguments passed to the policy, but as I said above, our policy doesn&#8217;t support arguments. `context` represents a context object containing everything about the current API call, and finally, `flow` is how we direct the remainder of the API call. You can see we use that at the end to carry on through the policy.

The main logic employed here is to look at the `message.body` variable. This contains our API result from getting cats. I simply loop over each cat, then loop over the bad keys, and remove them from each cat.

Fairly trivial, but now the policy is done. The final bit is to help clue in API Connect to the existence of this custom policy. In the root of the LoopBack project is a `.apiconnect` folder. There&#8217;s a config object which is current empty. Let&#8217;s modify it:

```js
{
  userPolicies: ["policies"]
}
```

As you can guess, this is how I let API Connect know where my custom policies are stored.

Ok, almost there! Back in the API Connect editor, you may need to restart the server and reload the browser, but return to the Assemble tab. You should now see your new policy in the left hand column. You can click and drag it to the right of the invoke tab:

<img class="aligncenter size-full wp-image-29085" src="https://strongloop.com/wp-content/uploads/2017/03/apic7.png" alt="apic7" width="650" height="693"  />

Finally, click to reload the gateway server. When it&#8217;s done, try invoking the Cat API again.

<img class="aligncenter size-full wp-image-29086" src="https://strongloop.com/wp-content/uploads/2017/03/apic8.png" alt="apic8" width="650" height="561" />

Voila! No SSN! And while this is a rather trivial example (which can be done in a JavaScript-policy node actually, no need for a custom policy), it hopefully gives you an idea of the control you have over your APIs with API Connect and the new open source microgateway! And, if you want to use the API Microgateway independent of API Connect, you can do so by cloning the [repo on GitHub](https://github.com/strongloop/microgateway) and following the directions on the README, or just npm install microgateway.

**Want to learn more?** You can read specifics about custom policies in the [docs](https://www.ibm.com/support/knowledgecenter/SSMNED_5.0.0/com.ibm.apic.policy.doc/capic_custpolicies_mg.html). You can find the assets for this article here: <https://github.com/StrongLoop-Evangelists/microgateway-demo-assets> and you can go star, clone, or fork the repo over at <http://github.com/strongloop/microgateway>.

**Want to contribute?** The experience around using the API Microgateway as a standalone gateway (outside of API Connect) is very much in progress and being developed in the open. [Contributors](https://github.com/strongloop/microgateway/blob/master/CONTRIBUTING.md) are welcome and appreciated!
