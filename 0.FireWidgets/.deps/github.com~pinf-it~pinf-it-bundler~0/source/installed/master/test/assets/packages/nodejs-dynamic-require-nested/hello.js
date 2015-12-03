
var APP = require("./app");
var LETTER_E = require("./e");

exports.getWord = function() {

	var moduleId = "./greeting";

	var GREETING = require(moduleId);

	return APP.getLetterH() + LETTER_E.getLetter() + GREETING.getLetterL() + "l" + require(("./" + "o")).getLetter();
}
