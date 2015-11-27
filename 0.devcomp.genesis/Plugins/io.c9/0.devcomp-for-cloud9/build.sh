#!/bin/bash
if [ -z "$HOME" ]; then
	echo "ERROR: 'HOME' environment variable is not set!"
	exit 1
fi
# Source https://github.com/bash-origin/bash.origin
. "$HOME/.bash.origin"
function init {
	eval BO_SELF_BASH_SOURCE="$BO_READ_SELF_BASH_SOURCE"
	BO_deriveSelfDir ___TMP___ "$BO_SELF_BASH_SOURCE"
	local __BO_DIR__="$___TMP___"


    C9_COMMAND_PATH="$__BO_DIR__/../../../../.cache/git/github.com/cadorn/core/bin/c9"


	function Build {
		BO_format "$VERBOSE" "HEADER" "Build plugins ..."

		pushd "$__BO_DIR__" > /dev/null

			if BO_has "$C9_COMMAND_PATH"; then
			    "$C9_COMMAND_PATH" build
			fi

		popd > /dev/null

		BO_format "$VERBOSE" "FOOTER"
	}

	Build $@
}
init $@