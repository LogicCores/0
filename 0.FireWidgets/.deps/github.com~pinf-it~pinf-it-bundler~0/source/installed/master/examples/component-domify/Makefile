
install:
	@if [ ! -d "app" ]; then \
		git clone git@github.com:component/domify.git app; \
		cd app; \
		make; \
	fi

run:
	cd app; open test/index.html

.PHONY: install run
