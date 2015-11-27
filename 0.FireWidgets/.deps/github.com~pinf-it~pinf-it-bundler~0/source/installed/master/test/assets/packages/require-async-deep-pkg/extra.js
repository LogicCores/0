
const PINF_MAIN = require("pinf-for-nodejs/lib/main").main;

exports.run = function(callback) {
    return PINF_MAIN(function(context, callback) {
        return callback(null, context);
    }, module, callback);
}
