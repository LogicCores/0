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

	BO_sourcePrototype "$Z0_ROOT/lib/node.pack/packers/git/packer.proto.sh"


	function Deploy {
		BO_format "$VERBOSE" "HEADER" "Deploying system ..."

		pushd "$WORKSPACE_DIR" > /dev/null

			function getPackageDescriptorConfigValue {
				BO_setResult "$1" `node --eval '
					var descriptorPath = "'$WORKSPACE_DIR'/package.json";
					var descriptor = require(descriptorPath);
					if (descriptor.config && descriptor.config["'$2'"]) {
						process.stdout.write(descriptor.config["'$2'"]);
					}
				'`
			}

			function setPackageDescriptorConfigValue {
				echo "Writing value '$2' for '$1' to '$WORKSPACE_DIR/package.json'"
				node --eval '
					var descriptorPath = "'$WORKSPACE_DIR'/package.json";
					var descriptor = require(descriptorPath);
					var before = JSON.stringify(descriptor, null, 4);
					if (!descriptor.config) descriptor.config = {};
					descriptor.config["'$1'"] = "'$2'";
					var after = JSON.stringify(descriptor, null, 4);
					if (after !== before) {
						require("fs").writeFileSync(descriptorPath, after, "utf8");
					}
				'
				if [ "$Z0_PROJECT_AUTO_COMMIT_CHANGES" == "1" ]; then
					pushd "$Z0_PROJECT_DIRPATH" > /dev/null
			            git_commitChanges "Updated Zero System workspace configuration";
					popd > /dev/null
				fi
			}

		    BO_log "$VERBOSE" "WORKSPACE_DIR: $WORKSPACE_DIR"
			BO_log "$VERBOSE" "PWD: $PWD"

			# TODO: Get platform names from declarations and deploy to each environment or only some
			#       based on what we are being asked to do.
			export Z0_DEPLOY_PLATFORM_NAME="com.heroku"

			BO_log "$VERBOSE" "Z0_DEPLOY_PLATFORM_NAME: $Z0_DEPLOY_PLATFORM_NAME"


			if [ -z "$Z0_DEPLOY_MODE" ]; then
				if [ -z "$npm_config_argv" ]; then
					echo "ERROR: This script must be run via 'npm run <script>' or the 'Z0_DEPLOY_MODE' environment variable must be set!"
					exit 1
				fi
				if echo "$npm_config_argv" | grep -q -Ee '"--production"'; then
					Z0_DEPLOY_MODE="production"
				else
					Z0_DEPLOY_MODE="staging"
				fi
			fi

			if echo "$npm_config_argv" | grep -q -Ee '"--bundle"'; then
				Z0_TRIGGER_POSTINSTALL_BUNDLE="1"
			fi


			# We set 'Z0_DEPLOY_ENVIRONMENT_NAME' based on 'Z0_DEPLOY_MODE'
			if [ "$Z0_DEPLOY_MODE" == "staging" ]; then
				if [ -z "$Z0_DEPLOY_STAGING_ENVIRONMENT_NAME" ]; then
					getPackageDescriptorConfigValue "Z0_DEPLOY_STAGING_ENVIRONMENT_NAME" "Z0_DEPLOY_STAGING_ENVIRONMENT_NAME"
					if [ -z "$Z0_DEPLOY_STAGING_ENVIRONMENT_NAME" ]; then
						BO_callPlugin "$Z0_ROOT/lib/bash.origin.prompt/bash.origin.prompt" askForInput "Z0_DEPLOY_STAGING_ENVIRONMENT_NAME" "Please enter the name of your NEWLY CREATED $Z0_DEPLOY_PLATFORM_NAME STAGING application"
						setPackageDescriptorConfigValue "Z0_DEPLOY_STAGING_ENVIRONMENT_NAME" "$Z0_DEPLOY_STAGING_ENVIRONMENT_NAME"
					fi
				fi
				Z0_DEPLOY_ENVIRONMENT_NAME="$Z0_DEPLOY_STAGING_ENVIRONMENT_NAME"
			elif [ "$Z0_DEPLOY_MODE" == "production" ]; then
				if [ -z "$Z0_DEPLOY_PRODUCTION_ENVIRONMENT_NAME" ]; then
					getPackageDescriptorConfigValue "Z0_DEPLOY_PRODUCTION_ENVIRONMENT_NAME" "Z0_DEPLOY_STAGING_ENVIRONMENT_NAME"
					if [ -z "$Z0_DEPLOY_STAGING_ENVIRONMENT_NAME" ]; then
						BO_callPlugin "$Z0_ROOT/lib/bash.origin.prompt/bash.origin.prompt" askForInput "Z0_DEPLOY_STAGING_ENVIRONMENT_NAME" "Please enter the name of your NEWLY CREATED $Z0_DEPLOY_PLATFORM_NAME PRODUCTION application"
						setPackageDescriptorConfigValue "Z0_DEPLOY_STAGING_ENVIRONMENT_NAME" "$Z0_DEPLOY_STAGING_ENVIRONMENT_NAME"
					fi
				fi
				Z0_DEPLOY_ENVIRONMENT_NAME="$Z0_DEPLOY_PRODUCTION_ENVIRONMENT_NAME"
			fi


			if [ -z "$Z0_DEPLOY_ENVIRONMENT_NAME" ]; then
				echo "ERROR: 'Z0_DEPLOY_ENVIRONMENT_NAME' environment variable not set!"
				exit 1
			fi
			if [ -z "$Z0_DEPLOY_PLATFORM_NAME" ]; then
				echo "ERROR: 'Z0_DEPLOY_PLATFORM_NAME' environment variable not set!"
				exit 1
			fi

			BO_log "$VERBOSE" "Z0_DEPLOY_ENVIRONMENT_NAME: $Z0_DEPLOY_ENVIRONMENT_NAME"
			BO_log "$VERBOSE" "Z0_DEPLOY_PLATFORM_NAME: $Z0_DEPLOY_PLATFORM_NAME"


			# Tag repository if there are no tags and we are set to auto-commit changes.
			if [ "$Z0_PROJECT_AUTO_COMMIT_CHANGES" == "1" ]; then
				if ! git_hasTags ; then
					TAG=`node --eval 'process.stdout.write("v" + require("'$PWD'/package.json").version);'`
		        	BO_log "$VERBOSE" "Tagging repository with first tag '$TAG'!"
					git tag "$TAG"
				fi
			fi


			# TODO: Move into `pinf.to.heroku`
			export PLATFORM_NAME="$Z0_DEPLOY_PLATFORM_NAME"
			export ENVIRONMENT_NAME="$Z0_DEPLOY_ENVIRONMENT_NAME.herokuapp.com"
	        git remote rm "$Z0_DEPLOY_PLATFORM_NAME" 2> /dev/null || true
			git remote add "$Z0_DEPLOY_PLATFORM_NAME" "git@heroku.com:$Z0_DEPLOY_ENVIRONMENT_NAME.git" > /dev/null || true


			function deployEnvironment {
	        	export ENVIRONMENT_NAME="$1"
	        	BO_log "$VERBOSE" "Deploying '$PWD' to platform '$Z0_DEPLOY_PLATFORM_NAME' using profile '$ENVIRONMENT_NAME' ..."
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

			# TODO: For now we only deploy to the specified 'ENVIRONMENT_NAME'
			if [ -z "$ENVIRONMENT_NAME" ]; then
				echo "ERROR: 'ENVIRONMENT_NAME' environment variable not set!"
				exit 1
			fi
			# TODO: Move into `pinf.to.heroku`
#			if [ -z "$ENVIRONMENT_NAME" ]; then
#				forEachDeployProfile "./Deployments/**.herokuapp.com.*profile.ccjson"
#				forEachDeployProfile "./Deployments/**/*.herokuapp.com.*profile.ccjson"
#			else
				deployEnvironment "$ENVIRONMENT_NAME"
#			fi

		popd > /dev/null

		BO_format "$VERBOSE" "FOOTER"
	}

	Deploy $@

}
init $@