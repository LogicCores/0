
exports.forLib = function (LIB) {
    var ccjson = this;

    return LIB.Promise.resolve({
        forConfig: function (defaultConfig) {

            const SERVER_API = require("./0-server.api").forLib(LIB);

            var Entity = function (instanceConfig) {
                var self = this;

                var config = {};
                LIB._.merge(config, defaultConfig);
                LIB._.merge(config, instanceConfig);
                config = ccjson.attachDetachedFunctions(config);

                self.AspectInstance = function (aspectConfig) {
                    return LIB.Promise.resolve({
                        getConfig: function () {
                            return config;
                        }
                    });
                }
/*
                var context = config.context();
//                var api = SERVER_API.spin(context);
//                context.setAdapterAPI(api);
                context.setAspectConfig({
                    zone: config.zone
                });
*/
            }
            Entity.prototype.config = defaultConfig;

            return Entity;
        }
    });
}
