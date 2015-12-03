
exports.main = function (callback) {
	
	console.log("Hello from worker runner!");

	return callback(null, function () {
		return {
			loadedInWorkerRunner: true
		};
	});
}
