
exports.forPoly = function (POLYFILLS) {

    // TODO: Adjust library implementations to use polyfills if provided instead of
    //       native global implementations.

    var exports = {};

    exports._ = require("lodash");
    exports._.mixin(require("lodash-deep"));

    exports.EventEmitter = require("eventemitter2").EventEmitter2;
    exports.forge = require("node-forge");
    exports.uuid = require("uuid");

	exports.RegExp_Escape = require("escape-regexp-component");

    exports.send = require("send");

    exports.backbone = require("backbone");
	exports.numeral = require("numeral");
	exports.moment = require("moment");

	exports.assert = require("assert");
    exports.glob = require("glob");
    exports.path = require("path");

    exports.fs = require("fs-extra");
    POLYFILLS.Promise.promisifyAll(exports.fs);
    exports.fs.existsAsync = function (path) {
        return new POLYFILLS.Promise(function (resolve, reject) {
            return exports.fs.exists(path, resolve);
        });
    }

    exports.request = require("request");
    exports["require.async"] = require("require.async");

    exports.urijs = require("urijs");

    exports.waitfor = require("waitfor");

    exports.traverse = require("traverse");
    exports.CJSON = {
        stringify: require("canonical-json")
    };

    exports.ccjson = require("../lib/ccjson");

    exports["cores/data/for/ccjson.record.mapper/0-common.api"] = require("../cores/data/for/ccjson.record.mapper/0-common.api").forLib(exports);

    return exports;
}
