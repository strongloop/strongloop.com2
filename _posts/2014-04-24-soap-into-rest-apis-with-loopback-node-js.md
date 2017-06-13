---
id: 15635
title: Turn SOAP into REST APIs with LoopBack
date: 2014-04-24T07:51:19+00:00
author: Raymond Feng
guid: http://strongloop.com/?p=15635
permalink: /strongblog/soap-into-rest-apis-with-loopback-node-js/
categories:
  - How-To
  - LoopBack
---
Nowadays, “web services” often means REST (Representational state transfer) APIs using JSON as the data exchange format.  However, the first generation of web services was built using [SOAP](http://www.w3.org/TR/soap) (Simple Object Access Protocol), a standard protocol based on XML.  In many enterprises, SOAP web services are still important assets, and some APIs are only available via SOAP.  Unfortunately, SOAP is fairly heavy weight, and working with XML-based SOAP payloads in Node.js is not very fun.  It’s much nicer to use JSON and to wrap or mediate a SOAP service and expose it as a REST API.

As an API server to glue existing and new data sources, [LoopBack](http://strongloop.com/mobile-application-development/loopback/) is designed to facilitate your backend data integration.  With the release of [loopback-connector-soap](https://github.com/strongloop/loopback-connector-soap) module, you can now easily consume SOAP web services and transform them into REST APIs.

[<img class="aligncenter size-full wp-image-14996" alt="loopback_logo" src="{{site.url}}/blog-assets/2014/04/loopback_logo.png" width="1590" height="498"  />]({{site.url}}/blog-assets/2014/04/loopback_logo.png)

In this blog, I’ll walk you through the steps to connect to an existing SOAP web service and transform it into a REST API. The example code is available [here](http://github.com/strongloop/loopback-connector-soap/blob/master/example/weather-rest.js.). It uses a public SOAP-based weather service from [here](http://wsf.cdyne.com/WeatherWS/Weather.asmx).

<!--more-->

<h2 dir="ltr">
  <strong>Configure a SOAP data source</strong>
</h2>

To invoke a SOAP web service using LoopBack, first configure a data source backed by the SOAP connector.

```js
var ds = loopback.createDataSource('soap', {
        connector: 'loopback-connector-soap'
        remotingEnabled: true,
        wsdl: 'http://wsf.cdyne.com/WeatherWS/Weather.asmx?WSDL'
    });
```

SOAP web services are formally described using [WSDL](http://www.w3.org/TR/wsdl) (Web Service Description Language) that specifies the operations, input, output and fault messages, and how the messages are mapped to protocols.  So, the most critical information to configure a SOAP data source is a WSDL document.  LoopBack introspects the WSDL document to map service operations into model methods.

<h2 dir="ltr">
  <strong>Options for the SOAP connector</strong>
</h2>

<li style="margin-left: 2em;">
  <strong>wsdl:</strong> HTTP URL or local file system path to the WSDL file, if not present, defaults to < soap web service url >?wsdl.
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><strong>url:</strong> URL to the SOAP web service endpoint. If not present, the location attribute of the SOAP address for the service/port from the WSDL document will be used. For example:</span>
</li>

```js
<wsdl:service name="Weather">
        <wsdl:port name="WeatherSoap" binding="tns:WeatherSoap">
            <soap:address location="http://wsf.cdyne.com/WeatherWS/Weather.asmx" />
        </wsdl:port>
        ...
    </wsdl:service>

```

<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><strong>remotingEnabled:</strong> indicates if the operations will be further exposed as REST APIs<br /> </span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;"><strong>operations:</strong> maps WSDL binding operations to Node.js methods</span>
</li>

```js
operations: {
      // The key is the method name
      stockQuote: {
        service: 'StockQuote', // The WSDL service name
        port: 'StockQuoteSoap', // The WSDL port name
        operation: 'GetQuote' // The WSDL operation name
      },
      stockQuote12: {
        service: 'StockQuote', // The WSDL service name
        port: 'StockQuoteSoap12', // The WSDL port name
        operation: 'GetQuote' // The WSDL operation name
      }
    }
```

<h2 dir="ltr">
  <strong>Create a model from the SOAP data source</strong>
</h2>

NOTE: The SOAP connector loads the WSDL document asynchronously. As a result, the data source won&#8217;t be ready to create models until it&#8217;s connected. The recommended way is to use an event handler for the &#8216;connected&#8217; event.

```js
ds.once('connected', function () {

        // Create the model
        var WeatherService = ds.createModel('WeatherService', {});

        ...
    }
```

<h2 dir="ltr">
  <strong>Extend a model to wrap/mediate SOAP operations</strong>
</h2>

Once the model is defined, it can be wrapped or mediated to define new methods. The following example simplifies the GetCityForecastByZIP operation to a method that takes zip and returns an array of forecasts.

```js
// Refine the methods
    WeatherService.forecast = function (zip, cb) {
        WeatherService.GetCityForecastByZIP({ZIP: zip || '94555'}, function (err, response) {
            console.log('Forecast: %j', response);
            var result = (!err && response.GetCityForecastByZIPResult.Success) ?
            response.GetCityForecastByZIPResult.ForecastResult.Forecast : [];
            cb(err, result);
        });
    };
```

The custom method on the model can be exposed as REST APIs. It uses the loopback.remoteMethod to define the mappings.

```js
// Map to REST/HTTP
    loopback.remoteMethod(
        WeatherService.forecast, {
            accepts: [
                {arg: 'zip', type: 'string', required: true,
                http: {source: 'query'}}
            ],
            returns: {arg: 'result', type: 'object', root: true},
            http: {verb: 'get', path: '/forecast'}
        }
    );
```

Run the example

```js
git clone git@github.com:strongloop/loopback-connector-soap.git
cd loopback-connector-soap
npm install
node example/weather-rest
```

Open <http://localhost:3000/explorer>

[<img class="aligncenter size-full wp-image-15646" alt="weatherservices" src="{{site.url}}/blog-assets/2014/04/weatherservices.png" width="1093" height="766" />]({{site.url}}/blog-assets/2014/04/weatherservices.png)

You can also test the REST API through direct URLs:

<li style="margin-left: 2em;">
  <a href="http://localhost:3000/api/WeatherServices/forecast?zip=94555">http://localhost:3000/api/WeatherServices/forecast?zip=94555</a>
</li>
<li style="margin-left: 2em;">
  <a href="http://localhost:3000/api/WeatherServices/weather?zip=95131">http://localhost:3000/api/WeatherServices/weather?zip=95131</a>
</li>


<h2 dir="ltr">
  <strong>Additional Examples</strong>
</h2>

There are two additional examples at <https://github.com/strongloop/loopback-connector-soap/tree/master/example>. Check them out:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">stock-ws.js: Get stock quotes by symbols</span>
</li>

`node example/stock-ws`

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">weather-ws.js: Get weather and forecast information for a given zip code</span>
</li>

`node example/weather-ws`

## **What’s next?**

  * Install LoopBack with a [simple npm command](http://strongloop.com/get-started/)
  * What’s in the upcoming Node v0.12 version? [Big performance optimizations](http://strongloop.com/strongblog/performance-node-js-v-0-12-whats-new/), read the blog by Ben Noordhuis to learn more.
  * Need performance monitoring, profiling and cluster capabilites for your Node apps? Check out [StrongOps](http://strongloop.com/node-js-performance/strongops/)!