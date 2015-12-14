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


	function Test {
		BO_format "$VERBOSE" "HEADER" "Testing ..."


		rm -Rf "$Z0_ROOT/0.stack.test/.cache/test.intern.result" > /dev/null || true


		"$__BO_DIR__/run-job.sh" "0.job.test" $@


		# TODO: Relocate into 'cores/container/circle-ci'
		if [ ! -z "$CIRCLE_TEST_REPORTS" ] && [ -e "$Z0_ROOT/0.stack.test/.cache/test.intern.result" ] ; then
			cp -Rf $Z0_ROOT/0.stack.test/.cache/test.intern.result/*.report.xml "${CIRCLE_TEST_REPORTS}/"
		fi


		BO_format "$VERBOSE" "FOOTER"
	}


	# TODO: Do all startup init here using 'PIO_PROFILE_SECRET' and issue
	#       temporary access keys for runtime


	# This variable must not be used from now on
#	export PIO_PROFILE_SECRET=""

	Test $@
}
init $@