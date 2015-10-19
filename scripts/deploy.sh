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


	DEPLOY_REPOSITORY_URL=`git config --get remote.origin.url`
	DEPLOY_REPOSITORY_PATH="$PWD/_exports/deploy/$PLATFORM_NAME"


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

		BO_log "$VERBOSE" "Ensure '$DEPLOY_REPOSITORY_URL' repo is cloned to '$DEPLOY_REPOSITORY_PATH'"
	    if [ ! -e "$DEPLOY_REPOSITORY_PATH" ]; then
		    if [ ! -e "$(dirname $DEPLOY_REPOSITORY_PATH)" ]; then
		        mkdir -p "$(dirname $DEPLOY_REPOSITORY_PATH)"
	        fi
	        git clone $DEPLOY_REPOSITORY_URL $DEPLOY_REPOSITORY_PATH
	    fi


		# Get branch to deploy
		BRANCH=$(git symbolic-ref --short HEAD)
		BO_log "$VERBOSE" "Deploying sources for branch: $BRANCH"

		# Get tag to publish
		if [[ $(git describe --tags 2>&1 | grep fatal | tail -n1) != "" ]]; then
	        echo "ERROR: Aborting. Your repository must have at least one tag!"
	        echo "Action: Tag your repository. You can use 'git tag v0.0.0' if you don'e have releases yet."
	        exit 1;
		fi
		DEPLOY_TAG="$(git describe --tags)"
		BO_log "$VERBOSE" "Deploying sources for tag: $DEPLOY_TAG"


		DEPLOY_BRANCH="$BRANCH.to.$PLATFORM_NAME"
		BO_log "$VERBOSE" "Deploying to branch: $DEPLOY_BRANCH"


        SOURCE_REPOSITORY_PATH="$PWD/.git"
        PLATFORM_DEPLOY_URL=`git config --get remote.heroku.url`


		pushd "$DEPLOY_REPOSITORY_PATH" > /dev/null

		    # Ensure deploy repo/branch is clean and up to date

    		BO_log "$VERBOSE" "Reset and update '$DEPLOY_REPOSITORY_PATH' repo"
		    git reset --hard
		    git checkout -b "$DEPLOY_BRANCH" 2> /dev/null || git checkout "$DEPLOY_BRANCH"
		    git fetch origin "$DEPLOY_BRANCH" || true
		    git pull origin "$DEPLOY_BRANCH" || true
		    git clean -df

			# Merge source changes

    		BO_log "$VERBOSE" "Merge changes for branch '$BRANCH' resulting in commit '$DEPLOY_TAG' on stream '$DEPLOY_BRANCH' from '$SOURCE_REPOSITORY_PATH'"
			git remote add source "$SOURCE_REPOSITORY_PATH" 2> /dev/null || true
			git fetch source
			git merge "source/$BRANCH" -m "Changes for branch '$BRANCH' resulting in commit '$DEPLOY_TAG' on stream '$DEPLOY_BRANCH'"
			

    		BO_log "$VERBOSE" "Ensure platform environment is in deploy branch"
    		# NOTE: This will copy file only if it does not exist which it will after it has been copied once.
    		#       i.e. it will not UPDATE an existing template file.
    		# TODO: Check git for master branch to see if file is there and if not copy tpl file.
			pushd "$Z0_ROOT/0.PINF.Genesis.to/Meta/Inception.0/Deployment/com.heroku/tpl" > /dev/null
		        for file in $(find *); do
#					if [ ! -e "$DEPLOY_REPOSITORY_PATH/$file" ]; then
			    		BO_log "$VERBOSE" "Writing file to: '$DEPLOY_REPOSITORY_PATH/$file'"
			       		cp -Rf "$file" "$DEPLOY_REPOSITORY_PATH/$file"
#			       	fi
	  	        done
		    pushd > /dev/null


    		BO_log "$VERBOSE" "Add new/changed/removed files to '$DEPLOY_REPOSITORY_PATH' repo"

			# Remove git ignore file
			rm .gitignore > /dev/null || true
			git .gitignore > /dev/null || true

	        git add -A || true
    		BO_log "$VERBOSE" "Commit changes to '$DEPLOY_REPOSITORY_PATH' repo"
	        git commit -m "Latest platform tooling for: $PLATFORM_NAME" || true


			if [ ! -e "0" ]; then
				pushd "$Z0_ROOT" > /dev/null
					Z0_COMMIT=`git rev-parse HEAD`
					Z0_REPOSITORY_URL=`git config --get remote.origin.url`
			    pushd > /dev/null

	    		BO_log "$VERBOSE" "Lock ZeroSystem submodule from '$Z0_REPOSITORY_URL' at '.0' to '$Z0_COMMIT'"

				# TODO: Swap out repository URL if changed but issue warning?
				if [[ $(git submodule | awk '{ print $2 }' | grep -e '^\.0$' | tail -n1) == "" ]]; then
		    		git submodule add "$Z0_REPOSITORY_URL" ".0"
		    	fi

				pushd ".0" > /dev/null
		    		BO_log "$VERBOSE" "Fetch submodule for '.0' from '$Z0_REPOSITORY_URL'"
					git fetch origin
		    		BO_log "$VERBOSE" "Checkout submodule '.0' to commit '$Z0_COMMIT'"
	    			git checkout "$Z0_COMMIT"
			    pushd > /dev/null
		        git add -A || true
		        git commit -m "Lock ZeroSystem submodule from '$Z0_REPOSITORY_URL' at '.0' to '$Z0_COMMIT' for platform: $PLATFORM_NAME" || true
			fi


    		BO_log "$VERBOSE" "Push to origin"
	        git push origin "$DEPLOY_BRANCH" --tags


	        # Deploy to platform (heroku for now)

    		BO_log "$VERBOSE" "Add 'heroku' remote url '$PLATFORM_DEPLOY_URL'"
	        git remote add heroku "$PLATFORM_DEPLOY_URL" 2> /dev/null || true


			BO_log "$VERBOSE" "Setting heroku config variables ..."
			heroku config:set \
				VERBOSE="$VERBOSE" \
				PLATFORM_NAME="$PLATFORM_NAME" \
				ENVIRONMENT_NAME="$ENVIRONMENT_NAME" \
				ENVIRONMENT_TYPE="production" \
				PIO_PROFILE_KEY="$PIO_PROFILE_KEY" \
				PIO_PROFILE_SECRET="$PIO_PROFILE_SECRET" \
				NODE_MODULES_CACHE=false > /dev/null

			# @see http://stackoverflow.com/a/2980050/330439
		    git push -f heroku HEAD:master

	    pushd > /dev/null


		BO_format "$VERBOSE" "FOOTER"
	}

	Deploy $@
}
init $@