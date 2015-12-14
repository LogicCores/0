define([
	'intern!object',
	'intern/chai!assert',
	'intern/dojo/node!leadfoot/helpers/pollUntil'
], function (registerSuite, assert, pollUntil) {

	var url = 'http://127.0.0.1:8090/0/test-10CB0D92-C011-4288-90D6-1A0978DCBF0A/Tests/';

	registerSuite({
		name: 'Todo (functional)',

		'submit form': function () {
			var remote = this.remote;

			// @see https://theintern.github.io/leadfoot/Command.html

			var p = remote.get(url);
/*			
			setInterval(function () {

remote.getAvailableLogTypes().then(function (types) {

console.log("getAvailableLogTypes", types);				
	
	return remote.getLogsFor("browser").then(function (logs) {

console.log("logs", logs);				
		
	});
});
			}, 1000);
*/			
			return p.then(pollUntil('return document.querySelector("#page-content H1");', 15 * 1000))
				.findByCssSelector('#page-content H1')
				.getVisibleText()
				.then(function (text) {
					assert.equal(text, 'Tests');
				});
		}
	});
});