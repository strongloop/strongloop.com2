---
layout: post
title: The OpenAPI Spec and You (and IBM)
date: 2017-08-03T09:40:15+00:00
author: Erin McKean
permalink: /strongblog/the-openapi-spec-and-you-and-ibm
categories:
  - Community
  - Open API Initiative
  - Open API Spec   
---
#The OpenAPI Spec and You (and IBM)

If you work with APIs at all, either creating or consuming them, you've probably heard of something called the [OpenAPI Specification](https://www.openapis.org/specification/repo) (or its former name, Swagger). However, you may be fuzzy on the details. Don't worry! By the end of this post you won't be. 

##What is this OpenAPI thing, anyway?

The OpenAPI Specification (OAS) is a way to describe your API so that all its resources and operations can be read by both humans and machines. 

Your OAS document can be in JSON or YAML. Once you have one, you can leverage all sorts of OAS-compliant tools to add really helpful functionality, including: 

* interactive API documentation 
* SDK generation
* testing and debugging

Also, describing your API with an OAS document makes it more likely that your API and your documentation remain in sync, reducing developer and user frustration!

The OpenAPI Specification is an open-source project of the [OpenAPI Initiative](https://www.openapis.org/), a vendor-neutral group that is one of the Linux Foundation’s Collaborative Projects. Members of the initative include 3Scale, Apigee, Capital One, Google, Intuit, Microsoft, PayPal, and, of course, IBM!

You can find the full OpenAPI Specification [here](https://github.com/OAI/OpenAPI-Specification). 

##How Do I Create An OAS definition?

A typical OAS document looks something like this: 

```yaml 
swagger: '2.0'
info:
  version: 1.0.0
  title: My Awesome API
  description: An Awesome API 
paths:
  /awesome:
    get:
      operationId: getAwesome
      description: Returns guaranteed awesome
      parameters: 
        name: flavor
        in: query
        required: false
        type: string              
      responses:
        200:
          description: Successful response 
```

You can write one by hand if you want, or you can use a number of open-source tools and editors to create one. (Check out [Swagger Editor](https://swagger.io/swagger-editor/) and [this tutorial series](https://apihandyman.io/writing-openapi-swagger-specification-tutorial-part-1-introduction/) for more tips.) 

If you are creating your API with [LoopBack](https://loopback.io), you can [export your OAS definition easily](https://strongloop.com/strongblog/generating-swagger-openapi-specification-from-your-loopback-application/).

###I Have an OAS Document ... Now What?

Once you have your OAS document, your options for exploring, testing, and debugging your API expand.

You can add an interactive API sandbox explorer with [swagger-ui](https://github.com/swagger-api/swagger-ui) (you might already be familiar with swagger-ui, as it's used in LoopBack). 

You can create SDKs easily with [swagger-codegen] (https://github.com/swagger-api/swagger-codegen). If you are using  IBM's Bluemix, this is [already available to you as a plugin](https://strongloop.com/strongblog/generate-client-sdk-loopback-bluemix-cli)!

You can [generate test code](https://github.com/apigee-127/swagger-test-templates), [confirm that your backend and your description are in sync](https://github.com/apiaryio/dredd), [check for breaking changes in your API](https://swagger.io/using-swagger-to-detect-breaking-api-changes/), or [integrate with any number of commercial tools](https://swagger.io/commercial-tools/), including [uploading your OAS document to API Connect](https://www.ibm.com/support/knowledgecenter/en/SSFS6T/com.ibm.apic.apionprem.doc/create_api_swagger.html).


##What's Next?

OAI Specification v3 has [been announced](https://www.openapis.org/blog/2017/07/26/the-oai-announces-the-openapi-specification-3-0-0). If you're interested in contributing, you can find more information [here](https://www.openapis.org/participate/how-to-contribute).
