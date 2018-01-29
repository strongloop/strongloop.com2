---
title: LoopBack MVP - Generate Controllers
date: 2018-1-30T01:00:13+00:00
author: Kevin Delisle
permalink: /strongblog/loopback-next-2018-01/
categories:
  - Community
  - LoopBack
---

Work has been going non-stop on the upcoming
[LoopBack 4.0 MVP](https://github.com/strongloop/loopback-next),
and we'd like to share some of what we've just added in the current release!

We've just added the new controller generation command to the `lb4` CLI toolkit,
which you can install with `npm i -g @loopback/cli`.

### How controllers work in LoopBack 4
Controllers are what sit in the middle of the request-response lifecycle of
LoopBack 4. Incoming requests are routed by the RestServer to an instance of
a controller that has been configured to handle the appropriate route.

Controllers often work with a repository and a model definition in order to
facilitate CRUD operations between the client making requests and whatever
datasources might be wired up to your LoopBack 4 application.

Previously, you would have to build most of the boilerplate for a controller
yourself, but now, all you need to do is run a command and answer a few simple
questions!

### Using the new controller template tool

Install the new loopback CLI toolkit:
```
$ npm i -g @loopback/cli
```

Run the command to download the template application:
```
$ lb4 example
? What example would you like to clone?
  codehub: A GitHub-like application we used to use to model LB4 API.
❯ getting-started: An application and tutorial on how to build with LoopBack 4.
```

Jump into the `loopback4-example-getting-started` directory and install
the dependencies required to run it.
```
$ cd loopback4-example-getting-started
$ npm i
```

As of the time of this writing, the CLI template is a closer representation of
the end goal than the original TodoController in
`loopback4-example-getting-started`, so we're going to replace the existing
TodoController (`todo.controller.ts`) with a new one. Delete the controller from
the controllers folder. Additionally, since this will break the existing test
suite, we'll remove that as well.
```
$ rm ./src/controllers/todo.controller.ts
$ rm ./test/unit/controllers/todo.controller.test.ts
```

Run the `lb4 controller` command and generate a replacement!
```
$ lb4 controller
```

At the prompt, enter the name of the controller. You don't need to add
the word "Controller" at the end!
```
? Controller class name: Todo
? What kind of controller would you like to generate?
  Empty Controller
❯ REST Controller with CRUD functions
```

Next, select from the list of available models. In this example, we only
have one model.
```
? What is the name of the model to use with this CRUD repository?
❯ Todo
```

Now select from the available repositories. This example is also limited
to one repository.
```
? What is the name of your CRUD repository?
❯ TodoRepository
```

Finally, define what type is being used for the Model ID. This is currently
limited to numbers, strings, and objects.
```
? What is the type of your ID?
❯ number
  string
  object
```

The tool will generate the new controller file in the original location.
```
   create src/controllers/todo.controller.ts

Controller Todo is now created in src/controllers/
```

If we look inside the controller file, it should look something like this
```ts
import {Filter, Where} from '@loopback/repository';
import {post, param, get, put, patch, del} from '@loopback/openapi-v2';
import {inject} from '@loopback/context';
import {Todo} from '../models';
import {TodoRepository} from '../repositories';

export class TodoController {

  constructor(
    @inject('repositories.TodoRepository')
    public todoRepository : TodoRepository,
  ) {}

  @post('/todo')
  async create(@param.body('obj') obj: Todo)
    : Promise<Todo> {
    return await this.todoRepository.create(obj);
  }

  @get('/todo/count')
  async count(@param.query.string('where') where: Where) : Promise<number> {
    return await this.todoRepository.count(where);
  }

  @get('/todo')
  async find(@param.query.string('filter') filter: Filter)
    : Promise<Todo[]> {
      return await this.todoRepository.find(filter);
  }

  @patch('/todo')
  async updateAll(@param.query.string('where') where: Where,
    @param.body('obj') obj: Todo) : Promise<number> {
      return await this.todoRepository.updateAll(where, obj);
  }

  @del('/todo')
  async deleteAll(@param.query.string('where') where: Where) : Promise<number> {
    return await this.todoRepository.deleteAll(where);
  }

  @get('/todo/{id}')
  async findById(@param.path.number('id') id: number) : Promise<Todo> {
    return await this.todoRepository.findById(id);
  }

  @patch('/todo/{id}')
  async updateById(@param.path.number('id') id: number, @param.body('obj')
   obj: Todo) : Promise<boolean> {
    return await this.todoRepository.updateById(id, obj);
  }

  @del('/todo/{id}')
  async deleteById(@param.path.number('id') id: number) : Promise<boolean> {
    return await this.todoRepository.deleteById(id);
  }
}
```
You can then modify the template to add business logic to these handler
functions, or add totally new ones!

Feel free to start the app and play around with it! In this example, I grab
the existing todos from the sample database and pipe them into
[jq](https://stedolan.github.io/jq/) for some pretty formatting.
```
npm start
Server is running on port 3000
$ curl 127.0.0.1:3000/todo | jq
[
  {
    "id": 1,
    "title": "Take over the galaxy",
    "desc": "MWAHAHAHAHAHAHAHAHAHAHAHAHAMWAHAHAHAHAHAHAHAHAHAHAHAHA"
  }
]
```

## Call for action

LoopBack's future success counts on you. We appreciate your continuous support
and engagement to make LoopBack even better and meaningful for your API creation
experience. Please join us and help the project by:

* [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
* [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
* [Reporting issues](https://github.com/strongloop/loopback-next/issues)
* [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
* [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)



