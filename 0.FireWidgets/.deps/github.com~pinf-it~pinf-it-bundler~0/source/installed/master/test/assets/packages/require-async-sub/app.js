
exports.main = function (callback) {
	var name = "extra";
	require.async("./sub/" + name, function(EXTRA) {
		console.log(EXTRA.getGreeting());
		return callback(null, {
			loaded: true
		});
	}, callback);
	return null;
}
