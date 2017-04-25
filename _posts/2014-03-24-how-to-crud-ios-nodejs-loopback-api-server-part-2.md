---
id: 14881
title: 'How-to Build CRUD Enabled iOS Apps with the LoopBack API Server &#8211; Part 2'
date: 2014-03-24T12:49:48+00:00
author: Chandrika Gole
guid: http://strongloop.com/?p=14881
permalink: /strongblog/how-to-crud-ios-nodejs-loopback-api-server-part-2/
categories:
  - Community
  - How-To
  - LoopBack
---
Welcome to the second installment of a two-part tutorial on how to create an iOS app that connects to a [LoopBack](http://docs.strongloop.com/display/DOC/LoopBack) API server application to perform create, read, update, and delete (CRUD) operations. In [Part One](http://strongloop.com/strongblog/how-to-crud-ios-nodejs-loopback-api-server-part-1/) we looked at how to fetch data. In this blog we&#8217;ll look at how to connect the various interface elements to the iOS app.

<strong style="font-size: 1.5em;">Add navigation control</strong>

To add a navigation control to your app:

  1. Select Books Collection View Controller.
  2. Click **Editor > Embed In > Navigation Controller**. This will add a Navigation Item under the Books Collection View Controller, as shown below.
  3. Select the new Navigation Item and name it &#8220;Books Collection&#8221; in the attribute inspector.

[<img class="alignnone size-medium wp-image-19123" alt="navigation" src="https://strongloop.com/wp-content/uploads/2014/03/navigation-300x188.png" width="300" height="188" />](https://strongloop.com/wp-content/uploads/2014/03/navigation.png)
  
<!--more-->

## **Implement the Add Book interface**

To add the interface elements that enable a user to add a book:

  1. From the object library in lower right corner of the XCode window, select **Bar Button** Item.
  2. Drag and drop it to the top right corner of the app shown in the XCode storyboard.
  3. In the attribute inspector change **Identifier** to **Add**, as shown below.
  4. Right click the Add bar button and Control-drag the circle next to action to the Books Collection View Controller. Select &#8216;modal&#8217; as action.

[<img class="alignnone size-medium wp-image-19124" alt="Modal" src="https://strongloop.com/wp-content/uploads/2014/03/Modal-300x187.png" width="300" height="187" />](https://strongloop.com/wp-content/uploads/2014/03/Modal.png)

## **Add another View Controller**

When the user clicks the &#8220;+&#8221; button you want the app to show a screen to add a book to the collection.  To do that you need to add another View Controller:

  1. Drag a **View Controller** element from the Object Library into the storyboard.
  2. Name this View Controller &#8220;Add Book&#8221;.
  
    [<img class="alignnone size-medium wp-image-19125" alt="AddBook" src="https://strongloop.com/wp-content/uploads/2014/03/AddBook-300x188.png" width="300" height="188" />](https://strongloop.com/wp-content/uploads/2014/03/AddBook.png)
  3. Now connect the &#8220;+&#8221; button from the Books Collection View Controller to this screen: Control-dragg the &#8220;+&#8221; button from the **Books Collection View Controller** to the** Add Books View Controller**. This creates a segue.
  4. Select **modal** as segue type.
  5. Implement the segue action by adding the following code to `ViewController.m`:
  
    <table data-macro-name="code" data-macro-parameters="title=ViewController.m" data-macro-body-type="PLAIN_TEXT">
      <tr>
        <td>
          ```js
...
@implementation ViewController 
//Add these 3 lines
- (IBAction)unwindToList:(UIStoryboardSegue *)segue 
{
}
...
- (void)viewDidLoad
```js
        </td>
      </tr>
    </table>

## **Add navigation to View Controller**

Now add navigation to the &#8220;Add Books&#8221; View Controller as follows:

  1. Select the **Add Book View Controller**.
  2. Choose **Editor > Embed In > Navigation Controller**.
  3. Name this Navigation Controller &#8220;AddBook&#8221;.

## **Add elements to Add Books screen**

Add a Done and Cancel button to the Add Books screen as follows:

  1. In the **AddBook** scene, select **Navigation Item**.
  2. In the Object Library, drag and drop two **Bar Button Items** to the scene.
  3. Select each Bar Button Item and in the attribute inspector change their identifiers to &#8220;Done&#8221; and &#8220;Cancel&#8221;.
  4. Control-drag the **Done** button to the green exit button below the View Controller.
  5. Select **unwindToList** as **Segue Action**.
  6. Repeat the above two steps for the **Cancel** button.

.[<img class="alignnone size-medium wp-image-19126" alt="Addbook cancel" src="https://strongloop.com/wp-content/uploads/2014/03/Addbook-cancel-300x188.png" width="300" height="188" />](https://strongloop.com/wp-content/uploads/2014/03/Addbook-cancel.png)

<strong style="font-size: 1.5em;">Add new class files</strong>

Add a new class for the Add Book ViewController as follows:

  1. In the XCode menu, choose **File > New > File&#8230;**.
  2. Select **Objective-C class** and click **Next**.
  3. In the **Choose options for your new file** screen, change **Class name** to &#8220;AddNewBookViewController.&#8221;
  4. Click **Create** to add two new files to your project: `AddNewBookViewController.h` and`AddNewBookViewController.m`.

## **Connect class to View Controller**

Connect the AddNewBookViewController class to the View Controller for Add New Book.

[<img class="alignnone size-medium wp-image-19127" alt="Class" src="https://strongloop.com/wp-content/uploads/2014/03/Class-300x188.png" width="300" height="188" />](https://strongloop.com/wp-content/uploads/2014/03/Class.png)

Add Text Fields from the Object Library to the Add View Screen. Add one Text Field for each of the five properties: title, author, description, totalPages and genre. Your screen should look like the screenshot below:

[<img class="alignnone size-medium wp-image-19128" alt="title" src="https://strongloop.com/wp-content/uploads/2014/03/title-300x188.png" width="300" height="188" />](https://strongloop.com/wp-content/uploads/2014/03/title.png)

To connect the Text fields to your view controller:

  1. Select the **Title** text field in your storyboard.
  2. Control-drag from the text field on your canvas to the code displayed in the editor on the right, stopping at the line just below the `@interface` line in `AddNewBookViewController<code>.m`</code>`.`

In the dialog that appears, for Name, type &#8220;titleField.&#8221;

Leave the rest of the options as they are. Your screen should look like this:

[<img class="alignnone size-medium wp-image-19129" alt="titleField" src="https://strongloop.com/wp-content/uploads/2014/03/titleField-300x190.png" width="300" height="190" />](https://strongloop.com/wp-content/uploads/2014/03/titleField.png)

Do the same for the other text fields.

To connect the Done button to your view controller:

  1. Select the Done button in your storyboard.
  2. Control-drag from the Done button on your canvas to the code display in the editor on the right, stopping the drag at the line just below your `textField` properties in `AddNewBookViewController<code>.m`</code>.
  3. In the dialog that appears, for Name, type &#8220;doneButton.&#8221;Leave the rest of the options as they are. Your dialog should look like this:

[<img class="alignnone size-medium wp-image-19130" alt="Done" src="https://strongloop.com/wp-content/uploads/2014/03/Done-300x188.png" width="300" height="188" />](https://strongloop.com/wp-content/uploads/2014/03/Done.png)

&nbsp;

Now add functionality to the class to save the book when the user adds one:

<table data-macro-name="code" data-macro-parameters="title=AddNewBookViewController.h" data-macro-body-type="PLAIN_TEXT">
  <tr>
    <td>
      ```js
#import UIKit/UIKit.h
#import "ViewController.h"
...
```js
    </td>
  </tr>
</table>

<table data-macro-name="code" data-macro-parameters="title=AddNewBookViewController.m" data-macro-body-type="PLAIN_TEXT">
  <tr>
    <td>
      ```js
#import "AddNewBook.h"
#import "ViewController.h"
#define prototypeName @"books"
@interface AddNewBook ()
@property (weak, nonatomic) IBOutlet UITextField *titleField;
@property (weak, nonatomic) IBOutlet UITextField *authorField;
@property (weak, nonatomic) IBOutlet UITextField *genreField;
@property (weak, nonatomic) IBOutlet UITextField *descriptionField;
@property (weak, nonatomic) IBOutlet UITextField *totalPagesField;
@property (weak, nonatomic) IBOutlet UIBarButtonItem *doneButton;
@end
@implementation AddNewBookViewController

- (void) prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    void (^saveNewErrorBlock)(NSError *) = ^(NSError *error){
        NSLog(@"Error on save %@", error.description);
    };
    void (^saveNewSuccessBlock)() = ^(){
        UIAlertView *messageAlert = [[UIAlertView alloc]initWithTitle:@"Successfull!" message:@"You have add a new book" delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil];
        [messageAlert show];
    };
    if (sender != self.doneButton) return;
    if (self.titleField.text.length &gt; 0) {
        NSLog(@"%@",self.titleField.text);
        LBModelRepository *newBook = [[AppDelegate adapter] repositoryWithModelName:prototypeName];
        //create new LBModel of type
        LBModel *model = [newBook modelWithDictionary:@{
                                                        @"title"        : self.titleField.text,
                                                        @"author"       : self.authorField.text,
                                                        @"genre"        : self.genreField.text,
                                                        @"totalPages"   : self.totalPagesField.text,
                                                        @"description"  : self.descriptionField.text 
                                                        }];
        [model saveWithSuccess:saveNewSuccessBlock failure:saveNewErrorBlock];
    }
    else {
        UIAlertView *messageAlert = [[UIAlertView alloc]initWithTitle:@"Missing Book Title!" message:@"You have to enter a book title." delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil];
        [messageAlert show];
    }
}
....(ctd)
```js
    </td>
  </tr>
</table>

Run the build and try it out. You should be able to add a new book and refresh to fetch all books.

## **What’s next?**

<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Download the <a href="https://github.com/strongloop-community/sample-applications/tree/master/BooksServer">server side code</a></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Download the <a href="https://github.com/strongloop-community/sample-applications/tree/master/BooksClient">iOS client application</a></span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">What’s in the upcoming Node v0.12 version? <a href="http://strongloop.com/strongblog/performance-node-js-v-0-12-whats-new/">Big performance optimizations</a>, read the blog by Ben Noordhuis to learn more.</span>
</li>
<li style="margin-left: 2em;">
  <span style="font-size: 18px;">Need performance monitoring, profiling and cluster capabilities for your Node apps? Check out <a href="http://strongloop.com/node-js-performance/strongops/">StrongOps</a>!</span>
</li>

&nbsp;