---
id: 28230
title: Interactive Debugging with Node.js
date: 2016-11-09T07:30:27+00:00
author: Sequoia McDowell
guid: https://strongloop.com/?p=28230
permalink: /strongblog/interactive-debugging-with-node-js/
categories:
  - How-To
---
A &#8220;step-through debugger&#8221; (also called an &#8220;interactive debugger&#8221; or just &#8220;debugger&#8221;) is a powerful tool that can be very handy when your application isn&#8217;t behaving the way you expect. You can use it to pause your application&#8217;s code execution to:

  * Inspect or alter application state.
  * See the code execution path (&#8220;call stack&#8221;) that leads to the currently-executing line of code.
  * Inspect the application state at earlier points on the code execution path.

Interactive debuggers* are familiar to every Java developer (among others), but they are less well known in the JavaScript world. This is unfortunate, both because debuggers can help  diagnose logic issues, and because the JavaScript debugging tools today are the best and easiest to use they&#8217;ve ever been! This post will introduce the Node.js debugging tools in [Visual Studio Code](https://code.visualstudio.com) (VS Code) for programmers who have never used a debugger before.<!--more-->

## Why Use a Debugger? {#why-use-a-debugger}

Debuggers are useful when writing your own code, but they really show their value when you&#8217;re working with an unfamiliar codebase. Being able to step through the code execution line by line and function by function can save hours of poring over source code, trying to step through it in your head.

The ability to change the value of a variable at runtime enables you to play through different scenarios without hard coding values or restarting your application. Conditional breakpoints let you halt execution upon encountering an error to figure out how you got there. Even if using a debugger isn&#8217;t part of your everyday process, knowing how they work adds a powerful tool to your toolbox!

## Setting Up {#setting-up}

You&#8217;ll use [VS Code](https://code.visualstudio.com), which has a built-in Node.js debugger. To run code in the context of the VS Code debugger, you must first make VS Code aware of our Node.js project. For this demo you&#8217;ll create a simple Express app with [`express-generator`](https://expressjs.com/en/starter/generator.html), as follows:

<div>
  ```js
$ npm install express-generator -g
$ express test-app   # create an application
$ cd test-app        
$ npm install
$ code .             # start VS Code
```js
</div>

With VS Code open, open the Debug view by clicking the [bug icon](https://code.visualstudio.com/images/debugging_debugicon.png) in left sidebar menu. With the Debug view open, the gear icon at the top of the pane will have a red dot over it. This is because there are currently no &#8220;launch configurations:&#8221; configuration objects that tell VS Code how to run your application. Click the gear icon, select &#8220;Node.js,&#8221; and VS Code will generate a boilerplate launch configuration for you.

There are two ways to attach the VS Code debugger to your application:

  1. Set up a launch configuration and launch your app from within VS Code
  2. Start your app from the console with `node --debug-brk your-app.js` and run the &#8220;Attach&#8221; launch configuration

The first approach normally requires some setup (beyond the scope of this post, but [read about it here](https://code.visualstudio.com/docs/editor/debugging#_launch-configurations)), but because the `package.json` has a `run` script, VS Code automagically created a launch configuration based on that script. That means you can simply click the green &#8220;run&#8221; button to start our application in the debugger.

[<img class="alignnone size-medium wp-image-28231" src="https://strongloop.com/wp-content/uploads/2016/10/launch_button-300x212.png" alt="debug &quot;launch&quot; button with mouse pointer over it" width="300" height="212" srcset="https://strongloop.com/wp-content/uploads/2016/10/launch_button-300x212.png 300w, https://strongloop.com/wp-content/uploads/2016/10/launch_button-768x543.png 768w, https://strongloop.com/wp-content/uploads/2016/10/launch_button-1030x728.png 1030w, https://strongloop.com/wp-content/uploads/2016/10/launch_button-1500x1061.png 1500w, https://strongloop.com/wp-content/uploads/2016/10/launch_button-260x185.png 260w, https://strongloop.com/wp-content/uploads/2016/10/launch_button-705x499.png 705w, https://strongloop.com/wp-content/uploads/2016/10/launch_button-450x318.png 450w, https://strongloop.com/wp-content/uploads/2016/10/launch_button.png 1598w" sizes="(max-width: 300px) 100vw, 300px" />](https://strongloop.com/wp-content/uploads/2016/10/launch_button.png)

If all went well, you will see a new toolbar at the top of your screen with pause and play buttons (among others). The Debug Console at the bottom of the screen will tell you the command it ran and its output&#8211;something like this:

<div>
  ```js
node --debug-brk=18764 --nolazy bin/www 
Debugger listening on port 18764
```js
</div>

When you load <http://localhost:3000> in a browser, you will see the Express log messages in this same Debug Console:

```js
GET / 304 327.916 ms - -
GET /stylesheets/style.css 304 1.313 ms - -
```

Now that you have the code running with the VS Code debugger attached, let&#8217;s set some breakpoints and start stepping through our code&#8230;.

## Breakpoints {#breakpoints}

A breakpoint is a marker on a line of code that tells the debugger &#8220;pause execution here.&#8221; To set a breakpoint in VS Code, click the gutter just to the left of the line number. For example, open `routes/index.js` and set a breakpoint in the root request listener:

[<img class="alignnone size-medium wp-image-28234" src="https://strongloop.com/wp-content/uploads/2016/10/set-breakpoint-300x212.png" alt="setting breakpoint on line 6 of routes/index.js" width="300" height="212" srcset="https://strongloop.com/wp-content/uploads/2016/10/set-breakpoint-300x212.png 300w, https://strongloop.com/wp-content/uploads/2016/10/set-breakpoint-768x544.png 768w, https://strongloop.com/wp-content/uploads/2016/10/set-breakpoint-260x185.png 260w, https://strongloop.com/wp-content/uploads/2016/10/set-breakpoint-705x499.png 705w, https://strongloop.com/wp-content/uploads/2016/10/set-breakpoint-450x319.png 450w, https://strongloop.com/wp-content/uploads/2016/10/set-breakpoint.png 798w" sizes="(max-width: 300px) 100vw, 300px" />](https://strongloop.com/wp-content/uploads/2016/10/set-breakpoint.png)

The breakpoints pane at the bottom left has a listing for the new breakpoint (along with entries for exceptions, which we&#8217;ll talk about momentarily). Now, when you hit <http://localhost:3000> in a browser again, VS Code will pause at this point so you can examine what&#8217;s going on a that point:

[<img class="alignnone size-medium wp-image-28235" src="https://strongloop.com/wp-content/uploads/2016/10/paused-on-breakpoint-1-300x212.png" alt="VS Code paused on breakpoint" width="300" height="212" srcset="https://strongloop.com/wp-content/uploads/2016/10/paused-on-breakpoint-1-300x212.png 300w, https://strongloop.com/wp-content/uploads/2016/10/paused-on-breakpoint-1-768x543.png 768w, https://strongloop.com/wp-content/uploads/2016/10/paused-on-breakpoint-1-260x185.png 260w, https://strongloop.com/wp-content/uploads/2016/10/paused-on-breakpoint-1-705x499.png 705w, https://strongloop.com/wp-content/uploads/2016/10/paused-on-breakpoint-1-450x318.png 450w, https://strongloop.com/wp-content/uploads/2016/10/paused-on-breakpoint-1.png 800w" sizes="(max-width: 300px) 100vw, 300px" />](https://strongloop.com/wp-content/uploads/2016/10/paused-on-breakpoint-1.png)

With the code paused here, you can examine variables and their values in the **variables pane** and see how you got to this point in the code in the **call stack pane**. You may also notice that the browser has not loaded the page&#8211; that&#8217;s because it&#8217;s still waiting for the server to respond! We&#8217;ll take a look at each of the sidebar panes in turn, but for now, press the **play** button to continue code execution.

[<img class="alignnone size-medium wp-image-28236" src="https://strongloop.com/wp-content/uploads/2016/10/play-button-300x212.png" alt="VS Code play button press" width="300" height="212" srcset="https://strongloop.com/wp-content/uploads/2016/10/play-button-300x212.png 300w, https://strongloop.com/wp-content/uploads/2016/10/play-button-768x542.png 768w, https://strongloop.com/wp-content/uploads/2016/10/play-button-260x185.png 260w, https://strongloop.com/wp-content/uploads/2016/10/play-button-705x498.png 705w, https://strongloop.com/wp-content/uploads/2016/10/play-button-450x318.png 450w, https://strongloop.com/wp-content/uploads/2016/10/play-button.png 799w" sizes="(max-width: 300px) 100vw, 300px" />](https://strongloop.com/wp-content/uploads/2016/10/play-button.png)

Now the server will send the finished page to the browser. When code execution resumes, the &#8220;play&#8221; button is no longer enabled.

### Other types of breakpoints {#other-types-of-breakpoints}

In addition to breaking on a certain line each time it&#8217;s executed, you can add dynamic breakpoints that pause execution only in certain circumstances. Here&#8217;s a few of the more useful ones:

  1. **Conditional Breakpoint**: After setting a breakpoint, right click on it and select &#8220;edit breakpoint,&#8221; then enter an expression to conditionally activate a breakpoint. For example, to activate a breakpoint only if the user is an admin, you might add `user.role === "admin"` to your conditional breakpoint.
  2. **Uncaught Exception**: This is enabled by default. With this enabled, you don&#8217;t have to set any breakpoints to locate errors, the debugger will pause on any (uncaught) exceptions.
  3. **All Exceptions**: If you have robust error handling in your application, but you still want to see where errors come from before they&#8217;re caught and handled, enable this setting. Be warned, however, that many libraries throw and catch errors internally in the normal course of their execution, so this can be pretty noisy.

## Variable pane {#variable-pane}

In this pane, you can examine and change variables in the running application. Let&#8217;s edit our homepage route in `routes/index.js` to make the title a variable:

<div>
  ```js
/* GET home page. */
var ourTitle = 'Express';
router.get('/', function(req, res, next) {
  res.render('index', { title: ourTitle });
});
```js
</div>

After editing the code, **restart the debugger** so it picks up the new code. Do this by clicking the green circle/arrow button in the top toolbar. After editing a file with a breakpoint already set and restarting the debugger (as you just did), you&#8217;ll also want to check that your breakpoints are still in the right spot. VS Code does a pretty good job of keeping the breakpoint on the line you expect but it&#8217;s not perfect.

With our breakpoint on what&#8217;s now line 7 and with the debugger restarted, refresh your browser. The debugger should stop on line seven. You don&#8217;t see `ourTitle` in the variable pane right away, because it&#8217;s not &#8220;Local&#8221; to that function, but expand the &#8220;Closure&#8221; section just below the &#8220;Local&#8221; section and there it is!

[<img class="alignnone size-medium wp-image-28238" src="https://strongloop.com/wp-content/uploads/2016/10/ourTitle-300x212.png" alt="variable pane with the closure section expanded showing variable named &quot;ourTitle&quot; with value &quot;Express&quot;" width="300" height="212" srcset="https://strongloop.com/wp-content/uploads/2016/10/ourTitle-300x212.png 300w, https://strongloop.com/wp-content/uploads/2016/10/ourTitle-768x543.png 768w, https://strongloop.com/wp-content/uploads/2016/10/ourTitle-260x185.png 260w, https://strongloop.com/wp-content/uploads/2016/10/ourTitle-705x498.png 705w, https://strongloop.com/wp-content/uploads/2016/10/ourTitle-450x318.png 450w, https://strongloop.com/wp-content/uploads/2016/10/ourTitle.png 798w" sizes="(max-width: 300px) 100vw, 300px" />](https://strongloop.com/wp-content/uploads/2016/10/ourTitle.png)

Double-clicking `ourTitle` in the Variables Pane allows you to edit it. This is a great way to tinker with your application and see what happens if you switch a flag from true to false, change a user&#8217;s role, or do something else&#8211; all without having to alter the actual application code _or_ restart your application!

The variable pane is also a great way to poke around and see what&#8217;s available in objects created by libraries or other code. For example, under &#8220;Local&#8221; you can see the `req` object, see that its type is `IncomingMessage`, and by expanding it you can see the `originalUrl`, `headers`, and various other properties and methods.

## Stepping {#stepping}

Sometimes, rather than just pausing the application, examining or altering a value, and setting it running again, you want to see what&#8217;s happening in your code line by line: what function is calling which and and how that&#8217;s changing the application state. This is where the &#8220;Debug Actions&#8221; toolbar comes in: it&#8217;s the bar at the top of the screen with the playback buttons. We&#8217;ve used the **continue** (green arrow) and **restart** (green circle arrow) buttons so far, and you can hover over the others to see the names and associated keyboard shortcuts for each. The buttons are, from left to right:

  * **Continue/Pause**: Resume execution (when paused) or pause execution.
  * **Step over**: Execute the current line and move to the next line. Use this button to step through a file line by line.
  * **Step in**: When paused on a function call, you can use this button to step _into that function_. This can get a bit confusing if there are multiple function calls on one line, so just play around with it.
  * **Step out**: Run the current function to its `return` statement & step out to _the line of code that invoked that function_.
  * **Restart**: Stop your debugging session (kill your application) and start it again from the beginning. Use this after altering code.
  * **Stop**: Kill your application.

## Watch Expressions {#watch-expressions}

While stepping through your code, you may want to see the values of certain things. A &#8220;watch expression&#8221; will run (in the current scope!) at each paused/stopped position in your code and display the expression&#8217;s value. Hover over the **Watch Expression** pane and click the plus to add an expression. To see the user agent header of each request as well as `ourTitle`, whether the response object has had headers sent, and the value of `1 + 1`, just for good measure, so add the following watch expressions:

<div>
  ```js
req.headers['user-agent']
ourTitle
res._headerSent
1 + 1
```js
</div>

When you refresh the browser the debugger pauses once again at the breakpoint on line 7, you can see the result of each expression:

[<img class="alignnone size-medium wp-image-28240" src="https://strongloop.com/wp-content/uploads/2016/10/watch-expressions-300x212.png" alt="watch expressions with values" width="300" height="212" srcset="https://strongloop.com/wp-content/uploads/2016/10/watch-expressions-300x212.png 300w, https://strongloop.com/wp-content/uploads/2016/10/watch-expressions-768x543.png 768w, https://strongloop.com/wp-content/uploads/2016/10/watch-expressions-260x185.png 260w, https://strongloop.com/wp-content/uploads/2016/10/watch-expressions-705x499.png 705w, https://strongloop.com/wp-content/uploads/2016/10/watch-expressions-450x318.png 450w, https://strongloop.com/wp-content/uploads/2016/10/watch-expressions.png 800w" sizes="(max-width: 300px) 100vw, 300px" />](https://strongloop.com/wp-content/uploads/2016/10/watch-expressions.png)

## Call Stack {#call-stack}

The Call Stack Pane shows the function calls that got you to the current position in the code when execution is paused, and enables you to step back up that stack and examine the application state in earlier &#8220;frames.&#8221; By clicking the frame below the current frame you can jump to the code that called the current function. In our case, the current frame is labeled `(anonymous function)` in `index.js [7]`, and the one before that the `handle` function in `layer.js`, which is a component of the Express framework:

[<img class="alignnone size-medium wp-image-28241" src="https://strongloop.com/wp-content/uploads/2016/10/call-stack-300x212.png" alt="call stack with &quot;handle&quot; frame selected" width="300" height="212" srcset="https://strongloop.com/wp-content/uploads/2016/10/call-stack-300x212.png 300w, https://strongloop.com/wp-content/uploads/2016/10/call-stack-768x544.png 768w, https://strongloop.com/wp-content/uploads/2016/10/call-stack-260x185.png 260w, https://strongloop.com/wp-content/uploads/2016/10/call-stack-705x499.png 705w, https://strongloop.com/wp-content/uploads/2016/10/call-stack-450x319.png 450w, https://strongloop.com/wp-content/uploads/2016/10/call-stack.png 801w" sizes="(max-width: 300px) 100vw, 300px" />](https://strongloop.com/wp-content/uploads/2016/10/call-stack.png)

_Note that the request handling function is unnamed, hence &#8220;`(anonymous function)`.&#8221; &#8220;Anonymous function?!&#8221; What&#8217;s that? Who knows! Moral: always name your functions!_

Stepping down into the Express framework is not something I do every day, but when you absolutely need to understand how you got to where you are, the Call Stack Pane is very useful!

One especially interesting use of the Call Stack Pane is to examine variables at earlier points in your code&#8217;s execution. By clicking up through the stack, you can see what variables those earlier functions had in their scope, as well as see the state of any global variables at that point in execution.

## All This and More&#8230; {#all-this-and-more}

There are many more features of the interactive debugger than I went over here, but this is enough to get you started. To learn more, take a look at the excellent documentation from Microsoft on [the VS Code Debugger](https://code.visualstudio.com/docs/editor/debugging) and [using it with Node.js](https://code.visualstudio.com/docs/runtimes/nodejs#_debugging-your-express-application). Oh, and I should probably mention that all the debugging features outlined here (and more) are built-in to [Firefox](https://developer.mozilla.org/en-US/docs/Tools/Debugger) as well as [Chrome](https://developers.google.com/web/tools/chrome-devtools/javascript/add-breakpoints), should you wish to use them on browser-based code. Happy Debugging!

* _There&#8217;s no specific term I&#8217;ve found for this common collection of application debugging tools so I&#8217;m using the term &#8220;interactive debugging&#8221; in this article._