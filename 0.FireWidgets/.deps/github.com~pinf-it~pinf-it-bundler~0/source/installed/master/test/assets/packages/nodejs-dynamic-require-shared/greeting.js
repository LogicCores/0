
var APP = require("./app");

exports.getGreeting = function() {
	return "Hello " + APP.getWorld();
}
