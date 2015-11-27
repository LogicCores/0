
exports.forLib = function (LIB) {
    var ccjson = this;

    return LIB.Promise.resolve({
        forConfig: function (defaultConfig) {

            var Entity = function (instanceConfig) {
                var self = this;

                var config = {};
                LIB._.merge(config, defaultConfig);
                LIB._.merge(config, instanceConfig);
                config = ccjson.attachDetachedFunctions(config);
                

                if (config.apis) {
                    Object.keys(config.apis).forEach(function (alias) {
                        // We only load the configured API if not already found.
                        // TODO: Support flag to force-override.
                        if (typeof LIB[alias] !== "undefined") return;

                        LIB[alias] = require(config.apis[alias]);
                    });
                }
            }
            Entity.prototype.config = defaultConfig;

            return Entity;
        }
    });
}
