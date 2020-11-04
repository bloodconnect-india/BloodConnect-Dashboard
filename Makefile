build:
	node_modules/.bin/react-scripts build
	rm -f docs/index-v*
	node update-app-html.js
	mkdir -p docs/static
	mkdir -p docs/static/js
	mkdir -p docs/static/css
	rm -f docs/static/js/*.js
	cp build/static/js/*.js docs/static/js
	cp build/static/js/*.js.map docs/static/js
	rm -f docs/static/css/*.css
	cp build/static/css/*.css docs/static/css
	rm -rf build

.PHONY: build
