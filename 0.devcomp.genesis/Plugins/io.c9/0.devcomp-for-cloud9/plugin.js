
define(function(require, exports, module) {

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
