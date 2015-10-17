#!/bin/bash -e
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
	
	_OUR_BASE_DIR="$__BO_DIR__"

    BO_sourcePrototype "$__BO_DIR__/activate.sh"


	function Bundle {
		BO_format "$VERBOSE" "HEADER" "Bundling system"

		pushd "$_OUR_BASE_DIR/.." > /dev/null

# TODO: Enable updating of zero.lib based on user config
#			"lib/smi.0/bin/smi.0" freeze-latest --library-package "lib/zero.lib"

			"lib/smi.0/bin/smi.0" freeze-latest

		popd > /dev/null

		BO_format "$VERBOSE" "FOOTER"
	}

	Bundle $@

}
init $@