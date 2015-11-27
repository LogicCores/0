
<div class="ui basic segment">
    <form class="ui form">
        <div class="fields">
          <div class="field">
            <div component:id="dropdown" class="ui floating dropdown labeled button">
              <span class="text">Select</span>
              <div class="menu">
                <div class="ui icon search input">
                  <i class="search icon"></i>
                  <input type="text" placeholder="Search ..."/>
                </div>
                <div class="scrolling menu" component:section="options">
                    <div
                        component:section="options"
                        component:view="default"
                        class="item"
                        data-value="{{id}}"
                        component:prop="label">
                      Option
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </form>
</div>

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
                },
                getTemplateData: function (data) {
                    return {
                        "$views": {
                            "default": true
                        },
                        "options": data.options
                    };
                },
                afterRender: function (domNode, data) {
                    $(".dropdown", domNode).dropdown({
                        onChange: function(id) {
                            context.set("selected.option", id);
                        }
                    });
                    if (context.get("selected.option")) {
                        $(".dropdown", domNode).dropdown(
                            "set selected",
                            context.get("selected.option")
                        );
                    }
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

