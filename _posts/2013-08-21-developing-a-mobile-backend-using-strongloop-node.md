---
id: 1573
title: Developing a Mobile Backend Using StrongLoop Node
date: 2013-08-21T09:38:38+00:00
author: Dave Whiteley
guid: http://blog.strongloop.com/?p=1573
permalink: /strongblog/developing-a-mobile-backend-using-strongloop-node/
categories:
  - Mobile
---
_Editor&#8217;s Note: If you experience problems installing or configuring StrongLoop components, please make sure to check the [documentation](http://docs.strongloop.com/display/SL/StrongLoop+2.0) _and the_ _[Getting Started](http://strongloop.com/get-started/)_ _page for the most current instructions.__

<h2 dir="ltr">
  Overview
</h2>

<p dir="ltr">
  As many of today’s developers are finding, JavaScript is a powerful language that will allow them to solve even the most challenging problems using a common language, runtime, and toolset. With the prevalence of Node.js, MongoDB, and several mobile application frameworks, developers now have the ability to develop a complete enterprise software stack using only JavaScript.
</p>

<p dir="ltr">
  In the blog series, we will cover all of the above technologies and integrate them together to create a full stack JavaScript application.
</p>

<h2 dir="ltr">
  Introducing the Technologies
</h2>

<h3 dir="ltr">
  StrongNode
</h3>

<p dir="ltr">
  It should come as no surprise that Node.js has quickly been recognized by both small and large enterprises as a technology leader to provide robust, scalable, and feature rich backend services for web and mobile applications. Having been adopted by large companies to provide web service API’s, Node.js is here to stay as it provides a huge increase in the amount of traffic that one can serve given a smaller overall footprint than traditional web services.
</p>

<p dir="ltr">
  The problem that <a href="http://www.strongloop.com/">StrongNode</a> addresses is the lack of commercial and world class support for a Node.js distribution. When you are deploying Node.js applications and services in a production environment, StrongLoop can provide the support, resources, training, and performance monitoring that you need to ensure that your applications are robust and highly available.
</p>

<p dir="ltr">
  One of the benefits of using StrongNode is the ability to install and use trusted NPM modules that has been fully vetted for security and performance issues by the experts who know the internals of Node.js. This allows you to install, use, and deploy modules that you can trust to run your enterprise quality applications.
</p>

<h3 dir="ltr">
  MongoDB
</h3>

<p dir="ltr">
  <a href="http://www.mongodb.org/">MongoDB</a> is a one of the most popular NoSQL datastores available today. Given the ability to store and retrieve documents using the <a href="http://en.wikipedia.org/wiki/Json">JSON</a> data format, it is a perfect fit for Node.js applications as a developer can use JavaScript to query the database.
</p>

<p dir="ltr">
  MongoDB was created with scalability in mind with the concept of sharding and replica sets. The will ensure the your highly available StrongLoop Node applications will be performant not only at the application code level but also on the datastore backend.
</p>

<p dir="ltr">
  MongoDB is released under the Free Software Foundation’s <a href="http://www.gnu.org/licenses/agpl-3.0.html">GNU AGPL v3.0.</a> license and commercial support is available from the company who created and maintains the database, <a href="http://www.10gen.com/">10Gen</a>
</p>

<h3 dir="ltr">
  Titanium SDK
</h3>

<p dir="ltr">
  The <a href="http://www.appcelerator.com/platform/titanium-platform/">Titanium SDK</a> is a platform for developing cross platform mobile applications using only JavaScript that is written and maintained by <a href="http://www.appcelerator.com/">Appcelerator</a>. The Titanium SDK has bindings to interact with the native UI components of the mobile device platform of choice which allows for a native experience for the user of the mobile application.
</p>

<p dir="ltr">
  Appcelerator also provides an IDE called <a href="http://www.appcelerator.com/platform/titanium-studio/">Titanium Studio</a> to help developers of the platform be more productive. For those developers who prefer to use the command line, tools are also provided to compile your mobile applications without using the Eclipse based IDE.
</p>

<h3 dir="ltr">
  Twilio
</h3>

<p dir="ltr">
  For the sample application that we will be writing for this blog series, we will also be taking advantage of the <a href="http://www.twillio.com/">Twilio</a> platform for handling communication via SMS text messages. The Twilio platform enables developers to include routing of phone calls, VoIP, and messages into web, mobile, or desktop applications. The platform provides a rich <a href="http://www.twilio.com/docs/client/twilio-js">JavaScript library</a> to make interacting between StrongLoop Node and Twilio a snap.
</p>

<h2 dir="ltr">
  Downloading and Installing StrongNode
</h2>

<p dir="ltr">
  To get started with our sample application, the first thing we need to do is download and install the latest release of the StrongNode distribution. Point your browser the <a href="http://www.strongloop.com/products">download page</a> and begin the download process by entering in your email address and selecting the operating system that you will be using for development.
</p>

<p dir="ltr">
  <img src="https://lh4.googleusercontent.com/qTM-1vgNvipbMW2ASfxOUUQZOUtVZ-q_q0tInvMA4dsz2VLozArLGG66aJ987jJ3A1fQ90gCzuPUn-e21j4XcBk4_WC6qoxtiOzUfqnt3Ahdy-uKgH48ps3ROg" alt="" width="640px;" height="237px;" />
</p>

<p dir="ltr">
  Note: For this blog series, I will be using Mac OS X but the instructions and command line tools should be portable across the various supported operating systems.
</p>

<p dir="ltr">
  Once your download has completed, click on the .pkg file to begin the installation process.
</p>

<p dir="ltr">
  <img src="https://lh3.googleusercontent.com/14o-njbamanQ4ESMn4Km5kEpiMVFjmeuVqN7ucDCGv4o9Ol4rfMSRdNQDOt1C4fREOxhPNMHlw4tLecXvBDZmziViH1utoeOyo24DhZLw8mvVwCOlNtXj5f34g" alt="" width="263px;" height="84px;" />
</p>

<p dir="ltr">
  Follow the onscreen instructions to install StrongNode (node, npm, and slc).
</p>

<p dir="ltr">
  <img src="https://lh5.googleusercontent.com/OkGL1IoT2pDqdUew2VQmA1zbpPEh1l58_OxEZ1_sKOww8UoJ-cshu-951OfC1butFX84wFj5tZyifPI1SE3mBiU2VKP6vtmDha476Sa7mjmRCyHNNR_3AXQ6jg" alt="" width="640px;" height="483px;" />
</p>

<p dir="ltr">
  Pretty simple, huh? You now have an enterprise ready and trusted distribution of Node.js ready for you to begin development with.
</p>

<h2 dir="ltr">
  Creating the StrongNode application
</h2>

<p dir="ltr">
  One of the many benefits of using StrongNode is the ability to take advantage of the convenient command line utilities to quickly create applications that are stubbed out for building backend REST services. Given that we are going to be using MongoDB as our datastore, we can take advantage of the <a href="http://mongoosejs.com/index.html">Mongoose</a> library that the StrongNode distribution provides. To create our web application, enter in the following command:
</p>

```js
$ slc create web mobilebackend -m -r
```

<p dir="ltr">
  What just happened?
</p>

<p dir="ltr">
  Let’s take a closer look at the command above and fully explain each option:
</p>

<p dir="ltr">
  slc : This is the binary that StrongLoop provides to interact with the distribution. All actions that you want to perform using StrongNode will use this binary. slnode will accept many arguments and for the full list, simply enter in the following command: $ slc -h
</p>

<p dir="ltr">
  slc create : The first argument that we pass in is create. This will notify the distribution that we want to perform the create action followed by the type of resource that we want to create. At the time of this writing, the available types to create are cli, module, package, or web.
</p>

<p dir="ltr">
  slc create web : We specify that we want to create an express application for creating our REST based services.
</p>

<p dir="ltr">
  slc create web mobilebackend : After specifying that we want to create an express based application, we give the application the name of mobilebackend. You can provide any name that you want your application to be.
</p>

<p dir="ltr">
  slc create web mobilebackend -m : The -m option will install and configure Mongoose support so that we can interact with the MongoDB database that we will create later in this blog series.
</p>

<p dir="ltr">
  slc create web mobilebackend -m -r : We finally add the -r option which will add REST apis for any Mongoose models that we create.
</p>

<h2 dir="ltr">
  Testing your application
</h2>

<p dir="ltr">
  After the create application command has finished, we have a fully functioning application created for us to start development with. Before we move any further, we should verify that everything went smoothly by running the application using the slc command. To start the application, change to the application directory and start the server using the following command from a terminal prompt:
</p>

```js
$ cd mobilebackend
$ slc app.js
```

<p dir="ltr">
  Unless you already have MongoDB installed locally, you will see an error message indicating that the mobilebackend application could not connect to [localhost:27017]. This is expected. Point your browser to the following URL to test the application:
</p>

<p dir="ltr">
  http://localhost:3000
</p>

<p dir="ltr">
  If the server started correctly, you should see the following page:
</p>

<p dir="ltr">
  <img src="https://lh4.googleusercontent.com/M4T-97gQJr3Rft1cXI22-r2FPl_jIixQyNxIHf0hc6ChJibHDmViCUH-XSQB_z04GjrrjCpuOq83a-qC-TByAVxnTKImHhrEbt_tbQwkFND8m7Sck2FKWTYrug" alt="" width="640px;" height="407px;" />
</p>

<p dir="ltr">
  Congratulations, you have just created and deployed an application that supports MongoDB, Mongoose, and REST APIs using the StrongLoop distribution.
</p>

<p dir="ltr">
  Understanding the Default Application
</p>

<p dir="ltr">
  To fully understand a default StrongNode created application, let’s examine all the pieces that were created for our application and explain what each one is used for.  If you change to your mobilebackend directory, you should see the following files and directories:
</p>

<p dir="ltr">
  -rw-r&#8211;r&#8211;   app.js
</p>

<p dir="ltr">
  The app.js file, located in your application root directory, is the bootstrap file that sets up and configures your application.  This is also where some default dependencies are required such as express, http, and path.  This is a pretty standard app.js file that creates a HTTP server to handle requests and sets up default routes.
</p>

<p dir="ltr">
  drwxr-xr-x  db
</p>

<p dir="ltr">
  The db directory is the location for &#8212; you guessed it &#8212; configuration files to specify the location of the MongoDB datastore that you want to connect to.  Go ahead and leave the defaults for now as we will be setting up MongoDB later in this blog series.  When we are ready to connect to our database, we will be modifying the config.js file in this directory.
</p>

<p dir="ltr">
  drwxr-xr-x models
</p>

<p dir="ltr">
  The models directory is where your Mongoose models should be created.  By default, a User model was created as an example to explain the syntax while creating new ones.
</p>

<p dir="ltr">
  drwxr-xr-x  node_modules
</p>

<p dir="ltr">
  The node_modules directory is where any modules that you have added as dependencies for your application will be stored.  Module dependencies are specified in the package.json file.  For the most part, you can ignore this directory as we will not need to use it with the sample application that we are going to write for this blog series.
</p>

<p dir="ltr">
  -rw-r&#8211;r&#8211;    package.json
</p>

<p dir="ltr">
  Most modern programming languages offer a dependencies resolution mechanism to allow developers to depend on and include third party libraries.  For Node.js, that mechanism is the package.json file.  If you take a look at the default file that StrongLoop Node created for us, you will notice the distribution has included dependencies to allow us to use the Express Framework, interact with MongoDB, and other useful APIs.
</p>

<p dir="ltr">
  At the time of this writing, there are over 30,000 available NPM Modules that you can include in your application to quickly take advantage of existing functions to speed up your application development.
</p>

<p dir="ltr">
  drwxr-xr-x  public
</p>

<p dir="ltr">
  This is where the default stylesheet for our application is located.
</p>

<p dir="ltr">
  drwxr-xr-x  routes
</p>

<p dir="ltr">
  The resource.js file in the routes directory is where the basic create, read, update and delete (CRUD) methods are defined for any Mongoose Model Objects that we create.  By default, the following functions are available for any model that you create:
</p>

<li dir="ltr">
  create
</li>
<li dir="ltr">
  list
</li>
<li dir="ltr">
  findByID
</li>
<li dir="ltr">
  deleteById
</li>
<li dir="ltr">
  updateById
</li>

<p dir="ltr">
  Having these basic functions available to any model object that you create is a significant advantage in that you can reduce the amount of code you have to write and maintain for common database operations.  If you need more complex queries or if you need to specify the sort order for a result set, you will need to create your own functions to handle those queries.
</p>

<p dir="ltr">
  drwxr-xr-x  views
</p>

<p dir="ltr">
  The views directory is where the views for your application will be stored.  By default, our views will use the EJS templating system.  For more information about the powerful templating system, head over to the project <a href="http://embeddedjs.com">website</a>.
</p>

<h2 dir="ltr">
  Conclusion
</h2>

<p dir="ltr">
  In this blog post, we discovered how to install the StrongNode distribution.  We also learned how to create a web application that is pre-wired for connection to MongodB, using Mongoose, and also has the ability to quickly create REST based web services.
</p>

<p dir="ltr">
  In the next post, we will create our own REST web service and connect the application to a MongoDB Database.
</p>

## **What’s next?**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js <a href="http://strongloop.com/node-js/loopback/">LoopBack framework</a>. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
</li>