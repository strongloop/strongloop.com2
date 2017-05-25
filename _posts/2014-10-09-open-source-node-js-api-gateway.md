---
id: 20502
title: Announcing the Open Source Node.js LoopBack API Gateway
date: 2014-10-09T08:45:47+00:00
author: Al Tsang
guid: http://strongloop.com/?p=20502
permalink: /strongblog/open-source-node-js-api-gateway/
categories:
  - Community
  - LoopBack
  - News
---
_Note: Since the publication of this blog, the StrongLoop API Gateway was relaunched on August 5, 2015. Read **[this announcement blog](https://strongloop.com/strongblog/api-gateway-node-js/)** to learn more about the latest version._

This morning, we released the open-source version of the [LoopBack API Gateway](https://github.com/strongloop/loopback-gateway). It’s been quite a while from the time we added a “Gateway” box in our architectural diagram marked as a “work in progress.” Before starting development, we wanted to gather customer use cases to make sure it addressed real-world needs. So, we captured customers’ requirements and also determined that the Gateway would use both declarative JSON as well as Node API calls.

> _What&#8217;s LoopBack? It&#8217;s an open source Node.js framework for developing, managing and scaling APIs. [Learn more&#8230;](http://loopback.io/)_

The LoopBack Gateway is open source and is the “minimum viable product” (MVP) that covers key use cases piloted with our co-development partners. Its behavior is completely “hard-wired.” In the future, we’ll release a commercial product, the StrongLoop API gateway, that will be dynamically configurable. It will also require some major enhancements to the LoopBack framework, including LoopBack components and policies. We’ll delve more into these in a moment; but first, let’s explain the often overloaded term “gateway”&#8230;

## **Overview**

An _API gateway_ externalizes, secures, and manages APIs. It is an intermediary between API consumers (clients) and backend API providers (API servers).
  
<img class="aligncenter size-full wp-image-20504" src="{{site.url}}/blog-assets/2014/10/sfc9JmbeCAVvU_T4BnqpiqA-1.png" alt="api gateway 2" width="622" height="107"  />

In this intermediary position, the API gateway performs several functions depending on the needs of the enterprise, as summarized in the table below.

<!--more-->

<div dir="ltr">
  <table>
    <colgroup> <col width="133" /> <col width="491" /></colgroup> <tr>
      <td>
        <p dir="ltr">
          <strong>Function</strong>
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          <strong>API Gateway Role</strong>
        </p>
      </td>
    </tr>
    
    <tr>
      <td>
        <p dir="ltr">
          Security
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          Acts as both provider and delegator to authentication, authorization, and auditing (AAA) sources within the enterprise as the first intercept to establish identity.
        </p>
      </td>
    </tr>
    
    <tr>
      <td>
        <p dir="ltr">
          Mediation and Transformation
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          Mediates between protocols and transforms portions of the API payload (both header and body) for clients that have fixed and/or specific requirements for consumption.
        </p>
      </td>
    </tr>
    
    <tr>
      <td>
        <p dir="ltr">
          Infrastructure QoS
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          Performs infrastructure-level API consumption functions required by client such as pagination, throttling, caching, delivery guarantee, firewall,  and so on.
        </p>
      </td>
    </tr>
    
    <tr>
      <td>
        <p dir="ltr">
          Monitoring and Reporting
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          Instruments APIs to fulfill service-level agrements (SLAs) through the monitoring of APIs and also injects metadata to report on API usage, health, and other metrics.
        </p>
      </td>
    </tr>
    
    <tr>
      <td>
        <p dir="ltr">
          Aggregation
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          Compose coarse-grain APIs (mashups) from fine-grain micro-APIs to fulfill specific business case operations through dynamic invocation and construction.
        </p>
      </td>
    </tr>
    
    <tr>
      <td>
        <p dir="ltr">
          Virtualization
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          A layer of abstraction that virtualizes API endpoints and acts  as a reverse proxy to API server host instances for high availability, security and scale.
        </p>
      </td>
    </tr>
  </table>
  
  <blockquote>
    <p>
      <em>Want to see an example of the loopback-gateway in action? Check out <a href="http://strongloop.com/strongblog/node-js-loopback-api-gateway-sample-applications/">Raymond Feng&#8217;s blog</a> post that walks you through the application code.</em>
    </p>
  </blockquote>
  
  <h2>
    <strong>LoopBack API Gateway </strong>
  </h2>
  
  <p>
    The LoopBack API Gateway is a LoopBack application that provides the above functions. You can incorporate the Gateway’s modules into any LoopBack API server instance to provide these functions in-process or run it as a separate process to segment traffic, load, and scale.
  </p>
  
  <p>
  </p>
  
  <h3>
    The Pipeline
  </h3>
  
  <p>
    The gateway creates a “pipeline” of layers for API requests and responses. The layers of the pipeline correspond to different stages of processing API requests, and orchestrating and constructing API responses.
  </p>
  
  <p>
    There API Gateway “pipeline” has four layers:
  </p>
  
  <ul>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">Transport layer &#8211; receives requests at the protocol level.</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">Remoting layer &#8211; maps API requests to applicable ACLs for remote invocation.</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">Model layer &#8211; model invocation from API mapping and manipulation.</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">Connector layer &#8211; connector invocation from API response processing.</span>
    </li>
  </ul>
  
  <h3>
    Minimal viable product (MVP) use cases
  </h3>
  
  <p>
    The use cases we addressed in the initial release of the gateway are:
  </p>
  
  <ul>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">Authenticate to API gateway using OAuth credentials: covers AAA through identity, authentication and API endpoint authorization</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">Generate token</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">Capture invocation and create metric for API endpoint invocation</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">Measure invocations per interval (for example: 5,000 requests per hour)</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">If number of invocation exceeds the policy, then block the request, otherwise&#8230;</span>
    </li>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">Proxy request to LoopBack instance</span>
    </li>
  </ul>
  
  <h2>
    <strong>StrongLoop API Gateway </strong>
  </h2>
  
  <p>
    The StrongLoop API Gateway will be the commercial version of the open-source LoopBack API Gateway. While the LoopBack API Gateway consists of a set of Express middleware components statically “wired together” within the pipeline, the StrongLoop API Gateway will enable you to dynamically specify LoopBack components that wrap Express middleware. Thus, it will be able to meet the same needs as the static LoopBack API Gateway, but with much greater flexibility. By providing a way to encapsulate Express middleware in a LoopBack component, you can take advantage of the rich ecosystem of Express middleware already out there and plug into the protocol layer of the pipeline.
  </p>
  
  <p>
    You will also be able to specify and chain together the MVP use cases declaratively through LoopBack policies. You will be able to specify policies at any layer within the pipeline, enabling you to meet use cases that require evaluation and actions throughout the system.
  </p>
  
  <h3>
    Policies
  </h3>
  
  <p>
    The API Gateway evaluates conditions and generates data in each layer of the pipeline and adds it to an API context at the individual request scope, the resource endpoint or even globally by user, machine, or other dimension. The information is continually and conditionally evaluated to generate actions. In general, the deeper within the layer, the more information added to the API context and the further down the request/response chain.
  </p>
  
  <p>
    <em>LoopBack policies</em> describe and govern the process of pipeline execution. A policy has three main components: a scope, a constraint, and an action. The API gateway’s functions are built on the backbone of the API gateway known as the <a href="https://github.com/strongloop/loopback/wiki/Policy-Framework">LoopBack Policy Framework</a>. LoopBack policies are first-class objects within the framework at the same level as models. The policy framework within LoopBack is attached to various objects within each pipeline layer.
  </p>
  
  <p>
    The LoopBack runtime continuously evaluates policies throughout each pipeline layer as part of API request handling. Policies in general for the system can be scheduled for all aspects of the system using this same foundation.
  </p>
  
  <h3>
    LoopBack Components
  </h3>
  
  <p>
    As LoopBack’s popularity has grown, community contributors have developed lots of terrific domain-level features. We started out with modules for mobile use cases, and there are ones for MBaaS features such as push notification, storage services, third-party login, and so on.
  </p>
  
  <p>
    <em>LoopBack Components</em> provide a standardized way to develop and provide plug-in features to the LoopBack framework. Components have an interface to expose models, datasources, configuration, and now policies to the LoopBack runtime. The current thinking is to break up the structure of LoopBack apps into discrete pieces of domain-level functionality and encapsulate them so they are easily separable and portable. The design is still in progress, but you can follow and participate in the discussion in the <a href="https://github.com/strongloop/loopback-example-component/wiki">LoopBack Component wiki</a>.
  </p>
  
  <h2>
    <strong> Summary </strong>
  </h2>
  
  <p>
    The open source LoopBack gateway provides key functionality that enables you to manually piece together middleware and specify your business rules through plain JavaScript hooks. The LoopBack API gateway serves as a reference implementation and will be limited to its current functionality. It currently fulfills the MVP use cases without components and policies.
  </p>
  
  <p>
    We expect that complex enterprises need to manage API endpoints at runtime, using the dynamic controls and additional functionality of components and policies provided by the StrongLoop API Gateway. It will provide the commercial-grade features and performance required for top-tier enterprise API management.
  </p>
  
  <h2>
    <a href="http://strongloop.com/get-started/"><strong>What’s next?</strong></a>
  </h2>
  
  <ul>
    <li style="margin-left: 2em;">
      <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js <a href="http://loopback.io/">LoopBack framework</a>. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
    </li>
  </ul>
</div>