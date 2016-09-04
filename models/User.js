var _ = require("lodash");

var Class = require("./Class.js");
var RPC = require("../RPC.js");

var User = function(user) {
  this.id = user.id;
  this.name = user.name;
  this.email = user.email;
  this.roles = user.config.roles;
  
  this._init(user);
}

User.prototype._init = function(user) {
  this.classIDs = _.map(user.networks, "id");
  this.classes = _.map(user.networks, course => new Class(course));
  this.lastSeenClass = _.find(
    this.classes,
    course => course.id === user.last_network
  );
}

User.prototype.getClassByID = function(classID) {
  if (_.indexOf(this.classIDs, classID) === -1) {
    throw new Error("User not enrolled in class");
  }
  return _.find(this.classes, course => course.id === classID);
}

User.prototype.getClassesByRole = function(role) {
  var roles = this.roles;
  return _.filter(this.classes, course => roles[course.id] === role);
}

User.prototype.isTakingClass = function(classID) {
  return this.classIDs.indexOf(classID) > -1;
}

module.exports = User;