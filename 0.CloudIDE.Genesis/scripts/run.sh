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


	function Run {
		BO_format "$VERBOSE" "HEADER" "Running system ..."

		pushd "$WORKSPACE_DIR" > /dev/null

		    BO_log "$VERBOSE" "WORKSPACE_DIR: $WORKSPACE_DIR"
			BO_log "$VERBOSE" "PWD: $PWD"

		    # Start editor

		    "$Z0_ROOT/scripts/edit.sh"

		    # TODO: Boot default workspace processes. Currently running part of (dev.sh)

		popd > /dev/null

		BO_format "$VERBOSE" "FOOTER"
	}

	Run $@

}
init $@