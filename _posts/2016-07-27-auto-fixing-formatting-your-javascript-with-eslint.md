---
id: 27756
title: 'Auto-fixing &#038; Formatting Your JavaScript with ESLint'
date: 2016-07-27T08:30:34+00:00
author: Marc Harter
guid: https://strongloop.com/?p=27756
permalink: /strongblog/auto-fixing-formatting-your-javascript-with-eslint/
categories:
  - How-To
  - JavaScript Language
---
<p class="graf--p">
  <a class="markup--anchor markup--p-anchor" href="https://en.wikipedia.org/wiki/Lint_%28software%29">Linting</a> is the process of running a program that will analyze your code for potential errors. A lint program does this by using a set of rules applied to your code to determine if any violations have occurred.<!--more-->
</p>

<p class="graf--p">
  When it comes to analyzing JavaScript program errors, <a class="markup--anchor markup--p-anchor" href="http://eslint.org">ESLint</a> is the best linting tool available today. Not only does it include a large set of rules for potential errors and style violations. It is also pluggable which enables anyone to write their own rules and custom configurations.
</p>

<p class="graf--p">
  However, my favorite feature is the <a class="markup--anchor markup--p-anchor" href="http://eslint.org/docs/user-guide/command-line-interface">ability to auto-fix</a> using the <code>--fix</code> flag. Integrating auto-fix provides constant feedback by cleaning up mistakes and keeping code clean <em class="markup--em markup--p-em">before</em> you check it in to a repository. If you are involved in an open source project, it also saves time by ensuring that the code you contribute doesn&#8217;t require clean up or other work from other contributors.
</p>

<p class="graf--p">
  I like to do this cleanup by saving a file in my editor as it provides a quick feedback loop and persists the fixed changes to disk. In this article, I am going to show you how to do that for a few popular editors. Here is the endgame:
</p>

<p class="graf--p">
  <a href="{{site.url}}/blog-assets/2016/07/autofix.gif"><img class="aligncenter size-full wp-image-27757" src="{{site.url}}/blog-assets/2016/07/autofix.gif" alt="autofix" width="1252" height="726" /></a>
</p>

#### Installing ESLint 

<p class="graf--p">
  You an install ESLint locally for a given project or globally for all projects on a system. We will focus on using a <em class="markup--em markup--p-em">global</em> ESLint for this tutorial, but note that many of these plugins support a local install as well.
</p>

<p class="graf--p">
  First, install ESLint globally:
</p>

```
npm install -g eslint
```

#### Vim/Neovim 

<p class="graf--p">
  For Vim users, just add the <a class="markup--anchor markup--p-anchor" href="https://github.com/ruanyl/vim-fixmyjs">fixmyjs package</a> using your preferred packaging tool like <a class="markup--anchor markup--p-anchor" href="https://github.com/junegunn/vi…">vim-plug</a> or <a class="markup--anchor markup--p-anchor" href="https://github.com/VundleVim/Vundle.vim">Vundle</a>:
</p>

```
" Plug
Plug ruanyl/vim-fixmyjs
" Vundle
Plugin ruanyl/vim-fixmyjs
```
<p class="graf--p">
  Then, to format on save, just add the following to your <strong class="markup--strong markup--p-strong">.vimrc</strong>:
</p>

```
au BufWritePre *.js :Fixmyjs
au BufWritePre *.jsx :Fixmyjs
```
#### Sublime Text 

<p class="graf--p">
  For Sublime, using <a class="markup--anchor markup--p-anchor" href="https://packagecontrol.io/">Package Control</a>, install the <a class="markup--anchor markup--p-anchor" title="https://github.com/TheSavior/ESLint-Formatter" href="https://github.com/TheSavior/ESLint-Formatter">ESLint-Formatter</a> package. Then, to format on save, add the following to the <em class="markup--em markup--p-em">Preferences -> Package Settings -> ESLint-Formatter -> Settings  —  User</em> file:
</p>

```
{
  "format_on_save": true
}
```
#### Atom 

<p class="graf--p">
  For Atom, install the <a class="markup--anchor markup--p-anchor" title="https://github.com/AtomLinter/linter-eslint" href="https://github.com/AtomLinter/linter-eslint">linter-eslint</a> package. Then, configure it like this:
</p>

<p class="graf--p">
  <a href="{{site.url}}/blog-assets/2016/07/atomcfg.png"><img class="aligncenter size-full wp-image-27758" src="{{site.url}}/blog-assets/2016/07/atomcfg.png" alt="atomcfg" width="1062" height="366"  /></a>
</p>

<blockquote class="graf--blockquote">
  <p>
    Note that this assumes your global Node installation is at <em class="markup--em markup--blockquote-em">/usr/local</em> which is typical, but not always the case. Run <strong class="markup--strong markup--blockquote-strong">npm get prefix</strong> and paste that value into this field if ESLint cannot be found.
  </p>
</blockquote>

#### Other editors 

<p class="graf--p">
  If your editor is not represented above, there may be a plugin or a way to use the <a class="markup--anchor markup--p-anchor" href="http://eslint.org/docs/user-guide/command-line-interface"><strong class="markup--strong markup--p-strong">eslint</strong> command</a> directly to achieve a similar effect.
</p>

<p class="graf--p">
  For example, the vim plugin will run the following:
</p>

```
eslint -c <path-to-config> --fix <path-to-current-file>
```
<p class="graf--p">
  Then, reload the file in the buffer.
</p>

<p class="graf--p">
  Happy auto-formatting!
</p>
