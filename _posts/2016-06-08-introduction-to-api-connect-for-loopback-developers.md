---
id: 27476
title: Introduction to API Connect for LoopBack Developers
date: 2016-06-08T08:00:11+00:00
author: C. Rand McKinney
guid: https://strongloop.com/?p=27476
permalink: /strongblog/introduction-to-api-connect-for-loopback-developers/
categories:
  - API Connect
  - LoopBack
---
If you’re a LoopBack developer, you have no doubt heard about [IBM API Connect](https://developer.ibm.com/apiconnect), the first product to come out of the IBM acquisition of StrongLoop.  You may not have paid too much attention to it yet, perhaps thinking it’s not relevant to you, or perhaps you’re happy enough using LoopBack and the StrongLoop tools. This blog provides a gentle introduction to API Connect for current LoopBack developers, as well as some good reasons why you may want to consider switching from StrongLoop to the API Connect tools.

<!--more-->

NOTE: This article assumes you are familiar with LoopBack and StrongLoop tools (the Arc graphical tool and the `slc` command-line tool).

While LoopBack will continue on as an active open-source framework (that’s not going to change!), the team is no longer actively working on the StrongLoop tools, but rather focusing on the API Connect tools: the API Designer graphical tool and the `apic` command-line tool, collectively referred to as the _API Connect Developer Toolkit_. The Developer Toolkit corresponds roughly to StrongLoop Arc and `slc`, but also includes the Micro Gateway, a lightweight version of the IBM DataPower Gateway.

API Connect offers features to manage the API lifecycle, as demonstrated by the graphic below:

[<img class="aligncenter size-medium wp-image-27535" src="https://strongloop.com/wp-content/uploads/2016/06/API_Connect_Circle_1-300x300.png" alt="API_Connect_Circle_1" width="300" height="300" srcset="https://strongloop.com/wp-content/uploads/2016/06/API_Connect_Circle_1-300x300.png 300w, https://strongloop.com/wp-content/uploads/2016/06/API_Connect_Circle_1-80x80.png 80w, https://strongloop.com/wp-content/uploads/2016/06/API_Connect_Circle_1-36x36.png 36w, https://strongloop.com/wp-content/uploads/2016/06/API_Connect_Circle_1-180x180.png 180w, https://strongloop.com/wp-content/uploads/2016/06/API_Connect_Circle_1-120x120.png 120w, https://strongloop.com/wp-content/uploads/2016/06/API_Connect_Circle_1-150x150.png 150w, https://strongloop.com/wp-content/uploads/2016/06/API_Connect_Circle_1.png 347w" sizes="(max-width: 300px) 100vw, 300px" />](https://strongloop.com/wp-content/uploads/2016/06/API_Connect_Circle_1.png)

The [IBM API Connect page](http://www-03.ibm.com/software/products/en/api-connect) provides additional information on these four capabilities:

- **Create**: create high-quality, scalable and secure APIs for application servers, databases, enterprise service buses (ESB) and mainframes in minutes.

- **Run**: take advantage of integrated tooling to build, debug and deploy APIs and microservices using the Node.js or Java.

- **Manage**: create and manage portals that allow developers to quickly discover and consume APIs and securely access enterprise data, and monitor APIs to improve performance.

- **Secure**: Administrators can manage security and governance over APIs and the microservices. IT can set and enforce API policies to secure back-end information assets and comply with governance and regulatory mandates.

As you can see, API Connect is a robust solution built upon LoopBack and StrongLoop Arc but expands upon their functionality. API Connect includes several significant components beyond what StrongLoop provided:

  * API Gateway where you can apply runtime policies such as request throttling and access control.
  * Cloud Manager, a graphical user interface that you use to configure, manage, and monitor your on-premises cloud.
  * API Manager, a graphical user interface that facilitates the creation, promotion, and tracking of APIs.
  * Developer Portal, where you can publish your APIs for both internal and external developers to use.

This blog post is going to focus on the Developer Toolkit, but it’s important to understand that it is just part of the larger picture of API Connect.

“But wait,” you say, “I’m an open-source developer and I don’t want to pay for a solution yet.”  No worries, because API Connect includes an [Essentials offering](http://www.ibm.com/support/knowledgecenter/SSMNED_5.0.0/com.ibm.apic.overview.doc/overview_rapic_offerings.html) that is free to use! It includes basic versions of all the above components that are sufficient for development. It also includes 50,000 API calls per month for APIs deployed to [Bluemix](http://www.ibm.com/cloud-computing/bluemix/), IBM’s cloud platform. When you’re ready to go to production, you can upgrade to the more robust Professional or Enterprise offerings if you so choose, but there’s no obligation to do so.

To get started, the first thing you need to do (naturally), is install the API Connect Developer Toolkit. Don’t worry, you can have both API Connect and StrongLoop installed with no problems!

If you’re on Windows, you’ll need to do a couple of other things.

```js
$ npm install apiconnect
```

If you run into any issues, see [Installation Troubleshooting](http://www.ibm.com/support/knowledgecenter/api/content/nl/en-us/SSMNED_5.0.0/com.ibm.apic.toolkit.doc/tapim_cli_install.html#task_uvw_ckv_jv).

Before diving in, take a quick look at what you’ve installed.

Enter this command to display the top-level command-line help:

```js
$ apic --help
…
Commands (type apic COMMMAND -h for additional help):

  Creating and validating artifacts
    config          manage configuration variables
    create          create development artifacts
    edit            run the API Designer
    validate        validate development artifacts

  Creating and testing applications
    loopback        create and manage LoopBack applications
    microgateway    create Micro Gateway applications
    start           start services
    stop            stop services
    logs            display service logs
    props           service properties
    services        service management

  Publishing to the cloud
    login           log in to an IBM API Connect cloud
    logout          log out of an IBM API Connect cloud
    organizations   manage organizations
    catalogs        manage catalogs in an organization
    publish         publish products and APIs to a catalog
    products        manage products in a catalog
    apps            manage provider applications
    drafts          manage APIs and products in drafts
```

This lists all the `apic` commands, and as you can see, there are quite a few.

Every StrongLoop `slc loopback` command has a corresponding API Connect `apic` command. The following table provides the apic command corresponding to each slc loopback command. Type `apic loopback -h` to see the subcommands available; they look pretty similar to the various `slc lopback` commands. For example `slc loopback:property` corresponds to `apic loopback:property`, and so on.  The exceptions are the commands to create models and data sources:

  * `slc loopback:model` corresponds to `apic create --type model`
  * `slc loopback:datasource` corresponds to `apic create --type datasource`

This table summarizes the two sets of commands:

<table>
  <tr>
    <td>
      StrongLoop Command
    </td>

    <td>
      API Connect Command
    </td>
  </tr>

  <tr>
    <td>
      slc loopback
    </td>

    <td>
      apic loopback
    </td>
  </tr>

  <tr>
    <td>
      slc loopback:datasource
    </td>

    <td>
      apic create &#8211;type datasource
    </td>
  </tr>

  <tr>
    <td>
      slc loopback:model
    </td>

    <td>
      apic create &#8211;type model
    </td>
  </tr>

  <tr>
    <td>
      slc loopback:property
    </td>

    <td>
      apic loopback:property
    </td>
  </tr>

  <tr>
    <td>
      slc loopback:acl
    </td>

    <td>
      apic loopback:acl
    </td>
  </tr>

  <tr>
    <td>
      slc loopback:relation
    </td>

    <td>
      apic loopback:relation
    </td>
  </tr>

  <tr>
    <td>
      slc loopback:remote-method
    </td>

    <td>
      apic loopback:remote-method
    </td>
  </tr>

  <tr>
    <td>
      slc loopback:middleware
    </td>

    <td>
      apic loopback:middleware
    </td>
  </tr>

  <tr>
    <td>
      slc loopback:boot-script
    </td>

    <td>
      apic loopback:boot-script
    </td>
  </tr>

  <tr>
    <td>
      slc loopback:export-api-def
    </td>

    <td>
      apic loopback:export-api-def
    </td>
  </tr>

  <tr>
    <td>
      slc loopback:swagger
    </td>

    <td>
      apic loopback:swagger
    </td>
  </tr>
</table>

Next, we’ll walk through importing an existing LoopBack app into API Connect. We’ll use an app that you are probably familiar with, [loopback-getting-started-intermediate](https://github.com/strongloop/loopback-getting-started-intermediate). This app is the end result of following the [Getting Started Part II](https://docs.strongloop.com/display/LB/Getting+started+part+II) tutorial. It has the advantages of being fairly simple and yet with both a front-end and a reasonably complete LoopBack back-end.

Now, follow these steps to run the API Designer:

  1. Clone the Getting Started Intermediate repo:
  ```js
git clone
https://github.com/strongloop/loopback-getting-started-intermediate.git
```

  2. Install dependencies
```js
cd loopback-getting-started
npm install
```

  3. So far, you’re on familiar ground. Now you’re going to venture into the world of API Connect: you’re going to generate API and product definitions, YAML files that the Developer Toolkit uses to help you manage APIs. Enter this command:

```
apic loopback:refresh
```

This creates a definitions directory in your project with two YAML files:

  * `loopback-getting-started-intermediate.yaml` &#8211; the API definition file.
  * `loopback-getting-started-intermediate-product.yaml` &#8211; the product definition file.

These are both OpenAPI (Swagger) files in YAML format.

Now run the API Designer:

```
apic edit
```

You’ll be presented with a Bluemix login screen:

[<img class="aligncenter size-medium wp-image-27499" src="https://strongloop.com/wp-content/uploads/2016/06/Bluemix-login-300x186.png" alt="Bluemix login" width="300" height="186" srcset="https://strongloop.com/wp-content/uploads/2016/06/Bluemix-login-300x186.png 300w, https://strongloop.com/wp-content/uploads/2016/06/Bluemix-login-450x279.png 450w, https://strongloop.com/wp-content/uploads/2016/06/Bluemix-login.png 511w" sizes="(max-width: 300px) 100vw, 300px" />](https://strongloop.com/wp-content/uploads/2016/06/Bluemix-login.png)

Login with your Bluemix credentials, or click **Register for IBM Bluemix** to sign up. Once you log in, the API Designer will open in your default browser:

[<img class="aligncenter size-medium wp-image-27501" src="https://strongloop.com/wp-content/uploads/2016/06/API-Designer-browser-300x101.png" alt="API Designer browser" width="300" height="101" srcset="https://strongloop.com/wp-content/uploads/2016/06/API-Designer-browser-300x101.png 300w, https://strongloop.com/wp-content/uploads/2016/06/API-Designer-browser-705x238.png 705w, https://strongloop.com/wp-content/uploads/2016/06/API-Designer-browser-450x152.png 450w, https://strongloop.com/wp-content/uploads/2016/06/API-Designer-browser.png 789w" sizes="(max-width: 300px) 100vw, 300px" />](https://strongloop.com/wp-content/uploads/2016/06/API-Designer-browser.png)

The API Designer editor looks pretty different from StrongLoop Arc, doesn’t it? But it actually does some of the same things. Notice the four main tabs at the top: **Products**, **APIs**, **Models**, and **Data Sources**. You should be familiar with models and data sources from LoopBack; they are the basic building blocks of a LoopBack app, so let’s start there.

Click on **Models**:

[<img class="aligncenter size-medium wp-image-27504" src="https://strongloop.com/wp-content/uploads/2016/06/Click-on-models-300x123.png" alt="Click on models" width="300" height="123" srcset="https://strongloop.com/wp-content/uploads/2016/06/Click-on-models-300x123.png 300w, https://strongloop.com/wp-content/uploads/2016/06/Click-on-models-705x289.png 705w, https://strongloop.com/wp-content/uploads/2016/06/Click-on-models.png 787w, https://strongloop.com/wp-content/uploads/2016/06/Click-on-models-450x185.png 450w" sizes="(max-width: 300px) 100vw, 300px" />](https://strongloop.com/wp-content/uploads/2016/06/Click-on-models.png)

This looks a bit more familiar. These are the three LoopBack models in the app, namely **CoffeeShop**, **Review**, and **Reviewer**. Click on any of them to see the properties in the model and other LoopBack model settings.

Likewise, click on **Data Sources**, and you’ll see the In-memory, MySQL, and MongoDB data sources defined for the app. Again, this should look familiar from your experience with StrongLoop Arc.

_Products_, though, are a new concept. Products provide a way to group APIs together for a particular use. Additionally, they contain _Plans_, which can be used to differentiate between different offerings. A product is defined by a YAML file (in this case, the `loopback-getting-started-intermediate-product.yaml` file that we encountered earlier) and API Designer provides a visual way to edit this file. Although they are very important for publishing and providing APIs to developers, we won’t get into the details of Products and Plans here; for more information, see [Working with Products in the API Designer](http://www.ibm.com/support/knowledgecenter/SSMNED_5.0.0/com.ibm.apic.toolkit.doc/capim_products.html).

_APIs_ simply represent your API definitions as encapsulated with the Swagger (OpenAPI) specification. This is how you define all the external aspects of your API, including the data format it produces and consumes, the paths (endpoints), security definitions, and so on. In API Connect, an API is defined by a YAML file (again, the `loopback-getting-started-intermediate.yaml` file that we encountered earlier), and API Designer provides a visual way to edit this file.

Click **APIs**, then click **loopback-getting-started-intermediate** to view its details.

[<img class="aligncenter size-medium wp-image-27506" src="https://strongloop.com/wp-content/uploads/2016/06/click-loopback-getting-started-intermediate-300x232.png" alt="click loopback-getting-started-intermediate" width="300" height="232" srcset="https://strongloop.com/wp-content/uploads/2016/06/click-loopback-getting-started-intermediate-300x232.png 300w, https://strongloop.com/wp-content/uploads/2016/06/click-loopback-getting-started-intermediate-705x545.png 705w, https://strongloop.com/wp-content/uploads/2016/06/click-loopback-getting-started-intermediate-450x348.png 450w, https://strongloop.com/wp-content/uploads/2016/06/click-loopback-getting-started-intermediate.png 784w" sizes="(max-width: 300px) 100vw, 300px" />](https://strongloop.com/wp-content/uploads/2016/06/click-loopback-getting-started-intermediate.png)

Scroll down the left-hand navigation to browse through all the things you can set in the API definition. Click **Source** in the top bar to view the Swagger source; you’ll see the content of the `loopback-getting-started-intermediate.yaml` file.

Now click **Assemble** to view the policy assembly editor. This is a very slick visual editor that enables you to edit Gateway policies visually. We’ll delve into this part of the product in another blog; for now just know that this is how you can define API Gateway policies for both the Micro Gateway and the full-fledge DataPower Gateway.

Now click on **All APIs** to go back to the API view.

Click **Run** then **Start** to start your LoopBack app and the Micro Gateway. After a brief pause, you’ll see:

```
Running
Application: <http://127.0.0.1:4003/>
Micro Gateway: <https://127.0.0.1:4004/>
```

Then click **Explore**. You’ll see the API Explorer, which is the similar to the LoopBack API Explorer, but with a very different layout. The API routes (endpoints) are shown down the left side of the screen.

Click **GET /CoffeeShops** to display that endpoint and scroll down in the right pane to display the **Call Operation** button.  Click it to call the GET request.

NOTE: The first time you do this, you’ll likely see an error message due to an “untrusted certificate for localhost.”  Just click the link provided in the error message in the API Explorer to accept the certificate, then proceed to call the operations in your web browser. The exact procedure depends on the web browser you are using.

Also, be aware that if you load the REST endpoints directly in your browser (that is, not in API Explorer), you will see the message:

`{"name":"PreFlowError","message":"unable to process the request"}.`

You must use API Explorer to test REST endpoints in your browser because it includes the requisite headers and other request parameters.

Once you’ve cleared up any certificate errors, when you call the **GET /CoffeeShops** endpoint, you’ll see the familiar pre-populated data from the Getting Started app:

```js
[
  {
    "name": "Bel Cafe",
    "city": "Vancouver",
    "id": 1
  },
  {
    "name": "Three Bees Coffee House",
    "city": "San Mateo",
    "id": 2
  },
  {
    "name": "Caffe Artigiano",
    "city": "Vancouver",
    "id": 3
  }
]
```
