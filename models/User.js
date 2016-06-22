var _ = require("lodash");

var Class = require("./Class");
var RPC = require("../RPC.js");

var User = function(user) {
  this.id = user.id;
  this.name = user.name;
  this.email = user.email;
  this.roles = user.config.roles;
  
  this.init(user);
}

User.prototype.init = function(user) {
  this.classIDs = _.map(user.networks, "id");
  this.classes = _.map(user.networks, function(course) {
    return new Class(course);
  });
  this.lastSeenClass = _.find(this.classes, function(course) {
    return course.id === user.last_network;
  });
}

User.prototype.getClassByID = function(class_id) {
  if (_.indexOf(this.classIDs, class_id) === -1) {
    throw new Error("User not enrolled in class");
  }
  return _.find(this.classes, function(course) {
    return course.id === class_id;
  });
}

User.prototype.getClassesByRole = function(role) {
  var roles = this.roles;
  return _.filter(this.classes, function(course) {
    return roles[course.id] === role;
  });
}

User.prototype.isTakingClass = function(class_id) {
  return this.classIDs.indexOf(class_id) > -1;
}

module.exports = User;