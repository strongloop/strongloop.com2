---
id: 14843
title: 'How-to Build CRUD Enabled iOS Apps with the LoopBack API Server &#8211; Part 1'
date: 2014-03-25T12:48:39+00:00
author: Chandrika Gole
guid: http://strongloop.com/?p=14843
permalink: /strongblog/how-to-crud-ios-nodejs-loopback-api-server-part-1/
categories:
  - Community
  - How-To
  - LoopBack
---
In this two-part tutorial we&#8217;ll be creating an iOS app that connects to a <a href="http://strongloop.com/mobile-application-development/loopback/" data-linked-resource-id="589861" data-linked-resource-type="page" data-linked-resource-default-alias="LoopBack" data-base-url="http://docs.strongloop.com">LoopBack</a> API server to perform create, read, update, and delete (CRUD) operations. In Part One we&#8217;ll show you how to fetch data stored in an in-memory data source. <a href="http://strongloop.com/strongblog/how-to-crud-ios-nodejs-loopback-api-server-part-2/" data-linked-resource-id="2294171" data-linked-resource-type="blogpost" data-linked-resource-default-alias="Build a simple LoopBack iOS app, part two" data-base-url="http://docs.strongloop.com">Part Two</a> will explain how to connect various interface elements to the iOS app.

## **Prerequisites**

Before starting this tutorial:

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Install <a href="https://developer.apple.com/xcode/">Apple XCode version 5 or later.</a></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Follow the <a href="http://docs.strongloop.com/display/DOC/Getting+started">Getting Started</a> instructions to install the StrongLoop command-line tool, slc.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Download and unzip the <a href="http://strongloop.com/mobile/ios/">LoopBack iOS SDK</a></span>
</li>

## <!--more-->

## **Create the LoopBack &#8220;Books&#8221; application**

Follow these steps to create a simple LoopBack Node application using the StrongLoop command-line tool, slc:

**Step 1:** Create a new application called &#8220;books&#8221;

<table data-macro-name="code" data-macro-body-type="PLAIN_TEXT">
  <tr>
    <td>
      ```js
$ slc lb project books
```js
    </td>
  </tr>
</table>

**Step 2:** Follow the instructions in <a href="http://docs.strongloop.com/display/DOC/Creating+a+LoopBack+application" data-linked-resource-id="1541039" data-linked-resource-type="page" data-linked-resource-default-alias="Creating a LoopBack application" data-base-url="http://docs.strongloop.com">Create a LoopBack application</a> to create a model called &#8220;book&#8221; with the default properties. Follow the instructions in the link to the section &#8220;Defining a model manually&#8221;.

**Step 3:** Run the app and load this URL in your browser to view the API explorer: <a href="http://0.0.0.0:3000/explorer" rel="nofollow">http://localhost:3000/explorer</a>.

**Step 4:** Add a few books to the app by running a POST request through the API Explorer. The format of JSON for the POST request is as follows:

<table data-macro-name="code" data-macro-body-type="PLAIN_TEXT">
  <tr>
    <td>
      ```js
{"title" : "The Godfather", 
"author" : "Mario Puzo", 
"genre" : "Fiction", 
"totalPages" : "1000", 
"description" : "Classic novel of La Cosa Nostra"}
```js
    </td>
  </tr>
</table>

## **Create the iOS app**

Follow these steps to create an iOS single view application:

**Step 1:**  In Xcode, choose **File > New > Project > IOS Application > Single View Application**.

**Step 2:** Name the project &#8220;Books&#8221; (or choose another name if you prefer).  The instructions below assume the project is named &#8220;Books;&#8221; if you use a different name, then some files will be named different accordingly.

**Step 3:** Select **iPhone** as Device. Select location and create project.  At this point, you should have a project created in Xcode with a bunch of default files.

**Step 4:** Add Loopback to your application:

From the LoopBack iOS SDK, drag `Loopback.Framework` to the Frameworks directory in your application.

[<img class="alignnone size-medium wp-image-19114" alt="AddLoopback" src="https://strongloop.com/wp-content/uploads/2014/03/AddLoopback-300x188.png" width="300" height="188" />](https://strongloop.com/wp-content/uploads/2014/03/AddLoopback.png)

Import the Loopback framework into your app. Edit `booksAppDelegate.h` and add lines 2 and 7 as shown below:

<table data-macro-name="code" data-macro-parameters="linenumbers=true|title=booksAppDelegate.h" data-macro-body-type="PLAIN_TEXT">
  <tr>
    <td>
      ```js
#import 
#import 

@interface booksAppDelegate : UIResponder 

@property (strong, nonatomic) UIWindow *window;
+ ( LBRESTAdapter *) adapter;
@end
```js
    </td>
  </tr>
</table>

Edit` booksAppDelegate.m` to add the code in lines 3 through 11 as shown below:

<table data-macro-name="code" data-macro-parameters="linenumbers=true|title=booksAppDelegate.m" data-macro-body-type="PLAIN_TEXT">
  <tr>
    <td>
      ```js
#import "booksAppDelegate.h"
@implementation booksAppDelegate
static LBRESTAdapter * _adapter = nil;
+ (LBRESTAdapter *) adapter
{
    if ( !_adapter)
        _adapter = [LBRESTAdapter adapterWithURL:[NSURL URLWithString:@"http://localhost:3000/api/"]];
    return _adapter;
}
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
...
```js
    </td>
  </tr>
</table>

**Create the first screen for the application. **Click on **Main.storyboard** in the File Navigator to see an empty View Controller. Name this View Controller &#8220;Books Collection&#8221; by double clicking on it or adding a name in the **Title** field, shown highlighted in the following figure:

[<img class="alignnone size-medium wp-image-19115" alt="SNP-1" src="https://strongloop.com/wp-content/uploads/2014/03/SNP-1-300x180.png" width="300" height="180" />](https://strongloop.com/wp-content/uploads/2014/03/SNP-1.png)

**Design the Books Collection Screen. **Click on the box icon to list the Object Library items and drag a **Button** from the selection panel to the View Controller, near the bottom and centered horizontally. Change the **Title** field of the button from &#8220;Button&#8221; to &#8220;Refresh.&#8221;

Select and drag a **Table View** to the View Controller. Add a **Table View Cell** to the Table View.  Click on the Table View Cell and enter &#8220;BookCell&#8221; as the **Identifier**. You will use this later. The View Controller should look like the screenshot below. Make sure the file hierarchy in the second panel is same as the screenshot.

[<img class="alignnone size-medium wp-image-19116" alt="Screen1" src="https://strongloop.com/wp-content/uploads/2014/03/Screen1-300x188.png" width="300" height="188" />](https://strongloop.com/wp-content/uploads/2014/03/Screen1.png)

Connect the elements in the screen with the View Controller class: Select the Refresh button in your View Controller, hold Control and drag it into the `ViewController.m` right before `@end`. Name it &#8220;actionGetBooks&#8221; and click **Connect**, as shown below.  This will insert code that looks like this:

<table data-macro-name="code" data-macro-body-type="PLAIN_TEXT">
  <tr>
    <td>
      ```js
- (IBAction)actionGetBooks:(id)sender {
}
```js
    </td>
  </tr>
</table>

[<img class="alignnone size-medium wp-image-19117" alt="SNP-3" src="https://strongloop.com/wp-content/uploads/2014/03/SNP-3-300x180.png" width="300" height="180" />](https://strongloop.com/wp-content/uploads/2014/03/SNP-3.png)

Define the TableView property by control-dragging into the `ViewController.h` file, as illustrated below.

[<img class="alignnone size-medium wp-image-19118" alt="SNP-4" src="https://strongloop.com/wp-content/uploads/2014/03/SNP-4-300x180.png" width="300" height="180" />](https://strongloop.com/wp-content/uploads/2014/03/SNP-4.png)

Define `*myTable` by control-dragging into `ViewController.m`, as illustrated below.

[<img class="alignnone size-medium wp-image-19119" alt="myTable" src="https://strongloop.com/wp-content/uploads/2014/03/myTable-300x194.png" width="300" height="194" />](https://strongloop.com/wp-content/uploads/2014/03/myTable.png)

Set outlets for the TableView by control-dragging them to the View Controller.

In the second pane, right-click on Table View. Under Outlets, click on dataSource and drag it to the Books View Controller. Click on delegate and also drag it to the Books View Controller.

.[<img class="alignnone size-medium wp-image-19120" alt="View Controller" src="https://strongloop.com/wp-content/uploads/2014/03/View-Controller-300x187.png" width="300" height="187" />](https://strongloop.com/wp-content/uploads/2014/03/View-Controller.png)

Implement the &#8216;actionGetBook&#8217; function.

  * Import `AppDelegate.h` in `ViewController.m`.
  * Define the interfaces for the table.
  * Define the `getBooks` function. Refer to the comments in the code below.

**booksViewController.h**

<table data-macro-name="code" data-macro-parameters="title=booksViewController.h" data-macro-body-type="PLAIN_TEXT">
  <tr>
    <td style="text-align: left;">
      ```js
#import UIKit/UIKit.h
#import "booksAppDelegate.h"
@interface ViewController : UIViewController 
@property (weak, nonatomic) IBOutlet UITableView *tableView;
@end
```js
    </td>
  </tr>
</table>

**booksViewController.rm**

<table data-macro-name="code" data-macro-parameters="title=booksViewController.m" data-macro-body-type="PLAIN_TEXT">
  <tr>
    <td>
      ```js
#import "booksViewController.h"
#import "booksAppDelegate.h"
#define prototypeName @"books"

@interface booksViewController ()
@property (weak, nonatomic) IBOutlet UITableView * myTable;
@property (strong, nonatomic) NSArray *tableData;
@end

@implementation booksViewController

...
- (NSArray *) tableData
{
    if (!_tableData)_tableData = [[NSArray alloc] init];
    return _tableData;
}
- (void) getBooks
{
    //Error Block
    void (^loadErrorBlock)(NSError *) = ^(NSError *error){
        NSLog(@"Error on load %@", error.description);
    };
    void (^loadSuccessBlock)(NSArray *) = ^(NSArray *models){
        NSLog(@"Success count %d", models.count);
        self.tableData = models;
        [self.myTable reloadData];
    };
    //This line gets the Loopback model "book" through the adapter defined in AppDelegate
    LBModelRepository *allbooks = [[booksAppDelegate adapter] repositoryWithModelName:prototypeName];
    //Logic - Get all books. If connection fails, load the error block, if it passes, call the success block and pass allbooks to it.
    [allbooks allWithSuccess:loadSuccessBlock  failure:loadErrorBlock];
};

- (NSInteger) tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return [self.tableData count];
}

// To display data in the table.
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    static NSString *simpleTableIdentifier = @"BookCell";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:simpleTableIdentifier];
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:simpleTableIdentifier];
    }
    if (  [ [[self.tableData objectAtIndex:indexPath.row] class] isSubclassOfClass:[LBModel class]])
    {
        LBModel *model = (LBModel *)[self.tableData objectAtIndex:indexPath.row];
        cell.textLabel.text = [[NSString alloc] initWithFormat:@"%@ by %@",
                               [model objectForKeyedSubscript:@"title"], [model objectForKeyedSubscript:@"author"]];
        //        cell.imageView.image = [UIImage imageNamed:@"button.png"];
    }
    return cell;
}
...
```js
    </td>
  </tr>
</table>

Call getBooks from the actionGetBooks function defined in Step 4.

<table class="aligncenter" data-macro-name="code" data-macro-body-type="PLAIN_TEXT">
  <tr>
    <td>
      ```js
- (IBAction)actionGetBooks:(id)sender {
    [self getBooks]; 
}
```js
    </td>
  </tr>
</table>

At this point you should be able to build your app and get the list of books. Build the app and run it on a simulator. Click **Refresh** and you should be able to see the list of books.

[<img class="alignnone size-full wp-image-19121" alt="List of books" src="https://strongloop.com/wp-content/uploads/2014/03/List-of-books.png" width="184" height="300" />](https://strongloop.com/wp-content/uploads/2014/03/List-of-books.png)

## **What’s next?**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Continue to <a href="http://strongloop.com/strongblog/how-to-crud-ios-nodejs-loopback-api-server-part/">&#8220;How-to Build CRUD Enabled iOS Apps with the LoopBack API Server &#8211; Part 2&#8221;</a></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Download the <a href="https://github.com/strongloop-community/sample-applications/tree/master/BooksServer">server side code</a></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Download the <a href="https://github.com/strongloop-community/sample-applications/tree/master/BooksClient">iOS client application</a></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Need performance monitoring, profiling and cluster capabilities for your Node apps? Check out <a href="http://strongloop.com/node-js-performance/strongops/">StrongOps</a>!</span>
</li>