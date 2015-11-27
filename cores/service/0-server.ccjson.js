
exports.forLib = function (LIB) {
    var ccjson = this;

    return LIB.Promise.resolve({
        forConfig: function (defaultConfig) {

            var Entity = function (instanceConfig) {
                var self = this;

                self.AspectInstance = function (aspectConfig) {

                    var config = {};
                    LIB._.merge(config, defaultConfig);
                    LIB._.merge(config, instanceConfig);
                    LIB._.merge(config, aspectConfig);
                    config = ccjson.attachDetachedFunctions(config);

                    return LIB.Promise.resolve({
                        getClientConfig: function () {
                            return config.publishable;
                        },
                        getServerConfig: function () {
                            var merged = {};
                            LIB._.merge(merged, LIB._.clone(config.publishable));
                            LIB._.merge(merged, LIB._.clone(config.secrets));
                            return merged;
                        }
                    });
                }
            }
            Entity.prototype.config = defaultConfig;

            return Entity;
        }
    });
}
