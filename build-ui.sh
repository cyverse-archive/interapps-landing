#!/bin/sh

orig_dir=$(pwd)
cd client-loading && \
	npm install && \
	npm run build

cd $orig_dir

cd client-landing && \
	npm install && \
	npm run build

cd $orig_dir

echo $(pwd)

if [ -d ./build/loading ]; then
rm -rf ./build/loading
fi

if [ -d ./build/landing ]; then
	rm -rf ./build/landing
fi

mv client-loading/build ./build/loading
mv client-landing/build ./build/landing
