
const ASSERT = require("assert");
const PATH = require("path");
const FS = require("fs-extra");
const DEEPCOPY = require("deepcopy");
const WAITFOR = require("waitfor");
const MODULE_INSIGHT = require("pinf-it-module-insight");
const PACKAGE_INSIGHT = require("pinf-it-package-insight");
const BUNDLE = require("./bundle");
const WRAPPER = require("./wrapper");
const PROCESSOR = require("./processor");
const BROWSER_BUILTINS = require("browser-builtins");


exports.for = function (API) {

	API.REQUIRE_ASYNC(require);

	var exports = {};

	exports.resolve = function (resolver, config, previousResolvedConfig) {
		return resolver({}).then(function (resolvedConfig) {

			resolvedConfig.bundlePath = API.getTargetPath();
			resolvedConfig.bundleHash = "hash";

			return resolvedConfig;
		});
	}

	exports.turn = function (resolvedConfig) {

        function loadPINF () {
            var deferred = API.Q.defer();
            try {
                API.console.debug("Loading pinf (this will be sped up significantly) ...");
                require.async(
                    "/genesis/os.inception/services/2-org.pinf/pinf-for-nodejs",
                    function (PINF) {
                        return deferred.resolve(PINF);
                    }
                );
            } catch (err) {
                deferred.reject(err);
            }
            return deferred.promise;
        }

        return loadPINF().then(function (PINF) {
            return API.Q.denodeify(function (callback) {

                return PINF.contextForModule(module, {
                    "PINF_PROGRAM": API.PATH.join(resolvedConfig.sourcePath, "program.json"),
                    "PINF_RUNTIME": "",
                    verbose: API.DEBUG,
                    debug: API.DEBUG
                }, function(err, context) {
                    if (err) return callback(err);

                    return context.bundleProgram({
                        distPath: API.getTargetPath()
                    }, function(err, summary) {
                        if (err) return callback(err);
                        API.console.verbose("Finished creating bundles:", summary);
                        return callback();
                    });
                });
            })();
        });
	}

	return exports;
}




exports.normalizeExtension = function (pathid) {
	if (/(^|\/)[^\.]*$/.test(pathid)) {
		pathid += ".js";
	}
	return pathid;
}

exports.augmentBundle = function(bundleFilePath, options, callback) {
	return BUNDLE.open(bundleFilePath, options, function(err, bundle) {
		if (err) return callback(err);
		return callback(null, bundle, function(callback) {
			return bundle.save(function(err) {
				if (err) return callback(err);
				return bundle.close(function(err) {
					if (err) return callback(err);
					return callback(null);
				});
			});
		});
	});
}

exports.bundlePackage = function(bundlePackagePath, options, callback) {

	ASSERT.equal(typeof options, "object");
	ASSERT.equal(typeof options.distPath, "string");

	options.API = {
		FS: (options.$pinf && options.$pinf.getAPI("FS")) || FS
	};

	options._realpath = function(path) {
		if (!options.rootPath) return path;
		if (/^\//.test(path)) return path;
		return PATH.join(options.rootPath, path);
	}

	var bundlePackageDescriptor = {
		bundles: {},
		warnings: [],
		errors: []
	};

	if (!options.__top) {
		options.__top = {
			mainModules: {},
			exportedBundlesForPackage: {}
		};
	}

	function bundleFile(bundleFilePath, callback) {

		if (options.debug) console.log("[pinf-it-bundler] bundlePackage/bundleFile", bundleFilePath, "(", options._realpath(bundleFilePath), ")");

		var packageDescriptors = {};

		function loadPackageDescriptorForPath(path, options, callback) {
			if (packageDescriptors[path]) {
				if (options.debug) console.log("Using loaded package descriptor for path", path, "(", options._realpath(path), ")");
				return callback(null, packageDescriptors[path]);
			}
			if (options.debug) console.log("Load package descriptor for path", path, "(", options._realpath(path), ")");
			return PACKAGE_INSIGHT.parse(path, options, function(err, packageDescriptor) {
				if (err) return callback(err);

				if (packageDescriptor.errors.length > 0) {
					packageDescriptor.errors.forEach(function(error) {
						console.error(error, new Error().stack);
					});
					return callback(new Error("We had errors in package descriptor '" + path + "'!"));
				}

				return callback(null, (packageDescriptors[path] = packageDescriptor));
			});
		}

		var packages = {};

		function getPackageDescriptorForPath(path, options, callback) {
			if (packages[path]) {
//				console.log("Return existing package descriptor for path", path);
				return callback(null, packages[path][0], packages[path][1]);
			}
//			console.log("get package descriptor path", path);
			return loadPackageDescriptorForPath(path, options, function(err, packageDescriptor) {
				if (err) return callback(err);

				if (path === bundleFilePath) {
					packageDescriptor.id = "";
				}
				if (!packageDescriptor.memoized) {
					packageDescriptor.memoized = {};
				}


				if (options.bundleRootModule) {
					packageDescriptor.memoized.main = (packageDescriptor.id || options.rootPackage || "") + options.bundleRootModule.replace(/^\./, "");
				} else {

					var entryPointProperty = ["main"];
					if (options.$pinf) {
						var programInfo = options.$pinf.getProgramInfo();
						if (
							programInfo &&
							programInfo.program &&
							programInfo.program.descriptor &&
							programInfo.program.descriptor.config &&
							programInfo.program.descriptor.config["github.com/pinf-it/pinf-it-bundler/0"] &&
							programInfo.program.descriptor.config["github.com/pinf-it/pinf-it-bundler/0"].target
						) {
							if (programInfo.program.descriptor.config["github.com/pinf-it/pinf-it-bundler/0"].target === "browser") {
								entryPointProperty = ["browser", "main"];
							}
						}
					}

					var useEntryPoint = entryPointProperty.filter(function (propertyName) {
						return (
							packageDescriptor.combined.exports &&
							packageDescriptor.combined.exports[propertyName]
						);
					});
					if (useEntryPoint.length > 0) {
						packageDescriptor.memoized.main = (packageDescriptor.id || options.rootPackage || "") + packageDescriptor.combined.exports[useEntryPoint[0]].replace(/^\./, "");
					}
				}
				if (
					packageDescriptor.combined.layout &&
					packageDescriptor.combined.layout.directories &&
					packageDescriptor.combined.layout.directories.lib
				) {
					packageDescriptor.memoized.directories = {
						lib: packageDescriptor.combined.layout.directories.lib.replace(/^\.\//, "")
					};
				}

				function resolvePackageId(id, callback) {

//					console.log("resolvePackageId", "id", id);

					function checkDescriptor(packageDescriptor, callback) {

//						console.log("checkDescriptor", "id", id, "packageDescriptor", packageDescriptor);
//console.log("packageDescriptor.combined.dependencies", packageDescriptor.combined.dependencies);

						if (packageDescriptor.combined.dependencies) {
							var dependencyLocator = null;
							[
								// TODO: Why bundled first?
								"bundled",
								"required"
								// TODO: Add more types?
							].forEach(function (type) {
								if (dependencyLocator) return;
								if (
									packageDescriptor.combined.dependencies[type] &&
									packageDescriptor.combined.dependencies[type][id]
								) {
									dependencyLocator = packageDescriptor.combined.dependencies[type][id];
								}
							});
							if (dependencyLocator) {
								if (typeof dependencyLocator === "string") {
									// TODO: Throw here as this should already be done by pinf-it-package-insight!
									if (/^\./.test(dependencyLocator)) {
										dependencyLocator = {
											location: dependencyLocator
										};
									} else {
										dependencyLocator = {
											selector: dependencyLocator
										};
									}
								}

								var aliasedPackagePath = null;
								if (!dependencyLocator.location) {
									if (dependencyLocator.selector) {
										aliasedPackagePath = path;
									} else {
										console.error("packageDescriptor.combined", JSON.stringify(packageDescriptor.combined, null, 4));
										console.error("dependencyLocator", JSON.stringify(dependencyLocator, null, 4));
										return callback(new Error("`dependencyLocator.location ` not set for '" + packageDescriptor.dirpath + "' while resolving package '" + id + "'!"));
									}
								} else {
									aliasedPackagePath = PATH.join(path, dependencyLocator.location);
								}

								var opts = {};
								for (var name in options) {
									opts[name] = options[name];
								}
								delete opts.bundleRootModule;

								return getPackageDescriptorForPath(
									aliasedPackagePath,
									opts,
									function(err, aliasdPackageDescriptor, packageExtras) {
										if (err) return callback(err);
										return callback(null, aliasedPackagePath, aliasdPackageDescriptor, packageExtras);
									}
								);
							}
						}
						// If we are dealing with dependencies in `node_modules` directories we go up the tree.
						// This is the default behavior.
						function resolve(path) {
							return options.API.FS.exists(PATH.join(path, "node_modules", id), function(exists) {
								if (exists) {
									var opts = {};
									for (var name in options) {
										opts[name] = options[name];
									}
									delete opts.bundleRootModule;

									return getPackageDescriptorForPath(
										options._relpath(PATH.join(path, "node_modules", id)),
										opts,
										function(err, aliasdPackageDescriptor, packageExtras) {
											if (err) return callback(err);
											return callback(null, options._relpath(PATH.join(path, "node_modules", id)), aliasdPackageDescriptor, packageExtras);
										}
									);
								}
								if (PATH.dirname(path) === path) return callback(null);
								return resolve(PATH.dirname(path));
							});
						}

						if (!id && path === packageDescriptor.dirpath) {
							return callback(null, path, packages[path][0], packages[path][1]);
						}
						return resolve(PATH.dirname(options._realpath(path)));
					}
					return checkDescriptor(packageDescriptor, callback);
				}
//console.log("PATH", path, "options.packageExtras.packagePath", options.packageExtras && options.packageExtras.packagePath, new Error().stack);
				packages[path] = [packageDescriptor, {
					packagePath: path,
					locateFileInPackage: function(descriptor, id, callback) {

//console.log("locateFileInPackage", "id", id);

						var idParts = id.split("/");

						// TODO: Relocate this elsewhere. Maybe `pinf-primitives-js`?
/*
						// TODO: Use this check but allow for inheriting default from parent package.
						if (
							packageDescriptor.combined &&
							packageDescriptor.combined.requirements &&
							packageDescriptor.combined.requirements.engines &&
							packageDescriptor.combined.requirements.engines.node
						) {
*/
							// NOTE: We assume we are running on nodejs.
							try {
								if (id !== "require" && require.resolve(id) === id) {
									if (options.debug) console.warn("WARNING: Assuming module '" + id + "' (found as system module) will be provided at runtime as no mapping found in '" + options._relpath(descriptor.descriptor.filepath) + "' nor found in node_modules lookup logic relative to package!");
									// We have a system module and assume it will be provided at runtime.
									return callback(null, true, "", {});
								}
							} catch(err) {}
//						}

						return resolvePackageId(idParts[0], function(err, aliasedPackagePath, aliasdPackageDescriptor, packageExtras) {
							if (err) return callback(err);

							if (!aliasedPackagePath) {
								if (options.debug) console.warn("WARNING: Assuming module '" + id + "' (not found on disk) will be provided at runtime as no mapping found in '" + options._relpath(descriptor.descriptor.filepath) + "' nor found in node_modules lookup logic relative to package!");
								// We assume package will be provided at runtime.
								return callback(null, true, "", {});
							}

							try {
								if (!packageDescriptor.memoized.mappings) {
									packageDescriptor.memoized.mappings = {};
								}

								if (
									aliasdPackageDescriptor.dirpath === packageDescriptor.dirpath &&
									idParts.length === 1
								) {
									// We requested the main module from a package.
									idParts = [options.rootPackage || ""];
								}

								// Package was required.
								// Package is not a system module.
								// Package should have been found in bundled dependencies but was not.
								// Package is likely declared as optional dependency but not installed (i.e. bundled).
								if (!aliasdPackageDescriptor) {
									// TODO: Check `packageDescriptor.combined.dependencies` to see if declared as optional.
									// We assume package will be provided at runtime.
									return callback(null, true, "", {});
								}

								if (idParts[0]) {
									packageDescriptor.memoized.mappings[idParts[0]] = aliasdPackageDescriptor.id;
								}

								var modulePath = null;
								var memoizeId = null;

								if (idParts.length > 1) {
									if (
										aliasdPackageDescriptor.combined.layout &&
										aliasdPackageDescriptor.combined.layout.directories &&
										aliasdPackageDescriptor.combined.layout.directories.lib
									) {
										// HACK: We need a toggle for whether to always inject lib dir or not.
										//		 For now we simply skip injecting lib dir if second id segment matches lib dir.
										if (idParts.length >= 2 && idParts[1] !== aliasdPackageDescriptor.combined.layout.directories.lib.replace(/^\.\//, "")) {
											idParts[1] = aliasdPackageDescriptor.combined.layout.directories.lib.replace(/^\.\//, "") + "/" + idParts[1];
										}
									}
									modulePath = PATH.join(aliasedPackagePath, exports.normalizeExtension(idParts.slice(1).join("/")));
									memoizeId = PATH.join(aliasdPackageDescriptor.id + "/" + idParts.slice(1).join("/"));
								} else {

									var entryPointProperty = ["main"];
									if (options.$pinf) {
										var programInfo = options.$pinf.getProgramInfo();
										if (
											programInfo &&
											programInfo.program &&
											programInfo.program.descriptor &&
											programInfo.program.descriptor.config &&
											programInfo.program.descriptor.config["github.com/pinf-it/pinf-it-bundler/0"] &&
											programInfo.program.descriptor.config["github.com/pinf-it/pinf-it-bundler/0"].target
										) {
											if (programInfo.program.descriptor.config["github.com/pinf-it/pinf-it-bundler/0"].target === "browser") {
												entryPointProperty = ["browser", "main"];
											}
										}
									}

									var useEntryPoint = entryPointProperty.filter(function (propertyName) {
										return (
											aliasdPackageDescriptor.combined.exports &&
											aliasdPackageDescriptor.combined.exports[propertyName]
										);
									});
									if (useEntryPoint.length === 0) {
										throw new Error("`exports[" + entryPointProperty.join("|") + "]` must be set if no module specified when requiring package '" + id + "' from package '" + path + "'");
									}
									modulePath = PATH.join(aliasedPackagePath, aliasdPackageDescriptor.combined.exports[useEntryPoint[0]]);
									memoizeId = PATH.join((aliasdPackageDescriptor.id || idParts[0]) + aliasdPackageDescriptor.combined.exports[useEntryPoint[0]].replace(/^\.|\.js$/, ""));
								}

								return callback(null, modulePath, memoizeId, packageExtras);
							} catch(err) {
								return callback(err);
							}
						});
					}
				}];
				return callback(null, packages[path][0], packages[path][1]);
			});
		}

		return getPackageDescriptorForPath(bundleFilePath, options, function(err, packageDescriptor, packageExtras) {
			if (err) return callback(err);

			var rootModule = options.rootModule;
			if (!rootModule) {

				var entryPointProperty = ["main"];
				if (options.$pinf) {
					var programInfo = options.$pinf.getProgramInfo();
					if (
						programInfo &&
						programInfo.program &&
						programInfo.program.descriptor &&
						programInfo.program.descriptor.config &&
						programInfo.program.descriptor.config["github.com/pinf-it/pinf-it-bundler/0"] &&
						programInfo.program.descriptor.config["github.com/pinf-it/pinf-it-bundler/0"].target
					) {
						if (programInfo.program.descriptor.config["github.com/pinf-it/pinf-it-bundler/0"].target === "browser") {
							entryPointProperty = ["browser", "main"];
						}
					}
				}

				var useEntryPoint = entryPointProperty.filter(function (propertyName) {
					return (
						packageDescriptor.combined.exports &&
						packageDescriptor.combined.exports[propertyName]
					);
				});
				if (useEntryPoint.length === 0) {
					return callback(new Error("Package descriptor for '" + bundleFilePath + "' does not declare `" + entryPointProperty.join("|") + "` module"));
				}
				rootModule = packageDescriptor.combined.exports[useEntryPoint[0]];
			}
			var rootPackage = options.rootPackage || "";

			var opts = {};
			for (var name in options) {
				opts[name] = options[name];
			}
			opts.packageExtras = packageExtras || null;

			opts.finalizeBundle = function(bundleDescriptor, bundle, callback) {
				for (var packagePath in packages) {

					if (options.test || options.omitMtimeMeta) {
						packages[packagePath][0].mtime = "0";
					}

					if (
						packages[packagePath][0].combined.imports &&
						packages[packagePath][0].combined.imports.globals
					) {
						if (!bundleDescriptor.imports) {
							bundleDescriptor.imports = {};
						}
						if (!bundleDescriptor.imports.globals) {
							bundleDescriptor.imports.globals = {};
						}
						Object.keys(packages[packagePath][0].combined.imports.globals).forEach(function (name) {
							bundleDescriptor.imports.globals[name] = true;
						});
					}

					var memoized = packages[packagePath][0].memoized || {};
					memoized.dirpath = packages[packagePath][0].dirpath;

					if (Object.keys(memoized).length > 0) {
						var pkgId = packages[packagePath][0].id || options.rootPackage || "";
					}

					bundleDescriptor.modules[pkgId + "/package.json"] = {
						requireId: pkgId + "/package.json",
						memoizeId: pkgId + "/package.json",
						descriptor: packages[packagePath][0],
						wrapper: "json"
					};
					bundle.setModule(
						pkgId + "/package.json",
						JSON.stringify(memoized, null, 4), {
							filename: packages[packagePath][0].dirpath + "/package.json"
						}, {
							file: null,
							mtime: 0,
							wrapper: "json",
							format: "json"
						}
					);
				}
				return callback(null);
			}

			opts.rootModule = rootModule;


			opts.onSubPackageBundle = function (packageDescriptor, idPrefix, bundleDescriptor) {

				// TODO: Instead of collapsing lower bundles into the same map
				//       we may want to show which package exported bundles belong to?
				for (var bundleId in bundleDescriptor.bundles) {
					bundlePackageDescriptor.bundles["/" + idPrefix + bundleId] = bundleDescriptor.bundles[bundleId];
				}

				bundleDescriptor.warnings.forEach(function(warning) {
					bundlePackageDescriptor.warnings.push([].concat(warning, "file", rootModule));
				});
				bundleDescriptor.errors.forEach(function(error) {
					bundlePackageDescriptor.errors.push([].concat(error, "file", rootModule));
				});
			}

			options.__top.mainModules[PATH.join(opts.distPath, opts.rootModule || "")] = true;
			

			// We set 'options.rootModuleBundleOnly' to our root bundle name so we know later if we are in a sub-package
			// where we will export sub bundles.
			if (opts.rootModuleBundleOnly === true) {
				opts.rootModuleBundleOnly = packageDescriptor.dirpath;
			}

			return exports.bundleFile(PATH.join(bundleFilePath, rootModule), opts, function(err, bundleDescriptor) {
				if (err) return callback(err);

				var bundleId = rootModule.replace(/^\.\//, "/");

				bundleDescriptor.id = bundleId;

				if (
					bundleDescriptor.modules[rootPackage + "/package.json"] &&
					typeof bundleDescriptor.modules[rootPackage + "/package.json"].descriptor.dirpath === "undefined"
				) {
					packageDescriptor.memoized = bundleDescriptor.modules[rootPackage + "/package.json"].descriptor.memoized;
					bundleDescriptor.modules[rootPackage + "/package.json"].descriptor = packageDescriptor;
				}

				bundlePackageDescriptor.bundles[bundleId] = bundleDescriptor;

				bundleDescriptor.warnings.forEach(function(warning) {
					bundlePackageDescriptor.warnings.push([].concat(warning, "file", rootModule));
				});
				bundleDescriptor.errors.forEach(function(error) {
					bundlePackageDescriptor.errors.push([].concat(error, "file", rootModule));
				});

				return callback(null, bundleDescriptor);
			});
		});
	}

	if (options.debug) console.log("[pinf-it-bundler] bundlePackage", bundlePackagePath, "(", options._realpath(bundlePackagePath), ")");

	return bundleFile(bundlePackagePath, function(err, bundleDescriptor) {
		if (err) return callback(err);

		bundlePackageDescriptor.exports = {
			main: bundleDescriptor.id
		};

		return callback(null, bundlePackageDescriptor);
	});
}

exports.bundleFile = function(bundleFilePath, options, callback) {
	try {

		ASSERT.equal(typeof options, "object");
		ASSERT.equal(typeof options.distPath, "string");

		options.API = {
			FS: (options.$pinf && options.$pinf.getAPI("FS")) || FS
		};

		options._realpath = function(path) {
			if (!options.rootPath) return path;
			if (/^\//.test(path)) return path;
			return PATH.join(options.rootPath, path);
		}
	
		options._relpath = function(path) {
			if (!path || !options.rootPath || !/^\//.test(path)) return path;
			return PATH.relative(options.rootPath, path);
		}

		var bundleDescriptor = null;
		var bundle = null;
		var rootPackage = options.rootPackage || "";
		var rootPackageDescriptor = null;
		var packageDescriptors = {};

		options.packageDescriptorForModule = function(path, callback) {
			return PACKAGE_INSIGHT.findPackagePath(options._realpath(path), function(err, path) {
				if (err) return callback(err);
				path = options._relpath(path);
				if (packageDescriptors[path]) {
					return callback(null, packageDescriptors[path]);
				}
				return PACKAGE_INSIGHT.parse(path, options, function(err, packageDescriptor) {
					if (err) return callback(err);
					if (packageDescriptor.errors.length > 0) {
						packageDescriptor.errors.forEach(function(error) {
							console.error(error, new Error().stack);
						});
						return callback(new Error("We had errors in package descriptor '" + path + "'!"));
					}

					var firstTime = !packageDescriptors[path];

					packageDescriptors[path] = packageDescriptor;

					return callback(null, packageDescriptor);
				});
			});
		}

		options.copyExportsForPackageDescriptor = function copyExportsForPackageDescriptor (packageDescriptor, callback) {
			if (!copyExportsForPackageDescriptor.exported) {
				copyExportsForPackageDescriptor.exported = {};
			}
			if (copyExportsForPackageDescriptor.exported[packageDescriptor.dirpath]) {
				return callback(null);
			}
			copyExportsForPackageDescriptor.exported[packageDescriptor.dirpath] = true;
			var waitfor = WAITFOR.serial(function (err) {
				if (err) {
					console.error("Exports copy error", err.stack || err[0].stack);
					return callback(err);
				}
//							console.log("Copied exports done!");
				return callback(null);
			});
			if (packageDescriptor.combined.exports) {
				[
					"images",
					"styles",
					"resources"
				].forEach(function (propertyName) {
					if (!packageDescriptor.combined.exports[propertyName]) {
						return;
					}
					Object.keys(packageDescriptor.combined.exports[propertyName]).forEach(function (route) {
						var sourcePath = PATH.join(options._realpath(packageDescriptor.dirpath), packageDescriptor.combined.exports[propertyName][route]);
						var targetPath = options._realpath(bundleDescriptor.bundle.path).replace(/\.js$/, "");
						if (packageDescriptor.id !== rootPackageDescriptor.id) {
							targetPath = PATH.join(targetPath, packageDescriptor.id);
						}
						targetPath = PATH.join(targetPath, route);
						// TODO: Use generic glob with copy rename logic to copy nested files from one dirtree to another.
						if (
							/\*$/.test(sourcePath) &&
							/\*$/.test(targetPath)
						) {
							waitfor(function (done) {
								if (options.debug) {
									console.log("Copy exports." + propertyName, sourcePath.replace(/\/\*$/, ""), "to", targetPath.replace(/\/\*$/, ""));
								}
								return FS.exists(targetPath.replace(/\/\*$/, ""), function (exists) {
									if (!exists) {
										FS.mkdirsSync(PATH.dirname(targetPath.replace(/\/\*$/, "")));
									}
									return FS.copy(sourcePath.replace(/\/\*$/, ""), targetPath.replace(/\/\*$/, ""), done);
								});
							});
						} else {
							waitfor(function (done) {
								if (options.debug) {
									console.log("Copy exports." + propertyName, sourcePath, "to", targetPath);
								}
								return FS.exists(targetPath, function (exists) {
									if (!exists) {
										FS.mkdirsSync(PATH.dirname(targetPath));
									}
									return FS.copy(sourcePath, targetPath, done);
								});
							});
						}
					});
				});
			}
			if (
				packageDescriptor.combined.exports &&
				packageDescriptor.combined.exports.bundles &&

				// We don't want to bundle exports for a package we already visited.
				!options.__top.exportedBundlesForPackage[packageDescriptor.dirrealpath]
			) {
				options.__top.exportedBundlesForPackage[packageDescriptor.dirrealpath] = true;

				for (var bundleId in packageDescriptor.combined.exports.bundles) {

					if (
						options.rootModuleBundleOnly === packageDescriptor.dirpath
// NOTE: This is commented out as we should not be exporting any other bundles and are already exporting the root bundle.
//						options.rootModule !== "./" + bundleId
					) {
						if (options.debug) {
							console.log("Skip generate bundles based on 'exports.bundles' for package '" + options._realpath(packageDescriptor.dirpath) + "' due to 'options.rootModuleBundleOnly === true'");
						}
						continue;
					}

					if (options.debug) {
						console.log("Generate bundle '" + bundleId + "' pointing to '" + packageDescriptor.combined.exports.bundles[bundleId] + "' for package '" + options._realpath(packageDescriptor.dirpath) + "' based on 'exports.bundles'");
					}

					waitfor(bundleId, function (bundleId, done) {

						var opts = {};
						for (var key in options) {
							opts[key] = options[key];
						}
//						opts.packageExtras = packageExtras || opts.packageExtras || null;

						// TODO: Populate if we want to bundle given a specific context.
						//opts.existingModules[id] = {};

						opts.distPath = PATH.join(opts.distPath, PATH.basename(bundleFilePath.replace(/\.js$/, "")), PATH.dirname(bundleId.replace(/^\//, "")), packageDescriptor.id);

						opts.distFilename = PATH.basename(bundleId);
						opts.rootModule = exports.normalizeExtension(packageDescriptor.combined.exports.bundles[bundleId]);

						// NOTE: We don't use `packageDescriptor.id` here as this bundle is exported
						//       and not referenced async in a module. If it was referenced async from a module
						//       we would have existing modules and not bundle all modules again.
						opts.rootPackage = "";

						// We don't want to bundle this export as it is the main export for the package
						// and will already have the inline contect bundle there.
						// TODO: Do this much more elegantly!
						var rootBundlePath = opts.distPath.split("/");
						rootBundlePath.pop();
						rootBundlePath.pop();
						rootBundlePath.push(opts.rootModule);
						rootBundlePath = rootBundlePath.join("/").replace(/\/\.\//g, "/");

						if (options.__top.mainModules[rootBundlePath]) {
							console.log("Already bundled package (rootBundlePath) '" + rootBundlePath + "' as found in:", options.__top.mainModules);
							return done();
						}

						opts.bundleRootModule = packageDescriptor.combined.exports.bundles[bundleId];

						// This builds a bundle for the given page using the given entry point
						// and places it into the runtime tree of the requiting sandbox where the
						// entry point would lie in the package.
						return exports.bundlePackage(packageDescriptor.dirpath, opts, function(err, descriptor) {									
							if (err) return done(err);
							// TODO: Do we need to call this?
//							if (options.on && options.on.newBundle) {
//								options.on.newBundle(path, descriptor);
//							}

							if (opts.onSubPackageBundle) {
								opts.onSubPackageBundle(packageDescriptor, opts.distPath.substring(options.distPath.length + 1), descriptor);
							}

							return done(null, descriptor);
						});
					});
				}
			}
			return waitfor();
		}

		function realpath (path, callback) {
			return options.API.FS.exists(options._realpath(path), function(exists) {
				if (exists) return callback(null, path);
				if (typeof options.locateMissingFile === "function") {
					return options.locateMissingFile(null, path, callback);
				}
				return callback(new Error("Missing dependency '" + path + "'"));
			});
		}

		function init(bundleFilePath, callback) {
			return options.packageDescriptorForModule(bundleFilePath, function(err, descriptor) {
				if (err) return callback(err);
				rootPackageDescriptor = descriptor;
				
				function makeBundlePath () {
					if (options.distFilename) {
						return PATH.join(options.distPath, options.distFilename);
					}
					if (descriptor && descriptor.dirpath !== ".") {
						var dirpath = options._realpath(descriptor.dirpath);
						return PATH.join(options.distPath, PATH.relative(dirpath, bundleFilePath));
					}

					if (/^\//.test(bundleFilePath)) {
						return PATH.join(options.distPath, PATH.basename(bundleFilePath));
					} else {
						return PATH.join(options.distPath, bundleFilePath);
					}
				}
				
				bundleDescriptor = {
					modules: {},
					expectExistingModules: {},
					bundle: {
						path: makeBundlePath()
					},
					warnings: [],
					errors: []
				};

				return options.copyExportsForPackageDescriptor(descriptor, callback);
			});
		}

		function openBundle(bundlePath, callback) {
			return BUNDLE.open(bundlePath, options, function(err, openedBundle) {
				if (err) return callback(err);
				bundle = openedBundle;
				return callback(null);
			});
		}

		function addFile(filePath, options, callback) {

			return MODULE_INSIGHT.parseFile(filePath, options, function(err, moduleDescriptor) {
				if (err) return callback(err);

				if (moduleDescriptor.errors.length > 0) {
					moduleDescriptor.errors.forEach(function(error) {
						console.error(error, new Error().stack);
					});
				}

				var descriptor = {
					requireId: options.id,
					memoizeId: exports.normalizeExtension(options.id),
					descriptor: moduleDescriptor,
					wrapper: {
						type: null,
						top: null,
						code: null,
						bottom: null
					},
					// The dependencies that the bundler will try and follow.
					dependencies: DEEPCOPY(moduleDescriptor.dependencies),
					warnings: [].concat(moduleDescriptor.warnings),
					errors: [].concat(moduleDescriptor.errors)
				};
				delete moduleDescriptor.warnings;
				delete moduleDescriptor.errors;

				if (options.existingModules && options.existingModules[descriptor.memoizeId]) {
					bundleDescriptor.expectExistingModules[descriptor.requireId] = options.existingModules[descriptor.memoizeId];
					return callback(null, descriptor);
				}

				return PROCESSOR.processModule(descriptor, options, function (err) {
					if (err) return callback(err);

					// TODO: So that it does not get passed on to children. This needs to be done elsewhere.
					delete options.requireContext;

					return WRAPPER.wrapModule(descriptor, options, function(err) {
						if (err) return callback(err);

						var header = WRAPPER.headerForWrapper(descriptor.wrapper.type);
						if (header) {
							bundle.setHeader({
								helper: descriptor.wrapper.type
							}, header);							
						}
						if (options.test || options.omitMtimeMeta) {
							descriptor.descriptor.mtime = 0;
						}

						bundleDescriptor.modules[descriptor.memoizeId] = descriptor;

						bundle.setModule(
							descriptor.memoizeId,
							(descriptor.wrapper.code || [
								descriptor.wrapper.top,
								descriptor.descriptor.code,
								descriptor.wrapper.bottom
							].join("\n")), {
								filename: descriptor.descriptor.filepath,
								variation: descriptor.variation || ""
							}, {
								file: filePath,
								mtime: ((options.test || options.omitMtimeMeta) ? 0 : moduleDescriptor.mtime),
								wrapper: descriptor.wrapper.type,
								format: moduleDescriptor.format,
								variation: descriptor.variation || ""
							}
						);

						return callback(null, descriptor);
					});
				});
			});
		}

		function resolveModuleId(packageDescriptor, moduleDescriptor, id, options, callback) {
//			console.log("resolveModuleId", id, "options.packageExtras.packagePath", options.packageExtras && options.packageExtras.packagePath, new Error().stack);

			// This assumes that if a directory is being referenced without a module path we return
			// the `index.js` module.
			// TODO: Look at at other criteria to determine index module?
			if (/\/$/.test(id)) {
				id = id + "index";
			}

			var memoizeId = id;
			if (/^\.{1,2}$/.test(id)) {
				memoizeId = id + moduleDescriptor.memoizeId;
			}
			id = exports.normalizeExtension(memoizeId);

			function finalize(callback) {
				// Assume path is relative to bundle root module.
				return callback(null, PATH.join(moduleDescriptor.descriptor.filepath, "..", id), "/" + memoizeId);
			}

			// Check for id relative to module.
			if (/^\./.test(id)) {
				var lookupPath = options._realpath(PATH.join(moduleDescriptor.descriptor.filepath, "..", memoizeId.replace(/\.js$/, "")));
				return options.API.FS.exists(lookupPath, function(nonJsModuleExists) {

					if (nonJsModuleExists) {

						return options.API.FS.stat(lookupPath, function(err, stat) {
							if (err) return callback(err);

							if (stat.isDirectory()) {
								return options.API.FS.exists(PATH.join(lookupPath, "package.json"), function(exists) {
									if (exists) {
										// Resolve to package dependency.
										if (options.packageExtras && typeof options.packageExtras.locateFileInPackage === "function") {
											return options.packageExtras.locateFileInPackage(moduleDescriptor, PATH.normalize(PATH.join(PATH.dirname(moduleDescriptor.memoizeId), memoizeId)), function(err, path, memoizeId, packageExtras) {
												if (err) return callback(err);
												if (path === true && !memoizeId) {
													// We have a system module.
													return callback(null, true);
												}
												if (!path || !memoizeId) return finalize(callback);
												return callback(null, path, memoizeId, packageExtras);
											});
										}
									}
									return options.API.FS.exists(options._realpath(PATH.join(moduleDescriptor.descriptor.filepath, "..", memoizeId, "index.js")), function(exists) {
										if (exists) {
											return callback(null, PATH.join(moduleDescriptor.descriptor.filepath, "..", memoizeId, "index.js"), PATH.join(moduleDescriptor.requireId, "..", memoizeId, "index"));
										}
										var ext = ((nonJsModuleExists && !stat.isDirectory()) ? "" : ".js");
										var lookupPath = options._realpath(PATH.join(moduleDescriptor.descriptor.filepath, "..",  memoizeId.replace(/\.js$/, "") + ext));
										return options.API.FS.exists(lookupPath, function(exists) {
											if (exists) {
												return callback(null, PATH.join(moduleDescriptor.descriptor.filepath, "..",  memoizeId.replace(/\.js$/, "") + ext), PATH.join(moduleDescriptor.requireId, "..", memoizeId.replace(/\.js$/, "") + ext));
											}
											return callback(new Error("Could not find module '" + memoizeId + "' close to path '" + moduleDescriptor.descriptor.filepath + "'"));
										});
									});
								});
							} else {
								return callback(null, PATH.join(moduleDescriptor.descriptor.filepath, "..", id), PATH.join(moduleDescriptor.requireId, "..", memoizeId));
							}
						});
					}
					
					lookupPath = options._realpath(PATH.join(moduleDescriptor.descriptor.filepath, "..", id));
					
					return options.API.FS.exists(lookupPath, function(exists) {
						if (exists) {
							return callback(null, PATH.join(moduleDescriptor.descriptor.filepath, "..", id), PATH.join(moduleDescriptor.requireId, "..", memoizeId));
						}
						lookupPath = options._realpath(PATH.join(moduleDescriptor.descriptor.filepath, "..", id + ".js"));
						return options.API.FS.exists(lookupPath, function(exists) {
							if (exists) {
								return callback(null, PATH.join(moduleDescriptor.descriptor.filepath, "..", id + ".js"), PATH.join(moduleDescriptor.requireId, "..", memoizeId));
							}
							if (options.debug) console.log("Warning: could not find module '" + memoizeId + "' close to path '" + moduleDescriptor.descriptor.filepath + "'. Assuming it will be provided at runtime.");
							//return callback(new Error("Could not find module '" + memoizeId + "' close to path '" + moduleDescriptor.descriptor.filepath + "'"));
							return callback(null, PATH.join(moduleDescriptor.descriptor.filepath, "..", id), PATH.join(moduleDescriptor.requireId, "..", memoizeId));
						});
					});
				});
			}
			// Resolve to package dependency.
			if (options.packageExtras && typeof options.packageExtras.locateFileInPackage === "function") {


//console.log("packageDescriptor.dirpath", packageDescriptor.dirpath);
//console.log("use options.packageExtras.locateFileInPackage from '" + options.packageExtras.packagePath + "' to lookup", memoizeId, new Error().stack);


				return options.packageExtras.locateFileInPackage(moduleDescriptor, memoizeId, function(err, path, memoizeId, packageExtras) {
					if (err) return callback(err);
					if (path === true && !memoizeId) {
						// We have a system module.
						return callback(null, true);
					}
					if (!path || !memoizeId) return finalize(callback);

					return options.API.FS.exists(options._realpath(path), function(exists) {
						if (exists) {
							return callback(null, path, memoizeId, packageExtras, packageExtras);
						}
						return options.API.FS.exists(options._realpath(PATH.join(path.replace(/\.js$/, ""), "index.js")), function(exists) {
							if (exists) {
								return callback(null, PATH.join(path.replace(/\.js$/, ""), "index.js"), memoizeId, packageExtras);
							}
							return options.API.FS.exists(options._realpath(path.replace(/\.js$/, "") + ".js"), function(exists) {
								if (exists) {
									return callback(null, path.replace(/\.js$/, "") + ".js", memoizeId, packageExtras);
								}
								return callback(new Error("Could not find module '" + memoizeId + "' close to path '" + path + "'"));
							});
						});
					});
					return callback(null, path, memoizeId, packageExtras);
				});
			}
			return finalize(callback);
		}

		function addStatic(path, memoizeId, options, callback) {
//			console.log("addStatic", path, memoizeId, "options.packageExtras.packagePath", options.packageExtras && options.packageExtras.packagePath, new Error().stack);
			return realpath(path, function(err, path) {
				if (err) return callback(err);
				options.id = memoizeId;
				return bundleStaticallyLinkedFiles(path, options, callback);
			});
		}

		function addDynamic(path, memoizeId, opts, callback) {
//			console.log("addDynamic", path, memoizeId, "opts.packageExtras.packagePath", opts.packageExtras && opts.packageExtras.packagePath, new Error().stack);
			if (!opts.existingModules) {
				opts.existingModules = {};
			}
			for (var id in bundleDescriptor.modules) {
				opts.existingModules[id] = {};
			}
			if (/^\//.test(memoizeId)) {
				opts.distPath = PATH.join(opts.distPath, opts.parentMemoizeId.replace(/^\/|\.js$/g, ""));
				delete opts.rootModule;
				return exports.bundleFile(path, opts, function(err, descriptor) {
					if (err) return callback(err);
					if (options.on && options.on.newBundle) {
						options.on.newBundle(path, descriptor);
					}
					return callback(null, descriptor);
				});
			} else {
				return options.packageDescriptorForModule(path, function(err, packageDescriptor) {
					if (err) return callback(err);

					return options.copyExportsForPackageDescriptor(packageDescriptor, function (err) {
						if (err) return callback(err);

						opts.distPath = PATH.join(opts.distPath, PATH.basename(bundleFilePath.replace(/\.js$/, "")), PATH.dirname(memoizeId.replace(/^\//, "")));
						opts.distFilename = PATH.basename(path);
						opts.rootModule = exports.normalizeExtension(memoizeId.replace(packageDescriptor.id, "."));
						opts.rootPackage = packageDescriptor.id;
						return exports.bundlePackage(packageDescriptor.dirpath, opts, function(err, descriptor) {									
							if (err) return callback(err);
							if (options.on && options.on.newBundle) {
								options.on.newBundle(path, descriptor);
							}
							return callback(null, descriptor);
						});
					});
				});
			}
		}

		function bundleStaticallyLinkedFiles(filePath, options, callback) {

			if (bundleDescriptor.modules[exports.normalizeExtension(options.id)]) return callback(null);

			return addFile(filePath, options, function(err, descriptor) {
				if (err) return callback(err);

				return options.packageDescriptorForModule(filePath, function(err, packageDescriptor) {
					if (err) return callback(err);

					return options.copyExportsForPackageDescriptor(packageDescriptor, function (err) {
						if (err) return callback(err);

						var waitfor = WAITFOR.serial(function(err) {
							if (err) return callback(err);
							descriptor.warnings.forEach(function(warning) {
								bundleDescriptor.warnings.push([].concat(warning, "module", descriptor.memoizeId));
							});
							descriptor.errors.forEach(function(error) {
								bundleDescriptor.errors.push([].concat(error, "module", descriptor.memoizeId));
							});
							return callback(null, descriptor);
						});

						function addDependency(type, id, requireContext, done) {
	//console.log("addDependency", "type, id", type, id, "for module", filePath, "options.packageExtras.packagePath", options.packageExtras.packagePath, "packageDescriptor.dirpath", packageDescriptor.dirpath);
	//console.log("descriptor.dependencies", descriptor.dependencies);
							function callback(err) {
								if (err) {
									if (err.code === 404) {
										// We are ignoring the dependency to let the runtime loader deal with it.
										console.log("WARN: Ignoring missing dependency '" + type + "' (" + id + ") which means runtime loader must deal with it.");
										descriptor.warnings.push([
											"bundle-" + type, err.message, "WARN: Ignoring missing dependency '" + type + "' (" + id + ") which means runtime loader must deal with it."
										]);
										return done(null);
									}
									var stack = err.stack;
									if (options.test) {
										stack = stack.replace(/at [\S\s]*/, "");
									}
									descriptor.errors.push([
										"bundle-" + type, err.message, stack
									]);
								}
								return done(null);
							}
							return resolveModuleId(packageDescriptor, descriptor, id, options, function(err, path, memoizeId, packageExtras) {
								if (err) return callback(err);
	//console.log("memoizeId", memoizeId, new Error().stack);

//console.log("resolved module id", id, path, memoizeId, "packageExtras.packagePath", packageExtras && packageExtras.packagePath);

								if (!packageExtras && path === "../../harviewer/webapp/scripts/jquery-plugins/jquery.json.js") {
									return callback(new Error("No 'packageExtras' returned while resolving module '" + id + "'!"));
								}

								if (
									bundleDescriptor.modules[exports.normalizeExtension(memoizeId)] ||
									bundleDescriptor.expectExistingModules[exports.normalizeExtension(memoizeId)]
								) return callback(null);

								if (options.existingModules && options.existingModules[exports.normalizeExtension(memoizeId)]) {
									bundleDescriptor.expectExistingModules[memoizeId] = options.existingModules[exports.normalizeExtension(memoizeId)];
									return callback(null, descriptor);
								}

								if (path === true && !memoizeId) {
									var bundle = false;
									// See if we should convert module from default (nodejs) to other format.
									// TODO: Do this in a plugin (it.pinf.nodejs)
									if (options.$pinf) {
										var programInfo = options.$pinf.getProgramInfo();
										if (
											programInfo &&
											programInfo.program &&
											programInfo.program.descriptor &&
											programInfo.program.descriptor.config &&
											programInfo.program.descriptor.config["github.com/pinf-it/pinf-it-bundler/0"] &&
											programInfo.program.descriptor.config["github.com/pinf-it/pinf-it-bundler/0"].target
										) {
											if (programInfo.program.descriptor.config["github.com/pinf-it/pinf-it-bundler/0"].target === "browser") {
												// Use `browserify` to convert system module to browser format.
												if (BROWSER_BUILTINS[id]) {
													memoizeId = "/__SYSTEM__/" + id;
													path = BROWSER_BUILTINS[id];
												}
											}
										}
									}
									// We have a system module.
									if (path === true) return callback(null);
								}
								var opts = {};
								for (var key in options) {
									opts[key] = options[key];
								}
	//console.log("BEFORE ADD STATIC", "opts.packageExtras.packagePath", opts.packageExtras && opts.packageExtras.packagePath);
	//console.log("BEFORE ADD STATIC", "packageExtras.packagePath", packageExtras && packageExtras.packagePath);

								opts.packageExtras = packageExtras || opts.packageExtras || null;
								opts.requireContext = requireContext;

								if (type === "static") {
									return addStatic(path, memoizeId, opts, callback);
								}
								if (options.forceMemoizeFiles && options.forceMemoizeFiles[exports.normalizeExtension(memoizeId)]) {
									return addStatic(path, memoizeId, opts, callback);
								}

								opts.parentMemoizeId = exports.normalizeExtension(options.id);

								return addDynamic(path, memoizeId, opts, callback);
							});
						}

						for (var id in descriptor.dependencies.static) {
							waitfor("static", id, descriptor.dependencies.static[id], addDependency);
						}
						for (var id in descriptor.dependencies.dynamic) {
							waitfor("dynamic", id, descriptor.dependencies.dynamic[id], addDependency);
						}

						if (
							packageDescriptor &&
							packageDescriptor.combined["require.async"]
						) {
							var lookupId = null;
							if (packageDescriptor.id === rootPackageDescriptor.id) {
								lookupId = exports.normalizeExtension("." + options.id);
							} else {
								lookupId = exports.normalizeExtension(options.id.replace(packageDescriptor.id, "."));
							}
							var rules = packageDescriptor.combined["require.async"];

							// TODO: Expand on these matching rules to incrorporate '*' wildcard selectors.
							if (rules[lookupId]) {
								waitfor("dynamic", rules[lookupId], {}, addDependency);
							}
						}

						return waitfor();
					});
				});
			});
		}

		function finalizeBundle(callback) {

			function finalize (callback) {
				if (
					bundleDescriptor.imports &&
					bundleDescriptor.imports.globals
				) {
					bundle.declareGlobals(bundleDescriptor.imports.globals);
				}
				return bundle.save(callback);
			}

			if (typeof options.finalizeBundle === "function") {
				return options.finalizeBundle(bundleDescriptor, bundle, function(err) {
					if (err) return callback(err);
					return finalize(callback);
				});
			}
			return finalize(callback);
		}

		if (options.debug) console.log("[pinf-it-bundler] bundleFile", bundleFilePath);

		return realpath(bundleFilePath, function(err, bundleFilePath) {
			if (err) return callback(err);

			return init(bundleFilePath, function(err) {
				if (err) return callback(err);

				return openBundle(bundleDescriptor.bundle.path, function(err) {

					function _callback () {
						var args = arguments;
						if (!bundle) {
							return callback.apply(null, args);
						}
						return bundle.close(function(err) {
							if (err) {
								console.error("Ignoring error while cleaning up after error", err.stack);
							}
							return callback.apply(null, args);
						});
					}

					if (err) return _callback(err);

					var opts = {};
					for (var key in options) {
						opts[key] = options[key];
					}

					opts.id = PATH.normalize(rootPackage + "/" + (options.rootModule || PATH.basename(bundleFilePath)).replace(/\.js/, ""));

					return bundleStaticallyLinkedFiles(bundleFilePath, opts, function(err, moduleDescriptor) {
						if (err) return _callback(err);

						var waitfor = WAITFOR.serial(function(err) {
							if (err) return _callback(err);

							if (options.existingModules && options.existingModules[rootPackage + "/package.json"]) {
								bundleDescriptor.expectExistingModules[rootPackage + "/package.json"] = options.existingModules[rootPackage + "/package.json"];
							} else {
								if (!bundleDescriptor.modules[rootPackage + "/main"] && !bundleDescriptor.modules[rootPackage + "/package.json"]) {									
									bundleDescriptor.modules[rootPackage + "/package.json"] = {
										requireId: rootPackage + "/package.json",
										memoizeId: rootPackage + "/package.json",
										descriptor: {
											memoized: {
												main: moduleDescriptor.memoizeId
											}
										},
										wrapper: "json"
									};
									bundle.setModule(
										exports.normalizeExtension(rootPackage + "/package.json"), JSON.stringify({
											main: moduleDescriptor.memoizeId
										}, null, 4), {
											filename: moduleDescriptor.descriptor.filepath
										}, {
											file: "",
											mtime: 0,
											wrapper: "json",
											format: "json"
										}
									);
								}
							}

							return finalizeBundle(function(err) {
								if (err) return _callback(err);

								return _callback(null, bundleDescriptor);
							});
						});

						if (options.forceMemoizeFiles) {
							for (var memoizeId in options.forceMemoizeFiles) {
								waitfor(memoizeId, function(memoizeId, done) {
									addStatic(options.forceMemoizeFiles[memoizeId], memoizeId.replace(/\.js/, ""), options, done);
								});
							}
						}
						waitfor();
					});
				});
			});
		});

	} catch(err) {
		return callback(err);
	}
}
