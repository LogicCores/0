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


	function Update {
		BO_format "$VERBOSE" "HEADER" "Updating system ..."

		pushd "$__BO_DIR__/.." > /dev/null

		    # Check if git dirty
		    if [[ $(git diff --shortstat 2> /dev/null | tail -n1) != "" ]]; then
		        echo "ERROR: Aborting. Your working directory contains uncommitted changes!"
		        exit 1;
	        fi

		    # Pull from master
		    git pull origin master

		    # Update submodules
			git submodule update --init --recursive --rebase

		    # Remove all untracked files and directories.
		    git clean -fd

# TODO: Enable checking out submodule branches based on user config
#            # Checkout submodule branches
#            "lib/smi.0/bin/smi.0" checkout-submodule-branches
# NOTE: Running this again will keep branches if ref is the same :)
#       We run it again to make sure the committs match.
#			git submodule update --init --recursive --rebase

		    # Install missing/changed dependencies
            BO_sourcePrototype "$__BO_DIR__/install.sh"
            ReInstall

            # TODO: Restart editor process if running
            # TODO: Restart dev process if running

		popd > /dev/null

		BO_format "$VERBOSE" "FOOTER"
	}


	# TODO: Do all startup init here using 'PIO_PROFILE_SECRET' and issue
	#       temporary access keys for runtime


	Update $@

}
init $@