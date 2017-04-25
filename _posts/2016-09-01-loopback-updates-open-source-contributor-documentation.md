---
id: 27839
title: Coding Guidelines for LoopBack Are Here!
date: 2016-09-01T07:17:27+00:00
author: Simon Ho
guid: https://strongloop.com/?p=27839
permalink: /strongblog/loopback-updates-open-source-contributor-documentation/
categories:
  - Community
  - LoopBack
---
To make it easier to contribute to the LoopBack project, we‘ve centralized and opened up the general coding guidelines we’ve been using internally at loopback-contributor-docs. We hope this will help clear up any ambiguity about what we expect and improve turnaround times for landing pull requests from community members.
  
<!--more-->


  
**TL;DR**

  * New repository <a class="link" href="https://github.com/strongloop/loopback-contributor-docs" target="_blank">loopback-contributor-docs</a> for open -source contributor information
  * ESLint integration
  * Functional area owners
  * Style guide
  * Git commit message guidelines
  * More public visibility into continuous integration (CI) results
  * Upstream/downstream CI test results

**ESLint integration**

Code linting is a common practice to help catch common issues ahead of time. ESLint is a popular JavaScript linter which comes with its own set of default rules. We&#8217;ve integrated <a href="http://eslint.org/" target="_blank">ESLint</a> into all LoopBack projects and normalized our preferred coding styles in our own ESLint configuration available at the <a href="https://github.com/strongloop/eslint-config-loopback" target="_blank">eslint-config-loopback</a> repository. In general, we typically follow best practices for general JavaScript code, such as <a href="https://github.com/strongloop/eslint-config-loopback/blob/master/eslint.json#L47" target="_blank">turning on strict mode</a>. Stylistic issues like <a href="https://github.com/strongloop/eslint-config-loopback/blob/master/eslint.json#L21" target="_blank">two space indenting</a> are also chosen based on what is common in the Node.js community. For the full list of rules, see <a target="_blank">https://github.com/strongloop/eslint-config-loopback/blob/master/eslint.json</a>.

**Functional area owners**

LoopBack has been growing! This is great news, but it means that there are now so many projects it is becoming too much for everyone on the team to maintain every GitHub repository separately. To address this, the team has decided to split responsibilities into &#8220;Functional areas&#8221; and assign owners to each area for better focus and attention to domain expertise. These are the project maintainers that will be helping you out with issues across the various LoopBack projects on GitHub.

**Style guide**

For coding preferences that cannot be caught by ESLint we have  <a href="https://github.com/strongloop/loopback-contributor-docs/blob/master/style-guide.md" target="_blank">a new style guide</a> for edge case scenarios. You can treat this as a living document as styles and updates will change over time, but the basic styles will generally stay the same. Typical cases  <a href="https://github.com/strongloop/loopback-contributor-docs/blob/master/style-guide.md#general" target="_blank">such as lines that are too long to fit on one line</a> or  <a href="https://github.com/strongloop/loopback-contributor-docs/blob/master/style-guide.md#indentation-of-multi-line-expressions-in-return" target="_blank">how to indent multi-line expressions</a>. Please note you will see many inconsistencies at this point time, but feel free to submit a PR with a fix if you notice any source code differing from the conventions outlined.

**Git commit messages guidelines**
  
For consistency between all contributors from the community and the LoopBack team, we now have <a href="https://github.com/strongloop/loopback-contributor-docs/blob/master/git-commit-messages.md" target="_blank">a guideline for Git commit messages</a>. While this sounds basic to Git veterans, you will be surprised how often this comes up. In general, we follow the same rules outlined by <a href="https://twitter.com/tpope" target="_blank">@Tim Pope</a>:

  * Capitalized, short (50 chars or less) summary for the commit message.
  * More detailed explanatory text, if necessary.  Wrapped to 72 characters.
  * Write in the imperative tone.

For detailed explanations, see <a href="https://github.com/strongloop/loopback-contributor-docs/blob/master/git-commit-messages.md" target="_blank" rel="noreferrer nofollow" data-attrib-id="MTQ3MTY1MTk3OTczNS1odHRwczovL2dpdGh1Yi5jb20vc3Ryb25nbG9vcC9sb29wYmFjay1jb250cmlidXRvci1kb2NzL2Jsb2IvbWFzdGVyL2dpdC1jb21taXQtbWVzc2FnZXMubWQ=">https://github.com/strongloop/loopback-contributor-docs/blob/master/git-commit-messages.md</a>.

**More public visibility into continuous integration (CI) test results**

In the past, contributors had minimal insight into what was happening with our CI results when submitting pull requests. We&#8217;ve managed to rework some of the system to show results for commit and pull request linting (not code linting and tests). More specifically, this means our CI system checks whether the branch is up to date and whether the commit messages are properly formatted. For these types of errors, you can now fix them and update the PRs without having to ask maintainers why.

**Upstream/downstream CI test results**

Additional changes to the CI system to help turnaround times for reviews include the addition of the upstream/downstream testing. This feature is basically a psychic version of <a href="https://greenkeeper.io/" target="_blank" rel="noreferrer nofollow" data-attrib-id="MTQ3MTU1MDgzMzc5MC1odHRwczovL2dyZWVua2VlcGVyLmlvLw==">greenkeeper</a>; instead of detecting new versions of your dependencies and testing if they break anything, we test them before they get released. Since downstream testing is done on every pull request, you can expect some CI jobs to take longer to complete than others. Ultimately, this will lead to reduced upstream/downstream breakages for all LoopBack projects in general.

**What&#8217;s next?**

Now that you know how to contribute, please feel free to submit pull requests and continue doing the great work you&#8217;ve all been doing to help make LoopBack such a great community.