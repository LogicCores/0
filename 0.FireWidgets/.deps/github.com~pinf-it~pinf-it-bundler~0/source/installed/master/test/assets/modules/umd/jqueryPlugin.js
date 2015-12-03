// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-header: {"helper":"amd-ish"}
function wrapAMD(callback) {
    var amdRequireImplementation = null;
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
    var exports = null;
    function wrappedDefine() {
        exports = define.apply(null, arguments);
    }
    wrappedDefine.amd = { jQuery: true };
    function amdRequire() {
        return amdRequireImplementation.apply(null, arguments);
    }
    amdRequire.def = wrappedDefine
    callback.call(_____bundle_global || (typeof "global" !== "undefined" && global) || {}, amdRequire, wrappedDefine);
    return exports;
}
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
// @pinf-bundle-module: {"file":"node_modules/pinf-it-module-insight/test/assets/umd/jqueryPlugin.js","mtime":0,"wrapper":"amd-ish","format":"amd-ish","variation":"","id":"/jqueryPlugin.js"}
require.memoize("/jqueryPlugin.js", 
wrapAMD(function(require, define) {
// @see https://github.com/umdjs/umd/blob/master/jqueryPlugin.js
// Uses AMD or browser globals to create a jQuery plugin.

// It does not try to register in a CommonJS environment since
// jQuery is not likely to run in those environments.
// See jqueryPluginCommonJs.js for that version.

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    $.fn.jqueryPlugin = {};
    return $;
}));

})
, {"filename":"node_modules/pinf-it-module-insight/test/assets/umd/jqueryPlugin.js","variation":""});
// @pinf-bundle-module: {"file":"test/assets/modules/umd/mocks/jqueryPlugin.js/jquery.js","mtime":0,"wrapper":"amd","format":"amd","variation":"","id":"/jquery.js"}
require.memoize("/jquery.js", 
define([],function() {
	return {
		fn: {},
		STRING: "string-value",
        OBJECT: {
            id: "object-value"
        }
	};
})
, {"filename":"test/assets/modules/umd/mocks/jqueryPlugin.js/jquery.js","variation":""});
// @pinf-bundle-module: {"file":"","mtime":0,"wrapper":"json","format":"json","id":"/package.json"}
require.memoize("/package.json", 
{
    "main": "/jqueryPlugin.js"
}
, {"filename":"node_modules/pinf-it-module-insight/test/assets/umd/jqueryPlugin.js"});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}