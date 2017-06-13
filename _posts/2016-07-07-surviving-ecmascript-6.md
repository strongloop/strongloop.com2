---
id: 27551
title: Surviving ECMAScript 6
date: 2016-07-07T08:00:12+00:00
author: Marc Harter
guid: https://strongloop.com/?p=27551
permalink: /strongblog/surviving-ecmascript-6/
categories:
  - ES2015 ES6
  - JavaScript Language
---
I recently watched <a href="http://www.thedotpost.com/2015/11/rob-pike-simplicity-is-complicated" rel="nofollow">an insightful talk</a> from <a href="https://en.wikipedia.org/wiki/Rob_Pike" rel="nofollow">Rob Pike</a> where he shared his experience attending <a href="https://channel9.msdn.com/events/lang-next" rel="nofollow">Lang.Next</a>, a conference focusing on new and upcoming trends in programming languages. While there, Rob noticed how many presenters focused on things they were <em class="markup--em markup--p-em">adding</em> to their respective languages. This concerned him because languages were becoming more complex and similar to one another.<!--more-->

### JavaScript’s complexity has grown 

<p id="a5f3" class="graf--p graf-after--h4">
  JavaScript (as standardized in ECMAScript aka ES) existed as ES3 with the same set of features for over 10 years. When ES5 was standardized, the syntax remained unchanged (version 4 was abandoned). However, the arrival of ES6 (aka ECMAScript 2015) feels in many ways like a new language. I&#8217;m not sure if the change is good or bad, but it is a certainly a change.
</p>

<p id="e2db" class="graf--p graf-after--p">
  I’ve found ES6 both fun and frustrating. I hope to provide some tips to help you focus on writing quality maintainable code.
</p>

### Pace yourself 

<p id="d526" class="graf--p graf-after--h4">
  You don’t need to convert everything to ES6 or adopt all the ES6 features immediately! It will take time to understand what works well and what doesn’t. ES3 took years to boil down to the good parts, as this photo illustrates:
</p><figure id="2de1" class="graf--figure graf-after--p"> 

<div class="aspectRatioPlaceholder is-locked">
  <div class="progressiveMedia js-progressiveMedia graf-image is-canvasLoaded is-imageLoaded">
    <img class="progressiveMedia-image js-progressiveMedia-image" src="https://cdn-images-1.medium.com/max/800/1*O5c7M-jeJ8Ht_oeEIh1IAg.jpeg" alt="" />
  </div>
</div><figcaption class="imageCaption">Source: 

<a class="markup--anchor markup--figure-anchor" href="https://twitter.com/absinthol/status/571002000135086080" rel="nofollow">https://twitter.com/absinthol/status/571002000135086080</a></figcaption> </figure> 

<p id="1b23" class="graf--p graf-after--figure">
  Think about it: <em class="markup--em markup--p-em">whole new sets of anti-patterns are under active development right now!</em>
</p>

<p id="59f1" class="graf--p graf-after--p">
  Rushing in too quickly to new features could be counterproductive. I’ve watched this happen in the React community. ES6 classes used to be all the hotness, but then we realized that classes lacked essential features like static properties and mix-ins. So, we used Babel and new language proposals to add those features in, but we depended on languages features that didn’t even exist. Now, many have moved back to <strong class="markup--strong markup--p-strong">React.createClass </strong>or strictly ES6 classes <a class="markup--anchor markup--p-anchor" href="https://github.com/reactjs/react-redux/blob/c20ae482a274dd2002b7814dd46ac503efb300ec/src/components/Provider.js#L47" rel="nofollow">with dangling static properties</a>. Ironically, the initial code was easier to read and understand.
</p>

<p id="1ff0" class="graf--p graf-after--p">
  My advice: use what you know and understand well, then add in what makes sense.
</p>

<blockquote id="797f" class="graf--blockquote graf-after--p">
  <p>
    Keep in mind that some of the new ES6 &#8220;syntactic sugar&#8221; can make things <a class="markup--anchor markup--blockquote-anchor" href="https://kpdecker.github.io/six-speed/" rel="nofollow">slower</a> than its ES5 counterparts.
  </p>
</blockquote>

### Use what’s supported 

<p id="47b1" class="graf--p graf-after--h4">
  I love <a class="markup--anchor markup--p-anchor" href="https://babeljs.io/" rel="nofollow">Babel</a> and what it provides to the JavaScript community. So this isn’t intended to knock that project, but Babel allows all sorts of new syntax (even beyond ES6) like it&#8217;s a thing right now! But… it’s not a thing right now!
</p>

<p id="1c3a" class="graf--p graf-after--p">
  Babel also rewrites your code and now you depend on Babel. I experienced the downside of this when Babel 6 came out. Modules behaved differently and working syntax broke. If I use stable language features that are supported in the runtime, I don’t worry about my code breaking when new updates arrive.
</p>

<p id="9af5" class="graf--p graf-after--p">
  One beneficial addition to my Express development is the ES7 proposal for <a class="markup--anchor markup--p-anchor" href="https://github.com/tc39/ecmascript-asyncawait" rel="nofollow">async/await</a>. This enables control flow that fits the semantics of JavaScript (<strong>if</strong>/<strong>else</strong>/<strong>try</strong>/<strong>catch</strong>/<strong>return</strong>) but for asynchronous programming. However, Node 6 does not support this proposal. So either I could include Babel or just use <a class="markup--anchor markup--p-anchor" href="https://www.npmjs.com/package/co" rel="nofollow">co</a> or <a class="markup--anchor markup--p-anchor" href="http://bluebirdjs.com/docs/api/promise.coroutine.html" rel="nofollow">Bluebird.coroutine</a>, which give me the same benefits in Node 4+. I prefer what is supported.
</p>

### Tools over features 

<p id="7e42" class="graf--p graf-after--h4">
  Spend time getting familiar with good JavaScript code quality tools. <a class="markup--anchor markup--p-anchor" href="http://eslint.org/" rel="nofollow">ESLint</a> is a crucial tool that makes me feel good about still using <strong class="markup--strong markup--p-strong">var</strong> in my projects because it has my edge cases covered. One killer feature in ESLint is auto-fix ( — fix flag). If you don’t have that integrated into your editor, go figure that out right now and come back!
</p>

<p id="0ce2" class="graf--p graf-after--p">
  Another huge time-saver is automatic formatting. ESLint is getting better with this all the time (with the  — fix flag). I’m looking forward to the next releases now that <a class="markup--anchor markup--p-anchor" href="http://jscs.info/" rel="nofollow">JSCS has joined the team</a>. <a class="markup--anchor markup--p-anchor" href="https://github.com/millermedeiros/esformatter" rel="nofollow">ESFormatter</a> is another great option.
</p>

<p id="3aef" class="graf--p graf-after--p">
  Other indispensable tools include a <a class="markup--anchor markup--p-anchor" href="https://github.com/substack/tape" rel="nofollow">good testing framework</a>, <a class="markup--anchor markup--p-anchor" href="https://github.com/gotwarlost/istanbul" rel="nofollow">test coverage</a>, and <a class="markup--anchor markup--p-anchor" href="https://strongloop.com/strongblog/roll-your-own-node-js-ci-server-with-jenkins-part-1/" rel="nofollow">continuous integration</a>.
</p>

<p id="b280" class="graf--p graf-after--p">
  Tools increase my confidence in the code my team and I write. If a new language feature doesn’t work with my tools, I don’t care to use it yet. I’d much rather have my tools work.
</p>

### <strong class="markup--strong markup--h4-strong">Adopt new features with care</strong> 

<p id="7ca9" class="graf--p graf-after--h4">
  As you think about using a new feature, ask yourself:
</p>

<ol class="postList">
  <li id="3880" class="graf--li graf-after--p">
    Will this feature require me to compile my code?
  </li>
  <li id="c232" class="graf--li graf-after--li">
    Does this feature break the tools I’m using now?
  </li>
  <li id="b309" class="graf--li graf-after--li">
    What do I gain or lose from using this feature?
  </li>
</ol>

<p class="graf--p">
  If the benefits clearly outweigh the losses, using that new feature might be a good move. If not, perhaps your best bet may be achieving your goal through other means.
</p>
