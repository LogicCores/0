// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-module: {"file":"test/assets/packages/nodejs-dynamic-require-nested/hello.js","mtime":0,"wrapper":"commonjs","format":"commonjs","variation":"","id":"/hello.js"}
require.memoize("/hello.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'test/assets/packages/nodejs-dynamic-require-nested';

var APP = require("./app");
var LETTER_E = require("./e");

exports.getWord = function() {

	var moduleId = "./greeting";

	var GREETING = require(moduleId);

	return APP.getLetterH() + LETTER_E.getLetter() + GREETING.getLetterL() + "l" + require(("./" + "o")).getLetter();
}

}
, {"filename":"test/assets/packages/nodejs-dynamic-require-nested/hello.js","variation":""});
// @pinf-bundle-module: {"file":"test/assets/packages/nodejs-dynamic-require-nested/e/index.js","mtime":0,"wrapper":"commonjs","format":"commonjs","variation":"","id":"/e/index.js"}
require.memoize("/e/index.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'test/assets/packages/nodejs-dynamic-require-nested/e';

exports.getLetter = function() {
	return "e";
}

}
, {"filename":"test/assets/packages/nodejs-dynamic-require-nested/e/index.js","variation":""});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}