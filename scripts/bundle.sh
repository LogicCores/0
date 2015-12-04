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

# TODO: Enable this again to bundle deps in a flat way with Node 5 & npm 3.
# TODO: Enable updating of zero.lib based on user config
#			"lib/smi.0/bin/smi.0" freeze-latest --library-package "lib/zero.lib"
# TODO: Use 'sm.expand' to manage submodules and checked out branches.
#			"lib/smi.0/bin/smi.0" freeze-latest

	    BO_sourcePrototype "$Z0_ROOT/lib/node.pack/node.pack.proto.sh"

		node.pack.dependencies.canUpload "CAN_UPLOAD"

		if [ "$CAN_UPLOAD" == "1" ]; then

			# Pack the dependencies into an archive and upload if not already uploaded.
			node.pack "dependencies"

		else
			BO_log "$VERBOSE" "Skip bundling dependencies as we are not configured to upload them!"
		fi

		BO_format "$VERBOSE" "FOOTER"
	}
	
	function InstallFreshAndBundle {
		BO_format "$VERBOSE" "HEADER" "Installing fresh clone and then bundling dependencies for system"
		BO_log "$VERBOSE" "PWD: $PWD"

	    BO_sourcePrototype "$Z0_ROOT/lib/node.pack/packers/git/packer.proto.sh"

		git_getRemoteUrl "URL" "origin"
		git_getTag "TAG"
		DIRNAME="clone.bundle.$TAG"

		if [ ! -e ".packs" ]; then
			mkdir ".packs"
		fi
		if [ -e ".packs/$DIRNAME" ]; then
			echo "ERROR: Clone already exists at '$PWD/.packs/$DIRNAME'. Remove and try again."
			exit 1
		fi

		BO_log "$VERBOSE" "Cloning '$URL' into '$PWD/.packs/$DIRNAME'"
		git clone "$URL" ".packs/$DIRNAME"

		pushd ".packs/$DIRNAME" > /dev/null

			git checkout "$TAG"

			BO_log "$VERBOSE" "Installing clone at '$PWD/.packs/$DIRNAME'"

			npm install

			BO_log "$VERBOSE" "Bundling clone at '$PWD/.packs/$DIRNAME'"

			npm run bundle

		popd > /dev/null

		BO_log "$VERBOSE" "Removing bundled clone from '$PWD/.packs/$DIRNAME'"

		rm -Rf ".packs/$DIRNAME"

		BO_format "$VERBOSE" "FOOTER"
	}

	if echo "$@" | grep -q -Ee '\s--fresh(\s|$)' || echo "$npm_config_argv" | grep -q -Ee '"--fresh"'; then
		# We first clone a fresh copy, install it and then bundle it.
		# This ensures we get a clean install just like everyone else in case
		# ours has diverged after making changes.

		InstallFreshAndBundle $@
	else
		BundleDependencies $@
	fi

}
init $@