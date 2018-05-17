---
title: Events
layout: page
permalink: /events/
redirect_from:
  - /developers/events/
  - /node-js/node-interactive-2015/
  - /events
---
{% include section.html content='
      <div class="c-grid">
        <div class="_col -col-3-4">
          <h2>Check out StrongLoop at these upcoming conferences, webinars, meetups, and events.</h2>
        </div>
        <div class="_col -col-1-4">
        <img src="/blog-assets/2013/07/sl_nr_events_graphic_0_main.png" class="c-fleximg">
        </div>
      </div>
' %}
<section class="c-section x-white">
  <div class="c-container -padded">
    <div class="c-grid">
      <div class="_col -col-1-1">
          {% include_relative events-table.html %}
      </div>
    </div>
  </div>
</section>

{% assign featured_post = site.posts | where_exp:"post", "post.date <= site.time" %}
{% assign featured_post = featured_post | where: "featured","true" %}
{% for post in featured_post limit:1 %}
  <section class="c-section x-lightgrey">
    <div class="c-container -padded">
      <div class="_col -col-1-1">
      <h2 class="c-heading -h4">Featured: <a class="no_icon" href="{{site.url}}{{ post.url }}">{{ post.title }}</a></h2>
        {% if post.author %}<p class="author">by
          {% for author in post.author %}
            <a class="no_icon" href="/authors/{{ author | replace: " ", "_" | replace: ".", "_" }}/">{{author}}</a>
            {% if forloop.last == false %},{% endif %}
          {% endfor %}
        {{ post.date | date: "%b %-d, %Y" }} </p>
        {% endif %}
        <div class="excerpt">
          {{post.excerpt | truncate: 500 }}
          <p><a class="no_icon" href="{{site.url}}{{ post.url }}">See Full Post</a>
        </div>
        <div class="share">
       <!-- Load Facebook SDK for JavaScript -->
      <div id="fb-root"></div>
      <script>(function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.9&appId=243237449414858";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));</script>
        <div class="fb-share-button" data-href="https://strongloop.com/{{post.url}}" data-layout="button_count" data-size="small" data-mobile-iframe="true"><a class="fb-xfbml-parse-ignore" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https://strongloop.com/{{post.url}}%2F&amp;src=sdkpreparse">Share</a></div>

        <a class="twitter-share-button no_icon"
        href="https://twitter.com/share"
        data-size="large"
        data-text="{{ post.title }}"
        data-url="https://strongloop.com/{{post.url}}"
        data-related="twitterapi,twitter">
        <i class="fa fa-twitter" aria-hidden="true"></i>  Tweet
        </a>
        <a class="newshare-share-button no_icon linkedinshare" href="http://www.linkedin.com/shareArticle?mini=true&amp;url=https://strongloop.com/{{ post.title }}" target="_blank">
          <i class="fa fa-linkedin" aria-hidden="true"></i>  Share
        </a>

        <a class="newshare-share-button no_icon redditshare" href="http://reddit.com/submit?url==https://strongloop.com/{{post.url}}&amp;title={{ post.title }}" target="_blank">
          <i class="fa fa-reddit" aria-hidden="true"></i>  Share
        </a>
        <a class="newshare-share-button tumblrshare no_icon" href="http://www.tumblr.com/share/link?url=https://strongloop.com/{{post.url}}&amp;title={{ post.title }}" target="_blank">
          <i class="fa fa-tumblr" aria-hidden="true"></i>  Share
        </a>
      </div>
    </div>
  </section>
{% endfor %}
<section class="c-section x-lightgrey" >
  <div class="c-container -padded-top">
    <h2 class="c-heading -h3 x-center">Latest Blog Posts</h2>

    <div class="c-grid">
    {% assign posters = site.posts | where_exp:"post", "post.date <= site.time" %}
    {% assign posters = posters | where_exp:"post", "post.visible != 0" %}
    {% for post in posters limit:3 %}
      <div class="_col -col-1-3">
        <div class="blog-mini">
          <h3 class="c-heading -h5"><a class="no_icon" href="{{site.url}}{{ post.url }}">{{ post.title }}</a></h3>
        </div>
        <p class="date"> {{ post.date | date: "%b %-d, %Y" }}</p>
        <div class="excerpt">
          {{post.excerpt | truncate: 150 }}
          <p><a class="no_icon" href="{{site.url}}{{ post.url }}">More...</a>
        </div>
      </div>
    {% endfor %}
      </div>
  </div>
</section>


