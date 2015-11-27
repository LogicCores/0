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
// @pinf-bundle-module: {"file":"node_modules/pinf-it-module-insight/test/assets/various/universal-module.js","mtime":0,"wrapper":"amd-ish","format":"amd-ish","variation":"","id":"/universal-module.js"}
require.memoize("/universal-module.js", 
wrapAMD(function(require, define) {
// @see https://gist.github.com/kitcambridge/1251221
(function (root, Library) {
  // The square bracket notation is used to avoid property munging by the Closure Compiler.
  if (typeof define == "function" && typeof define["amd"] == "object" && define["amd"]) {
    // Export for asynchronous module loaders (e.g., RequireJS, `curl.js`).
    define(["exports"], Library);
  } else {
    // Export for CommonJS environments, web browsers, and JavaScript engines.
    Library = Library(typeof exports == "object" && exports || (root["Library"] = {
      "noConflict": (function (original) {
        function noConflict() {
          root["Library"] = original;
          // `noConflict` can't be invoked more than once.
          delete Library.noConflict;
          return Library;
        }
        return noConflict;
      })(root["Library"])
    }));
  }
})(this, function (exports) {
  exports.STRING = "string-value";
  exports.OBJECT = {
      id: "object-value"
  };
  return exports;
});
})
, {"filename":"node_modules/pinf-it-module-insight/test/assets/various/universal-module.js","variation":""});
// @pinf-bundle-module: {"file":"","mtime":0,"wrapper":"json","format":"json","id":"/package.json"}
require.memoize("/package.json", 
{
    "main": "/universal-module.js"
}
, {"filename":"node_modules/pinf-it-module-insight/test/assets/various/universal-module.js"});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}