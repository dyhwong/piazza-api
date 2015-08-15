var User = require("./models/User");
var callPetty = require("./petty");

module.exports = {
  // must login before accessing other api methods
  login: function(email, password) {
    var loginPromise = callPetty("user.login", {
      email: email,
      pass: password
    }).then(function(data) {
      var getUserPromise = callPetty("user.status", {});
      return getUserPromise;
    }).then(function(data) {
      return new User(data);
    });
    return loginPromise;
  }
};