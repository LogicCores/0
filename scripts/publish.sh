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


	DEV_REPOSITORY_URL="git@github.com:LogicCores/0.dev.git"
	DEV_REPOSITORY_PATH="$__BO_DIR__/../_exports/0.dev"


	function Publish {
		BO_format "$VERBOSE" "HEADER" "Publishing system"


		pushd "$__BO_DIR__/.." > /dev/null

    		BO_log "$VERBOSE" "Check if git dirty"
		    if [[ $(git diff --shortstat 2> /dev/null | tail -n1) != "" ]] || [[ $(git status -s 2> /dev/null | tail -n1) != "" ]]; then
		        echo "ERROR: Aborting. Your working directory contains uncommitted changes!"
		        echo "Action: Commit changes"
		        exit 1;
	        fi

    		BO_log "$VERBOSE" "Ensure '0.dev' repo '$DEV_REPOSITORY_URL' is cloned to '$DEV_REPOSITORY_PATH'"
		    if [ ! -e "$DEV_REPOSITORY_PATH" ]; then
    		    if [ ! -e "$(dirname $DEV_REPOSITORY_PATH)" ]; then
    		        mkdir -p "$(dirname $DEV_REPOSITORY_PATH)"
		        fi
		        git clone $DEV_REPOSITORY_URL $DEV_REPOSITORY_PATH
		    fi


    		# Get branch to publish
    		BRANCH=$(git symbolic-ref --short HEAD)
    		BO_log "$VERBOSE" "Exporting sources for branch: $BRANCH"

    		# Get tag to publish
    		TAG=$(git describe --tags)
    		BO_log "$VERBOSE" "Exporting sources for tag: $TAG"


		    # Ensure dev repo is clean and up to date
    		pushd "$DEV_REPOSITORY_PATH" > /dev/null
        		BO_log "$VERBOSE" "Reset and update '0.dev' repo"
    		    git reset --hard
    		    git checkout -b "$BRANCH" || git checkout "$BRANCH"
    		    git reset --hard
    		    git fetch origin "$BRANCH" || true
    		    git pull origin "$BRANCH" || true

        		BO_log "$VERBOSE" "Ensure tag '$TAG' is not already exported"
                if git rev-parse $TAG >/dev/null 2>&1 ; then
    		        echo "ERROR: Aborting. Already exported sources for tag '$TAG'!"
    		        echo "Action: Create a new tag to export"
                    exit 1;
                fi
    		popd > /dev/null


    		BO_log "$VERBOSE" "Export '0' repo"
    		
    		mv "$DEV_REPOSITORY_PATH/.git" "$DEV_REPOSITORY_PATH.git"
    		rm -Rf "$DEV_REPOSITORY_PATH"
    		mkdir "$DEV_REPOSITORY_PATH"
    		mv "$DEV_REPOSITORY_PATH.git" "$DEV_REPOSITORY_PATH/.git"

    		git archive "$BRANCH" | tar -x -C "$DEV_REPOSITORY_PATH"

    		# Remove some directories that should never be committed
    		# TODO: Make these configurable
    		BO_log "$VERBOSE" "Remove some directories and files"
    		rm -Rf "$DEV_REPOSITORY_PATH/.secret"
    		rm -Rf "$DEV_REPOSITORY_PATH/_"*

    		BO_log "$VERBOSE" "Export '0' submodules"
	        git submodule foreach "
	            dir=\${PWD#$PWD/}
	            git archive HEAD | tar -x -C "$DEV_REPOSITORY_PATH/\$dir"
	        "

	        # Add and commit all files and tag
    		pushd "$DEV_REPOSITORY_PATH" > /dev/null
        		BO_log "$VERBOSE" "Add new/changed/removed files to '0.dev' repo"
    	        git add -A
        		BO_log "$VERBOSE" "Commit changes to '0.dev' repo"
    	        git commit -m "Changes for branch '$BRANCH' to reach tag: $TAG"
        		BO_log "$VERBOSE" "Tag '0.dev' repo"
    	        git tag "$TAG"
    	    pushd

		popd > /dev/null

		BO_format "$VERBOSE" "FOOTER"
	}

	Publish $@

}
init $@