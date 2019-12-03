---
layout: post
title: Going Cloud Native with LoopBack 4
date: 2019-12-03
author: Raymond Feng
permalink: /strongblog/going-cloud-native-with-loopback-4/
categories:
  - Community
  - LoopBack
published: true
---

When we build APIs and microservices nowadays, we choose a cloud as the target for deployment. Cloud has long gone beyond being just hosting providers. Infrastructures such as Docker and Kubernetes have completely changed the paradigm of how applications work and operate. To unleash the full power of cloud, there are a few important perspectives that require efforts to make your application cloud native. At LoopBack, we kicked off the journey to provide integration and guidance aligned with [CNCF](https://www.cncf.io/) to make your API and microservice applications cloud native throughout the life cycle. This blog summarizes what we have explored and achieved so far to illustrate how you can go cloud native with LoopBack 4.

<!--more-->

## Key Perspectives of Going Cloud Native

We have looked into the following areas to understand how to make a LoopBack application cloud native and assess what it takes to improve LoopBack framework to be a good citizen of the cloud ecosystem.

### Package and compose applications for cloud native deployment - Docker/Kubernetes/Helm

The [shopping example](https://github.com/strongloop/loopback4-example-shopping) started as a monolithic application in early versions. It has been refactored and improved over time to make the application modular.

We did some experiments to decompose `loopback4-example-shopping` into microservices, package them as Docker containers, and deploy them into a Kubernetes cluster. The whole story can be read at:

- https://github.com/strongloop/loopback4-example-shopping/tree/master/kubernetes

Key takeaways:

- Break down an application into multiple microservices
- Enable efficient communication between microserices
- Update the application to adapt to configuration for resources in the Kubernetes environment
- Build Docker images for each packages
- Organize deployment of docker containers as a single unit using an Helm chart
- Deploy to Minikube or IBM Cloud

### Enable developers to have end-to-end cloud native development and deployment - Kabanero/Appsody - LoopBack stack

Developers are often disconnected from the cloud environment during the development phase, with code only verified on a developer's local machine. Bad surprises may rise late in the cycle when deployment and tests happen in the cloud against that code.

[Kabanero](https://kabanero.io/) is created to address such concerns. The following is quoted from Kabanero's web site:

> Kabanero is an open source project focused on bringing together foundational open source technologies into a modern microservices-based framework. Developing apps for container platforms requires harmony between developers, architects, and operations. Today’s developers need to be efficient at much more than writing code. Architects and operations get overloaded with choices, standards, and compliance. Kabanero speeds development of applications built for Kubernetes while meeting the technology standards and policies your company defines. Design, develop, deploy, and manage with speed and control!

To learn how Kabanero works, check out https://kabanero.io/docs/ref/general/architecture-overview.html.

To bring the LoopBack offering to the Kabanero experience, we have introduced a [Appsody Stack for LoopBack 4](https://github.com/appsody/stacks/tree/master/incubator/nodejs-loopback).

The Node.js LoopBack stack extends the [Node.js stack](https://github.com/appsody/stacks/tree/master/incubator/nodejs) and provides a powerful solution to build open APIs and microservices in TypeScript with [LoopBack](https://loopback.io/), an open source Node.js API framework. It is based on [LoopBack 4](https://github.com/strongloop/loopback-next).

For more details, see https://github.com/appsody/stacks/tree/master/incubator/nodejs-loopback.

### Provide observability - health/metrics/tracing/logging

Observability is critical to the success of cloud native microservices. To make LoopBack a good citizen of Kubernetes based cluster, we have been rolling out extensions to integrate with health, metrics, tracing, and logging capabilities, based on projects at [CNCF](https://cncf.io).

- Released experimental features

  - Health readiness/liveness check endpoints: https://github.com/strongloop/loopback-next/tree/master/extensions/health
  - Metrics instrumentation and [Prometheus](https://prometheus.io/) reporting: https://github.com/strongloop/loopback-next/tree/master/extensions/metrics

- New features proposed

  - Distributed tracing with [Jaeger](https://www.jaegertracing.io/) - https://github.com/strongloop/loopback-next/tree/tracing/extensions/tracing
  - Distributed logging with [Fluentd](https://www.fluentd.org/) - https://github.com/strongloop/loopback-next/tree/logging/extensions/logging

### Allow graceful shutdown of Kubernetes Pods

LoopBack 4 applications hosted by Kubernetes Pods can be requested to shutdown per provisioning needs by the cluster. The life-cycle and hand-share are described in https://cloud.google.com/blog/products/gcp/kubernetes-best-practices-terminating-with-grace.

- Proposed features
  - Handle http keep-alive connections and allow graceful shutdown upon application.stop()
    - https://github.com/strongloop/loopback-next/pull/4146
  - Improve state transitions and allow shutdown hooks for applications
    - https://github.com/strongloop/loopback-next/pull/4145

### Summary

With the investigation and experiment, we were able to deploy `loopback4-example-shopping` as an application with cloud native microservices to a Kubernetes cluster hosted by IBM Cloud. The LoopBack stack for Kabanero/Appsody is released. There are also pull requests under reviews to close gaps and add new facilities. We're very excited that LoopBack 4 is going cloud native and we're even more interested in seeing LoopBack applications going cloud native with us. Please join us on the journey.

## What's Next?

LoopBack's success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Reporting issues](https://github.com/strongloop/loopback-next/issues).
- [Contributing](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md)
  code and documentation.
- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
