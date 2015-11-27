// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-module: {"file":"test/assets/packages/require-async-sub/app.js","mtime":0,"wrapper":"commonjs","format":"commonjs","variation":"","id":"/app.js"}
require.memoize("/app.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'test/assets/packages/require-async-sub';

exports.main = function (callback) {
	var name = "extra";
	require.async("./sub/" + name, function(EXTRA) {
		console.log(EXTRA.getGreeting());
		return callback(null, {
			loaded: true
		});
	}, callback);
	return null;
}

}
, {"filename":"test/assets/packages/require-async-sub/app.js","variation":""});
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