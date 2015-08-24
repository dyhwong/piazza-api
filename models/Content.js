var _ = require("lodash");

var callPetty = require("../petty");

var Content = function(content, classId, parent) {
	this.id = content.id;
	this.parent = parent;
	this.classId = classId;
	this.type = content.type;

	this.title = content.history[0].subject;
	this.content = content.history[0].content;

	this.created = content.created;
	this.views = content.unique_views || parent.views;
	this.folders = content.folders || parent.folders;
	this.tags = content.tags || parent.tags;
	this.history = content.history;
	this.changeLog = content.change_log;

	this.init(content, classId);
}

Content.prototype.init = function(content, classId) {
	var that = this;

	if (_.last(this.history)) {
		this.authorId = _.last(content.history).uid;
		this.editorIds = _.chain(content.history)
			.initial()
			.unique("uid")
			.map("uid")
			.value();
	}
	else {
		this.authorId = content.uid;
		this.editorIds = [];
	}

	this.children = _.map(content.children, function(content) {
		return new Content(content, classId, that);
	});
}

Content.prototype.getAuthor = function() {
	var usersPromise = callPetty("network.get_users", {
		ids: [this.authorId],
		nid: this.classId
	}).then(function(users) {
		return users[0].name;
	});
	return usersPromise;
}

Content.prototype.getEditors = function() {
	if (this.editorIds.length === 0) {
		return [];
	}
	var usersPromise = callPetty("network.get_users", {
		ids: this.editorIds,
		nid: this.classId
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