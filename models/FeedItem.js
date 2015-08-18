var Content = require("./Content");
var callPetty = require("../petty")

var FeedItem = function(item, classId) {
	this.id = item.id;
	this.classId = classId;
	this.type = item.type;
	this.subject = item.subject;
	this.authorId = item.log[0].u;

	this.views = item.unique_views;
	this.hasAnswer = item.no_answer ? false : true;
	this.hasFollowup = item.no_answer_followup ? false : true;
	this.bucketName = item.bucket_name;

	this.tags = item.tags;
	this.folders = item.folders;
	this.lastModified = item.modified;
	this.log = item.log; //u : user, t: time, n: action -> "create", "s_answer", "update" (update post), "followup", "feedback" (answer followup)
}

FeedItem.prototype.toContent = function() {
	var contentPromise = callPetty("content.get", {
		nid: this.classId,
		cid: this.id
	}).then(function(content) {
		return new Content(content);
	});
	return contentPromise;
}

module.exports = FeedItem;