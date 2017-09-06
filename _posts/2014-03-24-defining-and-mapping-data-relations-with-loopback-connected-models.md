---
id: 14808
title: Defining and Mapping Data Relations with LoopBack Connected Models
date: 2014-03-24T11:09:44+00:00
author: Raymond Feng
guid: http://strongloop.com/?p=14808
permalink: /strongblog/defining-and-mapping-data-relations-with-loopback-connected-models/
categories:
  - Community
  - How-To
  - LoopBack
  - Mobile
---
In [LoopBack](http://strongloop.com/mobile-application-development/loopback/), working with data is usually the core of business logic. We typically start by defining models to represent business data. Then we attach models to configured data sources to receive behaviors provided by various connectors. For example, connectors for databases implement methods for models to perform create, read, update, and delete (CRUD) operations. Furthermore, you can expose models and their methods as REST APIs so client applications can easily consume them.

Individual models are easy to understand and work with. But in reality, models are often connected or related. The moment you start to build a real-world application with multiple models, relations between models will come into the picture naturally. For example:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">A customer has many orders and each order is owned by a customer.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">A user can be assigned to one or more roles and a role can have zero or more users.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">A physician takes care of many patients through appointments. A patient can see many physicians too.</span>
</li>

With the connected models, LoopBack can present data to client applications as a connected graph, with connectors to interact with the backend systems behind the scenes. The data graph is then exposed as a set of APIs for the client to not only interact with each of the model instances, but also “slice and dice” the information based on the client’s need.

The first part of the blog walks through different types of relations, how to define them, and what Node.js APIs are available for navigating and associating the connected models. The second part of the blog describes how to map data navigation and aggregation capabilities to REST APIs.

<!--more-->

<h2 dir="ltr">
  <strong>Understanding and defining relations</strong>
</h2>

LoopBack model relations are inspired by [Ruby on Rails Active Record Associations](http://guides.rubyonrails.org/association_basics.html). You’ll find a lot of similarity in terms of concepts and how it works. At the moment, LoopBack supports the four types of relations:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">belongsTo </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">hasMany </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">hasMany through </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">hasAndBelongsToMany </span>
</li>

Let’s examine the relation types one by one. We’ll explain what a relation is for, how to declare it, and how to use it with the utility methods mixed into the model by LoopBack.

<h2 dir="ltr">
  <strong>The belongsTo relation</strong>
</h2>

A “belongsTo” relation specifies a one-to-one connection between two models: each instance of the declaring model &#8220;belongs to&#8221; one instance of the related model. For example, in an application with customers and orders, each order “belongs to” one customer, as illustrated in the diagram below.
  
<img src="https://strongloop.com/blog-assets/2014/03/CXorder.png" alt="The belongsTo relation - Customer Order" width="500px;"/>

<img src="https://strongloop.com/blog-assets/2017/08/mmhackathonsep2017.png" alt="API-First Hackathon with IBM Watson | Strongloop | Bluemix" style="width: 500px"/>

The declaring model (Order) has a foreign key property that references the primary key property of the target model (Customer). If a primary key is not present, LoopBack will automatically add one.

<h2 dir="ltr">
  <strong>Defining a belongsTo relation</strong>
</h2>

A belongsTo relation has three configurable properties:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">The target model, such as Customer. </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">The relation name, such as ‘customer’. It becomes a method on the declaring model’s prototype. </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">The foreign key property on the declaring model, such as ‘customerId’. It references the target model’s primary key (Customer.id). </span>
</li>

You can declare relations in the options property in `models.json`, for example:

```js
"Order": {
   "properties": {
       "customerId": "number",
       "orderDate": "date"
   },
   "options": {
     "relations": {
       "customer": {
         "type": "belongsTo",
         "model": "Customer",
         "foreignKey": "customerId"
       }
     }
   }
 }
```

Alternatively, you can define a “belongsTo” relation in code:

```js
var Order = ds.createModel('Order', {
    customerId: Number,
    orderDate: Date
});
var Customer = ds.createModel('Customer', {
    name: String
});
Order.belongsTo(Customer);
```

You can specify the relation name and foreign key as arguments to the belongsTo() method:

```js
Order.belongsTo(Customer, {as: ‘customer’, foreignKey: ‘customerId’);
```

If the  declaring model doesn’t have a foreign key property, LoopBack will add a property with the same name.  The type of the property will be the same as the type of the target model’s id property.

If you don’t specify them, then LoopBack derives the relation name and foreign key as follows:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">relation name: The camel case of the model name, for example, ‘Customer’ ⇒ ‘customer’. </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">foreign key: The relation name appended with ‘Id’, for example, ‘customer’ ⇒ ‘customerId’</span>
</li>

<h2 dir="ltr">
  <strong>Methods added to the model for belongsTo</strong>
</h2>

Once you define the belongsTo relation, a method with the relation name is added to the declaring model class’s prototype automatically, for example: `Order.prototype.customer(...)`.

Depending on the arguments, the method can be used to get or set the owning model instance.

<div dir="ltr">
  <table>
    <colgroup> <col width="257" /> <col width="367" /></colgroup> <tr>
      <td>
        Function
      </td>
      
      <td>
        Code snippet
      </td>
    </tr>
    
    <tr>
      <td>
        Get the customer for the order asynchronously
      </td>
      
      <td>
        order.customer(function(err, customer) {<br /> …<br /> });
      </td>
    </tr>
    
    <tr>
      <td>
        Get the customer for the order synchronously
      </td>
      
      <td>
        var customer = order.customer();
      </td>
    </tr>
    
    <tr>
      <td>
        Set the customer for the order
      </td>
      
      <td>
        order.customer(customer);
      </td>
    </tr>
  </table>
</div>

&nbsp;

## **The hasMany relation**

A “hasMany” relation indicates a one-to-many connection between two models. It indicates that each instance of the declaring model has zero or more instances of another model. This relation often occurs in conjunction with a belongsTo relation. For example, in an application with customers and orders, a customer can have many orders, as illustrated in the diagram below.
  
<img alt="" src="https://lh5.googleusercontent.com/FFPbf44RIqVJyOpp0hERm_9yI3PPXTm21mWFybY7CToHebgQBaSUQqFNK2svyUtV6QRf-O1htha_XkFJXLauOlYenq-WiT3TCrxKMMRwxJ2pfu6eUHNLW1WH4Xre8w" width="512px;" height="129px;" />

The target model Order has a property customerId as the foreign key to reference the declaring model (Customer) primary key id.

<h2 dir="ltr">
  <strong>Defining a hasMany relation</strong>
</h2>

A hasMany relation has three configurable properties:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">The target model, such as Order </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">The relation name, such as ‘orders’. It becomes a method on the declaring model’s prototype </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">The foreign key property on the target model, such as ‘customerId’. It references the declaring model’s primary key (Customer.id) </span>
</li>

You can declare relations in the options property in `models.json`, for example:

```js
"Customer": {
    "properties": {
        "id": {"type": "number", "id": true, "generated": true},
        "name": "string"
    },
    "options": {
      "relations": {
        "orders": {
          "type": "hasMany",
          "model": "Order",
          "foreignKey": "customerId"
        }
      }
    }
  }
```

Alternatively, you can define the relation in code:

```js
var Order = ds.createModel('Order', {
    customerId: Number,
    orderDate: Date
});
var Customer = ds.createModel('Customer', {
    name: String
});
```

Both names can be provided to the `hasMany()` method explicitly.

```js
Customer.hasMany(Order, {as: 'orders', foreignKey: 'customerId'});
```

If not specified, then LoopBack derives the relation name and foreign key as follows:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">relation name: The plural form of the camel case of the model name, for example, ‘Order’ ⇒ ‘order’ ⇒ ‘orders’. </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">foreign key: The camel case of the declaring model name appended with ‘Id’, for example, ‘Customer’ ⇒ ‘customerId’</span>
</li>

<h2 dir="ltr">
  <strong>Methods added to the model for hasMany</strong>
</h2>

Once you define a hasMany relation, a method with the relation name is added to the declaring model class’s prototype automatically, for example: `Customer.prototype.orders(...)`.

<div dir="ltr">
  <table>
    <colgroup> <col width="257" /> <col width="367" /></colgroup> <tr>
      <td>
        Function
      </td>
      
      <td>
        Code snippet
      </td>
    </tr>
    
    <tr>
      <td>
        Find orders for the customer by the filter
      </td>
      
      <td>
        customer.orders(filter, function(err, orders) {<br /> &#8230;<br /> });
      </td>
    </tr>
    
    <tr>
      <td>
        Build a new order for the customer with the customerId to be set to the id of the customer. No persistence is involved.
      </td>
      
      <td>
        var order = customer.orders.build(data);<br /> It’s the same as:<br /> var order = new Order({customerId: customer.id, …});
      </td>
    </tr>
    
    <tr>
      <td>
        Create a new order for the customer
      </td>
      
      <td>
        customer.orders.create(data, function(err, order) {<br /> &#8230;<br /> });<br /> It’s the same as:<br /> Order.create({customerId: customer.id, …}, function(err, order) {<br /> &#8230;<br /> });
      </td>
    </tr>
    
    <tr>
      <td>
        Remove all orders for the customer
      </td>
      
      <td>
        customer.orders.destroyAll(function(err) {<br /> &#8230;<br /> });
      </td>
    </tr>
    
    <tr>
      <td>
        Find an order by id
      </td>
      
      <td>
        customer.orders.findById(orderId, function(err, order) {<br /> &#8230;<br /> });
      </td>
    </tr>
    
    <tr>
      <td>
        Delete an order by id
      </td>
      
      <td>
        customer.orders.destroy(orderId, function(err) {<br /> &#8230;<br /> });
      </td>
    </tr>
  </table>
</div>

## **The hasManyThrough relation**

A “hasManyThrough” relation creates a many-to-many connection with another model through a third model. This relation indicates that the declaring model matches zero or more instances of the related model through the third model. For example, in an application for a medical practice where patients make appointments to see physicians, the relevant relation declarations could look like this:

<img alt="" src="https://lh4.googleusercontent.com/NEMGnzPETEesONVQ-sqMtds0COfuNkmhpHoTTqC5l1z6TCcmTUuEkx0iKbMVVXOf85o-8izEt3Mpe2VQN_6xE3hHqnxOKgenyzh3sXjFD96i16W64Zji-ljWoeG5rg" width="624px;" height="173px;" />

&nbsp;

The “through” model, Appointment, has two foreign key properties, physicianId and patientId, that reference the primary keys in the declaring model, Physician, and the target model, Patient.

<h2 dir="ltr">
  <strong>Defining a hasManyThrough relation</strong>
</h2>

```js
var Physician = ds.createModel('Physician', {name: String});
var Patient = ds.createModel('Patient', {name: String});
var Appointment = ds.createModel('Appointment', {
    physicianId: Number,
    patientId: Number,
    appointmentDate: Date
});
Physician.hasMany(Patient, {through: Appointment});
Patient.hasMany(Physician, {through: Appointment});
```

<h2 dir="ltr">
  <strong>Methods added to the model for hasManyThrough</strong>
</h2>

<div dir="ltr">
  <table>
    <colgroup> <col width="277" /> <col width="363" /></colgroup> <tr>
      <td>
        Function
      </td>
      
      <td>
        Code snippet
      </td>
    </tr>
    
    <tr>
      <td>
        Find patients for the physician
      </td>
      
      <td>
        physician.patients(filter, function(err, patients) {<br /> &#8230;<br /> });
      </td>
    </tr>
    
    <tr>
      <td>
        Build a new patient
      </td>
      
      <td>
        var patient = physician.patients.build(data);
      </td>
    </tr>
    
    <tr>
      <td>
        Create a new patient for the physician
      </td>
      
      <td>
        physician.patients.create(data, function(err, patient) {<br /> &#8230;<br /> });
      </td>
    </tr>
    
    <tr>
      <td>
        Remove all patients for the physician
      </td>
      
      <td>
        physician.patients.destroyAll(function(err) {<br /> &#8230;<br /> });
      </td>
    </tr>
    
    <tr>
      <td>
        Add an patient to the physician
      </td>
      
      <td>
        physician.patients.add(patient, function(err, patient) {<br /> &#8230;<br /> });
      </td>
    </tr>
    
    <tr>
      <td>
        Remove an patient from the physician
      </td>
      
      <td>
        physician.patients.remove(patient, function(err) {<br /> &#8230;<br /> });
      </td>
    </tr>
    
    <tr>
      <td>
        Find an patient by id
      </td>
      
      <td>
        physician.patients.findById(patientId, function(err, patient) {<br /> &#8230;<br /> });
      </td>
    </tr>
  </table>
</div>

<h2 dir="ltr">
  <strong>The hasAndBelongsToMany relation</strong>
</h2>

A hasAndBelongsToMany relation creates a direct many-to-many connection with another model, with no intervening model. For example, in an application with assemblies and parts, where each assembly has many parts and each part appears in many assemblies, you could declare the models this way:
  
<img alt="" src="https://lh5.googleusercontent.com/thZ-Gwvhvy9jkFFxGHNJwQ7s-mik9nnn5oxFVEDNoZ6SXt4Kq8XAzIE9eYPWprG2yrWOavQZ5h-0bq2bvS3BQ8nra2PKEJelyGyHVQJ2F02Q2Sln5dIjjP8_2Pm12Q" width="624px;" height="176px;" />

<h2 dir="ltr">
  <strong>Defining a hasAndBelongsToMany relation</strong>
</h2>

```js
var Assembly = ds.createModel('Assembly', {name: String});
var Part = ds.createModel('Part', {partNumber: String});
Assembly.hasAndBelongsToMany(Part);
Part.hasAndBelongsToMany(Assembly);
```

<h2 dir="ltr">
  <strong>Methods added to the model for hasAndBelongsToMany</strong>
</h2>

<div dir="ltr">
  <table>
    <colgroup> <col width="257" /> <col width="367" /></colgroup> <tr>
      <td>
        Function
      </td>
      
      <td>
        Code snippet
      </td>
    </tr>
    
    <tr>
      <td>
        Find parts for the assembly
      </td>
      
      <td>
        assembly.parts(filter, function(err, parts) {<br /> });
      </td>
    </tr>
    
    <tr>
      <td>
        Build a new part
      </td>
      
      <td>
        var part = assembly.parts.build(data);
      </td>
    </tr>
    
    <tr>
      <td>
        Create a new part for the assembly
      </td>
      
      <td>
        assembly.parts.create(data, function(err, part) {<br /> });
      </td>
    </tr>
    
    <tr>
      <td>
        Add a part to the assembly
      </td>
      
      <td>
        assembly.parts.add(part, function(err) {<br /> });
      </td>
    </tr>
    
    <tr>
      <td>
        Remove a part from the assembly
      </td>
      
      <td>
        assembly.parts.remove(part, function(err) {<br /> });
      </td>
    </tr>
    
    <tr>
      <td>
        Find a part by id
      </td>
      
      <td>
        assembly.parts.findById(partId, function(err, part) {<br /> });
      </td>
    </tr>
    
    <tr>
      <td>
        Delete a part by id
      </td>
      
      <td>
        assembly.parts.destroy(partId, function(err) {<br /> });
      </td>
    </tr>
  </table>
  
  <p>
    &nbsp;
  </p>
</div>

<h2 dir="ltr">
  <strong>Slicing and dicing the data graph</strong>
</h2>

Now we have covered the four types of model relations in LoopBack. As you have seen, a relation defines the connection between two models by connecting a foreign key property to a primary key property. For each relation type, a list of helper methods are mixed into the model class to help navigate and associate the model instances to load or build a data graph.

Often, client applications want to pick and choose the relevant data from the graph using APIs, for example to get user information and recently-placed orders. LoopBack provides a few ways to express such requirements in queries.

<h2 dir="ltr">
  <strong>Inclusion</strong>
</h2>

To include related models in the response for a query, we can use the ‘include’ property of the query object or use the include method on the model class.

The ‘include’ can be a string, an array, or an object. The valid formats are illustrated below using examples:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Load all user posts with only one additional request. </span>
</li>

```js
User.find({include: 'posts'}, function() {
...
});
```

It is the same as:

```js
User.find({include: ['posts']}, function() {
...
});
```

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Load all user posts and orders with two additional requests. </span>
</li>

```js
User.find({include: ['posts', 'orders']}, function() {
...
});
```

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Load all post owners (users), and all orders of each owner </span>
</li>

```js
Post.find({include: {owner: ‘orders’}}, function() {
...
});
```

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Load all post owners (users), and all friends and orders of each owner </span>
</li>

```js
Post.find({include: {owner: [‘freinds’, ‘orders’]}}, function() {
...
});
```

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Load all post owners (users), and all posts and orders of each owner. The posts also include images. </span>
</li>

```js
Post.find({include: {owner: [{posts: ‘images’} , ‘orders’]}}, function() {
...
});
```

The ‘include’ method is also available for the model class, for example, the code snippet below will populate the list of user instances with posts.

```js
User.include(users, 'posts', function() {
...
});
```

<h2 dir="ltr">
  <strong>Scope</strong>
</h2>

Scoping enables you to define a query as a method to the target model class or prototype. For example,

```js
User.scope(‘top10Vips’, {where: {vip: true}, limit: 10});

User.top10Vips(function(err, vips) {
});
```

You can create the same function using a custom method too:

```js
User.top10Vips = function(cb) {
User.find({where: {vip: true}, limit: 10}, cb);
}
```

<h2 dir="ltr">
  <strong>Exposing REST APIs for the graph</strong>
</h2>

Let’s take the following models as an example to demonstrate how the connected models can be accessed via REST APIs.

```js
var db = loopback.createDataSource({connector: 'memory'});
  Customer = db.createModel('customer', {
    name: String,
    age: Number
  });
  Review = db.createModel('review', {
    product: String,
    star: Number
  });
  Order = db.createModel('order', {
    description: String,
    total: Number
  });

  Customer.scope("youngFolks", {where: {age: {lte: 22}}});
  Review.belongsTo(Customer, {foreignKey: 'authorId', as: 'author'});
  Customer.hasMany(Review, {foreignKey: 'authorId', as: 'reviews'});
  Customer.hasMany(Order, {foreignKey: 'customerId', as: 'orders'});
  Order.belongsTo(Customer, {foreignKey: 'customerId'});
```

The code is available at <https://github.com/strongloop-community/loopback-example-datagraph>. You can check it out using git and start to play with the REST APIs.

```js
git clone <a href="mailto:git@github.com">git@github.com</a>:strongloop-community/loopback-example-datagraph.git
cd loopback-example-datagraph
npm install
node app
```

The sample APIs is now available at <http://localhost:3000>.  Here are the specific endpoints:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">List all customers </span>
</li>

[/api/customers](http://localhost:3000/api/customers)

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">List all customers with the name property only </span>
</li>

[/api/customers?filter\[fields\]\[0\]=name](http://localhost:3000/api/customers?filter[fields][0]=name)

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Look up a customer by id </span>
</li>

[/api/customers/1](http://localhost:3000/api/customers/1)

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">List a predefined scope ‘youngFolks’ </span>
</li>

[/api/customers/youngFolks](http://localhost:3000/api/customers/youngFolks)

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">List all reviews posted by a given customer </span>
</li>

[/api/customers/1/reviews](http://localhost:3000/api/customers/1/reviews)

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">List all orders placed by a given customer </span>
</li>

[/api/customers/1/orders](http://localhost:3000/api/customers/1/orders)

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">List all customers including their reviews </span>
</li>

[/api/customers?filter[include]=reviews](http://localhost:3000/api/customers?filter[include]=reviews)

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">List all customers including their reviews which also includes the author </span>
</li>

[/api/customers?filter\[include\]\[reviews\]=author](http://localhost:3000/api/customers?filter[include][reviews]=author)

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">List all customers whose age is 21, including their reviews which also includes the author </span>
</li>

[/api/customers?filter\[include\]\[reviews\]=author&filter\[where\]\[age\]=21](http://localhost:3000/api/customers?filter[include][reviews]=author&filter[where][age]=21)

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">List first two customers including their reviews which also includes the author </span>
</li>

[/api/customers?filter\[include\]\[reviews\]=author&filter[limit]=2](http://localhost:3000/api/customers?filter[include][reviews]=author&filter[limit]=2)

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">List all customers including their reviews and orders </span>
</li>

[/api/customers?filter[include]=reviews&filter[include]=orders](http://localhost:3000/api/customers?filter[include]=reviews&filter[include]=orders)

<h2 dir="ltr">
  <strong>References</strong>
</h2>

<li style="margin-left: 2em;">
  <a href="http://docs.strongloop.com/display/DOC/Model+relations+REST+API"><span style="font-size: 18px;">LoopBack Model Relations REST API</span></a>
</li>
<li style="margin-left: 2em;">
  <a href="https://github.com/strongloop/loopback-datasource-juggler/blob/master/examples/relations.js"><span style="font-size: 18px;">Example: Relations.js</span></a>
</li>
<li style="margin-left: 2em;">
  <a href="https://github.com/strongloop/loopback-datasource-juggler/blob/master/examples/inclusion.js"><span style="font-size: 18px;">Example: Inclusion.js</span></a>
</li>
<li style="margin-left: 2em;">
  <a href="https://github.com/strongloop-community/loopback-example-datagraph"><span style="font-size: 18px;">Example: Datagraph</span></a>
</li>

## **What’s next?**

  * Install LoopBack with a [simple npm command](http://strongloop.com/get-started/)
  * What’s in the upcoming Node v0.12 version? [Big performance optimizations](http://strongloop.com/strongblog/performance-node-js-v-0-12-whats-new/), read the blog by Ben Noordhuis to learn more.
  * Need performance monitoring, profiling and cluster capabilities for your Node apps? Check out [StrongOps](http://strongloop.com/node-js-performance/strongops/)!
