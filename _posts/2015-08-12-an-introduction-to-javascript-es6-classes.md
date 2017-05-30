---
id: 25681
title: An Introduction To JavaScript ES6 Classes
date: 2015-08-12T08:00:24+00:00
author: Alex Gorbatchev
guid: https://strongloop.com/?p=25681
permalink: /strongblog/an-introduction-to-javascript-es6-classes/
categories:
  - How-To
  - JavaScript Language
---
ECMAScript 2015, formerly known as ECMAScript 6 (ES6) makes classes a first class citizen by introducing a few new keywords. At this time, however there are no new features when compared to the the good old JavaScript prototypes. The new keywords are simply a syntax sugar on top of the well established prototype system. This does make the code more readable and lays the path forward for new Object Oriented (OO) features in the upcoming spec releases.

The reason for this is to ensure backwards compatibility with existing code written using the ES6 and ES5 spec. In other words, older code should be able to be run side by side without any workarounds or hacks.

<!--more-->

## **Defining Classes**

Let’s refresh our memory and look at a typical way of wiring OO code in ES5. While [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) is not very commonly used, I want to make a point of creating a read only property.

```js
function Vehicle(make, year) {
  Object.defineProperty(this, 'make', {
    get: function() { return make; }
  });

  Object.defineProperty(this, 'year', {
    get: function() { return year; }
  });
}

Vehicle.prototype.toString = function() {
  return this.make + ' ' + this.year;
}

var vehicle = new Vehicle('Toyota Corolla', 2009);

console.log(vehicle.make); // Toyota Corolla
vehicle.make = 'Ford Mustang';
console.log(vehicle.toString()) // Toyota Corolla 2009
```

Pretty basic stuff, we’ve defined a `Vehicle` class with two read only properties and a custom `toString` method. Lets do the same thing in ES6.

```js
class Vehicle {
  constructor(make, year) {
    this._make = make;
    this._year = year;
  }

  get make() {
    return this._make;
  }

  get year() {
    return this._year;
  }

  toString() {
    return `${this.make} ${this.year}`;
  }
}

var vehicle = new Vehicle('Toyota Corolla', 2009);

console.log(vehicle.make); // Toyota Corolla
vehicle.make = 'Ford Mustang';
console.log(vehicle.toString()) // Toyota Corolla 2009
```

The two examples are practically equal, however there’s one difference. To be able to take advantage of the new `get` syntax (which is actually part of the [ES5 spec](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get)), we have to keep `make` and `year` around as properties using basic assignment. This leaves them vulnerable to being improperly changed. This feels like a pretty big omission in the spec – in order hang on to a value passed into a constructor privately, you still have to use `defineProperty` syntax.

## **Class Declaration**

There are two ways to declare a class in ES6. The first one is called _class declaration_ and that is what we used in the example above, eg:

```js
class Vehicle() {
}
```

One important thing to note here is that unlike function declarations, class declarations can’t be hoisted. For example, this code works fine:

```js
console.log(helloWorld());

function helloWorld() {
  return "Hello World";
}
```

However, the following is going to throw an exception:

```js
var vehicle = new Vehicle();

class Vehicle() {
}
```

## **Class Expressions**

Another way to define a class is by using a _class expression_ and it works exactly the same way as a function expression. A class expression can be named or unnamed.

```js
var Vehicle = class {
}

var Vehicle = class VehicleClass {
  constructor() {
    // VehicleClass is only available inside the class itself
  }
}

console.log(VehicleClass); // throws an exception
```

## **Static Methods**

The `static` keyword is another syntax sugar in ES6 that makes static function declaration a first class citizen (see what I did here?). In ES5 it looks like a basic property on a constructor function.

```js
function Vehicle() {
  // ...
}

Vehicle.compare = function(a, b) {
  // ...
}
```

And the new shiny `static` syntax looks like this:

```js
class Vehicle {
  static compare(a, b) {
    // ...
  }
}
```

Under the covers, JavaScript is still just adding a property to the `Vehicle` constructor, it just ensures that the method is in fact static. Note that you can also add static value properties.

## **Class Extending**

Prototypical inheritance is not unlike magic when used properly. This hasn’t been forgotten in ES6 with the introduction of the all new `extends` keyword. In the old world of ES5 we did something like this:

```js
function Motorcycle(make, year) {
  Vehicle.apply(this, [make, year]);
}

Motorcycle.prototype = Object.create(Vehicle.prototype, {
  toString: function() {
    return 'Motorcycle ' + this.make + ' ' + this.year;
  }
});

Motorcycle.prototype.constructor = Motorcycle;
```

With the new `extends` keyword same example looks a lot more digestible:

```js
class Motorcycle extends Vehicle {
  constructor(make, year) {
    super(make, year);
  }

  toString() {
    return `Motorcycle ${this.make} ${this.year}`;
  }
}
```

The `super` keyword also works with static methods:

```js
class Vehicle {
  static compare(a, b) {
    // ...
  }
}

class Motorcycle extends Vehicle {
  static compare(a, b) {
    if (super.compare(a, b)) {
      // ...
    }
  }
}
```

## **super**

The last example also showed the usage of the `super` keyword. This is useful when you want to call functions of the object’s parent.

To call a parent constructor you simply use the `super` keyword as a function, eg `super(make, year)`. For all other functions, use `super` as an object, eg `super.toString()`. Here’s what the updated example looks like:

```js
class Motorcycle extends Vehicle {
  toString() {
    return 'Motorcycle ' + super.toString();
  }
}
```

## **Computed Method Names**

When declaring properties or functions in a class, you can use expressions instead of statically defined names. This syntax feature will be very popular for ORM type libraries. Here is an example:

```js
function createInterface(name) {
  return class {
    ['findBy' + name]() {
      return 'Found by ' + name;
    }
  }
}

const Interface = createInterface('Email');
const instance = new Interface();

console.log(instance.findByEmail()); 
```

## **Bottom Line**

At this time, there isn’t any advantage to using classes over prototypes other than better syntax. However, it’s a good to start developing a better practice and getting used to the new syntax. The tooling around JavaScript gets better every day and with proper class syntax you will be helping the tools help you.

## **ES6 Today**

How can you take advantage of ES6 features today? Using transpilers in the last couple of years has become the norm. People and large companies no longer shy away. [Babel](https://babeljs.io/) is an ES6 to ES5 transpiler that supports all of the ES6 features.

If you are using something like [Browserify](http://browserify.org/) in your JavaScript build pipeline, adding [Babel](https://babeljs.io/) transpilation [takes only a couple of minutes](https://babeljs.io/docs/using-babel/#browserify). There is, of course, support for pretty much every common Node.js build system like Gulp, Grunt and many others.

## **What About The Browsers?**

The majority of [browsers are catching up](https://kangax.github.io/compat-table/es6/) on implementing new features but not one has full support. Does that mean you have to wait? It depends. It’s a good idea to begin using the language features that will be universally available in 1-2 years so that you are comfortable with them when the time comes. On the other hand, if you feel the need for 100% control over the source code, you should stick with ES5 for now.
