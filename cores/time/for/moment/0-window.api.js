
exports.forLib = function (LIB) {

    var exports = {};

    exports.spin = function (context) {

        // TODO: Adjust timezone based on config or preference.

        console.log("Client time info:", JSON.stringify({
            "Date:timezoneOffset": new Date().getTimezoneOffset(),
            "Date": "" + new Date(),
            "Date:localeTimeString": new Date().toLocaleTimeString(),
            "moment": LIB.moment().format("dddd, MMMM Do YYYY, h:mm:ss a Z")
        }, null, 4));

        return {
            moment: LIB.moment
        }
    }

    return exports;
}
