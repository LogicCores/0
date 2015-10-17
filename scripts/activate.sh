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


	if [ -z "$WORKSPACE_DIR" ]; then
		export WORKSPACE_DIR="$(dirname $__BO_DIR__)"
	fi

	export PIO_PROFILE_SEED_PATH="$WORKSPACE_DIR/.secret/profile.seed"
	if [ -e "$PIO_PROFILE_SEED_PATH.sh" ]; then
        BO_sourcePrototype "$PIO_PROFILE_SEED_PATH.sh"
    else
		export PIO_PROFILE_SEED_PATH="$(dirname $WORKSPACE_DIR)/$(basename $WORKSPACE_DIR).profile.seed"
		if [ -e "$PIO_PROFILE_SEED_PATH.sh" ]; then
	        BO_sourcePrototype "$PIO_PROFILE_SEED_PATH.sh"
		fi
	fi
	# NOTE: We now have a sensitive 'PIO_PROFILE_SECRET' variable in the
	#       environment that should be removed as soon as it is no longer needed
	#       and before any non-tooling related runtime processes start!

	export PATH="$__BO_DIR__/../node_modules/.bin:$PATH"
	export PATH="$__BO_DIR__:$PATH"

	export PORT=8090
	export ENVIRONMENT_NAME="127.0.0.1:$PORT"
	if [ -z "$ENVIRONMENT_TYPE" ]; then
		export ENVIRONMENT_TYPE="development"
	fi
	if [ -z "$PLATFORM_NAME" ]; then
		# @see https://github.com/pinf-to/0.PINF.Genesis.to/tree/master/Model/Inception.0/Deployment
		export PLATFORM_NAME="os.osx"
	fi

	NODEJS_VERSION="4"
	BO_log "$VERBOSE" "Activating NodeJS version '$NODEJS_VERSION' ..."
	BO_ensure_nvm
	if ! nvm use $NODEJS_VERSION; then
    	nvm install $NODEJS_VERSION
	fi
}
init $@