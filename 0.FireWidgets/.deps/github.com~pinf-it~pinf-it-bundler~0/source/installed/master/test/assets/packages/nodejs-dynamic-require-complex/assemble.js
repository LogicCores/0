
exports.assemble = function() {

	var moduleId = "letters/e";

	var LETTER_E = require(moduleId).getLetter();
	var LETTER_L = require("letter-l/l").getLetter();
	var LETTER_O = require("letter-o/o").getLetter();

	return "H" + LETTER_E + "l" + LETTER_L + LETTER_O + " W" + require(moduleId).getLetterO() + "r" + require(moduleId).getLetterL() + "d";
}
