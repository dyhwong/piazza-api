var User = require("./models/User.js");
var RPC = require("./RPC.js");

module.exports = {
  // must login before accessing other api methods
  login: function(email, password) {
    var loginPromise = RPC("user.login", {
      email: email,
      pass: password
    })
    .then(function(data) {
      var getUserPromise = RPC("user.status", {});
      return getUserPromise;
    })
    .then(function(data) {
      return new User(data);
    });
    
    return loginPromise;
  }
};