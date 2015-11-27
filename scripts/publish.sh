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


	function Publish {
		BO_format "$VERBOSE" "HEADER" "Publishing system"

		if [ -z "$GIT_PUBLISH_URL" ]; then
			export GIT_PUBLISH_URL="git@github.com:0system/0system.0.git"
		fi

		BO_log "$VERBOSE" "PWD: $PWD"
		BO_log "$VERBOSE" "GIT_PUBLISH_URL: $GIT_PUBLISH_URL"

	    BO_sourcePrototype "$Z0_ROOT/lib/node.pack/node.pack.proto.sh"
	    BO_sourcePrototype "$Z0_ROOT/lib/node.pack/packers/git/packer.proto.sh"

		# Pack the source logic into a distribution branch by inlining all submodules
		node.pack "inline"

		node.pack.inline.source.stream.dirpath "STREAM_REPOSITORY_PATH"

	    # Ensure dev repo is clean and up to date
		pushd "$STREAM_REPOSITORY_PATH" > /dev/null

			git_ensureRemote "publish" "$GIT_PUBLISH_URL"
			git_ensureSyncedRemote "publish" "master"


		popd > /dev/null



		BO_format "$VERBOSE" "FOOTER"
	}





#	DEV_REPOSITORY_URL="git@github.com:LogicCores/0.dev.git"
	# TODO: Make exported name configurable
#	DEV_REPOSITORY_PATH="$WORKSPACE_DIR/_exports/0.dev"


	function Publish_OLD {
		BO_format "$VERBOSE" "HEADER" "Publishing system"


		BO_log "$VERBOSE" "PWD: $PWD"

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
		if [[ $(git describe --tags 2>&1 | grep fatal | tail -n1) != "" ]]; then
	        echo "ERROR: Aborting. Your repository must have at least one tag!"
	        echo "Action: Tag your repository. You can use 'git tag v0.0.0' if you don'e have releases yet."
	        exit 1;
		fi
		TAG=$(git describe --tags)
		BO_log "$VERBOSE" "Exporting sources for tag: $TAG"


	    # Ensure dev repo is clean and up to date
		pushd "$DEV_REPOSITORY_PATH" > /dev/null
    		BO_log "$VERBOSE" "Reset and update '0.dev' repo"
		    git reset --hard
		    git checkout -b "$BRANCH" || git checkout "$BRANCH"
		    git fetch origin "$BRANCH" || true
		    git pull origin "$BRANCH" || true
		    git clean -df

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

		pushd "$DEV_REPOSITORY_PATH" > /dev/null

    		BO_log "$VERBOSE" "Add new/changed/removed files to '0.dev' repo"
	        git add -A

    		BO_log "$VERBOSE" "Commit changes to '0.dev' repo"
	        git commit -m "Changes for branch '$BRANCH' to reach tag: $TAG"

    		BO_log "$VERBOSE" "Tag '0.dev' repo"
	        git tag "$TAG"

    		BO_log "$VERBOSE" "Push to origin"
	        git push origin "$BRANCH" --tags

	    pushd

		BO_format "$VERBOSE" "FOOTER"
	}

	Publish $@

}
init $@