// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-module: {"file":"test/assets/packages/nodejs-dynamic-require-complex/node_modules/letters/more.js","mtime":0,"wrapper":"commonjs","format":"commonjs","variation":"","id":"698b594771c54e63058ef9073aaf59f1e529c21f-letters/more.js"}
require.memoize("698b594771c54e63058ef9073aaf59f1e529c21f-letters/more.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'test/assets/packages/nodejs-dynamic-require-complex/node_modules/letters';

exports.getLetterL = function() {
	return require("letter-l/l").getLetter();
}

exports.getLetterO = function() {
	var moduleId = "letter-o/o";
	return require(moduleId).getLetter();
}

}
, {"filename":"test/assets/packages/nodejs-dynamic-require-complex/node_modules/letters/more.js","variation":""});
// @pinf-bundle-module: {"file":"test/assets/packages/nodejs-dynamic-require-complex/node_modules/letter-l/l.js","mtime":0,"wrapper":"commonjs","format":"commonjs","variation":"","id":"a7cccbec540b3144a9118e36296b68cb3dd574ea-letter-l/l.js"}
require.memoize("a7cccbec540b3144a9118e36296b68cb3dd574ea-letter-l/l.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'test/assets/packages/nodejs-dynamic-require-complex/node_modules/letter-l';

exports.getLetter = function() {
	return "l";
}

}
, {"filename":"test/assets/packages/nodejs-dynamic-require-complex/node_modules/letter-l/l.js","variation":""});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"698b594771c54e63058ef9073aaf59f1e529c21f-letters/package.json"}
require.memoize("698b594771c54e63058ef9073aaf59f1e529c21f-letters/package.json", 
{
    "mappings": {
        "letter-l": "a7cccbec540b3144a9118e36296b68cb3dd574ea-letter-l",
        "letter-o": "b78c7d66a80e380b94bf97cf383ab6907b15365e-letter-o"
    },
    "dirpath": "test/assets/packages/nodejs-dynamic-require-complex/node_modules/letters"
}
, {"filename":"test/assets/packages/nodejs-dynamic-require-complex/node_modules/letters/package.json"});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"a7cccbec540b3144a9118e36296b68cb3dd574ea-letter-l/package.json"}
require.memoize("a7cccbec540b3144a9118e36296b68cb3dd574ea-letter-l/package.json", 
{
    "dirpath": "test/assets/packages/nodejs-dynamic-require-complex/node_modules/letter-l"
}
, {"filename":"test/assets/packages/nodejs-dynamic-require-complex/node_modules/letter-l/package.json"});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}