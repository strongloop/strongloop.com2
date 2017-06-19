---
layout: post
title: Dockerize LoopBack Connectors
date: 2017-07-01
author: Sakib Hasan
permalink: /strongblog/dockerize-lb-connectors/
categories:
  - Community
  - LoopBack
---

## Introduction

Data source connectors are a vital part of LoopBack that provide access to back-end data. Connectors typically provide access to an external database system.  However, setting up a database system for development can be a barrier because it can be difficult to:
- Download and install the database system.
- Set up the database.
- Isolate tests run against a database.

To remove this barrier, we need a simple way to set up and tear down a database service on request. [`Docker`](https://www.docker.com/) has gained popularity because it enables packaging an application and its dependencies into a virtual container for deployment, and it provides the perfect solution for this problem.

Docker provides images for almost all popular databases via the [`Docker Hub Registry`](https://hub.docker.com/).  You use these images to spawn local containers. Once the container for the  database service is up and running, you can use it for development and testing and easily dispose it when done.

<!--more-->

## Supported connectors

Each of the following connector modules has a bash script (typically called `setup.sh`) to set up a Docker container for the database:

- SQL connectors
    - [MySQL](https://github.com/strongloop/loopback-connector-mysql)
    - [PostgreSQL](https://github.com/strongloop/loopback-connector-postgresql)
    - [Microsoft SQL Server](https://github.com/strongloop/loopback-connector-mssql)
    - [Oracle](https://github.com/strongloop/loopback-connector-oracle)
    - [IBM DB2](https://github.com/strongloop/loopback-connector-db2)
    - [IBM Informix](https://github.com/strongloop/loopback-connector-informix)

- NoSQL connectors
    - [MongoDB](https://github.com/strongloop/loopback-connector-mongodb)
    - [IBM Cloudant](https://github.com/strongloop/loopback-connector-cloudant)
    - [Apache Cassandra](https://github.com/strongloop/loopback-connector-cassandra)

## How to spawn the container

The Docker setup script (`setup.sh`) is a Bash script that runs on platforms that support Bash, including many flavors Linux and MacOS. In the future, we plan to transition from Bash scripts to platform-independent JavaScript programs.

The prerequisites for running the script are:
- Install [`Docker`](https://www.docker.com/).
- If necessary, install Bash shell.  MacOS and many Linux systems come with a Bash shell.

For example, consider the [script](https://github.com/strongloop/loopback-connector-mysql/blob/master/setup.sh) for MySQL. To run the script:

- Git clone the [repository](https://github.com/strongloop/loopback-connector-mysql):
  ```
  git clone https://github.com/strongloop/loopback-connector-mysql.git
  ```
- Change directory to the cloned repository and run `npm install` to get the required dependencies:
  ```
  cd loopback-connector-mysql
  npm install
  ```
- Run the script one of two ways:
  - Use the `source` command:
    ```
    source setup.sh
    ```

  - Running the script and exporting the database specific environmental variables manually:
    ```
    sh setup.sh
    MYSQL_USERNAME=<username> MYSQL_PASSWORD=<password> MYSQL_DATABASE=<db_name> MYSQL_PORT=<port>
    ```

For more information on how to run the customized shell script, read the documentation in each repository.

For example, visit [How to run tests on MySQL](https://github.com/strongloop/loopback-connector-mysql#running-tests) for more information.

Here is an example of how to run the script to setup a Docker container for the MySQL connector:

![How To Run Docker Script For LB Connector](/blog-assets/2017/06/loopback-connector-docker.png)

## Conclusion

This new feature will enable community contributors to use, test, and develop LoopBack data source connectors more easily than ever. Thanks to Docker, it has never been easier to contribute code in all LoopBack connector modules.

Lowering barriers to entry improves the contribution experience for all, and we'd love to see your contributions in the future!

## What's next?

Loopback can help you get an API up and running in 5 minutes! [Here’s how](https://developer.ibm.com/apiconnect/2017/03/09/loopback-in-5-minutes/).


