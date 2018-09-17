#!/bin/sh

orig_dir=$(pwd)
cd ui && \
	npm install && \
	npm run build

cd $orig_dir

echo $(pwd)

if [ -d ./build ]; then
	rm -rf ./build
fi

mv ui/build ./build
