---
id: 29325
title: Building Enterprise APIs for SOAP Web Services Using LoopBack
date: 2017-05-05T07:01:47+00:00
author: Rashmi Hunt
guid: http://strongloop.com/?p=29325
permalink: /strongblog/building-enterprise-apis-for-soap-web-services-using-loopback
categories:
- API
- LoopBack
---

We are excited to announce that LoopBack can now generate remote methods and REST APIs for SOAP web services. This feature enables you to easily create REST APIs that invoke web services without having in-depth knowledge of the web service. SOAP has been an industry standard for a long time, and enterprise adoption of REST APIS means supporting legacy systems.

## What is LoopBack?

[LoopBack](http://loopback.io/) is an open source Node.js API framework from
[StrongLoop](http://www.strongloop.com/), optimized for mobile, web, and other device and built on top of Express . LoopBack makes it easy for developers to define, build and consume APIs. Define data models, connect to multiple data sources, write business logic in Node.js, glue on top of your existing services and data, and consume using JavaScript, iOS, and Android SDKs.
more

## What are Web Services, SOAP, and WSDL?

Web services enable applications to communicate with each other independently of their platform and language in which they're implemented. A web service is a software interface that describes operations that can be invoked over the network through standardized XML messaging using Simple Object Access Protocol (
[SOAP](https://www.w3.org/TR/soap/)). Web Services Description Language (
[WSDL](https://www.w3.org/TR/wsdl20/)) is an XML document that describes web service endpoints, bindings, operations, and schema.

## LoopBack + SOAP = REST API

<img class="alignnone size-medium wp-image-19068" alt="Building Enterprise APIs for SOAP Web Services using LoopBack" src="{{site.url}}/blog-assets/2017/04/LoopBack-1030x572.png" />

SOAP web services are still important in many enterprises. However, SOAP is fairly heavy-weight, and working with XML-based SOAP payloads in Node.js is not easy. It’s much easier to use JSON and to wrap or mediate a SOAP service and expose it as a REST API.

To support the “API design first” approach, the
[SOAP generator](http://loopback.io/doc/en/lb3/SOAP-generator.html) (`lb soap` command) creates LoopBack models and REST APIs for WSDL/SOAP operations to enable you to create a LoopBack app that invokes a web service without writing any code.

## Scaffolding a LoopBack application from a SOAP web service datasource

Before starting, be sure you have installed the LoopBack CLI tools:

npm install -g loopback-cli
For more information, see
[Installation](http://loopback.io/doc/en/lb3/Installation.html) (LoopBack documentation).

### Create a LoopBack application

The first step is to create a blank LoopBack application. Let's call it "soap-demo":

```
lb app soap-demo
```

Select 3.x or 2.x LoopBack version. When prompted 'What kind of application do you have in mind?', select 'empty-server''.

<img class="alignnone size-medium wp-image-19068" alt="Building Enterprise APIs for SOAP Web Services using LoopBack -soap-demo" src="{{site.url}}/blog-assets/2017/04/Lets-create-soap-demo-.png" />

### Create a SOAP web service datasource

The next step is to create SOAP web services datasource. In this demo, we will create a SOAP datasource for an externally available periodic table web service:
[http://www.webservicex.net/periodictable.asmx?WSDL](http://www.webservicex.net/periodictable.asmx?WSDL)

```
cd soap-demo
    lb datasource
```    
Here are the steps to create SOAP Web Services datasource for periodic table web service.

- Enter the data source name, 'periodicSoapDS'.
- Scroll through and select 'Soap Webservices (supported by StrongLoop)' from the list of connectors.
- Enter
[http://www.webservicex.net/periodictable.asmx](http://www.webservicex.net/periodictable.asmx)for 'URL to the SOAP web service endpoint' prompt.
- Enter
[http://www.webservicex.net/periodictable.asmx?WSDL](http://www.webservicex.net/periodictable.asmx?WSDL) for 'HTTP URL or local fie system path to WSDL file' prompt.
- Enter 'Y' to Expose operations as REST APIs.
- Press RETURN when prompted to 'Maps WSDL binding operations to Node.js methods'.
- Select 'Y' to 'Install 'loopback-connector-soap' prompt. This installs loopback-connector-soap, required for the `lb soap` command to work.
Refer to
[SOAP data source properties](http://loopback.io/doc/en/lb3/SOAP-connector.html) for more information on SOAP data source properties.

<img class="alignnone size-medium wp-image-19068" alt="Building Enterprise APIs for SOAP Web Services using LoopBack - install loopback-connector-soap" src="{{site.url}}/blog-assets/2017/04/install-loopback-connector-soap-1030x301.png" />

### Generate APIs from SOAP web services datasource

Now generate models and APIs from the SOAP web services datasource.

```js
lb soap
```

This prompts you for list of SOAP web service data sources you have created for this app. Now it will just show 'periodicSoapDS' since that's the only one created so far. Select the data source from the list.

The generator then discovers all the services defined in the WSDL for the selected datasource.

<img class="alignnone size-medium wp-image-19068" alt="Building Enterprise APIs for SOAP Web Services using LoopBack - select datasource" src="{{site.url}}/blog-assets/2017/04/select-datasource.png" />

### Select the service from a list of services.

Once you select a service, the tool discovers and lists bindings defined for the selected service.

<img class="alignnone size-medium wp-image-19068" alt="Building Enterprise APIs for SOAP Web Services using LoopBack - select service" src="{{site.url}}/blog-assets/2017/04/select-service.png" />

### Select a binding

Once you select a binding, the tool discovers and lists SOAP operations defined in the selected binding.

<img class="alignnone size-medium wp-image-19068" alt="Building Enterprise APIs for SOAP Web Services using LoopBack - select binding" src="{{site.url}}/blog-assets/2017/04/select-binding.png" />

### Select one or more SOAP operations

Once you select one or more operations, the tool generates remote methods and a REST API to invoke the web service at
[http://www.webservicex.net/periodictable.asmx](http://www.webservicex.net/periodictable.asmx).

<img class="alignnone size-medium wp-image-19068" alt="Building Enterprise APIs for SOAP Web Services using LoopBack - select operations" src="{{site.url}}/blog-assets/2017/04/select-operations-1030x194.png" />

### Check the project

The models and corresponding JavaScript files are generated into the server/models folder:

<img class="alignnone size-medium wp-image-19068" alt="Building Enterprise APIs for SOAP Web Services using LoopBack - server / models folder" src="{{site.url}}/blog-assets/2017/04/server-model-folder-601x1030.png" />
- server/model-config.json: Config for all models

Here are some of the server/models files:
- soap-periodictable-soap.json: model to host all APIs
- soap-periodictable-soap.js: JS file containing all APIs which can invoke Web Service operations.
- get-atomic-number.json: GetAtomicNumber definition
- get-atomic-number.js: GetAtomicNumber extension
- et-atomic-weight.json: GetAtomicWeight model definition
- get-atomic-weight.js: GetAtomicWeight model extension

### Run the application

To run the application:

```
node .
```
Open your browser to
[http://localhost:3000/explorer](http://localhost:3000/explorer).

<img class="alignnone size-medium wp-image-19068" alt="Building Enterprise APIs for SOAP Web Services using LoopBack - LoopBack API Explorer" src="{{site.url}}/blog-assets/2017/04/LoopBack-API-Explorer-1030x369.png" />

As you see, SOAP operations defined in the WSDL document are now available from LoopBack!

Try it out:

- Click on 'GetAtomicNumber' API.
- Under 'Parameters' click on 'Example Value' text box. This will fill in 'GetAtomicNumber' value text box.
- Fill in the 'ElementName' as 'Copper' or 'Iron' or any element name from the periodic table.
- Click on 'Try it out' button.

<img class="alignnone size-medium wp-image-19068" alt="Building Enterprise APIs for SOAP Web Services using LoopBack - Set access token" src="{{site.url}}/blog-assets/2017/04/Set-Access-Token-1030x834.png" />

This invokes the REST API generated in `soap-periodictable-soap.js`. This REST API in turn invokes the periodic table web service at
[http://www.webservicex.net/periodictable.asmx](http://www.webservicex.net/periodictable.asmx) returning a SOAP result back to the API explorer.

<img class="alignnone size-medium wp-image-19068" alt="Building Enterprise APIs for SOAP Web Services using LoopBack " src="{{site.url}}/blog-assets/2017/04/request-url-1030x241.png" />

## Summary

The new `lb soap` command enables you to implement a complete "round trip" for a SOAP web service:

- Start with a SOAP web service data source.
- Generate corresponding models and APIs to invoke SOAP operations.
- Play with the live APIs served by LoopBack using the explorer.
- Invoke the web service through your REST API.

For more details, refer to the documentation:

-
[SOAP generator](http://loopback.io/doc/en/lb3/SOAP-generator.html)(command reference)
-
[Connecting to SOAP web services](http://loopback.io/doc/en/lb3/Connecting-to-SOAP.html)

## What's next?

Code for this feature is mainly in these repositories:[loopback-cli](https://github.com/strongloop/loopback-cli) [generator-loopback](https://github.com/strongloop/generator-loopback) [loopback-soap](https://github.com/strongloop/loopback-soap) [strong-soap](https://github.com/strongloop/strong-soap)
Now that you know how to generate APIs and models for SOAP, please feel free to use it in your apps, open issues, submit pull requests, and continue to help make LoopBack a great community.

Contact the LoopBack team on GitHub directly (for example:
[@rashmihunt](https://github.com/rashmihunt) for me,
[@strongloop/loopback-dev](https://github.com/orgs/strongloop/teams/loopback-devs) for the entire team) if you have any questions or requests.
