---
id: 29305
title: LoopBack As An Event Publisher
date: 2017-06-05T05:55:00+00:00
author:  
- Subramanian Krishnan
- Nagarjuna Surabathina
guid: https://strongloop.com/?p=29305
permalink: /strongblog/loopback-as-an-event-publisher/
categories:
  - How-To
  - LoopBack
  - Cloud
---

Most people who have used LoopBack know that it is a highly-extensible, open-source Node.js framework that enables you to quickly create dynamic end-to-end REST APIs with little or no coding.

These REST APIs can be used by client applications (Web/Mobile/IoT/Other) to perform CRUD + Custom operations on any 3rd party application for which there is a LoopBack connector. Irrespective of the nature of the APIs/Client libraries exposed by the 3rd application, the client has standard, simple and runtime agnostic REST APIs to perform actions on the application. That is the value proposition that LoopBack offers.

Now let us consider the other side of the story where an event occur in a 3rd party application (ex. a record got created/updated/deleted). Different applications may expose these events through different mechanisms (Webhooks, Streaming, Polling API, Websockets, PubSub, PubSubHubbub, Other). If client applications want to consume these events in a standard, simple and runtime agnostic way, is that possible with LoopBack? Further can we use the same LoopBack programming constructs of datasources, models and connectors for the events side of the story?

It turns out that with a little work, it can be done and this post shows how. 

Fundamentally, the architected solution should have the following components:
Message Broker
	
A hub to which the events can be published by the LoopBack application and from where consumers can receive messages through subscription.
	
Example of common brokers are MQTT (mosquitto), Apache Kafka, AMQP (Rabbit), Redis pub/sub and many more.
Event Connector
	
A plugin component for the LoopBack application which implements interfaces specific to events. This is analogous to the LoopBack CRUD connectors which implements the PersistedModel APIs. 
We have a connector implemented for each 3rd party application that we want to consume events from.
	
Example connectors could be connector for Cloudant, DB2, DashDB, MySQL and many more. 
Event Publisher 
	
A LoopBack app in which datasources and models can be created using the standard LoopBack APIs. The datasources are bound to Event Connectors. 
	
As an example, the datasource will have the Cloudant credentials and the model will identify the Cloudant collection for which I want the (CREATED/UPDATED/DELETED) events.
strong-pubsub
	
This is the counterpart of strong-remoting for the events side of the story. We want the publisher (and possibly the consumer) to be de-coupled from the specific choice of broker. Strong-pubsub [1] allows us to easily switch the broker without affecting the producer/consumer code.
	


The diagram below shows end to end view of the solution.
Let us now look at each piece of the solution in greater detail.

1. Event Connector
The way CRUD connectors implement the PersistedModel interface, we want the Event Connectors to implement an interface specific to events. We propose an API with start() and stop() methods with the following semantics:

    start() method uses the application specific APIs to retrieve events and uses the Event Emitter passed in the input argument to send this event to the LoopBack app.

    stop() methods stops retrieving events from the application.


Note that the initialize() method of the connector is the same as in CRUD connectors and initializes the connection credentials to communicate with the application.

Another thing to mention here is that the Event Interface is defined as a CustomDAO in the post but it is possible to have it standardized (post review, changes and approval) as a part of the LoopBack framework the way SQLConnector/PersistedModel is. If that happens, then a CustomDAO would not be needed.

```javascript
package.json
{
  "name": "loopback-connector-cloudantevents",
  "version": "0.0.1",
  "description": "An Event Connector for Cloudant",
  "main": "index.js",
  "dependencies": {
    "loopback-connector": "~1.2.0",
    "cloudant": "^1.4.1"
  }
}
```

The index.js file does module.exports = require('./lib/cloudantevents.js');

cloudantevents.js
var cloudant = require('cloudant');

/*
 Constructor
 */
function cloudantInboundConnector(dataSourceProps){
  this.cloudantInstance     = cloudant(dataSourceProps.url);
  this._models =  {};
}

exports.initialize = function (dataSource, callback) {

  var dataSourceProps = dataSource.settings || {}; // The settings is passed in from the dataSource
  dataSource.connector = new cloudantInboundConnector(dataSourceProps); // Construct the connector instance
  dataSource.connector.dataSource = dataSource; // Hold a reference to dataSource

  process.nextTick(function () {
    callback && callback();
  });
}

function CustomDAO(){};

cloudantInboundConnector.prototype.DataAccessObject = CustomDAO;

CustomDAO.start = function (listenerEmitter,callback) {
  console.log(this.modelName);
  var modelName = this.modelName;
  var cloudantIns = this.dataSource.connector.cloudantInstance;
  var db = cloudantIns.db.use(modelName);
  this.feed = db.follow({include_docs: true, since: "now"});
  this.feed.on('change', function (change) {
    console.log(change.doc);
    listenerEmitter.emit('eventMessage',modelName,change.doc);
  });
  this.feed.follow();
};

CustomDAO.stop = function (callback) {
  console.log(this.modelName);
  this.feed.stop();
};

2. Event Publisher
This is a LoopBack application created using lb utility with the server.js code as shown below. The application contains:

    datasource

    models

    handler for events emitted by the connector

    strong-pubsub client and adapter for MQTT


The datasource points to my Cloudant instance and a model is created for the accounts collection in it. 
On receiving events from connector for document creation/updation/deletion in accounts collection, the handler publishes message to a topic (/v1/subutest) using the strong-pubsub client.

server.js
var loopback = require("loopback");
var app = module.exports = loopback();

var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Client = require('strong-pubsub');
var Adapter = require('strong-pubsub-mqtt');

var mqttchannel = new Client({
    host: 'localhost',
    port: 1883
}, Adapter);

app.start = function() {
    // start the web server
    return app.listen(function() {
        app.emit('started');
        console.log('Web server listening at: %s', app.get('url'));

        var listenEmitter = {};
        var listenEmitterFn = function ListenEmitter() {
            EventEmitter.call(this);
        };
        util.inherits(listenEmitterFn, EventEmitter);

        listenEmitter = new listenEmitterFn();

        listenEmitter.on('error', function(modelname, error) {
            console.log(modelname);
            console.log(error);
        });

        listenEmitter.on('eventMessage', function(modelname, msg) {
            var body = {
                model: modelname,
                message: msg
            };
            console.log(body);
            mqttchannel.publish('/v1/subutest', JSON.stringify(body));
        });

        var dsConfig = {
            "url": <YOUR_CLOUDANT_URL>,
            "connector": "loopback-connector-cloudantevents"
        };
        app.dataSource('dsCloudAntIn', dsConfig);

        var model = {
            "name": "accounts",
            "base": "Model"
        };

        var config = {
            dataSource: 'dsCloudAntIn'
        };
        var fileListModel = loopback.createModel(model);
        app.model(fileListModel, config);

        fileListModel.start(listenEmitter, function(err, result) {
            console.log(err);
        });

    });
};

if (require.main === module) {
    app.start();
}

3. Message Broker
For demonstration purpose we have run a MQTT broker (mosquitto [2]) on the localhost at port 1883.

4. Client App
The client application is a simple Node.js code which runs the code below (borrowed from strong-pubsub documentation). It connects to the MQTT broker using strong-pubsub client and adapter and subscribes for messages in the /v1/subutest topic. When it receives a message, it logs it to console.

var Client = require('strong-pubsub');
var Adapter = require('strong-pubsub-mqtt');

var siskel = new Client({host: 'localhost', port: 1883}, Adapter);

console.log("created consumer.....");

siskel.subscribe('/v1/subutest');
siskel.on('message', function(topic, msg) {
 console.log(topic, msg.toString());
});

Demo
1. Start the broker
$ mosquitto -p 1883
1493572785: mosquitto version 1.4.11 (build date 2017-03-14 19:27:59+0000) starting
1493572785: Using default config.
1493572785: Opening ipv4 listen socket on port 1883.
1493572785: Opening ipv6 listen socket on port 1883.

2. Start the client app
$ node client.js
created consumer.....

Note: To make things more interesting we start another non Node.js consumer listening to the same topic.
$ mosquitto_sub -h localhost  -p 1883 -t /v1/subutest

3. Checking the broker logs shows that 2 clients have connected to it:
1493572839: New connection from 127.0.0.1 on port 1883.
1493572839: New client connected from 127.0.0.1 as mqttjs_8dfcc98e (c1, k10).
1493572943: New connection from ::1 on port 1883.
1493572943: New client connected from ::1 as mosqsub/1718-Subramania (c1, k60).

 4. Run the Event Publisher LoopBack app
Web server listening at: http://:::51192/
accounts /*The event model active*/

5. Login to Cloudant and create a new document in accounts collection.

6. The Connector and LoopBack app logs show that a new event is detected:
{ _id: '26dd638e8462387f03f2f6f25e4e6926',
  _rev: '1-08fb96a08261081dcd24b7a1629c8cde',
  name: 'James Bond',
  type: 'Demo',
  region: 'Bangalore' }
{ model: 'accounts',
  message: 
   { _id: '26dd638e8462387f03f2f6f25e4e6926',
     _rev: '1-08fb96a08261081dcd24b7a1629c8cde',
     name: 'James Bond',
     type: 'Demo',
     region: 'Bangalore' } }

7. Broker logs show that a new client (publisher) connected:
1493573959: New connection from 127.0.0.1 on port 1883.
1493573959: New client connected from 127.0.0.1 as mqttjs_e1b485ee (c1, k10).

8. The Node.js client app logs show that a message is received with the new account details:
/v1/subutest {"model":"accounts","message":{"_id":"26dd638e8462387f03f2f6f25e4e6926","_rev":"1-08fb96a08261081dcd24b7a1629c8cde","name":"James Bond","type":"Demo","region":"Bangalore"}}

9. The mosquitto subscriber also receives the same message:
{"model":"accounts","message":{"_id":"26dd638e8462387f03f2f6f25e4e6926","_rev":"1-08fb96a08261081dcd24b7a1629c8cde","name":"James Bond","type":"Demo","region":"Bangalore"}}

This proves that LoopBack can be extended for the events side of the story in a seamless way which is:

    Generic - Using strong-pubsub abstracts away broker specific interfaces.

    Modular - A plug-gable event connector for every application we want events from.

    Consistent - Same conceptual and programming model (datasources and models) as for the CRUD side.


References:
[1] https://github.com/strongloop/strong-pubsub
[2] https://mosquitto.org/

