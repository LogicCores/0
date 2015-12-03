// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-module: {"file":"test/assets/packages/multiple-declared-exports-bundles/util/worker-runner.js","mtime":0,"wrapper":"commonjs","format":"commonjs","variation":"","id":"/worker-runner.js"}
require.memoize("/worker-runner.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'test/assets/packages/multiple-declared-exports-bundles/util';

exports.main = function (callback) {
	
	console.log("Hello from worker runner!");

	return callback(null, function () {
		return {
			loadedInWorkerRunner: true
		};
	});
}

}
, {"filename":"test/assets/packages/multiple-declared-exports-bundles/util/worker-runner.js","variation":""});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"/package.json"}
require.memoize("/package.json", 
{
    "main": "/worker-runner.js",
    "dirpath": "test/assets/packages/multiple-declared-exports-bundles/util"
}
, {"filename":"test/assets/packages/multiple-declared-exports-bundles/util/package.json"});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}