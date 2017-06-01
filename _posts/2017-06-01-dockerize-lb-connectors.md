---
layout: post
title: Dockerize LoopBack Connectors
date: 2017-06-01
author: Sakib Hasan
permalink: /strongblog/dockerize-lb-connectors/
categories:
  - Community
  - LoopBack
---

<!-- TOC -->

- [Introduction](#introduction)
- [Supported connectors](#supported-connectors)
- [How to spawn the container](#how-to-spawn-the-container)
- [Conclusion](#conclusion)

<!-- /TOC -->

## Introduction

As software developers, we are always looking for ways to ease the minimal effort required to complete a job effectively. [`Docker`](https://www.docker.com/), a tool, that allows packaging of an application and its dependencies into a virtual container for deployment, has stormed into the world of cutting edge technologies. 

It allows the end user to deploy both microservices and traditional apps anywhere without costly rewrites. Further allowing isolated apps in containers to eliminate conflicts and enhance security.

Docker provides images for almost all known commercial databases which could be pulled from the [`Docker Hub Registry`](https://hub.docker.com/) and used to spawn up local containers. Once the container for the respective database service is up and running, the user can use it for development/testing purposes and dispose it when done.

## Supported connectors
- SQL Connectors
    - [MySQL](https://github.com/strongloop/loopback-connector-mysql)
    - [PostgreSQL](https://github.com/strongloop/loopback-connector-postgresql)
    - [MSSQL](https://github.com/strongloop/loopback-connector-mssql)
    - [Oracle](https://github.com/strongloop/loopback-connector-oracle)
    - [IBM DB2](https://github.com/strongloop/loopback-connector-db2)
    - [IBM Informix](https://github.com/strongloop/loopback-connector-informix)

- No-SQL Connectors
    - [MongoDB](https://github.com/strongloop/loopback-connector-mongodb)
    - [IBM Cloudant](https://github.com/strongloop/loopback-connector-cloudant)

## How to spawn the container

Each of the above [connectors](#connectors-supported) have a bash script that can be used to setup the whole dockerization process.

Currently, the script is designed to support Linux and Unix based platforms only. In the future, we will be transitioning from bash scripts to javascript programs which shall be platform independent. The basic prerequisites required for running the script:
- Install [`Docker`](https://www.docker.com/)
- Install bash shell

For example, here is the [script](https://github.com/strongloop/loopback-connector-mysql/blob/master/setup.sh) for `MySQL`. To run the script, please follow the instructions below:
- Git clone the [repository](https://github.com/strongloop/loopback-connector-mysql)
- Change directory to the cloned repository and run `npm install` to get the required dependencies
- Run the script by either:
    - Sourcing it:
        - `source setup.sh`
    - Running the script and exporting the database specific environmental variables manually
        - `sh setup.sh`

For more information on how to run the customized shell script please read the docs on each respective repository.

For example, visit [How to run tests on MySQL](https://github.com/strongloop/loopback-connector-mysql#running-tests) for more information.

**Below is a snapshot of how to run the script to setup a docker for MySQL connector:**

![How To Run Docker Script For LB Connector](../blog-assets/2017/06/loopback-connector-docker.png)

## Conclusion

This new feature will allow our community contributors to come forward and use LoopBack even more. Thanks to Docker, it has never been any easier to contribute code in all LoopBack connector modules.

We in LoopBack would like to see more contributions from the external community; because YOU are what makes us what we are today!
