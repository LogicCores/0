
exports.boot = function (instanceAlias) {

    const LIB = require("./lib");

    return LIB.Promise.try(function () {

        var npm_config_argv = (process.env.npm_config_argv && JSON.parse(process.env.npm_config_argv)) || null;


        if (
            npm_config_argv &&
            npm_config_argv.original &&
            npm_config_argv.original.indexOf("--verbose") !== -1
        ) {
            process.env.VERBOSE = "1";
        }
        LIB.VERBOSE = !!process.env.VERBOSE;


        // Boot configuration

        var ENVIRONMENT_TYPE = process.env.ENVIRONMENT_TYPE || "production";
        var ORIGINAL_ENVIRONMENT_TYPE = ENVIRONMENT_TYPE;

        // 'npm run dev --production'
        if (
            npm_config_argv &&
            npm_config_argv.original &&
            npm_config_argv.original.indexOf("--production") !== -1
        ) {
            ENVIRONMENT_TYPE = "production";
        }
        process.env.ENVIRONMENT_TYPE = ENVIRONMENT_TYPE;

        var BOOT_CONFIG_PATH = process.env.BOOT_CONFIG_PATH || LIB.path.join(__dirname, "../PINF.Genesis.ccjson");
        process.env.BOOT_CONFIG_PATH = BOOT_CONFIG_PATH;
        
        
        // 'npm run dev --production'
        if (
            npm_config_argv &&
            npm_config_argv.original &&
            npm_config_argv.original.indexOf("--profile") !== -1
        ) {
            process.env.BOOT_PROFILE_OVERLAY_PATH = npm_config_argv.original[
                npm_config_argv.original.indexOf("--profile") + 1
            ];
        } else {
            process.env.BOOT_PROFILE_OVERLAY_PATH = "";
        }


        LIB.assert.equal(typeof process.env.Z0_ROOT, "string", "'Z0_ROOT' environment variable not set!");
        LIB.assert.equal(typeof process.env.PLATFORM_NAME, "string", "'PLATFORM_NAME' environment variable not set!");
        LIB.assert.equal(typeof process.env.ENVIRONMENT_NAME, "string", "'ENVIRONMENT_NAME' environment variable not set!");
        LIB.assert.equal(typeof process.env.ENVIRONMENT_TYPE, "string", "'ENVIRONMENT_TYPE' environment variable not set!");
        LIB.assert.equal(typeof process.env.PIO_PROFILE_KEY, "string", "'PIO_PROFILE_KEY' environment variable not set!");
        LIB.assert.equal(typeof process.env.PIO_PROFILE_SECRET, "string", "'PIO_PROFILE_SECRET' environment variable not set!");
        LIB.assert.equal(typeof process.env.BOOT_CONFIG_PATH, "string", "'BOOT_CONFIG_PATH' environment variable not set!");


        console.log("Boot instance alias '" + instanceAlias + "' for config:", BOOT_CONFIG_PATH, "(ENVIRONMENT_TYPE: " + process.env.ENVIRONMENT_TYPE + ", BOOT_PROFILE_OVERLAY_PATH: " + process.env.BOOT_PROFILE_OVERLAY_PATH + ")");

        console.log("VERBOSE:", process.env.VERBOSE);


        // TODO: Move into memory manager.
        var startTime = Date.now();
        function printUsage () {
            var usage = process.memoryUsage();
            console.log("Memory Usage:", {
                rss: Math.round(usage.rss / 1048576) + "MB",
                heapTotal: Math.round(usage.heapTotal / 1048576) + "MB",
                heapUsed: Math.round(usage.heapUsed / 1048576) + "MB"
            });
            if (ORIGINAL_ENVIRONMENT_TYPE === "production") {
                // Print every 5 sec for first minute, then once every 1 minute.
                if (Date.now() < (startTime + 60 * 1000)) {
                    setTimeout(printUsage, 5 * 1000);
                } else {
                    setTimeout(printUsage, 60 * 1000);
                }
            } else
            if (ORIGINAL_ENVIRONMENT_TYPE === "development") {
                // Print every 5 sec for first minute, then once every 15 sec.
                if (Date.now() < (startTime + 60 * 1000)) {
                    setTimeout(printUsage, 5 * 1000);
                } else {
                    setTimeout(printUsage, 15 * 1000);
                }
            }
        }
        printUsage();


        // Boot implementation

        function makeContext (type, config) {
            if (type === "config") {
                return LIB.Cores.config.then(function (exports) {
                    return new exports.Context(config);
                });
            }
            throw new Error("Unknown context type '" + type + "'");
        }
    
        return makeContext("config", {
            env: process.env,
            path: BOOT_CONFIG_PATH,
            boot: [
                instanceAlias
            ]
        }).then(function (configContext) {
    
            return configContext.adapters["pinf.genesis.config"].spin(configContext);
        }).then(function () {

/*
// TODO: Enable by config
            const MODULE_REPORTER = require("../cores/report/for/nodejs.loaded.modules/0-server.api").forLib(LIB);
            return MODULE_REPORTER.generateForModule(module).then(function (report) {
                console.log("modules", report.modules);
                console.log("summary", report.summary);
            });
*/
        });

    });
}
