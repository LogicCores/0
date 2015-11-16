
window.waitForLibrary(function (LIB) {
	LIB.$(function () {
		LIB.waitForLibraryProperty("Cores").then(function () {

			var appConfig = Object.create({
				config: JSON.parse(decodeURIComponent($('head > meta[name="page.context"]').attr("value")))
			});
			LIB._.assign(appConfig, appConfig.config.application);

			// TODO: Boot using 0-context + ccjson instead of constructing context manually below.

			var contexts = {};
			contexts.aspects = {
				application: new (LIB.Cores.application.forContexts(contexts)).Context(appConfig)
			};
			contexts.adapters = {
				application: {
					"zerosystem": LIB.Cores.application.adapters.zerosystem.spin(contexts.aspects.application)
				}
			};

			// Boot the application
			return contexts.adapters.application.zerosystem.boot();

		}).then(function () {

			console.log("Application booted!");
		}).catch(function (err) {

			console.error("Error booting page:", err.stack);
		});
	});
});
