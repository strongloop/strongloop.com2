---
layout: redirected
redirect_to: https://developer.ibm.com/apiconnect/2017/07/13/securing-api-oauth/
---
This blog post has been moved to IBM DeveloperWorks....
<!--more-->

---
APIs can be powerful tools for software developers. You can expose parts of your product to users and partners without having to directly build new functionality. If a third party wants to make an application that scans your database and returns specific results, they can use your API to access your system without pulling away your development resources.

APIs can also be scary security vulnerabilities. Parts of your product may be exposed to virtually anyone who knows your endpoint without your oversight or permission. If someone wants to query a billion hits into your database and take your system down, they can do so without even asking.

How can you take advantage of APIs’ usefulness without exposing yourself to major risk? One way is to manage API access through authorization and authentication. In this blog, we’ll be talking about securing your API with OAuth, the open-source authorization protocol.

<!--more-->

# What OAuth Can Do &#8230; and What It Can’t

Before we dive into how you can use OAuth to secure your API, it’s important to understand what OAuth can do and what its limitations are. [OAuth](https://oauth.net) is an open-source authorization protocol currently in Version 2.0. OAuth controls access—it lets _you_ decide who can access your API and only allows the people that you deem worthy into your API. OAuth sends the application a secure token, the application sends the secure token to the API, and then your authorized user is allowed entry.

However, OAuth is not an authentication protocol that determines a user’s identity. OAuth can provide the security token to any user it’s instructed to send a token to, but it can’t by itself determine if that user is someone you want to have the token. That’s your privilege (and responsibility).

What’s the difference between authorization and authentication?

  * **Authorization** determines if a user can be granted access.
  * **Authentication** determines if the user is who they say they are.

These two processes work together in much the same way as an ID badge and a passcard lock. The card says “This person is Joe Smith.” That’s authentication. The lock knows that “Joe Smith” is allowed to enter the door. That’s authorization.

Without authentication, it’s impossible to tell if a user deserves a security token. Without authorization, it’s difficult to tell if an authenticated user is allowed access. Only when the two work together can you limit API access to specific users.

As mentioned earlier, OAuth manages only authorization. Many sites use OAuth alongside authentication protocols such as [OpenID Connect](http://openid.net/connect/) or [Facebook Connect](https://developers.facebook.com/products/login) to provide authorization, but this can be unwieldy in an API where access is expected to be automated.

Instead, set up your security flow so that your API manages which users get tokens from OAuth. This puts the authentication functionality into the API, which facilitates automation while maintaining an authentication-like security gate. It won’t be as secure as using a true authentication protocol, but it offers more protection than having no authentication at all. Depending on your situation, you can configure in several ways.

# Determining Your Implementation Type: Confidential or Public?

Before you decide which security flow to use, you must determine if you can use a “client secret” to manage authentication. A client secret is a unique code for your API that is provided by OAuth. The application knows the client secret and your implementation of OAuth knows the client secret. When OAuth receives the client secret, it returns the access token and the user can access the API. The client secret is a second level of security to prevent a malicious user from creating an unauthorized application to access your API.

There are two main implementation types: confidential and public.

  * If your implementation is going to call a server to request the client secret, such as a web-based application or one that calls out to an authentication server, it’s likely a **confidential implementation.**

  * Remember that any application with the client secret, even a malicious one, can get an access token. If your implementation is going to live locally on a computer or mobile device, it can’t use a client secret to request the token because when the user installs the program, they would have access to the client secret and it would no longer be secure. If the application can’t protect the client secret, it’s probably a **public implementation.** 

Once you’ve identified your implementation type, you can choose your security scheme. Each scheme is appropriate for a number of uses—I can describe each scheme and how it works, but I can’t tell you which scheme to use for your particular use case. You’ll have to figure that part out for yourself!

# Confidential Schemes

Because these applications can manage a client secret securely, they tend to require less input from the user. Here are three authorization schemes that can be used in a confidential implementation.

## _Client Credentials Flow_

[<img class="aligncenter size-medium wp-image-28988" src="{{site.url}}/blog-assets/2017/03/appl-flow-300x186.png" alt="Client credentials flow" width="300" height="186"  />]({{site.url}}/blog-assets/2017/03/appl-flow.png)

In this scheme, the application manages all authorization between OAuth and the API. Any user accessing the application can access the API without authenticating: it’s presumed that if the user has access to the application, they are allowed to use the API.

The upside of this method is that it requires no input from the user. You can grant an unlimited number of users access to the application and they can interact with the API without a system administrator dealing with the headache of managing user names and passwords. The downside is that you have to maintain absolute security over the client secret. If a malicious user gets hold of the client secret, they can put it into any application and that application can run freely through your API.

Here’s how authorization flows in this scheme:

  1. The application passes the client secret to OAuth.
  2. OAuth verifies the client secret and passes the access token to the application.
  3. The application passes the access token to the API.
  4. The API passes data to the application.

## _Password Flow_

[<img class="aligncenter size-medium wp-image-28989" src="{{site.url}}/blog-assets/2017/03/passwordflow-300x192.png" alt="Password flow" width="300" height="192"  />]({{site.url}}/blog-assets/2017/03/passwordflow.png)

This scheme requires that the user provide a user name and password to the application. The application then sends the user name, password and client secret to OAuth.

The upside of this method is that it introduces another layer of security—only authorized users can request the token, so even if the client secret is known, there’s a backup in place. The downside is that there’s more work for the end user and your administrator. Someone must maintain a list of users who can access the application. Additionally, the process comes with less security for the end user; the application needs to know the user’s user name and password, which could be a security threat, especially if these credentials are used for other applications.

Please note that it’s still vital to maintain security over the client secret in this scheme. If a malicious user has the client secret along with a valid user name and password, they could access your API with an unauthorized application.

Here’s how authorization flows in this scheme:

  1. The user provides their user name and password to the application.
  2. The application provides the user name, password and client secret to OAuth.
  3. OAuth verifies the user name, password and client secret, and sends an access token to the application.
  4. The application passes the access token to the API.
  5. The API passes data to the application.

## _Authorization Code Flow_

[<img class="aligncenter size-medium wp-image-28990" src="{{site.url}}/blog-assets/2017/03/access-code-300x196.png" alt="Authorization Code Flow" width="300" height="196"  />]({{site.url}}/blog-assets/2017/03/access-code.png)

This scheme involves an authorization form sent by OAuth to the end user, configured with a set of acceptable user names and passwords. The user fills out the form with their login credentials. If the entered information matches the acceptable credentials, OAuth provides an authorization code, which is then passed to the application before the application begins the authorization process. This means that only your OAuth instance knows the user’s password and user name &#8211; not the application.

The upside of the authorization code flow method is that OAuth manages the user name and password for added security. Even if a malicious user had access to the client secret, they would still need to communicate to OAuth for an authorization code before trying to access the data. It’s significantly more secure than the other two schemes.

The downside is that this scheme requires the most input from the user and the most work from your team. You’ll need a gateway server to manage the authorization from OAuth, and the user must request the authorization code every time they sign in.

Here’s how authorization flows in this scheme:

  1. The application passes OAuth a client ID in conjunction with an attempted sign-on.
  2. OAuth requests the user’s login credentials through an authorization form on a gateway server.
  3. The user enters their information and sends the login credentials to OAuth.
  4. OAuth passes an authorization code to the user.
  5. The user provides the authorization code to the application.
  6. The application sends the authorization code and the client secret to OAuth.
  7. OAuth verifies the authorization code and client secret and passes an access token to the application.
  8. The application passes the access token to the API.
  9. The API sends the data to the application.

# Public Schemes

<p class="Normal1">
  These schemes are used in situations in which the application is stored locally on the user’s system. They don’t involve a client secret because the user would have access to the client secret … making it not very secret. Public schemes are less secure than confidential schemes since the client secret can’t be used as a second line against unauthorized use. If a malicious user gets access to a user name and password, they can access your API. Don’t use a public scheme unless circumstances force you to do so.
</p>

## _Implicit Flow_

[<img class="aligncenter size-medium wp-image-28991" src="{{site.url}}/blog-assets/2017/03/imp-flow-300x191.png" alt="Implicit Flow" width="300" height="191"  />]({{site.url}}/blog-assets/2017/03/imp-flow.png)

This scheme functions similarly to the authorization code flow above, with a key difference: the user manages a unique access token on their own. The user passes their login credentials to OAuth and receives an access token directly from OAuth.

The advantage to this scheme is that the users are able to authenticate themselves to OAuth without the application knowing their user names and passwords. The disadvantages are the same as with the authorization code flow: more work on the part of the user (requesting the authorization code at every login) and your team (administering a gateway server to manage the authorization from OAuth, among other tasks).

Here’s how authorization flows in this scheme:

  1. The application passes OAuth a client ID in conjunction with an attempted sign-on.
  2. OAuth requests the user’s login credentials through an authorization form on a gateway server.
  3. The user enters their information and sends the login credentials to OAuth.
  4. OAuth passes an access token to the user.
  5. The user provides the access token to the application.
  6. The application passes the access token to the API.
  7. The API sends the data to the application.

## _Password Flow_

[<img class="aligncenter size-medium wp-image-28992" src="{{site.url}}/blog-assets/2017/03/public-password-flow-300x197.png" alt="Password Flow" width="300" height="197"  />]({{site.url}}/blog-assets/2017/03/public-password-flow.png)

<p class="Normal1">
  This scheme functions almost identically to the confidential password flow, minus the client secret. The user provides a user name and password to the application, which is authenticated in OAuth from a prepopulated list of acceptable credentials. The pros and cons are the same as the confidential version of this flow—login credentials protect the system from malicious attacks, but the user is more vulnerable because the application knows the user name and password.
</p>

<p class="Normal1">
  Here’s how authorization flows in this scheme:
</p>

  1. The user provides a user name and password to the application.
  2. The application provides the user name and password to OAuth.
  3. OAuth verifies the user name and password and sends an access token to the application.
  4. The application passes the access token to the API.
  5. The API passes data to the application.

## _Authorization Code Flow_

[<img class="aligncenter size-medium wp-image-28993" src="{{site.url}}/blog-assets/2017/03/public-access-code-300x193.png" alt="Authorization Code Flow" width="300" height="193"  />]({{site.url}}/blog-assets/2017/03/public-access-code.png)

While this scheme may appear to function almost identically to the confidential authorization code flow, there’s a key difference: the access code is provided to the application, not to the user. This has the effect of creating a pseudo-client secret. The user doesn’t know the access code and thus cannot create a malicious application to access your API, making this the most secure of the public schemes.

But like the authorization code flow from the confidential scheme, this process requires the most input from the user and the most work from your team.

Here’s how authorization flows in this scheme:

  1. The application passes OAuth a client ID in conjunction with an attempted sign-on.
  2. OAuth requests the user’s login credentials through an authorization form on a gateway server.
  3. The user enters their information and sends the login credentials to OAuth.
  4. OAuth passes an authorization code to the application.
  5. The application sends the authorization code back to OAuth with the client ID.
  6. OAuth verifies the authorization code and passes an access token to the application.
  7. The application passes the access token to the API.
  8. The API sends the data to the application.

# Putting it All Together

<p class="Normal1">
  Once you’ve decided how you want to use OAuth to secure your API, you’ll need to configure your API to support the authorization scheme. The process varies depending on how you’re building your API. <a href="https://console.ng.bluemix.net/docs/services/apiconnect/index.html"><span style="color: #1155cc;">IBM API Connect</span></a> has native support for OAuth and can support any of the above schemes to create an authorization flow for your API with just a few clicks. The native support means you won’t have to do any complex coding to support the security flow. There’s a detailed <a href="https://www.ibm.com/support/knowledgecenter/en/SSFS6T/com.ibm.apic.toolkit.doc/tutorial_apionprem_security_OAuth.html"><span style="color: #1155cc;">tutorial</span></a> for building an OAuth 2.0 provider API using API Connect, too—just what you need to get started.
</p>
