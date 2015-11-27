
const PATH = require("path");
const FS = require("fs-extra");
const JSONLD = require("jsonld");
const WAITFOR = require("waitfor");


exports.fromFile = function (path, callback) {
	return (new Config()).initFromFile(path, callback);
}


var Config = exports.Config = function () {
	var self = this;
	self.activity = [];
	self.merged = null;
	self.warnings = [];
}

Config.prototype.process = function (callback) {
	var self = this;

	self.merged = null;
	self.warnings = [];

	self.activity.forEach(function(activity) {
		if (activity[0] === "init") {
			self.merged = activity[1];
		} else {

		}
	});

	function checkForCompactJsonLD(callback) {
		// Check if we have a compacted `json-ld` formatted JSON file
		// which is the status quo and thus add warning if not.
		return JSONLD.expand(self.merged, function(err, expanded) {
			if (err) {
				self.warnings.push(["JSONLD.expand()", err]);
			} else
			if (expanded.length === 0) {
				self.warnings.push(["JSONLD.expand()", "NO_DATA"]);
			}
			return callback(null);
		});
	}

	return checkForCompactJsonLD(function(err) {
		if (err) return callback(err);

		return callback(null, self);
	});
}

Config.prototype.initFromFile = function (path, callback) {
	var self = this;
	return FS.readJson(path, function(err, json) {
		if (err) return callback(err);
		self.activity.push(["init", json]);
		return self.process(callback);
	});
}
