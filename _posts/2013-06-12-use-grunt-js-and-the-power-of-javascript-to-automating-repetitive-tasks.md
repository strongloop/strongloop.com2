---
id: 704
title: Use Grunt.js and the Power of JavaScript to Automating Repetitive Tasks
date: 2013-06-12T03:47:58+00:00
author: Sethen Maleno
guid: http://blog.strongloop.com/?p=704
permalink: /strongblog/use-grunt-js-and-the-power-of-javascript-to-automating-repetitive-tasks/
categories:
  - How-To
---
_Editor&#8217;s Note: If you experience problems installing or configuring StrongLoop components, please make sure to check the [documentation](http://docs.strongloop.com/display/SL/StrongLoop+2.0) _and the_ _[Getting Started](http://strongloop.com/get-started/)_ _page for the most current instructions.__

As a programmer, one of the first things you learn is the [DRY principle](http://en.wikipedia.org/wiki/Don't_repeat_yourself): don&#8217;t repeat yourself.

Consider for a moment everything that you have to do when you finish a project: validating, compiling, minimizing, concatenating – it’s a lot. Doing all of these things by hand can be repetitive and if I know one thing about developers, it’s that they like to move on and tackle new problems. In this tutorial, we will show how [Grunt.js](http://gruntjs.com/) can optimize your workflow when building a website and get rid of some of the (ahem) grunt work.

<h2 dir="ltr">
  Setting Up Our Environment
</h2>

Before we get started, you will need to install Node.js. If you don’t have Node.js make your way to the StrongLoop Node [download page](http://strongloop.com/products#downloads). We will be relying on the Node.js package manager ([npm](https://npmjs.org/)) to install Grunt and Grunt plugins for our project. npm comes packaged with StrongLoop Node, so we can get started.

If you already have Node.js installed, then great! You are already ahead of the game. The next step is to install Grunt’s command line interface so we are able to better work with Grunt.

Pull up command prompt and run the following snippet:

`npm install -g grunt-cli`

After some lengthy output, you may find that everything ran successfully or you may see a list of errors. If it&#8217;s the latter, re-run the command with a prefix of sudo for (OSX) or shell as Administrator (Windows).

Next, grab yourself a copy of [HTML5 Boilerplate](http://html5boilerplate.com/). This is what we will be working with for this tutorial, even though we will only really be interested in the JavaScript files. Extract the directory from the zip, place it on your desktop and rename it to gruntProject.

<h2 dir="ltr">
  Creating The package.json File
</h2>

Next, we will be making package.json, one of the two files that are necessary for Grunt to do its thing. Enter thegruntProject directory and start editing an empty text file. Paste the following into it:

<pre line="1" lang="javascript">{
"name": "gruntProject",
"version": "0.0.1",
"devDependencies": {
 }
}
```

Save this as `package.json`. This file will be used to store crucial information about the project, like which Grunt plugins we will be using. These will be listed under the `devDependencies` object.

Let&#8217;s first add the grunt package to our list (it&#8217;s the cornerstone to us working with grunt, after all ;-). In the `gruntProject` directory run the following command:

`npm install grunt --save-dev`

What you’re doing here is installing Grunt locally into a node_module directory in the project and using the `--save-dev` flag to store that information under the `devDependencies` object in your package.json file. Go take a look. You should see this now:

<pre line="1" lang="javascript">{
  "name": "my-project-name",
  "version": "0.1.0",
  "devDependencies": {
    "grunt": "~0.4.1"
  }
}
```

Why are we using the `--save-dev` flag? Because we only need to use Grunt while we&#8217;re in development. Once our assets are minified and we push our code to production, we no longer need to use Grunt on our production server.

Here are some other commands to load plugins that will be of service:

`npm install grunt-contrib-uglify --save-dev<br />
npm install grunt-contrib-jshint --save-dev<br />
npm install grunt-contrib-concat --save-dev`

These commands, when issued, should load the Uglify.js, JSHint and concatenation plugin respectively. This is not an extensive list by any means, in fact there are a plethora of available [Grunt plugins over at gruntjs.com](http://gruntjs.com/plugins).

<h2 dir="ltr">
  Making The Gruntfile
</h2>

The gruntfile is where you set options and specify operations that Grunt will use to automate tasks for our desired workflow.

Pull up another empty text file and paste the following:

<pre line="1" lang="javascript">module.exports = function(grunt) {

    grunt.initConfig({
        //grunt tasks go here
    });
}
```

Save this file as `Gruntfile.js.`

<h3 dir="ltr">
  Configuring Task Options
</h3>

Now that we have our files prepared, let&#8217;s start configuring our options for some of these tasks. Let&#8217;s configure the JSHint task that checks our JavaScript for errors. While the Grunt plugin for JSHint comes equipped with a multitude of configurable options outlined in its documentation, let&#8217;s just stick to something simple.

<pre line="1" lang="javascript">module.exports = function(grunt) {

    grunt.initConfig({

        //our JSHint options
        jshint: {
            all: ['main.js'] //files to lint
        }
    });

    //load our tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
}
```

All we&#8217;ve done here is added our options to the JSHint object and enabled the task with `grunt.loadNpmTasks('grunt-contrib-jshint'); --` If we go back to our command prompt and run:

`$ grunt jshint`

We should get the following output:

`Running "jshint:all" (jshint) task<br />
>> 0 files lint free.`

We&#8217;ve successfully automated the linting of your main.js file. Awesome! Let&#8217;s open up the main.js file we just linted and write some not so interesting JavaScript:

<pre line="1" lang="javascript">function foo() {}
```

Remember those plugins we loaded earlier that allowed us to concatenate and minimize our scripts? Let&#8217;s add those to our Gruntfile.js, set their options, and enable them:

<pre line="1" lang="javascript">module.exports = function(grunt) {

    grunt.initConfig({

        //our JSHint options
        jshint: {
            all: ['main.js'] //files to lint
        },

        //our concat options
        concat: {
            options: {
                separator: ';' //separates scripts
            },
            dist: {
                src: ['js/*.js', 'js/**/*.js'], //Using mini match for your scripts to concatenate
                dest: 'js/script.js' //where to output the script
            }
        },

        //our uglify options
        uglify: {
            js: {
                files: {
                    'js/script.js': ['js/script.js'] //save over the newly created script
                }
            }
        }

    });

    //load our tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
}
```

Now that we&#8217;ve done this, running either grunt concat or grunt uglify would run them.

<h2 dir="ltr">
  Writing Tasks
</h2>

At this point, you may be thinking, &#8220;Wait a second… This isn&#8217;t optimized at all! I still have to run grunt task to make something happen!&#8221; Don’t worry. Luckily, Grunt let&#8217;s you outline which specific tasks you want to run. For instance, Grunt has a built in default task that can be configured with `registerTask('default', /* your tasks */); --` The name of the actual task (in this case Grunt&#8217;s default) would be the first argument, followed by the task list you want to run when the command is issued. Let&#8217;s add that piece of code to the bottom:

<pre line="1" lang="javascript">module.exports = function(grunt) {

    grunt.initConfig({

        //our JSHint options
        jshint: {
            all: ['main.js'] //files to lint
        },

        //our concat options
        concat: {
            options: {
                separator: ';' //separates scripts
            },
            dist: {
                src: ['js/*.js', 'js/**/*.js'], //Grunt mini match for your scripts to concatenate
                dest: 'js/script.js' //where to output the script
            }
        },

        //our uglify options
        uglify: {
            js: {
                files: {
                    'js/script.js': ['js/script.js'] //save over the newly created script
                }
            }
        }

    });

    //load our tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    //default tasks to run
    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
}
```

Return to your command prompt and run:

`$ grunt`

If all is well, your output will be this:

`Running "jshint:all" (jshint) task<br />
>> 0 files lint free.`

Running &#8220;concat:dist&#8221; (concat) task
  
File &#8220;js/script.js&#8221; created.

Running &#8220;uglify:js&#8221; (uglify) task
  
File &#8220;js/script.js&#8221; created.

Done, without errors.
  
You should now have a brand new script.js file in your js directory. Pretty simple, yeah?

A default case could be all that you may need, but there might be times you want to run certain tasks for a development or production environment. That’s not a problem. Just use the same formula as before:

<pre line="1" lang="javascript">grunt.registerTask('development', ['jshint']);
grunt.registerTask('production', ['jshint', 'concat', 'uglify']);
```

As you may have guessed, you can run each of these tasks, respectively, by issuing these commands:

`$ grunt development<br />
$ grunt production`

<h2 dir="ltr">
  Conclusion
</h2>

In a nutshell, all we&#8217;ve done is added Grunt and some plugins locally to the project via npm, configured some options for some tasks, enabled those tasks, and then ran them. Grunt is a very powerful tool and can be used to make any sort of workflow imaginable. The documentation is rich, the community is vast, and with a surplus of quality plugins for Grunt, the sky is truly the limit for optimizing your workflow.

## **[What’s next?](http://strongloop.com/get-started/)**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js <a href="http://loopback.io/">LoopBack framework</a>. We’ve made it easy to get started either locally or on your favorite cloud, with a <a href="http://strongloop.com/get-started/">simple npm install</a>.</span>
</li>

&nbsp;