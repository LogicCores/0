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
    callback(amdRequire, wrappedDefine);
    return exports;
}
// @pinf-bundle-module: {"file":"node_modules/pinf-it-module-insight/test/assets/various/shim-array.js","mtime":0,"wrapper":"commonjs/leaky","format":"leaky","variation":"","id":"/shim-array.js"}
require.memoize("/shim-array.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'node_modules/pinf-it-module-insight/test/assets/various';
// @see https://github.com/kriskowal/collections/blob/d1420a5ed0cc1a9d1ba3bb0d8122414141828424/shim-array.js

"use strict";

/*
    Based in part on extras from Motorola Mobility’s Montage
    Copyright (c) 2012, Motorola Mobility LLC. All Rights Reserved.
    3-Clause BSD License
    https://github.com/motorola-mobility/montage/blob/master/LICENSE.md
*/

var Function = require("./shim-function");
var GenericCollection = require("./generic-collection");
var GenericOrder = require("./generic-order");
var WeakMap = require("weak-map");

module.exports = Array;

Array.empty = [];

if (Object.freeze) {
    Object.freeze(Array.empty);
}

Array.from = function (values) {
    var array = [];
    array.addEach(values);
    return array;
};

Array.unzip = function (table) {
    var transpose = [];
    var length = Infinity;
    // compute shortest row
    for (var i = 0; i < table.length; i++) {
        var row = table[i];
        table[i] = row.toArray();
        if (row.length < length) {
            length = row.length;
        }
    }
    for (var i = 0; i < table.length; i++) {
        var row = table[i];
        for (var j = 0; j < row.length; j++) {
            if (j < length && j in row) {
                transpose[j] = transpose[j] || [];
                transpose[j][i] = row[j];
            }
        }
    }
    return transpose;
};

function define(key, value) {
    Object.defineProperty(Array.prototype, key, {
        value: value,
        writable: true,
        configurable: true,
        enumerable: false
    });
}

// ...

function ArrayIterator(array, start, end) {
    this.array = array;
    this.start = start == null ? 0 : start;
    this.end = end;
};

ArrayIterator.prototype.next = function () {
    if (this.start === (this.end == null ? this.array.length : this.end)) {
        throw StopIteration;
    } else {
        return this.array[this.start++];
    }
};


return {
    Function: (typeof Function !== "undefined") ? Function : null,
    require: (typeof require !== "undefined") ? require : null,
    GenericCollection: (typeof GenericCollection !== "undefined") ? GenericCollection : null,
    GenericOrder: (typeof GenericOrder !== "undefined") ? GenericOrder : null,
    WeakMap: (typeof WeakMap !== "undefined") ? WeakMap : null,
    module: (typeof module !== "undefined") ? module : null,
    Array: (typeof Array !== "undefined") ? Array : null,
    Object: (typeof Object !== "undefined") ? Object : null,
    define: (typeof define !== "undefined") ? define : null,
    ArrayIterator: (typeof ArrayIterator !== "undefined") ? ArrayIterator : null
};
}
, {"filename":"node_modules/pinf-it-module-insight/test/assets/various/shim-array.js","variation":""});
// @pinf-bundle-module: {"file":"test/assets/modules/various/mocks/shim-array.js/shim-function.js","mtime":0,"wrapper":"commonjs/encapsulated","format":"encapsulated","variation":"","id":"/shim-function.js"}
require.memoize("/shim-function.js", 
function(require, exports, module) {

}
, {"filename":"test/assets/modules/various/mocks/shim-array.js/shim-function.js","variation":""});
// @pinf-bundle-module: {"file":"test/assets/modules/various/mocks/shim-array.js/generic-collection.js","mtime":0,"wrapper":"commonjs/encapsulated","format":"encapsulated","variation":"","id":"/generic-collection.js"}
require.memoize("/generic-collection.js", 
function(require, exports, module) {

}
, {"filename":"test/assets/modules/various/mocks/shim-array.js/generic-collection.js","variation":""});
// @pinf-bundle-module: {"file":"test/assets/modules/various/mocks/shim-array.js/generic-order.js","mtime":0,"wrapper":"commonjs/encapsulated","format":"encapsulated","variation":"","id":"/generic-order.js"}
require.memoize("/generic-order.js", 
function(require, exports, module) {

}
, {"filename":"test/assets/modules/various/mocks/shim-array.js/generic-order.js","variation":""});
// @pinf-bundle-module: {"file":"test/assets/modules/various/mocks/shim-array.js/weak-map.js","mtime":0,"wrapper":"commonjs/encapsulated","format":"encapsulated","variation":"","id":"/weak-map.js"}
require.memoize("/weak-map.js", 
function(require, exports, module) {

}
, {"filename":"test/assets/modules/various/mocks/shim-array.js/weak-map.js","variation":""});
// @pinf-bundle-module: {"file":"","mtime":0,"wrapper":"json","format":"json","id":"/package.json"}
require.memoize("/package.json", 
{
    "main": "/shim-array.js"
}
, {"filename":"node_modules/pinf-it-module-insight/test/assets/various/shim-array.js"});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}