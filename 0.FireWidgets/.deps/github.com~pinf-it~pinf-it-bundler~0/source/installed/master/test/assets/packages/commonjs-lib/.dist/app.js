// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-module: {"file":"test/assets/packages/commonjs-lib/app.js","mtime":0,"wrapper":"commonjs/leaky","format":"leaky","variation":"","id":"/app.js"}
require.memoize("/app.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'test/assets/packages/commonjs-lib';

var GREETING = require("greeting/greeting");

function main() {
	console.log(GREETING.getGreeting());
}

if (require.main === module) {
	main();
}

return {
    GREETING: (typeof GREETING !== "undefined") ? GREETING : null,
    require: (typeof require !== "undefined") ? require : null,
    console: (typeof console !== "undefined") ? console : null
};
}
, {"filename":"test/assets/packages/commonjs-lib/app.js","variation":""});
// @pinf-bundle-module: {"file":"test/assets/packages/commonjs-lib/node_modules/greeting/lib-dir/greeting.js","mtime":0,"wrapper":"commonjs","format":"commonjs","variation":"","id":"aba74007c1f9fd6ec9506effc13a53b236bc9e52-greeting/lib-dir/greeting.js"}
require.memoize("aba74007c1f9fd6ec9506effc13a53b236bc9e52-greeting/lib-dir/greeting.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'test/assets/packages/commonjs-lib/node_modules/greeting/lib-dir';

exports.getGreeting = function() {
	return "Hello World";
}

}
, {"filename":"test/assets/packages/commonjs-lib/node_modules/greeting/lib-dir/greeting.js","variation":""});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"/package.json"}
require.memoize("/package.json", 
{
    "main": "/app.js",
    "mappings": {
        "greeting": "aba74007c1f9fd6ec9506effc13a53b236bc9e52-greeting"
    },
    "dirpath": "test/assets/packages/commonjs-lib"
}
, {"filename":"test/assets/packages/commonjs-lib/package.json"});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"aba74007c1f9fd6ec9506effc13a53b236bc9e52-greeting/package.json"}
require.memoize("aba74007c1f9fd6ec9506effc13a53b236bc9e52-greeting/package.json", 
{
    "directories": {
        "lib": "lib-dir"
    },
    "dirpath": "test/assets/packages/commonjs-lib/node_modules/greeting"
}
, {"filename":"test/assets/packages/commonjs-lib/node_modules/greeting/package.json"});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}