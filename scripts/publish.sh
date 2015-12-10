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


		BO_sourcePrototype "$Z0_ROOT/cores/container/for/travis-ci/container.proto.sh"
		setEnvironmentVariables \
			VERBOSE="$VERBOSE" \
			PLATFORM_NAME="$PLATFORM_NAME" \
			ENVIRONMENT_NAME="$ENVIRONMENT_NAME" \
			ENVIRONMENT_TYPE="$ENVIRONMENT_TYPE" \
			PIO_PROFILE_KEY="$PIO_PROFILE_KEY" \
			PIO_PROFILE_SECRET="$PIO_PROFILE_SECRET"


	    BO_sourcePrototype "$Z0_ROOT/lib/node.pack/node.pack.proto.sh"
	    BO_sourcePrototype "$Z0_ROOT/lib/node.pack/packers/git/packer.proto.sh"

		git_getTag "TAG"
		TAG=`echo $TAG | node --eval '
			process.stdin.on("data", function (data) {
				data = data.toString().replace(/\n$/, "");
				var m = data.match(/^v(\d+)\.(\d+)\.(\d+)(-\d+-[^-]+)?$/);
				if (!m) throw new Error("Error parsing tag: " + data);
				var segments = {
					major: parseInt(m[1]) || 0,
					minor: parseInt(m[2]) || 0,
					patch: parseInt(m[3]) || 0
				};
				if (m[4]) {
					// TODO: Optionally increment a different version segment if the new
					//       release will have breaking changes or feature enhancements.
					segments.patch += 1;
				}
				var tag = "v" + segments.major + "." + segments.minor + "." + segments.patch + "-";
				if (m[4]) {
					// If we HAVE commits after the latest tag we prepare a build for the next version.
					tag += "build." + m[4].replace(/^-/, "").replace(/-/g, ".");
				} else {
					// If we have NO commits after the latest tag we prepare a tag for the inlined format of the release.
					tag += "inline";
				}
				process.stdout.write(tag + "\n");
			});
		'`
		BO_log "$VERBOSE" "TAG: $TAG"

		# Pack the source logic into a distribution branch by inlining all submodules
		node.pack "inline"

		node.pack.inline.source.stream.dirpath "STREAM_REPOSITORY_PATH"

		pushd "$STREAM_REPOSITORY_PATH" > /dev/null

			# TODO: Use the node.pack git syncer to do this
			git_ensureRemote "publish" "$GIT_PUBLISH_URL"
			git tag "$TAG"
			git_ensureSyncedRemoteBranch "publish" "master"

		popd > /dev/null

		BO_format "$VERBOSE" "FOOTER"
	}


	function __OLD__keep_as_reference_for_now__ {

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
	}

	Publish $@

}
init $@