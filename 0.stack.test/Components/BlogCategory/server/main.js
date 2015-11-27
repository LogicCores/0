
exports.main = function (LIB, globalContext) {

	return LIB.firewidgets.Widget(function (context) {

		return {

		    "#0.FireWidgets": {
		        handleActionForPointer: function (action, payload) {

                    if (action === "notify") {
                        return {
                            "result": {
                                "notified": payload
                            }
                        };
                    }
		        },
		        getDataForPointer: function (pointer) {

                    const nedb = globalContext.adapters["data.nedb"].adapter.nedb;
                    if (pointer === "categories") {
                        return nedb('blog.categories', function (table, callback) {
                			return table.find({}, callback);
                		}).then(function (records) {
                            return {
                                "blog.categories": records
                            };
                		});
                    }
		        }
		    }
		};

	}, globalContext);
}
