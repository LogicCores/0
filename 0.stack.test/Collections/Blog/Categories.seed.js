
exports.forLib = function (LIB) {

    const MAPPER = require("../../../cores/data/for/ccjson.record.mapper/0-common.api").forLib(LIB);

    var exports = {};

    exports.spin = function (context) {

        return new (MAPPER.spin(context).Seed)({
            "#contracts": {
                "json-id-records": true
            },
    		name: "blog.categories",
    		records: {
    		    // Adds records/fields if undefined
    		    "@complete": {
    		    },
    		    // Updates records/fields and resets/defaults undeclared fields
    		    "@replace": {
        		    "1": {
        		        "label": "Category 1"
        		    },
        		    "2": {
        		        "label": "Category 2"
        		    },
        		    "3": {
        		        "label": "Category 3"
        		    }
    		    }
    		}
        });
    }
    
    return exports;
}
