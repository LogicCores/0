#!/bin/bash
if [ -z "$Z0_ROOT" ]; then
	echo "ERROR: 'Z0_ROOT' environment variable not set!"
	exit 1
fi
# Source https://github.com/bash-origin/bash.origin
. "$Z0_ROOT/lib/bash.origin/bash.origin"
function init {
	eval BO_SELF_BASH_SOURCE="$BO_READ_SELF_BASH_SOURCE"
	BO_deriveSelfDir ___TMP___ "$BO_SELF_BASH_SOURCE"
	local __BO_DIR__="$___TMP___"

	# NOTE: We purposely DO NOT include "$__BO_DIR__/activate.sh" as this script is to
	#       be used to start the system in a production environment which must provide
	#       the minimal config options ve defaulting to the workspace activation script.

	function Start {
		BO_format "$VERBOSE" "HEADER" "Starting system"


		if [ -z "$ENVIRONMENT_TYPE" ]; then
			export ENVIRONMENT_TYPE="production"
		fi

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

		NODEJS_VERSION="4"
		BO_log "$VERBOSE" "Activating NodeJS version '$NODEJS_VERSION' ..."
		BO_ensure_nvm
		if ! nvm use $NODEJS_VERSION; then
	    	nvm install $NODEJS_VERSION
		fi

		BO_log "$VERBOSE" "PWD: $PWD"
		BO_log "$VERBOSE" "Z0_ROOT: $Z0_ROOT"


		if [ ! -e ".git.commit.rev" ]; then
			echo "ERROR: '.git.commit.rev' file not found!"
			exit 1
		fi
		export GIT_COMMIT_REV=`cat .git.commit.rev`
		BO_log "$VERBOSE" "GIT_COMMIT_REV: $GIT_COMMIT_REV"


		node "$Z0_ROOT/server.js"


		BO_format "$VERBOSE" "FOOTER"
	}

	Start $@
}
init $@