
install:
	@if [ ! -d "app" ]; then \
		git clone git@github.com:component/tip.git app; \
		cd app; \
		npm install; \
		make; \
	fi

run:
	cd app; open test/index.html

.PHONY: install run
