**Status: DEV**

sm.expand
=========

Install *Source Logic* from the *Semantic Web* to the local *Context*.


API
===

	./sm.expand


Uses installers to setup sources:

  * [smi-for-npm](https://github.com/sourcemint/smi-for-npm)
  * [smi-for-git](https://github.com/sourcemint/smi-for-git)


Use Cases
=========

NodeJS
------

Given `/package.json`:

````
{
	"@github.com~sourcemint~sm.expand~0/map": {
		"sources": {
			"<uid>": {
				"<rev>": {
					"url": "git://git@github.com:sourcemint/sm.expand.git",
					"installer": "npm"
				}
			}
		},
		"mappings": {
			"<alias>": "<uid>/{rev}"
		},
		"@github.com~sourcemint~sm.expand~0/locations": {
			"sources": ".deps/{uid}/source/installed/{rev}",
			"mappings": "node_modules/{alias}"
		}
	}
}
````

And running from *CWD: /*:

	./sm.expand

Will yield:

  * Installed source at `/.deps/<uid>/source/installed/{rev}`
  * Symlink at `/node_modules/<alias>`, linked to `/.deps/<uid>/source/installed/{rev}`
