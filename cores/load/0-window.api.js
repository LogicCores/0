
exports.forLib = function (LIB) {
    
    var exports = {};

    // TODO: Load adapters as needed on demand
    
    exports.adapters = {
        pinf: require("./for/pinf-loader-js/0-window.api").forLib(LIB),
        requirejs: require("./for/requirejs/0-window.api").forLib(LIB)
    
    //    systemjs: require("./for/systemjs")
    }

    return exports;
}


/*		
		window.Cores.load.adapters.pinf.load(
			"/dist/DependencyVisualization.bundle.js"
		).then(function (container) {

			container.main();

		}).catch(function (err) {
			console.log("ERROR loading components using pinf loader:", err.stack);
		});

		window.Cores.load.adapters.requirejs.load(
			"/dist/DependencyVisualization.amd.js"
		).then(function (container) {

			container.main();

		}).catch(function (err) {
			console.log("ERROR loading components using requirejs loader:", err.stack);
		});
*/

/*
		window.Cores.load.adapters.systemjs.load(
			"/dist/DependencyVisualization.amd.js"
		).then(function (container) {

			container.main();

		}).catch(function (err) {
			console.log("ERROR loading components using systemjs loader:", err.stack);
		});
*/

