---
id: 15026
title: Node.js is Required for Next Generation API Servers
date: 2014-04-01T11:02:47+00:00
author: Ritchie Martori
guid: http://strongloop.com/?p=15026
permalink: /strongblog/nodejs-loopback-deployd-api-serve/
categories:
  - Community
  - LoopBack
---
<h2 dir="ltr">
  <strong>Background</strong>
</h2>

<p dir="ltr">
  About two years ago, <a href="https://twitter.com/jeffbcross">Jeff Cross</a> and I created <a href="https://github.com/deployd/deployd">deployd</a>, an interactive development environment (IDE) and API server for rapidly prototyping REST APIs for HTML5 and mobile apps. As front end developers we wanted to be able to easily create backends so we had an entire stack to test. It turned out that what we built was very useful for prototyping but lacked some features that larger companies require to go from prototype to final product.
</p>

<p dir="ltr">
  A little over a year ago I started working on a new project at StrongLoop called <a href="http://loopback.io/">LoopBack</a>. The idea was to improve on the Deployd design. From the beginning we set out to build a production grade API server that would fit the requirements of large organizations building APIs for HTML5 and mobile apps. In this article we’ll go over what I consider the first three generations of API servers, how they influenced the design of <a href="http://loopback.io/">LoopBack</a>, and how they can help you build a large scale production grade REST API.
</p>

<p dir="ltr">
  <!--more-->
</p>

<h2 dir="ltr">
  <strong>The First Generation: Birth of the API Server</strong>
</h2>

<p dir="ltr">
  The first generation style API server were built using frameworks designed originally for building web applications. From Java this is <a href="http://docs.spring.io/spring/docs/3.0.x/spring-framework-reference/html/mvc.html">Spring MVC</a> or <a href="http://struts.apache.org/">Struts</a>. Ruby, PHP, and Python have frameworks like <a href="http://rubyonrails.org/">Rails</a>, <a href="http://www.zend.com/en/products/framework/">Zend</a>, and <a href="https://www.djangoproject.com/">Django</a>. The heyday of these frameworks were before <a href="http://nodejs.org/">Node.js</a>, but several come to mind from the <a href="http://nodejs.org/">Node</a> world: <a href="http://sailsjs.org">Sails</a>, <a href="http://compoundjs.com/">CompoundJS</a>, and <a href="http://geddyjs.org/">geddy</a>.
</p>

<p dir="ltr">
  Most of these MVC frameworks include a database abstraction (typically an ORM for RDBMS only), templating libraries for rendering HTML, and a base controller for gluing the two together. This gives developers a lot of flexibility while creating a clear separation between view and data. For the typical web application where views are rendered on the server, this is everything you need.
</p>

<p dir="ltr">
  As browser clients became more complex, using new features like AJAX and the ability to render templates on the client, the MVC based backend was stretched to serve as both the web application and as the API server. Controllers would implement some methods that returned an entire rendered page while some methods that would return data.
</p>

<p dir="ltr">
  For simple browser applications this worked well enough. As mobile applications proliferated and MVC moved towards the client, the separation became clear. You would build an MVC application and an API server. The MVC application would provide the user interface and the API server would provide the data.
</p>

<h2 dir="ltr">
  <strong>The Second Generation: The Thin Server</strong>
</h2>

<p dir="ltr">
  Once it was clear that developers were building two separate applications, the focus of frameworks shifted. With web applications moving into the client and an entirely separate API server, both could be thinned out. The web application no longer could directly access the database. This access instead could be passed through to the client. This was made possible by a new set of frameworks and databases: <a href="https://www.mongodb.org/">MongoDB</a>, <a href="http://couchdb.apache.org/">CouchDB</a>, <a href="http://www.sinatrarb.com/">Sinatra</a>, <a href="http://expressjs.com/">Express</a>, <a href="http://deployd.com/">Deployd</a>, <a href="https://www.meteor.com/">Meteor</a> and others.
</p>

<p dir="ltr">
  These new technologies let developers build much thinner servers or “<a href="http://nobackend.org/">noBackend</a>” at all. This was made possible by making “data on the wire” a first class citizen. Typically this meant surfacing database style APIs to JSON document databases.
</p>

<p dir="ltr">
  Complex browser and mobile applications need “data on the wire” to transfer state to and from various data sources (databases, backend services, etc). The second generation of API servers and frameworks made this a first class and an “out of the box” feature. This is only the beginning for a data rich browser or mobile application. Access to raw data is important, but clients require much more from an API server. Data aggregation, security, validation, and denormalization are usually a requirement.
</p>

<h2 dir="ltr">
  <strong>The Next Generation: Optimized API Delivery</strong>
</h2>

<p dir="ltr">
  We learned several lessons from the second generation of API servers. Providing a pass-through API to a database does not scale to large applications that require access to many data sources. Packaging features that make building an API simple is helpful. Delivering these features in a black box makes customization painful. Finally, REST and HTTP are becoming standard for API servers, but should not dictate the design of our API server.
</p>

<p dir="ltr">
  <strong>Open Up the Black Box</strong>
</p>

<p dir="ltr">
  Gen II API servers made building a backend for a mobile or web application a lot easier. This came with a cost. Technologies like CouchDB, Meteor, Deployd, MongoDB, and others do so much for you that getting something to work wasn’t the problem. When memory of your production machines was skyrocketing or requests were taking too long, there wasn’t much you could do. The idea of “noBackend” doesn’t have to mean you install a black box for your API and it must work without modification. Next generation API servers should provide all the out of the box features clients require, especially the hard parts, and provide hooks everywhere. You should even be able to replace entire parts of the API server if it is required by your application.
</p>

<p dir="ltr">
  In order for the hooks or customizations to be practical the API server should provide deep introspection APIs. In LoopBack we provide the app.remotes() API. It returns your APIs HTTP routes, schema definitions, and all other metadata associated with your API server. This is useful for scaffolding client applications, generating documentation, and anything else that requires access to your API’s metadata.
</p>

<p dir="ltr">
  <strong>Data Access</strong>
</p>

<p dir="ltr">
  Providing a pass-through API to a database does not scale to large applications that require access to many data sources. Large applications use a myriad of data sources: databases, other REST APIs, proprietary services, etc.  Instead an API server should provide an abstract API to these data sources that allows you to describe relationships and do ad hoc aggregation and filtering.
</p>

<p dir="ltr">
  Second generation data access was largely dependent on databases, such as MongoDB and CouchDB, that made creating a proxy API simple. Applications can easily outgrow the proxy API. An example of this is a <a href="https://github.com/couchapp/couchapp">couchapp</a> that provided a statistic database. Users could query several years worth of statistical data. This would occasionally bring the <a href="https://github.com/couchapp/couchapp">couchapp</a> down. One approach to fix this problem would be to restrict access to the statistic database. Only providing an API that accesses a pre-aggregated set of data. This is pretty difficult to do with <a href="http://couchdb.apache.org/">CouchDB</a>. Our approach in LoopBack is to make it trivial to add these kind of aggregate APIs. Take a look at <a href="http://docs.strongloop.com/display/DOC/Remote+methods+and+hooks">remote methods</a> for more.
</p>

<p dir="ltr">
  A lot of time developing an API is spent implementing security rules from scratch. This inspired us to include access control lists (ACLs) in <a href="http://loopback.io/">LoopBack</a>. Instead of writing middleware or other functions to validate a given request, <a href="http://loopback.io/">LoopBack</a> allows you to define a list of access controls. The following is a basic example from a banking application.
</p>

`slc lb acl --allow --owner --read --write --model account`

<p dir="ltr">
  The commands above generate the access control lists in <a href="https://github.com/strongloop/loopback-example-access-control/blob/master/server/models.json">this JSON config file</a>. Now only the user that owns an account may read or write it. For more see the entire <a href="https://github.com/strongloop/loopback-example-access-control">LoopBack Access Control Example</a>.
</p>

<p dir="ltr">
  <strong>Aggregation and Mashup</strong>
</p>

<p dir="ltr">
  Many frameworks claim to do aggregation simply through &#8220;joining&#8221; of data. For example <a href="https://openjpa.apache.org/">OpenJPA</a> and <a href="http://hibernate.org/">Hibernate</a> provide related entity support. The issue is that relationship only exists in one data source.
</p>

<p dir="ltr">
  Another approach to aggregation is to create a set of workers that aggregate and denormalize data from various sources and drop that data into a JSON document database. For example, all the data required by a user’s homepage might span many data sources. This can be aggregated into a single document and easily fetched when the homepage is loaded. The issue with this approach is the latent ahead-of-time denormalization. The homepage will be out of date if data has changed after the aggregation.
</p>

<p dir="ltr">
  Java frameworks like <a href="http://www.jboss.org/teiid/">Teiid</a> were created to solve this issue. They provide an abstraction for data access that supports integration of distributed data sources without latent copying or moving data. In <a href="http://loopback.io/">LoopBack</a> we provide relation and inclusion APIs for ad hoc data aggregation. This allows you to define relationship between data, even from distributed data sources, and request the aggregate data based on that relationship.
</p>

<p dir="ltr">
  The following example would get a product, product details, and related products over REST. Many setups are possible as far as data sources; in the following the product and product detail data could come from an inventory database, and the related products could come from a separate backend REST or even SOAP API.
</p>

```js
curl http://api.myapp.com/api/products/42
 ? filter[include] = productDetails
 & filter[include]  = relatedProducts

{
 "name": "pencil",
 "productDetails": {
   "availableColors": ["red", "blue"]

 },
 "relatedProducts": [
   {"id": 43, "name": "pen"}
 ]
}
```

<p dir="ltr">
  <strong>REST</strong>
</p>

<p dir="ltr">
  Next generation API servers should treat REST as the transport, not the programming model. API servers should adhere to REST and make it simple to implement a REST API. However, the client application should drive the programming model for the API server. In LoopBack we treat the API server as the “M” in “MVC”. This allows your API to flex to the demand of its clients. If your clients and server share the same model, you can compose the same models across your various clients.
</p>

<p dir="ltr">
  It is also important for API servers to not confuse REST with HTTP. The programming model mentioned above means protocols such as web sockets and others are just an implementation detail. You shouldn’t have to re-implement your API server just to provide a client access to another protocol. The models and rules you define for your API should work for any protocol.
</p>

<h2 dir="ltr">
  <strong>Recap</strong>
</h2>

<table id="tablepress-11" class="tablepress tablepress-id-11">
  <tr class="row-1 odd">
    <th class="column-1">
      <center>
        Generation
      </center>
    </th>
    
    <th class="column-2">
      <center>
        Pattern
      </center>
    </th>
    
    <th class="column-3">
      <center>
        Primary Use Case
      </center>
    </th>
    
    <th class="column-4">
      <center>
        Features
      </center>
    </th>
  </tr>
  
  <tr class="row-2 even">
    <td class="column-1">
      <center>
        1
      </center>
    </td>
    
    <td class="column-2">
      <center>
        MVC
      </center>
    </td>
    
    <td class="column-3">
      <center>
        Web Applications
      </center>
    </td>
    
    <td class="column-4">
      <ul>
        <li>
          Templating
        </li>
        <li>
          ORM
        </li>
        <li>
          AJAX
        </li>
        <li>
          Routing
        </li>
      </ul>
    </td>
  </tr>
  
  <tr class="row-3 odd">
    <td class="column-1">
      <center>
        2
      </center>
    </td>
    
    <td class="column-2">
      <center>
        Thin Server
      </center>
    </td>
    
    <td class="column-3">
      <center>
        Browser MVC and Mobile Apps
      </center></span>
    </td>
    
    <td class="column-4">
      <ul>
        <li>
          JSON
        </li>
        <li>
          Document Databases
        </li>
        <li>
          Data on the Wire
        </li>
      </ul>
    </td>
  </tr>
  
  <tr class="row-4 even">
    <td class="column-1">
      <center>
        3
      </center>
    </td>
    
    <td class="column-2">
      <center>
        REST
      </center>
    </td>
    
    <td class="column-3">
      <center>
        REST APIs
      </center>
    </td>
    
    <td class="column-4">
      <ul>
        <li>
          REST
        </li>
        <li>
          Security/ACLs
        </li>
        <li>
          Data Aggregation
        </li>
        <li>
          Distributed Data Sources
        </li>
      </ul>
    </td>
  </tr>
</table>

Browser and mobile applications are increasingly complex and require sophisticated data access. Several generations of API servers and frameworks have risen to meet this demand by supporting the requirements of these rich applications out of the box. The next generation of API servers and frameworks should support not only “data on the wire”, but aggregation, security and other features required by increasingly complex clients. If you are looking at building an API server, [LoopBack](http://loopback.io/) provides the next generation of features that allow you to support the requirements of even richer client applications.

## **What’s next?**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Install LoopBack with a <a href="http://strongloop.com/get-started/">simple npm command</a></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What’s in the upcoming Node v0.12 version? <a href="http://strongloop.com/strongblog/performance-node-js-v-0-12-whats-new/">Big performance optimizations</a>, read the blog by Ben Noordhuis to learn more.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Need performance monitoring, profiling and cluster capabilites for your Node apps? Check out <a href="http://strongloop.com/node-js-performance/strongops/">StrongOps</a>!</span>
</li>