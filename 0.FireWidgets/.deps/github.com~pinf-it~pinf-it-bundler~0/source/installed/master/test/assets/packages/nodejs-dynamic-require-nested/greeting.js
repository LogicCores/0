
var APP = require("./app");

exports.getGreeting = function() {

	var moduleId = "./hello";

	var HELLO = require(moduleId);

	return HELLO.getWord() + " " + APP.getWorld();
}

exports.getLetterL = function() {
	return "l";	
}
