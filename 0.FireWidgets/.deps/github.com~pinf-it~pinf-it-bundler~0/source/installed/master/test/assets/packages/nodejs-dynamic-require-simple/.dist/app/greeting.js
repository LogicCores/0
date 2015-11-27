// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-module: {"file":"test/assets/packages/nodejs-dynamic-require-simple/greeting.js","mtime":0,"wrapper":"commonjs","format":"commonjs","variation":"","id":"/greeting.js"}
require.memoize("/greeting.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'test/assets/packages/nodejs-dynamic-require-simple';

exports.getGreeting = function() {
	return "Hello World";
}

}
, {"filename":"test/assets/packages/nodejs-dynamic-require-simple/greeting.js","variation":""});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}