
exports.forLib = function (LIB) {

    var exports = {};

    exports.spin = function (context) {
        
        var SMS = function () {
            var self = this;

            self.send = function (messageOverrides) {
    
    			return LIB.Promise.promisify(function (callback) {

    				if (context.config.enabled === false) {
    					console.log("Skip sending twilio sms message due to 'enabled === false'");
    					return callback(null);
    				}

    				LIB.assert(typeof context.config.twilio.credentials.accountSid, "string");
    				LIB.assert(typeof context.config.twilio.credentials.authToken, "string");

                    const TWILIO = require("twilio");

    				var client = TWILIO(context.config.twilio.credentials.accountSid, context.config.twilio.credentials.authToken);

    				var defaultMessage = LIB._.merge({
    				    body: "<REPLACE>",
    				    to: "<REPLACE>",
    				    from: "<REPLACE>"
    				}, context.config.twilio.message || {});

    				var message = LIB._.merge(defaultMessage, messageOverrides || {});

                    if (message.mode === "test") {
                        message.body = "[TEST] " + (message.body || "");
                    }
//console.log("SMS message", message);
    
    				return client.messages.create(message, function (err, result) {
    					if (err) {
    						if (!err.stack) {
    							var _err = new Error();
    							for (var name in err) {
    								_err[name] = err[name];
    							}
    							err = _err;
    						}
    						return callback(err);
    					}

//console.log("SMS send result", result);

    					return callback(null);
    				});
    			})();
            }
        }

        return new SMS(context);
    }

    return exports;
}
