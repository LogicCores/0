#!/bin/bash -e
if [ -z "$npm_config_argv" ]; then
	echo "ERROR: Must run with 'npm install'!"
	exit 1
fi
if [ -z "$HOME" ]; then
	echo "ERROR: 'HOME' environment variable is not set!"
	exit 1
fi
WORKSPACE_DIR="$PWD"


pushd "$WORKSPACE_DIR" > /dev/null
	if [ -f ".gitmodules" ]; then
		if [ ! -f ".gitmodules.initialized" ]; then
			echo "Init submodules ..."
			git submodule update --init --recursive --rebase
			touch ".gitmodules.initialized"
		fi
	fi

	lib/bash.origin/bash.origin BO install

popd > /dev/null


# Source https://github.com/bash-origin/bash.origin
. "$HOME/.bash.origin"
function init {
	eval BO_SELF_BASH_SOURCE="$BO_READ_SELF_BASH_SOURCE"
	BO_deriveSelfDir ___TMP___ "$BO_SELF_BASH_SOURCE"
	local __BO_DIR__="$___TMP___"

    BO_sourcePrototype "$__BO_DIR__/activate.sh"


	function ReInstall {
		Install "reinstall"
	}

	function Install {
		BO_format "$VERBOSE" "HEADER" "Installing 0 ..."

		# TODO: Install declared and used dependencies by scanning source

		pushd "$__BO_DIR__/../Library" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
				pushd "node_modules/node-forge" > /dev/null
					# This will install dev dependencies for the whole dep tree!
					#npm install --dev
				    npm install almond
				    npm install requirejs
		        	npm run minify
				popd > /dev/null
	       	fi
		popd > /dev/null

		pushd "$__BO_DIR__/../Polyfills" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$__BO_DIR__/../cores/auth/for/passport" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$__BO_DIR__/../cores/responder/for/express" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$__BO_DIR__/../cores/session/for/express.fs" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$__BO_DIR__/../cores/invite/for/cookie" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$__BO_DIR__/../cores/edit/for/c9" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$__BO_DIR__/../cores/static/for/send" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$__BO_DIR__/../cores/proxy/for/smi.cache" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$__BO_DIR__/../cores/skin/for/semantic-ui" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$__BO_DIR__/../cores/skin/for/sm.hoist.VisualComponents" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$__BO_DIR__/../cores/data/for/knexjs" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$__BO_DIR__/../cores/data/for/bookshelf" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$__BO_DIR__/../cores/data/for/nedb" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$__BO_DIR__/../cores/export/for/babel" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$__BO_DIR__/../cores/export/for/bower" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$__BO_DIR__/../cores/export/for/sm.hoist.VisualComponents" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$__BO_DIR__/../cores/export/for/browserify" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$__BO_DIR__/../cores/export/for/webpack" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$__BO_DIR__/../cores/export/for/defs" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$__BO_DIR__/../cores/export/for/webpack" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$__BO_DIR__/../cores/boundary/for/github" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$__BO_DIR__/../cores/template/for/virtual-dom" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$__BO_DIR__/../cores/test/for/intern" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$__BO_DIR__/../cores/page/for/page" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$__BO_DIR__/../cores/page/for/firewidgets" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$__BO_DIR__/../cores/load/for/systemjs" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$__BO_DIR__/../cores/load/for/requirejs" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$__BO_DIR__/../cores/transform/for/marked" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$__BO_DIR__/../lib/smi.cache" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$__BO_DIR__/../lib/sm.hoist.VisualComponents" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$__BO_DIR__/../lib/ccjson" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$__BO_DIR__/../lib/cvdom" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$__BO_DIR__/../lib/pio.profile" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$__BO_DIR__/../lib/html2chscript" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$__BO_DIR__/../lib/marked" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$__BO_DIR__/../lib/smi.0" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$__BO_DIR__/../lib/html2chscript-for-webpack" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		"$__BO_DIR__/../lib/pio.profile/bin/install-pre-commit-hook" \
			"$__BO_DIR__/pre-commit.sh"

		BO_format "$VERBOSE" "FOOTER"
	}


	# TODO: Do all startup init here using 'PIO_PROFILE_SECRET' and issue
	#       temporary access keys for runtime


	# This variable must not be used from now on
	export PIO_PROFILE_SECRET=""

	Install $@


	# TODO: Run install scripts based on declared stacks instead of hardcoding here
    BO_sourcePrototype "$__BO_DIR__/../0.stack.test/scripts/install.sh"
	Install $@

}
init $@