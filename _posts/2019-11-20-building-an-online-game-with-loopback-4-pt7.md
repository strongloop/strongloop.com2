---
layout: post
title: Building an Online Game With LoopBack 4 - Wrap-Up (Part 7)
date: 2019-11-20
author: Wenbo Sun
permalink: /strongblog/building-an-online-game-with-loopback-4-pt7/
categories:
  - How-To
  - LoopBack
published: true
---

## Part 7: Wrap-Up

### In This Episode

This is the final episode of this series. We've used LoopBack 4 to build an online web text-based adventure game. We've built the foundation with LoopBack, and I am going to summarize what we have achieved so far, and how can you apply all of this to your own project. 

### What We Have Achieved

In [episode 1](https://strongloop.com/strongblog/building-online-game-with-loopback-4-pt1/), we created a simple APIs. You can do the same to create a start point for your own project, for example, a student registration system which has a `student` model with properties like `studentId`, `name`, `major`, and `course`. Then we connected our project to MongoDB. You have the freedom to choose any database you want. LB4 supports most databases very well.
<!--more-->
In [episode 2](https://strongloop.com/strongblog/building-an-online-game-with-loopback-4-pt2/), we used a third-party library to generate UUID. You can easily use any external library in you LoopBack 4 project. We also built relations between `character`, `weapon`, `aromr`, and `skill`. In a real world application, most of entities have relationships between each other. You can use LoopBack 4 to easily manage that in your project.

In [episode 3](https://strongloop.com/strongblog/building-an-online-game-with-loopback-4-pt3/), we covered how to customize APIs to achieve the function to manage users data. You can always implement your own amazing idea in your LoopBack 4 project.

In [episode 4](https://strongloop.com/strongblog/building-an-online-game-with-loopback-4-pt4/), we combined self-defined authorization strategies and services with `@loopback/authentication` and how to apply it to your API. You can always design your own strategies and services based on your project needs.

In [episode 5](https://strongloop.com/strongblog/building-an-online-game-with-loopback-4-pt5/), we deployed our project with Docker and Kubernetes on IBM Cloud. Once you create a Docker image, you can run it almost everywhere. You can also push your own project image to other cloud like AWS, Azure, and Google Cloud.

In [episode 6](https://strongloop.com/strongblog/building-an-online-game-with-loopback-4-pt6/), we created simple login, signup and home pages with React. We also learned how to connect front-end and back-end. React is the most popular front-end framework today. You can easily use it to create your own front-end UI.

### Last But Not Least

Congratulations! You have built your own web application with LoopBack!

What we built in this series doesn't matter. It doesn't have to be an online game! You can use these concepts for online shopping or food delivery APIs. What *is* important is improving your design thinking, what methodology and tools we were using, and adding to the ways you think as a developer. Now, you've established stronger skills to build! 

I hope you enjoyed this series. Thank you so much for all of the following and support. The series may be ending, but your journey with LoopBack is just starting.

Happy coding! 
