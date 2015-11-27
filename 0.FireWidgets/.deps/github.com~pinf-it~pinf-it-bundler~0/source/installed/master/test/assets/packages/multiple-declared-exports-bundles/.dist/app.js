// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-module: {"file":"test/assets/packages/multiple-declared-exports-bundles/app.js","mtime":0,"wrapper":"commonjs","format":"commonjs","variation":"","id":"/app.js"}
require.memoize("/app.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'test/assets/packages/multiple-declared-exports-bundles';

const WORKER = require("util/worker");


exports.main = function (callback) {

	WORKER.run(callback);

	return null;
}

}
, {"filename":"test/assets/packages/multiple-declared-exports-bundles/app.js","variation":""});
// @pinf-bundle-module: {"file":"test/assets/packages/multiple-declared-exports-bundles/util/worker.js","mtime":0,"wrapper":"commonjs","format":"commonjs","variation":"","id":"d6e96c32a89427dca4b33126da5b03942ca3c311-util/worker.js"}
require.memoize("d6e96c32a89427dca4b33126da5b03942ca3c311-util/worker.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'test/assets/packages/multiple-declared-exports-bundles/util';

exports.run = function (callback) {

	console.log("Hello from worker");

	var uri = require.sandbox.id + require.id("./worker-runner.js");

	console.log("Worker runner uri: " + uri);

	return require.sandbox(uri, function(sandbox) {

		return sandbox.main(callback);

	}, function (err) {
		console.log("Error while loading bundle '" + uri + "':", err.stack);
		return callback(err);
	});
}

}
, {"filename":"test/assets/packages/multiple-declared-exports-bundles/util/worker.js","variation":""});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"/package.json"}
require.memoize("/package.json", 
{
    "main": "/app.js",
    "mappings": {
        "util": "d6e96c32a89427dca4b33126da5b03942ca3c311-util"
    },
    "dirpath": "test/assets/packages/multiple-declared-exports-bundles"
}
, {"filename":"test/assets/packages/multiple-declared-exports-bundles/package.json"});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"d6e96c32a89427dca4b33126da5b03942ca3c311-util/package.json"}
require.memoize("d6e96c32a89427dca4b33126da5b03942ca3c311-util/package.json", 
{
    "dirpath": "test/assets/packages/multiple-declared-exports-bundles/util"
}
, {"filename":"test/assets/packages/multiple-declared-exports-bundles/util/package.json"});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}