
exports.forLib = function (LIB) {
    
    var exports = {};

    exports.spin = function (context) {
    
        var Request = function () {
            var self = this;
        }
        Request.prototype.get = function (uri, options) {
            options = options || {};
    
            var url = context.resolveUri(uri);
    
            var init = {
                headers: {
                    // Will cause 403 to return instead of redirect when unauthorized
                    "X-Request-Type": "background-request"
                }
            };
            LIB._.merge(init, {
                // Send cookies by default
                credentials: 'same-origin'
            });

            LIB._.merge(init, options);

            LIB._.merge(init, {
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            return window.fetch(url, init);
        }
        Request.prototype.postJSON = function (uri, options, payload) {
            options = options || {};
    
            var url = context.resolveUri(uri);
    
            var init = {
                headers: {
                    // Will cause 403 to return instead of redirect when unauthorized
                    "X-Request-Type": "background-request"
                }
            };
            LIB._.merge(init, {
                // Send cookies by default
                credentials: 'same-origin'
            });

            LIB._.merge(init, options);

            LIB._.merge(init, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: (
                    typeof payload === "string" &&
                    /^{/.test(payload)
                ) ? payload : JSON.stringify(payload)
            });

            return window.fetch(url, init);
        }

        return new Request(context);
    }

    return exports;
}
