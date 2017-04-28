---
id: 17332
title: 'Node.js Performance Tip of the Week: Managing Garbage Collection'
date: 2014-06-25T08:26:28+00:00
author: Shubhra Kar
guid: http://strongloop.com/?p=17332
permalink: /strongblog/node-js-performance-garbage-collection/
categories:
  - Community
  - How-To
  - Performance Tip
---
<p>
  <em>Please note that as of Aug 3, 2015, StrongOps has been EOL&#8217;d. </em>
</p>

<p>
  In our <a href="http://strongloop.com/strongblog/node-js-performance-event-loop-monitoring/">last weekly performance tip</a>, we discussed in detail how the Node.js event-loop works as the orchestrator of requests, events and callbacks. We also troubleshot a blocked event-loop which could wreck havoc on application performance. In this week’s post we’ll dive into the fundamentals of garbage collection (GC) in <a href="https://code.google.com/p/v8/">V8</a> and how it holds the &#8220;keys to the kingdom&#8221; in the optimization of Node applications. We will also look at some tools to triage GC and memory management issues in V8.
</p>

<h2>
  <strong>Where did it all start</strong>
</h2>

<p>
  Contrary to folklore, V8 was not designed explicitly for Node; rather was built to power a fast browser (Chrome/Chromium) or client side JavaScript (V8.NET). Eventually it got ported to the server as a high performance engine for running server side JavaScript and became the basis of Node. But, just like any server side runtime like the JVM or CLR, V8 runs on memory and needs memory management.
</p>

<p>
  In some systems or languages, it is up to the application program to manage all the bookkeeping details of <a href="http://www.memorymanagement.org/glossary/a.html#term-allocate">allocating</a> <a href="http://www.memorymanagement.org/glossary/m.html#term-memory-2">memory</a> from the <a href="http://www.memorymanagement.org/glossary/h.html#term-heap">heap</a> and <a href="http://www.memorymanagement.org/glossary/f.html#term-free-1">freeing</a> it when it is no longer required. This is known as manual <a href="http://www.memorymanagement.org/glossary/m.html#term-memory-management">memory management</a>. Manual memory management may be appropriate for small programs, but it does not scale well in general, nor does it encourage modular or object-oriented programming.
</p>

<!--more-->

<h2>
  <strong>Who/What is the Garbage Collector?</strong>
</h2>

<p>
  V8 embraces <a href="http://en.wikipedia.org/wiki/Garbage_collection_(computer_science)">garbage collection </a>(GC) also known as managed memory.  Built in GC provides huge simplification for developers by not having to explicitly handle memory bookkeeping in code as was done in the “C” era. It reduces a large class of errors and memory leaks, which are typical in large long-running applications and in some cases, it can even improve performance.
</p>

<p>
  However, you also give up control on memory management, which could be a problem particularly for mobile applications aiming for the optimization of device resources. In particular for JavaScript, the <a href="http://en.wikipedia.org/wiki/ECMAScript">ECMAScript</a> specification doesn&#8217;t expose any interface to the garbage collector blocking visibility and forced GC.
</p>

<p>
  Performance wise, it is a wash. In C, allocating (malloc) and freeing objects can be costly, since heap bookkeeping tends to be more complicated. With managed memory, allocation usually means just incrementing a pointer, but  you pay for it eventually when you run out of memory and the garbage collector kicks in.  The fact is that V8  uses garbage collection for better or worse.
</p>

<h2>
  <strong>How does V8 Organize the heap?</strong>
</h2>

<p>
  V8 divides the heap into several different spaces for effective memory management:
</p>

<ul>
<li>
<strong>New-space:</strong> Most objects are allocated here. New-space is small and is designed to be garbage collected very quickly
</li>

<li>
<strong>Old-pointer-space:</strong> Contains most objects which may have pointers to other objects. Most objects are moved here after surviving in new-space for a while.
</li>

<li>
<strong>Old-data-space:</strong> Contains objects which just contain raw data (no pointers to other objects). Strings, boxed numbers, and arrays of unboxed doubles are moved here after surviving in new-space for a while.
</li>

<li>
<strong>Large-object-space:</strong> Contains objects which are larger than the size limits of other spaces. Each object gets its own mmap&#8217;d region of memory. Large objects are never moved by the garbage collector.
</li>

<li>
<strong>Code-space:</strong> Code objects, which contain JITed instructions, are allocated here. This is the only space with executable memory.
</li>

<li>
<strong>Cell-space, property-cell-space and map-space:</strong> Contain Cells, PropertyCells, and Maps, respectively. Each space contains objects which are all the same size and is restricted in pointers, which simplifies collection.
</li>
</ul>

<p>
  Each space is composed of a set of &#8220;pages&#8221;. A Page is a contiguous chunk of memory, allocated from the operating system with mmap. Pages are always 1 MB in size and 1 MB aligned, except in large-object-space, where they may be larger.
</p>

<h2>
  <strong>How does the Garbage Collector work?</strong>
</h2>

<p>
  The central concept of Node.js/JavaScript application memory management is a concept of reachability.
</p>

<ul>
<li>
A distinguished set of objects are assumed to be reachable or in live scope: these are known as the &#8220;roots.&#8221; Typically, these include all the objects referenced from anywhere in the call stack (that is, all local variables and parameters in the functions currently being invoked), and any global variables.
</li>

<li>
Objects are kept in memory while they are accessible from roots through a reference or a chain of references.
</li>

<li>
Root objects are pointed directly from V8 or the Web browser like DOM elements
</li>
</ul>

<p>
  The fundamental problem garbage collection solves is to identify dead memory regions (unreachable objects/garbage) which are not reachable through some chain of pointers from an object which is live. Once identified, these regions can be re-used for new allocations or released back to the operating system
</p>

<p>
  To ensure fast object allocation, short garbage collection pauses, and the “no memory fragmentation V8” employs a stop-the-world, generational, accurate, garbage collector. V8 essentially:
</p>

<ul>
<li>
stops program execution when performing a garbage collection cycle.
</li>

<li>
processes only part of the object heap in most garbage collection cycles. This minimizes the impact of stopping the application.
</li>

<li>
always knows exactly where all objects and pointers are in memory. This avoids falsely identifying objects as pointers which can result in memory leaks.
</li>
</ul>

<p>
  In V8, the object heap is segmented into many parts; hence If an object is moved in a garbage collection cycle, V8 updates all pointers to the object.
</p>

<h2>
  <strong>No, no&#8230;how does it really work ?</strong>
</h2>

<p>
  The GC needs to follow pointers in order to discover live objects. Most garbage collection algorithms can migrate objects from one part of memory to another (to reduce fragmentation and increase locality), so we also need to be able to rewrite pointers without disturbing plain old data.
</p>

<p>
  V8 uses &#8220;tagged&#8221; pointers. Most objects on the heap just contain a list of tagged words, so the garbage collector can quickly scan them, following the pointers and ignoring the integers. Some objects, such as strings, are known to contain only data (no pointers), so their contents do not have to be tagged.
</p>

<p>
  Next, let&#8217;s check which algorithms V8 uses to execute garbage collection.
</p>

<h2>
  Short GC/scavenging
</h2>

<p>
  V8 divides the heap into two generations. Objects are allocated in new-space, which is fairly small (between 1 and 8 MB, depending on behavior heuristics). Allocation in new space is very cheap: we just have an allocation pointer which we increment whenever we want to reserve space for a new object. When the allocation pointer reaches the end of new space, a scavenge (minor garbage collection cycle) is triggered, which quickly removes the dead objects from new space.
</p>

<p>
  Scavenging/copying GC is a kind of <a href="http://www.memorymanagement.org/glossary/t.html#term-tracing-garbage-collection">tracing garbage collection</a> that operates by <a href="http://www.memorymanagement.org/glossary/r.html#term-relocation">relocating</a> reachable <a href="http://www.memorymanagement.org/glossary/o.html#term-object">objects</a>  and then <a href="http://www.memorymanagement.org/glossary/r.html#term-reclaim">reclaiming</a> objects that are left behind, which must be <a href="http://www.memorymanagement.org/glossary/u.html#term-unreachable">unreachable</a> and therefore <a href="http://www.memorymanagement.org/glossary/d.html#term-dead">dead</a>.
</p>

<p>
  A copying garbage collection relies on being able to find and correct all references to copied objects.
</p>

<p>
  The Scavenge algorithm is great for quickly collecting and compacting a small amount of memory, but it has large space overhead, since we need physical memory backing both to-space and from-space. This is acceptable as long as we keep new-space small, but it&#8217;s impractical to use this approach for more than a few megabytes.
</p>

<p>
  Scavenging is supposed to be fast by design. Hence, it is suitable for frequently occurring short GC cycles.
</p>

<h2>
  Full GC/mark-sweep & mark-compact
</h2>

<p>
  Objects which have survived two minor garbage collections are promoted to &#8220;old-space.&#8221; Old-space is garbage collected in full GC (major garbage collection cycle), which is much less frequent. A full GC cycle is triggered when we get over a certain amount of memory in old space.
</p>

<p>
  To collect old space, which may contain several hundred megabytes of data, we use two closely related algorithms, Mark-sweep and Mark-compact.
</p>

<p>
  Mark-sweep collection is a kind of <a href="http://www.memorymanagement.org/glossary/t.html#term-tracing-garbage-collection">tracing garbage collection</a> that operates by marking reachable <a href="http://www.memorymanagement.org/glossary/o.html#term-object">objects</a>, then <a href="http://www.memorymanagement.org/glossary/s.html#term-sweeping">sweeping</a> over <a href="http://www.memorymanagement.org/glossary/m.html#term-memory-2">memory</a> and <a href="http://www.memorymanagement.org/glossary/r.html#term-recycle">recycling</a> objects that are unmarked (which must be <a href="http://www.memorymanagement.org/glossary/u.html#term-unreachable">unreachable</a>), putting them on a <a href="http://www.memorymanagement.org/glossary/f.html#term-free-list">free list</a>.
</p>

<p>
  The mark phase follows <a href="http://www.memorymanagement.org/glossary/r.html#term-reference">reference</a> chains to mark all reachable objects. Once marking is complete, we can reclaim memory by either sweeping or compacting. Both algorithms work at a page level.  The sweep phase performs a sequential (<a href="http://www.memorymanagement.org/glossary/a.html#term-address">address</a>-order) pass over memory to recycle all unmarked objects. A mark-sweep <a href="http://www.memorymanagement.org/glossary/c.html#term-collector-1">collector</a> doesn’t move objects.
</p>

<p>
  Mark-compact collection is a kind of <a href="http://www.memorymanagement.org/glossary/t.html#term-tracing-garbage-collection">tracing garbage collection</a> that operates by <a href="http://www.memorymanagement.org/glossary/m.html#term-marking">marking</a> <a href="http://www.memorymanagement.org/glossary/r.html#term-reachable">reachable</a> <a href="http://www.memorymanagement.org/glossary/o.html#term-object">objects</a>, then <a href="http://www.memorymanagement.org/glossary/c.html#term-compaction">compacting</a> the marked objects (which must include all the <a href="http://www.memorymanagement.org/glossary/l.html#term-live">live</a> objects).
</p>

<p>
  The mark phase follows <a href="http://www.memorymanagement.org/glossary/r.html#term-reference">reference</a> chains to mark all reachable objects; the compaction phase typically performs a number of sequential passes over <a href="http://www.memorymanagement.org/glossary/m.html#term-memory-2">memory</a>  to move objects and update references. Due to compaction, all the marked objects are moved into a single contiguous block of memory (or a small number of such blocks); the memory left unused after compaction is <a href="http://www.memorymanagement.org/glossary/r.html#term-recycle">recycled</a>. The compacting algorithm also tries to reduce actual memory usage by migrating objects from fragmented pages (containing a lot of small free spaces) to free spaces on other pages
</p>

<p>
  However, the pause time in mark-sweep and mark-compact were found to be high, slowing down overall performance.
</p>

<h2>
  <strong>Incremental marking & lazy sweeping</strong>
</h2>

<p>
  In mid-2012, Google introduced two improvements that reduced garbage collection pauses significantly: incremental marking and lazy sweeping.
</p>

<p>
  Incremental marking means being able to do a bit of marking work, then let the mutator (JavaScript program) run a bit, then do another bit of marking work. Thus, instead of one long pause for marking, the GC marks the heap in a series of short pauses in the order of 5-10 ms each as an example. Incremental marking begins when the heap reaches a certain threshold size. Post threshold, every time a certain amount of memory is allocated, execution is paused to perform an incremental marking step.
</p>

<p>
  If the allocation rate is high during incremental GC, the engine may run out of memory before finishing the incremental cycle. If so, the engine must immediately restart a full, non-incremental GC in order to reclaim some memory and continue execution.
</p>

<p>
  After marking, lazy sweeping begins. All objects have been marked live or dead, and the heap knows exactly how much memory could be freed by sweeping. All this memory doesn&#8217;t necessarily have to be freed up right away though, and delaying the sweeping doesn’t hurt. Hence instead of one-go, the garbage collector sweeps pages on an as-needed basis until all pages have been swept. At that point, the garbage collection cycle is complete, and incremental marking is free to start again.
</p>

## **What’s next?**

[Read about eight exciting new Node v0.12 features](http://strongloop.com/node-js/whats-new-in-node-js-v0-12/) and how to make the most of them, from the authors themselves.
