
exports.forLib = function (LIB) {

    return LIB.Promise.resolve({
        forConfig: function (defaultConfig) {

            var Entity = function (instanceConfig) {
                var self = this;
                var config = {};
                LIB._.merge(config, defaultConfig)
                LIB._.merge(config, instanceConfig)

                self.AspectInstance = function (aspectConfig) {

                    return LIB.Promise.resolve({
                        decrypt: function () {

                            const PROFILE = require("../../../../lib/pio.profile/0-server.api").forLib(LIB);

                            return PROFILE.decrypt(
                                config.env,
                                JSON.stringify(aspectConfig)
                            ).then(function (aspectConfig) {
                                return JSON.parse(aspectConfig);
                            });
                        }
                    });
                }
            }
            Entity.prototype.config = defaultConfig;

            return Entity;
        }
    });
}
