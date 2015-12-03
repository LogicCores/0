
const PATH = require("path");
const FS = require("fs-extra");
const ASSERT = require("assert");
const CONFIG = require("..");

//const MODE = "test";
const MODE = "write";

const DEBUG = false;

describe('config', function() {

	describe('can load', function() {

		it('compact json-ld', function(done) {

			return CONFIG.fromFile(PATH.join(__dirname, "assets/various/fred.ld.json"), function(err, config) {
				if (err) return done(err);
				ASSERT.equal(typeof config, "object");
				ASSERT.equal(config.warnings.length, 0);
				ASSERT.deepEqual(config.activity, [
					["init", FS.readJsonSync(PATH.join(__dirname, "assets/various/fred.ld.json"))]
				]);
				return done();
			});

		});

		it('non json-ld', function(done) {

			return CONFIG.fromFile(PATH.join(__dirname, "assets/various/fred.json"), function(err, config) {
				if (err) return done(err);
				ASSERT.equal(typeof config, "object");
				ASSERT.deepEqual(config.warnings, [
					['JSONLD.expand()', 'NO_DATA']
				]);
				ASSERT.deepEqual(config.activity, [
					["init", FS.readJsonSync(PATH.join(__dirname, "assets/various/fred.json"))]
				]);
				return done();
			});

		});

	});

});
