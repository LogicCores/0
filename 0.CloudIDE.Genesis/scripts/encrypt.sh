#!/bin/bash -e
if [ -z "$Z0_ROOT" ]; then
	export Z0_ROOT="$PWD/.0"
fi
# Source https://github.com/bash-origin/bash.origin
. "$Z0_ROOT/lib/bash.origin/bash.origin"
function init {
	eval BO_SELF_BASH_SOURCE="$BO_READ_SELF_BASH_SOURCE"
	BO_deriveSelfDir ___TMP___ "$BO_SELF_BASH_SOURCE"
	local __BO_DIR__="$___TMP___"


    BO_sourcePrototype "$__BO_DIR__/activate.sh"


	function Encrypt {
		BO_format "$VERBOSE" "HEADER" "Encrypting credentials ..."

		pushd "$WORKSPACE_DIR" > /dev/null

		    BO_log "$VERBOSE" "WORKSPACE_DIR: $WORKSPACE_DIR"
			BO_log "$VERBOSE" "PWD: $PWD"

	    	export BOOT_CONFIG_PATH="$WORKSPACE_DIR/PINF.Genesis.ccjson"

	        BO_sourcePrototype "$Z0_ROOT/scripts/encrypt.sh"

		popd > /dev/null

		BO_format "$VERBOSE" "FOOTER"
	}

	Encrypt $@

}
init $@