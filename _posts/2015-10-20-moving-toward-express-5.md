---
id: 26208
title: Moving toward Express 5
date: 2015-10-20T06:25:55+00:00
author:
  - C. Rand McKinney
  - Hage Yaapa
guid: https://strongloop.com/?p=26208
permalink: /strongblog/moving-toward-express-5/
categories:
  - Express
---
Express 5.0 is still in the alpha release stage, but we want to give you a brief look at the changes that will be in the release and how you can migrate your Express 4 app to Express 5.

Express 5 is not very different from Express 4: The changes to the API are not as significant as from 3.0 to 4.0.  Although the basic API remains the same, there are still breaking changes; in other words an existing Express 4 program may not work if you update it to use Express 5.

<!--more-->

To install the latest alpha and preview Express 5, enter this command in your application root directory:

```js
$ npm install express@5.0.0-alpha.2 --save
```

After you do this, run your automated tests to see what fails, and fix them according to the updates listed below. You do have tests, don&#8217;t you?  This is a good example of why having tests is a good idea!  After addressing test failures, run your app to see what errors occur. You&#8217;ll find out right away if the app uses any methods or properties that are not supported.

## **Changes in Express 5**

Following is the list of changes that will affect you as a user of Express.  Currently, Express 5 is still in alpha release, so there are likely to be further changes.  We&#8217;ll make every effort to update this list as the [planned features](https://github.com/strongloop/express/pull/2237) land on the releases.

Removed methods and properties:

  * \`[app.del()](#app-del)\`
  * \`[app.param(fn)](#app-param-fn)\`
  * [Pluralized method names](#pluralized)
  * [Leading : in name for app.param(name, fn)](#app-param-name)
  * \`[req.param(name)](#req-param-name)\`
  * \`[res.json(obj, status)](#res-json-obj-status)\`
  * \`[res.jsonp(obj, status)](#res-jsonp-obj-status)\`
  * \`[res.send(body, status)](#res-send-body-status)\`
  * \`[res.send(status)](#res-send-status)\`
  * \`[res.sendfile()](#res-sendfile)\`

Changed:

  * \`[app.router](#app-router)\`
  * \`[req.host](#req-host)\`
  * \`[req.query](#req-query)\`

Improvements:

  * \`[res.render()](#res-render)\`

### **Removed methods and properties**

If you use any of these methods or properties in your app, it will crash. So, you&#8217;ll need to go through and change your app once you update to version 5.

#### **\`<a name="app-del"></a>app.del()\`**

Express 5 no longer supports `app.del()`. Using it will throw an error. For registering HTTP DELETE routes, use \`[app.delete()](http://expressjs.com/4x/api.html#app.delete.method)\` instead.

Initially del was used instead of delete considering delete is a reserved keyword in JavaScript. However, as of ECMAScript 6, delete and other reserved keywords [can legally be used as a property names](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#Reserved_word_usage). You can read the discussion which lead to the deprecation of app.del [here](https://github.com/strongloop/express/pull/2095).

#### **<a name="app-param-fn"></a>\`app.param(fn)\`**

The \`app.param(fn)\` signature was used for modifying the behavior of \`app.param(name, fn)\`. It has been deprecated since v4.11.0, and Express 5 no longer supports it at all.

#### **<a name="pluralized"></a>Pluralized method names**

The following method names have been pluralized.  In Express 4, using the old methods resulted in a deprecation warning.  Express 5 no longer supports them at all:

  * \`req.acceptsCharset()\` is replaced by \`req.acceptsCharsets()\`.
  * \`req.acceptsEncoding()\` is replaced by \`req.acceptsEncodings()\`.
  * \`req.acceptsLanguage()\` is replaced by \`req.acceptsLanguages()\`.

&nbsp;

#### **<a name="app-param-name"></a>Leading colon (:) in name for \`app.param(name, fn)\`**

A leading colon character (:) in name for \`app.param(name, fn)\` is remnant of Express 3, and for the sake of backwards compatibility, Express 4 supported it with a deprecation notice. Express 5 will silently ignore it; use the name parameter without prefixing it with a colon.

This should not affect your code, if you have been following the Express 4 documentation of [\`app.param\`](#app-param-fn), as it makes no mention of the leading colon.

#### **<a name="req-param-name"></a>\`req.param(name)\`**

This potentially confusing and dangerous method of retrieving form data has been removed. You will now need to specifically look for the submitted parameter name in \`req.params\`, \`req.body\`, or \`req.query\`.

#### **<a name="res-json-obj-status"></a>\`res.json(obj, status)\`**

Express 5 no longer supports the signature \`res.json(obj, status)\`.  Instead, set the status and then chain it to the \`res.json()\` method like this: \`res.status(status).json(obj)\`.

#### **<a name="res-jsonp-obj-status"></a>\`res.jsonp(obj, status)\`**

Express 5 no longer supports the signature \`res.jsonp(obj, status)\`.  Instead, set the status and then chain it to the \`res.jsonp()\` method like this: \`res.status(status).jsonp(obj)\`.

#### **<a name="res-send-body-status"></a>\`res.send(body, status)\`**

Express 5 no longer supports the signature \`res.send(obj, status)\`.  Instead, set the status and then chain it to the \`res.send()\` method like this: \`res.status(status).send(obj)\`.

#### **<a name="res-send-status"></a>\`res.send(status)\`**

Express 5 no longer supports the signature \`res.send(status)\`, where status is a number. Instead, use \`res.sendStatus(status)\`, which sets the HTTP response header code and sends the text version of the code: “Not Found,” “Internal Server Error,” and so on.

If you need to send a number using \`res.send()\`, quote the number to convert it to a string, so that Express does not interpret it as an attempt at using the unsupported old signature.

#### **<a name="res-sendfile"></a>\`res.sendfile()\`**

\`res.sendfile()\` has been replaced by a camel-cased version \`res.sendFile()\` in Express 5.

### **Changed**

#### **<a name="app-router"></a>\`app.router\`**

The \`app.router\` object, which was removed in Express 4, has made a comeback in Express 5. In the new version, it is a just a reference to the base Express router, unlike in Express 3, where an app had to explicitly load it.

#### **<a name="req-host"></a>\`req.host\`**

In Express 4, \`req.host\` incorrectly stripped off the port number if it was present. In Express 5 the port number is maintained.

#### **<a name="req-query"></a>\`req.query\`**

In Express 4.7 and Express 5 onwards, the query parser option can accept false to disable query string parsing, and instead use your own function for query string parsing logic.

### **Improvements**

#### **<a name="res-render"></a>\`res.render()\`**

This method now enforces asynchronous behavior for all view engines, avoiding bugs caused by view engines which had a synchronous implementation and violated the recommended interface.

## **Conclusion**

We&#8217;ve given you a quick preview of the changes that will be in the Express 5 release, and a general path to upgrade your apps.  Since version 5 is still in alpha stage, there are sure to be some further changes before the final release, so keep checking the StrongLoop blog for the latest news.  We&#8217;ll keep you updated on the progress of the 5.0 release, as well as future Express releases.
