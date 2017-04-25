---
id: 10610
title: 'Node.js support in Visual Studio?  You bet your IDE'
date: 2013-11-27T11:31:50+00:00
author: Grant Shipley
guid: http://strongloop.com/?p=10610
permalink: /strongblog/node-js-support-in-visual-studio-you-bet-your-ide/
categories:
  - How-To
---
_Editor&#8217;s Note: If you experience problems installing or configuring StrongLoop components, please make sure to check the [documentation](http://docs.strongloop.com/display/SL/StrongLoop+2.0) _and the_ _[Getting Started](http://strongloop.com/get-started/)_ _page for the most current instructions.__

It should come as no surprise to you that Node.js is quickly becoming recognized as a powerful and performant programming language.  It seems like every week a new corporate behemoth is moving at least some parts of their application infrastructure over to node.  Last week was no exception with Microsoft throwing its weight behind the language by releasing support for Node.js inside of its popular integrated development environment called [Visual Studio](http://www.visualstudio.com/downloads/download-visual-studio-vs#d-2013-editions).

Developers seem to either love or hate [Visual Studio](http://www.visualstudio.com/downloads/download-visual-studio-vs#d-2013-editions) and this comes down mainly to the application that they are trying to write. For instance, most .NET developers absolutely love Visual Studio and others seem to prefer a lighter weight approach to IDE(s) with many preferring [sublimetext](http://www.sublimetext.com/). In this blog post, we will take a look at the Node.js integration with Visual Studio which in turn may intrigue you enough to take a look at this IDE for node.js development.

Given that a lot of node.js developers may not have experience with Visual Studio or even Windows for that matter, this post will also cover the installation and configuration of node.js and Visual Studio on the Windows operating system.

<!--more-->

<h2 dir="ltr">
  Step 1: Install Windows
</h2>

The first thing we need to do in order to take advantage of the node.js capabilities inside of Visual Studio is to have the windows operating installed on our machine.  I typically use Mac OSX for my development so I decided to install Windows 8.1 inside of a Parallels Virtual Machine.  If you do not have a license for Parallels, you could also use VirutalBox, VMWare, or even use bootcamp to run Windows natively on your OSX hardware.

If you are a Linux user, I suggest installing Windows inside of a VirtualBox VM.

<h2 dir="ltr">
  Step 2: Install the StrongLoop Suite
</h2>

Once you have Windows installed and configured to your liking, head over to the [StrongLoop](http://strongloop.com/strongloop-suite/downloads/) website and [download](http://strongloop.com/strongloop-suite/downloads/) the StrongLoop Suite for the Windows operating system.

<img alt="" src="https://lh5.googleusercontent.com/1X1Pcmv6kEGffjSS5xsL6QXVJsbsuTJPPwrXiXECNSZ2pK6RdMl07rPFaLgjf0mqia-8gCuyJL7SvwKPkTNTVh9diuP0FD23XqycBl4tpZA95SKe7kfjPRgVpg" width="624px;" height="343px;" />

Once you have downloaded the current version of StrongLoop Suite for your operating system, execute the installer and follow the onscreen instructions for installing the package.

<img alt="" src="https://lh4.googleusercontent.com/uZkbdMnDsW_2da43E1k5Zg3gDdVF6qDvFgn224TLD2k-IIPkvx83RYY9TLAcVWfSNMufTNsn06G5kxcluvuHplNZ5EzdVtqbqek8Wm_cZsk0RA7C6quQZdGtJA" width="507px;" height="392px;" />

This will install the StrongLoop Suite package including the core Node.js runtime for us to use for our applications.

<h2 dir="ltr">
  Step 3: Testing our node distribution
</h2>

Now that we have our operating system and StrongLoop installed, let’s verify that our suite is working correctly by creating a sample application to verify the installation. In order to create our sample application, open up the command prompt inside of Windows by clicking the start button and then entering in \*cmd\*. This will open up the Windows shell prompt.  Once you are on the shell prompt, execute the following commands:

```js
$ cd c:\
$ mkdir code
$ cd code
$ slc example
```

After you enter in these commands, a sample application will be created for you in the \*c:\code\sls-sample-app\\* directory. Change to that directory and start up the node.js server:

```js
$ cd c:\code\sls-sample-app\
$ slc run .
```

If everything worked correctly, you should see a message similar to the following:

```js
StrongLoop Suite sample is now ready at <a href="http://0.0.0.0:3000">http://127.0.0.1:3000</a>
```

Pull the application up in your web browser and ensure you see the following:

<img alt="" src="https://lh6.googleusercontent.com/_wyYnAxr95Iec91pwqR8lpXGQQqDzNupJaYL_-jS58ERTywHxHOUVufaMX66r0cgaEvu_8p6jzEqHt-L_slFN5WLro0YD5TNGhNBmyx1FvIIMeLdVuBML6aG7g" width="624px;" height="365px;" />

<h2 dir="ltr">
  Step 4: Install Visual Studio
</h2>

Now that we have the StrongLoop Suite installed and verified, we can install Visual Studio.  Point your browser over to the [official download site](http://www.visualstudio.com/downloads/download-visual-studio-vs#d-2013-editions) for Visual Studio and select the edition you want to install. I will be taking advantage of the 90 day free trial for Visual Studio Premium 2013 during this blog post. Select the package you wish to use and click on the \*Install now\* option.

This will allow you to download the installation program titled \*vs_premium.exe\*. Once you have this downloaded, execute the installation and follow the onscreen instructions. Depending on the speed of your Internet connection, the installation process could take a while to complete. For the full installation, it will require roughly 7gb of disk space on your computer.

<img alt="" src="https://lh4.googleusercontent.com/is41Hh7EH7feM2y_Q7Li0Kbaqmnal2D24AAVW4olYxQ4Eac6-ohO2QGzDTVESSsoz8MF7ZzL3_bHa2n2dafYht33fqrM1HfQfca1hTcwGH8NB091FoNUxzU7gg" width="459px;" height="642px;" />

<h2 dir="ltr">
  Step 5: Install Node.js Tools for Visual Studio
</h2>

Now that we have Visual Studio installed and working correctly, it is time to install NTVS (Node.js Tools for Visual Studio). In order to do this, close down Visual Studio, if you have it running, and point your browser over to the [official NTVS download site](https://nodejstools.codeplex.com/releases/view/114437). Once you download the correct package for your Visual Studio installation, I am using Visual Studio 2013, begin the installation process.

<img alt="" src="https://lh4.googleusercontent.com/orxR3eYuU9CW2Ycngjrt5pN2aTqQBl-qBc5glf4awRsArWTt_gt9pby6k4FjSafSbsR6BJqw3kiliI8iHJO2rtkrIOqeDjwVtUWhxXqtAuMHAzhKhZrCDnGvaQ" width="505px;" height="394px;" />

## Step 6: Verify NTVS installation

At this point, we should have the StrongLoop Suite, Visual Studio 2013, and NTVS installed and running correctly. To verify this, open up Visual Studio Node.js interactive window by clicking on View->Other Windows->Node.js Interactive Window and enter in the following commands:

<img alt="" src="https://lh4.googleusercontent.com/B1Mm6Xx07y0whKceR4p1oo6bO8P-UfR2fKYARhOiJBlRw29HN9nzvZfg_-UHx1SGiy2VIFpijifnRRjK_24f4tKeG15uKYiO4YBbjx3JVjIhXc7LYYVusVARPg" width="567px;" height="256px;" />

As you can see in the above example, we set a String variable and then verified the Node.js runtime that Visual Studio is using. In this case, it is using the StrongLoop Suite Node.js package that we installed in a previous step.

## Step 7: Creating and running a StrongLoop Suite project

In order to take advantage of the NTVS package, we will need to create a Node.js project inside of Visual Studio. To do this, click on File->New Project->JavaScript->Blank Express Application as shown in the image below:

<img alt="" src="https://lh5.googleusercontent.com/ZxtYfD2QzgTfC_FRpJVr0yOFylO2h0nGota0Itl-yj9vTySh1xXnJIW76sv1wgYZLj33bTBDf8Bjm3x1uEinIp28Mx3VVJdc_UleuHMl-5NCV135Aca5z7B4Aw" width="624px;" height="428px;" />

After we have our express created, let’s go ahead and run the application by clicking on the run button in the top toolbar inside of the IDE. I have Chrome set as my default browser so the application will be running inside of that browser.

<img alt="" src="https://lh5.googleusercontent.com/xjP6_yxbmk_0jI9DA1BYrkhX25bVfTO4bDYFXIurgywU-fNaBuREuafiu8uvdkPylN69qw8y-aQLLtciF2PRh665B9ke2F4vIvuXGuH34BwxusGbttNeuhcHaA" width="624px;" height="21px;" />

After clicking this button, your default browser should launch showing the newly created express application. You will also notice that the node runtime being used is the one from StrongLoop Suite via the popup command prompt that displays your logs.

<img alt="" src="https://lh3.googleusercontent.com/KqE3tpLAfTNc7G8c7GuuwurhbZBHIClvMWV_SgeldfjAnfWeIJnpP4Vfy6_Ux6aM2BWRMLKXNGBp-xul40btQjkgkM2qXljKQtbFS-XF6HzTyJXH-0-bm0KToA" width="624px;" height="315px;" />

## Step 8: Debugging and intellisense

You may have noticed in the above step that the node runtime was actually running in debug mode. At this point we can add breakpoints inside of our source code and the IDE will break at that particular line to allow us to step through, or in, the code to help us track down issues.

Another great feature of the NTVS suite is that ability to have code completion on our Node.js source code. In order to activate this feature, just begin editing your source code and when you hit the . operator, all available functions will be presented to you. You can also hit control-space to pull up Intellisense as well.
  


<h2 dir="ltr">
  Summary:
</h2>

Although NTVS is in Alpha state, it is already providing one of best IDE integrations for Node.js available today. Granted, I am not a huge fan of Visual Studio but I am finding that the benefits I have already seen using this IDE is outweighing my negative thoughts about this environment. I am OSX user but I am envisioning that I will be spending more and more time inside of Window VM in the coming months to work on Node.js code.

## **[What’s next?](http://strongloop.com/get-started/)**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What’s in the upcoming Node v0.12 release? <a href="http://strongloop.com/node-js/whats-new-in-node-js-v0-12/">Six new features, plus new and breaking APIs</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js <a href="http://strongloop.com/node-js/loopback/">LoopBack framework</a>. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Want to read more articles like this? Check out <a href="http://strongloop.com/strongblog/using-a-digital-ocean-droplet-for-on-demand-node-js-mobile-backend/">&#8220;Using a Digital Ocean Droplet for On Demand Node.js Mobile Backend&#8221;</a>, <a href="http://strongloop.com/strongblog/how-to-heap-snapshots/">&#8220;How-to: Heap Snapshots and Handling Node.js Memory Leaks&#8221;</a> and <a href="http://strongloop.com/strongblog/using-express-js-for-apis-2/">&#8220;Using Express.js for APIs&#8221;</a>.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Need <a href="http://strongloop.com/node-js-support/expertise/">training and certification</a> for Node? Learn more about both the private and open options StrongLoop offers.</span>
</li>