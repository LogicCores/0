
// TODO: Fix for IE8
// @bug https://github.com/systemjs/systemjs/issues/745
//const System = require("systemjs/dist/system.src.js");
;({"APPEND_AS_GLOBAL":"cores/load/for/systemjs/node_modules/systemjs/dist/system-polyfills.src.js"});
;({"APPEND_AS_GLOBAL":"cores/load/for/systemjs/node_modules/systemjs/dist/system.src.js"});


exports.load = function (uri) {

    return window.System.import(uri);
}
