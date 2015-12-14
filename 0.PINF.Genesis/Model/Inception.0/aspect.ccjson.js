
exports.forLib = function (LIB) {
    var ccjson = this;
    
    const ASPECTS = require("./aspects").forLib(LIB);
    
    var aspects = new ASPECTS.Aspects();

    return LIB.Promise.resolve({
        forConfig: function (defaultConfig) {

            var Entity = function (instanceConfig) {
                var self = this;

                var config = {};
                LIB._.merge(config, defaultConfig);
                LIB._.merge(config, instanceConfig);
                config = ccjson.attachDetachedFunctions(config);

                if (config["_meta"]) {
                    aspects.register(config);
                } else
                if (config.context) {

                    var context = config.context();
                    var api = {
                        getAspect: function (name) {
                            return aspects.getAspect(name) || {};
                        },
                        getCollectionRecords: function (name) {
                            var aspect = api.getAspect(name);
                            var records = [];
                            if (aspect._instances) {
                                Object.keys(aspect._instances).forEach(function (id) {
                                    var record = {
                                        "id": id
                                    };
                                    Object.keys(aspect._meta.record).forEach(function (name) {
                                        if (typeof aspect._instances[id][name] === "undefined") return;
                                        record[name] = aspect._instances[id][name];
                                    });
                                    records.push(record);
                                });
                            }
                            return records;
                        }
                    };
                    context.setAdapterAPI(api);
                }

                self.AspectInstance = function (aspectConfig) {
    
                    var config = {};
                    LIB._.merge(config, defaultConfig);
                    LIB._.merge(config, instanceConfig);
                    LIB._.merge(config, aspectConfig);
                    config = ccjson.attachDetachedFunctions(config);

//console.log("####MODEL ASPECT INSTANCE", config);

                    return LIB.Promise.resolve({
                        get: function () {
                            return config;
                        },
                        app: function () {
                            return LIB.Promise.resolve(
                                ccjson.makeDetachedFunction(
                                    function (req, res, next) {

                                        // TODO: Relocate into generic helper.
                                        var expression = new RegExp(config.match.replace(/\//g, "\\/"));
                                        var m = expression.exec(req.params[0]);
                                        if (!m) return next();
                                        var uri = m[1];
                                        
                                        var uriParts = uri.match(/^\/(.+)\.json$/);
                                        if (uriParts) {

                                            var payload = aspects.getAspect(uriParts[1]) || {};

                                            res.writeHead(200, {
                                                "Content-Type": "application/json"
                                            });
                                            res.end(JSON.stringify(payload, null, 4));
                                            return;
                                        } else {
                                            return next(new Error("Unrecognized URI format '" + uri + "'"));
                                        }
                                    }
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
