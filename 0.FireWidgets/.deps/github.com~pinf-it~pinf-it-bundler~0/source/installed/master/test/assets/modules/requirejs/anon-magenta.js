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
// @pinf-bundle-module: {"file":"node_modules/pinf-it-module-insight/test/assets/requirejs/anon-magenta.js","mtime":0,"wrapper":"amd","format":"amd","variation":"","id":"/anon-magenta.js"}
require.memoize("/anon-magenta.js", 
// @see https://github.com/jrburke/requirejs/blob/master/tests/anon/magenta.js
define(['require','exports','module','red','./blue','text!./message.txt'],function (require, exports, module) {
    //This is a fakeout require("fake1");

    var red = require("red"),
        blue = require('./blue'),
        message = require('text!./message.txt');

    /*
     And another fakeoute require("fake2");
    */

    //Use ugly exports
    exports.name = red.name + blue.name;
    exports.path = require.toUrl('./foo.html');
    exports.message = message;
})
, {"filename":"node_modules/pinf-it-module-insight/test/assets/requirejs/anon-magenta.js","variation":""});
// @pinf-bundle-module: {"file":"test/assets/modules/requirejs/mocks/anon-magenta.js/red.js","mtime":0,"wrapper":"amd","format":"amd","variation":"","id":"/red.js"}
require.memoize("/red.js", 
// @see https://github.com/jrburke/requirejs/blob/master/tests/anon/red.js
define("red",[], function () {
    return {
        name: "red"
    };
})
, {"filename":"test/assets/modules/requirejs/mocks/anon-magenta.js/red.js","variation":""});
// @pinf-bundle-module: {"file":"test/assets/modules/requirejs/mocks/anon-magenta.js/blue.js","mtime":0,"wrapper":"amd","format":"amd","variation":"","id":"/blue.js"}
require.memoize("/blue.js", 
// @see https://github.com/jrburke/requirejs/blob/master/tests/anon/blue.js
define([],function () {
    return {
        name: "blue"
    };
})
, {"filename":"test/assets/modules/requirejs/mocks/anon-magenta.js/blue.js","variation":""});
// @pinf-bundle-module: {"file":"test/assets/modules/requirejs/mocks/anon-magenta.js/message.txt","mtime":0,"wrapper":"url-encoded","format":"utf8","variation":"","id":"/message.txt"}
require.memoize("/message.txt", 
'hello%20world'
, {"filename":"test/assets/modules/requirejs/mocks/anon-magenta.js/message.txt","variation":""});
// @pinf-bundle-module: {"file":"","mtime":0,"wrapper":"json","format":"json","id":"/package.json"}
require.memoize("/package.json", 
{
    "main": "/anon-magenta.js"
}
, {"filename":"node_modules/pinf-it-module-insight/test/assets/requirejs/anon-magenta.js"});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}