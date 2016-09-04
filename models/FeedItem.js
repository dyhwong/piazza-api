var Content = require("./Content.js");
var RPC = require("../RPC.js")

var FeedItem = function(item, classID) {
  this.id = item.id;
  this.classID = classID;
  this.type = item.type;
  this.title = item.subject;
  this.contentSnippet = item.content_snipet; // this is actually spelled correctly

  this.views = item.unique_views;
  this.tags = item.tags;
  this.folders = item.folders;
  this.lastModified = item.modified;
  this.log = item.log; //u : user, t: time, n: action -> "create", "s_answer", "update" (update post), "followup", "feedback" (answer followup)
}

FeedItem.prototype.toContent = function() {
  var contentPromise = RPC("content.get", {
    nid: this.classID,
    cid: this.id,
  })
  .then(content => new Content(content, this.classID));

  return contentPromise;
}

module.exports = FeedItem;