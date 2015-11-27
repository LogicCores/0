define("plugins/0.devcomp-for-cloud9/__installed__", [],[
    {
        "packagePath": "plugins/0.devcomp-for-cloud9/plugin"
    }
]);

define("text!plugins/0.devcomp-for-cloud9/panel.css",[],"\nIFRAME.devcomp-iframe {\n\n    border: 0px;\n    overflow: auto;\n\n}\n");

define("plugins/0.devcomp-for-cloud9/panel-left/plugin",[], function(require, exports, module) {

    return main;

    function main (options, imports) {
        var Panel = imports.Panel;
        var panels = imports.panels;
        var commands = imports.commands;
        var settings = imports.settings;
        var ui = imports.ui;



        var plugin = new Panel("Left Devcomp Panel", main.consumes, {
            index: 1000,
            where: "left",
            caption: "devcomp: Concrete"
        });


        function syncSize () {
            var iframe = plugin.container.querySelector("IFRAME.devcomp-iframe");
            if (plugin.container.clientWidth === 0) {
                setTimeout(syncSize, 500);
                return;
            }
            iframe.width = plugin.container.clientWidth + "px";
            iframe.height = plugin.container.clientHeight + "px";
        }

        plugin.on("show", function (e) {
            syncSize();
        });
        panels.on("afterAnimate", function (e) {
            if (panels.isActive("devcomp")) {
                syncSize();
            }
        });

        plugin.on("draw", function (e) {

            ui.insertCss(require("text!../panel.css"), options.staticPrefix, plugin);

            e.html.innerHTML = '<iframe class="devcomp-iframe" src="' + settings.get("project/0.devcomp-panel-left/@url") + '"></iframe>';
        });

        return plugin;
    }

});

define("plugins/0.devcomp-for-cloud9/panel-right/plugin",[], function(require, exports, module) {

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
            if (plugin.container.clientWidth === 0) {
                setTimeout(syncSize, 500);
                return;
            }
            iframe.width = plugin.container.clientWidth + "px";
            iframe.height = plugin.container.clientHeight + "px";
        }

        plugin.on("show", function (e) {
            syncSize();
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

define("plugins/0.devcomp-for-cloud9/plugin",[], function(require, exports, module) {

    main.consumes = ["Panel", "ui", "panels", "commands", "settings"];
    main.provides = [
        "0.devcomp-panel-left",
        "0.devcomp-panel-right"
    ];

    return main;

    function main (options, imports, register) {


        register("", {
            "0.devcomp-panel-left": require("./panel-left/plugin")(options, imports),
            "0.devcomp-panel-right": require("./panel-right/plugin")(options, imports)
        });
    }

});
