// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-header: {}
function define(id, dependencies, moduleInitializer)
{
    return function(require, exports, module) {
        if (typeof moduleInitializer === "function") {
            return moduleInitializer.apply(moduleInitializer, dependencies.map(function(name) {
                if (name === "require") return require;
                if (name === "exports") return exports;
                if (name === "module") return module;
                return require(name);
            }))
        } else
        if (typeof dependencies === "object") {
            return dependencies;
        }
    }
}
// @pinf-bundle-module: {"file":"/modules/main.js","fileMtime":1329952704000,"id":"/main.js"}
require.memoize("/main.js", 
define('',["./greeting"], function(GREETING)
{
    return {
        main: function()
        {
            console.log(GREETING.getGreeting());
        }
    };
})
, {});
// @pinf-bundle-module: {"file":"/modules/greeting.js","fileMtime":1329955170000,"id":"/greeting.js"}
require.memoize("/greeting.js", 
define('',['require','exports','module'],function(require, exports, module)
{
    exports.getGreeting = function()
    {
        return "Hello from 01-RequireJSModulesToBrowser!";
    }
})
, {});
// @pinf-bundle-descriptor: {"file":"/modules/package.json","id":"/package.json"}
require.memoize("/package.json", 
{"main":"/main.js","directories":{"lib":""},"mappings":{}}
, {});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {"sourceReport":{"mainPackage":"/modules","packages":{"/modules":{"mainModule":{"path":"/modules/main.js"},"modules":{"/modules/main.js":{"staticLinks":{"./greeting":"./greeting"},"fileMtime":1329952704000,"treatAs":"js-module"},"/modules/greeting.js":{"staticLinks":{},"fileMtime":1329955170000,"treatAs":"js-module"}},"mappings":{}}}},"mappedReport":{"mainPackage":"/modules","packages":{"/modules":{"mainModule":{"path":"/modules/main.js"},"modules":{"/modules/main.js":{"staticLinks":{"./greeting":"./greeting"},"fileMtime":1329952704000,"treatAs":"js-module"},"/modules/greeting.js":{"staticLinks":{},"fileMtime":1329955170000,"treatAs":"js-module"}},"mappings":{}}}},"bundleReport":{"mainBundle":"/dist/modules.js","packages":{},"modules":{"/main.js":"/modules/main.js","/greeting.js":"/modules/greeting.js"}}}