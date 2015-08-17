# piazza-api

client for Piazza Q&A's API

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quickstart)

## Installation

This is an [npm module](https://www.npmjs.com/package/piazza-api) so you can install it in the normal way.
```sh
npm install piazza-api
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