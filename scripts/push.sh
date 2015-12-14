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


	function Push {
		BO_format "$VERBOSE" "HEADER" "Pushing system"

		if [ -z "$GIT_PUBLISH_URL" ]; then
			export GIT_PUBLISH_URL="git@github.com:0system/0system.0.git"
		fi

		BO_log "$VERBOSE" "PWD: $PWD"
		BO_log "$VERBOSE" "GIT_PUBLISH_URL: $GIT_PUBLISH_URL"




		function setCIVariables {
			setSecureEnvironmentVariables \
				VERBOSE="$VERBOSE" \
				PLATFORM_NAME="$PLATFORM_NAME" \
				ENVIRONMENT_NAME="$ENVIRONMENT_NAME" \
				ENVIRONMENT_TYPE="$ENVIRONMENT_TYPE" \
				PIO_PROFILE_KEY="$PIO_PROFILE_KEY" \
				PIO_PROFILE_SECRET="$PIO_PROFILE_SECRET"
	
			# TODO: Write these credentials into an encrypted one-time trigger file
			#       instead of setting them globally here. We can determine which credentials
			#       to write into the trigger file by looking at the schemas for the triggers
			#       that should be executed.
	#		BO_log "$VERBOSE" "Z0_TRIGGER_POSTINSTALL_BUNDLE: $Z0_TRIGGER_POSTINSTALL_BUNDLE"
	#		if [ "$Z0_TRIGGER_POSTINSTALL_BUNDLE" == "1" ]; then
				setSecureEnvironmentVariables \
					Z0_TRIGGER_POSTINSTALL_BUNDLE="1" \
					Z0_NODEPACK_AWS_ACCESS_KEY_ID="$Z0_NODEPACK_AWS_ACCESS_KEY_ID" \
					Z0_NODEPACK_AWS_SECRET_ACCESS_KEY="$Z0_NODEPACK_AWS_SECRET_ACCESS_KEY"
	#		fi
		}
		function setTravisCIVariables {
			BO_sourcePrototype "$Z0_ROOT/cores/container/for/travis-ci/container.proto.sh"
			setCIVariables
		}
		function setCircleCIVariables {
			BO_sourcePrototype "$Z0_ROOT/cores/container/for/circleci/container.proto.sh"
			setCIVariables
		}
		if [ -e ".travis.yml" ]; then
			setTravisCIVariables
		fi
		if [ ! -z "$Z0_BUILD_CIRCLECI_API_TOKEN" ]; then
			setCircleCIVariables
		fi


		git push origin


		BO_format "$VERBOSE" "FOOTER"
	}

	Push $@

}
init $@