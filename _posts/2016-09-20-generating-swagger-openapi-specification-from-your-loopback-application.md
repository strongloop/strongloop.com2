---
id: 27889
title: Generating Swagger (OpenAPI specification) from your LoopBack Application
date: 2016-09-20T07:30:39+00:00
author: Raymond Camden
guid: https://strongloop.com/?p=27889
permalink: /strongblog/generating-swagger-openapi-specification-from-your-loopback-application/
categories:
  - How-To
  - LoopBack
---
I&#8217;ve been asked about Swagger and LoopBack at a few conferences, and my answer has been: &#8220;I know LoopBack supports creating Swagger docs, but I&#8217;m not sure of the exact syntax.&#8221; Now that I&#8217;ve gotten a bit of a break from the conference scene, I thought I&#8217;d quickly document how easy this is to do with LoopBack. Before we begin though, what in the heck is Swagger?

<!--more-->

When I first started using LoopBack, and started attending API-related conferences, it seemed like everyone knew what Swagger was&#8211;except for me. I&#8217;d worked with Node.js for a few years and had certainly been using APIs for many years, but I had never ran across that term before.

At its heart, [Swagger](http://swagger.io/) is a way to describe an API. Much as WSDL describes web services, Swagger is a textual representation of what an API offers. A client can import this definition and dynamically figure out how to consume the API. Swagger files can be written in either YAML or JSON.

Here&#8217;s a quick example of what a Swagger file could look like:

```js
swagger: '2.0'
info:
  version: 1.0.0
  title: customcat
basePath: /api
host: 127.0.0.1:3333
consumes:
  - application/json
  - application/x-www-form-urlencoded
  - application/xml
  - text/xml
produces:
  - application/json
  - application/xml
  - text/xml
  - application/javascript
  - text/javascript
paths:
  /notes:
    post:
      tags:
        - note
      summary: Create a new instance of the model and persist it into the data source.
      operationId: note.create
      parameters:
        - name: data
          in: body
          description: Model instance data
          required: false
          schema:
            $ref: '#/definitions/note'
      responses:
        '200':
          description: Request was successful
          schema:
            $ref: '#/definitions/note'
      deprecated: false
    put:
      tags:
        - note
      summary: >-
        Update an existing model instance or insert a new one into the data
        source.
      operationId: note.upsert
      parameters:
        - name: data
          in: body
          description: Model instance data
          required: false
          schema:
            $ref: '#/definitions/note'
      responses:
        '200':
          description: Request was successful
          schema:
            $ref: '#/definitions/note'
      deprecated: false
    get:
      tags:
        - note
      summary: Find all instances of the model matched by filter from the data source.
      operationId: note.find
      parameters:
        - name: filter
          in: query
          description: 'Filter defining fields, where, include, order, offset, and limit'
          required: false
          type: string
          format: JSON
      responses:
        '200':
          description: Request was successful
          schema:
            type: array
            items:
              $ref: '#/definitions/note'
      deprecated: false
```

Swagger has been renamed OpenAPI and is now handled by a group called the [OpenAPI Initiative](https://openapis.org/). You can read more the website (and notice that IBM is a sponsor!) as well as get a formal definition of the specification. Most of us, though, are interested in how we can actually _use_ Swagger in our LoopBack application.

LoopBack supports both creating a Swagger file from your models and creating models from a Swagger file. Let&#8217;s begin by looking at how you would create Swagger files.

First, you must be in a valid LoopBack project and must have at least one model. Then run the `export-api-def` command. Here is a full example:

`slc loopback:export-api-def --o test.yml`

The `--o` argument simply specifies a filename to save the result into. If you don&#8217;t use this, the result is returned to the screen. If you want JSON instead of YAML, you would add `--json` to your call or specify a filename that ends in `.json`.

And that&#8217;s pretty much it. The tool will scan your models and generate an appropriate Swagger file based on the properties and methods you&#8217;ve defined. It will also pick up custom methods as well!

Now let&#8217;s reverse it. If you have an existing Swagger document, you can import it into a LoopBack application with the following command:

`slc loopback:swagger`

This command is more interactive than the previous one. When you run it, it will ask for either a URL or relative file:

<img class="aligncenter size-full wp-image-27891" src="{{site.url}}/blog-assets/2016/08/sw1.jpg" alt="sw1" width="460" height="52"  />

After you&#8217;ve specified what Swagger definition you want to use, it will scan it and determine what models can be generated from it:

<img class="aligncenter size-full wp-image-27892" src="{{site.url}}/blog-assets/2016/08/sw2.jpg" alt="sw2" width="604" height="113"  />

You&#8217;ll then be prompted to select a data source to associate with the models:

<img class="aligncenter size-full wp-image-27893" src="{{site.url}}/blog-assets/2016/08/sw3.jpg" alt="sw3" width="631" height="80"  />

When you&#8217;ve selected that, the tool will take over and give you a log of what it has done:

<img class="aligncenter size-full wp-image-27894" src="{{site.url}}/blog-assets/2016/08/sw4.jpg" alt="sw4" width="650" height="224"  />

One thing you may miss it in the output above: the tool generates models in the `server/models` folder, not the `common/models` folder. You could move them if you want.

Here&#8217;s the model definition created in `pet.json`:

```js
{
  "name": "Pet",
  "base": "PersistedModel",
  "idInjection": true,
  "options": {
    "validateUpsert": true
  },
  "properties": {
    "id": {
      "type": "number",
      "required": true,
      "format": "int64"
    }
  },
  "validations": [],
  "relations": {},
  "acls": [],
  "methods": {}
}
```

Here&#8217;s a video demonstrating what I&#8217;ve shown.

Finally, here are the docs for both generating and consuming Swagger:
- [Swagger generator](https://loopback.io/doc/en/lb3/Swagger-generator.html)
- [API definition generator](https://loopback.io/doc/en/lb3/API-definition-generator.html)

Hopefully this helps you understand how to generate Swagger from your LoopBack application.
