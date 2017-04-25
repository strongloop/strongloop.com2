---
id: 19846
title: Building Enterprise APIs with StrongLoop Support for Swagger 2.0
date: 2014-09-06T12:20:33+00:00
author: Raymond Feng
guid: http://strongloop.com/?p=19846
permalink: /strongblog/enterprise-api-swagger-2-0-loopback/
categories:
  - Community
  - LoopBack
  - News
---
The [Swagger 2.0](http://swagger.io/index.html) specification was [officially released today](http://www.marketwatch.com/story/reverb-announces-swagger-20-a-next-generation-interface-to-connect-apis-and-cloud-services-2014-09-08?reflink=MW_news_stmp) and at StrongLoop we are excited to announce that [LoopBack](http://strongloop.com/node-js/loopback/) is the first Node.js framework to support Swagger 2.0. Using LoopBack you can now take a Swagger 1.2 _or_ 2.0 specification and automatically scaffold a Node-powered REST API. This should be especially useful for any developer wanting to easily describe their APIs using the leading enterprise standard for API specification and implement them in Node.js. Developers now have the ultimate flexibility in starting from a &#8220;bottoms up&#8221; approach &#8211; building APIs from existing data sources or a &#8220;top down&#8221; approach &#8211; starting with the leading enterprise API specification and scaffolding up a backend of generated models.

## A community effort {#what-is-loopback}

We were invited by the project lead [Tony Tam](https://twitter.com/fehguy), to participate in the Swagger 2.0 workgroup a few months ago, which also included other leading API vendors like Apigee, 3Scale, PayPal and Microsoft.  The Swagger 2.0 specification is a great win in the effort to build APIs for the enterprise and to describe them in a uniform way so that they can be utilized by end users and developers. We&#8217;d like to congratulate everyone on all the hard work that went into this release!

## What is Swagger? {#what-is-swagger}

If you are new to [Swagger](https://github.com/reverb/swagger-spec), it defines a standard, language-agnostic interface to REST APIs which allows both humans and computers to discover and understand the capabilities of the service without access to source code, documentation, or through network traffic inspection.

## What is LoopBack? {#what-is-loopback}

If you are new to LoopBack, it is an open source Node.js API framework from StrongLoop. It is built on top of Express optimized for mobile, web, and other devices. LoopBack makes it really easy and productive for developers to:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Define, build and consume APIs</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Define data models</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Connect to multiple data sources</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Write business logic in Node.js</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Glue on top of your existing services and data</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Consume services and data using JavaScript, iOS & Android SDKs</span>
</li>

## LoopBack + Swagger = API business {#loopback-swagger-api-business}

<img class="aligncenter size-full wp-image-19853" src="https://strongloop.com/wp-content/uploads/2014/09/loopback-swagger-integration.png" alt="loopback-swagger-integration" width="740" height="443" srcset="https://strongloop.com/wp-content/uploads/2014/09/loopback-swagger-integration.png 740w, https://strongloop.com/wp-content/uploads/2014/09/loopback-swagger-integration-300x179.png 300w, https://strongloop.com/wp-content/uploads/2014/09/loopback-swagger-integration-450x269.png 450w" sizes="(max-width: 740px) 100vw, 740px" />

LoopBack has come with a Swagger based API explorer since day one in order to provide instant visibility for REST APIs exposed by LoopBack models. So far with LoopBack, most developers define models and implement the API logic in Node.js. The JavaScript methods are annotated with remoting metadata so that they can be exposed as REST APIs. LoopBack publishes such definitions as Swagger specs in JSON format. The API explorer creates an API playground based on the specs.

What about starting with an API design specification? API consumers and providers often want to discuss, understand, and agree on the APIs as a contract first, before building code for either the client or server. To support a API design first approach, we’re excited to announce the availability of the `loopback:swagger` generator which can generate a fully-functional application that provides the APIs conforming to the Swagger specification.

In the next few sections of this blog we&#8217;ll show just how easy it is to create Node powered REST APIs that conform to the Swagger 2.0 specification using the LoopBack framework.

## Scaffolding a LoopBack application from Swagger specs

Before we start, please make sure you have StrongLoop tools installed:

    npm install -g strongloop

For more information, see:

<http://docs.strongloop.com/display/LB/Getting+Started+with+LoopBack>

### Create a loopback application {#create-a-loopback-application}

The first step is to create a blank LoopBack application.

    slc loopback

<img class="aligncenter size-full wp-image-19856" src="https://strongloop.com/wp-content/uploads/2014/09/loopback-1.png" alt="loopback (1)" width="969" height="436" srcset="https://strongloop.com/wp-content/uploads/2014/09/loopback-1.png 969w, https://strongloop.com/wp-content/uploads/2014/09/loopback-1-300x134.png 300w, https://strongloop.com/wp-content/uploads/2014/09/loopback-1-450x202.png 450w" sizes="(max-width: 969px) 100vw, 969px" />

### Generate APIs from swagger spec {#generate-apis-from-swagger-spec}

Now let’s try to generate APIs from Swagger specs.

    cd swagger-demo
    slc loopback:swagger

When prompted, first provide a url to the swagger spec. In this demo, we use:

<a href="https://raw.githubusercontent.com/wordnik/swagger-spec/master/examples/v2.0/json/petstore-simple.json" target="_blank" rel="noreferrer">https://raw.githubusercontent.com/wordnik/swagger-spec/master/examples/v2.0/json/petstore-simple.json</a>

<img class="aligncenter size-full wp-image-19857" src="https://strongloop.com/wp-content/uploads/2014/09/loopback-swagger.png" alt="loopback-swagger" width="1126" height="264" srcset="https://strongloop.com/wp-content/uploads/2014/09/loopback-swagger.png 1126w, https://strongloop.com/wp-content/uploads/2014/09/loopback-swagger-300x70.png 300w, https://strongloop.com/wp-content/uploads/2014/09/loopback-swagger-1030x241.png 1030w, https://strongloop.com/wp-content/uploads/2014/09/loopback-swagger-450x105.png 450w" sizes="(max-width: 1126px) 100vw, 1126px" />

The generator loads the spec and discovers models and apis. It then prompts youto select from the list of models to be created.

<img class="aligncenter size-full wp-image-19858" src="https://strongloop.com/wp-content/uploads/2014/09/loopback-swagger-full.png" alt="loopback-swagger-full" width="1128" height="698" srcset="https://strongloop.com/wp-content/uploads/2014/09/loopback-swagger-full.png 1128w, https://strongloop.com/wp-content/uploads/2014/09/loopback-swagger-full-300x185.png 300w, https://strongloop.com/wp-content/uploads/2014/09/loopback-swagger-full-1030x637.png 1030w, https://strongloop.com/wp-content/uploads/2014/09/loopback-swagger-full-450x278.png 450w" sizes="(max-width: 1128px) 100vw, 1128px" />

### Check the project {#check-the-project}

The models and corresponding JS files are generated into the `server/models` folder:

<img class="aligncenter size-full wp-image-19859" src="https://strongloop.com/wp-content/uploads/2014/09/demo-project.png" alt="demo-project" width="327" height="439" srcset="https://strongloop.com/wp-content/uploads/2014/09/demo-project.png 327w, https://strongloop.com/wp-content/uploads/2014/09/demo-project-223x300.png 223w" sizes="(max-width: 327px) 100vw, 327px" />

  * `server/model-config.json`: Config for all models
  * `server/models`: 
      * `swagger-api.json`: model to host all swagger APIs
      * `swagger-api.js`: JS file containing all api methods
      * `error-model.json`: errorModel model definition
      * `error-model.js`: errorModel extension
      * `pet.json`: pet definition
      * `pet.js`: pet model extension
      * `new-pet.json`: newPet model definition
      * `new-pet.js`: newPet model extension

Please note `pet/newPet/errorModel` models are now connected to the database selected.

### Run the application {#run-the-application}

To run the application:

    slc run .

Open your browser and points to <http://localhost:3000/explorer>.

<img class="aligncenter size-full wp-image-19860" src="https://strongloop.com/wp-content/uploads/2014/09/explorer-api.png" alt="explorer-api" width="1108" height="524" srcset="https://strongloop.com/wp-content/uploads/2014/09/explorer-api.png 1108w, https://strongloop.com/wp-content/uploads/2014/09/explorer-api-300x141.png 300w, https://strongloop.com/wp-content/uploads/2014/09/explorer-api-1030x487.png 1030w, https://strongloop.com/wp-content/uploads/2014/09/explorer-api-450x212.png 450w" sizes="(max-width: 1108px) 100vw, 1108px" />

As you see, the API endpoints defined by the Swagger spec is now available from LoopBack!

You’ll also see a list of models generated too. As illustrated below, these models have the full CRUD capabilities and can be attached any of the databases that LoopBack supports.

<img class="aligncenter size-full wp-image-19861" src="https://strongloop.com/wp-content/uploads/2014/09/explorer-model.png" alt="explorer-model" width="1082" height="537" srcset="https://strongloop.com/wp-content/uploads/2014/09/explorer-model.png 1082w, https://strongloop.com/wp-content/uploads/2014/09/explorer-model-300x148.png 300w, https://strongloop.com/wp-content/uploads/2014/09/explorer-model-1030x511.png 1030w, https://strongloop.com/wp-content/uploads/2014/09/explorer-model-450x223.png 450w" sizes="(max-width: 1082px) 100vw, 1082px" />

Let’s give it a try:

<img class="aligncenter size-full wp-image-19862" src="https://strongloop.com/wp-content/uploads/2014/09/api-error.png" alt="api-error" width="1068" height="795" srcset="https://strongloop.com/wp-content/uploads/2014/09/api-error.png 1068w, https://strongloop.com/wp-content/uploads/2014/09/api-error-300x223.png 300w, https://strongloop.com/wp-content/uploads/2014/09/api-error-1030x766.png 1030w, https://strongloop.com/wp-content/uploads/2014/09/api-error-450x334.png 450w" sizes="(max-width: 1068px) 100vw, 1068px" />

Hmm, you get an error saying the api is not implemented. That is expected as the generated method is just a skeleton!

How about adding your implementation?

The file can be found at `swagger-demo/server/models/swagger-api.js`.

    module.exports = function(SwaggerApi) {
    
    /**
     * Returns all pets from the system that the user has access to
     * <a class='bp-suggestions-mention' href='https://strongloop.com/members/param/' rel='nofollow'>@param</a> {array} tags tags to filter by 
     * <a class='bp-suggestions-mention' href='https://strongloop.com/members/param/' rel='nofollow'>@param</a> {integer} limit maximum number of results to return
     * <a class='bp-suggestions-mention' href='https://strongloop.com/members/callback/' rel='nofollow'>@callback</a> {Function} callback Callback function
     * <a class='bp-suggestions-mention' href='https://strongloop.com/members/param/' rel='nofollow'>@param</a> {Error|String} err Error object
     * <a class='bp-suggestions-mention' href='https://strongloop.com/members/param/' rel='nofollow'>@param</a> {errorModel} result Result object
     */
    SwaggerApi.findPets = function (tags, limit, callback) {
      // Add your implementation here. Please make sure the callback is invoked
      process.nextTick(function() {
        var err = new Error('Not implemented');
        callback(err);
      });
    
    }
    ...
    SwaggerApi.remoteMethod('findPets',
      { isStatic: true,
      produces: [ 'application/json', 'application/xml', 'text/xml', 'text/html' ],
      accepts: 
       [ { arg: 'tags',
           type: [ 'string' ],
           description: 'tags to filter by',
           required: false,
           http: { source: 'query' } },
         { arg: 'limit',
           type: 'number',
           description: 'maximum number of results to return',
           required: false,
           http: { source: 'query' } } ],
      returns: 
       [ { description: 'unexpected error',
           type: 'errorModel',
           arg: 'data',
           root: true } ],
      http: { verb: 'get', path: '/pets' },
      description: 'Returns all pets from the system that the user has access to' }
    );

Let’s use the `Pet` model to implement the corresponding methods:

    SwaggerApi.findPets = function(tags, limit, callback) {
      var filter = {limit: limit};
      if (tags &&; tags.length) {
        filter.where = {tag: {inq: tags}};
      }
      SwaggerApi.app.models.pet.find(filter, callback);
    }
    
    SwaggerApi.addPet = function (pet, callback) {
      SwaggerApi.app.models.pet.create(pet, callback);
    
    }
    
    SwaggerApi.findPetById = function (id, callback) {
      SwaggerApi.app.models.pet.findById(id, callback);
    
    }
    
    SwaggerApi.deletePet = function (id, callback) {
      SwaggerApi.app.models.pet.deleteById(id, callback);
    
    }

Now you can restart the server and try again:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Try <code>getPets</code>. You’ll see an empty array coming back.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Try <code>addPet</code> to post one or more records to create new pets.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Try <code>getPets</code> again. You’ll see the newly created pets.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Try <code>findPetById</code>. You should be look up pets by id now.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Try <code>deletePet</code>. Pets can be deleted by id.</span>
</li>

You can also use the `pet` model directly. It will provide you the full CRUD operations.

## **Swagger versions**

The LoopBack swagger generator supports both [2.0](https://github.com/reverb/swagger-spec/blob/master/versions/2.0.md) and [1.2](https://github.com/reverb/swagger-spec/blob/master/versions/1.2.md) versions. Feel free to try it out with the Pet Store v1.2 spec at:

<http://petstore.swagger.wordnik.com/api/api-docs>

Please note in 1.2, the spec URL can be the resource listing or a specific API specification. For resource listing, all API specifications will be automatically fetched and processed.

## **Summary**

With the Swagger generator, we&#8217;ve now completed a round trip of API creation:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Start with a Swagger spec</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Generate corresponding models and methods for your application</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Implement the remote methods</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Play with the live APIs served by LoopBack using the explorer</span>
</li>

<h2 dir="ltr">
  What’s next
</h2>

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js <a href="http://strongloop.com/node-js/loopback/">LoopBack framework</a>. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
</li>