
const SASS = require("node-sass");
const PATH = require("path");
const FS = require("fs-extra");
const WAITFOR = require("waitfor");
const REWORK = require("rework");
const REWORK_IMPORT = require("rework-import");
const REWORK_INLINE = require("rework-plugin-inline");


exports.processModule = function(descriptor, options, callback) {

	if (descriptor.errors.length > 0) {
		descriptor.errors.forEach(function(error) {
			console.error("ERROR", error, new Error().stack);
		});
		return callback(new Error("We had errors in descriptor for '" + options._realpath(descriptor.descriptor.filepath) + "'!"));
	}
//console.log("descriptor", descriptor);

	if (
		options.requireContext &&
		options.requireContext.plugin &&
		options.plugins &&
		options.plugins.require
	) {
		if (!options.plugins.require[options.requireContext.plugin]) {
			console.error("options.plugins.require", options.plugins.require);
			return callback(new Error("require plugin '" + options.requireContext.plugin + "' used in module '" + options._realpath(descriptor.descriptor.filepath) + "' but not declared in bundler config!"));
		}
		try {

			descriptor.variation = options.requireContext.plugin;

			return options.plugins.require[options.requireContext.plugin]["#pinf-it-bundler"].process(descriptor.descriptor, callback);

		} catch (err) {
			console.error(err.stack);
			return callback(new Error("Error while calling require transform plugin '" + options.requireContext.plugin + "'"));
		}
	}

	if (descriptor.descriptor.format === "scss") {

		return SASS.render({
			file: options._realpath(descriptor.descriptor.filepath),
		    data: descriptor.descriptor.code,
		    success: function (result) {
//		        console.log(result.stats);
//		        console.log(result.map)

				descriptor.descriptor.code = result.css;
				descriptor.descriptor.format = "utf8";

				return callback(null);
		    },
		    error: function (err) {
		        console.error("message", err.message);
		        console.error("code", err.code);
		        console.error("line", err.line);
		        console.error("column", err.column);
		    	return callback(new Error("SASS error while processing: " + descriptor.descriptor.filepath));
		    },
		    includePaths: [
		    	options._realpath(options.packageExtras.packagePath)
		    ]
		});

	} else
	if (descriptor.descriptor.format === "css") {

		var source = descriptor.descriptor.code;

		// TODO: Use dependencies info from descriptor to inline static imports and assets once declared and scanned by pinf-it-module-insight
		source = REWORK(source)
		    .use(REWORK_IMPORT({
		    	path: options._realpath(options.packageExtras.packagePath)
		   	}))
		    .toString();

		source = source.replace(/(background[\s\w-]*:[\s#\w]*]*)url(\('?"?images\/)/g, "$1inline$2");

		source = REWORK(source)
		   	.use(REWORK_INLINE(options._realpath(options.packageExtras.packagePath)))
		    .toString();

		descriptor.descriptor.code = source;

		descriptor.descriptor.format = "utf8";
	}

	return callback(null);
}

