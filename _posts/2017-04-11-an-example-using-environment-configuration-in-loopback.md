---
id: 29004
title: An Example of Using Environment Configuration in LoopBack
date: 2017-04-11T09:02:03+00:00
author: Raymond Camden
guid: https://strongloop.com/?p=29004
permalink: /strongblog/an-example-using-environment-configuration-in-loopback/
inline_featured_image:
  - "0"
categories:
  - How-To
  - LoopBack
---

One of the more interesting features of LoopBack I&#8217;ve been meaning to take a look at is its support for &#8220;environment configuration&#8221;. This is a fancy way of saying &#8220;configuration based on environment.&#8221; I&#8217;m still a Node newbie, but this is something I&#8217;ve done myself for a while now. Once again, LoopBack really shines here in doing some of the boilerplate code for us. The [docs](http://loopback.io/doc/en/lb3/Environment-specific-configuration.html) go into great detail about this feature, but I thought a simple example might be useful.

First, a reminder. LoopBack uses JSON files for various different configuration settings. In every case where there&#8217;s a JSON file, you can swap it out with a regular JavaScript file to enable dynamic configuration instead. So for example, datasources.json can also be datasources.local.js. (Note &#8211; in this case, &#8220;local&#8221; isn&#8217;t referring to any environment. The requirement for the word &#8220;local&#8221; in the file may go away soon.) This allows you to define the same values the JSON file does &#8211; but with JavaScript code. This could be useful for dynamically creating a datasource at run time. (This could lead to some fancy scenarios &#8211; so for example, trying to connect to a main database and if that fails, use a backup.)

<!--more-->

Along with supporting a .local.js file, you can also provide support for environment specific configuration files, both in JSON and JS format. By checking the NODE_ENV environment variable, LoopBack will automatically load a matching \*.ENV.json or \*.ENV.js file. To make it more specific, given a `datasources.production.js` file, this will be matched in a production environment versus `datasources.development.json`.

As a LoopBack developer, I have a few options. I could use the local file as a default, or use a file specific to development. I can also decide between simple, static configuration with a JSON file versus a more dynamic JS file. In production, I can make the same choice.

To help make this more clear, I&#8217;ve created a demo. You can find the full source for this demo here: <https://github.com/StrongLoop-Evangelists/demo-lb-env>.

I began by creating a new LoopBack application with the default Notes modal and in-memory datasource. I decided that I&#8217;d use the in-memory datasource in my local environment and a Cloudant datasource when I deployed the application to Bluemix. As an aside, while LoopBack has an &#8220;ORM-like&#8221; data abstraction layer that makes stuff like this possible, typically I&#8217;d probably recommend against having different _types_ of datasources in development versus production. Instead, I&#8217;d setup a local CouchDB instant instead. But it worked &#8211; so I&#8217;m going with it now. I made one small tweak to the local datasource &#8211; and that was to add a file property to it:

```js
{
  "db": {
    "name": "db",
    "connector": "memory",
	"file":"data.db"
  }
}
```

The next thing I did was to create a new model. I named it Cat because, of course I did. I didn&#8217;t do anything fancy with this model &#8211; I just specified three simple properties: name (string), age (number), and friendly (boolean).

Finally &#8211; I ran my local server, ensured everything was working as normal, made a new cat, and confirmed I could fetch it with a Get request:

[<img class="aligncenter wp-image-29179 size-medium" src="{{site.url}}/blog-assets/2017/04/fordave1-300x104.png" width="300" height="104"  />]({{site.url}}/blog-assets/2017/04/fordave1.png)

The next step was to create a new Node.js application in [IBM Bluemix](https://www.ibm.com/cloud-computing/bluemix/). After creating the application, I then provisioned a free-tier instance of our Cloudant service. Finally, I launched the web-based admin for Cloudant and created a database called &#8220;data&#8221;. (Very imaginative, I know.) I provisioned my server with everything I needed at this point. I just had to tell LoopBack how to use it.

Back on my machine, I began by adding the connector for Cloudant:

```
npm install --save loopback-connector-cloudant
```

Next, I created a new file, `datasources.production.js`. The JS extension lets us know we&#8217;re doing something with code here versus just simple configuration. By default, Bluemix puts all of your server data into an environment variable called VCAP_SERVICES. If you forget what this looks like, you can select the &#8220;Runtime&#8221; link in Bluemix and then the &#8220;Environmental Variables&#8221; tab.

[<img class="aligncenter wp-image-29180 size-medium" src="{{site.url}}/blog-assets/2017/04/fordave2-300x220.png" width="300" height="220"  />]({{site.url}}/blog-assets/2017/04/fordave2.png)

I then wrote my code to setup the datasource dynamically. Note that I used the same name, &#8220;db&#8221;, for my datasource. This is important since LoopBack associates a model with a particular named datasource.

```js
var env = JSON.parse(process.env.VCAP_SERVICES);

module.exports = {
	db:{
		connector:'cloudant',
		url:env['cloudantNoSQLDB'][0].credentials.url,
		database:'data'
	}
}
```

And that was it. I pushed my code up to Bluemix and confirmed that I had different data when performing requests. Here&#8217;s a cat I made in production:

```js
[
  {
    "name": "cloudant cat",
    "age": 2,
    "friendly": true,
    "id": "078ea0a0c1ff33c09623c24e2daddabe"
  }
]
```

Now I&#8217;ve got a LoopBack app that can use a development datasource on my local machine and automatically switch to production when pushed up to Bluemix. I don&#8217;t have my credentials hard-coded anywhere which means that if I need to reprovision the Cloudant instance, I probably will not have to touch any code!

## What Next?

  * Try out <a href="http://loopback.io/" target="_blank">LoopBack</a>, the highly-extensible, open-source Node.js framework.
  * Then, read this [blog post](https://strongloop.com/strongblog/working-with-file-storage-and-loopback/) by Raymond Camden and learn about file storage and LoopBack.
