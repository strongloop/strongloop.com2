---
id: 14196
title: 'API&#8217;s Lack Conventions and Standards &#8211; Two Perspectives on Solutions'
date: 2014-02-12T19:12:30+00:00
author: Al Tsang
guid: http://strongloop.com/?p=14196
permalink: /strongblog/api-conventions-standards-apps-world-2014/
categories:
  - Community
  - LoopBack
---
I just came back from [Apps World 2014](http://www.apps-world.net/northamerica/), having attended most of the sessions on the API Strategies track among others.  Apps World covers a wide spectrum of technical topics from mobile front-end development using HTML5 to back-end API development and management.  Apps World also has a wide representation of consumer and enterprise mobile developers that highlights the variety of use cases faced by mobile applications.

Because of this breadth and range of coverage, I could talk about many things that I learned and observed.  This blog post captures some of my thoughts on a particular challenge in API development: the lack of standards for APIs and mobile both as a former practitioner and now as a vendor for API development.

## **Old Challenges: Lack of Conventions and Standards** {#APIChallengesandaTaleofTwoPerspectivesfromAppsWorld2014-OldChallenges:LackofConventionsandStandards}

In his presentation, [Travis Broughton](http://blogs.intel.com/application-security/profile-travis-broughton/), an enterprise architect from Intel, showed how APIs have evolved.  He referred to the Gartner report that states &#8220;_&#8230;75% of the Fortune 500 will have some form of API (either internal or external)_&#8220;.  He also cited new-generation companies like Twitter, Twilio, DropBox, and Box whose entire product strategy centers around their APIs.  There&#8217;s no question that APIs have come a long way from being an afterthought to something important to (or at least on the radar of) corporate strategy.

No matter how much things change, some things glaringly stay the same.  From presentations I heard and audience question and answer sessions, there is STILL a jungle of lack of standards, DIY tools, and the technical debt of first generation APIs. Mobile apps are propelling the need for APIs and highlighting these challenges.

## **Practitioner Point of View** {#APIChallengesandaTaleofTwoPerspectivesfromAppsWorld2014-PractitionerPointofView}

Has REST _really_ won?  For external-facing web APIs it certainly has, at least on the surface.  However, the reality is that enterprises still have many legacy APIs with a mish-mash of SOAP and proprietary data formats over HTTP.  Even for companies that have some sort of REST API, there is little consistency among them because REST is not a standard, but rather an &#8220;architectural style.&#8221;  REST leaves itself open to wide interpretation and varying implementations because there is no official specification.

Here are examples of differing URI conventions with nouns, verbs, and operations as first-class citizen resources.
  
<!--more-->

<div>
  <div>
    <div>
      <div id="highlighter_463791">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <div title="Hint: double-click to select code">
                <div>
                  <code>GET http:</code><code>//acme.com/api/catalog?method=getItemsById&sort=desc</code>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</div>

<div>
  <div>
    <b> </b>
  </div>
  
  <div>
    <div>
      <div id="highlighter_299175">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <div title="Hint: double-click to select code">
                <div>
                  <code>GET http:</code><code>//acme.com/api/catalog/getItemsById?sort=desc</code>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</div>

These two samples both conform to the REST style of retrieving a resource as an idempotent operation with HTTP GET, which is a great start.  (Remember the early days of faux-REST proprietary APIs over HTTP where you could actually do actions all through a simple GET? <img alt="(tongue)" src="https://strongloop.atlassian.net/wiki/s/en_GB-1988229788/4918/d4c6588071ed069690272717ac846d2f7ddfbe0a.19/_/images/icons/emoticons/tongue.png" data-emoticon-name="cheeky" />).

The problem with the first example is the retrieval of the catalog items as a sub-resource and not just a reference from the catalog is mixed into the query string parameters for data retrieval.   Furthermore, it mixes in verbs into query string parameters where the HTTP noun should be used against a noun specified on the URL path itself.

The second example mixes in a specific operation as a first-class citizen resource as what would otherwise be &#8220;items&#8221; and again it mixes in verbs into the URL path.  While acceptable, this confusingly blurs the line between REST as a resource-based API versus a remote procedure based API.  The first rule of thumb to nouns over verbs with many resources over many operations has always been tricky.

<div>
  <div>
    <div>
      <div id="highlighter_593594">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <div title="Hint: double-click to select code">
                <div>
                  <code>GET http:</code><code>//acme.com/api/catalog/items?sort=-id</code>
                </div>
                
                <div>
                  <code>GET http:</code><code>//acme.com/api/catalog/items?sort={id:desc}</code>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</div>

The sample above shows a couple of variants that might have been a better way to address retrieval of items from the catalog by ID in descending order.  The first calls out the sub-resource from the catalog explicitly.  Although the catalog may have more than one child resource, the granularity can be specified with the recursive convention <path>/resource/sub-resource/&#8230;.  The second entry refines the first entry to make arguments more extensible by encapsulating into JSON.  You can imagine adding more sort parameters by adding more to the JSON string, e.g. sort={id:desc, name:asc}.

## **Vendor Point of View** {#APIChallengesandaTaleofTwoPerspectivesfromAppsWorld2014-VendorPointofView}

Vendors building products to support such a wide interpretation of what REST APIs should look like are faced with generalizing their solutions to meet all types of use cases.

When REST started to take hold, it was still a best practice to specify content-type for delivery to be flexible; for example, as shown below.

<div>
  <div>
    <div>
      <div id="highlighter_110090">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td>
              <div title="Hint: double-click to select code">
                <div>
                  <code>GET http:</code><code>//acme.com/api/catalog/items?format=json</code>
                </div>
                
                <div>
                  <code>GET http:</code><code>//acme.com/api/catalog/items?format=xml</code>
                </div>
                
                <div>
                  <code>OR</code>
                </div>
                
                <div>
                  <code>sending HTTP headers to set x-li-format=json/xml</code>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</div>

This flexibility wasn&#8217;t just driven by external parties lagging behind on consumption but also because behind the scenes, the enterprise&#8217;s own infrastructure was still tied to old standards.  Part of the vendor&#8217;s burden was to support the legacy infrastructure for services driven by XML while surfacing a JSON representation that complied with RESTful standards.  This need to mediate on the fly between different content types is still a key delivery function for API gateways.  Again, a lack of standards for APIs means that the vendor needs to build a pluggable swiss-army-knife of mediation layers to transform and massage the final data output with things like built-in pagination (especially for mobile).  What if the legacy API wasn&#8217;t even structured as SOAP with at least a WSDL or schema?  Now the vendor would need to build functionality that enables you to map from the legacy data payload to some JSON representation expressed as a REST endpoint.

## **Solution** {#APIChallengesandaTaleofTwoPerspectivesfromAppsWorld2014-Solution}

REST needs standardization to enable API developers to improve velocity and productivity.  This is particularly true when building a value-add solution that depends on multiple cloud-based services in conjunction with enterprise legacy services.  There have been failed attempts at standardization, such as re-purposing WSDL, Google&#8217;s partial attempt to gather some consensus around WADL, and newer specifications like <a href="https://github.com/wordnik/swagger-core/wiki" rel="nofollow">swagger</a>, <a href="https://developers.google.com/discovery/v1/using" rel="nofollow">Google API Discovery Service</a>, <a href="http://raml.org/" rel="nofollow">RAML</a>, and so on.  Even _with_ a standard, only the next generation of REST APIs will be able to take advantage of it.  As everyone knows, the scariest part of exposing an API is that it lives practically forever and supporting it can become burdensome.

StrongLoop provides a solution to the challenges due to lack of standards: open-source based solutions and tooling to surface modern APIs and contend with diverse legacy infrastructure.  Our vision goes beyond the browser, smartphone, and tablet to the world we&#8217;re evolving toward with machine-to-machine (M2M) and Internet of Things (IoT).   The heart of our solution is the LoopBack API framework built on top of Node.js.  Node has become the pre-eminent technology to glue toether existing data and services (in the enterprise datacenter and the cloud) and expose uniform APIs.

## **Use LoopBack to build APIs in Node.js**

[LoopBack](http://strongloop.com/mobile-application-development/loopback/) is an open source framework for building APIs in Node. Install locally or on your favorite cloud, with a [simple npm install](http://strongloop.com/get-started/).

[<img class="aligncenter size-full wp-image-12726" alt="LoopBack API Explorer" src="https://strongloop.com/wp-content/uploads/2014/01/Screen-Shot-2014-01-08-at-10.49.19-AM.png" width="1532" height="949" />](https://strongloop.com/wp-content/uploads/2014/01/Screen-Shot-2014-01-08-at-10.49.19-AM.png)

&nbsp;

## **What’s next?**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What’s in the upcoming Node v0.12 version? <a href="http://strongloop.com/strongblog/performance-node-js-v-0-12-whats-new/">Big performance optimizations</a>, read the blog by Ben Noordhuis to learn more.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Watch Bert Belder’s comprehensive <a href="http://strongloop.com/developers/videos/#whats-new-in-nodejs-v012">video </a>presentation on all the new upcoming features in v0.12</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Need performance monitoring, profiling and cluster capabilites for your Node apps? Check out <a href="http://strongloop.com/node-js-performance/strongops/">StrongOps</a>! We’ve made it easy to get started with <a href="http://strongloop.com/get-started/">a simple npm install</a>.<a href="http://strongloop.com/get-started/"><br /> </a></span>
</li>