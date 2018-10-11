#!/bin/sh

orig_dir=$(pwd)
cd project-ui-loading && \
	npm install && \
	npm run build

cd $orig_dir

echo $(pwd)

if [ -d ./ui-loading ]; then
	rm -rf ./ui-loading
fi

mv project-ui-loading/build ./ui-loading
