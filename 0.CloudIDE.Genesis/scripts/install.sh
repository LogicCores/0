#!/bin/bash -e
if [ -z "$npm_config_argv" ]; then
	echo "ERROR: Must run with 'npm install'!"
	exit 1
fi
if [ -z "$HOME" ]; then
	echo "ERROR: 'HOME' environment variable is not set!"
	exit 1
fi

# Bootstrap 'bash.origin' from ZeroSystem
if [ ! -z "$VERBOSE" ]; then
	pwd
	ls -al
fi
# @source https://github.com/bash-origin/bash.origin/blob/404e6ae62560e2ee1d375bc874f0d9314cdbaa92/bash.origin#L199-L225
function BO_followPointer {
	# @source https://github.com/bash-origin/bash.origin/blob/404e6ae62560e2ee1d375bc874f0d9314cdbaa92/bash.origin#L36-L40
	function BO_setResult {
		local  __resultvar=$1
	    eval $__resultvar="'$2'"
		return 0
	}
	# @source https://github.com/bash-origin/bash.origin/blob/404e6ae62560e2ee1d375bc874f0d9314cdbaa92/bash.origin#L171-L173
	function BO_has {
	  	type "$1" > /dev/null 2>&1
	}
	# @source https://github.com/bash-origin/bash.origin/blob/404e6ae62560e2ee1d375bc874f0d9314cdbaa92/bash.origin#L227-L250
	function BO_realpath {
		if BO_has "realpath"; then
			BO_setResult "$1" "$(realpath "$2")"
		else
			# @source http://stackoverflow.com/a/19512992/330439
			function abspath() {
			    # generate absolute path from relative path
			    # $1     : relative filename
			    # return : absolute path
			    if [ -d "$1" ]; then
			        # dir
			        (cd "$1"; pwd)
			    elif [ -f "$1" ]; then
			        # file
			        if [[ $1 == */* ]]; then
			            echo "$(cd "${1%/*}"; pwd)/${1##*/}"
			        else
			            echo "$(pwd)/$1"
			        fi
			    fi
			}
			BO_setResult "$1" "`abspath "$2"`"
		fi
	}
	_POINTER_RESULT_VAR="$1"
	_POINTER_LOOKUP_FILENAME="$3"
	_POINTER_RESOLVED="0"
	function checkPath {
		if [ -d "$1/$_POINTER_LOOKUP_FILENAME" ]; then
			checkPath "$1/$_POINTER_LOOKUP_FILENAME"
		elif [ -e "$1/$_POINTER_LOOKUP_FILENAME" ]; then
			POINTER_VALUE=`cat $1/$_POINTER_LOOKUP_FILENAME`
			if [ "$POINTER_VALUE" == "." ]; then
				BO_realpath "$_POINTER_RESULT_VAR" "$1"
				_POINTER_RESOLVED="1"
			else
				checkPath "$1/$POINTER_VALUE"
			fi
		fi
	}
	checkPath "$2"
	if [ "$_POINTER_RESOLVED" == "0" ]; then
		echo "ERROR: Could not resolve pointer '$_POINTER_LOOKUP_FILENAME' for path '$2'"
		exit 1;
	fi
}
BO_followPointer "Z0_ROOT" "$PWD" ".0"
pushd "$Z0_ROOT"
	if [ ! -z "$VERBOSE" ]; then
		pwd
		ls -al
	fi
	git submodule update --init --rebase lib/bash.origin || true
	lib/bash.origin/bash.origin BO install
popd

# Source https://github.com/bash-origin/bash.origin
. "$HOME/.bash.origin"
function init {
	eval BO_SELF_BASH_SOURCE="$BO_READ_SELF_BASH_SOURCE"
	BO_deriveSelfDir ___TMP___ "$BO_SELF_BASH_SOURCE"
	local __BO_DIR__="$___TMP___"


    BO_sourcePrototype "$__BO_DIR__/activate.sh"


	function Install {
		BO_format "$VERBOSE" "HEADER" "Installing system ..."


		pushd "$Z0_ROOT" > /dev/null
			BO_format "$VERBOSE" "Ensuring ZeroSystem is installed ..."
		    npm install
		popd > /dev/null


		if [ -f ".gitmodules" ]; then
			if [ ! -f ".gitmodules.initialized" ]; then
				echo "Init submodules ..."
				git submodule update --init --recursive --rebase || true
				touch ".gitmodules.initialized"
			fi
		fi


		if [ "$NO_WORKSPACE_DIR_INSTALL" != "1" ]; then
			pushd "$WORKSPACE_DIR" > /dev/null

			    BO_log "$VERBOSE" "WORKSPACE_DIR: $WORKSPACE_DIR"
				BO_log "$VERBOSE" "PWD: $PWD"

				if [ -e "scripts/install.sh" ]; then
					BO_log "$VERBOSE" "Calling workspace install script '$WORKSPACE_DIR/scripts/install.sh' ..."
	
					"scripts/install.sh" $@
				fi

			popd > /dev/null
		fi

		BO_format "$VERBOSE" "FOOTER"
	}

	Install $@

}
init $@