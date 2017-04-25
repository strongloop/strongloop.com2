---
id: 27305
title: Managing LoopBack Configurations the Twelve-Factor Way
date: 2016-05-03T08:30:15+00:00
author: David Cheung
guid: https://strongloop.com/?p=27305
permalink: /strongblog/managing-loopback-configurations-the-twelve-factor-way/
categories:
  - How-To
  - LoopBack
---
Managing Loopback configuration files for multiple environments can be a hassle. In this blog we demonstrate how we do it using some well-known practices for scalable and maintainable codebases from the [The Twelve-Factor App](http://12factor.net/config) methodology. The key ideas are around storing configurations in environment variables rather than grouping configurations in a named group or polluting the codebase with configurations and constants.

<!--more-->

Advantages of using environment variables for configuration management include:

  * Enables decoupling of named environment groups and provides more granular control (for example, staging, production, development). 
      * With the named groups approach, when a project grows, you may end up having multiple sets of configurations in each of deployment, which can slowly become messy.
  * Avoids leakage of credentials; because environment variables are per-deployment, it lowers the chance of someone accidentally committing their credentials to a codebase. 
      * Having environment independent of the codebase also helps to enforce separation between codebase and configurations.
  * Makes it easy to work with cloud platforms such as Bluemix and Heroku. 
      * Modern cloud platforms often provide tools to assist with environment variable management (for example,foreman, internal settings)
      * There are multiple ways to set environment variables.
  * Eliminates maintaining many sets of configuration files.

This rest of the blog outlines the use of connection-strings and dynamic configurations in Loopback and how it can apply to cloud deployment platforms such as Heroku and IBM BlueMix.

## Connection-string in LoopBack-connectors

As you may already know, connectors such as MongoDB have support for [connection-string](https://docs.strongloop.com/display/LB/MongoDB+connector#MongoDBconnector-Replicasetconfiguration). Connection-string allows configurations to be described in a URI schema passed to the database driver to initiate the connection. The following examples are both valid formats to initiate a connection for LoopBack datasources.

Connecting to database via `connection-string`:

```js
//datasources.json
{
  "db": {
    "name": "db",
    "url": "mongodb://root:@localhost:27017/mydatabase",
    "connector": "mongodb"
  }
}
```

Connecting to database via `credentials`:

```js
//datasources.json
{
  "db": {
    "name": "db",
    "host": "localhost",
    "port": 27017,
    "database": "mydatabase",
    "connector": "mongodb"
  }
}
```

### How to override

In the event both the connection-string and the default credentials (host, port, username, password, and so on) are present, the connection-string takes precedence. This behavior along with dynamic configurations enables you to maintain one datasources.json while supporting both deployment and development environments.

### Connection-strings in LoopBack

The following table provides details of the connection-string format for each LoopBack connector.

<table style="width:auto;margin:0">
  <tr>
    <td>
      <b>Data source</b>
    </td>
    
    <td>
      <b>Property</b>
    </td>
    
    <td>
      <b>Connection String Format</b>
    </td>
    
    <td>
      <b>Notes</b>
    </td>
  </tr>
  
  <tr>
    <td>
      DB2
    </td>
    
    <td>
      dsn
    </td>
    
    <td>
      DATABASE=<database>;HOSTNAME=<host>;PORT=<port>;PROTOCOL=TCPIP;UID=<uid>;PWD=<pwd>
    </td>
    
    <td>
    </td>
  </tr>
  
  <tr>
    <td>
      Cloudant
    </td>
    
    <td>
      url
    </td>
    
    <td>
      https://<username>:<password>@<host>
    </td>
    
    <td>
      The url property does not override the field database. You still must specify database.
    </td>
  </tr>
  
  <tr>
    <td>
      Mongodb
    </td>
    
    <td>
      url
    </td>
    
    <td>
      mongodb://<username>:<password>@<host>:<port>/<database>
    </td>
    
    <td>
      Credentials are converted to aurl to initiate connection.
    </td>
  </tr>
  
  <tr>
    <td>
      MySQL
    </td>
    
    <td>
      url
    </td>
    
    <td>
      mysql://<username>:<password>@<host>/<database>?<option_name>=<opt_value>
    </td>
    
    <td>
      See <a href="https://github.com/felixge/node-mysql#connection-options">MySQL url format</a> for details.
    </td>
  </tr>
  
  <tr>
    <td>
      PostgreSQL
    </td>
    
    <td>
      url
    </td>
    
    <td>
      postgres://<username>:<password>@<host>/<database>
    </td>
    
    <td>
      See <a href="https://github.com/brianc/node-postgres#client-pooling">PostgreSQL url format</a> for details.
    </td>
  </tr>
  
  <tr>
    <td>
      MSSQL
    </td>
    
    <td>
      url
    </td>
    
    <td>
      mssql://<username>:<password>@<host>:<port>/<database>?<option_name>=<opt_value>
    </td>
    
    <td>
      See <a href="https://github.com/patriksimek/node-mssql#formats">MsSQL url format</a> for details.
    </td>
  </tr>
  
  <tr>
    <td>
      Oracle
    </td>
    
    <td>
      tns
    </td>
    
    <td>
      DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=<host>)(PORT=<port>))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=<database>))
    </td>
    
    <td>
      You must also provide tns, userand password. See <a href="https://github.com/joeferner/node-oracle#alternative-connection-using-tns">Oracle connection using tns</a> for details.
    </td>
  </tr>
</table>

&nbsp;

### Extending dynamic configurations to datasources.json

You may be already familiar with middleware dynamically parsing /api from config.json, this functionality is now also available for datasources.json. Users now have the ability to provide these parameters through environment-variables as well as through config.json, and the format remains the same: ${<string>}.

### Dynamic Variable Precedence

  * Environment variables
  * app.get() (set values in config.json or with app.set())
  * If both are unresolvable, undefined will be returned



## Deployment

Because of the priority scheme of dynamic configurations, you now have multiple options to override the settings with a dynamic connection-string and the ability to fallback to static configurations. You no longer have to commit configurations to version control or manage multiple copies of datasources.json for different deployment platforms. See configuration below:

```js
//datasources.json
{
  "mysql": {
  "name": "mysql",
  "connector": "mysql",
  "url":"${MYSQL_CONNECTION_STRING}",
  "host":"localhost",
  "username":"root",
  "password":"admin",
  "port":3306,
  "database":"local-test"
  }
}
```

The above snippet is an example of how you can configure your datasources.json file, and without changing the file you can support both your production and development&#8217;s connection credentials with one set of configurations. Continuing are some examples of how you can define and override the dynamic configuration, in our example the variable is ${MYSQL\_CONNECTION\_STRING}.

### Setting environment variables on your deployment platform

Environment variables can be set in different ways depending on your deployment platform.

#### **Bluemix**

Define environment variables in Bluemix as shown here:

[<img class="aligncenter size-medium wp-image-27316" src="https://strongloop.com/wp-content/uploads/2016/04/bluemix-envvars-300x123.png" alt="bluemix-envvars" width="300" height="123" srcset="https://strongloop.com/wp-content/uploads/2016/04/bluemix-envvars-300x123.png 300w, https://strongloop.com/wp-content/uploads/2016/04/bluemix-envvars-1030x422.png 1030w, https://strongloop.com/wp-content/uploads/2016/04/bluemix-envvars-705x289.png 705w, https://strongloop.com/wp-content/uploads/2016/04/bluemix-envvars-450x184.png 450w, https://strongloop.com/wp-content/uploads/2016/04/bluemix-envvars.png 1047w" sizes="(max-width: 300px) 100vw, 300px" />](https://strongloop.com/wp-content/uploads/2016/04/bluemix-envvars.png)

#### **Heroku**

You can define environment variables in Heroku as settings as shown here:

[<img class="aligncenter size-medium wp-image-27317" src="https://strongloop.com/wp-content/uploads/2016/04/heroku-envvar-settings-300x110.png" alt="heroku-envvar-settings" width="300" height="110" srcset="https://strongloop.com/wp-content/uploads/2016/04/heroku-envvar-settings-300x110.png 300w, https://strongloop.com/wp-content/uploads/2016/04/heroku-envvar-settings-845x313.png 845w, https://strongloop.com/wp-content/uploads/2016/04/heroku-envvar-settings-705x258.png 705w, https://strongloop.com/wp-content/uploads/2016/04/heroku-envvar-settings-450x165.png 450w, https://strongloop.com/wp-content/uploads/2016/04/heroku-envvar-settings.png 855w" sizes="(max-width: 300px) 100vw, 300px" />](https://strongloop.com/wp-content/uploads/2016/04/heroku-envvar-settings.png)

You can also define environment variables with `.env` file; for example:

```js
##.env
MYSQL_CONNECTION_STRING=mysql://&lt;username&gt;:&lt;password&gt;@&lt;host&gt;:3306/dbname
```

### Setting environment variables at runtime

You can also set environment variables when you run your app; for example:

```js
MYSQL_CONNECTION_STRING=mysql://&lt;username&gt;:&lt;passwd&gt;@&lt;host&gt;:3306/dbname node
```

### Application settings in config.json

When an environment variable is not set, you can assign application settings in config.json, which you can then access in your app with `app.get():`

```js
//config.json
{
  "MYSQL_CONNECTION_STRING": "mysql://&lt;username&gt;&lt;password&gt;@&lt;host&gt;3306/dbname"
  //this gets resolved via `app.get('MYSQL_CONNECTION_STRING')`
}
```

## Summary

With dynamic configurations for datasources and connection-string support for more connectors, you now have a better and cleaner way to manage your application&#8217;s configurations. Here we saw how to use the 12-factor methodology to build microservices using [Loopback](http://loopback.io). You can also go the rest of the way, deploy and manage your services using [API Connect](https://developer.ibm.com/apiconnect/).