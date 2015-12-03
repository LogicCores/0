
;({"APPEND_AS_GLOBAL":"cores/load/for/requirejs/node_modules/requirejs/require.js"});

exports.forLib = function (LIB) {
    
    var exports = {};

    exports.load = function (uri) {
    
        return new LIB.Promise(function (resolve, reject) {
    
            return window.requirejs([
                uri
            ], function (exports) {
    
                return resolve(exports);
            }, reject);
        });
    
    }

    return exports;
}
