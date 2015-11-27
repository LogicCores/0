
exports.forLib = function (LIB) {
    
    var exports = {};

    require("../../../../lib/pinf-loader-js");
    
    exports.load = function (uri) {
    
        return new LIB.Promise(function (resolve, reject) {
    
            return window.PINF.sandbox(uri, function (sandbox) {
    
                return resolve(sandbox);
            }, reject);
        });
    
    }

    return exports;
}
