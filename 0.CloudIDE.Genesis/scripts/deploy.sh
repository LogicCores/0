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
		BO_format "$VERBOSE" "HEADER" "Deploying system ..."

		pushd "$WORKSPACE_DIR" > /dev/null

		    BO_log "$VERBOSE" "WORKSPACE_DIR: $WORKSPACE_DIR"
			BO_log "$VERBOSE" "PWD: $PWD"

	
			# TODO: Get platform names from declarations and deploy to each environment or only some
			#       based on what we are being asked to do.
			if [ -z "$PLATFORM_NAME" ]; then
				export PLATFORM_NAME="com.heroku"
			fi

			BO_log "$VERBOSE" "PLATFORM_NAME: $PLATFORM_NAME"
			BO_log "$VERBOSE" "ENVIRONMENT_NAME: $ENVIRONMENT_NAME"
			
			function deployEnvironment {
	        	export ENVIRONMENT_NAME="$1"
	        	BO_log "$VERBOSE" "Deploying '$PWD' to platform '$PLATFORM_NAME' using profile '$ENVIRONMENT_NAME' ..."
			    "$Z0_ROOT/scripts/deploy.sh"
			}

			function forEachDeployProfile {
		        for file in $(find $1 2>/dev/null || true); do
		        	file=$(basename $file)
		        	file=${file%.proto.profile.ccjson}
		        	file=${file%.profile.ccjson}
					deployEnvironment "$file"
		        done
			}

			if [ -z "$ENVIRONMENT_NAME" ]; then
				forEachDeployProfile "./Deployments/**.herokuapp.com.*profile.ccjson"
				forEachDeployProfile "./Deployments/**/*.herokuapp.com.*profile.ccjson"
			else
				deployEnvironment "$ENVIRONMENT_NAME"
			fi

		popd > /dev/null

		BO_format "$VERBOSE" "FOOTER"
	}

	Deploy $@

}
init $@