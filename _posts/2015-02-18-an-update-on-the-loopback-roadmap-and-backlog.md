---
id: 23523
title: An Update on the LoopBack Roadmap and Backlog
date: 2015-02-18T08:15:48+00:00
author: Al Tsang
guid: http://strongloop.com/?p=23523
permalink: /strongblog/an-update-on-the-loopback-roadmap-and-backlog/
categories:
  - Community
  - LoopBack
---
<p dir="ltr">
  It&#8217;s no surprise that here at StrongLoop we develop our software using agile methodologies, most notably scrum.  Building a next-generation API platform means we have to iterate quickly, change direction just as quickly, and re-prioritize accordingly.
</p>

<p dir="ltr">
  As a startup, we are susceptible to whipsawing based on customer demands, changes in Node and the Node ecosystem, plus the success and adoption of our open-source and commercial products.
</p>

<p dir="ltr">
  For a long time, we&#8217;ve been trying to figure out a way to share LoopBack&#8217;s direction and roadmap while being able to:
</p>

  * <span style="font-size: 18px;">Ensure that the direction and roadmap is up to date and current.</span>
  * <span style="font-size: 18px;">Transparently show what we&#8217;re prioritizing and working on at any given time.</span>
  * <span style="font-size: 18px;">Maintain confidentiality for features to support commercial products.</span>
  * <span style="font-size: 18px;">Solicit feedback in an ongoing, actionable, and structured way.</span>

<p dir="ltr">
  We  think we&#8217;ve solved all but the last of the set of requirements listed above.
</p>

<p dir="ltr">
  <!--more-->
</p>

<p dir="ltr">
  We run two-week sprints and predominantly work in GitHub; however we’ve found tools that integrate with GitHub to be unsatisfactory.
</p>

<p dir="ltr">
  Then we stumbled upon <a href="http://www.waffle.io">Waffle.io</a>.
</p>

<p dir="ltr">
  If you&#8217;re not familiar with Waffle.io, it&#8217;s a agile development tool built directly on top of GitHub by a fantastic team at Rally.  With Waffle.io, we have a better way to track work AND now the means to provide transparency on what we&#8217;re working on and what we&#8217;re prioritizing literally in real time.  We use it to groom and maintain our backlog and track what the team is working on in any given sprint.  The Waffle team continues to add features and address issues: their responsiveness has made all the difference.
</p>

<p dir="ltr">
  Here&#8217;s a breakdown of our development process:
</p>

<p dir="ltr">
  The rough <a href="https://github.com/strongloop/loopback/wiki/Roadmap">LoopBack roadmap </a>is currently on LoopBack&#8217;s GitHub wiki.  It represents the themes around which we organize our work.  We have an ongoing discussion on how to get this polished up and updated more easily.
</p>

<p dir="ltr">
  We meet twice a week with members of our product team, folks from the field interacting with customers, and those interacting with the community to discuss all StrongLoop products including LoopBack.
</p>

<p dir="ltr">
  From here, work then flows into the <a href="https://waffle.io/strongloop/loopback">LoopBack Waffle scrum board</a>, show below:
</p>

<p dir="ltr">
  <img class="aligncenter size-large wp-image-23527" src="https://strongloop.com/wp-content/uploads/2015/02/Screen-Shot-2015-02-18-at-8.18.38-AM-1030x376.png" alt="Screen Shot 2015-02-18 at 8.18.38 AM" width="1030" height="376" />
</p>

<p dir="ltr">
  Themes are taken from the roadmap and story cards at the epic level are put into our Backlog, the first column on the Waffle board. From there, we do grooming every week with story cards that gets bubbled to the next column Top of Backlog. Every two weeks, we do sprint planning and we move story cards from Top of Backlog into a Sprint marked Sprint nn (e.g. Sprint 64). When developers starts working on issues, they take the story cards from the Planning column and move them to the In-Progress column.  As they complete story cards, they create pull requests (PRs), and as they are reviewed, move the cards to the Review column. Once a PR is reviewed, the corresponding story card is marked Done &#8211; the last column.  That&#8217;s it!
</p>

<p dir="ltr">
  Here&#8217;s a re-cap:
</p>

<div dir="ltr">
  <table>
    <colgroup> <col width="153" /> <col width="471" /></colgroup> <tr>
      <td>
        <p dir="ltr">
          <strong>Waffle Column</strong>
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          <strong>Description</strong>
        </p>
      </td>
    </tr>
    
    <tr>
      <td>
        <p dir="ltr">
          Backlog
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          Everything that has been discussed and put on the backburner for prioritization from our roadmap
        </p>
      </td>
    </tr>
    
    <tr>
      <td>
        <p dir="ltr">
          Top of Backlog
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          Story cards that have been given the highest priority to be considered during sprint planning.
        </p>
      </td>
    </tr>
    
    <tr>
      <td>
        <p dir="ltr">
          Sprint nn
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          The current sprint cards that are prioritized but have not begun to be worked on.
        </p>
      </td>
    </tr>
    
    <tr>
      <td>
        <p dir="ltr">
          In-Progress
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          The current cards being worked on in the current sprint
        </p>
      </td>
    </tr>
    
    <tr>
      <td>
        <p dir="ltr">
          Review
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          Pull requests sent for peer-review before merging changes back onto our master branch
        </p>
      </td>
    </tr>
    
    <tr>
      <td>
        <p dir="ltr">
          Done
        </p>
      </td>
      
      <td>
        <p dir="ltr">
          Story cards that have been completed.
        </p>
      </td>
    </tr>
  </table>
</div>

<p dir="ltr">
  All community members can view all items on the Waffle board.  Community members can create new cards and edit cards they&#8217;ve created.  Feel free to upvote cards with &#8220;+1&#8221;. They are all put into the Backlog.  Maintainers with read/write access can update the cards and card status on the board itself.  In the coming weeks we&#8217;ll be standardizing our usage of GitHub tags across the LoopBack core repos. If you want to get started participating in the community and contributing to LoopBack remember we have the &#8220;Beginner Friendly&#8221; tag already in place 🙂
</p>

<p dir="ltr">
  What&#8217;s next?
</p>

<p dir="ltr">
  Install <a href="http://loopback.io/">LoopBack</a> and get started with designing APIs in Node!
</p>