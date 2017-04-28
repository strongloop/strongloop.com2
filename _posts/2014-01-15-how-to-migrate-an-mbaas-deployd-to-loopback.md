---
id: 13170
title: 'How to Migrate an mBaaS: Deployd to LoopBack'
date: 2014-01-15T09:43:15+00:00
author: Ritchie Martori
guid: http://strongloop.com/?p=13170
permalink: /strongblog/how-to-migrate-an-mbaas-deployd-to-loopback/
categories:
  - Community
  - How-To
  - LoopBack
  - Mobile
---
<h2 dir="ltr">
  <strong>Background</strong>
</h2>

<p dir="ltr">
  <a href="http://strongloop.com/mobile-application-development/loopback/">LoopBack</a> and <a href="https://github.com/deployd/deployd">Deployd</a> are both flavors of the “<a href="http://nobackend.org/">noBackend</a>” and “mBaaS” trends. Frameworks and tooling specifically designed to simplify backend development, allowing you to focus on building great web and mobile user experiences. For a brief history lesson on LoopBack, Deployd, and backend services in general, take a look at my previous post: <a href="http://strongloop.com/strongblog/a-brief-history-of-mobile-backend-as-a-service-mbaas/">“A Brief history of mBaaS”</a>.
</p>

<p dir="ltr">
  This post is designed to walk you through building a mobile or web backend. We’ll start by quickly prototyping our API in Deployd and MongoDB then migrate our data and our entire backend to LoopBack to run against our production MySQL database.
</p>

<p dir="ltr">
  <em>Note: If you are starting with an existing Deployd application, skip to Porting to LoopBack.</em>
</p>

<h2 dir="ltr">
  <strong>Installing LoopBack and Deployd</strong>
</h2>

<p dir="ltr">
  Before running the examples below, make sure you have these dependencies installed
</p>

<li style="margin-left:2em;">
  <span style="font-size: 18px;">node v0.10.x</li> 
  
  <li style="margin-left:2em;">
    <span style="font-size: 18px;">mongodb</li> 
    
    <li style="margin-left:2em;">
      <span style="font-size: 18px;">mysql (optional)</li> </ul> 
      
      <p dir="ltr">
        Install both <strong>deployd</strong> and <strong>LoopBack</strong> by running the command below:
      </p>
      
      <p>
      </p>
      
      <blockquote>
        <p>
          npm install -g strong-cli deployd
        </p>
      </blockquote>
      
      <p>
      </p>
      
      <p dir="ltr">
        You can verify they are installed with the following commands.
      </p>
      
      <p>
      </p>
      
      <blockquote>
        <p>
          dpd -V # deployd version<br /> slc version # strong-cli / loopback version
        </p>
      </blockquote>
      
      <p>
      </p>
      
      <h2 dir="ltr">
        <strong>The Prototype</strong>
      </h2>
      
      <p>
      </p>
      
      <p dir="ltr">
        Create a prototype app with the <strong>dpd create</strong> command.
      </p>
      
      <p dir="ltr">
        <p>
        </p>
        
        <blockquote>
          <p>
            dpd create dpd-inventory
          </p>
        </blockquote>
        
        <p>
        </p>
        
        <p dir="ltr">
          <p dir="ltr">
            Then start up the dashboard.
          </p>
          
          <p dir="ltr">
            <p>
            </p>
            
            <blockquote>
              <p>
                cd dpd-inventory<br /> dpd -d
              </p>
            </blockquote>
            
            <p>
            </p>
            
            <p dir="ltr">
              <p dir="ltr">
                Create a new collection and enter <strong>“/products”</strong>. Give it two properties <strong>“name”</strong> (string) and <strong>“price”</strong> (number).
              </p>
              
              <p>
                <img alt="" src="https://lh6.googleusercontent.com/C6WwPdONG4-l9IbRcF6XjT_6WJ9qiAUWYcE4FJMQDNiosP9zpoh_DwD-s3tgeyLoNmoSlR58fwaBTZNhXJOL8owGyRkZKPY7mnieGYb3seVpXJWddq2pjBc60g" width="624px;" height="341px;" />
              </p>
              
              <p dir="ltr">
                Click on the <strong>“data”</strong> tab (on the left) and enter some test products. You should be able see your products by hitting “<a href="http://localhost:2403/products">http://localhost:2403/products</a>”.
              </p>
              
              <p dir="ltr">
                Create a user collection and leave the default route <strong>“/users”</strong>. Add an additional property <strong>“isAdmin”</strong> (boolean). Create two users for testing using the data editor. One user should have “isAdmin” set to true and the other false.
              </p>
              
              <p dir="ltr">
                In order to ensure only admins can edit products, create a “on validate” event in the products collection. Below is a simple check to see if the requesting user is logged in as an admin.
              </p>
              
              <p>
              </p>
              
              ```js
var allowed = me && me.isAdmin;
if(!allowed) cancel('You are not allowed...');
```js
              
              <p>
              </p>
              
              <p dir="ltr">
                Confirm the event is working with a simple <strong>PUT</strong> to the products collection.
              </p>
              
              <p>
              </p>
              
              <blockquote>
                <p>
                  curl -X PUT -H &#8220;Content-Type:application/json&#8221; \<br /> -d &#8216;{&#8220;name&#8221;: &#8220;foobar&#8221;}&#8217; \<br /> http://localhost:2403/products/a2f6072319577879
                </p>
              </blockquote>
              
              <p>
              </p>
              
              <p dir="ltr">
                <p dir="ltr">
                  The above request should respond with.
                </p>
                
                <p dir="ltr">
                  <p>
                  </p>
                  
                  <blockquote>
                    <p>
                      {&#8220;message&#8221;:&#8221;You are not allowed&#8230;&#8221;,&#8221;status&#8221;:400}
                    </p>
                  </blockquote>
                  
                  <p>
                  </p>
                  
                  <h2 dir="ltr">
                  </h2>
                  
                  <h2 dir="ltr">
                    <strong>Porting to LoopBack</strong>
                  </h2>
                  
                  <p dir="ltr">
                    The basic process for porting a deployd app to LoopBack can be split into 6 major steps.
                  </p>
                  
                  <ol>
                    <li>
                      <span style="font-size: 18px;">Create a LoopBack project </li> 
                      
                      <li>
                        <span style="font-size: 18px;">Convert deployd Collections to LoopBack models </li> 
                        
                        <li>
                          <span style="font-size: 18px;">Convert deployd Query Syntax to LoopBack’s syntax< </li> 
                          
                          <li>
                            <span style="font-size: 18px;">Port the deployd User Collection to LoopBack’s User API </li> 
                            
                            <li>
                              <span style="font-size: 18px;">Port deployd events to LoopBack hooks </li> 
                              
                              <li>
                                <span style="font-size: 18px;">Migrate data from our MongoDB (if required) </li> </ol> 
                                
                                <h2 dir="ltr">
                                  <strong>Creating our LoopBack project</strong>
                                </h2>
                                
                                <p dir="ltr">
                                  Create the LoopBack project with the following command.
                                </p>
                                
                                <p dir="ltr">
                                  <p>
                                  </p>
                                  
                                  <blockquote>
                                    <p>
                                      slc lb project lb-inventory<br /> cd lb-inventory
                                    </p>
                                  </blockquote>
                                  
                                  <p>
                                  </p>
                                  
                                  <p dir="ltr">
                                    <p dir="ltr">
                                      Now we can run our app with node.
                                    </p>
                                    
                                    <p dir="ltr">
                                      <p>
                                      </p>
                                      
                                      <blockquote>
                                        <p>
                                          node app
                                        </p>
                                      </blockquote>
                                      
                                      <p>
                                      </p>
                                      
                                      <h2 dir="ltr">
                                      </h2>
                                      
                                      <h2 dir="ltr">
                                        <strong>Collections to Models</strong>
                                      </h2>
                                      
                                      <p dir="ltr">
                                        First we convert our prototype’s collections to LoopBack model definitions. Below is part of the deployd configuration we are basing our LoopBack configuration on. It is located in <strong>“dpd-inventory/resources/products/config.json”</strong> and declares our deployd products collection.
                                      </p>
                                      
                                      ```

{
	"type": "Collection",
	"properties": {
		"name": {
			"name": "name",
			"type": "string",
			"typeLabel": "string",
			"required": false,
			"id": "name",
			"order": 0
		},
		"price": {
			"name": "price",
			"type": "number",
			"typeLabel": "number",
			"required": false,
			"id": "price",
			"order": 1
		}
	}
}

```js
                                      
                                      <p dir="ltr">
                                        Whereas deployd uses the <strong>“dpd”</strong> tool for creating projects, LoopBack uses the <strong>“slc”</strong> tool to scaffold Models as well as the project itself. The following command will create an empty LoopBack model that we can add our properties to.
                                      </p>
                                      
                                      <p dir="ltr">
                                        <p>
                                        </p>
                                        
                                        <p dir="ltr">
                                          <em>Note: LoopBack expects the singular form of the deployd collection name.</em>
                                        </p>
                                        
                                        <blockquote>
                                          <p>
                                            slc lb model product
                                          </p>
                                        </blockquote>
                                        
                                        <p>
                                        </p>
                                        
                                        <p dir="ltr">
                                          <p dir="ltr">
                                            We can copy the entire <strong>“properties”</strong> configuration from our deployd product collection <strong>(“dpd-invetory/resources/products/config.json”)</strong> and remove the following incompatible properties.
                                          </p>
                                          
                                          <ul>
                                            <li style="margin-left:2em;">
                                              <span style="font-size: 18px;">typeLabel </li> 
                                              
                                              <li style="margin-left:2em;">
                                                <span style="font-size: 18px;">id </li> 
                                                
                                                <li style="margin-left:2em;">
                                                  <span style="font-size: 18px;">order </li> </ul> 
                                                  
                                                  <p dir="ltr">
                                                    We should end up with a model definition that looks like this:
                                                  </p>
                                                  
                                                  <p dir="ltr">
                                                    <p>
                                                    </p>
                                                    
                                                    ```js
"product": {
 "properties": {
   "name": {
     "name": "name",
     "type": "string",
     "required": false,
   },
   "price": {
     "name": "price",
     "type": "number",
     "required": false
   }
 },
 "public": true,
 "dataSource": "db"
}
```js
                                                    
                                                    <p>
                                                    </p>
                                                    
                                                    <p dir="ltr">
                                                      <p dir="ltr">
                                                        Now we can create <strong>“products”</strong> using the LoopBack REST API.
                                                      </p>
                                                      
                                                      <p dir="ltr">
                                                        <p>
                                                        </p>
                                                        
                                                        <blockquote>
                                                          <p>
                                                            curl -X PUT -H &#8220;Content-Type:application/json&#8221; \<br /> -d &#8216;{&#8220;name&#8221;: &#8220;pencil&#8221;, &#8220;price&#8221;: 0.99}&#8217; \<br /> http://localhost:3000/products
                                                          </p>
                                                        </blockquote>
                                                        
                                                        <p>
                                                        </p>
                                                        
                                                        <h2 dir="ltr">
                                                          <strong>Query Syntax</strong>
                                                        </h2>
                                                        
                                                        <p dir="ltr">
                                                          Now we need to convert deployd query syntax to LoopBack’s syntax. This should be fairly simple using the <strong>qs</strong> node module / component. It works in both node and the browser.
                                                        </p>
                                                        
                                                        <p dir="ltr">
                                                          Here is a request using super agent using the deployd query syntax.
                                                        </p>
                                                        
                                                        <p dir="ltr">
                                                          <p>
                                                          </p>
                                                          
                                                          ```js
require('superagent')
 .get('http://localhost:2403/products?{"price": {"$gt": 2}}')
 .set('Content-Type', 'application/json')
 .end(function(err, res) {
   console.log(res.body);
   // => [ { name: 'pen', price: 2.99, id: '74b1049dd990a83b' } ]
 });
```js
                                                          
                                                          <p>
                                                          </p>
                                                          
                                                          <p dir="ltr">
                                                            The same request in LoopBack would can be made by passing the query object to the <strong>qs</strong> module.
                                                          </p>
                                                          
                                                          <p dir="ltr">
                                                            <p>
                                                            </p>
                                                            
                                                            ```js
var qs = require('qs');
var query = {
 where: {
   price: {gt: 2}
 }
};
require('superagent')
 .get('http://localhost:3000/api/products?' + qs.stringify(query))
 .set('Content-Type', 'application/json')
 .end(function(err, res) {
   console.log(res.body);
   // => [ { name: 'pen', price: 2.99, id: '74b1049dd990a83b' } ]
 });
```js
                                                            
                                                            <p>
                                                            </p>
                                                            
                                                            <p dir="ltr">
                                                              Keep these subtle differences in mind:
                                                            </p>
                                                            
                                                            <ul>
                                                              <li style="margin-left:2em;">
                                                                <span style="font-size: 18px;">LoopBack models are mounted at <strong>/api/:pluralName</strong> </li> 
                                                                
                                                                <li style="margin-left:2em;">
                                                                  <span style="font-size: 18px;">deployd prefixes special query commands with <strong>$</strong> where LoopBack does not </li> 
                                                                  
                                                                  <li style="margin-left:2em;">
                                                                    <span style="font-size: 18px;">LoopBack takes a filter object of <strong>“where”</strong>, <strong>“limit”</strong>, <strong>“skip”</strong>, etc where deployd merges these into a single object </li> </ul> 
                                                                    
                                                                    <p>
                                                                    </p>
                                                                    
                                                                    <h2 dir="ltr">
                                                                      <strong>Users and Access Control</strong>
                                                                    </h2>
                                                                    
                                                                    <p dir="ltr">
                                                                      Porting your deployd User Collection to LoopBack’s User API is fairly simple. LoopBack apps come with a User model. The login, logout, and registration process are almost identical. Below are the key differences to resolve.
                                                                    </p>
                                                                    
                                                                    <ul>
                                                                      <li style="margin-left:2em;">
                                                                        <span style="font-size: 18px;">As of v1.4.1, LoopBack does not have a `/users/me` route</p> </li> 
                                                                        
                                                                        <li style="margin-left:2em;">
                                                                          <span style="font-size: 18px;">Requests must include a valid AccessToken instead of a session cookie </li> </ul> 
                                                                          
                                                                          <p dir="ltr">
                                                                            LoopBack also supports role based authentication. Depending on your application, you might need to rework how roles are stored.
                                                                          </p>
                                                                          
                                                                          <h2 dir="ltr">
                                                                            <strong>Events to Hooks</strong>
                                                                          </h2>
                                                                          
                                                                          <p dir="ltr">
                                                                            In our prototype example above, we created a deployd <strong>“on validate”</strong> hook to restrict edit access to admin users. Porting this to LoopBack can be done in several ways.
                                                                          </p>
                                                                          
                                                                          <p dir="ltr">
                                                                            The simplest way is to define an <strong>access control list</strong>. Below is an example that will add an access control prevent anyone from modifying products.
                                                                          </p>
                                                                          
                                                                          <p dir="ltr">
                                                                            <p>
                                                                            </p>
                                                                            
                                                                            <blockquote>
                                                                              <p>
                                                                                slc lb acl &#8211;model product &#8211;deny &#8211;write &#8211;unauthenticated
                                                                              </p>
                                                                            </blockquote>
                                                                            
                                                                            <p>
                                                                            </p>
                                                                            
                                                                            <p dir="ltr">
                                                                              <p dir="ltr">
                                                                                Alternatively we can use LoopBack’s hooks to write custom logic. The following example will prevent unauthenticated users from calling the following methods.
                                                                              </p>
                                                                              
                                                                              <p dir="ltr">
                                                                                <p>
                                                                                </p>
                                                                                
                                                                                ```js
// in lb-inventory/models/products.js
var product = require('../app').models.product;
product.beforeRemote('**', function(ctx, inst, next) {
 var token = ctx.req.accessToken;
 var isUser = token && token.userId;
 var allowed = ctx.req.method === 'GET' || isUser;
 var notAllowed = new Error('not allowed');
 notAllowed.statusCode = 401;
 if(!allowed) return next(notAllowed);
 next();
});
```js
                                                                                
                                                                                <p>
                                                                                </p>
                                                                                
                                                                                <h2 dir="ltr">
                                                                                  <strong>Migrating Data</strong>
                                                                                </h2>
                                                                                
                                                                                <p dir="ltr">
                                                                                  If your prototype application contains valuable data you have several options. The simplest option is to just keep using the MongoDB backing deployd. Below are several other options for migrating away from MongoDB using LoopBack.
                                                                                </p>
                                                                                
                                                                                <h2 dir="ltr">
                                                                                  <strong>mongoexport</strong>
                                                                                </h2>
                                                                                
                                                                                <p dir="ltr">
                                                                                  This tool allows you to export your mongo collections as JSON / CSV / and other formats. If the database you are targeting allows you to import these formats, it should be fairly straightforward.
                                                                                </p>
                                                                                
                                                                                <h2 dir="ltr">
                                                                                  <strong>Using LoopBack</strong>
                                                                                </h2>
                                                                                
                                                                                <p dir="ltr">
                                                                                  LoopBack’s API makes it pretty straightforward to read a collection of JSON objects from a MongoDB collection. If you followed the steps above &#8211; you should have a set of models that correspond to deployd’s collections. Just point your LoopBack data source at your local MongoDB and run a script that finds all records and inserts them into a data source pointing to another database.
                                                                                </p>
                                                                                
                                                                                <h2 dir="ltr">
                                                                                  <strong>Recap</strong>
                                                                                </h2>
                                                                                
                                                                                <p dir="ltr">
                                                                                  Following the guide above, porting an application from deployd to LoopBack should be straightforward:
                                                                                </p>
                                                                                
                                                                                <ul>
                                                                                  <li style="margin-left:2em;">
                                                                                    <span style="font-size: 18px;">Since deployd collections and LoopBack models share a similar configuration format, so converting between the two shouldn’t take too much effort. </li> 
                                                                                    
                                                                                    <li style="margin-left:2em;">
                                                                                      <span style="font-size: 18px;">It’s a bit trickier to convert the Deployd query string syntax to LoopBack’s, but using the <strong>“qs”</strong> node module should make that easier. </li> 
                                                                                      
                                                                                      <li style="margin-left:2em;">
                                                                                        <span style="font-size: 18px;">Porting logic in events and resolving the differences in access control is probably the trickiest part of the migration, but &#8230; </li> </ul> 
                                                                                        
                                                                                        <p dir="ltr">
                                                                                          If you have any questions, leave a comment, open a github issue, or ping us at callback @ strongloop dot com.
                                                                                        </p>
                                                                                        
                                                                                        <h2 dir="ltr">
                                                                                          <strong>Next Steps</strong>
                                                                                        </h2>
                                                                                        
                                                                                        <ul>
                                                                                          <li style="margin-left:2em;">
                                                                                            <span style="font-size: 18px;">Get LoopBack <a href="http://strongloop.com/get-started/">installed via npm</a></li> 
                                                                                            
                                                                                            <li style="margin-left:2em;">
                                                                                              <span style="font-size: 18px;">Check out the </span><a href="http://docs.strongloop.com/display/DOC/LoopBack">LoopBack Documentation</a>
                                                                                            </li>
                                                                                            <li style="margin-left:2em;">
                                                                                              <span style="font-size: 18px;">Browse the </span><a href="http://apidocs.strongloop.com/loopback/">LoopBack API Documentation</a>
                                                                                            </li>
                                                                                            <li style="margin-left:2em;">
                                                                                              <span style="font-size: 18px;">Read the </span><a href="http://docs.deployd.com">deployd Documentation</a>
                                                                                            </li></ul> 
                                                                                            
                                                                                            <p>
                                                                                            </p>