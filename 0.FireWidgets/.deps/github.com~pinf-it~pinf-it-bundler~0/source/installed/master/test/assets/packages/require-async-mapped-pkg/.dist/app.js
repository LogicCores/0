// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-module: {"file":"test/assets/packages/require-async-mapped-pkg/app.js","mtime":0,"wrapper":"commonjs","format":"commonjs","variation":"","id":"/app.js"}
require.memoize("/app.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'test/assets/packages/require-async-mapped-pkg';

exports.main = function (callback) {
	require("pkg").main(callback);
	return null;
}

}
, {"filename":"test/assets/packages/require-async-mapped-pkg/app.js","variation":""});
// @pinf-bundle-module: {"file":"test/assets/packages_externals/require-async-mapped-pkg/pkg/sub.js","mtime":0,"wrapper":"commonjs","format":"commonjs","variation":"","id":"20131cd4dcb08aef4189b75430afe17b5da812f8-pkg/sub.js"}
require.memoize("20131cd4dcb08aef4189b75430afe17b5da812f8-pkg/sub.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'test/assets/packages_externals/require-async-mapped-pkg/pkg';

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
, {"filename":"test/assets/packages_externals/require-async-mapped-pkg/pkg/sub.js","variation":""});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"/package.json"}
require.memoize("/package.json", 
{
    "main": "/app.js",
    "mappings": {
        "pkg": "20131cd4dcb08aef4189b75430afe17b5da812f8-pkg"
    },
    "dirpath": "test/assets/packages/require-async-mapped-pkg"
}
, {"filename":"test/assets/packages/require-async-mapped-pkg/package.json"});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"20131cd4dcb08aef4189b75430afe17b5da812f8-pkg/package.json"}
require.memoize("20131cd4dcb08aef4189b75430afe17b5da812f8-pkg/package.json", 
{
    "main": "20131cd4dcb08aef4189b75430afe17b5da812f8-pkg/sub.js",
    "dirpath": "test/assets/packages_externals/require-async-mapped-pkg/pkg"
}
, {"filename":"test/assets/packages_externals/require-async-mapped-pkg/pkg/package.json"});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}