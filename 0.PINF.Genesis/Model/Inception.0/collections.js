
exports.forLib = function (LIB) {

    const MAPPER = LIB["cores/data/for/ccjson.record.mapper/0-common.api"];

    var exports = {};

    exports.spin = function (context) {

        return {
            configPaths: {
                "Deployment": "./Deployment.0.ccjson",
                "Developer": "./Developer.0.ccjson",
                "Environment": "./Environment.0.ccjson",
                "DeploymentPointer": "./DeploymentPointer.0.ccjson",
                "Profile": "./Profile.0.ccjson",
                "Stack": "./Stack.0.ccjson"
            },
            makeCollection: function (name, config) {

                return new (MAPPER.spin(context).Collection)({
                    _modulePrefix: context.collectionPrefix,
                    _moduleLoaderPath: __filename,
                    _moduleConfig: config,
            		name: context.collectionPrefix + name,
            		record: config._meta.record || {}
                });
            }
        };
    }

    return exports;
}
