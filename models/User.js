var _ = require("lodash");

var Class = require("./Class.js");
var Content = require("./Content.js");
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

User.prototype.getRoleByClassID = function(classID) {
  return this.roles[classID];
}

User.prototype.isTakingClass = function(classID) {
  return this.classIDs.indexOf(classID) > -1;
}

User.prototype.post = function(classID, title, content, options) {
  var options = options || {};

  var classFolders = this.getClassByID(classID).folders;
  var folders = ["other"];
  if (!_.isUndefined(options.folders)) {
    var validFolders = _.intersection(classFolders, options.folders);
    if (validFolders.length !== 0) {
      folders = validFolders;
    }
  }

  var config = {};
  var bypassEmail = this.roles[classID] === "professor" && options.bypass_email;
  if (bypassEmail) {
    config.bypass_email = 1;
  }

  var postPromise = RPC("content.create", {
    anonymous: options.anonymous, // "no", "stud", "full"
    config: config,
    content: content,
    folders: folders,
    nid: classID,
    status: "active",
    subject: title,
    type: options.type,
  })
  .then(data => new Content(data, classID));

  return postPromise;
}

User.prototype.postNote = function(classID, title, content, options) {
  if (_.isUndefined(options)) {
    options = { type: "note" };
  }
  else {
    options.type = "note";
  }
  return this.post(classID, title, content, options);
}

User.prototype.postQuestion = function(classID, title, content, options) {
  if (_.isUndefined(options)) {
    options = { type: "question" };
  }
  else {
    options.type = "question";
  }
  return this.post(classID, title, content, options);
}

User.prototype.answerQuestion = function(question, answer, options) {
  if (question.type !== "question") {
    throw new Error("not a question");
  }

  var options = options || {};

  var type, revision;
  switch (this.getRoleByClassID(question.classID)) {
    case "student":
      type = "s_answer";
      revision = _.isUndefined(question.getStudentResponse()) ? 1 : question.getStudentResponse().history.length;
      break;
    case "professor":
      type = "i_answer";
      revision = _.isUndefined(question.getInstructorResponse()) ? 1 : question.getInstructorResponse().history.length; 
      break;
  }

  var answerPromise = RPC(
    "content.answer",
    {
      anonymous: options.anonymous || "no",
      cid: question.id,
      content: answer,
      revision: revision,
      type: type,
    }
  )
  .then(data => new Content(data, question.classID, question));

  return answerPromise;
}

module.exports = User;