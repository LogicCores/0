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
// @pinf-bundle-module: {"file":"node_modules/pinf-it-module-insight/test/assets/requirejs/nestedDefine-four.js","mtime":0,"wrapper":"amd","format":"amd","variation":"","id":"/nestedDefine-four.js"}
require.memoize("/nestedDefine-four.js", 
// @see https://github.com/jrburke/requirejs/blob/master/tests/nestedDefine/four.js
define(['two', 'three'], function (two, three) {
    return {
        name: 'four',
        twoName: two.name,
        threeName: three.name
    };
})
, {"filename":"node_modules/pinf-it-module-insight/test/assets/requirejs/nestedDefine-four.js","variation":""});
// @pinf-bundle-module: {"file":"test/assets/modules/requirejs/mocks/nestedDefine-four.js/two.js","mtime":0,"wrapper":"amd","format":"amd","variation":"","id":"/two.js"}
require.memoize("/two.js", 
// @see https://github.com/jrburke/requirejs/blob/master/tests/nestedDefine/two.js
define({
    name: 'two'
})
, {"filename":"test/assets/modules/requirejs/mocks/nestedDefine-four.js/two.js","variation":""});
// @pinf-bundle-module: {"file":"test/assets/modules/requirejs/mocks/nestedDefine-four.js/three.js","mtime":0,"wrapper":"amd","format":"amd","variation":"","id":"/three.js"}
require.memoize("/three.js", 
define("three",[], function () {
    return {
        name: "three"
    };
})
, {"filename":"test/assets/modules/requirejs/mocks/nestedDefine-four.js/three.js","variation":""});
// @pinf-bundle-module: {"file":"","mtime":0,"wrapper":"json","format":"json","id":"/package.json"}
require.memoize("/package.json", 
{
    "main": "/nestedDefine-four.js"
}
, {"filename":"node_modules/pinf-it-module-insight/test/assets/requirejs/nestedDefine-four.js"});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}