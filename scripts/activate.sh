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
		export WORKSPACE_DIR="$PWD"
	fi

	if [ -z "$Z0_ROOT" ]; then
		BO_followPointer "Z0_ROOT" "$PWD" ".0"
		export Z0_ROOT
	fi
	if [ ! -e "$Z0_ROOT/.0" ] || [ "$(cat $Z0_ROOT/.0)" != "." ]; then
		echo "ERROR: '.0' pointing to '.' not found at '\$Z0_ROOT/.0' ($Z0_ROOT/.0)!"
		exit 1
	fi


	export BO_SYSTEM_CACHE_DIR="$HOME/.Z0/.bash.origin.cache"


	if [ -z "$PIO_PROFILE_SEED_PATH" ]; then
		export PIO_PROFILE_SEED_PATH="$WORKSPACE_DIR/.secret/profile.seed"

		if [ -e "$PIO_PROFILE_SEED_PATH.sh" ]; then
	        BO_sourcePrototype "$PIO_PROFILE_SEED_PATH.sh"
	    else
			export PIO_PROFILE_SEED_PATH="$(dirname $WORKSPACE_DIR)/$(basename $WORKSPACE_DIR).profile.seed"
			if [ -e "$PIO_PROFILE_SEED_PATH.sh" ]; then
		        BO_sourcePrototype "$PIO_PROFILE_SEED_PATH.sh"
		    else
				export PIO_PROFILE_SEED_PATH="$(dirname $(dirname $WORKSPACE_DIR))/$(basename $(dirname $WORKSPACE_DIR)).profile.seed"
				if [ -e "$PIO_PROFILE_SEED_PATH.sh" ]; then
			        BO_sourcePrototype "$PIO_PROFILE_SEED_PATH.sh"
			    else
			    	export PIO_PROFILE_SEED_PATH=""
				fi
			fi
		fi
	else
        BO_sourcePrototype "$PIO_PROFILE_SEED_PATH.sh"
	fi
	BO_log "$VERBOSE" "PIO_PROFILE_SEED_PATH: $PIO_PROFILE_SEED_PATH"
	# NOTE: We now have a sensitive 'PIO_PROFILE_SECRET' variable in the
	#       environment that should be removed as soon as it is no longer needed
	#       and before any non-tooling related runtime processes start!

	export PATH="$Z0_ROOT/node_modules/.bin:$PATH"
	export PATH="$__BO_DIR__:$PATH"
	if [ ! -e "$PATH_OVERRIDES" ]; then
		export PATH="$PATH_OVERRIDES:$PATH"
	fi

	if [ -z "$PORT" ]; then
		export PORT=8090
	fi
	if [ -z "$ENVIRONMENT_NAME" ]; then
		export ENVIRONMENT_NAME="127.0.0.1:$PORT"
	fi
	if [ -z "$ENVIRONMENT_TYPE" ]; then
		export ENVIRONMENT_TYPE="development"
	fi
	if [ -z "$PLATFORM_NAME" ]; then
		# @see https://github.com/pinf-to/0.PINF.Genesis.to/tree/master/Model/Inception.0/Deployment
		export PLATFORM_NAME="os.osx"
	fi
	if [ -z "$BOOT_CONFIG_PATH" ]; then
		export BOOT_CONFIG_PATH="$WORKSPACE_DIR/PINF.Genesis.ccjson"
	fi


	NODEJS_VERSION="4"
	BO_log "$VERBOSE" "Activating NodeJS version '$NODEJS_VERSION' ..."
	BO_ensure_nvm
	if ! nvm use $NODEJS_VERSION; then
    	nvm install $NODEJS_VERSION
	fi
}
init $@