---
layout: post
title: Learning LoopBack4 Interceptors (Part 2) - Method Level and Class Level Interceptors
date: 2019-09-10
author: Diana Lau
permalink: /strongblog/loopback4-interceptors-part2/
categories:
  - LoopBack
  - Community
published: false
---

[Previously](https://strongloop.com/strongblog/loopback4-interceptors-part1/), we looked at how to add a global interceptor. In this article, we are going to build an application that validates the incoming request using class level and method level interceptors 

For the complete application, you can go to this repo: https://github.com/dhmlau/loopback4-interceptors

<!--more-->

## Let's Build a Simple Order App

If you want to skip this part, you can check out the `orginal-app` branch of this github repo: https://github.com/dhmlau/loopback4-interceptors/tree/original-app.

If you want to follow along, follow these steps.

1. Scaffold the app by calling `lb4 app loopback4-interceptors --yes`

2. In the newly created project, create a file called `order.json` with the following content:

    ```json
    {
    "name": "Order",
    "base": "Entity",
    "properties": {
        "orderNum": {
            "type": "string",
            "id": true,
            "required": true
        },
        "customerNum": {
            "type": "string",
            "required": true
        },
        "customerEmail": {
            "type": "string",
            "required": true
        },
        "total": {
            "type": "number",
            "required": true
        }
    }
    }
    ```

3. Create the Order model by providing the above json file. Run `lb4 model --config order.json --yes`

4. Create a DataSource with the in-memory connector. Run `lb4 datasource ds`.  Then select "In-memory db" as the type of connector. 

5. Create a Repository and accept all defaults by running `lb4 repository` command.

6. Finally, create a controller. Follow the prompts as below:
```
$ lb4 controller
? Controller class name: Order
Controller Order will be created in src/controllers/order.controller.ts
? What kind of controller would you like to generate? REST Controller with CRUD functions
? What is the name of the model to use with this CRUD repository? Order
? What is the name of your CRUD repository? OrderRepository
? What is the type of your ID? string
? What is the base HTTP path name of the CRUD operations? /orders

   create src/controllers/order.controller.ts
   update src/controllers/index.ts

Controller Order was created in src/controllers/
```

You now have a LoopBack application ready to run.

## Creating Interceptor Function for Validation

What we're doing here is to validate user inputs at the REST layer. Note that in real world, you should also consider validate data at the Repository level to ensure the validation is applied even when modifying data from places outside of controllers, e.g. tests or services running in background.

For the `POST /order` endpoint, we are going to validate the order before actually creating the order. The length of `orderNum` has to be 6, otherwise the order is not valid. 

Let's define the interceptor function in the `OrderController` class just before the class is defined. 

In `src/controllers/order.controller.ts`, 
1. Add this statement:
    ```ts
    import {intercept, Interceptor} from '@loopback/core';
    ```

2. Add the following function to validate order.  
    ```ts
    const validateOrder: Interceptor = async (invocationCtx, next) => {
        console.log('log: before-', invocationCtx.methodName);
        const order: Order = new Order();
        if (invocationCtx.methodName == 'create')
            Object.assign(order, invocationCtx.args[0]);
        else if (invocationCtx.methodName == 'updateById')
            Object.assign(order, invocationCtx.args[1]);

        if (order.orderNum.length !== 6) {
            throw new HttpErrors.InternalServerError('Invalid order number');
        }
       
        const result = await next();
        return result;
    };
    ```

## Apply `@intercept` Decorator at the Method Level

After defining the interceptor function, you can now use this as a method-level or class-level decorator. For class-level interceptor, you just apply it on the class, i.e.

```ts
@intercept(validateOrder)
export class OrderController {
    //...
}
```

However, we want the validation to run only when the order is being created, so the `@intercept` decorator will be applied at the method level. To do this, add the `@intercept` decorator on the method I want to intercept, i.e. the `POST` method:

    ```ts
    @intercept(validateOrder) // <--- add here
    @post('/orders', {
        responses: {
        '200': {
            description: 'Order model instance',
            content: {'application/json': {schema: {'x-ts-type': Order}}},
        },
        },
    })
    async create(@requestBody() order: Order): Promise<Order> {
    ```

## Let's Do Some Experiment! 

Now that the application is ready to go, start the app by running `npm start` command and go to the API Explorer: http://localhost:3000/explorer.


### Calling `GET /orders/count`

Since this method doesn't have the interceptor, when this endpoint is being called, there shouldn't be anything printed to the log. 

### Calling `POST /orders`

This is the method where the interceptor is applied to validate the order. Let's give it a try with a valid order.
``` 
{
  "orderNum": "111111",
  "customerNum": "12345",
  "customerEmail": "aa@abc.com",
  "total": 100
}
```
You should expect to get the HTTP 200 response code that the order has been created successfully.

Now try another order with `orderNum` is `11`. 
``` 
{
  "orderNum": "11",
  "customerNum": "67890",
  "customerEmail": "bb@abc.com",
  "total": 1000
}
```
You should expect a HTTP 500 error with message saying "Internal Server Error".

## Resources 

- Interceptor docs page, https://loopback.io/doc/en/lb4/Interceptors.html
- Caching enabled via interceptors in Greeter application, https://github.com/strongloop/loopback-next/tree/master/examples/greeting-app
- Authorization added using interceptors in this tutorial, https://strongloop.com/strongblog/building-an-online-game-with-loopback-4-pt4/

## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Reporting issues](https://github.com/strongloop/loopback-next/issues).
- [Contributing](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md)
  code and documentation.
- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Joining](https://github.com/strongloop/loopback-next/issues/110) our user group.
