---
id: 23908
title: Using Dependency Injection in Your JavaScript Unit Tests with Rewire
date: 2015-03-18T08:00:10+00:00
author: Igor Ribeiro Lima
guid: https://strongloop.com/?p=23908
permalink: /strongblog/javascript-unit-testing-using-dependency-injection/
categories:
  - Community
  - How-To
---
_Editor: Check out this guest blog post by [Igor Ribeiro Lima](https://twitter.com/igorribeirolima) on how to perform JavaScript unit testing using dependency injection._

You probably already know that to do JavaScript testing well, you need to make sure you are testing the following:

  * <span style="font-size: 18px;">Injecting mocks for other modules</span>
  * <span style="font-size: 18px;">Leaking private variables</span>
  * <span style="font-size: 18px;">Overriding variables within the module</span>

<a href="https://github.com/jhnns/rewire" rel="noreferrer">rewire</a> is a tool for helping test for the above. It provides an easy way to perform dependency injection, plus adds a special \`setter\` and \`getter\` to modules so you can modify their behaviour. What <a href="https://github.com/jhnns/rewire" rel="noreferrer">rewire</a> doesn&#8217;t do is load the file and evaluate the contents to emulate the require mechanism. It actually uses Node&#8217;s own \`require\` to load the module.

To get started with dependency injection, we&#8217;ll create a twitter rest api server and do unit tests using mocks and overriding variables within modules. This example will focus on back-end unit testing, but if you want to use <a href="https://github.com/jhnns/rewire" rel="noreferrer">rewire</a> also on the client-side take a look at <a href="https://github.com/jhnns/rewire#client-side-bundlers" rel="noreferrer">client-side bundlers</a>.

<!--more-->

## <a class="anchor" href="https://gist.github.com/igorlima/b31f1a26a5b100186a98#an-example" rel="noreferrer" name="user-content-an-example"></a>**An example**

This example is a public HTTP API that retrieves Twitter user timelines. It has basically two files: <a href="https://github.com/igorlima/twitter-rest-api-server/blob/master/server.js" rel="noreferrer">server.js</a> and <a href="https://github.com/igorlima/twitter-rest-api-server/blob/master/twitter.js" rel="noreferrer">twitter.js</a>.

The first file creates <a href="http://expressjs.com/starter/hello-world.html" rel="noreferrer">an basic instance</a> of <a href="http://expressjs.com/" rel="noreferrer">express</a> and defines <a href="http://expressjs.com/starter/basic-routing.html" rel="noreferrer">a route for a GET request method</a>, which is `/twitter/timeline/:user`.

The second file is a module responsible for retrieving data from Twitter. It requires:

<ul class="task-list">
  <li>
    <a href="https://github.com/ttezel/twit" rel="noreferrer"><strong>twit</strong></a>: Twitter API Client for node
  </li>
  <li>
    <a href="https://github.com/caolan/async" rel="noreferrer"><strong>async</strong></a>: is a utility module which provides straight-forward, powerful functions for working with asynchronous JavaScript
  </li>
  <li>
    <a href="http://momentjs.com/" rel="noreferrer"><strong>moment</strong></a>: a lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates.
  </li>
</ul>

Part of these modules will be mocked and overridden in our tests.

## <a class="anchor" href="https://gist.github.com/igorlima/b31f1a26a5b100186a98#running-the-example" rel="noreferrer" name="user-content-running-the-example"></a>**Running the example**

This example is already running <a href="https://social-media-rest-api.herokuapp.com/" rel="noreferrer">in a cloud</a>. So you can reach the urls below and see it working:

<ul class="task-list">
  <li>
    <a href="https://social-media-rest-api.herokuapp.com/twitter/timeline/igorribeirolima" rel="noreferrer">igorribeirolima timeline</a>
  </li>
  <li>
    <a href="https://social-media-rest-api.herokuapp.com/twitter/timeline/strongloop" rel="noreferrer">strongloop timeline</a>
  </li>
  <li>
    <a href="https://social-media-rest-api.herokuapp.com/twitter/timeline/tableless" rel="noreferrer">tableless timeline</a>
  </li>
</ul>

To run it locally, clone <a href="https://github.com/igorlima/twitter-rest-api-server" rel="noreferrer">this repo</a> with:

\`git clone git@github.com:igorlima/twitter-rest-api-server.git twitter-rest-api-server\`

&#8230;and set five environment variables. Those envs are listed below. For security reasons I won&#8217;t share my token. To get yours, access <a href="https://dev.twitter.com/overview/documentation" rel="noreferrer">Twitter developer documentation</a>, <a href="https://apps.twitter.com/" rel="noreferrer">create a new app</a> and set up your credentials.

For <a href="http://stackoverflow.com/questions/7501678/set-environment-variables-on-mac-os-x-lion" rel="noreferrer">Mac users</a>, you can simply type:

    export TwitterConsumerKey="xxxx"
    export TwitterConsumerSecret="xxxx"
    export TwitterAccessToken="xxxx"
    export TwitterAccessTokenSecret="xxxx"
    export MomentLang="pt-br"
    

For <a href="http://stackoverflow.com/questions/21606419/set-windows-environment-variables-with-commandline-cmd-commandprompt-batch-file" rel="noreferrer">Windows users</a>, do:

    SET TwitterConsumerKey="xxxx"
    SET TwitterConsumerSecret="xxxx"
    SET TwitterAccessToken="xxxx"
    SET TwitterAccessTokenSecret="xxxx"
    SET MomentLang="pt-br"
    

After setting up the environment variables, go to `twitter-rest-api-server` folder, install all node dependencies by `npm install`, then run via terminal `node server.js`. It should be available at the port `5000`. Go to your browser and reach `http://localhost:5000/twitter/timeline/igorribeirolima`.

<img class=" aligncenter" src="https://camo.githubusercontent.com/ead718b7d61f968c432b27afea3063bac51bb783/687474703a2f2f69313336382e70686f746f6275636b65742e636f6d2f616c62756d732f61673138322f69676f727269626569726f6c696d612f72756e6e696e67253230657870726573732532306170702532306578616d706c652532306c6f63616c6c795f7a70736e646169646734772e706e67" alt="running express app example locally" />

## <a class="anchor" href="https://gist.github.com/igorlima/b31f1a26a5b100186a98#writing-unit-tests" rel="noreferrer" name="user-content-writing-unit-tests"></a>**Writing unit tests**

<a href="http://mochajs.org/" rel="noreferrer">Mocha</a> is the JavaScript test framework we&#8217;ll use in this example. It makes asynchronous testing simple and fun. <a href="http://mochajs.org/" rel="noreferrer">Mocha</a> allows you to use any assertion library you want, if it throws an error, it will work! In this example we are gonna utilize <a href="https://nodejs.org/api/assert.html" rel="noreferrer">Node&#8217;s regular assert</a> module.

Let&#8217;s say you want to test the <a href="https://github.com/igorlima/twitter-rest-api-server/blob/master/twitter.js" rel="noreferrer">twitter.js</a> code:

  ```js
var Twit   = require('twit'),
    async  = require('async'),
    moment = require('moment'),
    T      = new Twit({
      consumer_key: process.env.TwitterConsumerKey || '...',
      consumer_secret: process.env.TwitterConsumerSecret || '...',
      access_token: process.env.TwitterAccessToken || '...',
      access_token_secret: process.env.TwitterAccessTokenSecret || '...'
    }),

    mapReducingTweets = function(tweet, callback) {
      callback(null, simplify(tweet));
    },

    simplify = function(tweet) {
      var date = moment(tweet.created_at, "ddd MMM DD HH:mm:ss zz YYYY");
      date.lang( process.env.MomentLang );
      return {
        date: date.format('MMMM Do YYYY, h:mm:ss a'),
        id: tweet.id,
        user: {
          id: tweet.user.id
        },
        tweet: tweet.text
      };
    };

module.exports = function(username, callback) {
  T.get("statuses/user_timeline", {
    screen_name: username,
    count: 25
  }, function(err, tweets) {
    if (err) callback(err);
    else async.map(tweets, mapReducingTweets, function(err, simplified_tweets) {
      callback(null, simplified_tweets);
    });
  })
};
```

To do that in a easy and fun way, let&#8217;s load this module using <a href="https://github.com/jhnns/rewire" rel="noreferrer">rewire</a>. So, within your test module <a href="https://github.com/igorlima/twitter-rest-api-server/blob/master/twitter-spec.js" rel="noreferrer">twitter-spec.js</a>:

```js
var rewire  = require('rewire'),
    assert  = require('assert'),
    twitter = rewire('./twitter.js'),
    mock    = require('./twitter-spec-mock-data.js');
```
<a href="https://github.com/jhnns/rewire" rel="noreferrer">rewire</a> acts exactly like \`require\`.  With just one difference: Your module will now export a special \`setter\` and \`getter\` for private variables.

```js
myModule.__set__("path", "/dev/null");
myModule.__get__("path"); // = '/dev/null'
```

This allows you to mock everything in the top-level scope of the module, like the _twitter module_ for example. Just pass the variable name as first parameter and your mock as second.

You may also override globals. These changes are only within the module, so you don&#8217;t have to be concerned that other modules are influenced by your mock.

```js
describe('twitter module', function(){

  describe('simplify function', function(){
    var simplify;

    before(function() {
      simplify = twitter.__get__('simplify');
    });

    it('should be defined', function(){
      assert.ok(simplify);
    });

    describe('simplify a tweet', function(){
      var tweet, mock;

      before(function() {
        mock = mocks[0];
        tweet = simplify(mock);
      });

      it('should have 4 properties', function() {
        assert.equal( Object.keys(tweet).length, 4 );
      });

      describe('format dates as `MMMM Do YYYY, h:mm:ss a`', function() {

        describe('English format', function() {
          before(function() {
            revert = twitter.__set__('process.env.MomentLang', 'en');
            tweet = simplify(mock);
          });

          it('should be `March 6th 2015, 2:29:13 am`', function() {
            assert.equal(tweet.date, 'March 6th 2015, 2:29:13 am');
          });

          after(function(){
            revert();
          });

        });

        describe('Brazilian format', function() {
          before(function() {
            revert = twitter.__set__('process.env.MomentLang', 'pt-br');
            tweet = simplify(mock);
          });

          it('should be `Março 6º 2015, 2:29:13 am`', function() {
            assert.equal(tweet.date, 'Março 6º 2015, 2:29:13 am');
          });

          after(function(){
            revert();
          });

        });

      });

    });

  });

  describe('retrieve timeline feed', function() {
    var revert;
    before(function() {
      revert = twitter.__set__("T.get", function( api, query, callback ) {
        callback( null, mocks);
      });
    });

    describe('igorribeirolima timeline', function() {
      var tweets;
      before(function(done){
        twitter('igorribeirolima', function(err, data) {
          tweets = data;
          done();
        });
      });

      it('should have 19 tweets', function() {
        assert.equal(tweets.length, 19);
      });

    });

    after(function() {
      revert();
    });

   });
});
```

`__set__` returns a function which reverts the changes introduced by this particular `__set__` call.

## <a class="anchor" href="https://gist.github.com/igorlima/b31f1a26a5b100186a98#running-unit-tests" rel="noreferrer" name="user-content-running-unit-tests"></a>**Running unit tests**

Before we get into the test and walk through it, let&#8217;s install the \`mocha\` CLI with `npm install -g mocha`. It will allow us to run our tests by just typing `mocha twitter-spec.js`. The following is an image that illustrates the test result.

<a href="https://camo.githubusercontent.com/589136a1d88a7a084b2b4d0e627d9b5607c7977a/687474703a2f2f69313336382e70686f746f6275636b65742e636f6d2f616c62756d732f61673138322f69676f727269626569726f6c696d612f72756e6e696e67253230756e697425323074657374735f7a70736871617a7935706f2e706e67" target="_blank" rel="noreferrer"><img src="https://camo.githubusercontent.com/589136a1d88a7a084b2b4d0e627d9b5607c7977a/687474703a2f2f69313336382e70686f746f6275636b65742e636f6d2f616c62756d732f61673138322f69676f727269626569726f6c696d612f72756e6e696e67253230756e697425323074657374735f7a70736871617a7935706f2e706e67" alt="image that ilustrates unit tests running" /></a>

Check out [this video](http://showterm.io/3c970843502e140bcfabd#slow) and see step by step in detail everything discussed so far.

## <a class="anchor" href="https://gist.github.com/igorlima/b31f1a26a5b100186a98#conclusion" rel="noreferrer" name="user-content-conclusion"></a>**Conclusion**

As you can see, with rewire it&#8217;s not too painful to test:

  * injecting mocks for other modules
  * leaking private variables
  * overriding variables within the module

That&#8217;s it folks. I hope you learned just how simple and fun is to do dependency injection unit testing. Thanks for reading!