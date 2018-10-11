#!/bin/sh

orig_dir=$(pwd)
cd project-ui-loading && \
	npm install && \
	npm run build

cd $orig_dir

cd project-ui-landing && \
	npm install && \
	npm run build

cd $orig_dir

echo $(pwd)

if [ -d ./ui-loading ]; then
	rm -rf ./ui-loading
fi

if [ -d ./ui-landing ]; then
	rm -rf ./ui-landing
fi

mv project-ui-loading/build ./ui-loading
mv project-ui-landing/build ./ui-landing
