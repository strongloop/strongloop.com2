---
title: LoopBack As A Service Using OpenWhisk
date: 2017-05-24
author:  
- Subramanian Krishnan
- Nagarjuna Surabathina
permalink: /strongblog/loopback-as-a-service-using-openwhisk/
categories:
  - How-To
  - LoopBack
  - Cloud
---

In our [previous blog](https://strongloop.com/strongblog/creating-a-multi-tenant-connector-microservice-using-loopback/) we saw how we can host LoopBack as a multi-tenant micro-service on the cloud. As a quick recap, this would require us to:

1. Expose REST APIs for CRUD on /models and /datasources resources.
2. Use the LoopBack NodeJS APIs to create models, datasources and attach them programmatically.
3. Use the http path property of models to create models in the namespace of the tenant and generate unique URLs for each model (even if the resources they expose have the same name).
4. How to workaround challenges introduced because there are no LoopBack NodeJS APIs for deleting and updating datasources and models.

Following the steps in the blog would let's stand-up a single instance of the LoopBack application which is great for demos. It is not yet ready for deploying at scale on the cloud. The previous blog ends with open questions on:

<!--more-->

1. How to scale the application horizontally - Multiple instances of the application running and able to process simultaneous requests for the same API. This will also be needed to avoid single points of failure (min-3 deployments). Introducing multiple instances brings in challenges of deploying models/datasources to all the instances and keeping them in sync.

2. How to scale the application vertically - When we dynamically create datasources and models in the applications (which has finite resources in terms of RAM and CPU) we will eventually hit a threshold where no more models/datasources can be created. At this point, we need to be able to start deploying to another LoopBack application pool. Note that all horizontal instances of the application run the same models/datasources whereas different (vertical) application pools run different models/datasources. Introducing vertical scaling brings in the challenges of maintaining multiple application pools and logic for choosing which pool would be used for deploying a model/datasource.

3. When an application instance restarts after a crash or is newly added for horizontal scaling, it needs to create all models/datasources that peer instances have to get functional parity with them. For the time this takes, the instance can not join the load-balancing group of instances. 

4. In real production scenarios, there could be LoopBack applications specific to each application type. This will introduce the need for having a registry for different applications supported and getting the network endpoint to work with each of them.

As one can see, to solve the above problems non-trivial and entails huge deployment and management (of instances, pools, application specific micro services and registry) effort.

This blog explores one particular way to address the challenges highlighted above. When it comes to deploying a LoopBack application (or any app for that matter) on cloud there are different ways to do it:

1. IaaS - The application is deployed on VMs or bare metal servers of a cloud provider or in private cloud.
2. PaaS - Deploy the application using NodeJS (runtime specific) buildpack. 
3. CaaS - Deploying the application as Docker containers.

The authors of this blog have first-hand experience running production LoopBack applications using PaaS and CaaS. We have also deployed LoopBack apps on VMs for a non-production scenario.

In this blog we are going to explore an altogether different and brand new way of deploying LoopBack apps using the latest cloud technology in town _FaaS_, "Functions as a Service" or _serverless_ computing.

The serverless cloud computing model is event-driven wherein containers encapsulating the function/code defined by users are run in response to the event, the response returned to the caller and the container is killed and all of this is managed by the cloud provider in a scalable way. Further, the user is billed based on the events/invocations and resources consumed to fulfill the invocation. See this article on [serverless computing](https://en.wikipedia.org/wiki/Serverless_computing) and [serverless architectures](https://martinfowler.com/articles/serverless.html) for a detailed explanation.

The advantages of such an architecture are:

1. Effortless scaling which is managed by the cloud provider transparent to the application provider.
2. Less or no operations cost for the application provider.
3. Cost-effective because you only pay when you use.
4. Simplifies the application architecture as we shall see very shortly.
5. Granular and parallel development and deployment model.
6. Truly stateless because of the ephemeral nature of the containers.

While there are many cloud vendors who are offering FaaS, in this blog we use the IBM BlueMix FaaS offering called OpenWhisk. Apache OpenWhisk is an open-source server less compute platform and IBM BlueMix hosts and manages OpenWhisk as a service. You can get more details in our [About OpenWhisk documentation](https://console.ng.bluemix.net/docs/openwhisk/openwhisk_about.html#about-openwhisk).

From OpenWhisk documentation:

> An OpenWhisk action is a piece of code that performs one specific task. An action can be written in the language of your choice. You provide your action to OpenWhisk either source code or a Docker image. An action performs work when invoked from your code via REST API. Actions can also automatically respond to events from BlueMix and third party services using a trigger.

Let's take a look at how we can architect the multi-tenant LoopBack micro-service using OpenWhisk actions.

<img class="aligncenter wp-image-29404" src="{{site.url}}/blog-assets/2017/04/OpenWhisk.png" alt="LoopBack As A Service Using OpenWhisk" width="550" />

The table below summarizes the different actions and their purpose.

| Resource | Method | OpenWhisk Action | Description |
|-------|-------|-------|-------|
| /datasources | POST | createDatasource | Creates a cloudant doc in the datasources collection and returns the id. |
| /datasources  /:id/definitions | GET | getModelDefinition | Lists the available model definitions available in the datasource using LoopBack connector. |
| /datasources  /:id /schemas/:model | GET | getModelSchema | Returns the schema for the model using LoopBack connector. |
| /models |	POST | createModel | Creates a cloudant doc in the models collection and returns the id. |
| /:tenantId  /:modelId/:model | POST | createModelInstance | Creates an instance of the model on the datasource using the LoopBack connector. |

**Note:** that this is a representative list of resources and methods and not an exhaustive list.

Let's explore a couple of these actions in more detail. Once the examples are understood, the other actions can also be defined on similar lines.

**1. createModel**

Create a new `package.json` with:

```js
{
  "name": "create-model",
    "main": "index.js",
    "dependencies": {
    "cloudant": "^1.7.1",
  "uuid": "^3.0.1"
  }
}
```

And `index.js` is:

```js
var Cloudant = require('cloudant')
var cloudant = Cloudant("<YOUR_CLOUDANT_URL>");
const uuidV4 = require('uuid/v4');

var models = cloudant.db.use("models");

var sanitize_input = function(params) {
  var resp = {};
  for (var attr in params) {
    if (params.hasOwnProperty(attr) &amp;&amp; attr.substring(0,5) !== '__ow_') {
        resp[attr] = params[attr];
    }
  }
  return resp;
}

function create_model(params) {
    var newModelId = uuidV4();
    return new Promise(function(resolve, reject) {
        models.insert(sanitize_input(params), newModelId, function(err, body, header) {
            if (err) {
                reject(err.message);
            } else {
                resolve({
                    statusCode: 201,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: new Buffer(JSON.stringify({
                        modelId: newModelId
                    })).toString('base64')
                });
            }
            console.log(body);
        });
    });
}

exports.main = create_model;
```

**2. Create a zip for the package**

```js
zip -r createModel.zip *
```

**3. Create an OpenWhisk action for the package**

For details, see [here](https://console.ng.bluemix.net/docs/openwhisk/openwhisk_webactions.html#openwhisk_webactions).

```js
wsk action create /sukrishj_dev/demo/createModel --kind nodejs:6 createModel.zip --web true
ok: created action demo/createModel
```

**Note:** Replace `sukrishj_dev` with `yourorg_yourspace` on BlueMix.

**4. Invoke the OpenWhisk webAction**

```js
curl https://openwhisk.ng.bluemix.net/api/v1/web/sukrishj_dev/demo/createModel.http –X POST -H 'Content-Type: application/json' -d @model.json 
{"modelId":"c95fcc09-11a2-4ddb-bbdc-e7053d91ed3e"}
```

We can see that the model doc got created in Cloudant models collection.

<img class="alignnone wp-image-29294 size-large" src="{{site.url}}/blog-assets/2017/04/Screen-Shot-2017-04-13-at-10.59.53-PM-904x1030.png" alt="Screen Shot 2017-04-13 at 10.59.53 PM" width="550" />

**5. createModelInstance**

The implementation of this action:
<ul>
  <li>Reads the model and datasource from Cloudant</li>
  <li>Dynamically creates a LoopBack model and datasource in the application using the NodeJS APIs</li>
  <li>Invokes the model instance create via the NodeJS API</li>
  <li>Returns the response</li>
</ul>
Create a new `package.json` as shown below:

```js
{
  "name": "create-model-instance",
  "version": "1.0.0",
  "main": "index.js",
  "engines": {
    "node": ">=4"
  },
  "dependencies": {
    "cloudant": "^1.7.1",
    "loopback": "^3.0.0"
  },
  "description": "Generic OpenWhisk action to create a model instance"
}
```

And `index.js` is:

```js
var loopback = require('loopback');
var app = loopback();

var Cloudant = require('cloudant')
var cloudant = Cloudant("<YOUR_CLOUDANT_URL>");

var models = cloudant.db.use("models");
var datasources = cloudant.db.use("datasources");

function invoke_model(params) {
    var path = params.__ow_path;
    console.log("path: " + path);
    var tokens = path ? path.split('/') : [];
    var tenantId = tokens[1];
    var modelId = tokens[2];
    var modelName = tokens[3];
    console.log(tokens);
    return new Promise(function(resolve, reject) {
        models.get(modelId, {
            revs_info: false
        }, function(err, body) {
            if (!err) {
                delete body._id;
                delete body._rev;
                var modelConfig = body;
                var datasourceId = modelConfig.datasource_id;
                delete modelConfig.datasource_id;
                console.log(modelConfig);

                datasources.get(datasourceId, {
                    revs_info: false
                }, function(err, body) {
                    if (!err) {

                        delete body._id;
                        delete body._rev;
                        var dataSourceConfig = body;
                        console.log(dataSourceConfig);

                        var Model = loopback.createModel(modelConfig);
                        var ds = loopback.createDataSource('ds', dataSourceConfig);

                        app.model(Model, {
                            dataSource: ds
                        });

                        Model.create(params, function(err, u1) {
                            console.log('Created: ', u1.toObject());
                            Model.findById(u1.id, function(err, u2) {
                                console.log('Found: ', u2.toObject());
                                resolve({
                                    statusCode: 201,
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: new Buffer(JSON.stringify(u2)).toString('base64')
                                });
                            });
                        });
                    }
                });
            }
        });
    });
};

exports.main = create_model_instance;
```

**Note:** The implementation reads the model and datasource information stored by the createModel action in Cloudant. Sharing of datastores across micro-services is considered an anti-pattern and is done here only to simplify the implementation for demonstration purposes. In the real world, the createModelInstance would have its own persistence which could be optimized for low read latency (CQRS).

1. Install package dependencies
    ```js
    npm install
    ```

1. Install the LoopBack Cloudant connector
    ```js
    npm install loopback-connector-cloudant --save
    ```
  **Note:** We use Cloudant connector to create a record in a collection specified in the datasource.

2. Create a zip for the package
  ```js
  zip -r createModelInstance.zip
  ```

3. Create an OpenWhisk action for the package (Refer to [Create a simple API](https://loopback.io/doc/en/lb3/Create-a-simple-API.html) for details)
  ```js
  wsk action create /sukrishj_dev/demo/createModelInstance --kind nodejs:6 createModelInstance.zip  --web true
  ok: created action demo/createModelInstance
  ```

4. Invoke the OpenWhisk webAction
  ```js
  curl https://openwhisk.ng.bluemix.net/api/v1/web/sukrishj@in.ibm.com_dev/demo/createModelInstance.http/AMo7xBkvdF/c95fcc09-11a2-4ddb-bbdc-e7053d91ed3e/Accounts  X POST -H 'Content-Type: application/json' -d @model.json
  {"name":"Subu Krishnan","id":"007","reference":"James Bond"}
  ```

We can see that the model doc got created in Cloudant accounts collection.

<img class="alignnone wp-image-29295 size-full" src="{{site.url}}/blog-assets/2017/04/Screen-Shot-2017-04-14-at-11.38.24-PM.png" alt="Screen Shot 2017-04-14 at 11.38.24 PM" width="600" height="417" />
A key thing to observe in the implementation of createModelInstance OpenWhisk action is that it is completely generic and can work for any LoopBack connector. In the example above we installed Cloudant connector (step 1) and it worked for Cloudant. We can use the same code base and install another connector (ex. Redis) and create an OpenWhisk action which can create records in Redis. 

**Note:** An OpenWhisk action was created for Redis using the above mentioned approached and invoked as follows: 

```js
curl https://openwhisk.ng.bluemix.net/api/v1/web/sukrishj_dev/demo/createRedisModelInstance.http/AMo7xBkvdF/061d5b185ae2f4e8efdb5dbf315752f4/Accounts -X POST -H 'Content-Type: application/json' -d @model.json
{“name”:”Subu Krishnan”,”id”:”007″,”reference”:”James Bond”}
```

We can use redis-cli to see that the model got created in Redis.

```js
bluemix-sandbox-dal-9-portal.8.dblayer.com:25643> KEYS Account*

1) "Account:007"

bluemix-sandbox-dal-9-portal.8.dblayer.com:25643> type Account:007
hash

bluemix-sandbox-dal-9-portal.8.dblayer.com:25643> HGETALL Account:007
1) "name"
2) "Subu Krishnan"
3) "id"
4) "007"
5) "reference"
6) "James Bond"
```

This confirms that different OpenWhisk actions can be created for different applications using the same common LoopBack application code and the specific connector and exposed at different base URLs as shown in the table below.

<table >
  <tbody>
    <tr>
      <td>
        <b>OpenWhisk Web Action</b>
      </td>
      <td>
        <b>Base URL</b>
      </td>
    </tr>
    <tr>
      <td>
        createCloudantModelInstance
      </td>
      <td style="font-size: 80%;">
https://openwhisk.ng.bluemix.net/api/v1/web/sukrishj@in.ibm.com_dev/demo/createCloudantModelInstance.http
      </td>
    </tr>
    <tr>
      <td>
        createRedisModelInstance
      </td>
      <td style="font-size: 80%;">
        https://openwhisk.ng.bluemix.net/api/v1/web/sukrishj@in.ibm.com_dev/demo/createRedisModelInstance.http
      </td>
    </tr>
    <tr>
      <td>
        ...
      </td>
      <td>
        ...
      </td>
    </tr>
  </tbody>
</table>


With a little tweak to the createModel action, we can return the base URL corresponding to the application for which the model is created (Cloudant/Redis/any other). This gives a neat and simple way of scaling the service to support multiple applications.

We now have a recipe for standing up a LoopBack service using OpenWhisk which scales in all dimensions:

<ul>
  <li><b>Horizontal</b> - Since we are not explicitly standing up a server, we need not worry about multiple instances.</li>
  <li><b>Vertical</b> - Since we are not explicitly standing up a server, we need not worry about how many models can be deployed in it.</li>
  <li><b>Multiple Apps</b> - We can scale by creating an OpenWhisk action per application using the same LoopBack app code but the specific connector bundled in.</li>
</ul>

The architectural simplicity is also clear because there is no need to manage instances of servers, keep them in sync, deploying and managing multiple server pools, need for placement logic for selecting the pool, and maintaining servers specific to applications. Since the execution model is request based, there is no need to worry about the deletes/updates to models deployed in servers and nor is there a need to worry about restoring models in a server after restart or to a newly added instance.

The other benefit of this approach is the possibility of parallel development of the actions. Each action can be developed, tested and deployed by a different person in the team due to inherent decoupling in the deployment and execution paradigm.

Finally, as one can see, there is no/little operations cost because there are no servers to be deployed,  managed and scaled. The platform takes care of it all. And since the billing is based on usage, there is no capital cost incurred either. 

The one thing which could be a potential concern is the latency of serving requests. We have not yet measured the response times and compared approaches (good topic for a future post) but what we observed with the naked eye was pretty good. 

All in all FaaS/serverless/OpenWhisk seems to be very promising and definitely worth an evaluation not just for LoopBack as a service but cloud-based services in general.

**Note:** The astute reader will notice the minimal input validation and no security implemented in the code for the actions shared in the post. These are omitted to simplify the blog but are needed for a production implementation.
