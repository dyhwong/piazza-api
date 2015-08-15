var _ = require("lodash");

var callPetty = require("../petty");

var Content = function(content, classId, parent) {
	this.id = content.id;
	this.parent = parent;
	this.classId = classId;
	this.type = content.type;
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
	this.children = _.map(content.children, function(content) {
		return new Content(content, classId, that);
	});
}

Content.prototype.getParent = function() {
	return this.parent;
}

Content.prototype.getStudentResponse = function() {
	return _.find(this.children, function(child) {
		return child.type == "s_answer";
	});
}

Content.prototype.getInstructorResponse = function() {
	return _.find(this.children, function(child) {
		return child.type == "i_answer";
	});
}

Content.prototype.getFollowups = function() {
	return _.filter(this.children, function(child) {
		return child.type == "followup";
	});
}


module.exports = Content;