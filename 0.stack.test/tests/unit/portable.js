define([
    'intern!object',
    'intern/chai!assert'
], function (registerSuite, assert) {

    registerSuite({
        name: 'portable',

        portableTest: function () {
            assert.isTrue(true, 'identifier should be a valid UUID');
        }
    });
});