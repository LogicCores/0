
exports.forLib = function (LIB) {

    const MAPPER = require("../../../cores/data/for/ccjson.record.mapper/0-common.api").forLib(LIB);

    var exports = {};

    exports.spin = function (context) {

        return new (MAPPER.spin(context).Collection)({
            _modulePath: __filename,
            "#contracts": {
                "nedb": true
            },
    		name: "blog.categories",
    		record: {
                "id": "string",
    	        "label": "string"
    		}
        });
    }
    
    return exports;
}
