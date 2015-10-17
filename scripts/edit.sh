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


	BO_log "$VERBOSE" "PWD: $PWD"


	# TODO: Use 'ccjson-for-bash' to get config variables.

	GIT_CACHE_DIR="$Z0_ROOT/.cache/git"
	if [ ! -e "$GIT_CACHE_DIR" ]; then
		mkdir "$GIT_CACHE_DIR"
	fi

	if [ -z "$EDITOR_PORT" ]; then
		EDITOR_PORT="8181"
	fi


	# TODO: Do all startup init here using 'PIO_PROFILE_SECRET' and issue
	#       temporary access keys for runtime

	# This variable must not be used from now on
	export PIO_PROFILE_SECRET=""


	# TODO: Support other editors
    BO_sourcePrototype "$Z0_ROOT/cores/edit/for/c9/edit.proto.sh"


	"$Z0_ROOT/0.devcomp.genesis/Plugins/io.c9/0.devcomp-for-cloud9/build.sh"
	ensurePlugin "0.devcomp-for-cloud9" "$Z0_ROOT/0.devcomp.genesis/Plugins/io.c9/0.devcomp-for-cloud9"
	# TODO: Get URL and invite token from config.
	ensurePluginSetting "0.devcomp-panel-left" "@url" "http://127.0.0.1:8090/0/dev-73EFF412-420F-4906-8BF5-EA0D842B86AC/Panels/IDE-Left?invite=E4AA8653-9AFD-41E3-A543-9D3B961E87EF"
	ensurePluginSetting "0.devcomp-panel-right" "@url" "http://127.0.0.1:8090/0/dev-73EFF412-420F-4906-8BF5-EA0D842B86AC/Panels/IDE-Right?invite=E4AA8653-9AFD-41E3-A543-9D3B961E87EF"
	launchEditor $@
}
init $@