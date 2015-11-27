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
                        app: function () {

                            const EXPRESS_SESSION = require("express-session");
                            const EXPRESS_SESSION_FILE_STORE = require('session-file-store')(EXPRESS_SESSION);

                            return LIB.Promise.resolve(
                                ccjson.makeDetachedFunction(

                                    EXPRESS_SESSION(LIB._.extend(config, {
                                        store: new EXPRESS_SESSION_FILE_STORE(LIB._.extend(config.store, {
                                            path: config.store.basePath
                                        }))
                                    }))
                                )
                            );
                        }
                    });
                }
            }
            Entity.prototype.config = defaultConfig;

            return Entity;
        }
    });
}
