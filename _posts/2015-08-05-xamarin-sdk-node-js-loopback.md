---
id: 25643
title: Introducing the Xamarin SDK for LoopBack
date: 2015-08-05T07:40:31+00:00
author: Al Tsang
guid: https://strongloop.com/?p=25643
permalink: /strongblog/xamarin-sdk-node-js-loopback/
categories:
  - Community
  - How-To
  - LoopBack
  - Mobile
---
When we started the [open source LoopBack project](http://loopback.io/) two years ago, we knew that its use would be fueled by the needs of mobile solutions. We were a very small team and only able to develop for iOS, Android, and AngularJS. Although we were keenly interested in the meteoric rise of Xamarin as a cross-platform solution, we just didn&#8217;t have the resources to do anything about it.

But then we got lucky. Really, really lucky.

## **Introducing PerfectedTech**

I&#8217;d like to introduce [PerfectedTech](http://perfectedtech.com/), StrongLoop’s premier mobile consultancy partner.

PerfectedTech is a boutique software development agency with an R&D office in Jerusalem. They are a highly successful firm due to their technical excellence, great sense of style, and solid delivery of mobile and web app solutions. Unlike many development agencies, PerfectedTech has chosen to focus only on a few powerful technologies: Xamarin on the front end and Node.js / LoopBack on the backend. From their in-house built tools, including the Xamarin SDK, they have managed to cut traditional development time by 33% to 50% for all full stack projects, dramatically challenging industry norms. Their vision is the same as StrongLoop: to create solutions that make development effortless, yet powerful.

They are well-versed in many technology solutions. As a result, they quickly saw the potential of combining Xamarin and LoopBack, and invested their own time and resources to develop the Xamarin SDK for LoopBack. Applying real-life use cases, understanding constraints, and applying best practices, they engineered a battle-proven SDK that they leverage in all their mobile projects. We&#8217;re grateful that they have agreed to contribute it back to the LoopBack and Node communities as an open source module under the MIT-license like the rest of our SDKs. Moving forward, they’ll continue to add value to the SDK and guide community contributions. The SDK will help bring two wonderful technologies, Xamarin and Loopback, closer together.

## **LoopBack Xamarin SDK**

The [Xamarin SDK](https://github.com/strongloop/loopback-sdk-xamarin) is similar to the [AngularJS SDK](https://github.com/strongloop/loopback-sdk-angular): You start with a LoopBack backend application with models and APIs. Then you run the SDK CLI tool against the LoopBack project to generate a dynamically-built library in either C# or DLL form with strong type objects. Auto-generated strong type objects are enough to make any developer smile. You can then include them in your Xamarin project and/or solution to get seamless access to your models and remote logic as native Xamarin objects. As you evolve your backend, you can dynamically and continuously run the SDK to update the library as needed while significantly reducing the time required for integration.

For more information, see the [LoopBack Xamarin SDK documentation](http://docs.strongloop.com/display/public/LB/Xamarin+SDK). Check out this code snippet from dynamically-generated XamarinSDKGenerator.dll for the Todo Example app generated from LoopBack models using the lb-xm tool.

<!--more-->

```js
public class TodoTasks : CRUDInterface<TodoTask>
        {

            /*
             * Find a related item by id for TodoTask.
             */
            public static async Task<TodoTask> findByIdForuser(string id, string fk)
            {
                string APIPath = "users/:id/TodoTask/:fk";
                IDictionary<string, string> queryStrings = new Dictionary<string, string>();
                string bodyJSON = "";
                APIPath = APIPath.Replace(":id", (string)id);
                APIPath = APIPath.Replace(":fk", (string)fk);
                var response = await Gateway.PerformRequest<TodoTask>(APIPath, bodyJSON, "GET", queryStrings).ConfigureAwait(false);
                return response;
            }
...
```

## **TodoApp Example Xamarin App**

The Xamarin SDK has a slick [example app](https://github.com/strongloop/loopback-example-xamarin), TodoApp, to help you learn the SDK and showcase its power. You can run the Todo App against the LoopBack backend set up already or run the LoopBack backend yourself.

<img class="aligncenter size-full wp-image-25646" src="{{site.url}}/blog-assets/2015/07/4.png" alt="4" width="793" height="407"  />

## **What&#8217;s next?**

  * Read the [step-by-step tutorial](https://strongloop.com/strongblog/nodejs-loopback-xamarin-sdk-sql-server/) on how to get the To Do sample app up and running using Loopback and the Xamarin SDK
  * See the code in action! [Register for the Aug 12 webinar](http://marketing.strongloop.com/acton/form/5334/004b:d-0002/0/index.htm) to learn how to build the frontend and backend of a mobile app using the Xamarin SDK.
  * Get the code: [LoopBack](http://loopback.io/)
  * Get the code: [Xamarin SDK](https://github.com/strongloop/loopback-sdk-xamarin)
  * Get the code: [ToDo sample app](https://github.com/strongloop/loopback-example-xamarin)
  * Learn more about [PerfectedTech](http://perfectedtech.com/effective-mobile-solutions/)

&nbsp;