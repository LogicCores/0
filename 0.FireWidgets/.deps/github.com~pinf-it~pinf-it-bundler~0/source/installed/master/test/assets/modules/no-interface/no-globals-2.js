// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-module: {"file":"node_modules/pinf-it-module-insight/test/assets/no-interface/no-globals-2.js","mtime":0,"wrapper":"commonjs/encapsulated","format":"encapsulated","variation":"","id":"/no-globals-2.js"}
require.memoize("/no-globals-2.js", 
function(require, exports, module) {

(function() {

	var exports = {};

	(function() {

		exports.STRING = "string-value";

		exports.OBJECT = {
			id: "object-value"
		};

	})();

})();

}
, {"filename":"node_modules/pinf-it-module-insight/test/assets/no-interface/no-globals-2.js","variation":""});
// @pinf-bundle-module: {"file":"","mtime":0,"wrapper":"json","format":"json","id":"/package.json"}
require.memoize("/package.json", 
{
    "main": "/no-globals-2.js"
}
, {"filename":"node_modules/pinf-it-module-insight/test/assets/no-interface/no-globals-2.js"});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}