// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-module: {"file":"test/assets/packages/require-async-sub-via-mapped-pkg-twice/app.js","mtime":0,"wrapper":"commonjs","format":"commonjs","variation":"","id":"/app.js"}
require.memoize("/app.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'test/assets/packages/require-async-sub-via-mapped-pkg-twice';

exports.main = function (callback) {
	return require("pkg").main(callback);
}

}
, {"filename":"test/assets/packages/require-async-sub-via-mapped-pkg-twice/app.js","variation":""});
// @pinf-bundle-module: {"file":"test/assets/packages/require-async-sub-via-mapped-pkg/app.js","mtime":0,"wrapper":"commonjs","format":"commonjs","variation":"","id":"1b0b9fe19954bb3b53142c3edeaf5c562d47c9d5-require-async-sub-via-mapped-pkg/app.js"}
require.memoize("1b0b9fe19954bb3b53142c3edeaf5c562d47c9d5-require-async-sub-via-mapped-pkg/app.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'test/assets/packages/require-async-sub-via-mapped-pkg';


// This is needed to support mapped requires for plain nodejs modules
// as they are supported by the pinf bundler.
// TODO: Move this into a generic helper.
var originalRequire = require;
require = function (id) {
    if (module.parent) {
        // We are running directly via NodeJS.
        var idParts = id.split("/");
        var packageAlias = idParts.shift();
        if (/^\./.test(packageAlias)) {
            return originalRequire(id);
        }
        var descriptor = require("./package.json");
        idParts.unshift(descriptor.mappings[packageAlias]);
        return originalRequire(idParts.join("/"));
    } else {
        // We are running within a PINF bundle.
        return originalRequire(id);
    }
};


exports.main = function (callback) {
	return require("pkg/app").main(callback);
}

}
, {"filename":"test/assets/packages/require-async-sub-via-mapped-pkg/app.js","variation":""});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"1b0b9fe19954bb3b53142c3edeaf5c562d47c9d5-require-async-sub-via-mapped-pkg/package.json"}
require.memoize("1b0b9fe19954bb3b53142c3edeaf5c562d47c9d5-require-async-sub-via-mapped-pkg/package.json", 
{
    "main": "1b0b9fe19954bb3b53142c3edeaf5c562d47c9d5-require-async-sub-via-mapped-pkg/app.js",
    "mappings": {
        "pkg": "26b6128d60871cd25769a056b906b4c7e1aa8767-require-async-sub"
    },
    "dirpath": "test/assets/packages/require-async-sub-via-mapped-pkg"
}
, {"filename":"test/assets/packages/require-async-sub-via-mapped-pkg/package.json"});
// @pinf-bundle-module: {"file":"test/assets/packages/require-async-sub/app.js","mtime":0,"wrapper":"commonjs","format":"commonjs","variation":"","id":"26b6128d60871cd25769a056b906b4c7e1aa8767-require-async-sub/app.js"}
require.memoize("26b6128d60871cd25769a056b906b4c7e1aa8767-require-async-sub/app.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'test/assets/packages/require-async-sub';

exports.main = function (callback) {
	var name = "extra";
	require.async("./sub/" + name, function(EXTRA) {
		console.log(EXTRA.getGreeting());
		return callback(null, {
			loaded: true
		});
	}, callback);
	return null;
}

}
, {"filename":"test/assets/packages/require-async-sub/app.js","variation":""});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"/package.json"}
require.memoize("/package.json", 
{
    "main": "/app.js",
    "mappings": {
        "pkg": "1b0b9fe19954bb3b53142c3edeaf5c562d47c9d5-require-async-sub-via-mapped-pkg"
    },
    "dirpath": "test/assets/packages/require-async-sub-via-mapped-pkg-twice"
}
, {"filename":"test/assets/packages/require-async-sub-via-mapped-pkg-twice/package.json"});
// @pinf-bundle-module: {"file":null,"mtime":0,"wrapper":"json","format":"json","id":"26b6128d60871cd25769a056b906b4c7e1aa8767-require-async-sub/package.json"}
require.memoize("26b6128d60871cd25769a056b906b4c7e1aa8767-require-async-sub/package.json", 
{
    "main": "26b6128d60871cd25769a056b906b4c7e1aa8767-require-async-sub/app.js",
    "dirpath": "test/assets/packages/require-async-sub"
}
, {"filename":"test/assets/packages/require-async-sub/package.json"});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}