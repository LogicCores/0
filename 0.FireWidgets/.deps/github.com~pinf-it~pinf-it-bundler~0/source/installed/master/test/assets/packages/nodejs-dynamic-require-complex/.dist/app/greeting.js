// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-module: {"file":"test/assets/packages/nodejs-dynamic-require-complex/greeting.js","mtime":0,"wrapper":"commonjs","format":"commonjs","variation":"","id":"/greeting.js"}
require.memoize("/greeting.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'test/assets/packages/nodejs-dynamic-require-complex';

exports.getGreeting = function() {

	var moduleId = "./assemble";

	return require(moduleId).assemble();
}

}
, {"filename":"test/assets/packages/nodejs-dynamic-require-complex/greeting.js","variation":""});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}