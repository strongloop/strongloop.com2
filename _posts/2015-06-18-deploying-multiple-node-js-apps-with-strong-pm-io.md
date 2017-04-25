---
id: 25320
title: Deploying Multiple Node.js Apps with strong-pm.io
date: 2015-06-18T08:00:32+00:00
author: Chanda Dharap
guid: https://strongloop.com/?p=25320
permalink: /strongblog/deploying-multiple-node-js-apps-with-strong-pm-io/
categories:
  - Community
  - How-To
  - Node DevOps
---
We recently introduced [Strongloop Process Manager](https://strongloop.com/strongblog/node-js-process-manager-cluster-load-balancer/) and how to build, deploy and manage your processes in production. Since then, StrongLoop has been working to take StrongLoop PM to its its next level. In our series of ongoing incremental improvements, here is the newest addition: the ability to deploy multiple apps with process manager to handle real-world deployment scenarios.

<img class="aligncenter size-full wp-image-25323" src="https://strongloop.com/wp-content/uploads/2015/06/Screen-Shot-2015-06-17-at-2.48.37-PM.png" alt="Screen Shot 2015-06-17 at 2.48.37 PM" width="700" height="352" srcset="https://strongloop.com/wp-content/uploads/2015/06/Screen-Shot-2015-06-17-at-2.48.37-PM.png 700w, https://strongloop.com/wp-content/uploads/2015/06/Screen-Shot-2015-06-17-at-2.48.37-PM-300x151.png 300w, https://strongloop.com/wp-content/uploads/2015/06/Screen-Shot-2015-06-17-at-2.48.37-PM-450x226.png 450w" sizes="(max-width: 700px) 100vw, 700px" />

While conceptually simple, going multi-app affects everything. The status output, the deploy and control commands, all need to be extended so it’s possible to qualify the app to which the command applies. So here’s a quick walk-through of the changes to the commands. This blog assumes that you are all already familiar with StrongLoop PM and its tools, if not, see <http://strong-pm.io/prod>.

First, an overview and some terminology. StrongLoop PM has multiple named services, each of which can run an application. In theory, the application can be run on one or more executors on remote hosts. With strong-pm the app only runs on a single host, so there is only one executor, executor \`1\`. An app, run by a service, on an executor is called an “instance” of the app. An app instance in turn, consists of a node cluster, the cluster master, worker ID \`0\`, and some number of workers, with worker IDs greater than zero. And of course, every process has an operating system process ID.

Some commands, such as deploy, target a service in general. Some, such as cpu-start, are specific to a worker process. Services are identified by name or ID, and processes are identified by service, executor (always \`1\` for now), and the ID of the worker. The ID can be specified as either the OS process ID (PID), or the Node cluster worker ID (both are listed in the status output).

On to the commands and what exactly has changed.

## **Deploy**

Recall you use the slc deploy command to deploy an application to StrongLoop PM. In a multi-app world, when you deploy an app you need to specify what service to deploy it to. To support this, \`slc deploy\` now has a \`-s,&#8211;service\` option. Services can be specified by name or by numeric ID, in the case of existing services. Service ID is listed by the \`slc status\` command.

The service will be auto-created if it doesn’t already exist.

For example the following command deploys the app in your working directory to a service named “imager”, creating it if necessary.

```sh
slc deploy -s imager
```

The service name is optional, it defaults to the application name from the \`package.json\`.

## **Global PM commands**

There are several new “global” commands, that is, commands that don’t apply just to a single application/service:

  * \`slc ctl info\` &#8211; Displays the process manager’s working dir, port, and versions
  * \`slc clt ls\` &#8211; Lists the known services
  * \`slc ctl shutdown\` &#8211; This has been around, and shuts down Process Manager.

## **Status command** 

The output of the \`slc ctl\` status command has been completely reworked. It now lists multiple services, their environment variables, processes, and process state. The output contains all the information needed to call commands specific to services or workers.  For example:

```js
Service ID: 1
Service Name: strong-pm
Environment variables:
  No environment variables defined
Instances:
    Version  Agent version  Cluster size
     4.1.1       1.5.1            4
Processes:
        ID      PID   WID  Listening Ports  Tracking objects?  CPU profiling?
    1.1.16710  16710   0
    1.1.16734  16734   1     0.0.0.0:3001
    1.1.16752  16752   2     0.0.0.0:3001
    1.1.16769  16769   3     0.0.0.0:3001
    1.1.16788  16788   4     0.0.0.0:3001

Service ID: 4
Service Name: loopback-example-app
Environment variables:
    Name   Value
    REDIS  http://redis.example.com:9876
Instances:
    Version  Agent version  Cluster size
     4.1.1       1.5.1            4
Processes:
        ID      PID   WID  Listening Ports  Tracking objects?  CPU profiling?
    4.1.22839  22839   0
    4.1.22849  22849   1
    4.1.22855  22855   2
    4.1.22861  22861   3
    4.1.22867  22867   4
```

## **Create or remove services**

The \`slc ctl\` create command creates a service.  At the moment, there isn’t much point in creating services before deploying to them. However, this capability will be needed in our next iteration of strong-pm, when strong-pm is multi-host.

The \`slc ctl\` remove command removes a service, shutting down all its instances, and removing its deployed code. Its pretty final, though you can always deploy again.

## **Other service oriented commands**

The old single-app commands that did NOT take a worker/process ID still exist, but now take a mandatory service argument, either the name or ID of a service. See \`slc ctl -h\` for the list, they should be familiar, they just have a new mandatory argument.

## **Other worker/process oriented commands**

Commands that used to take a worker or process ID now take a WRK specification, like 1.1.0 (the cluster master of service 1, executor 1), or 2.1.43768 (the worker with pid 43768 of service 2, executor 1).

We are also actively working on adding multi-app support into the [StrongLoop Arc](https://strongloop.com/node-js/arc/) UI. In the current Arc release, however, strong-pm will only display and act on service 1 (the first application) in the Arc UI and ignores other apps.  To access additional apps, you will need to use the CLI.  Stay tuned if you want to use the Arc UI to get all the multi-app goodness!

Watch this space as we continue to enhance the StrongLoop Process Manager. Tomorrow we&#8217;ll show you how to deploy dockerized apps using the Process Manager.

&nbsp;