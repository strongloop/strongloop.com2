---
id: 25673
title: 'How To: Build Xamarin Apps with Node.js REST APIs and SQL Server'
date: 2015-08-05T07:35:23+00:00
author: Shubhra Kar
guid: https://strongloop.com/?p=25673
permalink: /strongblog/nodejs-loopback-xamarin-sdk-sql-server/
categories:
  - Community
  - How-To
  - LoopBack
  - Mobile
---
Ever wonder what the backend for your [Xamarin](http://xamarin.com/) App should be? As a .Net developer who was asked to build mobile apps, I have gravitated to Xamarin and found it to be excellent platform to build, monitor and test my cross platform mobile app. But, I didn’t sleep peacefully. I knew my backend APIs could be much faster, lighter and more scalable.

I had speed dated Node.js a bit due to it’s non-blocking IO design, capabilities to handle extreme concurrency and the simplicity of code and runtime. But, I was married to wcf services and my divorce with ASP .Net web services  (primarily SOAP) still gives me nightmares. I knew SOAP and XML over HTTP didn’t cut it for mobile performance and I needed REST. If I were building in Angular, JSON would have been even more ideal, but REST would do for Xamarin&#8230;if I could find a powerful Node.js backend framework to generate REST API very quickly, handle complex ORM with distributed data and services, as well as provide an mBaaS plus real time capabilities, I would take the plunge.

<img class="aligncenter size-full wp-image-25685" src="https://strongloop.com/wp-content/uploads/2015/08/1_moon_print.jpg" alt="1_moon_print" width="600" height="434" srcset="https://strongloop.com/wp-content/uploads/2015/08/1_moon_print.jpg 600w, https://strongloop.com/wp-content/uploads/2015/08/1_moon_print-300x217.jpg 300w, https://strongloop.com/wp-content/uploads/2015/08/1_moon_print-450x326.jpg 450w" sizes="(max-width: 600px) 100vw, 600px" />

<p style="text-align: center;">
  <em>A small step for Node&#8230;a giant leap for mobile!</em>
</p>

It’s a tall ask, but there exists an open source framework in the Node ecosystem called [Loopback.io](http://loopback.io/) which does this and much more. One of StrongLoop&#8217;s partners &#8211; [Perfected Tech](http://perfectedtech.com/), just rolled out a [Xamarin SDK](http://docs.strongloop.com/display/public/LB/Xamarin+SDK) for seamless integration between LoopBack and Xamarin apps.

> _What&#8217;s LoopBack? It&#8217;s an open source Node.js framework for composing and securing APIs and getting them connected to your data._
> 
> &nbsp;

<img class="aligncenter size-full wp-image-25740" src="https://strongloop.com/wp-content/uploads/2015/08/xampluslb.png" alt="xampluslb" width="1418" height="183" srcset="https://strongloop.com/wp-content/uploads/2015/08/xampluslb.png 1418w, https://strongloop.com/wp-content/uploads/2015/08/xampluslb-300x39.png 300w, https://strongloop.com/wp-content/uploads/2015/08/xampluslb-1030x133.png 1030w, https://strongloop.com/wp-content/uploads/2015/08/xampluslb-705x91.png 705w, https://strongloop.com/wp-content/uploads/2015/08/xampluslb-450x58.png 450w" sizes="(max-width: 1418px) 100vw, 1418px" />

## **Show me how!** 

I like practical stories and this is one which I can closely relate to. I am building my backend APIs that will feed data and services to my Xamarin App. But my Microsoft SQL Server DBA friend tells me that I can’t have access to our production database (yet). On the API team, we are thinking of going with MongoDB as the backend datasource, but a lot of business data currently resides in SQL Server and my services need to talk seamlessly to both. Also my API needs to be the front end for some 3rd party REST APIs which have object relationships with my data based services. In the following sections, we will quickly stand up a simple REST API and integrate it with Xamarin via a [ToDo sample app](https://github.com/strongloop/loopback-example-xamarin). For detailed use cases and to know what else you could do with this powerful framework, please visit [loopback documentation.](http://docs.strongloop.com/display/public/LB/LoopBack)

[<img class="aligncenter size-full wp-image-25646" src="https://strongloop.com/wp-content/uploads/2015/07/4.png" alt="4" width="793" height="407" srcset="https://strongloop.com/wp-content/uploads/2015/07/4.png 793w, https://strongloop.com/wp-content/uploads/2015/07/4-300x154.png 300w, https://strongloop.com/wp-content/uploads/2015/07/4-705x362.png 705w, https://strongloop.com/wp-content/uploads/2015/07/4-450x231.png 450w" sizes="(max-width: 793px) 100vw, 793px" />](https://strongloop.com/wp-content/uploads/2015/07/4.png)

<!--more-->

&nbsp;

## **Let’s start with a non-structured backend**

LoopBack ships with a built in [object DB](http://docs.strongloop.com/display/public/LB/Memory+connector). We will use that.  If you have MongoDB, we can use it instead as well by configuring the [loopback-mongodb-connector](http://docs.strongloop.com/display/public/LB/MongoDB+connector). For now, just run the following from your home directory.

_We are assuming you have Node and StrongLoop installed. If not, please visit [Getting Started](https://strongloop.com/get-started/)._

```js
$ mkdir Xamarin_Node_API
$ cd Xamarin_Node_API/
$ slc loopback

     _-----_
    |       |    .--------------------------.
    |--(o)--|    |  Let's create a LoopBack |
   `---------´   |       application!       |
    ( _´U`_ )    '--------------------------'
    /___A___\    
     |  ~  |     
   __'.___.'__   
 ´   `  |° ´ Y ` 

? What's the name of your application? Server
? Enter name of the directory to contain the project: Server

```

This will create a scaffolded LoopBack project under the “Server” directory. The name “Server” has no technical significance other than logically representing it as the backend. You&#8217;ll notice that LoopBack ships with built in configuration code generators for instant productivity.

Now we navigate to our workspace and run the following CLI generator to start modeling an API.

```js
$ cd Server
$ slc loopback:model
? Enter the model name: TodoTask
? Select the data-source to attach TodoTask to: db (memory)
? Select model's base class: PersistedModel
? Expose TodoTask via the REST API? Yes
? Custom plural form (used to build REST URL): 
Let's add some TodoTask properties now.

```

Note that code generator prompts you for configuration information at each step and defaults to certain parameters. For example the default data-source selected is the ObjectDB or memory-db. We will later create multiple data-sources and model objects against them. Next, let us define some properties of the TodoTask model

```js
Enter an empty property name when done.
? Property name: title
   invoke   loopback:property
? Property type: (Use arrow keys)
❯ string 
  number 
  boolean 
  object 
  array 
  date 
  buffer 
(Move up and down to reveal more choices)

```

You can see that the generators prompt you for data types, which are loosely cast due to JavaScript. The mapping to strict types based on backends are taken care by LoopBack connectors.

```js
? Required? Yes

Let's add another TodoTask property.
Enter an empty property name when done.
? Property name: date
   invoke   loopback:property
? Property type: date
? Required? Yes

Let's add another TodoTask property.
Enter an empty property name when done.
? Property name: isDone
   invoke   loopback:property
? Property type: boolean
? Required? Yes

Let's add another TodoTask property.
Enter an empty property name when done.
? Property name: isDeleted
   invoke   loopback:property
? Property type: boolean
? Required? Yes

Let's add another TodoTask property.
Enter an empty property name when done.
? Property name: isFavorite
   invoke   loopback:property
? Property type: boolean
? Required? Yes

Let's add another TodoTask property.
Enter an empty property name when done.
? Property name: category
   invoke   loopback:property
? Property type: string
? Required? Yes

Let's add another TodoTask property.
Enter an empty property name when done.
? Property name:

```

The Generated todo-task.json model under /common/models looks like :

```js
{
  "name": "TodoTask",
  "base": "PersistedModel",
  "idInjection": true,
  "options": {
    "validateUpsert": true
  },
  "properties": {
    "title": {
      "type": "string",
      "required": true
    },
    "date": {
      "type": "date",
      "required": true
    },
    "isDone": {
      "type": "boolean",
      "required": true
    },
    "isDeleted": {
      "type": "boolean",
      "required": true
    },
    "isFavorite": {
      "type": "boolean",
      "required": true
    },
    "category": {
      "type": "string",
      "required": true
    }
  },
  "validations": [],
  "relations": {},
  "acls": [],
  "methods": []
}

```

Now we have our model created, let’s see some quick magic by typing:

```js
$ slc run
INFO strong-agent v1.6.3 profiling app 'Server' pid '84808'
INFO strong-agent[84808] started profiling agent
INFO supervisor reporting metrics to `internal:`
supervisor running without clustering (unsupervised)
Browse your REST API at http://0.0.0.0:3000/explorer
Web server listening at: http://0.0.0.0:3000/

```

We can now hit the provided URL, inspect and test the auto-generated CRUD in the [Swagger 2.0](https://strongloop.com/strongblog/enterprise-api-swagger-2-0-loopback/) compliant interface. For non-CRUD methods, we will need to add the Swagger middleware to serve the custom method.

<img class="aligncenter size-large wp-image-25693" src="https://strongloop.com/wp-content/uploads/2015/08/4_Explorer_Simple-1030x612.jpg" alt="4_Explorer_Simple" width="1030" height="612" srcset="https://strongloop.com/wp-content/uploads/2015/08/4_Explorer_Simple-1030x612.jpg 1030w, https://strongloop.com/wp-content/uploads/2015/08/4_Explorer_Simple-300x178.jpg 300w, https://strongloop.com/wp-content/uploads/2015/08/4_Explorer_Simple-1500x891.jpg 1500w, https://strongloop.com/wp-content/uploads/2015/08/4_Explorer_Simple-705x419.jpg 705w, https://strongloop.com/wp-content/uploads/2015/08/4_Explorer_Simple-450x267.jpg 450w" sizes="(max-width: 1030px) 100vw, 1030px" />

You may have noticed that the User Model and all its API endpoints including CRUD, filtering, change event, Login, Logout, Reset, Access Token, etc are auto-generated as it has a built in model of LoopBack. However, we are not going to use the default user model, rather implement our own by extending the base class.

```js
$ slc loopback:model
? Enter the model name: user
? Select the data-source to attach user to: db (memory)
? Select model's base class: 
  RoleMapping 
  Scope 
  TodoTask 
❯ User 
  (custom) 
  Model 
  PersistedModel 
(Move up and down to reveal more choices)
? Expose user via the REST API? Yes
? Custom plural form (used to build REST URL): 
Let's add some user properties now.

Enter an empty property name when done.
? Property name: 

```

The generated user.json model under /common/models looks like :

```js
{
  "name": "user",
  "base": "User",
  "idInjection": true,
  "options": {
    "validateUpsert": true
  },
  "properties": {},
  "validations": [],
  "relations": {},
  "acls": [],
  "methods": []
}

```

Now that we have a custom user model implemented, we need to turn off the built-in &#8220;User&#8221; model exposure to be private. This is done by going to /server/model-config.json and changing the public flag on the &#8220;User&#8221; model to false as shown below :<pre class="theme:github font:droid-sans-mono font-size:14 lang:sh highlight:0 decode:true graf--pre “> "User": { "dataSource": "db", "public": false } 
```js 

## **Setting up object relationships**

Now that we have two models, lets setup some simple object relationships between them. We know that a real person can have many todos in his calendar. This can be generated via:

```js
$ slc loopback:relation
? Select the model to create the relationship from: user
? Relation type: has many
? Choose a model to create a relationship with: TodoTask
? Enter the property name for the relation: TodoTask
? Optionally enter a custom foreign key: userId
? Require a through model? No

```

The updated user.json model under /common/models now looks like :

```js
{
  "name": "user",
  "base": "User",
  "idInjection": true,
  "options": {
    "validateUpsert": true
  },
  "properties": {},
  "validations": [],
  "relations": {
    "TodoTask": {
      "type": "hasMany",
      "model": "TodoTask",
      "foreignKey": "userId"
    }
  },
  "acls": [],
  "methods": []
}

```

You can see that now we have additionally created a foreign key dependency in the relationship. This will ensure the many to one relationship between Todos and users. To know more about BelongsTo, HasOne, HasManyBelongsTo, Polymorphic relationships, etc in Loopback, please check the [relationship documentation](http://docs.strongloop.com/display/public/LB/Creating+model+relations)

The API explorer shows and executes relationship based queries :

<img class="aligncenter size-large wp-image-25696" src="https://strongloop.com/wp-content/uploads/2015/08/5_Explorer_Relation-1030x790.jpg" alt="5_Explorer_Relation" width="1030" height="790" srcset="https://strongloop.com/wp-content/uploads/2015/08/5_Explorer_Relation-1030x790.jpg 1030w, https://strongloop.com/wp-content/uploads/2015/08/5_Explorer_Relation-300x230.jpg 300w, https://strongloop.com/wp-content/uploads/2015/08/5_Explorer_Relation-1500x1150.jpg 1500w, https://strongloop.com/wp-content/uploads/2015/08/5_Explorer_Relation-705x541.jpg 705w, https://strongloop.com/wp-content/uploads/2015/08/5_Explorer_Relation-450x345.jpg 450w" sizes="(max-width: 1030px) 100vw, 1030px" />

&nbsp;

## **Setting up security**

Now that we are making serious progress, my security architect wants to play spoil sport and asks me to setup authentication and fine grained authorization policies on the API before moving further. LoopBack comes to the rescue again!

```js
$ slc loopback:acl
? Select the model to apply the ACL entry to: TodoTask
? Select the ACL scope: All methods and properties
? Select the access type: All (match all types)
? Select the role: All users
? Select the permission to apply: Explicitly deny access

$ slc loopback:acl
? Select the model to apply the ACL entry to: user
? Select the ACL scope: All methods and properties
? Select the access type: All (match all types)
? Select the role: The user owning the object
? Select the permission to apply: Explicitly grant access

```

Here we have explicitly denied access to any Todos for any users and only provided object owner users full access. This is needed to tie the security and registration flows of our frontend Xamarin app. To learn more about roles, auto-generated AccessTokens and ACLs, please visit the LoopBack [security documentation](http://docs.strongloop.com/display/public/LB/Authentication%2C+authorization%2C+and+permissions).

Now our JSON models look slightly different&#8230;see the ACL only portion below:

/common/models/todo-task.json

```js
"acls": [
    {
      "accessType": "*",
      "principalType": "ROLE",
      "principalId": "$everyone",
      "permission": "DENY"
    }
  ],

```

/common/models/user.json

```js
"acls": [
    {
      "accessType": "*",
      "principalType": "ROLE",
      "principalId": "$owner",
      "permission": "ALLOW"
    }
  ],

```

## **Switching to a structured database**

Finally my DBA friend shows up and tells me that I need to switch to SQL Server from my JSON Object DB, as that’s the only one with all the business data. Now, this can be an headache as I am already half-way through my API. No problem, LoopBack has got you covered!

Although we can do the same using the CLI generator and core LoopBack API, I prefer to use the free API composer in [StrongLoop Arc](https://strongloop.com/node-js/arc/).

> _What&#8217;s StrongLoop Arc? It&#8217;s a graphical UI that complements the StrongLoop command line tools for developing APIs quickly and getting them connected to data. Arc also includes tools for building, profiling and monitoring Node apps._

I can launch Arc by simply typing the following into my workspace&#8230;

```js
$ slc arc
Loading workspace /Users/shubhrakar/Xamarin_Node_API/Server
StrongLoop Arc is running here: http://localhost:52992/#/

```

<img class="aligncenter size-large wp-image-25699" src="https://strongloop.com/wp-content/uploads/2015/08/7_Arc_Landing-1030x333.jpg" alt="7_Arc_Landing" width="1030" height="333" srcset="https://strongloop.com/wp-content/uploads/2015/08/7_Arc_Landing-1030x333.jpg 1030w, https://strongloop.com/wp-content/uploads/2015/08/7_Arc_Landing-300x97.jpg 300w, https://strongloop.com/wp-content/uploads/2015/08/7_Arc_Landing-1500x486.jpg 1500w, https://strongloop.com/wp-content/uploads/2015/08/7_Arc_Landing-705x228.jpg 705w, https://strongloop.com/wp-content/uploads/2015/08/7_Arc_Landing-450x146.jpg 450w" sizes="(max-width: 1030px) 100vw, 1030px" />

&nbsp;

As I need to switch to Microsoft SQL Server, I can pre-install the LoopBack connector module for SQL Server as shown below. Note that LoopBack has around 45+ connectors:

  * [Database Connectors](http://docs.strongloop.com/display/public/LB/Database+connectors)
  * [Services and Non-DB connectors](http://docs.strongloop.com/display/public/LB/Non-database+connectors)
  * [Community Connectors](http://docs.strongloop.com/display/public/LB/Community+connectors)

```js
$ npm install --save loopback-connector-mssql
loopback-connector-mssql@2.2.0 node_modules/loopback-connector-mssql
├── sl-blip@1.0.0
├── async@0.9.2
├── debug@2.2.0 (ms@0.7.1)
├── loopback-connector@2.3.0 (async@1.4.0)
├── strongloop-license@1.4.0 (user-home@1.1.1, strong-license@1.2.0)
└── mssql@2.1.6 (generic-pool@2.2.0, promise@7.0.4, tedious@1.12.1)

```

Now I can setup the connection settings for SQL Server by adding a new Data Source and test the connection from my Node application to SQL Server.

<img class="aligncenter size-large wp-image-25701" src="https://strongloop.com/wp-content/uploads/2015/08/8_Composer_1-1030x615.jpg" alt="8_Composer_1" width="1030" height="615" srcset="https://strongloop.com/wp-content/uploads/2015/08/8_Composer_1-1030x615.jpg 1030w, https://strongloop.com/wp-content/uploads/2015/08/8_Composer_1-300x179.jpg 300w, https://strongloop.com/wp-content/uploads/2015/08/8_Composer_1-1500x895.jpg 1500w, https://strongloop.com/wp-content/uploads/2015/08/8_Composer_1-705x421.jpg 705w, https://strongloop.com/wp-content/uploads/2015/08/8_Composer_1-450x269.jpg 450w" sizes="(max-width: 1030px) 100vw, 1030px" />

&nbsp;

After that, I modify the TodoTask model and change the associated backend from db(objectdb) to SQL Server.

<img class="aligncenter size-large wp-image-25702" src="https://strongloop.com/wp-content/uploads/2015/08/8_Composer_2-1030x586.jpg" alt="8_Composer_2" width="1030" height="586" srcset="https://strongloop.com/wp-content/uploads/2015/08/8_Composer_2-1030x586.jpg 1030w, https://strongloop.com/wp-content/uploads/2015/08/8_Composer_2-300x171.jpg 300w, https://strongloop.com/wp-content/uploads/2015/08/8_Composer_2-1500x853.jpg 1500w, https://strongloop.com/wp-content/uploads/2015/08/8_Composer_2-705x401.jpg 705w, https://strongloop.com/wp-content/uploads/2015/08/8_Composer_2-450x256.jpg 450w" sizes="(max-width: 1030px) 100vw, 1030px" />

&nbsp;

And finally, after saving the model, I can press the “Migrate Model” button, which will automigrate both the schema and data to SQL Server. In case there is existing data or just changes to the schema, auto-update is run instead of auto-migrate to make alterations instead of a drop and re-create.

<img class="aligncenter size-large wp-image-25703" src="https://strongloop.com/wp-content/uploads/2015/08/8_Composer_3-1030x644.jpg" alt="8_Composer_3" width="1030" height="644" srcset="https://strongloop.com/wp-content/uploads/2015/08/8_Composer_3-1030x644.jpg 1030w, https://strongloop.com/wp-content/uploads/2015/08/8_Composer_3-300x188.jpg 300w, https://strongloop.com/wp-content/uploads/2015/08/8_Composer_3-1500x938.jpg 1500w, https://strongloop.com/wp-content/uploads/2015/08/8_Composer_3-705x441.jpg 705w, https://strongloop.com/wp-content/uploads/2015/08/8_Composer_3-450x281.jpg 450w" sizes="(max-width: 1030px) 100vw, 1030px" />

&nbsp;

If I need to check the JSON representation of the model mapping, the same can be found in the /server/model-config.json and the datasource connection strings are defined in the /server/datasources.json file&#8230;for example &#8211; datasources.json

```js
{
  "db": {
    "name": "db",
    "connector": "memory"
  },
  "Xamarin_MSSQLServer": {
    "host": "mssql.strongloop.com",
    "port": 1433,
    "database": "test",
    "password": "str0ng100pjs",
    "name": "Xamarin_MSSQLServer",
    "connector": "mssql",
    "user": "test"
  }
}

```

With this step our backend API construction is done!  You can run the API Explorer, login with the user, generate the AccessToken and perform queries to extract ToDoTasks. That maybe the topic for another blog. Now let’s wire up the Xamarin front-end.

## **Generating the RESTSharpClient libraries and forms**

To connect to the REST API generated by Loopback, Xamarin needs some reference assemblies and/or RESTSharpClient libraries. I can just run the Loopback-Xamarin SDK generator on my existing API to auto generate these libraries.

This community created SDK generator can be found at <https://github.com/strongloop/loopback-sdk-xamarin> . To use the same in our project, do the following:

```js
$ cd ..

```

This will bring us out of the Server directory where we were operating till now into the Application home <Xamarin\_Node\_API> folder. We can clone the Xamarin SDK generator like this:

```js
$ git clone https://github.com/strongloop/loopback-sdk-xamarin.git
Cloning into 'loopback-sdk-xamarin'...
remote: Counting objects: 883, done.
remote: Compressing objects: 100% (9/9), done.
remote: Total 883 (delta 4), reused 0 (delta 0), pack-reused 874
Receiving objects: 100% (883/883), 4.81 MiB | 2.50 MiB/s, done.
Resolving deltas: 100% (502/502), done.
Checking connectivity... done.

$ cd loopback-sdk-xamarin
$ npm i

```

npm install will download all the application dependencies and build it local to your operating system. Then run the following:

```js
$ cd bin
$ node lb-xm ../../Server/server/server.js forms
&gt;&gt; SDK Generator.
&gt;&gt; Server parsed, templating code...
&gt;&gt; Parsing for Xamarin-Forms compatibility...
&gt;&gt; Writing CS file: output/LBXamarinSDK.cs...
&gt;&gt; Done.

```

lb-xm SDK generator CLI can take different arguments as below. As our frontend Sample App is a forms example, we have passed “forms” as the argument. To know more about the SDK generator read the [documentation](http://docs.strongloop.com/display/public/LB/Xamarin+SDK).

  * **dll &#8211; **Compile a dll containing the SDK
  * **forms &#8211; **Ensure compatibility with Xamarin-Forms
  * **force &#8211; **Remove unsupported functions
  * **check &#8211; **Check if the SDK compiles successfully as C# code

If we check under loopback-sdk-xamarin/bin/output, we should see a .cs file called LBXamarinSDK.cs

## **Xamarin Client App updates**

Ok..we are almost there. This not being a Xamarin app building tutorial, we will not discuss the code of the frontend app, but rather just clone it from the [example app](https://github.com/strongloop/loopback-example-xamarin).

Lets do the following :

Get out of the current workspace

```js
$ cd ..
$ git clone https://github.com/strongloop/loopback-example-xamarin.git
$ cd Xamarin_Node_API/
$ mkdir Client
$ mkdir images
$ cp -r ../loopback-example-xamarin/Client/ Client/
$ cp -r ../loopback-example-xamarin/images/ images/

```

Now we have the Xamarin mobile app cloned as our client in Loopback, let’s replace the .cs file with the one we created referencing our models.

```js
$ cd /loopback-sdk-xamarin/bin/output
$ cp LBXamarinSDK.cs ../../../Client/Todo\ App/TodoApp/TodoApp/

```

## **Let’s test!**

Launch Xamarin Studio and open the Todo App solution file and test the iOS app as follows:

<img class="aligncenter size-large wp-image-25705" src="https://strongloop.com/wp-content/uploads/2015/08/9_Launch_Xamarin-1030x329.jpg" alt="9_Launch_Xamarin" width="1030" height="329" srcset="https://strongloop.com/wp-content/uploads/2015/08/9_Launch_Xamarin-1030x329.jpg 1030w, https://strongloop.com/wp-content/uploads/2015/08/9_Launch_Xamarin-300x96.jpg 300w, https://strongloop.com/wp-content/uploads/2015/08/9_Launch_Xamarin-1500x479.jpg 1500w, https://strongloop.com/wp-content/uploads/2015/08/9_Launch_Xamarin-705x225.jpg 705w, https://strongloop.com/wp-content/uploads/2015/08/9_Launch_Xamarin-450x144.jpg 450w" sizes="(max-width: 1030px) 100vw, 1030px" />

&nbsp;

<img class="aligncenter size-large wp-image-25706" src="https://strongloop.com/wp-content/uploads/2015/08/10_Xamarin_ConfigureIP-1030x572.jpg" alt="10_Xamarin_ConfigureIP" width="1030" height="572" srcset="https://strongloop.com/wp-content/uploads/2015/08/10_Xamarin_ConfigureIP-1030x572.jpg 1030w, https://strongloop.com/wp-content/uploads/2015/08/10_Xamarin_ConfigureIP-300x167.jpg 300w, https://strongloop.com/wp-content/uploads/2015/08/10_Xamarin_ConfigureIP-1500x833.jpg 1500w, https://strongloop.com/wp-content/uploads/2015/08/10_Xamarin_ConfigureIP-705x392.jpg 705w, https://strongloop.com/wp-content/uploads/2015/08/10_Xamarin_ConfigureIP-450x250.jpg 450w" sizes="(max-width: 1030px) 100vw, 1030px" />

&nbsp;

In the LBXamarinSDK.cs file, please update the IP address to that of the host on which your LoopBack api is running. Then rebuild the project and run a test with the emulator.

We go through a User Signup and Login process, next we can add multiple todos for any particular day/time. The todos then show up in our calendar. In the use case below, we have entered “eat pizza” and “drink water” as two Todo Tasks. These are added successfully into my calendar.

<img class=" size-medium wp-image-25707 alignnone" src="https://strongloop.com/wp-content/uploads/2015/08/11_Step1_App_Launch-190x300.jpg" alt="11_Step1_App_Launch" width="190" height="300" srcset="https://strongloop.com/wp-content/uploads/2015/08/11_Step1_App_Launch-190x300.jpg 190w, https://strongloop.com/wp-content/uploads/2015/08/11_Step1_App_Launch-448x705.jpg 448w, https://strongloop.com/wp-content/uploads/2015/08/11_Step1_App_Launch-450x709.jpg 450w, https://strongloop.com/wp-content/uploads/2015/08/11_Step1_App_Launch.jpg 640w" sizes="(max-width: 190px) 100vw, 190px" />    <img class=" size-medium wp-image-25708 alignnone" src="https://strongloop.com/wp-content/uploads/2015/08/11_Step2_App_Signup-191x300.jpg" alt="11_Step2_App_Signup" width="191" height="300" srcset="https://strongloop.com/wp-content/uploads/2015/08/11_Step2_App_Signup-191x300.jpg 191w, https://strongloop.com/wp-content/uploads/2015/08/11_Step2_App_Signup-449x705.jpg 449w, https://strongloop.com/wp-content/uploads/2015/08/11_Step2_App_Signup-450x707.jpg 450w, https://strongloop.com/wp-content/uploads/2015/08/11_Step2_App_Signup.jpg 640w" sizes="(max-width: 191px) 100vw, 191px" />    <img class=" size-medium wp-image-25709 alignnone" src="https://strongloop.com/wp-content/uploads/2015/08/11_Step4_App_AddTask-192x300.jpg" alt="11_Step4_App_AddTask" width="192" height="300" srcset="https://strongloop.com/wp-content/uploads/2015/08/11_Step4_App_AddTask-192x300.jpg 192w, https://strongloop.com/wp-content/uploads/2015/08/11_Step4_App_AddTask-452x705.jpg 452w, https://strongloop.com/wp-content/uploads/2015/08/11_Step4_App_AddTask-450x702.jpg 450w, https://strongloop.com/wp-content/uploads/2015/08/11_Step4_App_AddTask.jpg 646w" sizes="(max-width: 192px) 100vw, 192px" />

&nbsp;

<img class=" size-medium wp-image-25710 alignnone" src="https://strongloop.com/wp-content/uploads/2015/08/11_Step5_Pizza-190x300.jpg" alt="11_Step5_Pizza" width="190" height="300" srcset="https://strongloop.com/wp-content/uploads/2015/08/11_Step5_Pizza-190x300.jpg 190w, https://strongloop.com/wp-content/uploads/2015/08/11_Step5_Pizza-447x705.jpg 447w, https://strongloop.com/wp-content/uploads/2015/08/11_Step5_Pizza-450x709.jpg 450w, https://strongloop.com/wp-content/uploads/2015/08/11_Step5_Pizza.jpg 642w" sizes="(max-width: 190px) 100vw, 190px" />    <img class=" size-medium wp-image-25711 alignnone" src="https://strongloop.com/wp-content/uploads/2015/08/11_Step6_Water-191x300.jpg" alt="11_Step6_Water" width="191" height="300" srcset="https://strongloop.com/wp-content/uploads/2015/08/11_Step6_Water-191x300.jpg 191w, https://strongloop.com/wp-content/uploads/2015/08/11_Step6_Water-450x706.jpg 450w, https://strongloop.com/wp-content/uploads/2015/08/11_Step6_Water.jpg 644w" sizes="(max-width: 191px) 100vw, 191px" />    <img class=" size-medium wp-image-25712 alignnone" src="https://strongloop.com/wp-content/uploads/2015/08/11_Step7_both-192x300.jpg" alt="11_Step7_both" width="192" height="300" srcset="https://strongloop.com/wp-content/uploads/2015/08/11_Step7_both-192x300.jpg 192w, https://strongloop.com/wp-content/uploads/2015/08/11_Step7_both-452x705.jpg 452w, https://strongloop.com/wp-content/uploads/2015/08/11_Step7_both-450x702.jpg 450w, https://strongloop.com/wp-content/uploads/2015/08/11_Step7_both.jpg 644w" sizes="(max-width: 192px) 100vw, 192px" />

&nbsp;

Now, if we go on the LoopBack API explorer (after authenticating using the same credentials) we get an access token, which can be set on the header and used to perform queries corresponding to the Todo Tasks for “<skar@strongloop.com>”. We can see the corresponding entries from the SQL Server database displayed in our API results on the backend as well.

<img class="  wp-image-25713 alignnone" src="https://strongloop.com/wp-content/uploads/2015/08/12_User_Login-300x270.jpg" alt="12_User_Login" width="358" height="323" srcset="https://strongloop.com/wp-content/uploads/2015/08/12_User_Login-300x270.jpg 300w, https://strongloop.com/wp-content/uploads/2015/08/12_User_Login-1030x926.jpg 1030w, https://strongloop.com/wp-content/uploads/2015/08/12_User_Login-705x634.jpg 705w, https://strongloop.com/wp-content/uploads/2015/08/12_User_Login.jpg 1440w" sizes="(max-width: 358px) 100vw, 358px" />    <img class="  wp-image-25714 alignnone" src="https://strongloop.com/wp-content/uploads/2015/08/12_Query_Todo-268x300.jpg" alt="12_Query_Todo" width="357" height="399" srcset="https://strongloop.com/wp-content/uploads/2015/08/12_Query_Todo-268x300.jpg 268w, https://strongloop.com/wp-content/uploads/2015/08/12_Query_Todo-921x1030.jpg 921w, https://strongloop.com/wp-content/uploads/2015/08/12_Query_Todo-630x705.jpg 630w, https://strongloop.com/wp-content/uploads/2015/08/12_Query_Todo-450x503.jpg 450w, https://strongloop.com/wp-content/uploads/2015/08/12_Query_Todo.jpg 1302w" sizes="(max-width: 357px) 100vw, 357px" />

## **What’s next?**

  * See the code in action! [Register for the Aug 12 webinar](http://marketing.strongloop.com/acton/form/5334/004b:d-0002/0/index.htm) to learn how to build the frontend and backend of a mobile app using the Xamarin SDK.
  * Get the code: [LoopBack](http://loopback.io/)
  * Get the code: [Xamarin SDK](https://github.com/strongloop/loopback-sdk-xamarin)
  * Get the code: [ToDo sample app](https://github.com/strongloop/loopback-example-xamarin)
  * Learn more about [PerfectedTech](http://perfectedtech.com/effective-mobile-solutions/)

## 

&nbsp;