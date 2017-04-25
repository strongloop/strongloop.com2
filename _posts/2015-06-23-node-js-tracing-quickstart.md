---
id: 25406
title: StrongLoop Node.js Tracing Quickstart
date: 2015-06-23T06:35:00+00:00
author: Sean Brookes
guid: https://strongloop.com/?p=25406
permalink: /strongblog/node-js-tracing-quickstart/
categories:
  - Arc
  - How-To
  - Node DevOps
---
We [recently added](https://strongloop.com/strongblog/transaction-tracing-node-js-root-cause/) the Tracing module (currently in Beta) to [StrongLoop Arc’s](https://strongloop.com/node-js/arc/) monitoring and performance analysis tools. Tracing helps you identify performance and execution patterns of Node applications, discover bottlenecks, and trace code execution paths. This enables you to monitor Node.js applications and provides tracing data at the system and function level, giving you insights into how your application performs over time. Tracing works with applications deployed to [StrongLoop Process Manager](http://strong-pm.io/) (PM).

This blog post describes how to quickly get up and running with Tracing, assuming you have  some familiarity with StrongLoop tools. It demonstrates the quickest path to try out the new Tracing module, using an example that simulates some load, and how to view and understand the data visualizations based on your application traffic.

## **Step 1. Setup**

Start by installing the latest version of StrongLoop and creating a basic Loopback application. If you have never done this previously, please refer to: <http://loopback.io/getting-started/>

```js
$ npm install -g strongloop
```

Clone the example app from <https://github.com/strongloop/tracing-example-app> and go through the set up:

```sh
$ git clone https://github.com/strongloop/tracing-example-app.git
$ cd tracing-example-app
$ npm install
```

This example demonstrates the tracing in of StrongLoop Arc. The example includes a simple HTTP server with one route that starts an internal busy loop when triggered.  This generates fluctuations (and thus more data) for the StrongLoop Arc tracing graphs.

Please review the README to get your example app up and running and create some variation in the graphs by running the ./send-request script to make repeated curl requests to the server.

<!--more-->

## **Step 2. Start things up**

Change directories into your app folder

```js
$ cd tracing-example-app
```

Start your local PM instance and deploy the application to it by typing:

```js
$ slc start
```

<img class="aligncenter size-full wp-image-25415" src="https://strongloop.com/wp-content/uploads/2015/06/sean1.png" alt="sean1" width="975" height="278" srcset="https://strongloop.com/wp-content/uploads/2015/06/sean1.png 975w, https://strongloop.com/wp-content/uploads/2015/06/sean1-300x86.png 300w, https://strongloop.com/wp-content/uploads/2015/06/sean1-705x201.png 705w, https://strongloop.com/wp-content/uploads/2015/06/sean1-450x128.png 450w" sizes="(max-width: 975px) 100vw, 975px" />

This will bring up a PM instance listening on the default port 8701

Next start Arc by typing:

```js
$ slc arc
```

This launches StrongLoop Arc in your default browser. If you haven’t done so already, you’ll need to register and log in.

<img class="aligncenter size-full wp-image-25416" src="https://strongloop.com/wp-content/uploads/2015/06/sean2.png" alt="sean2" width="975" height="186" srcset="https://strongloop.com/wp-content/uploads/2015/06/sean2.png 975w, https://strongloop.com/wp-content/uploads/2015/06/sean2-300x57.png 300w, https://strongloop.com/wp-content/uploads/2015/06/sean2-705x134.png 705w, https://strongloop.com/wp-content/uploads/2015/06/sean2-450x86.png 450w" sizes="(max-width: 975px) 100vw, 975px" />

## **Process Manager**

The first stop is the Process Manager module in Arc.  This module enables you to add, edit, and monitor PM instances. Arc communicates with StrongLoop Process Managers dynamically, so you can do things such as deploying apps, stopping and starting apps, changing cluster size, and so on.
  
Now, connect Arc to the local PM instance you started previously using slc start.  By default, the local PM runs port 8701, so in the **Strong PM** field, enter localhost and for **Port**, enter 8701.

<img class="aligncenter size-full wp-image-25417" src="https://strongloop.com/wp-content/uploads/2015/06/sean3.png" alt="sean3" width="975" height="544" srcset="https://strongloop.com/wp-content/uploads/2015/06/sean3.png 975w, https://strongloop.com/wp-content/uploads/2015/06/sean3-300x167.png 300w, https://strongloop.com/wp-content/uploads/2015/06/sean3-705x393.png 705w, https://strongloop.com/wp-content/uploads/2015/06/sean3-450x251.png 450w" sizes="(max-width: 975px) 100vw, 975px" />

If Arc gets the appropriate response from PM, and an app has been deployed to it, you should see the following:

<img class="aligncenter size-full wp-image-25418" src="https://strongloop.com/wp-content/uploads/2015/06/sean4.png" alt="sean4" width="975" height="357" srcset="https://strongloop.com/wp-content/uploads/2015/06/sean4.png 975w, https://strongloop.com/wp-content/uploads/2015/06/sean4-300x110.png 300w, https://strongloop.com/wp-content/uploads/2015/06/sean4-705x258.png 705w, https://strongloop.com/wp-content/uploads/2015/06/sean4-450x165.png 450w" sizes="(max-width: 975px) 100vw, 975px" />

**IMPORTANT NOTE**: Once you’ve connected to the Process Manager instance running the example, set the number of processes to one (1), as shown below. By default, \`slc start\` runs the application with a number of processes equal to the number of cores on your machine. Since the purpose of this example is to demonstrate an overloaded application, it will maximize CPU usage and if that happens to all your CPUs, you system could eventually overheat!  To avoid this, simply run the app in one process.

<img class="aligncenter size-full wp-image-25419" src="https://strongloop.com/wp-content/uploads/2015/06/sean5.png" alt="sean5" width="975" height="159" srcset="https://strongloop.com/wp-content/uploads/2015/06/sean5.png 975w, https://strongloop.com/wp-content/uploads/2015/06/sean5-300x49.png 300w, https://strongloop.com/wp-content/uploads/2015/06/sean5-705x115.png 705w, https://strongloop.com/wp-content/uploads/2015/06/sean5-450x73.png 450w" sizes="(max-width: 975px) 100vw, 975px" />

## **Tracing**

Tracing monitors your Node application by tracing JavaScript functions entry and exit points to record the elapsed time of each function call and the position of the function call in the source file. It instruments every function in your application as well as the packages your application requires.

Click on the Tracing module to view the instrumented data.

<img class="aligncenter size-full wp-image-25420" src="https://strongloop.com/wp-content/uploads/2015/06/sean6.png" alt="sean6" width="975" height="246" srcset="https://strongloop.com/wp-content/uploads/2015/06/sean6.png 975w, https://strongloop.com/wp-content/uploads/2015/06/sean6-300x76.png 300w, https://strongloop.com/wp-content/uploads/2015/06/sean6-705x178.png 705w, https://strongloop.com/wp-content/uploads/2015/06/sean6-450x114.png 450w" sizes="(max-width: 975px) 100vw, 975px" />

The first time you come to Tracing there may not be much to see. You will see a dropdown select control to choose which pm instance you want to enable tracing on, the name of the current service/application, a toggle control to turn tracing on and off.

The Tracing view will automatically attempt to load tracing information on the first process of the first PM instance. StrongLoop PM enables tracing at the process level and by default tracing is not enabled. Turn tracing on by using the **On/Off** toggle switch as shown below.

<img class="aligncenter size-full wp-image-25421" src="https://strongloop.com/wp-content/uploads/2015/06/sean7.png" alt="sean7" width="975" height="267" srcset="https://strongloop.com/wp-content/uploads/2015/06/sean7.png 975w, https://strongloop.com/wp-content/uploads/2015/06/sean7-300x82.png 300w, https://strongloop.com/wp-content/uploads/2015/06/sean7-705x193.png 705w, https://strongloop.com/wp-content/uploads/2015/06/sean7-450x123.png 450w" sizes="(max-width: 975px) 100vw, 975px" />

Wait while processes get cycled.

<img class="aligncenter size-full wp-image-25422" src="https://strongloop.com/wp-content/uploads/2015/06/sean8.png" alt="sean8" width="975" height="492" srcset="https://strongloop.com/wp-content/uploads/2015/06/sean8.png 975w, https://strongloop.com/wp-content/uploads/2015/06/sean8-300x151.png 300w, https://strongloop.com/wp-content/uploads/2015/06/sean8-705x356.png 705w, https://strongloop.com/wp-content/uploads/2015/06/sean8-450x227.png 450w" sizes="(max-width: 975px) 100vw, 975px" />

## **Drill down &#8211; Trace summary view**

The first chart displays CPU load and process heap usage and simply serves as a tool to pick a time slice into which you want to drill down. The Timeline View is updated in real-time every 20 seconds and shows data up to the last five hours.

By selecting a time slice, you’ll get a sequences of traces that occurred in the system, at that time. Two types of trace sequences are instrumented, HTTP/HTTPS transactions and database transactions. Specifically, MySQL, PostgreSQL, Oracle, Redis, Memcache, Memcached and MongoDB.  You can select the trace sequence that you wish to drill down further, or use the Previous and Next buttons for traversing through the traces sequentially.

The screenshot below explains the navigation elements in the Tracing view.

<img class="aligncenter size-full wp-image-25423" src="https://strongloop.com/wp-content/uploads/2015/06/sean9.png" alt="sean9" width="975" height="492" srcset="https://strongloop.com/wp-content/uploads/2015/06/sean9.png 975w, https://strongloop.com/wp-content/uploads/2015/06/sean9-300x151.png 300w, https://strongloop.com/wp-content/uploads/2015/06/sean9-705x356.png 705w, https://strongloop.com/wp-content/uploads/2015/06/sean9-450x227.png 450w" sizes="(max-width: 975px) 100vw, 975px" />

## **Anatomy of a Waterfall** 

Once you select a particular trace sequence, you can drill down into the waterfall view. This view shows the elapsed time for the selected code path across asynchronous boundaries. Each continuous block of Javascript code is represented by a solid rectangle, whose length is proportional to the amount of time spent executing that code. The label of the block shows the most significant function in that sequence of code.

The top bar is the time spent initiating the original function call. The lower bar is the time spent executing the callback function, and the line connecting the two represents the time spent waiting for a response; for example, for a database server to return a value. For more about synchronous versus asynchronous waterfalls, see the documentation at  <http://docs.strongloop.com/display/SLC/Tracing>.

<img class="aligncenter size-full wp-image-25424" src="https://strongloop.com/wp-content/uploads/2015/06/sean21.png" alt="sean21" width="975" height="186" srcset="https://strongloop.com/wp-content/uploads/2015/06/sean21.png 975w, https://strongloop.com/wp-content/uploads/2015/06/sean21-300x57.png 300w, https://strongloop.com/wp-content/uploads/2015/06/sean21-705x134.png 705w, https://strongloop.com/wp-content/uploads/2015/06/sean21-450x86.png 450w" sizes="(max-width: 975px) 100vw, 975px" />

## **Flame Graph**

The next chart, the “flame graph,” is a rich visualization tool, providing information about the application function call stack, and enabling you to see where your app is spending the most time. Typically the flame graph is read bottom up, where the bottom most brick is the root of the call stack tree and the application’s initial call. Each module is displayed in a different colored block and the blocks display function names when available. The selected call is always shown in yellow. The size of each block/brick is proportional to the time spent in the corresponding function. The flame graphs below are a couple of examples that show you the variations in a flame graph based on application execution.

## **Example 1**

<img class="aligncenter size-full wp-image-25425" src="https://strongloop.com/wp-content/uploads/2015/06/sean22.png" alt="sean22" width="975" height="515" srcset="https://strongloop.com/wp-content/uploads/2015/06/sean22.png 975w, https://strongloop.com/wp-content/uploads/2015/06/sean22-300x158.png 300w, https://strongloop.com/wp-content/uploads/2015/06/sean22-710x375.png 710w, https://strongloop.com/wp-content/uploads/2015/06/sean22-705x372.png 705w, https://strongloop.com/wp-content/uploads/2015/06/sean22-450x238.png 450w" sizes="(max-width: 975px) 100vw, 975px" />

## **Example 2**

<img class="aligncenter size-full wp-image-25426" src="https://strongloop.com/wp-content/uploads/2015/06/sean23.png" alt="sean23" width="832" height="687" srcset="https://strongloop.com/wp-content/uploads/2015/06/sean23.png 832w, https://strongloop.com/wp-content/uploads/2015/06/sean23-300x248.png 300w, https://strongloop.com/wp-content/uploads/2015/06/sean23-705x582.png 705w, https://strongloop.com/wp-content/uploads/2015/06/sean23-450x372.png 450w" sizes="(max-width: 832px) 100vw, 832px" />

## **Inspector**

To further detect anomalies around the patterns where most time is spent, use the Inspector to the right.  When you mouse over a brick in the Flame graph, the Inspector displays details of that particular function call. Depending on how far you’ve “drilled down,” the Inspector displays different details, such as module name, cost, top costs, version, and—most importantly—the exact line and column in the source code where the function call occurs!

Below is a screenshot of the Inspector, when you mouse over a brick on the Flame graph.

<img class="aligncenter size-full wp-image-25427" src="https://strongloop.com/wp-content/uploads/2015/06/sean24.png" alt="sean24" width="390" height="692" srcset="https://strongloop.com/wp-content/uploads/2015/06/sean24.png 390w, https://strongloop.com/wp-content/uploads/2015/06/sean24-169x300.png 169w" sizes="(max-width: 390px) 100vw, 390px" />

## **Call Stack**

The call stack contains the same data as presented in the Flame graph, but as you can see, it is in its raw form. As one might expect, clicking on the call stack will update the Inspector details on the right.

<img class="aligncenter size-full wp-image-25428" src="https://strongloop.com/wp-content/uploads/2015/06/sean25.png" alt="sean25" width="975" height="959" srcset="https://strongloop.com/wp-content/uploads/2015/06/sean25.png 975w, https://strongloop.com/wp-content/uploads/2015/06/sean25-80x80.png 80w, https://strongloop.com/wp-content/uploads/2015/06/sean25-300x295.png 300w, https://strongloop.com/wp-content/uploads/2015/06/sean25-36x36.png 36w, https://strongloop.com/wp-content/uploads/2015/06/sean25-705x693.png 705w, https://strongloop.com/wp-content/uploads/2015/06/sean25-450x443.png 450w" sizes="(max-width: 975px) 100vw, 975px" />

## **Conclusion**

The blog got you started quickly with navigating the Tracing UI using a local Process Manager using a basic example app with artificial load.  If you’re ready to use it for production, simply get  your Tracing license, then deploy your application(s) to a remote StrongLoop Process Manager, add the remote host/s to the Arc Process Manager view, and monitor your application on any remote PM as demonstrated here.

## **What’s next?**

  * [Get started](https://strongloop.com/get-started/) with transaction tracing by signing up for StrongLoop Arc and unlocking the tracing module by contacting us at callback@strongloop.com.
  * Read the in-depth [“Node.js Transaction Tracing by Example”](https://strongloop.com/strongblog/node-js-transaction-tracing/) blog
  * Want to see the tracing module in action? [Sign up for our free “Node.js Transaction Tracing” webinar](http://marketing.strongloop.com/acton/form/5334/0049:d-0002/0/index.htm) happening on Friday, June 26 at 10 AM Pacific.
  * Learn more about how tracing works in the [official documentation](http://docs.strongloop.com/display/SLC/Tracing).

&nbsp;