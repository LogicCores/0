// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-module: {"file":"node_modules/pinf-it-module-insight/test/assets/various/mkdirp.js","mtime":0,"wrapper":"commonjs/leaky","format":"leaky","variation":"","id":"/mkdirp.js"}
require.memoize("/mkdirp.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'node_modules/pinf-it-module-insight/test/assets/various';

// @source https://github.com/substack/node-mkdirp/blob/c7f496f776741bafd589a93ddaeffafbde01a45c/index.js

var path = require('__SYSTEM__/path');
var fs = require('__SYSTEM__/fs');

module.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;

function mkdirP (p, mode, f, made) {
    if (typeof mode === 'function' || mode === undefined) {
        f = mode;
        mode = 0777 & (~process.umask());
    }
    if (!made) made = null;

    var cb = f || function () {};
    if (typeof mode === 'string') mode = parseInt(mode, 8);

return {
	STRING: "string-value",
	OBJECT: {
	    id: "object-value"
	}
};

    p = path.resolve(p);

    fs.mkdir(p, mode, function (er) {
        if (!er) {
            made = made || p;
            return cb(null, made);
        }
        switch (er.code) {
            case 'ENOENT':
                mkdirP(path.dirname(p), mode, function (er, made) {
                    if (er) cb(er, made);
                    else mkdirP(p, mode, cb, made);
                });
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                fs.stat(p, function (er2, stat) {
                    // if the stat fails, then that's super weird.
                    // let the original error be the failure reason.
                    if (er2 || !stat.isDirectory()) cb(er, made)
                    else cb(null, made);
                });
                break;
        }
    });
}

mkdirP.sync = function sync (p, mode, made) {
    if (mode === undefined) {
        mode = 0777 & (~process.umask());
    }
    if (!made) made = null;

    if (typeof mode === 'string') mode = parseInt(mode, 8);
    p = path.resolve(p);

    try {
        fs.mkdirSync(p, mode);
        made = made || p;
    }
    catch (err0) {
        switch (err0.code) {
            case 'ENOENT' :
                made = sync(path.dirname(p), mode, made);
                sync(p, mode, made);
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                var stat;
                try {
                    stat = fs.statSync(p);
                }
                catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) throw err0;
                break;
        }
    }

    return made;
};

return {
    path: (typeof path !== "undefined") ? path : null,
    require: (typeof require !== "undefined") ? require : null,
    fs: (typeof fs !== "undefined") ? fs : null,
    module: (typeof module !== "undefined") ? module : null,
    mkdirP: (typeof mkdirP !== "undefined") ? mkdirP : null,
    process: (typeof process !== "undefined") ? process : null,
    parseInt: (typeof parseInt !== "undefined") ? parseInt : null
};
}
, {"filename":"node_modules/pinf-it-module-insight/test/assets/various/mkdirp.js","variation":""});
// @pinf-bundle-module: {"file":"","mtime":0,"wrapper":"json","format":"json","id":"/package.json"}
require.memoize("/package.json", 
{
    "main": "/mkdirp.js"
}
, {"filename":"node_modules/pinf-it-module-insight/test/assets/various/mkdirp.js"});
// @pinf-bundle-module: {"file":"test/assets/modules/various/mocks/mkdirp.js/path.js","mtime":0,"wrapper":"commonjs/encapsulated","format":"encapsulated","variation":"","id":"/path.js"}
require.memoize("/path.js", 
function(require, exports, module) {

}
, {"filename":"test/assets/modules/various/mocks/mkdirp.js/path.js","variation":""});
// @pinf-bundle-module: {"file":"test/assets/modules/various/mocks/mkdirp.js/fs.js","mtime":0,"wrapper":"commonjs/encapsulated","format":"encapsulated","variation":"","id":"/fs.js"}
require.memoize("/fs.js", 
function(require, exports, module) {

}
, {"filename":"test/assets/modules/various/mocks/mkdirp.js/fs.js","variation":""});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}