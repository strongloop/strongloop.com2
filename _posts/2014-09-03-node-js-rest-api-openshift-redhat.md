---
id: 19738
title: 'How to Deploy a Node.js REST API Server on Red Hat&#8217;s OpenShift'
date: 2014-09-03T08:11:03+00:00
author: Shubhra Kar
guid: http://strongloop.com/?p=19738
permalink: /strongblog/node-js-rest-api-openshift-redhat/
categories:
  - Cloud
  - How-To
  - LoopBack
---
The world is moving toward the cloud—both public and private clouds—and infrastructure demands are giving rise to a new generation of integration platform-as-a-service (iPaaS) API servers which specifically handle this use case with the added dimension of cloud versus your own datacenter. Node.js is powering these new iPaaS products because it&#8217;s dynamic, highly scriptable, and high-performance. Node hits the sweet spot because it enables developers to glue together disparate pieces of legacy infrastructure and quickly surface an API for next-generation web and mobile applications. Ultimately, it promises to address the emerging requirements for the internet of things (IoT).
<!--more-->
## What is OpenShift?##

<img class="aligncenter size-full wp-image-19739" src="{{site.url}}/blog-assets/2014/09/Openshift.png" alt="Openshift" width="620" height="265"  />

OpenShift is one of the most popular PaaS (Platform as a Service) provider used by developers worldwide. OpenShift supports Node.js and StrongLoop API server platforms with default built in cartridges.

## StrongLoop API Server highlights## 

For organizations looking to leverage OpenShift for their omni-channel API / ESB initiatives, StrongLoop’s API Server offers many advantages:

- On-premise – take control of your BaaS  and run it in your datacenter or on your own cloud infrastructure. 
- Powered by <a href="http://loopback.io/">LoopBack</a> – the leading, open source API framework project built 100% in Node.js .
- Built in mBaaS with <a href="http://docs.strongloop.com/display/LB/Push+notifications">Push</a> , <a href="http://docs.strongloop.com/display/LB/GeoPoint+class">Geopoint</a> , <a href="http://strongloop.com/node-js/mbaas/#social-login">Social Login</a>, <a href="http://strongloop.com/node-js/mbaas/#storage-service">Storage</a>, etc. 
- <a href="http://docs.strongloop.com/display/LB/Synchronization">Offline sync</a> – isomorphic JavaScript front to back with conflict resolution and a variety of sync algorithms supported.
- <a href="http://docs.strongloop.com/display/LB/Synchronization">Replication</a> – client to server, server to client, app to app and database to database.
- <a href="http://strongloop.com/node-js/connectors/">Connectors</a> to interface and autodiscover new and existing datasources including RDBMS, NoSQL and proprietary backends.
- <a href="http://strongloop.com/node-js/controller/">Controller</a> to automate DevOps tasks like clustering, debugging, log management, build and deploy. 
- <a href="http://strongloop.com/node-js/monitoring/">Monitoring</a> to provide deep application performance visibility and deep profiling in production. 

Here’s how to get started with Openshift and StrongLoop in four simple steps&#8230;

## Step 1: Create an OpenShift account##

Login at at [http://www.openshift.co](http://www.openshift.com/)m/. Create an account if you don&#8217;t already have one.

Ensure you have the latest version of the [client tools](https://www.openshift.com/get-started#cli). As part of this process, you&#8217;ll run the rhc setup command and choose a unique name (called a namespace) that becomes part of your public application URL.

For example On OS X, you&#8217;ll need to install either the [Full Xcode Suite](http://developer.apple.com/xcode) – or – [git for OS X](http://code.google.com/p/git-osx-installer/). These packages ensure that Ruby and Git are installed and configured.

Install the gem using:

```sh
$ sudo gem install rhc
```

To update to the latest version of the client tools, use the gem update command:

```sh
$ gem update rhc
```

Using your OpenShift login and password, run $ rhc setup to connect to OpenShift and create a unique namespace for your applications.

## Step 2: Create a Loopback API application##

Create an application on OpenShift with the following command:

```sh
$ rhc app create MyApi https://raw.github.com/strongloop/openshift-cartridge-strongloop/master/metadata/manifest.yml
```

Replace &#8220;myAPI&#8221; with your application name. You&#8217;ll see the following message printed on your console:

```sh
The cartridge 'https://raw.github.com/strongloop/openshift-cartridge-strongloop/master/metadata/manifest.yml' will be
downloaded and installed:
Application Options
-------------------
Domain: strongdemo
Cartridges: https://raw.github.com/strongloop/openshift-cartridge-strongloop/master/metadata/manifest.yml
Gear Size: default
Scaling: no

Creating application 'MyApi' ...
```

Give it a few minutes to complete provisioning of the API server. Once complete you will see the following message printed on the console:

```sh
Creating application 'MyApi' ... done

Waiting for your DNS name to be available ... done

Cloning into 'myapi'...
The authenticity of host 'myapi-strongdemo.rhcloud.com (107.20.8.255)' can't be established.
RSA key fingerprint is cf:ee:77:cb:0e:fc:02:d7:72:7e:ae:80:c0:90:88:a7.
Are you sure you want to continue connecting (yes/no)?
```

Select &#8220;yes&#8221;, which will deploy the app finally to OpenShift as well as clone a replica of the deployed app on to your local machine.

```sh
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added 'myapi-strongdemo.rhcloud.com,107.20.8.255' (RSA) to the list of known hosts.
Checking connectivity... done

Your application 'myapi' is now available.

URL: http://myapi-strongdemo.rhcloud.com/
SSH to: 5400b85c5004467ec9000337@myapi-strongdemo.rhcloud.com
Git remote: ssh://5400b85c5004467ec9000337@myapi-strongdemo.rhcloud.com/~/git/myapi.git/
Cloned to: /Users/shubhrakar/myapi

Run 'rhc show-app MyApi' for more details about your app.
```

As printed on the console output, we can see that the provisioned api application is available on a Red Hat cloud url and also has SSH and Git urls for access. Additionally the project has been cloned to my home folder on my local machine i.e. under `/users/username/`

Logging into OpenShift we can see the application name and details published under the “applications” tab:
  
<img class="aligncenter size-full wp-image-19746" src="{{site.url}}/blog-assets/2014/09/Openshift_firstAPI.png" alt="Openshift_firstAPI" width="1600" height="609"  />
  
Clicking on the app name lets us see the provisioned specifications of the host system, remote url information as well as gives us options to add multiple backends like MongoDB, MySQL or PostgreSQL to this API application.
  
<img class="aligncenter size-full wp-image-19747" src="{{site.url}}/blog-assets/2014/09/Openshift_App_Detail.png" alt="Openshift_App_Detail" width="1600" height="705"  />
  
Let's open a browser and type in the <app-URL>/explorer, which in our case would be <http://myapi-strongdemo.rhcloud.com/explorer>. 

Below we can see StrongLoop’s API explorer which provides an interface to visualize and test the out of box default APIs. As Loopback advocates and follows [Model driven development](http://strongloop.com/strongblog/node-js-api-tip-model-driven-development/), the User Model is created by default along with all the CRUD endpoints&#8230;
  
<img class="aligncenter size-full wp-image-19748" src="{{site.url}}/blog-assets/2014/09/BaseApp_Explorer.png" alt="BaseApp_Explorer" width="1324" height="1448"  />

## Step 3: Update the Loopback API##

Now let’s try to update this API application by adding some custom models and API endpoints.

```sh
$ slc loopback:datasource myMongoDB
```

First of all, we will create a datasource for myAPI application.We will start with a MongoDB type datasource.

```sh
[?] Enter the data-source name: (myMongoDB)
```

As Loopback supports MongoDB out of box from it’s large list of connectors, we will choose the default connector type for our datasource.

```sh
[?] Select the connector for myMongoDB:
 PostgreSQL (supported by StrongLoop)
 Oracle (supported by StrongLoop)
 Microsoft SQL (supported by StrongLoop)
❯ MongoDB (supported by StrongLoop)
 SOAP webservices (supported by StrongLoop)
 REST services (supported by StrongLoop)
 Neo4j (provided by community)
(Move up and down to reveal more choices)
```

This will create the datasource definition and we can see the same in the <AppHome>/server/datasources.json file. The contents look like below:

```sh
{
 "db": {
   "name": "db",
   "connector": "memory"
 },
 "myMongoDB": {
   "name": "myMongoDB",
   "connector": "mongodb"
 }
}
```

Note that the actual mongodb host and port information still needs to be updated in the json. We can add a MongoDB instance on OpenShift and simply point at that within the connector. Please see [working with MongoDB or MongoLab](http://docs.strongloop.com/display/LB/MongoDB+connector)

Now let’s create a basic model which is attached to this MongoDB datasource:

```sh
$ slc loopback:model
[?] Enter the model name: Account
[?] Select the data-source to attach Account to:
 db (memory)
❯ myMongoDB (mongodb)
```

As prompted, we can choose to expose the created API over REST and also provide a custom plural name for the account model.

```sh
[?] Expose Account via the REST API? (Y/n) : Y
[?] Custom plural form (used to build REST URL):
```

We can now add model properties following the prompts and also if the model follows backend schema validation by setting  the “required” property.

```sh
Let's add some Account properties now.
Enter an empty property name when done.

[?] Property name: AccountNumber
  invoke   loopback:property
[?] Property type:
 string
❯ number
 boolean
 object
 array
 date
 buffer
 geopoint
 (other)
[?] Required? Yes
```

Similarly we will define additional properties of this model.

```sh
Let's add another Account property.
Enter an empty property name when done.
[?] Property name: FirstName
  invoke   loopback:property
[?] Property type: string
[?] Required? Yes
Let's add another Account property.
Enter an empty property name when done.
[?] Property name: DOB
invoke   loopback:property
[?] Property type: date
[?] Required? Yes
```

We will also install the MongoDB connector module of LoopBack as that is a required dependency for the model to work.

```sh
npm install loopback-connector-mongodb --save
```

## Step 4: Republish/update the deployment##

Now let us try to publish this updated `myAPI` application to OpenShift. We will be using `git` commands as described below for doing that. We will initialize the project in git, add our new files and commit to the git repository

```sh
$ git init
$ git add -A
$ git commit -a -m "Initial Commit"
```

To update the same project on OpenShift we need the Git URL. When we provisioned the app, we got the GitURL as :

```sh
Git remote: ssh://5400b85c5004467ec9000337@myapi-strongdemo.rhcloud.com/~/git/myapi.git/
```

In case we forget that we can extract the URL info  from the OpenShift console or by using the git command:


```sh
$ rhc app show myapi
myapi @ http://myapi-strongdemo.rhcloud.com/ (uuid: 5400b85c5004467ec9000337)

-----------------------------------------------------------------------------

 Domain:     strongdemo
 Created:    Aug 29 10:29 AM
 Gears:      1 (defaults to small)
 Git URL:    ssh://5400b85c5004467ec9000337@myapi-strongdemo.rhcloud.com/~/git/myapi.git/
 SSH:        5400b85c5004467ec9000337@myapi-strongdemo.rhcloud.com
 Deployment: auto (on git push)

 strongloop-strongloop-0.10.30 (StrongLoop Suite)
 ------------------------------------------------
   From:    https://raw.github.com/strongloop/openshift-cartridge-strongloop/master/metadata/manifest.yml
   Website: http://strongloop.com/
   Gears:   1 small
```

To republish the app, we simply use the following commands:

```sh
$ git remote add openshift ssh://5400b85c5004467ec9000337@myapi-strongdemo.rhcloud.com/~/git/myapi.git/
$ git push --force openshift master
```

We should get a successful status as below after a series of npm messages:

```sh
remote: Preparing build for deployment
remote: Deployment id is 718770e5
remote: Activating deployment
remote: -------------------------
remote: Git Post-Receive Result: success
remote: Activation status: success
remote: Deployment completed with status: success
To ssh://5400b85c5004467ec9000337@myapi-strongdemo.rhcloud.com/~/git/myapi.git/
  f69aa75..e58a549  master -> master
```

We can now validate the updated myapi application on OpenShift cloud by refreshing the same API explorer URL and checking for the accounts model.

<img class="aligncenter size-full wp-image-19757" src="{{site.url}}/blog-assets/2014/09/Screen-Shot-2014-09-03-at-7.44.18-AM.png" alt="Screen Shot 2014-09-03 at 7.44.18 AM" width="1344" height="344"  />

First off we can see the new Accounts model (pluralized) being added. Expanding that API, we can also see all the auto-provisioned API endpoints for CRUD operations on Accounts model.

<img class="aligncenter size-full wp-image-19758" src="{{site.url}}/blog-assets/2014/09/Screen-Shot-2014-09-03-at-7.44.37-AM.png" alt="Screen Shot 2014-09-03 at 7.44.37 AM" width="1382" height="946"  />

The endpoints can actually be tested and executed through this interface. Here we see a “Get” operation.

<img class="aligncenter size-full wp-image-19759" src="{{site.url}}/blog-assets/2014/09/Screen-Shot-2014-09-03-at-7.44.57-AM.png" alt="Screen Shot 2014-09-03 at 7.44.57 AM" width="1376" height="1500"  />

## What’s next?##
- In the first blog of this sequence, we got up and running with Loopback API framework and generated REST APIs within minutes on OpenShift PaaS. In the following blogs we will discuss more detailed use cases, frontend integration and DevOps features and capabilities of Node.js APIs on OpenShift.</span>
- Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js LoopBack framework. We’ve made it easy to 
