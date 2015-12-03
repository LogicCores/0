
exports.forLib = function (LIB) {

    var superExports = require("./0-common.api").forLib(LIB);
    
    var exports = {};
    
    exports.forContexts = function (contexts) {
        var exports = superExports.forContexts(contexts);

        // TODO: Load adapters as needed by declaration
        exports.adapters["logic.cores"] = require("./for/logic.cores/0-server.api").forLib(LIB);
        
        return exports;
    }

    return exports;
}
