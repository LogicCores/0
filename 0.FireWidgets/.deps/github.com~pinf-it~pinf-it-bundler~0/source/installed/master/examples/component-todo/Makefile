
install:
	@if [ ! -d "app" ]; then \
		git clone git@github.com:component/todo.git app; \
		cd app; \
		npm install; \
		make; \
	fi

run:
	cd app; node app

.PHONY: install run
