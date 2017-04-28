---
id: 1624
title: 'Developing a Mobile Backend Using StrongNode &#8211; Part 2'
date: 2013-08-29T11:11:53+00:00
author: Dave Whiteley
guid: http://blog.strongloop.com/?p=1624
permalink: /strongblog/developing-a-mobile-backend-using-strongloop-node-part-2/
categories:
  - Mobile
---
## Overview 

<p dir="ltr">
  In <a href="http://blog.strongloop.com/developing-a-mobile-backend-using-strongloop-node/">part 1</a> of this blog series we discussed the technologies that we will be using to create an SMS aware mobile application with a node.js backend: <a href="http://www.strongloop.com">StrongNode</a>, <a href="http://www.mongodb.org">MongoDB</a>, <a href="http://www.appcelerator.com">Titanium</a>, and <a href="http://www.twilio.com">Twilio</a>.  We also created our first StrongNode application called mobilebackend and deployed the application to our local running slnode server.  In this blog post, we will take a deeper look at the source code and create a REST API for storing and retrieving information for our mobile application.  We will also learn how to create a MongoDB datastore using the popular MongoLab service which provides free MongoDB hosting in the public cloud.
</p>

## Signing up for MongoLab

<p dir="ltr">
  Given the vastly different ways to install MongoDB on different operating systems, which is beyond the scope of a this blog series, we will be using a quick and easy way to have our own private MongoDB instance in the cloud.  We will be using a service provided by <a href="http://www.mongolab.com">MongoLab</a>.
</p>

<p dir="ltr">
  MongoLab provides the ability to create a MongoDB datastore that is publicly accessible for no cost.  They offer this no cost database as a way to try out their database hosting service to ensure that it meets your needs as your application grows.  MongoLab is a very robust and stable service and I use them on a daily basis.
</p>

<p dir="ltr">
  For the purposes of the application that we are writing for this blog series, the free tier that they provide will meet our needs as we do not need replication or sharding and fall within the 512mb file system size they provide for the free plan.
</p>

<p dir="ltr">
   Signing up is free and easy.  Simply point your browser over to their <a href="http://www.mongolab.com">website</a> and enter in your username, email, and password that you want to use.  Once you have completed the signup process, you will be presented with the following screen:
</p>

<img alt="" src="https://lh6.googleusercontent.com/y4OYN_PjIw4ikmPfkC2eTDxc3Sn2ormwLyiUVDOEtuPH-_J0kS4VvYvVmawQNd2bu8aHVgAGvpHQNQtQ0ua43XkYupAP7O7FI86wQLc9NnBJ0Vp8t9v_3ZdeTA" width="640px;" height="233px;" />

<p dir="ltr">
  Click on the create new database button and select the hosting provider and location for your MongoDB database.  I will be using AWS in the East region but you should use whichever location makes sense for your deployment.  Name your databases mobilebackend and click create on the bottom right hand side of the screen.
</p>

<img alt="" src="https://lh3.googleusercontent.com/vJKiFeCW0O7j5C9Yn35jsjW1uTzJVHyqSJPKD3JRqLM2IhmMVfM_xC_AvgdUf8KiujnF-fcbGxIYVlsiX0ZbGTf69d-RYSyMdDNIer2dMI3L_HkCatH4e2LJNw" width="640px;" height="692px;" />

<p dir="ltr">
  After your database has been created, click on the database name and you will be prompted to create a user that can authenticate and use the newly created database.
</p>

<img alt="" src="https://lh6.googleusercontent.com/V13Gi1xxYWz1yAdb2J4tsJ1pgUh7JILHDFyhisj_iAI2q766upS-erlx_61YRj9ZJV4h412IRdSOmPB9M7Fq7i4m5jxEuCEdFxfi-GhBewtxPfUArlTh9wyNpA" width="300px;" height="368px;" />

<p dir="ltr">
  Once you have a user created, make a note of the connection settings that are provided to you at the top of the screen.  We will be using this information to configure our StrongNode application to allow it to communicate with the database.
</p>

<img alt="" src="https://lh4.googleusercontent.com/HR7XtwdQ661ior2yPj06X6rL07ikCtpF0Xfv1BGnDTnPycCvgma__aqzta9Xa4fqtFbqTA0ycb7W9KtESGGn05MtuBN7vlMkGepvbWdwAR5RTcMYmAcSBlWwCQ" width="640px;" height="189px;" />

## Configuring our application for MongoDB

<p dir="ltr">
   If you recall from <a href="http://blog.strongloop.com/developing-a-mobile-backend-using-strongloop-node/">part 1</a> of this series, the db directory inside of your mobilebackend application is where we place database configuration settings.  Edit the mobilebackend/db/config.js file and enter in the connection settings for your database that you created using MongoLab.  As a reference, the config.js file for my database looks like the following:
</p>

<img alt="" src="https://lh4.googleusercontent.com/giGNDC8UXBBzILs2e68OE73it_TOY36aabg6oUMRNGgc4u8KiWphKsXDvCxZ-7uPbmucvEZQTAredtRSCC922e5LXtJkkTbe-fmCZ8jp2fR7IaF--AAuQRmuJg" width="300px;" height="143px;" />

<p dir="ltr">
  Make sure to change the values to the correct ones for your database.
</p>

## Testing the Database Connection

<p dir="ltr">
  Before we move any further, we should verify that everything went smoothly by running the application using the slc command. To start the application, change to the application directory and start the server using the following command from a terminal prompt:
</p>

```js
$ cd mobilebackend
$ slc app.js
```

<p dir="ltr">
  Once you start the server and your application, you should see the following message on your terminal prompt:
</p>

```js
mobilebackend listening on port 3000
MongoDB connection opened
```

## Signing up for Twilio

<p dir="ltr">
  During <a href="http://blog.strongloop.com/developing-a-mobile-backend-using-strongloop-node/">part 1</a> of this series, we introduced Twilio and discussed how we will be using it to provide SMS capabilities to our application. The first thing we need to do is signup for an account at their <a href="http://twilio.com">website</a>. Head on over to twilio.com and click the sign up button and enter in your information.
</p>

<img alt="" src="https://lh3.googleusercontent.com/cPcJye4-lqZ5TzgFl8wswIISoPhNxlMuXsaQKbaS0usM0ne-OaOHPRIZKDeaDLnymEml1dKmPAUA_swAr-fUqVqLnsKBlij-SSx-VBYrzNslM82dmEgVNi-AGw" width="640px;" height="366px;" />

<p dir="ltr">
  Once you create an account and click the validation link, Twilio will want to verify that you are a human being that is signing up for their service. They will send you a text message to your mobile phone with a verification code that you need to enter to confirm your account creation. Once you receive this message, enter it in via the dialog provided on their website.
</p>

<img alt="" src="https://lh5.googleusercontent.com/MGq5ECFWIj-l3RYjAde2cVE1G6-WwSuPIOKKtZmeqlLaCIybIRZExu0Av6Njka4GOpP2XN1KENYmCWyj-2p6aUyl7sOt54QuDiNXEaIFEeVa7a79KvUKOsdNNw" width="500px;" height="223px;" />

<p dir="ltr">
  Once you confirm your account, you will be assigned a twilio number.
</p>

<p dir="ltr">
  Click on the Get Started link and then Numbers at the top of the screen.  At this point, you can manage the endpoints, or URL(s), that will get called when someone calls or sends a SMS message to the phone number that Twilio assigned to you.
</p>

<p dir="ltr">
  Update the Messaging Request URL parameter with the publicly available URL for your application. For instance, if your domain name is example.com, you could use the following URL:
</p>

```js
<a href="http://www.example.com/rest/smsmessage">http://www.example.com/rest/smsmessage</a>
```

<p dir="ltr">
  Note: We have been using the localhost system for this blog post. When you are integrating your application with Twilio, you will need to ensure that your application is available via a public URL. If you do not have one accessible, it is suggested that you chose a PaaS for your application deployment. For tips on which PaaS to use, please refer to this <a href="http://blog.strongloop.com/a-comparison-of-node-js-paas-hosting-providers/">blog post</a> which compares Node.js support among different providers.
</p>

<p dir="ltr">
  That’s all there is to it to configure Twilio to communicate with our application. From now on, whenever your phone number receives an SMS message, the message will be forwarded to the /rest/smsmessage URL that you provided. Now we need to create the REST endpoint to handle the message.
</p>

## Creating our REST services

<p dir="ltr">
  Now that we have our application stubbed out, the connection to our database working properly, and our twilio account and number created, we can begin to create our REST based web services. The first service that we want to create is the ability to write SMS messages that we receive to our phone number to our MongoDB database.  Create a new file called sms.js under the models directory and enter in the following code:
</p>

```js
/**
 * sms model
 */

module.exports = function(options) {
  options = options || {};
  var mongoose = options.mongoose || require('mongoose')
  , Schema = mongoose.Schema;

  var SMSSchema = new Schema({
    FromCity : {
      type : String
    },
    FromState : {
      type : String
    },
    Body : { type : String},
    date: { type: Date, default: Date.now }
  });

  var SMSMessage = mongoose.model("smsmessage", SMSSchema);
}
```

<p dir="ltr">
  Given the information we covered in the previous <a href="http://blog.strongloop.com/a-comparison-of-node-js-paas-hosting-providers/">blog post</a>, we learned that by default, StrongNode creates all of the CRUD operations for our model objects.  Because of this, we do not need to create an additional function that will communicate with the MongoDB database to save our incoming SMS message.
</p>

<p dir="ltr">
  Now that we have the REST web service to save an incoming SMS message to our MongoDB database, we need an endpoint that will allow us to retrieve a list of all the SMS messages that we have saved.  Fortunately, the code to achieve this is also provided by the default CRUD operations provide by StrongNode.
</p>

<p dir="ltr">
  Save and then restart your node application using the following command:
</p>

```js
$ slc app.js
```

## Testing our REST services

<p dir="ltr">
  To test that our SMS messages are being saved to the database, pull out your mobile phone and send an SMS message to the provided twilio number.
</p>

<p dir="ltr">
  Once you have sent an SMS message, point your browser to the following URL, replacing example.com with the correct domain name for your application.
</p>

```js
<a href="http://sl-onpaas.rhcloud.com/rest/smsmessage">http://yourDomainName.com/rest/smsmessage</a>
```

<p dir="ltr">
  You should see all of the SMS messages that you sent to your twilio number.
</p>

## Conclusion

<p dir="ltr">
  In this blog post we signed up for a Twilio account, configured our phone number, and pointed the phone number to call an endpoint when it receives an SMS message.  We also created a Mongoose Model object that defines the data we want to store for any incoming SMS message.  We used the provided CRUD operations from StrongNode to create and read incoming messages.  In the next post we will write a mobile application for both Android and iOS that will display all incoming message to our Twilio number.
</p>

## **[What’s next?](http://strongloop.com/get-started/)**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What’s in the upcoming Node v0.12 release? <a href="http://strongloop.com/node-js/whats-new-in-node-js-v0-12/">Six new features, plus new and breaking APIs</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js <a href="http://strongloop.com/node-js/loopback/">LoopBack framework</a>. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Need <a href="http://strongloop.com/node-js-support/expertise/"]]>training and certification</a> for Node? Learn more about both the private and open options StrongLoop offers.</span>
</li>