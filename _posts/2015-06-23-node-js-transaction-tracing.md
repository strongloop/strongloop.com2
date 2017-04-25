---
id: 25362
title: Node.js Transaction Tracing Deep-Dive By Example
date: 2015-06-23T06:30:51+00:00
author: Tetsuo Seto
guid: https://strongloop.com/?p=25362
permalink: /strongblog/node-js-transaction-tracing/
categories:
  - Arc
  - Community
  - Node DevOps
---
StrongLoop recently announced a public beta of a Node.js transaction tracing module (read the [announcement blog](https://strongloop.com/strongblog/transaction-tracing-node-js-root-cause/) or watch the overview and demo [video](https://www.youtube.com/watch?v=svgVWZcUXsc)) within [StrongLoop Arc](https://strongloop.com/node-js/arc/) to identify performance bottlenecks. In this blog we walk you through a sample application and insights into the patterns that emerge while conducting a Node.js transaction trace.

## **How Tracing works**

StrongLoop tracing monitors your Node application by:

  * Tracing JavaScript functions entry and exit points to record the elapsed time of each function call and the position of the function call in the source file. Tracing instruments every function in your application as well as the packages your application requires.
  * Wrapping all HTTP and HTTPS requests and database operations of MySQL, PostgreSQL, Oracle, Redis, MongoDB, and Memcache/Memcached.

&nbsp;

## **A DoS use case**

In this blog, we’re going to analyze behavior of a simple application that implements one Oracle database transaction responding to GET / HTTP request. We’ll consider a hypothetical scenario in which your website gets a denial-of-service (DoS) attack that generates unusual CPU load.

We’ll use an example and demonstrate how to analyze the tracing data and drill down to the specific source code line of the vulnerability exploited by the simulated DoS attack.

<img class="aligncenter size-full wp-image-25363" src="https://strongloop.com/wp-content/uploads/2015/06/tracing1.png" alt="tracing1" width="975" height="392" srcset="https://strongloop.com/wp-content/uploads/2015/06/tracing1.png 975w, https://strongloop.com/wp-content/uploads/2015/06/tracing1-300x121.png 300w, https://strongloop.com/wp-content/uploads/2015/06/tracing1-705x283.png 705w, https://strongloop.com/wp-content/uploads/2015/06/tracing1-450x181.png 450w" sizes="(max-width: 975px) 100vw, 975px" />

<!--more-->

The core portion of the source code in the sample app, server.js is shown above. This file has both client and server functionality.  On the client side (not in the screenshot), it repeatedly sends a GET / HTTP request to the server every second. The app responds to the HTTP request by calling a single function named dbAccess() that submits a SELECT command to a remote Oracle database.

The app introduces an artificial vulnerability which we will analyze using the newly released Tracing module in Arc. This sample app works fine with positive parameter values, but with zero or negative values, it generates huge CPU load. Specifically, the vulnerability is in line#24, where \`dbAccess()\` function uses the client-supplied parameter value in the SQL statement without validation.

## **Timeline view and drill down**

Browse through the “Timeline View” on the Tracing module. This chart displays CPU load and process heap usage and serves as a tool to quickly pick a time slice into which you want to drill down.  You can also easily slide the cursor (the black vertical line) and examine the  HTTP/HTTPS/database operations that occurred in the time slice.

<img class="aligncenter size-full wp-image-25365" src="https://strongloop.com/wp-content/uploads/2015/06/tracing2.png" alt="tracing2" width="552" height="410" srcset="https://strongloop.com/wp-content/uploads/2015/06/tracing2.png 552w, https://strongloop.com/wp-content/uploads/2015/06/tracing2-300x223.png 300w, https://strongloop.com/wp-content/uploads/2015/06/tracing2-450x334.png 450w" sizes="(max-width: 552px) 100vw, 552px" />
  
The Timeline View is updated in real-time every 20 seconds and shows data up to the last five hours. This storage interval may change in the future.

<img class="aligncenter size-full wp-image-25367" src="https://strongloop.com/wp-content/uploads/2015/06/tracing3.png" alt="tracing3" width="975" height="246" srcset="https://strongloop.com/wp-content/uploads/2015/06/tracing3.png 975w, https://strongloop.com/wp-content/uploads/2015/06/tracing3-300x76.png 300w, https://strongloop.com/wp-content/uploads/2015/06/tracing3-705x178.png 705w, https://strongloop.com/wp-content/uploads/2015/06/tracing3-450x114.png 450w" sizes="(max-width: 975px) 100vw, 975px" />

The annotations below explain what you’re seeing in the example screenshot above. Using a selected time slice, we can drill down on the data gathered by running the sample app.

**1- Blue and orange lines**

The blue line is the [operating system CPU load average](https://en.wikipedia.org/wiki/Load_(computing)) for the last minute. Likewise, the orange line shows process heap memory used in MB. If you are tracing two or more processes, the load average line (blue) should be the same for all the processes because it’s a system-level metric, but the process heap used line (orange) varies from process to process.

**2 &#8211; Data Points: 893**

Each data point corresponds to one tracing data set garnered for the time slice. StrongLoop tracing determines the interval value to be between 20 seconds and 25 seconds at tracing start time to randomize the load on tracing database in case there are multiple processes. The screenshot covers five hours (300 min.) between approximately 5:15 AM to 10:15 AM.  The five hour data is sliced into 893 data points or time slices. Each time slice represents tracing interval of 300 min. / 893 = 20.1 sec on average.

**3 &#8211; Orange triangles**

The orange triangles indicate when either the load average or memory used during the time slice exceeded [3-sigma](https://en.wikipedia.org/wiki/Standard_deviation) variation. Tracing has a standard deviation based statistical model built in. Using the model, tracing marks those anomalous time slices in real-time. The model is re-calculated once every 10 minutes using all the data points gathered at that point. For example, with our sample app, since the memory use (orange line) is well distributed, all the orange rectangles are most likely load average anomalies.

## **Trace sequences view**

The screenshot below shows the cursor at Sun. June 21st 2015, 6:45:17 AM. When you click at that point, tracing displays all the trace sequences that occurred in time interval (20.1 sec. in our DoS example app) before 6:45:17 AM. Let’s examine the Trace Sequences that happened in that time slice.

<img class="aligncenter size-full wp-image-25368" src="https://strongloop.com/wp-content/uploads/2015/06/tracing4.png" alt="tracing4" width="975" height="784" srcset="https://strongloop.com/wp-content/uploads/2015/06/tracing4.png 975w, https://strongloop.com/wp-content/uploads/2015/06/tracing4-300x241.png 300w, https://strongloop.com/wp-content/uploads/2015/06/tracing4-705x567.png 705w, https://strongloop.com/wp-content/uploads/2015/06/tracing4-450x362.png 450w" sizes="(max-width: 975px) 100vw, 975px" />

You’ll see two kinds of trace sequences:

  * HTTP/HTTPS transactions such as ‘request’ and ‘serve’
  * Database transactions such as MySQL, PostgreSQL, Oracle, Redis, Memcache, Memcached and MongoDB. In our example, Oracle transactions are shown.

Note_: “request” is a HTTP client-side operation, while “serve” is a server-side operation.  In a real-world scenario, your web app is a server app. The screenshots here show both because the sample DoS app has both client and server built into the same app._

The numbers shown in green circles indicate the number of function call patterns associated with a specific trace sequence. Usually the count is 1 which means there was only one function call pattern associated with the trace sequence. There are similar patterns across the five hour, 893 time slices in our sample case.

It’s important to get a good understanding of the baseline behavior of your app. Let’s click ‘Oracle SELECT’ trace sequence and look into the function call pattern of our sample app in this baseline case.

## **Function call pattern visualization as flame graph**

In the sample app, the database operation “Oracle SELECT” is invoked to serve the GET / HTTP request implemented in \`server.js\` as the \`dbAccess()\` function as shown in the source code screenshot.

This view is called the waterfall or flame graph view. The screenshot below shows the waterfall view of the dbAccess call portion of the ‘Oracle SELECT’ trace sequence represented by \`server.js#dbAccess\` function call.

<img class="aligncenter size-full wp-image-25369" src="https://strongloop.com/wp-content/uploads/2015/06/tracing5.png" alt="tracing5" width="975" height="950" srcset="https://strongloop.com/wp-content/uploads/2015/06/tracing5.png 975w, https://strongloop.com/wp-content/uploads/2015/06/tracing5-300x292.png 300w, https://strongloop.com/wp-content/uploads/2015/06/tracing5-36x36.png 36w, https://strongloop.com/wp-content/uploads/2015/06/tracing5-705x687.png 705w, https://strongloop.com/wp-content/uploads/2015/06/tracing5-450x438.png 450w" sizes="(max-width: 975px) 100vw, 975px" />

**1 &#8211; http#OutgoingMessage.prototype.end and 59 functions**

This indicates that 1 + 59 function calls appear in the flame graph. Each ‘brick’ of  the flame graph corresponds to a function. There are 60 bricks in the flame graph. Tracing picks one brick to represent the entire flame graph.

**2 &#8211; Disabled (dimmed) left and enabled (active) right arrows**

Since there are two waterfall in this case, left arrow is greyed out and right arrow is active. By clicking the active arrow, you can navigate to the next waterfall or flame graph associated with the trace sequence.

**3 &#8211; Synchronous and Asynchronous waterfall**

Usually, there are two sync lines, initiation (displayed on the left edge) and callback (displayed on the right edge), and one async line connecting the two sync lines. Sync line is displayed as a box (could be horizontally very thin). Async line is a line drawn from the initiation sync line to the callback sync line.

In the screenshot above, the initiation sync line is selected (yellow background with a hand-drawn red underline) that says server.js#dbAccess where the ‘Oracle SELECT’ command is initiated. The callback function is passed along with the ‘Oracle SELECT’ command and is called with the result of the DB command.

“Total Execution Time” is 73.89 milliseconds that includes both initiation and callback as well as wait time between the two.

**4 &#8211; Inspector:eventLoop** 

When you move the mouse over a sync line in the Synchronous and Asynchronous Waterfall, the Inspector dynamically displays pertinent details.  In the above example, the initiation sync line (\`server.js#dbAccess\`) is selected. The Inspector then displays information associated with the initiation sync line: it shows that the \`dbAccess\` function took 14% of the entire time spent in both initiation and callback sync operations.

“**Name**” of the Inspector.eventLoop says “createApplication>app”, shown in the flame graph as the second-from-the-bottom brick in yellow background as “express#createApplication>app.”  That’s the root of the function call stack of the initiation sync.  From there, climbing up the flame graph bricks to the top brick \`server.js#dbAccess\`.

“**Cost**” shows that the total time spent in initiation and callback sync lines is 349 microseconds. Among all the functions (bricks on the flame graph) of the initiation portion, the **Top Cost** function is \`dbAccess\` which spent 14% of the total 349 microseconds.

## **Locate specific line in the source**

Now, hover the mouse over the flame graph.  The Inspector shows the corresponding source code line, labeled as “Inspector: flame.”  For example, in the screenshot below, the function \`dbAccess()\` is called on the \`dbAccess call\` (initiation) portion of the call stack.  This is line #23 in \`server.js\`.

<img class="aligncenter size-full wp-image-25370" src="https://strongloop.com/wp-content/uploads/2015/06/tracing6.png" alt="tracing6" width="975" height="965" srcset="https://strongloop.com/wp-content/uploads/2015/06/tracing6.png 975w, https://strongloop.com/wp-content/uploads/2015/06/tracing6-80x80.png 80w, https://strongloop.com/wp-content/uploads/2015/06/tracing6-300x297.png 300w, https://strongloop.com/wp-content/uploads/2015/06/tracing6-36x36.png 36w, https://strongloop.com/wp-content/uploads/2015/06/tracing6-705x698.png 705w, https://strongloop.com/wp-content/uploads/2015/06/tracing6-120x120.png 120w, https://strongloop.com/wp-content/uploads/2015/06/tracing6-450x445.png 450w" sizes="(max-width: 975px) 100vw, 975px" />

## **Function call pattern of anomalous system behavior** 

The sample web app supports a REST API which takes a user ID (positive integer) and makes a database call with the user ID to get a record of the user, then processes the returned user record in the callback function that is passed to the database call. Suppose the database call returns user records for all the users if user ID is zero.

Let’s examine how tracing can help detect the system behavior under such an anomalous condition.  While the 3-sigma model is too naive to be effective in all cases, we can still use it as a starting point. In the above graph, we see several peaks in the blue load average line. The built-in 3-sigma model detected and marked those peaks with the orange triangles. The orange triangles are an indicator of anomalous behavior.

When we click one of the triangles, say, at the June 21st 6:58:02 AM time slice, we note that there are three trace sequences that show 92% of the time spent in the sync portion of the code.  From the baseline analysis, we know usually less than 1% of the time is spent in the sync portion, i.e, your app code.  Why is that much time spent in the June 21st 6:58:02 AM time slice?

Let’s select the ‘Oracle SELECT’ trace sequence and examine the waterfalls/flame graph to understand further.

<img class="aligncenter size-full wp-image-25371" src="https://strongloop.com/wp-content/uploads/2015/06/tracing7.png" alt="tracing7" width="975" height="940" srcset="https://strongloop.com/wp-content/uploads/2015/06/tracing7.png 975w, https://strongloop.com/wp-content/uploads/2015/06/tracing7-300x289.png 300w, https://strongloop.com/wp-content/uploads/2015/06/tracing7-36x36.png 36w, https://strongloop.com/wp-content/uploads/2015/06/tracing7-705x680.png 705w, https://strongloop.com/wp-content/uploads/2015/06/tracing7-450x434.png 450w" sizes="(max-width: 975px) 100vw, 975px" />

## **Function call pattern of anomalous system behavior** 

The flame graph looks very different from the baseline pattern observed earlier.  It shows that the time is almost entirely spent in the callback call part of “Oracle SELECT’ processing.   The inspector: eventLoop shows that 99.9% of the time is spent in the \`generateCpuLoad()\` function which is our artificial load generation when user ID = 0 is passed to simulate the load of processing all the user records.  Also note that there are both \`dbAccess call\` and \`callback\` portion in this flame graph.  The graph is just dominated by \`generateCpuLoad()\` function call.

Do you see the color scheme of the bricks below match with the previous screenshot?

<img class="aligncenter size-full wp-image-25372" src="https://strongloop.com/wp-content/uploads/2015/06/tracing8.png" alt="tracing8" width="975" height="986" srcset="https://strongloop.com/wp-content/uploads/2015/06/tracing8.png 975w, https://strongloop.com/wp-content/uploads/2015/06/tracing8-80x80.png 80w, https://strongloop.com/wp-content/uploads/2015/06/tracing8-297x300.png 297w, https://strongloop.com/wp-content/uploads/2015/06/tracing8-36x36.png 36w, https://strongloop.com/wp-content/uploads/2015/06/tracing8-697x705.png 697w, https://strongloop.com/wp-content/uploads/2015/06/tracing8-120x120.png 120w, https://strongloop.com/wp-content/uploads/2015/06/tracing8-450x455.png 450w" sizes="(max-width: 975px) 100vw, 975px" />

## **Pinpointing the source**

Hovering the mouse over the flame graph and looking the Inspector, you can see that the root of this anomalous behavior is at line #18 of \`generateCpuLoad()\` function in \`server.js\`.  The next brick of the flame graph (in light purple in the screenshot below) shows that the \`generateCpuLoad()\` function is called in the callback passed to \`oracle_DB.execute()\`.

Reading the source, it shows that we are passing a query string to  \`oracle_DB.execute()\`. This query string contains user ID which is required for the database access. The way we create the query string in the line #24 of the function  \`dbAccess()\` is incorrect. It blindly uses the user ID parameter without checking the validity. Remember that in case user ID = 0, the database call returns user records for all the users, which is not supposed to be used by the REST API. Somebody exploited this vulnerability and passed user ID: 0 to the REST API.  All user data are processed every time this vulnerability is exploited and the CPU load average jumps.  If somebody repeatedly calls the REST API with parameter: 0, CPU load would continue to increase and eventually hit the point where the app can not serve any legitimate service calls.  This exposes our denial of service attack and vulnerability in the \`dbAccess()\` function.

<img class="aligncenter size-full wp-image-25373" src="https://strongloop.com/wp-content/uploads/2015/06/tracing9.png" alt="tracing9" width="975" height="994" srcset="https://strongloop.com/wp-content/uploads/2015/06/tracing9.png 975w, https://strongloop.com/wp-content/uploads/2015/06/tracing9-294x300.png 294w, https://strongloop.com/wp-content/uploads/2015/06/tracing9-36x36.png 36w, https://strongloop.com/wp-content/uploads/2015/06/tracing9-692x705.png 692w, https://strongloop.com/wp-content/uploads/2015/06/tracing9-450x459.png 450w" sizes="(max-width: 975px) 100vw, 975px" />

## **Function call pattern visualization raw data**

Tracing provides the same function call stack information in “raw data” text form as well. You can scroll down and see the text form below the flame graph.  Note that both flame graph and the raw data form show exactly the same information.

The text form shows deep call stack of the \`dbAccess\` call part and shallow call stack for the callback part.  The two call stack structure is very similar to the one in normal baseline case. However, the flame graph visualization of the anomalous case looks very different because the graph draws each brick in the size proportional to the time spent in the corresponding function.

<img class="aligncenter size-full wp-image-25374" src="https://strongloop.com/wp-content/uploads/2015/06/tracing10.png" alt="tracing10" width="975" height="1517" srcset="https://strongloop.com/wp-content/uploads/2015/06/tracing10.png 975w, https://strongloop.com/wp-content/uploads/2015/06/tracing10-193x300.png 193w, https://strongloop.com/wp-content/uploads/2015/06/tracing10-662x1030.png 662w, https://strongloop.com/wp-content/uploads/2015/06/tracing10-964x1500.png 964w, https://strongloop.com/wp-content/uploads/2015/06/tracing10-453x705.png 453w, https://strongloop.com/wp-content/uploads/2015/06/tracing10-450x700.png 450w" sizes="(max-width: 975px) 100vw, 975px" />

## **Conclusion**

In conclusion we see how the visualization in Tracing helps quickly detect anomalous behaviors of your Node application and analyze root cause of your app’s anomalous behavior down to the source code line.

Additionally we can say with confidence that the overhead incurred by tracing for a computation-intensive application is 10 to 15%.  With the sample application used in this blog, I measured timing of \`dbAccess()\` using \`process.hrtime()\`.  The average and standard-deviation of \`dbAccess()\` function execution time over 100 measurements were 75.97 msec/0.88 msec with tracing enabled.  With tracing disabled, they were 74.90 msec/1.10 msec.  There is no statistically-significant difference: the tracing overhead in this case is negligible, which is expected because the remote database access takes tens of milliseconds in this example case.

## **What&#8217;s next?**

  * [Get started](https://strongloop.com/strongblog/node-js-tracing-quickstart/) with transaction tracing by signing up for StrongLoop Arc and unlocking the tracing module by contacting us at callback@strongloop.com.
  * Want to see the tracing module in action? [Sign up for our free &#8220;Node.js Transaction Tracing&#8221; webinar](http://marketing.strongloop.com/acton/form/5334/0049:d-0002/0/index.htm) happening on Friday, June 26 at 10 AM Pacific.
  * Learn more about how tracing works in the [official documentation](http://docs.strongloop.com/display/SLC/Tracing).

&nbsp;