---
id: 16421
title: 'Node.js Performance Tip of the Week: Scaling with Proxies and Clusters'
date: 2014-05-16T08:53:17+00:00
author: Shubhra Kar
guid: http://strongloop.com/?p=16421
permalink: /strongblog/node-js-performance-scaling-proxies-clusters/
categories:
  - Community
  - How-To
  - Performance Tip
---
_Please note that as of Aug 3, 2015, StrongOps has been EOL&#8217;d._

In [last week’s performance tip](http://strongloop.com/strongblog/node-js-performance-tip-cpu-profiler/), we discussed in detail how to diagnose application performance bottlenecks using CPU profiling on Node.js applications. In this go around we look at scaling Node.js applications in production.

## **With great power comes tiny difficulties**

<img class="aligncenter size-full wp-image-16429" src="{{site.url}}/blog-assets/2014/05/hulk1.jpg"  />

Node apps essentially run [single-threaded](http://en.wikipedia.org/wiki/Single_threading), even though file and network events could leverage multiple threads. This architecture thereby binds the performance of each application instance/process to one logical CPU core that the thread it&#8217;s attached to. To a J2EE architect like me, this highlights immaturity in Node as an enterprise ready technology. Application servers like JBoss or Weblogic already solved this 10 years back using server core [multi-threading](http://en.wikipedia.org/wiki/Multithreading_(computer_architecture)) and parallelism. Little did I realize that context switching between threads ate up my memory and I still had a blocking IO problem.

In a way, discovering the lack of threading prepares the Node developer to write scalable asynchronous code and use libraries like web-sockets from the get-go rather than worry about scalability later in the application life cycle. But this code optimization is still capped to the scaling limits of a single CPU core. So, how is production scaling achieved in the Node world today?<!--more-->

## **Proxy-based Scaling**

HTTP proxies are commonly used with web applications for gzip encoding, static file serving, HTTP caching, SSL handling, load balancing and spoon feeding clients. Hence, DevOps teams try to gain the benefits of such web-servers even with Node. However, as Node applications generally have http server capabilities built in &#8211; the use cases are slightly different.

## **Nginx**

[Nginx](http://wiki.nginx.org/Main) is a lightweight and easy to configure web server, which can be used to proxy/reverse-proxy through to Node.js processes. Additionally nginx also supports web-sockets with minimal configuration. Distributing load to specific application processes based on type of work &#8211; example dynamic content rendering vs. static content is a common use case. The Node application hosts can be added to the http handler on nginx and then you could simple match for regular extensions like `~* ^.+\.(jpg|jpeg|css|js)` for static and send it to a subset of hosts in the handler. Similarly you can match for any content without a .(dot) and route to separate set of hosts listed in the http handlers.

## **Apache**

Although Node typically does not need a web server, Node apps are sometimes part of a bigger composite application with components written in PHP or Java servlets. Apache may already be used as http reverse proxy and node has serve up content through the same channel. Running both Apache and Node on port 80 would be conflicting. Hence, there is a module called Proxy Pass which can be enabled in the httpd.conf file: `ProxyPass /node http://host.xyz.com:3000`. This will let Apache send requests to Node apps running on desired host on port 3000.

Also, we will need to make sure that right proxy modules and submodules are loaded for the correct routing to happen. These are generally the `mod_proxy.so` and `mod_http_proxy.so`.

## **Application Level Scaling**

To take advantage of multi-core systems, Node applications can be run as cluster of Node processes to handle the load. However there are programmatic and runtime ways of managing these clusters.

## **node-cluster**

The [node-cluster](http://nodejs.org/api/cluster.html) module which was introduced as of v0.8 is the basic mechanism allowing a master process to spawn worker processes and allowing you to share a socket across multiple networked Node applications. This is achieved using file descriptors and serialization. When you call server.listen(&#8230;) in a worker, it serializes the arguments and passes the request to the master process. If the master process already has a listening server matching the worker&#8217;s requirements, then it passes the handle to the worker. If it does not already have a listening server matching that requirement, then it will create one, and pass the handle to the worker.

Multiple events are messages including term signal are supported out of box. The master &#8211; worker logic is simple, but needs to be implemented within all managed Node applications individually.

Load balancing is taken care of by the underlying OS. However, it is not very efficient and we can have uneven distribution of workload across processes. This problem is being solved using [Cluster-Round-Robin-Load-Balancing](http://strongloop.com/strongblog/whats-new-in-node-js-v0-12-cluster-round-robin-load-balancing/), which is upcoming feature in Node v0.12

The cluster module makes it straightforward for applications that have little or no shared state, or store their shared state that in an external resource like a database or a web service. For managing shared state or session between processes, StrongLoop provides modules like [Strong-Cluster-Connect-Store](http://docs.strongloop.com/display/SLC/Strong+Cluster+Connect+Store)

Node does not automatically manage the number of workers for you, however. It is your responsibility to manage the worker pool for your application&#8217;s needs. Hence improvements have been made to create runtime tooling built on top of node-cluster

## **PM2**

Native clustering was introduced way back in Node v0.6, [PM2](https://github.com/Unitech/pm2) is implemented on top of the same. PM2 itself acts as the master process and wrap your code to add some global or environmental variables into the application files.

PM2 provides many runtime features like keepalive, clustering, controller api, some basic system monitoring and some log aggregation. Also syntactically, it is easy with commands like “pm2 app.js” start for application kick-off or “pm2 monit” for monitoring or “pm2 dump, pm2 kill, pm2 resurrect” for resurrecting applications from hard restart.

However, pm2 will need to be run from each host individually and does not have remote control capabilities, which are essential in larger multi-server installations. It tries to do too many things like application restart on file change, which is not a mature feature like in [nodemon](https://github.com/remy/nodemon).

It also tries to do application monitoring, which under par with Node APM capabilities from NewRelic, AppDynamics or StrongLoop.

## **StrongLoop Cluster Management**

[StrongLoop Cluster Management](http://docs.strongloop.com/display/NODE/Controlling+an+application+cluster) is a production tested clustering and management runtime. Main highlights are a command line runtime tool called “slc” with options like [run](http://docs.strongloop.com/display/SLC/Running+apps+with+slc) (runtime management), [runctl](http://docs.strongloop.com/display/NODE/slc+runctl) (cluster control), [debug](http://docs.strongloop.com/display/SLC/Debugging+applications) (debugging), [arc](http://docs.strongloop.com/display/SLC/Viewing+metrics+with+Arc) (monitoring), [registry](http://docs.strongloop.com/display/NODE/slc+registry) (private registry)

[slc run](http://docs.strongloop.com/display/SLC/Running+apps+with+slc) has options to run as background process (detached), clustered (with options of specifying number of CPU cores), non-profiled, profiled, with Log aggregation and routing options, with ability to send PIDs to file for history tracking and also option of application files to manage (file, directory or package.json)

It does not require any changes to the application files and rather does app-wrapping and uses global environment variables defined in JSON config.

[slc runctl](http://docs.strongloop.com/display/NODE/slc+runctl) provides similar runtime options as node-cluster but in a more graceful and wrapped way without having to change code or manage master-worker synchronization.

You can start, stop, restart, list any processes within a cluster. If any one process in a cluster is terminated or dies due to application error, clusterctl automatically starts up another process and attaches it to the liver cluster master without having to restart the application instances. This is also called as “Zero Downtime” in Node.

Runctl lets you size the number of processes in the cluster at startup; but also lets you [resize](http://docs.strongloop.com/display/SLC/Control+an+application+cluster) the cluster on the fly with options like set-size. Additional capabilities include disconnect &#8211; disconnecting a process from a cluster or fork &#8211; forking or replacing an active process in a cluster with another process for inspecting the original process.

In case, a faulty deployment is pushed out to a cluster, StrongLoop clusterctl ensures rolling restarts, so that if the first process being restarted crashes, then the deployment is not pushed out to the remaining processes in the cluster. If the issues on the faulty code is fixed on the fly, clusterctl also has hot deploy capability to auto-correct the faulty process and restore it.

StrongLoop cluster control has both a CLI as well as a Web interface. The Web interface allows to remotely manage multiple clusters running on multiple hosts from a single console, which provides ease of runtime management.

## **What’s next?**

<ul>
<li>What’s in the upcoming Node v0.12 release? <a href="http://strongloop.com/strongblog/performance-node-js-v-0-12-whats-new/">Big performance optimizations</a>! Read <a href="https://github.com/bnoordhuis">Ben Noordhuis’</a> blog to learn more.</span>
</li>
<li>Watch <a href="https://github.com/piscisaureus">Bert Belder’s</a> comprehensive <a href="http://strongloop.com/developers/videos/#whats-new-in-nodejs-v012">video </a>presentation on all the new upcoming features in v0.12</span>
</li>
</ul>
