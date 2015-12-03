
const PATH = require("path");
const ASSERT = require("assert");
const FS = require("fs-extra");
const BUNDLE = require("../lib/bundle");


describe('bundle', function() {

	it('should export `open()`', function() {
		ASSERT(typeof BUNDLE.open === "function");
	});

	function compareAndRemove(source, target, callback) {
		var sourceCode = FS.readFileSync(source).toString();
		var targetCode = FS.readFileSync(target).toString();
		if (sourceCode !== targetCode) {
			return callback(new Error("Target file '" + target + "' is not identical to source file '" + source + "'"));
		}
		FS.removeSync(target);
		return callback(null);
	}

	it('should not allow 2+ `open()` on same bundle', function(done) {
		var path = PATH.join(__dirname, "assets/bundles/with-loader.js");
		return BUNDLE.open(path, {
			rootPath: PATH.dirname(__dirname)
		}, function(err, bundle) {
			if (err) return done(err);
			return BUNDLE.open(path, {
				rootPath: PATH.dirname(__dirname)
			}, function(err) {
				ASSERT.equal(typeof err, "object");
				ASSERT.equal(err.message, "Cannot open '/test/assets/bundles/with-loader.js'. Bundle already open by other instance.");
				return bundle.close(done);
			});
		});
	});

	it('should read and write bundle with loader', function(done) {
		var options = {
			//debug: true
		};
		return BUNDLE.open(PATH.join(__dirname, "assets/bundles/with-loader.js"), options, function(err, bundle) {
			if (err) return done(err);
			try {
				ASSERT.equal(typeof bundle, "object");
				ASSERT.deepEqual(bundle.headers, {});
				ASSERT.deepEqual(Object.keys(bundle.descriptors), [ '/package.json' ]);
				ASSERT.deepEqual(Object.keys(bundle.modules), [ '/main.js' ]);
				ASSERT.equal(typeof bundle.report, "object");
				ASSERT.equal(Array.isArray(bundle.bundleLoader), true);
				ASSERT.deepEqual(bundle.bundleLoader[0], { bundleUrlPrefix: '/bundles/' });
				ASSERT.equal(Array.isArray(bundle.bundleLoader[1]), true);
				ASSERT.equal(bundle.bundleLoader[1].length, 2);
				return bundle.saveTo(PATH.join(__dirname, "assets/bundles/with-loader.saved.js"), function(err) {
					if (err) return done(err);
					return bundle.close(function(err) {
						if (err) return done(err);
						return compareAndRemove(
							PATH.join(__dirname, "assets/bundles/with-loader.js"),
							PATH.join(__dirname, "assets/bundles/with-loader.saved.js"),
							done
						);
					});
				});
			} catch(err) {
				return done(err);
			}
		});
	});

	it('should read and write bundle with just modules', function(done) {
		var options = {
			//debug: true
		};
		return BUNDLE.open(PATH.join(__dirname, "assets/bundles/just-modules.js"), options, function(err, bundle) {
			if (err) return done(err);
			try {
				ASSERT.equal(typeof bundle, "object");
				ASSERT.deepEqual(bundle.headers, {});
				ASSERT.deepEqual(Object.keys(bundle.descriptors), [
					'/package.json',
					'9600bb1b572fba81a38e7d3c0eb638268e6a9d8d/package.json',
					'80b6bcb59fc2b65675648d0e052b75b4620764ee/package.json',
					'aa0b8cfbcfff960996a8692caee6ae43f33d6a67/package.json'
				]);
				ASSERT.deepEqual(Object.keys(bundle.modules), [
					'/main.js',
					'9600bb1b572fba81a38e7d3c0eb638268e6a9d8d/greetings.js',
					'9600bb1b572fba81a38e7d3c0eb638268e6a9d8d/logger.js',
					'80b6bcb59fc2b65675648d0e052b75b4620764ee/words/hello.js',
					'aa0b8cfbcfff960996a8692caee6ae43f33d6a67/H.js'
				]);
				ASSERT.equal(typeof bundle.report, "object");
				ASSERT.deepEqual(bundle.bundleLoader, null);
				return bundle.saveTo(PATH.join(__dirname, "assets/bundles/just-modules.saved.js"), function(err) {
					if (err) return done(err);
					return bundle.close(function(err) {
						if (err) return done(err);
						return compareAndRemove(
							PATH.join(__dirname, "assets/bundles/just-modules.js"),
							PATH.join(__dirname, "assets/bundles/just-modules.saved.js"),
							done
						);
					});
				});

			} catch(err) {
				return done(err);
			}
		});
	});

	it('should read and write bundle with header', function(done) {
		var options = {
			//debug: true
		};
		return BUNDLE.open(PATH.join(__dirname, "assets/bundles/with-header.js"), options, function(err, bundle) {
			if (err) return done(err);
			try {
				ASSERT.equal(typeof bundle, "object");
				ASSERT.equal(typeof bundle.headers, "object");
				ASSERT.equal(typeof bundle.headers["{}"], "string");
				ASSERT.deepEqual(Object.keys(bundle.descriptors), [ '/package.json' ]);
				ASSERT.deepEqual(Object.keys(bundle.modules), [ '/main.js', '/greeting.js' ]);
				ASSERT.equal(typeof bundle.report, "object");
				ASSERT.deepEqual(bundle.bundleLoader, null);
				return bundle.saveTo(PATH.join(__dirname, "assets/bundles/with-header.saved.js"), function(err) {
					if (err) return done(err);
					return bundle.close(function(err) {
						if (err) return done(err);
						return compareAndRemove(
							PATH.join(__dirname, "assets/bundles/with-header.js"),
							PATH.join(__dirname, "assets/bundles/with-header.saved.js"),
							done
						);
					});
				});
			} catch(err) {
				return done(err);
			}
		});
	});

});
