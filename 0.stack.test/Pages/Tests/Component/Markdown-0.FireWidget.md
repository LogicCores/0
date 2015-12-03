
01-ServerWindow
===============

<script language="html">
    <div component:id="01-ServerWindow" component:impl="#0.FireWidgets/Features/0.FireWidgets/01-ServerWindow">
        Loading ...
    </div>
</script>


BlogCategory
============

<script language="html">
    <div component:id="BlogCategory" component:impl="#0.FireWidgets/Components/BlogCategory">
        Loading ...
    </div>
</script>

<script component:id="BlogCategory" component:location="window">
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
