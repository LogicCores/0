
exports.run = function (callback) {

	console.log("Hello from worker");

	var uri = require.sandbox.id + require.id("./worker-runner.js");

	console.log("Worker runner uri: " + uri);

	return require.sandbox(uri, function(sandbox) {

		return sandbox.main(callback);

	}, function (err) {
		console.log("Error while loading bundle '" + uri + "':", err.stack);
		return callback(err);
	});
}
