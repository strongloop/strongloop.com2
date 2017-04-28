---
id: 27655
title: LoopBack Connector Development and Creating Your Own Connector
date: 2016-07-14T12:00:21+00:00
author: Nagarjuna Surabathina
guid: https://strongloop.com/?p=27655
permalink: /strongblog/loopback-connector-development-and-creating-your-own-connector/
categories:
  - How-To
  - LoopBack
---
I started hearing terms like “LoopBack connector” and “StrongLoop’s connector development framework” when our business was undergoing a transition to leverage community-driven connector development. This is an essential shift  today to integrate with the ever-increasing number of business-critical SaaS applications.<!--more-->

I initially thought LoopBack would be yet another connector development framework that would take lots of time to understand before I could build connectors and applications. But once I started learningLoopBack, I realized it was not as hard to decipher as I imagined.  I subsequently developed connectors for IBM DB2®, Salesforce, IBM Cloudant, and Google Spreadsheets. This article captures some of my experience with LoopBack connector development and gives you a jumpstart on creating your own connector.

Let me start by briefly explaining the relevant LoopBack terminology.  For interacting with any system, the foremost requirement is the endpoint application (for example, Salesforce) credentials. A _data source_ has settings for the credentials to interact with the end point system. A _model_ represents the backend system object (business object), along with methods injected by LoopBack&#8217;s Data Access Object. Models connect to endpoint systems via data sources.

## Building a &#8220;Hello World&#8221; connector

Now I&#8217;ll walk through the steps to develop a simple &#8220;hello world&#8221; LoopBack connector.

The first step is to  create a Node.js package named loopback-connector-_foo_, say loopback-connector-helloworld. As with any Node.js module, first create a `package.json` file with name, version, description, main and properties.

For example:

```js
{
  "name": "loopback-connector-helloworld",
  "version": "1.0.0",
  "description": "Helloworld connector for loopback-datasource-juggler",
  "main": "index.js",
  "dependencies": {
    "loopback-connector": "2.3.0"
  },
  "devDependencies": {
    "mocha": "~2.0.1"
  }
 }
```

The above `package.json` file references a file named `index.js` that is the main program file for the package.  The name of the file can be anything, but must match the **main** property in `package.json`.  So, create `index.js` and add the following line:

```js
module.exports = require('./lib/helloworld.js');
```

This simply states that main file is `helloworld.js`  in the `lib` folder.

All LoopBack connectors follow same code structure, keeping the connector-specific code in the `/lib` folder of the connector. It’s not mandatory, but following the same structure is advisable. So let’s create a folder called `lib` with `helloworld.js` in it.

Now, Let’s look at the actual implementation of the connector.

### Initialization

For each datasource of connector (here helloworld), the LoopBack framework will call the `initialize` method with a `dataSource` object that contains user-defined endpoint details as settings. As described below, we need to create a new instance of connector for each datasource and store required fields in this object.

We need to export an initialize function as follows:

```js
exports.initialize = function initializeDataSource(dataSource, callback) {
  console.log(dataSource.settings);
  dataSource.connector = new HelloWorldConnector(dataSource.settings);
  process.nextTick(function () {
    callback && callback();
  });
 };
 
function HelloWorldConnector(dataSourceProps) {
  this.field1 = dataSourceProps.field1; 
}
```

This code enables the LoopBack framework to recognize the helloworld connector.

Now that we have a skeleton for the new connector, let&#8217;s flesh out the runtime operations.

## CRUD operations

LoopBack connectors expose standard create, read, update, and delete (CRUD) operations for each persisted model. Invoking a specific REST API on a model calls the associated connector method via the loopback-datasource-juggler DAO (data access object).

Here is the OpenAPI (Swagger) definition of a model called model1. The steps to create the model are explained in final section.

[<img class="aligncenter size-medium wp-image-27660" src="{{site.url}}/blog-assets/2016/07/model1-image-300x171.jpg" alt="model1-image" width="300" height="171"  />]({{site.url}}/blog-assets/2016/07/model1-image.jpg)

In our example helloworld connector, we will perform CRUD operations with an  in-memory table containing **id** and **name** properties:

<table>
  <tr>
    <th>
      ID
    </th>
    
    <th>
      name
    </th>
  </tr>
  
  <tr>
    <td>
      1
    </td>
    
    <td>
      hello
    </td>
  </tr>
  
  <tr>
    <td>
      2
    </td>
    
    <td>
      world
    </td>
  </tr>
</table>

Now we&#8217;ll implement methods for all the CRUD endpoints.

### GET all records

This method gets all records for the model.  In our example, the basic REST endpoint (without any filters) would be:

```js
GET /model1s
```

See the documentation for the corresponding [PersistedModel REST API call to get all matching records](https://docs.strongloop.com/display/LB/PersistedModel+REST+API#PersistedModelRESTAPI-Findmatchinginstances).

The associated connector method for getting all the records (model instances) is the &#8220;all&#8221; method. Let&#8217;s implement “all” as follows:

```js
HelloWorldConnector.prototype.all = function (model, filter, callback) {
  //connector implementation logic 
  callback(null, [{"id": 1, "name": "hello"}, {"id": 2, "name": "world"}]);
};

```

Notice the first parameter for the “all” method is model. LoopBack will call connector methods with model name as first parameter. LoopBack&#8217;s Connector object implements basic interfaces for maintaining models, getting id, property name, and so on. To inherit the Connector methods, add the following statements:

```js
var Connector = require('loopback-connector').Connector;

require('util').inherits(HelloWorldConnector, Connector);
```

The connector constructor should define JSON object _models.

```js
function HelloWorldConnector(dataSourceProps) {
  this.field1 = dataSourceProps.field1;
  this._models = {};
}
```

Loopback will add all model definitions to _models with the model name as key.

So to retrieve model properties, we use `this._models[model].properties` and to retrieve the **id** field name, we use `this.idName(model)`.

For more information on LoopBack filters, see [Querying data](https://docs.strongloop.com/display/public/LB/Querying+data).

The first argument in the callback is **error** and the second is **response** which is of array type.

### GET record by ID

This method gets a record in the model that match a certain ID (or primary key field). In our example, the basic REST endpoint for it would be:

```js
GET /model1s/{id}
```

See the documentation for the corresponding [PersistedModel endpoint to get an record by ID](https://docs.strongloop.com/display/LB/PersistedModel+REST+API#PersistedModelRESTAPI-FindinstancebyID).

The associated connector method for getting particular record is also the same as the **all** method. In this case, the filter property will have and ID (or primary key field) in the where clause. So the connector method needs to implement the **all** method to work with both &#8220;get all&#8221; and &#8220;get by id&#8221; operations.

```js
HelloWorldConnector.prototype.all = function (model, filter, callback) {
  if (filter && filter.where && filter.where.id) { //GET with id operation
    if (filter.where.id === 1) {
      callback(null, [{"id": 1, "name": "hello"}]);
    } else if (filter.where.id === 2) {
       callback(null, [{"id": 2, "name": "world"}]);
    }
  } else { //GET all operation
    callback(null, [{"id": 1, "name": "hello"}, {"id": 2, "name": "world"}]);
  }
};
```

For a create operation to be more meaningful, let&#8217;s move the hard-coded response to the connector constructor response. Then the code starts to look like this:

```js
function HelloWorldConnector(dataSourceProps) {
  this.field1 = dataSourceProps.field1;
  this.response = [{"id": “1”, "name": "hello"}, {"id": “2”, "name": "world"}];
  this._models = {};
}

HelloWorldConnector.prototype.all = function (model, filter, callback) {
  console.log("all method");
  if (filter && filter.where && filter.where.id) { //GET with id operation
    this.response.forEach(function (field) {
      if (filter.where.id === field.id) {
        callback(null, [field]);
        return;
      }
    });
  } else { //GET all operation
    callback(null, this.response);
  }
};
```

### Create record

This method creates a new record for the object.  In our example, the endpoint would be:

```js
POST /model1s
```

The associated connector method is the **create** method, that we implement like this:

```js
HelloWorldConnector.prototype.create = function (model, data, callback) {
  console.log("create method");
  if (data.id) {
    this.response.push(data);
  } else {
    data.id = this.response.length + 1;
    this.response.push(data);
  }
  callback(null, data.id);
};
```

The first argument in the callback is **error** and second is **response** which is string type containing id (or primary field) value.

See the documentation for the [same endpoint for PersistedModel](https://docs.strongloop.com/display/LB/PersistedModel+REST+API#PersistedModelRESTAPI-Createmodelinstance).

### Update or insert record

This method updates and existing record or creates a new record if it doesn&#8217;t already exist.  For our example, the endpoint would be:

```js
PUT /model1s
```

The associated connector method is the **updateOrCreate** method, that we&#8217;ll implement like this:

```js
HelloWorldConnector.prototype.updateOrCreate = function (model, data, callback) {
  console.log("updateOrCreate");
  var isCreate = true;
  for (i = 0; i < this.response.length; i++) {
    if (this.response[i].id === data.id) {
      this.response[i].name = data.name;
      isCreate = false;
      callback(null, data);
      return;
    }
  }

  if (isCreate) {
    this.response.push(data);
    callback(null, data);
  }
};

```

The first argument in the callback is **error** and second is **response** which is object type containing data.

See the documentation for the [corresponding endpoint for PersistedModel](https://docs.strongloop.com/display/LB/PersistedModel+REST+API#PersistedModelRESTAPI-Update/insertinstance).

### Update existing record

This method updates an existing record, based on the **id** field.  For our example, the endpoint would be:

```js
PUT /model1s/{id}
```

The associated connector method for updating the existing record is **updateAttributes**, that we&#8217;ll implement with the following skeleton code:

```js
HelloWorldConnector.prototype.updateAttributes = function updateAttrs(model, id, data, callback) {
  console.log("updateAttributes");
  callback(null, data);
};
```

The first argument in the callback is **error** and second is **response** which is object type containing data.

See the documentation for the [corresponding endpoint for PersistedModel](https://docs.strongloop.com/display/LB/PersistedModel+REST+API#PersistedModelRESTAPI-Updatemodelinstanceattributes).

### Delete record by id

This endpoint deletes an existing record based on the value of the id field.  Our example endpoint would be:

```js
DELETE /model1s/{id}
```

The associated connector method for deleting the existing record is the **destroyAll** method.
  
Connector destroyAll method skeleton code, where the object has a unique id field (or a primary key field).

```js
HelloWorldConnector.prototype.destroyAll = function destroy(model, where, callback) {
  console.log("destroyAll");
  callback(null, []);
};
```

The first argument in the callback is **error** and second is **response** which is used for status purposes (operation successful).

### Delete records

This method deletes records based on where filter criteria.

```js
DELETE /model1s
```

This route can be exposed by adding a remote hook in the generated model class (in JavaScript file). The associated connector method for this route also **destroyAll**. The &#8220;where&#8221; object will have key-value pairs.

Here&#8217;s an example implementation of the remote hook:

```js
model.remoteMethod(
  'destroyAll', {
    isStatic: true,
    description: 'Delete all matching records',
    accessType: 'WRITE',
    accepts: {
      arg: 'where',
      type: 'object',
      description: 'filter.where object',
      http: {source: 'query'}
    },
    http: {
      verb: 'del',
      path: '/'
    }
});
```

See the documentation for the [corresponding PersistedModel endpoint](https://docs.strongloop.com/display/LB/PersistedModel+REST+API#PersistedModelRESTAPI-Deleteallmatchinginstances).

### Update records

This endpoint updates all records based on where filter criteria.

```js
POST /model1s/update
```

The associated connector method for updating the existing records is the **update** method. Here is the connector update method skeleton code:

```js
HelloWorldConnector.prototype.update = function update(model, where, data, callback) {
  console.log("update");
  callback(null, []);
};
```

The **where** object will have key value pairs.

The first argument in the callback is **error** and second is **response** that is used for status purpose (operation successful).

See the documentation for the [corresponding PersistedModel endpoint](https://docs.strongloop.com/display/LB/PersistedModel+REST+API#PersistedModelRESTAPI-Updatematchingmodelinstances).

## Discovery methods

Discovery will give us the list of objects and structure (properties) for each object in endpoint application. Let’s implement the discovery functions.

### Verify endpoint credentials

The connector must implement a **ping** method with endpoint credentials verification logic.  Here is some skeleton code for the **ping** method:

```js
HelloWorldConnector.prototype.ping = function (callback) {
  console.log("ping");
  callback(null);
};

```

The callback argument is **null** or **error**.

### List models/objects

The associated connector method for list models/objects is the **discoverModelDefinitions** method, that we&#8217;ll implement with this skeleton code:

```js
HelloWorldConnector.prototype.discoverModelDefinitions = function (options, callback) {
  console.log("discoverModelDefinitions");
  callback(null, models);
};

```

Models should be array type.

### List model/object properties

The associated connector method for list model/object properties is the **discoverModelProperties** method.

Here is some skeleton code:

```js
HelloWorldConnector.prototype.discoverModelProperties = function (objectName, options, callback) {
  console.log("discoverModelProperties");
  callback(null, [{"name": "name", "type": "string", "length": 100, "required": true}]);
};
```

The second argument to the callback should be should be array type consisting of all fields with properties of **name**, **type**, **required**, and so on.

### Construct model object

The associated connector method for list model/object properties is the **discoverSchemas** method. This method constructs the object properties in LoopBack model format. Hence this method internally calls **discoverModelProperties** to fetch the properties and construct the model properties.

Here is an example of **discoverSchemas** method code:

```js
HelloWorldConnector.prototype.discoverSchemas = function (objectName, options, callback) {
  this.discoverModelProperties(objectName, options, function (error, response) {
    console.log(response);
    if (error) {
      callback && callback(error);
      return;
    }
    var schema = {
      name: objectName,
      options: {
        idInjection: true, // false - to remove id property
        sObjectName: objectName
      },
      properties: {}
    };

    if (response || response.length !== 0) {
      response.forEach(function (field) {
        var fieldProperties = {};
        Object.keys(field).forEach(function (fieldProperty) {
          fieldProperties[fieldProperty] = field[fieldProperty];
        });
        schema.properties[field["name"]] = fieldProperties;
      });
    }
    console.log(schema);
    options.visited = options.visited || {};
    if (!options.visited.hasOwnProperty(objectName)) {
      options.visited[objectName] = schema;
    }
    callback && callback(null, options.visited);
  });
}

```

## Test the connector

Now that we&#8217;ve developed our sample connector, let&#8217;s test it.  We&#8217;ll use the IBM [API Connect Developer Toolkit](https://developer.ibm.com/apiconnect/), that includes the apic command-line tool for creating and managing LoopBack application projects (it&#8217;s similar to StrongLoop&#8217;s old **slc** tool).

After installing API Connect, just follow these steps:

  1. Create a LoopBack application:
  
    **apic loopback &#8211;explorer
  
** Call it &#8220;myapp&#8221;.
  
    Make it a &#8220;hello-world&#8221; application.
  2. Go into the app directory:
  
    **cd myapp**
  3. Copy the connector Node module you created above to the LoopBack app&#8217;s `node_modules` folder.
  4. Create a data source with helloworld as connector type:
  
    **apic loopback:datasource**.
  5. Create a model:
  
    **apic loopback:model**.
  
    Select helloworld datasource.
  
    Select PersistedModel.
  
    Add &#8220;name&#8221; property.
  6. Run the app with **apic start**.
  7. Open LoopBack explorer and try rest APIs &#8211; [http://localhost:4001/explorer
  
](http://localhost:4001/explorer)  Your app may be running on a different port number (the console will tell you).

And that&#8217;s that! I hope you have enjoyed your journey through coding your first LoopBack connector!

## Learning more

Want to know more? These links can help you learn more about the existing LoopBack connectors:

  * [Database connectors](https://docs.strongloop.com/display/public/LB/Database+connectors)
  * [Community connectors](https://docs.strongloop.com/display/public/LB/Community+connectors)