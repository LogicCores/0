
exports.forLib = function (LIB) {

    var exports = {};

    exports.forContexts = function (contexts) {

        var Context = exports.Context = function (defaults) {
            var self = this;

            var state = {
            };
            LIB._.merge(state, LIB._.cloneDeep(defaults));

        }
        Context.prototype = Object.create(LIB.EventEmitter.prototype);
        Context.prototype.contexts = contexts;

        return {
            Context: Context,
            adapters: {}
        };
    }

    return exports;
}
