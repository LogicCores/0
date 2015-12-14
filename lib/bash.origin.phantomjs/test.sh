#!/bin/bash -e
# Source https://github.com/cadorn/bash.origin
"node_modules/bash.origin/bash.origin" BO install
. "$HOME/.bash.origin"
function init {
	eval BO_SELF_BASH_SOURCE="$BO_READ_SELF_BASH_SOURCE"
	BO_deriveSelfDir ___TMP___ "$BO_SELF_BASH_SOURCE"
	local __BO_DIR__="$___TMP___"


	function Test {
		
		VERSION=`BO_callPlugin "$__BO_DIR__/bash.origin.phantomjs" run "--version"`

		# TODO: Us something like https://github.com/lehmannro/assert.sh

		if [ "$VERSION" != "2.0.0" ]; then
			echo "ERROR: Got version '$VERSION' while we were looking for '2.0.0'"

			if [ ! -z "$CIRCLE_TEST_REPORTS" ]; then
				echo '<testsuite tests="1">
    <testcase classname="Test" name="TestVersion">
        <failure message="Got version $VERSION while we were looking for 2.0.0"></failure>
    </testcase>
</testsuite>' > "$CIRCLE_TEST_REPORTS/bash.xml"
			fi

			exit 1;
		fi

		echo "OK"
		
		if [ ! -z "$CIRCLE_TEST_REPORTS" ]; then
			echo '<testsuite tests="1">
    <testcase classname="Test" name="TestVersion">
    </testcase>
</testsuite>' > "$CIRCLE_TEST_REPORTS/bash.xml"
		fi

	}

	Test $@
}
init $@