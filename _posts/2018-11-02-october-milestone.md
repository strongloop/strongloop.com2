---
layout: post
title: LoopBack 4 October 2018 Milestone Update
date: 2018-11-02
author: Biniam Admikew
permalink: /strongblog/october-2018-milestone/
categories:
  - Community
  - LoopBack
---

As the fall season was in full gear, the LoopBack team was busy wrapping up
items planned for our General Availability (GA) release and releasing LoopBack 4
v1.0.0 on Wednesday, October 10th! On top of that, the team was able to complete
a number of stretch goals for the month and focused on helping our users with
pressing bugs and feature requests. Read more to find out how it all unfolded.

<!--more-->

## Accomplishments

### LoopBack 4 GA

To wrap up our LoopBack 4 GA release, we had to finish all the remainder of the
priority 1 items planned which included:
- belongsTo relation
- REST layer improvements such as:
  - using pre-compiled AJV validators to boost performance on resource creation
requests
  - making sure `patch` and `put` requests return JSON responses like other
    verbs
- Adding CLI template to render a default home page when scaffolding new
  applications

Once those items were completed, the team went on to finish the checklist for
LoopBack 4 GA release which included updating the status of the framework in all the `README` files in
loopback-next monorepo and `loopback.io` docs, updating LTS statuses, and
releasing all packages at the new semver-major version of `1.0.0`. You can read
more about the release in our [announcement
blog](https://strongloop.com/strongblog/loopback-4-ga), including our journey to
this major milestone.


#### Relations
[comment]: <> (belongsTo, Miroslav to add in details)

#### REST

In order to provide consistent and smooth user experience when sending requests
to your endpoints in LoopBack, we decided to convert the boolean response we
send back for `PATCH` and `PUT` requests to JSON response with the
value. On top of that, we updated paths like `PATCH /my-models` and `GET
/my-model/count` to give back JSON wrapped responses instead of number of
updated instances and count of instances, respectively.

The much needed API for serving static assets was finally added to the framework.
The initial implementation had two major limitations: a. Static assets could not
be served from '/', b. The static assets api overrode LoopBack's own underlying
router. Both the issues were resolved in subsequent updates.

A major performance improvement (close to 15x improvement in `POST` requests)
was made by caching schema validators in incoming requests.

#### IBM Cloud Deployment

LoopBack 4 is IBM Cloud capable now and a guide was published showing how to
create a Cloudant-based LoopBack app locally and deploying it to IBM Cloud
using Cloud Foundry.

The team has planned to focus efforts on Kubernetes deployment in future which
would provide much more advanced capabilities.


### Stretch Goals

#### Home page for LB4 Apps

### Community Support

### LoopBack 3


## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
- [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
- [Reporting issues](https://github.com/strongloop/loopback-next/issues)
- [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
- [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)
