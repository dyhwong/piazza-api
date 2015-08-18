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
* roles [Object] - maps IDs of the user's classes to the role (for example: "student", "instructor")
* classIds [Array] - an array containing the string IDs of the user's enrolled classes
* classes [Array] - an array of Class objects the user is enrolled in
* lastSeenClass [Class] - the most recent Class the user has looked at
* school [School] - the school the user belongs to

Users can find Classes they are enrolled in by class ID or by their role in the Class. They can also check whether or not they are enrolled in a class.
```js
> user.getClassById('gptvhze2ToY').name
Introduction to Computers
> user.getClassesByRole('student')[0].name \\ this method returns an array
Introduction to Computers
> user.isTakingClass('gptvhze2ToY')
true
``` 

## Schools

School fields include
* id [String] - a unique id for each school
* name [String] - the name of the school

Each User and each class belongs to one School which can be found school fields. Schools currently have no methods and only have access to their name and ID.
```js
> user.school.name
Stanford University
```

## Classes

## Contents
