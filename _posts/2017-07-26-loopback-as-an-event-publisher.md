---
id: 29431
layout: post
title: LoopBack As An Event Publisher
date: 2017-07-26
author:
   - Nagarjuna Surabathina
   - Subramanian Krishnan
guid: https://strongloop.com/?p=29431
permalink: /strongblog/loopback-as-event-publisher/
categories:
  - Community
---
<strong>Note:</strong> This article was co-written by Subramanian Krishnan and Nagarjuna Surabathina.	

Most people who have used LoopBack know that it is a highly-extensible, open-source Node.js framework that enables you to quickly create dynamic end-to-end REST APIs with little or no coding.

These REST APIs can be used by client applications (Web/Mobile/IoT/Other) to perform CRUD + Custom operations on any 3rd party application for which there is a LoopBack connector. Irrespective of the nature of the APIs/Client libraries exposed by the 3rd application, the client has standard, simple and runtime agnostic REST APIs to perform actions on the application. That is the value proposition that LoopBack offers.


Now let us consider the other side of the story where an event occur in a 3rd party application (ex. a record got created/updated/deleted). Different applications may expose these events through different mechanisms (Webhooks, Streaming, Polling API, Websockets, PubSub, PubSubHubbub, Other). If client applications want to consume these events in a standard, simple and runtime agnostic way, is that possible with LoopBack? Further can we use the same LoopBack programming constructs of datasources, models and connectors for the events side of the story?

It turns out that with a little work, it can be done and this post shows how.†

Fundamentally, the architected solution should have the following components:
<table class="resizable">
   <tbody>
      <tr>
         <td>
            <div>Message Broker</div>
         </td>
         <td>
            <div>A hub to which the events can be published by the LoopBack application and from where consumers can receive messages through subscription.</div>
         </td>
         <td>
            <div>Example of common brokers are MQTT (mosquitto), Apache Kafka, AMQP (Rabbit), Redis pub/sub and many more.</div>
         </td>
      </tr>
      <tr>
         <td>
            <div>Event Connector</div>
         </td>
         <td>
            <div>A plugin component for the LoopBack application which implements interfaces specific to events. This is analogous to the LoopBack CRUD connectors which implements the PersistedModel APIs.</div>
            <div>We have a connector implemented for each 3rd party application that we want to consume events from.</div>
         </td>
         <td>
            <div>Example connectors could be connector for Cloudant, DB2, DashDB, MySQL and many more.</div>
         </td>
      </tr>
      <tr>
         <td>
            <div>Event Publisher</div>
         </td>
         <td>
            <div>A LoopBack app in which datasources and models can be created using the standard LoopBack APIs. The datasources are bound to Event Connectors.</div>
         </td>
         <td>
            <div>As an example, the datasource will have the Cloudant credentials and the model will identify the Cloudant collection for which I want the (CREATED/UPDATED/DELETED) events.</div>
         </td>
      </tr>
      <tr>
         <td>
            <div>strong-pubsub</div>
         </td>
         <td>
            <div>This is the counterpart of strong-remoting for the events side of the story. We want the publisher (and possibly the consumer) to be de-coupled from the specific choice of broker. Strong-pubsub [1] allows us to easily switch the broker without affecting the producer/consumer code.</div>
         </td>
         <td></td>
      </tr>
   </tbody>
</table>

The diagram below shows end to end view of the solution.	
		
<img id="image-overlay-image" class="" src="https://notes.services.box.com/box-image?fileId=166294725753&amp;sharedLink=https%3A%2F%2Fibm.box.com%2Fs%2Fp2lvsibv3lq7fmzrquleyso9coj0vyh0&amp;fileName=Screen%20Shot%202017-05-02%20at%2012.12.43%20PM.png&amp;viewContext=overlay" />

Let us now look at each piece of the solution in greater detail.
<h3>1 . Event Connector</h3>
The way CRUD connectors implement the PersistedModel interface, we want the Event Connectors to implement an interface specific to events. We propose an API with <b>start()</b> and <b>stop() </b> methods with the following semantics:				
<ul class="list-bullet1">			
 	<li>start() method uses the application specific APIs to retrieve events and uses the Event Emitter passed in the input argument to send this event to the LoopBack app.</li>		
</ul>				
<ul class="list-bullet1">			
 	<li>stop() methods stops retrieving events from the application.</li>		
</ul>			

Note that the <b>initialize()</b> method of the connector is the same as in CRUD connectors and initializes the connection credentials to communicate with the application.

Another thing to mention here is that the Event Interface is defined as a CustomDAO in the post but it is possible to have it standardized (post review, changes and approval) as a part of the LoopBack framework the way SQLConnector/PersistedModel is. If that happens, then a CustomDAO would not be needed.

<b>package.json</b>			

<table class="resizable">
     <tbody>
         <tr>
            <td>
               <blockquote>
                  <div style="text-align: left;">{</div>
                  <div style="text-align: left;">  "name": "<b>loopback-connector-</b><b>cloudantevents</b><b>"</b>,</div>
                  <div style="text-align: left;">  "version": "0.0.1",</div>
                  <div style="text-align: left;">  "description": "An Event Connector for Cloudant",</div>
                  <div style="text-align: left;">  "main": "index.js",</div>
                  <div style="text-align: left;">  "dependencies": {</div>
                  <div style="text-align: left;">  "loopback-connector": "~1.2.0",</div>
                  <div style="text-align: left;">  "cloudant": "^1.4.1"</div>
                  <div style="text-align: left;">  }</div>
                  <div style="text-align: left;">  }</div>
               </blockquote>
            </td>
        </tr>
    </tbody>
</table>		
The <b>index.js </b>file does <b>module.exports = require('./lib/cloudantevents.js');</b><b>cloudantevents.js</b>
<table class="resizable">
	<tbody>
		<tr>
			<td>
			<div style="text-align: left;">var cloudant = require('cloudant');</div>
			<div style="text-align: left;"></div>
			<div style="text-align: left;">/*</div>
			<div style="text-align: left;"> Constructor</div>
			<div style="text-align: left;"> */</div>
			<div style="text-align: left;">function cloudantInboundConnector(dataSourceProps){</div>
			<div style="text-align: left;">  this.cloudantInstance     = cloudant(dataSourceProps.url);</div>
			<div style="text-align: left;">  this._models =  {};</div>
			<div style="text-align: left;">}</div>
			<div style="text-align: left;"></div>
			<div style="text-align: left;">exports.initialize = function (dataSource, callback) {</div>
			<div style="text-align: left;"></div>
			<div style="text-align: left;">  var dataSourceProps = dataSource.settings || {}; // The settings is passed in from the dataSource</div>
			<div style="text-align: left;">  dataSource.connector = new cloudantInboundConnector(dataSourceProps); // Construct the connector instance</div>
			<div style="text-align: left;">  dataSource.connector.dataSource = dataSource; // Hold a reference to dataSource</div>
			<div style="text-align: left;"></div>
			<div style="text-align: left;">  process.nextTick(function () {</div>
			<div style="text-align: left;">    callback &amp;&amp; callback();</div>
			<div style="text-align: left;">  });</div>
			<div style="text-align: left;">}</div>
			<div style="text-align: left;"></div>
			<div style="text-align: left;">function CustomDAO(){};</div>
			<div style="text-align: left;"></div>
			<div style="text-align: left;">cloudantInboundConnector.prototype.DataAccessObject = CustomDAO;</div>
			<div style="text-align: left;"></div>
			<div style="text-align: left;"><b>CustomDAO.start</b> = function (listenerEmitter,callback) </div>
			<div style="text-align: left;">  console.log(this.modelName);</div>
			<div style="text-align: left;">  var modelName = this.modelName;</div>
			<div style="text-align: left;">  var cloudantIns = this.dataSource.connector.cloudantInstance;</div>
			<div style="text-align: left;">  var db = cloudantIns.db.use(modelName);</div>
			<div style="text-align: left;">  this.feed = db.follow({include_docs: true, since: "now"});</div>
			<div style="text-align: left;">  this.feed.on('change', function (change) {</div>
			<div style="text-align: left;">  console.log(change.doc);</div>
			<div style="text-align: left;">   listenerEmitter.emit('eventMessage',modelName,change.doc);</div>
			<div style="text-align: left;">  });</div>
			<div style="text-align: left;">  this.feed.follow();</div>
			<div style="text-align: left;">};</div>
			<div style="text-align: left;"></div>
			<div style="text-align: left;"><b>CustomDAO.stop</b> = function (callback) {</div>
			<div style="text-align: left;">  console.log(this.modelName);</div>
			<div style="text-align: left;">  this.feed.stop();</div>
			<div>};</div>
			</td>
		</tr>
	</tbody>
</table>
<h3>2 . Event Publisher</h3>

This is a LoopBack application created using lb utility with the server.js code as shown below. The application contains:

<ul class="list-bullet1">
 	<li>datasource</li>
</ul>
<ul class="list-bullet1">
 	<li><span>models</span></li>
</ul>
<ul class="list-bullet1">
 	<li><span>handler for events emitted by the connector</span></li>
</ul>
<ul class="list-bullet1">
 	<li><span>strong-pubsub client and adapter for MQTT</span></li>
</ul>

The datasource points to my Cloudant instance and a model is created for the <b>accounts</b> collection in it. On receiving events from connector for document creation/updation/deletion in accounts collection, the handler publishes message to a topic (<b>/v1/subutest</b>) using the strong-pubsub client.

<b>server.js</b>
<table class="resizable">
   <tbody>
   <tr>
      <td>
         <div id="magicdomid107"  style="text-align: left;">var loopback = require("loopback");</div>
         <div id="magicdomid108"  style="text-align: left;">var app = module.exports = loopback();</div>
         <div id="magicdomid109"  style="text-align: left;"></div>
         <div id="magicdomid110"  style="text-align: left;">var EventEmitter = require('events').EventEmitter;</div>
         <div id="magicdomid111"  style="text-align: left;">var util = require('util');</div>
         <div id="magicdomid112"  style="text-align: left;"></div>
         <div id="magicdomid113"  style="text-align: left;">var Client = require('strong-pubsub');</div>
         <div id="magicdomid114"  style="text-align: left;">var Adapter = require('strong-pubsub-mqtt');</div>
         <div id="magicdomid115"  style="text-align: left;"></div>
         <div id="magicdomid116"  style="text-align: left;">var mqttchannel = new Client({</div>
         <div id="magicdomid117"  style="text-align: left;">    host: 'localhost',</div>
         <div id="magicdomid118"  style="text-align: left;">    port: 1883</div>
         <div id="magicdomid119"  style="text-align: left;">}, Adapter);</div>
         <div id="magicdomid120"  style="text-align: left;"></div>
         <div id="magicdomid121" style="text-align: left;">app.start = function() {</div>
         <div id="magicdomid122" style="text-align: left;">    // start the web server</div>
         <div id="magicdomid123" style="text-align: left;">    return app.listen(function() {</div>
         <div id="magicdomid124" style="text-align: left;">        app.emit('started');</div>
         <div id="magicdomid125" style="text-align: left;">        console.log('Web server listening at: %s', app.get('url'));</div>
         <div id="magicdomid126" style="text-align: left;"></div>
         <div id="magicdomid127" style="text-align: left;">        var listenEmitter = {};</div>
         <div id="magicdomid128" style="text-align: left;">        var listenEmitterFn = function ListenEmitter() {</div>
         <div id="magicdomid129" style="text-align: left;">            EventEmitter.call(this);</div>
         <div id="magicdomid130" style="text-align: left;">        };</div>
         <div id="magicdomid131" style="text-align: left;">        util.inherits(listenEmitterFn, EventEmitter);</div>
         <div id="magicdomid132" style="text-align: left;"></div>
         <div id="magicdomid133" style="text-align: left;">        listenEmitter = new listenEmitterFn();</div>
         <div id="magicdomid134" style="text-align: left;"></div>
         <div id="magicdomid135" style="text-align: left;">        listenEmitter.on('error', function(modelname, error) {</div>
         <div id="magicdomid136" style="text-align: left;">            console.log(modelname);</div>
         <div id="magicdomid137" style="text-align: left;">            console.log(error);</div>
         <div id="magicdomid138" style="text-align: left;">        });</div>
         <div id="magicdomid139" style="text-align: left;"></div>
         <div id="magicdomid140"  style="text-align: left;">        listenEmitter.on('eventMessage', function(modelname, msg) {</div>
         <div id="magicdomid141"  style="text-align: left;">            var body = {</div>
         <div id="magicdomid142"  style="text-align: left;">                model: modelname,</div>
         <div id="magicdomid143"  style="text-align: left;">                message: msg</div>
         <div id="magicdomid144"  style="text-align: left;">            };</div>
         <div id="magicdomid145"  style="text-align: left;">            console.log(body);</div>
         <div id="magicdomid146"  style="text-align: left;">            mqttchannel.publish('/v1/subutest', JSON.stringify(body));</div>
         <div id="magicdomid147"  style="text-align: left;">        });</div>
         <div id="magicdomid148"  style="text-align: left;"></div>
         <div id="magicdomid149"  style="text-align: left;">        var dsConfig = {</div>
         <div id="magicdomid150"  style="text-align: left;">            "url": &lt;YOUR_CLOUDANT_URL&gt;,</div>
         <div id="magicdomid151"  style="text-align: left;">            "connector": "loopback-connector-cloudantevents"</div>
         <div id="magicdomid152"  style="text-align: left;">        };</div>
         <div id="magicdomid153"  style="text-align: left;">        app.dataSource('dsCloudAntIn', dsConfig);</div>
         <div id="magicdomid154"  style="text-align: left;"></div>
         <div id="magicdomid155"  style="text-align: left;">        var model = {</div>
         <div id="magicdomid156"  style="text-align: left;">            "name": "<span class=" b"><b>accounts</b></span>",</div>
         <div id="magicdomid157"  style="text-align: left;">            "base": "Model"</div>
         <div id="magicdomid158"  style="text-align: left;">        };</div>
         <div id="magicdomid159"  style="text-align: left;"></div>
         <div id="magicdomid160"  style="text-align: left;">        var config = {</div>
         <div id="magicdomid161"  style="text-align: left;">            dataSource: 'dsCloudAntIn'</div>
         <div id="magicdomid162"  style="text-align: left;">        };</div>
         <div id="magicdomid163"  style="text-align: left;">        var fileListModel = loopback.createModel(model);</div>
         <div id="magicdomid164"  style="text-align: left;">        app.model(fileListModel, config);</div>
         <div id="magicdomid165"  style="text-align: left;"></div>
         <div id="magicdomid166"  style="text-align: left;">        fileListModel.start(listenEmitter, function(err, result) {</div>
         <div id="magicdomid167"  style="text-align: left;">            console.log(err);</div>
         <div id="magicdomid168"  style="text-align: left;">        });</div>
         <div id="magicdomid169"  style="text-align: left;"></div>
         <div id="magicdomid170"  style="text-align: left;">    });</div>
         <div id="magicdomid171"  style="text-align: left;">};</div>
         <div id="magicdomid172"  style="text-align: left;"></div>
         <div id="magicdomid173"  style="text-align: left;"><span>i</span>f (require.main === module) {</div>
         <div id="magicdomid174"  style="text-align: left;">    app.start()</div>
         <div id="magicdomid175" >}</div>
         </td>
      </tr>
   </tbody>
</table>
<h3>3 . Message Broker</h3>
<span>For demonstration purpose we have run a MQTT broker (mosquitto [2]) on the localhost at port 1883.
<span class="  font-size-large">4. Client App</span></div>
The client application is a simple Node.js code which runs the code below (borrowed from strong-pubsub documentation). It connects to the MQTT broker using strong-pubsub client and adapter and subscribes for messages in the <b>/v1/subutest</b> topic. When it receives a message, it logs it to console.
         
<table class="resizable">
   <tbody>
      <tr>
         <td>
         <div id="magicdomid183" class="ace-line" style="text-align: left;">var Client = require('strong-pubsub');</div>
         <div id="magicdomid184" class="ace-line" style="text-align: left;">var Adapter = require('strong-pubsub-mqtt');</div>
         <div id="magicdomid185" class="ace-line" style="text-align: left;"></div>
         <div id="magicdomid186" class="ace-line" style="text-align: left;">var siskel = new Client({host: 'localhost', port: 1883}, Adapter);</div>
         <div id="magicdomid187" class="ace-line" style="text-align: left;"></div>
         <div id="magicdomid188" class="ace-line" style="text-align: left;">console.log("created consumer.....");</div>
         <div id="magicdomid189" class="ace-line" style="text-align: left;"></div>
         <div id="magicdomid190" class="ace-line" style="text-align: left;">siskel.subscribe('/v1/subutest');</div>
         <div id="magicdomid191" class="ace-line" style="text-align: left;">siskel.on('message', function(topic, msg) {</div>
         <div id="magicdomid192" class="ace-line" style="text-align: left;"> console.log(topic, msg.toString());</div>
         <div id="magicdomid193" class="ace-line" style="text-align: left;">});</div>
         </td>
      </tr>
   </tbody>
</table>
<div id="magicdomid194"></div>
<h2>Demo</h2><br/>
<table class="resizable">
   <tbody>
      <tr>
         <td>
            <div id="magicdomid196"><span>1. Start the broker</span></div>
            <div id="magicdomid197"><span>$ </span>mosquitto -p 1883</span></div>
            <div id="magicdomid198">1493572785: mosquitto version 1.4.11 (build date 2017-03-14 19:27:59+0000) starting</span></div>
            <div id="magicdomid199">1493572785: Using default config.</span></div>
            <div id="magicdomid200">1493572785: Opening ipv4 listen socket on port 1883.</span></div>
            <div id="magicdomid201">1493572785: Opening ipv6 listen socket on port 1883.</span></div>
            <div id="magicdomid202"></div>
            <div id="magicdomid203"><span>2. Start the client app</span></div>
            <div id="magicdomid204"><span>$ node client.js</span></div>
            <div id="magicdomid205">created consumer.....</span></div>
            <div id="magicdomid206"></div>
            <div id="magicdomid207"><span>Note: To make things more interesting we start another non Node.js consumer listening to the same topic.</span></div>
            <div id="magicdomid208"><span>$ mosquitto_sub -h localhost  -p 1883 -t /v1/subutest</span></div>
            <div id="magicdomid209"></div>
            <div id="magicdomid210"><span>3. Checking the broker logs shows that 2 clients have connected to it:</span></div>
            <div id="magicdomid211"><span>1493572839: New connection from 127.0.0.1 on port 1883.</span></div>
            <div id="magicdomid212"><span>1493572839: New client connected from 127.0.0.1 as mqttjs_8dfcc98e (c1, k10).</span></div>
            <div id="magicdomid213"><span>1493572943: New connection from ::1 on port 1883.</span></div>
            <div id="magicdomid214"><span>1493572943: New client connected from ::1 as mosqsub/1718-Subramania (c1, k60).</span></div>
         </td>
      </tr>
   </tbody>
</table>
<h3> 4 . Run the Event Publisher LoopBack app</h3>
```js
Web server listening at: http://:::51192/
accounts /*The event model active*/
```

<h3> 5 . Login to Cloudant and create a new document in accounts collection.</h3> 

<div><span id="embeddedContainer_1a6dd49a81ce452aa0b4438719006f91" class=" image-1a6dd49a81ce452aa0b4438719006f91-JTdCJTIyYm94U2hhcmVkTGluayUyMiUzQSUyMmh0dHBzJTNBJTJGJTJGaWJtLmJveC5jb20lMkZzJTJGNHdycDVqN2UzNzNwbmg4aXlpZXpmOG9rcTlmbW5uYjElMjIlMkMlMjJib3hGaWxlSWQlMjIlM0ElMjIxNjYyODE2MDE1NjQlMjIlMkMlMjJmaWxlTmFtZSUyMiUzQSUyMlNjcmVlbiUyMFNob3QlMjAyMDE3LTA0LTMwJTIwYXQlMjAxMS4wOC4yOCUyMFBNLnBuZyUyMiU3RA=="><img id="image-overlay-image" class="" src="https://notes.services.box.com/box-image?fileId=166281601564&amp;sharedLink=https%3A%2F%2Fibm.box.com%2Fs%2F4wrp5j7e373pnh8iyiezf8okq9fmnnb1&amp;fileName=Screen%20Shot%202017-04-30%20at%2011.08.28%20PM.png&amp;viewContext=overlay" /></span></div>
<h3> 6. The Connector and LoopBack app logs show that a new event is detected:</h3> 
```js
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
     region: 'Bangalore' } 
}
```
<h3>7. Broker logs show that a new client (publisher) connected:</h3>
```js
1493573959: New connection from 127.0.0.1 on port 1883.
1493573959: New client connected from 127.0.0.1 as mqttjs_e1b485ee (c1, k10).
```
<div id="magicdomid240"></div>
<h3>8. The Node.js client app logs show that a message is received with the new account details:</h3>
```js
/v1/subutest {"model":"accounts","message":{"_id":"26dd638e8462387f03f2f6f25e4e6926","_rev":"1-08fb96a08261081dcd24b7a1629c8cde","name":"James Bond","type":"Demo","region":"Bangalore"}}
```
<h3>9. The mosquitto subscriber also receives the same message:</h3>
```js
{"model":"accounts","message":{"_id":"26dd638e8462387f03f2f6f25e4e6926","_rev":"1-08fb96a08261081dcd24b7a1629c8cde","name":"James Bond","type":"Demo","region":"Bangalore"}}
```

<div id="magicdomid247"><span>This proves that LoopBack can be extended for the events side of the story in a seamless way which is:</span>
<ul class="list-bullet1">
 	<li><span>Generic - Using strong-pubsub abstracts away broker specific interfaces.</span></li>
</ul>
<ul class="list-bullet1">
 	<li><span>Modular - A plug-gable event connector for every application we want events from.</span></li>
</ul>
<ul class="list-bullet1">
 	<li><span>Consistent - Same conceptual and programming model (datasources and models) as for the CRUD side.</span></li>
</ul>
<div id="magicdomid252">References:</div>
	[1] <a class="link" href="https://github.com/strongloop/strong-pubsub" target="_blank" rel="noreferrer nofollow">https://github.com/strongloop/strong-pubsub</a>
	[2] <a class="link" href="https://mosquitto.org/" target="_blank" rel="noreferrer nofollow">https://mosquitto.org/</a>
