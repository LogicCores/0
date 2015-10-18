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
	DEPLOY_REPOSITORY_PATH="$WORKSPACE_DIR/_exports/deploy/$PLATFORM_NAME"


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
		TAG=$(git describe --tags)
		BO_log "$VERBOSE" "Deploying sources for tag: $TAG"


		DEPLOY_BRANCH="$BRANCH.to.$PLATFORM_NAME"
		BO_log "$VERBOSE" "Deploying to branch: $DEPLOY_BRANCH"

	    # Ensure deploy repo/branch is clean and up to date
		pushd "$DEPLOY_REPOSITORY_PATH" > /dev/null
    		BO_log "$VERBOSE" "Reset and update '$DEPLOY_REPOSITORY_PATH' repo"
		    git reset --hard
		    git checkout -b "$DEPLOY_BRANCH" || git checkout "$DEPLOY_BRANCH"
		    git reset --hard
		    git fetch origin "$DEPLOY_BRANCH" || true
		    git pull origin "$DEPLOY_BRANCH" || true
		popd > /dev/null



		BO_log "$VERBOSE" "Export '$PWD' repo"
		
		mv "$DEPLOY_REPOSITORY_PATH/.git" "$DEPLOY_REPOSITORY_PATH.git"
		rm -Rf "$DEPLOY_REPOSITORY_PATH"
		mkdir "$DEPLOY_REPOSITORY_PATH"
		mv "$DEPLOY_REPOSITORY_PATH.git" "$DEPLOY_REPOSITORY_PATH/.git"

		git archive "$BRANCH" | tar -x -C "$DEPLOY_REPOSITORY_PATH"



        PLATFORM_DEPLOY_URL=`git config --get remote.heroku.url`


		pushd "$DEPLOY_REPOSITORY_PATH" > /dev/null

    		BO_log "$VERBOSE" "Add new/changed/removed files to '$DEPLOY_REPOSITORY_PATH' repo"
	        git add -A

    		BO_log "$VERBOSE" "Commit changes to '$DEPLOY_REPOSITORY_PATH' repo"
	        git commit -m "Changes for branch '$BRANCH' resulting in commit '$TAG' on stream '$DEPLOY_BRANCH'"

    		BO_log "$VERBOSE" "Push to origin"
	        git push origin "$DEPLOY_BRANCH" --tags


	        # Deploy to platform (heroku for now)

    		BO_log "$VERBOSE" "Add 'heroku' remote url '$PLATFORM_DEPLOY_URL'"
	        git remote add heroku "$PLATFORM_DEPLOY_URL" || true


			BO_log "$VERBOSE" "Setting heroku config variables ..."
			heroku config:set \
				PLATFORM_NAME="$PLATFORM_NAME" \
				ENVIRONMENT_NAME="$ENVIRONMENT_NAME" \
				ENVIRONMENT_TYPE="production" \
				PIO_PROFILE_KEY="$PIO_PROFILE_KEY" \
				PIO_PROFILE_SECRET="$PIO_PROFILE_SECRET" > /dev/null

		    git push heroku master

	    pushd


		BO_format "$VERBOSE" "FOOTER"
	}

	Deploy $@
}
init $@