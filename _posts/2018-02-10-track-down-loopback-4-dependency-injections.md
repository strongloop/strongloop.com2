---
layout: post
title: Track down dependency injections with LoopBack 4
date: 2018-02-10T01:40:15+00:00
author: Raymond Feng
permalink: /strongblog/loopback-4-track-down-dependency-injections
categories:
  - LoopBack
  - Community
---

LoopBack 4 implements an IoC container to support dependency injection with decorators. You can find more information at http://loopback.io/doc/en/lb4/Dependency-injection.html. 

Dependency injection is very powerful, but when something goes wrong, it can get ugly. Circular dependencies and resolution errors can leave you with layers of bindings and injections to sift through to track down even small problems.

But there's no reason to panic! We've recently introduced the ability to track down the dependency injection path to help you out. Let's start with an example before we dive into the details of the feature.

Example 1: [circular-deps.ts](https://github.com/raymondfeng/loopback4-example-di/blob/master/src/circular-deps.ts)
```ts
import {Context, inject} from '@loopback/context';

interface Developer {
  // Each developer belongs to a team
  team: Team;
}

interface Team {
  // Each team works on a project
  project: Project;
}

interface Project {
  // Each project has a lead developer
  lead: Developer;
}

class DeveloperImpl implements Developer {
  constructor(@inject('team') public team: Team) {}
}

class TeamImpl implements Team {
  constructor(@inject('project') public project: Project) {}
}

class ProjectImpl implements Project {
  constructor(@inject('lead') public lead: Developer) {}
}

export function main() {
  const context = new Context();

  context.bind('lead').toClass(DeveloperImpl);
  context.bind('team').toClass(TeamImpl);
  context.bind('project').toClass(ProjectImpl);

  try {
    // The following call will fail
    context.getSync('lead');
  } catch (e) {
    console.error(e.toString());
  }
}

if (require.main === module) {
  main();
}
```

Do you see a problem with the code above? Let's give a try:

```sh
git clone git@github.com:raymondfeng/loopback4-example-di.git
cd loopback4-example-di
npm i
node dist/src/circular-deps
```

`Error: Circular dependency detected: lead --> @DeveloperImpl.constructor[0] --> team --> @TeamImpl.constructor[0] --> project --> @ProjectImpl.constructor[0] --> lead`.

That's great. Now we know there is a circular dependency formed by the following path:

1. Binding 'lead'
2. Injection of first argument of `DeveloperImpl`'s constructor
3. Binding 'team'
4. Injection of first argument of `TeamImpl`'s constructor
5. Binding 'project'
6. Injection of first argument of `ProjectImpl`'s constructor
7. Binding 'lead'

To see how what's happening behind the scenes, let's set the `DEBUG` environment variable to `loopback:context:resolver:session` and run the code again.

On Mac or Linux:
```sh
DEBUG=loopback:context:resolver:session node dist/src/circular-deps
```

On Windows:
```
set DEBUG=loopback:context:resolver:session
node dist/src/circular-deps
```

The complete trace is now printed out on the console:
```
  loopback:context:resolver:session Enter binding: { key: 'lead',
  scope: 'Transient',
  tags: [],
  isLocked: false,
  type: 'Class' } +0ms
  loopback:context:resolver:session Resolution path: lead +2ms
  loopback:context:resolver:session Enter injection: { targetName: 'DeveloperImpl.constructor[0]',
  bindingKey: 'team',
  metadata: { decorator: '@inject' } } +1ms
  loopback:context:resolver:session Resolution path: lead --> @DeveloperImpl.constructor[0] +0ms
  loopback:context:resolver:session Enter binding: { key: 'team',
  scope: 'Transient',
  tags: [],
  isLocked: false,
  type: 'Class' } +0ms
  loopback:context:resolver:session Resolution path: lead --> @DeveloperImpl.constructor[0] --> team +1ms
  loopback:context:resolver:session Enter injection: { targetName: 'TeamImpl.constructor[0]',
  bindingKey: 'project',
  metadata: { decorator: '@inject' } } +0ms
  loopback:context:resolver:session Resolution path: lead --> @DeveloperImpl.constructor[0] --> team --> @TeamImpl.constructor[0] +0ms
  loopback:context:resolver:session Enter binding: { key: 'project',
  scope: 'Transient',
  tags: [],
  isLocked: false,
  type: 'Class' } +0ms
  loopback:context:resolver:session Resolution path: lead --> @DeveloperImpl.constructor[0] --> team --> @TeamImpl.constructor[0] --> project +0ms
  loopback:context:resolver:session Enter injection: { targetName: 'ProjectImpl.constructor[0]',
  bindingKey: 'lead',
  metadata: { decorator: '@inject' } } +0ms
  loopback:context:resolver:session Resolution path: lead --> @DeveloperImpl.constructor[0] --> team --> @TeamImpl.constructor[0] --> project --> @ProjectImpl.constructor[0] +0ms
  loopback:context:resolver:session Enter binding: { key: 'lead',
  scope: 'Transient',
  tags: [],
  isLocked: false,
  type: 'Class' } +0ms
  loopback:context:resolver:session Circular dependency detected: lead --> @DeveloperImpl.constructor[0] --> team --> @TeamImpl.constructor[0] --> project --> @ProjectImpl.constructor[0] --> lead +0ms
```

The feature is made possible with the [`ResolutionSession`](https://github.com/strongloop/loopback-next/blob/master/packages/context/src/resolution-session.ts) class which tracks a stack of bindings and injections.

In the program above, `context.getSync('lead')` does the following:

- Resolve the binding for key `'lead'`, which is bound to `DeveloperImpl`. `Binding lead` is pushed to the session.
- Resolve injections for parameters of `DeveloperImpl`'s constructor. First parameter is binding 'team'. `Injection DeveloperImpl.constructor[0]` is pushed to the session. 
- Resolve the binding for key `'team'`, which is bound to `TeamImpl`. `Binding team` is pushed to the session.
- Resolve injections for parameters of `TeamImpl`'s constructor. First parameter is binding 'project'. `Injection TeamImpl.constructor[0]` is pushed to the session. 
- Resolve the binding for key `'project'`, which is bound to `ProjectImpl`. `Binding project` is pushed to the session.
- Resolve injections for parameters of `ProjectImpl`'s constructor. First parameter is binding 'lead'. `Injection ProjectImpl.constructor[0]` is pushed to the session. 
- Resolve the binding for key `'lead'`. The session detects that `Binding lead` is already on the stack and a circular dependency is found.

The complete resolution process is illustrated as follows:

<img src="/blog-assets/2018/02/loopback4-dependency-resolution.png" alt="LoopBack 4 Dependency Resolution"/>

In addition to detect circular dependencies as shown in Example 1, the `ResolutionSession` can be used to access contextual information following the resolution path. Let me show you two more examples:

## Advanced usage
 
### Access the session from code

The second example uses a custom resolve function for the `@inject` decorator to access the resolution session.

Example 2: [resolution-path.ts](https://github.com/raymondfeng/loopback4-example-di/blob/master/src/resolution-path.ts)
```ts
import {Context, inject, ResolutionSession, Injection} from '@loopback/context';

export function main() {
  const context = new Context();
  let resolutionPath = '';

  class Project {
    @inject(
      'p',
      {},
      // Set up a custom resolve() to access information from the session
      (c: Context, injection: Injection, session: ResolutionSession) => {
        resolutionPath = session.getResolutionPath();
      },
    )
    myProp: string;
  }

  class Team {
    constructor(@inject('project') public project: Project) {}
  }

  class Developer {
    constructor(@inject('team') public team: Team) {}
  }

  context.bind('developer').toClass(Developer);
  context.bind('team').toClass(Team);
  context.bind('project').toClass(Project);
  context.getSync('developer');
  console.log('Resolution path: %s', resolutionPath);
  // developer --> @Developer.constructor[0] --> team --> @Team.constructor[0]
  // --> project --> @Project.prototype.myProp
}

if (require.main === module) {
  main();
}
```

### Create a special `@inject` that resolves things against the stack

The third example creates a custom injector as a decorator.

Example 3: [inject-path.ts]((https://github.com/raymondfeng/loopback4-example-di/blob/master/src/inject-path.ts))
```ts
import {Context, inject, ResolutionSession, Injection} from '@loopback/context';

/**
 * Create a decorator for injecting the resolution path
 */
export function resolutionPath() {
  return inject(
    '',
    {decorator: '@resolutionPath'},
    (c: Context, injection: Injection, session: ResolutionSession) => {
      return session.getResolutionPath();
    },
  );
}

export function main() {
  const context = new Context();

  class Project {
    // Set up the project injection
    @resolutionPath() resolutionPath: string;
  }

  class Team {
    constructor(@inject('project') public project: Project) {}
  }

  class Developer {
    constructor(@inject('team') public team: Team) {}
  }

  context.bind('developer').toClass(Developer);
  context.bind('team').toClass(Team);
  context.bind('project').toClass(Project);
  const developer: Developer = context.getSync('developer');
  console.log(developer.team.project.resolutionPath);
  // developer --> @Developer.constructor[0] --> team --> @Team.constructor[0]
  // --> project --> @Project.prototype.resolutionPath
}

if (require.main === module) {
  main();
}
```

Now you can use `@resolutionPath` to inject the resolution path. You can even
go beyond that by leveraging the `context` and `session` to perform more advanced
resolutions.

## Use `@loopback/context` outside of LoopBack

It's worth mentioning that `@loopback/context` can be used as a standalone module
outside of LoopBack framework and we encourage you to try it out. This package is
a fully-fledged implementation of `Inversion of Control` and `Dependency Injection`.
Simply add it to your Node.js project with `npm i @loopback/context` and be
productive with our robust IoC container for TypeScript/Node.js.

For more information, see LoopBack 4 [Context](http://loopback.io/doc/en/lb4/Context.html) and
[Dependency Injection](http://loopback.io/doc/en/lb4/Dependency-injection.html).

## Call for action

LoopBack's future success counts on you. We appreciate your continuous support
and engagement to make LoopBack even better and meaningful
for your API creation experience. Please join us and help the project by:

* [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
* [Reporting issues](https://github.com/strongloop/loopback-next/issues)
* [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
* [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)
