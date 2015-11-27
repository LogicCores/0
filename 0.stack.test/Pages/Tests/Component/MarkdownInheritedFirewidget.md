
<script language="html">
    <div class="ui basic segment">
        <form class="ui form">
            <div class="fields">
              <div class="field">
                <div component:id="dropdown" component:impl="0-test/TableFilter/Dropdown"/>
              </div>
            </div>
        </form>
    </div>
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
