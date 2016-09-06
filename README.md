# piazza-api

A client for [Piazza](https://piazza.com/) Q&A's API

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Overview](#overview)
- [Users](#users)
- [Schools](#schools)
- [Classes](#classes)
- [Contents](#contents)
- [Feed Items](#feed-items)

## Installation

This is an [npm module](https://www.npmjs.com/package/piazza-api) so you can install it in the normal way.
```sh
$ npm install piazza-api
```

## Quick Start

Login with a valid username and password:
```js
var P = require('piazza-api');
P.login('<username>', '<password>').then(function(user) {
    console.log('Hi', user.name);
});
```
The client returns with User object associated with the username and can be used to call the methods listed below. After logging in, the client stores a session token from the remote server so future API calls are automatically authenticated.

## Overview

Most of the calls to the Piazza API are done asynchronously via Javascript [Promises](http://www.html5rocks.com/en/tutorials/es6/promises/). Use the `then` and `catch` methods to handled returned data.
```js
someAsyncCall().then(function(data) {
    console.log('I got the data!');
}).catch(function(error) {
    console.log('Uh oh, there was an error:', error);
});
```
This client will likely include synchronous methods for interacting with the API at some point in the future.

## Users

User fields include

* id [String] - a unique id for each user
* name [String] - the name of the user
* email [String] - the email address of the user
* roles [Object] - maps IDs of the user's classes to the role (for example: 'student', 'professor')
* classIds [Array] - an array containing the string IDs of the user's enrolled classes
* classes [Array] - an array of Class objects the user is enrolled in
* lastSeenClass [Class] - the most recent Class the user has looked at

Users can find Classes they are enrolled in by class ID or by their role in the Class. They can also check whether or not they are enrolled in a class.
```js
> user.getClassById('gptvhze2ToY').name
Introduction to Computers
> user.getClassesByRole('student')[0].name // this method returns an array
Introduction to Computers
> user.isTakingClass('gptvhze2ToY')
true
```

Users can also create posts by calling `postNote` or `postQuestion` and passing in the class ID, post title, post content, and an options JSON object. The options include

* bypass_email [Boolean] - whether to immediately email to the students after posting (only works if user is an instructor in the class)
* folders [Array] - array of folder names to associate with the post
* anonymous [String] - which level of anonymity ("no", "stud", or "full")

Users can also answer question by calling `answerQuestion` and passing in the quesiton, the content of the answer and an options JSON object. The options include

* anonymous [String] - which level of anonymity, defaults to "no"

To update an answer twice in a row, you will need to refresh the question object by reloading it.

## Schools

School fields include

* id [String] - a unique id for each school
* name [String] - the name of the school

Each class belongs to one School which can be found school field. Schools currently have no methods and only have access to their name and ID.
```js
> school.name
Stanford University
```

## Classes

Class fields include

* id [String] - a unique id for each class
* name [String] - the name of the class
* courseNumber [String] - the course number associated with the class (for example: 6.01 or CS101)
* courseDescription [String] - a short description of the class
* department [String] - the department the class belongs to
* school [School] - the school the class belongs to
* status [String] - status of the course (for example: 'inactive' or 'active')
* term [String] - what term the class the active (for example: 'Fall 2014')
* startDate [String] - date the class starts
* endDate [String] - date the class ends
* totalPosts [Integer] - total number of posts visible to instructors
* totalPublicPosts [Integer] - total number of posts visible to students only
* folders [Array] - an array of folder names as Strings
* instructors [Array] - an array of Objects containing the names and emails of class instructors

Classes have access to useful stats such as the response time through the `getStats()` method and the number of users online through the `getOnlineUsersCount()` method.

To access posts in the Class, use `getContentByid` and either pass in the Content ID or an integer. The integer must be between 1 and the number of total posts in the class, inclusive. For example calling `getContentById(97)` would be equivalent to using `@97` in a post on the website. This method returns a Content object.

Filtering posts can be done via `filterByFolder` which accepts a String parameter or `filterByProperty` which accepts a property name such as 'unread', 'unresolved', 'hidden' (for Archived posts), 'updated', 'following', or 'instructors' (for instructor posts). 

Searching can be done through the `search` method which takes a query in the form of a String. All three methods return an Array of Content objects that satisfy the query.

## Contents

Content fields include

* id [String] - a unique id for each Content object
* parent [Content] - the Content object that this one is a child of (or undefined if none)
* classId [String] - the id of Class the Content object belongs to
* type [String] - type of Content (for example: 'question', 'note', 's_answer', 'i_answer', 'followup', 'feedback')
* title [String] - title of Content
* content [String] - text body of Content (includes HTML tags)
* created [String] - timestamp of when the content was created
* views [Integer] - number of users who have viewed the content
* folders [Array] - array of folder names the content is in
* tags [Array] - array of tags the content is associated with (includes folders)
* history [Array] - array of Objects containing the past states of the post, in reverse chronological order
* changeLog [Array] - array of Objects containing the actiosn taken on the post, in chronological order
* children [Array] - array of children Content objects (student answers, instructor answers, and followups)

Content objects have access to all other Content objects related to time like their parent and children. The `getParent` method returns the parent Content object (or none if its type is 'question' or 'note'). Both `getStudentResponse` and `getInstructorResponse` return the corresponding child Content object while `getFollowups` returns an array of all children Content objects that are followups of the current post.

Content objects can also get the names of their authors and editors through `getAuthor` and `getEditors` respectively.

```js
> content.getAuthor()
John Smith
> content.getEditors()
['John Smith', 'Jane Doe']
```

Content objects can also be deleted by calling the `delete` method. Note that this only works if the user has appropriate permissions (instructor privileges).

Editing a Content object is currently unsupported.

Some content can be upvoted ("instructor thinks this is a good answer" or "instructor thinks this is a good question"). This is done through `upvote` method. `undoUpvote` does the opposite and removes the endorsement. This can only be done to questions, notes, and answers.

Users can follow up with notes and questions by calling the `followup` method and providing the content and an options JSON object:

* anonymous [String] - which level of anonymity

Users can also reply to followups by calling `reply` and providing the content of the reply.

Users can also mark followups as resolved or not by calling `markResolved` and providing either `true` or `false` depending on whether the followup is resolved or not.

## Feed Items

Feed item fields include

* id [String] - an id for the corresponding Content object
* classId [String] - id of the Class it belongs to
* type [String] - type of corresponding content
* title [String] - title of the corresponding content
* contentSnippet [String] - truncated text body of the content
* views [Integer] - number of users who have viewed the content
* tags [Array] - array of tags the content is associated with
* folders [Array] - array of folder names the content is in
* lastModified [String] - timestamp of last edit
* log [Array] - the same as Content changelog

Feed items can be converted to Content objects when necessary using the `toContent` method.

```js
> item.toContent()
```