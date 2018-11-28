---
layout: post
title: LoopBack 4 November 2018 Milestone Update
date: 2018-12-05
author: Nora Abdelgadir
permalink: /strongblog/november-2018-milestone/
categories:
  - Community
  - LoopBack
published: false
---

With winter approaching, daylight hours have been decreasing, but the LoopBack team's productivity has not. After we published the General Availability (GA) release, the team started to focus on user adoption and fixing up documentation to accomodate for the increase in users. You can check out the November Milestone [here](https://github.com/strongloop/loopback-next/issues/1961) and our December Milestone [here](https://github.com/strongloop/loopback-next/issues/2084).

<!--more-->

## Accomplishments

### Local API Explorer

From the [Self-hosted API Explorer epic](https://github.com/strongloop/loopback-next/issues/559), a local version of API Explorer is now supported. As part of the feature, we added a [config option](https://github.com/strongloop/loopback-next/pull/2016) to disable API Explorer redirects. There was a lot of discussion surrounding adding the local version feature. You can see the [PR](https://github.com/strongloop/loopback-next/pull/2014) and read the [blog](https://strongloop.com/strongblog/how-we-built-a-self-hosted-rest-api-explorer/) for more details. 

For the same epic, we added a page for [Serving Static Files](https://loopback.io/doc/en/lb4/Serving-static-files.html) in LoopBack 4. Addtionally, due to user feedback, we've updated our [Deploying to IBM Cloud](https://loopback.io/doc/en/lb4/Deploying-to-IBM-Cloud.html) page and added more information on how to create a Clouddant database service on IBM Cloud. See the [PR](https://github.com/strongloop/loopback-next/pull/2039).

### Extending Request Body Parsing

LoopBack 4 processes HTTP requests including the request's path, query, and body, however, the body is more complex to parse than the other parts of the request. Now, as LoopBack has started to use Express again, it would be in our interest to use Express' `body-parser`. The main entry point to handling body parsing from `body-parser` is `RequestBodyParser`, which is an extension point to provide body parsing functionality for LoopBack 4 REST APIs. You can see the [PR](https://github.com/strongloop/loopback-next/pull/1936) and keep an eye out for the blog post, coming soon, with more details.

### Improving Component Bindings

An improvement we introduced is for the component design to allow contribution of bindings and classes. Now component classes can be declared as follows:

```ts
class MyComponent implements Component {
  bindings = [Binding.bind('x').to.(1)];
  classes = {'binding-key-for-my-class': MyClass};
  constructor() {}
}
```

You can see the [PR](https://github.com/strongloop/loopback-next/pull/1924) for more information.

### Documentation

#### Documentation Clean Up

This month, the team focused on cleaning up the documentation for LoopBack 4. We opened a [spike](https://github.com/strongloop/loopback-next/issues/1908) to look through the docs to make sure they are still up-to-date with all the changes LoopBack 4 has been through. There are various in the documentation need to be updated to reflect the enhancement and features we have put in.  Some of the examples are listed below:
- We've updated the how-to guide in exposing GraphQL due to the enhancement in [OASGraph](http://v4.loopback.io/oasgraph.html).
- We added a ["How-tos"](https://loopback.io/doc/en/lb4/How-tos.html) section to better categorize our guides. See the [PR](https://github.com/strongloop/loopback-next/pull/2076).
- With the introduction of `lb4 repository` and `lb4 service` commands, we have updated the [TodoList](https://loopback.io/doc/en/lb4/todo-list-tutorial.html) and [SOAP Web Service Calculator](https://loopback.io/doc/en/lb4/soap-calculator-tutorial.html) tutorials to make use of these commands.
- We added how to [contribute with Webstorm](https://github.com/strongloop/loopback-next/pull/1931).
- We fixed the image links for the [Deploying to IBM Cloud](https://loopback.io/doc/en/lb4/Deploying-to-IBM-Cloud.html) page.

Additionally, with the release of LoopBack 4 GA, LoopBack 3 [packages](https://github.com/strongloop/loopback-next/issues/1802#issue-366719417) were moved into Active LTS mode.

### Database Migration

A user [request](https://github.com/strongloop/loopback-next/issues/1547) was documentation outlining how to do datasource migration in LoopBack 4, similar to how it is shown for [LoopBack 3](https://loopback.io/doc/en/lb3/Implementing-auto-migration.html). Now calling `app.migrateSchema()` after the application is bootstrapped will update the database schema at the start of running your application. A custom script was also developed for updating the database schema explicitly. For more details, see the [PR](https://github.com/strongloop/loopback-next/pull/2059) and its [follow-up](https://github.com/strongloop/loopback-next/pull/2094).

### Unified Website Experience

We gave our [loopback.io Documentation](https://loopback.io/doc/) and [API Docs](http://apidocs.strongloop.com) websites a new look to match our LoopBack 4 theme, which was present on [v4.loopback.io](http://v4.loopback.io). This is part of our [epic](https://github.com/strongloop/v4.loopback.io/issues/52) to have a unified website experience. 

As part of the website update, you will see a [Test Your API](https://ibm.biz/apitest) button. Our team has also been working on an easy no-code alternative to Postman to help you test and monitor your APIs. Check it out and let us know what you think!

### LoopBack 3

#### CLI

A few weeks ago we refactored the generator repository `generator-loopback` by upgrading its dependency `yeoman-generator` from version `0.x` to the latest `3.x`. We also released a new major version(`generator-loopback@6.x`) for this change. In November, the cli repository `loopback-cli` is updated accordingly to adopt the new `generator-loopback`, which means the `lb *` commands now invoke the upgraded generators.

#### mongodb connector

The connector now supports the string to decimal conversion for nested decimal128 properties. You can read [the document](https://github.com/strongloop/loopback-connector-mongodb/blob/master/docs/decimal128.md) to learn this advanced feature. This also inspires us to have decimal as a built-in type in LoopBack 4 since it's a popular data type that's been supported in most SQL/NoSQL databases. Check [this issue](https://github.com/strongloop/loopback-next/issues/1902) to know more about this proposal and join our discussion.

We also released a new major version `loopback-connector-mongodb@4.x` to get rid of the deprecation warning caused by the outdated url parser. As mongodb 3.2 became LTS in September 2018, we updated the mongodb server to 3.4 on the CI virtual machines, and start to support 3.4 features like decimal128 properties and case insensitive indexes.

### New LoopBack Maintainer Hugo

We would like to welcome Hugo ([@yaty](https://github.com/yaty)) who joined our team of maintainers this month! Hugo has been actively working on LoopBack posting comments, questions, and suggestions. We look forward to working more closely with him and seeing his future contributions.

This month, we have been excited to see a significant increase in the number of LoopBack users -- through the number of downloads on npmjs.org and increasing number of incoming GitHub issues. As [Miroslav](https://strongloop.com/authors/Miroslav_Bajto%C5%A1/) stated earlier in [a blog post](https://medium.com/loopback/sustaining-loopback-project-b67fd59673e4), we need to grow our number of maintainers in order to sustain the growth of LoopBack 4. With that said, we are constantly looking for more maintainers to help us with the project. So, if you haven't done so already, you can start today by [joining our user group](https://github.com/strongloop/loopback-next/issues/110).

## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Reporting issues](https://github.com/strongloop/loopback-next/issues).
- [Contributing](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md)
  code and documentation.
- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Joining](https://github.com/strongloop/loopback-next/issues/110) our user group.
