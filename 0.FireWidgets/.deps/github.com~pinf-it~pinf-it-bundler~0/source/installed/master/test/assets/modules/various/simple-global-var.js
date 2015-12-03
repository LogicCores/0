// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-module: {"file":"node_modules/pinf-it-module-insight/test/assets/various/simple-global-var.js","mtime":0,"wrapper":"commonjs/leaky","format":"leaky","variation":"","id":"/simple-global-var.js"}
require.memoize("/simple-global-var.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'node_modules/pinf-it-module-insight/test/assets/various';

var STRING = "string-value";

var OBJECT = {
	id: "object-value"
};

return {
    STRING: (typeof STRING !== "undefined") ? STRING : null,
    OBJECT: (typeof OBJECT !== "undefined") ? OBJECT : null
};
}
, {"filename":"node_modules/pinf-it-module-insight/test/assets/various/simple-global-var.js","variation":""});
// @pinf-bundle-module: {"file":"","mtime":0,"wrapper":"json","format":"json","id":"/package.json"}
require.memoize("/package.json", 
{
    "main": "/simple-global-var.js"
}
, {"filename":"node_modules/pinf-it-module-insight/test/assets/various/simple-global-var.js"});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}