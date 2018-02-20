---
title: Moving LoopBack 4 example project to the monorepo
date: 2018-02-08T01:00:13+00:00
author: Miroslav Bajtoš
permalink: /strongblog/moving-examples-to-monorepo/
categories:
  - Community
  - LoopBack
---

We often face a dilemma around example projects. They are useful learning
resources that demonstrate individual features in a runnable application and
make it easy to tweak and play with the code. But on the other hand, they can
quickly become a maintenance burden as the framework evolves and significant
ongoing efforts are needed to keep these examples up to date with the latest
APIs, conventions, and best practices.

Our CLI tooling makes it so easy to quickly create a new project, we did not
resist the temptation and ended up with about 18 example projects. To update
them, one has to open 18 pull requests - that's a lot of tedious work!

When work on LoopBack 4 (a.k.a Next) started, maintenance of example projects
was off the radar. There was too much more important work in other areas; from
figuring out Lerna monorepo with TypeScript builds, to finding the right design
and APIs that will enable us to address pain points of LoopBack 3.x codebase.

Recently, we started to look into some cleanup tasks (e.g. dropping support for
Node.js 6.x - see [issue #611](https://github.com/strongloop/loopback-next/issues/611))
and realized that with 8 example projects living in their own GitHub
repositories, many changes that are easy to apply in the main monorepo
are turning into long and tedious tasks.

Around that time we started to ask ourselves why are example projects living
outside of our monorepo, when we decided at the beginning to keep everything in
a single repository? The main reason was user experience: we did not want our
users to git clone the entire monorepo when they are interested only in a single
example project! Fortunately, we found an easy solution: a CLI tool that
downloads only files of the desired example project.

And so `lb4 example` was born.

```text
$ lb4 example
? What example would you like to clone? (Use arrow keys)
❯ getting-started: An application and tutorial on how to build with LoopBack 4.
  hello-world: A simple hello-world Application using LoopBack 4
  log-extension: An example extension project for LoopBack 4
  rpc-server: A basic RPC server using a made-up protocol.
```

After you select the example to download, the tool makes an HTTPS request to
download a tarball containing the latest code from our monorepo and extract
only the files of the selected example project.

```text
$ lb4 example
? What example would you like to clone? getting-started

The example was cloned to loopback4-example-getting-started.
```

## Under the hood

We use GitHub's [Get archive link API](https://developer.github.com/v3/repos/contents/#get-archive-link) to
download an archive containing the current `master` branch, then extract files
from the relevant example package directory and place them in a newly created
local directory, renaming file entries from `packages/example-{name}/{path}` to
`loopback4-example-{name}/{path}` along the way. As a nice side effect, users
don't need `git` installed in order to obtain our example projects.

GitHub offers two archive formats: ZIP and tar+gzip, where the ZIP format is
prominently offered on the website. Because I was not aware of the Archive API,
my first implementation was downloading a ZIP archive. We were not very happy
about this solution though.

[yauzl](https://www.npmjs.com/package/yauzl), a popular implementation of
zip/unzip, does not provide streaming mode, therefore we had to save the
downloaded archive to a temp file. Initially we thought this is a limitation of
yauzl, but further examination revealed a limitation of the ZIP format.
Quoting from yauzl's [No Streaming Unzip API](https://www.npmjs.com/package/yauzl#no-streaming-unzip-api):

> Due to the design of the .zip file format, it's impossible to interpret a
> .zip file from start to finish (such as from a readable stream) without
> sacrificing correctness. The Central Directory, which is the authority on
> the contents of the .zip file, is at the end of a .zip file, not the
> beginning. A streaming API would need to either buffer the entire .zip
> file to get to the Central Directory before interpreting anything
> (defeating the purpose of a streaming interface), or rely on the Local
> File Headers which are interspersed through the .zip file. However, the
> Local File Headers are explicitly denounced in the spec as being
> unreliable copies of the Central Directory, so trusting them would be a
> violation of the spec.

yauzl's API was also too low-level, see how involved the ZIP version of
`extractExample()` is: [packages/cli/example/clone-example.js@0359a262](https://github.com/strongloop/loopback-next/blob/0359a2627cc8c5adb149acc16a4e1918716ac607/packages/cli/generators/example/clone-example.js#L64-L106).
The module [extract-zip](https://www.npmjs.com/package/extract-zip) provides a
higher-level API that's easier to use, but unfortunately it's designed in a way
that makes our task of filtering and renaming files impossible to implement.

After [Raymond](https://github.com/raymondfeng) pointed out that GitHub offers
tar+gzip archives too, I rewrote my code to handle tarballs instead of ZIP
archives and the result is so much nicer! No temp files to deal with, just few
lines of Stream piping:

```js
  return new Promise((resolve, reject) => {
    request(GITHUB_ARCHIVE_URL)
      .pipe(gunzip())
      .pipe(untar(outDir, exampleName))
      .on('error', reject)
      .on('finish', () => resolve(outDir));
  });
```

The implementation of `untar()` is still more complex than I would like,
because of the way how [tar-fs](https://www.npmjs.com/package/tar-fs) applies
"map" and "filter" operators, but at least that complexity does not leak out of
our `untar()` method.

You can find the full source code of downloading and extracting example files
here:
[packages/cli/example/clone-example.js](https://github.com/strongloop/loopback-next/blob/75479f448aea20dc7f28d27d4f6cd315ca5d0137/packages/cli/generators/example/clone-example.js).

## Closing thoughts

While working on the examples, I made few more related changes.

The doc page [Examples and
tutorials](http://loopback.io/doc/en/lb4/Examples-and-tutorials.html) now
contains an updated list of examples we are maintaining, together with brief
instructions showing users how to obtain individual examples.

We have deprecated example projects that are not useful anymore:
[loopback4-extension-typeorm](https://github.com/strongloop/loopback4-extension-typeorm),
[loopback-next-hello-world](https://github.com/strongloop/loopback-next-hello-world)
and
[loopback4-extension-starter](https://github.com/strongloop/loopback4-extension-starter).

The example project "loopback-next-example" is showcasing a monorepo with
multiple microservices. We feel it does not belong to our monorepo: it's a
monorepo on its own and it will eventually depend on external tools like
microservices orchestrator that we don't want to bring into our main monorepo.
I renamed the project to better tell its purpose:
[loopback4-example-microservices](https://github.com/strongloop/loopback4-example-microservices).
Please note the codebase is rather outdated and doesn't even compile against
the latest alpha versions of LoopBack4, this is something we need to fix soon
(see
[loopback4-example-microservices#76](https://github.com/strongloop/loopback4-example-microservices/issues/76)).

## Call for action

LoopBack's future success counts on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

* [Open a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
* [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
* [Reporting issues](https://github.com/strongloop/loopback-next/issues)
* [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
* [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)
