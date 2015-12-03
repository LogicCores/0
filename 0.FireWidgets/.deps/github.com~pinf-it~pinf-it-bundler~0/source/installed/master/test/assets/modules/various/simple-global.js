// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-module: {"file":"node_modules/pinf-it-module-insight/test/assets/various/simple-global.js","mtime":0,"wrapper":"commonjs/leaky","format":"leaky","id":"/simple-global.js"}
require.memoize("/simple-global.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'node_modules/pinf-it-module-insight/test/assets/various';

STRING = "string-value";

OBJECT = {
	id: "object-value"
};

return {
    STRING: (typeof STRING !== "undefined") ? STRING : null,
    OBJECT: (typeof OBJECT !== "undefined") ? OBJECT : null
};
}
, {"filename":"node_modules/pinf-it-module-insight/test/assets/various/simple-global.js"});
// @pinf-bundle-module: {"file":"","mtime":0,"wrapper":"json","format":"json","id":"/package.json"}
require.memoize("/package.json", 
{
    "main": "/simple-global.js"
}
, {"filename":"node_modules/pinf-it-module-insight/test/assets/various/simple-global.js"});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}