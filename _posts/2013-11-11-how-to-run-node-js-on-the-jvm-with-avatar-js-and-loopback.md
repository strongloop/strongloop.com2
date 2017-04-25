---
id: 9499
title: How to run Node.js on the JVM with Avatar.js and LoopBack
date: 2013-11-11T11:52:31+00:00
author: Raymond Feng
guid: http://strongloop.com/?p=9499
permalink: /strongblog/how-to-run-node-js-on-the-jvm-with-avatar-js-and-loopback/
categories:
  - Community
  - LoopBack
---
<h2 dir="ltr">
</h2>

<h2 dir="ltr">
  <strong>Background</strong>
</h2>

[LoopBack](http://strongloop.com/strongloop-suite/loopback/) is an open source mobile API framework for Node.js from StrongLoop. It not only helps you expose REST api, but provides you the ability to build APIs, define data models, connect to data sources including databases such as MongoDB, Oracle, and MySQL. LoopBack also comes with an API explorer to see and play with the APIs. Mobile SDKs are part of the story too. LoopBack is built on top of Express and it consists of a library of modules that can be installed from the NPM registry.

As part of the LoopBack, we build a [sample application](https://github.com/strongloop/sls-sample-app) to demonstrate the features. As you expect, we run the application with the \`node\` command. The [announcement of Avatar.js](https://blogs.oracle.com/theaquarium/entry/project_avatar_is_open_source) from Oracle during JavaOne caught my eyes. Avatar.js is a server-side JavaScript for the JVM. The project is now open sourced and you can find the code [here](https://avatar-js.java.net/). Avatar.js gives us the ability to run Node.js programs on JVMs. The following is quoted from Avatar.js web site to provide a high level view:<!--more-->

> Avatar.js is a project to bring the node programming model, APIs and module ecosystem to the Java platform, enabling a new class of hybrid server applications that can leverage two of the most popular programming languages and ecosystems today. These Java+JavaScript applications can leverage capabilities of both environments &#8211; access the latest node frameworks while taking advantage of the Java platform&#8217;s scalability, manageability, tools, and extensive collection of Java libraries and middleware.

__I decided to check out Avatar.js to see if I could bring up the sample application for LoopBack on a JVM. The exercise was not so straightforward but the end result was exciting. Let me share the steps I took to get it up and running. Please note for the purposes of this example I am using MacOS X 10.8.5.

<h2 dir="ltr">
  <strong>Build Avatar.js</strong>
</h2>

Avatar.js doesn&#8217;t have a downloadable distribution yet. I have to build it from source code. All the code in this blog post is available at <https://github.com/raymondfeng/loopback-on-jvm>.

**1. [Download](https://jdk8.java.net/download.html) and install JDK 8 Build b114**

<!--more-->

<!--more-->

<!--more-->

**2. Check out avatar-js source code and related build tools**

There are three git repositories required for Avatar.js. It also needs Node source code, Apache Ant, and TestNG. To simplify the whole process, I created checkout.sh to check out the git repositories and download the necessary tools. Please run:

<pre lang="sh">git clone git@github.com:raymondfeng/loopback-on-jvm.git
cd loopback-on-jvm
./checkout.sh
```

**3. Build avatar-js**

Now that we have all the source code and tools, we can just run:

<pre lang="sh">./build.sh
```

After that, the Avatar.js distribution is created in the \`avatar-js/dist\` folder:

&#8211; avatar-js.jar

&#8211; libhttp-parser-java.dylib

&#8211; libavatar-js.dylib

&#8211; libuv-java.dylib

## 

## **Run the &#8216;hello&#8217; sample**

I wrote a plain Node.js program \`hello.js\`. It basically prints out the command line arguments and the platform/arch/version.

<pre lang="sh">console.log(process.argv);
console.log(process.version, process.platform, process.arch);
```

To try the sample with node:

<pre lang="sh">node hello
```

And you see:

```js
[ 'node',
'/Users/rfengrojects/sandbox/loopback-on-jvm/hello' ]
v0.10.18 darwin x64
```

Let&#8217;s run it again with Avatar.js:

<pre lang="sh">./nodej hello
```

You should see the following output:

```js
[ 'java -cp /Users/rfeng/Projects/sandbox/loopback-on-jvm/avatar-js/dist/avatar-js.jar net.java.avatar.js.Server','./hello' ]
0.10.18 darwin x64
```

**Note: \`nodej\` is a script I wrote to encapsulate the Java command line.**

&nbsp;

Wow, we got the first Node.js program running on the JVM! One exciting feature of Avatar.js is to call Java classes from JavaScript. To play with that, here is another example:

<pre lang="java">var Collections = Java.type("java.util.Collections");
var ArrayList = Java.type("java.util.ArrayList");
var names = new ArrayList();
names.add('John');
names.add('Smith');
names.add('Mary');
print('Before sort: ', names);
Collections.sort(names);
print('After sort: ', names);
```

In the example, we use java.util.Collections.sort() to sort an array of strings.

<pre lang="sh">./nodej hello-java.js
```

Before sort:

```js
[John, Smith, Mary]
```

After sort:

```js
[John, Mary, Smith]
```

That&#8217;s nice, I don&#8217;t have to rewrite sort in JavaScript. Now that the basics are working, let&#8217;s try to do something more serious.

<h2 dir="ltr">
</h2>

<h2 dir="ltr">
  <strong>Run LoopBack sample app</strong>
</h2>

<pre lang="sh">cd sls-sample-app
npm install
```

After that, run:

<pre lang="sh">../nodej app
```

&nbsp;

Open the browser and point to http://localhost:3000/.

LoopBack is running on the JVM!

&nbsp;

Here&#8217;s some closing observations and things to consider before you embark on running Node on the JVM with Avatar.js&#8230;

<h2 dir="ltr">
  <strong>Observations</strong>
</h2>

&nbsp;

&#8211; Avatar.js is built on top of OpenJDK 8. It uses Nashorn as the JavaScript engine (Node.js uses Google Chrome V8).

&#8211; Avatar.js ships with patched version of Node.js core modules.

&#8211; Avatar.js uses [libuv](https://github.com/joyent/libuv) to support Node.js APIs.

&#8211; The libuv APIs are wrapped as JNI methods.

&#8211; Avatar.js uses Java classes (including native ones) to implement the Node.js

&#8211; It&#8217;s pretty cool that the Node JavaScript code can access Java classes directly.

&#8211; Modules can be implemented in JavaScript and/or Java.

&nbsp;

<h2 dir="ltr">
  <strong>Performance issues</strong>
</h2>

You probably have noticed that Avatar.js is significantly slower. Let&#8217;s time the two runs:

```js
time node hello
real 0m0.055s
user 0m0.042s
sys 0m0.012s
time nodej hello
real 0m2.756s
user 0m8.371s
sys 0m0.306s
```

&nbsp;

<h2 dir="ltr">
  <strong>Compatibility issues</strong>
</h2>

&nbsp;

&#8211; Some of the Node.js cannot run on Avatar.js as it. There are a list of known issues documented [here](https://avatar-javascript.java.net/).

&#8211; Obviously, Avatar.js doesn&#8217;t work with C/C++ node addons as the JavaScript engine is Nashorn instead of V8.

&#8211; NPM is still needed to install the dependencies.