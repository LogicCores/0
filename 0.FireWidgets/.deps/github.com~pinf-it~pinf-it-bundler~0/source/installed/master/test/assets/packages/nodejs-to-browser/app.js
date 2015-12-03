
var OS = require("os");

function main() {
	if (OS.type() === "Browser") {
		console.log("Hello World");
	} else {
		throw new Error("FAIL");
	}
}

if (require.main === module) {
	main();
}
