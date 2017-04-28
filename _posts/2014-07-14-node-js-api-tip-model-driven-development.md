---
id: 18093
title: 'Node.js API Tip: Model Driven Development'
date: 2014-07-14T08:32:03+00:00
author: Shubhra Kar
guid: http://strongloop.com/?p=18093
permalink: /strongblog/node-js-api-tip-model-driven-development/
categories:
  - API Tip
  - Community
  - How-To
  - LoopBack
  - Product
---
<p dir="ltr">
  Today&#8217;s tip focuses on APIs &#8211; which just so happen to be the primary use case for Node.js!  APIs are driving the new frontedge &#8211; inclusive of mobile, tablets, wearables, web browsers, sensors, et al by providing rich backend data access in a flexible interface. These APIs are being increasingly generated using API <em>frameworks,</em> which act as “super glue” tying together the endpoints of disparate enterprise systems and data sources, and then exposing them in a uniform API to all clients.
</p>

<p dir="ltr">
  API development usually starts on the backend with constructing a data access layer, modeling data objects and defining relationship mapping. Today, we will focus on Models and Model driven development of APIs in Node. The origins of modeling lies in a software design paradigm called &#8220;<a href="http://en.wikipedia.org/wiki/Convention_over_configuration">Convention over Configuration</a>.&#8221;
</p>

<p dir="ltr">
  <!--more-->
</p>

<h2 dir="ltr">
  <strong>Convention over Configuration</strong>
</h2>

 <img src="{{site.url}}/blog-assets/2014/07/watch1.jpg" alt="tumblr_lvfxf8hHJg1qf7jblo3_1280.jpg" width="282px;" height="217px;" /><img src="{{site.url}}/blog-assets/2014/07/watch2.jpg" alt="Vacheron Constantin Métiers d’Art Mécaniques Ajourées movement 1.jpg" width="297px;" height="214px;" />

<p dir="ltr">
  Convention over configuration (also known as coding by convention) seeks to decrease the number of decisions that <a href="http://en.wikipedia.org/wiki/Software_developer">developers</a> need to make, gaining simplicity, but not necessarily losing flexibility. This means a developer only needs to specify unconventional aspects of the application. For example, if there&#8217;s a class <code>Sale</code> in the model, the corresponding table in the database is called <code>sales</code> by default. It is only if one deviates from this convention, such as calling the table <code>sale</code>, or <code>product_sold</code> that one needs to write code regarding these names.
</p>

<p dir="ltr">
  When the convention implemented by the tool matches the desired behavior, it behaves as expected without having to write configuration files. Only when the desired behavior deviates from the implemented convention is explicit configuration required.
</p>

<p dir="ltr">
  ASP .Net MVC does this by default. When you create a controller named <code>Home</code> the class is <code>HomeController</code> and the views of the <code>HomeController</code> are found in <code>/Views/Home</code> for your project. When dealing with <a href="http://en.wikipedia.org/wiki/Inversion_of_control">IoC</a> containers there’s the task of registering your types to resolve correct.
</p>

<p dir="ltr">
  Some popular frameworks who use convention over configuration are :
</p>

  * [Ruby on Rails](http://en.wikipedia.org/wiki/Ruby_on_Rails)
  * [CakePHP](http://en.wikipedia.org/wiki/CakePHP)
  * [Apache Maven](http://en.wikipedia.org/wiki/Apache_Maven)
  * [Grails](http://en.wikipedia.org/wiki/Grails_(framework))
  * [Symfony (PHP)](http://en.wikipedia.org/wiki/Symfony)
  * [Ember.js](https://en.wikipedia.org/wiki/Ember.js)
  * [Java Platform, Enterprise Edition](http://en.wikipedia.org/wiki/Java_Platform,_Enterprise_Edition)
  * [ASP.NET MVC Framework](http://en.wikipedia.org/wiki/ASP.NET_MVC_Framework)
  * [Spring Framework](http://en.wikipedia.org/wiki/Spring_Framework)

**Node Specific**

  * [Express](http://http://expressjs.com/ "Express")
  * [Loopback](http://loopback.io/)
  * [Sails](http://en.wikipedia.org/wiki/Sails)
  * [Meteor](http://en.wikipedia.org/wiki/Meteor_(web_framework))

<h2 dir="ltr">
  <strong>Newer modeling approaches<br /> </strong>
</h2>

<p dir="ltr">
  We have seen a couple new modeling approaches pop up in API development space, particularly for Node:
</p>

  1. Object Relationship Mapping (ORM)
  2. Object Datasource Mapping (ODM)

<h2 dir="ltr">
  <strong>Object Relational Mapping</strong>
</h2>

<p dir="ltr">
  <a href="http://en.wikipedia.org/wiki/Object-relational_mapping">ORM</a> was made popular in the J2EE world by engines like Hibernate, but is a widely accepted model across many frameworks and languages.
</p>

<p dir="ltr">
  <a href="{{site.url}}/blog-assets/2014/07/Object-Relationship-Mapping.png"><img class="aligncenter size-full wp-image-26750" src="{{site.url}}/blog-assets/2014/07/Object-Relationship-Mapping.png" alt="Object Relationship Mapping" width="590" height="405"  /></a>
</p>

<p dir="ltr">
  Relational databases are at the core of most enterprise applications. However, when you map a relational database to objects, it becomes a challenge. Object relational mapping (ORM) is a programming framework that allows you to define a mapping between application object model and the relational database.
</p>

<p dir="ltr">
  Traditionally, an Object Model (OM) deals with object oriented &#8220;blue-print&#8221; of your system. This includes, class diagrams (classes you will be creating), relationship between these classes, methods in the classes, properties etc. Typically, it is not aware of the database structure. Objects have properties and references to other objects.
</p>

<p dir="ltr">
  The Data Model (DM) deals with entities at the database level. Like how the classes in the OM will get stored and in which tables. So, DM deals with table schema and the relationships between different tables (PKs, FKs) etc.
</p>

<p dir="ltr">
  Databases consist of tables with columns that maybe related to other tables. ORM provides a bridge between the relational database and the object model. Object-relational mapping (ORM, O/RM, and O/R mapping) creates, in effect, a &#8220;virtual <a href="http://en.wikipedia.org/wiki/Object_database">object database</a>&#8221; that can be used from within the programming language and is database vendor independent. Additionally, ORM can significantly reduce the lines of code needed to be written by providing a higher level of abstraction.
</p>

## ** Object Datasource Mapping (ODM)**

&nbsp;

[<img class="aligncenter size-full wp-image-26751" src="{{site.url}}/blog-assets/2014/07/Object-Datasource-Mapping-ODM-mongoose.png" alt="Object Datasource Mapping (ODM) mongoose" width="600" height="261"  />]({{site.url}}/blog-assets/2014/07/Object-Datasource-Mapping-ODM-mongoose.png)

<p dir="ltr">
  Traditionally, Data Models deal with entities at the persistence level. Like how the classes in the Object Model will get stored in the database, in which tables etc. So, Data Model deals with Table schema, relationship between different tables (PKs, FKs) etc.
</p>

<p dir="ltr">
  However, NoSQL and unstructured databases like MongoDB enabled the creation of Node packages like <a href="http://mongoosejs.com/">Mongoose</a> that provide a straight-forward, schema-based solution for modeling your application data and includes built-in type casting, validation, query building, business logic hooks and more. We call this as ODM (Object Datasource Mapping). Interestingly, the MongoDB model tooling is also called “<strong>Object Document Mapping</strong>” as MongoDB stores data in JSON document format.
</p>

<p dir="ltr">
  Due to the absence of SQL queries and planners, NoSQL databases get better performance with ODM. Additionally, there is no SQL to write, which reduces the possibility of SQL injections.
</p>

## **Modeling gurus warn of pitfalls**

&nbsp;

[<img class="aligncenter size-full wp-image-26752" src="{{site.url}}/blog-assets/2014/07/modelling-Pitfall.png" alt="modelling Pitfall" width="283" height="249" />]({{site.url}}/blog-assets/2014/07/modelling-Pitfall.png)

<p dir="ltr">
  ORM can have a few rough edges in the case of &#8220;Logic Intensive Systems&#8221; i.e. systems that perform complex calculations, make optimizations, determinations, decisions, etc. This makes persistence easier by locking the object model to the database model that can make writing and consuming the business logic harder. For example, in a system that uses business objects that are basically codegen&#8217;d one to one from a legacy codebase with 400+ tables, the temptation and driver for codegen&#8217;ing the business objects is obvious (400+ tables).
</p>

<p dir="ltr">
  The problem is that consuming these business objects in the service layer is that the business objects do not really reflect the behavior of the business logic. Not having the encapsulation of the raw database structure from the service layer makes it even worse.
</p>

<p dir="ltr">
  Just some examples:
</p>

  * **<span style="color: #99cc00;">Big tables don&#8217;t map to a single object. </span>** It&#8217;s not possible that a class with a 100 different properties can possibly be cohesive. We&#8217;d have better business logic if that 100 column table is modeled in the middle tier by a half dozen classes, each with a cohesive responsibility.  Only one table for the entire object hierarchy may look ok, but big classes are almost always a bad thing.
  * **<span style="color: #008000;"><span style="color: #99cc00;"><a href="http://www.codinghorror.com/blog/archives/000589.html"><span style="color: #99cc00;">Data Clump and Primitive Obsession code smells</span></a></span>.</span>**  A database row is naturally flat.  But think about a database table(s) with lot&#8217;s of something\_currency/something\_amount combinations.  There&#8217;s a separate object for [Money](http://www.martinfowler.com/eaaCatalog/money.html) wanting to come out.  To make your business objects pure representations of the database you can end up with lots of duplicate logic for currency & quantity conversions.
  * **<span style="color: #99cc00;">Natural cases for polymorphism in your object model.</span>**  I think the roughest part of O/R mapping is handling polymorphism inside the database. Check out Fowler&#8217;s patterns on [database mappings for inheritance](http://www.martinfowler.com/eaaCatalog/).

ODM on the other hand is proprietary to each type of NoSQL backend like MongoDB and cannot deal with RDBMs based table-model structures. With no schema enforcement at the DB level and objects stored as flexible JSON documents, model validations will need to be handled at an application level. It too does not have complex OO features like polymorphism, inheritance, overloading etc which are usually listed in an OM, making it impractical to use with enterprise systems in addition too the below issues:

  * **<span style="color: #008000;"><span style="color: #99cc00;">Automatic persistence of updated documents.</span> </span>**If you change an instance of an application JSON document, it&#8217;s up to you to make sure that change gets persisted back to MongoDB. This leads to more verbose code and generally more errors, as it&#8217;s easy to forget to .save() a document when you&#8217;re done.
  * **<span style="color: #99cc00;">An Identity Map. </span>**If you&#8217;re working with several documents at once, you can get into a situation where you have two documents in memory that both represent the same document in MongoDB. This can cause consistency problems, particularly if the documents are both modified, but in different ways.
  * **<span style="color: #99cc00;">A Unit of Work.</span>** When you&#8217;re doing several updates, it&#8217;s nice to be able to &#8220;batch up&#8221; the updates and flush them to MongoDB all at once, particularly in a NoSQL database like MongoDB which has no multi-document transactions. You don&#8217;t get true transactional behavior with a unit of work, but  can at least skip the flush step and the database doesn&#8217;t change.
  * **<span style="color: #008000;"><span style="color: #99cc00;">Support for relationships between documents.</span> </span>**I like to be able to construct object graphs in RAM that aren&#8217;t necessarily represented by embedded documents in MongoDB.

<h2 dir="ltr">
  Introducing Loopback
</h2>

[<img class="aligncenter size-full wp-image-26753" src="{{site.url}}/blog-assets/2014/07/loopback-logo-sm.png" alt="loopback-logo-sm" width="194" height="200"  />]({{site.url}}/blog-assets/2014/07/loopback-logo-sm.png)

&nbsp;

<p dir="ltr">
  <a href="http://strongloop.com">StrongLoop</a> created <a href="http://loopback.io">LoopBack</a>, a fully open-source, Node API framework on top of <a href="http://expressjs.com/">Express</a> which assimilates the best practices of both types of modeling. Because it extends from express.js, it follows convention over configuration.
</p>

<p dir="ltr">
  LoopBack simplifies and speeds up REST API development. It consists of:
</p>

  * A library of Node.js modules for connecting web and mobile apps to data sources such as databases and REST APIs.
  * A [command-line tool (slc)](http://docs.strongloop.com/pages/viewpage.action?pageId=3180173), for creating and working with LoopBack applications.
  * [Client SDKs](http://docs.strongloop.com/display/LB/Client+SDKs) for native and web-based mobile clients.

<p dir="ltr">
  A LoopBack application has three components:
</p>

<p dir="ltr">
  <a href="{{site.url}}/blog-assets/2014/07/loopback-3-components-diagram.png"><img class="aligncenter size-full wp-image-26754" src="{{site.url}}/blog-assets/2014/07/loopback-3-components-diagram.png" alt="loopback 3 components diagram" width="595" height="193"  /></a>
</p>

  * Models that represent business data and behavior.
  * Data sources and connectors. 
      * Data sources are databases or other backend services such as REST APIs, SOAP web services, or storage services.
      * Connectors provide apps access to enterprise data sources such as Oracle, MySQL, and MongoDB.
  * Mobile clients using the LoopBack client SDKs.

<p dir="ltr">
  An application interacts with data sources through the LoopBack model API, available locally within Node, <a href="http://docs.strongloop.com/display/LB/REST+API">remotely over REST</a>, and via native client APIs for <a href="http://docs.strongloop.com/display/LB/Client+SDKs">iOS, Android, and HTML5</a>. Using the API, apps can query databases, store data, upload files, send emails, create push notifications, register users, and perform other actions provided by data sources.
</p>

<p dir="ltr">
  Mobile clients can call LoopBack server APIs directly using <a href="http://docs.strongloop.com/display/NODE/Strong+Remoting">Strong Remoting</a>, a pluggable transport layer that enables you to provide backend APIs over REST, WebSockets, and other transports.
</p>

<p dir="ltr">
  LoopBack supports both &#8220;dynamic&#8221; schema-less models and &#8220;static&#8221;, schema-driven models. A LoopBack model represents data in backend systems such as databases and REST APIs, and provides APIs for working with it.  If your app connects to a relational database, then a model can be a table. Additionally, a model is updated with validation rules and business logic.
</p>

## **Creating Models**

[<img class="aligncenter size-full wp-image-26755" src="{{site.url}}/blog-assets/2014/07/cretaing-models-ADN_animation.gif" alt="creating models ADN_animation" width="181" height="313" />]({{site.url}}/blog-assets/2014/07/cretaing-models-ADN_animation.gif)

&nbsp;

<p dir="ltr">
  You can create LoopBack models in various ways, depending on what kind of data source the model is based on.  You can create:
</p>

  * [Dynamic models](http://docs.strongloop.com/display/LB/Creating+dynamic+models), for free-form data. 
      * You can also [create dynamic models by instance introspection](http://docs.strongloop.com/display/LB/Creating+models+by+instance+introspection) based on JSON data from NoSQL databases or REST APIs.
  * [Static models](http://docs.strongloop.com/display/LB/Creating+static+models), for models with schema definitions, such as those based on relational databases 
      * You can [create static models using LoopBack&#8217;s discovery API](http://docs.strongloop.com/display/LB/Discovering+models+from+relational+databases) by consuming existing data from a relational database.
      * Then you can keep your model synchronized with the database using LoopBack&#8217;s [schema / model synchronization](http://docs.strongloop.com/pages/viewpage.action?pageId=3180378) API.

<p dir="ltr">
  The REST API enables HTTP clients like web browsers, JS programs, mobile SDKs, curl scripts or any other compatible client to interact with LoopBack models. LoopBack automatically binds a model to a list of HTTP endpoints that provide REST APIs for model instance data manipulations (CRUD) and other remote operations.
</p>

<p dir="ltr">
  By default, the REST APIs are mounted to <code>/<Model.settings.plural | pluralized(Model.modelName)></code>, for example, <code>/locations</code>, to the base URL such as <a href="http://localhost:3000/">http://localhost:3000/</a>.  LoopBack provides a number of <a href="http://docs.strongloop.com/display/LB/Using+built-in+models">built-in models</a> that have REST APIs.  See the <a href="http://docs.strongloop.com/display/LB/REST+API">REST API</a> docs for more information.
</p>

<h2 dir="ltr">
  <strong>Predefined remote methods</strong>
</h2>

<p dir="ltr">
  By default, for a model backed by a datasource, LoopBack exposes a REST API that provides all the standard create, read, update, and delete (CRUD) operations. For example, for a model called <code>Location</code> (that provides business locations), LoopBack automatically creates the following REST API endpoints:
</p>

<div dir="ltr">
  <div dir="ltr">
    <table>
      <colgroup> <col width="237" /> <col width="183" /> <col width="174" /></colgroup> <tr>
        <td>
          <p dir="ltr">
            Model API
          </p>
        </td>
        
        <td>
          <p dir="ltr">
            HTTP Method
          </p>
        </td>
        
        <td>
          <p dir="ltr">
            Example Path
          </p>
        </td>
      </tr>
      
      <tr>
        <td>
          <p dir="ltr">
            create()
          </p>
        </td>
        
        <td>
          <p dir="ltr">
            POST
          </p>
        </td>
        
        <td>
          <p dir="ltr">
            /locations
          </p>
        </td>
      </tr>
      
      <tr>
        <td>
          <p dir="ltr">
            upsert()
          </p>
        </td>
        
        <td>
          <p dir="ltr">
            PUT
          </p>
        </td>
        
        <td>
          <p dir="ltr">
            /locations
          </p>
        </td>
      </tr>
      
      <tr>
        <td>
          <p dir="ltr">
            exists()
          </p>
        </td>
        
        <td>
          <p dir="ltr">
            GET
          </p>
        </td>
        
        <td>
          <p dir="ltr">
            /locations/:id/exists
          </p>
        </td>
      </tr>
      
      <tr>
        <td>
          <p dir="ltr">
            findById()
          </p>
        </td>
        
        <td>
          <p dir="ltr">
            GET
          </p>
        </td>
        
        <td>
          <p dir="ltr">
            /locations/:id
          </p>
        </td>
      </tr>
      
      <tr>
        <td>
          <p dir="ltr">
            find()
          </p>
        </td>
        
        <td>
          <p dir="ltr">
            GET
          </p>
        </td>
        
        <td>
          <p dir="ltr">
            /locations
          </p>
        </td>
      </tr>
      
      <tr>
        <td>
          <p dir="ltr">
            findOne()
          </p>
        </td>
        
        <td>
          <p dir="ltr">
            GET
          </p>
        </td>
        
        <td>
          <p dir="ltr">
            /locations/findOne
          </p>
        </td>
      </tr>
      
      <tr>
        <td>
          <p dir="ltr">
            deleteById()
          </p>
        </td>
        
        <td>
          <p dir="ltr">
            DELETE
          </p>
        </td>
        
        <td>
          <p dir="ltr">
            /locations/:id
          </p>
        </td>
      </tr>
      
      <tr>
        <td>
          <p dir="ltr">
            count()
          </p>
        </td>
        
        <td>
          <p dir="ltr">
            GET
          </p>
        </td>
        
        <td>
          <p dir="ltr">
            /locations/count
          </p>
        </td>
      </tr>
      
      <tr>
        <td>
          <p dir="ltr">
            prototype.updateAttributes()
          </p>
        </td>
        
        <td>
          <p dir="ltr">
            PUT
          </p>
        </td>
        
        <td>
          <p dir="ltr">
            /locations/:id
          </p>
        </td>
      </tr>
    </table>
  </div>
</div>

<div dir="ltr">
</div>

<h2 dir="ltr">
  <strong>Relationship Mapping</strong>
</h2>

<p dir="ltr">
  Individual models are easy to understand and work with. But in reality, models are often connected or related.  When you build a real-world application with multiple models, you&#8217;ll typically need to define relations between models. For example:
</p>

  * A customer has many orders and each order is owned by a customer.
  * A user can be assigned to one or more roles and a role can have zero or more users.
  * A physician takes care of many patients through appointments. A patient can see many physicians too.

<p dir="ltr">
  With connected models, LoopBack exposes as a set of APIs to interact with each of the model instances and query and filter the information based on the client’s needs. You can define the following relations between models:
</p>

  * belongsTo
  * hasMany
  * hasManyThrough
  * hasAndBelongsToMany

<p dir="ltr">
  You can define models relations in JSON or in JavaScript code.  When you define a relation for a model, LoopBack adds a set of methods to the model:
</p>

<h3 dir="ltr">
  belongsTo
</h3>

<p dir="ltr">
  A <code>belongsTo</code> relation sets up a one-to-one connection with another model, such that each instance of the declaring model &#8220;belongs to&#8221; one instance of the other model. For example, if your app includes customers and orders, and each order can be placed by exactly one customer.
</p>

<p dir="ltr">
  <a href="{{site.url}}/blog-assets/2014/07/belongs-to.png-version1modificationDate1384386009000apiv2.png"><img class="aligncenter size-full wp-image-26756" src="{{site.url}}/blog-assets/2014/07/belongs-to.png-version1modificationDate1384386009000apiv2.png" alt="belongs-to.png-version=1&modificationDate=1384386009000&api=v2" width="437" height="122"  /></a>
</p>

<p dir="ltr">
  The declaring model <code>(Order)</code> has a foreign key property that references the primary key property of the target model <code>(Customer)</code>. If a primary key is not present, LoopBack will auto add one.
</p>

<h3 dir="ltr">
  hasMany
</h3>

<p dir="ltr">
  A <code>hasMany</code> relation builds a one-to-many connection with another model. You&#8217;ll often find this relation on the &#8220;other side&#8221; of a belongsTo relation. Here each instance of the model has zero or more instances of another model.  For example, in an app with customers and orders, a customer can have many orders.
</p>

<p dir="ltr">
  <a href="{{site.url}}/blog-assets/2014/07/has-many.png-version1modificationDate1384386032000apiv2.png"><img class="aligncenter size-full wp-image-26757" src="{{site.url}}/blog-assets/2014/07/has-many.png-version1modificationDate1384386032000apiv2.png" alt="has-many.png-version=1&modificationDate=1384386032000&api=v2" width="456" height="133"  /></a>
</p>

<p dir="ltr">
  The target model, <code>Order</code>, has a property, <code>customerId</code>, as the foreign key to reference the declaring model <code>(Customer)</code> primary key id.
</p>

### hasManyThrough

<p dir="ltr">
  A <code>hasMany</code> through relation is often used to set up a many-to-many connection with another model. Here the declaring model can be matched with zero or more instances of another model by proceeding through a third model. For example, in an app for a medical practice where patients make appointments to see physicians, the relevant relation declarations might be:
</p>

<p dir="ltr">
  <a href="{{site.url}}/blog-assets/2014/07/has-many-through.png-version1modificationDate1384386049000apiv2.png"><img class="aligncenter size-full wp-image-26759" src="{{site.url}}/blog-assets/2014/07/has-many-through.png-version1modificationDate1384386049000apiv2.png" alt="has-many-through.png-version=1&modificationDate=1384386049000&api=v2" width="589" height="179"  /></a>
</p>

<p dir="ltr">
  The “through” model, <code>Appointment</code>, has two foreign key properties, <code>physicianId</code> and <code>patientId</code>, that reference the primary keys in the declaring model, <code>Physician</code>, and the target model, <code>Patient</code>.
</p>

<h3 dir="ltr">
  hasAndBelongsToMany
</h3>

<p dir="ltr">
  A <code>hasAndBelongsToMany</code> relation creates a direct many-to-many connection with another model, with no intervening model. For example, in an app with assemblies and parts, where each assembly has many parts and each part appears in many assemblies, you could declare the models as:
</p>

<p dir="ltr">
  <a href="{{site.url}}/blog-assets/2014/07/has-and-belongs-to-many.png-version1modificationDate1384386077000apiv2.png"><img class="aligncenter size-full wp-image-26758" src="{{site.url}}/blog-assets/2014/07/has-and-belongs-to-many.png-version1modificationDate1384386077000apiv2.png" alt="has-and-belongs-to-many.png-version=1&modificationDate=1384386077000&api=v2" width="595" height="185"  /></a>
</p>

You can define a model declaratively in models.json and you can programmatically define and extend models using the `Model` class.

## **Data sources and connectors**

[<img class="aligncenter size-full wp-image-26760" src="{{site.url}}/blog-assets/2014/07/datasource-connector.png-version1modificationDate1384303105000apiv2.png" alt="datasource-connector.png-version=1&modificationDate=1384303105000&api=v2" width="300" height="259" />]({{site.url}}/blog-assets/2014/07/datasource-connector.png-version1modificationDate1384303105000apiv2.png)

&nbsp;

<p dir="ltr">
  LoopBack is centered around models that represent data and behaviors. Data sources enable exchange of data between models and backend systems such as databases. Data sources typically provide create, retrieve, update, and delete (CRUD) functions. LoopBack also generalizes other backend services, such as REST APIs, SOAP web services, and storage services, as data sources.
</p>

<p dir="ltr">
  Data sources are backed by connectors which implement the data exchange logic using database drivers or other client APIs. Connectors are not used directly by application code. The DataSource class provides APIs to configure the underlying connector and exposes functions via DataSource or model classes.
</p>

<p dir="ltr">
  The diagram illustrates the relationship between LoopBack Model, DataSource, and Connector.
</p>

<li dir="ltr">
  <p dir="ltr">
    Define the model using <a href="http://docs.strongloop.com/display/LB/LoopBack+Definition+Language">LoopBack Definition Language (LDL)</a>. This provides a model definition in JSON or as a JavaScript object.
  </p>
</li>

<li dir="ltr">
  <p dir="ltr">
    Create an instance of <code>ModelBuilder</code> or <code>DataSource</code> which extends from <code>ModelBuilder</code>. <code>ModelBuilder</code> compiles model definitions to JavaScript constructors of model classes.DataSource inherits that function from <code>ModelBuilder</code>. In addition, DataSource adds behaviors to model classes by mixing in methods from the <code>DataAccessObject</code> (DAO) into the model class.
  </p>
</li>

<li dir="ltr">
  <p dir="ltr">
    Use <code>ModelBuilder</code> or <code>DataSource</code> to build a JavaScript constructor (i.e, the model class) from the model definition. Model classes built from <code>ModelBuilder</code> can be later attached to a <code>DataSource</code> to receive the mixin of data access functions.
  </p>
</li>

<li dir="ltr">
  <p dir="ltr">
    As part of step 2, <code>DataSource</code> initializes the underlying Connector to provides configurations to the connector instance.Connector works with <code>DataSource</code> to define the functions as <code>DataAccessObject</code> to be mixed into the model class. The DataAccessObject consists of a list of static & prototype methods.
  </p>
</li>

<h3 dir="ltr">
  LoopBack DataSource object
</h3>

`DataSource` object is the unified interface for LoopBack applications to integrate with backend systems. It&#8217;s a factory for data access logic around model classes. With the ability to plug in various connectors, `DataSource` provides the necessary abstraction to interact with databases or services to decouple the business logic from plumbing technologies.

<p dir="ltr">
  Depicted below is the end to end Loopback API framework architecture for model driven development.
</p>

<p dir="ltr">
  <a href="{{site.url}}/blog-assets/2014/07/SL_MicroServices.png"><img class="aligncenter size-full wp-image-26761" src="{{site.url}}/blog-assets/2014/07/SL_MicroServices.png" alt="SL_MicroServices" width="624px;" height="471px;"  /></a>
</p>

<p dir="ltr">
  To checkout more details please visit <a href="http://loopback.io">Loopback.io</a> or <a href="http://strongloop.com/mobile-application-development/loopback/">Strongloop</a> website. In our next weekly blog we will deep-dive into the API services architecture of Loopback.
</p>

<h2 dir="ltr">
  <strong style="font-size: 1.5em;">What’s next?</strong>
</h2>

<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><a href="http://strongloop.com/node-js/whats-new-in-node-js-v0-12/">Read about eight exciting new upcoming Node v0.12 features</a> and how to make the most of them, from the authors themselves.<a href="http://strongloop.com/strongblog/performance-node-js-v-0-12-whats-new/"><br /> </a></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Need </span><a href="http://strongloop.com/node-js-support/expertise/">training and certification</a>for Node? Learn more about both the private and open options StrongLoop offers.
</li>