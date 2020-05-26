---
layout: post
title: How to reuse custom LoopBack Repository code
date: 2020-06-02
author: Miroslav Bajtoš
permalink: /strongblog/2020-share-repository-code/
categories:
  - LoopBack
---

When building a LoopBack 4 application, we often need to tweak or improve the default data access behavior provided by the framework. It's usually desirable to apply the same set of customizations for multiple models, possibly across several microservices. In this post, I'd like to share a few tips and tricks for reusing such repository code.

<!--more-->

## Using a Repository Base Class

In this approach, you insert a new repository class (the Repository Base Class, e.g. `AuditableRepository`) between your model-specific repository class (e.g. `ProductRepository`) and the repository class provided by the framework (typically `DefaultCrudRepository`). The base class will hold any code you want to reuse in multiple model-specific repositories.

A week ago, I recorded a screencast showing the concept of Repository base classes in practice, you can watch it here:

<iframe width="560" height="315" src="https://www.youtube.com/embed/s2yDaKiNYCg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

The first step is to create a new source code file and implement an empty Repository Base Class. It's important to use `.repository.base.ts` suffix in the file name, this will allow `lb4 repository` to recognize the file as contributing a base class.

```ts
// src/repositories/auditing.repository.base.ts
import {
  DefaultCrudRepository,
  Entity,
  juggler,
} from '@loopback/repository';

export class AuditingRepository<
  T extends Entity,
  ID,
  Relations extends object = {}
> extends DefaultCrudRepository<T, ID, Relations> {
  // put the shared code here
}
```

You should also add an entry to `src/repositories/index.ts` file to re-export the new class:

```ts
// src/repositories/index.ts
export * from './auditing.repository.base';
```

When you run `lb4 repository` command now, it will find our new base class and offer it in the prompts:

```
$ lb4 repository
? Please select the datasource DbDatasource
? Select the model(s) you want to generate a repository for Product
? Please select the repository base class (Use arrow keys)
❯ DefaultCrudRepository (Legacy juggler bridge)
  ----- Custom Repositories -----
  AuditingRepository
```

I will not go into details on implementing custom persistence behavior here, please watch the screencast to learn how to create a repository class that sets the model property `modifiedBy` to the currently authenticated user on every write operation.

Once you have the repository base class implemented, you may want to share it between multiple projects (e.g. microservices). I recommend creating a LoopBack 4 extension providing the base class and packaging the extension as a standalone npm module..

1. Create a new LoopBack 4 extension using `lb4 extension`
2. Move `src/repositories/auditing.repository.base.ts` file to the extension (you can use the same file name and path, i.e. `src/repositories/auditing.repository.base.ts`)
3. In the extension, update `src/repositories/index.ts` and `src/index.ts` to re-export (new) artifacts.
4. Publish the extension to your (private) npm registry or add it as a new package to your monorepo.

In order to use the repository base class from the extension in an application project, we have a bit of work to do. At the moment, `lb4 repository` does not scan dependencies in `node_modules` for repository base classes. To make the base class discoverable by LoopBack's CLI, you can add a tiny wrapper file to your application into a location discoverable by the CLI. Implementation-wise, the wrapper just re-exports the base class provided by the extension.

```ts
// src/repositories/auditing.repository.base.ts
export {AuditingRepository} from 'my-extension-name';
```

That's it! Now you can easily create new model-specific repositories using `lb4 repository` and select your shared repository as the base class.

## Using a Repository Mixin

While easy to use, Repository Base Classes have few shortcomings too.

1. JavaScript does not support multiple inheritance, thus it's not possible to combine behavior from multiple repository base classes in the same model-specific repository class.

2. Inheritance-based reuse is considered to be an anti-pattern in Object Oriented Design; it's recommended to use composition instead ("prefer composition over inheritance").

Let's take a look on how to use Mixins to share bits of repository code via composition.

Instead of creating a repository base class, we will create a repository mixin using the [mixin class pattern](https://loopback.io/doc/en/lb4/Mixin.html).

```ts
import {MixinTarget} from '@loopback/core';
import {CrudRepository, Model} from '@loopback/repository';

export function AuditingRepositoryMixin<
  M extends Model,
  R extends MixinTarget<CrudRepository<M>>
>(superClass: R) {
  return class extends superClass {
    // put the shared code here
  };
}
```

Because `lb4 repository` does not support repository mixins yet, you have to edit model repository classes manually to apply your new mixin.

```ts
import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {AuditingRepositoryMixin} from '../mixins/auditing.repository-mixin';
import {Product, ProductRelations} from '../models';

export class ProductRepository extends AuditingRepositoryMixin<
  Product,
  Constructor<
    DefaultCrudRepository<
      Product,
      typeof Product.prototype.id,
      ProductRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(Product, dataSource);
  }
}
```

We are discussing CLI support for repository mixins in [loopback-next#5565](https://github.com/strongloop/loopback-next/issues/5565), please leave a comment to let us know if you are interested in this feature.

Mixins are easy to share via LoopBack extensions too:

1. Create a new LoopBack 4 extension using `lb4 extension`
2. Move `src/mixins/auditing.repository-mixin.ts` file to the extension
3. In the extension, update `src/mixins/index.ts` and `src/index.ts` to re-export (new) artifacts.
4. Publish the extension to your (private) npm registry or add it as a new package to your monorepo.
5. In your application, update `import` statements to import the shared repository mixin from the extension.

## Composing mixins together

When using a repository base class, it's easy to apply all project-specific behavior via a single base class. We can build a composite mixin to achieve the same easy of use with mixins too.

Let's say we already have `AuditingRepositoryMixin` and `TimeStampRepositoryMixin` implemented, and now we want to create `MyProjectRepositoryMixin` that will apply those two mixins, so that repository classes in our project don't have to repeat the list of mixins to apply.

```ts
// src/mixins/my-project.repository-mixin.ts
export function MyProjectRepositoryMixin<
  M extends Model,
  R extends MixinTarget<CrudRepository<M>>
>(superClass: R) {
  return AuditingRepositoryMixin(TimeStampRepositoryMixin(superClass));
}
```


## TypeScript limitations

Now you may be thinking: can we define a repository base class that would be recognized by `lb4 repository` and would apply all required mixins?  Unfortunately, the answer is NO.

Consider the following code:

```ts
// src/repositories/base.repository.base.ts
export class BaseRepository<
  T extends Entity,
  ID,
  Relations extends object = {}
> extends MyProjectRepositoryMixin<
  T,
  Constructor<DefaultCrudRepository<T, ID, Relations>>
>(DefaultCrudRepository) {
  // empty class
}
```

TypeScript reports the following error during compilation:

```
error TS2562: Base class expressions cannot reference class type parameters.
```

You can learn more about this problem and the reasoning for the current compiler behavior in GitHub issue [Mixin does not allow Generic](https://github.com/Microsoft/TypeScript/issues/26154).

## Conclusion

In this post, I explained how to extract bits of Repository code into a reusable form and how to share them by creating a new LoopBack extension. We discussed two options: an inheritance-based approach that uses Repository Base Class and a composition-based approach that uses Repository Mixin. Along the way, we discovered a few areas where TypeScript and LoopBack could improve the developer experience.

I hope you will find these techniques useful.

## Call to Action

LoopBack's success depends on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Here's how you can join us and help the project:

- Join the discussion in [loopback-next#5565](https://github.com/strongloop/loopback-next/issues/5565) and let us know if you are interested in CLI support for repository mixins.
- [Join the community Slack chat](https://join.slack.com/t/loopbackio/shared_invite/zt-8lbow73r-SKAKz61Vdao~_rGf91pcsw)
- [Report issues](https://github.com/strongloop/loopback-next/issues).
- [Contribute](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md) code and documentation.
- [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue).
