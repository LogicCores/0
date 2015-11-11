
const POLYFILLS = require("../Polyfills/server.api");
const LIBRARY = require("../Library/server.api").forPoly(POLYFILLS);
var lib = {};
LIBRARY._.assign(lib, POLYFILLS);
LIBRARY._.assign(lib, LIBRARY);

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
