// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-module: {"file":"test/assets/packages/require-async/app.js","mtime":0,"wrapper":"commonjs","format":"commonjs","variation":"","id":"/app.js"}
require.memoize("/app.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'test/assets/packages/require-async';

exports.main = function (callback) {
	require.async("./extra", function(EXTRA) {
		console.log(EXTRA.getGreeting());
		return callback(null, {
			loaded: true
		});
	}, callback);
	return null;
}

}
, {"filename":"test/assets/packages/require-async/app.js","variation":""});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"/package.json"}
require.memoize("/package.json", 
{
    "main": "/app.js",
    "dirpath": "test/assets/packages/require-async"
}
, {"filename":"test/assets/packages/require-async/package.json"});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}