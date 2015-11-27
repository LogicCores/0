// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-module: {"file":"node_modules/pinf-it-module-insight/test/assets/various/require-main.js","mtime":0,"wrapper":"commonjs/leaky","format":"leaky","variation":"","id":"/require-main.js"}
require.memoize("/require-main.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'node_modules/pinf-it-module-insight/test/assets/various';

function main() {
	console.log("Hello World");
}

if (require.main === module) {
	main();
}

return {
    console: (typeof console !== "undefined") ? console : null
};
}
, {"filename":"node_modules/pinf-it-module-insight/test/assets/various/require-main.js","variation":""});
// @pinf-bundle-module: {"file":"","mtime":0,"wrapper":"json","format":"json","id":"/package.json"}
require.memoize("/package.json", 
{
    "main": "/require-main.js"
}
, {"filename":"node_modules/pinf-it-module-insight/test/assets/various/require-main.js"});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}