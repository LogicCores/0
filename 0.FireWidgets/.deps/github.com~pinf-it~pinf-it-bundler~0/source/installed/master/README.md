*Status: DEV*

Code Bundler
============

Code bundle standards are evolving but there are various differences across communities.

This library attempts to generate normalized code bundles for
any code modules and packages that can be parsed by the
[Package Insight](https://github.com/pinf-it/pinf-it-package-insight) and
[Module Insight](https://github.com/pinf-it/pinf-it-module-insight) libraries.

This bundler is intended to replace the following tools and conventions:

  * [RequireJS](http://requirejs.org/)
  * [RequireJS Optimizer](http://requirejs.org/docs/optimization.html)
  * [almond](https://github.com/jrburke/almond)
  * [component builder](https://github.com/component/builder.js)
  * [component require](https://github.com/component/require)
  * [Grunt](http://gruntjs.com/) plugins and scripts that create concatenated and optimized code bundles
  * Build scripts that create concatenated and optimized code bundles


Install
-------

    npm install pinf-it-bundler


Usage
-----

    const BUNDLER = require("pinf-it-bundler");
    
    BUNDLER.bundleFile("<path>", {
        distPath: "<target directory>"
    }, function(err, descriptor) {
    });
    
    BUNDLER.bundlePackage("<path>", {
        distPath: "<target directory>"
    }, function(err, descriptor) {
    });


Development
-----------

    make test


Links
=====

Integrate:

  * https://github.com/philbooth/complexity-report
  * https://github.com/douglascrockford/JSDev


License
=======

[UNLICENSE](http://unlicense.org/)
