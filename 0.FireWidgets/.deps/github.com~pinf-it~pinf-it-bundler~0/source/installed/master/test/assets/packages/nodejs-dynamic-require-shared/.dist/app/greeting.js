// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-module: {"file":"test/assets/packages/nodejs-dynamic-require-shared/greeting.js","mtime":0,"wrapper":"commonjs","format":"commonjs","variation":"","id":"/greeting.js"}
require.memoize("/greeting.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'test/assets/packages/nodejs-dynamic-require-shared';

var APP = require("./app");

exports.getGreeting = function() {
	return "Hello " + APP.getWorld();
}

}
, {"filename":"test/assets/packages/nodejs-dynamic-require-shared/greeting.js","variation":""});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}