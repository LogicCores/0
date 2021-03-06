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


	function Deploy {
		BO_format "$VERBOSE" "HEADER" "Deploy system ..."

		BO_log "$VERBOSE" "ENVIRONMENT_NAME: $ENVIRONMENT_NAME"
		BO_log "$VERBOSE" "PWD: $PWD"


	    BO_sourcePrototype "$Z0_ROOT/lib/node.pack/node.pack.proto.sh"
	    BO_sourcePrototype "$Z0_ROOT/lib/node.pack/packers/git/packer.proto.sh"

		git_assertRemote "$PLATFORM_NAME"


		# NOTE: Instead of using 'Z0_REPOSITORY_URL' and 'Z0_REPOSITORY_COMMIT_ISH' here
		#       we ALWAYS get the URL and COMMIT from `.0` directly to ensure we are deploying
		#       the linked release. The environment variables are only applicable for the
		#       installation/update process. Once installed the deployment commit can be different.
		# TODO: Add option to force `.0` values to be the same as config/env variables to ensure
		#       latest changes are comitted and accessible to others before deployment.

		pushd "$Z0_ROOT" > /dev/null
			git_getRemoteUrl "Z0_REPOSITORY_URL" "origin"
		    # TODO: Use generic git url normalization lib here
		    Z0_REPOSITORY_URL=`echo "$Z0_REPOSITORY_URL" | perl -pe 's/^git@([^:]+):(.+?)\.git$/git:\/\/$1\/$2.git/g'`
			git_getTag "Z0_REPOSITORY_COMMIT_ISH"
		popd > /dev/null

		function disabled {
			if [ -z "$Z0_REPOSITORY_URL" ]; then
				if [ -z "$npm_package_config_Z0_REPOSITORY_URL" ]; then
					echo "Error: 'Z0_REPOSITORY_URL' environment variable not found nor is 'config.Z0_REPOSITORY_URL' set in package.json!"
					exit 1
				fi
				Z0_REPOSITORY_URL="$npm_package_config_Z0_REPOSITORY_URL"
			fi
			if [ -z "$Z0_REPOSITORY_COMMIT_ISH" ]; then
				if [ -z "$npm_package_config_Z0_REPOSITORY_COMMIT_ISH" ]; then
					echo "Error: 'Z0_REPOSITORY_COMMIT_ISH' environment variable not found nor is 'config.Z0_REPOSITORY_COMMIT_ISH' set in package.json!"
					exit 1
				fi
				Z0_REPOSITORY_COMMIT_ISH="$npm_package_config_Z0_REPOSITORY_COMMIT_ISH"
			fi
		}

		BO_log "$VERBOSE" "Z0_REPOSITORY_URL: $Z0_REPOSITORY_URL"
		BO_log "$VERBOSE" "Z0_REPOSITORY_COMMIT_ISH: $Z0_REPOSITORY_COMMIT_ISH"


		# Pack the source logic into a distribution branch by inlining all submodules
		node.pack "inline"

		node.pack.inline.source.stream.dirpath "STREAM_REPOSITORY_PATH"

		# Get branch to deploy
		git_getBranch "BRANCH"
		BO_log "$VERBOSE" "Deploying sources for branch: $BRANCH"

		DEPLOY_BRANCH="$BRANCH.nodepack.inline.to.$PLATFORM_NAME"
		BO_log "$VERBOSE" "Deploying to branch: $DEPLOY_BRANCH"

        SOURCE_REPOSITORY_PATH="$PWD"
        git_getRemoteUrl "PLATFORM_DEPLOY_URL" "$PLATFORM_NAME"
		BO_log "$VERBOSE" "Deploying to url: $PLATFORM_DEPLOY_URL"

		GIT_COMMIT_REV=`git rev-parse --short HEAD`
		BO_log "$VERBOSE" "GIT_COMMIT_REV: $GIT_COMMIT_REV"

		GIT_COMMIT_TAG=`git describe --tags`
		BO_log "$VERBOSE" "GIT_COMMIT_TAG: $GIT_COMMIT_TAG"

		pushd "$STREAM_REPOSITORY_PATH" > /dev/null


			function ensurePlatformEnvironment {
	    		BO_log "$VERBOSE" "Ensure platform environment is in deploy branch"
	    		# NOTE: This will copy file only if it does not exist which it will after it has been copied once.
	    		#       i.e. it will not UPDATE an existing template file.
	    		# TODO: Check git for master branch to see if file is there and if not copy tpl file.
				pushd "$Z0_ROOT/0.PINF.Genesis.to/Meta/Inception.0/Deployment/$PLATFORM_NAME/tpl" > /dev/null
			        for file in $(find *); do
	#					if [ ! -e "$STREAM_REPOSITORY_PATH/$file" ]; then
				    		BO_log "$VERBOSE" "Writing file to: '$STREAM_REPOSITORY_PATH/$file'"
				       		cp -Rf "$file" "$STREAM_REPOSITORY_PATH/$file"
	#			       	fi
		  	        done
			    pushd > /dev/null
			    # Copy dependency declarations
				node --eval '
				const PATH = require("path");
				const FS = require("fs");
				var sourceDescriptor = JSON.parse(FS.readFileSync("'$SOURCE_REPOSITORY_PATH'/package.json"));
				var targetDescriptor = JSON.parse(FS.readFileSync("'$STREAM_REPOSITORY_PATH'/package.json"));
				if (sourceDescriptor.dependencies) {
					targetDescriptor.dependencies = sourceDescriptor.dependencies;
					// Remove 0.workspace
					delete targetDescriptor.dependencies["0.workspace"];
					FS.writeFileSync("'$STREAM_REPOSITORY_PATH'/package.json", JSON.stringify(targetDescriptor, null, 4));
				}
				'
			}

			git_ensureSyncedBranch "$DEPLOY_BRANCH"

			git_mergeFromBranch "$BRANCH.nodepack.inline"

			ensurePlatformEnvironment

	        git add -A || true
    		BO_log "$VERBOSE" "Commit changes for latest platform tooling for: $PLATFORM_NAME"
	        git commit -m "Latest platform tooling for: $PLATFORM_NAME" || true


			printf "%s" "$GIT_COMMIT_REV" > .git.commit.rev
	        git add .git.commit.rev || true

			printf "%s" "$GIT_COMMIT_TAG" > .git.commit.tag
	        git add .git.commit.tag || true

    		BO_log "$VERBOSE" "Freeze commit rev & tag for source"
	        git commit -m "Freeze commit rev & tag for source" || true


			if [ ! -e "0" ]; then

#				pushd "$Z0_ROOT" > /dev/null
#					Z0_REPOSITORY_COMMIT_ISH=`git rev-parse HEAD`
#					Z0_REPOSITORY_URL=`git config --get remote.origin.url`
#			    pushd > /dev/null

	    		BO_log "$VERBOSE" "Lock ZeroSystem submodule from '$Z0_REPOSITORY_URL' at '.0' to '$Z0_REPOSITORY_COMMIT_ISH'"

				# Remove submodule as the submodule state is messed up after merging.
				git_removeSubmodule ".0"

#				git rm ".0" || true
				# TODO: Swap out repository URL if changed but issue warning?
#				if [[ $(git submodule 2>&1 | awk '{ print $2 }' | grep -e '^\.0$' | tail -n1) == "" ]]; then
		    		git submodule add --force "$Z0_REPOSITORY_URL" ".0"
#		    	fi
	    		BO_log "$VERBOSE" "Update submodule for '.0' from '$Z0_REPOSITORY_URL'"
		    	git submodule update --init ".0"

				pushd ".0" > /dev/null
		    		BO_log "$VERBOSE" "Fetch submodule for '.0' from '$Z0_REPOSITORY_URL'"
					git fetch origin
		    		BO_log "$VERBOSE" "Checkout submodule '.0' to commit '$Z0_REPOSITORY_COMMIT_ISH'"
	    			git checkout "$Z0_REPOSITORY_COMMIT_ISH"
			    pushd > /dev/null
		        git add -A || true
		        git commit -m "Lock ZeroSystem submodule from '$Z0_REPOSITORY_URL' at '.0' to '$Z0_REPOSITORY_COMMIT_ISH' for platform: $PLATFORM_NAME" || true
			fi


    		BO_log "$VERBOSE" "Push to origin"
	        git push origin "$DEPLOY_BRANCH" || true


	        # Deploy to platform

    		BO_log "$VERBOSE" "Add '$PLATFORM_NAME' remote url '$PLATFORM_DEPLOY_URL'"
	        git remote rm "$PLATFORM_NAME" 2> /dev/null || true
	        git remote add "$PLATFORM_NAME" "$PLATFORM_DEPLOY_URL" 2> /dev/null || true


			BO_log "$VERBOSE" "Setting '$PLATFORM_NAME' config variables ..."

			if [ "$PLATFORM_NAME" == "com.heroku" ]; then

			    # TODO: Use heroku bash.origin prototype to import deploy function

				heroku config:set \
					VERBOSE="$VERBOSE" \
					PLATFORM_NAME="$PLATFORM_NAME" \
					ENVIRONMENT_NAME="$ENVIRONMENT_NAME" \
					ENVIRONMENT_TYPE="production" \
					PIO_PROFILE_KEY="$PIO_PROFILE_KEY" \
					PIO_PROFILE_SECRET="$PIO_PROFILE_SECRET" \
					NODE_MODULES_CACHE=false > /dev/null

				# TODO: Write these credentials into an encrypted one-time trigger file
				#       instead of setting them globally here. We can determine which credentials
				#       to write into the trigger file by looking at the schemas for the triggers
				#       that should be executed.
				BO_log "$VERBOSE" "Z0_TRIGGER_POSTINSTALL_BUNDLE: $Z0_TRIGGER_POSTINSTALL_BUNDLE"
				if [ "$Z0_TRIGGER_POSTINSTALL_BUNDLE" == "1" ]; then
					heroku config:set \
						Z0_TRIGGER_POSTINSTALL_BUNDLE="$Z0_TRIGGER_POSTINSTALL_BUNDLE" \
						Z0_NODEPACK_AWS_ACCESS_KEY_ID="$Z0_NODEPACK_AWS_ACCESS_KEY_ID" \
						Z0_NODEPACK_AWS_SECRET_ACCESS_KEY="$Z0_NODEPACK_AWS_SECRET_ACCESS_KEY" > /dev/null
				fi

			else
				echo "ERROR: Only the 'com.heroku' platform is supported at this time!"
				exit 1;
			fi

			BO_log "$VERBOSE" "Pushing to '$PLATFORM_NAME' ..."

			# @see http://stackoverflow.com/a/2980050/330439
		    git push -f "$PLATFORM_NAME" HEAD:master


			# We now erase the variables we temporarily used.
			# TODO: Remove this once we use the trigger file above.
			if [ "$Z0_TRIGGER_POSTINSTALL_BUNDLE" == "1" ]; then
				heroku config:set \
					Z0_TRIGGER_POSTINSTALL_BUNDLE="" \
					Z0_NODEPACK_AWS_ACCESS_KEY_ID="" \
					Z0_NODEPACK_AWS_SECRET_ACCESS_KEY="" > /dev/null
			fi

	    popd > /dev/null


		BO_format "$VERBOSE" "FOOTER"
	}

	Deploy $@
}
init $@