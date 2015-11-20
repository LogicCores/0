
exports.forPoly = function (POLYFILLS) {

    // TODO: Adjust library implementations to use polyfills if provided instead of
    //       native global implementations.

    // We require the library modules using getters on demand to reduce the process
    // memory footprint if the libraries are not used.

    // NOTE: We cannot use the code below as the getter will not be called for some reason.
    //       Maybe because we proxy the getters by another getter defined in this way in './lib.js'?
    /*
    var modules = {
        "waitfor": "waitfor",
    };
    Object.keys(modules).forEach(function (name) {
        Object.defineProperty(exports, name, {
            get: function () {
                if (exportCache[name]) return exportCache[name];
                return (exportCache[name] = require(modules[name]));
            }
        });
    });
    */

    var exportCache = {};
    var exports = {
        get _ () {
            if (exportCache["_"]) return exportCache["_"];
            var api = require("lodash");
            api.mixin(require("lodash-deep"));
            return (exportCache["_"] = api);
        },
        get EventEmitter () {
            if (exportCache["EventEmitter"]) return exportCache["EventEmitter"];
            return (exportCache["EventEmitter"] = require("eventemitter2").EventEmitter2);
        },
        get forge () {
            if (exportCache["forge"]) return exportCache["forge"];
            return (exportCache["forge"] = require("node-forge"));
        },
        get jsonwebtoken () {
            if (exportCache["jsonwebtoken"]) return exportCache["jsonwebtoken"];
            return (exportCache["jsonwebtoken"] = require("jsonwebtoken"));
        },
        get uuid () {
            if (exportCache["uuid"]) return exportCache["uuid"];
            return (exportCache["uuid"] = require("uuid"));
        },
        get q () {
            if (exportCache["q"]) return exportCache["q"];
            return (exportCache["q"] = require("q"));
        },
        get RegExp_Escape () {
            if (exportCache["RegExp_Escape"]) return exportCache["RegExp_Escape"];
            return (exportCache["RegExp_Escape"] = require("escape-regexp-component"));
        },
        get express () {
            if (exportCache["express"]) return exportCache["express"];
            return (exportCache["express"] = require("express"));
        },
        get send () {
            if (exportCache["send"]) return exportCache["send"];
            return (exportCache["send"] = require("send"));
        },
        get backbone () {
            if (exportCache["backbone"]) return exportCache["backbone"];
            return (exportCache["backbone"] = require("backbone"));
        },
        get numeral () {
            if (exportCache["numeral"]) return exportCache["numeral"];
            return (exportCache["numeral"] = require("numeral"));
        },
        get moment () {
            if (exportCache["moment"]) return exportCache["moment"];
            return (exportCache["moment"] = require("moment"));
        },
        get "moment-timezone" () {
            if (exportCache["moment-timezone"]) return exportCache["moment-timezone"];
            return (exportCache["moment-timezone"] = require("moment-timezone"));
        },
        get assert () {
            if (exportCache["assert"]) return exportCache["assert"];
            return (exportCache["assert"] = require("assert"));
        },
        get glob () {
            if (exportCache["glob"]) return exportCache["glob"];
            return (exportCache["glob"] = require("glob"));
        },
        get path () {
            if (exportCache["path"]) return exportCache["path"];
            return (exportCache["path"] = require("path"));
        },
        get url () {
            if (exportCache["url"]) return exportCache["url"];
            return (exportCache["url"] = require("url"));
        },
        get fs () {
            if (exportCache["fs"]) return exportCache["fs"];
            var api = require("fs-extra");
            POLYFILLS.Promise.promisifyAll(api);
            api.existsAsync = function (path) {
                return new POLYFILLS.Promise(function (resolve, reject) {
                    return api.exists(path, resolve);
                });
            }
            return (exportCache["fs"] = api);
        },
        get request () {
            if (exportCache["request"]) return exportCache["request"];
            return (exportCache["request"] = require("request"));
        },
        get "require.async" () {
            if (exportCache["require.async"]) return exportCache["require.async"];
            return (exportCache["require.async"] = require("require.async"));
        },
        get urijs () {
            if (exportCache["urijs"]) return exportCache["urijs"];
            return (exportCache["urijs"] = require("urijs"));
        },
        get dot () {
            if (exportCache["dot"]) return exportCache["dot"];
            return (exportCache["dot"] = require("dot"));
        },
        get waitfor () {
            if (exportCache["waitfor"]) return exportCache["waitfor"];
            return (exportCache["waitfor"] = require("waitfor"));
        },
        get ms () {
            if (exportCache["ms"]) return exportCache["ms"];
            return (exportCache["ms"] = require("ms"));
        },
        get traverse () {
            if (exportCache["traverse"]) return exportCache["traverse"];
            return (exportCache["traverse"] = require("traverse"));
        },
        // TODO: This module should come from an installed module like the rest or be dynamically loaded later.
        get ccjson () {
            if (exportCache["ccjson"]) return exportCache["ccjson"];
            return (exportCache["ccjson"] = require("../lib/ccjson"));
        },
        get CJSON () {
            if (exportCache["CJSON"]) return exportCache["CJSON"];
            return (exportCache["CJSON"] = {
                stringify: require("canonical-json")
            });
        },
        // TODO: This module should come from an installed module like the rest or be dynamically loaded later.
        get "cores/data/for/ccjson.record.mapper/0-common.api" () {
            if (exportCache["cores/data/for/ccjson.record.mapper/0-common.api"]) return exportCache["cores/data/for/ccjson.record.mapper/0-common.api"];
            return (exportCache["cores/data/for/ccjson.record.mapper/0-common.api"] = require("../cores/data/for/ccjson.record.mapper/0-common.api").forLib(exports));
        }
    };

    return exports;
}
