---
layout: post
title: Import LoopBack 3 Models into a LoopBack 4 Project
date: 2019-10-08
author: Miroslav Bajtoš
permalink: /strongblog/import-loopback-3-models-to-loopback-4/
categories:
  - LoopBack
published: false
---

It has been almost a year since [LoopBack 4.0 GA was announced](https://strongloop.com/strongblog/loopback-4-ga). Since then, we have been working hard on closing the feature gap between the new and the old versions and looking for ways to simplify migration of projects built on LoopBack 3.

In June, we announced a new feature that allows LoopBack 3 applications to be mounted in LoopBack 4 projects, allowing developers to start writing new features using LoopBack 4 while keeping existing APIs powered by LoopBack 3 (Read more about it in this [blog post](https://strongloop.com/strongblog/migrate-from-loopback-3-to-loopback-4/)).

Today, we are happy to announce a preview version of a tool automating migration of models from LoopBack 3 to LoopBack 4:

```
lb4 import-lb3-models
```

<!-- more -->

Let me show you the new command in practice, using our [`lb3-application`](https://github.com/strongloop/loopback-next/tree/master/examples/lb3-application) example, which is based on [Getting started with LoopBack 3](https://loopback.io/doc/en/lb3/Getting-started-with-LoopBack.html).

First of all, upgrade your global installation of LoopBack 4 CLI to get the new feature!

```
$ npm install -g "@loopback/cli"
```

Now we can run the following command to start the migration process:

```
$ lb4 import-lb3-models lb3app/server/server.js
```

_A side note: in our example project, the LoopBack 3 application is a part of the root LoopBack 4 project. Therefore it does not have its own `package.json` file and LoopBack 3 dependencies are included in the top-level `package.json` file along LoopBack 4 dependencies. The directory of the LoopBack 3 application cannot be loaded directly via `require` as a result, and we have to provide a full path to the server file to the CLI tool. On the other hand, if you are importing from a standalone LoopBack 3 project which has `main` entry in `package.json` configured to point to `server/server.js` (as is the case with projects scaffolded by our LoopBack 3 CLI tool), then it's enough to use the path to your LoopBack 3 project directory as the argument, e.g. `lb3app`)._

The generator will greet you with a warning about the experimental status and then load the LoopBack 3 application at the provided path. Once the application is loaded, the generator shows a list of models available for import.

```
? Select models to import: (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◯ Application
 ◯ AccessToken
 ◯ User
 ◯ RoleMapping
 ◯ Role
 ◯ ACL
 ◯ Scope
(Move up and down to reveal more choices)
```

The initial version includes built-in LoopBack 3 models too, because they don't have any direct counterparts in LoopBack 4. We would like to investigate different options for importing models based on LoopBack 3 built-in models. Depending on the findings, the behavior of this prompt may change in the future.

Using arrows and the spacebar, we select the `CoffeeShop` model to import and confirm the selection.

```
? Select models to import:
 ◯ Role
 ◯ ACL
 ◯ Scope
❯◉ CoffeeShop
 ◯ Application
 ◯ AccessToken
 ◯ User
(Move up and down to reveal more choices)
```

Now the generator migrates the model definition to the LoopBack 4 style, creates a TypeScript model file, and also updates the relevant index file.

```
? Select models to import: CoffeeShop
Model CoffeeShop will be created in src/models/coffee-shop.model.ts

Ignoring the following unsupported settings: acls
   create src/models/coffee-shop.model.ts
   update src/models/index.ts
```

The definition of `CoffeeShop` model includes access-control configuration, which is not supported by LoopBack 4. The tool will warn about other unsupported fields besides `acls`, for example `relations` and `methods`.

The initial release has a few more limitations beyond missing support for `acls`. Please refer to our documentation at [Importing models from LoopBack 3 projects](https://loopback.io/doc/en/lb4/Importing-LB3-models.html).

## What's Next?

We are releasing this early preview version to get feedback from you, our users! Please give the new command a try and let us know which parts of the migration experience we should improve next. Start by checking the known limitations described in the documentation and up-vote the linked GitHub issues. If there is no GitHub issue describing your feature yet then please open a new one.

Besides importing model definitions, we are also working on a declarative way of exposing models via REST APIs. This will allow LoopBack 4 applications to be written in a style that's closer to LoopBack 3, where REST API are built from a model definition file (e.g. `common/models/product.json`) and model configuration file (`server/model-config.json`). Once this feature is implemented, it will be possible to migrate both model definition and REST API from LoopBack 3. You can track our progress in GitHub issues [loopback-next#2036](https://github.com/strongloop/loopback-next/issues/2036) and [loopback-next#3822](https://github.com/strongloop/loopback-next/issues/3822).

## Call to Action

LoopBack's future success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Here's how you can join us and help the project:

- [Report issues](https://github.com/strongloop/loopback-next/issues).
- [Contribute](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md) code and documentation.
- [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
- [Join](https://github.com/strongloop/loopback-next/issues/110) our user group.
