
exports.forLib = function (LIB) {
    
    var exports = {};

    exports.spin = function (context) {

        var ccjson = new LIB.ccjson();

        return ccjson.parseFile(
            context.getPath(),
            {
                env: function (name) {
                    var value = context.getEnv(name);
                    if (typeof value === "undefined") {
                        throw new Error("Environment variable '" + name + "' not set!");
                    }
                    return value;
                },
                on: {
                    fileNotFound: function (path, optional) {
                        if (optional) return null;
                        throw new Error("Config file not found: " + path);
                    }
                }
            }
        ).then(function (Config) {
    
            var config = new Config();

            return LIB.Promise.all(context.getBootInstances().map(function (instanceAlias) {
    
                return config.getInstance(instanceAlias).spin();
            }));
        });
    }

    return exports;
}