#!/bin/bash -e
if [ -z "$npm_config_argv" ]; then
	echo "ERROR: Must run with 'npm install'!"
	exit 1
fi
if [ -z "$HOME" ]; then
	echo "ERROR: 'HOME' environment variable is not set!"
	exit 1
fi

if [ -f ".gitmodules" ]; then
	if [ ! -f ".gitmodules.initialized" ]; then
		echo "Init submodules ..."
		git submodule update --init --recursive --rebase || true
		touch ".gitmodules.initialized"
	fi
fi

if [ -e "lib/bash.origin/bash.origin" ]; then
	lib/bash.origin/bash.origin BO install
fi

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

		BO_log "$VERBOSE" "PWD: $PWD"


		pushd "$Z0_ROOT/Library" > /dev/null
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

		pushd "$Z0_ROOT/Polyfills" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$Z0_ROOT/cores/auth/for/passport" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$Z0_ROOT/cores/responder/for/express" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$Z0_ROOT/cores/session/for/express.fs" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$Z0_ROOT/cores/invite/for/cookie" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$Z0_ROOT/cores/edit/for/c9" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$Z0_ROOT/cores/static/for/send" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$Z0_ROOT/cores/proxy/for/smi.cache" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$Z0_ROOT/cores/skin/for/semantic-ui" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$Z0_ROOT/cores/skin/for/sm.hoist.VisualComponents" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$Z0_ROOT/cores/data/for/knexjs" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$Z0_ROOT/cores/data/for/bookshelf" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$Z0_ROOT/cores/data/for/nedb" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$Z0_ROOT/cores/export/for/babel" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$Z0_ROOT/cores/export/for/bower" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$Z0_ROOT/cores/export/for/sm.hoist.VisualComponents" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$Z0_ROOT/cores/export/for/browserify" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$Z0_ROOT/cores/export/for/webpack" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$Z0_ROOT/cores/export/for/defs" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$Z0_ROOT/cores/export/for/webpack" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$Z0_ROOT/cores/boundary/for/github" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$Z0_ROOT/cores/template/for/virtual-dom" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$Z0_ROOT/cores/test/for/intern" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$Z0_ROOT/cores/page/for/page" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$Z0_ROOT/cores/page/for/firewidgets" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$Z0_ROOT/cores/load/for/systemjs" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$Z0_ROOT/cores/load/for/requirejs" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$Z0_ROOT/cores/transform/for/marked" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$Z0_ROOT/lib/smi.cache" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$Z0_ROOT/lib/sm.hoist.VisualComponents" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$Z0_ROOT/lib/ccjson" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$Z0_ROOT/lib/cvdom" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "$Z0_ROOT/lib/pio.profile" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$Z0_ROOT/lib/html2chscript" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$Z0_ROOT/lib/marked" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$Z0_ROOT/lib/smi.0" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "$Z0_ROOT/lib/html2chscript-for-webpack" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null


		pushd "$Z0_ROOT/lib/smi-for-git" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
		pushd "$Z0_ROOT/lib/smi-for-npm" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
		pushd "$Z0_ROOT/lib/sm.expand" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	mkdir node_modules
	        	ln -s ../../smi-for-git node_modules
	        	ln -s ../../smi-for-npm node_modules
	        	npm install
	       	fi
		popd > /dev/null



		if [ -e ".git" ]; then
			"$Z0_ROOT/lib/pio.profile/bin/install-pre-commit-hook" \
				"$__BO_DIR__/pre-commit.sh"
		fi

		BO_format "$VERBOSE" "FOOTER"
	}


	# TODO: Do all startup init here using 'PIO_PROFILE_SECRET' and issue
	#       temporary access keys for runtime


	# This variable must not be used from now on
	export PIO_PROFILE_SECRET=""

	Install $@

	# TODO: Run install scripts based on declared stacks instead of hardcoding here
    BO_sourcePrototype "$Z0_ROOT/0.FireWidgets/scripts/install.sh"
	Install $@
    BO_sourcePrototype "$Z0_ROOT/0.stack.test/scripts/install.sh"
	Install $@

}
init $@