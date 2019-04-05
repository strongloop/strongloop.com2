---
layout: post
title: LoopBack 4 March 2019 Milestone Update
date: 2019-04-05
author: Janny Hou
permalink: /strongblog/march-2019-milestone/
categories:
  - Community
  - LoopBack
published: false
---

March is a very productive month as we landed an outstanding number of code contributions: 63 PRs merged in total, and 10 out of them are from the community. Cheers! The team has been able to make good progress of the epics we are focusing on, like LB3 to LB4 migration, adding `@loopback/context` features, JavaScript experience, the authentication system, and describing model properties to be more flexible. Read more to see the details of our achievements in March.

<!--more-->

## Migration from LoopBack 3 to LoopBack 4

We started to incrementally work on the migration stories created from the PoC [PR](https://github.com/strongloop/loopback-next/pull/2318). This month we implemented the Express router to allow LoopBack 4 app developers to add arbitrary set of Express routes and provide OpenAPI specifications. You can call `mountExpressRouter` on either the app level or the rest server level to mount external routes. For details please check the [router's documentation](https://loopback.io/doc/en/lb4/Routes.html#mounting-an-express-router).

## Extension pattern example

As a framework built on top of the IoC(Inversion of Control) and DI(Dependency Injection), the [extension point](https://wiki.eclipse.org/FAQ_What_are_extensions_and_extension_points%3F) is commonly used in LoopBack 4 to declare contracts for extension contributors to plug-in components. The existing usages of extension point include the request body parser and the boot strapper. It is also needed for supporting multiple authentication strategies. Check out the [greeter extension point](https://github.com/strongloop/loopback-next/tree/master/examples/greeter-extension) to learn the best practice of registering an extension point along with its extensions. 

## Context improvement

The discussion and review of a series of context enhancement PRs keeps moving. This month we landed the PR that implemented the context view feature. A context view is created to track artifacts and is able to watch the come and go bindings. More details could be found in the [Context document](https://loopback.io/doc/en/lb4/Context.html#context-view).

We have also enforced the dependency injection for bindings with the `SINGLETON` scope to make sure their dependencies can only be resolved from the owner context and its ancestors, but **NOT** from any of the child contexts. This is required as the value for a singleton binding is shared in the subtree rooted at the context where the binding is contained. Dependencies for a singleton cannot be resolved from a child context which is not visible and it may be recycled. See [the Dependency Injection documentations](https://loopback.io/doc/en/lb4/Dependency-injection.html#dependency-injection-for-bindings-with-different-scopes) for more details.

Now users could specify the scope in the `@bind` decorator when annotating an artifact class with `@bind`.
The application level bindings are improved by honoring more configurations in the `@bind` decorator. Now users could specify the binding scope and the namespace of tags as the inputs of `@bind`. Details could be found in [the binding document](https://loopback.io/doc/en/lb4/Binding.html#configure-binding-attributes-for-a-class).

## Relations

We solved the self relation issue and created corresponding test cases as the reference usage. You can check [the documentation for handling recursive relations](https://loopback.io/doc/en/lb4/BelongsTo-relation.html#handling-recursive-relations) to learn how to create a `hasMany` and `belongsTo` relation to the same entity.

## Authentication and Authorization

Before writing the extension point for plugging in different authentication strategies, we decided to do some investigation of the popular authentication mechanisms and adopted the user scenario driven development. This is to make sure the abstractions for services are common enough. The design documents for our authentication system could be found [here](https://github.com/strongloop/loopback-next/blob/master/packages/authentication/docs/authentication-system.md). The document begins with illustrating a LoopBack 4 application that supports multiple authentication approaches and finally divides the responsibilities among different artifacts. The abstractions we created in March are two interfaces for the user service and the token service in `@loopback/authentication`.

## Inclusion of related models

The initial inclusion spike left us a question: how to distinguish the navigational property from the normal model properties? This month we had a PoC to demonstrate describing the navigational model properties with a new interface along with how to generate the corresponding OpenAPI schema.

The proposed solution has two major parts:

1. At TypeScript level, we will introduce a new interface to describe navigational properties and a new type to describe data object holding both own properties and navigational properties. For example, when a `Category` model has many `Product` instances:

    ```ts
    // Navigation properties of the Category model.
    interface CategoryRelations {
      products?: ProductWithRelations[];
	  }
    
    // Category's own properties and navigation properties.
    export type CategoryWithRelations = Category & CategoryRelations;
    ```
    
2. When decorating controller methods with OpenAPI metadata, we need to include navigational properties in the schema generated from the model definition. This will be achieved by replacing `x-ts-type` extension with a call of a new helper function `getModelSchemaRef` with a new flag `includeRelations`:

    ```diff
     schema: {
       type: 'array',
    -   items: {'x-ts-type': Category},
    +   items: getModelSchemaRef(Category, {includeRelations: true})
       },
     }
    ```

   Under the hood, `getModelSchemaRef` will create a new OpenAPI Schema describing both own and navigational properties of the given model and give the schema a unique title so that we can reference it from multiple places.
    
Please check [PR 2592](https://github.com/strongloop/loopback-next/pull/2592) for more details and the discussions we had. And the [follow-up stories](https://github.com/strongloop/loopback-next/issues/2152#issuecomment-475575548) are created as our next target.

## Partial update

While researching options for describing navigational model properties, Miroslav realized that the proposed solution is easy to extend to support other kinds of schema generated from model.

1. To describe request body of a `PATCH` request, we can introduce a new `getModelSchemaRef` flag called `partial`:

    ```ts
    schema: getModelSchemaRef(Category, {partial: true}),
    ```

   At TypeScript level, such data object can be described using TypeScript's `Partial` type:
   
   ```ts
   obj: Partial<Category>
   ```
   
2. To exclude certain properties from `POST` request (e.g. `id` that will be generated by the database), we can introduce another new flag called `exclude`:

    ```ts
    schema: getModelSchemaRef(TodoList, {exclude: ['id']}),
    ```
    
    At TypeScript level, such data object can be described using `Pick` and `Exclude` types:
  
    ```ts
    obj: Pick<TodoList, Exclude<keyof Category, 'id'>>
    ```

Once these two new flags are implemented, we will be able to fix validation of request bodies to correctly enforce required properties for operations like `POST` & `PUT`, and treat all properties as optional for `PATCH` operations.

You can find more details in [PR 2646](https://github.com/strongloop/loopback-next/pull/2646), the follow-up stories are outlined [here](https://github.com/strongloop/loopback-next/pull/2646#issuecomment-477503186).


## JavaScript Experience

After a thorough exploration and discussion of writing the LoopBack 4 application in Javascript, this month we summarized our findings and achievements in blog [loopback4-javascript-experience](https://strongloop.com/strongblog/loopback4-javascript-experience/). It talks about the LoopBack 4 artifacts that we are able to create in JavaScript and also the limitations. A plan of subsequent stories is included in the blog.

## Other Updates

* LoopBack 3 improvement: Now we allow people to define a model property called `type` instead of having `type` as a preserved word. [Link](https://github.com/strongloop/loopback/issues/4131)

* We added the steps to call SOAP services by running `lb4 service`, see the [document for calling other APIs](https://loopback.io/doc/en/lb4/Calling-other-APIs-and-web-services.html). 

* There have been several conference and meet-up events happened over the last year, so we added a new section "Presentations" in the [resources page](https://v4.loopback.io/resources.html) to display the videos.

* Add operationId based on the controller and method names. [Link](https://github.com/strongloop/loopback-next/pull/2533)

* Make sure the `basePath` is included in the url of `RestServer`. [Link](https://github.com/strongloop/loopback-next/pull/2560)

## Community Contributions

Here is a summary of the contributions from community in March. We appreciate all your attention and help!

* Added the `PATCH` and `DELETE` method for the `HasOne` relation. [Link](https://github.com/strongloop/loopback-next/commit/5936fb9c7224a024f7d406e8f05894cce460a4d4)
* Support specifying the type of nested properties as a model. [Link](https://github.com/strongloop/loopback-next/commit/d298ec898f3c52224a1844c5e41f0d52cd7ff569)
* Allow the model's id property to be a number for supporting the composed key. [Link](https://github.com/strongloop/loopback-next/commit/71292e9ac1b3d89ebfe284a659264cbb83dbe814)
* Update the mocha configuration in `@loopback/build`. [Link](https://github.com/strongloop/loopback-next/commit/c3d800700b253e97316fd0871641ea80fcb457f3)

## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Reporting issues](https://github.com/strongloop/loopback-next/issues).
- [Contributing](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md)
  code and documentation.
- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Joining](https://github.com/strongloop/loopback-next/issues/110) our user group.
