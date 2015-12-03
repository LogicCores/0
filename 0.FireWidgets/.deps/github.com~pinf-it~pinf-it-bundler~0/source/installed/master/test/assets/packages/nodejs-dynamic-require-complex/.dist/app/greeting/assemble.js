// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-module: {"file":"test/assets/packages/nodejs-dynamic-require-complex/assemble.js","mtime":0,"wrapper":"commonjs","format":"commonjs","variation":"","id":"/assemble.js"}
require.memoize("/assemble.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'test/assets/packages/nodejs-dynamic-require-complex';

exports.assemble = function() {

	var moduleId = "letters/e";

	var LETTER_E = require(moduleId).getLetter();
	var LETTER_L = require("letter-l/l").getLetter();
	var LETTER_O = require("letter-o/o").getLetter();

	return "H" + LETTER_E + "l" + LETTER_L + LETTER_O + " W" + require(moduleId).getLetterO() + "r" + require(moduleId).getLetterL() + "d";
}

}
, {"filename":"test/assets/packages/nodejs-dynamic-require-complex/assemble.js","variation":""});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}