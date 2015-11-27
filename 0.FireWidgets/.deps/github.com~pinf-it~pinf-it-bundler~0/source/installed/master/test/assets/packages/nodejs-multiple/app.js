
var GREETING = require("greeting");
var LIB = require("./lib");

function main() {
	console.log(GREETING[LIB.getGreetingMethodName()]());
}

if (require.main === module) {
	main();
}
