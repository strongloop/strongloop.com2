---
id: 13318
title: Titanium or PhoneGap? Which Cross-Platform Mobile Framework Should I Use?
date: 2014-01-22T08:11:11+00:00
author: Matt Schmulen
guid: http://strongloop.com/?p=13318
permalink: /strongblog/titanium-vs-phonegap-cross-platform-mobile-framework/
categories:
  - LoopBack
  - Mobile
---
The most recent sighting of this question came from a blog post on the Vizteck site titled[ &#8220;Phonegap vs Titanium](http://vizteck.com/blog/phonegap-vs-titanium)&#8220;.

I believe the question should be broadened a little more to consider some additional solutions:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><a href="http://phonegap.com/">PhoneGap</a>/Cordova (HTML/JavaScript)</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><a href="http://appcelerator.com/">Titanium</a>/Appcelerator (JavaScript)</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><a href="http://xamarin.com">Mono/Xamarin</a> (C#)</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><a href="http://www.motorolasolutions.com/US-EN/RhoMobile+Suite/Rhodes">Rhodes</a> (Ruby)</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><a href="http://www.kony.com/">Kony</a> (Lua)</span>
</li>

For me the question ultimately boils down to:

 _How should I invest my resources to attain mobile application success?_

Since I left Appcelerator to work for StrongLoop, the following question often accompanies the former&#8230;

_How can StrongLoop contribute to my cross-platform mobile success?_

The most challenging aspect of this question is the value these mobile cross-platform tools provided at their inception is not the same today because the requirements for “mobile success” have evolved and the challenges are different.

The evaluation needs to work on assumptions that fit today’s mobile needs in addition to the assumptions that created the initial demand that proliferated cross-platform mobile tools.

To effectively evaluate cross-platform mobile tools in today’s environment it helps to look back to 2010 when Titanium and PhoneGap &#8211;the two cross-platform tools with the greatest reach&#8211; proliferated.

## **Mobile in 2010**

In 2010, mobile was still at its infancy (some say it still is) and application delivery was mostly focused on finding a programmer that could get your app in the app store.

Mobile cross-platform tools were exploding at this time because:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Native programming resources were scarce</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Enterprise was both hungry and late to the game</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Applications and their creators were independent</span>
</li>

## 

&nbsp;

## **Obscurity-C**

<img alt="" src="https://lh4.googleusercontent.com/5haLFKkGedVvWzZT0AwkiwaZ4bkLlyG34uAePM7tZP88DHHFo_0uekxS1PFu8YIjyOb2znNcyukgoor38hB6s9s1DF93BUpIoPRyMX75ctgSJFtbGzdUtgjaBmxSnVvFOg" width="624px;" height="468px;" />

Native iOS mobile developers were scarce because before iOS few people programmed in Objective-C. It was an obscure language that few knew until the [iPhone made it the popular in colleges and universities](http://engineering.stanford.edu/news/stanford-launches-latest-version-free-iphoneipad-apps-course) across the world.  If you wanted to make an iPhone app you would have to learn an entirely different language, use a new IDE and do it on a foreign operating system. This drove application developers to seek and experiment with cross-language tooling.

<span style="font-size: 13px;"><img alt="" src="https://lh6.googleusercontent.com/aWDWTbfZtP4lz-yZrpIzxY-D71lZ0Q91t_kKlJAgVg-13Nol7jrdHzHqF7VCK_A4vm-_0wb296odFmPIpSHJCj-cwrcLVZz7HAhLKxCI4FUTpr3Ii9SVdT-h0d0cQ1sI-g" width="540px;" height="300px;" /></span>

<span style="font-size: 13px;">Cross-platform tool chains benefited from this desire, and the ones that embraced the largest ecosystems (HTML and JavaScript) grew the fastest: hence the rise of PhoneGap and Titanium.</span>

## **Enterprise was hungry and late to the game**

Enterprise app marketplaces for iOS or Android did not exist, and the primary corporate interest in iPhone applications was from the marketing line of business. Central IT compounded the challenge by making it nearly impossible for developers working in a large company to even attempt to build and iOS application.  First you were going to need to buy Apple Macs (corporate procurement was PC only), second many IT organizations wouldn’t even allow an Apple on the network, and finally it was unlikely employees could even install the application on a company mobile device.  This promoted the current iOS and Android app outsourcing movement that has defined mobile delivery for the past five years.

There are some exceptions, such as [USAA](https://www.usaa.com/inet/pages/mobile_access_methods_mobileapps) creating one of the first in-house cross-platform mobile development teams and launching the [first banking application to allow check deposit](http://www.macworld.com/article/1158139/iphone_banking.html) using a smartphone in May 2009 (if you doubt how visionary this was, remember that the iOS SDK was not available until Feb 2008). Another innovator, [American Airlines](http://www.aa.com/i18n/urls/mobile-apps.jsp?anchorLocation=DirectURL&title=apps), launched the first paper-less airline travel iPhone app using TSA-supported QR Codes in July of 2010. The initiative was led by the marketing line of business and was delivered with a hybrid team of in-house server developers and a local game studio.

## **Mobile applications were islands not bridges**

Applications did not (or at least rarely) integrate with internal corporate services or data.  The marketing line of business and independent driven initiatives focused on a few social network feeds and isolated mobile first data.

This resulted in the largest cost being a single mobile client developer spending most of their time on the application’s user experience.

This in turn led to early cross-platform evaluations being very mobile client developer centric.  Early RFPs and RFI’s for evaluating a mobile tool focused heavily on enumerating specific mobile device feature support and tooling language.

The resulting application coding centric view around a single app disproportionately weights problems from these early days of &#8220;One Riot, one Ranger&#8221;[*](http://en.wikipedia.org/wiki/Texas_Ranger_Division#.22One_Riot.2C_One_Ranger.22) mobile delivery.  At this time a single programmer carried the project from start to finish for an app that had a shallow ‘stack’ with few 3rd party service integrations.

<strong style="font-size: 1.5em;"><img alt="" src="https://lh3.googleusercontent.com/4FZBG_O_rPH4UJ7VfKvsrfun6mkmHYNcKR8mQZiONY-9B9PRpx2ol6lRLd0TQZnyZCn9PRixkg906FZeo4naxJ46c0fFmAHMEoo8eIW4hvFKeIyPuBxiPbR5L2t4B_WlFQ" width="540px;" height="236px;" /></strong>

&nbsp;

<strong style="font-size: 1.5em;">Mobile Success in 2014</strong>

The success criteria for what is “mobile application success” changed significantly over the past four years.

Today it’s full stack mobile supporting hundreds of mobile applications, customized for each business unit and mobile user persona.  Three forces have influenced the development of these applications:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Enterprises’ need for mobile apps is exploding</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Mobile demands access to data</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Proliferation of SDKs, modules and components</span>
</li>

&nbsp;

## **Enterprise mobile is exploding**

In the same way enterprises lagged consumers during the Internet revolution leaving CTOs and CIOs to scramble for a web strategy, the “consumerization” of mobile forced corporate technology leaders to resolve the demand for mobile applications in a fragmented mobile device world.

Today’s corporation will not have one or two mobile applications in their mobile catalog; they will have hundreds.  The comparison is for every desktop software product there are two or three mobile applications that combined will provide the same value.  Compared to their desktop counterparts mobile applications are “proverbs not novels”.  Mobile apps have limited computing, network, and memory resources as well as&#8211;the most precious resource of all&#8211;users’ attention and time.  A mobile app chops up large desktop experiences into mobile “minutes” for employees and users to open an app perform an action and then jump to another app or just go on with their life.  This changes the execution strategy from building one or two large applications to making many small apps that work as a confederacy of enablement.

## **Mobile demands access to data**

Current mobile applications require tighter integration than ever before. Specifically in the services and data the mobile apps consume.  Many enterprise mobile applications will not be seen on consumer app stores, and will focus on surfacing internal enterprise data from legacy CRM and ERP systems and promote user action on this information.  This forces greater value on connecting, integrating and maintaining the data mobile applications consume and generate.

## **Proliferation of SDKs, modules, and components**

Open source has been around for a long time, but crowd supported SDKs and components to add features and functionality and accelerate application development exploded after 2010.  GitHub launched in May of 2011 fueling the movement, and more recently GitHub released [Boxen](http://boxen.github.com/) to automate dependencies in development environments.  In 2012, npm makes it easy to add new features to Node apps; as does  [CocoaPods](http://cocoapods.org/) for iOS application libraries.  All these systems make it easy for developers to incorporate the rapidly expanding ecosystem of open source components into applications.

Mobile cross-platform IDEs and vendors that fail to seamlessly integrate with the ecosystem of shared components and templates will fall behind and fail to meet developer expectations.

## **What does this mean for evaluating cross-platform mobile?**

Cross-platform solutions need to be evaluated in the context of these new demands.  Simply unifying mobile programming languages to access to native device features and functionality will not be enough for mobile application success.

Platforms must:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Support more of the full application lifecycle.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Go deeper in the mobile technology stack.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Be able to incorporate community code quickly from a rich ecosystem of feature components.</span>
</li>

<img alt="" src="https://lh4.googleusercontent.com/rTn15JZSoE4ZUad0GSup-2rdXkSg24EcHv2_v2AxqNX_KGqaQiOJRoqda_k3Fa7TemxOfcr0QnUod6V6t7M78fMUdfwWadFDyPRAylXXAE60aO6jq4kmtSaqRRz66RjhSw" width="624px;" height="295px;" />

While application runtime performance is important, a robust cross-platform solution can reduce apps’ overall “time to value,” and promote richer user experiences by enabling use of third-party components.  Giving an additive compounding return on investment when multiple applications are created in an “app factory” delivery strategy.

<img alt="" src="https://lh4.googleusercontent.com/wVz7fnN_hO98wOFMl8l3XG4QsEqcoU2fVJWlX-rBPrTRhT95juq9yemsMQhTR6p-QlvijfDLU32Blza0Ia75xg97o1ig0GUW9Y5ciiiJsMcM30IX59UJruBz754yLAmn4g" width="624px;" height="268px;" />

A constructive framework for cross-platform evaluation measures along two vectors:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Full mobile application lifecycle</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Full mobile application stack.</span>
</li>

## 

&nbsp;

## **Mobile cross-platforms are moving for depth and breadth**

Mobile platform solutions like Appcelerator, Xamarin, and vendor-supported PhoneGap/Cordova environments have addressed these additional requirements by extending their core technology across the application lifecycle and deeper into the technology stack.

## **Appcelerator**

Appcelerator has addressed some of these challenges with acquisition and partner integration.  The [CocoaFish acquisition in 2012](http://www.appcelerator.com/blog/2012/02/appcelerator-acquires-cocoafish/) became Appcelerator Cloud Services, supporting the backend needs of mobile applications.  Additionally in Appcelerator integrated [Functional Test from Sosta](http://www.soasta.com/press-releases/appcelerator-and-soasta-partner-to-empower-mobile-enterprise-developers-with-first-integrated-test-automation-solution/), crash analytics and application performance from [Crittercism](https://www.crittercism.com/appcelerator-and-crittercism-partner-to-deliver-first-integrated-mobile-app-development-and-app-performance-platform-to-the-enterprise/), adding to the original Titanium tool chain.

## **Xamarin**

Xamarin has extended its powerful cross device C# runtime and IDE to include third-party components directly in the environment from their component store.  The platform provides continuous integratin (CI) build and automation for windows developers with its OSX build agent.  The companies’ 2013 [acquisition of the Calabash framework from LessPainfull](http://techcrunch.com/2013/04/16/xamarin-launches-test-cloud-automated-mobile-ui-testing-platform-acquires-mobile-test-company-lesspainful/) provided the foundation for their [Xamarin Test Cloud](http://xamarin.com/test-cloud).

## **PhoneGap/Cordova**

The PhoneGap story is more complex.  Usually &#8220;PhoneGap&#8221; refers to the open source distribution of [Cordova](http://cordova.apache.org/) (cross-platform provider [Icenium](http://www.icenium.com/) has an excellent write-up regarding this issue [here](http://www.icenium.com/blog/icenium-team-blog/2013/03/26/demystifying-apache-cordova-and-phonegap)).  Cordova has a fragmented vendor landscape. There are many vendors that support the Cordova technology strategy (IBM Worklite, HP Anywhere, Intel XDK, SAP Platform &#8211; formerly SUP) as well as the traditional Adobe-owned [PhoneGap](http://phonegap.com/).  Each vendor has IDEs, supporting components, and tooling that target the needs of a mobile delivery team with vendor-supported services.

## **StrongLoop**

Today StrongLoop fits in the middle tier of mobile, focusing on mobile service problems that have historically challenged app success.

It does this by:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Making it easy to connect mobile apps to data using LoopBack on top of Node.js and the rich npm ecosystem.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Helping you to maintain and monitor Node applications with StrongOps.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Giving you greater control over where your mobile backend runs. Insuring your mobile backend server can be run on your local developer machine, your on-premises hardware, or on cloud providers like Rackspace, Cloud9, Amazon, Heroku, or Redhat OpenShift.</span>
</li>

Additional recent developments such as the formation of npm, Inc. in the Node community confirm the power of packaged components.

Hopefully this approach to evaluating cross-platform mobile technology will help in evaluating the right cross-platform a tool for your mobile app success.

If you still want a simple answer to Titanium vs. PhoneGap. I would recommend reading [Kevin Whinnery](http://mobileappstack.com/ghost/editor/24/(http://twitter.com/kwhinnery)%20response%20%5Bcomparing-titanium-and-phonegap%5D(http://kevinwhinnery.com/post/22764624253/comparing-titanium-and-phonegap). His article gives a very honest comparison of the two technologies.

_Full disclosure, I worked with Kevin at Appcelerator as Lead SE_

## [**Get trained in Node.js and API development**](http://strongloop.com/node-js/training/)**
  
** 

<p dir="ltr">
  Looking for Node.js and API development training? StrongLoop instructors are coming to a city near you:
</p>

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Nov 6-7: <a href="http://strongloop.com/node-js/training-denver-2014/">Denver, CO</a> at Galvanize Campus</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Nov 13-14: <a href="http://strongloop.com/node-js/training-herndon-2014/">Herndon, VA</a> at Vizuri</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Dec 3-4: <a href="http://strongloop.com/node-js/training-framingham-2014/">Framingham, MA</a> at Applause</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Dec 11-12: <a href="http://strongloop.com/node-js/training-minneapolis-2014/">Minneapolis, MN</a> at BestBuy</span>
</li>

Check out our complete [Node.js and API development training, conference and Meetup calendar](http://strongloop.com/developers/events/) to see where you can come meet with StrongLoop engineers.