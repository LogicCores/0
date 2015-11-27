// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-module: {"file":"test/assets/packages/nodejs-dynamic-require-nested-declared/o.js","mtime":0,"wrapper":"commonjs","format":"commonjs","variation":"","id":"/o.js"}
require.memoize("/o.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'test/assets/packages/nodejs-dynamic-require-nested-declared';

exports.getLetter = function() {
	return "o";
}

}
, {"filename":"test/assets/packages/nodejs-dynamic-require-nested-declared/o.js","variation":""});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"/package.json"}
require.memoize("/package.json", 
{
    "main": "/app.js",
    "dirpath": "test/assets/packages/nodejs-dynamic-require-nested-declared"
}
, {"filename":"test/assets/packages/nodejs-dynamic-require-nested-declared/package.json"});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}