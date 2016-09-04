var _ = require("lodash");

var School = require("./School.js");
var Content = require("./Content.js");
var FeedItem = require("./FeedItem.js");
var RPC = require("../RPC.js");

var Class = function(course) {
  this.id = course.id;
  this.name = course.name;
  this.courseNumber = course.course_number;
  this.courseDescription = course.course_description;
  this.department = course.department;

  this.status = course.status;
  this.term = course.term;
  this.startDate = course.start_date;
  this.endDate = course.end_date;
  this.totalPosts = course.total_content_prof;
  this.totalPublicPosts = course.total_content_stud;

  this.folders = course.folders;
  this.instructors = course.profs;

  this._init(course);
}

Class.prototype._init = function(course) {
  this.school = new School(course.school, course.school_id);
  _.each(course.profs, instructor => {
    var officeHours = course.office_hours[instructor.id] || {};
    officeHours.email = instructor.email;
    officeHours.name = instructor.name;
    officeHours.role = instructor.role;
    course.office_hours[instructor.id] = officeHours;
  });
  this.officeHours = course.office_hours;
}

Class.prototype.getOnlineUsersCount = function() {
  var countPromise = RPC("network.get_online_users", {
    nid: this.id
  })
  .then(countData => countData.users);

  return countPromise;
}

Class.prototype.getStats = function() {
  var statsPromise = RPC("network.get_instructor_stats", {
    nid: this.id
  });

  return statsPromise;
}

Class.prototype.getContentByID = function(contentID) {
  var classID = this.id;
  var contentPromise = RPC("content.get", {
    nid: classID,
    cid: contentID
  })
  .then(data => new Content(data, classID));

  return contentPromise;
}

Class.prototype.filterByFolder = function(folderName) {
  var classID = this.id;
  var filterPromise = RPC("network.filter_feed", {
    nid: this.id,
    sort: "updated",
    filter_folder: folderName,
    folder: 1
  })
  .then(
    data => _.map(
      data.feed,
      item => new FeedItem(item, classID)
    )
  );

  return filterPromise;
}

Class.prototype.filterByProperty = function(property) {
  var params = {
    nid: this.id,
    sort: "updated"
  };
  params[property] = 1;
  var classID = this.id;
  var filterPromise = RPC("network.filter_feed", params)
  .then(
    data => _.map(
      data.feed,
      item => new FeedItem(item, classID)
    )
  );

  return filterPromise;
}

Class.prototype.search = function(query) {
  var classID = this.id;
  var searchPromise = RPC("network.search", {
    nid: this.id,
    query: query,
  })
  .then(
    data => _.map(
      data,
      item => new FeedItem(item, classID)
    )
  );
  
  return searchPromise;
}

Class.prototype.getFeed = function() {
  return this.search("");
}

module.exports = Class;