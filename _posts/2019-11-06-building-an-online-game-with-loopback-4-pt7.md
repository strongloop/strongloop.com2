---
layout: post
title: Building an Online Game With LoopBack 4 - Wrap-Up (Part 7)
date: 2019-11-06
author: Wenbo Sun
permalink: /strongblog/building-an-online-game-with-loopback-4-pt7/
categories:
  - How-To
  - LoopBack
published: true
---

## Part 7: Wrap-Up

### In This Episode

For some personal reason, I will no longer contribute to this series. Thank you so much for all of the following and support. The series may end, but your journey with LoopBack is just started.
In this episode, I am going to summarize what we have achieved by using LoopBack so far, and how can you apply all of this to your own project.

<!--more-->

### Introduction

In this series, I’m going to help you learn LoopBack 4 and how to use it to easily build your own API and web project. We’ll create a new project I’ve been thinking about: an online web text-based adventure game. In this game, you can create your own account to build characters, fight monsters and find treasures. You will be able to control your character to take a variety of actions: attacking enemies, casting spells, and getting loot. This game also allows multiple players to log in and play with their friends.

### Previously on Building an Online Game With LoopBack 4

Here are the previous episodes:

- [Part 1: Building a Simple LoopBack Project With MongoDB](https://strongloop.com/strongblog/building-online-game-with-loopback-4-pt1/)
- [Part 2: Generating Universally Unique ID and Managing Models Relationships](https://strongloop.com/strongblog/building-an-online-game-with-loopback-4-pt2/)
- [Part 3: Customizing APIs in Controller](https://strongloop.com/strongblog/building-an-online-game-with-loopback-4-pt3/)
- [Part 4: User Authentication and Role-Based Access Control](https://strongloop.com/strongblog/building-an-online-game-with-loopback-4-pt4/)
- [Part 5: Deploying our Application to Kubernetes on IBM Cloud](https://strongloop.com/strongblog/building-an-online-game-with-loopback-4-pt5/)
- [Part 6: Front-end with React](https://strongloop.com/strongblog/building-an-online-game-with-loopback-4-pt6/)

### What we have achieved

In the [episode 1](https://strongloop.com/strongblog/building-online-game-with-loopback-4-pt1/), we covered how to create simple APIs. You can do the same to create a start point for your own project, for example, a student registration system which has a `student` model with properties like `studentId`, `name`, `major`, and `course`. Then we connected our project to MongoDB. You have the freedom to choose any database you want. LB4 supports most databases very well.

In the [episode 2](https://strongloop.com/strongblog/building-an-online-game-with-loopback-4-pt2/), we used a third-party library to generate UUID. You can easily use any external library in you LoopBack 4 project. We also built relations between `character`, `weapon`, `aromr`, and `skill`. In a real world application, most of entities have relationships between each other. You can use LoopBack 4 to easily manage that in your project.

In the [episode 3](https://strongloop.com/strongblog/building-an-online-game-with-loopback-4-pt3/), we covered the how to customize APIs to achieve the function to manage users data. You can always implement your own amazing idea in your LoopBack 4 project.

In the [episode 4](https://strongloop.com/strongblog/building-an-online-game-with-loopback-4-pt4/), we covered how to combine your self-defined authorization strategies and services with `@loopback/authentication` and how to apply it to your API. You can always design your own strategies and services based on your project needs.

In the [episode 5](https://strongloop.com/strongblog/building-an-online-game-with-loopback-4-pt5/), we covered how to deploy our project with Docker and Kubernetes on IBM Cloud. Once you create a Docker image, you can run it almost everywhere. You can also push your own project image to other cloud like AWS, Azure, and Google Cloud.

In the [episode 6](https://strongloop.com/strongblog/building-an-online-game-with-loopback-4-pt6/), we covered how to create simple login, signup and home pages with React. We also learned how to connect front-end and back-end. React is the most popular front-end framework today. You can easily use it to create your own front-end UI.

### Last but not Least

Congratulation！You have built your own web application with LoopBack!

It doesn't have to be an online game, it could be an online shopping web or a food delivery web. Now, you almost have all the knowledge you need to build it. What we built in this series doesn't matter. What important is design thinking, the methodology and tools we were using, and the way to think as a developer.

Hope you enjoyed this series. Happy coding!
