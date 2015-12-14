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


    BO_sourcePrototype "$__BO_DIR__/activate.sh"


	function Test {
		BO_format "$VERBOSE" "HEADER" "Testing system ..."

		pushd "$WORKSPACE_DIR" > /dev/null

		    BO_log "$VERBOSE" "WORKSPACE_DIR: $WORKSPACE_DIR"
			BO_log "$VERBOSE" "PWD: $PWD"

		    "$Z0_ROOT/scripts/test.sh"

		popd > /dev/null

		BO_format "$VERBOSE" "FOOTER"
	}

	Test $@

}
init $@