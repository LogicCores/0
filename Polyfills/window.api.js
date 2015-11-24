
// TODO: Only load if needed
require("html5-history-api");
// NOTE: This breaks `page` in IE9 where `window.history.location.pathname` will not be set properly.
delete window.history.location;


require("html5shiv");

//;({"__DISABLED__APPEND_AS_GLOBAL":"components/Polyfills/0/node_modules/es6-module-loader/dist/es6-module-loader.src.js"});

//require("es6-promise").polyfill();

window.Promise = require("bluebird");

require("whatwg-fetch");
