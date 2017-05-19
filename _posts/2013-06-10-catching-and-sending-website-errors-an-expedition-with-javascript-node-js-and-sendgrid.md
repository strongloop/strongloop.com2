---
id: 630
title: 'Catching and sending website errors: An expedition with JavaScript, Node.js and SendGrid'
date: 2013-06-10T05:55:49+00:00
author: admin
layout: post
guid: http://blog.strongloop.com/?p=630
permalink: /strongblog/catching-and-sending-website-errors-an-expedition-with-javascript-node-js-and-sendgrid/
categories:
  - How-To
---
Catching client-side javascript errors on your website and sending them back to yourself is one of the best ways to ensure your website functions properly for all your visitors. On top of that it&#8217;s kind of fun; when you have an entire network of end-users actively using your site, you can tap into a lot of power. When an edge case rears its head, it&#8217;s a fun expedition. &#8220;How did _that_ error get thrown?&#8221;

We&#8217;ll show how we&#8217;ve created the client-error feedback loop for StrongLoop and how it&#8217;s paid off in spades. Let&#8217;s dive in.

## Step 1: Catching errors

The client-side JavaScript that follows catches errors on your site that occur from JS code.

```js
window.onerror = function(errorMsg, url, lineNumber) {
    // Do something with the error here
};
```

The arguments are, in order:

  1. The error message
  2. URL where the error occurred (either in-page or from another file)
  3. Line number where the error was raised

You can check out the [full spec at MDN](https://developer.mozilla.org/en-US/docs/Web/API/window.onerror).

We catch the error and POST it to our server, using jQuery. We&#8217;ve included an extra parameter `` `url` `` to tell the server what page the visitor was on when the error occurred.

```js
window.onerror = function(errorMsg, url, lineNumber) {
    $.ajax('/_jserror', {
        type: "POST",
	data: {
            message: errorMsg,
            fileName: url,
            lineNumber: lineNumber,
            url: window.location.protocol + "//" + window.location.host + "/" + window.location.pathname
        }
    });
};
```

## Step 2: Receiving errors on the server

At StrongLoop we use the [Express web server](http://expressjs.com), which means you would receive the POST request like so:

```js
app.post("_jserror", function(req, res) {

});
```

Express automatically fills up `` `req.body` `` with the variables we passed from the client. So we have:

  * `req.body.message`
  * `req.body.fileName`
  * `req.body.lineNumber`
  * `req.body.url`

We&#8217;re going to take this information and send it to ourselves via e-mail. I set up an account with [SendGrid](http://sendgrid.com) and for the amount of error e-mails we send a day, the free tier works just fine. It&#8217;s also incredibly convenient that SendGrid has an officially supported [Node.js client](https://github.com/sendgrid/sendgrid-nodejs) you can install with NPM (`` `npm install sendgrid` ``). Check out the library usage docs on their [GitHub page](https://github.com/sendgrid/sendgrid-nodejs).

When sending the details via e-mail, we want more than just what we received from the client. It&#8217;s convenient to know the user-agent string (browser information, so we know which browser to reproduce the error on) and, in the case of StrongLoop&#8217;s needs, the cookie data. Those pieces of data are in the request headers.

The final code:

```js
app.post("_jserror", function(req, res) {
    if (req.body && req.body.fileName && req.body.lineNumber && req.body.url && req.body.message) {
        var text = "CLIENT ERROR: " + req.body.message + " at  " + req.body.fileName
            + ":" + req.body.lineNumber + "nnurl:t" + req.body.url
            + "nnua:t" + req.headers['user-agent'] + "ncookies: "
            + req.headers['cookie'] + "nnhost:t" + req.headers['host'];

        sendgrid.sendEmail("to@yourdomain.com", "from@yourdomain.com",
            "Website error", text);
        return res.send("ok");
    } else {
        res.status(400);
        return res.send("Improper format");
    }
});
```

## Improvements

The client-side code doesn&#8217;t record a stacktrace, nor does it catch user behavior like mouse clicks or keydowns. In my experience, running the simple error catch is enough to describe the vast majority of problems and lead you on the path to error resolution. In more mission-critical applications, building at least a sophisticated stack-tracing mechanism would be very insightful.

In addition there is no throttling control. This can lead to a waterfall of errors pouring in, like during a recent incident:

[<img class="alignnone size-full wp-image-677" alt="Client-Error-reporting" src="{{site.url}}/blog-assets/2013/06/Client-Error-reporting.jpg" width="800" height="385" />]({{site.url}}/blog-assets/2013/06/Client-Error-reporting.jpg)

For the most part, this technique has worked remarkably well. Even as our traffic has increased dramatically, we have been able to hunt down and eliminate a bevy of bugs and now it is quite rare when a new error trickles in. Side benefit: we are even better JavaScript programmers!
