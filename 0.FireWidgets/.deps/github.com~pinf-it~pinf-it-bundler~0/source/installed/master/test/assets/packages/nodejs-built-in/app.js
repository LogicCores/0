
const ASSERT = require("assert");
const PATH = require("path");
const FS = require("fs-extra");
const REQUEST = require("request");

function main() {

	ASSERT(typeof PATH, "object");

	console.log("Hello World");
}

if (require.main === module) {
	main();
}
