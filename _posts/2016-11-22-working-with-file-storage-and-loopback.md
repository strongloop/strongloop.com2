---
id: 28327
title: Working with File Storage and LoopBack
date: 2016-11-22T07:38:53+00:00
author: Raymond Camden
guid: https://strongloop.com/?p=28327
permalink: /strongblog/working-with-file-storage-and-loopback/
sidebar:







inline_featured_image:
  - "0"
categories:
  - How-To
  - LoopBack
---
> **Update for March, 2017:** One of the things I mention at the very end of this article is how file uploads will overwrite each other if they use the same name. I fixed this with a pull request that was accepted a few days ago. By using a new configuration option, `nameConflict:makeUnique`, files will automatically be renamed with a UUID and their original extension. I recommend \*always\* using this option! 

I&#8217;ve got a confession to make: I absolutely love LoopBack. How much do I love it? Before I even joined the StrongLoop team at IBM I was blogging on LoopBack and giving presentations on it as well. I basically told the person interviewing me that it didn&#8217;t really matter if they hired me or not; I was going to evangelize LoopBack because I thought it was the coolest thing since sliced bread and beer. In general, I love LoopBack and every aspect of it. However, it doesn&#8217;t mean that it is perfect. Today I&#8217;m going to discuss a feature that is—in my opinion—somewhat &#8220;rough&#8221;. I&#8217;m not saying to avoid it, not at all, just be prepared for a somewhat bumpy ride. Ready?

So, one of the things that LoopBack makes incredibly easy is handling data in a persistence system. You define a model, let&#8217;s say Cat, various properties and types, and then LoopBack can handle persisting that in a variety of different storage mechanisms, from Oracle to MySQL to MongoDB. It just plain works, which is cool. However, the data we&#8217;re typically dealing with are simple strings represented in JSON. What about binary data?
  
<!--more-->

For example &#8211; imagine a Cat model with three properties:

* name (string)
  
* age (number)
  
* breed (string)

Working with this over REST-based APIs is trivial. So for example, creating a new Cat simply involves sending a JSON string like so:

```js
{"name":"Mr Fluffy Pants the Third", "age":3, "breed":"mutt"}

```

Now let&#8217;s assume we want to add some new properties to the cat &#8211; a picture, and a resume. (Wait, why are you laughing? 45% of LinkedIn users are actually cats. I know that&#8217;s true because I read it on the Internet.) How would you do that?

Turns out &#8211; LoopBack has support for working with files. The [Storage component](http://loopback.io/doc/en/lb2/Storage-component.html#using-cli-and-json) is an optional feature that lets you work with various cloud storage providers (Amazon, Rackspace, Openstack, and Azure) as well as the file system. However, it&#8217;s usage is a bit confusing and it doesn&#8217;t quite work the way you may think. Let&#8217;s explore this component and I&#8217;ll explain how to use it as well as what problems you will run into.

First and foremost: as an optional component, you need to first install it via npm:

```js
npm install loopback-component-storage --save

```

So far so good. Now comes the first weird part. To use this feature, you set up a new datasource. In general, I tend to think of datasources as only being an ORM-like layer for persisting models, so this part was definitely confusing, but it is the first thing you do when setting it up. Follow the normal instructions for setting up a datasource via the CLI:

```js
$ slc loopback:datasource
[?] Enter the data-source name: storage
[?] Select the connector for storage: other
[?] Enter the connector name without the loopback-connector- prefix: loopback-component-storage
[?] Install storage (Y/n)

```

A few things to note. I was a bit unsure as to what to name the datasource. Remember that my use case was specifically related to adding file support to my Cat model. But we&#8217;re going to end up with a &#8220;generic&#8221; file storage system so a generic name like &#8220;storage&#8221; is fine.

Also &#8211; and this is crucial &#8211; **ignore the CLI when it says enter the name without the loopback-connector- prefix**. You absolutely, 100%, want to include the full name: `loopback-component-storage`. The docs show it, but if you&#8217;re like me, you may assume the CLI is right. It isn&#8217;t. Trust me.

At this point, you&#8217;ll have an entry in your `datasources.json` for the new datasource, but you have to configure it. Each cloud provider has their own set of credentials and settings. This is [documented](http://loopback.io/doc/en/lb2/Storage-component.html#using-cli-and-json), but for quick testing with the file system, you can add a key defining the `root` property. Here is the one I&#8217;ve used for my demo application.

```js
"storage": {
  "name": "storage",
  "connector": "loopback-component-storage",
  "provider": "filesystem",
  "root": "./files"
}

```

The `./` there refers to the root of the LoopBack project, **not** the root of the server directory as you may think. The actual name of the folder isn&#8217;t important, but obviously you want to give it a meaningful name.

Now comes yet another crucial part, and this one isn&#8217;t documented very well. (Although I plan on doing some edits to the documentation soon!) To set up an API to handle file uploads, it needs a model. As best as I can tell, the model only affects the process by giving a particular name to the API. It doesn&#8217;t do anything else. (Although see my notes at the bottom. I may be wrong about this.) So again, you can name this whatever you want, but I went with the name `attachment`. Your model&#8217;s Base class will be &#8220;Model&#8221;, not &#8220;PersistedModel&#8221;, since you aren&#8217;t creating something that&#8217;s mapping to rows in a database or objects in a NoSQL db. (When you select your storage datasource, the CLI is smart enough to auto select &#8220;Model&#8221;.)

So now you have a model called `attachment` based on the storage datasource. Now is when things get interesting. At this point, you have, essentially, a &#8220;File&#8221; server. This will let you create, list, and delete folders (what LoopBack calls &#8220;containers&#8221;), as well as list files in folders and upload or download them. You can also delete files.

The full API is [documented](http://loopback.io/doc/en/lb2/Storage-component-REST-API.html) here, but let&#8217;s consider a few simple examples.

**GET /api/attachments**

This will list all the folders under my filesystem, again based on the root I defined above. This returns a list of these folders along with some metadata. Did you notice it was plural? This too isn&#8217;t really documented. When you create your model and use a singular name, the API only uses the plural name.

<img class="aligncenter size-full wp-image-28332" src="https://strongloop.com/wp-content/uploads/2016/11/lb1-1.png" alt="lb1" width="566" height="435" srcset="https://strongloop.com/wp-content/uploads/2016/11/lb1-1.png 566w, https://strongloop.com/wp-content/uploads/2016/11/lb1-1-300x231.png 300w, https://strongloop.com/wp-content/uploads/2016/11/lb1-1-450x346.png 450w" sizes="(max-width: 566px) 100vw, 566px" />

In the screenshot above, you can see two folders (which again, the docs refer to as containers): picture and resume. I created these by hand and named them according to what I planned on using them for.

**GET /api/attachments/resume/files**

This returns a list of files in the resume folder. The values look similar to the folder/container list:

<img class="aligncenter size-full wp-image-28333" src="https://strongloop.com/wp-content/uploads/2016/11/lb2.png" alt="lb2" width="572" height="1055" srcset="https://strongloop.com/wp-content/uploads/2016/11/lb2.png 572w, https://strongloop.com/wp-content/uploads/2016/11/lb2-163x300.png 163w, https://strongloop.com/wp-content/uploads/2016/11/lb2-558x1030.png 558w, https://strongloop.com/wp-content/uploads/2016/11/lb2-382x705.png 382w, https://strongloop.com/wp-content/uploads/2016/11/lb2-450x830.png 450w" sizes="(max-width: 572px) 100vw, 572px" />

**GET /api/attachments/resume/avatar.jpg**

This returns metadata about the file, not the file itself. The form is the exact same as the previous screen shot, except just for the individual file, not an array of files.

**GET /api/attachments/resume/download/avatar.jpg**

This returns the actual binary data, and in my limited testing, LoopBack seems to set the proper content-type based on the file being sent.

Ok, so let&#8217;s just clarify what we&#8217;ve done here. What we have is a generic service that lets us browse folders and files. We can upload and download. What we don&#8217;t have is a way to associate an existing &#8220;regular&#8221; persisted model with these files.

As far as I can tell, there is no real way to do that. You can, however, simply store the file name as a string value in the model. I went into my cat model and added two new string properties:

```js
{
  "name": "cat",
  "base": "PersistedModel",
  "idInjection": true,
  "options": {
    "validateUpsert": true
  },
  "properties": {
    "name": {
      "type": "string",
      "required": true
    },
    "age": {
      "type": "number",
      "required": true
    },
    "breed": {
      "type": "string",
      "required": true
    },
    "picture": {
      "type": "string",
      "required": false
    },
    "resume": {
      "type": "string",
      "required": false
    }
  },
  "validations": [],
  "relations": {},
  "acls": [],
  "methods": {}
}

```

I specifically made them **not** required. Why? I wanted the ability to send a simple JSON string for the &#8216;simple&#8217; cat data and then optionally supply the filenames later. In theory it would be possible to POST the simple data along with file data and use a remote hook to handle storage, but I thought this route may be simpler. I&#8217;m **definitely** willing to be proven wrong on this.

Now let&#8217;s consider how we can actually use these APIs. I built an incredibly simple jQuery-based front end that has 2 main features. It lists all cats and provides a form for adding new cats.

<img class="aligncenter size-full wp-image-28335" src="https://strongloop.com/wp-content/uploads/2016/11/lb3.png" alt="lb3" width="683" height="1077" srcset="https://strongloop.com/wp-content/uploads/2016/11/lb3.png 683w, https://strongloop.com/wp-content/uploads/2016/11/lb3-190x300.png 190w, https://strongloop.com/wp-content/uploads/2016/11/lb3-653x1030.png 653w, https://strongloop.com/wp-content/uploads/2016/11/lb3-447x705.png 447w, https://strongloop.com/wp-content/uploads/2016/11/lb3-450x710.png 450w" sizes="(max-width: 683px) 100vw, 683px" />

Not the slickest of apps, but it gets the job done. I began with a simple version that simply ignores the additional data. Here is that script in it&#8217;s entirety:

```js
var $name, $age, $breed, $picture, $resume, $catList;

var apiUrl = 'http://localhost:3000/api/';

$(document).ready(function() {

    $('#addCatForm').on('submit', handleForm);

    $name = $('#name');
    $age = $('#age');
    $breed = $('#breed');
    $picture = $('#picture');
    $resume = $('#resume');
    $catList = $('#catList');

    getCats();

});

function getCats() {

    var list = '';

    $.get(apiUrl + 'cats').then(function(res) {
        res.forEach(function(cat) {
            list += `
            &lt;h2&gt;${cat.name}&lt;/h2&gt;
            &lt;p&gt;
            ${cat.name} is a ${cat.breed} and is ${cat.age} year(s) old.
            &lt;/p&gt;`;
        });
        $catList.html(list);
    });
}

function handleForm(e) {
    e.preventDefault();

    var cat = {
        name:$name.val(),
        age:$age.val(),
        breed:$breed.val()
    }

    console.log(cat);

    $.post(apiUrl + 'cats', cat).then(function(res) {
        console.log(res);
        getCats();
    });

}

```

Nice and simple, right? Getting all the cats is a simple GET and making a new cat is a simple POST. Hold on to your hats, because now things get a bit more complex.

First and foremost, to handle file uploads, you need to use XHR2. This discounts IE9 and earlier, but for the most part, is pretty well supported. I borrowed a simple function from [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Using_files_from_web_applications) and slightly modified it to return a Promise.

```js
//Stolen from: https://developer.mozilla.org/en-US/docs/Using_files_from_web_applications
function sendFile(file, url) {
    return new Promise(function(resolve, reject) {

        var xhr = new XMLHttpRequest();
        var fd = new FormData();

        xhr.open("POST", url, true);
        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4 && xhr.status == 200) {
                resolve(JSON.parse(xhr.responseText));
            }
        };
        fd.append('file', file);
        xhr.send(fd);

    });
}

```

This lets me pass in a file object and a URL for the destination and then handle the result. So far so good. Now we need to work on the Cat creation process. Before we had one simple POST. Now though we have 1 to 3. Since the user may choose to select a picture and resume (or may not choose to do so), we have to optionally handle them. We also have to update the cat with the filenames of the selected files when, and again if, the user selects them. Here is the new version of the handler.

```js
function handleForm(e) {
    e.preventDefault();

    var cat = {
        name:$name.val(),
        age:$age.val(),
        breed:$breed.val()
    }

    console.log(cat);

    // step 1 - make the cat, this gives us something to associate with
    $.post(apiUrl + 'cats', cat).then(function(res) {

        //copy res since it has the id
        cat = res;

        var promises = [];

        // step 2: do we have binary crap?
        if($resume.val() != '') {
            console.log('i need to process the resume upload');
            promises.push(sendFile($resume.get(0).files[0], apiUrl + 'attachments/resume/upload'));
        }

        if($picture.val() != '') {
            console.log('i need to process thepicture upload');
            promises.push(sendFile($picture.get(0).files[0], apiUrl + 'attachments/picture/upload'));
        }

        // no need to see if I have promises, it still resolves if empty
        Promise.all(promises).then(function(results) {
            console.log('back from all promises', results);
            //update cat if we need to
            if(promises.length &gt;= 1) {
                /*
                so we have one or two results, we could add some logic to see what
                we selected so we know what is what, but we can simplify since the result
                contains a 'container' field that matches the property
                */
                results.forEach(function(resultOb) {
                    if(resultOb.result.files && resultOb.result.files.file[0].container) {
                        cat[resultOb.result.files.file[0].container] = resultOb.result.files.file[0].name;
                    }
                });
                console.dir(cat);
                //now update cat, we can't include the id though
                var id = cat.id;
                delete cat.id;
                $.post(apiUrl + 'cats/'+id+'/replace', cat).then(function() {
                    getCats();
                });
            } else {
                getCats();
            }
        });

    });

}

```

Quite a bit longer, but not terribly so. We use the power of promises and the `all` method as a way of saying, &#8220;when both, or one, or none, of the uploads are done, run this&#8221;. We then update the cat with the new values. And that&#8217;s that.

You can find a complete copy of this demo at <https://github.com/cfjedimaster/StrongLoopDemos/tree/master/filetest>.

I want to be absolutely clear that this was my first test of this particular feature and what I&#8217;m doing may not be &#8220;proper&#8221;, but it worked, and I&#8217;m fine with that.

<img class="aligncenter size-full wp-image-28336" src="https://strongloop.com/wp-content/uploads/2016/11/reactionpic6.jpg" alt="reactionpic6" width="500" height="479" srcset="https://strongloop.com/wp-content/uploads/2016/11/reactionpic6.jpg 500w, https://strongloop.com/wp-content/uploads/2016/11/reactionpic6-300x287.jpg 300w, https://strongloop.com/wp-content/uploads/2016/11/reactionpic6-450x431.jpg 450w" sizes="(max-width: 500px) 100vw, 500px" />

Some final thoughts/issues/etc:

  * Currently, the filesystem support does not create new files when you upload them. That means if two people upload foo.jpg, the second one will simply overwrite the first one. The cloud-based providers don&#8217;t do that. I&#8217;ve got a bug report for this.
  * There are a number of ways to add additional checks, security, etc to the service. For example, specifying a maximum file size and particular file types. You can also handle the file upload manually and handle name conflicts. Unfortunately this isn&#8217;t terribly well documented. From what I can see, you can&#8217;t add this to the model &#8220;dot js&#8221; file, which would be ideal.
  * As for security, I did a quick test where I locked down the model via ACLs and `slc loopback:acl` and it worked as expected.