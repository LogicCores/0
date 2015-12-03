#!/bin/bash -e
if [ -z "$Z0_ROOT" ]; then
	export Z0_ROOT="$PWD/.0"
fi
# Source https://github.com/bash-origin/bash.origin
. "$Z0_ROOT/lib/bash.origin/bash.origin"
function init {
	eval BO_SELF_BASH_SOURCE="$BO_READ_SELF_BASH_SOURCE"
	BO_deriveSelfDir ___TMP___ "$BO_SELF_BASH_SOURCE"
	local __BO_DIR__="$___TMP___"


	if [ -z "$WORKSPACE_DIR" ]; then
		export WORKSPACE_DIR="$PWD"
	fi

	export PATH_OVERRIDES="$WORKSPACE_DIR/node_modules/.bin:$__BO_DIR__"


	if [ -z "$Z0_ROOT" ]; then
		BO_followPointer "Z0_ROOT" "$PWD" ".0"
		export Z0_ROOT
	fi

    if [ -z "$WORKSPACE_DIR" ] || [ ! -e "$WORKSPACE_DIR" ]; then
        echo "ERROR: The 'WORKSPACE_DIR' environment variable must be set to point to the root of your workspace!"
        exit 1;
    fi

    if [ -z "$Z0_ROOT" ] || [ ! -e "$Z0_ROOT" ]; then
        echo "ERROR: The 'Z0_ROOT' environment variable must be set to point to the root of a zero system clone!"
        exit 1;
    fi

	BO_log "$VERBOSE" "WORKSPACE_DIR: $WORKSPACE_DIR"
	BO_log "$VERBOSE" "Z0_ROOT: $Z0_ROOT"

    BO_sourcePrototype "$Z0_ROOT/scripts/activate.sh"

}
init $@