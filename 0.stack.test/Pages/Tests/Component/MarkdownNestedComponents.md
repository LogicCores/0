
# Header

<script language="html">
    <div component:id="context">
        <div component:view="list">
            <button class="ui button" data-component-action="new">New</button>
    
        </div>
    
        <div component:view="edit">
            <button class="ui button" data-component-action="back">Back</button>
    
    
            <div component:id="dropdown" component:impl="0-test/TableFilter/Dropdown"/>
        </div>
    </div>
</script>


# Footer

Footer text


<script component:id="context" component:location="window">
exports.main = function (LIB, globalContext) {
	return LIB.firewidgets.Widget(function (context) {
		return {
			"#chscript:redraw": {
                getTemplateData: function (data) {
                    var views = {};
                    views[
                        context.get("selectedId") ? "edit" : "list"
                    ] = true;
                    return {
                        "$views": views
                    };
                },
                afterRender: function (domNode, data) {
                    var helpers = this;
                    domNode.click(function (event) {
                        var node = helpers.findActionableNode(event.target);
                        if (node) {
                            if (node.action === "new") {
                                context.set("selectedId", "new");
                            } else
                            if (node.action === "back") {
                                context.set("selectedId", "");
                            }
                        }
                    });
                }
			}
		}
    });
}
</script>



<script component:id="dropdown" component:location="window">
exports.main = function (LIB, globalContext) {
	return LIB.firewidgets.Widget(function (context) {
		return {
			"#chscript:redraw": {
                mapData: function (data) {
                    return {
                        "@load": [
                            "categories"
                        ],
                        "@map": {
                          'options': data.connect('blog.categories/*')
                        }
                    };
                }
			}
		}
    });
}
</script>

<script component:id="dropdown" component:location="server">
exports.main = function (LIB, globalContext) {
	return LIB.firewidgets.Widget(function (context) {
		return {
			"#0.FireWidgets": {
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
		}
    });
}
</script>
