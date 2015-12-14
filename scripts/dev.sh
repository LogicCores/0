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


	function StartResponder {
		BO_format "$VERBOSE" "HEADER" "Starting cores/responder"

		BO_log "$VERBOSE" "PWD: $PWD"
		BO_log "$VERBOSE" "Z0_ROOT: $Z0_ROOT"
		BO_log "$VERBOSE" "PLATFORM_NAME: $PLATFORM_NAME"
		BO_log "$VERBOSE" "ENVIRONMENT_NAME: $ENVIRONMENT_NAME"
		BO_log "$VERBOSE" "ENVIRONMENT_TYPE: $ENVIRONMENT_TYPE"

		if [ -z "$PLATFORM_NAME" ]; then
			echo "ERROR: 'PLATFORM_NAME' environment variable not set!"
			exit 1
		fi
		if [ -z "$ENVIRONMENT_NAME" ]; then
			echo "ERROR: 'ENVIRONMENT_NAME' environment variable not set!"
			exit 1
		fi
		if [ -z "$PIO_PROFILE_KEY" ]; then
			echo "ERROR: 'PIO_PROFILE_KEY' environment variable not set!"
			exit 1
		fi
		if [ -z "$PIO_PROFILE_SECRET" ]; then
			echo "ERROR: 'PIO_PROFILE_SECRET' environment variable not set!"
			exit 1
		fi


		export GIT_COMMIT_REV=`git rev-parse --short HEAD`
		BO_log "$VERBOSE" "GIT_COMMIT_REV: $GIT_COMMIT_REV"


		export GIT_COMMIT_TAG=`git describe --tags`
		BO_log "$VERBOSE" "GIT_COMMIT_TAG: $GIT_COMMIT_TAG"


		# TODO: Call helper here instead of repeating code.
	    if [[ $(git diff --shortstat 2> /dev/null | tail -n1) != "" ]] || [[ $(git status -s 2> /dev/null | tail -n1) != "" ]]; then
			export GIT_IS_DIRTY="0"
	    else
			export GIT_IS_DIRTY="1"
        fi
		BO_log "$VERBOSE" "GIT_IS_DIRTY: $GIT_IS_DIRTY"


		BO_run_node "$Z0_ROOT/server.js"

		BO_format "$VERBOSE" "FOOTER"
	}


	# TODO: Do all startup init here using 'PIO_PROFILE_SECRET' and issue
	#       temporary access keys for runtime


	# This variable must not be used from now on
#	export PIO_PROFILE_SECRET=""

	export ENVIRONMENT_TYPE="development"

	StartResponder $@

}
init $@