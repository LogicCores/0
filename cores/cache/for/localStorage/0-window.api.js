
exports.forLib = function (LIB) {

    var exports = {};

    exports.spin = function (context) {
    
        var Store = function () {
            var self = this;

            function init() {
            	// Ensure local storage is there and hook it up to a backend if not.
                try {
                    return "localStorage" in window && window.localStorage != null;
                } catch (err) {
    
            		// TODO: Hook up to backend (via session id) if no local storage supported.
                    var data = {},
                        undef;
                    window.localStorage = {
                        setItem     : function(id, val) { return data[id] = String(val); },
                        getItem     : function(id) { return data.hasOwnProperty(id) ? data[id] : undef; },
                        removeItem  : function(id) { return delete data[id]; },
                        clear       : function() { return data = {}; }
                    };
                }
            }
            init();

            self.set = function (key, value) {
                // TODO: Warn if value is too large or use alternative method to persist state.
            	window.localStorage.setItem(key, value);
            }

            self.get = function (key) {
            	return window.localStorage.getItem(key) || null;
            }
        }

        var store = new Store();

        return store;
    }

    return exports;
}
