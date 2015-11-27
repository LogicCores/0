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


	function Install {
		BO_format "$VERBOSE" "HEADER" "Installing Libraries"

		pushd "$__BO_DIR__/.." > /dev/null
			BO_ensure_nvm
			if ! nvm use 4; then
	        	nvm install 4
			fi

            "scripts/node_modules/smi.cli/bin/smi" install -vd

		popd > /dev/null

		BO_format "$VERBOSE" "FOOTER"
	}

	Install $@

#    "scripts": {
#        "install": "cd scripts; npm install --production; ./install.sh"
#    },

}
init $@