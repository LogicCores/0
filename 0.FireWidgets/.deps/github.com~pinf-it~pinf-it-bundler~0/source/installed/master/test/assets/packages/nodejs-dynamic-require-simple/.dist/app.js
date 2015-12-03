// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-module: {"file":"test/assets/packages/nodejs-dynamic-require-simple/app.js","mtime":0,"wrapper":"commonjs/leaky","format":"leaky","variation":"","id":"/app.js"}
require.memoize("/app.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'test/assets/packages/nodejs-dynamic-require-simple';

function main() {

	var moduleId = "./greeting";

	var GREETING = require(moduleId);

	console.log(GREETING.getGreeting());
}

if (require.main === module) {
	main();
}

return {
    require: (typeof require !== "undefined") ? require : null,
    console: (typeof console !== "undefined") ? console : null
};
}
, {"filename":"test/assets/packages/nodejs-dynamic-require-simple/app.js","variation":""});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"/package.json"}
require.memoize("/package.json", 
{
    "main": "/app.js",
    "dirpath": "test/assets/packages/nodejs-dynamic-require-simple"
}
, {"filename":"test/assets/packages/nodejs-dynamic-require-simple/package.json"});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}