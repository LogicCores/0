// @pinf-bundle-ignore: 
PINF.bundle("", function(require) {
// @pinf-bundle-module: {"file":"test/assets/packages/require-local-fallback/app.js","mtime":0,"wrapper":"commonjs/leaky","format":"leaky","id":"/app.js"}
require.memoize("/app.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'test/assets/packages/require-local-fallback';

var OS = require("_os");

function main() {
	console.log("Hello " + OS.getPlatform());
}

if (require.main === module) {
	main();
}

return {
    OS: (typeof OS !== "undefined") ? OS : null,
    require: (typeof require !== "undefined") ? require : null,
    console: (typeof console !== "undefined") ? console : null
};
}
, {"filename":"test/assets/packages/require-local-fallback/app.js"});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"/package.json"}
require.memoize("/package.json", 
{
    "main": "/app.js",
    "dirpath": "test/assets/packages/require-local-fallback"
}
, {"filename":"test/assets/packages/require-local-fallback/package.json"});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}