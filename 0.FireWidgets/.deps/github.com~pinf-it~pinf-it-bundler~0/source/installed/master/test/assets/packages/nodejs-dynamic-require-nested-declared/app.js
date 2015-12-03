
function main() {

	var moduleId = "./greeting";

	var GREETING = require(moduleId);

	console.log(GREETING.getGreeting());
}

exports.getWorld = function() {
	return "World";	
}

exports.getLetterH = function() {
	return "H";	
}

if (require.main === module) {
	main();
}
