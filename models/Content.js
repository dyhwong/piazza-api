var _ = require("lodash");

var RPC = require("../RPC.js");

var Content = function(content, classID, parent) {
  this.id = content.id;
  this.parent = parent;
  this.classID = classID;
  this.type = content.type;

  this.title = content.history[0].subject;
  this.content = content.history[0].content;

  this.created = content.created;
  this.views = _.isNumber(content.unique_views) ? content.unique_views : parent.views;
  this.folders = content.folders || parent.folders;
  this.tags = content.tags || parent.tags;
  this.history = content.history;
  this.changeLog = content.change_log;

  this._init(content, classID);
}

Content.prototype._init = function(content, classID) {
  if (_.last(this.history)) {
    this.authorID = _.last(content.history).uid;
    this.editorIDs = _.chain(content.history)
      .initial()
      .unique("uid")
      .map("uid")
      .value();
  }
  else {
    this.authorID = content.uid;
    this.editorIDs = [];
  }

  var children = _.map(
    content.children,
    content => new Content(content, this.classID, this)
  );

  this.studentResponse = _.find(children, child => child.type === "s_answer");
  this.instructorResponse = _.find(children, child => child.type === "i_answer");
  this.followups = _.filter(children, child => child.type === "followup");
}

Content.prototype.getAuthor = function() {
  var usersPromise = RPC("network.get_users", {
    ids: [this.authorID],
    nid: this.classID,
  })
  .then(users => users[0].name);

  return usersPromise;
}

Content.prototype.getEditors = function() {
  if (this.editorIDs.length === 0) {
    return Promise.resolve([]);
  }
  var usersPromise = RPC("network.get_users", {
    ids: this.editorIDs,
    nid: this.classID,
  })
  .then(users => _.map(users, "name"));
  
  return usersPromise;
}

Content.prototype.getParent = function() {
  return this.parent;
}

Content.prototype.getStudentResponse = function() {
  return this.studentResponse;
}

Content.prototype.getInstructorResponse = function() {
  return this.instructorResponse;
}

Content.prototype.getFollowups = function() {
  return this.followups;
}

Content.prototype.delete = function() {
  var deletePromise = RPC("content.delete", {
    cid: this.id,
  });

  return deletePromise;
}

module.exports = Content;