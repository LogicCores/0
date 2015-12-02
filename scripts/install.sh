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


	function Unpack {
		BO_format "$VERBOSE" "HEADER" "Unpacking 0 ..."

		BO_log "$VERBOSE" "PWD: $PWD"

		pushd "$__BO_DIR__/../lib/node.pack" > /dev/null
	        if [ ! -e "node_modules" ]; then
	        	npm install
	       	fi
		popd > /dev/null

	    BO_sourcePrototype "$Z0_ROOT/lib/node.pack/node.unpack.proto.sh"

		node.unpack.dependencies.exists "PACK_EXISTS"

		if [ "$PACK_EXISTS" == "1" ]; then

			BO_log "$VERBOSE" "Packed dependencies found remotely. Downloading and extracting ..."

			# Remove any packages already installed by now.
			# NOTE: We do NOT remove our `node.pack` dependencies and ignore extracting them
			#       from the archive if there is overlap.
			# TODO: Instead of using `node.pack` to unpack archives, use `node.unpack` which
			#       should be a minimal package used to download and provision packed archives
			#       and should be comitted to source or downloaded separately and not be part of the pack.
			rm -Rf node_modules || true

			# Unpack the dependencies from a downloaded archive
			node.unpack "dependencies"

			BO_setResult "$1" "1"
		else
			BO_log "$VERBOSE" "No packed dependencies found remotely. Installing from source."
			BO_setResult "$1" "0"
		fi

		BO_format "$VERBOSE" "FOOTER"
	}

	function ReInstall {
		Install "reinstall"
	}

	function Install {
		BO_format "$VERBOSE" "HEADER" "Installing 0 ..."

		# TODO: Install declared and used dependencies by scanning source

		BO_log "$VERBOSE" "PWD: $PWD"
		BO_log "$VERBOSE" "Z0_ROOT: $Z0_ROOT"


		pushd "cores/export/for/bower" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "lib/virtual-dom" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "Library" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	mkdir node_modules
	        	ln -s ../../lib/virtual-dom node_modules/virtual-dom
	        	npm install
				pushd "node_modules/node-forge" > /dev/null
					# This will install dev dependencies for the whole dep tree!
					#npm install --dev
				    npm install almond
				    npm install requirejs
		        	npm run minify
				popd > /dev/null
	       	fi
	        if [ ! -e "bower_components" ] || [ "$1" == "reinstall" ]; then
				"$Z0_ROOT/cores/export/for/bower/node_modules/.bin/bower" install --allow-root --config.interactive=false
	       	fi
		popd > /dev/null

		pushd "Polyfills" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "cores/auth/for/passport" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "cores/responder/for/express" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "cores/email/for/mandrill" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "cores/sms/for/twilio" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "cores/session/for/express.fs" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "cores/invite/for/cookie" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "cores/edit/for/c9" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "cores/static/for/send" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "cores/proxy/for/smi.cache" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "cores/skin/for/semantic-ui" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "cores/data/for/knexjs" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "cores/data/for/bookshelf" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "cores/data/for/io.orchestrate" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "cores/data/for/nedb" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "cores/export/for/babel" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "cores/export/for/sm.hoist.VisualComponents" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "cores/export/for/browserify" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "cores/export/for/webpack" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "cores/export/for/defs" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "cores/export/for/webpack" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "cores/template/for/virtual-dom" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "cores/test/for/intern" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "cores/page/for/page" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "cores/page/for/firewidgets" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "cores/load/for/systemjs" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "cores/load/for/requirejs" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
	
		pushd "cores/transform/for/marked" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "lib/bash.origin.prompt" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "lib/smi.cache" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "lib/console-trace" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "lib/ccjson" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "lib/html2chscript" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "lib/cvdom" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	mkdir node_modules
	        	ln -s ../../html2chscript node_modules/html2chscript
	        	ln -s ../../virtual-dom node_modules/virtual-dom
	        	npm install
	       	fi
		popd > /dev/null

		pushd "lib/sm.hoist.VisualComponents" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	mkdir node_modules
	        	ln -s ../../cvdom node_modules/cvdom
	        	npm install
	       	fi
		popd > /dev/null

		pushd "lib/pio.profile" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "lib/marked" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "lib/smi.0" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "lib/html2chscript-for-webpack" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "lib/node.pack" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null

		pushd "lib/smi-for-git" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
		pushd "lib/smi-for-npm" > /dev/null
	        if [ ! -e "node_modules" ] || [ "$1" == "reinstall" ]; then
	        	npm install
	       	fi
		popd > /dev/null
		pushd "lib/sm.expand" > /dev/null
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


		export BO_GLOBAL_SYSTEM_CACHE_DIR=""

		# TODO: Run install scripts based on declared stacks instead of hardcoding here
	    BO_sourcePrototype "$Z0_ROOT/0.FireWidgets/scripts/install.sh"
		Install $@
	    BO_sourcePrototype "$Z0_ROOT/0.stack.test/scripts/install.sh"
		Install $@


		BO_format "$VERBOSE" "FOOTER"
	}


	# TODO: Do all startup init here using 'PIO_PROFILE_SECRET' and issue
	#       temporary access keys for runtime


	# This variable must not be used from now on
	export PIO_PROFILE_SECRET=""


	Unpack "UNPACKED" $@

	if [ "$UNPACKED" == "0" ]; then
		# We did not unpack dependencies so we need to install from source.
		Install $@

		touch ".installed"

		if [ "$Z0_TRIGGER_POSTINSTALL_BUNDLE" == "1" ]; then
			# Now that we installed from source we try and bundle the dependencies
			# so that other installations can use the bundled dependencies.
			"$__BO_DIR__/bundle.sh"
		fi
	else
		touch ".installed"
	fi
}
init $@
