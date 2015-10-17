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

	# NOTE: We purposely DO NOT include "$__BO_DIR__/activate.sh" as this script is to
	#       be used to start the system in a production environment which must provide
	#       the minimal config options ve defaulting to the workspace activation script.

	function Start {
		BO_format "$VERBOSE" "HEADER" "Starting system"


		export ENVIRONMENT_TYPE="production"

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
		if [ -z "$Z0_ROOT" ]; then
			echo "ERROR: 'Z0_ROOT' environment variable not set!"
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

		node "$Z0_ROOT/server.js"


		BO_format "$VERBOSE" "FOOTER"
	}

	Start $@
}
init $@