
const ASSERT = require("assert");
const PATH = require("path");
const FS = require("fs-extra");
const Q = require("q");
const BUNDLER = require("./bundler");
const COLORS = require("colors");


exports.bundlePackage = function(bundlePackagePath, bundleOptions, callback) {

	ASSERT.equal(typeof bundleOptions, "object");
	ASSERT.equal(typeof bundleOptions.distPath, "string");
	ASSERT.equal(typeof bundleOptions.onRun, "function");

	bundleOptions.API = {
		FS: FS
	};

	bundleOptions._realpath = function(path) {
		if (!bundleOptions.rootPath) return path;
		if (/^\//.test(path)) return path;
		return PATH.join(bundleOptions.rootPath, path);
	}

	var rootBundlePath = null;

	var startTime = Date.now();
	if (bundleOptions.verbose) console.log(("[pinf-it-bundler][rt-bundler][START] request bundled package: " + bundlePackagePath).inverse);

	function bypassIfWeCan(proceedCallback) {
		if (!bundleOptions.$pinf) {
			return proceedCallback(callback);
		}
		var gateway = bundleOptions.$pinf.gateway("vfs-write-from-read-mtime-bypass");
		// All criteria that makes this call (argument combination) unique.
		gateway.setKey({
			bundlePackagePath: bundlePackagePath,
			distPath: bundleOptions.distPath,
			rootModule: bundleOptions.rootModule,
			rootPath: bundleOptions.rootPath
		});
		// NOTE: `callback` will be called by gateway right away if we can bypass.
		return gateway.onDone(callback, function(err, proxiedCallback) {
			if (err) return 
			// If callback was triggered above we will get an empty callback back so we can just stop here.
			if (!proxiedCallback) return;
			bundleOptions.API.FS = gateway.getAPI("FS");
			return proceedCallback(function() {
				if (bundleOptions.verbose) console.log(("[pinf-it-bundler][rt-bundler][END] (" + (Date.now() - startTime) + " ms) request bundled package: " + bundlePackagePath + " (distPath: " + bundleOptions.distPath + ")").inverse);
				return proxiedCallback.apply(this, arguments);
			});
		}, function(cachedData, cacheMeta) {
			if (bundleOptions.verbose) console.log(("[pinf-it-bundler][rt-bundler] using cached bundle (based on: " + cacheMeta.cachePath + ")").green);
			var bundleDescriptors = cachedData.bundleDescriptors;
			bundleDescriptors["#pinf"].status = 304;
			if (bundleOptions.verbose) console.log(("[pinf-it-bundler][rt-bundler][END] (" + (Date.now() - startTime) + " ms) request bundled package: " + bundlePackagePath).inverse);
			// NOTE: Keep in sync with return values used at bottom of this code file.			
			return callback(null, bundleDescriptors, {
				ensureAsync: function(moduleObj, pkg, sandbox, canonicalId, options, callback) {

					if (bundleOptions.debug) console.log("[pinf-it-bundler][rt-bundler] ensureAsync (originally bypassed)", "moduleObj", moduleObj, "pkg", pkg, "sandbox", sandbox, "canonicalId", canonicalId);

				 	var identifier = options.resolveIdentifier(canonicalId);
				 	if (identifier && identifier[0].descriptor) {
						var sourcePath = PATH.join(identifier[0].descriptor.dirpath, identifier[1]);
						if (cachedData.bundleDescriptors[sourcePath]) {
							// We are all good. Dynamic bundle should be available as it was found in `cachedData.bundleDescriptors`
							// which gets generated when root bundle and reachable dynamic bundles get generated.
							return callback(null);
						} else {
						 	//if (bundleOptions.$pinf) bundleOptions.$pinf.getAPI("console").optimization("To avoid spinning up the bundler, ensure the '" + BUNDLER.normalizeExtension(canonicalId) + "' bundle gets generated along with the parent bundle '" + moduleObj.bundle + "' by configuring an async require rule in the package descriptor '" + pkg.id + "' for module '" + moduleObj.id + "' contained in the parent bundle.");
						}
				 	}

				 	// TODO: Match more cases above where bundle should be found.

					console.log("TODO: `require.async()` was called. We need more asynchronosly required modules. Spin up bundler based on existing bundles and generate missing bundle for module.");
					throw new Error("TODO: `require.async()` was called. We need more asynchronosly required modules. Spin up bundler based on existing bundles and generate missing bundle for module.");
				},
				resolveDynamicSync: function (moduleObj, pkg, sandbox, canonicalId, options) {
					// NOTE: We should never get here. The loader should intercept the call
					//		 and service it based on instructions from a meta file.
					throw new Error("Module `" + canonicalId + "` not found!");
				}
			});
		});
	}

	return bypassIfWeCan(function(callback) {

		if (bundleOptions.verbose) console.log(("[pinf-it-bundler][rt-bundler] bundle package: " + bundlePackagePath).yellow);

		var bundleDescriptors = {};

		function bundleDescriptorForId(bundleId) {
			for (var id in bundleDescriptors) {
				if (id === bundleId) {
					if (bundleDescriptors[id].bundles) {
						return bundleDescriptors[id].bundles[bundleDescriptors[id].exports.main];
					} else {
						return bundleDescriptors[id];
					}
				}
				for (var subid in bundleDescriptors[id].bundles) {
					if (bundleDescriptors[id].bundles[subid].bundle.path === bundleId) {
						return bundleDescriptors[id].bundles[subid];
					} else
					if ((bundleOptions.distPath + subid) === bundleId) {
						return bundleDescriptors[id].bundles[subid];
					}
				}
			}
			return null;
		}

		function getExistingModules(moduleObj) {

			var loaderReport = bundleOptions.getLoaderReport();

			ASSERT.equal(typeof loaderReport.sandboxes, "object");

			function getSandbox() {
				ASSERT.equal(typeof moduleObj.bundle, "string");

				for (var sandboxId in loaderReport.sandboxes) {

					ASSERT.equal(typeof loaderReport.sandboxes[sandboxId].bundles, "object");

					if (typeof loaderReport.sandboxes[sandboxId].bundles[moduleObj.bundle] === "undefined") continue;

					return loaderReport.sandboxes[sandboxId];
				}

				return false;
			}

			var sandbox = getSandbox();

			var modules = {};

			function forModule(moduleObj) {

				var bundleDescriptor = bundleDescriptorForId(moduleObj.bundle);

				if (bundleDescriptor) {
					for (var memoizeId in sandbox.modules) {
						if (!modules[memoizeId] && bundleDescriptor.modules[memoizeId]) {
							modules[memoizeId] = bundleDescriptor.modules[memoizeId];
							modules[memoizeId]._getBundleDescriptor = function() {
								return bundleDescriptor;
							}
						}
					}
				}

				if (moduleObj.parentModule) return forModule(moduleObj.parentModule);
			}

			forModule(moduleObj);

			return modules;
		}

		function getBundleBasePath(moduleObj) {

			ASSERT.equal(typeof moduleObj.bundle, "string");

			return moduleObj.bundle.replace(/\.js$/, "");
		}

		// `aliasid` is a mappings alias (if mappings info not memoized) or a
		// resolved package ID (if mappings info already memoized).
		function getMappingInfo (moduleObj, aliasid) {

			var loaderReport = bundleOptions.getLoaderReport();

			ASSERT.equal(typeof loaderReport.sandboxes, "object");

			var info = null;
			var packageDescriptorPaths = [];

			var packageDescriptor = null;
			var bundleDescriptor = null;
			var existingModules = getExistingModules(moduleObj);

			if (existingModules[moduleObj.pkg + "/package.json"]) {
				packageDescriptor = existingModules[moduleObj.pkg + "/package.json"].descriptor;
				bundleDescriptor = existingModules[moduleObj.pkg + "/package.json"]._getBundleDescriptor();
			} else {
				bundleDescriptor = bundleDescriptorForId(moduleObj.bundle);
				packageDescriptor = bundleDescriptor.modules[moduleObj.pkg + "/package.json"].descriptor
			}

			packageDescriptorPaths.push(PATH.join(bundleOptions.rootPath || "", packageDescriptor.dirpath));

			function forModule() {

				ASSERT.equal(typeof moduleObj.bundle, "string");

				for (var sandboxId in loaderReport.sandboxes) {

					ASSERT.equal(typeof loaderReport.sandboxes[sandboxId].bundles, "object");

					if (typeof loaderReport.sandboxes[sandboxId].bundles[moduleObj.bundle] === "undefined") continue;

					var sandbox = loaderReport.sandboxes[sandboxId];

					// See if `aliasid` is an alias for a package or resolved packge ID already.
					if (sandbox.modules[moduleObj.pkg + "/package.json"] && sandbox.modules[moduleObj.pkg + "/package.json"].mappings) {
						for (var alias in sandbox.modules["/package.json"].mappings) {
							if (sandbox.modules[moduleObj.pkg + "/package.json"].mappings[alias] === aliasid) {
								info = {
									alias: alias,
									pkg: aliasid,
									memoized: true
								};
								break;
							} else
							if (alias === aliasid) {
								info = {
									alias: aliasid,
									pkg: sandbox.modules[moduleObj.pkg + "/package.json"].mappings[alias],
									memoized: true
								};
								break;
							}
						}					
					}

					// If mapping was not found we look for it in the bundle info.
					if (!info) {
						for (var alias in packageDescriptor.combined.mappings) {
							if (packageDescriptor.combined.mappings[alias] === aliasid) {
								info = {
									alias: alias,
									pkg: aliasid,
									memoized: false
								};
								break;
							} else
							if (alias === aliasid) {
								info = {
									alias: aliasid,
									pkg: packageDescriptor.combined.mappings[alias],
									memoized: false
								};
								break;
							}
						}
					}

					if (info) {
						info.bundleDescriptor = bundleDescriptor;
						info.path = packageDescriptor.combined.dependencies.bundled[info.alias].location;
						var parentPath = packageDescriptor.dirpath.substring(bundlePackagePath.length + 1);
						if (parentPath) {
							info.path = "./" + PATH.join(parentPath, info.path);
						}
					}

					// We stop as we checked the sandbox 
					return;
				}
			}

			if (moduleObj.pkg === aliasid) {

				if (bundleOptions.debug) console.log("[pinf-it-bundler] getMappingInfo", "aliasid", aliasid);
				if (bundleOptions.debug) console.log("[pinf-it-bundler] getMappingInfo", "packageDescriptor.dirpath", packageDescriptor.dirpath, "bundlePackagePath", bundlePackagePath);
				if (bundleOptions.debug) console.log("[pinf-it-bundler] getMappingInfo", "bundleOptions.rootPath", bundleOptions.rootPath);

				function realpath (path) {
					if (/^\//.test(path)) return path;
					return PATH.join(bundleOptions.rootPath, path);
				}
				
				function makePath () {
					return PATH.relative(
						realpath(bundlePackagePath),
						realpath(packageDescriptor.dirpath)
					);
					/*
					return (
						packageDescriptor.dirpath.substring(0, bundlePackagePath.length) === bundlePackagePath
					) ? packageDescriptor.dirpath.substring(bundlePackagePath.length + 1) : PATH.relative(
						realpath(bundlePackagePath),
						realpath(packageDescriptor.dirpath)
					)
					*/
				}

				info = {
					alias: aliasid,
					pkg: aliasid,
					memoized: true,
					bundleDescriptor: bundleDescriptor,
					path: makePath()
				};
			} else {

				if (bundleOptions.debug) console.log("[pinf-it-bundler] getMappingInfo", "2");

				forModule(moduleObj);
			}

			if (!info) {
//				console.log("moduleObj", moduleObj);
				throw new Error("Alias '" + aliasid + "' not found in mappings for package " + JSON.stringify(packageDescriptorPaths));
			}

			return info;
		}

		if (!bundleOptions.on) {
			bundleOptions.on = {};
		}
		bundleOptions.on.newBundle = function(path, descriptor) {
			bundleDescriptors[path] = descriptor;			
		}

		return BUNDLER.bundlePackage(bundlePackagePath, bundleOptions, function(err, descriptor) {
			if (err) return callback(err);

			bundleDescriptors[bundlePackagePath] = descriptor;

			try {

				ASSERT(typeof descriptor === "object");

				if (descriptor.errors.length > 0) {
					descriptor.errors.forEach(function(error) {
						var err = new Error("Got '" + error[0] + "' error '" + error[1] + "' for '" + bundlePackagePath + "'");
						err.stack = error[2];
						throw err;
					});
				}

			} catch(err) {
				return callback(err);
			}

			var bundling = [];

			function resolveDynamicSync (moduleObj, pkg, sandbox, canonicalId, options) {

				if (bundleOptions.debug) console.log("[pinf-it-bundler] resolveDynamicSync", "moduleObj", moduleObj, "pkg", pkg, "sandbox", sandbox, "canonicalId", canonicalId);

				var path = null;

				moduleObj = moduleObj || options.lastModuleRequireContext.moduleObj;

				var bundleBasePath = getBundleBasePath(moduleObj);

				if (bundleOptions.debug) console.log("[pinf-it-bundler] resolveDynamicSync", "bundleBasePath", bundleBasePath);

				if (/^\//.test(canonicalId)) {
					path = PATH.join(bundleBasePath, canonicalId);

					if (!bundleOptions.API.FS.existsSync(PATH.join(bundleOptions.rootPath || "", path))) {
						var filePath = PATH.join(bundlePackagePath, canonicalId);

						var options = {
							$pinf: bundleOptions.$pinf || null,
							debug: bundleOptions.debug || false,
							test: bundleOptions.test || false,
							rootPath: bundleOptions.rootPath,
							distPath: bundleBasePath,
							existingModules: getExistingModules(moduleObj)
						};

						var deferred = Q.defer();
						BUNDLER.bundleFile(filePath, options, function(err, descriptor) {
							if (err) return deferred.reject(err);

							bundleDescriptors[path] = descriptor;

							return deferred.resolve();
						});
						bundling.push(deferred.promise);
						// We throw to stop sandbox execution and catch it below
						// so we can re-run sandbox when bundle is generated.
						var error = new Error("Bundling dynamic require '" + canonicalId + "' for '" + ((moduleObj.parentModule && moduleObj.parentModule.id) || "<main>") + "'.");
						error.code = "BUNDLING_DYNAMIC_REQUIRE";
						throw error;
					}
				} else {

					if (/^\./.test(canonicalId)) {
						var parentId = PATH.dirname(moduleObj.id);
						canonicalId = (parentId==="/"?".":"") + PATH.normalize(PATH.join(parentId, canonicalId));
					}

					var canonicalIdParts = canonicalId.split("/");
					var alias = canonicalIdParts.shift();
					var id = canonicalIdParts.join("/");

					if (bundleOptions.debug) console.log("[pinf-it-bundler] resolveDynamicSync", "canonicalIdParts", canonicalIdParts, "alias", alias, "id", id);

					var mappingInfo = null;
					if (/^\./.test(alias)) {
						mappingInfo = {
							alias: "",
							path: "",
							pkg: "",
							memoized: true
						}
					} else {
						mappingInfo = getMappingInfo(moduleObj, alias);		
					}
					// Update alias and canonicalId if alias was a resolved package ID.
					if (mappingInfo.alias !== alias) {
						alias = mappingInfo.alias;
						canonicalId = alias + "/" + id;
					}

					if (bundleOptions.debug) console.log("[pinf-it-bundler] resolveDynamicSync", "mappingInfo", mappingInfo);
					if (bundleOptions.debug) console.log("[pinf-it-bundler] resolveDynamicSync", "canonicalId", canonicalId);

					var distId = null;
					if (mappingInfo.pkg) {
						distId = PATH.normalize(mappingInfo.pkg + ((id) ? "/" + id : ""));//.replace(/\//g, "+")
					} else {
						distId = PATH.normalize(id);//.replace(/\//g, "+")
					}
					var distFilename = options.normalizeIdentifier(distId);

					if (bundleOptions.debug) console.log("[pinf-it-bundler] resolveDynamicSync", "distFilename", distFilename);

					path = PATH.join(bundleBasePath, distFilename);

					if (bundleOptions.debug) console.log("[pinf-it-bundler] resolveDynamicSync", "path", path, "absolute", PATH.join(bundleOptions.rootPath || "", path));

					if (!bundleOptions.API.FS.existsSync(PATH.join(bundleOptions.rootPath || "", path))) {

						if (bundleOptions.debug) console.log("[pinf-it-bundler] resolveDynamicSync", "bundlePackagePath", bundlePackagePath, "(", bundleOptions._realpath(bundlePackagePath) ,")");
						if (bundleOptions.debug) console.log("[pinf-it-bundler] resolveDynamicSync", "mappingInfo.path", mappingInfo.path, "(", bundleOptions._realpath(mappingInfo.path) ,")");

						var filePath = PATH.join(bundlePackagePath, mappingInfo.path);

						if (bundleOptions.debug) console.log("[pinf-it-bundler] resolveDynamicSync", "filePath", filePath, "(", bundleOptions._realpath(filePath) ,")");

						var opts = {
							$pinf: bundleOptions.$pinf || null,
							debug: bundleOptions.debug || false,
							test: bundleOptions.test || false,
							rootPath: bundleOptions.rootPath,
							distPath: bundleBasePath,
							distFilename: distFilename,
							// TODO: Compensate for `directories.lib`
							rootModule: ((id) ? "./" + PATH.normalize(options.normalizeIdentifier(id)) : "").replace(/^\.$/, ""),
							rootPackage: mappingInfo.pkg,
							existingModules: getExistingModules(moduleObj)
						};

						var deferred = Q.defer();
						BUNDLER.bundlePackage(filePath, opts, function(err, subDescriptor) {									
							if (err) return deferred.reject(err);

							bundleDescriptors[path] = subDescriptor;

							if (mappingInfo.memoized) return deferred.resolve();

							// We need to add the package mapping to the calling bundle.

							return BUNDLER.augmentBundle(mappingInfo.bundleDescriptor.bundle.path, opts, function(err, bundle, done) {
								if (err) return deferred.reject(err);

								var moduleInfo = bundle.modules[moduleObj.pkg + "/package.json"];
								var descriptor = JSON.parse(moduleInfo[0]);
								if (!descriptor.mappings) {
									descriptor.mappings = {};
								}
								if (pkg.id !== mappingInfo.pkg) {
									descriptor.mappings[mappingInfo.alias] = mappingInfo.pkg;
								}
								moduleInfo[0] = JSON.stringify(descriptor, null, 4);
								mappingInfo.bundleDescriptor.modules[moduleObj.pkg + "/package.json"].descriptor.memoized = descriptor;

								return done(function(err) {
									if (err) return deferred.reject(err);
									return deferred.resolve();
								});
							});
						});
						bundling.push(deferred.promise);
						// We throw to stop sandbox execution and catch it below
						// so we can re-run sandbox when bundle is generated.
						var error = new Error("Bundling dynamic require '" + canonicalId + "' for '" + ((moduleObj.parentModule && moduleObj.parentModule.id) || "<main>") + "'.");
						error.code = "BUNDLING_DYNAMIC_REQUIRE";
						throw error;
					}
				}
				return path;
			}

			function ensureAsync(moduleObj, pkg, sandbox, canonicalId, options, callback) {

				if (bundleOptions.debug) console.log("[pinf-it-bundler] ensureAsync", "moduleObj", moduleObj, "pkg", pkg, "sandbox", sandbox, "canonicalId", canonicalId);

			 	// If bundle is already cached we have nothing to do.
			 	if (bundleDescriptors[BUNDLER.normalizeExtension(canonicalId)]) {
			 		return callback(null);
			 	}
				try {
					resolveDynamicSync(moduleObj, pkg, sandbox, canonicalId, options);
					return callback(null);
				} catch(err) {
					if (err.code === "BUNDLING_DYNAMIC_REQUIRE") {
						// We wait until everything is bundled and then return.
						return Q.all(bundling).then(function() {
							return callback(null);
						}).fail(callback);
					}
					return callback(err);
				}
			}

			function runBundle() {

				return Q.fcall(function() {

					var deferred = Q.defer();
					var bundlePath = PATH.join(bundleOptions.distPath, descriptor.exports.main);

					if (!rootBundlePath) {
						rootBundlePath = bundlePath;
					}

					bundleOptions.onRun(bundlePath, {
						$pinf: bundleOptions.$pinf || null,
						debug: bundleOptions.debug || false,
						test: bundleOptions.test || false,
						rootPath: bundleOptions.rootPath,
						resolveDynamicSync: resolveDynamicSync,
						ensureAsync: ensureAsync
					}, function(err) {
						if (err) return deferred.reject(err);
						return deferred.resolve();
					});

					return deferred.promise;

				}).fail(function(err) {
					// If we are generating a missing bundle, we wait for it
					// and then re-run sandbox.
					if (err.code === "BUNDLING_DYNAMIC_REQUIRE") {
						return Q.all(bundling).then(function() {
							return runBundle();
						});
					}
					return Q.reject(err);
				});
			}

			return runBundle().then(function() {
				// NOTE: Keep in sync with return values used at top of this code file.
				bundleDescriptors["#pinf"] = {
					status: 200,
					data: {
						rootBundlePath: rootBundlePath
					}
				};
				return callback(null, bundleDescriptors, {
					ensureAsync: ensureAsync,
					resolveDynamicSync: resolveDynamicSync
				},
				// NOTE: This last argument gets taken by the gateway above to cache and return when bypassing.
				{
					rootBundlePath: rootBundlePath,
					bundleDescriptors: bundleDescriptors
				});
			}, callback);
		});
	});
}
