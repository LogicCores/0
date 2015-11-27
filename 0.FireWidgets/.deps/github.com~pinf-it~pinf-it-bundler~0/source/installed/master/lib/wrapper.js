
const PATH = require("path");
const FS = require("fs-extra");
const REQUIREJS = require("requirejs");


REQUIREJS.config({
    nodeRequire: require,
	baseUrl: PATH.join(__dirname, "r.js/build/jslib")
});


exports.wrapModule = function(descriptor, options, callback) {

	if (descriptor.errors.length > 0) {
		descriptor.errors.forEach(function(error) {
			console.error("ERROR", error, new Error().stack);
		});
		return callback(new Error("We had errors in package descriptor '" + descriptor.descriptor.filepath + "'!"));
	}

	var packageDescriptorForModule = options.packageDescriptorForModule || function(path, callback) {
		return callback(null, null);
	}

	return packageDescriptorForModule(descriptor.descriptor.filepath, function(err, packageDescriptor) {
		if (err) return callback(err);

		try {

			var dirnameForModule = descriptor.descriptor.filepath;
			if (options.rootPath) dirnameForModule = PATH.join(options.rootPath, dirnameForModule);
			dirnameForModule = PATH.dirname(dirnameForModule);

			function wrap(callback) {

				if (descriptor.descriptor.syntax === "javascript") {

					// `define(function() {`
					// `define("<id>", function() {`
					// `define("<id>", ["dep"], function() {`
					// `define(["dep"], function() {`
					if (descriptor.descriptor.format === "amd") {

						// We can write a clean `define()` wrapper.
						descriptor.wrapper.type = "amd";

						// These dependencies don't need to be followed as they are handled by the AMD header.
						delete descriptor.dependencies.static.require;
						delete descriptor.dependencies.static.exports;
						delete descriptor.dependencies.static.module;

						// Cleanup `define` call using r.js
						return wrapAMD(descriptor, function(err) {
							if (err) return callback(err);

							// If the `define` wrapped call needs an AMD-style `require` we provide it
							// if it is not declared.
							if (descriptor.descriptor.globals["require"] && !descriptor.descriptor.dependencies.static["require"]) {
								descriptor.wrapper.type = "amd-ish";
								descriptor.wrapper.code = [
									"wrapAMD(function(require, define) {",
									descriptor.wrapper.code,
									"})"
								].join("\n");
							}
							return callback(null);
						});

					} else
					// `<code> define(`
					// `define(<id>, function() {`
					// `define("<id>", [<dep>], function() {`
					// `define(<id>, [<dep>], function() {`
					// `define([<dep>], function() {`
					if (descriptor.descriptor.format === "amd-ish") {

						// These dependencies don't need to be followed as they are handled by the AMD header.
						delete descriptor.dependencies.static.require;
						delete descriptor.dependencies.static.exports;
						delete descriptor.dependencies.static.module;

						// The `define()` wrapper is part of `descriptor.code` as it could not be stripped safely.
						// We write a `defineish()` wrapper that declares a `define` function
						// used to intercept id and dependency declarations.

						descriptor.wrapper.type = "amd-ish";
						descriptor.wrapper.top = "wrapAMD(function(require, define) {";
						descriptor.wrapper.bottom = "})";

					} else
					if (descriptor.descriptor.format === "commonjs") {
						descriptor.wrapper.type = "commonjs";
						descriptor.wrapper.top = "function(require, exports, module) {" +
							"var __dirname = " + ((options.test && options.rootPath)?"TEST_ROOT_PATH + '/' + ":"") + "'" + options._relpath(dirnameForModule) + "';";
						descriptor.wrapper.bottom = "}";

					} else
					if (descriptor.descriptor.format === "leaky") {

						// We wrap code to export all leaked globals.
						var exports = [];
						for (var name in descriptor.descriptor.globals) {
							// If module uses `require.main` we don't want to export the `main` function.
							if (name === "main" && descriptor.descriptor.uses["require.main"]) {
								// Don't export function.
							} else {
								// Guard against a variable being undefined. This happens if variable is used
								// but never declared and is an error in the code! We ignore this here
								// as some code still runs and if this happens in a dependency we don't want things to break.
								exports.push('    ' + name + ': (typeof ' + name + ' !== "undefined") ? ' + name + ' : null');
							}
						}
						descriptor.wrapper.type = "commonjs/leaky";
						descriptor.wrapper.top = "function(require, exports, module) {" +
							"var __dirname = " + ((options.test && options.rootPath)?"TEST_ROOT_PATH + '/' + ":"") + "'" + options._relpath(dirnameForModule) + "';";
						descriptor.wrapper.bottom = "return {\n" + exports.join(",\n") + "\n};\n}";

					} else
					if (descriptor.descriptor.format === "encapsulated") {

						// We wrap module even though we cannot penetrate it.
						descriptor.wrapper.type = "commonjs/encapsulated";
						descriptor.wrapper.top = "function(require, exports, module) {";
						descriptor.wrapper.bottom = "}";

					} else {
						return callback(new Error("Unrecognized format '" + descriptor.descriptor.format + "' for syntax '" + descriptor.descriptor.syntax + "'"));
					}

				} else
				if (descriptor.descriptor.syntax === "json") {

					descriptor.wrapper.type = "json";

				} else
				if (descriptor.descriptor.syntax === null) {

					if (descriptor.descriptor.format === "utf8") {

						descriptor.wrapper.type = "url-encoded";
						descriptor.wrapper.code = "'" + encodeURIComponent(descriptor.descriptor.code).replace(/'/g, "\\'") + "'";

					} else {
						return callback(new Error("Unrecognized format '" + descriptor.descriptor.format + "' for syntax '" + descriptor.descriptor.syntax + "'"));
					}

				} else {
					return callback(new Error("Unrecognized syntax '" + descriptor.descriptor.syntax + "'"));
				}

				return callback(null);
			}

			function replace(callback) {

				function replaceRequireIds(callback) {
					if (!packageDescriptor) return callback(null);

					if (
	/*
	// TODO: Comment this back in once package descriptor inherits default engine requirements from parent package.
						packageDescriptor.combined.requirements &&
						packageDescriptor.combined.requirements.engines &&
						packageDescriptor.combined.requirements.engines.node &&
	*/
						descriptor.descriptor.dependencies &&
						descriptor.descriptor.dependencies.static
					) {

						var code = (descriptor.wrapper.code || [
										descriptor.wrapper.top,
										descriptor.descriptor.code,
										descriptor.wrapper.bottom
									].join("\n"));

						for (var id in descriptor.descriptor.dependencies.static) {
							// NOTE: We assume we are running on nodejs.
							try {
								if (id !== "require" && require.resolve(id) === id) {
									// We have a system module.
									code = code.replace(new RegExp("(\\Wrequire\\(['\"])" + id + "(['\"]\\))", "g"), "$1" + "__SYSTEM__/" + id + "$2");
								}
							} catch(err) {}
						}

						descriptor.wrapper.code = code;
					}

					return callback(null);
				}

				function replacePlatformGlobals(callback) {

					var code = (descriptor.wrapper.code || [
									descriptor.wrapper.top,
									descriptor.descriptor.code,
									descriptor.wrapper.bottom
								].join("\n"));

//					var path = descriptor.descriptor.filepath;
//					if (options.rootPath) path = PATH.join(options.rootPath, path);
//					code = code.replace(/\__dirname/ig, '"' + PATH.dirname(path) + '"');

					descriptor.wrapper.code = code;

					return callback(null);
				}

				return replaceRequireIds(function(err) {
					if (err) return callback(err);
					return replacePlatformGlobals(callback);
				});
			}

			return wrap(function(err) {
				if (err) return callback(err);
				return replace(callback);
			});

		} catch(err) {
			return callback(err);
		}
	});
}

exports.headerForWrapper = function(type) {
	if (type === "amd") {
		return [
		    'function define(id, dependencies, moduleInitializer) {',
		    '    if (typeof dependencies === "undefined" && typeof moduleInitializer === "undefined") {',
		    '        if (typeof id === "function") {',
		    '            moduleInitializer = id;',
		    '        } else {',
		    '            var exports = id;',
		    '            moduleInitializer = function() { return exports; }',
		    '        }',
		    '        dependencies = ["require", "exports", "module"];',
		    '        id = null;',
		    '    } else',
		    '    if (Array.isArray(id) && typeof dependencies === "function" && typeof moduleInitializer === "undefined") {',
		    '        moduleInitializer = dependencies;',
		    '        dependencies = id;',
		    '        id = null;',
		    '    } else',
		    '    if (typeof id === "string" && typeof dependencies === "function" && typeof moduleInitializer === "undefined") {',
		    '        moduleInitializer = dependencies;',
		    '        dependencies = ["require", "exports", "module"];',
		    '    }',
		    '    return function(realRequire, exports, module) {',
	        '        function require(id) {',
	        '            if (Array.isArray(id)) {',
	        '                var apis = [];',
	        '                var callback = arguments[1];',
	        '                id.forEach(function(moduleId, index) {',
	        '                    realRequire.async(moduleId, function(api) {',
	        '                        apis[index] = api',
	        '                        if (apis.length === id.length) {',
	        '                            if (callback) callback.apply(null, apis);',
	        '                        }',
	        '                    }, function(err) {',
	        '                        throw err;',
	        '                    });',
	        '                });',
	        '            } else {',
	        '                return realRequire(id);',
	        '            }',
	        '        }',
	        '        require.toUrl = function(id) {',
	        '            return realRequire.sandbox.id.replace(/\\/[^\\/]*$/, "") + realRequire.id(id);',
	        '        }',

	        // TODO: Only optionally include this?
	        '        require.sandbox = realRequire.sandbox;',
	        '        require.id = realRequire.id;',

	        '        if (typeof amdRequireImplementation !== "undefined") {',
	        '            amdRequireImplementation = require;',
	        '        }',
	        // @see http://requirejs.org/docs/api.html#cjsmodule
		    '        if (typeof moduleInitializer === "function") {',
		    '            return moduleInitializer.apply(moduleInitializer, dependencies.map(function(name) {',
		    '                if (name === "require") return require;',
		    '                if (name === "exports") return exports;',
		    '                if (name === "module") return module;',
		    '                return require(name);',
		    '            }));',
		    '        } else',
		    // @see http://requirejs.org/docs/api.html#defsimple
	        '        if (typeof dependencies === "object") {',
	        '            return dependencies;',
	        '        }',
		    '    }',
		    '}',
		    'define.amd = { jQuery: true };',
		    // TODO: `require.def` should be local-scoped and not modify the inherited `require` object.
		    'require.def = define;'
		].join("\n");
	} else
	if (type === "amd-ish") {
		return [
		    'function wrapAMD(callback) {',
			'    var amdRequireImplementation = null;',
		    exports.headerForWrapper("amd").split("\n").map(function(line) {
		    	return "    " + line;
		    }).join("\n"),
		    '    var exports = null;',
		    '    function wrappedDefine() {',
		    '        exports = define.apply(null, arguments);',
		    '    }',
		    '    wrappedDefine.amd = { jQuery: true };',
		    '    function amdRequire() {',
		    '        return amdRequireImplementation.apply(null, arguments);',
		    '    }',
		    // TODO: `require.def` should be local-scoped and not modify the inherited `require` object.
		    '    amdRequire.def = wrappedDefine',
		    '    callback.call(_____bundle_global || (typeof "global" !== "undefined" && global) || {}, amdRequire, wrappedDefine);',
		    '    return exports;',
		    '}'
		].join("\n");
	}
	return null;
}


function wrapAMD(descriptor, callback) {
	return REQUIREJS(["transform"], function(TRANSFORM) {
        try {
			var code = TRANSFORM.toTransport(false, false, descriptor.descriptor.filepath, descriptor.descriptor.code, false, false);
    		descriptor.wrapper.code = code.replace(/;[\s\n]*$/, "");
			return callback(null);
        } catch (err) {
        	return callback(err);
        }
	}, function (err) {
		return callback(err);
	});
}
