setup: init rebuild
reset: clean install
rebuild: install build
rebuild-clean: reset build

init:
	([ ! -e .git/hooks/pre-push ] || rm .git/hooks/pre-push) && ln -s ../../bin/pre-push .git/hooks

clean:
	[ ! -d lib ] || find lib -type f \( -iname \*.js -o -iname \*.d.ts \) -delete
	[ ! -d node_modules ] || rm -rf node_modules

build:
	npm run build

install:
	npm install

audit:
	npm audit

test:
	npm test

lint:
	npm run lint

fix:
	npm run lint:fix

ci: audit rebuild test

doc: build
	npm run doc

.PHONY: setup reset rebuild rebuild-clean init clean build install audit test lint fix ci doc
