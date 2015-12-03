bash.origin.prompt
==================

A plugin for [Bash.Origin](https://github.com/bash-origin/bash.origin) that modifies the terminal prompt.


Usage
-----

	#!/bin/bash
	# Source https://github.com/cadorn/bash.origin
	. "$HOME/.bash.origin"
	function init {
		eval BO_SELF_BASH_SOURCE="$BO_READ_SELF_BASH_SOURCE"
		BO_deriveSelfDir ___TMP___ "$BO_SELF_BASH_SOURCE"
		local __BO_DIR__="$___TMP___"


		BO_callPlugin "bash.origin.prompt" setPrompt "workspace" "$__BO_DIR__"
	}
	init


Test
----

See: [github.com/cadorn/bash.origin/examples/06-ModifyPromptWithPlugin](https://github.com/cadorn/bash.origin/tree/master/examples/06-ModifyPromptWithPlugin)


API
---

### `setPrompt <mode> "$ORIGIN_PATH"`

Supported modes:

  * `workspace` - For use when *activating* workspaces for development. Includes the basename of the origin path to label the system, git branch, and relative path of current working directory to the origin path.


License
=======

Original Author: [Christoph Dorn](http://christophdorn.com)

[UNLICENSE](http://unlicense.org/)

