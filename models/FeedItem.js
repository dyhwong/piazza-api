var Content = require("./Content");
var callPetty = require("../petty")

var FeedItem = function(item, classId) {
	this.id = item.id;
	this.classId = classId;
	this.type = item.type;
	this.title = item.subject;
	this.contentSnippet = item.content_snipet;

	this.views = item.unique_views;
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
		return new Content(content, classId);
	});
	return contentPromise;
}

module.exports = FeedItem;