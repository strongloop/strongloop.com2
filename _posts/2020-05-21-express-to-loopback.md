---
layout: post
title: LoopBack - Taking Express to the Next Level
date: 2020-05-27 
author: Hage Yaapa
permalink: /strongblog/express-to-loopback/
categories:
  - Community
  - LoopBack
published: true
---

Express is the most popular Node.js package for web server development. Its lightweight, extensible, and flexible nature makes it a perfect fit for projects, small and large, from simple websites to complex web frameworks.

LoopBack is a framework built on top of Express. It comes packed with tools, features, and capabilities that enables rapid API and microservices development and easy maintenance.

In this post we will explore the points that make LoopBack a compelling choice for Express developers when it comes to API development.

<!--more-->

## Express and LoopBack Are Not Mutually Exclusive

First off, let's make it clear that Express and LoopBack are not mutually exclusive. You can very well use an existing Express app or middleware with LoopBack. This capability enables gradual migration from Express to LoopBack, that way you don't have to throw away your existing code and re-write everything from scratch. 

<img class="aligncenter size-full" src="{{site.url}}/blog-assets/2020/05/express-loopback.png"/>

### Extending an Existing Express Application With LoopBack

To use an existing Express app with LoopBack, you can mount the LoopBack app on your Express app.

For a tutorial on how to do that, refer to "[Creating an Express Application with LoopBack REST API](https://loopback.io/doc/en/lb4/express-with-lb4-rest-tutorial.html)".

### Using Express Middleware With LoopBack

LoopBack provides three broads ways for loading Express middleware.

#### 1. mountExpressRouter()

The `mountExpressRouter()` method of the [RestApplication](https://loopback.io/doc/en/lb4/apidocs.rest.restapplication.html) and [RestServer](https://loopback.io/doc/en/lb4/apidocs.rest.restserver.html) class mounts an express router or application at a path, and supports OpenAPI specification for describing the endpoints provided by the router. It is the preferred choice for mounting data endpoints, like an existing REST API app.

For more details refer to "[Mounting an Express Router](https://loopback.io/doc/en/lb4/Routes.html#mounting-an-express-router)".

#### 2. invokeMiddleware()

Express middleware can also be plugged into the [Sequence](https://loopback.io/doc/en/lb4/Sequence.html) class using the `invokeMiddleware()` action. This approach is recommended when you are not looking beyond a hard-coded list of middleware, when it comes to flexibility and configurability.

Refer to "[Use Express middleware within the sequence of actions](https://loopback.io/doc/en/lb4/Express-middleware.html#use-express-middleware-within-the-sequence-of-actions)" for more details.

#### 3. Middleware as Interceptors

Express middleware can act as interceptors to controller methods at global, class, or method levels. It is not as simple as the previous two methods, but it provides the most configurability.

The following helper methods from the `@loopback/express` package enable Express middleware to be wrapped into LoopBack interceptors.

- `toInterceptor` - Wraps an Express handler function to a LoopBack interceptor function
- `createInterceptor` - Creates a LoopBack interceptor function from an Express factory function with configuration
- `defineInterceptorProvider` - Creates a LoopBack provider class for interceptors from an Express factory function with configuration. This is only necessary that injection and/or change of configuration is needed. The provider class then needs to be bound to the application context hierarchy as a global or local interceptor.

Refer to "[Middleware](https://loopback.io/doc/en/lb4/Middleware.html)" and "[Use Express middleware as interceptors for controllers](https://loopback.io/doc/en/lb4/Express-middleware.html#use-express-middleware-as-interceptors-for-controllers)" for more information.

## What Does LoopBack Offer on Top of Express?

Express is a very extensible but bare-bones web server implementation. What LoopBack offers on top of Express is a set of tools and capabilities that make rapid API and microservices development possible and maintenance easy. REST API and microservices development with Express is possible but after a certain level of complexity, it can become a bug-ridden repetitive exercise for each new project. Using a REST API framework like LoopBack cuts down the development time and reduces maitenance headache.

Here are some of the points that makes LoopBack an excellent API development framework for Express developers.

### 1. REST API Specialist

LoopBack is specially crafted for REST API development. The framework's architecture, developer experience, and everything around it are designed primarily with REST API on mind.

#### i. Model-View-Controller (MVC) Pattern

[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) is a popular software design pattern that seprates the internal representation of data, implementation of access to this data, and what is presented to the client. This enables clear decoupling of the components that make up the application, which in turn leads to fewer bugs and better management of the development process.

LoopBack implements the MVC pattern. The models are defined in model files, controllers provide the REST API interface, and views are JSON objects returned by the controller. This not only allows modular development of the project, but also prevents the codebase from getting messy and unmanageable as the project grows.

#### ii. Repository Pattern

[Repository pattern](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/infrastructure-persistence-layer-design#the-repository-pattern) is an abstraction for data access logic. It is a great way to decouple data access details from models.

In LoopBack, model files define only the shape and properties of models, connection and queries are handled by repositories which are bound to the models.

#### iii. OpenAPI

LoopBack uses [OpenAPI specification](http://spec.openapis.org/oas/v3.0.3) for describing the data request and response formats. This highly descriptive standard specification greatly reduces the friction involved in the structural aspect of API development and consumption.

LoopBack exposes an OpenAPI specification file created out of the controllers in the app, which is essentially the documentation of the whole REST API of the app.

#### iv. CRUD

With a [datasource](https://loopback.io/doc/en/lb4/DataSources.html) defined and configured, once a model and its corresponding repository and controller are created, a [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) functionality is automatically available for the model without any additional work.

The auto-generated functionality and implementation can be modified by editing the controller and/or the respository files of the model.

#### v. Support for Numerous Databases

Configuring database connectivity and executing queries is one of the most crucial tasks when developing APIs. With the numerous database options available, writing optimal queries, and maybe even switching to a different database altogether can become a very tedious and time-consuming task.

LoopBack provides an abstraction for database access using [datasources](https://loopback.io/doc/en/lb4/DataSources.html). All you have to do is select the database you want to use for your app and provide the connectivity details. LoopBack then takes care of making the connection and running the queries in the context of a REST API implementation.

Any time you want to switch to a different database, it is just a matter to speciying a new datasource. You don't have to worry about re-writing the queries, LoopBack takes care of it for you.

The following datasources are supported by LoopBack: In-memory db, In-memory key-value, IBM Object Storage, IBM Db2 (for Linux, Unix, Windows), IBM Db2 for i, IBM Db2 for z/OS, IBM DashDB, IBM MQ Light, IBM Cloudant DB, Couchdb 2.x, IBM WebSphere eXtreme Scale key-value, Cassandra, gRPC, Redis, MongoDB, MySQL, PostgreSQL, OracleDB, Microsoft SQL, and z/OS Connect Enterprise Edition.

Non-database datasources supported by LoopBack includes: OpenAPI, REST services, SOAP webservices, Email, and ElasticSearch.

Community supported datasources includes: Couchbase, Neo4j, Twilio, Kafka, and SAP HANA.

This wide of array of datasources covers almost all the popular databases used for REST API development, which significantly reduces the development time and effort in the database department.

#### vi. Integration Capabilities With External APIs

Apart from using the non-database datasources provided by LoopBack, you can create your own [services](https://loopback.io/doc/en/lb4/Services.html) for connecting to external REST/SOAP/gRPC APIs.

These services can then be used in the controllers, effectively creating an OpenAPI-compliant proxy to those remote services. This usage scenario is perfect for proving a custom interface to an existing (legacy) API.

<img class="aligncenter size-full" src="{{site.url}}/blog-assets/2020/05/req-res-high-level.png"/>

### 2. Dependency Injection

Conventionally, dependencies are passed as function parameters. This method works fine if the dependency is used only in the invoked function, however it can get pretty complex and unwieldy in certain scenarios because the dependency parameter is a factor that prevents the caller and the called function from being [loosely coupled](https://en.wikipedia.org/wiki/Loose_coupling).

Imagine, a dependency is used within a function within a function within a function within a function. You will need to pass the dependency from the called function to the next function to the next function to the next function. Now imagine, the dependency has been changed to a different object in one or more places. You will now have to change it in the "top" function and all the places where it was being passed around. It is a mess.

Enter [dependency injection](https://en.wikipedia.org/wiki/Dependency_injection) (DI). Dependency injection enables dependent code to inject the dependencies themselves, instead of relying on the caller function to pass the dependency in function arguments. That way, any time something changes, it never includes the caller. The caller and called functions are loosely coupled.

LoopBack's [Context](https://loopback.io/doc/en/lb4/Context.html) object is a DI container. It makes it possible to inject dependencies in classes, properties, and methods without having to pass dependecies in constructor or method parameters.

The ability to use DI in your codebase can greatly improve the overall quality of code, increase development productivity, improve tests cases, and reduce maintenance costs.

### 3. Extensibility

LoopBack is designed to be highly extensible. It provides extensibility using different artifacts and patterns in different layers of the framework.

#### i. Sequence

The LoopBack [Sequence](https://loopback.io/doc/en/lb4/Sequence.html) class contains the whole request-response handling infrastructure of the framework, therefore the `Sequence` is the perfect place for implementing functionality that requires access to the beginning and the end of the request-response cycle - like logging, authentication, etc.

It is very easy to modify the existing functionality or add new ones by implementing a custom [SequenceHandler](https://loopback.io/doc/en/lb4/apidocs.rest.sequencehandler.html) for your app's `Sequence`. The `Sequence` file is located at `src/sequence.ts`.

#### ii. Components

[Components](https://loopback.io/doc/en/lb4/Components.html) are great for grouping different but related artifacts for implementing a feature or functionality in the app.

Components can contribute the following artifacts to the app:

- [Controllers](https://loopback.io/doc/en/lb4/Controllers.html)
- [Providers](https://loopback.io/doc/en/lb4/Services.html)
- [Classes](https://www.typescriptlang.org/docs/handbook/classes.html)
- [Servers](https://loopback.io/doc/en/lb4/Server.html)
- [Lifecycle observers](https://loopback.io/doc/en/lb4/Life-cycle.html)
- [Bindings](https://loopback.io/doc/en/lb4/Binding.html)

#### iii. Extensions

[Extension points and extensions](https://loopback.io/doc/en/lb4/Extension-point-and-extensions.html) are the interfaces for developing plugins for LoopBack apps. It is an excellent pattern for adding decoupled extensibility to a software system.

LoopBack provides the following helper decorators and functions for implementating extension points and extensions on top of its [Inversion of Control](https://loopback.io/doc/en/lb4/Context.html) and [Dependency Injection](https://loopback.io/doc/en/lb4/Dependency-injection.html) container.

- `@extensionPoint` - decorates a class to be an extension point with an optional custom name
- `@extensions` - injects a getter function to access extensions to the target extension point
- `@extensions.view` - injects a context view to access extensions to the target extension point. The view can be listened for context events.
- `@extensions.list` - injects an array of extensions to the target extension point. The list is fixed when the injection is done and it does not add or remove extensions afterward.
- `extensionFilter` - creates a binding filter function to find extensions for the named extension point
- `extensionFor` - creates a binding template function to set the binding to be an extension for the named extension point(s). It can accept one or more extension point names to contribute to given extension points
- `addExtension` - registers an extension class to the context for the named extension point

#### iv. Life Cycle Observers

[Life cycle observers](https://loopback.io/doc/en/lb4/Extension-life-cycle.html) are artifacts that can take part in the starting and stopping processes of the application. They can execute code as the app is starting (such as configuring something) or is shutting down (such as closing the connection to a server).

#### v. Servers

The LoopBack REST API server is just one of the many possible server capabilities of LoopBack. LoopBack can start multiple [servers](https://loopback.io/doc/en/lb4/Creating-servers.html) together of similar or different implementations, making LoopBack an excellent microservices hub. You can use this to create your own implementations of REST, SOAP, gRPC, MQTT and more protocols. For an overview, see [Server](https://loopback.io/doc/en/lb4/Server.html).

#### vi. Interceptors

LoopBack supports [Interceptors](https://loopback.io/doc/en/lb4/Interceptors.html). They are reusable functions to provide [aspect-oriented](https://en.wikipedia.org/wiki/Aspect-oriented_programming) logic around method invocations. There are many use cases for interceptors, such as:

a. Add extra logic before / after method invocation, for example, logging or measuring method invocations.
b. Validate/transform arguments
c. Validate/transform return values
d. Catch/transform errors, for example, normalize error objects
e. Override the method invocation, for example, return from cache

For more details about extensibility in LoopBack, refer to "[Extending LoopBack 4](https://loopback.io/doc/en/lb4/Extending-LoopBack-4.html)".

### 4. Authentication and Authorization

Authentication and authorization form the basis of securing and controlling access to protected resources, and is a requirement for any app that deals with protected data. Authentication is responsible for verifying the user's identity before allowing access to a protected resource. Authorization is responsible for deciding if a user can perform a certain action on a protected resource or not.

LoopBack comes with an [authentication component](https://loopback.io/doc/en/lb4/apidocs.authentication.html), which enables developers to plug in different authentication strategies (custom and standard) to the app. It also supports all the [Passport](http://www.passportjs.org/) authentication strategies.

You can read more about authentication in LoopBack in the [authentication doc](https://loopback.io/doc/en/lb4/Loopback-component-authentication.html).

LoopBack's [authorization component](https://loopback.io/doc/en/lb4/apidocs.authorization.html) is a highly configurable authorization system, which allows you to write your own authorization rules or use an existing one.

All the details about authorization in LoopBack can be found in the [authorization doc](https://loopback.io/doc/en/lb4/Loopback-component-authorization.html).

### 5. Great command-line Tools

Datasources, models, controllers, repositories are great for modularizing the app, but manually creating the files and writing repetitive code with minimal differences for each new entity would be a tedious time-consuming activity.

LoopBack comes with a utility command-line tool, [lb4](https://www.npmjs.com/package/@loopback/cli). It has commands for generating datasources, models, controllers, repositories, and other LoopBack artifacts so that you don't have to create them manually.

Given a datasource, the `discover` command can generate models files from the database. This can be a great time saver if you are using an existing database of your LoopBack app, and especially if the database had a lot of tables with many columns (or their equivalent structures). If an OpenAPI specification is provided, the `openapi` command will not only create the model files, it will also create the controller files. This can save even more time.

Refer to the [documentation](https://loopback.io/doc/en/lb4/Command-line-interface.html) for all the details about the `lb4` command.

### 6. TypeScript Support

LoopBack is a [TypeScript](https://www.typescriptlang.org/) framework. TypeScript is a typed superset of JavaScript.

Although not directly a LoopBack feature, using a typed language for development prevents many bugs and steers developers towards using optimized coding practices. This can make a significant difference in the development and maintenance efforts when compared to using plain JavaScript.

### 7. The IBM Confidence

LoopBack is an open source project backed by IBM, used by IBM products and customers. Hopefully, this gives you assurance on the quality and the longevity of this framework.

## Call to Action

In 2020, we look forward to helping you and seeing you around! LoopBack's success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Here's how you can join us and help the project:

- [Report issues](https://github.com/strongloop/loopback-next/issues).
- [Contribute](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md) code and documentation.
- [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Join](https://github.com/strongloop/loopback-next/issues/110) our user group.
