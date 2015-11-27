
exports.forLib = function (LIB) {
    
    var exports = require("./0-common.api").forLib(LIB);

    // TODO: Load adapters as needed on demand
    exports.adapters["moment"] = require("./for/moment/0-server.api").forLib(LIB);

    return exports;
}
