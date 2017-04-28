---
id: 29018
title: 'What&#8217;s New in the Latest LoopBack Release &#8211; March 2017'
date: 2017-03-21T07:27:47+00:00
author: Dave Whiteley
guid: https://strongloop.com/?p=29018
permalink: /strongblog/whats-new-in-the-latest-loopback-release-march-2017/
inline_featured_image:
  - "0"
categories:
  - API Connect
---
The last LTS releases for [LoopBack](http://loopback.io/) were a couple of months ago. In January, the team updated **loopback-datasource-juggler** and **strong-remoting.**** ** The team implemented several changes into the open source framework this month as well. Curious about what the changes in the latest LoopBack release? Miroslav Bajtos provided a rundown of what&#8217;s new in the latest LoopBack release &#8211; 2.38.1 (LTS):

[<img class="aligncenter wp-image-26753 size-full" src="{{site.url}}/blog-assets/2014/07/loopback-logo-sm.png" alt="What's New Latest LoopBack Release March 2017" width="194" height="200"  />]({{site.url}}/blog-assets/2014/07/loopback-logo-sm.png)

<!--more-->

<h2>
Improve &#8220;filter&#8221; arg description
</h2>

<p>
Add an example showing how to serialize object values as JSON.
</p>

<h2>
Fix creation of verification links
</h2>

<p>
Fix User.prototype.verify to call <code>querystring.stringify</code> instead of concatenating query-string components directly.
</p>

<p>
In particular, this fixes the bug where <code>options.redirect</code> containing a hash fragment like <code>#/home?arg1=value1&arg2=value2</code> produced incorrect URL, because the <code>redirect</code> value was not correctly encoded.
</p>

<h2>
Include link to docs in logoutSessions warning
</h2>

<p>
Make it easy for people encountering the long warning about &#8220;logoutSessionsOnSensitiveChanges&#8221; to find the relevant information in our documentation.
</p>

<h2>
Preserve sessions on <code>User.save()</code> making no changes
</h2>

<p>
Fix session-invalidation code to correctly recognize the case when <code>User.save()</code> was called but neither password nor email was changed.
</p>

<p>
Modify the code detecting whether logoutSessionsOnSensitiveChanges is enabled to correctly handle the case when the model is not attached to any application, as is the case with loopback-component-passport tests.
</p>

<h2>
Fix logout to handle missing or unknown accessToken
</h2>

<p>
Return 401 when the request does not provide any accessToken argument or the token was not found.
</p>

<p>
Also simplify the implementation of the <code>logout</code> method to make only a single database call (<code>deleteById</code>) instead of <code>findById</code> + <code>delete</code>.
</p>

<h2>
Role model: resolve related models by name
</h2>

<p>
Resolve models related to the <code>Role</code> model by name instead of class instance. This allows to use <code>localRegistry</code> in <code>app</code> without monkeypatching <code>Role</code> manually.
</p>

<p>
When loading the <code>Role</code> model into a custom registry (e.g. by setting <code>localRegistry</code> to <code>true</code> when instantiating the <code>app</code> object), static roles can not be resolved because the <code>RoleMapping</code> model used inside static methods (e.g. <code>Role.isInRole()</code>) is loaded into a different registry (i.e. loopback) and thus not attached to any <code>dataSource</code>. The patch changed code resolving models related to the <code>Role</code> model to use model name instead of a global model constructor, which leads to them being resolved from the same registry that <code>Role</code> is loaded in as well.
</p>

<h2>
Fix User methods to use correct Primary Key
</h2>

<p>
Do not use hard-coded &#8220;id&#8221; property name, call <code>idName()</code> to get the name of the PK property.
</p>

<h2>
Enable remote methods to be disabled by alias
</h2>

<p>
Fix <code>disableMethodByName</code> method to allow callers to specify one of method aliases instead of the &#8220;canonical&#8221; name. For example, disable the method <code>removeById</code> by calling <code>disableMethodByName('destroyById')</code>.
</p>

<h2>
Fix content-type reported by the built-in error handler
</h2>

<p>
In order to match the body contents, the content-type is reset back to <code>application/json</code> now when a remote method sets a custom content-type (e.g. <code>image/jpeg</code>) and then fails.
</p>

<h2>
Convert object query params to JSON in outgoing requests
</h2>

<p>
When invoking a remote method via strong-remoting, fix the code building query string parameters to correctly handle edge cases like a deeply-nested empty-array value.
</p>

<p>
Consider the following invocation:
</p>

```js
Model.find({where: {id<: {inq: []}}})
```

<p>
An empty argument value was sent before the fix.
</p>

<p>
strong-remoting is sending the correct argument value now.
</p>

<h2>
Fix datasource to report connector-loading errors
</h2>

<p>
All errors used to be ignored when resolving full connector path. As a result, when the connector was installed but not correctly built (e.g. loopback-connector-db2 which uses a native addon), a very confusing message was reported by LoopBack.
</p>

<p>
We fixed the code handling <code>require()</code> errors to ignore only <code>MODULE_NOT_FOUND</code> errors that contain the name of the required module.
</p>


## What&#8217;s Next?

Want to know more about these changes? You can visit the [LoopBack github repo](https://github.com/strongloop/loopback/releases/tag/v2.38.1) for full details about these updates as well as code, the LoopBack wiki, and more.

Also, expect more announcements about LoopBack soon!
