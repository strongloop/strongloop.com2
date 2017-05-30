---
id: 7914
title: Build a Slideshow with jQuery from Scratch
date: 2013-10-09T10:09:21+00:00
author: Sethen Maleno
guid: http://strongloop.com/?p=7914
permalink: /strongblog/build-a-slideshow-with-jquery-from-scratch/
categories:
  - How-To
---
It&#8217;s impossible to deny the effect that jQuery has had on the web since its inception in 2006. Today, developers can use one convenient API and actually concentrate on getting things done when it comes to their complex web applications. While cross browser issues still exist (I&#8217;m looking at you Internet Explorer), jQuery has helped reduce the issues significantly. With all this spare time to focus on the UI instead of implementation details, web applications are getting brand new life with features that really &#8220;Wow!&#8221; the end user.

One constant seems to remain in the ever growing world of great UI features: the slideshow. Whether it&#8217;s showing off information, swapping images or the like, a slideshow is a great interactive piece for end users to engage with. While there are a plethora of jQuery plugins that can do this for you, this article is going to dig into the nuts and bolts behind building your own jQuery slideshow from scratch.

I know what you might be thinking, and I wouldn&#8217;t blame you: &#8220;Man, building a jQuery slideshow from scratch is hard!&#8221; I was of the same mindset when I first wanted to dig deep into building a great slideshow. What I found is that if you understand a few crucial JavaScript principles the end product is not so complicated to grasp. We can combine the convenient API that jQuery gives us with some vanilla JavaScript to create some really neat stuff.

Now, before I start every project the first thing I like to do is think about the steps. I like to visualize exactly what the code needs to do, how it needs to do it and what features it would have to use in order to make it work properly. In the case of a slideshow, let&#8217;s think about 5 images that you might want to be able to swap through easily and quickly. I decided to use images of puppies because honestly who doesn&#8217;t love puppies?

After pondering briefly about what steps would be required of a slideshow, I came up with the following:

<span style="font-size: medium">
<ul>
<li>
  For every slide that exists for the slideshow, starting from the first one, stack them on top of each other. This can be done easily with the z-index attribute.
</li>
<li>
  The slideshow will have to run on some sort of interval to change. We could use the JavaScript setInterval function to run code every so often.
</li>
<li>
  Since the slides are stacked on top of each other, when one fades out it will reveal the one underneath it. This can be done using jQuery&#8217;s fadeOut method.
</li>
<li>
  When the next to last slide fades out (slide number 4) and reveals the last slide underneath it&#8217;s time for the process to start over.
</li>
<li>
  Fade in the first slide and then show the other slides underneath it to bring back their opacity since they have been faded out. This could be done using jQuery&#8217;s fadeIn method and passing it a callback to wait until the slide has officially faded in before showing the others underneath. The user won&#8217;t see the slides underneath showing, but it&#8217;s important for when the process officially starts over again.
</li></ul> 

<p>
  <br /> Keep in mind that the above points ensure that we can add as many slides as we want to our slideshow and the code will do the work. We want to write our code to be as dynamic as possible so we won&#8217;t have a lot to maintain.
</p>

<p>
  With a blueprint in hand, let&#8217;s start building. If you want to download the final product you can do so <a href="https://github.com/strongloop-community/blogDemoServer/tree/master/post7914/server/modules/app/public">here.</a> This is simply a stripped down version of the HTML5 boilerplate where all of the final JavaScript can be found in the main.js file in the js directory. To see a functional version of the slideshow we will build, <a href="http://162.243.134.64:3000/jqueryslideshow/">follow this link</a>.
</p>

<p>
  You will find that while the HTML and CSS are extremely straight forward, the JavaScript may not be. Don&#8217;t worry, we will be dissecting that piece by piece in just a moment.
</p>

<h2>
  HTML
</h2>

```js
<div id="slideshow">
    <img class="slide" src="img/puppy1.jpg" />
    <img class="slide" src="img/puppy2.jpg" />
    <img class="slide" src="img/puppy3.jpg" />
    <img class="slide" src="img/puppy4.jpg" />
    <img class="slide" src="img/puppy5.jpg" />
</div>
```

<p>
  As I said, extremely straight forward HTML. This is just a div with an id of <code>slideshow</code> with some child nodes that each have the class of <code>slide</code>. This could also work with divs, sections or anything really. This slideshow isn&#8217;t limited to just images.
</p>

<h2>
  CSS:
</h2>

```js
#slideshow {
    width: 500px;
    height: 500px;
    margin: 0 auto;
    position: relative;
}
.slide {
    width: 500px;
    height: 500px;
    position: absolute;
    left: 0;
    top: 0;
}
```

<p>
  The <code>#slideshow</code> selector has a width and height of 500 pixels with the <code>margin: 0 auto;</code> trick to center the slideshow in the browser. We will use <code>position: relative</code> on the <code>#slideshow</code> element so we can position the child nodes inside of it with <code>position: absolute</code>.
</p>

<p>
  You will see that elements with the <code>slide</code> class are given the same width and height as the element with the id of <code>slideshow</code> and use the <code>left: 0;</code> and <code>top: 0;</code> so they are aligned properly.
</p>

<h2>
  JavaScript:
</h2>

```js
/*global $,jQuery,console,window*/
(function ($) {
    "use strict";
    var slideshow = (function () {
        var counter = 0,
            i,
            j,
            slides =  $("#slideshow .slide"),
            slidesLen = slides.length - 1;
        for (i = 0, j = 9999; i < slides.length; i += 1, j -= 1) {
            $(slides[i]).css("z-index", j);
        }
        return {
            startSlideshow: function () {
                window.setInterval(function () {
                    if (counter === 0) {
                        slides.eq(counter).fadeOut();
                        counter += 1;
                    } else if (counter === slidesLen) {
                        counter = 0;
                        slides.eq(counter).fadeIn(function () {
                            slides.fadeIn();
                        });
                    } else {
                        slides.eq(counter).fadeOut();
                        counter += 1;
                    }
                }, 2000);
            }
        };
    }());
    slideshow.startSlideshow();
}(jQuery));
```

<p>
  Here is the final JavaScript that makes your slideshow run. As I mentioned earlier, if we understand a few key JavaScript principles, this is a walk in the park.
</p>

<p>
  The first thing you may notice about the JavaScript is that it&#8217;s wrapped in an immediately invoked function expression, like so:
</p>

```js
(function ($) {
    "use strict"
    //code here
}(jQuery));
```

<p>
  Since JavaScript has one global object (window), any variables you write in a global scope actually become properties of the window object. This is considered bad practice because you could be overwriting globals that already exist. Instead of cluttering up the global scope we can create our own scope with an immediately invoked function expression to encapsulate our code. You will also notice we&#8217;re passing the <code>$</code> to the jQuery object so there is no confusion about what the <code>$</code> does in this scope.
</p>

<p>
  We will also write <code>"use strict"</code> to enable JavaScript strict mode. While strict mode is outside the realm of this article, you can find more information on it <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode">here</a>.
</p>

```js
var slideshow = (function () {
    var counter = 0,
        i,
        j,
        slides =  $("#slideshow .slide"),
        slidesLen = slides.length - 1;
    for (i = 0, j = 9999; i < slides.length; i += 1, j -= 1) {
        $(slides[i]).css("z-index", j);
    }
}());
```

<p>
  Here we define a variable called <code>slideshow</code>. The value of the <code>slideshow</code> variable is another immediately invoked function expression which is run on script execution. Inside of this is where we set up our environment variables for the slideshow and declare some variables for later use.
</p>

```js
var slideshow = (function () {
    //code
}());
```

<p>
  You will notice that all of the variables that we will use for our slideshow are all separated by a comma to make it more concise.
</p>

```js
var counter = 0,
    i,
    j,
    slides =  $("#slideshow .slide"),
    slidesLen = slides.length - 1;
```

<p>
  The first variable, <code>counter</code>, is going to act as the heart of the slideshow. The <code>counter</code> variable will change intermittently and as it does so will our slideshow.
</p>

```js
var counter = 0,
```

<p>
  The variables <code>i</code> and <code>j</code> are just being declared for later use.
</p>

```js
i,
    j,
```

<p>
  The <code>slides</code> variable is a jQuery object that contains all of our slide nodes.
</p>

```js
slides =  $("#slideshow .slide"),
```

<p>
  While the <code>slidesLen</code> variable contains an integer of how many slides there actually are minus 1. This might not make a lot of sense right now, but it will.
</p>

```js
slidesLen = slides.length - 1;
```

<p>
  The last bit of code is actually a <code>for</code> loop which handles the stacking of our slides on top of each other. The variable <code>i</code> starts at 0 and <code>j</code> starts at 9999 and will be used for our <code>z-index</code> value. You could change <code>j</code> to be anything you want to better work with your web application. When the <code>for</code> loop runs it tests to see if <code>i</code> is less than <code>slides.length</code>. If true, increase <code>i</code> and decrease <code>j</code> on the next pass. In the body of the <code>for</code> loop it finds the <code>i</code> (current value of <code>i</code>) slide in the jQuery object and assigns it&#8217;s <code>z-index</code> value to whatever <code>j</code> is equal to. The <code>for</code> loop will decrease the <code>z-index</code> gradually for each slide until we get all of the slides stacked on top of each other. This is exactly what we wanted.
</p>

```js
for (i = 0, j = 9999; i < slides.length; i += 1, j -= 1) {
        $(slides[i]).css("z-index", j);
    }
```

<h2>
  The Almighty Closure
</h2>

<p>
  At this point in the code we have been successful in setting up everything that we may need for our slideshow. While all of the variables declared are important, it&#8217;s really the <code>counter</code> variable that is at the center of the functionality. Without <code>counter</code> the slideshow would not run properly. It may go without saying that we don&#8217;t want just anyone to be able to change that value. What we need is to be able to retrieve and update <code>counter</code> if we need to, but privately. This sounds like a perfect case for a closure.
</p>

<p>
  You see, the value of <code>slideshow</code> is itself an immediately invoked function expression so it runs as soon as the script is executed. It sets up all of the variables and runs the <code>for</code> loop. When the <code>slideshow</code> function returns, it returns an object with one method called <code>startSlideshow</code>, thus creating a closure.
</p>

```js
return {
    startSlideshow: function () {
        window.setInterval(function () {
            if (counter === 0) {
                slides.eq(counter).fadeOut();
                counter += 1;
            } else if (counter === slidesLen) {
                counter = 0;
                slides.eq(counter).fadeIn(function () {
                    slides.fadeIn();
                });
            } else {
                slides.eq(counter).fadeOut();
                counter += 1;
            }
        }, 2000);
    }
};
```

<p>
  In this instance, the <code>startSlideshow</code> method is able to retrieve and update any variables declared when <code>slideshow</code> was run. There is no way to actually change any variables from outside <code>slideshow</code> (unless you&#8217;ve created a setter method) so this variable is only seen by the <code>startSlideshow</code> method being returned in the object.
</p>

<p>
  With that out of the way, let&#8217;s dig deeper into the guts of the <code>startSlideshow</code> method.
</p>

<p>
  We have a <code>setInterval</code> method that takes two parameters.
</p>

```js
window.setInterval(function () {
    //code      
}, 2000);
```

<p>
  The first parameter passed is the function we want to run and the second is an integer which determines how often to run the function you&#8217;ve passed. In this case, the function passed will run every 2000 milliseconds.
</p>

<p>
  Inside of the <code>setInterval</code> method we have a sizable conditional statement.
</p>

```js
if (counter === 0) {
    slides.eq(counter).fadeOut();
    counter += 1;
} else if (counter === slidesLen) {
    counter = 0;
    slides.eq(counter).fadeIn(function () {
        slides.fadeIn();
    });
} else {
    slides.eq(counter).fadeOut();
    counter += 1;
}
```

<p>
  The first condition tests to see if the <code>counter</code> variable that we declared and initialized earlier is equal to 0. On the first pass through, this will be true. The <code>slides.eq(counter).fadeOut();</code> finds the first slide node in the jQuery object and fades it out. We increase <code>counter</code> by 1 so on the next pass it can deal with the next slide in the jQuery object.
</p>

```js
if (counter === 0) {
    slides.eq(counter).fadeOut();
    counter += 1;
}
```

<p>
  The second condition tests to see if <code>counter</code> is equal to the <code>slidesLen</code> variable. Remember, the <code>slidesLen</code> value is an integer that is 1 less than the total amount of slides. So, if the condition equals true, then we know that the very last slide is being shown and it&#8217;s time to start the slideshow over.
</p>

```js
} else if (counter === slidesLen) {
    counter = 0;
    slides.eq(counter).fadeIn(function () {
        slides.fadeIn();
    });
}
```

<p>
  The first thing we want to do here is set <code>counter</code> to 0 so it knows to deal with the first slide and not the last. We fade in the first slide and pass the <code>fadeIn();</code> method a callback (we want the code to wait until the first slide is done fading in). When the first slide has faded in all the way we can show all of the other slides underneath it so they can be faded out again.
</p>

<p>
  The last part of the conditional only runs if every other test fails.
</p>

```js
} else {
    slides.eq(counter).fadeOut();
    counter += 1;
}
```

<p>
  This must mean that we&#8217;re dealing with a slide that is not the first nor the last but in between.
</p>

<p>
  All that&#8217;s left to do is to call the object method. Since <code>slideshow</code> has already returned an object with a method in it all that&#8217;s left to do is run it.
</p>

```js
slideshow.startSlideshow();
```

<p>
  While the slideshow may just run right now this shouldn&#8217;t limit you from adding your own methods to the object returned by <code>slideshow</code>.
</p>

<p>
  In conclusion, you can see how understanding scoping and the power of closures can help you create awesome features with not a lot of effort. With very minimal code we managed to make a slideshow that is contained and doesn&#8217;t introduce anything new into the window object.
</p>

<h2>
    <strong><a href="http://strongloop.com/get-started/">What’s next?</a></strong>
  </h2>
  
- Ready to develop APIs in Node.js and get them connected to your data? Check out the Node.js [LoopBack framework](http://loopback.io/). We’ve made it easy to get started either locally or on your favorite cloud.
  
