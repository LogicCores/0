
function main() {

	var moduleId = "./greeting";

	var GREETING = require(moduleId);

	console.log(GREETING.getGreeting());
}

exports.getWorld = function() {
	return "World";	
}

if (require.main === module) {
	main();
}
