// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-module: {"file":"/02-LoaderFeatures/05-CrossPackageDependencies/main.js","fileMtime":1329109242000,"id":"/main.js"}
require.memoize("/main.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "/main.js";
    var __dirname = require.sandbox.id + "";
    
    // One-way dependency.
    var GREETINGS = require("helpers/greetings"),
        LOGGER = require("helpers/logger");
    
    exports.main = function(options)
    {
        LOGGER.log(GREETINGS.getGreeting());
    }
    
}
, {});
// @pinf-bundle-module: {"file":"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA/greetings.js","fileMtime":1329112860000,"id":"9600bb1b572fba81a38e7d3c0eb638268e6a9d8d/greetings.js"}
require.memoize("9600bb1b572fba81a38e7d3c0eb638268e6a9d8d/greetings.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "9600bb1b572fba81a38e7d3c0eb638268e6a9d8d/greetings.js";
    var __dirname = require.sandbox.id + "/9600bb1b572fba81a38e7d3c0eb638268e6a9d8d";
    
    var HELLO = require("package/hello");
    
    exports.getGreeting = function()
    {
        return HELLO.getWord() + " from " + HELLO.getName() + "!";
    }
    
    exports.getName = function()
    {
        return "05-CrossPackageDependencies";
    }
    
}
, {"filename":"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA/greetings.js"});
// @pinf-bundle-module: {"file":"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA/logger.js","fileMtime":1329109140000,"id":"9600bb1b572fba81a38e7d3c0eb638268e6a9d8d/logger.js"}
require.memoize("9600bb1b572fba81a38e7d3c0eb638268e6a9d8d/logger.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "9600bb1b572fba81a38e7d3c0eb638268e6a9d8d/logger.js";
    var __dirname = require.sandbox.id + "/9600bb1b572fba81a38e7d3c0eb638268e6a9d8d";
    
    exports.log = function(message)
    {
        module.log(message);
    }
    
}
, {});
// @pinf-bundle-module: {"file":"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageB/words/hello.js","fileMtime":1329109182000,"id":"80b6bcb59fc2b65675648d0e052b75b4620764ee/words/hello.js"}
require.memoize("80b6bcb59fc2b65675648d0e052b75b4620764ee/words/hello.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "80b6bcb59fc2b65675648d0e052b75b4620764ee/words/hello.js";
    var __dirname = require.sandbox.id + "/80b6bcb59fc2b65675648d0e052b75b4620764ee/words";
    
    var GREETINGS = require("package/greetings");
    
    exports.getWord = function()
    {
        return require("letters/H").getLetter() + "ello";
    }
    
    exports.getName = function()
    {
        return GREETINGS.getName();
    }
    
}
, {});
// @pinf-bundle-module: {"file":"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageC/H.js","fileMtime":1329109235000,"id":"aa0b8cfbcfff960996a8692caee6ae43f33d6a67/H.js"}
require.memoize("aa0b8cfbcfff960996a8692caee6ae43f33d6a67/H.js", 
function(require, exports, module)
{
    var __filename = require.sandbox.id + "aa0b8cfbcfff960996a8692caee6ae43f33d6a67/H.js";
    var __dirname = require.sandbox.id + "/aa0b8cfbcfff960996a8692caee6ae43f33d6a67";
    
    exports.getLetter = function()
    {
        return "H";
    }
    
}
, {});
// @pinf-bundle-descriptor: {"file":"/02-LoaderFeatures/05-CrossPackageDependencies/package.json","id":"/package.json"}
require.memoize("/package.json", 
{"main":"/main.js","mappings":{"helpers":"9600bb1b572fba81a38e7d3c0eb638268e6a9d8d"},"directories":{"lib":""}}
, {});
// @pinf-bundle-descriptor: {"file":"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA/package.json","id":"9600bb1b572fba81a38e7d3c0eb638268e6a9d8d/package.json"}
require.memoize("9600bb1b572fba81a38e7d3c0eb638268e6a9d8d/package.json", 
{"mappings":{"package":"80b6bcb59fc2b65675648d0e052b75b4620764ee"},"directories":{"lib":""}}
, {});
// @pinf-bundle-descriptor: {"file":"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageB/package.json","id":"80b6bcb59fc2b65675648d0e052b75b4620764ee/package.json"}
require.memoize("80b6bcb59fc2b65675648d0e052b75b4620764ee/package.json", 
{"mappings":{"package":"9600bb1b572fba81a38e7d3c0eb638268e6a9d8d","letters":"aa0b8cfbcfff960996a8692caee6ae43f33d6a67"},"directories":{"lib":"words"}}
, {});
// @pinf-bundle-descriptor: {"file":"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageC/package.json","id":"aa0b8cfbcfff960996a8692caee6ae43f33d6a67/package.json"}
require.memoize("aa0b8cfbcfff960996a8692caee6ae43f33d6a67/package.json", 
{"directories":{"lib":""},"mappings":{}}
, {});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {"sourceReport":{"mainPackage":"/02-LoaderFeatures/05-CrossPackageDependencies","packages":{"/02-LoaderFeatures/05-CrossPackageDependencies":{"mainModule":{"path":"/02-LoaderFeatures/05-CrossPackageDependencies/main.js"},"modules":{"/02-LoaderFeatures/05-CrossPackageDependencies/main.js":{"staticLinks":{"helpers/greetings":"helpers/greetings","helpers/logger":"helpers/logger"},"dynamicLinks":{},"fileMtime":1329109242000,"treatAs":"js-module"}},"mappings":{"helpers":"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA"}},"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA":{"mainModule":{},"modules":{"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA/greetings.js":{"staticLinks":{"package/hello":"package/hello"},"dynamicLinks":{},"fileMtime":1329112860000,"treatAs":"js-module"},"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA/logger.js":{"staticLinks":{},"dynamicLinks":{},"fileMtime":1329109140000,"treatAs":"js-module"}},"mappings":{"package":"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageB"}},"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageB":{"mainModule":{},"modules":{"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageB/words/hello.js":{"staticLinks":{"package/greetings":"package/greetings","letters/H":"letters/H"},"dynamicLinks":{},"fileMtime":1329109182000,"treatAs":"js-module"}},"mappings":{"package":"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA","letters":"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageC"}},"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageC":{"mainModule":{},"modules":{"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageC/H.js":{"staticLinks":{},"dynamicLinks":{},"fileMtime":1329109235000,"treatAs":"js-module"}},"mappings":{}}}},"mappedReport":{"mainPackage":"/02-LoaderFeatures/05-CrossPackageDependencies","packages":{"/02-LoaderFeatures/05-CrossPackageDependencies":{"mainModule":{"path":"/02-LoaderFeatures/05-CrossPackageDependencies/main.js"},"modules":{"/02-LoaderFeatures/05-CrossPackageDependencies/main.js":{"staticLinks":{"helpers/greetings":"helpers/greetings","helpers/logger":"helpers/logger"},"dynamicLinks":{},"fileMtime":1329109242000,"treatAs":"js-module"}},"mappings":{"helpers":"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA"}},"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA":{"mainModule":{},"modules":{"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA/greetings.js":{"staticLinks":{"package/hello":"package/hello"},"dynamicLinks":{},"fileMtime":1329112860000,"treatAs":"js-module"},"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA/logger.js":{"staticLinks":{},"dynamicLinks":{},"fileMtime":1329109140000,"treatAs":"js-module"}},"mappings":{"package":"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageB"}},"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageB":{"mainModule":{},"modules":{"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageB/words/hello.js":{"staticLinks":{"package/greetings":"package/greetings","letters/H":"letters/H"},"dynamicLinks":{},"fileMtime":1329109182000,"treatAs":"js-module"}},"mappings":{"package":"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA","letters":"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageC"}},"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageC":{"mainModule":{},"modules":{"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageC/H.js":{"staticLinks":{},"dynamicLinks":{},"fileMtime":1329109235000,"treatAs":"js-module"}},"mappings":{}}}},"bundleReport":{"mainBundle":"/04-PlatformFeatures/02-BundlerMiddleware/dist/05-CrossPackageDependencies.js","packages":{"9600bb1b572fba81a38e7d3c0eb638268e6a9d8d":"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA","80b6bcb59fc2b65675648d0e052b75b4620764ee":"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageB","aa0b8cfbcfff960996a8692caee6ae43f33d6a67":"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageC"},"modules":{"/main.js":"/02-LoaderFeatures/05-CrossPackageDependencies/main.js","9600bb1b572fba81a38e7d3c0eb638268e6a9d8d/greetings.js":"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA/greetings.js","9600bb1b572fba81a38e7d3c0eb638268e6a9d8d/logger.js":"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageA/logger.js","80b6bcb59fc2b65675648d0e052b75b4620764ee/words/hello.js":"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageB/words/hello.js","aa0b8cfbcfff960996a8692caee6ae43f33d6a67/H.js":"/02-LoaderFeatures/05-CrossPackageDependencies/packages/packageC/H.js"}}}