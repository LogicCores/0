
const ASSERT = require("assert");
const PATH = require("path");
const FS = require("fs");
const SPAWN = require("child_process").spawn;



function runCommands (rootPath, commands, callback) {
	console.log("Run commands:", commands, {
		cwd: rootPath
	});
	var env = process.env;
    var proc = SPAWN("bash", [
        "-s"
    ], {
    	cwd: rootPath,
    	env: env
    });
    proc.on("error", function(err) {
    	return callback(err);
    });
    var stdout = [];
    var stderr = [];
    proc.stdout.on('data', function (data) {
    	stdout.push(data.toString());
		process.stdout.write(data);
    });
    proc.stderr.on('data', function (data) {
    	stderr.push(data.toString());
		process.stderr.write(data);
    });
    proc.stdin.write(commands.join("\n"));
    proc.stdin.end();
    proc.on('close', function (code) {
    	if (code) {
    		var err = new Error("Commands exited with code: " + code);
    		err.code = code;
    		err.stdout = stdout;
    		err.stderr = stderr;
    		return callback(err);
    	}
        return callback(null, stdout.join(""));
    });
}

describe('sm.expand', function() {

	this.timeout(30 * 1000);

	describe('01-MastersFromGithub', function() {

		var smExpandPath = PATH.join(__dirname, "../sm.expand");
		var basePath = PATH.join(__dirname, "01-MastersFromGithub");
/*
		it("prepare", function (callback) {
			return runCommands(basePath, [
				"rm -Rf .deps > /dev/null",
				"rm -Rf node_modules > /dev/null",
			], callback);
	    });
*/
		it("run", function (callback) {
			return runCommands(basePath, [
				smExpandPath + " -vd"
			], callback);
	    });

		it("verify", function (callback) {

console.log("VERIFY");

			return callback(null);
	    });
	});


});

