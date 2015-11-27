// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-module: {"file":"test/assets/packages/require-async-sub/sub/extra.js","mtime":0,"wrapper":"commonjs","format":"commonjs","variation":"","id":"/sub/extra.js"}
require.memoize("/sub/extra.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'test/assets/packages/require-async-sub/sub';

exports.getGreeting = function() {
	return "Hello World";
}

}
, {"filename":"test/assets/packages/require-async-sub/sub/extra.js","variation":""});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"/package.json"}
require.memoize("/package.json", 
{
    "main": "/app.js",
    "dirpath": "test/assets/packages/require-async-sub"
}
, {"filename":"test/assets/packages/require-async-sub/package.json"});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}