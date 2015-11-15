
const POLYFILLS = require("../Polyfills/server.api");
const LIBRARY = require("../Library/server.api").forPoly(POLYFILLS);
var lib = {};
function assignGetters (target, source) {
    Object.keys(source).forEach(function (name) {
        Object.defineProperty(target, name, {
            get: function () {
                
                if (name === "ccjson") {
                    return source[name].forLib(lib);
                }

                return source[name];
            }
        });
    });
}
assignGetters(lib, POLYFILLS);
assignGetters(lib, LIBRARY);

// TODO: Move to 'logic.cores' package which should load all cores for us
lib.Cores = {};
lib.fs.readdirSync(lib.path.join(__dirname, "../cores")).forEach(function (core) {
    var path = lib.path.join(__dirname, "../cores", core, "0-server.api.js");
    if (lib.fs.existsSync(path)) {
//        console.log("Loading core:", path);
        lib.Cores[core] = require(path).forLib(lib);
    }
});

module.exports = lib;
