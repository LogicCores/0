// @see https://github.com/jrburke/requirejs/blob/master/tests/circular/b.js
define(['c', 'exports'], function (c, exports) {
    exports.name = 'b';
    exports.c = c;
});