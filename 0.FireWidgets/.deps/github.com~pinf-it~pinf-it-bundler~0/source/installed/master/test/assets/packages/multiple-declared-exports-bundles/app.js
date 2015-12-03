
const WORKER = require("util/worker");


exports.main = function (callback) {

	WORKER.run(callback);

	return null;
}
