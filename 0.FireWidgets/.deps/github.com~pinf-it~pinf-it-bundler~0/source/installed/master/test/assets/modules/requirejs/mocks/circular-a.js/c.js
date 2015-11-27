// @see https://github.com/jrburke/requirejs/blob/master/tests/circular/c.js
define(['circular-a', 'exports'], function (a, exports) {
    exports.name = 'c';
    exports.a = a;
});