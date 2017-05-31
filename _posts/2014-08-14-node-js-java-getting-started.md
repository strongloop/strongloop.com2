---
id: 19135
title: Getting Started with Node.js for the Java Developer
date: 2014-08-14T09:39:14+00:00
author: Grant Shipley
guid: http://strongloop.com/?p=19135
permalink: /strongblog/node-js-java-getting-started/
categories:
  - Community
  - How-To
  - LoopBack
---
_**Editor&#8217;s Note:** This post was originally published in August, 2014. We have refreshed this popular blog post with updated IDEs and LoopBack instructions._

Let me start with a confession: I was a Java developer for nearly 10 years and fully embraced the heavy-handed approach to accomplishing most tasks. Want to read a file? Opening up a `BufferedReader` and passing in a `FileReader` seemed like common sense to me with a bonus of feeling very enterprisey. I was a complete fan boy and refused to look at other languages.

If you are reading this blog post, you may have fallen into the trap that snared me for many years. You owe it to yourself as a developer to learn new technologies and use the appropriate tool for the job. I am not sure if I am just getting old and tired of Java or have found a new inner child that gets excited about new languages. That being said, I have found that Node is really exciting and a joy to work in. In this post, I will show you how to create a basic REST service that reads from a MongoDB database using Java EE. After that, I will write the same code in Node to help you ease into learning this exciting new language.

<!--more-->

## **Starting with the basics &#8211; What is Node.js?**

First of all, let me say that Node.js is not the latest cool kid language that only hipsters use. Sure, it started with this perception, but I am happy to report that it is a mature language that has already made its way into large enterprises powering some of the most highly trafficked websites on the Internet today. It is a tool that you need in your bag of tricks and it will amaze you by how quickly and easily you can create stable, secure, and performant code.

In a nutshell, Node is a language for server-side activities. It uses the Javascript programming language and has a plethora of libraries available as npm modules. You can think of these npm modules as .jar files coming from Java-land. Chances are, if you need a bit of functionality and don’t fancy writing all of the code yourself, there is an npm module available that already provides the features you are looking for.

Node applications are normally implemented when you need to maximize efficiency by utilizing non-blocking I/O and asynchronous events. One gotcha for Java developers to know is that Node applications run in a single thread. However, backend Node code uses multiple threads for operations such as network and file access. Given this, Node is perfect for real-time applications.

## **Moving on &#8211; What about IDE support?**

If you are like me, you live and breathe in the IDE. This probably stems from our use of the Java programming language where the language is so verbose that we needed constant code completion in order to be effective in our software development. Once we figured out the benefits of code completion, we learned the value of using an IDE for file management, debugging, and other very useful features. Suffice it to say, I love using an IDE and continue to use them while working with Node. Below are just a few of the current IDEs that support Node as a first-class citizen:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><a href="https://hub.jazz.net/features/#editor">Bluemix:</a> The Web IDE provides features to import your source code, copy a file by dragging it to a new directory, and edit code quickly.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Eclipse &#8211; This should be an easy win if you use it for Java. Just install the <a href="http://www.nodeclipse.org/">node.js extensions</a>. </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><a href="http://www.jetbrains.com/idea/">JetBrains IntelliJ IDEA:</a> A very popular IDE that is a commercial product. This is by far my favorite IDE. </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><a href="http://strongloop.com/strongblog/node-js-support-in-visual-studio-you-bet-your-ide/">Microsoft Visual Studio</a>: Visual Studio has native support for Node. This implementation is rock solid and is my 2nd favorite IDE. Oddly enough, I only use Visual Studio for Node-based projects.<br /> </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><a href="https://codenvy.com/">CodeEnvy:</a> A web based IDE. </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><a href="https://c9.io/">Cloud9:</a> A web based IDE. </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><a href="http://www.sublimetext.com/2">SublimeText: </a>A no frills text editor that is gaining in popularity among developers for its lightweight approach. There are a number of plugins that make working with Node.js even more efficient.<br /> </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><a href="http://code.visualstudio.com/">Visual Studio Code</a>: While it is more of a text editor, VSC qualifies as an IDE because of auto-complete and debugging help for Node.</span>
</li>

This is just a small sampling of some of my favorite IDEs that I use when working on Node based projects.

## **Getting started with the sample project**

In this blog post, we’ll create a simple REST service in both the Java EE and Node.js programming languages. The REST service simply reads information from a MongoDB database and returns the results to the requestor. I’m assuming you have MongoDB already, so covering the installation and configuration of the Java application server and MongoDB database is not in scope for this article. If you need to install MongoDB, it’s easy—check out the [installation documentation.](https://docs.mongodb.com/manual/installation/)

## **Creating our Java application**

**Step 1: The pom.xml file**

For the sample application, called `restexample`, I will be using the JBoss EAP Application Server. The first thing we want to do is configure our `pom.xml` file for dependency management using the Maven build system. Below is the `pom.xml` file that includes the dependencies that I will be using for the `restexample` application:

```js
<project xmlns="http://maven.apache.org/POM/4.0.0"  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
       <modelVersion>4.0.0</modelVersion>
       <groupId>restexample</groupId>
       <artifactId>restexample</artifactId>
       <packaging>war</packaging>
       <version>1.0</version>
       <name>restexample</name>
       <repositories>
           <repository>
               <id>eap</id>
               <url>http://maven.repository.redhat.com/techpreview/all</url>
               <releases>
                   <enabled>true</enabled>
               </releases>
               <snapshots>
                   <enabled>true</enabled>
               </snapshots>
           </repository>
       </repositories>
       <pluginRepositories>
           <pluginRepository>
               <id>eap</id>
               <url>http://maven.repository.redhat.com/techpreview/all</url>
               <releases>
                   <enabled>true</enabled>
               </releases>
               <snapshots>
                   <enabled>true</enabled>
               </snapshots>
           </pluginRepository>
       </pluginRepositories>
       <properties>
           <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
           <maven.compiler.source>1.6</maven.compiler.source>
           <maven.compiler.target>1.6</maven.compiler.target>
       </properties>
       <dependencies>
           <dependency>
               <groupId>org.jboss.spec</groupId>
               <artifactId>jboss-javaee-6.0</artifactId>
               <version>3.0.2.Final-redhat-4</version>
               <type>pom</type>
               <scope>provided</scope>
           </dependency>
           <dependency>
               <groupId>org.mongodb</groupId>
               <artifactId>mongo-java-driver</artifactId>
               <version>2.9.1</version>
           </dependency>
           </dependencies>
       </project>
```

Whew, pretty verbose, but hopefully you understand the code. I&#8217;m not going to explain the details because if you&#8217;re reading this post, I assume you understand Java.

**Step 2: Creating the beans.xml file and setting our servlet mapping**

As part of the sample application, we will be using CDI (Context Dependency Injection) for our database access class. According to the official CDI specification, an application that makes use of CDI must have a `beans.xml` file located in the `WEB-INF` directory of the application. Given that, let’s create this file and populate it with the required information.

I. Browse to your `/src/main/webapp/WEB-INF` directory and create a file named `beans.xml` .

II. Add the following code:

```js
<?xml version="1.0"?>
<beans xmlns="http://java.sun.com/xml/ns/javaee"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://jboss.org/schema/cdi/beans_1_0.xsd"/>
```

III. Set the our servlet mapping for our REST API calls in the `web.xml` file. Add the following servlet mapping element to the file located in the `/src/main/webapp/WEB-INF` directory:

```js
<servlet-mapping>
   <servlet-name>javax.ws.rs.core.Application</servlet-name>
   <url-pattern>/ws/*</url-pattern>
</servlet-mapping>
```

**Step 3: Creating the DBConnection class**

At this point, we have our project setup and our pom.xml file includes the dependency for MongoDB to ensure that the drivers are packaged as part of our application. The next thing we need to do is to create a class that will manage the connection to the database for us. Create a new file named `DBConnection.java` and place the file in the `/src/main/java/com/strongloop/data` directory and include the following source code:

_Ensure that you replace the connection authorization details with the appropriate information for your installation of MongoDB!_

```js
package com.strongloop.data;

import java.net.UnknownHostException;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Named;

import com.mongodb.DB;
import com.mongodb.Mongo;

@Named
@ApplicationScoped
public class DBConnection {

   private DB mongoDB;

   public DBConnection() {
       super();
   }

   @PostConstruct
   public void afterCreate() {
       String mongoHost = "127.0.0.1"
       String mongoPort = "27001"
       String mongoUser = "strongloop";
       String mongoPassword = "rocks";
       String mongoDBName = "restexample";
       int port = Integer.decode(mongoPort);

       Mongo mongo = null;
       try {
           mongo = new Mongo(mongoHost, port);
       } catch (UnknownHostException e) {
           System.out.println("Couldn't connect to MongoDB: " + e.getMessage()
                   + " :: " + e.getClass());
       }

       mongoDB = mongo.getDB(mongoDBName);

       if (mongoDB.authenticate(mongoUser, mongoPassword.toCharArray()) == false) {
           System.out.println("Failed to authenticate DB ");
       }

   }

   public DB getDB() {
       return mongoDB;
   }

}
```

**Step 4: Importing data into MongoDB (mmmmm Beer)**

For our sample application, we are going to load a list of beers that match on the name of “Pabst”. If you are not familiar with beer drinking, the Pabst Brewing Company makes some of the finest American ale available. With signature products such as Pabst Blue Ribbon (PBR) and Colt 45, they have all of your malt drinking beverages basis covered.

<img class="aligncenter size-full wp-image-19155" src="{{site.url}}/blog-assets/2014/08/pabst-coupon.jpg" alt="pabst-coupon" width="1024" height="919"  />

The first thing you want to do is download a JSON file that has all the data that we want to return. You can grab this at the following URL:

<https://dl.dropboxusercontent.com/u/72466829/beers.json>

I. Download a JSON file that has all the necessary data. You can grab this at the following URL:
  
<https://dl.dropboxusercontent.com/u/72466829/beers.json>

II. Load the downloaded database using the `mongoimport` command as shown below:

`$ mongoimport --jsonArray -d yourDBName -c beers --type json --file /tmp/beers.json -h yourMongoHost --port yourMongoPort -u yourMongoUsername -p yourMongoPassword`

You should see the following results:

`connected to: 127.0.0.1:27017<br />
Tue Jun 10 20:09:55.436 check 9 24<br />
Tue Jun 10 20:09:55.437 imported 24 objects`

**Step 5: Creating the Beer model object**

Now that we have a database connection class created and the beer information loaded into the MongoDB database, its time to create the model object that will hold our beer information.

I. Create a new file called Beer.java and place it in the `/src/main/java/com/strongloop/data` directory.

II. Once you have the file created, add the following source code:

```js
package com.strongloop.data;

public class Beer {
   private String id;
   private String name;
   private String description;

   public String getId() {
       return id;
   }
   public void setId(String id) {
       this.id = id;
   }
   public String getName() {
       return name;
   }
   public void setName(String name) {
       this.name = name;
   }
   public String getDescription() {
       return description;
   }
   public void setDescription(String description) {
       this.description = description;
   }
}
```

_ Note: The JSON file provided contains more information that what we will be using so have a poke around and add some additional functionality to expand the learning experience._

**Step 6: Creating the REST service**

Guess what? We are finally ready to create the REST based web service that will allows us to retrieve the beers we loaded in a previous step. To do this:

I. Create a new file named BeerWS.java and place it in the `/src/main/java/com/strongloop/webservice` directory.

II. Once you have the file created, add the following source code:

```js
package com.strongloop.webservice;

import java.util.ArrayList;
import java.util.List;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import com.strongloop.data.DBConnection;
import com.strongloop.data.Beer;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

@RequestScoped
@Path("/beers")
public class BeerWS {

   @Inject
   private DBConnection dbConnection;

   private DBCollection getBeerCollection() {
       DB db = dbConnection.getDB();
       DBCollection beerCollection = db.getCollection("beers");
       return beerCollection;
   }

   private Beer populateBeerInformation(DBObject dataValue) {
       Beer theBeer = new Beer();
       theBeer.setName(dataValue.get("name"));
       theBeer.setDescription(dataValue.get("name"));
       theBeer.setId(dataValue.get("_id").toString());

       return theBeer;
   }

   // get all of the beers
   @GET()
   @Produces("application/json")
   public List<Beer> getAllBeers() {
       ArrayList<Beer> allBeersList = new ArrayList<Beer>();

       DBCollection beers = this.getBeerCollection();
       DBCursor cursor = beers.find();
       try {
           while (cursor.hasNext()) {
               allBeersList.add(this.populateBeerInformation(cursor.next()));
           }
       } finally {
           cursor.close();
       }

       return allBeersList;
   }
}
```

**Step 7: Bask in the joy of viewing beers**

Whew, finally. We now have a REST web service written that finds all of the beers in our database. Deploy your code to your application server and verify it works by browsing the following URL:

<http://yourserverlocation/ws/beers>

If everything went as it should, you will see all of the beers listed as shown in the following image:

<img class="aligncenter size-full wp-image-19167" src="{{site.url}}/blog-assets/2014/08/restexample.png" alt="restexample" width="975" height="500"  />

## **Creating our Node application**

If you have been following along with the Java code in this blog post, you may have realized that even with great strides being made recently in Java EE-land, creating something as simple as a REST service is still very verbose. Don’t get me wrong, I love working in Java EE, but I have found that for a lot of tasks, such as creating REST services that return JSON data, Node is the way to go. For the rest of this post, we will create the same simple web service using the [LoopBack](http://loopback.io/) API framework. As an added bonus, I will walk you through installing Node on MacOS.

**Step 1: Installing Node**

The easiest way to install Node is via one of the available binary packages that is available for most operating systems.

I. Point your browser to the following URL and download the correct installer for your operating system:

<http://nodejs.org/download/>

II. Once this page loads, you should see the following:

[<img class="aligncenter size-large wp-image-28577" src="{{site.url}}/blog-assets/2014/08/Installer-Screen-1030x533.png" alt="Installer Screen" width="1030" height="533"  />]({{site.url}}/blog-assets/2014/08/Installer-Screen.png)

III. If you are using Mac OSX, click on the `.pkg` file. This saves the installation program to your local computer.

IV. Once the file has been downloaded, start the installation program by double clicking on the `.pkg` file.

V. Click Continue on the installer dialogue:

[<img class="aligncenter size-full wp-image-28578" src="{{site.url}}/blog-assets/2014/08/node-install.png" alt="node install" width="624" height="442"  />]({{site.url}}/blog-assets/2014/08/node-install.png)

VI. Complete the installation process by using all of the defaults.

VII. Click on the close button to exit the program once the installation has been successful.

Pretty easy, huh?

**Step 2: Installing LoopBack with npm**

Now that we have Node installed on our local system, we want to install the LoopBack packages that is provided by StrongLoop. LoopBack is an open source API that provides functionality that will make your life easier as you begin to learn how to write and deploy software written in Node.

In order to install LoopBack, we will be using the `npm` command that is part of the core language. npm is the official package manager for installing libraries or modules that your applications depend on. Given that this post is written for Java developers, an easy way to think of npm modules is to relate it to Maven. Using the Maven build system, developers are able to specify dependencies in their `pom.xml` file. Once the application is scheduled for a build, all of the dependencies are downloaded and the `.jar` files are included in the project. npm modules works the same way and use the `package.json` file to allow you to specify dependencies for a particular application. You can also install dependencies from the command line to make them available on your local system. Don’t worry if you don’t understand this just yet as we will cover the `package.json` file in more detail in a later step.

In order to install LoopBack, we can issue a single command that will download and install all of the dependencies we need for the package. Open up your terminal window and issue the following command:

`$ npm install -g strongloop`

_Note: You may have to use sudo depending on your installation_

What just happened? We told npm that we want to install the StrongLoop package while also providing the `-g` option. The `-g` option makes the package available as a global package for anyone of the system to use and is available to all applications. Once you run the above command, npm downloads the package as well as any required dependencies. Depending on the speed of your system, this may take a few minutes to complete.

**Step 3: Creating our application**

Creating an application using the LoopBack API is very easy and straight-forward.

I. Open your terminal window and issue the following command to create a new application:

`$ slc loopback`

II. When prompted for the application name, use the name `restexample`.

III. Next, you are prompted for a project directory. For the purpose of this exercise, pass `restexample` as the directory name.

IV. When prompted for the version of LoopBack to use, choose the current stable release.

<img class="aligncenter size-full wp-image-19180" src="{{site.url}}/blog-assets/2014/08/Screen-Shot-2014-08-14-at-9.11.05-AM.png" alt="Screen Shot 2014-08-14 at 9.11.05 AM" width="422" height="255"  />

IV. The `slc` utility prompts you to select the project type. Select **api-server**.

V. The `slc` utility creates a new LoopBack-based project called `restexample` and configures the project. A new directory is created where you ran the command named after the application.

VI. Change to the application directory with the `cd` command:

`$ cd restexample`

Now that we have our application created, we want to add support for MongoDB as a datasource for LoopBack.

**Step 4: Defining our DataSource**

In order to communicate with MongoDB, we need add a datasource to our application.

I. Run the command:

`$ slc loopback:datasource`

II. We get a prompt to enter the data-source name, which can be anything custom. Let’s choose myMongo.

`[?] Enter the data-source name: myMongo`

III. Now we can attach the backend datasource definition to the real connector supported by StrongLoop. Here we choose the MongoDB connector from the list.

`[?]Select the connector for myMongo:
In-memory db (supported by StrongLoop)
IBM DB2 (supported by StrongLoop)
IBM DashDB (supported by StrongLoop)
IBM MQ Light (supported by StrongLoop)
IBM Cloudant DB (supported by StrongLoop)
IBM DB2 for z/OS (supported by StrongLoop)
❯ MongoDB (supported by StrongLoop)
MySQL (supported by StrongLoop)
PostgreSQL (supported by StrongLoop)
Oracle (supported by StrongLoop)
Microsoft SQL (supported by StrongLoop)
REST services (supported by StrongLoop)
SOAP webservices (supported by StrongLoop)
Couchbase (provided by community)
Neo4j (provided by community)
Kafka (provided by community)
SAP HANA (provided by community)
Email (supported by StrongLoop)
ElasticSearch (provided by community)
other
` 

**Step 5: Pointing to the real datasource**

In order to communicate with MongoDB, we need point at the actual MongoDB instance. LoopBack defines all datasource configuration in the datasource.json file that is located in your application root/server directory. Open this file and add a datasource for MongoDB as shown in the following code:

```js
{

 "db": {
   "name": "db",
   "connector": "memory"
 },
 "myMongo": {
   "name": "myMongo",
   "connector": "mongodb"
   "url": "mongodb://localhost:27017/restexample"
 }
}
```

_Note: Be sure to provide the correct connection URL for your MongoDB database. For this example, I have a database created called `restexample` that I want to use for my datasource._

**Step 6: Importing data into MongoDB (mmmmm Beer)**

Just as we did during the Java section of this post, we need to load the data set into our MongoDB database. If you have already completed this step as part of this blog post and you intend to use the same database, you can skip ahead to Step 7.

I. Download a JSON file that has all the data that we want to return. You can grab this at the following URL:

<https://dl.dropboxusercontent.com/u/72466829/beers.json>

II. Once you have the data set downloaded, simply load it into your database using the mongoimport command as shown below:

`$ mongoimport --jsonArray -d yourDBName -c beers --type json --file /tmp/beers.json -h yourMongoHost --port yourMongoPort -u yourMongoUsername -p yourMongoPassword`

III. You should see the following results:

`connected to: 127.6.189.2:27017
Tue Jun 10 20:09:55.436 check 9 24
Tue Jun 10 20:09:55.437 imported 24 objects`

**Step 7: Creating our Beer model**

A model can be thought of in the same terms as you think about models in Java-land. It is a representation of an Object, in this case is beer. LoopBack provides a convenient way to create model objects by using the command line.

I. Open up your terminal window, go to the project folder and issue the following command:

`$ slc loopback:model`

II. This will begin an interactive session where you can define your model.

III. The first thing that will be asked is the model name. Let’s call that “beer”.

IV. It will prompt for the datasource this model should be attached to and we should select the myMongo datasource we just created.

`[?] Enter the model name: beer
[?] Select the data-source to attach beer to:
db (memory)
❯ myMongo (mongodb)`

V. Next, cli prompts us for a model base class. Select `PersistedModel`.
  
`[?] Select model's base class: (Use arrow keys)
Model
❯ PersistedModel
ACL
AccessToken
Application
Change
Checkpoint
` 

VI. We then get prompted if this API should be exposed over REST. Of course we want to do that.

`[?] Expose beer via the REST API? Yes`

VI. Enter a web plural name for your model. Since our model is called `beer`, the plural is `beers` (which is the default). To accept this default, simply hit the enter key.

`[?] Custom plural form (used to build REST URL):`

VII. Next, define the properties of your model. For this sample application, we are interested in the name and description of the beer.

`Enter an empty property name when done.
[?] Property name: name`

IX. Once you hit enter, provide the data type for each property specified. Select string and press the enter key.

`[?] Property type: (Use arrow keys)
❯ string
number
boolean
object
array
date
buffer
geopoint
(other)`

Follow steps VIII and IX above to create the description property.

`Let's add another beer property.
Enter an empty property name when done.
[?] Property name: description
invoke loopback:property
[?] Property type: string
[?] Required? Yes`

Congratulations! you have just created your first model object using LoopBack in conjunction with Node. To see what was actually created under the covers, open up the `beer.json` file that is located in the `root/common/models` of your application directory. Scroll to the very bottom of the file and you will see the following model:

```js
{
 "name": "beer",
 "base": "PersistedModel",
 "properties": {
   "name": {
     "type": "string",
     "required": true
   },
   "description": {
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

As you can see, we have a model created and the `name` as well as the `description` properties are assigned to the model.

In the `/server/model-config.js` you will notice we also have some additional fields including `public` and `datasource`. The public field specifies that we want to expose this model to the world via a REST web service. The `datasource` field specifies the datasource that this model will use for CRUD operations.

```js
  "beer": {
    "dataSource": "myMongo",
    "public": true
  }
```

**Step 8: Bask in the joy of viewing beers**

Congratulations! You have just created your first Node.js application that includes a REST web service for retrieving information about beer! The last thing we need to do is deploy the application. Fortunately, this is an easy task and can be performed with the following command, executed from your application&#8217;s root directory:

`$ cd my-app-dir
$ node .
` 

Once the application is running, verify that is working by going to the following URL with your web browser:

<http://0.0.0.0:3000/api/beers>

Pretty awesome, huh?

LoopBack also includes an explorer application that allows you to view all of the services available for your application, including the Beer model and REST service that we created. To use this explorer, point your browser to the following URL:

<http://0.0.0.0:3000/explorer>

Once the page has loaded, you will be presented with the following screen where I have highlighted the `/beers` endpoint that we created as part of this blog post:

<img class="aligncenter size-full wp-image-19205" src="{{site.url}}/blog-assets/2014/08/explorer11.png" alt="explorer1" width="975" height="248"  />

Click on the `/beers` endpoint to expand the available API calls that can be made and even test a few out as shown in the following image:

<img class="aligncenter size-full wp-image-19206" src="{{site.url}}/blog-assets/2014/08/explorer2.png" alt="explorer2" width="975" height="894"  />

## **Conclusion**

In this blog post I showed you how to create a REST based web service using Java EE. This service returned a list of beers from the fantastic Pabst Brewing Company. After we created the Java EE application, we then created the same application using LoopBack and Node. With very little code, we created a REST web service that returns the name and description of our beers. On top of that, the LoopBack API also provides default actions for the entire CRUD process.

A quick table showing some of the comparisons discussed in this blog post is below:

<div dir="ltr">
  <table>
    <colgroup> <col width="*" /> <col width="*" /> <col width="*" /></colgroup> <tr>
      <td>
        <p dir="ltr">
          Feature
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          Java EE
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          Node.js
        </p>
      </td>
    </tr>
    
    <tr>
      <td>
        <p dir="ltr">
          Great IDE support
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          Yes, multiple choices including Eclipse, Sublime and Idea
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          Yes, multiple choices including BlueMix, Visual Studio, Eclipse, Sublime
        </p>
      </td>
    </tr>
    
    <tr>
      <td>
        <p dir="ltr">
          Dependency management
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          Maven
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          npm
        </p>
      </td>
    </tr>
    
    <tr>
      <td>
        <p dir="ltr">
          Enterprise ready
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          Yes, in use today
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          Yes, in use today
        </p>
      </td>
    </tr>
    
    <tr>
      <td>
        <p dir="ltr">
          Large ecosystem of libraries
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          Yes
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          Yes
        </p>
      </td>
    </tr>
    
    <tr>
      <td>
        <p dir="ltr">
          Requires JVM
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          Yes
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          No
        </p>
      </td>
    </tr>
    
    <tr>
      <td>
        <p dir="ltr">
          Common frameworks
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          Spring, JEE
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          Express
        </p>
      </td>
    </tr>
    
    <tr>
      <td>
        <p dir="ltr">
          Database support
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          Yes
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          Yes
        </p>
      </td>
    </tr>
    
    <tr>
      <td>
        <p dir="ltr">
          ORM frameworks
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          Yes
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          Yes
        </p>
      </td>
    </tr>
    
    <tr>
      <td>
        <p dir="ltr">
          Testing Frameworks
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          Yes
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          Yes
        </p>
      </td>
    </tr>
  </table>
</div>


## [**Develop APIs Visually with IBM API Connect**](https://console.ng.bluemix.net/docs/services/apiconnect/index.html)

Ready to take your project to the next level? IBM API Connect combines IBM API Management and IBM StrongLoop into a unified API creation tool to create enterprise-ready services. API Connect uses LoopBack to integrate seamlessly with Node apps, so you can put the above lessons into practice. It takes just a few simple steps to [get started](https://console.ng.bluemix.net/docs/services/apiconnect/index.html)!
