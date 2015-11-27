
<script language="html">
    <div component:id="list">
        <ul component:section="item">
            <li component:section="item" component:view="default">
                <span component:prop="label">Label</span> <button class="ui button" data-component-action="tag-time" data-id="{{id}}">
                    Tag Time
                </button>
            </li>
        </ul>
    </div>
</script>

<script component:id="list" component:location="window">
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
                          'items': data.connect('blog.categories/*')
                        }
                    };
                },
                getTemplateData: function (data) {
                    return {
                        "$views": {
                            "default": true
                        },
                        "item": data.items
                    };
                },
                afterRender: function (domNode, data) {
                    var helpers = this;
                    domNode.click(function (event) {
                        var node = helpers.findActionableNode(event.target);
                        if (node && node.action === "tag-time") {
            
                            context.callServerAction("tag-time", {
                                "id": node.id
                            }).then(function (result) {
                                
                                if (result.success !== true) {
                                    throw new Error("Did not get success result!");
                                }
            
                            }).catch(function (err) {
                                // TODO: Show error in alert on page.
                                console.error("Error making request!", err.stack);
                            });
                        }
                    });
                }
			}
		}
    });
}
</script>

<script component:id="list" component:location="server">
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
                },
                handleActionForPointer: function (action, payload) {
                    if (action === "tag-time") {
                        return {
                            "result": {
                                "success": true
                            },
                            "collections": {
                                "blog.categories": [
                                    {
                                        id: payload.id,
                                        label: "Time: " + (new Date().toString())
                                    }
                                ]
                            }
                        };
                    }
                }
			}
		}
    });
}
</script>


