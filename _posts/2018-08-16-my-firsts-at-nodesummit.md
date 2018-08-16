---
layout: post
title: My Firsts at NodeSummit 2018
date: 2018-08-16
author: Taranveer Virk
permalink: /strongblog/my-firsts-at-nodesummit-2018/
categories:
  - LoopBack
  - Community
---

During the week of July 23-27, I experienced several **firsts** at [NodeSummit](http://www.nodesummit.com/).

It was my **first** ever [NodeSummit](http://www.nodesummit.com/) as both an attendee and a speaker (I delivered a talk on [The Art of Composability and Extensibility: Crafting a Foundation for Node.js Frameworks / Applications in TypeScript](https://github.com/virkt25/nodesummit-2018)). This was also my **first** opportunity to meet [Miroslav Bajtos (@bajtos on GitHub)](https://github.com/bajtos) in person since having joined the team over a year ago. NodeSummit ran their **first** ever [Training Days](http://www.nodesummit.com/training-days/) (which I was able to attend). 

Keep reading to learn more about my talk, NodeSummit experience and other firsts.

<!--more-->

<img src="https://strongloop.com/blog-assets/2018/08/nodesummit-welcome.png" alt="Welcome to NodeSummit Sign" style="width: 300px;"/>

### Meeting Miroslav

The Sunday before the conference started I finally had a chance to meet Miroslav in person after having worked with him for well over a year on [Loopback](https://loopback.io/). Despite being used to remote collaboration, it's always a fun experience to meet a co-worker you've been working with remotely for the first time and this time was no exception. Miroslav is a kind, smart and amazing person (just like he is on GitHub). We met for lunch and then went on a hike from Land's End to the Golden Gate Bridge, a trail with amazing views and stops along the way. We got to know each other well, connecting as we talked about our experiences, LoopBack, life, family and more. Here are some pictures from the hike for you to enjoy.

<img src="https://strongloop.com/blog-assets/2018/08/nodesummit-hike-pano.png" alt="Hiking Trail Panorama" style="width: 500px;"/>

<img src="https://strongloop.com/blog-assets/2018/08/nodesummit-hike.JPG" alt="Hiking: Golden Gate Bridge" style="width: 400px;"/>

Miroslav was also a presenter at NodeSummit on Day 0, delivering a talk on [Async Functions In Practice: Tips, Tricks And Caveats You Want To Know Before Migrating From Callbacks](https://bajtos.net/2018-AsyncAwait) which covered tips, tricks, benefits and how to make the switch. Check out the slides to learn more.

### NodeSummit Experience

#### As a Speaker

I was feeling nervous, excited, and anxious along with other varying emotions to be presenting at NodeSummit. I had been practicing for days with co-workers and improving the talk and slides based on their feedback. Ten minutes before my presentation, I was mic'ed up and ready. My only fear was a tech malfunction with the laptop, projector, mic, or something unimagined, even with the NodeSummit team ready for everything. I got on stage in front of an almost packed room, took a deep breath, and as the clock struck 4:20 I began to deliver my talk. As I saw the audience listening to my presentation with an enthusiastic and engaged look, my nervousness quickly disappeared. 

After the talk I had a lot of people approach me to say they enjoyed the talk (phew) while others had follow-up questions about the various topics discussed. People shared how they faced the same pain points and told me the talk was super relatable. It was very exciting to answer their questions and receive feedback and comments from the attendees. Overall, I was thrilled to present at NodeSummit and hope to be able to do so again next year. 

My slides are available [here](https://github.com/virkt25/nodesummit-2018) and I will share with you all the recording of the presentation once it becomes available.

There were some follow-up question I got from more than one person that I would like to answer here for everyone: 

**Can `@loopback/context` module be used standalone?**

YES! The Context module is designed to work without any other LoopBack dependency and can serve as a Universal Container for your application / framework.

> The @loopback/context package exposes TypeScript/JavaScript APIs and decorators to register artifacts, declare dependencies, and resolve artifacts by keys. The Context also serves as an IoC container to support dependency injection.

Check out the `@loopback/context` package [here](https://www.npmjs.com/package/@loopback/context).

**What's the best way to transition to TypeScript in an existing project?**

TypeScript compiles to JavaScript! You can start to switch incrementally by writing new modules in you project using TypeScript and it should all compile without issues. This way you get experience with TypeScript and when you have the time, older modules can be transitioned to TypeScript at a later date. You might even benefit from the TypeScript compiler catching simple errors in JavaScript if you run the code through it.

For those looking to set up a TypeScript project, check out the [`@loopback/build`](https://www.npmjs.com/package/@loopback/build) package to simplify it as it provides defaults for `typescript` builds, `tslint`, `prettier`, `mocha`, etc.

**When is LoopBack 4 coming out?**

It's already out! LoopBack 4 is available as a Developer Preview #3 and can be used to start building applications. We are adding more features and fixing bugs based on the community's feedback. If all goes according to plan, LoopBack 4 GA (General Availability) for building production application should be available sometime in October 2018. That said, I would recommend getting started now as I only anticipate new features and limited (if any) breaking changes to the [developer preview](https://strongloop.com/strongblog/loopback-4-developer-preview-3). 

**Can you tell me more about Call for Code?**

IBM is a founding partner for [Call for Code](https://callforcode.org/), an initiative by David Clark Cause. Call for Code, a multi-year global initiative, is a rallying cry to developers to use their skills and mastery of the latest technologies, and to create new ones, to drive positive and long-lasting change across the world with their code. The inaugural Call for Code Challenge theme is Natural Disaster Preparedness and Relief. Grand Prize is $200,000 USD!! There's still time to answer the call.

#### As an Attendee

The conference was very well organized with multiple tracks running at certain times allowing attendees to select a session of their choice. The downside of this was trying to decide between multiple great sessions - though the upside is that all talks were recorded and will be available online soon for everyone to view. There was a wide breadth of topics ranging from the future of Node.js, frameworks, performance, security, and more. The NodeSummit staff was extremely friendly and did an outstanding job organizaing everything. The conference was also a great networking opportunity allowing attendees to connect with maintainers of Node.js, various frameworks and learn from them. I enjoyed chatting with a wide variety of people about Node.js, LoopBack, and IBM. The conference also gave me a chance to connect with a lot of other IBMers working on various Node.js initiatives such as the [CloudNativeJS.io initative](https://www.cloudnativejs.io/) announced at NodeSummit which LoopBack is a part of.

<img src="https://strongloop.com/blog-assets/2018/08/nodesummit-ibm.png" alt="IBM Booth at NodeSummit 2018" style="width: 300px;"/>
<img src="https://strongloop.com/blog-assets/2018/08/nodesummit-join-node.png" alt="Node.js: Join us in creating the future of Node.js!" style="width: 300px;"/>


One of the biggest take away for me from the conference as an attendee was a desire to get more involved with the Node.js community by joining a working group or making my first PR to the Node.js project. My goal is to make a contribution in some way before the end of this year! :D

### Training Days

Its important for me to always keep learning and NodeSummit presented a great opportunity by offering their first ever Training Days! The two training days following the conference were run by experts and offered a wide variety of topics. These were half-day sessions held in small groups so you could easily interact with the instructor. I attended 4 sessions and I learned something different from each one. In particular, the sessions I attended were:

- Enterprise Architecture With Node.js
> Focused on the fundamentals of bringing Node.js into an Enterprise grade cloud environment ready for mission critical business support.

- Practical Server-Side GraphQL
> We built a GraphQL server designed to provide hands-on experience with all the essential areas of GraphQL.

- Working with Humans: Emotional Intelligence for Empowered Developers
> To unlock our full potential as developers, we need more than just coding skills.

- React with Node.js
> React on the frontend and Node.js on the backend.

I am very glad NodeSummit introduced these Training Days - I took something away from each session!

### Call for Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
- [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
- [Reporting issues](https://github.com/strongloop/loopback-next/issues)
- [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
- [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)
