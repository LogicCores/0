
exports.forLib = function (LIB) {
    
    var exports = {};

    exports.forContext = function (context) {

        var Component = function (config) {
            var self = this;

            self.templateHtml = require("raw!./template.htm");
            self.templateChscript = require("chscript!./template.htm");


            // chscript widget
            self.getTemplateData = function (context, data) {
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
            }
            self.afterRender = function (context, domNode, data) {
                $(".dropdown", domNode).dropdown({
                    onChange: function(id) {
                        context.set("selected.option", id);
                    }
                });
                if (typeof context.get("selected.option") !== "undefined") {
                    $(".dropdown", domNode).dropdown(
                        "set selected",
                        context.get("selected.option")
                    );
                }
                context.pageAPI = {
                    validate: function () {
                        $('.dropdown', domNode).removeClass("error");
                        var value = context.pageAPI.getValue();
                        var error = !value || value === "*";
                        if (error) $('.dropdown', domNode).addClass("error");
                        return error;
                    },
                    getValue: function () {
                        var value = $(".dropdown", domNode).dropdown("get value");
                        if (typeof value === "object") {
                            value = "";
                        }
                        return value;
                    },
                    setValue: function (value) {
                        context.set("selected.option", value);
                    }
                }
            }
    
    
            // jQuery widget
            self.markup = function (context, domNode, data) {
                domNode.dropdown({
                    onChange: function(id) {
                        context.set("selected.option", id);
                    }
                });
                if (typeof context.get("selected.option") !== "undefined") {
                    domNode.dropdown(
                        "set selected",
                        context.get("selected.option")
                    );
                }
            };
            self.fill = function (context, domNode, data) {
                this.renderSection(domNode, "options", [
                    // TODO: Make this optional by config.
                    {
                        get: function (name) {
                            if (name === "label") return "All";
                            if (name === "id") return "*";
                            return "";
                        }
                    }
                ].concat(data["options"]), function getView (option) {
        			return 'default';
        	    });
            }
        }

        return Component;
    }

    return exports;    
}
