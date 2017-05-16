---
id: 29162
title: Announcing Open Source LoopBack JSONSchemas VS Code Extension
date: 2017-05-02T08:00:47+00:00
author: Sequoia McDowell
guid: http://strongloop.com/?p=29162
permalink: /strongblog/announcing-loopback-jsonschemas-vs-code-extension/
categories:
- LoopBack
- JavaScript Language
- Resources
- How-To
---
LoopBack is a powerful framework. As we know, "with great framework power comes great framework documentation." When you know what you're looking for in the docs, it's easy to find. But 
discovering what's available can be a challenge for a tool as "featureful" as LoopBack. What if there were a tool that could
push the documentation to you while you code? With such a tool, you could avoid typos, find configuration errors early, and discover features or options you may not have known about.

Enter the LoopBack 3 JSON Schemas Extension for VS Code!

{%include tip.html content= '
If you just want to install the extension, search "loopback" from VS Code or find it in the VS Code marketplace 
[here](https://marketplace.visualstudio.com/items?itemName=sequoia.loopback-json-schemas).
' %}

What does it do? Let's take a look:
<!--more-->
## Code Hints

The plugin prompts you as you type. Hit enter to accept a suggestion, or use the up/down arrows to select one from a list of options.

![Announcing Open Source LoopBack JSONSchemas VS Code Extension: demo of code hinting](https://github.com/Sequoia/loopback-json-schemas-vscode/raw/master/hints.gif)

## Green Squiggles

If you have a mismatched type or missing property, you'll get a green squiggle underline. Great for locating typos!

![Announcing Open Source LoopBack JSONSchemas VS Code Extension: demo of green squiggles on problems](https://github.com/Sequoia/loopback-json-schemas-vscode/raw/master/green-squiggles.gif)

### Ctrl+Space

Hit
ctrl+space to be shown available
**properties**
...

![Announcing Open Source LoopBack JSONSchemas VS Code Extension: ctrl+space demo](https://github.com/Sequoia/loopback-json-schemas-vscode/raw/master/ctrl-space.gif)

...as well as 
**values**
 for those properties that have a finite set of acceptable options:

![Announcing Open Source LoopBack JSONSchemas VS Code Extension: ctrl+space demo for enumerated type](https://github.com/Sequoia/loopback-json-schemas-vscode/raw/master/ctrl-space-type.gif)

### Links

Some documentation is right inline, but in places where configuration can be more complex you'll be offered a link to click through to the full documentation:

![Announcing Open Source LoopBack JSONSchemas VS Code Extension: clicking links from tooltip](https://github.com/Sequoia/loopback-json-schemas-vscode/raw/master/links.gif)

## Give it a Try

The project is open source, so if you'd like to contribute or need to file a bug, you can do so on github:

- The [JSONSchemas repository](https://github.com/sequoia/loopback-json-schemas) holds the schemas themselves, which is the bulk of the project. If you find an problem with a schema, this is where to file an issue. Note that the schemas can be used with any tool that supports JSONSchemas. You don't have to use the VS Code extension, it's the easiest way.
- The 
[VS Code Extension repository](https://github.com/sequoia/loopback-json-schemas-vscode) hosts "the extension" which is little more than some configuration settings for VS Code that say "when the users opens a file called (e.g.)
server/middleware.json, load the following JSONSchema and validate against it." File an issue here if you're having a problem with the plugin itself.

If you have any questions or feedback, you can file an issue or
[ask me about it online](https://twitter.com/_sequoia). Happy coding!
