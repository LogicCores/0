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


	function Contract {
		BO_format "$VERBOSE" "HEADER" "Contracting system ..."

		pushd "$WORKSPACE_DIR" > /dev/null

		    BO_log "$VERBOSE" "WORKSPACE_DIR: $WORKSPACE_DIR"
			BO_log "$VERBOSE" "PWD: $PWD"

		    BO_log "$VERBOSE" "Checking prerequisites ..."
	
		    # Check if git dirty
		    if [[ $(git diff --shortstat 2> /dev/null | tail -n1) != "" ]] || [[ $(git status -s 2> /dev/null | tail -n1) != "" ]]; then
		        echo "ERROR: Your working directory '$WORKSPACE_DIR' contains uncommitted changes!"
		        echo "ACTION: Commit your changes"
		        exit 1;
	        fi
	
		    BO_log "$VERBOSE" "Removing files ..."
		    
		    function removeFile {
			    BO_log "$VERBOSE" "Removing file '$1'"
		        rm -f "$1"
		        # TODO: Remove rule from '.git/info/exclude' file.
		    }
	
	#	    removeFile "contract.sh"
	#	    removeFile "run.sh"

		popd > /dev/null

		BO_format "$VERBOSE" "FOOTER"
	}

	Contract $@

}
init $@