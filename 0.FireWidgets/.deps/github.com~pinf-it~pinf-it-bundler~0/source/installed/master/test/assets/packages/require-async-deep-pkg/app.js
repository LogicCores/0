
exports.main = function (callback) {
	require.async("./extra", function(EXTRA) {
		return EXTRA.run(callback);
	}, callback);
	return null;
}
