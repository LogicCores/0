
function loadLib () {
    const POLYFILLS = require("./Polyfills/server.api");
    const LIBRARY = require("./Library/server.api").forPoly(POLYFILLS);
    var lib = {};
    LIBRARY._.assign(lib, POLYFILLS);
    LIBRARY._.assign(lib, LIBRARY);

    // TODO: Move to 'logic.cores' package which should load all cores for us
    lib.Cores = {};
    lib.fs.readdirSync(lib.path.join(__dirname, "cores")).forEach(function (core) {
        var path = lib.path.join(__dirname, "cores", core, "0-server.api.js");
        if (lib.fs.existsSync(path)) {
            console.log("Loading core:", path);
            lib.Cores[core] = require(path).forLib(lib);
        }
    });

    return lib;
}

const LIB = loadLib();

LIB.Promise.try(function () {


    var npm_config_argv = (process.env.npm_config_argv && JSON.parse(process.env.npm_config_argv)) || null;
    if (
        npm_config_argv &&
        npm_config_argv.original &&
        npm_config_argv.original.indexOf("--verbose") !== -1
    ) {
        process.env.VERBOSE = "1";
    }


    // Boot configuration

    var ENVIRONMENT_TYPE = process.env.ENVIRONMENT_TYPE || "production";
    // 'npm run dev --production'
    var npm_config_argv = (process.env.npm_config_argv && JSON.parse(process.env.npm_config_argv)) || null;
    if (
        npm_config_argv &&
        npm_config_argv.original &&
        npm_config_argv.original.indexOf("--production") !== -1
    ) {
        ENVIRONMENT_TYPE = "production";
    }
    process.env.ENVIRONMENT_TYPE = ENVIRONMENT_TYPE;

    var BOOT_CONFIG_PATH = process.env.BOOT_CONFIG_PATH || LIB.path.join(__dirname, "PINF.Genesis.ccjson");
    process.env.BOOT_CONFIG_PATH = BOOT_CONFIG_PATH;


    LIB.assert.equal(typeof process.env.Z0_ROOT, "string", "'Z0_ROOT' environment variable not set!");
    LIB.assert.equal(typeof process.env.PLATFORM_NAME, "string", "'PLATFORM_NAME' environment variable not set!");
    LIB.assert.equal(typeof process.env.ENVIRONMENT_NAME, "string", "'ENVIRONMENT_NAME' environment variable not set!");
    LIB.assert.equal(typeof process.env.ENVIRONMENT_TYPE, "string", "'ENVIRONMENT_TYPE' environment variable not set!");
    LIB.assert.equal(typeof process.env.PIO_PROFILE_KEY, "string", "'PIO_PROFILE_KEY' environment variable not set!");
    LIB.assert.equal(typeof process.env.PIO_PROFILE_SECRET, "string", "'PIO_PROFILE_SECRET' environment variable not set!");
    LIB.assert.equal(typeof process.env.BOOT_CONFIG_PATH, "string", "'BOOT_CONFIG_PATH' environment variable not set!");


    console.log("Boot config path:", BOOT_CONFIG_PATH);


    // TODO: Move into memory manager.
    var startTime = Date.now();
    function printUsage () {
        var usage = process.memoryUsage();
        console.log("Memory Usage:", {
            rss: Math.round(usage.rss / 1048576) + "MB",
            heapTotal: Math.round(usage.heapTotal / 1048576) + "MB",
            heapUsed: Math.round(usage.heapUsed / 1048576) + "MB"
        });
        // Print every 5 sec for first minute, then once per minute.
        if (Date.now() < (startTime + 60 * 1000)) {
            setTimeout(printUsage, 5 * 1000);
        } else {
            setTimeout(printUsage, 60 * 1000);
        }
    }
    printUsage();


    // Boot implementation

    function makeContext (type, config) {
        if (type === "config") {
            return require("./cores/config/0-server.api").forLib(LIB).then(function (exports) {
                return new exports.Context(config);
            });
        }
        throw new Error("Unknown context type '" + type + "'");
    }

    return makeContext("config", {
        env: process.env,
        path: BOOT_CONFIG_PATH,
        boot: [
            "server"
        ]
    }).then(function (configContext) {

        return configContext.adapters["pinf.genesis.config"].spin(configContext);
    });

}).catch(function (err) {
    console.error(err.stack);
    process.exit(1);
})
