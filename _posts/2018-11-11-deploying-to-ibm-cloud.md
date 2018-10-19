---
layout: post
title: Deploying LoopBack 4 applications to IBM Cloud
date: 2018-11-30
author: Hage Yaapa
permalink: /strongblog/deploying-to-ibm-cloud/
categories:
  - Community
  - LoopBack
published: false
---

LoopBack 4 applications can now run on IBM Cloud with some minimal code changes and configurations. We have created [a tutorial](https://loopback.io/doc/en/lb4/Deploying-to-IBM-Cloud.html) to help you get started. Go through it if you want to get experience deploying your application on IBM Cloud's Cloud Foundry.

<!--more-->

The tutorial covers configuring your application to use a local instance of Cloudant for the datasource when running locally, and a provisioned Cloudant sevice when the application is deployed to IBM Cloud.

Eventually we plan to support a much more seamless ability to deploy to IBM Cloud Kubernetes by generating the required artifacts and enabling built-in service discovery and integration. The implementation details will be worked out from the findings from this [spike issue](https://github.com/strongloop/loopback-next/issues/1606).

Deploying to IBM Cloud Kuberenetes will give you access to a wide array of services and capabilities that are desired for production-grade application deployment, you can learn more about it at [https://www.ibm.com/cloud/container-service](https://www.ibm.com/cloud/container-service).
