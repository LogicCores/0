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


	function PreCommit {
		BO_format "$VERBOSE" "HEADER" "Running pre-commit ..."

		BO_log "$VERBOSE" "PWD: $PWD"

        "encrypt.sh"

        "bundle.sh"
	    if [[ $(git diff --name-only smi.0.json 2> /dev/null | tail -n1) != "" ]]; then
	        echo "ERROR: Aborting. 'smi.0.json' has uncommitted changes!"
	        exit 1;
        fi

		BO_format "$VERBOSE" "FOOTER"
	}

	PreCommit $@
}
init $@