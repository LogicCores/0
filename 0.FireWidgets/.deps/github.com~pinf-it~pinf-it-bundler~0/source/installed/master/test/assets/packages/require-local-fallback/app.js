
var OS = require("_os");

function main() {
	console.log("Hello " + OS.getPlatform());
}

if (require.main === module) {
	main();
}
