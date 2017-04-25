---
id: 28408
title: Strong-soap LoopBack module
date: 2017-01-26T07:36:42+00:00
author: Rashmi Hunt
guid: https://strongloop.com/?p=28408
permalink: /strongblog/strong-soap-loopback-module/
categories:
  - LoopBack
---
After years of work in with Java and Java EE7 technologies, I recently transitioned to IBM&#8217;s Strongloop team to work with the latest new technologies &#8211; Node.js. Making the transition from Java to Node.js has been an interesting journey, more about that in a blog someday. In the meanwhile, here is my first bit of work with Node.js, a new open-source module called <a href="https://github.com/strongloop/strong-soap" target="_blank">strong-soap</a>, which is part of the LoopBack 3.0 release. This module provides a comprehensive SOAP client for invoking web services. It also provides a mock-up SOAP server capability to create and test your web service. However, you can use strong-soap with Loopback 2.x as well.

<!--more-->

Strong-soap is re-implementation of the <span class="author-270325677 font-color-333333 font-size-medium link-MTQ3NjczNTAzMjUxNC1odHRwczovL2dpdGh1Yi5jb20vdnB1bGltL25vZGUtc29hcA=="><a class="link" href="https://github.com/vpulim/node-soap" target="_blank" rel="noreferrer nofollow">node-soap</a></span> module with the following major improvements:

  * Full coverage to parse and load different styles of WSDLs and XSDs.
  * Comprehensive support for SOAP client to invoke web services.
  * Comprehensive API support to convert JSON-> XML and vice versa, load WSDLs/XSDs, and parse XML.
  * Improved test case coverage.
  * Full support for SOAP 1.1 and SOAP 1.2 faults.
  * Proper namespace support in Request, Response and Fault Envelopes.
  * Security support.
  * Mock-up soap server support to develop and test your web service.

The above features make the new connector more robust for the Enterprise use cases.

## How to use strong-soap

LoopBack 3.0 uses [loopback-connector-soap version 3.0](https://github.com/strongloop/loopback-connector-soap), which uses the strong-soap module. You can also use strong-soap directly.

The strong-soap API is exposed through a soap object:

```js
var soap = require('strong-soap').soap;
```

This object in turn exposes objects and methods to:

  * Create a SOAP client and make a web service request
  * Convert XML to JSON and vice-versa
  * Parse WSDL (web services definition language)

For more information, see the <a href="https://github.com/strongloop/strong-soap/blob/master/README.md" target="_blank">strong-soap README</a>.

## Create SOAP client

Use the **soap.createClient()** method to create a SOAP client. Then using the client, you can make a request to a SOAP service based on a WSDL file. Start with the WSDL for the web service you want to invoke.  <span class="left">For example, the stock quote web service <b><a href="http://www.webservicex.net/stockquote.asmx">http://www.webservicex.net/stockquote.asmx</a></b> and the WSDL for it is <b><a href="http://www.webservicex.net/stockquote.asmx?WSDL">http://www.webservicex.net/stockquote.asmx?WSDL</a></b></span>

Create a new SOAP client from a WSDL URL using soap.createClient(url[, options], callback) API. This also supports a local filesystem path. Pass an instance of Client to the callback to execute methods on the SOAP service; for example:

```js
"use strict";

var soap = require('strong-soap').soap;
// wsdl of the web service this client is going to invoke. For local wsdl you can use, url = './wsdls/stockquote.wsdl'
var url = 'http://www.webservicex.net/stockquote.asmx?WSDL';

var requestArgs = {
  symbol: 'IBM'
};

var options = {};
soap.createClient(url, options, function(err, client) {
  var method = client['StockQuote']['StockQuoteSoap']['GetQuote'];
  method(requestArgs, function(err, result, envelope, soapHeader) {
    //response envelope
    console.log('Response Envelope: \n' + envelope);
    //'result' is the response body
    console.log('Result: \n' + JSON.stringify(result));
  });
});
```

The above service invocation creates this request envelope:

```js
&lt;?xml version="1.0" encoding="UTF-8" standalone="yes"?&gt;
&lt;soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"&gt;
  &lt;soap:Header/&gt;
  &lt;soap:Body&gt;
    &lt;ns1:GetQuote xmlns:ns1="http://www.webserviceX.NET/"&gt;
      &lt;ns1:symbol&gt;IBM&lt;/ns1:symbol&gt;
    &lt;/ns1:GetQuote&gt;
  &lt;/soap:Body&gt;
&lt;/soap:Envelope&gt;
```

The SOAP client object (client in the above example) provides numerous other methods for interacting with a SOAP service; [see the README](https://github.com/strongloop/strong-soap#client) for details.

## Convert between JSON and XML

The **soap.XMLHandler** object converts a JSON object to XML and XML to a JSON object. It also can parse XML strings or stream into the XMLBuilder tree.

Here&#8217;s an example of converting a JSON object to XML and XML to a JSON object:

```js
var soap = require('strong-soap').soap;
var XMLHandler = soap.XMLHandler;
var util = require('util');
var url = 'http://www.webservicex.net/stockquote.asmx?WSDL';
var requestArgs = {
  symbol: 'IBM'
};
//custom request header
var customRequestHeader = {customheader1: 'test1'};
var options = {};
soap.createClient(url, options, function(err, client) {
  var method = client['StockQuote']['StockQuoteSoap']['GetQuote'];
  method(requestArgs, function(err, result, envelope, soapHeader) {
      var xmlHandler = new XMLHandler();
      //convert 'result' JSON object to XML
      var node = xmlHandler.jsonToXml(null, null,
        XMLHandler.createSOAPEnvelopeDescriptor('soap'), result);
      var xml = node.end({pretty: true});
      //convert XML to JSON object
      var root = xmlHandler.xmlToJson(null, xml, null);
      console.log('%s', util.inspect(root, {depth: null}));
  }, options, customRequestHeader);
});
```

Use the **XMLHandler.parseXml()** method to parse an XML string or stream into the XMLBuilder tree:

```js
var root = XMLHandler.parseXml(null, xmlString);
```

## Parse WSDL

The WSDL.open() method loads WSDL into a tree form. You can traverse through WSDL tree to get to bindings, services, ports, operations or any information of the WSDL and XSD.

```js
wsdl.open(wsdlURL, options, callback(err, wsdl))
```

Parameters

  * **wsdlURL** -WSDL URL to load.
  * **options** &#8211; WSDL options
  * **callback** &#8211; Error and WSDL loaded into object tree.

For example:

```js
"use strict";

var soap = require('strong-soap').soap;
var WSDL = soap.WSDL;
var path = require('path');
//pass in WSDL options if any
var options = {};
var url = 'http://www.webservicex.net/stockquote.asmx?WSDL';
WSDL.open(url, options,  function(err, wsdl) {
  //user should be able to get to any information of this WSDL from this object. User
  //can traverse the WSDL tree and get to bindings, operations, services, portTypes,
  //messages, parts and //XSD elements/Attributes.
  var getQuoteOp = wsdl.definitions.bindings.StockQuoteSoap.operations.GetQuote;
  //print operation name
  console.log(getQuoteOp.$name);
  var service = wsdl.definitions.services['StockQuote'];
  //print service name
  console.log(service.$name);
});
```

## Security

strong-soap provides default security protocols and also support for adding your own as well. For more information, see the &#8216;security&#8217; section in [strong-soap README](https://github.com/strongloop/strong-soap/blob/master/README.md).

## Mock-up SOAP server

strong-soap provides a mock-up SOAP server capability to implement and test a web service. Here is an example of creating a SOAP server and sending a JSON response:

```js
var soap = require('strong-soap').soap;
var http = require('http');
var fs = require('fs');
//send JSON response for stockquote service for GetQuote operation
var test = {};
test.server = null;
test.service = {
  StockQuote: {
    StockQuoteSoap: {
      GetQuote: function (args, cb, soapHeader) {
        if (args.symbol === 'ACME') {
          var jsonResponse = {GetQuoteResponse: {GetQuoteResult: '100.00'}};
          return jsonResponse;
        }
      }
    }
  }
};

//get the WSDL from http://www.webservicex.net/stockquote.asmx?WSDL and save onto current 
//directory as stockquote.wsdl
//Below code shows how to create a mock up soap server for stockquote wsdl
fs.readFile('./stockquote.wsdl', 'utf8', function (err, data) {
  test.wsdl = data;
  test.server = http.createServer(function (req, res) {
    res.statusCode = 404;
    res.end();
  });

  test.server.listen(15099, null, null, function () {
    test.soapServer = soap.listen(test.server, '/stockquote', test.service, test.wsdl);
    test.baseUrl = 'http://' + test.server.address().address + ":" + test.server.address().port;
    if (test.server.address().address === '0.0.0.0' || test.server.address().address === '::')
    {
      test.baseUrl ='http://127.0.0.1:' + test.server.address().port;
    }
    //use this URL on the client side to invoke this local web service. 
    //For e.g //http://127.0.0.1:15099/stockquote?wsdl
    console.log(test.baseUrl);
  });
})
```

&nbsp;

* * *

## What&#8217;s Next?

To understand all the APIs strong-soap provides, see the [README](https://github.com/strongloop/strong-soap/blob/master/README.md). Go through the [test cases](https://github.com/strongloop/strong-soap/tree/master/test) and [examples](https://github.com/strongloop/strong-soap/tree/master/example) under strong-soap. Now that you know about strong-soap, please feel free to use it, open issues, submit pull requests and continue to help make LoopBack such a great community.

Feel free to contact the LoopBack team on GitHub directly via our GitHub handles (for example: [@rashmihunt](https://github.com/rashmihunt) for me, [@strongloop/loopback-dev](https://github.com/orgs/strongloop/teams/loopback-devs) for the entire team) if you have any questions or requests.