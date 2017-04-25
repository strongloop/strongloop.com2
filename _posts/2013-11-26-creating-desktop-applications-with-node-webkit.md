---
id: 10253
title: Creating Desktop Applications With node-webkit
date: 2013-11-26T11:05:34+00:00
author: Mike Cantelon
guid: http://strongloop.com/?p=10253
permalink: /strongblog/creating-desktop-applications-with-node-webkit/
categories:
  - How-To
---
> _**Editor&#8217;s Note:** As some of you may know, the node-webkit project was [rebranded &#8220;nw.js&#8221;](https://groups.google.com/forum/#!msg/nwjs-general/V1FhvfaFIzQ/720xKVd0jNkJ) because they are now using io.js and Chromium. This article was written long before that change. We&#8217;re working on a new article with updates examples for you, but much of the content below still applies!_<figure>

[<img class="alignnone size-full wp-image-10262" alt="sputnik" src="https://strongloop.com/wp-content/uploads/2013/11/sputnik.jpg" width="610" height="384" />](https://strongloop.com/wp-content/uploads/2013/11/sputnik.jpg)&nbsp;</p> <figcaption>[Sputnik:](http://sputnik.szwacz.com/) an open-source RSS reader desktop application created using node-webkit</figcaption> </figure> 

Web applications are useful, but there are some cases where it&#8217;s not desirable or necessary to host an application on a remote server. As [HTML5](http://www.w3schools.com/html/html5_intro.asp) provides low-level functionality to modern browsers, such as the ability to read and write files, it&#8217;s now possible to create offline, single-page, JavaScript applications using a web browser as a platform.

While browser-based unhosted applications present some interesting possibilities, such as the ability to deploy your application on multiple operating systems, there are some significant limitations.

<!--more-->

When using browsers one&#8217;s control of the user interface is limited. Some interface elements, such as pull-down menus, can&#8217;t be customized and there is usually no way to hide the browser&#8217;s address bar programatically.

Another potential issue with web applications in general is variance between browsers and browser versions. As HTML5 is still evolving, special care needs to be taken to ensure that everything works in all major browsers.

Last, but not least, most browsers are configured to be secure against malicious content. The [same origin policy](http://en.wikipedia.org/wiki/Same_origin_policy), for example, is enforced by default, preventing a site on one domain from making an AJAX call to another.

## **Enter Node-WebKit**

The [node-webkit](https://github.com/rogerwang/node-webkit) project, which was created at Intel and open sourced in 2011, is an attempt to take the pain out of offline single-page application development.

The project provides a [WebKit](http://www.webkit.org/) browser that has been extended with the the ability to control user interface elements normally off-limits to web developers. The browser&#8217;s security configuration is relaxed, assuming that the application code you&#8217;re runnning is trusted. And, most interestingly, the browser integrates [Node.js](http://nodejs.org/), allowing node-webkit applications to leverage a wide array of functionality other than what HTML5 APIs provide.<figure>

[<img class="alignnone size-full wp-image-10279" alt="The node-webkit concept" src="https://strongloop.com/wp-content/uploads/2013/11/node-webkit-concept-v4.png" width="395" height="236" />](https://strongloop.com/wp-content/uploads/2013/11/node-webkit-concept-v4.png)</figure> 

Now that you&#8217;ve got an idea what node-webkit is and what it&#8217;s useful for, let&#8217;s talk about how to install it.

## **Installation**

node-webkit can be installed on Windows, OS X, and Linux. node-webkit, like Node.js, is easy to install. The [&#8220;Downloads&#8221; section](https://github.com/rogerwang/node-webkit#downloads) on the project&#8217;s Github page supplies a number archives containing ready-to-run node-webkit binaries and software libaries they depend on.

Once you&#8217;ve download the appropriate archive, you&#8217;ll need to locate the node-webkit binary. The Linux binary&#8217;s filename is `nw`. The Window binary&#8217;s filename is `nw.exe`. In the OS X version, which comes packaged as an application bundle, the binary is in the `Contents/MasOS` folder and the filename is `node-wekit` (for example `/path/to/node-webkit.app/Contents/MacOS/node-webkit`).

To install node-webkit, simply put the folder containing your node-webkit binary in a convenient place.

## **Creating a simple application**

node-webkit applications are created in a similar fashion to conventional Node web applications. An application directory is created in which application resources &#8212; such as HTML, CSS, JavaScript, and media &#8212; are placed.

As with Node, a [package.json](https://npmjs.org/doc/json.html) file is used to describe the application.

In the `package.json` file, an element &#8220;main&#8221; specifies the first HTML page that node-webkit should display: &#8220;index.html&#8221; for example. As with a conventional single page application, the &#8220;main&#8221; HTML file must include necessary JavaScript and CSS.

The `package.json` file is also used to configure the properties of node-webkit&#8217;s default window. Below is an example of a node-webkit `package.json` file:

```js
{
  "name": "hello",
  "main": "index.html",
  "window": {
    "toolbar": false,
    "width": 800,
    "height": 600
  }
}
```

In the window specification height, width, and whether the address bar should be included can be set. node-webkit applications can even be put into a full-screen &#8220;kiosk&#8221; mode, preventing users from exiting into the host operating system.

## **Using Node Functionality**

Including Node functionality in your application is fairly straightforward. As with conventional Node applications, Node modules can be installed using [[npm]](http://npmjs.org). A [markdown](http://daringfireball.net/projects/markdown/) module, for example, could be installed using the following command:

```js
npm install markdown
```

node-webkit can include any module in your application&#8217;s `node_modules` directory by using a &#8220;require&#8221; statement, as the example below shows.

```


  
  
    
  


```

Now that you&#8217;ve learned the basics of application creation, let&#8217;s look at how your can package your application, enablnig you to run it yourself or distribute it to others.

## Packaging Your Application

Packaging is very simple: you need only create a ZIP archive. To do so use a GUI archiving tool or, if using the OS X or Linux command-line, enter the following from within your project directory:

```js
zip -r my_application.nw *
```

After zipping your application, you should rename it, giving it the extension `.nw` to indicate that it&#8217;s a node-webkit application. The zipped application can be executed using the node-webkit runtime. For example:

```js
/path/to/node-webkit my_application.nw
```

To make distribution easier, stand-alone node-webkit applications can be created. This means that application end users don&#8217;t need to install node-webkit, or even know what it is. Check out the project&#8217;s [wiki](https://github.com/rogerwang/node-webkit/wiki/How-to-package-and-distribute-your-apps) page for details.

## **Example Applications**

If node-webkit sounds like something you&#8217;d like to play with, the [nw-sample-apps](https://github.com/zcbenz/nw-sample-apps) project provides a number of example applications you can learn from and experiment with.

If you run into difficulties, a [Google Group](https://groups.google.com/forum/#!forum/nwjs-general) exists for questions and discussion about the technology. Have fun with node-webkit!

<div id="design-apis-arc" class="post-shortcode" style="clear:both;">
  <h2>
    <a href="http://strongloop.com/node-js/arc/"><strong>Develop APIs Visually with StrongLoop Arc</strong></a>
  </h2>
  
  <p>
    StrongLoop Arc is a graphical UI for the <a href="http://strongloop.com/node-js/api-platform/">StrongLoop API Platform</a>, which includes LoopBack, that complements the <a href="http://docs.strongloop.com/pages/viewpage.action?pageId=3834790">slc command line tools</a> for developing APIs quickly and getting them connected to data. Arc also includes tools for building, profiling and monitoring Node apps. It takes just a few simple steps to <a href="http://strongloop.com/get-started/">get started</a>!
  </p>
  
  <img class="aligncenter size-large wp-image-21950" src="https://strongloop.com/wp-content/uploads/2014/12/Arc_Monitoring_Metrics-1030x593.jpg" alt="Arc_Monitoring_Metrics" width="1030" height="593" />
</div>