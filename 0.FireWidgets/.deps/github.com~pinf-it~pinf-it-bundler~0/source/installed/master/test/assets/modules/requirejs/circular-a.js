// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-header: {"helper":"amd"}
function define(id, dependencies, moduleInitializer) {
    if (typeof dependencies === "undefined" && typeof moduleInitializer === "undefined") {
        if (typeof id === "function") {
            moduleInitializer = id;
        } else {
            var exports = id;
            moduleInitializer = function() { return exports; }
        }
        dependencies = ["require", "exports", "module"];
        id = null;
    } else
    if (Array.isArray(id) && typeof dependencies === "function" && typeof moduleInitializer === "undefined") {
        moduleInitializer = dependencies;
        dependencies = id;
        id = null;
    } else
    if (typeof id === "string" && typeof dependencies === "function" && typeof moduleInitializer === "undefined") {
        moduleInitializer = dependencies;
        dependencies = ["require", "exports", "module"];
    }
    return function(realRequire, exports, module) {
        function require(id) {
            if (Array.isArray(id)) {
                var apis = [];
                var callback = arguments[1];
                id.forEach(function(moduleId, index) {
                    realRequire.async(moduleId, function(api) {
                        apis[index] = api
                        if (apis.length === id.length) {
                            if (callback) callback.apply(null, apis);
                        }
                    }, function(err) {
                        throw err;
                    });
                });
            } else {
                return realRequire(id);
            }
        }
        require.toUrl = function(id) {
            return realRequire.sandbox.id.replace(/\/[^\/]*$/, "") + realRequire.id(id);
        }
        require.sandbox = realRequire.sandbox;
        require.id = realRequire.id;
        if (typeof amdRequireImplementation !== "undefined") {
            amdRequireImplementation = require;
        }
        if (typeof moduleInitializer === "function") {
            return moduleInitializer.apply(moduleInitializer, dependencies.map(function(name) {
                if (name === "require") return require;
                if (name === "exports") return exports;
                if (name === "module") return module;
                return require(name);
            }));
        } else
        if (typeof dependencies === "object") {
            return dependencies;
        }
    }
}
define.amd = { jQuery: true };
require.def = define;
// @pinf-bundle-module: {"file":"node_modules/pinf-it-module-insight/test/assets/requirejs/circular-a.js","mtime":0,"wrapper":"amd","format":"amd","variation":"","id":"/circular-a.js"}
require.memoize("/circular-a.js", 
// @see https://github.com/jrburke/requirejs/blob/master/tests/circular/a.js
define(['b', 'exports'], function (b, exports) {
    exports.name = 'a';
    exports.b = b;
})
, {"filename":"node_modules/pinf-it-module-insight/test/assets/requirejs/circular-a.js","variation":""});
// @pinf-bundle-module: {"file":"test/assets/modules/requirejs/mocks/circular-a.js/b.js","mtime":0,"wrapper":"amd","format":"amd","variation":"","id":"/b.js"}
require.memoize("/b.js", 
// @see https://github.com/jrburke/requirejs/blob/master/tests/circular/b.js
define(['c', 'exports'], function (c, exports) {
    exports.name = 'b';
    exports.c = c;
})
, {"filename":"test/assets/modules/requirejs/mocks/circular-a.js/b.js","variation":""});
// @pinf-bundle-module: {"file":"test/assets/modules/requirejs/mocks/circular-a.js/c.js","mtime":0,"wrapper":"amd","format":"amd","variation":"","id":"/c.js"}
require.memoize("/c.js", 
// @see https://github.com/jrburke/requirejs/blob/master/tests/circular/c.js
define(['circular-a', 'exports'], function (a, exports) {
    exports.name = 'c';
    exports.a = a;
})
, {"filename":"test/assets/modules/requirejs/mocks/circular-a.js/c.js","variation":""});
// @pinf-bundle-module: {"file":"","mtime":0,"wrapper":"json","format":"json","id":"/package.json"}
require.memoize("/package.json", 
{
    "main": "/circular-a.js"
}
, {"filename":"node_modules/pinf-it-module-insight/test/assets/requirejs/circular-a.js"});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}