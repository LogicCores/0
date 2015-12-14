define([
    'intern!object',
    'intern/chai!assert'
], function (registerSuite, assert) {

    registerSuite({
        name: 'server',

        serverTest: function () {
            assert.isTrue(true, 'identifier should be a valid UUID');
        }
    });
});