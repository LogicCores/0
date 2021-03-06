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


	function Run {
		BO_format "$VERBOSE" "HEADER" "Running job '$1' ..."

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


		if [ -e ".git" ]; then
			export GIT_COMMIT_REV=`git rev-parse --short HEAD`
			export GIT_COMMIT_TAG=`git describe --tags`
			# TODO: Call helper here instead of repeating code.
		    if [[ $(git diff --shortstat 2> /dev/null | tail -n1) != "" ]] || [[ $(git status -s 2> /dev/null | tail -n1) != "" ]]; then
				export GIT_IS_DIRTY="0"
		    else
				export GIT_IS_DIRTY="1"
	        fi
		else
			if [ -e ".git.commit.rev" ]; then
				export GIT_COMMIT_REV=`cat .git.commit.rev`
			else
				export GIT_COMMIT_REV=""
			fi
			if [ -e ".git.commit.tag" ]; then
				export GIT_COMMIT_TAG=`cat .git.commit.tag`
			else
				export GIT_COMMIT_TAG=""
			fi
			export GIT_IS_DIRTY=""
		fi
		BO_log "$VERBOSE" "GIT_COMMIT_REV: $GIT_COMMIT_REV"
		BO_log "$VERBOSE" "GIT_COMMIT_TAG: $GIT_COMMIT_TAG"
		BO_log "$VERBOSE" "GIT_IS_DIRTY: $GIT_IS_DIRTY"


		BO_run_node "$Z0_ROOT/job.js" $@

		BO_format "$VERBOSE" "FOOTER"
	}


	# TODO: Do all startup init here using 'PIO_PROFILE_SECRET' and issue
	#       temporary access keys for runtime


	# This variable must not be used from now on
#	export PIO_PROFILE_SECRET=""

	Run $@

}
init $@