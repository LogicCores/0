
define(function(require, exports, module) {

    return main;

    function main (options, imports) {
        var Panel = imports.Panel;
        var panels = imports.panels;
        var commands = imports.commands;
        var settings = imports.settings;
        var ui = imports.ui;



        var plugin = new Panel("Right Devcomp Panel", main.consumes, {
            index: 1000,
            where: "right",
            caption: "devcomp: Abstract"
        });


        function syncSize () {
            var iframe = plugin.container.querySelector("IFRAME.devcomp-iframe");
            // If the width is '0' we re-sync every so often until we get a positive value once.
            if (plugin.container.clientWidth === 0) {
                setTimeout(syncSize, 500);
                return;
            }
            iframe.width = plugin.container.clientWidth + "px";
            iframe.height = plugin.container.clientHeight + "px";
        }

        plugin.on("show", function (e) {
            syncSize();
//            commands.exec("openterminal", "ls -al");
        });
        panels.on("afterAnimate", function (e) {
            if (panels.isActive("devcomp")) {
                syncSize();
            }
        });

        plugin.on("draw", function (e) {

            ui.insertCss(require("text!../panel.css"), options.staticPrefix, plugin);

            e.html.innerHTML = '<iframe class="devcomp-iframe" src="' + settings.get("project/0.devcomp-panel-right/@url") + '"></iframe>';
        });

        return plugin;
    }

});
