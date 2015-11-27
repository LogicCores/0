// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-module: {"file":"test/assets/packages/nodejs-dynamic-require-complex/node_modules/letters/e.js","mtime":0,"wrapper":"commonjs","format":"commonjs","variation":"","id":"698b594771c54e63058ef9073aaf59f1e529c21f-letters/e.js"}
require.memoize("698b594771c54e63058ef9073aaf59f1e529c21f-letters/e.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'test/assets/packages/nodejs-dynamic-require-complex/node_modules/letters';

var moduleId = "./more";

var MORE = require(moduleId);

exports.getLetter = function() {
	return "e";
}

exports.getLetterL = MORE.getLetterL;

exports.getLetterO = MORE.getLetterO;

}
, {"filename":"test/assets/packages/nodejs-dynamic-require-complex/node_modules/letters/e.js","variation":""});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"698b594771c54e63058ef9073aaf59f1e529c21f-letters/package.json"}
require.memoize("698b594771c54e63058ef9073aaf59f1e529c21f-letters/package.json", 
{
    "dirpath": "test/assets/packages/nodejs-dynamic-require-complex/node_modules/letters"
}
, {"filename":"test/assets/packages/nodejs-dynamic-require-complex/node_modules/letters/package.json"});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}