
const APP = require(".");

function main() {
	console.log(APP.getGreeting());
}

exports.getGreeting = function() {
	return "Hello World";
}

if (require.main === module) {
	main();
}
