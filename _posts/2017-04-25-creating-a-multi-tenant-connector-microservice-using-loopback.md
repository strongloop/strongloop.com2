---
id: 29127
title: Creating a Multi-Tenant Connector Microservice Using LoopBack
Date: 2017-04-25T08:10:00+00:00
author: Nagarjuna Surabathina
guid: http://strongloop.com/?p=29127
permalink: /strongblog/creating-a-multi-tenant-connector-microservice-using-loopback/
categories: 
- connector
- How-To
- ibm
- LoopBack
- microservice
- multi-tenant connector microservice
- strongloop
---

**Note:**
 This article was co-written by Subramanian Krishnan and Nagarjuna Surabathina.

<h3>Background</h3>

LoopBack is a highly-extensible, open-source Node.js framework that enables you to quickly create dynamic end-to-end REST APIs with little or no coding. LoopBack allows users to define data models and connect these models to backend systems such as databases via data sources that provide create, retrieve, update, and delete (CRUD) functions. Data sources are backed by connectors that implement the data exchange logic using database drivers or other client APIs. In general, applications don’t use connectors directly, rather they go through data sources using the DataSource and PersistedModel APIs. The models defined in a LoopBack application can be automatically exposed as REST APIs using Strong Remoting. [Source: 
[LoopBack docs](https://loopback.io/)]
more

With LoopBack you generally create models and datasources statically in JSON or JavaScript files. When the application bootstraps, the framework loads the models and makes their REST APIs available. Typically a single user owns the applications and their APIs, even though a community of developers and applications may use the exposed REST APIs. Further, the application owner is responsible for hosting the app, managing it, and scaling it as needed. An attractive alternative to this approach is to make LoopBack available as a service (on an existing cloud platform like IBM BlueMix or as a standalone SaaS) which shifts the responsibility of hosting, managing, and scaling the runtime from the app developer to a service provider. In general, such a service provider would be better able to manage scalability and exploit economies of scale and amortization of costs by making it a multi-tenant service like other cloud services.

This article focuses on LoopBack-as a Service, where a service provider hosts and scales a multi-tenant LoopBack application that allows consumers of the service to dynamically create datasources and models and use their REST APIs. LoopBack has a 
[rich set of APIs](https://apidocs.strongloop.com/loopback/) that makes this possible. However multi-tenancy and creating models and datasources dynamically pose their own challenges that we'll discuss along with solutions.

<h3>Challenges</h3>

1. Since models and datasources are not statically defined in files during development of the application, setting them up during bootstrapping is not an option. This also means that these artifact definitions need to be persisted so that they can be retrieved after a process restart or when new instances are added for scaling. (NoSQL store)

2. LoopBack provides Node.js APIs for creating models and datasources. The service needs to provide a full set (CRUD) of REST APIs for doing lifecycle operations on models and datasources that can be invoked remotely.

3. LoopBack's model APIs are automatically REST-enabled. However the datasource discovery is a Node.js API and needs some work to be REST-enabled.

4. The LoopBack APIs for models and datasources are not complete in the sense that they don’t have a delete/update API. This is not a problem in single-tenant statically-defined apps because you can just update or delete the definition files and restarting the app. However the same luxury is not practical in a multi-tenant app because restarting the app will cause downtime for all tenants.

5. Making the application multi-tenant and dynamically configurable means there can be multiple models with the same name. We need a way to distinguish models, even if they have the same names. The corollary is that the REST URL for every model should also be distinct even if they have the duplicate names.

Note: Whether to have one microservice per connector type or a common one for all is an architectural consideration. For the sake of simplicity and focus, we assume a single microservice that hosts all connectors.

<h3>Solution</h3>

The figure below illustrates the service architecture and how it addresses each of the challenges posed above.


[![Creating a Multi-Tenant Connector Microservice Using LoopBack: service architecture]({{site.url}}/blog-assets/2017/04/service-architecture-1030x663.png)]({{site.url}}/blog-assets/2017/04/service-architecture.png)

The service is implemented as a LoopBack application which bundles the LoopBack connectors to interact with the applications.


**1. & 2. REST APIs for creating datasources and models dynamically**


The service needs to expose REST API routes for datasources, models, and discovery as well as implement handlers for them. We can add new routes in the application 
**/server/boot/root.js**
 file.
```js
module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  router.post('/datasources',  createDatasource); //createDatasource is a method in datasource.js
  router.post('/models',  createModel); //createModel is a method in model.js
  server.use(router);
};
```
When datasource configuration JSON is available, we can use the app.dataSource() method to create a datasource object programmatically as shown below.
```js
var loopback = require("loopback");
var app = module.exports = loopback(); var dsConfig = { "hostname": "xxx.xxx.xxx.xxx", "username": "username", "connector": "helloworld", "password": "password" }); app.dataSource('dsname', dsConfig);
```
To implement the REST handler for createDatasource() we use the same API as above.
```js
var app = require('./server');

function createDatasource(req, res) {
 try{
   var datsourceConfig = req.body.datsourceConfig; //datasource details is available in the request payload
   datsourceConfig["connector"] = req.body.connectorName;
    //generate the unique id - uuid
   //save the datasourceConfig in NoSQL store with uuid
   app.dataSource(uuid, datsourceConfig); 
   //construct result with datasource name (uuid) and necessary info
   res.status(200).send(result);
 }catch(ex){
   res.status(500).send(ex);
 }
}
```
When model configuration JSON is available, we can use the loopback.createModel() method to create a model object programmatically as shown below.
```js
var modelProps = {
    "name": {
      "type": "String",
      "required": true,
      "length": 100,
      "helloworld": {
        "columnName": "name",
        "dataType": "varchar",
        "dataLength": 100,
        "nullable": "N"
      }
    }

var model = {
    "name": "modelname",
    "plural": "modelname",
    "base": "PersistedModel",
    "idInjection": true,
    "properties": modelProps
}; 

var modelInstance = loopback.createModel(model);
The created model needs to be attached to the app along with the datasource.

var config = {
    dataSource: 'dsname'
};
app.model(modelInstance, config);
To implement the REST handler for createModel() we use the same API as above.

var app = require('./server');
var loopback = require("loopback");
function createModel(req, res) {
 try{
   var modelName = req.body.modelName; //modelName details
   var modelProperties = req.body.modelProperties; //modelProperties can get by doing discovery as well by taking object name
    var datasourceName = req.body.datasourceName;
    var model = {
      "name": modelName,
      "plural": modelName,
      "base": "PersistedModel",
      "idInjection": true,
      "properties": modelProperties
    }; 
   var modelInstance = loopback.createModel(model); 
    var dsConfig = {
      dataSource: datasourceName
    };
    app.model(modelInstance, dsConfig);   
   //construct the result with model id and necessary info
    res.status(200).send(result);
 }catch(ex){
  res.status(500).send(ex);
 }
}
```
Note: Setting 
**idInjection**
 to true will automatically inject the id field to model and use that id field for ID related operations (GET with ID, PUT with ID etc). If we want to use any other field for ID related operations then we need to make 
**idInjection**
 as false and set "id":1 for the field which we want to specify as the ID field.
```js
var modelProps = {
    "name": {
      "type": "String",
      "required": true,
      "length": 100,
      "id":1,
      "helloworld": {
        "columnName": "name",
        "dataType": "varchar",
        "dataLength": 100,
        "nullable": "N"
      }  
    }
}
```
<h3>3. Discovery</h3>

By default, runtime (CRUD) operations are exposed as REST APIs with persisted model. However the discovery APIs of the datasource (discoverModelDefinition and discoverSchema) and status (test connection) are only available in the Node.js API. So the service can have three routes (definitions, schemas and status) as shown in the diagram. Implementation of each route is explained below.

<h4>GET /definitions</h4>

Add the root definition for exposing the REST API for getting the list of models.
```js
router.get('/:datasourceName/definitions',  getObjectList);
```
The route implementation invokes discoverModelDefinitions() Node.js API as shown below:
```js
var app = require('./server');
function getObjectList(req, res) {
   var datasourceName = req.params.datasourceName; //datasourceName from pathparameter
   app.dataSources[datasourceName].discoverModelDefinitions(options, function (err, objects) {
     if(!err){
        res.status(200).send(objects);
     }else{
       res.status(500).send(error);
     }
   }
}
```
<h4>GET /schemas</h4>

Add the root definition for exposing the REST API for getting the model schema.
```js
router.get('/:datasourceName/schemas/:objectname',  getModelSchema);
```
The route implementation invokes discoverSchema() Node.js API as shown below:
```js
var app = require('./server');
function getModelSchema(req, res) {
   var datasourceName = req.params.datasourceName; //datasourceName from pathparameter
   var objectName = req.params.objectName; //objectName from pathparameter
   app.dataSources[datasourceName].discoverSchema(objectName, options, function (err, modelContent) {
     if(!err){
        res.status(200).send(modelContent);
     }else{
       res.status(500).send(error);
     }
   }
}
```
<h4>GET /status</h4>

Add the root definition for exposing the REST API for verifying the datasource details.
```js
router.get('/:datasourceName/status',  testConnection);
```
The route implementation invokes the ping() method as shown below:
```js
var app = require('./server');
function testConnection(req, res) {
   var datasourceName = req.params.datasourceName; //datasourceName from pathparameter
   app.dataSources[datasourceName].ping(function (err, result) {
     if(!err){
        res.status(200).send(result);
     }else{
       res.status(500).send(error);
     }
   }
}
```
<h3>4. Updating the datasources/models</h3>

LoopBack doesn't provide a Node.js API to update the datasource/model. Therefore we use a workaround to update the datasource/model by re-creating a new datasource/models with same name.

Note: If any datasource property changes (password expires) then we create a new datasource with same name. However the model won't reflect this new datasource information until we refresh it. To refresh it, we have to re-attach model with datasource.

<h4>Deleting datasources</h4>

Like update, there are no LoopBack APIs for delete. As a workaround, we delete the datasource content from app in the following way.

delete app.dataSources[datasourceName]
When a discovery call comes, the handler first checks if there is a datasource by that name in the registry. If it doesn't find one, it returns 404.

<h4>Deleting models</h4>

LoopBack does not have an API for deleting models. We use remoteHooks to implement model deletion.

An 
isDeleted flag is maintained for each model at the global level and a remoteHook is attached to the model as shown below.
```js
var DISABLEAPI = function (ctx, model, next) {
    var modelname = ctx.method.sharedClass.name;
    var isDeleted = modelInfo[modelname].isDeleted;
    if (isDeleted) {
        next({
            status: 404,
            message: "API doesn't exist"
        });
    } else {
        next();
    }
};
//Model generation code.. thismodel will have pointer to generated model
modelInfo[modelname].isDeleted = false;
thismodel.beforeRemote('**', DISABLEAPI);
```
Add the root definition for exposing the REST API for deleting the model.
```js
router.del('/model/:modelId',  deleteModel);
```
In route implementation, we just set the isDeleted flag to true in the following way.
```js
var app = require('./server');
function deleteModel(req, res) {
   var modelId = req.params.modelId; //modelId from pathparameter
  if (modelInfo[modelId]) {
    modelInfo[modelId].isDeleted = true;
    res.status(200).send('Success');
  }else{
    res.status(404).send('Not found');
  }
}
```
<h3>5. Multiple tenants with same model name</h3>

It's possible and common to create models for same object name by different tenants (User 1 has Contact model and User 2 has Contact model) and in same tenant for different applications (User 1 has Salesforce Contact model and Cloudant Contact model) . You can specify the HTTP path for a model which we exploit to implement model namespacing. We can generate the HTTP path with tenantId and modelId (like /tenantID/modelId/modelname). The above examples will result in models which have following HTTP URLs:

/User1/model1/Contact
/User2/model1/Contact
/User2/model2/Contact
```js
//generate unique id and assign to modelid
//Object name - ex: Contact
var model = {
    "name": "modelname",
    "plural": "modelname",
    "base": "PersistedModel",
    "idInjection": false,
    "properties": modelProps,
    "http": {"path": "/"+tenantid+"/"+modelid+"/"+ObjectName}
};
```
Note: We have taken a simple design of using path parameters in the URL to identify the tenant and model within the tenant that gets mapped to the physical model via the http path property. However there are a few additional ways to achieve this, illustrated in these proof-of-concepts:


[https://github.com/strongloop/poc-loopback-multitenancy](https://github.com/strongloop/poc-loopback-multitenancy) - Uses a tenant and model resolver middleware to map from tenantId query parameter in URL to the physical model.


[https://github.com/strongloop/poc-loopback-multitenancy](https://github.com/strongloop/poc-loopback-multitenancy) - Resolvers which map from path parameters in the URL to a namespaced URL endpoint.


[https://github.com/strongloop/loopback-multitenant-poc](https://github.com/strongloop/loopback-multitenant-poc) - A sophisticated approach that uses isolated process (app) per tenant and a gateway process in-front of the apps. Using the first segment of the URL path as the tenant identifier, gateway forwards requests to the corresponding tenant app. Tenant apps are complete LoopBack apps with their own configurations and application files, with a shared node_modules directory.

<h3>Advanced topics</h3>

These are not covered in this article and are candidates for a subsequent one.

1. 
**Horizontal scaling/Min 3**
 - To avoid a single point of failure and also to provide capacity, we should run multiple load balanced instances of the same LoopBack app, all having the exact same replica of configuration. However in this article we used REST APIs to configure the models and datasources which means each API call lands on only one instance. The challenge this poses is how to keep the configuration in all the instances in sync.

2. 
**Vertical scaling**
 - Since the memory and CPU at the disposal of an instance of the application is finite, the number of artifacts that can be created in an instance is finite. The multi-tenant service should be able to detect a pool of instances reaching its capacity and switch to a new pool when the capacity is reached.

3. 
**Registry**
 - In our simplified example, we assumed a single application hosting all connector types. In a real production scenario, this will seldom be the case and we might have a microservice per connector type. The challenge this poses is how will a consumer discover the different microservices available and get the network endpoint to work with each type.

4. 
**Optimize startup time**
- When a new instance is added or an existing instance crashes and restarts, it has to reload all the artifacts from the store before it becomes functional. Since a multi-tenant services may have hundreds of such artifacts, how can we optimize the startup latency.