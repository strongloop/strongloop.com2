---
id: 8456
title: Using a Digital Ocean Droplet for On Demand Node.js Mobile Backend
date: 2013-10-30T09:08:47+00:00
author: Matt Schmulen
guid: http://strongloop.com/?p=8456
permalink: /strongblog/using-a-digital-ocean-droplet-for-on-demand-node-js-mobile-backend/
categories:
  - How-To
---
<a href="https://github.com/mschmulen/ios-mobile-server-with-node-and-digitalocean/raw/master/screenshots/splash700x400.png?raw=true" target="_blank"><img alt="Image" src="https://github.com/mschmulen/ios-mobile-server-with-node-and-digitalocean/raw/master/screenshots/splash700x400.png?raw=true" /></a>

The tagline &#8220;Digital Ocean provides blazing fast SSD cloud servers at only $5/month&#8221; does not do Cloud provider Digital Ocean justice.

In addition to the performance of the server instance (a droplet in Digital Ocean lingo), Digital Ocean has become a favorite of developers for the following reasons:

  *  <span style="font-size: medium;">low cost performance</span>
  *  <span style="font-size: medium;">Droplets standup fast, very fast ( 59 seconds fast )</span>
  *  <span style="font-size: medium;">Static external IP address for every droplet</span>
  *  <span style="font-size: medium;">Droplet&#8217;s disk, RAM, and IP address are all reserved while the droplet is off</span>
  *  <span style="font-size: medium;">Snapshot feature allows you to save the droplet after you have destroyed the instance.</span>
  *  <span style="font-size: medium;">Preserving costs and making for a fast standup of your configuration for developer Sandbox preserving costs)</span>
  *  <span style="font-size: medium;">You will be able to create a new droplet from the snapshot image anytime to bring it back online.</span>

## <a href="https://github.com/mschmulen/ios-mobile-server-with-node-and-digitalocean#creating-and-configuring-your-digital-ocean-virtual-machine" name="creating-and-configuring-your-digital-ocean-virtual-machine"></a>Creating and Configuring your Digital Ocean Virtual Machine

  1.  <span style="font-size: medium;">Login to <a href="https://www.digitalocean.com/?refcode=d58fefe584fa">Digital Ocean</a> and Create your droplet in less than a minute. <a href="https://github.com/mschmulen/ios-mobile-server-with-node-and-digitalocean/raw/master/screenshots/digitalOceanPostLogin.png?raw=true" target="_blank"><img alt="Image" src="https://github.com/mschmulen/ios-mobile-server-with-node-and-digitalocean/raw/master/screenshots/digitalOceanPostLogin.png?raw=true" /></a></span>
  2.  <span style="font-size: medium;">Configure your host name <a href="https://github.com/mschmulen/ios-mobile-server-with-node-and-digitalocean/raw/master/screenshots/digitalOceanConfigHostName.png?raw=true" target="_blank"><img alt="Image" src="https://github.com/mschmulen/ios-mobile-server-with-node-and-digitalocean/raw/master/screenshots/digitalOceanConfigHostName.png?raw=true" /></a></span>
  3.  <span style="font-size: medium;">Select your configration size. <a href="https://github.com/mschmulen/ios-mobile-server-with-node-and-digitalocean/raw/master/screenshots/digitalOceanConfigSize.png?raw=true" target="_blank"><img alt="Image" src="https://github.com/mschmulen/ios-mobile-server-with-node-and-digitalocean/raw/master/screenshots/digitalOceanConfigSize.png?raw=true" /></a></span>
  4. <span style="font-size: medium;">Select your region. <a href="https://github.com/mschmulen/ios-mobile-server-with-node-and-digitalocean/raw/master/screenshots/digitalOceanConfigRegion.png?raw=true" target="_blank"><img alt="Image" src="https://github.com/mschmulen/ios-mobile-server-with-node-and-digitalocean/raw/master/screenshots/digitalOceanConfigRegion.png?raw=true" /></a></span>
  5.  <span style="font-size: medium;">Select your Image, in this walk through I will create it from Linux Ubuntu 12.04 x32. However you can start from an &#8220;Application&#8221; image such as Docker or WordPress, or from one of your own &#8220;SnapShot&#8221; image ( these are great for standing up a dev stage fast). <a href="https://github.com/mschmulen/ios-mobile-server-with-node-and-digitalocean/raw/master/screenshots/digitalOceanConfigImage.png?raw=true" target="_blank"><img alt="Image" src="https://github.com/mschmulen/ios-mobile-server-with-node-and-digitalocean/raw/master/screenshots/digitalOceanConfigImage.png?raw=true" /></a></span>
  6.  <span style="font-size: medium;">Count to 60. <a href="https://github.com/mschmulen/ios-mobile-server-with-node-and-digitalocean/raw/master/screenshots/digitalOceanCreating.png?raw=true" target="_blank"><img alt="Image" src="https://github.com/mschmulen/ios-mobile-server-with-node-and-digitalocean/raw/master/screenshots/digitalOceanCreating.png?raw=true" /></a></span>

## <a href="https://github.com/mschmulen/ios-mobile-server-with-node-and-digitalocean#standing-up-your-nodejs-mobile-services-with-strongloop" name="standing-up-your-nodejs-mobile-services-with-strongloop"></a>Standing up your Node.js mobile services with StrongLoop

<a href="https://github.com/mschmulen/ios-mobile-server-with-node-and-digitalocean/raw/master/screenshots//digitalOceanActive.png?raw=true" target="_blank"><img alt="Image" src="https://github.com/mschmulen/ios-mobile-server-with-node-and-digitalocean/raw/master/screenshots//digitalOceanActive.png?raw=true" /></a>

Now that your Virtual Machine droplet is up, check your email for your login, password and IP Address. The email will look like:

    Yay! Your new Droplet has been created!
    
    You can access it using the following credentials:
    
    IP Address: 192.111.111.111
    Username: root
    Password: yanyyyyyvh
    

  1. <span style="font-size: medium;"><span style="font-size: medium;"> From the terminal ssh to your new instance with `ssh root@192.111.111.111&#8242; and the password provided.</span></span> 
        Welcome to Ubuntu 12.04 LTS (GNU/Linux 3.2.0-24-virtual i686)
        
        * Documentation:  https://help.ubuntu.com/
        Last login: Fri May  3 18:28:34 2013
        root@MobileServices:~#
        

  2.  <span style="font-size: medium;">Now let&#8217;s configure the server with the StrongLoop Node distro, to make this step easier I created a small <a href="https://github.com/mschmulen/ios-mobile-server-with-node-and-digitalocean/blob/master/install.sh">install script</a> to install dependencies get you up quickly.</span>

The script will update apt-get and install some of the usual suspects: python-software-properties, vim git subversion curl , memcached, build-essential, etc ( feel free to modify for your specific configurations) s. Additionally it will download and install the latest StrongLoop Debian distro from[StrongLoop](https://github.com/mschmulen/ios-mobile-server-with-node-and-digitalocean/blob/master/StrongLoop.com). Finally the script will create a /var/apps folder for you to hold your Node applications.

To run the script on your server:

  1.  <span style="font-size: medium;">copy the contents of <a href="https://github.com/mschmulen/ios-mobile-server-with-node-and-digitalocean/blob/master/install.sh">script.sh</a> to your copy buffer with CMD+Copy</span>
  2.  <span style="font-size: medium;">From the terminal you can simply &#8216;wget <a href="http://raw.github.com/mschmulen/ios-mobile-server-with-node-and-digitalocean/master/install.sh">http://raw.github.com/mschmulen/ios-mobile-server-with-node-and-digitalocean/master/install.sh</a>&#8216; Just copy past the script to your command line with.</span>
  3. <span style="font-size: medium;"><span style="font-size: medium;"> &#8230;and then run the command with &#8216;chmod +x script.sh; ./script.sh&#8217;</span></span> 
      1.  <span style="font-size: medium;">Stand Up your LoopBack Mobile Server with the following commands</span>

<div>
  ```js
cd /var/apps

slc lb project loopback-server
cd loopback-server
slc lb model product
slc lb model store
slc lb model customer
slc install
```js
</div>

You can verify the installation by starting your server with &#8216;slc run app.js&#8217; and open a web browser on your local machine to the servers address and the default port <http://192.111.111.111:3000/explorer>

Now that you have a LoopBack mobile server with mobile models for product, store, and customer you can use them from your mobile application development workflow.

## <a href="https://github.com/mschmulen/ios-mobile-server-with-node-and-digitalocean#integrating-your-native-ios-app" name="integrating-your-native-ios-app"></a>Integrating your Native iOS App

<a href="https://raw.github.com/strongloop-community/loopback-examples-ios/master/screenshots/sample-examples-ios-all.png" target="_blank"><img alt="image" src="https://raw.github.com/strongloop-community/loopback-examples-ios/master/screenshots/sample-examples-ios-all.png" /></a>

Now we can integrate a mobile application with our Digital Ocean SSD virtual machine and the[LoopBack Node API server](http://docs.strongloop.com/loopback/) using the [native LoopBack iOS SDK](http://docs.strongloop.com/loopback/#ios-api).

The best part is we don&#8217;t even need to install Node or LoopBack on our local dev machine ( although this is useful if you want to run your development cycle on your local box when your disconnected from the network ). You can download the iOS Framework SDK directly from ([http://github.com/strongloop-community)[http://github.com/strongloop-community/loopback-ios-sdk]](http://github.com/strongloop-community)%5Bhttp://github.com/strongloop-community/loopback-ios-sdk%5D) and start with your process.

  1.  <span style="font-size: medium;">Clone the iOS example apps on your local machine</span>

<div>
  ```js
git clone git@github.com:strongloop-community/loopback-examples-ios.git
```js
</div>

  1.  <span style="font-size: medium;">Open the TableView example in XCode (you should also checkout the MapView and Remote Procedure projects as well).</span>

You can open the XCode project with the following command on your local dev machine.

<div>
  ```js
open loopback-examples-ios/ios-tableview-simple-example/tableview-example.xcodeproj
```js
</div>

  1.  <span style="font-size: medium;">Update the endpoint URL to match your newly instantiated Digital Ocean virtual machine IP address, by modifying the AppDelegate.m file in the tableview-example group:</span>

change :

    + (LBRESTAdapter *) adapter
    {
        if( !_adapter)
            _adapter = [LBRESTAdapter adapterWithURL:[NSURL URLWithString:@"http://localhost:3000"]];
        return _adapter;
    }
    

to

    + (LBRESTAdapter *) adapter
    {
        if( !_adapter)
            _adapter = [LBRESTAdapter adapterWithURL:[NSURL URLWithString:@"http://192.111.111.111:3000"]];
        return _adapter;
    }
    

  1.  <span style="font-size: medium;">Run the project in the simulator with the ( ⌘ + R ) hot key or press the play triangle in the top left corner of XCode.</span>

The Examples app will leverage the &#8220;product&#8221; model that you defined when creating your LoopBack Node Server instance, so you can simply explore the code in the ViewController.m file to see how to Create, Read, Update and Delete Mobile defined models from your Objective-C iOS mobile Application.

There is no need to define a static model schema, since LoopBack will allow the Mobile Developer to define the Model attributes dynamically from the mobile Application.

Make sure and checkout the LoopBack documentation on how to leverage the built in [filter functions](http://docs.strongloop.com/loopback/#find-with-a-filter)and also to Connect your Node.js mobile objects to additional connectors or Server data stores such as [MongoDB](http://docs.strongloop.com/loopback/#working-with-data-sources-and-connectors) or [Oracle](http://docs.strongloop.com/loopback/#working-with-data-sources-and-connectors).

### <a href="https://github.com/mschmulen/ios-mobile-server-with-node-and-digitalocean#snapshot-your-droplet-for-on-demand-mobile-backend" name="snapshot-your-droplet-for-on-demand-mobile-backend"></a>&#8216;Snapshot&#8217; your Droplet for on demand mobile backend

Now that you have your StrongLoop Loopback server configured and your mobile application connected, you can take advantage of the <a href="https://www.digitalocean.com/?refcode=d58fefe584fa" target="_blank">Digital Ocean</a> Snapshot feature. This makes it fast and easy to spin up a mobile backend in a few seconds with zero server configuration.

## **[What’s next?](http://strongloop.com/get-started/)**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What’s in the upcoming Node v0.12 release? <a href="http://strongloop.com/node-js/whats-new-in-node-js-v0-12/">Six new features, plus new and breaking APIs</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js <a href="http://loopback.io/">LoopBack framework</a>. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Need <a href="http://strongloop.com/node-js-support/expertise/"]]>training and certification</a> for Node? Learn more about both the private and open options StrongLoop offers.</span>
</li>