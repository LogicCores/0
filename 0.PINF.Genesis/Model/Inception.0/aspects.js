
exports.forLib = function (LIB) {

    var Aspects = function () {
        var self = this;

        var aspects = {};

        self.register = function (aspect) {
            
            var meta = aspect["_meta"];
            delete aspect["_meta"];
            
            if (!aspects[meta.aspect]) {
                aspects[meta.aspect] = {
                    "_meta": meta,
                    "_instances": {}
                };
            }
            var instance = aspects[meta.aspect]["_instances"][aspect[meta.keyProperty]];
            if (!instance) {
                instance = aspects[meta.aspect]["_instances"][aspect[meta.keyProperty]] = {
                    "_segments": []
                };
            }

            Object.keys(aspect).forEach(function (name) {
                if (name === "$alias") return;
                if (!meta.record || !meta.record[name]) {
                    console.error("Warning: Field '" + name + "' for model '" + meta.aspect + "' not declared! Ignoring.");
                    return;
                }
                instance[name] = aspect[name];
            });

            instance["_segments"].push(aspect);
        }

        self.getAspect = function (aspectName) {
            return aspects[aspectName];
        }
    }

    return {
        Aspects: Aspects
    };
}
