
exports.forLib = function (LIB) {

    return LIB.Promise.try(function () {
        
        var Context = exports.Context = function (defaults) {
            var self = this;

            // Hide property from serialization.
            self.LIB = Object.create(LIB);

            var state = {};
            LIB._.assign(state, defaults);

            self.getPath = function () {
                return state.path;
            }
            self.getEnv = function (name) {
                return state.env[name];
            }
            self.getBootInstances = function () {
                return state.boot;
            }
        }
        Context.prototype = Object.create(LIB.EventEmitter.prototype);

        // TODO: Load adapters as needed on demand
        Context.prototype.adapters = {
            "pinf.genesis.config": require("./for/pinf.genesis.config/0-server.api").forLib(LIB)
        };

        return {
            Context: Context
        };
    });
}
