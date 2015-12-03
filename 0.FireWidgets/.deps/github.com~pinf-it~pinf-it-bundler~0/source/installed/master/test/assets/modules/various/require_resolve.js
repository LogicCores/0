// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-module: {"file":"node_modules/pinf-it-module-insight/test/assets/various/require_resolve.js","mtime":0,"wrapper":"commonjs/leaky","format":"leaky","variation":"","id":"/require_resolve.js"}
require.memoize("/require_resolve.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'node_modules/pinf-it-module-insight/test/assets/various';

require.resolve("os");

console.log("Hello World");

return {
    console: (typeof console !== "undefined") ? console : null
};
}
, {"filename":"node_modules/pinf-it-module-insight/test/assets/various/require_resolve.js","variation":""});
// @pinf-bundle-module: {"file":"","mtime":0,"wrapper":"json","format":"json","id":"/package.json"}
require.memoize("/package.json", 
{
    "main": "/require_resolve.js"
}
, {"filename":"node_modules/pinf-it-module-insight/test/assets/various/require_resolve.js"});
// @pinf-bundle-module: {"file":"test/assets/modules/various/mocks/require_resolve.js/os.js","mtime":0,"wrapper":"commonjs/encapsulated","format":"encapsulated","variation":"","id":"/os.js"}
require.memoize("/os.js", 
function(require, exports, module) {

}
, {"filename":"test/assets/modules/various/mocks/require_resolve.js/os.js","variation":""});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}