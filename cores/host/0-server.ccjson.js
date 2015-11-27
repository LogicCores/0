
exports.forLib = function (LIB) {
    var ccjson = this;

    return LIB.Promise.resolve({
        forConfig: function (defaultConfig) {

            var Entity = function (instanceConfig) {
                var self = this;

                self.getAt = function (path) {
                    var obj = {};
                    LIB._.merge(obj, LIB._.cloneDeep(defaultConfig));
                    LIB._.merge(obj, LIB._.cloneDeep(instanceConfig));
                    return LIB.traverse(obj).get(path);
                }
            }
            Entity.prototype.config = defaultConfig;

            return Entity;
        }
    });
}
