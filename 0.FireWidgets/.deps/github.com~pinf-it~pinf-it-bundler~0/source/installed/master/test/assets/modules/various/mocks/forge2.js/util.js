(function() {
/* ########## Begin module implementation ########## */
function initModule(forge) {


forge.util = {
  STRING: "string-value",
  OBJECT: {
    id: "object-value"
  }
};


} // end module implementation

/* ########## Begin module wrapper ########## */
var name = 'util';
var deps = [];
var nodeDefine = null;
if(typeof define !== 'function') {
  // NodeJS -> AMD
  if(typeof module === 'object' && module.exports) {
    nodeDefine = function(ids, factory) {
      factory(require, module);
    };
  }
  // <script>
  else {
    if(typeof forge === 'undefined') {
      forge = {};
    }
    initModule(forge);
  }
}
// AMD
if(nodeDefine || typeof define === 'function') {
  // define module AMD style
  (nodeDefine || define)(['require', 'module'].concat(deps),
  function(require, module) {
    module.exports = function(forge) {
      var mods = deps.map(function(dep) {
        return require(dep);
      }).concat(initModule);
      // handle circular dependencies
      forge = forge || {};
      forge.defined = forge.defined || {};
      if(forge.defined[name]) {
        return forge[name];
      }
      forge.defined[name] = true;
      for(var i = 0; i < mods.length; ++i) {
        mods[i](forge);
      }
      return forge[name];
    };
  });
}
})();