
const INQUIRER = require("inquirer");


exports.for = function (API) {

	var exports = {};

	exports.resolve = function (resolver, config, previousResolvedConfig) {
		return resolver({}).then(function (resolvedConfig) {

            function processService (serviceId) {

                API.console.verbose("Process service '" + serviceId + "'");
                var service = resolvedConfig.services[serviceId];

                return API.Q.denodeify(function (callback) {

                    var prompts = Object.keys(service.variables).map(function(name) {
                        return {
                            name: name,
                            type: service.variables[name].type,
                            message: service.variables[name].question + ":"
                        };
                    });
                    var answers = {};
                    prompts = prompts.filter(function (prompt) {
                        return !(answers[prompt.name] = (
                            previousResolvedConfig &&
                            previousResolvedConfig.services &&
                            previousResolvedConfig.services[serviceId] &&
                            previousResolvedConfig.services[serviceId].variables &&
                            previousResolvedConfig.services[serviceId].variables[prompt.name] &&
                            previousResolvedConfig.services[serviceId].variables[prompt.name].value
                        ) ||
                        (
                            typeof process.env[prompt.name] !== "undefined" &&
                            process.env[prompt.name].replace(/(^"|"$)/g, "")
                        ) ||
                        null);
                    });
                    function finalize (callback) {
                        for (var name in answers) {
                            service.variables[name].value = answers[name];
                        }
                        return callback(null);
                    }
                    if (prompts.length === 0) {
                        return finalize(callback);
                    }

                    console.log("Obtaining variables for service " + service.label + " (" + service.url + ")");

                    return INQUIRER.prompt(prompts, function(_answers) {
                        for (var name in _answers) {
                            answers[name] = _answers[name];
                        }
                        return finalize(callback);
                    });
                })();
            }

            return API.Q.all(Object.keys(resolvedConfig.services).map(processService)).then(function () {
                return resolvedConfig;
            });
		});
	}

	exports.turn = function (resolvedConfig) {

//console.log("TURN bash.origin.prompt", resolvedConfig);

	}

	exports.spin = function (resolvedConfig) {

//console.log("SPIN bash.origin.prompt", resolvedConfig);

// TODO: Watch for variable changes and trigger turn on change.

	}

	return exports;
}

