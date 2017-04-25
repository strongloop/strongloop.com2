---
id: 8084
title: 'Apple&#8217;s iOS7 Native JavaScript Bridge'
date: 2013-11-19T11:59:14+00:00
author: Matt Schmulen
guid: http://strongloop.com/?p=8084
permalink: /strongblog/apples-ios7-native-javascript-bridge/
categories:
  - How-To
  - LoopBack
  - Mobile
---
<section> [<img class="alignnone  wp-image-10477" alt="ios7-javascript-xcode" src="https://strongloop.com/wp-content/uploads/2013/11/ios7-javascript-xcode.png" width="650" height="424" />](https://strongloop.com/wp-content/uploads/2013/11/ios7-javascript-xcode.png)&nbsp;</p> 

## **A Brief History of JavaScript Bridges in Mobile** {#abriefhistoryofjavascriptbridgesinmobile}

In 2009 [Appcelerator&#8217;s Titanium ](http://www.appcelerator.com/)0.8 Version changed from a &#8216;Hybrid web container&#8217; based approach similar to [Phone Gap / Cordova](http://cordova.apache.org/) to full &#8216;Native binding&#8217;. The change required Titanium developers to re-architect their code and remove HTML as the top-level implementation. Developers wrote their apps in pure JavaScript. The value to developers and Appcelerator is Titanium JavaScript applications running on iOS (and eventually Android) could get nearly all of the benefits of applications written in native Objective-C without having to learn Objective-C.
  
<!--more-->


  
The technology strategy was a smashing success for the following reasons:

**Appcelerator did not redefine the native iPhone look and feel**

Titanium Apps leveraged Apples native Human Interface Guideline (HIG). The iPhones look and feel was a major differentiator and the first &#8216;feature&#8217; a user saw when opening the mobile app. Look and feel was core to the iPhone&#8217;s success, and the applications that conformed to it. Since Titanium&#8217;s controls and components matched nearly one for one with the equivalent iOS libraries.  For Titanium a javascript [**ti.label**](http://docs.appcelerator.com/titanium/3.0/#!/api/Titanium.label) is the near equivalent of an Objective-C  [**UILabel**](https://developer.apple.com/library/ios/documentation/uikit/reference/UILabel_Class/Reference/UILabel.html), and [**ti.TableView**](http://docs.appcelerator.com/titanium/3.0/#!/guide/TableViews) matches [**UITableView**](https://developer.apple.com/Library/ios/documentation/UIKit/Reference/UITableView_Class/Reference/Reference.html). Because of this approach Titanium iOS apps were nearly indistinguishable from their native language counterparts.

The JavaScript Bridge strategy was then implemented on other mobile device&#8217;s (Android soon followed originally leveraging Rhino and then later V8, and later Blackberry and Tizen). This gave developers a unified open language to build applications with and opened the door for code-reuse across the 2 leading mobile platforms, without sacrificing features.

**Titanium SDK could be extended to support additional native features and components.**

Since the bridge binding technology was open, developers could extend the platform and give access to additional features that Appcelerator did not support, such as access to CoreData or BlueTooth.

The Appcelerator community exploded and the number of ‘Powered by Titanium’ Apps proliferated.

Today Appcelerator is not alone in this Strategy. [Xamarin Mono ](http://www.xamarin.com/)has an implementation that binds at the CLR level; giving C# developers the same benefits. [Ruby Motion](http://www.rubymotion.com/) does the same for Ruby developers. The popular gaming platform Unity provides similar access without needing to write native language apps. Node.js binds to the server with V8 runtime at the core LibUV libraries.

JavaScript Bridges are powerful, because they give developer communities access and the opportunity for code reuse.

Apple&#8217;s iOS7 is the first iOS operating system to officially support JavaScript as a mobile development language in Apples XCode tool chain.

Apple&#8217;s iOS7 support of JavaScript inline with your Objective-C code validates JavaScript as the leading (and only) non proprietary language that is supported within the iOS development environment by the device manufacturer.

## **Apple Support for a Native iOS Objective-C to JavaScript bridge is amazing for 3 reasons** {#applesupportforanativeiosobjectivectojavascriptbridgeisamazingfor3reasons}

  1. Gives developers direct access to JavaScript Bridge technology without leveraging 3rd party SDK’s such as Appcelerator, or Cordova (Phone Gap).
  2. JavaScript is the first non Apple proprietary language (Objective-C ) to be supported in the Native iOS XCode tool chain.
  3. It&#8217;s easy to get started, and composites well with Objective-C language apps.

You can check out the WWDC introduction &#8220;Integrating JavaScript into Native Apps&#8221; session on [Apple&#8217;s developer network](https://developer.apple.com/wwdc/videos/?id=615).

At a high level, JavaScriptCore allows for wrapping of standard JavaScript objects into Objective-C (the code used for iOS apps) and also allowing JavaScript to interact with native iOS objects and code.

## **Getting Started** {#gettingstarted}

If you want to see the technology in action you can download the sample project here [iOS7 Native JavaScript iPad app](https://github.com/mschmulen/ios7-javascript-bridge), and run it on your iPad device simulator.

#### iOS7 Native JavaScript iPad App {#ios7nativejavascriptipadapp}

[<img class="alignnone  wp-image-10475" alt="ios7-javascript" src="https://strongloop.com/wp-content/uploads/2013/11/ios7-javascript.png" width="448" height="347" />](https://strongloop.com/wp-content/uploads/2013/11/ios7-javascript.png)

You can change the JavaScript directly in the green text field and select the &#8220;execute JavaScript code&#8221; button to run the code to see your JavaScript execute in the Native iOS7 bridge.

The Sample Application preloads a UITextView with a JavaScript context and script and also adds some native Objective-C function blocks that you can call from within your JavaScript context. You can edit the code in the app and execute your script on the device.

## **Overview of the JavaScriptCore API** {#overviewofthejavascriptcoreapi}

According to Apple, the goal of the JavaScript bridge API is to provide automatic, safe and high fidelity use of JavaScript. Three main classes that iOS developers can use to compose heterogeneous language native applications are JSVirtualMachine, [JSContext](https://developer.apple.com/library/mac/documentation/JavaScriptCore/Reference/JSContextRef_header_reference/Reference/reference.html#//apple_ref/doc/uid/TP40011494) and JSValue.

## **JSVirtualMachine** {#jsvirtualmachine}

The JSVirtualMachine class is a Light weight single thread JavaScript virtual machine. Your app can instantiate multiple JS virtual machines in your app to support multi-threading.

## **JSContext** {#jscontext}

Within any given JSVirtualMachine you can have an arbitrary number of JSContexts allowing you to execute JavaScript scripts and give access to global objects.

## **JSValue** {#jsvalue}

JSValue is a strong reference to a JavaScript value in a specific JS Context ( StrongReferenced to the JSContext it is associated or instantiated with)

A JSValue is immutable, so you can’t modify it in Objective-C ( similar to NSString ) and therefore you can&#8217;t change the value in your Objective-C code and expect it to be changed in yourJavaScript execution. Likewise, changes to Objective-C values in JavaScript must be copied across the bridge boundary of the two execution environments.

JSValue automatically wraps many JavaScript value types, including language primitives and object types. There are some additional helper methods for common use cases such as NSArray and NSDictionary.

A listing of some of the supported objects that are automatically bridged for you.

  * Objective-C type = JavaScript type
  * id = Wrapper object
  * Class = Constructor object
  * nil = undefined
  * NSNull = null
  * NSString = string
  * NSNumber = number, boolean
  * NSDictionary = Object object
  * NSArray = Array object
  * NSDate = Date object
  * NSBlock = Function object

## **Simple Execution** {#simpleexecution}

Writing your first JavaScript can be done in as little as 2 lines of code:

  1. Create a JavaScript context by allocating and initializing a new JSContext.
  2. Evaluate your JavaScript script code in the JSContext with the evaluate message.

<pre lang="objc" line="1">//#import ;

JSContext *context = [[JSContext alloc] init];  
JSValue *result = [context evaluateScript:@"2 + 8"];  
NSLog(@"2 + 8 = %d", [result toInt32]);
```

## **Objective-C → JavaScript** {#objectivecjavascript}

Surfacing native Objective-C Objects is also very simple. Check out the Source Code example to see how to make your Objective-C functional blocks available to your JavaScript script.

<pre lang="objc" line="1">//execute factorial in native Obj-C , Logger(@"5! = %@", factorial(5) );
    self.context[@"factorial"] = ^(int x) {
        int factorial = 1;
        for (; x &gt; 1; x--) {
            factorial *= x;
        }
        return factorial;
    };
```

The [JavaScript iPad example](https://github.com/mschmulen/ios7-javascript-bridge/tree/master/javascript-bridge-iPad) surfaces 3 native functions:

  * [consoleLog](https://github.com/mschmulen/ios7-javascript-bridge/blob/master/javascript-bridge-iPad/javascriptIPad/ViewController.m#L83)
  * [factorial](https://github.com/mschmulen/ios7-javascript-bridge/blob/master/javascript-bridge-iPad/javascriptIPad/ViewController.m#L88)
  * [setBackgroundColor](https://github.com/mschmulen/ios7-javascript-bridge/blob/master/javascript-bridge-iPad/javascriptIPad/ViewController.m#L97)

You can also surface custom Objective-C objects with the JSExport protocol to make the entire object available in you JavaScript Context as outlined in the Apple developer documentation on [Calling Objective-C Methods From JavaScript](https://developer.apple.com/library/mac/documentation/AppleApplications/Conceptual/SafariJSProgTopics/Tasks/ObjCFromJavaScript.html)

## **Wrapping Up** {#wrappingup}

You can find detailed information regarding Memory Management, Threading and Using JavaScriptCore with a WebView at the Apple Developer documentation.

The combination of JavaScript support in your native iOS client and the proliferation of JavaScript server technology Node.js makes for exciting opportunities in &#8220;asymmetric&#8221; JavaScript code re-use for your native iOS App, web client and of course backend Node.js server.

If you make an interesting app leveraging the JavaScript Bridge, make sure and post your links below so I can follow up.

If you have any questions on how JavaScript can accelerate your mobile development efforts drop us a line at <callback@strongloop.com> and check out our [native iOS SDK](http://strongloop.com/mobile/ios/)  for [LoopBack](http://strongloop.com/mobile-application-development/loopback/). What&#8217;s LoopBack? It&#8217;s an open source API server built in Node.js that makes it easy to connect devices and browsers to data.</section> 

## **What’s next?**

<li style="margin-left:2em;">
  <span style="font-size: 18px;">Install LoopBack with a <a href="http://strongloop.com/get-started/">simple npm command</a></li> 
  
  <li style="margin-left:2em;">
    <span style="font-size: 18px;">What’s in the upcoming Node v0.12 version? <a href="http://strongloop.com/strongblog/performance-node-js-v-0-12-whats-new/">Big performance optimizations</a>, read the blog by Ben Noordhuis to learn more.</li> 
    
    <li style="margin-left:2em;">
      <span style="font-size: 18px;">Need performance monitoring, profiling and cluster capabilites for your Node apps? Check out <a href="http://strongloop.com/node-js-performance/strongops/">StrongOps</a>!</li> </ul>