---
id: 28297
title: Systematic Function Design in JavaScript
date: 2016-11-15T07:05:34+00:00
author: Marc Harter
guid: https://strongloop.com/?p=28297
permalink: /strongblog/systematic-function-design-in-javascript/
categories:
  - JavaScript Language
layout: redirected
redirect_to: https://developer.ibm.com/node/2016/11/15/systematic-function-design-in-javascript/
---
This blog post has been moved to IBM DeveloperWorks....  
---
<p class="graf graf--p">
  Habits can be damning or liberating. Perhaps you are like me. I know having tests, examples, and documentation are good things for any program but why do they always seem to be an afterthought? Wouldn’t it be great to have a coding methodology that propels me to write well-documented and tested programs that are easy to change? Thankfully, a team of professors/researchers have tackled this very problem and distilled their insights in what is called <a class="markup--anchor markup--p-anchor" href="https://www.edx.org/xseries/how-code-systematic-program-design" target="blank">systematic program design </a>or the <a class="markup--anchor markup--p-anchor" href="http://www.ccs.neu.edu/home/matthias/HtDP2e/" target="blank">HtDP </a>methodology (How to Design Programs).
</p>

<p class="graf graf--p">
  Why would you want to learn the HtDP methodology? HtDP gives you a <em class="markup--em markup--p-em">process</em> for designing functions, data, and worlds that driven by documentation, example, and tests. Well-designed HtDP programs are clear, tested, and easy to change. In this three-part series, we will look at some core concepts of HtDP as they apply to JavaScript:<!--more-->
</p>

<ol class="postList">
  <li class="graf graf--li">
    Functions.
  </li>
  <li class="graf graf--li">
    Data.
  </li>
  <li class="graf graf--li">
    Worlds.
  </li>
</ol>

<p class="graf graf--p">
  This first part is on functions. Let’s get started.<!--more-->
</p>

### Designing functions

<p class="graf graf--p">
  Let’s define a function that takes a number and produces a number that is double the number provided. I’m sure you’ve already done this function in your head and have seen it used in countless examples prior. However, we are going to take a step back and take a systematic approach that will land us with a well-documented and tested function in the end.
</p>

<p class="graf graf--p">
  In our examples, we will use <a class="markup--anchor markup--p-anchor" href="http://usejsdoc.org/" target="blank">JSDoc</a>-style comments. This will make our comments more useful for other tools like <a class="markup--anchor markup--p-anchor" href="http://ternjs.net/" target="blank">Tern</a> and it allows us to easily generate and publish documentation for our projects.
</p>

#### 1. Signature

<p class="graf graf--p">
  When thinking about how to design functions, we first access the signature<strong class="markup--strong markup--p-strong">. </strong>The <strong class="markup--strong markup--p-strong">signature</strong> represents the <em class="markup--em markup--p-em">types</em> of data the function will receive as parameters and what <em class="markup--em markup--p-em">type</em> of data the function will return. The signature should use the <em class="markup--em markup--p-em">most specific</em> types that satisfy the requirements of the function. In this case, we can double <em class="markup--em markup--p-em">any </em>number but if we had a function that only applied to integers or natural numbers, we use the most specific type.
</p>

<blockquote class="graf graf--blockquote">
  <p>
    But wait! JavaScript doesn’t have static typing or custom types. That’s correct, we can’t enforce these types at a code level but it is still important to clearly document types as they inform our design of the function and inform others (including our future self) that use the function in the future. We will look at designing custom data in the next article.
  </p>
</blockquote>

<p class="graf graf--p">
  Let’s write our signature:
</p>

```js
/**
 * <a class='bp-suggestions-mention' href='https://strongloop.com/members/param/' rel='nofollow'>@param</a> {number} n
 * @return {number}
 */

```

<p class="graf graf--p">
  Here we state our function will take a number (which we call <em class="markup--em markup--p-em">n</em>) and return a number.
</p>

#### 2. Purpose

<p class="graf graf--p">
  The <strong class="markup--strong markup--p-strong">purpose</strong> is a succinct description of what the function will produce given its inputs. Let’s add our purpose:
</p>

```js
/**
 * Produce a number that is double the number given.
 * <a class='bp-suggestions-mention' href='https://strongloop.com/members/param/' rel='nofollow'>@param</a> {number} n
 * @return {number}
 */
```

<p class="graf graf--p">
  A purpose should include any special cases if they exist as well. For example, say we had a function that searches for a value’s index in an array. If it does not find the value it will return <em class="markup--em markup--p-em">-1</em> instead. Sound familiar? Our purpose in that case would read something like:
</p>

<p class="graf graf--p">
  <em class="markup--em markup--p-em">Produce the index for the provided value, if none return -1.</em>
</p>

#### 3. Stub

<p class="graf graf--p">
  Lastly, the <strong class="markup--strong markup--p-strong">stub</strong> is a bare bones implementation of the function. A stub should define a good <em class="markup--em markup--p-em">name</em> for our function and include the right amount of <em class="markup--em markup--p-em">arguments</em> that also are named clearly. The stub also returns a <em class="markup--em markup--p-em">valid</em> value given the function’s return type. Here we return a number, so we use the zero value for the stub.
</p>

```js
/**
 * Produce a number that is double the number given.
 * <a class='bp-suggestions-mention' href='https://strongloop.com/members/param/' rel='nofollow'>@param</a> {number} n
 * @return {number}
 */
function double(n) { return 0 }
```

<blockquote class="graf graf--blockquote">
  <p>
    <em class="markup--em markup--blockquote-em">For JavaScript, falsy or empty values work well for stub return values. So a good base for a number type is </em><code class="markup--code markup--blockquote-code"><em class="markup--em markup--blockquote-em">0</em></code><em class="markup--em markup--blockquote-em">, for a Boolean type<em class="markup--em markup--blockquote-em">a good base </em>is </em><code class="markup--code markup--blockquote-code"><em class="markup--em markup--blockquote-em">false</em></code><em class="markup--em markup--blockquote-em">, for a string<em class="markup--em markup--blockquote-em">a good base </em>is </em><code class="markup--code markup--blockquote-code"><em class="markup--em markup--blockquote-em">""</em></code><em class="markup--em markup--blockquote-em">, for an array<em class="markup--em markup--blockquote-em">a good base </em>is</em> <code class="markup--code markup--blockquote-code">[]</code><em class="markup--em markup--blockquote-em">, etc.</em>
  </p>
</blockquote>

<p class="graf graf--p">
  The order in which you tackle the signature, purpose and stub doesn’t have to be sequential. You may find that one may inform another better depending on the function you are writing and that’s OK. In fact, JSDoc comments encourage you to consider your stub’s parameter names when you are writing your signature.
</p>

#### 4. Examples

<p class="graf graf--p">
  With these three pieces in place (the signature, purpose, and stub), we then start to write our examples. <strong class="markup--strong markup--p-strong">Examples</strong> should include all the variance that the function may have given its inputs (like base/edge cases if they exist). Examples are also tests.
</p>

<p class="graf graf--p">
  Our double function doesn’t have any edge cases, so any number will work for our tests:
</p>

```js
/**
 * Produce a number that is double the number given.
 * <a class='bp-suggestions-mention' href='https://strongloop.com/members/param/' rel='nofollow'>@param</a> {number} n
 * @return {number}
 */
console.assert(double(0) === 0)
console.assert(double(1) === 1)
console.assert(double(2) === 4)

function double(n) { return 0 }
```

<blockquote class="graf graf--blockquote">
  <p>
    For conciseness and focus we are just using <strong class="markup--strong markup--blockquote-strong">console.assert</strong> here as it exists in Node and modern browsers out of the box. In practice, using a test framework like <a class="markup--anchor markup--blockquote-anchor" href="https://github.com/substack/tape" target="blank">Tape</a> or <a class="markup--anchor markup--blockquote-anchor" href="http://mochajs.org" target="blank">Mocha</a> and having your examples/tests in a separate file scales better.
  </p>
</blockquote>

<p class="graf graf--p">
  We now run our file to ensure our tests are well formed. You also should notice that most are failing.
</p>

<blockquote class="graf graf--blockquote">
  <p>
    <strong class="markup--strong markup--blockquote-strong">Pop quiz</strong>: When thinking about the <code class="markup--code markup--blockquote-code">indexOf</code> function that was mentioned in the purpose section, we will have a base/edge case. Write a <code class="markup--code markup--blockquote-code">console.assert</code> statement for that case. Notice how the purpose helps inform your examples.
  </p>
</blockquote>

#### 5. Template

<p class="graf graf--p">
  The next part of the process is the <strong class="markup--strong markup--p-strong">template</strong> which is a reference implementation of the function given the types of data it consumes. Since we are using a simple atomic type here, the template is basic:
</p>

```js
function double(n) { return n }
```

<p class="graf graf--p">
  A template gives us what we <em class="markup--em markup--p-em">have to work with</em> when implementing your function. In our simple example, the <em class="markup--em markup--p-em">n</em> indicates we have the data <strong class="markup--strong markup--p-strong">n</strong> to work with. Templates for a basic function like double may seem useless or obvious, but <em class="markup--em markup--p-em">they will serve a more important role when we start looking at data design</em>. For now, its good to understand why they exist.
</p>

#### 6. Implementation

<p class="graf graf--p">
  The last piece is the actual <strong class="markup--strong markup--p-strong">implementation</strong> of the function. At this stage, we can delete or comment out the stub and start fleshing out our template with a function that is informed by all we’ve learned so far.
</p>

```js
function double(n) { return n * 2 }
```

<p class="graf graf--p">
  When we are finished, we run our tests against them to ensure they all pass and that our function is well formed. Our final code looks like this:
</p>

```js
/**
 * Produce a number that is double the number given.
 * <a class='bp-suggestions-mention' href='https://strongloop.com/members/param/' rel='nofollow'>@param</a> {number} n
 * @return {number}
 */
console.assert(double(0) === 0)
console.assert(double(1) === 1)
console.assert(double(2) === 4)

// function double(n) { return 0 } // stub
// function double(n) { return n } // template
function double(n) { return n * 2}
```

<p class="graf graf--p">
  Note that it is normal to revisit the other pieces of the formula as you work though the steps. For example, you may recognize that you can use a more specific type and therefore update your signature to reflect. Or, you notice that you are missing some tests so you go back and add them in.
</p>

### Wrap-up

<p class="graf graf--p">
  In this article, we looked at how to do design functions following the HtDP method. In the next article, we are going to look at how to design data and you’ll see how the templates start to get more interesting.
</p>

<p class="graf graf--p">
  In the meantime, try following this method step-by-step and write the following functions:
</p>

<ol class="postList">
  <li class="graf graf--li">
    Write a function called <em class="markup--em markup--li-em">exclaim</em> that converts any string into a string with an exclamation point at the end.
  </li>
  <li class="graf graf--li">
    Write a function called <em class="markup--em markup--li-em">first</em> that takes an array of values and returns the first one. If the array is empty, it should return null. Note: you should use the any type (<code class="markup--code markup--li-code">{}</code>) in your <code class="markup--code markup--li-code">@return</code> tag.
  </li>
  <li class="graf graf--li">
    Write a function called <em class="markup--em markup--li-em">dashString</em> that takes an array of string values (<code class="markup--code markup--li-code">{Array.< string >}</code>) and joins them together with dashes. If the array is empty, you should return an empty string.
  </li>
</ol>
