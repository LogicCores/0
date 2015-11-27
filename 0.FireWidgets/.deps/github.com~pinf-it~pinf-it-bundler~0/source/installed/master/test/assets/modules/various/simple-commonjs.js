// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-module: {"file":"node_modules/pinf-it-module-insight/test/assets/various/simple-commonjs.js","mtime":0,"wrapper":"commonjs","format":"commonjs","variation":"","id":"/simple-commonjs.js"}
require.memoize("/simple-commonjs.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'node_modules/pinf-it-module-insight/test/assets/various';

exports.STRING = "string-value";

exports.OBJECT = {
	id: "object-value"
};

}
, {"filename":"node_modules/pinf-it-module-insight/test/assets/various/simple-commonjs.js","variation":""});
// @pinf-bundle-module: {"file":"","mtime":0,"wrapper":"json","format":"json","id":"/package.json"}
require.memoize("/package.json", 
{
    "main": "/simple-commonjs.js"
}
, {"filename":"node_modules/pinf-it-module-insight/test/assets/various/simple-commonjs.js"});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}