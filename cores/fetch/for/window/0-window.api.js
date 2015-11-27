
exports.forLib = function (LIB) {
    
    var exports = {};

    exports.spin = function (context) {
    
        var Fetch = function () {
            var self = this;
        }
        Fetch.prototype.fetch = function (uri, options) {
            options = options || {};
    
            var url = context.resolveUri(uri);
    
            var init = {
                headers: {
                    // Will cause 403 to return instead of redirect when unauthorized
                    "X-Request-Type": "background-fetch"
                }
            };
            LIB._.merge(init, {
                // Send cookies by default
                credentials: 'same-origin'
            });
            LIB._.merge(init, options);
    
            return window.fetch(url, init);
        }
    
        return new Fetch(context);
    }

    return exports;
}
