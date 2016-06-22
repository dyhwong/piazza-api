var _ = require("lodash");

var callPetty = require("../petty");

var Content = function(content, classID, parent) {
	this.id = content.id;
	this.parent = parent;
	this.classID = classID;
	this.type = content.type;

	this.title = content.history[0].subject;
	this.content = content.history[0].content;

	this.created = content.created;
	this.views = content.unique_views || parent.views;
	this.folders = content.folders || parent.folders;
	this.tags = content.tags || parent.tags;
	this.history = content.history;
	this.changeLog = content.change_log;

	this.init(content, classID);
}

Content.prototype.init = function(content, classID) {
	var that = this;

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

	this.children = _.map(content.children, function(content) {
		return new Content(content, classID, that);
	});
}

Content.prototype.getAuthor = function() {
	var usersPromise = callPetty("network.get_users", {
		ids: [this.authorID],
		nid: this.classID
	}).then(function(users) {
		return users[0].name;
	});
	return usersPromise;
}

Content.prototype.getEditors = function() {
	if (this.editorIDs.length === 0) {
		return Promise.resolve([]);
	}
	var usersPromise = callPetty("network.get_users", {
		ids: this.editorIDs,
		nid: this.classID
	}).then(function(users) {
		return _.map(users, "name");
	});
	return usersPromise;
}

Content.prototype.getParent = function() {
	return this.parent;
}

Content.prototype.getStudentResponse = function() {
	return _.find(this.children, function(child) {
		return child.type === "s_answer";
	});
}

Content.prototype.getInstructorResponse = function() {
	return _.find(this.children, function(child) {
		return child.type === "i_answer";
	});
}

Content.prototype.getFollowups = function() {
	return _.filter(this.children, function(child) {
		return child.type === "followup";
	});
}

module.exports = Content;