
exports.getGreeting = function() {

	var moduleId = "./assemble";

	return require(moduleId).assemble();
}
