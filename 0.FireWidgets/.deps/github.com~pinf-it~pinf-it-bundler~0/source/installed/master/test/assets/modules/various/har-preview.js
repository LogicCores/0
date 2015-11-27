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
// @pinf-bundle-module: {"file":"node_modules/pinf-it-module-insight/test/assets/various/har-preview.js","mtime":0,"wrapper":"amd","format":"amd","variation":"","id":"/har-preview.js"}
require.memoize("/har-preview.js", 
/* See license.txt for terms of usage */

require.def("harPreview", [
    "preview/requestList",
    "preview/pageList",
    "preview/harModel",
    "core/lib",
    "core/trace",
    "preview/menu",
    "preview/validationError",
    "i18n!nls/harPreview"
],

function(RequestList, PageList, HarModel, Lib, Trace, Menu, ValidationError, Strings) {

//*************************************************************************************************
// The Preview Application

function HarPreview()
{
    this.id = "harPreview";

    this.model = new HarModel();
}

HarPreview.prototype =
{
    initialize: function(content)
    {
        this.topMenu = new Menu()
        this.topMenu.render(content);

        // Auto load all HAR files specified in the URL.
        var okCallback = Lib.bind(this.appendPreview, this);
        var errorCallback = Lib.bind(this.onError, this);
        HarModel.Loader.run(okCallback, errorCallback);
    },

    appendPreview: function(jsonString)
    {
        try
        {
            var validate = true;
            var param = Lib.getURLParameter("validate");
            if (param == "false")
                validate = false;

            var input = HarModel.parse(jsonString, validate);
            this.model.append(input);

            var pageList = new PageList(input);
            pageList.render(content);

            Lib.fireEvent(content, "onPreviewHARLoaded");
        }
        catch (err)
        {
            Trace.exception("HarPreview.appendPreview; EXCEPTION ", err);

            ValidationError.appendError(err, content);
        }
    },

    onError: function(response, ioArgs)
    {
        Trace.log("HarPreview; Load error ", response, ioArgs);
    },

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
    // Loading HAR files

    /**
     * Load HAR file. See {@link HarView.loadHar} for documentation.
     */ 
    loadHar: function(url, settings)
    {
        settings = settings || {};
        return HarModel.Loader.load(this, url,
            settings.jsonp,
            settings.jsonpCallback,
            settings.success,
            settings.ajaxError);
    },

    setPreviewColumns: function(cols, avoidCookies)
    {
        RequestList.setVisibleColumns(cols, avoidCookies);
    }
}

//*************************************************************************************************
// Initialization
/*
var content = document.getElementById("content");
var harPreview = content.repObject = new HarPreview();

// Fire some events for listeners. This is useful for extending/customizing the viewer.
Lib.fireEvent(content, "onPreviewPreInit");
harPreview.initialize(content);
Lib.fireEvent(content, "onPreviewInit");

Trace.log("HarPreview; initialized OK");
*/
//*************************************************************************************************

    return {
        STRING: "string-value",
        OBJECT: {
            id: "object-value"
        }
    };
})
, {"filename":"node_modules/pinf-it-module-insight/test/assets/various/har-preview.js","variation":""});
// @pinf-bundle-module: {"file":"","mtime":0,"wrapper":"json","format":"json","id":"/package.json"}
require.memoize("/package.json", 
{
    "main": "/har-preview.js"
}
, {"filename":"node_modules/pinf-it-module-insight/test/assets/various/har-preview.js"});
// @pinf-bundle-module: {"file":"test/assets/modules/various/mocks/har-preview.js/preview+requestList.js","mtime":0,"wrapper":"commonjs/encapsulated","format":"encapsulated","variation":"","id":"/preview/requestList.js"}
require.memoize("/preview/requestList.js", 
function(require, exports, module) {

}
, {"filename":"test/assets/modules/various/mocks/har-preview.js/preview+requestList.js","variation":""});
// @pinf-bundle-module: {"file":"test/assets/modules/various/mocks/har-preview.js/preview+pageList.js","mtime":0,"wrapper":"commonjs/encapsulated","format":"encapsulated","variation":"","id":"/preview/pageList.js"}
require.memoize("/preview/pageList.js", 
function(require, exports, module) {

}
, {"filename":"test/assets/modules/various/mocks/har-preview.js/preview+pageList.js","variation":""});
// @pinf-bundle-module: {"file":"test/assets/modules/various/mocks/har-preview.js/preview+harModel.js","mtime":0,"wrapper":"amd","format":"amd","variation":"","id":"/preview/harModel.js"}
require.memoize("/preview/harModel.js", 

define([],function () {
	return function () {		
	};
})
, {"filename":"test/assets/modules/various/mocks/har-preview.js/preview+harModel.js","variation":""});
// @pinf-bundle-module: {"file":"test/assets/modules/various/mocks/har-preview.js/core+lib.js","mtime":0,"wrapper":"commonjs/encapsulated","format":"encapsulated","variation":"","id":"/core/lib.js"}
require.memoize("/core/lib.js", 
function(require, exports, module) {

}
, {"filename":"test/assets/modules/various/mocks/har-preview.js/core+lib.js","variation":""});
// @pinf-bundle-module: {"file":"test/assets/modules/various/mocks/har-preview.js/core+trace.js","mtime":0,"wrapper":"commonjs/encapsulated","format":"encapsulated","variation":"","id":"/core/trace.js"}
require.memoize("/core/trace.js", 
function(require, exports, module) {

}
, {"filename":"test/assets/modules/various/mocks/har-preview.js/core+trace.js","variation":""});
// @pinf-bundle-module: {"file":"test/assets/modules/various/mocks/har-preview.js/preview+menu.js","mtime":0,"wrapper":"commonjs/encapsulated","format":"encapsulated","variation":"","id":"/preview/menu.js"}
require.memoize("/preview/menu.js", 
function(require, exports, module) {

}
, {"filename":"test/assets/modules/various/mocks/har-preview.js/preview+menu.js","variation":""});
// @pinf-bundle-module: {"file":"test/assets/modules/various/mocks/har-preview.js/preview+validationError.js","mtime":0,"wrapper":"commonjs/encapsulated","format":"encapsulated","variation":"","id":"/preview/validationError.js"}
require.memoize("/preview/validationError.js", 
function(require, exports, module) {

}
, {"filename":"test/assets/modules/various/mocks/har-preview.js/preview+validationError.js","variation":""});
// @pinf-bundle-module: {"file":"test/assets/modules/various/mocks/har-preview.js/nls+harPreview.js","mtime":0,"wrapper":"commonjs/encapsulated","format":"encapsulated","variation":"","id":"/nls/harPreview.js"}
require.memoize("/nls/harPreview.js", 
function(require, exports, module) {

}
, {"filename":"test/assets/modules/various/mocks/har-preview.js/nls+harPreview.js","variation":""});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}