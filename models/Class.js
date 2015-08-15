var _ = require("lodash");

var School = require("./School");
var Content = require("./Content");
var FeedItem = require("./FeedItem");
var callPetty = require("../petty");

var Class = function(course) {
  this.id = course.id;
  this.name = course.name;
  this.courseNumber = course.course_number;
  this.courseDescription = course.course_description;
  this.department = course.department;

  this.schoolName = course.school_name;
  this.schoolId = course.school_id;
  this.status = course.status;
  this.term = course.term;
  this.startDate = course.start_date;
  this.endDate = course.end_date;
  this.totalPosts = course.total_content_prof;
  this.totalPublicPosts = course.total_content_stud;

  this.folders = course.folders;
  this.instructors = course.profs;

  this.init(course);
}

Class.prototype.init = function(course) {
	this.school = new School(course.school_name, course.school_id);
	_.each(course.profs, function(instructor) {
		course.office_hours[instructor.id].email = instructor.email;
		course.office_hours[instructor.id].name = instructor.name;
		course.office_hours[instructor.id].role = instructor.role;
	})
	this.officeHours = course.office_hours;
}

Class.prototype.getOnlineUsersCount = function() {
	var countPromise = callPetty("network.get_online_users", {
		nid: this.id
	}).then(function(countData) {
		return countData.users;
	});
	return countPromise;
}

Class.prototype.getStats = function() {
	var statsPromise = callPetty("network.get_instructor_stats", {
		nid: this.id
	}).then(function(stats) {
		return stats;
	});
	return statsPromise;
}

Class.prototype.getContentById = function(contentId) {
	var classId = this.id;
	var contentPromise = callPetty("content.get", {
		nid: classId,
		cid: contentId
	}).then(function(data) {
		return new Content(data, classId);
	});
	return contentPromise;
}

Class.prototype.filterByFolder = function(folderName) {
	var classId = this.id;
	var filterPromise = callPetty("network.filter_feed", {
		nid: this.id,
		sort: "updated",
		filter_folder: folderName,
		folder: 1
	}).then(function(data) {
		return _.map(data.feed, function(item) {
			return new FeedItem(item, classId);
		});
	});
	return filterPromise;
}

// sample properties: "unread", "unresolved", "hidden", "following", "instructor"
Class.prototype.filterByProperty = function(property) {
	var params = {
		nid: this.id,
		sort: "updated"
	};
	params[property] = 1;
	var classId = this.id;
	var filterPromise = callPetty("network.filter_feed", params).then(function(data) {
		return _.map(data.feed, function(item) {
			return new FeedItem(item, classId);
		});
	});
	return filterPromise;
}

// make sure to test this on production because I don't have Sphinx locally
Class.prototype.search = function(query) {
	var searchPromise = callPetty("network.search", {
		nid: this.id,
		query: query
	}).then(function(data) {
		return data;
	});
	return searchPromise;
}

module.exports = Class;