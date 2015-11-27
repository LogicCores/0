
function main() {

	var moduleId = "./greeting";

	try {
		var GREETING = require(moduleId);

		console.log(GREETING.getGreeting());
	} catch(err) {
		throw new Error("Sould not have thrown!");
	}
}

if (require.main === module) {
	main();
}
