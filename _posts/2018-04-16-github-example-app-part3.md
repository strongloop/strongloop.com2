---
layout: post
title: LoopBack 4 GitHub Example Application - Persist Data to Cloudant   (Part 3 of 3)
date: 2018-04-16T00:00:13+00:00
author: Diana Lau
permalink: /strongblog/loopback4-github-example-app-part3/
categories:
  - Community
  - LoopBack
---

In this series, we will work through creating a basic LoopBack 4 application
that exposes REST APIs, calls out to GitHub APIs through [octokat.js](https://github.com/philschatz/octokat.js) (a GitHub API client) 
to get the number of stargazers on a user-specified GitHub organization and repository,
and persists the data into a Cloudant database.

<!-- more -->
### Previously in Part 2
In the Part 2 of this series, we created a REST endpoint that gets 
the number of stargazers for a GitHub repository by using 
[octokat.js](https://github.com/philschatz/octokat.js).

Since GitHub does not keep track of the history on how the number of stargazers change
over time.  In this article, we are going to complete the application by persisting such 
data into a [Cloudant](https://console.bluemix.net/catalog/services/cloudant-nosql-db) database.  

<img src="../blog-assets/2018/04/github-app-cloudant.png" alt="Creating Model, DataSource and Repository" style="width: 400px; margin:auto;"/>

### Step 1: Defining the model
First, we define the model for the data to be persisted in the database.
The model `GHStars` we are creating extends from a base class `Entity` 
from `@loopback/repository` and has the following properties:
- org: GitHub organization
- repo: GitHub repository
- stars: number of stars for the given org/repo
- countdate: date of the entry being created

Under `models` folder, create a file called `gh-stars.model.ts`.  
Add the snippet below to `gh-stars.model.ts`.  
```ts
@model()
export class GHStars extends Entity {
    /*
     * making the id as generated
     */
    @property({
        id: true,
    })
    id?: number;

    @property({
        required: true,
    })
    org: string;

    @property({
        required: true,
    })
    repo: string;

    @property({
        required: true,
    })
    stars: number;

    @property({
        required: false,
        type: 'string',
        format: 'date'
    })
    countdate: Date;
};
```

### Step 2: Configuring the datasource
We're going to declare the datasource connection to the Cloudant database
through `datasources.json`.  In this article, [Cloudant service on IBM Cloud](https://console.bluemix.net/catalog/services/cloudant-nosql-db) is used.
Feel free to use other database with the [supported database connectors](http://loopback.io/doc/en/lb3/Database-connectors.html).  Since LoopBack 4 is leveraging 
the juggler in LoopBack 3 through the legacy juggler bridge, defining the datasource is similar 
to what we do in LoopBack 3 for those who are familiar with the older versions of LoopBack.  
For details, see http://loopback.io/doc/en/lb3/Defining-data-sources.html.  

#### Step 2a: Creating `datasources.json` for the database connection

Create a folder `config` at the root of the project and a file within this folder called `datasources.json`,  
with the following content.  Replace the `url` with your Cloudant instance.
```json
{
    "name": "db",
    "connector": "cloudant",
    "url": "https://someuserid:somepassword@someinstance-bluemix.cloudant.com",
    "database": "ghstars",
    "modelIndex": ""
}
```
_**Important**_: If you're pushing your application to GitHub, make sure you are not committing 
this file as well.  To do this, add `config/` in the `.gitignore` file.  

#### Step 2b: Creating `DataSource` class 
Next, create a DataSource class which reads the `datasources.json` we just created.

Create `db.datasource.ts` in `datasources` folder.   

```ts
import * as path from 'path';

import {juggler, DataSourceConstructor} from '@loopback/repository';

const dsConfigPath = path.resolve('config', 'datasources.json');
const config = require(dsConfigPath);
export const db = new DataSourceConstructor(config);
```


### Step 3: Creating Repository
A [Repository](http://loopback.io/doc/en/lb4/Repositories.html) is a type of Service that represents a collection of data within a DataSource. 
In this step, we are going to bind the model with the datasource.

Create `ghstar.repository.ts` in `repositories` folder, with the following snippet:
```ts
import {DefaultCrudRepository, DataSourceType} from "@loopback/repository";
import {GHStars} from "../models/gh-stars.model";
import {inject} from '@loopback/core';

export class GHStarRepository extends DefaultCrudRepository<GHStars, typeof GHStars.prototype.id> 
{
    constructor(@inject('datasources.db') protected datasource: DataSourceType) {
        super(GHStars, datasource);
    }
}
```

### Step 4: Using Repository Mixin in the Application
We are going to use the [Repository Mixin](http://loopback.io/doc/en/lb4/Repositories.html#repository-mixin) to bind the Application and Repository in `application.ts`.  

#### Step 4a: Change the application to be extended from `BootMixin(RepositoryMixin(RestApplication))`
i.e.
```ts
export class GitHubApplication extends BootMixin(RepositoryMixin(RestApplication)) {
//...
}
```
Add the following import statements:
```ts
import {RepositoryMixin, Class, Repository, juggler} from '@loopback/repository';
import {db} from './datasources/db.datasource';
```
_Note_: The unused imports are necessary as type information from these imports are needed
when mixins are used.

#### Step 4b: Binding the datasource
This can be done by setting up `bindDataSource()` function, and calling
it in the constructor of `GitHubApplication`.
```ts
bindDataSource() {
    this.dataSource(db);
}
```

### Step 5: Putting things together
As the final step, we are going to create a POST endpoint `/repo/{org}/{repo}/stars` in the 
`GHRepoController` that:
- gets the number of stargazers for a given GitHub repo, and;
- stores the information to Cloudant database



#### Step 5a: Update the contructor for the GHRepoController
In `controllers\gh-repo.controller.ts`, update the constructor to inject `repositories.GHStarRepository`.  

```ts
constructor(
    @inject('repositories.GHStarRepository')
    public ghstarRepository : GHStarRepository,) {}
```

#### Step 5b: Add new function for the `POST` endpoint
In the same `GHRepoController`, add a new function:
```ts
/**
   * Get the GitHub star count
   * and persist the value in a database
   */
  @post('/repo/{org}/{repo}/stars') 
  async storeRepoStargazers(
    @param.path.string('org') org: string,
    @param.path.string('repo') repo: string
  ): Promise<GHStars> {
    console.debug('org/repo', org, repo);
    //gets the number of stargazers for a given GitHub repo
    const repoContent = await octo.repos(org, repo).fetch();
    const stargazerNum = repoContent.stargazersCount;
    //stores the information to database
    const ghStar = new GHStars();
    ghStar.org = org;
    ghStar.repo = repo;
    ghStar.countdate = new DateType().defaultValue();
    ghStar.stars = stargazerNum;
    return await this.ghstarRepository.create(ghStar); 
  }
```
 

## Running end-to-end
Restart the application.  Go to the API explorer `localhost:3000/swagger-ui`,  
select `GHRepoController` > `POST /repo/{org}/{repo}/stars`.  
Type in the `org` and `repo` that you'd like to know about the number of stargazers.  

After running it, you should see an entry in the Cloudant database look like:
```
{
  "_id": "f0a792a6dd9dc2c60186e9e2d91441b7",
  "_rev": "1-2f128fd392901a6390c8cf3c0590f458",
  "org": "strongloop",
  "repo": "loopback-next",
  "stars": 529,
  "countdate": "Tue Mar 20 2018 13:42:48 GMT-0400 (EDT)",
  "loopback__model__name": "GHStars"
}
```

## Recap
In this blog series, we built this LoopBack GitHub application using LoopBack 4 step-by-step:
- Part 1: Scaffolding a LoopBack 4 application and creating REST APIs
- Part 2: Adding logics to the Controller to talk to GitHub APIs
- Part 3: Persisting data to Cloudant database using DataSource and Repository


## Code repository
The code repository can be found [here](https://github.com/dhmlau/loopback4-github-app).
```
git clone https://github.com/dhmlau/loopback4-github-app.git
```

## Call for Action
LoopBack's future success counts on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

* [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
* [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
* [Reporting issues](https://github.com/strongloop/loopback-next/issues)
* [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
* [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)

