---
id: 12310
title: Understanding the Node.js Event Loop
date: 2013-12-19T09:25:32+00:00
author: Adron Hall
guid: http://strongloop.com/?p=12310
permalink: /strongblog/node-js-event-loop/
categories:
  - Node core
---
Ah, the great and crazy Node.js Event Loop. Often talked about, rarely intimately known. What does the Node event Loop do? What does it provide the programmer? Let&#8217;s dive in and talk about what the event loop is and does and how it can help you in your day to day development.

In the case of most pre-node Javascript, it existed in the browser and took user events manipulate the content of the rendered page in the browser. Manipulating these events were the only real interaction the code had. It was a single route of actions that the programmer had to deal with. Besides the DOM (that&#8217;s another whole discussion) the Javascript world on the browser side was relatively simple.

<!--more-->



Enter server side JavaScript via Node. All of a sudden JavaScript now can deal with all of the interactions on a server. This changes the paradigm of JavaScript development dramatically, from a single event happening at a time to the need for many things to start, stop and evolve over time. So how does JavaScript, and Node, deal with this new complexity on the server side?

## **Enter the Node event loop.**

In other stacks, which have influenced Node, you have systems like Ruby&#8217;s Event Machine and Python&#8217;s Twisted that have taken the event model, yet Node takes it further. Node provides the event loop as a language construct, not just as a library. In most other event loops there is a call to start things. With the Node event loop it starts and doesn&#8217;t end until the last callback to perform.

By the event loop and the very nature of JavaScript and Node, there are a lot of callbacks dealing with I/O that deal with and initiate callbacks from other I/O. This is where the diversions from browser client side JavaScript truly diverts from Node Server side JavaScript. With these development styles it is important to look at the patterns that help us effectively use JavaScript on the server. The event loop is key to understanding this entire flow.

## **What does the Node event loop look like from a human perspective?**

Let&#8217;s talk about event driven programming for a moment. Event driven programming has been around for a long time. An event occurs, imagine someone walking toward you at one angle and you realize that you need to go around their approach. You alter your course slightly while walking and avoid them, sometimes making several corrections to ensure you don&#8217;t collide with the other person. It&#8217;s seamless, immediate and almost done without even thinking about it. Each of those corrections, observations and decisions are an event in the process of not colliding with someone while walking.

Another thing to note: where this analogy continues, is that each of these events is done one at a time. They&#8217;re done just like JavaScript executes on Node and does a callback, does another, each being done and actions being asynchronous. The course correction is the interrupt, the callback executed but all the while the walking continues. Thus we have the asynchronous nature of this single track event loop in our brains. Humans, simply are very effective at making a decision, executing the callback and moving on, dealing with the result of that callback as it completes.

## **Callbacks, Event Loops, All Very Effective Indeed**

Since Node doesn&#8217;t spend time waiting for things to finish, it is able to sequentially execute a number of tasks very rapidly. this is where Node derives much of its speed. This speed helps the event loop maintain an excellent performance and efficiency ratio where and when it is running.

So what’s the technical workflow? I’ve described the human workflow of the event loop above, so I’ll dive into a more technical description.

The first, and key concept of the entire event loop is that it runs under a single thread. Other code can’t be executed in parallel during execution. One of the best ways to show this in effect is simply to implement a sleep cycle, which will make everything just halt. While the sleep is running, no other code or requests will be responded or acted upon.

You might say at this point, “well that seems egregariously useless”, but there’s more! Everything except your code is executing in parallel. When code is evented and executed asynchronously it won’t block the server and things continue onward. Having synchronous code (the sleeping code) is good to simplify writing code that needs to execute from a top-down approach. However the backend always is handling the asynchronous execution without incurring the costs of threads and processes spooling off in a traditional way.

## **Code Samples of Event Looping**

To get an idea if you already have familiarity with an event loop in other languages, let’s take a look at two other languages and then the basic Node event loop code.

First we have a C# sample (also extremely similar to what a Java example would look like).

```js
public class EventLoop {
   List MyThingsToDo { get; set; }

   public void WillYouDo(Action thing) {
      this.MyThingsToDo.Add(thing);
   }

   public void Start(Action yourThing) {
      while (true) {
         DoEventThing(yourThing);

         foreach (var myThing in this.MyThingsToDo) {
            DoEventThing(myThing);
         }
         this.MyThingsToDo.Clear();
      }
   }

   void DoEventThing(Action thing) {
      thing();
   }
}

public class Program {
    static readonly EventLoop e = new EventLoop();

    static void Main() {
        e.Start(DoSomething);
    }

    static int i = 0;
    static void DoSomething() {
        Console.WriteLine("Doing something...");
        e.WillYouDo(() => {
            results += (i++).ToString();
        });
        Console.WriteLine(results);
    }

    static string results = "!";
}
```

Then let’s take a look at a super simplistic event loop using EventMachine.

```js
require 'eventmachine'

module Echo
	def post_init
		puts "Connection Connected Yo"
	end
	def receive_data receive_data
		send_data "#{data}"
		close_connection if data =~ /quit/if
	end
end

EventMachine.run {
	EventMachine.start_server "127.0.0.1", 8081, Echo
}
```

The code is getting a little smaller and a little cleaner going from C# to Ruby. The C# (or Java if you will) example has a main class called Program, which calls to the event loop class that fills a list of generics to process, then starts these tasks into an event loop to be processed. The ruby code is basically doing a similar action, minus the list since the structure of the Ruby language itself makes that easy to deal with without a predefined generics list defined.

Then taking a look at the initiation of a Node event loop for a default server.

```js
var net = require('net');

var server = net.createServer(function(socket){
	console.log('Connecting Connection Connected')
	socket.pipe(socket);
});

server.listen(1234, '127.0.0.1')
```

Extremely simple. Very simple compared to the previous examples, but again, performing similar functionality in the initiation of a loop.

## **When The Event Loop Needs Something Extra**

Sometimes help is needed that the event loop just isn’t cut out for. In those situations there are features and tooling like WebWorkers. For more information about how the event loop is implemented and working internally, check out the Node dependencies on github for a starting point is <https://github.com/joyent/node/tree/master/deps>.

## **Use StrongOps to Monitor Node Apps**

Ready to start monitoring event loops, manage Node clusters and chase down memory leaks? We’ve made it easy to get started with [StrongOps](http://strongloop.com/node-js-performance/strongops/) either locally or on your favorite cloud, with a [simple npm install](http://strongloop.com/get-started/).

<img src="{{site.url}}/blog-assets/2014/02/Screen-Shot-2014-02-03-at-3.25.40-AM.png" alt="Screen Shot 2014-02-03 at 3.25.40 AM" width="1746" height="674" />

## **What’s next?**

Ready to develop APIs in Node.js and get them connected to your data? With IBM API Connect, you can have a live API up and running in just a few minutes. [Just follow these steps](https://strongloop.com/get-started/)!
