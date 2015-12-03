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


    TEMPLATE_BASE_PATH="$__BO_DIR__/template"


	function z0.aspect.provision {
		BO_format "$VERBOSE" "HEADER" "0.CloudIDE.Genesis : z0.aspect.provision"

# NOTE: We are doing this in `0.workspace.js` and if we need to ask for more values
#       we should advertise a descriptor that `0.workspace.js` can pull in.
#        # @source http://stackoverflow.com/q/918886/330439
#        function reverse_hostname {
#            local ret
#            local arr=$(echo $1 | tr "." "\n")
#            for x in $arr; do
#                ret="$x.$ret"
#            done
#            echo "${ret}" | sed 's/.$//'
#        }
#        BO_sourcePrototype "$Z0_ROOT/lib/bash.origin.prompt/bash.origin.prompt"
#        NAMESPACE="$(basename $Z0_WORKSPACE_DIRPATH)"
#        HOSTNAME="$(reverse_hostname $NAMESPACE)"
#        askForInput "HOSTNAME" "Project hostname" "$HOSTNAME"
#        NAMESPACE="$(reverse_hostname $HOSTNAME)"

		if [ -z "$Z0_PROJECT_DIRPATH" ]; then
			echo "ERROR: 'Z0_PROJECT_DIRPATH' environment variable not set!"
			exit 1
		fi
		if [ -z "$Z0_WORKSPACE_DIRPATH" ]; then
			echo "ERROR: 'Z0_WORKSPACE_DIRPATH' environment variable not set!"
			exit 1
		fi
		if [ -z "$Z0_WORKSPACE_HOSTNAME" ]; then
			echo "ERROR: 'Z0_WORKSPACE_HOSTNAME' environment variable not set!"
			exit 1
		fi
		if [ -z "$Z0_WORKSPACE_NAMESPACE" ]; then
			echo "ERROR: 'Z0_WORKSPACE_NAMESPACE' environment variable not set!"
			exit 1
		fi
		if [ -z "$Z0_REPOSITORY_URL" ]; then
			echo "ERROR: 'Z0_REPOSITORY_URL' environment variable not set!"
			exit 1
		fi
		if [ -z "$Z0_REPOSITORY_COMMIT_ISH" ]; then
			echo "ERROR: 'Z0_REPOSITORY_COMMIT_ISH' environment variable not set!"
			exit 1
		fi
		BO_log "$VERBOSE" "Z0_WORKSPACE_DIRPATH: $Z0_WORKSPACE_DIRPATH"
		BO_log "$VERBOSE" "Z0_WORKSPACE_HOSTNAME: $Z0_WORKSPACE_HOSTNAME"
		BO_log "$VERBOSE" "Z0_WORKSPACE_NAMESPACE: $Z0_WORKSPACE_NAMESPACE"
		BO_log "$VERBOSE" "Z0_REPOSITORY_URL: $Z0_REPOSITORY_URL"
		BO_log "$VERBOSE" "Z0_REPOSITORY_COMMIT_ISH: $Z0_REPOSITORY_COMMIT_ISH"


		# If project is not yet a git repository we make it one.
		if [ ! -e "$Z0_PROJECT_DIRPATH/.git" ]; then
			pushd "$Z0_PROJECT_DIRPATH" > /dev/null
				git init
			popd > /dev/null
		fi

		# NOTE: We assume that we will not destroy anything by just copying our template files.
		# TODO: Use sourcemint lib to copy files.

		# Copy files
		BO_log "$VERBOSE" "Copying files from '$TEMPLATE_BASE_PATH' to '$Z0_WORKSPACE_DIRPATH' ..."
		pushd "$TEMPLATE_BASE_PATH" > /dev/null
			tar cf - .[a-zA-Z0-9]* * | ( cd "$Z0_WORKSPACE_DIRPATH"; tar xfp -)
		popd > /dev/null

		# Replace variables
		function replaceInFile {
            local search="%%$1%%"
            local replace=$2
            sed -i "" "s|${search}|${replace}|g" "$Z0_WORKSPACE_DIRPATH/$3"
		}
		replaceInFile "Z0_WORKSPACE_NAMESPACE" "$Z0_WORKSPACE_NAMESPACE" "stack.ccjson"
		replaceInFile "Z0_WORKSPACE_HOSTNAME" "$Z0_WORKSPACE_HOSTNAME" "stack.ccjson"
		replaceInFile "Z0_WORKSPACE_NAMESPACE" "$Z0_WORKSPACE_NAMESPACE" "package.json"
		replaceInFile "Z0_REPOSITORY_URL" "$Z0_REPOSITORY_URL" "package.json"
		replaceInFile "Z0_REPOSITORY_COMMIT_ISH" "$Z0_REPOSITORY_COMMIT_ISH" "package.json"


		if [ "$Z0_PROJECT_AUTO_COMMIT_CHANGES" == "1" ]; then
			pushd "$Z0_PROJECT_DIRPATH" > /dev/null
	            git_commitChanges "Initialized Zero System workspace";
			popd > /dev/null
		fi

		BO_format "$VERBOSE" "FOOTER"
	}

}
init $@