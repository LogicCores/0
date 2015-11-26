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


    BO_sourcePrototype "$__BO_DIR__/activate.sh"


	function BundleDependencies {
		BO_format "$VERBOSE" "HEADER" "Bundling dependencies for system"

		BO_log "$VERBOSE" "PWD: $PWD"

	    BO_sourcePrototype "$Z0_ROOT/lib/node.pack/node.pack.proto.sh"

		# Pack the dependencies into an archive and upload if not already uploaded.
		node.pack "dependencies"

# TODO: Enable this again to bundle deps in a flat way with Node 5 & npm 3.
# TODO: Enable updating of zero.lib based on user config
#			"lib/smi.0/bin/smi.0" freeze-latest --library-package "lib/zero.lib"
# TODO: Use 'sm.expand' to manage submodules and checked out branches.
#			"lib/smi.0/bin/smi.0" freeze-latest

		BO_format "$VERBOSE" "FOOTER"
	}

	BundleDependencies $@

}
init $@