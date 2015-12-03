// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-module: {"file":"test/assets/packages/nodejs-dynamic-require-shared/app.js","mtime":0,"wrapper":"commonjs","format":"commonjs","variation":"","id":"/app.js"}
require.memoize("/app.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'test/assets/packages/nodejs-dynamic-require-shared';

function main() {

	var moduleId = "./greeting";

	var GREETING = require(moduleId);

	console.log(GREETING.getGreeting());
}

exports.getWorld = function() {
	return "World";	
}

if (require.main === module) {
	main();
}

}
, {"filename":"test/assets/packages/nodejs-dynamic-require-shared/app.js","variation":""});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"/package.json"}
require.memoize("/package.json", 
{
    "main": "/app.js",
    "dirpath": "test/assets/packages/nodejs-dynamic-require-shared"
}
, {"filename":"test/assets/packages/nodejs-dynamic-require-shared/package.json"});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}