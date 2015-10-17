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


	function Deploy {
		BO_format "$VERBOSE" "HEADER" "Deploy system ..."

		BO_log "$VERBOSE" "PWD: $PWD"

	    # TODO: Use heroku bash.origin prototype to import deploy function

	    # Check if git dirty
	    if [[ $(git diff --shortstat 2> /dev/null | tail -n1) != "" ]] || [[ $(git status -s 2> /dev/null | tail -n1) != "" ]]; then
	        echo "ERROR: Aborting. Your working directory contains uncommitted changes!"
	        echo "Action: Commit changes"
#		        exit 1;
        fi

	    if [[ $(git remote show heroku 2>&1 | grep fatal) != "" ]]; then
	        echo "ERROR: Aborting. 'heroku' git remote not configured!"
	        echo "Action: Configure 'heroku' git remote using url from the 'Settings' of your app at: https://dashboard.heroku.com/apps"
	        echo "Action: Run 'git remote add heroku <GitURL>"
	        exit 1;
        fi

		BO_log "$VERBOSE" "Setting heroku config variables ..."
		heroku config:set \
			PLATFORM_NAME="$PLATFORM_NAME" \
			ENVIRONMENT_NAME="$ENVIRONMENT_NAME" \
			ENVIRONMENT_TYPE="production" \
			PIO_PROFILE_KEY="$PIO_PROFILE_KEY" \
			PIO_PROFILE_SECRET="$PIO_PROFILE_SECRET" > /dev/null



#		    git push heroku master

		BO_format "$VERBOSE" "FOOTER"
	}

	Deploy $@
}
init $@