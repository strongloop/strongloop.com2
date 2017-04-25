---
id: 28977
title: 'Systematic Data Design in JavaScript &#8211; Featuring Three Data Types'
date: 2017-04-18T07:35:25+00:00
author: Marc Harter
guid: https://strongloop.com/?p=28977
permalink: /strongblog/systematic-data-design-in-javascript/
inline_featured_image:
  - "0"
categories:
  - How-To
  - JavaScript Language
---
In the previous article, we discussed [systematic function design](http://wavded.com/post/htdp-functions/): a test, example, and documentation-driven approach to designing functions using the [HtDP methodology](http://www.ccs.neu.edu/home/matthias/HtDP2e). In this post, we are exploring systematic data design in JavaScript.

In this three-part series, we are covering systematic design as it applies to:

  1. Functions
  2. Data
  3. Worlds

Let’s now turn our attention to the design of **data**.<!--more-->

[<img class="aligncenter wp-image-29210 size-medium" src="https://strongloop.com/wp-content/uploads/2017/04/data-file-246x300.jpeg" alt="Atomic and orthogonal - Systematic Data Design in JavaScript" width="246" height="300" srcset="https://strongloop.com/wp-content/uploads/2017/04/data-file-246x300.jpeg 246w, https://strongloop.com/wp-content/uploads/2017/04/data-file.jpeg 325w" sizes="(max-width: 246px) 100vw, 246px" />](https://strongloop.com/wp-content/uploads/2017/04/data-file.jpeg)

## Data definitions

_Data definitions_ bridge the gap between information and data. For example, representing a traffic light in JavaScript could be done multiple ways:

  1. Using strings like `"red"`, `"green"`, and `"yellow"`; or `"stop"`, `"go"`, and `"slow down"`.
  2. Using numbers like `1`, `2`, and `3`.
  3. Combining types like `true`, `false`, and `undefined`.
  4. Etc.

Regardless, we are translating information into data that represents that information. So if `var trafficLight = "red"`, we interpret the data to mean a traffic light signaling to stop.

Data definitions also help us distinguish between similar data. For example, the string `"red"` may indicate a background color elsewhere in our program.

## Atomicity

Data should be _atomic_, meaning it should be _reduced to its essence_ without losing meaning. For instance, we could define a city as a string or we could define a city as a list of characters. Although, technically a city is made up of a list of characters, those characters have to be meaningfully formed together to be used in our domain.

Similarly, atomic data is _specific_. Even though a traffic light could be represented by any number of strings, it is specifically the strings `"green"`, `"red"`, and `"yellow"`.

## Orthogonality

Data definitions should be _orthogonal_ to the way we define functions. In other words, data should be _mostly independent_ from the functions that operate on that data. This helps with refactoring our application later on as it can reduce the amount of places that need to change when functionality changes.

# Designing data {#designing-data}

We are going to design three different types of data, taking each through the systematic design process. They are data that represents: a traffic light, a natural number, and a coordinate.

## 1. Type comment

A type comment gives a descriptive name to the new type of data as well as how to form that data. JSDoc provides a way to define our data types using [`@typedef`](http://usejsdoc.org/tags-typedef.html) comments. Let’s look at how we might define a `TrafficLight`.

```js
/**
 * @typedef {("green"|"red"|"yellow")} TrafficLight
 */
```

Here we are defining a new type called `TrafficLight` that can either be the string `"green"`, `"red"`, or `"yellow"`. In other words, any string that is one of the three defined above is a valid instance of a `TrafficLight`.

> Note: Although these are just comments and don’t enforce any runtime checks, they communicate the purpose and structure of our data enriching the meaning of any functions that make use of them.

Let’s look at a couple more examples. The natural numbers can represent things like a primary key in a database. Since the `number` type in JavaScript includes all the Natural numbers, we write a definition like this:

```js
/**
 * @typedef {number} Natural
 */
```

We can also represent compound types using `@typedef` and `@prop`. For example here is an X and Y coordinate:

```js
/**
 * @typedef {Object} Coordinate
 * @prop {number} x
 * @prop {number} y
 */
```

Note: you could use a constructor function as well for compound data. The important piece is that all the properties of the compound data type are documented.

## 2. Interpretation

Next, we provide an interpretation for our new data type. The interpretation bridges the gap between our data type and the information it represents.

```js
/**
 * A traffic light.
 * @typedef {("green"|"red"|"yellow")} TrafficLight
 */
```

In our `Natural` type comment, we can use our interpretation to clarify our type as a JavaScript `number` includes rational numbers and negative integers. Also, throw in the fact that the natural numbers [may start at zero or one](https://en.wikipedia.org/wiki/Natural_number). For this we can use [interval notation](https://en.wikipedia.org/wiki/Interval_(mathematics)) to be more specific.

```js
/**
 * A natural number: [1,∞)
 * @typedef {number} Natural
 */
```

Now our interpretation states that a `Natural` for our application includes any positive integer.

Take a moment to come up with a clear and concise interpretation of the coordinate example above before continuing on.

## 3. Examples 

Examples provide more explanation of a data definition, if it would be helpful. Depending on whether type is self-defining. For an enumeration like `TrafficLight`, all the possible examples are already encapsulated in the type comment so examples are not necessary. In the same way, a simple atomic type like `Natural` documents its cases.

However, `Coordinate` can be clarified with examples:

```js
/**
 * A coordinate.
 * @typedef {Object} Coordinate
 * @prop {number} x
 * @prop {number} y
 * @example
 *   { x: 34.54342, y: -95.43132 }
 */
```

## 4. Template

The last step is defining a one argument function that operates on that data type. A template function provides a roadmap for any functions created later on that need to operate on this type of data.

Let’s look at a template function for our enumeration type `TrafficLight`:

```js
function tmplForStopLight(tl) {
  switch (tl) {
  case 'green':
    return tl
  case 'red':
    return tl
  case 'yellow'
    return tl
  }
}
```

A simple atomic type like a Natural has a much simpler template:

```js
function tmplForNatural(n) {
  return n
}
```

You may be wondering, why even write a template this simple. In practice, you probably won’t. Templates are intended to be copied when writing functions that operate on the given data. By writing a template you can easily see all the scenarios you need to account for in your function. You can cut out anything you determine is not needed.

# Writing functions using data definitions {#writing-functions-using-data-definitions}

Once you have your data defined, you can use those new types as your write functions to operate on that data. For example, here is a function that indicates if a traffic light is in a stopped state:

```js
/**
 * Produce true if traffic light stopped.
 * <a class='bp-suggestions-mention' href='https://strongloop.com/members/param/' rel='nofollow'>@param</a> {TrafficLight} tl
 * @return {boolean}
 */
console.assert(isStopped("green"), false)
console.assert(isStopped("yellow"), false)
console.assert(isStopped("red"), true)
function isStopped(tl) {
  switch (tl) {
  case 'red':
    return true
  }
  return false
}
```

# Wrap-up

In this article, we looked at how to design data following the HtDP method. In the next article, we are going to look at how to design worlds and you’ll see how to put this all together in designing programs. Here are some tasks to work on until then:

  1. Write a data definition following the steps above representing the state of a door. The door can either be opened or shut.
  2. Write a data definition representing the state of a light bulb. If it is on, its brightness can range from 1 to 10 (10 being the brightest). It also can be off. Include any special cases in your interpretation.
  3. Write a function called `increaseBrightness`, _following the [designing functions process](http://wavded.com/post/htdp-functions/)_, that operates on the light bulb data type created prior. If the light bulb is off, it should be set to a brightness of `1`. Otherwise, it should increase the brightness by `1` until it reaches `10`. Once it reaches `10`, `increaseBrightness` will no longer have any effect.
