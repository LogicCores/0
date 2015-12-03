// @pinf-bundle-ignore: 
PINF.bundle("", function(require, _____bundle_global) {
// @pinf-bundle-module: {"file":"node_modules/pinf-it-module-insight/test/assets/various/mime-types.js","mtime":0,"wrapper":"commonjs","format":"commonjs","variation":"","id":"/mime-types.js"}
require.memoize("/mime-types.js", 
function(require, exports, module) {var __dirname = TEST_ROOT_PATH + '/' + 'node_modules/pinf-it-module-insight/test/assets/various';

// types[extension] = type
exports.types = Object.create(null)
// extensions[type] = [extensions]
exports.extensions = Object.create(null)
// define more mime types
exports.define = define

// store the json files
exports.json = {
  mime: require('./mime.json'),
  node: require('./node.json'),
  custom: require('./custom.json'),
}

exports.lookup = function (string) {
  if (!string || typeof string !== "string") return false
  string = string.replace(/.*[\.\/\\]/, '').toLowerCase()
  if (!string) return false
  return exports.types[string] || false
}

exports.extension = function (type) {
  if (!type || typeof type !== "string") return false
  type = type.match(/^\s*([^;\s]*)(?:;|\s|$)/)
  if (!type) return false
  var exts = exports.extensions[type[1].toLowerCase()]
  if (!exts || !exts.length) return false
  return exts[0]
}

// type has to be an exact mime type
exports.charset = function (type) {
  // special cases
  switch (type) {
    case 'application/json': return 'UTF-8'
    case 'application/javascript': return 'UTF-8'
  }

  // default text/* to utf-8
  if (/^text\//.test(type)) return 'UTF-8'

  return false
}

// backwards compatibility
exports.charsets = {
  lookup: exports.charset
}

exports.contentType = function (type) {
  if (!type || typeof type !== "string") return false
  if (!~type.indexOf('/')) type = exports.lookup(type)
  if (!type) return false
  if (!~type.indexOf('charset')) {
    var charset = exports.charset(type)
    if (charset) type += '; charset=' + charset.toLowerCase()
  }
  return type
}

define(exports.json.mime)
define(exports.json.node)
define(exports.json.custom)

function define(json) {
  Object.keys(json).forEach(function (type) {
    var exts = json[type] || []
    exports.extensions[type] = exports.extensions[type] || []
    exts.forEach(function (ext) {
      if (!~exports.extensions[type].indexOf(ext)) exports.extensions[type].push(ext)
      exports.types[ext] = type
    })
  })
}

}
, {"filename":"node_modules/pinf-it-module-insight/test/assets/various/mime-types.js","variation":""});
// @pinf-bundle-module: {"file":"","mtime":0,"wrapper":"json","format":"json","id":"/package.json"}
require.memoize("/package.json", 
{
    "main": "/mime-types.js"
}
, {"filename":"node_modules/pinf-it-module-insight/test/assets/various/mime-types.js"});
// @pinf-bundle-module: {"file":"test/assets/modules/various/mocks/mime-types.js/mime.json","mtime":0,"wrapper":"json","format":"json","variation":"","id":"/mime.json"}
require.memoize("/mime.json", 

{}

, {"filename":"test/assets/modules/various/mocks/mime-types.js/mime.json","variation":""});
// @pinf-bundle-module: {"file":"test/assets/modules/various/mocks/mime-types.js/node.json","mtime":0,"wrapper":"json","format":"json","variation":"","id":"/node.json"}
require.memoize("/node.json", 

{}

, {"filename":"test/assets/modules/various/mocks/mime-types.js/node.json","variation":""});
// @pinf-bundle-module: {"file":"test/assets/modules/various/mocks/mime-types.js/custom.json","mtime":0,"wrapper":"json","format":"json","variation":"","id":"/custom.json"}
require.memoize("/custom.json", 

{}

, {"filename":"test/assets/modules/various/mocks/mime-types.js/custom.json","variation":""});
// @pinf-bundle-ignore: 
});
// @pinf-bundle-report: {}