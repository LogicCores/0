
exports.main = function (LIB, context) {

	return LIB.firewidgets.Widget(function (context) {

		return {

			"#chscript:redraw": {

				template: require("chscript!./template.htm"),

				getTemplateData: function (data) {
                    return {
                        "$views": {
                            "default": true
                        },
                        "options": [
                            // TODO: Make this optional by config.
                            {
                                get: function (name) {
                                    if (name === "label") return "All";
                                    if (name === "id") return "*";
                                    return "";
                                }
                            }
                        ].concat(data["options"])
                    };
	            },
	            afterRender: function (domNode, data) {
                    $(".dropdown", domNode).dropdown({
                        onChange: function(id) {
                            context.set("selected.option", id);

                            context.callServerAction("notify", {
                                "category": id
                            }).then(function (result) {
                            
                                console.log("Notify result", result);

                            }).catch(function (err) {
            // TODO: Show error in alert on page.
            console.error("Error making request!", err.stack);
                            });
                        }
                    });
                    if (typeof context.get("selected.option") !== "undefined") {
                        $(".dropdown", domNode).dropdown(
                            "set selected",
                            context.get("selected.option")
                        );
                    }
	            }
			}
		};

	}, context);
}
