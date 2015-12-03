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

	function InstallSystem {
		# **************************************************
		# * Install system components
		# **************************************************




		echo "TODO: Add your custom install code here!"




		# **************************************************
		# **************************************************
	}

	function InstallWorkspace {
		# **************************************************
		# * Install development components
		# **************************************************




		echo "TODO: Add your custom install code here!"




		# **************************************************
		# **************************************************
	}

	function Install {
		BO_format "$VERBOSE" "HEADER" "Installing ..."
		export WORKSPACE_DIRECTORY="$PWD"
		BO_log "$VERBOSE" "WORKSPACE_DIR: $WORKSPACE_DIR"
		pushd "$WORKSPACE_DIR" > /dev/null

			local SOURCE_MODE="0"
			if [ -e "node_modules/0.workspace/scripts/expand.sh" ]; then
				SOURCE_MODE="1"
			fi

			if [ "$SOURCE_MODE" == "1" ]; then
				# We only run this if the '0.workspace' package is available (running in source mode)
				BO_sourcePrototype "node_modules/0.workspace/scripts/expand.sh" $@
			fi

			# We use the ZeroSystem activate script as the workspace is not required at runtime
			# and should not be required to install dependencies.
			BO_sourcePrototype ".0/scripts/activate.sh" $@

			if [ "$SOURCE_MODE" == "1" ]; then
	    		BO_format "$VERBOSE" "HEADER" "Installing system components ..."
	    		BO_log "$VERBOSE" "PWD: $PWD"
				InstallSystem $@
	    		BO_format "$VERBOSE" "FOOTER"
			fi

    		BO_format "$VERBOSE" "HEADER" "Installing workspace components ..."
    		BO_log "$VERBOSE" "PWD: $PWD"
			InstallWorkspace $@
    		BO_format "$VERBOSE" "FOOTER"

		popd > /dev/null
		BO_format "$VERBOSE" "FOOTER"
	}

	Install $@
}
init $@
