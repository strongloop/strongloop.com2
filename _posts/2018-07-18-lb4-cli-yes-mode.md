---
layout: post
title: LoopBack 4 Introduces Express Mode for CLI 
date: 2018-07-18T00:01:01+00:00
author: Raymond Feng
permalink: /strongblog/loopback4-cli-express-mode
categories:
  - Community
  - LoopBack
---

As we continue to work on [LoopBack 4](http://v4.loopback.io/), we’re excited to tell you about new ways for developers to build with it via the LoopBack 4 CLI. 

LoopBack 4 CLI is a powerful tool for developers to scaffold projects and provision artifacts. There are a few different ways to provide input to drive the commands:

- As options or arguments to the command, for example:

```sh
lb4 app --name order-app
```

<!--more-->
- As questions and answers to the interactive prompts, for example:

```sh
lb4 app
? Project name: order-app
? Project description: order-app
? Project root directory: order-app
? Application class name: OrderApplication
? Select project build settings:  (Press <space> to select, <a> to toggle all, <
i> to invert selection)
❯◉ Enable tslint
 ◉ Enable prettier
 ◉ Enable mocha
 ◉ Enable loopbackBuild
 ◉ Enable vscode
```

Options and arguments are good for build automation while questions and answers are friendly to user interactions. For different cases, developers might prefer one way or the other. Sometimes it even seems to be a conflict of interest as some developers ask for finer control with more questions while others want to accept reasonable defaults without being prompted for confirmation. In responding to such feedbacks, we asked the community for opinions at [https://github.com/strongloop/loopback-next/issues/1309](https://github.com/strongloop/loopback-next/issues/1309). Now I'm glad that we have come up a solution that allows the choices of both flavors.

## Install Latest Version of LoopBack 4 CLI

```sh
npm i -g @loopback/cli
```

`lb4 -v` should show `@loopback/cli version: 0.17.0` (or newer).

## Accept Options from a JSON File/Value or Standard Input

`-c or --config <file path to a json file, stringified json, or stdin>`

Here are some examples assuming `order-app.json` has the following content:

```json
{
  "name": "order-app"
}
```

1.  Pass in options as stringified json object

```sh
lb4 app -c '{"name":"order-app"}'
```

2.  Pass in options from a json file

```sh
lb4 app --config order-app.json
```

3.  Pass in options from a json file via input redirection

```sh
lb4 app --config stdin < order-app.json
```

or

```sh
lb4 app --config stdin << EOF
{"name":"order-app"}
EOF
```

4.  Pass in options from a json file via pipe

```sh
cat order-app.json | lb4 app --config stdin
```

## Skip Optional Prompts to Run a Command in Express Mode

`-y or --yes`

```sh
lb4 app --name order-app --yes
```

## Derive Answers from Options or Default Values

With `--yes` or `-y` option, the command will be executed in express model to minimize the number of questions to be prompted.

For any given question, the prompt is skipped if one of the following condition is true:

1.  There is a value with the matching name in options
2.  A default value can be calculated from the `default`

Please note questions that are not answered in options or do not have default values are still prompted.

## Combine `--yes` and `--config`

By combining the two options, we can script against `lb4` commands for automation without user intervention. For example:

```sh
lb4 app --config order-app.json --yes
cat order-app.json | lb4 app --config stdin --yes
```

Available options vary by commands and they can be listed using `lb4 <command> --help`. For example, `lb4 app --help` gives the following information:

```
lb4 app --help
Usage:
  lb4 app [<name>] [options]

Options:
  -h,   --help             # Print the generator's options and usage
        --skip-cache       # Do not remember prompt answers                                Default: false
        --skip-install     # Do not automatically install dependencies                     Default: false
        --applicationName  # Application class name
        --description      # Description for the application
        --outdir           # Project root directory for the application
        --tslint           # Enable tslint
        --prettier         # Enable prettier
        --mocha            # Enable mocha
        --loopbackBuild    # Use @loopback/build
        --vscode           # Use preconfigured VSCode settings
        --private          # Mark the project private (excluded from npm publish)
  -c,   --config           # JSON file name or value to configure options
  -y,   --yes              # Skip all confirmation prompts with default or provided value

Arguments:
  name  # Project name for the application  Type: String  Required: false
```

The JSON configuration can be something like:

```json
{
  "applicationName": "MyApp",
  "description": "My application",
  "tslint": true,
  "prettier": true,
  ...
}
```

As you have seen, LoopBack 4 CLI can help developers scaffold projects and provision artifacts in a few different ways. We hope being in the loop with these options helps your current and future projects!

## Call for Action

LoopBack's future success counts on you. We appreciate your continuous support and engagement to make LoopBack even better and meaningful for your API creation experience. Please join us and help the project by:

- [Opening a pull request on one of our "good first issues"](https://github.com/strongloop/loopback-next/labels/good%20first%20issue)
- [Casting your vote for extensions](https://github.com/strongloop/loopback-next/issues/512)
- [Reporting issues](https://github.com/strongloop/loopback-next/issues)
- [Building more extensions](https://github.com/strongloop/loopback-next/issues/647)
- [Helping each other in the community](https://groups.google.com/forum/#!forum/loopbackjs)

## What's Next?

- Check out upcoming Node.js, API Development, and Integration [events](https://strongloop.com/events/) with the StrongLoop and IBM team. 
