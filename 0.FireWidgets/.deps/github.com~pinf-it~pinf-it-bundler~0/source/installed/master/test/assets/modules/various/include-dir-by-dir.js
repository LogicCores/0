// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-module: {"file":"node_modules/pinf-it-module-insight/test/assets/various/include-dir-by-dir.js","mtime":0,"wrapper":"commonjs/leaky","format":"leaky","variation":"","id":"/include-dir-by-dir.js"}
require.memoize("/include-dir-by-dir.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'node_modules/pinf-it-module-insight/test/assets/various';

module.exports = {
	"lib": require('./lib/'),
	"lib1": require('./lib1')
};

return {
    module: (typeof module !== "undefined") ? module : null,
    require: (typeof require !== "undefined") ? require : null
};
}
, {"filename":"node_modules/pinf-it-module-insight/test/assets/various/include-dir-by-dir.js","variation":""});
// @pinf-bundle-module: {"file":"","mtime":0,"wrapper":"json","format":"json","id":"/package.json"}
require.memoize("/package.json", 
{
    "main": "/include-dir-by-dir.js"
}
, {"filename":"node_modules/pinf-it-module-insight/test/assets/various/include-dir-by-dir.js"});
// @pinf-bundle-module: {"file":"test/assets/modules/various/mocks/include-dir-by-dir.js/lib+index.js","mtime":0,"wrapper":"commonjs/leaky","format":"leaky","variation":"","id":"/lib/index.js"}
require.memoize("/lib/index.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'test/assets/modules/various/mocks/include-dir-by-dir.js';
module.exports = {
	STRING: "string-value",
	OBJECT: {
	    id: "object-value"
	}
};
return {
    module: (typeof module !== "undefined") ? module : null
};
}
, {"filename":"test/assets/modules/various/mocks/include-dir-by-dir.js/lib+index.js","variation":""});
// @pinf-bundle-module: {"file":"test/assets/modules/various/mocks/include-dir-by-dir.js/lib1+index.js","mtime":0,"wrapper":"commonjs/leaky","format":"leaky","variation":"","id":"/lib1.js"}
require.memoize("/lib1.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'test/assets/modules/various/mocks/include-dir-by-dir.js';
module.exports = {
	STRING: "string-value",
	OBJECT: {
	    id: "object-value"
	}
};
return {
    module: (typeof module !== "undefined") ? module : null
};
}
, {"filename":"test/assets/modules/various/mocks/include-dir-by-dir.js/lib1+index.js","variation":""});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}